<?php

class APIParamManager{

	public static $PARAM_TYPE_STRING = 0;
	public static $PARAM_TYPE_NUMBER = 1;


	public static function getParams($param_array){

		if (!class_exists('JSONManager')) {
		    echo "!Error! No JSONManager Class Included<br/>";
		    return;
		}

		$json_res_obj = JSONManager::get_json_response_obj();

		if(empty($param_array)){
			return $json_res_obj;
		}
		
		$result_param_array = array();

		foreach($param_array as $param_name => $param_detail){

			if(empty($param_name)){
				$json_res_obj->code = JSONManager::$STATUS_CODE_BAD_REQUEST;
				$json_res_obj->message = "param_name is empty.";
				$json_res_obj->success = FALSE;
				return $json_res_obj;
			}

			if(empty($param_detail)){
				$json_res_obj->code = JSONManager::$STATUS_CODE_BAD_REQUEST;
				$json_res_obj->message = "param_detail is empty.";
				$json_res_obj->success = FALSE;
				return $json_res_obj;
			}
			
			$param_value=null;

			
			if($param_detail->_type == self::$PARAM_TYPE_STRING){
			
				$param_value = 
				self::getParamStringSafe(
					$param_name
					,$param_detail->_default
				);

			} else if($param_detail->_type == self::$PARAM_TYPE_NUMBER){

				$param_value = 
				self::getParamNumberSafe(
					$param_name
					,$param_detail->_min
					,$param_detail->_max
					,$param_detail->_default
				);

			}


			if(is_null($param_value)){
				$json_res_obj->code = JSONManager::$STATUS_CODE_BAD_REQUEST;
				$json_res_obj->message = "param '" . $param_name . "' is not valid.";
				$json_res_obj->success = FALSE;
				return $json_res_obj;
			}

			$result_param_array[$param_name] = $param_value;
		}

		$json_res_obj->code = JSONManager::$STATUS_CODE_OK;
		$json_res_obj->message = "you've got parameters successfully.";
		$json_res_obj->success = TRUE;
		$json_res_obj->result = $result_param_array;

		return $json_res_obj;

	}


	public static function getParamNumberDetail($min=null, $max=null, $default=null){
		$param_number_detail = new stdClass();
		$param_number_detail->_type=self::$PARAM_TYPE_NUMBER;
		$param_number_detail->_min=$min;
		$param_number_detail->_max=$max;
		$param_number_detail->_default=$default;

		return $param_number_detail;
	}
	
	private static function getParamNumberSafe($param_name, $min=null, $max=null, $default=null){

		$param_value = self::getParam($param_name);

		// check whether $param_value is null.
		if($param_value == null){
			if($default != null && is_numeric($default)){
				return $default;
			} else {
				return null;
			}
		}

		// $param_value is not null. check whether it is number.
		if(is_numeric($param_value)){
			return intval($param_value);
		} else if($default != null && is_numeric($default)){
			return $default;
		} else {
			return null;
		}
		
		// $param_value is number. check min and max
		if (is_numeric($param_value) && is_numeric($min) && $param_value < $min){
			return $min;
		} else if (is_numeric($param_value) && is_numeric($max) && $max < $param_value) {
			return $max;
		} else if (is_numeric($param_value)){
			return $param_value;
		}

		return null;
	}

	public static function getParamStringDetail($default=null){
		$param_string_detail = new stdClass();
		$param_string_detail->_type=self::$PARAM_TYPE_STRING;
		$param_string_detail->_min=null;
		$param_string_detail->_max=null;
		$param_string_detail->_default=$default;

		return $param_string_detail;
	}

	private static function getParamStringSafe($param_name, $default=null){
		$param_value = self::getParam($param_name);

		if(empty($param_value) && is_string($default)){
			return $default;
		}

		return $param_value;
	}

	private static function getParam($param_name){
		if($param_name == null || $param_name == "") return null;
		
		if(!isset($_GET[$param_name]) && !isset($_POST[$param_name])){
			return null;
		}

		if(isset($_GET[$param_name])){
			return $_GET[$param_name];
		}
		return $_POST[$param_name];
	}

}

?>
