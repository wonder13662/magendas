<?php

class MYSQLQueryManager{

	private $mysql_manager=null;
	private $scope_name=null;
	private $query_str_arr=null;
	private $query_log_manager=null;
	private $result_json_res_obj=null;

	public function MYSQLQueryManager($mysql_manager=null, $scope_name="", $query_log_manager=null){
		if(!is_null($query_log_manager)) {
			$this->query_log_manager = $query_log_manager;
		}
		if(!empty($scope_name)) {
			$this->scope_name = $scope_name;
		}
		if(!is_null($mysql_manager)) {
			$this->mysql_manager = $mysql_manager;
		}
	}

	public function addQueryLine($query_line){

		if(is_null($this->query_str_arr)) {
			$this->query_str_arr = array();
		}

		if(!empty($query_line)) {
			array_push($this->query_str_arr,$query_line);
		}
	}
	public function addQueryLineArr($query_line_arr){

		if(is_null($this->query_str_arr)) {
			$this->query_str_arr = array();
		}

		if(!empty($query_line_arr)) {
			$this->query_str_arr = array_merge($this->query_str_arr,$query_line_arr);
		}
	}
	// public --> private
	public function getExecuteQuery(){

		$execute_query = "";
		if(!empty($this->query_str_arr)) {
			$execute_query = implode(" ",$this->query_str_arr);
		}

		// 쿼리를 실행시키는 시점에 해당 쿼리를 쿼리 로거에 저장합니다.
		// 사용자가 사용했던 쿼리를 조회하기 위한 용도.
		if(!is_null($this->query_log_manager)) {
			$this->query_log_manager->push_msg($this->getFormattedQueryForJavascript());
		}

		return $execute_query;
	}
	public function printFormattedQuery(){
		$query = $this->getFormattedQuery();
		echo "$query;<br/>";
	}
	public function getFormattedQuery(){

		$formatted_query = "";
		if(!empty($this->query_str_arr)) {
			$formatted_query = implode("<br/>",$this->query_str_arr);
		}

		return $formatted_query;
	}
	public function getFormattedQueryForJavascript(){

		$formatted_query = "";
		if(!empty($this->query_str_arr)) {
			$formatted_query = implode(" ",$this->query_str_arr);
		}

		return $formatted_query;
	}	


	// Execution Area
	public function select(){

		$query = $this->getExecuteQuery();
		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_SELECT, $json_res_obj);

		$this->result_json_res_obj=$json_res_obj;
	}

	public function select_list(){

		$query = $this->getExecuteQuery();
		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_SELECT, $json_res_obj);

		if(strcmp($json_res_obj->message,"query is empty") == 0) {
			$json_res_obj->result = array();
		}

		$this->result_json_res_obj=$json_res_obj;
	}

	public function select_one(){

		$query = $this->getExecuteQuery();
		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_SELECT, $json_res_obj);

		$result_list = $json_res_obj->result;
		if(!empty($result_list)) {
			$result_one = $result_list[0];
			$json_res_obj->result = $result_one;
		} else if(!is_null($result_list) && count($result_list) == 0) {
			// 조회 결과가 없을 경우의 처리.
			$json_res_obj->result = null;
		}

		$this->result_json_res_obj=$json_res_obj;
	}

	public function modify(){

		$query = $this->getExecuteQuery();
		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->query = $query;
		$json_res_obj = $this->mysql_manager->run($query, MYSQLManager::$RUN_TYPE_MODIFY, $json_res_obj);

		$this->result_json_res_obj=$json_res_obj;
	}
	public function is_failed() {

		$is_success = !$this->is_success();
		if($is_success) {
			$this->show_err();
		}

		return $is_success;
	}
	public function is_success() {

		if(	!is_null($this->result_json_res_obj->success) && 
			$this->result_json_res_obj->success == true) {

			return true;
		}
		return false;
	}
	private function show_err() {
		$this->show_scope_name();
		$this->show_message();
		$this->show_query();
	}
	private function show_scope_name() {
		$scope_name = $this->scope_name;
		echo "<br/>[SCOPE]$scope_name";
	}
	private function show_query() {
		echo "<br/>[QUERY]";
		$this->printFormattedQuery();
	}
	private function show_message() {
		$message = $this->get_message();
		echo "<br/>[MESSAGE]$message";
	}
	private function get_message() {
		if(	!is_null($this->result_json_res_obj->message) && 
			!is_null($this->result_json_res_obj->message)) {

			return $this->result_json_res_obj->message;
		}
		return "";
	}

	public function get_result() {
		// echo "<br/>get_result<br/>";
		// print_r($this->result_json_res_obj);
		// echo "<br/>get_result<br/>";

		return $this->result_json_res_obj->result;
	}

	public function show_result() {
		$result = $this->get_result;
		$this->show_object_tree($result);
	}

	/*
		@ Private
		@ Desc : 오브젝트의 구조를 html 문서 위에 맞게 정렬해서 보여줍니다.(디버깅 용도)
	*/
	private function get_html_tabs($repeat_cnt=0) {
		$html_tabs = "&nbsp;&nbsp;";
		$tabs_returning = "";
		for($idx=0; $idx < $repeat_cnt; $idx++) {
			$tabs_returning .= $html_tabs;
		}

		return $tabs_returning;
	}
	public function show_object_tree($param_obj, $param_obj_name="", $depth=0) {

		if(is_null($param_obj)) {
			return;
		}

		echo "\$depth :: $depth<br/>";

		if($depth > 10) {
			echo "!Error! / \$depth is too deep :: $depth<br/>";
			return;
		}

		$tabs = $this->get_html_tabs($depth);
		$inner_tabs = $this->get_html_tabs($depth + 1);
		if(is_array($param_obj)) {

			// 배열 내부를 순회하며 내부 엘리먼트를 조회합니다.
			// 엘리먼트가 객체일 경우, 재귀 호출로 내용을 보여줍니다.
			if($depth == 0 && !empty($param_obj_name)) {
				echo "$tabs [ARRAY] $param_obj_name<br/>";
			} else {
				echo "$tabs [ARRAY]<br/>";
			}
			
			for($idx=0; $idx < count($param_obj); $idx++) {
				$element = $param_obj[$idx];

				if(is_null($element)) {
					continue;
				} else if(is_array($element) || is_object($element)) {
					$this->show_object_tree($element, null, $depth + 1);
				} else {
					echo "$inner_tabs $param_obj<br/>";
				}
			}

		} else if(is_object($param_obj)) {

			// 일반 객체인 경우
			if($depth == 0 && !empty($param_obj_name)) {
				echo "$tabs [OBJECT] $param_obj_name<br/>";
			} else {
				echo "$tabs [OBJECT]<br/>";
			}
			
			foreach($param_obj as $key => $value) {

				$tabs = $this->get_html_tabs($depth);
				if(is_null($value)) {
					continue;
				} else if(is_array($value) || is_object($value)) {
					$this->show_object_tree($value, null, $depth + 1);
				} else {
					echo "$inner_tabs [KEY]$key<br/>";
					echo "$inner_tabs [VALUE]$value<br/>";
				}
			    
			}		

		} else {

			// primitive 객체인 경우
			echo "$tabs [VALUE] $param_obj<br/>";

		}

		if($depth == 0) {
			echo "<br/>";
		}

	}	

}

?>
