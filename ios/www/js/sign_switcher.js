/**
 * @fileOverview sign man/woman switcher fonctions.
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

// input values
var genderValue_woman = 'woman',
 	genderValue_man = 'man';

var input_gender = $('#gender');

// class names
var woman = 'sign_woman',
 	woman_blank = 'sign_woman_blank',
 	man = 'sign_man',
 	man_blank = 'sign_man_blank';

// div ids
var woman_div = $('#woman'),
	man_div = $('#man');

// on man sign hover, change woman sign
function sign_switcher_man_Mouseenter() {
	man_div.removeClass(man_blank).addClass(man);
	woman_div.removeClass(woman).addClass(woman_blank);
}

function sign_switcher_man_Mouseleave() {
	woman_div.removeClass(woman_blank).addClass(woman);
	if (input_gender.val() != genderValue_man) {
		man_div.removeClass(man).addClass(man_blank);
	} else {
		woman_div.removeClass(woman).addClass(woman_blank);
	}
}

// on woman sign hover, change man sign
function sign_switcher_woman_Mouseenter() {
	woman_div.removeClass(woman_blank).addClass(woman);
	man_div.removeClass(man).addClass(man_blank);
}

function sign_switcher_woman_Mouseleave() {
	if (input_gender.val() == genderValue_man) {
		man_div.removeClass(man_blank).addClass(man);
		woman_div.removeClass(woman).addClass(woman_blank);
	}
}

// set man value
function sign_switcher_man_Click() {
	man_div.removeClass(man_blank).addClass(man);
	woman_div.removeClass(woman).addClass(woman_blank);
	input_gender.val(genderValue_man);
}

function sign_switcher_woman_Click() {
	woman_div.removeClass(woman_blank).addClass(woman);
	man_div.removeClass(man).addClass(man_blank);
	input_gender.val(genderValue_woman);
}

// main fct
function sign_switcher(man_id, woman_id) {
	woman_id = $(woman_id);
	man_id = $(man_id);
	
	man_id.on(event_str.click, sign_switcher_man_Click);
	woman_id.on(event_str.click, sign_switcher_woman_Click);
	if (event_str.hover != null) {
		man_id.on(event_str.hover.start, sign_switcher_man_Mouseenter);
		man_id.on(event_str.hover.end, sign_switcher_man_Mouseleave);

		woman_id.on(event_str.hover.start, sign_switcher_woman_Mouseenter);
		woman_id.on(event_str.hover.end, sign_switcher_woman_Mouseleave);
	}
}
