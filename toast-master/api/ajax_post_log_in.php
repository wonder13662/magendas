<?php

// common setting
include_once("../common.inc");

// @ optional - result
$result = new stdClass();
$result->query_output_arr = array();
$debug = "";

// GET PARAMS
// LOG IN

$member_email = $params->getParamString($params->MEMBER_EMAIL);
$member_mobile = $params->getParamString($params->MEMBER_MOBILE);
$member_password = $params->getParamString($params->MEMBER_PASSWORD);
$meeting_membership_id = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID);

$member_info_list;
$member_info=null;
if(!empty($member_mobile) && !empty($member_password)){

	$member_info_list = $wdj_mysql_interface->getMemberLogInByMobile($member_mobile, $member_password);

} else if(!empty($member_email) && !empty($member_password)){

	$member_info_list = $wdj_mysql_interface->getMemberLogInByEmail($member_email, $member_password);

}
if(!empty($member_info_list)){

	$member_info=$member_info_list[0];

	// 멤버가 가입한 모든 클럽의 정보를 가져옵니다.
	$membership_arr;
	if(!is_null($member_info) && (0 < $member_info->__member_id)) {
		$membership_arr = $wdj_mysql_interface->getMemberMembership($member_info->__member_hash_key);
		$result->member_membership_arr = $membership_arr;
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
}

// @ required - CLOSE DB
$wdj_mysql_interface->close();

// OUTPUT
$result->member_info = $member_info;
$result->debug=$debug;
echo json_encode($result);

?>