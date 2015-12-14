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

// 최신순으로 등록된 미팅을 10개 가져옵니다.
$recent_meeting_agenda_list =
$wdj_mysql_interface->getMeetingAgendaList(
	// meeting_membership_id
	$MEETING_MEMBERSHIP_ID
	// page
	, 1
	// size
	, 10
);

// 롤 사인업을 진행하기 위해서 지금으로부터 8주 뒤의 미팅 정보까지 미리 만들어 둡니다.
$recent_meeting_agenda_obj = null;
if(!empty($recent_meeting_agenda_list)) {
	$recent_meeting_agenda_obj = $recent_meeting_agenda_list[0];
}

if(!is_null($recent_meeting_agenda_obj) && !empty($recent_meeting_agenda_obj->__startdttm)) {

	$recent_startdttm = $recent_meeting_agenda_obj->__startdttm;
	$recent_round = intval($recent_meeting_agenda_obj->__round);
	$recent_start_date = strtotime($recent_startdttm);
	$a_week_later_from_recent_meeting = date('Ymdhis', strtotime("+7 days", $recent_start_date));

	// 지금으로부터 4주 - 1달 뒤의 미팅 날짜를 구합니다.(4 * 7 = 28일 뒤)
	$today = time();
	$twoMonthsLater_YYYYMMDDHHSSMM = date('Ymdhis', strtotime("+2 months", $today));
	$today_YYYYMMDDHHSSMM = date('Ymdhis', $today);

	$loop_max = 5;
	$round_idx = 1;
	$days_of_week = 7;
	for($idx = 1; $idx < $loop_max;$idx++) {

		$daysAfter = $days_of_week * $idx;
		$weeksLaterFromLast = date('Ymdhis', strtotime("+".$daysAfter." days", $today));

		// 다음주 일정부터 없다면  자동 등록됩니다.
		if($a_week_later_from_recent_meeting < $weeksLaterFromLast) {

			// 등록된 마지막 미팅 날짜가 2달
			$next_round = $recent_round + $round_idx;
			$round_idx += 1;

			$result = 
			$wdj_mysql_interface->insertMeetingAgenda(
				// $round
				$next_round
				// $theme
				, "No Theme"
				// $start_dttm
				, $weeksLaterFromLast
				// $meeting_membership_id
				, $MEETING_MEMBERSHIP_ID
			);

			// 새로 등록한 아젠다 정보를 가져옵니다.
			$result = 
			$wdj_mysql_interface->getMeetingAgendaByRound(
				// $meeting_round
				$next_round
				// $startdttm
				, $weeksLaterFromLast
				// $meeting_membership_id
				, $MEETING_MEMBERSHIP_ID
			);
			if(!empty($result)) {
				$next_meeting_agenda_obj = $result[0];	
			}
			if(!is_null($next_meeting_agenda_obj)) {
				// TIMELINE도 자동 등록됩니다. BASIC. 이 값은 다시 변경할 수 있습니다.
				$wdj_mysql_interface->copyTimelineFromTemplate(
					// $new_meeting_agenda_id
					$next_meeting_agenda_obj->__meeting_id
					// $meeting_template_id
					, 1
				);
			}
		}
	}
}
// 최신순으로 등록된 미팅을 10개 가져옵니다.(업데이트 반영된 것으로 다시 가져옴)
$recent_meeting_agenda_list =
$wdj_mysql_interface->getMeetingAgendaListUpcoming(
	// meeting_membership_id
	$MEETING_MEMBERSHIP_ID
	// page
	, 1
	// size
	, 10
);
// TODO
// 진행하지 않는 미팅이 발생하면 어떻게 처리? --> 미팅의 날짜를 미룸. 나머지 뒤의 미팅 날짜들도 일괄적으로 뒤로 변경됨.
// 이 페이지에서 미팅의 날짜를 변경할 수 있는 기능이 필요함.





$member_list = $wdj_mysql_interface->getMemberList($MEETING_MEMBERSHIP_ID, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);
// 로그인 시에는 내 이름이 가장 먼저 올라옵니다.
if(strcmp($login_user_info->__is_login,$params->YES) == 0){

	$member_obj = new stdClass();
	$member_obj->__member_id = $login_user_info->__member_id;
	$member_obj->__member_name = $login_user_info->__member_first_name . " " . $login_user_info->__member_last_name;

	array_unshift($member_list, $member_obj);
}

