<?php

// common setting
include_once("../../common.inc");

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1) {
	// 인스턴스 페이지 사용을 위해 멤버쉽 정보를 받을 수 있도록 변경합니다.
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID);	
}
if($MEETING_MEMBERSHIP_ID == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
	$membership_obj = $membership_obj_arr[0];
}

$MEETING_ID = $params->getParamString($params->MEETING_ID, -1);

$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgenda($MEETING_MEMBERSHIP_ID, $MEETING_ID);
$today_role_list = $wdj_mysql_interface->getTodayRoleList($MEETING_MEMBERSHIP_ID, $MEETING_ID);
$today_speech_list = $wdj_mysql_interface->sel_speech_speaker($MEETING_ID);
$today_news_list = $wdj_mysql_interface->getNews($MEETING_ID);

// 다음 미팅 날짜를 가져옵니다.
$start_date = date('Y-m-d');

// 외부 공유로 링크를 전달했을 경우 여부 - 외부 공유시에는 업데이트가 허용됩니다.
$IS_EXTERNAL_SHARE = $params->isYes($params->IS_EXTERNAL_SHARE);

// @ required
$wdj_mysql_interface->close();
?>

<html>
<head>
<?php
// @ required
include_once("../../common.js.inc");
$view_render_var_arr = array("[__ROOT_PATH__]"=>$service_root_path);
ViewRenderer::render("$file_root_path/template/head.include.toast-master.mobile.template",$view_render_var_arr);
?>
<style>
#up-button{
	position: absolute;
    left: 300px;
    top: 600px;
    z-index: 1;
}
</style>
</head>




<body role="document">

<table class="table" style="margin-bottom:0px;">
	<tbody id="list">

	</tbody>
</table>

<!-- test code -->
<div id="up-button">
<a class="btn btn-default" href="#" role="button" onclick="console.log('Up button is clicked')">Up</a>
</div>

<script>

// php to javascript sample
var MEETING_ID = <?php echo json_encode($MEETING_ID);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;
var IS_EXTERNAL_SHARE = <?php echo json_encode($IS_EXTERNAL_SHARE);?>;

var membership_obj = <?php echo json_encode($membership_obj);?>;
var meeting_agenda_list = <?php echo json_encode($meeting_agenda_list);?>;
var today_role_list = <?php echo json_encode($today_role_list);?>;
var today_speech_list = <?php echo json_encode($today_speech_list);?>;
var today_news_list = <?php echo json_encode($today_news_list);?>;

console.log(">>> login_user_info :: ",login_user_info);
console.log(">>> membership_obj :: ",membership_obj);

console.log(">>> today_speech_list :: ",today_speech_list);

var is_editable = true;
if((IS_EXTERNAL_SHARE === false && login_user_info.__is_club_member === false) || login_user_info.__is_login === _param.NO) {
	// 비로그인 상태이거나 클럽 멤버가 아닐 경우, 수정이 불가능합니다.
	is_editable = false;
}

// Header - Log In Treatment
var table_jq = $("table tbody#list");
_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// membership_obj
	, membership_obj
	// header_arr
	,[
	/*	_link.get_header_link(
			_link.MOBILE_MEETING_AGENDA_DETAIL
			,_param
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		)
		,_link.get_header_link(
			_link.MOBILE_MEETING_AGENDA_LIST
			,_param
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		)
		,*/_link.get_header_link(
			_link.MOBILE_TOP
			,_param
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		)
	]
	// table_jq
	,table_jq
	// color_text
	, _tm_m_list.COLOR_TEXT_WHITE
	// bg_color_vmouse_down
	, _tm_m_list.COLOR_RED_WINE
);

// Body - Content
var meeting_agenda_obj = null;
if(meeting_agenda_list != null || meeting_agenda_list.length > 0){
	meeting_agenda_obj = meeting_agenda_list[0];
}
console.log(">>> meeting_agenda_obj :: ",meeting_agenda_obj);









// 1. ROUND
_m_list.addTableRowTitleNBadge(
	// title
	"Round"
	// textInBadge
	, meeting_agenda_obj.__round + "th"
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, null
);









// 2. DATE
// draw date picker
var start_date = _dates.getFormattedTime(meeting_agenda_obj.__startdttm,_dates.DATE_TYPE_YYYY_MM_DD);
var accessor_date =
_m_list.addTableRowDateInput(
	// title
	"Date"
	// append_target_jq
	,table_jq
	// start_date
	,start_date
	// delegate_on_change
	, _obj.getDelegate(function(accessor){

		if(meeting_agenda_list == undefined || meeting_agenda_list.lenght == 0) {
			return;
		}

		var cur_date = accessor.get();
		var param_obj = accessor.get_param_obj();
		var MEETING_ID = parseInt(param_obj.MEETING_ID);
		var prev_date = param_obj[_param.START_DATE];

		if(_v.is_not_valid_str(cur_date)) {
			console.log("!STOP! / start date is not valid!");
			return;	
		}

		if(prev_date === cur_date) {
			console.log("!STOP! / start date does not changed at all!");
			return;	
		}

		// 같은 미팅 날짜가 있는지 확인합니다.
		for(var idx = 0; idx < meeting_agenda_list.length;idx++) {
			var meeting_agenda = meeting_agenda_list[idx];
			var date_yyyy_mm_dd = _dates.getFormattedTime(meeting_agenda.__startdttm,_dates.DATE_TYPE_YYYY_MM_DD);

			if(cur_date === date_yyyy_mm_dd) {
				alert("date is already used!");
				accessor.focus();
				return;
			}
		}

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.IS_UPDATE_HEADER,_param.YES)
			.get(_param.MEETING_ID,MEETING_ID)
			.get(_param.START_DATE,cur_date)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)

			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(data);

					// TODO 사용자에게 업데이트가 완료되었음을 알립니다.
					// TOAST POPUP 찾아볼 것
					alert("Updated!");

				},
				// delegate_scope
				this
			)
		); // ajax done.		

	}, this)
	// param_obj
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
	.get(_param.START_DATE,start_date)
);
if(!is_editable) {
	accessor_date.off();	
}











