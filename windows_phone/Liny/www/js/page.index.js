if (window.localStorage && user != undefined && user.id != undefined && user.id != '') {
	$('#subscribe_landscape').css('display', 'none');
	$('#form_portrait').css('display', 'none');
	$('#notification').css('display', 'inline');
}

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
				topmenu_visibility();
				connect_visibility();
				user = localStorage.getItem('user');
				display_disabled_ico();
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

/* link subscribe button to subscribe form */
$('.subscribe').on(event_str.click, function(event) {
	if ($(window).width() <= 720) {
		$('#form_portrait').attr('action', 'subscribe.html');
	} else {
		$('.check').each(function() {
			var ico = $(this)
			var elem = ico.prev();
			if (elem.val() == '') {
				ico.removeClass().addClass('check check_need');
			}
		});
		var u = new User();
		u.email = $('#email').val();
		u.password = $('#subpassword').val();
		u.profile.firstname = $('#firstname').val();
		u.profile.lastname = $('#lastname').val();
		u.profile.birthdate = $('#birthdate').val();
		u.profile.gender = $('#gender').val();
		u.filters.personality.relationship.gender = $('#gender').val() == 'man' ? 'woman' : 'man';
		create_user(u);
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	}
});

function connect_visibility() {
	$('#subscribe_landscape').css('display', 'none');
	$('#form_portrait').css('display', 'none');
	$('#notification').css('display', 'inline');
}

/* resultbar */

function move_results(plus) {
	var val = $(window).width() <= 720 ? 60 : 120;
	var position = $('#results').position().left;
	$('#results').css({ 
		left: (plus ? position + val : position - val) + 'px'
	});
}

/* top button */
$('#button_resultBar_top').on(event_str.click, function() {
	move_results(false);
});

/* bot button */
$('#button_resultBar_bottom').on(event_str.click, function() {
	move_results(true);
});

$('#results').draggable({ 
	axis: 'x',
	start: function(event, ui) {
		$(this).css({
			'-webkit-transition-duration': '0s',
			'-moz-transition-duration': '0s'
		});
	},
	stop: function(event, ui) {
		$(this).css({
			'-webkit-transition-duration': '0.4s',
			'-moz-transition-duration': '0.4s'
		});
   }
});
			
/* animate man/woman signs */
sign_switcher('#man', '#woman');

/* animate man/woman signs. triggered by text */
sign_switcher('#man_text', '#woman_text');

$('#man').on(event_str.click, function() {
	var val = 'man';
	$('#gender').val(val);
	
	if (!window.localStorage) {
		if (typeof debug != 'undefined' && debug) {
			console.log('no local storage available');
		}
	} else {
		var user = JSON.parse(localStorage.getItem('user'));
		user.profile.gender = val;
		localStorage.setItem('user', user);
	}
	
	if (map != undefined) {
		map.clearUsers();
		var member = new User();
		var latitude = 48.84673; //dev
		var longitude = 2.3354;

		member.location.latitude = latitude - 0.004;
		member.location.longitude = longitude + 0.002;
		member.profile.firstname = 'Somegirl';
		member.profile.gender = 'woman';
		member.physique.color.skin = 'white';
		member.physique.color.hair = 'black';
		member.physique.color.eyes = 'blue';
		member.physique.size.hair = 'long';
		member.matchPercentage = 78;
		member.trustGauge = 2;
		member.info = 'test';
		map.addUser(member);
		map.make_map(latitude, longitude);
		map.DisplayMarkers();
		map.DisplayResultsBlocks();
	}

});

$('#woman').on(event_str.click, function() {
	var val = 'man';
	$('#gender').val(val);
	
	if (!window.localStorage) {
		if (typeof debug != 'undefined' && debug) {
			console.log('no local storage available');
		}
	} else {
		var user = JSON.parse(localStorage.getItem('user'));
		user.profile.gender = val;
		localStorage.setItem('user', user);
	}
	if (map != undefined) {
		map.clearUsers();
		var member = new User();
		var latitude = 48.84673; //dev
		var longitude = 2.3354;

		member.location.latitude = latitude + 0.004;
		member.location.longitude = longitude + 0.002;
		member.profile.firstname = 'Johnyboy';
		member.profile.gender = 'man';
		member.physique.color.skin = 'white';
		member.physique.color.hair = 'black';
		member.physique.color.eyes = 'blue';
		member.physique.size.hair = 'long';
		member.matchPercentage = 78;
		member.trustGauge = 2;
		member.info = 'test';
		map.addUser(member);
		map.make_map(latitude, longitude);
		map.DisplayMarkers();
		map.DisplayResultsBlocks();
	}
});

function place_users(latitude, longitude) {
	$('#loadmap p').hide();
	map = new Map();
	var member = new User();
	member.location.latitude = latitude + 0.002;
	member.location.longitude = longitude + 0.002;
	member.profile.firstname = 'martha';
	member.profile.gender = 'woman';
	member.physique.color.skin = 'white';
	member.physique.color.hair = 'black';
	member.physique.color.eyes = 'blue';
	member.physique.size.hair = 'long';
	member.matchPercentage = 41;
	member.trustGauge = 1;
	member.info = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sollicitudin commodo elementum';
	map.addUser(member);
	
	member = new User();
	member.location.latitude = latitude - 0.002;
	member.location.longitude = longitude + 0.002;
	member.profile.firstname = 'Jenny';
	member.profile.gender = 'woman';
	member.physique.color.skin = 'white';
	member.physique.color.hair = 'blond';
	member.physique.color.eyes = 'brown';
	member.physique.size.hair = 'medium';
	member.matchPercentage = 78;
	member.trustGauge = 2;
	member.info = 'test';
	map.addUser(member);
	
	map.DisplayResultsBlocks();
	map.make_map(latitude, longitude);
	map.DisplayMarkers();
}

