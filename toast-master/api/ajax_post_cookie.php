<?php

	// common setting
	include_once("../common.inc");

	$result = new stdClass();
	$result->query_output_arr = array();
	$debug = "";








	// UPDATE - meeting membership cookie management
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);
	if($params->isYes($params->IS_UPDATE_COOKIE_MEMBERSHIP)){

		// 브라우저에서 사용중인 멤버쉽 - 클럽 키를 쿠키에 등록합니다.
		// 클럽을 변경하면 이 쿠키값도 변경됩니다.
		$query_output = ToastMasterLogInManager::setMembershipCookie($MEETING_MEMBERSHIP_ID);
		array_push($result->query_output_arr,json_encode($query_output));

		// 입력한 쿠키를 조회합니다.
		$cookie_meeting_membership_id = ToastMasterLogInManager::getMembershipCookie();
		array_push($result->query_output_arr,$cookie_meeting_membership_id);

	}




	// CLOSE DB
	$wdj_mysql_interface->close();

	// OUTPUT
	$result->debug=$debug;
	echo json_encode($result);
?>