console.log("_color :: ",_color);


// 3. THEME
var accessor_theme =
_m_list.addTableRowTextInputInline(
	// title
	"Theme"
	// append_target_jq
	,table_jq
	// place holder
	,"type theme"
	// value
	, meeting_agenda_obj.__theme
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

		console.log("accessor_theme / blur / accessor :: ",accessor);

		var cur_theme = accessor.get();
		var param_obj = accessor.get_param_obj();
		var MEETING_ID = parseInt(param_obj.MEETING_ID);
		var prev_theme = param_obj[_param.THEME];

		if(_v.is_not_valid_str(cur_theme)) {
			console.log("!STOP! / theme is not valid!");
			return;	
		}

		if(prev_theme === cur_theme) {
			console.log("!STOP! / theme does not changed at all!");
			return;	
		}

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.IS_UPDATE_HEADER,_param.YES)
			.get(_param.MEETING_ID,MEETING_ID)
			.get(_param.THEME,cur_theme)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)

			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(data);
					alert("Updated!");

				},
				// delegate_scope
				this
			)
		); // ajax done.

	}, this)
	// param_obj
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
	.get(_param.THEME,meeting_agenda_obj.__theme)
);
if(!is_editable) {
	accessor_theme.off();
}








var msg_guide_not_club_member = ""; 
if(login_user_info.__is_login === _param.YES) {
	msg_guide_not_club_member = 
	"Sorry, <MEMBER_NAME>.\nYou are not the member of\n<CLUB_NAME>"
	.replace(/\<MEMBER_NAME\>/gi, login_user_info.__member_first_name + " " + login_user_info.__member_last_name)
	.replace(/\<CLUB_NAME\>/gi, membership_obj.__membership_desc)
	;
} else {
	msg_guide_not_club_member = 
	"Sorry.\nYou are not the member of\n<CLUB_NAME>"
	.replace(/\<MEMBER_NAME\>/gi, login_user_info.__member_first_name + " " + login_user_info.__member_last_name)
	.replace(/\<CLUB_NAME\>/gi, membership_obj.__membership_desc)
	;
}

// 4. Today's Role
var role_cnt = 0;
for(var idx = 0; idx < today_role_list.length; idx++) {
	var today_role_obj = today_role_list[idx];
	if(parseInt(today_role_obj.__member_id) > 0) {
		role_cnt++;
	}
}
var row_role_jq = 
_m_list.addTableRowMovingArrowWidthBadge(
	// title
	"Roles"
	// title_on_badge
	, "" + role_cnt
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(delegate_data){

		if(!is_editable) {
			alert(msg_guide_not_club_member);
			return;
		}

		if(	delegate_data == undefined ||
			delegate_data.delegate_data == undefined ||
			delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

			console.log("!Error!\taddTableRowMovingArrowWidthBadge\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
			return;
		}

		if(_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

			_link.go_there(
				_link.MOBILE_MEETING_AGENDA_DETAIL_ROLE
				,_param
				.get(_param.MEETING_ID, MEETING_ID)
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			);

		}

	}, this)
	// is_bold
	, true
	// delegate_data
	, _param.get(_param.MEETING_ID, MEETING_ID)
);








// 5. Today's Speech
var row_speech_jq = 
_m_list.addTableRowMovingArrowWidthBadge(
	// title
	"Speeches"
	// title_on_badge
	, "" + today_speech_list.length
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(delegate_data){

		if(!is_editable) {
			// 비로그인 상태이거나 클럽 멤버가 아닐 경우, 수정이 불가능합니다.
			alert(msg_guide_not_club_member);
			return;
		}

		console.log(">>> delegate_data :: ",delegate_data);

		_link.go_there(
			_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
			,_param
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		);

	}, this)
	// is_bold
	, true
	// delegate_data
	, _param.get(_param.MEETING_ID, MEETING_ID)
);









