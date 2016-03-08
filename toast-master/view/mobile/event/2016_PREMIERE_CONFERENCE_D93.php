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

<?php
echo "<img id=\"ealry_bird_head\" src=\"$service_root_path/images/event/D93_PREMIERE_CONF_2016/mobile_conference_page.jpg\">";
?>

<table class="table" style="margin-bottom:0px;">

	<tbody id="list">

		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<br/>
				<a href="http://goo.gl/forms/vap3Rj42To" class="btn btn-default btn-lg btn-block" role="button" style="color:#004064;">GET YOUR TICKET</a>
				<br/>
			</td>
		</tr>

		<!-- Q&A -->
		<tr class="active" style="color:rgb(51, 51, 51);background-color:#004064;border-bottom:1px solid #ddd;">
			<td class="text-center" style="border-top:0px;border-bottom: 1px solid #004064;background-color:#F2E074;color:#004064;">
				<h5><span><strong>What is the benefit of "Early Bird" ticket?</strong></span></h5>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<span style="font-size:13px;">It's the most lowest price you can get. You can save 15,000KRW than Regular ticket and 25,000KRW than on-site ticket.</span>
			</td>
		</tr>

		<!-- Q&A -->
		<tr class="active" style="color:rgb(51, 51, 51);background-color:#004064;border-bottom:1px solid #ddd;">
			<td class="text-center" style="border-top:0px;border-bottom: 1px solid #004064;background-color:#F2E074;color:#004064;">
				<h5><span><strong>When is the "Early Bird" season ends?</strong></span></h5>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<span style="font-size:13px;">You can buy "Early Bird" ticket until the end of March. March 31st.</span>
			</td>
		</tr>

		<!-- Q&A -->
		<tr class="active" style="color:rgb(51, 51, 51);background-color:#004064;border-bottom:1px solid #ddd;">
			<td class="text-center" style="border-top:0px;border-bottom: 1px solid #004064;background-color:#F2E074;color:#004064;">
				<h5><span><strong>Do I can get group registration discount this time?</strong></span></h5>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<span style="font-size:13px;">Unfortunately we don't have group registration due to clarify financial status.</span>
			</td>
		</tr>

		<!-- Q&A -->
		<tr class="active" style="color:rgb(51, 51, 51);background-color:#004064;border-bottom:1px solid #ddd;">
			<td class="text-center" style="border-top:0px;border-bottom: 1px solid #004064;background-color:#F2E074;color:#004064;">
				<h5><span><strong>What kind of education session we can get?</strong></span></h5>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<span style="font-size:13px;">The education team is working so hard to prepare the best sessions ever. It will be announced in public soon.</span>
			</td>
		</tr>

		<!-- Q&A -->
		<tr class="active" style="color:rgb(51, 51, 51);background-color:#004064;border-bottom:1px solid #ddd;">
			<td class="text-center" style="border-top:0px;border-bottom: 1px solid #004064;background-color:#F2E074;color:#004064;">
				<h5><span><strong>Who is the VIP Speaker?</strong></span></h5>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<span style="font-size:13px;">Darren LaCroix. He is famous for the most humorous speaker in the toastmaster history.</span>
			</td>
		</tr>		
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<!-- 16:9 aspect ratio -->
				<div class="embed-responsive embed-responsive-16by9">
					<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/qovsP1aaEQY" frameborder="0" allowfullscreen></iframe>
				</div>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<!-- 16:9 aspect ratio -->
				<div class="embed-responsive embed-responsive-16by9">
					<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/FUDCzbmLV-0" frameborder="0" allowfullscreen></iframe>
				</div>
			</td>
		</tr>

		<!-- Q&A -->
		<tr class="active" style="color:rgb(51, 51, 51);background-color:#004064;border-bottom:1px solid #ddd;">
			<td class="text-center" style="border-top:0px;border-bottom: 1px solid #004064;background-color:#F2E074;color:#004064;">
				<h5><span><strong>Feedbacks are always welcome!</strong></span></h5>
			</td>
		</tr>
		<tr id="test" style="color:#c0c0c0;background-color:#FFF;">
			<td class="text-left" style="border-top:0px;background-color:#004064;color:#F2E074;">
				<a href="mailto:wonder13662@gmail.com">Ask us via email! Click Me!</a>
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



/*
// Set Event
var row_back_to_meeting_agenda_detail_jq = $("table thead tr#row_back_to_previous");
var row_back_to_meeting_agenda_detail_delegate_obj = _obj.getDelegate(function(){
	var call_url = _link.get_link(_link.MOBILE_MEMBER_MANAGE);
	location.href = call_url;

}, this);
_m_list.setTableHeaderRowEvent(row_back_to_meeting_agenda_detail_jq, row_back_to_meeting_agenda_detail_delegate_obj);
*/

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
