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
	$MEETING_ID_SRC = $params->getParamNumber($params->MEETING_ID_SRC);

	$result->MEETING_ID = $MEETING_ID;
	$result->MEETING_ID_SRC = $MEETING_ID_SRC;

	$ACTION_NAME = $params->getParamString($params->ACTION_NAME);
	$ACTION_TEMPLATE_NAME = $params->getParamString($params->ACTION_TEMPLATE_NAME);
	$ACTION_BEGIN_HH_MM = $params->getParamString($params->ACTION_BEGIN_HH_MM, "19:30");

	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ACTION_HASH_KEY_BEFORE = $params->getParamString($params->ACTION_HASH_KEY_BEFORE);
	$ACTION_HASH_KEY_AFTER = $params->getParamString($params->ACTION_HASH_KEY_AFTER);
	$CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR = $params->getParamString($params->CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR);
	$PARENT_ACTION_HASH_KEY = $params->getParamString($params->PARENT_ACTION_HASH_KEY);
	$PARENT_ACTION_HASH_KEY_DELETE = $params->getParamString($params->PARENT_ACTION_HASH_KEY_DELETE);
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);
	$ACTION_ITEM_TYPE = $params->getParamNumber($params->ACTION_ITEM_TYPE);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$ACTION_COORDINATE = $params->getParamString($params->ACTION_COORDINATE);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	// DEBUG
	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_TEMPLATE_NAME = $ACTION_TEMPLATE_NAME;
	$result->ACTION_BEGIN_HH_MM = $ACTION_BEGIN_HH_MM;
	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR = $CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR;
	$result->ACTION_HASH_KEY_BEFORE = $ACTION_HASH_KEY_BEFORE;
	$result->ACTION_HASH_KEY_AFTER = $ACTION_HASH_KEY_AFTER;
	$result->PARENT_ACTION_HASH_KEY = $PARENT_ACTION_HASH_KEY;
	$result->PARENT_ACTION_HASH_KEY_DELETE = $PARENT_ACTION_HASH_KEY_DELETE;
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

	if( (strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_ITEM) == 0) && (!empty($ACTION_TEMPLATE_NAME))) {

		// TEMPLATE
		// 템플릿을 적용합니다.
		if(strcmp($ACTION_TEMPLATE_NAME, $params->ACTION_TEMPLATE_BUNDANG) == 0) {

			// 기본 템플릿 적용
			$action_obj_BDTM = $wdj_mysql_interface->get_template_meeting_timeline_BDTM($ACTION_BEGIN_HH_MM, $MEETING_ID, $ACTION_NAME);
			$root_action_obj = $wdj_mysql_interface->add_action($action_obj_BDTM);

			// DB에서 다시 정보를 가져옴.
			$recent_root_action_collection = $wdj_mysql_interface->get_root_action_collection($root_action_obj->get_id(), $MEETING_ID);

			$result->root_action_collection_updated = $root_action_obj->get_std_obj();

		} else if(strcmp($ACTION_TEMPLATE_NAME, $params->ACTION_TEMPLATE_PREV_MEETING) == 0) {

			// 직전 미팅 템플릿 적용
			// 1. 직전 미팅 템플릿 정보를 가져온다.
			$recent_action_id = $wdj_mysql_interface->select_recent_action_id_collection_by_meeting_id($MEETING_ID_SRC);
			// echo "\$recent_action_id ::: $recent_action_id<br/>";

			$recent_root_action_collection = null;
			if(0 < $recent_action_id) {
				$recent_root_action_collection = $wdj_mysql_interface->get_root_action_collection($recent_action_id, $MEETING_ID_SRC);	
			}
			$root_action_collection_copy = null;
			if(!is_null($recent_root_action_collection)) {
				$root_action_collection_copy = $wdj_mysql_interface->add_action($recent_root_action_collection);
			}
			if(!is_null($root_action_collection_copy) && ($root_action_collection_copy->get_id() != $recent_action_id)) {

				$root_action_collection_copy_id = $root_action_collection_copy->get_id();
				$result->root_action_collection_copy_id = $root_action_collection_copy_id;

				// 해당 액션을 다시 로딩.
				$root_action_collection_copy = $wdj_mysql_interface->get_root_action_collection($root_action_collection_copy_id, $MEETING_ID);
			}

			if(!is_null($root_action_collection_copy)) {
				$result->root_action_collection_updated = $root_action_collection_copy->get_std_obj();	
			}

		}		

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_ITEM) == 0) {

		// COPY
		// LIST일 경우에는 action item이 1개만 추가. TABLE일 경우에는 이전 열의 모든 action item이 복사되어 열이 추가되어야 함.
		$action_item_obj_before = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY_BEFORE
		);
		$result->action_item_id_before_debug = $action_item_obj_before->get_id();

		if($action_item_obj_before->is_table_field_item()) {

			// wonder.jung
			// 새로운 아이템 추가 - TABLE
			$cur_table_row_field_action_item_list_after = 
			$wdj_mysql_interface->add_row_into_table(
				// $table_field_action_item_obj=null
				$action_item_obj_before
				// $action_name=""
				, $params->NOT_ASSIGNED
				// $action_context=""
				, ""
			);

			$cur_table_row_field_action_item_list_after_std = array();
			for($idx = 0;$idx < count($cur_table_row_field_action_item_list_after); $idx++) {
				$cur_action_item_copy = $cur_table_row_field_action_item_list_after[$idx];
				$cur_action_item_copy_std = $cur_action_item_copy->get_std_obj();
				array_push($cur_table_row_field_action_item_list_after_std, $cur_action_item_copy_std);
			}

			$result->cur_table_row_field_action_item_list_after_std = $cur_table_row_field_action_item_list_after_std;

		} else {
			// 새로운 아이템 추가 - LIST	
			$action_item_copy = $wdj_mysql_interface->add_row_into_list($action_item_obj_before, $ACTION_NAME, $ACTION_CONTEXT);
			$result->action_item_copy = $action_item_copy->get_std_obj();
		}

		// DEBUG / 업데이트된 root_action_list를 가져옵니다.
		$root_action_collection_updated = $wdj_mysql_interface->get_action_collection_by_hash_key($ROOT_ACTION_HASH_KEY);
		if($wdj_mysql_interface->is_not_action_collection(__FUNCTION__, $root_action_collection_updated, "root_action_collection_updated")) {
			return;
		}
		$result->root_action_collection_updated = $root_action_collection_updated->get_std_obj();

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {

		// TODO shy --> not shy mode 변경에 대해서는 어떻게 처리?

		$is_valid_action_obj = (!empty($ACTION_HASH_KEY));
		// 아이템의 내용을 변경합니다.
		if(!empty($ACTION_HASH_KEY)) {

			$cur_action_item_id = $wdj_mysql_interface->get_action_item_id($ACTION_HASH_KEY);
			// DEBUG
			$result->cur_action_item_id = $cur_action_item_id;

			// 선택된 액션의 내용만 업데이트합니다.
			$wdj_mysql_interface->update_action_item($cur_action_item_id, $ACTION_NAME, $ACTION_CONTEXT);
			$wdj_mysql_interface->update_child_item_shy_mode_by_hash_key($PARENT_ACTION_HASH_KEY, $ACTION_HASH_KEY);

			// 선택된 액션의 순서가 변경되었다면 업데이트합니다.
			if(!empty($ACTION_HASH_KEY_BEFORE) || !empty($ACTION_HASH_KEY_AFTER)) {

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

			}

			$CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY = null;
			if(!empty($CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR)) {
				$CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY = json_decode($CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR);
				$result->CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY = $CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY;
			}
			if(is_array($CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY)) {
				for($idx=0;$idx < count($CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY); $idx++) {
					$CHILD_ADD_ON_ACTION_HASH_KEY = $CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY[$idx];

					// 이전에 등록된 내역을 먼저 연결 삭제
					$wdj_mysql_interface->delete_parent_action_item_n_add_on_collection_by_hash_key($CHILD_ADD_ON_ACTION_HASH_KEY);

					// 액션 아이템과 add on 자식 액션 아이템을 연결
					$wdj_mysql_interface->insert_parent_action_item_n_add_on_collection_by_hash_key($ACTION_HASH_KEY, $CHILD_ADD_ON_ACTION_HASH_KEY);

				}
			}

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
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY
		);
		if($wdj_mysql_interface->is_not_action_item(__FUNCTION__, $action_item_obj_delete, "action_item_obj_delete")) {
			return;
		}


		if($action_item_obj_delete->is_table_field_item()) {
			// 실제 DB의 데이터도 제거 - TABLE
			$cur_table_row_field_action_item_list_delete = $action_item_obj_delete->get_table_row_field_action_item_list();

			for($idx = 0;$idx < count($cur_table_row_field_action_item_list_delete); $idx++) {
				$cur_action_item_delete = $cur_table_row_field_action_item_list_delete[$idx];
				$wdj_mysql_interface->delete_action_item_relation($cur_action_item_delete);
			}

			$result->cur_table_row_field_action_item_list_after_std = $cur_table_row_field_action_item_list_after_std;

		} else {
			// 실제 DB의 데이터도 제거 - LIST	
			$wdj_mysql_interface->delete_action_item_relation($action_item_obj_delete);

		}

		
		// 업데이트된 root_action_list를 가져옵니다.
		$root_action_list = $wdj_mysql_interface->get_root_action_collection_by_hash_key($ROOT_ACTION_HASH_KEY, $MEETING_ID);
		if($wdj_mysql_interface->is_not_action_collection(__FUNCTION__, $root_action_list, "root_action_list")) {
			return;
		}
		$result->root_action_list_deleted = $root_action_list->get_std_obj();

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_TABLE_ROW_ORDER) == 0) {

		// 테이블의 열 순서를 바꿉니다.
		$table_field_action_item_obj_update = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY
		);
		if($wdj_mysql_interface->is_not_action_item(__FUNCTION__, $table_field_action_item_obj_update, "table_field_action_item_obj_update")) {
			return;
		}
		$action_item_order = -1;

		$table_field_action_item_obj_update_before = null;
		if(!empty($ACTION_HASH_KEY_BEFORE)) {
			$table_field_action_item_obj_update_before = 
			$wdj_mysql_interface->get_action_item_obj_with_relation(
				// $root_action_hash_key=""
				$ROOT_ACTION_HASH_KEY
				// $action_item_hash_key=""
				, $ACTION_HASH_KEY_BEFORE
			);
		}
		if($wdj_mysql_interface->is_action_item(__FUNCTION__, $table_field_action_item_obj_update_before)) {
			$action_item_order = $table_field_action_item_obj_update_before->get_order() + 50;
		}

		$table_field_action_item_obj_update_after = null;
		if(!empty($ACTION_HASH_KEY_AFTER)) {
			$table_field_action_item_obj_update_after = 
			$wdj_mysql_interface->get_action_item_obj_with_relation(
				// $root_action_hash_key=""
				$ROOT_ACTION_HASH_KEY
				// $action_item_hash_key=""
				, $ACTION_HASH_KEY_AFTER
			);
		}
		if($wdj_mysql_interface->is_action_item(__FUNCTION__, $table_field_action_item_obj_update_after)){
			$action_item_order = $table_field_action_item_obj_update_after->get_order() - 50;
		}
		$result->table_row_action_item_order = $action_item_order;

		if($table_field_action_item_obj_update->is_table_field_item()) {
			// 실제 DB의 데이터도 제거 - TABLE
			$cur_table_row_field_action_item_list_update = $table_field_action_item_obj_update->get_table_row_field_action_item_list();
			$cur_table_row_field_action_hash_key_list_update = array();
			for($idx = 0;$idx < count($cur_table_row_field_action_item_list_update); $idx++) {
				$cur_action_item_update = $cur_table_row_field_action_item_list_update[$idx];
				if($wdj_mysql_interface->is_not_action_item(__FUNCTION__, $cur_action_item_update, "cur_action_item_update")) {
					return;
				}
				$action_hash_key = $cur_action_item_update->get_hash_key();
				if($wdj_mysql_interface->is_empty(__FUNCTION__, $action_hash_key, "action_hash_key")) {
					return;
				}

				$parent_action_hash_key = "";
				if($cur_action_item_update->has_parent()) {
					$cur_parent_action_obj = $cur_action_item_update->get_parent();
					$parent_action_hash_key = $cur_parent_action_obj->get_hash_key();
				}

				// 선택된 액션의 순서가 변경되었다면 업데이트합니다.
				$wdj_mysql_interface->arrange_action_item_order_by_new_order(
					// $root_action_obj_hash_key=null
					$ROOT_ACTION_HASH_KEY
					// $parent_action_hash_key=null
					, $parent_action_hash_key
					// $action_item_hash_key=null
					, $action_hash_key
					// $action_item_order=-1
					, $action_item_order
				);

				array_push($cur_table_row_field_action_hash_key_list_update, $cur_action_item_update->get_hash_key());
			}

			$result->cur_table_row_field_action_hash_key_list_update = $cur_table_row_field_action_hash_key_list_update;

		}		


	}

	terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
?>

