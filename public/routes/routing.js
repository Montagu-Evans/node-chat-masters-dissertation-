
var express = require('express');
var mongoose = require('mongoose');
var csrf = require('csurf');
var bcrypt = require('bcryptjs');
var app = express.Router();

mongoose.connect('mongodb://localhost/examen');

module.exports = function(app) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var User = mongoose.model('User', new Schema({
		id: ObjectId,
		firstName: String,
		lastName: String,
		email: { type: String, unique: true },
		password: String
	}));

	app.get('/', function(req,res) {
		res.redirect('register');
	});

	app.get('/register', function(req,res) {
		res.render('register.jade', { csrfToken: req.csrfToken() });
	});
	
	app.post('/register', function(req,res) {
		var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

		var user = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hash
		});
		user.save(function(err) {
			if(err) {
				var err = 'Ooops, something went wrong! Try again';
				if(err.code === 11000) {
					error = 'That email is already taken, try another';
				}
				res.render('register.jade', { error: error });
			} else {
				res.redirect('/login');
			}
		});
	});
	
	app.use(function(req,res,next) {
		if(req.session && req.session.user) {
			User.findOne({ email: req.session.user.email}, function(err, user) {
				if(user) {
					req.user = user;
					delete req.user.password;
					req.session.user = req.user;
					res.locals.user = req.user;
				}
				next();
			});
		} else {
			next();
		}
	});

	function requireLogin(req,res,next) {
		if(!req.user) {
			res.redirect('/login');
		} else {
			next();
		}
	}
	
	app.get('/login', function(req,res) {
		res.render('login.jade', {csrfToken: req.csrfToken() });
	});

	app.post('/login', function(req,res) {
		User.findOne({ email: req.body.email }, function(err, user) {
			if(!user) {
				res.render('login.jade', { error: 'Invalid email or password.' });
			} else {
				if(bcrypt.compareSync(req.body.password, user.password)) {
				req.session.user = user; //set-cookie: session=
				res.redirect('/dashboard');
			} else {
				res.render('login.jade', { error: 'Invalid email or password.' });
			}
		}
	});
	});
	app.get('/dashboard', requireLogin, function(req,res) {
		res.render('index.ejs');
	});
	app.get('/logout', function(req,res) {
		req.session.reset();
		res.redirect('/');
	});
}

