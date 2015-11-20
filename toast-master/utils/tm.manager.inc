<?php

class ToastMasterLogInManager{

	// TEST - PUBLIC
	public static $LOG_IN_COOKIE_NAME = "tm_login_user";
	public static $MEMBERSHIP_COOKIE_NAME = "MEETING_MEMBERSHIP_ID";

	private static $COOKIE_EXPIRE_IN_A_WEEK = 604800;	// 3600 * 24 * 7
	private static $COOKIE_EXPIRE_IN_A_HOUR = 3600;		// 3600

	public static $USER_STATUS_AVAILABLE = "A";
	public static $USER_STATUS_NOT_AVAILABLE = "N";

	//public static function getLogInCookie($__membership_id=-1) {
	public static function getLogInCookie($mysql_interface=null) {

		$login_member_id = self::getCookie(self::$LOG_IN_COOKIE_NAME);

		$login_user_info = new stdClass();
		if($login_member_id > 0){
			$login_user_info->__member_id = $login_member_id;
			$login_user_info->__is_login = "YES";
		} else {
			$login_user_info->__member_id = -1;
			$login_user_info->__is_login = "NO";
		}	

		if(!is_null($mysql_interface)) {
			// enforce user info
			$member_info = null;
			$meeting_membership_id = self::getMembershipCookie();
			if(	(!is_null($login_user_info)) && 
				(0 < intval($login_user_info->__member_id)) && 
				(0 < $meeting_membership_id)) {
				
				$member_info = $mysql_interface->getMember($login_member_id, $meeting_membership_id);
			}
			if(!is_null($member_info)) {
				$login_user_info->__member_first_name = $member_info[0]->__member_first_name;
				$login_user_info->__member_last_name = $member_info[0]->__member_last_name;
				$login_user_info->__membership_name = $member_info[0]->__member_membership_name;
				$login_user_info->__membership_id = $member_info[0]->__member_membership;

				// 해당 유저가 가입한 모든 멤버쉽의 정보를 줍니다.
				$membership_arr = $mysql_interface->getMemberMembership($login_member_id);

				$login_user_info->__membership_arr = $mysql_interface->getMemberMembership($login_member_id);
			}
		}

		return $login_user_info;
	}
	private static $LOG_IN_PARAM_DELIMETER = "|||";
	public static function setLogInCookie($__member_id=-1) {

		if($__member_id < 0) return;

		$tossed_cookie_value = $__member_id;

		self::expireCookie(self::$LOG_IN_COOKIE_NAME);
		self::setCookie(self::$LOG_IN_COOKIE_NAME,$tossed_cookie_value,self::$COOKIE_EXPIRE_IN_A_HOUR);

		// CHECK VALUE
		$registered_cookie_value = self::getCookie(self::$LOG_IN_COOKIE_NAME);
		$cookie_check_obj = new stdClass();
		$cookie_check_obj->tossed_value = $tossed_cookie_value;
		$cookie_check_obj->registered_value = $registered_cookie_value;
		
		if($registered_cookie_value == $tossed_cookie_value) {
			$cookie_check_obj->success = true;
		} else {
			$cookie_check_obj->success = false;
		}

		return $cookie_check_obj;
	}
	public static function expireLogInCookie() {
		self::expireCookie(self::$LOG_IN_COOKIE_NAME);
	}

	// MEMBERSHIP
	public static function getMembershipCookie() {

		$meeting_memberhship_id = self::getCookie(self::$MEMBERSHIP_COOKIE_NAME);

		if(is_null($meeting_memberhship_id) || empty($meeting_memberhship_id)) {
			$meeting_memberhship_id = -1;
		} else {
			$meeting_memberhship_id = intval($meeting_memberhship_id);
		}

		return $meeting_memberhship_id;
	}	
	public static function setMembershipCookie($meeting_memberhship=-1) {

		if($meeting_memberhship < 0) return;

		$tossed_cookie_value = $meeting_memberhship;

		// CHECK VALUE
		$registered_cookie_value = self::getCookie(self::$MEMBERSHIP_COOKIE_NAME);
		$cookie_check_obj = new stdClass();
		$cookie_check_obj->tossed_value = $tossed_cookie_value;
		$cookie_check_obj->registered_value = $registered_cookie_value;
		
		if($registered_cookie_value != $tossed_cookie_value) {
			$cookie_check_obj->hasChanged = true;
			self::expireCookie(self::$MEMBERSHIP_COOKIE_NAME);
			self::setCookie(self::$MEMBERSHIP_COOKIE_NAME,$tossed_cookie_value,self::$COOKIE_EXPIRE_IN_A_HOUR);
		} else {
			$cookie_check_obj->hasChanged = false;
		}

		return $cookie_check_obj;
	}
	public static function expireMembershipCookie() {
		self::expireCookie(self::$MEMBERSHIP_COOKIE_NAME);
	}	

	// COOKIE - Default
	private static function setCookie($cookie_name, $cookie_value, $cookie_live_span){
		setcookie($cookie_name,$cookie_value,time()+$cookie_live_span);
	}
	// TEST - PUBLIC
	public static function getCookie($cookie_name){
	// private static function getCookie($cookie_name){
		$cookie_value = "";
		if(isset($_COOKIE[$cookie_name])){
			$cookie_value = $_COOKIE[$cookie_name];
		}

		return $cookie_value;
	}
	private static function expireCookie($cookie_name){
		if(isset($_COOKIE[$cookie_name])){
			setcookie($cookie_name,"",time()-self::$COOKIE_EXPIRE_IN_A_HOUR);	
		}
	}

	public static function checkLogIn($mysql_interface, $redirect_url=null) {

		$login_user_info = null;
		if(!is_null($mysql_interface)) {
			// @ required
			$login_user_info = ToastMasterLogInManager::getLogInCookie($mysql_interface);
		}

		// 리다이렉트 주소가 없다면 PC TOP으로 이동.
		if(is_null($redirect_url)) {
			$redirect_url = ToastMasterLinkManager::get(ToastMasterLinkManager::$PC_MEETING_AGENDA);
		}

		// 로그인 되어 있지 않으면 LogIn 페이지로 리다이렉트
		if(is_null($login_user_info) || $login_user_info->__is_login!="YES"){

			// @ required
			$mysql_interface->close();

			ToastMasterLinkManager::go(
				// link
				ToastMasterLinkManager::$LOG_IN
				// param_arr
				,array("redirect_url"=>$redirect_url)
			);
		}

		return $login_user_info;
	}


}

?>
