
/**
 * @function callback onchange of input html element
 */
function binding_input() {
	var elem = $(this),
		bind_name = elem.data('bind'),
		val = elem.val();
		
	if (typeof bind_name == 'undefined') {
		return;
	}
	
	bind_setter(bind_name, val);
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		localStorage.setItem('user_tmp', JSON.stringify(user));
	}
	
	//little hack to fill text for license
	if (bind_name == 'user.filters.profile.license') {
		switch (val) {
			case 'car':
				val = 1;
				break;
			case 'motorcycle':
				val = 2;
				break;
			case 'both':
				val = 3;
				break;
			default:
				val = 0;
				break
		}
		$('#driving_license_text').text(driving_license_text[val]);
	}
}

/**
 * @function fill inputs with user's infos
 * @param {Object} user object
 */
function fillInputs(user_stored) {
	user = JSON.parse(user_stored);
	var elements = $(document).find('[data-bind]');
	
	elements.each(function() {
		var elem = $(this),
			bind_name = elem.data('bind');
			
		var val = bind_getter(bind_name);
		
		if (typeof val != 'undefined' && val != '') {
			elem.val(val);	
			fillInputs_specifics(elem, bind_name, val);
		}
	});

	//draw color buttons (eyes, skin, hair)
	draw_shapes(user);
}

/**
 * @function fill elements that aren't inputs
 * @param {Object} the html element
 * @param {String} name of the binding
 * @param {Object} value of the element
 */
function fillInputs_specifics(elem, bind_name, val) {
	var extrem = bind_name.indexOf('min') != -1 ? 'min' : 'max';
	var parent = elem.parent();
	var children;
	if (bind_name.indexOf('rate') != -1) {
		var bindTab = bind_name.split('.'),
			rate_name = bindTab[bindTab.length - 1];
		if (typeof val == 'undefined') {
			val = 0;
		}
		rate_modifier(rate_name + '_' + extrem, val);
	} else if (bind_name.indexOf('haircut') != -1) {
		children = parent.find('[id=rate_haircut_' + extrem + ']').children();
		rate_modifier('haircut_' + extrem, val);
	} else if (parent.hasClass('dropdown_menu')) {
		children = parent.find('[data-value=' + val + ']');
		parent.children('ul').children(':first-child').text(children.text());
	} else if (bind_name.indexOf('height') != -1) {
		var default_imgSize = 261;
		var height = default_imgSize + val * 20;
		var idSilouhette = '#silhouette_img_' + (bind_name.indexOf('min') ? 'min' : 'max') ;
		$(idSilouhette).height(height);
		$(idSilouhette).css('background-size', $(idSilouhette).width() + 'px ' + height + 'px');
		elem.text(val);
	} else if (bind_name.indexOf('weight') != -1) {
		var idSilouhette = '#silhouette_img_' + (bind_name.indexOf('min') ? 'min' : 'max') ;
		if (val >= 95) {
			val = 65;
		} else if (val >= 55) {
			val = 55;
		} else if (val <= 40) {
			val = 45;
		}
		$(idSilouhette).width(val);
		$(idSilouhette).css('background-size', val + 'px ' + $(idSilouhette).height() + 'px');

		elem.text(val);
	} else if (bind_name.indexOf('min.age') != -1) {
		elem.text(val);
	} else if (bind_name.indexOf('max.age') != -1) {
		elem.text(val);	
	} else if (bind_name == 'user.filters.personality.relationship.type') {
		elem.text(val);	
	} else if (bind_name == 'user.filters.personality.relationship.gender') {
		if (val == 'man') {
			$('#silhouette_img_max').removeClass().addClass('silhouette_man');
			$('#silhouette_img_min').removeClass().addClass('silhouette_man');
			$('#lookingfor_man').removeClass().addClass('lookingfor_man');
			$('#lookingfor_woman').removeClass().addClass('lookingfor_woman_blank');
		} else if (val == 'woman') {
			$('#silhouette_img_max').removeClass().addClass('silhouette_woman');
			$('#silhouette_img_min').removeClass().addClass('silhouette_woman');
		} else {
			$('#lookingfor_man').removeClass().addClass('lookingfor_man');
			$('#silhouette_img_max').removeClass().addClass('silhouette_man');
		}
	} else if (bind_name.indexOf('license') != -1) {
		if (val == 'car' || val == 'both') {
			$('#driving_license_car').removeClass().addClass('driving_license_car');
		}
		if (val == 'motorcycle' || val == 'both') {
			$('#driving_license_motorcycle').removeClass().addClass('driving_license_motorcycle');
		}
	}
}

// Add a media query change listener
var display_personality = 'inline',
	display_physique = 'none';
mql.addListener(function(m) {
  if(!m.matches) {
	$('#tab_personality').css('display', 'inline');
	$('#tab_physique').css('display', 'inline');
	$('#global_portrait').css('display', 'inline');
	$('#infos').css('display', 'inline');
  } else {
	if (hilight_def == 'edit_physique') {
		$('#tab_personality').css('display', 'none');
		$('#tab_physique').css('display', 'inline');
		$('#global_portrait').css('display', 'inline');
		$('#infos').css('display', 'none');
	} else {
		$('#tab_personality').css('display', 'inline');
		$('#tab_physique').css('display', 'none');
		$('#global_portrait').css('display', 'none');
		$('#infos').css('display', 'inline');
	}
  }
});

