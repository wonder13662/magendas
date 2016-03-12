<?php

class MYSQLInterface{

	// cafe24의 mysql DB가 innoDB를 지원하지 않습니다.
	// 트랜잭션 사용이 불가능합니다.

	private $mysql_manager=null;

	private $COLLECTION_TYPE_LIST=1;
	private $COLLECTION_TYPE_TABLE=2;

	private $ACTION_ITEM_TYPE_TITLE_ONLY=1;
	private $ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM=2;
	private $ACTION_ITEM_TYPE_TITLE_N_TIME_MM_SS=3;
	private $ACTION_ITEM_TYPE_SELECT_BOX=4;

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

	private function getSelectResultEmptyArray($query){

		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_SELECT, $json_res_obj);

		if(strcmp($json_res_obj->message,"query is empty") == 0) {
			$json_res_obj->result = array();
		}

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

	private function get_simple_modify_result($query) {
		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}

	private function getSimpleResult($json_res_obj) {

		$result = new stdClass();
		$result->output = $json_res_obj->result;
		$result->success = false;
		if(!is_null($result->output) && $result->output == 1) {
			$result->success = true;
		}
		$result->query = $json_res_obj->query;
		$result->message = $json_res_obj->message;

		return $result;
	}

	private function getLastId($json_res_obj) {

		if(is_null($json_res_obj) || ($json_res_obj->success == FALSE)) {
			return $this->getSimpleResult($json_res_obj);			
		}

		// 입력이 성공하면 추가된 id를 돌려줍니다.
		return $this->mysql_manager->getLastId();

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

	private function is_not_equal_number($function_name="", $target_head=null, $target_tail=null, $param_name="") {

		if($this->is_null_object($function_name, $target_head, "target_head")) {
			return;
		}
		if($this->is_null_object($function_name, $target_tail, "target_tail")) {
			return;
		}

		$is_not_equal_number = !($target_head == $target_tail)?true:false;
		if($is_not_equal_number == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / is_not_equal_number($param_name)<br/>";
		}

		return $is_not_equal_number;
	}

	private function is_equal_number($function_name="", $target_head=null, $target_tail=null, $param_name="") {

		if($this->is_null_object($function_name, $target_head, "target_head")) {
			return;
		}
		if($this->is_null_object($function_name, $target_tail, "target_tail")) {
			return;
		}

		$is_equal_number = ($target_head == $target_tail)?true:false;
		if($is_equal_number == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / is_equal_number(\$$param_name)<br/>";
		}

		return $is_equal_number;
	}	

	private function is_null_object($function_name="", $target=null, $param_name="") {

		$is_null_object = is_null($target);
		if($is_null_object == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / is_null_object(\$$param_name)<br/>";
		}

		return $is_null_object;
	}

	private function is_empty($function_name="", $target, $param_name="") {

		$is_empty = empty($target);
		if($is_empty == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / empty(\$$param_name)<br/>";
		}

		return $is_empty;
	}

	private function is_over($function_name="", $target, $param_name="", $max_value=0){	
		$is_over = ($max_value < $target);
		if($is_over && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_over(\$$target) \$target :: $target \$max_value :: $max_value<br/>";
		}

		return $is_over;
	}

	private function is_action_obj($function_name="", $target, $param_name=""){
		$is_action_obj = ActionObject::is_action_obj($target);
		if($is_action_obj == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_action_obj(\$$param_name)<br/>";
		}

		return $is_action_obj;
	}

	private function is_not_action_obj($function_name="", $target, $param_name=""){
		$is_not_action_obj = ActionObject::is_not_action_obj($target);
		if($is_not_action_obj == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_not_action_obj(\$$param_name)<br/>";
		}

		return $is_not_action_obj;
	}

	private function is_action_collection($function_name="", $target, $param_name=""){
		$is_instance = ActionCollection::is_instance($target);
		if($is_instance == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_instance(\$$param_name)<br/>";
		}

		return $is_instance;
	}

	public function is_not_action_collection($function_name="", $target, $param_name=""){
		$is_not_instance = ActionCollection::is_not_instance($target);
		if($is_not_instance == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_not_instance(\$$param_name)<br/>";
		}

		return $is_not_instance;
	}	
	private function is_action_list($function_name="", $target, $param_name=""){
		return !$this->is_not_action_list($function_name, $target, $param_name);
	}
	public function is_not_action_list($function_name="", $target, $param_name=""){
		$is_not_instance = ActionCollection::is_not_instance($target);
		if($is_not_instance == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_not_instance(\$$param_name)<br/>";
		}

		if(is_null($target)) {
			return true;
		}

		$is_action_list = $target->is_list();
		if(!is_null($is_action_list) && $is_action_list == true) {
			return false;
		}
		return true;
	}	
	private function is_action_table($function_name="", $target, $param_name=""){
		return !$this->is_not_action_table($function_name, $target, $param_name);
	}
	private function is_not_action_table($function_name="", $target, $param_name=""){
		$is_not_instance = ActionCollection::is_not_instance($target);
		if($is_not_instance == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_not_instance(\$$param_name)<br/>";
		}

		$is_action_table = $target->is_table();
		if(!is_null($is_action_table) && $is_action_table == false) {
			return true;
		}
		return false;
	}

	private function is_action_item($function_name="", $target, $param_name=""){
		$is_action_item = ActionItem::is_instance($target);
		if($is_action_item == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_action_item(\$$param_name)<br/>";
		}

		return $is_action_item;
	}

	public function is_not_action_item($function_name="", $target, $param_name=""){
		$is_not_action_item = ActionItem::is_not_instance($target);
		if($is_not_action_item == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_not_action_item(\$$param_name)<br/>";
		}

		return $is_not_action_item;
	}

	private function is_action_item_type($function_name="", $target, $param_name=""){
		$is_action_item_type = ActionItem::is_valid_action_item_type($target);
		if($is_action_item_type == true && !empty($function_name) && !empty($param_name)) {
			echo "$is_action_item / \$this->is_action_item_type(\$$param_name)<br/>";
		}

		return $is_action_item;
	}

	private function is_not_action_item_type($function_name="", $target, $param_name=""){
		$is_not_action_item_type = !ActionItem::is_valid_action_item_type($target);
		if($is_not_action_item_type == true && !empty($function_name) && !empty($param_name)) {
			echo "$is_action_item / \$this->is_not_action_item_type(\$$param_name)<br/>";
		}

		return $is_action_item;
	}

	private function is_action_collection_type($function_name="", $target, $param_name=""){
		$is_action_collection_type = ActionCollection::is_valid_collection_type($target);
		if($is_action_collection_type == true && !empty($function_name) && !empty($param_name)) {
			echo "$is_action_item / \$this->is_action_collection_type(\$$param_name)<br/>";
		}

		return $is_action_item;
	}

	private function is_not_action_collection_type($function_name="", $target, $param_name=""){
		$is_not_action_collection_type = !ActionCollection::is_valid_collection_type($target);
		if($is_not_action_collection_type == true && !empty($function_name) && !empty($param_name)) {
			echo "$is_action_item / \$this->is_not_action_collection_type(\$$param_name)<br/>";
		}

		return $is_action_item;
	}

	public function is_not_unsigned_number($function_name="", $target, $param_name=""){

		$is_not_unsigned_number = !$this->isUnsignedNumber($target);
		if($is_not_unsigned_number == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_not_unsigned_number(\$$param_name)<br/>";
		}

		return $is_not_unsigned_number;

	}

	private function is_not_valid_array($function_name="", $target, $param_name=""){
		return !$this->is_valid_array($function_name, $target, $param_name);
	}
	private function is_valid_array($function_name="", $target, $param_name=""){
		$err_msg = "$function_name / \$this->is_not_valid_array($param_name)<br/>";
		if(!is_array($target)) {
			echo "$err_msg";
			return false;
		}
		if(count($target) == 0) {
			echo "$err_msg";
			return false;
		}
		return true;
	}

	// @ Deprecated
	private function isNotUnsignedNumber($target, $function_name="", $param_name=""){

		$is_not_unsigned_number = !$this->isUnsignedNumber($target);
		if($is_not_unsigned_number == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->isNotUnsignedNumber(\$$param_name)<br/>";
		}

		return $is_not_unsigned_number;
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

	// @ Private
	// @ Desc : "09:20" 형식의 시간:분 문자열인지 확인합니다. 12시간 단위
	private function is_valid_time_format_hh12_mm($target){
		if(empty($target)) {
			return false;
		}
		return preg_match("/(1[012]|0[0-9]):([0-5][0-9])/", $target);
	}
	private function is_not_valid_time_format_hh12_mm($target){
		return !$this->is_valid_time_format_hh12_mm($target);
	}


	// @ Private
	// @ Desc : "19:20" 형식의 시간:분 문자열인지 확인합니다. 24시간 단위
	private function is_valid_time_format_hh24_mm($target){
		if(empty($target)) {
			return false;
		}

		$is_over_20h = preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $target);
		$is_under_20h = preg_match("/(1[012]|0[0-9]):([0-5][0-9])/", $target);

		return ($is_over_20h || $is_under_20h);
	}
	private function is_not_valid_time_format_hh24_mm($target){
		return !$this->is_valid_time_format_hh24_mm($target);
	}
	// @ Private
	// @ Desc : "19:20" 형식의 시간:분을 초단위로 바꾸어 줍니다.
	private function convert_hh24_mm_to_seconds($str_time){

		if($this->is_not_valid_time_format_hh24_mm($str_time)) {
			return -1;
		}

		sscanf($str_time, "%d:%d", $hours, $minutes);
		$time_seconds = $hours * 3600 + $minutes * 60 + $seconds;

		return $time_seconds;
	}
	private function convert_seconds_to_hh24_mm($seconds) {

		if($this->is_not_unsigned_number(null, $seconds)) {
			return -1;
		}

		return gmdate("H:i", $seconds);
	}


	/*
		@ Public
		@ Desc : 사용자가 입력한 값을 바탕으로 hashkey를 반환합니다. 입력값이 없다면 millisec 서버 시간을 기준으로 만들어줍니다.
	*/
	public function get_hash_key($user_str=""){
		$cur_micro_time = microtime(true);
		$hash_key = MD5("$user_str $cur_micro_time");

		return $hash_key;
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



















	//    .aMMMb  dMP dMP dMMMMMP dMMMMb  dMP dMP 
	//   dMP"dMP dMP dMP dMP     dMP.dMP dMP.dMP  
	//  dMP.dMP dMP dMP dMMMP   dMMMMK"  VMMMMP   
	// dMP.MMP dMP.aMP dMP     dMP"AMF dA .dMP    
	// VMMP"MP VMMMP" dMMMMMP dMP dMP  VMMMP"     

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
		@ Public
		@ Desc : 가장 가까이 예정된 미팅의 id를 돌려줍니다.
	*/
	public function get_meeting_agenda_id_upcoming($meeting_membership_id=-1){

		$function_name = "get_meeting_agenda_id_upcoming";
		if($this->isNotUnsignedNumber($meeting_membership_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$meeting_membership_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MA.id AS __meeting_id"
			,"FROM MEETING_AGENDA AS MA"
			,"LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
			,"WHERE MA.membership_id=$meeting_membership_id"
			,"AND MA.`status`=\"A\""
			,"AND DATE_FORMAT(NOW(), '%Y%m%d000000') <= MA.startdttm"
			,"ORDER BY MA.startdttm ASC LIMIT 1"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());
		$__meeting_id = -1;
		if(!is_null($result)) {
			$__meeting_id = intval($result->__meeting_id);	
		}

		return $__meeting_id;
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


	/*
		@ Public
		@ Desc : 해당 클럽에 예정된 가장 가까운 시간의 미팅을 가져옵니다.
	*/
	public function get_upcoming_meeting_agenda($meeting_membership_id){

		$function_name = "get_upcoming_meeting_agenda";
		if($this->isNotUnsignedNumber($meeting_membership_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$meeting_membership_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MA.id AS __meeting_id"
			,", MA.round AS __round"
			,", MA.theme AS __theme"
			,", MA.startdttm AS __startdttm"
			,", DATE_FORMAT(MA.startdttm, '%Y-%m-%d') AS __startdate"
			,", MA.membership_id AS __membership_id"
			,", MEMBERSHIP.name AS __membership_name"
			,", MEMBERSHIP.desc AS __membership_desc"
			,", IFNULL(QUOTE.content,\"\") AS __quote"
			,", IFNULL(WORD.word,\"\") AS __word"
			,", IFNULL(WORD.desc,\"\") AS __word_desc"
			,"FROM MEETING_AGENDA AS MA"
			,"LEFT JOIN MA_QUOTE_OF_THE_DAY AS QUOTE ON QUOTE.meeting_agenda_id=MA.id"
			,"LEFT JOIN MA_WORD_OF_THE_DAY AS WORD ON WORD.meeting_agenda_id=MA.id"
			,"LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
			,"WHERE MA.membership_id=$meeting_membership_id"
			,"AND MA.`status`=\"A\""
			,"AND DATE_FORMAT(NOW(), '%Y%m%d000000') <= MA.startdttm"
			,"ORDER BY MA.startdttm ASC LIMIT 1"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResult($query_manager->getExecuteQuery());
		if(!is_null($json_res_obj->result) && !empty($json_res_obj->result) &&is_array($json_res_obj->result) ) {
			return $json_res_obj->result[0];
		}

		return null;
	}

	/*
		@ Public
		@ Desc : id로 미팅 아젠다 정보를 가져옵니다.
	*/
	public function get_meeting_agenda_by_id($meeting_membership_id, $meeting_id){

		$function_name = "get_meeting_agenda_by_id";
		if($this->isNotUnsignedNumber($meeting_membership_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$meeting_membership_id)<br/>";
		}
		if($this->isNotUnsignedNumber($meeting_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MA.id AS __meeting_id"
			,", MA.round AS __round"
			,", MA.theme AS __theme"
			,", MA.startdttm AS __startdttm"
			,", MA.membership_id AS __membership_id"
			,", MEMBERSHIP.name AS __membership_name"
			,", MEMBERSHIP.desc AS __membership_desc"
			,", IFNULL(QUOTE.content,\"\") AS __quote"
			,", IFNULL(WORD.word,\"\") AS __word"
			,", IFNULL(WORD.desc,\"\") AS __word_desc"
			,"FROM MEETING_AGENDA AS MA"
			,"LEFT JOIN MA_QUOTE_OF_THE_DAY AS QUOTE ON QUOTE.meeting_agenda_id=MA.id"
			,"LEFT JOIN MA_WORD_OF_THE_DAY AS WORD ON WORD.meeting_agenda_id=MA.id"
			,"LEFT JOIN MEMBERSHIP ON MEMBERSHIP.id=MA.membership_id"
			,"WHERE MA.id=$meeting_id"
			,"AND MA.membership_id=$meeting_membership_id"
			,"AND MA.`status`=\"A\""
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResult($query_manager->getExecuteQuery());
		if(!is_null($json_res_obj->result) && !empty($json_res_obj->result) &&is_array($json_res_obj->result) ) {
			return $json_res_obj->result[0];
		}

		return null;
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
		@ Public
		@ Desc : Email 주소를 키로 멤버 데이터를 가져옵니다.
	*/
	public function getMemberByEmail($email){

		$function_name = "getMemberByEmail";
		if(empty($email)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$email)<br/>";
			return;
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT `MEMBER`.id AS __member_id"
			,", IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
			,", IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
			,", CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
			,", IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
			,", IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
			,", IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
			,", IFNULL(MNM.`status`,\"\") AS __member_membership_status"
			,", IFNULL(`MEMBER`.email,\"\") AS __member_email"
			,"FROM `MEMBER`"
			,"LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
			,"LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MNM.membership_id"
			,"WHERE `MEMBER`.`email`=\"$email\""
			,"LIMIT 1"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());
		return $result;
	}

	public function getMemberByNameAndEmail($first_name, $last_name, $email, $membership_id){

		$function_name = "getMemberByNameAndEmail";
		if(empty($first_name)){
			return "$function_name / \$this->isNotUnsignedNumber(\$first_name)<br/>";
		}
		if(empty($last_name)){
			return "$function_name / \$this->isNotUnsignedNumber(\$last_name)<br/>";
		}
		if(empty($email)){
			return "$function_name / \$this->isNotUnsignedNumber(\$email)<br/>";
		}
		if($this->isNotUnsignedNumber($membership_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT `MEMBER`.id AS __member_id"
			,", IFNULL(`MEMBER`.first_name,\"\") AS __member_first_name"
			,", IFNULL(`MEMBER`.last_name,\"\") AS __member_last_name"
			,", CONCAT(`MEMBER`.first_name,\" \",last_name) AS __member_name"
			,", IFNULL(`MEMBER`.hash_key,\"\") AS __member_hash_key"
			,", IFNULL(`MEMBERSHIP`.id,-1) AS __member_membership"
			,", IFNULL(`MEMBERSHIP`.name,\"\") AS __member_membership_name"
			,", IFNULL(MNM.`status`,\"\") AS __member_membership_status"
			,", IFNULL(`MEMBER`.email,\"\") AS __member_email"
			,"FROM `MEMBER`"
			,"LEFT JOIN `MEMBER_N_MEMBERSHIP` AS MNM ON MNM.member_id=`MEMBER`.id"
			,"LEFT JOIN `MEMBERSHIP` ON `MEMBERSHIP`.id=MNM.membership_id"
			,"WHERE `MEMBER`.`first_name`=\"$first_name\""
			,"AND `MEMBER`.`last_name`=\"$last_name\""
			,"AND `MEMBER`.`email`=\"$email\""
			,"AND `MEMBERSHIP`.id=$membership_id"
			,"LIMIT 1"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());
		return $result;
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

	public function getMemberId($member_hash_key){

		$function_name = "getMemberId";
		if(empty($member_hash_key)){
			return "$function_name / empty(\$member_hash_key)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT `MEMBER`.id AS __member_id"
			,"FROM `MEMBER`"
			,"WHERE `MEMBER`.`hash_key`=\"$member_hash_key\""
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());

		$__member_id = -1;
		if(!is_null($result)) {
			$__member_id = intval($result->__member_id);
		}

		return $__member_id;
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

	public function insertMember($first_name, $last_name, $email){

		$function_name = "insertMember";
		if(empty($first_name)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$first_name)<br/>";
			return;
		}
		if(empty($last_name)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$last_name)<br/>";
			return;
		}
		if(empty($email)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$email)<br/>";
			return;
		}

		// 이메일과 이름을 조합한 해시키를 만듭니다.
		$member_hash_key = MD5("$first_name $last_name $email");

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"INSERT INTO `MEMBER`(`first_name`,`last_name`,`hash_key`,`email`,`regdttm`,`updttm`)"
			,"VALUES (\"$first_name\",\"$last_name\",\"$member_hash_key\",\"$email\""
			,",DATE_FORMAT(NOW(),'%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());

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



















	public function sel_recent_speech_id($meeting_agenda_id){

		$function_name = "sel_recent_speech_id";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MSV2.`id` AS __speech_id"
			,"FROM `MA_SPEECH` AS MSV2"
			,"ORDER BY MSV2.`id` DESC"
			,"LIMIT 1"
		
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());
		$__speech_id = -1;
		if(!is_null($result)){
			$__speech_id = intval($result->__speech_id);	
		}

		return $__speech_id;
	}



	// speech list version 2
	public function sel_speech_speaker($meeting_agenda_id){

		$function_name = "sel_speech_speaker";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query = ""
		. "SELECT MSV2.`id` AS __speech_id"
		. " , MSV2.`meeting_agenda_id` AS __meeting_id"
		. " , MSV2.`speech_project_id` AS __speech_project_id"
		. " , SP.`title` AS __speech_project_title"
		. " , MSV2.`title` AS __title"
		. " , MSV2.`order_num` AS __order_num"

		. " , IFNULL(MSS.`id`,-1) AS __speaker_id"
		. " , IFNULL(SPEAKER.hash_key,\"\") AS __speaker_member_hash_key"
		. " , IFNULL(CONCAT(SPEAKER.first_name,' ',SPEAKER.last_name), \"NOT ASSIGNED\") AS __speaker_member_name"
		. " , IFNULL(MTGL.`sec_green`,0) AS __speaker_timer_green"
		. " , IFNULL(MTGL.`sec_yellow`,0) AS __speaker_timer_yellow"
		. " , IFNULL(MTGL.`sec_red`,0) AS __speaker_timer_red"

		. " , IFNULL(MSE.`id`,-1) AS __evaluator_id"
		. " , IFNULL(EVALUATOR.hash_key,\"\") AS __evaluator_member_hash_key"
		. " , IFNULL(CONCAT(EVALUATOR.first_name,\" \",EVALUATOR.last_name), \"NOT ASSIGNED\") AS __evaluator_member_name"
		. " , 120 AS __evaluator_timer_green"
		. " , 150 AS __evaluator_timer_yellow"
		. " , 180 AS __evaluator_timer_red"

		. " , MSV2.`updttm` AS __updttm"
		. " , MSV2.`regdttm` AS __regdttm"
		. " FROM `MA_SPEECH` AS MSV2"
		. " LEFT JOIN `MA_SPEECH_SPEAKER` AS MSS ON MSS.speech_id=MSV2.id"
		. " LEFT JOIN `MA_SPEECH_EVALUATOR` AS MSE ON MSE.speech_id=MSV2.id"
		. " LEFT JOIN `SPEECH_PROJECT` AS SP ON SP.id=MSV2.speech_project_id"
		. " LEFT JOIN MEMBER AS SPEAKER ON SPEAKER.id = MSS.`speaker_member_id`"
		. " LEFT JOIN MEMBER AS EVALUATOR ON EVALUATOR.id = MSE.`evaluator_member_id`"
		. " LEFT JOIN SPEECH_MANUAL_PROJECT_N_TIME_GUIDE_LINE AS SMPNTGL ON SMPNTGL.speech_manual_project_id=MSV2.speech_project_id"
		. " LEFT JOIN SPEECH_MANUAL_PROJECT AS SMP ON SMP.id=SMPNTGL.speech_manual_project_id"
		. " LEFT JOIN MA_TIMER_GUIDE_LINE AS MTGL ON MTGL.id=SMPNTGL.time_guide_line_id"

		. " WHERE MSV2.`meeting_agenda_id`=$meeting_agenda_id"
		. " ORDER BY MSV2.`order_num`, MSV2.`id` DESC"
		;

		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;
	}

	/*
		@ Public
		@ Desc : 스피커 정보와 타이머 정보가 모두 있는 경우를 조회.
	*/
	public function sel_speaker_n_timer($meeting_agenda_id){

		$function_name = "sel_speaker_n_timer";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MS.meeting_agenda_id AS __meeting_id"
			,", MS.`id` AS __speech_id"
			,", MS.speech_project_id AS __speech_project_id"
			,", MS.title AS __speech_title"
			,", MS.`order_num` AS __speech_order_num"

			,", IFNULl(MSS.id,-1) AS __speaker_id"

			,", CONCAT(IFNULL(MEMBER_SPEAKER.first_name,\"NOT\"), \" \", IFNULL(MEMBER_SPEAKER.last_name,\"ASSIGNED\")) AS __speaker_member_name"
			,", IFNULL(MEMBER_SPEAKER.id, -1) AS __speaker_member_id"
			,", IFNULL(MEMBER_SPEAKER.hash_key, \"\") AS __speaker_member_hash_key"
			,", MS.speech_project_id AS __speaker_speech_project"
			,", IFNULL(MTGL.id, -1) AS __speaker_speech_project_time_guide_line"
			,", IFNULL(SM.id, -1) AS __speech_manual_id"
			,", IFNULL(SM.`name`, \"NO MANUAL\") AS __speech_manual_name"
			,", SMP.id AS __speech_manual_project_id"
			,", SMP.`name` AS __speech_manual_project_name"
			,", IFNULL(MTR.id, -1) AS __speech_timer_id"
			,", IFNULL(MTR.time_record_milli_sec, 0) AS __speech_timer_time_record_milli_sec"
			,", IFNULL(MTR.is_qualified,0) AS __speech_timer_is_qualified"

			,", IFNULL(MTGL.sec_qualified_min,0) AS __speech_timer_sec_qualified_min"
			,", IFNULL(MTGL.sec_green,0) AS __speech_timer_sec_green"
			,", IFNULL(MTGL.sec_yellow,0) AS __speech_timer_sec_yellow"
			,", IFNULL(MTGL.sec_red,0) AS __speech_timer_sec_red"
			,", IFNULL(MTGL.sec_qualified_max,0) AS __speech_timer_sec_qualified_max"

			,"FROM MA_SPEECH AS MS"
			,"LEFT JOIN MA_SPEECH_SPEAKER AS MSS ON MSS.speech_id=MS.id"
			,"LEFT JOIN MEMBER AS MEMBER_SPEAKER ON MEMBER_SPEAKER.id=MSS.speaker_member_id"
			,"LEFT JOIN SPEECH_MANUAL_PROJECT AS SMP ON SMP.id=MS.speech_project_id"
			,"LEFT JOIN SPEECH_MANUAL AS SM ON SM.id=SMP.speech_manual_id"
			,"LEFT JOIN MA_TIMER_RECORD AS MTR ON MTR.id=MSS.timer_record_id"
			,"LEFT JOIN SPEECH_MANUAL_PROJECT_N_TIME_GUIDE_LINE AS SMPNTGL ON SMPNTGL.speech_manual_project_id=MS.speech_project_id"
			,"LEFT JOIN MA_TIMER_GUIDE_LINE AS MTGL ON MTGL.id=SMPNTGL.time_guide_line_id"
			,"WHERE MS.meeting_agenda_id=$meeting_agenda_id"
			,"AND MTR.id IS NOT NULL"
			,"AND MS.id IS NOT NULL"
			,"ORDER BY MS.`order_num`, MS.`id` DESC"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResult($query_manager->getExecuteQuery());
		return $json_res_obj->result;
	}
	/*
		@ Public
		@ Desc : 이벨류에이터 정보와 타이머 정보가 모두 있는 경우를 조회.
	*/
	public function sel_evaluator_n_timer($meeting_agenda_id){

		$function_name = "sel_evaluator_n_timer";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$membership_id)<br/>";
			return;
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MS.meeting_agenda_id AS __meeting_id"
			,", MS.`id` AS __speech_id"
			,", MS.speech_project_id AS __speech_project_id"
			,", MS.title AS __speech_title"
			,", MS.`order_num` AS __speech_order_num"

			,", IFNULl(MSE.id,-1) AS __evaluator_id"

			,", CONCAT(IFNULL(MEMBER_EVALUATOR.first_name,\"NOT\"), \" \", IFNULL(MEMBER_EVALUATOR.last_name,\"ASSIGNED\")) AS __evaluator_member_name"
			,", IFNULL(MEMBER_EVALUATOR.id,-1) AS __evaluator_member_id"
			,", IFNULL(MEMBER_EVALUATOR.hash_key,\"\") AS __evaluator_member_hash_key"
			,", MS.speech_project_id AS __evaluator_speech_project"
			,", IFNULL(MTGL.id, -1) AS __evaluator_speech_project_time_guide_line"
			,", IFNULL(SM.id, -1) AS __speech_manual_id"
			,", IFNULL(SM.`name`, \"NO MANUAL\") AS __speech_manual_name"
			,", SMP.id AS __speech_manual_project_id"
			,", SMP.`name` AS __speech_manual_project_name"
			
			,", IFNULL(MTR.id, -1) AS __evaluation_timer_id"
			,", IFNULL(MTR.time_record_milli_sec, 0) AS __evaluation_timer_time_record_milli_sec"
			,", IFNULL(MTR.is_qualified,0) AS __evaluation_timer_is_qualified"

			,", IFNULL(MTGL.sec_qualified_min,0) AS __evaluation_timer_sec_qualified_min"
			,", IFNULL(MTGL.sec_green,0) AS __evaluation_timer_sec_green"
			,", IFNULL(MTGL.sec_yellow,0) AS __evaluation_timer_sec_yellow"
			,", IFNULL(MTGL.sec_red,0) AS __evaluation_timer_sec_red"
			,", IFNULL(MTGL.sec_qualified_max,0) AS __evaluation_timer_sec_qualified_max"

			,"FROM MA_SPEECH AS MS"
			,"LEFT JOIN MA_SPEECH_EVALUATOR AS MSE ON MSE.speech_id=MS.id"
			,"LEFT JOIN MEMBER AS MEMBER_EVALUATOR ON MEMBER_EVALUATOR.id=MSE.evaluator_member_id"
			,"LEFT JOIN SPEECH_MANUAL_PROJECT AS SMP ON SMP.id=MS.speech_project_id"
			,"LEFT JOIN SPEECH_MANUAL AS SM ON SM.id=SMP.speech_manual_id"
			,"LEFT JOIN MA_TIMER_RECORD AS MTR ON MTR.id=MSE.timer_record_id"
			,"LEFT JOIN MA_TIMER_GUIDE_LINE AS MTGL ON MTGL.id=5"
			,"WHERE MS.meeting_agenda_id=$meeting_agenda_id"
			,"AND MS.id IS NOT NULL"
			,"ORDER BY MS.`order_num`, MS.`id` DESC"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResult($query_manager->getExecuteQuery());
		return $json_res_obj->result;
	}	








	private function sel_speech_speaker_timer_id($speech_id){

		$function_name = "sel_speech_speaker_timer_id";
		if($this->isNotUnsignedNumber($speech_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$speech_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT IFNULL(MSS.`timer_record_id`,-1) AS __timer_record_id"
			,"FROM `MA_SPEECH` AS MS"
			,"LEFT JOIN `MA_SPEECH_SPEAKER` AS MSS ON MSS.speech_id=MS.id"
			,"WHERE MS.`id`=$speech_id"
			,"ORDER BY MSS.id DESC"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResultEmptyArray($query_manager->getExecuteQuery());

		return $json_res_obj->result;
	}
	private function sel_speech_evaluator_timer_id($speech_id){

		$function_name = "sel_speech_evaluator_timer_id";
		if($this->isNotUnsignedNumber($speech_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$speech_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT IFNULL(MSE.`timer_record_id`,-1) AS __timer_record_id"
			,"FROM `MA_SPEECH` AS MS"
			,"LEFT JOIN `MA_SPEECH_EVALUATOR` AS MSE ON MSE.speech_id=MS.id"
			,"WHERE MS.`id`=$speech_id"
			,"ORDER BY MSE.id DESC"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResultEmptyArray($query_manager->getExecuteQuery());

		return $json_res_obj->result;
	}

	public function sel_speech_speaker_by_meeting_id_n_speech_id($meeting_agenda_id, $speech_id){

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
		. " , IFNULL(MSE.`id`,-1) AS __evaluator_id"
		. " , IFNULL(MSE.`evaluator_member_id`,-1) AS __evaluator_member_id"
		. " , CONCAT(EVALUATOR.first_name,' ',EVALUATOR.last_name) AS __evaluator_member_name"
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

		// . " , IFNULL(MSE.`timer_green`,-1) AS __evaluator_timer_green"
		// . " , IFNULL(MSE.`timer_red`,-1) AS __evaluator_timer_red"

		. " , IFNULL(MSS.`id`,-1) AS __speaker_id"
		. " , IFNULL(MSS.`speaker_member_id`,-1) AS __speaker_member_id"
		. " , IF(SPEAKER.first_name IS NULL, \"\", CONCAT(SPEAKER.first_name,' ',SPEAKER.last_name)) AS __speaker_member_name"

		// . " , IFNULL(MSE.`timer_green`,-1) AS __speaker_timer_green"
		// . " , IFNULL(MSE.`timer_red`,-1) AS __speaker_timer_red"

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



	public function insert_speech_empty_speaker_n_evaluator($meeting_agenda_id){

		$function_name = "insert_speech_empty_speaker_n_evaluator";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return;
		}

		$result_set = new stdClass();

		$result = $this->insert_speech($meeting_agenda_id, -1, 1, "No title");
		if(is_int($result) && (0 < $result)) {
			$new_speech_id = $result;
			$result_set->new_speech_id = $new_speech_id;
		} else {
			$result_set->insert_speech = $result;
			return $result_set;
		}

		// SPEAKER
		// 빈 speaker 값을 만들어 넣어줍니다.
		$MEMBER_ID_NOT_ASSIGNED = -1;
		$result = 
		$this->insert_speech_speaker(	
			// $speech_id
			$new_speech_id
			// $speech_speaker_member_id
			, $MEMBER_ID_NOT_ASSIGNED
		);
		if(is_int($result) && (0 < $result)) {
			$new_speech_speaker_id = $result;
			$result_set->new_speech_speaker_id = $new_speech_speaker_id;
		} else {
			$result_set->insert_speech_speaker = $result;
			return $result_set;
		}

		// 생성한 speaker에 넣을 timer를 만들어 추가해줍니다.
		$TIMER_TYPE_ID_ICE_BREAK_SPEECH = $this->sel_default_speech_project_id();
		$result = 
		$this->insertTimer(
			// $meeting_id
			$meeting_agenda_id
			// $timer_type_id
			, $TIMER_TYPE_ID_ICE_BREAK_SPEECH
			// $member_id
			, $MEMBER_ID_NOT_ASSIGNED
		);
		if(is_int($result) && (0 < $result)) {
			$new_timer_record_id_speaker = $result;
			$result_set->new_timer_record_id_speaker = $new_timer_record_id_speaker;
		} else {
			$result_set->insertTimerSpeaker = $result;
			return $result_set;
		}

		// 추가한 TIMER의 아이디를 SPEECH_SPEAKER의 timer_record_id 컬럼에 추가합니다.
		$query_output = 
		$this->update_speech_speaker_timer(
			// $speech_speaker_id
			$new_speech_speaker_id
			// $timer_record_id
			, $new_timer_record_id_speaker
		);
		$result_set->update_speech_speaker_timer = $query_output;


		// EVALUATOR
		// 빈 evaluator 값을 만들어 넣어줍니다.
		$result = 
		$this->insert_speech_evaluator(
			// $speech_id
			$new_speech_id
			// $speech_evaluator_member_id
			, $MEMBER_ID_NOT_ASSIGNED
		);
		if(is_int($result) && (0 < $result)) {
			$new_speech_evaluator_id = $result;
			$result_set->new_speech_evaluator_id = $new_speech_evaluator_id;
		} else {
			$result_set->insert_speech_evaluator = $result;
			return $result_set;
		}

		// 생성한 evaluator에 넣을 timer를 만들어 추가해줍니다.
		$TIMER_TYPE_ID_EVALUATOR = 5;
		$result = 
		$this->insertTimer(
			// $meeting_id
			$meeting_agenda_id
			// $timer_type_id
			, $TIMER_TYPE_ID_EVALUATOR
			// $member_id
			, $MEMBER_ID_NOT_ASSIGNED
		);
		if(is_int($result) && (0 < $result)) {
			$new_timer_record_id_evaluator = $result;
			$result_set->new_timer_record_id_evaluator = $new_timer_record_id_evaluator;
		} else {
			$result_set->insertTimerEvaluator = $result;
			return $result_set;
		}

		// 추가한 TIMER의 아이디를 SPEECH_SPEAKER의 timer_record_id 컬럼에 추가합니다.
		$query_output = 
		$this->update_speech_evaluator_timer(
			// $speech_evaluator_id
			$new_speech_evaluator_id
			// $timer_record_id
			, $new_timer_record_id_evaluator
		);
		$result_set->update_speech_evaluator_timer = $query_output;

		return $result_set;
	}
	private function insert_speech(	$meeting_agenda_id
									, $order_num
									, $speech_project_id
									, $speech_title	){

		$function_name = "insert_speech";
		if($this->isNotUnsignedNumber($meeting_agenda_id)){
			echo "!Error! / $function_name / \$this->isNotUnsignedNumber(\$meeting_agenda_id)<br/>";
			return null;	
		} 
		if(is_null($order_num)){
			echo "!Error! / $function_name / is_null(\$order_num)<br/>";
			return null;
		} 
		if($this->isNotUnsignedNumber($speech_project_id)){
			echo "!Error! / $function_name / \$this->isNotUnsignedNumber(\$speech_project_id)<br/>";
			return null;
		} 
		if(empty($speech_title)){
			echo "!Error! / $function_name / empty(\$speech_title)<br/>";
			return null;	
		} 

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"INSERT INTO `MA_SPEECH`(`meeting_agenda_id`, `speech_project_id`, `title`, `order_num`,`updttm`, `regdttm`)"
			," VALUES ($meeting_agenda_id,$speech_project_id,\"$speech_title\",$order_num, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());

		return $this->getLastId($json_res_obj);
	}
	public function update_speech(	$speech_id
									, $order_num=-1
									, $speech_project_id=-1
									, $speech_title="" ){

		$function_name = "update_speech";
		if($this->isNotUnsignedNumber($speech_id)){
			return "!Error! / $function_name / \$this->isNotUnsignedNumber(\$speech_project_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		if($this->isUnsignedNumber($order_num)){

			$query_array = 
			array(
				"UPDATE `MA_SPEECH`"
				,"SET `order_num`=$order_num"
				,",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
				,"WHERE id=$speech_id"
			);

		} else if($this->isUnsignedNumber($speech_project_id)){

			$query_array = 
			array(
				"UPDATE `MA_SPEECH`"
				,"SET `speech_project_id`=$speech_project_id"
				,",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
				,"WHERE id=$speech_id"
			);

		} else if(!empty($speech_title)){

			$safe_speech_title = addslashes($speech_title);
			$query_array = 
			array(
				"UPDATE `MA_SPEECH`"
				,"SET `title`=\"$safe_speech_title\""
				,",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
				,"WHERE id=$speech_id"
			);

		}
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());
		return $this->getSimpleResult($json_res_obj);
	}	
	public function delete_speech($speech_id){

		if($this->isNotUnsignedNumber($speech_id)) return null;

		$result_set = new stdClass();

		$speaker_timer_id_list = $this->sel_speech_speaker_timer_id($speech_id);
		$result_set->speaker_timer_id_list = $speaker_timer_id_list;
		for($idx = 0;$idx < count($speaker_timer_id_list); $idx++) {
			$speaker_timer_obj = $speaker_timer_id_list[$idx];
			$speaker_timer_id = $speaker_timer_obj->__timer_record_id;
			// delete related speaker timer
			if($this->isUnsignedNumber($speaker_timer_id)) {
				$result = $this->deleteTimer($speaker_timer_id);
				$result_set->deleteTimerSpeaker = $result;
			}
		}
		$evaluator_timer_id_list = $this->sel_speech_evaluator_timer_id($speech_id);
		$result_set->evaluator_timer_id_list = $evaluator_timer_id_list;
		for($idx = 0;$idx < count($evaluator_timer_id_list); $idx++) {
			$evaluator_timer_obj = $evaluator_timer_id_list[$idx];
			$evaluator_timer_id = $evaluator_timer_obj->__timer_record_id;
			// delete related evaluator timer
			if($this->isUnsignedNumber($evaluator_timer_id)) {
				$result = $this->deleteTimer($evaluator_timer_id);
				$result_set->deleteTimerEvaluator = $result;
			}
		}

		// delete related speakers
		$result = $this->delete_speech_speaker($speech_id);
		$result_set->delete_speech_speaker = $result;

		// delete related evaluators
		$result = $this->delete_speech_evaluator($speech_id);
		$result_set->delete_speech_evaluator = $result;

		$query_manager = new MYSQLQueryManager();
		$query_array = array("DELETE FROM `MA_SPEECH` WHERE id=$speech_id");
		$query_manager->addQueryLineArr($query_array);

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());
		$result = $this->getSimpleResult($json_res_obj);
		$result_set->delete_speech = $result;
		
		return $result_set;
	}
	public function upsert_speech_speaker(	$speech_id
													, $speech_speaker_member_id ){

		if($this->isNotUnsignedNumber($speech_id)) return null;
		$result = $this->select_speech_speaker($speech_id);

		$query_result;
		if(empty($result)){
			// echo "2. 이전에 없는 스피커 정보인가?<br/>";
			// echo "2-1. 이전에 없는 스피커 정보라면 인서트<br/>";
			if(	$this->isNotUnsignedNumber($speech_speaker_member_id) ){
				$speech_speaker_member_id = -1;
			}

			$query_result = 
			$this->insert_speech_speaker(	
				$speech_id
				, $speech_speaker_member_id
			);

		} else {

			$query_result = 
			$this->update_speech_speaker(
				$result[0]->__speech_speaker_id
				, $speech_speaker_member_id
			);
		}

		return $query_result;
	}	
	private function select_speech_speaker($speech_id){

		if($this->isNotUnsignedNumber($speech_id)) return null;

		$query = 
		"SELECT MSS.`id` AS __speech_speaker_id"
		. " , MSS.`speech_id` AS __speech_id"
		. " , MSS.`speaker_member_id` AS __speech_speaker_member_id"
		. " FROM `MA_SPEECH_SPEAKER` AS MSS"
		. " WHERE MSS.speech_id=$speech_id"
		;

		$json_res_obj = $this->getSelectResult($query);
		return $json_res_obj->result;
	}
	private function select_recent_speech_speaker_id($speech_id){

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MSS.`id` AS __speech_speaker_id"
			,", MSS.`speech_id` AS __speech_id"
			,", MSS.`speaker_member_id` AS __speech_speaker_member_id"
			,"FROM `MA_SPEECH_SPEAKER` AS MSS"
			,"WHERE MSS.speech_id=$speech_id"
			,"ORDER BY MSS.`id` DESC"
			,"LIMIT 1"
		);
		$query_manager->addQueryLineArr($query_array);
		//$query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());
		if(!is_null($result) && !is_null($result->__speech_speaker_id)) {
			$__speech_speaker_id = intval($result->__speech_speaker_id);
		}

		return $__speech_speaker_id;
	}

	private function insert_speech_speaker(	$speech_id, $speech_speaker_member_id ){

		if($this->isNotUnsignedNumber($speech_id)){
			return "!Error! / insert_speech_speaker / \$this->isNotUnsignedNumber(\$speech_id)<br/>";
		} 
		if(is_null($speech_speaker_member_id)){
			return "!Error! / insert_speech_speaker / is_null(\$speech_speaker_member_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"INSERT INTO `MA_SPEECH_SPEAKER`(`speech_id` ,`speaker_member_id` ,`updttm`, `regdttm`)"
			,"VALUES ($speech_id,$speech_speaker_member_id,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());

		return $this->getLastId($json_res_obj);
	}
	public function update_speech_speaker(	$speech_speaker_id, $speech_speaker_member_id ){

		if($this->isNotUnsignedNumber($speech_speaker_id)){
			echo "!Error! / update_speech_speaker / \$this->isNotUnsignedNumber(\$speech_speaker_id)<br/>";
			return null;
		}

		if($this->isUnsignedNumber($speech_speaker_member_id)){
			$query =
			"UPDATE `MA_SPEECH_SPEAKER`"
			. " SET `speaker_member_id`=$speech_speaker_member_id"
			. " ,`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			. " WHERE id=$speech_speaker_id"
			;
		}

		// echo "$query<br/>";
		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}
	private function update_speech_speaker_timer( $speech_speaker_id, $timer_record_id ){

		$function_name = "update_speech_speaker_timer";
		if($this->isNotUnsignedNumber($speech_speaker_id)){
			echo "!Error! / $function_name / \$this->isNotUnsignedNumber(\$speech_speaker_id)<br/>";
			return null;
		}

		if($this->isNotUnsignedNumber($timer_record_id)){
			echo "!Error! / $function_name / \$this->isNotUnsignedNumber(\$timer_record_id)<br/>";
			return null;
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"UPDATE `MA_SPEECH_SPEAKER`"
			,"SET `timer_record_id`=$timer_record_id"
			,",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			,"WHERE id=$speech_speaker_id"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());
		return $this->getSimpleResult($json_res_obj);
	}

	public function delete_speech_speaker($speech_id){

		if($this->isNotUnsignedNumber($speech_id)) return null;

		$query = 
        "DELETE FROM `MA_SPEECH_SPEAKER`"
        . " WHERE speech_id=$speech_id"
        ;

		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}
	public function select_recent_speech_evaluator_id($speech_id){

		$function_name = "select_recent_speech_evaluator_id";

		if($this->isNotUnsignedNumber($speech_id)){
			return "!Error! / $function_name / \$this->isNotUnsignedNumber(\$speech_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT MSE.`id` AS __speech_evaluator_id"
			,"FROM `MA_SPEECH_EVALUATOR` AS MSE"
			,"WHERE MSE.speech_id=$speech_id"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());
		if(!is_null($result)) {
			$__speech_evaluator_id = intval($result->__speech_evaluator_id);
		}

		return $__speech_evaluator_id;
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
	public function insert_speech_evaluator($speech_id, $speech_evaluator_member_id, $order_num=-1){

		$function_name = "insert_speech_evaluator";
		if(empty($speech_id)){
			return "!Error! / $function_name / empty(\$speech_id)";
		} 
		if(empty($speech_evaluator_member_id)){
			return "!Error! / $function_name / empty(\$speech_evaluator_member_id)";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"INSERT INTO `MA_SPEECH_EVALUATOR`(`speech_id`, `evaluator_member_id`, `order_num`, `updttm`, `regdttm`)"
			,"VALUES ($speech_id,$speech_evaluator_member_id, $order_num ,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());

		return $this->getLastId($json_res_obj);

	}
	public function update_speech_evaluator(	$speech_evaluator_id
												, $speech_id=-1
												, $speech_evaluator_member_id=-1
												, $order_num=-1	){

		if($this->isNotUnsignedNumber($speech_evaluator_id)){
			echo "!Error! / update_speech_evaluator / \$this->isNotUnsignedNumber(\$speech_evaluator_id)<br/>";
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
	private function update_speech_evaluator_timer( $speech_evaluator_id, $timer_record_id ){

		$function_name = "update_speech_evaluator_timer";
		if($this->isNotUnsignedNumber($speech_evaluator_id)){
			return "!Error! / $function_name / \$this->isNotUnsignedNumber(\$speech_evaluator_id)";
		}

		if($this->isNotUnsignedNumber($timer_record_id)){
			return "!Error! / $function_name / \$this->isNotUnsignedNumber(\$timer_record_id)";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"UPDATE `MA_SPEECH_EVALUATOR`"
			,"SET `timer_record_id`=$timer_record_id"
			,",`updttm`=DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')"
			,"WHERE id=$speech_evaluator_id"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());
		return $this->getSimpleResult($json_res_obj);
	}	
	public function delete_speech_evaluator($speech_evaluator_id){

		if($this->isNotUnsignedNumber($speech_evaluator_id)) return null;

		$query = 
        "DELETE FROM `MA_SPEECH_EVALUATOR`"
        . " WHERE id=$speech_evaluator_id"
        ;

		$json_res_obj = $this->getModifyResult($query);
		return $this->getSimpleResult($json_res_obj);
	}	
	public function delete_all_speech_evaluator($speech_id){

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
			return "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)";
		}
		if($this->isNotUnsignedNumber($timer_type_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$timer_type_id)";
		}
		if($this->isNotNumber($member_id)){
			return "$function_name / \$this->isNotNumber(\$member_id)";
		}
		if($this->isNotUnsignedNumber($time_record_milli_sec)){
			return "$function_name / \$this->isNotNumber(\$time_record_milli_sec)";
		}
		$is_qualified_num = ($is_qualified == true)?1:0;


		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"INSERT INTO `magendas`.`MA_TIMER_RECORD`(`meeting_id`,`timer_type_id`,`member_id`,`time_record_milli_sec`,`is_qualified`)"
			, "VALUES($meeting_id,$timer_type_id,$member_id,$time_record_milli_sec,$is_qualified_num)"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());

		return $this->getLastId($json_res_obj);
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




	public function deleteTimer($timer_record_id){

		$function_name = "deleteTimer";
		if($this->isNotUnsignedNumber($timer_record_id)){
			return "$function_name / \$this->isNotUnsignedNumber(\$timer_record_id)<br/>";
		}

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array("DELETE FROM `magendas`.`MA_TIMER_RECORD` WHERE `id` = $timer_record_id");
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getModifyResult($query_manager->getExecuteQuery());

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

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT `MA_TIMER_RECORD`.`id` AS __timer_record_id"
			,",`MA_TIMER_RECORD`.`meeting_id` AS __meeting_id"
			,",`MA_TIMER_RECORD`.`timer_type_id` AS __timer_type_id"
			,",`MA_TIMER_RECORD`.`time_record_milli_sec` AS __time_record_milli_sec"
			,",`MA_TIMER_RECORD`.`is_qualified` AS __is_qualified"
			,",IFNULL(`MEMBER`.`hash_key`,\"\") AS __member_hash_key"		
			,", IFNULL(CONCAT(`MEMBER`.first_name,\"\",`MEMBER`.last_name),\"\") AS __member_name"
			,"FROM `magendas`.`MA_TIMER_RECORD`"
			,"LEFT JOIN `magendas`.`MEMBER` ON `magendas`.`MEMBER`.id=`MA_TIMER_RECORD`.`member_id`"
			,"WHERE `MA_TIMER_RECORD`.`meeting_id`=$meeting_id"
			,"AND `MA_TIMER_RECORD`.`timer_type_id`=$timer_type_id"
			,"ORDER BY `MA_TIMER_RECORD`.`id` DESC"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResultEmptyArray($query_manager->getExecuteQuery());

		return $json_res_obj->result;
	}

	public function selectTimerListByTimerTypeNMemberId($meeting_id, $timer_type_id, $member_id){

		$function_name = "selectTimerListByTimerTypeNMemberId";
		if($this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timer_type_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_type_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}


		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT `MA_TIMER_RECORD`.`id` AS __timer_record_id"
			,",`MA_TIMER_RECORD`.`meeting_id` AS __meeting_id"
			,",`MA_TIMER_RECORD`.`timer_type_id` AS __timer_type_id"
			,",`MA_TIMER_RECORD`.`time_record_milli_sec` AS __time_record_milli_sec"
			,",`MA_TIMER_RECORD`.`is_qualified` AS __is_qualified"
			,",IFNULL(`MEMBER`.`hash_key`,\"\") AS __member_hash_key"		
			,", IFNULL(CONCAT(`MEMBER`.first_name,\"\",`MEMBER`.last_name),\"\") AS __member_name"
			,"FROM `magendas`.`MA_TIMER_RECORD`"
			,"LEFT JOIN `magendas`.`MEMBER` ON `magendas`.`MEMBER`.id=`MA_TIMER_RECORD`.`member_id`"
			,"WHERE `MA_TIMER_RECORD`.`meeting_id`=$meeting_id"
			,"AND `MA_TIMER_RECORD`.`timer_type_id`=$timer_type_id"
			,"AND `MA_TIMER_RECORD`.`member_id`=$member_id"
			,"ORDER BY `MA_TIMER_RECORD`.`id` DESC"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$json_res_obj = $this->getSelectResult($query);

		return $json_res_obj->result;
	}	

	public function selectRecentTimerId($meeting_id, $timer_type_id, $member_id){

		$function_name = "selectRecentTimer";
		if($this->isNotUnsignedNumber($meeting_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$meeting_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($timer_type_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$timer_type_id)<br/>";
			return;
		}
		if($this->isNotUnsignedNumber($member_id)){
			echo "$function_name / \$this->isNotUnsignedNumber(\$member_id)<br/>";
			return;
		}


		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT `MA_TIMER_RECORD`.`id` AS __timer_record_id"
			,"FROM `magendas`.`MA_TIMER_RECORD`"
			,"WHERE `MA_TIMER_RECORD`.`meeting_id`=$meeting_id"
			,"AND `MA_TIMER_RECORD`.`timer_type_id`=$timer_type_id"
			,"AND `MA_TIMER_RECORD`.`member_id`=$member_id"
			,"ORDER BY `MA_TIMER_RECORD`.`id` DESC"
			,"LIMIT 1"
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query);
		if(!is_null($result) && !is_null($result->__timer_record_id)) {
			return $result->__timer_record_id;
		}
	}		

	/*
		@ Public 
		@ Desc : 스피치 관련 프로젝트 타이머만 가져옵니다.
	*/
	public function selectTimerListOnSpeechProject(){

		$query = 
		"SELECT SMP.id AS speech_manual_project_id"
		. " , SMP.`name` AS speech_manual_project_name"
		. " , SM.id AS speech_manual_id"
		. " , SM.`name` AS speech_manual_name"
		. " , MTGL.sec_allocated_min"
		. " , MTGL.sec_qualified_min"
		. " , MTGL.sec_allocated_max"
		. " , MTGL.sec_qualified_max"
		. " , MTGL.sec_green"
		. " , MTGL.sec_yellow"
		. " , MTGL.sec_red"
		. " FROM magendas.SPEECH_MANUAL_PROJECT AS SMP"
		. " LEFT JOIN SPEECH_MANUAL AS SM ON SM.id=SMP.speech_manual_id"
		. " LEFT JOIN SPEECH_MANUAL_PROJECT_N_TIME_GUIDE_LINE AS SMPNTGL ON SMPNTGL.speech_manual_project_id=SMP.id"
		. " LEFT JOIN MA_TIMER_GUIDE_LINE AS MTGL ON MTGL.id=SMPNTGL.time_guide_line_id"
		;		
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


	/*
		@ Public
		@ Desc : 스피치를 생성할때 지정할 스피치 프로젝트 timer 기본값을 가져옵니다.
	*/
	public function sel_default_speech_project_id() {

		$query_manager = new MYSQLQueryManager();
		$query_array = 
		array(
			"SELECT time_guide_line_id AS __time_guide_line_id"
			, "FROM magendas.SPEECH_MANUAL_PROJECT_N_TIME_GUIDE_LINE"
			, "WHERE speech_manual_project_id=1"
		
		);
		$query_manager->addQueryLineArr($query_array);
		// $query_manager->printFormattedQuery();

		$result = $this->getSelectOneResult($query_manager->getExecuteQuery());
		if(!is_null($result)) {
			$__time_guide_line_id = $result->__time_guide_line_id;	
		}

		return $__time_guide_line_id;
	}





























	//     .aMMMb  .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb        .aMMMb  .aMMMb  dMP     dMP     dMMMMMP .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb 
	//    dMP"dMP dMP"VMP   dMP   amr dMP"dMP dMP dMP       dMP"VMP dMP"dMP dMP     dMP     dMP     dMP"VMP   dMP   amr dMP"dMP dMP dMP 
	//   dMMMMMP dMP       dMP   dMP dMP dMP dMP dMP       dMP     dMP dMP dMP     dMP     dMMMP   dMP       dMP   dMP dMP dMP dMP dMP  
	//  dMP dMP dMP.aMP   dMP   dMP dMP.aMP dMP dMP       dMP.aMP dMP.aMP dMP     dMP     dMP     dMP.aMP   dMP   dMP dMP.aMP dMP dMP   
	// dMP dMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP        VMMMP"  VMMMP" dMMMMMP dMMMMMP dMMMMMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP    

	/*
		@ Public
		@ Desc : ACTION COLLECTION을 추가합니다. 새로 추가한 객체의 id를 돌려줍니다.
	*/
	private function insert_action_collection($type, $name) {
		
		if($this->is_not_unsigned_number(__FUNCTION__, $type, "type")){
			return;
		}
		if($this->is_empty(__FUNCTION__, $name, "name")){
			return;
		}

		$hash_key = $this->get_hash_key("$type $name");

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO ACTION_COLLECTION(`hash_key`,`type`,`name`)"
				,"VALUES (\"$hash_key\",$type,\"$name\")"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가된 collection의 id를 가져옵니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT `id` AS __action_collection_id"
				,"FROM ACTION_COLLECTION"
				,"WHERE `hash_key`=\"$hash_key\""
				,"ORDER BY id DESC"
				,"LIMIT 1"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}

		$__action_collection_id = -1;
		$result = $query_manager->get_result();
		if(!is_null($result)) {
			$__action_collection_id = $result->__action_collection_id;	
		}

		return $__action_collection_id;
	}

	/*
		@ Public
		@ Desc : ACTION COLLECTION을 추가합니다. 새로 추가한 객체의 id를 돌려줍니다.
	*/
	private function insert_action_collection_n_meeting_agenda($action_collection_id, $meeting_agenda_id) {
		
		if($this->is_not_unsigned_number(__FUNCTION__, $action_collection_id, "action_collection_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $meeting_agenda_id, "meeting_agenda_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO ACTION_COLLECTION_N_MEETING_AGENDA(`action_collection_id`,`meeting_agenda_id`,`regdttm`)"
				,"VALUES($action_collection_id,$meeting_agenda_id,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}
	}

	/*
		@ Public
		@ Desc : 해당 collection id가 테이블 타입인지 확인합니다. true, false를 돌려줍니다.
	*/
	private function is_instance_type($collection_id, $collection_type) {

		if($this->is_not_unsigned_number(__FUNCTION__, $collection_id, "collection_id")){
			return false;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $collection_type, "collection_type")){
			return false;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AC.`type` AS __list_type"
				,"FROM ACTION_COLLECTION AS AC"
				,"WHERE AC.`id`=$collection_id"
				,"AND AC.`type`=$collection_type"
				,"LIMIT 1"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return false;
		}
		// $query_manager->show_result();
		$collection_obj = $query_manager->get_result();

		if(is_null($collection_obj)) {
			return false;
		}
		return true;
	}
	/*
		@ Public
		@ Desc : 해당 collection id가 테이블 타입인지 확인합니다. true, false를 돌려줍니다.
	*/
	private function is_instance_table_type($table_id) {
		if($this->is_not_unsigned_number(__FUNCTION__, $table_id, "table_id")){
			return false;
		}

		return $this->is_instance_type($table_id, $this->COLLECTION_TYPE_TABLE);
	}	
	/*
		@ Public
		@ Desc : 해당 collection id가 리스트 타입인지 확인합니다. true, false를 돌려줍니다.
	*/
	private function is_instance_list_type($list_id) {

		if($this->is_not_unsigned_number(__FUNCTION__, $list_id, "list_id")){
			return false;
		}

		return $this->is_instance_type($list_id, $this->COLLECTION_TYPE_LIST);
	}

	/*
		@ Public
		@ Desc : PARENT TABLE과 CHILD LIST의 관계 정보를 추가합니다. 돌려주는 값은 없습니다.
	*/
	private function insert_parent_action_table_n_child_action_list($parent_action_table_id=-1, $child_column_action_list_id=-1) {
		
		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_table_id, "parent_action_table_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $child_column_action_list_id, "child_column_action_list_id")){
			return;
		}

		// 해당 리스트에 이전에 등록된 아이템 목록을 가져옵니다.
		// 추가되는 아이템은 리스트의 가장 마지막에 추가됩니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(PATNCCAL.child_column_action_list_id) AS __child_column_list_cnt"
				,"FROM PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST AS PATNCCAL"
				,"WHERE PATNCCAL.parent_action_table_id=$parent_action_table_id"
				,"ORDER BY PATNCCAL.order"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__child_column_list_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__child_column_list_cnt = intval($result->__child_column_list_cnt);	
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $__child_column_list_cnt, "__child_column_list_cnt")){
			return;
		}

		// 아이템 사이에 넣을 수 있도록 100 단위로 ordering 값을 지정해줍니다.
		$is_shy_child = ($__child_column_list_cnt == 0)?1:0;
		$new_order = $__child_column_list_cnt * 100;
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST"
				,"(parent_action_table_id,child_column_action_list_id,`order`,`is_shy_child`)"
				,"VALUES($parent_action_table_id,$child_column_action_list_id,$new_order,$is_shy_child)"
			)
		);

		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		$this->reorder_child_list_in_parent_table($parent_action_table_id);
	}
	/*
		@ Private
		@ Desc : 아이템의 자식 컬렉션의 order 값의 간격을 모두 100단위로 재조정해줍니다.
	*/
	private function reorder_child_list_in_parent_table($parent_action_table_id) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_table_id, "parent_action_table_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT PATNCCAL.child_column_action_list_id AS __child_column_action_list_id"
				,",PATNCCAL.`order` AS __child_column_action_list_order"
				,",PATNCCAL.`is_shy_child` AS __child_column_action_list_is_shy"
				,"FROM PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST AS PATNCCAL"
				,"WHERE PATNCCAL.parent_action_table_id=$parent_action_table_id"
				,"ORDER BY PATNCCAL.order"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}

		$result = $query_manager->get_result();
		if(empty($result) || (count($result) == 1)) {
			// 빈 리스트라면 더 이상 진행하지 않습니다.
			// 아이템이 1개인 경우도 진행하지 않습니다.
			return;
		}

		$child_column_action_list = $result;
		for($idx = 0; $idx < count($child_column_action_list); $idx++) {
			$cur_child_column_action_list = $child_column_action_list[$idx];
			if(is_null($cur_child_column_action_list)) {
				continue;
			}

			$__child_column_action_list_id = intval($cur_child_column_action_list->__child_column_action_list_id);
			$__child_column_action_list_order = intval($cur_child_column_action_list->__child_column_action_list_order);
			$__child_column_action_list_is_shy = intval($cur_child_column_action_list->__child_column_action_list_is_shy);
			$new_column_action_list_order = $idx * 100;

			if(($new_column_action_list_order == $__child_column_action_list_order) &&  $__child_column_action_list_is_shy == 0) {
				// 이전과 순서가 같다면 업데이트 하지 않습니다.
				// 숨김 열이라면 노출로 변경해줍니다.
				continue;
			}

			// 이전과 순서가 달라졌습니다. 업데이트를 진행합니다.
			// 열이 2개 이상일 경우는 더 이상 숨김열이 아니므로 is_shy_child의 값을 0으로 변경합니다.
			$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
			$query_manager->addQueryLineArr(
				array(
					"UPDATE PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST"
					,"SET `order` = $new_column_action_list_order, `is_shy_child`=0"
					,"WHERE `child_column_action_list_id` = $__child_column_action_list_id"
					,"AND `parent_action_table_id` = $parent_action_table_id"
				)
			);
			// $query_manager->printFormattedQuery();
			$query_manager->modify();
			if($query_manager->is_failed()) {
				return;
			}
		} // for end
	}	
	/*
		@ private
		@ Desc : ACTION COLLECTION LIST를 추가합니다. 새로 추가한 객체 LIST의 id를 돌려줍니다. 아이템이 포함되지 읺은 빈 리스트입니다.
	*/
	private function insert_action_collection_list($list_name, $parent_item_id=-1, $parent_table_id=-1) {

		if($this->is_empty(__FUNCTION__, $list_name, "list_name")){
			return;
		}

		// 리스트를 추가합니다.
		$__action_collection_id = $this->insert_action_collection($this->COLLECTION_TYPE_LIST, $list_name);
		if($this->is_not_unsigned_number(__FUNCTION__, $__action_collection_id, "__action_collection_id")){
			return $__action_collection_id;
		}

		
		if(0 < $parent_item_id) {

			// 부모 아이템이 있다면 연결해줍니다.
			$this->insert_parent_action_item_n_child_collection(
				// $action_item_id
				$parent_item_id
				// $child_action_collection_id
				, $__action_collection_id
			);

			// 재정렬
			$this->reorder_child_collection_in_parent_item($parent_item_id);

		} else if(0 < $parent_table_id) {

			// 부모 테이블이 있다면 연결해줍니다.
			$this->insert_parent_action_table_n_child_action_list(
				// $parent_action_table_id=-1
				$parent_table_id
				// $child_column_action_list_id=-1
				, $__action_collection_id
			);

			// 재정렬
			$this->reorder_child_list_in_parent_table($parent_table_id);

		}

		return $__action_collection_id;
	}

	/*
		@ private
		@ Desc : ACTION COLLECTION TABLE를 추가합니다. 새로 추가한 객체 TABLE의 id를 돌려줍니다. 아이템이 포함되지 읺은 빈 테이블입니다.
	*/
	private function insert_action_collection_table($table_name, $parent_item_id=-1) {

		if($this->is_empty(__FUNCTION__, $table_name, "table_name")){
			return;
		}

		// 리스트를 추가합니다.
		$__action_collection_id = $this->insert_action_collection($this->COLLECTION_TYPE_TABLE, $table_name);
		if($this->is_not_unsigned_number(__FUNCTION__, $__action_collection_id, "__action_collection_id")){
			return $__action_collection_id;
		}

		// 부모 아이템이 있다면 연결해줍니다.
		if(0 < $parent_item_id) {
			$this->insert_parent_action_item_n_child_collection(
				// $action_item_id
				$parent_item_id
				// $child_action_collection_id
				, $__action_collection_id
			);

			// 재정렬
			$this->reorder_child_collection_in_parent_item($parent_item_id);
		}

		return $__action_collection_id;
	}


	/*
		@ Public
		@ Desc : action object 자신이 포함된 action parent를 복사합니다.
	*/
	public function copy_action_obj($target_action_obj=null) {

		if($this->is_not_action_obj(__FUNCTION__, $target_action_obj, "target_action_obj")){
			return;
		}
			
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);

		$target_action_obj->show_info();

		// 어떤 타입인지 구분한다.
		$action_obj_copy = null;
		if(ActionCollection::is_instance($target_action_obj)) {

			// 1. COLLECTION
			if($target_action_obj->is_list()) {

				// 1-1. LIST
				$action_obj_copy = $this->copy_action_list($target_action_obj);

			} else if($target_action_obj->is_table()) {

				// 1-2. TABLE
				$action_obj_copy = $this->copy_action_table($target_action_obj);

			}

		} else if(ActionItem::is_instance($target_action_obj)) {

			// 2. ITEM
			$action_obj_copy = $this->copy_action_item($target_action_obj);

		}
		if($this->is_not_action_obj(__FUNCTION__, $action_obj_copy, "action_obj_copy")){
			return;
		}

		$action_obj_copy->show_info();

		return $action_obj_copy;                                             
	}
	/*
		@ Public
		@ Desc : target action obj를 복사합니다. 자식 객체애 대해서는 shy mode로 1개만 남겨둡니다. 엘리먼트를 추가할 때 사용합니다.
	*/
	public function copy_action_obj_empty($target_action_obj=null) {

		if($this->is_not_action_obj(__FUNCTION__, $target_action_obj, "target_action_obj")){
			return;
		}
			
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);

		// $target_action_obj->show_info();

		// 어떤 타입인지 구분한다.
		$action_obj_copy = null;
		if(ActionCollection::is_instance($target_action_obj)) {

			// 1. COLLECTION
			if($target_action_obj->is_list()) {

				// 1-1. LIST
				$action_obj_copy = $this->copy_action_list($target_action_obj);

			} else if($target_action_obj->is_table()) {

				// 1-2. TABLE
				$action_obj_copy = $this->copy_action_table($target_action_obj);

			}

		} else if(ActionItem::is_instance($target_action_obj)) {

			// 2. ITEM
			$action_obj_copy = $this->copy_action_item($target_action_obj);

		}
		if($this->is_not_action_obj(__FUNCTION__, $action_obj_copy, "action_obj_copy")){
			return;
		}

		$action_obj_copy->show_info();

		return $action_obj_copy;                                             
	}	
	/*
		@ Private
		@ Desc : 자신이 포함된 상위 부모 컬렉션(TABLE)을 복제합니다.
	*/	
	private function copy_action_table($target_action_table=null) {

		if($this->is_null_object(__FUNCTION__, $target_action_table, "target_action_table")){
			return;
		}

		if($this->is_not_action_table(__FUNCTION__, $target_action_table, "target_action_table")){
			return;
		}

		$table_name = $target_action_table->get_name();
		if($this->is_empty(__FUNCTION__, $table_name, "table_name")){
			return;
		}

		// 새로운 액션 컬렉션을 추가합니다. 부모, 자식의 관계 정보는 없습니다.
		$action_table_id_copy = $this->insert_action_collection_table($table_name);
		if($this->is_not_unsigned_number(__FUNCTION__, $action_table_id_copy, "action_table_id_copy")){
			return;
		}

		// 복사한 액션을 가져옵니다.
		$action_table_obj_copy = $this->get_action_table_object($action_table_id_copy);

		// 원본과 복사본의 값을 비교합니다.
		if($action_table_obj_copy->is_equal($target_action_table)) {
			echo "!Error! / copy_action_table / \$action_table_obj_copy->is_equal(\$target_action_table)<br/>";
			return;
		}

		// UPDATE MYSELF - ACTION LIST ID
		$action_table_obj_copy_hash_key = $action_table_obj_copy->get_hash_key();
		$target_action_table->set_id($action_table_id_copy);
		$target_action_table->set_hash_key($action_table_obj_copy_hash_key);

		// MEETING AGENDA
		$meeting_agenda_id = -1;
		if($target_action_table->is_root_collection()) {
			$meeting_agenda_id = $target_action_table->get_meeting_agenda_id();
		}
		if(0 < $meeting_agenda_id) {
			$this->insert_action_collection_n_meeting_agenda(
				// $action_collection_id
				$action_table_id_copy
				// $meeting_agenda_id
				, $meeting_agenda_id
			);
		}

		// COPY CHILD RELATION - COLUMN LIST
		$child_column_action_list_list = $target_action_table->get_children();
		for($idx=0;$idx < count($child_column_action_list_list);$idx++) {
			$child_column_action_list = $child_column_action_list_list[$idx];
			if($this->is_not_action_list(__FUNCTION__, $child_column_action_list, "child_column_action_list")){
				return;
			}
			$child_column_action_list_id = $child_column_action_list->get_id();
			if($this->is_not_unsigned_number(__FUNCTION__, $child_column_action_list_id, "child_column_action_list_id")){
				return;
			}

			$this->insert_parent_action_table_n_child_action_list(
				// $parent_action_table_id=-1
				$action_table_id_copy
				// $child_column_action_list_id=-1
				, $child_column_action_list_id
			);
		}

		// CHECK 
		if($target_action_table->is_root_collection()) {
			echo "copy_action_table - is_root_collection<br/>";
			return $target_action_table;
		}

		// COPY PARENT
		$parent_action_obj = $target_action_table->get_parent();
		$parent_action_obj_copy = null;
		if(!is_null($parent_action_obj)) {
			$parent_action_obj_copy = $this->copy_action_obj($parent_action_obj);
		}

		// COPY PARENT ADD ON
		$parent_add_on_action_obj = $target_action_table->get_add_on_action_parent_obj();
		$parent_add_on_action_obj_copy = null;
		if(!is_null($parent_add_on_action_obj)) {
			$parent_add_on_action_obj_copy = $this->copy_action_obj($parent_add_on_action_obj);
		}

		return $target_action_table;                                                                                                                     
	}
	/*
		@ Private
		@ Desc : action object 자신이 포함된 action parent를 복사합니다.
	*/	
	private function copy_action_list($target_action_list=null) {

		if($this->is_null_object(__FUNCTION__, $target_action_list, "target_action_list")) {
			return;
		}

		if($this->is_not_action_list(__FUNCTION__, $target_action_list, "target_action_list")) {
			return;
		}

		// COPY MYSELF - ACTION LIST
		$__list_name = $target_action_list->get_name();
		if($this->is_empty(__FUNCTION__, $__list_name, "__list_name")) {
			return;
		}
		$action_list_id_copy = $this->insert_action_collection_list($__list_name);
		if($this->is_not_unsigned_number(__FUNCTION__, $action_list_id_copy, "__action_list_id_copy")){
			return;
		}

		// 복사한 액션을 가져옵니다.
		$action_list_obj_copy = $this->get_action_list_object($action_list_id_copy);
		$action_list_obj_copy_hash_key = $action_list_obj_copy->get_hash_key();

		// 원본과 복사본의 값을 비교합니다.
		if($action_list_obj_copy->is_equal($target_action_list)) {
			echo "!Error! / copy_action_list / \$action_list_obj_copy->is_equal(\$target_action_list)<br/>";
			return;
		}

		// UPDATE MYSELF - ACTION LIST ID
		$target_action_list->set_id($action_list_id_copy);
		$target_action_list->set_hash_key($action_list_obj_copy_hash_key);

		// COPY MEETING AGENDA
		$meeting_agenda_id = -1;
		if($target_action_list->is_root_collection()) {
			$meeting_agenda_id = $target_action_list->get_meeting_agenda_id();
		}
		if(0 < $meeting_agenda_id) {
			$this->insert_action_collection_n_meeting_agenda(
				// $action_collection_id
				$action_list_id_copy
				// $meeting_agenda_id
				, $meeting_agenda_id
			);
		}

		// COPY CHILD RELATION
		$child_action_item_list = $target_action_list->get_children();
		for($idx=0;$idx < count($child_action_item_list);$idx++) {

			$child_action_item = $child_action_item_list[$idx];
			$child_action_item_id = $child_action_item->get_id();
			$child_action_item_order = $child_action_item->get_order();
			$child_action_item_is_shy = $child_action_item->get_is_shy();
			if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_id, "child_action_item_id")){
				return;
			}
			if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_order, "child_action_item_order")){
				return;
			}
			if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_is_shy, "child_action_item_is_shy")){
				return;
			}

			// 1. CHILD ITEM (PARENT LIST -> CHILD ITEM)
			$this->push_item_into_list(
				// $parent_action_list_id=-1
				$action_list_id_copy
				// $child_action_item_id=-1
				, $child_action_item_id
				// $is_shy_child=-1
				, $child_action_item_is_shy
			);
		}
	
