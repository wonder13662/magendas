<?php

	// common setting
	include_once("../common.inc");
	include_once("../db/toast-master/mysql.interface.toast-master.inc");


	// GET PARAMS
	$result_obj = new stdClass();

	$id = $_POST['id'];
	$name = $_POST['name'];

	$result_obj->id=$id;
	$result_obj->name=$name;


	// TYPE 2
	// DB PROCESS
	$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
	$member_list = $wdj_mysql_interface->getMemberList(1, "A");
	$result_obj->member_list = $member_list;

	// TYPE 3
	// json format
	// $timezones = ["Asia/Seoul", "America/New_York"];
	// echo json_encode($timezones);


	// OUTPUT
	echo json_encode($result_obj);	

?>

