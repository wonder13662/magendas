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

	$result->MEETING_ID = $MEETING_ID;

	// $ACTION_ID = $params->getParamNumber($params->ACTION_ID);
	$ACTION_NAME = $params->getParamString($params->ACTION_NAME);
	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ACTION_HASH_KEY_BEFORE = $params->getParamString($params->ACTION_HASH_KEY_BEFORE);
	$ACTION_HASH_KEY_AFTER = $params->getParamString($params->ACTION_HASH_KEY_AFTER);
	$PARENT_ACTION_HASH_KEY = $params->getParamString($params->PARENT_ACTION_HASH_KEY);
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);
	$ACTION_ITEM_TYPE = $params->getParamNumber($params->ACTION_ITEM_TYPE);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$ACTION_COORDINATE = $params->getParamString($params->ACTION_COORDINATE);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	// DEBUG
	// $result->ACTION_ID = $ACTION_ID;
	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->ACTION_HASH_KEY_BEFORE = $ACTION_HASH_KEY_BEFORE;
	$result->ACTION_HASH_KEY_AFTER = $ACTION_HASH_KEY_AFTER;
	$result->PARENT_ACTION_HASH_KEY = $PARENT_ACTION_HASH_KEY;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;
	$result->ACTION_ITEM_TYPE = $ACTION_ITEM_TYPE;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;
	$result->ACTION_COORDINATE = $ACTION_COORDINATE;
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
		// 새로운 아이템 추가
		$new_action_item_id = $wdj_mysql_interface->insert_action_item($ACTION_ITEM_TYPE, $ACTION_NAME, $ACTION_CONTEXT);

		$action_item_obj_before = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $meeting_id=-1
			, $MEETING_ID
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY_BEFORE
		);
		if(strcmp($action_item_obj_before->get_hash_key(), $ACTION_HASH_KEY_BEFORE) != 0) {
			echo "strcmp(\$action_item_obj_before->get_hash_key(), \$ACTION_HASH_KEY_BEFORE) != 0";
			return;
		}
		// DEBUG
		$result->action_item_id_before_debug = $action_item_obj_before->get_id();

		$is_shy = 0;
		$action_item_copy = $wdj_mysql_interface->copy_action_item_relation($action_item_obj_before, $is_shy, $ACTION_NAME, $ACTION_CONTEXT);
		if($wdj_mysql_interface->is_not_action_item(__FUNCTION__, $action_item_copy, "action_item_copy")) {
			return;
		}
		$result->action_item_copy = $action_item_copy->get_std_obj();

		// 업데이트된 root_action_list를 가져옵니다.
		$root_action_list = $wdj_mysql_interface->get_root_action_collection_by_hash_key($ROOT_ACTION_HASH_KEY, $MEETING_ID);
		if($wdj_mysql_interface->is_not_action_collection(__FUNCTION__, $root_action_list, "root_action_list")) {
			return;
		}
		$result->root_action_list_deleted = $root_action_list->get_std_obj();

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {

		$is_valid_action_obj = (!empty($ACTION_HASH_KEY));
		// 아이템의 내용을 변경합니다.
		if(!empty($ACTION_HASH_KEY)) {

			$cur_action_item_id = $wdj_mysql_interface->get_action_item_id($ACTION_HASH_KEY);
			// DEBUG
			$result->cur_action_item_id = $cur_action_item_id;

			// 선택된 액션의 내용만 업데이트합니다.
			$wdj_mysql_interface->update_action_item($cur_action_item_id, $ACTION_NAME, $ACTION_CONTEXT);

			// 선택된 액션의 순서가 변경되었다면 업데이트합니다.
			$wdj_mysql_interface->arrange_action_item_order(
				// $root_action_obj_hash_key=null
				$ROOT_ACTION_HASH_KEY
				// $parent_action_hash_key=null
				, $PARENT_ACTION_HASH_KEY
				// $action_item_hash_key_before=null
				, $ACTION_HASH_KEY_BEFORE
				// $action_item_hash_key=null
				, $ACTION_HASH_KEY
				// $action_item_hash_key_after=null
				, $ACTION_HASH_KEY_AFTER
			);

			if(strcmp($ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_TODAY_ROLE) == 0) {

				// 롤을 업데이트하는 경우.

				// $MEETING_ID;
				$ROLE_ID = $ACTION_CONTEXT_OBJ->ROLE_ID;
				$SELECTED_VALUE = $ACTION_CONTEXT_OBJ->SELECTED_VALUE;

				// DEBUG
				$result->ROLE_ID = $ROLE_ID;
				$result->SELECTED_VALUE = $SELECTED_VALUE;

				// wonder.jung11
				// 롤을 업데이트합니다.

				//

			}

		}

	} else if((strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_DELETE_ITEM) == 0) && !empty($ACTION_HASH_KEY)) {

		// 아이템을 삭제합니다. 실제로 데이터를 지웁니다.

		$action_item_obj_delete = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $meeting_id=-1
			, $MEETING_ID
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY
		);
		if($wdj_mysql_interface->is_not_action_item(__FUNCTION__, $action_item_obj_delete, "action_item_obj_delete")) {
			return;
		}

		// 실제 DB의 데이터도 제거.
		$wdj_mysql_interface->delete_action_item_relation($action_item_obj_delete);
		
		// 업데이트된 root_action_list를 가져옵니다.
		$root_action_list = $wdj_mysql_interface->get_root_action_collection_by_hash_key($ROOT_ACTION_HASH_KEY, $MEETING_ID);
		if($wdj_mysql_interface->is_not_action_collection(__FUNCTION__, $root_action_list, "root_action_list")) {
			return;
		}
		$result->root_action_list_deleted = $root_action_list->get_std_obj();

	}

	terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
?>

