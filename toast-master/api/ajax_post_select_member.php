<?php

	// common setting
	include_once("../common.inc");

	$result = new stdClass();
	$result->query_output_arr = array();
	$debug = "";








	// SELECT MEMBER
	$MEMBER_FIRST_NAME = $params->getParamString($params->MEMBER_FIRST_NAME, "");
	$MEMBER_LAST_NAME = $params->getParamString($params->MEMBER_LAST_NAME, "");
	$MEMBER_EMAIL = $params->getParamString($params->MEMBER_EMAIL, "");
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);

	if($params->isYes($params->IS_SELECT_MEMBER)){

		if(!empty($MEMBER_EMAIL)) {
			$query_output = $wdj_mysql_interface->getMemberByEmail($MEMBER_EMAIL);
			$result->getMemberByEmail=$query_output;
		}

	}




	// CLOSE DB
	$wdj_mysql_interface->close();

	// OUTPUT
	$result->debug=$debug;
	echo json_encode($result);
?>

