$(document).ready(function() {

	$('#register-form').validate({
		rules: {
			firstName: {
				required: true,
				pattern: /[a-zA-Z]+/
			},
			lastName: {
				required: true,
				pattern: /[a-zA-Z]+/
			},
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 2
			},
		},
		messages: {
			firstName: "Please enter your firstname",
			lastName: "Please enter your lastname",
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 2 characters long"
			}
		}
	});

	$('#login-form').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 2
			},
		},
		messages: {
			email: {
				required: "Please provide the given email"
			},
			password: {
				required: "Please provide the given password",
				minlength: "Your password must be at least 2 characters long"
			}
		}
	});

	$('#btn-register').click(function() {
		checking();
	});
	$('#btn-login').click(function() {
		checking();
	});

	function checking() {
		var empty = 0;
		$('input').each(function(){
			if (this.value == "") {
				empty++;
				$('#error').removeClass('display-none');
				$("#error").addClass('animated zoomIn');
				setTimeout(function(e) {
					$('#error').addClass('animated zoomOut');
					e.preventDefault();
				}, 3000);
			}
		});
	}
});