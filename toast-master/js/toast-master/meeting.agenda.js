var wonglish = {
	meeting_agenda_manager:{}
};

wonglish.meeting_agenda_manager = {
	getObj:function(meeting_agenda_container_id, meeting_agenda_data_set, is_editable){

		var _v = airborne.validator;
		if(_v.isNotValidStr(meeting_agenda_container_id)){
			console.log("getObj / _v.isNotValidStr(meeting_agenda_container_id)");
			return null;
		}
		if(meeting_agenda_data_set == null){
			console.log("getObj / meeting_agenda_data_set == null");
			return null;
		}

		var obj = {
			meeting_agenda_container_id:meeting_agenda_container_id
			, member_list:member_list
			, role_list:role_list
			, meeting_round_jq:null
			, getRound:function(){
				console.log("Warning / getRound / Not Implemented yet!");
			}
			, setRound:function(){
				console.log("Warning / setRound / Not Implemented yet!");
			}
			, meeting_theme_jq:null
			, getTheme:function(){
				console.log("Warning / getTheme / Not Implemented yet!");
			}
			, setTheme:function(){
				console.log("Warning / setTheme / Not Implemented yet!");	
			}
			, meeting_date_jq:null
			, getMeetingDate:function(){
				console.log("Warning / getMeetingDate / Not Implemented yet!");	
			}
			, setMeetingDate:function(){
				console.log("Warning / setMeetingDate / Not Implemented yet!");	
			}

		};



		obj.meeting_agenda_container_id = meeting_agenda_container_id;
		var container_jq = $("div#"+meeting_agenda_container_id);

		//officer_list_container
		var container_jq_officer_list = $("div#officer_list_container");




		// common props
		var meeting_agenda_obj = meeting_agenda_data_set.meeting_agenda_obj;
		var meeting_membership_id = meeting_agenda_data_set.meeting_membership_id;
		var recent_action_collection_id = meeting_agenda_data_set.recent_action_collection_id

		console.log("meeting_agenda_obj ::: ",meeting_agenda_obj);

		console.log("HERE / meeting_membership_id ::: ",meeting_membership_id);


		var meeting_agenda_id = meeting_agenda_obj.__meeting_id;
		var meeting_agenda_startdttm = meeting_agenda_obj.__startdttm;
		var click_event_lock_obj = null;
		var is_not_editable = (is_editable=="NO")?true:false;
		var is_log_in_user = meeting_agenda_data_set.is_log_in_user;
		var login_user_info = meeting_agenda_data_set.login_user_info;
		var service_root_path = meeting_agenda_data_set.service_root_path;

		// contents - search options
		var search_option_arr_members = [];
		if(_v.isValidArray(meeting_agenda_data_obj.member_list)){
			for (var idx = 0; idx < meeting_agenda_data_obj.member_list.length; idx++) {
				var cur_member_obj = meeting_agenda_data_obj.member_list[idx];
				var cur_select_option = _obj.get_select_option(cur_member_obj.__member_name,cur_member_obj.__member_hash_key);
				search_option_arr_members.push(cur_select_option);
			}

			// 빈값으로 지정할 수 있는 필드를 추가한다.
			search_option_arr_members.push(_obj.get_select_option(_param.NOT_ASSIGNED,"-1"));
		}

		var search_option_arr_speech_projects = [];
		var speech_project_list = meeting_agenda_data_set.speech_project_list;

		if(_v.isValidArray(speech_project_list)){
			for (var idx = 0; idx < speech_project_list.length; idx++) {
				var cur_speech_obj = speech_project_list[idx];

				var speech_timer_green_min = parseInt(cur_speech_obj.__speech_timer_green_mm_ss);
				var speech_timer_red_min = parseInt(cur_speech_obj.__speech_timer_red_mm_ss);
				var speech_timer_text = speech_timer_green_min + "m-" + speech_timer_red_min + "m";

				var speech_project_title = "";
				if(cur_speech_obj.__speech_manual_name === "" && speech_timer_green_min == 0) {
					speech_project_title = cur_speech_obj.__speech_manual_project_name;
				} else if(cur_speech_obj.__speech_manual_name === "") {
					speech_project_title = cur_speech_obj.__speech_manual_project_name + " / " + speech_timer_text;
				} else {
					speech_project_title = cur_speech_obj.__speech_manual_name + " - " + cur_speech_obj.__speech_manual_project_name + " / " + speech_timer_text;
				}

				var cur_select_option = _obj.get_select_option(speech_project_title, cur_speech_obj.__speech_manual_project_id);
				search_option_arr_speech_projects.push(cur_select_option);
			}
		}
		//speech_project_list	
























		// grid view test
		//grid_view_container
		var grid_view_container_jq = $("div#grid_view_container");
		// console.log("grid_view_container_jq ::: ",grid_view_container_jq);
		var grid_view_url = "{service_root_path}/images/svg/template_a4_grid_unit_10mm.svg".replace(/\{service_root_path\}/gi, service_root_path);
		_print.draw_bridge_svg_view(grid_view_container_jq, grid_view_url);





































		//     .aMMMb  .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb      dMMMMMMP dMP dMMMMMMMMb dMMMMMP dMP     dMP dMMMMb  dMMMMMP 
		//    dMP"dMP dMP"VMP   dMP   amr dMP"dMP dMP dMP        dMP   amr dMP"dMP"dMPdMP     dMP     amr dMP dMP dMP      
		//   dMMMMMP dMP       dMP   dMP dMP dMP dMP dMP        dMP   dMP dMP dMP dMPdMMMP   dMP     dMP dMP dMP dMMMP     
		//  dMP dMP dMP.aMP   dMP   dMP dMP.aMP dMP dMP        dMP   dMP dMP dMP dMPdMP     dMP     dMP dMP dMP dMP        
		// dMP dMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP        dMP   dMP dMP dMP dMPdMMMMMP dMMMMMP dMP dMP dMP dMMMMMP

		var meeting_action_list = meeting_agenda_data_obj.meeting_action_list;
		var new_action_element_collection_set = undefined;
		var remove_action_timeline = function(container_jq) {

			var cur_element_collection_container_jq = undefined;
			if(new_action_element_collection_set != undefined) {
				cur_element_collection_container_jq = new_action_element_collection_set.get_element_collection_container_jq();
			}
			if(cur_element_collection_container_jq != undefined) {
				cur_element_collection_container_jq.remove();
			}

			_action.remove_event_hierarchy_manager();

		}
		var activate_action_timeline = function(meeting_action_list, container_jq) {

			new_action_element_collection_set = 
			_action_list.add_editable_action_list(
				// action_list
				meeting_action_list
				// parent_element_set
				, null
				// list_container_jq
				, container_jq
				// delegate_save_n_reload
				, _obj.get_delegate(function(cur_outcome_obj){

					if(	cur_outcome_obj == undefined ) {
						console.log("!Error! / delegate_save_n_reload / cur_outcome_obj == undefined");
						return;
					}
					if(	_action.is_not_valid_action_item_obj(cur_outcome_obj._action_item_obj) ) {
						console.log("!Error! / delegate_save_n_reload / _action.is_not_valid_action_item_obj(cur_outcome_obj._action_item_obj)");
						return;
					}

					var action_item_obj = cur_outcome_obj._action_item_obj;
					var action_context_obj = action_item_obj.get_action_context_obj();

					var is_speech_update = 
					(
						action_context_obj != undefined && (
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_SPEECH_TITLE ||
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_SPEECH_PROJECT ||
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_SPEECH_SPEAKER ||
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_SPEECH_EVALUATOR
						)
					)?true:false;

					console.log("is_speech_update ::: ",is_speech_update);

					var is_news_update = 
					(
						action_context_obj != undefined && (
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_NEWS
						)
					)?true:false;
					var is_word_update = 
					(
						action_context_obj != undefined && (
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_WORD_N_QUOTE_WORD_ONLY
						)
					)?true:false;
					var is_word_desc_update = 
					(
						action_context_obj != undefined && (
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY
						)
					)?true:false;
					var is_quote_update = 
					(
						action_context_obj != undefined && (
						action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY
						)
					)?true:false;



					var MEETING_ID = meeting_agenda_data_set.meeting_agenda_obj.__meeting_id;
					if(_v.is_not_unsigned_number(MEETING_ID)) {
						console.log("!Error! / delegate_save_n_reload / _v.is_not_unsigned_number(MEETING_ID)");
						return;
					}
					var cur_element_event_manager = action_item_obj.get_event_manager();
					if(cur_element_event_manager == undefined) {
						console.log("!Error! / delegate_save_n_reload / cur_element_event_manager == undefined");
						return;
					}

					console.log("action_item_obj ::: ",action_item_obj);

					// DEBUG
					var cur_root_action_obj = action_item_obj.get_root_action_obj();
					var cur_root_action_context_obj = cur_root_action_obj.get_action_context_obj();
					if(cur_root_action_context_obj != undefined && cur_root_action_context_obj.meeting_id != undefined) {
						MEETING_ID = cur_root_action_context_obj.meeting_id;
					}

					// DEBUG
					var obj_tree = cur_root_action_obj.convert_action_hierarchy_to_obj_tree();

					var cur_action_obj_for_db_update = action_item_obj.get_action_obj_for_db_update();
					if(_v.is_unsigned_number(MEETING_ID)) {
						cur_action_obj_for_db_update["MEETING_ID"] = parseInt(MEETING_ID);	
					}

					console.log("cur_outcome_obj._event ::: ",cur_outcome_obj._event);
					console.log("action_context_obj ::: ",action_context_obj);

					if( _action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event && action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_TODAY_ROLE ) {

						// TM ROLE UPDATE
						console.log("TM ROLE UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_ROLE)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){
									
									if( data.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_TODAY_ROLE ) {

										// 역할을 업데이트 했을 경우의 화면 변경.
										var NEW_ACTION_NAME = data.NEW_ACTION_NAME;
										action_item_obj.set_action_name(NEW_ACTION_NAME);
										cur_element_event_manager.set_title_jq_text(NEW_ACTION_NAME);

									}

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_INSERT_ITEM === cur_outcome_obj._event && is_speech_update) {

						console.log("TM SPEECH INSERT");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						// CHECK
						var sibling_action_obj_before = action_item_obj.get_sibling_action_obj_before();
						console.log("sibling_action_obj_before ::: ",sibling_action_obj_before);

						var sibling_action_hash_key_before = sibling_action_obj_before.get_action_hash_key();
						var ACTION_HASH_KEY_BEFORE = cur_action_obj_for_db_update.ACTION_HASH_KEY_BEFORE;

						console.log("sibling_action_hash_key_before ::: ",sibling_action_hash_key_before);
						console.log("ACTION_HASH_KEY_BEFORE ::: ",ACTION_HASH_KEY_BEFORE);

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_SPEECH)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

									var TABLE_FIELD_ACTION_ITEM_LIST_STD = data.TABLE_FIELD_ACTION_ITEM_LIST_STD;
									if(TABLE_FIELD_ACTION_ITEM_LIST_STD == undefined) {
										return;
									}

									// 테이블의 열이 추가된 경우의 데이터 업데이트
									var cur_table_row_sibling_arr = action_item_obj.get_table_row_sibling_arr();

									for(var idx = 0;idx < TABLE_FIELD_ACTION_ITEM_LIST_STD.length;idx++) {

										var cur_action_item_std = TABLE_FIELD_ACTION_ITEM_LIST_STD[idx];
										var cur_context_str = cur_action_item_std.context;
										var cur_action_hash_key = cur_action_item_std.action_hash_key;
										var cur_action_name = cur_action_item_std.action_name;

										var cur_table_field_item_obj = cur_table_row_sibling_arr[idx];
										var cur_table_field_event_manager = cur_table_field_item_obj.get_event_manager();

										if(cur_table_field_item_obj != undefined) {

											cur_table_field_item_obj.set_action_name(cur_action_name);
											cur_table_field_item_obj.set_action_hash_key(cur_action_hash_key);
											cur_table_field_item_obj.set_action_context(cur_context_str);
											cur_table_field_event_manager.set_title_jq_text(cur_action_name);
											cur_table_field_event_manager.set_title_jq_attr_tossed_value(cur_action_name);

										}	// end if

									} // end for								

								},
								// delegate_scope
								this
							)
						); // ajax done.


					} else if(_action.EVENT_TYPE_INSERT_ITEM === cur_outcome_obj._event && is_news_update) {

						console.log("TM NEWS INSERT");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_NEWS)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

									var TABLE_FIELD_ACTION_ITEM_LIST_STD = data.TABLE_FIELD_ACTION_ITEM_LIST_STD;
									if(TABLE_FIELD_ACTION_ITEM_LIST_STD == undefined) {
										return;
									}

									// 테이블의 열이 추가된 경우의 데이터 업데이트
									var cur_table_row_sibling_arr = action_item_obj.get_table_row_sibling_arr();

									for(var idx = 0;idx < TABLE_FIELD_ACTION_ITEM_LIST_STD.length;idx++) {

										var cur_action_item_std = TABLE_FIELD_ACTION_ITEM_LIST_STD[idx];
										var cur_context_str = cur_action_item_std.context;
										var cur_action_id = parseInt(cur_action_item_std.action_id);
										var cur_action_hash_key = cur_action_item_std.action_hash_key;
										var cur_action_name = cur_action_item_std.action_name;

										var cur_table_field_item_obj = cur_table_row_sibling_arr[idx];
										var cur_table_field_event_manager = cur_table_field_item_obj.get_event_manager();

										if(cur_table_field_item_obj != undefined) {

											cur_table_field_item_obj.set_action_id(cur_action_id);
											cur_table_field_item_obj.set_action_name(cur_action_name);
											cur_table_field_item_obj.set_action_hash_key(cur_action_hash_key);
											cur_table_field_item_obj.set_action_context(cur_context_str);
											cur_table_field_event_manager.set_title_jq_text(cur_action_name);
											cur_table_field_event_manager.set_title_jq_attr_tossed_value(cur_action_name);

										}	// end if

									} // end for										

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_INSERT_ITEM === cur_outcome_obj._event) {

						// wonder.jung
						// INSERT ACTION ITEM.
						console.log("INSERT ACTION ITEM.");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_TOASTMASTER_SCHEDULE)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									// 테이블의 열이 추가된 경우의 데이터 업데이트
									var TABLE_FIELD_ACTION_ITEM_LIST_STD = data.TABLE_FIELD_ACTION_ITEM_LIST_STD;
									var cur_table_row_sibling_arr = action_item_obj.get_table_row_sibling_arr();
									for(var idx = 0;idx < TABLE_FIELD_ACTION_ITEM_LIST_STD.length;idx++) {

										var cur_action_item_std = TABLE_FIELD_ACTION_ITEM_LIST_STD[idx];
										var cur_context_str = cur_action_item_std.context;
										var cur_action_hash_key = cur_action_item_std.action_hash_key;
										var cur_action_name = cur_action_item_std.action_name;

										var cur_table_field_item_obj = cur_table_row_sibling_arr[idx];
										var cur_table_field_event_manager = cur_table_field_item_obj.get_event_manager();

										if(cur_table_field_item_obj != undefined) {

											cur_table_field_item_obj.set_action_name(cur_action_name);
											cur_table_field_item_obj.set_action_hash_key(cur_action_hash_key);
											cur_table_field_item_obj.set_action_context(cur_context_str);
											cur_table_field_event_manager.set_title_jq_text(cur_action_name);
											cur_table_field_event_manager.set_title_jq_attr_tossed_value(cur_action_name);

										}	// end if

									} // end for

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event && is_speech_update) {

						console.log("TM SPEECH UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_SPEECH)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

									// 스피치를 업데이트 했을 경우의 화면 변경.
									var ACTION_NAME = data.ACTION_NAME;
									action_item_obj.set_action_name(ACTION_NAME);
									cur_element_event_manager.set_title_jq_text(ACTION_NAME);

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER === cur_outcome_obj._event && is_speech_update) {

						console.log("TM SPEECH ORDER UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_SPEECH)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);
									// 업데이트된 order_num의 값을 뷰 데이터에 적용합니다.
									// 이 order_num의 값을 기준으로 사용하기 때문입니다.

									var updated_table_row_field_std_list_list = data.updated_table_row_field_std_list_list
									console.log(">>> updated_table_row_field_std_list_list ::: ",updated_table_row_field_std_list_list);

								},
								// delegate_scope
								this
							)
						); // ajax done.	

					} else if(_action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event && is_word_update) {
						
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = _param.IS_UPDATE_WORD_N_QUOTE_WORD_ONLY;
						cur_action_obj_for_db_update[_param.WORD] = action_item_obj.get_action_name();

						console.log("TM WORD UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_WORD_N_QUOTE)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event && is_word_desc_update) {

						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = _param.IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY;
						cur_action_obj_for_db_update[_param.WORD_DESC] = action_item_obj.get_action_name();

						console.log("TM WORD DESC UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_WORD_N_QUOTE)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event && is_quote_update) {

						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = _param.IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY;
						cur_action_obj_for_db_update[_param.QUOTE] = action_item_obj.get_action_name();

						console.log("TM QUOTE DESC UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_WORD_N_QUOTE)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event && is_news_update) {

						console.log("TM NEWS UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_NEWS)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

									// 스피치를 업데이트 했을 경우의 화면 변경.
									var ACTION_NAME = data.ACTION_NAME;
									action_item_obj.set_action_name(ACTION_NAME);
									cur_element_event_manager.set_title_jq_text(ACTION_NAME);

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event) {

						console.log("TM SCHEDULE UPDATE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_TOASTMASTER_SCHEDULE)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_DELETE_ITEM === cur_outcome_obj._event && is_speech_update) {

						console.log("TM SPEECH DELETE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_SPEECH)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							)
						); // ajax done.

					} else if(_action.EVENT_TYPE_DELETE_ITEM === cur_outcome_obj._event && is_news_update) {

						console.log("TM NEWS DELETE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_ACTION_TOASTMASTER_NEWS)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							)
						); // ajax done.						

					} else if(_action.EVENT_TYPE_DELETE_ITEM === cur_outcome_obj._event) {

						console.log("TM ACTION SCHEDULE DELETE");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
						cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_TOASTMASTER_SCHEDULE)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							)
						); // ajax done.						

					} else if( _action.EVENT_TYPE_ADD_SELECT_OPTION == cur_outcome_obj._event ) {

						// SELECT BOX를 선택했을 때의 처리.

						var cur_action_context_obj = action_item_obj.get_action_context_obj();
						if(cur_action_context_obj == undefined) {

							console.log("!Error! / cur_action_context_obj == undefined");
							return;

						} else if(cur_action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_SPEECH_PROJECT) {

							console.log("search_option_arr_speech_projects ::: ",search_option_arr_speech_projects);

							return search_option_arr_speech_projects;

						} else if(cur_action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_SPEECH_SPEAKER) {

							return search_option_arr_members;	

						} else if(cur_action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_SPEECH_EVALUATOR) {

							return search_option_arr_members;	

						} else if(cur_action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_TODAY_ROLE) {

							return search_option_arr_members;	

						}

					}

					cur_element_event_manager.release();
					
				},this)	
			);

		}
































		//     dMMMMMP dMP dMP dMMMMMP .aMMMb  dMP dMP dMMMMMMP dMP dMP dMP dMMMMMP         dMMMMMMMMb dMMMMMP dMMMMMMMMb dMMMMb  dMMMMMP dMMMMb  .dMMMb 
		//    dMP     dMK.dMP dMP     dMP"VMP dMP dMP    dMP   amr dMP dMP dMP             dMP"dMP"dMPdMP     dMP"dMP"dMPdMP"dMP dMP     dMP.dMP dMP" VP 
		//   dMMMP   .dMMMK" dMMMP   dMP     dMP dMP    dMP   dMP dMP dMP dMMMP           dMP dMP dMPdMMMP   dMP dMP dMPdMMMMK" dMMMP   dMMMMK"  VMMMb   
		//  dMP     dMP"AMF dMP     dMP.aMP dMP.aMP    dMP   dMP  YMvAP" dMP             dMP dMP dMPdMP     dMP dMP dMPdMP.aMF dMP     dMP"AMF dP .dMP   
		// dMMMMMP dMP dMP dMMMMMP  VMMMP"  VMMMP"    dMP   dMP    VP"  dMMMMMP         dMP dMP dMPdMMMMMP dMP dMP dMPdMMMMP" dMMMMMP dMP dMP  VMMMP"    

		var tm_officer_action_list = meeting_agenda_data_obj.tm_officer_action_list;
		console.log(">>> tm_officer_action_list ::: ",tm_officer_action_list);

		var activate_officer_list = function(tm_officer_action_list, container_jq) {

			_action_table.add_editable_table_from_action_table(
				// parent_jq
				container_jq
				// action_table_obj
				, tm_officer_action_list
				// delegate_on_event
				, _obj.get_delegate(function(cur_outcome_obj){

					console.log("cur_outcome_obj ::: ",cur_outcome_obj);
					var action_item_obj = cur_outcome_obj._action_item_obj;

					var cur_element_event_manager = action_item_obj.get_event_manager();
					if(cur_element_event_manager == undefined) {
						console.log("!Error! / delegate_save_n_reload / cur_element_event_manager == undefined");
						return;
					}

					var cur_action_obj_for_db_update = action_item_obj.get_action_obj_for_db_update();

					//EVENT_TYPE_UPDATE_ITEM
					if( _action.EVENT_TYPE_UPDATE_ITEM == cur_outcome_obj._event ) {

						console.log("UPDATE OFFICERS");
						console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);

						if(_v.is_not_unsigned_number(meeting_membership_id)) {
							console.log("!Error! / delegate_save_n_reload / _v.is_not_unsigned_number(meeting_membership_id)");
							return;
						}

						cur_action_obj_for_db_update[_param.MEETING_MEMBERSHIP_ID] = parseInt(meeting_membership_id);	

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_TOASTMASTER_OFFICER)
							// _param_obj
							,cur_action_obj_for_db_update
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									console.log(">>> data ::: ",data);

								},
								// delegate_scope
								this
							) // end delegate
						); // end ajax

					} else if( _action.EVENT_TYPE_ADD_SELECT_OPTION == cur_outcome_obj._event ) {

						// SELECT BOX를 선택했을 때의 처리.

						var cur_action_context_obj = action_item_obj.get_action_context_obj();
						if(cur_action_context_obj == undefined) {

							console.log("!Error! / cur_action_context_obj == undefined");
							return;

						} else if(cur_action_context_obj.ACTION_DB_UPDATE_MSG === _param.IS_UPDATE_OFFICER_ROLE) {

							return search_option_arr_members;	

						} // end inner if

					} // end if	

					cur_element_event_manager.release();

				},this) // end delegate

			); // end table

		}




















































		// TODO new datepicker
		// TODO 리스트 패키지로 옮기기 - review mode
		// modal date picker
		// http://vitalets.github.io/bootstrap-datepicker/
		var meeting_agenda_list = meeting_agenda_data_set.meeting_agenda_list;
		var datepicker_jq = $('.datepicker');
		var datePickerObj = datepicker_jq.datepicker();

		datePickerObj.autoclose = true;

		datepicker_jq.datepicker().on('changeDate', function(ev){

			// 화면의 데이트 피커를 숨깁니다.
			$(this).datepicker('hide');

			// 기존에 등록되었던 아젠다의 날짜 정보를 가져와서 비교합니다.
			var cur_date = datePickerObj.val();
			for(var idx=0;idx < meeting_agenda_list.length;idx++) {
				var meeting_agenda_obj = meeting_agenda_list[idx];
				var date_yyyy_mm_dd = _dates.getFormattedTime(meeting_agenda_obj.__startdttm,_dates.DATE_TYPE_YYYY_MM_DD);

				if(date_yyyy_mm_dd == cur_date) {
					alert("There's meeting already in " + date_yyyy_mm_dd + "\nPlease pick another one.");
					datePickerObj.val("");
					return;
				}
			}

		});

		// SET TEMPLATE EVENT
		var agenda_template_jq_list = $("a#agenda_template");
		if(agenda_template_jq_list != undefined && 0 < agenda_template_jq_list.length) {
			agenda_template_jq_list.click(function(e) {

				var self_jq = $(this);
				var action_template = self_jq.attr("action_template");
				var src_meeting_id = parseInt(self_jq.attr("src_meeting_id"));
				var meeting_id = parseInt(self_jq.attr("meeting_id"));
				var action_name = "Schedule";

				var request_param_obj =
				_param
				.get(_param.EVENT_PARAM_EVENT_TYPE,_param.EVENT_TYPE_INSERT_ITEM)
				.get(_param.MEETING_ID_SRC,src_meeting_id)
				.get(_param.MEETING_ID,meeting_id)
				.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
				.get(_param.ACTION_TEMPLATE_NAME,action_template)
				.get(_param.ACTION_NAME,action_name)
				;

				var msg_confirm = "WARNING!\nAre you sure overwriting timeline?\nCurrent timeline will be removed.";
				if(!confirm(msg_confirm)) {
					return;
				}

				// 모달 창을 닫습니다.
				var target_modal = $("div#modal-new-meeting-dialog");
				target_modal.modal('hide');

				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_TOASTMASTER_SCHEDULE_TEMPLATE)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){
							
							console.log("API_UPDATE_TOASTMASTER_SCHEDULE_TEMPLATE");
							console.log(">>> data : ",data);

							// 새로운 템플릿으로 화면 내용을 변경합니다.
							var root_action_obj_std = data.root_action_obj_std;
							var new_meeting_action_list = undefined;
							if(root_action_obj_std != undefined) {
								new_meeting_action_list = _action.get_action_obj(root_action_obj_std);
							}
							if(new_meeting_action_list != undefined) {
								remove_action_timeline(container_jq);
								activate_action_timeline(new_meeting_action_list, container_jq);
							}

						}, // delegate_func end
						// delegate_scope
						this
					)
				); // ajax done.				


			});
		}

		var init_meeting_modal = function(meeting_agenda_obj, datepicker_jq) {

			// 입력되었던 내역들을 모두 지웁니다.
			// 1. 주제 입력창을 초기화합니다.
			var input_meeting_theme_jq = $("input#meeting-theme");
			input_meeting_theme_jq.val("No theme");

			// 2. 미팅 시작날짜를 초기화합니다.
			var input_meeting_date_jq = $("input#meeting-date");

			var meeting_date_recommend = meeting_agenda_obj.__startdate;
			if(meeting_date_recommend == undefined) {
				// 3. 이전 미팅 정보가 없는 경우. 오늘 날짜를 추천
				meeting_date_recommend = _dates.getNow(_dates.DATE_TYPE_YYYY_MM_DD);
			}

			input_meeting_date_jq.val(meeting_date_recommend);
			if(datepicker_jq != undefined) {
				datepicker_jq.datepicker('update', meeting_date_recommend);
			}
			
			// 4. 이벤트 락을 해제합니다.
			_action.get_event_hierarchy_manager().release();

		};
		init_meeting_modal(meeting_agenda_obj, datepicker_jq);
		$('div#modal-new-meeting-dialog').on('hidden.bs.modal', function (e) {

			init_meeting_modal(meeting_agenda_obj, datepicker_jq);

		});


		var btn_new_meeting_save_jq = $("button#meeting-agenda-new");
		btn_new_meeting_save_jq.click(function(e){

			console.log("click save");

			// 입력되었던 내용들에 대한 유효성 검사를 진행합니다.
			// 문제없다면 새로운 meeting agenda를 입력뒤, 새로운 agenda 페이지로 이동합니다.
			var input_meeting_theme_jq = $("input#meeting-theme");
			var cur_meeting_theme = input_meeting_theme_jq.val();
			if(_v.isNotValidStr(cur_meeting_theme)) {
				alert("Please check your meeeting theme.");
				input_meeting_theme_jq.focus();
				return;
			}

			// 입력할 수 있는 글자를 제한합니다.
			var input_meeting_date_jq = $("input#meeting-date");
			var cur_input_meeting_date = input_meeting_date_jq.val();
			if(_v.isNotValidStr(cur_input_meeting_date)) {
				alert("Meeting date is not valid.\nPlease check your meeeting date.");
				input_meeting_date_jq.focus();
				return;
			}

			var _param_obj =
			_param
			.get(_param.EVENT_PARAM_EVENT_TYPE,_param.IS_UPDATE_HEADER)
			.get(_param.MEETING_ID,meeting_agenda_id)
			.get(_param.THEME,cur_meeting_theme)
			.get(_param.START_DATE,cur_input_meeting_date)
			;

			// 이상이 없다면 업데이트!
			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_TOASTMASTER_MEETING_AGENDA)
				// _param_obj / MEETING_ID
				, _param_obj
				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(data);

						// TODO 사용자에게 업데이트가 완료되었음을 알립니다.
						// TOAST POPUP 찾아볼 것
						if(confirm("Updated!")) {
							var param_obj = 
							_param
							.get(_param.MEETING_ID,meeting_agenda_id)
							.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
							;
							_link.go_there(_link.MEETING_AGENDA, param_obj);
						}
					},
					// delegate_scope
					this
				)
			); // ajax done.
		});



























		// meeting agenda를 선택할 수 있는 combox box list를 그려줍니다.
		var list_search_tab = {
			// @required
			_self:null
			, init:function(list_json_array, next_list, selected_option_value){

				if(airborne.validator.isNotValidArray(list_json_array)){
					console.log("list_search_tab / airborne.validator.isNotValidArray(list_json_array)");
					return;
				}

				console.log(">>> selected_option_value : ",selected_option_value);

				this._self = 
				_search_tab.getObj(
					// list_search_tab_name
					"List"
					// list_json_array
					, meeting_agenda_selectable_list
					// prev_sibling_jq
					, $("div#club_title")
					// selected_option_value
					, selected_option_value
				);

				this._self.hide_title();
				this._self.hide_search_btn();
				this._self.hide_input_search_keyword();

				this._self.addDelegateOnChange(_obj.getDelegate(function(selected_option_name, selected_option_value){
					// do something.
					_link.go_there(
						_link.MEETING_AGENDA
						,_param
						.get(_param.MEETING_ID, selected_option_value)
						.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
					);

				}, this));

				/*
				this._self.addExtraBtn(
					// btn_title
					"NEW"
					// desc
					, "Create new agenda"
					// delegate_scope
					, this
					// delegate_btn_clicked
					, function(selected_key, selected_value){	
						_action.get_event_hierarchy_manager().lock();

						$('#modal-new-meeting-dialog').modal('show');
					}
				);
				*/

				// edit meeting theme & date
				this._self.addExtraBtn(
					// btn_title
					"EDIT"
					// desc
					, "Edit meetng theme & date"
					// delegate_scope
					, this
					// delegate_btn_clicked
					// , function(selected_key, selected_value){	// REMOVE ME
					, function(){

						_action.get_event_hierarchy_manager().lock();

						// 0. 수정할 미팅의 id를 등록합니다.
						if(meeting_agenda_obj != undefined && parseInt(meeting_agenda_obj.__meeting_id) > 0) {
							$("div#modal-new-meeting-dialog").attr("cur-meeting-id",meeting_agenda_obj.__meeting_id);	
						}

						// 1. meeting theme
						var input_meeting_theme_jq = $("input#meeting-theme");
						if(input_meeting_theme_jq != undefined && input_meeting_theme_jq.length > 0) {
							input_meeting_theme_jq.val(meeting_agenda_obj.__theme);
						}

						// 2. meeting date
						var input_meeting_date_jq = $("input#meeting-date");
						if(input_meeting_date_jq != undefined && input_meeting_date_jq.length > 0) {
							var meeting_start_date = _dates.getFormattedTime(meeting_agenda_obj.__startdttm, _dates.DATE_TYPE_YYYY_MM_DD);
							input_meeting_date_jq.val(meeting_start_date);
						}

						console.log("meeting_agenda_obj : ",meeting_agenda_obj);

						$('#modal-new-meeting-dialog').modal('show');
					}
				);

				
				this._self.addExtraBtn(	
					// btn_title
					"PRINT"
					// desc
					, "Go pdf view to print out"
					// delegate_scope
					, this
					// delegate_btn_clicked
					, function(selected_key, selected_value){

						// 현재 타임라인 내용을 업데이트 뒤에 PDF 뷰로 이동한다.
						_link.open_new_window(
							_link.PDF_VIEWER
							,_param
							.get(_param.MEETING_ID, selected_value)
							.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
						);
					}
				);

				/*
				this._self.addExtraBtn(	
					// btn_title
					"PRINT LARGE"
					// desc
					, "Go pdf view to print out on large size"
					// delegate_scope
					, this
					// delegate_btn_clicked
					, function(selected_key, selected_value){

						// 현재 타임라인 내용을 업데이트 뒤에 PDF 뷰로 이동한다.
						_link.open_new_window(
							_link.PDF_VIEWER
							,_param
							.get(_param.MEETING_ID, selected_value)
							.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
							.get(_param.FONT_SIZE_LARGE, _param.FONT_SIZE_LARGE)
						);

					}
				);
				*/

				// button setting end - common
			}
		}	
		
		// meeting agenda를 combo box list로 보여줍니다.
		if(meeting_agenda_list != null && meeting_agenda_list.length > 0){

			delegate_create_select_option_obj = 
			airborne.bootstrap.obj.getDelegate(function(element){

				var key = ""
				+ element.__round 
				+ "th"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;"
				+ airborne.dates.getFormattedTime(element.__startdttm, airborne.dates.DATE_TYPE_YYYY_MM_DD)
				+ "&nbsp;&nbsp;&nbsp;&nbsp;"
				+ airborne.html.getTextHead(element.__theme,30);
				;

				var value = element.__meeting_id;
				var select_option_obj = airborne.bootstrap.column.getSelectDetailElement(key, value);

				return select_option_obj;

			}, this);
			
			var meeting_agenda_selectable_list = airborne.bootstrap.obj.getTagSelectOptionArr(meeting_agenda_list, delegate_create_select_option_obj);	

			list_search_tab.init(meeting_agenda_selectable_list, null, meeting_id);

		}





		// EVENT - Documnet Ready
		// TOASTMASTER 배너의 너비 조정을 하는데 사용합니다.
		var on_resize_header = function() {
		    var club_title_jq = $("div#club_title");
		    if(club_title_jq == undefined || club_title_jq.length == 0) {
		    	return;
		    }

		    // adjust dynamic width
		    // width-fixed : 185px
		    var dynamic_header_bg_line_jq = $("div#dynamic_header_bg_line");
		    if(dynamic_header_bg_line_jq == undefined || dynamic_header_bg_line_jq.length == 0) {
		    	return;
		    }

		    var cur_width = club_title_jq.parent().width();
		    var cur_fixed_width = 443;
		    var dynamic_width = 0;

		    if(cur_fixed_width < cur_width) {
		    	dynamic_width = cur_width - cur_fixed_width;
		    }
		    if(0 < dynamic_width) {
		    	dynamic_header_bg_line_jq.outerWidth(dynamic_width);
		    }

		    // show hidden header
		    club_title_jq.show();
		}

		$( document ).ready(function() {
		    on_resize_header();
		});
		$( window ).resize(function() {
		    on_resize_header();
		});

		// show action list
		if(meeting_action_list != undefined) {
			activate_action_timeline(meeting_action_list, container_jq);
			activate_officer_list(tm_officer_action_list, container_jq_officer_list);
		} else {
			// action timeline이 없다면, EDIT Modal Window를 띄워서 사용자가 설정하도록 유도합니다.
			var target_modal = $("div#modal-new-meeting-dialog");
			target_modal.modal('show');
		}

		return obj;
	}


}


// TODO

// 1. add on element 이동 관련 업데이트 수정
// 2. mobile sleeping mode 업데이트 수정