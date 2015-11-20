<?php

	// common setting
	include_once("../common.inc");

	$result = new stdClass();
	$result->query_output_arr = array();
	$debug = "";








	// UPDATE - member management
	$MEMBER_FIRST_NAME = $params->getParamString($params->MEMBER_FIRST_NAME, "");
	$MEMBER_LAST_NAME = $params->getParamString($params->MEMBER_LAST_NAME, "");
	$MEMBER_MOBILE = $params->getParamString($params->MEMBER_MOBILE, "");
	$MEMBER_EMAIL = $params->getParamString($params->MEMBER_EMAIL, "");
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);
	if($params->isYes($params->IS_INSERT_MEMBER)){

		$query_output = 
		$wdj_mysql_interface->insertMember(	
			$MEMBER_FIRST_NAME
			, $MEMBER_LAST_NAME
			, $MEMBER_MOBILE
			, $MEMBER_EMAIL
		);
		array_push($result->query_output_arr,$query_output);

		// 새로 추가한 멤버 정보를 가져옵니다.
		$member_list = $wdj_mysql_interface->getMemberByMobile($MEMBER_MOBILE);
		$member_obj;
		if(!empty($member_list) && COUNT($member_list) > 0) {
			$member_obj = $member_list[0];
		}
		if(!is_null($member_obj)){
			$member_id = $member_obj->__member_id;	
		}
		if(0 < $member_id && 0 < $MEETING_MEMBERSHIP_ID) {
			$query_output = 
			$wdj_mysql_interface->insertMemberNMembership($member_id, $MEETING_MEMBERSHIP_ID);
			array_push($result->query_output_arr,$query_output);

			// 새로 추가한 멤버 정보를 가져옵니다.
			$new_member_obj = 
			$wdj_mysql_interface->getMemberByNameAndEmail(
				$params->getParamString($params->MEMBER_FIRST_NAME)
				, $params->getParamString($params->MEMBER_LAST_NAME)
				, $params->getParamString($params->MEMBER_EMAIL)
			);
			array_push($result->query_output_arr,json_encode($new_member_obj));
		}

	} else if($params->isYes($params->IS_INSERT_MEMBER_N_MEMBERSHIP)){

		// 기존 멤버의 멤버쉽이 추가됩니다. ex) 듀얼 멤버
		$query_output = 
		$wdj_mysql_interface->insertMemberNMembership(
			// MEMBER_ID
			$params->getParamNumber($params->MEMBER_ID, -1)
			// MEETING_MEMBERSHIP_ID
			,$params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1)
		);
		array_push($result->query_output_arr,$query_output);

		// 추가한 멤버 정보를 조회해서 돌려줍니다.
		$query_output = 
		$wdj_mysql_interface->getMember(
			// MEMBER_ID
			$params->getParamNumber($params->MEMBER_ID, -1)
			// MEETING_MEMBERSHIP_ID
			,$params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1)
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_UPDATE_MEMBER)){

		$query_output = 
		$wdj_mysql_interface->updateMember(	$params->getParamString($params->MEMBER_HASH_KEY)
											, $params->getParamString($params->MEMBER_FIRST_NAME)
											, $params->getParamString($params->MEMBER_LAST_NAME)
											, $params->getParamString($params->MEMBER_MOBILE)
											, $params->getParamString($params->MEMBER_EMAIL));
		array_push($result->query_output_arr,$query_output);

		// 클럽 내의 활동 상황을 변경합니다.
		$query_output = 
		$wdj_mysql_interface->updateMemberStatus(	$params->getParamNumber($params->MEMBER_ID)
													, $params->getParamNumber($params->MEETING_MEMBERSHIP_ID)
													, $params->getParamString($params->MEMBER_MEMBERSHIP_STATUS)
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_UPDATE_MEMBER_MEMBERSHIP_STATUS)){

		// 클럽 내의 활동 상황을 변경합니다.
		$query_output = 
		$wdj_mysql_interface->updateMemberStatus(	$params->getParamNumber($params->MEMBER_ID)
													, $params->getParamNumber($params->MEETING_MEMBERSHIP_ID)
													, $params->getParamString($params->MEMBER_MEMBERSHIP_STATUS)
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_UPDATE_MEMBER_FIRST_NAME)){

		$query_output = 
		$wdj_mysql_interface->updateMemberFirstName(	$params->getParamString($params->MEMBER_HASH_KEY)
														, $params->getParamString($params->MEMBER_FIRST_NAME)
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_UPDATE_MEMBER_LAST_NAME)){

		$query_output = 
		$wdj_mysql_interface->updateMemberLastName(	$params->getParamString($params->MEMBER_HASH_KEY)
													, $params->getParamString($params->MEMBER_LAST_NAME)
		);
		array_push($result->query_output_arr,$query_output);

	} else if($params->isYes($params->IS_UPDATE_MEMBER_MOBILE)){

		$query_output = 
		$wdj_mysql_interface->updateMemberMobile(	$params->getParamString($params->MEMBER_HASH_KEY)
													, $params->getParamString($params->MEMBER_MOBILE)
		);
		array_push($result->query_output_arr,$query_output);

	}else if($params->isYes($params->IS_UPDATE_MEMBER_EMAIL)){

		$query_output = 
		$wdj_mysql_interface->updateMemberEmail(	$params->getParamString($params->MEMBER_HASH_KEY)
													, $params->getParamString($params->MEMBER_EMAIL)
		);
		array_push($result->query_output_arr,$query_output);

	}




	// CLOSE DB
	$wdj_mysql_interface->close();

	// OUTPUT
	$result->debug=$debug;
	echo json_encode($result);
?>

