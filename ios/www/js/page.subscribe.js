function init() {
	
	/* preload images */
	preload(['.sign_man',
			 '.sign_woman_blank',
			 '.ico_cancel_glow',
			 '.ico_save_glow'
	]);
	
	/* animate man/woman signs */
	sign_switcher('#man', '#woman');
	
	/* preload images */

}

//already in page.index.js
function create_user(u) {
	
	if (u.email != '' && u.password != '' && u.profile.firstname != '' && u.profile.lastname != ''
	 && u.profile.birthdate != '' && u.profile.gender != '') {
		
		if (window.navigator.onLine) {
			var com = new Communication();
			com.user.set(u);
			var success = function() {
				if (!window.localStorage) {
					if (typeof debug != 'undefined' && debug) {
						console.log('no local storage available');
					}
				} else {
					localStorage.setItem('user', JSON.stringify(u));
				}
				window.location.href = 'index.html';
			},
			error = function() {
					alert('Server error creating user with email: ' + u.email + ' and password: ' + u.password);
			}
			com.user.create(success, error);
		} else {
			alert('offline');
		}
	} else {
		alert('select all fields');
	}
}

/* submit form from register button */
$('.ico_save').on(event_str.click, function() {
		$('.check').each(function() {
			var ico = $(this)
			var elem = ico.prev();
			if (elem.val() == '') {
				ico.removeClass().addClass('check check_need');
			}
		});
		var u = new User();
		u.email = $('#email').val();
		u.password = $('#password').val();
		u.profile.firstname = $('#firstname').val();
		u.profile.lastname = $('#lastname').val();
		u.profile.birthdate = $('#birthdate').val();
		u.profile.gender = $('#gender').val();
		u.filters.personality.relationship.gender = $('#gender').val() == 'man' ? 'woman' : 'man';
		create_user(u);
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
});

translate('home');