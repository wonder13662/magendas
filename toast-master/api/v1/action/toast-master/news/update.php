<?php

	// /api/v1/action/toast-master/news/update.php
	
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

	$NEWS_ID = $ACTION_CONTEXT_OBJ->{$params->NEWS_ID};
	$NEWS_CONTENTS = $params->getParamString($params->ACTION_NAME, "");




	// DEBUG
	$result->EVENT_PARAM_EVENT_TYPE = $EVENT_PARAM_EVENT_TYPE;

	$result->ACTION_DB_INSERT_MSG = $params->$ACTION_DB_INSERT_MSG;
	$result->ACTION_DB_UPDATE_MSG = $params->$ACTION_DB_UPDATE_MSG;
	$result->ACTION_DB_DELETE_MSG = $params->$ACTION_DB_DELETE_MSG;

	$result->ACTION_HASH_KEY = $ACTION_HASH_KEY;
	$result->ACTION_HASH_KEY_BEFORE = $ACTION_HASH_KEY_BEFORE;
	$result->ROOT_ACTION_HASH_KEY = $ROOT_ACTION_HASH_KEY;

	$result->ACTION_NAME = $ACTION_NAME;
	$result->ACTION_CONTEXT = $ACTION_CONTEXT;	
	$result->ACTION_CONTEXT_OBJ = $ACTION_CONTEXT_OBJ;	

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














	if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_INSERT_ITEM) == 0) {

		// CHECK PARAM
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $MEETING_ID)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$MEETING_ID)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$result->PROCESS = $params->IS_INSERT_NEWS;
		$wdj_mysql_interface->insertNews_V2($MEETING_ID, "", $params->NEWS_CONTENTS_DEFAULT);

		// CHECK
		$cur_latest_news = $wdj_mysql_interface->get_latest_news($MEETING_ID);
		$result->INSERTED_NEWS = $cur_latest_news;
		$result->INSERTED_NEWS_ID = $NEWS_ID = $cur_latest_news->__news_id;

		$news_list = $wdj_mysql_interface->get_news_list($MEETING_ID);
		if(is_null($news_list)){
			$result->error = "is_null(\$news_list)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$news_cnt = count($news_list);
		$result->news_cnt = $news_cnt;








		if(empty($ACTION_HASH_KEY_BEFORE)) {
			$result->error = "empty(\$ACTION_HASH_KEY_BEFORE)";
			terminate($wdj_mysql_interface, $result);
			return;
		}
		if(empty($ROOT_ACTION_HASH_KEY)) {
			$result->error = "empty(\$ROOT_ACTION_HASH_KEY)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// 자신의 위 형제 action obj를 가져옵니다.
		$action_item_obj_before = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY_BEFORE
		);

		if($wdj_mysql_interface->is_not_action_item(__FUNCTION__, $action_item_obj_before)) {
			$result->error = "\$wdj_mysql_interface->is_not_action_item(__FUNCTION__, \$action_item_obj_before)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		$cur_action_item_id_before = $action_item_obj_before->get_id();
		if($wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, $cur_action_item_id_before)){
			$result->error = "\$wdj_mysql_interface->is_not_unsigned_number(__FUNCTION__, \$cur_action_item_id_before)";
			terminate($wdj_mysql_interface, $result);
			return;
		}

		// 새로운 아이템 추가 - TABLE
		$cur_table_row_field_action_item_list_after = 
		$wdj_mysql_interface->add_row_into_table(
			// $table_field_action_item_obj=null
			$action_item_obj_before
			// $action_name=""
			, $params->NEWS_CONTENTS_DEFAULT
			// $action_context=""
			, ""
		);


		// DEBUG
		$TABLE_FIELD_ACTION_ITEM_LIST_STD = array();
		for($idx = 0;$idx < count($cur_table_row_field_action_item_list_after); $idx++) {
			$cur_action_item_copy = $cur_table_row_field_action_item_list_after[$idx];
			
			// UPDATE CONTEXT
			$cur_action_item_copy->set_context_attr($params->NEWS_ID, $NEWS_ID);
			$cur_action_item_copy->set_context_attr($params->MEETING_ID, $MEETING_ID);

			if(	$cur_action_item_copy->has_context_attr($params->ACTION_DB_UPDATE_MSG, $params->IS_UPDATE_NEWS) ){
				$cur_action_item_copy->set_name($params->NEWS_CONTENTS_DEFAULT);
			} // end if

			$wdj_mysql_interface->update_action_item(
				$cur_action_item_copy->get_id()
				, $cur_action_item_copy->get_name()
				, $cur_action_item_copy->get_context()
			);

			$cur_action_item_copy_std = $cur_action_item_copy->get_std_obj();
			array_push($TABLE_FIELD_ACTION_ITEM_LIST_STD, $cur_action_item_copy_std);
		}
		$result->TABLE_FIELD_ACTION_ITEM_LIST_STD = $TABLE_FIELD_ACTION_ITEM_LIST_STD;



		// DEBUG / 업데이트된 root_action_list를 가져옵니다.
		$root_action_collection_updated = $wdj_mysql_interface->get_action_collection_by_hash_key($ROOT_ACTION_HASH_KEY);
		if($wdj_mysql_interface->is_not_action_collection(__FUNCTION__, $root_action_collection_updated, "root_action_collection_updated")) {
			return;
		}
		$result->root_action_collection_updated = $root_action_collection_updated->get_std_obj();






















		//ACTION_DB_UPDATE_MSG

	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_UPDATE_ITEM) == 0) {

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









		// UPDATE ACTION
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

		// 자신의 action obj를 가져옵니다.
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

		$action_item_obj->set_name($NEWS_CONTENTS);
		$wdj_mysql_interface->update_action_item(
			$action_item_obj->get_id()
			, $action_item_obj->get_name()
			, $action_item_obj->get_context()
		);

		// CHECK
		$action_item_obj_updated = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY
		);
		$result->action_item_obj_updated = $action_item_obj_updated->get_std_obj();





















	} else if(strcmp($EVENT_PARAM_EVENT_TYPE, $params->EVENT_TYPE_DELETE_ITEM) == 0) {

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

		// 자신의 action obj를 가져옵니다.
		$action_item_obj_delete = 
		$wdj_mysql_interface->get_action_item_obj_with_relation(
			// $root_action_hash_key=""
			$ROOT_ACTION_HASH_KEY
			// $action_item_hash_key=""
			, $ACTION_HASH_KEY
		);

		if($action_item_obj_delete->is_table_field_item()) {
			// 실제 DB의 데이터도 제거 - TABLE
			$cur_table_row_field_action_item_list_delete = $action_item_obj_delete->get_table_row_field_action_item_list();

			for($idx = 0;$idx < count($cur_table_row_field_action_item_list_delete); $idx++) {
				$cur_action_item_delete = $cur_table_row_field_action_item_list_delete[$idx];
				$wdj_mysql_interface->delete_action_item_relation($cur_action_item_delete);
			}

			$result->TABLE_FIELD_ACTION_ITEM_LIST_STD = $TABLE_FIELD_ACTION_ITEM_LIST_STD;

		} else {
			// 실제 DB의 데이터도 제거 - LIST	
			$wdj_mysql_interface->delete_action_item_relation($action_item_obj_delete);

		}

	}













	// FIN
	terminate($wdj_mysql_interface, $result);

?>





































