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

$MEETING_ID = $params->getParamNumber($params->MEETING_ID);

// 예정된 최신의 미팅을 1건 가져옵니다.
$upcoming_meeting_agenda = $wdj_mysql_interface->get_upcoming_meeting_agenda($MEETING_MEMBERSHIP_ID);

// 등록된 모든 미팅을 최신순으로 10건 가져옵니다.
$all_meeting_agenda_list =
$wdj_mysql_interface->getMeetingAgendaList(
	// meeting_membership_id
	$MEETING_MEMBERSHIP_ID
	// page
	, 1
	// size
	, 10
);

if(!empty($all_meeting_agenda_list)) {

	$recent_meeting_agenda_obj = $all_meeting_agenda_list[0];
	$recent_startdttm = $recent_meeting_agenda_obj->__startdttm;
	$recent_start_date = strtotime($recent_startdttm);
	$a_week_later_from_recent_meeting = date('Ymdhis', strtotime("+7 days", $recent_start_date));

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

	<tbody id="list">
		
	</tbody>

</table>


<script>

// php to javascript
var membership_obj = <?php echo json_encode($membership_obj);?>;

var all_meeting_agenda_list = <?php echo json_encode($all_meeting_agenda_list);?>;
var upcoming_meeting_agenda = <?php echo json_encode($upcoming_meeting_agenda);?>;

var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;
var a_week_later_from_recent_meeting = <?php echo json_encode($a_week_later_from_recent_meeting);?>;

console.log(">>> upcoming_meeting_agenda :: ",upcoming_meeting_agenda);

// Header - Log In Treatment
var table_jq = $("table tbody#list");
_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// membership_obj
	, membership_obj
	// header_arr
	, [ 
		_link.get_header_link(
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
	, table_jq
);

// Body - Content / 새로운 미팅을 추가합니다.
if(login_user_info.__is_club_member === true) {

	_m_list.addTableRowBtn(
		// title
		"Add New Meeting"
		// color
		, null
		// delegate_obj
		, _obj.getDelegate(function(){

			if(!confirm("Add New Meeting?")){
				return;
				//_link.go_there(_link.MOBILE_MEETING_AGENDA_DETAIL_ADD_NEW_ONE);
			}

			// 마지막 미팅으로부터 일주일 뒤의 미팅을 만듭니다.
			var request_param_obj =
			_param
			.get(_param.IS_NEW_MEETING_HEADER,_param.YES)
			.get(_param.MEETING_TEMPLATE_ID,_param.MEETING_TEMPLATE_ID_BASIC)
			.get(_param.MEETING_MEMBERSHIP_ID,MEETING_MEMBERSHIP_ID)
			.get(_param.THEME,_param.NO_THEME)
			.get(_param.START_DATE,a_week_later_from_recent_meeting)
			;

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj
				,request_param_obj
				// _delegate_after_job_done
				,_obj.get_delegate(function(data){

	        		if( data != undefined && 
	        			data.query_output_arr != undefined && 
	        			data.query_output_arr.length == 3 && 
	        			data.query_output_arr[2].output === true ) {

						_link.go_there(
							_link.MOBILE_MEETING_AGENDA_LIST
							,_param
							.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
						);

	        		}

				},this)
			); // ajax done.


		}, this)
		// append_target_jq
		, table_jq
	);	

}




// TODO AJAX를 통한 더보기 기능.
// draw table
var row_tag = "";
// 1. 곧 다가올 일정 리스트 - 1개만 노출
var tab_tag = "&nbsp;&nbsp;&nbsp;";
var meeting_agenda_info = upcoming_meeting_agenda.__round + "th" + tab_tag + upcoming_meeting_agenda.__theme;
var meeting_id = parseInt(upcoming_meeting_agenda.__meeting_id);

//var round = "<span class=\"badge\" style=\"color:#989898;background-color:#CCC;\"><_v></span>".replace(/\<_v\>/gi, element.__round + "th");
var round = 
"<span class=\"badge\" style=\"color:<COLOR>;background-color:<BG_COLOR>;\"><_v></span>"
.replace(/\<_v\>/gi, upcoming_meeting_agenda.__round + "th")
.replace(/\<COLOR\>/gi, _color.COLOR_WHITE)
.replace(/\<BG_COLOR\>/gi, _color.COLOR_EMERALD_GREEN)
;
var meeting_date = "<span><_v></span>".replace(/\<_v\>/gi, airborne.dates.getFormattedTime(upcoming_meeting_agenda.__startdttm,airborne.dates.DATE_TYPE_YYYY_MM_DD));
var theme_shorten = _html.getTextHead(upcoming_meeting_agenda.__theme, 20);
var row_upcoming_meeting = 
_m_list.addTableRowMovingArrow(
	// title
	round + tab_tag + meeting_date + tab_tag + theme_shorten
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

			var delegate_data = delegate_data.delegate_data;
			var MEETING_ID = parseInt(delegate_data.MEETING_ID);

			if(MEETING_ID > 0) {
				_link.go_there(
					_link.MOBILE_MEETING_AGENDA_DETAIL
					,_param
					.get(_param.MEETING_ID, MEETING_ID)
					.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
				);
			}

		}
		

	}, this)
	// is_bold
	, false
	// param_obj
	, _param.get(_param.MEETING_ID, meeting_id)
	// text_color
	, _color.COLOR_DARK_GRAY
	// bg_color
	, null
);