/* -- entraine bug menu result si activé? pkoi?
$('#birthdate').blur(function() {
	if (!window.localStorage) {
	  if (typeof debug != 'undefined' && debug) {
			console.log('no local storage available');
		}
	} else {
		localStorage.setItem('age', $(this).val().toString());
	}
});*/

function init () {
			 
	/* preload images */
	preload(['preload_ico_search_glow',
			 'preload_ico_contacts_glow',
			 'preload_ico_filters_glow',
			 'preload_ico_profile_glow',
			 'preload_ico_history_glow',
			 'preload_ico_settings_glow',
			 '.sign_man',
			 '.sign_woman_blank',
			 '.preload_connect',
			 '.preload_subscribe'
	]);

						  
	//location detection without gps module
	var com = new Communication();
	com.user.getLocation_byIP(function(loc) {
		place_users(loc.latitude, loc.longitude);
	});
	
	if (navigator.geolocation) 
	{
		navigator.geolocation.getCurrentPosition(
			function (position) { 
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
				$('#mapNoGPS').css('display', 'none')
				place_users(latitude, longitude);
			}
		, function (e) {
			console.log('an error occured' + e.code);
		}, { timeout: 60000 });
	} else {
		if (typeof debug != 'undefined' && debug) {
			console.log('No GPS device found.');
		}
	}
	
	/* 
	 autre storage: database locale pr profile & co
	
	effet metro: 
	utiliser load, history et localstorage avec une frame css3	
	http://stackoverflow.com/questions/7468119/what-is-the-data-in-window-history-replacestate
	http://marcelsite.heroku.com/posts/9-Github-like-fancy-navigation-with-HTML5-and-the-history-object
	
	websockets
	webworkers - https://developer.mozilla.org/En/Using_web_workers
	pourrait etre cool a implementer avec fonction dans les settings stockée en
	 
	 
	var worker;
	hasWorker = function() {
			 return (typeof(Worker) != 'undefined');// ? true : false;
	};
	
	function detect_web_worker() {
		 return !!window.Worker;
	}
	
	barre de tchat
	
	 audio
	 https://developer.mozilla.org/En/HTML/Element/Audio
	 mater si besoin d'implementer http://docs.phonegap.com/en/1.5.0rc1/phonegap_media_media.md.html#Media
	 
	 add buttons overlay on map: fullscreen, amis position
	
	*/
}

function is_auth(response, info) {
	var accessToken = response.authResponse.accessToken;
	var u = new User();
	u.id = u.id;
	u.secret = accessToken;
	u.email = info.email;
	u.profile.firstname = info.first_name;
	u.profile.lastname = info.last_name;
	u.profile.birthdate = info.birthday;
	u.profile.gender = info.gender == 'male' ? 'man' : 'woman';
	u.filters.personality.relationship.gender = info.gender == 'male' ? 'woman' : 'man';
	create_user(u);
}

translate('home');

$('.bt_facebook').on(event_str.click, function(event) {
	FB.login(function(response) {
		if (response.authResponse) {
			FB.api('/me', function(info) {
				is_auth(response, info);
			});
		} else {
			//user cancelled login or did not grant authorization
		}
	}, {scope:'email,user_birthday'});/*,user_education_history,user_work_history,user_actions.music,user_about_me*/
	event.preventDefault();
});

var fb_api_id = '405747459487893'; // a encoder/decoder

window.fbAsyncInit = function() {
      FB.init({
		appId: fb_api_id,
          status: true,
		cookie: true,
		xfbml: true,
          oauth: true
	});

      function fb_isConnected(response) {
		if (response.status === 'connected') {
			//user is already logged in and connected
			FB.api('/me', function(info) {
				//is_auth(response, info);
			});
		}
      }

      // run once with current status and whenever the status changes
      FB.getLoginStatus(fb_isConnected);
      FB.Event.subscribe('auth.statusChange', fb_isConnected);
  };

		$('.bt_twitter').on(event_str.click, function() {
			var config = {
						consumerKey: '0hKMyCfXH0fZkRpmN80BmQ',
						consumerSecret: 'ASZAayyfqxCXmVizhznjl0blF4LumHIe9MXj56GWw'
					};
					var requestParams;
					var accessParams;

					var oauth = OAuth(config);

					oauth.get('http://twitter.com/oauth/request_token', function(data) {
							if (typeof debug != 'undefined' && debug) {
								console.log('Success ' + data.text);
							}
							//window.open('https://twitter.com/oauth/authorize?' + data.text);
							//requestParams = data.text;
					}, function(data) {
						if (typeof debug != 'undefined' && debug) {
		 					console.log('Something bad happened! :(');
						}
					});
		});
		
