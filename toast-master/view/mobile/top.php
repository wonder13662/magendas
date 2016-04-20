<?php
// common setting
include_once("../../common.inc");

// TODO 멤버쉽 정보를 가지고 있는 쿠키를 따로 받아옵니다.

// Membership Check
//$meeting_membership_id = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);
$meeting_membership_id = ToastMasterLogInManager::getMembershipCookie();
if($meeting_membership_id == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($meeting_membership_id);
	$membership_obj = $membership_obj_arr[0];
}


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
	<tbody>
		<!-- list contents -->
	</tbody>
</table>


<script>











// COMMON PROPS
var membership_obj = <?php echo json_encode($membership_obj);?>;
var meeting_membership_id = <?php echo json_encode($meeting_membership_id);?>;

console.log(">>> login_user_info :: ",login_user_info);

// view drawing
var table_jq = $("table tbody");

// login_user_info, header_arr, table_jq, color_text, bg_color_vmouse_down

// 메뉴 뎁스 리스트를 보여줍니다.
var log_in_row_jq = 
_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// membership_obj
	, membership_obj
	// header_arr
	, []
	// table_jq
	, table_jq
	// color_text
	, null
	// bg_color_vmouse_down
	, null
	// is_disabled
	, null
	// redirect_url_after_log_in
	,_link.get_link(_link.MOBILE_TOP)
);




// 미팅에 참여한 로그인 유저가 볼 수 있는 메뉴.

// 0-1. Attendence (출석) / 출석 도장을 찍을 수 있습니다.

// 0-2. Role Signup Sheet (다음 미팅의 역할 지정) --> 미팅이 자동으로 생성되어서 롤 역할을 지정. 
// 그렇다면 템플릿 정보는 어떻게 변경?? 템플릿 정보를 이미 만들어진 미팅 아젠다에서도 바꿀수 있어야한다

// 0-3. Timer 
// 자신이 타이머로 등록된 미팅에만 나타납니다.
// 해당일일 경우만 
// 미팅의 스피커들의 시간을 기록하는 일을 할 수 있습니다. 시간을 재면 해당 기록이 각각의 스피커에게 저장됩니다.




// 1. Meeting Agenda List
_m_list.addTableRowMovingArrow(
	// title
	"Meeting Agenda"
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(delegate_data){

		if(	delegate_data == undefined ||
			delegate_data.delegate_data == undefined ||
			_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

			return;
		}

		_link.go_there(
			_link.MOBILE_MEETING_AGENDA_DETAIL
			, _param.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
		);

	}, this)
	// is_bold
	, true
	// param_obj
	, null
	// text_color
	, _tm_m_list.COLOR_NAVY
	// bg_color
	, _tm_m_list.COLOR_TINT_GRAY
);









// 1. TIMER
_m_list.addTableRowMovingArrow(
	// title
	"Timer"
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(delegate_data){

		if(	delegate_data == undefined ||
			delegate_data.delegate_data == undefined ||
			_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

			return;
		}

		_link.go_there(
			_link.MOBILE_MEETING_TIMER
			, _param
			.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
		);

	}, this)
	// is_bold
	, true
	// param_obj
	, null
	// text_color
	, _tm_m_list.COLOR_NAVY
	// bg_color
	, _tm_m_list.COLOR_TINT_GRAY
);










// 1. Role Sign Up Sheet
if(login_user_info.__is_club_member === true) {
	_m_list.addTableRowMovingArrow(
		// title
		"Role Sign Up"
		// append_target_jq
		, table_jq
		// delegate_obj_row_click
		, _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

				return;
			}

			_link.go_there(
				_link.MOBILE_ROLE_SIGN_UP_LIST
				, _param
				.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
			);

		}, this)
		// is_bold
		, true
		// param_obj
		, null
		// text_color
		, _tm_m_list.COLOR_NAVY
		// bg_color
		, _tm_m_list.COLOR_TINT_GRAY
	);
}






// 3. Members
if(login_user_info.__is_club_member === true) {
	_m_list.addTableRowMovingArrow(
		// title
		"Members"
		// append_target_jq
		, table_jq
		// delegate_obj_row_click
		, _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

				return;
			}

			_link.go_there(
				_link.MOBILE_MEMBER_MANAGE
				, _param
				.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
			);

		}, this)
		// is_bold
		, true
		// param_obj
		, null
		// text_color
		, _tm_m_list.COLOR_NAVY
		// bg_color
		, _tm_m_list.COLOR_TINT_GRAY	
	);
}







// TODO
// 4. HELP
/*
_m_list.addTableRowMovingArrow(
	// title
	"Help"
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(delegate_data){

		if(	delegate_data == undefined ||
			delegate_data.delegate_data == undefined ||
			_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

			return;
		}

		_link.go_there(
			_link.MOBILE_HELP_LIST
			, _param
			.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
		);

	}, this)
	// is_bold
	, true
	// param_obj
	, null
	// text_color
	, _tm_m_list.COLOR_NAVY
	// bg_color
	, _tm_m_list.COLOR_TINT_GRAY	
);
*/





// 3. Jessie
// _jessie.init(service_root_path);
// _jessie.sayHello(login_user_info, log_in_row_jq.find("td"));

// 99. REMOVE Loading message
_tm_m_list.doWhenDocumentReady();


</script>
</body>
</html>
