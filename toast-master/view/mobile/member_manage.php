<?php

// common setting
include_once("../../common.inc");

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
	$membership_obj = $membership_obj_arr[0];

	$login_user_info->__membership_id = $membership_obj->__membership_id;
	$login_user_info->__membership_name = $membership_obj->__membership_name;
}

// 로그인 되어 있지 않으면 로그인 페이지로!
if($login_user_info->__is_login==$params->NO){
	ToastMasterLinkManager::go(ToastMasterLinkManager::$LOG_IN);
}

// 6개월간 아무런 활동이 없었던 멤버들의 상태를 N으로 바꿉니다.
$sleeping_member_list = $wdj_mysql_interface->getSleepingMember($expire_date, $MEETING_MEMBERSHIP_ID);
for($idx = 0; $idx < sizeof($sleeping_member_list); $idx++){
    $sleeping_member = $sleeping_member_list[$idx];
    $wdj_mysql_interface->goodNightMember($sleeping_member->__member_id);
}

// SELECT INFOS
$all_member_list = 
$wdj_mysql_interface->getMemberListByMembershipId(
	// $membership_id=1
	$MEETING_MEMBERSHIP_ID
);

// TODO userid 생성. 번호로 정의되는 member_id는 외부 공격에 위험.
// SELECT MD5('testing');
//echo hash('crc32b', 'Wonder Jung');

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
var all_member_list = <?php echo json_encode($all_member_list);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;

// Header - Log In Treatment
var table_jq = $("table tbody#list");

_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// header_arr
	,[
		_link.get_header_link(
			_link.MOBILE_MEMBER_MANAGE
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




// Body - Content
_m_list.addTableRowBtn(
	// title
	"Add New Member"
	// color
	, null
	// delegate_obj
	, _obj.getDelegate(function(){

		if(confirm("Add New Member?")){
			_link.go_there(_link.MOBILE_MEMBER_MANAGE_DETAIL);
		}

	}, this)
	// append_target_jq
	, table_jq
);




// TODO 자신이 로그인한 클럽의 회원들을 보여줍니다.
// draw table
var row_tag = "";

for (var idx = 0; idx < all_member_list.length; idx++) {
	var element = all_member_list[idx];
	var tab_tag = "&nbsp;&nbsp;&nbsp;";
	var meeting_agenda_info = element.__round + "th" + tab_tag + element.__theme;
	var member_id = parseInt(element.__member_id);

	var row_achievements_jq = 
	_m_list.addTableRowMovingArrow(

		// title
		//round + tab_tag + meeting_date + tab_tag + theme_shorten
		element.__member_name
		// append_target_jq
		, table_jq
		// delegate_obj_row_click
		, _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

				console.log("!Error!\taddTableRowMovingArrow\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
				return;
			}

			if(_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

				var MEMBER_ID = delegate_data.delegate_data.MEMBER_ID;
				if(MEMBER_ID > 0) {
					_link.go_there(
						_link.MOBILE_MEMBER_MANAGE_DETAIL
						,_param
						.get(_param.MEMBER_ID, MEMBER_ID)
						.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
					);
				}
			}
			

		}, this)
		// is_bold
		, false
		// param_obj
		, _param.get(_param.MEMBER_ID, member_id)
		// text_color
		, null
		// bg_color
		, null
	);
};







// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
