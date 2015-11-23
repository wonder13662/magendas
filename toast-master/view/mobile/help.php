<?php
// common setting
include_once("../../common.inc");

// Membership Check
$meeting_membership_id = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);
if($meeting_membership_id == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($meeting_membership_id);
	$membership_obj = $membership_obj_arr[0];

	$login_user_info->__membership_id = $membership_obj->__membership_id;
	$login_user_info->__membership_name = $membership_obj->__membership_name;
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
var login_user_info = <?php echo json_encode($login_user_info);?>;
var membership_obj = <?php echo json_encode($membership_obj);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;

//membership_obj

console.log(">>> login_user_info :: ",login_user_info);
console.log(">>> membership_obj :: ",membership_obj);



// view drawing
var table_jq = $("table tbody");


// login_user_info, header_arr, table_jq, color_text, bg_color_vmouse_down

// 메뉴 뎁스 리스트를 보여줍니다.
var log_in_row_jq = 
_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// header_arr 
	,[
		_link.get_header_link(
			_link.MOBILE_HELP_LIST
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
	, table_jq
);

// ## why magendas?
// 0. 왜 magendas를 사용해야 하나요?

// ## 미팅 아젠다 추가하기.
// 1-1. 미팅을 추가하는 방법.
// 1-2. 미팅을 세팅하는 방법.
// 1-2-1. MOBILE
// 1-2-2. PC
// 1-3. 미팅 아젠다를 출력하는 방법.

// ## 새로운 멤버를 추가하기
// 1. 새로운 멤버를 추가하기

// ## 




// 1. Meeting Agenda List
/*
var row_meeting_agenda_jq = 
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
			_link.MOBILE_MEETING_AGENDA_LIST
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








// 99. REMOVE Loading message
_tm_m_list.doWhenDocumentReady();


</script>
</body>
</html>
