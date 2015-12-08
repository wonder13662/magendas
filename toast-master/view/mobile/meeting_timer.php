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

// 앞으로 진행할 최신 미팅 1개의 정보를 가져옵니다.
// 최신순으로 등록된 미팅을 10개 가져옵니다.
$recent_meeting_agenda_list =
$wdj_mysql_interface->getMeetingAgendaListUpcoming(
	// meeting_membership_id
	$MEETING_MEMBERSHIP_ID
	// page
	, 1
	// size
	, 1
	// is_sooner_first
	, true
);
$recent_meeting_id = -1;
if(!empty($recent_meeting_agenda_list)) {
	$recent_meeting_agenda_obj = $recent_meeting_agenda_list[0];
	$recent_meeting_id = $recent_meeting_agenda_obj->__meeting_id;
}
if(0 < $recent_meeting_id) {
	$today_speech_list = $wdj_mysql_interface->sel_today_speech_speaker_v2($recent_meeting_id);
}



// TIMER TARGET
// 1. TABLE TOPIC 	(DYNAMIC)
// 2. MINI DEBATE 	(DYNAMIC)
// 3. SPEAKER		(FIXED)
// 4. EVALUATOR		(FIXED)


$member_list = $wdj_mysql_interface->getMemberList($MEETING_MEMBERSHIP_ID, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);

$time_guide_line_list = $wdj_mysql_interface->getTimeGuideLine();

// time record list
$time_record_list_table_topic = $wdj_mysql_interface->selectTimerListByTimerType($recent_meeting_id, $params->TIMER_TYPE_ID_TABLE_TOPIC);
$time_record_list_mini_debate = $wdj_mysql_interface->selectTimerListByTimerType($recent_meeting_id, $params->TIMER_TYPE_ID_MINI_DEBATE);






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

var recent_meeting_agenda_obj = <?php echo json_encode($recent_meeting_agenda_obj);?>;
var recent_meeting_id = <?php echo json_encode($recent_meeting_id);?>;

var today_speech_list = <?php echo json_encode($today_speech_list);?>;
var member_list = <?php echo json_encode($member_list);?>;
var time_guide_line_list = <?php echo json_encode($time_guide_line_list);?>;
var time_record_list_table_topic = <?php echo json_encode($time_record_list_table_topic);?>;
var time_record_list_mini_debate = <?php echo json_encode($time_record_list_mini_debate);?>;
var table_jq = $("table tbody");






//     dMP dMP dMMMMMP .aMMMb  dMMMMb  dMMMMMP dMMMMb 
//    dMP dMP dMP     dMP"dMP dMP VMP dMP     dMP.dMP 
//   dMMMMMP dMMMP   dMMMMMP dMP dMP dMMMP   dMMMMK"  
//  dMP dMP dMP     dMP dMP dMP.aMP dMP     dMP"AMF   
// dMP dMP dMMMMMP dMP dMP dMMMMP" dMMMMMP dMP dMP                                                       

var test = 
_link.get_header_link(
	_link.MOBILE_MEETING_TIMER
	,_param
	.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)			
);
console.log(">>> test :: ",test);

