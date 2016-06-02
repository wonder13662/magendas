<?php

	// @ common setting
	include_once("../common.inc");

	// 1. php action template을 가져옵니다.
	// 1-1. 각 엘리먼트의 id가 부여되어야 합니다. id는 숫자가 아닌 hashkey로 처리됩니다.

	// 2. php action template을 json string으로 바꿉니다. 

	// 3. php action template을 파일로 저장합니다.

	// 4. 저장한 파일을 로딩, json string을 불러옵니다. (검사의 목적이 있습니다.)

	// 5. json string을 view의 javascript로 넘겨줍니다.


	// 사용자가 action을 업데이트 할 경우!
	// 1. 



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

console.log("HERE / 001 - XXX");

// php to javascript sample
// var meeting_agenda_list = <?php echo json_encode($meeting_agenda_list);?>;



</script>
</body>
</html>


