airborne.bootstrap.obj = {

	getId:function(_name){ // change empty space to underbar
		if(_name == null) return "";
		return _name.toLowerCase().replace(/\s/gi,"_").replace(/-/gi,"").replace(/\&/gi,"_").replace(/\=/gi,"_");
	}
	,getContainer:function(obj_name, parent_jq){ //airborne.bootstrap.obj.getContainer

		var obj_name_safe = this.getId(obj_name) + "_container";

		var list_parent_obj_arr = $("div#" + obj_name_safe);
		if(list_parent_obj_arr != null || list_parent_obj_arr.length > 0){
			$(list_parent_obj_arr[0]).children().remove();
		}
		
		var table_container_tag = "<div id=\"<table_id>\"></div>".replace(/\<table_id\>/gi, obj_name_safe);

		if(parent_jq == null){
			$("body").append(table_container_tag);
		} else {
			parent_jq.append(table_container_tag);
		}
		

		list_parent_obj_arr = $("div#" + obj_name_safe);

		if(list_parent_obj_arr == null || list_parent_obj_arr.length == 0){
			console.log("airborne.bootstrap.obj.getContainer / init / list_parent_obj == null");
			return null;
		}
		var parent_jq_obj = $(list_parent_obj_arr[0]);
		if(parent_jq_obj == null){
			console.log("airborne.bootstrap.obj.getContainer / parent_jq_obj == null");
			return null;
		}

		return parent_jq_obj;
	}
	,isNotValidTagSelectOption:function(option_name, option_value, selected){
		return !this.isValidTagSelectOption(option_name, option_value, selected);
	}
	,isValidTagSelectOption:function(option_name, option_value, selected){

		var _v = airborne.validator;
		if(_v.isNotValidStr(option_name)){
			console.log("isValidTagSelectOption / _v.isNotValidStr(option_name)");
			return false;
		}
		if(_v.isNotValidStr(option_value)){
			console.log("isValidTagSelectOption / _v.isNotValidStr(option_value)");
			return false;
		}
		if(_v.isNotValidBoolean(selected)){
			console.log("isValidTagSelectOption / _v.isNotValidBoolean(selected)");
			return false;
		}

		return true;

	}
	,isNotValidSelectOptionObj:function(select_option){
		return !this.isValidSelectOptionObj(select_option);
	}
	,isValidSelectOptionObj:function(select_option){
		var _column = airborne.bootstrap.column;
		if(select_option == null){
			console.log("!Error! / airborne.bootstrap.obj.isValidSelectOptionObj / select_option == null");
			return false;	
		} 
		if(select_option[_column.COLUMN_TYPE_SELECT_KEY] == null){
			console.log("!Error! / airborne.bootstrap.obj.isValidSelectOptionObj / select_option.key == null");
			return false;
		}
		if(select_option[_column.COLUMN_TYPE_SELECT_VALUE] == null){
			console.log("!Error! / airborne.bootstrap.obj.isValidSelectOptionObj / select_option.value == null");
			return false;
		}

		return true;
	}
	,getTagSelectOption:function(option_name, option_value, selected){
		var isValid = this.isValidTagSelectOption(option_name, option_value, selected);

		if(isValid){
			return {_name:option_name, _value:option_value, _selected:selected};
		} else {
			console.log("!Error! / airborne.bootstrap.obj.getTagSelectOption / !isValid");
			return null;
		}
	}
	,getTagSelectOptionArr:function(src_list, delegate_obj){
		var _v = airborne.validator;

		if(_v.isNotValidArray(src_list)){
			console.log("airborne.bootstrap.obj.getTagSelectOptionArr / _v.isNotValidArray(src_list)");
			return null;
		}

		if(this.isNotValidDelegate(delegate_obj)){
			console.log("airborne.bootstrap.obj.getTagSelectOptionArr / this.isNotValidDelegate(delegate_obj)");
			return null;
		}


		var select_option_arr = [];
		for (var idx = 0; idx < src_list.length; idx++) {
			var element = src_list[idx];

			var received_select_option = delegate_obj._func.apply(delegate_obj._scope, [element]);

			if(this.isNotValidSelectOptionObj(received_select_option)){
				console.log("airborne.bootstrap.obj.getTagSelectOptionArr / this.isNotValidSelectOptionObj(received_select_option)");
				continue;
			}

			select_option_arr.push(received_select_option);
		}

		return select_option_arr;
	}
	,getTagSelect:function(id, select_options_arr){

		var _v = airborne.validator;
		var column_tag = "";

		if(_v.isNotValidArray(select_options_arr)){
			console.log("airborne.bootstrap.obj.getTagSelect / _v.isNotValidArray(select_options_arr)");
			return "";
		} 

		column_tag += "<select class=\"form-control\" name=\"<column_name>\" id=\"<column_name>\">".replace(/\<column_name\>/gi, id);
		for(var inner_idx = 0; inner_idx < select_options_arr.length; inner_idx++){
			var option = select_options_arr[inner_idx];

			var isNotValid = this.isNotValidTagSelectOption(option._name, option._value, option._selected);

			if(isNotValid) continue;

			if(option._selected == true){
				column_tag += 
				"<option value=\"<value>\" selected>".replace(/\<value\>/gi, option._value)
				+ option._name
				+ "</option>";	
			} else {
				column_tag += 
				"<option value=\"<value>\">".replace(/\<value\>/gi, option._value)
				+ option._name
				+ "</option>";	
			}
		}
		column_tag += "</select>";	

		return 	column_tag;

	}
	,getTagSelectSimple:function(id, select_options_arr, selected_option){ // select 태그 내의 단어를 검색해서 정렬해 줍니다.

		var _v = airborne.validator;
		if(_v.isNotValidArray(select_options_arr)){
			console.log("getTagSelectSimple / _v.isNotValidArray(select_options_arr)");
			return "";
		} 

		var _column = airborne.bootstrap.column;
		if(_column.isNotSelectSimple(select_options_arr)){
			console.log("getTagSelectSimple / _column.isNotSelectSimple(select_options_arr)");
			return "";
		}

		var filtered_select_options_arr = [];
		for(var idx = 0; idx < select_options_arr.length; idx++){
			var option_name = select_options_arr[idx];
			if(_v.isNotValidStr(option_name)){
				console.log("getTagSelectSimple / _v.isNotValidStr(option_name)");
				return "";
			}

			var option = this.getTagSelectOption(option_name, option_name, (option_name == selected_option));
			filtered_select_options_arr.push(option);
		}

		return this.getTagSelect(id, filtered_select_options_arr);
	}
	,getTagSelectDetail:function(id, select_options_arr, selected_option_value){ // select 태그 정보를 key, value로 전달
		
		var _v = airborne.validator;

		if(_v.isNotValidArray(select_options_arr)){
			console.log("getTagSelectDetail / _v.isNotValidArray(select_options_arr)");
			return "";
		} 

		var _column = airborne.bootstrap.column;
		if(_column.isNotSelectDetail(select_options_arr)){
			console.log("getTagSelectDetail / _column.isNotSelectDetail(select_options_arr)");
			return "";
		}
		
		var filtered_select_options_arr = [];
		// example : [{__key:"AVAILABLE",__value:"A"}, {__key:"NOT_IN_USE",__value:"N"}]
		for(var idx = 0; idx < select_options_arr.length; idx++){
			var option_info_obj = select_options_arr[idx];
			var option_key = option_info_obj.__key;
			var option_value = option_info_obj.__value;
			
			var has_same_value_or_key = (option_value == selected_option_value);
			if(!has_same_value_or_key){
				has_same_value_or_key = (option_key == selected_option_value);
			}
			
			var option = this.getTagSelectOption(option_key, option_value, has_same_value_or_key);

			if(option == null){
				console.log("!Error! / airborne.bootstrap.obj.getTagSelectDetail / option == null");
				continue;
			}

			filtered_select_options_arr.push(option);
		}
		
		return this.getTagSelect(id, filtered_select_options_arr);
	}
	,isNotValidDelegate:function(target_delegate){
		return !this.isValidDelegate(target_delegate);
	}
	,is_valid_delegate:function(target_delegate){
		return this.isValidDelegate(target_delegate);
	}
	,isValidDelegate:function(target_delegate){
		if(target_delegate == null){
			// console.log("isValidDelegate / target_delegate == null");
			return false;	
		} 
		if(target_delegate._func == null){
			// console.log("isValidDelegate / target_delegate._func == null");
			return false;
		}
		if(target_delegate._scope == null){
			// console.log("isValidDelegate / target_delegate._scope == null");
			return false;
		}

		return true;
	}
	,get_delegate:function(delegate_func, delegate_scope){
		return this.getDelegate(delegate_func, delegate_scope);
	}
	,getDelegate:function(delegate_func, delegate_scope){
		if(delegate_func == null){
			console.log("airborne.bootstrap.obj / getDelegate / delegate_func == null");
			return null;
		}
		if(delegate_scope == null){
			console.log("airborne.bootstrap.obj / getDelegate / delegate_scope == null");
			return null;
		}

		var delegate_obj = 
		{
			_func:delegate_func
			, _scope:delegate_scope
			, _apply:function(param_arr){
				this._func.apply(this._scope,param_arr);
			}
		}

		return delegate_obj;
	}
	,is_hover:function(event_obj, target_jq){

		if(event_obj == undefined) {
			return false;
		}

		if(target_jq == undefined || target_jq.is(':visible') == false) {
			// 화면에 노출된 경우만 검사합니다.
			return false;
		}

		var x_pos = event_obj.pageX;
		var y_pos = event_obj.pageY;
		var target_position = target_jq.offset();
		var target_width = target_jq.outerWidth();
		var target_height = target_jq.outerHeight();

		var is_valid_y_pos = ((target_position.top < y_pos) && (y_pos < (target_position.top + target_height)))?true:false;
		var is_valid_x_pos = ((target_position.left < x_pos) && (x_pos < (target_position.left + target_width)))?true:false;

		return (is_valid_y_pos && is_valid_x_pos)?true:false;	
	}
	,is_hover_top:function(event_obj, target_jq){

		// 대상 객체 상단에 mouse over 인지 판단

		var x_pos = event_obj.pageX;
		var y_pos = event_obj.pageY;
		var target_position = target_jq.offset();
		var target_width = target_jq.outerWidth();
		var target_height = target_jq.outerHeight();

		var is_valid_y_pos = ((target_position.top < y_pos) && (y_pos < (target_position.top + parseInt(target_height/2))))?true:false;
		var is_valid_x_pos = ((target_position.left < x_pos) && (x_pos < (target_position.left + target_width)))?true:false;

		return (is_valid_y_pos && is_valid_x_pos)?true:false;	
	}
	,is_hover_bottom:function(event_obj, target_jq){

		// 대상 객체 하단에 mouse over 인지 판단

		var x_pos = event_obj.pageX;
		var y_pos = event_obj.pageY;
		var target_position = target_jq.offset();
		var target_width = target_jq.outerWidth();
		var target_height = target_jq.outerHeight();

		var is_valid_y_pos = ((target_position.top + parseInt(target_height/2) < y_pos) && (y_pos < (target_position.top + target_height)))?true:false;
		var is_valid_x_pos = ((target_position.left < x_pos) && (x_pos < (target_position.left + target_width)))?true:false;

		return (is_valid_y_pos && is_valid_x_pos)?true:false;	
	}
	,isOverLapping:function(target_a_ele, target_b_ele){

	   function getPositions( elem ) {
	        var pos, width, height;
	        pos = $( elem ).offset();
	        width = $( elem ).width();
	        height = $( elem ).height();
	        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
	    }

	    function comparePositions( p1, p2 ) {
	        var r1, r2;
	        r1 = p1[0] < p2[0] ? p1 : p2;
	        r2 = p1[0] < p2[0] ? p2 : p1;
	        return r1[1] > r2[0] || r1[0] === r2[0];
	    }

        var pos1 = getPositions( target_a_ele );
        var pos2 = getPositions( target_b_ele );

        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
	}
	// @ Section : LIST TAG (LEGACY)
	,COLOR_TYPE_LIST_ROW_WHITE:"list-group-item-default"
	,COLOR_TYPE_LIST_ROW_GREEN:"list-group-item-success"
	,COLOR_TYPE_LIST_ROW_BLUE:"list-group-item-info"
	,COLOR_TYPE_LIST_ROW_YELLOW:"list-group-item-warning"
	,COLOR_TYPE_LIST_ROW_RED:"list-group-item-danger"
	,TIME_PROP_HH_MM:"__time_hh_mm"
	,TIME_PROP_MM_SS:"__time_mm_ss"
	// @ Section : LIST ROW CSS MODIFIER
	,LIST_ROW_RADIUS_NORMAL:4
	// @ private
	// @ Desc : 리스트의 첫번째 열의 상단 좌,우의 모서리를 ridius 4px로 둥글게 만들어 줍니다.
	,set_list_first_row_css_radius:function(cur_list_row_jq, cur_radius){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotJQueryObj(cur_list_row_jq)){
			console.log("!Error! / set_element_css_radius / _v.isNotJQueryObj(cur_list_row_jq)");
			return;
		}
		if(_v.isNotUnsignedNumber(cur_radius)){
			console.log("!Error! / set_element_css_radius / _v.isNotUnsignedNumber(cur_radius)");
			return;
		}

		var cur_radius_str = cur_radius + "px";
		cur_list_row_jq.css("border-top-right-radius",cur_radius_str);
		cur_list_row_jq.css("border-top-left-radius",cur_radius_str);
	}
	// @ private
	// @ Desc : 리스트의 첫번째와 마지막 열 사이의 모든 열들을  상단 좌,우의 모서리의 ridius를 제거해서 네모난 모양으로 바꿔줍니다.
	,remove_list_row_css_radius:function(cur_list_row_jq){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotJQueryObj(cur_list_row_jq)){
			console.log("!Error! / set_element_css_radius / _v.isNotJQueryObj(cur_list_row_jq)");
			return;
		}

		cur_list_row_jq.css("border-top-right-radius","");
		cur_list_row_jq.css("border-top-left-radius","");
		cur_list_row_jq.css("border-bottom-right-radius","");
		cur_list_row_jq.css("border-bottom-left-radius","");
	}
	// @ private
	// @ Desc : 리스트의 마지막 열의 하단 좌,우의 모서리를 ridius 4px로 둥글게 만들어 줍니다.
	,set_list_last_row_css_radius:function(cur_list_row_jq, cur_radius){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotJQueryObj(cur_list_row_jq)){
			console.log("!Error! / set_element_css_radius / _v.isNotJQueryObj(cur_list_row_jq)");
			return;
		}
		if(_v.isNotUnsignedNumber(cur_radius)){
			console.log("!Error! / set_element_css_radius / _v.isNotUnsignedNumber(cur_radius)");
			return;
		}

		var cur_radius_str = cur_radius + "px";

		cur_list_row_jq.css("border-bottom-right-radius",cur_radius_str);
		cur_list_row_jq.css("border-bottom-left-radius",cur_radius_str);
	}
	// @ private
	// @ Desc : 리스트에 오직 1개의 열만 있을 경우, 상,하,좌,우의 모든 모서리를 ridius 4px로 둥글게 만들어 줍니다.
	,set_list_single_row_css_radius:function(cur_list_row_jq, cur_radius){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotJQueryObj(cur_list_row_jq)){
			console.log("!Error! / set_element_css_radius / _v.isNotJQueryObj(cur_list_row_jq)");
			return;
		}
		if(_v.isNotUnsignedNumber(cur_radius)){
			console.log("!Error! / set_element_css_radius / _v.isNotUnsignedNumber(cur_radius)");
			return;
		}		

		var cur_radius_str = cur_radius + "px";

		cur_list_row_jq.css("border-top-right-radius",cur_radius_str);
		cur_list_row_jq.css("border-top-left-radius",cur_radius_str);
		cur_list_row_jq.css("border-bottom-right-radius",cur_radius_str);
		cur_list_row_jq.css("border-bottom-left-radius",cur_radius_str);
	}
	,COLOR_TYPE_ELEMENT_WHITE:"color_type_element_white"
	,COLOR_TYPE_ELEMENT_GREEN:"color_type_element_green"
	,COLOR_TYPE_ELEMENT_BLUE:"color_type_element_blue"
	,COLOR_TYPE_ELEMENT_YELLOW:"color_type_element_yellow"
	,COLOR_TYPE_ELEMENT_RED:"color_type_element_red"
	,COLOR_FOCUS_YELLOW:"#FFCC66"
	,ITEM_TYPE_TABLE:"item_type_table"
	,ITEM_TYPE_LIST:"item_type_list"

	,ELEMENT_TYPE_TITLE:"ELEMENT_TYPE_TITLE"
	,ELEMENT_TYPE_TITLE_ADDABLE:"ELEMENT_TYPE_TITLE_ADDABLE"
	,ELEMENT_TYPE_INPUT_TEXT:"ELEMENT_TYPE_INPUT_TEXT"
	,ELEMENT_TYPE_TIME_HH_MM:"ELEMENT_TYPE_TIME_HH_MM"
	,ELEMENT_TYPE_TIME_MM_SS:"ELEMENT_TYPE_TIME_MM_SS"
	,ELEMENT_TYPE_SEARCH_LIST:"ELEMENT_TYPE_SEARCH_LIST"
	,ELEMENT_TYPE_NONE:"ELEMENT_TYPE_INPUT_NONE"

	,ELEMENT_TYPE_LIST_ROW_INPUT_TEXT:"ELEMENT_TYPE_LIST_ROW_INPUT_TEXT"
	,ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY:"ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY"
	,ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT:"ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT"
	,ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT:"ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT"
	,ELEMENT_TYPE_LIST_ROW_SELECT_BOX:"ELEMENT_TYPE_LIST_ROW_SELECT_BOX"

	,ELEMENT_TYPE_TABLE_TITLE:"ELEMENT_TYPE_TABLE_TITLE"
	,ELEMENT_TYPE_TABLE_TITLE_ADDABLE:"ELEMENT_TYPE_TABLE_TITLE_ADDABLE"
	,ELEMENT_TYPE_TABLE_INPUT_TEXT:"ELEMENT_TYPE_TABLE_INPUT_TEXT"
	,ELEMENT_TYPE_TABLE_TEXT:"ELEMENT_TYPE_TABLE_TEXT"
	,ELEMENT_TYPE_TABLE_TIME_HH_MM:"ELEMENT_TYPE_TABLE_TIME_HH_MM"
	,ELEMENT_TYPE_TABLE_TIME_MM_SS:"ELEMENT_TYPE_TABLE_TIME_MM_SS"
	,ELEMENT_TYPE_TABLE_SEARCH_LIST:"ELEMENT_TYPE_TABLE_SEARCH_LIST"

	,is_not_valid_element_type:function(element_type){
		return !this.is_valid_element_type(element_type);
	}
	,is_valid_element_type:function(element_type){
		var _v = airborne.validator;
		if(_v.isNotValidStr(element_type)) return false;

		if(	element_type == this.ELEMENT_TYPE_TITLE 		|| 
			element_type == this.ELEMENT_TYPE_TITLE_ADDABLE || 
			element_type == this.ELEMENT_TYPE_INPUT_TEXT 	|| 
			element_type == this.ELEMENT_TYPE_TIME_HH_MM 	|| 
			element_type == this.ELEMENT_TYPE_TIME_MM_SS 	|| 
			element_type == this.ELEMENT_TYPE_SEARCH_LIST 	||
			element_type == this.ELEMENT_TYPE_NONE 			|| 

			element_type == this.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT 				|| 
			element_type == this.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY 			|| 
			element_type == this.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT 	|| 
			element_type == this.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT 	|| 

			element_type == this.ELEMENT_TYPE_TABLE_TITLE 			|| 
			element_type == this.ELEMENT_TYPE_TABLE_TITLE_ADDABLE 	|| 
			element_type == this.ELEMENT_TYPE_TABLE_INPUT_TEXT 		||
			element_type == this.ELEMENT_TYPE_TABLE_TEXT 		||
			element_type == this.ELEMENT_TYPE_TABLE_TIME_HH_MM 		||
			element_type == this.ELEMENT_TYPE_TABLE_TIME_MM_SS 		||
			element_type == this.ELEMENT_TYPE_TABLE_SEARCH_LIST ){

			return true;	
		} 

		return false;
	}
	,is_editable_element_type:function(element_type){
		var _v = airborne.validator;
		if(_v.isNotValidStr(element_type)) return false;

		if(	element_type == this.ELEMENT_TYPE_INPUT_TEXT 	||
			element_type == this.ELEMENT_TYPE_TIME_HH_MM 	|| 
			element_type == this.ELEMENT_TYPE_TIME_MM_SS 	|| 
			element_type == this.ELEMENT_TYPE_TITLE_ADDABLE || 
			element_type == this.ELEMENT_TYPE_SEARCH_LIST 	||
			
			element_type == this.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT 				|| 
			element_type == this.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY 			|| 
			element_type == this.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT 	|| 
			element_type == this.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT 	||

			element_type == this.ELEMENT_TYPE_TABLE_TITLE_ADDABLE 	|| 
			element_type == this.ELEMENT_TYPE_TABLE_INPUT_TEXT 		||
			element_type == this.ELEMENT_TYPE_TABLE_TIME_HH_MM 		||
			element_type == this.ELEMENT_TYPE_TABLE_TIME_MM_SS 		||
			element_type == this.ELEMENT_TYPE_TABLE_SEARCH_LIST ){

			return true;
		}

		return false;
	}
	,EVENT_TYPE_INSERT_ITEM:"EVENT_TYPE_INSERT_ITEM"
	,EVENT_TYPE_UPDATE_ITEM:"EVENT_TYPE_UPDATE_ITEM"
	,EVENT_TYPE_DELETE_ITEM:"EVENT_TYPE_DELETE_ITEM"
	,EVENT_TYPE_INSERT_TABLE_ROW_ITEMS:"EVENT_TYPE_INSERT_TABLE_ROW_ITEMS"
	,EVENT_TYPE_UPDATE_TABLE_ROW_ITEMS:"EVENT_TYPE_UPDATE_TABLE_ROW_ITEMS"
	,EVENT_TYPE_DELETE_TABLE_ROW_ITEMS:"EVENT_TYPE_DELETE_TABLE_ROW_ITEMS"
	,EVENT_TYPE_UPDATE_TABLE_ROW_ORDER:"EVENT_TYPE_UPDATE_TABLE_ROW_ORDER"

	,is_not_valid_event_type:function(event_type){
		return !this.is_valid_event_type(event_type);
	}
	,is_valid_event_type:function(event_type){
		var _v = airborne.validator;
		if(_v.isNotValidStr(event_type)) return false;

		if(	event_type == this.EVENT_TYPE_INSERT_ITEM || 
			event_type == this.EVENT_TYPE_DELETE_ITEM || 
			event_type == this.EVENT_TYPE_UPDATE_ITEM ||
			event_type == this.EVENT_TYPE_INSERT_TABLE_ROW_ITEMS ||
			event_type == this.EVENT_TYPE_UPDATE_TABLE_ROW_ITEMS ||
			event_type == this.EVENT_TYPE_DELETE_TABLE_ROW_ITEMS ||
			event_type == this.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER
			) {

			return true;	
		} 

		return false;
	}


























	// event manager of column in table n row in list

	//     dMMMMMP dMP     dMMMMMP dMMMMMMMMb dMMMMMP dMMMMb dMMMMMMP         dMMMMMP dMP dMP dMMMMMP dMMMMb dMMMMMMP         dMMMMMMMMb  .aMMMb  dMMMMb  .aMMMb  .aMMMMP dMMMMMP dMMMMb 
	//    dMP     dMP     dMP     dMP"dMP"dMPdMP     dMP dMP   dMP           dMP     dMP dMP dMP     dMP dMP   dMP           dMP"dMP"dMP dMP"dMP dMP dMP dMP"dMP dMP"    dMP     dMP.dMP 
	//   dMMMP   dMP     dMMMP   dMP dMP dMPdMMMP   dMP dMP   dMP           dMMMP   dMP dMP dMMMP   dMP dMP   dMP           dMP dMP dMP dMMMMMP dMP dMP dMMMMMP dMP MMP"dMMMP   dMMMMK"  
	//  dMP     dMP     dMP     dMP dMP dMPdMP     dMP dMP   dMP           dMP      YMvAP" dMP     dMP dMP   dMP           dMP dMP dMP dMP dMP dMP dMP dMP dMP dMP.dMP dMP     dMP"AMF   
	// dMMMMMP dMMMMMP dMMMMMP dMP dMP dMPdMMMMMP dMP dMP   dMP           dMMMMMP    VP"  dMMMMMP dMP dMP   dMP           dMP dMP dMP dMP dMP dMP dMP dMP dMP  VMMMP" dMMMMMP dMP dMP    

	,get_element_event_manager:function(event_manager_id, element_jq, element_meta_info, delegate_set_event_manager_prop){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _html = airborne.html;
		var _self = this;
		var _date = airborne.dates;

		if(_v.isNotValidStr(event_manager_id)){
			console.log("airborne.bootstrap.obj / get_element_event_manager / _v.isNotValidStr(event_manager_id)");
			return null;
		}
		if(_v.isNotJQueryObj(element_jq)){
			console.log("airborne.bootstrap.obj / get_element_event_manager / _v.isNotJQueryObj(element_jq)");
			return null;
		}
		if(element_meta_info == null){
			console.log("airborne.bootstrap.obj / get_element_event_manager / element_meta_info == null");
			return null;
		}
		if(element_meta_info.element_type == null || this.is_not_valid_element_type(element_meta_info.element_type)){
			console.log("airborne.bootstrap.obj / get_element_event_manager / element_meta_info.element_type is not valid");
			return null;
		}
		if(this.isNotValidDelegate(delegate_set_event_manager_prop)){
			console.log("airborne.bootstrap.obj / get_element_event_manager / this.isNotValidDelegate(delegate_set_event_manager_prop)");
			return null;
		}

		var event_hierarchy_manager = this.get_event_hierarchy_manager();
		var requested_event_manager = event_hierarchy_manager.get_event_manager(event_manager_id);
		if(requested_event_manager != null && requested_event_manager.title_jq != null){
			// already has one.
			return requested_event_manager;
		}

		var element_event_manager = {
			// @ default
			event_manager_id:event_manager_id
			,element_jq:element_jq
			,get_element_jq:function(){
				return this.element_jq;	
			}
			,show_element_jq:function(){
				if(this.element_jq == null) return;
				this.element_jq.show();
			}
			,hide_element_jq:function(){
				if(this.element_jq == null) return;
				this.element_jq.hide();
			}
			,element_meta_info:element_meta_info
			,get_element_meta_info:function(){
				return this.element_meta_info;
			}
			,event_hierarchy_manager:event_hierarchy_manager
			,item_focus_color:this.COLOR_FOCUS_YELLOW
			,is_shy_row:false

			// @ required
			,element_color_type:null
			,set_element_color_type:function(element_color_type){
				this.element_color_type = element_color_type;	
			}
			,get_element_color_type:function(){
				return this.element_color_type;	
			}
			,element_color:null
			,set_element_color:function(element_color){
				this.element_color = element_color;	
			}
			,get_element_color:function(){
				return this.element_color;	
			}
			,element_background_color:null 
			,set_element_background_color:function(element_background_color){
				this.element_background_color = element_background_color;	
			}
			,get_element_background_color:function(){
				return this.element_background_color;	
			}
			,element_container_jq:null
			,set_element_container_jq:function(element_container_jq){
				if(_v.isNotJQueryObj(element_container_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_element_jq / _v.isNotJQueryObj(element_container_jq)");
					return;
				}
				this.element_container_jq = element_container_jq;
			}
			,get_element_container_jq:function(){
				return this.element_container_jq;
			}
			,is_element_container_hide:false
			,show_element_container_jq:function(){

				if(this.element_container_jq == null){
					//console.log("show_element_container_jq / this.element_container_jq == null / return");
					return;
				}

				if(this.is_element_container_hide == false){
					//console.log("show_element_container_jq / this.is_element_container_hide == false / return");
					return;
				}

				this.element_container_jq.show();
				this.is_element_container_hide = false;
			}
			,hide_element_container_jq:function(){
				if(this.element_container_jq == null){
					//console.log("hide_element_container_jq / this.element_container_jq == null / return");
					return;	
				}
				if(this.is_element_container_hide == true){
					//console.log("hide_element_container_jq / this.is_element_container_hide == true / return");
					return;	
				}

				this.element_container_jq.hide();
				this.is_element_container_hide = true;
			}
			/*
			@ private
			@ Desc : 자신의 하위에 속한 숨김 자식(shy element) 엘리먼트 컨테이너의 참조. 자식 엘리먼트 추가시 이 컨테이너에 넣습니다.
			*/
			,child_shy_element_container_jq:null
			,set_child_shy_element_container_jq:function(child_shy_element_container_jq){
				if(child_shy_element_container_jq == null) return;
				this.child_shy_element_container_jq = child_shy_element_container_jq;
			}
			,get_child_shy_element_container_jq:function(){
				return this.child_shy_element_container_jq;
			}
			/*
			@ private
			@ Desc : 자신의 하위에 속한 엘리먼트 컨테이너의 참조. 자식 엘리먼트 추가시 이 컨테이너에 넣습니다.
			*/	
			,children_element_container_jq:null
			,set_children_element_container_jq:function(children_element_container_jq){
				if(children_element_container_jq == null) return;
				this.children_element_container_jq = children_element_container_jq;
			}
			,get_children_element_container_jq:function(){
				return this.children_element_container_jq;
			}
			,children_shy_element_jq_arr:[]
			,push_shy_child_element_jq:function(add_on_element_jq){

				if(add_on_element_jq == undefined) return;
				var cur_children_shy_element_container_jq = this.get_child_shy_element_container_jq();

				if(cur_children_shy_element_container_jq == undefined) return;

				// 숨김 자식 엘리먼트를 자식 엘리먼트 컨테이너에 넣습니다. 화면에 표시됩니다.
				cur_children_shy_element_container_jq.append(add_on_element_jq);

				// 숨김 자식 엘리먼트 참조를 배열에 저장합니다.
				this.children_shy_element_jq_arr.push(add_on_element_jq);
			}
			,children_element_jq_arr:[]
			,push_child_element_jq:function(add_on_element_jq){
				if(add_on_element_jq == undefined) return;

				var cur_children_element_container_jq = this.get_children_element_container_jq();
				if(cur_children_element_container_jq == undefined) return;

				// 자식 엘리먼트를 자식 엘리먼트 컨테이너에 넣습니다. 화면에 표시됩니다.
				cur_children_element_container_jq.append(add_on_element_jq);

				// 자식 엘리먼트 참조를 배열에 저장합니다.
				this.add_on_element_jq_arr.push(add_on_element_jq);
			}
			,children_shy_element_collection_set_arr:[]
			/*
				@ private
				@ Scope : Event Manager / em
				@ Desc : 공식적으로 등록될 child shy element collection set을 추가할 경우 사용하는 메서드
			*/
			,em_push_child_shy_element_collection_set:function(child_shy_element_collection_set){
				if(child_shy_element_collection_set == undefined) return;

				this.children_shy_element_collection_set_arr.push(child_shy_element_collection_set);
				this.push_shy_child_element_jq(child_shy_element_collection_set.get_element_collection_container_jq());
			}
			,get_child_shy_element_collection_set_arr:function(){
				return this.children_shy_element_collection_set_arr;
			}
			,children_element_collection_set_arr:[]
			// @ private
			// @ container : event manager / em
			// @ Desc : 공식적으로 등록될 child element collection set을 추가할 경우 사용하는 메서드
			,em_push_child_element_collection_set:function(child_element_collection_set){

				if(child_element_collection_set == undefined) return;

				var cur_child_ecs_id = child_element_collection_set.get_element_collection_id();
				// console.log("em_push_child_element_collection_set / " + cur_child_ecs_id);

				// 공식적으로 등록될 수 있는 참조를 1개로 유지하게 위해 
				// 최상위 top element collection set부터 조사하여 
				// 이전 등록된 add_on_element_collection_set_arr안의 다른 모든 참조를 지웁니다.
				var delegate_do_to_all_element_set = _obj.get_delegate(function(cur_element_set){

					var cur_child_element_collection_set_arr = cur_element_set.get_event_manager().get_children_element_collection_set_arr();
					var idx;
					var length = cur_child_element_collection_set_arr.length;
					for(idx = 0; idx < length; idx++){
						var cur_child_element_collection_set = cur_child_element_collection_set_arr[idx];

						if(cur_child_ecs_id == cur_child_element_collection_set.get_element_collection_id()){
							cur_element_set.get_event_manager().em_remove_child_element_collection_set(cur_child_element_collection_set);
						}
					}

				},this);
				this.call_delegate_do_to_all_element_set(this.get_top_parent_element_collection_set(this), delegate_do_to_all_element_set);

				// TODO 같은 정보를 element set과 event manager 둘다 갖고 있는 것은 아닐까?
				this.children_element_collection_set_arr.push(child_element_collection_set);
				this.push_child_element_jq(child_element_collection_set.get_element_collection_container_jq());

				var cur_ecs_id = child_element_collection_set.get_element_collection_id();

				child_element_collection_set.set_parent_element_set(this.get_element_set());
			}
			/*
				@ private
				@ Scope : Event Manager / em
				@ Desc : 공식적으로 등록될 child element collection set을 제거할 경우 사용하는 메서드
			*/
			,em_remove_child_element_collection_set:function(element_collection_set_to_remove){
				if(element_collection_set_to_remove == undefined) return;

				var new_children_element_collection_set_arr = [];
				var cur_children_element_collection_set_arr = this.get_children_element_collection_set_arr();

				var idx;
				var length = cur_children_element_collection_set_arr.length;
				for(idx = 0;idx < length; idx++){
					var cur_child_element_collection_set = cur_children_element_collection_set_arr[idx];
					if(cur_child_element_collection_set.get_element_collection_id() === element_collection_set_to_remove.get_element_collection_id()){
						console.log("!Warning! / Event Manager / em_remove_child_element_collection_set / removed / ",cur_child_element_collection_set.get_element_collection_id());
						continue;
					}
					new_children_element_collection_set_arr.push(cur_child_element_collection_set);
				}

				this.children_element_collection_set_arr = new_children_element_collection_set_arr;
			}
			/*
				@ Public
				@ Scope : event manager
				@ Desc : 자식 collection set을 반환
			*/
			,get_children_element_collection_set_arr:function(){
				return this.children_element_collection_set_arr;
			}

			,add_on_element_container_jq:null
			,set_add_on_element_container_jq:function(add_on_element_container_jq){
				if(add_on_element_container_jq == null) return;
				this.add_on_element_container_jq = add_on_element_container_jq;
			}
			,get_add_on_element_container_jq:function(){
				return this.add_on_element_container_jq;
			}
			,add_on_element_jq_arr:[]
			// @ private
			// @ Desc : 화면에 보여줄 element collection set을 추가할 경우 사용하는 메서드. 메타 인포에서 참조시, 등록될 엘리먼트 콜렉션 셋으로는 보이지 않습니다.
			,push_add_on_element_jq:function(add_on_element_jq){
				if(add_on_element_jq == null) return;

				var cur_add_on_element_container_jq = this.get_add_on_element_container_jq();
				if(cur_add_on_element_container_jq == null) return;

				// 추가 엘리먼트를 추가 엘리먼트 컨테이너에 넣습니다. 화면에 표시됩니다.
				cur_add_on_element_container_jq.append(add_on_element_jq);

				// 추가 엘리먼트 참조를 배열에 저장합니다.
				this.add_on_element_jq_arr.push(add_on_element_jq);
			}
			,get_add_on_element_jq_arr:function(){
				return this.add_on_element_jq_arr;
			}
			,add_on_element_collection_set_arr:[]
			// @ private
			// @ Desc : 공식적으로 등록될 element collection set을 추가할 경우 사용하는 메서드
			,push_add_on_element_collection_set:function(add_on_element_collection_set){
				if(add_on_element_collection_set == undefined) return;

				// 공식적으로 등록될 수 있는 참조를 1개로 유지하게 위해 
				// 최상위 top element collection set부터 조사하여 
				// 이전 등록된 add_on_element_collection_set_arr안의 다른 모든 참조를 지웁니다.
				var delegate_do_to_all_element_set = _obj.get_delegate(function(cur_element_set){

					var cur_add_on_element_collection_set_arr = cur_element_set.get_event_manager().get_add_on_element_collection_set_arr();
					var idx;
					var length = cur_add_on_element_collection_set_arr.length;
					for(idx = 0; idx < length; idx++){
						var cur_add_on_element_collection_set = cur_add_on_element_collection_set_arr[idx];
						if(add_on_element_collection_set.get_element_collection_id() == cur_add_on_element_collection_set.get_element_collection_id()){
							cur_element_set.get_event_manager().remove_add_on_element_collection_set(cur_add_on_element_collection_set);
						}
					}

				},this);
				this.call_delegate_do_to_all_element_set(this.get_top_parent_element_collection_set(this), delegate_do_to_all_element_set);


				// 등록된 참조가 없습니다. 새롭게 이 element collection set에 등록해 줍니다.
				this.add_on_element_collection_set_arr.push(add_on_element_collection_set);
				this.push_add_on_element_jq(add_on_element_collection_set.get_element_collection_container_jq());
			}
			// @ private
			// @ Desc : 공식적으로 등록될 element collection set을 제거할 경우 사용하는 메서드
			,remove_add_on_element_collection_set:function(element_collection_set_to_remove){
				if(element_collection_set_to_remove == undefined) return;

				var new_add_on_element_collection_set_arr = [];

				var cur_add_on_element_collection_set_arr = this.get_add_on_element_collection_set_arr();
				var idx;
				var length = cur_add_on_element_collection_set_arr.length;
				for(idx = 0;idx < length; idx++){
					var cur_add_on_element_collection_set = cur_add_on_element_collection_set_arr[idx];
					if(cur_add_on_element_collection_set.get_element_collection_id() === element_collection_set_to_remove.get_element_collection_id()){
						continue;
					}
					new_add_on_element_collection_set_arr.push(cur_add_on_element_collection_set);
				}

				this.add_on_element_collection_set_arr = new_add_on_element_collection_set_arr;
			}
			,get_add_on_element_collection_set_arr:function(){
				return this.add_on_element_collection_set_arr;
			}

			,element_id:""
			,set_element_id:function(element_id){
				if(_v.isNotValidStr(element_id)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_element_jq / _v.isNotValidStr(element_id)");
					return;
				}
				this.element_id = element_id;
			}
			,get_element_id:function(){
				return this.element_id;
			}
			,btn_edit_element_jq:null
			,set_btn_edit_element_jq:function(btn_edit_element_jq){
				if(_v.isNotJQueryObj(btn_edit_element_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_element_jq / _v.isNotJQueryObj(btn_edit_element_jq)");
					return;
				}
				this.btn_edit_element_jq = btn_edit_element_jq;
			}
			,get_btn_edit_element_jq:function(){
				return this.btn_edit_element_jq;
			}
			,show_btn_edit_element_jq:function(){
				if(this.btn_edit_element_jq == null) return;
				if(this.btn_edit_element_jq.length < 1 || 1 < this.btn_edit_element_jq.length){
					console.log("!Error! / show_btn_edit_element_jq / btn_edit_element_jq is not valid!");
					return;
				}
				this.btn_edit_element_jq.show();
			}
			,hide_btn_edit_element_jq:function(){
				if(this.btn_edit_element_jq == null) return;
				if(this.btn_edit_element_jq.length < 1 || 1 < this.btn_edit_element_jq.length){
					console.log("!Error! / hide_btn_edit_element_jq / btn_edit_element_jq is not valid!");
					return;
				}
				this.btn_edit_element_jq.hide();
			}
			,off_btn_edit_element_jq:function(){
				if(this.btn_edit_element_jq == null) return;
				this.btn_edit_element_jq.off();
			}
			,title_jq:null
			,set_title_jq:function(title_jq){
				if(_v.isNotJQueryObj(title_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_jq / _v.isNotJQueryObj(title_jq)");
					return;
				}
				this.title_jq = title_jq;
			}
			// @ Desc : 마지막으로 사용자에게 입력받았던 값
			,set_title_jq_attr_input_value:function(new_title){
				if(this.title_jq == null) return;
				this.title_jq.attr("input_value",new_title);
			}
			,get_title_jq_attr_input_value:function(new_title){
				if(this.title_jq == null) return "";
				return this.title_jq.attr("input_value");
			}
			// @ Desc : DB에서 전달받은 값 (AJAX 업데이트시 수정됩니다.)
			,set_title_jq_attr_tossed_value:function(new_title){
				if(this.title_jq == null) return;
				this.title_jq.attr("tossed_value",new_title);
			}
			,get_title_jq_attr_tossed_value:function(new_title){
				if(this.title_jq == null) return "";
				return this.title_jq.attr("tossed_value");
			}
			,get_title_jq:function(){
				return this.title_jq;
			}
			,show_title_jq:function(){
				if(this.title_jq == null) return;
				this.title_jq.show();
			}
			,hide_title_jq:function(){
				if(this.title_jq == null) return;
				this.title_jq.hide();
			}
			,get_title_jq_value:function(){
				if(this.title_jq == null) return "";

				var cur_value = this.title_jq.val();
				if(_v.isNotValidStr(cur_value)){
					cur_value = this.title_jq.html();
				}

				return cur_value;
			}
			// @ private
			// @ Desc : 말줄임 표시와 상관없이 사용자가 입력한 값 혹은 초기값을 가져옵니다.
			,get_title_jq_untouched_value:function(){
				if(this.title_jq == null) return "";

				var cur_title = this.get_title_jq_attr_input_value();
				if(cur_title == undefined || cur_title == ""){
					cur_title = this.get_title_jq_attr_tossed_value();
				}

				return cur_title;
			}
			,set_title_jq_text:function(new_title, is_change_attr_input_value){

				if(this.title_jq == null) return;
				if(_v.isNotValidStr(new_title)) return;

				this.title_jq.html(new_title);

				// 말줄임표와 관계없이 사용자가 입력한 값을 저장하는 input_value 속성에 값을 변경해줍니다.
				if(is_change_attr_input_value === true) {
					this.set_title_jq_attr_input_value(new_title);	
				}
			}
			,show_title_jq_text_head:function(){
				if(this.title_jq == null && this.title_input_jq == null) return;
				// 포커싱 시에 노출되는 타이틀 길이를 줄여줍니다.
				var _html = airborne.html;
				var cur_title_jq_value = this.get_title_jq_value();
				var cur_text_head = _html.getTextHead(cur_title_jq_value, 10);

				// 새로운 값이라면 변경, 아니면 중단
				if(cur_text_head == cur_title_jq_value) return;

				// 만일 텍스트 변경으로 엘리먼트의 높이가 변경되었다면 원래 텍스트로 복원합니다.
				// 마우스 이벤트 점검시, mouse over-mouse leave가 무한 루프에 걸릴수 있습니다.
				var prev_height = this.get_title_jq().outerHeight();

				this.set_title_jq_text(cur_text_head, false);
				var next_height = this.get_title_jq().outerHeight();
				if(prev_height != next_height){
					this.set_title_jq_text(cur_title_jq_value, false);
				}
			}
			,hide_title_jq_text_head:function(){
				var _v = airborne.validator;
				var cur_title_jq = this.get_title_jq();
				if(cur_title_jq == null && this.title_input_jq == null) return;

				// 포커싱 시에 노출되는 타이틀 길이를 줄여준 것을 원래대로 돌려놓습니다.
				// 자신의 엘리먼트의 속성(어트리뷰트)으로 지정된 값을 참조합니다.
				// 변수에 저장된 값을 참조할 경우, 이벤트 혼선으로 주변 값을 참조하는 경우가 발생합니다.
				var cur_tossed_value = this.get_title_jq_attr_tossed_value();
				var cur_input_value = this.get_title_input_jq_value();
				var cur_title_value = this.get_title_jq_value();

				// 사용자 입력 값이 없고, 현재 타이틀과 처음 받은 타이틀 값이 같음. 중단.
				if(_v.is_not_valid_str(cur_input_value) && cur_tossed_value == cur_title_value){
					return;
				}

				// 사용자 입력 값이 있고, 입력값이 처음 받은 타이틀과 같음. 중단.
				if(_v.is_valid_str(cur_input_value) && cur_tossed_value == cur_input_value){
					return;
				}

				if(_v.is_valid_str(cur_tossed_value)){
					this.set_title_jq_text(cur_tossed_value, true);
				}				

				// REMOVE ME - 이전에 입력한 값을 덮어씌우는 에러가 있음.
				/*
				if(_v.is_valid_str(cur_input_value)) {
					this.set_title_jq_text(cur_input_value, true);
				} else if(_v.is_valid_str(cur_tossed_value)){
					this.set_title_jq_text(cur_tossed_value, true);
				}
				*/

				// 사용자 입력 값을 초기화합니다.
				this.clear_title_input_jq_value();

			}
			,rollback_title_jq_text:function(){
				// 사용자가 입력한 값을 취소하고 최초 값으로 복원합니다.

				var _obj = airborne.bootstrap.obj;
				// not allowed search list type.
				if(	_obj.ELEMENT_TYPE_SEARCH_LIST == this.get_element_type() || 
					_obj.ELEMENT_TYPE_TABLE_SEARCH_LIST == this.get_element_type()) {
					return;
				}

				var cur_prev_value = this.get_title_input_jq_prev_value();
				if(_v.isNotValidStr(cur_prev_value)) return;

				this.set_title_jq_text(cur_prev_value, true);
			}
			,parent_container_jq:null
			,set_parent_container_jq:function(parent_container_jq){
				if(_v.isNotJQueryObj(parent_container_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_parent_container_jq / _v.isNotJQueryObj(parent_container_jq)");
					return;
				}
				this.parent_container_jq = parent_container_jq;
			}
			,get_parent_container_jq:function(){
				return this.parent_container_jq;
			}
			,show_parent_container_jq:function(){
				if(this.parent_container_jq == null) return;
				if(this.parent_container_jq.length < 1 || 1 < this.parent_container_jq.length){
					console.log("!Error! / show_parent_container_jq / parent_container_jq is not valid!");
					return;
				}
				this.parent_container_jq.show();
			}
			,hide_parent_container_jq:function(){
				if(this.parent_container_jq == null) return;
				this.parent_container_jq.hide();
			}
			,title_input_group_jq:null //input group has input_jq, input_btn_ok_jq n input_btn_cancel_jq
			,set_title_input_group_jq:function(title_input_group_jq){
				if(_v.isNotJQueryObj(title_input_group_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_element_jq / _v.isNotJQueryObj(title_input_group_jq)");
					return;
				}
				this.title_input_group_jq = title_input_group_jq;
			}
			,get_title_input_group_jq:function(){
				return this.title_input_group_jq;
			}
			,show_title_input_group_jq:function(){
				if(this.title_input_group_jq == null) return;
				this.title_input_group_jq.show();
			}
			,hide_title_input_group_jq:function(){
				if(this.title_input_group_jq == null) return;
				this.title_input_group_jq.hide();
			}
			,delegte_move_title_input_group_jq:null
			,get_delegte_move_title_input_group_jq:function(){
				return this.delegte_move_title_input_group_jq;
			}
			,set_delegte_move_title_input_group_jq:function(delegte_move_title_input_group_jq){
				if(_obj.isNotValidDelegate(delegte_move_title_input_group_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_save_n_reload / _obj.isNotValidDelegate(delegte_move_title_input_group_jq)");
					return;
				}
				this.delegte_move_title_input_group_jq = delegte_move_title_input_group_jq;
			}
			,delegte_before_save_n_reload:null
			,get_delegte_before_save_n_reload:function(){
				return this.delegte_before_save_n_reload;
			}
			,set_delegte_before_save_n_reload:function(delegte_before_save_n_reload){
				if(_obj.isNotValidDelegate(delegte_before_save_n_reload)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_save_n_reload / _obj.isNotValidDelegate(delegte_before_save_n_reload)");
					return;
				}
				this.delegte_before_save_n_reload = delegte_before_save_n_reload;
			}
			,call_delegate_before_save_n_reload:function(){

				if(this.delegte_before_save_n_reload == null) return;
				this.delegte_before_save_n_reload._func.apply(this.delegte_before_save_n_reload._scope,[this]);
			}
			,move_title_input_group_jq:function(){
				var cur_element_container_jq = this.get_element_container_jq();
				if(cur_element_container_jq == null){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / move_title_input_group_jq / cur_element_container_jq");
					return;	
				}

				var cur_title_input_group_jq = this.get_title_input_group_jq();
				if(cur_title_input_group_jq == null){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / move_title_input_group_jq / cur_title_input_group_jq == null)");
					return;	
				}

				var cur_delegte_move_title_input_group_jq = this.get_delegte_move_title_input_group_jq();
				if(cur_delegte_move_title_input_group_jq == null){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / move_title_input_group_jq / cur_delegte_move_title_input_group_jq == null)");
					return;
				}

				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == null){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / move_title_input_group_jq / cur_element_jq == null)");
					return;
				}

				cur_delegte_move_title_input_group_jq._func.apply(
					cur_delegte_move_title_input_group_jq._scope
					, [cur_element_jq, cur_element_container_jq,cur_title_input_group_jq]
				);
			}
			,title_input_label_jq:null 
			,set_title_input_label_jq:function(title_input_label_jq){
				if(_v.isNotJQueryObj(title_input_label_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_input_label_jq / _v.isNotJQueryObj(title_input_label_jq)");
					return;
				}
				this.title_input_label_jq = title_input_label_jq;
			}
			,get_title_input_label_jq:function(){
				return this.title_input_label_jq;
			}
			,show_title_input_label_jq:function(){
				if(this.title_input_label_jq == null) return;
				this.title_input_label_jq.show();
			}
			,hide_title_input_label_jq:function(){
				if(this.title_input_label_jq == null) return;
				this.title_input_label_jq.hide();
			}
			,set_title_input_label:function(new_label){
				if(this.title_input_label_jq == null) return;
				this.title_input_label_jq.html(new_label);
			}
			,title_input_jq:null 
			,set_title_input_jq:function(title_input_jq){
				if(_v.isNotJQueryObj(title_input_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_input_jq / _v.isNotJQueryObj(title_input_jq)");
					return;
				}
				this.title_input_jq = title_input_jq;
			}
			,get_title_input_jq:function(){
				return this.title_input_jq;
			}
			,show_title_input_jq:function(){
				if(this.title_input_jq == null) return;
				this.title_input_jq.show();
			}
			,hide_title_input_jq:function(){
				if(this.title_input_jq == null) return;
				this.title_input_jq.hide();
			}
			,focus_title_input_jq:function(){
				if(this.title_input_jq == null) return;
				this.title_input_jq.focus();
			}
			,clear_title_input_jq_value:function(){
				if(this.title_input_jq == null) return;
				this.title_input_jq.val("");
			}
			,set_title_input_jq_value:function(new_title){
				if(this.title_input_jq == null) return;
				if(_v.isNotValidStr(new_title)) return;

				this.title_input_jq.val(new_title);
			}
			,get_title_input_jq_value:function(){
				if(this.title_input_jq == null) return;
				return this.title_input_jq.val();
			}
			,set_title_input_jq_prev_value:function(prev_value){

				if(this.title_input_jq == null) return;
				if(_v.isNotValidStr(prev_value)) return;

				// TODO html safe 필터링 필요.

				this.title_input_jq.attr("prev_val",prev_value);
			}
			,clear_title_input_jq_prev_value:function(){
				if(this.title_input_jq == null) return;
				this.title_input_jq.attr("prev_val","");
			}
			,get_title_input_jq_prev_value:function(){
				if(this.title_input_jq == null) return;

				var cur_prev_value = this.title_input_jq.attr("prev_val");
				if(_v.isNotValidStr(cur_prev_value)){
					cur_prev_value = "";
				}

				return cur_prev_value;
			}
			,set_title_input_jq_watch_dog_interval:function(){
				var _self = this;
				if(this.input_onchange_interval == null){

					var cur_title_jq_value = this.get_title_jq_value();
					this.clear_title_input_jq_prev_value();

					var cur_title_jq_value = this.get_title_jq_value();
					var cur_title_jq_attr_tossed_value = this.get_title_jq_attr_tossed_value();

					this.set_title_input_jq_prev_value(this.get_title_jq_value());

					this.input_onchange_interval = setInterval(function(){
						// update title text
						var cur_search_keyword = _self.get_title_input_jq_value();
						_self.set_title_jq_text(cur_search_keyword, true);

					},300);
				}				
			}
			,set_title_input_jq_search_list_watch_dog_interval:function(){
				var _self = this;
				if(this.input_onchange_interval == null){

					_self.clear_title_input_jq_prev_value();

					this.input_onchange_interval = setInterval(function(){

						// check input text every 300 millisec
						// 사용자가 입력한 검색 키워드를 0.3초마다 가져와서 리스트에 표시합니다.
						var prev_search_keyword = _self.get_title_input_jq_prev_value();
						var cur_search_keyword = _self.get_title_input_jq_value();

						if( cur_search_keyword != null && 
							prev_search_keyword != cur_search_keyword){

							// update prev_search_keyword
							_self.set_title_input_jq_prev_value(cur_search_keyword);

							// search kerword
							_self.search_keyword_in_search_output_list_jq(cur_search_keyword);
						}
					},300);
				}			
			}
			,clear_title_input_jq_watch_dog_interval:function(){
				if(this.input_onchange_interval != null){
					window.clearInterval(this.input_onchange_interval);
					this.input_onchange_interval = null;
				}
			}
			,title_input_container_jq:null 
			,set_title_input_container_jq:function(title_input_container_jq){
				if(_v.isNotJQueryObj(title_input_container_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_input_container_jq / _v.isNotJQueryObj(title_input_container_jq)");
					return;
				}
				this.title_input_container_jq = title_input_container_jq;
			}
			,get_title_input_container_jq:function(){
				return this.title_input_container_jq;
			}
			,show_title_input_container_jq:function(){
				if(this.title_input_container_jq == null) return;
				this.title_input_container_jq.show();
			}
			,hide_title_input_container_jq:function(){
				if(this.title_input_container_jq == null) return;
				this.title_input_container_jq.hide();
			}
			,title_input_btn_ok_jq:null
			,set_title_input_btn_ok_jq:function(title_input_btn_ok_jq){
				if(_v.isNotJQueryObj(title_input_btn_ok_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_element_jq / _v.isNotJQueryObj(title_input_btn_ok_jq)");
					return;
				}
				this.title_input_btn_ok_jq = title_input_btn_ok_jq;
			}
			,get_title_input_btn_ok_jq:function(){
				return this.title_input_btn_ok_jq;
			}
			,show_title_input_btn_ok_jq:function(){
				if(this.title_input_btn_ok_jq == null) return;
				this.title_input_btn_ok_jq.show();
			}
			,hide_title_input_btn_ok_jq:function(){
				if(this.title_input_btn_ok_jq == null) return;
				this.title_input_btn_ok_jq.hide();
			}
			,off_title_input_btn_ok_jq:function(){
				if(this.title_input_btn_ok_jq == null) return;
				this.title_input_btn_ok_jq.off();
			}
			,title_input_btn_cancel_jq:null
			,set_title_input_btn_cancel_jq:function(title_input_btn_cancel_jq){
				if(_v.isNotJQueryObj(title_input_btn_cancel_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_input_btn_cancel_jq / _v.isNotJQueryObj(title_input_btn_cancel_jq)");
					return;
				}
				this.title_input_btn_cancel_jq = title_input_btn_cancel_jq;
			}
			,get_title_input_btn_cancel_jq:function(){
				return this.title_input_btn_cancel_jq;
			}
			,show_title_input_btn_cancel_jq:function(){
				if(this.title_input_btn_cancel_jq == null) return;
				this.title_input_btn_cancel_jq.show();
			}
			,hide_title_input_btn_cancel_jq:function(){
				if(this.title_input_btn_cancel_jq == null) return;
				if(this.title_input_btn_cancel_jq.length < 1 || 1 < this.title_input_btn_cancel_jq.length){
					console.log("!Error! / hide_title_input_btn_cancel_jq / title input btn cancel is not valid!");
					return;
				}
				this.title_input_btn_cancel_jq.hide();
			}
			,off_title_input_btn_cancel_jq:function(){
				if(this.title_input_btn_cancel_jq == null) return;
				this.title_input_btn_cancel_jq.off();
			}
			,delegate_save_n_reload:null
			,set_delegate_save_n_reload:function(delegate_save_n_reload){
				if(_obj.isNotValidDelegate(delegate_save_n_reload)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_save_n_reload / _obj.isNotValidDelegate(delegate_save_n_reload)");
					return;
				}
				this.delegate_save_n_reload = delegate_save_n_reload;
			}
			,get_delegate_save_n_reload:function(){
				return this.delegate_save_n_reload;
			}
			,get_element_type:function(element_type){
				var cur_element_meta_info = this.get_element_meta_info();
				if(cur_element_meta_info==null || cur_element_meta_info.get_element_type()==null) return null;
				return element_meta_info.get_element_type();
			}
			,call_delegate_save_n_reload:function(cur_element_type, cur_event_type, cur_search_option_obj){

				// @ Desc : 추가, 변경, 삭제시의 정보를 전달합니다.

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(_obj.is_not_valid_element_type(cur_element_type)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / call_delegate_save_n_reload / _obj.is_not_valid_element_type(cur_element_type)");
					return;
				}

				if(_obj.is_not_valid_event_type(cur_event_type)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / call_delegate_save_n_reload / _obj.is_not_valid_event_type(cur_event_type)");
					return;
				}
				var cur_delegate_save_n_reload = this.get_delegate_save_n_reload();
				if(_obj.isNotValidDelegate(cur_delegate_save_n_reload)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / call_delegate_save_n_reload / _obj.isNotValidDelegate(cur_delegate_save_n_reload");
					return;
				}

				this.call_delegate_before_save_n_reload();


				var cur_element_meta_info = this.get_element_meta_info();
				var cur_element_prop_map = cur_element_meta_info.get_prop_map();
				var cur_element_id = null;
				var cur_element_key = null;
				var cur_element_value = null;

				console.log("변경된 데이터를 저장하기 전에 자신의 element json 정보를 업데이트 합니다.");

				if( (_obj.ELEMENT_TYPE_SEARCH_LIST == cur_element_type || _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST == cur_element_type) && 
					_obj.EVENT_TYPE_UPDATE_ITEM == cur_event_type ){

					if(_obj.is_not_valid_search_option(cur_search_option_obj)){
						console.log("!Error! / airborne.bootstrap.obj / element_event_manager / call_delegate_save_n_reload / this.is_not_valid_search_option(cur_search_option_obj)");
						return;
					}

					cur_element_id = cur_element_meta_info.get_element_id();
					cur_element_key = cur_search_option_obj.select_option_key;
					cur_element_value = cur_search_option_obj.select_option_value;

					// 변경된 데이터를 저장하기 전에 자신의 element json 정보를 업데이트 합니다.
					var cur_element_json = cur_element_meta_info.get_element_json();
					cur_element_json.get_element_meta_info().set_column_text(cur_element_key);

					var cur_field_option = cur_element_json.get_field_option();
					cur_field_option.set_key(cur_element_key);

					//console.log(">>> cur_element_json.get_element_meta_info() : ",cur_element_json.get_element_meta_info().set_column_text(cur_element_key));

				} else if( 	_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || 
							_obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type ||
							_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type ||
							_obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_element_type ){

					if(_obj.EVENT_TYPE_UPDATE_ITEM == cur_event_type){

						cur_element_id = cur_element_meta_info.get_element_id();
						cur_element_key = "__seconds";
						cur_element_value = ""+cur_element_prop_map.__seconds;

					}

				} else if( 	_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type || _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type ){

					if(_obj.EVENT_TYPE_UPDATE_ITEM == cur_event_type){

						cur_element_id = cur_element_meta_info.get_element_id();
						cur_element_key = "__time_hh_mm";
						cur_element_value = ""+cur_element_prop_map.__seconds;

					}

				} else if( (_obj.ELEMENT_TYPE_INPUT_TEXT == cur_element_type || 
							_obj.ELEMENT_TYPE_TABLE_INPUT_TEXT == cur_element_type || 
							_obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT == cur_element_type || 
							_obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY == cur_element_type) && 
							_obj.EVENT_TYPE_UPDATE_ITEM == cur_event_type ){

					cur_element_id = cur_element_meta_info.get_element_id();
					// key & value 를 모두 동일하게 설정
					cur_element_key = this.get_title_jq_value();
					cur_element_value = cur_element_key;

				} else if( _obj.EVENT_TYPE_INSERT_ITEM == cur_event_type || _obj.EVENT_TYPE_DELETE_ITEM == cur_event_type ){

					cur_element_id = cur_element_meta_info.get_element_id();
					// key & value 를 모두 동일하게 설정
					cur_element_key = this.get_title_jq_value();
					cur_element_value = cur_element_key;

				}
				cur_element_prop_map.__element_event_manager = this;

				var cur_outcome_obj = _obj.get_outcome_obj(cur_element_id, cur_element_key, cur_element_value, cur_event_type, cur_element_prop_map);
				cur_delegate_save_n_reload._func.apply(cur_delegate_save_n_reload._scope,[cur_outcome_obj]);
			}







			// @ optional
			,title_input_btn_search_jq:null
			,set_title_input_btn_search_jq:function(title_input_btn_search_jq){
				if(_v.isNotJQueryObj(title_input_btn_search_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_input_btn_search_jq / _v.isNotJQueryObj(title_input_btn_cancel_jq)");
					return;
				}
				this.title_input_btn_search_jq = title_input_btn_search_jq;
			}
			,get_title_input_btn_search_jq:function(){
				return this.title_input_btn_search_jq;
			}
			,show_title_input_btn_search_jq:function(){
				if(this.title_input_btn_search_jq == null) return;
				this.title_input_btn_search_jq.show();
			}
			,hide_title_input_btn_search_jq:function(){
				if(this.title_input_btn_search_jq == null) return;
				this.title_input_btn_search_jq.hide();
			}
			,off_title_input_btn_search_jq:function(){
				if(this.title_input_btn_search_jq == null) return;
				this.title_input_btn_search_jq.off();
			}
			,btn_add_element_jq:null
			,set_btn_add_element_jq:function(btn_add_element_jq){
				if(_v.isNotJQueryObj(btn_add_element_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_btn_add_element_jq / _v.isNotJQueryObj(btn_add_element_jq)");
					return;
				}
				this.btn_add_element_jq = btn_add_element_jq;
			}
			,get_btn_add_element_jq:function(){
				return this.btn_add_element_jq;
			}
			,show_btn_add_element_jq:function(){
				if(this.btn_add_element_jq == null) return;
				this.btn_add_element_jq.show();
			}
			,hide_btn_add_element_jq:function(){
				if(this.btn_add_element_jq == null) return;
				if(this.btn_add_element_jq.length < 1 || 1 < this.btn_add_element_jq.length){
					console.log("!Error! / btn_add_element_jq / btn_add_element_jq is not valid!");
					return;
				}
				this.btn_add_element_jq.hide();
			}
			,off_btn_add_element_jq:function(){
				if(this.btn_add_element_jq == null) return;
				this.btn_add_element_jq.off();
			}
			,btn_remove_element_jq:null
			,set_btn_remove_element_jq:function(btn_remove_element_jq){
				if(_v.isNotJQueryObj(btn_remove_element_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_btn_remove_element_jq / _v.isNotJQueryObj(btn_remove_element_jq)");
					return;
				}
				this.btn_remove_element_jq = btn_remove_element_jq;
			}
			,get_btn_remove_element_jq:function(){
				return this.btn_remove_element_jq;
			}
			,show_btn_remove_element_jq:function(){
				if(this.btn_remove_element_jq == null) return;
				this.btn_remove_element_jq.show();
			}
			,hide_btn_remove_element_jq:function(){
				if(this.btn_remove_element_jq == null) return;
				if(this.btn_remove_element_jq.length < 1 || 1 < this.btn_remove_element_jq.length){
					console.log("!Error! / hide_btn_remove_element_jq / btn_remove_element_jq is not valid!");
					return;
				}
				this.btn_remove_element_jq.hide();
			}
			,off_btn_remove_element_jq:function(){
				if(this.btn_remove_element_jq == null) return;
				this.btn_remove_element_jq.off();
			}
			// @ Desc : list row를 jump 시키기 위한 버튼
			,btn_eject_element_jq:null
			,set_btn_eject_element_jq:function(btn_eject_element_jq){
				if(_v.isNotJQueryObj(btn_eject_element_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_btn_eject_element_jq / _v.isNotJQueryObj(btn_eject_element_jq)");
					return;
				}
				this.btn_eject_element_jq = btn_eject_element_jq;
			}
			,get_btn_eject_element_jq:function(){
				return this.btn_eject_element_jq;
			}
			,show_btn_eject_element_jq:function(){
				if(this.btn_eject_element_jq == null) return;
				this.btn_eject_element_jq.show();
			}
			,hide_btn_eject_element_jq:function(){
				if(this.btn_eject_element_jq == null) return;
				if(this.btn_eject_element_jq.length < 1 || 1 < this.btn_eject_element_jq.length){
					console.log("!Error! / hide_btn_eject_element_jq / btn_eject_element_jq is not valid!");
					return;
				}
				this.btn_eject_element_jq.hide();
			}
			,off_btn_eject_element_jq:function(){
				if(this.btn_eject_element_jq == null) return;
				this.btn_eject_element_jq.off();
			}
			,btn_eject_collection_element_jq:null
			,set_btn_eject_collection_element_jq:function(btn_eject_collection_element_jq) {
				if(_v.isNotJQueryObj(btn_eject_collection_element_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_btn_eject_collection_element_jq / _v.isNotJQueryObj(btn_eject_element_jq)");
					return;
				}
				this.btn_eject_collection_element_jq = btn_eject_collection_element_jq;

			}
			,get_btn_eject_collection_element_jq:function() {
				return this.btn_eject_collection_element_jq;
			}
			,show_btn_eject_collection_element_jq:function() {
				if(this.btn_eject_collection_element_jq == null) return;
				return this.btn_eject_collection_element_jq.show();
			}
			,hide_btn_eject_collection_element_jq:function() {
				if(this.btn_eject_collection_element_jq == null) return;
				return this.btn_eject_collection_element_jq.hide();
			}
			,delegate_btn_eject_click:null
			,set_delegate_btn_eject_click:function(delegate_btn_eject_click){
				if(_obj.isNotValidDelegate(delegate_btn_eject_click)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_btn_eject_click / _obj.isNotValidDelegate(delegate_btn_eject_click)");
					return;
				}
				this.delegate_btn_eject_click = delegate_btn_eject_click;
			}
			,get_delegate_btn_eject_click:function(){
				return this.delegate_btn_eject_click;
			}
			,call_delegate_btn_eject_click:function(event_click){
				if(this.delegate_btn_eject_click == null) return;
				this.delegate_btn_eject_click._func.apply(this.delegate_btn_eject_click._scope,[event_click, this]);
			}
			// @ Desc : 형제 엘리먼트 셋 배열을 돌려줍니다. 기본적으로 자신과 shy mode 엘리먼트는 제외됩니다.
			,get_sibling_element_set_arr:function(has_myself, has_shy_child){

				var _v = airborne.validator;

				var cur_sibling_element_set_arr = [];
				var cur_sibling_element_event_manager_arr = this.get_sibling_element_event_manager_arr(has_myself, has_shy_child);
				if(_v.is_not_valid_array(cur_sibling_element_event_manager_arr)){
					return cur_sibling_element_set_arr;
				}

				var idx;
				var length = cur_sibling_element_event_manager_arr.length;
				for(idx = 0; idx < length; idx++){

					var cur_event_manager = cur_sibling_element_event_manager_arr[idx];
					if(cur_event_manager == undefined){
						continue;
					}

					cur_sibling_element_set_arr.push(cur_event_manager.get_element_set());
				}

				return cur_sibling_element_set_arr;

			}
			,parent_element_event_manager:null
			,sibling_element_event_manager_arr:null
			// @ Desc : 형제 엘리먼트 이벤트 매니저 배열을 돌려줍니다.
			,get_sibling_element_event_manager_arr:function(has_myself, has_shy_child){

				if(has_myself == undefined && has_myself != true && has_myself != false) {
					has_myself = false;
				}

				if(has_shy_child == undefined && has_shy_child != true && has_shy_child != false) {
					has_shy_child = false;
				}
				
				var cur_sibling_element_event_manager_arr = [];
				var cur_before_sibling_element_event_manager_arr = this.get_before_sibling_element_event_manager_arr(has_shy_child);
				var cur_after_sibling_element_event_manager_arr = this.get_after_sibling_element_event_manager_arr(has_shy_child);

				cur_sibling_element_event_manager_arr = 
				cur_sibling_element_event_manager_arr.concat(cur_before_sibling_element_event_manager_arr);

				if(has_myself === true){
					if(this.get_element_meta_info().get_is_shy() === true && has_shy_child === true) {
						// 1.자신이 shy row인 경우
						cur_sibling_element_event_manager_arr.push(this);
					} else if(this.get_element_meta_info().get_is_shy() === false) {
						// 2.자신이 shy row가 아닌 경우
						cur_sibling_element_event_manager_arr.push(this);
					}
				}

				cur_sibling_element_event_manager_arr = 
				cur_sibling_element_event_manager_arr.concat(cur_after_sibling_element_event_manager_arr);

				return cur_sibling_element_event_manager_arr;

			}
			,get_before_sibling_element_event_manager_arr:function(has_shy_child){

				if(has_shy_child == undefined && has_shy_child != true && has_shy_child != false) {
					has_shy_child = false;
				}

				if(this.get_before_sibling_event_manager() == null) return [];

				var cur_before_sibling_element_event_manager = this.get_before_sibling_event_manager();
				var cur_before_sibling_element_event_manager_arr = [];

				if(has_shy_child === true && cur_before_sibling_element_event_manager.get_element_meta_info().get_is_shy() === true) {

					cur_before_sibling_element_event_manager_arr.unshift(cur_before_sibling_element_event_manager);

				} else if(cur_before_sibling_element_event_manager.get_element_meta_info().get_is_shy() === false) {

					cur_before_sibling_element_event_manager_arr.unshift(cur_before_sibling_element_event_manager);

				}


				var loop_limit_counter = 0;
				var loop_limit = 1000;
				while(cur_before_sibling_element_event_manager.get_before_sibling_event_manager() != null){
					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_before_sibling_element_event_manager = cur_before_sibling_element_event_manager.get_before_sibling_event_manager();

					if(cur_before_sibling_element_event_manager == null) break;

					if( has_shy_child === true && 
						cur_before_sibling_element_event_manager.get_element_meta_info().get_is_shy() === true){

						// shy mode 객체일 경우에도 포함.
						cur_before_sibling_element_event_manager_arr.unshift(cur_before_sibling_element_event_manager);

					} else if(cur_before_sibling_element_event_manager.get_element_meta_info().get_is_shy() === false){

						// shy mode 객체가 아닌 경우만 포함.
						cur_before_sibling_element_event_manager_arr.unshift(cur_before_sibling_element_event_manager);

					}

					// check loop
					loop_limit_counter++;
					if(loop_limit_counter > loop_limit){
						console.log("!Error! / get_before_sibling_element_event_manager_arr / loop_limit_counter > loop_limit");
						return;
					}
				}

				return cur_before_sibling_element_event_manager_arr;
			}
			,get_after_sibling_element_event_manager_arr:function(has_shy_child){

				if(has_shy_child == undefined && has_shy_child != true && has_shy_child != false) {
					has_shy_child = false;
				}

				if(this.get_after_sibling_event_manager() == null) return [];

				var cur_after_sibling_element_event_manager = this.get_after_sibling_event_manager();
				var cur_after_sibling_element_event_manager_arr = [cur_after_sibling_element_event_manager];

				var loop_limit_counter = 0;
				var loop_limit = 1000;
				while(cur_after_sibling_element_event_manager.get_after_sibling_event_manager() != null){

					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_after_sibling_element_event_manager = cur_after_sibling_element_event_manager.get_after_sibling_event_manager();
					if(cur_after_sibling_element_event_manager == null) break;

					if( has_shy_child === true && 
						cur_after_sibling_element_event_manager.get_element_meta_info().get_is_shy() === true){

						// shy mode 객체일 경우에도 포함.
						cur_after_sibling_element_event_manager_arr.push(cur_after_sibling_element_event_manager);

					} else if(cur_after_sibling_element_event_manager.get_element_meta_info().get_is_shy() === false){

						// shy mode 객체가 아닌 경우만 포함.
						cur_after_sibling_element_event_manager_arr.push(cur_after_sibling_element_event_manager);

					}

					// check loop
					loop_limit_counter++;
					if(loop_limit_counter > loop_limit){
						console.log("!Error! / get_after_sibling_element_event_manager_arr / loop_limit_counter > loop_limit");
						return;
					}
				}

				return cur_after_sibling_element_event_manager_arr;
			}
			// @ Desc : 모든 형제 엘리먼트 셋을 가져온다. shy mode 제외. 자신의 부모가 있다면 다른 형제 부모들의 자식 엘리먼트 셋도 가져온다.
			,get_all_sibling_element_set_arr:function(){

				var cur_all_sibling_element_set_arr = [];

				// 나의 형제 엘리먼트 셋을 받음 (shy mode 제외)
				var cur_element_collection_set = this.get_element_set().get_element_collection_set();
				if(cur_element_collection_set == null) return cur_all_sibling_element_set_arr;

				
				var cur_parent_element_set = cur_element_collection_set.get_parent_element_set();
				if(cur_parent_element_set != undefined){

					// 부모 객체가 있는 경우.
					// 다른 부모의 자신과 같은 깊이의 형제 엘리먼트를 모두 가져온다.
					var cur_parent_element_collection_set = cur_element_collection_set.get_parent_element_set().get_element_collection_set();
					if(cur_parent_element_collection_set == null) return cur_all_sibling_element_set_arr;

					var parent_element_set_arr = cur_parent_element_collection_set.get_element_set_arr();
					if(_v.is_not_valid_array(parent_element_set_arr)) return cur_all_sibling_element_set_arr;
					
					for(var idx = 0; idx < parent_element_set_arr.length; idx++){
						var cur_parent_element_set = parent_element_set_arr[idx];

						var cur_children_element_collection_set_arr = cur_parent_element_set.get_children_element_collection_set_arr();
						if(_v.is_not_valid_array(cur_children_element_collection_set_arr)) continue;

						for(var inner_idx = 0; inner_idx < cur_children_element_collection_set_arr.length; inner_idx++){
							var cur_child_element_collection_set = cur_children_element_collection_set_arr[inner_idx];
							if(cur_child_element_collection_set == null) continue;

							var cur_child_element_set_arr = cur_child_element_collection_set.get_element_set_arr();
							if(_v.is_not_valid_array(cur_child_element_set_arr)) continue;

							for(var deep_idx = 0; deep_idx < cur_child_element_set_arr.length; deep_idx++){
								var cur_child_element_set = cur_child_element_set_arr[deep_idx];
								if(cur_child_element_set.get_meta_info().get_is_shy()) continue;

								// 자기 자신은 제외한다.
								if(cur_child_element_set.get_meta_info().get_element_id() == this.get_element_meta_info().get_element_id()) continue;

								cur_all_sibling_element_set_arr.push(cur_child_element_set);

							} // for deep end
						} // for inner end
					} // for end

				} else {

					// 자신이 최상위 객체라면 부모 객체가 없다.
					// 자신의 형제들만 가져온다.
					cur_all_sibling_element_set_arr = this.get_sibling_element_set_arr(false/*has_myself*/,false/*has_shy_mode*/);

				}

				return cur_all_sibling_element_set_arr;
			}
			// @ Desc : 리스트 형의 엘리먼트의 경우, 이전 열에 대한 이벤트 객체 참조를 저장
			,before_sibling_event_manager:null
			,set_before_sibling_event_manager:function(before_sibling_event_manager){
				this.before_sibling_event_manager = before_sibling_event_manager;
			}
			,get_before_sibling_event_manager:function(){
				return this.before_sibling_event_manager;
			}
			// @ Desc : 리스트 형의 엘리먼트의 경우, 이후 열에 대한 이벤트 객체 참조를 저장
			,after_sibling_event_manager:null
			,set_after_sibling_event_manager:function(after_sibling_event_manager){
				this.after_sibling_event_manager = after_sibling_event_manager;
			}
			,get_after_sibling_event_manager:function(){
				return this.after_sibling_event_manager;
			}
			// @ Desc : 형제 관계가 변경될 경우의 업데이트 로직
			,set_before_n_after_siblings_event_manager:function(new_before_sibling_event_manager, new_after_sibling_event_manager){

				// event manager의 형제 관계를 다시 세팅합니다.
				// 기존의 형제 엘리먼트들 관계에서 자신을 제거합니다.
				var cur_before_sibling_event_manager = this.get_before_sibling_event_manager();
				this.set_before_sibling_event_manager(null);
				var cur_after_sibling_event_manager = this.get_after_sibling_event_manager();
				this.set_after_sibling_event_manager(null);
				if(cur_before_sibling_event_manager != undefined){
					cur_before_sibling_event_manager.set_after_sibling_event_manager(cur_after_sibling_event_manager);
				}
				if(cur_after_sibling_event_manager != undefined){
					cur_after_sibling_event_manager.set_before_sibling_event_manager(cur_before_sibling_event_manager);
				}

				// 사용자가 이동 중인 엘리먼트가 들어갈 위치의 아래쪽의 엘리먼트
				if(new_before_sibling_event_manager != undefined){
					new_before_sibling_event_manager.set_after_sibling_event_manager(this);	
					this.set_before_sibling_event_manager(new_before_sibling_event_manager);
				}
				// 사용자가 이동 중인 엘리먼트가 들어갈 위치의 위쪽의 엘리먼트
				if(new_after_sibling_event_manager != undefined){
					new_after_sibling_event_manager.set_before_sibling_event_manager(this);	
					this.set_after_sibling_event_manager(new_after_sibling_event_manager);
				}

				
				// 현재의 엘리먼트 셋 배열에서 이동한 엘리먼트 셋 배열로 이동해야 합니다.
				// 1. 현재의 엘리먼트 셋 배열에서 제거합니다.
				var new_sibling_event_manager = null;
				if(new_before_sibling_event_manager != undefined){
					new_sibling_event_manager = new_before_sibling_event_manager;
				}
				if(new_after_sibling_event_manager != undefined){
					new_sibling_event_manager = new_after_sibling_event_manager;
				}
				if(new_sibling_event_manager == undefined){
					return;
				}

				var cur_element_set = this.get_element_set();
				var prev_element_collection_set = cur_element_set.get_element_collection_set();
				var new_sibling_element_set = new_sibling_event_manager.get_element_set();
				var next_element_collection_set = new_sibling_element_set.get_element_collection_set();

				// 자신을 이전 element collection set에서 제거합니다.
				prev_element_collection_set.remove_element_set(this.get_element_set());

				// 자신을 이전 element collection set에서 새로운 인덱스에 추가합니다.
				var before_element_set;
				if(new_before_sibling_event_manager != undefined){
					before_element_set = new_before_sibling_event_manager.get_element_set();
				}
				var after_element_set;
				if(new_after_sibling_event_manager != undefined){
					after_element_set = new_after_sibling_event_manager.get_element_set();
				}
				next_element_collection_set.add_element_set(
					before_element_set
					,this.get_element_set()
					,after_element_set
				);

			}


			,children_jq_arr:null
			,children_element_event_manager_arr:null
			,searchable_combo_box_jq:null
			,set_searchable_combo_box_jq:function(searchable_combo_box_jq){
				if(_v.isNotJQueryObj(searchable_combo_box_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_searchable_combo_box_jq / _v.isNotJQueryObj(searchable_combo_box_jq)");
					return;
				}
				this.searchable_combo_box_jq = searchable_combo_box_jq;
			}
			,get_searchable_combo_box_jq:function(){
				return this.searchable_combo_box_jq;
			}
			,show_searchable_combo_box_jq:function(){
				if(this.searchable_combo_box_jq == null) return;
				this.searchable_combo_box_jq.show();
			}
			,hide_searchable_combo_box_jq:function(){
				if(this.searchable_combo_box_jq == null) return;
				if(this.searchable_combo_box_jq.length < 1 || 1 < this.searchable_combo_box_jq.length){
					console.log("!Error! / hide_searchable_combo_box_jq / searchable_combo_box_jq is not valid!");
					return;
				}
				this.searchable_combo_box_jq.hide();
			}
			// TODO
			,add_element_to_searchable_combo_box_jq:function(){

			}
			,remove_element_to_searchable_combo_box_jq:function(){

			}
			,search_keyword_in_searchable_combo_box_jq:function(){

			}
			,search_output_list_jq:null
			,set_search_output_list_jq:function(search_output_list_jq){
				if(_v.isNotJQueryObj(search_output_list_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_search_output_list_jq / _v.isNotJQueryObj(search_output_list_jq)");
					return;
				}
				this.search_output_list_jq = search_output_list_jq;
			}
			,get_search_output_list_jq:function(){
				return this.search_output_list_jq;
			}
			,show_search_output_list_jq:function(){
				if(this.search_output_list_jq == null) return;
				this.search_output_list_jq.show();
			}
			,hide_search_output_list_jq:function(){
				if(this.search_output_list_jq == null) return;
				if(this.search_output_list_jq.length < 1 || 1 < this.search_output_list_jq.length){
					console.log("!Error! / hide_searchable_combo_box_jq / search_output_list_jq is not valid!");
					return;
				}
				this.search_output_list_jq.hide();
			}
			,get_search_output_list_element:function(element_id, element_name, element_meta_info){
				if(_v.isNotValidStr(element_id)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / get_search_output_list_element / _v.isNotValidStr(element_id)");
					return null;
				}
				if(_v.isNotValidStr(element_name)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / get_search_output_list_element / _v.isNotValidStr(element_name)");
					return null;
				}
				if(element_meta_info == null){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / get_search_output_list_element / element_meta_info == null");
					return null;
				}

				return {element_id:element_id, element_name:element_name, element_meta_info:element_meta_info};
			}
			,is_not_valid_search_output_list_element:function(searchable_element){
				return !this.is_valid_search_output_list_element(searchable_element);
			}
			,is_valid_search_output_list_element:function(searchable_element){
				if(searchable_element == null) return false;
				if(searchable_element.element_name == null || _v.isNotValidStr(searchable_element.element_name)) return false;
				if(searchable_element.element_meta_info == null) return false;

				return true;
			}
			,searchable_element_arr:[]
			,get_selected_search_list_option:function(selected_element){
				for(var idx = 0; idx < this.searchable_element_arr.length;idx++) {
					var cur_search_option_obj = this.searchable_element_arr[idx];
					var cur_row_jq = cur_search_option_obj.row_jq;

					if(cur_row_jq[0] == selected_element) {
						return cur_search_option_obj;
					}
				}				
			}
			,set_event_to_search_output_list_jq:function(){

				for(var idx = 0; idx < this.searchable_element_arr.length;idx++) {
					var cur_search_option_obj = this.searchable_element_arr[idx];
					var cur_row_jq = cur_search_option_obj.row_jq;
					if(cur_row_jq == null) continue;


					// 2. 검색 리스트 항목의 포커스를 지웁니다.
					cur_row_jq.removeClass("active");	

					// Set event.
					var _self = this;
					cur_row_jq.off();
					cur_row_jq.click(function(e){

						// 1. 검색 리스트 초기화 
						_self.search_keyword_in_search_output_list_jq("");

						var selected_search_option_obj = _self.get_selected_search_list_option(this);

						e.stopPropagation();
						e.preventDefault();

						// 1. 검색 인터벌 제거
						// 2. 검색 리스트를 초기 형태로 돌려놓습니다. (선택 색상 제거)
						// 필드의 값을 사용자가 선택한 값으로 변경해서 보여줍니다.
						if(_v.is_valid_str(selected_search_option_obj.get_key())) {
							_self.set_title_jq_text(selected_search_option_obj.get_key(), true);
							_self.clear_title_input_jq_value();
							_self.set_title_jq_attr_input_value(selected_search_option_obj.get_key());
							_self.set_title_jq_attr_tossed_value(selected_search_option_obj.get_key());
						}
						_self.remove_all_element_of_search_output_list_jq();

						// 3. view mode로 전환합니다.
						_self.show_view_mode();

						// 4. 이벤트 제거
						_self.remove_event_to_search_output_list_jq();

						_self.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_SEARCH_LIST, _obj.EVENT_TYPE_UPDATE_ITEM, selected_search_option_obj);
					});
				}
			}
			,remove_event_to_search_output_list_jq:function(){
				for(var idx = 0; idx < this.searchable_element_arr.length;idx++) {
					var cur_search_option_obj = this.searchable_element_arr[idx];
					var cur_row_jq = cur_search_option_obj.row_jq;
					if(cur_row_jq == null) continue;

					cur_row_jq.off();
				}
			}
			,add_element_to_search_output_list_jq:function(search_option_obj){ 
				if(_obj.isNotValidDelegate(this.delegate_add_searchable_element)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / add_element_to_search_output_list_jq / _obj.isNotValidDelegate(this.delegate_add_searchable_element)");
					return;
				}
				if(_obj.is_not_valid_search_option(search_option_obj)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / add_element_to_search_output_list_jq / _obj.is_not_valid_search_option(search_option_obj)");
					return;
				}

				var added_row_jq = this.delegate_add_searchable_element._func.apply(this.delegate_add_searchable_element._scope,[this, search_option_obj]);
				if(_v.isNotJQueryObj(added_row_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / add_element_to_search_output_list_jq / _v.isNotJQueryObj(added_row_jq)");
					return;
				}
				search_option_obj.row_jq = added_row_jq;

				this.searchable_element_arr.push(search_option_obj);
			}
			,remove_all_element_of_search_output_list_jq:function(){

				// 실제 화면에 그려놓은 엘리먼트도 제거합니다.
				for (var idx = 0; idx < this.searchable_element_arr.length; idx++) {
					var searchable_element = this.searchable_element_arr[idx];
					if(searchable_element == null || _v.isNotJQueryObj(searchable_element.row_jq)) continue;

					searchable_element.row_jq.off();
					searchable_element.row_jq.remove();
				}

				this.clear_title_input_jq_prev_value();
				this.clear_title_input_jq_watch_dog_interval();

				this.searchable_element_arr = [];
			}
			,search_keyword_in_search_output_list_jq:function(keyword){

				var _obj = airborne.bootstrap.obj;

				if(keyword == null){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / search_keyword_in_search_output_list_jq / keyword == null");
					return;
				}

				//this.searchable_element_arr
				var visible_element_arr = [];
				var invisible_element_arr = [];

				if(keyword == ""){
					// show all
					visible_element_arr = this.searchable_element_arr;
				} else {
					// show keyword matched row
					for (var idx = 0; idx < this.searchable_element_arr.length; idx++) {
						var cur_search_option_obj = this.searchable_element_arr[idx];
						var cur_select_option_key = cur_search_option_obj.select_option_key;

						if(_v.isNotValidStr(cur_select_option_key)) continue;

						// Does element name contains keyword?
						if(cur_select_option_key.toLowerCase().indexOf(keyword.toLowerCase()) > -1){
							visible_element_arr.push(cur_search_option_obj);
						} else {
							invisible_element_arr.push(cur_search_option_obj);
						}
					}
				}

				// 테두리 둥글게 만들기 로직.
				// update row radiuses.
				var cur_radius = 4;
				for (var idx = 0; idx < visible_element_arr.length; idx++) {
					var cur_search_option_obj = visible_element_arr[idx];
					cur_search_option_obj.row_jq.show();

					if(visible_element_arr.length == 1){
						// is only one valid row?
						_obj.set_list_single_row_css_radius(cur_search_option_obj.row_jq, cur_radius);
					} else if(idx == 0){
						// is valid first row?
						_obj.set_list_first_row_css_radius(cur_search_option_obj.row_jq, cur_radius);
					} else if(idx == (visible_element_arr.length - 1)){
						// is valid last row?
						_obj.set_list_last_row_css_radius(cur_search_option_obj.row_jq, cur_radius);
					} else {
						// is valid row which is not first and last.
						_obj.remove_list_row_css_radius(cur_search_option_obj.row_jq);
					}

					// indicate matched letters.
					var cur_select_option_key = cur_search_option_obj.select_option_key;
					var cur_select_option_key_length = cur_select_option_key.length; 
					var matched_idx = cur_select_option_key.toLowerCase().indexOf(keyword.toLowerCase());
					var matched_keyword_length = keyword.length;

					var splited_keyword_head = cur_select_option_key.substring(0,matched_idx);
					var splited_keyword_body = cur_select_option_key.substring(matched_idx, matched_idx + matched_keyword_length);
					var splited_keyword_tail = cur_select_option_key.substring(matched_idx + matched_keyword_length, cur_select_option_key.length);

					var select_option_key_tag_emphasized = splited_keyword_head + "<mark><strong>" + splited_keyword_body + "</strong></mark>" + splited_keyword_tail;
					cur_search_option_obj.row_jq.html(select_option_key_tag_emphasized);
				}

				for (var idx = 0; idx < invisible_element_arr.length; idx++) {
					var cur_search_option_obj = invisible_element_arr[idx];

					if(this.searchable_element_arr.length == invisible_element_arr.length){
						// no match keyword. show all.
						cur_search_option_obj.row_jq.show();
					} else {
						cur_search_option_obj.row_jq.hide();
					}

					// remove letter indication
					cur_search_option_obj.row_jq.html(cur_search_option_obj.select_option_key);
				}
			}
			,time_jq:null
			,show_time_jq:function(){
				if(this.time_jq==null) return null;
				this.time_jq.show();
			}
			,hide_time_jq:function(){
				if(this.time_jq==null) return null;
				if(this.time_jq.length < 1 || 1 < this.time_jq.length){
					console.log("!Error! / hide_time_jq / time_jq is not valid!");
					return;
				}
				this.time_jq.hide();
			}
			,off_time_jq:function(){
				if(this.time_jq==null) return;
				this.time_jq.off();
			}
			,get_time_jq:function(){
				if(this.time_jq==null) return null;
				return this.time_jq;
			}
			,set_time_jq:function(time_jq){
				if(_v.isNotJQueryObj(time_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_jq / _v.isNotJQueryObj(time_jq)");
					return;
				}
				this.time_jq = time_jq;
			}
			,get_time_jq_attr_tossed_time:function(){
				if(this.time_jq==null) return null;
				return this.time_jq.attr("tossed_time");
			}
			,set_time_jq_attr_tossed_time:function(new_tossed_time){
				if(this.time_jq==null) return;
				this.time_jq.attr("tossed_time",new_tossed_time);
			}
			,get_value_time_jq:function(){
				if(this.time_jq == null) return;
				return this.time_jq.html();
			}
			,set_value_time_jq:function(new_time){
				if(_date.is_not_valid_time_format_double_digit(new_time)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_value_time_jq / _date.is_not_valid_time_format_double_digit(new_time)");
					return;
				}
				if(this.time_jq==null) return;
				this.time_jq.html(new_time);
			}		
			,time_input_group_jq:null
			,show_time_input_group_jq:function(){
				if(this.time_input_group_jq==null) return;
				this.time_input_group_jq.show();
			}
			,hide_time_input_group_jq:function(){
				if(this.time_input_group_jq==null) return;
				if(this.time_input_group_jq.length < 1 || 1 < this.time_input_group_jq.length){
					console.log("!Error! / hide_time_input_group_jq / time_input_group_jq is not valid!");
					return;
				}
				this.time_input_group_jq.hide();
			}
			,off_time_input_group_jq:function(){
				if(this.time_input_group_jq==null) return;
				this.time_input_group_jq.off();
			}
			,get_time_input_group_jq:function(){
				if(this.time_input_group_jq==null) return null;
				return this.time_input_group_jq;
			}
			,set_time_input_group_jq:function(time_input_group_jq){
				if(_v.isNotJQueryObj(time_input_group_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_input_group_jq / _v.isNotJQueryObj(time_input_group_jq)");
					return;
				}
				this.time_input_group_jq = time_input_group_jq;
			}
			// @ Desc : 시간 입력 그룹의 시간 입력 필드에 대한 제어.
			,time_input_group_jq_input_jq:null
			,off_time_input_group_jq_input_jq:function(){
				if(this.time_input_group_jq_input_jq==null) return;
				this.time_input_group_jq_input_jq.off();
			}
			,get_time_input_group_jq_input_jq:function(){
				if(this.time_input_group_jq_input_jq==null) return null;
				return this.time_input_group_jq_input_jq;
			}
			,set_time_input_group_jq_input_jq:function(time_input_group_jq_input_jq){
				if(_v.isNotJQueryObj(time_input_group_jq_input_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_input_group_jq_input_jq / _v.isNotJQueryObj(time_input_group_jq_input_jq)");
					return;
				}
				this.time_input_group_jq_input_jq = time_input_group_jq_input_jq;
			}
			,set_value_time_input_group_jq_input_jq:function(time_value){
				if(this.time_input_group_jq_input_jq==null) return;
				if(_v.is_not_valid_str(time_value)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_value_time_input_group_jq_input_jq / _v.is_not_valid_str(time_value)");
					return;
				}
				this.time_input_group_jq_input_jq.val(time_value);
				var cur_prev_value = this.time_input_group_jq_input_jq.attr("prev_value");
				if(_v.is_not_valid_str(cur_prev_value)){
					this.time_input_group_jq_input_jq.attr("prev_value",time_value);
				}
				var cur_tossed_value = this.time_input_group_jq_input_jq.attr("tossed_value");
				if(_v.is_not_valid_str(cur_tossed_value)){
					this.time_input_group_jq_input_jq.attr("tossed_value",time_value);
				}
			}
			// @ Desc : 시간 입력 그룹의 시간 추가 버튼
			,time_input_group_jq_btn_time_plus_jq:null
			,off_time_input_group_jq_btn_time_plus_jq:function(){
				if(this.time_input_group_jq_btn_time_plus_jq==null) return;
				this.time_input_group_jq_btn_time_plus_jq.off();
			}
			,get_time_input_group_jq_btn_time_plus_jq:function(){
				if(this.time_input_group_jq_btn_time_plus_jq==null) return null;
				return this.time_input_group_jq_btn_time_plus_jq;
			}
			,set_time_input_group_jq_btn_time_plus_jq:function(time_input_group_jq_btn_time_plus_jq){
				if(_v.isNotJQueryObj(time_input_group_jq_btn_time_plus_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_input_group_jq_btn_time_plus_jq / _v.isNotJQueryObj(time_input_group_jq_btn_time_plus_jq)");
					return;
				}
				this.time_input_group_jq_btn_time_plus_jq = time_input_group_jq_btn_time_plus_jq;
			}
			// @ Desc : 시간 입력 그룹의 시간 감소 버튼
			,time_input_group_jq_btn_time_minus_jq:null
			,off_time_input_group_jq_btn_time_minus_jq:function(){
				if(this.time_input_group_jq_btn_time_minus_jq==null) return;
				this.time_input_group_jq_btn_time_minus_jq.off();
			}
			,get_time_input_group_jq_btn_time_minus_jq:function(){
				if(this.time_input_group_jq_btn_time_minus_jq==null) return null;
				return this.time_input_group_jq_btn_time_minus_jq;
			}
			,set_time_input_group_jq_btn_time_minus_jq:function(time_input_group_jq_btn_time_minus_jq){
				if(_v.isNotJQueryObj(time_input_group_jq_btn_time_minus_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_input_group_jq_btn_time_minus_jq / _v.isNotJQueryObj(time_input_group_jq_btn_time_minus_jq)");
					return;
				}
				this.time_input_group_jq_btn_time_minus_jq = time_input_group_jq_btn_time_minus_jq;
			}
			// @ Desc : 시간 입력 그룹의 수정된 시간 확인 버튼
			,time_input_group_jq_btn_time_ok_jq:null
			,off_time_input_group_jq_btn_time_ok_jq:function(){
				if(this.time_input_group_jq_btn_time_ok_jq==null) return;
				this.time_input_group_jq_btn_time_ok_jq.off();
			}
			,get_time_input_group_jq_btn_time_ok_jq:function(){
				if(this.time_input_group_jq_btn_time_ok_jq==null) return null;
				return this.time_input_group_jq_btn_time_ok_jq;
			}
			,set_time_input_group_jq_btn_time_ok_jq:function(time_input_group_jq_btn_time_ok_jq){
				if(_v.isNotJQueryObj(time_input_group_jq_btn_time_ok_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_input_group_jq_btn_time_ok_jq / _v.isNotJQueryObj(time_input_group_jq_btn_time_ok_jq)");
					return;
				}
				this.time_input_group_jq_btn_time_ok_jq = time_input_group_jq_btn_time_ok_jq;
			}
			// @ Desc : 시간 입력 그룹의 수정된 시간 취소 버튼
			,time_input_group_jq_btn_time_cancel_jq:null
			,off_time_input_group_jq_btn_time_cancel_jq:function(){
				if(this.time_input_group_jq_btn_time_cancel_jq==null) return;
				this.time_input_group_jq_btn_time_cancel_jq.off();
			}
			,get_time_input_group_jq_btn_time_cancel_jq:function(){
				if(this.time_input_group_jq_btn_time_cancel_jq==null) return null;
				return this.time_input_group_jq_btn_time_cancel_jq;
			}
			,set_time_input_group_jq_btn_time_cancel_jq:function(time_input_group_jq_btn_time_cancel_jq){
				if(_v.isNotJQueryObj(time_input_group_jq_btn_time_cancel_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_input_group_jq_btn_time_cancel_jq / _v.isNotJQueryObj(time_input_group_jq_btn_time_cancel_jq)");
					return;
				}
				this.time_input_group_jq_btn_time_cancel_jq = time_input_group_jq_btn_time_cancel_jq;
			}
			// @ Desc : meta info, event manager의 통합 객체 element set
			// 이 객체로 부모,자식,형제 객체의 접근이 가능하다.
			,element_set:null
			,set_element_set:function(element_set){
				this.element_set = element_set;
			}
			,get_element_set:function(){
				return this.element_set;
			}









			// @ optional - delegates
			,delegate_fetch_combo_box_list_data:null
			,set_delegate_fetch_combo_box_list_data:function(delegate_fetch_combo_box_list_data){
				if(_obj.isNotValidDelegate(delegate_fetch_combo_box_list_data)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_fetch_combo_box_list_data / _obj.isNotValidDelegate(delegate_fetch_combo_box_list_data)");
					return;
				}
				this.delegate_fetch_combo_box_list_data = delegate_fetch_combo_box_list_data;
			}
			,get_delegate_fetch_combo_box_list_data:function(delegate_fetch_combo_box_list_data){
				return this.delegate_fetch_combo_box_list_data;
			}
			,delegate_fetch_searchable_element_list:null
			,set_delegate_fetch_searchable_element_list:function(delegate_fetch_searchable_element_list){
				if(_obj.isNotValidDelegate(delegate_fetch_searchable_element_list)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_fetch_searchable_element_list / _obj.isNotValidDelegate(delegate_fetch_searchable_element_list)");
					return;
				}
				this.delegate_fetch_searchable_element_list = delegate_fetch_searchable_element_list;
			}
			,get_delegate_fetch_searchable_element_list:function(){
				return this.delegate_fetch_searchable_element_list;
			}
			,delegate_add_searchable_element:null
			,set_delegate_add_searchable_element:function(delegate_add_searchable_element){
				if(_obj.isNotValidDelegate(delegate_add_searchable_element)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_add_searchable_element / _obj.isNotValidDelegate(delegate_add_searchable_element)");
					return;
				}
				this.delegate_add_searchable_element = delegate_add_searchable_element;
			}
			,get_delegate_add_searchable_element:function(){
				return this.delegate_add_searchable_element;
			}
			,delegate_callback_after_landing_element:null
			,set_delegate_callback_after_landing_element:function(delegate_callback_after_landing_element){
				if(_obj.isNotValidDelegate(delegate_callback_after_landing_element)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_delegate_callback_after_landing_element / _obj.isNotValidDelegate(delegate_callback_after_landing_element)");
					return;
				}
				this.delegate_callback_after_landing_element = delegate_callback_after_landing_element;
			}
			,get_delegate_callback_after_landing_element:function(){
				return this.delegate_callback_after_landing_element;
			}










			// @ functions
			,hide_all:function(){

				this.hide_title_jq();
				this.hide_time_jq();

				this.hide_title_input_group_jq();
				this.hide_title_input_container_jq();

				this.hide_title_input_btn_search_jq();
				this.hide_title_input_btn_ok_jq();
				this.hide_title_input_btn_cancel_jq();

				this.hide_searchable_combo_box_jq();
				this.hide_search_output_list_jq();

				this.hide_btn_add_element_jq();
				this.hide_btn_edit_element_jq();
				this.hide_btn_remove_element_jq();

				this.hide_btn_eject_element_jq();
				this.hide_time_input_group_jq();

			}
			,is_view_mode:false
			,show_view_mode:function(){
				if(this.is_view_mode) return;

				this.hide_all();
				this.show_element_jq();
				this.show_parent_container_jq();
				this.show_title_jq();
				this.set_colors_back();

				if( this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT || 
					this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT ){

					this.show_time_jq();
				}

				this.is_view_mode = true;
			}
			,show_parent_view_mode:function(){
				var cur_element_set = this.get_element_set();
				if(cur_element_set == null) return;

				var cur_parent_event_manager = cur_element_set.get_parent_event_manager()
				if(cur_parent_event_manager == null) return;

				cur_parent_event_manager.show_view_mode();
			}
			,show_edit_mode:function(){

				// DEBUG
				var cur_title = this.get_title_jq_value();
				// console.log("event manager / show_edit_mode / cur_title : ",cur_title);

				this.hide_all();
				this.show_element_jq();
				this.show_parent_container_jq();
				this.show_title_jq();
				this.show_btn_add_element_jq();
				this.show_btn_edit_element_jq();
				this.show_btn_remove_element_jq();

				if( this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT || 
					this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY || 
					this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT || 
					this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT ||

					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_INPUT_TEXT || 
					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_TIME_HH_MM || 
					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_TIME_MM_SS || 
					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST
					){

					this.show_btn_eject_element_jq();
					this.show_time_jq();
				}

				this.set_colors_reverse();

				this.is_view_mode = false;
			}
			// @ Desc : 제목을 포커싱(색상 반전)하여 보여줍니다. 버튼은 모두 숨깁니다.
			,show_focusing_mode:function(){

				this.hide_all();
				this.show_element_jq();
				this.show_parent_container_jq();
				this.hide_title_jq_text_head();
				this.show_title_jq();

				if( this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT || 
					this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY || 
					this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT || 
					this.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT ||

					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_INPUT_TEXT || 
					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_TIME_HH_MM || 
					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_TIME_MM_SS || 
					this.get_element_type() == _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST
					){

					this.show_time_jq();
				}

				this.set_colors_reverse();

				this.is_view_mode = false;
			}
			,show_input_mode:function(input_mode_type){
				var _obj = airborne.bootstrap.obj;
				var cur_element_meta_info = this.get_element_meta_info();
				var cur_element_type = cur_element_meta_info.get_element_type();

				var consoler = airborne.console.get();
				consoler.off();

				var cur_title = this.get_title_jq_value();

				consoler.say("Event Manager / show_input_mode / em_sim");
				consoler.say("em_sim / 0 /",cur_title);

				// input mode를 인자로 넘겨준 경우를 우선 처리합니다.
				if( _obj.ELEMENT_TYPE_TABLE_TITLE_ADDABLE == input_mode_type ) {

					consoler.say("em_sim / 1 /",cur_title);
					consoler.say("em_sim / 1 / ELEMENT_TYPE_TABLE_TITLE_ADDABLE");

					this.show_input_mode_shy_table();
				} else if( _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY == input_mode_type ) {
					consoler.say("em_sim / 2 /",cur_title);
					consoler.say("em_sim / 2 / ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY");

					this.show_input_mode_shy_list();
				} else if( _obj.ELEMENT_TYPE_SEARCH_LIST == cur_element_type || _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST == cur_element_type ) {
					consoler.say("em_sim / 3 /",cur_title);
					consoler.say("em_sim / 3 / ELEMENT_TYPE_SEARCH_LIST | ELEMENT_TYPE_TABLE_SEARCH_LIST");

					this.show_input_mode_search_n_select();
				} else if( 	_obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type || 
							_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type ||
							_obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_element_type || 
							_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type
							) {

					consoler.say("em_sim / 4 /",cur_title);
					consoler.say("em_sim / 4 / ELEMENT_TYPE_TIME");

					this.show_input_mode_time();
				} else {

					consoler.say("em_sim / 5 /",cur_title);
					consoler.say("em_sim / 5 / Default");

					this.show_input_mode_default();
				}

				this.is_view_mode = false;
			}
			,show_input_mode_shy_table:function(){
				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				// table element set에서 추가 버튼을 눌렀을 때의 작동.
				this.hide_all();

				// 1. 이벤트가 발생한 element set은 view mode
				this.show_parent_container_jq();
				this.show_title_jq();
				this.show_time_jq();

				// 2. title의 말줄임표를 제거.
				this.hide_title_jq_text_head();
				
				// 3. shy row를 가립니다.(이미 보이지 않는 상태)	
				this.show_title_input_group_jq();

				// 4. 형제 shy element / 자기 자신이 shy element 인 경우, 자신을 가립니다.
				this.hide_shy_sibling_element_set();
			}
			,show_input_mode_shy_list:function(){

				console.log("Event Manager / show_input_mode_shy_list   ");

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				// element set에서 추가 버튼을 눌렀을 때의 작동.
				this.hide_all();

				// 1. 이벤트가 발생한 element set은 view mode
				this.show_parent_container_jq();
				this.show_title_jq();
				this.show_time_jq();

				// 2. title의 말줄임표를 제거.
				this.hide_title_jq_text_head();

				// 3. shy 자식 객체를 화면에서 가립니다.
				this.hide_shy_child_element_set();

				// 4. 형제 shy element / 자기 자신이 shy element 인 경우, 자신을 가립니다.
				this.hide_shy_sibling_element_set();

				// 5. 선택한 엘리먼트(자기 자신)의 아래로 input group을 옮깁니다.
				this.move_title_input_group_jq_under_me();

			}
			,show_input_mode_default:function(){

				this.hide_all();

				this.show_parent_container_jq();
				this.show_title_jq();

				this.move_title_input_group_jq();

				this.show_title_input_group_jq();
				this.show_title_input_container_jq();
				this.show_title_input_jq();

				this.show_title_input_btn_ok_jq();
				this.show_title_input_btn_cancel_jq();

				this.focus_title_input_jq();

				// 이거 꼭 필요한거?
				//this.set_title_input_jq_watch_dog_interval();
				this.rollback_row_title_input();

				// 4. 형제 shy element / 자기 자신이 shy element 인 경우, 자신을 가립니다.
				this.hide_shy_sibling_element_set();

			}
			,show_input_mode_time:function(){

				this.hide_all();

				this.show_parent_container_jq();
				this.show_title_jq();

				this.move_title_input_group_jq();

				this.show_title_input_group_jq();
				var cur_element_type = this.get_element_type();

				if( cur_element_type == _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT || 
					cur_element_type == _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT ||
					cur_element_type == _obj.ELEMENT_TYPE_TABLE_TIME_HH_MM ||
					cur_element_type == _obj.ELEMENT_TYPE_TABLE_TIME_MM_SS ||
					cur_element_type == _obj.ELEMENT_TYPE_TIME_HH_MM ||
					cur_element_type == _obj.ELEMENT_TYPE_TIME_MM_SS 
					){

					this.show_time_input_group_jq();

				} else {

					this.show_title_input_container_jq();

				}
			}
			,show_input_mode_search_n_select:function(){

				this.hide_all();

				this.show_parent_container_jq();
				this.show_title_jq();

				this.move_title_input_group_jq();

				this.show_title_input_group_jq();
				this.show_title_input_container_jq();
				this.show_title_input_jq();

				this.show_title_input_btn_cancel_jq();

				this.show_search_output_list_jq();

				this.hide_title_input_btn_ok_jq();
				this.hide_title_input_btn_search_jq();
			}
			,off_all_events:function(){

				this.off_title_input_btn_ok_jq();
				this.off_title_input_btn_cancel_jq();
				this.off_title_input_btn_search_jq();

				this.off_btn_edit_element_jq();
				this.off_btn_remove_element_jq();
				this.off_btn_add_element_jq();
			}
			,set_colors_back:function(){
				if(this.element_jq == null) return;
				this.element_jq.css("color",this.element_color);
				this.element_jq.css("background-color",this.element_background_color);
			}
			,set_colors_reverse:function(){
				if(this.element_jq == null) return;
				this.element_jq.css("color",this.element_background_color);
				this.element_jq.css("background-color",this.element_color);
			}
			,update_row_title:function(){
				if(this.title_jq == null || this.title_input_jq == null) return;

				this.set_title_jq_attr_input_value(this.title_input_jq.val());
				this.set_title_jq_attr_tossed_value(this.title_input_jq.val());
				this.set_title_jq_text(this.title_input_jq.val(), true);
			}
			,rollback_row_title_input:function(){
				if(this.title_jq == null || this.title_input_jq == null) return;

				var _html = airborne.html;
				var decoded_title = _html.get_decode_text(this.title_jq.html());
				this.title_input_jq.val(decoded_title);
			}
			,remove_list:function(){
				if(this.element_container_jq == null) return;
				this.element_container_jq.remove();
			}
			// @ public
			// @ scope : Event Manager
			// @ desc : 리스트의 열을 삭제합니다.
			,remove_row:function(){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;
				var consoler = airborne.console.get();
				consoler.off();

				var element_name = this.get_title_jq_value();
				var element_collection_set_name = this.get_element_set().get_element_collection_set().get_element_collection_id();
				consoler.say("remove_row / rr");
				consoler.say("rr / 0 / en : " + element_name);
				consoler.say("rr / 0 / ecsn : " + element_collection_set_name);

				if(this.element_jq == null) return;

				consoler.say("rr / 1 / en : " + element_name);
				consoler.say("rr / 1 / element collection set에서 해당 element set을 제거합니다.");

				var cur_element_set = this.get_element_set();
				var cur_element_collection_set = cur_element_set.get_element_collection_set();
				cur_element_collection_set.remove_element_set(cur_element_set);
				var cur_element_container_jq = this.get_element_container_jq();

				if(element_meta_info.item_type != null && element_meta_info.item_type == _obj.ITEM_TYPE_TABLE){

					if(cur_element_container_jq == null) return;
					cur_element_container_jq.remove();

					consoler.say("rr / 2-1 / en : " + element_name);
					consoler.say("rr / 2-1 / element container를 화면에서 지웁니다.");

				} else {

					var get_element_set_arr = cur_element_collection_set.get_element_set_arr();
					if(_v.is_valid_array(get_element_set_arr)){

						consoler.say("rr / 2-2-1 / en : " + element_name);
						consoler.say("rr / 2-2-1 / 자신의 element collection set에서 엘리먼트가 남아있다면 element_jq를 제거합니다.");

						this.element_jq.remove();
					} else {

						consoler.say("rr / 2-2-2 / en : " + element_name);
						consoler.say("rr / 2-2-2 / 자신의 element collection set에서 더이상 엘리먼트가 남아있지 않다면 element_container_jq를 제거합니다.	");

						cur_element_container_jq.remove();
					}

				}

			}
			,is_lock:function(){
				return this.event_hierarchy_manager.is_lock();
			}
			,lock:function(){
				this.event_hierarchy_manager.lock();
			}
			,release:function(){
				this.event_hierarchy_manager.release();
			}
			,get_id:function(){
				return this.event_manager_id;
			}
			,get_parent_event_manager:function(parent_element_event_manager){
				var cur_element_set = this.get_element_set();
				if(cur_element_set == null) return;

				var cur_parent_element_set = cur_element_set.get_parent_element_set();
				if(cur_parent_element_set == null) return;

				var cur_parent_event_manager = cur_parent_element_set.get_event_manager();
				if(cur_parent_event_manager == null) return;

				return cur_parent_event_manager;
			}
			,get_all_event_manager_arr:function(){
				return this.event_hierarchy_manager.get_all_event_manager_arr();
			}
			,set_btn_event_color:function(target_jq){
				if(target_jq == null) return;

				var item_focus_color = this.item_focus_color;
				var _self = this;
				var _html = airborne.html;

				target_jq.mouseenter(function(e){
					_self.set_btn_color_focus(target_jq);
				});
				target_jq.mouseleave(function(e){
					_self.set_btn_color_back(target_jq);
				});
			}
			,set_btn_color_focus:function(target_jq){
				if(target_jq == null) return;
				if(this.is_lock()) return;

				var item_focus_color = this.item_focus_color;
				target_jq.css("color", item_focus_color);
			}
			,set_btn_color_back:function(target_jq){
				if(target_jq == null) return;
				target_jq.css("color", "");
			}

			// http://patorjk.com/software/taag/#p=display&h=1&f=Rowan%20Cap&t=Event%20Manager%20-%20functions
			// Rowan Cap

			//     dMMMMMP dMP dMP dMMMMMP dMMMMb dMMMMMMP         dMMMMMMMMb  .aMMMb  dMMMMb  .aMMMb  .aMMMMP dMMMMMP dMMMMb             dMMMMMP dMP dMP dMMMMb  .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb  .dMMMb 
			//    dMP     dMP dMP dMP     dMP dMP   dMP           dMP"dMP"dMP dMP"dMP dMP dMP dMP"dMP dMP"    dMP     dMP.dMP            dMP     dMP dMP dMP dMP dMP"VMP   dMP   amr dMP"dMP dMP dMP dMP" VP 
			//   dMMMP   dMP dMP dMMMP   dMP dMP   dMP           dMP dMP dMP dMMMMMP dMP dMP dMMMMMP dMP MMP"dMMMP   dMMMMK"            dMMMP   dMP dMP dMP dMP dMP       dMP   dMP dMP dMP dMP dMP  VMMMb   
			//  dMP      YMvAP" dMP     dMP dMP   dMP           dMP dMP dMP dMP dMP dMP dMP dMP dMP dMP.dMP dMP     dMP"AMF            dMP     dMP.aMP dMP dMP dMP.aMP   dMP   dMP dMP.aMP dMP dMP dP .dMP   
			// dMMMMMP    VP"  dMMMMMP dMP dMP   dMP           dMP dMP dMP dMP dMP dMP dMP dMP dMP  VMMMP" dMMMMMP dMP dMP            dMP      VMMMP" dMP dMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP  VMMMP"    

			// @ function on event
			,was_hover:false
			,set_was_hover:function(is_hover){
				if(is_hover == null || (is_hover != true && is_hover != false)) return;
				this.was_hover = is_hover;
			}
			,get_was_hover:function(){
				return this.was_hover;
			}
			,on_mouse_over:function(){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(this.is_lock()) return;

				this.show_edit_mode();
				
				// 일반적인 리스트 형태의 이벤트 처리
				// 포커싱 시에 노출되는 타이틀 길이를 줄여줍니다.
				this.show_title_jq_text_head();

				var _self = this;
				if(this.btn_remove_element_jq != null){
					this.btn_remove_element_jq.off();
					this.set_btn_event_color(this.btn_remove_element_jq);
					this.btn_remove_element_jq.click(function(e){

						if(!confirm("Remove this row.\nAre you sure?")) return;

						e.stopPropagation();
						_self.remove_row();

						// 자신의 엘리먼트를 화면에서 지웁니다
						// 자신의 형제 엘리먼트들의 테두리를 다시 그립니다.
						_self.shape_sibling_element(false/*has_myself*/);
						_self.release();

						// 엘리먼트 자신이 부모 밑의 엘리먼트라면 부모 안의 참조를 지워준다.
						var cur_element_set = undefined;
						if(_self.get_element_set() != undefined) {
							cur_element_set = _self.get_element_set();
						}
						var cur_element_collection_set = undefined;
						if(cur_element_set != undefined) {
							cur_element_collection_set = cur_element_set.get_element_collection_set();
						}
						var cur_parent_element_set = undefined;
						if(cur_element_collection_set != undefined) {
							cur_parent_element_set = cur_element_collection_set.get_parent_element_set();
						}
						var prev_children_element_collection_set_arr = undefined;
						if(cur_parent_element_set != undefined) {
							prev_children_element_collection_set_arr = cur_parent_element_set.get_children_element_collection_set_arr();
						}
						if(_v.is_valid_array(prev_children_element_collection_set_arr)) {

							var next_children_element_collection_set_arr = [];
							for(var idx=0; idx < prev_children_element_collection_set_arr.length;idx++) {

								var prev_children_element_collection_set = prev_children_element_collection_set_arr[idx];
								if(prev_children_element_collection_set.get_element_set_arr() == undefined) {
									continue;
								}

								if(prev_children_element_collection_set.get_element_set_arr().length > 0) {
									// 엘리먼트가 있다면 새로운 컬렉션 배열에 추가.
									next_children_element_collection_set_arr.push(prev_children_element_collection_set);
								} else {
									// 엘리먼트가 없다면 새로운 컬렉션 배열에 포함되지 않는다.	
									// 컨테이너 참조 역시 제거합니다.
									prev_children_element_collection_set.get_element_collection_container_jq().remove();
								}
								
							}

							// 부모 엘리먼트 셋의 자식 엘리먼트 컬렉션 배열 정보 업데이트.
							cur_parent_element_set.get_children_element_collection_set_arr(next_children_element_collection_set_arr);
						}

						_self.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_NONE, _obj.EVENT_TYPE_DELETE_ITEM);
					});
				}
				
				var cur_btn_add_element_jq = this.get_btn_add_element_jq();
				if(cur_btn_add_element_jq != null){
					cur_btn_add_element_jq.off();
					this.set_btn_event_color(cur_btn_add_element_jq);
					cur_btn_add_element_jq.click(function(e){

						console.log("cur_btn_add_element_jq / click / 000");

						e.stopPropagation();
						_self.show_view_mode();
						_self.on_add_btn_click();
					});
				}
				
				var cur_element_type = this.get_element_meta_info().get_element_type();
				if(	this.title_jq != null && 
					(
						_obj.ELEMENT_TYPE_INPUT_TEXT==cur_element_type 			|| 
						_obj.ELEMENT_TYPE_SEARCH_LIST==cur_element_type 		||
						_obj.ELEMENT_TYPE_TABLE_INPUT_TEXT==cur_element_type 	|| 
						_obj.ELEMENT_TYPE_TABLE_SEARCH_LIST==cur_element_type
					)
				){

					this.title_jq.off();
					this.set_btn_event_color(this.title_jq);
					this.title_jq.click(function(e){
						if(_self.is_lock()) return;
						e.stopPropagation();
						_self.on_edit_btn_click();
					});
				}
				
				var cur_btn_edit_element_jq = this.get_btn_edit_element_jq();
				if(cur_btn_edit_element_jq != null){
					cur_btn_edit_element_jq.off();
					this.set_btn_event_color(cur_btn_edit_element_jq);
					cur_btn_edit_element_jq.click(function(e){

						e.stopPropagation();

						if(_self.get_element_meta_info().get_is_shy()) {
							console.log("edit btn - shy element일 경우는 입력");
							_self.on_add_btn_click();
						} else {
							console.log("edit btn - 일반 element일 경우는 수정");
							_self.on_edit_btn_click();
						}
						
					});
				}


				var cur_btn_eject_element_jq = this.get_btn_eject_element_jq();
				if(cur_btn_eject_element_jq != null){
					this.off_btn_eject_element_jq();
					this.set_btn_event_color(cur_btn_eject_element_jq);
					cur_btn_eject_element_jq.click(function(event_click){

						// 자식 엘리먼트 셋에 shy element가 있다면 화면에서 가립니다.
						_self.hide_shy_child_element_set();

						// 이 점프 버튼의 동작은 외부에서 정의합니다.
						_self.call_delegate_btn_eject_click(event_click);
						_self.lock();

					});
				}

				// time event
				var cur_time_jq = this.get_time_jq();
				if(cur_time_jq != null){
					this.off_time_jq();
					this.set_btn_event_color(cur_time_jq);

					cur_time_jq.click(function(e){

						e.stopPropagation();

						// 시간 입력 그룹을 보여줍니다.
						_self.on_edit_btn_click();
						_self.show_input_mode_time();
						_self.lock();

					});

					cur_time_jq.mouseleave(function(e){

						// 리스트 전체에 mouseleave 이벤트가 전파되는 것을 막습니다.
						// 리스트 전체에 mosueleave 이벤트가 전파되면 리스트는 view mode로 변경됩니다.
						e.stopPropagation();
					});


				}
			}
			,on_mouse_leave:function(){
				if(this.is_lock()) return;

				this.show_view_mode();
				this.set_btn_color_back();
				this.off_all_events();

				// 줄임표 제거. 원래 텍스트 복원.
				this.hide_title_jq_text_head();
			}
			/*
			@ private
			@ scope : event manager
			@ Desc : 	1. 형제 엘리먼트의 귀퉁이 모양을 둥글게 재조정합니다.
						2. 첫번째 열인 경우만 eject btn을 노출합니다.
			*/
			,shape_sibling_element:function(has_myself){

				var _obj = airborne.bootstrap.obj;

				// var cur_sibling_element_event_manager_arr = 
				// this.get_sibling_element_event_manager_arr(
				// 	// has_myself
				// 	has_myself
				// 	// has_shy_child
				// 	, false
				// );

				var consoler = airborne.console.get();
				consoler.off();

				var cur_element_collection_set = this.get_element_set().get_element_collection_set();
				var cur_element_collection_set_id = cur_element_collection_set.get_element_collection_id();
				var cur_element_set_arr = cur_element_collection_set.ecs_get_masked_element_set_arr();

				consoler.say("shape_sibling_element / sse");
				consoler.say("sse / 0");
				cur_element_collection_set.say_yourself(consoler.isShow);

				for(var idx = 0; idx < cur_element_set_arr.length; idx++) {
					var cur_element_set = cur_element_set_arr[idx];
					var cur_event_manager = cur_element_set.get_event_manager();

					if(cur_event_manager == null){
						consoler.say("!Error! / shape_sibling_element / cur_event_manager == null");
						continue;	
					}

					var cur_element_title = cur_event_manager.get_title_jq_value();

					consoler.say("sse / 0 / " + cur_element_title);
					consoler.say("sse / 0 / 모든 엘리먼트의 기본형인 둥근 테두리 없음으로 바꿉니다.");
					var cur_element_jq = cur_event_manager.get_element_jq();
					_obj.remove_list_row_css_radius(cur_element_jq);

					// 모든 엘리먼트의 eject btn을 가립니다.
					cur_event_manager.hide_btn_eject_collection_element_jq();
					if( 0 == idx ) {

						// 첫번째 엘리먼트의 처리
						if(cur_element_set_arr.length == 1){
							consoler.say("sse / 1-1 / " + cur_element_title);
							consoler.say("sse / 1-1 / 엘리먼트가 자신만일 경우, 테두리 디자인을 변경해줍니다");
							_obj.set_list_single_row_css_radius(cur_element_jq, _obj.LIST_ROW_RADIUS_NORMAL);
						} else {
							consoler.say("sse / 1-2 / " + cur_element_title);
							consoler.say("sse / 1-2 / 엘리먼트가 1개이면서 다른 엘리먼트가 있는 경우, 테두리 디자인을 변경해줍니다");
							_obj.set_list_first_row_css_radius(cur_element_jq, _obj.LIST_ROW_RADIUS_NORMAL);
						}

						// 첫번째 엘리먼트의 eject btn은 보여줍니다.

						consoler.say("sse / 1-3 / " + cur_element_title);
						consoler.say("sse / 1-3 / 첫번째 엘리먼트의 eject btn은 보여줍니다.");

						cur_event_manager.show_btn_eject_collection_element_jq();

						// 첫번째 엘리먼트의 eject btn jq 참조를 넘겨줍니다.
						// 첫번째 엘리먼트의 eject btn의 이벤트시 동작이 설정됩니다.

						consoler.say("sse / 1-4 / " + cur_element_title);
						consoler.say("sse / 1-4 / 첫번째 엘리먼트의 eject btn의 이벤트시 동작이 설정됩니다.");

						cur_element_collection_set.ecs_set_btn_collection_eject_jq(cur_event_manager.get_btn_eject_collection_element_jq());

					} else if((cur_element_set_arr.length - 1) === idx) {

						consoler.say("sse / 2 / " + cur_element_title);
						consoler.say("sse / 2 / 마지막 열일 경우에는 테두리 디자인을 변경해줍니다.");

						_obj.set_list_last_row_css_radius(cur_element_jq, _obj.LIST_ROW_RADIUS_NORMAL);

					}
				}				
			}
			,set_search_list_data_on_input_group:function(){

				// set search list data
				var _obj = airborne.bootstrap.obj;
				var cur_element_meta_info = this.get_element_meta_info();
				if(cur_element_meta_info.get_element_type == null){
					console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / on_edit_btn_click / cur_element_meta_info.get_element_type == null");
					return;
				}
				var cur_element_type = cur_element_meta_info.get_element_type();

				// 검색 리스트 타입이 아니면 중단합니다.
				if(	_obj.ELEMENT_TYPE_SEARCH_LIST != cur_element_type && 
					_obj.ELEMENT_TYPE_TABLE_SEARCH_LIST != cur_element_type
					) {
					return;
				}

				//get_search_list_arr
				var cur_search_list_arr = cur_element_meta_info.get_search_list_arr();

				// add searchable list data
				if(_v.isValidArray(cur_search_list_arr) && _v.is_not_valid_array(this.searchable_element_arr)){

					for (var idx = 0; idx < cur_search_list_arr.length; idx++) {
						var cur_search_option_obj = cur_search_list_arr[idx];
						this.add_element_to_search_output_list_jq(cur_search_option_obj);
					}
				}
				// 검색 리스트에 이벤트 적용
				this.set_event_to_search_output_list_jq();
				// 사용자가 입력한 검색 키워드를 0.3초마다 가져와서 리스트에 표시합니다.
				this.set_title_input_jq_search_list_watch_dog_interval();


				// search btn event
				var _self = this;
				var cur_title_input_btn_search_jq = this.get_title_input_btn_search_jq();
				if(cur_title_input_btn_search_jq == undefined){
					return;
				}

				// search btn event
				this.title_input_btn_search_jq.off();
				this.title_input_btn_search_jq.click(function(){

					_self.hide_searchable_combo_box_jq();
					_self.show_title_input_group_jq();
					_self.show_title_input_container_jq();
					_self.show_title_input_jq();
					_self.show_search_output_list_jq();

					_self.hide_title_input_btn_ok_jq();
					_self.hide_title_input_btn_search_jq();

				});
			}
			,set_event_btn_cancel_on_input_group:function(cur_event_type){

				var _obj = airborne.bootstrap.obj;
				var _self = this;
				var cur_title_input_btn_cancel_jq = this.get_title_input_btn_cancel_jq();

				if( _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type && _obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type ){
					console.log("!Error! / set_event_btn_ok_on_input_group / _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type || _obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type");
					return;
				}

				if(cur_title_input_btn_cancel_jq == null){
					return;
				}


				var do_on_event = function(e) {
					e.stopPropagation();

					_self.clear_title_input_jq_watch_dog_interval();
					_self.clear_title_input_jq_value();
					_self.rollback_title_jq_text();

					_self.show_view_mode();
					_self.set_btn_color_back(_self.get_title_jq());

					_self.remove_all_element_of_search_output_list_jq();

					_self.release();
				}

				this.off_title_input_btn_cancel_jq();
				cur_title_input_btn_cancel_jq.click(function(e){
					do_on_event(e);
				});

				var cur_title_input_jq = this.get_title_input_jq();
				cur_title_input_jq.focus();
				cur_title_input_jq.keyup(function(e) {
					var code = e.keyCode || e.which;
					// Enter : 13 / ESC : 27
					if(code === 27) {
						do_on_event(e);
					}
				});

			}
			,remove_event_btn_ok_on_input_group:function(){

				var cur_title_input_jq = this.get_title_input_jq();
				if(cur_title_input_jq != undefined) {
					cur_title_input_jq.off();
				}
				
				var cur_title_input_btn_ok_jq = this.get_title_input_btn_ok_jq();
				if(cur_title_input_btn_ok_jq != undefined) {
					cur_title_input_btn_ok_jq.off();	
				}

			}
			,set_event_btn_ok_on_input_group:function(cur_event_type){

				var _obj = airborne.bootstrap.obj;
				var _self = this;
				var cur_title_input_btn_ok_jq = this.get_title_input_btn_ok_jq();

				if( _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type && _obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type ){
					console.log("!Error! / set_event_btn_ok_on_input_group / _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type || _obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type");
					return;
				}

				if(cur_title_input_btn_ok_jq == undefined) {
					console.log("!Error! / set_event_btn_ok_on_input_group / cur_title_input_btn_ok_jq == undefined");
					return;
				}

				var do_on_event = function(e) {
					// 이벤트 전파를 막습니다.
					e.stopPropagation();

					console.log("set_event_btn_ok_on_input_group / do_on_event / cur_event_type : ",cur_event_type);

					if(_obj.EVENT_TYPE_INSERT_ITEM === cur_event_type){

						// 입력 창을 가립니다.
						_self.hide_title_input_group_jq();

						// _self는 OK 버튼이 포함된 input group.
						// 새롭게 열을 추가합니다.
						var cur_element_set = _self.get_element_set();
						var cur_element_collection_set = cur_element_set.get_element_collection_set();
						cur_element_collection_set.add_element(_self);

					} else if(_obj.EVENT_TYPE_UPDATE_ITEM === cur_event_type){

						_self.show_edit_mode();
						_self.update_row_title();
						_self.clear_title_input_jq_watch_dog_interval();

						// json 객체의 key도 업데이트 합니다.
						if( _self.get_element_meta_info() != undefined &&
							_self.get_element_meta_info().get_element_json != undefined &&
							_self.get_element_meta_info().get_element_json() != undefined &&
							_self.get_element_meta_info().get_element_json().get_field_option != undefined &&
							_self.get_element_meta_info().get_element_json().get_field_option() != undefined
						 ) {

							_self.get_element_meta_info().get_element_json().get_field_option().set_key(_self.get_title_input_jq_value());

						}

					}

					// 사용자가 입력한 내역을 삭제합니다.
					_self.clear_title_input_jq_value();
					_self.clear_title_input_jq_prev_value();

					_self.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_INPUT_TEXT, cur_event_type);
				}

				var cur_title_input_jq = this.get_title_input_jq();
				cur_title_input_jq.off();
				cur_title_input_jq.keyup(function(e) {
					var code = e.keyCode || e.which;
					// Enter : 13 / ESC : 27
					if(code === 13) {
						do_on_event(e);
					}
				});

				cur_title_input_btn_ok_jq.off();
				cur_title_input_btn_ok_jq.click(function(e){
					do_on_event(e);
				});

			}
			,set_event_time_editor_on_input_group:function(){

				var _obj = airborne.bootstrap.obj;

				var _self = this;
				var cur_time_input_group_jq = this.get_time_input_group_jq();
				if(cur_time_input_group_jq != null){

					this.off_time_input_group_jq();

					var cur_time_input_group_jq_input_jq = this.get_time_input_group_jq_input_jq();
					if(cur_time_input_group_jq_input_jq == null){
						console.log("!Error! / airborne.view.obj / get_this./ time input event / cur_time_input_group_jq_input_jq == null");
						return;
					}

					var cur_btn_time_plus_jq = this.get_time_input_group_jq_btn_time_plus_jq();
					if(cur_btn_time_plus_jq == null){
						console.log("!Error! / airborne.view.obj / get_this./ time input event / cur_btn_time_plus_jq == null");
						return;
					}

					var cur_btn_time_minus_jq = this.get_time_input_group_jq_btn_time_minus_jq();
					if(cur_btn_time_minus_jq == null){
						console.log("!Error! / airborne.view.obj / get_this./ time input event / cur_btn_time_minus_jq == null");
						return;
					}

					var cur_btn_time_ok_jq = this.get_time_input_group_jq_btn_time_ok_jq();
					if(cur_btn_time_ok_jq == null){
						console.log("!Error! / airborne.view.obj / get_this./ time input event / cur_btn_time_ok_jq == null");
						return;
					}

					var cur_btn_time_cancel_jq = this.get_time_input_group_jq_btn_time_cancel_jq();
					if(cur_btn_time_cancel_jq == null){
						console.log("!Error! / airborne.view.obj / get_this./ time input event / cur_btn_time_cancel_jq == null");
						return;
					}





					// assign time. check time mode.
					var cur_element_type = this.get_element_meta_info().get_element_type();

					if(_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || _obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type){

						var cur_prop_map = this.get_element_meta_info().get_prop_map();
						var cur_seconds = cur_prop_map.__seconds;

						var cur_minutes_safe_int = _date.getSecondsToMinutes(cur_seconds);
						var cur_seconds_safe_int = _date.getSecondsRemainder(cur_seconds);

						var cur_minutes_str = _date.getDoubleDigit(cur_minutes_safe_int);
						var cur_seconds_str = _date.getDoubleDigit(cur_seconds_safe_int);
						var cur_minutes_n_seconds_str = cur_minutes_str + ":" + cur_seconds_str;

						cur_time_input_group_jq_input_jq.val(cur_minutes_n_seconds_str);
						cur_time_input_group_jq_input_jq.attr("prev_value", cur_minutes_n_seconds_str);
						cur_time_input_group_jq_input_jq.attr("tossed_value", cur_minutes_n_seconds_str);

					} else if(_obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type || _obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_element_type){

						var cur_prop_map = this.get_element_meta_info().get_prop_map();
						var cur_seconds = cur_prop_map.__seconds;

						var cur_hours_n_minutes_str = _dates.get_hh_mm_from_seconds(cur_seconds);

						cur_time_input_group_jq_input_jq.val(cur_hours_n_minutes_str);
						cur_time_input_group_jq_input_jq.attr("prev_value", cur_hours_n_minutes_str);
						cur_time_input_group_jq_input_jq.attr("tossed_value", cur_hours_n_minutes_str);

					} else if(_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type || _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type){

						// 사용자 입력 시간 정보를 시간 입력 엘리먼트에 지정합니다.
						var cur_time_jq = this.get_time_jq();
						var cur_time = cur_time_jq.html();
						this.set_value_time_input_group_jq_input_jq(cur_time);

					}

					// remove all events
					this.off_time_input_group_jq_input_jq();
					this.off_time_input_group_jq_btn_time_plus_jq();
					this.off_time_input_group_jq_btn_time_minus_jq();
					this.off_time_input_group_jq_btn_time_ok_jq();
					this.off_time_input_group_jq_btn_time_cancel_jq();

					var set_minutes_offset = function(offset_minutes){
						var hour_n_minutes_str = cur_time_input_group_jq_input_jq.val();
						var new_offset_moment = _date.get_moment_minutes_offset_from_hour_n_minutes_str(hour_n_minutes_str, offset_minutes);
						var new_hour_n_minutes_str = _date.get_hour_n_minutes_str_from_moment_obj(new_offset_moment);
						cur_time_input_group_jq_input_jq.val(new_hour_n_minutes_str);
					}

					var set_seconds_offset = function(offset_seconds){
						var minutes_n_seconds_str = cur_time_input_group_jq_input_jq.val();
						var new_offset_moment = _date.get_moment_seconds_offset_from_minutes_n_seconds_str(minutes_n_seconds_str, offset_seconds);
						var new_minutes_n_seconds_str = _date.get_minutes_n_seconds_str_from_moment_obj(new_offset_moment);
						cur_time_input_group_jq_input_jq.val(new_minutes_n_seconds_str);
					}

					var check_time_format_valid = function(){
						var cur_time_double_digit_str = cur_time_input_group_jq_input_jq.val();
						var prev_time_double_digit_str = cur_time_input_group_jq_input_jq.attr("prev_value");

						var is_valid_time_format_str = false;
						if( _obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type || 
							_obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_element_type || 
							_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type
							){
							
							is_valid_time_format_str = _date.is_valid_time_format_str(cur_time_double_digit_str, _date.DATE_TYPE_HH_MM);

						} else if( 	_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || 
									_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type || 
									_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type
									){
							
							is_valid_time_format_str = _date.is_valid_time_format_str(cur_time_double_digit_str, _date.DATE_TYPE_MM_SS);
						}

						if(is_valid_time_format_str){
							// No prob! update prev_value
							cur_time_input_group_jq_input_jq.attr("prev_value", cur_time_double_digit_str);
							return true;
						} else {
							// Oops! Something goes wrong. roll back your time str.
							if(!confirm("Please check your time format.\nExample : 17:30")){
								cur_time_input_group_jq_input_jq.val(prev_time_double_digit_str);
							}
							return false;
						}
					}

					cur_time_input_group_jq_input_jq.click(function(e){
						e.stopPropagation();
						check_time_format_valid();
					});
					cur_time_input_group_jq_input_jq.change(function(e){
						e.stopPropagation();
						check_time_format_valid();
					});

					var do_on_event_btn_time_plus = function(e) {
						e.stopPropagation();
						if(!check_time_format_valid()) return;
						if( _obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || 
							_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type || 
							_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type
							){

							set_seconds_offset(5);	// plus time (+ 5 seconds per click)

						} else if(	_obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type || 
									_obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_element_type || 
									_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type
									){

							set_minutes_offset(5);	// plus time (+ 5 minutes per click)	

						}
					}

					cur_btn_time_plus_jq.click(function(e){
						do_on_event_btn_time_plus(e);
					});


					var do_on_event_btn_time_minus = function(e) {
						e.stopPropagation();
						if(!check_time_format_valid()) return;

						if(	_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || 
							_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type || 
							_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type
							){
							set_seconds_offset(-5);	// minus time (- 5 seconds per click)	
						} else if(	_obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type || 
									_obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_element_type || 
									_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type
									){
							set_minutes_offset(-5);	// minus time (- 5 minutes per click)
						}
					}

					cur_btn_time_minus_jq.click(function(e){
						do_on_event_btn_time_minus(e);
					});

					var do_on_event_btn_time_ok = function(e) {

						if(check_time_format_valid()){

							_self.hide_all();
							_self.show_view_mode();
							_self.release();

							// update time
							var cur_time_str = cur_time_input_group_jq_input_jq.val();
							var cur_time_arr = cur_time_str.split(":");

							if( _obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || 
								_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type ){

								var cur_minutes_str = cur_time_arr[0];
								var cur_seconds_str = cur_time_arr[1];

								var cur_time_format_str = "";
								var cur_minutes = parseInt(cur_minutes_str);
								if(cur_minutes > 1){
									cur_time_format_str += cur_minutes + " min";
								}
								var cur_seconds = parseInt(cur_seconds_str); 
								if(cur_seconds > 1){
									cur_time_format_str += (_v.isValidStr(cur_time_format_str))?" ":"";
									cur_time_format_str += cur_seconds + " sec";
								}

								// update seconds
								var seconds_total = (cur_minutes * 60) + cur_seconds;
								var cur_prop_map = _self.get_element_meta_info().get_prop_map();
								cur_prop_map.__seconds = seconds_total;

								_self.set_title_jq_text(cur_time_format_str, true);

							} else if(_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type){

								// 사용자가 입력한 분과 초 정보를 가져옴.
								var cur_minutes_str = cur_time_arr[0];
								var cur_seconds_str = cur_time_arr[1];

								var cur_time_format_str = "";
								var cur_minutes = parseInt(cur_minutes_str);
								var cur_seconds = parseInt(cur_seconds_str); 

								// update seconds
								var seconds_total = (cur_minutes * 60) + cur_seconds;
								var cur_prop_map = _self.get_element_meta_info().get_prop_map();
								cur_prop_map.__seconds = seconds_total;
								cur_prop_map.__time_hh_mm = cur_time_str;

								_self.set_value_time_jq(cur_time_str);

							} else if(	_obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type ||
										_obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_element_type 	){

								var cur_hours_str = cur_time_arr[0];
								var cur_minutes_str = cur_time_arr[1];

								var cur_time_format_str = "";
								var cur_hours = parseInt(cur_hours_str);
								if(cur_hours > 1){
									cur_time_format_str += cur_hours + " hour";
								}
								var cur_minutes = parseInt(cur_minutes_str); 
								if(cur_minutes > 1){
									cur_time_format_str += (_v.isValidStr(cur_time_format_str))?" ":"";
									cur_time_format_str += cur_minutes + " min";
								}

								// update seconds
								var seconds_total = (cur_hours * 3600) + (cur_minutes * 60);
								var cur_prop_map = _self.get_element_meta_info().get_prop_map();
								cur_prop_map.__seconds = seconds_total;

								_self.set_title_jq_text(cur_time_format_str, true);

							} else if(_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type){

								console.log("사용자가 입력한 시와 분 정보를 가져옴.");

								// 사용자가 입력한 시와 분 정보를 가져옴.
								var cur_hours_str = cur_time_arr[0];
								var cur_minutes_str = cur_time_arr[1];

								var cur_time_format_str = "";
								var cur_hours = parseInt(cur_hours_str);
								var cur_minutes = parseInt(cur_minutes_str); 

								// update seconds
								var seconds_total = (cur_hours * 3600) + (cur_minutes * 60);
								var cur_prop_map = _self.get_element_meta_info().get_prop_map();
								cur_prop_map.__seconds = seconds_total;
								cur_prop_map.__time_hh_mm = cur_time_str;

								_self.set_value_time_jq(cur_time_str);
							}

							_self.call_delegate_save_n_reload(cur_element_type, _obj.EVENT_TYPE_UPDATE_ITEM);
							_self.release();
						}						

					}

					cur_btn_time_ok_jq.click(function(e){
						e.stopPropagation();
						do_on_event_btn_time_ok(e);

						// DEBUG
						//var cur_sibling_element_event_manager_arr = _self.get_sibling_element_event_manager_arr(true);
						// console.log("DEBUG / cur_sibling_element_event_manager_arr : ",cur_sibling_element_event_manager_arr);

					});

					var do_on_event_btn_time_cancel = function(e) {
						e.stopPropagation();
						_self.hide_all();
						_self.show_view_mode();
						_self.release();
					}

					cur_btn_time_cancel_jq.click(function(e){
						do_on_event_btn_time_cancel(e);
					});
					
					// 아래 코드로 인해 body의 이벤트가 제거됨.
					// event hierarchy 객체에 등록하여 사용하는 구조로 변경.
					this.event_hierarchy_manager.clear_delegate_keyup_on_document();
					this.event_hierarchy_manager.add_delegate_keyup_on_document(_obj.getDelegate(function(e) {

						var code = e.keyCode || e.which;
						var _self_jq = $(this);

						// console.log("code : ",code);
						// Enter : 13 / ESC : 27 / + : 187 / - : 189
						if(code === 13) {
							do_on_event_btn_time_ok(e);
						} else if(code === 27) {
							do_on_event_btn_time_cancel(e);
						} else if(code === 187) {
							do_on_event_btn_time_plus(e);
						} else if(code === 189) {
							do_on_event_btn_time_minus(e);
						}

					},this));

				}

				this.set_event_btn_cancel_on_input_group(_obj.EVENT_TYPE_INSERT_ITEM);
			}
			,on_add_btn_click:function(){

				var _obj = airborne.bootstrap.obj;

				// 더 이상 이벤트를 받지 않도록 잠급니다.
				this.lock();

				if( _obj.ELEMENT_TYPE_TABLE_TITLE_ADDABLE === this.get_element_type() ) {
					// 테이블의 경우 열 추가는 타이틀 열에서 진행됩니다.
					// 열에 대해 기본 값으로 저장합니다. 편집은 저장 이후에 진행합니다.
					this.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_NONE, _obj.EVENT_TYPE_INSERT_TABLE_ROW_ITEMS);
					return;
				} else {
					// 현재는 리스트 형만 받고 있습니다.
					console.log("on_add_btn_click / 02 / 현재는 리스트 형만 받고 있습니다.");
					this.show_input_mode(_obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY);
				}

				// set input group events
				this.set_event_btn_ok_on_input_group(_obj.EVENT_TYPE_INSERT_ITEM);
				this.set_event_btn_cancel_on_input_group(_obj.EVENT_TYPE_INSERT_ITEM);
				
			}
			,on_edit_btn_click:function(){

				var _obj = airborne.bootstrap.obj;

				// 더 이상 이벤트를 받지 않도록 잠급니다.
				this.lock();

				// edit mode일 경우만 사용합니다.
				// 선택한 열의 타이틀을 input group의 텍스트로 바꿉니다.
				this.hide_title_jq_text_head();

				// set search list data
				this.set_search_list_data_on_input_group();
				this.show_input_mode();

				// set input group events
				this.set_event_btn_ok_on_input_group(_obj.EVENT_TYPE_UPDATE_ITEM);
				
				// time input event
				this.set_event_time_editor_on_input_group();
				
			}
			,get_element_area:function(){
				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == null) return 0;

				return cur_element_jq.outerWidth() * cur_element_jq.outerHeight();
			}

			// @ functions - sibling actions
			,call_delegate_on_prev_siblings_event_manager:function(delegate_obj){
				if(_obj.isNotValidDelegate(delegate_obj)){
					console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / call_delegate_on_prev_siblings_event_manager / _obj.isNotValidDelegate(delegate_obj)");
					return;
				}

				// 자신보다 이전에 생성된 형제 이벤트 매니저를 호출하여 사용자가 지정한 델리게이트 함수를 실행합니다.
				var cur_prev_sibling_event_manager = this.get_before_sibling_event_manager();
				while(cur_prev_sibling_event_manager != null){
					// 여기서 델리게이트를 실행
					delegate_obj._func.apply(delegate_obj._scope, [cur_prev_sibling_event_manager]);
					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_prev_sibling_event_manager = cur_prev_sibling_event_manager.get_before_sibling_event_manager();
				}

			}
			,call_delegate_on_next_siblings_event_manager:function(delegate_obj){
				if(_obj.isNotValidDelegate(delegate_obj)){
					console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / call_delegate_on_next_siblings_event_manager / _obj.isNotValidDelegate(delegate_obj)");
					return;
				}

				// 자신보다 이후에 생성된 형제 이벤트 매니저를 호출하여 사용자가 지정한 델리게이트 함수를 실행합니다.
				var cur_next_sibling_event_manager = this.get_after_sibling_event_manager();
				while(cur_next_sibling_event_manager != null){
					// 여기서 델리게이트를 실행
					delegate_obj._func.apply(delegate_obj._scope, [cur_next_sibling_event_manager]);
					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_next_sibling_event_manager = cur_next_sibling_event_manager.get_after_sibling_event_manager();
				}		

			}
			,call_delegate_on_siblings_event_manager:function(delegate_obj){
				if(_obj.isNotValidDelegate(delegate_obj)){
					console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / call_delegate_on_siblings_event_manager / _obj.isNotValidDelegate(delegate_obj)");
					return;
				}
				// 형제 이벤트 매니저를 호출하여 사용자가 지정한 델리게이트 함수를 실행합니다.
				this.call_delegate_on_prev_siblings_event_manager(delegate_obj);
				this.call_delegate_on_next_siblings_event_manager(delegate_obj);
			}

			//     dMMMMMP      dMMMMMMMMb                dMMMMb  dMMMMMP dMP     .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb  .dMMMb 
			//    dMP          dMP"dMP"dMP               dMP.dMP dMP     dMP     dMP"dMP   dMP   amr dMP"dMP dMP dMP dMP" VP 
			//   dMMMP        dMP dMP dMP               dMMMMK" dMMMP   dMP     dMMMMMP   dMP   dMP dMP dMP dMP dMP  VMMMb   
			//  dMP     amr  dMP dMP dMP  amr          dMP"AMF dMP     dMP     dMP dMP   dMP   dMP dMP.aMP dMP dMP dP .dMP   
			// dMMMMMP dMP  dMP dMP dMP  dMP          dMP dMP dMMMMMP dMMMMMP dMP dMP   dMP   dMP  VMMMP" dMP dMP  VMMMP"    

			// @ Desc : 자신이 포함된 최상위 엘리먼트 콜렉션 셋 객체를 반환합니다.
			,get_top_parent_element_collection_set:function(cur_event_manager){

				var cur_element_collection_set = cur_event_manager.get_element_set().get_element_collection_set();
				if(cur_element_collection_set == undefined) {
					console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / get_top_parent_element_collection_set / cur_element_collection_set == undefined");
					return;
				}

				var cur_parent_element_set = cur_element_collection_set.get_parent_element_set();
				if(cur_parent_element_set == undefined) {
					// 더 이상의 위의 부모 객체가 없습니다. 자신의 element collection set을 반환합니다.
					return cur_element_collection_set;
				} else {
					// 위에 부모 객체가 있습니다. 부모의 element collection set을 찾기 위해 재귀 호출 합니다.
					return this.get_top_parent_element_collection_set(cur_parent_element_set.get_event_manager());
				}

			}
			// @ private
			// @ 파라미터로 넘겨진 cur_element_set_collection부터 검색하여 
			// 각 형제, 자식의 element set마다 파라미터로 delegate 함수를 실행.
			,call_delegate_do_to_all_element_set:function(cur_element_set_collection, delegate_do_to_all_element_set){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;
				if(cur_element_set_collection == undefined) {
					console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / call_delegate_do_to_all_element_set / cur_element_set_collection == undefined)");
					return;
				}
				if(_obj.isNotValidDelegate(delegate_do_to_all_element_set)) {
					console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / call_delegate_do_to_all_element_set / _obj.isNotValidDelegate(delegate_do_to_all_element_set)");
					return;
				}
				var cur_element_set_arr = cur_element_set_collection.get_element_set_arr();
				if(_v.is_not_valid_array(cur_element_set_arr)){
					return;
				}

				// 자신의 element collection set의 모든 정보를 json str으로 변환한다.
				var idx;
				var length = cur_element_set_arr.length;
				var json_format_obj = null;
				for(idx = 0;idx < length;idx++){
					var cur_element_set = cur_element_set_arr[idx];

					// call delegate
					delegate_do_to_all_element_set._func.apply(delegate_do_to_all_element_set._scope,[cur_element_set]);

					// 자식 객체 정보를 가져옵니다.		/	child element collection set
					var cur_children_element_collection_set_arr = cur_element_set.get_children_element_collection_set_arr();
					if(_v.is_valid_array(cur_children_element_collection_set_arr)){
						var inner_idx;
						var inner_length = cur_children_element_collection_set_arr.length;
						for(inner_idx = 0;inner_idx < inner_length;inner_idx++){
							var cur_child_element_collection_set = cur_children_element_collection_set_arr[inner_idx];
							// 여기서 재귀 호출
							this.call_delegate_do_to_all_element_set(cur_child_element_collection_set, delegate_do_to_all_element_set);
						} // inner for end
					}
				} // for end

			}
			// @ private
			// @ 자신의 자식 객체 중의 shy element set을 돌려줌
			,get_shy_child_element_set:function(){

				var _v = airborne.validator;

				var cur_child_shy_element_collection_set_arr = this.get_child_shy_element_collection_set_arr();
				var cur_element_set_arr = [];
				if( _v.is_valid_array(cur_child_shy_element_collection_set_arr) && 
					cur_child_shy_element_collection_set_arr.length == 1) {

					var cur_children_element_collection_set = cur_child_shy_element_collection_set_arr[0];
					cur_element_set_arr = cur_children_element_collection_set.get_element_set_arr();
				}
				var is_shy = false;
				
				if( _v.is_valid_array(cur_element_set_arr) && 
					cur_element_set_arr.length == 1) {

					cur_element_set = cur_element_set_arr[0];
					is_shy = cur_element_set.get_meta_info().get_is_shy();
				}
				if(is_shy === true){
					return cur_element_set;
				}
				return null;
			}
			,hide_shy_child_element_set:function(){
				var shy_child_element_set = this.get_shy_child_element_set();

				if(shy_child_element_set == undefined){
					return;
				}

				shy_child_element_set.get_event_manager().hide_element_container_jq();
			}
			// @ private
			// @ 자신의 형제 객체 중의 shy element set을 돌려줌
			,get_shy_sibling_element_set:function(){
				var cur_element_set = this.get_element_set();
				var cur_element_collection_set = cur_element_set.get_element_collection_set();
				var cur_element_set_arr = cur_element_collection_set.get_element_set_arr();

				var idx;
				var length = cur_element_set_arr.length;
				var shy_element_set;
				for(idx = 0; idx < length; idx++){
					var next_element_set = cur_element_set_arr[idx];

					if(next_element_set.get_meta_info().get_is_shy()) {
						shy_element_set = next_element_set;
						break;
					}
				}
				return shy_element_set;
			}
			,hide_shy_sibling_element_set:function(){
				var shy_sibling_element_set = this.get_shy_sibling_element_set();
				if(shy_sibling_element_set == undefined){
					return;
				}

				shy_sibling_element_set.get_event_manager().hide_element_jq();
			}
			// @ private
			// @ 자신의 형제 객체 중의 shy element set를 자신의 element set 바로 위로 이동시킴
			,move_shy_sibling_element_set_above_this:function(){

				var _dates = airborne.dates;
				var _obj = airborne.bootstrap.obj;

				var shy_sibling_element_set = this.get_shy_sibling_element_set();
				if(shy_sibling_element_set == undefined) {
					return;
				}

				// shy_element_set을 사용자가 선택한 엘리먼트와 그 다음 엘리먼트 사이에 넣습니다.
				var next_element_set = this.get_element_set();
				var prev_element_set = this.get_element_set().get_sibling_prev_element_set();
				// shy_element_set의 처음 위치는 첫번째 열이다. 
				// 사용자가 두번째 열에서 열을 추가하면 
				// prev_element_set도 shy_sibling_element_set을 가리키게 된다.
				if(this.get_element_set().get_element_collection_set().is_same_element_set(prev_element_set, shy_sibling_element_set)){
					prev_element_set = undefined;
				}
				next_element_set.get_event_manager().get_element_jq().after(shy_sibling_element_set.get_event_manager().get_element_jq());

				var next_element_jq_from_shy = shy_sibling_element_set.get_event_manager().get_element_jq().next();
				var cur_title_input_group_jq = this.get_title_input_group_jq();
				if(next_element_jq_from_shy.length == 0) {
					// 입력창이 맨 마지막 열로 배치되었습니다.
					_obj.remove_list_row_css_radius(next_element_set.get_event_manager().get_element_jq(), _obj.LIST_ROW_RADIUS_NORMAL)
					_obj.remove_list_row_css_radius(cur_title_input_group_jq);
					_obj.set_list_last_row_css_radius(cur_title_input_group_jq, _obj.LIST_ROW_RADIUS_NORMAL);
				}

				
				//element_type
				var cur_element_type = shy_sibling_element_set.get_meta_info().get_element_type();
				if(_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT === cur_element_type) {
					// console.log("시간 타입인 경우, 이동한 열에 맞게 시간을 변경해줍니다.");

					// 이전 객체가 있다면 이전 객체의 시간을 가져옵니다.
					var prev_time_sec = 0;
					if(prev_element_set != undefined) {
						// console.log("이전 객체가 있다면 이전 객체의 시간을 가져옵니다.");
						prev_time_sec = prev_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec;
					}

					// 이후 객체가 있다면 이후 객체의 시간을 가져옵니다.
					var next_time_sec = 0;
					if(next_element_set != undefined) {
						// console.log("이후 객체가 있다면 이전 객체의 시간을 가져옵니다.");
						next_time_sec = next_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec;
					}

					var five_minutes_in_secs = 300; // 60 * 5
					if( prev_time_sec == 0 && next_time_sec > 0 ) {
						// 첫번째 엘리먼트로 옮겼습니다.
						// 다음 시간으로부터 5분 전으로 변경합니다.

						shy_sibling_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec = next_time_sec - five_minutes_in_secs;


					} else if( prev_time_sec > 0 && next_time_sec == 0 ) {
						// 마지막 엘리먼트로 옮겼습니다.
						// 다음 시간으로부터 5분 후로 변경합니다.

						shy_sibling_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec = prev_time_sec + five_minutes_in_secs;


					} else if( prev_time_sec > 0 && next_time_sec > 0 ) {
						// 리스트의 처음과 마지막이 아닌 이전과 이후 엘리먼트가 모두 있습니다.
						// 이전과 이후 엘리먼트의 사이 값으로 새로운 시간을 지정해 줍니다.

						if( prev_time_sec == next_time_sec ) {
							// 두 시간이 동일한 경우는 같은 시간으로 넘겨줍니다.

							shy_sibling_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec = prev_time_sec;

						} else if( prev_time_sec < next_time_sec ) {
							// 두 시간이 차이가 있는 경우

							var ten_minutes_in_secs = 600; // 60 * 10
							var time_diff_in_secs = (next_time_sec - prev_time_sec);
							if( ten_minutes_in_secs <= time_diff_in_secs ){
								// 두 시간의 차이가 10분 이상인 경우, 두 시간 사이 값의 중간 값을 설정해줍니다.
								// 중간값이 5분 단위로 제어되도록 설정합니다.

								shy_sibling_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec = prev_time_sec + parseInt(time_diff_in_secs / 2);
									
							} else {
								// 두 시간의 차이가 10분 미만인 경우, 두 시간 사이 값중 작은 값을 설정해줍니다.

								shy_sibling_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec = prev_time_sec;
									
							}

						}

					}
					// prop_map의 시간이 업데이트되었습니다. 
					// 화면에 표시되는 시간을 업데이트 합니다.
					var new_time_hh_mm = _dates.get_hh_mm_from_seconds(shy_sibling_element_set.get_meta_info().get_prop_map().__prop_map.__time_sec);
					if(_dates.is_valid_time_format_double_digit(new_time_hh_mm)){
						shy_sibling_element_set.get_event_manager().set_value_time_jq(new_time_hh_mm);
					}
				}
			}
			/*
				@ private
				@ Desc : 선택한 엘리먼트 아래에 input group을 이동시킴.
			*/
			,move_title_input_group_jq_under_me:function(){

				var _obj = airborne.bootstrap.obj;

				this.get_element_jq().after(this.get_title_input_group_jq());

				// show input groups
				this.show_title_input_group_jq();
				this.show_title_input_container_jq();
				this.show_title_input_jq();

				this.show_title_input_btn_ok_jq();
				this.show_title_input_btn_cancel_jq();

				// set text from shy element set
				this.set_title_input_jq_value("New Action");
				this.focus_title_input_jq();
			}
			// @ private
			// 테이블을 위한 element 관계 참조 메서드 모음입니다.
			// 테이블 형태는 데이터간 관계를 확인하는 일이 중요합니다.
			// 관계를 알아야 열, 줄간의 데이터 비교 및 이동, 추가, 삭제가 가능합니다.
			// 이 관계는 element json 객체에 정의되어 있습니다. (사용자가 데이터를 인자로 넘기면서 열, 줄 관계가 만들어 집니다.)
			// TODO 리스트도 아래와 같은 형식의 관계 참조 방식으로 변경할 필요가 있습니다.
			, get_element_json_ref_up:function() {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().get_element_json_ref_up();
			}
			, set_element_json_ref_up:function(ref_up) {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().set_element_json_ref_up(ref_up);
			}
			, get_element_json_ref_down:function() {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().get_element_json_ref_down();
			}
			, set_element_json_ref_down:function(ref_down) {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().set_element_json_ref_down(ref_down);
			}
			, get_element_json_ref_prev:function() {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().get_element_json_ref_prev();
			}
			, set_element_json_ref_prev:function(ref_prev) {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().set_element_json_ref_prev(ref_prev);
			}
			, get_element_json_ref_next:function() {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().get_element_json_ref_next();
			}
			, set_element_json_ref_next:function(ref_next) {
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().set_element_json_ref_next(ref_next);
			}
			, get_all_horizontal_element_json_ref_arr:function(has_myself, has_shy_element){
				if(this.get_element_meta_info() == undefined) {
					return;
				}
				return this.get_element_meta_info().get_all_horizontal_element_json_ref_arr(has_myself, has_shy_element);
			}
		};
		var element_event_manager = delegate_set_event_manager_prop._func.apply(delegate_set_event_manager_prop._scope, [element_event_manager]);



		//     dMMMMMP      dMMMMMMMMb          dMP dMP .aMMMb  dMP     dMP dMMMMb  .aMMMb dMMMMMMP .aMMMb  dMMMMb 
		//    dMP          dMP"dMP"dMP         dMP dMP dMP"dMP dMP     amr dMP VMP dMP"dMP   dMP   dMP"dMP dMP.dMP 
		//   dMMMP        dMP dMP dMP         dMP dMP dMMMMMP dMP     dMP dMP dMP dMMMMMP   dMP   dMP dMP dMMMMK"  
		//  dMP     amr  dMP dMP dMP  amr     YMvAP" dMP dMP dMP     dMP dMP.aMP dMP dMP   dMP   dMP.aMP dMP"AMF   
		// dMMMMMP dMP  dMP dMP dMP  dMP       VP"  dMP dMP dMMMMMP dMP dMMMMP" dMP dMP   dMP    VMMMP" dMP dMP    


		// check element_event_manager validation.
		if(_v.isNotJQueryObj(element_event_manager.element_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / element_jq is @required / Using set_element_jq()");
			return null;
		}
		if(element_event_manager.element_color == null){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / element_color is @required / Using set_element_color()");
			return null;
		}
		if(element_event_manager.element_background_color == null){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / element_background_color is @required / Using set_element_background_color()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.element_container_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / element_container_jq is @required / Using set_element_container_jq()");
			return null;
		}
		if(_v.isNotValidStr(element_event_manager.element_id)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / element_id is @required / Using set_element_id()");
			return null;
		}
		if(element_event_manager.get_element_type() == null){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / element_type is @required / Using set_element_type()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / title_jq is @required / Using set_title_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.parent_container_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / parent_container_jq is @required / Using set_parent_container_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_group_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / title_input_group_jq is @required / Using set_title_input_group_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / title_input_jq is @required / Using set_title_input_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_btn_ok_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / title_input_btn_ok_jq is @required / Using set_title_input_btn_ok_jq");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_btn_cancel_jq)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / title_input_btn_cancel_jq is @required / Using set_title_input_btn_cancel_jq");
			return null;
		}
		if(_obj.isNotValidDelegate(element_event_manager.delegate_save_n_reload)){
			console.log("!Error! / airborne.bootstrap.obj / get_element_event_manager / delegate_save_n_reload is @required / Using set_delegate_save_n_reload");
			return null;
		}

		// @ Section - Relation
		if(element_event_manager.get_element_meta_info() != undefined) {
			// element meta info 객체에 event manager 참조를 넣습니다.
			var cur_element_meta_info = element_event_manager.get_element_meta_info();
			cur_element_meta_info.set_event_manager(element_event_manager);
		}

		// css로 컬러 설정을 지정해야 자식 객체의 색상이 부모 색상 변경에 영향을 받지 않습니다.
		element_event_manager.set_colors_back();

		// 이벤트 매니저 추가.
		event_hierarchy_manager.add_event_manager(element_event_manager);

		// TODO mouse enter, mouse leave를 body mouse move를 통해 확인하는 구조로 변경.
		// 1. 자신의 element manager를 가지고 mouse enter, mouse leave - call back을 받는 구조.
		cur_mousemove_callback_set =
		event_hierarchy_manager.add_mousemove_callback_set(_obj.get_delegate(function(mousemove_event, event_manager_on_mousemove){


			var consoler = airborne.console.get();
			consoler.off();

			var id_for_test = event_manager_on_mousemove.get_id();
			var title_for_test = event_manager_on_mousemove.get_title_jq_value();

			if(title_for_test.indexOf("Table topi") > -1) {
				consoler.on();				
			}

			// consoler.say("");
			// consoler.say("Mouse Move Callback / mmc");
			// consoler.say("mmc / 0 / ",title_for_test);

			if(event_manager_on_mousemove.is_lock()) {
				// consoler.say("mmc / 1 / ",title_for_test);
				// consoler.say("mmc / 1 / is_lock : ",event_manager_on_mousemove.is_lock());
				return;	
			}


			var element_jq_on_mousemove = event_manager_on_mousemove.get_element_jq();
			var is_hover = _obj.is_hover(mousemove_event, element_jq_on_mousemove);

			// 이전과 동일한 상태라면 중단.
			var was_hover = event_manager_on_mousemove.get_was_hover();
			
			

			// TEST

			/*
			if(id_for_test.indexOf("table_todaysrole") > -1){
			//if(event_manager_on_mousemove.get_id() == "editable_list_row_input_12"){
				console.log("here! / ",title_for_test);
				console.log("was_hover : " + was_hover + "\tis_hover : " + is_hover);

				// 
				var x_pos = mousemove_event.pageX;
				var y_pos = mousemove_event.pageY;
				var target_position = element_jq_on_mousemove.offset();
				var target_width = element_jq_on_mousemove.outerWidth();
				var target_height = element_jq_on_mousemove.outerHeight();

				var is_valid_y_pos = ((target_position.top < y_pos) && (y_pos < (target_position.top + target_height)))?true:false;
				var is_valid_x_pos = ((target_position.left < x_pos) && (x_pos < (target_position.left + target_width)))?true:false;

				var output = 
				"x_pos : <x_pos>\ty_pos : <y_pos>\ttop : <top>\tleft : <left>\twidth : <width>\theight : <height>\theight : <height>\tis_valid_y_pos : <is_valid_y_pos>\tis_valid_x_pos : <is_valid_x_pos>"
				.replace(/\<x_pos\>/gi, x_pos)
				.replace(/\<y_pos\>/gi, y_pos)
				.replace(/\<top\>/gi, target_position.top)
				.replace(/\<left\>/gi, target_position.left)
				.replace(/\<width\>/gi, target_width)
				.replace(/\<height\>/gi, target_height)
				.replace(/\<is_valid_y_pos\>/gi, is_valid_y_pos)
				.replace(/\<is_valid_x_pos\>/gi, is_valid_x_pos)
				;
				console.log(output);
			}
			*/

			if(was_hover === is_hover) return;

			// TEST
			// console.log("\n\n");
			// console.log(">> mousemove_event.timeStamp : ",mousemove_event.timeStamp);

			// 검사중인 엘리먼트가 shy mode인지 확인합니다.
			var cur_meta_info = event_manager_on_mousemove.get_element_meta_info();
			var is_shy = false;
			if(cur_meta_info.get_is_shy != null){
				is_shy = cur_meta_info.get_is_shy();
			}

			// get_children_element_set_arr
			consoler.say("mmc / 1 / ",title_for_test);
			consoler.say("mmc / 1 / is_hover : " + is_hover + " / was_hover : " + was_hover);

			// 부모,자식,형제 객체에 접근하기 위한 element_set
			var cur_element_set = event_manager_on_mousemove.get_element_set();
			var cur_children_element_set_arr = cur_element_set.get_children_element_set_arr();
			var has_children = (_v.is_valid_array(cur_children_element_set_arr))?true:false;

			var cur_child_shy_element_set_arr = cur_element_set.get_child_shy_element_set_arr();
			var has_shy_child = (_v.is_valid_array(cur_child_shy_element_set_arr))?true:false;

			// 자신의 형제 엘리먼트와 shy 엘리먼트를 가져온다.
			var cur_parent_element_set = cur_element_set.get_parent_element_set();
			var cur_sibling_element_set_arr = [];
			var cur_sibling_shy_element_set_arr = [];
			var has_sibling = false;
			var has_shy_sibling = false;
			if(cur_parent_element_set != undefined) {
				cur_sibling_element_set_arr = cur_parent_element_set.get_children_element_set_arr();
				cur_sibling_shy_element_set_arr = cur_parent_element_set.get_child_shy_element_set_arr();

				has_sibling = (_v.is_valid_array(cur_sibling_element_set_arr))?true:false;
				has_shy_sibling = (_v.is_valid_array(cur_sibling_shy_element_set_arr))?true:false;
			}

			// mouse over를 기록합니다.
			event_manager_on_mousemove.set_was_hover(is_hover);

			// 자신이 mouse over 이지만, mouse leave로 처리해야 될 경우들.
			if(is_hover == true){
				consoler.say("mmc / 1-1 / ",title_for_test);
				consoler.say("mmc / 1-1 / 자신이 mouse over 이지만, mouse leave로 처리해야 될 경우들");

				// 자식 엘리먼트가 있다면, 자신의 자식 엘리먼트가 mouse over인지 확인합니다.
				var is_child_hover = false;
				if(_v.is_valid_array(cur_children_element_set_arr)){
					consoler.say("mmc / 1-1-1 / ",title_for_test);
					consoler.say("mmc / 1-1-1 / 자신의 자식 엘리먼트가 mouse over인지 확인합니다");
					
					for(var idx = 0; idx < cur_children_element_set_arr.length; idx++){
						var cur_child_element_set = cur_children_element_set_arr[idx];
						is_child_hover = _obj.is_hover(mousemove_event, cur_child_element_set.get_event_manager().get_element_jq());
						if(is_child_hover == true){
							cur_child_element_set_on_hover = cur_child_element_set;
							break;
						}
					}
				}
				// 자식 shy 엘리먼트가 있다면, 자신의 자식 shy 엘리먼트가 mouse over인지 확인합니다.
				var is_shy_child_hover = false;
				if(_v.is_valid_array(cur_child_shy_element_set_arr)){
					consoler.say("mmc / 1-1-2 / ",title_for_test);
					consoler.say("mmc / 1-1-2 / 자신의 shy 자식 엘리먼트가 mouse over인지 확인합니다");

					for(var idx = 0; idx < cur_child_shy_element_set_arr.length; idx++){
						var cur_child_element_set = cur_child_shy_element_set_arr[idx];
						is_shy_child_hover = _obj.is_hover(mousemove_event, cur_child_element_set.get_event_manager().get_element_jq());
						if(is_shy_child_hover == true){
							cur_child_element_set_on_hover = cur_child_element_set;
							break;
						}
					}
				}

				if((is_shy_child_hover || is_child_hover) && cur_child_element_set_on_hover != null){
					if(event_manager_on_mousemove.get_was_hover() == true){
						consoler.say("mmc / 1-2-1 / ",title_for_test);
						consoler.say("mmc / 1-2-1 / 자신의 자식 엘리먼트가 mouse over이고 자신이 mouse over라면 자신을 mouse leave 상태로 전환합니다.");

						event_manager_on_mousemove.on_mouse_leave();
						event_manager_on_mousemove.set_was_hover(false);
					} else {
						consoler.say("mmc / 1-2-2 / ",title_for_test);
						consoler.say("mmc / 1-2-2 / 자신의 자식 엘리먼트가 mouse over이지만 자신이 mouse leave라면 변경할 필요가 없습니다. 종료.");
					}
					return;
				}

				consoler.say("mmc / 1-3 / ",title_for_test);
				consoler.say("mmc / 1-3 / 자신이 mouse over 이지만, mouse leave로 처리해야 될 경우가 없습니다.");
			}



			if(!is_hover && !is_shy){

				consoler.say("mmc / 2 / ",title_for_test);
				consoler.say("mmc / 2 / 커서가 엘리먼트 바깥에 있다면 mouse leave로 바꿉니다.");

				event_manager_on_mousemove.on_mouse_leave();

				if(!has_children && has_shy_child) {
					consoler.say("mmc / 2-1 / ",title_for_test);
					consoler.say("mmc / 2-1 / 자식 객체가 없고, shy element가 화면에 보인다면 화면에서 숨깁니다.");

					for(var beta_idx = 0; beta_idx < cur_child_shy_element_set_arr.length; beta_idx++){
						var cur_child_shy_element_set = cur_child_shy_element_set_arr[beta_idx];
						if(cur_child_shy_element_set == null){
							// console.log("!Warning! / cur_child_shy_element_set == null / " + title_for_test);
							continue;
						}

						var cur_meta_info = cur_child_shy_element_set.get_meta_info();
						if(cur_meta_info == null){
							// console.log("!Warning! / cur_meta_info == null / " + title_for_test);
							continue;
						}

						var cur_child_shy_element_em = cur_child_shy_element_set.get_event_manager();
						var cur_child_shy_element_title = cur_child_shy_element_em.get_title_jq_value();
						if(cur_child_shy_element_em != undefined) {

							consoler.say("mmc / 2-1-1 / ",title_for_test);
							consoler.say("mmc / 2-1-1 / shy title : ",cur_child_shy_element_title);
							consoler.say("mmc / 2-1-1 / shy 자식 객체를 화면에 노출하지 않습니다.");

							cur_child_shy_element_em.hide_element_jq();
							cur_child_shy_element_em.hide_element_container_jq();
						}


					} // for end	
				}

			} else if(!is_hover && is_shy) {

				consoler.say("mmc / 3 / ",title_for_test);
				consoler.say("mmc / 3 / 커서가 엘리먼트 바깥에 있다면 mouse leave 상태가 됩니다.");

				if(has_sibling) {
					consoler.say("mmc / 3-1 / ",title_for_test);
					consoler.say("mmc / 3-1 / shy row와 다른 list row도 있습니다. shy row를 리스트에서 숨깁니다.");

					event_manager_on_mousemove.hide_element_jq();
					event_manager_on_mousemove.hide_element_container_jq();
					event_manager_on_mousemove.set_was_hover(false);
				} else {
					consoler.say("mmc / 3-2 / ",title_for_test);
					consoler.say("mmc / 3-2 / shy row만 리스트에 있다면, shy row 자신은 mouse leave 상태가 됩니다.");

					event_manager_on_mousemove.on_mouse_leave();
					event_manager_on_mousemove.set_was_hover(false);
				}

			} else if(is_hover && is_shy) {

				consoler.say("mmc / 4 / ",title_for_test);
				consoler.say("mmc / 4 / 커서가 엘리먼트 안쪽으로 들어왔습니다. 이 엘리먼트는 shy mode입니다.");

				if(has_sibling) {
					consoler.say("mmc / 4-1-1 / ",title_for_test);
					consoler.say("mmc / 4-1-1 / shy row와 다른 list row도 있습니다. shy row를 리스트에서 숨깁니다.");

					event_manager_on_mousemove.hide_element_jq();
					event_manager_on_mousemove.hide_element_container_jq();
				} else {
					consoler.say("mmc / 4-1-2 / ",title_for_test);
					consoler.say("mmc / 4-1-2 / shy row만 리스트에 있다면, shy row 자신은 mouse over 상태가 됩니다.");

					event_manager_on_mousemove.on_mouse_over();
				}

				if(cur_parent_element_set != null){
					consoler.say("mmc / 4-2 / ",title_for_test);
					consoler.say("mmc / 4-2 / 부모 객체는 mouse leave(view mode) 상태가 됩니다.");

					cur_parent_element_set.get_event_manager().on_mouse_leave();
					cur_parent_element_set.get_event_manager().set_was_hover(false);
				}


			} else if(is_hover && !is_shy) {

				consoler.say("mmc / 5 / ",title_for_test);
				consoler.say("mmc / 5 / 커서가 엘리먼트 안쪽으로 들어왔습니다. 이 엘리먼트는 shy mode가 아닙니다.");
				consoler.say("mmc / 5 / 자신은 mouse over 상태가 됩니다.");

				event_manager_on_mousemove.on_mouse_over();
				
				if(cur_parent_element_set != null){

					consoler.say("mmc / 5-1 / ",title_for_test);
					consoler.say("mmc / 5-1 / 부모 객체는 mouse leave(view mode) 상태가 됩니다.");

					cur_parent_element_set.get_event_manager().on_mouse_leave();
					cur_parent_element_set.get_event_manager().set_was_hover(false);
				}

				consoler.say("mmc / 5-2 / ",title_for_test);
				var cur_children_element_collection_set_arr = cur_element_set.get_children_element_collection_set_arr();
				for(var c_idx = 0; c_idx < cur_children_element_collection_set_arr.length; c_idx++) {
					var cur_child_ecs = cur_children_element_collection_set_arr[c_idx];
					consoler.say("mmc / 5-2 / child_ecs : ",cur_child_ecs.say_yourself());	
				}
				var cur_child_shy_element_collection_set_arr = cur_element_set.get_child_shy_element_collection_set_arr();
				for(var s_idx = 0; s_idx < cur_child_shy_element_collection_set_arr.length; s_idx++) {
					var cur_shy_ecs = cur_child_shy_element_collection_set_arr[s_idx];
					consoler.say("mmc / 5-2 / shy_ecs : ",cur_shy_ecs.say_yourself());	
				}

				if(has_shy_child) {

					for(var idx = 0; idx < cur_child_shy_element_set_arr.length; idx++){
						var cur_child_element_set = cur_child_shy_element_set_arr[idx];
						if(cur_child_element_set == null){
							consoler.say("!Warning! / cur_child_element_set == null / " + title_for_test);	
							continue;
						}

						var cur_meta_info = cur_child_element_set.get_meta_info();
						var child_title_for_debug = cur_child_element_set.get_event_manager().get_title_jq_value();
						if(cur_meta_info == null){
							consoler.say("!Warning! / cur_meta_info == null / " + title_for_test);
							continue;
						}

						consoler.say("mmc / 5-2-1 / ",title_for_test);
						consoler.say("mmc / 5-2-1 / idx : ",idx);
						consoler.say("mmc / 5-2-1 / child_title_for_debug : ",child_title_for_debug);
						consoler.say("mmc / 5-2-1 / cur_meta_info : ",cur_meta_info);

						if(cur_meta_info.get_is_shy()){

							consoler.say("mmc / 5-2-1-1 / ",title_for_test);
							consoler.say("mmc / 5-2-1-1 / idx : ",idx);
							consoler.say("mmc / 5-2-1-1 / child_title_for_debug : ",child_title_for_debug);

							consoler.say("mmc / 5-2-1-1 / 자식 객체가 shy mode 입니다.");
							consoler.say("mmc / 5-2-1-1 / cur_meta_info : ",cur_meta_info);
							consoler.say("mmc / 5-2-1-1 / cur_children_element_set_arr : ",cur_children_element_set_arr);

							if(has_children){
								consoler.say("mmc / 5-2-1-1-1 / ",title_for_test);
								consoler.say("mmc / 5-2-1-1-1 / idx : ",idx);
								consoler.say("mmc / 5-2-1-1-1 / child_title_for_debug : ",child_title_for_debug);

								consoler.say("mmc / 5-2-1-1-1 / shy row와 다른 list row도 있습니다. shy row를 리스트에서 숨깁니다.");

								cur_child_element_set.get_event_manager().hide_element_jq();
								cur_child_element_set.get_event_manager().hide_element_container_jq();
							} else {
								consoler.say("mmc / 5-2-1-1-2 / ",title_for_test);
								consoler.say("mmc / 5-2-1-1-2 / idx : ",idx);
								consoler.say("mmc / 5-2-1-1-2 / child_title_for_debug : ",child_title_for_debug);

								consoler.say("mmc / 5-2-1-1-2 / shy row만 리스트에 있다면, shy row 자신은 mouse over 상태가 됩니다.");

								cur_child_element_set.get_event_manager().show_element_container_jq();
								cur_child_element_set.get_event_manager().show_element_jq();
								cur_child_element_set.get_event_manager().on_mouse_leave();
							}
							
							event_manager_on_mousemove.on_mouse_over();
						} else {
							consoler.say("mmc / 5-2-1-2 / ",title_for_test);
							consoler.say("mmc / 5-2-1-2 / idx : ",idx);
							consoler.say("mmc / 5-2-1-2 / child_title_for_debug : ",child_title_for_debug);

							consoler.say("mmc / 5-2-1-2 / 자식 객체가 shy mode 가 아닙니다. 이미 화면에 노출되어 있습니다.");
							consoler.say("mmc / 5-2-1-2 / 자신은 화면에 mouse over로 노출합니다.");

							event_manager_on_mousemove.on_mouse_over();
						} // inner if end
					} // for end
				} // outer if end
			}

		}, this), element_event_manager);

		return element_event_manager;
	}
	,event_hierarchy_manager:null
	,get_event_hierarchy_manager:function(){
		if(this.event_hierarchy_manager != null) return this.event_hierarchy_manager;

		this.event_hierarchy_manager = {
			event_mamanger_map:null
			,add_event_manager:function(event_manager){
				if(this.event_mamanger_map == null){
					this.event_mamanger_map = {};
				}

				var required_event_manager_id = event_manager.get_id();
				var _v = airborne.validator;
				if(_v.isNotValidStr(required_event_manager_id)){
					console.log("!Error! / airborne.view.obj / get_event_hierarchy_manager / add_event_manager / _v.isNotValidStr(required_event_manager_id)");
					return null;
				}

				var required_event_manager = this.event_mamanger_map[required_event_manager_id];
				if(required_event_manager == null){
					this.event_mamanger_map[required_event_manager_id] = event_manager; 
				}
			}
			,get_event_manager:function(event_manager_id){
				var _v = airborne.validator;
				if(_v.isNotValidStr(event_manager_id)){
					console.log("!Error! / airborne.view.obj / get_event_hierarchy_manager / get_event_manager / _v.isNotValidStr(event_manager_id)");
					return null;
				}

				if(this.event_mamanger_map == null){
					this.event_mamanger_map = {};
					return null;
				}

				if(this.event_mamanger_map[event_manager_id] == null){
					return null;	
				}

				return this.event_mamanger_map[event_manager_id];	
			}
			,get_event_manager_by_element_tag:function(cur_element_tag){
				//var _v = airborne.validator;
				if(cur_element_tag == null){
					console.log("!Error! / airborne.view.obj / get_view_element_group_manager / get_element_event_manager / cur_element_tag == null");	
					return null;
				}

				if(this.element_event_hierarchy_manager == null){
					console.log("!Error! / airborne.view.obj / get_view_element_group_manager / get_element_event_manager / this.element_event_hierarchy_manager == null");	
					return null;
				}
				
				var event_manager_arr = this.get_all_event_manager_arr();

				var cur_element_event_manager = null;
				for (var idx = 0; idx < event_manager_arr.length; idx++) {
					var cur_event_manager = event_manager_arr[idx];
					if(cur_event_manager == null) continue;

					var cur_element_jq = cur_event_manager.get_element_jq();
					var cur_element = cur_element_jq[0];

					if(cur_element_tag == cur_element){
						// 엘리먼트의 이벤트 객체를 찾았다!
						cur_element_event_manager = cur_event_manager;
						break;
					}
				}

				return 	cur_element_event_manager;
			}			
			,get_all_event_manager_arr:function(){
				var all_event_manager_arr = [];
				for(var prop in this.event_mamanger_map){
					var cur_event_mamanger = this.event_mamanger_map[prop];
					all_event_manager_arr.push(cur_event_mamanger);
				}

				return all_event_manager_arr;
			}
			,lock_obj:null
			,lock:function(){
				this.lock_obj = {};
			}
			,release:function(){
				this.lock_obj = null;
			}
			,is_lock:function(){
				return (this.lock_obj != null)?true:false;
			}
			,do_after_mousemove_event:function(e){

				if(e == undefined) {
					return;
				}

				// 델리게이트 함수들에게 마우스 커서의 이동정보가 있는 이벤트 객체를 반환해줍니다.
				var cur_mousemove_callback_set_arr = this.get_mousemove_callback_set_arr();

				for (var idx = 0; idx < cur_mousemove_callback_set_arr.length; idx++) {
					var cur_mousemove_callback_set = cur_mousemove_callback_set_arr[idx];
					if(cur_mousemove_callback_set == null){
						console.log("!Warning! / cur_mousemove_callback_set == null");
						return;
					}

					var delegate_mousemove_callback = cur_mousemove_callback_set.mousemove_callback
					var cur_event_manager = cur_mousemove_callback_set.event_manager;

					delegate_mousemove_callback._func.apply(delegate_mousemove_callback._scope,[e, cur_event_manager]);
				}
			}
			// 가지고 있는 엘리먼트 객체의 외부에 마우스 커서가 이동했는지 주기적으로 확인하는 인터벌 함수가 필요.
			// 마우스 커서가 빠르게 움직일 경우, 이벤트를 놓치는 경우를 확인.
			,start_check_mouseleave:function(){

				var _self = this;
				var _obj = airborne.bootstrap.obj;

				this.add_delegate_mousemouse_on_document(_obj.getDelegate(function(e) {

					_self.do_after_mousemove_event(e);

				},this));

				// 윈도우에서 마우스 커서가 벗어나는 경우에도 호출합니다.
				// http://stackoverflow.com/questions/923299/how-can-i-detect-when-the-mouse-leaves-the-window#answer-3187524
				function addEvent(obj, evt, fn) {
				    if (obj.addEventListener) {
				        obj.addEventListener(evt, fn, false);
				    }
				    else if (obj.attachEvent) {
				        obj.attachEvent("on" + evt, fn);
				    }
				}
				addEvent(window,"load",function(e) {
				    addEvent(document, "mouseout", function(e) {
				        e = e ? e : window.event;
				        var from = e.relatedTarget || e.toElement;
				        if (!from || from.nodeName == "HTML") {
				            // stop your drag event here
				            // for now we can just use an alert
				            //alert("left window");
				            console.log("left window");

							var dummy_event = {
								pageX:-100
								,pageY:-100
							}

				            _self.do_after_mousemove_event(dummy_event);
				        }
				    });
				});

			}
			,mousemove_callback_set_arr:[]
			,add_mousemove_callback_set:function(mousemove_callback, event_manager){
				if(mousemove_callback == null){
					console.log("!Error! / airborne.view.obj / add_mousemove_callback / mousemove_callback == null");
					return;
				}

				var cur_mouse_move_callback_set = {mousemove_callback:mousemove_callback,event_manager:event_manager}

				this.mousemove_callback_set_arr.push(cur_mouse_move_callback_set);
				return cur_mouse_move_callback_set;
			}
			,remove_mousemove_callback_set:function(mouse_move_callback_set){
				if(mouse_move_callback_set == null){
					console.log("!Error! / airborne.view.obj / remove_mousemove_callback_set / mouse_move_callback_set == null");
					return;
				} 
				var mousemove_callback_set_edited_arr = [];
				for (var idx = 0; idx < this.mousemove_callback_set_arr.length; idx++) {
					var cur_mousemove_callback_set = this.mousemove_callback_set_arr[idx];
					// 삭제 대상이라면 새로운 콜백 배열에서 뺀다.
					if(cur_mousemove_callback_set == mouse_move_callback_set) continue;

					mousemove_callback_set_edited_arr.push(cur_mousemove_callback_set);
				}

				this.mousemove_callback_set_arr = mousemove_callback_set_edited_arr;
			}
			,get_mousemove_callback_set_arr:function(){
				return this.mousemove_callback_set_arr;
			}
			// @ public
			// @ Desc : body 혹은 document의 mousemove 이벤트를 여러곳에서 동시에 사용할 경우 중복될 수 있으므로
			// 어플리케이션 레이어에서 이벤트 동작을 등록 혹은 제거할 수 있도록 합니다.
			// mousemove 이벤트 사라짐 및 겹칩 현상을 막습니다.
			,delegate_mousemouse_on_document_arr:[]
			,add_delegate_mousemouse_on_document:function(delegate_mousemouse_on_document){

				var _obj = airborne.bootstrap.obj;

				if(_obj.isNotValidDelegate(delegate_mousemouse_on_document)) {
					console.log("!Error! / airborne.view.obj / get_event_hierarchy_manager / add_delegate_mousemouse_on_document / _obj.isNotValidDelegate(delegate_mousemouse_on_document)");
				}

				this.delegate_mousemouse_on_document_arr.push(delegate_mousemouse_on_document);
			}
			// @ private
			,start_check_mousemouse_on_document:function(){

				var _self = this;
				$("body").mousemove(function(e){
					for(var idx = 0; idx < _self.delegate_mousemouse_on_document_arr.length; idx++) {
						var delegate_mousemouse = _self.delegate_mousemouse_on_document_arr[idx];
						delegate_mousemouse._func.apply(delegate_mousemouse._scope,[e]);	
					}
				});

			}
			,delegate_keyup_on_document_arr:[]
			,add_delegate_keyup_on_document:function(delegate_keyup_on_document){

				var _obj = airborne.bootstrap.obj;

				if(_obj.isNotValidDelegate(delegate_keyup_on_document)) {
					console.log("!Error! / airborne.view.obj / get_event_hierarchy_manager / add_delegate_mousemouse_on_document / _obj.isNotValidDelegate(delegate_keyup_on_document)");
				}

				this.delegate_keyup_on_document_arr.push(delegate_keyup_on_document);

			}
			,clear_delegate_keyup_on_document:function(){
				this.delegate_keyup_on_document_arr = [];				
			}
			// @ private
			,start_check_keyup_on_document:function(){

				var _self = this;
				$("body").keyup(function(e) {

					for(var idx = 0; idx < _self.delegate_keyup_on_document_arr.length; idx++) {
						var delegate_keyup = _self.delegate_keyup_on_document_arr[idx];
						delegate_keyup._func.apply(delegate_keyup._scope,[e]);	
					}

				});
			}
		}

		this.event_hierarchy_manager.start_check_mousemouse_on_document();
		this.event_hierarchy_manager.start_check_keyup_on_document();
		this.event_hierarchy_manager.start_check_mouseleave();

		return this.event_hierarchy_manager;
	}
	,is_not_valid_search_option_arr:function(cur_search_option_arr){
		return !this.is_valid_search_option_arr(cur_search_option_arr);
	}
	,is_valid_search_option_arr:function(cur_search_option_arr){
		var _v = airborne.validator;
		if(_v.isNotValidArray(cur_search_option_arr)) return false;
		for (var idx = 0; idx < cur_search_option_arr.length; idx++) {
			var cur_search_option_obj = cur_search_option_arr[idx];
			if(this.is_not_valid_search_option(cur_search_option_obj)){
				console.log("!Error! / airborne.view.obj / is_valid_search_option_arr / this.is_not_valid_search_option(cur_search_option_obj)");
				return false;
			}
		}

		return true;
	}
	,is_valid_search_option:function(cur_search_option){
		var _v = airborne.validator;
		if(cur_search_option == null) return false;
		if(cur_search_option.get_key == undefined) return false;
		if(cur_search_option.get_value == undefined) return false;
		return true;
	}
	,is_not_valid_search_option:function(cur_search_option){
		return !this.is_valid_search_option(cur_search_option);
	}
	// @ public
	,get_element_option:function(option_group_name, key_access_prop_name, value_access_prop_name){
		// 엘리먼트 타입에서 사용하는 option 객체를 정의합니다.

		var _v = airborne.validator;
		if(_v.is_not_valid_str(option_group_name)) {
			console.log("!Error! / airborne.view.obj / get_element_option / _v.is_not_valid_str(option_group_name)");
			return null;
		}
		if(_v.is_not_valid_str(key_access_prop_name)) {
			console.log("!Error! / airborne.view.obj / get_element_option / _v.is_not_valid_str(key_access_prop_name)");
			return null;
		}
		// key, value가 pair
		// speech project title, speech project id는 한쌍으로 표현됨.

		// key만 있어도 되는 경우.
		// speech title만 있어도 표현됨.
		
		if(_v.is_not_valid_str(value_access_prop_name)) {
			// key와 value가 동일해도 됨.
			value_access_prop_name = key_access_prop_name;
		}

		// 외부 data를 받아야 알 수 있는 값.
		var key_str = "";
		var value_str = "";

		var cur_element_option = 
		this.get_select_option(key_str, value_str, key_access_prop_name, value_access_prop_name);

		cur_element_option.set_option_group_name(option_group_name);

		return cur_element_option;
	}
	,get_select_option:function(key_str, value_str, key_access_prop_name, value_access_prop_name){

		// key_str
		// 선택할 수 있는 리스트에서 노출하는 이름

		// value_str
		// 선택할 수 있는 리스트에서 돌려주는 id

		// example
		// {airplane/*key_str*/:1/*value_str*/}

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		if(_v.isNotValidStr(key_str)){
			key_str = "";
		}
		if(_v.isNotValidStr(value_str)){
			value_str = "";
		}

		// key_access_prop_name
		// raw map 객체에서 key에 사용될 값을 가져오는 프로퍼티 이름
		// 입력, 업데이트, 삭제시 사용할 id 값
		if(_v.is_not_valid_str(key_access_prop_name)) {
			key_access_prop_name = "";
		}

		// value_access_prop_name
		// raw map 객체에서 value에 사용될 값을 가져오는 프로퍼티 이름
		// 입력, 업데이트시 사용할 내용 값
		if(_v.is_not_valid_str(value_access_prop_name)) {
			value_access_prop_name = "";
		}


		var cur_select_option = {
			option_group_name:""
			, get_option_group_name:function() {
				return this.option_group_name;
			}
			, set_option_group_name:function(option_group_name) {
				this.option_group_name = option_group_name;
			}
			, select_option_key:key_str
			, get_key:function() {
				var _v = airborne.validator;
				if(_v.is_not_valid_str(this.select_option_key)){
					return "Not Assigned";
				}
				return this.select_option_key;
			}
			, set_key:function(select_option_key) {
				var _v = airborne.validator;

				// key 값도 공백을 허용합니다.
				if(select_option_key == undefined){
					select_option_key = "";
				}
				this.select_option_key = select_option_key;
			}
			, key_access_prop_name:key_access_prop_name
			, get_key_access_prop_name:function() {
				return this.key_access_prop_name;
			}
			, set_key_access_prop_name:function(key_access_prop_name) {
				var _v = airborne.validator;
				if(_v.is_not_valid_str(key_access_prop_name)) {
					return;
				}
				this.key_access_prop_name = key_access_prop_name;
			}
			, select_option_value:value_str
			, get_value:function() {
				return this.select_option_value;
			}
			, set_value:function(select_option_value) {
				var _v = airborne.validator;
				if(_v.isNotValidStr(select_option_value)){
					return;
				}
				this.select_option_value = select_option_value;
			}
			, value_access_prop_name:value_access_prop_name
			, get_value_access_prop_name:function() {
				return this.value_access_prop_name;
			}
			, set_value_access_prop_name:function() {
				var _v = airborne.validator;
				if(_v.is_not_valid_str(value_access_prop_name)) {
					return;
				}
				this.value_access_prop_name = value_access_prop_name;
			}
			, raw_map_data:null
			, get_raw_map:function() {
				return this.raw_map_data;
			}
			, get_raw_map_prop:function(prop_key){
				var _v = airborne.validator;
				if(_v.is_not_valid_str(prop_key)) {
					return;
				}

				if(this.get_raw_map() == undefined) {
					return;
				}

				return this.get_raw_map()[prop_key];
			}
			, add_raw_map_prop:function(new_prop_key, new_prop_value) {
				var _v = airborne.validator;
				if(_v.is_not_valid_str(new_prop_key)) {
					return;
				}
				if(new_prop_value == undefined) {
					new_prop_value = "";
				}

				if(this.raw_map_data == undefined) {
					this.raw_map_data = {};
				}

				this.raw_map_data[new_prop_key] = new_prop_value;
			}
			, set_key_n_value_from_raw_map:function(raw_map_data) {

				var _v = airborne.validator;

				if(raw_map_data == undefined) {
					// console.log("!Error! / airborne.view.obj / cur_select_option / set_key_n_value_from_raw_map / raw_map_data == undefined");
					return;
				}

				if(_v.is_not_valid_str(this.get_key_access_prop_name())) {
					console.log("!Error! / airborne.view.obj / cur_select_option / set_key_n_value_from_raw_map / _v.is_not_valid_str(this.get_key_access_prop_name())");
					return;
				}
				// key 값은 공백일 수 있습니다.
				
				if(_v.is_not_valid_str(this.get_value_access_prop_name())) {
					console.log("!Error! / airborne.view.obj / cur_select_option / set_key_n_value_from_raw_map / _v.is_not_valid_str(this.get_value_access_prop_name())");
					return;
				}
				// value 값은 공백일 수 있습니다.

				// 필수 key, value를 세팅합니다.
				this.set_key(raw_map_data[this.get_key_access_prop_name()]);
				this.set_value(raw_map_data[this.get_value_access_prop_name()]);

				// 맵 데이터를 보관합니다.
				for (var key in raw_map_data) {
					var value = raw_map_data[key];
					this.add_raw_map_prop(key, value);	
				}
			}
			, get_clone:function() {
				var _obj = airborne.bootstrap.obj;

				var clone = 
				_obj.get_select_option(
					// key_str
					this.get_key()
					// value_str
					, this.get_value()
					// key_access_prop_name
					, this.get_key_access_prop_name()
					// value_access_prop_name
					, this.get_value_access_prop_name()
				);

				clone.set_option_group_name(this.get_option_group_name());

				clone.set_key_n_value_from_raw_map(this.get_raw_map());

				return clone;
			}
		};

		return cur_select_option;
	}
	,get_outcome_obj:function(id_str, key_str, value_str, event_str, prop_map){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		// 공백 값을 허용합니다.
		if(key_str == undefined) {
			key_str = "";
		}
		// 공백 값을 허용합니다.
		if(value_str == undefined) {
			value_str = "";
		}
		if(_obj.is_not_valid_event_type(event_str)){
			console.log("!Error! / airborne.view.obj / get_select_option_obj / _v.isNotValidStr(value_str)");
			return null;
		}

		return {_id:id_str,_key:key_str,_value:value_str,_event:event_str,_prop_map:prop_map};
	}
	,get_delegate_add_searchable_element:function(){
		// @ COMMON LOGIC --> bootstarp.airborne.view.obj.js
		var delegate_add_searchable_element = _obj.get_delegate(function(element_event_manager, search_option_obj){

			if(_obj.is_not_valid_search_option(search_option_obj)){
				console.log("!Error! / delegate_add_searchable_element / _obj.is_not_valid_search_option(search_option_obj)");
				return null;
			}

			var search_output_list_jq = element_event_manager.get_search_output_list_jq();

			// update input title text
			var title_jq_value = element_event_manager.get_title_jq_value();
			element_event_manager.clear_title_input_jq_value();

			// draw new row n get that selector.
			var new_row_tag = 
			"<a href=\"#\" class=\"list-group-item\" style=\"padding-top:6px;padding-bottom:6px;padding-left:12px;font-size:14px;\" element_value=\"<element_value>\"><element_key></a>"
			.replace(/\<element_key\>/gi, search_option_obj.select_option_key)
			.replace(/\<element_value\>/gi, search_option_obj.select_option_value)
			;

			// indicate selected row
			search_output_list_jq.append(new_row_tag);
			var added_row_jq = search_output_list_jq.children().last();
			if(	_v.isJQueryObj(added_row_jq) &&
				_v.isValidStr(title_jq_value) && 
				(search_option_obj.select_option_key == title_jq_value)){

				added_row_jq.addClass("active");
			}

			return added_row_jq;
		},this);	

		return delegate_add_searchable_element;		
	}
	// meta info와 event manager의 통합 객체, element set.
	// 이것으로 엘리먼트들의 부모, 형제 관계를 제어한다.
	// 단, 엘리먼트는 리스트의 열, 테이블의 컬럼의 필드를 의미한다.
	// 엘리먼트들이 모여 구성된 리스트나 테이블을 한꺼번에 제어하는 것은 element_collection_set을 이용한다.
	,get_element_set:function(meta_info, event_manager){
		var element_set = {
			meta_info:meta_info
			,get_meta_info:function(){
				return this.meta_info;
			}
			,event_manager:event_manager
			,get_event_manager:function(){
				return this.event_manager;
			}
			,get_parent_event_manager:function(){
				var cur_parent_element_set = this.get_parent_element_set();
				if(cur_parent_element_set == null) return null;

				var cur_parent_event_manager = cur_parent_element_set.get_event_manager();
				if(cur_parent_event_manager == null) return null;

				return cur_parent_event_manager;
			}
			,get_children_event_manager_arr:function(){
				console.log("수정 필요 / child_element_collection_set을 사용하여 변경하도록 수정 필요.");

				var _v = airborne.validator;

				var cur_children_event_manager_arr = [];
				var cur_children_element_collection_set_arr = this.get_children_element_collection_set_arr();
				if(_v.is_not_valid_array(cur_children_element_collection_set_arr)) return cur_children_event_manager_arr;

				for(var idx = 0; idx < cur_children_element_collection_set_arr.length; idx++){
					var cur_child_element_collection_set = cur_children_element_collection_set_arr[idx];
					if(cur_child_element_collection_set == null){
						console.log("!Warning! / cur_child_element_collection_set == null");
						continue;
					}

					cur_child_element_collection_set.get_event_manager_from_element_collection_set_arr();
					var cur_child_element_collection_set = cur_children_element_collection_set_arr[idx];
					if(cur_child_element_collection_set == null){
						console.log("!Warning! / cur_child_element_collection_set == null");
						continue;
					}

					var cur_children_element_set_arr = cur_child_element_collection_set.get_element_set_arr();
					for (var inner_idx = 0; inner_idx < cur_children_element_set_arr.length; inner_idx++) {
						var cur_child_element_set = cur_children_element_set_arr[inner_idx];
						if(cur_child_element_set == null){
							console.log("!Warning! / cur_child_element_set == null");
							continue;
						}

						var cur_child_event_manager = cur_child_element_set.get_event_manager();
						if(cur_child_event_manager == null){
							console.log("!Warning! / cur_child_event_manager == null");
							continue;
						}

						cur_children_event_manager_arr.push(cur_child_event_manager);
					}					
				}

				return cur_children_event_manager_arr;
			}
			,has_no_shy_child:function(){
				return !this.has_shy_child();
			}
			,has_shy_child:function(){

				var _v = airborne.validator;

				var cur_children_element_collection_set_arr = this.get_children_element_collection_set_arr();
				var has_shy_child = false;
				if(_v.is_valid_array(cur_children_element_collection_set_arr)){
					for(var bravo_idx = 0;bravo_idx < cur_children_element_collection_set_arr.length;bravo_idx++){
						var cur_child_element_collection_set = cur_children_element_collection_set_arr[bravo_idx];
						var cur_element_set_arr = cur_child_element_collection_set.get_element_set_arr();

						if(_v.is_valid_array(cur_element_set_arr)){
							for(var charlie_idx = 0;charlie_idx < cur_element_set_arr.length;charlie_idx++){
								var cur_element_set = cur_element_set_arr[charlie_idx];
								has_shy_child = cur_element_set.get_meta_info().get_is_shy();
								if(has_shy_child) break;
							}
						}
					}
				}
				return has_shy_child;
			}
			// siblings - prev
			,sibling_prev_element_set:null
			,set_sibling_prev_element_set:function(sibling_prev_element_set){
				this.sibling_prev_element_set = sibling_prev_element_set;
			}
			,get_sibling_prev_element_set:function(){
				return this.sibling_prev_element_set;
			}
			,get_all_sibling_prev_element_set_arr:function(){

				if(this.get_sibling_prev_element_set() == null) return [];

				var cur_sibling_prev_element_set = this.get_sibling_prev_element_set();
				var cur_sibling_prev_element_set_arr = [cur_sibling_prev_element_set];

				var loop_limit_counter = 0;
				var loop_limit = 100;
				while(cur_sibling_prev_element_set.get_sibling_prev_element_set() != null){
					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_sibling_prev_element_set = cur_sibling_prev_element_set.get_sibling_prev_element_set();

					if(cur_sibling_prev_element_set == null) {
						break;
					}

					cur_sibling_prev_element_set_arr.unshift(cur_sibling_prev_element_set);

					// check loop
					loop_limit_counter++;
					if(loop_limit_counter > loop_limit){
						console.log("!Error! / get_all_sibling_prev_element_set_arr / loop_limit_counter > loop_limit");
						return;
					}
				}

				return cur_sibling_prev_element_set_arr;
			}
			// siblings - next
			,sibling_next_element_set:null
			,set_sibling_next_element_set:function(sibling_next_element_set){
				this.sibling_next_element_set = sibling_next_element_set;
			}
			,get_sibling_next_element_set:function(){
				return this.sibling_next_element_set;
			}
			,get_all_sibling_next_element_set_arr:function(){

				if(this.get_sibling_next_element_set() == null) return [];

				var cur_sibling_next_element_set = this.get_sibling_next_element_set();
				var cur_sibling_next_element_set_arr = [cur_sibling_next_element_set];

				var loop_limit_counter = 0;
				var loop_limit = 100;
				while(cur_sibling_next_element_set.get_sibling_next_element_set() != null){
					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_sibling_next_element_set = cur_sibling_next_element_set.get_sibling_next_element_set();

					if(cur_sibling_next_element_set == null) break;

					cur_sibling_next_element_set_arr.push(cur_sibling_next_element_set);

					// check loop
					loop_limit_counter++;
					if(loop_limit_counter > loop_limit){
						console.log("!Error! / get_all_sibling_next_element_set_arr / loop_limit_counter > loop_limit");
						return;
					}
				}

				return cur_sibling_next_element_set_arr;
			}
			// @ Section : element set
			// @ private
			// @ Desc : 자신을 제외한 모든 형제 element set 배열을 돌려줍니다.
			,get_other_sibling_element_set_arr:function(){
				var cur_sibling_prev_element_set_arr = this.get_all_sibling_prev_element_set_arr();
				var cur_sibling_next_element_set_arr = this.get_all_sibling_next_element_set_arr();
				return cur_sibling_prev_element_set_arr.concat(cur_sibling_next_element_set_arr);
			}
			// @ Section : element set
			// @ private
			// @ Desc : 자신을 포함한 모든 형제 element set 배열을 돌려줍니다.
			,get_sibling_element_set_arr:function(){
				var cur_sibling_prev_element_set_arr = this.get_all_sibling_prev_element_set_arr();
				cur_sibling_prev_element_set_arr.push(this);
				var cur_sibling_next_element_set_arr = this.get_all_sibling_next_element_set_arr();
				return cur_sibling_prev_element_set_arr.concat(cur_sibling_next_element_set_arr);
			}
			,get_parent_element_set:function(){
				var cur_element_collection_set = this.get_element_collection_set();
				if(cur_element_collection_set == null) return null;

				return cur_element_collection_set.get_parent_element_set();
			}
			/*
				@ private
				@ Scope : Element set
				@ Desc : 엘리먼트 셋에 새로운 엘리먼트를 추가할 때 사용하는 shy element의 모음인 shy element collection set을 받는 메서드.
			*/
			,es_add_child_shy_element_collection_set:function(child_element_collection_set){

				var cur_event_manager = this.get_event_manager();
				if(cur_event_manager == undefined) {
					console.log("!Warning! / es_add_child_shy_element_collection_set / cur_event_manager == undefined");	
					return;
				}

				cur_event_manager.em_push_child_shy_element_collection_set(child_element_collection_set);
			}
			,get_child_shy_element_collection_set_arr:function(){
				var cur_event_manager = this.get_event_manager();
				if(cur_event_manager == undefined) {
					console.log("!Warning! / get_children_element_collection_set_arr / cur_event_manager == undefined");	
					return;
				}

				return cur_event_manager.get_child_shy_element_collection_set_arr();
			}
			// 모든 child shy element collection set이 가지고 있는 element set 배열을 반환합니다.
			,get_child_shy_element_set_arr:function(){

				var child_shy_element_set_arr = [];

				var cur_child_shy_element_set_collection_arr = this.get_child_shy_element_collection_set_arr();

				for(var alpha_idx = 0; alpha_idx < cur_child_shy_element_set_collection_arr.length; alpha_idx++){

					var cur_child_shy_element_collection_set = cur_child_shy_element_set_collection_arr[alpha_idx];
					var cur_child_shy_element_set_arr = cur_child_shy_element_collection_set.get_element_set_arr();

					if(_v.is_not_valid_array(cur_child_shy_element_set_arr)) {
						console.log("!Warning! / _v.is_not_valid_array(cur_child_shy_element_set_arr)");	
						continue;	
					}

					child_shy_element_set_arr = child_shy_element_set_arr.concat(cur_child_shy_element_set_arr);
				}

				return child_shy_element_set_arr;
			}
			/*
				@ private
				@ Scope : element set
				@ Desc : children collection set - 리스트의 열, 테이블의 필드가 자식 리스트, 자식 테이블을 포함하는 경우. event manager에게 전해줌.
			*/
			,es_add_child_element_collection_set:function(child_element_collection_set){
				var cur_event_manager = this.get_event_manager();
				if(cur_event_manager == undefined) {
					console.log("!Warning! / es_add_child_element_collection_set / cur_event_manager == undefined");	
					return;
				}
				if(child_element_collection_set == undefined) {
					console.log("!Warning! / es_add_child_element_collection_set / child_element_collection_set == undefined");	
					return;
				}

				var cur_child_ecs_id = child_element_collection_set.get_element_collection_id();
				cur_event_manager.em_push_child_element_collection_set(child_element_collection_set);
			}
			,get_children_element_collection_set_arr:function(){
				var cur_event_manager = this.get_event_manager();
				if(cur_event_manager == undefined) {
					console.log("!Warning! / get_children_element_collection_set_arr / cur_event_manager == undefined");	
					return;
				}

				return cur_event_manager.get_children_element_collection_set_arr();
			}
			/*
				@ Public
				@ Scope : element set
				@ Desc : 모든 children element collection set이 가지고 있는 element set 배열을 반환합니다.
			*/
			,get_children_element_set_arr:function(){
				var my_children_element_set_arr = [];
				var cur_children_element_set_collection_arr = this.get_children_element_collection_set_arr();
				var cur_element_title = this.get_event_manager().get_title_jq_value();

				for(var alpha_idx = 0; alpha_idx < cur_children_element_set_collection_arr.length; alpha_idx++){
					var cur_child_element_collection_set = cur_children_element_set_collection_arr[alpha_idx];
					var cur_children_element_set_arr = cur_child_element_collection_set.get_element_set_arr();

					if(_v.is_not_valid_array(cur_children_element_set_arr)) {
						console.log("!Warning! / get_children_element_set_arr / _v.is_not_valid_array(cur_children_element_set_arr) / " + cur_element_title + " / ",cur_children_element_set_arr);	
						continue;	
					}

					my_children_element_set_arr = my_children_element_set_arr.concat(cur_children_element_set_arr);
				}

				return my_children_element_set_arr;
			}
			// element 자신이 포함된 element collection set 
			,element_collection_set:null
			,set_element_collection_set:function(element_collection_set){
				if(element_collection_set == null) return;
				this.element_collection_set = element_collection_set;
			}
			,get_element_collection_set:function(){
				return this.element_collection_set
			}
			// event management
			,is_hover:false
			,set_is_hover:function(is_hover){
				if(is_hover == null || (is_hover != true && is_hover != false)) return;
				return this.is_hover = is_hover;
			}
			,get_is_hover:function(){
				return this.is_hover;
			}
			,is_hover_top:false
			,set_is_hover_top:function(is_hover_top){
				if(is_hover_top == null || (is_hover_top != true && is_hover_top != false)) return;
				return this.is_hover_top = is_hover_top;
			}
			,get_is_hover_top:function(){
				return this.is_hover_top;
			}
			,is_hover_bottom:false
			,set_is_hover_bottom:function(is_hover_bottom){
				if(is_hover_bottom == null || (is_hover_bottom != true && is_hover_bottom != false)) return;
				return this.is_hover_bottom = is_hover_bottom;
			}
			,get_is_hover_bottom:function(){
				return this.is_hover_bottom;
			}
			,refresh_is_hover:function(){
				this.set_is_hover(false);
				this.set_is_hover_top(false);
				this.set_is_hover_bottom(false);
			}
		}

		return element_set;
	}
	// 엘리먼트들이 모여 구성된 리스트, 테이블들의 엘리먼트 집합을 관리하는 객체
	// 리스트나 테이블등을 구성한 뒤에는 이 콜렉션 셋을 반환한다.

	// ex > 엘리먼트 간의 참조 구조
	// 부모 리스트 <- 부모 리스트의 열 <- 리스트 <- 리스트의 열 <- 자식 리스트 <- 자식 리스트의 열
	,get_element_collection_set:function(element_collection_id){

		var _obj = airborne.bootstrap.obj;

		var element_collection_set = {
			element_collection_id:element_collection_id
			,set_element_collection_id:function(element_collection_id){
				this.element_collection_id = element_collection_id;
			}
			,get_element_collection_id:function(){
				return this.element_collection_id;
			}
			/*
				@ public
				@ scope : Element collection set / ecs
				@ desc : 엘리먼트 컬렉션 셋의 기본적인 정보를 보여줍니다. 디버깅 용도.
			*/
			,say_yourself:function(is_show){

				if(is_show == undefined || is_show != true) {
					return;
				}

				if(this.element_collection_id == undefined) {
					console.log("!Error! / 엘리먼트 컬렉션 셋에 문제가 있습니다.");
					return;
				}

				var _v = airborne.validator;
				var consoler = airborne.console.get();
				consoler.off();

				var tab_str = "	";
				consoler.say(tab_str + "sy / 엘리먼트 컬렉션 셋의 이름은");
				consoler.say(tab_str + "sy / " + this.element_collection_id);

				var cur_element_set_arr = this.get_element_set_arr();
				if(_v.is_valid_array(cur_element_set_arr)) {

					consoler.say(tab_str + "sy / " + cur_element_set_arr.length + "개의 엘리먼트 셋을 가지고 있습니다.");

					for(var idx = 0; idx < cur_element_set_arr.length; idx++) {
						var cur_element_set = cur_element_set_arr[idx];
						var cur_element_name = cur_element_set.get_event_manager().get_title_jq_value();

						consoler.say(tab_str + "sy / idx : " + idx);
						consoler.say(tab_str + "sy / " + cur_element_name);
					}

				} else {
					consoler.say(tab_str + "sy / 엘리먼트 셋이 없습니다.");
				}


			}
			// 엘리먼트의 기본 정보를 가지고 있는 element meta info 객체
			,element_meta_info_obj:null
			,set_element_meta_info_obj:function(element_meta_info_obj){
				this.element_meta_info_obj = element_meta_info_obj;
			}
			,get_element_meta_info_obj:function(){
				return this.element_meta_info_obj;
			}
			// 리스트나 테이블 자체의 jquery 객체 참조.
			,element_collection_container_jq:null
			,set_element_collection_container_jq:function(element_collection_container_jq){
				this.element_collection_container_jq = element_collection_container_jq;

				if(this.element_collection_container_jq != undefined) {
					this.element_collection_container_jq.attr("ecs_id",airborne.html.getId(this.get_element_collection_id().replace(" ","_")));
				}
			}
			,get_element_collection_container_jq:function(){
				return this.element_collection_container_jq;
			}
			// 이 엘리먼트 컬렉션 셋을 구성하는 엘리먼트 셋들을 의미합니다.
			// 리스트의 열, 테이블읠 컬럼-필드를 의미합니다.
			,element_set_arr:[]
			/*
				@ public
				@ scope : Element Collection Set
				@ desc : Element Set을 Element Collection Set에 추가합니다.
			*/
			,push_element_set:function(element_set, idx){
				if(element_set == undefined) return;

				if(idx != undefined && idx > -1) {

					// 자신보다 바로 이전의 elemen set은 현재 지정한 인덱스에 이미 있습니다.
					var prev_element_set = null;
					var prev_idx = idx;
					if(prev_idx > 0 && this.element_set_arr.length > prev_idx) {
						prev_element_set = this.element_set_arr[prev_idx];
					}
					if(prev_element_set != undefined) {
						prev_element_set.set_sibling_next_element_set(element_set);	
					}
					element_set.set_sibling_prev_element_set(prev_element_set);

					// 자신보다 바로 이후의 elemen set
					var next_element_set = null;
					var next_idx = (idx + 1);
					if(next_idx > 0 && next_idx < this.element_set_arr.length) {
						next_element_set = this.element_set_arr[next_idx];
					}
					element_set.set_sibling_next_element_set(next_element_set);
					if(next_element_set != undefined) {
						next_element_set.set_sibling_prev_element_set(element_set);	
					}

					// element set을 지정한 인덱스 바로 다음으로 넣습니다.
					// 유저에게는 선택한 열의 바로 밑에 추가 열이 생기는 것으로 보입니다.
					this.element_set_arr.splice(idx + 1, 0, element_set);

				} else {

					// 가장 마지막 엘리먼트와 형제 관계를 자동으로 생성
					var cur_last_element_set = this.get_last_element_set();
					if(cur_last_element_set != undefined) {

						// 가장 마지막 엘리먼트가 자신과 동일한 것이 아닌지 확인
						// 동일하다면 중단한다.
						if(cur_last_element_set.get_event_manager().get_element_id() === element_set.get_event_manager().get_element_id()){
							console.log("동일하다면 중단한다.");
							return;
						}

						element_set.set_sibling_prev_element_set(cur_last_element_set);
						cur_last_element_set.set_sibling_next_element_set(element_set);
					}

					this.element_set_arr.push(element_set);

				}
				

				// element set에서도 element collection set에 접근할 수 있는 참조를 넘깁니다.
				element_set.set_element_collection_set(this);
			}
			/*
				@ public
				@ scope : Element Collection Set
				@ desc : 새로운 엘리먼트를 컬렉션 셋에 추가해줍니다.
			*/
			,push_new_element_set:function(element_meta_info, event_manager, idx){

				if(element_meta_info == undefined) {
					console.log("!Error! / push_new_element_set / element_meta_info == undefined");
					return;
				}

				if(event_manager == undefined) {
					console.log("!Error! / push_new_element_set / event_manager == undefined");
					return;
				}

				var cur_element_set = _obj.get_element_set(element_meta_info, event_manager);
				event_manager.set_element_set(cur_element_set);
				this.push_element_set(cur_element_set, idx);

				return cur_element_set;

			}
			,del_element:function() {

				// 사용자가 열을 삭제하였을 때의 처리

			}
			/*
				@ public 
				@ Scope : Element collection set
				@ Desc : 자신의 열과 자신의 자식열들의 타입 정보
			*/
			,element_type_arr:[]
			,add_element_type_arr:function(element_type_arr){
				// deep copy
				var _v = airborne.validator;
				if(_v.is_not_valid_array(element_type_arr)) {
					return;
				}

				for(var idx = 0; idx < element_type_arr.length; idx++) {
					var cur_element_type = element_type_arr[idx];
					if(cur_element_type != undefined) {
						this.add_element_type(cur_element_type);
					}
				}
			}
			,add_element_type:function(element_type){
				this.element_type_arr.push(element_type);
			}
			,get_element_type_arr:function(){
				return this.element_type_arr;
			}
			,get_child_element_type:function(){
				var _v = airborne.validator;
				if(_v.is_not_valid_array(this.element_type_arr) || this.element_type_arr.length < 2) {
					return null;
				}

				return this.element_type_arr[1];
			}
			/*
				@ public 
				@ Scope : Element collection set
				@ Desc : 사용자가 열을 추가할 때 필요한 작업을 설정해놓은 delegate.
			*/
			,delegate_add_element:null
			,set_delegate_add_element:function(delegate_add_element) {
				this.delegate_add_element = delegate_add_element;
			}
			,get_delegate_add_element:function() {
				return this.delegate_add_element;
			}
			,add_element:function(sibling_element_event_manager) {

				if(sibling_element_event_manager == undefined) {
					console.log("!Error! / add_element / sibling_element_event_manager == undefined");
					return;
				}

				var consoler = airborne.console.get();
				consoler.off();

				var _html = airborne.html;
				var _view_list = airborne.bootstrap.view.obj.list;

				var new_action_name = sibling_element_event_manager.get_title_input_jq_value();
				console.log("");
				consoler.say("ecs_a_e / 0 추가되는 엘리먼트 이름 : " + new_action_name);

				// 추가하려는 엘리먼트(c)의 바로 위 엘리먼트(a)의 다음 엘리먼트(b) 참조를 가져옵니다.
				// row a : (추가하려는 엘리먼트의 바로 위 엘리먼트)
				// * <<< new row c : (추가하려는 엘리먼트)
				// row b : (다음 엘리먼트)
				var cur_before_sibling_event_manager = sibling_element_event_manager.get_before_sibling_event_manager();
				var cur_after_sibling_event_manager = sibling_element_event_manager.get_after_sibling_event_manager();

				var cur_element_set = sibling_element_event_manager.get_element_set();
				var cur_element_collection_set = cur_element_set.get_element_collection_set();

				var cur_parent_element_set = sibling_element_event_manager.get_element_set().get_parent_element_set();
				var cur_parent_element_collection_set;
				if(cur_parent_element_set != undefined) {
					cur_parent_element_collection_set = cur_parent_element_set.get_element_collection_set();
				}
				
				var has_shy_sibling_element = false;
				var has_sibling_element = false;
				var is_root_element = false;
				if(cur_parent_element_set != undefined) {

					consoler.say("ecs_a_e / 0-1 / " + new_action_name);
					consoler.say("ecs_a_e / 0-1 / 부모 객체가 있는 엘리먼트");
					var cur_sibling_shy_element_collection_set_arr = cur_parent_element_set.get_child_shy_element_collection_set_arr();
					has_shy_sibling_element = (_v.is_valid_array(cur_sibling_shy_element_collection_set_arr))?true:false;

					var cur_sibling_element_collection_set_arr = cur_parent_element_set.get_children_element_collection_set_arr();
					has_sibling_element = (_v.is_valid_array(cur_sibling_element_collection_set_arr))?true:false;
				} else {

					consoler.say("ecs_a_e / 0-2 / " + new_action_name);
					consoler.say("ecs_a_e / 0-2 / 부모 객체가 없는 최상위 엘리먼트");
					is_root_element = true;
					has_sibling_element = true;
				}

				var cur_element_meta_info_obj = this.get_element_meta_info_obj();
				var copy_element_jq;
				var new_sibling_element_collection_set;
				if(has_shy_sibling_element && has_sibling_element) {

					consoler.say("ecs_a_e / 1-1 / " + new_action_name);
					consoler.say("ecs_a_e / 1-1 / shy sibling element, sibling element 둘다 있는 경우,");
					consoler.say("ecs_a_e / 1-1 / sibling element set에 새로운 열을 추가해줘야 합니다.");

					// 위쪽의 형제 엘리먼트를 복사해서 시각적으로 새로운 엘리먼트를 형제 엘리먼트의 아래쪽에 그립니다.
					var sibling_element_jq_above = sibling_element_event_manager.get_element_jq();
					var clone_element_jq = sibling_element_jq_above.clone();
					sibling_element_jq_above.after(clone_element_jq);

					copy_element_jq = sibling_element_jq_above.next();

					// 화면에 표시합니다.
					copy_element_jq.show();
					cur_element_meta_info_obj = this.get_element_meta_info_obj();

				} else if(is_root_element) {

					consoler.say("ecs_a_e / 1-2 / ",new_action_name);
					consoler.say("ecs_a_e / 1-2 / 부모가 없는 root element. sibling element set 아래에 새로운 열을 추가해줘야 합니다.");

					// 위쪽의 형제 엘리먼트를 복사해서 시각적으로 새로운 엘리먼트를 형제 엘리먼트의 아래쪽에 그립니다.
					var sibling_element_jq_above = sibling_element_event_manager.get_element_jq();
					var clone_element_jq = sibling_element_jq_above.clone();
					sibling_element_jq_above.after(clone_element_jq);

					copy_element_jq = sibling_element_jq_above.next();
					// context를 자기 자신으로 변경합니다.
					copy_element_jq = $(copy_element_jq[0]);
					
					var cur_chlidren_element_container_jq = copy_element_jq.find("div#chlidren_element_container");
					if(cur_chlidren_element_container_jq != undefined) {
						consoler.say("ecs_a_e / 1-2-1 / ",new_action_name);
						consoler.say("ecs_a_e / 1-2-1 / 복사한 엘리먼트 내부의 children element container안의 내용을 지웁니다.");
						cur_chlidren_element_container_jq.children().remove();	
					}
					// 숨김 자식 열도 없앰.
					var cur_shy_chlid_element_container_jq = copy_element_jq.find("div#chlid_shy_element_container");
					if(cur_shy_chlid_element_container_jq != undefined) {
						consoler.say("ecs_a_e / 1-2-2 / ",new_action_name);
						consoler.say("ecs_a_e / 1-2-2 / 복사한 엘리먼트 내부의 children element container안의 내용을 지웁니다.");
						cur_shy_chlid_element_container_jq.children().remove();
					}

					consoler.say("ecs_a_e / 1-2-3 / ",new_action_name);
					consoler.say("ecs_a_e / 1-2-3 / 화면에 표시합니다. / ",new_action_name);
					copy_element_jq.show();
					cur_element_meta_info_obj = this.get_element_meta_info_obj();

				} else {

					consoler.say("ecs_a_e / 1-3 / ",new_action_name);
					consoler.say("ecs_a_e / 1-3 / sibling element이 없는 경우. 처음으로 형제 엘리먼트를 추가합니다.");

					var cur_element_collection_container_jq = 
					sibling_element_event_manager.get_element_set().get_element_collection_set().get_element_collection_container_jq();
					if(cur_element_collection_container_jq != undefined) {

						consoler.say("ecs_a_e / 1-3-1 / ",new_action_name);
						consoler.say("ecs_a_e / 1-3-1 / 새로운 element collection set을 추가합니다.");
						consoler.say("ecs_a_e / 1-3-1 / 복사 대상 객체는 shy element 이므로 화면에서 숨깁니다.");

						cur_element_collection_container_jq.hide();
					}
					
					var cur_delegate_add_element;
					if(cur_element_collection_set != undefined) {

						consoler.say("ecs_a_e / 1-3-2 / ",new_action_name);
						consoler.say("ecs_a_e / 1-3-2 / 비어 있는 element collection set을 만듭니다.");

						cur_delegate_add_element = cur_element_collection_set.get_delegate_add_element();
					}
					
					if(cur_delegate_add_element != undefined) {

						consoler.say("ecs_a_e / 1-3-3 / ",new_action_name);
						consoler.say("ecs_a_e / 1-3-3 / 새로 만든 ecs에 add_element 델리게이트 추가");

						var action_list = [];
						var list_title = _html.getIdRandomTail(new_action_name);
						var is_shy = false;
						new_sibling_element_collection_set = cur_delegate_add_element._func.apply(cur_delegate_add_element._scope,[action_list, list_title, is_shy, cur_delegate_add_element]);	

						if(cur_parent_element_set != undefined) {

							consoler.say("ecs_a_e / 1-3-4 / ",new_action_name);
							consoler.say("ecs_a_e / 1-3-4 / 부모 element set에 새로 생성한 collection set 추가.");

							cur_parent_element_set.es_add_child_element_collection_set(new_sibling_element_collection_set);
							cur_parent_element_collection_set.ecs_push_child_element_collection_set(new_sibling_element_collection_set);
						}
					}

					var new_element_collection_container_jq = null;
					if(new_sibling_element_collection_set != undefined) {

						consoler.say("ecs_a_e / 1-3-5 / ",new_action_name);
						consoler.say("ecs_a_e / 1-3-5 / 새로운 리스트를 만들기 위한 필요정보,");
						consoler.say("ecs_a_e / 1-3-5 / element meta info와 리스트 태그를 붙이기 위한 ecs tag jq를 가져옵니다.");

						cur_element_meta_info_obj = new_sibling_element_collection_set.get_element_meta_info_obj();
						new_element_collection_container_jq = new_sibling_element_collection_set.get_element_collection_container_jq();
					}

					// 시각적으로 보여지는 개체를 복사합니다.
					var sibling_element_jq_above = sibling_element_event_manager.get_element_jq();
					var clone_element_jq = sibling_element_jq_above.clone();
					var new_element_jq = null;
					if(new_element_collection_container_jq != undefined && new_element_collection_container_jq.length > 0) {

						consoler.say("ecs_a_e / 1-3-6 / ",new_action_name);
						consoler.say("ecs_a_e / 1-3-6 / 복사한 jq 객체를 컨테이너 jq에 붙입니다.");
						
						new_element_collection_container_jq.append(clone_element_jq);
						new_element_jq = new_element_collection_container_jq.children().last();
						new_sibling_element_collection_set.set_element_collection_container_jq(new_element_collection_container_jq);
					}

					// 복사한 객체를 화면에 표시합니다.
					if(new_element_jq != undefined) {

						consoler.say("ecs_a_e / 1-3-7 / ",new_action_name);
						consoler.say("ecs_a_e / 1-3-7 / 추가한 엘리먼트를 화면에 표시합니다.");

						copy_element_jq = new_element_jq;
						new_element_jq.show();
						new_element_collection_container_jq.show();
					}
				}


				
				// 엘리먼트 타입을 확인합니다. --> 이걸 어디서 확인하지?
				var new_element_set;
				if(_obj.ITEM_TYPE_LIST === cur_element_meta_info_obj.get_item_type()) {

					// shy mode에서 추가할 경우는 shy mode 속성을 제거해줍니다.
					var cur_list_row_meta_info_arr = cur_element_meta_info_obj.get_list_row_info();

					consoler.say("ecs_a_e / 2-1 / ",new_action_name);
					consoler.say("ecs_a_e / 2-1 / a. 리스트 타입 / 리스트 열에 대한 새로운 메타 정보를 만듭니다. / ",new_action_name);
					
					var selected_list_row_idx = -1;
					var cur_element_set_arr = cur_element_collection_set.get_element_set_arr();

					if(has_sibling_element || is_root_element) {

						consoler.say("ecs_a_e / 2-1-1 / ",new_action_name);
						consoler.say("ecs_a_e / 2-1-1 / a. 리스트 타입 / 사용자가 선택한 형제 열의 바로 아래 열에 되어야 합니다.");
						cur_element_collection_set.say_element_set_arr(consoler.isShow);
						consoler.say("ecs_a_e / 2-1-1 / cur_element_set_arr : ",cur_element_set_arr);
						consoler.say("ecs_a_e / 2-1-1 / cur_element_meta_info_obj : ",cur_element_meta_info_obj);

						for(var idx = 0; idx < cur_element_set_arr.length; idx++) {
							var cur_element_set = cur_element_set_arr[idx];
							var cur_element_id = cur_element_set.get_event_manager().get_element_id();

							consoler.say("ecs_a_e / 2-1-1-1 / action_name : ",new_action_name);
							consoler.say("ecs_a_e / 2-1-1-1 / cur_element_id : ",cur_element_id);

							if(sibling_element_event_manager.get_element_id() !== cur_element_id) continue;

							selected_list_row_idx = idx;
							consoler.say("ecs_a_e / 2-1-1-2 / 추가 열 정보를 넣어야 할 인덱스를 찾았습니다.");

							break;
						} // for end
					}

					consoler.say("ecs_a_e / 2-1-3 / ",new_action_name);
					consoler.say("ecs_a_e / 2-1-3 / selected_list_row_idx : ",selected_list_row_idx);
					consoler.say("ecs_a_e / 2-1-3 / 선택한 열의 다음열로 리스트 메타 정보를 추가합니다.");

					var idx_to_add = -1;
					if(selected_list_row_idx == -1) {

						idx_to_add = 0;
						consoler.say("ecs_a_e / 2-1-4-1 / ",new_action_name);
						consoler.say("ecs_a_e / 2-1-4-1 / idx_to_add : ",idx_to_add);
						consoler.say("ecs_a_e / 2-1-4-1 / 빈 리스트에 첫 엘리먼트를 추가하는 경우");

					} else if((cur_element_set_arr.length -1) == selected_list_row_idx) {

						idx_to_add = selected_list_row_idx;

						consoler.say("ecs_a_e / 2-1-4-2 / ",new_action_name);
						consoler.say("ecs_a_e / 2-1-4-2 / idx_to_add : ",idx_to_add);
						consoler.say("ecs_a_e / 2-1-4-2 / 리스트의 마지막에 엘리먼트를 추가하는 경우");

					} else if(-1 < selected_list_row_idx) {
						
						idx_to_add = selected_list_row_idx + 1;

						consoler.say("ecs_a_e / 2-1-4-3 / ",new_action_name);
						consoler.say("ecs_a_e / 2-1-4-3 / idx_to_add : ",idx_to_add);
						consoler.say("ecs_a_e / 2-1-4-3 / 1줄 이상 엘리먼트가 있는 리스트에 엘리먼트를 추가하는 경우");

					}
					
					cur_element_meta_info_obj.add_list_row_info_simple(
						// action_name
						new_action_name
						// time_sec
						, null
						// is_shy
						, false
						// idx_to_add
						, idx_to_add
					);

					consoler.say("ecs_a_e / 2-1-6 / ",new_action_name);
					consoler.say("ecs_a_e / 2-1-6 / list_row_meta_info 가져오기");

					var cur_list_row_info = cur_element_meta_info_obj.get_list_row_info_with_idx(idx_to_add);
					var list_row_element_id = _html.getIdRandomTail(new_action_name);
					var list_row_element_jq = copy_element_jq;
					var element_meta_info = cur_list_row_info;
					var delegate_set_event_manager_prop_on_list_row = this.get_delegate_set_event_manager_prop();

					consoler.say("ecs_a_e / 2-1-7 / ",new_action_name);
					consoler.say("ecs_a_e / 2-1-7 / attr is_shy, is_first, is_last 수정");
					list_row_element_jq.attr("is_shy","false");
					if(0 == idx_to_add) {
						// console.log("add_element / a-1. 리스트가 없고 첫번째 열을 추가하는 경우");
						list_row_element_jq.attr("is_first","true");
						list_row_element_jq.attr("is_last","false");
					}

					consoler.say("ecs_a_e / 2-1-7 / ",new_action_name);
					consoler.say("ecs_a_e / 2-1-8 / 사용자가 입력한 열 이름으로 아이디를 새로 지정합니다");
					list_row_element_jq.attr("id", list_row_element_id);

					var event_manager_list_row_text = 
					_obj.get_element_event_manager(
						list_row_element_id
						, list_row_element_jq
						, element_meta_info
						, delegate_set_event_manager_prop_on_list_row
					);

					consoler.say("ecs_a_e / 2-2 / ",new_action_name);
					consoler.say("ecs_a_e / 2-2 / delegate를 가져옵니다.");
					consoler.say("ecs_a_e / 2-2-1 / set_delegate_save_n_reload");

					event_manager_list_row_text.set_delegate_save_n_reload(sibling_element_event_manager.get_delegate_save_n_reload());

					consoler.say("ecs_a_e / 2-2-2 / ",new_action_name);
					consoler.say("ecs_a_e / 2-2-2 / set_delegate_add_searchable_element");

					event_manager_list_row_text.set_delegate_add_searchable_element(sibling_element_event_manager.get_delegate_add_searchable_element());

					consoler.say("ecs_a_e / 2-2-3 / ",new_action_name);
					consoler.say("ecs_a_e / 2-2-3 / set_delegate_fetch_searchable_element_list");
					if(sibling_element_event_manager.get_delegate_fetch_searchable_element_list() != undefined) {
						event_manager_list_row_text.set_delegate_fetch_searchable_element_list(sibling_element_event_manager.get_delegate_fetch_searchable_element_list());	
					}

					consoler.say("ecs_a_e / 2-2-4 / ",new_action_name);
					consoler.say("ecs_a_e / 2-2-4 / set_delegate_callback_after_landing_element");
					event_manager_list_row_text.set_delegate_callback_after_landing_element(sibling_element_event_manager.get_delegate_callback_after_landing_element());

					consoler.say("ecs_a_e / 2-2-5 / ",new_action_name);
					consoler.say("ecs_a_e / 2-2-5 / set_delegate_btn_eject_click");
					event_manager_list_row_text.set_delegate_btn_eject_click(sibling_element_event_manager.get_delegate_btn_eject_click());

					consoler.say("ecs_a_e / 2-2-6 / ",new_action_name);
					consoler.say("ecs_a_e / 2-2-6 / 엘리먼트를 화면에 보여줍니다");
					event_manager_list_row_text.show_element_container_jq();

					consoler.say("ecs_a_e / 2-2-7 / ",new_action_name);
					consoler.say("ecs_a_e / 2-2-7.	/ add_element / a. 리스트 타입 / 이벤트 매니저를 통해서 row title 변경. / ",new_action_name);

					event_manager_list_row_text.set_title_jq_text(new_action_name);
					event_manager_list_row_text.set_title_jq_attr_tossed_value(new_action_name);
					event_manager_list_row_text.set_title_jq_attr_input_value(new_action_name);


					// FIX ME : 추가되는 엘리먼트 셋이 올바르지 않습니다.
					if(new_sibling_element_collection_set != undefined) {

						consoler.say("ecs_a_e / 2-3-1 / ",new_action_name);
						consoler.say("ecs_a_e / 2-3-1 / 형제 ecs에 새로운 element set을 추가합니다.");
						new_sibling_element_collection_set.say_yourself(consoler.isShow);

						new_element_set = 
						new_sibling_element_collection_set.push_new_element_set(
							// element_meta_info
							element_meta_info
							// event_manager
							, event_manager_list_row_text
							// idx
							, selected_list_row_idx
						);

						new_sibling_element_collection_set.set_element_collection_container_jq(event_manager_list_row_text.get_element_container_jq());
						new_sibling_element_collection_set.ecs_set_btn_collection_eject_jq(event_manager_list_row_text.get_btn_eject_collection_element_jq());

						consoler.say("ecs_a_e / 2-3-2 / ",new_action_name);
						consoler.say("ecs_a_e / 2-3-2 / shy element를 화면에서 가립니다.");
						sibling_element_event_manager.hide_element_container_jq();
						sibling_element_event_manager.hide_element_jq();

					} else {

						consoler.say("ecs_a_e / 2-4 / ",new_action_name);
						consoler.say("ecs_a_e / 2-4 / 새로 만든 이벤트 매니저로 element set을 만듭니다.");
						this.say_yourself(consoler.isShow);
						consoler.say("ecs_a_e / 2-4 / 엘리먼트 셋을 만들면서 엘리먼트 컬렉션 셋에 추가합니다.");

						new_element_set = 
						this.push_new_element_set(
							// element_meta_info
							element_meta_info
							// event_manager
							, event_manager_list_row_text
							// idx
							, selected_list_row_idx
						);

					}

					var cur_parent_element_set = new_element_set;
					var cur_parent_event_manager;
					var cur_element_collection_set;
					if(cur_parent_element_set) {
						cur_parent_event_manager = cur_parent_element_set.get_event_manager();
						cur_element_collection_set = cur_parent_element_set.get_element_collection_set();
					}
					var cur_element_meta_info_obj;
					if(cur_element_collection_set != undefined) {
						cur_element_meta_info_obj = cur_element_collection_set.get_element_meta_info_obj();
					}
					var cur_delegate_add_list_row_info;
					if(cur_element_meta_info_obj != undefined && _v.is_valid_str(cur_element_collection_set.get_child_element_type())) {
						cur_delegate_add_list_row_info = _view_list.get_delegate_add_list_row_info(cur_element_collection_set.get_child_element_type());
					}
					var cur_list_container_jq;
					if(cur_delegate_add_list_row_info != undefined) {
						cur_list_container_jq = cur_parent_event_manager.get_children_element_container_jq();	
					}
					var cur_delegate_save_n_reload;
					if(cur_list_container_jq != undefined) {
						cur_delegate_save_n_reload = cur_parent_event_manager.get_delegate_save_n_reload();
					}
					var cur_color_type; 
					if(cur_delegate_save_n_reload != undefined && cur_parent_event_manager != undefined) {
						var parent_color_type = cur_parent_event_manager.get_element_color_type();
						cur_color_type = _view_list.get_list_color_type(parent_color_type);

						var cur_delegate_add_element = 
						_view_list.get_delegate_add_element(
							cur_parent_element_set
							, cur_list_container_jq
							, cur_delegate_save_n_reload
							, cur_color_type
							, cur_delegate_add_list_row_info
						);

						consoler.say("ecs_a_e / 2-4-3 / ",new_action_name);
						consoler.say("ecs_a_e / 2-4-3 / shy child element set의 추가");

						cur_delegate_add_element._func.apply(
							cur_delegate_add_element._scope
							,[[], new_action_name, true, cur_delegate_add_element]
						);
					}


					//if(has_shy_sibling_element || has_sibling_element) {
					if(has_sibling_element) {

						consoler.say("ecs_a_e / 2-5 / ",new_action_name);
						consoler.say("ecs_a_e / 2-5 / 이미 리스트가 있고, 여기에 열을 추가한 경우, 이벤트 매니저의 전, 후의 형제 관계를 저장합니다.");
						consoler.say("ecs_a_e / 2-5 / 새로 생긴 열의 앞의 이벤트 매니저를 가져옵니다. 이벤트 매니저 형제 관계를 연결합니다.");

						var cur_before_sibling_event_manager = sibling_element_event_manager;
						cur_before_sibling_event_manager.set_after_sibling_event_manager(event_manager_list_row_text);
						event_manager_list_row_text.set_before_sibling_event_manager(cur_before_sibling_event_manager);

						event_manager_list_row_text.set_after_sibling_event_manager(cur_after_sibling_event_manager);
						if(cur_after_sibling_event_manager != undefined) {

							consoler.say("ecs_a_e / 2-5-2 / ",new_action_name);
							consoler.say("ecs_a_e / 2-5-2 / 새로 생긴 열의 뒤의 이벤트 매니저를 가져옵니다. 이벤트 매니저 형제 관계를 연결합니다.");
							cur_after_sibling_event_manager.set_before_sibling_event_manager(event_manager_list_row_text);	
						}

					} // if end

					consoler.say("ecs_a_e / 2-6-3 / ",new_action_name);
					cur_element_collection_set.say_element_set_arr(consoler.isShow);
					consoler.say("ecs_a_e / 2-6-3 / 완료");

				} else if(_obj.ITEM_TYPE_TABLE === cur_element_meta_info_obj.get_item_type()) {

					consoler.say("ecs_a_e / 3 / ",new_action_name);
					consoler.say("ecs_a_e / 3 / 아직 구현되지 않았습니다.");

				}

				consoler.say("ecs_a_e / 4 / ",new_action_name);
				consoler.say("ecs_a_e / 4 / 자신만이 아닌 형제의 모든 열의 테두리 디자인을 변경해줍니다.");

				sibling_element_event_manager.shape_sibling_element(true/*has_myself*/);

				// 이벤트 락을 해제합니다. 다른 이벤트를 사용할 수 있도록 복원합니다.
				var cur_event_hierarchy_manager = _obj.get_event_hierarchy_manager();
				if(cur_event_hierarchy_manager.is_lock()) {
					cur_event_hierarchy_manager.release();
				}

			}
			/*
				@ public
				@ scope : Element collection set / ecs
				@ desc : ecs에 element set 인자를 추가합니다.
			*/
			,add_element_set:function( prev_element_set, new_element_set, next_element_set ) {

				if(new_element_set == undefined) {
					console.log("!Error! / add_element_set / new_element_set == undefined");
					return;
				}

				var consoler = airborne.console.get();
				consoler.off();

				var cur_element_id = new_element_set.get_event_manager().get_element_id();
				var cur_element_collection_set_id = this.get_element_collection_id();
				consoler.say("ecs_aes / 1 / ",cur_element_id);

				// 새로운 엘리먼트 셋을 추가합니다.
				// 이전, 이후의 엘리먼트 셋을 기준으로 추가합니다.
				if(prev_element_set == undefined && next_element_set == undefined){

					consoler.say("ecs_aes / 2 / ",cur_element_id);
					consoler.say("ecs_aes / 2 / 첫번째 엘리먼트로 추가됩니다.");
					this.element_set_arr.push(new_element_set);

					new_element_set.get_event_manager().show_btn_eject_collection_element_jq()
					var cur_element_collection_set = new_element_set.get_element_collection_set();
					if(cur_element_collection_set != undefined) {
						cur_element_collection_set.ecs_set_btn_collection_eject_jq(new_element_set.get_event_manager().get_btn_eject_collection_element_jq());	
					}
					//cur_element_collection_set_id
					consoler.say("ecs_aes / 2-1 / ",cur_element_id);
					consoler.say("ecs_aes / 2-1 / 처음 추가된 엘리먼트라면 테두리를 고쳐줍니다");
					consoler.say("ecs_aes / 2-1 / cur_element_collection_set_id : ",cur_element_collection_set_id);
					consoler.say("ecs_aes / 2-1 / this.element_set_arr : ",this.element_set_arr);

					new_element_set.get_event_manager().shape_sibling_element(true/*has_my_self*/);

				} else if(prev_element_set == undefined && next_element_set != undefined){

					consoler.say("ecs_aes / 3 / ",cur_element_id);
					consoler.say("ecs_aes / 3 / 두번째 엘리먼트로 추가됩니다");
					this.element_set_arr.unshift(new_element_set);

				} else if(prev_element_set != undefined && next_element_set == undefined){

					consoler.say("ecs_aes / 4 / ",cur_element_id);
					consoler.say("ecs_aes / 4 / 마지막 엘리먼트로 추가됩니다");
					this.element_set_arr.push(new_element_set);

				} else if(prev_element_set != undefined && next_element_set != undefined) {

					var next_element_set_arr = [];
					var idx;
					var length = this.element_set_arr.length;
					for(idx = 0; idx < length; idx++){
						var cur_element_set = this.element_set_arr[idx];
						
						next_element_set_arr.push(cur_element_set);
						if(cur_element_set.get_meta_info().get_list_row_id() == prev_element_set.get_meta_info().get_list_row_id()){

							consoler.say("ecs_aes / 5 / ",cur_element_id);
							consoler.say("ecs_aes / 5 / 추가할 엘리먼트 셋의 바로 앞의 엘리먼트 셋을 찾았습니다. 리스트에 추가합니다.");
							next_element_set_arr.push(new_element_set);

						}
					}
					this.element_set_arr = next_element_set_arr;
				}
			}
			// @ private
			// @ Desc : 두 개의 element set이 동일한 객체인지 확인.
			,is_same_element_set:function(first_element_set, second_element_set){
				if(first_element_set == undefined || second_element_set == undefined){
					return false;
				}
				if(first_element_set.get_event_manager().get_element_id() === second_element_set.get_event_manager().get_element_id()){
					return true;
				}
				return false;
			}

			// @ private
			// @ Desc : element set의 prev,next element set을 재설정.
			// 가지고 있는 element set 배열 안에서 순서가 변경되는 것입니다.
			// 새롭게 element set을 추가하는 것이 아닙니다.
			,update_element_set_relation:function( prev_element_set, new_element_set, next_element_set ) {
				// 관계 재설정 시작.
				// REFACTOR ME.
				if(new_element_set == undefined){
					console.log("!Error! / update_element_set_relation / new_element_set == undefined");
					return;
				}
				if(this.is_same_element_set(prev_element_set, new_element_set)){
					console.log("!Error! / update_element_set_relation / this.is_same_element_set(prev_element_set, new_element_set)");
					return;
				}
				if(this.is_same_element_set(new_element_set, next_element_set)){
					console.log("!Error! / update_element_set_relation / this.is_same_element_set(new_element_set, next_element_set)");
					return;
				}
				if(this.is_same_element_set(prev_element_set, next_element_set)){
					console.log("!Error! / update_element_set_relation / this.is_same_element_set(prev_element_set, next_element_set)");
					return;
				}

				// 새롭게 prev, next 사이에 들어올 기존 element set이 가지고 있었던 이전 prev, next element set 객체를 받아옵니다.
				var old_prev_element_set = new_element_set.get_sibling_prev_element_set();
				var old_next_element_set = new_element_set.get_sibling_next_element_set();

				// new_element_set의 이전 형제 관계를 지워줍니다.
				new_element_set.set_sibling_prev_element_set(null);
				new_element_set.set_sibling_next_element_set(null);

				// old_prev와 old_next가 서로 형제관계를 맺습니다.
				if(old_prev_element_set != undefined) {
					old_prev_element_set.set_sibling_next_element_set(old_next_element_set);	
				}
				if(old_next_element_set != undefined) {
					old_next_element_set.set_sibling_prev_element_set(old_prev_element_set);	
				}
				// 이제 이전 관계는 모두 정리.

				// prev_element_set, next_element_set의 사이에 new_element_set이 사이에 추가되 형제 관계를 맺습니다.
				if(prev_element_set != undefined){
					prev_element_set.set_sibling_next_element_set(new_element_set);	
				}

				new_element_set.set_sibling_prev_element_set(prev_element_set);
				new_element_set.set_sibling_next_element_set(next_element_set);
				if(next_element_set != undefined){
					next_element_set.set_sibling_prev_element_set(new_element_set);	
				}

				// 실제 element_jq를 이동시킵니다.
				next_element_set.get_event_manager().get_element_jq().before(new_element_set.get_event_manager().get_element_jq());

				this.update_element_set_arr();
			}
			// @ private
			// @ Desc : element set의 형제 관계를 prev,next 참조 메서드로 다시 확인하여 업데이트.
			,update_element_set_arr:function(){
				var _v = airborne.validator;

				var cur_element_set_arr = this.get_element_set_arr();
				if(_v.is_not_valid_array(cur_element_set_arr)){
					return;
				}

				// console.log(">>> update_element_set_arr / cur_element_set_arr : ",cur_element_set_arr);
				// this.debug_element_set_arr(cur_element_set_arr);

				var cur_sibling_element_set_arr = cur_element_set_arr[0].get_sibling_element_set_arr();

				// console.log(">>> update_element_set_arr / cur_sibling_element_set_arr : ",cur_sibling_element_set_arr);
				// this.debug_element_set_arr(cur_sibling_element_set_arr);

				this.element_set_arr = cur_sibling_element_set_arr;
			}
			,remove_element_set:function(element_set){
				if(element_set == null) return;

				var _obj = airborne.bootstrap.obj;

				var next_element_set_arr = [];
				var idx;
				var length = this.element_set_arr.length;
				for(idx = 0; idx < length; idx++){
					var cur_element_set = this.element_set_arr[idx];

					// console.log("제거한 엘리먼트 셋은 배열에서도 제거됩니다.");

					if(	cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT ||
						cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY || 
						cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT || 
						cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT 
						) {

						// 리스트일 경우, 검사 방법
						if(cur_element_set.get_meta_info().get_list_row_id() === element_set.get_meta_info().get_list_row_id()){
							continue;
						}
					} else if( 	cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_TABLE_INPUT_TEXT 	||
								cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_TABLE_TIME_HH_MM 	||
								cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_TABLE_TIME_MM_SS 	||
								cur_element_set.get_meta_info().get_element_type() === _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST ) {

						// 테이블일 경우.
						if(cur_element_set.get_meta_info().get_element_json() === element_set.get_meta_info().get_element_json()){
							continue;
						}
					}

					next_element_set_arr.push(cur_element_set);
				}
				this.element_set_arr = next_element_set_arr;
			}
			,debug_element_set_arr:function(cur_all_element_set_arr){
				for (var i = 0; i < cur_all_element_set_arr.length; i++) {
					var cur_element_set = cur_all_element_set_arr[i];
					console.log("debug_element_set_arr / ",cur_element_set.get_meta_info().get_list_row_text());
				};
			}
			/*
				@ public
				@ scope : Element Collection Set
				@ desc : 엘리먼트 셋 배열을 반환합니다.
			*/
			,get_element_set_arr:function(){
				return this.element_set_arr;
			}
			/*
				@ public
				@ scope : Element Collection Set
				@ desc : 엘리먼트 셋 정보(길이, 갯수, 이름)를 표시합니다. 디버깅 용도로 사용합니다.
			*/
			,say_element_set_arr:function(isShow){

				if(isShow == undefined || isShow != true) {
					return;
				}

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				var cur_element_collection_id = this.get_element_collection_id();
				var tap_str = "	";
				console.log(tap_str + "say_element_set_arr / sesa");
				console.log(tap_str + "sesa / 0 / 엘리먼트 컬렉션 셋 / " + cur_element_collection_id + "이 가지고 있는 엘리먼트 셋");

				if(_v.is_not_valid_array(this.element_set_arr)) {
					console.log(tap_str + "sesa / 1 / 지금은 엘리먼트 셋 정보가 없습니다.");
					return;
				}

				var length = this.element_set_arr.length;
				console.log(tap_str + "sesa / 1 / " + length + "개의 엘리먼트 셋이 있습니다.");

				for(var idx = 0; idx < length; idx++) {
					var cur_element_set = this.element_set_arr[idx];

					var cur_title = cur_element_set.get_event_manager().get_title_jq_value();
					console.log("");
					console.log(tap_str + "sesa / 2 / idx : " + idx);
					console.log(tap_str + "sesa / 2 / is_shy : " + cur_element_set.get_meta_info().get_is_shy());
					console.log(tap_str + "sesa / 2 / cur_title : " + cur_title);
				}
			}
			/*
				@ public
				@ scope : Element Collection Set
				@ desc : 엘리먼트 셋 배열을 반환합니다. 입력 그룹을 포함할지 여부는 파라미터로 판단합니다.
			*/
			,ecs_get_masked_element_set_arr:function(has_input_group){

				if(has_input_group==undefined) {
					has_input_group = false;
				}

				var cur_element_collection_set_id = this.get_element_collection_id();

				var consoler = airborne.console.get();
				consoler.off();

				consoler.say("ecs_get_masked_element_set_arr / cur_element_collection_set_id : ",cur_element_collection_set_id);
				consoler.say("ecs_get_masked_element_set_arr / this.element_set_arr : ",this.element_set_arr);

				var masked_element_set_arr = [];
				if(!has_input_group) {
					
					for(var idx=0; idx < this.element_set_arr.length; idx++) {
						var cur_element_set = this.element_set_arr[idx];
						var cur_event_manager = cur_element_set.get_event_manager();
						var cur_element_id = cur_event_manager.get_element_jq().attr("id");

						consoler.say("ecs_get_masked_element_set_arr / cur_event_manager : ",cur_event_manager);
						consoler.say("ecs_get_masked_element_set_arr / cur_element_id : ",cur_element_id);
						consoler.say("ecs_get_masked_element_set_arr / cur_element_set : ",cur_element_set);

						// 입력 그룹을 제외한 엘리먼트 셋을 돌려줍니다.
						// TYPE으로 정의하도록 수정해야 합니다.
						if(!cur_element_set.get_meta_info().get_is_shy()) {
							masked_element_set_arr.push(cur_element_set);
						}
					}
				} else {
					return this.element_set_arr;
				}

				return masked_element_set_arr;
			}

			,get_element_set:function(idx){
				if(this.element_set_arr.length == 0) return null;

				if(!(this.element_set_arr.length <= (idx + 1))) return null;

				return this.element_set_arr[idx];	
			}
			,get_last_element_set:function(){
				if(this.element_set_arr.length == 0) return null;
				return this.element_set_arr[(this.element_set_arr.length - 1)];
			}
			// 이 element collection set이 가지고 있는 element set을 반환합니다.
			// 자식 element collection set이 가지고 있는 element set도 포함됩니다.
			,get_all_element_set_arr:function(){
				return this.get_all_element_set_arr_recursive(this);
			}
			,get_all_element_set_arr_recursive:function(cur_element_collection_set, cur_depth){
				if(cur_element_collection_set == null) return [];
				if(cur_depth == null){
					cur_depth = 0;	
				} else {
					cur_depth++;
				}

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				// 1. 자신이 가지고 있는 element set
				var all_element_set_arr = [];
				var cur_element_set_arr = cur_element_collection_set.get_element_set_arr();
				for(var idx = 0; idx < cur_element_set_arr.length; idx++){
					var cur_element_set = cur_element_set_arr[idx];
					if(cur_element_set == null) continue;

					// no shy mode
					if(cur_element_set.get_meta_info().get_is_shy()) {
						continue;	
					}

					all_element_set_arr.push(cur_element_set);

					var cur_children_element_collection_set_arr = cur_element_set.get_children_element_collection_set_arr();
					if(_v.is_not_valid_array(cur_children_element_collection_set_arr)) continue;

					for(var inner_idx = 0; inner_idx < cur_children_element_collection_set_arr.length; inner_idx++){
						var cur_child_element_collection_set = cur_children_element_collection_set_arr[inner_idx];
						if(cur_child_element_collection_set == null) continue;

						// 2. 자식이 가지고 있는 element set
						var all_element_set_arr_from_child = this.get_all_element_set_arr_recursive(cur_child_element_collection_set, cur_depth);
						if(_v.is_not_valid_array(all_element_set_arr_from_child)) continue;

						all_element_set_arr = all_element_set_arr.concat(all_element_set_arr_from_child);

					} // inner for end
				} // for end

				return all_element_set_arr;
			}
			// 이 엘리먼트 컬렉션 셋을 가지고 있는 엘리먼트 컬렉션 셋을 의미합니다. 
			,parent_element_set:null
			/*
				@ public 
				@ scope : Element collection set
				@ desc : 
			*/
			,set_parent_element_set:function(parent_element_set){
				this.parent_element_set = parent_element_set;
			}
			,get_parent_element_set:function(){
				return this.parent_element_set;
			}
			/*
				@ Desc : 이 엘리먼트 컬렉션 셋이 가지고 있는 자식 엘리먼트 컬렉션 셋들을 의미합니다. 
				@ Scope : element collection set / ecs
				@ Warning : 엘리먼트 셋을 받지 않습니다.
			*/
			,children_element_collection_set_arr:[]
			,ecs_push_child_element_collection_set:function(child_element_collection_set){

				if(child_element_collection_set == undefined) return;

				var cur_ecs_id = child_element_collection_set.get_element_collection_id();
				console.log("ecs_push_child_element_collection_set / ",cur_ecs_id );

				this.children_element_collection_set_arr.push(child_element_collection_set);
			}
			,get_children_element_collection_set_arr:function(){
				return this.children_element_collection_set_arr;
			}

			// 리스트 혹은 테이블 전체의 이벤트를 받는 버튼
			,btn_collection_eject_jq:null
			/*
				@ public
				@ Scope 	: element collection set / ecs
				@ Desc 		: 엘리먼트 콜렉션 셋을 이동시키는 eject btn jq 참조를 지정합니다.
			*/
			,ecs_set_btn_collection_eject_jq:function(btn_collection_eject_jq){
				this.btn_collection_eject_jq = btn_collection_eject_jq;

				// btn_collection_eject를 설정하면 자동으로 관련 이벤트가 주입됩니다.
				this.set_jump_event(this.btn_collection_eject_jq);
			}
			,get_btn_collection_eject_jq:function(){
				return this.btn_collection_eject_jq;
			}
			,is_show_btn_collection_eject:false
			,show_btn_collection_eject_jq:function(){
				if(this.is_show_btn_collection_eject == true){
					//console.log("fail / this.is_show_btn_collection_eject is already true");
					return;	
				}
				this.btn_collection_eject_jq.show();
				this.is_show_btn_collection_eject = true;
			}
			,hide_btn_collection_eject_jq:function(){
				if(this.is_show_btn_collection_eject == false){
					//console.log("fail / this.is_show_btn_collection_eject is already false");
					return;
				}
				this.btn_collection_eject_jq.hide();
				this.is_show_btn_collection_eject = false;
			}
			,off_btn_collection_eject_jq:function(){
				this.btn_collection_eject_jq.off();
			}


			//     dMMMMMP dMMMMMMMMb        dMMMMMP dMP dMP dMMMMMMMMb  dMMMMb         dMMMMMP dMP dMP dMMMMMP dMMMMb dMMMMMMP 
			//    dMP     dMP"dMP"dMP           dMP dMP dMP dMP"dMP"dMP dMP.dMP        dMP     dMP dMP dMP     dMP dMP   dMP    
			//   dMMMP   dMP dMP dMP           dMP dMP dMP dMP dMP dMP dMMMMP"        dMMMP   dMP dMP dMMMP   dMP dMP   dMP     
			//  dMP     dMP dMP dMP       dK .dMP dMP.aMP dMP dMP dMP dMP            dMP      YMvAP" dMP     dMP dMP   dMP      
			// dMMMMMP dMP dMP dMP        VMMMP"  VMMMP" dMP dMP dMP dMP            dMMMMMP    VP"  dMMMMMP dMP dMP   dMP       


			// @ element collection set event manager section
			// 리스트 전체 혹은 테이블 전체에 대한 이벤트를 관리합니다.
			// event lock에 대해 event hierarchy를 사용합니다.
			,element_collection_set_jump_spot_arr:[]
			/*
				@ public
				@ scope : Event Manager
				@ desc : 점프가 가능한 ecs 배열을 추가합니다.
			*/
			,add_element_collection_set_jump_spot:function(element_collection_set_jump_spot){

				// @ Desc : jump spot 이벤트 대상 element collection set을 추가합니다. 
				// 추가 등록하여도 이벤트 발생 시점에 관련 로직을 동적으로 구성하므로 추가 이후, 다시 이벤트 설정을 요청할 필요가 없습니다.

				if(element_collection_set_jump_spot == null) return;
				this.element_collection_set_jump_spot_arr.push(element_collection_set_jump_spot);
			}
			/*
				@ public
				@ scope : Event Manager
				@ desc : 점프가 가능한 ecs 배열을 가져옵니다.
			*/
			,get_element_collection_set_jump_spot_arr:function(){
				return this.element_collection_set_jump_spot_arr;
			}
			,jump_spot_manager:{
				gap:20
				, boost_clone_element_jq:function(target_jq, target_offset) {

					// 시각적으로 엘리먼트를 떠있도록 보이게 합니다.
					// 마우스 커서의 움직임을 따라 다닐 클론 객체를 만들어 원본 아래에 붙입니다.
					var clone_jq = target_jq.clone();
					target_jq.after(clone_jq);
					clone_jq.hide();

					// 1-2. position:absolute로 속성 변경. 이제부터 화면에서 떨어집니다.
					// 1-3. 화면에 그림자 표시를 해서 오브젝트가 떨어졌다는 느낌이 들도록 합니다.
					
					var target_width = target_jq.outerWidth();
					var src_offset = target_jq.offset();
					clone_jq.css("width",target_width).css("position","absolute").css("z-index","1000").css("box-shadow","20px 20px 10px rgba(128,128,128,0.5)");
					if(target_offset == null){
						target_offset = src_offset;
					}
					clone_jq.offset(target_offset);
					clone_jq.show();
					clone_jq.animate({opacity:0.5}, 200);
					target_jq.animate({opacity:0.5}, 200);

					return clone_jq;

				}
				, show_mouse_over_element_set_top_n_bottom:function(mouse_event, target_element_set) {

					console.log(">>> show_mouse_over_element_set_top_n_bottom");

					var _v = airborne.validator;
					var _obj = airborne.bootstrap.obj;

					// 충돌 검사를 진행한다.
					// 충돌했다면 포커싱 등의 처리.
					var is_hover_top = _obj.is_hover_top(mouse_event, target_element_set.get_event_manager().get_element_jq());
					var is_hover_bottom = _obj.is_hover_bottom(mouse_event, target_element_set.get_event_manager().get_element_jq());

					// DEBUG
					// console.log("충돌 검사 / DEBUG / title : ",target_element_set.get_event_manager().get_title_jq_value());
					if( target_element_set.get_event_manager() != undefined && 
						"New Last Action" === target_element_set.get_event_manager().get_title_jq_value()) {

						// console.log("충돌 검사 / DEBUG / is_hover_top : ",is_hover_top);
						// console.log("충돌 검사 / DEBUG / is_hover_bottom : ",is_hover_bottom);

					}

					// 충돌 --> 충돌하지 않음 혹은 충돌하지 않음 --> 충돌 로 상태 변경 시
					var has_changed = false;
					if(	target_element_set.get_is_hover_top() != is_hover_top ){
						target_element_set.set_is_hover_top(is_hover_top);
						has_changed = true;
					}
					if( target_element_set.get_is_hover_bottom() != is_hover_bottom){
						target_element_set.set_is_hover_bottom(is_hover_bottom);
						has_changed = true;
					}

					// 변경된 내역이 없다면 중단.
					if(!has_changed){
						return {is_hover_top:is_hover_top,is_hover_bottom:is_hover_bottom,has_changed:has_changed};
					}
					
					// 변경되었다면 엘리먼트 상태를 다르게 나타내어 준다.
					if(target_element_set.get_is_hover_top() || target_element_set.get_is_hover_bottom()){
						// show focusing
						target_element_set.get_event_manager().show_focusing_mode();
					} else if(!target_element_set.get_is_hover_top() && !target_element_set.get_is_hover_bottom()){
						// hide focusing, show view mode
						target_element_set.get_event_manager().show_view_mode();
					}	

					return {is_hover_top:is_hover_top,is_hover_bottom:is_hover_bottom,has_changed:has_changed};				
				}
				, show_mouse_over_element_container_set_top_n_bottom:function(mouse_event, target_element_set) {

					console.log(">>> show_mouse_over_element_container_set_top_n_bottom");

					var _v = airborne.validator;
					var _obj = airborne.bootstrap.obj;

					// 충돌 검사를 진행한다.
					// 충돌했다면 포커싱 등의 처리.
					var is_hover_top = _obj.is_hover_top(mouse_event, target_element_set.get_event_manager().get_element_container_jq());
					var is_hover_bottom = _obj.is_hover_bottom(mouse_event, target_element_set.get_event_manager().get_element_container_jq());

					// 충돌 --> 충돌하지 않음 혹은 충돌하지 않음 --> 충돌 로 상태 변경 시
					var has_changed = false;
					if(	target_element_set.get_is_hover_top() != is_hover_top ){
						target_element_set.set_is_hover_top(is_hover_top);
						has_changed = true;
					}
					if( target_element_set.get_is_hover_bottom() != is_hover_bottom){
						target_element_set.set_is_hover_bottom(is_hover_bottom);
						has_changed = true;
					}

					// 변경된 내역이 없다면 중단.
					if(!has_changed){
						return {is_hover_top:is_hover_top,is_hover_bottom:is_hover_bottom,has_changed:has_changed};
					}
					
					// 변경되었다면 엘리먼트 상태를 다르게 나타내어 준다.
					if(target_element_set.get_is_hover_top() || target_element_set.get_is_hover_bottom()){
						// show focusing
						target_element_set.get_event_manager().show_focusing_mode();
					} else if(!target_element_set.get_is_hover_top() && !target_element_set.get_is_hover_bottom()){
						// hide focusing, show view mode
						target_element_set.get_event_manager().show_view_mode();
					}	

					return {is_hover_top:is_hover_top,is_hover_bottom:is_hover_bottom,has_changed:has_changed};				
				}				
				, land_element:function(cur_src_jq, cur_clone_jq, eject_btn_jq, cur_mousemove_callback_set, cur_element_set_on_mouse_over, delegate_on_completed, delegate_on_completed_param_event_manager, hovering_element_collection_set) {

					var _v = airborne.validator;
					var _obj = airborne.bootstrap.obj;

					var cur_event_hierarchy_manager = _obj.get_event_hierarchy_manager();

					var target_offset = cur_src_jq.offset();
					var target_width = cur_src_jq.outerWidth();

					var src_offset = cur_clone_jq.offset();
					target_offset.top = parseInt(target_offset.top) - parseInt(src_offset.top);
					target_offset.left = parseInt(target_offset.left) - parseInt(src_offset.left);

					cur_clone_jq.css("box-shadow","");
					cur_clone_jq.animate(
						{ 	
							opacity:1
							,top:"+=" + target_offset.top + "px"
							,left:"+=" + target_offset.left + "px"
							,width:target_width + "px"
						}
						, 200
						, function(){
							// 클론을 제거합니다.
							cur_clone_jq.off();
							cur_clone_jq.remove();

							// 원본을 노출합니다.
							cur_src_jq.css("opacity","1");

							// 모든 이벤트 관련 데이터 초기화.
							// remove mouse move call back
							cur_event_hierarchy_manager.remove_mousemove_callback_set(cur_mousemove_callback_set);

							if(cur_element_set_on_mouse_over != null){
								// 사용자가 열 이동 완료 뒤에 할 일 콜백 함수를 부릅니다.
								if(_obj.isValidDelegate(delegate_on_completed)){
									// Example : 사용자가 마우스 커서를 올린 엘리먼트 셋이 있다면 DB 업데이트
									delegate_on_completed._func.apply(delegate_on_completed._scope,[delegate_on_completed_param_event_manager]);
								}

							} else {
								// 사용자가 마우스 커서를 올린 엘리먼트 셋이 없다면 원래 자리로 돌아감.
								// release lock
								cur_event_hierarchy_manager.release();
								// show eject btn
								eject_btn_jq.show();
							}
						}
					); // end animation - cur_clone_jq

					if(hovering_element_collection_set != undefined) {

						console.log("이동이 끝났습니다. 엘리먼트를 원래 모습으로 바꿉니다.");
						console.log("collection set이 이동할 경우, collection set eject btn을 다시 노출합니다.");

						var hovering_element_set_arr = hovering_element_collection_set.get_element_set_arr();
						var first_event_manager = undefined;
						if(_v.is_valid_array(hovering_element_set_arr)) {
							first_event_manager = hovering_element_set_arr[0].get_event_manager();
						}

						if(first_event_manager != undefined) {
							first_event_manager.shape_sibling_element();
						}
					}
				}
			}
			/*
				@ public
				@ scope : Element Collection Set
				@ desc : element colleciton eject 버튼의 이벤트를 세팅합니다.
			*/
			, set_jump_event:function(cur_btn_collection_eject_jq) {

				if(cur_btn_collection_eject_jq == undefined) {
					console.log("!Error! / airborne.bootstrap.obj.set_jump_event / cur_btn_collection_eject_jq == undefined");
					return;	
				}

				var jsm = this.jump_spot_manager;

				// * 이 메서드는 eject 버튼을 click하면 작동합니다.
				// 1. element collection set eject event
				// 기본 정보 
				// 사용자 선택한 엘리먼트의 처음 너비. 이 너비를 가직고 이동합니다.
				var cur_element_collection_set = this;
				var cur_element_collection_container_jq = this.get_element_collection_container_jq();
				
				// 사용자 선택시, 마우스 커서보다 안쪽으로 엘리먼트를 이동시키기 위한 여유값.
				var gap = 20;
				// 사용자 취소시, 원래위치로 돌아오기 위한 좌표.
				var first_offset = cur_element_collection_container_jq.position();

				// @ Eject Btn Event Inits
				// Desc : element collection set 객체의 화면 이동 이벤트를 설정합니다.
				// mouse over시 색상 변경 이벤트 설정.
				var _self = this;
				cur_btn_collection_eject_jq.off();
				cur_btn_collection_eject_jq.css("opacity","0.3");
				cur_btn_collection_eject_jq.mouseout(function(){

					var cur_event_hierarchy_manager = _obj.get_event_hierarchy_manager();
					if(cur_event_hierarchy_manager.is_lock()) {
						return;
					}

					var _self_jq = $(this);
					_self_jq.animate({opacity:0.3}, 500);
				});
				cur_btn_collection_eject_jq.mouseover(function(){

					var cur_event_hierarchy_manager = _obj.get_event_hierarchy_manager();
					if(cur_event_hierarchy_manager.is_lock()) {
						return;
					}

					var _self_jq = $(this);
					_self_jq.animate({opacity:1}, 500);
				});
				cur_btn_collection_eject_jq.click(function(event_click){

					var cur_event_hierarchy_manager = _obj.get_event_hierarchy_manager();
					if(cur_event_hierarchy_manager.is_lock()) {
						return;
					}

					var consoler = airborne.console.get();
					consoler.off();

					// @ 기본 동작
					// 이벤트 전파를 막습니다.
					event_click.stopPropagation();
					// 다른 객체들의 이벤트를 받지 않도록 lock를 설정.
					var cur_event_hierarchy_manager = _obj.get_event_hierarchy_manager();
					cur_event_hierarchy_manager.lock();
					// 버튼을 화면에서 가립니다.
					var _self_eject_btn_jq = $(this);
					_self_eject_btn_jq.hide();

					// @ element collection settings
					console.log("cur_element_collection_container_jq : ",cur_element_collection_container_jq);
					var clone_element_collection_container_jq = jsm.boost_clone_element_jq(cur_element_collection_container_jq);

					// 마우스 커서의 위치를 따라서 창이 움직입니다.
					var cur_element_set_on_mouse_over = null;
					var cur_parent_element_set_on_mouse_over = null;
					var cur_additional_element_set_on_mouse_over = null;
					var cur_mousemove_callback_set =
					cur_event_hierarchy_manager.add_mousemove_callback_set(_obj.get_delegate(function(mousemove_event, event_manager_on_mousemove){

						// 초기화
						cur_parent_element_set_on_mouse_over = null;
						cur_additional_element_set_on_mouse_over = null;

						// 사용자가 선택한 윈도우의 이동
						var cur_element_collection_container_width = cur_element_collection_container_jq.outerWidth();
				        var cur_top = mousemove_event.pageY - gap;
				        var cur_left = mousemove_event.pageX - (cur_element_collection_container_width - gap);

						clone_element_collection_container_jq.offset({top:cur_top,left:cur_left});

						// 이벤트 설정 - 아래 2가지 사항을 정의합니다.
						// 1. 자기 자신 내부에서의 이동 / 가지고 있는 엘리먼트에 대한 충돌 검사를 수행. 충돌한 element set을 리턴합니다.
						cur_parent_element_set_on_mouse_over = _self.get_parent_element_set_on_mouse_over(mousemove_event, event_manager_on_mousemove);

						// 2. 추가된 jump spot에 대한 이동 / 가지고 있는 엘리먼트에 대한 충돌 검사를 수행 충돌한 element set을 리턴합니다.
						cur_additional_element_set_on_mouse_over = _self.get_additional_element_set_on_mouse_over(mousemove_event, event_manager_on_mousemove);

					}, this)); // end mouse move call back
					
					// 사용자가 이동중인 element collection set을 클릭하면 mouse over된 객체 안으로 들어갑니다.
					// 사용자의 느낌은 선택된 엘리먼트를 클릭하는 것입니다.
					clone_element_collection_container_jq.off();
					clone_element_collection_container_jq.click(function(e){

						var _self_clone_jq = $(this);
						// 부모를 옮기기 전의 절대좌표를 얻습니다.
						var prev_offset = _self_clone_jq.offset();
						var cur_element_set_on_mouse_over = undefined;

						// 테이블에 적용
						// 리스트에 적용
						if(cur_parent_element_set_on_mouse_over != undefined){
							// 1. 자기 자신 내부에서의 이동
							console.log("set_jump_event / click / 1. 자기 자신의 부모(상위) 내부에서의 이동");
							cur_element_set_on_mouse_over = cur_parent_element_set_on_mouse_over;

							var cur_event_manager = cur_element_set_on_mouse_over.get_event_manager();

							if(cur_event_manager != undefined) {

								console.log("set_jump_event / cur_event_manager : ",cur_event_manager);

								cur_event_manager.em_push_child_element_collection_set(cur_element_collection_set);
								cur_event_manager.push_child_element_jq(_self_clone_jq);
							}

						} else if(cur_additional_element_set_on_mouse_over != undefined){
							// 2. 추가된 jump spot에 대한 이동
							console.log("set_jump_event / click / 2. 추가된 jump spot에 대한 이동");
							cur_element_set_on_mouse_over = cur_additional_element_set_on_mouse_over;

							// 원본 엘리먼트 셋을 충돌 객체 안으로 넣습니다.
							// 원본 엘리먼트 셋을 투명하게 충돌 객체 안으로 넣습니다.
							cur_element_set_on_mouse_over.get_event_manager().push_add_on_element_collection_set(cur_element_collection_set);
							cur_element_set_on_mouse_over.get_event_manager().push_add_on_element_jq(_self_clone_jq);

						} else {
							// 3. 충돌한 객체가 없는 경우.
							console.log("set_jump_event / click / 3. 충돌한 객체가 없는 경우.");
						}

						// 부모를 옮긴다음, 저장해둔 절대좌표로 설정해줍니다.
						_self_clone_jq.offset(prev_offset);

						// 엘리먼트 착륙 이후의 델리게이트 객체를 가져옵니다. 충돌 객체가 없는 경우, null을 넘겨 줍니다.
						var cur_delegate_callback_after_landing_element = null;
						var cur_event_manager;
						if(cur_element_set_on_mouse_over != undefined){
							cur_delegate_callback_after_landing_element = 
							cur_element_set_on_mouse_over.get_event_manager().get_delegate_callback_after_landing_element();
							cur_event_manager = 
							cur_element_set_on_mouse_over.get_event_manager();
						}

						// 이동 완료후의 save n reload의 델리게이트 호출은 첫번째 element set에게 맡깁니다.
						jsm.land_element(
							// cur_src_jq
							cur_element_collection_container_jq
							// cur_clone_jq
							, _self_clone_jq
							// eject_btn_jq
							, _self_eject_btn_jq
							// cur_mousemove_callback_set
							, cur_mousemove_callback_set
							// cur_element_set_on_mouse_over
							, cur_element_set_on_mouse_over
							// delegate_on_completed
							, cur_delegate_callback_after_landing_element
							// delegate_on_completed_param_event_manager
							, cur_event_manager
							// hovering_element_collection_set
							, cur_element_collection_set
						);

					}); // end click event - clone_element_collection_container_jq

				}); // end click event - cur_btn_collection_eject_jq
				// @ Eject Btn Event Ends
				
			}
			/*
				@ public
				@ scope : event manager
				@ desc : 
				마우스 이둥시, 엘리먼트에 대한 충돌 검사를 진행합니다.
				충돌 했을 경우, 충돌 엘리먼트 셋 배열에 추가합니다.
				충돌하지 않았을 경우, view mode로 돌려 놓습니다.
			*/
			,get_mouse_over_element:function(mouse_event, target_element_set_arr){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				var consoler = airborne.console.get();
				consoler.off();

				var element_set_on_mouse_over_arr = [];
				for (var idx = 0; idx < target_element_set_arr.length; idx++) {
					var target_element_set = target_element_set_arr[idx];
					var cur_element_title = target_element_set.get_event_manager().get_title_jq_value();

					// 충돌 검사를 진행한다.
					// 충돌했다면 포커싱 등의 처리.
					var is_hover = _obj.is_hover(mouse_event, target_element_set.get_event_manager().get_element_jq());

					consoler.say("2. get_mouse_over_element / " + cur_element_title + " / is_hover : ",is_hover);

					if(is_hover){
						// 충돌한 추가 element set 객체를 찾았습니다.
						element_set_on_mouse_over_arr.push(target_element_set);
					}

					// 충돌 --> 충돌 혹은 충돌하지 않음 --> 충돌하지 않음 로 상태 변경 없다면 종료.
					if(target_element_set.get_is_hover() == is_hover) continue;

					// 충돌 --> 충돌하지 않음 혹은 충돌하지 않음 --> 충돌 로 상태 변경 시
					target_element_set.set_is_hover(is_hover);


					if(target_element_set.get_is_hover()){
						consoler.say("3. get_mouse_over_element / show focusing");
						target_element_set.get_event_manager().show_focusing_mode();
					} else {
						consoler.say("4. get_mouse_over_element / hide focusing, show view mode");
						target_element_set.get_event_manager().show_view_mode();
					}

				} // for end

				return element_set_on_mouse_over_arr;
			}
			,get_mouse_over_element_container:function(mouse_event, target_event_manager){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				// 마우스 이둥시, 엘리먼트에 대한 충돌 검사를 진행합니다.
				// 충돌 했을 경우, 충돌 엘리먼트 셋 배열에 추가합니다.
				// 충돌하지 않았을 경우, view mode로 돌려 놓습니다.

				// 테이블 내의 각 열을 대표하는 element container jq를 가져옵니다.
				var cur_element_json = target_event_manager.get_element_meta_info().get_element_json();

				var element_set_on_mouse_over_arr = [];
				var cur_all_vertical_ref_arr = cur_element_json.get_all_vertical_ref_arr(false, false);
				for (var idx = 0; idx < cur_all_vertical_ref_arr.length; idx++) {
					var cur_vertical_ref = cur_all_vertical_ref_arr[idx];

					// 타이틀 열은 제거한다.
					if(_obj.ELEMENT_TYPE_TABLE_TITLE_ADDABLE === cur_vertical_ref.get_column_type()) {
						continue;
					}

					var cur_event_manager = cur_vertical_ref.get_element_meta_info().get_event_manager();
					var cur_element_set = cur_event_manager.get_element_set();
					var cur_element_container_jq = cur_event_manager.get_element_container_jq();

					// 충돌 검사를 진행한다.
					// 충돌했다면 포커싱 등의 처리.
					var is_hover = _obj.is_hover(mouse_event, cur_element_container_jq);

					if(is_hover){
						// 충돌한 추가 element set 객체를 찾았습니다.
						element_set_on_mouse_over_arr.push(cur_element_set);
					}

					// 충돌 --> 충돌 혹은 충돌하지 않음 --> 충돌하지 않음 로 상태 변경 없다면 종료.
					if(cur_element_set.get_is_hover() == is_hover) continue;

					// 충돌 --> 충돌하지 않음 혹은 충돌하지 않음 --> 충돌 로 상태 변경 시
					cur_element_set.set_is_hover(is_hover);

					var cur_all_horizontal_ref_arr = cur_vertical_ref.get_all_horizontal_ref_arr(true);
					if(cur_element_set.get_is_hover()){
						// show focusing on table row
						for (var idx = 0; idx < cur_all_horizontal_ref_arr.length; idx++) {
							var cur_horizontal_ref = cur_all_horizontal_ref_arr[idx];
							var cur_event_manager = cur_horizontal_ref.get_element_meta_info().get_event_manager();
							cur_event_manager.show_focusing_mode();
						};
						// cur_element_set.get_event_manager().show_focusing_mode();
					} else {
						// hide focusing, show view mode on table row
						for (var idx = 0; idx < cur_all_horizontal_ref_arr.length; idx++) {
							var cur_horizontal_ref = cur_all_horizontal_ref_arr[idx];
							var cur_event_manager = cur_horizontal_ref.get_element_meta_info().get_event_manager();
							cur_event_manager.show_view_mode();
						};
					}

				} // for end

				return element_set_on_mouse_over_arr;
			}
			/*
				@ public
				@ scope : event manager
				@ desc : 부모 엘리먼트중, mouse over 인 엘리먼트 배열을 돌려줍니다.
			*/
			,get_parent_element_set_on_mouse_over:function(mousemove_event, event_manager_on_mousemove){

				// 0. element collection set eject btn click / gpesomo
				// 1. 자기 자신 내부에서의 이동

				var consoler = airborne.console.get();
				consoler.off();

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				// consoler.say("0-1. / gpesomo / 사용자가 element collection set을 선택");
				// consoler.say("0-1-1. / gpesomo / 자신의 부모 element set 객체가 있는가?");
				var cur_parent_element_set = this.get_parent_element_set();

				// consoler.say("0-1-2. / gpesomo / 자신의 부모 element set 객체가 있다. 부모 객체에서 다른 부모의 element set 안에서의 이동.");
				// consoler.say("0-1-2. / gpesomo / 자기 자신이 속한 부모 객체는 제외한다. 부모 element set에 대한 충돌 검사.");
				var cur_other_parent_element_set_arr = null;
				if(cur_parent_element_set != null){
					cur_other_parent_element_set_arr = cur_parent_element_set.get_other_sibling_element_set_arr();
				}
				if(_v.is_not_valid_array(cur_other_parent_element_set_arr)) return null;

				var cur_parent_element_set_on_mouse_over_arr = 
				this.get_mouse_over_element(mousemove_event, cur_other_parent_element_set_arr);

				if(_v.is_valid_array(cur_parent_element_set_on_mouse_over_arr)){
					consoler.say("2-1. / gpesomo / mouse over인 부모 엘리먼트를 돌려줍니다.",cur_parent_element_set_on_mouse_over_arr[0]);
					return cur_parent_element_set_on_mouse_over_arr[0];
				}
				return null;
			}
			,get_additional_element_set_on_mouse_over:function(mousemove_event, event_manager_on_mousemove){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				var consoler = airborne.console.get();
				consoler.off();

				var cur_element_collection_set_jump_spot_arr = this.get_element_collection_set_jump_spot_arr();
				var cur_additional_element_set_on_mouse_over_arr = [];

				consoler.say("0. / gaesomo / jump spot 대상이 될 수 있는 모든 element set을 가져옵니다. / cur_element_collection_set_jump_spot_arr : ",cur_element_collection_set_jump_spot_arr);

				for (var idx = 0; idx < cur_element_collection_set_jump_spot_arr.length; idx++) {
					var cur_element_collection_set_jump_spot = cur_element_collection_set_jump_spot_arr[idx];

					var cur_element_set_arr = cur_element_collection_set_jump_spot.get_all_element_set_arr();
					if(_v.is_not_valid_array(cur_element_set_arr)){
						continue;
					}

					cur_additional_element_set_on_mouse_over_arr = 
					cur_additional_element_set_on_mouse_over_arr.concat(this.get_mouse_over_element(mousemove_event, cur_element_set_arr));

				} // outer for end

				consoler.say("1. / gaesomo / cur_additional_element_set_on_mouse_over_arr : ",cur_additional_element_set_on_mouse_over_arr);
				consoler.say("2. / gaesomo / 결과 배열 객체를 분석, 최종 mouse over 객체를 찾습니다.");
				consoler.say("2-1. / gaesomo / 너비가 가장 작은 객체가 아래 자식이라고 판단합니다.");
				consoler.say("2-2. / gaesomo / 가장 아래 자식 객체를 포커싱 합니다.");
				
				var cur_additional_element_set_bottom_child = null;
				for (var idx = 0; idx < cur_additional_element_set_on_mouse_over_arr.length; idx++) {
					var cur_additional_element_set_on_mouse_over = cur_additional_element_set_on_mouse_over_arr[idx];

					// hide focusing, show view mode
					cur_additional_element_set_on_mouse_over.get_event_manager().show_view_mode();

					if(cur_additional_element_set_bottom_child == null){
						cur_additional_element_set_bottom_child = cur_additional_element_set_on_mouse_over;
					} else {
						var area_bottom_child = cur_additional_element_set_bottom_child.get_event_manager().get_element_area();
						var area_on_mouse_over = cur_additional_element_set_on_mouse_over.get_event_manager().get_element_area();

						if(area_on_mouse_over < area_bottom_child){
							cur_additional_element_set_bottom_child = cur_additional_element_set_on_mouse_over;
						}
					}
				}

				if(cur_additional_element_set_bottom_child != null){
					consoler.say("3. / gaesomo / 충돌 이벤트 화면 표시 / show focusing / cur_additional_element_set_bottom_child : ",cur_additional_element_set_bottom_child);
					cur_additional_element_set_on_mouse_over.get_event_manager().show_focusing_mode();
				}

				return cur_additional_element_set_on_mouse_over;

			}
			,get_event_manager_from_element_collection_set_arr:function(cur_element_collection_set_arr){
				var _v = airborne.validator;
				var cur_event_manager_arr = [];
				if(_v.is_not_valid_array(cur_element_collection_set_arr)) return cur_event_manager_arr;


				for (var idx = 0; idx < cur_element_collection_set_arr.length; idx++) {
					var cur_element_collection_set  = cur_element_collection_set_arr[idx];
					if(cur_element_collection_set == null) continue;
					var cur_element_set_arr = cur_element_collection_set.get_element_set_arr();
					if(_v.is_not_valid_array(cur_element_set_arr)) continue;

					for (var inner_idx = 0; inner_idx < cur_element_set_arr.length; inner_idx++) {
						var cur_element_set = cur_element_set_arr[inner_idx];

						//
						if(cur_element_set == null) continue;

						// shy mode 제거.
						if(cur_element_set.get_meta_info().get_is_shy()) continue;

						// 1. 자신의 element container jq 가져오기.
						var cur_event_manager = cur_element_set.get_event_manager();
						if(cur_event_manager == null) continue;

						cur_event_manager_arr.push(cur_event_manager);
						
						// 2. 자신이 가지고 있는 자식 element collection 객체 가져오기
						var cur_children_element_collection_set_arr = cur_element_set.get_children_element_collection_set_arr();
						if(_v.is_not_valid_array(cur_children_element_collection_set_arr)) continue;

						var event_manager_arr_from_children = this.get_event_manager_from_element_collection_set_arr(cur_children_element_collection_set_arr);
						cur_event_manager_arr = cur_event_manager_arr.concat(event_manager_arr_from_children);
					}
				}
				return cur_event_manager_arr;
			}
			// @ public
			// @ desc : 엘리먼트 콜렉션 셋의 json format obj 배열을 돌려줍니다. 이 배열은 해당 엘리먼트에 대한 화면 표시 값을 담고 있습니다. pdf 출력시 사용합니다.
			,get_json_format_obj_arr:function() {

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(this.get_last_element_set() === undefined) {
					return [];
				}

				var cur_element_json = this.get_last_element_set().get_event_manager().get_element_meta_info().get_element_json();
				var cur_json_format_obj_arr = cur_element_json.get_json_format_obj_arr_from_element_collection_set();

				return cur_json_format_obj_arr;
			}
			// @ public
			// @ desc : 엘리먼트 이벤트 매니저를 만드는 델리게이트 함수를 보관합니다. 이 함수는 사용자가 열을 추가할 경우 사용합니다.
			,delegate_set_event_manager_prop:null
			,set_delegate_set_event_manager_prop:function(delegate_set_event_manager_prop){
				this.delegate_set_event_manager_prop = delegate_set_event_manager_prop;
			}
			,get_delegate_set_event_manager_prop:function(delegate_set_event_manager_prop){
				return this.delegate_set_event_manager_prop;
			}
			// @ public
			// @ desc : 엘리먼트 셋의 is_hover 충돌 데이터를 초기화합니다. 열 이동이 완료되면 호출됩니다.
			,refresh_all_elemen_set_is_hover:function() {

				var cur_all_element_set_arr = this.get_all_element_set_arr();
				for(var inner_idx = 0;inner_idx < cur_all_element_set_arr.length;inner_idx++){
					var cur_element_set = cur_all_element_set_arr[inner_idx];
					cur_element_set.refresh_is_hover();
				}

			}

		}

		return element_collection_set;

	} // element collection set end

	// 엘리먼트 객체에서 사용할 prop_map 기본 값 및 추가 값 세팅 메서드.
	, get_shy_element_prop_map:function(__search_list, __add_on_obj_list) {
		return this.get_element_prop_map(true, __search_list, __add_on_obj_list);
	}	
	, get_element_prop_map:function(__is_shy, __search_list, __add_on_obj_list) {

		if(__is_shy == undefined) {
			__is_shy = false;
		}

		if(__search_list == undefined) {
			__search_list = [];
		}

		if(__add_on_obj_list == undefined) {
			__add_on_obj_list = [];
		}

		var prop_map = {
			// 숨김열 여부 - 숨김 열은 컬렉션 객체에 엘리먼트를 추가할 때 사용합니다.
			__is_shy:__is_shy
			// 엘리먼트의 값을 편집할 때, 사용하게 될 선택 리스트
			,__search_list:__search_list
			// 내부에 추가될 외부 element collection set id 리스트
			,__add_on_obj_list:__add_on_obj_list
		};

		return prop_map;
	}
	// linked list interface를 구현한 객체에 대해 
	// 사용자가 지정한 방향(delegate method)으로 모든 element 배열을 돌려주는 
	// 공통 메서드
	, get_linked_element_arr:function(linked_element, delegate_get_linked_element, has_shy_element, has_title_row) {

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(linked_element == undefined){
			console.log("!Error! / airborne.bootstrap.obj.get_linked_element_arr / linked_element == undefined");
			return [];
		}

		if(_obj.isNotValidDelegate(delegate_get_linked_element)){
			console.log("!Error! / airborne.bootstrap.obj.get_linked_element_arr / _obj.isNotValidDelegate(delegate_get_linked_element)");
			return [];
		}

		// 사용자가 지정한 방향의 모든 형제들의 참조를 배열로 반환받습니다.
		if(has_shy_element == undefined) {
			has_shy_element = false;
		}

		if(has_title_row == undefined) {
			has_title_row = false;
		}

		var cur_linked_element_arr = [];
		var cur_linked_element = linked_element;
		var	loop_limit_counter = 0;
		var loop_limit = 100;
		while(loop_limit_counter < loop_limit){

			// 다음에 변경할 이벤트 매니저를 가져옵니다.
			var received_linked_element = delegate_get_linked_element._func.apply(delegate_get_linked_element._scope,[cur_linked_element]);

			

			if(received_linked_element == undefined) {

				return cur_linked_element_arr;

			} else if( received_linked_element.get_is_shy() === true && has_shy_element === true ) {

				// shy mode 객체일 경우에도 포함.
				cur_linked_element_arr.push(received_linked_element);

			} else if( 	received_linked_element.get_column_type() === _obj.ELEMENT_TYPE_TITLE || 
						received_linked_element.get_column_type() === _obj.ELEMENT_TYPE_TITLE_ADDABLE || 
						received_linked_element.get_column_type() === _obj.ELEMENT_TYPE_TABLE_TITLE_ADDABLE ||  
						received_linked_element.get_column_type() === _obj.ELEMENT_TYPE_TABLE_TITLE ) {

				// title row를 포함하도록 요청해야만 포함
				if( has_title_row === true ) {
					cur_linked_element_arr.push(received_linked_element);	
				}

			} else if( received_linked_element.get_is_shy() === false ){

				// shy mode 객체가 아닌 경우만 포함.
				cur_linked_element_arr.push(received_linked_element);

			}


			// check loop
			loop_limit_counter++;
			if(loop_limit_counter > loop_limit){
				console.log("!Error! / airborne.bootstrap.obj.get_linked_element_arr / loop_limit_counter > loop_limit");
				return;
			}

			cur_linked_element = received_linked_element
		}

		return cur_linked_element_arr;

	}
}