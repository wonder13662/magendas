<?php

	// /api/v1/toast-master/login/do.php
	
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





	// SPEECH

	// GET PARAMS

	// MEETING AGENDA COMMON
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);
	$FACEBOOK_USER_ID = $params->getParamNumber($params->FACEBOOK_USER_ID, -1);
	$FACEBOOK_USER_EMAIL = $params->getParamString($params->FACEBOOK_USER_EMAIL, "");
	$FACEBOOK_USER_FIRST_NAME = $params->getParamString($params->FACEBOOK_USER_FIRST_NAME, "");
	$FACEBOOK_USER_LAST_NAME = $params->getParamString($params->FACEBOOK_USER_LAST_NAME, "");
	$MEMBER_HASH_KEY = $params->getParamString($params->MEMBER_HASH_KEY, "");

	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->MEETING_MEMBERSHIP_ID = $MEETING_MEMBERSHIP_ID;
	$result->FACEBOOK_USER_ID = $FACEBOOK_USER_ID;
	$result->FACEBOOK_USER_EMAIL = $FACEBOOK_USER_EMAIL;
	$result->FACEBOOK_USER_FIRST_NAME = $FACEBOOK_USER_FIRST_NAME;
	$result->FACEBOOK_USER_LAST_NAME = $FACEBOOK_USER_LAST_NAME;
	$result->MEMBER_HASH_KEY = $MEMBER_HASH_KEY;













	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_MEMBERSHIP_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_MEMBERSHIP_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END












	if(strcmp($params->IS_FACEBOOK_USER_SEARCH, $EVENT_PARAM_EVENT_TYPE) == 0) {
		
		// CHECK VALID INIT
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $FACEBOOK_USER_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$FACEBOOK_USER_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($FACEBOOK_USER_EMAIL)){
			$result->error = "empty(\$FACEBOOK_USER_EMAIL)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($FACEBOOK_USER_FIRST_NAME)){
			$result->error = "empty(\$FACEBOOK_USER_FIRST_NAME)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALID END

		// facebook id로 등록되어 있는지 확인
		$has_member_n_facebook = $wdj_mysql_interface->has_member_n_facebook($FACEBOOK_USER_ID);
		$result->has_member_n_facebook = $has_member_n_facebook;
		
		$member_list = null;
		if($has_member_n_facebook){

			// 멤버에 등록되어 있습니다. 멤버 정보를 가져옵니다.
			$member_obj = 
			$wdj_mysql_interface->get_member_n_facebook($FACEBOOK_USER_ID);

			$result->registered_member = $member_obj;

		} else {

			// facebook 유저와 비슷한 유저 리스트를 돌려줍니다.
			$member_list = 
			$wdj_mysql_interface->search_member_by_fb_account(
				$MEETING_MEMBERSHIP_ID
				, $FACEBOOK_USER_FIRST_NAME
				, $FACEBOOK_USER_LAST_NAME
				, $FACEBOOK_USER_EMAIL
			);
			$result->member_list = $member_list;
		}

	} else if(strcmp($params->IS_FACEBOOK_USER_ADD, $EVENT_PARAM_EVENT_TYPE) == 0) {

		// CHECK VALID INIT
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $FACEBOOK_USER_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$FACEBOOK_USER_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($MEMBER_HASH_KEY)){
			$result->error = "empty(\$MEMBER_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		$member_id = $wdj_mysql_interface->get_member_id_by_hash_key($MEMBER_HASH_KEY);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $member_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$member_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		// CHECK VALID END

		// CHECK - 이미 등록되어 있는지 확인.
		// public function has_member_n_facebook($fb_user_id=-1) {
		$has_member_n_facebook = $wdj_mysql_interface->has_member_n_facebook($FACEBOOK_USER_ID);
		if($has_member_n_facebook) {
			$result->error = "\$has_member_n_facebook";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// facebook id로 등록되어 있지 않다면 추가등록 합니다.
		$wdj_mysql_interface->insert_member_n_facebook($member_id, $FACEBOOK_USER_ID);

		// CHECK
		$member_n_facebook = $wdj_mysql_interface->get_member_n_facebook($FACEBOOK_USER_ID);
		$result->member_n_facebook = $member_n_facebook;

	}








	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