$role_id_toastmaster = 2;
$role_id_general_evaluator = 7;
$role_id_timer = 9;
$role_id_table_topic = 5;
$role_id_ah_counter = 10;
$role_id_mini_debate_master = 6;
$role_id_grammarian = 11;
$role_id_word_n_quote_master = 4;
$role_id_arr = 
array(
	$role_id_toastmaster
	, $role_id_general_evaluator
	, $role_id_timer
	, $role_id_table_topic
	, $role_id_ah_counter
	, $role_id_mini_debate_master
	, $role_id_grammarian
	, $role_id_word_n_quote_master
);
//
$meeting_role_list_list=array();
$speech_list_list=array();
$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);
for($idx = 0;$idx < count($recent_meeting_agenda_list);$idx++) {

	// 각 미팅의 롤 정보를 가져옵니다.
	$cur_meeting_agenda = $recent_meeting_agenda_list[$idx];
	if(is_null($cur_meeting_agenda)) {
		continue;
	}

	$__meeting_id = $cur_meeting_agenda->__meeting_id;
	if(!(0 < $__meeting_id)) {
		continue;
	}

	// 미팅 아이디를 지정했다면, 해당 미팅 아이디의 롤 사인업만 표시합니다.
	if(0 < $MEETING_ID && $MEETING_ID != $__meeting_id) {
		continue;
	}

	$meeting_role_list = $wdj_mysql_interface->getTodayRoleList($MEETING_MEMBERSHIP_ID, $__meeting_id, $role_id_arr);
	array_push($meeting_role_list_list, $meeting_role_list);


	$speech_list = $wdj_mysql_interface->sel_speech_speaker($__meeting_id);
	array_push($speech_list_list, $speech_list);

}


$member_role_cnt_list = $wdj_mysql_interface->getMemberRoleCntList($MEETING_MEMBERSHIP_ID);

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

var member_list = <?php echo json_encode($member_list);?>;
var member_role_cnt_list = <?php echo json_encode($member_role_cnt_list);?>;
var recent_meeting_agenda_list = <?php echo json_encode($recent_meeting_agenda_list);?>;
var meeting_role_list_list = <?php echo json_encode($meeting_role_list_list);?>;
var speech_list_list = <?php echo json_encode($speech_list_list);?>;
var membership_obj = <?php echo json_encode($membership_obj);?>;


var role_id_toastmaster = <?php echo json_encode($role_id_toastmaster);?>;
var role_id_general_evaluator = <?php echo json_encode($role_id_general_evaluator);?>;
var role_id_timer = <?php echo json_encode($role_id_timer);?>;
var role_id_table_topic = <?php echo json_encode($role_id_table_topic);?>;
var role_id_ah_counter = <?php echo json_encode($role_id_ah_counter);?>;
var role_id_mini_debate_master = <?php echo json_encode($role_id_mini_debate_master);?>;
var role_id_grammarian = <?php echo json_encode($role_id_grammarian);?>;
var role_id_word_n_quote_master = <?php echo json_encode($role_id_word_n_quote_master);?>;


// Header - Log In Treatment
var table_jq = $("table tbody#list");

if(!IS_EXTERNAL_SHARE) {

	_tm_m_list.addHeaderRow(
		// login_user_info
		login_user_info
		// membership_obj
		, membership_obj
		// header_arr
		,[
			_link.get_header_link(
				_link.MOBILE_ROLE_SIGN_UP_LIST
				,_param
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			)
			,_link.get_header_link(
				_link.MOBILE_TOP
				,_param
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			)
		]
		// table_jq
		,table_jq
	);

}




// Body - Content







var key_value_obj_arr = [];
for(var idx = 0;idx < member_list.length; idx++) {
	var member_obj = member_list[idx];
	var key_value_obj = 
	_obj.get_select_option(
		// key_str
		""+member_obj.__member_id
		// value_str
		,member_obj.__member_name
		// key_access_prop_name
		// value_access_prop_name
	);

	key_value_obj_arr.push(key_value_obj);
}
// MEMBER LIST
var row_member_obj = 
_m_list.addTableRowsSelectFolder(
	// key_value_obj_arr
	key_value_obj_arr
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, _obj.getDelegate(function(delegate_data){
		// 내부의 내용은 각 롤에 할당될때 마다 변경됩니다.
	}, this)
	// delegate_data
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
	// text_color
	, _color.COLOR_MEDIUM_GRAY
	// bg_color
	, _color.COLOR_WHITE
);

