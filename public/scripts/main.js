$(function() {
  var FADE_TIME = 300;
  var TYPING_TIMER_LENGTH = 400;
  var NORMAL_FADE_TIME = 1000;

  var IMAGES = [
  '1.png', '2.png', '3.png', '5.png', '6.png',
  '7.png', '8.png', '9.png', '10.png', '11.png', 
  '13.png', '14.png', '15.png', '16.png', '17.png',
  '18.png', '19.png', '20.png', '21.png', '22.png', 
  '23.png', '24.png', '26.png', '27.png', '28.png'
  ];

  $('.btn-send').click(function() {
    sendMessage();
  });

  $('.signout').click(function() {
    location.href='login';
  });

  // Initialisera variabler
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input för användare
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // Loginsidan
  var $chatPage = $('.chat.page'); // Chatsidan
  var $topMessageGreenColor = $('.green');
  var $div = $('.username');

  // En prompt för att sätta användarnamnet
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  socket = io();

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "1 participant online";
    } else {
      message += data.numUsers + " participants online";
    }
    log(message);
  }

  // Sätt användarnamnet
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // Om användaren är 'valid'
    if (username) {
      $loginPage.fadeOut();
      $chatPage.addClass('animated rotateIn');
      $chatPage.show();
      $topMessageGreenColor.addClass('animated rotateInDownRight');
      $topMessageGreenColor.show();
      $('.pages').removeClass('display-none');
      $('background-ul').removeClass('display-none');
      $loginPage.off('click');
      $currentInput.off('hover');
      $('.messages').addClass('display-none');
      $('.input-wrapper').addClass('display-none');
      setTimeout(function(){
        $('.messages').removeClass('display-none');
        $('.messages:first-child').addClass('animated fadeInLeft');
      }, 1000);

      setTimeout(function() {
        $('.input-wrapper').removeClass('display-none');
        $('.input-wrapper').addClass('zoomInDown');
      }, 2000);


   //Glöm ej denna för introt
    // $messages.addClass('messageIntro');

    $currentInput = $inputMessage.focus();

      // Berätta ditt användarnamn för servern
      socket.emit('add user', username);

      $(".bubble-signout").typed({
        strings: ["^1500 Me:^1500 World, do you think I'll pass the exam?^1000", "Because I'm wearing a stupid hat.^1500", "^1000 World:^1000 Meeh, you're fucked dawg..^1500", "Me:^1000 Hurray - Can't wait to die..", "World:^1000 Chill out cuz^1000", ".. I need a beer.. ^1000"], 
        stringsElement: null,
            // typing speed
            typeSpeed: 10,
            // time before typing starts
            startDelay: 0,
            // backspacing speed
            backSpeed: 0,
            // time before backspacing
            backDelay: 200,
            // loop
            loop: false,
            // false = infinite
            loopCount: false,
            // show cursor
            showCursor: false,
            // character for cursor
            cursorChar: "|",
            // attribute to type (null == text)
            attr: null,
            // either html or text
            contentType: 'html',
            // call when done callback function
            callback: function() {
              $('.bubble-signout').addClass('animated flipOutY');
              $('.bubble-signout').remove();
              setTimeout(function() {
                $('.profile').removeClass('display-none');
                $('.profile').addClass('animated flipInY');
                $('.signout-link').removeClass('display-none');
                $('.signout-link').addClass('animated flipInY');
                $('.email-link').removeClass('display-none');
                $('.email-link').addClass('animated flipInY');
              }, 1000);
            },
            // starting callback function before each string
            preStringTyped: function() {},
            //callback for every typed string
            onStringTyped: function() {

            },
            // callback for reset
            resetCallback: function() {
            }
          });
    }
  }

  function loop() {
    $("#balloon1").animate({top: "+=500"}, 15000);
    $("#balloon1").animate({top: "-=500"}, 15000, function() {
      loop();
    });
  }
  loop();

  setTimeout(function(){
   function loop2() {
    $("#balloon2").animate({top: "+=530", right: "+20px"}, 25000);
    $("#balloon2").animate({top: "-=200"}, 35001, function() {
      loop2();
    });
  }
  loop2();
}, 2000);

  $('#das-envelope span').click(function() {
    $('.containerr').addClass('animated hinge');
    setTimeout(function() {
      $('.containerr').remove();
      $('.left').remove();
      $('.pages').removeClass('display-none');
      $('.pages').addClass('animated zoomIn');
    }, 2200);
  });


  // Skkicka chatmeddelande
  function sendMessage () {
    var message = $inputMessage.val();
    var emoticons = {
      ":'(":  'fzhr_002',
      ":/":   'fzhr_003',
      ":)":   'fzhr_004',
      ":-)":  'fzhr_005',
      ":D":   'fzhr_006',
      ":d":   'fzhr_006',
      ":O":   'fzhr_007',
      ":o":   'fzhr_007',
      ":(":   'fzhr_008',
      ":P":   'fzhr_010',
      ":p":   'fzhr_010',
      ';)':   'fzhr_012',
      "(beer)": 'beericon',
      "(puke)": 'pukeicon',
      "(wh00t)": 'whaticon',
      "(griffin)": 'griffin',
      '(angry)': 'angry',
      '(boss)': 'boss',
      '(crybaby)': 'crybaby',
      '(fransman)': 'fransman',
      '(grumpy)': 'grumpy',
      '(hangover)': 'hangover',
      '(hungover)': 'hungover',
      'hehe': 'hehe',
      'illness': 'illness',
      'inlove': 'inlove',
      'mememe': 'mememe',
      '(näsblod)': 'näsblod',
      'piggy': 'piggy',
      '(sad)': 'sad',
      '(scream)': 'scream',
      '(sick)': 'sick',
      'spiderman': 'spiderman',
      '(supergrumpy)': 'supergrumpy',
      'whaat': 'whaat'

    }, regex = [];

    for(var emoticon in emoticons) {
    //escape everything!
    regex.push("("+emoticon.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")+")");
  }

  regex = new RegExp(regex.join("|"), "g");
  // console.log(regex);



  message = message.replace(regex, function(captured) {
    return "<img class='emoticons' src='/images/"+emoticons[captured]+".png'/>";
  });

    // Förhindra ifall markup injektas i meddelandet
    message = cleanInput(message);

    // Om det finss ett meddelande och en socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });

      
      // Säg till servern att exekvera 'new message' och skicka en parameter
      socket.emit('new message', message);
    }
  }

  // Logga ett meddelande
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }



  // Lägger till chatmeddelandet i messagelistan
  function addChatMessage (data, options) {
    // !Fadea in meddelandet om 'is typing' syns
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $randomImages = IMAGES[Math.abs(hashCode(data.username) % IMAGES.length)];

    var $usernameDiv = $('<span class="username"><img class="fade-in" src="/images/' + $randomImages + '">');
    var $messageBodyDiv = $('<span class="messageBody">')
    .html('<strong class="anotherFont">' + data.username + '</strong><br>' + data.message);

    var typingClass = data.typing ? 'is typing' : '';
    var $messageDiv = $('<li class="message"/>')
    .data('username', data.username)
    .addClass(typingClass)
    .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);

    console.log(hashCode(data.username) % IMAGES.length);
  }

  // Visa 'is typing' när en användare skriver
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing...';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Förhindrar injeced markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Uppdaterar typing-eventet
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Funktion för att displaya när en användare skriver. 'is typing...'
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  function hashCode(s) {
    var hash = 0, i, chr, len;
    if (s.length === 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
      chr   = s.charCodeAt(i);
      hash  = ((hash << 20) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }

    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  
  // Click events

  // Fokus på textinput oavsett vart på login page man klickar
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Fokus på input när man klickar på $inputMessage
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  
  // Socket events

  // När servern avger 'login', logga loginmeddelandet
  socket.on('login', function (data) {
    connected = true;

    // Displaya välkomstmeddelandet
    var message = "EC's Node.js Chat (Socket.IO) – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  //  När servern avger 'new message', uppdatera messageBody
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  //  När servern avger 'user joined', Logga det till messageBody
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // När servern avger 'user left', Logga det till messageBody
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // När servern avger 'typing', visa 'typing'-meddelandet
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // När servern avger 'stop typing' döda typing-meddelandet
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });
});