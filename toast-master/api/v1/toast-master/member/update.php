<?php

	// /api/v1/toast-master/member/update.php
	
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
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID);
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);
	$SELECTED_VALUE = $ACTION_CONTEXT_OBJ->{$params->SELECTED_VALUE};

	// $ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	// $ACTION_CONTEXT_OBJ = json_decode($ACTION_CONTEXT);
	// print_r($ACTION_CONTEXT_OBJ);
	// echo "<br/>";

	// $OFFICER_ID = intval($ACTION_CONTEXT_OBJ->{$params->OFFICER_ID});

	// DEBUG
	$result->MEETING_MEMBERSHIP_ID = $MEETING_MEMBERSHIP_ID;
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;
	$result->SELECTED_VALUE = $SELECTED_VALUE;

	// $result->OFFICER_ID = $OFFICER_ID;
	// $result->ACTION_CONTEXT = $ACTION_CONTEXT;










	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $OFFICER_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$OFFICER_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if(empty($SELECTED_VALUE)) {
		$result->error = "empty(\$SELECTED_VALUE)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END


	$MEMBER_ID = $wdj_mysql_interface->get_member_id_by_hash_key($SELECTED_VALUE);
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEMBER_ID, "MEMBER_ID")){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEMBER_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	$result->MEMBER_ID = $MEMBER_ID;

	$wdj_mysql_interface->updateExecutiveMember($MEETING_MEMBERSHIP_ID, $OFFICER_ID, $MEMBER_ID);







	// FIN
	terminate($wdj_mysql_interface, $result);

?>

