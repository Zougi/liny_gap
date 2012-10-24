/**
 * @fileOverview portrait maker for profile
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

var lastColor_eyes = 'blue',
	lastColor_skin = 'white',
	lastColor_hair = 'black';

// tab draw coordinates
var tab = [ 0, 0, 75, 21, 75, 84, 0, 63];

// separator line draw coordinates
var stroke = [ 0, 0, 73, 20, 73, 23, 0, 0 ];

// space between tabs
var top_spacer = 0;

// every 2 members of an array is equal to a tab and it's color
var colors_skin = [ 'white', '252, 228, 203',
				'brown', '178, 151, 115',
				'yellow', '237, 223, 171',
				'black', '92, 80, 72' ];
				
var colors_eyes = [ 'blue', '31, 92, 161',
				'brown', '142, 77, 61',
				'green', '74, 169, 106' ];
				
var colors_hair = [ 'black', '0, 0, 0',
				'blond', '251, 224, 86',
				'brown', '92, 54, 29',
				'grey', '202, 207, 212',
				'white', '248, 246, 241',
				'ginger', '243, 101, 60' ];
				
var hair_sizes = ['short', 'medium', 'long'];

// draw shape and colorize it
function draw(canvas, coord, colr) {
	canvas.fillStyle = colr;
	canvas.beginPath();
	canvas.moveTo(coord[0], coord[1]);
	for (var item = 2; item < coord.length - 1; item += 2) {
		canvas.lineTo(coord[item] , coord[item + 1]);
	}
	canvas.closePath();
	canvas.fill();
}

var hair_name = 'hair',
	eyes_name = 'eyes',
	skin_name = 'skin';

function change_bodypart_color(color_name, body_part, is_hair) {
	if (is_hair) {
		var bg = $('#' + hair_name).css('background-image');
		body_part = 'hair_' + get_hair_size(hair_sizes, bg, 0, null);
	}
	
	var class1 = gender + '_' + body_part,
		class2 = class1 + '_' + color_name,
		classes =  class1 + ' ' + class2;
	if (is_hair) {
		$('#' + hair_name ).removeClass().addClass(classes);
	} else {
		$('#' + body_part).removeClass().addClass(classes);
	}
	
	if (body_part == skin_name) {
		//save actual color
		lastColor_skin = color_name;
		//refresh selectbox
		coloc_click_setSelectBox('skin', color_name);
	} else if (body_part == eyes_name) {
		lastColor_eyes = color_name;
		coloc_click_setSelectBox('eyes', color_name);
	} else if (is_hair) {
		lastColor_hair = color_name;
		coloc_click_setSelectBox('hair', color_name);
	}	
}

function coloc_click_setSelectBox(id_str, color_name) {
	var id = $('#color_' + id_str),
		color_name_lang = id.find('[data-color=' + color_name + ']').text();
	id.find('li:first-child').removeClass().addClass('color_' + ((id_str == 'hair' && color_name == 'white') ? 'whiteh' : color_name)).text(color_name_lang);
	id.find('input[type="hidden"]').val(color_name).change();	
}

// click event on color
function color_click(color_name, body_part) {
	var is_hair = (body_part.length > hair_name.length && body_part.substr(0, hair_name.length) == hair_name);
	
	change_bodypart_color(color_name, body_part, is_hair);
	
	color_select(color_name, body_part);
}

// make canvas with top stroke
function make_color(color_picker, color_name, color, body_part) {
	color_picker.append('<canvas id="' + color_name + '" style="position:relative; top:-' + top_spacer + 'px;" />');
	
	try {
		var elem = document.getElementById(color_name);
		elem.addEventListener('touchstart', function(event) {
			color_click(color_name, body_part);
		});
	} catch(e) { }
	elem.addEventListener('click', function(event) {
		color_click(color_name, body_part);
	});
	
	var canvas = elem.getContext('2d');

	draw(canvas, tab, color);
	draw(canvas, stroke, '#000');
	
	top_spacer += 90;
}

// change a body part color
function color_select(selected, body_part) {
	if (selected == null) {
		if (body_part == skin_name) {
			selected = lastColor_skin;
		} else if (body_part == eyes_name) {
			selected = lastColor_eyes;
		} else if (body_part.length > hair_name.length && body_part.substr(0, hair_name.length) == hair_name) {
			selected = lastColor_hair;
		}
	}
	
	var color_picker = $('#color_picker');
	color_picker.empty();
	top_spacer = 0;
	for (var it = 0; it < colors.length - 1; it += 2) {
		make_color(color_picker, colors[it], 'rgba(' + colors[it + 1] + ', ' + (selected == colors[it] ? '1' : '0.6') + ')', body_part);
	}
}


// get hair color from tab matched with bg
function get_hair_color(tab, bg) {
	for (var it = 0; it < tab.length; it += 2) {
		if (bg.indexOf(tab[it]) != -1) {
			return tab[it];
		}
	}
	return null;
}

// search size tab for hair size contained in bg
function get_hair_size(tab, bg, iter, side) {
	var tab2;
	
	//trick for left slide support
	if (side == 'left') {
		tab2 = $.extend(true, [], tab);
		tab2.reverse();
	} else {
		tab2 = tab;
	}
	for (i = 0; i < tab2.length; i++) {
		if (bg.indexOf(tab2[i]) != -1) {
			return (i + iter == tab2.length) ? tab2[0] : tab2[i + iter];
		}
	}
	return null;
}

// update haircut rate -- a little dirty
function update_haircut_rate(hair_size) {
	var hair_val = 0;
	switch (hair_size) {
		case hair_sizes[0]:
			hair_val = 2;
			break;
		case hair_sizes[1]:
			hair_val = 3;
			break;
		case hair_sizes[2]:
			hair_val = 4;
			break;
		default:
			break;
	}
	rate_click('haircut', hair_val, max_haircut);
	$('#rate_haircut_value').val(hair_val - 1);
	$('#rate_haircut_text').text(hair_size);
}

// switch hair cut with animation
function hairCut_switcher(id, side) {
	var hair = $(id),
	 	bg = hair.attr('class');
	
	var hair_size,
	 	hair_color;

	hair_size = get_hair_size(hair_sizes, bg, 1, side);
	hair_color = get_hair_color(colors_hair, bg);

	hair.addClass(gender + '_hair_translate_' + side + '_disappear');
	window.setTimeout(function() {
		var class1 = gender + '_hair_' + hair_size;
		hair.removeClass().addClass(class1 + ' ' + class1 
		+ '_' + hair_color + ' ' + gender + '_hair_translate_' + side + '_appear_' + hair_size);
	}, 1000);
	window.setTimeout(function() {
		hair.removeClass(gender + '_hair_translate_' + side + '_appear_' + hair_size);
	}, 2000);
	//alert(hair_size);
	update_haircut_rate(hair_size);
}
