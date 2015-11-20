<?php

// common setting
include_once("../common.inc");

// @ optional - links
$link_meeting_agenda = ToastMasterLinkManager::get(ToastMasterLinkManager::$PC_MEETING_AGENDA);

$param_array = array(
	"redirect_url"=>APIParamManager::getParamStringDetail($link_meeting_agenda/*default*/)
);

$json_res_obj = APIParamManager::getParams($param_array);
if($json_res_obj->success == FALSE){
	echo json_encode($json_res_obj);
	return;
}
$params = $json_res_obj->result;

// @ required
$wdj_mysql_interface->close();

$redirect_url = $params["redirect_url"];

// PHP Cookies
// http://www.w3schools.com/php/php_cookies.asp

// Expire Cookie
ToastMasterLogInManager::expireLogInCookie();

// Redirect url
header("Location: ".$redirect_url);

?>