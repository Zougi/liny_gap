var user;

//doublon map.js
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

function make_notif(user) {
	var firstname = user.profile.firstname,
		lastname = user.profile.lastname,
		trustGauge = user.trustGauge,
		matchPercentage = user.matchPercentage,
		infos = user.info,
		div_tag = '<div>',
		p_tag = '<p>',
		button_tag = '<button>',
		div = $(div_tag).addClass('notif');

	$(div_tag).addClass('notif_avatar').appendTo(div);
	$(div_tag).addClass('notif_avatar_profile').appendTo(div);
	$(div_tag).addClass('firstname').text(firstname).appendTo(div);
	$(div_tag).addClass('lastname').text(lastname).appendTo(div);
	$(div_tag).addClass('heart_' + getBackgroundPercentage(matchPercentage)).text(matchPercentage + '%').appendTo(div);
	$(div_tag).addClass('gauge_lvl' + trustGauge).appendTo(div);
	$(div_tag).addClass('relationship').appendTo(div);
	$(div_tag).addClass('notif_chat').text(infos).appendTo(div);
	var p = $(p_tag).text($.t('button.infos'));
	$(button_tag).addClass('button_infos button_small reverse')
				 .append(p)
				 .on(event_str.click, function() {
				 	window.location.href = "profile.html?user=" + user.id;
				 })
				.appendTo(div);
	p = $(p_tag).text($.t('button.deny'));
	$(button_tag).addClass('button_deny button_small reverse').append(p).on(event_str.click, function() {
		$(this).parent().hide();
	}).appendTo(div);
	
	$('#notifications').append(div);
}

