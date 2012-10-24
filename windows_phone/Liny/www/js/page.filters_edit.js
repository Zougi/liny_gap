var origin_page = 'filters.html';

$('.ico_save').on(event_str.click, function() {
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.removeItem('user_tmp');
	}
	
	window.location.href = origin_page;
});

$('.ico_cancel').on(event_str.click, function() {
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		localStorage.removeItem('user_tmp');
	}
	window.location.href = origin_page;
});

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
	if (bind_name == 'user.profile.license') {
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

$('input').blur(binding_input);

$('input[type=hidden]').change(binding_input);

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

var min_age;
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
		$('#slider_height_' + extrem).slider('option', 'value', val);
		$('#slider_height_' + extrem + ' a').text(val + 'm');
		var default_imgSize = 261;
		var height = default_imgSize + val * 20;
		var idSilouhette = '#silhouette_img_' + extrem;
		$(idSilouhette).height(height);
		$(idSilouhette).css('background-size', $(idSilouhette).width() + 'px ' + height + 'px');
	} else if (bind_name.indexOf('weight') != -1) {
		$('#slider_weight_' + extrem).slider('option', 'value', val);
		$('#slider_weight_' + extrem + ' a').text(val + 'kg');
		if (val >= 95) {
			val = 65;
		} else if (val >= 55) {
			val = 55;
		} else if (val <= 40) {
			val = 45;
		}
		var idSilouhette = '#silhouette_img_' + extrem;
		$(idSilouhette).width(val);
		$(idSilouhette).css('background-size', val + 'px ' + $(idSilouhette).height() + 'px');
	} else if (bind_name.indexOf('min.age') != -1) {
		min_age = val;
	} else if (bind_name.indexOf('max.age') != -1) {
		$('#slider_agerange').slider('option', 'values', [min_age, val]);
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

var hilight_def = 'edit_personality';
function hilight_default() {
	$('#navbar').removeClass('edit_personality edit_physique').addClass(hilight_def);
}

function bt_personality_Click() {
	hilight_def = 'edit_personality';
	$('#tab_physique').css('display', 'none');
	$('#tab_personality').css('display', 'inline');
}

function bt_physique_Click() {
	hilight_def = 'edit_physique';
	$('#tab_physique').css('display', 'inline');
	$('#tab_personality').css('display', 'none');
}

/* party rate */
function party_0_min_Click() {
	rate_modifier('party_min', 0);
}

function party_1_min_Click() {
	rate_modifier('party_min', 1);
}

function party_2_min_Click() {
	rate_modifier('party_min', 2);
}

function party_3_min_Click() {
	rate_modifier('party_min', max_party);
}

/* alcohol rate */
function alcohol_0_min_Click() {
	rate_modifier('alcohol_min', 0);
}

function alcohol_1_min_Click() {
	rate_modifier('alcohol_min', 1);
}

function alcohol_2_min_Click() {
	rate_modifier('alcohol_min', 2);
}

function alcohol_3_min_Click() {
	rate_modifier('alcohol_min', max_alcohol);
}

/* tobacco rate */
function tobacco_0_min_Click() {
	rate_modifier('tobacco_min', 0);
}

function tobacco_1_min_Click() {
	rate_modifier('tobacco_min', 1);
}

function tobacco_2_min_Click() {
	rate_modifier('tobacco_min', 2);
}

function tobacco_3_min_Click() {
	rate_modifier('tobacco_min', 3);
}

function tobacco_4_min_Click() {
	rate_modifier('tobacco_min', max_tobacco);
}

/* piercing rate */
function piercing_0_min_Click() {
	rate_modifier('piercing_min', 0);
}

function piercing_1_min_Click() {
	rate_modifier('piercing_min', 1);
}

function piercing_2_min_Click() {
	rate_modifier('piercing_min', 2);
}

function piercing_3_min_Click() {
	rate_modifier('piercing_min', max_piercing);
}

/* tatoo rate */
function tatoo_0_min_Click() {
	rate_modifier('tatoo_min', 0);
}

function tatoo_1_min_Click() {
	rate_modifier('tatoo_min', 1);
}

function tatoo_2_min_Click() {
	rate_modifier('tatoo_min', 2);
}

function tatoo_3_min_Click() {
	rate_modifier('tatoo_min', max_tatoo);
}

/* haircut rate */
function haircut_1_min_Click() {
	rate_modifier('haircut_min', 0);
}

function haircut_2_min_Click() {
	rate_modifier('haircut_min', 1);
}

function haircut_3_min_Click() {
	rate_modifier('haircut_min', 2);
}

function haircut_4_min_Click() {
	rate_modifier('haircut_min', max_haircut);
}

/* party rate */
function party_0_max_Click() {
	rate_modifier('party_max', 0);
}

function party_1_max_Click() {
	rate_modifier('party_max', 1);
}

function party_2_max_Click() {
	rate_modifier('party_max', 2);
}

function party_3_max_Click() {
	rate_modifier('party_max', max_party);
}

/* alcohol rate */
function alcohol_0_max_Click() {
	rate_modifier('alcohol_max', 0);
}

function alcohol_1_max_Click() {
	rate_modifier('alcohol_max', 1);
}

function alcohol_2_max_Click() {
	rate_modifier('alcohol_max', 2);
}

function alcohol_3_max_Click() {
	rate_modifier('alcohol_max', max_alcohol);
}

/* tobacco rate */
function tobacco_0_max_Click() {
	rate_modifier('tobacco_max', 0);
}

function tobacco_1_max_Click() {
	rate_modifier('tobacco_max', 1);
}

function tobacco_2_max_Click() {
	rate_modifier('tobacco_max', 2);
}

function tobacco_3_max_Click() {
	rate_modifier('tobacco_max', 3);
}

function tobacco_4_max_Click() {
	rate_modifier('tobacco_max', max_tobacco);
}

/* piercing rate */
function piercing_0_max_Click() {
	rate_modifier('piercing_max', 0);
}

function piercing_1_max_Click() {
	rate_modifier('piercing_max', 1);
}

function piercing_2_max_Click() {
	rate_modifier('piercing_max', 2);
}

function piercing_3_max_Click() {
	rate_modifier('piercing_max', max_piercing);
}

/* tatoo rate */
function tatoo_0_max_Click() {
	rate_modifier('tatoo_max', 0);
}

function tatoo_1_max_Click() {
	rate_modifier('tatoo_max', 1);
}

function tatoo_2_max_Click() {
	rate_modifier('tatoo_max', 2);
}

function tatoo_3_max_Click() {
	rate_modifier('tatoo_max', max_tatoo);
}

/* haircut rate */
function haircut_1_max_Click() {
	rate_modifier('haircut_max', 0);
}

function haircut_2_max_Click() {
	rate_modifier('haircut_max', 1);
}

function haircut_3_max_Click() {
	rate_modifier('haircut_max', 2);
}

function haircut_4_max_Click() {
	rate_modifier('haircut_max', max_haircut);
}

var prefix_gender = 'lookingfor',
	man_gender = 'man',
 	woman_gender = 'woman';
doubleico_switcher(man_gender, woman_gender, prefix_gender, true);
doubleico_switcher(woman_gender, man_gender, prefix_gender, true);

$('#slider_agerange').slider({
		range: true,
		min: 18,
		max: 55,
		values: [ 20, 26 ],
		slide: function( event, ui ) {
			$('#age_min').val(ui.values[0]);
			$('#age_max').val(ui.values[1]);
		}
	});
$('#age_min').val($('#slider_agerange').slider('values', 0));
$('#age_max').val($('#slider_agerange').slider('values', 1));

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

/* return url arg after '#' */
function get_UrlArg() {
	var loc = $(location).attr('href');
	var loc_separator = loc.indexOf('#');
	return (loc_separator == -1) ? '' : loc.substr(loc_separator + 1);
}

var arg = get_UrlArg();
if (mql.matches) {
	if (arg == 'physique') {
		bt_physique_Click();
		preload([ '.edit_personality' ]);
		hilight_default();
	} else if (arg == 'personality') {
		bt_personality_Click();
	}
}

var success = true;
try {
	$('#bt_personality').touchstart(bt_personality_Click);
} catch (e) {
	success = false;	
}
if (success) {
	$('#bt_physique').touchstart(bt_physique_Click);
	
	$('#party_0_min').touchstart(party_0_min_Click);
	$('#party_1_min').touchstart(party_1_min_Click);
	$('#party_2_min').touchstart(party_2_min_Click);
	$('#party_3_min').touchstart(party_3_min_Click);
	$('#alcohol_0_min').touchstart(alcohol_0_min_Click);
	$('#alcohol_1_min').touchstart(alcohol_1_min_Click);
	$('#alcohol_2_min').touchstart(alcohol_2_min_Click);
	$('#alcohol_3_min').touchstart(alcohol_3_min_Click);
	$('#tobacco_0_min').touchstart(tobacco_0_min_Click);
	$('#tobacco_1_min').touchstart(tobacco_1_min_Click);
	$('#tobacco_2_min').touchstart(tobacco_2_min_Click);
	$('#tobacco_3_min').touchstart(tobacco_3_min_Click);
	$('#tobacco_4_min').touchstart(tobacco_4_min_Click);
	$('#haircut_1_min').touchstart(haircut_1_min_Click);
	$('#haircut_2_min').touchstart(haircut_2_min_Click);
	$('#haircut_3_min').touchstart(haircut_3_min_Click);
	$('#haircut_4_min').touchstart(haircut_4_min_Click);
	$('#tatoo_0_min').touchstart(tatoo_0_min_Click);
	$('#tatoo_1_min').touchstart(tatoo_1_min_Click);
	$('#tatoo_2_min').touchstart(tatoo_2_min_Click);
	$('#tatoo_3_min').touchstart(tatoo_3_min_Click);
	$('#piercing_0_min').touchstart(piercing_0_min_Click);
	$('#piercing_1_min').touchstart(piercing_1_min_Click);
	$('#piercing_2_min').touchstart(piercing_2_min_Click);
	$('#piercing_3_min').touchstart(piercing_3_min_Click);
	
	$('#party_0_max').touchstart(party_0_max_Click);
	$('#party_1_max').touchstart(party_1_max_Click);
	$('#party_2_max').touchstart(party_2_max_Click);
	$('#party_3_max').touchstart(party_3_max_Click);
	$('#alcohol_0_max').touchstart(alcohol_0_max_Click);
	$('#alcohol_1_max').touchstart(alcohol_1_max_Click);
	$('#alcohol_2_max').touchstart(alcohol_2_max_Click);
	$('#alcohol_3_max').touchstart(alcohol_3_max_Click);
	$('#tobacco_0_max').touchstart(tobacco_0_max_Click);
	$('#tobacco_1_max').touchstart(tobacco_1_max_Click);
	$('#tobacco_2_max').touchstart(tobacco_2_max_Click);
	$('#tobacco_3_max').touchstart(tobacco_3_max_Click);
	$('#tobacco_4_max').touchstart(tobacco_4_max_Click);
	$('#haircut_1_max').touchstart(haircut_1_max_Click);
	$('#haircut_2_max').touchstart(haircut_2_max_Click);
	$('#haircut_3_max').touchstart(haircut_3_max_Click);
	$('#haircut_4_max').touchstart(haircut_4_max_Click);
	$('#tatoo_0_max').touchstart(tatoo_0_max_Click);
	$('#tatoo_1_max').touchstart(tatoo_1_max_Click);
	$('#tatoo_2_max').touchstart(tatoo_2_max_Click);
	$('#tatoo_3_max').touchstart(tatoo_3_max_Click);
	$('#piercing_0_max').touchstart(piercing_0_max_Click);
	$('#piercing_1_max').touchstart(piercing_1_max_Click);
	$('#piercing_2_max').touchstart(piercing_2_max_Click);
	$('#piercing_3_max').touchstart(piercing_3_max_Click);	
} else {
	$('#bt_personality').hover(function() {
	$('#navbar').removeClass('edit_physique').addClass('edit_personality');
	}, hilight_default);
	
	$('#bt_physique').hover(function() { 
		$('#navbar').removeClass('edit_personality').addClass('edit_physique');
	}, hilight_default);

	$('#bt_personality').on(event_str.click, bt_personality_Click);
	$('#bt_physique').on(event_str.click, bt_physique_Click);

	$('#party_0_min').on(event_str.click, party_0_min_Click);
	$('#party_1_min').on(event_str.click, party_1_min_Click);
	$('#party_2_min').on(event_str.click, party_2_min_Click);
	$('#party_3_min').on(event_str.click, party_3_min_Click);
	$('#alcohol_0_min').on(event_str.click, alcohol_0_min_Click);
	$('#alcohol_1_min').on(event_str.click, alcohol_1_min_Click);
	$('#alcohol_2_min').on(event_str.click, alcohol_2_min_Click);
	$('#alcohol_3_min').on(event_str.click, alcohol_3_min_Click);
	$('#tobacco_0_min').on(event_str.click, tobacco_0_min_Click);
	$('#tobacco_1_min').on(event_str.click, tobacco_1_min_Click);
	$('#tobacco_2_min').on(event_str.click, tobacco_2_min_Click);
	$('#tobacco_3_min').on(event_str.click, tobacco_3_min_Click);
	$('#tobacco_4_min').on(event_str.click, tobacco_4_min_Click);
	$('#haircut_1_min').on(event_str.click, haircut_1_min_Click);
	$('#haircut_2_min').on(event_str.click, haircut_2_min_Click);
	$('#haircut_3_min').on(event_str.click, haircut_3_min_Click);
	$('#haircut_4_min').on(event_str.click, haircut_4_min_Click);
	$('#tatoo_0_min').on(event_str.click, tatoo_0_min_Click);
	$('#tatoo_1_min').on(event_str.click, tatoo_1_min_Click);
	$('#tatoo_2_min').on(event_str.click, tatoo_2_min_Click);
	$('#tatoo_3_min').on(event_str.click, tatoo_3_min_Click);
	$('#piercing_0_min').on(event_str.click, piercing_0_min_Click);
	$('#piercing_1_min').on(event_str.click, piercing_1_min_Click);
	$('#piercing_2_min').on(event_str.click, piercing_2_min_Click);
	$('#piercing_3_min').on(event_str.click, piercing_3_min_Click);
	
	$('#party_0_max').on(event_str.click, party_0_max_Click);
	$('#party_1_max').on(event_str.click, party_1_max_Click);
	$('#party_2_max').on(event_str.click, party_2_max_Click);
	$('#party_3_max').on(event_str.click, party_3_max_Click);
	$('#alcohol_0_max').on(event_str.click, alcohol_0_max_Click);
	$('#alcohol_1_max').on(event_str.click, alcohol_1_max_Click);
	$('#alcohol_2_max').on(event_str.click, alcohol_2_max_Click);
	$('#alcohol_3_max').on(event_str.click, alcohol_3_max_Click);
	$('#tobacco_0_max').on(event_str.click, tobacco_0_max_Click);
	$('#tobacco_1_max').on(event_str.click, tobacco_1_max_Click);
	$('#tobacco_2_max').on(event_str.click, tobacco_2_max_Click);
	$('#tobacco_3_max').on(event_str.click, tobacco_3_max_Click);
	$('#tobacco_4_max').on(event_str.click, tobacco_4_max_Click);
	$('#haircut_1_max').on(event_str.click, haircut_1_max_Click);
	$('#haircut_2_max').on(event_str.click, haircut_2_max_Click);
	$('#haircut_3_max').on(event_str.click, haircut_3_max_Click);
	$('#haircut_4_max').on(event_str.click, haircut_4_max_Click);
	$('#tatoo_0_max').on(event_str.click, tatoo_0_max_Click);
	$('#tatoo_1_max').on(event_str.click, tatoo_1_max_Click);
	$('#tatoo_2_max').on(event_str.click, tatoo_2_max_Click);
	$('#tatoo_3_max').on(event_str.click, tatoo_3_max_Click);
	$('#piercing_0_max').on(event_str.click, piercing_0_max_Click);
	$('#piercing_1_max').on(event_str.click, piercing_1_max_Click);
	$('#piercing_2_max').on(event_str.click, piercing_2_max_Click);
	$('#piercing_3_max').on(event_str.click, piercing_3_max_Click);
	
	$('#party_0_min').mouseenter(function() {
		rate_click('party_min', 0);	
	});
	
	$('#party_0_min').mouseleave(function() {
		var lvl = $('#rate_party_min_value').val();
		rate_click('party_min', lvl);	
	});
	
	$('#party_1_min').mouseenter(function() {
		rate_click('party_min', 1);	
	});
	
	$('#party_1_min').mouseleave(function() {
		var lvl = $('#rate_party_min_value').val();
		rate_click('party_min', lvl);	
	});
	
	$('#party_2_min').mouseenter(function() {
		rate_click('party_min', 2);	
	});
	
	$('#party_2_min').mouseleave(function() {
		var lvl = $('#rate_party_min_value').val();
		rate_click('party_min', lvl);	
	});
	
	$('#party_3_min').mouseenter(function() {
		rate_click('party_min', max_party);	
	});
	
	$('#party_3_min').mouseleave(function() {
		var lvl = $('#rate_party_min_value').val();
		rate_click('party_min', lvl);	
	});
	
	$('#alcohol_0_min').mouseenter(function() {
		rate_click('alcohol_min', 0);	
	});
	
	$('#alcohol_0_min').mouseleave(function() {
		var lvl = $('#rate_alcohol_min_value').val();
		rate_click('alcohol_min', lvl);	
	});
	
	$('#alcohol_1_min').mouseenter(function() {
		rate_click('alcohol_min', 1);	
	});
	
	$('#alcohol_1_min').mouseleave(function() {
		var lvl = $('#rate_alcohol_min_value').val();
		rate_click('alcohol_min', lvl);	
	});
	
	$('#alcohol_2_min').mouseenter(function() {
		rate_click('alcohol_min', 2);	
	});
	
	$('#alcohol_2_min').mouseleave(function() {
		var lvl = $('#rate_alcohol_min_value').val();
		rate_click('alcohol_min', lvl);	
	});
	
	$('#alcohol_3_min').mouseenter(function() {
		rate_click('alcohol_min', max_alcohol);	
	});
	
	$('#alcohol_3_min').mouseleave(function() {
		var lvl = $('#rate_alcohol_min_value').val();
		rate_click('alcohol_min', lvl);	
	});
	
	$('#tobacco_0_min').mouseenter(function() {
		rate_click('tobacco_min', 0);	
	});
	
	$('#tobacco_0_min').mouseleave(function() {
		var lvl = $('#rate_tobacco_min_value').val();
		rate_click('tobacco_min', lvl);	
	});
	
	$('#tobacco_1_min').mouseenter(function() {
		rate_click('tobacco_min', 1);	
	});
	
	$('#tobacco_1_min').mouseleave(function() {
		var lvl = $('#rate_tobacco_min_value').val();
		rate_click('tobacco_min', lvl);	
	});
	
	$('#tobacco_2_min').mouseenter(function() {
		rate_click('tobacco_min', 2);	
	});
	
	$('#tobacco_2_min').mouseleave(function() {
		var lvl = $('#rate_tobacco_min_value').val();
		rate_click('tobacco_min', lvl);	
	});
	
	$('#tobacco_3_min').mouseenter(function() {
		rate_click('tobacco_min', 3);	
	});
	
	$('#tobacco_3_min').mouseleave(function() {
		var lvl = $('#rate_tobacco_min_value').val();
		rate_click('tobacco_min', lvl);	
	});
	
	$('#tobacco_4_min').mouseenter(function() {
		rate_click('tobacco_min', max_tobacco);	
	});
	
	$('#tobacco_4_min').mouseleave(function() {
		var lvl = $('#rate_tobacco_min_value').val();
		rate_click('tobacco_min', lvl);	
	});
	
	$('#tatoo_0_min').mouseenter(function() {
		rate_click('tatoo_min', 0);	
	});
	
	$('#tatoo_0_min').mouseleave(function() {
		var lvl = $('#rate_tatoo_min_value').val();
		rate_click('tatoo_min', lvl);	
	});
	
	$('#tatoo_1_min').mouseenter(function() {
		rate_click('tatoo_min', 1);	
	});
	
	$('#tatoo_1_min').mouseleave(function() {
		var lvl = $('#rate_tatoo_min_value').val();
		rate_click('tatoo_min', lvl);	
	});
	
	$('#tatoo_2_min').mouseenter(function() {
		rate_click('tatoo_min', 2);	
	});
	
	$('#tatoo_2_min').mouseleave(function() {
		var lvl = $('#rate_tatoo_min_value').val();
		rate_click('tatoo_min', lvl);	
	});
	
	$('#tatoo_3_min').mouseenter(function() {
		rate_click('tatoo_min', max_tatoo);	
	});
	
	$('#tatoo_3_min').mouseleave(function() {
		var lvl = $('#rate_tatoo_min_value').val();
		rate_click('tatoo_min', lvl);	
	});

	$('#piercing_0_min').mouseenter(function() {
		rate_click('piercing_min', 0);	
	});
	
	$('#piercing_0_min').mouseleave(function() {
		var lvl = $('#rate_piercing_min_value').val();
		rate_click('piercing_min', lvl);	
	});
	
	$('#piercing_1_min').mouseenter(function() {
		rate_click('piercing_min', 1);	
	});
	
	$('#piercing_1_min').mouseleave(function() {
		var lvl = $('#rate_piercing_min_value').val();
		rate_click('piercing_min', lvl);	
	});
	
	$('#piercing_2_min').mouseenter(function() {
		rate_click('piercing_min', 2);	
	});
	
	$('#piercing_2_min').mouseleave(function() {
		var lvl = $('#rate_piercing_min_value').val();
		rate_click('piercing_min', lvl);	
	});
	
	$('#piercing_3_min').mouseenter(function() {
		rate_click('piercing_min', max_piercing);	
	});
	
	$('#piercing_3_min').mouseleave(function() {
		var lvl = $('#rate_piercing_min_value').val();
		rate_click('piercing_min', lvl);	
	});

	$('#haircut_1_min').mouseenter(function() {
		rate_click('haircut_min', 0);	
	});
	
	$('#haircut_1_min').mouseleave(function() {
		var lvl = $('#rate_haircut_min_value').val();
		rate_click('haircut_min', lvl);	
	});
	
	$('#haircut_2_min').mouseenter(function() {
		rate_click('haircut_min', 1);	
	});
	
	$('#haircut_2_min').mouseleave(function() {
		var lvl = $('#rate_haircut_min_value').val();
		rate_click('haircut_min', lvl);	
	});
	
	$('#haircut_3_min').mouseenter(function() {
		rate_click('haircut_min', 2);	
	});
	
	$('#haircut_3_min').mouseleave(function() {
		var lvl = $('#rate_haircut_min_value').val();
		rate_click('haircut_min', lvl);	
	});
		
	$('#haircut_4_min').mouseenter(function() {
		rate_click('haircut_min', 3);	
	});
	
	$('#haircut_4_min').mouseleave(function() {
		var lvl = $('#rate_haircut_min_value').val();
		rate_click('haircut_min', lvl);	
	});
	
	$('#party_0_max').mouseenter(function() {
		rate_click('party_max', 0);	
	});
	
	$('#party_0_max').mouseleave(function() {
		var lvl = $('#rate_party_max_value').val();
		rate_click('party_max', lvl);	
	});
	
	$('#party_1_max').mouseenter(function() {
		rate_click('party_max', 1);	
	});
	
	$('#party_1_max').mouseleave(function() {
		var lvl = $('#rate_party_max_value').val();
		rate_click('party_max', lvl);	
	});
	
	$('#party_2_max').mouseenter(function() {
		rate_click('party_max', 2);	
	});
	
	$('#party_2_max').mouseleave(function() {
		var lvl = $('#rate_party_max_value').val();
		rate_click('party_max', lvl);	
	});
	
	$('#party_3_max').mouseenter(function() {
		rate_click('party_max', max_party);	
	});
	
	$('#party_3_max').mouseleave(function() {
		var lvl = $('#rate_party_max_value').val();
		rate_click('party_max', lvl);	
	});
	
	$('#alcohol_0_max').mouseenter(function() {
		rate_click('alcohol_max', 0);	
	});
	
	$('#alcohol_0_max').mouseleave(function() {
		var lvl = $('#rate_alcohol_max_value').val();
		rate_click('alcohol_max', lvl);	
	});
	
	$('#alcohol_1_max').mouseenter(function() {
		rate_click('alcohol_max', 1);	
	});
	
	$('#alcohol_1_max').mouseleave(function() {
		var lvl = $('#rate_alcohol_max_value').val();
		rate_click('alcohol_max', lvl);	
	});
	
	$('#alcohol_2_max').mouseenter(function() {
		rate_click('alcohol_max', 2);	
	});
	
	$('#alcohol_2_max').mouseleave(function() {
		var lvl = $('#rate_alcohol_max_value').val();
		rate_click('alcohol_max', lvl);	
	});
	
	$('#alcohol_3_max').mouseenter(function() {
		rate_click('alcohol_max', max_alcohol);	
	});
	
	$('#alcohol_3_max').mouseleave(function() {
		var lvl = $('#rate_alcohol_max_value').val();
		rate_click('alcohol_max', lvl);	
	});
	
	$('#tobacco_0_max').mouseenter(function() {
		rate_click('tobacco_max', 0);	
	});
	
	$('#tobacco_0_max').mouseleave(function() {
		var lvl = $('#rate_tobacco_max_value').val();
		rate_click('tobacco_max', lvl);	
	});
	
	$('#tobacco_1_max').mouseenter(function() {
		rate_click('tobacco_max', 1);	
	});
	
	$('#tobacco_1_max').mouseleave(function() {
		var lvl = $('#rate_tobacco_max_value').val();
		rate_click('tobacco_max', lvl);	
	});
	
	$('#tobacco_2_max').mouseenter(function() {
		rate_click('tobacco_max', 2);	
	});
	
	$('#tobacco_2_max').mouseleave(function() {
		var lvl = $('#rate_tobacco_max_value').val();
		rate_click('tobacco_max', lvl);	
	});
	
	$('#tobacco_3_max').mouseenter(function() {
		rate_click('tobacco_max', 3);	
	});
	
	$('#tobacco_3_max').mouseleave(function() {
		var lvl = $('#rate_tobacco_max_value').val();
		rate_click('tobacco_max', lvl);	
	});
	
	$('#tobacco_4_max').mouseenter(function() {
		rate_click('tobacco_max', max_tobacco);	
	});
	
	$('#tobacco_4_max').mouseleave(function() {
		var lvl = $('#rate_tobacco_max_value').val();
		rate_click('tobacco_max', lvl);	
	});
	
	$('#tatoo_0_max').mouseenter(function() {
		rate_click('tatoo_max', 0);	
	});
	
	$('#tatoo_0_max').mouseleave(function() {
		var lvl = $('#rate_tatoo_max_value').val();
		rate_click('tatoo_max', lvl);	
	});
	
	$('#tatoo_1_max').mouseenter(function() {
		rate_click('tatoo_max', 1);	
	});
	
	$('#tatoo_1_max').mouseleave(function() {
		var lvl = $('#rate_tatoo_max_value').val();
		rate_click('tatoo_max', lvl);	
	});
	
	$('#tatoo_2_max').mouseenter(function() {
		rate_click('tatoo_max', 2);	
	});
	
	$('#tatoo_2_max').mouseleave(function() {
		var lvl = $('#rate_tatoo_max_value').val();
		rate_click('tatoo_max', lvl);	
	});
	
	$('#tatoo_3_max').mouseenter(function() {
		rate_click('tatoo_max', max_tatoo);	
	});
	
	$('#tatoo_3_max').mouseleave(function() {
		var lvl = $('#rate_tatoo_max_value').val();
		rate_click('tatoo_max', lvl);	
	});

	$('#piercing_0_max').mouseenter(function() {
		rate_click('piercing_max', 0);	
	});
	
	$('#piercing_0_max').mouseleave(function() {
		var lvl = $('#rate_piercing_max_value').val();
		rate_click('piercing_max', lvl);	
	});
	
	$('#piercing_1_max').mouseenter(function() {
		rate_click('piercing_max', 1);	
	});
	
	$('#piercing_1_max').mouseleave(function() {
		var lvl = $('#rate_piercing_max_value').val();
		rate_click('piercing_max', lvl);	
	});
	
	$('#piercing_2_max').mouseenter(function() {
		rate_click('piercing_max', 2);	
	});
	
	$('#piercing_2_max').mouseleave(function() {
		var lvl = $('#rate_piercing_max_value').val();
		rate_click('piercing_max', lvl);	
	});
	
	$('#piercing_3_max').mouseenter(function() {
		rate_click('piercing_max', max_piercing);	
	});
	
	$('#piercing_3_max').mouseleave(function() {
		var lvl = $('#rate_piercing_max_value').val();
		rate_click('piercing_max', lvl);	
	});

	$('#haircut_1_max').mouseenter(function() {
		rate_click('haircut_max', 0);	
	});
	
	$('#haircut_1_max').mouseleave(function() {
		var lvl = $('#rate_haircut_max_value').val();
		rate_click('haircut_max', lvl);	
	});
	
	$('#haircut_2_max').mouseenter(function() {
		rate_click('haircut_max', 1);	
	});
	
	$('#haircut_2_max').mouseleave(function() {
		var lvl = $('#rate_haircut_max_value').val();
		rate_click('haircut_max', lvl);	
	});
	
	$('#haircut_3_max').mouseenter(function() {
		rate_click('haircut_max', 2);	
	});
	
	$('#haircut_3_max').mouseleave(function() {
		var lvl = $('#rate_haircut_max_value').val();
		rate_click('haircut_max', lvl);	
	});
		
	$('#haircut_4_max').mouseenter(function() {
		rate_click('haircut_max', 3);	
	});
	
	$('#haircut_4_max').mouseleave(function() {
		var lvl = $('#rate_haircut_max_value').val();
		rate_click('haircut_max', lvl);	
	});
}

silhouette_sliders('min');
silhouette_sliders('max');

function drawShape(id, is_selected) {
	// get the canvas element using the DOM
	var canvas = document.getElementById(id);
	
	var shape = new RoundedCornerSquare(id);
	
	// Make sure we don't execute when canvas isn't supported
	if (canvas.getContext) {
		shape.ctx = canvas.getContext('2d');
		shape.setSelection(is_selected);
		shape.draw();
		canvas.addEventListener(event_str.click, function(event) {
			var id = $(this).attr('id');
			var canvas = document.getElementById(id);
			// Make sure we don't execute when canvas isn't supported
			if (canvas.getContext) {
				id = id.split('_');
				var obj = user.filters.physique.color[id[id.length - 2]];
				if (!shape.isSelected()) {
					obj.push(id[id.length - 1]);
				} else {
					obj.splice($.inArray(id[id.length - 1], obj), 1);
				}
				user.filters.physique.color[id.length - 2] = obj; //usefull??
				if (!window.localStorage) {
					//alert('no local storage available');
				} else {
					localStorage.setItem('user_tmp', JSON.stringify(user));
				}
				shape.ctx = canvas.getContext('2d');
				shape.clear();
				shape.setSelection(!shape.isSelected());
				shape.draw();
			}
		});
	} else {
		//alert('squares can\'t be displayed.');
	}
}

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

$("#lookingfor_value").change(function() {
	var val = $(this).val(),
		silhouette_woman_class = 'silhouette_woman',
		silhouette_man_class = 'silhouette_man',
		silhouette_min_class,
		silhouette_max_class;
		
	if (val == woman_gender) {
		 silhouette_min_class = silhouette_woman_class;
		 silhouette_max_class = silhouette_woman_class;
	} else if (val == man_gender) {
		 silhouette_min_class = silhouette_man_class;
		 silhouette_max_class = silhouette_man_class;
	} else {
		 silhouette_min_class = silhouette_woman_class;
		 silhouette_max_class = silhouette_man_class;	
	}
	$('#silhouette_img_min').removeClass().addClass(silhouette_min_class);
	$('#silhouette_img_max').removeClass().addClass(silhouette_max_class);
	
	user.filters.personality.relationship.gender = val;
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		localStorage.setItem('user_tmp', JSON.stringify(user));
	}
});

