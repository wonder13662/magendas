<?php

// common setting
include_once("../common.inc");

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
					<label for="input_file_photo_n_video">Published / Unpublished</label>

					<select class="form-control" id="publish_mode_selector" style="margin-bottom:10px;">
						<option>PUBLISHED</option>
						<option>SCHEDULED</option>
						<option>DRAFT</option>
						<option>ADS_POST</option>
					</select>
				</div>

				<button id="btn_submit" type="submit" class="btn btn-default">Submit</button>

			</form>
		</div>

		<div class="fb-page" data-href="https://www.facebook.com/Magendas-1347579945268869/" data-tabs="timeline" data-width="500" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"></div>
		<!--
		<div class="fb-page" data-href="https://www.facebook.com/testCommunityWonder/" data-tabs="timeline" data-width="500" data-height="1000" data-small-header="false" data-adapt-container-width="false" data-hide-cover="false" data-show-facepile="true" style="padding-top: 30px;"><div class="fb-xfbml-parse-ignore"><blockquote cite="https://www.facebook.com/testCommunityWonder/"><a href="https://www.facebook.com/testCommunityWonder/">Test community</a></blockquote></div></div>
		-->

    </div> <!-- /container -->

<script>

var pageIdTestCommnity = "233311017036635";
var pageIdMagendas = "1347579945268869";
// var pageId = pageIdMagendas;
var pageId = pageIdTestCommnity;

console.log("XXX - 001");
var callback = function(paramObj) {

	// FB SDK initialized.
	console.log("FB SDK initialized.");
	console.log("Document / callback / paramObj :::: ",paramObj);

	// View count 정보를 가져옵니다.
	var pageId = paramObj.pageId;
	if(pageId == null || pageId == "") {
		return;
	}

	// getPagePosts:function(callback, callbackScope, paramObj) {
	var callbackGPP = function(paramObj) {
		console.log("callbackGPP / paramObj :: ",paramObj);
	}
	var callbackScopeGPP = this;
	facebookSDK.getPagePosts(callbackGPP, callbackScopeGPP, paramObj);

}
var callbackScope = this;
var paramObj = {pageId:pageId};
facebookSDK.init(_param.FACEBOOK_SDK_STAGE_APP_ID, _param.FACEBOOK_SDK_STAGE_VERSION, callback, callbackScope, paramObj);



var feedDialog = $("form#feedDialog");
var statusTextareaJq = feedDialog.find("textarea#status_textarea");
var descTextareaJq = feedDialog.find("textarea#description_textarea");
var inputFilePhotoNVideo = feedDialog.find("input#input_file_photo_n_video");
var checkboxPublished = feedDialog.find("input#checkboxPublished");
var btnSubmit = feedDialog.find("button#btn_submit");
var publishModeSelectorJq = feedDialog.find("select#publish_mode_selector");

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

btnSubmit.on("click", function(e){

	e.preventDefault();

	// get publish mode
	var publishMode = publishModeSelectorJq.val();
	var isPublished = true;
	var unpublishedContentType = null;

	if(facebookSDK.PUBLISHED_CONTENT_TYPE_PUBLISHED != publishMode) {
		unpublishedContentType = publishMode;
		isPublished = false;
	} // end if

	var paramObj = 
	{
		pageId:pageId,
		published:isPublished,
		unpublishedContentType:unpublishedContentType,
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

				}, callbackScope, paramObj);

			} else if(-1 < fileObj.type.indexOf("image")) {

				//caption
				var caption = descTextareaJq.val();
				paramObj.caption = caption;

				facebookSDK.uploadPhoto(function(paramObj) {

				}, callbackScope, paramObj);
			} // end inner if
		} // end for
	} // end if

});

</script>
</body>
</html>