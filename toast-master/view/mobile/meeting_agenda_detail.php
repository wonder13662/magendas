<?php

// common setting
include_once("../../common.inc");

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1) {
	// 인스턴스 페이지 사용을 위해 멤버쉽 정보를 받을 수 있도록 변경합니다.
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);	
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

// 가장 최신의 미팅 ID를 가져옵니다.
$latest_meeting_id = $wdj_mysql_interface->get_meeting_agenda_id_upcoming($MEETING_MEMBERSHIP_ID);
if((!(0 < $MEETING_ID)) && (0 < $latest_meeting_id)) {
	// param으로 받은 미팅 아이디가 없을 경우, upcoming meeting id를 사용합니다.
	$MEETING_ID = $latest_meeting_id;
}
$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgendaList($MEETING_MEMBERSHIP_ID);
if($MEETING_ID > 0) {
	$meeting_agenda_obj = $wdj_mysql_interface->get_meeting_agenda_by_id($MEETING_ID);
}

$action_file_info = $wdj_mysql_interface->select_action_file_info($MEETING_ID);
$meeting_action_list_std = null;
if(!is_null($action_file_info)) {

	$__action_hash_key = $action_file_info->__action_hash_key;
	$__action_regdate = $action_file_info->__action_regdate;

	$action_content = ActionFileManager::load($__action_regdate, $__action_hash_key);
	$meeting_action_list_std = json_decode($action_content);

	// convert
	$meeting_action_list = ActionObject::convert($meeting_action_list_std);
	$mobile_table_std_arr = $meeting_action_list->search_mobile_table_std_from_root();

}

$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgendaList($MEETING_MEMBERSHIP_ID);

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
</head>






<body role="document">

<table class="table" style="margin-bottom:0px;">
	<tbody id="list">

	</tbody>
</table>


<script>

// php to javascript sample
var MEETING_ID = <?php echo json_encode($MEETING_ID);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;
var IS_EXTERNAL_SHARE = <?php echo json_encode($IS_EXTERNAL_SHARE);?>;

var membership_obj = <?php echo json_encode($membership_obj);?>;
var meeting_agenda_obj = <?php echo json_encode($meeting_agenda_obj);?>;

var meeting_action_list_std = <?php echo json_encode($meeting_action_list_std);?>;
console.log("MEETING_MEMBERSHIP_ID ::: ",MEETING_MEMBERSHIP_ID);
console.log("meeting_action_list_std ::: ",meeting_action_list_std);
console.log("meeting_agenda_obj ::: ",meeting_agenda_obj);

var mobile_table_std_arr = <?php echo json_encode($mobile_table_std_arr);?>;


// COMMON PROPS
var is_editable = true;
var table_jq = $("table tbody#list");














if(IS_EXTERNAL_SHARE === false) {

	// Header - Log In Treatment
	_tm_m_list.addHeaderRow(
		// login_user_info
		login_user_info
		// membership_obj
		, membership_obj
		// header_arr
		,[
			_link.get_header_link(
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
		// is_disabled
		, null
		// redirect_url_after_log_in
		, _link.get_link(_link.MOBILE_MEETING_AGENDA_DETAIL)
	);

}








// 2. DATE
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

		var _param_obj =
		_param
		.get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_UPDATE_HEADER)
		.get(_param.MEETING_ID,MEETING_ID)
		.get(_param.START_DATE,cur_date)
		;

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_TOASTMASTER_MEETING_AGENDA)
			// _param_obj
			, _param_obj

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


		var _param_obj =
		_param
		.get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_UPDATE_HEADER)
		.get(_param.MEETING_ID,MEETING_ID)
		.get(_param.THEME,cur_theme)
		;

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_TOASTMASTER_MEETING_AGENDA)
			// _param_obj
			, _param_obj

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
	.get(_param.THEME,meeting_agenda_obj.__theme)
);
if(!is_editable) {
	accessor_theme.off();
}





















if(meeting_action_list_std == null) {

	// 아젠다가 설정되지 않은 경우라면 템플릿을 노출해줍니다.
	var accessor_agenda_template = 
	_m_list.add_table_row_n_iframe(
		// title
		"Template"
		// append_target_jq
		, table_jq
		// delegate_obj_row_click
		, _obj.getDelegate(function(accessor){

			console.log("accessor :: ",accessor);

		}, this)
		// is_bold
		, true
		// param_obj
		, _param.get(_param.MEETING_ID, MEETING_ID)
		// text_color
		, null
		// bg_color
		, null
		// iframe_page_link
		, _link.get_link(
			_link.MOBILE_MEETING_AGENDA_TEMPLATE
			,_param
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			.get(_param.IS_IFRAME_VIEW, _param.YES)
			.get(_param.IFRAME_PARENT_ACCESS_NAME, "accessor_agenda_template")
		)
		// delegate_update_iframe_height
		, 416
		// 
	);

	console.log("accessor_agenda_template :: ",accessor_agenda_template);
	accessor_agenda_template.show_iframe();
	
}


