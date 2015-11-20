// TODO show a little part of long text and show whole text when cursor is over.
airborne.bootstrap.table_manager = {
	// @required
	template_name:"airborne.bootstrap.table_manager"
	// @required
	,getTemplateName:function(){
		return this.template_name;
	}
	// @required
	,getErrLogger:function(){
		return airborne.error.getLogger(this.getTemplateName());
	}
	,sendErrLog:function(obj_name, err_msg){
		var err_logger = this.getErrLogger();
		if(err_logger != null && airborne.validator.isValidStr(obj_name) && airborne.validator.isValidStr(err_msg)){
			err_logger.setObjName(obj_name);
			err_logger.print(err_msg);
		}
	}
	,getFieldType_Text_Bean:function(column_info, raw_value, mode){ // TODO be to split into number, currency, and the other formats.
		
		// @required
		var _column = airborne.bootstrap.column;
		
		var bean_obj = 
		{
			id:column_info.id
			, mode:this.MODE_SELECT
			, setMode:function(mode){
				if(_column.isValidMode(mode)){
					this.mode = mode;
					this.cur_type = this.column_info.type[mode];
					if(this.column_info!=null && this.column_info.value!=null){
						this.cur_value = this.column_info.value[mode];	
					}
				}
			}
			, column_info:column_info
			, cur_type:column_info.type[mode]
			, cur_value:raw_value
			, referer_jq:null
			, getKey:function(){
				return this.id.key;
			}
			, getValue:function(){
				if( this.referer_jq != null && 
					this.id != null && 
					this.value.getModifyValue != null ){
						return this.value.getModifyValue(this.referer_jq, this.id);
				}
				return this.cur_value;
			}
		};
		return bean_obj;
	}
	,getFieldType_Image_Bean_Dynamic_Value:function(column_info, image_path, mode){

		var bean = 
		this.getFieldType_Image_Bean(
			column_info
			, column_info.modify_info.upload_container_id	//, value_obj.upload_container_id
			, column_info.modify_info.upload_url 			//, value_obj.upload_url
			, column_info.modify_info.default_image_path 	//, value_obj.default_image_path
			, image_path									//, value_obj.image_path
			, column_info.modify_info.image_width
			, column_info.modify_info.image_height
		);
		bean.setMode(mode);

		return bean;
	}
	,getFieldType_Image_Bean:function(column_info, upload_container_id, upload_url, default_image_path, image_path, image_width, image_height){
		var bean = 
		{	
			id:column_info.id
			, mode:this.MODE_SELECT
			, setMode:function(mode){
				
				var _column = airborne.bootstrap.column;
				if(_column.isValidMode(mode)){
					this.mode = mode;
					this.cur_type = this.column_info.type[mode];
					this.cur_value = this.getValue();
				}
			}
			, column_info:column_info
			, cur_type:column_info.type.select
			//, type:type
			, image_info:{
				image_path:(image_path!=null)?image_path:""
				, image_path_empty:"Empty"
				, default_image_path:(default_image_path!=null)?default_image_path:""
				, image_width:image_width
				, image_height:image_height
			}
			, is_empty_image:function(){
				console.log("is_empty_image / this.image_info.image_path : ",this.image_info.image_path);
				return airborne.validator.isNotValidStr(this.image_info.image_path);
			}
			, cur_value:image_path
			, referer_jq:null
			, getKey:function(){
				return this.id.key;
			}
			, getValue:function(){
				if( this.referer_jq != null && 
					this.id != null && 
					this.value.getModifyValue != null ){
						return this.value.getModifyValue(this.referer_jq, this.id);
				}
				return this.cur_value;
			}
		};
		return bean;
	}
	,getParamFromRow:function(column_info){
		var param_obj = null;

		var _v = airborne.validator;
		if(column_info == null){
			console.log("getParamFromRow / column_info == null");
			return param_obj;
		}


		for (var key in column_info) {
			var cur_column = column_info[key];
			if(cur_column == null){
				console.log("getParamFromRow / cur_column == null");
				return param_obj;
			}

			// convert data to param
			var cur_column_key = cur_column.getKey();
			var cur_column_value = cur_column.getValue();

			if(param_obj == null) param_obj={};
			param_obj[cur_column_key] = cur_column_value;
			
		}

		return param_obj;	//{ page : 1, size : 2 }
	}
	,getTableInfoArray:function(column_info, select_result_json_array, mode){

		
		// select_result_json_array : sample format
		/*
		[
			{
				id: "16"
				,image_path: ""
				,release_date: "2014-04-15"
				,status: "A"
				,title: "Beautiful Life"		
			}
			,...
		]
		*/

		// 조회하는 테이블 정보를 column_info와 조합해 field_bean을 생성합니다.
		// field_bean은 이미지와 텍스트 타입을 지원합니다.
		
		if(column_info == null){
			console.log("!Error! / airborne.view.table / getTableInfoArray / column_info == null");
			return null;
		}
		
		var _v = airborne.validator;
		var table_info_array = [];
		
		for (var idx = 0; idx < select_result_json_array.length;idx++) {
			var result_json = select_result_json_array[idx];

			var row_value_array = [];
			for (var key in result_json) {

				var raw_value = result_json[key];
				
				// 사용자가 넘긴 오브젝트의 모든 속성을 중에 column_info에 정의된 속성만 사용합니다.
				var field_bean = this.getFieldBean(column_info, key, raw_value, mode);
				if(field_bean == null) {
					//console.log("!Warning! / airborne.view.table / getTableInfoArray / column_bean == null / key : ",key);
					continue;	
				}
				
				row_value_array.push(field_bean);
			}
			table_info_array.push(row_value_array);
		};

		return table_info_array;
	}
	,getFieldBean:function(column_info, key, raw_value, mode){
		
		if(column_info == null){
			console.log("!Error! / airborne.view.table / getFieldBean / column_info == null");
			return null;
		}
		if(mode == null){
			console.log("!Error! / airborne.view.table / getFieldBean / mode == null");
			return null;
		}


		// set column_info
		var my_column_info = null;
		for (var c_i_key in column_info){
			var cur_column_info = column_info[c_i_key];

			if(	cur_column_info != null && 
				cur_column_info.id != null && 
				cur_column_info.id.query != null && 
				cur_column_info.id.query == key ){
				my_column_info = cur_column_info;
				break;
			}
		}

		if(my_column_info == null){
			//console.log("getFieldBean / my_column_info is null! / key : ",key);
			return null;
		}
		var column_type = my_column_info.type[mode];
		var _column = airborne.bootstrap.column;
		if(!_column.isValidColumnType(column_type)){
			//console.log("getFieldBean / !_tm.isValidColumnType(column_type)");
			return null;
		}

		var field_bean = null;
		if(column_type == _column.COLUMN_TYPE_IMAGE || column_type == _column.COLUMN_TYPE_IMAGE_UPLOAD){
			field_bean = this.getFieldType_Image_Bean_Dynamic_Value( my_column_info, raw_value, mode );
		} else if(column_type == _column.COLUMN_TYPE_NOT_EXIST){
			return null;
		} else {
			field_bean = this.getFieldType_Text_Bean( my_column_info, raw_value, mode );
		}

		return field_bean;
	}	
	,getObj:function(table_name, modal_update_url, delegate_column_info){
		var obj = {
			// @required
			name:null
			// @required
			,getName:function(){
				if(this.name == null) return "";
				return this.name;
			}
			// @required
			,setName:function(name){
				if(airborne.validator.isNotValidStr(name)) return;
				this.name = name;
			}
			// @require
			,sendErrLog:function(msg){
				if(airborne.validator.isNotValidStr(msg)) return;
				airborne.bootstrap.table_manager.sendErrLog(this.getName(), msg);
			}
			// @optional
			,isVisibleRemoveBtn:false
			,showRemoveBtn:function(){
				this.isVisibleRemoveBtn = true;
			}
			,remove:function(){
				this.parent_jq_obj.remove();
			}
			,getId:function(){
				if(this.name == null) return "";
				return this.name.replace(/\s/gi,"_");
			}
			// @required
			,delegate_get_column_info:delegate_column_info
			,column_info:null
			,setColunmInfo:function(column_info){
				this.column_info = column_info;
			}
			,getColumnInfo:function(selected_row_data){
				
				var _obj = airborne.bootstrap.obj;
				if(_obj == null){
					console.log("!Error! / airborne.view.table / getColumnInfo / _obj == null");
					return;
				}
				
				if(_obj.isNotValidDelegate(this.delegate_get_column_info)){
					console.log("!Error! / airborne.view.table / getColumnInfo / _obj.isNotValidDelegate(this.delegate_get_column_info)");
					return;
				}
				
				return this.delegate_get_column_info._func.apply(this.delegate_get_column_info._scope,[selected_row_data]);
			}
			,hasInsertModal:function(){
				var column_info = this.getColumnInfo();
				var hasInsert = false;
				for (var key in column_info) {
					var view_column = column_info[key];

					if(view_column.hasInsertModal()){
						hasInsert = true;
						break;
					}
				}
				return  hasInsert;
			}
			,hasUpdateModal:function(){
				var column_info = this.getColumnInfo();
				var hasUpdate = false;
				for (var key in column_info) {
					var view_column = column_info[key];

					if(view_column.hasUpdateModal()){
						hasUpdate = true;
						break;
					}
				}
				return  hasUpdate;
			}
			,parent_jq_obj:null
			,init:function(table_name, modal_update_url){

				var _v = airborne.validator;
				var _o = airborne.bootstrap.obj;

				if(_v.isNotValidStr(table_name)){
					console.log("!Error! / airborne.view.table / getObj / init / _v.isNotValidStr(table_name)");
					return;
				}
				this.setName(table_name);// @required
				
				if(_v.isNotValidStr(modal_update_url)){
					console.log("!Error! / airborne.view.table / getObj / init / _v.isNotValidStr(modal_update_url)");
					return;
				}
				this.setModalUpdateUrl(modal_update_url);

				this.parent_jq_obj = _o.getContainer(table_name);
				if(this.parent_jq_obj == null){
					console.log("table manager / init / list_parent_obj == null");
				}

				return this;
			}
			,table_info_array:null
			,wrapTablePanelTag:function(contents){

				var _v = airborne.validator;
				var _tm = airborne.bootstrap.table_manager;

				// draw header
				// set title and add btn
				var table_tag = "<div class=\"container theme-showcase\" role=\"main\">";
				table_tag += 	"<div class=\"panel panel-default\">";
				table_tag +=	"<div class=\"panel-heading\">";
				
				table_tag +=	"<table id=\"title_container_table\" style=\"width:100%\"><tbody><tr><td style=\"text-align:left;\">";
				table_tag +=	"<h3 class=\"panel-title\"><strong><table_name></strong></h3>".replace(/\<table_name\>/gi, this.getName());
				table_tag +=	"</td><td style=\"text-align:right;\">";

				// draw Insert Btn
				var column_info = this.getColumnInfo();
				var hasInsertModal = true;
				for (var key in column_info) {
					var field_column_info = column_info[key];
					var insert_type = field_column_info.getType(_column.MODE_INSERT);

					if(insert_type == _column.COLUMN_TYPE_NO_INSERT){
						hasInsertModal = false;
						break;
					}
				}
				if(hasInsertModal){
					// set add btn
					// @requied / modal setting
					table_tag +=	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					table_tag +=	"<button id=\"add_row\" type=\"button\" class=\"btn btn-sm btn-primary\">";
					table_tag +=	"<span class=\"glyphicon glyphicon-plus\"></span>&nbsp;NEW";
					table_tag +=	"</button>";
				}

				if(this.isVisibleRemoveBtn){
					// close panel btn
					table_tag +=	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
					table_tag +=	"<button id=\"remove_panel\" type=\"button\" class=\"btn btn-sm btn-default pull-right\">";
					table_tag +=	"&nbsp;<span class=\"glyphicon glyphicon-remove\"></span>&nbsp;";
					table_tag +=	"</button>";
				}
				
				// @ Default - 테이블 접기 버튼
				table_tag +=	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				table_tag +=	"<button id=\"folder_open_n_close\" type=\"button\" class=\"btn btn-sm btn-default\">";
				table_tag +=	"<span class=\"glyphicon glyphicon-folder-open\"></span>&nbsp;";
				table_tag +=	"</button>";
				
				table_tag +=	"</td></tr></tbody></table>";
				table_tag +=	"</div>";


				// draw contents
				table_tag += contents;



				// draw footer
				table_tag += "</div></div>";

				return table_tag;
			}
			,drawVerticalTable:function(result_json_array){

				// row and thumbnail label
				var _v = airborne.validator;
				var _tm = airborne.bootstrap.table_manager;
				var _column = airborne.bootstrap.column;
				if( this.parent_jq_obj == null ){
					console.log("drawVerticalTable / this.parent_jq_obj == null");
					return;
				}

				var column_info = this.getColumnInfo();

				this.table_info_array = _tm.getTableInfoArray(column_info, result_json_array, _column.MODE_SELECT);
				var table_tag = "";






				// contents
				table_tag +="<div class=\"table-responsive\">";
				table_tag +="<table id=\"content_table\" class=\"table table-bordered table-striped\">";

				// set column names
				var column_info = this.getColumnInfo();
				var table_row_data = this.table_info_array[0];

				// contents - set title
				row_cnt = 0;
				table_tag += "<tbody>";
				for (var key in column_info) {
					if(column_info[key].type[_column.MODE_SELECT] == _column.COLUMN_TYPE_HIDDEN) continue;

					var view_column = column_info[key].id.view;
					// contents - key and value
					
					for(var innerIdx = 0; innerIdx < table_row_data.length;innerIdx++){
						var field_bean = table_row_data[innerIdx];
						var field_bean_key = field_bean.column_info.getKey();
						var field_bean_type = field_bean.column_info.getType(_column.MODE_SELECT);

						if(	field_bean_key != key || 
							field_bean_type == _column.COLUMN_TYPE_HIDDEN ||
							field_bean_type == _column.COLUMN_TYPE_NOT_EXIST
						) continue;

						var tag = _column.drawColumnTag(field_bean.column_info, field_bean.cur_value, _column.MODE_SELECT);

						table_tag += 	"<tr>";
						table_tag += 		"<th class=\"col-md-2\" id=\"<column_key>\" style=\"text-align:left;\"><column_name></th>"
											.replace(/\<column_key\>/gi, field_bean.column_info.id.key)
											.replace(/\<column_name\>/gi, field_bean.column_info.id.view);
						table_tag += 		"<td><field_value></td>"
											.replace(/\<field_value\>/gi, tag);
						table_tag += 	"</tr>";
						
						row_cnt++;
						
						break;
					}

				}
				table_tag += "</tbody></table></div>";

				table_tag = this.wrapTablePanelTag(table_tag);
				this.parent_jq_obj.append(table_tag);
			}
			,drawThumbnailLabelTable:function(result_json_array, column_cnt){

				console.log("drawThumbnailLabelTable / result_json_array : ",result_json_array);

				// row and thumbnail label
				var _v = airborne.validator;
				var _tm = airborne.bootstrap.table_manager;
				var _column = airborne.bootstrap.column;
				var _modal = airborne.bootstrap.modal;
				if( this.parent_jq_obj == null ){
					console.log("drawThumbnailLabelTable / this.parent_jq_obj == null");
					return;
				}
				if(_v.isNotNumber(column_cnt) || column_cnt == 0){
					console.log("drawThumbnailLabelTable / _v.isNotNumber(column_cnt)");
					return;
				}
				var table_tag = "";




			
				var result_row_cnt = result_json_array.length;
				var rows = 0;
				if(result_row_cnt > 0){
					rows = result_row_cnt/column_cnt;
				}
				var column_info = this.getColumnInfo();
				this.table_info_array = _tm.getTableInfoArray(column_info, result_json_array, _column.MODE_SELECT);

				table_tag += "<br/>";
				var row_result = null;
				
				for (var idx = 0; idx < rows; idx++) {

					table_tag += "<div class=\"row\" style=\"margin-left:0px;margin-right:0px;\">";	// div row begins
					for (var thumb_idx = 0; thumb_idx < column_cnt; thumb_idx++) {

						var row_idx = (idx * column_cnt) + thumb_idx;
						var table_row_data = this.table_info_array[row_idx];
						if(table_row_data == null) {
							continue;
						}

						// col-md-2 (5)
						// col-md-3 (4)
						// col-md-4 (3)
						// col-md-6 (2)
						var column_cnt_class = "col-md-3";
						if(column_cnt > 4){
							column_cnt_class = "col-md-2";
						} else if(column_cnt == 4){
							column_cnt_class = "col-md-3";
						} else if(column_cnt == 3){
							column_cnt_class = "col-md-4";
						} else if(column_cnt < 3){
							column_cnt_class = "col-md-6";
						}

						table_tag += "<div class=\"col-sm-6 <column_cnt_class>\">"
							.replace(/\<column_cnt_class\>/gi, column_cnt_class)
						; // col-md 78px

						// thumbnail label begins
						// @requied / modal setting
						table_tag += "<div id=\"<table_id>\" class=\"thumbnail\" style=\"background-color:#E9E9E9;\" row-data-idx=\"<row_data_idx>\">"
							.replace(/\<table_id\>/gi, this.getId())
							.replace(/\<row_data_idx\>/gi, row_idx)
						;

						for (var key in column_info) {
							for(var innerIdx = 0; innerIdx < table_row_data.length;innerIdx++){
								var field_bean = table_row_data[innerIdx];
								var field_bean_key = field_bean.column_info.getKey();
								var field_bean_type = field_bean.column_info.getType(_column.MODE_SELECT);

								if(	field_bean_key != key || 
									field_bean_type == _column.COLUMN_TYPE_HIDDEN ||
									field_bean_type == _column.COLUMN_TYPE_NOT_EXIST
								) continue;


								var tag = "";
								tag += "<div class=\"caption\">";
								if(field_bean_type == _column.COLUMN_TYPE_IMAGE){
									tag += "<abbr style=\"border-bottom:0px;\" title=\"<abbr>\"><value></abbr>"
											.replace(/\<abbr\>/gi, field_bean.column_info.id.view)
											.replace(/\<value\>/gi, _column.drawColumnTag(field_bean.column_info, field_bean.cur_value, _column.MODE_SELECT));
									;

								} else {
									tag += "<pre style=\"margin:0 0 0px;background-color:#F8F8F8;\">";
									tag += "<code data-toggle=\"tooltip\" data-placement=\"top\" title=\"Tooltip on top\">";
									tag += "<abbr style=\"border-bottom:0px;\" title=\"<abbr>\"><p class=\"text-center\" style=\"margin:0 0 0px;\"><value></p></abbr>"
											.replace(/\<abbr\>/gi, field_bean.column_info.id.view)
											.replace(/\<value\>/gi, _column.drawColumnTag(field_bean.column_info, field_bean.cur_value, _column.MODE_SELECT));
									;
									tag += "</code></pre>";
								}
								tag += "</div>";


		                        table_tag += tag
								break;
							}
						}

          				// thumbnail label ends
        				table_tag += "</div>";
						table_tag += "</div>";
					}
					if(row_result == null) break;

					table_tag += "</div>"; // div row ends
				};
				table_tag = this.wrapTablePanelTag(table_tag);
				this.parent_jq_obj.append(table_tag);



				// set image center align
				var img_anchor_jq_arr = this.parent_jq_obj.find("div#" + this.getId() + " div#image_container" + " a");
				for (var idx = 0; idx < img_anchor_jq_arr.length; idx++){
					var img_anchor_jq = $(img_anchor_jq_arr[idx]);
					img_anchor_jq.removeClass("pull-left").addClass("center-block");
				}

				this.addEventOnThumbnailLabelClicked();

			}
			,addEventOnThumbnailLabelClicked:function(){

				if(this.parent_jq_obj == null) return;

				var self = this;
				var _tm = airborne.bootstrap.table_manager;
				var _v = airborne.validator;
				
				// when table row clicked
				this.parent_jq_obj.find("div#<table_id>.thumbnail".replace(/\<table_id\>/, this.getId())).click(function(){
					
					// draw update modal
					var selected_row_idx = $(this).attr("row-data-idx");
					var selected_row_data = self.table_info_array[selected_row_idx];

					// when select result is nothing.
					if(_v.isNotValidArray(self.table_info_array)) return;

					// set mode_update
					for (var idx = 0; idx < selected_row_data.length; idx++) {
						var field_bean = selected_row_data[idx];
						field_bean.setMode(_column.MODE_UPDATE);
					};

					if(	self.delegate_row_clicked != null && 
						self.delegate_row_clicked.func != null && 
						self.delegate_row_clicked.scope != null	){

						self.delegate_row_clicked.func.apply(self.delegate_row_clicked.scope,[selected_row_data]);
					} else {
						self.drawModalModify.apply(self,[_column.MODE_UPDATE, selected_row_data, self.modal_update_url]);	
					}
				});

				// TODO refactoring - wdjung
				// 'NEW' btn click event
				if(this.hasInsertModal()){
					this.parent_jq_obj.find("button#add_row").click(function(){
						self.drawModalModify(_column.MODE_INSERT, null, self.modal_update_url);
					});
				}

				// 'X' btn click event
				if(this.isVisibleRemoveBtn){
					this.parent_jq_obj.find("button#remove_panel").click(function(){
						self.remove();
					});
				}
			}
			,getTableRowWidthAVG:function(row_cnt){
				var row_width=100;
				if(row_cnt > 0){
					row_width = Math.round(row_width/row_cnt);
				}
				return row_width;		
			}
			// Custom UI - Default Table
			,drawTable:function(result_json_array){

				var _v = airborne.validator;
				var _tm = airborne.bootstrap.table_manager;
				var _column = airborne.bootstrap.column;
				var _modal = airborne.bootstrap.modal;
				if( this.parent_jq_obj == null ){
					console.log("drawTable / this.parent_jq_obj == null");
					return;
				}
				var table_tag = "";


				// set table
				table_tag +=	"<table id=\"content_table\" class=\"table table-striped\">";
				table_tag +=	"<thead><tr>";

				// set column names
				var column_info = this.getColumnInfo();
				var row_cnt = 0;
				for (var key in column_info) {
					if(column_info[key].type[_column.MODE_SELECT] == _column.COLUMN_TYPE_HIDDEN) continue;

					var view_column = column_info[key].id.view;
					table_tag += "<th style=\"width:<row_width>%;\"><column_name></th>".replace(/\<column_name\>/gi, view_column);
					
					row_cnt++;
				}
				
				table_tag += "</tr></thead>";
				table_tag += "<tbody>";
				
				var row_width = this.getTableRowWidthAVG(row_cnt);
				table_tag = table_tag.replace(/\<row_width\>/gi, row_width);
				
				
				this.table_info_array = _tm.getTableInfoArray(column_info, result_json_array, _column.MODE_SELECT);
				
				if(this.table_info_array == null || this.table_info_array.length == 0){
					// @requied / modal setting
					table_tag += 
					"<tr id=\"<table_id>\">"
					.replace(/\<table_id\>/gi, this.getId())
					;

					for (var key in column_info) {

						var cur_column = column_info[key];
						if(cur_column.isHidden(_column.MODE_SELECT)) continue;

						var default_value = cur_column.getDefaultValueOnNoResult();

                        table_tag += 	
                        "<td style=\"vertical-align:middle;text-align:left;\" id=\"<column_name>\"><column_value></td>"
						.replace(/\<column_name\>/gi, cur_column.getKey())
						.replace(/\<column_value\>/gi, (default_value==null)?"Empty":default_value);
					}

					table_tag += "</tr>";

				} else {
					//console.log("draw table.");
					for(var outterIdx = 0; outterIdx < this.table_info_array.length;outterIdx++){
						var table_row_data = this.table_info_array[outterIdx];
						if(table_row_data == null) continue;

						table_tag += 
						"<tr id=\"<table_id>\" row-data-idx=\"<row_data_idx>\">"
						.replace(/\<table_id\>/gi, this.getId())
						.replace(/\<row_data_idx\>/gi, outterIdx)
						;

						// follow colume info order
						for (var key in column_info) {
							for(var innerIdx = 0; innerIdx < table_row_data.length;innerIdx++){
								var field_bean = table_row_data[innerIdx];
								var field_bean_key = field_bean.column_info.getKey();
								var field_bean_type = field_bean.column_info.getType(_column.MODE_SELECT);

								if(	field_bean_key != key || 
									field_bean_type == _column.COLUMN_TYPE_HIDDEN ||
									field_bean_type == _column.COLUMN_TYPE_NOT_EXIST
								) continue;

								var tag = _column.drawColumnTag(field_bean.column_info, field_bean.cur_value, _column.MODE_SELECT);
								
		                        table_tag += 	
		                        "<td style=\"vertical-align:middle;text-align:left;\" id=\"<column_name>\"><field_value></td>"
								.replace(/\<column_name\>/gi, field_bean.column_info.id.key)
								.replace(/\<field_value\>/gi, tag);

								break;
							}
						}

						table_tag += "</tr>";
					}

				}

                table_tag += "</tbody></table>";
                table_tag = this.wrapTablePanelTag(table_tag);


				this.parent_jq_obj.append(table_tag);
				this.addEventOnRowClicked();
				
				return this;
			}
			,delegate_row_clicked:null//{func:$func,scope:$scope}
			,addEventOnRowClicked:function(){

				if(this.parent_jq_obj == null) return;

				var self = this;
				var _tm = airborne.bootstrap.table_manager;
				var _v = airborne.validator;
				
				// when table row clicked
				this.parent_jq_obj.find("tr#<table_id>".replace(/\<table_id\>/, this.getId())).click(function(e){
					
					// draw update modal
					var selected_row_idx = $(this).attr("row-data-idx");
					var selected_row_data = self.table_info_array[selected_row_idx];

					// when select result is nothing.
					if(_v.isNotValidArray(self.table_info_array)) return;

					// set mode_update
					var selected_row_key_value_obj = {};
					for (var idx = 0; idx < selected_row_data.length; idx++) {
						var field_bean = selected_row_data[idx];	// REMOVE ME?
						field_bean.setMode(_column.MODE_UPDATE);		// REMOVE ME?
						
						selected_row_key_value_obj[field_bean.getKey()] = field_bean.getValue(); 
					};
					
					if(	self.delegate_row_clicked != null && 
						self.delegate_row_clicked.func != null && 
						self.delegate_row_clicked.scope != null	){
						
						// 테이블의 줄을 클릭할 때의 델리게이트가 있다면 그것을 먼저 실행합니다.
						self.delegate_row_clicked.func.apply(self.delegate_row_clicked.scope,[selected_row_data]);
						
					} else {
						
						// wdjung - convert key, value map list
						// 테이블의 줄을 클릭할 때의 델리게이트가 없다면 업데이트 모달 윈도우를 보여줍니다.
						self.drawModalModify.apply(self,[_column.MODE_UPDATE, selected_row_key_value_obj, self.modal_update_url]);
						
					}
				});

				// TODO refactoring - wdjung
				// 'NEW' btn click event
				if(this.hasInsertModal()){
					this.parent_jq_obj.find("button#add_row").click(function(){
						self.drawModalModify(_column.MODE_INSERT, null, self.modal_update_url);
					});
				}

				// 'X' btn click event
				if(this.isVisibleRemoveBtn){
					this.parent_jq_obj.find("button#remove_panel").click(function(){
						self.remove();
					});
				}
				
				// 'folder-open-n-close' btn click event
				var _self = this;
				this.parent_jq_obj.find("button#folder_open_n_close").click(function(e){
					e.preventDefault();
					
					if(_self.isShowTable()){
						_self.hideTable();
					} else {
						_self.showTable();
					}
				});
			}
			,content_table_jq:null
			,showTable:function(){
				if(this.content_table_jq == null){
					this.content_table_jq = this.parent_jq_obj.find("table#content_table");
				}
				if(this.content_table_jq.length > 0){
					this.content_table_jq.show();
				}
			}
			,hideTable:function(){
				if(this.content_table_jq == null){
					this.content_table_jq = this.parent_jq_obj.find("table#content_table");
				}
				if(this.content_table_jq.length > 0){
					this.content_table_jq.hide();
				}
			}
			,isShowTable:function(){
				if(this.content_table_jq == null){
					this.content_table_jq = this.parent_jq_obj.find("table#content_table");
				}
				if(this.content_table_jq.length > 0){
					return this.content_table_jq.is(":visible");
				} else {
					return false;
				}
				
			}
			,drawModalModify:function(mode, selected_row_data, modal_update_url){
				
				var _v = airborne.validator;
				var _modal = airborne.bootstrap.modal;
				if(_modal == null){
					console.log("!Error! / airborne.view.table / drawModalModify / _modal == null");
					return;
				}
				
				var column_info = this.getColumnInfo(selected_row_data);
				if(column_info == null){
					console.log("!Error! / airborne.view.table / drawModalModify / column_info == null");
					return;
				}
				if(this.parent_jq_obj == null){
					console.log("!Error! / airborne.view.table / drawModalModify / this.parent_jq_obj == null");
					return;
				}
				if(_v.isNotValidStr(modal_update_url)){
					console.log("!Error! / airborne.view.table / drawModalModify / _v.isNotValidStr(modal_update_url)");
					return;
				}
				
				var modal_parent_jq_obj = $('body');
				_modal.drawModalModify(	
					modal_parent_jq_obj // wdjung
					, mode
					, column_info
					, selected_row_data
					, _modal.getFormActionUrlObj( // wdjung
						modal_update_url
					)
					// Modal Title
					,this.getName()
				);
			}
			,upload_fail_callback:function(response_str){
				console.log("upload_fail_callback / response_str : ",response_str);
			}
			,addEventModalOnChanged:function(callback, scope){
				if(callback == null){
					this.sendErrLog("addEventModalInputOnChanged/callback");
					return;
				}
				if(scope == null){
					this.sendErrLog("addEventModalInputOnChanged/scope");
					return;
				}

				var column_info = this.getColumnInfo();
				for (var key in column_info) {
					var cur_column = column_info[key];

					cur_column.setCallbackOnChange(callback, scope);
				}

			}
			,isValidParam:null
			,setIsValidParam:function(isValidParam){
				this.isValidParam = isValidParam;

				var column_info = this.getColumnInfo();
				if(column_info == null){
					console.log("setIsValidParam / column_info == null");
					return;
				}

				// add onchange event
				for (var key in column_info) {
					var cur_column = column_info[key];

					cur_column.setCallbackOnChange(isValidParam, this);
				}
			}
			,getFieldBeanValueInfo:function(selected_row_data){ // for update, delete
				var column_value_info_arr = [];

				for (var idx = 0; idx < selected_row_data.length; idx++) {
					var field_bean = selected_row_data[idx];

					var cur_value = field_bean.column_info.getValue();
					if(cur_value == null){
						cur_value = field_bean.getValue();
					}
					if(cur_value == null){
						cur_value = "";
					}

					column_value_info_arr.push({key:field_bean.getKey(),value:cur_value});
				};

				return column_value_info_arr;
			}
			,modal_update_url:null
			,setModalUpdateUrl:function(modal_update_url){
				this.modal_update_url = modal_update_url;
			}
			// @ Show and Hide
			,hideAddRowBtn:function(){
				if(this.parent_jq_obj == null){
					console.log("!Error! / airborne.view.table / hideAddRowBtn / this.parent_jq_obj == null");
					return;
				}
				
				var btn_jq = this.parent_jq_obj.find("button#add_row");
				if(btn_jq == null || btn_jq.length == 0){
					console.log("!Error! / airborne.view.table / hideAddRowBtn / btn_jq.length == 0");
					return;
				}
				
				btn_jq.hide();
			}
			// @ add extra btn after 'NEW' btn and delegate functions
			,addExtraBtn:function(){
				
			}
		} // end of defining obj


		var table_obj = null;
		if(airborne.validator.isValidStr(table_name)){
			table_obj = obj.init(table_name, modal_update_url);
		} else {
			table_obj = obj;
		}

		return table_obj;
	} // end of getObj
}