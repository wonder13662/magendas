<?php

// common setting
include_once("../../../common.inc");

// @ required
$wdj_mysql_interface->close();
?>

<html>
<head>
<?php
// @ required
include_once("../../../common.js.inc");
$view_render_var_arr = array("[__ROOT_PATH__]"=>$service_root_path);
ViewRenderer::render("$file_root_path/template/head.include.toast-master.mobile.template",$view_render_var_arr);
?>
</head>

</head>

<body role="document" style="background-color: #004064;">

<table class="table" style="margin-bottom:0px;">

	<tbody id="list">

		<!-- Q&A -->
		<tr class="active" style="color:rgb(51, 51, 51);background-color:#004064;border-bottom:1px solid #ddd;">
			<td class="text-center" style="border-top:0px;border-bottom: 1px solid #004064;background-color:#F2E074;color:#004064;">
				<h5><span><strong>PROGRAM SCHEDULE</strong></span></h5>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<span style="font-size:13px;">NO INFO</span>
			</td>
		</tr>

	</tbody>
	
</table>
<script>

var ealry_bird_head_jq = $("img#ealry_bird_head");
var screen_width = $(window).width();
ealry_bird_head_jq.css("width",screen_width);
console.log("ealry_bird_head_jq :: ",ealry_bird_head_jq);
console.log("screen_width :: ",screen_width);


// REMOVE Loading message
// show contents when it's ready
_tm_m_list.doWhenDocumentReady(
	_obj.getDelegate(function(delegate_data){

		console.log("Document is Ready!");


	}, this)
);

</script>
</body>
</html>