// 2. 시간순 리스트
for (var idx = 0; idx < all_meeting_agenda_list.length; idx++) {
	var element = all_meeting_agenda_list[idx];
	var tab_tag = "&nbsp;&nbsp;&nbsp;";
	var meeting_agenda_info = element.__round + "th" + tab_tag + element.__theme;
	var meeting_id = parseInt(element.__meeting_id);

	//var round = "<span class=\"badge\" style=\"color:#989898;background-color:#CCC;\"><_v></span>".replace(/\<_v\>/gi, element.__round + "th");
	var round = "<span class=\"badge\"><_v></span>".replace(/\<_v\>/gi, element.__round + "th");
	var meeting_date = "<span><_v></span>".replace(/\<_v\>/gi, airborne.dates.getFormattedTime(element.__startdttm,airborne.dates.DATE_TYPE_YYYY_MM_DD));
	var theme_shorten = _html.getTextHead(element.__theme, 20);

	var row_meeting = 
	_m_list.addTableRowMovingArrow(

		// title
		round + tab_tag + meeting_date + tab_tag + theme_shorten
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

				var delegate_data = delegate_data.delegate_data;
				var MEETING_ID = parseInt(delegate_data.MEETING_ID);

				if(MEETING_ID > 0) {
					_link.go_there(
						_link.MOBILE_MEETING_AGENDA_DETAIL
						,_param
						.get(_param.MEETING_ID, MEETING_ID)
						.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
					);
				}
			}

		}, this)
		// is_bold
		, false
		// param_obj
		, _param.get(_param.MEETING_ID, meeting_id)
		// text_color
		, null
		// bg_color
		, null
	);
};

// Set Event
var row_back_to_previous_jq = $("table tr#row_back_to_previous");
var row_back_to_previous_delegate_obj = _obj.getDelegate(function(self_obj){
	// 지정한 링크로 이동합니다.
	_link.go_there(_link.MOBILE_TOP);
}, this);
_m_list.setTableHeaderRowEvent(row_back_to_previous_jq, row_back_to_previous_delegate_obj);

var row_meeting_agenda_jq = table_jq.find("tr#row_meeting_agenda");
var row_meeting_agenda_delegate_obj = _obj.getDelegate(function(self_obj){

	var selected_meeting_id = $(self_obj).attr("meeting_agenda_id");

	// 지정한 링크로 이동합니다.
	_link.go_there(
		_link.MOBILE_MEETING_AGENDA_DETAIL
		, _param
		.get(_param.MEETING_ID, selected_meeting_id)
		.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
	);

}, this);
_m_list.setTableRowEvent(row_meeting_agenda_jq, row_meeting_agenda_delegate_obj);

// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
