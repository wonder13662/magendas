<?php

date_default_timezone_set("Asia/Seoul");

include_once(__DIR__.'/utils/json.manager.inc');
include_once(__DIR__.'/utils/api.param.manager.inc');
include_once(__DIR__."/utils/image.upload.manager.inc");

include_once(__DIR__."/utils/tm.manager.inc");
include_once(__DIR__."/utils/tm.link.manager.inc");
include_once(__DIR__."/utils/tm.param.manager.inc");
include_once(__DIR__."/utils/view.renderer.inc");

include_once(__DIR__."/db/config/mysql.config.inc");
include_once(__DIR__."/db/toast-master/mysql.interface.toast-master.inc");
include_once(__DIR__."/utils/mysql.manager.inc");
include_once(__DIR__."/utils/mysql.query.manager.inc");
include_once(__DIR__."/utils/action.manager.inc");

// @ requried - DB Setting

$wdj_mysql_config = MYSQLConfig::getConfig(MYSQLConfig::$MYSQL_CONFIG_TOAST_MASTER_DEV);
$wdj_mysql_manager = new MYSQLManager($wdj_mysql_config);
$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
$params = new ToastMasterParamManager();

// get service root path
//$path_arr = (explode("/",__DIR__));
$path_arr = (explode("/",$_SERVER['REQUEST_URI']));
$service_root_path = "/" . $path_arr[1] . "/" . $path_arr[2];

// get full file path
$file_root_path = __DIR__;

// @ required - Link Manager Setting
ToastMasterLinkManager::set_root_path($service_root_path);

// @ required - Login User Info
$login_user_info = ToastMasterLogInManager::getLogInCookie($wdj_mysql_interface);
?>