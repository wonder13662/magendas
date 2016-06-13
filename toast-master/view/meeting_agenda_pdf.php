<?php

// common setting
include_once("../common.inc");

$meeting_id = $params->getParamNumber($params->MEETING_ID);
$meeting_membership_id = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);

// Get meeting agenda list
$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgenda($meeting_membership_id, $meeting_id);
$meeting_agenda_obj = null;
if(COUNT($meeting_agenda_list) > 0){
    $meeting_agenda_obj = $meeting_agenda_list[0];
}

// SELECT INFOS

// REMOVE ME
// $today_news_list = $wdj_mysql_interface->getNews($meeting_id);
// $schedule_timeline_list_V2 = $wdj_mysql_interface->getTimeline_V2($meeting_id);
// $today_speech_speaker_v2_list = $wdj_mysql_interface->sel_speech_speaker($meeting_id);
// $speech_project_list = $wdj_mysql_interface->getSpeechProjectList();
// $today_role_list = $wdj_mysql_interface->getTodayRoleList($meeting_membership_id, $meeting_id, array(7,2,9,5,10,6,11,4));
// $member_role_cnt_list = $wdj_mysql_interface->getMemberRoleCntList($meeting_membership_id);
// $member_list = $wdj_mysql_interface->getMemberList($meeting_membership_id, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);

// LEGACY
// 액션 리스트로 출력합니다.
// $action_list = $wdj_mysql_interface->get_root_action_collection(6507, 134); 	// 판교

// 액션 리스트로 출력합니다.
/*
$recent_action_id = $wdj_mysql_interface->select_recent_action_id_collection_by_meeting_id($meeting_id);
$action_list = null;
$recent_root_action_collection = null;
if(0 < $recent_action_id) {
	$action_list = $wdj_mysql_interface->get_root_action_collection($recent_action_id, $meeting_id);	
}
// Agent Check
$IS_MOBILE = false;
$user_agent = strtolower($_SERVER['HTTP_USER_AGENT']);
if ((strpos($user_agent,'iphone') !== false) || (strpos($user_agent,'android') !== false)) {
	$IS_MOBILE = true;
}
*/

$executive_member_list = $wdj_mysql_interface->getExcutiveMemberList($meeting_membership_id);
$FONT_SIZE = $params->getParamString($params->FONT_SIZE_LARGE);

// 1. 해당 미팅의 아젠다를 로딩합니다.
$action_file_info = $wdj_mysql_interface->select_action_file_info($meeting_id);
if(is_null($action_file_info)) {
	echo "!Error! / is_null(\$action_file_info)";
	return;
}
$result->action_file_info = $action_file_info;

// 2. 아젠다의 action obj를 가져옵니다.
$action_obj = ActionFileManager::load_action_obj($action_file_info->__action_regdate, $action_file_info->__action_hash_key);	
if(ActionObject::is_not_action_obj($action_obj)) {
	echo "!Error! / ActionObject::is_not_action_obj(\$action_obj)";
	return;
}





// @ required
$wdj_mysql_interface->close();






/*



PDF Setting



*/
include_once('../utils/tcpdf/tcpdf.php');
include_once('../utils/tcpdf.manager.inc');
/*



Create new PDF document



*/
$wdj_pdf = new TCPDFManager($service_root_path);
/*



BACKGROUND



*/
$wdj_pdf->DRAW_BG($wdj_pdf->color_white_arr);
/*

    dMMMMMMMMb dMMMMMP dMMMMMP dMMMMMMP dMP dMMMMb  .aMMMMP         .aMMMb  .aMMMMP dMMMMMP dMMMMb  dMMMMb  .aMMMb 
   dMP"dMP"dMPdMP     dMP        dMP   amr dMP dMP dMP"            dMP"dMP dMP"    dMP     dMP dMP dMP VMP dMP"dMP 
  dMP dMP dMPdMMMP   dMMMP      dMP   dMP dMP dMP dMP MMP"        dMMMMMP dMP MMP"dMMMP   dMP dMP dMP dMP dMMMMMP  
 dMP dMP dMPdMP     dMP        dMP   dMP dMP dMP dMP.dMP         dMP dMP dMP.dMP dMP     dMP dMP dMP.aMP dMP dMP   
dMP dMP dMPdMMMMMP dMMMMMP    dMP   dMP dMP dMP  VMMMP"         dMP dMP  VMMMP" dMMMMMP dMP dMP dMMMMP" dMP dMP    
                                                                                                                   
*/
$wdj_pdf->draw_meeting_agendar_header($meeting_agenda_obj);
/*

   .aMMMb  .aMMMb  dMMMMMMMMb dMMMMMMMMb .aMMMb  dMMMMb         dMMMMb  dMMMMb  .aMMMb  dMMMMb 
  dMP"VMP dMP"dMP dMP"dMP"dMPdMP"dMP"dMPdMP"dMP dMP dMP        dMP.dMP dMP.dMP dMP"dMP dMP.dMP 
 dMP     dMP dMP dMP dMP dMPdMP dMP dMPdMP dMP dMP dMP        dMMMMP" dMMMMK" dMP dMP dMMMMP"  
dMP.aMP dMP.aMP dMP dMP dMPdMP dMP dMPdMP.aMP dMP dMP        dMP     dMP"AMF dMP.aMP dMP       
VMMMP"  VMMMP" dMP dMP dMPdMP dMP dMP VMMMP" dMP dMP        dMP     dMP dMP  VMMMP" dMP        
                                                                                               
*/
$wdj_first_row_y_pos = 38.4;
$wdj_second_column_x_pos = 138.4;
$wdj_second_column_width = 69;
/*

 dMMMMMMP dMP dMMMMMMMMb dMMMMMP        .aMMMMP dMP dMP dMP dMMMMb  dMMMMMP         dMP     dMP dMMMMb  dMMMMMP 
   dMP   amr dMP"dMP"dMPdMP            dMP"    dMP dMP amr dMP VMP dMP             dMP     amr dMP dMP dMP      
  dMP   dMP dMP dMP dMPdMMMP          dMP MMP"dMP dMP dMP dMP dMP dMMMP           dMP     dMP dMP dMP dMMMP     
 dMP   dMP dMP dMP dMPdMP            dMP.dMP dMP.aMP dMP dMP.aMP dMP             dMP     dMP dMP dMP dMP        
dMP   dMP dMP dMP dMPdMMMMMP         VMMMP"  VMMMP" dMP dMMMMP" dMMMMMP         dMMMMMP dMP dMP dMP dMMMMMP     

*/

