airborne.bootstrap.view.obj.list = {
	// @ Section : LIST PROPERTIES
	LIST_ROW_TEXT_TYPE_NORMAL:"normal"
	,LIST_ROW_TEXT_TYPE_BOLD:"bold"
	,is_valid_list_row_text_type:function(list_row_text_type){
		var _v = airborne.validator;
		if(_v.isNotValidStr(list_row_text_type)){
			//console.log("!Error! / airborne.view.obj.list / is_valid_list_row_text_type / _v.isNotValidStr(list_row_text)");
			return false;
		}

		if(	this.LIST_ROW_TEXT_TYPE_NORMAL != list_row_text_type && 
			this.LIST_ROW_TEXT_TYPE_BOLD != list_row_text_type){
			//console.log("!Error! / airborne.view.obj.list / is_valid_list_row_text_type / It is not valid table column text type");
			return false;
		}

		return true;
	}
	,COLOR_TYPE_LIST_ROW_WHITE:"list-group-item-default"
	,COLOR_TYPE_LIST_ROW_GREEN:"list-group-item-success"
	,COLOR_TYPE_LIST_ROW_BLUE:"list-group-item-info"
	,COLOR_TYPE_LIST_ROW_YELLOW:"list-group-item-warning"
	,COLOR_TYPE_LIST_ROW_RED:"list-group-item-danger"
	,is_not_valid_list_row_text_type:function(list_row_text_type){
		return !this.is_valid_list_row_text_type(list_row_text_type);
	}
	// @ Section : LIST META INFO
	// @ public
	// @ Desc : 리스트 속성을 정의하는 객체를 만듭니다.
	,get_editable_list_meta_info_obj:function(list_title, is_editable_title, is_fixed_row, delegate_add_list_row_info, action_list, is_shy){
		// 1-1. list title
		// 1-2. list row info array
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _view_list = airborne.bootstrap.view.obj.list;
		if(_v.isNotValidStr(list_title)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_meta_info_obj / _v.isNotValidStr(list_title)");
			return null;
		}
		if(is_editable_title == null){
			is_editable_title = false;
		}
		if(is_fixed_row == null){
			is_fixed_row = false;
		}
		if(is_shy == undefined) {
			is_shy = false;
		}

		var editable_list_meta_info_obj = {
			list_title:""
			,get_list_title:function(list_title){
				return this.list_title;
			}
			,set_list_title:function(list_title){
				this.list_title = list_title;
			}
			,event_manager:null
			,set_event_manager:function(event_manager){
				this.event_manager = event_manager;
			}
			,get_event_manager:function(){
				return this.event_manager;
			}
			,item_type:_obj.ITEM_TYPE_LIST
			,get_item_type:function(){
				return this.item_type;
			}
			,is_editable_title:false
			,get_is_editable_title:function(){

				var cur_element_type = this.get_element_type();
				if(_obj.is_not_valid_element_type(cur_element_type)){
					console.log("!Error! / airborne.view.obj.list / get_editable_list_meta_info_obj / editable_list_meta_info_obj / _obj.is_not_valid_element_type(cur_element_type)");
					return false;
				} 

				if( _obj.ELEMENT_TYPE_INPUT_TEXT==cur_element_type || 
					_obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT==cur_element_type || 
					_obj.ELEMENT_TYPE_TITLE_ADDABLE==cur_element_type || 
					_obj.ELEMENT_TYPE_SEARCH_LIST==cur_element_type){
					return true;
				}

				return is_editable_title;
			}
			,is_fixed_row:is_fixed_row
			,get_is_fixed_row:function(){
				return this.is_fixed_row;
			}
			,get_is_editable_row:function(){
				return !this.is_fixed_row;
			}
			,list_row_info:[]
			,add_list_row_info:function(action_obj, idx_to_add){
				// 1. action obj를 받습니다. 

				// 2. action obj를 list_info로 바꿉니다.
				var cur_delegate_convert_action_obj_to_list_row_info = this.get_delegate_convert_action_obj_to_list_row_info();
				if(cur_delegate_convert_action_obj_to_list_row_info == null) {
					console.log("!Error! / airborne.view.obj.list / get_editable_list_meta_info_obj / cur_delegate_convert_action_obj_to_list_row_info == null");
					return;
				}

				var delegate_func = cur_delegate_convert_action_obj_to_list_row_info._func;
				var delegate_scope = cur_delegate_convert_action_obj_to_list_row_info._scope;
				var list_row_info = delegate_func.apply(delegate_scope,[action_obj]);

				if(list_row_info == null){
					console.log("!Error! / airborne.view.obj.list / get_editable_list_meta_info_obj / list_row_info == null");
					return;
				}


				if(idx_to_add != undefined && (idx_to_add > 0)) {
					// 지정한 인덱스에 엘리먼트를 추가합니다.
					this.list_row_info.splice(idx_to_add, 0, list_row_info);
				} else {
					// 지정한 인덱스가 없다면 가장 마지막에 추가합니다.
					this.list_row_info.push(list_row_info);	
				}

			}
			,add_list_row_info_simple:function(action_name, time_sec, is_shy, idx_to_add){

				// 열을 추가할 때 호출합니다.

				if(_v.is_not_valid_str(action_name)) {
					console.log("!Error! / airborne.view.obj.list / get_editable_list_meta_info_obj / add_list_row_info_simple / _v.is_not_valid_str(action_name)");
					return;
				}
				if(is_shy === undefined) {
					time_sec = 0;
				}
				if(is_shy === undefined) {
					is_shy = false;
				}
				if(idx_to_add === undefined) {
					idx_to_add = this.list_row_info.length;
				}

				var simple_action_obj = 
				_view_list.get_json_format_obj(
					// __action_name
					action_name
					// __action_list
					, []
					// __add_on_obj_list
					, []
					// __time_sec
					, time_sec
					// __is_shy
					, is_shy
				);

				this.add_list_row_info(simple_action_obj, idx_to_add);
			}
			,del_list_row_info:function(action_name){

				// TODO 사용자가 열을 삭제할 때 호출합니다.

			}
			,get_list_row_info:function(){
				return this.list_row_info;
			}
			,get_list_row_info_with_idx:function(specific_idx){
				if(!(specific_idx > -1)) {
					return null;
				}
				return this.list_row_info[specific_idx];
			}

			,element_type:_obj.ELEMENT_TYPE_TITLE
			,get_element_type:function(){
				return this.element_type;
			}
			,delegate_convert_action_obj_to_list_row_info:null
			,set_delegate_convert_action_obj_to_list_row_info:function(delegate_convert_action_obj_to_list_row_info){
				this.delegate_convert_action_obj_to_list_row_info = delegate_convert_action_obj_to_list_row_info;
			}
			,get_delegate_convert_action_obj_to_list_row_info:function(){
				return this.delegate_convert_action_obj_to_list_row_info;
			}
		};
		editable_list_meta_info_obj.set_list_title(list_title);
		editable_list_meta_info_obj.set_delegate_convert_action_obj_to_list_row_info(delegate_add_list_row_info);

		// 기본 시간값은 0입니다. 시간 값을 가지고 있다면 추가 시간 값을 줍니다.
		// 현재는 5분후만 지원합니다.
		var __time_sec = 0;
		if(_v.isValidArray(action_list)) {
			var first_action_obj = action_list[0];
			var offset_five_minutes = 300; // 5 * 60
			if(first_action_obj.__prop_map.__time_sec != ""){
				__time_sec = first_action_obj.__prop_map.__time_sec + offset_five_minutes;
			}
		}

		// 리스트 열 메타 정보를 지정하는 델리게이트가 있다면 실행한다.
		if(_obj.isValidDelegate(delegate_add_list_row_info) && _v.isValidArray(action_list) && !is_shy){
			// 리스트위에 포커싱되면 노출됩니다.
			// 이 제목열의 element collection set - collection eject btn을 통해서 이동할 수 있습니다.
			// 이 버튼은 조건이 만족될 경우에만 노출됩니다.
			for(var idx = 0; idx < action_list.length; idx++){
				var cur_action_obj = action_list[idx];
				editable_list_meta_info_obj.add_list_row_info(cur_action_obj);
			}
		} else if(is_shy) {
			// 배열 정보가 없다면 shy row만 포함된 정보를 넘겨 줍니다.
			editable_list_meta_info_obj.add_list_row_info_simple(
				// action_name
				"New Action"
				// time_sec
				, __time_sec
				// is_shy
				, true
			);
		}

		return editable_list_meta_info_obj;
	}
	// @ Public
	// @ Desc : 리스트에 열을 추가할 경우, 타이틀을 보여줍니다. 수정/편집이 가능합니다.
	,get_editable_list_input_text_row_meta_info_obj:function(list_row_text, search_list_arr, prop_map, is_shy){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _html = airborne.html;

		//var list_row_id = "editable_list_row_input";
		var list_row_id = _html.getIdASCTail("editable_list_row_input");
		var list_row_text_type = this.LIST_ROW_TEXT_TYPE_BOLD;
		var received_element_type = _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT;

		if(_v.isNotValidStr(list_row_text)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_input_text_row_meta_info_obj / _v.isNotValidStr(list_row_text)");
			return;
		}
		if(_obj.is_not_valid_element_type(received_element_type)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_input_text_row_meta_info_obj / _obj.is_not_valid_element_type(received_element_type)");
			return;
		}
		if(is_shy == undefined){
			is_shy = false;
		}

		if(prop_map == null){
			prop_map = {};
		}

		return this.get_editable_list_row_meta_info_obj(list_row_id, list_row_text, list_row_text_type, received_element_type, search_list_arr, is_shy, prop_map);
	}
	// @ Public
	// @ Desc : 리스트에 열을 추가할 경우, 시간 정보(00시 00분)와 타이틀을 보여줍니다. 수정/편집이 가능합니다.
	,get_editable_list_time_hh_mm_n_input_text_row_meta_info_obj:function(list_row_text, time_hh_mm, search_list_arr, prop_map, is_shy){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _html = airborne.html;

		var list_row_id = _html.getIdASCTail("editable_list_row_time_hh_n_input_text");
		var list_row_text_type = this.LIST_ROW_TEXT_TYPE_BOLD;
		var received_element_type = _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT;
		

		if(_v.isNotValidStr(list_row_text)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_time_hh_mm_n_input_text_row_meta_info_obj / _v.isNotValidStr(list_row_text)");
			return;
		}
		if(_dates.is_not_valid_time_format_double_digit(time_hh_mm)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_time_hh_mm_n_input_text_row_meta_info_obj / _dates.is_not_valid_time_format_double_digit(time_hh_mm)");
			return;
		}
		if(_obj.is_not_valid_element_type(received_element_type)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_time_hh_mm_n_input_text_row_meta_info_obj / _obj.is_not_valid_element_type(received_element_type)");
			return;
		}
		if(is_shy == undefined){
			is_shy = false;
		}

		// prop_map에 시간 정보를 추가합니다.
		if(prop_map == null){
			prop_map = {};
		}
		prop_map[_obj.TIME_PROP_HH_MM] = time_hh_mm;

		return this.get_editable_list_row_meta_info_obj(list_row_id, list_row_text, list_row_text_type, received_element_type, search_list_arr, is_shy, prop_map);
	}
	// @ Private
	// @ Desc : 리스트에 열을 추가할 경우, 필요한 기본적인 정보들을 설정해줍니다.
	,get_editable_list_row_meta_info_obj:function(list_row_id, list_row_text, list_row_text_type, received_element_type, search_list_arr, is_shy, prop_map){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		if(_v.isNotValidStr(list_row_id)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_row_meta_info_obj / _v.isNotValidStr(list_row_id)");
			return;
		}
		if(_v.isNotValidStr(list_row_text)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_row_meta_info_obj / _v.isNotValidStr(list_row_text)");
			return;
		}
		if(_obj.is_not_valid_element_type(received_element_type)){
			console.log("!Error! / airborne.view.obj.list / get_editable_list_row_meta_info_obj / _obj.is_not_valid_element_type(received_element_type)");
			return null;
		}
		if(this.is_not_valid_list_row_text_type(list_row_text_type)){
			//console.log("!Error! / airborne.view.obj.list / get_editable_list_row_meta_info_obj / this.is_not_valid_list_row_text_type(list_row_text_type)");
			list_row_text_type = this.LIST_ROW_TEXT_TYPE_NORMAL;
		}
		if(is_shy == null){
			is_shy = false;
		}

		// 1. 테이블 컬럼의 속성을 정의하는 객체를 만듭니다.
		var editable_list_row_obj = {
			list_row_id:list_row_id
			,get_element_id:function(){
				return this.list_row_id;
			}
			,get_list_row_id:function(){
				return this.list_row_id;
			}
			,list_row_text:list_row_text
			,get_list_row_text:function(){
				return this.list_row_text;
			}
			,delegate_input_validation:null	
			,set_delegate_input_validation:function(delegate_input_validation){
				if(_obj.isNotValidDelegate(delegate_input_validation)){
					console.log("!Error! / get_editable_list_row_meta_info_obj / editable_list_row_obj / _obj.isNotValidDelegate(delegate_input_validation)");
					return;
				}
				this.delegate_input_validation = delegate_input_validation;
			}
			,get_delegate_input_validation:function(){
				return this.delegate_input_validation;
			}
			,list_row_text_type:list_row_text_type
			,get_list_row_text_type:function(){
				return this.list_row_text_type;
			}
			,search_list_arr:search_list_arr
			,get_search_list_arr:function(){
				return this.search_list_arr;
			}
			,prop_map:prop_map
			,get_prop:function(prop_key){
				var prop_value = this.prop_map[prop_key];
				return prop_value;
			}
			,get_prop_map:function(){
				return this.prop_map;
			}
			,add_prop_into_prop_map:function(prop_key_str, prop_value){
				if(_v.is_not_valid_str(prop_key_str)) return;
				if(this.prop_map == null){
					this.prop_map = {}
				}
				this.prop_map[prop_key_str] = prop_value;
			}
			,event_manager:null
			,set_event_manager:function(event_manager){
				this.event_manager = event_manager;
			}
			,get_event_manager:function(){
				return this.event_manager;
			}
			,get_is_editable:function(){
				var cur_element_type = this.get_element_type();

				if(_obj.is_not_valid_element_type(cur_element_type)){
					console.log("!Error! / get_editable_list_row_meta_info_obj / editable_list_row_obj / this.is_not_valid_element_type(cur_element_type)");
					return false;
				}

				return _obj.is_editable_element_type(cur_element_type);
			}
			,is_shy:is_shy
			,get_is_shy:function(){
				return this.is_shy;
			}
			,set_is_shy:function(is_shy){
				if(is_shy == null) return;
				this.is_shy = is_shy;
			}
			,element_type:received_element_type
			,get_element_type:function(){
				return this.element_type;
			}
		};

		return editable_list_row_obj;
	}	

	//     .aMMMb  dMMMMb  dMMMMb         dMP     dMP .dMMMb dMMMMMMP 
	//    dMP"dMP dMP VMP dMP VMP        dMP     amr dMP" VP   dMP    
	//   dMMMMMP dMP dMP dMP dMP        dMP     dMP  VMMMb    dMP     
	//  dMP dMP dMP.aMP dMP.aMP        dMP     dMP dP .dMP   dMP      
	// dMP dMP dMMMMP" dMMMMP"        dMMMMMP dMP  VMMMP"   dMP       
	// @ Section : LIST DRAWING & EVENT

	/*
	@ private
	@ Desc : list row 의 meta info를 가져오는 delegate 메서드
	*/
	,get_delegate_add_list_row_info:function(cur_element_type) {

		var _obj = airborne.bootstrap.obj;
		var _view_list = airborne.bootstrap.view.obj.list;

		var delegate_add_list_row_info = null;
		if(_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type){

			delegate_add_list_row_info = 
			_obj.get_delegate(function(cur_action_obj){

				var cur_editable_list_row_meta_info_obj = 
				_view_list.get_editable_list_time_hh_mm_n_input_text_row_meta_info_obj(
					// list_row_text
					cur_action_obj.__action_name
					// time_hh_mm
					, _dates.get_hh_mm_from_seconds(cur_action_obj.__prop_map.__time_sec)
					// search_list_arr
					, null
					// prop_map
					, cur_action_obj
					// is_shy
					, cur_action_obj.__prop_map.__is_shy
				);

				return cur_editable_list_row_meta_info_obj;

			},this);

		} else if(_obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT == cur_element_type){

			delegate_add_list_row_info = 
			_obj.get_delegate(function(cur_action_obj){

				var cur_editable_list_row_meta_info_obj = 
				_view_list.get_editable_list_input_text_row_meta_info_obj(
					// list_row_text
					cur_action_obj.__action_name
					// search_list_arr
					, null
					// prop_map
					, cur_action_obj
					// is_shy
					, cur_action_obj.__prop_map.__is_shy
				);

				return cur_editable_list_row_meta_info_obj;

			},this);

		}

		return delegate_add_list_row_info;
	}
	/*
		@ private
		@ Desc : 빈 action list의 element collection set을 만듭니다. shy element나 새로운 자식 열을 추가할 때 사용합니다.
	*/
	,get_delegate_add_element:function(parent_element_set, list_container_jq, delegate_save_n_reload, color_type, delegate_add_list_row_info) {

		var _v = airborne.validator;
		var _html = airborne.html;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _view_list = airborne.bootstrap.view.obj.list;

		var delegate_add_element = 
		_obj.get_delegate(function(action_list, list_title, is_shy, cur_delegate_add_element){

			if(is_shy == undefined) {
				is_shy = false;
			}

			var is_editable_list_action = false;
			var is_fixed_row_action = false;

			var editable_list_meta_info_action_obj = 
			_view_list.get_editable_list_meta_info_obj(
				// list_title 					/ 리스트 열의 제목
				list_title
				// is_editable_title 			/ 리스트 열의 제목을 수정할 수 있는가?
				, is_editable_list_action
				// is_fixed_row 				/ 리스트 열의 수가 고정인가? 추가 및 삭제가 가능한가?
				, is_fixed_row_action
				// delegate_add_list_row_info 	/ 타임라인 열 메타 정보 작성
				, delegate_add_list_row_info
				// action list
				, action_list
				// is_shy
				, is_shy
			);

			var cur_element_collection_set;
			if(editable_list_meta_info_action_obj != undefined) {

				cur_element_collection_set = 
				_view_list.add_editable_list(
					// list_container_jq
					list_container_jq
					// editable_list_meta_info_obj
					, editable_list_meta_info_action_obj
					// delegate_save_n_reload
					, delegate_save_n_reload
					// delegate_fetch_searchable_element_list
					, null
					// delegate_show_combo_box_element
					, null
					// color_type
					, color_type
				);

			}

			if(cur_element_collection_set != undefined) {
				cur_element_collection_set.set_delegate_add_element(cur_delegate_add_element);	
			}

			if(parent_element_set != undefined){

				if(is_shy) {
					parent_element_set.es_add_child_shy_element_collection_set(cur_element_collection_set);
				} else {
					parent_element_set.es_add_child_element_collection_set(cur_element_collection_set);
				}

				// 자신의 element collection set의 
				// 부모 elemnet set으로 추가합니다.
				cur_element_collection_set.set_parent_element_set(parent_element_set);
			}

			return cur_element_collection_set;

		},this);

		return delegate_add_element;

	}
	/*
		@ public
		@ scope : view list
		@ Desc : 인덱스로 색깔 타입 정보를 받습니다.
	*/
	,get_list_color_type:function(parent_color_type) {

		var _view_list = airborne.bootstrap.view.obj.list;

		var cur_color_type;
		if(parent_color_type == _view_list.COLOR_TYPE_LIST_ROW_YELLOW){
			cur_color_type=_view_list.COLOR_TYPE_LIST_ROW_WHITE;
		} else {
			cur_color_type=_view_list.COLOR_TYPE_LIST_ROW_YELLOW;
		}

		return cur_color_type;
	}
	/*
		@ public
		@ scope : view list
		@ Desc : 리스트 엘리먼트 사이에 새로운 열을 추가합니다. 이미 있는 리스트 엘리먼트들 사이에 추가할 수 있습니다.
		사용자가 세팅할 것은 오직 LIST ELEMENT TYPE만 배열로 세팅해줍니다.
	*/
	,add_editable_action:function(list_title, parent_element_set, prev_sibling_element, next_sibling_element) {

		var _v = airborne.validator;
		var _html = airborne.html;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _view_list = airborne.bootstrap.view.obj.list;

		if(_v.is_not_valid_str(list_title)) {
			console.log("!Error! / airborne.bootstrap.obj.list / add_editable_action / _v.is_not_valid_str(list_title)");
			return;
		}

		var cur_element_collection_set;
		if(parent_element_set) {
			cur_parent_event_manager = parent_element_set.get_event_manager();
			cur_element_collection_set = parent_element_set.get_element_collection_set();
		}

		var cur_element_meta_info_obj;
		if(cur_element_collection_set) {
			cur_element_meta_info_obj = cur_element_collection_set.get_element_meta_info_obj();
		}

		var cur_delegate_add_list_row_info;
		if(cur_element_meta_info_obj) {
			cur_delegate_add_list_row_info = cur_element_meta_info_obj.get_delegate_convert_action_obj_to_list_row_info();
		}

		var cur_list_container_jq;
		var cur_shy_list_container_jq;
		if(cur_delegate_add_list_row_info) {
			cur_list_container_jq = cur_parent_event_manager.get_children_element_container_jq();	
			cur_shy_list_container_jq = cur_parent_event_manager.get_child_shy_element_container_jq();	
		}

		var cur_delegate_save_n_reload;
		if(cur_list_container_jq && cur_shy_list_container_jq) {
			cur_delegate_save_n_reload = cur_parent_event_manager.get_delegate_save_n_reload();
		}
		var cur_color_type;
		var list_element_type_arr = [];
		if(cur_parent_event_manager) {
			var parent_color_type = cur_parent_event_manager.get_element_color_type();
			cur_color_type = _view_list.get_list_color_type(parent_color_type);
			list_element_type_arr.push(cur_color_type);
		}

		if(cur_color_type == undefined) {
			console.log("!Error! / airborne.bootstrap.obj.list / add_editable_action / cur_color_type == undefined");
			return;
		}

		// Phase 01
		var cur_element_type = _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT;
		var delegate_add_list_row_info = this.get_delegate_add_list_row_info(cur_element_type);

		var delegate_add_element = this.get_delegate_add_element(parent_element_set, cur_list_container_jq, cur_delegate_save_n_reload, cur_color_type, delegate_add_list_row_info);
		if(delegate_add_element == undefined) {
			console.log("!Error! / airborne.bootstrap.obj.list / add_editable_action / delegate_add_element == undefined");
			return;
		}

		// child element set의 추가
		var children_ecs = 
		delegate_add_element._func.apply(delegate_add_element._scope,[[], list_title, false, delegate_add_element]);
		// child element set의 추가
		var shy_child_esc = 
		delegate_add_element._func.apply(delegate_add_element._scope,[[], "shy_"+list_title, true, delegate_add_element]);

		// cur_element_collection_set.set_delegate_add_element(delegate_add_element);

		// prev_sibling_element
		// 자신보다 앞에 있는 형제 엘리먼트와 전후 관계를 연결합니다.

		// next_sibling_element
		// 자신보다 뒤에 있는 형제 엘리먼트와 전후 관계를 연결합니다.

	}
	/*
		@ public
		@ scope : view list
		@ Desc : 화면에 리스트를 추가합니다. json format으로 규격화된 정보를 입,출력합니다.
		사용자가 세팅할 것은 오직 LIST ELEMENT TYPE만 배열로 세팅해줍니다.
	*/
	,add_editable_action_list:function(list_element_type_arr, action_list, list_title, parent_element_set, list_container_jq, delegate_save_n_reload) {

		var _v = airborne.validator;
		var _html = airborne.html;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _view_list = airborne.bootstrap.view.obj.list;

		if(_v.is_not_valid_array(list_element_type_arr)) {
			console.log("!Error! / airborne.bootstrap.obj.list / add_editable_action_list / _v.is_not_valid_array(list_element_type_arr)");
			return;
		}
		if(_v.is_not_valid_str(list_title)) {
			console.log("!Error! / airborne.bootstrap.obj.list / add_editable_action_list / _v.is_not_valid_str(list_title)");
			return;
		}
		if(list_container_jq == undefined) {
			console.log("!Error! / airborne.bootstrap.obj.list / add_editable_action_list / list_container_jq == undefined");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_save_n_reload)){
			console.log("!Error! / airborne.bootstrap.obj.list / add_editable_action_list / _obj.isNotValidDelegate(delegate_save_n_reload)");
			return;
		}



		// 배열에 LIST ELEMENT TYPE이 있습니다.
		// 각 depth마다 자신의 LIST ELEMENT TYPE을 제외한 나머지 타입 배열을 
		// 재귀 호출 메서드의 파라미터로 넘깁니다.
		var cur_element_type = list_element_type_arr[0];
		var cur_color_type;
		if(parseInt(list_element_type_arr.length/2) == 0){
			cur_color_type=_view_list.COLOR_TYPE_LIST_ROW_WHITE;
		} else {
			cur_color_type=_view_list.COLOR_TYPE_LIST_ROW_YELLOW;
		}

		var is_editable_list_action = false;
		var is_fixed_row_action = false;

		var delegate_add_list_row_info = this.get_delegate_add_list_row_info(cur_element_type);
		var delegate_add_element = this.get_delegate_add_element(parent_element_set, list_container_jq, delegate_save_n_reload, cur_color_type, delegate_add_list_row_info);

		var cur_element_collection_set;
		if(_v.is_valid_array(action_list)) {
			cur_element_collection_set = delegate_add_element._func.apply(delegate_add_element._scope,[action_list, list_title, false, delegate_add_element]);
		}

		var cur_shy_element_collection_set = delegate_add_element._func.apply(delegate_add_element._scope,[[], "shy_"+list_title, true, delegate_add_element]);

		// 3-0. 엘리먼트 자신과 자식의 속성 정보를 element collection set에 등록합니다.
		// 나중에 자신의 형제열 혹은 자신의 자식 열을 추가할 때 필요한 정보입니다.
		if(cur_element_collection_set != undefined) {
			cur_element_collection_set.add_element_type_arr(list_element_type_arr);
		}
		if(cur_shy_element_collection_set != undefined) {
			cur_shy_element_collection_set.add_element_type_arr(list_element_type_arr);
		}

		// 3-1. 더 이상 남은 타입이 없다면 진행하지 않습니다.
		if(_v.is_not_valid_array(list_element_type_arr) || list_element_type_arr.length == 1) return;
		// 3-2. 구현한 타입을 제거합니다.
		list_element_type_arr.shift();

		// 4. 자신의 자식들에 대한 메타 정보를 넘깁니다.
		// 이때, 자신의 element collection set을 넘겨서 관련된 참조를 연결해줍니다.
		// 4-1. shy 리스트는 자식 객체가 없으므로 정보를 넘기지 않습니다.

		// 4-2. 실제로 화면에서 보여줘야 할 리스트의 element collection set을 만듭니다.
		if(cur_element_collection_set != undefined) {

			var cur_element_set_arr = cur_element_collection_set.get_element_set_arr();
			var idx;
			var length = cur_element_set_arr.length;
			for(idx = 0; idx < length; idx++){
				var cur_element_set = cur_element_set_arr[idx];
				var cur_meta_info = cur_element_set.get_meta_info();

				if(cur_element_set.get_meta_info().get_is_shy()) {
					// 자신이 shy mode 인 경우는 자식 객체를 추가하지 않는다.
					continue;
				}

				var cur_action_list_list = cur_meta_info.get_prop_map().__action_list;
				if(_v.is_valid_array(cur_action_list_list)){
					// 내부의 자식 객체가 있는 경우.

					var inner_idx;
					var inner_length = cur_action_list_list.length;
					for(inner_idx = 0; inner_idx < inner_length; inner_idx++){
						var cur_action_list = cur_action_list_list[inner_idx];

						this.add_editable_action_list(
							// list_element_type_arr
							list_element_type_arr
							// action_list
							, cur_action_list
							// list_title
							, cur_element_set.get_meta_info().get_prop_map().__action_name
							// parent_element_set
							, cur_element_set
							// list_container_jq
							, cur_element_set.get_event_manager().get_children_element_container_jq()
							// delegate_save_n_reload
							, delegate_save_n_reload
						);
					} // inner for end

				} else {

					// 내부의 자식 객체가 없는 경우.
					// 빈 액션 리스트를 넘겨서 shy row가 포함된 자식 객체를 만듭니다.
					this.add_editable_action_list(
						// list_element_type_arr
						list_element_type_arr
						// action_list
						, []
						// list_title
						, cur_element_set.get_meta_info().get_prop_map().__action_name
						// parent_element_set
						, cur_element_set
						// list_container_jq
						, cur_element_set.get_event_manager().get_children_element_container_jq()
						// delegate_save_n_reload
						, delegate_save_n_reload
					);

				} // if end
			} // for end
		} // if end


		return cur_element_collection_set;
	}
	// @ Section : LIST DRAWING & EVENT
	// @ public
	// @ Desc : 화면에 리스트를 추가합니다.
	,add_editable_list:function(parent_jq, editable_list_meta_info_obj, delegate_save_n_reload, delegate_fetch_searchable_element_list, delegate_show_combo_box_element, color_type){

		var _v = airborne.validator;
		var _html = airborne.html;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _view_list = airborne.bootstrap.view.obj.list;

		if(parent_jq == null){
			console.log("!Error! / airborne.bootstrap.obj / parent_jq == null");
			return;
		}
		if(editable_list_meta_info_obj == null){
			console.log("!Error! / airborne.bootstrap.obj / editable_list_meta_info_obj == null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_save_n_reload)){
			console.log("!Error! / airborne.bootstrap.obj / _obj.isNotValidDelegate(delegate_save_n_reload)");
			return;
		}

		
		var editable_list_row_obj_arr = editable_list_meta_info_obj.get_list_row_info();

		if(_v.isNotValidStr(color_type)){
			color_type = this.COLOR_TYPE_LIST_ROW_WHITE;
		}
		if(	color_type != this.COLOR_TYPE_LIST_ROW_WHITE &&
			color_type != this.COLOR_TYPE_LIST_ROW_GREEN &&
			color_type != this.COLOR_TYPE_LIST_ROW_BLUE &&
			color_type != this.COLOR_TYPE_LIST_ROW_YELLOW &&
			color_type != this.COLOR_TYPE_LIST_ROW_RED	){

			color_type = this.COLOR_TYPE_LIST_ROW_WHITE;

		}

		// shy row인 경우의 처리 
		var is_shy = false;
		if(editable_list_row_obj_arr != null && editable_list_row_obj_arr.length == 1){
			var editable_list_row_obj = editable_list_row_obj_arr[0];
			is_shy = editable_list_row_obj.get_is_shy();
		}

		// TODO element collection set이 새로운 열을 추가할 수 있도록 함.
		// element collection set
		var cur_element_collection_set = _obj.get_element_collection_set(editable_list_meta_info_obj.get_list_title());
		cur_element_collection_set.set_element_meta_info_obj(editable_list_meta_info_obj);

		if(is_shy && _v.is_valid_array(editable_list_row_obj_arr) && editable_list_row_obj_arr.length == 1){
			// console.log("혼자 등록된 shy row만 가려줍니다.");
			editable_list_tag = ""
			+ "<ul class=\"list-group\" lock=\"NO\" style=\"padding-top:10px;margin-bottom:5px;display:none;\">"
			;
		} else if(_v.is_not_valid_array(editable_list_row_obj_arr)) {
			// console.log("빈 리스트를 가려줍니다.");
			editable_list_tag = ""
			+ "<ul class=\"list-group\" lock=\"NO\" style=\"padding-top:10px;margin-bottom:5px;display:none;\">"
			;
		} else {
			editable_list_tag = ""
			+ "<ul class=\"list-group\" lock=\"NO\" style=\"padding-top:10px;margin-bottom:5px;\">"
			;
		}

		// 입력을 위한 input group 태그를 만듭니다.
		editable_list_tag += ""
		+ "<li id=\"row_input_group\" class=\"list-group-item <color_type>\" style=\"display:none;padding-left:10px;\">"
			.replace(/\<color_type\>/gi, color_type)

			// common input.
			+ "<div id=\"row_input_text\" class=\"form-group col-lg-9\" style=\"margin:0px;padding-left:0px;padding-right:7px;\">"
				+ "<input id=\"common_input\" class=\"form-control\" placeholder=\"Enter Keyword\">"
			+ "</div>"

			// time_hh_mm of time_mm_ss / 리스트 형태를 위한 태그
			+ "<div id=\"input_group_time\" class=\"row airborne_add_on_input\" style=\"display:none;\">"
				+ "<div class=\"col-lg-6\">"
					+ "<div class=\"input-group\">"
						+ "<input type=\"text\" id=\"input_time\" class=\"form-control\" value=\"\" prev_value=\"\" tossed_value=\"\">"
						+ "<span class=\"input-group-btn\">"
							+ "<button id=\"btn_plus\" class=\"btn btn-default\" type=\"button\">"
								+ "&nbsp;"
								+ "<span class=\"glyphicon glyphicon-plus\"></span>"
								+ "&nbsp;"
							+ "</button>"
							+ "<button id=\"btn_minus\" class=\"btn btn-default\" type=\"button\">"
								+ "&nbsp;"
								+ "<span class=\"glyphicon glyphicon-minus\"></span>"
								+ "&nbsp;"
							+ "</button>"
							+ "<button id=\"btn_ok_time\" class=\"btn btn-default\" type=\"button\">"
								+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "OK" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							+ "</button>"
							+ "<button id=\"btn_cancel_time\" class=\"btn btn-default\" type=\"button\">"
								+ "CANCEL"
							+ "</button>"
						+ "</span>"
					+ "</div>"//<!-- /input-group -->
				+ "</div>"//<!-- /input-group -->
			+ "</div>"

			// search output list
			+ "<div id=\"search_output_list\" class=\"list-group col-lg-9\" style=\"display:none;margin:8px 7px 0px;\">"
				// + "<a href=\"#\" class=\"list-group-item active\" style=\"padding-top:6px;padding-bottom:6px;font-size:14px;\">Cras justo odio</a>"
			+ "</div>"

			// searchable combo box list tags.
			+ "<div class=\"col-lg-9\" style=\"padding-left:7px;padding-right:7px;\">"
				+ "<select class=\"form-control\" name=\"list_search_tab\" id=\"list_search_tab\">"
					+ "<option value=\"48\">180th&nbsp;&nbsp;&nbsp;&nbsp;2014-09-18&nbsp;&nbsp;&nbsp;&nbsp;No Theme</option>"
					+ "<option value=\"47\">179th&nbsp;&nbsp;&nbsp;&nbsp;2014-09-11&nbsp;&nbsp;&nbsp;&nbsp;Chooseok, Korean Thanksgiving ...</option>"
				+ "</select>"
			+ "</div>"

			// buttons 
			+ "<button id=\"btn_search\" class=\"btn btn-default\" style=\"padding-left:20px;padding-right:20px;margin-right:8px;\">&nbsp;<span class=\"glyphicon glyphicon-search\"></span>&nbsp;</button>"
			+ "<button id=\"btn_ok\" class=\"btn btn-default\" style=\"padding-left:20px;padding-right:20px;margin-right:8px;\">&nbsp;<span class=\"glyphicon glyphicon-ok\"></span>&nbsp;</button>"
			+ "<button id=\"btn_cancel\" class=\"btn btn-default\" style=\"padding-left:20px;padding-right:20px;margin-right:8px;\">&nbsp;<span class=\"glyphicon glyphicon-remove\"></span>&nbsp;</button>"

		+ "</li>"
		;


		// 표시할 리스트 열 태그를 가져옵니다.
		for (var idx = 0; idx < editable_list_row_obj_arr.length; idx++) {

			var editable_list_row_obj = editable_list_row_obj_arr[idx];
			if(editable_list_row_obj == null){
				console.log("!Error! / add_editable_list / editable_list_row_obj == null");
				return;
			}

			// DEBUG
			// console.log("DEBUG / title : ",editable_list_row_obj.get_list_row_text());
			// console.log("DEBUG / editable_list_row_obj : ",editable_list_row_obj);

			var editable_list_row_id = editable_list_row_obj.get_list_row_id();
			var editable_list_row_title = _html.getSafeText(editable_list_row_obj.get_list_row_text());
			var editable_list_row_inner_table_selector = "";

			// 아무것도 없는 항목의 추가 버튼이 마우스 오버시 나타나는 경우, 아래 조건으로 제어.
			var is_shy = editable_list_row_obj.get_is_shy();
			var time_xx_yy = "";
			if( _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == editable_list_row_obj.get_element_type() ){

				var cur_prop_map = editable_list_row_obj.get_prop_map();
				if(cur_prop_map != null && cur_prop_map[_obj.TIME_PROP_HH_MM] != null){
					time_xx_yy = editable_list_row_obj.get_prop_map()[_obj.TIME_PROP_HH_MM];
				} else {
					console.log("!Error! / add_editable_list / cur_prop_map.__time_hh_mm == null");
					return;
				}

			} else if( _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == editable_list_row_obj.get_element_type() ){

				var cur_prop_map = editable_list_row_obj.get_prop_map();
				if(cur_prop_map != null && cur_prop_map[_obj.TIME_PROP_MM_SS] != null){
					time_xx_yy = editable_list_row_obj.get_prop_map()[_obj.TIME_PROP_MM_SS];
				} else {
					console.log("!Error! / add_editable_list / cur_prop_map.__time_mm_ss == null");
					return;
				}

			}

			var is_last = ((editable_list_row_obj_arr.length - 1) == idx)?true:false;
			var is_first = (0 == idx)?true:false;

			editable_list_tag += ""
			+ "<li class=\"list-group-item  <color_type>\" id=\"<editable_list_row_id>\" type=\"editable_list_row\" idx=\"<row_idx>\" is_first=\"<is_first>\" is_last=\"<is_last>\" event_manager_id=\"<event_manager_id>\" inner_table_selector_id=\"<inner_table_selector_id>\" is_shy=\"<is_shy>\" style=\"<style>\" element_type=\"<element_type>\">"
				.replace(/\<editable_list_row_id\>/gi, editable_list_row_id)
				.replace(/\<row_idx\>/gi, idx)
				.replace(/\<is_first\>/gi, is_first)
				.replace(/\<is_last\>/gi, is_last)
				.replace(/\<event_manager_id\>/gi, "")
				.replace(/\<inner_table_selector_id\>/gi, editable_list_row_inner_table_selector)
				.replace(/\<color_type\>/gi, color_type)
				.replace(/\<is_shy\>/gi, is_shy)
				// shy row는 화면에서 가려줍니다.
				.replace(/\<style\>/gi, (is_shy === true)?"display:none;":"")
				.replace(/\<element_type\>/gi, editable_list_row_obj.get_element_type())
				// 시간을 나타냄. 초기값은 display:none;
				+ "<span id=\"time\" class=\"badge airborne_add_on\" style=\"float:left;display:none;\" tossed_time=\"<tossed_time>\">".replace(/\<tossed_time\>/gi, time_xx_yy)
				+ time_xx_yy
				+ "</span>"
			;

			editable_list_tag += ""
			// 사용자가 입력한 타이틀을 나타냄. 시간 표시가 있을 경우 우측 패딩을 추가.
			+ "<span id=\"title\" style=\"padding-left:10px;\" tossed_value=\"<tossed_value>\"><_v></span>"
				.replace(/\<_v\>/gi, editable_list_row_title)
				.replace(/\<tossed_value\>/gi, editable_list_row_title)
			;


			// 내부 버튼설정
			editable_list_tag += ""
				// 수정을 하기 위한 버튼들
				+ "<span id=\"btn_edit\" class=\"glyphicon glyphicon-pencil\" style=\"display:none;padding-left:20px;\"></span>"
				+ "<span id=\"btn_add\" class=\"glyphicon glyphicon-plus\" style=\"display:none;padding-left:20px;\"></span>"
				+ "<span id=\"btn_remove\" class=\"glyphicon glyphicon-remove\" style=\"display:none;padding-left:20px;\"></span>"
				+ "<span id=\"btn_eject\" class=\"glyphicon glyphicon-move\" style=\"display:none;padding-left:20px;\"></span>"
			;
			if(is_first && !is_shy){
				// 첫번째 열에 우측에 element collection set eject 버튼을 노출한다. 
				editable_list_tag += ""
				+ "<span id=\"btn_collection_eject\" class=\"glyphicon glyphicon-move\" style=\"float:right;padding-left:20px;\"></span>"
				;
			} else {
				// 첫번째 열에 우측에 element collection set eject 버튼을 가린다.
				editable_list_tag += ""
				+ "<span id=\"btn_collection_eject\" class=\"glyphicon glyphicon-move\" style=\"float:right;padding-left:20px;display:none;\"></span>"
				;
			}

			editable_list_tag += ""
				// chlidren element container div
				+ "<div id=\"chlid_shy_element_container\"></div>"
				// chlidren element container div
				+ "<div id=\"chlidren_element_container\"></div>"
				// add on element container div
				+ "<div id=\"add_on_element_container\"></div>"
			+ "</li>"
			;

		}
		editable_list_tag += ""
		+ "</ul>"
		;
		if(_v.isNotValidStr(editable_list_tag)){
			console.log("!Error! / add_editable_list / _v.isNotValidStr(editable_list_tag)");
			return;
		}









		// 태그 적용(append) 및 마우스 이벤트 연동하기
		// 이제 페이지에서 리스트를 볼 수 있습니다.
		parent_jq.append(editable_list_tag);
		var editable_list_jq = parent_jq.children().last();
		var editable_list_row_arr_jq = editable_list_jq.children();

		cur_element_collection_set.set_element_collection_container_jq(editable_list_jq);








		// 리스트 열 내부에서 선택할 수 있는 요소
		// 1. 시간 엘리먼트. 
		// 2. 리스트 내용. 
		// 2가지 경우의 수가 생길 경우, 서로 다른 타입임을 알려주고 이벤트를 설정해야 함.
		// 마우스 이벤트 연동하기
		var delegate_set_event_manager_prop_on_list_row = _obj.get_delegate(function(element_event_manager){

			// CHANGE ME / cur_list_row_jq --> cur_list_row_set_jq
			var cur_list_row_jq = element_event_manager.get_element_jq();

			// COLOR
			var cur_list_row_color = cur_list_row_jq.css("color");
			var cur_list_row_background_color = cur_list_row_jq.css("background-color");

			element_event_manager.set_element_color(cur_list_row_color);
			element_event_manager.set_element_background_color(cur_list_row_background_color);

			// COLOR_TYPE
			element_event_manager.set_element_color_type(color_type);

			// CONTAINER
			var element_container_jq = cur_list_row_jq.parent();
			element_event_manager.set_element_container_jq(element_container_jq);
			element_event_manager.set_element_id(element_event_manager.event_manager_id);

			var cur_element_meta_info = element_event_manager.get_element_meta_info();
			var cur_element_type = cur_element_meta_info.get_element_type();

			// INPUT GROUP
			var cur_list_row_grand_parent_jq = cur_list_row_jq.parent();
			// 내부에 자식 객체도 동일한 엘리먼트를 가질수 있으므로 첫번째 검색 결과만 사용합니다.
			var cur_input_group_jq = cur_list_row_grand_parent_jq.find("li#row_input_group").first();
			element_event_manager.set_title_input_group_jq(cur_input_group_jq);

			if(	_obj.ELEMENT_TYPE_TITLE_ADDABLE == cur_element_type ){

				var btn_add_jq = cur_list_row_jq.find("span#btn_add").first();
				element_event_manager.set_btn_add_element_jq(btn_add_jq);

			}
			var time_jq = null;
			if( _obj.ELEMENT_TYPE_SEARCH_LIST == cur_element_type || 
				_obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type || 
				_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || 
				_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type || 
				_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type || 
				_obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT == cur_element_type){

				var btn_edit_jq = cur_list_row_jq.find("span#btn_edit").first();
				element_event_manager.set_btn_edit_element_jq(btn_edit_jq);
				
				if( _obj.ELEMENT_TYPE_TIME_HH_MM == cur_element_type || 
					_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type ||
					_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type || 
					_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type ){

					// 엘리먼트 내부의 시간 정보 표시 엘리먼트 참조를 저장
					time_jq = cur_list_row_jq.find("span#time").first();
					element_event_manager.set_time_jq(time_jq);
					element_event_manager.show_time_jq();

					// 시간 정보 입력 엘리먼트 그룹
					var time_input_group_jq = cur_list_row_jq.parent().parent().find("div#input_group_time").first();
					if(time_input_group_jq != undefined && time_input_group_jq.length > 1) {
						time_input_group_jq = $(time_input_group_jq[0]);
					}
					element_event_manager.set_time_input_group_jq(time_input_group_jq);

					// 시간 정보 입력 엘리먼트 그룹의 시간 표시 엘리먼트
					var time_input_group_jq_input_jq = time_input_group_jq.find("input#input_time").first();
					element_event_manager.set_time_input_group_jq_input_jq(time_input_group_jq_input_jq);

					// @ Desc : 시간 입력 그룹의 시간 추가 버튼
					var time_input_group_jq_btn_time_plus_jq = time_input_group_jq.find("button#btn_plus").first();
					element_event_manager.set_time_input_group_jq_btn_time_plus_jq(time_input_group_jq_btn_time_plus_jq);

					// @ Desc : 시간 입력 그룹의 시간 감소 버튼
					var time_input_group_jq_btn_time_minus_jq = time_input_group_jq.find("button#btn_minus").first();
					element_event_manager.set_time_input_group_jq_btn_time_minus_jq(time_input_group_jq_btn_time_minus_jq);

					// @ Desc : 시간 입력 그룹의 수정된 시간 확인 버튼
					var time_input_group_jq_btn_time_ok_jq = time_input_group_jq.find("button#btn_ok_time").first();
					element_event_manager.set_time_input_group_jq_btn_time_ok_jq(time_input_group_jq_btn_time_ok_jq);

					// @ Desc : 시간 입력 그룹의 수정된 시간 취소 버튼
					var time_input_group_jq_btn_time_cancel_jq = time_input_group_jq.find("button#btn_cancel_time").first();
					element_event_manager.set_time_input_group_jq_btn_time_cancel_jq(time_input_group_jq_btn_time_cancel_jq);
				}
				if( cur_element_meta_info.get_is_editable() == true && !cur_element_meta_info.get_is_shy() ){

					var btn_remove_jq = cur_list_row_jq.find("span#btn_remove").first();
					element_event_manager.set_btn_remove_element_jq(btn_remove_jq);

					var btn_eject_jq = cur_list_row_jq.find("span#btn_eject").first();
					element_event_manager.set_btn_eject_element_jq(btn_eject_jq);

					var btn_collection_eject_jq = cur_list_row_jq.find("span#btn_collection_eject").first();
					element_event_manager.set_btn_eject_collection_element_jq(btn_collection_eject_jq);
					
				}
			}

			// ROW TITLE (고정 - 노출되는 값)
			var cur_list_row_text_jq = cur_list_row_jq.find("span#title").first();
			element_event_manager.set_title_jq(cur_list_row_text_jq);
			// ROW TITLE CONTAINER
			var cur_table_column_text_container_jq = cur_list_row_jq.parent();
			element_event_manager.set_parent_container_jq(cur_table_column_text_container_jq);
			// ROW TITLE INPUT CONTAINER
			var cur_input_text_container_jq = cur_input_group_jq.find("div#row_input_text").first();
			element_event_manager.set_title_input_container_jq(cur_input_text_container_jq);

			// ROW TITLE INPUT (수정,편집이 가능한 input 엘리먼트)
			var cur_input_title_jq = cur_input_group_jq.find("input#common_input").first();
			element_event_manager.set_title_input_jq(cur_input_title_jq);

			var search_output_list_jq = cur_input_group_jq.find("div#search_output_list").first();
			element_event_manager.set_search_output_list_jq(search_output_list_jq);

			var searchable_combo_box_jq = cur_input_group_jq.find("select").first();
			element_event_manager.set_searchable_combo_box_jq(searchable_combo_box_jq);

			var cur_title_input_btn_ok_jq = cur_input_group_jq.find("button#btn_ok").first();
			element_event_manager.set_title_input_btn_ok_jq(cur_title_input_btn_ok_jq);

			var cur_title_input_btn_cancel_jq = cur_input_group_jq.find("button#btn_cancel").first();
			element_event_manager.set_title_input_btn_cancel_jq(cur_title_input_btn_cancel_jq);

			var cur_list_row_btn_add_jq = cur_list_row_jq.find("span#btn_add").first();
			if(cur_list_row_btn_add_jq.length > 0){
				element_event_manager.set_btn_add_element_jq(cur_list_row_btn_add_jq);	
			}

			var cur_title_input_btn_search_jq = cur_input_group_jq.find("button#btn_search").first();
			element_event_manager.set_title_input_btn_search_jq(cur_title_input_btn_search_jq);

			element_event_manager.set_delegate_save_n_reload(delegate_save_n_reload);

			element_event_manager.set_delegate_add_searchable_element(_obj.get_delegate_add_searchable_element());

			// 리스트 내부의 추가 동작을 하기 위한 숨김 자식(shy child) 리스트를 내부에 포함하고자 할 때, 사용하는 컨테이너입니다.
			var cur_child_shy_element_container_jq = cur_list_row_jq.find("div#chlid_shy_element_container").first();
			element_event_manager.set_child_shy_element_container_jq(cur_child_shy_element_container_jq);

			// 리스트 내부의 자식 리스트를 내부에 포함하고자 할 때, 사용하는 컨테이너입니다.
			var cur_children_element_container_jq = cur_list_row_jq.find("div#chlidren_element_container").first();
			element_event_manager.set_children_element_container_jq(cur_children_element_container_jq);

			// 리스트 내부의 자식 리스트가 아닌 다른 객체를 내부에 포함하고자 할 때, 이를 받는 컨테이너 객체
			var cur_add_on_element_container_jq = cur_list_row_jq.find("div#add_on_element_container").first();
			element_event_manager.set_add_on_element_container_jq(cur_add_on_element_container_jq);

			// 각 엘리먼트는 1개의 정보만을 가지고 이 정보를 업데이트하는 것을 기준으로 설계되었습니다.
			// 그러므로 열에 시간 정보가 추가되어 이 추가 정보를 제어하는 이벤트를 처리하는 것은 각 컴포넌트 단에서 직접 제어해야 합니다.
			if(_obj.isValidDelegate(delegate_fetch_searchable_element_list)){
				element_event_manager.set_delegate_fetch_searchable_element_list(delegate_fetch_searchable_element_list);
			}

			// 리스트의 입력그룹이 아닌 첫번째 리스트 열에 대해 radius를 적용합니다.
			var cur_idx = cur_list_row_jq.attr("idx");
			var is_first = (cur_list_row_jq.attr("is_first") == "true");
			var is_last = (cur_list_row_jq.attr("is_last") == "true");
			if(is_first && is_last){
				_obj.set_list_single_row_css_radius(cur_list_row_jq, _obj.LIST_ROW_RADIUS_NORMAL);
			} else if(is_first){
				_obj.set_list_first_row_css_radius(cur_list_row_jq, _obj.LIST_ROW_RADIUS_NORMAL);
			} else if(is_last){
				_obj.set_list_last_row_css_radius(cur_list_row_jq, _obj.LIST_ROW_RADIUS_NORMAL);
			}

			// 리스트 열을 클릭했을 때, 입력 그룹의 위치를 클릭한 리스트 열로 변경하는 델리게이트 설정 
			element_event_manager.set_delegte_move_title_input_group_jq(_obj.get_delegate(function(cur_element_jq, cur_element_container_jq, cur_title_input_group_jq){

				// 1. 현재 열에 저장된 텍스트를 가져옵니다.
				var cur_title_jq = cur_element_container_jq.find("span#title").first();
				var cur_title = cur_title_jq.html();

				// 3. 사용자가 선택한 열의 위치에 입력 그룹 폼 열을 위치시킵니다.
				cur_element_jq.after(cur_title_input_group_jq);

				// 4. 사용자가 선택한 열을 가립니다.
				cur_element_jq.hide();

				// 5. 위치에 따라 INPUT GROUP의 테두리 모양을 변경합니다.
				var cur_idx = cur_element_jq.attr("idx");
				var is_first = (cur_element_jq.attr("is_first") == "true");
				var is_last = (cur_element_jq.attr("is_last") == "true");

				if(is_first && is_last){
					_obj.set_list_single_row_css_radius(cur_title_input_group_jq, _obj.LIST_ROW_RADIUS_NORMAL);
				} else if(is_first){
					_obj.set_list_first_row_css_radius(cur_title_input_group_jq, _obj.LIST_ROW_RADIUS_NORMAL);
				} else if(is_last){
					_obj.set_list_last_row_css_radius(cur_title_input_group_jq, _obj.LIST_ROW_RADIUS_NORMAL);
				}

			}, this));

			// 엘리먼트가 사용자 수정에 의해 새로운 위치로 이동 완료한 뒤에 호출되는 콜백 델리게이트
			element_event_manager.set_delegate_callback_after_landing_element(_obj.get_delegate(function(cur_event_manager_on_mouse_over){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;
				var _dates = airborne.dates;

				var consoler = airborne.console.get();
				consoler.off();

				var cur_before_sibling_event_manager = cur_event_manager_on_mouse_over.get_before_sibling_event_manager();
				var cur_after_sibling_event_manager = cur_event_manager_on_mouse_over.get_after_sibling_event_manager();

				var is_first = (cur_before_sibling_event_manager == undefined)?true:false;
				var is_last = (cur_after_sibling_event_manager == undefined)?true:false;

				consoler.say("엘리먼트가 사용자 수정에 의해 새로운 위치로 이동 완료한 뒤에 호출되는 콜백 델리게이트");
				var cur_sibling_element_event_manager_arr = cur_event_manager_on_mouse_over.get_sibling_element_event_manager_arr(true);
				var cur_element_set = cur_event_manager_on_mouse_over.get_element_set();
				var cur_element_collection_set = cur_element_set.get_element_collection_set();
				var cur_masked_element_set_arr = cur_element_collection_set.ecs_get_masked_element_set_arr(false/*has_input_group*/);

				for(var idx = 0; idx < cur_masked_element_set_arr.length; idx++) {
					var cur_masked_element_set = cur_masked_element_set_arr[idx];
					if(cur_masked_element_set == undefined) continue;

					var cur_sibling_element_event_manager = cur_masked_element_set.get_event_manager();
					var cur_title = cur_sibling_element_event_manager.get_title_jq_value();
					var cur_element_jq = cur_sibling_element_event_manager.get_element_jq();

					if(cur_element_jq.prev().is(":visible") == false) {
						consoler.say("첫번째 엘리먼트로 지정되었습니다. / 이벤트와 모양을 지정합니다. / " + cur_title);
						_obj.remove_list_row_css_radius(cur_element_jq);
						_obj.set_list_first_row_css_radius(cur_element_jq, _obj.LIST_ROW_RADIUS_NORMAL);
						cur_sibling_element_event_manager.show_btn_eject_collection_element_jq();
					} else if(cur_element_jq.next().length == 0) {
						consoler.say("마지막 엘리먼트로 지정되었습니다. / 이벤트와 모양을 지정합니다. / " + cur_title);
						_obj.remove_list_row_css_radius(cur_element_jq);
						_obj.set_list_last_row_css_radius(cur_element_jq, _obj.LIST_ROW_RADIUS_NORMAL);
						cur_sibling_element_event_manager.hide_btn_eject_collection_element_jq();
					} else {
						consoler.say("중간의 엘리먼트로 지정되었습니다. / 이벤트와 모양을 지정합니다. / " + cur_title);
						_obj.remove_list_row_css_radius(cur_element_jq);
						cur_sibling_element_event_manager.hide_btn_eject_collection_element_jq();
					}	
				}

				// 시간 위젯이 있다면 바뀐 위치에 따라 시간을 조정해줍니다.
				var cur_element_type;
				if(cur_event_manager_on_mouse_over != undefined){
					cur_element_type = cur_event_manager_on_mouse_over.get_element_type();
				}

				// FIX ME - 시간 변경 로직으로 오류 발생. 오류 수정 전까지는 시간 정렬 자동화 기능은 제외합니다.
				/*
				if( cur_element_type == _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT ){

					// 열 변경에 따른 시간 업데이트 로직
					// 복사된 열이 새롭게 받게될 시간을 표시한다.
					if(is_first){
						// 1. 첫번째 열일 경우는 이전 첫번째 열보다 10분 이전	
						//console.log("1. 첫번째 열일 경우는 이전 첫번째 열보다 10분 이전");
						var cur_next_time = cur_after_sibling_event_manager.get_element_jq().find("span#time").first().html();

						var new_time_10m_earlier = _dates.get_minutes_offset_from_hh_mm(cur_next_time,-10);
						cur_event_manager_on_mouse_over.get_element_jq().find("span#time").first().html(new_time_10m_earlier);

					} else if(is_last){
						// 2. 마지막 열일 경우는 이전 마지막 열보다 10분 이후
						//console.log("2. 마지막 열일 경우는 이전 마지막 열보다 10분 이후");
						var cur_prev_time = cur_before_sibling_event_manager.get_value_time_jq();
						var new_time_10m_after = _dates.get_minutes_offset_from_hh_mm(cur_prev_time,10);

						cur_event_manager_on_mouse_over.set_value_time_jq(new_time_10m_after);

					} else {
						// 3. 두 열의 사이일 경우는 두 열의 시간의 중간 값.
						//console.log("3. 두 열의 사이일 경우는 두 열의 시간의 중간 값.");
						var cur_prev_time = cur_before_sibling_event_manager.get_value_time_jq();
						var cur_next_time = cur_after_sibling_event_manager.get_value_time_jq();

						var diff_time_prev_n_next_time = -1 * _dates.get_diff_hh_mm(cur_prev_time,cur_next_time);
						var new_time_in_between = cur_next_time;
						var quotient = 0;
						if(diff_time_prev_n_next_time > 0){
							quotient = parseInt(diff_time_prev_n_next_time / 5);
						}
						if(quotient > 1){
							//console.log("시작 시간으로부터 5분뒤로 세팅.");
							new_time_in_between = _dates.get_minutes_offset_from_hh_mm(cur_prev_time,5);
						}

						cur_event_manager_on_mouse_over.set_value_time_jq(new_time_in_between);
					}



					
				}	// end ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT
				*/

				// 형제 엘리먼트의 디자인 - collection eject btn, corner round - 을 다시 그립니다.
				console.log("형제 엘리먼트의 디자인 - collection eject btn, corner round - 을 다시 그립니다.");
				cur_event_manager_on_mouse_over.shape_sibling_element(true/*has_myself*/);

				// Save n Reload
				if(cur_event_manager_on_mouse_over != undefined){
					cur_event_manager_on_mouse_over.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT, _obj.EVENT_TYPE_UPDATE_ITEM);	
				}

			}, this)); // end set_delegate_callback_after_landing_element


			// 저장 및 리로드 이전에 호출되는 델리게이트.

			//     dMMMMb  dMMMMMP dMMMMMP .aMMMb  dMMMMb  dMMMMMP 
			//    dMP"dMP dMP     dMP     dMP"dMP dMP.dMP dMP      
			//   dMMMMK" dMMMP   dMMMP   dMP dMP dMMMMK" dMMMP     
			//  dMP.aMF dMP     dMP     dMP.aMP dMP"AMF dMP        
			// dMMMMP" dMMMMMP dMP      VMMMP" dMP dMP dMMMMMP    

			//    .dMMMb  .aMMMb  dMP dMP dMMMMMP         dMMMMb         dMMMMb  dMMMMMP dMP    .aMMMb  .aMMMb  dMMMMb 
			//   dMP" VP dMP"dMP dMP dMP dMP             dMP dMP        dMP.dMP dMP     dMP    dMP"dMP dMP"dMP dMP VMP 
			//   VMMMb  dMMMMMP dMP dMP dMMMP           dMP dMP        dMMMMK" dMMMP   dMP    dMP dMP dMMMMMP dMP dMP  
			// dP .dMP dMP dMP  YMvAP" dMP             dMP dMP        dMP"AMF dMP     dMP    dMP.aMP dMP dMP dMP.aMP   
			// VMMMP" dMP dMP    VP"  dMMMMMP         dMP dMP        dMP dMP dMMMMMP dMMMMMP VMMMP" dMP dMP dMMMMP"    

			element_event_manager.set_delegte_before_save_n_reload(_obj.get_delegate(function(cur_event_manager){

				// 이벤트 매니저의 이전,이후의 형제 이벤트 매니저가 없다면 진행하지 않는다.
				// Jump Spot 작업이 이미 진행되어 타임라인 변경이 완료되었기 때문이디.

				if(cur_event_manager.get_before_sibling_event_manager() == null && cur_event_manager.get_after_sibling_event_manager() == null) return;

				// FIX ME :: 타임라인 시간을 변경하면 다른 라인들이 사라지는 현상이 발생. 이 버그를 잡기 전까지 아래 기능을 주석 처리
				// 타임라인 시간 변경을 했을 때, 다른 열들의 시간도 같이 변경
				/*
				if( cur_event_manager.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT || 
					cur_event_manager.get_element_type() == _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT ){

					var cur_time_jq = cur_event_manager.get_time_jq();
					var cur_time = cur_time_jq.html();
					var cur_tossed_time = cur_event_manager.get_time_jq_attr_tossed_time();
					var cur_diff = _dates.get_diff_hh_mm(cur_time, cur_tossed_time);

					// 1. 사용자가 변경한 시간이 직전의 이전 시간보다 더 빠른 경우 그 차이만큼 이전 시간 모두를 시간을 빼준다.
					var before_sibling_event_manager = cur_event_manager.get_before_sibling_event_manager();
					var cur_before_time = "";
					var cur_before_time_diff = 0;
					if(before_sibling_event_manager != null){
						cur_before_time = before_sibling_event_manager.get_time_jq().html();
						cur_before_time_diff = _dates.get_diff_hh_mm(cur_time, cur_before_time);
					}

					// 2. 사용자가 변경한 시간이 직후의 이후 시간보다 더 늦은 경우 그 차이만큼 이전 시간 모두를 시간을 더해준다.
					var after_sibling_event_manager = cur_event_manager.get_after_sibling_event_manager();
					var cur_after_time = "";
					var cur_after_time_diff = 0;
					if(after_sibling_event_manager != null){
						cur_after_time = after_sibling_event_manager.get_time_jq().html();
						cur_after_time_diff = _dates.get_diff_hh_mm(cur_time, cur_after_time);
					}

					if(cur_before_time_diff < 0){

						cur_event_manager.call_delegate_on_prev_siblings_event_manager(_obj.get_delegate(function(cur_sibling_event_manager){

							// 이전 시간들을 변경합니다.
							var changed_time_str = _dates.get_minutes_offset_from_hh_mm(cur_sibling_event_manager.get_value_time_jq(), cur_diff);
							cur_sibling_event_manager.set_value_time_jq(changed_time_str);
							cur_sibling_event_manager.set_time_jq_attr_tossed_time(changed_time_str);


						}, this));

					} else if(cur_after_time_diff > 0){

						cur_event_manager.call_delegate_on_next_siblings_event_manager(_obj.get_delegate(function(cur_sibling_event_manager){

							// 이후 시간들을 변경합니다.
							var changed_time_str = _dates.get_minutes_offset_from_hh_mm(cur_sibling_event_manager.get_value_time_jq(), cur_diff);
							cur_sibling_event_manager.set_value_time_jq(changed_time_str);
							cur_sibling_event_manager.set_time_jq_attr_tossed_time(changed_time_str);

						}, this));

					}
					var cur_after_sibling_event_manager = cur_event_manager.get_after_sibling_event_manager();




					// 전체 타임 라인도 함께 확인합니다.
					var cur_sibling_element_event_manager_arr = cur_event_manager.get_sibling_element_event_manager_arr(true);
					var prev_sibling_event_manager;
					for(var idx = 1; idx < cur_sibling_element_event_manager_arr.length; idx++) {

						if(prev_sibling_event_manager == undefined) {
							prev_sibling_event_manager = cur_sibling_element_event_manager_arr[0];
						}

						var cur_sibling_event_manager = cur_sibling_element_event_manager_arr[idx];
						if(cur_sibling_event_manager == undefined) continue;

						// 2-1. 이전시간과 다음 시간을 비교합니다.
						var prev_time = prev_sibling_event_manager.get_value_time_jq();
						var cur_time = cur_sibling_event_manager.get_value_time_jq();
						var time_diff = _dates.get_diff_hh_mm(prev_time, cur_time);

						if(time_diff > 0) {

							// 이전 시간보다 5분뒤 시간 구하기.
							var new_time_str = _dates.get_minutes_offset_from_hh_mm(prev_time, 5);

							// 새로 구한 시간으로 현재 시간 업데이트.
							cur_sibling_event_manager.set_value_time_jq(new_time_str);
							cur_sibling_event_manager.set_time_jq_attr_tossed_time(new_time_str);

						}
						prev_sibling_event_manager = cur_sibling_event_manager;

					} // for end
					// 전체 타임 라인 시간 순서 확인 완료.

				}
				*/

				// shy element의 열이 이동하였을 때, 이동한 열에 맞게 시간을 변경해 줍니다.

			}, this));

			return element_event_manager;

		}, this);
	
		// 사용자가 새로운 열을 만들수 있도록, 이벤트 매니저 델리게이트 함수를 저장합니다.
		cur_element_collection_set.set_delegate_set_event_manager_prop(delegate_set_event_manager_prop_on_list_row);
		
		// 이후 리스트에 이벤트 매니저를 적용함. 리스트 형이므로 테이블과 다르게 동작. 이 부분은 수정할 것.
		var cur_list_row_meta_info_arr = editable_list_meta_info_obj.get_list_row_info();
		var cur_list_jq = parent_jq.children().last();
		var cur_list_row_jq_arr = cur_list_jq.find("li");

		// 엘리먼트의 이벤트 매니저를 만듭니다.
		// 이벤트 매니저의 전, 후의 형제 관계를 저장합니다.
		var before_event_manager = null;
		var cur_list_element_set_arr = []; // 메타 정보, 이벤트 매니저를 통합한 객체 배열.
		for (var idx = 0; idx < cur_list_row_jq_arr.length; idx++) {

			// 해당 열에 맞는 리스트 열 메타 정보 가져오기.
			var list_row_element = cur_list_row_jq_arr[idx];
			var list_row_element_jq = $(list_row_element);
			var list_row_element_id = list_row_element_jq.attr("id");
			var list_row_meta_info = null;

			for (var inner_idx = 0; inner_idx < cur_list_row_meta_info_arr.length; inner_idx++) {
				var cur_list_row_meta_info = cur_list_row_meta_info_arr[inner_idx];
				var cur_list_row_id = cur_list_row_meta_info.get_list_row_id();
				
				// 리스트의 열에 해당하는 메타 정보 객체를 가져옵니다.
				if(list_row_element_id == cur_list_row_id){
					list_row_meta_info = cur_list_row_meta_info;
					break;
				}
			}
			if(list_row_meta_info == null) continue;
			if(list_row_meta_info.get_is_editable() == false) continue;

			var element_meta_info = list_row_meta_info;

			element_meta_info.item_type = _obj.ITEM_TYPE_LIST;
			var event_manager_list_row_text = 
			_obj.get_element_event_manager(
				list_row_element_id
				, list_row_element_jq
				, element_meta_info
				, delegate_set_event_manager_prop_on_list_row
			);

			// 이벤트 매니저의 전, 후의 형제 관계를 저장합니다.
			if(before_event_manager != null){
				before_event_manager.set_after_sibling_event_manager(event_manager_list_row_text);	
				event_manager_list_row_text.set_before_sibling_event_manager(before_event_manager);
			}
			before_event_manager = event_manager_list_row_text;

			// event manager + element meta info => element set
			// element set + element set + ... => element collection set
			cur_element_collection_set.push_new_element_set(element_meta_info, event_manager_list_row_text);

			// set eject event
			event_manager_list_row_text.set_delegate_btn_eject_click(_obj.get_delegate(function(event_click, cur_event_manager){

				var jsm = cur_event_manager.get_element_set().get_element_collection_set().jump_spot_manager;

				// @ 기본 동작
				// 이벤트 전파를 막습니다.
				event_click.stopPropagation();
				// 다른 객체들의 이벤트를 받지 않도록 lock를 설정.
				var cur_event_hierarchy_manager = _obj.get_event_hierarchy_manager();
				cur_event_hierarchy_manager.lock();

				// 포커싱 모드로 바꿈.
				cur_event_manager.show_focusing_mode();
				
				

				var cur_element_jq = cur_event_manager.get_element_jq();

				// @ element collection settings
				var event_click_offset = {top:event_click.pageY,left:event_click.pageX};
				var clone_element_jq = jsm.boost_clone_element_jq(cur_element_jq, event_click_offset);
				// set round
				_obj.set_list_single_row_css_radius(clone_element_jq, _obj.LIST_ROW_RADIUS_NORMAL);
				var clone_element_offset = clone_element_jq.offset();

				var cur_mousemove_callback_set =
				cur_event_hierarchy_manager.add_mousemove_callback_set(_obj.get_delegate(function(mousemove_event, event_manager_on_mousemove){

					// 사용자가 선택한 윈도우의 이동
			        var cur_top = mousemove_event.pageY - jsm.gap;
			        var cur_left = mousemove_event.pageX - jsm.gap;

					clone_element_jq.offset({top:cur_top,left:cur_left});

					// 리스트 - 자신의 위, 아래의 형제 엘리먼트에 직접 검사
					// 테이블 - 자신이 속한 열의 위, 아래의 열에 검사

					// 사용자의 마우스 이동에 mouse over시 검사해서 over 이면 focusing 모드로 보여줍니다.
					cur_event_manager.get_element_set().get_element_collection_set().get_mouse_over_element(mousemove_event, event_manager_on_mousemove.get_all_sibling_element_set_arr());

					// 드래그하던 열을 클릭하면 충돌 검사를 통해 선택된 열 아래로 붙임.
					clone_element_jq.off();
					clone_element_jq.click(function(e){

						// console.log("드래그하던 열을 클릭하면 충돌 검사를 통해 선택된 열 아래로 붙임.");

						var cur_all_sibling_element_set_arr = event_manager_on_mousemove.get_all_sibling_element_set_arr();
						var cur_sibling_element_set_mouse_over = null;
						var mouse_over_checksum = null;
						for(var inner_idx = 0;inner_idx < cur_all_sibling_element_set_arr.length;inner_idx++){
							var cur_sibling_element_set = cur_all_sibling_element_set_arr[inner_idx];

							// 충돌 검사를 진행한다.
							mouse_over_checksum = jsm.show_mouse_over_element_set_top_n_bottom(mousemove_event, cur_sibling_element_set);

							// DEBUG
							// console.log("title for debug : ",cur_sibling_element_set.get_event_manager().get_title_jq_value());
							if(	cur_sibling_element_set.get_event_manager() != undefined && 
								"New Last Action" === cur_sibling_element_set.get_event_manager().get_title_jq_value()) {

								// console.log("mouse_over_checksum : ",mouse_over_checksum);

							}

							if(mouse_over_checksum.has_changed && mouse_over_checksum.is_hover_top){
								cur_sibling_element_set_mouse_over = cur_sibling_element_set;
								break;
							} else if(mouse_over_checksum.has_changed && mouse_over_checksum.is_hover_bottom){
								cur_sibling_element_set_mouse_over = cur_sibling_element_set;
								break;
							}
						}

						// 이제 선택한 영역의 아래로 엘리먼트를 추가합니다.
						// 부모를 옮기기 전의 절대좌표를 얻습니다.
						var _self_clone_jq = $(this);
						var prev_offset = _self_clone_jq.offset();

						if(cur_sibling_element_set_mouse_over != undefined){
							// view mode로 전환합니다.
							cur_sibling_element_set_mouse_over.get_event_manager().show_view_mode();

							if(mouse_over_checksum.is_hover_top){

								// event manager의 형제 관계를 다시 세팅합니다.
								// 사용자가 이동 중인 엘리먼트가 들어갈 위치의 아래쪽의 엘리먼트
								var new_after_sibling_event_manager = cur_sibling_element_set_mouse_over.get_event_manager();
								// 사용자가 이동 중인 엘리먼트가 들어갈 위치의 위쪽의 엘리먼트
								var new_before_sibling_event_manager = new_after_sibling_event_manager.get_before_sibling_event_manager();
								// element set, event manager의 형제 관계를 다시 세팅합니다. 
								cur_event_manager.set_before_n_after_siblings_event_manager(new_before_sibling_event_manager, new_after_sibling_event_manager);

								// 화면에 보이는 엘리먼트 위치를 실제로 변경합니다.
								// 사용자가 드래깅하는 클론과 실제 list row를 선택한 list row 위로 이동시킵니다.
								// console.log("이제 선택한 영역의 위로 엘리먼트를 추가합니다. / ",cur_sibling_element_set_mouse_over.get_meta_info().get_list_row_text());
								cur_sibling_element_set_mouse_over.get_event_manager().get_element_jq().before(cur_element_jq);
								cur_sibling_element_set_mouse_over.get_event_manager().get_element_jq().before(_self_clone_jq);

							} else {

								// event manager의 형제 관계를 다시 세팅합니다.
								// 사용자가 이동 중인 엘리먼트가 들어갈 위치의 아래쪽의 엘리먼트
								var new_before_sibling_event_manager = cur_sibling_element_set_mouse_over.get_event_manager();
								// 사용자가 이동 중인 엘리먼트가 들어갈 위치의 위쪽의 엘리먼트
								var new_after_sibling_event_manager = new_before_sibling_event_manager.get_after_sibling_event_manager();
								// element set, event manager의 형제 관계를 다시 세팅합니다.
								cur_event_manager.set_before_n_after_siblings_event_manager(new_before_sibling_event_manager, new_after_sibling_event_manager);

								// 화면에 보이는 엘리먼트 위치를 실제로 변경합니다.
								// 사용자가 드래깅하는 클론과 실제 list row를 선택한 list row 아래로 이동시킵니다.
								// console.log("이제 선택한 영역의 아래로 엘리먼트를 추가합니다. / ",cur_sibling_element_set_mouse_over.get_meta_info().get_list_row_text());
								cur_sibling_element_set_mouse_over.get_event_manager().get_element_jq().after(cur_element_jq);
								cur_sibling_element_set_mouse_over.get_event_manager().get_element_jq().after(_self_clone_jq);
								
							}
						}

						// 부모를 옮긴다음, 저장해둔 절대좌표로 설정해줍니다.
						_self_clone_jq.offset(prev_offset);

						// 엘리먼트 착륙 이후의 델리게이트 객체를 가져옵니다. 충돌 객체가 없는 경우, null을 넘겨 줍니다.
						var cur_delegate_callback_after_landing_element = null;
						if(cur_sibling_element_set_mouse_over != undefined){
							cur_delegate_callback_after_landing_element = 
							cur_sibling_element_set_mouse_over.get_event_manager().get_delegate_callback_after_landing_element();
						}

						jsm.land_element(
							// cur_src_jq
							cur_element_jq
							// cur_clone_jq
							, _self_clone_jq
							// eject_btn_jq
							, event_manager_on_mousemove.get_btn_eject_element_jq()
							// cur_mousemove_callback_set
							, cur_mousemove_callback_set
							// cur_element_set_on_mouse_over
							, cur_sibling_element_set_mouse_over
							// delegate_on_completed
							, cur_delegate_callback_after_landing_element
							// delegate_on_completed_param_event_manager
							, cur_event_manager
						); // animation end

						// 열 이동이 끝나면, element conllection set의 모든 element set의 
						// set_is_hover_top
						// set_is_hover_bottom
						// set_is_hover
						// false로 초기화한다.
						if(	event_manager_on_mousemove.get_element_set() != undefined && 
							event_manager_on_mousemove.get_element_set().get_element_collection_set() != undefined ) {
							event_manager_on_mousemove.get_element_set().get_element_collection_set().refresh_all_elemen_set_is_hover();	
						}

					}); // click event end

				}, this), cur_event_manager); // end mouse move call back
			}, this));			

		}

		// POST PROCESS
		// element collection set을 움직일 버튼을 지정.
		var cur_btn_collection_eject_jq = editable_list_jq.find("span#btn_collection_eject").first();
		cur_element_collection_set.ecs_set_btn_collection_eject_jq(cur_btn_collection_eject_jq);

		return cur_element_collection_set;
	}
	// @ Section : LIST PARSER
	// @ public
	// @ Desc : 타임라인 정보를 파싱해서 json str으로 변환
	,get_timeline_main_action_obj:function(cur_main_action_jq, target_jq){

		// 이 메서드는 리스트의 각 열에 이벤트를 설정합니다.
		// json str을 파싱하는 역할을 가지고 있지 않습니다.

		var _html = airborne.html;

		var __timeline_id = cur_main_action_jq.attr("__timeline_id");
		var __meeting_agenda_id = cur_main_action_jq.attr("__meeting_agenda_id");
		var __meeting_agenda_startdttm = cur_main_action_jq.attr("__meeting_agenda_startdttm");
		var __timeline_schedule_startdttm = cur_main_action_jq.attr("__timeline_schedule_startdttm");

		// 현재 타임라인의 스케쥴 시간.
		var cur_main_action_schedule_jq = cur_main_action_jq.find("span#__timeline_schedule").first();
		// 현재 타임라인의 스케쥴 내용.
		var cur_main_action_schedule_action_jq = cur_main_action_jq.find("span#__timeline_schedule_action").first();

		var cur_main_action_schedule = cur_main_action_schedule_jq.html();

		var cur_main_action_schedule_action = _html.getJSONStrSafeText(cur_main_action_schedule_action_jq.html());

		var cur_main_action_obj = {};
		cur_main_action_obj.schedule = cur_main_action_schedule;
		cur_main_action_obj.action_jq = cur_main_action_schedule_action_jq;
		cur_main_action_obj.action_name = cur_main_action_schedule_action;
		cur_main_action_obj.set_action_name = function(new_action_name){

			this.action_jq.html(new_action_name);
			this.action_name = _html.getJSONStrSafeText(new_action_name);

		}
		cur_main_action_obj.action_list = [];
		if(_v.isValidStr(__timeline_id)){
			cur_main_action_obj.__timeline_id = __timeline_id;	
		}
		cur_main_action_obj.__meeting_agenda_id = __meeting_agenda_id;
		cur_main_action_obj.__meeting_agenda_startdttm = __meeting_agenda_startdttm;
		cur_main_action_obj.__timeline_schedule_startdttm = __timeline_schedule_startdttm;
		cur_main_action_obj.__time_jq = cur_main_action_schedule_jq;

		if(target_jq != null && target_jq.length > 0){
			cur_main_action_obj.__clicked = (target_jq.context == cur_main_action_jq.context);	
		}

		var date_formatted_str = __meeting_agenda_startdttm.slice(0,8) + __timeline_schedule_startdttm.slice(8,__timeline_schedule_startdttm.length);
		cur_main_action_obj.__timeline_schedule_startdttm = date_formatted_str;
		cur_main_action_obj.__moment = moment(date_formatted_str,"YYYYMMDDHHmmss");

		cur_main_action_obj.set_minutes_after = function(offset_minutes){
			set_timeline_offset_minutes(this, this, offset_minutes);
		}
		cur_main_action_obj.set_minutes_before = function(offset_minutes){
			this.set_minutes_after(-1*offset_minutes);
		}

		// inner table
		// table#sub_action_table
		var sub_action_table_jq = cur_main_action_jq.find("table#sub_action_table").first();
		cur_main_action_obj.__sub_action_table_jq = sub_action_table_jq;

		return cur_main_action_obj;
	}	
	// @ Section : LIST TIMELINE UTIL
	// @ private
	// @ Desc : 타임라인을 맞바꾸는 function 객체
	,switch_timeline:function(first_timeline_obj, second_timeline_obj){
		var first_moment = first_timeline_obj.__moment;
		var second_moment = second_timeline_obj.__moment;
		set_timeline_obj(first_timeline_obj, second_moment);
		set_timeline_obj(second_timeline_obj, first_moment);
	}
	// @ private
	// @ Desc : 타임라인 객체의 정보를 설정하는 function 객체
	,set_timeline_obj:function(timeline_obj, cur_moment){
		timeline_obj.__moment = cur_moment;
		timeline_obj.__timeline_schedule_startdttm = timeline_obj.__moment.format("YYYYMMDDHHmmss")
		timeline_obj.schedule = timeline_obj.__moment.format("HH:mm")
		timeline_obj.__time_jq.html(timeline_obj.schedule);
	}
	// @ private
	// @ Desc : 두 타임라인 사이의 시간을 구하는 function 객체
	,set_timeline_inbetween:function(first_timeline_obj, second_timeline_obj, inbetween_timeline_obj){

		var first_moment = first_timeline_obj.__moment;
		var second_moment = second_timeline_obj.__moment;
		var inbetween_moment = inbetween_timeline_obj.__moment;

		var __diff = second_moment.diff(first_moment, 'minutes');
		var __offset = Math.round(__diff/2);

		var first_moment_clone = first_moment.clone();
		first_moment_clone.add(__offset, "minutes");

		var new_inbetween_moment = moment(first_moment_clone.format("YYYYMMDDHHmmss"),"YYYYMMDDHHmmss");
		set_timeline_obj(inbetween_timeline_obj, new_inbetween_moment);
	}
	// @ private
	// @ Desc : 사용자가 입력한 시간차이만큼 변경시켜주는 function 객체
	,set_timeline_offset_minutes:function(target_timeline_obj, offset_timeline_obj, offset_minutes){
		var target_moment = target_timeline_obj.__moment;
		var new_offset_moment = _dates.get_moment_minutes_offset(target_moment, offset_minutes);
		set_timeline_obj(offset_timeline_obj, new_offset_moment);
	}

	//     dMMMMb  .aMMMb  dMMMMb  .dMMMb  dMMMMMP         dMMMMb        .dMMMb  dMP dMP dMMMMb  dMMMMMMMMb dMP dMMMMMMP 
	//    dMP.dMP dMP"dMP dMP.dMP dMP" VP dMP             dMP dMP       dMP" VP dMP dMP dMP"dMP dMP"dMP"dMPamr    dMP    
	//   dMMMMP" dMMMMMP dMMMMK"  VMMMb  dMMMP           dMP dMP        VMMMb  dMP dMP dMMMMK" dMP dMP dMPdMP    dMP     
	//  dMP     dMP dMP dMP"AMF dP .dMP dMP             dMP dMP       dP .dMP dMP.aMP dMP.aMF dMP dMP dMPdMP    dMP      
	// dMP     dMP dMP dMP dMP  VMMMP" dMMMMMP         dMP dMP        VMMMP"  VMMMP" dMMMMP" dMP dMP dMPdMP    dMP       
	// @ private
	// @ Desc : 타임라인 객체 정보를 수용할 json format obj를 반환합니다.
	,get_json_format_obj:function(__action_name, __action_list, __add_on_obj_list, __time_sec, __is_shy){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.is_not_valid_str(__action_name)) {
			console.log("!Error! / view.obj.list / get_json_format_obj / _v.is_not_valid_str(__action_name)");
			return;
		}
		if(__action_list == undefined){
			__action_list = [];
		}
		if(__add_on_obj_list == undefined){
			__add_on_obj_list = [];
		}
		if(__time_sec == undefined){
			__time_sec = 0;
		}
		if(__is_shy == undefined){
			__is_shy = false;
		}

		// json format
		var json_format_obj = {
			// 자식 객체들의 json 객체 정보를 담은 배열
			__action_list:__action_list
			// 자신의 action name
			,__action_name:__action_name
			// 자신의 추가 정보들
			,__prop_map:{
				// 자신 안에 포함될 외부 element collection set의 id 배열
				__add_on_obj_list:__add_on_obj_list
				// 자신의 시간 정보 (hh_mm_ss, hh_mm, mm_ss)를 공통으로 초로 표현합니다.
				,__time_sec:__time_sec
				// shy row 여부. shy row 라면 추가 입력열이 가질 기본값 설정이 필요.
				,__is_shy:__is_shy
			}
			// @ public
			// @ desc : 리스트의 json 객체를 이중 배열로 돌려줍니다. element collection set에서 호출하게 됩니다.
			, get_json_format_obj_arr_from_element_collection_set:function() {

				// json_format_obj 내부에 상, 하 관계 참조가 가능해야 함.

				//return this.get_json_format_obj_from_list();
			}
		}

		return json_format_obj;
	}
	// @ public
	// @ Desc : src_element_collection_set에서 저장된 json format 데이터로 자신 내부에 포함될 element collection set을 골라 집어 넣습니다.
	,set_add_on_json_format_on_list:function(src_element_collection_set, target_element_collection_set_arr){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(src_element_collection_set == undefined){
			console.log("!Error! / airborne.view.obj.list / set_add_on_json_format_on_list / src_element_collection_set == undefined");
			return;
		}

		if(_v.is_not_valid_array(target_element_collection_set_arr)){
			console.log("!Error! / airborne.view.obj.list / set_add_on_json_format_on_list / _v.is_not_valid_array(target_element_collection_set_arr)");
			return;
		}

		var delegate_do_to_all_element_set = _obj.get_delegate(function(cur_element_set){

			var action_info = cur_element_set.get_meta_info().get_prop_map();

			var add_on_obj_list;
			if( action_info != undefined && 
				action_info.__prop_map != undefined && 
				_v.is_valid_array(action_info.__prop_map.__add_on_obj_list)) {

				add_on_obj_list = action_info.__prop_map.__add_on_obj_list;
			}

			if(_v.is_valid_array(add_on_obj_list)){
				var inner_idx;
				var inner_length = add_on_obj_list.length;
				for(inner_idx = 0; inner_idx < inner_length; inner_idx++){
					var cur_add_on_selector_id = add_on_obj_list[inner_idx].id;

					// 가져온 타겟 엘리먼트 중에 해당하는 selector id가 있는지 확인합니다.
					var target_idx;
					var target_length = target_element_collection_set_arr.length;
					for(target_idx = 0; target_idx < target_length; target_idx++){
						var target_element_collection_set = target_element_collection_set_arr[target_idx];

						// 맞다면 해당 element set에 target element collection set을 넣습니다.
						if(target_element_collection_set == undefined) {
							console.log("!Error! / airborne.view.obj.list / delegate_do_to_all_element_set / target_element_collection_set == undefined");
							return;
						} else if(cur_add_on_selector_id == target_element_collection_set.get_element_collection_id()){
							cur_element_set.get_event_manager().push_add_on_element_collection_set(target_element_collection_set);
						}
					} // target for end

				} // inner for end
			}			

		},this);
		var cur_event_manager = src_element_collection_set.get_element_set_arr()[0].get_event_manager();

		// element collection set의 부모, 형제, 자식 element set에게 delegate 함수를 실행하도록 합니다.
		cur_event_manager.call_delegate_do_to_all_element_set(src_element_collection_set, delegate_do_to_all_element_set);
	}

	// @ private
	// @ Desc : 사용자가 수정한 타임라인 객체를 json str으로 변경해준다. 재귀 호출로 자식 객체의 정보 역시 json str으로 변환해줍니다.
	// @ scope
	,parse_list_element_recursive:function(cur_element_set_collection){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _html = airborne.html;
		var consoler = airborne.console.get();
		consoler.off();

		if(cur_element_set_collection == undefined){
			return "";
		}

		var cur_element_set_arr = cur_element_set_collection.get_element_set_arr();
		if(_v.is_not_valid_array(cur_element_set_arr)){
			return "";
		}

		var cur_ecs_id = cur_element_set_collection.get_element_collection_id();

		consoler.say("");
		consoler.say("pler / 0 / cur_element_set_collection : ",cur_element_set_collection);
		cur_element_set_collection.say_element_set_arr(consoler.isShow);
		consoler.say("pler / 0 / " + cur_ecs_id);

		// 자신의 element collection set의 모든 정보를 json str으로 변환한다.
		var json_format_obj_arr = [];
		var idx;
		var length = cur_element_set_arr.length;
		var json_format_obj = null;
		for(idx = 0;idx < length;idx++){
			json_format_obj = null;
			var cur_element_set = cur_element_set_arr[idx];
			var cur_event_manager = cur_element_set.get_event_manager();
			var cur_element_type = cur_event_manager.get_element_type();
			var cur_element_id = cur_event_manager.get_title_jq_value();

			consoler.say("");
			consoler.say("pler / 1 / " + cur_ecs_id);
			consoler.say("pler / 1 / idx : " + idx);

			// shy mode인 엘리먼트는 포함되지 않습니다.
			if(cur_element_set.get_meta_info().get_is_shy()) {
				consoler.say("pler / 1 / shy mode인 엘리먼트는 포함되지 않습니다.");
				continue;
			}

			
			// 자식 객체 정보를 가져옵니다.		/	child element collection set
			var __action_list = [];
			var cur_children_element_collection_set_arr = cur_element_set.get_children_element_collection_set_arr();
			if(_v.is_valid_array(cur_children_element_collection_set_arr)){
				var inner_idx;
				var inner_length = cur_children_element_collection_set_arr.length;
				var json_format_obj = null;
				for(inner_idx = 0;inner_idx < inner_length;inner_idx++){
					var cur_child_element_collection_set = cur_children_element_collection_set_arr[inner_idx];
					var cur_child_ecs_id = cur_child_element_collection_set.get_element_collection_id();
					var cur_child_json_format_arr = this.parse_list_element_recursive(cur_child_element_collection_set);

					if(_v.is_not_valid_array(cur_child_json_format_arr)) {
						continue;
					}

					consoler.say("pler / 2 / " + cur_ecs_id);
					consoler.say("pler / 2 / idx : " + idx);
					consoler.say("pler / 2 / inner_idx : " + inner_idx);
					consoler.say("pler / 2 / cur_child_ecs_id : ",cur_child_ecs_id);
					consoler.say("pler / 2 / cur_child_element_collection_set : ",cur_child_element_collection_set);
					consoler.say("pler / 2 / cur_child_json_format_arr : ",cur_child_json_format_arr);

					__action_list.push(cur_child_json_format_arr);
				}
			}

			// 추가 객체 정보를 가져옵니다.		/	additional element collection set
			var __add_on_obj_list = [];
			var cur_add_on_element_collection_set_arr = cur_event_manager.get_add_on_element_collection_set_arr();
			if(_v.is_valid_array(cur_add_on_element_collection_set_arr)){
				
				var inner_idx;
				var inner_length = cur_add_on_element_collection_set_arr.length;
				var json_format_obj = null;
				for(inner_idx = 0;inner_idx < inner_length;inner_idx++){

					var cur_add_on_element_collection_set = cur_add_on_element_collection_set_arr[inner_idx];
					var cur_add_on_ecs_id = cur_add_on_element_collection_set.get_element_collection_id();
					var cur_json_format_obj_arr = cur_add_on_element_collection_set.get_json_format_obj_arr();

					consoler.say("pler / 3 / " + cur_ecs_id);
					consoler.say("pler / 3 / idx : " + idx);
					consoler.say("pler / 3 / inner_idx : " + inner_idx);
					consoler.say("pler / 3 / cur_add_on_ecs_id : ",cur_add_on_ecs_id);
					consoler.say("pler / 3 / cur_json_format_obj_arr : ",cur_json_format_obj_arr);

					__add_on_obj_list.push({
						id:cur_add_on_element_collection_set.get_element_collection_id()
						, json_format_obj_arr:cur_json_format_obj_arr
					});
				}
			}
			


			if(_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT === cur_element_type){

				var __action_name = cur_event_manager.get_title_jq_untouched_value();
				var __time_sec = _dates.get_seconds_from_hh_mm(cur_event_manager.get_time_jq().html());

				consoler.say("pler / 4-1 / " + cur_ecs_id);
				consoler.say("pler / 4-1 / idx : " + idx);
				consoler.say("pler / 4-1 / __action_name : ",__action_name);

				json_format_obj = 
				this.get_json_format_obj(
					// __action_name
					__action_name
					// __action_list
					, __action_list
					// __add_on_obj_list
					, __add_on_obj_list
					// __time_sec
					, __time_sec
				);

			} else if(_obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT === cur_element_type){

				var __action_name = cur_event_manager.get_title_jq_untouched_value();

				consoler.say("pler / 4-2 / " + cur_ecs_id);
				consoler.say("pler / 4-2 / idx : " + idx);
				consoler.say("pler / 4-2 / __action_name : ",__action_name);

				json_format_obj = 
				this.get_json_format_obj(
					// __action_name
					__action_name
					// __action_list
					, __action_list
					// __additional_selector_id
					, __add_on_obj_list
					// __time_sec
					, ""
				);

			} else {
				console.log("!Warning! / pler / 지원하는 타입이 아닙니다.");
			}

			if(json_format_obj != undefined){
				json_format_obj.__action_name = _html.getSQLSafeText(json_format_obj.__action_name);
				json_format_obj_arr.push(json_format_obj);
			}

			// if(json_format_obj.__action_name == "Toastmaster") {
			// 	console.log(">>> json_format_obj : ",json_format_obj);	
			// }
		}

		return json_format_obj_arr;

	}
	// @ private
	// @ Desc : 사용자가 수정한 타임라인을 json str으로 변경해준다. 이 데이터를 DB에 저장한다.
	,parse_list_to_json_str:function(cur_element_event_manager){

		if(cur_element_event_manager == undefined) {
			console.log("!Error! / airborne.view.obj.list / parse_list_to_json_str / cur_element_event_manager == undefined");
			return;
		}

		// 1. 부모, 자식, 형제 관계를 element set 기반으로 탐색 가능
		// 1-1. 최상위 부모 객체를 찾아내서 차례대로 순환, JSON 객체르 변환한다. - Recursive 함수 필요.

		// 1-1-1. 최상위 부모 객체를 찾는다.
		var top_parent_element_set_collection = cur_element_event_manager.get_top_parent_element_collection_set(cur_element_event_manager);
		if(top_parent_element_set_collection == undefined) {
			console.log("!Error! / airborne.view.obj.list / parse_list_to_json_str / top_parent_element_set_collection == undefined");
		}

		var json_format_obj_arr = this.parse_list_element_recursive(top_parent_element_set_collection);

		// JSON-stringify and url-encoding
		var timeline_json_str = JSON.stringify(json_format_obj_arr);

		return timeline_json_str;
	}
}