var alterne = 0;
function make_contact(user, callback) {
	var firstname = user.profile.firstname,
		lastname = user.profile.lastname,
		trustGauge = user.trustGauge,
		matchPercentage = user.matchPercentage,
		div_tag = '<div>',
		div = $(div_tag).addClass('contact');
		
	if (alterne % 2 == 0) {
		div.addClass('contact_altern');
		alterne++;	
	} else {
		alterne = 0;
	}
	
	$(div_tag).addClass('notif_avatar').appendTo(div);
	$(div_tag).addClass('notif_avatar_profile').appendTo(div);
	$(div_tag).addClass('firstname').text(firstname).appendTo(div);
	$(div_tag).addClass('lastname').text(lastname).appendTo(div);
	$(div_tag).addClass('heart_' + getBackgroundPercentage(matchPercentage)).text(matchPercentage + '%').appendTo(div);
	$(div_tag).addClass('gauge_lvl' + trustGauge).appendTo(div);
	var ico_chat = $(div_tag).on(event_str.click, function() {
		window.location.href = "chat.html?user=" + user.id;
	}).addClass('ico_chat');
	$('<p>').text('Chat').appendTo(ico_chat);
	ico_chat.appendTo(div);
	$(div_tag).addClass('relationship').appendTo(div);
	
	div.on(event_str.click, function() {
		callback(user);
	});
	
	$('#contacts').append(div);
}

	function init() {
		var user0 = new User();
		user0.profile.firstname = 'tintin';
		user0.profile.lastname = 'dupont';
		user0.trustGauge = 2;
		user0.matchPercentage = 41;
		user0.info = 'je veux te voir :D';
		user0.profile.gender = 'woman';
		user0.physique.rate.piercing = 2;
		make_notif(user0, function() {
			window.location.href = "profile.html?user=" + user0.id;
			if (!window.localStorage) {
				//alert...      
			} else {
				localStorage.setItem('distant_user', JSON.stringify(user0));
			}	
		});
		
		var contacts = [];
		
		var user2 = new User();
		user2.profile.firstname = 'epi';
		user2.profile.lastname = 'dupont';
		user2.trustGauge = 2;
		user2.matchPercentage = 41;
		user2.info = 'je veux te voir :D';
		user2.profile.gender = 'woman';
		user2.physique.rate.piercing = 2;
		contacts.push(user2);
		
		var user3 = new User();
		user3.profile.firstname = 'toto';
		user3.profile.lastname = 'dupont';
		user3.trustGauge = 2;
		user3.matchPercentage = 41;
		user3.info = 'je veux te voir :D';
		user3.profile.gender = 'woman';
		user3.physique.rate.piercing = 2;
		contacts.push(user3);
		
		var user4 = new User();
		user4.profile.firstname = 'koli';
		user4.profile.lastname = 'dupont';
		user4.trustGauge = 2;
		user4.matchPercentage = 41;
		user4.info = 'je veux te voir :D';
		user4.profile.gender = 'woman';
		user4.physique.rate.piercing = 2;
		contacts.push(user4);
		
		var user5 = new User();
		user5.profile.firstname = 'tintin';
		user5.profile.lastname = 'dupont';
		user5.trustGauge = 2;
		user5.matchPercentage = 41;
		user5.info = 'je veux te voir :D';
		user5.profile.gender = 'woman';
		user5.physique.rate.piercing = 2;
		contacts.push(user5);
		
		function addIndexChar(c) {
			var ul = $('<ul>'),
					li = $('<li>');
			$('<a>').text(c).attr('href', '#' + c).appendTo(li);
			li.appendTo(ul);
			$('#contacts_index').append(ul);
		}
		
		function addHeaderChar(c) {
			var div = $('<div>');
			div.addClass('headerIndex');
			$('<a>').text(c).attr('id', c).appendTo(div);
			$('#contacts').append(div);
		}
		
		function make_contactsList(contacts) {
			contacts.sort(function(a, b) {
			  var nA = a.profile.firstname.toLowerCase();
			  var nB = b.profile.firstname.toLowerCase();

			  if (nA < nB)
			    return -1;
			  else if (nA > nB)
			    return 1;
			 	return 0;
			});
			
			function fillInputs_specifics(elem, bind_name, val) {
				fill_rates();
              if (bind_name.indexOf('rate') != -1) {
                      var bindTab = bind_name.split('.'),
                              rate_name = bindTab[bindTab.length - 1];
                      if (typeof val == 'undefined') {
                              val = 0;
                      }
                      rate_modifier(rate_name, val);
              } else if ((bind_name.indexOf('color.skin') != -1) 
                      || (bind_name.indexOf('color.eyes') != -1) || (bind_name.indexOf('color.hair') != -1)) {
                      if (val != '') {
												elem.removeClass().addClass('color_' + val);
											}
                      val = (bind_name.indexOf('skin') != -1) ? appearance_text[val] : colors_text[val];
					 						elem.text(val);
              } else if (bind_name.indexOf('size.hair') != -1) {
                      rate_modifier('haircut', val);
              } else if (bind_name.indexOf('height') != -1) {
				var default_imgSize = 261;
				var height = default_imgSize + val * 20;
				idSilouhette = '#silhouette_img';
				$(idSilouhette).height(height);
				$(idSilouhette).css('background-size', $(idSilouhette).width() + 'px ' + height + 'px');
				elem.text(val);
              } else if (bind_name.indexOf('weight') != -1) {
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
              } else if (bind_name == "user.profile.gender") {
                      gender = (val == '') ? 'woman' : val;
					var skin_color = 'white',
						eyes_color = 'brown',
						hair_color = 'black';
                      if (user.physique.color.skin != undefined && user.physique.color.skin != '') {
                      	skin_color = user.physique.color.skin;
                      }
					$('.skin').removeClass().addClass('skin ' + gender + '_skin ' + gender + '_skin_' + skin_color);
                      if (user.physique.color.eyes != undefined && user.physique.color.eyes != '') {
                      	eyes_color = user.physique.color.eyes;
                      }
					$('.eyes').removeClass().addClass('eyes ' + gender + '_eyes ' + gender + '_eyes_' + eyes_color);
                      if (user.physique.color.hair != undefined && user.physique.color.hair != '') {
						hair_color = user.physique.color.hair;
					}
                      var hairsize = (gender == 'man') ? 'short' : 'long';
                      //why is there a bug if typeof is not used?
					if (typeof user.physique.size != 'undefined' && user.physique.size != '' && user.physique.size.hair != undefined && user.physique.size.hair != '') {
						hairsize = user.physique.size.hair;
					}
                      $('.hair').removeClass().addClass('hair ' + gender + '_hair_' + hairsize + ' ' + gender + '_hair_' + hairsize + '_' + hair_color);
                      update_haircut_rate(hairsize);

                      if (val == 'man') {
						if ($('.avatarImg').attr('src') == 'css/app/images/profile/woman/avatar_blank.png') {
							$('.avatarImg').attr('src', 'css/app/images/profile/man/avatar_blank.png');
						}
						$('#silhouette_img').removeClass().addClass('silhouette_man');
						elem.removeClass().addClass('sign_man');
                              //man_Click();
                              //sign_switcher_man_Click();
                      } else {
						if ($('.avatarImg').attr('src') == 'css/app/images/profile/man/avatar_blank.png') {
							$('.avatarImg').attr('src', 'css/app/images/profile/woman/avatar_blank.png');
						}
						$('#silhouette_img').removeClass().addClass('silhouette_woman');
						elem.removeClass().addClass('sign_woman');
                              //woman_Click();
                              //sign_switcher_woman_Click();
                      }
              } else if (bind_name.indexOf('license') != -1) {
                      if (val == 'car' || val == 'both') {
                              $('#driving_license_car').removeClass().addClass('driving_license_car');
                      }
                      if (val == 'motorcycle' || val == 'both') {
                              $('#driving_license_motorcycle').removeClass().addClass('driving_license_motorcycle');
                      }
                      elem.text(val);
              } else if (bind_name.indexOf('birthdate') != -1) {
                      var birth = new Date(val),
						now = new Date(Date.now());
                      elem.text(now.getFullYear() - birth.getFullYear());
              } else if (bind_name == 'user.filters.personality.relationship.gender') {
				if (val == 'man') {
					$('#lookingfor_man').removeClass().addClass('lookingfor_man');
					$('#lookingfor_woman').removeClass().addClass('lookingfor_woman_blank');
				} else if (val == 'woman') {
					$('#lookingfor_man').removeClass().addClass('lookingfor_man_blank');
					$('#lookingfor_woman').removeClass().addClass('lookingfor_woman');
				} else {
					$('#lookingfor_man').removeClass().addClass('lookingfor_man');
					$('#lookingfor_woman').removeClass().addClass('lookingfor_woman');
				}
			} else if (bind_name.indexOf('avatar') != -1) {
				elem.attr('src', val);
			} else {
				if (val != '' || val != []) {
					elem.text(val);
				}
      }

    }


			function fillInputs(user_stored) {
              user = user_stored;

              var elements = $(document).find('[data-bind]');
              
              elements.each(function() {
                      var elem = $(this),
                              bind_name = elem.data('bind'),
                              val;
                try {
                              val = bind_getter(bind_name);
											if (typeof val == 'object') {
                              	val = val.join(', ');   
                      }
              	} catch(e) {
                      val = ''; 
                      
                }
                if (typeof val != 'undefined') {
                			fillInputs_specifics(elem, bind_name, val);
                }
              });
      }
				
			var contact, firstChar;
			var oldFirstChar = '';
			for (var c in contacts) {
				contact = contacts[c];
				firstChar = contact.profile.firstname.charAt(0).toUpperCase();
		
				if (firstChar != oldFirstChar) {
					oldFirstChar = firstChar;
					addIndexChar(firstChar);
					addHeaderChar(firstChar);
				}
				make_contact(contact, function(user) {
					if (mql.matches)
					{
						window.location.href = "profile.html?user=" + contact.id;
					} else {
						fillInputs(user);
					}
					// window.location.href = "profile.html?user=" + contact.profile.getEmail();
					// if (!window.localStorage) {
					// 	//alert...      
					// } else {
					// 	localStorage.setItem('distant_user', JSON.stringify(contact));
					// }	
				});
			}
		}
		make_contactsList(contacts);
		
		var top_contacts_index = $('#contacts_index').offset().top;
		var contacts_height = $('#contacts').height();
		var contacts_index = $('#contacts_index').height();
		$(window).scroll(function (event) {
		  var y = $(this).scrollTop();

	    if (y >= top_contacts_index) {
				if (y < contacts_height + top_contacts_index - contacts_index)
				{
	      	$('#contacts_index').css('margin-top', (y - top_contacts_index) + 'px');
				}
	    } else {
	      $('#contacts_index').css('margin-top', 0);
	    }
	  });
		
		var contacts_list = $('.contact');
		$('#text_search').keyup(function(e) {
			var val = $(this).val();
			contacts_list.each(function() {
				if ($(this).find('.firstname').text().indexOf(val) == -1 && val.length != 0)
				{
					$(this).hide();
				} else {
					$(this).show();
				}	
			});
		});
		
		 $('#bt_personality').on(event_str.click, bt_personality_Click);
     $('#bt_physique').on(event_str.click, bt_physique_Click);
		
		        /* display personality page */
        function bt_personality_Click() {
                hilight_def = 'edit_personality';
                $('#infos').css('display', 'inline');
                $('#global_portrait').css('display', 'none');
                $('#tab_personality').css('display', 'inline');
                $('#tab_physique').css('display', 'none');
        }
        
        
        /* display physique page */
        function bt_physique_Click() {
                hilight_def = 'edit_physique';
                $('#infos').css('display', 'none');
                $('#global_portrait').css('display', 'inline');
                $('#tab_personality').css('display', 'none');
                $('#tab_physique').css('display', 'inline');
        }
				var hilight_def = 'edit_personality';
				function hilight_default() {
					$('#navbar').removeClass('edit_personality edit_physique').addClass(hilight_def);

				}
				if (event_str.hover != null) {
					$('#bt_personality').hover(function() {
						$('#navbar').removeClass('edit_physique').addClass('edit_personality');
					}, hilight_default);
					$('#bt_physique').hover(function() {
						$('#navbar').removeClass('edit_personality').addClass('edit_physique');
					}, hilight_default);
				}
        
		
		/* preload images */
		preload([ 'preload_ico_search_glow',
				  'preload_ico_contacts_glow',
				  'preload_ico_filters_glow',
				  'preload_ico_profile_glow'
		]);
	}
translate('contacts');
	
