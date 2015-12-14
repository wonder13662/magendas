<?php

class MYSQLQueryManager{

	private $query_str_arr=null;

	public function MYSQLQueryManager(){}

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
	public function getExecuteQuery(){

		$execute_query = "";
		if(!empty($this->query_str_arr)) {
			$execute_query = implode(" ",$this->query_str_arr);
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
}

?>
