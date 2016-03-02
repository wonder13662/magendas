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

	$ACTION_ID = $params->getParamNumber($params->ACTION_ID);
	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ACTION_ITEM_TYPE = $params->getParamNumber($params->ACTION_ITEM_TYPE);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	// DEBUG
	$result->ACTION_ID = $ACTION_ID;
	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->ACTION_ITEM_TYPE = $ACTION_ITEM_TYPE;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$ACTION_CONTEXT_OBJ = null;
	if(!empty($result->ACTION_CONTEXT)) {
		$ACTION_CONTEXT_OBJ = json_decode($result->ACTION_CONTEXT);

		if(!empty($ACTION_CONTEXT_OBJ->ACTION_DB_INSERT_MSG)) {
			$ACTION_DB_INSERT_MSG = $ACTION_CONTEXT_OBJ->ACTION_DB_INSERT_MSG;	
		} else {
			$ACTION_DB_INSERT_MSG = "";
		}
		$result->ACTION_DB_INSERT_MSG = $ACTION_DB_INSERT_MSG;

		if(!empty($ACTION_CONTEXT_OBJ->ACTION_DB_UPDATE_MSG)) {
			$ACTION_DB_UPDATE_MSG = $ACTION_CONTEXT_OBJ->ACTION_DB_UPDATE_MSG;	
		} else {
			$ACTION_DB_UPDATE_MSG = "";
		}
		$result->ACTION_DB_UPDATE_MSG = $ACTION_DB_UPDATE_MSG;

		if(!empty($ACTION_CONTEXT_OBJ->ACTION_DB_DELETE_MSG)) {
			$ACTION_DB_DELETE_MSG = $ACTION_CONTEXT_OBJ->ACTION_DB_DELETE_MSG;	
		} else {
			$ACTION_DB_DELETE_MSG = "";
		}
		$result->ACTION_DB_DELETE_MSG = $ACTION_DB_DELETE_MSG;

	}

	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_ITEM) == 0) {

		// COPY
		// 새로운 아이템 추가시에는 복제 대상의 정보가 필요합니다.

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {

		$is_valid_action_obj = (!empty($ACTION_HASH_KEY) && 0 < $ACTION_ITEM_TYPE);

		// 아이템의 내용을 변경합니다.
		if(!empty($ACTION_HASH_KEY) && 0 < $ACTION_ITEM_TYPE) {



		}

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_DELETE_ITEM) == 0) {

		// 아이템을 삭제합니다.

	}

	terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
?>

