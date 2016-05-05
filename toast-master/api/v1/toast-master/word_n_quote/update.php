<?php

	// /api/v1/toast-master/word_n_quote/update.php
	
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





	// WORD N QUOTE

	// public $WORD="WORD";
	// public $WORD_DESC="WORD_DESC";
	// public $QUOTE="QUOTE";


	// GET PARAMS

	// MEETING AGENDA COMMON
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);
	$NEWS_CONTENTS = $params->getParamString($params->NEWS_CONTENTS, "");




	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->MEETING_ID = $MEETING_ID;
	$result->NEWS_ID = $NEWS_ID;
	$result->NEWS_CONTENTS = $NEWS_CONTENTS;
	











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END














	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->IS_INSERT_NEWS) == 0) {

		// CHECK PARAM
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($NEWS_CONTENTS)) {
			$result->error = "empty(\$NEWS_CONTENTS)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$result->PROCESS = $params->IS_INSERT_NEWS;
		$wdj_mysql_interface->insertNews_V2($MEETING_ID, "", $NEWS_CONTENTS);

		// CHECK
		$cur_latest_news = $wdj_mysql_interface->get_latest_news($MEETING_ID);
		$result->INSERTED_NEWS = $cur_latest_news;


		$news_list = $wdj_mysql_interface->get_news_list($MEETING_ID);
		if(is_null($news_list)){
			$result->error = "is_null(\$news_list)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$news_cnt = count($news_list);
		$result->news_cnt = $news_cnt;

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->IS_UPDATE_NEWS) == 0) {

		// CHECK PARAM
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $NEWS_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$NEWS_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($NEWS_CONTENTS)) {
			$result->error = "empty(\$NEWS_CONTENTS)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$result->PROCESS = $params->IS_UPDATE_NEWS;
		$wdj_mysql_interface->updateNewsByNewsId_V2(
			// $meeting_agenda_id
			$MEETING_ID
			// $news_id
			, $NEWS_ID
			// $news_title=""
			, ""
			// $news_content=""
			, $NEWS_CONTENTS
			// $order_num=-1
		);

		// CHECK
		$cur_latest_news = $wdj_mysql_interface->get_news($MEETING_ID, $NEWS_ID);
		$result->UPDATED_NEWS = $cur_latest_news;

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->IS_DELETE_NEWS) == 0) {

		// CHECK PARAM
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $NEWS_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$NEWS_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}


		$result->PROCESS = $params->IS_DELETE_NEWS;
		$query_output = $wdj_mysql_interface->deleteNewsByNewsId($NEWS_ID);

		// CHECK
		$cur_deleted_news = $wdj_mysql_interface->get_news($MEETING_ID, $NEWS_ID);
		$result->UPDATED_NEWS = $cur_deleted_news;

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





































