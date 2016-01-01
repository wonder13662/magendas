
/*
	@ Desc : action collection, action item의 객체를 화면에 그리는 js 클래스.
*/
airborne.bootstrap.obj.__action = {
	COLOR_TYPE_LIST_ROW_WHITE:"list-group-item-default"
	,COLOR_TYPE_LIST_ROW_GREEN:"list-group-item-success"
	,COLOR_TYPE_LIST_ROW_BLUE:"list-group-item-info"
	,COLOR_TYPE_LIST_ROW_YELLOW:"list-group-item-warning"
	,COLOR_TYPE_LIST_ROW_RED:"list-group-item-danger"
	,is_not_valid_color_type:function(color_type) {
		return !this.is_valid_color_type(color_type);
	}
	,is_valid_color_type:function(color_type) {
		if(	color_type != this.COLOR_TYPE_LIST_ROW_WHITE &&
			color_type != this.COLOR_TYPE_LIST_ROW_GREEN &&
			color_type != this.COLOR_TYPE_LIST_ROW_BLUE &&
			color_type != this.COLOR_TYPE_LIST_ROW_YELLOW &&
			color_type != this.COLOR_TYPE_LIST_ROW_RED	){

			return false;
		}
		return true;
	}
	, add_editable_action_list:function(parent_jq, action_list, delegate_save_n_reload) {	

		var __v = _v_factory.get("airborne.bootstrap.obj.__action / add_editable_action_list / 28");
		var show_log = true;
		if(parent_jq == null){
			__v.show_err_msg("parent_jq == null", "parent_jq", parent_jq);
			return;
		}
		if(action_manager.is_not_valid_action_collection_data_obj(action_list)) {
			__v.show_err_msg("action_manager.is_not_valid_action_collection_data_obj(action_list)", "action_list", action_list);
			return;
		}
		if(_obj.isNotValidDelegate(delegate_save_n_reload)){
			__v.show_err_msg("_obj.isNotValidDelegate(delegate_save_n_reload)", "delegate_save_n_reload", delegate_save_n_reload);
			return;
		}

		//var list_element_type_arr = action_list.get_element_type_list();
		var list_element_type_arr = ["ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT","ELEMENT_TYPE_LIST_ROW_INPUT_TEXT"];
		var action_list_view = action_list.get_action_view_obj();

		console.log("add_editable_action_list >>> action_list_view :: ",action_list_view);

		var consoler = airborne.console.get();
		consoler.off();

		// DEBUG
		var msg = 
		"airborne.bootstrap.obj.__action / add_editable_action_list / <list_title>"
		.replace(/\<list_title\>/gi, action_list.get_action_name())
		;
		consoler.say(msg, action_list);

		var msg = 
		"airborne.bootstrap.obj.__action / add_editable_action_list / <list_title> / list_element_type_arr"
		.replace(/\<list_title\>/gi, action_list.get_action_name())
		;
		consoler.say(msg, action_list,list_element_type_arr);

		var msg = 
		"airborne.bootstrap.obj.__action / add_editable_action_list / <list_title> / action_list_view"
		.replace(/\<list_title\>/gi, action_list.get_action_name())
		;
		consoler.say(msg, action_list,action_list_view);

		var editable_action_list = 
		_view_list.add_editable_action_list(
			// list_element_type_arr
			list_element_type_arr
			// json_format_obj_arr
			, action_list_view
			// list_title
			, action_list.get_action_name()
			// parent_element_set
			, null
			// list_container_jq
			, parent_jq
			// delegate_save_n_reload
			, delegate_save_n_reload
		);

		return editable_action_list;
	}
}