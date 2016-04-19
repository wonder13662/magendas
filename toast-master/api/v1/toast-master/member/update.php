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
	if(strcmp($params->IS_UPDATE_MEMBER, $EVENT_PARAM_EVENT_TYPE) != 0) {
		$result->error = "strcmp(\$params->IS_UPDATE_MEMBER, \$EVENT_PARAM_EVENT_TYPE) != 0";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_MEMBERSHIP_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_MEMBERSHIP_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if(empty($MEMBER_HASH_KEY)) {
		$result->error = "empty(\$MEMBER_HASH_KEY)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	$MEMBER_ID = $wdj_mysql_interface->get_member_id_by_hash_key($MEMBER_HASH_KEY);
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEMBER_ID, "MEMBER_ID")){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEMBER_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	$result->MEMBER_ID = $MEMBER_ID;
	if(	!empty($MEMBER_MEMBERSHIP_STATUS) && 
		(strcmp($MEMBER_MEMBERSHIP_STATUS, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE) != 0) &&
		(strcmp($MEMBER_MEMBERSHIP_STATUS, $params->MEMBER_MEMBERSHIP_STATUS_SLEEPING) != 0) ) {

		// 멤버쉽 상태가 있는데, A or N이 아닌 경우.
		$result->error = "\$MEMBER_MEMBERSHIP_STATUS is not valid!";
		terminate($wdj_mysql_interface, $result);
		return;

	}
	$target_member_obj = $wdj_mysql_interface->get_club_member($MEMBER_ID, $MEETING_MEMBERSHIP_ID);
	if(is_null($target_member_obj)) {
		$result->error = "is_null(\$target_member_obj)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	$__member_first_name = $target_member_obj->__member_first_name;
	if(empty($__member_first_name)) {
		$result->error = "empty(\$__member_first_name)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	$__member_last_name = $target_member_obj->__member_last_name;
	if(empty($__member_last_name)) {
		$result->error = "empty(\$__member_last_name)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	$__member_email = $target_member_obj->__member_email;
	if(empty($__member_email)) {
		$result->error = "empty(\$__member_email)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	$__member_membership_status = $target_member_obj->__member_membership_status;
	if(empty($__member_membership_status)) {
		$result->error = "empty(\$__member_membership_status)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	// CHECK VALIDATION - END



















	if(!empty($MEMBER_FIRST_NAME)) {
		// UPDATE MEMBER FIRST NAME

		$is_changed = false;
		if(strcmp($__member_first_name, $MEMBER_FIRST_NAME) != 0) {
			$is_changed = true;
		}
		if($is_changed) {
			$wdj_mysql_interface->updateMemberFirstName($MEMBER_HASH_KEY, $member_first_name);

			$updated_member_obj = $wdj_mysql_interface->get_club_member($MEMBER_ID, $MEETING_MEMBERSHIP_ID);
			$updated_member_first_name = $updated_member_obj->__member_first_name;

			$result->updated_member_first_name = $updated_member_first_name;
		}

	} else if(!empty($MEMBER_LAST_NAME)) {
		// UPDATE MEMBER LAST NAME

		$is_changed = false;
		if(strcmp($__member_last_name, $MEMBER_LAST_NAME) != 0) {
			$is_changed = true;
		}
		if($is_changed) {
			$wdj_mysql_interface->updateMemberLastName($MEMBER_HASH_KEY, $member_last_name);

			$updated_member_obj = $wdj_mysql_interface->get_club_member($MEMBER_ID, $MEETING_MEMBERSHIP_ID);
			$updated_member_last_name = $updated_member_obj->__member_last_name;

			$result->updated_member_last_name = $updated_member_last_name;
		}

	} else if(!empty($MEMBER_EMAIL)) {
		// UPDATE MEMBER EMAIL

		$is_changed = false;
		if(strcmp($__member_email, $MEMBER_EMAIL) != 0) {
			$is_changed = true;
		}
		if($is_changed) {
			$wdj_mysql_interface->updateMemberEmail($MEMBER_HASH_KEY, $MEMBER_EMAIL);

			$updated_member_obj = $wdj_mysql_interface->get_club_member($MEMBER_ID, $MEETING_MEMBERSHIP_ID);
			$updated_member_email = $updated_member_obj->__member_email;

			$result->updated_member_email = $updated_member_email;
		}

	} else if(!empty($MEMBER_MEMBERSHIP_STATUS)) {
		// UPDATE MEMBER STATUS

		$is_changed = false;
		if(strcmp($__member_membership_status, $MEMBER_MEMBERSHIP_STATUS) != 0) {
			$is_changed = true;
		}
		if($is_changed) {
			$wdj_mysql_interface->updateMemberStatus($MEMBER_ID, $MEETING_MEMBERSHIP_ID, $MEMBER_MEMBERSHIP_STATUS);

			$updated_member_obj = $wdj_mysql_interface->get_club_member($MEMBER_ID, $MEETING_MEMBERSHIP_ID);
			$updated_member_membership_status = $updated_member_obj->__member_membership_status;

			$result->updated_member_membership_status = $updated_member_membership_status;
		}


	}






	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































