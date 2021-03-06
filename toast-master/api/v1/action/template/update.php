<?php

	// /api/v1/action/toast-master/schedule/template/update.php

	// common setting
	include_once("../../../../common.inc");
	include_once("../../../../db/toast-master/mysql.interface.toast-master.inc");

	$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
	$result = new stdClass();

	function terminate($wdj_mysql_interface, $result) {
		// CLOSE DB
		$wdj_mysql_interface->close();
		echo json_encode($result);
		return;
	}








	// GET PARAMS

	//  dMMMMMMP dMMMMMP dMMMMMMMMb  dMMMMb  dMP     .aMMMb dMMMMMMP dMMMMMP 
	//    dMP   dMP     dMP"dMP"dMP dMP.dMP dMP     dMP"dMP   dMP   dMP      
	//   dMP   dMMMP   dMP dMP dMP dMMMMP" dMP     dMMMMMP   dMP   dMMMP     
	//  dMP   dMP     dMP dMP dMP dMP     dMP     dMP dMP   dMP   dMP        
	// dMP   dMMMMMP dMP dMP dMP dMP     dMMMMMP dMP dMP   dMP   dMMMMMP     
                                                                                                                                         
	// MEETING AGENDA COMMON
	$MEETING_ID = $params->getParamNumber($params->MEETING_ID);
	$MEETING_ID_SRC = $params->getParamNumber($params->MEETING_ID_SRC);

	$ACTION_NAME = $params->getParamString($params->ACTION_NAME);
	$ACTION_TEMPLATE_NAME = $params->getParamString($params->ACTION_TEMPLATE_NAME);
	$ACTION_BEGIN_HH_MM = $params->getParamString($params->ACTION_BEGIN_HH_MM, "19:50");

	// DEBUG
	$result->MEETING_ID = $MEETING_ID;
	$result->MEETING_ID_SRC = $MEETING_ID_SRC;

	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_TEMPLATE_NAME = $ACTION_TEMPLATE_NAME;
	$result->ACTION_BEGIN_HH_MM = $ACTION_BEGIN_HH_MM;











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if(empty($ACTION_TEMPLATE_NAME)) {
		$result->error = "empty(\$ACTION_TEMPLATE_NAME)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END









	

	// TEMPLATE
	// 템플릿을 적용합니다.
	$action_obj = null;
	$action_file_info = null;
	if(strcmp($ACTION_TEMPLATE_NAME, $params->ACTION_TEMPLATE_BUNDANG) == 0) {

		$result->PROCESS = "ACTION_TEMPLATE_BUNDANG";

		// CHECK VALIDATION - INIT
		if(empty($ACTION_BEGIN_HH_MM)) {
			$result->error = "empty(\$ACTION_BEGIN_HH_MM)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ACTION_NAME)) {
			$result->error = "empty(\$ACTION_NAME)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END

		// 기본 템플릿 적용
		$action_obj = ActionTemplate::get_TM_Default($ACTION_BEGIN_HH_MM, $ACTION_NAME);

	} else if(strcmp($ACTION_TEMPLATE_NAME, $params->ACTION_TEMPLATE_SUWON) == 0) {

		$result->PROCESS = "ACTION_TEMPLATE_SUWON";

		// CHECK VALIDATION - INIT
		if(empty($ACTION_NAME)) {
			$result->error = "empty(\$ACTION_NAME)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END

		// 기본 템플릿 적용
		$ACTION_BEGIN_HH_MM = "19:30";
		$action_obj = ActionTemplate::get_SUWON_TM($ACTION_BEGIN_HH_MM, $ACTION_NAME);

	} else if(strcmp($ACTION_TEMPLATE_NAME, $params->ACTION_TEMPLATE_PREV_MEETING) == 0) {

		$result->PROCESS = "ACTION_TEMPLATE_PREV_MEETING";

		// CHECK VALIDATION - INIT
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID_SRC)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID_SRC)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END

		// 직전 미팅 템플릿 적용
		// 1. 직전 미팅 템플릿 정보를 가져온다.
		$action_file_info = $wdj_mysql_interface->select_action_file_info($MEETING_ID_SRC);
		if(is_null($action_file_info)) {
			$result->error = "is_null(\$action_file_info)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$action_file_json_str = ActionFileManager::load($action_file_info->__action_regdate, $action_file_info->__action_hash_key);
		if(empty($action_file_json_str)) {
			$result->error = "empty(\$action_file_json_str)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$action_std = json_decode($action_file_json_str);
		if(is_null($action_std)) {
			$result->error = "is_null(\$action_std)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$action_obj = ActionObject::convert($action_std);
		if(is_null($action_obj)) {
			$result->error = "is_null(\$action_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}


	} // end inner if

	$result->PROCESS_2 = "DONE";

	if(is_null($action_obj)) {
		$result->error = "is_null(\$action_obj)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	$YYYYMMDD = ActionFileManager::get_date_today();
	if(!is_null($action_file_info)) {
		$YYYYMMDD = $action_file_info->__action_regdate;
	}
	if(empty($YYYYMMDD)) {
		$result->error = "empty(\$YYYYMMDD)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	// DB에 저장
	$cur_action_hash_key = $action_obj->get_hash_key();
	if(empty($cur_action_hash_key)) {
		$result->error = "empty(\$cur_action_hash_key)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	$wdj_mysql_interface->insert_action_file_path($cur_action_hash_key, $MEETING_ID, $YYYYMMDD);

	// save changed action obj & check
	$action_std_updated = ActionFileManager::save_n_reload_action_std($YYYYMMDD, $action_obj);
	if(empty($action_std_updated)) {
		$result->error = "empty(\$action_std_updated)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	$result->action_std_updated = $action_std_updated;


	// FIN
	terminate($wdj_mysql_interface, $result);

?>