function check_height(elem) {
	var elem = $(this),
		val = elem.val();
	if (val > 2.4)
	{
		elem.val(2.4);
	} else if (val < 0.5) { 
		elem.val(0.5);
	}
}

function check_weight() {
	var elem = $(this),
		val = elem.val();
	if (val > 160)
	{
		elem.val(160);
	} else if (val < 30) { 
		elem.val(30);
	}
}

$('#height_min').keypress(is_number).on('blur', check_height);
$('#weight_min').keypress(is_number).on('blur', check_weight);
$('#height_max').keypress(is_number).on('blur', check_height);
$('#weight_max').keypress(is_number).on('blur', check_weight);

function init() {
	
	make_dropdown('#relationship');

	preload(['.ico_cancel_glow',
			 '.ico_save_glow',
			 '.edit_physique']);
			 
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
			
		$('#slider_height_min').bind('slidechange', function(event, ui) {
			user.filters.physique.size.min.height = ui.value;
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		});
		
		$('#slider_height_max').bind('slidechange', function(event, ui) {
			user.filters.physique.size.max.height = ui.value;
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		});
		
		$('#slider_weight_min').bind('slidechange', function(event, ui) {
			user.filters.physique.size.min.weight = ui.value;
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		});
		
		$('#slider_weight_max').bind('slidechange', function(event, ui) {
			user.filters.physique.size.max.weight = ui.value;
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		});
		
		$('#slider_agerange').bind('slidechange', function(event, ui) {
			user.filters.profile.min.age = ui.values[0];
			user.filters.profile.max.age = ui.values[1];
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		});
	}
}
translate('profile');