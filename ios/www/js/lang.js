/**
 * @fileOverview internationalization
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

debug = true;

// return url params after '?'
function get_UrlParams() {
	var loc = $(location).attr('search'),
		objURL = {};

	loc.replace(
		new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
		function( $0, $1, $2, $3 ) {
			objURL[ $1 ] = $3;
		}
	);
	return objURL;
}
var params = get_UrlParams();

function isAvailable(lang) {
	var ret = false;
	$('#lang ul').find('[data-lang]').each(function(index, element) {
        if ($(this).data('lang') == lang) {
			ret = true;
			return false;
		}
    });
	return ret;
}

var ads_text;

var is_eng_measures = false;
// internationalization
function translate(page) {
	var nsPage = 'ns.' + page,
	 	eng_measures = ['en'],
	 	lang = navigator.language 
		|| navigator.userLanguage 
		|| 'en';
	if (window.localStorage) {
		var lang_stored = localStorage.getItem('lang');
		if (typeof lang_stored != 'undefined') {
			lang = lang_stored;
		}
	}
	if (typeof params['lang'] != 'undefined') {
		lang =  params['lang'];
	}
	if (!isAvailable(lang)) {
		lang = 'en';
	}
	$('#lang ul li:first-child').text(lang);
	$.i18n.init({
		lng: lang,
		ns: {
			namespaces: [nsPage, 'ns.menu', 'ns.general'],
			defaultNs: nsPage
		},
		fallbackLng: 'en',
		useLocalStorage: false,
		debug: (debug != undefined && debug)
	}, function() {
		$('.container').i18n();
		if (eng_measures.indexOf(lang)) {
			is_eng_measures = true;
		}
		if (nsPage == 'ns.profile' || nsPage == 'ns.contacts') {
			try {
				fill_rates();
			} catch (e) {
				if (typeof debug != 'undefined' && debug) {
					console.log("lang.js:fill_rates error");
				}
			}
			try {
				init_text_colors();
			} catch (e) {
				if (typeof debug != 'undefined' && debug) {
					console.log("lang.js:init_text_colors error");
				}
			}
		}
		if (nsPage != 'ns.home') {
			/* link subscribe button to subscribe form */
			$('.subscribe').on(event_str.click, function(event) {
				if ($(window).width() <= 720) {
					window.location.href = 'subscribe.html';
				} else {
					window.location.href = 'index.html';
				}
			});
		}
		
		//text ads - menu top
		ads_text = [
			$.t('ns.general:ads.text1'),
			$.t('ns.general:ads.text2'),
			$.t('ns.general:ads.text3')
		];
		ads_viewer();
		
		//google analytics
		var _gaq = _gaq || [];
		 _gaq.push(['_setAccount', 'UA-35488796-1']);
		 _gaq.push(['_trackPageview']);

		 (function() {
		   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		 })();
		
		
		init();
	});
}

//a replacer peutetre...
var event_str = ('ontouchstart' in document) ? {
	click: 'touchstart',
	start: 'touchstart',
	end: 'touchend',
	hover: null
} : {
	click: 'click',
	start: 'mousedown',
	end: 'mouseup',
	hover: {
		start: 'mouseenter',
		end: 'mouseleave'
	}
};

$('#lang ul li').on(event_str.click, function() {
	if (window.localStorage) {
		var data_lang = $(this).data('lang');
		localStorage.setItem('lang', data_lang);
		$('#lang ul li:first-child').text(data_lang);
	}
});

var cmpt_lang = 0;
$('#lang ul li:first-child').on(event_str.click, function() {
	$('#lang ul li').css('display', (cmpt_lang % 2 == 0) ? 'inherit' : 'none');
	cmpt_lang++;
});

if (event_str.hover != null) {
	$('#lang ul li').on(event_str.hover.end, function() {
		$(this).find(':not(:first-child)').each(function(index, element) {
	        $(this).css('display', 'none');
	    });
	});
}

function topmenu_visibility() {
	$('#connectform_top').css('display', 'none');
	$('#chat_open').css('visibility', 'visible');
	$('#lang').css('right', '160px');
	$('#div_ads').css('display', 'none');
	$('#top_subscribe').css('display', 'none');
}

if (typeof params['logout'] != 'undefined') {
	localStorage.removeItem('user');
	alert('you have now logged out');
	window.location.href = 'index.html';
}

//localstorage fake data init 
var notifs;
if (window.localStorage) {
	notifs = localStorage.getItem('notifs');
	if (notifs == undefined || notifs == null)
	{
		notifs = [{
			user: {
				id: 0,
				profile: {
					firstname: 'matin',
					lastname: 'oubaouba'
				},
				avatar: ''
			},
			isread: false
		}, {	
			user: {
				id: 1,
				profile: {
					firstname: 'coco',
					lastname: 'piwi',
				},
				avatar: ''
			},
			isread: true
		}, {	
			user: {
				id: 4,
				profile: {
					firstname: 'coco',
					lastname: 'piwi',
				},
				avatar: ''
			},
			isread: false
		}];
		var json_notifs = JSON.stringify(notifs);
		localStorage.setItem('notifs', json_notifs);
	} else {
		notifs = JSON.parse(notifs);
	}
}

function make_notif_label(notifs) {
	var n_nb = 0;
	for (var n in notifs) {
		if (!notifs[n].isread) {
			n_nb++;
		}
	}
	if (n_nb != 0) {
		var div_ico_label_mini = $('<span>');
		div_ico_label_mini.addClass('ico_label_mini').text(n_nb);
		$('.ico_contacts').append(div_ico_label_mini);
	
		var div_ico_label = $('<span>');
		div_ico_label.addClass('ico_label').text(n_nb);
		$('#button_contacts').append(div_ico_label);
	}
}

