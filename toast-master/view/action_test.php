<?php

	// @ common setting
	include_once("../common.inc");

	// TEST - SAVE
	// $action_obj = ActionTemplate::get_TM_Default("07:30", "Special Meeting");
	// $cur_hash_key = $action_obj->get_hash_key();
	// echo "\$cur_hash_key :: $cur_hash_key<br/>";
	// ActionFileManager::save("2016-06-03", $action_obj);

	// TEST - LOAD
	$target_YYYYMMDD = "2016-06-03";
	// $target_hash_key = "2b5033aaa9b7dc03a4138f4082e4cee9"; // OFFICER TABLE
	// $target_hash_key = "7e31adfeaed978868c3b1f0a93515840";	// MEETING TABLE
	$target_hash_key = "cad323cbd4f831b5cf18c47c0e50c992";	// MEETING TABLE ZIPPED

	// 

	$content = ActionFileManager::load($target_YYYYMMDD, $target_hash_key);


	// @ required
	$wdj_mysql_interface->close();
	
?>



<html>
<head>
<?php
	// @ required
	include_once("../common.js.inc");
	$view_render_var_arr = array("[__ROOT_PATH__]"=>$service_root_path);
	ViewRenderer::render("$file_root_path/template/head.include.toast-master.template",$view_render_var_arr);
?>
<!-- view controller -->
<script src="../js/toast-master/meeting.agenda.js"></script>
</head>


<body role="document">


<script>

// php to javascript sample
var content = <?php echo json_encode($content);?>;
var content_obj = $.parseJSON(content);
console.log("content_obj ::: ",content_obj);



</script>
</body>
</html>