/* hilight the good onglet on href arrival */
var hilight_def = 'personality';
function hilight_default() {
	$('#navbar').removeClass('personality physique edit').addClass(hilight_def);
}

/* display personality page */
function bt_personality_Click() {
	hilight_def = 'personality';
	$('#tab_personality').css('display', 'inline');
	$('#tab_physique').css('display', 'none');
}
$('#bt_personality').on(event_str.click, bt_personality_Click);

/* display physique page */

function bt_physique_Click() {
	hilight_def = 'physique';
	$('#tab_personality').css('display', 'none');
	$('#tab_physique').css('display', 'inline');
}
$('#bt_physique').on(event_str.click, bt_physique_Click);

/* return url arg after '#' */
function get_UrlArg() {
	var loc = $(location).attr('href');
	var loc_separator = loc.indexOf('#');
	return (loc_separator == -1) ? '' : loc.substr(loc_separator + 1);
}

var arg = get_UrlArg();
if (arg == 'physique') {
	bt_physique_Click();
	preload(['.personality', '.edit']);
	hilight_default();
} else if (arg == 'personality') {
	bt_personality_Click();
}

if (event_str.hover != null) {

	$('#bt_personality').hover(function() {
		$('#navbar').removeClass('physique edit').addClass('personality');
	}, hilight_default);

	$('#bt_physique').hover(function() { 
		$('#navbar').removeClass('personality edit').addClass('physique');
	}, hilight_default);

	$('#bt_edit').hover(function() { 
		$('#navbar').removeClass('personality physique').addClass('edit');
	}, hilight_default);
}

/**
 * @function draw a rounded corner square
 * @param {String} the html element's id
 * @param {String} name of the binding
 */
function drawShape(id, is_selected) {
	// get the canvas element using the DOM
	var canvas = document.getElementById(id);
	
	var shape = new RoundedCornerSquare(id);
	
	// Make sure we don't execute when canvas isn't supported
	if (canvas.getContext) {
		shape.ctx = canvas.getContext('2d');
		shape.setSelection(is_selected);
		shape.draw();
	} else if (typeof debug != 'undefined' && debug) {
		console.log('squares can\'t be displayed.');
	}
}

/**
 * @function draw all the corner rounded's squares
 * @param {Object} user
 */
function draw_shapes(u) {
	
	if (u != null) {
		user = u;
	}
	
	drawShape('square_color_hair_black', $.inArray('black', user.filters.physique.color.hair) != -1);
	drawShape('square_color_hair_blond', $.inArray('blond', user.filters.physique.color.hair) != -1);
	drawShape('square_color_hair_brown', $.inArray('brown', user.filters.physique.color.hair) != -1);
	drawShape('square_color_hair_grey', $.inArray('grey', user.filters.physique.color.hair) != -1);
	drawShape('square_color_hair_white', $.inArray('white', user.filters.physique.color.hair) != -1);
	drawShape('square_color_hair_ginger', $.inArray('ginger', user.filters.physique.color.hair) != -1);
	
	drawShape('square_color_eyes_blue', $.inArray('blue', user.filters.physique.color.eyes) != -1);
	drawShape('square_color_eyes_brown', $.inArray('brown', user.filters.physique.color.eyes) != -1);
	drawShape('square_color_eyes_green', $.inArray('green', user.filters.physique.color.eyes) != -1);
	
	drawShape('square_color_skin_white', $.inArray('white', user.filters.physique.color.skin) != -1);
	drawShape('square_color_skin_brown', $.inArray('brown', user.filters.physique.color.skin) != -1);
	drawShape('square_color_skin_yellow', $.inArray('yellow', user.filters.physique.color.skin) != -1);
	drawShape('square_color_skin_black', $.inArray('black', user.filters.physique.color.skin) != -1);
}

function init() {
	preload(['preload_ico_search_glow',
			 'preload_ico_contacts_glow',
			 'preload_ico_filters_glow',
			 'preload_ico_profile_glow',
			 'preload_ico_history_glow',
			 'preload_ico_settings_glow',
			 '.physique',
			 '.edit'
	]);
			 
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		var user_tmp = localStorage.getItem('user_tmp'),
			user_stored = localStorage.getItem('user');
		
		if (user_tmp !== null) {
			fillInputs(user_tmp);
		} else if (user_stored !== null) {
			fillInputs(user_stored);
		} else {
			draw_shapes(new User());
		}
		
	}
}
translate('profile');

$('#height').keypress(is_number)
.on('blur', function() {
	var elem = $(this),
		val = elem.val();
	if (val > 2.4)
	{
		elem.val(2.4);
	} else if (val < 0.5) { 
		elem.val(0.5);
	}
});

$('#weight').keypress(is_number)
.on('blur', function() {
	var elem = $(this),
		val = elem.val();
	if (val > 160)
	{
		elem.val(160);
	} else if (val < 30) { 
		elem.val(30);
	}
});