<?php

class TimeManager{

	// public static $STATUS_CODE_OK=200;

	// @ Desc : "09:20" 형식의 시간:분 문자열인지 확인합니다. 12시간 단위
	public static function is_valid_time_format_hh12_mm($target){
		if(empty($target)) {
			return false;
		}
		return preg_match("/(1[012]|0[0-9]):([0-5][0-9])/", $target);
	}
	public static function is_not_valid_time_format_hh12_mm($target){
		return !TimeManager::is_valid_time_format_hh12_mm($target);
	}

	// @ Desc : "19:20" 형식의 시간:분 문자열인지 확인합니다. 24시간 단위
	// @ Usage : TimeManager::is_valid_time_format_hh24_mm($target);
	public static function is_valid_time_format_hh24_mm($target){
		if(empty($target)) {
			return false;
		}

		$is_over_20h = preg_match("/(2[0-3]|[01][0-9]):([0-5][0-9])/", $target);
		$is_under_20h = preg_match("/(1[012]|0[0-9]):([0-5][0-9])/", $target);

		return ($is_over_20h || $is_under_20h);
	}
	// @ Usage : TimeManager::is_not_valid_time_format_hh24_mm($target);
	public static function is_not_valid_time_format_hh24_mm($target){
		return !TimeManager::is_valid_time_format_hh24_mm($target);
	}
	// @ Private
	// @ Desc : "19:20" 형식의 시간:분을 초단위로 바꾸어 줍니다.
	public static function convert_hh24_mm_to_seconds($str_time){

		if(TimeManager::is_not_valid_time_format_hh24_mm($str_time)) {
			return -1;
		}

		sscanf($str_time, "%d:%d", $hours, $minutes);
		$time_seconds = $hours * 3600 + $minutes * 60 + $seconds;

		return $time_seconds;
	}
	public static function convert_seconds_to_hh24_mm($seconds) {

		if(ValidationManager::is_not_unsigned_number(__FUNCTION__, $seconds)) {
			return -1;
		}

		return gmdate("H:i", $seconds);
	}
	public static function convert_seconds_to_YYYYMMHHMMSS($seconds) {

		if(ValidationManager::is_not_unsigned_number(__FUNCTION__, $seconds)) {
			return -1;
		}

		return gmdate("YmdHis", $seconds);
	}	

}

?>
