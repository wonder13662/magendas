<?php

class ToastMasterLogInManager{

	// TEST - PUBLIC
	public static $COOKIE_TM_LOGIN_MEMBER_HASHKEY = "COOKIE_TM_LOGIN_MEMBER_HASHKEY";
	public static $COOKIE_TM_MEMBERSHIP_ID = "COOKIE_TM_MEMBERSHIP_ID";

	private static $COOKIE_EXPIRE_IN_A_WEEK = 604800;	// 3600 * 24 * 7
	private static $COOKIE_EXPIRE_IN_A_HOUR = 3600;		// 3600

	public static $USER_STATUS_AVAILABLE = "A";
	public static $USER_STATUS_NOT_AVAILABLE = "N";

	public static function getLogInCookie($mysql_interface=null) {

		$login_member_hashkey = self::getCookie(self::$COOKIE_TM_LOGIN_MEMBER_HASHKEY);

		$login_user_info = new stdClass();
		if(!empty($login_member_hashkey)){
			$login_user_info->__member_hashkey = $login_member_hashkey;
			$login_user_info->__is_login = "YES";
		} else {
			$login_user_info->__member_hashkey = "";
			$login_user_info->__is_login = "NO";
		}	

		if(!is_null($mysql_interface)) {

			// enforce user info
			$member_info = null;
			$meeting_membership_id = self::getMembershipCookie();
			if(	(!is_null($login_user_info)) && 
				(!empty($login_user_info->__member_hashkey)) && 
				(0 < $meeting_membership_id)) {
					
				// 여기선 멤버의 클럽 정보는 제외된 멤버만의 정보(First name, Last name, email)를 나타냅니다.
				$member_info = $mysql_interface->getMember($login_member_hashkey);
			}
			if(!is_null($member_info) && !empty($member_info)) {

				// 로그인한 유저의 정보를 넘겨줍니다.
				$login_user_info->__member_first_name = $member_info[0]->__member_first_name;
				$login_user_info->__member_last_name = $member_info[0]->__member_last_name;

				// 해당 유저가 가입한 모든 멤버쉽의 정보를 줍니다.
				$login_user_info->__membership_arr = $mysql_interface->getMemberMembership($login_member_hashkey);

				// 해당 유저가 현재 뷰페이지의 클럽의 멤버인지 여부를 확인합니다.
				$is_club_member=false;
				for($idx = 0; $idx < sizeof($login_user_info->__membership_arr); $idx++){
					$cur_membership_obj = $login_user_info->__membership_arr[$idx];
					if($meeting_membership_id == intval($cur_membership_obj->__member_membership)) {
						$is_club_member=true;
						break;
					}
				}
				$login_user_info->__is_club_member = $is_club_member;
			}
		}

		return $login_user_info;
	}
	private static $LOG_IN_PARAM_DELIMETER = "|||";
	public static function setLogInCookie($__member_hashkey=null) {

		if(empty($__member_hashkey)) return;

		$tossed_cookie_value = $__member_hashkey;

		self::expireCookie(self::$COOKIE_TM_LOGIN_MEMBER_HASHKEY);
		self::setCookie(self::$COOKIE_TM_LOGIN_MEMBER_HASHKEY,$tossed_cookie_value,self::$COOKIE_EXPIRE_IN_A_HOUR);

		// CHECK VALUE
		$registered_cookie_value = self::getCookie(self::$COOKIE_TM_LOGIN_MEMBER_HASHKEY);
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
		self::expireCookie(self::$COOKIE_TM_LOGIN_MEMBER_HASHKEY);
	}

	// MEMBERSHIP
	public static function getMembershipCookie() {

		$meeting_memberhship_id = self::getCookie(self::$COOKIE_TM_MEMBERSHIP_ID);

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
		$registered_cookie_value = self::getCookie(self::$COOKIE_TM_MEMBERSHIP_ID);
		$cookie_check_obj = new stdClass();
		$cookie_check_obj->tossed_value = $tossed_cookie_value;
		$cookie_check_obj->registered_value = $registered_cookie_value;
		
		if($registered_cookie_value != $tossed_cookie_value) {
			$cookie_check_obj->hasChanged = true;
			self::expireCookie(self::$COOKIE_TM_MEMBERSHIP_ID);
			self::setCookie(self::$COOKIE_TM_MEMBERSHIP_ID,$tossed_cookie_value,self::$COOKIE_EXPIRE_IN_A_HOUR);
		} else {
			$cookie_check_obj->hasChanged = false;
		}

		return $cookie_check_obj;
	}
	public static function expireMembershipCookie() {
		self::expireCookie(self::$COOKIE_TM_MEMBERSHIP_ID);
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

// REMOVE ME
/*
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
*/


}

?>
