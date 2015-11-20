<?php

class ToastMasterLinkManager{

	private static $ROOT_PATH="";
	public static function set_root_path($root_path=""){
		self::$ROOT_PATH = $root_path;
	}	
	public static function get_root_path(){
		return self::$ROOT_PATH;
	}


	public static $LOG_IN="/view/log_in.php";
	public static $LOG_OUT="/view/log_out.php";
	public static $MEMBERSHIP_PICKER="/view/membership_picker.php";
	public static $PC_MEETING_AGENDA="/view/meeting_agenda.php";

	public static $MOBILE_TOP="/view/mobile/top.php";
	public static $MOBILE_MEETING_AGENDA_LIST="/view/mobile/meeting_agenda_list.php";
	public static $MOBILE_MEETING_AGENDA_DETAIL="/view/mobile/meeting_agenda_detail.php";
	public static $MOBILE_MEETING_AGENDA_DETAIL_ADD_NEW_ONE="/view/mobile/meeting_agenda_detail_add_new_one.php";
	public static $MOBILE_MEMBER_MANAGE="/view/mobile/member_manage.php";

	public static function go($type="", $param_arr=null) {
		$link = self::get($type, $param_arr);
		header("Location:$link");
	}
	public static function get($type="", $param_arr=null) {
		$link = self::get_root_path() . $type;
		if(is_null($param_arr)){
			return $link;
		}
		return self::get_link_with_param($link, $param_arr);
	}
	private static function get_link_with_param($link="", $param_arr=null) {
		$idx = 0;
		if(is_null($param_arr)) {
			return $link;
		}

		foreach ($param_arr as $key => $value) {
			if($idx == 0) {
				$link .= "?";
			}
			$link .= $key . "=" . $value . "&";
			$idx++;
		}

		return $link;
	}

}

?>
