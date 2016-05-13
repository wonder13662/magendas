<?php

// common setting
include_once("../common.inc");

$pageId = $_GET["pageId"];

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
</head>






<body role="document" style="background-color:#5B74B3;">

    <div class="container">

    	<div class="well well-lg" style="margin-top:40px;width:500px;background-color:#FFF;">
			<form id="feedDialog">

				<div class="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="true"></div>

				<!--
				<div id="fb_log_in_btn">
					<div class="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="false"></div>				
				</div>
				<div id="fb_log_out_btn">
					<fb:login-button autologoutlink="true"></fb:login-button>
				</div>
				-->

				<div class="form-group">
					<label for="page_selector">Pages</label>

<?php
echo "<select class=\"form-control\" id=\"page_selector\" style=\"margin-bottom:10px;\">";
// if(strcmp($pageId,"1347579945268869") == 0) {
// 	echo "<option value=\"233311017036635\">Test Community</option>";
// 	echo "<option value=\"1347579945268869\" selected>Magendas</option>";
// } else if(strcmp($pageId,"233311017036635") == 0) {
// 	echo "<option value=\"233311017036635\" selected>Test Community</option>";
// 	echo "<option value=\"1347579945268869\">Magendas</option>";
// } else {
// 	echo "<option value=\"233311017036635\">Test Community</option>";
// 	echo "<option value=\"1347579945268869\">Magendas</option>";
// }
echo "</select>";
?>
				</div>

				<div class="form-group">
					<label>Status</label>
					<textarea id="status_textarea" name="message" class="form-control" rows="3"></textarea>
				</div>

				<div class="form-group">
					<label for="input_file_photo_n_video">Video / Photo</label>
					<input type="file" name="source" id="input_file_photo_n_video">
				</div>

				<div class="form-group">
					<label for="input_file_photo_n_video">Title</label>
					<input type="text" name="title" class="form-control">
				</div>

				<div class="form-group">
					<label for="input_file_photo_n_video">Published / Scheduled</label>

					<select class="form-control" id="publish_mode_selector" style="margin-bottom:10px;">
						<option value="PUBLISHED">Published</option>
						<option value="SCHEDULED">Scheduled(11 minutes later - Unpublished)</option>
					</select>
				</div>

				<button id="btn_submit" type="submit" class="btn btn-default">Submit</button>

			</form>
		</div>

		<div id="postListContainer"></div>

    </div> <!-- /container -->

<script>

var pageId = <?php echo json_encode($pageId);?>;

console.log("pageId ::: ",pageId);

var pageIdTestCommnity = "233311017036635";
var pageIdMagendas = "1347579945268869";
if(pageId == null || pageId == "") {
	pageId = pageIdTestCommnity;
}

var feedDialog = $("form#feedDialog");
var statusTextareaJq = feedDialog.find("textarea#status_textarea");
var descTextareaJq = feedDialog.find("textarea#description_textarea");
var inputFilePhotoNVideo = feedDialog.find("input#input_file_photo_n_video");
var checkboxPublished = feedDialog.find("input#checkboxPublished");
var btnSubmit = feedDialog.find("button#btn_submit");
var publishModeSelectorJq = feedDialog.find("select#publish_mode_selector");


var pageSelectorJq = feedDialog.find("select#page_selector");


var fbLoginBtnJq = $("div#fb_log_out_btn");
var fbLogOutBtnJq = $("div#fb_log_out_btn");

console.log("fbLoginBtnJq :: ",fbLoginBtnJq);
console.log("fbLogOutBtnJq :: ",fbLogOutBtnJq);

fbLoginBtnJq.hide();
fbLogOutBtnJq.show();


