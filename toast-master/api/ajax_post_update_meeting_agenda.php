<?php

	// common setting
	include_once("../common.inc");
	include_once("../db/toast-master/mysql.interface.toast-master.inc");

	$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
	$result = new stdClass();
	$result->query_output_arr = array();
	$debug = "";
	$debug_stack_array = array();

	function terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug="") {
		// CLOSE DB
		$wdj_mysql_interface->close();

		// OUTPUT
		$result->debug=$debug;
		$result->debug_stack_array=$debug_stack_array;
		echo json_encode($result);

		return;
	}









	// GET PARAMS

	//    .aMMMb  .aMMMb  dMMMMMMMMb dMMMMMMMMb .aMMMb  dMMMMb 
	//   dMP"VMP dMP"dMP dMP"dMP"dMPdMP"dMP"dMPdMP"dMP dMP dMP 
	//  dMP     dMP dMP dMP dMP dMPdMP dMP dMPdMP dMP dMP dMP  
	// dMP.aMP dMP.aMP dMP dMP dMPdMP dMP dMPdMP.aMP dMP dMP   
	// VMMMP"  VMMMP" dMP dMP dMPdMP dMP dMP VMMMP" dMP dMP    

	// MEETING AGENDA COMMON
	$MEETING_ID = $params->getParamNumber($params->MEETING_ID);
		







	//     dMP dMP dMMMMMP .aMMMb  dMMMMb  dMMMMMP dMMMMb 
	//    dMP dMP dMP     dMP"dMP dMP VMP dMP     dMP.dMP 
	//   dMMMMMP dMMMP   dMMMMMP dMP dMP dMMMP   dMMMMK"  
	//  dMP dMP dMP     dMP dMP dMP.aMP dMP     dMP"AMF   
	// dMP dMP dMMMMMP dMP dMP dMMMMP" dMMMMMP dMP dMP    

	// HEADER

	$IS_UPDATE_HEADER = $params->isYes($params->IS_UPDATE_HEADER);
	$ROUND = $params->getParamNumber($params->ROUND);
	$THEME = $params->getParamString($params->THEME);
	$START_DATE = $params->getParamString($params->START_DATE);

	if(	$IS_UPDATE_HEADER && $MEETING_ID > 0 ){

		if(!empty($START_DATE) && !empty($THEME) && ($ROUND > 0)) {

			$start_dttm = date("YmdHis", strtotime($START_DATE));
			$query_output = $wdj_mysql_interface->updateMeetingAgenda($MEETING_ID, $ROUND, $THEME, $start_dttm);
			array_push($result->query_output_arr,$query_output);

		} else if(!empty($START_DATE)) {

			$start_dttm = date("YmdHis", strtotime($START_DATE));
			$query_output = $wdj_mysql_interface->updateMeetingAgendaStartDttm($MEETING_ID, $start_dttm);
			array_push($result->query_output_arr,$query_output);

		} else if(!empty($THEME)) {

			$debug .= $THEME;

			$query_output = $wdj_mysql_interface->updateMeetingAgendaTheme($MEETING_ID, $THEME);
			array_push($result->query_output_arr,$query_output);

		} else if($ROUND > 0) {

			$query_output = $wdj_mysql_interface->updateMeetingAgendaRound($MEETING_ID, $ROUND);
			array_push($result->query_output_arr,$query_output);

		} 

	}









	//     dMMMMb  .aMMMb  dMP     dMMMMMP 
	//    dMP.dMP dMP"dMP dMP     dMP      
	//   dMMMMK" dMP dMP dMP     dMMMP     
	//  dMP"AMF dMP.aMP dMP     dMP        
	// dMP dMP  VMMMP" dMMMMMP dMMMMMP     

	// ROLE

	$IS_UPDATE_TODAY_ROLE = $params->isYes($params->IS_UPDATE_TODAY_ROLE);
	$ROLE_ID = $params->getParamNumber($params->ROLE_ID);
	$MEMBER_ID = $params->getParamNumber($params->MEMBER_ID);

	if( $IS_UPDATE_TODAY_ROLE && $MEETING_ID > 0 && $ROLE_ID > 0 && $MEMBER_ID > 0 ){
		$query_output = $wdj_mysql_interface->updateTodayRole($MEETING_ID, $ROLE_ID, $MEMBER_ID);
		array_push($result->query_output_arr,$query_output);
	}








	// LEGACY - REMOVE ME

	//  dMMMMMMP dMP dMMMMMMMMb  dMMMMMP dMP     dMP dMMMMb  dMMMMMP 
	//    dMP   amr dMP"dMP"dMP dMP     dMP     amr dMP dMP dMP      
	//   dMP   dMP dMP dMP dMP dMMMP   dMP     dMP dMP dMP dMMMP     
	//  dMP   dMP dMP dMP dMP dMP     dMP     dMP dMP dMP dMP        
	// dMP   dMP dMP dMP dMP dMMMMMP dMMMMMP dMP dMP dMP dMMMMMP                                                                   

	// TIMELINE

	$IS_UPDATE_SCHEDULE_TIMELINE_SET = $params->isYes($params->IS_UPDATE_SCHEDULE_TIMELINE_SET);
	$TIMELINE_JSON_STR_ENCODED = $params->getParamString($params->TIMELINE_JSON_STR_ENCODED);

	if($IS_UPDATE_SCHEDULE_TIMELINE_SET==$params->YES && ($MEETING_ID > 0)){
		$timeline_json_str = JSONManager::get_safe_json_str_on_mysql(urldecode($TIMELINE_JSON_STR_ENCODED));
		$query_output = $wdj_mysql_interface->modifyTimelineSchedule_V2($MEETING_ID, $timeline_json_str);
		array_push($result->query_output_arr,$query_output);
	}










	//     .aMMMb  .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb 
	//    dMP"dMP dMP"VMP   dMP   amr dMP"dMP dMP dMP 
	//   dMMMMMP dMP       dMP   dMP dMP dMP dMP dMP  
	//  dMP dMP dMP.aMP   dMP   dMP dMP.aMP dMP dMP   
	// dMP dMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP    

	$IS_INSERT_ACTION_TIMELINE = $params->isYes($params->IS_INSERT_ACTION_TIMELINE);
	$IS_UPDATE_ACTION_TIMELINE = $params->isYes($params->IS_UPDATE_ACTION_TIMELINE);
	$IS_DELETE_ACTION_TIMELINE = $params->isYes($params->IS_DELETE_ACTION_TIMELINE);
	$ACTION_TIMELINE_JSON_STR_ENCODED = $params->getParamString($params->ACTION_TIMELINE_JSON_STR_ENCODED);
	if($IS_INSERT_ACTION_TIMELINE==$params->YES){

		$result->IS_INSERT_ACTION_TIMELINE=$params->YES;

		$action_timeline_json_obj = JSONManager::get_json_obj($ACTION_TIMELINE_JSON_STR_ENCODED);

		// INSERT NEW ACTION

	} else if($IS_DELETE_ACTION_TIMELINE==$params->YES){

		$result->IS_INSERT_ACTION_TIMELINE=$params->YES;

		$action_timeline_json_obj = JSONManager::get_json_obj($ACTION_TIMELINE_JSON_STR_ENCODED);

		// DELETE ACTION

	} else if($IS_UPDATE_ACTION_TIMELINE==$params->YES){

		$result->IS_UPDATE_ACTION_TIMELINE=$params->YES;

		$action_timeline_json_obj = JSONManager::get_json_obj($ACTION_TIMELINE_JSON_STR_ENCODED);

		// 업데이트할 부분의 정보만 가져옵니다.
		$root_action_id = $action_timeline_json_obj->root_action_id;
		$action_name = $action_timeline_json_obj->action_name;
		$action_coordinate = $action_timeline_json_obj->action_coordinate;

		// root action
		$root_action_list = $wdj_mysql_interface->get_root_action_collection($root_action_id, $MEETING_ID);
		$target_action_obj = $root_action_list->search($action_coordinate);
		$result->UPDATE_ACTION_TIMELINE_ACTION_COORDINATE = "$action_coordinate";
		
		if(ActionItem::is_instance($target_action_obj)) {
			$action_context = $action_timeline_json_obj->action_context;
			if(is_null($action_context)) {
				$result->UPDATE_ACTION_TIMELINE_ERR = "is_null(\$action_context)";
			}
			$action_context_str = json_encode($action_context);
			if(empty($action_context_str)) {
				$result->UPDATE_ACTION_TIMELINE_ERR = "empty(\$action_context_str)";
			}
			if(!is_null($action_context) && !empty($action_context_str)) {
				$target_action_obj->set_context($action_context_str);
			} // end inner if

		} // end outer if
		 

		if(empty($action_name)) {
			$result->UPDATE_ACTION_TIMELINE_ERR = "empty(\$action_name)";
		} else if(ActionItem::is_not_instance($target_action_obj)) {
			$result->UPDATE_ACTION_TIMELINE_ERR = "ActionItem::is_not_instance(\$target_action_obj)";
		} else {
			$target_action_obj->set_name($action_name);
			$target_action_obj_std = $target_action_obj->get_std_obj();
			$result->target_action_obj_std = $target_action_obj_std;

			$updated_action_obj = $wdj_mysql_interface->copy_action_obj_v2($target_action_obj);
			$updated_root_action_obj = $updated_action_obj->get_root_action_obj();

			$updated_root_action_id = $updated_root_action_obj->get_id();
			$result->received_root_action_id = $root_action_id;
			$result->updated_root_action_id = intval($updated_root_action_id);

			$updated_root_action_list = $wdj_mysql_interface->get_root_action_collection($updated_root_action_id, $MEETING_ID);

			$updated_root_action_list_std = $updated_root_action_list->get_std_obj();
			$result->updated_action_std = $updated_root_action_list_std;

		} // end outer if
		
	} // end final if









	//    .dMMMb  dMMMMb  dMMMMMP dMMMMMP .aMMMb  dMP dMP 
	//   dMP" VP dMP.dMP dMP     dMP     dMP"VMP dMP dMP  
	//   VMMMb  dMMMMP" dMMMP   dMMMP   dMP     dMMMMMP   
	// dP .dMP dMP     dMP     dMP     dMP.aMP dMP dMP    
	// VMMMP" dMP     dMMMMMP dMMMMMP  VMMMP" dMP dMP     

	// SPEECH

	$IS_INSERT_SPEECH = $params->isYes($params->IS_INSERT_SPEECH);
	$IS_UPDATE_SPEECH = $params->isYes($params->IS_UPDATE_SPEECH);
	$IS_UPDATE_SPEECH_PROJECT = $params->isYes($params->IS_UPDATE_SPEECH_PROJECT);
	$IS_UPDATE_SPEECH_TITLE = $params->isYes($params->IS_UPDATE_SPEECH_TITLE);
	$IS_DELETE_SPEECH = $params->isYes($params->IS_DELETE_SPEECH);

	$IS_UPDATE_SPEECH_SPEAKER = $params->isYes($params->IS_UPDATE_SPEECH_SPEAKER);
	$IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER = $params->isYes($params->IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER);

	$IS_UPDATE_SPEECH_EVALUATOR = $params->isYes($params->IS_UPDATE_SPEECH_EVALUATOR);
	$IS_DELETE_SPEECH_EVALUATOR = $params->isYes($params->IS_DELETE_SPEECH_EVALUATOR);
	$IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_EVALUATOR = $params->isYes($params->IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_EVALUATOR);

	$SPEECH_ID = $params->getParamNumber($params->SPEECH_ID);
	$EVALUATOR_ID = $params->getParamNumber($params->EVALUATOR_ID);
	$ORDER_NUM = $params->getParamNumber($params->ORDER_NUM);
	$SPEECH_PROJECT_ID = $params->getParamNumber($params->SPEECH_PROJECT_ID);

	$SPEECH_TABLE_ROW_INFO_ARR_JSON_STR = $params->getParamString($params->SPEECH_TABLE_ROW_INFO_ARR_JSON_STR);

	$SPEECH_TITLE = $params->getParamString($params->SPEECH_TITLE);

	$SPEECH_SPEAKER_MEMBER_HASH_KEY = $params->getParamString($params->SPEECH_SPEAKER_MEMBER_HASH_KEY, "");
	if(!empty($SPEECH_SPEAKER_MEMBER_HASH_KEY)) {
		$SPEECH_SPEAKER_MEMBER_ID = $wdj_mysql_interface->getMemberId($SPEECH_SPEAKER_MEMBER_HASH_KEY);
	}
	$SPEECH_SPEAKER_TIMER_ID = $params->getParamNumber($params->SPEECH_SPEAKER_TIMER_ID, -1);
	$SPEECH_SPEAKER_TIMER = $params->getParamNumber($params->SPEECH_SPEAKER_TIMER);


	$SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR = $params->getParamString($params->SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR);

	$SPEECH_EVALUATOR_MEMBER_HASH_KEY = $params->getParamString($params->SPEECH_EVALUATOR_MEMBER_HASH_KEY, "");
	if(!empty($SPEECH_EVALUATOR_MEMBER_HASH_KEY)) {
		$SPEECH_EVALUATOR_MEMBER_ID = $wdj_mysql_interface->getMemberId($SPEECH_EVALUATOR_MEMBER_HASH_KEY);
	}

	$SPEECH_EVALUATOR_TIMER_ID = $params->getParamNumber($params->SPEECH_EVALUATOR_TIMER_ID);
	$SPEECH_EVALUATOR_TIMER = $params->getParamNumber($params->SPEECH_EVALUATOR_TIMER);

	if($IS_INSERT_SPEECH){

		$query_output = $wdj_mysql_interface->insert_speech_empty_speaker_n_evaluator($MEETING_ID);
		$result->insert_speech_empty_speaker_n_evaluator = $query_output;

	} else if($IS_UPDATE_SPEECH){

		if($SPEECH_PROJECT_ID > 0) {

			$query_output = 
			$wdj_mysql_interface->update_speech(
				// $SPEECH_ID
				$SPEECH_ID
				// $ORDER_NUM
				, null 				
				// SPEECH_PROJECT_ID
				, $SPEECH_PROJECT_ID
				// SPEECH_TITLE
				, null
			);

		} else if(!empty($SPEECH_TITLE)) {

			$query_output = 
			$wdj_mysql_interface->update_speech(
				// $SPEECH_ID
				$SPEECH_ID
				// $ORDER_NUM
				, null
				// SPEECH_PROJECT_ID 				
				, null
				// SPEECH_TITLE
				, $SPEECH_TITLE
			);

		}

		array_push($result->query_output_arr,$query_output);

	} else if($IS_UPDATE_SPEECH_PROJECT){

		if(0 < $SPEECH_ID && 0 < $SPEECH_PROJECT_ID) {

			$query_output = 
			$wdj_mysql_interface->update_speech(
				// $SPEECH_ID
				$SPEECH_ID
				// $ORDER_NUM
				, null 				
				// SPEECH_PROJECT_ID
				, $SPEECH_PROJECT_ID
				// SPEECH_TITLE
				, null
			);
			$result->update_speech=$query_output;

		} else {
			$result->update_speech="param is not valid!";
		}

	} else if($IS_UPDATE_SPEECH_TITLE){

		if(0 < $SPEECH_ID && !empty($SPEECH_TITLE)) {

			$query_output = 
			$wdj_mysql_interface->update_speech(
				// $SPEECH_ID
				$SPEECH_ID
				// $ORDER_NUM
				, null
				// SPEECH_PROJECT_ID 				
				, null
				// SPEECH_TITLE
				, $SPEECH_TITLE
			);
			array_push($result->query_output_arr,$query_output);
		} else {
			array_push($result->query_output_arr,"param is not valid!");
		}

	} else if($IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER){

		// 테이블의 열 순서가 변경됨.
		$debug .= "IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER";
		array_push($debug_stack_array,"IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER");

		$speech_table_row_info_arr=JSONManager::get_json_obj_from_JSONStringify($SPEECH_TABLE_ROW_INFO_ARR_JSON_STR);
		array_push($debug_stack_array,"SPEECH_TABLE_ROW_INFO_ARR_JSON_STR : $SPEECH_TABLE_ROW_INFO_ARR_JSON_STR");
		array_push($debug_stack_array,"count : " . count($speech_table_row_info_arr));

		for ($idx = 0; $idx < count($speech_table_row_info_arr); $idx++) {
			$cur_speech_table_row_info = $speech_table_row_info_arr[$idx];
			$cur_speech_id = intval($cur_speech_table_row_info->SPEECH_ID);
			$cur_order_num = intval($cur_speech_table_row_info->ORDER_NUM);
			
			array_push($debug_stack_array,"idx : $idx");
			array_push($debug_stack_array,"cur_speech_id : $cur_speech_id");
			array_push($debug_stack_array,"cur_order_num : $cur_order_num");

			if($cur_speech_id > 0 && $cur_order_num > -1) {
				$query_output = 
				$wdj_mysql_interface->update_speech(
					// $SPEECH_ID
					$cur_speech_id
					// $ORDER_NUM
					, $cur_order_num 				
				);
				array_push($result->query_output_arr,$query_output);
			}

		}

	} else if($IS_DELETE_SPEECH){

		$query_output = $wdj_mysql_interface->delete_speech($SPEECH_ID);
		$result->delete_speech = $query_output;

	} else if($IS_UPDATE_SPEECH_SPEAKER){

		$query_output = 
		$wdj_mysql_interface->upsert_speech_speaker(
			$SPEECH_ID
			, $SPEECH_SPEAKER_MEMBER_ID
		);
		$result->upsert_speech_speaker=$query_output;

	} else if( $IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_EVALUATOR && !empty($SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR)){

		// 테이블의 열 순서가 변경됨.
		$speech_evaluator_table_row_info_arr=JSONManager::get_json_obj($SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR);

		for ($idx = 0; $idx < count($speech_evaluator_table_row_info_arr); $idx++) {
			$cur_speech_evaluator_table_row_info = $speech_evaluator_table_row_info_arr[$idx];
			$cur_evaluation_id = intval($cur_speech_evaluator_table_row_info->__EVALUATOR_ID);
			$cur_order_num = intval($cur_speech_evaluator_table_row_info->__ORDER_NUM);

			// 입력된 파라미터만 업데이트됩니다.
			$query_output = 
			$wdj_mysql_interface->update_speech_evaluator(
				// $SPEECH_ID
				$cur_evaluation_id
				// $SPEECH_ID
				, null
				// $SPEECH_EVALUATOR_MEMBER_ID
				, null
				// $SPEECH_EVALUATOR_TIMER_GREEN
				, null
				// $SPEECH_EVALUATOR_TIMER_RED
				, null
				// $ORDER_NUM
				, $cur_order_num
			);
			array_push($result->query_output_arr,$query_output);
		}

	} else if(	$IS_UPDATE_SPEECH_EVALUATOR && 
				$SPEECH_ID > 0 && 
				$SPEECH_EVALUATOR_MEMBER_ID > 0	){

		// 스피치에는 1명의 이벨류에이터만 가능합니다.
		// 등록된 이벨류에이터 값을 가져옵니다.
		$recent_speech_evaluator_id = $wdj_mysql_interface->select_recent_speech_evaluator_id($SPEECH_ID);
		if(0 < $recent_speech_evaluator_id) {

			$query_output = 
			$wdj_mysql_interface->update_speech_evaluator(
				// $speech_evaluator_id
				$recent_speech_evaluator_id
				// $speech_id
				, null
				// $speech_evaluator_member_id
				, $SPEECH_EVALUATOR_MEMBER_ID
				// $order_num
				, null
			);
			$result->update_speech_evaluator=$query_output;
		}

	} else if($IS_DELETE_SPEECH_EVALUATOR==$params->YES && $EVALUATOR_ID > 0){

		$query_output = $wdj_mysql_interface->delete_speech_evaluator($EVALUATOR_ID);
		array_push($result->query_output_arr,$query_output);

	}











	//    dMP dMP dMP .aMMMb  dMMMMb  dMMMMb         dMMMMb        .aMMMb  dMP dMP .aMMMb dMMMMMMP dMMMMMP 
	//   dMP dMP dMP dMP"dMP dMP.dMP dMP VMP        dMP dMP       dMP"dMP dMP dMP dMP"dMP   dMP   dMP      
	//  dMP dMP dMP dMP dMP dMMMMK" dMP dMP        dMP dMP       dMP.dMP dMP dMP dMP dMP   dMP   dMMMP     
	// dMP.dMP.dMP dMP.aMP dMP"AMF dMP.aMP        dMP dMP       dMP.MMP dMP.aMP dMP.aMP   dMP   dMP        
	// VMMMPVMMP"  VMMMP" dMP dMP dMMMMP"        dMP dMP        VMMP"MP VMMMP"  VMMMP"   dMP   dMMMMMP     

	// WORD N QUOTE

	$IS_UPDATE_WORD_N_QUOTE_WORD_ONLY = $params->isYes($params->IS_UPDATE_WORD_N_QUOTE_WORD_ONLY);
	$IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY = $params->isYes($params->IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY);
	$IS_UPDATE_WORD_N_QUOTE_WORD_N_DESC = $params->isYes($params->IS_UPDATE_WORD_N_QUOTE_WORD_N_DESC);
	$IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY = $params->isYes($params->IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY);

	$word = $params->getParamString($params->WORD);
	$word_desc = $params->getParamString($params->WORD_DESC);
	$quote = $params->getParamString($params->QUOTE);

	if($IS_UPDATE_WORD_N_QUOTE_WORD_ONLY){

		$query_output = $wdj_mysql_interface->upsertWordOfTheDayWordOnly($MEETING_ID, $word);
		array_push($result->query_output_arr,$query_output);

	} else if($IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY){

		$query_output = $wdj_mysql_interface->upsertWordOfTheDayWordDescOnly($MEETING_ID, $word_desc);
		array_push($result->query_output_arr,$query_output);

	} else if($IS_UPDATE_WORD_N_QUOTE_WORD_N_DESC){

		$query_output = $wdj_mysql_interface->upsertWordOfTheDayWordOnly($MEETING_ID, $word);
		array_push($result->query_output_arr,$query_output);

		$query_output = $wdj_mysql_interface->upsertWordOfTheDayWordDescOnly($MEETING_ID, $word_desc);
		array_push($result->query_output_arr,$query_output);

	} else if($IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY){

		$query_output = $wdj_mysql_interface->upsertQuoteOfTheDay($MEETING_ID, $quote);
		array_push($result->query_output_arr,$query_output);

	}	










	//     dMMMMb  dMMMMMP dMP dMP dMP .dMMMb 
	//    dMP dMP dMP     dMP dMP dMP dMP" VP 
	//   dMP dMP dMMMP   dMP dMP dMP  VMMMb   
	//  dMP dMP dMP     dMP.dMP.dMP dP .dMP   
	// dMP dMP dMMMMMP  VMMMPVMMP"  VMMMP"    

	// NEWS

	$IS_INSERT_NEWS = $params->isYes($params->IS_INSERT_NEWS);
	$IS_UPDATE_NEWS = $params->isYes($params->IS_UPDATE_NEWS);
	$IS_DELETE_NEWS = $params->isYes($params->IS_DELETE_NEWS);
	$IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS = $params->isYes($params->IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS);
	
	$NEWS_ID = $params->getParamNumber($params->NEWS_ID);
	$NEWS_TITLE = $params->getParamString($params->NEWS_TITLE);
	$NEWS_CONTENTS = $params->getParamString($params->NEWS_CONTENTS);
	$NEWS_TABLE_ROW_INFO_ARR_JSON_STR = $params->getParamString($params->NEWS_TABLE_ROW_INFO_ARR_JSON_STR);

	if($IS_INSERT_NEWS){

		$debug .= "IS_INSERT_NEWS";

		if(!empty($NEWS_TITLE) && !empty($NEWS_CONTENTS)) {
			$query_output = $wdj_mysql_interface->insertNews_V2($MEETING_ID, $NEWS_TITLE, $NEWS_CONTENTS);
		} else if(!empty($NEWS_TITLE)) {
			$query_output = $wdj_mysql_interface->insertNews_V2($MEETING_ID, $NEWS_TITLE, "");
		} else if(!empty($NEWS_CONTENTS)) {
			$query_output = $wdj_mysql_interface->insertNews_V2($MEETING_ID, "", $NEWS_CONTENTS);
		} else {
			$query_output = $wdj_mysql_interface->insertNews_V2($MEETING_ID);	
		}

		array_push($result->query_output_arr,$query_output);

	} else if($IS_UPDATE_NEWS){

		$debug .= "IS_UPDATE_NEWS";
		$query_output =
		$wdj_mysql_interface->updateNewsByNewsId_V2(
			$MEETING_ID
			, $NEWS_ID
			, $NEWS_TITLE
			, $NEWS_CONTENTS
			// cur_order_num
		);

		array_push($result->query_output_arr,$query_output);

	} else if($IS_DELETE_NEWS && $NEWS_ID > 0){

		$debug .= "IS_DELETE_NEWS";
		$query_output = $wdj_mysql_interface->deleteNewsByNewsId($NEWS_ID);

		array_push($result->query_output_arr,$query_output);

	} else if($IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS){
		
		$debug .= "IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS";
		// 열의 순서를 변경합니다.
		// REFACTOR ME - 중복되고 있는 구조
		
		$news_table_row_info_arr=JSONManager::get_json_obj($NEWS_TABLE_ROW_INFO_ARR_JSON_STR);

		for ($idx = 0; $idx < count($news_table_row_info_arr); $idx++) {
			$cur_news_row_info = $news_table_row_info_arr[$idx];
			$cur_news_id = intval($cur_news_row_info->__news_id);
			$cur_order_num = intval($cur_news_row_info->__ORDER_NUM);

			$query_output = 
			$wdj_mysql_interface->updateNewsByNewsId_V2(
				$MEETING_ID
				, $cur_news_id
				, null // NEWS_TITLE
				, null // $NEWS_CONTENTS
				, $cur_order_num
			);

			array_push($result->query_output_arr,$query_output);
		}
	}	












	//     dMMMMMP dMP dMP dMMMMMP .aMMMb  dMP dMP dMMMMMMP dMP dMP dMP dMMMMMP         dMMMMMMMMb  dMMMMMP dMMMMMMMMb  dMMMMb  dMMMMMP dMMMMb  .dMMMb 
	//    dMP     dMK.dMP dMP     dMP"VMP dMP dMP    dMP   amr dMP dMP dMP             dMP"dMP"dMP dMP     dMP"dMP"dMP dMP"dMP dMP     dMP.dMP dMP" VP 
	//   dMMMP   .dMMMK" dMMMP   dMP     dMP dMP    dMP   dMP dMP dMP dMMMP           dMP dMP dMP dMMMP   dMP dMP dMP dMMMMK" dMMMP   dMMMMK"  VMMMb   
	//  dMP     dMP"AMF dMP     dMP.aMP dMP.aMP    dMP   dMP  YMvAP" dMP             dMP dMP dMP dMP     dMP dMP dMP dMP.aMF dMP     dMP"AMF dP .dMP   
	// dMMMMMP dMP dMP dMMMMMP  VMMMP"  VMMMP"    dMP   dMP    VP"  dMMMMMP         dMP dMP dMP dMMMMMP dMP dMP dMP dMMMMP" dMMMMMP dMP dMP  VMMMP"    

	// EXECUTIVE MEMBERS

	$IS_UPDATE_EXECUTIVE_MEMBER = $params->isYes($params->IS_UPDATE_EXECUTIVE_MEMBER);
	$EXECUTIVE_OFFICER_ID = $params->getParamNumber($params->EXECUTIVE_OFFICER_ID);
	$EXECUTIVE_MEMBER_ID = $params->getParamNumber($params->EXECUTIVE_MEMBER_ID);
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);

	if($IS_UPDATE_EXECUTIVE_MEMBER){
		$query_output = $wdj_mysql_interface->updateExecutiveMember($MEETING_MEMBERSHIP_ID, $EXECUTIVE_OFFICER_ID, $EXECUTIVE_MEMBER_ID);
		$debug .= "IS_UPDATE_EXECUTIVE_MEMBER";
		array_push($result->query_output_arr,$query_output);
	}



	// COPY MEETING
	$IS_NEW_MEETING_HEADER = $params->isYes($params->IS_NEW_MEETING_HEADER);
	$IS_UPDATE_MEETING_HEADER = $params->isYes($params->IS_UPDATE_MEETING_HEADER);
	$MEETING_TEMPLATE_ID = $params->getParamNumber($params->MEETING_TEMPLATE_ID);
	

	if($IS_NEW_MEETING_HEADER && $MEETING_TEMPLATE_ID > 0 && !empty($THEME) && !empty($START_DATE) && $MEETING_MEMBERSHIP_ID > 0) {

		array_push($debug_stack_array,"IS_NEW_MEETING_HEADER : $IS_NEW_MEETING_HEADER");
		array_push($debug_stack_array,"MEETING_TEMPLATE_ID : $MEETING_TEMPLATE_ID");
		array_push($debug_stack_array,"THEME : $THEME");
		array_push($debug_stack_array,"START_DATE : $START_DATE");
		array_push($debug_stack_array,"MEETING_MEMBERSHIP_ID : $MEETING_MEMBERSHIP_ID");

		// 현재 멤버쉽에 등록된 가장 마지막 클럽 정보를 가져옵니다.
		$all_meeting_agenda_list = $wdj_mysql_interface->getMeetingAgendaList(
			// $meeting_membership_id=1
			$MEETING_MEMBERSHIP_ID
			// $page=1
			// $size=50
		);

		// 클럽에 최초로 등록되는 미팅 아젠다일 경우의 처리.
		$new_round = 1;
		if(!empty($all_meeting_agenda_list)) {
			// 이미 등록된 미팅 아젠다가 있는 경우.
			$recent_meeting_agenda_obj = $all_meeting_agenda_list[0];
			$recent_meeting_agenda_obj_json_str = json_encode($recent_meeting_agenda_obj);
			array_push($debug_stack_array,$recent_meeting_agenda_obj_json_str);

			$new_round = strval(intval($recent_meeting_agenda_obj->__round)+1);
			array_push($debug_stack_array,"new_round : $new_round");
		}

		$new_start_datetime = new DateTime($START_DATE);
		$new_startdttm = $new_start_datetime->format("YmdHis");
		array_push($debug_stack_array,"new_startdttm : $new_startdttm");

		$query_output = $wdj_mysql_interface->insertMeetingAgenda($new_round, $THEME, $new_startdttm, $MEETING_MEMBERSHIP_ID);
		array_push($result->query_output_arr,$query_output);

		// 새로 만든 미팅 정보를 가져옵니다.
		$new_meeting_agenda_obj = $wdj_mysql_interface->getMeetingAgendaByRound($new_round, $new_startdttm, $MEETING_MEMBERSHIP_ID);
		$new_meeting_agenda_obj_json_str = json_encode($new_meeting_agenda_obj);
		array_push($result->query_output_arr,$new_meeting_agenda_obj_json_str);

		// 사용자가 지정한 meeting template을 timeline json str으로 저장합니다.
		$query_output = $wdj_mysql_interface->copyTimelineFromTemplate(
			// $new_meeting_agenda_id
			$new_meeting_agenda_obj[0]->__meeting_id
			// $meeting_template_id
			, $MEETING_TEMPLATE_ID
		);
		array_push($result->query_output_arr,$query_output);

	} else if($IS_UPDATE_MEETING_HEADER && $MEETING_ID > 0 && !empty($THEME) && !empty($START_DATE)) {

		$new_start_datetime = new DateTime($START_DATE);
		$new_startdttm = $new_start_datetime->format("YmdHis");

		// 있던 미팅 정보를 바꿉니다.
		$query_output = $wdj_mysql_interface->updateMeetingAgenda(
			// $meeting_id
			$MEETING_ID
			// $round
			, $ROUND
			// $theme
			, $THEME
			// $start_dttm
			, $new_startdttm
			// $meeting_membership_id
			, $MEETING_MEMBERSHIP_ID
		);
		array_push($result->query_output_arr,$query_output);
	}



	terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
?>

