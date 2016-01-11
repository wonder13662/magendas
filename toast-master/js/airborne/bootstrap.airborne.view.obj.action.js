// @ Desc : action collection, action item의 객체를 화면에 그리는 js 클래스.
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
	,ACTION_COLLECTION_TYPE_LIST:1
	,ACTION_COLLECTION_TYPE_TABLE:2
	,ACTION_ITEM_TYPE_TITLE_ONLY:1
	,ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM:2
	,ACTION_ITEM_TYPE_TITLE_N_TIME_MM_SS:3
	,ACTION_ITEM_TYPE_SELECT_BOX:4
	,is_valid_action_collection_data_obj:function(action_collection_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		var __v = _v_factory.get("_action.js / is_valid_action_collection_data_obj");

		if(this.is_not_valid_action_data_obj(action_collection_data_obj, show_log)) {
			return false;
		}
		if(__v.is_not_unsigned_number(action_collection_data_obj.action_collection_type, show_log)) {
			return false;
		}
		if(__v.is_not_valid_str(action_collection_data_obj.action_collection_type_name, show_log)) {
			return false;
		}

		return true;
	}	
	,is_not_valid_action_collection_data_obj:function(action_collection_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		return !this.is_valid_action_collection_data_obj(action_collection_data_obj, show_log);
	}
	,is_valid_action_item_data_obj:function(action_item_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		var __v = _v_factory.get("_action.js / is_valid_action_item_data_obj");

		if(this.is_not_valid_action_data_obj(action_item_data_obj, show_log)) {
			return false;
		}
		if(__v.is_not_unsigned_number(action_item_data_obj.action_item_type, show_log)) {
			return false;
		}
		if(__v.is_not_valid_str(action_item_data_obj.action_item_type_name, show_log)) {
			return false;
		}

		return true;
	}	
	,is_not_valid_action_item_data_obj:function(action_item_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		return !this.is_valid_action_item_data_obj(action_item_data_obj, show_log);
	}	
	,is_not_valid_action_data_obj:function(action_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		return !this.is_valid_action_data_obj(action_data_obj, show_log);
	}
	,is_valid_action_data_obj:function(action_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		var __v = _v_factory.get("_action.js / is_valid_action_data_obj");
		if(__v.is_null_object(action_data_obj, show_log)) {
			return false;
		}
		if(__v.is_not_unsigned_number(action_data_obj.action_id, show_log)) {
			return false;
		}
		if(__v.is_not_valid_str(action_data_obj.action_name, show_log)) {
			return false;
		}
		if(__v.is_not_valid_str(action_data_obj.action_hash_key, show_log)) {
			return false;
		}

		return true;
	}
	,get_action_obj:function(action_data_obj, coordinate, action_hierarchy_search_map) {

		var action_obj = {
			parent_action_object:null
			,children_action_object_list:null
			,sibling_action_obj_before:null
			,sibling_action_obj_after:null
			,add_on_action_object_list:null
			,action_id:null
			,action_name:null
			,action_context:null
			,action_collection_type:null
			,action_collection_type_name:null
			,action_item_type:null
			,action_item_type_name:null
			,action_hash_key:null
			,action_order:null
			,action_is_shy:null
			,coordinate:null
			,action_hierarchy_search_map:null
			,external_select_box_option_list:null
			,event_manager:null
			,set_action_data:function(action_data_obj, coordinate, action_hierarchy_search_map) {

				var __v = _v_factory.get("get_action_obj");
				if(_action.is_not_valid_action_data_obj(action_data_obj)) {
					__v.show_err_msg("is_not_valid_action_data_obj", "action_data_obj", action_data_obj);
					return;
				}

				this.set_action_id(action_data_obj.action_id);
				this.set_action_name(action_data_obj.action_name);
				this.set_action_hash_key(action_data_obj.action_hash_key);
				this.set_action_order(action_data_obj.action_order);
				this.set_action_is_shy(action_data_obj.action_is_shy);

				if(action_data_obj.context != undefined) {
					this.set_action_context(action_data_obj.context);
				}
				if(action_data_obj.sibling_action_obj_before != undefined) {
					this.set_sibling_action_obj_before(action_data_obj.sibling_action_obj_before);
				}

				this.set_coordinate(coordinate);

				var my_coordinate = this.get_coordinate();
				if(action_hierarchy_search_map == undefined) {
					action_hierarchy_search_map = {};
				}
				action_hierarchy_search_map[my_coordinate] = this;
				this.set_action_hierarchy_search_map(action_hierarchy_search_map);

				// CHILDREN ACTION OBJ LIST
				if(action_data_obj.children_action_object_list != undefined) {
					for(var idx = 0;idx < action_data_obj.children_action_object_list.length;idx++) {

						var child_action_data_obj = action_data_obj.children_action_object_list[idx];
						var child_coordinate = this.get_coordinate() + "-" + idx;
						var child_action_obj = this.add_child(child_action_data_obj, child_coordinate, action_hierarchy_search_map);

						if(0 < idx) {
							var child_sibling_action_obj_before = this.get_child(idx - 1);
							child_action_obj.set_sibling_action_obj_before(child_sibling_action_obj_before);
							child_sibling_action_obj_before.set_sibling_action_obj_after(child_action_obj);
						} // end inner if
					} // end for
				} // end outer if

				// ACTION ACTION OBJ LIST
				if(action_data_obj.add_on_action_object_list != undefined) {
					for(var idx = 0;idx < action_data_obj.add_on_action_object_list.length;idx++) {
						var add_on_action_data_obj = action_data_obj.add_on_action_object_list[idx];
						var add_on_coordinate = this.get_coordinate() + "-" + idx;
						this.push_add_on(add_on_action_data_obj, add_on_coordinate, action_hierarchy_search_map);
					}
				}

				if(_action.is_valid_action_collection_data_obj(action_data_obj, false)) {

					this.set_action_collection_type(action_data_obj.action_collection_type);
					this.set_action_collection_type_name(action_data_obj.action_collection_type_name);

				} else if(_action.is_valid_action_item_data_obj(action_data_obj, false)) {

					this.set_action_item_type(action_data_obj.action_item_type);
					this.set_action_item_type_name(action_data_obj.action_item_type_name);

				}
	
			}
			,set_parent:function(parent_action_object) {
				this.parent_action_object = parent_action_object;
			}
			,get_parent:function() {
				return this.parent_action_object;
			}
			,has_parent:function() {

				var parent_action_obj = this.get_parent();
				if(parent_action_obj == undefined) {
					return false;
				}
				return true;
			}
			,has_no_parent:function() {
				return !this.has_parent();
			}
			,add_child:function(child_action_data_obj, coordinate, action_hierarchy_search_map) {

				// 자식을 추가할 경우에도 action_obj를 생성해서 만들어 줘야 함.
				var child_action_obj = _action.get_action_obj(child_action_data_obj, coordinate, action_hierarchy_search_map);

				// 자신이 자식 객체의 부모 객체가 됩니다.
				child_action_obj.set_parent(this);

				var children_action_obj_list = this.get_children();
				children_action_obj_list.push(child_action_obj);

				return child_action_obj;
			}
			,get_children_cnt:function() {
				if(this.children_action_object_list == undefined) {
					this.children_action_object_list = [];
				}
				return this.children_action_object_list.length;
			}
			,get_children:function() {
				if(this.children_action_object_list == undefined) {
					this.children_action_object_list = [];
				}
				return this.children_action_object_list;
			}
			,get_child:function(idx) {
				if(this.children_action_object_list == undefined) {
					this.children_action_object_list = [];
				}

				var length = this.children_action_object_list.length;
				if(-1 < idx && idx < length) {
					return this.children_action_object_list[idx];	
				}

				return null;
			}
			,get_first_child:function() {
				return this.get_child(0);
			}
			,get_last_child:function() {
				return this.get_child(this.get_children_cnt() - 1);
			}
			,has_no_children:function() {
				return !this.has_children();
			}
			,has_children:function() {
				var children_action_object_list = this.get_children();
				return (_v.is_valid_array(children_action_object_list))?true:false;
			}
			,set_sibling_action_obj_before:function(sibling_action_obj_before) {
				this.sibling_action_obj_before = sibling_action_obj_before;
			}
			,get_sibling_action_obj_before:function() {
				return this.sibling_action_obj_before;
			}
			,set_sibling_action_obj_after:function(sibling_action_obj_after) {
				this.sibling_action_obj_after = sibling_action_obj_after;
			}
			,get_sibling_action_obj_after:function() {
				return this.sibling_action_obj_after;
			}
			,push_add_on:function(add_on_action_data_obj, coordinate, action_hierarchy_search_map) {

				// add on을 추가할 경우에도 action_obj를 생성해서 만들어 줘야 함.
				var add_on_action_obj = _action.get_action_obj(add_on_action_data_obj, coordinate, action_hierarchy_search_map);

				// 자신이 자식 객체의 부모 객체가 됩니다.
				add_on_action_obj.set_parent(this);

				var add_on_action_object_list = this.get_add_on_list();
				add_on_action_object_list.push(add_on_action_obj);
			}
			,get_add_on_list:function() {
				if(this.add_on_action_object_list == undefined) {
					this.add_on_action_object_list = [];
				}
				return this.add_on_action_object_list;
			}
			,has_no_add_on_list:function() {
				return !this.has_add_on_list();
			}
			,has_add_on_list:function() {
				var add_on_action_object_list = this.get_add_on_list();
				return (_v.is_valid_array(add_on_action_object_list))?true:false;
			}
			,set_action_name:function(action_name) {
				this.action_name = action_name;
			}
			,get_action_name:function() {
				return this.action_name;
			}
			,set_action_context:function(action_context) {
				this.action_context = action_context;
			}
			,get_action_context:function() {
				return this.action_context;
			}
			,set_action_id:function(action_id) {
				this.action_id = action_id;
			}
			,get_action_id:function() {
				return this.action_id;
			}
			,set_action_hash_key:function(action_hash_key) {
				this.action_hash_key = action_hash_key;
			}
			,get_action_hash_key:function() {
				return this.action_hash_key;
			}
			,set_action_order:function(action_order) {
				this.action_order = action_order;
			}
			,get_action_order:function() {
				return this.action_order;
			}
			,set_action_is_shy:function(action_is_shy) {
				this.action_is_shy = action_is_shy;
			}
			,get_action_is_shy:function() {
				return this.action_is_shy;
			}
			,set_action_collection_type:function(action_collection_type) {
				this.action_collection_type = action_collection_type;
			}
			,get_action_collection_type:function() {
				return this.action_collection_type;
			}
			,set_action_collection_type_name:function(action_collection_type_name) {
				this.action_collection_type_name = action_collection_type_name;
			}
			,get_action_collection_type_name:function() {
				return this.action_collection_type_name;
			}
			,set_action_item_type:function(action_item_type) {
				this.action_item_type = action_item_type;
			}
			,get_action_item_type:function() {
				return this.action_item_type;
			}
			,set_action_item_type_name:function(action_item_type_name) {
				this.action_item_type_name = action_item_type_name;
			}
			,get_action_item_type_name:function() {
				return this.action_item_type_name;
			}
			// @ Public
			// @ Desc : 실제로 화면에 그릴때 사용되는 타입으로 변환해줍니다.
			,get_element_type:function() {

				var element_type = null;

				if(this.is_item_title_only() && !this.get_action_is_shy()) {

					element_type = _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT;

				} else if(this.is_item_title_only() && this.get_action_is_shy()) {

					element_type = _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT_SHY;

				} else if(this.is_item_title_n_time_hh_mm()) {

					element_type = _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT;

				} else if(this.is_item_title_n_time_mm_ss()) {

					element_type = _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT;

				} else if(this.is_item_select_box()) {

					element_type = _obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT;

				}

				return element_type;

			}
			// @ Public
			// @ Desc : 실제로 화면에 그릴때 사용되는 타입으로 변환해줍니다. 
			// 호출 객체부터 시작해서 최하단의 아이템의 타입까지 배열로 반환합니다. 
			// 단, 각 단계의 형제 아이템의 속성을 동일해야 합니다.
			,get_element_type_list:function(element_type_list, depth) {

				// DEBUG
				var cur_action_name = this.get_action_name();
				console.log("** get_element_type_list / cur_action_name :: ",cur_action_name);

				if(element_type_list == undefined) {
					element_type_list = [];
				}
				if(depth == undefined) {
					depth = 0;
				}

				if(this.is_item() && element_type_list.length == depth) {
					
					var cur_element_type = this.get_element_type();

					console.log("*** depth :: ",depth);
					console.log("*** cur_element_type :: ",cur_element_type);

					element_type_list.push(this.get_element_type());	

					depth += 1;
				}

				if(this.has_no_children()) {
					return element_type_list;
				}

				var children_action_object_list = this.get_children();
				for(var idx = 0;idx < children_action_object_list.length; idx++) {
					var child_action_obj = children_action_object_list[idx];
					element_type_list = child_action_obj.get_element_type_list(element_type_list, depth);
				}
				
				

				return element_type_list;
			}
			,get_root_action_obj:function() {
				if(this.parent_action_object == undefined) {
					return this;	
				}

				return this.parent_action_object.get_root_action_obj();
			}
			,set_coordinate:function(coordinate) {
				this.coordinate = coordinate;				
			}
			,get_coordinate:function() {
				if(this.coordinate == undefined) {
					this.coordinate = "root";
				}
				return this.coordinate;				
			}
			,set_action_hierarchy_search_map:function(action_hierarchy_search_map) {
				this.action_hierarchy_search_map = action_hierarchy_search_map;
			}
			,get_action_hierarchy_search_map:function(action_hierarchy_search_map) {
				return this.action_hierarchy_search_map;
			}
			,search:function(coordinate) {
				if(this.action_hierarchy_search_map == undefined || coordinate == undefined) {
					return;
				}
				return this.action_hierarchy_search_map[coordinate];
			}
			,set_external_select_box_option_list:function(external_select_box_option_list) {
				this.external_select_box_option_list = external_select_box_option_list;
			}
			,get_external_select_box_option_list:function(external_select_box_option_list) {
				return this.external_select_box_option_list;
			}
			,is_list:function() {
				var action_collection_type = this.get_action_collection_type();
				return (_action.ACTION_COLLECTION_TYPE_LIST === action_collection_type)?true:false;
			}
			,is_table:function() {
				var action_collection_type = this.get_action_collection_type();
				return (_action.ACTION_COLLECTION_TYPE_TABLE === action_collection_type)?true:false;				
			}
			,is_item:function() {
				if(	this.is_item_title_only() || 
					this.is_item_title_n_time_hh_mm() || 
					this.is_item_title_n_time_mm_ss() || 
					this.is_item_select_box() ) {

					return true;
				}
				return false;
			}
			,is_item_title_only:function() {
				var action_item_type = this.get_action_item_type();
				return (_action.ACTION_ITEM_TYPE_TITLE_ONLY === action_item_type)?true:false;
			}
			,is_not_item_title_n_time_hh_mm:function() {
				return !this.is_item_title_n_time_hh_mm();
			}
			,is_item_title_n_time_hh_mm:function() {
				var action_item_type = this.get_action_item_type();
				return (_action.ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM === action_item_type)?true:false;
			}
			,is_item_title_n_time_mm_ss:function() {
				var action_item_type = this.get_action_item_type();
				return (_action.ACTION_ITEM_TYPE_TITLE_N_TIME_MM_SS === action_item_type)?true:false;
			}
			,is_item_select_box:function() {
				var action_item_type = this.get_action_item_type();
				return (_action.ACTION_ITEM_TYPE_SELECT_BOX === action_item_type)?true:false;
			}
			// @ Private
			// @ Desc : 사용자에 의해 값이 변경되면 이 플래그를 true로 변경합니다.
			,changed:false
			,is_changed:function() {
				return this.changed;
			}
			,set_changed:function() {
				this.changed = true;
			}
			// functions for item_title_n_time_hh_mm
			,update_time_hh_mm:function(new_time_sec) {

				var cur_action_name = this.get_action_name();
				if(this.is_not_item_title_n_time_hh_mm()) {
					console.log("!Error! / update_time_hh_mm / this.is_not_item_title_n_time_hh_mm() / "+cur_action_name);
					return;
				}
				if(_v.is_not_unsigned_number(new_time_sec)) {
					console.log("!Error! / update_time_hh_mm / _v.is_not_unsigned_number(new_time_sec) / "+cur_action_name);
					return;
				}

				// 업데이트 된 상태로 변경합니다.
				this.set_changed();
				var time_hh_mm_obj = this.get_time_hh_mm_obj();

				time_hh_mm_obj.time_sec_offset_from_init = new_time_sec - time_hh_mm_obj.time_sec_initial;
				time_hh_mm_obj.time_hh_mm = _dates.get_hh_mm_from_seconds(new_time_sec);

				var cur_element_event_manager = this.get_element_event_manager();
				if(cur_element_event_manager == undefined) {
					console.log("!Error! / update_time_hh_mm / cur_element_event_manager == undefined / " + cur_action_name);
					return;
				}
				cur_element_event_manager.set_value_time_jq(time_hh_mm_obj.time_hh_mm);

				var new_json_str_time_hh_mm = JSON.stringify(time_hh_mm_obj);
				this.set_action_context(new_json_str_time_hh_mm);
			}
			,get_time_hh_mm_obj:function() {

				var __v = _v_factory.get("_action / get_time_hh_mm_obj");

				// title_n_time_hh_mm 타입인 경우만 진행합니다.
				if(this.is_not_item_title_n_time_hh_mm()) {
					console.log("!Error! / get_time_hh_mm_obj / this.is_not_item_title_n_time_hh_mm()");
					return;
				}
				var json_str_time_hh_mm = this.get_action_context();
				if(__v.is_not_valid_str(json_str_time_hh_mm)) {
					return;
				}
				var time_hh_mm_obj = _json.parseJSON(json_str_time_hh_mm);
				if(__v.is_null_object(time_hh_mm_obj)) {
					return;
				}

				return time_hh_mm_obj;
			}
			// @ Public
			// @ Desc : 시간 객체인 경우, 시간 정보를 초 단위로 돌려줍니다.
			,get_time_sec:function() {

				if(this.is_not_item_title_n_time_hh_mm()) {
					console.log("!Error! / get_time_sec / this.is_not_item_title_n_time_hh_mm()");
					return;
				}

				var cur_time_hh_mm_obj = this.get_time_hh_mm_obj();
				var cur_time_sec_initial = parseInt(cur_time_hh_mm_obj.time_sec_initial);
				if(_v.is_not_unsigned_number(cur_time_sec_initial)) {
					console.log("!Error! / get_time_sec / _v.is_not_unsigned_number(cur_time_sec_initial)");
					return -1;
				}
				var cur_time_sec_offset_from_init = parseInt(cur_time_hh_mm_obj.time_sec_offset_from_init);
				if(_v.is_not_unsigned_number(cur_time_sec_offset_from_init)) {
					console.log("!Error! / get_time_sec / _v.is_not_unsigned_number(cur_time_sec_offset_from_init)");
					return -1;
				}

				return cur_time_sec_initial + cur_time_sec_offset_from_init;
			}
			// 해당 데이터와 관련있는 엘리먼트 컨트롤러 참조
			,element_event_manager:null
			,set_element_event_manager:function(element_event_manager) {
				this.element_event_manager = element_event_manager;
			}
			,get_element_event_manager:function() {
				return this.element_event_manager;
			}
			// DB 업데이트를 위한 전달 객체 만들기 
			,get_action_data_for_db_update:function(depth) {

				var root_action_obj = this.get_root_action_obj();

				var cur_action_context = _json.parseJSON(this.get_action_context());
				
				var action_data_for_db = {
					action_id:this.get_action_id()
					, action_collection_type:this.get_action_collection_type()
					, action_item_type:this.get_action_item_type()
					, action_name:this.get_action_name()
					, action_context:cur_action_context
					, action_coordinate:this.get_coordinate()
					, root_action_id:root_action_obj.get_action_id()
				};

				return action_data_for_db;
			}
			// ,event_manager:null
			,set_event_manager:function(event_manager) {
				this.event_manager = event_manager;
			}
			,get_event_manager:function(event_manager) {
				return this.event_manager;
			}
		}
		action_obj.set_action_data(action_data_obj, coordinate, action_hierarchy_search_map);

		return action_obj;
	}
	// @ Public
	// @ Desc : 두 action 객체를 비교합니다. 비교 대상은 id, hash_key, name, context 입니다. 비교는 반드시 root action 객체로부터 아래로 내려옵니다.
	,compare_root_action:function(prev_root_action_obj, next_root_action_obj) {

		if(prev_root_action_obj.has_parent() || next_root_action_obj.has_parent()) {
			console.log("!Error! / action.manager.js / compare_root_action / prev_root_action_obj & next_root_action_obj is different!");
			return;
		}

		return this.compare_action(prev_root_action_obj, next_root_action_obj);
	}
	// @ Public
	// @ Desc : 두 action 객체를 비교합니다. 비교 대상은 id, hash_key, name, context 입니다. 비교는 반드시 root action 객체로부터 아래로 내려옵니다.
	// @ Usage : _action.compare_action(prev_action_obj, next_action_obj);
	,compare_action:function(prev_action_obj, next_action_obj) {

		var has_same_var = true;

		if(this.is_not_valid_action_data_obj(prev_action_obj)) {
			console.log("!Error! / action.manager.js / compare_action / this.is_not_valid_action_data_obj(prev_action_obj)");
			return false;
		}
		if(this.is_not_valid_action_data_obj(next_action_obj)) {
			console.log("!Error! / action.manager.js / compare_action / this.is_not_valid_action_data_obj(next_action_obj)");
			return false;
		}

		var prev_action_coordinate = prev_action_obj.get_coordinate();
		var next_action_coordinate = next_action_obj.get_coordinate();
		var COORDINATE = prev_action_coordinate + "<-->" + next_action_coordinate;
		
		if(prev_action_obj.get_action_id() != next_action_obj.get_action_id()) {
			console.log("");
			console.log("!Diff Found! / action.manager.js / compare_action / <COORDINATE> / prev_action_obj.get_action_id() != next_action_obj.get_action_id()".replace(/\<COORDINATE\>/gi, COORDINATE));
			console.log("!Diff Found! / action.manager.js / compare_action / prev_action_obj.get_action_id() ::",prev_action_obj.get_action_id());
			console.log("!Diff Found! / action.manager.js / compare_action / next_action_obj.get_action_id() ::",next_action_obj.get_action_id());
			has_same_var = false;
		}
		if(prev_action_obj.get_action_hash_key() != next_action_obj.get_action_hash_key()) {
			console.log("");
			console.log("!Diff Found! / action.manager.js / compare_action / <COORDINATE> / prev_action_obj.get_action_hash_key() != next_action_obj.get_action_hash_key()".replace(/\<COORDINATE\>/gi, COORDINATE));
			console.log("!Diff Found! / action.manager.js / compare_action / prev_action_obj.get_action_hash_key() ::",prev_action_obj.get_action_hash_key());
			console.log("!Diff Found! / action.manager.js / compare_action / next_action_obj.get_action_hash_key() ::",next_action_obj.get_action_hash_key());
			has_same_var = false;
		}
		if(prev_action_obj.get_action_name() != next_action_obj.get_action_name()) {
			console.log("");
			console.log("!Diff Found! / action.manager.js / compare_action / <COORDINATE> / prev_action_obj.get_action_name() != next_action_obj.get_action_name()".replace(/\<COORDINATE\>/gi, COORDINATE));
			console.log("!Diff Found! / action.manager.js / compare_action / prev_action_obj.get_action_name() ::",prev_action_obj.get_action_name());
			console.log("!Diff Found! / action.manager.js / compare_action / next_action_obj.get_action_name() ::",next_action_obj.get_action_name());
			has_same_var = false;
		}
		if(prev_action_obj.get_action_context() != next_action_obj.get_action_context()) {
			console.log("");
			console.log("!Error! / action.manager.js / compare_action / <COORDINATE> / prev_action_obj.get_action_context() != next_action_obj.get_action_context()".replace(/\<COORDINATE\>/gi, COORDINATE));
			console.log("!Error! / action.manager.js / compare_action / prev_action_obj.get_action_context() ::",prev_action_obj.get_action_context());
			console.log("!Error! / action.manager.js / compare_action / next_action_obj.get_action_context() ::",next_action_obj.get_action_context());
			has_same_var = false;
		}

		var prev_child_action_list = prev_action_obj.get_children();
		var next_child_action_list = next_action_obj.get_children();

		if(prev_child_action_list == undefined && next_child_action_list != undefined) {
			console.log("!Error! / action.manager.js / compare_action / prev_child_action_list == undefined && next_child_action_list != undefined");
			return false;
		} else if(prev_child_action_list != undefined && next_child_action_list == undefined) {
			console.log("!Error! / action.manager.js / compare_action / prev_child_action_list != undefined && next_child_action_list == undefined");
			return false;
		} else if(prev_child_action_list.length != next_child_action_list.length) {
			console.log("!Error! / action.manager.js / compare_action / prev_child_action_list.length != next_child_action_list.length");
			return false;
		} else if(prev_child_action_list == undefined && next_child_action_list == undefined) {
			// 상위 객체 비교는 위에서 완료. 자식 객체 비교가 불가. 검사를 종료합니다.
			return false;
		}

		for(var idx=0;idx < prev_child_action_list.length; idx++) {
			var prev_child_action = prev_child_action_list[idx];
			var next_child_action = next_child_action_list[idx];

			var is_same_child = this.compare_action(prev_child_action, next_child_action);

			if(!is_same_child) {
				has_same_var = false;
			}
		}

		return has_same_var;
	}
	// dMMMMMP dMP     dMMMMMP dMMMMMMMMb dMMMMMP dMMMMb dMMMMMMP         dMMMMMP dMP dMP dMMMMMP dMMMMb dMMMMMMP         dMMMMMMMMb  .aMMMb  dMMMMb  .aMMMb  .aMMMMP dMMMMMP dMMMMb 
	// dMP     dMP     dMP     dMP"dMP"dMPdMP     dMP dMP   dMP           dMP     dMP dMP dMP     dMP dMP   dMP           dMP"dMP"dMP dMP"dMP dMP dMP dMP"dMP dMP"    dMP     dMP.dMP 
	// dMMMP   dMP     dMMMP   dMP dMP dMPdMMMP   dMP dMP   dMP           dMMMP   dMP dMP dMMMP   dMP dMP   dMP           dMP dMP dMP dMMMMMP dMP dMP dMMMMMP dMP MMP"dMMMP   dMMMMK"  
	// dMP     dMP     dMP     dMP dMP dMPdMP     dMP dMP   dMP           dMP      YMvAP" dMP     dMP dMP   dMP           dMP dMP dMP dMP dMP dMP dMP dMP dMP dMP.dMP dMP     dMP"AMF   
	// dMMMMMP dMMMMMP dMMMMMP dMP dMP dMPdMMMMMP dMP dMP   dMP           dMMMMMP    VP"  dMMMMMP dMP dMP   dMP           dMP dMP dMP dMP dMP dMP dMP dMP dMP  VMMMP" dMMMMMP dMP dMP    

	// @ Public
	// @ Desc : 엘리먼트 이벤트 객체를 만듭니다. HTML 태그의 이벤트를 관리합니다.
	,make_element_event_manager:function(event_manager_id, element_jq, action_item_obj, delegate_set_event_manager_prop){

		if(_v.isNotValidStr(event_manager_id)){
			console.log("get_element_event_manager / _v.isNotValidStr(event_manager_id)");
			return null;
		}
		if(_v.isNotJQueryObj(element_jq)){
			console.log("get_element_event_manager / _v.isNotJQueryObj(element_jq)");
			return null;
		}
		if(this.is_not_valid_action_item_data_obj(action_item_obj)) {
			console.log("get_element_event_manager / this.is_not_valid_action_item_data_obj(action_item_obj)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_set_event_manager_prop)){
			console.log("get_element_event_manager / _obj.isNotValidDelegate(delegate_set_event_manager_prop)");
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
			,action_item_obj:action_item_obj
			,get_action_item_obj:function() {
				return this.action_item_obj;
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
			// @ private
			// @ Desc : 자신의 하위에 속한 숨김 자식(shy element) 엘리먼트 컨테이너의 참조. 자식 엘리먼트 추가시 이 컨테이너에 넣습니다.
			,child_shy_element_container_jq:null
			,set_child_shy_element_container_jq:function(child_shy_element_container_jq){
				if(child_shy_element_container_jq == null) return;
				this.child_shy_element_container_jq = child_shy_element_container_jq;
			}
			,get_child_shy_element_container_jq:function(){
				return this.child_shy_element_container_jq;
			}
			// @ private
			// @ Desc : 자신의 하위에 속한 엘리먼트 컨테이너의 참조. 자식 엘리먼트 추가시 이 컨테이너에 넣습니다.
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
			// @ private
			// @ Scope : Event Manager / em
			// @ Desc : 공식적으로 등록될 child shy element collection set을 추가할 경우 사용하는 메서드
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
			// @ private
			// @ Scope : Event Manager / em
			// @ Desc : 공식적으로 등록될 child element collection set을 제거할 경우 사용하는 메서드
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
			// @ Public
			// @ Scope : event manager
			// @ Desc : 자식 collection set을 반환
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
			// @ scope : Event Manager
			,get_element_type:function(element_type){

				var cur_action_item_obj = this.get_action_item_obj();

				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / element_event_manager / get_element_type / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}
				return cur_action_item_obj.get_element_type();

			}
			// @ Public
			// @ Desc : 추가, 변경, 삭제시의 정보를 전달합니다.
			,call_delegate_save_n_reload:function(cur_element_type, cur_event_type, cur_search_option_obj){

				if(_obj.is_not_valid_element_type(cur_element_type)){
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _obj.is_not_valid_element_type(cur_element_type)");
					return;
				}
				if(_obj.is_not_valid_event_type(cur_event_type)){
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _obj.is_not_valid_event_type(cur_event_type)");
					return;
				}
				var cur_delegate_save_n_reload = this.get_delegate_save_n_reload();
				if(_obj.isNotValidDelegate(cur_delegate_save_n_reload)){
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _obj.isNotValidDelegate(cur_delegate_save_n_reload");
					return;
				}
				var cur_action_item_obj = this.get_action_item_obj();

				console.log("HERE / call_delegate_save_n_reload / cur_element_type :: ",cur_element_type);
				console.log("HERE / call_delegate_save_n_reload / cur_event_type :: ",cur_event_type);
				console.log("HERE / call_delegate_save_n_reload / cur_search_option_obj :: ",cur_search_option_obj);
				console.log("HERE / call_delegate_save_n_reload / cur_action_item_obj :: ",cur_action_item_obj);

				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}
				var cur_element_id = cur_action_item_obj.get_coordinate();
				if(_v.is_not_valid_str(cur_element_id)) {
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _v.is_not_valid_str(cur_element_id)");
					return;
				}

				// 저장 이전에 처리해야 될 일들에 대해 먼저 처리합니다.
				this.call_delegate_before_save_n_reload();
				console.log("변경된 데이터를 저장하기 전에 자신의 element json 정보를 업데이트 합니다.");

				if( (_obj.ELEMENT_TYPE_SEARCH_LIST == cur_element_type || _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST == cur_element_type) && 
					_obj.EVENT_TYPE_UPDATE_ITEM == cur_event_type ){

					if(_obj.is_not_valid_search_option(cur_search_option_obj)){
						console.log("!Error! / element_event_manager / call_delegate_save_n_reload / this.is_not_valid_search_option(cur_search_option_obj)");
						return;
					}

					/*
					cur_element_key = cur_search_option_obj.select_option_key;
					cur_element_value = cur_search_option_obj.select_option_value;

					console.log(">>> cur_element_key :: ",cur_element_key);
					console.log(">>> cur_element_value :: ",cur_element_value);
					*/

					// 변경된 데이터를 저장하기 전에 자신의 element json 정보를 업데이트 합니다.

					cur_action_item_obj.set_action_name(cur_element_key);
					cur_action_item_obj.set_action_context(_json.parseJSON(cur_search_option_obj));

					//console.log(">>> cur_element_json.get_element_meta_info() : ",cur_element_json.get_element_meta_info().set_column_text(cur_element_key));

				} else if( _obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT == cur_element_type ){

					if(_obj.EVENT_TYPE_UPDATE_ITEM == cur_event_type){

						// action item으로 업데이트 시 바로 저장하면, 관리 로직이 따로 필요없을 듯!
						console.log("call_delegate_save_n_reload / 003 / Need to implement?");

					}

				} else if( _obj.EVENT_TYPE_INSERT_ITEM == cur_event_type || _obj.EVENT_TYPE_DELETE_ITEM == cur_event_type ){

					// key & value 를 모두 동일하게 설정
					cur_element_key = this.get_title_jq_value();
					cur_element_value = cur_element_key;

				} else {

					console.log("call_delegate_save_n_reload / Need to implement!");

				}
				cur_action_item_obj.set_event_manager(this);

				// REMOVE ME
				// var cur_outcome_obj = _action.get_outcome_obj(cur_element_id, cur_element_key, cur_element_value, cur_event_type, cur_element_prop_map);
				// cur_delegate_save_n_reload._func.apply(cur_delegate_save_n_reload._scope,[cur_outcome_obj]);

				var cur_outcome_obj = 
				_action.get_outcome_obj(
					// event_str
					cur_event_type
					// action_item_obj
					, cur_action_item_obj
				);
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
			// @ Public
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

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / get_sibling_element_event_manager_arr / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}

				if(has_myself === true){
					if(cur_action_item_obj.get_action_is_shy() && has_shy_child === true) {
						// 1.자신이 shy row인 경우
						cur_sibling_element_event_manager_arr.push(this);
					} else if(!cur_action_item_obj.get_action_is_shy()) {
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

				var before_action_item_obj = cur_before_sibling_element_event_manager.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(before_action_item_obj)) {
					console.log("!Error! / get_before_sibling_element_event_manager_arr / _action.is_not_valid_action_item_data_obj(before_action_item_obj)");
					return;
				}

				if(has_shy_child === true && before_action_item_obj.get_action_is_shy()) {

					cur_before_sibling_element_event_manager_arr.unshift(cur_before_sibling_element_event_manager);

				} else if(!before_action_item_obj.get_action_is_shy()) {

					cur_before_sibling_element_event_manager_arr.unshift(cur_before_sibling_element_event_manager);

				}


				var loop_limit_counter = 0;
				var loop_limit = 1000;
				while(cur_before_sibling_element_event_manager.get_before_sibling_event_manager() != null){
					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_before_sibling_element_event_manager = cur_before_sibling_element_event_manager.get_before_sibling_event_manager();

					if(cur_before_sibling_element_event_manager == null) break;

					if( has_shy_child === true && before_action_item_obj.get_action_is_shy()){

						// shy mode 객체일 경우에도 포함.
						cur_before_sibling_element_event_manager_arr.unshift(cur_before_sibling_element_event_manager);

					} else if(!before_action_item_obj.get_action_is_shy()){

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

				var after_action_item_obj = cur_after_sibling_element_event_manager.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(after_action_item_obj)) {
					console.log("!Error! / get_after_sibling_element_event_manager_arr / _action.is_not_valid_action_item_data_obj(after_action_item_obj)");
					return;
				}
				var loop_limit_counter = 0;
				var loop_limit = 1000;
				while(cur_after_sibling_element_event_manager.get_after_sibling_event_manager() != null){

					// 다음에 변경할 이벤트 매니저를 가져옵니다.
					cur_after_sibling_element_event_manager = cur_after_sibling_element_event_manager.get_after_sibling_event_manager();
					if(cur_after_sibling_element_event_manager == null) break;

					if( has_shy_child === true && after_action_item_obj.get_action_is_shy()){

						// shy mode 객체일 경우에도 포함.
						cur_after_sibling_element_event_manager_arr.push(cur_after_sibling_element_event_manager);

					// } else if(cur_after_sibling_element_event_manager.get_element_meta_info().get_is_shy() === false){
					} else if(!after_action_item_obj.get_action_is_shy()){

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

				// 나 자신의 정보를 가져온다.
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / get_all_sibling_element_set_arr / _action.is_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}
				
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

								if(cur_child_element_set.get_action_item_obj().get_action_is_shy()) continue;

								// 자기 자신은 제외한다.
								if(cur_child_element_set.get_action_item_obj().get_coordinate() === cur_action_item_obj.get_coordinate()) continue;

								cur_all_sibling_element_set_arr.push(cur_child_element_set);

							} // for deep end
						} // for inner end
					} // for end

				} else {

					// 자신이 최상위 객체라면 부모 객체가 없다.
					// 자신의 형제들만 가져온다.
					cur_all_sibling_element_set_arr = 
					this.get_sibling_element_set_arr(
						// has_myself
						false
						// has_shy_mode
						,false
					);
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
				if(_dates.is_not_valid_time_format_double_digit(new_time)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_value_time_jq / _dates.is_not_valid_time_format_double_digit(new_time)");
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

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / show_input_mode / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}

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

				} else if( _obj.ELEMENT_TYPE_SEARCH_LIST == cur_action_item_obj.get_element_type() || _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST == cur_action_item_obj.get_element_type() ) {

					consoler.say("em_sim / 3 /",cur_title);
					consoler.say("em_sim / 3 / ELEMENT_TYPE_SEARCH_LIST | ELEMENT_TYPE_TABLE_SEARCH_LIST");

					this.show_input_mode_search_n_select();

				} else if( 	_obj.ELEMENT_TYPE_TIME_HH_MM == cur_action_item_obj.get_element_type() || 
							_obj.ELEMENT_TYPE_TIME_MM_SS == cur_action_item_obj.get_element_type() ||
							_obj.ELEMENT_TYPE_TABLE_TIME_HH_MM == cur_action_item_obj.get_element_type() || 
							_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_action_item_obj.get_element_type()
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
						_self.shape_sibling_element(
							// has_myself
							false
						);
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

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / on_mouse_over / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}
				var cur_element_type = cur_action_item_obj.get_element_type();

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

						var cur_action_item_obj = _self.get_action_item_obj();
						if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
							console.log("!Error! / on_mouse_over / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
							return;
						}

						if(cur_action_item_obj.get_action_is_shy()){
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
			// @ private
			// @ scope : event manager
			// @ Desc : 	1. 형제 엘리먼트의 귀퉁이 모양을 둥글게 재조정합니다.
			// 				2. 첫번째 열인 경우만 eject btn을 노출합니다.
			,shape_sibling_element:function(has_myself){

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
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / set_search_list_data_on_input_group / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}
				var cur_element_type = cur_action_item_obj.get_element_type();


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

						var cur_action_item_obj = _self.get_action_item_obj();
						if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
							console.log("!Error! / do_on_event / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
							return;
						}

						cur_action_item_obj.set_action_name(_self.get_title_input_jq_value());
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

				var _self = this;
				var cur_time_input_group_jq = this.get_time_input_group_jq();
				if(cur_time_input_group_jq == undefined){
					console.log("!Error! / set_event_time_editor_on_input_group / cur_time_input_group_jq == undefined");
					return;
				}


				this.off_time_input_group_jq();

				var cur_time_input_group_jq_input_jq = this.get_time_input_group_jq_input_jq();
				if(cur_time_input_group_jq_input_jq == undefined){
					console.log("!Error! / set_event_time_editor_on_input_group / cur_time_input_group_jq_input_jq == undefined");
					return;
				}

				var cur_btn_time_plus_jq = this.get_time_input_group_jq_btn_time_plus_jq();
				if(cur_btn_time_plus_jq == undefined){
					console.log("!Error! / set_event_time_editor_on_input_group / cur_btn_time_plus_jq == undefined");
					return;
				}

				var cur_btn_time_minus_jq = this.get_time_input_group_jq_btn_time_minus_jq();
				if(cur_btn_time_minus_jq == undefined){
					console.log("!Error! / set_event_time_editor_on_input_group / cur_btn_time_minus_jq == undefined");
					return;
				}

				var cur_btn_time_ok_jq = this.get_time_input_group_jq_btn_time_ok_jq();
				if(cur_btn_time_ok_jq == undefined){
					console.log("!Error! / set_event_time_editor_on_input_group / cur_btn_time_ok_jq == undefined");
					return;
				}

				var cur_btn_time_cancel_jq = this.get_time_input_group_jq_btn_time_cancel_jq();
				if(cur_btn_time_cancel_jq == undefined){
					console.log("!Error! / set_event_time_editor_on_input_group / cur_btn_time_cancel_jq == undefined");
					return;
				}





				// assign time. check time mode.
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / set_event_time_editor_on_input_group / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}

				var cur_element_type = cur_action_item_obj.get_element_type();
				if(cur_action_item_obj.is_item_title_n_time_hh_mm()){

					// 사용자 입력 시간 정보를 시간 입력 엘리먼트에 지정합니다.
					var cur_time_jq = this.get_time_jq();
					var cur_time = cur_time_jq.html();
					this.set_value_time_input_group_jq_input_jq(cur_time);

				} else {
					
					console.log("!Error! / Not supported element type / " + cur_element_type);
					return;

				}


				// remove all events
				this.off_time_input_group_jq_input_jq();
				this.off_time_input_group_jq_btn_time_plus_jq();
				this.off_time_input_group_jq_btn_time_minus_jq();
				this.off_time_input_group_jq_btn_time_ok_jq();
				this.off_time_input_group_jq_btn_time_cancel_jq();

				var set_minutes_offset = function(offset_minutes){
					var hour_n_minutes_str = cur_time_input_group_jq_input_jq.val();
					var new_offset_moment = _dates.get_moment_minutes_offset_from_hour_n_minutes_str(hour_n_minutes_str, offset_minutes);
					var new_hour_n_minutes_str = _dates.get_hour_n_minutes_str_from_moment_obj(new_offset_moment);
					cur_time_input_group_jq_input_jq.val(new_hour_n_minutes_str);
				}

				var set_seconds_offset = function(offset_seconds){
					var minutes_n_seconds_str = cur_time_input_group_jq_input_jq.val();
					var new_offset_moment = _dates.get_moment_seconds_offset_from_minutes_n_seconds_str(minutes_n_seconds_str, offset_seconds);
					var new_minutes_n_seconds_str = _dates.get_minutes_n_seconds_str_from_moment_obj(new_offset_moment);
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
						
						is_valid_time_format_str = _dates.is_valid_time_format_str(cur_time_double_digit_str, _dates.DATE_TYPE_HH_MM);

					} else if( 	_obj.ELEMENT_TYPE_TIME_MM_SS == cur_element_type || 
								_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == cur_element_type || 
								_obj.ELEMENT_TYPE_LIST_ROW_TIME_MM_SS_N_INPUT_TEXT == cur_element_type
								){
						
						is_valid_time_format_str = _dates.is_valid_time_format_str(cur_time_double_digit_str, _dates.DATE_TYPE_MM_SS);
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

					if(!check_time_format_valid()){
						console.log("!Error! / do_on_event_btn_time_ok / !check_time_format_valid()");
						return;
					}

					_self.hide_all();
					_self.show_view_mode();
					_self.release();

					var cur_action_item_obj = _self.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
						console.log("!Error! / do_on_event_btn_time_ok / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
						return;
					}

					// update time
					var cur_time_str = cur_time_input_group_jq_input_jq.val();
					var cur_time_arr = cur_time_str.split(":");

					if(cur_action_item_obj.is_item_title_n_time_hh_mm()){

						console.log("사용자가 입력한 시와 분 정보를 가져옴.");

						// 사용자가 입력한 시와 분 정보를 가져옴.
						var cur_hours_str = cur_time_arr[0];
						var cur_minutes_str = cur_time_arr[1];

						var cur_time_format_str = "";
						var cur_hours = parseInt(cur_hours_str);
						var cur_minutes = parseInt(cur_minutes_str); 

						// update seconds
						var seconds_total = (cur_hours * 3600) + (cur_minutes * 60);

						// var cur_prop_map = _self.get_element_meta_info().get_prop_map();
						// cur_prop_map.__seconds = seconds_total;
						// cur_prop_map.__time_hh_mm = cur_time_str;

						console.log("HERE / 015");
						cur_action_item_obj.update_time_hh_mm(seconds_total);

						_self.set_value_time_jq(cur_time_str);

					} else {

						console.log("Need to implement!");
						return;

					}

					_self.call_delegate_save_n_reload(cur_element_type, _obj.EVENT_TYPE_UPDATE_ITEM);
					_self.release();

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

					var cur_action_item_obj = cur_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
						console.log("!Error! / get_shy_child_element_set / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
						return;
					}

					// REMOVE ME
					//is_shy = cur_element_set.get_meta_info().get_is_shy();
					is_shy = cur_action_item_obj.get_action_is_shy();
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

					var next_action_item_obj = next_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(next_action_item_obj)) {
						console.log("!Error! / get_shy_sibling_element_set / _action.is_not_valid_action_item_data_obj(next_action_item_obj)");
						return;
					}

					// REMOVE ME
					//if(next_element_set.get_meta_info().get_is_shy()) {
					if(next_action_item_obj.get_action_is_shy()) {
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
				var cur_action_item_obj = shy_sibling_element_set.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
					console.log("!Error! / move_shy_sibling_element_set_above_this / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
					return;
				}
				if(cur_action_item_obj.is_item_title_n_time_hh_mm()) {
					// console.log("시간 타입인 경우, 이동한 열에 맞게 시간을 변경해줍니다.");

					// 이전 객체가 있다면 이전 객체의 시간을 가져옵니다.
					var prev_time_sec = 0;
					var prev_action_item_obj = prev_element_set.get_action_item_obj();
					if(_action.is_valid_action_item_data_obj(prev_action_item_obj)) {

						if(prev_action_item_obj.is_not_item_title_n_time_hh_mm()) {
							console.log("!Error! / move_shy_sibling_element_set_above_this / prev_action_item_obj.is_not_item_title_n_time_hh_mm()");
							return;
						}
						// console.log("이전 객체가 있다면 이전 객체의 시간을 가져옵니다.");

						prev_time_sec = prev_action_item_obj.get_time_sec();

					} 

					// 이후 객체가 있다면 이후 객체의 시간을 가져옵니다.
					var next_time_sec = 0;
					var next_action_item_obj = next_element_set.get_action_item_obj();
					if(_action.is_valid_action_item_data_obj(next_action_item_obj)) {

						if(next_action_item_obj.is_not_item_title_n_time_hh_mm()) {
							console.log("!Error! / move_shy_sibling_element_set_above_this / next_action_item_obj.is_not_item_title_n_time_hh_mm()");
							return;
						}

						// console.log("이후 객체가 있다면 이전 객체의 시간을 가져옵니다.");
						next_time_sec = next_action_item_obj.get_time_sec();
					}

					var five_minutes_in_secs = 300; // 60 * 5
					if( prev_time_sec == 0 && next_time_sec > 0 ) {
						// 첫번째 엘리먼트로 옮겼습니다.
						// 다음 시간으로부터 5분 전으로 변경합니다.

						console.log("HERE / 001");

						cur_action_item_obj.update_time_hh_mm(next_time_sec - five_minutes_in_secs);

					} else if( prev_time_sec > 0 && next_time_sec == 0 ) {
						// 마지막 엘리먼트로 옮겼습니다.
						// 다음 시간으로부터 5분 후로 변경합니다.

						console.log("HERE / 002");

						cur_action_item_obj.update_time_hh_mm(prev_time_sec + five_minutes_in_secs);

					} else if( prev_time_sec > 0 && next_time_sec > 0 ) {
						// 리스트의 처음과 마지막이 아닌 이전과 이후 엘리먼트가 모두 있습니다.
						// 이전과 이후 엘리먼트의 사이 값으로 새로운 시간을 지정해 줍니다.

						if( prev_time_sec == next_time_sec ) {
							// 두 시간이 동일한 경우는 같은 시간으로 넘겨줍니다.

							console.log("HERE / 003");

							cur_action_item_obj.update_time_hh_mm(prev_time_sec);

						} else if( prev_time_sec < next_time_sec ) {
							// 두 시간이 차이가 있는 경우

							var ten_minutes_in_secs = 600; // 60 * 10
							var time_diff_in_secs = (next_time_sec - prev_time_sec);
							if( ten_minutes_in_secs <= time_diff_in_secs ){
								// 두 시간의 차이가 10분 이상인 경우, 두 시간 사이 값의 중간 값을 설정해줍니다.
								// 중간값이 5분 단위로 제어되도록 설정합니다.

								console.log("HERE / 004");

								cur_action_item_obj.update_time_hh_mm(prev_time_sec + parseInt(time_diff_in_secs / 2));
									
							} else {
								// 두 시간의 차이가 10분 미만인 경우, 두 시간 사이 값중 작은 값을 설정해줍니다.

								console.log("HERE / 005");

								cur_action_item_obj.update_time_hh_mm(prev_time_sec);
									
							} // inner if end

						} // inner if end

					} // outer if end

					// action item의 시간이 업데이트되었습니다. 
					// 화면에 표시되는 시간을 업데이트 합니다.
					var new_time_hh_mm = cur_action_item_obj.get_time_sec();
					if(_v.is_not_unsigned_number(new_time_hh_mm)) {
						console.log("!Error! / move_shy_sibling_element_set_above_this / _v.is_not_unsigned_number(new_time_hh_mm)");
						return;
					}

					if(_dates.is_valid_time_format_double_digit(new_time_hh_mm)){
						shy_sibling_element_set.get_event_manager().set_value_time_jq(new_time_hh_mm);
					}
				}
			}
			// @ private
			// @ Desc : 선택한 엘리먼트 아래에 input group을 이동시킴.
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
		action_item_obj.set_element_event_manager(element_event_manager);

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

			// TEST
			// if(title_for_test.indexOf("Greeting") > -1) {
			// 	consoler.on();				
			// }

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

			// 검사중인 엘리먼트가 shy mode인지 확인합니다.

			var cur_action_item_obj = event_manager_on_mousemove.get_action_item_obj();
			if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
				console.log("!Error! / add_mousemove_callback_set / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
				return;
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


			if(!is_hover && !cur_action_item_obj.get_action_is_shy()){

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

			} else if(!is_hover && cur_action_item_obj.get_action_is_shy()) {

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

			} else if(is_hover && cur_action_item_obj.get_action_is_shy()) {

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


			} else if(is_hover && !cur_action_item_obj.get_action_is_shy()) {

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

						var child_action_item_obj = cur_child_element_set.get_action_item_obj();
						if(_action.is_not_valid_action_item_data_obj(child_action_item_obj)) {
							console.log("!Error! / add_mousemove_callback_set / _action.is_not_valid_action_item_data_obj(child_action_item_obj)");
							return;
						}

						var child_title_for_debug = cur_child_element_set.get_event_manager().get_title_jq_value();
						consoler.say("mmc / 5-2-1 / ",title_for_test);
						consoler.say("mmc / 5-2-1 / idx : ",idx);
						consoler.say("mmc / 5-2-1 / child_title_for_debug : ",child_title_for_debug);
						consoler.say("mmc / 5-2-1 / child_action_item_obj : ",child_action_item_obj);

						if(child_action_item_obj.get_action_is_shy()){

							consoler.say("mmc / 5-2-1-1 / ",title_for_test);
							consoler.say("mmc / 5-2-1-1 / idx : ",idx);
							consoler.say("mmc / 5-2-1-1 / child_title_for_debug : ",child_title_for_debug);

							consoler.say("mmc / 5-2-1-1 / 자식 객체가 shy mode 입니다.");
							consoler.say("mmc / 5-2-1-1 / child_action_item_obj : ",child_action_item_obj);
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
	,get_outcome_obj:function(event_str, action_item_obj){

		if(_obj.is_not_valid_event_type(event_str)){
			console.log("!Error! / get_select_option_obj / _obj.is_not_valid_event_type(event_str)");
			return null;
		}
		if(this.is_not_valid_action_item_data_obj(action_item_obj)) {
			console.log("!Error! / get_select_option_obj / this.is_not_valid_action_item_data_obj(action_item_obj)");
			return null;
		}

		return {_event:event_str,_action_item_obj:action_item_obj};
	}
	// @ Public
	// @ Desc : 엘리먼트들이 모여 구성된 리스트, 테이블들의 엘리먼트 집합을 관리하는 객체. 리스트나 테이블등을 구성한 뒤에는 이 콜렉션 셋을 반환한다.
	// ex > 엘리먼트 간의 참조 구조
	// 부모 리스트 <- 부모 리스트의 열 <- 리스트 <- 리스트의 열 <- 자식 리스트 <- 자식 리스트의 열	
	,make_element_collection_set:function(element_collection_id){

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
			,push_new_element_set:function(action_item_obj, event_manager, idx){

				// REMOVE ME
				// element_meta_info --> action_item_obj

				if(_action.is_not_valid_action_item_data_obj(action_item_obj)) {
					console.log("!Error! / push_new_element_set / _action.is_not_valid_action_item_data_obj(action_item_obj)");
					return;
				}
				if(event_manager == undefined) {
					console.log("!Error! / push_new_element_set / event_manager == undefined");
					return;
				}

				// REMOVE ME
				// var cur_element_set = _obj.get_element_set(element_meta_info, event_manager);
				var cur_element_set = _action.make_element_set(action_item_obj, event_manager);

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

				console.log("HERE / add_element");

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

					// REMOVE ME
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

					var prev_action_item_obj = prev_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(prev_action_item_obj)) {
						console.log("!Error! / add_element_set / _action.is_not_valid_action_item_data_obj(prev_action_item_obj)");
						return;
					}

					var next_element_set_arr = [];
					var idx;
					var length = this.element_set_arr.length;
					for(idx = 0; idx < length; idx++){
						var cur_element_set = this.element_set_arr[idx];
						
						next_element_set_arr.push(cur_element_set);

						var cur_action_item_obj = cur_element_set.get_action_item_obj();
						if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
							console.log("!Error! / add_element_set / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
							return;
						}

						// REMOVE ME
						//if(cur_element_set.get_meta_info().get_list_row_id() == prev_element_set.get_meta_info().get_list_row_id()){
						if(cur_action_item_obj.get_coordinate() == prev_action_item_obj.get_coordinate()){

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

				var action_item_obj_delete = element_set.get_action_item_obj();
				if(_action.is_not_valid_action_item_data_obj(action_item_obj_delete)) {
					console.log("!Error! / remove_element_set / _action.is_not_valid_action_item_data_obj(action_item_obj_delete)");
					return;
				}





				var next_element_set_arr = [];
				var idx;
				var length = this.element_set_arr.length;
				for(idx = 0; idx < length; idx++){
					var cur_element_set = this.element_set_arr[idx];

					// console.log("제거한 엘리먼트 셋은 배열에서도 제거됩니다.");

					var cur_action_item_obj = cur_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
						console.log("!Error! / remove_element_set / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
						return;
					}

					if(cur_action_item_obj.get_coordinate() === action_item_obj_delete.get_coordinate()){
						// 제거하려는 엘리먼트라면 배열에 추가하지 않는다.
						continue;
					}

					next_element_set_arr.push(cur_element_set);
				}
				this.element_set_arr = next_element_set_arr;
			}
			,debug_element_set_arr:function(cur_all_element_set_arr){
				for (var i = 0; i < cur_all_element_set_arr.length; i++) {
					var cur_element_set = cur_all_element_set_arr[i];

					var cur_action_item_obj = cur_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
						console.log("!Error! / debug_element_set_arr / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
						return;
					}

					console.log("debug_element_set_arr / ",cur_action_item_obj.get_action_name());
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

					var cur_action_item_obj = cur_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
						console.log("!Error! / say_element_set_arr / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
						return;
					}

					var cur_title = cur_element_set.get_event_manager().get_title_jq_value();
					console.log("");
					console.log(tap_str + "sesa / 2 / idx : " + idx);
					console.log(tap_str + "sesa / 2 / is_shy : " + cur_action_item_obj.get_action_is_shy());
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

						var cur_action_item_obj = cur_element_set.get_action_item_obj();
						if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
							console.log("!Error! / ecs_get_masked_element_set_arr / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
							return;
						}

						// 입력 그룹을 제외한 엘리먼트 셋을 돌려줍니다.
						// TYPE으로 정의하도록 수정해야 합니다.

						// REMOVE ME
						//if(!cur_element_set.get_meta_info().get_is_shy()) {
						if(!cur_action_item_obj.get_action_is_shy()) {
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

					var cur_action_item_obj = cur_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
						console.log("!Error! / get_all_element_set_arr_recursive / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
						return;
					}

					// no shy mode
					// REMOVE ME
					//if(cur_element_set.get_meta_info().get_is_shy()) {
					if(cur_action_item_obj.get_action_is_shy()) {	
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
						if(cur_element_set == undefined) continue;

						var cur_action_item_obj = cur_element_set.get_action_item_obj();
						if(_action.is_not_valid_action_item_data_obj(cur_action_item_obj)) {
							console.log("!Error! / get_event_manager_from_element_collection_set_arr / _action.is_not_valid_action_item_data_obj(cur_action_item_obj)");
							return;
						}

						// shy mode 제거.
						// REMOVE ME
						//if(cur_element_set.get_meta_info().get_is_shy()) continue;
						if(cur_action_item_obj.get_action_is_shy()) continue;

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

	// @ Public
	// @ Desc : action item obj와 event manager의 통합 객체, element set.
	// 이것으로 엘리먼트들의 부모, 형제 관계를 제어한다.
	// 단, 엘리먼트는 리스트의 열, 테이블의 컬럼의 필드를 의미한다.
	// 엘리먼트들이 모여 구성된 리스트나 테이블을 한꺼번에 제어하는 것은 element_collection_set을 이용한다.	
	,make_element_set:function(action_item_obj, event_manager){

		// REMOVE ME params
		// meta_info --> action item object

		if(_action.is_not_valid_action_item_data_obj(action_item_obj)) {
			console.log("!Error! / make_element_set / _action.is_not_valid_action_item_data_obj(action_item_obj)");
			return;
		}
		if(event_manager == undefined) {
			console.log("!Error! / make_element_set / event_manager == undefined");
			return;
		}

		var element_set = {
			action_item_obj:action_item_obj
			,get_action_item_obj:function() {
				return this.action_item_obj;
			}
			// REMOVE ME
			/*
			meta_info:meta_info
			,get_meta_info:function(){
				return this.meta_info;
			}
			*/
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

								has_shy_child = cur_element_set.get_action_item_obj().get_action_is_shy();

								// REMOVE ME
								// has_shy_child = cur_element_set.get_meta_info().get_is_shy();

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
}