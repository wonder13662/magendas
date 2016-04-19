<?php
// common setting
include_once("../../common.inc");

$IS_EXTERNAL_SHARE = $params->isYes($params->IS_EXTERNAL_SHARE);
$IS_IFRAME_VIEW = $params->isYes($params->IS_IFRAME_VIEW);

// 클럽 멤버가 아닌 경우, 해당 페이지로는 접근할 수 없습니다.
// 로그인 유저가 해당 클럽의 멤버가 아니라면 TOP페이지로 리다이렉트.
if($IS_IFRAME_VIEW == false && $IS_EXTERNAL_SHARE == false && $login_user_info->__is_club_member == false) {
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MOBILE_TOP);
}

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

$MEETING_ID = $params->getParamNumber($params->MEETING_ID);
$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgenda($MEETING_MEMBERSHIP_ID, $MEETING_ID);
if(!empty($meeting_agenda_list)) {
	$meeting_agenda_obj = $meeting_agenda_list[0];
}

$member_list = $wdj_mysql_interface->getMemberList($MEETING_MEMBERSHIP_ID, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);

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
$today_role_list = $wdj_mysql_interface->getTodayRoleList($MEETING_MEMBERSHIP_ID, $MEETING_ID, $role_id_arr);

$member_role_cnt_list = $wdj_mysql_interface->getMemberRoleCntList($MEETING_MEMBERSHIP_ID);

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
var IS_IFRAME_VIEW = <?php echo json_encode($IS_IFRAME_VIEW);?>;

var today_role_list = <?php echo json_encode($today_role_list);?>;
var member_list = <?php echo json_encode($member_list);?>;
var member_role_cnt_list = <?php echo json_encode($member_role_cnt_list);?>;
var membership_obj = <?php echo json_encode($membership_obj);?>;
var meeting_agenda_obj = <?php echo json_encode($meeting_agenda_obj);?>;

console.log(">>> login_user_info :: ",login_user_info);
console.log(">>> IS_IFRAME_VIEW :: ",IS_IFRAME_VIEW);

var role_id_toastmaster = <?php echo json_encode($role_id_toastmaster);?>;
var role_id_general_evaluator = <?php echo json_encode($role_id_general_evaluator);?>;
var role_id_timer = <?php echo json_encode($role_id_timer);?>;
var role_id_table_topic = <?php echo json_encode($role_id_table_topic);?>;
var role_id_ah_counter = <?php echo json_encode($role_id_ah_counter);?>;
var role_id_mini_debate_master = <?php echo json_encode($role_id_mini_debate_master);?>;
var role_id_grammarian = <?php echo json_encode($role_id_grammarian);?>;
var role_id_word_n_quote_master = <?php echo json_encode($role_id_word_n_quote_master);?>;

var table_jq = $("table tbody#list");

// Header - Log In Treatment
if(!IS_EXTERNAL_SHARE && !IS_IFRAME_VIEW) {

	_tm_m_list.addHeaderRow(
		// login_user_info
		login_user_info
		// membership_obj
		, membership_obj
		// header_arr
		,[
			_link.get_header_link(
				_link.MOBILE_MEETING_AGENDA_DETAIL_ROLE
				,_param
				.get(_param.MEETING_ID, MEETING_ID)
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			)
			,_link.get_header_link(
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
		member_obj.__member_hash_key
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
				var MEMBER_HASH_KEY = target_jq.attr("key");
				var MEMBER_NAME = target_jq.find("strong").html();

				var param_obj = 
				_param
				.get(_param.IS_UPDATE_TODAY_ROLE,_param.YES)
				.get(_param.MEETING_ID,MEETING_ID)
				.get(_param.SELECTED_VALUE,MEMBER_HASH_KEY)
				.get(_param.ROLE_ID,ROLE_ID)
				.get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_UPDATE_TODAY_ROLE)
				;

				console.log("HERE / param_obj ::: ",param_obj);

				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_TOASTMASTER_ROLE)
					// _param_obj
					,param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){

							console.log("data ::: ",data);
							
							// 역할을 업데이트 했을 경우의 화면 변경.
							var MEMBER_NAME = data.NEW_ACTION_NAME;

							// 롤의 이름을 업데이트 합니다.
							row_role_jq.find("span.badge").find("strong").html(MEMBER_NAME);
							delegate_data.target_jq.attr("is_open", "NO");

							// 선택된 배지 녹색으로 변경
							var target_controller = delegate_data.delegate_data.target_controller;

							if(MEMBER_NAME == _param.NOT_ASSIGNED) {
								target_controller.set_badge_gray();
							} else {
								target_controller.set_badge_green();
							}

							// REFACTOR ME
							var body = $("html, body");
							row_member_obj.hide();
							body.stop().animate({scrollTop:0}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
							   console.log("Finished animating");

							   //console.log("사용자에게 업데이트가 완료되었음을 알립니다. / MEMBER_NAME :: ",MEMBER_NAME);	
							});

						},
						// delegate_scope
						this
					)
				); // ajax done.

			}, this)					
		);
	} // if end
}






