/**
 * @fileOverview preload images
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

// preload img. args:  tab of ids or class elements
function preload(imgTab) {
	var htmlStr = '',
		id,
	 	classs,
	 	firstChar;
	for (var it in imgTab) {
		id = '';
		classs = '';
		firstChar = imgTab[it].substr(0, 1);
		if (firstChar == '.') {
			classs = imgTab[it].substr(1, imgTab[it].length - 1);
		} else {
			if (firstChar == '#') {
				imgTab[it] = imgTab[it].substr(1, imgTab[it].length - 1);
		 	}
			id = imgTab[it];
		}
		htmlStr += '<div id="' + id + '" class="' + classs + ' preload" />';
	}
	$('body').append(htmlStr);
}