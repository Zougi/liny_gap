/**
 * @fileOverview rates makers for profiles & filters
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

var max_party = 3,
 	max_alcohol = 3,
 	max_tobacco = 4,
 	max_piercing = 3,
 	max_tatoo = 3,
 	max_haircut = 3;

var party_text,
	alcohol_text,
	tobacco_text,
	piercing_text,
	tatoo_text,
	haircut_text;

function fill_rates() {
	party_text = [
		$.t('personality.rate.party.lvl0'),
		$.t('personality.rate.party.lvl1'),
		$.t('personality.rate.party.lvl2'),
		$.t('personality.rate.party.lvl3')
	];
	alcohol_text = [
		$.t('personality.rate.alcohol.lvl0'),
		$.t('personality.rate.alcohol.lvl1'),
		$.t('personality.rate.alcohol.lvl2'),
		$.t('personality.rate.alcohol.lvl3')
	];
	tobacco_text = [
		$.t('personality.rate.tobacco.lvl0'),
		$.t('personality.rate.tobacco.lvl1'),
		$.t('personality.rate.tobacco.lvl2'),
		$.t('personality.rate.tobacco.lvl3'),
		$.t('personality.rate.tobacco.lvl4')
	];
	piercing_text = [
		$.t('physique.rate.piercing.lvl0'),
		$.t('physique.rate.piercing.lvl1'),
		$.t('physique.rate.piercing.lvl2'),
		$.t('physique.rate.piercing.lvl3')
	];
	tatoo_text = [
		$.t('physique.rate.tatoo.lvl0'),
		$.t('physique.rate.tatoo.lvl1'),
		$.t('physique.rate.tatoo.lvl2'),
		$.t('physique.rate.tatoo.lvl3')
	];
	haircut_text = [
		$.t('physique.rate.haircut.lvl1'),
		$.t('physique.rate.haircut.lvl2'),
		$.t('physique.rate.haircut.lvl3'),
		$.t('physique.rate.haircut.lvl4')
	];
	driving_license_text = [
		$.t('personality.driving_license.none'),
		$.t('personality.driving_license.car'),
		$.t('personality.driving_license.motorcycle'),
		$.t('personality.driving_license.both')
	];
 live_with_text = [
		$.t('personality.live_with.parents'),
		$.t('personality.live_with.mates'),
		$.t('personality.live_with.alone')
	];
}

// fill rate pics
function rate_click(name, lvl) {
	var origin_name = (name.indexOf('_')) ? name.split('_')[0] : name;
	try {
		$('#rate_' + name + '_text').text(window[origin_name + '_text'][lvl]);
	} catch (e) {
		fill_rates(); //now useless?
		if (typeof debug != 'undefined' && debug) {
			console.log("rate_click" + e.message);
		}
		$('#rate_' + name + '_text').text(window[origin_name + '_text'][lvl]);
	}
	var nbrMax = window['max_' + origin_name],
		haircut = 'haircut';
	if (name.substr(0, haircut.length) == haircut) {
		hairClass_changer(lvl);
		lvl++;
		nbrMax += 2;
	}
	
	var separator = '_',
			average = '';
	
	if (name.indexOf(separator) != -1) {
		var tab = name.split(separator),
		 	name = tab[0],
		 	average = tab[1];
	}
	
	var i = 0;
	while (i <= nbrMax) {
		var classname = name + separator + i,
			classname_blank = classname + '_blank',
			classname_id = '#' + classname;
		
		if (average != '') {
			classname_id += '_' + average;
		}
		if (lvl == 0) {
			$(classname_id).removeClass(classname_blank).addClass(classname);
		} else {
			var id = '#' + name + separator + '0';
			if (average != '') {
				 id += '_' + average;
			}
			$(id).removeClass(name + separator + '0').addClass(name + separator + '0' + separator + 'blank');
		}
		if (i <= lvl) {
			// if (average == 'min' && lvl != 0)
			// {
			// 	var max_lvl = $('#rate_' + name + '_max_value').val();
			// 	if (max_lvl > lvl) {
			// 			$(classname_id).removeClass(classname_blank).addClass(classname);
			// 	}
			// } else {
				$(classname_id).removeClass(classname_blank).addClass(classname);
		//	}
		} else {
			// if (average == 'max' && lvl != 0) {
			// 	var min_lvl = $('#rate_' + name + '_min_value').val();
			// 	if (min_lvl < lvl) {
			// 			$(classname_id).removeClass(classname).addClass(classname_blank);
			// 	}
			// } else {
				$(classname_id).removeClass(classname).addClass(classname_blank);
			//}
		}
		i++;
	}
}

// switch hair class
function change_haircut(newSize) {
	var hairClass = $('#hair').attr('class');

	if (typeof hairClass !== 'undefined') {
		hairClass = hairClass.replace(/(long)|(medium)|(short)|(bold)/g, newSize);
		$('#hair').removeClass().addClass(hairClass);
	}
}

// call hair class to switch
function hairClass_changer(lvl) {
	switch (lvl) {
		case 0:
			change_haircut('bold');
			break;
		case 1:
			change_haircut('short');
			break;
		case 2:
			change_haircut('medium');
			break;
		case 3:
			change_haircut('long');
			break;
		default:
			break;
	}
}

// rate_modifier
function rate_modifier(id, lvl) {
	var name = id;
	var separator = '_',
			average = '';
	if (name.indexOf(separator) != -1) {
		var tab = name.split(separator),
		 	name = tab[0],
		 	average = tab[1];
	}
	if (average == 'min')
	{
	 	var max_lvl = $('#rate_' + name + '_max_value').val();
		if (max_lvl - lvl <= 0)
		{
			lvl = (max_lvl == 0) ? 0 : max_lvl - 1;
		}
	} else if (average == 'max') {
		var min_lvl = $('#rate_' + name + '_min_value').val();
		if (min_lvl >= lvl)
		{
			lvl = (lvl == 0 && min_lvl == 0) ? 0 : min_lvl + 1;
		}
	}
	$('#rate_' + id + '_value').val(lvl).change();
	rate_click(id, lvl);
}
