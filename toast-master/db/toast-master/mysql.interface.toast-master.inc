<?php

class MYSQLInterface{

	// cafe24의 mysql DB가 innoDB를 지원하지 않습니다.
	// 트랜잭션 사용이 불가능합니다.

	private $mysql_manager=null;

	public function MYSQLInterface($new_mysql_manager){
		$this->mysql_manager = $new_mysql_manager;
	}

	public function close(){
		$this->mysql_manager->closeConnection();
	}

	private function getSelectResult($query){

		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_SELECT, $json_res_obj);

		return $json_res_obj;	
	}

	private function getSelectOneResult($query){

		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_SELECT, $json_res_obj);

		$result_list = $json_res_obj->result;
		if(!empty($result_list)) {
			$result_one = $result_list[0];
			return $result_one;
		}

		return $json_res_obj;	
	}


	private function getModifyResult($query){

		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_MODIFY, $json_res_obj);

		return $json_res_obj;
	}

	private function getSimpleResult($json_res_obj) {

		$result = new stdClass();
		$result->output = $json_res_obj->result;
		$result->query = $json_res_obj->query;
		$result->message = $json_res_obj->message;

		return $result;
	}

	private function isNotNumber($target){
		return !$this->isNumber($target);
	}
	private function isNumber($target){
		if(	is_null($target) || 
			!is_numeric($target)){
			return false;
		}

		return true;
	}

	private function isNotUnsignedNumber($target){
		return !$this->isUnsignedNumber($target);
	}
	private function isUnsignedNumber($target){
		if(	is_null($target) || 
			!is_numeric($target) ||
			($target < 0)){
			return false;
		}

		return true;
	}
	private function isNotValidArray($target){
		return !$this->isValidArray($target);
	}
	private function isValidArray($target){
		if( is_null($target) || count($target) < 1 ) return false;
		return true;
	}
	public function closeNReload($param_string=""){

		// close db connection
		$this->close();

		// form 객체 전송인 경우, 업데이트 이후 페이지를 리로딩해준다.
		$self_url = $_SERVER['PHP_SELF'];
		if(!empty($param_string)){
			$self_url .= $param_string; // Sample : "?meeting_id=$meeting_id"
		}

		if (headers_sent()) {
		    die("Redirect failed. Please click on view render");
		} else {
		    exit(header("Location: ".$self_url));
		}
	}

	public function getMeetingAgenda($membership_id, $meeting_agenda_id=null,$need_latest_one=null,$page=1,$size=50){

		$function_name = "getMeetingAgenda";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}

		$offset = ($page - 1)*$size;
		$rownum = $size;

		// @required __${column_name}
		$query = 
		"SELECT MA.id AS __meeting_id"
		. " , MA.round AS __round"
		. " , MA.theme AS __theme"
		. " , MA.startdttm AS __startdttm"
		. " , DATE_FORMAT(MA.startdttm, '%Y-%m-%d') AS __startdate"		
		. " , MA.membership_id AS __membership_id"
		. " , MEMBERSHIP.name AS __membership_name"
		. " , MEMBERSHIP.desc AS __membership_desc"
		. " , IFNULL(QUOTE.content,\"\") AS __quote"
		. " , IFNULL(WORD.word,\"\") AS __word"
		. " , IFNULL(WORD.desc,\"\") AS __word_desc"
		. " FROM MEETING_AGENDA AS MA"
		. " LEFT JOIN MA_QUOTE_OF_THE_DAY AS QUOTE ON QUOTE.meeting_agenda_id=MA.id"
		. " LEFT JOIN MA_WORD_OF_THE_DAY AS WORD ON WORD.meeting_agenda_id=MA.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
		;

		if(is_numeric($meeting_agenda_id) && $meeting_agenda_id > 0) {
			$query .= 
			" WHERE MA.id=" . $meeting_agenda_id
			. " AND MA.`status`=\"A\""
			. " AND MA.membership_id=$membership_id"
			;
		} else if (!empty($need_latest_one) && $need_latest_one == "YES") {	
			$query .= 
			" WHERE MA.`status`=\"A\""
			. " AND MA.membership_id=$membership_id"
			. " AND MA.startdttm > DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 day), '%Y%m%d%H%i%s')"
			. " ORDER BY MA.startdttm DESC LIMIT 1"
			;
		} else {
			$query .= 
			" WHERE MA.`status`=\"A\""
			. " AND MA.membership_id=$membership_id"
			. " ORDER BY MA.startdttm DESC LIMIT " . $offset . "," . $rownum;
			;
		}



		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMeetingAgendaList($meeting_membership_id=-1,$page=1,$size=50){

		$function_name = "getMeetingAgendaList";
		if($this->isNotUnsignedNumber($meeting_membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_membership_id)<br/>";
			return;
		}

		$offset = ($page - 1)*$size;
		$rownum = $size;

		$query = 
		"SELECT MA.id AS __meeting_id"
		. " , MA.round AS __round"
		. " , MA.theme AS __theme"
		. " , MA.startdttm AS __startdttm"
		. " , DATE_FORMAT(MA.startdttm, '%Y-%m-%d') AS __startdate"
		. " , MA.membership_id AS __membership_id"
		. " , MEMBERSHIP.name AS __membership_name"
		. " , MEMBERSHIP.desc AS __membership_desc"
		. " , IFNULL(QUOTE.content,\"\") AS __quote"
		. " , IFNULL(WORD.word,\"\") AS __word"
		. " , IFNULL(WORD.desc,\"\") AS __word_desc"
		. " FROM MEETING_AGENDA AS MA"
		. " LEFT JOIN MA_QUOTE_OF_THE_DAY AS QUOTE ON QUOTE.meeting_agenda_id=MA.id"
		. " LEFT JOIN MA_WORD_OF_THE_DAY AS WORD ON WORD.meeting_agenda_id=MA.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
		. " WHERE MA.membership_id=" . $meeting_membership_id
		. " AND MA.`status`=\"A\""
		. " ORDER BY MA.startdttm DESC LIMIT " . $offset . "," . $rownum;
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	

	/*
		@ Desc : 
	*/
	public function getMeetingAgendaListUpcoming($meeting_membership_id=-1,$page=1,$size=50,$is_sooner_first=false){

		$function_name = "getMeetingAgendaList";
		if($this->isNotUnsignedNumber($meeting_membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_membership_id)<br/>";
			return;
		}

		$offset = ($page - 1)*$size;
		$rownum = $size;

		$query = 
		"SELECT MA.id AS __meeting_id"
		. " , MA.round AS __round"
		. " , MA.theme AS __theme"
		. " , MA.startdttm AS __startdttm"
		. " , DATE_FORMAT(MA.startdttm, '%Y-%m-%d') AS __startdate"
		. " , MA.membership_id AS __membership_id"
		. " , MEMBERSHIP.name AS __membership_name"
		. " , MEMBERSHIP.desc AS __membership_desc"
		. " , IFNULL(QUOTE.content,\"\") AS __quote"
		. " , IFNULL(WORD.word,\"\") AS __word"
		. " , IFNULL(WORD.desc,\"\") AS __word_desc"
		. " FROM MEETING_AGENDA AS MA"
		. " LEFT JOIN MA_QUOTE_OF_THE_DAY AS QUOTE ON QUOTE.meeting_agenda_id=MA.id"
		. " LEFT JOIN MA_WORD_OF_THE_DAY AS WORD ON WORD.meeting_agenda_id=MA.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
		. " WHERE MA.membership_id=" . $meeting_membership_id
		. " AND MA.`status`=\"A\""
		. " AND NOW() < MA.startdttm"
		;

		if($is_sooner_first == true) {
			$query .= ""
			. " ORDER BY MA.startdttm ASC LIMIT " . $offset . "," . $rownum;
			;
		} else {
			$query .= ""
			. " ORDER BY MA.startdttm DESC LIMIT " . $offset . "," . $rownum;
			;
		}

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}		

	public function getMeetingAgendaByRound($meeting_round, $startdttm, $meeting_membership_id=1){

		$query = 
		"SELECT MA.id AS __meeting_id"
		. " , MA.round AS __round"
		. " , MA.theme AS __theme"
		. " , MA.startdttm AS __startdttm"
		. " , MA.membership_id AS __membership_id"
		. " , MEMBERSHIP.name AS __membership_name"
		. " , MEMBERSHIP.desc AS __membership_desc"
		. " , IFNULL(QUOTE.content,\"\") AS __quote"
		. " , IFNULL(WORD.word,\"\") AS __word"
		. " , IFNULL(WORD.desc,\"\") AS __word_desc"
		. " FROM MEETING_AGENDA AS MA"
		. " LEFT JOIN MA_QUOTE_OF_THE_DAY AS QUOTE ON QUOTE.meeting_agenda_id=MA.id"
		. " LEFT JOIN MA_WORD_OF_THE_DAY AS WORD ON WORD.meeting_agenda_id=MA.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
		. " WHERE MA.membership_id=" . $meeting_membership_id
		. " AND MA.round=" . $meeting_round
		. " AND MA.startdttm=" . $startdttm
		. " AND MA.`status`=\"A\""
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMeetingAgendaById($meeting_membership_id, $meeting_id){

		if($this->isNotUnsignedNumber($meeting_membership_id)) return null;
		if($this->isNotUnsignedNumber($meeting_id)) return null;

		$query = 
		"SELECT MA.id AS __meeting_id"
		. " , MA.round AS __round"
		. " , MA.theme AS __theme"
		. " , MA.startdttm AS __startdttm"
		. " , MA.membership_id AS __membership_id"
		. " , MEMBERSHIP.name AS __membership_name"
		. " , MEMBERSHIP.desc AS __membership_desc"
		. " , IFNULL(QUOTE.content,\"\") AS __quote"
		. " , IFNULL(WORD.word,\"\") AS __word"
		. " , IFNULL(WORD.desc,\"\") AS __word_desc"
		. " FROM MEETING_AGENDA AS MA"
		. " LEFT JOIN MA_QUOTE_OF_THE_DAY AS QUOTE ON QUOTE.meeting_agenda_id=MA.id"
		. " LEFT JOIN MA_WORD_OF_THE_DAY AS WORD ON WORD.meeting_agenda_id=MA.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
		. " WHERE MA.id=$meeting_id"
		. " AND MA.membership_id=$meeting_membership_id"
		. " AND MA.`status`=\"A\""
		;

		//echo "$query<br/>";

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getLatestMeetingAgendaId($meetingship_id=-1){

		if($this->isNotUnsignedNumber($meetingship_id)) return null;

		// $offset = ($page - 1)*$size;
		// $rownum = $size;

		$query = 
		"SELECT MA.id AS __meeting_id"
		. " FROM MEETING_AGENDA AS MA"
		. " WHERE MA.membership_id=$meetingship_id"
		. " AND MA.`status`=\"A\""
		. " ORDER BY MA.startdttm DESC"
		. " LIMIT 1"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	

	public function insertFisrtMeetingAgenda($meeting_membership_id){

		if(	$this->isNotUnsignedNumber($meeting_membership_id) ){
			echo "<br/>insertFisrtMeetingAgenda\t\$this->isNotUnsignedNumber(\$meeting_membership_id)";
			return;
		}

		// 최초의 미팅을 생성합니다.
		// 이전에 생성한 미팅이 있다면 중단합니다.
		$all_meeting_agenda_list = $this->getMeetingAgendaList($meeting_membership_id);
		if(!empty($all_meeting_agenda_list)) {
			return;
		}

		// 미팅 일자는 오늘로부터 2일뒤로 설정됩니다.
		$today = date("Y-m-d");
		$two_days_after = date('Y-m-d', strtotime('2 days', strtotime($today)));

		$new_start_datetime = new DateTime($two_days_after);
		$new_startdttm = $new_start_datetime->format("YmdHis");

		$new_round = 1;
		$theme = "First Meeting";

		$query_output = $this->insertMeetingAgenda($new_round, $theme, $new_startdttm, $meeting_membership_id);

		// 기본 타임라인 정보를 추가합니다.
		$new_meeting_agenda_obj = $this->getMeetingAgendaByRound($new_round, $new_startdttm, $meeting_membership_id);
		$MEETING_TEMPLATE_ID_BASIC = 1;
		$query_output = $this->copyTimelineFromTemplate(
			// $new_meeting_agenda_id
			$new_meeting_agenda_obj[0]->__meeting_id
			// $meeting_template_id
			, $MEETING_TEMPLATE_ID_BASIC
		);

	}

	public function insertMeetingAgenda($round, $theme, $start_dttm, $meeting_membership_id=-1){
		if($this->isNotUnsignedNumber($round) || empty($theme) || empty($start_dttm) || $meeting_membership_id < 0) return null;

		$theme_safe = addslashes($theme);

		$query =
		"INSERT INTO `MEETING_AGENDA`(`status`, `round`, `theme`, `membership_id`, `startdttm`, `updttm`, `regdttm`)"
		. " VALUES (\"A\", $round,\"$theme_safe\",$meeting_membership_id,\"$start_dttm\",DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateMeetingAgenda($meeting_id, $round, $theme, $start_dttm, $meeting_membership_id=1){

		if($this->isNotUnsignedNumber($meeting_id) || $this->isNotUnsignedNumber($round) || empty($theme) || empty($start_dttm)) return null;

		$theme_safe = addslashes($theme);

		$query =
		"UPDATE `MEETING_AGENDA`"
		. " SET `round`=$round,`theme`=\"$theme_safe\",`startdttm`=\"$start_dttm\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE id=$meeting_id"
		. " AND membership_id=$meeting_membership_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateMeetingAgendaRound($meeting_id, $round){

		if($this->isNotUnsignedNumber($meeting_id) || $this->isNotUnsignedNumber($round)) return null;

		$query =
		"UPDATE `MEETING_AGENDA`"
		. " SET `round`=$round,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE id=$meeting_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	public function updateMeetingAgendaTheme($meeting_id, $theme){

		if($this->isNotUnsignedNumber($meeting_id) || empty($theme)) return null;

		$theme_safe = addslashes($theme);

		$query =
		"UPDATE `MEETING_AGENDA`"
		. " SET `theme`=\"$theme_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE id=$meeting_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	public function updateMeetingAgendaStartDttm($meeting_id, $start_dttm){

		if($this->isNotUnsignedNumber($meeting_id) || empty($start_dttm)) return null;

		$query =
		"UPDATE `MEETING_AGENDA`"
		. " SET `startdttm`=\"$start_dttm\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE id=$meeting_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function hideMeetingAgenda($meeting_id){
		if($this->isNotUnsignedNumber($meeting_id)) return null;

		$query =
		"UPDATE `MEETING_AGENDA`"
		. " SET `status`=\"N\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE id=$meeting_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}

	private function deleteMeetingAgenda($meeting_id){
		$query = 
		"DELETE FROM MEETING_AGENDA AS MA"
		. " WHERE id=$meeting_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}

	public function getMeetingAgendaTemplate($meeting_template_id) {

		$query =
		"SELECT `id` AS __template_id"
		. " , `title` AS __template_title"
		. " , `schedule_json_str` AS __template_schedule_json_str"
		. " , `order` AS __template_order"
		. " FROM `MA_TIMELINE_TEMPLATE`"
		. " WHERE id=$meeting_template_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;

	}

	public function getWordOfTheDay($meeting_id){

		$query =
		"SELECT `id` AS __word_id"
		. " , `meeting_agenda_id` AS __meeting_agenda_id"
		. " , `word` AS __word"
		. " , `desc` AS __word_desc"
		. " , `updttm` AS __word_updttm"
		. " , `regdttm` AS __word_regdttm"
		. " FROM `MA_WORD_OF_THE_DAY`"
		. " WHERE meeting_agenda_id=$meeting_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	private function deleteWordOfTheDay($meeting_agenda_id){
		$query =
		"DELETE FROM `MA_WORD_OF_THE_DAY` WHERE $meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateWordOfTheDay($meeting_agenda_id, $word, $word_desc){

		$word_safe = addslashes($word);
		$word_desc_safe = addslashes($word_desc);

		$query =
		"UPDATE `MA_WORD_OF_THE_DAY`"
		. " SET `word`=\"$word_safe\",`desc`=\"$word_desc_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE meeting_agenda_id=$meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function upsertWordOfTheDayWordOnly($meeting_id, $word){

		if(	$this->isNotUnsignedNumber($meeting_id) ){
			echo "\$this->isNotUnsignedNumber(\$meeting_id)";
			return;
		}
		if( empty($word) ){
			echo "empty(\$word)";
			return;
		}

		// 1. 해당 미팅의 단어 정보가 있는지 확인합니다.
		$word_of_the_day_list = $this->getWordOfTheDay($meeting_id);

		if(!empty($word_of_the_day_list) && count($word_of_the_day_list) > 0){
			// 1-2. 있다면 UPDATE (단어설명은 이미 저장된 것을 사용합니다.)
			$word_of_the_day_obj = $word_of_the_day_list[0];
			$word_desc = $word_of_the_day_obj->__word_desc;
			return $this->updateWordOfTheDay($meeting_id, $word, $word_desc);
		} else {
			// 1-1. 없다면 INSERT (단어만 추가됩니다.)
			$word_desc = "No Word Desc";
			return $this->insertWordOfTheDay($meeting_id, $word, $word_desc);
		}
	}

	public function upsertWordOfTheDayWordDescOnly($meeting_id, $word_desc){

		if(	$this->isNotUnsignedNumber($meeting_id) ){
			echo "upsertWordOfTheDayWordDescOnly / \$this->isNotUnsignedNumber(\$meeting_id)";
			return null;
		}
		if( empty($word_desc) ){
			echo "upsertWordOfTheDayWordDescOnly / empty(\$word_desc)";
			return null;
		}

		// 1. 해당 미팅의 단어 정보가 있는지 확인합니다.
		$word_of_the_day_list = $this->getWordOfTheDay($meeting_id);

		if(!empty($word_of_the_day_list) && count($word_of_the_day_list) > 0){
			// 1-2. 있다면 UPDATE (단어설명은 이미 저장된 것을 사용합니다.)
			$word_of_the_day_obj = $word_of_the_day_list[0];
			$word = $word_of_the_day_obj->__word;
			return $this->updateWordOfTheDay($meeting_id, $word, $word_desc);
		} else {
			// 1-1. 없다면 INSERT (단어만 추가됩니다.)
			$word = "No Word";
			return $this->insertWordOfTheDay($meeting_id, $word, $word_desc);
		}
	}	

	public function updateWordOfTheDayWordOnly($meeting_agenda_id, $word){

		$word_safe = addslashes($word);
		$word_desc_safe = addslashes($word_desc);

		$query =
		"UPDATE `MA_WORD_OF_THE_DAY`"
		. " SET `word`=\"$word_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE meeting_agenda_id=$meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateWordOfTheDayWordDescOnly($meeting_agenda_id, $word_desc){

		$word_safe = addslashes($word);
		$word_desc_safe = addslashes($word_desc);

		$query =
		"UPDATE `MA_WORD_OF_THE_DAY`"
		. " SET `desc`=\"$word_desc_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE meeting_agenda_id=$meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	private function insertWordOfTheDay($meeting_agenda_id, $word, $word_desc){

		$word_safe = addslashes($word);
		$word_desc_safe = addslashes($word_desc);

		$query =
		"INSERT INTO `MA_WORD_OF_THE_DAY`(`meeting_agenda_id`, `word`, `desc`, `updttm`, `regdttm`)"
		. " VALUES ($meeting_agenda_id,\"$word_safe\",\"$word_desc_safe\",DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function getQuoteOfTheDay($meeting_id){

		$query =
		"SELECT `id` AS __quote_id"
		. " , `content` AS __quote_content"
		. " , `meeting_agenda_id` AS __meeting_agenda_id"
		. " , `updttm` AS __quote_updttm"
		. " , `regdttm` AS __quote_regdttm"
		. " FROM `MA_QUOTE_OF_THE_DAY`"
		. " WHERE `meeting_agenda_id`=$meeting_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	private function deleteQuoteOfTheDay($meeting_agenda_id){
		$query=
		"DELETE FROM `MA_QUOTE_OF_THE_DAY` WHERE $meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}


	public function updateQuoteOfTheDay($meeting_agenda_id, $quote){

		$quote_safe = addslashes($quote);

		$query =
		"UPDATE `MA_QUOTE_OF_THE_DAY`"
		. " SET `content`=\"$quote_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE `meeting_agenda_id`=$meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	private function insertQuoteOfTheDay($meeting_agenda_id, $quote){

		$quote_safe = addslashes($quote);

		$query =
		"INSERT INTO `MA_QUOTE_OF_THE_DAY`(`meeting_agenda_id`, `content`, `updttm`, `regdttm`)"
		. " VALUES ($meeting_agenda_id,\"$quote_safe\",DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateWordNQuote($meeting_id, $word, $word_desc, $quote){
		$result_array = array();
		$result = $this->upsertWordOfTheDay($meeting_id, $word, $word_desc);
		array_push($result_array, $result);
		$result = $this->upsertQuoteOfTheDay($meeting_id, $quote);
		array_push($result_array, $result);

		return $result_array;
	}

	public function upsertWordOfTheDay($meeting_id, $word, $word_desc){
		// 1. 오늘의 단어가 등록되어 있는지 확인합니다.
		$word_of_the_day_list = $this->getWordOfTheDay($meeting_id);
		if(!empty($word_of_the_day_list) && count($word_of_the_day_list) > 0){
			// 1-1. 등록되어 있다면 해당 내역을 업데이트 합니다.
			return $this->updateWordOfTheDay($meeting_id, $word, $word_desc);
		} else {
			// 1-2. 등록되이 있지 않다면 해당 내역을 추가합니다.	
			return $this->insertWordOfTheDay($meeting_id, $word, $word_desc);
		}
	}

	public function upsertQuoteOfTheDay($meeting_id, $quote){
		// 2. 오늘의 명언이 등록되이 있는지 확인합니다.
		$quote_of_the_day_list = $this->getQuoteOfTheDay($meeting_id);
		if(!empty($quote_of_the_day_list) && count($quote_of_the_day_list) > 0){
			// 2-1. 등록되어 있다면 해당 내역을 업데이트 합니다.
			return $this->updateQuoteOfTheDay($meeting_id, $quote);
		} else {
			// 2-2. 등록되이 있지 않다면 해당 내역을 추가합니다.
			return $this->insertQuoteOfTheDay($meeting_id, $quote);
		}
	}



	public function getNews($meeting_id){

		$function_name = "getNews";
		if(	$this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)";
			return;
		}

		$query = 
		"SELECT `MA_NEWS`.id AS __news_id"
		. " , `MA_NEWS`.meeting_agenda_id AS __news_meeting_agenda_id"
		. " , `MA_NEWS`.title AS __news_title"
		. " , `MA_NEWS`.content AS __news_content"
		. " , `MA_NEWS`.updttm AS __news_updttm"
		. " , `MA_NEWS`.regdttm AS __news_regdttm"
		. " , `MA_NEWS`.order_num AS __news_order_num"
		. " FROM `MA_NEWS`"
		. " LEFT JOIN `MEETING_AGENDA` AS MA ON MA.id=`MA_NEWS`.meeting_agenda_id"
		. " WHERE `MA_NEWS`.meeting_agenda_id=$meeting_id"
		. " ORDER BY `MA_NEWS`.order_num, `MA_NEWS`.id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}
	public function getNewsByNewsId($membership_id, $meeting_id, $news_id){

		$function_name = "getNewsByNewsId";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if(	$this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)";
			return;
		}
		if(	$this->isNotUnsignedNumber($news_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$news_id)";
			return;
		}

		$query = 
		"SELECT `MA_NEWS`.id AS __news_id"
		. " , `MA_NEWS`.meeting_agenda_id AS __news_meeting_agenda_id"
		. " , `MA_NEWS`.title AS __news_title"
		. " , `MA_NEWS`.content AS __news_content"
		. " , `MA_NEWS`.updttm AS __news_updttm"
		. " , `MA_NEWS`.regdttm AS __news_regdttm"
		. " , `MA_NEWS`.order_num AS __news_order_num"
		. " FROM `MA_NEWS`"
		. " LEFT JOIN `MEETING_AGENDA` AS MA ON MA.id=`MA_NEWS`.meeting_agenda_id"
		. " WHERE `MA_NEWS`.meeting_agenda_id=$meeting_id"
		. " AND MA.membership_id=$membership_id"
		. " AND `MA_NEWS`.id=$news_id"		
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	
	private function deleteNews($meeting_agenda_id){

		$function_name = "deleteNews";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}

		$query = 
		"DELETE FROM `MA_NEWS` WHERE meeting_agenda_id=$meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}
	public function deleteNewsByNewsId($news_id){

		$function_name = "deleteNewsByNewsId";
		if($this->isNotUnsignedNumber($news_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$news_id)<br/>";
			return;
		}

		$query = 
		"DELETE FROM `MA_NEWS` WHERE id=$news_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function insertNews_V2($meeting_agenda_id, $news_title="", $news_content=""){

		$function_name = "insertNews_V2";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}

		$news_title_safe = "";
		if(!empty($news_title)){
			$news_title_safe = addslashes($news_title);
		}
		$news_content_safe = "";
		if(!empty($news_content)){
			$news_content_safe = addslashes($news_content);
		}

		$query = 
		"INSERT INTO `MA_NEWS`(`meeting_agenda_id`, `title`, `content`, `order_num`, `updttm`, `regdttm`)"
		. " VALUES ($meeting_agenda_id,\"$news_title_safe\",\"$news_content_safe\", 0, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateNewsByNewsId_V2($meeting_agenda_id, $news_id, $news_title="", $news_content="", $order_num=-1){

		$function_name = "updateNewsByNewsId_V2";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($news_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$news_id)<br/>";
			return;
		}

		$query = "";

		if( !empty($news_title) && !empty($news_content) ){

			$news_title_safe = addslashes($news_title);
			$news_content_safe = addslashes($news_content);
			$query = 
			"UPDATE `MA_NEWS`"
			. " SET `title`=\"$news_title_safe\",`content`=\"$news_content_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE meeting_agenda_id=$meeting_agenda_id"
			. " AND id=$news_id"
			;			

		} else if( !empty($news_title) ){

			$news_title_safe = addslashes($news_title);
			$query = 
			"UPDATE `MA_NEWS`"
			. " SET `title`=\"$news_title_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE meeting_agenda_id=$meeting_agenda_id"
			. " AND id=$news_id"
			;			

		} else if( !empty($news_content) ){

			$news_content_safe = addslashes($news_content);
			$query = 
			"UPDATE `MA_NEWS`"
			. " SET `content`=\"$news_content_safe\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE meeting_agenda_id=$meeting_agenda_id"
			. " AND id=$news_id"
			;
			
		}

		$order_num = intval($order_num);
		if( $order_num > -1 ) {
			$query = 
			"UPDATE `MA_NEWS`"
			. " SET `order_num`=\"$order_num\",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE meeting_agenda_id=$meeting_agenda_id"
			. " AND id=$news_id"
			;
		}

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}



	public function getMemberShipList(){
		$query = 
		"SELECT `id` AS __membership_id"
		. " , `name` AS __membership_name"
		. " , `desc` AS __membership_desc"
		. " , `member_cnt` AS __membership_member_cnt"
		. " , `regdttm` AS __membership_regdttm"
		. " FROM `MEMBERSHIP`"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	/*
		@ Deprecated
	*/
	public function getMemberLogInByMobile($member_mobile="", $member_password=""){

		if(empty($member_mobile)) return null;
		if(empty($member_password)) return null;

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.mobile,\"\") AS __member_mobile"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " WHERE `MEMBER`.`mobile`=\"$member_mobile\""
		. " AND `MEMBER`.`password`=\"$member_password\""
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMemberLogInByEmail($member_email="", $member_password=""){

		if(empty($member_email)) return null;
		if(empty($member_password)) return null;

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " WHERE `MEMBER`.`email`=\"$member_email\""
		. " AND `MEMBER`.`password`=\"$member_password\""
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;

	}

	public function getSleepingMember($expire_date=180, $membership_id=1) {

		if($this->isNotUnsignedNumber($expire_date)) return null;

		$query = 
		"SELECT "
		. " __member_id"
		. " , __member_hash_key"
		. " , __member_name"
		. " , __last_speaker_date"
		. " , __last_speaker_dttm_diff"
		. " , __last_evaluator_date"
		. " , __last_evaluator_dttm_diff"
		. " , __last_role_date"
		. " , __last_role_dttm_diff"
		. " , __last_member_update"
		. " , __last_member_update_diff"
		. " FROM"
		. " ("
		. " 	SELECT MEMBER.id AS __member_id"
		. " 	, MEMBER.hash_key AS __member_hash_key"		
		. " 	, CONCAT(MEMBER.first_name, ' ', last_name) AS __member_name"
		. " 	, DATE_FORMAT(MAX(MSS.updttm), '%Y-%m-%d') AS __last_speaker_date"
		. " 	, DATEDIFF(NOW(), MAX(MSS.updttm)) AS __last_speaker_dttm_diff"
		. " 	, DATE_FORMAT(MAX(MSE.updttm), '%Y-%m-%d') AS __last_evaluator_date"
		. " 	, DATEDIFF(NOW(), MAX(MSE.updttm)) AS __last_evaluator_dttm_diff"
		. " 	, DATE_FORMAT(MAX(MR.updttm), '%Y-%m-%d') AS __last_role_date"
		. " 	, DATEDIFF(NOW(), MAX(MR.updttm)) AS __last_role_dttm_diff"
		. " 	, DATE_FORMAT(MEMBER.updttm, '%Y-%m-%d') AS __last_member_update"
		. " 	, DATEDIFF(NOW(), MEMBER.updttm) AS __last_member_update_diff"
		. " 	FROM MEMBER"
		. " 	LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=MEMBER.id"
		. " 	LEFT JOIN MA_SPEECH_SPEAKER AS MSS ON MSS.speaker_member_id=MEMBER.id"
		. " 	LEFT JOIN MA_SPEECH_EVALUATOR AS MSE ON MSE.evaluator_member_id=MEMBER.id"
		. " 	LEFT JOIN MA_ROLE AS MR ON MR.member_id=MEMBER.id"
		. " 	WHERE MNM.`status`='A'"
		. " 	AND MNM.membership_id IN ($membership_id)"
		. " 	AND DATEDIFF(NOW(), MEMBER.updttm) > $expire_date"
		. " 	GROUP BY MEMBER.id"
		. " ) AS TEMP"
		. " WHERE (__last_speaker_dttm_diff IS NULL OR __last_speaker_dttm_diff > $expire_date)"
		. " AND (__last_evaluator_dttm_diff IS NULL OR __last_evaluator_dttm_diff > $expire_date)"
		. " AND (__last_role_dttm_diff IS NULL OR __last_role_dttm_diff > $expire_date)"
		. " AND (__last_member_update_diff IS NULL OR __last_member_update_diff > $expire_date)"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function goodNightMember($member_id, $membership_id){

		// 1. 휴면 상태인 회원을 N 상태로 변경합니다.
		if($this->isNotUnsignedNumber($member_id)) return null;
		if($this->isNotUnsignedNumber($membership_id)) return null;

		$query = 
		"UPDATE `MEMBER_N_MEMBERSHIP`"
		. " SET `status`=\"N\""
		. " WHERE member_id=$member_id"
		. " AND membership_id=$membership_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function getMember($member_hashkey){

		$function_name = "getMember";
		if(empty($member_hashkey)){
			echo "$function_name / empty(\$member_hashkey)<br/>";
			return;
		}

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " WHERE `MEMBER`.`hash_key`=\"$member_hashkey\""
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMemberMembership($member_hashkey){

		$function_name = "getMemberMembership";
		if(empty($member_hashkey)){
			echo "$function_name / empty(\$member_hashkey)<br/>";
			return;
		}

		$query = 
		"SELECT IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(`MEMBERSHIP`.desc,\"\") AS __member_membership_desc"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MNM.membership_id"
		. " WHERE `MEMBER`.`hash_key`=\"$member_hashkey\""
		. " ORDER BY `MEMBERSHIP`.`name`"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	/*

	*/
	public function getMemberByEmail($email){

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MNM.membership_id"
		. " WHERE `MEMBER`.`email`=\"$email\""
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMemberByNameAndEmail($first_name, $last_name, $email, $membership_id){

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MNM.membership_id"
		. " WHERE `MEMBER`.`first_name`=\"$first_name\""
		. " AND `MEMBER`.`last_name`=\"$last_name\""
		. " AND `MEMBER`.`email`=\"$email\""
		. " AND `MEMBERSHIP`.id=$membership_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	/*
		@ Deprecated
	*/
	public function getMemberByMobile($mobile){

		$function_name = "getMemberByMobile";
		if(empty($mobile)){
			echo "$function_name / empty(\$mobile)<br/>";
			return;
		}

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MNM.membership_id"
		. " WHERE `MEMBER`.`mobile`=\"$mobile\""
		. " LIMIT 1"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	

	public function getMemberByMemberHashKey($member_hash_key){

		$function_name = "getMemberByMemberHashKey";
		if(empty($member_hash_key)){
			echo "$function_name / empty(\$member_hash_key)<br/>";
			return;
		}

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " WHERE `MEMBER`.`member_hash_key`=\"$member_hash_key\""
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMembership($membership_id) {

		if($this->isNotUnsignedNumber($membership_id)) return null;

		$query = 
		"SELECT id AS __membership_id"
		. " , IFNULL(`name`, \"\") AS __membership_name"
		. " , IFNULL(`desc`, \"\") AS __membership_desc"
		. " FROM MEMBERSHIP"
		. " WHERE id=$membership_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getAllMembership() {

		// 1. 미팅 아젠다를 가지고 있는 모든 클럽을 보여줍니다.
		$query = 
		"SELECT __member_membership"
		. " , __member_membership_name"
		. " , __member_membership_desc" 
		. " , __meeting_cnt"
		. " , 0 AS __is_user_membership"
		. " FROM ("
			. " SELECT `MEMBERSHIP`.id AS __member_membership"
			. " , IFNULL(`MEMBERSHIP`.`name`, \"\") AS __member_membership_name"
			. " , IFNULL(`MEMBERSHIP`.`desc`, \"\") AS __member_membership_desc"
			. " , COUNT(MA.`id`) AS __meeting_cnt"
			. " FROM `MEMBERSHIP`"
			. " LEFT JOIN MEETING_AGENDA AS MA ON MA.membership_id=`MEMBERSHIP`.id"
			. " GROUP BY `MEMBERSHIP`.id"
			. " ORDER BY `name`"
		. " ) AS TEMP"
		. " WHERE __meeting_cnt > 0"
		. " ORDER BY __member_membership_name"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getAllMembershipByMemberHashKey($member_hashkey) {

		if(empty($member_hashkey)) return null;

		// 1. 미팅 아젠다를 가지고 있는 모든 클럽을 보여줍니다.
		// 1-1. 멤버 해시키값을 이용, 멤버가 등록된 클럽을 상위에, 그렇지 않은 클럽을 하위에 보여줍니다.

		// 2. 멤버가 가입된 모든 클럽 정보를 가져옵니다.
		$query = 
		"SELECT MEMBERSHIP.id AS __member_membership"
		. " FROM MEMBER"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id = MEMBER.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id = MNM.membership_id"
		. " WHERE MEMBER.hash_key=\"$member_hashkey\""
		;

		$json_res_obj_membership = $this->getSelectResult($query);
		$member_memberships = "";
		for($idx = 0;$idx < COUNT($json_res_obj_membership->result); $idx++) {
			$cur_membership_obj = $json_res_obj_membership->result[$idx];
			$cur_membership_id = $cur_membership_obj->__member_membership;

			if(0 < $idx) {
				$member_memberships .= ",$cur_membership_id";
			} else {
				$member_memberships .= "$cur_membership_id";
			}
		}

		// 2. 멤버가 가입된 클럽 세부 정보 조회.
		$query = 
		"SELECT __member_membership"
		. " , __member_membership_name"
		. " , __member_membership_desc" 
		. " , __meeting_cnt"
		. " , __is_user_membership"
		. " FROM ("
			. " SELECT `MEMBERSHIP`.id AS __member_membership"
			. " , IFNULL(`MEMBERSHIP`.`name`, \"\") AS __member_membership_name"
			. " , IFNULL(`MEMBERSHIP`.`desc`, \"\") AS __member_membership_desc"
			. " , COUNT(MA.`id`) AS __meeting_cnt"
			. " , 1 AS __is_user_membership"
			. " FROM `MEMBERSHIP`"
			. " LEFT JOIN MEETING_AGENDA AS MA ON MA.membership_id=`MEMBERSHIP`.id"
			. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.membership_id = `MEMBERSHIP`.id"
			. " WHERE `MEMBERSHIP`.id IN ($member_memberships)"
			. " GROUP BY `MEMBERSHIP`.id"
			. " ORDER BY `name`"
		. " ) AS TEMP"
		. " WHERE __meeting_cnt > 0"
		. " ORDER BY __member_membership_name"
		;
		$json_res_obj_club_member_include = $this->getSelectResult($query);
		$result_club_member_include = $json_res_obj_club_member_include->result;


		// 3. 멤버가 가입되지 않은 클럽 세부 정보 조회.
		$query = 
		"SELECT __member_membership"
		. " , __member_membership_name"
		. " , __member_membership_desc" 
		. " , __meeting_cnt"
		. " , __is_user_membership"
		. " FROM ("
			. " SELECT `MEMBERSHIP`.id AS __member_membership"
			. " , IFNULL(`MEMBERSHIP`.`name`, \"\") AS __member_membership_name"
			. " , IFNULL(`MEMBERSHIP`.`desc`, \"\") AS __member_membership_desc"
			. " , COUNT(MA.`id`) AS __meeting_cnt"
			. " , 0 AS __is_user_membership"
			. " FROM `MEMBERSHIP`"
			. " LEFT JOIN MEETING_AGENDA AS MA ON MA.membership_id=`MEMBERSHIP`.id"
			. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.membership_id = `MEMBERSHIP`.id"
			. " WHERE `MEMBERSHIP`.id NOT IN ($member_memberships)"
			. " GROUP BY `MEMBERSHIP`.id"
			. " ORDER BY `name`"
		. " ) AS TEMP"
		. " WHERE __meeting_cnt > 0"
		. " ORDER BY __member_membership_name"
		;
		$json_res_obj_club_member_exclude = $this->getSelectResult($query);
		$result_club_member_exclude = $json_res_obj_club_member_exclude->result;

		// 2개의 내용을 합칩니다.
		$result_merge = array_merge($result_club_member_include, $result_club_member_exclude);

		return $result_merge;
	}	

	public function insertMember(	$first_name, 
									$last_name, 
									$mobile, 
									$email){

		$function_name = "insertMember";
		if(empty($first_name)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$first_name)<br/>";
			return;
		}
		if(empty($last_name)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$last_name)<br/>";
			return;
		}
		if(empty($mobile)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$mobile)<br/>";
			return;
		}
		if(empty($email)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$email)<br/>";
			return;
		}

		// 이메일과 휴대폰 번호를 조합한 해시키를 만듭니다.
		$member_hash_key = MD5("$mobile $email");

		$query =
		"INSERT INTO `MEMBER`("
		. " `first_name`"
		. ","
		. " `last_name`"
		. ","
		. " `hash_key`"
		. ","
		. " `mobile`"
		. ","
		. " `email`"
		. ","
		. " `regdttm`"
		. ","
		. " `updttm`"
		. ")"
		. " VALUES ("
		. "\"$first_name\""
		. ","
		. "\"$last_name\""
		. ","
		. "\"$member_hash_key\""
		. ","
		. "\"$mobile\""
		. ","
		. "\"$email\""
		. ","
		. "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. ","
		. "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. ")"
		;	

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function insertMemberNMembership($member_id, $membership_id) {

		$function_name = "insertMemberNMembership";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}

		$query =
		"INSERT INTO `MEMBER_N_MEMBERSHIP`("
		. " `member_id`"
		. ","
		. " `membership_id`"
		. ","
		. " `status`"
		. ")"
		. " VALUES ("
		. "\"$member_id\""
		. ","
		. "\"$membership_id\""
		. ","
		. "\"A\""
		. ")"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateMember(	$hash_key, 
									$member_first_name, 
									$member_last_name, 
									$member_email 	){

		if(empty($hash_key)) return null;
		if(empty($member_first_name)) return null;
		if(empty($member_last_name)) return null;
		if(empty($member_email)) return null;

		$query = 
		"UPDATE `MEMBER`"
		. " SET"
		. " `first_name`=\"$member_first_name\""
		. " ,`last_name`=\"$member_last_name\""
		. " ,`email`=\"$member_email\""
		. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE hash_key=\"$hash_key\""
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateMemberStatus(	$member_id, $membership_id, $member_status ){

		if($this->isNotUnsignedNumber($member_id)) return null;
		if($this->isNotUnsignedNumber($membership_id)) return null;
		if(empty($member_status)) return null;

		$query = 
		"UPDATE `MEMBER_N_MEMBERSHIP`"
		. " SET `status`=\"$member_status\""
		. " WHERE member_id=$member_id"
		. " AND membership_id=$membership_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	public function updateMemberFirstName( $hash_key, $member_first_name ){

		if(empty($hash_key)) return null;
		if(empty($member_first_name)) return null;

		$query = 
		"UPDATE `MEMBER`"
		. " SET"
		. " `first_name`=\"$member_first_name\""
		. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE hash_key=\"$hash_key\""
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	public function updateMemberLastName( $hash_key, $member_last_name ){

		if(empty($hash_key)) return null;
		if(empty($member_last_name)) return null;

		$query = 
		"UPDATE `MEMBER`"
		. " SET"
		. " `last_name`=\"$member_last_name\""
		. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE hash_key=\"$hash_key\""
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	public function updateMemberEmail( $hash_key, $member_email ){

		if(empty($hash_key)) return null;
		if(empty($member_email)) return null;

		$query = 
		"UPDATE `MEMBER`"
		. " SET `email`=\"$member_email\""
		. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE hash_key=\"$hash_key\""
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	


	public function getMemberList($membership_id=-1, $member_status="A"){

		$function_name = "getMemberList";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(MEMBERSHIP.id,-1) AS __member_membership"
		. " , IFNULL(MEMBERSHIP.name,\"\") AS __member_membership_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " WHERE MNM.membership_id=$membership_id"
		. " AND `MEMBER`.first_name NOT IN (\"NOT\",\"WELCOME\")"
		. " AND `MEMBER`.last_name NOT IN (\"ASSIGNED\",\"GUEST\")"
		;

		if(!is_null($member_status)){
			$query .= 
			" AND MNM.`status`=\"" . $member_status .  "\""
			;
		}

		$query .= 
		" ORDER BY LOWER(`MEMBER`.first_name) ASC, LOWER(`MEMBER`.last_name) ASC"
		;	

		$json_res_obj = $this->getSelectResult($query);

		// 게스트와 지정되지 않음 표시는 리스트 최상단에 다시 넣어줍니다.
		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(MEMBERSHIP.id,-1) AS __member_membership"
		. " , IFNULL(MEMBERSHIP.name,\"\") AS __member_membership_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " WHERE MNM.membership_id=$membership_id"
		. " AND `MEMBER`.first_name IN (\"NOT\",\"WELCOME\")"
		. " AND `MEMBER`.last_name IN (\"ASSIGNED\",\"GUEST\")"
		. " ORDER BY LOWER(`MEMBER`.first_name) ASC, LOWER(`MEMBER`.last_name) ASC"
		;

		$json_res_obj_etc = $this->getSelectResult($query);
		$result_etc = $json_res_obj_etc->result;

		$result_merge = array_merge($result_etc, $json_res_obj->result);
		$json_res_obj->result = $result_merge;

		return $json_res_obj->result;
	}

	public function getMemberListByMembershipId($membership_id=1){

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(`MEMBERSHIP`.desc,\"\") AS __member_membership_desc"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " WHERE MNM.membership_id IN ($membership_id)"
		. " ORDER BY MNM.`status` ASC, LOWER(`MEMBER`.first_name) ASC"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMemberListByMembershipIdNMemberHashkey($membership_id=-1, $member_hashkey=""){

		$function_name = "getMemberListByMembershipIdNMemberHashkey";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if(empty($member_hashkey)){
			echo "$function_name / empty(\$member_hashkey)<br/>";
			return;
		}

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(`MEMBERSHIP`.desc,\"\") AS __member_membership_desc"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " WHERE MNM.membership_id = $membership_id"
		. " AND `MEMBER`.hash_key IN (\"$member_hashkey\")"
		;

		$json_res_obj_log_in_user = $this->getSelectResult($query);
		$result_log_in_user = $json_res_obj_log_in_user->result;

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(`MEMBERSHIP`.desc,\"\") AS __member_membership_desc"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " WHERE MNM.membership_id = $membership_id"
		. " AND `MEMBER`.hash_key NOT IN (\"$member_hashkey\")"
		. " ORDER BY MNM.`status` ASC, LOWER(`MEMBER`.first_name) ASC"
		;

		$json_res_obj_others = $this->getSelectResult($query);
		$result_others = $json_res_obj_others->result;

		$result_merge = array_merge($result_log_in_user, $result_others);

		return $result_merge;
	}


	public function getOtherMemberListByMembershipId($membership_id=-1){

		$function_name = "getOtherMemberListByMembershipId";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(`MEMBERSHIP`.desc,\"\") AS __member_membership_desc"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " WHERE MNM.membership_id NOT IN ($membership_id)" 
		. " AND `MEMBER`.id NOT IN (SELECT member_id FROM MEMBER_N_MEMBERSHIP WHERE membership_id IN ($membership_id))"
		. " ORDER BY MNM.`status` ASC, LOWER(`MEMBER`.first_name) ASC"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getMemberListSpeechCnt($membership_id=1){

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " , COUNT(`MEMBER`.id) AS __member_speech_cnt"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " LEFT JOIN MA_SPEECH_SPEAKER AS MSS ON MSS.speaker_member_id=`MEMBER`.id"
		. " WHERE `MEMBER`.`status`=\"A\""
		. " AND MNM.membership_id IN ($membership_id)"
		. " GROUP BY `MEMBER`.id"
		. " ORDER BY LOWER(`MEMBER`.first_name) ASC"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	

	public function getMemberListEvaluatorCnt($membership_id=1){

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(UPPER(SUBSTR(`MEMBER`.first_name,1,1)),\"\") AS __member_name_group"
		. " , IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
		. " , IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , IFNULL(`MEMBER`.email,\"\") AS __member_email"
		. " , COUNT(`MEMBER`.id) AS __member_evaluator_cnt"
		. " FROM `MEMBER`"
		. " LEFT JOIN MEMBER_N_MEMBERSHIP AS MNM ON MNM.member_id=`MEMBER`.id"
		. " LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MNM.membership_id"
		. " LEFT JOIN MA_SPEECH_EVALUATOR AS MSE ON MSE.evaluator_member_id=`MEMBER`.id"
		. " WHERE `MEMBER`.`status`=\"A\""
		. " AND `MEMBERSHIP`.`id`=$membership_id"
		. " GROUP BY `MEMBER`.id"
		. " ORDER BY LOWER(`MEMBER`.first_name) ASC"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}		

	public function getMemberRoleCntList($membership_id=1, $role_id=-1, $member_id=-1, $member_status="A"){

		$function_name = "getMemberRoleCntList";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if(empty($member_status)){
			echo "$function_name / empty(\$member_status)<br/>";
			return;
		}

		$query = 
		"SELECT `MEMBER`.id AS __member_id"
		. " , IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
		. " , IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
		. " , CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " , `ROLE`.id AS __role_id"
		. " , `ROLE`.name AS __role_name"
		. " , COUNT(MA_ROLE.role_id) AS __role_cnt"
		. " FROM `MEMBER`"
		. " JOIN MA_ROLE ON MA_ROLE.member_id=`MEMBER`.id"
		. " LEFT JOIN `ROLE` ON `ROLE`.id=MA_ROLE.role_id"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " WHERE MNM.`status`=\"" . $member_status .  "\""
		. " AND MNM.membership_id=\"" . $membership_id .  "\""
		. " AND `MEMBER`.first_name NOT IN (\"NOT\",\"WELCOME\")"
		;

		if($role_id > 0 && $member_id > 0){
			$query .= ""
			. " AND `ROLE`.`id`=$role_id"
			. " AND `MEMBER`.`id`=$member_id"
			. " GROUP BY __role_id"
			;
		} else {
			$query .= ""
			. " GROUP BY __role_id, __member_id"
			. " ORDER BY __role_id, __role_cnt ASC"
			;
		}

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getRoleList(){
		$query = 
		"SELECT `id` AS __role_id"
		. " , IFNULL(`name`,\"\") AS __role_name"
		. " , IFNULL(`desc`,\"\") AS __role_desc"
		. " FROM ROLE"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getTodayRoleList($membership_id, $meeting_agenda_id, $role_id_order_arr=null){

		if($this->isNotUnsignedNumber($meeting_agenda_id)) return null;
		if($this->isNotUnsignedNumber($membership_id)) return null;

		if(is_null($role_id_order_arr)) {
			$role_id_order_arr = array(7,2,9,5,10,6,11,4);
		}

		// 역할에 등록된 회원 정보를 가져옵니다.
		$valid_today_role_list = $this->getValidTodayRoleMemberList($membership_id, $meeting_agenda_id);

		// 역할의 정보를 가져옵니다.
		$today_role_fixed_list = $this->getTodayRoleFixedList();

		$today_role_arr = array();
		foreach ($today_role_fixed_list as $fixed_role_ele) {
			$fixed_role_id=$fixed_role_ele->__role_id;
			$fixed_role_name=$fixed_role_ele->__role_name;

			// 역할에 등록된 회원 정보가 있다면 추가합니다.
			$member_id=-1;
			$member_first_name="";
			$member_last_name="";
			foreach ($valid_today_role_list as $member_role_ele) {
				$member_role_id=$member_role_ele->__role_id;
				if(!empty($member_role_id) && $member_role_id==$fixed_role_id){
					$member_id=$member_role_ele->__member_id;
					$member_first_name=$member_role_ele->__member_first_name;
					$member_last_name=$member_role_ele->__member_last_name;
					$member_membership_status=$member_role_ele->__member_membership_status;
				}
			}

			$today_role_obj = new stdClass();
			$today_role_obj->__meeting_agenda_id=$meeting_agenda_id;
			$today_role_obj->__role_id=$fixed_role_id;
			$today_role_obj->__role_name=$fixed_role_name;
			$today_role_obj->__member_id=$member_id;
			$today_role_obj->__member_first_name=$member_first_name;
			$today_role_obj->__member_last_name=$member_last_name;
			$today_role_obj->__member_name=$member_first_name . " " . $member_last_name;
			$today_role_obj->__member_membership_status=$member_membership_status;

			// push array
			array_push($today_role_arr,$today_role_obj);//$today_role_arr = array();
		}
 
		// 등록된 회원들이 이전 역할을 횟수를 가져옵니다.
		foreach ($today_role_arr as $role_obj) {
			if($role_obj->__member_id > 0){
				$role_cnt_list = $this->getMemberRoleCntList($membership_id, $role_obj->__role_id, $role_obj->__member_id);
				$role_cnt_obj = $role_cnt_list[0];
				$role_obj->__role_cnt = $role_cnt_obj->__role_cnt;
			} else {
				$role_obj->__role_cnt = 0;
			}
		}

		// 역할 순서를 정렬합니다.
		if(!empty($role_id_order_arr) && count($role_id_order_arr) > 0){
			$sorted_today_role_arr = array();
			foreach ($role_id_order_arr as $role_id) {
				foreach ($today_role_arr as $role_obj) {
					if($role_id == $role_obj->__role_id){
						array_push($sorted_today_role_arr,$role_obj);
						break;
					}
				}
			}
			return $sorted_today_role_arr;
		}

		return $today_role_arr;
	}

	public function getExcutiveMemberList($membership_id){

		$function_name = "getExcutiveMemberList";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query = 		
		"SELECT OFFICER.id AS __officer_id"
		. " , IFNULL(OFFICER.name,\"\") AS __officer_name"
		. " , IFNULL(OFFICER.desc,\"\") AS __officer_desc"
		. " , IFNULL(MEMBER.id,-1) AS __member_id"
		. " , IFNULL(MEMBER.email,\"\") AS __member_email"
		. " , IFNULL(CONCAT(MEMBER.first_name,\" \",MEMBER.last_name),\"\") AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , IFNULL(MNO.regdttm,\"\") AS __regdttm"
		. " FROM OFFICER"
		. " LEFT JOIN MEMBER_N_OFFICER AS MNO ON (MNO.officer_id=OFFICER.id AND MNO.membership_id=$membership_id)"
		. " LEFT JOIN MEMBER ON MEMBER.id=MNO.member_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	private function getExecutiveMember($membership_id, $officer_id){

		if($this->isNotUnsignedNumber($membership_id)) return null;
		if($this->isNotUnsignedNumber($officer_id)) return null;

		$query = 
		"SELECT member_id AS __officer_member_id"
		. " , officer_id AS __officer_id"
		. " FROM `MEMBER_N_OFFICER`"
		. " WHERE membership_id=$membership_id"
		. " AND officer_id=$officer_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}
	private function _updateExecutiveMember($membership_id, $officer_id, $member_id){

		if($this->isNotUnsignedNumber($membership_id)) return null;
		if($this->isNotUnsignedNumber($officer_id)) return null;
		if($this->isNotUnsignedNumber($member_id)) return null;

		$query = 
		"UPDATE `MEMBER_N_OFFICER`"
		. " SET `member_id`=$member_id,`regdttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE `officer_id`=$officer_id"
		. " AND `membership_id`=$membership_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}
	private function insertExecutiveMember($membership_id, $officer_id, $member_id){

		$function_name = "insertExecutiveMember";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($officer_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$officer_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}

		$query = 
		"INSERT INTO `MEMBER_N_OFFICER`(`membership_id`, `officer_id`, `member_id`, `regdttm`)"
		. " VALUES ($membership_id, $officer_id,$member_id,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}
	private function insertExecutiveMemberHistory($membership_id, $officer_id, $member_id){

		$function_name = "insertExecutiveMemberHistory";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($officer_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$officer_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}

		$query = 
		"INSERT INTO `MEMBER_N_OFFICER_HISTORY`(`membership_id`, `officer_id`, `member_id`, `regdttm`)"
		. " VALUES ( $membership_id, $officer_id, $member_id, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function updateExecutiveMember($membership_id, $officer_id, $member_id){

		$function_name = "updateExecutiveMember";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($officer_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$officer_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}


		$result_array = array();

		// 1. 해당 오피서의 정보를 가져옵니다. 
		$executive_member_list = $this->getExecutiveMember($membership_id, $officer_id);
		if(!empty($executive_member_list) && count($executive_member_list) > 0){

			$executive_member_obj = $executive_member_list[0];
			// 1-1. 이전 정보와 동일하다면 중단.
			if(	is_null($executive_member_obj) || 
				is_null($executive_member_obj->__officer_member_id) || 
				!is_numeric($executive_member_obj->__officer_member_id) || 
				$executive_member_obj->__officer_member_id == $member_id){

				return;
			}
			// 1-2. 이전 정보와 다르다면 업데이트
			$result = $this->_updateExecutiveMember($membership_id, $officer_id, $member_id);
			array_push($result_array, $result);
			
			// 1-1-2. 이전 레거시 정보를 HISTORY 테이블에 업데이트 합니다.
			$result = 
			$this->insertExecutiveMemberHistory(
				$membership_id, $executive_member_obj->__officer_id
				, $executive_member_obj->__officer_member_id
			);
			array_push($result_array, $result);

		} else {
			// 1-2. 정보가 없다면 추가합니다.
			$result = $this->insertExecutiveMember($membership_id, $officer_id, $member_id);
			array_push($result_array, $result);
		}

		return $result_array;
	}
	
	public function getValidTodayRoleMemberList($membership_id, $meeting_agenda_id){

		$function_name = "getValidTodayRoleMemberList";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}

		// Role names & id
		// {"Toastmaster",2}
		// ,{"General Evaluator",7}
		// ,{"Table Topic Master",5}
		// ,{"Timer",9}
		// ,{"Word & Quote master",4}
		// ,{"Ah & Vote Counter",10}
		// ,{"Mini Debate Master",6}
		// ,{"Grammarian",11}

		$query = 
		"SELECT MA.id AS __meeting_agenda_id"
		. " , IFNULL(ROLE.id,0) AS __role_id"
		. " , IFNULL(ROLE.name,\"\") AS __role_name"
		. " , IFNULL(MEMBER.id,-1) AS __member_id"
		. " , IFNULL(MEMBER.first_name,\"\") AS __member_first_name"
		. " , IFNULL(MEMBER.last_name,\"\") AS __member_last_name"
		. " , IFNULL(MNM.`status`,\"\") AS __member_membership_status"
		. " FROM MEETING_AGENDA AS MA"
		. " LEFT JOIN MA_ROLE ON MA_ROLE.meeting_agenda_id=MA.id "
		. " LEFT JOIN ROLE ON ROLE.id = MA_ROLE.role_id"
		. " LEFT JOIN MEMBER ON MEMBER.id = MA_ROLE.member_id"
		. " LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
		. " WHERE MA.membership_id=$membership_id"
		. " AND MA.id=$meeting_agenda_id"
		. " AND ROLE.id IN (2,7,5,9,4,10,6,11)"
		. " AND `MEMBER`.first_name NOT IN (\"NOT\")"
		. " AND `MEMBER`.last_name NOT IN (\"ASSIGNED\")"
		;

		// echo "\$query :: $query<br/>";

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	private function hasTodayRole($meeting_agenda_id, $role_id, $member_id){

		$query = 
		"SELECT COUNT(`id`) AS __today_role_cnt"
		. " FROM `MA_ROLE`"
		. " WHERE `meeting_agenda_id`=$meeting_agenda_id"
		. " AND `role_id`=$role_id"
		. " AND `member_id`=$member_id"
		;

		$json_res_obj = $this->getSelectResult($query);
		$today_role_cnt = $json_res_obj->result[0]->__today_role_cnt;

		$has_today_role = false;//false
		if($has_today_role > 0){
			$has_today_role = true;
		}

		return $has_today_role;
	}

	public function insertTodayRole($meeting_agenda_id, $role_id, $member_id){

		$query = 
		"INSERT INTO MA_ROLE"
		. " (meeting_agenda_id, role_id, member_id, regdttm, updttm)"
		. " VALUES ($meeting_agenda_id, $role_id, $member_id, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		. " ON DUPLICATE KEY UPDATE" 
		. " member_id=$member_id, updttm=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}
	public function updateTodayRole($meeting_agenda_id, $role_id, $member_id){
		// 1. 
		$has_today_role = $this->hasTodayRole($meeting_agenda_id, $role_id, $member_id);

		if($has_today_role){
			return $this->_updateTodayRole($meeting_agenda_id, $role_id, $member_id);
		} else {
			return $this->insertTodayRole($meeting_agenda_id, $role_id, $member_id);
		}
	}
	private function _updateTodayRole($meeting_agenda_id, $role_id, $member_id){

		$query = 
		"UPDATE `MA_ROLE`"
		. " SET `member_id`=$member_id,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE `role_id`=$role_id"
		. " AND `meeting_agenda_id`=$meeting_agenda_id"
		;
		
		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}



	public function deleteTodayRole($meeting_agenda_id, $role_id=null){

		$query = 
		"DELETE FROM MA_ROLE"
		. " WHERE meeting_agenda_id=$meeting_agenda_id"
		;
		if($this->isUnsignedNumber($role_id)){
			$query .= " AND role_id=$role_id";
		}

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}


	public function getTodayRoleFixedList(){

		$query = 
		"SELECT IFNULL(ROLE.`id`,0) AS __role_id"
		. " , IFNULL(ROLE.name,\"\") AS __role_name"
		. " , IFNULL(ROLE.desc,\"\") AS __role_desc"
		. " FROM ROLE"
		. " WHERE ROLE.id IN (2,7,5,9,4,10,6,11)"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}


	public function getSpeechProjectList(){

		// "NOT ASSIGNED"를 제외한 모든 프로젝트 명을 가져옴.
		$query = 
		"SELECT id AS __speech_project_id"
		. " , ordernum AS __speech_project_ordernum"
		. " , title AS __speech_project_title"
		. " FROM `SPEECH_PROJECT`"
		. " WHERE id NOT IN (86, 87, 85)"
		. " ORDER BY ordernum"
		;

		$json_res_obj = $this->getSelectResult($query);

		// "NOT ASSIGNED"를 가져옴.
		$query = 
		"SELECT id AS __speech_project_id"
		. " , ordernum AS __speech_project_ordernum"
		. " , title AS __speech_project_title"
		. " FROM `SPEECH_PROJECT`"
		. " WHERE id IN (86, 87, 85)"
		. " ORDER BY ordernum"
		;

		$json_res_obj_etc = $this->getSelectResult($query);
		$result_etc = $json_res_obj_etc->result;

		$result_merge = array_merge($result_etc, $json_res_obj->result);
		$json_res_obj->result = $result_merge;

		return $json_res_obj->result;
	}
	public function getSpeechProjectList_V2(){

		$query = 
		"SELECT SMP.id AS __speech_manual_project_id"
		. " , SMP.name AS __speech_manual_project_name"
		. " , SM.id AS __speech_manual_id"
		. " , SM.name AS __speech_manual_name"
		. " FROM `SPEECH_MANUAL_PROJECT` AS SMP"
		. " LEFT JOIN `SPEECH_MANUAL` AS SM ON SM.id=SMP.speech_manual_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getNewTodaySpeech($meeting_agenda_id){
		$this->insertTodaySpeechEmpty($meeting_agenda_id);
		return $this->selLatestTodaySpeech($meeting_agenda_id);
	}

	private function insertTodaySpeechEmpty($meeting_agenda_id){
		if($this->isNotUnsignedNumber($meeting_agenda_id)) return null;
		$this->insertTodaySpeechList($meeting_agenda_id, 1, -1, "New Speech", -1, -1, -1, -1);
	}

	public function getTimeGuideLine(){
		$query = 
		"SELECT "
		. " `id` AS __time_guide_line_id"
		. " , `role_name` AS __time_guide_line_role_name"
		. " , `sec_allocated_min` AS __time_guide_line_sec_allocated_min"
		. " , `sec_qualified_min` AS __time_guide_line_sec_qualified_min"
		. " , `sec_allocated_max` AS __time_guide_line_sec_allocated_max"
		. " , `sec_qualified_max` AS __time_guide_line_sec_qualified_max"
		. " , `sec_green` AS __time_guide_line_sec_green"
		. " , `sec_yellow` AS __time_guide_line_sec_yellow"
		. " , `sec_red`  AS __time_guide_line_sec_red"
		. " FROM `MA_TIMER_GUIDE_LINE`"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getTimeGuideLineById($time_guide_line_id){


		$function_name = "getTimeGuideLineById";
		if($this->isNotUnsignedNumber($time_guide_line_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$time_guide_line_id)<br/>";
			return;
		}

		$query = 
		"SELECT "
		. " `id` AS __time_guide_line_id"
		. " , `role_name` AS __time_guide_line_role_name"
		. " , `sec_allocated_min` AS __time_guide_line_sec_allocated_min"
		. " , `sec_qualified_min` AS __time_guide_line_sec_qualified_min"
		. " , `sec_allocated_max` AS __time_guide_line_sec_allocated_max"
		. " , `sec_qualified_max` AS __time_guide_line_sec_qualified_max"
		. " , `sec_green` AS __time_guide_line_sec_green"
		. " , `sec_yellow` AS __time_guide_line_sec_yellow"
		. " , `sec_red`  AS __time_guide_line_sec_red"
		. " FROM `MA_TIMER_GUIDE_LINE`"
		. " WHERE `id`=$time_guide_line_id"
		;

		return $this->getSelectOneResult($query);
	}

	public function getTimeGuideLineSpeech(){
		$query = 
		"SELECT "
		. " `id` AS __time_guide_line_id"
		. " , `role_name` AS __time_guide_line_role_name"
		. " , `sec_allocated_min` AS __time_guide_line_sec_allocated_min"
		. " , `sec_qualified_min` AS __time_guide_line_sec_qualified_min"
		. " , `sec_allocated_max` AS __time_guide_line_sec_allocated_max"
		. " , `sec_qualified_max` AS __time_guide_line_sec_qualified_max"
		. " , `sec_green` AS __time_guide_line_sec_green"
		. " , `sec_yellow` AS __time_guide_line_sec_yellow"
		. " , `sec_red`  AS __time_guide_line_sec_red"
		. " FROM `MA_TIMER_GUIDE_LINE`"
		. " WHERE id IN (2,3,4,7,8,9,10)"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;

	}

	public function getTimeGuideLineEvaluator(){
		$query = 
		"SELECT "
		. " `id` AS __time_guide_line_id"
		. " , `role_name` AS __time_guide_line_role_name"
		. " , `sec_allocated_min` AS __time_guide_line_sec_allocated_min"
		. " , `sec_qualified_min` AS __time_guide_line_sec_qualified_min"
		. " , `sec_allocated_max` AS __time_guide_line_sec_allocated_max"
		. " , `sec_qualified_max` AS __time_guide_line_sec_qualified_max"
		. " , `sec_green` AS __time_guide_line_sec_green"
		. " , `sec_yellow` AS __time_guide_line_sec_yellow"
		. " , `sec_red`  AS __time_guide_line_sec_red"
		. " FROM `MA_TIMER_GUIDE_LINE`"
		. " WHERE id IN (5)"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;

	}























	// speech list version 2
	public function sel_today_speech_speaker_v2($meeting_agenda_id){

		$function_name = "sel_today_speech_speaker_v2";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query = 
		"SELECT MSV2.`id` AS __speech_id"
		. " , MSV2.`meeting_agenda_id` AS __meeting_id"
		. " , MSV2.`speech_project_id` AS __speech_project_id"
		. " , SP.`title` AS __speech_project_title"
		. " , MSV2.`title` AS __title"		
		. " , MSV2.`order_num` AS __order_num"		

		. " , IFNULL(MSS.`id`,-1) AS __speaker_id"
		. " , IFNULL(MSS.`speaker_member_id`,-1) AS __speaker_member_id"
		. " , IFNULL(CONCAT(SPEAKER.first_name,' ',SPEAKER.last_name), \"Not Assigned\") AS __speaker_member_name"
		. " , IFNULL(MSS.`timer_green`,-1) AS __speaker_timer_green"
		. " , IFNULL(MSS.`timer_red`,-1) AS __speaker_timer_red"

		. " , IFNULL(MSE.`id`,-1) AS __evaluator_id"
		. " , IFNULL(MSE.`evaluator_member_id`,-1) AS __evaluator_member_id"
		. " , IFNULL(CONCAT(EVALUATOR.first_name,' ',EVALUATOR.last_name), \"Not Assigned\") AS __evaluator_member_name"
		. " , IFNULL(MSE.`timer_green`,-1) AS __evaluator_timer_green"
		. " , IFNULL(MSE.`timer_red`,-1) AS __evaluator_timer_red"

		. " , MSV2.`updttm` AS __updttm"
		. " , MSV2.`regdttm` AS __regdttm"
		. " FROM `MA_SPEECH` AS MSV2"
		. " LEFT JOIN `MA_SPEECH_SPEAKER` AS MSS ON MSS.speech_id=MSV2.id"
		. " LEFT JOIN `MA_SPEECH_EVALUATOR` AS MSE ON MSE.speech_id=MSV2.id"
		. " LEFT JOIN `SPEECH_PROJECT` AS SP ON SP.id=MSV2.speech_project_id"
		. " LEFT JOIN MEMBER AS SPEAKER ON SPEAKER.id = MSS.`speaker_member_id`"
		. " LEFT JOIN MEMBER AS EVALUATOR ON EVALUATOR.id = MSE.`evaluator_member_id`"
		. " WHERE MSV2.`meeting_agenda_id`=$meeting_agenda_id"
		. " ORDER BY MSV2.`order_num`"
		;

		//echo "$query<br/>";

		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;
	}

	public function sel_today_speech_speaker_v2_by_meeting_id_n_speech_id($meeting_agenda_id, $speech_id){

		if($this->isNotUnsignedNumber($meeting_agenda_id)) return null;
		if($this->isNotUnsignedNumber($speech_id)) return null;

		$query = 
		"SELECT MSV2.`id` AS __speech_id"
		. " , MSV2.`meeting_agenda_id` AS __meeting_id"
		. " , MSV2.`speech_project_id` AS __speech_project_id"
		. " , SP.`title` AS __speech_project_title"
		. " , MSV2.`title` AS __title"		
		. " , MSV2.`order_num` AS __order_num"		

		. " , IFNULL(MSS.`id`,-1) AS __speaker_id"
		. " , IFNULL(MSS.`speaker_member_id`,-1) AS __speaker_member_id"
		. " , CONCAT(SPEAKER.first_name,' ',SPEAKER.last_name) AS __speaker_member_name"
		. " , IFNULL(MSS.`timer_green`,-1) AS __speaker_timer_green"
		. " , IFNULL(MSS.`timer_red`,-1) AS __speaker_timer_red"

		. " , IFNULL(MSE.`id`,-1) AS __evaluator_id"
		. " , IFNULL(MSE.`evaluator_member_id`,-1) AS __evaluator_member_id"
		. " , CONCAT(EVALUATOR.first_name,' ',EVALUATOR.last_name) AS __evaluator_member_name"
		. " , IFNULL(MSE.`timer_green`,-1) AS __evaluator_timer_green"
		. " , IFNULL(MSE.`timer_red`,-1) AS __evaluator_timer_red"

		. " , MSV2.`updttm` AS __updttm"
		. " , MSV2.`regdttm` AS __regdttm"
		. " FROM `MA_SPEECH` AS MSV2"
		. " LEFT JOIN `MA_SPEECH_SPEAKER` AS MSS ON MSS.speech_id=MSV2.id"
		. " LEFT JOIN `MA_SPEECH_EVALUATOR` AS MSE ON MSE.speech_id=MSV2.id"
		. " LEFT JOIN `SPEECH_PROJECT` AS SP ON SP.id=MSV2.speech_project_id"
		. " LEFT JOIN MEMBER AS SPEAKER ON SPEAKER.id = MSS.`speaker_member_id`"
		. " LEFT JOIN MEMBER AS EVALUATOR ON EVALUATOR.id = MSE.`evaluator_member_id`"
		. " WHERE MSV2.`meeting_agenda_id`=$meeting_agenda_id"
		. " AND MSV2.`id`=$speech_id"
		. " ORDER BY MSV2.`order_num`"
		;

		// echo "$query<br/>";

		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;
	}

	public function sel_today_speech_evaluator_v2($meeting_agenda_id){
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "!Error! / sel_today_speech_evaluator_v2 / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return null;	
		}

		$query = 
		"SELECT IFNULL(MSV2.`id`, -1) AS __speech_id"
		. " , IFNULL(MSV2.`meeting_agenda_id`, -1) AS __meeting_id"
		. " , IFNULL(MSV2.`speech_project_id`, -1) AS __speech_project_id"
		. " , IFNULL(SP.`title`, \"\") AS __speech_project_title"
		. " , IFNULL(MSV2.`title`, \"\") AS __title"
		. " , IFNULL(MSE.`order_num`, -1) AS __order_num"

		. " , IFNULL(MSE.`id`,-1) AS __evaluator_id"
		. " , IFNULL(MSE.`evaluator_member_id`,-1) AS __evaluator_member_id"
		. " , IF(EVALUATOR.first_name IS NULL, \"\", CONCAT(EVALUATOR.first_name,' ',EVALUATOR.last_name)) AS __evaluator_member_name"
		. " , IFNULL(MSE.`timer_green`,-1) AS __evaluator_timer_green"
		. " , IFNULL(MSE.`timer_red`,-1) AS __evaluator_timer_red"

		. " , IFNULL(MSS.`id`,-1) AS __speaker_id"
		. " , IFNULL(MSS.`speaker_member_id`,-1) AS __speaker_member_id"
		. " , IF(SPEAKER.first_name IS NULL, \"\", CONCAT(SPEAKER.first_name,' ',SPEAKER.last_name)) AS __speaker_member_name"
		. " , IFNULL(MSE.`timer_green`,-1) AS __speaker_timer_green"
		. " , IFNULL(MSE.`timer_red`,-1) AS __speaker_timer_red"

		. " , IFNULL(MSV2.`updttm`, \"\") AS __updttm"
		. " , IFNULL(DATE_FORMAT(MSV2.`updttm`, '%Y-%m-%d %H:%i:%s'), \"\") AS __updttm_human_readable"
		. " , IFNULL(MSV2.`regdttm`,\"\") AS __regdttm"
		. " , IFNULL(DATE_FORMAT(MSV2.`regdttm`, '%Y-%m-%d %H:%i:%s'), \"\") AS __regdttm_human_readable"

		. " FROM `MA_SPEECH` AS MSV2"
		. " LEFT JOIN `MA_SPEECH_EVALUATOR` AS MSE ON MSE.speech_id=MSV2.id"
		. " LEFT JOIN `MA_SPEECH_SPEAKER` AS MSS ON MSS.speech_id=MSV2.id"
		. " LEFT JOIN `SPEECH_PROJECT` AS SP ON SP.id=MSV2.speech_project_id"
		. " LEFT JOIN MEMBER AS EVALUATOR ON EVALUATOR.id = MSE.`evaluator_member_id`"
		. " LEFT JOIN MEMBER AS SPEAKER ON SPEAKER.id = MSS.`speaker_member_id`"
		. " WHERE MSV2.`meeting_agenda_id`=$meeting_agenda_id"
		. " ORDER BY MSE.`order_num`"
		;

		// echo "$query<br/>";
		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;
	}

	public function get_speech_history($membership_id, $member_id){

		$function_name = "get_speech_history";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}


		$query = 
		"SELECT MS.id AS __speech_id"
		. " , MS.title AS __speech_title"
		. " , MS.speech_project_id AS __speech_project_id"
		. " , DATE_FORMAT(MS.regdttm, '%Y-%m-%d') AS __speech_regdttm"
		. " , SP.`title` AS __speech_project_title"
		. " , MSS.speaker_member_id AS __speech_speaker_member_id"
		. " , CONCAT(`MEMBER`.first_name, ' ', `MEMBER`.last_name) AS __speech_member_name"
		. " , MSE.evaluator_member_id AS __speech_evaluator_member_id"
		. " , CONCAT(EM.first_name, ' ', EM.last_name) AS __speech_evaluator_member_name"
		. " , CONCAT(MA.round, 'th') AS __meeting_agenda_round"
		. " FROM `MA_SPEECH_SPEAKER` AS MSS"
		. " LEFT JOIN `MA_SPEECH` AS MS ON MS.id=MSS.speech_id"
		. " LEFT JOIN `MEETING_AGENDA` AS MA ON MA.id=MS.meeting_agenda_id"
		. " LEFT JOIN `MA_SPEECH_EVALUATOR` AS MSE ON MSE.speech_id=MSS.speech_id"
		. " LEFT JOIN `SPEECH_PROJECT` AS SP ON SP.id=MS.speech_project_id"
		. " LEFT JOIN `MEMBER` ON `MEMBER`.id=MSS.speaker_member_id"
		. " LEFT JOIN `MEMBER` AS EM ON EM.id=MSE.evaluator_member_id"
		. " WHERE MSS.speaker_member_id=$member_id"
		. " AND MA.`status`='A'"
		. " AND MA.`membership_id`=$membership_id"
		. " ORDER BY MS.id DESC"
		;

		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;

	}



	public function insert_today_speech_empty_speaker_n_evaluator($meeting_agenda_id){
		return $this->insert_today_speech_v2($meeting_agenda_id, -1, 1, "No title");
	}
	private function insert_today_speech_v2(	$meeting_agenda_id
												, $order_num
												, $speech_project_id
												, $speech_title	){

		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "!Error! / insert_today_speech_v2 / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return null;	
		} 
		if(is_null($order_num)){
			echo "!Error! / insert_today_speech_v2 / is_null(\$order_num)<br/>";
			return null;
		} 
		if($this->isNotUnsignedNumber($speech_project_id)){
			echo "!Error! / insert_today_speech_v2 / \$this->isNotUnsignedNumber(\$speech_project_id)<br/>";
			return null;
		} 
		if(empty($speech_title)){
			echo "!Error! / insert_today_speech_v2 / empty(\$speech_title)<br/>";
			return null;	
		} 

		$query =
		"INSERT INTO `MA_SPEECH`("
		. " `meeting_agenda_id`, `speech_project_id`, `title`, `order_num`"
		. " ,`updttm`, `regdttm`)"
		. " VALUES ("
		. " $meeting_agenda_id,$speech_project_id,\"$speech_title\",$order_num"
		. " ,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. ")"
		;
		
		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}
	public function update_today_speech_v2(	$speech_id
											, $order_num=-1
											, $speech_project_id=-1
											, $speech_title="" ){

		if($this->isNotUnsignedNumber($speech_id)){
			echo "!Error! / insert_today_speech_v2 / \$this->isNotUnsignedNumber(\$speech_project_id)<br/>";
			return null;
		}

		$query = "";
		if($this->isUnsignedNumber($order_num)){
			$query =
			"UPDATE `MA_SPEECH`"
			. " SET `order_num`=$order_num"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_id"
			;
		} else if($this->isUnsignedNumber($speech_project_id)){
			$query =
			"UPDATE `MA_SPEECH`"
			. " SET `speech_project_id`=$speech_project_id"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_id"
			;
		} else if(!empty($speech_title)){
			$safe_speech_title = addslashes($speech_title);
			$query =
			"UPDATE `MA_SPEECH`"
			. " SET `title`=\"$safe_speech_title\""
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_id"
			;
		}

		// echo "$query<br/>";
		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}	
	public function delete_today_speech_v2($speech_id){

		if($this->isNotUnsignedNumber($speech_id)) return null;

		$result_array = array();

		// TODO delete related speakers
		$result = $this->delete_today_speech_speaker_v2($speech_id);
		array_push($result_array, $result);

		// TODO delete related evaluators
		$result = $this->delete_today_speech_evaluator_v2($speech_id);
		array_push($result_array, $result);

		$query = 
        "DELETE FROM `MA_SPEECH`"
        . " WHERE id=$speech_id"
        ;

		$json_res_obj = $this->getModifyResult($query);
		$result = $this->getSimpleResult($json_res_obj);
		array_push($result_array, $result);
		
		return $result_array;
	}
	public function upsert_today_speech_speaker_v2(	$speech_id
													, $speech_speaker_member_id
													, $speech_speaker_timer_green
													, $speech_speaker_timer_red ){

		if($this->isNotUnsignedNumber($speech_id)) return null;
		$result = $this->select_today_speech_speaker_v2($speech_id);

		$query_result;
		if(empty($result)){
			// echo "2. 이전에 없는 스피커 정보인가?<br/>";
			// echo "2-1. 이전에 없는 스피커 정보라면 인서트<br/>";
			if(	$this->isNotUnsignedNumber($speech_speaker_member_id) ){
				$speech_speaker_member_id = -1;
			}
			$speech_speaker_timer_green_default = 300;
			if( $this->isNotUnsignedNumber($speech_speaker_timer_green) ){
				$speech_speaker_timer_green = $speech_speaker_timer_green_default;
			}
			$speech_speaker_timer_red_default = 480;
			if( $this->isNotUnsignedNumber($speech_speaker_timer_red) ){
				$speech_speaker_timer_red = $speech_speaker_timer_red_default;
			}

			$query_result = 
			$this->insert_today_speech_speaker_v2(	
				$speech_id
				, $speech_speaker_member_id
				, $speech_speaker_timer_green
				, $speech_speaker_timer_red
			);

		} else {

			$query_result = 
			$this->update_today_speech_speaker_v2(
				$result[0]->__speech_speaker_id
				, $speech_speaker_member_id
				, $speech_speaker_timer_green
				, $speech_speaker_timer_red
			);
		}

		return $query_result;
	}	
	private function select_today_speech_speaker_v2($speech_id){

		if($this->isNotUnsignedNumber($speech_id)) return null;

		$query = 
		"SELECT MSS.`id` AS __speech_speaker_id"
		. " , MSS.`speech_id` AS __speech_id"
		. " , MSS.`speaker_member_id` AS __speech_speaker_member_id"
		. " , MSS.`timer_green` AS __timer_green"
		. " , MSS.`timer_red` AS __timer_red"
		. " FROM `MA_SPEECH_SPEAKER` AS MSS"
		. " WHERE MSS.speech_id=$speech_id"
		;

		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;
	}
	private function insert_today_speech_speaker_v2(	$speech_id
														, $speech_speaker_member_id
														, $speech_speaker_timer_green
														, $speech_speaker_timer_red ){

		if($this->isNotUnsignedNumber($speech_id)){
			echo "!Error! / insert_today_speech_speaker_v2 / \$this->isNotUnsignedNumber(\$speech_id)<br/>";
			return null;
		} 
		if(is_null($speech_speaker_member_id)){
			echo "!Error! / insert_today_speech_speaker_v2 / is_null(\$speech_speaker_member_id)<br/>";
			return null;
		}
		if(is_null($speech_speaker_timer_green)){
			echo "!Error! / insert_today_speech_speaker_v2 / is_null(\$speech_speaker_timer_green)<br/>";
			return null;
		} 
		if(is_null($speech_speaker_timer_red)){
			echo "!Error! / insert_today_speech_speaker_v2 / is_null(\$speech_speaker_timer_red)<br/>";
			return null;
		} 

		$query =
		"INSERT INTO `MA_SPEECH_SPEAKER`(`speech_id`"
		. " ,`speaker_member_id`, `timer_green`, `timer_red`"
		. " ,`updttm`, `regdttm`)"
		. " VALUES ($speech_id,$speech_speaker_member_id,$speech_speaker_timer_green,$speech_speaker_timer_red"
		. " ,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. ")"
		;

		// echo "$query<br/>";
		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}
	public function update_today_speech_speaker_v2(	$speech_speaker_id
													, $speech_speaker_member_id
													, $speech_speaker_timer_green
													, $speech_speaker_timer_red ){

		if($this->isNotUnsignedNumber($speech_speaker_id)){
			echo "!Error! / update_today_speech_speaker_v2 / \$this->isNotUnsignedNumber(\$speech_speaker_id)<br/>";
			return null;
		}

		if($this->isUnsignedNumber($speech_speaker_member_id)){
			$query =
			"UPDATE `MA_SPEECH_SPEAKER`"
			. " SET `speaker_member_id`=$speech_speaker_member_id"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_speaker_id"
			;

		} else if($this->isUnsignedNumber($speech_speaker_timer_green) && $this->isUnsignedNumber($speech_speaker_timer_red)){
			$query =
			"UPDATE `MA_SPEECH_SPEAKER`"
			. " SET `timer_green`=$speech_speaker_timer_green"
			. " ,`timer_red`=$speech_speaker_timer_red"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_speaker_id"
			;

		} else if($this->isUnsignedNumber($speech_speaker_timer_green)){
			$query =
			"UPDATE `MA_SPEECH_SPEAKER`"
			. " SET `timer_green`=$speech_speaker_timer_green"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_speaker_id"
			;
		} else if($this->isUnsignedNumber($speech_speaker_timer_red)){
			$query =
			"UPDATE `MA_SPEECH_SPEAKER`"
			. " SET `timer_red`=$speech_speaker_timer_red"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_speaker_id"
			;
		}

		// echo "$query<br/>";
		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}
	public function delete_today_speech_speaker_v2($speech_id){

		if($this->isNotUnsignedNumber($speech_id)) return null;

		$query = 
        "DELETE FROM `MA_SPEECH_SPEAKER`"
        . " WHERE speech_id=$speech_id"
        ;

		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}

	private function select_today_speech_evaluator_v2($speech_id){

		if($this->isNotUnsignedNumber($speech_id)){
			echo "!Error! / select_today_speech_evaluator_v2 / \$this->isNotUnsignedNumber(\$speech_id)<br/>";
			return null;
		}

		$query = 
		"SELECT MSE.`id` AS __speech_evaluator_id"
		. " , MSE.`speech_id` AS __speech_id"
		. " , MSE.`evaluator_member_id` AS __speech_evaluator_member_id"
		. " , MSE.`timer_green` AS __timer_green"
		. " , MSE.`timer_red` AS __timer_red"
		. " FROM `MA_SPEECH_EVALUATOR` AS MSE"
		. " WHERE MSE.speech_id=$speech_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}
	public function select_today_speech_evaluator_by_member_id($speech_id, $member_id){

		if($this->isNotUnsignedNumber($speech_id)){
			echo "!Error! / select_today_speech_evaluator_by_member_id / \$this->isNotUnsignedNumber(\$speech_id)<br/>";
			return null;
		}
		if($this->isNotUnsignedNumber($member_id)){
			echo "!Error! / select_today_speech_evaluator_by_member_id / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return null;
		}		

		$query = 
		"SELECT MSE.`id` AS __speech_evaluator_id"
		. " , MSE.`speech_id` AS __speech_id"
		. " , MSE.`evaluator_member_id` AS __speech_evaluator_member_id"
		. " , MSE.`timer_green` AS __timer_green"
		. " , MSE.`timer_red` AS __timer_red"
		. " FROM `MA_SPEECH_EVALUATOR` AS MSE"
		. " WHERE MSE.speech_id=$speech_id"
		. " AND MSE.evaluator_member_id=$member_id"
		. " LIMIT 1"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}
	public function get_evaluation_history($membership_id, $member_id){

		$function_name = "get_evaluation_history";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}


		$query = 
		"SELECT MS.id AS __speech_id"
		. " , MS.title AS __speech_title"
		. " , MS.speech_project_id AS __speech_project_id"
		. " , DATE_FORMAT(MS.regdttm, '%Y-%m-%d') AS __speech_regdttm"
		. " , SP.`title` AS __speech_project_title"
		. " , MSE.evaluator_member_id AS __speech_evaluator_member_id"
		. " , CONCAT(EM.first_name, ' ', EM.last_name) AS __speech_evaluator_member_name"
		. " , MSS.speaker_member_id AS __speech_speaker_member_id"
		. " , CONCAT(`MEMBER`.first_name, ' ', `MEMBER`.last_name) AS __speech_member_name"
		. " , CONCAT(MA.round, 'th') AS __meeting_agenda_round"
		. " FROM `MA_SPEECH_EVALUATOR` AS MSE"
		. " LEFT JOIN `MA_SPEECH` AS MS ON MS.id=MSE.speech_id"
		. " LEFT JOIN `MEETING_AGENDA` AS MA ON MA.id=MS.meeting_agenda_id"
		. " LEFT JOIN `MA_SPEECH_SPEAKER` AS MSS ON MSS.speech_id=MSE.speech_id"
		. " LEFT JOIN `SPEECH_PROJECT` AS SP ON SP.id=MS.speech_project_id"
		. " LEFT JOIN `MEMBER` ON `MEMBER`.id=MSS.speaker_member_id"
		. " LEFT JOIN `MEMBER` AS EM ON EM.id=MSE.evaluator_member_id"
		. " WHERE MSE.evaluator_member_id=$member_id"
		. " AND MA.`status`='A'"
		. " AND MA.membership_id=$membership_id"
		. " ORDER BY MS.id DESC"
		;

		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;

	}	
	public function insert_today_speech_evaluator_v2(	$speech_id
														, $speech_evaluator_member_id
														, $speech_evaluator_timer_green=120
														, $speech_evaluator_timer_red=180
														, $order_num=-1 ){

		if(empty($speech_id)){
			echo "!Error! / insert_today_speech_evaluator_v2 / empty(\$speech_id)<br/>";
			return null;
		} 
		if(empty($speech_evaluator_member_id)){
			echo "!Error! / insert_today_speech_evaluator_v2 / empty(\$speech_evaluator_member_id)<br/>";
			return null;
		}
		if($this->isNotUnsignedNumber($speech_evaluator_timer_green)){
			echo "!Error! / insert_today_speech_evaluator_v2 / \$this->isNotUnsignedNumber(\$speech_evaluator_timer_green)<br/>";
			return null;
		}
		if($this->isNotUnsignedNumber($speech_evaluator_timer_red)){
			echo "!Error! / insert_today_speech_evaluator_v2 / \$this->isNotUnsignedNumber(\$speech_evaluator_timer_red)<br/>";
			return null;	
		}

		$query =
		"INSERT INTO `MA_SPEECH_EVALUATOR`("
		. " `speech_id`, `evaluator_member_id`, `order_num`, `timer_green`, `timer_red`, `updttm`, `regdttm`)"
		. " VALUES ($speech_id,$speech_evaluator_member_id, $order_num, $speech_evaluator_timer_green, $speech_evaluator_timer_red"
		. " ,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. ")"
		;

		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}
	public function update_today_speech_evaluator_v2(	$speech_evaluator_id
														, $speech_id=-1
														, $speech_evaluator_member_id=-1
														, $speech_evaluator_timer_green=-1
														, $speech_evaluator_timer_red=-1
														, $order_num=-1	){

		if($this->isNotUnsignedNumber($speech_evaluator_id)){
			echo "!Error! / update_today_speech_evaluator_v2 / \$this->isNotUnsignedNumber(\$speech_evaluator_id)<br/>";
			return null;
		}


		if($this->isUnsignedNumber($speech_id)) {

			$query =
			"UPDATE `MA_SPEECH_EVALUATOR`"
			. " SET `speech_id`=$speech_id"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_evaluator_id"
			;

		}else if($this->isUnsignedNumber($speech_evaluator_member_id)) {

			$query =
			"UPDATE `MA_SPEECH_EVALUATOR`"
			. " SET `evaluator_member_id`=$speech_evaluator_member_id"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_evaluator_id"
			;

		}else if($this->isUnsignedNumber($speech_evaluator_timer_green)) {

			$query =
			"UPDATE `MA_SPEECH_EVALUATOR`"
			. " SET `timer_green`=$speech_evaluator_timer_green"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_evaluator_id"
			;

		}else if($this->isUnsignedNumber($speech_evaluator_timer_red)) {

			$query =
			"UPDATE `MA_SPEECH_EVALUATOR`"
			. " SET `timer_red`=$speech_evaluator_timer_red"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_evaluator_id"
			;

		}else if($this->isUnsignedNumber($order_num)) {

			$query =
			"UPDATE `MA_SPEECH_EVALUATOR`"
			. " SET `order_num`=$order_num"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_evaluator_id"
			;

		}

		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}
	public function delete_today_speech_evaluator_v2($speech_evaluator_id){

		if($this->isNotUnsignedNumber($speech_evaluator_id)) return null;

		$query = 
        "DELETE FROM `MA_SPEECH_EVALUATOR`"
        . " WHERE id=$speech_evaluator_id"
        ;

		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}	
	public function delete_all_today_speech_evaluator($speech_id){

		if($this->isNotUnsignedNumber($speech_id)) return null;

		$query = 
        "DELETE FROM `MA_SPEECH_EVALUATOR`"
        . " WHERE speech_id=$speech_id"
        ;

		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}	




















	/*




	Timeline




	*/

	public function copyTimeline($src_meeting_agenda_id, $new_meeting_agenda_id){
		if($this->isNotUnsignedNumber($src_meeting_agenda_id)){
			echo "mysql / copyTimeline / \$this->isNotUnsignedNumber(\$src_meeting_agenda_id)<br/>";
			return;
		}

		if($this->isNotUnsignedNumber($new_meeting_agenda_id)){
			echo "mysql / copyTimeline / \$this->isNotUnsignedNumber(\$new_meeting_agenda_id)<br/>";
			return;
		} 

		$query = 
		"INSERT INTO MA_TIMELINE (meeting_agenda_id, schedule_json_str, updttm, regdttm)"
		. " SELECT $new_meeting_agenda_id, schedule_json_str, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " FROM MA_TIMELINE"
		. " WHERE meeting_agenda_id=$src_meeting_agenda_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}

	public function copyTimelineFromTemplate($new_meeting_agenda_id, $meeting_template_id){
		if($this->isNotUnsignedNumber($meeting_template_id)){
			echo "mysql / copyTimelineFromTemplate / \$this->isNotUnsignedNumber(\$meeting_template_id)<br/>";
			return;
		}

		if($this->isNotUnsignedNumber($new_meeting_agenda_id)){
			echo "mysql / copyTimelineFromTemplate / \$this->isNotUnsignedNumber(\$new_meeting_agenda_id)<br/>";
			return;
		}

		$query = 
		"INSERT INTO MA_TIMELINE (meeting_agenda_id, schedule_json_str, updttm, regdttm)"
		. " SELECT $new_meeting_agenda_id, schedule_json_str, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " FROM MA_TIMELINE_TEMPLATE"
		. " WHERE id=$meeting_template_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}


	public function getTimeline($meeting_agenda_id){
		$query = 
		"SELECT "
		. " TIMELINE.id AS __timeline_id"
		. " ,TIMELINE.meeting_agenda_id AS __meeting_agenda_id"
		. " ,TIMELINE.schedule AS __timeline_schedule"
		. " ,TIMELINE.startdttm AS __timeline_schedule_startdttm"
		. " ,TIMELINE.updttm AS __timeline_schedule_updttm"
		. " ,TIMELINE.regdttm AS __timeline_schedule_regdttm"
		. " FROM `MA_TIMELINE` AS TIMELINE"
		. " WHERE TIMELINE.meeting_agenda_id=$meeting_agenda_id"
		. " ORDER BY TIMELINE.startdttm ASC"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getTimelineSchedule($meeting_agenda_id, $timeline_id){
		$query = 
		"SELECT "
		. " TIMELINE.id AS __timeline_id"
		. " ,TIMELINE.meeting_agenda_id AS __meeting_agenda_id"
		. " ,TIMELINE.schedule AS __timeline_schedule"
		. " ,TIMELINE.startdttm AS __timeline_schedule_startdttm"
		. " ,TIMELINE.updttm AS __timeline_schedule_updttm"
		. " ,TIMELINE.regdttm AS __timeline_schedule_regdttm"
		. " FROM `MA_TIMELINE` AS TIMELINE"
		. " WHERE TIMELINE.meeting_agenda_id=$meeting_agenda_id"
		. " AND TIMELINE.id=$timeline_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function getTimelineTemplateList(){

		$query = 
		"SELECT "
		. " TIMELINE_TEMPLATE.id AS __timeline_template_id"
		. " ,TIMELINE_TEMPLATE.title AS __timeline_template_title"
		. " ,TIMELINE_TEMPLATE.schedule_json_str AS __timeline_template_json_str"
		. " ,TIMELINE_TEMPLATE.order AS __timeline_template_order"
		. " FROM `MA_TIMELINE_TEMPLATE` AS TIMELINE_TEMPLATE"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	

	public function getTimelineScheduleSubAction($meeting_id, $timeline_id, $sub_action_idx){ // wdjung
		if($this->isNotUnsignedNumber($meeting_id)){
			echo "mysql / getTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timeline_id)){
			echo "mysql / getTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$timeline_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($sub_action_idx)){
			echo "mysql / getTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$sub_action_idx)<br/>";
			return;
		}

		// 1. 기존에 저장된 json 객체를 가져옵니다.
		$result_arr = $this->getTimelineSchedule($meeting_id, $timeline_id);

		$schedule_json_obj = null;
		if(!empty($result_arr) && count($result_arr) > 0){
			$schedule_json_obj=json_decode($result_arr[0]->__timeline_schedule);
		}
		$action_list = null;
		if(!is_null($schedule_json_obj)){
			$action_list = $schedule_json_obj->action_list;
		}
		$sub_action_name = "";
		if(!empty($action_list) && $sub_action_idx < count($action_list) && !empty($action_list[$sub_action_idx]->action_name)){
			$sub_action_name = $action_list[$sub_action_idx]->action_name;
		}

		return $sub_action_name;
	}
	public function addTimelineSchedule($meeting_id, $main_action_name, $main_action_start_time){

		if($this->isNotUnsignedNumber($meeting_id)){
			echo "mysql / addTimelineSchedule / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if(empty($main_action_name)){
			echo "mysql / addTimelineSchedule / empty(\$main_action_name)<br/>";
			return;
		}
		if(empty($main_action_start_time)){
			echo "mysql / addTimelineSchedule / empty(\$main_action_start_time)<br/>";
			return;
		}

		// 1. 저장된 객체가 없으므로 새로 만듭니다.
		//{"action_name":"Greetings","action_list":[]}
		$new_sub_action_arr = array();
		$new_schedule_json_obj = new stdClass();
		$new_schedule_json_obj->action_name=$main_action_name;
		$new_schedule_json_obj->action_list=$new_sub_action_arr;

		$schedule_json_obj=$new_schedule_json_obj;
		$schedule_json_obj->action_name=$main_action_name;

		$meeting_start_time_YYYYMMDD = "00000000";
		$main_action_start_time_HHMM = str_replace(":","",$main_action_start_time);
		$main_action_startdttm = $meeting_start_time_YYYYMMDD . $main_action_start_time_HHMM . "00";

		// 2. 저장합니다.
		$this->insertTimelineSchedule($meeting_id, json_encode($schedule_json_obj), $main_action_startdttm);
	}
	public function addTimelineScheduleSubAction($meeting_id, $timeline_id, $sub_action_name){

		if($this->isNotUnsignedNumber($meeting_id)){
			echo "mysql / addTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timeline_id)){
			echo "mysql / addTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$timeline_id)<br/>";
			return;
		}
		if(empty($sub_action_name)){
			echo "mysql / addTimelineScheduleSubAction / empty(\$sub_action_name)<br/>";
			return;
		}


		// 1. 기존에 저장된 json 객체를 가져옵니다.
		$result_arr = $this->getTimelineSchedule($meeting_id, $timeline_id);
		$schedule_json_obj = null;
		if(!empty($result_arr) && count($result_arr) > 0){
			$schedule_json_obj=json_decode($result_arr[0]->__timeline_schedule);
		}

		$action_list = $schedule_json_obj->action_list;
		if(!is_null($action_list)){
			$new_sub_action_obj = new stdClass();
			$new_sub_action_obj->action_name=$sub_action_name;
			$new_sub_action_obj->html_tag="";
			array_push($action_list, $new_sub_action_obj);
		}
		$schedule_json_obj->action_list = $action_list;

		// 2. 저장합니다.
		$this->updateTimelineSchedule($meeting_id, $timeline_id, json_encode($schedule_json_obj));

	}
	public function insertTimelineSchedule($meeting_agenda_id, $schedule_json_str, $main_action_startdttm){

		$query = 
		"INSERT INTO `MA_TIMELINE`"
		. " (meeting_agenda_id, schedule, startdttm, regdttm, updttm)"
		. " VALUES ($meeting_agenda_id, '$schedule_json_str', \"$main_action_startdttm\", DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}
	public function modifyTimelineSchedule($meeting_id, $timeline_id, $main_action_name, $main_action_start_time){

		if($this->isNotUnsignedNumber($meeting_id)){
			echo "mysql / modifyTimelineSchedule / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timeline_id)){
			echo "mysql / modifyTimelineSchedule / \$this->isNotUnsignedNumber(\$timeline_id)<br/>";
			return;
		}
		if(empty($main_action_name)){
			echo "mysql / modifyTimelineSchedule / empty(\$main_action_name)<br/>";
			return;
		}
		if(empty($main_action_start_time)){
			echo "mysql / modifyTimelineSchedule / empty(\$main_action_start_time)<br/>";
			return;
		}

		// 1. 기존에 저장된 json 객체를 가져옵니다.
		$result_arr = $this->getTimelineSchedule($meeting_id, $timeline_id);
		$schedule_json_obj = null;
		if(!empty($result_arr) && count($result_arr) > 0){
			$schedule_json_obj=json_decode($result_arr[0]->__timeline_schedule);
		}

		if(	empty($schedule_json_obj) || 
			empty($schedule_json_obj->action_name) ||
			empty($schedule_json_obj->action_list) ||
			count($schedule_json_obj->action_list) < 1){

			// 1-1. 저장된 객체가 없다면 새로 만듭니다.
			//{"action_name":"Greetings","action_list":[]}
			$new_sub_action_arr = array();
			$new_schedule_json_obj = new stdClass();
			$new_schedule_json_obj->action_name=$main_action_name;
			$new_schedule_json_obj->action_list=$new_sub_action_arr;

			$schedule_json_obj=$new_schedule_json_obj;
		}
		$schedule_json_obj->action_name=$main_action_name;

		$meeting_start_time_YYYYMMDD = "00000000";
		$main_action_start_time_HHMM = str_replace(":","",$main_action_start_time);
		$main_action_startdttm = $meeting_start_time_YYYYMMDD . $main_action_start_time_HHMM . "00";

		// 2. 저장합니다.
		$this->updateTimelineSchedule($meeting_id, $timeline_id, json_encode($schedule_json_obj), $main_action_startdttm);		
	}
	public function updateTimelineScheduleSubAction($meeting_id, $timeline_id, $update_sub_action_idx, $update_sub_action){

		if($this->isNotUnsignedNumber($meeting_id)){
			echo "mysql / updateTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timeline_id)){
			echo "mysql / updateTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$timeline_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($update_sub_action_idx)){
			echo "mysql / updateTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$update_sub_action_idx)<br/>";
			return;
		}
		if(empty($update_sub_action)){
			echo "mysql / updateTimelineScheduleSubAction / empty(\$update_sub_action)<br/>";
			return;
		}

		// 1. 기존에 저장된 json 객체를 가져옵니다.
		$result_arr = $this->getTimelineSchedule($meeting_id, $timeline_id);
		$schedule_json_obj = null;
		if(!empty($result_arr) && count($result_arr) > 0){
			$schedule_json_obj=json_decode($result_arr[0]->__timeline_schedule);
		}
		if(	!is_null($schedule_json_obj) && 
			!empty($schedule_json_obj->action_list) && 
			!is_null($schedule_json_obj->action_list[$update_sub_action_idx]) &&
			!empty($schedule_json_obj->action_list[$update_sub_action_idx]->action_name)){
			$schedule_json_obj->action_list[$update_sub_action_idx]->action_name=$update_sub_action;	
		}

		// 2. 저장합니다.
		$result = $this->updateTimelineSchedule($meeting_id, $timeline_id, json_encode($schedule_json_obj));
	}
	public function updateTimelineSchedule($meeting_agenda_id, $timeline_id, $schedule_json_str, $main_action_startdttm=null){

		$query = 
        "UPDATE `MA_TIMELINE`"
        . " SET schedule='$schedule_json_str'"
        . " ,updttm=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
        ;

        if(!empty($main_action_startdttm)){
	        $query .=
	    	" ,startdttm=\"$main_action_startdttm\""    
	        ;
        }

        $query .=
        " WHERE id=$timeline_id"
        . " AND meeting_agenda_id=$meeting_agenda_id"
        ;

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}
	public function deleteTimelineScheduleSubAction($meeting_id, $timeline_id, $sub_action_idx){

		if($this->isNotUnsignedNumber($timeline_id)){
			echo "mysql / deleteTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$timeline_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($sub_action_idx)){
			echo "mysql / deleteTimelineScheduleSubAction / \$this->isNotUnsignedNumber(\$sub_action_idx)<br/>";
			return;
		}

		// 1. 기존에 저장된 json 객체를 가져옵니다.
		$result_arr = $this->getTimelineSchedule($meeting_id, $timeline_id);
		$schedule_json_obj = null;
		if(!empty($result_arr) && count($result_arr) > 0){
			$schedule_json_obj=json_decode($result_arr[0]->__timeline_schedule);
		}

		// 서브 액션을 삭제합니다.
		$new_action_list = array();
		for ($idx = 0; $idx < count($schedule_json_obj->action_list); $idx++) {

			$action_obj = $schedule_json_obj->action_list[$idx];
			if($idx == $sub_action_idx) continue;

			array_push($new_action_list, $action_obj);
		}		
		$schedule_json_obj->action_list = $new_action_list;
		// 2. 저장합니다.
		$result = $this->updateTimelineSchedule($meeting_id, $timeline_id, json_encode($schedule_json_obj));
	}
	public function deleteTimelineSchedule($meeting_agenda_id, $timeline_id=null){

		$query = 
        "DELETE FROM `MA_TIMELINE`"
        . " WHERE meeting_agenda_id=$meeting_agenda_id"
        ;

        if($this->isUnsignedNumber($timeline_id)){
        	$query .= " AND id=$timeline_id";
        }

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}
	/*




	Timeline_V2




	*/
	public function modifyTimelineSchedule_V2($meeting_agenda_id, $schedule_json_str){

		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "mysql / modifyTimelineSchedule_V2 / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}
		if(empty($schedule_json_str)){
			echo "mysql / modifyTimelineSchedule_V2 / empty(\$schedule_json_str)<br/>";
			return;
		}

		// 1. 기존에 저장된 json 객체를 가져옵니다.
		$result_arr = $this->getTimeline_V2($meeting_agenda_id);
		if(!empty($result_arr) && count($result_arr) > 0){
			// 1-1. 저장된 내역이 있다면 업데이트합니다.
			$result = $this->updateTimelineSchedule_V2($meeting_agenda_id, $schedule_json_str);
		} else {
			// 1-1. 저장된 내역이 없다면 추가합니다.
			$result = $this->insertTimelineSchedule_V2($meeting_agenda_id, $schedule_json_str);
		}

		return $result;
	}
	public function getTimeline_V2($meeting_agenda_id){

		$function_name = "getTimeline_V2";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}

		$query = 
		"SELECT "
		. " TIMELINE.id AS __timeline_id"
		. " ,TIMELINE.meeting_agenda_id AS __meeting_agenda_id"
		. " ,TIMELINE.schedule_json_str AS __timeline_schedule_json_str"
		. " ,TIMELINE.updttm AS __timeline_schedule_updttm"
		. " ,TIMELINE.regdttm AS __timeline_schedule_regdttm"
		. " FROM `MA_TIMELINE` AS TIMELINE"
		. " WHERE TIMELINE.meeting_agenda_id=$meeting_agenda_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}
	/*
		@ Desc : 최근 클럽 타임라인을 가져옵니다.
	*/
	public function getRecentClubTimelines($meeting_membership_id, $limit=3){

		$function_name = "getRecentClubTimelines";
		if($this->isNotUnsignedNumber($meeting_membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_membership_id)<br/>";
			return;
		}

		$query = 
		"SELECT "
		. " MA.round AS __meeting_agenda_round" 
		. " , MA.theme AS __meeting_agenda_theme"
		. " , DATE_FORMAT(MA.startdttm, '%Y-%m-%d') AS __meeting_agenda_startdttm"
		. " , MT.schedule_json_str AS __timeline_schedule_json_str"
		. " FROM MEETING_AGENDA AS MA"
		. " LEFT JOIN MA_TIMELINE AS MT ON MT.meeting_agenda_id=MA.id"
		. " WHERE MA.membership_id=$meeting_membership_id"
		. " ORDER BY MA.id DESC"
		. " LIMIT $limit"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	
	private function insertTimelineSchedule_V2($meeting_agenda_id, $schedule_json_str){

		$query = 
		"INSERT INTO `MA_TIMELINE`"
		. " (meeting_agenda_id, schedule_json_str, regdttm, updttm)"
		. " VALUES ($meeting_agenda_id, '$schedule_json_str', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}
	private function updateTimelineSchedule_V2($meeting_agenda_id, $schedule_json_str){

		$function_name = "updateTimelineSchedule_V2";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}

		$query = 
        "UPDATE `MA_TIMELINE`"
        . " SET schedule_json_str='$schedule_json_str'"
        . " ,updttm=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
        . " WHERE meeting_agenda_id=$meeting_agenda_id"
        ;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}

	public function getAttendanceMembers($meeting_agenda_id){
		if(	$this->isNotUnsignedNumber($meeting_agenda_id)) return null;

		$query = ""
		. "SELECT MA.`id` AS __attendance_id"
		. " , MA.`meeting_agenda_id` AS __attendance_meeting_agenda_id"
		. " , MA.`member_id` AS __attendance_member_id"
		. " , CONCAT(`MEMBER`.`first_name`,\" \",`MEMBER`.`last_name`) AS __attendance_member_name"
		. " , MA.`membership_id` AS __attendance_membership_id"
		. " , `MEMBERSHIP`.`name` AS __attendance_membership_name"
		. " , MA.`fee` AS __attendance_fee"
		. " , MA.`updttm` AS __attendance_updttm"
		. " , MA.`regdttm` AS __attendance_regdttm" 
		. " FROM `MA_ATTENDANCE` AS MA"
		. " LEFT JOIN `MEMBER` ON `MEMBER`.id=MA.`member_id`"
		. " LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MA.`membership_id`"
		. " WHERE `meeting_agenda_id`=$meeting_agenda_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;				
	}

	// 출석 인원이 없을 때, 없는 정보를 노출해줍니다.
	public function getAttendanceMembers_V2($meeting_agenda_id){
		if(	$this->isNotUnsignedNumber($meeting_agenda_id)) return null;

		$query = ""
		. "SELECT `MEETING_AGENDA`.`id` AS __meeting_agenda_id"
		. " , `MEETING_AGENDA`.`theme` AS __meeting_agenda_theme"
		. " , `MEETING_AGENDA`.`round` AS __meeting_agenda_round"
		. " , `MEETING_AGENDA`.`startdttm` AS __meeting_agenda_startdttm"
		. " , IFNULL(MA.`id`,-1) AS __attendance_id"
		. " , IFNULL(MA.`meeting_agenda_id`,-1) AS __attendance_meeting_agenda_id"
		. " , IFNULL(MA.`member_id`,-1) AS __attendance_member_id"
		. " , IFNULL(`MEMBER`.`first_name`,\"No one is here.\") AS __attendance_member_first_name"
		. " , IFNULL(`MEMBER`.`last_name`,\"\") AS __attendance_member_last_name"
		. " , IFNULL(MA.`membership_id`,-1) AS __attendance_membership_id"
		. " , `MEMBERSHIP`.`name` AS __attendance_membership_name"
		. " , MA.`fee` AS __attendance_fee"
		. " , MA.`updttm` AS __attendance_updttm"
		. " , MA.`regdttm` AS __attendance_regdttm" 
		. " FROM `MEETING_AGENDA`"
		. " LEFT JOIN `MA_ATTENDANCE` AS MA ON MA.`meeting_agenda_id`=`MEETING_AGENDA`.id"
		. " LEFT JOIN `MEMBER` ON `MEMBER`.id=MA.`member_id`"
		. " LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MA.`membership_id`"
		. " WHERE `MEETING_AGENDA`.`id`=$meeting_agenda_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;				
	}	

	public function getAttendanceMember($meeting_agenda_id, $member_id){
		if(	$this->isNotUnsignedNumber($meeting_agenda_id)) return null;
		if(	$this->isNotUnsignedNumber($member_id)) return null;

		$query = ""
		. "SELECT `MEETING_AGENDA`.`id` AS __meeting_agenda_id"
		. " , `MEETING_AGENDA`.`theme` AS __meeting_agenda_theme"
		. " , `MEETING_AGENDA`.`round` AS __meeting_agenda_round"
		. " , `MEETING_AGENDA`.`startdttm` AS __meeting_agenda_startdttm"
		. " , IFNULL(MA.`id`,-1) AS __attendance_id"
		. " , IFNULL(MA.`member_id`,-1) AS __attendance_member_id"
		. " , IFNULL(`MEMBER`.`first_name`,\"No one is here.\") AS __attendance_member_first_name"
		. " , IFNULL(`MEMBER`.`last_name`,\"\") AS __attendance_member_last_name"
		. " , IFNULL(MA.`membership_id`,-1) AS __attendance_membership_id"
		. " , `MEMBERSHIP`.`name` AS __attendance_membership_name"
		. " , MA.`fee` AS __attendance_fee"
		. " , MA.`updttm` AS __attendance_updttm"
		. " , MA.`regdttm` AS __attendance_regdttm" 
		. " FROM `MEETING_AGENDA`"
		. " LEFT JOIN `MA_ATTENDANCE` AS MA ON MA.`meeting_agenda_id`=`MEETING_AGENDA`.id"
		. " LEFT JOIN `MEMBER` ON `MEMBER`.id=MA.`member_id`"
		. " LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MA.`membership_id`"
		. " WHERE `MEETING_AGENDA`.`id`=$meeting_agenda_id"
		. " AND `MEMBER`.`id`=$member_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;				
	}	

	public function payAttendanceFee($attendance_id){

		if(	$this->isNotUnsignedNumber($attendance_id) ) return null;

		$query = 
		"UPDATE `MA_ATTENDANCE` SET `fee`=1,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
		. " WHERE id=$attendance_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $json_res_obj->result;
	}

	// Stats - Role
	public function get_role_history($membership_id, $role_id, $member_id) {

		$function_name = "get_role_history";
		if($this->isNotUnsignedNumber($membership_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		if($this->isNotUnsignedNumber($role_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$role_id)<br/>";
			return;
		}

		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}

		$query = ""
		. "SELECT MA.id AS __meeting_agenda_id"
		. " , MA.theme AS __meeting_agenda_theme"
		. " , CONCAT(MA.round, \"th\") AS __meeting_agenda_round"
		. " , MR.id AS __meeting_role_id"
		. " , ROLE.id AS __role_id"
		. " , ROLE.`name` AS __role_name"
		. " , `MEMBER`.id AS __member_id"
		. " , CONCAT(`MEMBER`.first_name, ' ', `MEMBER`.last_name) AS __member_name"
		. " , IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
		. " , DATE_FORMAT(MR.regdttm, '%Y-%m-%d') AS __role_regdttm"
		. " FROM MA_ROLE AS MR"
		. " LEFT JOIN ROLE ON ROLE.id=MR.role_id"
		. " LEFT JOIN `MEMBER` ON `MEMBER`.id=MR.member_id"
		. " LEFT JOIN MEETING_AGENDA AS MA ON MA.id=MR.meeting_agenda_id"
		. " WHERE MR.role_id=$role_id"
		. " AND MR.member_id=$member_id"
		. " AND MA.`status`='A'"
		. " AND MA.membership_id=$membership_id"
		. " ORDER BY MA.startdttm DESC"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}


	// Stats - Speaker
	public function getSpeechCountRankingList($startdttm, $enddttm, $limit=10){

		if(	$this->isNotUnsignedNumber($startdttm)) return null;
		if(	$this->isNotUnsignedNumber($enddttm)) return null;
		if(	$this->isNotUnsignedNumber($limit)) return null;

		$query = ""
		. "SELECT `MSS`.`id` AS __speaker_id"
		. " , MSS.speech_id AS __speech_id" 
		. " , MSV2.meeting_agenda_id AS __meeting_agenda_id"
		. " , MSS.speaker_member_id AS __speaker_member_id"
		. " , COUNT(MSS.speaker_member_id) AS __speech_count"
		. " , IF(MSS.speaker_member_id > 0, CONCAT(M.first_name, \" \", M.last_name), \"\") AS __speaker_name"
		. " , MSS.timer_green AS __timer_green"
		. " , MSS.timer_red AS __timer_red"
		. " , MSS.updttm AS __updttm"
		. " , MSS.regdttm AS __regdttm"
		. " FROM MA_SPEECH_SPEAKER AS MSS"
		. " LEFT JOIN MEMBER AS M ON M.id=MSS.speaker_member_id"
		. " LEFT JOIN MA_SPEECH AS MSV2 ON MSV2.id=MSS.speech_id"
		. " WHERE MSS.speaker_member_id > -1"
		. " AND MSS.regdttm >= '$startdttm'"
		. " AND MSS.regdttm <= '$enddttm'"
		. " GROUP BY MSS.speaker_member_id"
		. " ORDER BY COUNT(MSS.speaker_member_id) DESC"
		. " LIMIT $limit"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;				
	}


	public function getEvaluatorCountRankingList($startdttm, $enddttm, $limit=10){
		
		if(	$this->isNotUnsignedNumber($startdttm)) return null;
		if(	$this->isNotUnsignedNumber($enddttm)) return null;
		if(	$this->isNotUnsignedNumber($limit)) return null;

		$query = ""
		. "SELECT `MSE`.id AS __evaluator_id"
		. " , MSE.speech_id AS __speech_id" 
		. " , MSV2.meeting_agenda_id AS __meeting_agenda_id"
		. " , MSE.evaluator_member_id AS __evaluator_member_id"
		. " , MSE.order_num AS __order_num"
		. " , COUNT(MSE.evaluator_member_id) AS __evaluation_count"
		. " , IF(MSE.evaluator_member_id > 0, CONCAT(M.first_name, \" \", M.last_name), \"\") AS __evaluator_name"
		. " , MSE.timer_green AS __timer_green"
		. " , MSE.timer_red AS __timer_red"
		. " , MSE.updttm AS __updttm"
		. " , MSE.regdttm AS __regdttm"
		. " FROM MA_SPEECH_EVALUATOR AS MSE"
		. " LEFT JOIN MEMBER AS M ON M.id=MSE.evaluator_member_id"
		. " LEFT JOIN MA_SPEECH AS MSV2 ON MSV2.id=MSE.speech_id"
		. " WHERE MSE.evaluator_member_id > -1"
		. " AND MSE.regdttm >= '$startdttm'"
		. " AND MSE.regdttm <= '$enddttm'"
		. " GROUP BY MSE.evaluator_member_id"
		. " ORDER BY COUNT(MSE.evaluator_member_id) DESC"
		. " LIMIT $limit"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;				
	}

	public function getRoleRankingList($role_id, $startdttm, $enddttm, $limit=10) {

		if(	$this->isNotUnsignedNumber($role_id)) return null;
		if(	$this->isNotUnsignedNumber($startdttm)) return null;
		if(	$this->isNotUnsignedNumber($enddttm)) return null;
		if(	$this->isNotUnsignedNumber($limit)) return null;

		$query = ""
		. "SELECT MR.id AS __meeting_role_id"
		. " , MR.meeting_agenda_id AS __meeting_agenda_id"
		. " , MR.member_id AS __member_id"
		. " , COUNT(MR.member_id) AS __role_count"
		. " , IF(MR.member_id > 0, CONCAT(M.first_name, \" \", M.last_name), \"\") AS __role_member_name"
		. " , MR.updttm AS __updttm"
		. " , MR.regdttm AS __regdttm"
		. " FROM MA_ROLE AS MR"
		. " LEFT JOIN MEMBER AS M ON M.id=MR.member_id"
		. " LEFT JOIN MEETING_AGENDA AS MA ON MA.id=MR.meeting_agenda_id"
		. " WHERE MR.role_id=$role_id"
		. " AND MR.regdttm >= '$startdttm'"
		. " AND MR.regdttm <= '$enddttm'"
		. " GROUP BY MR.member_id"
		. " ORDER BY COUNT(MR.member_id) DESC"
		. " LIMIT $limit"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;

	}




	// TIMER
	public function insertTimer($meeting_id, $timer_type_id, $member_id,$time_record_milli_sec=0,$is_qualified=false){

		$function_name = "insertTimer";
		if($this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timer_type_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_type_id)<br/>";
			return;
		}
		if($this->isNotNumber($member_id)){
			echo "$function_name / \$this->isNotNumber(\$member_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($time_record_milli_sec)){
			echo "$function_name / \$this->isNotNumber(\$time_record_milli_sec)<br/>";
			return;
		}
		$is_qualified_num = ($is_qualified == true)?1:0;

		$query = 
		"INSERT INTO `magendas`.`MA_TIMER_RECORD`(`meeting_id`,`timer_type_id`,`member_id`,`time_record_milli_sec`,`is_qualified`)"
		. "VALUES($meeting_id,$timer_type_id,$member_id,$time_record_milli_sec,$is_qualified_num)"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}


	public function updateTimerMember($timer_record_id, $member_id){

		$function_name = "updateTimerMember";
		if($this->isNotUnsignedNumber($timer_record_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_record_id)<br/>";
			return;
		}
		if($this->isNotNumber($member_id)){
			echo "$function_name / \$this->isNotNumber(\$member_id)<br/>";
			return;
		}

		$query = 
		"UPDATE `magendas`.`MA_TIMER_RECORD`"
		. " SET `member_id` = $member_id"
		. " WHERE `id` = $timer_record_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	public function updateTimerRecode($timer_record_id, $time_record_milli_sec=0,$is_qualified=false){

		$function_name = "updateTimer";
		if($this->isNotUnsignedNumber($timer_record_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_record_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($time_record_milli_sec)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$time_record_milli_sec)<br/>";
			return;
		}
		$is_qualified_num = ($is_qualified == true)?1:0;

		$query = 
		"UPDATE `magendas`.`MA_TIMER_RECORD`"
		. " SET `time_record_milli_sec` = $time_record_milli_sec"
		. " , `is_qualified` = $is_qualified_num"
		. " WHERE `id` = $timer_record_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}	

	// REMOVE ME
	/*
	public function updateTimer($meeting_id, $timer_record_id, $timer_type_id, $member_id, $time_record_milli_sec=0,$is_qualified=false){

		$function_name = "updateTimer";
		if($this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timer_record_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_record_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timer_type_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_type_id)<br/>";
			return;
		}
		if($this->isNotNumber($member_id)){
			echo "$function_name / \$this->isNotNumber(\$member_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($time_record_milli_sec)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$time_record_milli_sec)<br/>";
			return;
		}
		$is_qualified_num = ($is_qualified == true)?1:0;

		$query = 
		"UPDATE `magendas`.`MA_TIMER_RECORD`"
		. " SET `timer_type_id` = $timer_type_id"
		. " , `meeting_id` = $meeting_id"
		. " , `member_id` = $member_id"
		. " , `time_record_milli_sec` = $time_record_milli_sec"
		. " , `is_qualified` = $is_qualified_num"
		. " WHERE `id` = $timer_record_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}
	*/


	public function deleteTimer($timer_record_id){

		$function_name = "deleteTimer";
		if($this->isNotUnsignedNumber($timer_record_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_record_id)<br/>";
			return;
		}

		$query = 
		"DELETE FROM `magendas`.`MA_TIMER_RECORD`"
		. " WHERE `id` = $timer_record_id"
		;

		$json_res_obj = $this->getModifyResult($query);

		return $this->getSimpleResult($json_res_obj);
	}


	public function selectTimerList($meeting_id){

		$function_name = "selectTimerList";
		if($this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}

		$query = 
		"SELECT `MA_TIMER_RECORD`.`id` AS __timer_record_id"
		. " ,`MA_TIMER_RECORD`.`meeting_id` AS __meeting_id"
		. " ,`MA_TIMER_RECORD`.`timer_type_id` AS __timer_type_id"
		. " ,`MA_TIMER_RECORD`.`member_id` AS __member_id"
		. " ,`MA_TIMER_RECORD`.`time_record_milli_sec` AS __time_record_milli_sec"
		. " ,`MA_TIMER_RECORD`.`is_qualified` AS __is_qualified"
		. " FROM `magendas`.`MA_TIMER_RECORD`"
		. " WHERE `MA_TIMER_RECORD`.`meeting_id`=$meeting_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}

	public function selectTimerListByTimerType($meeting_id, $timer_type_id){

		$function_name = "selectTimerListByTimerType";
		if($this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timer_type_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_type_id)<br/>";
			return;
		}

		// wonder.jung

		$query = 
		"SELECT `MA_TIMER_RECORD`.`id` AS __timer_record_id"
		. " ,`MA_TIMER_RECORD`.`meeting_id` AS __meeting_id"
		. " ,`MA_TIMER_RECORD`.`timer_type_id` AS __timer_type_id"
		. " ,`MA_TIMER_RECORD`.`time_record_milli_sec` AS __time_record_milli_sec"
		. " ,`MA_TIMER_RECORD`.`is_qualified` AS __is_qualified"
		. " ,IFNULL(`MEMBER`.`hash_key`,\"\") AS __member_hash_key"		
		. " , IFNULL(CONCAT(`MEMBER`.first_name,\" \",`MEMBER`.last_name),\"\") AS __member_name"
		. " FROM `magendas`.`MA_TIMER_RECORD`"
		. " LEFT JOIN `magendas`.`MEMBER` ON `magendas`.`MEMBER`.id=`MA_TIMER_RECORD`.`member_id`"
		. " WHERE `MA_TIMER_RECORD`.`meeting_id`=$meeting_id"
		. " AND `MA_TIMER_RECORD`.`timer_type_id`=$timer_type_id"
		;

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}


	public function isQualifiedTime($timer_type_id, $time_record_millisec){

		$function_name = "isQualifiedTime";
		if($this->isNotUnsignedNumber($timer_type_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_type_id)<br/>";
			return;
		}

		if($this->isNotUnsignedNumber($time_record_millisec)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$time_record_millisec)<br/>";
			return;
		}

		$time_guide_line_obj = $this->getTimeGuideLineById($timer_type_id);
		if(is_null($time_guide_line_obj) || is_null($time_guide_line_obj->__time_guide_line_sec_qualified_max)) {
			echo "$function_name / __time_guide_line_sec_qualified_max is not valid!<br/>";
			return;
		}

		$timer_elapsed_time_sec = intval($time_record_millisec / 1000);
		if($timer_elapsed_time_sec < $time_guide_line_obj->__time_guide_line_sec_qualified_min || $time_guide_line_obj->__time_guide_line_sec_qualified_max < $timer_elapsed_time_sec) {
			return false;
		}
		return true;
	}




}

?>