// TODO 
// 1. 엘리먼트 정보를 만듭니다. 이 때에 element_set 과 element를 만들고 돌려받습니다.
// 2. 엘리먼트 셋을 이용해서 화면에 그립니다.
$element_set_time_guide_line =
$wdj_pdf->draw_toast_master_time_guide_line_simple_table(
	// element_set_title
	"Time Guide Line"
	// element_set_x_pos
	, $wdj_second_column_x_pos
	// element_set_y_pos
	, $wdj_first_row_y_pos
	// element_set_width
	, $wdj_second_column_width
	// font_type
	, $FONT_SIZE
);





/*

   .aMMMb  dMMMMMP dMMMMMP dMP .aMMMb  dMMMMMP dMMMMb  .dMMMb 
  dMP"dMP dMP     dMP     amr dMP"VMP dMP     dMP.dMP dMP" VP 
 dMP dMP dMMMP   dMMMP   dMP dMP     dMMMP   dMMMMK"  VMMMb   
dMP.aMP dMP     dMP     dMP dMP.aMP dMP     dMP"AMF dP .dMP   
VMMMP" dMP     dMP     dMP  VMMMP" dMMMMMP dMP dMP  VMMMP"    
                                                              
*/
$element_set_bottom_y_pos = $element_set_time_guide_line->get_element_set_bottom_y_pos();
$wdj_pdf->draw_toastmaster_officer(	
	// title
	"Officers"
	// x pos
	, $wdj_second_column_x_pos
	// y pos
	, $element_set_bottom_y_pos + 3
	// cell width
	, $wdj_second_column_width
	// data
	, $executive_member_list
	// font_type
	, $FONT_SIZE
);

/*

 dMMMMMMP dMP dMMMMMMMMb dMMMMMP dMP     dMP dMMMMb  dMMMMMP 
   dMP   amr dMP"dMP"dMPdMP     dMP     amr dMP dMP dMP      
  dMP   dMP dMP dMP dMPdMMMP   dMP     dMP dMP dMP dMMMP     
 dMP   dMP dMP dMP dMPdMP     dMP     dMP dMP dMP dMP        
dMP   dMP dMP dMP dMPdMMMMMP dMMMMMP dMP dMP dMP dMMMMMP     

*/

// REMOVE ME IN FUTURE
// TEST
//$test_json_2_rows = "[[{\"__action_list\":[],\"__action_name\":\"Present awrard ( < 1 min )\",\"__prop_map\":{\"__add_on_obj_list\":[],\"__time_sec\":\"\",\"__is_shy\":false}},{\"__action_list\":[],\"__action_name\":\"Closing remarks ( < 2 min )\",\"__prop_map\":{\"__add_on_obj_list\":[],\"__time_sec\":\"\",\"__is_shy\":false}}],[{\"__action_list\":[],\"__action_name\":\"Present awrard ( < 1 min )\",\"__prop_map\":{\"__add_on_obj_list\":[],\"__time_sec\":\"\",\"__is_shy\":false}},{\"__action_list\":[],\"__action_name\":\"Closing remarks ( < 2 min )\",\"__prop_map\":{\"__add_on_obj_list\":[],\"__time_sec\":\"\",\"__is_shy\":false}}]]";
//JSONManager::get_json_obj_safe($test_json_2_rows);

