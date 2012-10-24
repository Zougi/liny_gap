/**
 * @fileOverview silhouette sliders maker fonctions.
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

// silhouette's rulers
function silhouette_sliders() {
	
	var extreme = (arguments[0] != undefined && arguments[0] != null) ? '_' + arguments[0] : '';

	var idSilouhette = '#silhouette_img' + extreme;
	
	// silhouette's ruler height
	var unit_height = 'm',
		default_height = 1.7,
		default_imgSize = 261,
		default_height_min = 1.1,
		default_height_max = 2.2,
		default_height_step = 0.1,
		idSliderHeight = '#slider_height' + extreme,
		idSliderHeight_link = idSliderHeight + ' a';
	$(idSliderHeight).slider({
			orientation: 'vertical',
			value: default_height,
			min: default_height_min,
			max: default_height_max,
			step: default_height_step,
			animate: true,
			
			//this gets a live reading of the value and prints it on the page
			slide: function(event, ui) {
				$('#height' + extreme).attr('value', ui.value).css({'color' : '#000', 'font-style' : 'normal'});
				
				height_setter(ui.value);
			},
			
			create: function(event, ui) {
				height_setter(default_height);
			}
	});
	
	// silhouette's ruler weight
	var unit_weight = 'kg',
		idSliderWeight = '#slider_weight' + extreme,
		idSliderWeight_link = idSliderWeight + ' a',
		default_weight = 60,
		default_weight_min = 35,
		default_weight_max = 105,
		default_weight_step = 5;
	$(idSliderWeight).slider({

		value: default_weight,
		min: default_weight_min,
		max: default_weight_max,
		step: default_weight_step,
		animate: true,
		
		//this gets a live reading of the value and prints it on the page
		slide: function (event, ui) {
			$('#weight' + extreme).attr('value', ui.value).css({'color' : '#000', 'font-style' : 'normal'});
			weight_setter(ui.value);
		},
		
		create: function (event, ui) {
			weight_setter(default_weight);
		}
	});
	
	//change image weight / update textbox
	function weight_setter(value) {
		$(idSliderWeight_link).text(value + unit_weight).change();
		var val = value;
		if (val >= 95) {
			val = 65;
		} else if (val >= 55) {
			val = 55;
		} else if (val <= 40) {
			val = 45;
		}
		$(idSilouhette).width(val);
		$(idSilouhette).css('background-size', val + 'px ' + $(idSilouhette).height() + 'px');
	}
	
	//change image height / update textbox
	function height_setter(value) {
		$(idSliderHeight_link).text(value + unit_height).change();
		var height = default_imgSize + value * 20;
		$(idSilouhette).height(height);
		$(idSilouhette).css('background-size', $(idSilouhette).width() + 'px ' + height + 'px');
	}
	
	// update img height, width & sliders
	function update_heiwei_rulers(val, div_id) {
		var isHeight = (div_id.substr(0, 6) == 'height'),
			unit_ = isHeight ? unit_height : unit_weight;
		if (val != '' && !isNaN(parseFloat(val))) {
			$( '#slider_' + div_id).slider({
				value: val,
			});
			$('#slider_' + div_id + ' a').text(val + unit_);
			if (isHeight) {
				height_setter(val);
			} else {
				weight_setter(val);
			}
		}
	}
	
	// update img height when leaving the height textbox
	$('#height' + extreme).blur(function() {
		update_heiwei_rulers($(this).val(), 'height' + extreme);
	});
	
	// update img weight when leaving the weight textbox
	$('#weight' + extreme).blur(function() {
		update_heiwei_rulers($(this).val(), 'weight' + extreme);
	});
	
	if (arguments.length > 1) {
		update_heiwei_rulers(arguments[1], 'height' + extreme);
		update_heiwei_rulers(arguments[2], 'weight' + extreme);
	}
}
