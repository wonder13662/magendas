<?php

// common setting
include_once("../common.inc");

// @ optional - result
$result = new stdClass();
$result->query_output_arr = array();
$debug = "";

// GET PARAMS
// LOG IN

$member_mobile = $params->getParamString($params->MEMBER_MOBILE);
$member_password = $params->getParamString($params->MEMBER_PASSWORD);
$meeting_membership_id = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID);

array_push($result->query_output_arr,"\$member_mobile :: $member_mobile");
array_push($result->query_output_arr,"\$member_password :: $member_password");
array_push($result->query_output_arr,"\$meeting_membership_id :: $meeting_membership_id");

$member_info_list;
$member_info=null;
if(!empty($member_mobile) && !empty($member_password)){
	array_push($result->query_output_arr,"001");
	$member_info_list = $wdj_mysql_interface->getMemberLogIn($member_mobile, $member_password, $meeting_membership_id);
	array_push($result->query_output_arr,json_encode($member_info_list));
}
if(!empty($member_info_list)){

	array_push($result->query_output_arr,"002");

	$member_info=$member_info_list[0];
	array_push($result->query_output_arr,json_encode($member_info));

	// 멤버가 가입한 모든 클럽의 정보를 가져옵니다.
	$membership_arr;
	if(!is_null($member_info) && (0 < $member_info->__member_id)) {
		$membership_arr = $wdj_mysql_interface->getMemberMembership($member_info->__member_id);
		array_push($result->query_output_arr,json_encode($membership_arr));
	}
	
}

// 로그인에 실패한 유저라면 여기에서 중단.
if(is_null($member_info)) {
	$result->member_info = $member_info;
	$result->debug=$debug;
	echo json_encode($result);
	return;
}

// 2-2. 회원의 상태를 확인한다.
$is_active_member = (ToastMasterLogInManager::$USER_STATUS_NOT_AVAILABLE == $member_info->__member_membership_status);
if(!$is_active_member){
	// 2-2-1. 비활성 회원이라면 회원 상태를 활성(A)로 변환한다.
	$output = 
	$wdj_mysql_interface->updateMemberStatus(
		$member_info_obj->__member_id
		,$member_info_obj->__member_membership_status
		,ToastMasterLogInManager::$USER_STATUS_AVAILABLE
	);
	array_push($result->query_output_arr,json_encode($output));
}

// @ required - CLOSE DB
$wdj_mysql_interface->close();

// OUTPUT
$result->member_info = $member_info;
$result->debug=$debug;
echo json_encode($result);

?>