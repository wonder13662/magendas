<?php

	// /api/v1/action/toast-master/schedule/template/update.php

	// common setting
	include_once("../../../../../../common.inc");
	include_once("../../../../../../db/toast-master/mysql.interface.toast-master.inc");

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
	$ACTION_BEGIN_HH_MM = $params->getParamString($params->ACTION_BEGIN_HH_MM, "19:30");

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
	if(strcmp($ACTION_TEMPLATE_NAME, $params->ACTION_TEMPLATE_BUNDANG) == 0) {





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
		$action_obj_BDTM = ActionTemplate::get_BDTM($wdj_mysql_interface, $ACTION_BEGIN_HH_MM, $MEETING_ID, $ACTION_NAME);
		$root_action_obj = $wdj_mysql_interface->add_action($action_obj_BDTM);

	} else if(strcmp($ACTION_TEMPLATE_NAME, $params->ACTION_TEMPLATE_PREV_MEETING) == 0) {






		// CHECK VALIDATION - INIT
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID_SRC)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID_SRC)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALIDATION - END






		// 직전 미팅 템플릿 적용
		// 1. 직전 미팅 템플릿 정보를 가져온다.
		$recent_action_id = $wdj_mysql_interface->select_recent_action_id_collection_by_meeting_id($MEETING_ID_SRC);
		
		$recent_root_action_collection = null;
		if(0 < $recent_action_id) {
			$recent_root_action_collection = $wdj_mysql_interface->get_root_action_collection_toastmasters($recent_action_id, $MEETING_ID_SRC);	
		}

		$root_action_collection_copy = null;
		if(!is_null($recent_root_action_collection)) {
			$root_action_collection_copy = $wdj_mysql_interface->add_action($recent_root_action_collection);
		}
		if(!is_null($root_action_collection_copy) && ($root_action_collection_copy->get_id() != $recent_action_id)) {

			$root_action_collection_copy_id = $root_action_collection_copy->get_id();
			$result->root_action_collection_copy_id = $root_action_collection_copy_id;

		}

	} // end inner if

	// SPEECH, ROLE에 대한 정보가 DB에 있다면 업데이트해줍니다.
	$action_collection_obj_updated = $wdj_mysql_interface->get_recent_action_collection_by_meeting_id($MEETING_ID);
	if(!is_null($root_action_collection_copy)) {
		$result->root_action_collection_updated = $action_collection_obj_updated->get_std_obj();	
	}

	// FIN
	terminate($wdj_mysql_interface, $result);

?>