// TODO accordian animation
row_member_obj.hide();
var role_delegate_func = function(delegate_data, row_member_obj) {

	if(	delegate_data == undefined || 
		delegate_data.target_jq == undefined ||
		delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined || 
		delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP
		) {
		return;
	}

	// TODO 모든 열의 속성 - is_open 속성을 NO로 변경.
	// 이미 열려있는 열이 있는 상태에서 다른 열을 열면 이벤트 상태가 초기화되지 않음.
	// 사용자는 두번 열어야 함.
	var MEETING_ID = delegate_data.delegate_data.MEETING_ID;
	var ROLE_ID = delegate_data.delegate_data.ROLE_ID;
	var row_role_jq = delegate_data.target_jq;

	delegate_data.target_jq.parent().after(row_member_obj.get_target_jq_arr());
	if(delegate_data.target_jq.attr("is_open") === "YES") {
		delegate_data.target_jq.attr("is_open", "NO");

		//window.scrollTo(0, 0);
		// REFACTOR ME
		var body = $("html, body");
		row_member_obj.hide();
		body.stop().animate({scrollTop:0}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
		   console.log("Finished animating");
		});

	} else {

		delegate_data.target_jq.attr("is_open", "YES");
		row_member_obj.show();

		// TODO 선택된 사용자는 제외합니다.
		var cur_offset = delegate_data.target_jq.offset();

		//window.scrollTo(0, cur_offset.top);
		// REFACTOR ME
		var body = $("html, body");
		body.stop().animate({scrollTop:cur_offset.top}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
		   console.log("Finished animating");
		});

		// 다른 롤의 멤버 리스트가 될 때마다 role id가 변경되어야 합니다.
		// 그러므로 delegate 함수가 그때마다 새로 설정되어야 합니다.
		row_member_obj.set_delegate_obj_click_row(
			_obj.getDelegate(function(selector_delegate_data){

				var target_jq = selector_delegate_data.delegate_data.get_target_jq();
				var MEMBER_ID = target_jq.attr("key");
				var MEMBER_NAME = target_jq.find("strong").html();

				// 선택한 사용자를 해당 롤에 업데이트 합니다.
				// 이상이 없다면 업데이트!
				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj / MEETING_ID
					, _param
					.get(_param.IS_UPDATE_TODAY_ROLE,_param.YES)
					.get(_param.MEETING_ID,MEETING_ID)
					.get(_param.MEMBER_ID,MEMBER_ID)
					.get(_param.ROLE_ID,ROLE_ID)

					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){

							console.log(data);
							if(data != undefined && data.query_output_arr != undefined && data.query_output_arr[0].output === true) {
								console.log("사용자에게 업데이트가 완료되었음을 알립니다. / MEMBER_NAME :: ",MEMBER_NAME);	

								// 롤의 이름을 업데이트 합니다.
								row_role_jq.find("span.badge").find("strong").html(MEMBER_NAME);
								delegate_data.target_jq.attr("is_open", "NO");

								// 멤버 리스트를 가립니다.
								row_member_obj.hide();

								// 선택된 배지 녹색으로 변경
								var target_controller = delegate_data.delegate_data.target_controller;
								if(MEMBER_NAME == _param.NOT_ASSIGNED) {
									target_controller.set_badge_gray();
								} else {
									target_controller.set_badge_green();
								}

								// Role sign up 업데이트 완료시, 해당 미팅의 최상단으로 이동.
								var body = $("html, body");
								var TARGET_SCROLL_BACK_Y = delegate_data.delegate_data[_param.TARGET_SCROLL_BACK_Y];
								body.stop().animate({scrollTop:TARGET_SCROLL_BACK_Y.offset().top}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
								   console.log("Finished animating");
								});
								
							} // if end

						},
						// delegate_scope
						this
					)
				); // ajax done.

			}, this)					
		);
	} // if end
}


