<?php

	// /api/v1/toast-master/speech/update.php
	
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

	$SPEECH_ID = $params->getParamNumber($params->SPEECH_ID, -1);
	$SPEECH_SPEAKER_MEMBER_HASH_KEY = $params->getParamString($params->SPEECH_SPEAKER_MEMBER_HASH_KEY, "");
	$SPEECH_EVALUATOR_MEMBER_HASH_KEY = $params->getParamString($params->SPEECH_EVALUATOR_MEMBER_HASH_KEY, "");
	$SPEECH_PROJECT_ID = $params->getParamNumber($params->SPEECH_PROJECT_ID, -1);
	$SPEECH_TITLE = $params->getParamString($params->SPEECH_TITLE, "");
	$SPEECH_TABLE_ROW_INFO_ARR_JSON_STR = $params->getParamString($params->SPEECH_TABLE_ROW_INFO_ARR_JSON_STR, "");

	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->SPEECH_ID = $SPEECH_ID;
	$result->SPEECH_SPEAKER_MEMBER_HASH_KEY = $SPEECH_SPEAKER_MEMBER_HASH_KEY;
	$result->SPEECH_EVALUATOR_MEMBER_HASH_KEY = $SPEECH_EVALUATOR_MEMBER_HASH_KEY;
	$result->SPEECH_PROJECT_ID = $SPEECH_PROJECT_ID;
	$result->SPEECH_TITLE = $SPEECH_TITLE;
	$result->SPEECH_TABLE_ROW_INFO_ARR_JSON_STR = $SPEECH_TABLE_ROW_INFO_ARR_JSON_STR;













	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if(strcmp($params->IS_UPDATE_SPEECH, $EVENT_PARAM_EVENT_TYPE) != 0) {
		$result->error = "strcmp(\$params->IS_UPDATE_SPEECH, \$EVENT_PARAM_EVENT_TYPE) != 0";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $SPEECH_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$SPEECH_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	$SPEAKER_MEMBER_ID = -1;
	if(!empty($SPEECH_SPEAKER_MEMBER_HASH_KEY)) {
		$SPEAKER_MEMBER_ID = $wdj_mysql_interface->get_member_id_by_hash_key($SPEECH_SPEAKER_MEMBER_HASH_KEY);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $SPEAKER_MEMBER_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$SPEAKER_MEMBER_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
	}
	$EVALUATOR_MEMBER_ID = -1;
	if(!empty($SPEECH_EVALUATOR_MEMBER_HASH_KEY)) {
		$EVALUATOR_MEMBER_ID = $wdj_mysql_interface->get_member_id_by_hash_key($SPEECH_EVALUATOR_MEMBER_HASH_KEY);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $EVALUATOR_MEMBER_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$EVALUATOR_MEMBER_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
	}
	$speech_obj = $wdj_mysql_interface->sel_speech($SPEECH_ID);
	if(is_null($speech_obj)) {
		$result->error = "is_null(\$speech_obj)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	$result->speech_obj = $speech_obj;
	// CHECK VALIDATION - END










	if(0 < $SPEAKER_MEMBER_ID) {
		// UPDATE SPEECH SPEAKER

		$__speaker_member_id = intval($speech_obj->__speaker_member_id);

		$is_changed = false;
		if($__speaker_member_id != $SPEAKER_MEMBER_ID) {
			$is_changed = true;
		}

		if($is_changed) {

			$wdj_mysql_interface->set_speech_speaker($SPEECH_ID, $SPEAKER_MEMBER_ID);

			// CHECK
			$speech_obj = $wdj_mysql_interface->sel_speech($SPEECH_ID);

			$updated_speaker_member_id = $speech_obj->__speaker_member_id;
			$result->updated_speaker_member_id = $updated_speaker_member_id;

			$updated_speaker_member_hash_key = $speech_obj->__speaker_member_hash_key;
			$result->updated_speaker_member_hash_key = $updated_speaker_member_hash_key;

		}

	} else if(0 < $EVALUATOR_MEMBER_ID) {
		// UPDATE SPEECH EVALUATOR

		$__evaluator_member_id = intval($speech_obj->__evaluator_member_id);

		$is_changed = false;
		if($__evaluator_member_id != $EVALUATOR_MEMBER_ID) {
			$is_changed = true;
		}

		if($is_changed) {

			$wdj_mysql_interface->set_speech_evaluator($SPEECH_ID, $EVALUATOR_MEMBER_ID);

			// CHECK
			$speech_obj = $wdj_mysql_interface->sel_speech($SPEECH_ID);

			$updated_evaluator_member_id = $speech_obj->__evaluator_member_id;
			$result->updated_evaluator_member_id = $updated_evaluator_member_id;

			$updated_evaluator_member_hash_key = $speech_obj->__evaluator_member_hash_key;
			$result->updated_evaluator_member_hash_key = $updated_evaluator_member_hash_key;

		}

	} else if(0 < $SPEECH_PROJECT_ID) {
		// UPDATE SPEECH PROJECT

		$__speech_project_id = intval($speech_obj->__speech_project_id);
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $__speech_project_id)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$__speech_project_id)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$is_changed = false;
		if($__speech_project_id != $SPEECH_PROJECT_ID) {
			$is_changed = true;
		}

		if($is_changed) {
			$wdj_mysql_interface->update_speech_project($SPEECH_ID, $SPEECH_PROJECT_ID);

			// CHECK
			$speech_obj = $wdj_mysql_interface->sel_speech($SPEECH_ID);

			$updated_speech_project_id = $speech_obj->__speech_project_id;
			$result->updated_speech_project_id = $updated_speech_project_id;

			$updated_speech_project_title = $speech_obj->__speech_project_title;
			$result->updated_speech_project_title = $updated_speech_project_title;

		}

	} else if(!empty($SPEECH_TITLE)) {
		// UPDATE SPEECH TITLE

		$__title = $speech_obj->__title;
		if(empty($__title)) {
			$result->error = "empty(\$__title)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$is_changed = false;
		if(strcmp($__title, $SPEECH_TITLE) != 0) {
			$is_changed = true;
		}
		if($is_changed) {
			$wdj_mysql_interface->update_speech_title($SPEECH_ID, $SPEECH_TITLE);

			// CHECK
			$speech_obj = $wdj_mysql_interface->sel_speech($SPEECH_ID);

			$updated_title = $speech_obj->__title;
			$result->updated_title = $updated_title;
		}

	} else if(!empty($SPEECH_TABLE_ROW_INFO_ARR_JSON_STR)) {
		// UPDATE SPEECH ORDER



	}






	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































