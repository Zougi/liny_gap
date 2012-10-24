
var origin_page = 'profile.html',
		subscribe_portrait = 'subscribe.html',
		subscrbe_landscape = 'index.html';
$('.ico_save').on(event_str.click, function() {
	
	if (requiredFieldsOK()) {
		
		//user has id
		if (user.id == '') {
			alert('you must be logged in to update a profile');
			if (mql.matches) {
				window.location.href = subscribe_portrait;
			} else {
				window.location.href = subscribe_landscape;
			}
		}
		
		//update online profile
		var comm = new Communication();
		if (comm.online) {
			comm.user.set(user);
			var success = function(jsonData) {
				if (!window.localStorage) {
					if (typeof debug != 'undefined' && debug) {
						console.log('no local storage available');
					}
				} else {
					localStorage.setItem('user', JSON.stringify(getObj(user, jsonData.user)));
					localStorage.removeItem('user_tmp');
				}
				window.location.href = origin_page;
			},
			error = function() {
				alert('can\'t save profile. Try again later');
			};
			comm.user.update(success);
		} else {
			alert('can\'t contact server. Maybe your not connected to the internet?');
		}
		
	}
	
});

$('.ico_cancel').click(function() {
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		localStorage.removeItem('user_tmp');
	}
	window.location.href = origin_page;
});

$('.autocompletebox').bind('CreateInputElem', function(event, val) {
	var elem = $(this),
		bind_name = elem.data('bind'),
		array_val = bind_getter(bind_name);

	if (typeof array_val != 'undefined' && array_val != '') {
		if ($.inArray(val, array_val) == -1) {
			array_val.push(val);
		}
	} else {
		array_val = [];
		array_val.push(val);
	}
	
	bind_setter(bind_name, array_val);
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		localStorage.setItem('user_tmp', JSON.stringify(user));
	}
});

$('.autocompletebox').bind('DeleteInputElem', function(event, val_toDelete) {
	var bind_name = $(this).data('bind'),
		val = bind_getter(bind_name);
	if (typeof val != 'undefined' && val != '') {
		val.splice(val.indexOf(val_toDelete), 1);
	
		bind_setter(bind_name, val);
		if (!window.localStorage) {  
			//alert('no local storage available');
		} else {
			localStorage.setItem('user_tmp', JSON.stringify(user));
		}
	}
});


make_dropdown('#color_hair');
make_dropdown('#color_eyes');
make_dropdown('#color_skin');

function fillInputs(user_stored) {
	user = user_stored;
	var elements = $(document).find('[data-bind]');
	
	elements.each(function() {
		var elem = $(this),
			bind_name = elem.data('bind');
			
		var val = bind_getter(bind_name);
		
		if (typeof val != 'undefined' && val != '') {
			if (elem.hasClass('autocompletebox')) {
				for (var i = 0; i < val.length; i++) {
					inputElem_create(elem, val[i])
				}
			} else {
				elem.val(val);	
				fillInputs_specifics(elem, bind_name, val);
			}
		}
	});
}

