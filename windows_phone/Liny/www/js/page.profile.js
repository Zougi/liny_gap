      var other_user = false;
      
      /* hilight the good onglet on href arrival */
      var hilight_def = 'personality',
              hilight_def_remove = 'personality physique edit';
      
      function hilight_default() {
              $('#navbar').removeClass(hilight_def_remove).addClass(hilight_def);
      }
      
      /* display personality page */
      function bt_personality_Click() {
              hilight_def = other_user ? 'edit_personality' : 'personality';
              $('#infos').css('display', 'inline');
              $('#global_portrait').css('display', 'none');
              $('#tab_personality').css('display', 'inline');
              $('#tab_physique').css('display', 'none');
      }
      
      
      /* display physique page */
      function bt_physique_Click() {
              hilight_def = other_user ? 'edit_physique' : 'physique';
              $('#infos').css('display', 'none');
              $('#global_portrait').css('display', 'inline');
              $('#tab_personality').css('display', 'none');
              $('#tab_physique').css('display', 'inline');
      }
      
      /* return url arg after '#' */
      function get_UrlArg() {
              var loc = $(location).attr('href');
              var loc_separator = loc.indexOf('#');
              return (loc_separator == -1) ? '' : loc.substr(loc_separator + 1);
      }
      
      /* return url params after '?' */
      function get_UrlParams() {
              var loc = $(location).attr('search');
              var objURL = {};

              loc.replace(
                  new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
                  function($0, $1, $2, $3) {
                      objURL[$1] = $3;
                  }
              );
              return objURL;
      }
      
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
              if (hilight_def == 'physique') {
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
      
      $('#bt_personality').on(event_str.click, bt_personality_Click);
      $('#bt_physique').on(event_str.click, bt_physique_Click);
      
      var hover_personality = 'personality',
              hover_personality_remove = 'personality edit',
              hover_physique = 'physique',
              hover_physique_remove = 'physique edit';
      
			// hover effect on onglets personality, physique, edit
      if (event_str.hover != null) {
              $('#bt_personality').hover(function() {
                      $('#navbar').removeClass(hover_physique_remove).addClass(hover_personality);
              }, hilight_default);
      
              $('#bt_physique').hover(function() { 
                      $('#navbar').removeClass(hover_personality_remove).addClass(hover_physique);
              }, hilight_default);
              
              $('#bt_edit').hover(function() { 
                      $('#navbar').removeClass('personality physique').addClass('edit');
              }, hilight_default);
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
      
      function fillInputs_specifics(elem, bind_name, val) {
				if (user == null) return;
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
							} else if (bind_name.indexOf('live_with') != -1) {
								$('#live_with').find('div').each(function(i, e) {
									var classs = e.className;
									var class_prefix = classs.substr(0, classs.lastIndexOf('_'));
									e.className = class_prefix + '_' + ((i == val) ? (user.profile.gender == '' ? 'woman' : user.profile.gender) : 'blank');
								});
								$('#live_with_text').text(live_with_text[val]);
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
			} else if (bind_name.indexOf('trustGauge') != -1 && val != undefined && val != 0) {
				var e_class = 'gauge ';
				if (val >= 60) {
					e_class += 'gauge_lvl3';
				} else if (val >= 30) {
					e_class += 'gauge_lvl2';
				} else {
					e_class += 'gauge_lvl1';
				}
				elem.removeClass().addClass(e_class);
			} else if (bind_name.indexOf('matchPercentage') != -1 && val != undefined && val != 0) {
				var e_class = 'heart ';
				if (val >= 80) {
					e_class += 'heart_80_100';
				} else if (val >= 60) {
					e_class += 'heart_60_79';
				} else if (val >= 40) {
					e_class += 'heart_40_59';
				} else {
					e_class += 'heart_15_39';
				}
				elem.removeClass().addClass(e_class);
			} else {
        if (val != '' || val != []) {
					elem.text(val);
				}
      }
    }

		$('.gauge_modifier.plus').on(event_str.click, function() {
			alert('you voted +');
		});
		
		$('.gauge_modifier.minus').on(event_str.click, function() {
			alert('you voted -');
		});

      function init() {
              var comm = new Communication();
              if (typeof url_params != 'undefined') {
                      //change pagestyle
                      $('#navbar').removeClass().addClass('edit_personality');
                      $('#bt_edit').remove();
											$('#edit_landscape > a').text('Add');
                      hilight_def = 'edit_personality';
                      hover_personality = 'edit_personality';
                      hover_personality_remove = 'edit_personality edit';
                      hover_physique = 'edit_physique';
                      hover_physique_remove = 'edit_physique edit';
                      hilight_def_remove = 'edit_personality edit_physique edit';
                      other_user = true;
                      if (arg == 'physique') {
	                      bt_physique_Click();
	                      hilight_default();
                      }
                      
                      //get serveur
											if (comm.online) {
												comm.user.set({ id: params['user_id'] });
												var success = function(jsonData) {
		                      fillInputs(getObj(user, jsonData));
												};
												comm.user.getProfile(success, true);
											} else {
												//...
											}
											
              } else {
											$('#edit_landscape > a').text('Edit');
											$('.gauge_modifier').remove();

												if (comm.online && user != undefined && user != null) {
													comm.user.set(user);
													var success = function(jsonData) {
														var u = getObj(user, JSON.parse(jsonData).user);
														fillInputs(u);
														//localStorage.setItem('user', jsonData);
													};
													comm.user.getProfile(success);
											}
              }
      
              
              preload(['preload_ico_search_glow',
                               'preload_ico_contacts_glow',
                               'preload_ico_filters_glow',
                               'preload_ico_profile_glow',
                               'preload_ico_history_glow',
                               'preload_ico_settings_glow',
                               '.physique',
                               '.edit'
              ]);
      }
translate('profile');