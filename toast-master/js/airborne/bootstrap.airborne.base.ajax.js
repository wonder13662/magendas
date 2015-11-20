airborne.ajax = {
	send:function(_url, _param_obj, _callback_success, _callback_fail, _callback_scope){

		var request = $.ajax({
			url: _url,
			type: "GET",
			data: _param_obj	//{ page : 1, size : 2 },
		}).done(function( jsonResult ) {

			// console.log("airborne.ajax.send / done / jsonResult : ",jsonResult);
			var json_query_result = $.parseJSON(jsonResult);

			if(json_query_result == null) return;
			//console.log("airborne.ajax.send / done / json_query_result : ",json_query_result);

			if(_callback_success == null) return;
			_callback_success.apply(_callback_scope, [json_query_result]);	
		}).fail(function( jqXHR, textStatus ) {
			console.log("airborne.ajax.send / fail / jqXHR : ",jqXHR);
			console.log("airborne.ajax.send / fail / textStatus : ",textStatus);

			if(_callback_fail == null) return;

			_callback_fail.apply(_callback_scope, [textStatus]);
		});
	}
	,send_simple:function(_url, _param_obj, _callback_scope, is_post){
		
		if( _url == null || _callback_scope == null ){
			alert("airborne.ajax.send_simple / Error / param is not valid!");
			return;
		}

		var method = (is_post!=null&&is_post==true)?"POST":"GET";

		var request = $.ajax({

			url:_url,
			type:method,
			dataType:'json',
			data:_param_obj	//{ page : 1, size : 2 },

		}).done(function( result_json_str ) {

			var result_json_obj = $.parseJSON(result_json_str);

			if(result_json_obj == null || result_json_obj.success == null || result_json_obj.message == null){
				alert("airborne.ajax.send_simple / Error / result_json_obj is not valid!");
			} else if( result_json_obj.success == false && airborne.validator.isValidStr(result_json_obj.message) ) {
				alert("airborne.ajax.send_simple / Error / " + result_json_obj.message);
			}

		}).fail(function( jqXHR, text_status ) {
			console.log("airborne.ajax.send_simple / Error / " + text_status);
			alert("airborne.ajax.send_simple / Error / " + text_status);
		});
	}
	/*
	@ Desc : ajax post 전송을 합니다. 결과를 콘솔창에 보여줍니다. / 222
	*/
	,send_simple_post:function(_url, _param_obj, _delegate_after_job_done){

		var method_name = "airborne.ajax.send_simple_post";
		var _obj = airborne.bootstrap.obj;
		if(_obj == undefined) {
			console.log(method_name + " / Error / _obj == undefined");
			return;
		}
		if( _url == undefined ){
			console.log(method_name + " / Error / _url == undefined");
			return;
		}
		if(_obj.isNotValidDelegate(_delegate_after_job_done)){
			console.log(method_name + " / Error / _obj.isNotValidDelegate(_delegate_after_job_done)");
			return;
		}

		var method = "POST";
		var request = $.ajax({
			url:_url,
			// POST | GET
			type:method,
			dataType:'json',
			//parameters / { page : 1, size : 2 }
			data:_param_obj,
			success: function(response) {
			}

		}).done(function( data ) {

			_delegate_after_job_done._func.apply(_delegate_after_job_done._scope,[data]);

		}).fail(function( jqXHR, text_status ) {

			_delegate_after_job_done._func.apply(_delegate_after_job_done._scope,[jqXHR.responseText]);

		});
		
	}	
	,UPLOAD_FILE_MIN_SIZE:204800 // 1024*200 (200kb)
	,UPLOAD_FILE_DEFAULT_ID:"userfile"
	,UPLOAD_FILE_TYPE_NORMAL:{type:0}/*normal data*/
	,UPLOAD_FILE_TYPE_IMAGE:{type:1,default_image_path:"",image_width:64,image_height:64}/*image*/
	,getUploadFileTypeImage:function(id, default_image_path, image_path, image_width, image_height, image_anchor_tag_jq, image_tag_jq, image_path_input_tag_jq, file_meta_info_obj){
		var typeObj = {	
			type:this.UPLOAD_FILE_TYPE_IMAGE
			,id:id
			,image_anchor_tag_jq:image_anchor_tag_jq
			,image_tag_jq:image_tag_jq
			,image_path_input_tag_jq:image_path_input_tag_jq
			,value:{
				default_image_path:default_image_path
				,image_path:image_path
				,image_width:image_width
				,image_height:image_height
			}
			,file_meta_info_obj:file_meta_info_obj
		};
		return typeObj;
	}
	,UPLOAD_FILE_TYPE_SOUND:{type:2}/*sound*/
	,UPLOAD_FILE_TYPE_VIDEO:{type:3}/*video*/
	,uploadFile:function(jq_form_tag_parent, upload_page_url, upload_file_id, max_file_size, upload_file_type_obj){
		
		var _v = airborne.validator;
		
		if(jq_form_tag_parent == null || jq_form_tag_parent.length == 0){
			console.log("airborne.ajax.uploadFile / jq_form_tag_parent == null");
			return;	
		}
		if(airborne.validator.isNotValidStr(upload_page_url)) {
			console.log("airborne.ajax.uploadFile / airborne.validator.isNotValidStr(upload_page_url)");
			return;	
		}
		if(airborne.validator.isNotValidStr(upload_file_id)){
			upload_file_id = this.UPLOAD_FILE_DEFAULT_ID;
		}

		var min_file_size = this.UPLOAD_FILE_MIN_SIZE;
		if(	max_file_size == null || 
			isNaN(max_file_size) || 
			max_file_size < min_file_size){

			max_file_size = min_file_size;
		}
		
		// draw form tag
		
		var form_tag =
		"<div class=\"well well-sm\" style=\"margin:0 auto 10px;\">" +
		"<form id=\"myForm\" action=\"<upload_page_url>\" method=\"post\" enctype=\"multipart/form-data\">"
			.replace(/\<upload_page_url\>/gi, upload_page_url) +
			"<input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"<MAX_FILE_SIZE>\">"
			.replace(/\<MAX_FILE_SIZE\>/gi, max_file_size) +
			"<input type=\"file\" size=\"60\" name=\"<file>\">" 
			.replace(/\<file\>/gi, upload_file_id) +
			"<input type=\"hidden\" name=\"UPLOAD_FILE_ID\" value=\"<UPLOAD_FILE_ID>\"><br/>" 
			.replace(/\<UPLOAD_FILE_ID\>/gi, upload_file_id) +
			"<input type=\"hidden\" name=\"image_width\" value=\"<image_width>\"><br/>" 
			.replace(/\<image_width\>/gi, upload_file_type_obj.value.image_width) +
			"<input type=\"hidden\" name=\"image_height\" value=\"<image_height>\"><br/>" 
			.replace(/\<image_height\>/gi, upload_file_type_obj.value.image_height)
		;
			
		for (var key in upload_file_type_obj.file_meta_info_obj) {
			var value = upload_file_type_obj.file_meta_info_obj[key];
			form_tag +=
				"<input type=\"hidden\" name=\"<key>\" value=\"<value>\"><br/>" 
				.replace(/\<key\>/gi, key) .replace(/\<value\>/gi, value)
			;	
		}
		
		form_tag +=	
			"<input type=\"submit\" value=\"Upload\" class=\"btn btn-primary\">" + 
		"</form></div>";

		var jq_form_tag = jq_form_tag_parent.append(form_tag);

		var flexable_width = (jq_form_tag.parent().parent().outerWidth() - jq_form_tag.position().left);
		jq_form_tag.width(flexable_width);
		
		// http://malsup.com/jquery/form/
		var options = { 
			remove:function(){
				if(jq_form_tag != null){
					jq_form_tag.children().remove();	
				}
			}
			,beforeSend: function(){
			}
			,uploadProgress: function(event, position, total, percentComplete){
				//console.log("percentComplete : ",percentComplete);
 			}
			,success: function(){
				//console.log("success");
 			}
			,complete: function(response){
				if(this.callback_on_completed != null && this.scope_on_completed != null){
					this.callback_on_completed.apply(this.scope_on_completed,[response.responseText, this]);

				} else {
					console.log("complete : ",response.responseText);
				}
			}
			,error: function(response){
				if(this.callback_on_failed != null && this.scope_on_failed != null){

					this.callback_on_failed.apply(this.scope_on_failed,[response.responseText, this]);
				} else {
					console.log("error");
				}
 			}
			,setCallbackOnCompleted:function(callback, scope){
				this.callback_on_completed = callback;
				this.scope_on_completed = scope;
			}
			,callback_on_completed:null
			,scope_on_completed:null
			,setCallbackOnFailed:function(callback, scope){
				this.callback_on_failed = callback;
				this.scope_on_failed = scope;
			}
			,callback_on_failed:null
			,scope_on_failed:null
			// Image Upload
			,jq_form_tag:null
			,jq_form_image_path_tag:null
			,jq_form_image_anchor_tag:null
			,jq_form_image_path_input_tag:null
			,upload_file_type_obj:null
			,getImageTag:function(){

				if(this.jq_form_tag == null) {
					console.log("getImageTag / this.jq_form_tag : ",this.jq_form_tag);
					return;	
				}
				var image_tag_jq = this.upload_file_type_obj.image_tag_jq;
				if(image_tag_jq == null){
					console.log("getImageTag / image_tag_jq : ",image_tag_jq);
					return;
				}

				if(this.jq_form_image_tag == null){
					this.jq_form_image_tag = this.upload_file_type_obj.image_tag_jq;
				}
				if(this.jq_form_image_anchor_tag == null){
					this.jq_form_image_anchor_tag = $(this.jq_form_image_tag.find("a#"+this.upload_file_type_obj.id)[0]);
				}
				if(this.jq_form_image_path_input_tag == null){
					this.jq_form_image_path_input_tag = this.upload_file_type_obj.image_path_input_tag_jq;
				}

				return {image_tag:this.jq_form_image_tag,image_anchor_tag:this.jq_form_image_anchor_tag};
			}
			,setImagePath:function(new_image_path){
				
				if(	airborne.validator.isNotValidStr(new_image_path)){
					console.log("setImagePath / airborne.validator.isNotValidStr(new_image_path)");
					return;
				}
				
				// add dummy parameter to break cache
				var _date = airborne.dates;
				var now_dttm = _date.getNow(_date.DATE_TYPE_YYYYMMDDHHMMSS);
				
				var image_path_cache_expired = new_image_path + "?a=" + now_dttm;
				
				upload_file_type_obj.image_tag_jq.attr("src", image_path_cache_expired);
				upload_file_type_obj.image_anchor_tag_jq.attr("href", new_image_path);
				upload_file_type_obj.image_path_input_tag_jq.val(image_path_cache_expired);
			}
		};

		options.jq_form_tag = jq_form_tag;
		options.upload_file_type_obj = upload_file_type_obj;
		jq_form_tag.ajaxForm(options);

		return options;
	}
}