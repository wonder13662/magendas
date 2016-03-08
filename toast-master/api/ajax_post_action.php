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

		// DEBUG
		$action_item_id_before = -1;
		if(!empty($ACTION_HASH_KEY_BEFORE)) {
			$action_item_id_before = $wdj_mysql_interface->get_action_item_id($ACTION_HASH_KEY_BEFORE);	
		}
		$result->action_item_id_before = $action_item_id_before;

		$action_item_id_after = -1;
		if(!empty($ACTION_HASH_KEY_BEFORE)) {
			$action_item_id_after = $wdj_mysql_interface->get_action_item_id($ACTION_HASH_KEY_AFTER);	
		}
		$result->action_item_id_after = $action_item_id_after;

		$parent_action_list_id = -1;
		if(!empty($PARENT_ACTION_HASH_KEY)) {
			$parent_action_list_id = $wdj_mysql_interface->get_action_collection_id($PARENT_ACTION_HASH_KEY);	
		}
		// DEBUG
		$result->parent_action_list_id = $parent_action_list_id;
		if(0 < $parent_action_list_id) {
			$wdj_mysql_interface->insert_parent_list_n_child_item($parent_action_list_id, $new_action_item_id);
		}
		// 자식 객체 복제 작업도 필요!

		// wonder.jung11
		// 특정 객체를 복사, 자식 객체들은 모두 shy 처리되는 플래그값을 넘겨준다면?

		// 부모가 가진 자식 객체들의 순서 정렬 이슈.
		// 넣으려는 객체 사이에 추가 뒤에 재정렬.

		// $this->reorder_child_item_in_parent_list($parent_action_list_id);



		

		//public function insert_parent_list_n_child_item($parent_action_list_id=-1, $child_action_item_id=-1, $order=-1, $is_shy_child=-1) {
		// $this->insert_parent_list_n_child_item();

		

		// DEBUG
		$result->new_action_item_id = $new_action_item_id;

		// 완성된 객체 가져오기.
		// public function get_action_item_object($item_id, $order=0, $is_shy=0) {


	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {

		$is_valid_action_obj = (!empty($ACTION_HASH_KEY));
		// 아이템의 내용을 변경합니다.
		if(!empty($ACTION_HASH_KEY)) {

			$cur_action_item_id = $wdj_mysql_interface->get_action_item_id($ACTION_HASH_KEY);
			// DEBUG
			$result->cur_action_item_id = $cur_action_item_id;

			// 선택된 액션의 내용만 업데이트합니다.
			// update_action_item($action_item_id=-1, $action_name="", $action_item_context="")
			$wdj_mysql_interface->update_action_item($cur_action_item_id, $ACTION_NAME, $ACTION_CONTEXT);


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

			}

		}

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_DELETE_ITEM) == 0) {

		// 아이템을 삭제합니다. 실제로 데이터를 지우지는 않습니다. 아이템이 없는 구조를 새롭게 만듭니다.

	}

	terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
?>

