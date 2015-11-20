
// 테이블 구조를 다른 컴포넌트에서 사용하는 경우가 많아 컬럼 기능을 독립적으로 만듭니다.
// airborne.bootstrap.column.getObj
// airborne.bootstrap.column.isValidMode
airborne.bootstrap.column = {
	MODE_SELECT:"select"
	,MODE_UPDATE:"update"
	,MODE_DELETE:"delete"
	,MODE_INSERT:"insert"
	,COLUMN_TYPE_TEXT:"column_type_text"
	,COLUMN_TYPE_INPUT:"column_type_input"
	,COLUMN_TYPE_INPUT_DISABLED:"column_type_input_disabled"
	,COLUMN_TYPE_SELECT:"column_type_select"
	,COLUMN_TYPE_SELECT_KEY:"__key"
	,COLUMN_TYPE_SELECT_VALUE:"__value"
	,COLUMN_TYPE_IMAGE:"column_type_image"
	,COLUMN_TYPE_IMAGE_UPLOAD:"column_type_image_upload"
	,COLUMN_TYPE_HIDDEN:"column_type_hidden"
	,COLUMN_TYPE_NO_INSERT:"column_type_no_insert"
	,COLUMN_TYPE_NO_UPDATE:"column_type_no_update"
	,COLUMN_TYPE_NOT_EXIST:"column_type_not_exist"
	,getColumnInputStrMobilePhoneNumberCheckerObj:function(mobile_phone_number_type, warning_msg, member_mobile_list){
		// 010-4613-5949 format
		var _v = airborne.validator;
		var check_func = function(phone_number_value, condition){//condition_checker_func.referer_jq
			if(_v.isNotValidStr(phone_number_value)) {
				if(confirm(warning_msg)){
					return false;
				}
			}

			var is_valid = airborne.phone.isValidMobilePhoneNumber(phone_number_value, mobile_phone_number_type);
			if(!is_valid){
				if(confirm(warning_msg)){
					return false;
				}
				return true;
			}

			phone_number_value = airborne.phone.getFormattedMobilePhoneNumber(phone_number_value, mobile_phone_number_type);
			if(_v.isValidStr(phone_number_value) && condition!= null && condition.referer_jq!=null){
				condition.referer_jq.val(phone_number_value);
			}

			// check phone number is unique
			if(_v.isValidArray(member_mobile_list)){
				for(var idx=0;idx < member_mobile_list.length;idx++){
					var member_mobile_number = member_mobile_list[idx];

					var warning_msg = phone_number_value + " is already taken.";
					if(member_mobile_number == phone_number_value && confirm(warning_msg)){
						return false;
					}
				}
			}

			return true;
		};
		return {check_func:check_func, conditions:{}};
	}
	,getColumnInputStrCheckerObj:function(isEmptyAllowed, min_len, max_len, unique_value_list){
		var _v = airborne.validator;
		if(_v.isNotNumber(min_len)){
			console.log("getColumnInputStrChecker / _v.isNotNumber(min_len)");
			return null;
		}
		if(min_len < 1){
			console.log("getColumnInputStrChecker / min_len < 1");
			return null;
		}
		if(_v.isNotNumber(max_len)){
			console.log("getColumnInputStrChecker / _v.isNotNumber(max_len)");
			return null;
		}
		if(max_len < 1){
			console.log("getColumnInputStrChecker / max_len < 1");
			return null;
		}

		var check_func = _v.isValidInputStr;
		return {check_func:check_func, conditions:{isEmptyAllowed:isEmptyAllowed, min_len:min_len, max_len:max_len, unique_value_list:unique_value_list}};
	}
	,getColumnInputDateCheckerObj:function(date_format_type, start_time, end_time){
		var _v = airborne.validator;
		var _d = airborne.dates;

		if(_d.isNotValidDateFormat(date_format_type)){
			console.log("!! Error / getColumnInputDateChecker / _d.isNotValidDateFormat(date_format_type)");
			return null;
		}
		if(_d.isNotValidDate(start_time, date_format_type)){
			console.log("!! Error / getColumnInputDateChecker / _d.isNotValidDate(start_time, date_format_type)");
			return null;
		}
		if(_d.isNotValidDate(end_time, date_format_type)){
			console.log("!! Error / getColumnInputDateChecker / _d.isNotValidDate(end_time, date_format_type)");
			return null;
		}

		var check_func = _v.isValidInputDateStr;
		return {check_func:check_func, conditions:{date_format_type:date_format_type, start_time:start_time, end_time:end_time}};
	}
	,getColumnDynamicTypeInfo:function(type_on_select, type_on_update, type_on_insert){
		var self = this;
		if(	!this.isValidColumnType(type_on_select) || 
			!this.isValidColumnType(type_on_update) || 
			!this.isValidColumnType(type_on_insert)){

			console.log("getColumnDynamicTypeInfo / param is not valid");
			return null;
		}

		var dynamicTypeInfoObj = 
		{
			select:type_on_select
			,update:type_on_update
			,insert:type_on_insert
		};

		return dynamicTypeInfoObj;
	}
	,isValidColumnType:function(column_dynamic_type){

		if(column_dynamic_type == null) return false;

		if(	column_dynamic_type != this.COLUMN_TYPE_TEXT			&&
			column_dynamic_type != this.COLUMN_TYPE_INPUT			&&
			column_dynamic_type != this.COLUMN_TYPE_INPUT_DISABLED	&&
			column_dynamic_type != this.COLUMN_TYPE_SELECT			&&
			column_dynamic_type != this.COLUMN_TYPE_IMAGE 			&&
			column_dynamic_type != this.COLUMN_TYPE_IMAGE_UPLOAD 	&&
			column_dynamic_type != this.COLUMN_TYPE_HIDDEN 			&&
			column_dynamic_type != this.COLUMN_TYPE_NO_INSERT 		&&
			column_dynamic_type != this.COLUMN_TYPE_NO_UPDATE 		&&
			column_dynamic_type != this.COLUMN_TYPE_NOT_EXIST
		){
			return false;
		}
		return true;
	}
	,getColumnDynamicInput_Upload_Image:function(upload_container_id, upload_url, default_image_path, image_width, image_height, reponse_image_path_attr, file_meta_info_obj){

		var _v = airborne.validator;
		if(	_v.isNotValidStr(upload_container_id) 	|| 
			_v.isNotValidStr(upload_url)			||
			_v.isNotValidStr(default_image_path)	||
			_v.isNotNumber(image_width)				||
			_v.isNotNumber(image_height)			||
			_v.isNotValidArray(reponse_image_path_attr)
		){
			console.log("getColumnDynamicInput_Upload_Image / param is not valid!");
			return null;
		}

		var dynamicValueInfoObj = 
		{
			image_path:""
			, image_path_empty:"Empty"
			, default_image_path:(default_image_path!=null)?default_image_path:""
			, image_width:image_width
			, image_height:image_height
			, upload_container_id:upload_container_id
			, upload_url:upload_url
			, reponse_image_path_attr:reponse_image_path_attr
			, file_meta_info_obj:file_meta_info_obj
		};

		return dynamicValueInfoObj;
	}
	,isNotSelectSimple:function(select_options_arr){
		return !this.isSelectSimple(select_options_arr);
	}
	,isSelectSimple:function(select_options_arr){
		var _v = airborne.validator;
		if(_v.isValidArray(select_options_arr)){
			// example : ["A", "N"]
			return true;
		}
		return false;
	}
	,isNotSelectDetail:function(select_options_arr){
		return !this.isSelectDetail(select_options_arr);
	}
	,isSelectDetail:function(select_options_arr){
		var _v = airborne.validator;
		if(_v.isNotValidArray(select_options_arr)){
			console.log("Error / column / isSelectDetail / _v.isNotValidArray(select_info.select_options_arr)");
			return false;
		} 

		// example : [{__key:"AVAILABLE",__value:"A"}, {__key:"NOT_IN_USE",__value:"N"}]
		for (var idx = 0; idx < select_options_arr.length; idx++) {
			var select_option_obj = select_options_arr[idx];

			if(select_option_obj == null){
				//console.log("Error / column / isSelectDetail / select_option_obj == null");
				return false;
			} 
			if(select_option_obj[this.COLUMN_TYPE_SELECT_KEY] == null){
				//console.log("Error / column / isSelectDetail / select_option_obj.__key == null");
				return false;
			} 
			if(select_option_obj[this.COLUMN_TYPE_SELECT_VALUE] == null){
				//console.log("Error / column / isSelectDetail / select_option_obj.__value == null");
				return false;
			}
		};

		return true;
	}
	,getSelectDetailElement:function(__key, __value){
		if(__key == null){
			console.log("Error / column / getSelectDetailElement / __key == null");
			return null;
		}
		if(__value == null){
			console.log("Error / column / getSelectDetailElement / __value == null");
			return null;
		}

		var key_value_obj={};
		key_value_obj[this.COLUMN_TYPE_SELECT_KEY] = "" + __key;
		key_value_obj[this.COLUMN_TYPE_SELECT_VALUE] = "" + __value;

		return key_value_obj;
	}
	,getColumnDynamicInput_Select:function(select_options_arr, selected_option){

		var dynamicValueInfoObj = 
		{
			select_options_arr:select_options_arr
			, selected_option:selected_option
		};
		return dynamicValueInfoObj;
	}
	,getColumnDynamicIDInfo:function(key, view, query){

		var dynamicIDInfoObj = {
			key:key
			, view:view
			, query:query
		};

		return dynamicIDInfoObj;
	}
	,isNotValidDynamicIDInfo:function(target_obj){
		return !this.isValidDynamicIDInfo(target_obj);
	}
	,isValidDynamicIDInfo:function(target_obj){
		var _v = airborne.validator;
		if(	target_obj == null || 
			_v.isNotValidStr(target_obj.key) || 
			_v.isNotValidStr(target_obj.view) || 
			_v.isNotValidStr(target_obj.query)){
			return false;
		}
		
		return true;
	}
	,isNotValidMode:function(mode){
		return !this.isValidMode(mode);
	}
	,isValidMode:function(mode){

		if(mode == null) return false;

		if(mode == this.MODE_SELECT || mode == this.MODE_UPDATE || mode == this.MODE_INSERT) return true;

		return false;
	}
	,drawColumnTagsModify:function(mode, column_info, selected_row_obj){

		// selected_row_obj - sample
		// {
		// 	id:"jack"
		// 	,user_row_num:30
		// 	,mobile:010-4321-0987
		// }

		var _v = airborne.validator;
		if(this.isNotValidMode(mode)){
			console.log("!Error! / column / drawColumnTagsModify / this.isNotValidMode(mode)");
			return;
		}
		if(column_info == null){
			console.log("!Error! / column / drawColumnTagsModify / column_info == null");
			return;
		}

		if(mode == this.MODE_UPDATE && selected_row_obj == null){
			console.log("!Error! / column / drawColumnTagsModify / selected_row_obj == null");
			return;
		}

		var column_tag = "";
		for (var key in column_info) {
			
			var cur_column = column_info[key];

			// check editable
			if(cur_column.isNotHidden(mode) && cur_column.isNotEditable(mode)){
				column_tag += "<fieldset disabled>";
			}
			if(cur_column.isNotHidden(mode)){
				column_tag += "<div class=\"form-group\">";
			}


			if(mode == this.MODE_INSERT){

				// draw column key
				if(cur_column.isNotHidden(mode)){
					var column_name = cur_column.id.view;
					column_tag += "<label for=\"<column_name>\" style=\"float:left;\"><column_name></label><br/>"
									.replace(/\<column_name\>/gi, column_name);
				}
				// draw column value
				column_tag += this.drawColumnTag(cur_column, cur_column.getDefaultValueOnNoResult(), mode);

			} else if(mode == this.MODE_UPDATE && selected_row_obj != null){

				for (var key in selected_row_obj) {
					var value = selected_row_obj[key];

					var cur_key = cur_column.getKey();
					
					if(cur_key != key) {
						//console.log("!Warning! / airborne.view.column / drawColumnTagsModify / cur_key != key / cur_key : " + cur_key + " / key : " + key);
						continue;
					}
					
					// draw column key
					if(cur_column.isNotHidden(mode)){
						var column_name = cur_column.id.view;
						column_tag += "<label for=\"<column_name>\" style=\"float:left;\"><column_name></label><br/>"
										.replace(/\<column_name\>/gi, column_name);
					}				
					
					// draw column value
					column_tag += this.drawColumnTag(cur_column, value, mode);
				}
			}



			if(cur_column.isNotHidden(mode)){
				column_tag += "</div>";	
			}
			if(cur_column.isNotHidden(mode) && cur_column.isNotEditable(mode)){
				column_tag += "</fieldset>";
			}
		}
		
		return column_tag;		
	}
	,drawColumnTag:function(cur_column_info, cur_value, cur_mode){

		var column_tag = "";
		var _o = airborne.bootstrap.obj;

		// get column type and value
		var column_type = cur_column_info.getType(cur_mode);
		if( column_type == null ){
			console.log("drawColumnTag / column_type == null");
			return null;
		}
		cur_value = ( cur_value == null )?"":cur_value;

		
		// draw column value input
		if(column_type == this.COLUMN_TYPE_HIDDEN){

			column_tag += "<input class=\"<class>\" type=\"hidden\" name=\"<column_name>\" id=\"<column_name>\" value=\"<value>\">"
					.replace(/\<class\>/gi,this.COLUMN_TYPE_HIDDEN + "_" +  cur_column_info.getKey())
					.replace(/\<value\>/gi,(cur_value!=null)?cur_value:"")
					.replace(/\<column_name\>/gi, cur_column_info.getKey())
			;

		} else if(column_type == this.COLUMN_TYPE_SELECT){

			var key = cur_column_info.getKey();
			var select_options_arr = cur_column_info.modify_info.select_options_arr;
			var selected_option = cur_column_info.modify_info.selected_option;

			if(cur_mode == this.MODE_INSERT){
				selected_option = cur_column_info.modify_info.selected_option;
			}else if(cur_mode == this.MODE_UPDATE){
				selected_option = cur_value;
			}

			if(this.isSelectDetail(select_options_arr)){
				console.log("001");
				column_tag = _o.getTagSelectDetail(key, select_options_arr, selected_option);
			} else if(this.isSelectSimple(select_options_arr)){
				console.log("002 / select_options_arr :: ",select_options_arr);
				column_tag = _o.getTagSelectSimple(key, select_options_arr, selected_option);
			} else {
				console.log("Error! / drawColumnTag / column_type == this.COLUMN_TYPE_SELECT");
			}

		} else if(column_type == this.COLUMN_TYPE_INPUT || column_type == this.COLUMN_TYPE_INPUT_DISABLED){

			column_tag += "<input class=\"form-control\" type=\"text\" name=\"<column_name>\" id=\"<column_name>\" value=\"<value>\"  placeholder=\"type <column_name>\">"
					.replace(/\<value\>/gi,(cur_value!=null)?cur_value:"")
					.replace(/\<column_name\>/gi, cur_column_info.getKey());

		} else if(column_type == this.COLUMN_TYPE_TEXT){

			column_tag += (cur_value!=null)?cur_value:"";

		} else if(column_type == this.COLUMN_TYPE_IMAGE || column_type == this.COLUMN_TYPE_IMAGE_UPLOAD){

			var image_info = cur_column_info.modify_info;
			var image_path = image_info.default_image_path;
			if(	airborne.validator.isValidStr(cur_value) && 
				cur_value != image_info.default_image_path){
				image_path = cur_value;
			}

			column_tag += 		
			"<div id=\"image_container\" class=\"media\">" + 
					"<a id=\"<id>\"class=\"pull-left\" href=\"<link>\"  target=\"_blank\">"
					.replace(/\<id\>/gi, cur_column_info.getKey())
					.replace(/\<link\>/gi, image_path) + 
					//"<img id=\"<id>\" class=\"media-object img-thumbnail\" data-src=\"holder.js/<image_width>x<image_height>\" style=\"width:<image_width>px;height:<image_height>px;\" src=\"<default_image_path>\">"
					"<img id=\"<id>\" class=\"media-object img-thumbnail\" data-src=\"holder.js/<image_width>x<image_height>\" style=\"width:<image_width>px;\" src=\"<default_image_path>\">"
					.replace(/\<id\>/gi, cur_column_info.getKey())
					.replace(/\<default_image_path\>/gi, image_path)
					.replace(/\<image_width\>/gi, image_info.image_width)
					.replace(/\<image_height\>/gi, image_info.image_height) +
					"<input name=\"<id>\" id=\"<id>\" value=\"<image_path>\" type=\"hidden\">"
					.replace(/\<id\>/gi, cur_column_info.getKey())
					.replace(/\<image_path\>/gi, image_path) +
					"</a>" + 
					"<div id=\"upload_form_container\" style=\"float:left;width:auto;\"></div>" + 
			"</div>";
		}

		return column_tag;
	}	
	,getObj:function(){
		// return column_info_manager
		return {
			column_info:null
			,getColumnInfo:function(){
				return this.column_info;
			}
			,addColumnInfo:function(dynamic_id, type, modify_info, validCheckerObj, default_value_on_no_result){

				if(this.column_info == null) this.column_info = {};

				this.column_info[dynamic_id.key] = 
				{
					id:dynamic_id
					, type:type // {select:COLUMN_TYPE_HIDDEN,update:COLUMN_TYPE_TEXT,insert:COLUMN_TYPE_HIDDEN}
					, modify_info:modify_info
					, default_value_on_no_result:default_value_on_no_result
					, getKey:function(){
						return this.id.key;
					}
					, getType:function(mode){
						return this.type[mode];
					}
					, getValue:function(){
						var referer_jq = this.getRefererJquery();
						var cur_key = this.getKey();

						if(this.getModifyValue!=null && referer_jq!=null){
							return this.getModifyValue(referer_jq, this.getKey(), cur_key);
						}

						return this.getDefaultValueOnNoResult();
					}
					, getModifyValue:null
					, hasInsertModal:function(){
						var _column = airborne.bootstrap.column;
						var type = this.getType(_column.MODE_INSERT);
						return !(type == _column.COLUMN_TYPE_NO_INSERT);
					}
					, hasUpdateModal:function(){
						var _column = airborne.bootstrap.column;
						var type = this.getType(_column.MODE_UPDATE);
						return !(type == _column.COLUMN_TYPE_NO_UPDATE);
					}
					, isNotEditable:function(mode){
						var _column = airborne.bootstrap.column;
						return (this.getType(mode) == _column.COLUMN_TYPE_INPUT_DISABLED);
					}
					, isEditable:function(mode){
						return !this.isNotEditable(mode);
					}
					, isHidden:function(mode){
						var _column = airborne.bootstrap.column;
						return (this.getType(mode) == _column.COLUMN_TYPE_HIDDEN);
					}
					, isNotHidden:function(mode){
						return !this.isHidden(mode);
					}
					, isVisible:function(mode){
						return !this.isHidden(mode);	
					}
					, isTextView:function(mode){
						var _column = airborne.bootstrap.column;
						return (this.getType(mode) == _column.COLUMN_TYPE_TEXT);	
					}
					, isNotTextView:function(mode){
						return !this.isTextView(mode);	
					}
					, getDefaultValueOnNoResult:function(){
						return this.default_value_on_no_result;
					}
					, referer_jq:null
					, setRefererJquery:function(referer_jq){
						if(referer_jq == null){
							console.log("setRefererJquery / referer_jq == null");
							return;
						}

						var self = this;
						this.referer_jq = referer_jq;
						this.referer_jq.change(function(){
							if(!self.isValid()){
								this.focus();
							}
						});
					}
					, getRefererJquery:function(){
						return this.referer_jq;
					}
					, validCheckerObj:validCheckerObj
					, isValid:function(){

						var _column = airborne.bootstrap.column;
						if((_column.COLUMN_TYPE_SELECT == this.getType(_column.MODE_INSERT)) || (_column.COLUMN_TYPE_SELECT == this.getType(_column.MODE_UPDATE))){
							return true;
						}
						if(this.validCheckerObj == null){
							console.log("Warning / column / isValid / this.validCheckerObj == null");	
							return true;
						} 
						if(this.validCheckerObj.check_func == null){
							console.log("Warning / column / isValid / this.validCheckerObj.check_func == null");	
							return true;
						} 
						if(this.validCheckerObj.conditions == null){
							console.log("Warning / column / isValid / this.validCheckerObj.conditions == null");	
							return true;
						}

						var callback_checker_func = this.validCheckerObj.check_func;
						var condition_checker_func = this.validCheckerObj.conditions;
						condition_checker_func.key = this.getKey();
						condition_checker_func.referer_jq = this.referer_jq;

						return callback_checker_func.apply(self,[this.referer_jq.val(), condition_checker_func]);
					}
					, getCheckerObj:function(){
						return {key:this.getKey(),value:this.getValue(),referer_jq:this.referer_jq,is_valid:this.isValid,is_valid_scope:this};
					}
				};
			}
			,addColumn:function(key_str, type, extra_info, validCheckerObj, default_value_on_no_result){
				
				var _column = airborne.bootstrap.column;

				var key_obj = 
				_column.getColumnDynamicIDInfo(
					// id for key / 여기의 이름으로 form 필드의 input.name을 구성합니다.
					key_str
					// id for view / 뷰의 테이블에 노출되는 컬럼명입니다.								
					, key_str
					// id for query / 테이블을 그릴 json_obj_list의 json_obj의 속성 명입니다. 이 이름으로 데이터를 가져옵니다. 
					, key_str
				);
				
				this.addColumnWithKeyObj(key_obj, type, extra_info, validCheckerObj, default_value_on_no_result);
			}
			,addColumnWithKeyObj:function(key_obj, type, extra_info, validCheckerObj, default_value_on_no_result){

				var _column = airborne.bootstrap.column;
				var column_type_obj = null;
				if(type == _column.COLUMN_TYPE_HIDDEN){
					column_type_obj = 
					_column.getColumnDynamicTypeInfo(
						// type for select
						_column.COLUMN_TYPE_HIDDEN
						// type for update
						, _column.COLUMN_TYPE_HIDDEN
						// type for insert
						, _column.COLUMN_TYPE_HIDDEN
					);
				} else if(type == _column.COLUMN_TYPE_IMAGE){
					column_type_obj = 
					_column.getColumnDynamicTypeInfo(
						// type for select
						_column.COLUMN_TYPE_IMAGE
						// type for update
						, _column.COLUMN_TYPE_IMAGE_UPLOAD
						// type for insert
						, _column.COLUMN_TYPE_IMAGE_UPLOAD
					);
				} else if(type == _column.COLUMN_TYPE_INPUT){
					column_type_obj = 
					_column.getColumnDynamicTypeInfo(
						// type for select
						_column.COLUMN_TYPE_TEXT
						// type for update
						, _column.COLUMN_TYPE_INPUT
						// type for insert
						, _column.COLUMN_TYPE_INPUT
					);
				} else if(type == _column.COLUMN_TYPE_TEXT){
					column_type_obj = 
					_column.getColumnDynamicTypeInfo(
						// type for select
						_column.COLUMN_TYPE_TEXT
						// type for update
						, _column.COLUMN_TYPE_INPUT_DISABLED
						// type for insert	
						, _column.COLUMN_TYPE_HIDDEN
					);
				} else if(type == _column.COLUMN_TYPE_SELECT){
					column_type_obj = 
					_column.getColumnDynamicTypeInfo(
						// type for select
						_column.COLUMN_TYPE_TEXT				
						// type for update
						, _column.COLUMN_TYPE_SELECT
						// type for insert
						, _column.COLUMN_TYPE_SELECT
					);
				}

				this.addColumnInfo(key_obj, column_type_obj, extra_info, validCheckerObj, default_value_on_no_result);
			}			
			,addColumnHidden:function(key, default_value_on_no_result){
				var _column = airborne.bootstrap.column;
				this.addColumn(key, _column.COLUMN_TYPE_HIDDEN, null, null, default_value_on_no_result);
			}
			,addColumnHiddenWithKeyObj:function(key_obj, default_value_on_no_result){
				var _column = airborne.bootstrap.column;
				if(_column.isNotValidDynamicIDInfo(key_obj)){
					console.log("!! Error / airborne.column / addColumnHiddenWithKeyObj / _column.isNotValidDynamicIDInfo(key_obj)");
					return;
				}
				
				this.addColumnWithKeyObj(key_obj, _column.COLUMN_TYPE_HIDDEN, null, null, default_value_on_no_result);
			}
			,addColumnText:function(key, default_value_on_no_result){
				var _column = airborne.bootstrap.column;
				this.addColumn(key, _column.COLUMN_TYPE_TEXT, null, null, default_value_on_no_result);
			}
			,addColumnTextWithKeyObj:function(key_obj, default_value_on_no_result){
				var _column = airborne.bootstrap.column;
				if(_column.isNotValidDynamicIDInfo(key_obj)){
					console.log("!! Error / airborne.column / addColumnTextWithKeyObj / _column.isNotValidDynamicIDInfo(key_obj)");
					return;
				}
				
				this.addColumnWithKeyObj(key_obj, _column.COLUMN_TYPE_TEXT, null, null, default_value_on_no_result);
			}
			,addColumnInput:function(key, validCheckerObj, default_value_on_no_result){
				// validCheckerObj
				// {func:airborne.validator.isValidInputStr, conditions:{isEmptyAllowed:false, minLen:10, maxLen:20}}

				var _column = airborne.bootstrap.column;
				this.addColumn(key, _column.COLUMN_TYPE_INPUT, null, validCheckerObj, default_value_on_no_result);
			}
			,addColumnInputWithKeyObj:function(key_obj, validCheckerObj, default_value_on_no_result){
				// validCheckerObj
				// {func:airborne.validator.isValidInputStr, conditions:{isEmptyAllowed:false, minLen:10, maxLen:20}}

				var _column = airborne.bootstrap.column;
				if(_column.isNotValidDynamicIDInfo(key_obj)){
					console.log("!! Error / airborne.column / addColumnInputWithKeyObj / _column.isNotValidDynamicIDInfo(key_obj)");
					return;
				}
				
				this.addColumnWithKeyObj(key_obj, _column.COLUMN_TYPE_INPUT, null, validCheckerObj, default_value_on_no_result);
			}
			,addColumnImage:function(key, upload_url, default_image_path, image_width, image_height, response_image_path_attr, file_meta_info_obj){

				var _column = airborne.bootstrap.column;

				var image_info = 
				_column.getColumnDynamicInput_Upload_Image( 
					key + image_width + "_" + image_height	// example : series_image_210_316
					, upload_url
					, default_image_path
					, image_width
					, image_height
					, response_image_path_attr // 이미지 업로드 뒤에 리턴되는 객체 안의 새로운 이미지 주소를 가져올 접근 경로를 지정합니다.
					, file_meta_info_obj
				);

				this.addColumn(key, _column.COLUMN_TYPE_IMAGE, image_info);
			}
			,addColumnImageWithKeyObj:function(key_obj, upload_url, default_image_path, image_width, image_height, response_image_path_attr, file_meta_info_obj){

				var _column = airborne.bootstrap.column;

				var image_info = 
				_column.getColumnDynamicInput_Upload_Image( 
					key_obj.key + image_width + "_" + image_height	// example : series_image_210_316
					, upload_url
					, default_image_path
					, image_width
					, image_height
					, response_image_path_attr // 이미지가 로딩되었을 때의 업데이트할 대상 html element tag.
					, file_meta_info_obj
				);

				this.addColumnWithKeyObj(key_obj, _column.COLUMN_TYPE_IMAGE, image_info);
			}
			,addColumnSelect:function(key, select_options_arr, selected_option){

				var _column = airborne.bootstrap.column;

				var select_info = 
				_column.getColumnDynamicInput_Select(
					select_options_arr // example : ["A", "N"]
					,selected_option
				);

				this.addColumn(key, _column.COLUMN_TYPE_SELECT, select_info);
			}
			,addColumnSelectWithKeyObj:function(key_obj, select_options_arr, selected_option){
				
				var _column = airborne.bootstrap.column;
				if(_column.isNotValidDynamicIDInfo(key_obj)){
					console.log("!! Error / airborne.column / addColumnSelect / _column.isNotValidDynamicIDInfo(key_obj)");
					return;
				}

				var select_info = 
				_column.getColumnDynamicInput_Select(
					select_options_arr // example : ["A", "N"]
					,selected_option
				);
				this.addColumnWithKeyObj(key_obj, _column.COLUMN_TYPE_SELECT, select_info);
				
			}
			,addColumnSelectDetail:function(key, select_options_arr, selected_option_key){

				var _column = airborne.bootstrap.column;

				var select_info = 
				_column.getColumnDynamicInput_Select(
					select_options_arr // example : [{key:"AVAILABLE",value:"A"}, {key:"NOT_IN_USE",value:"N"}]	/	select_info.select_options_arr
					,selected_option_key
				);

				this.addColumn(key, _column.COLUMN_TYPE_SELECT, select_info);
			}
			,addColumnSelectDetailWithKeyObj:function(key_obj, select_options_arr, selected_option_key){
				
				var _column = airborne.bootstrap.column;
				if(_column.isNotValidDynamicIDInfo(key_obj)){
					console.log("!! Error / airborne.column / addColumnSelect / _column.addColumnSelectDetailWithKeyObj(key_obj)");
					return;
				}
				
				var select_info = 
				_column.getColumnDynamicInput_Select(
					select_options_arr // example : [{key:"AVAILABLE",value:"A"}, {key:"NOT_IN_USE",value:"N"}]	/	select_info.select_options_arr
					,selected_option_key
				);
				
				this.addColumnWithKeyObj(key_obj, _column.COLUMN_TYPE_SELECT, select_info);
			}
		}
		
	} // getObj ends
	
}