		// list 타입은 add on child 가 없습니다. add on child는 action item에서만 사용 가능합니다.
		if($target_action_list->is_root_collection()) {
			echo "copy_action_list - is_root_collection<br/>";
			return $target_action_list;
		}

		// COPY PARENT
		$parent_action_obj = $target_action_list->get_parent();
		$parent_action_obj_copy = null;
		if(!is_null($parent_action_obj)) {
			echo "copy_action_list - COPY PARENT<br/>";
			$parent_action_obj_copy = $this->copy_action_obj($parent_action_obj);
		}

		// COPY PARENT ADD ON
		$parent_add_on_action_obj = $target_action_list->get_add_on_action_parent_obj();
		$parent_add_on_action_obj_copy = null;
		if(!is_null($parent_add_on_action_obj)) {
			echo "copy_action_list - COPY PARENT ADD ON<br/>";
			$parent_add_on_action_obj_copy = $this->copy_action_obj($parent_add_on_action_obj);
		}

		return $target_action_list;
	}
	/*
		@ Private
		@ Desc : ACTION ITEM 을 복제합니다. 원본의 모든 부모, 자식 객체를 가져와 연결합니다.
	*/	
	private function copy_action_item($target_action_item=null) {

		if($this->is_null_object(__FUNCTION__, $target_action_item, "target_action_item")) {
			return;
		}
		if($this->is_not_action_item(__FUNCTION__, $target_action_item, "target_action_item")) {
			return;
		}

		// COPY MYSELF - ACTION ITEM
		// 1. 가져온 아이템의 정보를 검사
		$__item_type = $target_action_item->get_item_type();
		if($this->is_not_unsigned_number(__FUNCTION__, $__item_type, "__item_type")){
			return;
		}
		$__item_name = $target_action_item->get_name();
		if($this->is_empty(__FUNCTION__, $__item_name, "__item_name")){
			return;
		}
		$__item_context = $target_action_item->get_context();
		if($this->is_null_object(__FUNCTION__, $__item_context, "__item_context")){
			return;
		}

		// DEBUG
		$__action_item_id_src = $target_action_item->get_id();
		$__action_item_hash_key_src = $target_action_item->get_hash_key();
		if($this->is_not_unsigned_number(__FUNCTION__, $__action_item_id_src, "__action_item_id_src")) {
			return;
		}
		if($this->is_empty(__FUNCTION__, $__action_item_hash_key_src, "__action_item_hash_key_src")) {
			return;
		}

		// 2. 가져온 아이템의 정보를 복사해서 새로운 아이템으로 업데이트!
		$__action_item_id_copy = $this->insert_action_item($__item_type, $__item_name, $__item_context);
		if($this->is_not_unsigned_number(__FUNCTION__, $__action_item_id_copy, "__action_item_id_copy")) {
			return;
		}

		$action_item_obj_copy = $this->get_action_item_object($__action_item_id_copy);
		$__action_item_hash_key_copy = $action_item_obj_copy->get_hash_key();
		if($this->is_empty(__FUNCTION__, $__action_item_hash_key_copy, "__action_item_hash_key_copy")) {
			return;
		}

		// 4. 원본 아이템과 새로운 아이템의 데이터 비교. 
		if($action_item_obj_copy->is_equal($target_action_table)) {
			echo "!Error! / copy_action_table / \$action_table_obj_copy->is_equal(\$target_action_table)<br/>";
			return;
		}

		$target_action_item->set_id($__action_item_id_copy);
		$target_action_item->set_hash_key($__action_item_hash_key_copy);

		// 자식 객체에 대한 복사. 실제로는 자식 객체를 새로 만들지 않습니다. 복사본과 자식 객체에 대한 관계가 새로 추가됩니다.
		if($target_action_item->has_children()) {

			// COPY CHILD RELATION
			// 자식 객체와 새로운 복사본을 연결합니다.
			$child_action_obj_list_src = $target_action_item->get_children();
			for($idx=0;$idx < count($child_action_obj_list_src);$idx++) {

				$child_action_obj_src = $child_action_obj_list_src[$idx];
				// if($this->is_not_instance(__FUNCTION__, $child_action_obj_src, "child_action_obj_src")) {
				// 	return;
				// }

				if($this->is_null_object(__FUNCTION__, $child_action_obj_src, "child_action_obj_src")) {
					return;
				}

				$child_action_obj_id_src = $child_action_obj_src->get_id();

				if($this->is_not_unsigned_number(__FUNCTION__, $child_action_obj_id_src, "child_action_obj_id_src")){
					return;
				}
				$this->insert_parent_action_item_n_child_collection(
					// $parent_action_item_id
					$__action_item_id_copy
					// $child_action_collection_id
					, $child_action_obj_id_src
					// $order=-1
					, $idx
				);
			}

			// COPY ADD-ON CHILD RELATION
			// add on 자식 객체와 새로운 복사본을 연결합니다.
			$child_add_on_action_obj_list_src = $target_action_item->get_add_on_list();
			for($idx=0;$idx < count($child_add_on_action_obj_list_src);$idx++) {

				$child_add_on_action_obj_src = $child_add_on_action_obj_list_src[$idx];
				if($this->is_not_instance(__FUNCTION__, $child_add_on_action_obj_src, "child_add_on_action_obj_src")) {
					return;
				}
				$child_add_on_action_obj_id_src = $child_add_on_action_obj_src->get_id();

				if($this->is_not_unsigned_number(__FUNCTION__, $child_add_on_action_obj_id_src, "child_add_on_action_obj_id_src")){
					return;
				}
				$this->insert_parent_action_item_n_add_on_collection(
					// $parent_action_item_id
					$__action_item_id_copy
					// $add_on_action_collection_id
					, $child_add_on_action_obj_id_src
					// $order=-1
					, $idx
				);
			}

		}

		// COPY PARENT
		$parent_action_obj_src = $target_action_item->get_parent();
		$parent_action_id_src = $parent_action_obj_src->get_id();
		$parent_action_hash_key_src = $parent_action_obj_src->get_hash_key();

		// ACTION ITEM은 최상위 객체가 될 수 없습니다.
		if($this->is_null_object(__FUNCTION__, $parent_action_obj_src, "parent_action_obj_src")) {
			return;
		}
		$parent_action_obj_copy = $this->copy_action_obj($parent_action_obj_src);

		$target_action_item->set_parent($parent_action_obj_copy);

		return $target_action_item;
	}	








	//     .aMMMb  .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb         dMP dMMMMMMP dMMMMMP dMMMMMMMMb 
	//    dMP"dMP dMP"VMP   dMP   amr dMP"dMP dMP dMP        amr    dMP   dMP     dMP"dMP"dMP 
	//   dMMMMMP dMP       dMP   dMP dMP dMP dMP dMP        dMP    dMP   dMMMP   dMP dMP dMP  
	//  dMP dMP dMP.aMP   dMP   dMP dMP.aMP dMP dMP        dMP    dMP   dMP     dMP dMP dMP   
	// dMP dMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP        dMP    dMP   dMMMMMP dMP dMP dMP    
	/*
		@ public
		@ Desc : 리스트 아이템을 추가합니다. 추가한 아이템의 id를 돌려줍니다.
	*/
	public function insert_action_item($type, $name, $context="") {

		if($this->is_not_unsigned_number(__FUNCTION__, $type, "type")){
			return;
		}
		if($this->is_empty(__FUNCTION__, $name, "name")){
			return;
		}

		$hash_key = $this->get_hash_key("$type $name $context");
		$context_mysql_safe = $this->mysql_manager->escape_json_str($context);

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO `magendas`.`ACTION_ITEM`(`hash_key`,`type`,`name`,`context`)"
				,"VALUES(\"$hash_key\",$type,\"$name\",\"$context_mysql_safe\")"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가된 item의 id를 가져옵니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT `id` AS __action_item_id"
				,"FROM ACTION_ITEM"
				,"WHERE `hash_key`=\"$hash_key\""
				,"ORDER BY id DESC"
				,"LIMIT 1"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__action_item_id = -1;
		if(!is_null($result) || !empty($result)) {
			$__action_item_id = $result->__action_item_id;	
		}
		return $__action_item_id;
	}
	// @ Public
	// @ Desc : 액션 아이템의 이름, 내용을 업데이트합니다.
	public function update_action_item($action_item_id=-1, $action_name="", $action_item_context="") {

		if($this->is_not_unsigned_number(__FUNCTION__, $action_item_id, "action_item_id")){
			return;
		}
		if($this->is_empty(__FUNCTION__, $action_name, "action_name")){
			return;
		}

		$context_mysql_safe = $this->mysql_manager->escape_json_str($action_item_context);

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"UPDATE `magendas`.`ACTION_ITEM`"
				,"SET `name` = \"$action_name\","
				,"`context` = \"$context_mysql_safe\""
				,"WHERE `id` = $action_item_id"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

	}
	/*
		@ Private
		@ Desc : 리스트 아이템과 아이템의 자식 컬렉션을 연결합니다.
	*/
	private function insert_parent_action_item_n_child_collection($parent_action_item_id, $child_action_collection_id) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_item_id, "parent_action_item_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_collection_id, "child_action_collection_id")){
			return;
		}

		// 해당 리스트에 이전에 등록된 아이템 목록을 가져옵니다.
		// 추가되는 아이템은 리스트의 가장 마지막에 추가됩니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(AINCAC.parent_action_item_id) AS __item_child_collection_cnt"
				,"FROM PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION AS AINCAC"
				,"WHERE AINCAC.parent_action_item_id=$parent_action_item_id"
				,"ORDER BY AINCAC.order"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__item_child_collection_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__item_child_collection_cnt = $result->__item_child_collection_cnt;	
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $__item_child_collection_cnt, "__item_child_collection_cnt")){
			return;
		}

		// 아이템 사이에 넣을 수 있도록 100 단위로 ordering 값을 지정해줍니다.
		$is_shy_child = ($__item_child_collection_cnt == 0)?1:0;
		$new_order = intval($__item_child_collection_cnt) * 100;
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION"
				,"(`parent_action_item_id`,`child_action_collection_id`,`order`,`is_shy_child`)"
				,"VALUES ($parent_action_item_id,$child_action_collection_id,$new_order,$is_shy_child)"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가한 데이터를 재정렬 해줍니다.
		$this->reorder_child_collection_in_parent_item($parent_action_item_id);

	}
	// @ public
	// @ desc : 앞, 뒤의 형제 아이템을 비교해서 새로운 순서로 바꿔줍니다.
	public function arrange_action_item_order($root_action_obj_hash_key=null, $action_item_hash_key_before=null, $action_item_hash_key=null, $action_item_hash_key_after=null) {

		if($this->is_empty(__FUNCTION__, $root_action_obj_hash_key, "root_action_obj_hash_key")){
			return;
		}

		if($this->is_empty(__FUNCTION__, $action_item_hash_key, "action_item_hash_key")){
			return;
		}

		if(empty($action_item_hash_key_before) && empty($action_item_hash_key_after)) {
			echo "\$action_item_hash_key_before and \$action_item_hash_key_after is not valid!<br/>";
			return;
		}

		$action_item_id_before = -1;
		if(!empty($action_item_hash_key_before)) {
			$action_item_id_before = $this->get_action_item_id($action_item_hash_key_before);
		}


		$action_item_id_after = -1;
		if(!empty($action_item_hash_key_after)) {
			$action_item_id_after = $this->get_action_item_id($action_item_hash_key_after);
		}

		
		// DB에 저장된 관계 데이터를 가져옵니다.
		$root_action_collection = $this->get_action_collection_by_hash_key($root_action_obj_hash_key);
		if($this->is_not_action_collection(__FUNCTION__, $root_action_collection, "root_action_collection")) {
			return;
		}

		$action_item_obj = $root_action_collection->search_hash_key($action_item_hash_key);
		if($this->is_not_action_item(__FUNCTION__, $action_item_obj, "action_item_obj")) {
			return;
		}

		$parent_action_obj = $action_item_obj->get_parent();
		if($this->is_not_action_list(__FUNCTION__, $parent_action_obj, "parent_action_obj")) {
			return;
		}

		// 순서를 바꿉니다.
		$action_item_order_before = -1;
		$action_item_order_after = -1;
		if(0 < $action_item_id_before) {

			$action_item_order_before = $this->sel_child_item_order_on_parent_list($parent_action_obj->get_id(), $action_item_id_before);
			if($this->is_not_unsigned_number(__FUNCTION__, $action_item_order_before, "action_item_order_before")){
				return;
			}

			// 새롭게 위치한 이전 형제 아이템의 순서 바로 뒤로 넣습니다.
			$action_item_order = $action_item_order_before + 50;
			if($this->is_not_unsigned_number(__FUNCTION__, $action_item_order, "\$action_item_id_before : $action_item_id_before / action_item_order")){
				return;
			}

			$this->update_order_parent_list_n_child_item($parent_action_obj->get_id(), $action_item_obj->get_id(), $action_item_order);

			$this->reorder_child_item_in_parent_list($parent_action_obj->get_id());

		} else if(0 < $action_item_id_after) {

			$action_item_order_after = $this->sel_child_item_order_on_parent_list($parent_action_obj->get_id(), $action_item_id_after);

			if($this->is_not_unsigned_number(__FUNCTION__, $action_item_order_after, "action_item_order_after")){
				return;
			}

			if($action_item_order_after == 0) {
				// 첫번째로 이동하는 경우는, 첫번째에 있던 아이템의 순서도 역시 함께 변경합니다.
				$action_item_order_after = 50;
			}

			// 새롭게 위치한 이전 형제 아이템의 순서 바로 앞으로 넣습니다.
			$action_item_order = $action_item_order_after - 50;
			if($this->is_not_unsigned_number(__FUNCTION__, $action_item_order, "\$action_item_order_after : $action_item_order_after / action_item_order")){
				return;
			}

			$this->update_order_parent_list_n_child_item($parent_action_obj->get_id(), $action_item_obj->get_id(), $action_item_order);

			if($action_item_order_after == 50) {
				// 첫번째 열 위로 아이템이 이동했습니다. 뒤의 형제 아이템의 순서 정보도 함께 변경해줍니다.
				$this->update_order_parent_list_n_child_item($parent_action_obj->get_id(), $action_item_id_after, $action_item_order_after);
			}

			$this->reorder_child_item_in_parent_list($parent_action_obj->get_id());

		}

	}	
	/*
		@ Private
		@ Desc : 아이템의 자식 컬렉션의 order 값의 간격을 모두 100단위로 재조정해줍니다.
	*/
	private function reorder_child_collection_in_parent_item($parent_action_item_id) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_item_id, "parent_action_item_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AINCAC.child_action_collection_id AS __child_collection_id"
				,",AINCAC.`order` AS __child_collection_order"
				,",AINCAC.`is_shy_child` AS __child_collection_is_shy"
				,"FROM PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION AS AINCAC"
				,"WHERE parent_action_item_id=$parent_action_item_id"
				,"ORDER BY AINCAC.order"
			)
		);
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}

		$result = $query_manager->get_result();
		if(empty($result) || (count($result) == 1)) {
			// 빈 리스트라면 더 이상 진행하지 않습니다.
			// 아이템이 1개인 경우도 진행하지 않습니다.
			return;
		}

		$child_table_list = $result;
		for($idx = 0; $idx < count($child_table_list); $idx++) {
			$cur_child_table = $child_table_list[$idx];
			if(is_null($cur_child_table)) {
				continue;
			}

			$__child_collection_id = intval($cur_child_table->__child_collection_id);
			$__child_collection_order = intval($cur_child_table->__child_collection_order);
			$__child_collection_is_shy = intval($cur_child_table->__child_collection_is_shy);
			$new_child_collection_order = $idx * 100;

			if(($new_child_collection_order == $__child_collection_order) && $__child_collection_is_shy == 0) {
				// 이전과 순서가 같다면 업데이트 하지 않습니다.
				// 숨김 열이라면 노출로 변경해줍니다.
				continue;
			}

			// 이전과 순서가 달라졌습니다. 업데이트를 진행합니다.
			// 열이 2개 이상일 경우는 더 이상 숨김열이 아니므로 is_shy_child의 값을 0으로 변경합니다.
			$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
			$query_manager->addQueryLineArr(
				array(
					"UPDATE PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION"
					,"SET `order` = $new_child_collection_order, `is_shy_child`=0"
					,"WHERE `child_action_collection_id` = $__child_collection_id"
					,"AND `parent_action_item_id` = $parent_action_item_id"
				)
			);
			$query_manager->modify();
			if($query_manager->is_failed()) {
				return;
			}
		}

	}
	/*
		@ Private
		@ Desc : 리스트 아이템과 아이템의 추가 자식 컬렉션을 연결합니다. 추가 자식 컬렉션은 뷰 단 로직에서 추가되는 컬렉션입니다.
		ex ) 타임라인에서 스피치 관련 테이블이 포함되는 경우. 타임 라인이 수정되어 스피치 테이블이 빠지거나 추가되는 경우를 위해서 필요합니다.
	*/
	private function insert_parent_action_item_n_add_on_collection($parent_action_item_id, $add_on_action_collection_id, $order=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_item_id, "parent_action_item_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $add_on_action_collection_id, "add_on_action_collection_id")){
			return;
		}

		// 해당 리스트에 이전에 등록된 아이템 목록을 가져옵니다.
		// 추가되는 아이템은 리스트의 가장 마지막에 추가됩니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(AINAOAC.parent_action_item_id) AS __item_add_on_collection_cnt"
				,"FROM PARENT_ACTION_ITEM_N_ADD_ON_ACTION_COLLECTION AS AINAOAC"
				,"WHERE AINAOAC.parent_action_item_id=$parent_action_item_id"
				,"ORDER BY AINAOAC.`order`"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__item_add_on_collection_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__item_add_on_collection_cnt = $result->__item_add_on_collection_cnt;	
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $__item_add_on_collection_cnt, "__item_add_on_collection_cnt")){
			return;
		}

		// 아이템 사이에 넣을 수 있도록 100 단위로 ordering 값을 지정해줍니다.
		$new_order = intval($__item_add_on_collection_cnt) * 100;
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO PARENT_ACTION_ITEM_N_ADD_ON_ACTION_COLLECTION"
				,"(`parent_action_item_id`,`add_on_action_collection_id`,`order`)"
				,"VALUES ($parent_action_item_id,$add_on_action_collection_id,$new_order)"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가한 데이터를 재정렬 해줍니다.
		$this->reorder_add_on_collection_in_parent_item($parent_action_item_id);

	}
	/*
		@ Private
		@ Desc : 아이템의 자식 컬렉션의 order 값의 간격을 모두 100단위로 재조정해줍니다.
	*/
	private function reorder_add_on_collection_in_parent_item($parent_action_item_id) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_item_id, "parent_action_item_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AINAOAC.add_on_action_collection_id AS __add_on_collection_id"
				,",AINAOAC.`order` AS __add_on_collection_order"
				,"FROM PARENT_ACTION_ITEM_N_ADD_ON_ACTION_COLLECTION AS AINAOAC"
				,"WHERE parent_action_item_id=$parent_action_item_id"
				,"ORDER BY AINAOAC.order"
			)
		);
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}

		$result = $query_manager->get_result();
		if(empty($result) || (count($result) == 1)) {
			// 빈 리스트라면 더 이상 진행하지 않습니다.
			// 아이템이 1개인 경우도 진행하지 않습니다.
			return;
		}

		$child_table_list = $result;
		for($idx = 0; $idx < count($child_table_list); $idx++) {
			$cur_child_table = $child_table_list[$idx];
			if(is_null($cur_child_table)) {
				continue;
			}

			$__add_on_collection_id = intval($cur_child_table->__add_on_collection_id);
			$__add_on_collection_order = intval($cur_child_table->__add_on_collection_order);
			$new_child_collection_order = $idx * 100;

			if(($new_child_collection_order == $__add_on_collection_order)) {
				// 이전과 순서가 같다면 업데이트 하지 않습니다.
				continue;
			}

			// 이전과 순서가 달라졌습니다. 업데이트를 진행합니다.
			// 열이 2개 이상일 경우는 더 이상 숨김열이 아니므로 is_shy_child의 값을 0으로 변경합니다.
			$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
			$query_manager->addQueryLineArr(
				array(
					"UPDATE PARENT_ACTION_ITEM_N_ADD_ON_ACTION_COLLECTION"
					,"SET `order` = $new_child_collection_order"
					,"WHERE `add_on_action_collection_id` = $__add_on_collection_id"
					,"AND `parent_action_item_id` = $parent_action_item_id"
				)
			);
			$query_manager->modify();
			if($query_manager->is_failed()) {
				return;
			}
		}
	}
	/*
		@ Private
		@ Desc : 아이템을 리스트에 넣습니다. 아이템은 오직 리스트에만 넣을수 있습니다.
	*/	
	private function push_item_into_list($parent_action_list_id=-1, $child_action_item_id=-1, $is_shy_child=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_id, "child_action_item_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $is_shy_child, "is_shy_child")){
			return;
		}

		// 해당 리스트에 이전에 등록된 아이템 목록을 가져옵니다.
		// 추가되는 아이템은 리스트의 가장 마지막에 추가됩니다.
		$__child_action_item_cnt = $this->sel_child_item_cnt_on_list($parent_action_list_id);
		if($this->is_not_unsigned_number(__FUNCTION__, $__child_action_item_cnt, "__child_action_item_cnt")){
			return;
		}

		// 이전에 등록되었던 아이템이 있고, shy 모드 라면 shy모드인 아이템을 리스트관계에서 제거합니다.
		$first_child_item = null;
		if($__child_action_item_cnt == 1) {
			$cur_action_list = $this->get_action_collection($parent_action_list_id);
			$first_child_item = $cur_action_list->get_first_child();
		}
		if(!is_null($first_child_item) && $first_child_item->get_is_shy()) {
			$first_child_item_id_shy = $first_child_item->get_id();
			$this->delete_parent_list_n_child_item($parent_action_list_id, $first_child_item_id_shy);
		}

		// 부모 리스트와 아이템의 관계를 지정합니다.
		$order = intval($__child_action_item_cnt) * 100;
		$this->insert_parent_list_n_child_item($parent_action_list_id, $child_action_item_id, $order, $is_shy_child);

		// 해당 리스트의 모든 아이템들을 가져와 ordering을 다시 업데이트해줍니다.
		$this->reorder_child_item_in_parent_list($parent_action_list_id);

	}
	// @ desc
	private function sel_child_item_order_on_parent_list($parent_action_list_id=-1, $child_action_item_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id")){
			return;
		}

		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_id, "child_action_item_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT PACLNCAI.child_action_item_id AS __child_action_item_id"
				,",PACLNCAI.order AS __child_action_item_order"
				," FROM PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM AS PACLNCAI"
				," WHERE parent_action_list_id=$parent_action_list_id"
				," AND child_action_item_id=$child_action_item_id"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		return $result->__child_action_item_order;
	}	
	private function sel_child_item_cnt_on_list($parent_action_list_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(PACLNCAI.child_action_item_id) AS __child_action_item_cnt"
				,"FROM PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM AS PACLNCAI"
				,"WHERE parent_action_list_id=$parent_action_list_id"
				,"ORDER BY PACLNCAI.order"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__child_action_item_cnt = -1;
		if(!is_null($result) || !empty($result)) {
			$__child_action_item_cnt = $result->__child_action_item_cnt;	
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $__child_action_item_cnt, "__child_action_item_cnt")){
			return -1;
		}
		return $__child_action_item_cnt;
	}
	// @ public
	// @ Desc : 부모 리스트와 자식 액션 아이템의 관계 테이블에 등록합니다.
	public function insert_parent_list_n_child_item($parent_action_list_id=-1, $child_action_item_id=-1, $order=-1, $is_shy_child=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_id, "child_action_item_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $order, "order")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $is_shy_child, "is_shy_child")){
			return;
		}


		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO `magendas`.`PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM`(`parent_action_list_id`,`child_action_item_id`,`order`,`is_shy_child`)"
				,"VALUES($parent_action_list_id,$child_action_item_id,$order,$is_shy_child)"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

	}
	// @ desc : 부모 리스트와 자식 액션 아이템의 관계 테이블에 등록합니다.
	private function update_order_parent_list_n_child_item($parent_action_list_id=-1, $child_action_item_id=-1, $order=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_id, "child_action_item_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $order, "order")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"UPDATE PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM"
				, " SET `order` = $order"
				, " WHERE `parent_action_list_id` = $parent_action_list_id"
				, " AND `child_action_item_id` = $child_action_item_id"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

	}

	private function delete_parent_list_n_child_item($parent_action_list_id=-1, $child_action_item_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_id, "child_action_item_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"DELETE FROM `magendas`.`PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM`"
				,"WHERE parent_action_list_id=$parent_action_list_id"
				,"AND child_action_item_id=$child_action_item_id"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

	}	
	/*
		@ Private
		@ Desc : 리스트의 모든 아이템의 order 값의 간격을 모두 100단위로 재조정해줍니다.
	*/
	private function reorder_child_item_in_parent_list($parent_action_list_id) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT PACLNCAI.child_action_item_id AS __child_action_item_id"
				,",PACLNCAI.`order` AS __child_action_item_order"
				,",PACLNCAI.`is_shy_child` AS __child_action_item_is_shy"
				," FROM PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM AS PACLNCAI"
				," WHERE parent_action_list_id=$parent_action_list_id"
				," ORDER BY PACLNCAI.order"
			)
		);
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}

		$result = $query_manager->get_result();
		if(empty($result) || (count($result) == 1)) {
			// 빈 리스트라면 더 이상 진행하지 않습니다.
			// 아이템이 1개인 경우도 진행하지 않습니다.
			return;
		}

		$item_list = $result;
		for($idx = 0; $idx < count($item_list); $idx++) {	
			$cur_item = $item_list[$idx];
			if(is_null($cur_item)) {
				continue;
			}

			$__child_action_item_id = intval($cur_item->__child_action_item_id);
			$__child_action_item_order = intval($cur_item->__child_action_item_order);
			$__child_action_item_is_shy = intval($cur_item->__child_action_item_is_shy);
			$new_item_order = $idx * 100;

			if(($new_item_order == $__child_action_item_order) && ($__child_action_item_is_shy == 0)) {
				// 이전과 순서가 같다면 업데이트 하지 않습니다.
				// 숨김 열이라면 노출로 변경해줍니다.
				continue;
			}

			// 이전과 순서가 달라졌습니다. 업데이트를 진행합니다.
			// 열이 2개 이상일 경우는 더 이상 숨김열이 아니므로 is_shy_child의 값을 0으로 변경합니다.
			$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
			$query_manager->addQueryLineArr(
				array(
					"UPDATE PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM"
					,"SET `order` = $new_item_order, `is_shy_child`=0"
					,"WHERE `parent_action_list_id` = $parent_action_list_id"
					,"AND `child_action_item_id` = $__child_action_item_id"
				)
			);
			// $query_manager->printFormattedQuery();
			$query_manager->modify();
			if($query_manager->is_failed()) {
				return;
			}
		}

		
		$action_item_list = $this->get_action_list_object($parent_action_list_id);
		if(is_null($action_item_list) || empty($action_item_list)) {
			return;
		}

		$first_action_item = $action_item_list->get_first_child();
		if($this->is_null_object(__FUNCTION__, $first_action_item, "first_action_item")){
			return;
		}
		if(ActionItemTitleNTimeHHMM::is_not_instance($first_action_item)) {
			return;
		}

		// 시간 관련 아이템이라면 시간 정렬 작업을 진행해줍니다.
		// 배열 순서는 변하지 않습니다. 리스트내의 시간 간격을 순차적으로 증가하도록 재설정해줍니다.
		$time_sec_elapsed_from_init_prev = 0;
		$time_offset_arr = array();
		for($idx = 0; $idx < $action_item_list->get_children_cnt(); $idx++) {
			$action_item = $action_item_list->get_child($idx);

			$context_time_hh_mm = $action_item->get_context_time_hh_mm();
			$time_sec_elapsed_from_init = $context_time_hh_mm->time_sec_elapsed_from_init;

			// 직전 시간과의 시간 offset을 구합니다.
			$time_offset = 0;
			if(0 < $time_sec_elapsed_from_init_prev) {
				$time_offset = $time_sec_elapsed_from_init - $time_sec_elapsed_from_init_prev;
			}
			array_push($time_offset_arr, $time_offset);

			// 다음 시간에서 참고할 직전 시간 정보를 저장합니다.
			$time_sec_elapsed_from_init_prev = $time_sec_elapsed_from_init;
		} // end for

		// offset을 분석합니다.
		// 음수로 저장된 값이 있다면, 직전 시간보다 10분 뒤인, 600초의 값을 가지도록 해줍니다.
		$time_sec_elapsed_from_init_prev = 0;
		for($idx = 0; $idx < count($time_offset_arr); $idx++) {
			$time_offset = $time_offset_arr[$idx];

			if($time_offset < 0) {
				$time_offset = 600;
			}
			$time_sec_elapsed_from_init_prev += $time_offset;

			// 해당 인덱스의 시간 값을 가져옵니다.
			$action_item = $action_item_list->get_child($idx);
			$context_time_hh_mm = $action_item->get_context_time_hh_mm();
			$time_sec_elapsed_from_init = $context_time_hh_mm->time_sec_elapsed_from_init;

			// 비교해서 다르다면 업데이트합니다.
			if($time_sec_elapsed_from_init != $time_sec_elapsed_from_init_prev) {

				$action_item_id = $action_item->get_id();
				$action_item_context = $action_item->get_context();

				$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
				$query_manager->addQueryLineArr(
					array(
						"UPDATE ACTION_ITEM"
						, "SET `context` = \"$action_item_context\""
						, "WHERE `id` = $action_item_id"
					)
				);
				// $query_manager->printFormattedQuery();
				$query_manager->modify();
				if($query_manager->is_failed()) {
					return;
				} // end if
			} // end if
		} // end for



	} // end function





	// action list
	public function get_root_action_collection_by_hash_key($action_collection_hash_key="", $meeting_id=-1) {

		if($this->is_empty(__FUNCTION__, $action_collection_hash_key, "action_collection_hash_key")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $meeting_id, "meeting_id")){
			return;
		}

		$root_action_id = $this->get_action_collection_id($action_collection_hash_key);
		if($this->is_not_unsigned_number(__FUNCTION__, $root_action_id, "root_action_id")) {
			return;
		}

		return $this->get_root_action_collection($root_action_id, $meeting_id);
	}
	public function get_root_action_collection($action_collection_id=-1, $meeting_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $action_collection_id, "action_collection_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $meeting_id, "meeting_id")){
			return;
		}

		$root_action_collection = 
		$this->get_action_collection(
			// $action_collection_id=-1
			$action_collection_id
			// $order=0
			, 0
			// $is_shy=0
			, 0
			// $meeting_id=-1		
			, $meeting_id
		);

		$cur_context = new stdClass();
		$cur_context->meeting_id = $meeting_id;
		$cur_context_json_str = json_encode($cur_context);

		if($this->is_action_collection(null, $root_action_collection, null)) {
			$root_action_collection->set_context($cur_context_json_str);
			$root_action_collection->set_coordinate();
		}

		return $root_action_collection;
	}
	// @ Desc : ACTION COLLECTION 정보를 가져옵니다. action collection 객체로 반환합니다.
	private function get_action_collection_by_hash_key($action_collection_hash_key=-1) {

		if($this->is_empty(__FUNCTION__, $action_collection_hash_key, "action_collection_hash_key")){
			return;
		}

		// wonder.jung11
		$action_collection_id = $this->get_action_collection_id($action_collection_hash_key);
		if($this->is_not_unsigned_number(__FUNCTION__, $action_collection_id, "action_collection_id")){
			return;
		}

		return $this->get_action_collection($action_collection_id);
	}
	// @ Desc : ACTION COLLECTION 정보를 가져옵니다. action collection 객체로 반환합니다.
	private function get_action_collection($action_collection_id=-1, $order=0, $is_shy=0) {

		if($this->is_not_unsigned_number(__FUNCTION__, $action_collection_id, "action_collection_id")){
			return;
		}

		if($this->is_instance_table_type($action_collection_id)) {
			// 테이블 타입일 경우
			return $this->get_action_table_object($action_collection_id, $order, $is_shy);
		} else if($this->is_instance_list_type($action_collection_id)) {
			// 리스트 타입일 경우
			return $this->get_action_list_object($action_collection_id, $order, $is_shy);
		}

	}
	/*
		@ private
		@ Desc : 액션 리스트 관련 정보를 가져옵니다. 부모, 자식 관계를 오브젝트, 프로퍼티 형태로 변환하여 전달합니다.
	*/
	public function get_action_list_object($list_id, $order=0, $is_shy=0) {

		if($this->is_not_unsigned_number(__FUNCTION__, $list_id, "list_id")){
			return;
		}

		// 리스트를 조회합니다.
		$list_n_child_item_list = $this->sel_action_list_n_child_item($list_id);
		if($this->is_empty(__FUNCTION__, $list_n_child_item_list, "list_n_child_item_list")) {
			return;
		}

		$list_info = $list_n_child_item_list[0];
		if($this->is_null_object(__FUNCTION__, $list_info, "list_info")) {
			return;
		}

		$action_list_obj = new ActionCollection();
		$action_list_obj->set_id(intval($list_info->__list_id));
		$action_list_obj->set_hash_key($list_info->__list_hash_key);
		$action_list_obj->set_collection_type(intval($list_info->__list_type));
		$action_list_obj->set_collection_type_name($list_info->__list_type_name);
		$action_list_obj->set_name($list_info->__list_name);
		$action_list_obj->set_order($order);
		$action_list_obj->set_is_shy($is_shy);
		$action_list_obj->set_meeting_agenda_id($list_info->__list_meeting_agenda_id);
		$action_list_obj->set_meeting_agenda_theme($list_info->__list_meeting_agenda_theme);
		$action_list_obj->set_meeting_agenda_round($list_info->__list_meeting_agenda_round);

		// DEBUG
		$cur_name = $action_list_obj->get_name();
		$cur_children_cnt = count($list_n_child_item_list);
		// echo "get_action_list_object / $cur_name / \$cur_children_cnt :: $cur_children_cnt<br/>";

		$__list_meeting_agenda_id = $list_info->__list_meeting_agenda_id;
		for($idx=0; $idx < count($list_n_child_item_list); $idx++) {
			$child_item_obj = $list_n_child_item_list[$idx];

			if($this->is_null_object(__FUNCTION__, $child_item_obj, "child_item_obj")) {
				return;
			}

			$__list_child_item_id = intval($child_item_obj->__list_child_item_id);
			if($__list_child_item_id < 0){
				// 자식 컬렉션이 없는 경우.
				continue;
			}

			$__list_child_item_order = intval($child_item_obj->__list_child_item_order);
			if($this->is_not_unsigned_number(__FUNCTION__, $__list_child_item_order, "__list_child_item_order")){
				return;
			}

			$__list_child_item_is_shy = $child_item_obj->__list_child_item_is_shy;
			if($this->is_not_unsigned_number(__FUNCTION__, $__list_child_item_is_shy, "__list_child_item_is_shy")){
				return;
			}

			$__list_meeting_agenda_starttime_sec = $child_item_obj->__list_meeting_agenda_starttime_sec;
			if($this->is_not_unsigned_number(__FUNCTION__, $__list_meeting_agenda_starttime_sec, "__list_meeting_agenda_starttime_sec")){
				return;
			}

			$child_item_obj = 
			$this->get_action_item_object(
				// $item_id
				$__list_child_item_id
				// $order=0
				, $__list_child_item_order
				// $is_shy=0
				, $__list_child_item_is_shy
			);

			if($this->is_null_object(__FUNCTION__, $child_item_obj, "child_item_obj")) {
				continue;
			}

			// DEBUG
			// echo "get_action_list_object / $cur_name <--> $child_item_name<br/>";

			$action_list_obj->add_child($child_item_obj);
			$child_item_obj->set_parent($action_list_obj);

		}

		// DEBUG
		$action_children_cnt = $action_list_obj->get_children_cnt();
		// echo "get_action_list_object / $cur_name / \$action_children_cnt :: $action_children_cnt<br/>";

		return $action_list_obj;
	}
	// @ Desc : 액션 리스트를 조회합니다. 리스트가 가지는 아이템 정보까지 함께 가져옵니다.
	private function sel_action_list_n_child_item($list_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $list_id, "list_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AC.`id` AS __list_id"
				,",AC.`hash_key` AS __list_hash_key"
				,",AC.`type` AS __list_type"
				,",AC.`name` AS __list_name"
				,",ACT.`name` AS __list_type_name"

				,",IFNULL(MA.`id`,-1) AS __list_meeting_agenda_id"
				,",IFNULL(MA.`round`,-1) AS __list_meeting_agenda_round"
				,",IFNULL(MA.`theme`,\"\") AS __list_meeting_agenda_theme"
				,",IFNULL(DATE_FORMAT(MA.startdttm, '%H:%i:00'),\"\") AS __list_meeting_agenda_starttime"
				,",IFNULL(TIME_TO_SEC(DATE_FORMAT(MA.startdttm, '%H:%i:00')),0) AS __list_meeting_agenda_starttime_sec"

				,",IFNULL(CHILD_ITEM.`id`,-1) AS __list_child_item_id"
				,",IFNULL(CHILD_ITEM.`name`,\"\") AS __list_child_item_name"
				,",IFNULL(CHILD_ITEM.`hash_key`,\"\") AS __list_child_item_hash_key"
				,",IFNULL(CHILD_ITEM_TYPE.`id`,-1) AS __list_child_item_type_id"
				,",IFNULL(CHILD_ITEM_TYPE.`name`,\"\") AS __list_child_item_type_name"
				,",IFNULL(CHILD_ITEM.`context`,\"\") AS __list_child_item_context"
				,",IFNULL(PARENT_LIST_N_CHILD_ITEM.order,-1) AS __list_child_item_order"
				,",IFNULL(PARENT_LIST_N_CHILD_ITEM.is_shy_child,-1) AS __list_child_item_is_shy"

				,"FROM ACTION_COLLECTION AS AC"
				,"LEFT JOIN ACTION_COLLECTION_N_MEETING_AGENDA AS AC_MA ON AC_MA.action_collection_id=AC.`id`"
				,"LEFT JOIN MEETING_AGENDA AS MA ON MA.id=AC_MA.meeting_agenda_id"
				,"LEFT JOIN ACTION_COLLECTION_TYPE AS ACT ON ACT.id=AC.`type`"

				,"LEFT JOIN PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM AS PARENT_LIST_N_CHILD_ITEM ON PARENT_LIST_N_CHILD_ITEM.parent_action_list_id=AC.id"
				,"LEFT JOIN ACTION_ITEM AS CHILD_ITEM ON CHILD_ITEM.id=PARENT_LIST_N_CHILD_ITEM.child_action_item_id"
				,"LEFT JOIN ACTION_ITEM_TYPE AS CHILD_ITEM_TYPE ON CHILD_ITEM_TYPE.id=CHILD_ITEM.`type`"

				,"WHERE AC.`id`=$list_id"
				,"ORDER BY PARENT_LIST_N_CHILD_ITEM.order"
			)
		); // end adding query		

		// $query_manager->printFormattedQuery();
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		return $query_manager->get_result();
	}
	/*
		@ public
		@ Desc : 액션 테이블 관련 정보를 가져옵니다. action collection 객체로 반환합니다.
	*/
	public function get_action_table_object($table_id, $order=0, $is_shy=0) {

		if($this->is_not_unsigned_number(__FUNCTION__, $table_id, "table_id")){
			return;
		}

		// 테이블을 조회합니다.
		$parent_table_n_child_list_list = $this->sel_parent_table_n_child_list($table_id);
		if($this->is_empty(__FUNCTION__, $parent_table_n_child_list_list, "parent_table_n_child_list_list")) {
			return;
		}
		$parent_table_info = $parent_table_n_child_list_list[0];

		$action_table_obj = new ActionCollection();
		$action_table_obj->set_id($parent_table_info->__table_id);
		$action_table_obj->set_hash_key($parent_table_info->__table_hash_key);
		$action_table_obj->set_collection_type($parent_table_info->__table_type);
		$action_table_obj->set_collection_type_name($parent_table_info->__table_type_name);
		$action_table_obj->set_name($parent_table_info->__table_name);
		$action_table_obj->set_order($order);
		$action_table_obj->set_is_shy($is_shy);
		$action_table_obj->set_meeting_agenda_id($parent_table_info->__table_meeting_agenda_id);

		// DEBUG
		$cur_action_name = $action_table_obj->get_name;
		$cur_children_cnt = count($parent_table_n_child_list_list);
		// echo "get_action_table_object / $cur_name / \$cur_children_cnt :: $cur_children_cnt<br/>";

		// 테이블이 자식 리스트를 가지고 있다면, 테이블에 포함된 자식 리스트 정보를 다시 조회합니다.
		// 자식 리스트의 숨김 여부를 알려줍니다.
		for($idx=0;$idx < count($parent_table_n_child_list_list);$idx++) {

			$child_list_obj = $parent_table_n_child_list_list[$idx];
			if($this->is_null_object(__FUNCTION__, $child_list_obj, "child_list_obj")){
				return;
			}

			$__table_child_list_id = intval($child_list_obj->__table_child_list_id);
			if($__table_child_list_id < 0) {
				// 자식 컬렉션이 없는 경우.
				continue;
			}

			$__table_child_list_order = intval($child_list_obj->__table_child_list_order);
			if($this->is_not_unsigned_number(__FUNCTION__, $__table_child_list_order, "__table_child_list_order")){
				return;
			}

			$__table_child_list_is_shy = $child_list_obj->__table_child_list_is_shy;
			if($this->is_not_unsigned_number(__FUNCTION__, $__table_child_list_is_shy, "__table_child_list_is_shy")){
				return;
			}

			$child_list_obj = 
			$this->get_action_list_object(
				$__table_child_list_id
				, $__table_child_list_order
				, $__table_child_list_is_shy
			);
			if($this->is_null_object(__FUNCTION__, $child_list_obj, "child_list_obj")) {
				return;
			}

			$action_table_obj->add_child($child_list_obj);
			$child_list_obj->set_parent($action_table_obj);
		}

		return $action_table_obj;
	}
	/*
		@ private
		@ Desc : 액션 테이블 관련 정보를 가져옵니다. 컬럼 리스트 정보를 포함합니다.
	*/
	private function sel_parent_table_n_child_list($table_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $table_id, "table_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AC.`id` AS __table_id"
				,",AC.`hash_key` AS __table_hash_key"
				,",AC.`type` AS __table_type"
				,",AC.`name` AS __table_name"
				,",ACT.`name` AS __table_type_name"

				,",IFNULL(CHILD_LIST.`id`,-1) AS __table_child_list_id"
				,",IFNULL(CHILD_LIST.`name`,\"\") AS __table_child_list_name"
				,",IFNULL(CHILD_LIST.`hash_key`,\"\") AS __table_child_list_hash_key"
				,",IFNULL(PARENT_TABLE_N_CHILD_COLUMN_LIST.`order`, 0) AS __table_child_list_order"
				,",IFNULL(PARENT_TABLE_N_CHILD_COLUMN_LIST.`is_shy_child`,-1) AS __table_child_list_is_shy"

				,"FROM ACTION_COLLECTION AS AC"
				,"LEFT JOIN ACTION_COLLECTION_N_MEETING_AGENDA AS AC_MA ON AC_MA.action_collection_id=AC.`id`"
				,"LEFT JOIN ACTION_COLLECTION_TYPE AS ACT ON ACT.id=AC.`type`"

				,"LEFT JOIN PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST AS PARENT_TABLE_N_CHILD_COLUMN_LIST ON PARENT_TABLE_N_CHILD_COLUMN_LIST.parent_action_table_id=AC.`id`"
				,"LEFT JOIN ACTION_COLLECTION AS CHILD_LIST ON CHILD_LIST.id=PARENT_TABLE_N_CHILD_COLUMN_LIST.child_column_action_list_id"

				,"WHERE AC.`id`=$table_id"
				,"AND AC.`type`=2"
			)
		);

		// $query_manager->printFormattedQuery();
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		return $query_manager->get_result();
	}
	/*
		@ private
		@ Desc : 액션 리스트 관련 정보를 가져옵니다. 아이템 정보는 포함하지 않습니다. 1개의 객체만 반환합니다.
	*/
	private function sel_action_table_info($table_id) {

		if($this->is_not_unsigned_number(__FUNCTION__, $table_id, "table_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AC.`id` AS __list_id"
				,",AC.`hash_key` AS __list_hash_key"
				,",AC.`type` AS __list_type"
				,",AC.`name` AS __list_name"
				,",ACT.`name` AS __list_type_name"
				,",PARENT_ITEM_N_CHILD_COLLECTION.`is_shy_child` AS __list_is_shy"

				,",IFNULL(MA.`id`,-1) AS __list_meeting_agenda_id"
				,",IFNULL(MA.`round`,-1) AS __list_meeting_agenda_round"
				,",IFNULL(MA.`theme`,\"\") AS __list_meeting_agenda_theme"

				,",IFNULL(PARENT_ITEM.`id`,-1) AS __list_parent_item_id"
				,",IFNULL(PARENT_ITEM.`name`,\"\") AS __list_parent_item_name"
				,",IFNULL(PARENT_ITEM.`hash_key`,\"\") AS __list_parent_item_hash_key"
				,",IFNULL(PARENT_ITEM.`type`,\"\") AS __list_parent_item_type"
				,",IFNULL(PARENT_ITEM.`context`,\"\") AS __list_parent_item_context"

				,"FROM ACTION_COLLECTION AS AC"
				,"LEFT JOIN ACTION_COLLECTION_N_MEETING_AGENDA AS AC_MA ON AC_MA.action_collection_id=AC.`id`"
				,"LEFT JOIN MEETING_AGENDA AS MA ON MA.id=AC_MA.meeting_agenda_id"
				,"LEFT JOIN ACTION_COLLECTION_TYPE AS ACT ON ACT.id=AC.`type`"

				,"LEFT JOIN PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION AS PARENT_ITEM_N_CHILD_COLLECTION ON PARENT_ITEM_N_CHILD_COLLECTION.child_action_collection_id=AC.id"
				,"LEFT JOIN ACTION_ITEM AS PARENT_ITEM ON PARENT_ITEM.id=PARENT_ITEM_N_CHILD_COLLECTION.parent_action_item_id"

				,"WHERE AC.`id`=$table_id"
				,"AND AC.`type`=2"
				,"LIMIT 1"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		return $query_manager->get_result();
	}
	/*
		@ private
		@ Desc : 액션 컬렉션의 hash key로 id를 돌려줍니다.
	*/
	public function get_action_collection_id($collection_hash_key) {

		if($this->is_empty(__FUNCTION__, $collection_hash_key, "collection_hash_key")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AC.`id` AS __collection_id"
				,", AC.`hash_key` AS __collection_hash_key"
				,", AC.`type` AS __collection_type"
				,", AC.`name` AS __collection_name"
				,"FROM ACTION_COLLECTION AS AC"
				,"WHERE AC.`hash_key`=\"$collection_hash_key\""
				,"LIMIT 1"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		$cur_action_item = $query_manager->get_result();
		if(is_null($cur_action_item)) {
			$__collection_id = -1;	
		} else {
			$__collection_id = intval($cur_action_item->__collection_id);	
		}
		
		return $__collection_id;
	}	
	/*
		@ private
		@ Desc : 액션 아이템의 hash key로 id를 돌려줍니다.
	*/
	public function get_action_item_id($item_hash_key) {

		if($this->is_empty(__FUNCTION__, $item_hash_key, "item_hash_key")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AI.`id` AS __item_id"
				,", AI.`hash_key` AS __item_hash_key"
				,", AI.`type` AS __item_type"
				,", AI.`name` AS __item_name"
				,", AI.`context` AS __item_context"
				,"FROM ACTION_ITEM AS AI"
				,"WHERE hash_key=\"$item_hash_key\""
				,"LIMIT 1"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		$cur_action_item = $query_manager->get_result();
		if(is_null($cur_action_item)) {
			$__item_id = -1;	
		} else {
			$__item_id = intval($cur_action_item->__item_id);	
		}
		
		return $__item_id;
	}
	// @ desc : 부모, 형제, 자식 참조를 가지고 있는 action item obj를 돌려줍니다.
	public function get_action_item_obj_with_relation($root_action_hash_key="", $meeting_id=-1, $action_item_hash_key="") {

		$root_action_id = $this->get_action_collection_id($root_action_hash_key);
		if($this->is_not_unsigned_number(__FUNCTION__, $root_action_id, "root_action_id")) {
			return;
		}
		$root_action_list = $this->get_root_action_collection($root_action_id, $meeting_id);
		if($this->is_not_action_collection(__FUNCTION__, $root_action_list, "root_action_list")) {
			return;
		}

		$action_item_obj_target = $root_action_list->search_hash_key($action_item_hash_key);
		if($this->is_not_action_item(__FUNCTION__, $action_item_obj_target, "action_item_obj_target")) {
			return;
		}

		return $action_item_obj_target;
	}

	/*
		@ public
		@ Desc : 액션 리스트 관련 정보를 가져옵니다. 부모, 자식 관계를 오브젝트, 프로퍼티 형태로 변환하여 전달합니다.
	*/
	public function get_action_item_object($item_id, $order=0, $is_shy=0) {

		if($this->is_not_unsigned_number(__FUNCTION__, $item_id, "item_id")){
			return;
		}

		$parent_item_n_child_collection_list = $this->sel_parent_action_item_n_child_collection($item_id);
		if($this->is_null_object(__FUNCTION__, $parent_item_n_child_collection_list, "parent_item_n_child_collection_list")){
			return;
		}

		$parent_item_n_add_on_collection_list = $this->sel_parent_action_item_n_add_on_collection($item_id);
		if($this->is_null_object(__FUNCTION__, $parent_item_n_add_on_collection_list, "parent_item_n_add_on_collection_list")){
			return;
		}

		$parent_item = $parent_item_n_child_collection_list[0];
		if($this->is_null_object(__FUNCTION__, $parent_item, "parent_item")){
			return;
		}

		$cur_action_item = $parent_item_n_child_collection_list[0];

		if(ActionItem::$TITLE_N_TIME_HH_MM == $cur_action_item->__item_type) {
			$action_item = new ActionItemTitleNTimeHHMM();
		} else {
			$action_item = new ActionItem();
		}

		$action_item->set_id(intval($cur_action_item->__item_id));
		$action_item->set_hash_key($cur_action_item->__item_hash_key);
		$action_item->set_item_type(intval($cur_action_item->__item_type));
		$action_item->set_item_type_name($cur_action_item->__item_type_name);
		$action_item->set_name($cur_action_item->__item_name);

		$cur_context = $cur_action_item->__item_context;

		$action_item->set_context($cur_action_item->__item_context);
		$action_item->set_order($order);
		$action_item->set_is_shy($is_shy);

		// DEBUG
		$cur_action_name = $action_item->get_name();
		$cur_children_cnt = count($parent_item_n_child_collection_list);
		// echo "get_action_item_object / $cur_action_name / \$cur_children_cnt :: $cur_children_cnt<br/>";


		// CHILD COLLECTION
		for($idx=0;$idx < count($parent_item_n_child_collection_list);$idx++) {
			$child_collection_obj = $parent_item_n_child_collection_list[$idx];
			if($this->is_null_object(__FUNCTION__, $child_collection_obj, "child_collection_obj")){

				return;
			}

			$__item_child_collection_id = intval($child_collection_obj->__item_child_collection_id);
			$__item_child_collection_type =  $child_collection_obj->__item_child_collection_type;
			if($__item_child_collection_id < 0){
				// 자식 컬렉션이 없는 경우.
				continue;
			}

			$__item_child_collection_order =  $child_collection_obj->__item_child_collection_order;
			if($this->is_not_unsigned_number(__FUNCTION__, $__item_child_collection_order, "__item_child_collection_order")){
				return;
			}

			$__item_child_collection_is_shy =  $child_collection_obj->__item_child_collection_is_shy;
			if($this->is_not_unsigned_number(__FUNCTION__, $__item_child_collection_is_shy, "__item_child_collection_is_shy")){
				return;
			}

			$child_collection_obj = null;
			if($this->COLLECTION_TYPE_LIST == $__item_child_collection_type) {
				// 1. 리스트 형일 경우.  
				$child_collection_obj = 
				$this->get_action_list_object(
					$__item_child_collection_id
					, $__item_child_collection_order
					, $__item_child_collection_is_shy
				);
			} else if($this->COLLECTION_TYPE_LIST == $__item_child_collection_type) {
				// 2. 테이블 형일 경우.
				$child_collection_obj = 
				$this->get_action_table_object(
					$__item_child_collection_id
					, $__item_child_collection_order
					, $__item_child_collection_is_shy
				);
			}

			if($this->is_null_object(__FUNCTION__, $child_collection_obj, "child_collection_obj")){
				return;
			}

			$action_item->add_child($child_collection_obj);
			$child_collection_obj->set_parent($action_item);
		}

		// DEBUG
		$action_children_cnt = $action_item->get_children_cnt();
		// echo "get_action_item_object / $cur_action_name / \$action_children_cnt :: $action_children_cnt<br/>";


		// ADD ON COLLECTION
		for($idx=0;$idx < count($parent_item_n_add_on_collection_list);$idx++) {
			$add_on_collection_obj = $parent_item_n_add_on_collection_list[$idx];
			if($this->is_null_object(__FUNCTION__, $add_on_collection_obj, "add_on_collection_obj")){
				return;
			}

			$__item_add_on_collection_id = intval($add_on_collection_obj->__item_add_on_collection_id);
			$__item_add_on_collection_type =  $add_on_collection_obj->__item_add_on_collection_type;
			if($__item_add_on_collection_id < 0){
				// 자식 컬렉션이 없는 경우.
				continue;
			}

			$__item_add_on_collection_order =  $add_on_collection_obj->__item_add_on_collection_order;
			if($this->is_not_unsigned_number(__FUNCTION__, $__item_add_on_collection_order, "__item_add_on_collection_order")){
				return;
			}

			// add-on 타입은 무조건 노출입니다.
			$__item_add_on_collection_is_shy =  0;

			$add_on_colllection_obj = null;
			if($this->COLLECTION_TYPE_LIST == $__item_add_on_collection_type) {
				// 1. 리스트 형일 경우.  
				$add_on_colllection_obj = 
				$this->get_action_list_object(
					$__item_add_on_collection_id
					, $__item_add_on_collection_order
					, $__item_add_on_collection_is_shy
				);
			} else if($this->COLLECTION_TYPE_TABLE == $__item_add_on_collection_type) {
				// 2. 테이블 형일 경우.
				$add_on_colllection_obj = 
				$this->get_action_table_object(
					$__item_add_on_collection_id
					, $__item_add_on_collection_order
					, $__item_add_on_collection_is_shy
				);
			}

			if($this->is_null_object(__FUNCTION__, $add_on_collection_obj, "add_on_collection_obj")){
				echo "\$this->is_null_object(\$add_on_collection_obj)<br/>";
				return;
			}

			$action_item->push_add_on($add_on_colllection_obj);
			$add_on_colllection_obj->set_parent($action_item);
		}		

		return $action_item;
	}
	/*
		@ private
		@ Desc : 액션 아이템 관련 정보를 가져옵니다. 1개의 객체만 반환합니다. 아이템의 부모 리스트 정보가 포함됩니다.
	*/
	private function sel_parent_action_item_n_child_collection($parent_item_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_item_id, "parent_item_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AI.id AS __item_id"
				,",AI.hash_key AS __item_hash_key"
				,",AI.`type` AS __item_type"
				,",AIT.`name` AS __item_type_name"
				,",AI.`name` AS __item_name"
				,",AI.`context` AS __item_context"

				,",IFNULL(CHILD_COLLECTION.id, -1) AS __item_child_collection_id"
				,",IFNULL(CHILD_COLLECTION.hash_key, \"\") AS __item_child_collection_hash_key"
				,",IFNULL(CHILD_COLLECTION.`type`, -1) AS __item_child_collection_type"
				,",IFNULL(CHILD_COLLECTION.`name`, -1) AS __item_child_collection_name"
				,",IFNULL(PARENT_ITEM_N_CHILD_COLLECTION.`order`, 0) AS __item_child_collection_order"
				,",IFNULL(PARENT_ITEM_N_CHILD_COLLECTION.`is_shy_child`, -1) AS __item_child_collection_is_shy"

				,"FROM ACTION_ITEM AS AI"
				,"LEFT JOIN ACTION_ITEM_TYPE AS AIT ON AIT.id=AI.type"

				,"LEFT JOIN PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION AS PARENT_ITEM_N_CHILD_COLLECTION ON PARENT_ITEM_N_CHILD_COLLECTION.parent_action_item_id=AI.id"
				,"LEFT JOIN ACTION_COLLECTION AS CHILD_COLLECTION ON CHILD_COLLECTION.id=PARENT_ITEM_N_CHILD_COLLECTION.child_action_collection_id"

				,"WHERE AI.id=$parent_item_id"
				,"ORDER BY PARENT_ITEM_N_CHILD_COLLECTION.`order`"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		return $query_manager->get_result();		
	}
	/*
		@ private
		@ Desc : 액션 아이템 관련 정보를 가져옵니다. 1개의 객체만 반환합니다. 아이템의 부모 리스트 정보가 포함됩니다.
	*/
	private function sel_parent_action_item_n_add_on_collection($parent_item_id=-1) {		

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_item_id, "parent_item_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AI.id AS __item_id"
				,",AI.hash_key AS __item_hash_key"
				,",AI.`type` AS __item_type"
				,",AIT.`name` AS __item_type_name"
				,",AI.`name` AS __item_name"
				,",AI.`context` AS __item_context"

				,",IFNULL(ADD_ON_COLLECTION.id, -1) AS __item_add_on_collection_id"
				,",IFNULL(ADD_ON_COLLECTION.hash_key, \"\") AS __item_add_on_collection_hash_key"
				,",IFNULL(ADD_ON_COLLECTION.`type`, -1) AS __item_add_on_collection_type"
				,",IFNULL(ADD_ON_COLLECTION.`name`, -1) AS __item_add_on_collection_name"
				,",IFNULL(PARENT_ITEM_N_ADD_ON_COLLECTION.`order`, 0) AS __item_add_on_collection_order"

				,"FROM ACTION_ITEM AS AI"
				,"LEFT JOIN ACTION_ITEM_TYPE AS AIT ON AIT.id=AI.type"

				,"LEFT JOIN PARENT_ACTION_ITEM_N_ADD_ON_ACTION_COLLECTION AS PARENT_ITEM_N_ADD_ON_COLLECTION ON PARENT_ITEM_N_ADD_ON_COLLECTION.parent_action_item_id=AI.id"
				,"LEFT JOIN ACTION_COLLECTION AS ADD_ON_COLLECTION ON ADD_ON_COLLECTION.id=PARENT_ITEM_N_ADD_ON_COLLECTION.add_on_action_collection_id"

				,"WHERE AI.id=$parent_item_id"
				,"ORDER BY PARENT_ITEM_N_ADD_ON_COLLECTION.`order`"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		return $query_manager->get_result();		
	}	
	/*
		@ private
		@ Desc : 액션 아이템 관련 정보를 가져옵니다. 1개의 객체만 반환합니다. 아이템의 부모 리스트 정보가 포함됩니다.
	*/
	private function sel_action_item_n_parent($parent_list_id=-1, $child_item_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $parent_list_id, "parent_list_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $child_item_id, "child_item_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AI.id AS __item_id"
				,",AI.hash_key AS __item_hash_key"
				,",AI.`type` AS __item_type"
				,",AIT.`name` AS __item_type_name"
				,",AI.`name` AS __item_name"
				,",AI.`context` AS __item_context"
				,",PARENT_LIST_N_CHILD_ITEM.order AS __item_order"
				,",PARENT_LIST_N_CHILD_ITEM.is_shy_child AS __item_is_shy"

				,",IFNULL(PARENT_LIST.id, -1) AS __item_parent_list_id"
				,",IFNULL(PARENT_LIST.hash_key, \"\") AS __item_parent_list_hash_key"
				,",IFNULL(PARENT_LIST.`type`, -1) AS __item_parent_list_type"
				,",IFNULL(PARENT_LIST.`name`, -1) AS __item_parent_list_name"

				,"FROM ACTION_ITEM AS AI"
				,"LEFT JOIN ACTION_ITEM_TYPE AS AIT ON AIT.id=AI.`type`"
				,"LEFT JOIN PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM AS PARENT_LIST_N_CHILD_ITEM ON PARENT_LIST_N_CHILD_ITEM.child_action_item_id=AI.id"
				,"LEFT JOIN ACTION_COLLECTION AS PARENT_LIST ON PARENT_LIST.id=PARENT_LIST_N_CHILD_ITEM.parent_action_list_id"

				,"WHERE AI.id=$child_item_id"
				,"AND PARENT_LIST_N_CHILD_ITEM.parent_action_list_id=$parent_list_id"
				,"LIMIT 1"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		//$query_manager->show_result();

		return $query_manager->get_result();		
	}











	/*
		@ Public
		@ Desc : 
	*/
	public function add_root_action_collection_list($meeting_agenda_id, $list_name) {

		if($this->is_not_unsigned_number(__FUNCTION__, $meeting_agenda_id, "meeting_agenda_id")){
			return;
		}
		if($this->is_empty(__FUNCTION__, $list_name, "list_name")){
			return;
		}

		// 리스트를 추가합니다.
		$root_action_list = $this->insert_action_collection_list_v2($list_name);
		if($this->is_not_action_collection(__FUNCTION__, $root_action_list, "root_action_list") || !$root_action_list->is_list()){
			return;
		}

		$root_action_list = 
		$this->insert_action_collection_n_meeting_agenda_v2(
			// $action_collection_id
			$root_action_list
			// $meeting_agenda_id
			, $meeting_agenda_id
		);

		// set search_map, coordinates
		$root_action_list->set_meeting_agenda_id($meeting_agenda_id);
		$root_action_list->set_coordinate();
		$root_action_list->set_search_map();

		return $root_action_list;
	}
	// @ Public
	// @ Desc : action item을 전달받은 전후 객체 참조를 이용, 복사해서 만듭니다. 부모는 그대로 연결, 자식 item 객체는 shy mode로 복제합니다.
	public function copy_action_collection_relation($action_collection_obj) {

		if($this->is_not_action_collection(__FUNCTION__, $action_collection_obj, "action_collection_obj")){
			return;
		}
		// root collection action은 지원하지 않습니다.
		if($action_collection_obj->is_root_collection()) {
			echo "!Error! / copy_action_collection_relation / \$action_collection_obj->is_root_collection()";
			return;
		}

		// LIST 형만 지원합니다.
		if($this->is_not_action_list(__FUNCTION__, $action_collection_obj, "action_collection_obj")){
			return;
		}


		$parent_action_item_obj = $action_collection_obj->get_parent();
		// 부모 액션 엘리먼트는 아이템 객체입니다. 그러므로 부모 액션이 item type인지 확인합니다. 이 메서드안에서 부모 객체는 반드시 있어야 합니다.
		if($this->is_not_action_item(__FUNCTION__, $parent_action_item_obj, "parent_action_item_obj")){
			return;
		}

		//add_action_collection_no_relation
		$action_collection_obj_copy = $this->add_action_collection_no_relation($action_collection_obj);
		if($this->is_not_action_collection(__FUNCTION__, $action_collection_obj_copy, "action_collection_obj_copy")){
			return;
		}

		// SET PARENT RELATION
		$action_collection_obj_copy->set_parent($parent_action_item_obj);
		$parent_action_item_obj->add_child($action_collection_obj_copy);
		$this->insert_parent_action_item_n_child_collection_v2($parent_action_item_obj, $action_collection_obj_copy);


		// SET CHILDREN RELATION
		$cur_first_child_item_obj = null;
		if($action_collection_obj->has_children()) {
			// 자식 객체가 있는 경우라면 shy mode로 추가합니다.
			$cur_first_child_item_obj = $action_collection_obj->get_first_child();

			$is_shy = 1; // shy mode로 추가합니다.
			$cur_first_child_item_obj_copy = $this->copy_action_item_relation($cur_first_child_item_obj, $is_shy);
			$action_collection_obj_copy->add_child($cur_first_child_item_obj_copy);
		}

	}
	// @ Public
	// @ Desc : action item을 전달받은 전후 객체 참조를 이용, 복사해서 만듭니다. 부모는 그대로 연결, 자식 collection 객체는 복제합니다.
	public function copy_action_item_relation($action_item_target_before, $is_shy=0, $action_name="", $action_context="") {

		if($this->is_not_action_item(__FUNCTION__, $action_item_target_before, "action_item_target_before")){
			return;
		}

		$parent_action_collection_obj = $action_item_target_before->get_parent();
		// 부모 액션 엘리먼트는 컬렉션 객체입니다. 그러므로 부모 액션이 collection type인지 확인합니다.
		if($this->is_not_action_collection(__FUNCTION__, $parent_action_collection_obj, "parent_action_collection_obj")){
			return;
		}
		
		$action_item_copy = $this->copy_action_item_no_relation($action_item_target_before, $action_name, $action_context);
		if($this->is_not_action_item(__FUNCTION__, $action_item_copy, "action_item_copy")){
			return;
		}

		// SET PARENT
		if($this->is_action_obj(__FUNCTION__, $parent_action_collection_obj)){
			$action_item_copy->set_parent($parent_action_collection_obj);
			$cur_idx = $action_item_target_before->get_idx();
			// 형제 리스트의 추가는 앞선 형제의 뒤로만 추가합니다.
			$parent_action_collection_obj->add_child($action_item_copy, ($cur_idx + 1));

			// 실제 DB상에서 형제 사이에 추가합니다.
			$this->insert_parent_list_n_child_item(
				$parent_action_collection_obj->get_id()
				, $action_item_copy->get_id()
				, ($cur_idx * 100 + 50) // 형제 사이에 추가하기 위한 인덱스
				, $is_shy
			);

			// 해당 리스트의 모든 아이템들을 가져와 ordering을 다시 업데이트해줍니다.
			$this->reorder_child_item_in_parent_list($parent_action_collection_obj->get_id());
		}

		// SET CHILD RELATION
		$child_action_collection_obj_list = null;
		if($action_item_target_before->has_children()) {
			// 첫번째 자식 객체만 추가합니다.
			$cur_first_child_collection_obj = $action_item_target_before->get_first_child();
			// 새로 만든 아이템으로 부모 객체를 변경합니다.
			$cur_first_child_collection_obj->set_parent($action_item_copy);
			$this->copy_action_collection_relation($cur_first_child_collection_obj);
		}

		return $action_item_copy;
	}
	/*
		@ Private
		@ Desc : action item을 추가합니다. 추가된 action item 객체를 돌려줍니다. 이 객체로 id와 hashkey를 넘겨줍니다. 부모, 자식 객체 관계는 연결하지 않습니다.
	*/
	private function copy_action_item_no_relation($action_item_target, $action_name="", $action_context="") {

		if($this->is_not_action_item(__FUNCTION__, $action_item_target, "action_item_target")){
			return;
		}
		$type = $action_item_target->get_item_type();
		if($this->is_not_action_item_type(__FUNCTION__, $type, "type")){
			return;
		}
		if(empty($action_name)) {
			$name = $action_item_target->get_name();
		} else {
			$name = $action_name;
		}
		
		if($this->is_empty(__FUNCTION__, $name, "name")){
			return;
		}

		if(empty($action_context)) {
			$context = $action_item_target->get_context();	
		} else {
			$context = $action_context;
		}
		$context_mysql_safe = $this->mysql_manager->escape_json_str($context);

		$hash_key = $this->get_hash_key("$type $name $context");

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO `magendas`.`ACTION_ITEM`(`hash_key`,`type`,`name`,`context`)"
				,"VALUES(\"$hash_key\",$type,\"$name\",\"$context_mysql_safe\")"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가된 item의 id를 가져옵니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT `id` AS __action_item_id"
				,"FROM ACTION_ITEM"
				,"WHERE `hash_key`=\"$hash_key\""
				,"ORDER BY id DESC"
				,"LIMIT 1"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__action_item_id = -1;
		if(!is_null($result) || !empty($result)) {
			$__action_item_id = $result->__action_item_id;	
		}

		// create action item copy
		$action_item_copy = new ActionItem(null, $type);
		$action_item_copy->set_id($__action_item_id);
		$action_item_copy->set_hash_key($hash_key);
		$action_item_copy->set_name($name);
		$action_item_copy->set_context($context_mysql_safe);

		return $action_item_copy;
	}	
	// @ Public
	// @ Desc : action item을 전달받은 전후 객체 참조를 이용, 삭제합니다. 부모에서의 참조도 제거합니다.
	public function delete_action_item_relation($action_item_target) {

		if($this->is_not_action_item(__FUNCTION__, $action_item_target, "action_item_target")){
			return;
		}

		$parent_action_collection_obj = $action_item_target->get_parent();
		// 부모 액션 엘리먼트는 컬렉션 객체입니다. 그러므로 부모 액션이 collection type인지 확인합니다.
		if($this->is_not_action_collection(__FUNCTION__, $parent_action_collection_obj, "parent_action_collection_obj")){
			return;
		}

		// 실제 DB상에서 부모와의 연결을 제거합니다.
		$this->delete_parent_list_n_child_item(
			$parent_action_collection_obj->get_id()
			, $action_item_target->get_id()
		);

		// 해당 리스트의 모든 아이템들을 가져와 ordering을 다시 업데이트해줍니다.
		$this->reorder_child_item_in_parent_list($parent_action_collection_obj->get_id());

	}	
	/*
		@ Private
		@ Desc : action item을 DB 추가합니다.
	*/
	private function add_action_item_v2($action_item_target) {

		if($this->is_not_action_item(__FUNCTION__, $action_item_target, "action_item_target")){
			return;
		}
		$type = $action_item_target->get_item_type();
		if($this->is_not_action_item_type(__FUNCTION__, $type, "type")){
			return;
		}
		$name = $action_item_target->get_name();
		if($this->is_empty(__FUNCTION__, $name, "name")){
			return;
		}
		$context = $action_item_target->get_context();
		$context_mysql_safe = $this->mysql_manager->escape_json_str($context);

		$hash_key = $this->get_hash_key("$type $name $context");

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO `magendas`.`ACTION_ITEM`(`hash_key`,`type`,`name`,`context`)"
				,"VALUES(\"$hash_key\",$type,\"$name\",\"$context_mysql_safe\")"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가된 item의 id를 가져옵니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AI.`id` AS __action_item_id"
				,", AIT.id AS __action_item_type"
				,", AIT.`name` AS __action_item_type_name"
				,"FROM ACTION_ITEM AS AI"
				,"LEFT JOIN ACTION_ITEM_TYPE AS AIT ON AIT.id=AI.`type`"
				,"WHERE `hash_key`=\"$hash_key\""
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__action_item_id = -1;
		$__action_item_type = -1;
		$__action_item_type_name = "";
		if(!is_null($result) || !empty($result)) {
			$__action_item_id = $result->__action_item_id;	
			$__action_item_type = $result->__action_item_type;	
			$__action_item_type_name = $result->__action_item_type_name;	
		}

		// action item update
		$action_item_target->set_id($__action_item_id);
		$action_item_target->set_hash_key($hash_key);
		$action_item_target->set_item_type($__action_item_type);
		$action_item_target->set_item_type_name($__action_item_type_name);

		return $action_item_target;
	}		
	/*
		@ Private
		@ Desc : action collection을 복사합니다. 복사한 id를 돌려줍니다.
	*/
	private function copy_action_collection_v2($action_collection) {

		if($this->is_not_action_collection(__FUNCTION__, $action_collection, "action_collection")){
			return;
		}

		$type = $action_collection->get_collection_type();
		if($this->is_not_action_collection_type(__FUNCTION__, $type, "type")){
			return;
		}
		$name = $action_collection->get_name();
		if($this->is_empty(__FUNCTION__, $name, "name")){
			return;
		}

		$hash_key = $this->get_hash_key("$type $name");

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO ACTION_COLLECTION(`hash_key`,`type`,`name`)"
				,"VALUES (\"$hash_key\",$type,\"$name\")"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가된 collection의 id를 가져옵니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT `id` AS __action_collection_id"
				,"FROM ACTION_COLLECTION"
				,"WHERE `hash_key`=\"$hash_key\""
				,"ORDER BY id DESC"
				,"LIMIT 1"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}

		$__action_collection_id = -1;
		$result = $query_manager->get_result();
		if(!is_null($result)) {
			$__action_collection_id = $result->__action_collection_id;	
		}

		$action_collection->set_id($__action_collection_id);
		$action_collection->set_hash_key($hash_key);

		// 자식 객체가 있다면, 타입에 맞게 이전 데이터들을 모두 옮겨 줍니다.
		if($action_collection->has_children()) {

			if($action_collection->is_list()) {
				// 1. LIST
				$children_action_item_list = $action_collection->get_children();
				for($idx = 0;$idx < count($children_action_item_list);$idx++) {
					$child_action_item = $children_action_item_list[$idx];
					$this->insert_parent_list_n_child_item_v2($action_collection, $child_action_item);
				} // end for

			} else if($action_collection->is_table()) {
				// 2. TABLE
				$children_action_column_list_list = $action_collection->get_children();
				for($idx = 0;$idx < count($children_action_column_list_list);$idx++) {
					$child_action_column_list = $children_action_column_list_list[$idx];
					$this->insert_parent_action_table_n_child_action_list_v2($action_collection, $child_action_column_list);
				} // end for

			} // end inner if
			
		} // end outer if

		// meeting_agenda id가 있다면 새로운 action collection과 연결해줍니다.
		$cur_meeting_agenda_id = $action_collection->get_meeting_agenda_id();
		if(0 < $cur_meeting_agenda_id) {
			$action_collection = 
			$this->insert_action_collection_n_meeting_agenda_v2(
				// $action_collection_id
				$action_collection
				// $meeting_agenda_id
				, $cur_meeting_agenda_id
			);
		} // end if

		return $action_collection;		

	}
	/*
		@ Private
		@ Desc : action collection을 DB에 저장합니다.
	*/
	private function add_action_collection_no_relation($action_collection) {

		if($this->is_not_action_collection(__FUNCTION__, $action_collection, "action_collection")){
			return;
		}

		$type = $action_collection->get_collection_type();
		if($this->is_not_action_collection_type(__FUNCTION__, $type, "type")){
			return;
		}
		$name = $action_collection->get_name();
		if($this->is_empty(__FUNCTION__, $name, "name")){
			return;
		}

		$hash_key = $this->get_hash_key("$type $name");

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO ACTION_COLLECTION(`hash_key`,`type`,`name`)"
				,"VALUES (\"$hash_key\",$type,\"$name\")"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가된 collection의 id를 가져옵니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AC.`id` AS __action_collection_id"
				,", ACT.`id` AS __action_collection_type"
				,", ACT.`name` AS __action_collection_type_name"
				,"FROM ACTION_COLLECTION AS AC"
				,"LEFT JOIN ACTION_COLLECTION_TYPE AS ACT ON ACT.id=AC.type"
				,"WHERE AC.`hash_key`=\"$hash_key\""
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}

		$__action_collection_id = -1;
		$__action_collection_type = -1;
		$__action_collection_type_name = "";
		$result = $query_manager->get_result();
		if(!is_null($result)) {
			$__action_collection_id = $result->__action_collection_id;
			$__action_collection_type = $result->__action_collection_type;
			$__action_collection_type_name = $result->__action_collection_type_name;
		}

		$action_collection->set_id($__action_collection_id);
		$action_collection->set_hash_key($hash_key);
		$action_collection->set_collection_type($__action_collection_type);
		$action_collection->set_collection_type_name($__action_collection_type_name);

		// meeting_agenda id가 있다면 새로운 action collection과 연결해줍니다.
		$cur_meeting_agenda_id = $action_collection->get_meeting_agenda_id();
		if(0 < $cur_meeting_agenda_id) {
			$action_collection = 
			$this->insert_action_collection_n_meeting_agenda_v2(
				// $action_collection_id
				$action_collection
				// $meeting_agenda_id
				, $cur_meeting_agenda_id
			);
		} // end if

		return $action_collection;		

	}	
	private function insert_parent_action_item_n_child_collection_v2($parent_action_item_obj, $child_action_collection_obj) {

		if($this->is_not_action_item(__FUNCTION__, $parent_action_item_obj, "parent_action_item_obj")){
			return;
		}
		$parent_action_item_id = $parent_action_item_obj->get_id();
		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_item_id, "parent_action_item_id")){
			return;
		}

		if($this->is_not_action_collection(__FUNCTION__, $child_action_collection_obj, "child_action_collection_obj")){
			return;
		}
		$child_action_collection_id = $child_action_collection_obj->get_id();
		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_collection_id, "child_action_collection_id")){
			return;
		}


		// 이미 추가된 parent item, child collection이 아닌지 확인한다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(AINCAC.parent_action_item_id) AS __item_child_collection_cnt"
				,"FROM PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION AS AINCAC"
				,"WHERE AINCAC.parent_action_item_id=$parent_action_item_id"
				,"AND AINCAC.child_action_collection_id=$child_action_collection_id"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__item_child_collection_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__item_child_collection_cnt = $result->__item_child_collection_cnt;
		}
		if(0 < $__item_child_collection_cnt){
			// 이미 등록되어 있다면 중단합니다.
			return;
		}
	


		// 해당 리스트에 이전에 등록된 아이템 목록을 가져옵니다.
		// 추가되는 아이템은 리스트의 가장 마지막에 추가됩니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(AINCAC.parent_action_item_id) AS __item_child_collection_cnt"
				,"FROM PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION AS AINCAC"
				,"WHERE AINCAC.parent_action_item_id=$parent_action_item_id"
				,"ORDER BY AINCAC.order"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__item_child_collection_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__item_child_collection_cnt = $result->__item_child_collection_cnt;	
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $__item_child_collection_cnt, "__item_child_collection_cnt")){
			return;
		}

		// 아이템 사이에 넣을 수 있도록 100 단위로 ordering 값을 지정해줍니다.
		$is_shy_child = ($__item_child_collection_cnt == 0)?1:0;
		$new_order = intval($__item_child_collection_cnt) * 100;
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO PARENT_ACTION_ITEM_N_CHILD_ACTION_COLLECTION"
				,"(`parent_action_item_id`,`child_action_collection_id`,`order`,`is_shy_child`)"
				,"VALUES ($parent_action_item_id,$child_action_collection_id,$new_order,$is_shy_child)"
			)
		);
		// $query_manager->printFormattedQuery();
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가한 데이터를 재정렬 해줍니다.
		$this->reorder_child_collection_in_parent_item($parent_action_item_id);

	}
	// @ private
	// @ desc : 맨 마지막 엘리먼트로 추가합니다.
	private function insert_parent_list_n_child_item_v2($parent_action_list, $child_action_item) {

		if($this->is_not_action_list(__FUNCTION__, $parent_action_list, "parent_action_list")){
			return;
		}
		$parent_action_list_name = $parent_action_list->get_name();
		$parent_action_list_id = $parent_action_list->get_id();
		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_list_id, "parent_action_list_id :: $parent_action_list_name")){
			return;
		}

		if($this->is_not_action_item(__FUNCTION__, $child_action_item, "child_action_item")){
			return;
		}
		$child_action_item_name = $child_action_item->get_name();
		$child_action_item_id = $child_action_item->get_id();
		if($this->is_not_unsigned_number(__FUNCTION__, $child_action_item_id, "\$child_action_item_id :: $child_action_item_name / \$child_action_item_id :: $child_action_item_id")){
			return;
		}

		// 해당 리스트에 이미 등록되지 않았는지 확인합니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(PARENT_LIST_N_CHILD_ITEM.child_action_item_id) AS __list_child_item_cnt"
				,"FROM PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM AS PARENT_LIST_N_CHILD_ITEM"
				,"WHERE PARENT_LIST_N_CHILD_ITEM.parent_action_list_id=$parent_action_list_id"
				,"AND PARENT_LIST_N_CHILD_ITEM.child_action_item_id=$child_action_item_id"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();
		$__list_child_item_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__list_child_item_cnt = $result->__list_child_item_cnt;	
		}
		if(0 < $__list_child_item_cnt) {
			// 이미 설정되어 있습니다. 종료합니다.
			return;
		}

		// 해당 리스트에 등록된 아이템 갯수를 조회합니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(PARENT_LIST_N_CHILD_ITEM.child_action_item_id) AS __list_child_item_cnt"
				,"FROM PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM AS PARENT_LIST_N_CHILD_ITEM"
				,"WHERE PARENT_LIST_N_CHILD_ITEM.parent_action_list_id=$parent_action_list_id"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__list_child_item_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__list_child_item_cnt = $result->__list_child_item_cnt;	
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $__list_child_item_cnt, "__list_child_item_cnt")){
			return;
		}

		$order = $__list_child_item_cnt * 100;
		if($this->is_not_unsigned_number(__FUNCTION__, $order, "order")){
			return;
		}
		$is_shy_child = $child_action_item->get_is_shy();
		$is_shy_child_int = 0;
		if($is_shy_child == true) {
			$is_shy_child_int = 1;
		}

		// 맨 마지막 엘리먼트로 추가합니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO `magendas`.`PARENT_ACTION_LIST_N_CHILD_ACTION_ITEM`(`parent_action_list_id`,`child_action_item_id`,`order`,`is_shy_child`)"
				,"VALUES($parent_action_list_id,$child_action_item_id,$order,$is_shy_child_int)"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// DEBUG
		// echo "insert_parent_list_n_child_item_v2 / \$parent_action_list_id :: $parent_action_list_id / \$child_action_item_id :: $child_action_item_id<br/>";

	}
	private function insert_parent_action_table_n_child_action_list_v2($parent_action_table, $child_action_list) {

		if($this->is_not_action_collection(__FUNCTION__, $parent_action_table, "parent_action_table")){
			return;
		}
		$parent_action_table_id = $parent_action_table->get_id();
		if($this->is_not_unsigned_number(__FUNCTION__, $parent_action_table_id, "parent_action_table_id")){
			return;
		}

		if($this->is_not_action_collection(__FUNCTION__, $child_action_list, "child_action_list")){
			return;
		}
		$child_column_action_list_id = $child_action_list->get_id();
		if($this->is_not_unsigned_number(__FUNCTION__, $child_column_action_list_id, "child_column_action_list_id")){
			return;
		}

		// 이미 등록되어 있는 아이템은 아닌지 확인합니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(PATNCCAL.child_column_action_list_id) AS __child_column_list_cnt"
				,"FROM PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST AS PATNCCAL"
				,"WHERE PATNCCAL.parent_action_table_id=$parent_action_table_id"
				,"AND PATNCCAL.child_column_action_list_id=$child_column_action_list_id"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__child_column_list_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__child_column_list_cnt = intval($result->__child_column_list_cnt);	
		}
		if(0 < $__child_column_list_cnt){
			// 이미 등록되어 있습니다. 중단합니다.
			return;
		}



		// 해당 리스트에 이전에 등록된 아이템 목록을 가져옵니다.
		// 추가되는 아이템은 리스트의 가장 마지막에 추가됩니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT COUNT(PATNCCAL.child_column_action_list_id) AS __child_column_list_cnt"
				,"FROM PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST AS PATNCCAL"
				,"WHERE PATNCCAL.parent_action_table_id=$parent_action_table_id"
				,"ORDER BY PATNCCAL.order"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();

		$__child_column_list_cnt = 0;
		if(!is_null($result) || !empty($result)) {
			$__child_column_list_cnt = intval($result->__child_column_list_cnt);	
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $__child_column_list_cnt, "__child_column_list_cnt")){
			return;
		}

		// 아이템 사이에 넣을 수 있도록 100 단위로 ordering 값을 지정해줍니다.
		$is_shy_child = ($__child_column_list_cnt == 0)?1:0;
		$new_order = $__child_column_list_cnt * 100;
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO PARENT_ACTION_TABLE_N_CHILD_COLUMN_ACTION_LIST"
				,"(parent_action_table_id,child_column_action_list_id,`order`,`is_shy_child`)"
				,"VALUES($parent_action_table_id,$child_column_action_list_id,$new_order,$is_shy_child)"
			)
		);

		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}
	}
	private function insert_action_collection_list_v2($list_name) {

		if($this->is_empty(__FUNCTION__, $list_name, "list_name")){
			return;
		}

		// 리스트를 추가합니다.
		$new_action_list = $this->insert_action_collection_v2($this->COLLECTION_TYPE_LIST, $list_name);
		if($this->is_not_action_collection(__FUNCTION__, $new_action_list, "new_action_list") && !$new_action_list->is_list()){
			return;
		}

		return $new_action_list;
	}	
	private function insert_action_collection_v2($type, $name) {
		
		if($this->is_not_unsigned_number(__FUNCTION__, $type, "type")){
			return;
		}
		if($this->is_empty(__FUNCTION__, $name, "name")){
			return;
		}

		$hash_key = $this->get_hash_key("$type $name");

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO ACTION_COLLECTION(`hash_key`,`type`,`name`)"
				,"VALUES (\"$hash_key\",$type,\"$name\")"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 추가된 collection의 id를 가져옵니다.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT AC.`id` AS __action_collection_id"
				,", ACT.`id` AS __action_collection_type_id"
				,", ACT.`name` AS __action_collection_type_name"
				,"FROM ACTION_COLLECTION AS AC"
				,"LEFT JOIN ACTION_COLLECTION_TYPE AS ACT ON ACT.id=AC.`type`"
				,"WHERE AC.`hash_key`=\"$hash_key\""
				,"ORDER BY AC.id DESC"
				,"LIMIT 1"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}

		$__action_collection_id = -1;
		$__action_collection_type_id = -1;
		$__action_collection_type_name = "";
		$result = $query_manager->get_result();
		if(!is_null($result)) {
			$__action_collection_id = $result->__action_collection_id;
			$__action_collection_type_id = $result->__action_collection_type_id;
			$__action_collection_type_name = $result->__action_collection_type_name;
		}

		$new_action_collection = new ActionCollection();
		$new_action_collection->set_id($__action_collection_id);
		$new_action_collection->set_hash_key($hash_key);
		$new_action_collection->set_name($name);
		$new_action_collection->set_collection_type($__action_collection_type_id);
		$new_action_collection->set_collection_type_name($__action_collection_type_name);

		return $new_action_collection;
	}	
	private function insert_action_collection_n_meeting_agenda_v2($action_collection_obj, $meeting_agenda_id) {

		if($this->is_not_action_collection(__FUNCTION__, $action_collection_obj, "action_collection_obj")){
			return;
		}

		$action_collection_id = $action_collection_obj->get_id();
		if($this->is_not_unsigned_number(__FUNCTION__, $action_collection_id, "action_collection_id")){
			return;
		}
		if($this->is_not_unsigned_number(__FUNCTION__, $meeting_agenda_id, "meeting_agenda_id")){
			return;
		}

		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"INSERT INTO ACTION_COLLECTION_N_MEETING_AGENDA(`action_collection_id`,`meeting_agenda_id`,`regdttm`)"
				,"VALUES($action_collection_id,$meeting_agenda_id,DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))"
			)
		);
		$query_manager->modify();
		if($query_manager->is_failed()) {
			return;
		}

		// 미팅 관련 정보 가져오기.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT id AS __meeting_agenda_id"
				,", round AS __meeting_agenda_round"
				,", theme AS __meeting_agenda_theme"
				,"FROM MEETING_AGENDA"
				,"WHERE id=$meeting_agenda_id"
				,"LIMIT 1"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();
		$__meeting_agenda_theme = $result->__meeting_agenda_theme;
		$__meeting_agenda_round = $result->__meeting_agenda_round;

		$action_collection_obj->set_meeting_agenda_id($meeting_agenda_id);
		$action_collection_obj->set_meeting_agenda_theme($__meeting_agenda_theme);
		$action_collection_obj->set_meeting_agenda_round($__meeting_agenda_round);

		return $action_collection_obj;
	}
	public function get_action_collection_type_name($action_collection_type_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $action_collection_type_id, "action_collection_type_id")){
			return;
		}

		// 미팅 관련 정보 가져오기.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT id AS __action_collection_type"
				,", `name` AS __action_collection_name"
				,"FROM ACTION_COLLECTION_TYPE"
				,"WHERE id=$action_collection_type_id"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();
		$__action_collection_type = $result->__action_collection_type;
		$__action_collection_name = $result->__action_collection_name;

		return $__action_collection_name;
	}
	public function get_action_item_type_name($action_item_type_id=-1) {

		if($this->is_not_unsigned_number(__FUNCTION__, $action_item_type_id, "action_item_type_id")){
			return;
		}

		// 미팅 관련 정보 가져오기.
		$query_manager = new MYSQLQueryManager($this->mysql_manager, __FUNCTION__);
		$query_manager->addQueryLineArr(
			array(
				"SELECT id AS __action_item_type"
				,", `name` AS __action_item_name"
				,"FROM ACTION_ITEM_TYPE"
				,"WHERE id=$action_item_type_id"
			)
		);
		$query_manager->select_one();
		if($query_manager->is_failed()) {
			return;
		}
		$result = $query_manager->get_result();
		$__action_item_type = $result->__action_item_type;
		$__action_item_name = $result->__action_item_name;

		return $__action_item_name;
	}


	
	/*
		@ Public
		@ Desc : 
	*/
	public function add_action_child_item_into_parent_action_list($action_collection_obj) {

		if(ActionCollection::is_not_instance($action_collection_obj)) {
			echo "ActionCollection::is_not_instance(\$action_collection_obj)<br/>";
			return;
		}

		// Do mysql job

	}



	/*
		@ Public
		@ Desc : change Action Collection
	*/
	public function change_action_collection($action_collection_obj) {

		if(ActionCollection::is_not_instance($action_collection_obj)) {
			echo "ActionCollection::is_not_instance(\$action_collection_obj)<br/>";
			return;
		}

		// Do mysql job

	}



	/*
		@ Public
		@ Desc : 변경되는 부분에 대해 자신의 부모의 모든 영역을 새로 만들어 줍니다.
	*/
	public function copy_action_obj_v2($target_action_obj) {

		if($this->is_null_object(__FUNCTION__, $target_action_obj, "target_action_obj")){
			return;
		}

		// set has_changed concatenate
		$target_action_obj->set_changed(true);
		$root_action_obj = $target_action_obj->get_root_action_obj();

		return $this->add_action($root_action_obj);
	}


	/*
		@ public
		@ Desc : action obj 객체를 분석해서 DB에 업데이트합니다.
	*/
	public function add_action($action_obj) {

		if($this->is_not_action_obj(__FUNCTION__, $action_obj, "action_obj")){
			return;
		}

		// DEBUG
		// $cur_action_name = $action_obj->get_name();
		// echo "<br/>add_action / 0 / \$cur_action_name :: $cur_action_name<br/>";
		
		if($action_obj->has_no_parent() && $action_obj->is_list()) {

			// 최상단 객체인 경우의 처리.
			$root_action_obj = 
			$this->add_root_action_collection_list(
				// $meeting_agenda_id
				$action_obj->get_meeting_agenda_id()
				// $list_name
				, $action_obj->get_name()
			);
			$action_obj->inject($root_action_obj);

		} else if($this->is_action_collection(__FUNCTION__, $action_obj) && $action_obj->has_add_on_parent() && $action_obj->has_changed() == true) {

			// add on action collection 타입인 경우의 처리.
			// add on action collection을 등록합니다.
			$new_action_obj = $this->add_action_collection_no_relation($action_obj);
			$action_obj->inject($new_action_obj);

			// add on action parent와 add on action collection을 연결합니다.
			$cur_add_on_action_parent_obj = $action_obj->get_add_on_action_parent_obj();
			$cur_add_on_action_parent_obj_id = $cur_add_on_action_parent_obj->get_id();
			if(ActionObject::is_not_action_obj($cur_add_on_action_parent_obj)) {
				echo "!Error! / add_action / ActionObject::is_not_action_obj(\$cur_add_on_action_parent_obj)<br/>";
				return;
			}

			$this->insert_parent_action_item_n_add_on_collection(
				// $parent_action_item_id
				$cur_add_on_action_parent_obj_id
				// $add_on_action_collection_id
				, $action_obj->get_id()
				// $order=-1
				, $action_obj->get_order()
			);


		} else if($action_obj->has_parent() && $this->is_action_collection(__FUNCTION__, $action_obj)) {

			// 1. LIST
			// 2. TABLE

			// $root_action_list = $action_obj->get_root_action_obj();
			$parent_action_obj = $action_obj->get_parent();

			// DEBUG
			// $has_changed = $action_obj->has_changed();
			// echo "add_action / 0 / \$cur_action_name :: $cur_action_name / \$has_changed :: $has_changed<br/>";

			// 객체가 새로 만들어지거나 변경된 경우에만 DB에 추가합니다.
			// action collection 객체를 DB에 추가합니다.
			if($action_obj->has_changed() == true) {
				$new_action_obj = $this->add_action_collection_no_relation($action_obj);
				$action_obj->inject($new_action_obj);
			}

			// 부모 객체와 자신과의 관계 정보를 DB에 추가합니다.
			if($this->is_action_item(__FUNCTION__, $parent_action_obj)) {

				$this->insert_parent_action_item_n_child_collection_v2(
					// $parent_action_item_obj
					$parent_action_obj
					// $child_action_collection_obj
					, $action_obj
				);

			} else if($this->is_action_table(__FUNCTION__, $parent_action_obj) && $this->is_action_list(__FUNCTION__, $action_obj)) {

				// DEBUG
				// $parent_action_name = $parent_action_obj->get_name();
				// echo "add_action / 2-3 \$parent_action_name :: $parent_action_name<br/>";
				// $parent_action_id = $parent_action_obj->get_id();
				// echo "add_action / 2-3 \$parent_action_id :: $parent_action_id<br/>";

				$this->insert_parent_action_table_n_child_action_list_v2(
					// $parent_action_table
					$parent_action_obj
					// $child_action_list
					, $action_obj
				);


			} // end inner if
			
		} else if($action_obj->has_parent() && $this->is_action_item(__FUNCTION__, $action_obj)) {

			// echo "add_action / \$cur_action_name :: $cur_action_name / action is ITEM<br/>";

			// $root_action_list = $action_obj->get_root_action_obj();
			$parent_action_obj = $action_obj->get_parent();

			if($this->is_action_list(__FUNCTION__, $parent_action_obj)) {

				// 객체가 새로 만들어지거나 변경된 경우에만 DB에 추가합니다.
				$has_changed = $action_obj->has_changed();
				// echo "add_action / \$cur_action_name :: $cur_action_name / action is ITEM / parent is LIST / \$has_changed :: $has_changed<br/>";
				if($action_obj->has_changed() == true) {

					// DEBUG
					// $new_action_context = $action_obj->get_context();
					// echo "add_action / \$cur_action_name :: $cur_action_name / \$new_action_context :: $new_action_context<br/>";

					$new_action_obj = $this->add_action_item_v2($action_obj);
					$action_obj->inject($new_action_obj);

				}

				// DEBUG
				$action_obj_id = $action_obj->get_id();
				$action_obj_name = $action_obj->get_name();
				// echo "add_action / \$cur_action_name :: $cur_action_name / \$action_obj_id :: $action_obj_id / \$action_obj_name :: $action_obj_name<br/>";

				$this->insert_parent_list_n_child_item_v2(
					// $parent_action_list
					$parent_action_obj
					// $child_action_item
					, $action_obj
				);

			} // end inner if

		} // end outer if	

		// treat children
		$children_action_obj_list = $action_obj->get_children();
		for($idx = 0;$idx < count($children_action_obj_list); $idx++) {
			$child_action_obj = $children_action_obj_list[$idx];
			$this->add_action($child_action_obj);
		}

		// treat add on
		if(ActionItem::is_instance($action_obj)) {

			$add_on_action_obj_list = $action_obj->get_add_on_list();
			$action_obj_id = $action_obj->get_id();
			for($idx = 0;$idx < count($add_on_action_obj_list); $idx++) {
				$add_on_action_obj = $add_on_action_obj_list[$idx];

				// add on parent action obj를 지정해줍니다.
				$add_on_action_obj->set_add_on_action_parent_obj($action_obj);

				// order
				$add_on_action_obj->set_order($idx * 100);

				// DEBUG
				// $add_on_action_name = $add_on_action_obj->get_name();
				// echo "\$add_on_action_name :: $add_on_action_name<br/>";

				// 추가 액션을 등록.
				$add_on_action_obj = $this->add_action($add_on_action_obj);

			} // for end

		} // if end

		return $action_obj;
	}


























	//  dMMMMMMP dMMMMMP .dMMMb dMMMMMMP 
	//    dMP   dMP     dMP" VP   dMP    
	//   dMP   dMMMP    VMMMb    dMP     
	//  dMP   dMP     dP .dMP   dMP      
	// dMP   dMMMMMP  VMMMP"   dMP       
	/*
		@ public
		@ Desc : BDTM Toastmaster timeline 템플릿을 만들어 봅니다. Action Obj로 구조를 만든 다음, 이 구조를 DB로 이전하는 과정을 검사합니다.
		DB 업데이트 횟수를 최소한으로 줄입니다.
	*/
	public function get_template_meeting_timeline_BDTM($hh_mm_begins) {

		if($this->is_not_valid_time_format_hh24_mm($hh_mm_begins)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$hh_mm_begins)<br/>";
			return;
		}

		$params = new ToastMasterParamManager();

		// 0. Action obj로 리스트를 구성합니다.
		$root_action_obj_name = "Toastmaster Timeline";
		$meeting_agenda_id = 134; // 243th Attitude of gratitude
		$root_action_obj = 
		new ActionCollection(
			// $action_name=""
			$root_action_obj_name
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
			// $meeting_agenda_id=-1
			, $meeting_agenda_id
		);

		// 1.Greeting

		$time_init_sec = $this->convert_hh24_mm_to_seconds($hh_mm_begins);
		$time_init_hh24_mm = $this->convert_seconds_to_hh24_mm($time_init_sec);
		$time_offset_sec = 0;
		$time_next_sec = $time_init_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec);

		if($this->is_not_valid_time_format_hh24_mm($time_init_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_init_hh24_mm)<br/>";
			return;
		}

		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Greetings"
			// $time_str_hhmm_init=""
			, $time_init_hh24_mm
			// $time_str_hhmm_specific=""
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 1-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Greetings - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 1-1-1. Welcome guests / Guest introduction
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"New Item"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
			// $is_shy=0
			, 1
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);		






		// 2.Call meeting to order [Chairperson]

		$time_offset_sec = 60 * 10; // 10 mins / "19:50"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec);

		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Call meeting to order [Chairperson]"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "19:50"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 2-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Call meeting to order [Chairperson] - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 2-1-1. Welcome guests / Guest introduction
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Welcome guests / Guest introduction"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 2-1-2. Cite the mission of Toastmasters
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Cite the mission of Toastmasters"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 2-1-3. Cite the mission of Toastmasters
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Fill Vacant functions & Share CL process"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 2-1-4. Cite the mission of Toastmasters
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Introduce Toastmaster"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);






		// 20:00
		// 3.Theme & Role Introduction [Toastmaster]

		$time_offset_sec = 60 * 10; // 10 mins / "19:40" / "19:50" --> "20:00"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm

		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Theme & Role Introduction [Toastmaster]"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "20:00"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 3-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Theme & Role Introduction [Toastmaster] - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 3-1-1. Opening remarks ( Introduce the theme )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Opening remarks ( Introduce the theme )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 3-1-2. Introduce roles : General Evaluator ( < 1 min ), Timer, Ah Counter, Grammarian ( < 1 min each ), Word & Quote master ( < 2 min )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Introduce roles : General Evaluator ( < 1 min ), Timer, Ah Counter, Grammarian ( < 1 min each ), Word & Quote master ( < 2 min )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);


		// add_on inner table
		// 3-1-2-1. Today's Role
		$child_action_sub_list_child_action_item_sub_table = 
		new ActionCollection(
			// $action_name=""
			"Today's Role"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_TABLE
		);
		$child_action_sub_list_child_action_item->push_add_on($child_action_sub_list_child_action_item_sub_table);


		// 3-1-2-1-1. Column List - Right Role Name List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Left Role Name"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 3-1-2-1-1-1. Column List Field - Toastmaster
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Toastmaster"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);
		// 3-1-2-1-1-2. Column List Field - Grammarian
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Grammarian"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);
		// 3-1-2-1-1-3. Column List Field - Timer
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Timer"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);
		// 3-1-2-1-1-4. Column List Field - Table Topic Master
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Table Topic Master"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 3-1-2-1-2. Column List - Right Role Name List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Left Member Name"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 3-1-2-1-2-1. Column List Field - Toastmaster
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - Toastmaster
		$context = new stdClass();

		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_TOASTMASTER;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-1-2-2. Column List Field - Grammarian
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - Grammarian
		$context = new stdClass();
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_GRAMMARIAN;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-1-2-3. Column List Field - Timer
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - Timer
		$context = new stdClass();
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_TIMER;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-1-2-4. Column List Field - Table Topic Master
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - Table Topic Master
		$context = new stdClass();
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_TABLE_TOPIC_MASTER;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 3-1-2-1-3. Column List - Right Role Name List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Right Role Name"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 3-1-2-1-3-1. Column List Field - General Evaluator
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"General Evaluator"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);
		// 3-1-2-1-3-2. Column List Field - Ah & Vote Counter
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Ah & Vote Counter"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);
		// 3-1-2-1-3-3. Column List Field - Word & Quote Master
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Word & Quote Master"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);
		// 3-1-2-1-3-4. Column List Field - Mini Debate Master
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Mini Debate Master"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);		


		// 3-1-2-1-4. Column List - Right Role Name List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Right Member Name"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 3-1-2-1-4-1. Column List Field - General Evaluator
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - General Evaluator
		$context = new stdClass();
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_GENERAL_EVALUATOR;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-1-4-2. Column List Field - Ah & Vote Counter
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - Ah & Vote Counter
		$context = new stdClass();
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_AH_COUNTER;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 3-1-2-1-4-3. Column List Field - Word & Quote Master
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - Word & Quote Master
		$context = new stdClass();
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_WORD_N_QUOTE_MASTER;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 3-1-2-1-4-4. Column List Field - Mini Debate Master
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX
		);

		// DB interface prop - Mini Debate Master
		$context = new stdClass();
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_TODAY_ROLE;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->ROLE_ID} = $params->ROLE_ID_MINI_DEBATE_MASTER;
		$context->{$params->MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);




		// add_on inner table
		// 3-1-2-2. Today's Role
		$child_action_sub_list_child_action_item_sub_table = 
		new ActionCollection(
			// $action_name=""
			"Word & Quote"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_TABLE
		);
		$child_action_sub_list_child_action_item->push_add_on($child_action_sub_list_child_action_item_sub_table);

		// 3-1-2-2-1. Column List - Title Column List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Title Column List"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 3-1-2-2-1-1. Column List Field - Word
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Word"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-2-1-2. Column List Field - Word Desc
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Word Desc"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-2-1-3. Column List Field - Quote
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Quote"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 3-1-2-2-2. Column List - Speech Title Column List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Text Column List"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 3-1-2-2-2-1. Column List Field - Word Text
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-2-2-2. Column List Field - Word Desc Text
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 3-1-2-2-2-3. Column List Field - Quote Desc Text
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);		

		// 20:00







		// 20:15
		// 4.Table Topics Session [ Table Topic Master ]

		$time_offset_sec = 60 * 15; // 15 mins / "19:40" / "20:00" --> "20:15"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Table Topics Session [ Table Topic Master ]"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "20:15"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 4-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Table Topics Session [ Table Topic Master ] - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 4-1-1. Explain the rules and theme
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Explain the rules and theme"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 4-1-2. 1 to 2 minutes impromptu speaking
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"1 to 2 minutes impromptu speaking"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 4-1-3. Timer‘s Report
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Timer‘s Report"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 4-1-4. Vote for the Best Table Topic Speaker
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Vote for the Best Table Topic Speaker"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);
		// 20:15









		// 20:25
		// 5. Prepared Speech Session [ Toastmaster ]

		$time_offset_sec = 60 * 10; // 10 mins / "19:40" / "20:15" --> "20:25"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Prepared Speech Session [ Toastmaster ]"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "20:25"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 5-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Prepared Speech Session [ Toastmaster ] - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 5-1-1. Introduce speakers ( Speaker, Project Number, Topic, Evaluator, Speech Objectives, Time )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Introduce speakers ( Speaker, Project Number, Topic, Evaluator, Speech Objectives, Time )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);


		// add_on inner table
		// 5-1-1-1. Today's Role
		$child_action_sub_list_child_action_item_sub_table = 
		new ActionCollection(
			// $action_name=""
			"Today's Speech"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_TABLE
		);
		$child_action_sub_list_child_action_item->push_add_on($child_action_sub_list_child_action_item_sub_table);

		// 5-1-1-1-1. Column List - Project Column List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Project Column List"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 5-1-1-1-1-1. Column List Field - Speech Project
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Project"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 5-1-1-1-1-2. Column List Field - Speech Project Editable
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX_ADDABLE
		);

		// DB interface prop
		$context = new stdClass();
		$context->{$params->ACTION_DB_INSERT_MSG} = $params->IS_INSERT_SPEECH;
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_SPEECH;
		$context->{$params->ACTION_DB_DELETE_MSG} = $params->IS_DELETE_SPEECH;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->SPEECH_ID} = -1;
		$context->{$params->SPEECH_PROJECT_ID} = -1;
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 5-1-1-1-2. Column List - Speech Title Column List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Speech Title Column List"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 5-1-1-1-2-1. Column List Field - Speech Title
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Title"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 5-1-1-1-2-2. Column List Field - Speech Title Editable
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);

		// DB interface prop
		$context = new stdClass();
		$context->{$params->ACTION_DB_INSERT_MSG} = $params->IS_INSERT_SPEECH;
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_SPEECH;
		$context->{$params->ACTION_DB_DELETE_MSG} = $params->IS_DELETE_SPEECH;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->SPEECH_ID} = -1;
		$context->{$params->SPEECH_TITLE} = -1;
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 5-1-1-1-3. Column List - Speaker Column List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Speaker Column List"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 5-1-1-1-3-1. Column List Field - Speaker
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Speaker"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 5-1-1-1-3-2. Column List Field - Speaker Editable
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX_ADDABLE
		);

		// DB interface prop
		$context = new stdClass();
		$context->{$params->ACTION_DB_INSERT_MSG} = $params->IS_INSERT_SPEECH;
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_SPEECH;
		$context->{$params->ACTION_DB_DELETE_MSG} = $params->IS_DELETE_SPEECH;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->SPEECH_ID} = -1;
		$context->{$params->SPEECH_SPEAKER_MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);


		// 5-1-1-1-4. Column List - Evaluator Column List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"Evaluator Column List"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 5-1-1-1-4-1. Column List Field - Evaluator
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"Evaluator"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_FIXED
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);

		// 5-1-1-1-4-2. Column List Field - Evaluator Editable
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$SELECT_BOX_ADDABLE
		);

		// DB interface prop
		$context = new stdClass();
		$context->{$params->ACTION_DB_INSERT_MSG} = $params->IS_INSERT_SPEECH;
		$context->{$params->ACTION_DB_UPDATE_MSG} = $params->IS_UPDATE_SPEECH;
		$context->{$params->ACTION_DB_DELETE_MSG} = $params->IS_DELETE_SPEECH;
		$context->{$params->MEETING_ID} = $meeting_agenda_id;
		$context->{$params->SPEECH_ID} = -1;
		$context->{$params->SPEECH_EVALUATOR_MEMBER_HASH_KEY} = "";
		$child_action_sub_list_child_action_item_sub_table_column_list_field->set_context(json_encode($context));

		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);		








		// 5-1-2. Timer‘s Report
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Timer‘s Report"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 5-1-3. Vote for the Best Prepared Speech Speaker
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Vote for the Best Prepared Speech Speaker"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 5-1-4. Empty space
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			" "
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);
		// 20:25










		// 21:00
		// 6. Break

		$time_offset_sec = 60 * 35; // 35 mins / "19:40" / "20:25" --> "21:00"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Break"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "21:00"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 6-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Break - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 6-1-1. Complete Feedback to prepared speakers
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Complete Feedback to prepared speakers"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 6-1-2. Empty Space
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			" "
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);
		// 21:00










		// 21:10
		// 7. Break

		$time_offset_sec = 60 * 10; // 10 mins / "19:40" / "21:00" --> "21:10"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Mini debate session"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "21:10"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);
		// 7-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Mini debate session - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 7-1-1. Welcome guests / Guest introduction
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"New Item"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
			// $is_shy=0
			, 1
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);			
		// 21:10		










		// 21:20
		// 8. Evaluation Session [ General Evaluator ]

		$time_offset_sec = 60 * 10; // 10 mins / "19:40" / "21:10" --> "21:20"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Evaluation Session [ General Evaluator ]"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "21:20"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 8-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Evaluation Session [ General Evaluator ] - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 8-1-1. Introduces Evaluators
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Introduces Evaluators"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 8-1-2. Timer‘s Report & Vote
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Timer‘s Report & Vote"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 8-1-3. Ah Counter‘s Ah tally report
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Ah Counter‘s Ah tally report"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 8-1-4. Grammarian‘s Report
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Grammarian‘s Report"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 8-1-5. General comments on meeting ( < 3 min )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"General comments on meeting ( < 3 min )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);
		// 21:20







		// 21:35
		// 9. Evaluation Session [ General Evaluator ]

		$time_offset_sec = 60 * 15; // 15 mins / "19:40" / "21:20" --> "21:35"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Award Session [ Toastmaster ]"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "21:35"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 9-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Award Session [ Toastmaster ] - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 9-1-1. Present award ( < 1 min )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Present award ( < 1 min )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 9-1-2. Closing remarks ( < 2 min )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Closing remarks ( < 2 min )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);		
		// 21:35







		// 21:40
		// 10. Club Business [ Chairperson ]

		$time_offset_sec = 60 * 5; // 5 mins / "19:40" / "21:35" --> "21:40"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Club Business [ Chairperson ]"
			// $time_str_hhmm_init="" / "19:40"
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "21:40"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 10-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Club Business [ Chairperson ] - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 10-1-1. Club News ( What's new? )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Club News ( What's new? )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);


		// add_on inner table
		// 10-1-1-1. Club News / 뉴스의 내용은 action obj 형식으로 관리해도 문제 없음.
		$child_action_sub_list_child_action_item_sub_table = 
		new ActionCollection(
			// $action_name=""
			"Club News"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_TABLE
		);
		$child_action_sub_list_child_action_item->push_add_on($child_action_sub_list_child_action_item_sub_table);

		// 10-1-1-1-1. Column List - Project Column List
		$child_action_sub_list_child_action_item_sub_table_column_list = 
		new ActionCollection(
			// $action_name=""
			"News List"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_sub_list_child_action_item_sub_table->add_child($child_action_sub_list_child_action_item_sub_table_column_list);

		// 10-1-1-1-1-1. Column List Field - Speech Project
		$child_action_sub_list_child_action_item_sub_table_column_list_field =  
		new ActionItem(
			// $action_name="New Item"
			"NOT ASSIGNED"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list_child_action_item_sub_table_column_list->add_child($child_action_sub_list_child_action_item_sub_table_column_list_field);



		// 10-1-2. Announcement & Role Sign-up for future meeting
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Announcement & Role Sign-up for future meeting"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 10-1-3. Guest Comments
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Guest Comments"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 10-1-4. Acknowledgement
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Acknowledgement"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);
		// 21:40	







		// 21:50
		// 11. Call Meeting to adjourn & Group photos

		$time_offset_sec = 60 * 5; // 5 mins / "19:40" / "21:40" --> "21:45"
		$time_next_sec = $time_next_sec + $time_offset_sec;
		$time_next_hh24_mm = $this->convert_seconds_to_hh24_mm($time_next_sec); // $time_init_hh24_mm
		if($this->is_not_valid_time_format_hh24_mm($time_next_hh24_mm)) {
			echo "\$this->is_not_valid_time_format_hh24_mm(\$time_next_hh24_mm)<br/>";
			return;
		}

		$child_action_item =  
		new ActionItemTitleNTimeHHMM(
			// $action_name=""
			"Call Meeting to adjourn & Group photos"
			// $time_str_hhmm_init=""
			, $time_init_hh24_mm
			// $time_str_hhmm_specific="" / "21:40"
			, $time_next_hh24_mm
		);
		$root_action_obj->add_child($child_action_item);

		// 11-1. Sublist
		$child_action_sub_list = 
		new ActionCollection(
			// $action_name=""
			"Call Meeting to adjourn & Group photos - Sublist"
			// $action_collection_type=1
			, ActionCollection::$ACTION_COLLECTION_TYPE_LIST
		);
		$child_action_item->add_child($child_action_sub_list);

		// 11-1-1. Club News ( What's new? )
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Closing remarks ( < 2min )"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);

		// 11-1-2. Announcement & Role Sign-up for future meeting
		$child_action_sub_list_child_action_item =  
		new ActionItem(
			// $action_name="New Item"
			"Group Photo"
			// $action_item_type=1
			, ActionItem::$TITLE_ONLY_ADDABLE
		);
		$child_action_sub_list->add_child($child_action_sub_list_child_action_item);
		// 21:40

		$root_action_obj = $this->add_action($root_action_obj);
		$root_action_obj->set_coordinate();

		return $root_action_obj;
	}






}

?>