var meeting_action_list = undefined;
if(meeting_action_list_std != undefined) {
	meeting_action_list = _action.get_action_obj(meeting_action_list_std);
}



















// wonder.jung
// MOBILE TABLE
if(_v.is_valid_array(mobile_table_std_arr)) {

	console.log("HERE / mobile_table_std_arr ::: ",mobile_table_std_arr);

	for(var idx=0; idx < mobile_table_std_arr.length; idx++) {

		var mobile_table_std = mobile_table_std_arr[idx];
		var mobile_table_obj = _action.get_action_obj(mobile_table_std);
		var child_column_action_list = mobile_table_obj.get_children();

		// COLUMN LIST
		for(var column_idx=0; column_idx < child_column_action_list.length; column_idx++) {

			var child_column_action_obj = child_column_action_list[column_idx];
			if(child_column_action_obj.has_no_children()) {
				continue;
			}

			var child_field_action_list = child_column_action_obj.get_children();
			// console.log("child_field_action_std_list ::: ",child_field_action_std_list);
			// FIELD LIST
			for(var field_idx=0; field_idx < child_field_action_list.length; field_idx++) {

				var child_field_action_obj = child_field_action_list[field_idx];

				if( child_field_action_obj.is_relation_pair_text() ) {

					// 테이블 객체를 전달합니다.
					var parent_table = child_field_action_obj.get_parent().get_parent();
					_m_list.add_table_pair(
						// append_target_jq
						table_jq
						// action_table_obj
						, parent_table
						// , callback
						, function(data) {

							console.log("HERE / data ::: ",data);

						}
						// , callback_scope
						, this
					);

					// 인덱스의 마지막으로 이동
					column_idx = child_column_action_list.length;
					break;

				} else if( child_field_action_obj.is_relation_chain_title()) {

					// 스피치 테이블을 표시.

					// 테이블 객체를 전달합니다.
					var parent_table = child_field_action_obj.get_parent().get_parent();
					console.log("parent_table ::: ",parent_table);

					_m_list.add_table_chain(
						// append_target_jq
						table_jq
						// action_table_obj
						, parent_table
						// , callback
						, function(data) {

							console.log("HERE / data ::: ",data);

						}
						// , callback_scope
						, this
					);

					// 인덱스의 마지막으로 이동
					column_idx = child_column_action_list.length;
					break;

				}

			} // field for end
		} // column for end

		// break;
	} // table for end

}














// REMOVE ME

/*
var msg_guide_not_club_member = ""; 
if(login_user_info.__is_login === _param.YES && membership_obj != undefined) {
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
*/

// wonder.jung
// 4. Today's Role
/*
var role_cnt = 0;
for(var idx = 0; idx < today_role_list.length; idx++) {
	var today_role_obj = today_role_list[idx];
	if(parseInt(today_role_obj.__member_id) > 0) {
		role_cnt++;
	}
}
var accessor_meeting_role = 
_m_list.add_table_row_badge_n_iframe(
	// title
	"Roles"
	// title_on_badge
	, "" + role_cnt
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(accessor){

		var _param_obj = 
		_param
		.get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_SELECT_TODAY_ROLE_CNT)
		.get(_param.MEETING_ID,MEETING_ID)
		;

		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_SELECT_TOASTMASTER_ROLE)
			// _param_obj
			, _param_obj
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					// 롤 변경에 따라 롤 갯수를 바꾸어 줍니다.
					var EVENT_PARAM_EVENT_TYPE = data.EVENT_PARAM_EVENT_TYPE;
					if(	EVENT_PARAM_EVENT_TYPE === _param.IS_SELECT_TODAY_ROLE_CNT && 
						accessor.set_badge_title != undefined) {

						var today_role_cnt = parseInt(data.today_role_cnt);
						accessor.set_badge_title(today_role_cnt);

					}

				},
				// delegate_scope
				this
			)
		); // ajax done.


		// 여닫을때마다 업데이트된 내역을 가져와 갱신!

	}, this)
	// is_bold
	, true
	// param_obj
	, _param.get(_param.MEETING_ID, MEETING_ID)
	// text_color
	, null
	// bg_color
	, null
	// iframe_page_link
	, _link.get_link(
		_link.MOBILE_MEETING_AGENDA_DETAIL_ROLE
		,_param
		.get(_param.MEETING_ID, MEETING_ID)
		.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		.get(_param.IS_IFRAME_VIEW, _param.YES)
	)
	// delegate_update_iframe_height
	, 416
	// 
);
if(!is_editable) {
	accessor_meeting_role.off_iframe();	
}
*/




































