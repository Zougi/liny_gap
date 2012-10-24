/**
 * @fileOverview  google maps settings descriptions.
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

//globale
var map;

/**
 * @class map
 */
var Map = function() {
	var _users = [],
		map;
	
	this.addUser = function(user) {
		_users.push(user);
	}
	
	this.clearUsers = function() {
		_users = [];
	}
	
	this.make_map = function(latitude, longitude) {
		// user position
		var position = new google.maps.LatLng(latitude, longitude);
		
		// display options
		var MapOptions = {
			zoom: 15,
			center: position,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			sensor: false,
			disableDefaultUI: true
		};
	
	  // generate map
		map = new google.maps.Map(document.getElementById('mapCanvas'),MapOptions);
		
		google.maps.event.addListenerOnce(map, 'idle', function(){
			$('#loadmap').hide();
		});
		
		// user marker
		var icone = new google.maps.MarkerImage(
			'css/app/images/screen_home/point_marker.png',
			 null, null, null, new google.maps.Size(15, 14)
		);
		var marker = new google.maps.Marker({
			position: position,
			icon: icone,
			map: map
		});
	}
	
	function getBackgroundPercentage(percentage) {
		var ret;
		
		if (percentage < 40) {
			ret = '15_39';
		} else if (percentage < 60) {
			ret = '40_59';
		} else if (percentage < 80) {
			ret = '60_79';
		} else {
			ret = '80_100';
		}
		return ret;
	}
	
	//make a result block with users infos
	function make_result_blok(u) {
		var gender = u.profile.gender,
			firstname = u.profile.firstname,
			skin_color = u.physique.color.skin,
			hair_color = u.physique.color.hair,
			hair_size = u.physique.size.hair,
			eyes_color = u.physique.color.eyes,
			infos = u.info,
			trustGauge = u.trustGauge,
			matchPercentage = u.matchPercentage,
			div_tag = '<div>',
			p_tag = '<p>';
		var div, portrait;
		
		div = $(div_tag).addClass('result');
		 
		$(div_tag).addClass('avatars').appendTo(div);
		
		 portrait = $(div_tag).addClass('portrait');
		 $(div_tag).addClass('skin').addClass(gender + '_skin').addClass(gender + '_skin_' + skin_color).appendTo(portrait);
		 $(div_tag).addClass('hair').addClass(gender + '_hair_' + hair_size).addClass(gender + '_hair_' + hair_size + '_' + hair_color).appendTo(portrait);
		 $(div_tag).addClass('eyes').addClass(gender + '_eyes').addClass(gender + '_eyes_' + eyes_color).appendTo(portrait);
		 portrait.appendTo(div);
		 
		 $(div_tag).addClass('heart_' + getBackgroundPercentage(matchPercentage)).text(matchPercentage + '%').appendTo(div);
	
		$(div_tag).addClass('gauge_lvl' + trustGauge).appendTo(div);
		
		$(p_tag).addClass('pseudo').text(firstname).appendTo(div);
		
		$(p_tag).addClass('infos').text(infos).appendTo(div);
	
		return $(div_tag).append(div).html();
	}
		
	// fill resultsbar with result blocks
	function make_results_blocks(users) {
		var html = '';
		for (var i = 0; i < users.length; i++) {
			html += make_result_blok(users[i]);
		}
		$('#results').html(html);
	}
		
	this.DisplayMarkers = function() {/* members markers */
		for (var i = 0; i < _users.length; i++) {
			make_marker(_users[i]);	
		}
	}
	
	this.DisplayResultsBlocks = function() {
		make_results_blocks(_users);
	}
	
	
	// marker image shadow
	var shadow = new google.maps.MarkerImage(
		'css/app/images/screen_home/icon_shadow.png',
		new google.maps.Size(82,59),
		new google.maps.Point(0,0),
		new google.maps.Point(24,59)
	);
		
	// marker clickable zone
	var shape = {
		coord: [47,0,47,1,47,2,47,3,47,4,47,5,47,6,47,7,47,8,47,9,
				47,10,47,11,47,12,47,13,47,14,47,15,47,16,47,17,47,
				18,47,19,47,20,47,21,47,22,47,23,47,24,47,25,47,26,
				47,27,47,28,47,29,47,30,47,31,47,32,47,33,47,34,47,
				35,47,36,47,37,47,38,47,39,47,40,47,41,47,42,47,43,
				47,44,47,45,47,46,37,47,36,48,35,49,34,50,33,51,32,
				52,30,53,29,54,28,55,27,56,26,57,25,58,23,58,23,57,
				22,56,21,55,20,54,19,53,18,52,17,51,16,50,15,49,14,
				48,13,47,0,46,0,45,0,44,0,43,0,42,0,41,0,40,0,39,0,
				38,0,37,0,36,0,35,0,34,0,33,0,32,0,31,0,30,0,29,0,
				28,0,27,0,26,0,25,0,24,0,23,0,22,0,21,0,20,0,19,0,
				18,0,17,0,16,0,15,0,14,0,13,0,12,0,11,0,10,0,9,0,8,
				0,7,0,6,0,5,0,4,0,3,0,2,0,1,0,0,47,0],
		type: 'poly'
	};
		
	// Define the overlay to display text inside the marker
	var Label = function(opt_options) {
		// Initialization
		this.setValues(opt_options);
		
		// Label specific
		var span = this.span_ = document.createElement('span');
		span.style.cssText = 'position: relative; left: -48%; top: -45px; ' +
						  'white-space: nowrap; font-weight: bold;' +
						  'padding: 2px; color:white;';
		
		var div = this.div_ = document.createElement('div');
		div.appendChild(span);
		div.style.cssText = 'position: absolute; display: none;';
	};
	Label.prototype = new google.maps.OverlayView;
	
	// Implement onAdd
	/**
	 * @ignore
	 * @field
	 */
	Label.prototype.onAdd = function() {
		var pane = this.getPanes().overlayLayer;
		pane.appendChild(this.div_);
		pane.style['zIndex'] = 104;
		
		// Ensures the label is redrawn if the text or position is changed.
		var me = this;
		this.listeners_ = [
		google.maps.event.addListener(this, 'position_changed',
		   function() { me.draw(); }),
		google.maps.event.addListener(this, 'text_changed',
		   function() { me.draw(); })
		];
	};
	
	// Implement onRemove  -- is it useful?
	/**
	 * @ignore
	 */
	Label.prototype.onRemove = function() {
		this.div_.parentNode.removeChild(this.div_);
		
		// Label is removed from the map, stop updating its position/text.
		for (var i = 0, I = this.listeners_.length; i < I; ++i) {
			google.maps.event.removeListener(this.listeners_[i]);
		}
	};
	
	// Implement draw
	/**
	 * @ignore
 	 * @field
	 */
	Label.prototype.draw = function() {
		var projection = this.getProjection();
		var position = projection.fromLatLngToDivPixel(this.get('position'));
		
		var div = this.div_;
		div.style.left = position.x + 'px';
		div.style.top = position.y + 'px';
		div.style.display = 'block';
		
		this.span_.innerHTML = this.get('text').toString();
	};
	
	//make a simple marker with members informations	
	function make_marker(user) {
	
		// marker image
		var perElem_background = getBackgroundPercentage(user.matchPercentage);
		
		var background = 'css/app/images/screen_home/icon_' 
							+ perElem_background + '_'
							+ ((user.profile.gender == 'man') ? 'm' : 'w') + '.png';
		
		var image = new google.maps.MarkerImage(
			background,
			new google.maps.Size(48,59),
			new google.maps.Point(0,0),
			new google.maps.Point(24,59)
		);
		
		var position = new google.maps.LatLng(user.location.latitude, user.location.longitude);
		
		// create marker
		var marker = new google.maps.Marker({
			draggable: false,
			raiseOnDrag: false,
			icon: image,
			shadow: shadow,
			shape: shape,
			map: map,
			position: position
		});
		
		// marker's information window
		infoWindow = new google.maps.InfoWindow({
			content: '<div class="info-window-content">' + user.info + '</div>',
			maxWidth: 275
		});

		try {
			google.maps.event.addListener(marker, 'touchstart', function() {
				infoWindow.open(map, marker);
			});
		} catch(e) { }
		google.maps.event.addListener(marker, 'click', function() {
			infoWindow.open(map, marker);
		});
		
		// make label over marker
		var label = new Label({
		   map: map
		 });
		label.bindTo('position', marker, 'position');
		label.set('text', user.matchPercentage + '%');
	}
}