var height_tmp;
function fillInputs_specifics(elem, bind_name, val) {
	if (bind_name == undefined || bind_name == '' || val == undefined || val == '') return;
	var parent = elem.parent();
	var children;
	if (bind_name.indexOf('rate') != -1) {
		var bindTab = bind_name.split('.'),
			rate_name = bindTab[bindTab.length - 1];
		if (typeof val == 'undefined') {
			val = 0;
		}
		rate_modifier(rate_name, parseInt(val));
	} else if (bind_name.indexOf('haircut') != -1) {
		children = parent.find('[id=rate_haircut]').children();
		rate_modifier('haircut', val);
	} else if (bind_name.indexOf('color') != -1) {
		children = parent.find('[data-color=' + val + ']');
		var body_part = children.parent().parent().parent().attr('id').substr('color_'.length),
			is_hair = (body_part == 'hair');
			
		parent.children('ul').children(':first-child').text(children.text()).removeClass().addClass('color_' + val);
		change_bodypart_color(val, body_part, is_hair);
	} else if (bind_name.indexOf('height') != -1) {
		height_tmp = val;
	} else if (bind_name.indexOf('weight') != -1) {
		silhouette_sliders(null, height_tmp, val);
	} else if (bind_name == 'user.profile.gender') {
		if (val == 'man') {
			//man_Click();
			gender = 'man';
			if ($('.avatarImg').attr('src') == 'css/app/images/profile/woman/avatar_blank.png') {
				$('.avatarImg').attr('src', 'css/app/images/profile/man/avatar_blank.png');
			}
	
			$('#skin').removeClass().addClass('skin man_skin man_skin_' + lastColor_skin);
			$('#eyes').removeClass().addClass('eyes man_eyes man_eyes_' + lastColor_eyes);
			$('#hair').removeClass().addClass('hair man_hair_short man_hair_short_' + lastColor_hair);
			
			$('#silhouette_img').removeClass().addClass('silhouette_man');
			sign_switcher_man_Click();
			
			//repeat: dirty
			$('#live_with').find('div').each(function(i, e) {
				var classs = e.className;
				var class_prefix = classs.substr(0, classs.lastIndexOf('_'));
				if (classs.substr(classs.lastIndexOf('_')) != '_blank') {
					e.className = class_prefix + '_man';
				}
			});
		} else {
			//woman_Click();
			if ($('.avatarImg').attr('src') == 'css/app/images/profile/man/avatar_blank.png') {
				$('.avatarImg').attr('src', 'css/app/images/profile/woman/avatar_blank.png');
			}
			gender = 'woman';
			$('#skin').removeClass().addClass('skin woman_skin woman_skin_' + lastColor_skin);
			$('#eyes').removeClass().addClass('eyes woman_eyes woman_eyes_' + lastColor_eyes);
			$('#hair').removeClass().addClass('hair woman_hair_long woman_hair_long_' + lastColor_hair);
	
			sign_switcher_woman_Click();
		}
	} else if (bind_name.indexOf('license') != -1) {
		if (val == 'car' || val == 'both') {
			$('#driving_license_car').removeClass().addClass('driving_license_car');
		}
		if (val == 'motorcycle' || val == 'both') {
			$('#driving_license_motorcycle').removeClass().addClass('driving_license_motorcycle');
		}
	} else if (bind_name.indexOf('live_with') != -1) {
		$('#live_with').find('div').each(function(i, e) {
			var classs = e.className;
			var class_prefix = classs.substr(0, classs.lastIndexOf('_'));
			e.className = class_prefix + '_' + ((i == val) ? (user.profile.gender == '' ? 'woman' : user.profile.gender) : 'blank');
		});
		$('#live_with_text').text(live_with_text[val]);
	} else if (bind_name.indexOf('profile') != -1) {
		if (bind_name.indexOf('birthdate') != -1) {
			check_input(elem, isDate(val) );
		} else if (bind_name.indexOf('email') != -1) {
			check_input(elem, isValidEmailAddress(val) );
		} else {
			check_input(elem, true);
		}
	} else if (bind_name.indexOf('avatar') != -1) {
		elem.attr('src', val);
	}
}