var callback = function(paramObj) {

	// get My pages
	facebookSDK.getMyPage(
		function(pageList) {

			console.log("HERE / pageList ::: ",pageList);

			/*
			$('#dropListBuilding').append($('<option/>', { 
		        value: value,
		        text : value 
		    }));	
		    */	

		    // if(pageList == null || pageList.length == 0) {
		    // 	fbLoginBtnJq.show();
		    // 	fbLogOutBtnJq.hide();
		    // } else {
		    // 	fbLoginBtnJq.hide();
		    // 	fbLogOutBtnJq.show();
		    // }

		    for(var idx = 0; idx < pageList.length; idx++) {

		    	var pageObj = pageList[idx];

			    pageSelectorJq.append($('<option/>', { 
			        value: pageObj.id,
			        text : pageObj.name 
			    }));

			    var lastOptinoJq = pageSelectorJq.children().last();
			   	if(pageId == pageObj.id) {
			   		lastOptinoJq.attr("selected", "selected");		
			   	}

			    // 	
		    }

		    // show selected page


		    // 



		}
		, this
		, paramObj
	);

	FB.getLoginStatus(function(response) {
	    console.log("getLoginStatus / response ::: ",response);

		// <div id="fb_log_in_btn">
		// 	<div class="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="false"></div>				
		// </div>
		// <div id="fb_log_out_btn">
		// 	<fb:login-button autologoutlink="true"></fb:login-button>
		// </div>

	    if(response.status === "connected") {

	    	console.log("001");

	    	// fbLoginBtnJq.remove();
	    	

	    } else {

	    	console.log("002");

	    	// fbLogOutBtnJq.remove();

	    }

	});	

	// check log in status


	// FB SDK initialized.
	console.log("FB SDK initialized.");
	console.log("Document / callback / paramObj :::: ",paramObj);

	// View count 정보를 가져옵니다.
	var pageId = paramObj.pageId;
	if(pageId == null || pageId == "") {
		return;
	}

	// getPagePosts:function(callback, callbackScope, paramObj) {
	var callbackDPP = function(paramObj) {
		console.log("callbackDPP / paramObj :: ",paramObj);
	}
	var callbackScopeDPP = this;
	facebookSDK.drawPagePost(callbackDPP, callbackScopeDPP, paramObj);

}
var callbackScope = this;
var postListContainerJq = $("div#postListContainer");
console.log("postListContainerJq ::: ",postListContainerJq);
var paramObj = {pageId:pageId,parentJq:postListContainerJq};
facebookSDK.init(_param.FACEBOOK_SDK_STAGE_APP_ID, _param.FACEBOOK_SDK_STAGE_VERSION, callback, callbackScope, paramObj);





// uploadVideo:function(callback, callbackScope, paramObj) { // videoFile, pageId, videoTitle, published, unpublishedContentType
// Variable to store your files
var files = null;

// Add events
$('input[type=file]').on('change', prepareUpload);
// Grab the files and set them to our variable
function prepareUpload(event)
{
	files = event.target.files;
	console.log("files ::: ",files);
}

var testTimeStamp = Math.floor(Date.now() / 1000);
console.log("testTimeStamp ::: ",testTimeStamp);

btnSubmit.on("click", function(e){

	e.preventDefault();

	// get publish mode
	var publishMode = publishModeSelectorJq.val();
	var isPublished = true;
	var unpublishedContentType = null;
	var scheduledPublishTime = null;


	if(facebookSDK.UNPUBLISHED_CONTENT_TYPE_SCHEDULED == publishMode) {
		// scheduledPublishTime = Date.now() + (11 * 60 * 1000)// 11min after
		scheduledPublishTime = Math.floor(Date.now()/1000) + (11 * 60)// 11min after
	}
	if(facebookSDK.PUBLISHED_CONTENT_TYPE_PUBLISHED != publishMode) {

		unpublishedContentType = publishMode;
		isPublished = false;

	} // end if

	var paramObj = 
	{
		pageId:pageId,
		published:isPublished,
		unpublishedContentType:unpublishedContentType,
		scheduled_publish_time:scheduledPublishTime,
		formUpload:feedDialog[0]
	};

	// inputFilePhotoNVideo
	if(files != null && files.length > 0) {

		for(var idx = 0; idx < files.length; idx++) {
			var fileObj = files[idx];

			if(-1 < fileObj.type.indexOf("video")) {

				var desc = statusTextareaJq.val();
				paramObj.description = desc;

				facebookSDK.uploadVideo(function(paramObj) {

					var url = "/view/facebook_page.php";
					_link.go_there(url, {pageId:pageId});

				}, callbackScope, paramObj);

			} else if(-1 < fileObj.type.indexOf("image")) {

				//caption
				var caption = descTextareaJq.val();
				paramObj.caption = caption;

				facebookSDK.uploadPhoto(function(paramObj) {

					var url = "/view/facebook_page.php";
					_link.go_there(url, {pageId:pageId});

				}, callbackScope, paramObj);
			} // end inner if
		} // end for

	} else {	

		// 
		var status = statusTextareaJq.val();
		if(status === "") {
			alert("Please write your status.");
			statusTextareaJq.focus();
			return;
		} else {
			// writePagePost:function(callback, callbackScope, paramObj) {

			paramObj.message = status;
			facebookSDK.writePagePost(function(paramObj) {

				console.log("HERE / 001");

				var url = "/view/facebook_page.php";
				_link.go_there(url, {pageId:pageId});

			}, callbackScope, paramObj);
		}
		

	} // end if

});




pageSelectorJq.change(function(){

	var _selfJq = $(this);
	var curValue = _selfJq.val();
	var url = "/view/facebook_page.php";
	_link.go_there(url, {pageId:curValue});

});

</script>
</body>
</html>