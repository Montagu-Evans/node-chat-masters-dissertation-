$(document).ready(function() {
	$('.containerr').addClass('animated bounceInUp');
	$('.name').addClass('animated flipInY');
	$('#envelope').addClass('animated flipInY');
	$('.zoomInLeft').addClass('animated zoomInLeft');

	setTimeout(function() {
		$('.left').removeClass('display-none');
		$('.left').addClass('animated fadeInDownBig');
	}, 1000);

	setTimeout(function() {
		$('.avatar').removeClass('display-none');
		$('.avatar').addClass('animated zoomIn');
	}, 2000);

	$('.avatar').hover(function(){
		$('.avatar-hidden').removeClass('display-none');
		$(this).addClass('avatar-hidden');
		$('avatar-hidden').animate({ top: '-=200px' }, 1200, 'easeInOutBack');
	}, function(){
		$(this).removeClass('avatar-hidden');
		$('.avatar-hidden').addClass('display-none');
	});

	

	$('.btn-send').click(function() {
		appendInput();
		$('.message-input').val('');
	});

	$('.message-input').keypress(function(e){
		if(e.which == 13) {
			appendInput();
			$('.message-input').val('');
			return false;
		}
	});

	$('#balloon1').click(function(){
		$(this).addClass('animated zoomOutUp');
		$(this).remove();
	});

	$('#balloon2').click(function(){
		$(this).addClass('animated zoomOutUp');
		$(this).remove();
	});


	// setInterval(movePlane, 20);
	// var keys = {}

	// $(document).keydown(function(e) {
	// 	keys[e.keyCode] = true;
	// });

	// $(document).keyup(function(e) {
	// 	delete keys[e.keyCode];
	// });
});
function appendInput() {
	$('#content').append('<div>' + $('.message-input').val() + '</div>');
}


// setInterval(movePlane, 20);
// var keys = {}

// $(document).keydown(function(e) {
// 	keys[e.keyCode] = true;
// });

// $(document).keyup(function(e) {
// 	delete keys[e.keyCode];
// });


// function movePlane() {
// 	for (var direction in keys) {
// 		if (!keys.hasOwnProperty(direction)) continue;
// 		if (direction == 37) {
// 			$("#plane").animate({left: "-=5"}, 0);                
// 		}
// 		if (direction == 38) {
// 			$("#plane").animate({top: "-=5"}, 0);  
// 		}
// 		if (direction == 39) {
// 			$("#plane").animate({left: "+=5"}, 0);  
// 		}
// 		if (direction == 40) {
// 			$("#plane").animate({top: "+=5"}, 0);  
// 		}
// 	}
// }