// @ Desc : action collection, action item의 객체를 화면에 그리는 js 클래스.
airborne.bootstrap.obj.__action = {
	COLOR_TYPE_LIST_ROW_WHITE:"list-group-item-default"
	,COLOR_TYPE_LIST_ROW_GREEN:"list-group-item-success"
	,COLOR_TYPE_LIST_ROW_BLUE:"list-group-item-info"
	,COLOR_TYPE_LIST_ROW_YELLOW:"list-group-item-warning"
	,COLOR_TYPE_LIST_ROW_RED:"list-group-item-danger"
	,COLOR_FOCUS_YELLOW:"#FFCC66"
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
	// PLACE HOLDER
	,PLACE_HOLDER_NOT_ASSIGNED:"NOT ASSIGNED"
	// EVENT TYPE
	,EVENT_TYPE_INSERT_ITEM:"EVENT_TYPE_INSERT_ITEM"
	,EVENT_TYPE_UPDATE_ITEM:"EVENT_TYPE_UPDATE_ITEM"
	,EVENT_TYPE_DELETE_ITEM:"EVENT_TYPE_DELETE_ITEM"
	,EVENT_TYPE_ADD_SELECT_OPTION:"EVENT_TYPE_ADD_SELECT_OPTION"
	,EVENT_TYPE_ADD_ROW:"EVENT_TYPE_ADD_ROW"
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
			event_type == this.EVENT_TYPE_ADD_SELECT_OPTION ||
			event_type == this.EVENT_TYPE_INSERT_TABLE_ROW_ITEMS ||
			event_type == this.EVENT_TYPE_UPDATE_TABLE_ROW_ITEMS ||
			event_type == this.EVENT_TYPE_DELETE_TABLE_ROW_ITEMS ||
			event_type == this.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER
			) {

			return true;	
		} 

		return false;
	}
	,INPUT_TYPE_DEFAULT:"INPUT_TYPE_DEFAULT"
	,INPUT_TYPE_TITLE:"INPUT_TYPE_TITLE"
	,INPUT_TYPE_TIME:"INPUT_TYPE_TIME"

	,ACTION_COLLECTION_TYPE_LIST:1
	,ACTION_COLLECTION_TYPE_TABLE:2
	,ACTION_ITEM_TYPE_TITLE_ONLY:1
	,ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM:2
	,ACTION_ITEM_TYPE_TITLE_N_TIME_MM_SS:3
	,ACTION_ITEM_TYPE_SELECT_BOX:4
	,ACTION_ITEM_TYPE_TITLE_ONLY_FIXED:5
	,ACTION_ITEM_TYPE_TITLE_ONLY_ADDABLE:6
	// @ Desc : select box 타입. 열을 추가할 수 있습니다.
	,ACTION_ITEM_TYPE_SELECT_BOX_ADDABLE:7
	,is_valid_action_collection_data_obj:function(action_collection_data_obj) {

		if(this.is_not_valid_action_data_obj(action_collection_data_obj)) {
			return false;
		}
		if(_v.is_not_unsigned_number(action_collection_data_obj.action_collection_type)) {
			return false;
		}
		if(_v.is_not_valid_str(action_collection_data_obj.action_collection_type_name)) {
			return false;
		}

		return true;
	}	
	,is_not_valid_action_collection_data_obj:function(action_collection_data_obj) {
		return !this.is_valid_action_collection_data_obj(action_collection_data_obj);
	}
	,is_valid_action_item_data_obj:function(action_item_data_obj) {

		if(this.is_not_valid_action_data_obj(action_item_data_obj)) {
			return false;
		}
		if(_v.is_not_unsigned_number(action_item_data_obj.action_item_type)) {
			return false;
		}
		if(_v.is_not_valid_str(action_item_data_obj.action_item_type_name)) {
			return false;
		}

		return true;
	}
	,is_not_valid_action_item_data_obj:function(action_item_data_obj) {
		return !this.is_valid_action_item_data_obj(action_item_data_obj);
	}	
	,is_not_valid_action_data_obj:function(action_data_obj) {
		return !this.is_valid_action_data_obj(action_data_obj);
	}
	,is_valid_action_data_obj:function(action_data_obj) {

		if(action_data_obj == undefined) {
			return false;
		}
		if(_v.is_not_unsigned_number(action_data_obj.action_id)) {
			return false;
		}
		if(_v.is_not_valid_str(action_data_obj.action_name)) {
			return false;
		}
		if(_v.is_not_valid_str(action_data_obj.action_hash_key)) {
			return false;
		}

		return true;
	}
	,is_not_valid_action_item_obj:function(action_item_obj){
		return !this.is_valid_action_item_obj(action_item_obj);
	}
	,is_valid_action_item_obj:function(action_item_obj){

		if(action_item_obj == undefined) {
			return false;
		} else if(this.is_not_valid_action_obj(action_item_obj)) {
			return false;
		} else if(action_item_obj.get_action_item_type == undefined) {
			return false;
		} else if(_v.is_not_unsigned_number(action_item_obj.get_action_item_type())) {
			return false;
		} else if(action_item_obj.get_action_item_type_name == undefined) {
			return false;
		} else if(_v.is_not_valid_str(action_item_obj.get_action_item_type_name())) {
			return false;
		}

		return true;
	}
	,is_not_valid_action_obj:function(action_obj){
		return !this.is_valid_action_obj(action_obj);
	}
	,is_valid_action_obj:function(action_obj){

		if(action_obj == undefined) {
			return false;
		} else if(action_obj.get_action_id == undefined) {
			return false;
		} else if(action_obj.get_action_name == undefined) {
			return false;
		} else if(_v.is_not_valid_str(action_obj.get_action_name())) {
			return false;
		} else if(action_obj.get_action_context == undefined) {
			return false;
		} else if(action_obj.get_action_hash_key == undefined) {
			return false;
		}

		return true;
	}	
	// @ Private
	// @ Desc : 빈 action obj를 돌려줍니다.
	,get_action_obj_empty:function() {

		var action_obj = {
			parent_action_object:null
			,parent_action_object_add_on:null
			,sibling_action_obj_before:null
			,sibling_action_obj_after:null
			,child_first_action_obj:null
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
			,action_depth_arr:null
			,set_action_depth_arr_from_root:function(action_depth_arr) {
				if(_v.is_not_valid_array(action_depth_arr)) {
					console.log("!Error! / set_action_depth_arr_from_root / _v.is_not_valid_array(action_depth_arr)");
					return;
				}

				var root_action_obj = this.get_root_action_obj();
				if(_action.is_not_valid_action_obj(root_action_obj)) {
					console.log("!Error! / set_action_depth_arr_from_root / _action.is_not_valid_action_obj(root_action_obj)");
					return;
				}

				root_action_obj.set_action_depth_arr(action_depth_arr);

			}
			// @ Private
			// @ Scope 	: action object
			// @ Desc 	: root 객체부터 폭포수 방식으로 action_depth_arr를 업데이트 합니다.
			,set_action_depth_arr:function(action_depth_arr) {
				if(_v.is_not_valid_array(action_depth_arr)) {
					console.log("!Error! / set_action_depth_arr / _v.is_not_valid_array(action_depth_arr)");
					return;
				}
				this.action_depth_arr = action_depth_arr;

				var cur_children = this.get_children();
				for(var idx = 0;idx < cur_children.length;idx++) {
					var cur_child_action_obj = cur_children[idx];
					if(_action.is_not_valid_action_obj(cur_child_action_obj)) {
						console.log("!Error! / set_action_depth_arr / _action.is_not_valid_action_obj(cur_child_action_obj)");
						return;
					}

					cur_child_action_obj.set_action_depth_arr(action_depth_arr);
				}

				// WARNING : Add on 타입은 진행하지 않습니다.

			}
			// @ Private
			// copy시 사용
			,push_action_obj_depth_arr:function(depth) {

				if(_v.is_not_unsigned_number(depth)) {
					console.log("!Error! / push_action_obj_depth_arr / _v.is_not_unsigned_number(depth)");
					return;
				}

				var action_depth_arr = this.get_action_depth_arr();

				if(action_depth_arr == undefined) {
					action_depth_arr = [];
					action_depth_arr.push([this]);
				} else if(action_depth_arr.length == depth){
					action_depth_arr.push([this]);
				} else {
					action_depth_arr[depth].push(this);
				}
				this.set_action_depth_arr_from_root(action_depth_arr);

			}
			,get_action_depth_arr:function() {
				return this.action_depth_arr;
			}
			,get_action_depth:function(has_shy) {

				if(has_shy == undefined) {
					has_shy = false;
				}

				var cur_action_depth_arr = this.get_action_depth_arr();
				if(_v.is_not_valid_array(cur_action_depth_arr)) {
					console.log("!Error! / get_action_depth / _v.is_not_valid_array(cur_action_depth_arr)");
					return;
				}

				var cur_depth = this.get_depth();
				if(_v.is_not_unsigned_number(cur_depth)) {
					console.log("!Error! / get_action_depth / _v.is_not_unsigned_number(cur_depth)");
					return;
				}

				if(cur_action_depth_arr.length <= cur_depth) {
					console.log("!Error! / get_action_depth / cur_action_depth_arr.length <= cur_depth");
					return;
				}

				var cur_action_depth = cur_action_depth_arr[cur_depth];
				if(has_shy == false) {
					// 기본값은 shy element를 포함하지 않습니다.
					var cur_action_depth_no_shy = [];
					for(var idx = 0; idx < cur_action_depth.length; idx++) {
						var cur_action_obj = cur_action_depth[idx];
						if(cur_action_obj.get_action_is_shy()) {
							continue;
						}

						cur_action_depth_no_shy.push(cur_action_obj);
					}

					cur_action_depth = cur_action_depth_no_shy;
				}

				return cur_action_depth;
			}
			,external_select_box_option_list:null
			,event_manager:null
			,set_action_data:function(action_data_obj, coordinate, action_hierarchy_search_map, action_depth_arr, depth) {

				if(_action.is_not_valid_action_data_obj(action_data_obj)) {
					console.log("!Error! / set_action_data / _action.is_not_valid_action_data_obj(action_data_obj) / ",action_data_obj);
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

				// ACTION DEPTH
				if(depth == undefined) {
					depth = 0;
				} else {
					depth += 1;
				}
				if(action_depth_arr == undefined) {
					action_depth_arr = [];
					action_depth_arr.push([this]);
				} else if(action_depth_arr.length == depth){
					action_depth_arr.push([this]);
				} else {
					action_depth_arr[depth].push(this);
				}
				this.set_action_depth_arr_from_root(action_depth_arr);

				// CHILDREN ACTION OBJ LIST
				if(action_data_obj.children_action_object_list != undefined) {
					for(var idx = 0;idx < action_data_obj.children_action_object_list.length;idx++) {

						var child_action_data_obj = action_data_obj.children_action_object_list[idx];
						var child_coordinate = this.get_coordinate() + "-" + idx;
						var child_action_obj = _action.get_action_obj(child_action_data_obj, child_coordinate, action_hierarchy_search_map, action_depth_arr, depth);

						// 자신이 자식 객체의 부모 객체가 됩니다.
						child_action_obj.set_parent(this);

						if(idx == 0) {
							this.set_first_child_action_obj(child_action_obj);
						}

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
						var add_on_action_obj = _action.get_action_obj(add_on_action_data_obj, add_on_coordinate, action_hierarchy_search_map);

						this.push_add_on(add_on_action_obj, add_on_coordinate, action_hierarchy_search_map);
					}
				}

				if(_action.is_valid_action_collection_data_obj(action_data_obj, false)) {

					this.set_action_collection_type(action_data_obj.action_collection_type);
					this.set_action_collection_type_name(action_data_obj.action_collection_type_name);

				} else if(_action.is_valid_action_item_data_obj(action_data_obj, false)) {

					this.set_action_item_type(action_data_obj.action_item_type);
					this.set_action_item_type_name(action_data_obj.action_item_type_name);

				}

				// SET COORDINATE, ORDER?
	
			}
			// @ Public
			// @ Desc : 자신을 복제해서 새로운 action obj를 만듭니다.
			,copy:function(new_action_name, parent_action_obj, src_action_obj, is_shy) {

				if(_action.is_not_valid_action_obj(src_action_obj)) {
					parent_action_obj = this.get_parent();
				}
				if(_action.is_not_valid_action_obj(src_action_obj)) {
					src_action_obj = this;
				}
				if(is_shy == undefined) {
					is_shy = false;
				}

				var cur_sibling_action_obj_after = src_action_obj.get_sibling_action_obj_after();
				if(_action.is_not_valid_action_obj(src_action_obj)) {
					console.log("!Error! / copy / _action.is_not_valid_action_obj(src_action_obj)");
					return;
				}

				var consoler = airborne.console.get();
				consoler.off();

				var action_obj_copy = _action.get_action_obj_empty();
				if(_v.is_valid_str(new_action_name)) {
					action_obj_copy.set_action_name(new_action_name);	
				} else {
					action_obj_copy.set_action_name(src_action_obj.get_action_name());	
				}
				action_obj_copy.set_action_hierarchy_search_map(src_action_obj.get_action_hierarchy_search_map());

				consoler.say("copy / 000 / action_name_copy : ",action_obj_copy.get_action_name());
				consoler.say("copy / 000 / action copy : ",action_obj_copy);

				if(src_action_obj.is_list() || src_action_obj.is_table()) {

					action_obj_copy.set_action_collection_type(src_action_obj.get_action_collection_type());
					action_obj_copy.set_action_collection_type_name(src_action_obj.get_action_collection_type_name());

				} else if(src_action_obj.is_item()) {

					action_obj_copy.set_action_item_type(src_action_obj.get_action_item_type());
					action_obj_copy.set_action_item_type_name(src_action_obj.get_action_item_type_name());

					if(src_action_obj.is_item_title_n_time_hh_mm()){

						var cur_action_context = src_action_obj.get_action_context();
						action_obj_copy.set_action_context(cur_action_context);

					} // end inner if

				} // end outer if

				action_obj_copy.set_parent(parent_action_obj);
				action_obj_copy.set_action_is_shy(is_shy);
				action_obj_copy.set_changed(true);


				// shy 객체를 하나 추가합니다.
				// 조건 
				// 1.자신의 자식이 있다면 첫번재 객체만 복사합니다.
				// 2.action name은 무조건 기본값으로 재설정됩니다. List -> ${parent_action_name} Sublist, Table -> ${parent_action_name} Subtable, Item -> New item
				var cur_first_child_obj = src_action_obj.get_first_child();
				if(_action.is_valid_action_obj(cur_first_child_obj)) {
					consoler.say("copy / 000-1 / cur_first_child_obj : ",cur_first_child_obj.get_action_name());

					var new_child_action_name = "";
					if(cur_first_child_obj.is_list()) {
						consoler.say("copy / 000-1-1 / cur_first_child_obj");
						new_child_action_name = action_obj_copy.get_action_name() + " - Sublist";
					} else if(cur_first_child_obj.is_table()) {
						consoler.say("copy / 000-1-2 / cur_first_child_obj");
						new_child_action_name = action_obj_copy.get_action_name() + " - Subtable";
					} else if(cur_first_child_obj.is_item()) {
						consoler.say("copy / 000-1-3 / cur_first_child_obj");
						new_child_action_name = "New Item";
					} else {
						console.log("!Error! / copy / Not implemented!");
					}

					var cur_first_child_obj_copy = this.copy(new_child_action_name, action_obj_copy, cur_first_child_obj, true);
					consoler.say("copy / 000-1 / cur_first_child_obj_copy : ",cur_first_child_obj_copy.get_action_name());
					
				}
				if(parent_action_obj.has_no_children()) {
					// 새로 생긴 자식과 부모 객체의 연결.
					parent_action_obj.set_first_child_action_obj(action_obj_copy);
				}


				if(is_shy === true) {
					// shy 모드일 경우는 복사하는 객체가 자식 객체를 가지고 있는 엘리먼트인 경우, 
					// 초기값으로 1개의 자식 객체만 세팅해서 연결해줍니다.
					this.reset_root_coordinate();
					return action_obj_copy;
				}

				// 복사를 하면 자신의 다음 객체로 만듭니다.
				src_action_obj.set_sibling_action_obj_after(action_obj_copy);
				action_obj_copy.set_sibling_action_obj_before(src_action_obj);

				consoler.say("copy / 001-1 / before action : ",src_action_obj.get_action_name());
				consoler.say("copy / 001-2 / after action : ",action_obj_copy.get_action_name());

				// 다음 객체가 있었다면 앞 뒤 형제 관계를 만들어줍니다.
				var cur_sibling_action_obj_after_after = undefined;
				if(cur_sibling_action_obj_after != undefined) {

					consoler.say("copy / 002-1 / after action : ",action_obj_copy.get_action_name());
					consoler.say("copy / 002-2 / after-after action : ",cur_sibling_action_obj_after.get_action_name());

					action_obj_copy.set_sibling_action_obj_after(cur_sibling_action_obj_after);	
					cur_sibling_action_obj_after.set_sibling_action_obj_before(action_obj_copy);
					cur_sibling_action_obj_after.set_changed(true);

					// update coordinate, order - 자신의 다음 형제 action obj를 모두 바꿔줘야 합니다. / 자식들도 영향을 받습니다.
					cur_sibling_action_obj_after_after = cur_sibling_action_obj_after.get_sibling_action_obj_after();
				} else {
					cur_sibling_action_obj_after_after = action_obj_copy;
				}

				var max_loop_cnt = 50;
				for(var idx=0;idx < max_loop_cnt; idx++) {

					console.log("XXX / cur_sibling_action_obj_after_after ::: ",cur_sibling_action_obj_after_after);
					
					var cur_sibling_action_obj_after_after = cur_sibling_action_obj_after_after.get_sibling_action_obj_before();
					if(_action.is_not_valid_action_obj(cur_sibling_action_obj_after_after)) {
						break;
					}
					cur_sibling_action_obj_after_after.set_changed(true);

					consoler.say("copy / 003-1 / set_changed : ",cur_sibling_action_obj_after_after.get_action_name());

				} // for end

				this.reset_root_coordinate();

				// CHECK - 추가한 객체가 있는지 확인합니다.
				var cur_coordinate_copy = action_obj_copy.get_coordinate();
				if(_v.is_not_valid_str(cur_coordinate_copy)) {
					console.log("!Error! / copy / _v.is_not_valid_str(cur_coordinate_copy)");
					return;
				}
				var cur_root_action_obj = this.get_root_action_obj();
				if(_action.is_not_valid_action_obj(cur_root_action_obj)) {
					console.log("!Error! / copy / _action.is_not_valid_action_obj(cur_root_action_obj)");
					return;
				}

				var output_action_obj_from_root_action_obj = cur_root_action_obj.search(cur_coordinate_copy);
				var output_action_obj_from_this = this.search(cur_coordinate_copy);
				var is_same = _action.compare_action(output_action_obj_from_root_action_obj, output_action_obj_from_this);
				if(!is_same) {
					console.log("!Error! / copy / is_not_same");
					return;
				}

				var cur_depth = src_action_obj.get_depth();
				action_obj_copy.set_action_depth_arr_from_root(src_action_obj.get_action_depth_arr());
				action_obj_copy.push_action_obj_depth_arr(cur_depth);

				return action_obj_copy;

			}
			// @ Public
			// @ Desc : 자신을 삭제합니다.
			,remove:function() {

				var consoler = airborne.console.get();
				consoler.off();

				var root_action_obj = this.get_root_action_obj();
				var parent_action_obj = this.get_parent();

				if(this.is_first() && this.is_last()) {

					consoler.say("remove / 001-1 / 자신 밖에 없는 경우. shy 모드로 변경");

					// 자신 밖에 없는 경우. shy 모드로 변경
					this.set_action_is_shy(true);
					this.set_changed(true);

				} else if(this.is_first() && this.is_not_last()) {

					// this,2,3,... --> 2,3,...

					// 첫번째 action obj이고 형제 action이 있는 경우.
					var cur_sibling_action_obj_after = this.get_sibling_action_obj_after();
					if(_action.is_not_valid_action_obj(cur_sibling_action_obj_after)) {
						console.log("!Error! / delete / _action.is_not_valid_action_obj(cur_sibling_action_obj_after)");
						return;
					}

					consoler.say("remove / 002-1 / 첫번째 action obj이고 형제 action이 있는 경우.");
					consoler.say("remove / 002-2 / this action name :: ",this.get_action_name());
					consoler.say("remove / 002-3 / after action name :: ",cur_sibling_action_obj_after.get_action_name());

					this.set_sibling_action_obj_after();
					this.set_changed(true);
					cur_sibling_action_obj_after.set_sibling_action_obj_before();
					cur_sibling_action_obj_after.set_changed(true);

					// DEBUG
					var cur_sibling_action_obj_after_before = cur_sibling_action_obj_after.get_sibling_action_obj_before();
					consoler.say("remove / 002-4 / after before action :: ",cur_sibling_action_obj_after_before);
					consoler.say("remove / 002-5 / after action :: ",cur_sibling_action_obj_after.get_action_name());

					// 첫번째 엘리먼트가 사라졌습니다. 다음 엘리먼트를 부모와 연결합니다.
					if(this.has_parent()) {
						parent_action_obj.set_first_child_action_obj(cur_sibling_action_obj_after);
					}

				} else if(this.is_not_first() && this.is_not_last()) {

					// 1,this,2,3,... --> 1,2,3,...

					// 앞, 뒤로 형제 action이 있는 경우.
					var cur_sibling_action_obj_before = this.get_sibling_action_obj_before();
					if(_action.is_not_valid_action_obj(cur_sibling_action_obj_before)) {
						console.log("!Error! / delete / _action.is_not_valid_action_obj(cur_sibling_action_obj_before)");
						return;
					}
					// 뒤의 형제 action과 나의 action과의 링크 참조를 제거.
					var cur_sibling_action_obj_after = this.get_sibling_action_obj_after();
					if(_action.is_not_valid_action_obj(cur_sibling_action_obj_after)) {
						console.log("!Error! / delete / _action.is_not_valid_action_obj(cur_sibling_action_obj_after)");
						return;
					}

					// DEBUG - BEFORE
					consoler.say("remove / 002-1 / 첫번째 action obj이고 형제 action이 있는 경우.");
					consoler.say("remove / 002-2 / before action name :: ",cur_sibling_action_obj_before.get_action_name());
					consoler.say("remove / 002-3 / this action name :: ",this.get_action_name());
					consoler.say("remove / 002-4 / after action name :: ",cur_sibling_action_obj_after.get_action_name());

					// 자신의 형제 참조를 초기화합니다.
					this.set_sibling_action_obj_before();
					this.set_sibling_action_obj_after();
					this.set_changed(true);

					// 자신의 action을 제외한 앞, 뒤 형제끼리 연결
					cur_sibling_action_obj_before.set_sibling_action_obj_after(cur_sibling_action_obj_after);
					cur_sibling_action_obj_after.set_sibling_action_obj_before(cur_sibling_action_obj_before);
					cur_sibling_action_obj_before.set_changed(true);
					cur_sibling_action_obj_after.set_changed(true);

					// DEBUG - AFTER
					consoler.say("remove / 002-5 / before action name :: ",cur_sibling_action_obj_before.get_action_name());
					consoler.say("remove / 002-6 / after action name :: ",cur_sibling_action_obj_before.get_sibling_action_obj_after().get_action_name());

				} else if(this.is_not_first() && this.is_last()) {

					// ...,3,4,this --> ...,3,4
					// 앞의 형제 가져옴. 나의 action과의 링크 참조를 제거.
					var cur_sibling_action_obj_before = this.get_sibling_action_obj_before();
					if(_action.is_not_valid_action_obj(cur_sibling_action_obj_before)) {
						console.log("!Error! / delete / _action.is_not_valid_action_obj(cur_sibling_action_obj_before)");
						return;
					}

					// 자신이 마지막 action
					this.set_sibling_action_obj_before();
					this.set_changed(true);

					// DEBUG - BEFORE
					consoler.say("remove / 003-1 / BEFORE / 자신이 마지막 action");
					consoler.say("remove / 003-2 / BEFORE / before action name :: ",cur_sibling_action_obj_before.get_action_name());
					consoler.say("remove / 003-3 / BEFORE / this action name :: ",this.get_action_name());

					cur_sibling_action_obj_before.set_sibling_action_obj_after();
					cur_sibling_action_obj_before.set_changed(true);

					// DEBUG - AFTER
					consoler.say("remove / 003-4 / AFTER / before action name :: ",cur_sibling_action_obj_before.get_action_name());
					consoler.say("remove / 003-5 / AFTER / after action :: ",cur_sibling_action_obj_before.get_sibling_action_obj_after());

				} else {
					console.log("!Error! / delete / Not implemented!");
				}

				// update search map
				var cur_action_hierarchy_search_map = this.get_action_hierarchy_search_map();
				if(cur_action_hierarchy_search_map == undefined) {
					console.log("!Error! / remove / cur_action_hierarchy_search_map == undefined");
					return;
				}
				var cur_coordinate = this.get_coordinate();
				if(_v.is_not_valid_str(cur_coordinate)) {
					console.log("!Error! / remove / _v.is_not_valid_str(cur_coordinate)");
					return;
				}
				cur_action_hierarchy_search_map[cur_coordinate] = undefined;
				this.set_action_hierarchy_search_map(cur_action_hierarchy_search_map);

				// CHECK
				var search_outcome = root_action_obj.search(cur_coordinate);
				if(_action.is_valid_action_obj(search_outcome)) {
					console.log("!Error! / remove / _action.is_valid_action_obj(search_outcome)");
					console.log("search_outcome ::: ",search_outcome);
					console.log("search_outcome ::: ",search_outcome.get_coordinate());
					console.log("cur_coordinate ::: ",cur_coordinate);
					return;
				}

				this.reset_root_coordinate();

			}
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: 자신을 앞,뒤 형제 객체 사이로 옮깁니다. 형제 객체는 index로 지정합니다.
			,dive_into_indixes:function(idx_before_action_item_obj, idx_after_action_item_obj) {

				if(idx_before_action_item_obj === idx_after_action_item_obj) {
					console.log("!Error! / dive_into_indixes / idx_before_action_item_obj === idx_after_action_item_obj");
					return;
				}

				var cur_parent_action_obj = this.get_parent();
				if(_action.is_not_valid_action_obj(cur_parent_action_obj)) {
					console.log("!Error! / dive_into_indixes / _action.is_not_valid_action_obj(cur_parent_action_obj)");
					return;
				}

				var idx_this = this.get_idx();
				if(_v.is_unsigned_number(idx_before_action_item_obj) && idx_this === idx_before_action_item_obj) {
					console.log("!Error! / dive_into_indixes / idx_this === idx_before_action_item_obj");
					return;
				}
				if(_v.is_unsigned_number(idx_after_action_item_obj) && idx_this === idx_after_action_item_obj) {
					console.log("!Error! / dive_into_indixes / idx_this === idx_after_action_item_obj");
					return;
				}

				var new_before_action_item_obj = undefined;
				if(_v.is_unsigned_number(idx_before_action_item_obj)) {
					new_before_action_item_obj = cur_parent_action_obj.get_child(idx_before_action_item_obj);
				}
				var new_after_action_item_obj = undefined;
				if(_v.is_unsigned_number(idx_after_action_item_obj)) {
					new_after_action_item_obj = cur_parent_action_obj.get_child(idx_after_action_item_obj);
				}

				this.dive_into_them(new_before_action_item_obj, new_after_action_item_obj);
			}

			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: 자신을 앞,뒤 형제 객체 사이로 옮깁니다.
			,dive_into_them:function(new_before_action_item_obj, new_after_action_item_obj) {

				var consoler = airborne.console.get();
				consoler.off();

				// 새로 연결되는 action item 검사
				if(new_before_action_item_obj != undefined && _action.is_not_valid_action_item_obj(new_before_action_item_obj)) {
					console.log("!Error! / dive_into_them / _action.is_not_valid_action_item_obj(new_before_action_item_obj)");
					return;
				}
				if(new_before_action_item_obj != undefined && (new_before_action_item_obj.get_coordinate() === this.get_coordinate())) {

					console.log("dive_into_them / new_before_action_item_obj.get_coordinate() ::: ",new_before_action_item_obj.get_coordinate());
					console.log("dive_into_them / this.get_coordinate() ::: ",this.get_coordinate());

					console.log("!Error! / dive_into_them / new_before_action_item_obj.get_coordinate() === this.get_coordinate()");
					return;
				}
				if(new_after_action_item_obj != undefined && _action.is_not_valid_action_item_obj(new_after_action_item_obj)) {
					console.log("!Error! / dive_into_them / _action.is_not_valid_action_item_obj(new_after_action_item_obj)");
					return;
				}
				if(new_after_action_item_obj != undefined && (new_after_action_item_obj.get_coordinate() === this.get_coordinate())) {
					console.log("!Error! / dive_into_them / new_after_action_item_obj.get_coordinate() === this.get_coordinate()");
					return;
				}

				// 자신의 기존 앞뒤 형제 객체들을 가져옴. 객체 검사
				var prev_before_action_item_obj = this.get_sibling_action_obj_before();
				if(prev_before_action_item_obj != undefined && _action.is_not_valid_action_item_obj(prev_before_action_item_obj)) {
					console.log("!Error! / dive_into_them / _action.is_not_valid_action_item_obj(prev_before_action_item_obj)");
					return;
				}
				var prev_after_action_item_obj = this.get_sibling_action_obj_after();
				if(prev_after_action_item_obj != undefined && _action.is_not_valid_action_item_obj(prev_after_action_item_obj)) {
					console.log("!Error! / dive_into_them / _action.is_not_valid_action_item_obj(prev_after_action_item_obj)");
					return;
				}

				// 자신의 부모 객체의 참조를 가져옴.
				var parent_action_obj = this.get_parent();
				if(_action.is_valid_action_item_obj(prev_before_action_item_obj)) {
					// 자신과 연결을 제거
					prev_before_action_item_obj.set_sibling_action_obj_after();
					this.set_sibling_action_obj_before();
				}
				if(_action.is_valid_action_item_obj(prev_after_action_item_obj)) {
					// 자신과 연결을 제거
					prev_after_action_item_obj.set_sibling_action_obj_before();
					this.set_sibling_action_obj_after();
				}
				if(_action.is_valid_action_item_obj(prev_before_action_item_obj) && _action.is_valid_action_item_obj(prev_after_action_item_obj)){
					// 기존 앞뒤 객체 끼리 연결 
					prev_before_action_item_obj.set_sibling_action_obj_after(prev_after_action_item_obj);
					prev_after_action_item_obj.set_sibling_action_obj_before(prev_before_action_item_obj);
				}

				if(_action.is_valid_action_item_obj(new_before_action_item_obj)) {
					// 자신과 연결
					new_before_action_item_obj.set_sibling_action_obj_after(this);
					this.set_sibling_action_obj_before(new_before_action_item_obj);
				}
				if(_action.is_valid_action_item_obj(new_after_action_item_obj)) {
					// 자신과 연결
					new_after_action_item_obj.set_sibling_action_obj_before(this);
					this.set_sibling_action_obj_after(new_after_action_item_obj);
				}

				// 순서 변경 이후 첫번째 객체를 가져와 부모 객체가 있다면 연결해줍니다.
				var first_sibling_action_item_obj = undefined;
				if(_action.is_valid_action_obj(parent_action_obj)) {
					first_sibling_action_item_obj = this.get_first_sibling_action_obj();
				}
				if(_action.is_valid_action_item_obj(first_sibling_action_item_obj)) {
					parent_action_obj.set_first_child_action_obj(first_sibling_action_item_obj);	
				} else {
					console.log("!Error! / _action.is_not_valid_action_item_obj(first_sibling_action_item_obj)");
				}

				this.reset_root_coordinate();

				// CHECK
				var max_loop_cnt = 100;
				var check_action_item_after = this.get_first_sibling_action_obj();
				var check_action_item_before = undefined;
				for(var idx = 0;idx < max_loop_cnt;idx++) {
					var action_item_after_name = check_action_item_after.get_action_name();
					var action_item_after_coordinate = check_action_item_after.get_coordinate();
					consoler.say("dive_into_them / " + idx + " / action_item_after_name :: " + action_item_after_name);
					consoler.say("dive_into_them / " + idx + " / action_item_after_coordinate :: " + action_item_after_coordinate);

					check_action_item_after = check_action_item_after.get_sibling_action_obj_after();
					if(_action.is_not_valid_action_item_obj(check_action_item_after)) {
						break;
					}
					check_action_item_before = check_action_item_after;
				}
				
				for(var idx = 0;idx < max_loop_cnt;idx++) {
					var action_item_before_name = check_action_item_before.get_action_name();
					var action_item_before_coordinate = check_action_item_before.get_coordinate();
					consoler.say("dive_into_them / " + idx + " / action_item_before_name :: ",action_item_before_name);
					consoler.say("dive_into_them / " + idx + " / action_item_before_coordinate :: " + action_item_before_coordinate);

					check_action_item_before = check_action_item_before.get_sibling_action_obj_before();
					if(_action.is_not_valid_action_item_obj(check_action_item_before)) {
						break;
					}
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
			// @ Public
			// @ Desc : add on 객체의 부모 참조
			,set_parent_add_on:function(parent_action_object_add_on) {
				this.parent_action_object_add_on = parent_action_object_add_on;
			}
			,get_parent_add_on:function() {
				return this.parent_action_object_add_on;
			}
			,has_parent_add_on:function() {

				var parent_action_obj_add_on = this.get_parent_add_on();
				if(parent_action_obj_add_on == undefined) {
					return false;
				}
				return true;
			}
			,has_no_parent_add_on:function() {
				return !this.has_parent_add_on();
			}
			,get_children_cnt:function() {
				var children_action_object_array = this.get_children();
				return children_action_object_array.length;
			}
			,get_children:function() {

				var first_child_action_obj = this.get_first_child_action_obj();
				if(_action.is_not_valid_action_obj(first_child_action_obj)) {
					return [];
				}

				var max_loop_cnt = 50;
				var next_child_sibling_action_obj = first_child_action_obj;
				var cur_children_cnt = 0;
				var children_action_obj_array = [];
				for(var idx = 0;idx < max_loop_cnt;idx++) {
					if(_action.is_valid_action_obj(next_child_sibling_action_obj)) {
						children_action_obj_array.push(next_child_sibling_action_obj);
						cur_children_cnt++;
					} else {
						break;
					}

					next_child_sibling_action_obj = next_child_sibling_action_obj.get_sibling_action_obj_after();
				}

				return children_action_obj_array;
			}
			,get_child:function(idx) {

				var children_action_object_array = this.get_children();

				if(children_action_object_array == undefined) {
					children_action_object_array = [];
				}

				var length = children_action_object_array.length;
				if(-1 < idx && idx < length) {
					return children_action_object_array[idx];	
				}

				return null;
			}
			// @ Public
			// @ Scope 	: Action Table Obj
			// @ Desc 	: 테이블 필드 객체일 경우, 같은 row의 action item의 배열을 돌려줍니다.
			,get_table_row_sibling_arr:function() {
				if(this.is_not_table_child_column_list_field_item()) {
					console.log("!Error! / get_table_row_sibling_arr / this.is_not_table()");
					return;
				}

				var table_action_obj = this.get_parent().get_parent();
				return table_action_obj.get_table_row_field_arr(this.get_idx());
			}
			// @ Public
			// @ Scope 	: Action Table Obj
			// @ Desc 	: 테이블 형태로 사용할 경우, 테이블의 필드 객체들을 row 기준으로 필드 배열을 돌려줍니다.
			,get_table_row_field_arr:function(selected_idx) {
				if(this.is_not_table()) {
					console.log("!Error! / get_table_row_field_arr / this.is_not_table()");
					return;
				}

				if(_v.is_not_unsigned_number(selected_idx)) {
					console.log("!Error! / get_table_row_field_arr / _v.is_not_unsigned_number(selected_idx)");
					return;
				}

				var cur_children_cnt = this.get_children_cnt();
				if(cur_children_cnt <= selected_idx) {
					console.log("!Error! / get_table_row_field_arr / cur_children_cnt <= selected_idx");
					return;
				}

				var table_column_list_obj_arr = this.get_children();
				if(_v.is_not_valid_array(table_column_list_obj_arr)) {
					console.log("!Error! / get_table_row_field_arr / _v.is_not_valid_array(table_column_list_obj_arr)");
					return;
				}

				var table_row_field_action_arr = [];
				for(var idx = 0;idx < table_column_list_obj_arr.length;idx++) {
					var table_column_list_obj = table_column_list_obj_arr[idx];
					if(_action.is_not_valid_action_obj(table_column_list_obj)) {
						console.log("!Error! / on_mouse_over / _action.is_not_valid_action_obj(table_column_list_obj)");
						return;
					}

					var table_column_field_action_item_obj = table_column_list_obj.get_child(selected_idx);
					if(_action.is_not_valid_action_item_obj(table_column_field_action_item_obj)) {
						console.log("!Error! / on_mouse_over / _action.is_not_valid_action_item_obj(table_column_field_action_item_obj)");
						return;
					}

					table_row_field_action_arr.push(table_column_field_action_item_obj);
				}

				return table_row_field_action_arr;
			}
			,set_first_child_action_obj:function(child_first_action_obj) {

				if(_action.is_not_valid_action_obj(child_first_action_obj)) {
					console.log("!Error! / set_first_child_action_obj / _action.is_not_valid_action_obj(child_first_action_obj)");
					return;
				}

				this.child_first_action_obj = child_first_action_obj;
			}
			,get_first_child_action_obj:function() {
				return this.child_first_action_obj;
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
			,is_not_first:function() {
				return !this.is_first();
			}
			,is_first:function() {

				var cur_sibling_action_obj_before = this.get_sibling_action_obj_before();
				if(cur_sibling_action_obj_before != undefined) {
					return false;
				}
				return true;
			}
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: 자신이 속한 형제 리스트에서 몇번째 인덱스인지 알려줍니다.
			,get_idx:function() {

				var cur_first_sibling_action_obj = this.get_first_sibling_action_obj();
				if(_action.is_not_valid_action_obj(cur_first_sibling_action_obj)) {
					console.log("!Error! / get_sibling_idx / this.is_not_valid_action_obj(cur_first_sibling_action_obj)");
					return -1;
				}

				var cur_sibling_action_obj_after = cur_first_sibling_action_obj;
				var max_loop_cnt = 50;
				for(var idx = 0; idx < max_loop_cnt; idx++) {
					
					if(cur_sibling_action_obj_after == undefined) {
						console.log("!Error! / get_sibling_idx / cur_sibling_action_obj_after == undefined");
						return -1;
					} else if(_action.is_not_valid_action_obj(cur_sibling_action_obj_after)) {
						console.log("!Error! / get_sibling_idx / this.is_not_valid_action_obj(cur_sibling_action_obj_after)");
						return -1;
					}

					var cur_coordinate = this.get_coordinate();
					if(_v.is_not_valid_str(cur_coordinate)) {
						console.log("!Error! / get_sibling_idx / _v.is_not_valid_str(cur_coordinate)");
						return -1;
					}
					var cur_sibling_action_obj_after_coordinate = cur_sibling_action_obj_after.get_coordinate();
					if(_v.is_not_valid_str(cur_sibling_action_obj_after_coordinate)) {
						console.log("!Error! / get_sibling_idx / _v.is_not_valid_str(cur_sibling_action_obj_after_coordinate)");
						return -1;
					}

					if(cur_coordinate === cur_sibling_action_obj_after_coordinate) {
						return idx;
					}

					cur_sibling_action_obj_after = cur_sibling_action_obj_after.get_sibling_action_obj_after();
				}

				return -1;
			}
			,get_first_sibling_action_obj:function(repeat_cnt) {

				var max_repeat_cnt = 50;
				if(repeat_cnt == undefined) {
					repeat_cnt = 0;
				} else if(max_repeat_cnt < repeat_cnt) {
					console.log("!Error! / get_first_sibling_action_obj / max_repeat_cnt < repeat_cnt");
					return;
				} else {
					repeat_cnt++;
				}

				if(this.is_first()) {
					return this;
				}

				var cur_sibling_action_obj_before = this.get_sibling_action_obj_before();
				if(_action.is_not_valid_action_obj(cur_sibling_action_obj_before)) {
					console.log("!Error! / get_first_sibling_action_obj / this.is_not_valid_action_obj(cur_sibling_action_obj_before)");
					return;
				}

				return cur_sibling_action_obj_before.get_first_sibling_action_obj(repeat_cnt);
			}
			,set_sibling_action_obj_after:function(sibling_action_obj_after) {
				this.sibling_action_obj_after = sibling_action_obj_after;
			}
			,get_sibling_action_obj_after:function() {
				return this.sibling_action_obj_after;
			}
			,get_sibling_action_obj_list:function() {
				var parent_action_obj = this.get_parent();
				if(_action.is_valid_action_obj(parent_action_obj)) {
					return parent_action_obj.get_children();
				}
				return [];
			}
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: root로 부터 자신의 depth를 구합니다.
			,get_depth:function() {

				var max_depth_loop = 10;
				var prev_parent_obj = this;
				var cur_depth = 0;
				for(var idx = 0; idx < max_depth_loop; idx++) {
					prev_parent_obj = prev_parent_obj.get_parent();
					if(prev_parent_obj == undefined) {
						break;
					}

					cur_depth += 1;
				}

				// DEBUG
				// var cur_action_name = this.get_action_name();
				// var cur_coordinate = this.get_coordinate();
				// console.log("get_depth / " + cur_action_name + " / " + cur_coordinate +  " / " + cur_depth,this);

				return cur_depth;
			}
			,is_not_last:function() {
				return !this.is_last();
			}
			,is_last:function() {
				var cur_sibling_action_obj_after = this.get_sibling_action_obj_after();
				if(cur_sibling_action_obj_after != undefined) {
					return false;
				}
				return true;
			}
			,get_last_sibling_action_obj:function() {
				if(this.is_last()) {
					return this;
				}
				var cur_sibling_action_obj_after = this.get_sibling_action_obj_after();
				if(_action.is_not_valid_action_obj(cur_sibling_action_obj_after)) {
					console.log("!Error! / get_first_sibling_action_obj / _action.is_not_valid_action_obj(cur_sibling_action_obj_after)");
					return;
				}

				return cur_sibling_action_obj_after.get_last_sibling_action_obj();
			}
			,is_only_one:function() {
				if(this.is_first() && this.is_last()) {
					return true;
				}
				return false;
			}
			,push_add_on:function(add_on_action_obj, coordinate, action_hierarchy_search_map) {

				if(_action.is_not_valid_action_obj(add_on_action_obj)) {
					console.log("!Error! / push_add_on / _action.is_not_valid_action_obj(add_on_action_obj)");
					return;
				}

				// 자신이 자식 객체의 add on 부모 객체가 됩니다.
				add_on_action_obj.set_parent_add_on(this);

				var add_on_action_object_list = this.get_add_on_list();
				add_on_action_object_list.push(add_on_action_obj);
			}
			,get_add_on_list:function() {
				if(this.add_on_action_object_list == undefined) {
					this.add_on_action_object_list = [];
				}
				return this.add_on_action_object_list;
			}
			,set_add_on_list:function(new_add_on_list) {
				this.add_on_action_object_list = new_add_on_list;
			}
			,remove_from_add_on_list:function(add_on_action_obj_to_remove) {
				if(_action.is_not_valid_action_obj(add_on_action_obj_to_remove)) {
					console.log("!Error! / remove_from_add_on_list / _action.is_not_valid_action_obj(add_on_action_obj_to_remove)");
					return;
				}

				add_on_action_obj_to_remove.set_parent_add_on();

				var new_add_on_list = [];
				var add_on_action_obj_list = this.get_add_on_list();
				for(var idx = 0; idx < add_on_action_obj_list.length; idx++) {
					var add_on_action_obj = add_on_action_obj_list[idx];

					if(add_on_action_obj.get_coordinate() === add_on_action_obj_to_remove.get_coordinate()){
						continue;
					}

					new_add_on_list.push(add_on_action_obj);
				}

				this.set_add_on_list(new_add_on_list);
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
			,get_action_is_not_shy:function() {
				return !this.action_is_shy;
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
			,get_root_action_obj:function() {
				if(this.parent_action_object == undefined) {
					return this;	
				}

				return this.parent_action_object.get_root_action_obj();
			}
			// @ Private
			// @ Desc : 관계 정보를 root action item을 시작으로 업데이트 합니다.
			,reset_root_coordinate:function(){
				var cur_root_action_obj = this.get_root_action_obj();
				if(_action.is_not_valid_action_obj(cur_root_action_obj)) {
					console.log("!Error! / copy / _action.is_not_valid_action_obj(cur_root_action_obj)");
					return;
				}
				cur_root_action_obj.reset_coordinate();
			}
			// @ Public
			// @ Desc : 관계 정보를 전체적으로 업데이트합니다. order 정보도 함께 업데이트 합니다.
			,reset_coordinate:function(coordinate, idx) {

				var consoler = airborne.console.get();
				consoler.off();

				var action_name = this.get_action_name();
				if(this.has_no_parent()) {
					// 1-1. root action obj입니다.
					this.set_coordinate("root");
					this.set_action_order(0);

				} else if(this.has_parent()) {
					// 2-1. root action obj가 아닙니다.
					if(_v.is_not_valid_str(coordinate)) {
						console.log("!Error! / reset_coordinate / _v.is_not_valid_str(coordinate)");
						return;
					}
					if(_v.is_not_unsigned_number(idx)) {
						console.log("!Error! / reset_coordinate / _v.is_not_unsigned_number(idx)");
						return;
					}

					this.set_coordinate(coordinate + "-" + idx);
					this.set_action_order(100 * idx);
				} else {
					console.log("!Error! / reset_coordinate / Unknown Error Occured!");
					return;
				} // end if
				
				if(this.has_children()) {

					// 2-1. 자식 객체가 있다면 reset 해줍니다.
					var cur_chilren_action_obj_arr = this.get_children();
					if(_v.is_not_valid_array(cur_chilren_action_obj_arr)) {
						console.log("!Error! / reset_coordinate / _v.is_not_valid_arr(cur_chilren_action_obj_arr)");
						return;
					}

					for(var idx=0;idx < cur_chilren_action_obj_arr.length;idx++) {
						var cur_child_action_obj = cur_chilren_action_obj_arr[idx];
						cur_child_action_obj.reset_coordinate(this.get_coordinate(), idx);
					}

				} // end if

				// CHECK 
				var cur_coordinate = this.get_coordinate();
				consoler.say("reset_coordinate / action_name :: ",action_name);
				consoler.say("reset_coordinate / cur_coordinate :: ",cur_coordinate);

				this.reset_search_map();
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
			// @ Private
			// @ Desc : 내용이 바뀌었을 경우, 검색 맵의 내용을 업데이트합니다.
			,reset_search_map:function() {

				var consoler = airborne.console.get();
				consoler.off();

				var cur_coordinate =  this.get_coordinate();

				if(_v.is_not_valid_str(cur_coordinate)) {
					console.log("!Error! / reset_search_map / _v.is_not_valid_str(cur_coordinate)");
					return;
				}

				var cur_action_hierarchy_search_map = this.get_action_hierarchy_search_map();

				consoler.say("reset_search_map / cur_coordinate :: ",cur_coordinate);
				consoler.say("reset_search_map / cur_action_hierarchy_search_map :: ",cur_action_hierarchy_search_map);

				cur_action_hierarchy_search_map[cur_coordinate] = this;
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
			,is_not_table_child_column_list_field_item:function() {
				return !this.is_table_child_column_list_field_item();
			}
			// @ Public
			// @ Scope 	 : action obj
			// @ Desc 	 : 테이블에 속한 컬럼의 필드 action item인지 확인.
			,is_table_child_column_list_field_item:function() {

				var cur_parent_action_obj = this.get_parent();
				if(_action.is_not_valid_action_obj(cur_parent_action_obj)) {
					console.log("!Error! / is_table_child_column_list / _action.is_not_valid_action_obj(cur_parent_action_obj)");
					return;
				}

				// DEBUG
				if(cur_parent_action_obj.is_table_child_column_list() && this.is_item()) {
					return true;
				}
				return false;
			}
			,is_table_child_column_list:function() {
				var cur_parent_action_obj = this.get_parent();
				if(cur_parent_action_obj == undefined) {
					return false;
				}
				if(_action.is_not_valid_action_obj(cur_parent_action_obj)) {
					console.log("!Error! / is_table_child_column_list / _action.is_not_valid_action_obj(cur_parent_action_obj)");
					return;
				}

				if(cur_parent_action_obj.is_table() && this.is_list()) {
					return true;
				}
				return false;
			}
			,is_table:function() {
				var action_collection_type = this.get_action_collection_type();
				return (_action.ACTION_COLLECTION_TYPE_TABLE === action_collection_type)?true:false;				
			}
			,is_not_table:function() {
				return !this.is_table();
			}
			,is_not_item:function() {
				return !this.is_item();
			}
			,is_item:function() {
				if(	this.is_item_title_only() || 
					this.is_item_title_only_addable() || 
					this.is_item_title_n_time_hh_mm() || 
					this.is_item_title_n_time_mm_ss() || 
					this.is_item_select_box() ||
					this.is_item_title_only_fixed() ||
					this.is_item_select_box_addable()
					) {

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
			,is_not_item_select_box:function() {
				return !this.is_item_select_box();
			}
			,is_item_title_only_fixed:function() {
				var action_item_type = this.get_action_item_type();
				return (_action.ACTION_ITEM_TYPE_TITLE_ONLY_FIXED === action_item_type)?true:false;
			}
			,is_item_title_only_addable:function() {
				var action_item_type = this.get_action_item_type();
				return (_action.ACTION_ITEM_TYPE_TITLE_ONLY_ADDABLE === action_item_type)?true:false;
			}
			,is_not_item_select_box_addable:function() {
				return !this.is_item_select_box_addable();
			}
			,is_item_select_box_addable:function() {
				var action_item_type = this.get_action_item_type();
				return (_action.ACTION_ITEM_TYPE_SELECT_BOX_ADDABLE === action_item_type)?true:false;
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

				var cur_element_event_manager = this.get_event_manager();
				if(cur_element_event_manager == undefined) {
					console.log("!Error! / update_time_hh_mm / cur_element_event_manager == undefined / " + cur_action_name);
					return;
				}
				cur_element_event_manager.set_value_time_jq(time_hh_mm_obj.time_hh_mm);

				var new_json_str_time_hh_mm = JSON.stringify(time_hh_mm_obj);
				this.set_action_context(new_json_str_time_hh_mm);
			}
			,get_time_hh_mm_obj:function() {

				// title_n_time_hh_mm 타입인 경우만 진행합니다.
				if(this.is_not_item_title_n_time_hh_mm()) {
					console.log("!Error! / get_time_hh_mm_obj / this.is_not_item_title_n_time_hh_mm()");
					return;
				}
				var json_str_time_hh_mm = this.get_action_context();
				if(_v.is_not_valid_str(json_str_time_hh_mm)) {
					return;
				}
				var time_hh_mm_obj = _json.parseJSON(json_str_time_hh_mm);
				if(time_hh_mm_obj == undefined) {
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
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: Table인 경우, 테이블이 가지고 있는 모든 action item obj를 포함한 리스트를 반환합니다.
			,get_table_action_item_obj_list:function() {
				if(this.is_not_table()) {
					return [];
				}

				var colspan_cnt = this.get_children_cnt();
				if(_v.is_not_unsigned_number(colspan_cnt)) {
					console.log("!Error! / get_table_action_item_obj_list / _v.is_not_unsigned_number(colspan_cnt)");
					return;
				}

				var first_child_action_list_obj = this.get_child(0);
				if(_action.is_not_valid_action_obj(first_child_action_list_obj)) {
					console.log("!Error! / get_table_action_item_obj_list / _action.is_not_valid_action_obj(first_child_action_list_obj)");
					return;
				}
				var rowspan_cnt = first_child_action_list_obj.get_children_cnt();

				var table_action_item_obj_list = [];
				for (var idx_row = 0; idx_row < rowspan_cnt; idx_row++) {
					for (var idx_column = 0; idx_column < colspan_cnt; idx_column++) {

						// field를 하나씩 검사하는 것으로 변경.
						var cur_column_child_action_list_obj = this.get_child(idx_column);
						if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
							console.log("!Error! / get_table_action_item_obj_list / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
							return;
						}

						var cur_column_child_action_list_field_child_action_item_obj = cur_column_child_action_list_obj.get_child(idx_row);
						if(_action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)) {
							console.log("!Error! / get_table_action_item_obj_list / _action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)");
							return;
						}

						table_action_item_obj_list.push(cur_column_child_action_list_field_child_action_item_obj);

					} // end inner for

				} // end outer for

				return table_action_item_obj_list;
			}
			// @ Private 
			// @ Scope 	: action obj
			// @ Desc 	: 모든 객체가 그려진 이후에 호출되는 delegate function array. 전체 객체를 대상으로 서로 이벤트 관계등을 맺을때 사용됩니다. ex) jump spot setting.
			// 모든 action obj가 같은 delegate를 공유?
			,delegate_after_element_drawing_arr:[]
			,add_delegate_after_element_drawing:function(delegate_after_element_drawing) {

				if(_obj.is_not_valid_delegate(delegate_after_element_drawing)){
					console.log("!Error! / add_delegate_after_element_drawing / _obj.is_not_valid_delegate(delegate_after_element_drawing)");
					return;
				}

				if(this.has_parent()) {
					this.get_parent().add_delegate_after_element_drawing(delegate_after_element_drawing);
					return;
				} else if(this.has_parent_add_on()) {
					this.get_parent_add_on().add_delegate_after_element_drawing(delegate_after_element_drawing);
					return;
				}

				this.delegate_after_element_drawing_arr.push(delegate_after_element_drawing);
			}
			,call_delegate_after_element_drawing:function(param_obj) {

				if(this.has_parent()) {
					this.get_parent().call_delegate_after_element_drawing(param_obj);
					return;
				} else if(this.has_parent_add_on()) {
					this.get_parent_add_on().call_delegate_after_element_drawing(param_obj);	
					return;
				}

				for(var idx = 0; idx < this.delegate_after_element_drawing_arr.length; idx++) {
					var cur_delegate_after_element_drawing = this.delegate_after_element_drawing_arr[idx];

					if(param_obj != undefined) {
						cur_delegate_after_element_drawing._apply([param_obj]);	
					} else {
						cur_delegate_after_element_drawing._apply();	
					}
					
				}
			}
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: 객체의 간략한 정보를 표시합니다.
			,show_info:function() {

				var debug_msg = 
				"<ACTION_NAME> / <ACTION_COORDINATE> / <ACTION_IDX>"
				.replace(/\<ACTION_NAME\>/gi, this.get_action_name())
				.replace(/\<ACTION_COORDINATE\>/gi, this.get_coordinate())
				.replace(/\<ACTION_IDX\>/gi, this.get_idx())
				;

				console.log(debug_msg);

			}
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: table 객체를 표현하는 element collection set의 참조를 관리합니다.
			,table_element_collection_set:undefined
			,set_table_element_collection_set:function(table_element_collection_set) {

				if(table_element_collection_set == undefined) {
					console.log("!Error! / set_table_element_collection_set / table_element_collection_set == undefined");
					return;
				}

				table_element_collection_set.set_table_action_obj(this);
				this.table_element_collection_set = table_element_collection_set;
			}
			,get_table_element_collection_set:function() {
				return this.table_element_collection_set;
			}
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: table 객체를 표현하는 element collection set의 참조를 관리합니다.
			,list_element_collection_set:undefined
			,set_list_element_collection_set:function(list_element_collection_set) {

				if(list_element_collection_set == undefined) {
					console.log("!Error! / set_list_element_collection_set / list_element_collection_set == undefined");
					return;
				}

				list_element_collection_set.set_table_action_obj(this);
				this.list_element_collection_set = list_element_collection_set;
			}
			,get_list_element_collection_set:function() {
				return this.list_element_collection_set;
			}

			// @ Public
			// @ Scope 	: action table obj
			// @ Desc 	: table 객체가 이동할 수 있는 상위 엘리먼트의 배열을 업데이트한다.
			,update_table_jump_spot:function() {

				if(this.is_not_table()) {
					console.log("!Error! / update_table_jump_spot / this.is_not_table()");
					return;
				}

				var cur_table_element_collection_set = this.get_table_element_collection_set();
				if(cur_table_element_collection_set == undefined) {
					console.log("!Error! / update_table_jump_spot / cur_table_element_collection_set == undefined");
					return;
				}

				var cur_parent_add_on = this.get_parent_add_on();
				if(_action.is_not_valid_action_obj(cur_parent_add_on)) {
					console.log("!Error! / update_table_jump_spot / _action.is_not_valid_action_obj(cur_parent_add_on)");
					return;
				}

				var cur_action_depth_arr = cur_parent_add_on.get_action_depth();
				for(var idx = 0;idx < cur_action_depth_arr.length;idx++) {
					var cur_action_obj_depth = cur_action_depth_arr[idx];

					// 현재 자신이 포함된 부모 parent action obj는 제외한다.
					if(this.get_parent_add_on().get_coordinate() == cur_action_obj_depth.get_coordinate()) {
						continue;
					}

					var cur_element_set = cur_action_obj_depth.get_event_manager().get_element_set();
					if(cur_element_set == undefined) {
						console.log("!Error! / update_table_jump_spot / cur_element_set == undefined");
						return;
					}
					cur_table_element_collection_set.add_element_set_jump_spot(cur_element_set);
				}				

			}
			// @ Public
			// @ Scope 	: action obj
			// @ Desc 	: action 부모 / 자식 구조를 obj 구조 형태로 보여준다. 디버깅용.
			,convert_action_hierarchy_to_obj_tree:function() {
				// 1. root obj를 가져옵니다.
				var root_action_obj = this.get_root_action_obj();
				if(_action.is_not_valid_action_obj(root_action_obj)) {
					console.log("!Error! / convert_action_hierarchy_to_obj_tree / _action.is_not_valid_action_obj(root_action_obj)");
					return;
				}

				return this.convert_action_hierarchy_to_obj_tree_recursive(root_action_obj);
			}
			// @ Private
			// @ Scope 	: action obj
			// @ Desc 	: action 부모 / 자식 구조를 obj 구조 형태로 보여준다. 디버깅용. 외부에서 직접 호출하지 않습니다.
			,convert_action_hierarchy_to_obj_tree_recursive:function(action_obj, obj_tree) {
				if(_action.is_not_valid_action_obj(action_obj)) {
					console.log("!Error! / convert_action_hierarchy_to_obj_tree_recursive / _action.is_not_valid_action_obj(action_obj)");
					return;
				}

				if(obj_tree == undefined) {
					obj_tree = {};
				}

				// DEBUG
				// console.log("");
				// action_obj.show_info();
				// console.log("action_obj ::: ",action_obj);

				if(action_obj.has_children()){

					var cur_children_action_arr = action_obj.get_children();
					for(var idx = 0; idx < cur_children_action_arr.length; idx++) {
						var cur_child_action_obj = cur_children_action_arr[idx];

						if(_action.is_not_valid_action_obj(cur_child_action_obj)) {
							console.log("!Error! / convert_action_hierarchy_to_obj_tree_recursive / _action.is_not_valid_action_obj(cur_child_action_obj)");
							return;
						}

						var cur_action_name = cur_child_action_obj.get_action_name();
						var cur_action_name_formatted = _html.get_num_id_auto_increase(cur_action_name);

						obj_tree[cur_action_name_formatted] = {};
						var obj_tree_next = obj_tree[cur_action_name_formatted];

						this.convert_action_hierarchy_to_obj_tree_recursive(cur_child_action_obj, obj_tree_next);
					}
					
				}

				if(action_obj.has_add_on_list()) {

					var cur_children_add_on_action_arr = action_obj.get_add_on_list();

					for(var idx = 0; idx < cur_children_add_on_action_arr.length; idx++) {
						var cur_child_add_on_action_obj = cur_children_add_on_action_arr[idx];

						if(_action.is_not_valid_action_obj(cur_child_add_on_action_obj)) {
							console.log("!Error! / convert_action_hierarchy_to_obj_tree_recursive / _action.is_not_valid_action_obj(cur_child_add_on_action_obj)");
							return;
						}

						var cur_action_name = cur_child_add_on_action_obj.get_action_name();
						var cur_action_name_formatted = _html.get_num_id_auto_increase(cur_action_name);

						obj_tree[cur_action_name_formatted] = {};
						var obj_tree_next = obj_tree[cur_action_name_formatted];

						this.convert_action_hierarchy_to_obj_tree_recursive(cur_child_add_on_action_obj, obj_tree_next);
						
					}

				}

				return obj_tree;
			}


		}

		return action_obj;
	}
	,get_action_obj:function(action_data_obj, coordinate, action_hierarchy_search_map, action_depth_arr, depth) {

		var action_obj_empty = this.get_action_obj_empty();

		action_obj_empty.set_action_data(action_data_obj, coordinate, action_hierarchy_search_map, action_depth_arr, depth);

		return action_obj_empty;
	}
	// @ Public
	// @ Desc : 한 객체에서 다른 객체를 복사합니다. 복사 방법은 복사 대상 자신과 자식이 shy 객체가 있다면 shy 객체까지 포함입니다. 이것은 재귀호출로 이루어 집니다.
	,copy_action:function(target_action_obj) {

		if(this.is_not_valid_action_obj(target_action_obj)) {
			console.log("!Error! / copy_action / this.is_not_valid_action_obj(target_action_obj)");
			return;
		}

 		var copy_action_obj = this.get_action_obj();
 		




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

		if(this.is_not_valid_action_obj(prev_action_obj)) {
			console.log("!Error! / action.manager.js / compare_action / this.is_not_valid_action_obj(prev_action_obj)");
			return false;
		}
		if(this.is_not_valid_action_obj(next_action_obj)) {
			console.log("!Error! / action.manager.js / compare_action / this.is_not_valid_action_obj(next_action_obj)");
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
			console.log("make_element_event_manager / _v.isNotValidStr(event_manager_id)");
			return null;
		}
		if(_v.isNotJQueryObj(element_jq)){
			console.log("make_element_event_manager / _v.isNotJQueryObj(element_jq)");
			return null;
		}
		if(this.is_not_valid_action_item_obj(action_item_obj)) {
			console.log("make_element_event_manager / this.is_not_valid_action_item_obj(action_item_obj)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_set_event_manager_prop)){
			console.log("make_element_event_manager / _obj.isNotValidDelegate(delegate_set_event_manager_prop)");
			return null;
		}

		var event_hierarchy_manager = _action.get_event_hierarchy_manager();
		var requested_event_manager = event_hierarchy_manager.get_event_manager(event_manager_id);
		if(requested_event_manager != null && requested_event_manager.title_jq != null){
			// already has one.
			console.log("!Warning! / already has one. / event_manager_id :: ",event_manager_id);
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
			,item_focus_color:_action.COLOR_FOCUS_YELLOW
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
				element_color_hex = _color.rgb_to_hex(element_color);
				this.element_color = element_color_hex;	
			}
			,get_element_color:function(){
				return this.element_color;	
			}
			,element_background_color:null 
			,set_element_background_color:function(element_background_color){
				element_background_color_hex = _color.rgb_to_hex(element_background_color);
				this.element_background_color = element_background_color_hex;	
			}
			,get_element_background_color:function(){
				return this.element_background_color;	
			}
			,element_border_color:null 
			,set_element_border_color:function(element_border_color){
				element_border_color_hex = _color.rgb_to_hex(element_border_color);
				this.element_border_color = element_border_color_hex;	
			}
			,get_element_border_color:function(){
				return this.element_border_color;	
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
			,hide_child_shy_element_container_jq:function() {
				if(this.child_shy_element_container_jq != undefined) {
					this.child_shy_element_container_jq.hide();
				}	
			}
			,show_child_shy_element_container_jq:function() {
				if(this.child_shy_element_container_jq != undefined) {
					this.child_shy_element_container_jq.show();
				}	
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
			,remove_shy_child_element_jq:function(add_on_element_jq){
				this.children_shy_element_jq_arr = [];
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
			// @ private
			// @ Scope : Event Manager / em
			// @ Desc : shy child element collection set을 제거합니다.
			,em_remove_child_shy_element_collection_set:function() {
				this.children_shy_element_collection_set_arr = [];
				this.remove_shy_child_element_jq();
			}
			// @ public
			// @ Scope : Event Manager / em
			// @ Desc : shy child를 일반 child로 바꿉니다. 최초로 자식 열을 추가할 때 호출됩니다.
			,em_convert_shy_child_to_child:function() {
				var cur_child_shy_element_collection_set_arr = this.get_child_shy_element_collection_set_arr();
				if(_v.is_not_valid_array(cur_child_shy_element_collection_set_arr)) {
					return;
				}

				var cur_child_shy_element_collection_set = cur_child_shy_element_collection_set_arr[0];
				if(cur_child_shy_element_collection_set == undefined) {
					console.log("!Error! / convert_shy_child_to_child / cur_child_shy_element_collection_set == undefined");
					return;
				}

				this.em_remove_child_shy_element_collection_set();

				console.log("** this.children_shy_element_collection_set_arr :: ",this.children_shy_element_collection_set_arr);
				console.log("** this.children_shy_element_jq_arr :: ",this.children_shy_element_jq_arr);

				this.em_push_child_element_collection_set(cur_child_shy_element_collection_set);
			}
			// @ public
			// @ Scope : Event Manager / em
			// @ Desc : 일반 child를 shy child로 바꿉니다. 마지막 남은 열을 제거할 때 사용합니다.
			,em_convert_child_to_shy_child:function() {

				var cur_child_element_collection_set_arr = this.get_children_element_collection_set_arr();
				if(_v.is_not_valid_array(cur_child_element_collection_set_arr)) {
					return;
				}

				var cur_child_element_collection_set = cur_child_element_collection_set_arr[0];
				if(cur_child_element_collection_set == undefined) {
					console.log("!Error! / em_convert_child_to_shy_child / cur_child_element_collection_set == undefined");
					return;
				}
				this.em_remove_child_element_collection_set(cur_child_element_collection_set);
				this.em_push_child_shy_element_collection_set(cur_child_element_collection_set);
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
			,set_title_jq_text:function(new_title, is_change_attr_input_value, is_change_attr_tossed_value){

				if(this.title_jq == null) return;
				if(_v.isNotValidStr(new_title)) return;

				if(is_change_attr_input_value == undefined) {
					is_change_attr_input_value = false;
				}
				if(is_change_attr_tossed_value == undefined) {
					is_change_attr_tossed_value = false;
				}

				this.title_jq.html(new_title);

				// 말줄임표와 관계없이 사용자가 입력한 값을 저장하는 input_value 속성에 값을 변경해줍니다.
				if(is_change_attr_input_value === true) {
					this.set_title_jq_attr_input_value(new_title);	
				}

				if(is_change_attr_tossed_value === true) {
					this.set_title_jq_attr_tossed_value(new_title);
				}
			}
			,show_title_jq_text_head:function(text_head_length){

				if(text_head_length == undefined || _v.is_not_unsigned_number(text_head_length)) {
					text_head_length = 60;
				}

				if(this.title_jq == null && this.title_input_jq == null) return;
				// 포커싱 시에 노출되는 타이틀 길이를 줄여줍니다.
				var _html = airborne.html;
				var cur_title_jq_value = this.get_title_jq_value();
				var cur_text_head = _html.getTextHead(cur_title_jq_value, text_head_length);

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
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_input_group_jq / _v.isNotJQueryObj(title_input_group_jq)");
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
					console.log("!Error! / set_delegte_move_title_input_group_jq / _obj.isNotValidDelegate(delegte_move_title_input_group_jq)");
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
					console.log("!Error! / set_delegte_before_save_n_reload / _obj.isNotValidDelegate(delegte_before_save_n_reload)");
					return;
				}
				this.delegte_before_save_n_reload = delegte_before_save_n_reload;
			}
			,call_delegate_before_save_n_reload:function(){

				if(this.delegte_before_save_n_reload == null) return;
				this.delegte_before_save_n_reload._func.apply(this.delegte_before_save_n_reload._scope,[this]);
			}
			,move_title_input_group_jq:function(event_mode){

				var cur_element_container_jq = this.get_element_container_jq();
				if(cur_element_container_jq == null){
					console.log("!Error! / move_title_input_group_jq / cur_element_container_jq");
					return;	
				}

				var cur_title_input_group_jq = this.get_title_input_group_jq();
				if(cur_title_input_group_jq == null){
					console.log("!Error! / move_title_input_group_jq / cur_title_input_group_jq == null)");
					return;	
				}

				var cur_delegte_move_title_input_group_jq = this.get_delegte_move_title_input_group_jq();
				if(cur_delegte_move_title_input_group_jq == null){
					console.log("!Error! / move_title_input_group_jq / cur_delegte_move_title_input_group_jq == null)");
					return;
				}

				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == null){
					console.log("!Error! / move_title_input_group_jq / cur_element_jq == null)");
					return;
				}

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / move_title_input_group_jq / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				// cur_delegte_move_title_input_group_jq._func.apply(
				cur_delegte_move_title_input_group_jq._apply(
					// param obj arr
					[
						cur_element_jq
						, cur_element_container_jq
						, cur_title_input_group_jq
						, this
						, event_mode
					]
				);

				// shy mode일 경우, single row로 표시.
				if(cur_action_item_obj.get_action_is_shy()) {

					_obj.set_list_single_row_round(cur_title_input_group_jq);

				} else if(cur_action_item_obj.is_last()) {

					_obj.set_list_last_row_round(cur_title_input_group_jq);

				}

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
				if(this.title_input_jq == undefined) return;
				this.title_input_jq.show();
			}
			,hide_title_input_jq:function(){
				if(this.title_input_jq == undefined) return;
				this.title_input_jq.hide();
			}
			,focus_title_input_jq:function(){
				if(this.title_input_jq == undefined) return;
				this.title_input_jq.focus();
			}
			,off_title_input_jq:function() {
				if(this.title_input_jq == undefined) return;
				this.title_input_jq.off();
			}
			,clear_title_input_jq_value:function(){
				if(this.title_input_jq == null) return;
				this.title_input_jq.val("");
			}
			,set_title_input_jq_value:function(new_title){
				if(this.title_input_jq == null) return;

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
			// @ Scope 	: Event Manager
			// @ Desc 	: 입력 필드가 최대 글자수를 넘었는지 확인합니다.
			,set_title_input_jq_watch_dog_interval:function(){
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

							// 최대 입력 글자수를 넘었는지 확인.
							var max_length = 128;
							var is_over_max_length = false;
							if(_v.is_valid_str(cur_search_keyword) && max_length < cur_search_keyword.length) {
								is_over_max_length = true;
							}

							if(is_over_max_length && confirm("Please check your text.\nIt's a little bit longer.")) {
								_self.set_title_input_jq_value(cur_search_keyword.slice(0,max_length));
								_self.focus_title_input_jq();
								return;
							}
						}

						_self.set_title_input_jq_prev_value(cur_search_keyword);

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
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_title_input_btn_ok_jq / _v.isNotJQueryObj(title_input_btn_ok_jq)");
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

				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / element_event_manager / get_element_type / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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

				if( (cur_action_item_obj.is_item_select_box() || cur_action_item_obj.is_item_select_box_addable()) && _action.EVENT_TYPE_UPDATE_ITEM == cur_event_type ){

					if(_obj.is_not_valid_search_option(cur_search_option_obj)){
						console.log("!Error! / element_event_manager / call_delegate_save_n_reload / this.is_not_valid_search_option(cur_search_option_obj)");
						return;
					}

					// 변경된 데이터를 저장하기 전에 자신의 element json 정보를 업데이트 합니다.
					cur_element_key = cur_search_option_obj.select_option_key;
					cur_element_value = cur_search_option_obj.select_option_value;
					cur_action_item_obj.set_action_name(cur_element_key);

					var new_context = JSON.stringify({select_option_key:cur_element_key,select_option_value:cur_element_value});
					cur_action_item_obj.set_action_context(new_context);

				} else if( cur_action_item_obj.is_item_title_n_time_hh_mm() ){

					if(_obj.EVENT_TYPE_UPDATE_ITEM == cur_event_type){

						// action item으로 업데이트 시 바로 저장하면, 관리 로직이 따로 필요없을 듯!
						console.log("call_delegate_save_n_reload / 003 / Need to implement?");

					}

				} else if( _action.EVENT_TYPE_INSERT_ITEM == cur_event_type || _action.EVENT_TYPE_DELETE_ITEM == cur_event_type ){

					// key & value 를 모두 동일하게 설정
					cur_element_key = this.get_title_jq_value();
					cur_element_value = cur_element_key;

				} else {

					console.log("call_delegate_save_n_reload / Need to implement!");

				}

				var cur_outcome_obj = 
				_action.get_outcome_obj(
					// event_str
					cur_event_type
					// action_item_obj
					, cur_action_item_obj
				);
				cur_delegate_save_n_reload._func.apply(cur_delegate_save_n_reload._scope,[cur_outcome_obj]);
			}
			// @ Public
			// @ Scope 	: event manager
			// @ Desc  	: 추가, 변경, 삭제시의 정보를 전달합니다.
			,call_delegate_on_event:function(cur_event_type, cur_search_option_obj){

				if(_action.is_not_valid_event_type(cur_event_type)){
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _obj.is_not_valid_event_type(cur_event_type)");
					return;
				}
				var cur_delegate_save_n_reload = this.get_delegate_save_n_reload();
				if(_obj.isNotValidDelegate(cur_delegate_save_n_reload)){
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _obj.isNotValidDelegate(cur_delegate_save_n_reload");
					return;
				}
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / element_event_manager / call_delegate_save_n_reload / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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

				if( (cur_action_item_obj.is_item_select_box() || cur_action_item_obj.is_item_select_box_addable())  && _action.EVENT_TYPE_UPDATE_ITEM == cur_event_type ){

					if(_obj.is_not_valid_search_option(cur_search_option_obj)){
						console.log("!Error! / element_event_manager / call_delegate_save_n_reload / this.is_not_valid_search_option(cur_search_option_obj)");
						return;
					}

					// 변경된 데이터를 저장하기 전에 자신의 element json 정보를 업데이트 합니다.
					cur_action_item_obj.set_action_name(cur_element_key);
					cur_action_item_obj.set_action_context(_json.parseJSON(cur_search_option_obj));

				} else if( cur_action_item_obj.is_item_title_n_time_hh_mm() ){

					if(_action.EVENT_TYPE_UPDATE_ITEM == cur_event_type){

						// action item으로 업데이트 시 바로 저장하면, 관리 로직이 따로 필요없을 듯!
						console.log("call_delegate_save_n_reload / 003 / Need to implement?");

					}

				} else if( _action.EVENT_TYPE_INSERT_ITEM == cur_event_type || _action.EVENT_TYPE_DELETE_ITEM == cur_event_type ){

					// key & value 를 모두 동일하게 설정
					cur_element_key = this.get_title_jq_value();
					cur_element_value = cur_element_key;

				} else if( (cur_action_item_obj.is_item_select_box() || cur_action_item_obj.is_item_select_box_addable()) && _action.EVENT_TYPE_ADD_SELECT_OPTION == cur_event_type ){

					console.log("Add select option");

				}

				var cur_outcome_obj = 
				_action.get_outcome_obj(
					// event_str
					cur_event_type
					// action_item_obj
					, cur_action_item_obj
				);

				return cur_delegate_save_n_reload._func.apply(cur_delegate_save_n_reload._scope,[cur_outcome_obj]);
			}			







			// @ optional
			// REMOVE ME - 더 이상 사용하지 않음.
			/*
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
			*/
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
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / get_sibling_element_event_manager_arr / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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
				if(_action.is_not_valid_action_item_obj(before_action_item_obj)) {
					console.log("!Error! / get_before_sibling_element_event_manager_arr / _action.is_not_valid_action_item_obj(before_action_item_obj)");
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
				if(_action.is_not_valid_action_item_obj(after_action_item_obj)) {
					console.log("!Error! / get_after_sibling_element_event_manager_arr / _action.is_not_valid_action_item_obj(after_action_item_obj)");
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

			// @ Scope : Element Event Manager
			// @ Desc : 모든 형제 엘리먼트 셋을 가져온다. shy mode 제외. 자신의 부모가 있다면 다른 형제 부모들의 자식 엘리먼트 셋도 가져온다.
			,get_all_sibling_element_set_arr:function(){

				var cur_all_sibling_element_set_arr = [];

				// 나의 형제 엘리먼트 셋을 받음 (shy mode 제외)
				var cur_element_collection_set = this.get_element_set().get_element_collection_set();
				if(cur_element_collection_set == null) return cur_all_sibling_element_set_arr;

				// 나 자신의 정보를 가져온다.
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / get_all_sibling_element_set_arr / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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

						// 5. 사용자가 보던 위치로 이동합니다. - wonder.jung11
						_self.rollback_scroll_top();

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
			// @ Scope 	: Event Manager
			// @ Desc 	: 시간 입력 그룹의 시간 추가 버튼
			,time_input_group_jq_btn_time_plus_jq:null
			,off_time_input_group_jq_btn_time_plus_jq:function(){
				if( this.time_input_group_jq_btn_time_plus_jq == undefined ) return;
				this.time_input_group_jq_btn_time_plus_jq.off();
			}
			,get_time_input_group_jq_btn_time_plus_jq:function(){
				if( this.time_input_group_jq_btn_time_plus_jq == undefined ) return;
				return this.time_input_group_jq_btn_time_plus_jq;
			}
			,set_time_input_group_jq_btn_time_plus_jq:function(time_input_group_jq_btn_time_plus_jq){
				if(_v.isNotJQueryObj(time_input_group_jq_btn_time_plus_jq)){
					console.log("!Error! / airborne.bootstrap.obj / element_event_manager / set_time_input_group_jq_btn_time_plus_jq / _v.isNotJQueryObj(time_input_group_jq_btn_time_plus_jq)");
					return;
				}
				this.time_input_group_jq_btn_time_plus_jq = time_input_group_jq_btn_time_plus_jq;
			}
			,show_btn_time_plus:function() {
				if( this.time_input_group_jq_btn_time_plus_jq == undefined ) return;
				this.time_input_group_jq_btn_time_plus_jq.show();
			}
			,hide_btn_time_plus:function() {
				if( this.time_input_group_jq_btn_time_plus_jq == undefined ) return;
				this.time_input_group_jq_btn_time_plus_jq.hide();
			}
			// @ Scope 	: Event Manager
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
			,show_btn_time_minus:function() {
				if( this.time_input_group_jq_btn_time_minus_jq == undefined ) return;
				this.time_input_group_jq_btn_time_minus_jq.show();
			}
			,hide_btn_time_minus:function() {
				if( this.time_input_group_jq_btn_time_minus_jq == undefined ) return;
				this.time_input_group_jq_btn_time_minus_jq.hide();
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

				// REMOVE ME
				// this.hide_title_input_btn_search_jq();
				this.hide_title_input_btn_ok_jq();
				this.hide_title_input_btn_cancel_jq();

				this.hide_searchable_combo_box_jq();
				this.hide_search_output_list_jq();

				this.hide_btn_add_element_jq();
				this.hide_btn_edit_element_jq();
				this.hide_btn_remove_element_jq();

				this.hide_btn_eject_element_jq();
				this.hide_time_input_group_jq();

				this.hide_btn_time_plus();
				this.hide_btn_time_minus();

				// 자식 객체가 있다면 가려줍니다.
				this.hide_child();

			}
			// @ Public
			// @ Scope 	: Event Manager
			// @ Desc 	: view mode를 보여줄때, 뷰의 제어를 담당하는 delegate
			,delegate_show_view_mode_view_control:undefined
			,set_delegate_show_view_mode_view_control:function(delegate_show_view_mode_view_control) {
				this.delegate_show_view_mode_view_control = delegate_show_view_mode_view_control;
			}
			,get_delegate_show_view_mode_view_control:function() {
				return this.delegate_show_view_mode_view_control;	
			}
			,call_delegate_show_view_mode_view_control:function(param_obj) {
				if(_obj.is_valid_delegate(this.delegate_show_view_mode_view_control)) {
					this.delegate_show_view_mode_view_control._apply([param_obj]);
				}
			}
			,is_view_mode:false
			,get_is_view_mode:function() {
				return this.is_view_mode;
			}
			,show_view_mode:function(){

				if(this.is_view_mode) return;

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("_action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				this.hide_all();
				
				this.show_element_jq();
				this.show_parent_container_jq();
				this.show_title_jq();
				this.show_child();
				this.set_colors_back();
				
				if( cur_action_item_obj.is_item_title_n_time_hh_mm() ){
					this.show_time_jq();
				}

				this.is_view_mode = true;
				this.is_focusing_mode = false;
				this.is_child_focusing_mode = false;
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
				// var cur_title = this.get_title_jq_value();
				// console.log("event manager / show_edit_mode / cur_title : ",cur_title);

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_edit_mode / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				this.hide_all();
				this.show_element_jq();
				this.show_parent_container_jq();
				this.show_title_jq();
				this.show_child();
				this.show_shy_child();

				var is_addable = (cur_action_item_obj.is_item_title_only_addable() || cur_action_item_obj.is_item_select_box_addable() || cur_action_item_obj.is_item_title_n_time_hh_mm());

				if(cur_action_item_obj.is_item_select_box()) {

					this.show_btn_edit_element_jq();

				} else if(cur_action_item_obj.get_action_is_not_shy() && is_addable) {

					this.show_btn_edit_element_jq();
					this.show_btn_remove_element_jq();
					// this.show_btn_eject_element_jq();
					this.show_btn_add_element_jq();

					// wonder.jung11
					if(!cur_action_item_obj.is_only_one()) {
						this.show_btn_eject_element_jq();	
					}

				}

				if( cur_action_item_obj.is_item_title_n_time_hh_mm() ){
					this.show_time_jq();
				}

				this.set_colors_reverse();

				// 2. 뷰의 수정은 뷰제어 코드에서 담당, 처리합니다.
				// this.call_delegate_show_view_mode_view_control(this);

				this.is_view_mode = false;
				this.is_focusing_mode = false;
				this.is_child_focusing_mode = false;
			}
			,is_focusing_mode:false
			,get_is_focusing_mode:function() {
				return this.is_focusing_mode;
			}
			// @ Desc : 제목을 포커싱(색상 반전)하여 보여줍니다. 버튼은 모두 숨깁니다.
			,show_focusing_mode:function(){

				if(this.is_focusing_mode) return;

				// DEBUG
				// var cur_title = this.get_title_jq_value();
				// console.log("event manager / show_focusing_mode / cur_title : ",cur_title);

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_focusing_mode / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				this.hide_all();
				this.show_element_jq();
				this.show_parent_container_jq();
				this.hide_title_jq_text_head();
				this.show_title_jq();
				this.show_child();
				this.show_shy_child();

				if(cur_action_item_obj.is_item_title_n_time_hh_mm()){
					this.show_time_jq();
				}

				this.set_colors_reverse();

				this.is_view_mode = false;
				this.is_focusing_mode = true;
				this.is_child_focusing_mode = false;
			}
			// @ Public
			// @ Scope 		: Event Manager
			// @ Desc 		: 자식 LIST, TABLE이 Focusing Mode로 변경시, 자식 LIST, TABLE의 focusing 색상을 동일하게 적용해줍니다.
			,is_child_focusing_mode:false
			,get_is_child_focusing_mode:function(){
				return this.is_child_focusing_mode;
			}
			,show_child_focusing_mode:function(child_element_color) {

				if(this.is_child_focusing_mode) return;

				this.set_color_border(child_element_color);
				this.set_color_background(child_element_color);
				this.hide_btn_eject_element_jq();
				this.hide_btn_remove_element_jq();
				this.hide_btn_edit_element_jq();
				this.hide_btn_add_element_jq();

				this.is_view_mode = false;
				this.is_focusing_mode = false;
				this.is_child_focusing_mode = true;
			}
			,show_input_mode:function(event_mode){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_input_mode / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				var consoler = airborne.console.get();
				// consoler.off();

				var cur_title = "";
				if(cur_action_item_obj.get_action_is_not_shy()){
					cur_title = this.get_title_jq_value();
				}

				if(cur_title === _action.PLACE_HOLDER_NOT_ASSIGNED) {
					this.set_title_input_jq_value("");
				}

				consoler.say("Event Manager / show_input_mode / em_sim");
				consoler.say("em_sim / 0 /",cur_title);

				// input mode를 인자로 넘겨준 경우를 우선 처리합니다.
				if( cur_action_item_obj.is_item_select_box() || cur_action_item_obj.is_item_select_box_addable() ) {

					consoler.say("em_sim / 1 /",cur_title);
					consoler.say("em_sim / 1 / ELEMENT_TYPE_SEARCH_LIST | ELEMENT_TYPE_TABLE_SEARCH_LIST");

					this.show_input_mode_search_n_select();
					this.set_title_input_jq_search_list_watch_dog_interval();
					this.set_event_btn_cancel_on_input_group(event_mode);

				} else if(_action.EVENT_TYPE_ADD_ROW === event_mode){	

					// 새로운 리스트 열을 추가하는 경우
					this.show_input_mode_add_row(event_mode);

					// set event on input buttons	
					this.set_event_btn_ok_on_input_group(event_mode);
					this.set_event_btn_cancel_on_input_group(event_mode);

				} else {

					consoler.say("em_sim / 2 /",cur_title);
					consoler.say("em_sim / 2 / Default");

					this.show_input_mode_default(event_mode);

					// set event on input buttons	
					this.set_event_btn_ok_on_input_group(event_mode);
					this.set_event_btn_cancel_on_input_group(event_mode);

				}

				this.is_view_mode = false;
				this.is_focusing_mode = false;
				this.is_child_focusing_mode = false;
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
				this.hide_shy_child();
			}
			,show_input_mode_shy_list:function(){

				console.log("Event Manager / show_input_mode_shy_list   ");

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
				this.hide_shy_child();

				// 5. 선택한 엘리먼트(자기 자신)의 아래로 input group을 옮깁니다.
				this.move_title_input_group_jq_under_me();

			}
			// @ Public
			// @ Scope 	: Event Manager
			// @ Desc 	: input mode를 보여줄때, 뷰의 제어를 담당하는 delegate
			,delegate_show_input_mode_default_view_control:undefined
			,set_delegate_show_input_mode_default_view_control:function(delegate_show_input_mode_default_view_control) {
				this.delegate_show_input_mode_default_view_control = delegate_show_input_mode_default_view_control;
			}
			,get_delegate_show_input_mode_default_view_control:function() {
				return this.delegate_show_input_mode_default_view_control;	
			}
			,call_delegate_show_input_mode_default_view_control:function(param_obj, input_type) {
				if(this.delegate_show_input_mode_default_view_control != undefined) {
					this.delegate_show_input_mode_default_view_control._apply([param_obj, input_type]);
				}
			}
			// @ Private
			// @ Scope  : Event Manager
			// @ Desc  	: 뷰에 표현된 자식 객체들을 가립니다.
			,hide_child:function() {
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_input_mode_default / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				var cur_child_action_obj_list = cur_action_item_obj.get_children();
				var cur_children_action_obj = cur_child_action_obj_list[0];
				if(cur_children_action_obj != undefined && cur_children_action_obj.is_list()) {
					var cur_list_element_collection_set = cur_children_action_obj.get_list_element_collection_set();
					cur_list_element_collection_set.hide_element_collection_container_jq();
				}
			}
			// @ Private
			// @ Scope  : Event Manager
			// @ Desc  	: 뷰에 표현된 자식 객체들을 보여줍니다.
			,show_child:function() {
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_child / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				var cur_child_action_obj_list = cur_action_item_obj.get_children();
				var cur_children_action_obj = cur_child_action_obj_list[0];

				if(cur_children_action_obj != undefined && cur_children_action_obj.is_list()) {
					var cur_list_element_collection_set = cur_children_action_obj.get_list_element_collection_set();
					cur_list_element_collection_set.show_element_collection_container_jq();
				}
			}
			,show_input_mode_default:function(event_mode){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_input_mode_default / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}				

				this.hide_all();

				this.show_title_input_container_jq();
				this.rollback_row_title_input(event_mode);
				this.focus_title_input_jq();

				this.show_title_input_btn_ok_jq();
				this.show_title_input_btn_cancel_jq();

				this.set_title_input_jq_watch_dog_interval();

				// 3. 뷰의 수정은 뷰제어 코드에서 담당, 처리합니다.
				this.call_delegate_show_input_mode_default_view_control(this, _action.INPUT_TYPE_DEFAULT);

			}
			,show_input_mode_add_row:function(event_mode){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Eror! / show_input_mode_add_row / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				this.hide_all();

				this.show_element_jq();
				this.show_parent_container_jq();
				this.show_title_jq();
				if( cur_action_item_obj.is_item_title_n_time_hh_mm() ){
					this.show_time_jq();
				}
				this.set_colors_back();

				if(cur_action_item_obj.get_action_is_shy()) {

					// 처음으로 자식 엘리먼트를 추가
					// console.log("처음으로 자식 엘리먼트를 추가");

				} else {

					// 자신의 엘리먼트 밑으로 새로운 형제 엘리먼트를 추가.
					// 아래 열을 추가합니다.
					var cur_element_set = this.get_element_set();
					var cur_element_collection_set = cur_element_set.get_element_collection_set();
					cur_element_collection_set.add_element(this);

					// 추가한 뒤에 사용자가 기본값인 "New Item"을 수정할 수 있도록 수정 창을 보여줍니다.
					var cur_sibling_action_obj_after = cur_action_item_obj.get_sibling_action_obj_after();
					if(_action.is_not_valid_action_item_obj(cur_sibling_action_obj_after)) {
						console.log("!Error! / show_input_mode_add_row / _action.is_not_valid_action_item_obj(cur_sibling_action_obj_after)");
						return;
					}
					var event_manager_after = cur_sibling_action_obj_after.get_event_manager();
					if(event_manager_after == undefined) {
						console.log("!Error! / show_input_mode_add_row / event_manager_after == undefined");
						return;
					}

					event_manager_after.show_focusing_mode();

					var event_mode = _obj.EVENT_TYPE_UPDATE_ITEM;
					event_manager_after.show_input_mode(event_mode);
					event_manager_after.lock();

				}


				this.is_view_mode = false;
				this.is_focusing_mode = false;
				this.is_child_focusing_mode = false;

			}
			,show_input_mode_time:function(){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_input_mode_time / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				this.hide_all();

				this.show_parent_container_jq();
				this.show_title_jq();
				this.show_time_jq();

				if(cur_action_item_obj.is_item_title_n_time_hh_mm()) {

					// time plus, minus 버튼을 화면에 보여줍니다.
					this.show_btn_time_plus();
					this.show_btn_time_minus();
					this.show_title_input_btn_ok_jq();

					// SET EVENT
					this.set_event_time_btns();
					
				} else {
					console.log("!Error! / show_input_mode_time / cur_action_item_obj.is_not_item_title_n_time_hh_mm()");
					return;
				}

				// 3. 뷰의 수정은 뷰제어 코드에서 담당, 처리합니다.
				this.call_delegate_show_input_mode_default_view_control(this, _action.INPUT_TYPE_TIME);				

			}
			,show_input_mode_search_n_select:function(){

				this.hide_all();
				this.off_all_events();

				this.show_parent_container_jq();

				this.move_title_input_group_jq();

				this.show_title_input_group_jq();
				this.show_title_input_container_jq();
				this.show_title_input_jq();
				this.show_title_input_btn_cancel_jq();

				this.show_search_output_list_jq();

				this.hide_title_input_btn_ok_jq();

				this.set_scroll_top();

				// REMOVE ME
				// this.hide_title_input_btn_search_jq();
			}
			,off_all_events:function(){
				this.off_title_input_btn_ok_jq();
				this.off_title_input_btn_cancel_jq();
				// REMOVE ME
				// this.off_title_input_btn_search_jq();

				this.off_title_input_jq();

				this.off_btn_edit_element_jq();
				this.off_btn_remove_element_jq();
				this.off_btn_add_element_jq();

				this.clear_title_input_jq_watch_dog_interval();

				this.event_hierarchy_manager.clear_delegate_keyup_on_document();
			}
			,set_colors_back:function(){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / set_colors_back / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == undefined) return;

				cur_element_jq.css("color",this.get_element_color());
				this.set_color_background(this.get_element_background_color());
				this.set_color_border(this.get_element_border_color());

			}
			// @ Public
			// @ Scope  	: Event Manager
			// @ Desc 		: 객체의 색상을 반전시킵니다.
			,set_colors_reverse:function(){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / set_colors_reverse / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == undefined) return;

				cur_element_jq.css("color",this.element_background_color);
				this.set_color_background(this.get_element_color());
				this.set_color_border(this.get_element_color());

			}
			// @ Public
			// @ Scope 		: Event Manager
			// @ Desc 		: 객체의 테두리 색상을 바꿉니다.
			,set_color_border:function(border_color){
				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == undefined) return;

				cur_element_jq.css("border-color",border_color);
			}
			// @ Public
			// @ Scope 		: Event Manager
			// @ Desc 		: 객체의 테두리 색상을 바꿉니다.
			,set_color_background:function(background_color){
				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == undefined) return;

				cur_element_jq.css("background-color",background_color);
			}			
			,update_row_title:function(){
				if(this.title_jq == null || this.title_input_jq == null) return;

				this.set_title_jq_attr_input_value(this.title_input_jq.val());
				this.set_title_jq_attr_tossed_value(this.title_input_jq.val());

				this.set_title_jq_text(this.title_input_jq.val(), true);
			}
			,rollback_row_title_input:function(event_mode){
				if(this.title_jq == null || this.title_input_jq == null) return;

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / rollback_row_title_input / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				var decoded_title = _html.get_decode_text(this.title_jq.html());

				if(_action.PLACE_HOLDER_NOT_ASSIGNED === decoded_title) {
					decoded_title = "";
				}

				if(_action.EVENT_TYPE_ADD_ROW === event_mode) {
					this.set_title_input_jq_value("");
				} else {
					this.set_title_input_jq_value(decoded_title);
				}
			}
			,remove_list:function(){
				if(this.element_container_jq == null) return;
				this.element_container_jq.remove();
			}
			// @ private
			// @ scope : Event Manager
			// @ desc : 리스트의 열을 삭제합니다.
			,remove_element:function(){

				var consoler = airborne.console.get();
				consoler.off();

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / remove_element / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				var debug_msg = cur_action_item_obj.get_action_name() + " / " + cur_action_item_obj.get_coordinate();

				var element_name = this.get_title_jq_value();
				var element_collection_set_name = this.get_element_set().get_element_collection_set().get_element_collection_id();
				consoler.say("remove_element / rr / " + debug_msg);
				consoler.say("rr / 0 / en : " + element_name);
				consoler.say("rr / 0 / ecsn : " + element_collection_set_name);
				consoler.say("rr / 0 / cur_action_item_obj : ",cur_action_item_obj);

				if(this.element_jq == null) return;

				var is_only_one = cur_action_item_obj.is_only_one();
				if(is_only_one) {
					consoler.say("rr / 1-1 / 마지막 1개열이 삭제될 경우, shy row로 바꿉니다. / " + debug_msg);
					cur_action_item_obj.set_action_is_shy(true);

					var cur_parent_event_manager = this.get_parent_event_manager();
					if(cur_parent_event_manager == undefined) {
						console.log("!Error! / remove_element / cur_parent_event_manager == undefined");
						return;
					}
					cur_parent_event_manager.em_convert_child_to_shy_child();

					// 현재 엘리먼트의 eject btn을 가립니다.
					this.show_btn_eject_collection_element_jq();

					// 타이틀이 초기값, New Action으로 변경.
					cur_action_item_obj.set_action_name("New Action");
					this.set_title_jq_text(
						// new_title
						cur_action_item_obj.get_action_name()
						// is_change_attr_input_value
						, true
						// is_change_attr_tossed_value
						, true
					);
					return;
				}

				consoler.say("rr / 1-2 / en : " + element_name);
				consoler.say("rr / 1-2 / element collection set에서 해당 element set을 제거합니다.");

				var cur_element_set = this.get_element_set();
				var cur_element_collection_set = cur_element_set.get_element_collection_set();
				cur_element_collection_set.remove_element_set(cur_element_set);
				var cur_element_container_jq = this.get_element_container_jq();

				var cur_action_collection_obj = cur_action_item_obj.get_parent();
				if(_action.is_not_valid_action_obj(cur_action_collection_obj)) {
					console.log("!Error! / remove_element / _action.is_not_valid_action_obj(cur_action_collection_obj)");
					return;
				}

				if(cur_action_collection_obj.is_table()){

					if(cur_element_container_jq == null) return;
					cur_element_container_jq.remove();

					consoler.say("rr / 2-1 / en : " + element_name);
					consoler.say("rr / 2-1 / element container를 화면에서 지웁니다.");

				} else if(cur_action_collection_obj.is_list()) {

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

				// 첫번째 아이템을 가져와 삭제 이후의 상황을 판단합니다.
				var cur_first_sibling_action_obj = cur_action_item_obj.get_first_sibling_action_obj();
				if(cur_first_sibling_action_obj != undefined && _action.is_not_valid_action_item_obj(cur_first_sibling_action_obj)) {
					console.log("!Error! / remove_element / _action.is_not_valid_action_item_obj(cur_first_sibling_action_obj)");
					return;
				} else if(cur_first_sibling_action_obj == undefined) {
					// 모든 열이 삭제되었습니다.
				}

				// 자신이 삭제 대상. 그러므로 자신이 아닌 다른 객체들의 모양을 변경해주어야 한다.
				var cur_sibling_action_obj_before = cur_action_item_obj.get_sibling_action_obj_before();
				var cur_event_manager_before = undefined;
				if(cur_sibling_action_obj_before != undefined) {
					cur_event_manager_before = cur_sibling_action_obj_before.get_event_manager();
				}
				if(cur_event_manager_before != undefined) {
					cur_event_manager_before.shape_sibling_element();
				}

				var cur_sibling_action_obj_after = cur_action_item_obj.get_sibling_action_obj_after();
				var cur_event_manager_after = undefined;
				if(cur_sibling_action_obj_after != undefined) {
					cur_event_manager_after = cur_sibling_action_obj_after.get_event_manager();
				}
				if(cur_event_manager_after != undefined) {
					cur_event_manager_after.shape_sibling_element();
				}

				// element set을 삭제해줍니다.
				var cur_element_set = this.get_element_set();
				if(cur_element_set == undefined) {
					console.log("!Error! / remove_element / cur_element_set == undefined");
					return;
				}
				cur_element_set.remove_element_set();

				var sibling_action_obj_before = cur_action_item_obj.get_sibling_action_obj_before();
				var sibling_action_obj_after = cur_action_item_obj.get_sibling_action_obj_after();

				// action item obj treat
				cur_action_item_obj.remove();

				if(!is_only_one) {
					// shy mode로 변경된 경우가 아니고 뒤나 앞에 형제 엘리먼트가 있는 경우, 형제 엘리먼트의 모양을 변경해줍니다.
					if(sibling_action_obj_before != undefined) {
						sibling_action_obj_before.get_event_manager().shape_sibling_element();
					} else if(sibling_action_obj_after != undefined) {
						sibling_action_obj_after.get_event_manager().shape_sibling_element();
					}
				}
			}
			,is_lock:function(){
				return this.event_hierarchy_manager.is_lock();
			}
			// @ Public
			// @ Scope 	: event manager
			// @ Desc 	: 다른 이벤트를 받지 않도록 lock을 겁니다.
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
			,set_btn_event_color:function(target_jq, is_force_change){
				if(target_jq == undefined) return;

				var _self = this;
				target_jq.mouseenter(function(e){
					_self.set_btn_color_focus(target_jq, is_force_change);
				});
				target_jq.mouseleave(function(e){
					_self.set_btn_color_back(target_jq);
				});

			}
			,set_btn_color_focus:function(target_jq, is_force_change){

				if(is_force_change == undefined) {
					is_force_change = false;
				}

				if(target_jq == undefined) return;
				if(!is_force_change && this.is_lock()) return;

				var item_focus_color = _action.COLOR_FOCUS_YELLOW;
				var cur_background_color = target_jq.css("background-color");

				target_jq.css("color", this.element_color);
				target_jq.css("background-color", item_focus_color);
			}
			,set_btn_color_back:function(target_jq){
				if(target_jq == null) return;

				target_jq.css("color", _action.COLOR_TYPE_LIST_ROW_WHITE);
				target_jq.css("background-color", "");
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

				if(this.is_lock()) return;

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_edit_mode / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				if(cur_action_item_obj.is_item_title_only_fixed()) return;

				this.show_edit_mode();

				// 최대 표시 글자수를 구합니다.
				var cur_max_char_cnt = 
				_obj.get_max_char_cnt(
					// text_jq
					this.get_title_jq()
					// element_jq_subtract_arr
					, [
						this.get_btn_add_element_jq()
						, this.get_btn_remove_element_jq()
						, this.get_btn_eject_element_jq()
						, this.get_btn_eject_element_jq()
						, this.get_btn_eject_element_jq()
					]
				);
				
				// 일반적인 리스트 형태의 이벤트 처리
				// 포커싱 시에 노출되는 타이틀 길이를 줄여줍니다.
				var is_table_child_column_list_field_item = cur_action_item_obj.is_table_child_column_list_field_item();
				if(cur_action_item_obj.is_table_child_column_list_field_item()) {
					if(0 < cur_max_char_cnt) {
						this.show_title_jq_text_head(cur_max_char_cnt);
					} else {
						// 테이블 컬럼 기본값일 경우, 5 글자만 노출
						this.show_title_jq_text_head(5);	
					}
				} else {
					if(0 < cur_max_char_cnt) {
						this.show_title_jq_text_head(cur_max_char_cnt);
					} else {
						this.show_title_jq_text_head();	
					}
				}

				var _self = this;
				if(this.btn_remove_element_jq != null){
					this.btn_remove_element_jq.off();
					this.set_btn_event_color(this.btn_remove_element_jq);
					this.btn_remove_element_jq.click(function(e){

						if(!confirm("Remove this row.\nAre you sure?")) return;

						e.stopPropagation();

						// action item obj의 삭제는 데이터 업데이트 이후에 이루어집니다.
						var action_item_obj_clicked = _self.get_action_item_obj();
						if(_action.is_not_valid_action_item_obj(action_item_obj_clicked)) {
							console.log("!Error! / this.btn_remove_element_jq.click / _action.is_not_valid_action_item_obj(action_item_obj_clicked)");
							return;
						}

						if(action_item_obj_clicked.is_table_child_column_list_field_item()) {
							// 1. REMOVE TABLE FIELD ELEMENT
							// 자신의 row sibling element를 모두 불러서 화면에서 지워줍니다.
							var cur_table_row_field_arr = action_item_obj_clicked.get_table_row_sibling_arr();
							for(var idx = 0; idx < cur_table_row_field_arr.length; idx++) {
								var cur_table_row_field_obj = cur_table_row_field_arr[idx];
								if(_action.is_not_valid_action_item_obj(cur_table_row_field_obj)) {
									console.log("!Error! / this.btn_remove_element_jq.click / _action.is_not_valid_action_item_obj(cur_table_row_field_obj)");
									return;
								}
								cur_table_row_field_obj.get_event_manager().remove_element();
							}

						} else {
							// 2. REMOVE LIST ROW ELEMENT
							_self.remove_element();
						}

						_self.release();
						_self.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_NONE, _obj.EVENT_TYPE_DELETE_ITEM);
					});
				}
				
				var cur_btn_add_element_jq = this.get_btn_add_element_jq();
				if(cur_btn_add_element_jq != undefined){

					this.off_btn_add_element_jq();
					this.set_btn_event_color(cur_btn_add_element_jq);

					cur_btn_add_element_jq.click(function(e){

						e.stopPropagation();
						_self.show_view_mode();
						_self.on_add_btn_click();

					});
				}

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / on_mouse_over / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				var cur_element_type = cur_action_item_obj.get_element_type();

				var cur_action_name = this.get_action_item_obj().get_action_name();

				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq != undefined) {
					var _self_toss = this;
					cur_element_jq.click(function(e){

						e.stopPropagation();
						if(_self.is_lock()) return;

						var cur_action_item_obj_toss = _self_toss.get_action_item_obj();

						var cur_action_item_obj = _self.get_action_item_obj();
						if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
							console.log("!Error! / this.title_jq.click / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
							return;
						}
						var cur_action_item_name = cur_action_item_obj.get_action_name();
						var cur_action_item_name_toss = cur_action_item_obj_toss.get_action_name();

						if(cur_action_item_obj.get_action_is_shy()){
							_self.on_add_btn_click();
						} else {
							_self.on_edit_btn_click();	
						}
						
					});
				}
				
				var cur_btn_edit_element_jq = this.get_btn_edit_element_jq();
				if(cur_btn_edit_element_jq != null){
					cur_btn_edit_element_jq.off();
					this.set_btn_event_color(cur_btn_edit_element_jq);
					cur_btn_edit_element_jq.click(function(e){

						e.stopPropagation();

						var cur_action_item_obj = _self.get_action_item_obj();
						if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
							console.log("!Error! / on_mouse_over / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
							return;
						}

						if(cur_action_item_obj.get_action_is_shy()){
							_self.on_add_btn_click();
						} else {
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

						if(_self.is_lock()) {
							return;
						}
						_self.lock();

						// 시간 입력 그룹을 보여줍니다.
						_self.show_input_mode_time();

					});

					cur_time_jq.mouseleave(function(e){

						// 리스트 전체에 mouseleave 이벤트가 전파되는 것을 막습니다.
						// 리스트 전체에 mosueleave 이벤트가 전파되면 리스트는 view mode로 변경됩니다.
						e.stopPropagation();
					});


				}
			}
			,on_mouse_leave:function(is_child_mouse_over){
				if(this.is_lock()) return;

				if(is_child_mouse_over == undefined) {
					is_child_mouse_over = false;
				}

				this.show_view_mode();

				if(is_child_mouse_over === true) {
					this.hide_shy_child();
				}
				this.set_btn_color_back();
				this.off_all_events();

				// 줄임표 제거. 원래 텍스트 복원.
				this.hide_title_jq_text_head();
			}
			// @ private
			// @ scope : event manager
			// @ Desc : 	1. 형제 엘리먼트의 귀퉁이 모양을 둥글게 재조정합니다.
			// 				2. 첫번째 열인 경우만 eject btn을 노출합니다.
			,shape_sibling_element:function(){

				var consoler = airborne.console.get();
				consoler.off();

				var cur_action_item_obj = this.get_action_item_obj();
				var cur_element_collection_set = this.get_element_set().get_element_collection_set();
				var cur_element_jq = this.get_element_jq();

				// 테이블 형일 경우는 엘리먼트 형태를 바꾸지 않습니다.
				if(cur_action_item_obj.is_table_child_column_list_field_item()) {
					return;
				}

				// 모든 엘리먼트의 eject btn을 숨깁니다.
				var cur_first_sibling_action_obj = cur_action_item_obj.get_first_sibling_action_obj();
				if(_action.is_not_valid_action_item_obj(cur_first_sibling_action_obj)) {
					console.log("!Error! / shape_sibling_element / _action.is_not_valid_action_item_obj(cur_first_sibling_action_obj)");
					return;
				}
				
				var loop_max_cnt=50;
				var next_sibling_action_obj = cur_first_sibling_action_obj;
				for(var idx = 0; idx < loop_max_cnt; idx++) {
					
					var next_element_event_manager = next_sibling_action_obj.get_event_manager();
					if(next_element_event_manager == undefined) {
						console.log("!Error! / shape_sibling_element / next_element_event_manager == undefined");
						return;
					}

					if(next_sibling_action_obj.is_last()) {
						break;
					}
					next_sibling_action_obj = next_sibling_action_obj.get_sibling_action_obj_after();
				}

				// 첫번째 엘리먼트의 eject btn를 보여줍니다.
				consoler.say("sse / 0 / " + cur_action_item_obj.get_action_name());
				consoler.say("sse / 0 / 첫번째 엘리먼트의 eject btn의 이벤트시 동작이 설정됩니다.");
				var cur_first_sibling_element_event_manager = cur_first_sibling_action_obj.get_event_manager();
				if(cur_first_sibling_element_event_manager == undefined) {
					console.log("!Error! / shape_sibling_element / cur_first_sibling_element_event_manager == undefined");
					return;
				}
				if(!cur_first_sibling_action_obj.get_action_is_shy()) {
					cur_first_sibling_element_event_manager.show_btn_eject_collection_element_jq();	
				}

				consoler.say("sse / 0 / cur_action_item_obj :: ",cur_action_item_obj);

				// 첫번째와 마지막 엘리먼트의 처리
				if(cur_action_item_obj.is_first()) {

					// 이전의 CSS처리 제거.
					var cur_element_jq_first = cur_action_item_obj.get_event_manager().get_element_jq();
					if(cur_element_jq_first == undefined) {
						console.log("!Error! / shape_sibling_element / cur_element_jq_first == undefined");
						return;
					}

					// 첫번째 엘리먼트의 처리
					if(cur_action_item_obj.is_last()){

						consoler.say("sse / 1-1 / " + cur_action_item_obj.get_action_name());
						consoler.say("sse / 1-1 / 첫번째 엘리먼트이면서 마지막 엘리먼트, 엘리먼트가 자신뿐일 경우, 테두리 디자인을 변경해줍니다");

						_obj.set_list_single_row_round(cur_element_jq_first);

					} else {

						consoler.say("sse / 1-2-1 / " + cur_action_item_obj.get_action_name());
						consoler.say("sse / 1-2-1 / 첫번째 엘리먼트이면서 다른 엘리먼트가 있는 경우, 테두리 디자인을 변경해줍니다");

						_obj.set_list_first_row_round(cur_element_jq_first);

						// 두번째 엘리먼트는 테두리를 각지게 바꿈. 2개만 있는 경우는 마지막 엘리먼트 아래의 모양은 둥글게 만들어줍니다.
						var cur_sibling_action_obj_after = cur_action_item_obj.get_sibling_action_obj_after();
						if(_action.is_not_valid_action_obj(cur_sibling_action_obj_after)) {
							console.log("!Error! / shape_sibling_element / _action.is_not_valid_action_obj(cur_sibling_action_obj_after)");
							return;
						}
						consoler.say("sse / 1-2-1 / " + cur_sibling_action_obj_after.get_action_name());
						consoler.say("sse / 1-2-2 / 첫번째 엘리먼트이면서 다른 엘리먼트가 있는 경우, 테두리 디자인을 변경해줍니다");
						var cur_element_jq_after = cur_sibling_action_obj_after.get_event_manager().get_element_jq();
						_obj.remove_list_row_round(cur_element_jq_after);	

						if(cur_sibling_action_obj_after.is_last()) {

							consoler.say("sse / 1-2-3 / 다음 엘리먼트가 마지막 엘리먼트입니다. 테두리 디자인을 변경해줍니다");
							_obj.set_list_last_row_round(cur_element_jq_after);

						} else {

							consoler.say("sse / 1-2-4 / 다음 엘리먼트가 마지막 엘리먼트가 아닙니다. 마지막 엘리먼트를 찾아 테두리 디자인을 변경해줍니다");

							// 다음 형제 엘리먼트가 마지막이 아닌경우, 마지막 엘리먼트를 처리해야 합니다.
							// 1,2,3 --> 3,1,2 
							// 2가 마지막 엘리먼트로 변경되어야 합니다. 앞의 로직에서는 3,1만 처리됨.
							var last_sibling_action_item_obj = cur_sibling_action_obj_after.get_last_sibling_action_obj();
							if(_action.is_not_valid_action_item_obj(last_sibling_action_item_obj)) {
								console.log("!Error! / shape_sibling_element / _action.is_not_valid_action_item_obj(last_sibling_action_item_obj)");
								return;
							}

							consoler.say("sse / 1-2-4 / " + last_sibling_action_item_obj.get_action_name());

							var cur_element_jq_last = last_sibling_action_item_obj.get_event_manager().get_element_jq();
							_obj.set_list_last_row_round(cur_element_jq_last);

						} // end inner if

					} // end outer if

					var cur_btn_eject_collection_element_jq = cur_first_sibling_element_event_manager.get_btn_eject_collection_element_jq();
					cur_element_collection_set.ecs_set_btn_collection_eject_jq(cur_btn_eject_collection_element_jq);					

				} else if(cur_action_item_obj.is_last()) {

					consoler.say("sse / 2-1 / 마지막 엘리먼트라면 자신과 이전 형제 엘리먼트까지 변경합니다.");
					_obj.set_list_last_row_round(cur_element_jq);

					// 이전 엘리먼트는 테두리를 각지게 바꿈.
					consoler.say("sse / 2-2 / 이전 엘리먼트는 테두리를 각지게 바꿈.");
					var cur_sibling_action_obj_before = cur_action_item_obj.get_sibling_action_obj_before();
					if(_action.is_not_valid_action_item_obj(cur_sibling_action_obj_before)) {
						console.log("!Error! / shape_sibling_element / _action.is_not_valid_action_item_obj(cur_sibling_action_obj_before)");
						return;
					}

					var cur_element_jq_before = cur_sibling_action_obj_before.get_event_manager().get_element_jq();
					_obj.remove_list_row_round(cur_element_jq_before);

				} else {
					// 중간의 엘리먼트가 들어옴.

					var cur_sibling_action_obj_before = cur_action_item_obj.get_sibling_action_obj_before();
					if(_action.is_not_valid_action_item_obj(cur_sibling_action_obj_before)) {
						console.log("!Error! / shape_sibling_element / _action.is_not_valid_action_item_obj(cur_sibling_action_obj_before)");
						return;
					}
					var cur_element_jq_before = cur_sibling_action_obj_before.get_event_manager().get_element_jq();
					_obj.remove_list_row_round(cur_element_jq_before);
					if(cur_sibling_action_obj_before.is_first()) {
						_obj.set_list_first_row_round(cur_element_jq_before);
					}

					var cur_element_jq = cur_action_item_obj.get_event_manager().get_element_jq();
					if(cur_element_jq == undefined) {
						console.log("!Error! / shape_sibling_element / cur_element_jq == undefined");
						return;
					}
					_obj.remove_list_row_round(cur_element_jq);

					var cur_sibling_action_obj_after = cur_action_item_obj.get_sibling_action_obj_after();
					if(_action.is_not_valid_action_obj(cur_sibling_action_obj_after)) {
						console.log("!Error! / shape_sibling_element / _action.is_not_valid_action_obj(cur_sibling_action_obj_after)");
						return;
					}
					var cur_element_jq_after = cur_sibling_action_obj_after.get_event_manager().get_element_jq();
					_obj.remove_list_row_round(cur_element_jq_after);	
					if(cur_sibling_action_obj_after.is_last()) {
						_obj.set_list_last_row_round(cur_element_jq_after);
					}

				} // end if		
			}
			// @ private
			// @ scope 	: event manager
			// @ Desc 	: 1. 검색 리스트 정보를 가져와 구성합니다.
			,set_search_list_data_on_input_group:function(){

				// set search list data
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / set_search_list_data_on_input_group / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				if(cur_action_item_obj.is_not_item_select_box() && cur_action_item_obj.is_not_item_select_box_addable()) {
					// 검색 리스트 타입이 아니면 중단합니다.
					console.log("!Error! / set_search_list_data_on_input_group / cur_action_item_obj.is_not_item_select_box() && cur_action_item_obj.is_not_item_select_box_addable()");
					return;
				}

				// ,call_delegate_on_event:function(cur_event_type, cur_search_option_obj){
				var cur_search_list_arr = 				
				this.call_delegate_on_event(
					// cur_event_type
					_action.EVENT_TYPE_ADD_SELECT_OPTION
					// cur_search_option_obj
				);
				// CHECK
				// _obj.is_not_valid_search_option
				if(_v.is_not_valid_array(cur_search_list_arr)) {
					console.log("!Error! / set_search_list_data_on_input_group / _v.is_not_valid_array(cur_search_list_arr)");
					return;
				}
				for (var idx = 0; idx < cur_search_list_arr.length; idx++) {
					var cur_search_option_obj = cur_search_list_arr[idx];
					if(_obj.is_not_valid_search_option(cur_search_option_obj)) {
						console.log("!Error! / set_search_list_data_on_input_group / _obj.is_not_valid_search_option(cur_search_option_obj)");
						return;
					}
					this.add_element_to_search_output_list_jq(cur_search_option_obj);
				}

				// 검색 리스트에 이벤트 적용
				this.set_event_to_search_output_list_jq();

				// 사용자가 입력한 검색 키워드를 0.3초마다 가져와서 리스트에 표시합니다.
				this.set_title_input_jq_search_list_watch_dog_interval();

				// REMOVE ME
				// search btn event
				/*
				var _self = this;
				var cur_title_input_btn_search_jq = this.get_title_input_btn_search_jq();
				if(cur_title_input_btn_search_jq == undefined){
					return;
				}

				console.log("XXX / this.title_input_btn_search_jq ::: ",this.title_input_btn_search_jq);

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
				*/
			}
			,set_event_btn_cancel_on_input_group:function(cur_event_type){
				
				// TODO _obj.EVENT_TYPE_INSERT_ITEM 나 _action.EVENT_TYPE_ADD_ROW이 1개로 통합되어야 할 듯.
				if( _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type && 
					_obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type && 
					_action.EVENT_TYPE_ADD_ROW !== cur_event_type ){

					console.log("!Error! / set_event_btn_cancel_on_input_group / _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type || _obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type || _action.EVENT_TYPE_ADD_ROW !== cur_event_type");
					return;
				}

				var _self = this;
				var do_on_event = function(e) {
					e.stopPropagation();

					// REMOVE ME
					// _self.clear_title_input_jq_value();
					_self.rollback_title_jq_text();

					// 입력 모드 이전인 수정 모드로 돌아간다.
					_self.show_edit_mode();

					_self.remove_all_element_of_search_output_list_jq();

					_self.shape_sibling_element();

					// 뷰단의 엘리먼트들의 모양을 view mode일 경우의 모습으로 바꾸어 줍니다.
					_self.call_delegate_show_view_mode_view_control(_self);

					_self.release();
				}

				var cur_title_input_btn_cancel_jq = this.get_title_input_btn_cancel_jq();
				if(cur_title_input_btn_cancel_jq == null){
					return;
				}

				this.off_title_input_btn_cancel_jq();
				cur_title_input_btn_cancel_jq.click(function(e){
					do_on_event(e);
				});

				// set button event
				this.off_title_input_btn_cancel_jq();
				var is_force_change = true;
				this.set_btn_event_color(cur_title_input_btn_cancel_jq, is_force_change);

				cur_title_input_btn_cancel_jq.click(function(e){
					e.stopPropagation();
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
					console.log("HERE / CHECK / 003");
					this.off_title_input_btn_ok_jq();
				}

			}
			,set_event_btn_ok_on_input_group:function(cur_event_type){

				console.log("HERE / set_event_btn_ok_on_input_group / cur_event_type ::: ",cur_event_type);

				// TODO _obj.EVENT_TYPE_INSERT_ITEM 나 _action.EVENT_TYPE_ADD_ROW이 1개로 통합되어야 할 듯.
				if( _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type && 
					_obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type && 
					_action.EVENT_TYPE_ADD_ROW !== cur_event_type ){

					console.log("!Error! / set_event_btn_ok_on_input_group / _obj.EVENT_TYPE_INSERT_ITEM !== cur_event_type || _obj.EVENT_TYPE_UPDATE_ITEM !== cur_event_type || _action.EVENT_TYPE_ADD_ROW !== cur_event_type");
					return;
				}

				var cur_title_input_btn_ok_jq = this.get_title_input_btn_ok_jq();
				if(cur_title_input_btn_ok_jq == undefined) {
					console.log("!Error! / set_event_btn_ok_on_input_group / cur_title_input_btn_ok_jq == undefined");
					return;
				}

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / set_event_btn_ok_on_input_group / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				var _self = this;
				var do_on_event = function(e) {
					// 이벤트 전파를 막습니다.
					e.stopPropagation();

					console.log("set_event_btn_ok_on_input_group / do_on_event /cur_action_item_obj ::: ",cur_action_item_obj);

					// 입력된 텍스트 내용을 검사합니다.
					var cur_title_input_jq_value = _self.get_title_input_jq_value();
					if(_v.is_not_valid_str(cur_title_input_jq_value) && confirm("Please check your text.\nIt cannot be empty!")) {
						_self.focus_title_input_jq();
						return;
					}

					if(_obj.EVENT_TYPE_INSERT_ITEM === cur_event_type || _action.EVENT_TYPE_ADD_ROW === cur_event_type){

						// 입력 창을 가립니다.
						_self.hide_title_input_group_jq();

						// _self는 OK 버튼이 포함된 input group.
						// 뷰에 새롭게 열을 추가합니다.
						var cur_element_set = _self.get_element_set();
						var cur_element_collection_set = cur_element_set.get_element_collection_set();
						cur_element_collection_set.add_element(_self);

					} else if(_obj.EVENT_TYPE_UPDATE_ITEM === cur_event_type){

						_self.show_view_mode();
						_self.hide_shy_child();
						_self.update_row_title();

						var cur_action_item_obj = _self.get_action_item_obj();
						if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
							console.log("!Error! / do_on_event / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
							return;
						}

						cur_action_item_obj.set_action_name(_self.get_title_input_jq_value());
					}

					// 사용자가 입력한 내역을 삭제합니다.
					_self.clear_title_input_jq_value();
					_self.clear_title_input_jq_prev_value();

					// 뷰 모습을 view mode로 변경해줍니다.
					var cur_delegate_show_view_mode_view_control = _self.get_delegate_show_view_mode_view_control();
					if(cur_delegate_show_view_mode_view_control != undefined) {
						cur_delegate_show_view_mode_view_control._apply([_self]);	
					}

					_self.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_INPUT_TEXT, cur_event_type);

					_self.call_delegate_show_view_mode_view_control(_self);
				}

				var cur_title_input_jq = this.get_title_input_jq();
				cur_title_input_jq.off();
				cur_title_input_jq.keyup(function(e) {
					var code = e.keyCode || e.which;
					// Enter : 13 / ESC : 27
					if(code === 13) {
						// pressing ok btn
						do_on_event(e);
					}
				});

				// set event input btn ok
				this.off_title_input_btn_ok_jq();

				var is_force_change = true;
				this.set_btn_event_color(cur_title_input_btn_ok_jq, is_force_change);

				cur_title_input_btn_ok_jq.click(function(e){
					do_on_event(e);
				});

			}
			,set_event_time_btns:function(){	

				var _self = this;
				var cur_time_jq = this.get_time_jq();
				var is_force_change = true;

				var cur_btn_time_plus_jq = this.get_time_input_group_jq_btn_time_plus_jq();
				if(cur_btn_time_plus_jq == undefined){
					console.log("!Error! / set_event_time_btns / cur_btn_time_plus_jq == undefined");
					return;
				}

				var cur_btn_time_minus_jq = this.get_time_input_group_jq_btn_time_minus_jq();
				if(cur_btn_time_minus_jq == undefined){
					console.log("!Error! / set_event_time_btns / cur_btn_time_minus_jq == undefined");
					return;
				}

				var cur_btn_time_ok_jq = this.get_title_input_btn_ok_jq();
				if(cur_btn_time_ok_jq == undefined){
					console.log("!Error! / set_event_time_btns / cur_btn_time_ok_jq == undefined");
					return;
				}

				var cur_btn_time_cancel_jq = this.get_title_input_btn_cancel_jq();
				if(cur_btn_time_cancel_jq == undefined){
					console.log("!Error! / set_event_time_btns / cur_btn_time_cancel_jq == undefined");
					return;
				}

				// remove prev btn events
				this.off_time_input_group_jq_btn_time_plus_jq();
				this.off_time_input_group_jq_btn_time_minus_jq();
				this.off_time_input_group_jq_btn_time_ok_jq();

				// mouse enter, leave 이벤트 발생시의 모양을 바꿔줍니다.
				this.set_btn_event_color(cur_btn_time_plus_jq, is_force_change);
				this.set_btn_event_color(cur_btn_time_minus_jq, is_force_change);
				this.set_btn_event_color(cur_btn_time_ok_jq, is_force_change);

				// assign time. check time mode.
				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / set_event_time_btns / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				var cur_element_type = cur_action_item_obj.get_element_type();


				var set_minutes_offset = function(offset_minutes, target_action_item_obj){

					if(_action.is_not_valid_action_item_obj(target_action_item_obj)) {
						console.log("set_event_time_btns / set_minutes_offset / _action.is_not_valid_action_item_obj(target_action_item_obj)");
						return;
					}

					// REMOVE ME
					// var hour_n_minutes_str = cur_time_input_group_jq_input_jq.val();
					var hour_n_minutes_str = target_action_item_obj.get_event_manager().get_value_time_jq();

					var new_offset_moment = _dates.get_moment_minutes_offset_from_hour_n_minutes_str(hour_n_minutes_str, offset_minutes);
					var new_hour_n_minutes_str = _dates.get_hour_n_minutes_str_from_moment_obj(new_offset_moment);

					target_action_item_obj.get_event_manager().set_value_time_jq(new_hour_n_minutes_str);

					console.log("TODO 새로 변경된 시간을 입력해줍니다. / set_minutes_offset");
				}

				var set_seconds_offset = function(offset_seconds, target_action_item_obj){

					if(_action.is_not_valid_action_item_obj(target_action_item_obj)) {
						console.log("set_event_time_btns / set_seconds_offset / _action.is_not_valid_action_item_obj(target_action_item_obj)");
						return;
					}

					// REMOVE ME
					// var minutes_n_seconds_str = cur_time_input_group_jq_input_jq.val();
					var minutes_n_seconds_str = target_action_item_obj.get_event_manager().get_value_time_jq();

					var new_offset_moment = _dates.get_moment_seconds_offset_from_minutes_n_seconds_str(minutes_n_seconds_str, offset_seconds);
					var new_minutes_n_seconds_str = _dates.get_minutes_n_seconds_str_from_moment_obj(new_offset_moment);

					target_action_item_obj.get_event_manager().set_value_time_jq(new_minutes_n_seconds_str);

					console.log("TODO 새로 변경된 시간을 입력해줍니다. / set_seconds_offset");
				}

				var check_time_format_valid = function(target_action_item_obj){

					if(_action.is_not_valid_action_item_obj(target_action_item_obj)) {
						console.log("!Error! / set_event_time_btns / check_time_format_valid / _action.is_not_valid_action_item_obj(target_action_item_obj)");
						return;
					}

					var cur_time_double_digit_str = target_action_item_obj.get_event_manager().get_value_time_jq();
					var prev_time_double_digit_str = target_action_item_obj.get_event_manager().get_element_jq().attr("prev_value");

					var is_valid_time_format_str = false;

					if(cur_action_item_obj.is_item_title_n_time_hh_mm()) {
						is_valid_time_format_str = _dates.is_valid_time_format_str(cur_time_double_digit_str, _dates.DATE_TYPE_HH_MM);
					}

					if(is_valid_time_format_str){

						// No prob! update prev_value
						target_action_item_obj.get_event_manager().get_time_jq().attr("prev_value", cur_time_double_digit_str);

						return true;
					} else {
						// Oops! Something goes wrong. roll back your time str.
						if(!confirm("Please check your time format.\nExample : 17:30")){

							target_action_item_obj.get_event_manager().set_value_time_jq(prev_time_double_digit_str);

						}
						return false;
					}
				}

				var do_on_event_btn_time_plus = function(e, target_action_item_obj) {
					e.stopPropagation();

					console.log("XXX / do_on_event_btn_time_plus");

					if(!check_time_format_valid(target_action_item_obj)) return;


					if(target_action_item_obj.is_item_title_n_time_hh_mm()) {
						set_minutes_offset(5, target_action_item_obj);	// plus time (+ 5 minutes per click)	
					}
				}

				cur_btn_time_plus_jq.click(function(e){
					do_on_event_btn_time_plus(e, cur_action_item_obj);
				});


				var do_on_event_btn_time_minus = function(e, target_action_item_obj) {
					e.stopPropagation();

					console.log("XXX / do_on_event_btn_time_minus");

					if(!check_time_format_valid(target_action_item_obj)) return;

					if(cur_action_item_obj.is_item_title_n_time_hh_mm()) {
						set_minutes_offset(-5, cur_action_item_obj);
					}
				}

				cur_btn_time_minus_jq.click(function(e){
					do_on_event_btn_time_minus(e, cur_action_item_obj);
				});

				var do_on_event_btn_time_ok = function(e, target_action_item_obj) {
					e.stopPropagation();

					console.log("XXX / do_on_event_btn_time_ok / target_action_item_obj ::: ",target_action_item_obj);

					if(!check_time_format_valid(target_action_item_obj)){
						console.log("!Error! / do_on_event_btn_time_ok / !check_time_format_valid()");
						return;
					}

					_self.hide_all();
					_self.show_view_mode();
					_self.release();

					var cur_action_item_obj = _self.get_action_item_obj();
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / do_on_event_btn_time_ok / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
						return;
					}

					// update time
					var cur_time_str = _self.get_value_time_jq();
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
						cur_action_item_obj.update_time_hh_mm(seconds_total);

						// _self.set_value_time_jq(cur_time_str);

					} else {

						console.log("Need to implement!");
						return;

					}

					// TODO 시간 정보를 action obj에도 업데이트함.

					_self.call_delegate_save_n_reload(cur_element_type, _obj.EVENT_TYPE_UPDATE_ITEM);
					_self.release();

				}

				cur_btn_time_ok_jq.click(function(e){
					e.stopPropagation();

					console.log("cur_btn_time_ok_jq.click / cur_action_item_obj ::: ",cur_action_item_obj);

					do_on_event_btn_time_ok(e, cur_action_item_obj);

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
						do_on_event_btn_time_ok(e, cur_action_item_obj);
					} else if(code === 27) {
						do_on_event_btn_time_cancel(e, cur_action_item_obj);
					} else if(code === 187) {
						do_on_event_btn_time_plus(e, cur_action_item_obj);
					} else if(code === 189) {
						do_on_event_btn_time_minus(e, cur_action_item_obj);
					}

				},this));

			}
			// @ Scope : Event manager
			,on_add_btn_click:function(){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / on_add_btn_click / _v.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				// 더 이상 이벤트를 받지 않도록 잠급니다.
				this.lock();

				// 입력 형식이 2가지로 나뉘어 처리됩니다.
				if(cur_action_item_obj.is_table_child_column_list_field_item()) {

					var cur_table_element_collection_set = this.get_element_set().get_element_collection_set().ecs_get_parent_element_collection_set();
					if(cur_table_element_collection_set == undefined) {
						console.log("!Error! / on_add_btn_click / cur_table_element_collection_set == undefined");
						return;
					}

					// 1. TABLE FIELD ACTION ITEM
					// row에 여러패턴이 섞여 있으므로 기본값을 가지는 열을 추가해야 합니다.
					_action_table.add_editable_table_row(cur_action_item_obj, cur_table_element_collection_set);
					this.release();

				} else {

					// 2. LIST ACTION ITEM
					if(cur_action_item_obj.get_action_is_shy()) {
						// 첫번째 엘리먼트가 추가되는 경우

						var cur_element_collection_set = this.get_element_set().get_element_collection_set();
						if(cur_element_collection_set == undefined) {
							console.log("!Error! / on_add_btn_click / cur_element_collection_set == undefined");
							return;
						}
						// 2-1. 엘리먼트를 shy --> not shy로 바꿉니다.
						cur_element_collection_set.add_element(this);

						// 2-2. 입력창을 보여줍니다.
						var event_mode = _obj.EVENT_TYPE_UPDATE_ITEM;
						this.show_input_mode(event_mode);

					} else {
						// 이미 보이는 엘리먼트에서 추가되는 경우
						this.show_input_mode(_action.EVENT_TYPE_ADD_ROW);
					}

				}

				
			}
			,on_edit_btn_click:function(){

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / on_edit_btn_click / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				if(this.is_lock()){
					return;
				}
				// 더 이상 이벤트를 받지 않도록 잠급니다.
				this.lock();

				// edit mode일 경우만 사용합니다.
				// 선택한 열의 타이틀을 input group의 텍스트로 바꿉니다.
				this.hide_title_jq_text_head();

				// set search list data
				if(cur_action_item_obj.is_item_select_box() || cur_action_item_obj.is_item_select_box_addable()) {

					this.set_search_list_data_on_input_group();	

				}

				var event_mode = _obj.EVENT_TYPE_UPDATE_ITEM;
				this.show_input_mode(event_mode);


			}
			,get_element_area:function(){
				var cur_element_jq = this.get_element_jq();
				if(cur_element_jq == null) return 0;

				return cur_element_jq.outerWidth() * cur_element_jq.outerHeight();
			}

			// @ functions - sibling actions
			,call_delegate_on_prev_siblings_event_manager:function(delegate_obj){
				if(_obj.isNotValidDelegate(delegate_obj)){
					console.log("!Error! / airborne.bootstrap.obj / call_delegate_on_prev_siblings_event_manager / _obj.isNotValidDelegate(delegate_obj)");
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
					console.log("!Error! / airborne.bootstrap.obj / call_delegate_on_next_siblings_event_manager / _obj.isNotValidDelegate(delegate_obj)");
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
					console.log("!Error! / airborne.bootstrap.obj / call_delegate_on_siblings_event_manager / _obj.isNotValidDelegate(delegate_obj)");
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
					console.log("!Error! / airborne.bootstrap.obj / get_top_parent_element_collection_set / cur_element_collection_set == undefined");
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
					console.log("!Error! / airborne.bootstrap.obj / call_delegate_do_to_all_element_set / cur_element_set_collection == undefined)");
					return;
				}
				if(_obj.isNotValidDelegate(delegate_do_to_all_element_set)) {
					console.log("!Error! / airborne.bootstrap.obj / call_delegate_do_to_all_element_set / _obj.isNotValidDelegate(delegate_do_to_all_element_set)");
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
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / get_shy_child_element_set / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
						return;
					}

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
					if(_action.is_not_valid_action_item_obj(next_action_item_obj)) {
						console.log("!Error! / get_shy_sibling_element_set / _action.is_not_valid_action_item_obj(next_action_item_obj)");
						return;
					}

					if(next_action_item_obj.get_action_is_shy()) {
						shy_element_set = next_element_set;
						break;
					}
				}
				return shy_element_set;
			}
			,show_shy_child:function(){

				this.show_child_shy_element_container_jq();

				var cur_action_item_obj = this.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / show_input_mode_default / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				var cur_child_action_obj_list = cur_action_item_obj.get_children();
				var cur_children_action_obj = cur_child_action_obj_list[0];

				var cur_first_child_action_item_obj = undefined;
				if(_action.is_valid_action_obj(cur_children_action_obj)) {
					cur_first_child_action_item_obj = cur_children_action_obj.get_first_child();
				}
				if(_action.is_valid_action_item_obj(cur_first_child_action_item_obj) && cur_first_child_action_item_obj.get_action_is_shy()) {
					cur_first_child_action_item_obj.get_event_manager().show_element_jq();
				}
			}
			,hide_shy_child:function(){
				this.hide_child_shy_element_container_jq();
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
					var next_element_jq = next_element_set.get_event_manager().get_element_jq();
					if(next_element_jq == undefined) {
						console.log("!Error! / move_shy_sibling_element_set_above_this / next_element_jq == undefined");
						return;
					}

					_obj.remove_list_row_round(next_element_jq);
					_obj.set_list_last_row_round(cur_title_input_group_jq);
				}

				
				//element_type
				var cur_action_item_obj = shy_sibling_element_set.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / move_shy_sibling_element_set_above_this / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}
				if(cur_action_item_obj.is_item_title_n_time_hh_mm()) {
					// console.log("시간 타입인 경우, 이동한 열에 맞게 시간을 변경해줍니다.");

					// 이전 객체가 있다면 이전 객체의 시간을 가져옵니다.
					var prev_time_sec = 0;
					var prev_action_item_obj = prev_element_set.get_action_item_obj();
					if(_action.is_valid_action_item_obj(prev_action_item_obj)) {

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
					if(_action.is_valid_action_item_obj(next_action_item_obj)) {

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
						cur_action_item_obj.update_time_hh_mm(next_time_sec - five_minutes_in_secs);

					} else if( prev_time_sec > 0 && next_time_sec == 0 ) {
						// 마지막 엘리먼트로 옮겼습니다.
						// 다음 시간으로부터 5분 후로 변경합니다.
						cur_action_item_obj.update_time_hh_mm(prev_time_sec + five_minutes_in_secs);

					} else if( prev_time_sec > 0 && next_time_sec > 0 ) {
						// 리스트의 처음과 마지막이 아닌 이전과 이후 엘리먼트가 모두 있습니다.
						// 이전과 이후 엘리먼트의 사이 값으로 새로운 시간을 지정해 줍니다.

						if( prev_time_sec == next_time_sec ) {
							// 두 시간이 동일한 경우는 같은 시간으로 넘겨줍니다.
							cur_action_item_obj.update_time_hh_mm(prev_time_sec);

						} else if( prev_time_sec < next_time_sec ) {
							// 두 시간이 차이가 있는 경우

							var ten_minutes_in_secs = 600; // 60 * 10
							var time_diff_in_secs = (next_time_sec - prev_time_sec);
							if( ten_minutes_in_secs <= time_diff_in_secs ){
								// 두 시간의 차이가 10분 이상인 경우, 두 시간 사이 값의 중간 값을 설정해줍니다.
								// 중간값이 5분 단위로 제어되도록 설정합니다.
								cur_action_item_obj.update_time_hh_mm(prev_time_sec + parseInt(time_diff_in_secs / 2));
									
							} else {
								// 두 시간의 차이가 10분 미만인 경우, 두 시간 사이 값중 작은 값을 설정해줍니다.
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
				this.set_title_input_jq_value("New Item");
				this.focus_title_input_jq();
			}
			// @ Public
			// @ Desc 	: 현재 스크롤 y 위치
			,scroll_top:0
			,set_scroll_top:function() {
				var body = $("html, body");
				this.scroll_top = body.scrollTop();
			}
			,rollback_scroll_top:function() {
				var body = $("html, body");
				body.stop().animate({scrollTop:this.scroll_top}, '300', 'swing', function() { 
					// To do something.
				});				
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
			console.log("!Error! / element_jq is @required / Using set_element_jq()");
			return null;
		}
		if(element_event_manager.element_color == null){
			console.log("!Error! / element_color is @required / Using set_element_color()");
			return null;
		}
		if(element_event_manager.element_background_color == null){
			console.log("!Error! / element_background_color is @required / Using set_element_background_color()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.element_container_jq)){
			console.log("!Error! / element_container_jq is @required / Using set_element_container_jq()");
			return null;
		}
		if(_v.isNotValidStr(element_event_manager.element_id)){
			console.log("!Error! / element_id is @required / Using set_element_id()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_jq)){
			console.log("!Error! / title_jq is @required / Using set_title_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.parent_container_jq)){
			console.log("!Error! / parent_container_jq is @required / Using set_parent_container_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_group_jq)){
			console.log("!Error! / title_input_group_jq is @required / Using set_title_input_group_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_jq)){
			console.log("!Error! / title_input_jq is @required / Using set_title_input_jq()");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_btn_ok_jq)){
			console.log("!Error! / title_input_btn_ok_jq is @required / Using set_title_input_btn_ok_jq");
			return null;
		}
		if(_v.isNotJQueryObj(element_event_manager.title_input_btn_cancel_jq)){
			console.log("!Error! / title_input_btn_cancel_jq is @required / Using set_title_input_btn_cancel_jq");
			return null;
		}
		if(_obj.isNotValidDelegate(element_event_manager.delegate_save_n_reload)){
			console.log("!Error! / delegate_save_n_reload is @required / Using set_delegate_save_n_reload");
			return null;
		}
		action_item_obj.set_event_manager(element_event_manager);

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

			var cur_action_item_obj = event_manager_on_mousemove.get_action_item_obj();
			if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
				console.log("!Error! / add_mousemove_callback_set / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
				return;
			}

			if(cur_action_item_obj.is_table_child_column_list_field_item()) {
				// Table의 테두리 색상을 변경하는 처리.
				var cur_element_collection_set = event_manager_on_mousemove.get_element_set().get_element_collection_set();
				if(cur_element_collection_set == undefined) {
					console.log("!Error! / add_mousemove_callback_set / cur_element_collection_set == undefined");
					return;
				}

				var cur_table_element_collection_set = cur_element_collection_set.ecs_get_parent_element_collection_set();
				if(cur_table_element_collection_set == undefined) {
					console.log("!Error! / add_mousemove_callback_set / cur_table_element_collection_set == undefined");
					return;
				}

				var cur_element_collection_container_jq = cur_table_element_collection_set.get_element_collection_container_jq();

				var is_hover_element_set = _obj.is_hover(mousemove_event, cur_element_collection_container_jq);

				if(cur_element_collection_set.get_was_hover() !== is_hover_element_set) {
					cur_element_collection_set.set_was_hover(is_hover_element_set);

					var cur_parent_action_table_obj = cur_action_item_obj.get_parent().get_parent();
					if(_action.is_not_valid_action_obj(cur_parent_action_table_obj)) {
						console.log("!Error! / add_mousemove_callback_set / _action.is_not_valid_action_obj(cur_parent_action_table_obj)");
						return;
					}
					var cur_parent_action_object_add_on = cur_parent_action_table_obj.get_parent_add_on();
					if(_action.is_not_valid_action_obj(cur_parent_action_object_add_on)) {
						console.log("!Error! / add_mousemove_callback_set / _action.is_not_valid_action_obj(cur_parent_action_object_add_on)");
						return;
					}
					var cur_parent_action_object_add_on_event_manager = cur_parent_action_object_add_on.get_event_manager();

					if(is_hover_element_set) {

						// 변경된 색상을 부모 item이 있다면 같은 배경색으로 바꿉니다.
						// 부모 item의 버튼은 모두 가립니다.
						cur_element_collection_container_jq.css("border-color",event_manager_on_mousemove.get_element_color());
						cur_parent_action_object_add_on_event_manager.show_child_focusing_mode(event_manager_on_mousemove.get_element_color());

					} else {

						// 자신의 테두리 색은 원래대로 되돌려 놓습니다.
						cur_element_collection_container_jq.css("border-color",event_manager_on_mousemove.get_element_border_color());

						// 자신 말고 다른 자식 객체에 마우스 커서가 올라가 있어 부모 item이 색상이 이미 변한경우의 처리
						if(cur_parent_action_object_add_on_event_manager.get_is_child_focusing_mode()) {
							return;
						}

						// 부모 item이 있다면 원래 배경색으로 돌려놓습니다.
						// 부모 item의 버튼은 모두 보여줍니다.
						var parent_action_object_add_on_element_jq = cur_parent_action_object_add_on_event_manager.get_element_jq();
						var is_hover_parent_action_object_add_on = _obj.is_hover(mousemove_event, parent_action_object_add_on_element_jq);
						if(is_hover_parent_action_object_add_on) {
							cur_parent_action_object_add_on_event_manager.show_edit_mode();
						} else {
							cur_parent_action_object_add_on_event_manager.show_view_mode();
						}

					} // end inner if

				} // end outer if

			} // end outer if

			if(was_hover === is_hover) return;

			// 검사중인 엘리먼트가 shy mode인지 확인합니다.

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

				if(cur_action_item_obj.is_table_child_column_list_field_item()) {
					// 1. TABLE	- shy 모드를 사용하지 않습니다.

					console.log("HERE / cur_action_item_obj ::: ",cur_action_item_obj);
					console.log("HERE / cur_parent_element_set ::: ",cur_parent_element_set);

					has_sibling = false;
					has_shy_sibling = false;

				} else if(cur_action_item_obj.get_parent().is_list()){
					// 2. LIST	
					cur_sibling_element_set_arr = cur_parent_element_set.get_children_element_set_arr();
					cur_sibling_shy_element_set_arr = cur_parent_element_set.get_child_shy_element_set_arr();

					has_sibling = (_v.is_valid_array(cur_sibling_element_set_arr))?true:false;
					has_shy_sibling = (_v.is_valid_array(cur_sibling_shy_element_set_arr))?true:false;

				} else {
					console.log("!Error! / add_mousemove_callback_set / Unknown!");
				}

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

				var is_child_mouse_over = false;
				if(!has_children && has_shy_child) {
					consoler.say("mmc / 2-1 / ",title_for_test);
					consoler.say("mmc / 2-1 / 자식 객체가 없고, shy element가 화면에 보인다면 화면에서 숨깁니다.");

					is_child_mouse_over = true;

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

				event_manager_on_mousemove.on_mouse_leave(is_child_mouse_over);

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

				if(cur_parent_element_set != undefined){
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
				
				if(cur_parent_element_set != undefined && !cur_action_item_obj.is_table_child_column_list_field_item()){

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
						if(_action.is_not_valid_action_item_obj(child_action_item_obj)) {
							console.log("!Error! / add_mousemove_callback_set / _action.is_not_valid_action_item_obj(child_action_item_obj)");
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

		if(_action.is_not_valid_event_type(event_str)){
			console.log("!Error! / get_select_option_obj / _action.is_not_valid_event_type(event_str)");
			return null;
		}
		if(_action.is_not_valid_action_item_obj(action_item_obj)) {
			console.log("!Error! / get_select_option_obj / _action.is_not_valid_action_item_obj(action_item_obj)");
			return null;
		}

		return {_event:event_str,_action_item_obj:action_item_obj};
	}
	// @ Public
	// @ Desc : 엘리먼트들이 모여 구성된 리스트, 테이블들의 엘리먼트 집합을 관리하는 객체. 리스트나 테이블등을 구성한 뒤에는 이 콜렉션 셋을 반환한다.
	// ex > 엘리먼트 간의 참조 구조
	// 부모 리스트 <- 부모 리스트의 열 <- 리스트 <- 리스트의 열 <- 자식 리스트 <- 자식 리스트의 열	
	,make_element_collection_set:function(element_collection_id){

		var element_collection_set = {
			element_collection_id:element_collection_id
			,set_element_collection_id:function(element_collection_id){
				this.element_collection_id = element_collection_id;
			}
			,get_element_collection_id:function(){
				return this.element_collection_id;
			}
			// @ public
			// @ scope : Element collection set / ecs
			// @ desc : 엘리먼트 컬렉션 셋의 기본적인 정보를 보여줍니다. 디버깅 용도.
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
			,hide_element_collection_container_jq:function(){
				if(this.element_collection_container_jq != undefined) {
					this.element_collection_container_jq.hide();
				}
			}
			,show_element_collection_container_jq:function(){
				if(this.element_collection_container_jq != undefined) {
					this.element_collection_container_jq.show();
				}
			}
			// 이 엘리먼트 컬렉션 셋을 구성하는 엘리먼트 셋들을 의미합니다.
			// 리스트의 열, 테이블읠 컬럼-필드를 의미합니다.
			,element_set_arr:[]
			,get_element_set_cnt:function() {
				if(_v.is_not_valid_array(this.element_set_arr)) {
					return -1;
				}
				return this.element_set_arr.length;
			}
			// @ public
			// @ scope : Element Collection Set
			// @ desc : Element Set을 Element Collection Set에 추가합니다.
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

				if(_action.is_not_valid_action_item_obj(action_item_obj)) {
					console.log("!Error! / push_new_element_set / _action.is_not_valid_action_item_obj(action_item_obj)");
					return;
				}
				if(event_manager == undefined) {
					console.log("!Error! / push_new_element_set / event_manager == undefined");
					return;
				}

				var cur_element_set = _action.make_element_set(action_item_obj, event_manager);
				this.push_element_set(cur_element_set, idx);

				return cur_element_set;

			}
			,del_element:function() {

				// 사용자가 열을 삭제하였을 때의 처리

			}
			// REMOVE ME
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
			// @ Scope : Element Collection Set
			,add_element:function(sibling_element_event_manager) {

				if(sibling_element_event_manager == undefined) {
					console.log("!Error! / add_element / sibling_element_event_manager == undefined");
					return;
				}
				var sibling_action_item_obj = sibling_element_event_manager.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(sibling_action_item_obj)) {
					console.log("!Error! / add_element / _action.is_not_valid_action_item_obj(sibling_action_item_obj)");
					return;
				}

				var consoler = airborne.console.get();
				// consoler.off();

				var new_action_name = sibling_element_event_manager.get_title_input_jq_value();
				if(_v.is_not_valid_str(new_action_name)) {
					new_action_name = "New Item";
					// console.log("!Error! / add_element / _v.is_not_valid_str(new_action_name)");
					// return;
				}

				consoler.say("add_element / 0 / 추가되는 엘리먼트 이름 : " + new_action_name);
				consoler.say("add_element / 0 / sibling_action_item_obj : " + sibling_action_item_obj);
				consoler.say("add_element / 0 / 추가되는 엘리먼트 이름으로 action item obj를 복사합니다.");

				// 이벤트 락을 해제합니다. 다른 이벤트를 사용할 수 있도록 복원합니다.
				var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
				if(cur_event_hierarchy_manager.is_lock()) {
					cur_event_hierarchy_manager.release();
				}

				var sibling_action_item_obj_copy = undefined;
				if(sibling_action_item_obj.get_action_is_shy()) {

					consoler.say("add_element / 1-1 / shy 모드인 경우는 자신을 shy 모드 해제, 화면에 노출.");

					sibling_action_item_obj.set_action_name(new_action_name);
					sibling_action_item_obj.set_action_is_shy(false);
					var cur_parent_action_obj = sibling_action_item_obj.get_parent();
					if(_action.is_not_valid_action_obj(cur_parent_action_obj)) {
						console.log("!Error! / add_element / _action.is_not_valid_action_obj(cur_parent_action_obj)");
						return;
					}
					cur_parent_action_obj.set_first_child_action_obj(sibling_action_item_obj);

					// shy 객체의 참조를 가져옵니다.
					var cur_parent_event_manager = sibling_element_event_manager.get_parent_event_manager();
					if(cur_parent_event_manager == undefined) {
						console.log("!Error! / add_element / cur_parent_event_manager == undefined");
						return;
					}
					cur_parent_event_manager.em_convert_shy_child_to_child();

					// update name
					sibling_element_event_manager.set_title_jq_text(
						// new_title
						new_action_name
						// is_change_attr_input_value
						, true
						// is_change_attr_tossed_value){
						, true
					);

				} else {
					// 이미 노출된 list row를  복제해서 추가하는 경우.
					sibling_action_item_obj_copy = sibling_action_item_obj.copy(new_action_name);

					consoler.say("add_element / 1-2 / 추가된 action item obj를 화면에 그립니다.");
					consoler.say("add_element / 1-2 / sibling_action_item_obj_copy :: ",sibling_action_item_obj_copy);

					var cur_element_collection_set = sibling_element_event_manager.get_element_set().get_element_collection_set();
					if(cur_element_collection_set == undefined) {
						console.log("!Error! / add_element / cur_element_collection_set == undefined");
						return;
					}

					console.log("XXX / sibling_action_item_obj_copy :: ",sibling_action_item_obj_copy);

					// 낱개의 엘리먼트만 그립니다.
					cur_element_collection_set = 
					_action_list.add_editable_list_element(
						// target_element_collection_set
						cur_element_collection_set
						// action_item_obj
						, sibling_action_item_obj_copy
						// color_type
						, sibling_element_event_manager.get_element_color_type()
					);

					// get children
					var cur_children_action_obj_copy_list = [];
					if(sibling_action_item_obj_copy.has_children()) {
						cur_children_action_obj_copy_list = sibling_action_item_obj_copy.get_children();
					}
					if(_v.is_valid_array(cur_children_action_obj_copy_list)) {

						for(var idx = 0; idx < cur_children_action_obj_copy_list.length;idx++) {

							var cur_child_action_obj_copy = cur_children_action_obj_copy_list[idx];
							if(_action.is_not_valid_action_obj(cur_child_action_obj_copy)) {
								console.log("!Error! / add_element / _action.is_not_valid_action_obj(cur_child_action_obj_copy)");
								return;
							} // end if

							console.log("XXX / cur_child_action_obj_copy :: ",cur_child_action_obj_copy);

							if(cur_child_action_obj_copy.is_list()) {

								var cur_event_manager = sibling_action_item_obj_copy.get_event_manager();
								if(cur_event_manager == undefined) {
									console.log("!Error! / add_element / cur_event_manager == undefined");
									return;
								}
								var cur_element_set = cur_event_manager.get_element_set();
								if(cur_element_set == undefined) {
									console.log("!Error! / add_element / cur_event_manager == undefined");
									return;
								}
								
								// parent element set과 child element collection set을 연결합니다.
								var cur_element_collection_set = 
								_action_list.add_editable_action_list(
									// action_list
									cur_child_action_obj_copy
									// parent_element_set
									, cur_element_set
									// list_container_jq
									, cur_event_manager.get_children_element_container_jq()
									// delegate_on_event
									, cur_event_manager.get_delegate_save_n_reload()
								);

							} else if(cur_child_action_obj_copy.is_table()) {

								console.log("!Warning! / add_element / Not implemented!");

							} else {
								console.log("!Error! / add_element / Not implemented!");
								return;
							} // end if

						} // end for



					} // end if

				} // end if

				sibling_element_event_manager.shape_sibling_element();

				return sibling_element_event_manager;
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

					consoler.say("ecs_aes / 2-1 / ",cur_element_id);
					consoler.say("ecs_aes / 2-1 / 처음 추가된 엘리먼트라면 테두리를 고쳐줍니다");

					consoler.say("ecs_aes / 2-1 / this.element_set_arr : ",this.element_set_arr);

					new_element_set.get_event_manager().shape_sibling_element();

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
					if(_action.is_not_valid_action_item_obj(prev_action_item_obj)) {
						console.log("!Error! / add_element_set / _action.is_not_valid_action_item_obj(prev_action_item_obj)");
						return;
					}

					var next_element_set_arr = [];
					var idx;
					var length = this.element_set_arr.length;
					for(idx = 0; idx < length; idx++){
						var cur_element_set = this.element_set_arr[idx];
						
						next_element_set_arr.push(cur_element_set);

						var cur_action_item_obj = cur_element_set.get_action_item_obj();
						if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
							console.log("!Error! / add_element_set / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
							return;
						}

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
				if(_action.is_not_valid_action_item_obj(action_item_obj_delete)) {
					console.log("!Error! / remove_element_set / _action.is_not_valid_action_item_obj(action_item_obj_delete)");
					return;
				}





				var next_element_set_arr = [];
				var idx;
				var length = this.element_set_arr.length;
				for(idx = 0; idx < length; idx++){
					var cur_element_set = this.element_set_arr[idx];

					// console.log("제거한 엘리먼트 셋은 배열에서도 제거됩니다.");

					var cur_action_item_obj = cur_element_set.get_action_item_obj();
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / remove_element_set / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / debug_element_set_arr / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / say_element_set_arr / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
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
						if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
							console.log("!Error! / ecs_get_masked_element_set_arr / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
							return;
						}

						// 입력 그룹을 제외한 엘리먼트 셋을 돌려줍니다.
						// TYPE으로 정의하도록 수정해야 합니다.

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
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / get_all_element_set_arr_recursive / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
						return;
					}

					// no shy mode
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
			,parent_element_set:undefined
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
			// @ Desc : 이 엘리먼트 컬렉션 셋이 가지고 있는 부모 엘리먼트 컬렉션 셋을 관리합니다.
			// @ Scope : element collection set / ecs
			,parent_element_collection_set:undefined
			,ecs_set_parent_element_collection_set:function(parent_element_collection_set) {

				if(parent_element_collection_set == undefined){
					console.log("!Error! / ecs_set_parent_element_collection_set / parent_element_collection_set == undefined");
					return;
				}

				this.parent_element_collection_set = parent_element_collection_set;
			}
			,ecs_get_parent_element_collection_set:function(parent_element_collection_set) {
				return this.parent_element_collection_set;
			}
			// @ Desc : 이 엘리먼트 컬렉션 셋이 가지고 있는 자식 엘리먼트 컬렉션 셋들을 의미합니다. 
			// @ Scope : element collection set / ecs
			// @ Warning : 엘리먼트 셋을 받지 않습니다.
			,children_element_collection_set_arr:[]
			,ecs_push_child_element_collection_set:function(child_element_collection_set){

				if(child_element_collection_set == undefined) {
					console.log("!Error! / ecs_push_child_element_collection_set / child_element_collection_set == undefined");
					return;	
				} 

				var cur_ecs_id = child_element_collection_set.get_element_collection_id();
				console.log("ecs_push_child_element_collection_set / ",cur_ecs_id );

				this.children_element_collection_set_arr.push(child_element_collection_set);

				child_element_collection_set.ecs_set_parent_element_collection_set(this);
			}
			,get_children_element_collection_set_arr:function(){
				return this.children_element_collection_set_arr;
			}
			// 테이블일 경우, row를 나타내는 tr element의 참조
			,table_row_jq:undefined
			,set_table_row_jq:function(table_row_jq) {
				this.table_row_jq = table_row_jq;
			}
			,get_table_row_jq:function() {
				return this.table_row_jq;
			}
			// 테이블일 경우, mousemove에 따라 guide row를 나타내는 tr element의 참조
			,table_guide_row_jq:undefined
			,set_table_guide_row_jq:function(table_guide_row_jq) {
				this.table_guide_row_jq = table_guide_row_jq;
			}
			,remove_table_guide_row_jq:function() {
				if(this.table_guide_row_jq == undefined) {
					return;
				}

				this.table_guide_row_jq.remove();
				this.table_guide_row_jq = undefined;
			}
			,get_table_guide_row_jq:function() {
				return this.table_guide_row_jq;
			}
			// REMOVE ME
			/*
			,is_outside:undefined
			,set_is_outside:function(is_outside) {
				this.is_outside = is_outside;
			}
			,get_is_outside:function() {
				return this.is_outside;
			}
			,is_hover_top:undefined
			,set_is_hover_top:function(is_hover_top) {
				this.is_hover_top = is_hover_top;
			}
			,get_is_hover_top:function() {
				return this.is_hover_top;
			}
			,is_hover_bottom:undefined
			,set_is_hover_bottom:function(is_hover_bottom) {
				this.is_hover_bottom = is_hover_bottom;
			}
			,get_is_hover_bottom:function() {
				return this.is_hover_bottom;
			}
			*/
			// 리스트 혹은 테이블 전체의 이벤트를 받는 버튼
			,btn_collection_eject_jq:undefined
			/*
				@ public
				@ Scope 	: element collection set / ecs
				@ Desc 		: 엘리먼트 콜렉션 셋을 이동시키는 eject btn jq 참조를 지정합니다.
			*/
			,ecs_set_btn_collection_eject_jq:function(btn_collection_eject_jq){

				this.btn_collection_eject_jq = btn_collection_eject_jq;

				// btn_collection_eject를 설정하면 자동으로 관련 이벤트가 주입됩니다.
				if(this.btn_collection_eject_jq != undefined) {
					this.set_jump_event(this.btn_collection_eject_jq);	
				}
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
			// ,element_collection_set_jump_spot_arr:[]
			,element_set_jump_spot_arr:[]
			// @ Public
			// @ Scope 	: Element Collection Set
			// @ Desc 	: ecs가 jump할 때, 들어갈 수 있는 element set을 추가힙니다.
			,add_element_set_jump_spot:function(element_set_jump_spot){

				if(element_set_jump_spot == undefined) {
					console.log("!Error! / add_element_set_jump_spot / element_set_jump_spot == undefined");
					return;
				}

				// @ Desc : jump spot 이벤트 대상 element collection set을 추가합니다. 
				// 추가 등록하여도 이벤트 발생 시점에 관련 로직을 동적으로 구성하므로 추가 이후, 다시 이벤트 설정을 요청할 필요가 없습니다.
				this.element_set_jump_spot_arr.push(element_set_jump_spot);
			}
			// @ Public
			// @ Scope 	: Element Collection Set
			// @ Desc 	: ecs가 jump할 때, 들어갈 수 있는 element set의 배열을 가져옵니다.
			,get_element_set_jump_spot_arr:function(){
				return this.element_set_jump_spot_arr;
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
						console.log("HERE / show_focusing_mode / 001");
						target_element_set.get_event_manager().show_focusing_mode();
					} else if(!target_element_set.get_is_hover_top() && !target_element_set.get_is_hover_bottom()){
						// hide focusing, show view mode
						target_element_set.get_event_manager().show_view_mode();
					}	

					return {is_hover_top:is_hover_top,is_hover_bottom:is_hover_bottom,has_changed:has_changed};				
				}
				, show_mouse_over_element_container_set_top_n_bottom:function(mouse_event, target_element_set) {



					if(mouse_event == undefined) {
						console.log("!Error! / show_mouse_over_element_container_set_top_n_bottom / mouse_event == undefined");
						return;
					}
					if(target_element_set == undefined) {
						console.log("!Error! / show_mouse_over_element_container_set_top_n_bottom / target_element_set == undefined");
						return;
					}

					// 충돌 검사를 진행한다.
					// 충돌했다면 포커싱 등의 처리.
					var is_outside = _obj.is_outside(mouse_event, target_element_set.get_event_manager().get_element_container_jq());
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
					if( target_element_set.get_is_hover_top() || target_element_set.get_is_hover_bottom() && is_outside ) {
						target_element_set.set_is_hover_top(false);
						target_element_set.set_is_hover_bottom(false);
						has_changed = true;
					}

					var cur_event_manager = target_element_set.get_event_manager();
					var cur_action_item_obj = cur_event_manager.get_action_item_obj();
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / show_mouse_over_element_container_set_top_n_bottom / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
						return;
					}

					// 변경된 내역이 없다면 중단.
					if(!has_changed){
						return {is_hover_top:is_hover_top,is_hover_bottom:is_hover_bottom,has_changed:has_changed};
					}
					
					// 변경되었다면 엘리먼트 상태를 다르게 나타내어 준다.
					if((target_element_set.get_is_hover_top() || target_element_set.get_is_hover_bottom())){
						// show focusing
						console.log("show focusing / " + cur_action_item_obj.get_action_name() + " / " + cur_action_item_obj.get_coordinate());
						console.log("HERE / show_focusing_mode / 002");
						target_element_set.get_event_manager().show_focusing_mode();
					} else if(!target_element_set.get_is_hover_top() && !target_element_set.get_is_hover_bottom()){
						// hide focusing, show view mode
						console.log("hide focusing, show view mode / " + cur_action_item_obj.get_action_name() + " / " + cur_action_item_obj.get_coordinate());
						target_element_set.get_event_manager().show_view_mode();
					} else {
						console.log("EHRE!");
					}

					return {is_outside:is_outside,is_hover_top:is_hover_top,is_hover_bottom:is_hover_bottom,has_changed:has_changed};				
				}	
				// @ Public
				// @ Scope 	: Jump Spot Manager
				// @ Desc 	: 테이블의 row에 mouse over 여부를 확인. focus mode, view mode로 전환해준다. 이벤트 상태 결과를 객체로 반환한다. 
				, show_mouse_over_table_row_element_top_n_bottom:function(mouse_event, event_manager_on_mousemove, table_action_obj) {

					if(mouse_event == undefined) {
						console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / mouse_event == undefined");
						return;
					}
					if(event_manager_on_mousemove == undefined) {
						console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / event_manager_on_mousemove == undefined");
						return;
					}
					if(_action.is_not_valid_action_obj(table_action_obj)) {
						console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / _action.is_not_valid_action_obj(table_action_obj)");
						return;
					}

					var hovering_table_field_action_item_obj = event_manager_on_mousemove.get_action_item_obj();
					if(_action.is_not_valid_action_item_obj(hovering_table_field_action_item_obj)) {
						console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / _action.is_not_valid_action_item_obj(hovering_table_field_action_item_obj)");
						return;
					}

					var hovering_table_row_jq = event_manager_on_mousemove.get_element_set().get_element_collection_set().get_table_row_jq();
					if(hovering_table_row_jq == undefined) {
						console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / hovering_table_row_jq == undefined");
						return;
					}

					var first_table_column_list_obj = table_action_obj.get_first_child_action_obj();
					if(_action.is_not_valid_action_obj(first_table_column_list_obj)) {
						console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / _action.is_not_valid_action_obj(first_table_column_list_obj)");
						return;
					}

					var idx_changed = -1;
					var mouse_move_checksum = 
					{
						is_hover_top:false
						,is_hover_bottom:false
						,is_outside:false
						,has_changed:false
						,action_item_obj_mouse_over:undefined
					};
					for(var idx = 0; idx < first_table_column_list_obj.get_children_cnt();idx++) {

						var table_column_field_obj = first_table_column_list_obj.get_child(idx);
						if(_action.is_not_valid_action_item_obj(table_column_field_obj)) {
							console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / _action.is_not_valid_action_item_obj(table_column_field_obj)");
							return;
						}

						// 타이틀 표시 열은 제외합니다.
						if(table_column_field_obj.is_item_title_only_fixed()) {
							continue;
						}

						// 현재 열은 제외합니다.
						if(hovering_table_field_action_item_obj.get_idx() === table_column_field_obj.get_idx()) {
							continue;
						}

						// 
						var cur_element_collection_set = table_column_field_obj.get_event_manager().get_element_set().get_element_collection_set();
						if(cur_element_collection_set == undefined) {
							console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / cur_element_collection_set == undefined");
							return;
						}

						var cur_table_row_jq = cur_element_collection_set.get_table_row_jq();
						if(cur_table_row_jq == undefined) {
							console.log("!Error! / show_mouse_over_table_row_element_top_n_bottom / cur_table_row_jq == undefined");
							return;
						}
						
						// 충돌 검사를 진행한다.
						var is_outside = _obj.is_outside(mouse_event, cur_table_row_jq);
						var is_hover_top = _obj.is_hover_top(mouse_event, cur_table_row_jq);
						var is_hover_bottom = _obj.is_hover_bottom(mouse_event, cur_table_row_jq);

						mouse_move_checksum.is_outside = is_outside;
						mouse_move_checksum.is_hover_top = is_hover_top;
						mouse_move_checksum.is_hover_bottom = is_hover_bottom;

						if(is_hover_top || is_hover_bottom) {
							mouse_move_checksum.action_item_obj_mouse_over = table_column_field_obj;
							return mouse_move_checksum;
						}

					} // end for

					return mouse_move_checksum;

				}	
				, land_element:function(cur_src_jq, cur_clone_jq, eject_btn_jq, cur_mousemove_callback_set, cur_element_set_on_mouse_over, delegate_on_completed, delegate_on_completed_param_event_manager, hovering_element_collection_set) {

					var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();

					var target_offset = cur_src_jq.offset();
					var target_width = cur_src_jq.outerWidth();

					var src_offset = cur_clone_jq.offset();
					target_offset.top = parseInt(target_offset.top) - parseInt(src_offset.top);
					target_offset.left = parseInt(target_offset.left) - parseInt(src_offset.left);

					var cur_action_item_obj_mouse_over = undefined;
					if(cur_element_set_on_mouse_over != undefined) {
						cur_action_item_obj_mouse_over = cur_element_set_on_mouse_over.get_event_manager().get_action_item_obj();
					}
					if(_action.is_valid_action_item_obj(cur_action_item_obj_mouse_over)) {
						var cur_table_action_obj = undefined;
						if(hovering_element_collection_set != undefined) {
							cur_table_action_obj = hovering_element_collection_set.get_table_action_obj();
						}
						if(_action.is_valid_action_obj(cur_table_action_obj)) {

							// add on table을 옮겼을 때의 처리.
							var cur_table_action_obj = hovering_element_collection_set.get_table_action_obj();

							// 이전 부모 자식 관계를 제거.
							var prev_parent_add_on = cur_table_action_obj.get_parent_add_on();
							prev_parent_add_on.remove_from_add_on_list(cur_table_action_obj);

							// 새로운 부모 자식 관계를 추가.
							cur_action_item_obj_mouse_over.push_add_on(cur_table_action_obj);

							// jump spot update
							cur_table_action_obj.update_table_jump_spot();
						}
					}

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

							}

							// show eject btn
							eject_btn_jq.show();
							eject_btn_jq.css("opacity",".3");

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
					console.log("!Error! / set_jump_event / cur_btn_collection_eject_jq == undefined");
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

					var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
					if(cur_event_hierarchy_manager.is_lock()) {
						return;
					}

					var _self_jq = $(this);
					_self_jq.animate({opacity:0.3}, 500);
				});
				cur_btn_collection_eject_jq.mouseover(function(){

					var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
					if(cur_event_hierarchy_manager.is_lock()) {
						return;
					}

					var _self_jq = $(this);
					_self_jq.animate({opacity:1}, 500);
				});
				cur_btn_collection_eject_jq.click(function(event_click){

					var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
					if(cur_event_hierarchy_manager.is_lock()) {
						return;
					}

					var consoler = airborne.console.get();
					consoler.off();

					// @ 기본 동작
					// 이벤트 전파를 막습니다.
					event_click.stopPropagation();
					// 다른 객체들의 이벤트를 받지 않도록 lock를 설정.
					var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
					cur_event_hierarchy_manager.lock();
					// 버튼을 화면에서 가립니다.
					var _self_eject_btn_jq = $(this);
					_self_eject_btn_jq.hide();

					// @ element collection settings
					var clone_element_collection_container_jq = jsm.boost_clone_element_jq(cur_element_collection_container_jq);

					// 부모 객체의 색상을 원래대로 돌려줍니다.
					var child_ecs = _self.get_children_element_collection_set_arr()[0];
					var cur_table_action_obj = _self.get_table_action_obj();
					if(_action.is_valid_action_obj(cur_table_action_obj)) {
						// 1. TABLE 일 경우만 동작합니다.
						cur_table_action_obj.update_table_jump_spot();

						var parent_aciton_obj_add_on = cur_table_action_obj.get_parent_add_on();
						if(_action.is_not_valid_action_obj(parent_aciton_obj_add_on)) {
							console.log("!Error! / cur_btn_collection_eject_jq.click / _action.is_not_valid_action_obj(parent_aciton_obj_add_on)");
							return;
						}

						parent_aciton_obj_add_on.get_event_manager().show_view_mode();
					}

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

							var event_manager_on_mouse_over = cur_element_set_on_mouse_over.get_event_manager();
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

				var consoler = airborne.console.get();
				// consoler.off();

				var element_set_on_mouse_over_arr = [];
				for (var idx = 0; idx < target_element_set_arr.length; idx++) {
					var target_element_set = target_element_set_arr[idx];
					var cur_element_title = target_element_set.get_event_manager().get_title_jq_value();

					// 충돌 검사를 진행한다.
					// 충돌했다면 포커싱 등의 처리.
					var is_hover = _obj.is_hover(mouse_event, target_element_set.get_event_manager().get_element_jq());

					// consoler.say("2. get_mouse_over_element / " + cur_element_title + " / is_hover : ",is_hover);

					if(is_hover){
						// 충돌한 추가 element set 객체를 찾았습니다.
						element_set_on_mouse_over_arr.push(target_element_set);
					}

					// 충돌 --> 충돌 혹은 충돌하지 않음 --> 충돌하지 않음 로 상태 변경 없다면 종료.
					if(target_element_set.get_is_hover() == is_hover) continue;

					// 충돌 --> 충돌하지 않음 혹은 충돌하지 않음 --> 충돌 로 상태 변경 시
					target_element_set.set_is_hover(is_hover);

					if(target_element_set.get_is_hover()){
						consoler.say("3. get_mouse_over_element / show focusing / cur_element_title :: ",cur_element_title);
						console.log("HERE / show_focusing_mode / 003");
						target_element_set.get_event_manager().show_focusing_mode();

						// 자식 객체를 보여줘야 함. 
						target_element_set.get_event_manager().show_child();

						// shy 자식 객체는 가림.
						target_element_set.get_event_manager().hide_shy_child();
					} else {
						consoler.say("4. get_mouse_over_element / hide focusing, show view mode / cur_element_title :: ",cur_element_title);
						target_element_set.get_event_manager().show_view_mode();
					}

				} // for end

				return element_set_on_mouse_over_arr;
			}
			// @ Public
			// @ Scope :  Element Collection Set
			,get_action_item_obj_mouse_over:function(mouse_event, target_event_manager){

				if(mouse_event == undefined) {
					console.log("!Error! / get_action_item_obj_mouse_over / mouse_event == undefined");
					return;
				}
				if(target_event_manager == undefined) {
					console.log("!Error! / get_action_item_obj_mouse_over / target_event_manager == undefined");
					return;
				}
				var target_element_container_jq = target_event_manager.get_element_container_jq();
				if(target_element_container_jq == undefined) {
					console.log("!Error! / get_action_item_obj_mouse_over / target_element_container_jq == undefined");
					return;
				}

				// 마우스 이둥시, 엘리먼트에 대한 충돌 검사를 진행합니다.
				// 충돌 했을 경우, 충돌 엘리먼트 셋 배열에 추가합니다.
				// 충돌하지 않았을 경우, view mode로 돌려 놓습니다.

				// 테이블 내의 각 열을 대표하는 element container jq를 가져옵니다.

				// 모든 엘리먼트 셋을 가져와서 충돌 검사를 합니다.
				// 충돌한 모든 열의 엘리먼트 셋을 focusing mode로 바꿉니다.
				// 충돌하지 않은 모든 엘리먼트 셋을 view mode로 바꿉니다.
				var target_action_item_obj = target_event_manager.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(target_action_item_obj)) {
					console.log("!Error! / get_action_item_obj_mouse_over / _action.is_not_valid_action_item_obj(target_action_item_obj)");
					return;
				}
				

				var action_item_row_on_mouse_over_arr = [];

				if(target_action_item_obj.is_table_child_column_list_field_item()) {
					
					var table_action_obj = target_action_item_obj.get_parent().get_parent();
					if(_action.is_not_valid_action_obj(table_action_obj)) {
						console.log("!Error! / get_action_item_obj_mouse_over / _action.is_not_valid_action_obj(table_action_obj)");
						return;
					}

					for (var idx = 0; idx < table_action_obj.get_children_cnt(); idx++) {
						var cur_table_column_list_action_obj = table_action_obj.get_child(idx);
						if(_action.is_not_valid_action_obj(cur_table_column_list_action_obj)) {
							console.log("!Error! / get_action_item_obj_mouse_over / _action.is_not_valid_action_obj(cur_table_column_list_action_obj)");
							return;
						}

						for (var inner_idx = 0; inner_idx < cur_table_column_list_action_obj.get_children_cnt(); inner_idx++) {
							var cur_table_field_action_item_obj = cur_table_column_list_action_obj.get_child(inner_idx);
							if(_action.is_not_valid_action_item_obj(cur_table_field_action_item_obj)) {
								console.log("!Error! / get_action_item_obj_mouse_over / _action.is_not_valid_action_item_obj(cur_table_field_action_item_obj)");
								return;
							} // end if

							// 제목 표시 열은 제거합니다.
							if(cur_table_field_action_item_obj.is_item_title_only_fixed()) {
								continue;
							}

							var cur_event_manager = cur_table_field_action_item_obj.get_event_manager();
							var cur_element_set = cur_event_manager.get_element_set();
							var cur_element_container_jq = cur_event_manager.get_element_container_jq();

							// 자신의 열은 제거합니다.
							if(cur_element_container_jq[0] === target_element_container_jq[0]) {
								continue;
							}

							// 충돌 위치가 위, 아래 인지 확인한다.
							var is_hover_top = _obj.is_hover_top(mouse_event, cur_element_container_jq);
							var is_hover_bottom = _obj.is_hover_bottom(mouse_event, cur_element_container_jq);

							// 1. is_hover_top인 경우, 
							// cur_table_field_action_item_obj가 
							// target_action_item_obj의 아래에 위치하면 중단. 목적지가 원래 위치와 같기 때문.
							var is_selected_row_under_target_row = (cur_table_field_action_item_obj.get_idx() == (target_action_item_obj.get_idx() + 1));
							if(is_hover_top && is_selected_row_under_target_row) {
								cur_event_manager.show_view_mode();
								continue;
							}

							// 2. is_hover_bottom인 경우, 
							// cur_table_field_action_item_obj가 
							// target_action_item_obj의 위에 위치하면 중단. 목적지가 원래 위치와 같기 때문.
							var is_selected_row_over_target_row = ((cur_table_field_action_item_obj.get_idx() + 1) == (target_action_item_obj.get_idx()));
							if(is_hover_bottom && is_selected_row_over_target_row) {
								cur_event_manager.show_view_mode();
								continue;
							}

							// 충돌한 엘리먼트는 무조건 반환.
							if(is_hover_top || is_hover_bottom) {
								action_item_row_on_mouse_over_arr.push(cur_table_field_action_item_obj);	
							}

							// 충돌했다면 포커싱 등의 처리.
							if(is_hover_top || is_hover_bottom){
								console.log("HERE / show_focusing_mode / 004");
								cur_event_manager.show_focusing_mode();
							} else if(!is_hover_top && !is_hover_bottom) {
								cur_event_manager.show_view_mode();
							} else {
								console.log("!Error! / get_action_item_obj_mouse_over / Unknown");
								return;
							}

						} // end inner for

 					} // end outer for

				} // end if

				// 충돌한 element set을 반환합니다.

				return action_item_row_on_mouse_over_arr;
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

				var consoler = airborne.console.get();
				consoler.off();

				var element_set_on_mouse_over_arr = this.get_element_set_jump_spot_arr();

				consoler.say("1. / gaesomo / element_set_on_mouse_over_arr : ",element_set_on_mouse_over_arr);
				consoler.say("2. / gaesomo / 결과 배열 객체를 분석, 최종 mouse over 객체를 찾습니다.");
				consoler.say("2-1. / gaesomo / 너비가 가장 작은 객체가 아래 자식이라고 판단합니다.");
				consoler.say("2-2. / gaesomo / 가장 아래 자식 객체를 포커싱 합니다.");

				var element_set_on_mouse_over = null;
				for (var idx = 0; idx < element_set_on_mouse_over_arr.length; idx++) {
					var cur_element_set = element_set_on_mouse_over_arr[idx];

					var cur_element_jq = cur_element_set.get_event_manager().get_element_jq();
					var is_hover = _obj.is_hover(mousemove_event, cur_element_jq);
					if(is_hover) {
						console.log("HERE / show_focusing_mode / 005");
						cur_element_set.get_event_manager().show_focusing_mode();
						element_set_on_mouse_over = cur_element_set;
					} else {
						cur_element_set.get_event_manager().show_view_mode();
					}

				}

				return element_set_on_mouse_over;

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
						if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
							console.log("!Error! / get_event_manager_from_element_collection_set_arr / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
							return;
						}

						// shy mode 제거.
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
			// @ Public
			// @ Scope  	: Element Collection Set
			,was_hover:false
			,set_was_hover:function(was_hover) {
				this.was_hover = was_hover;
			}
			,get_was_hover:function() {
				return this.was_hover;
			}
			,table_action_obj:undefined
			,set_table_action_obj:function(table_action_obj) {
				if(_action.is_not_valid_action_obj(table_action_obj)) {
					console.log("!Error! / set_table_action_obj / _action.is_not_valid_action_obj(table_action_obj)");
					return;
				}

				this.table_action_obj = table_action_obj;
			}
			,get_table_action_obj:function() {
				return this.table_action_obj;
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

		if(_action.is_not_valid_action_item_obj(action_item_obj)) {
			console.log("!Error! / make_element_set / _action.is_not_valid_action_item_obj(action_item_obj)");
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
			// @ private
			// @ Scope : element set
			// @ Desc : children collection set - 리스트의 열, 테이블의 필드가 자식 리스트, 자식 테이블을 포함하는 경우. event manager에게 전해줌.
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

				cur_event_manager.em_push_child_element_collection_set(child_element_collection_set);
			}
			// @ private
			// @ Scope : element set
			// @ Desc : 
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
			// @ Public
			// @ Scope : element set
			,is_hover:false
			,set_is_hover:function(is_hover){
				if(is_hover == null || (is_hover != true && is_hover != false)) return;
				return this.is_hover = is_hover;
			}
			,get_is_hover:function(){
				return this.is_hover;
			}
			// @ Public
			// @ Scope : element set
			,is_hover_top:false
			,set_is_hover_top:function(is_hover_top){
				if(is_hover_top == null || (is_hover_top != true && is_hover_top != false)) return;
				return this.is_hover_top = is_hover_top;
			}
			,get_is_hover_top:function(){
				return this.is_hover_top;
			}
			// @ Public
			// @ Scope : element set
			,is_hover_bottom:false
			,set_is_hover_bottom:function(is_hover_bottom){
				if(is_hover_bottom == null || (is_hover_bottom != true && is_hover_bottom != false)) return;
				return this.is_hover_bottom = is_hover_bottom;
			}
			,get_is_hover_bottom:function(){
				return this.is_hover_bottom;
			}
			// @ Public
			// @ Scope : element set
			,is_outside:false
			,set_is_outside:function(is_outside){
				if(is_outside == null || (is_outside != true && is_outside != false)) return;
				return this.is_outside = is_outside;
			}
			,get_is_outside:function(){
				return this.is_outside;
			}
			,refresh_is_hover:function(){
				this.set_is_hover(false);
				this.set_is_hover_top(false);
				this.set_is_hover_bottom(false);
			}
			// @ Public
			// @ Scope : element set
			// @ Desc : 사용자가 삭제할 경우의 처리.
			,remove_element_set:function() {
				var cur_element_set = this;

				var cur_element_collection_set = undefined;
				if(cur_element_set != undefined) {
					cur_element_collection_set = cur_element_set.get_element_collection_set();
				} 

				// 1. LIST
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

				// 2. TABLE

			}
		}

		event_manager.set_element_set(element_set);

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
					console.log("!Error! / get_view_element_group_manager / cur_element_tag == null");	
					return null;
				}

				if(this.element_event_hierarchy_manager == null){
					console.log("!Error! / get_view_element_group_manager / this.element_event_hierarchy_manager == null");	
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
			// @ Public
			// @ Scope 	: Event Hierarchy Manager
			// @ Desc 	: 모든 엘리먼트의 이벤트 상태를 view mode로 변경합니다.
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
								,left_window:true
							}

				            _self.do_after_mousemove_event(dummy_event);
				        }
				    });
				});

			}
			,mousemove_callback_set_arr:[]
			// @ Public
			// @ Scope  	: event_hierarchy_manager
			// @ Desc 		: mouse move 시 검사하는 callback set을 추가합니다.
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

				console.log("remove_mousemove_callback_set / 삭제 대상 콜백 / mouse_move_callback_set :: ",mouse_move_callback_set);

				var mousemove_callback_set_edited_arr = [];
				for (var idx = 0; idx < this.mousemove_callback_set_arr.length; idx++) {
					var cur_mousemove_callback_set = this.mousemove_callback_set_arr[idx];
					// 삭제 대상이라면 새로운 콜백 배열에서 뺀다.
					if(cur_mousemove_callback_set == mouse_move_callback_set) {
						console.log("remove_mousemove_callback_set / 삭제 대상이라면 새로운 콜백 배열에서 뺀다. / cur_mousemove_callback_set :: ",cur_mousemove_callback_set);
						continue;	
					}

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