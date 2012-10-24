/**
 * @fileOverview handle hidden draggable menu for portrait view
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

// reset menubar to it's default stage
function menu_standard() {
	$('#menu').removeClass('menu_reverse');
	$('.ico_home').removeClass('ico_home_reverse');
	$('.menu_child:not(.ico_home)').css('visibility', 'visible');
}

// reverse menubar for menuscreen display
function menu_reverse() {
	$('#menu').addClass('menu_reverse');
	$('.ico_home').addClass('ico_home_reverse');
	$('.menu_child:not(.ico_home)').css('visibility', 'hidden');
}

// handle draggable menu for screen_menu display
$('#menu').draggable({ 
 axis: 'y',
 handle: '#ico_home',
 containment: 'window',
 snap: 'window',
 snapMode: 'inner',
 snapTolerance: 50,
 start: function(event, ui) {
			$(this).css({
				'-webkit-transition-duration': '0s',
				'-moz-transition-duration': '0s'
			});
			menu_reverse();
 		},
 stop: function(event, ui) {
			$(this).css({
				'-webkit-transition-duration': '0.5s',
				'-moz-transition-duration': '0.5s'
			});
			var win = $(window),
				menu = $('#menu'),
				pos = menu.position();
			if (pos.top >= win.height() + win.scrollTop() - menu.height()) {
				menu_standard();
			}
	   }
});

// save menubar position
var drag_pos = false;

// get menu position when ico_home is clicked but not release
$('.ico_home').on(event_str.start, function() {
	var pos = $('#menu').position();
	drag_pos = pos.top;
});

// if ico_home has been clicked and not dragged, display menu screen
$('.ico_home').on(event_str.end,function() {
	var menu = $('#menu'),
		pos = menu.position();
		
	if (drag_pos != pos.top) return;
	
	var	menu_height = menu.height(),
		total_height = $(window).height() - menu_height;

	if (pos.top <= menu_height + $(window).scrollTop()) {
		 menu.css({
			 'top' : 'auto',
			 '-moz-transition-duration': '0s',
			 '-webkit-transition-duration': '0s',
			 'bottom' : total_height + 'px'
		 });
		 
		 //settimeout fix error bar directly at bottom
		 window.setTimeout(function() {
			menu_standard();
			menu.css({
				'-moz-transition-duration': '0.5s',
			 	'-webkit-transition-duration': '0.5s',
				'bottom' : '0'
			});
		}, 20);
	} else if (pos.top - 1 <= total_height + $(window).scrollTop()) {
		menu.css({
			'top' : 'auto',
			'-moz-transition-duration': '0s',
			'-webkit-transition-duration': '0s',
			'bottom' : '0'
		});
		
		//settimeout fix error bar directly at top
		window.setTimeout(function() {
			menu_reverse();
			menu.css({
				'-moz-transition-duration': '0.5s',
			 	'-webkit-transition-duration': '0.5s',
				'bottom' : total_height + 'px'
			});
		}, 20);
	}
});

$('#menu_page div div[id^=button_]').on(event_str.click, function() {
	var id = $(this).attr('id');
	id = id.substr('button_'.length);
	
	if (!(window.localStorage && user != undefined && user.id != undefined && user.id != '')) {
		if (id == 'contacts' || id == 'history' || id == 'settings') {
			return false;	
		}
	}
	menu_standard();
	
	$('#menu').css({
		'top': ($(window).height() - $('#menu').height()) + 'px'
	});
	
	window.setTimeout(function() {
		if (id == 'search') {
			id = 'index';
		}
		window.location.href = id + '.html';
	}, 500);
});

/* lang */

function lang_hover() {
	$('#lang ul li').css('display', 'block');
	$('#lang ul li:first-child').css('background-color', '#000');
}

function lang_hoverOff() {
	$('#lang ul li:not(#lang ul li:first-child)').css('display', 'none');
	$('#lang ul li:first-child').css('background-color', '#333');
}

if (event_str.hover != null) {
	$('#lang').on(event_str.hover.start, lang_hover);
	
	$('#lang').on(event_str.hover.end, lang_hoverOff);
} else {
	$('#lang').on(event_str.start, lang_hover);
	$('#lang').on(event_str.end, lang_hoverOff);
}

$('#lang ul li:not(#lang ul li:first-child)').on(event_str.click, function() {
	window.location.href = window.location.pathname + '?lang=' + $(this).data('lang');
});

/* chat */

$('#chat_open').on(event_str.click, function() {
	var chat_bar = $('#chat_bar');
	
	chat_bar.css('height', $(window).height() - 59);
	
	var visibility = 'visibility';
	
	if (chat_bar.css(visibility) == 'visible') {
		chat_bar.css(visibility, 'hidden');
	} else {
		chat_bar.css(visibility, 'visible');
	}
});
