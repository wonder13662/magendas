<?php

	// /api/v1/toast-master/meeting_agenda/update.php
	
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





	// MEETING AGENDA
	// GET PARAMS
	// MEETING AGENDA COMMON
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);
	$THEME = $params->getParamString($params->THEME, "");
	$START_DATE = $params->getParamString($params->START_DATE, "");


	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->MEETING_ID = $MEETING_ID;
	$result->THEME = $THEME;
	$result->START_DATE = $START_DATE;

	











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if(strcmp($params->IS_UPDATE_HEADER, $EVENT_PARAM_EVENT_TYPE) != 0) {
		$result->error = "strcmp(\$params->IS_UPDATE_HEADER, \$EVENT_PARAM_EVENT_TYPE) != 0";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END














	if(!empty($THEME) && !empty($START_DATE)) {

		$start_dttm = date("YmdHis", strtotime($START_DATE));
		$wdj_mysql_interface->updateMeetingAgenda($MEETING_ID, $THEME, $start_dttm);

		// CHECK
		$meeting_agenda_obj = $wdj_mysql_interface->get_meeting_agenda_by_id($MEETING_ID);

		$updated_theme = $meeting_agenda_obj->__theme;
		$result->updated_theme = $updated_theme;

		$updated_startdttm = $meeting_agenda_obj->__startdttm;
		$result->updated_startdttm = $updated_startdttm;

	} else if(!empty($THEME)) {

		$wdj_mysql_interface->updateMeetingAgendaTheme($MEETING_ID, $THEME);

		// CHECK
		$meeting_agenda_obj = $wdj_mysql_interface->get_meeting_agenda_by_id($MEETING_ID);

		$updated_theme = $meeting_agenda_obj->__theme;
		$result->updated_theme = $updated_theme;

	} else if(!empty($START_DATE)) {

		$start_dttm = date("YmdHis", strtotime($START_DATE));
		$wdj_mysql_interface->updateMeetingAgendaStartDttm($MEETING_ID, $start_dttm);

		// CHECK
		$meeting_agenda_obj = $wdj_mysql_interface->get_meeting_agenda_by_id($MEETING_ID);

		$updated_startdttm = $meeting_agenda_obj->__startdttm;
		$result->updated_startdttm = $updated_startdttm;

	}














	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































