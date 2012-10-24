/**
 * @fileOverview double icones switcher
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

/**
 * @param {String} value1
 * @param {String} value2
 * @param {String} prefix
 */
function doubleico_switcher(val_man, val_woman, prefix, auto_switch) {

		var input_gender = $('#' + prefix + '_value'),
			blank = '_blank',
			man = prefix + '_' + val_man,
			man_blank = man + blank,
			woman = prefix + '_' + val_woman,
			woman_blank = woman + blank;

		var val_both = 'both',
			div_lookingfor = $('#' + man),
			div_lookingfor_w = $('#' + woman);

		//hover
		function lookingfor_Mouseenter() {
			div_lookingfor.removeClass(man_blank).addClass(man);
		}
		
		//remove hover if not selected
		function lookingfor_Mouseleave() {
			if (input_gender.val() != val_man
				&& input_gender.val() != val_both) {
				div_lookingfor.removeClass(man).addClass(man_blank);
			}
		}

		//set ico
		function lookingfor_Click() {
			if (input_gender.val() == val_both
				|| input_gender.val() == val_man) {
				if (auto_switch && input_gender.val() == val_man) {
					div_lookingfor_w.removeClass(woman_blank).addClass(woman);
				}
				div_lookingfor.removeClass(man).addClass(man_blank);
				if (auto_switch) {
					input_gender.val(val_woman).change();
				} else {
					input_gender.val(input_gender.val() == val_both ? val_woman : '').change();
				}
			} else {
				div_lookingfor.removeClass(man_blank).addClass(man);
				input_gender.val(input_gender.val() == val_woman ? val_both : val_man).change();
			}
		}

		div_lookingfor.on(event_str.click, lookingfor_Click);
		
		div_lookingfor.mouseenter(lookingfor_Mouseenter);
		div_lookingfor.mouseleave(lookingfor_Mouseleave);
	}