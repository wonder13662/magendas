<?php

	// /api/v1/toast-master/role/select.php
	
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





	// OFFICERS

	// GET PARAMS

	// MEETING AGENDA COMMON
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);
	$ROLE_ID = $params->getParamNumber($params->ROLE_ID, -1);

	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->MEETING_ID = $MEETING_ID;
	$result->ROLE_ID = $ROLE_ID;
	











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END
















	//
	if(strcmp($params->IS_SELECT_TODAY_ROLE_CNT,$EVENT_PARAM_EVENT_TYPE) == 0) {

		$MEETING_MEMBERSHIP_ID = $wdj_mysql_interface->get_membership_id_by_meeting_id($MEETING_ID);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_MEMBERSHIP_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_MEMBERSHIP_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$today_role_list = $wdj_mysql_interface->getTodayRoleList($MEETING_MEMBERSHIP_ID, $MEETING_ID);

		$today_role_cnt = 0;
		for($idx = 0;$idx < count($today_role_list);$idx++) {
			$role_obj = $today_role_list[$idx];
			if(is_null($role_obj)) {
				continue;
			}
			$__member_id = intval($role_obj->__member_id);
			if(0 < $__member_id) {
				$today_role_cnt++;
			}
		}

		$result->today_role_cnt = $today_role_cnt;

	}













	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































