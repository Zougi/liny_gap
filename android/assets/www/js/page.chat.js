/**
 * @function transform string into function and gets its value
 * @param {Boolean} if true return full date: dd/mm/yyyy hh:mm:ss, false returns: mm:ss 
 * @param {Boolean} if true return 12 date format, false returns 24 format
 * @returns {String} date or time
 */
function getCurrentTime(full, twelveFormat) {
	var date = new Date(),
		hours = date.getHours(),
		minutes = date.getMinutes(),
		seconds = date.getSeconds(),
		period = '';
	
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	if (hours < 10){
            hours = '0' + hours;
        }
	if (twelveFormat) {
		period = ' ' + ((hours > 12) ? 'AM' : 'PM');
		hours = ((hours > 12) ? hours - 12 : hours);
	}
	var curr_time = hours + ':' + minutes + period,
		fullDate = date.getDay() + '/' + date.getMonth() + '/' + date.getYear()
			+ '  ' + hours + ':' + curr_time;
	return full ? fullDate : curr_time;
}

/**
 * @function make a chat bubble
 * @param {String} message to display in the bubble 
 * @param {Boolean} if true make user bubble else make other user's
 */
function make_bubble(text, other) {
	var nbr_char_max = 24,
		size_line = 20,
		size_chat_msg = 39,
		nbr_newLine = text.match(/.*?(\n|$)/g), //does one final empty useless match
		nbr_lines = 0
		line_length = 0,
		reg = /\n/g;
	
	for (var i = 0; i < nbr_newLine.length - 1; i++) {
		line_length = nbr_newLine[i].replace(reg, '').length;
		if (line_length > nbr_char_max) {
			line_length = line_length / nbr_char_max;
			nbr_lines += Math.floor(line_length);
		}
		nbr_lines++;
	}
	text = text.replace(reg, '<br />');
	
	new_size = (nbr_lines - 1 ) * size_line;
	
	var div_string = '<div>',
		msg = 'msg',
		msg_top = 'msg_top',
		msg_bottom = 'msg_bottom',
		msg_middle = 'msg_middle',
		msg_glossy = 'msg_glossy',
		msg_date = 'msg_date';
		
	if (other) {
		var other_str = '_other',
			separator = ' ';
		msg += separator + msg + other_str;
		msg_top += separator + msg_top + other_str;
		msg_bottom += separator + msg_bottom + other_str;
		msg_middle += separator + msg_middle + other_str;
		msg_glossy += separator + msg_glossy + other_str;
		msg_date += separator + msg_date + other_str;
	}
	
	var div = $(div_string).addClass(msg).css('height', size_chat_msg + new_size + 'px');
		
	$(div_string).addClass(msg_top).appendTo(div);
	
	$(div_string).addClass(msg_bottom).appendTo(div);
	
	$(div_string).addClass(msg_middle).css('height', new_size + 'px').appendTo(div);
	
	$('<p>').addClass('chat_text').html(text).appendTo(div);
	
	$(div_string).addClass(msg_glossy).appendTo(div);
	
	var curr_time = getCurrentTime(false, false);
	$(div_string).addClass(msg_date).text(curr_time).css('margin-top', (size_chat_msg + new_size - 7) + 'px').appendTo(div);
	
	$('#chat_msgs_portrait').append(div);
}

/**
 * @function event send button
 */
function chat_entry_button_Click(event) {
	var text = $('#chat_entry_text').val();
	if (text != '') {
		make_bubble(text, false);
		var interval = window.setInterval(function() {
			make_bubble('echo: ' + text, true);
			$('html,body').animate({ scrollTop: ($('#chat_msgs_portrait').height() + 90) });
			$('#chat_entry_text').val('');
			clearInterval(interval);
		}, 400);
		
		$('html,body').animate({ scrollTop: ($('#chat_msgs_portrait').height() + 90) });
		
		if (!window.localStorage) {
	          //alert...      
	  } else {
			var chat_res = [],
					chat_history = localStorage.getItem('chat_history');
			if (chat_history != undefined && chat_history != null) {
				chat_res = JSON.parse(chat_history);	
			}
			chat_res.push(text);
			localStorage.setItem('chat_history', JSON.stringify(chat_res));
	  }
		$('#chat_entry_text').val('');
	}
	event.preventDefault ? event.preventDefault() : event.returnValue = false;
}





$('#chat_entry_button').on(event_str.click, chat_entry_button_Click);

var line_number = 0;

// Manage event when pressing 'Enter' into the text area field in landscape mode
$('.chat_entry_text_landscape').bind('keypress', function(e){
    if (e.keyCode == 13){       // When enter key is pressed
        var text = $(this).val();
        text = text.replace("\n", "");
        var chat_area_id = $(this).parent().prev().attr("id");
       
        if (text.length > 0){
            var curr_time = getCurrentTime(false, false),                
            
            div = "<div class='chat_message_line' id='p" + line_number +"'>\n\
                <div class='chat_profil_picture'></div>\n\
                <div class='chat_line' id='cl" + line_number +"'>\n\
                    <div class='chat_user_name'>moi</div>\n\
                    <div class='chat_text' id='c"+ line_number +"'>"+ text + "</div>\n\
                </div>\n\
                <div class='div_separator' role='chatMessage' aria-live='polite'>\n\
                    <div class='chat_message_time'>" + curr_time + "</div>\n\
                </div>\n\
                </div>";        //Temporary Solution
            $("#" + chat_area_id).append(div);
            
            var height_chat_line = $("#c"+line_number).height() + 16;
            var height_chat_message_line = height_chat_line + 30;
            $("#p"+ line_number).height(height_chat_message_line);
            $("#cl" + line_number).height(height_chat_line);
            $("#" + chat_area_id).scrollTop($("#" + chat_area_id)[0].scrollHeight);
            line_number++;
        }
        $(this).val('');
    }
});

$( ".chat_msg_landscape_detached" ).draggable({ cursor: "move" });

/*   Slidding down the chat box    */
$(".name_contact").click(function(){
    var cml_id = $(this).parents(".chat_msg_landscape").attr("id");
    var cta_id = $("#" + cml_id).children(".chat_text_area").attr("id");
    var cma_id = $("#" + cml_id).children(".chat_message_area").attr("id");
    if ($("#" + cta_id).is(":hidden")){
        $("#" + cta_id).show();
        $("#" + cma_id).show();
        $("#" + cml_id).removeClass("chat_position_down");
        $("#" + cma_id).scrollTop($("#" + cma_id)[0].scrollHeight);
        }
    else {
        $("#" + cml_id).addClass("chat_position_down");
        $("#" + cta_id).hide();
        $("#" + cma_id).hide();
    }
});

$(".close_window").click(function(){
    var cc_id = $(this).parents(".chat_colunm").attr("id");
    var width_chat = $(".chat_msg_landscape").width();
    $("#" + cc_id).remove();
    $(".chat_group").width($(".chat_group").width() - width_chat);
});

function init() {
	if (!window.localStorage) {
	
	} else {
		var chat_history = localStorage.getItem('chat_history');
		var add_pix = 0;
		if (chat_history != undefined && chat_history != null) {
			chat_history = JSON.parse(chat_history);
			for (var h in chat_history) {
				make_bubble('echo: ' + chat_history[h], false);
				add_pix += 90;
			}
			$('html,body').animate({ scrollTop: ($('#chat_msgs_portrait').height() + add_pix) });
		}
	}
		
	/* preload images */
	preload([ 'preload_ico_search_glow',
			  'preload_ico_contacts_glow',
			  'preload_ico_filters_glow',
			  'preload_ico_profile_glow'
	]);
					 
}

translate('chat');
