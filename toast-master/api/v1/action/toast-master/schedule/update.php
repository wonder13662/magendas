<?php

	// /api/v1/action/toast-master/schedule/update.php

	// common setting
	include_once("../../../../../common.inc");
	include_once("../../../../../db/toast-master/mysql.interface.toast-master.inc");

	$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
	$result = new stdClass();

	function terminate($wdj_mysql_interface, $result) {
		// CLOSE DB
		$wdj_mysql_interface->close();
		echo json_encode($result);
		return;
	}








	// GET PARAMS

	//    .dMMMb  .aMMMb  dMMMMMP dMP dMP dMMMMb  dMP dMP dMP     dMMMMMP 
	//   dMP" VP dMP"VMP dMP     dMP dMP dMP VMP dMP dMP dMP     dMP      
	//   VMMMb  dMP     dMMMP   dMMMMMP dMP dMP dMP dMP dMP     dMMMP     
	// dP .dMP dMP.aMP dMP     dMP dMP dMP.aMP dMP.aMP dMP     dMP        
	// VMMMP"  VMMMP" dMMMMMP dMP dMP dMMMMP"  VMMMP" dMMMMMP dMMMMMP     
                                                                   
	// MEETING AGENDA COMMON
	$MEETING_ID = $params->getParamNumber($params->MEETING_ID);
	$MEETING_ID_SRC = $params->getParamNumber($params->MEETING_ID_SRC);

	$ACTION_NAME = $params->getParamString($params->ACTION_NAME);
	// $ACTION_TEMPLATE_NAME = $params->getParamString($params->ACTION_TEMPLATE_NAME);
	// $ACTION_BEGIN_HH_MM = $params->getParamString($params->ACTION_BEGIN_HH_MM, "19:30");

	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ACTION_HASH_KEY_BEFORE = $params->getParamString($params->ACTION_HASH_KEY_BEFORE);
	$ACTION_HASH_KEY_AFTER = $params->getParamString($params->ACTION_HASH_KEY_AFTER);
	$CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR = $params->getParamString($params->CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR);
	$PARENT_ACTION_HASH_KEY = $params->getParamString($params->PARENT_ACTION_HASH_KEY);
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	// DEBUG
	$result->MEETING_ID = $MEETING_ID;
	$result->MEETING_ID_SRC = $MEETING_ID_SRC;

	$result->ACTION_NAME = $ACTION_NAME;
	// $result->ACTION_TEMPLATE_NAME = $ACTION_TEMPLATE_NAME;
	// $result->ACTION_BEGIN_HH_MM = $ACTION_BEGIN_HH_MM;

	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR = $CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR;
	$result->ACTION_HASH_KEY_BEFORE = $ACTION_HASH_KEY_BEFORE;
	$result->ACTION_HASH_KEY_AFTER = $ACTION_HASH_KEY_AFTER;
	$result->PARENT_ACTION_HASH_KEY = $PARENT_ACTION_HASH_KEY;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;










	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID_SRC)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if(empty($EVENT_PARAM_EVENT_TYPE)) {
		$result->error = "empty(\$EVENT_PARAM_EVENT_TYPE)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END









	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_ITEM) == 0) {







		// CHECK VALIDATION - INIT
		if(empty($ROOT_ACTION_HASH_KEY)) {
			$result->error = "empty(\$ROOT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_HASH_KEY_BEFORE)) {
			$result->error = "empty(\$ACTION_HASH_KEY_BEFORE)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_NAME)) {
			$result->error = "empty(\$ACTION_NAME)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END







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

			$TABLE_FIELD_ACTION_ITEM_LIST_STD = array();
			for($idx = 0;$idx < count($cur_table_row_field_action_item_list_after); $idx++) {
				$cur_action_item_copy = $cur_table_row_field_action_item_list_after[$idx];

				$wdj_mysql_interface->update_action_item(
					$cur_action_item_copy->get_id()
					, $cur_action_item_copy->get_name()
					, $cur_action_item_copy->get_context()
				);

				$cur_action_item_copy_std = $cur_action_item_copy->get_std_obj();
				array_push($TABLE_FIELD_ACTION_ITEM_LIST_STD, $cur_action_item_copy_std);
			}
			$result->TABLE_FIELD_ACTION_ITEM_LIST_STD = $TABLE_FIELD_ACTION_ITEM_LIST_STD;

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








		// CHECK VALIDATION - INIT
		if(empty($ACTION_HASH_KEY)) {
			$result->error = "empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END








		// TODO shy --> not shy mode 변경에 대해서는 어떻게 처리?
		// 아이템의 내용을 변경합니다.
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

			} // end for
		} // end inner if

	} else if((strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_DELETE_ITEM) == 0) && !empty($ACTION_HASH_KEY)) {









		// CHECK VALIDATION - INIT
		if(empty($ROOT_ACTION_HASH_KEY)) {
			$result->error = "empty(\$ROOT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_HASH_KEY)) {
			$result->error = "empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END










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

			$result->TABLE_FIELD_ACTION_ITEM_LIST_STD = $TABLE_FIELD_ACTION_ITEM_LIST_STD;

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










		// CHECK VALIDATION - INIT
		if(empty($ROOT_ACTION_HASH_KEY)) {
			$result->error = "empty(\$ROOT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_HASH_KEY)) {
			$result->error = "empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END











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

	// FIN
	terminate($wdj_mysql_interface, $result);

?>