// 0. 미팅 날짜 정보를 가져옵니다.
if(IS_EXTERNAL_SHARE) {

	_m_list.addTableRowTitle(
		// title
		membership_obj.__membership_name + " " + meeting_agenda_obj.__startdate
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(self_obj){

		}, this)
	);	

} else if(!IS_IFRAME_VIEW) {

	_m_list.addTableRowTitle(
		// title
		meeting_agenda_obj.__startdate
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(self_obj){

		}, this)
	);	

}







// Today's Role
// 화면 표시 기준에 맞게 정렬합니다.
var role_idx=0;
var role_name = "Toast Master"
var role_member_name = _param.NOT_ASSIGNED;
var role_obj = today_role_list[role_idx++];

console.log("role_obj ::: ",role_obj);

if(parseInt(role_obj.__member_id) > 0){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_toastmaster)
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
role_obj = today_role_list[role_idx++];
if(parseInt(role_obj.__member_id) > 0){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_general_evaluator)
);
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_controller.set_badge_green();
}




role_name = "Timer";
role_member_name = _param.NOT_ASSIGNED;
role_obj = today_role_list[role_idx++];
if(parseInt(role_obj.__member_id) > 0){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
}
role_controller = 
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_timer)
);
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_controller.set_badge_green();
}




role_name = "Table Topic Master";
role_member_name = _param.NOT_ASSIGNED;
role_obj = today_role_list[role_idx++];
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
}
role_controller = 
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_table_topic)
);
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_controller.set_badge_green();
}




role_name = "Ah & Vote Counter";
role_member_name = _param.NOT_ASSIGNED;
role_obj = today_role_list[role_idx++];
if(parseInt(role_obj.__member_id) > 0){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
}
role_controller = 
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_ah_counter)
);
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_controller.set_badge_green();
}






role_name = "Mini Debate Master";
role_member_name = _param.NOT_ASSIGNED;
role_obj = today_role_list[role_idx++];
if(parseInt(role_obj.__member_id) > 0){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
}
role_controller = 
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_mini_debate_master)
);
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_controller.set_badge_green();
}






role_name = "Grammarian";
role_member_name = _param.NOT_ASSIGNED;
role_obj = today_role_list[role_idx++];
if(parseInt(role_obj.__member_id) > 0){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
}
role_controller = 
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_grammarian)
);
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_controller.set_badge_green();
}






role_name = "Word & Quote Master";
role_member_name = _param.NOT_ASSIGNED;
role_obj = today_role_list[role_idx++];
if(parseInt(role_obj.__member_id) > 0){
	role_member_name = role_obj.__role_cnt + " " + role_obj.__member_first_name + " " + role_obj.__member_last_name;
}
role_controller = 
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
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.ROLE_ID, role_id_word_n_quote_master)
);
if(parseInt(role_obj.__member_id) > 0 && role_obj.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE){
	role_controller.set_badge_green();
}




// SHARE EXTERNAL
if(!IS_EXTERNAL_SHARE && !IS_IFRAME_VIEW) {

	var share_msg = "Did you take any role in " + membership_obj.__membership_desc + "?\nRole sign up on " + meeting_agenda_obj.__startdate;
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
			_link.MOBILE_MEETING_AGENDA_DETAIL_ROLE
			,_param
			.get(_param.IS_EXTERNAL_SHARE, _param.YES)
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		)
		// img_url
		,service_root_path + _link.IMG_SHARE_KAKAO_TM_LONG_BANNER
	);

}




// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
