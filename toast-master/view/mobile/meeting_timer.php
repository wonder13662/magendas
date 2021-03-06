<?php
// common setting
include_once("../../common.inc");

// 외부 공유 여부
$IS_EXTERNAL_SHARE = $params->isYes($params->IS_EXTERNAL_SHARE);

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1 || $IS_EXTERNAL_SHARE == TRUE) {
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
$upcoming_meeting_agenda_obj = $wdj_mysql_interface->get_upcoming_meeting_agenda($MEETING_MEMBERSHIP_ID);
if(!is_null($upcoming_meeting_agenda_obj)) {
	$upcoming_meeting_id = $upcoming_meeting_agenda_obj->__meeting_id;
}

if(0 < $upcoming_meeting_id) {
	// REMOVE ME
	$today_speech_list = $wdj_mysql_interface->sel_speech_speaker($upcoming_meeting_id);
	$speaker_timer_list = $wdj_mysql_interface->sel_speaker_n_timer($upcoming_meeting_id);
	$evaluator_timer_list = $wdj_mysql_interface->sel_evaluator_n_timer($upcoming_meeting_id);
}




	







// TIMER TARGET
// 1. TABLE TOPIC 	(DYNAMIC)
// 2. MINI DEBATE 	(DYNAMIC)
// 3. SPEAKER		(FIXED)
// 4. EVALUATOR		(FIXED)


$member_list = $wdj_mysql_interface->getMemberList($MEETING_MEMBERSHIP_ID, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);

$time_guide_line_list = $wdj_mysql_interface->getTimeGuideLine();

// time record list
$time_record_list_table_topic = $wdj_mysql_interface->selectTimerListByTimerType($upcoming_meeting_id, $params->TIMER_TYPE_ID_TABLE_TOPIC);
$time_record_list_mini_debate = $wdj_mysql_interface->selectTimerListByTimerType($upcoming_meeting_id, $params->TIMER_TYPE_ID_MINI_DEBATE);

// TODO 기본 인원을 만들어 주는 로직 필요. TTM은 2명. MD도 2명. - 추가하는 프로세스가 귀찮음.


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
var IS_EXTERNAL_SHARE = <?php echo json_encode($IS_EXTERNAL_SHARE);?>;

var upcoming_meeting_agenda_obj = <?php echo json_encode($upcoming_meeting_agenda_obj);?>;
var upcoming_meeting_id = <?php echo json_encode($upcoming_meeting_id);?>;

var today_speech_list = <?php echo json_encode($today_speech_list);?>;

var speaker_timer_list = <?php echo json_encode($speaker_timer_list);?>;
var speaker_no_timer_list = <?php echo json_encode($speaker_no_timer_list);?>;
var no_speaker_timer_list = <?php echo json_encode($no_speaker_timer_list);?>;

var evaluator_timer_list = <?php echo json_encode($evaluator_timer_list);?>;
var evaluator_no_timer_list = <?php echo json_encode($evaluator_no_timer_list);?>;
var no_evaluator_timer_list = <?php echo json_encode($no_evaluator_timer_list);?>;



var member_list = <?php echo json_encode($member_list);?>;
var time_guide_line_list = <?php echo json_encode($time_guide_line_list);?>;
var time_record_list_table_topic = <?php echo json_encode($time_record_list_table_topic);?>;
var time_record_list_mini_debate = <?php echo json_encode($time_record_list_mini_debate);?>;
var table_jq = $("table tbody");

var is_editable = true;
if((IS_EXTERNAL_SHARE === false && login_user_info.__is_club_member === false) || login_user_info.__is_login === _param.NO) {
	// 비로그인 상태이거나 클럽 멤버가 아닐 경우, 수정이 불가능합니다.
	is_editable = false;
}


console.log(">>> speaker_timer_list :: ",speaker_timer_list);
console.log(">>> evaluator_timer_list :: ",evaluator_timer_list);
console.log(">>> upcoming_meeting_agenda_obj :: ",upcoming_meeting_agenda_obj);







//     dMP dMP dMMMMMP .aMMMb  dMMMMb  dMMMMMP dMMMMb 
//    dMP dMP dMP     dMP"dMP dMP VMP dMP     dMP.dMP 
//   dMMMMMP dMMMP   dMMMMMP dMP dMP dMMMP   dMMMMK"  
//  dMP dMP dMP     dMP dMP dMP.aMP dMP     dMP"AMF   
// dMP dMP dMMMMMP dMP dMP dMMMMP" dMMMMMP dMP dMP                                                       

if(IS_EXTERNAL_SHARE===false) {

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

}












//     dMMMMMMMMb  dMMMMMP dMMMMMP dMMMMMMP dMP dMMMMb  .aMMMMP         dMP dMMMMb  dMMMMMP .aMMMb 
//    dMP"dMP"dMP dMP     dMP        dMP   amr dMP dMP dMP"            amr dMP dMP dMP     dMP"dMP 
//   dMP dMP dMP dMMMP   dMMMP      dMP   dMP dMP dMP dMP MMP"        dMP dMP dMP dMMMP   dMP dMP  
//  dMP dMP dMP dMP     dMP        dMP   dMP dMP dMP dMP.dMP         dMP dMP dMP dMP     dMP.aMP   
// dMP dMP dMP dMMMMMP dMMMMMP    dMP   dMP dMP dMP  VMMMP"         dMP dMP dMP dMP      VMMMP"    
                                                                                                
var now_date = _dates.getNow(_dates.DATE_TYPE_YYYY_MM_DD)
var days_left = _dates.get_YYYY_MM_DD_diff_days(now_date, upcoming_meeting_agenda_obj.__startdate);
var date_desc = "";
if(days_left < 1) {

	date_desc = upcoming_meeting_agenda_obj.__startdate + " ( Today )"

} else if(days_left == 1) {

	date_desc = upcoming_meeting_agenda_obj.__startdate + " ( Tomorrow )"

} else if(days_left == 2) {

	date_desc = upcoming_meeting_agenda_obj.__startdate + " ( The day after Tomorrow )"

} else {

	date_desc = upcoming_meeting_agenda_obj.__startdate + " ( " + days_left + " days left )"

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
	.get(_param.MEETING_ID,upcoming_meeting_id)
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
console.log(">>> time_record_list_table_topic :: ",time_record_list_table_topic);
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
	.get(_param.MEETING_ID, upcoming_meeting_id)
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
	.get(_param.MEETING_ID, upcoming_meeting_id)
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











//    .dMMMb  dMMMMb  dMMMMMP .aMMMb  dMP dMP dMMMMMP dMMMMb 
//   dMP" VP dMP.dMP dMP     dMP"dMP dMP.dMP dMP     dMP.dMP 
//   VMMMb  dMMMMP" dMMMP   dMMMMMP dMMMMK" dMMMP   dMMMMK"  
// dP .dMP dMP     dMP     dMP dMP dMP"AMF dMP     dMP"AMF   
// VMMMP" dMP     dMMMMMP dMP dMP dMP dMP dMMMMMP dMP dMP    

var timer_controller_prepared_speech = 
_tm_m_list.add_member_timer_table_fixed(
	// title
	"Prepared Speech"
	// append_target_jq
	, table_jq
	// event_toggle_controller
	, event_toggle_controller
	// meta data
	, _param
	.get(_param.MEETING_ID, upcoming_meeting_id)
);
for(var idx = 0;idx < speaker_timer_list.length;idx++) {
	var speech_speaker_obj = speaker_timer_list[idx];	

	var timer_record_obj_formatted = 
	timer_controller_prepared_speech.get_timer_record_obj(
		// is_qualified
		speech_speaker_obj.__speech_timer_is_qualified
		// meeting_id
		, speech_speaker_obj.__meeting_id
		// member_hash_key
		, speech_speaker_obj.__speaker_member_hash_key
		// member_name
		, speech_speaker_obj.__speaker_member_name
		// time_record_millisec
		, speech_speaker_obj.__speech_timer_time_record_milli_sec
		// timer_record_id
		, speech_speaker_obj.__speech_timer_id
		// timer_type_id
		, speech_speaker_obj.__speaker_speech_project_time_guide_line
		// time_arr
		,[
			parseInt(speech_speaker_obj.__speech_timer_sec_green)
			, parseInt(speech_speaker_obj.__speech_timer_sec_yellow)
			, parseInt(speech_speaker_obj.__speech_timer_sec_red)
		]
	);

	timer_controller_prepared_speech.add_timer(timer_record_obj_formatted);
}










//     dMMMMMP dMP dMP .aMMMb  dMP    dMP dMP .aMMMb dMMMMMMP .aMMMb  dMMMMb 
//    dMP     dMP dMP dMP"dMP dMP    dMP dMP dMP"dMP   dMP   dMP"dMP dMP.dMP 
//   dMMMP   dMP dMP dMMMMMP dMP    dMP dMP dMMMMMP   dMP   dMP dMP dMMMMK"  
//  dMP      YMvAP" dMP dMP dMP    dMP.aMP dMP dMP   dMP   dMP.aMP dMP"AMF   
// dMMMMMP    VP"  dMP dMP dMMMMMP VMMMP" dMP dMP   dMP    VMMMP" dMP dMP    

console.log(">>> evaluator_timer_list :: ",evaluator_timer_list);
var timer_controller_evaluator = 
_tm_m_list.add_member_timer_table_fixed(
	// title
	"Evaluator"
	// append_target_jq
	, table_jq
	// event_toggle_controller
	, event_toggle_controller
	// meta data
	, _param
	.get(_param.MEETING_ID, upcoming_meeting_id)
);
for(var idx = 0;idx < evaluator_timer_list.length;idx++) {
	var evaluator_obj = evaluator_timer_list[idx];

	var timer_record_obj_formatted = 
	timer_controller_prepared_speech.get_timer_record_obj(
		// is_qualified
		evaluator_obj.__evaluation_timer_is_qualified
		// meeting_id
		, evaluator_obj.__meeting_id
		// member_hash_key
		, evaluator_obj.__evaluator_member_hash_key
		// member_name
		, evaluator_obj.__evaluator_member_name
		// time_record_millisec
		, evaluator_obj.__evaluation_timer_time_record_milli_sec
		// timer_record_id
		, evaluator_obj.__evaluation_timer_id
		// timer_type_id
		, evaluator_obj.__evaluator_speech_project_time_guide_line
		// time_arr
		,[
			parseInt(evaluator_obj.__evaluation_timer_sec_green)
			, parseInt(evaluator_obj.__evaluation_timer_sec_yellow)
			, parseInt(evaluator_obj.__evaluation_timer_sec_red)
		]
	);

	timer_controller_evaluator.add_timer(timer_record_obj_formatted);
}


// SHARE EXTERNAL
var share_msg = membership_obj.__membership_desc + " needs Timer.\nAre you ready?\nMeeting Agenda On " + upcoming_meeting_agenda_obj.__startdate;
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
			_link.MOBILE_MEETING_TIMER
			,_param
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)			
		)
		// img_url
		,service_root_path + _link.IMG_SHARE_KAKAO_TM_LONG_BANNER
	);
}






// 99. REMOVE Loading message
_tm_m_list.doWhenDocumentReady();


</script>
</body>
</html>
