$(document).ready(function() {
	$(function(){
        $(".element").typed({
            strings: ["<h1 style='color: white'>Hi there!</h1>" + 
            "<br />" + 
            "<p style='color: white'>This chat application is made with node.js, express.js and socket.io"], 
            stringsElement: null,
            // typing speed
            typeSpeed: 0,
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

            },
            // starting callback function before each string
            preStringTyped: function() {
            },
            //callback for every typed string
            onStringTyped: function() {
             setTimeout(function() {
                $('.element').fadeOut('fast');
            }, 500);
             setTimeout(function() {
                $('.floating-background').removeClass('display-none');
                $('.floating-background').addClass('animated zoomIn');
            }, 1000);
         },
            // callback for reset
            resetCallback: function() {}
        });         
    });
});