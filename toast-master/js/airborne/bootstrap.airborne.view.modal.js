// airborne.bootstrap.modal.drawModalModify:function(parent_jq_obj, column_info, mode, selected_row_data)
airborne.bootstrap.modal = {
	MODAL_UPDATE_CONTAINER_ID:"row_modal"
	,MODAL_INSERT_CONTAINER_ID:"row_modal"
	,getFormActionUrlObj:function(action_url){
		var action_url_obj = {
			action_url:action_url
		}
		return action_url_obj;
	}
	,isNotValidActionUrlObj:function(action_url_obj){
		return !this.isValidActionUrlObj(action_url_obj);
	}
	,isValidActionUrlObj:function(action_url_obj){
		if( action_url_obj == null || 
			action_url_obj.action_url == null || 
			action_url_obj.action_url == ""	){
			return false;
		}
		return true;
	}
	,getModifyUrlObj:function(modal_insert_url, modal_update_url, modal_delete_url){
		var modifyUrlObj = 
		{
			modal_insert_url:(modal_insert_url==null)?"":modal_insert_url
			, modal_update_url:(modal_update_url==null)?"":modal_update_url
			, modal_delete_url:(modal_delete_url==null)?"":modal_delete_url
		};
		return modifyUrlObj;
	}
	,isNotValidModifyUrlObj:function(modifyUrlObj){
		return !this.isValidModifyUrlObj(modifyUrlObj);
	}
	,isValidModifyUrlObj:function(modifyUrlObj){
		if(	modifyUrlObj == null || 
			modifyUrlObj.modal_insert_url == null || 
			modifyUrlObj.modal_update_url == null || 
			modifyUrlObj.modal_delete_url == null) return false;

		return true;
	}
	,drawModalModify:function(parent_jq_obj, mode, column_info, selected_row_data, modifyUrlObj, modal_title, delegate_on_event){ // attach to bottom of body tag..

		var _column = airborne.bootstrap.column;
		var _v = airborne.validator;
		if(_column.isNotValidMode(mode)){
			console.log("!Error! / airborne.view.modal / drawModalModify / _column.isNotValidMode(mode)");
			return;
		}
		if(column_info == null) {
			console.log("!Error! / airborne.view.modal / drawModalModify / column_info == null");
			return;
		}
		if(parent_jq_obj == null) {
			console.log("!Error! / airborne.view.modal / drawModalModify / this.parent_jq_obj == null");
			return;
		}
		if(this.isNotValidModifyUrlObj(modifyUrlObj) && this.isNotValidActionUrlObj(modifyUrlObj)){
			console.log("!Error! / airborne.view.modal / drawModalModify / this.isNotValidModifyUrlObj(modifyUrlObj) && this.isNotValidActionUrlObj(modifyUrlObj)");
			return;
		}
		if(_v.isNotValidStr(modal_title)){
			console.log("!Error! / airborne.view.modal / drawModalModify / _v.isNotValidStr(modal_title)");
			return;
		}
		
		
		var use_ajax = false;
		if(this.isValidModifyUrlObj(modifyUrlObj)){
			use_ajax = true;
		}
		
		var container_id = null;
		if(mode == _column.MODE_INSERT){
			container_id = this.MODAL_INSERT_CONTAINER_ID;
		} else if(mode == _column.MODE_UPDATE){
			container_id = this.MODAL_UPDATE_CONTAINER_ID;
		}
		parent_jq_obj.find("div#" + container_id).remove();
		
		// modal for insert begins
		var modal_tag = "";
		modal_tag += "<div class=\"modal fade\" id=\"<id>\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"<id>_label\" aria-hidden=\"true\">"
						.replace(/\<id\>/gi, container_id);
		modal_tag += "<div class=\"modal-dialog\">";
		modal_tag += "<div class=\"modal-content\">";

		modal_tag += "<div class=\"modal-header\">";
		modal_tag += "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>";
		modal_tag += "<h4 class=\"modal-title\" id=\"insert_row_modal_label\"><table_name></h4></div>"
						.replace(/\<table_name\>/gi, modal_title);
		
		modal_tag += "<div class=\"modal-body\">"
		// input form
		if(use_ajax){
			modal_tag += 
			"<form role=\"form\">";
		} else { // action="demo_form_action.asp" method="get"
			modal_tag += 
			//"<form role=\"form\" id=\"modal_modify_form\" action=\"<modify_link>\" method=\"POST\">"
			"<form role=\"form\" id=\"modal_modify_form\" action=\"<modify_link>\" method=\"GET\">"
			.replace(/\<modify_link\>/gi, modifyUrlObj.action_url);
			;
		}
		

		if(mode == _column.MODE_INSERT){
			// set column values
			modal_tag += _column.drawColumnTagsModify(mode, column_info);
			modal_tag += "<div class=\"form-group\">"

			if(use_ajax){

				modal_tag += "<button type=\"submit\" class=\"btn btn-primary\" id=\"<modal_name>\" onclick=\"return false;\">INSERT</button>"
								.replace(/\<modal_name\>/gi, "modal_insert");

			} else {

				modal_tag += "<input type=\"hidden\" id=\"modify_btn_type_insert\" name=\"modify_btn_type_insert\" value=\"YES\">";
				modal_tag += "<button type=\"submit\" class=\"btn btn-primary\" id=\"<modal_name>\" onclick=\"return false;\">INSERT</button>"
								.replace(/\<modal_name\>/gi, "modal_insert");

			}

		} else if(mode == _column.MODE_UPDATE){
			// set column values
			modal_tag += _column.drawColumnTagsModify(mode, column_info, selected_row_data);
			modal_tag += "<div class=\"form-group\">"

			// Add Update Btn tag
			if(use_ajax && _v.isValidStr(modifyUrlObj.modal_update_url)){

				modal_tag += "<button type=\"submit\" class=\"btn btn-primary\" id=\"<modal_name>\" onclick=\"return false;\">UPDATE</button>&nbsp;&nbsp;&nbsp;"
								.replace(/\<modal_name\>/gi, "modal_update");

			} else if (!use_ajax && _v.isValidStr(modifyUrlObj.action_url)){

				modal_tag += "<input type=\"hidden\" id=\"modify_btn_type_update\" name=\"modify_btn_type_update\" value=\"NO\">";
				modal_tag += "<button type=\"submit\" class=\"btn btn-primary\" id=\"<modal_name>\" onclick=\"return false;\">UPDATE</button>&nbsp;&nbsp;&nbsp;"
								.replace(/\<modal_name\>/gi, "modal_update");

			}
			// Add Delete Btn tag
			if(use_ajax && _v.isValidStr(modifyUrlObj.modal_delete_url)){

				modal_tag += "<button type=\"submit\" class=\"btn btn-danger\" id=\"<modal_name>\" onclick=\"return false;\">DELETE</button>"
								.replace(/\<modal_name\>/gi, "modal_delete");

			} else if (!use_ajax && _v.isValidStr(modifyUrlObj.action_url)){ // TODO 삭제시 다시 한번 확인 메시지 노출

				modal_tag += "<input type=\"hidden\" id=\"modify_btn_type_delete\" name=\"modify_btn_type_delete\" value=\"NO\">";
				modal_tag += "<button type=\"submit\" class=\"btn btn-danger\" id=\"<modal_name>\" onclick=\"return false;\">DELETE</button>"
								.replace(/\<modal_name\>/gi, "modal_delete");

			}
		} 
				
		modal_tag += "</div></form>";
		modal_tag += "</div></div></div></div>";

		parent_jq_obj.append(modal_tag);
		var modal_tag_jq = parent_jq_obj.find("div#" + container_id);

		this.addFieldGetter(column_info, modal_tag_jq, mode);
		if(use_ajax){
			this.addModalModifyEvent(modal_tag_jq, mode, column_info, modifyUrlObj, delegate_on_event);
		} else {
			this.addModalFormModifyEvent(modal_tag_jq, mode, column_info, delegate_on_event);
		}
		this.addModalUploadEvent(modal_tag_jq, mode, column_info);
		
		// show popup
		$("#"+container_id).modal({
			keyboard:true
			,show:true
		});
	}
	,addFieldGetter:function(column_info, modal_tag_jq, mode){ // row && column --> field
		
		var _column = airborne.bootstrap.column;

		for (var key in column_info) {
			var cur_column = column_info[key];
			var cur_type = cur_column.getType(mode);

			if(cur_type == _column.COLUMN_TYPE_SELECT){

				var select_refer_jq = modal_tag_jq.find("select#" + cur_column.getKey());
				if(select_refer_jq == null || select_refer_jq.length == 0){
					console.log("!Error! / airborne.view.modal / addFieldGetter / select_refer_jq is not valid!");
					continue;
				}
				cur_column.setRefererJquery(select_refer_jq);
				
				cur_column.getModifyValue = function(select_refer_jq){
					return select_refer_jq.val();
				}

			} else if(cur_type == _column.COLUMN_TYPE_INPUT || cur_type == _column.COLUMN_TYPE_INPUT_DISABLED){

				var input_refer_jq = modal_tag_jq.find("input#" + cur_column.getKey());
				if(input_refer_jq == null || input_refer_jq.length == 0){
					console.log("!Error! / airborne.view.modal / addFieldGetter / input_refer_jq is not valid!");
					continue;
				}
				cur_column.setRefererJquery(input_refer_jq);
				
				cur_column.getModifyValue = function(input_refer_jq){
					return input_refer_jq.val();
				}

			} else if(cur_type == _column.COLUMN_TYPE_IMAGE || cur_type == _column.COLUMN_TYPE_IMAGE_UPLOAD){

				var img_refer_jq = modal_tag_jq.find("img#" + cur_column.getKey());
				if(img_refer_jq == null || img_refer_jq.length == 0){
					console.log("!Error! / airborne.view.modal / addFieldGetter / img_refer_jq is not valid!");
					continue;
				}
				cur_column.setRefererJquery(img_refer_jq);	

				var default_image_path = cur_column.modify_info.default_image_path;
				cur_column.getModifyValue = function(img_refer_jq){

					// check whether it has default image.
					var image_path = img_refer_jq.attr("src");
					if(image_path == default_image_path){
						image_path = "";
					}

					return image_path;
				};

			} else if(cur_type == _column.COLUMN_TYPE_HIDDEN){

				var key = "input." + _column.COLUMN_TYPE_HIDDEN + "_" + cur_column.getKey();
				var hidden_refer_jq = modal_tag_jq.find(key);
				if(hidden_refer_jq == null || hidden_refer_jq.length == 0){
					console.log("!Error! / airborne.view.modal / addFieldGetter / hidden_refer_jq is not valid! / key : ",key);
					continue;
				}
				cur_column.setRefererJquery(hidden_refer_jq);

				cur_column.getModifyValue = function(hidden_refer_jq){
					return hidden_refer_jq.val();
				}

			} // end if

		} // end for

	}
	,addModalFormModifyEvent:function(modal_tag_jq, mode, column_info, delegate_on_event){

		if(column_info == null) {
			console.log("!Error / modal / addModalModifyEvent / column_info == null");
			return;	
		}

		if(modal_tag_jq == null) {
			console.log("!Error / modal / addModalModifyEvent / modal_tag_jq == null");
			return;	
		}

		// btn event
		// UPDATE와 DELETE 버튼의 상태 값을 click시 마다 변경합니다. - wdjung
		var _column = airborne.bootstrap.column;
		var self =  this;
		if(mode == _column.MODE_INSERT){
			// update row modal event
			modal_tag_jq.find("button#modal_insert").click(function(e){

				// 입력 전에 입력 값들의 유효성을 검사합니다. 
				for (var key in column_info) {
					var cur_column_obj = column_info[key];
					if(!cur_column_obj.isValid()){
						cur_column_obj.referer_jq.focus();
						return;
					}
				}

				if(delegate_on_event) {
					delegate_on_event._func.apply(delegate_on_event._scope,[_column.MODE_INSERT, column_info]);
					return;
				}

				//modify_btn_type_update
				var modify_btn_type_insert_jq = modal_tag_jq.find("input#modify_btn_type_insert");
				if(modify_btn_type_insert_jq.length == 0){
					console.log("!Error / modal / addModalModifyEvent / modify_btn_type_update_jq.length == 0");
					return;
				}
				//modal_modify_form
				var modal_modify_form_jq = modal_tag_jq.find("form#modal_modify_form");
				if(modal_modify_form_jq.length == 0){
					console.log("!Error / modal / addModalModifyEvent / modal_modify_form_jq.length == 0");
					return;
				}

				modify_btn_type_insert_jq.val("YES");

				// mysql에 영향을 미칠 수 있는 문자들을 html escape 시켜줍니다.
				var input_tag_group_jq = modal_tag_jq.find("input");
				for (var idx = 0; idx < input_tag_group_jq.length; idx++) {
					var input_tag = input_tag_group_jq[idx];
					var raw_value = $(input_tag).val();
					var sql_safe_value = airborne.html.getSQLSafeText(raw_value);
					$(input_tag).val(sql_safe_value);
				}

				modal_modify_form_jq.submit();
			});

		} else if(mode == _column.MODE_UPDATE){
			// update row modal event
			modal_tag_jq.find("button#modal_update").click(function(e){

				if(delegate_on_event) {
					delegate_on_event._func.apply(delegate_on_event._scope,[_column.MODE_UPDATE, column_info]);
					return;
				}

				console.log(">>> delegate_on_event : ",delegate_on_event);
				return;

				//modify_btn_type_update
				var modify_btn_type_update_jq = modal_tag_jq.find("input#modify_btn_type_update");
				if(modify_btn_type_update_jq.length == 0){
					console.log("!Error / modal / addModalModifyEvent / modify_btn_type_update_jq.length == 0");
					return;
				}
				//modal_modify_form
				var modal_modify_form_jq = modal_tag_jq.find("form#modal_modify_form");
				if(modal_modify_form_jq.length == 0){
					console.log("!Error / modal / addModalModifyEvent / modal_modify_form_jq.length == 0");
					return;
				}

				modify_btn_type_update_jq.val("YES");

				// mysql에 영향을 미칠 수 있는 문자들을 html escape 시켜줍니다.
				var input_tag_group_jq = modal_tag_jq.find("input");
				for (var idx = 0; idx < input_tag_group_jq.length; idx++) {
					var input_tag = input_tag_group_jq[idx];
					
					var raw_value = $(input_tag).val();
					var sql_safe_value = airborne.html.getSQLSafeText(raw_value);
					$(input_tag).val(sql_safe_value);
				}
				
				modal_modify_form_jq.submit();
			});
			
			// delete row modal event
			modal_tag_jq.find("button#modal_delete").click(function(e){

				if(delegate_on_event) {
					delegate_on_event._func.apply(delegate_on_event._scope,[_column.MODE_DELETE, column_info]);
					return;
				}

				var modify_btn_type_delete_jq = modal_tag_jq.find("input#modify_btn_type_delete");
				if(modify_btn_type_delete_jq.length == 0){
					console.log("!Error / modal / addModalModifyEvent / modify_btn_type_delete_jq.length == 0");
					return;
				}

				var modal_modify_form_jq = modal_tag_jq.find("form#modal_modify_form");
				if(modal_modify_form_jq.length == 0){
					console.log("!Error / modal / addModalModifyEvent / modal_modify_form_jq.length == 0");
					return;
				}

				modify_btn_type_delete_jq.val("YES");
				
				//console.log(">>> delete row modal event / modal_modify_form_jq.submit();");
				if(confirm("삭제하시겠습니까?")){
					modal_modify_form_jq.submit();
				}
			});
		}

	}	
	,addModalModifyEvent:function(modal_tag_jq, mode, column_info, modifyUrlObj, delegate_on_event){

		if(column_info == null) {
			console.log("addModalModifyEvent / column_info == null");
			return;	
		}

		if(modal_tag_jq == null) {
			console.log("addModalModifyEvent / modal_tag_jq == null");
			return;	
		}

		if(this.isNotValidModifyUrlObj(modifyUrlObj)){
			console.log("addModalModifyEvent / this.isNotValidModifyUrlObj(modifyUrlObj)");
			return;
		}

		// btn event
		var _column = airborne.bootstrap.column;
		var self =  this;
		if(mode == _column.MODE_INSERT){
			// insert row modal event
			modal_tag_jq.find("button#modal_insert").click(function(e){

				if(delegate_on_event) {
					delegate_on_event._func.apply(delegate_on_event._scope,[_column.MODE_INSERT, column_info]);
				} else {
					self.onEventModalBtnClicked.apply(self,[self.getColumnValueInfo(column_info),modifyUrlObj.modal_insert_url, _column.MODE_INSERT]);	
				}

			});
		} else if(mode == _column.MODE_UPDATE){
			// update row modal event
			modal_tag_jq.find("button#modal_update").click(function(e){

				if(delegate_on_event) {
					delegate_on_event._func.apply(delegate_on_event._scope,[_column.MODE_UPDATE, column_info]);
				} else {
					self.onEventModalBtnClicked.apply(self,[self.getColumnValueInfo(column_info),modifyUrlObj.modal_update_url,_column.MODE_UPDATE]);
				}

			});
			// delete row modal event
			modal_tag_jq.find("button#modal_delete").click(function(e){

				if(delegate_on_event) {
					delegate_on_event._func.apply(delegate_on_event._scope,[_column.MODE_DELETE, column_info]);
				} else {
					self.onEventModalBtnClicked.apply(self,[self.getColumnValueInfo(column_info),modifyUrlObj.modal_delete_url,_column.MODE_DELETE]);
				}

			});
		}

	}
	,getColumnValueInfo:function(column_info){		// for insert

		if(column_info == null){
			console.log("drawModalModify / getColumnValueInfo / column_info == null");
		}

		var column_value_info_arr = [];
		for (var key in column_info) {
			var view_column = column_info[key];

			column_value_info_arr.push(view_column.getCheckerObj());
		}

		return column_value_info_arr;
	}
	,addModalUploadEvent:function(modal_tag_jq, mode, column_info){

		var self =  this;
		var _column = airborne.bootstrap.column;
		var _v = airborne.validator;

		if(column_info == null) {
			console.log("addModalUploadEvent / column_info == null");
			return;	
		}

		if(modal_tag_jq == null) {
			console.log("addModalUploadEvent / modal_tag_jq == null");
			return;	
		}

		for (var key in column_info) {
			var cur_column = column_info[key];

			if(cur_column.getType(mode) != _column.COLUMN_TYPE_IMAGE_UPLOAD) continue;

			var image_tag_id = 
				"div#image_container a#<image_id>"
				.replace(/\<image_id\>/gi, cur_column.getKey())
			;

			modal_tag_jq.find(image_tag_id).click(function(e){

				e.preventDefault();

				var upload_id = $(this).attr("id");
				var cur_column = null;
				for (var key in column_info) {
					cur_column = column_info[key];
					if(upload_id == cur_column.getKey()){
						break;
					}
				}
				if(cur_column == null){
					console.log("modal_tag_jq.find(image_tag_id).click / cur_column == null");
					return;
				}
				if(cur_column.modify_info == null){
					console.log("addModalUploadEvent / cur_column.modify_info == null");
					return;
				}
				if(_v.isNotValidArray(cur_column.modify_info.reponse_image_path_attr)){
					console.log("addModalUploadEvent / _v.isNotValidArray(cur_column.modify_info.reponse_image_path_attr)");
					return;

				}
				var reponse_image_path_attr = cur_column.modify_info.reponse_image_path_attr;
				var uploader_container_id = "div#upload_form_container";
				var uploader_container_jq = $(this).siblings(uploader_container_id);
				var upload_success_callback = function(response, upload_manager){

					// receive uploaded image path from upload response delegate
					var uploaded_image_url = null;


					// 유저가 지정한 속성 이름으로 이미지 경로를 가져옵니다. 리턴받는 형태는 json으로 제한합니다. xml 형태는 차후 지원 예정.
					// example : ["result","image_path"] --> 
					var response_obj = $.parseJSON(response);
					if(response_obj == null){
						console.log("addModalUploadEvent / response_obj == null");
						return;
					}

					var response_chain_obj = response_obj;
					
					for (var idx = 0; idx < reponse_image_path_attr.length; idx++) {
						var attr_name = reponse_image_path_attr[idx];
						response_chain_obj = response_chain_obj[attr_name];
						if(response_chain_obj == null){
							console.log("addModalUploadEvent / response_chain_obj == null / attr_name : ",attr_name);
							return;
						}
					};
					if(_v.isNotValidStr(response_chain_obj)){
						console.log("addModalUploadEvent / _v.isNotValidStr(response_chain_obj) / response_chain_obj : ",response_chain_obj);
						return;
					}
					uploaded_image_url = response_chain_obj;
					upload_manager.setImagePath(uploaded_image_url);

					// replace image url
					if(upload_manager != null){
						upload_manager.remove();	
					}
				}

				var upload_fail_callback = function(response, upload_manager){
					// alert user and let user do it again.
					console.log("addModalUploadEvent / upload_fail_callback / response : ",response);
				}
				
				
				var image_anchor_tag_jq = $(this);
				var image_tag_jq = $(image_anchor_tag_jq.find("img")[0]);
				var image_path_input_tag_jq = $(image_anchor_tag_jq.find("input")[0]);
				
				var file_meta_info_obj = null;
				if(cur_column.modify_info != null && cur_column.modify_info.file_meta_info_obj != null ){
					file_meta_info_obj = cur_column.modify_info.file_meta_info_obj;
				}

				var upload_manager = 
				self.drawModalUploadSimple(
					cur_column
					, uploader_container_jq
					, upload_success_callback
					, upload_fail_callback
					, this
					, image_anchor_tag_jq
					, image_tag_jq
					, image_path_input_tag_jq
					, file_meta_info_obj
				);
			});
		}
	}
	,drawModalUploadSimple:function(column_bean, uploader_container_jq, upload_success_callback, upload_fail_callback, scope, image_anchor_tag_jq, image_tag_jq, image_path_input_tag_jq, file_meta_info_obj){
		
		if(uploader_container_jq == null) {
			console.log("drawModalUploadSimple / uploader_container_jq == null");
			return;	
		}
		if(column_bean == null) {
			console.log("drawModalUploadSimple / column_bean == null");
			return;	
		}
		if(upload_success_callback == null) {
			console.log("drawModalUploadSimple / upload_success_callback == null");
			return;	
		}

		var upload_manager = 
		airborne.ajax.uploadFile(	
			uploader_container_jq								// form parent div tag
			,column_bean.modify_info.upload_url   				// upload page url
			,airborne.ajax.UPLOAD_FILE_DEFAULT_ID				// upload file id 	/	"userfile"
			,airborne.ajax.UPLOAD_FILE_MIN_SIZE					// upload max file size / 200kb
			,airborne.ajax.getUploadFileTypeImage(
				column_bean.getKey()
				, column_bean.modify_info.default_image_path
				, column_bean.modify_info.image_path
				, column_bean.modify_info.image_width
				, column_bean.modify_info.image_height
				, image_anchor_tag_jq
				, image_tag_jq
				, image_path_input_tag_jq
				, file_meta_info_obj
			)
		);

		upload_manager.setCallbackOnCompleted(upload_success_callback, scope);
		upload_manager.setCallbackOnFailed(upload_fail_callback, scope);

		return upload_manager;
	}
	,onEventModalBtnClicked:function(column_value_info_arr, modify_url, mode){

		var isValid = false;
		var param_obj = {};
		for (var idx = 0; idx < column_value_info_arr.length; idx++) {

			var field_bean = column_value_info_arr[idx];

			var isNotValid = !field_bean.is_valid.apply(field_bean.is_valid_scope,[]);
			if(isNotValid){
				console.log("addEventModalInsertRowBtnOnClicked / param is not valid!");
				field_bean.referer_jq.focus();
				return;
			}

			param_obj[field_bean.key] = (field_bean.value==null)?"":field_bean.value;
		};

		// 1. draw form and send data

		// 2. using ajax
		/*
		airborne.ajax.send_simple(
			//	url
			modify_url
			//	param	
			,param_obj
			//	callback scope
			,this
			//	is post
			,true
		);
		*/
	}
}