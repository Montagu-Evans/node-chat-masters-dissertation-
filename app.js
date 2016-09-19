var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var csrf = require('csurf');
var morgan = require('morgan');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 1338;

var routes;

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public/scripts'));
app.use(express.static(__dirname + '/public/images'));

app.set('view engine', 'ejs');
app.set('view engine', 'jade');
app.set('views', __dirname + '/public/views');
//if you run jade, to prettify code when inspecting html use:
app.locals.pretty = true;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
	cookieName: 'session',
	secret: process.env.SESSION_SECRET || 'secret',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	httpOnly: true, //don't let browser js access cookies ever
	secure: true, //only use cookies over https
	ephemeral: true, //delete this cookie when the browser is closed
}));

app.use(csrf());
routes = require('./public/routes/routing')(app);

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('new message', function (data) {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

server.listen(port);
console.log("Server is now listening on port " + port);