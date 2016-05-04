<?php

	// /api/v1/action/toast-master/word_n_quote/update.php
	
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





	// OFFICERS

	// GET PARAMS

	// MEETING AGENDA COMMON
	$EVENT_PARAM_EVENT_TYPE = $params->getParamString($params->EVENT_PARAM_EVENT_TYPE);

	$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);

	$ACTION_HASH_KEY = $params->getParamString($params->ACTION_HASH_KEY);
	$ACTION_HASH_KEY_BEFORE = $params->getParamString($params->ACTION_HASH_KEY_BEFORE);
	$ROOT_ACTION_HASH_KEY = $params->getParamString($params->ROOT_ACTION_HASH_KEY);

	$ACTION_NAME = $params->getParamString($params->ACTION_NAME);
	$ACTION_CONTEXT = $params->getParamString($params->ACTION_CONTEXT);
	$ACTION_CONTEXT_OBJ = json_decode($ACTION_CONTEXT);	

	$ACTION_DB_INSERT_MSG = $ACTION_CONTEXT_OBJ->{$params->ACTION_DB_INSERT_MSG};
	$ACTION_DB_UPDATE_MSG = $ACTION_CONTEXT_OBJ->{$params->ACTION_DB_UPDATE_MSG};
	$ACTION_DB_DELETE_MSG = $ACTION_CONTEXT_OBJ->{$params->ACTION_DB_DELETE_MSG};

	// public $WORD="WORD";
	// public $WORD_DESC="WORD_DESC";
	// public $QUOTE="QUOTE";

	$WORD = $params->getParamString($params->WORD, "");
	$WORD_DESC = $params->getParamString($params->WORD_DESC, "");
	$QUOTE = $params->getParamString($params->QUOTE, "");




	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->ACTION_DB_INSERT_MSG = $ACTION_DB_INSERT_MSG;
	$result->ACTION_DB_UPDATE_MSG = $ACTION_DB_UPDATE_MSG;
	$result->ACTION_DB_DELETE_MSG = $ACTION_DB_DELETE_MSG;

	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->ACTION_HASH_KEY_BEFORE = $ACTION_HASH_KEY_BEFORE;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;

	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;	
	$result->ACTION_CONTEXT_OBJ = $ACTION_CONTEXT_OBJ;	

	$result->MEETING_ID = $MEETING_ID;
	$result->WORD = $WORD;
	$result->WORD_DESC = $WORD_DESC;
	$result->QUOTE = $QUOTE;

	











	// CHECK VALIDATION - INIT
	$result->error = "Congrats! No Errors.";
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}

	// MEETING_ID로 $ROOT_ACTION_HASH_KEY를 가져옵니다.
	$ROOT_ACTION_ID = $wdj_mysql_interface->select_recent_action_id_collection_by_meeting_id($MEETING_ID);
	if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $ROOT_ACTION_ID)){
		$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$ROOT_ACTION_ID)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	$root_action_collection = $wdj_mysql_interface->get_root_action_collection($ROOT_ACTION_ID);
	if($wdj_mysql_interface->is_not_action_collection(__FUNCTION__, $root_action_collection)){
		$result->error = "\$wdj_mysql_interface->is_not_action_collection(__FUNCTION__, \$root_action_collection)";
		terminate($wdj_mysql_interface, $result);
		return;
	}
	// CHECK VALIDATION - END


























	if(!empty($WORD) && strcmp($EVENT_PARAM_EVENT_TYPE, $params->IS_UPDATE_WORD_N_QUOTE_WORD_ONLY) == 0) {

		$wdj_mysql_interface->upsertWordOfTheDayWordOnly($MEETING_ID, $WORD);
		$result->PROCESS = $params->IS_UPDATE_WORD_N_QUOTE_WORD_ONLY;

		// ACTION UPDATE
		$action_item_word = 
		$root_action_collection->search_by_context_from_root($params->WORD);
		if(!is_null($action_item_word) && strcmp($action_item_word->get_name(), $WORD) != 0) {

			$action_item_word->set_name($WORD);

			$wdj_mysql_interface->update_action_item(
				// $action_item_id=-1
				$action_item_word->get_id()
				// $action_name=""
				, $action_item_word->get_name()
				// $action_item_context=""
				, $action_item_word->get_context()
			);

		}

		// CHECK
		$word_obj = $wdj_mysql_interface->get_word_of_the_day($MEETING_ID);
		$__word = $word_obj->__word;
		$result->updated_word = $__word;

	} else if(!empty($WORD_DESC) && strcmp($EVENT_PARAM_EVENT_TYPE, $params->IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY) == 0) {

		$wdj_mysql_interface->upsertWordOfTheDayWordDescOnly($MEETING_ID, $WORD_DESC);
		$result->PROCESS = $params->IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY;		

		// ACTION UPDATE
		$action_item_word_desc = 
		$root_action_collection->search_by_context_from_root($params->WORD_DESC);
		if(!is_null($action_item_word_desc) && strcmp($action_item_word_desc->get_name(), $WORD_DESC) != 0) {

			$action_item_word_desc->set_name($WORD_DESC);

			$wdj_mysql_interface->update_action_item(
				// $action_item_id=-1
				$action_item_word_desc->get_id()
				// $action_name=""
				, $action_item_word_desc->get_name()
				// $action_item_context=""
				, $action_item_word_desc->get_context()
			);

		}		

		// CHECK
		$word_obj = $wdj_mysql_interface->get_word_of_the_day($MEETING_ID);
		$__word_desc = $word_obj->__word_desc;
		$result->updated_word_desc = $__word_desc;

	} else if(!empty($QUOTE) && strcmp($EVENT_PARAM_EVENT_TYPE, $params->IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY) == 0) {

		$wdj_mysql_interface->upsertQuoteOfTheDay($MEETING_ID, $QUOTE);
		$result->PROCESS = $params->IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY;

		// ACTION UPDATE
		$action_item_quote = 
		$root_action_collection->search_by_context_from_root($params->QUOTE);
		if(!is_null($action_item_quote) && strcmp($action_item_quote->get_name(), $QUOTE) != 0) {

			$action_item_quote->set_name($QUOTE);

			$wdj_mysql_interface->update_action_item(
				// $action_item_id=-1
				$action_item_quote->get_id()
				// $action_name=""
				, $action_item_quote->get_name()
				// $action_item_context=""
				, $action_item_quote->get_context()
			);

		}

		// CHECK
		$quote_obj = $wdj_mysql_interface->get_quote_of_the_day($MEETING_ID);
		$__quote_content = $quote_obj->__quote_content;
		$result->updated_quote = $__quote_content;

	}


	// FIN
	terminate($wdj_mysql_interface, $result);

?>