//$TARGET_STR = "{\"__action_name\":\"Present awrard ( < 1 min )\",\"__action_list\":[]}";
//$TARGET_STR = "[{\"__action_name\":\"Present awrard ( < 1 min )\"},{\"__action_num\":-1234},{\"__action_arr\":[1,2,3,4]}]";
//$TARGET_STR = "[{\"__action_name\":\"Present awrard ( < 1 min )\"},{\"__action_num\":-1234},{\"__action_arr\":[\"A\",\"B\",\"C\",\"D\"]}]";
// $TARGET_STR = "[{\"__action_name\":\"Present awrard ( < 1 min )\"},{\"__action_num\":-1234},{\"__action_arr\":[[\"A\"],[\"B\"],[\"C\"],[\"D\"]]}]";
//$TARGET_STR = "[{\"__action_name\":\"Present awrard ( < 1 min )\"},{\"__action_num\":-1234},{\"__action_arr\":[[{\"key\":\"ACE\"},{\"key\":\"BLEND\"}],[{\"key\":\"ACE1\"},{\"key\":\"BLEND2\"}],[{\"key\":\"ACE3\"},{\"key\":\"BLEND3\"}]]}]";
//$result = JSONManager::parse_json_str_safe($TARGET_STR);
//JSONManager::print_hierarchy($result);

//$test = json_decode("{value:\"&quot;\"}");
// $test = json_decode("{\"value\":\"&lsquo;test\",\"value-1\":\"test-2\"}");
// echo "000<br/>";
// print_r($test);
// echo "000<br/>";

/*
$wdj_pdf->draw_card_board_timeline_V2(
	// title
	"Schedule"
	// x pos
	, 2
	// y pos
	, $wdj_first_row_y_pos
	// cell width
	, 133
	// data
	, $schedule_timeline_list_V2
	// meeting_agenda_obj
	, $meeting_agenda_obj
	// today_news_list
	, $today_news_list
	// today_role_list
	, $today_role_list
	// today_speech_speaker
	, $today_speech_speaker_v2_list
	// font_type=null
	, $FONT_SIZE
);
*/

// wonder.jung11
$action_obj->set_cell_x_pos(2);
$action_obj->set_cell_y_pos($wdj_first_row_y_pos);
$action_obj->set_cell_width(133);
$action_obj->set_font_type($FONT_SIZE);

$wdj_pdf->draw_element($action_obj);

// TEST 직접 사각형을 그림.
$cur_pdf = $wdj_pdf->get_pdf();






/*

   .dMMMb  .aMMMb  dMMMMMMMMb  dMMMMb  dMP     dMMMMMP 
  dMP" VP dMP"dMP dMP"dMP"dMP dMP.dMP dMP     dMP      
  VMMMb  dMMMMMP dMP dMP dMP dMMMMP" dMP     dMMMP     
dP .dMP dMP dMP dMP dMP dMP dMP     dMP     dMP        
VMMMP" dMP dMP dMP dMP dMP dMP     dMMMMMP dMMMMMP     


   .dMMMb  dMP dMMMMMMMMb  dMMMMb  dMP     dMMMMMP      dMMMMMMP .aMMMb  dMMMMb  dMP     dMMMMMP 
  dMP" VP amr dMP"dMP"dMP dMP.dMP dMP     dMP             dMP   dMP"dMP dMP"dMP dMP     dMP      
  VMMMb  dMP dMP dMP dMP dMMMMP" dMP     dMMMP           dMP   dMMMMMP dMMMMK" dMP     dMMMP     
dP .dMP dMP dMP dMP dMP dMP     dMP     dMP             dMP   dMP dMP dMP.aMF dMP     dMP        
VMMMP" dMP dMP dMP dMP dMP     dMMMMMP dMMMMMP         dMP   dMP dMP dMMMMP" dMMMMMP dMMMMMP     

*/
// $simple_table_row_arr = $wdj_pdf->get_simple_table_data_sample();
// $wdj_x_pos = 95;
// $wdj_y_pos = 56;
// $wdj_simple_table_width=50;
// $wdj_pdf->create_simple_table($simple_table_row_arr, $wdj_x_pos, $wdj_y_pos, $wdj_simple_table_width);
/*



SAMPLE - POLYGON TEST



*/
// $wdj_pdf->draw_timeline_time_guide_marker(157,100,4,66.8);



// ---------------------------------------------------------

//Close and output PDF document
// $dest = "D";
// if($IS_MOBILE == true) {
// 	// I: send the file inline to the browser (default). The plug-in is used if available. The name given by name is used when one selects the "Save as" option on the link generating the PDF.
// 	$dest = "I";
// }
$meeting_title = $meeting_agenda_obj->__membership_desc ." " . $meeting_agenda_obj->__startdate . " " . $meeting_agenda_obj->__theme . ".pdf";
$wdj_pdf->show_output($meeting_title);

//============================================================+
// END OF FILE
//============================================================+

?>
