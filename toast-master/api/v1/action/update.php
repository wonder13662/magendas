<?php

	// /api/v1/action/toast-master/schedule/update.php

	// common setting
	include_once("../../../common.inc");
	include_once("../../../db/toast-master/mysql.interface.toast-master.inc");

	$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
	$result = new stdClass();

	function terminate($wdj_mysql_interface, $result) {
		// CLOSE DB
		$wdj_mysql_interface->close();
		echo json_encode($result);
		return;
	}








	// GET PARAMS
	// MEETING AGENDA COMMON
	$MEETING_ID = $params->getParamNumber($params->MEETING_ID);
	$ACTION_NAME = $params->getParamString($params->ACTION_NAME);
	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ACTION_HASH_KEY_BEFORE = $params->getParamString($params->ACTION_HASH_KEY_BEFORE);
	$ACTION_HASH_KEY_AFTER = $params->getParamString($params->ACTION_HASH_KEY_AFTER);
	$CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR = $params->getParamString($params->CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR);
	$PARENT_ACTION_HASH_KEY = $params->getParamString($params->PARENT_ACTION_HASH_KEY);
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$ACTION_ORDER = $params->getParamNumber($params->ACTION_ORDER, -1);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);
	


	// DEBUG
	$result->MEETING_ID = $MEETING_ID;
	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR = $CHILD_ADD_ON_ACTION_HASH_KEY_ARRAY_JSON_STR;
	$result->ACTION_HASH_KEY_BEFORE = $ACTION_HASH_KEY_BEFORE;
	$result->ACTION_HASH_KEY_AFTER = $ACTION_HASH_KEY_AFTER;
	$result->PARENT_ACTION_HASH_KEY = $PARENT_ACTION_HASH_KEY;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;
	$result->ACTION_ORDER = $ACTION_ORDER;
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;










	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
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






	// 1. 해당 미팅의 아젠다를 로딩합니다.
	$action_file_info = $wdj_mysql_interface->select_action_file_info($MEETING_ID);
	if(is_null($action_file_info)) {
		$result->error = "is_null(\$action_file_info)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	$result->action_file_info = $action_file_info;

	// 1-1. 아젠다의 action obj를 가져옵니다.
	$action_obj = ActionFileManager::load_action_obj($action_file_info->__action_regdate, $action_file_info->__action_hash_key);	
	if(ActionObject::is_not_action_obj($action_obj)) {
		$result->error = "ActionObject::is_not_action_obj(\$action_obj)";
		terminate($wdj_mysql_interface, $result);
		return;
	}









	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_ITEM) == 0) {

		$result->PROCESS = "0. 테이블에 새로운 아이템을 추가하는 경우";

		if(empty($ACTION_HASH_KEY_BEFORE)) {
			$result->error = "empty(\$ACTION_HASH_KEY_BEFORE)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$target_action_obj = $action_obj->search($ACTION_HASH_KEY_BEFORE);
		if(ActionObject::is_not_action_obj($target_action_obj)) {
			$result->error = "ActionObject::is_not_action_obj(\$target_action_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$result->target_action_std = $target_action_obj->get_std_obj();

		// 복사할 대상인 테이블 열의 모든 action item의 리스트를 가져옵니다.
		$cur_table_row_field_action_item_list = null;
		if(ActionItem::is_instance($target_action_obj) && $target_action_obj->is_table_field_item()) {
			// action item인 경우, 부모 객체를 불러옵니다.
			$cur_table_row_field_action_item_list = $target_action_obj->get_table_row_field_action_item_list();
		}
		if(is_null($cur_table_row_field_action_item_list)) {
			$result->error = "is_null(\$cur_table_row_field_action_item_list)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$new_table_row_item_list = array();
		foreach($cur_table_row_field_action_item_list AS $action_item) {
			$copy_action_obj = $action_item->add_empty_sibling_after($params->NOT_ASSIGNED);

			if(is_null($copy_action_obj)) {
				$result->error = "is_null(\$copy_action_obj)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			array_push($new_table_row_item_list, $copy_action_obj->get_std_obj());
		}
		$result->new_table_row_item_list = $new_table_row_item_list;

		// 0-3. save changed action obj
		// 0-4. CHECK
		$result->action_std_updated = ActionFileManager::save_n_reload_action_std($action_file_info->__action_regdate, $action_obj);

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {

		if(empty($ACTION_HASH_KEY)) {

			// 2-1. 새로운 아이템을 추가하는 경우
			$result->PROCESS = "2-1. 새로운 아이템을 추가하는 경우";

			// 2-1-1. 대상 아이템을 가져옵니다. (공통 로직?)
			if(empty($ACTION_HASH_KEY_BEFORE)) {
				$result->error = "empty(\$ACTION_HASH_KEY_BEFORE)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			$target_action_obj = $action_obj->search($ACTION_HASH_KEY_BEFORE);
			if(ActionItem::is_not_instance($target_action_obj)) {
				$result->error = "ActionItem::is_not_instance(\$target_action_obj)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			// 2-1-2. add new item & set new name received
			$copy_action_obj = $target_action_obj->add_empty_sibling_after($ACTION_NAME);
			$result->ACTION_HASH_KEY = $copy_action_obj->get_hash_key();

			// 2-1-3. save changed action obj & check
			$result->action_std_updated = ActionFileManager::save_n_reload_action_std($action_file_info->__action_regdate, $action_obj);

		} else {

			// 2-3-1. 대상 아이템을 가져옵니다. (공통 로직?)
			if(empty($ACTION_HASH_KEY)) {
				$result->error = "empty(\$ACTION_HASH_KEY)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			$target_action_obj = $action_obj->search($ACTION_HASH_KEY);
			if(ActionItem::is_not_instance($target_action_obj)) {
				$result->error = "ActionItem::is_not_instance(\$target_action_obj)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			if(-1 < $ACTION_ORDER && ($ACTION_ORDER != $target_action_obj->get_idx())) {

				// 2-2. 리스트의 아이템의 순서를 변경하는 경우.
				$result->PROCESS = "2-2. 리스트의 아이템의 순서를 변경하는 경우.";
				$target_action_obj->shift($ACTION_ORDER);

			} else {

				// 2-3. 기존의 아이템을 업데이트하는 경우.
				$result->PROCESS = "2-3. 기존의 아이템을 업데이트하는 경우.";

				// 2-3-2. update name & context
				if(empty($ACTION_NAME)) {
					$result->error = "empty(\$ACTION_NAME)";
					terminate($wdj_mysql_interface, $result);
					return;
				}

				$target_action_obj->set_name($ACTION_NAME);
				if(!empty($ACTION_CONTEXT)) {
					$target_action_obj->set_context($ACTION_CONTEXT);
				}
				$result->target_action_std_updated = $target_action_obj->get_std_obj();

			}


			// 2-3-3. save changed action obj & check
			$result->action_std_updated = ActionFileManager::save_n_reload_action_std($action_file_info->__action_regdate, $action_obj);	

		}

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_DELETE_ITEM) == 0) {

		// 3. 아이템을 삭제하는 경우
		$result->PROCESS = "3. 아이템을 삭제하는 경우";

		if(empty($ACTION_HASH_KEY)) {
			$result->error = "empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// 2-1. 아이템이 실제로 있는지 확인.
		$target_action_obj = $action_obj->search($ACTION_HASH_KEY);
		if(ActionItem::is_not_instance($target_action_obj)) {
			$result->error = "ActionItem::is_not_instance(\$target_action_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		if($target_action_obj->is_table_field_item()) {
			// 2-2-2. table field item 삭제
			$result->PROCESS = "3. 아이템을 삭제하는 경우 / 2-2-2. table field item 삭제";
			$cur_table_row_field_action_item_list = $target_action_obj->get_table_row_field_action_item_list();
			if(is_null($cur_table_row_field_action_item_list)) {
				$result->error = "is_null(\$cur_table_row_field_action_item_list)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			foreach($cur_table_row_field_action_item_list AS $action_item) {
				$action_item->remove();
			}

		} else {
			// 2-2-3. list item 삭제
			$result->PROCESS = "3. 아이템을 삭제하는 경우 / 2-2-3. list item 삭제";
			$target_action_obj->remove();
		}

		// 2-3. save changed action obj & check
		$result->action_std_updated = ActionFileManager::save_n_reload_action_std($action_file_info->__action_regdate, $action_obj);

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_TABLE_ROW_ORDER) == 0) {

		// 4. 테이블의 열의 순서를 변경하는 경우
		$result->PROCESS = "4. 테이블의 열의 순서를 변경하는 경우";

		if(!(-1 < $ACTION_ORDER)) {
			$result->error = "!(-1 < \$ACTION_ORDER)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		if(empty($ACTION_HASH_KEY)) {
			$result->error = "empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$target_action_obj = $action_obj->search($ACTION_HASH_KEY);
		if(ActionObject::is_not_action_obj($target_action_obj)) {
			$result->error = "ActionObject::is_not_action_obj(\$target_action_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$result->target_action_std = $target_action_obj->get_std_obj();

		// 복사할 대상인 테이블 열의 모든 action item의 리스트를 가져옵니다.
		$cur_table_row_field_action_item_list = null;
		if(ActionItem::is_instance($target_action_obj) && $target_action_obj->is_table_field_item()) {
			// action item인 경우, 부모 객체를 불러옵니다.
			$cur_table_row_field_action_item_list = $target_action_obj->get_table_row_field_action_item_list();
		}
		if(is_null($cur_table_row_field_action_item_list)) {
			$result->error = "is_null(\$cur_table_row_field_action_item_list)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		foreach($cur_table_row_field_action_item_list AS $action_item) {
			$action_item->shift($ACTION_ORDER);
		}

		// 2-3. save changed action obj & check
		$result->action_std_updated = ActionFileManager::save_n_reload_action_std($action_file_info->__action_regdate, $action_obj);
		
	}



	// FIN
	terminate($wdj_mysql_interface, $result);

?>

