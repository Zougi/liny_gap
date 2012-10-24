function init() {
	 
	/* preload images */
	preload([ 'preload_ico_search_glow',
			  'preload_ico_contacts_glow',
			  'preload_ico_filters_glow',
			  'preload_ico_profile_glow'
	]);
	$(".switch").iButton();
  $("#resetDefaultSettings").click(function() {
  	$(".switch").iButton("toggle", false);                                            
  });
}
translate('settings');