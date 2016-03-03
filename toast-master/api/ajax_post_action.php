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
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);
	$ACTION_ITEM_TYPE = $params->getParamNumber($params->ACTION_ITEM_TYPE);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	// DEBUG
	// $result->ACTION_ID = $ACTION_ID;
	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;
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

		$is_valid_action_obj = (!empty($ACTION_HASH_KEY));
		$result->flag = "001";
		// 아이템의 내용을 변경합니다.
		if( (!empty($ROOT_ACTION_HASH_KEY)) && 
			(!empty($ACTION_HASH_KEY)) && 
			(0 < $ACTION_ITEM_TYPE)) {

			// root action을 같이 알려주어야 함.
			//get_root_action_collection

			// 해시키로 액션을 불러온다.
			// public function get_action_item_object($item_id, $order=0, $is_shy=0) {
			$root_action_collection_id = $wdj_mysql_interface->get_action_collection_id($ROOT_ACTION_HASH_KEY);
			$cur_action_item_id = $wdj_mysql_interface->get_action_item_id($ACTION_HASH_KEY);
			// DEBUG
			$result->root_action_collection_id = $root_action_collection_id;
			$result->cur_action_item_id = $cur_action_item_id;
			if( (!is_null($root_action_collection_id)) && 
				(!is_null($cur_action_item_id)) && 
				(0 < $root_action_collection_id) && 
				(0 < $cur_action_item_id) 	) {

				$result->flag = "002d";

				// $root_action_obj = $wdj_mysql_interface->get_action_item_object($root_action_collection_id);

				// $root_action_obj_std = $root_action_obj->get_std_obj();
				// $result->root_action_obj_std = $root_action_obj_std;

				// root action에서 업데이트하려는 action obj를 찾습니다.


				// UPDATE ACTION ITEM
				// $cur_action_item->set_name($ACTION_NAME);
				// $cur_action_item->set_context($ACTION_CONTEXT);

				// $updated_action_item = $wdj_mysql_interface->copy_action_item($cur_action_item);
				// $updated_root_action_obj = $updated_action_item->get_root_action_obj();
				// $updated_root_action_obj_std = $cur_root_action_obj->get_std_obj();
				// $result->updated_root_action_obj_std = $updated_root_action_obj_std;
			}

			if(strcmp($ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_TODAY_ROLE) == 0) {

				// 롤을 업데이트하는 경우.


				// $MEETING_ID;
				$ROLE_ID = $ACTION_CONTEXT_OBJ->ROLE_ID;
				$SELECTED_VALUE = $ACTION_CONTEXT_OBJ->SELECTED_VALUE;

				// DEBUG
				$result->ROLE_ID = $ROLE_ID;
				$result->SELECTED_VALUE = $SELECTED_VALUE;

				// 롤을 업데이트합니다.

				// 



				// wonder.jung11 - 해시 키가 필요한가? 내부적인 처리인데?
				/*
				$updated_action_item = $wdj_mysql_interface->copy_action_item($cur_action_item);

				$updated_root_action_obj = $updated_action_item->get_root_action_obj();
				$updated_root_action_obj_std = $cur_root_action_obj->get_std_obj();
				$result->updated_root_action_obj_std = $updated_root_action_obj_std;
				*/

				// $updated_root_action_list = $wdj_mysql_interface->get_root_action_collection($updated_root_action_id, $MEETING_ID);

				// $updated_root_action_list_std = $updated_root_action_list->get_std_obj();
				// $result->updated_action_std = $updated_root_action_list_std;


			}


			//"{"ACTION_DB_UPDATE_MSG":"IS_UPDATE_TODAY_ROLE","MEETING_ID":134,"ROLE_ID":7,"MEMBER_HASH_KEY":"","SELECTED_KEY":"Ace Youm","SELECTED_VALUE":"2ecd378863339ee3e8de65b8e4407e7f"}"

			// $cur_action_item = new ActionItem($action_name="New Item", $action_item_type=1, $is_shy=0, $has_changed=true)

		}

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_DELETE_ITEM) == 0) {

		// 아이템을 삭제합니다. 실제로 데이터를 지우지는 않습니다. 아이템이 없는 구조를 새롭게 만듭니다.

	}

	terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
?>

