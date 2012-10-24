/**
 * @fileOverview forms' scripts
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

$(function()
{
	// datepicker for birthdaydate
	$('.box_birthdate').datepicker({
		defaultDate: '-23y',
		yearRange: '-60:-15',
		changeYear: true,
		changeMonth: true,
		onClose: function(dateText, inst) {
			$(this).blur();
		},
		monthNamesShort: ['Jan','Féb','Mar','Avr','Mai','Juin','Juil','Août','Sept','Oct','Nov','Déc']
	});
});

/* -- email -- */

// check if text is an email
function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(('[\w-+\s]+')|([\w-+]+(?:\.[\w-+]+)*)|('[\w-+\s]+')([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};

//because some bowser doesn't support type=number 
function is_number(event) {
	return (/\d|\./.test(String.fromCharCode(event.which) ));
}

// fire email check on text change
function onChangeEmail(emailAddress) {
	if (isValidEmailAddress(emailAddress)) { 
		//do stuff
	} else {
		//do stuff

	}
}
	

/* -- Dropdown box -- */

// fake a select. Animate a stylised dropdown input
function make_dropdown(id) {
	var menudown = false;
	id = $(id + ' .dropdown_menu');
	
	function dropdown_Click() {
		if (menudown) {
			id.find('li').each(function(index, element) {
				if (index != 0) {
					$(this).slideUp();
				}
			});
			menudown = false;
		} else {
			id.find('li').slideDown();
			menudown = true;
		}
	}
	
	function dropdownElem_Click(event) {
		var color_name = $(this).data('color');
		if (color_name != null) {
			var body_part = $(this).parent().parent().parent().attr('id').substr('color_'.length);
			
			id.find('input[type="hidden"]').val(color_name).change();
			var txt = $(event.target).text();
			id.find('li:first-child').removeClass().addClass('color_' + color_name).text(txt);
				
			var is_hair = (body_part == 'hair');
			change_bodypart_color(color_name, body_part, is_hair);
		} else {
			var val = $(this).data('value');
			if (val != null) {
				id.find('input[type="hidden"]').val(val).change();
				var txt = $(event.target).text();
				id.find('li:first-child').text(txt);
			}
		}
	}
	
	var success = true;
	try {
		id.touchstart(dropdown_Click);
	} catch(e) {
		success = false;
	}
	if (success) {
		id.find('li').touchstart(dropdownElem_Click);
	} else {
		id.click(dropdown_Click);
		id.find('li').click(dropdownElem_Click);
	}
	
	
}

/* -- auto complete -- */
var auto_sports = [
	'judo',
	'juli',
	'football' 
];

var auto_musics = [
	'UB40',
	'The Velvet Underground',
	'The Verve',
	'Verve Pipe' 
];

var auto_movies = [
	'batman returns',
	'how high',
	'forest gump',
	'hook'
];

var auto_books = [
	'game of throne',
	'the 8th color',
	'dunes'
];

var auto_hobbies = [
	'stamp collection',
	'wine test',
	'computer games'
];

var auto_studies = [
	'managing',
	'computer sciences'
];

var auto_job = [
	'farmer',
	'banker',
	'developer'
];

var auto_lang = [
	'French',
	'English',
	'Spanish'
];

//match corresponding
function select_autocompTab(id) {
	var tab;
	switch (id) {
		case 'sports':
			tab = auto_sports;
			break;
		case 'musics':
			tab = auto_musics;
			break;
		case 'movies':
			tab = auto_movies;
			break;
		case 'books':
			tab = auto_books;
			break;
		case 'hobbies':
			tab = auto_hobbies;
			break;
		case 'job':
			tab = auto_job;
			break;
		case 'studies':
			tab = auto_studies;
			break;
		case 'spoken_lang':
			tab = auto_lang;
			break;
	}
	return tab;
}

//flag to prevent double boxes on suggestion click
var autocomplete_isOpen = false;
$('.autocompletebox')
	// don't navigate away from the field on tab when selecting an item
	.on( 'keydown', function( event ) {
		if ( event.keyCode === $.ui.keyCode.TAB &&
				$(this).data('autocomplete').menu.active) {
			event.preventDefault();
		}
	})
	.autocomplete({
		minLength: 0,
		source: function(request, response) {
			
			if (request.term.length == 0) {
				return;
			}
			var id = this.element[0].id;
			var tab = select_autocompTab(id);
			
			response($.ui.autocomplete.filter(
				tab, request.term));
		},
		focus: function() {
			// prevent value inserted on focus
			return false;
		},
		select: function(event, ui) {
			var elem = $(this),
				val = ui.item.value;
			elem.trigger('CreateInputElem', val); 
            inputElem_create(elem, val);
			ui.item.value = '';
		},
		open: function() { 
			//resize suggestion box (bug fix)
			$('.ui-autocomplete').css('width','140px');
			autocomplete_isOpen = true;
		},
		close: function() {
			autocomplete_isOpen = false;
		}
	})
	//put focus style on fake input
	.focus(function() {
		$(this).parent().addClass('fakeInput_focus');
	})
	//put focus style on fake input
	.blur(function() {
		$(this).parent().removeClass('fakeInput_focus');
		 var elem = $(this),
		 	 val = elem.val();
		 if (val != '' && !autocomplete_isOpen) {
			elem.trigger('CreateInputElem', val);
			inputElem_create(elem, val);
			elem.val('');
		 }
	})
	.keydown(function (e) {
		var elem = $(this);
		if (e.which == $.ui.keyCode.COMMA || e.which == $.ui.keyCode.ENTER) {
		 var val = elem.val();
		 if (e.which == $.ui.keyCode.COMMA) {
			val = val.substr(0, val.length - 1);
		 }
		 if (val != '' && val.indexOf(',') == -1) {
			elem.trigger('CreateInputElem', val);
			inputElem_create(elem, val);
		 }
	 	}
		else if (e.which == $.ui.keyCode.BACKSPACE && elem.val() == '') {
			
		var parent = elem.parent(),
			nth = parent.children().length,
			input = parent.children(':nth-child(' + nth + ')'),
			last_elem = parent.children(':nth-child(' + (nth - 1) + ')');
	
		var val = last_elem.text().replace(/.$/g, '');
		input.trigger('DeleteInputElem', val);
		
		last_elem.remove();
	}
	})
	.keyup(function(e) {
		if (e.which == $.ui.keyCode.COMMA || e.which == $.ui.keyCode.ENTER) {
			$(this).val('');
		}
	});

//delete an elem when <baskspace> key is pressed
function inputElem_delete_byKey(e) {
	var elem = $(this);
	
}

function inputElem_delete(event) {
	var elem = $(this).parent(),
		parent = elem.parent(),
		nth = parent.children().length,
		input = parent.children(':nth-child(' + nth + ')');
	
	var val = elem.text().replace(/.$/g, '');
	input.trigger('DeleteInputElem', val);
	
	elem.remove();
}

//create the elem
function inputElem_create(elem, val) {
	var div = $('<div>').addClass('fakeInput_elem').text(val);
	
	$('<a>').addClass('fakeInput_remove').text('x')
	.on('touchstart click', inputElem_delete)
	.appendTo(div);

	div.insertBefore(elem);
}

//add elem when  <,> or <enter> key is pressed
function inputElem_add_byKey(e) {
	
}

function focus_fake() {
	var children = $(this).children();
	if (!children.is(':focus')) {
		children.focus();
	}
}
//put focus on input when fake input is clicked
$('.fakeInput').on(event_str.click, focus_fake);

function check_input(_this, isOk) {
	var c_class = 'check ';
	var val = $(_this).val();
	if (val == '')
	{
		c_class += 'check_need';
	} else if (isOk) {
		c_class += 'check_ok';
	} else {
		c_class += 'check_wrong';
	}
	$(_this).next().removeClass().addClass(c_class);
}

function isDate(val) {
	return /(\d*\/\d*\/\d*)/.test(val);
}

$('.check').prev('input').on('blur', function() {check_input($(this), true);});
$('.check').prev('input.box_birthdate').on('blur', function() {
	check_input($(this), isDate($(this).val()));
});
$('.check').prev('input[type=email]').on('blur', function() {
	check_input($(this), isValidEmailAddress( $(this).val() ));
});

function requiredFieldsOK() {
	var r = true;
	$('.check').each(function() {
		var elem = $(this);
		if (!elem.hasClass('check_ok') && !elem.hasClass('check_wrong') && elem.val() == '') {
			elem.removeClass().addClass('check check_need');
			r = false;
		}
		if (elem.hasClass('check_wrong')) {
			r = false;
		}
	});
	return r;
}