// 6. News
var row_news_jq = 
_m_list.addTableRowMovingArrowWidthBadge(
	// title
	"Club News"
	// title_on_badge
	, "" + today_news_list.length
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(delegate_data){

		if(!is_editable) {
			// 비로그인 상태이거나 클럽 멤버가 아닐 경우, 수정이 불가능합니다.
			alert(msg_guide_not_club_member);
			return;
		}

		_link.go_there(
			_link.MOBILE_MEETING_AGENDA_DETAIL_NEWS
			,_param
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		);

	}, this)
	// is_bold
	, true
	// delegate_data
	, _param.get(_param.MEETING_ID, MEETING_ID)
);















// 7. WORD
var accessor_word =
_m_list.addTableRowTextInputInline(
	// title
	"Word"
	// append_target_jq
	,table_jq
	// place holder
	,"type word"
	// value
	, meeting_agenda_obj.__word
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

		console.log("accessor_word / blur / accessor :: ",accessor);

		var cur_word = accessor.get();
		var param_obj = accessor.get_param_obj();
		var MEETING_ID = parseInt(param_obj.MEETING_ID);
		var prev_word = param_obj.WORD

		if(_v.is_not_valid_str(cur_word)) {
			console.log("!STOP! / word is not valid!");
			return;	
		}

		if(prev_word === cur_word) {
			console.log("!STOP! / word does not changed at all!");
			return;	
		}

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.IS_UPDATE_WORD_N_QUOTE_WORD_ONLY,_param.YES)
			.get(_param.MEETING_ID,MEETING_ID)
			.get(_param.WORD,cur_word)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)

			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(data);
					alert("Updated!");

				},
				// delegate_scope
				this
			)
		); // ajax done.		

	}, this)
	// param_obj
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
	.get(_param.WORD,meeting_agenda_obj.__word)
);
if(!is_editable) {
	accessor_word.off();
}












// 8. WORD DESC
var accessor_word_desc =
_m_list.addTableRowTextAreaInputInline(
	// title
	"Desc"
	// append_target_jq
	,table_jq
	// place holder
	,"type word description"
	// value
	, meeting_agenda_obj.__word_desc
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

		console.log("accessor_word_desc / blur / accessor :: ",accessor);

		var cur_word_desc = accessor.get();
		var param_obj = accessor.get_param_obj();
		var MEETING_ID = parseInt(param_obj.MEETING_ID);
		var prev_word_desc = param_obj.WORD_DESC

		if(_v.is_not_valid_str(cur_word_desc)) {
			console.log("!STOP! / word desc is not valid!");
			return;	
		}

		if(prev_word_desc === cur_word_desc) {
			console.log("!STOP! / word desc does not changed at all!");
			return;	
		}

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY,_param.YES)
			.get(_param.MEETING_ID,MEETING_ID)
			.get(_param.WORD_DESC,cur_word_desc)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)

			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(data);
					alert("Updated!");

				},
				// delegate_scope
				this
			)
		); // ajax done.

	}, this)	
	// param_obj
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
	.get(_param.WORD_DESC,meeting_agenda_obj.__word_desc)
);
if(!is_editable) {
	accessor_word_desc.off();
}














// 9. QUOTE
var accessor_quote =
_m_list.addTableRowTextAreaInputInline(
	// title
	"Quote"
	// append_target_jq
	,table_jq
	// place holder
	,"type quote"
	// value
	, meeting_agenda_obj.__quote
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

		console.log("accessor_quote / blur / accessor :: ",accessor);

		var cur_quote = accessor.get();
		var param_obj = accessor.get_param_obj();
		var MEETING_ID = parseInt(param_obj.MEETING_ID);
		var prev_quote = param_obj[_param.QUOTE];

		if(_v.is_not_valid_str(cur_quote)) {
			console.log("!STOP! / quote is not valid!");
			return;	
		}

		if(prev_quote === cur_quote) {
			console.log("!STOP! / quote does not changed at all!");
			return;	
		}

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY,_param.YES)
			.get(_param.MEETING_ID,MEETING_ID)
			.get(_param.QUOTE,cur_quote)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)

			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(data);
					alert("Updated!");

				},
				// delegate_scope
				this
			)
		); // ajax done.		

	}, this)	
	// param_obj
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
	.get(_param.QUOTE,meeting_agenda_obj.__quote)
);
if(!is_editable) {
	accessor_quote.off();
}





// SHARE EXTERNAL
var share_msg = membership_obj.__membership_desc + " needs your help.\nMeeting Agenda On " + meeting_agenda_obj.__startdate;
if(is_editable) {
	var accessor_external_share =
	_m_list.addTableRowShareExternal(
		// title
		"Share"
		// append_target_jq
		,table_jq
		// label
		,share_msg
		// url_desc
		,"Magendas"
		// url
		,_link.get_link(
			_link.MOBILE_MEETING_AGENDA_DETAIL
			,_param
			.get(_param.IS_EXTERNAL_SHARE, _param.YES)
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		)
		// img_url
		,service_root_path + _link.IMG_SHARE_KAKAO_TM_LONG_BANNER
	);
}




// SHOW PDF
_m_list.addTableRowBtn(
	// title
	"Show agenda PDF"
	// color
	, null
	// delegate_obj
	, _obj.getDelegate(function(){

		_link.go_there(
			_link.PDF_VIEWER
			,_param
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		);

	}, this)
	// append_target_jq
	, table_jq
);




// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