function make_notif_read(notifs, notif_id) {
	for (var i in notifs) {
		if (notifs[i].user.id == notif_id) {
			notifs[i].isread = true;
		}
	}
	return notifs;
}

//build the notification window
function make_notif_window(notifs) {
	notifs.sort(function(a, b) {
		var nA = a.isread;
	  var nB = b.isread;

	  if (!nA && nB)
	    return -1;
	  else if (nA && !nB)
	    return 1;
	 	return 0;
	});
	var div = $('<div>');
	div.addClass('notifs_window');
	for (var n in notifs) {
		var div_n = $('<div>'), div_n_info = $('<div>') ;
		div_n.addClass('notif_window');
		if (!notifs[n].isread) {
			div_n.addClass('notif_window_notread');
			div_n.on(event_str.click, function(event) {
				$(this).removeClass('notif_window_notread');
				if (window.localStorage) {
						notifs = make_notif_read(notifs, $(this).data('user_id'));
						var json_notifs = JSON.stringify(notifs);
						localStorage.setItem('notifs', json_notifs);
				}
				window.location.href = 'profile.html?user=' + notifs[n].user.id;
			});
		}
		var img_avatar = $('<img>');
		var avatar = notifs[n].user.avatar;
		if (avatar != undefined)
		{
			img_avatar.attr('src', avatar)
		}
		img_avatar.appendTo(div_n);
		$('<p>').text(notifs[n].user.profile.firstname + ' ' + notifs[n].user.profile.lastname).appendTo(div_n);
		$('<br />').appendTo(div_n);
		$('<div>').addClass('heart_40_59').appendTo(div_n_info);
		$('<div>').addClass('gauge_lvl2').appendTo(div_n_info);
		$('<p>').text('infos').appendTo(div_n_info);
		div_n_info.appendTo(div_n);
		$('<div>').css('clear', 'both').appendTo(div_n);
		div_n.data('user_id', notifs[n].user.id).appendTo(div);
	} 
	$('.container').append(div);
	$('body').on(event_str.click, function() {
		$('.notifs_window').css('display', 'none');
	});
	if (event_str.hover != null) {
		$('#menu_landscape > div > *:not(.ico_profile)').on(event_str.click, function() {
			$('.notifs_window').css('display', 'none');
		});
	}
}

// Find matches
var mql = window.matchMedia("only screen and (max-width:720px)");
mql.addListener(function(m) {
  if (m.matches) {
		$('.notifs_window').css('display', 'none');
	}
});

function notif_window_Click(e) {
	if (!mql.matches) {
		$('.notifs_window').css('display', 'block');
	}
}

// open the notification window
if (event_str.hover == null) {
	$('.ico_contacts').on(event_str.click, notif_window_Click);
} else {
	$('.ico_contacts').on(event_str.hover.start, notif_window_Click);
}

function display_disabled_ico() {
	$('.ico_contacts, #button_contacts').css('opacity', 1);
	$('.ico_history, #button_history').css('opacity', 1);
	$('.ico_settings, #button_settings').css('opacity', 1);
}

//connected display
var user;
var user_string = localStorage.getItem('user');
if (user_string == null) {
		user = new User();
} else {
	try {
		user = JSON.parse(user_string);
	} catch (e) {
		user = new User();
	}
}

if (window.localStorage && user != undefined && user.id != undefined && user.id != '') {
	topmenu_visibility();
	make_notif_label(notifs);
	make_notif_window(notifs);
	display_disabled_ico();
	$('#top_logout').css('display', 'inline');
} else {
	function alert_must_be_loggedin(event) {
		if (!(window.localStorage && user != undefined && user.id != undefined && user.id != '')) {
			alert('you must be logged in');
		}
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		return false;
	}
	$('.ico_contacts, #button_contacts')
		.css('opacity', 0.5)
		.on(event_str.click, alert_must_be_loggedin);
	$('.ico_history, #button_history')
		.css('opacity', 0.5)
		.on(event_str.click, alert_must_be_loggedin);
	$('.ico_settings, #button_settings')
		.css('opacity', 0.5)
		.on(event_str.click, alert_must_be_loggedin);
}


/* connect user */
$('.connect').on(event_str.click, function(event) {
	var alias = $('#login').val() || $('#top_email').val() || $('#email_portrait').val();
	var password = $('#password').val() || $('#top_password').val() || $('#password_portrait').val();
	
	if (alias != null && password != null && alias != '' && password != '') {
		var u = new User();
		u.alias = alias;
		u.secret = password;
		
		var com = new Communication();
		com.user.set(u);
		var success = function() {
			topmenu_visibility();
			try {
				connect_visibility();
			} catch (e) {}
			user = localStorage.getItem('user');
			display_disabled_ico();
			
			$('.ico_contacts, #button_contacts').unbind(event_str.click);
			$('.ico_history, #button_history').unbind(event_str.click);
			$('.ico_settings, #button_settings').unbind(event_str.click);
			
			make_notif_label(notifs);
			make_notif_window(notifs);
			$('#top_logout').css('display', 'inline');
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
		},
		error = function() {
			alert("The couple email + password doesn't exist");
		}
		com.user.login(success, error);
	}
	return false;
});

function ads_viewer() {
	var div_ads = $('#div_ads'), ads_counter = 0;
	div_ads.text(ads_text[ads_counter]);
	setInterval(function() {
		div_ads.addClass('ads_translate');
		setTimeout(function() {
			ads_counter++;
			if (ads_text.length == ads_counter) {
				ads_counter = 0;
			}
			div_ads.text(ads_text[ads_counter]);
			div_ads.removeClass('ads_translate');
		}, 1300);
	}, 7000);
}

