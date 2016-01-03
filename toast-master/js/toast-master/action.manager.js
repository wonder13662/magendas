var action_manager = {
	ACTION_COLLECTION_TYPE_LIST:1
	,ACTION_COLLECTION_TYPE_TABLE:2
	,ACTION_ITEM_TYPE_TITLE_ONLY:1
	,ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM:2
	,ACTION_ITEM_TYPE_TITLE_N_TIME_MM_SS:3
	,ACTION_ITEM_TYPE_SELECT_BOX:4
	,is_valid_action_collection_data_obj:function(action_collection_data_obj, show_log) {

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
	, get_action_obj:function(action_data_obj, coordinate, action_hierarchy_search_map) {

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
			,set_action_data:function(action_data_obj, coordinate, action_hierarchy_search_map) {

				var __v = _v_factory.get("get_action_obj");
				if(action_manager.is_not_valid_action_data_obj(action_data_obj)) {
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

				if(action_manager.is_valid_action_collection_data_obj(action_data_obj, false)) {

					this.set_action_collection_type(action_data_obj.action_collection_type);
					this.set_action_collection_type_name(action_data_obj.action_collection_type_name);

				} else if(action_manager.is_valid_action_item_data_obj(action_data_obj, false)) {

					this.set_action_item_type(action_data_obj.action_item_type);
					this.set_action_item_type_name(action_data_obj.action_item_type_name);

				}
	
			}
			/*
				@ Public
				@ Desc : 실제 리스트 뷰를 만드는 데이터 포맷으로 변경합니다.
			*/
			,get_action_view_obj:function(){

				// DEBUG
				var consoler = airborne.console.get();
				consoler.off();

				var cur_action_name = this.get_action_name();
				var cur_scope = "get_action_view_obj / <cur_action_name> ".replace(/\<cur_action_name\>/gi, cur_action_name);
				consoler.say(cur_scope);

				var action_view_obj = null;
				if(this.is_list()) {

					consoler.say("get_action_view_obj / <cur_action_name> / 뷰 리스트 데이터를 만듭니다.".replace(/\<cur_action_name\>/gi, cur_action_name));

					var view_list_array = [];
					if(this.has_no_children()) {
						return view_list_array;	
					}

					// wonder.jung - 여기서 자식 객체 연결이 안되고 있음.
					// 자신의 자식 객체가 있다면 이 객체의 뷰 데이터를 만들어 추가해줍니다.
					var children_action_object_list = this.get_children();
					for(var idx=0; idx < children_action_object_list.length; idx++) {
						var child_action_object = children_action_object_list[idx];
						var child_action_view_obj = child_action_object.get_action_view_obj();
						view_list_array.push(child_action_view_obj);
					}

					consoler.say("get_action_view_obj / <cur_action_name> / view_list_array :: ".replace(/\<cur_action_name\>/gi, cur_action_name),view_list_array);

					return view_list_array;

				} else if(this.is_table()) {

					consoler.say("get_action_view_obj / <cur_action_name> / 뷰 테이블 데이터를 만듭니다.".replace(/\<cur_action_name\>/gi, cur_action_name));
					consoler.say("get_action_view_obj / <cur_action_name> / Need to implement!".replace(/\<cur_action_name\>/gi, cur_action_name));

				} else if(this.is_item_title_only()) {

					consoler.say("get_action_view_obj / <cur_action_name> / 아이템 - 타이틀만 노출 뷰 데이터 객체를 만듭니다.".replace(/\<cur_action_name\>/gi, cur_action_name));

					action_view_obj = this.get_action_view_item_title_only();
					consoler.say("get_action_view_obj / <cur_action_name> / action_view_obj".replace(/\<cur_action_name\>/gi, cur_action_name),action_view_obj);

					return action_view_obj;

				} else if(this.is_item_title_n_time_hh_mm()) {

					consoler.say("get_action_view_obj / <cur_action_name> / 아이템 - 타이틀과 시간,분 노출 뷰 데이터 객체를 만듭니다.".replace(/\<cur_action_name\>/gi, cur_action_name));

					action_view_obj = this.get_action_view_item_title_n_time_hh_mm();
					consoler.say("get_action_view_obj / <cur_action_name> / action_view_obj".replace(/\<cur_action_name\>/gi, cur_action_name),action_view_obj);



					return action_view_obj;

				} else if(this.is_item_title_n_time_mm_ss()) {

					consoler.say("get_action_view_obj / <cur_action_name> / 아이템 - 타이틀과 분,초 노출 뷰 데이터 객체를 만듭니다.".replace(/\<cur_action_name\>/gi, cur_action_name));
					consoler.say("get_action_view_obj / <cur_action_name> / Need to implement!".replace(/\<cur_action_name\>/gi, cur_action_name));

				}

			}
			/*
				@ Private
				@ Desc : 제목만 가지고 있는 아이템 객체를 만들어 줍니다.
			*/
			,get_action_view_item_title_only:function(search_list) {

				var is_shy = this.get_action_is_shy();
				var add_on_obj_list = this.get_add_on_list();
				var action_name = this.get_action_name();
				var view_item_title_only = {
					__action_list:null
					, __action_table:null
					, __action_name:action_name
					, __prop_map:{
						// 숨김열 여부 - 숨김 열은 컬렉션 객체에 엘리먼트를 추가할 때 사용합니다.
						__is_shy:is_shy
						// 엘리먼트의 값을 편집할 때, 사용하게 될 선택 리스트
						,__search_list:search_list
						// 내부에 추가될 외부 element collection set id 리스트
						,__add_on_obj_list:add_on_obj_list
						,__action_obj:this
						,__action_list:null
						,__action_table:null
					}
				}

				return view_item_title_only;
			}
			/*
				@ Private
				@ Desc : 제목과 시간(HH:MM)을 가지고 있는 아이템 객체를 만들어 줍니다.
			*/
			,get_action_view_item_title_n_time_hh_mm:function(search_list) {

				var consoler = airborne.console.get();
				consoler.off();

				var cur_action_name = this.get_action_name();
				consoler.say("get_action_view_item_title_n_time_hh_mm / <cur_action_name> ".replace(/\<cur_action_name\>/gi, cur_action_name));

				var cur_action_context = this.get_action_context();

				var action_time_obj = _json.parseJSON(cur_action_context);
				consoler.say("get_action_view_item_title_n_time_hh_mm / <cur_action_name> / action_time_obj".replace(/\<cur_action_name\>/gi, cur_action_name),action_time_obj);

				// Sample : Object {time_sec_initial: 70800, time_sec_offset_from_init: 600, time_hh_mm_initial: "19:40", time_hh_mm: "19:50"}

				var __v = _v_factory.get("get_action_view_item_title_n_time_hh_mm");
				if(__v.is_null_object(action_time_obj)) {
					return;
				}
				if(__v.is_not_unsigned_number(action_time_obj.time_sec_initial)) {
					return;
				}
				if(__v.is_not_unsigned_number(action_time_obj.time_sec_offset_from_init)) {
					return;
				}
				if(__v.is_not_valid_str(action_time_obj.time_hh_mm_initial)) {
					return;
				}
				if(__v.is_not_valid_str(action_time_obj.time_hh_mm)) {
					return;
				}
				var time_sec_initial = action_time_obj.time_sec_initial;
				var time_sec_offset_from_init = action_time_obj.time_sec_offset_from_init;
				var time_hh_mm_initial = action_time_obj.time_hh_mm_initial;
				var time_hh_mm = action_time_obj.time_hh_mm;

				var is_shy = this.get_action_is_shy();
				var add_on_obj_list = this.get_add_on_list();
				var action_name = this.get_action_name();

				var action_context_str = this.get_action_context();
				var action_context_obj = _json.parseJSON(action_context_str);

				var view_item = {
					__action_list:null
					, __action_table:null
					, __action_name:action_name
					, __time_hh_mm:time_hh_mm
					, __prop_map:{
						// 숨김열 여부 - 숨김 열은 컬렉션 객체에 엘리먼트를 추가할 때 사용합니다.
						// REMOVE ME
						__is_shy:is_shy
						// 엘리먼트의 값을 편집할 때, 사용하게 될 선택 리스트
						, __search_list:search_list
						// 내부에 추가될 외부 element collection set id 리스트
						, __add_on_obj_list:add_on_obj_list
						// REMOVE ME
						, __time_sec:time_sec_initial+time_sec_offset_from_init
						, __action_obj:this
						, __action_list:null
						, __action_table:null
					}
				}

				// children - item은 1개의 테이블 혹은 1개의 리스트를 자식으로 가질 수 있습니다.
				if(this.has_children()) {

					var children_action_object_list = this.get_children();
					var children_view_obj_list = [];

					for(var idx=0; idx < children_action_object_list.length; idx++) {
						var child_action_object = children_action_object_list[idx];
						var child_action_view_obj = child_action_object.get_action_view_obj();

						children_view_obj_list.push(child_action_view_obj);

					} // end for

					view_item.__action_list = children_view_obj_list;
					view_item.__prop_map.__action_list = children_view_obj_list;
					return view_item;

				} // end outer if

				consoler.say("get_action_view_item_title_n_time_hh_mm / <cur_action_name> / view_item".replace(/\<cur_action_name\>/gi, cur_action_name),view_item);

				return view_item;
			}			
			/*
				@ Public
				@ Desc : 리스트를 만드는 데 필요한 meta info 객체를 만들어 돌려줍니다.
			*/
			,get_meta_info:function(is_editable_title, is_editable_row) {

				if(is_editable_title == undefined) {
					is_editable_title = true;
				}
				if(is_editable_row == undefined) {
					is_editable_row = true;
				}
				var is_fixed_row_action = !is_editable_row;
				if(this.is_list() && this.has_children()) {
					// 1. LIST

					// 첫번째 엘리먼트의 타입을 검사, 파라미터로 넘겨줍니다.
					var children_action_object_list = this.get_children();
					var first_child_action = children_action_object_list[0];

					// 여기서 만들어 내는 구조는 리스트와 리스트내의 엘리먼트 까지 입니다.
					// 엘리먼트 내부의 테이블 등을 추가하기 위해서는 테이블을 만들어 리스트 내부에 추가하는 작업이 필요합니다.
					var cur_element_type = first_child_action.get_element_type();
					var delegate_add_list_row_info = _view_list.get_delegate_add_list_row_info(cur_element_type);

					// wonder.jung
					// 리스트 내부의 추가 로직은 구성됨. 하지만 리스트 자식 엘리먼트가 가지고 있는 정보는 어떻게 표현해야 좋을까?
					// action_list를 어떻게 변경해서 전달해 줘야 할까?

					var editable_list_meta_info_action_obj = 
					_view_list.get_editable_list_meta_info_obj(
						// list_title 					/ 리스트 열의 제목
						this.get_action_name()
						// is_editable_title 			/ 리스트 열의 제목을 수정할 수 있는가?
						, is_editable_title
						// is_fixed_row 				/ 리스트 열의 수가 고정인가? 추가 및 삭제가 가능한가?
						, is_fixed_row_action
						// delegate_add_list_row_info 	/ 타임라인 열 메타 정보 작성
						, delegate_add_list_row_info
						// action list
						, action_list
						// is_shy
						, is_shy
					);


				} else if(this.is_table()) {
					// 2. TABLE

					console.log("need to implement!");

				}

			}
			,set_parent:function(parent_action_object) {
				this.parent_action_object = parent_action_object;
			}
			,get_parent:function() {
				return this.parent_action_object;
			}
			,add_child:function(child_action_data_obj, coordinate, action_hierarchy_search_map) {

				// 자식을 추가할 경우에도 action_obj를 생성해서 만들어 줘야 함.
				var child_action_obj = action_manager.get_action_obj(child_action_data_obj, coordinate, action_hierarchy_search_map);

				// 자신이 자식 객체의 부모 객체가 됩니다.
				child_action_obj.set_parent(this);

				var children_action_obj_list = this.get_children();
				children_action_obj_list.push(child_action_obj);

				return child_action_obj;
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
				if(idx < length) {
					return this.children_action_object_list[idx];	
				}

				return null;
			}
			,get_last_child:function() {
				if(this.children_action_object_list == undefined) {
					this.children_action_object_list = [];
				}

				var length = this.children_action_object_list.length;
				if(0 < length) {
					return this.children_action_object_list[(length - 1)];	
				}

				return null;
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
				var add_on_action_obj = action_manager.get_action_obj(add_on_action_data_obj, coordinate, action_hierarchy_search_map);

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
			/*
				@ Public
				@ Desc : 실제로 화면에 그릴때 사용되는 타입으로 변환해줍니다.
			*/
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
			// 아래 방법으로는 타입 정보를 전달하기는 불가능하다.
			/*
				@ Public
				@ Desc : 실제로 화면에 그릴때 사용되는 타입으로 변환해줍니다. 
				호출 객체부터 시작해서 최하단의 아이템의 타입까지 배열로 반환합니다. 
				단, 각 단계의 형제 아이템의 속성을 동일해야 합니다.
			*/
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
				return (action_manager.ACTION_COLLECTION_TYPE_LIST === action_collection_type)?true:false;
			}
			,is_table:function() {
				var action_collection_type = this.get_action_collection_type();
				return (action_manager.ACTION_COLLECTION_TYPE_TABLE === action_collection_type)?true:false;				
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
				return (action_manager.ACTION_ITEM_TYPE_TITLE_ONLY === action_item_type)?true:false;
			}
			,is_item_title_n_time_hh_mm:function() {
				var action_item_type = this.get_action_item_type();
				return (action_manager.ACTION_ITEM_TYPE_TITLE_N_TIME_HH_MM === action_item_type)?true:false;
			}
			,is_item_title_n_time_mm_ss:function() {
				var action_item_type = this.get_action_item_type();
				return (action_manager.ACTION_ITEM_TYPE_TITLE_N_TIME_MM_SS === action_item_type)?true:false;
			}
			,is_item_select_box:function() {
				var action_item_type = this.get_action_item_type();
				return (action_manager.ACTION_ITEM_TYPE_SELECT_BOX === action_item_type)?true:false;
			}
			// update flag
			/*
				@ Private
				@ Desc : 사용자에 의해 값이 변경되면 이 플래그를 true로 변경합니다.
			*/
			,changed:false
			,is_changed:function() {
				return this.changed;
			}
			,set_changed:function() {
				this.changed = true;	
			}
			// functions for item_title_n_time_hh_mm
			,update_time_hh_mm:function(new_time_sec) {

				// title_n_time_hh_mm 타입인 경우만 진행합니다.
				if(!this.is_item_title_n_time_hh_mm()) {
					return;
				}
				var __v = _v_factory.get("action_manager / update_time_hh_mm");
				if(__v.is_not_unsigned_number(new_time_sec)) {
					return;
				}

				this.set_changed();
				var time_hh_mm_obj = this.get_time_hh_mm_obj();

				console.log(">>> Before / time_hh_mm_obj.time_sec_offset_from_init :: ",time_hh_mm_obj.time_sec_offset_from_init);
				console.log(">>> Before / time_hh_mm_obj.time_hh_mm :: ",time_hh_mm_obj.time_hh_mm);

				time_hh_mm_obj.time_sec_offset_from_init = new_time_sec - time_hh_mm_obj.time_sec_initial;
				time_hh_mm_obj.time_hh_mm = _dates.get_hh_mm_from_seconds(new_time_sec);

				console.log(">>> After / time_hh_mm_obj.time_sec_offset_from_init :: ",time_hh_mm_obj.time_sec_offset_from_init);
				console.log(">>> After / time_hh_mm_obj.time_hh_mm :: ",time_hh_mm_obj.time_hh_mm);

				console.log(">>> time_hh_mm_obj :: ",time_hh_mm_obj);

				var element_event_manager = this.get_element_event_manager();

				var new_json_str_time_hh_mm = JSON.stringify();
				this.set_action_context(new_json_str_time_hh_mm);

				var cur_sibling_action_obj_before = this.get_sibling_action_obj_before();
				if(cur_sibling_action_obj_before != undefined) {
					// 앞에 있는 형제 객체의 시작 정보를 가져와 비교합니다.
					var time_hh_mm_obj_before = cur_sibling_action_obj_before.get_time_hh_mm_obj();
					var time_sec_before = time_hh_mm_obj_before.time_sec_initial + time_hh_mm_obj_before.time_sec_offset_from_init;

					if((0 < time_sec_before) && (new_time_sec < time_sec_before)) {
						// 이전 시작이 지금 시간보다 뒤라면 지금시간보다 10분전으로 세팅해서 업데이트.
						time_sec_before = new_time_sec - 600;
						time_hh_mm_obj_before.update_time_hh_mm(time_sec_before);
					} // end inner if

					// wonder.jung / 화면에 변경된 데이터 표시!
					var before_sibling_event_manager = element_event_manager.get_before_sibling_event_manager();
					console.log(">>> 화면에 변경된 데이터 표시! / before_sibling_event_manager :: ",before_sibling_event_manager);

				}  // end outer if

				var cur_sibling_action_obj_after = this.get_sibling_action_obj_after();
				if(cur_sibling_action_obj_after != undefined) {
					// 뒤에 있는 형제 객체의 시작 정보를 가져와 비교합니다.
					var time_hh_mm_obj_after = cur_sibling_action_obj_after.get_time_hh_mm_obj();
					var time_sec_after = time_hh_mm_obj_after.time_sec_initial + time_hh_mm_obj_after.time_sec_offset_from_init;

					if((0 < time_sec_after) && (time_sec_after < new_time_sec)) {
						// 이후 시작이 지금 시간보다 앞이라면 지금시간보다 10분뒤로 세팅해서 업데이트.
						time_sec_after = new_time_sec + 600;
						time_hh_mm_obj_after.update_time_hh_mm(time_sec_after);
					} // end inner if

					// wonder.jung
					var after_sibling_event_manager = element_event_manager.get_after_sibling_event_manager();
					console.log(">>> 화면에 변경된 데이터 표시! / after_sibling_event_manager :: ",after_sibling_event_manager);

				} // end outer if

				// TODO 여기서 변경된 값이 화면에 표시되려면?
			}
			,get_time_hh_mm_obj:function() {

				var __v = _v_factory.get("action_manager / get_time_hh_mm_obj");

				// title_n_time_hh_mm 타입인 경우만 진행합니다.
				if(!this.is_item_title_n_time_hh_mm()) {
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
			// 해당 데이터와 관련있는 엘리먼트 컨트롤러 참조
			,element_event_manager:null
			,set_element_event_manager:function(element_event_manager) {
				this.element_event_manager = element_event_manager;
			}
			,get_element_event_manager:function() {
				return this.element_event_manager;
			}
			// REMOVE ME
			/*
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
			*/
		}
		action_obj.set_action_data(action_data_obj, coordinate, action_hierarchy_search_map);

		return action_obj;
	}

}

