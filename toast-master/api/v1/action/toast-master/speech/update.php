<?php

	// /api/v1/action/toast-master/speech/update.php

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

	function is_speech_action_item($action_item_obj = null, $params=null) {

		if(is_null($params)) {
			return false;
		}

		if(is_null($action_item_obj)) {
			return false;
		}

		if(ActionItem::is_not_instance($action_item_obj)) {
			return false;
		}

		if(	$action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_TITLE) ||
			$action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_PROJECT) || 
			$action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_SPEAKER) || 
			$action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_EVALUATOR)) {

			return true;
		}

		return false;
	}









	// GET PARAMS - SPEECH

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
	$ACTION_BEGIN_HH_MM = $params->getParamString($params->ACTION_BEGIN_HH_MM, "19:30");

	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ACTION_HASH_KEY_BEFORE = $params->getParamString($params->ACTION_HASH_KEY_BEFORE);
	$ACTION_HASH_KEY_AFTER = $params->getParamString($params->ACTION_HASH_KEY_AFTER);
	$PARENT_ACTION_HASH_KEY = $params->getParamString($params->PARENT_ACTION_HASH_KEY);
	$PARENT_ACTION_HASH_KEY_DELETE = $params->getParamString($params->PARENT_ACTION_HASH_KEY_DELETE);
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);
	$ACTION_ITEM_TYPE = $params->getParamNumber($params->ACTION_ITEM_TYPE);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	// DEBUG
	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_BEGIN_HH_MM = $ACTION_BEGIN_HH_MM;
	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->ACTION_HASH_KEY_BEFORE = $ACTION_HASH_KEY_BEFORE;
	$result->ACTION_HASH_KEY_AFTER = $ACTION_HASH_KEY_AFTER;
	$result->PARENT_ACTION_HASH_KEY = $PARENT_ACTION_HASH_KEY;
	$result->PARENT_ACTION_HASH_KEY_DELETE = $PARENT_ACTION_HASH_KEY_DELETE;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;
	$result->ACTION_ITEM_TYPE = $ACTION_ITEM_TYPE;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$ACTION_CONTEXT_OBJ = json_decode($result->ACTION_CONTEXT);

	$SPEECH_ID = intval($ACTION_CONTEXT_OBJ->SPEECH_ID);
	$SELECTED_KEY = $ACTION_CONTEXT_OBJ->SELECTED_KEY;
	$SELECTED_VALUE = $ACTION_CONTEXT_OBJ->SELECTED_VALUE;

	$result->SPEECH_ID = $SPEECH_ID;
	$result->SELECTED_KEY = $SELECTED_KEY;
	$result->SELECTED_VALUE = $SELECTED_VALUE;












	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if(is_null($ACTION_CONTEXT_OBJ)) {
		$result->error = "is_null(\$ACTION_CONTEXT_OBJ)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if(is_null($ACTION_CONTEXT_OBJ)){
		$result->error = "is_null(\$ACTION_CONTEXT_OBJ)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $SPEECH_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$SPEECH_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END












	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_ITEM) == 0) {







		// CHECK VALIDATION - INIT
		if(empty($ROOT_ACTION_HASH_KEY)) {
			$result->error = "EVENT_TYPE_INSERT_ITEM / empty(\$ROOT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_HASH_KEY_BEFORE)) {
			$result->error = "EVENT_TYPE_INSERT_ITEM / empty(\$ACTION_HASH_KEY_BEFORE)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END








		// COPY
		// TABLE일 경우에는 이전 열의 모든 action item이 복사되어 열이 추가되어야 함.
		$action_item_obj_before = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY_BEFORE
		);
		$result->action_item_id_before_debug = $action_item_obj_before->get_id();
		if(!$action_item_obj_before->is_table_field_item()) {
			$result->error = "EVENT_TYPE_INSERT_ITEM / !\$action_item_obj_before->is_table_field_item()";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$is_speech_action_item = is_speech_action_item($action_item_obj_before, $params);
		$result->is_speech_action_item = $is_speech_action_item;
		$result->speech_action_context = $action_item_obj_before->get_context();
		if(!$is_speech_action_item) {
			$result->error = "EVENT_TYPE_INSERT_ITEM / !\$is_speech_action_item";
			terminate($wdj_mysql_interface, $result);
			return;
		}





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

		// SPEECH UPDATE
		// SPEECH TABLE일 경우의 DB 업데이트
		$__speech_id = -1;
		$__meeting_id = -1;
		$__speech_project_id = -1;
		$new_speech_obj = null;

		// public function get_context_attr($key="") {
		$speech_id_before = $action_item_obj_before->get_context_attr($params->SPEECH_ID);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $speech_id_before)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$speech_id_before)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$speech_obj_before = $wdj_mysql_interface->sel_speech($speech_id_before);
		if(is_null($speech_obj_before)){
			$result->error = "is_null(\$speech_obj_before)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$__order_num = intval($speech_obj_before->__order_num);

		$new_order_num = $__order_num + 50;
		$result->prev_order_num = $__order_num;
		$result->new_order_num = $new_order_num;

		// 새로운 SPEECH 열을 추가합니다.
		// 몇번째 순서인지 넣을수 있도록!
		$wdj_mysql_interface->insert_speech_empty_speaker_n_evaluator($MEETING_ID, $new_order_num);
		$NEW_SPEECH_ID = $wdj_mysql_interface->get_last_speech_id($MEETING_ID);

		$target_speech_before_id = $speech_id_before;
		$target_speech_id = $NEW_SPEECH_ID;
		$target_speech_after_id = -1;
		$wdj_mysql_interface->update_speech_sibling_relation($target_speech_before_id, $target_speech_id, $target_speech_after_id);

		$result->target_speech_before_id = $target_speech_before_id;
		$result->target_speech_id = $target_speech_id;
		$result->target_speech_after_id = $target_speech_after_id;

		$new_speech_obj = $wdj_mysql_interface->sel_speech($NEW_SPEECH_ID);
		$__speech_id = $new_speech_obj->__speech_id;
		$__meeting_id = $new_speech_obj->__meeting_id;
		$__speech_project_id = $new_speech_obj->__speech_project_id;


		// DEBUG
		$TABLE_FIELD_ACTION_ITEM_LIST_STD = array();
		for($idx = 0;$idx < count($cur_table_row_field_action_item_list_after); $idx++) {
			$cur_action_item_copy = $cur_table_row_field_action_item_list_after[$idx];
			
			// UPDATE CONTEXT
			$cur_action_item_copy->set_context_attr($params->MEETING_ID, $__meeting_id, $result);
			$cur_action_item_copy->set_context_attr($params->SPEECH_ID, $__speech_id);
			$cur_action_item_copy->set_context_attr($params->SPEECH_PROJECT_ID, $__speech_project_id);

			if(	$cur_action_item_copy->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_TITLE) ){

				$__title = $new_speech_obj->__title;
				if(!empty($__title)) {
					$cur_action_item_copy->set_name($__title);
				}

			} else if(	$cur_action_item_copy->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_PROJECT) ){

				$__speech_project_title = $new_speech_obj->__speech_project_title;
				if(!empty($__speech_project_title)) {
					$cur_action_item_copy->set_name($__speech_project_title);
				}

			} else if(	$cur_action_item_copy->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_SPEAKER) ){

				$__speaker_member_name = $new_speech_obj->__speaker_member_name;
				if(!empty($__speaker_member_name)) {
					$cur_action_item_copy->set_name($__speaker_member_name);
				}

			} else if(	$cur_action_item_copy->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_EVALUATOR) ){

				$__evaluator_member_name = $new_speech_obj->__evaluator_member_name;
				if(!empty($__evaluator_member_name)) {
					$cur_action_item_copy->set_name($__evaluator_member_name);
				}

			} // end if

			$wdj_mysql_interface->update_action_item(
				$cur_action_item_copy->get_id()
				, $cur_action_item_copy->get_name()
				, $cur_action_item_copy->get_context()
			);

			$cur_action_item_copy_std = $cur_action_item_copy->get_std_obj();
			array_push($TABLE_FIELD_ACTION_ITEM_LIST_STD, $cur_action_item_copy_std);
		}
		$result->TABLE_FIELD_ACTION_ITEM_LIST_STD = $TABLE_FIELD_ACTION_ITEM_LIST_STD;



		// DEBUG / 업데이트된 root_action_list를 가져옵니다.
		$root_action_collection_updated = $wdj_mysql_interface->get_action_collection_by_hash_key($ROOT_ACTION_HASH_KEY);
		if($wdj_mysql_interface->is_not_action_collection(__FUNCTION__, $root_action_collection_updated, "root_action_collection_updated")) {
			return;
		}
		$result->root_action_collection_updated = $root_action_collection_updated->get_std_obj();

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {











		// wonder.jung
		// CHECK VALIDATION - INIT
		if(empty($ACTION_HASH_KEY)) {
			$result->error = "EVENT_TYPE_UPDATE_ITEM / empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_NAME)) {
			$result->error = "EVENT_TYPE_UPDATE_ITEM / empty(\$ACTION_NAME)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_CONTEXT)) {
			$result->error = "EVENT_TYPE_UPDATE_ITEM / empty(\$ACTION_CONTEXT)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($PARENT_ACTION_HASH_KEY)) {
			$result->error = "EVENT_TYPE_UPDATE_ITEM / empty(\$PARENT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$cur_action_item_id = $wdj_mysql_interface->get_action_item_id($ACTION_HASH_KEY);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $cur_action_item_id)){
			$result->error = "EVENT_TYPE_UPDATE_ITEM / \$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$cur_action_item_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$cur_action_item_obj = 
		$wdj_mysql_interface->get_action_item_object(
			// $item_id
			$cur_action_item_id
		);
		if(ActionItem::is_not_instance($cur_action_item_obj)) {
			$result->error = "EVENT_TYPE_UPDATE_ITEM / ActionItem::is_not_instance(\$cur_action_item_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END

		// DEBUG
		$result->cur_action_item_id = $cur_action_item_id;










		// 아이템의 내용을 변경합니다.

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

		$IS_UPDATE_SPEECH_TITLE = 
		$cur_action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_TITLE);
		$IS_UPDATE_SPEECH_PROJECT = 
		$cur_action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_PROJECT);
		$IS_UPDATE_SPEECH_SPEAKER = 
		$cur_action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_SPEAKER);
		$IS_UPDATE_SPEECH_EVALUATOR = 
		$cur_action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_SPEECH_EVALUATOR);

		$result->IS_UPDATE_SPEECH_TITLE = $IS_UPDATE_SPEECH_TITLE;
		$result->IS_UPDATE_SPEECH_PROJECT = $IS_UPDATE_SPEECH_PROJECT;
		$result->IS_UPDATE_SPEECH_SPEAKER = $IS_UPDATE_SPEECH_SPEAKER;
		$result->IS_UPDATE_SPEECH_EVALUATOR = $IS_UPDATE_SPEECH_EVALUATOR;

		if($IS_UPDATE_SPEECH_TITLE) {

			$SPEECH_TITLE = $ACTION_NAME;

			$result->SPEECH_TITLE = $SPEECH_TITLE;
			$ACTION_CONTEXT_OBJ->SPEECH_TITLE = $SPEECH_TITLE;

			// speech title을 업데이트 하는 경우.
			$wdj_mysql_interface->update_speech_title($SPEECH_ID, $ACTION_NAME);
			$new_action_name = $ACTION_NAME;

			$ACTION_CONTEXT_OBJ->SPEECH_TITLE = $ACTION_NAME;

		} else if($IS_UPDATE_SPEECH_PROJECT) {







			if(empty($SELECTED_VALUE)) {
				$result->error = "EVENT_TYPE_UPDATE_ITEM / \$wdj_mysql_interface->is_empty(__FUNCTION__, \$SELECTED_VALUE)";
				terminate($wdj_mysql_interface, $result);
				return;
			}







			$SPEECH_PROJECT_ID = intval($ACTION_CONTEXT_OBJ->SPEECH_PROJECT_ID);

			$result->SPEECH_PROJECT_ID = $SPEECH_PROJECT_ID;
			$ACTION_CONTEXT_OBJ->SPEECH_PROJECT_ID = $SPEECH_PROJECT_ID;

			// speech project를 업데이트 하는 경우.
			$SPEECH_PROJECT_ID = intval($SELECTED_VALUE);

			$ACTION_CONTEXT_OBJ->SPEECH_PROJECT_ID = $SPEECH_PROJECT_ID;
			$result->SPEECH_PROJECT_ID = $SPEECH_PROJECT_ID;
			$wdj_mysql_interface->update_speech_project($SPEECH_ID, $SPEECH_PROJECT_ID);

			$speech_project_obj = $wdj_mysql_interface->get_speech_project($SPEECH_PROJECT_ID);

			$new_action_name = null;
			if(!is_null($speech_project_obj)) {
				$new_action_name = $speech_project_obj->__speech_project_title;	
			}
			$result->new_action_name = $new_action_name;

		} else if($IS_UPDATE_SPEECH_SPEAKER) {







			if(empty($SELECTED_VALUE)) {
				$result->error = "EVENT_TYPE_UPDATE_ITEM / \$wdj_mysql_interface->is_empty(__FUNCTION__, \$SELECTED_VALUE)";
				terminate($wdj_mysql_interface, $result);
				return;
			}









			$SPEECH_SPEAKER_MEMBER_HASH_KEY = $SELECTED_VALUE;
			$result->SPEECH_SPEAKER_MEMBER_HASH_KEY = $SPEECH_SPEAKER_MEMBER_HASH_KEY;
			$ACTION_CONTEXT_OBJ->SPEECH_SPEAKER_MEMBER_HASH_KEY = $SPEECH_SPEAKER_MEMBER_HASH_KEY;

			// speaker 정보를 업데이트 하는 경우.
			// MEMBER_HASH_KEY --> MEMBER_KEY
			$speech_speaker_member_id = $wdj_mysql_interface->get_member_id_by_hash_key($SELECTED_VALUE);
			if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $speech_speaker_member_id)){
				$result->error = "EVENT_TYPE_UPDATE_ITEM / \$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$speech_speaker_member_id)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			$wdj_mysql_interface->set_speech_speaker($SPEECH_ID, $speech_speaker_member_id);
			$speech_obj = $wdj_mysql_interface->sel_speech($SPEECH_ID);
			$new_action_name = $speech_obj->__speaker_member_name;

		} else if($IS_UPDATE_SPEECH_EVALUATOR) {







			if(empty($SELECTED_VALUE)) {
				$result->error = "EVENT_TYPE_UPDATE_ITEM / \$wdj_mysql_interface->is_empty(__FUNCTION__, \$SELECTED_VALUE)";
				terminate($wdj_mysql_interface, $result);
				return;
			}








			$SPEECH_EVALUATOR_MEMBER_HASH_KEY = $SELECTED_VALUE;
			$result->SPEECH_EVALUATOR_MEMBER_HASH_KEY = $SPEECH_EVALUATOR_MEMBER_HASH_KEY;
			$ACTION_CONTEXT_OBJ->SPEECH_EVALUATOR_MEMBER_HASH_KEY = $SPEECH_EVALUATOR_MEMBER_HASH_KEY;

			// evaluator 정보를 업데이트 하는 경우.
			// MEMBER_HASH_KEY --> MEMBER_KEY
			$speech_evaluator_member_id = $wdj_mysql_interface->get_member_id_by_hash_key($SELECTED_VALUE);
			if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $speech_evaluator_member_id)){
				$result->error = "EVENT_TYPE_UPDATE_ITEM / \$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$speech_evaluator_member_id)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			$wdj_mysql_interface->set_speech_evaluator($SPEECH_ID, $speech_evaluator_member_id);
			$check_speech_obj = $wdj_mysql_interface->sel_speech($SPEECH_ID);
			if(is_null($check_speech_obj)) {
				$result->error = "EVENT_TYPE_UPDATE_ITEM / is_null(\$check_speech_obj)";
				terminate($wdj_mysql_interface, $result);
				return;
			}
			$new_action_name = $check_speech_obj->__evaluator_member_name;

			$result->speech_evaluator_member_id = $speech_evaluator_member_id;
			$result->__evaluator_member_id = $check_speech_obj->__evaluator_member_id;
			$result->__evaluator_member_hash_key = $check_speech_obj->__evaluator_member_hash_key;
			$result->__evaluator_member_name = $check_speech_obj->__evaluator_member_name;

		}
		if(empty($new_action_name)) {
			$result->error = "EVENT_TYPE_UPDATE_ITEM / empty(\$new_action_name)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(!is_null($ACTION_CONTEXT_OBJ->SPEECH_ID)) {
			$action_context_str = json_encode($ACTION_CONTEXT_OBJ);
			$result->ACTION_CONTEXT = $action_context_str;
			$wdj_mysql_interface->update_action_item($cur_action_item_id, $new_action_name, $action_context_str);

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
		if(ActionItem::is_not_instance($action_item_obj_delete)) {
			$result->error = "ActionItem::is_not_instance(\$action_item_obj_delete)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		if($action_item_obj_delete->is_table_field_item()) {
			// 실제 DB의 데이터도 제거 - TABLE
			$cur_table_row_field_action_item_list_delete = $action_item_obj_delete->get_table_row_field_action_item_list();

			for($idx = 0;$idx < count($cur_table_row_field_action_item_list_delete); $idx++) {
				$cur_action_item_delete = $cur_table_row_field_action_item_list_delete[$idx];
				$wdj_mysql_interface->delete_action_item_relation($cur_action_item_delete);
			}

		}
		
		// 업데이트된 root_action_list를 가져옵니다.
		$root_action_list = $wdj_mysql_interface->get_root_action_collection_by_hash_key($ROOT_ACTION_HASH_KEY, $MEETING_ID);
		if(ActionCollection::is_not_instance($root_action_list)) {
			$result->error = "ActionCollection::is_not_instance(\$root_action_list)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$result->root_action_list_deleted = $root_action_list->get_std_obj();

		// SPEECH 정보를 DB에서 삭제합니다.
		$wdj_mysql_interface->delete_speech($SPEECH_ID);
		// 삭제되었는지 확인합니다.
		$has_speech = $wdj_mysql_interface->has_speech($SPEECH_ID);
		$result->speech_has_deleted = (!$has_speech)?true:false;

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_TABLE_ROW_ORDER) == 0) {








		// CHECK - INIT
		if(empty($ROOT_ACTION_HASH_KEY)) {
			$result->error = "EVENT_TYPE_UPDATE_TABLE_ROW_ORDER / empty(\$ROOT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_HASH_KEY)) {
			$result->error = "EVENT_TYPE_UPDATE_TABLE_ROW_ORDER / empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_HASH_KEY_BEFORE) && empty($ACTION_HASH_KEY_AFTER)) {
			$result->error = "EVENT_TYPE_UPDATE_TABLE_ROW_ORDER / empty(\$ACTION_HASH_KEY_BEFORE) && empty(\$ACTION_HASH_KEY_AFTER)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK - END










		// 테이블의 열 순서를 바꿉니다.
		$table_field_action_item_obj_update = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY
		);
		if(ActionItem::is_not_instance($table_field_action_item_obj_update)) {
			$result->error = "ActionItem::is_not_instance(\$table_field_action_item_obj_update)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$target_speech_id = -1;
		if($table_field_action_item_obj_update->has_context_attr($params->SPEECH_ID)) {
			$target_speech_id = $table_field_action_item_obj_update->get_context_attr($params->SPEECH_ID);
			$target_speech_id = intval($target_speech_id);
		}
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $target_speech_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$target_speech_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$result->target_speech_id = $target_speech_id;


		$table_field_action_item_obj_update_before = null;
		$target_speech_before_id = -1;
		if(!empty($ACTION_HASH_KEY_BEFORE)) {
			$table_field_action_item_obj_update_before = 
			$wdj_mysql_interface->get_action_item_obj_with_relation(
				// $root_action_hash_key=""
				$ROOT_ACTION_HASH_KEY
				// $action_item_hash_key=""
				, $ACTION_HASH_KEY_BEFORE
			);

			$has_context_attr = $table_field_action_item_obj_update_before->has_context_attr($params->SPEECH_ID);
			if($has_context_attr) {
				$target_speech_before_id = $table_field_action_item_obj_update_before->get_context_attr($params->SPEECH_ID);
				$target_speech_before_id = intval($target_speech_before_id);

				if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $target_speech_before_id)){
					$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$target_speech_before_id)";
					terminate($wdj_mysql_interface, $result);
					return;
				}
			} // end inner if
		}
		$result->target_speech_before_id = $target_speech_before_id;
		// 테이블 컬럼의 이전 아이템의 다음 순서로 지정.
		$action_item_order = -1;
		$action_item_before_order = -1;
		if($wdj_mysql_interface->is_action_item(__FUNCTION__, $table_field_action_item_obj_update_before)) {
			$action_item_before_order = intval($table_field_action_item_obj_update_before->get_order());
			$action_item_order = $action_item_before_order + 50;
		}

		$table_field_action_item_obj_update_after = null;
		$target_speech_after_id = -1;
		if(!empty($ACTION_HASH_KEY_AFTER)) {
			$table_field_action_item_obj_update_after = 
			$wdj_mysql_interface->get_action_item_obj_with_relation(
				// $root_action_hash_key=""
				$ROOT_ACTION_HASH_KEY
				// $action_item_hash_key=""
				, $ACTION_HASH_KEY_AFTER
			);

			$has_context_attr = $table_field_action_item_obj_update_after->has_context_attr($params->SPEECH_ID);
			if($has_context_attr) {
				$target_speech_after_id = $table_field_action_item_obj_update_after->get_context_attr($params->SPEECH_ID);
				$target_speech_after_id = intval($target_speech_after_id);

				if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $target_speech_after_id)){
					$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$target_speech_after_id)";
					terminate($wdj_mysql_interface, $result);
					return;
				}
			} // end inner if
		}
		$result->target_speech_after_id = $target_speech_after_id;


		// 테이블 컬럼의 다음 아이템의 이전 순서로 지정.
		$action_item_after_order = -1;
		if($wdj_mysql_interface->is_action_item(__FUNCTION__, $table_field_action_item_obj_update_after)){
			$action_item_after_order = intval($table_field_action_item_obj_update_after->get_order());
			$action_item_order = $action_item_after_order - 50;
		}
		

		// 앞,뒤에 형제 객체가 모두 있는 경우, 순서 값을 두 객체 사이 값으로 지정해줍니다.
		if(!empty($ACTION_HASH_KEY_BEFORE) && !empty($ACTION_HASH_KEY_AFTER)) {
			$action_item_order = intval(($table_field_action_item_obj_update_before->get_order() + $table_field_action_item_obj_update_after->get_order()) / 2);
		}
		$result->table_row_action_item_order = $action_item_order;


		if($table_field_action_item_obj_update->is_table_field_item()) {

			// 실제 DB의 데이터도 바꿉니다. - TABLE
			$cur_table_row_field_action_item_list_update = $table_field_action_item_obj_update->get_table_row_field_action_item_list();
			// $cur_table_row_field_action_hash_key_list_update = array();
			$updated_table_row_field_std_list_list = array();

			for($idx = 0;$idx < count($cur_table_row_field_action_item_list_update); $idx++) {
				$cur_action_item_update = $cur_table_row_field_action_item_list_update[$idx];

				if(ActionItem::is_not_instance($cur_action_item_update)) {
					$result->error = "ActionItem::is_not_instance(\$cur_action_item_update)";
					terminate($wdj_mysql_interface, $result);
					return;
				}
				$action_hash_key = $cur_action_item_update->get_hash_key();
				if(empty($action_hash_key)) {
					$result->error = "empty(\$action_hash_key)";
					terminate($wdj_mysql_interface, $result);
					return;
				}

				$cur_parent_action_obj = null;
				$parent_action_hash_key = "";
				if($cur_action_item_update->has_parent()) {
					$cur_parent_action_obj = $cur_action_item_update->get_parent();
					$parent_action_hash_key = $cur_parent_action_obj->get_hash_key();
				}
				if(is_null($cur_parent_action_obj)) {
					$result->error = "is_null(\$cur_parent_action_obj)";
					terminate($wdj_mysql_interface, $result);
					return;
				}
				if(empty($parent_action_hash_key)) {
					$result->error = "empty(\$parent_action_hash_key)";
					terminate($wdj_mysql_interface, $result);
					return;
				}

				// wonder.jung
				// 자신의 부모 리스트에서 모든 형제 아이템을 가져와서 100 단위로 전부 업데이트합니다.

				// 새로운 순서는 아이템의 전후 관계를 변경해서 만들어야 하지 않을까? item order로 제어하는 것은 불안정할것으로 생각.
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

				// order가 변경되었으므로 다시 DB에서 업데이트된 action obj를 가져와야 합니다.
				$table_row_field_list = $wdj_mysql_interface->get_action_collection_by_hash_key($parent_action_hash_key);
				if(ActionCollection::is_not_instance($table_row_field_list)) {
					$result->error = "ActionCollection::is_not_instance(\$table_row_field_list)";
					terminate($wdj_mysql_interface, $result);
					return;
				}
				$table_row_field_list_std = $table_row_field_list->get_std_obj();

				// array_push($cur_table_row_field_action_hash_key_list_update, $cur_action_item_update->get_hash_key());
				array_push($updated_table_row_field_std_list_list, $table_row_field_list_std);

			}

			$result->updated_table_row_field_std_list_list = $updated_table_row_field_std_list_list;

			$wdj_mysql_interface->update_speech_sibling_relation($target_speech_before_id, $target_speech_id, $target_speech_after_id);

			// CHECK - 업데이트한 순서대로 정렬되었는지 확인합니다.


			// REMOVE ME
			// wonder.jung - speech의 앞뒤 관계를 speech id로 전달해줘야 함. 앞의 스피치id, 뒤의 스피치id.
			// DB UPDATE - SPEECH ORDER
			// $wdj_mysql_interface->update_speech_order($target_speech_id, $action_item_order);

			// reorder speech
			// $wdj_mysql_interface->reorder_speech($MEETING_ID);

		}		


	}

	terminate($wdj_mysql_interface, $result);
?>

