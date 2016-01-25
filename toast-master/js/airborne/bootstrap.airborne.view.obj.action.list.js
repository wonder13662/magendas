airborne.bootstrap.view.obj.__action_list = {
	/*
		@ Section : LIST PROPERTIES
	*/
	LIST_ROW_TEXT_TYPE_NORMAL:"normal"
	,LIST_ROW_TEXT_TYPE_BOLD:"bold"
	,is_valid_list_row_text_type:function(list_row_text_type){
		if(_v.isNotValidStr(list_row_text_type)){
			return false;
		}

		if(	this.LIST_ROW_TEXT_TYPE_NORMAL != list_row_text_type && 
			this.LIST_ROW_TEXT_TYPE_BOLD != list_row_text_type){
			return false;
		}

		return true;
	}
	,is_not_valid_list_row_text_type:function(list_row_text_type){
		return !this.is_valid_list_row_text_type(list_row_text_type);
	}
	,COLOR_TYPE_LIST_ROW_WHITE:"list-group-item-default"
	,COLOR_TYPE_LIST_ROW_GREEN:"list-group-item-success"
	,COLOR_TYPE_LIST_ROW_BLUE:"list-group-item-info"
	,COLOR_TYPE_LIST_ROW_YELLOW:"list-group-item-warning"
	,COLOR_TYPE_LIST_ROW_RED:"list-group-item-danger"
	,is_valid_color_type_list_row:function(color_type) {

		if(color_type == undefined) {
			return false;
		}

		if(	color_type != this.COLOR_TYPE_LIST_ROW_WHITE &&
			color_type != this.COLOR_TYPE_LIST_ROW_GREEN &&
			color_type != this.COLOR_TYPE_LIST_ROW_BLUE &&
			color_type != this.COLOR_TYPE_LIST_ROW_YELLOW &&
			color_type != this.COLOR_TYPE_LIST_ROW_RED	){

			return false;
		}

		return true;
	}	
	,is_not_valid_color_type_list_row:function(color_type) {
		return !this.is_valid_color_type_list_row(color_type);
	}
	/*
		@ public
		@ scope : view list
		@ Desc : 화면에 리스트를 추가합니다. action_list로 규격화된 정보를 입,출력합니다.
		사용자가 세팅할 것은 오직 LIST ELEMENT TYPE만 배열로 세팅해줍니다.
	*/
	,add_editable_action_list:function(action_list, parent_element_set, list_container_jq, delegate_on_event) {

		if(_action.is_not_valid_action_collection_data_obj(action_list)) {
			console.log("!Error! / add_editable_action_list / _action.is_not_valid_action_collection_data_obj(action_list)");
			return;
		}
		if(list_container_jq == undefined) {
			console.log("!Error! / add_editable_action_list / list_container_jq == undefined");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_on_event)){
			console.log("!Error! / add_editable_action_list / _obj.isNotValidDelegate(delegate_on_event)");
			return;
		}

		var cur_first_child_action_item = action_list.get_first_child();
		if(_action.is_not_valid_action_item_obj(cur_first_child_action_item)) {
			console.log("!Error! / add_editable_action_list / _action.is_not_valid_action_item_obj(cur_first_child_action_item)");
			return;
		}

		var consoler = airborne.console.get();
		// consoler.off();

		// DEBUG
		var list_title = action_list.get_action_name();
		var msg = 
		"add_editable_action_list / <list_title>"
		.replace(/\<list_title\>/gi, list_title)
		;
		consoler.say(msg, action_list);

		if(action_list.has_no_parent()) {
			cur_color_type=_action_list.COLOR_TYPE_LIST_ROW_YELLOW;
		} else {
			cur_color_type=_action_list.COLOR_TYPE_LIST_ROW_WHITE;
		}

		var is_editable_list_action = false;
		var is_fixed_row_action = false;

		var delegate_add_list_row_info = this.get_delegate_add_list_row_info(action_list);
		var delegate_add_element = this.get_delegate_add_element(parent_element_set, list_container_jq, delegate_on_event, cur_color_type, delegate_add_list_row_info);

		// 3-0. 엘리먼트 자신과 자식의 속성 정보를 element collection set에 등록합니다.
		// 나중에 자신의 형제열 혹은 자신의 자식 열을 추가할 때 필요한 정보입니다.
		var cur_element_collection_set = 
		delegate_add_element._func.apply(delegate_add_element._scope,[action_list, delegate_add_element]);
		if(cur_element_collection_set == undefined) {
			console.log("!Error! / add_editable_action_list / cur_element_collection_set == undefined");
			return;
		}

		var has_children = action_list.has_children();
		var has_add_on_list = action_list.has_add_on_list();
		// 자식 객체가 없다면 중단합니다.
		if(action_list.has_no_children()) return;

		// 3-1. children_action_collection
		// 4. 자신의 자식들에 대한 메타 정보를 넘깁니다.
		// 이때, 자신의 element collection set을 넘겨서 관련된 참조를 연결해줍니다.
		// 4-2. 실제로 화면에서 보여줘야 할 리스트의 element collection set을 만듭니다.
		var cur_element_set_arr = cur_element_collection_set.get_element_set_arr();
		var length = cur_element_set_arr.length;
		for(var idx = 0; idx < length; idx++){
			var cur_element_set = cur_element_set_arr[idx];

			var cur_action_item_obj = cur_element_set.get_action_item_obj();
			if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
				console.log("!Error! / add_editable_action_list / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
				return;
			}

			// DEBUG
			var msg = 
			"add_editable_action_list / <list_title> / <idx> / cur_action_item_obj / "
			.replace(/\<list_title\>/gi, list_title)
			.replace(/\<idx\>/gi, idx)
			;
			consoler.say(msg, cur_action_item_obj);

			if(cur_action_item_obj.get_action_is_shy()) {
				// 자신이 shy mode 인 경우는 자식 객체를 추가하지 않는다.
				continue;
			}

			var cur_action_list_list = cur_action_item_obj.get_children();
			var cur_action_add_on_list = cur_action_item_obj.get_add_on_list();
			var cur_action_item_name = cur_action_item_obj.get_action_name();
			console.log(cur_action_item_name + " / READY / ",cur_action_item_obj);
			if(cur_action_item_obj.has_children()) {

				// 4-2-1. 일반적인 자식 객체를 가지고 있는 경우, 화면에 표시

				console.log(cur_action_item_name + " / has_children :: " + cur_action_item_obj.has_children());

				var inner_idx;
				var inner_length = cur_action_list_list.length;
				for(inner_idx = 0; inner_idx < inner_length; inner_idx++){

					var cur_action_list = cur_action_list_list[inner_idx];
					if(_action.is_not_valid_action_collection_data_obj(cur_action_list)) {
						console.log("!Error! / add_editable_action_list / _action.is_not_valid_action_collection_data_obj(cur_action_list)");
						return;
					}

					var cur_list_title = cur_action_list.get_action_name();
					if(_action.is_not_valid_action_collection_data_obj(cur_action_list)) {
						console.log("!Error! / add_editable_action_list / _action.is_not_valid_action_collection_data_obj(cur_action_list)");
						return;
					}
					if(_v.is_not_valid_str(cur_list_title)) {
						console.log("!Error! / add_editable_action_list / _v.is_not_valid_str(cur_list_title) / " + cur_list_title);
						return;
					}

					// DEBUG
					var msg = 
					"add_editable_action_list / list_title :: <list_title>  / idx :: <idx> / inner_idx :: <inner_idx> / cur_list_title :: <cur_list_title>"
					.replace(/\<list_title\>/gi, list_title)
					.replace(/\<idx\>/gi, idx)
					.replace(/\<inner_idx\>/gi, inner_idx)
					.replace(/\<cur_list_title\>/gi, cur_list_title)
					;
					consoler.say(msg, cur_action_list);

					// wonder.jung
					this.add_editable_action_list(
						// action_list
						cur_action_list
						// parent_element_set
						, cur_element_set
						// list_container_jq
						, cur_element_set.get_event_manager().get_children_element_container_jq()
						// delegate_on_event
						, delegate_on_event
					);
				} // inner for end					

			} else if(cur_action_item_obj.has_add_on_list()){

				// 4-2-2. 사용자에 의해 주입된 엘리먼트. add on인 경우의 화면 표시.

				console.log(cur_action_item_name + " / has_add_on_list :: " + cur_action_item_obj.has_add_on_list());
				console.log("cur_action_add_on_list :: ",cur_action_add_on_list);

				var inner_idx;
				var inner_length = cur_action_add_on_list.length;
				for(inner_idx = 0; inner_idx < inner_length; inner_idx++){
					var cur_action_add_on_obj = cur_action_add_on_list[inner_idx];
					var cur_action_add_on_obj_name = cur_action_add_on_obj.get_action_name();

					if(cur_action_add_on_obj.is_list()) {
						// 1. add on list
						console.log("1. add on list / " + cur_action_add_on_obj_name + " / Not Implemented!");

					} else if(cur_action_add_on_obj.is_table()) {
						// 2. add on table
						console.log("2. add on table / " + cur_action_add_on_obj_name);

						var cur_element_jq = cur_action_item_obj.get_event_manager().get_element_jq();
						console.log(">>> cur_element_jq :: ",cur_element_jq);
						console.log(">>> _action_list :: ",_action_list);
						console.log(">>> _action_table :: ",_action_table);

						_action_table.add_editable_table_from_action_table(
							// parent_jq
							cur_element_jq
							// action_table_obj
							, cur_action_add_on_obj
							// delegate_on_event
							, delegate_on_event
						);

					} // if end

				} // inner for end

			}
			// wonder.jung11

			// DEBUG
			// REMOVE ME
			/*
			var msg = 
			"add_editable_action_list / <list_title> / <idx> / cur_action_list_list / "
			.replace(/\<list_title\>/gi, list_title)
			.replace(/\<idx\>/gi, idx)
			;
			consoler.say(msg, cur_action_list_list);

			if(_v.is_not_valid_array(cur_action_list_list)){
				continue;
			}
			*/

			// DEBUG
			var msg = 
			"add_editable_action_list / <list_title> / <idx> / 내부의 자식 객체가 있는 경우. / "
			.replace(/\<list_title\>/gi, list_title)
			.replace(/\<idx\>/gi, idx)
			;
			consoler.say(msg, cur_action_list_list);

		} // for end			


		return cur_element_collection_set;
	}	
	/*
		@ private
		@ Desc : list row 의 meta info를 가져오는 delegate 메서드
	*/
	,get_delegate_add_list_row_info:function(action_list) {

		if(_action.is_not_valid_action_collection_data_obj(action_list)) {
			console.log("!Error! / get_delegate_add_list_row_info / _action.is_not_valid_action_collection_data_obj(action_list)");
			return;
		}

		//  action_list
		var _self = this;
		var delegate_add_list_row_info = 
		_obj.get_delegate(function(cur_action_obj){

			return _self.get_editable_list_input_text_row_from_action_item(action_list);

		},this);

		return delegate_add_list_row_info;
	}
	/*
		@ Public
		@ Desc : 리스트에 열을 추가할 경우, 타이틀을 보여줍니다. 수정/편집이 가능합니다.
	*/	
	,get_editable_list_input_text_row_from_action_item:function(action_list){

		// Legacy - get_editable_list_input_text_row_from_action_item

		if(_action.is_not_valid_action_collection_data_obj(action_list)) {
			console.log("!Error! / get_delegate_add_list_row_info / _action.is_not_valid_action_collection_data_obj(action_list)");
			return;
		}

		var list_row_id = _html.get_id_auto_increase("editable_list_row_input");
		var list_row_text_type = this.LIST_ROW_TEXT_TYPE_BOLD;

		return this.get_editable_list_row_obj(list_row_id, list_row_text_type, action_list);
	}
	/*
		@ Private
		@ Desc : 리스트에 열을 추가할 경우, 필요한 기본적인 정보들을 설정해줍니다.
	*/
	,get_editable_list_row_obj:function(list_row_id, list_row_text_type, action_list){

		// Legacy - get_editable_list_row_obj

		if(_v.isNotValidStr(list_row_id)){
			console.log("!Error! / get_editable_list_row_obj / _v.isNotValidStr(list_row_id)");
			return;
		}
		if(this.is_not_valid_list_row_text_type(list_row_text_type)){
			list_row_text_type = this.LIST_ROW_TEXT_TYPE_NORMAL;
		}
		if(_action.is_not_valid_action_collection_data_obj(action_list)) {
			console.log("!Error! / get_editable_list_row_obj / _action.is_not_valid_action_collection_data_obj(action_list)");
			return;
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
			,get_list_row_text:function(){
				var cur_action_list = this.get_action_list();
				return cur_action_list.get_action_name();
			}
			,delegate_input_validation:null	
			,set_delegate_input_validation:function(delegate_input_validation){
				if(_obj.isNotValidDelegate(delegate_input_validation)){
					console.log("!Error! / editable_list_row_obj / _obj.isNotValidDelegate(delegate_input_validation)");
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
			,action_list:action_list
			,get_action_list:function() {
				return this.action_list;
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
					console.log("!Error! / get_editable_list_row_obj / editable_list_row_obj / this.is_not_valid_element_type(cur_element_type)");
					return false;
				}

				return _obj.is_editable_element_type(cur_element_type);
			}
			,get_is_shy:function(){
				var cur_action_list = this.get_action_list();
				return cur_action_list.get_action_is_shy();
			}
			,set_is_shy:function(is_shy){
				var cur_action_list = this.get_action_list();
				cur_action_list.set_action_is_shy(is_shy);
			}
			,element_type:received_element_type
			,get_element_type:function(){
				var cur_action_list = this.get_action_list();
				return cur_action_list.get_element_type();
			}
		};

		return editable_list_row_obj;
	}
	/*
		@ private
		@ Desc : 빈 action list의 element collection set을 만듭니다. shy element나 새로운 자식 열을 추가할 때 사용합니다.
	*/
	,get_delegate_add_element:function(parent_element_set, list_container_jq, delegate_on_event, color_type, delegate_add_list_row_info) {

		var delegate_add_element = 
		_obj.get_delegate(function(action_list, cur_delegate_add_element){

			if(_action.is_not_valid_action_collection_data_obj(action_list)) {
				console.log("!Error! / delegate_add_element / _action.is_not_valid_action_collection_data_obj(action_list)");
				return;
			}

			var editable_list_meta_info_action_obj = 
			_action_list.get_editable_list_meta_info_obj(
				// delegate_add_list_row_info 	/ 타임라인 열 메타 정보 작성
				delegate_add_list_row_info
				// action list
				, action_list
			);
			if(editable_list_meta_info_action_obj == undefined) {
				console.log("!Error! / delegate_add_element / editable_list_meta_info_action_obj == undefined");
				return;
			}


			// 리스트를 화면에 그립니다.
			// element collection set을 만듭니다.
			var cur_element_collection_set = 
			_action_list.add_editable_list(
				// list_container_jq
				list_container_jq
				// editable_list_meta_info_obj
				, editable_list_meta_info_action_obj
				// delegate_on_event
				, delegate_on_event
				// color_type
				, color_type
			);

			if(cur_element_collection_set == undefined) {
				console.log("!Error! / delegate_add_element / cur_element_collection_set == undefined");
				return;
			}
			cur_element_collection_set.set_delegate_add_element(cur_delegate_add_element);

			if(parent_element_set != undefined){

				var cur_first_child = action_list.get_first_child();
				if(cur_first_child.get_action_is_shy()) {
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
		@ Section : LIST META INFO
		@ public
		@ Desc : 리스트 속성을 정의하는 객체를 만듭니다.
	*/
	,get_editable_list_meta_info_obj:function(delegate_add_list_row_info, action_list){

		if(delegate_add_list_row_info == undefined){
			console.log("!Error! / get_editable_list_meta_info_obj / delegate_add_list_row_info == undefined");
			return null;
		}
		if(_action.is_not_valid_action_collection_data_obj(action_list)) {
			console.log("!Error! / delegate_add_element / _action.is_not_valid_action_collection_data_obj(action_list)");
			return;
		}

		var is_editable_title = false;
		var is_fixed_row = false;

		var editable_list_meta_info_obj = {
			list_title:""
			,get_list_title:function(list_title){
				var cur_action_list = this.get_action_list();
				return cur_action_list.get_action_name();
			}
			,set_list_title:function(list_title){
				var cur_action_list = this.get_action_list();
				cur_action_list.set_action_name(list_title);
			}
			,event_manager:null
			,set_event_manager:function(event_manager){
				this.event_manager = event_manager;
			}
			,get_event_manager:function(){
				return this.event_manager;
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
			,action_list:action_list
			,get_action_list:function() {
				return this.action_list;
			}
			,get_action_list_item:function(specific_idx) {
				if(!(specific_idx > -1)) {
					return null;
				}
				return this.action_list.get_child(specific_idx);
			}
			,get_element_type:function(){
				var cur_first_child = get_action_list.get_first_child();
				if(_action.is_not_valid_action_item_obj(cur_first_child)) {
					console.log("!Error! / get_element_type / _action.is_not_valid_action_item_obj(cur_first_child)");
					return;
				}

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

		return editable_list_meta_info_obj;
	}
	// @ Section : LIST ELEMENT DRAWING & EVENT
	// @ public
	// @ Desc : 화면에 리스트 엘리먼트를 추가합니다. 특정 리스트의 특정 인덱스에 아이템을 추가할 수 있습니다. action item obj가 완성된 형태의 데이터를 나타냅니다.
	,add_editable_list_element:function(target_element_collection_set, action_item_obj, color_type){

		if(target_element_collection_set == undefined) {
			console.log("!Error! / add_editable_list_element / target_element_collection_set == undefined");
			return;
		}
		if(_action.is_not_valid_action_item_obj(action_item_obj)) {
			console.log("!Error! / add_editable_list_element / _action.is_not_valid_action_item_obj(action_item_obj)");
			return;
		}
		if(this.is_not_valid_color_type_list_row(color_type)) {
			console.log("!Error! / add_editable_list_element / this.is_not_valid_color_type_list_row(color_type)");
			return;
		}

		// DEBUG
		// console.log("DEBUG / title : ",editable_list_row_obj.get_list_row_text());
		// console.log("DEBUG / editable_list_row_obj : ",editable_list_row_obj);

		var editable_list_row_id = airborne.html.get_id_auto_increase(action_item_obj.get_coordinate());
		var editable_list_row_title = _html.get_id_auto_increase(action_item_obj.get_action_name());
		var editable_list_row_inner_table_selector = "";

		// 아무것도 없는 항목의 추가 버튼이 마우스 오버시 나타나는 경우, 아래 조건으로 제어.
		var time_xx_yy = "";
		if( action_item_obj.is_item_title_n_time_hh_mm() ){

			var cur_time_hh_mm_obj = action_item_obj.get_time_hh_mm_obj();
			if(cur_time_hh_mm_obj == undefined) {
				console.log("!Error! / add_editable_list / cur_time_hh_mm_obj == undefined");
				return;
			}
			time_xx_yy = cur_time_hh_mm_obj.time_hh_mm;

		} else if( action_item_obj.is_item_title_n_time_mm_ss() ){

			console.log("!Error! / add_editable_list / Need to implement!");

		}

		var parent_action_list_obj = action_item_obj.get_parent();
		if(_action.is_not_valid_action_collection_data_obj(parent_action_list_obj)) {
			console.log("!Error! / add_editable_list_element / _action.is_not_valid_action_collection_data_obj(parent_action_list_obj)");
			return;
		}
		var cur_children_cnt = parent_action_list_obj.get_children_cnt();

		var editable_list_tag = ""
		+ "<li class=\"list-group-item  <color_type>\" id=\"<editable_list_row_id>\" type=\"editable_list_row\" idx=\"<row_idx>\" is_first=\"<is_first>\" is_last=\"<is_last>\" event_manager_id=\"<event_manager_id>\" inner_table_selector_id=\"<inner_table_selector_id>\" is_shy=\"<is_shy>\" style=\"<style>\" element_type=\"<element_type>\">"
			.replace(/\<editable_list_row_id\>/gi, editable_list_row_id)
			.replace(/\<is_first\>/gi, action_item_obj.is_first())
			.replace(/\<is_last\>/gi, action_item_obj.is_last())
			.replace(/\<event_manager_id\>/gi, "")
			.replace(/\<inner_table_selector_id\>/gi, editable_list_row_inner_table_selector)
			.replace(/\<color_type\>/gi, color_type)
			.replace(/\<is_shy\>/gi, action_item_obj.get_action_is_shy())
			.replace(/\<style\>/gi, (action_item_obj.get_action_is_shy())?"display:none;":"")
			.replace(/\<element_type\>/gi, action_item_obj.get_element_type())
			// 시간을 나타냄. 초기값은 display:none;
			+ "<span id=\"time\" class=\"badge airborne_add_on\" style=\"float:left;display:none;\" tossed_time=\"<tossed_time>\">".replace(/\<tossed_time\>/gi, time_xx_yy)
			+ time_xx_yy
			+ "</span>"
		;

		var title_style = "";
		if(action_item_obj.is_item_title_n_time_hh_mm()) {
			title_style = "padding-left:10px;";
		}
		editable_list_tag += ""
		// 사용자가 입력한 타이틀을 나타냄. 시간 표시가 있을 경우 우측 패딩을 추가.
		+ "<span id=\"title\" style=\"<style>\" tossed_value=\"<tossed_value>\"><_v></span>"
			.replace(/\<_v\>/gi, action_item_obj.get_action_name())
			.replace(/\<tossed_value\>/gi, action_item_obj.get_action_name())
			.replace(/\<style\>/gi, title_style)
		;

		// 내부 버튼설정
		editable_list_tag += ""
			// 수정을 하기 위한 버튼들
			+ "<div id=\"btn_eject\" style=\"height:20px;width:20px;float:right;height:32px;width:32px;top:-6px;position:relative;border-radius:4px;margin-left:4px;padding-left:10px;display:none;\">"
				+ "<span id=\"btn_eject\" class=\"glyphicon glyphicon-move\" style=\"position:relative;top:9px;left:0px;\"></span>"
			+ "</div>"
			
			+ "<div id=\"btn_remove\" style=\"float:right;height:32px;width:32px;top:-6px;position:relative;margin-left:4px;border-radius:4px;display:none;\">"
				+ "<span id=\"btn_remove\" class=\"glyphicon glyphicon-remove\" style=\"position:relative;top:10px;left:10px;\"></span>"
			+ "</div>"

			+ "<div id=\"btn_add\" style=\"float:right;height:32px;width:32px;top:-6px;position:relative;border-radius:4px;display:none;\">"
				+ "<span id=\"btn_add\" class=\"glyphicon glyphicon-plus\" style=\"position:relative;top:9px;left:11px;\"></span>"
			+ "</div>"
		;

		editable_list_tag += ""
			// chlidren element container div
			+ "<div id=\"chlid_shy_element_container\"></div>"
			// chlidren element container div
			+ "<div id=\"chlidren_element_container\"></div>"
			// add on element container div
			+ "<div id=\"add_on_element_container\"></div>"
		+ "</li>"
		;
		// 태그 그리기 완료

		// 2. 실제 지정된 인덱스에 append 시키기
		// 2-1. 사용자가 지정한 인덱스에 추가되어야 합니다.
		var target_before_action_item_obj = undefined;
		var target_after_action_item_obj = undefined;
		var new_list_row_jq = undefined;
		var cur_element_collection_container_jq = target_element_collection_set.get_element_collection_container_jq();
		if(_v.is_not_jquery_obj(cur_element_collection_container_jq)) {
			console.log("!Error! / add_editable_list_element / _v.is_not_jquery_obj(cur_element_collection_container_jq)");
			return;
		}
		var input_group_jq = cur_element_collection_container_jq.find("li#row_input_group");
		if(_v.is_not_jquery_obj(input_group_jq)) {
			console.log("!Error! / add_editable_list_element / _v.is_not_jquery_obj(input_group_jq)");
			return;
		}

		if(action_item_obj.is_first()) {

			// 최초의 엘리먼트 추가.
			// input group 을 찾아서 추가해야 합니다.
			input_group_jq.after(editable_list_tag);
			new_list_row_jq = input_group_jq.next();

			if(_v.is_not_jquery_obj(new_list_row_jq)) {
				console.log("!Error! / add_editable_list_element / _v.is_not_jquery_obj(new_list_row_jq)");
				return;
			}

		} else if(action_item_obj.is_not_first()) {

			// 가징 마지막 엘리먼트 추가.
			// 자신의 앞 형제의 action item의 element set을 가져옵니다.
			var cur_sibling_action_obj_before = action_item_obj.get_sibling_action_obj_before();
			if(_action.is_not_valid_action_item_obj(cur_sibling_action_obj_before)) {
				console.log("!Error! / add_editable_list_element / _action.is_not_valid_action_item_obj(cur_sibling_action_obj_before)");
				return;
			}

			var cur_sibling_element_event_manager_before = cur_sibling_action_obj_before.get_event_manager();
			if(cur_sibling_element_event_manager_before == undefined) {
				console.log("!Error! / add_editable_list_element / cur_sibling_element_event_manager_before == undefined");
				return;
			}

			var cur_sibling_element_jq_before = cur_sibling_element_event_manager_before.get_element_jq();
			if(_v.is_not_jquery_obj(cur_sibling_element_jq_before)) {
				console.log("!Error! / add_editable_list_element / _v.is_not_jquery_obj(cur_sibling_element_jq_before)");
				return;
			}

			cur_sibling_element_jq_before.after(editable_list_tag);
			new_list_row_jq = cur_sibling_element_jq_before.next();

			if(_v.is_not_jquery_obj(new_list_row_jq)) {
				console.log("!Error! / add_editable_list_element / _v.is_not_jquery_obj(new_list_row_jq)");
				return;
			}

		} else {
			console.log("!Error! / add_editable_list_element / Not implemented!");
			return;
		}

		
		// 3. 이벤트 붙이기
		// 4. element set 만들기

		// 엘리먼트의 이벤트 매니저를 만듭니다. Input group은 제외됩니다.
		// 이벤트 매니저의 전, 후의 형제 관계를 저장합니다.
		var cur_delegate_set_event_manager_prop = target_element_collection_set.get_delegate_set_event_manager_prop();
		if(cur_delegate_set_event_manager_prop == undefined) {
			console.log("!Error! / add_editable_list_element / cur_delegate_set_event_manager_prop == undefined");
			return;
		}

		var event_manager_list_row = 
		_action.make_element_event_manager(
			editable_list_row_id
			, new_list_row_jq
			, action_item_obj
			, cur_delegate_set_event_manager_prop
		);
		if(event_manager_list_row == undefined) {
			console.log("!Error! / add_editable_list_element / event_manager_list_row == undefined");
			return;
		}
		action_item_obj.set_event_manager(event_manager_list_row);

		// 이벤트 매니저의 전, 후의 형제 관계를 저장합니다.
		var sibling_action_obj_before = action_item_obj.get_sibling_action_obj_before();
		var before_event_manager = undefined;
		if(sibling_action_obj_before != undefined) {
			before_event_manager = sibling_action_obj_before.get_event_manager();	
		}
		if(before_event_manager != null){
			before_event_manager.set_after_sibling_event_manager(event_manager_list_row);	
			event_manager_list_row.set_before_sibling_event_manager(before_event_manager);
		}

		var sibling_action_obj_after = action_item_obj.get_sibling_action_obj_after();
		var after_event_manager = undefined;
		if(sibling_action_obj_after != undefined) {
			after_event_manager = sibling_action_obj_after.get_event_manager();	
		}
		if(after_event_manager != null){
			after_event_manager.set_before_sibling_event_manager(event_manager_list_row);	
			event_manager_list_row.set_after_sibling_event_manager(after_event_manager);
		}


		// event manager + element meta info => element set
		// element set + element set + ... => element collection set
		target_element_collection_set.push_new_element_set(action_item_obj, event_manager_list_row);

		// set eject btn event
		event_manager_list_row.set_delegate_btn_eject_click(_obj.get_delegate(function(event_click, cur_event_manager){

			var jsm = cur_event_manager.get_element_set().get_element_collection_set().jump_spot_manager;

			// @ 기본 동작
			// 이벤트 전파를 막습니다.
			event_click.stopPropagation();
			// 다른 객체들의 이벤트를 받지 않도록 lock를 설정.
			var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
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

		// POST PROCESS
		// element collection set을 움직일 버튼을 지정.
		var first_sibling_action_obj = action_item_obj.get_first_sibling_action_obj();
		if(_action.is_not_valid_action_item_obj(first_sibling_action_obj)) {
			console.log("!Error! / add_editable_list_element / _action.is_not_valid_action_item_obj(first_sibling_action_obj)");
			return;
		}
		var first_element_event_manager = first_sibling_action_obj.get_event_manager();
		if(first_element_event_manager == undefined) {
			console.log("!Error! / add_editable_list_element / first_element_event_manager == undefined");
			return;
		}

		// REMOVE ME
		// var cur_btn_collection_eject_jq = first_element_event_manager.get_btn_eject_collection_element_jq();
		// if(_v.is_not_jquery_obj(cur_btn_collection_eject_jq)) {
		// 	console.log("!Error! / add_editable_list_element / _v.is_not_jquery_obj(cur_btn_collection_eject_jq)");
		// 	return;
		// }
		// if(action_item_obj.is_first() && action_item_obj.get_action_is_not_shy()) {
		// 	target_element_collection_set.ecs_set_btn_collection_eject_jq(cur_btn_collection_eject_jq);	
		// }

		return target_element_collection_set;

	}
	// @ Section : LIST DRAWING & EVENT
	// @ public
	// @ Desc : 화면에 리스트를 추가합니다.
	,add_editable_list:function(parent_jq, editable_list_meta_info_obj, delegate_on_event, color_type){

		if(parent_jq == null){
			console.log("!Error! / add_editable_list / parent_jq == null");
			return;
		}
		if(editable_list_meta_info_obj == null){
			console.log("!Error! / add_editable_list / editable_list_meta_info_obj == null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_on_event)){
			console.log("!Error! / add_editable_list / _obj.isNotValidDelegate(delegate_on_event)");
			return;
		}
		
		var cur_action_list = editable_list_meta_info_obj.get_action_list();
		var cur_first_child_action_item = cur_action_list.get_first_child();
		if(_action.is_not_valid_action_item_obj(cur_first_child_action_item)) {
			console.log("!Error! / add_editable_list / _action.is_not_valid_action_item_obj(cur_first_child_action_item)");
			return;
		}

		if(this.is_not_valid_color_type_list_row(color_type)){
			color_type = this.COLOR_TYPE_LIST_ROW_WHITE;
		}

		// TODO element collection set이 새로운 열을 추가할 수 있도록 함.
		// element collection set
		var cur_element_collection_set = _action.make_element_collection_set(cur_action_list.get_action_name());
		cur_element_collection_set.set_element_meta_info_obj(editable_list_meta_info_obj);

		if(cur_first_child_action_item.get_action_is_shy()){
			// console.log("혼자 등록된 shy row만 가려줍니다.");
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
			+ "<div id=\"row_input_text\" class=\"form-group col-lg-9\" style=\"margin:0px;padding-left:0px;padding-right:7px;width:80%;float:left;\">"
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
		+ "</ul>"
		;








		// 태그 적용(append) 및 마우스 이벤트 연동하기
		// 이제 페이지에서 리스트를 볼 수 있습니다.

		// 리스트 열을 묶어주는 ul 태그 부모 리스트를 만듭니다. 이벤트도 설정해줍니다.
		parent_jq.append(editable_list_tag);
		var editable_list_jq = parent_jq.children().last();
		cur_element_collection_set.set_element_collection_container_jq(editable_list_jq);

		// wonder.jung
		// 리스트의 자식 열들을 만듭니다.
		var editable_list_row_arr_jq = editable_list_jq.children();

		






		// 엘리먼트와 이벤트 매니저 연결
		var delegate_set_event_manager_prop_on_list_row = 
		_obj.get_delegate(function(element_event_manager){

			// 리스트 열 내부에서 선택할 수 있는 요소
			// 1. 시간 엘리먼트. 
			// 2. 리스트 내용. 
			// 2가지 경우의 수가 생길 경우, 서로 다른 타입임을 알려주고 이벤트를 설정해야 함.
			// 마우스 이벤트 연동하기

			// console.log("delegate_set_event_manager_prop_on_list_row / element_event_manager :: ",element_event_manager);

			// CHANGE ME / cur_list_row_jq --> cur_list_row_set_jq
			var cur_list_row_jq = element_event_manager.get_element_jq();

			// COLOR
			var cur_list_row_color = cur_list_row_jq.css("color");
			var cur_list_row_background_color = cur_list_row_jq.css("background-color");
			var cur_list_row_border_color = cur_list_row_jq.css("border-color");

			element_event_manager.set_element_color(cur_list_row_color);
			element_event_manager.set_element_background_color(cur_list_row_background_color);
			element_event_manager.set_element_border_color(cur_list_row_border_color);

			// COLOR_TYPE
			element_event_manager.set_element_color_type(color_type);

			// CONTAINER
			var element_container_jq = cur_list_row_jq.parent();
			element_event_manager.set_element_container_jq(element_container_jq);
			element_event_manager.set_element_id(element_event_manager.event_manager_id);

			var cur_action_item_obj = element_event_manager.get_action_item_obj();
			if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
				console.log("!Error! / delegate_set_event_manager_prop_on_list_row / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
				return;
			}

			var cur_element_type = cur_action_item_obj.get_element_type();

			// INPUT GROUP
			var cur_list_row_grand_parent_jq = cur_list_row_jq.parent();

			// 내부에 자식 객체도 동일한 엘리먼트를 가질수 있으므로 첫번째 검색 결과만 사용합니다.
			var cur_input_group_jq = cur_list_row_grand_parent_jq.find("li#row_input_group").first();
			element_event_manager.set_title_input_group_jq(cur_input_group_jq);

			if(cur_action_item_obj.is_item_title_only() || cur_action_item_obj.is_item_title_n_time_hh_mm()){
				// REMOVE ME
				//var btn_add_jq = cur_list_row_jq.find("span#btn_add").first();
				var btn_add_jq = cur_list_row_jq.find("div#btn_add").first();
				element_event_manager.set_btn_add_element_jq(btn_add_jq);
			}

			var time_jq = undefined;
			if(cur_action_item_obj.is_item()){

				if(cur_action_item_obj.is_item_title_n_time_hh_mm()) {

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

				// REMOVE ME
				// var btn_edit_jq = cur_list_row_jq.find("span#btn_edit").first();
				// element_event_manager.set_btn_edit_element_jq(btn_edit_jq);

				// var btn_remove_jq = cur_list_row_jq.find("span#btn_remove").first();
				var btn_remove_jq = cur_list_row_jq.find("div#btn_remove").first();
				element_event_manager.set_btn_remove_element_jq(btn_remove_jq);

				// var btn_eject_jq = cur_list_row_jq.find("span#btn_eject").first();
				var btn_eject_jq = cur_list_row_jq.find("div#btn_eject").first();
				element_event_manager.set_btn_eject_element_jq(btn_eject_jq);

				// REMOVE ME
				// var btn_collection_eject_jq = cur_list_row_jq.find("span#btn_collection_eject").first();
				// element_event_manager.set_btn_eject_collection_element_jq(btn_collection_eject_jq);

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

			//var cur_list_row_btn_add_jq = cur_list_row_jq.find("span#btn_add").first();
			var cur_list_row_btn_add_jq = cur_list_row_jq.find("div#btn_add").first();
			if(cur_list_row_btn_add_jq.length > 0){
				element_event_manager.set_btn_add_element_jq(cur_list_row_btn_add_jq);	
			}

			var cur_title_input_btn_search_jq = cur_input_group_jq.find("button#btn_search").first();
			element_event_manager.set_title_input_btn_search_jq(cur_title_input_btn_search_jq);

			element_event_manager.set_delegate_save_n_reload(delegate_on_event);

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

				var consoler = airborne.console.get();
				// consoler.off();

				var cur_before_sibling_event_manager = cur_event_manager_on_mouse_over.get_before_sibling_event_manager();
				var cur_after_sibling_event_manager = cur_event_manager_on_mouse_over.get_after_sibling_event_manager();

				var is_first = (cur_before_sibling_event_manager == undefined)?true:false;
				var is_last = (cur_after_sibling_event_manager == undefined)?true:false;

				consoler.say("엘리먼트가 사용자 수정에 의해 새로운 위치로 이동 완료한 뒤에 호출되는 콜백 델리게이트");
				var cur_sibling_element_event_manager_arr = cur_event_manager_on_mouse_over.get_sibling_element_event_manager_arr(true);
				var cur_element_set = cur_event_manager_on_mouse_over.get_element_set();
				var cur_element_collection_set = cur_element_set.get_element_collection_set();
				var has_input_group = false;
				var cur_masked_element_set_arr = cur_element_collection_set.ecs_get_masked_element_set_arr(has_input_group);

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
					} else if(cur_element_jq.next().length == 0) {
						consoler.say("마지막 엘리먼트로 지정되었습니다. / 이벤트와 모양을 지정합니다. / " + cur_title);
						_obj.remove_list_row_css_radius(cur_element_jq);
						_obj.set_list_last_row_css_radius(cur_element_jq, _obj.LIST_ROW_RADIUS_NORMAL);
					} else {
						consoler.say("중간의 엘리먼트로 지정되었습니다. / 이벤트와 모양을 지정합니다. / " + cur_title);
						_obj.remove_list_row_css_radius(cur_element_jq);
					}	
					cur_sibling_element_event_manager.hide_btn_eject_collection_element_jq();
				}

				// action item obj의 순서 바꾸기.
				var cur_before_sibling_action_item_obj = undefined;
				if(cur_before_sibling_event_manager != undefined) {
					cur_before_sibling_action_item_obj = cur_before_sibling_event_manager.get_action_item_obj();
				}
				var cur_action_item_obj = cur_event_manager_on_mouse_over.get_action_item_obj();
				var cur_after_sibling_action_item_obj = undefined;
				if(cur_after_sibling_event_manager != undefined) {
					cur_after_sibling_action_item_obj = cur_after_sibling_event_manager.get_action_item_obj();
				}
				cur_action_item_obj.dive_into_them(
					// new_before_action_item_obj
					cur_before_sibling_action_item_obj
					// new_after_action_item_obj
					, cur_after_sibling_action_item_obj
				);

				// 시간 위젯이 있다면 바뀐 위치에 따라 시간을 조정해줍니다.
				var cur_element_type;
				if(cur_event_manager_on_mouse_over != undefined){
					cur_element_type = cur_event_manager_on_mouse_over.get_element_type();
				}

				// Do something - 시간바꾸기

				// 형제 엘리먼트의 디자인 - collection eject btn, corner round - 을 다시 그립니다.
				console.log("형제 엘리먼트의 디자인 - collection eject btn, corner round - 을 다시 그립니다.");
				var has_myself = true;
				cur_event_manager_on_mouse_over.shape_sibling_element(has_myself);

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

				// Do something!
				// shy element의 열이 이동하였을 때, 이동한 열에 맞게 시간을 변경해 줍니다.

			}, this));

			return element_event_manager;

		}, this);
		// 사용자가 새로운 열을 만들수 있도록, 이벤트 매니저 델리게이트 함수를 저장합니다.
		cur_element_collection_set.set_delegate_set_event_manager_prop(delegate_set_event_manager_prop_on_list_row);



		// action item 화면에 표시 및 event manager 만들기
		var get_children_cnt = cur_action_list.get_children_cnt();
		for(var idx=0;idx < get_children_cnt;idx++) {
			var cur_child_action_item_obj = cur_action_list.get_child(idx);

			cur_element_collection_set = 
			this.add_editable_list_element(
				// target_element_collection_set
				cur_element_collection_set
				// action_item_obj
				, cur_child_action_item_obj
				// color type
				, color_type
				// target_idx
				, idx
			);
		} // for end

		return cur_element_collection_set;
	}
	// @ public
	// @ Desc : src_element_collection_set에서 저장된 json format 데이터로 자신 내부에 포함될 element collection set을 골라 집어 넣습니다.
	,set_add_on_json_format_on_list:function(src_element_collection_set, target_element_collection_set_arr){

		if(src_element_collection_set == undefined){
			console.log("!Error! / set_add_on_json_format_on_list / src_element_collection_set == undefined");
			return;
		}

		if(_v.is_not_valid_array(target_element_collection_set_arr)){
			console.log("!Error! / set_add_on_json_format_on_list / _v.is_not_valid_array(target_element_collection_set_arr)");
			return;
		}

		// 모든 엘리먼트 셋을 순회하며 지정된 동작을 합니다.
		// 여기서는 add on element를 연결하는 역할을 합니다.
		var delegate_do_to_all_element_set = _obj.get_delegate(function(cur_element_set){

			var cur_event_manager = cur_element_set.get_event_manager();
			if(cur_event_manager == undefined) {
				console.log("delegate_do_to_all_element_set / cur_event_manager == undefined");
				return;
			}

			var cur_action_item_obj = cur_event_manager.get_action_item_obj();
			if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
				console.log("delegate_do_to_all_element_set / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
				return;
			}

			// REMOVE ME

			/*
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
			*/		

		},this);
		var cur_event_manager = src_element_collection_set.get_element_set_arr()[0].get_event_manager();

		// element collection set의 부모, 형제, 자식 element set에게 delegate 함수를 실행하도록 합니다.
		cur_event_manager.call_delegate_do_to_all_element_set(src_element_collection_set, delegate_do_to_all_element_set);
	}	
}