function binding_input() {
	var elem = $(this),
		bind_name = elem.data('bind'),
		val = elem.val();
		
	if (typeof bind_name == 'undefined') {
		return;
	}
	
	if (!elem.hasClass('autocompletebox')) {
		bind_setter(bind_name, val);
		if (!window.localStorage) {  
			//alert('no local storage available');
		} else {
			localStorage.setItem('user_tmp', JSON.stringify(user));
		}
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

	
/* -- portrait -- */

/* make right vertical color choice bar  */
var gender = 'woman',
	colors = colors_skin;
color_select('white', 'skin');
	
$('#eyes_empty').on(event_str.start, function(event) {
	colors = colors_eyes;
	color_select(null, 'eyes');
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
});

$('#skin_empty').on(event_str.start, function(event) {
	colors = colors_skin;
	color_select(null, 'skin');
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
});

$('#hair').on(event_str.start, function(event) {
	colors = colors_hair;
	color_select(null, 'hair_short');
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
});

/* swipe */
var positionX = 0,
	positionY = 0;
$('.portrait').on(event_str.start, function(event) {
	positionX = event.pageX;
	positionY = event.pageY;
});

$('.portrait').on(event_str.end, function(event) {
	var margeY = 30,
		margeX = 70;
	if (event.pageY < positionY + margeY && event.pageY > positionY -margeY) {
		if (event.pageX > positionX + margeX) {
			hairCut_switcher('#hair', 'right');
		} else if (event.pageX < positionX - margeX) {
			hairCut_switcher('#hair', 'left');
		}
	}
});


/* hilight the good onglet on href arrival */
var hilight_def = 'edit_personality';
function hilight_default() {
	$('#navbar').removeClass('edit_personality edit_physique').addClass(hilight_def);
	
}

/* display personality page */
function bt_personality_Click() {
	hilight_def = 'edit_personality';
	$('#infos').css('display', 'inline');
	$('#global_portrait').css('display', 'none');
	$('#tab_physique').css('display', 'none');
	$('#tab_personality').css('display', 'inline');
}

/* display physique page */
function bt_physique_Click() {
	hilight_def = 'edit_physique';
	
	$('#infos').css('display', 'none');
	$('#global_portrait').css('display', 'inline');
	$('#tab_physique').css('display', 'inline');
	$('#tab_personality').css('display', 'none');
	
	preload([ '.woman_skin_white',
			  '.woman_skin_brown',
			  '.woman_skin_yellow',
			  '.woman_skin_black',
			  '.woman_eyes_blue',
			  '.woman_eyes_brown',
			  '.woman_eyes_green',
			  '.woman_hair_short_black',
			  '.woman_hair_short_black',
			  '.woman_hair_short_blond',
			  '.woman_hair_short_brown',
			  '.woman_hair_short_grey',
			  '.woman_hair_short_white',
			  '.woman_hair_short_ginger',
			  '.woman_hair_medium_black',
			  '.woman_hair_medium_black',
			  '.woman_hair_medium_blond',
			  '.woman_hair_medium_brown',
			  '.woman_hair_medium_grey',
			  '.woman_hair_medium_white',
			  '.woman_hair_medium_ginger',
			  '.woman_hair_long_black',
			  '.woman_hair_long_black',
			  '.woman_hair_long_blond',
			  '.woman_hair_long_brown',
			  '.woman_hair_long_grey',
			  '.woman_hair_long_white',
			  '.woman_hair_long_ginger'
	]);
	
	if (event_str.hover != null) {
		preload([
			  '.tatoo_0', '.tatoo_0_blank',
			  '.tatoo_1', '.tatoo_1_blank',
			  '.tatoo_2', '.tatoo_2_blank',
			  '.tatoo_3', '.tatoo_3_blank',
			  '.piercing_0', '.piercing_0_blank',
			  '.piercing_1', '.piercing_1_blank',
			  '.piercing_2', '.piercing_2_blank',
			  '.piercing_3', '.piercing_3_blank'
		]);
	}
		
}

$('#bt_personality').on(event_str.click, bt_personality_Click);
$('#bt_physique').on(event_str.click, bt_physique_Click);

/* animate man/woman signs */
sign_switcher('#man', '#woman');
sign_switcher('#man_text', '#woman_text');

/* switch woman portrait to man */
function man_Click() {
	gender = 'man';
	user.profile.gender = gender;
	
	if (!window.localStorage) { 
		//alert('no local storage available');
	} else {
		localStorage.setItem('user_tmp', JSON.stringify(user));
	}
	
	$('#skin').removeClass().addClass('skin man_skin man_skin_' + lastColor_skin);
	$('#eyes').removeClass().addClass('eyes man_eyes man_eyes_' + lastColor_eyes);
	$('#hair').removeClass().addClass('hair man_hair_short man_hair_short_' + lastColor_hair);
	update_haircut_rate('short');
	
	$('#silhouette_img').removeClass().addClass('silhouette_man');
	
	if ($('.avatarImg').attr('src') == 'css/app/images/profile/woman/avatar_blank.png') {
		$('.avatarImg').attr('src', 'css/app/images/profile/man/avatar_blank.png');
	}
		
	preload([	'.man_skin_white',
				'.man_skin_brown',
				'.man_skin_yellow',
				'.man_skin_black',
				'.man_eyes_blue',
				'.man_eyes_brown',
				'.man_eyes_green',
				'.man_hair_short_black',
				'.man_hair_short_black',
				'.man_hair_short_blond',
				'.man_hair_short_brown',
				'.man_hair_short_grey',
				'.man_hair_short_white',
				'.man_hair_short_ginger',
				'.man_hair_medium_black',
				'.man_hair_medium_black',
				'.man_hair_medium_blond',
				'.man_hair_medium_brown',
				'.man_hair_medium_grey',
				'.man_hair_medium_white',
				'.man_hair_medium_ginger',
				'.man_hair_long_black',
				'.man_hair_long_black',
				'.man_hair_long_blond',
				'.man_hair_long_brown',
				'.man_hair_long_grey',
				'.man_hair_long_white',
				'.man_hair_long_ginger'
	]);
	
	$('#live_with').find('div').each(function(i, e) {
		var classs = e.className;
		if (classs.indexOf('_blank') == -1) {
			var class_prefix = classs.substr(0, classs.lastIndexOf('_'));
			e.className = class_prefix + '_man';
		}
	});
}

/* switch man portrait to woman */
function woman_Click() {
	gender = 'woman';
	user.profile.gender = gender;
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		localStorage.setItem('user_tmp', JSON.stringify(user));
	}
	
	$('#skin').removeClass().addClass('skin woman_skin woman_skin_' + lastColor_skin);
	$('#eyes').removeClass().addClass('eyes woman_eyes woman_eyes_' + lastColor_eyes);
	$('#hair').removeClass().addClass('hair woman_hair_long woman_hair_long_' + lastColor_hair);
	update_haircut_rate('long');
	
	$('#silhouette_img').removeClass().addClass('silhouette_woman');
	
	if ($('.avatarImg').attr('src') == 'css/app/images/profile/man/avatar_blank.png') {
		$('.avatarImg').attr('src', 'css/app/images/profile/woman/avatar_blank.png');
	}
	
	$('#live_with').find('div').each(function(i, e) {
		var classs = e.className;
		if (classs.indexOf('_blank') == -1) {
			var class_prefix = classs.substr(0, classs.lastIndexOf('_'));
			e.className = class_prefix + '_woman';
		}
	});
}

/* party rate */

$('#party_0').on(event_str.click, function() {
	rate_modifier('party', 0);
});

$('#party_1').on(event_str.click, function() {
	rate_modifier('party', 1);
});

$('#party_2').on(event_str.click, function() {
	rate_modifier('party', 2);
});

$('#party_3').on(event_str.click, function() {
	rate_modifier('party', max_party);
});


/* alcohol rate */

$('#alcohol_0').on(event_str.click, function() {
	rate_modifier('alcohol', 0);
});

$('#alcohol_1').on(event_str.click, function() {
	rate_modifier('alcohol', 1);
});

$('#alcohol_2').on(event_str.click, function() {
	rate_modifier('alcohol', 2);
});

$('#alcohol_3').on(event_str.click, function() {
	rate_modifier('alcohol', max_alcohol);
});


/* tobacco rate */

$('#tobacco_0').on(event_str.click, function() {
	rate_modifier('tobacco', 0);
});

$('#tobacco_1').on(event_str.click, function() {
	rate_modifier('tobacco', 1);
});

$('#tobacco_2').on(event_str.click, function() {
	rate_modifier('tobacco', 2);
});

$('#tobacco_3').on(event_str.click, function() {
	rate_modifier('tobacco', 3);
});

$('#tobacco_4').on(event_str.click, function() {
	rate_modifier('tobacco', max_tobacco);
});


/* piercing rate */

$('#piercing_0').on(event_str.click, function() {
	rate_modifier('piercing', 0);
});

$('#piercing_1').on(event_str.click, function() {
	rate_modifier('piercing', 1);
});

$('#piercing_2').on(event_str.click, function() {
	rate_modifier('piercing', 2);
});

$('#piercing_3').on(event_str.click, function() {
	rate_modifier('piercing', max_piercing);
});

/* tatoo rate */

$('#tatoo_0').on(event_str.click, function() {
	rate_modifier('tatoo', 0);
});

$('#tatoo_1').on(event_str.click, function() {
	rate_modifier('tatoo', 1);
});

$('#tatoo_2').on(event_str.click, function() {
	rate_modifier('tatoo', 2);
});

$('#tatoo_3').on(event_str.click, function() {
	rate_modifier('tatoo', max_tatoo);
});


/* haircut rate */

$('#haircut_1').on(event_str.click, function() {
	rate_modifier('haircut', 0);
});

$('#haircut_2').on(event_str.click, function() {
	rate_modifier('haircut', 1);
});

$('#haircut_3').on(event_str.click, function() {
	rate_modifier('haircut', 2);	
});

$('#haircut_4').on(event_str.click, function() {
	rate_modifier('haircut', max_haircut);
});
 
// Add a media query change listener
var display_personality = "inline",
	display_physique = "none;";
mql.addListener(function(m) {
  if(!m.matches) {
		$("#tab_personality").css("display", "inline");
		$("#tab_physique").css("display", "inline");
		$('#global_portrait').css('display', 'inline');
		$('#infos').css('display', 'inline');
  } else {
		if (hilight_def == 'edit_physique') {
			$("#tab_personality").css("display", "none");
			$("#tab_physique").css("display", "inline");
			$('#global_portrait').css('display', 'inline');
			$('#infos').css('display', 'none');
		} else {
			$("#tab_personality").css("display", "inline");
			$("#tab_physique").css("display", "none");
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

/* display avatar before upload, right after pic chose by edit button */
/* experimentale, ne fonctionne pas en local sur certains navigateurs */
function handleFileSelect(event) {
	try {
		var file = (event.target.files || event.originalEvent.dataTransfer.files)[0];

		if (file.type != undefined && !file.type.match('image.*')) {
			alert('File must be an image');
			return;
		}
		var reader = new FileReader();
		reader.onload = function(event) {
			var avatarImg = $('.avatarImg');
			var result = event.target.result;
			avatarImg.attr('src', result);
			avatarImg.css('opacity', 1);
			user.avatar = result;
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		}
	  reader.readAsDataURL(file);
	} catch(e) {
		if (typeof debug != 'undefined' && debug) {
			console.log('Display error');
			console.log(e);
		}
	}
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
	return false;
}
document.getElementById('avatarfile').addEventListener('change', handleFileSelect, false);

$('#man').on(event_str.click, man_Click);
$('#woman').on(event_str.click, woman_Click);

$('.avatar a').on(event_str.click, function() {
	$('#avatarfile').trigger('click');
});
	
if (event_str.hover != null) {
	$('#bt_personality').hover(function() {
		$('#navbar').removeClass('edit_physique').addClass('edit_personality');
	}, hilight_default);
	$('#bt_physique').hover(function() {
		$('#navbar').removeClass('edit_personality').addClass('edit_physique');
	}, hilight_default);
	
	$('#party_0').mouseenter(function() {
		rate_click('party', 0);	
	});
	
	$('#party_0').mouseleave(function() {
		var lvl = $('#rate_party_value').val();
		rate_click('party', lvl);
	});
	
	$('#party_1').mouseenter(function() {
		rate_click('party', 1);
	});
	
	$('#party_1').mouseleave(function() {
		var lvl = $('#rate_party_value').val();
		rate_click('party', lvl);	
	});
	
	$('#party_2').mouseenter(function() {
		rate_click('party', 2);
	});
	
	$('#party_2').mouseleave(function() {
		var lvl = $('#rate_party_value').val();
		rate_click('party', lvl);
	});
	
	$('#party_3').mouseenter(function() {
		rate_click('party', max_party);
	});
	
	$('#party_3').mouseleave(function() {
		var lvl = $('#rate_party_value').val();
		rate_click('party', lvl);
	});
	
	$('#alcohol_0').mouseenter(function() {
		rate_click('alcohol', 0);	
	});
	
	$('#alcohol_0').mouseleave(function() {
		var lvl = $('#rate_alcohol_value').val();
		rate_click('alcohol', lvl);	
	});
	
	$('#alcohol_1').mouseenter(function() {
		rate_click('alcohol', 1);	
	});
	
	$('#alcohol_1').mouseleave(function() {
		var lvl = $('#rate_alcohol_value').val();
		rate_click('alcohol', lvl);	
	});
	
	$('#alcohol_2').mouseenter(function() {
		rate_click('alcohol', 2);	
	});
	
	$('#alcohol_2').mouseleave(function() {
		var lvl = $('#rate_alcohol_value').val();
		rate_click('alcohol', lvl);	
	});
	
	$('#alcohol_3').mouseenter(function() {
		rate_click('alcohol', max_alcohol);	
	});
	
	$('#alcohol_3').mouseleave(function() {
		var lvl = $('#rate_alcohol_value').val();
		rate_click('alcohol', lvl);	
	});
	
	$('#tobacco_0').mouseenter(function() {
		rate_click('tobacco', 0);	
	});
	
	$('#tobacco_0').mouseleave(function() {
		var lvl = $('#rate_tobacco_value').val();
		rate_click('tobacco', lvl);	
	});
	
	$('#tobacco_1').mouseenter(function() {
		rate_click('tobacco', 1);	
	});
	
	$('#tobacco_1').mouseleave(function() {
		var lvl = $('#rate_tobacco_value').val();
		rate_click('tobacco', lvl);	
	});
	
	$('#tobacco_2').mouseenter(function() {
		rate_click('tobacco', 2);	
	});
	
	$('#tobacco_2').mouseleave(function() {
		var lvl = $('#rate_tobacco_value').val();
		rate_click('tobacco', lvl);	
	});
	
	$('#tobacco_3').mouseenter(function() {
		rate_click('tobacco', 3);	
	});
	
	$('#tobacco_3').mouseleave(function() {
		var lvl = $('#rate_tobacco_value').val();
		rate_click('tobacco', lvl);	
	});
	
	$('#tobacco_4').mouseenter(function() {
		rate_click('tobacco', max_tobacco);	
	});
	
	$('#tobacco_4').mouseleave(function() {
		var lvl = $('#rate_tobacco_value').val();
		rate_click('tobacco', lvl);	
	});
	
	$('#tatoo_0').mouseenter(function() {
		rate_click('tatoo', 0);	
	});
	
	$('#tatoo_0').mouseleave(function() {
		var lvl = $('#rate_tatoo_value').val();
		rate_click('tatoo', lvl);	
	});
	
	$('#tatoo_1').mouseenter(function() {
		rate_click('tatoo', 1);	
	});
	
	$('#tatoo_1').mouseleave(function() {
		var lvl = $('#rate_tatoo_value').val();
		rate_click('tatoo', lvl);	
	});
	
	$('#tatoo_2').mouseenter(function() {
		rate_click('tatoo', 2);	
	});
	
	$('#tatoo_2').mouseleave(function() {
		var lvl = $('#rate_tatoo_value').val();
		rate_click('tatoo', lvl);	
	});
	
	$('#tatoo_3').mouseenter(function() {
		rate_click('tatoo', max_tatoo);	
	});
	
	$('#tatoo_3').mouseleave(function() {
		var lvl = $('#rate_tatoo_value').val();
		rate_click('tatoo', lvl);	
	});

	$('#piercing_0').mouseenter(function() {
		rate_click('piercing', 0);	
	});
	
	$('#piercing_0').mouseleave(function() {
		var lvl = $('#rate_piercing_value').val();
		rate_click('piercing', lvl);	
	});
	
	$('#piercing_1').mouseenter(function() {
		rate_click('piercing', 1);	
	});
	
	$('#piercing_1').mouseleave(function() {
		var lvl = $('#rate_piercing_value').val();
		rate_click('piercing', lvl);	
	});
	
	$('#piercing_2').mouseenter(function() {
		rate_click('piercing', 2);	
	});
	
	$('#piercing_2').mouseleave(function() {
		var lvl = $('#rate_piercing_value').val();
		rate_click('piercing', lvl);	
	});
	
	$('#piercing_3').mouseenter(function() {
		rate_click('piercing', max_piercing);	
	});
	
	$('#piercing_3').mouseleave(function() {
		var lvl = $('#rate_piercing_value').val();
		rate_click('piercing', lvl);	
	});
/*
	$('#haircut_1').mouseenter(function() {
		rate_click('haircut', 0);	
	});
	
	$('#haircut_1').mouseleave(function() {
		var lvl = $('#rate_haircut_value').val();
		rate_click('haircut', lvl);	
	});
	
	$('#haircut_2').mouseenter(function() {
		rate_click('haircut', 1);	
	});
	
	$('#haircut_2').mouseleave(function() {
		var lvl = $('#rate_haircut_value').val();
		rate_click('haircut', lvl);	
	});
	
	$('#haircut_3').mouseenter(function() {
		rate_click('haircut', 2);	
	});
	
	$('#haircut_3').mouseleave(function() {
		var lvl = $('#rate_haircut_value').val();
		rate_click('haircut', lvl);	
	});
		
	$('#haircut_4').mouseenter(function() {
		rate_click('haircut', max_haircut);	
	});
	
	$('#haircut_4').mouseleave(function() {
		var lvl = $('#rate_haircut_value').val();
		rate_click('haircut', lvl);	
	});
*/
}

doubleico_switcher('car', 'motorcycle', 'driving_license', false);
doubleico_switcher( 'motorcycle', 'car', 'driving_license', false);

function init() {
	preload(['.ico_cancel_glow',
			 '.ico_save_glow',
			 '.edit_physique',
			 'preload_bt_avatar_edit'
	]);
	silhouette_sliders();
	
	if (!window.localStorage) {  
		//alert('no local storage available');
	} else {
		var user_tmp = localStorage.getItem('user_tmp'),
			user_stored = localStorage.getItem('user');
		
		if (user_tmp !== null) {
			fillInputs(JSON.parse(user_tmp));
		} else if (user_stored !== null) {
			var comm = new Communication();
			if (comm.online) {
				comm.user.set(user);
				var success = function(jsonData) {
					var u = getObj(user, JSON.parse(jsonData).user);
					fillInputs(u);
					//localStorage.setItem('user', jsonData);
				};
				comm.user.getProfile(success);
			} else {
				fillInputs(user_stored);
			}
		}
		
		$('#slider_height').on('slidechange', function(event, ui) {
			user.physique.size.height = ui.value;
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		});
		
		$('#slider_weight').on('slidechange', function(event, ui) {
			user.physique.size.weight = ui.value;
			if (!window.localStorage) {  
				//alert('no local storage available');
			} else {
				localStorage.setItem('user_tmp', JSON.stringify(user));
			}
		});
	}
			 
	if (event_str.hover != null) {
		preload([ '.party_0', '.party_0_blank',
				  '.party_1', '.party_1_blank',
			 	  '.party_2', '.party_2_blank',
			 	  '.party_3', '.party_3_blank',
			 	  '.alcohol_0', '.alcohol_0_blank',
			 	  '.alcohol_1', '.alcohol_1_blank',
			 	  '.alcohol_2', '.alcohol_2_blank',
			 	  '.alcohol_3', '.alcohol_3_blank',
			 	  '.tobacco_0', '.tobacco_0_blank',
			 	  '.tobacco_1', '.tobacco_1_blank',
			 	  '.tobacco_2', '.tobacco_2_blank',
			 	  '.tobacco_3', '.tobacco_3_blank',
			 	  '.tobacco_4', '.tobacco_4_blank',
			 	  '.driving_license_car',
			 	  '.driving_license_motorcycle'
		]);
	}
}

//because some bowser doesn't support type=number 
$('#height').on({
	keypress: function() { return (/\d|\./.test(String.fromCharCode(event.which) )); },
	blur: function() {
		var elem = $(this),
			val = elem.val();
		if (val > 2.4)
		{
			elem.val(2.4);
		} else if (val < 0.5) { 
			elem.val(0.5);
		}
	}
});

$('#weight').on({
	keypress: function() { return (/\d|\./.test(String.fromCharCode(event.which) )); },
	blur: function() {
		var elem = $(this),
			val = elem.val();
		if (val > 160)
		{
			elem.val(160);
		} else if (val < 30) { 
			elem.val(30);
		}
	}
});

$('.avatarImg').on({
    dragenter: function() {
        $(this).css('opacity', 0.2);
        return false;
    },
    dragleave: function() {
        $(this).css('opacity', 1);
        return false;
    },
    drop: handleFileSelect
});


var live_with_childs = $('#live_with').find('div');

function fill_childs(element) {
	live_with_childs.each(function(i, e) {
		var classs = e.className;
		var class_prefix = classs.substr(0, classs.lastIndexOf('_'));
		if (e != element) {
			e.className = class_prefix + '_blank';
		} else {
			e.className = class_prefix + ($('#gender').val() == 'man' ? '_man' : '_woman');
		}
	});
}

var live_with_childs_state;
function save_state() {
	live_with_childs_state = [];
	live_with_childs.each(function(i, e) {
		live_with_childs_state.push(e.className);
	});
	live_with_childs_state.reverse();
	live_with_text_saved = $('#live_with_text').text();
}

function back_state() {
	live_with_childs.each(function(i, e) {
		e.className = live_with_childs_state.pop();
	});
}

var live_with_text_saved;
live_with_childs.each(function(index, element) {
	element.addEventListener(event_str.click, function() {
		fill_childs(element);
		if (event_str.hover != null) {
			save_state();
		}
		$('#live_with_value').val(index);
		$('#live_with_text').text(live_with_text[index]);
		user.profile.live_with = '' + index;
		if (!window.localStorage) {  
			//alert('no local storage available');
		} else {
			localStorage.setItem('user_tmp', JSON.stringify(user));
		}
	});
	if (event_str.hover != null) {
		$(this).on(event_str.hover.start, function() {
			save_state();
			fill_childs(element);
			$('#live_with_text').text(live_with_text[index]);
		});
		$(this).on(event_str.hover.end, function() {
			back_state();
			$('#live_with_text').text(live_with_text_saved);
		});
	}
});

/*
$('#hair').draggable({ 
	axis: 'x',
});*/
translate('profile');