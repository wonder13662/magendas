<?php

	// common setting
	include_once("../common.inc");

	$result = new stdClass();
	$result->query_output_arr = array();
	$debug = "";








	// UPDATE - member management
	$MEMBER_HASH_KEY = $params->getParamString($params->MEMBER_HASH_KEY, "");
	$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);
	$TIMER_RECORD_ID = $params->getParamNumber($params->TIMER_RECORD_ID, -1);
	$TIMER_TYPE_ID = $params->getParamNumber($params->TIMER_TYPE_ID, -1);
	$TIME_RECORD_MILLISEC = $params->getParamNumber($params->TIME_RECORD_MILLISEC, 0);

	// MEMBER_HASH_KEY --> MEMBER_ID
	$MEMBER_ID = -1;
	if(!empty($MEMBER_HASH_KEY)) {
		$MEMBER_LIST = $wdj_mysql_interface->getMember($MEMBER_HASH_KEY);

		if(!empty($MEMBER_LIST)) {
			$MEMBER_OBJ = $MEMBER_LIST[0];
			$MEMBER_ID = intval($MEMBER_OBJ->__member_id);
		}
	}

	// CHECK SPEECH TIME QUALIFIED
	$is_qualified = false;
	if((0 < $TIMER_TYPE_ID) && (0 < $TIME_RECORD_MILLISEC)) {

		
		$is_qualified =
		$wdj_mysql_interface->isQualifiedTime(
			// $timer_type_id
			$TIMER_TYPE_ID
			// $time_record_millisec
			, $TIME_RECORD_MILLISEC
		);

	}

	if($params->isYes($params->IS_INSERT_TIMER)){

		if(is_null($is_qualified)) {
			return;
		}

		$query_output = 
		$wdj_mysql_interface->insertTimer(
			// $meeting_id
			$MEETING_ID
			// $timer_type_id
			, $TIMER_TYPE_ID
			// $member_id
			, $MEMBER_ID
			// $time
			, $TIME_RECORD_MILLISEC
			// $is_qualified
			, $is_qualified
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_UPDATE_TIMER) && (0 < $TIMER_RECORD_ID) && (0 < $MEMBER_ID)){

		$query_output = 
		$wdj_mysql_interface->updateTimerMember(
			// $timer_record_id
			$TIMER_RECORD_ID
			// $member_id
			, $MEMBER_ID
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_UPDATE_TIMER) && (0 < $TIMER_RECORD_ID) && (0 < $TIME_RECORD_MILLISEC)){

		$query_output = 
		$wdj_mysql_interface->updateTimerRecode(
			// $timer_record_id
			$TIMER_RECORD_ID
			// $time
			, $TIME_RECORD_MILLISEC
			// $is_qualified
			, $is_qualified
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_DELETE_TIMER)){

		/*
		$query_output = 
		$wdj_mysql_interface->updateMember(	$params->getParamString($params->MEMBER_HASH_KEY)
											, $params->getParamString($params->MEMBER_FIRST_NAME)
											, $params->getParamString($params->MEMBER_LAST_NAME)
											, $params->getParamString($params->MEMBER_EMAIL));
		array_push($result->query_output_arr,$query_output);

		// 클럽 내의 활동 상황을 변경합니다.
		$query_output = 
		$wdj_mysql_interface->updateMemberStatus(	$params->getParamNumber($params->MEMBER_ID)
													, $params->getParamNumber($params->MEETING_MEMBERSHIP_ID)
													, $params->getParamString($params->MEMBER_MEMBERSHIP_STATUS)
		);
		array_push($result->query_output_arr,$query_output);
		*/

	}


	// CLOSE DB
	$wdj_mysql_interface->close();

	// OUTPUT
	$result->debug=$debug;
	echo json_encode($result);
?>

