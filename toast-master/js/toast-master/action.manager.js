var action_manager = {
	is_valid_action_collection_data_obj:function(action_collection_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		var __v = _v_factory.get("action_manager.js / is_valid_action_collection_data_obj");

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

		var __v = _v_factory.get("action_manager.js / is_valid_action_item_data_obj");

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
	,is_valid_action_data_obj:function(action_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		var __v = _v_factory.get("action_manager.js / is_valid_action_data_obj");
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
	, is_not_valid_action_data_obj:function(action_data_obj, show_log) {

		if(show_log == undefined) {
			show_log = true;
		}

		return !this.is_valid_action_data_obj(action_data_obj, show_log);
	}
	, get_action_obj:function(action_data_obj, coordinate, search_map) {

		var action_obj = {
			parent_action_object:null
			,children_action_object_list:null
			,action_id:null
			,action_name:null
			,action_hash_key:null
			,action_collection_type:null
			,action_collection_type_name:null
			,action_item_type:null
			,action_item_type_name:null
			,coordinate:null
			,search_map:null
			,set_action_data:function(action_data_obj, coordinate, search_map) {

				var __v = _v_factory.get("get_action_obj");
				if(action_manager.is_not_valid_action_data_obj(action_data_obj)) {
					__v.show_err_msg("is_not_valid_action_data_obj", "action_data_obj", action_data_obj);
					return;
				}

				this.set_action_id(action_data_obj.action_id);
				this.set_action_name(action_data_obj.action_name);
				this.set_action_hash_key(action_data_obj.action_hash_key);
				this.set_coordinate(coordinate);

				var my_coordinate = this.get_coordinate();
				if(search_map == undefined) {
					search_map = {};
				}
				search_map[my_coordinate] = this;
				this.set_search_map(search_map);

				if(action_data_obj.children_action_object_list != undefined) {
					for(var idx = 0;idx < action_data_obj.children_action_object_list.length;idx++) {
						var child_action_data_obj = action_data_obj.children_action_object_list[idx];
						var child_coordinate = this.get_coordinate() + "-" + idx;
						this.add_child(child_action_data_obj, child_coordinate, search_map);
					}
				}

				if(action_manager.is_valid_action_collection_data_obj(action_data_obj, false)) {

					this.set_action_collection_type(action_data_obj.action_collection_type);
					this.set_action_collection_type_name(action_data_obj.action_collection_type_name);

				} else if(action_manager.is_valid_action_item_data_obj(action_data_obj, false)) {

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
			,add_child:function(child_action_data_obj, coordinate, search_map) {

				// 자식을 추가할 경우에도 action_obj를 생성해서 만들어 줘야 함.
				var child_action_obj = action_manager.get_action_obj(child_action_data_obj, coordinate, search_map);

				// 자신이 자식 객체의 부모 객체가 됩니다.
				child_action_obj.set_parent(this);

				var chlaction_idren_list = this.get_children();
				chlaction_idren_list.push(child_action_obj);
			}
			,get_children:function() {
				if(this.children_action_object_list == undefined) {
					this.children_action_object_list = [];
				}
				return this.children_action_object_list;
			}
			,set_action_name:function(action_name) {
				this.action_name = action_name;
			}
			,get_action_name:function() {
				return this.action_name;
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
			,get_root_action_obj:function() {
				if(is_null(this.parent_action_object)) {
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
			,set_search_map:function(search_map) {
				this.search_map = search_map;
			}
			,get_search_map:function(search_map) {
				return this.search_map;
			}
			,search:function(coordinate) {
				if(this.search_map == undefined || coordinate == undefined) {
					return;
				}
				return this.search_map[coordinate];
			}
			,ACTION_COLLECTION_TYPE_LIST:1
			,ACTION_COLLECTION_TYPE_TABLE:2
			,ACTION_ITEM_TYPE_TITLE_ONLY:1
			,ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM:2
			,is_list:function() {
				var action_collection_type = this.get_action_collection_type();
				return (this.ACTION_COLLECTION_TYPE_LIST === action_collection_type)?true:false;
			}
			,is_table:function() {
				var action_collection_type = this.get_action_collection_type();
				return (this.ACTION_COLLECTION_TYPE_TABLE === action_collection_type)?true:false;				
			}
			,is_item_title_only:function() {
				var action_item_type = this.get_action_item_type();
				return (this.ACTION_ITEM_TYPE_TITLE_ONLY === action_item_type)?true:false;
			}
			,is_item_title_n_time_hh_mm:function() {
				var action_item_type = this.get_action_item_type();
				return (this.ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM === action_item_type)?true:false;
			}
			,delegate_insert_sibling_action:null
			,set_delegate_insert_sibling_action:function(delegate_insert_sibling_action) {
				this.delegate_insert_sibling_action = delegate_insert_sibling_action;
			}
			,insert_sibling_action:function() {
				console.log(">>> insert_sibling_action");

				if(this.delegate_insert_sibling_action != undefined) {
					this.delegate_insert_sibling_action._func.apply(this.delegate_insert_sibling_action._scope,[]);
				}
			}
			,delegate_insert_child_action:null
			,set_delegate_insert_child_action:function(delegate_insert_child_action) {
				this.delegate_insert_child_action = delegate_insert_child_action;
			}
			,insert_child_action:function() {
				console.log(">>> insert_child_action");

				if(this.delegate_insert_child_action != undefined) {
					this.delegate_insert_child_action._func.apply(this.delegate_insert_child_action._scope,[]);
				}
			}
			,delegate_update_action:null
			,set_delegate_update_action:function(delegate_update_action) {
				this.delegate_update_action = delegate_update_action;
			}
			,update_action:function() {
				console.log(">>> update_action");

				if(this.delegate_update_action != undefined) {
					this.delegate_update_action._func.apply(this.delegate_update_action._scope,[]);
				}
			}
			,delegate_delete_action:null
			,set_delegate_delete_action:function(delegate_delete_action) {
				this.delegate_delete_action = delegate_delete_action;
			}
			,delete_action:function() {
				console.log(">>> delete_action");

				if(this.delegate_delete_action != undefined) {
					this.delegate_delete_action._func.apply(this.delegate_delete_action._scope,[]);
				}
			}
		}
		action_obj.set_action_data(action_data_obj, coordinate, search_map);

		return action_obj;
	}

}

