<?php

	// /api/v1/member/update.php
	
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





	// OFFICERS

	// GET PARAMS

	// MEETING AGENDA COMMON
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);
	$MEMBER_FIRST_NAME = $params->getParamString($params->MEMBER_FIRST_NAME, "");
	$MEMBER_LAST_NAME = $params->getParamString($params->MEMBER_LAST_NAME, "");
	$MEMBER_EMAIL = $params->getParamString($params->MEMBER_EMAIL, "");
	$MEMBER_HASH_KEY = $params->getParamString($params->MEMBER_HASH_KEY, "");
	$MEMBER_MEMBERSHIP_STATUS = $params->getParamString($params->MEMBER_MEMBERSHIP_STATUS, "");


	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->MEETING_MEMBERSHIP_ID = $MEETING_MEMBERSHIP_ID;
	$result->MEMBER_FIRST_NAME = $MEMBER_FIRST_NAME;
	$result->MEMBER_LAST_NAME = $MEMBER_LAST_NAME;
	$result->MEMBER_EMAIL = $MEMBER_EMAIL;
	$result->MEMBER_HASH_KEY = $MEMBER_HASH_KEY;
	











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_MEMBERSHIP_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_MEMBERSHIP_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END

















	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_MEMBER) == 0) {

		if(empty($MEMBER_FIRST_NAME)) {
			$result->error = "empty(\$MEMBER_FIRST_NAME)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($MEMBER_LAST_NAME)) {
			$result->error = "empty(\$MEMBER_LAST_NAME)";
			terminate($wdj_mysql_interface, $result);
			return;
		}




		if(empty($MEMBER_EMAIL)) {
			$result->MEMBER_EMAIL = $MEMBER_EMAIL = strtolower($MEMBER_FIRST_NAME) . "." . strtolower($MEMBER_LAST_NAME) . "@magendas.com";
		}
		
		$MEMBER_HASH_KEY = 
		$wdj_mysql_interface->insertMember(	
			$MEMBER_FIRST_NAME
			, $MEMBER_LAST_NAME
			, $MEMBER_EMAIL
		);
		$result->MEMBER_HASH_KEY = $MEMBER_HASH_KEY;

		// CHECK : get member
		$member_obj = $wdj_mysql_interface->get_member_by_hash_key($MEMBER_HASH_KEY);
		$result->member_obj = $member_obj;
		if(is_null($member_obj)) {
			$result->success = false;
			$result->error = "getMember / is_null(\$member_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// register membership
		$wdj_mysql_interface->insertMemberNMembership(intval($member_obj->__member_id), $MEETING_MEMBERSHIP_ID);
		$member_obj = $wdj_mysql_interface->get_member_by_membership_n_hash_key($MEETING_MEMBERSHIP_ID, $MEMBER_HASH_KEY);
		$result->member_obj = $member_obj;
		if(is_null($member_obj)) {
			$result->success = false;
			$result->error = "insertMemberNMembership / is_null(\$member_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$result->success = true;

	}







	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