// 5. Today's Speech
/*
var accessor_speech = 
_m_list.add_table_row_badge_n_iframe(
	// title
	"Speeches"
	// title_on_badge
	, "" + today_speech_list.length
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(accessor){

		// 스피치의 갯수를 조회해서 화면에 다시 표사합니다.
		console.log("롤이 업데이트되었습니다. 롤의 갯수를 확인해서 변했다면 바꾸어 줍니다.");

		var _param_obj = 
		_param
		.get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_SELECT_SPEECH)
		.get(_param.MEETING_ID,MEETING_ID)
		;

		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_SELECT_TOASTMASTER_SPEECH)
			// _param_obj
			, _param_obj
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					// 롤 변경에 따라 롤 갯수를 바꾸어 줍니다.
					var EVENT_PARAM_EVENT_TYPE = data.EVENT_PARAM_EVENT_TYPE;
					if( EVENT_PARAM_EVENT_TYPE === _param.IS_SELECT_SPEECH && 
						accessor.set_badge_title != undefined	) {

						var speech_cnt = parseInt(data.speech_cnt);
						accessor.set_badge_title(speech_cnt);

					}

				},
				// delegate_scope
				this
			)
		); // ajax done.


	}, this)
	// is_bold
	, true
	// param_obj
	, _param.get(_param.MEETING_ID, MEETING_ID)
	// text_color
	, null
	// bg_color
	, null
	// iframe_page_link
	, _link.get_link(
		_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
		,_param
		.get(_param.MEETING_ID, MEETING_ID)
		.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		.get(_param.IS_IFRAME_VIEW, _param.YES)
	)
	// delegate_update_iframe_height
	, 416
	// 
);
if(!is_editable) {
	accessor_speech.off_iframe();	
}
*/







































// 6. News
/*
var accessor_news = 
_m_list.add_table_row_badge_n_iframe(
	// title
	"Club News"
	// title_on_badge
	, "" + today_news_list.length
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(accessor){

		// 스피치의 갯수를 조회해서 화면에 다시 표사합니다.
		console.log("롤이 업데이트되었습니다. 롤의 갯수를 확인해서 변했다면 바꾸어 줍니다.");

		var _param_obj = 
		_param
		.get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_SELECT_NEWS_CNT)
		.get(_param.MEETING_ID,MEETING_ID)
		;

		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_SELECT_TOASTMASTER_NEWS)
			// _param_obj
			, _param_obj
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					// 롤 변경에 따라 롤 갯수를 바꾸어 줍니다.
					var EVENT_PARAM_EVENT_TYPE = data.EVENT_PARAM_EVENT_TYPE;
					if( EVENT_PARAM_EVENT_TYPE === _param.IS_SELECT_NEWS_CNT && 
						accessor.set_badge_title != undefined	) {

						var news_cnt = parseInt(data.news_cnt);
						accessor.set_badge_title(news_cnt);

					}

				},
				// delegate_scope
				this
			)
		); // ajax done.

	}, this)
	// is_bold
	, true
	// param_obj
	, _param.get(_param.MEETING_ID, MEETING_ID)
	// text_color
	, null
	// bg_color
	, null
	// iframe_page_link
	, _link.get_link(
		_link.MOBILE_MEETING_AGENDA_DETAIL_NEWS
		,_param
		.get(_param.MEETING_ID, MEETING_ID)
		.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		.get(_param.IS_IFRAME_VIEW, _param.YES)
	)
	// delegate_update_iframe_height
	, 416
	// 
);
if(!is_editable) {
	accessor_news.off_iframe();	
}
*/










































// 7. WORD
/*
var accessor_word =
_m_list.addTableRowTextInputInline(
	// title
	"Word"
	// append_target_jq
	,table_jq
	// place holder
	,"type word"
	// value
	, word_obj.__word
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

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

		// .get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_UPDATE_HEADER)

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_WORD_N_QUOTE)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.EVENT_PARAM_EVENT_TYPE, _param.IS_UPDATE_WORD_N_QUOTE_WORD_ONLY)
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
*/










































// 8. WORD DESC
/*
var accessor_word_desc =
_m_list.addTableRowTextAreaInputInline(
	// title
	"Desc"
	// append_target_jq
	,table_jq
	// place holder
	,"type word description"
	// value
	, word_obj.__word_desc
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

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
			_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_WORD_N_QUOTE)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.EVENT_PARAM_EVENT_TYPE, _param.IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY)
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
*/













































/*



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
	, quote_obj.__quote_content
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

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
			_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_WORD_N_QUOTE)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.EVENT_PARAM_EVENT_TYPE, _param.IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY)
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

*/


// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
