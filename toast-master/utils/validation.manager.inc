<?php

class ValidationManager{

	// public static $STATUS_CODE_OK=200;

	// @ Usage : ValidationManager::is_unsigned_number
	private static function is_unsigned_number($target){
		if(	is_null($target) || !is_numeric($target) || ($target < 0)){
			return false;
		}
		return true;
	}

	// @ Usage : ValidationManager::is_not_unsigned_number
	public static function is_not_unsigned_number($function_name="", $target, $param_name=""){

		$is_not_unsigned_number = !ValidationManager::is_unsigned_number($target);

		if($is_not_unsigned_number == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / \$this->is_not_unsigned_number(\$$param_name)<br/>";
		}

		return $is_not_unsigned_number;
	}

	// @ Usage : ValidationManager::is_not_valid_array
	public static function is_not_valid_array($target){
		return ValidationManager::is_valid_array($target);
	}

	// @ Usage : ValidationManager::is_valid_array
	public static function is_valid_array($target){
		if( is_null($target) || count($target) < 1 ) return false;
		return true;
	}

	// @ Usage : ValidationManager::is_empty
	public static function is_empty($function_name="", $target, $param_name="") {

		$is_empty = empty($target);
		if($is_empty == true && !empty($function_name) && !empty($param_name)) {
			echo "$function_name / empty(\$$param_name)<br/>";
		}

		return $is_empty;
	}

	

}

?>
