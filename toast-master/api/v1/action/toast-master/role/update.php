<?php

	// /api/v1/action/toast-master/role/update.php
	
	// common setting
	include_once("../../../../../common.inc");
	include_once("../../../../../db/toast-master/mysql.interface.toast-master.inc");

	$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
	$result = new stdClass();

	function terminate($wdj_mysql_interface, $result) {
		// CLOSE DB
		$wdj_mysql_interface->close();
		echo json_encode($result);
		return;
	}







	// GET PARAMS

	// dMMMMb  .aMMMb  dMP     dMMMMMP 
	// dMP.dMP dMP"dMP dMP     dMP      
	// dMMMMK" dMP dMP dMP     dMMMP     
	// dMP"AMF dMP.aMP dMP     dMP        
	// dMP dMP  VMMMP" dMMMMMP dMMMMMP     
                                    
	// MEETING AGENDA COMMON
	$MEETING_ID = $params->getParamNumber($params->MEETING_ID);
	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);

	$ACTION_NAME = $params->getParamString($params->ACTION_NAME);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$ACTION_CONTEXT_OBJ = json_decode($ACTION_CONTEXT);
	$ROLE_ID = $ACTION_CONTEXT_OBJ->{$params->ROLE_ID};
	$SELECTED_VALUE = $ACTION_CONTEXT_OBJ->{$params->SELECTED_VALUE};
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	// DEBUG
	$result->MEETING_ID = $MEETING_ID;
	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;

	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;
	$result->ROLE_ID = $ROLE_ID;
	$result->SELECTED_VALUE = $SELECTED_VALUE;
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;
	$result->{$params->ACTION_DB_UPDATE_MSG} = $ACTION_CONTEXT_OBJ->{$params->ACTION_DB_UPDATE_MSG};











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}


	
	if(!empty($ACTION_HASH_KEY)) {

		// 1. Action에서 업데이트하는 경우
		$result->PROCESS = "ACTION UPDATE";

		// 업데이트일 경우에만 허용.
		if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) != 0) {
			$result->error = "strcmp(\$EVENT_PARAM_EVENT_TYPE, \$params->EVENT_TYPE_UPDATE_ITEM) != 0";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		if(empty($ACTION_HASH_KEY)) {
			$result->error = "empty(\$ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ROOT_ACTION_HASH_KEY)) {
			$result->error = "empty(\$ROOT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$action_item_obj = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY
		);

		if($wdj_mysql_interface->is_not_action_item(__FUNCTION__, $action_item_obj)) {
			$result->error = "\$wdj_mysql_interface->is_not_action_item(__FUNCTION__, \$action_item_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$cur_action_item_id = $action_item_obj->get_id();
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $cur_action_item_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$cur_action_item_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$IS_UPDATE_TODAY_ROLE = $action_item_obj->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_TODAY_ROLE);
		if(!$IS_UPDATE_TODAY_ROLE) {
			$result->error = "!\$IS_UPDATE_TODAY_ROLE";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $ROLE_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$ROLE_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		if(empty($SELECTED_VALUE)) {
			$result->error = "empty(\$SELECTED_VALUE)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// 롤을 맡은 횟수를 가져옵니다.
		$membership_id = $wdj_mysql_interface->get_membership_id_by_meeting_id($MEETING_ID);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $membership_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$membership_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$member_id = $wdj_mysql_interface->get_member_id_by_hash_key($SELECTED_VALUE);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $member_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$member_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$member_obj = $wdj_mysql_interface->get_member($member_id);
		if(is_null($member_obj)) {
			$result->error = "is_null(\$member_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$member_name = $member_obj->__member_name;
		if($wdj_mysql_interface->is_empty(__FUNCTION__, $member_name)){
			$result->error = "\$wdj_mysql_interface->is_empty(__FUNCTION__, \$member_name)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// CHECK VALIDATION - END




		




		// UPDATE - INIT
		// 선택된 액션의 내용만 업데이트합니다.
		$wdj_mysql_interface->update_action_item($cur_action_item_id, $ACTION_NAME, $ACTION_CONTEXT);

		// 롤을 업데이트합니다.
		$wdj_mysql_interface->set_meeting_role_by_hash_key($MEETING_ID, $ROLE_ID, $SELECTED_VALUE);
		
		// 롤 맡은 횟수를 가져옵니다.
		$role_total_cnt = $wdj_mysql_interface->get_member_total_role_cnt($membership_id, $ROLE_ID, $member_id);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $role_total_cnt)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$role_total_cnt)";
			terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
			return;
		}

		$result->{$params->ROLE_TOTAL_CNT} = intval($role_total_cnt);
		$new_action_name = $role_total_cnt . " " . $member_name;
		$result->{$params->NEW_ACTION_NAME} = $new_action_name;

		// CHECK - 실제로 DB에서 롤 데이터가 업데이트 되었는지 확인.
		$has_meeting_role = $wdj_mysql_interface->has_meeting_role_by_hash_key($MEETING_ID, $ROLE_ID, $SELECTED_VALUE);
		$result->has_meeting_role = $has_meeting_role;

		$wdj_mysql_interface->update_action_item($cur_action_item_id, $new_action_name, $ACTION_CONTEXT);
		// UPDATE - END	














	} else {

		//_param.YES
		// 2. 모바일의 경우, Action이 아직 적용되지 않았습니다. 모바일 처리
		$result->PROCESS = "MOBILE UPDATE";
		if(strcmp($params->IS_UPDATE_TODAY_ROLE,$EVENT_PARAM_EVENT_TYPE) != 0) {
			$result->error = "strcmp(\$params->IS_UPDATE_TODAY_ROLE,\$EVENT_PARAM_EVENT_TYPE) != 0";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$ROLE_ID = $params->getParamNumber($params->ROLE_ID);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $ROLE_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$ROLE_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$SELECTED_VALUE = $params->getParamString($params->SELECTED_VALUE);
		if(empty($SELECTED_VALUE)) {
			$result->error = "empty(\$SELECTED_VALUE)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// 롤을 맡은 횟수를 가져옵니다.
		$membership_id = $wdj_mysql_interface->get_membership_id_by_meeting_id($MEETING_ID);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $membership_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$membership_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$member_id = $wdj_mysql_interface->get_member_id_by_hash_key($SELECTED_VALUE);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $member_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$member_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$member_obj = $wdj_mysql_interface->get_member($member_id);
		if(is_null($member_obj)) {
			$result->error = "is_null(\$member_obj)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$member_name = $member_obj->__member_name;
		if($wdj_mysql_interface->is_empty(__FUNCTION__, $member_name)){
			$result->error = "\$wdj_mysql_interface->is_empty(__FUNCTION__, \$member_name)";
			terminate($wdj_mysql_interface, $result);
			return;
		}		

		// 롤을 맡은 횟수를 처리하지 않는 이름들을 필터링 합니다.
		// WELCOME
		// NOT
		$is_not_real_member = false;
		if (strpos($member_name, 'WELCOME') !== false) {
		    $is_not_real_member = true;
		} else if (strpos($member_name, 'NOT') !== false) {
		    $is_not_real_member = true;
		}

		// 롤을 업데이트합니다.
		$wdj_mysql_interface->set_meeting_role_by_hash_key($MEETING_ID, $ROLE_ID, $SELECTED_VALUE);

		
		if($is_not_real_member) {

			$new_action_name = $member_name;
			$result->{$params->NEW_ACTION_NAME} = $new_action_name;

		} else {

			// 롤 맡은 횟수를 가져옵니다.
			$role_total_cnt = $wdj_mysql_interface->get_member_total_role_cnt($membership_id, $ROLE_ID, $member_id);
			if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $role_total_cnt)){
				$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$role_total_cnt)";
				terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);
				return;
			}

			$result->{$params->ROLE_TOTAL_CNT} = intval($role_total_cnt);
			$new_action_name = $role_total_cnt . " " . $member_name;
			$result->{$params->NEW_ACTION_NAME} = $new_action_name;

		}
		

		// CHECK - 실제로 DB에서 롤 데이터가 업데이트 되었는지 확인.
		$has_meeting_role = $wdj_mysql_interface->has_meeting_role_by_hash_key($MEETING_ID, $ROLE_ID, $SELECTED_VALUE);
		$result->has_meeting_role = $has_meeting_role;

			
	}
	















	// FIN
	terminate($wdj_mysql_interface, $result);

?>

