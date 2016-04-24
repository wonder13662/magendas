<?php

	// /api/v1/toast-master/news/select.php
	
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





	// OFFICERS

	// GET PARAMS

	// MEETING AGENDA COMMON
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);


	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->MEETING_ID = $MEETING_ID;
	











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END
















	//
	if(strcmp($params->IS_SELECT_NEWS_CNT,$EVENT_PARAM_EVENT_TYPE) == 0 && (0 < $MEETING_ID)) {

		$news_list = $wdj_mysql_interface->get_news_list($MEETING_ID);
		if(is_null($news_list)){
			$result->error = "is_null(\$news_list)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$news_cnt = count($news_list);
		$result->news_cnt = $news_cnt;

	}













	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































