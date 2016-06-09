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









	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {






		// 1,2,3번의 과정은 공통 작업 부분.
		// 1. 해당 미팅의 아젠다를 로딩합니다.
		$action_file_info = $wdj_mysql_interface->select_action_file_info($MEETING_ID);
		$result->action_file_info = $action_file_info;

		$action_json_str = "";
		if(!is_null($action_file_info)) {
			$action_json_str = ActionFileManager::load($action_file_info->__action_regdate, $action_file_info->__action_hash_key);	
		}
		if(empty($action_json_str)) {
			$result->error = "empty(\$action_json_str)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$action_std = json_decode($action_json_str);
		if(is_null($action_std)) {
			$result->error = "is_null(\$action_std)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$result->action_std = $action_std;

		// 2. action_std --> action_obj로 변환.
		$action_obj = ActionObject::convert($action_std);
		if(ActionObject::is_not_action_obj($action_obj)) {
			$result->error = "ActionObject::is_not_action_obj(\$action_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// 3. CHECK IDENTICAL DATA
		$is_same = ActionObject::compare_with_std($action_obj, $action_std);
		$result->is_same = $is_same;







		if(empty($ACTION_HASH_KEY)) {

			// 1. 새로운 아이템을 추가하는 경우
			$result->PROCESS = "1. 새로운 아이템을 추가하는 경우";

			$target_action_obj = $action_obj->search($ACTION_HASH_KEY_BEFORE);
			if(ActionObject::is_not_action_obj($target_action_obj)) {
				$result->error = "ActionObject::is_not_action_obj(\$target_action_obj)";
				terminate($wdj_mysql_interface, $result);
				return;
			}

			$target_action_std = $target_action_obj->get_std_obj();
			$result->target_action_std = $target_action_std;


			// wonder.jung
			// 검색 결과로 나온 객체에 add_empty_sibling_after로 새로운 형제 객체 추가.

			// 파라미터로 전달받은 내부 정보를 지정해줍니다.

		} else {

			// 2. 기존의 아이템을 업데이트하는 경우.
			$result->PROCESS = "2. 기존의 아이템을 업데이트하는 경우.";

		}








	}

	// FIN
	terminate($wdj_mysql_interface, $result);

?>

