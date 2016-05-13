<?php

// common setting
include_once("../../common.inc");

// 이 페이지는 로그인여부를 먼저 확인합니다. 클럽의 멤버만이 로그인 할 수 있습니다.
// 로그인 되어 있지 않으면 로그인 페이지로!
if($login_user_info->__is_login==$params->NO){
	ToastMasterLinkManager::go(ToastMasterLinkManager::$LOG_IN);
}

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
	$membership_obj = $membership_obj_arr[0];
}

// 로그인한 유저가 해당 클럽에 가입되어 있는지 확인합니다.
// 가입되어 있지 않다면 TOP 페이지로 리다이렉트 합니다.
if(is_null($login_user_info) || is_null($login_user_info->__is_club_member) || $login_user_info->__is_club_member == false){
	ToastMasterLinkManager::go(
		// link
		ToastMasterLinkManager::$MOBILE_TOP
	);
}


// 6개월간 아무런 활동이 없었던 멤버들의 상태를 N으로 바꿉니다.
$sleeping_member_list = $wdj_mysql_interface->getSleepingMember($expire_date, $MEETING_MEMBERSHIP_ID);
for($idx = 0; $idx < sizeof($sleeping_member_list); $idx++){
    $sleeping_member = $sleeping_member_list[$idx];
    $wdj_mysql_interface->goodNightMember($sleeping_member->__member_id);
}

// SELECT INFOS
$all_member_list = 
$wdj_mysql_interface->getMemberListByMembershipIdNMemberHashkey(
	// $membership_id=-1
	$MEETING_MEMBERSHIP_ID
	// $member_hashkey=""
	, $login_user_info->__member_hashkey
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

var membership_obj = <?php echo json_encode($membership_obj);?>;
var login_user_info = <?php echo json_encode($login_user_info);?>;

console.log(">>> membership_obj :: ",membership_obj);
console.log(">>> login_user_info :: ",login_user_info);

// print_r($membership_obj);
// echo "<br/>";
// print_r($login_user_info);
// echo "<br/>";

console.log("001");

// Header - Log In Treatment
var table_jq = $("table tbody#list");
//,addHeaderRow:function(login_user_info, membership_obj, header_arr, table_jq, color_text, bg_color_vmouse_down, is_disabled, redirect_url_after_log_in){
var redirect_url_after_log_in = 
_link.get_header_link(
	_link.MOBILE_MEMBER_MANAGE
	,_param
	.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
);

console.log("002");

console.log("redirect_url_after_log_in ::: ",redirect_url_after_log_in);

_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// membership_obj
	, membership_obj
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
	// color_text
	, null
	// bg_color_vmouse_down
	, null
	// is_disabled
	, null
	// redirect_url_after_log_in
	,redirect_url_after_log_in
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
	var member_hash_key = element.__member_hash_key;

	var text_color = null;
	if(idx == 0) {
		// LOG IN USER
		text_color = _color.COLOR_NAVY;
	} else if(element.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE) {
		// ACTIVE USER
		text_color = _color.COLOR_DARK_GRAY;
	} else if(element.__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_SLEEPING) {
		// SLEEP USER
		text_color = _color.COLOR_MEDIUM_GRAY;
	}

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

				var MEMBER_HASH_KEY = delegate_data.delegate_data.MEMBER_HASH_KEY;

				if(_v.is_valid_str(MEMBER_HASH_KEY)) {
					_link.go_there(
						_link.MOBILE_MEMBER_MANAGE_DETAIL
						,_param
						.get(_param.MEMBER_HASH_KEY, MEMBER_HASH_KEY)
						.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
					);
				}
			}
			

		}, this)
		// is_bold
		, false
		// param_obj
		, _param.get(_param.MEMBER_HASH_KEY, member_hash_key)
		// text_color
		, text_color
		// bg_color
		, null
	);
};







// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