var log_in_row_jq = 
_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// membership_obj
	, membership_obj
	// header_arr 
	,[
		_link.get_header_link(
			_link.MOBILE_MEETING_TIMER
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











//     dMMMMMMMMb  dMMMMMP dMMMMMP dMMMMMMP dMP dMMMMb  .aMMMMP         dMP dMMMMb  dMMMMMP .aMMMb 
//    dMP"dMP"dMP dMP     dMP        dMP   amr dMP dMP dMP"            amr dMP dMP dMP     dMP"dMP 
//   dMP dMP dMP dMMMP   dMMMP      dMP   dMP dMP dMP dMP MMP"        dMP dMP dMP dMMMP   dMP dMP  
//  dMP dMP dMP dMP     dMP        dMP   dMP dMP dMP dMP.dMP         dMP dMP dMP dMP     dMP.aMP   
// dMP dMP dMP dMMMMMP dMMMMMP    dMP   dMP dMP dMP  VMMMP"         dMP dMP dMP dMP      VMMMP"    
                                                                                                
var now_date = _dates.getNow(_dates.DATE_TYPE_YYYY_MM_DD)
var days_left = _dates.get_YYYY_MM_DD_diff_days(now_date, recent_meeting_agenda_obj.__startdate);
var date_desc = "";
if(days_left < 1) {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( Today )"

} else if(days_left == 1) {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( Tomorrow )"

} else if(days_left == 2) {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( The day after Tomorrow )"

} else {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( " + days_left + " days left )"

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












//     dMMMMMMMMb  dMMMMMP dMMMMMMMMb  dMMMMb  dMMMMMP dMMMMb         dMP     dMP .dMMMb dMMMMMMP 
//    dMP"dMP"dMP dMP     dMP"dMP"dMP dMP"dMP dMP     dMP.dMP        dMP     amr dMP" VP   dMP    
//   dMP dMP dMP dMMMP   dMP dMP dMP dMMMMK" dMMMP   dMMMMK"        dMP     dMP  VMMMb    dMP     
//  dMP dMP dMP dMP     dMP dMP dMP dMP.aMF dMP     dMP"AMF        dMP     dMP dP .dMP   dMP      
// dMP dMP dMP dMMMMMP dMP dMP dMP dMMMMP" dMMMMMP dMP dMP        dMMMMMP dMP  VMMMP"   dMP       
                                                                                               
var key_value_obj_arr = [];
for(var idx = 0;idx < member_list.length; idx++) {
	var member_obj = member_list[idx];
	var key_value_obj = 
	_obj.get_select_option(
		// key_str
		member_obj.__member_hash_key
		// value_str
		,member_obj.__member_name
	);

	key_value_obj_arr.push(key_value_obj);
}
// MEMBER LIST
var member_list_controller = 
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
	.get(_param.MEETING_ID,recent_meeting_id)
	// text_color
	, _color.COLOR_MEDIUM_GRAY
	// bg_color
	, _color.COLOR_WHITE
);
member_list_controller.hide();

















//     dMMMMMP dMP dMP dMMMMMP dMMMMb dMMMMMMP      dMMMMMMP .aMMMb  .aMMMMP .aMMMMP dMP     dMMMMMP dMMMMb 
//    dMP     dMP dMP dMP     dMP dMP   dMP           dMP   dMP"dMP dMP"    dMP"    dMP     dMP     dMP.dMP 
//   dMMMP   dMP dMP dMMMP   dMP dMP   dMP           dMP   dMP dMP dMP MMP"dMP MMP"dMP     dMMMP   dMMMMK"  
//  dMP      YMvAP" dMP     dMP dMP   dMP           dMP   dMP.aMP dMP.dMP dMP.dMP dMP     dMP     dMP"AMF   
// dMMMMMP    VP"  dMMMMMP dMP dMP   dMP           dMP    VMMMP"  VMMMP"  VMMMP" dMMMMMP dMMMMMP dMP dMP    
                                                                                                         
// event hierarchy controller
// 타이머 작동시 나머지 버튼들에 대해 비활성화 처리를 위해 필요합니다.
// 저장된 모든 객체의 on/off 메서드를 호출해줍니다.
var event_toggle_controller = _m_list.get_event_toggle_controller();

















//  dMMMMMMP dMP dMMMMMMMMb  dMMMMMP dMMMMb      dMMMMMMP .aMMMb  dMMMMb  dMP     dMMMMMP      dMMMMMMP .aMMMb  dMMMMb  dMP .aMMMb 
//    dMP   amr dMP"dMP"dMP dMP     dMP.dMP        dMP   dMP"dMP dMP"dMP dMP     dMP             dMP   dMP"dMP dMP.dMP amr dMP"VMP 
//   dMP   dMP dMP dMP dMP dMMMP   dMMMMK"        dMP   dMMMMMP dMMMMK" dMP     dMMMP           dMP   dMP dMP dMMMMP" dMP dMP      
//  dMP   dMP dMP dMP dMP dMP     dMP"AMF        dMP   dMP dMP dMP.aMF dMP     dMP             dMP   dMP.aMP dMP     dMP dMP.aMP   
// dMP   dMP dMP dMP dMP dMMMMMP dMP dMP        dMP   dMP dMP dMMMMP" dMMMMMP dMMMMMP         dMP    VMMMP" dMP     dMP  VMMMP"    

var time_guide_line_table_topic = time_guide_line_list[(_param.TIMER_TYPE_ID_TABLE_TOPIC - 1)];
var time_table_arr_table_topic = 
[
	parseInt(time_guide_line_table_topic.__time_guide_line_sec_green)
	, parseInt(time_guide_line_table_topic.__time_guide_line_sec_yellow)
	, parseInt(time_guide_line_table_topic.__time_guide_line_sec_red)
];
var timer_controller_table_topic = 
_tm_m_list.add_member_timer_table_editable(
	// title
	"+ Table Topic Speaker"
	// time_arr
	, time_table_arr_table_topic
	// append_target_jq
	, table_jq
	// event_toggle_controller
	, event_toggle_controller
	// member_list_controller
	, member_list_controller
	// meta data
	, _param
	.get(_param.MEETING_ID, recent_meeting_id)
	.get(_param.TIMER_TYPE_ID, parseInt(time_guide_line_table_topic.__time_guide_line_id))
	.get(_param.IS_DATA_FROM_DB, false)
);
for(var idx = 0;idx < time_record_list_table_topic.length;idx++) {
	var timer_record_obj = time_record_list_table_topic[idx];	

	var timer_record_obj_formatted = 
	timer_controller_table_topic.get_timer_record_obj(
		// is_qualified
		timer_record_obj.__is_qualified
		// meeting_id
		, timer_record_obj.__meeting_id
		// member_hash_key
		, timer_record_obj.__member_hash_key
		// member_name
		, timer_record_obj.__member_name
		// time_record_millisec
		, timer_record_obj.__time_record_milli_sec
		// timer_record_id
		, timer_record_obj.__timer_record_id
		// timer_type_id
		, timer_record_obj.__timer_type_id
	);

	timer_controller_table_topic.add_timer(timer_record_obj_formatted);
}










//  dMMMMMMP dMP dMMMMMMMMb dMMMMMP dMMMMb         dMMMMMMMMb dMP dMMMMb  dMP         dMMMMb  dMMMMMP dMMMMb  .aMMMb dMMMMMMP dMMMMMP 
//    dMP   amr dMP"dMP"dMPdMP     dMP.dMP        dMP"dMP"dMPamr dMP dMP amr         dMP VMP dMP     dMP"dMP dMP"dMP   dMP   dMP      
//   dMP   dMP dMP dMP dMPdMMMP   dMMMMK"        dMP dMP dMPdMP dMP dMP dMP         dMP dMP dMMMP   dMMMMK" dMMMMMP   dMP   dMMMP     
//  dMP   dMP dMP dMP dMPdMP     dMP"AMF        dMP dMP dMPdMP dMP dMP dMP         dMP.aMP dMP     dMP.aMF dMP dMP   dMP   dMP        
// dMP   dMP dMP dMP dMPdMMMMMP dMP dMP        dMP dMP dMPdMP dMP dMP dMP         dMMMMP" dMMMMMP dMMMMP" dMP dMP   dMP   dMMMMMP     
                                                                                                                                   
var time_guide_line_mini_debate = time_guide_line_list[(_param.TIMER_TYPE_ID_MINI_DEBATE - 1)];
var time_table_arr_mini_debate = 
[
	parseInt(time_guide_line_mini_debate.__time_guide_line_sec_green)
	, parseInt(time_guide_line_mini_debate.__time_guide_line_sec_yellow)
	, parseInt(time_guide_line_mini_debate.__time_guide_line_sec_red)
];
console.log(">>> time_guide_line_list :: ",time_guide_line_list);
console.log(">>> time_table_arr_mini_debate :: ",time_table_arr_mini_debate);
console.log(">>> time_record_list_mini_debate :: ",time_record_list_mini_debate);
var timer_controller_mini_debate = 
_tm_m_list.add_member_timer_table_editable(
	// title
	"+ Mini Debate Speaker"
	// time_arr
	, time_table_arr_mini_debate
	// append_target_jq
	, table_jq
	// event_toggle_controller
	, event_toggle_controller
	// member_list_controller
	, member_list_controller
	// meta data
	, _param
	.get(_param.MEETING_ID, recent_meeting_id)
	.get(_param.TIMER_TYPE_ID, parseInt(time_guide_line_mini_debate.__time_guide_line_id))
	.get(_param.IS_DATA_FROM_DB, false)
);
for(var idx = 0;idx < time_record_list_mini_debate.length;idx++) {
	var timer_record_obj = time_record_list_mini_debate[idx];	

	var timer_record_obj_formatted = 
	timer_controller_mini_debate.get_timer_record_obj(
		// is_qualified
		timer_record_obj.__is_qualified
		// meeting_id
		, timer_record_obj.__meeting_id
		// member_hash_key
		, timer_record_obj.__member_hash_key
		// member_name
		, timer_record_obj.__member_name
		// time_record_millisec
		, timer_record_obj.__time_record_milli_sec
		// timer_record_id
		, timer_record_obj.__timer_record_id
		// timer_type_id
		, timer_record_obj.__timer_type_id
	);

	timer_controller_mini_debate.add_timer(timer_record_obj_formatted);
}

// TODO 지우고 새 열을 추가하면 참조를 잃어버려 추가가 안됨.



// CREATE TABLE `MA_TIMER_RECORD` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `meeting_id` int(11) NOT NULL,
//   `timer_type_id` int(11) NOT NULL,
//   `member_id` int(11) NOT NULL,
//   `time_record_milli_sec` int(11) NOT NULL,
//   `is_qualified` tinyint(1) NOT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_bin

// UPDATE MA_TIMER_GUIDE_LINE
// SET sec_green = 60, sec_yellow = 60, sec_red = 60
// WHERE id=6
// ;










// 99. REMOVE Loading message
_tm_m_list.doWhenDocumentReady();


</script>
</body>
</html>