for(var idx = (meeting_role_list_list.length - 1); -1 < idx; idx--) {
	var cur_meeting_role_list = meeting_role_list_list[idx];

	var cur_meeting_agenda_id = parseInt(cur_meeting_role_list[0].__meeting_agenda_id);

	// 1. 미팅 날짜와 정보를 보여줍니다.
	var cur_meeting_agenda_obj = null;
	for(var inner_idx = 0; inner_idx < recent_meeting_agenda_list.length; inner_idx++) {
		cur_meeting_agenda_obj = recent_meeting_agenda_list[inner_idx];

		var meeting_agenda_id = parseInt(cur_meeting_agenda_obj.__meeting_id);

		if(	(0 < cur_meeting_agenda_id) && 
			(0 < meeting_agenda_id) && 
			(cur_meeting_agenda_id === meeting_agenda_id)) {
			// 미팅 정보를 찾았습니다. 종료합니다.
			break;
		}
		cur_meeting_agenda_obj = null;
	} // inner for end
	if(cur_meeting_agenda_obj == null) {
		continue;
	}

	// 1-2. 미팅 날짜 정보를 가져옵니다.
	var now_date = _dates.getNow(_dates.DATE_TYPE_YYYY_MM_DD)
	var days_left = _dates.get_YYYY_MM_DD_diff_days(now_date, cur_meeting_agenda_obj.__startdate);
	var theme_shorten = _html.getTextHead(cur_meeting_agenda_obj.__theme, 35);
	var date_desc = "";
	if(days_left < 1) {

		date_desc = cur_meeting_agenda_obj.__startdate + " ( Today )"

	} else if(days_left == 1) {

		date_desc = cur_meeting_agenda_obj.__startdate + " ( Tomorrow )"

	} else if(days_left == 2) {

		date_desc = cur_meeting_agenda_obj.__startdate + " ( The day after Tomorrow )"

	} else {

		date_desc = cur_meeting_agenda_obj.__startdate + " ( " + days_left + " days left )"

	}
	var row_meeting_info_jq = 
	_m_list.addTableRowTitle(
		// title
		date_desc
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(self_obj){

		}, this)
	);

	// Today's Role
	// 화면 표시 기준에 맞게 정렬합니다.
	var role_idx=0;
	var role_name = "Toast Master"
	var role_member_name = _param.NOT_ASSIGNED;
	var role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		role_name
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

				console.log("!Error!\taddTableRowMovingArrowWidthBadge\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
				return;
			}

			if(_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

				role_delegate_func(delegate_data, row_member_obj);

			}

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_toastmaster)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
		// text_color_vmouse_down
		// bg_color_vmouse_down
		// text_color
		// bg_color
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}





	role_name = "General Evaluator"
	role_member_name = _param.NOT_ASSIGNED;
	role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"General Evaluator"
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			role_delegate_func(delegate_data, row_member_obj);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_general_evaluator)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}




	role_name = "Timer";
	role_member_name = _param.NOT_ASSIGNED;
	role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		role_name
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			role_delegate_func(delegate_data, row_member_obj);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_timer)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}





	role_name = "Table Topic Master";
	role_member_name = _param.NOT_ASSIGNED;
	role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		role_name
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			role_delegate_func(delegate_data, row_member_obj);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_table_topic)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}





	role_name = "Ah & Vote Counter";
	role_member_name = _param.NOT_ASSIGNED;
	role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		role_name
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			role_delegate_func(delegate_data, row_member_obj);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_ah_counter)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}







	role_name = "Mini Debate Master";
	role_member_name = _param.NOT_ASSIGNED;
	role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		role_name
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			role_delegate_func(delegate_data, row_member_obj);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_mini_debate_master)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}







	role_name = "Grammarian";
	role_member_name = _param.NOT_ASSIGNED;
	role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		role_name
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			role_delegate_func(delegate_data, row_member_obj);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_grammarian)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}







	role_name = "Word & Quote Master";
	role_member_name = _param.NOT_ASSIGNED;
	role_obj = cur_meeting_role_list[role_idx++];
	if(parseInt(role_obj.__member_id) > 0){
		role_member_name = role_obj.__member_name;
	}
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		role_name
		// title_on_badge
		, role_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			role_delegate_func(delegate_data, row_member_obj);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.ROLE_ID, role_id_word_n_quote_master)
		.get(_param.TARGET_SCROLL_BACK_Y, row_meeting_info_jq)
	);
	if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
		role_controller.set_badge_green();
	}

	console.log(">>> speech_list_list :: ",speech_list_list);

//meeting_role_list_list

	var speech_list = speech_list_list[idx];


	// SPEAKER & EVALUATOR
	var param_obj = null;

	if(IS_EXTERNAL_SHARE) {

		param_obj = 
		_param
		.get(_param.IS_EXTERNAL_SHARE, _param.YES)
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)		

	} else {

		param_obj = 
		_param
		.get(_param.MEETING_ID, cur_meeting_agenda_id)
		.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)

	}

	// TODO 스피치 추가하도록 연동
	/*
	_m_list.addTableRowMovingArrowWidthBadge(
		// title
		"Speeches"
		// title_on_badge
		, "" + speech_list.length
		// append_target_jq
		, table_jq
		// delegate_obj_row_click
		, _obj.getDelegate(function(delegate_data){

			_link.go_there(
				_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
				,delegate_data.delegate_data
			);

		}, this)
		// is_bold
		, true
		// delegate_data
		, param_obj
	);	
	*/


	// SHARE EXTERNAL
	if(!IS_EXTERNAL_SHARE) {

		var share_msg = "";
		if(days_left < 1) {

			share_msg = 
			membership_obj.__membership_desc + "\n" + 
			"Role Sign Up \n" + 
			"on " + cur_meeting_agenda_obj.__startdate + "\n\n" +
			"Today is your day!"
			;

		} else {

			share_msg = 
			membership_obj.__membership_desc + "\n" + 
			"Role Sign Up \n" + 
			"on " + cur_meeting_agenda_obj.__startdate + "\n\n" +
			days_left + " days left."
			;

		}

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
				_link.MOBILE_ROLE_SIGN_UP_LIST
				,_param
				.get(_param.IS_EXTERNAL_SHARE, _param.YES)
				.get(_param.MEETING_ID, cur_meeting_agenda_obj.__meeting_id)
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			)
			// img_url
			,service_root_path + _link.IMG_SHARE_KAKAO_TM_LONG_BANNER
		);	

	}

} // for end



// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
