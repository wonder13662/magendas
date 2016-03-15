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



		var _modal = airborne.bootstrap.modal;
		var _column = airborne.bootstrap.column;
		var _dates = airborne.dates;
		var _html = airborne.html;
		var _server = airborne.server;
		var _obj = airborne.bootstrap.obj;
		var _action_table = airborne.bootstrap.view.obj.table;

		obj.meeting_agenda_container_id = meeting_agenda_container_id;
		var container_jq = $("div#"+meeting_agenda_container_id);

		var bg_default = "#F0F0F0";
		var bg_white = "#FFFFFF";

















		// common props
		var meeting_agenda_obj = meeting_agenda_data_set.meeting_agenda_obj;
		var meeting_membership_id = meeting_agenda_data_set.meeting_membership_id;

		console.log("meeting_agenda_obj ::: ",meeting_agenda_obj);

		var meeting_agenda_id = meeting_agenda_obj.__meeting_id;
		var meeting_agenda_startdttm = meeting_agenda_obj.__startdttm;
		var click_event_lock_obj = null;
		var is_not_editable = (is_editable=="NO")?true:false;
		var is_log_in_user = meeting_agenda_data_set.is_log_in_user;
		var login_user_info = meeting_agenda_data_set.login_user_info;

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





















		//     .aMMMb  .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb      dMMMMMMP dMP dMMMMMMMMb dMMMMMP dMP     dMP dMMMMb  dMMMMMP 
		//    dMP"dMP dMP"VMP   dMP   amr dMP"dMP dMP dMP        dMP   amr dMP"dMP"dMPdMP     dMP     amr dMP dMP dMP      
		//   dMMMMMP dMP       dMP   dMP dMP dMP dMP dMP        dMP   dMP dMP dMP dMPdMMMP   dMP     dMP dMP dMP dMMMP     
		//  dMP dMP dMP.aMP   dMP   dMP dMP.aMP dMP dMP        dMP   dMP dMP dMP dMPdMP     dMP     dMP dMP dMP dMP        
		// dMP dMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP        dMP   dMP dMP dMP dMPdMMMMMP dMMMMMP dMP dMP dMP dMMMMMP

		// TODO 여기서 레이아웃을 관리할 수 있도록 수정.

		// TEST
		var new_action_list = meeting_agenda_data_obj.new_action_list;
		var new_action_element_collection_set = 
		_action_list.add_editable_action_list(
			// action_list
			new_action_list
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

				console.log("HERE / cur_outcome_obj :: ",cur_outcome_obj);

				var action_item_obj = cur_outcome_obj._action_item_obj;
				console.log("HERE / action_item_obj :: ",action_item_obj);

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

				// DEBUG
				var cur_root_action_obj = action_item_obj.get_root_action_obj();
				var cur_root_action_context_obj = action_item_obj.get_action_context_obj();
				if(cur_root_action_context_obj != undefined && cur_root_action_context_obj.meeting_id != undefined) {
					MEETING_ID = cur_root_action_context_obj.meeting_id;
				}
				console.log("HERE / cur_root_action_obj :: ",cur_root_action_obj);
				var obj_tree = cur_root_action_obj.convert_action_hierarchy_to_obj_tree();
				console.log("HERE / obj_tree :: ",obj_tree);

				var cur_action_obj_for_db_update = action_item_obj.get_action_obj_for_db_update();
				cur_action_obj_for_db_update["MEETING_ID"] = MEETING_ID;

				if(_v.is_not_unsigned_number(action_item_obj.get_action_id())) {
					// 전달 파라미터 내용 중에 자신의 앞,뒤의 형제 정보를 추가한다.
					var cur_sibling_action_obj_before = action_item_obj.get_sibling_action_obj_before();
					if(_action.is_valid_action_item_obj(cur_sibling_action_obj_before)) {
						cur_action_obj_for_db_update[_param.ACTION_HASH_KEY_BEFORE] = cur_sibling_action_obj_before.get_action_hash_key();
						// cur_action_obj_for_db_update[_param.PARENT_ACTION_HASH_KEY] = cur_sibling_action_obj_before.get_parent();
					}

					var cur_sibling_action_obj_after = action_item_obj.get_sibling_action_obj_after();
					if(_action.is_valid_action_item_obj(cur_sibling_action_obj_after)) {
						cur_action_obj_for_db_update[_param.ACTION_HASH_KEY_AFTER] = cur_sibling_action_obj_after.get_action_hash_key();
					}

					// id가 없는 엘리먼트는 새로 만들어진 엘리먼트.
					cur_outcome_obj._event = _action.EVENT_TYPE_INSERT_ITEM;
				}

				if( _action.EVENT_TYPE_INSERT_ITEM === cur_outcome_obj._event || 
					_action.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event || 
					_action.EVENT_TYPE_DELETE_ITEM === cur_outcome_obj._event ||
					_action.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER === cur_outcome_obj._event ) {

					console.log("cur_action_obj_for_db_update ::: ",cur_action_obj_for_db_update);
					cur_action_obj_for_db_update[_param.EVENT_PARAM_EVENT_TYPE] = cur_outcome_obj._event;

					_ajax.send_simple_post(
						// _url
						_link.get_link(_link.API_ACTION)
						// _param_obj
						,cur_action_obj_for_db_update
						// _delegate_after_job_done
						,_obj.get_delegate(
							// delegate_func
							function(data){
								
								console.log(">>> data : ",data);

								// TODO - 테이블에서 열을 추가한 경우, 열의 모든 엘리먼트의 정보를 돌려받아 업데이트를 해줘야 합니다.

								// 업데이트한 내역을 가져와 화면에 표시된 데이터와 비교합니다.
								if(_action.EVENT_TYPE_INSERT_ITEM === data.EVENT_PARAM_EVENT_TYPE) {

									// 새로운 엘리먼트를 추가한 경우라면 해당되는 action item 정보(id, hash key)도 같이 업데이트 해줍니다.
									console.log("FIN / action_item_obj :: ",action_item_obj);

									if(action_item_obj.is_table_child_column_list_field_item()) {
										// TABLE FIELD ITEM
										var cur_table_row_field_action_item_list_after_std = data.cur_table_row_field_action_item_list_after_std;
										if(cur_table_row_field_action_item_list_after_std == undefined) {
											console.log("!Error! / _delegate_after_job_done / cur_table_row_field_action_item_list_after_std == undefined");
											return;
										}

										var cur_table_row_sibling_arr = action_item_obj.get_table_row_sibling_arr();
										if(_v.is_not_valid_array(cur_table_row_sibling_arr)) {
											console.log("!Error! / _delegate_after_job_done / _v.is_not_valid_array(cur_table_row_sibling_arr)");
											return;
										}

										if(cur_table_row_sibling_arr.length != cur_table_row_field_action_item_list_after_std.length) {
											console.log("!Error! / _delegate_after_job_done / cur_table_row_sibling_arr.length != cur_table_row_field_action_item_list_after_std.length");
											return;
										}

										for(var idx=0; idx < cur_table_row_field_action_item_list_after_std.length; idx++) {

											var cur_table_row_field_action_item_obj_copy = cur_table_row_field_action_item_list_after_std[idx];
											if(cur_table_row_field_action_item_obj_copy == undefined) {
												console.log("!Error! / _delegate_after_job_done / cur_table_row_field_action_item_obj_copy == undefined");
												return;
											}
											var cur_table_row_field_action_item_obj_src = cur_table_row_sibling_arr[idx];
											if(_action.is_not_valid_action_item_obj(cur_table_row_field_action_item_obj_src)) {
												console.log("!Error! / _delegate_after_job_done / _action.is_not_valid_action_item_obj(cur_table_row_field_action_item_obj_src)");
												return;
											}

											var is_update_coordinate_n_search_map = true;
											cur_table_row_field_action_item_obj_src.set_action_id(cur_table_row_field_action_item_obj_copy.action_id, is_update_coordinate_n_search_map);
											cur_table_row_field_action_item_obj_src.set_action_hash_key(cur_table_row_field_action_item_obj_copy.action_hash_key);

										}

										console.log(">>> cur_table_row_sibling_arr ::: ",cur_table_row_sibling_arr);

									} else {
										// LIST ROW ITEM

										var action_item_copy = data.action_item_copy;
										if(action_item_copy == undefined) {
											console.log("!Error! / _delegate_after_job_done / action_item_copy == undefined");
											return;
										}

										var is_update_coordinate_n_search_map = true;
										action_item_obj.set_action_id(action_item_copy.action_id, is_update_coordinate_n_search_map);
										action_item_obj.set_action_hash_key(action_item_copy.action_hash_key);

									}

								}

								// 내용이 다른 경우 알려줍니다.
								// _action.compare_root_action(cur_root_action_obj, new_root_action_obj);

							},
							// delegate_scope
							this
						)
					); // ajax done.

				} else if( _action.EVENT_TYPE_ADD_SELECT_OPTION == cur_outcome_obj._event ) {

					// SELECT BOX를 선택했을 때의 처리.
					
					console.log("Fetch select box data / action_item_obj :: ",action_item_obj);
					console.log("Fetch select box data / search_option_arr_members :: ",search_option_arr_members);

					return search_option_arr_members;
				}

				cur_element_event_manager.release();


				/*
				// 업데이트 상태마다 다르게 처리
				var request_param_obj = null;
				if( _action.EVENT_TYPE_INSERT_ITEM == cur_outcome_obj._event ) {

					if(action_item_obj.is_item_title_only()) {

						console.log("Do something / INSERT / is_item_title_only");

					} else if(action_item_obj.is_item_title_n_time_hh_mm()) {

						console.log("Do something / INSERT / item_title_n_time_hh_mm / time");

						var cur_action_data_for_db_update = action_item_obj.get_action_data_for_db_update();

						console.log(">>> cur_action_data_for_db_update :: ",cur_action_data_for_db_update);

						var cur_action_data_for_db_update_json_str = JSON.stringify(cur_action_data_for_db_update);

						var cur_root_action_obj = action_item_obj.get_root_action_obj();
						var cur_root_context_obj = _json.parseJSON(cur_root_action_obj.get_action_context());
						var meeting_id = cur_root_context_obj.meeting_id;
						if(_v.is_not_unsigned_number(meeting_id)) {
							console.log("!Error! / delegate_save_n_reload / _v.is_not_unsigned_number(meeting_id)");
							return;
						}

						// wonder.jung

						// 0. 복제 완료 이벤트 발생시, 건네 받는 데이터가 shy 레이어가 아닌, 자신의 부모 레이어의 정보임.
						// shy layer 데이터도 가지고 있어야 할까? 만일 자식 객체가 아무것도 없다면, 어떤 기준으로 자식 객체를 추가해야 할까?

						// shy layer의 데이터가 없다면 자식 레이어는 없다고 정의하는 것이 맞을 듯.
						// 리스트 레이어 만들때에도 action view 데이터를 참고로 action type을 정의하도록 변경?

						// A - title only / title n time / title only
						// B - title only / title n time / title n time

						// A, B가 형제 관계. B의 새로운 형제 열을 만드는 것을 클릭한다면 생겨야 할 새로운 형제 레이어는? 이런 경우의 수는 없을까?
						// 클릭한 객체를 모델로 새로 만든다고 정의함.

						// 1. 새로운 아이템을 생성. shy 모드가 아닌 정말 새 아이템을 만든다. shy 모드는 제거.

						// 1-1. 새로운 아이템을 추가하는 것이 현재는 불가능한 기능. shy 레이어를 복제, 새로운 event manager를 만들어야 함.

						// jquery로 엘리먼트를 복제. 하위 명칭은 모두 변경되어야 함.
						// 복제된 엘리먼트로 event manager를 새로 만들어서 연결.

						// 2. action 객체를 추가로 만듬.
						// 3. element event manager도 새로 만듬.

						request_param_obj =
						_param
						.get(_param.IS_INSERT_ACTION_TIMELINE,_param.YES)
						.get(_param.ACTION_TIMELINE_JSON_STR_ENCODED,cur_action_data_for_db_update_json_str)
						.get(_param.MEETING_ID,MEETING_ID)
						;

					}

				} else if( _action.EVENT_TYPE_UPDATE_ITEM == cur_outcome_obj._event ) {
					
					if(action_item_obj.is_item_title_only_addable()) {

						console.log("Do something / UPDATE / is_item_title_only_addable");

						var cur_root_action_obj = action_item_obj.get_root_action_obj();
						var cur_root_context_obj = cur_root_action_obj.get_action_context_obj();
						var cur_action_context = action_item_obj.get_action_context_obj();

						console.log(">>> cur_root_action_obj :: ",cur_root_action_obj);
						console.log(">>> cur_root_context_obj :: ",cur_root_context_obj);
						console.log(">>> cur_action_context :: ",cur_action_context);

						// action 정보외에 다른 context 정보가 있다면, 추가적인 업데이트 작업을 내부적으로 진행합니다.
						// 시간 정보를 제외한 context 정보는 여기서 제어하지 않습니다.
						

					} else if(action_item_obj.is_item_title_n_time_hh_mm()) {
						
						console.log("Do something / UPDATE / item_title_n_time_hh_mm / time");

						var cur_action_data_for_db_update = action_item_obj.get_action_data_for_db_update();

						console.log(">>> cur_action_data_for_db_update :: ",cur_action_data_for_db_update);

						var cur_action_data_for_db_update_json_str = JSON.stringify(cur_action_data_for_db_update);
						var cur_root_action_obj = action_item_obj.get_root_action_obj();
						var cur_root_context_obj = _json.parseJSON(cur_root_action_obj.get_action_context());

						console.log(">>> cur_root_action_obj :: ",cur_root_action_obj);
						console.log(">>> cur_root_context_obj :: ",cur_root_context_obj);

						request_param_obj =
						_param
						.get(_param.IS_UPDATE_ACTION_TIMELINE,_param.YES)
						.get(_param.ACTION_TIMELINE_JSON_STR_ENCODED,cur_action_data_for_db_update_json_str)
						.get(_param.MEETING_ID,MEETING_ID)
						;

					}

				} else if( _action.EVENT_TYPE_DELETE_ITEM == cur_outcome_obj._event ) {

					console.log("Do something / DELETE");

				} else if( _action.EVENT_TYPE_ADD_SELECT_OPTION == cur_outcome_obj._event ) {
					
					console.log("Fetch select box data / action_item_obj :: ",action_item_obj);
					console.log("Fetch select box data / search_option_arr_members :: ",search_option_arr_members);

					return search_option_arr_members;
				}

				cur_element_event_manager.release();
				if(request_param_obj == undefined) {
					console.log("HERE / request_param_obj == undefined / stop");
					return;
				}
				*/

				// console.log(">>> request_param_obj :: ",request_param_obj);

				/*
				// TEST 
				console.log("HERE / 001");
				
				return;
				

				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_ACTION)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){
							console.log(">>> data : ",data);
							


							var cur_root_action_obj = action_item_obj.get_root_action_obj();
							var new_root_action_std_obj = data.updated_action_std;
							var new_root_action_obj = _action.get_action_obj(new_root_action_std_obj);

							console.log(">>> cur_root_action_obj :: ",cur_root_action_obj);
							console.log(">>> new_root_action_obj :: ",new_root_action_obj);

							_action.compare_root_action(cur_root_action_obj, new_root_action_obj);

						},
						// delegate_scope
						this
					)
				); // ajax done.	
				*/			
				
			},this)	
		);


/*
		//  dMMMMMMP dMP dMMMMMMMMb dMMMMMP dMP     dMP dMMMMb  dMMMMMP 
		//    dMP   amr dMP"dMP"dMPdMP     dMP     amr dMP dMP dMP      
		//   dMP   dMP dMP dMP dMPdMMMP   dMP     dMP dMP dMP dMMMP     
		//  dMP   dMP dMP dMP dMPdMP     dMP     dMP dMP dMP dMP        
		// dMP   dMP dMP dMP dMPdMMMMMP dMMMMMP dMP dMP dMP dMMMMMP    

		// 통합형 타임라인리스트를 작성한다.
		var schedule_timeline_list_V2 = meeting_agenda_data_obj.schedule_timeline_list_V2[0];
		// var testObj = _json.parseJSON(schedule_timeline_list_V2.__timeline_schedule_json_str);

		var timeline_json_obj_arr = [];
		if(schedule_timeline_list_V2 != undefined){
			timeline_json_obj_arr = _json.parseJSON(schedule_timeline_list_V2.__timeline_schedule_json_str);
		}

		console.log(">>> timeline_json_obj_arr :: ",timeline_json_obj_arr);

		// DB 마이그레이션을 통해서 신규 포맷만 지원하도록 바꿉니다.
		// 리스트를 화면에 그립니다.
		var element_collection_set_timeline = 
		_view_list.add_editable_action_list(
			// list_element_type_arr
			[
				_obj.ELEMENT_TYPE_LIST_ROW_TIME_HH_MM_N_INPUT_TEXT
				, _obj.ELEMENT_TYPE_LIST_ROW_INPUT_TEXT
			]
			// json_format_obj_arr
			, timeline_json_obj_arr
			// list_title
			, "timeline"
			// parent_element_set
			, null
			// list_container_jq
			, container_jq
			// delegate_save_n_reload
			, _obj.get_delegate(function(cur_outcome_obj){

				var meeting_id = meeting_agenda_data_set.meeting_agenda_obj.__meeting_id;
				var cur_element_event_manager = cur_outcome_obj._prop_map.__element_event_manager;

				var request_param_obj = {};
				if( _obj.EVENT_TYPE_INSERT_ITEM == cur_outcome_obj._event || 
					_obj.EVENT_TYPE_DELETE_ITEM == cur_outcome_obj._event || 
					_obj.EVENT_TYPE_UPDATE_ITEM == cur_outcome_obj._event ){

					var timeline_json_str;
					var received_meeting_id = parseInt(meeting_agenda_data_obj.meeting_agenda_obj.__meeting_id);

					// parse n save
					
					if(cur_element_event_manager != null){
						// REFACTOR ME - element collection set에서 자신을 파싱하는 메서드를 사용하는 것이 맞을 듯.
						timeline_json_str = _view_list.parse_list_to_json_str(cur_element_event_manager);
					}

					request_param_obj =
					_param
					.get(_param.IS_UPDATE_SCHEDULE_TIMELINE_SET,_param.YES)
					.get(_param.MEETING_ID,received_meeting_id)
					.get(_param.TIMELINE_JSON_STR_ENCODED,timeline_json_str)
					;

				}

				console.log(">>> request_param_obj : ",request_param_obj);

				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){
							console.log(">>> data : ",data);
							cur_element_event_manager.release();
						},
						// delegate_scope
						this
					)
				); // ajax done.
				
			},this)
		);
*/




























/*
		//    .dMMMb  dMMMMb  dMMMMMP dMMMMMP .aMMMb  dMP dMP 
		//   dMP" VP dMP.dMP dMP     dMP     dMP"VMP dMP dMP  
		//   VMMMb  dMMMMP" dMMMP   dMMMP   dMP     dMMMMMP   
		// dP .dMP dMP     dMP     dMP     dMP.aMP dMP dMP    
		// VMMMP" dMP     dMMMMMP dMMMMMP  VMMMP" dMP dMP     

		// REAL
		// json format 객체를 이용한 테이블 생성
		var today_speech_speaker_v2_list = meeting_agenda_data_obj.today_speech_speaker_v2_list;
		console.log(">>> today_speech_speaker_v2_list : ",today_speech_speaker_v2_list);

		// contents - search options
		var search_option_arr_speech_project = [];
		if(_v.isValidArray(meeting_agenda_data_obj.speech_project_list)){
			for (var idx = 0; idx < meeting_agenda_data_obj.speech_project_list.length; idx++) {
				var speech_project_obj = meeting_agenda_data_obj.speech_project_list[idx];

				if(_v.isNotValidStr(speech_project_obj.__speech_project_title)) continue;
				var cur_select_option = _obj.get_select_option(speech_project_obj.__speech_project_title,speech_project_obj.__speech_project_id);
				search_option_arr_speech_project.push(cur_select_option);
			}	
		}
		var search_option_arr_speakers = [];
		if(_v.isValidArray(meeting_agenda_data_obj.member_list)){
			for (var idx = 0; idx < meeting_agenda_data_obj.member_list.length; idx++) {
				var cur_member_obj = meeting_agenda_data_obj.member_list[idx];

				var cur_select_option = _obj.get_select_option(cur_member_obj.__member_name,cur_member_obj.__member_hash_key);
				search_option_arr_speakers.push(cur_select_option);
			}
		}
		console.log(">>> meeting_agenda_data_obj.member_list :: ",meeting_agenda_data_obj.member_list);
		console.log(">>> search_option_arr_speakers :: ",search_option_arr_speakers);

		// set table row element type
		var last_json_for_speakers = 
		_action_table.add_search_list_type({

			key_access_prop_name:"__speech_project_title"
			, value_access_prop_name:"__speech_project_id"
			, search_option_arr:search_option_arr_speech_project
			, column_title:"Project"

		}).add_input_text_type({

			column_title:"Title"
			, key_access_prop_name:"__title"

		}).add_search_list_type({

			column_title:"Speaker"
			, key_access_prop_name:"__speaker_member_name"
			, value_access_prop_name:"__speaker_member_hash_key"
			, search_option_arr:search_option_arr_speakers

		}).add_search_list_type({

			column_title:"Evaluator"
			, key_access_prop_name:"__evaluator_member_name"
			, value_access_prop_name:"__evaluator_member_hash_key"
			, search_option_arr:search_option_arr_speakers

		});

		var element_collection_set_speakers = 
		_action_table.add_editable_table_V2(
			// parent_jq
			container_jq
			// table_title
			, "Today's Speakers"
			// table_column_json_format_obj
			, last_json_for_speakers
			// table_raw_data
			, today_speech_speaker_v2_list
			// delegate_save_n_reload
			, _obj.get_delegate(function(cur_outcome_obj){

				var meeting_id = meeting_agenda_data_set.meeting_agenda_obj.__meeting_id;
				var cur_element_event_manager = cur_outcome_obj._prop_map.__element_event_manager;
				var request_param_obj=null;

				if(_obj.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER == cur_outcome_obj._event){

					// 테이블의 순서를 가져와야 함.
					// 그 이후에 전체 테이블 order update.
					var cur_raw_map_data = cur_outcome_obj._prop_map.get_raw_map();
					var cur_element_json = cur_element_event_manager.get_element_meta_info().get_element_json();
					var all_vertical_ref_arr = cur_element_json.get_all_vertical_ref_arr(true);

					// 테이블 순서와 speech id를 맵핑한 배열 객체를 만듭니다.
					var speech_table_row_idx_arr = [];
					for (var i = 0; i < all_vertical_ref_arr.length; i++) {
						var cur_vertical_ref = all_vertical_ref_arr[i];

						var __speech_id = cur_vertical_ref.get_element_meta_info().get_prop_map().get_raw_map_prop("__speech_id");
						speech_table_row_idx_arr.push(
							_param
							.get(_param.SPEECH_ID,__speech_id)
							.get(_param.ORDER_NUM,i)
						);
					};

					var speech_table_row_info_arr_json_str = JSON.stringify(speech_table_row_idx_arr);

					// @ params
					request_param_obj = 
					_param
					.get(_param.IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER, _param.YES)
					.get(_param.MEETING_ID, meeting_id)
					.get(_param.SPEECH_TABLE_ROW_INFO_ARR_JSON_STR, speech_table_row_info_arr_json_str)
					.get(_param.WINDOW_SCROLL_Y, window.scrollY)
					;

				} else if(_obj.EVENT_TYPE_INSERT_TABLE_ROW_ITEMS == cur_outcome_obj._event){

					// @ params
					request_param_obj = 
					_param
					.get(_param.IS_INSERT_SPEECH,_param.YES)
					.get(_param.MEETING_ID,meeting_id)
					;

				} else if(_obj.EVENT_TYPE_DELETE_ITEM == cur_outcome_obj._event){

					// @ params
					request_param_obj = 
					_param
					.get(_param.IS_DELETE_SPEECH,_param.YES)
					.get(_param.MEETING_ID,meeting_id)
					.get(_param.SPEECH_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__speech_id"))
					;

				} else if(_obj.EVENT_TYPE_UPDATE_ITEM == cur_outcome_obj._event){

					if("Project" == cur_outcome_obj._id){

						// @ params
						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_SPEECH,_param.YES)
						.get(_param.MEETING_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__meeting_id"))
						.get(_param.SPEECH_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__speech_id"))
						.get(_param.SPEECH_PROJECT_ID,cur_outcome_obj._value)
						;

					} else if("Title" == cur_outcome_obj._id){

						// @ params
						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_SPEECH,_param.YES)
						.get(_param.MEETING_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__meeting_id"))
						.get(_param.SPEECH_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__speech_id"))
						.get(_param.SPEECH_TITLE,cur_outcome_obj._value)
						;

					} else if("Speaker" == cur_outcome_obj._id){

						// @ params
						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_SPEECH_SPEAKER,_param.YES)
						.get(_param.MEETING_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__meeting_id"))
						.get(_param.SPEECH_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__speech_id"))
						.get(_param.SPEECH_SPEAKER_MEMBER_HASH_KEY,cur_outcome_obj._value)
						.get(_param.SPEECH_SPEAKER_TIMER_GREEN,300)
						.get(_param.SPEECH_SPEAKER_TIMER_RED,300)
						;

					} else if("Evaluator" == cur_outcome_obj._id){

						var __evaluator_id = -1;
						for (var idx = 0; idx < today_speech_speaker_v2_list.length; idx++) {
							var today_speech_speaker = today_speech_speaker_v2_list[idx];

							if(today_speech_speaker.__meeting_id != cur_outcome_obj._prop_map.get_raw_map_prop("__meeting_id")) continue;
							if(today_speech_speaker.__speech_id != cur_outcome_obj._prop_map.get_raw_map_prop("__speech_id")) continue;

							__evaluator_id = today_speech_speaker.__evaluator_id;

							break;
						}

						if(__evaluator_id > 0) {

							// @ params
							request_param_obj = 
							_param
							.get(_param.IS_UPDATE_SPEECH_EVALUATOR,_param.YES)
							.get(_param.MEETING_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__meeting_id"))
							.get(_param.SPEECH_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__speech_id"))
							.get(_param.EVALUATOR_ID,__evaluator_id)
							.get(_param.SPEECH_EVALUATOR_MEMBER_HASH_KEY,cur_outcome_obj._value)
							;

						} else {

							// @ params
							request_param_obj = 
							_param
							.get(_param.IS_INSERT_SPEECH_EVALUATOR,_param.YES)
							.get(_param.MEETING_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__meeting_id"))
							.get(_param.SPEECH_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__speech_id"))
							.get(_param.SPEECH_EVALUATOR_MEMBER_HASH_KEY,cur_outcome_obj._value)
							;

						}

					}

				}


				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(function(data){

	            		// 타임라인을 업데이트 합니다.
	            		// REMOVE ME
	            		// update_timeline();

	            		// LEGACY
	            		if( request_param_obj.IS_INSERT_SPEECH == _param.YES || request_param_obj.IS_DELETE_SPEECH == _param.YES ) {
		            		console.log(">>> 페이지를 리로딩");

		            		// 아래 기능을 구현하기 전까지는 페이지를 리로딩합니다.
							_link.go_there(
								_link.MEETING_AGENDA
								,_param
								.get(_param.MEETING_ID, meeting_id)
								.get(_param.WINDOW_SCROLL_Y, window.scrollY)
							);
	            		}



					},this)
				); // ajax done.



			},this)
		);


		// wonder.jung
		// TEST
		
*/



























/*



		//  dMMMMMMP .aMMMb  dMMMMb  .aMMMb  dMP dMP         dMMMMb  .aMMMb  dMP     dMMMMMP 
		//    dMP   dMP"dMP dMP VMP dMP"dMP dMP.dMP         dMP.dMP dMP"dMP dMP     dMP      
		//   dMP   dMP dMP dMP dMP dMMMMMP  VMMMMP         dMMMMK" dMP dMP dMP     dMMMP     
		//  dMP   dMP.aMP dMP.aMP dMP dMP dA .dMP         dMP"AMF dMP.aMP dMP     dMP        
		// dMP    VMMMP" dMMMMP" dMP dMP  VMMMP"         dMP dMP  VMMMP" dMMMMMP dMMMMMP     

		// Today's Role
		var today_role_list = meeting_agenda_data_set.today_role_list;
		var today_role_list_sorted = today_role_list;

		console.log(">>> today_role_list :: ",today_role_list);

		// convert html safe text
		for (var idx = 0; idx < today_role_list_sorted.length; idx++) {
			var role_obj = today_role_list_sorted[idx];
			role_obj.__role_name = _html.getSafeText(role_obj.__role_name);
			role_obj.__member_first_name = _html.getSafeText(role_obj.__member_first_name);
			role_obj.__member_last_name = _html.getSafeText(role_obj.__member_last_name);
		};
		var loop_len = (today_role_list_sorted.length/2);
		var member_role_cnt_list = meeting_agenda_data_set.member_role_cnt_list;

		// raw data list
		var table_raw_data_todays_role_list = []; 
		for (var idx = 0; idx < loop_len; idx++) {

			var left_role_idx = idx*2;
			var right_role_idx = idx*2 + 1;
			var left_role_obj = today_role_list_sorted[left_role_idx];
			var right_role_obj = today_role_list_sorted[right_role_idx];

			// 유저의 해당 롤의 참여 횟수를 나타냅니다.
			var left_role_cnt = 0;
			var right_role_cnt = 0;
			var table_row_info = [];
			for (var inner_idx = 0; inner_idx < member_role_cnt_list.length; inner_idx++) {
				var member_role_cnt_obj = member_role_cnt_list[inner_idx];

				if((left_role_obj.__member_id == member_role_cnt_obj.__member_id) && (left_role_obj.__role_id == member_role_cnt_obj.__role_id)){
					left_role_cnt = member_role_cnt_obj.__role_cnt;
				}

				if((right_role_obj.__member_id == member_role_cnt_obj.__member_id) && (right_role_obj.__role_id == member_role_cnt_obj.__role_id)){
					right_role_cnt = member_role_cnt_obj.__role_cnt;
				}
			}

			var __left_role_member_name = "";
			var __left_role_member_id = left_role_obj.__member_id;
			var __left_role_name = left_role_obj.__role_name;
			var __left_role_id = left_role_obj.__role_id;
			if( parseInt(__left_role_member_id) == -1 ) {
				__left_role_member_name = _param.NOT_ASSIGNED;
			} else if(left_role_obj.__member_name === _param.GUEST) {
				__left_role_member_name = left_role_obj.__member_name;
			} else {
				__left_role_member_name = left_role_cnt + " " + left_role_obj.__member_name;	
			}

			var __right_role_member_name = "";
			var __right_role_member_id = right_role_obj.__member_id;
			var __right_role_name = right_role_obj.__role_name;
			var __right_role_id = right_role_obj.__role_id;
			if( parseInt(__right_role_member_id) == -1 ) {
				__right_role_member_name = _param.NOT_ASSIGNED;
			} else if(right_role_obj.__member_name === _param.GUEST) {
				__right_role_member_name = right_role_obj.__member_name;	
			} else {
				__right_role_member_name = right_role_cnt + " " + right_role_obj.__member_name;	
			}

			// raw data obj
			// 1 depth data
			var cur_raw_data_obj = {
				__meeting_agenda_id:meeting_agenda_id
				,__left_role_id:__left_role_id
				,__left_role_name:__left_role_name
				,__left_role_member_name:__left_role_member_name
				,__left_role_member_id:__left_role_member_id
				,__right_role_id:__right_role_id
				,__right_role_name:__right_role_name
				,__right_role_member_name:__right_role_member_name
				,__right_role_member_id:__right_role_member_id
			};
			table_raw_data_todays_role_list.push(cur_raw_data_obj);
		}	

		// set table row element type
		var last_json_for_todays_role = 
		_action_table.add_title_type({

			key_access_prop_name:"__left_role_name"

		}).add_search_list_type({
			
			key_access_prop_name:"__left_role_member_name"
			, value_access_prop_name:"__left_role_member_id"
			, search_option_arr:search_option_arr_members

		}).add_title_type({

			key_access_prop_name:"__right_role_name"

		}).add_search_list_type({
			
			key_access_prop_name:"__right_role_member_name"
			, value_access_prop_name:"__right_role_member_id"
			, search_option_arr:search_option_arr_members

		});

		// create table
		var element_collection_set_todays_role = 
		_action_table.add_editable_table_V2(
			// parent_jq
			container_jq
			// table_title
			, "Today's Role"
			// table_column_json_format_obj
			, last_json_for_todays_role
			// table_raw_data
			, table_raw_data_todays_role_list
			// delegate_save_n_reload
			, _obj.get_delegate(function(cur_outcome_obj){

				var meeting_id = meeting_agenda_data_set.meeting_agenda_obj.__meeting_id;
				var cur_element_event_manager = cur_outcome_obj._prop_map.__element_event_manager;
				var request_param_obj = null;

				// @ custom codes inits
				if(_obj.EVENT_TYPE_UPDATE_ITEM == cur_outcome_obj._event){

					var role_id = -1;
					if("__left_role_member_name" === cur_outcome_obj._prop_map.get_key_access_prop_name()) {
						// 왼쪽의 롤 아이디를 가져옵니다.
						role_id = parseInt(cur_outcome_obj._prop_map.get_raw_map_prop("__left_role_id"));
					} else {
						// 오른쪽의 롤 아이디를 가져옵니다.
						role_id = parseInt(cur_outcome_obj._prop_map.get_raw_map_prop("__right_role_id"));
					}

					request_param_obj =
					_param
					.get(_param.IS_UPDATE_TODAY_ROLE,_param.YES)
					.get(_param.MEETING_ID,meeting_id)
					.get(_param.ROLE_ID,role_id)
					.get(_param.MEMBER_ID,cur_outcome_obj._value)
					;

				}
				// @ custom codes ends







				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(function(data){

		            	console.log(">>> today's role / data : ",data);

		            	// REMOVE ME
		            	// update_timeline();

		            	// 이벤트를 릴리즈, 초기 상태로 전환합니다.
		            	// cur_element_event_manager.release();

					},this)
				); // ajax done.







			},this)

		);		
*/





/*
		//    dMP dMP dMP .aMMMb  dMMMMb  dMMMMb         dMMMMb        .aMMMb  .aMMMb  dMP dMP dMMMMMMP dMMMMMP 
		//   dMP dMP dMP dMP"dMP dMP.dMP dMP VMP        dMP dMP       dMP"dMP dMP"dMP dMP dMP    dMP   dMP      
		//  dMP dMP dMP dMP dMP dMMMMK" dMP dMP        dMP dMP       dMP.dMP dMP dMP dMP dMP    dMP   dMMMP     
		// dMP.dMP.dMP dMP.aMP dMP"AMF dMP.aMP        dMP dMP       dMP.MMP dMP.aMP dMP.aMP    dMP   dMP        
		// VMMMPVMMP"  VMMMP" dMP dMP dMMMMP"        dMP dMP        VMMP"MP VMMMP"  VMMMP"    dMP   dMMMMMP     

		var __word = (meeting_agenda_obj.__word=="")?"No Word":meeting_agenda_obj.__word;
		var __word_desc = (meeting_agenda_obj.__word_desc=="")?"No Desc":meeting_agenda_obj.__word_desc;
		var __quote = (meeting_agenda_obj.__quote=="")?"No Quote":meeting_agenda_obj.__quote;

		// raw data list
		var table_raw_data_word_n_quote = [{
			__title:"Word"
			,__text:__word
		},{
			__title:"Word Desc"
			,__text:__word_desc
		},{
			__title:"Quote Title"
			,__text:__quote
		}]; 

		// set table row element type
		var last_json_for_word_n_quote = 
		_action_table.add_title_type({

			key_access_prop_name:"__title"

		}).add_input_text_type({

			key_access_prop_name:"__text"

		});	

		// create table
		var element_collection_set_word_n_quote = 
		_action_table.add_editable_table_V2(
			// parent_jq
			container_jq
			// table_title
			, "Word & Quote"
			// table_column_json_format_obj
			, last_json_for_word_n_quote
			// table_raw_data
			, table_raw_data_word_n_quote
			// delegate_save_n_reload
			, _obj.get_delegate(function(cur_outcome_obj){

				var meeting_id = meeting_agenda_data_set.meeting_agenda_obj.__meeting_id;
				var cur_element_event_manager = cur_outcome_obj._prop_map.__element_event_manager;
				var request_param_obj = null;

				// @ custom codes inits
				if(_obj.EVENT_TYPE_UPDATE_ITEM == cur_outcome_obj._event){

					var __title = cur_outcome_obj._prop_map.get_raw_map_prop("__title");
					if(__title === "Word"){

						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_WORD_N_QUOTE_WORD_ONLY,_param.YES)
						.get(_param.MEETING_ID,meeting_id)
						.get(_param.WORD,_html.getPostQueryStringSafeText(cur_outcome_obj._value))
						;

					} else if(__title === "Word Desc"){

						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY,_param.YES)
						.get(_param.MEETING_ID,meeting_id)
						.get(_param.WORD_DESC,_html.getPostQueryStringSafeText(cur_outcome_obj._value))
						;

					} else if(__title === "Quote Title"){

						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY,_param.YES)
						.get(_param.MEETING_ID,meeting_id)
						.get(_param.QUOTE,_html.getPostQueryStringSafeText(cur_outcome_obj._value))
						;

					}					
				}
				// @ custom codes ends


				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(function(data){

		            	console.log(">>> word n quote / data : ",data);

		            	// REMOVE ME
		            	// update_timeline();

		            	// 이벤트를 릴리즈, 초기 상태로 전환합니다.
		            	// cur_element_event_manager.release();

					},this)
				); // ajax done.




			},this)
		);	
*/




		//     dMMMMb  dMMMMMP dMP dMP dMP .dMMMb 
		//    dMP dMP dMP     dMP dMP dMP dMP" VP 
		//   dMP dMP dMMMP   dMP dMP dMP  VMMMb   
		//  dMP dMP dMP     dMP.dMP.dMP dP .dMP   
		// dMP dMP dMMMMMP  VMMMPVMMP"  VMMMP"    
/*
		var table_row_data_list_today_news = meeting_agenda_data_set.today_news_list;

		// set table row element type
		var last_json_for_today_news = 
		_action_table.add_input_text_type({

			column_title:"News Contents"
			, key_access_prop_name:"__news_content"

		});

		// create table
		var element_collection_set_news =
		_action_table.add_editable_table_V2(
			// parent_jq
			container_jq
			// table_title
			, "News"
			// table_column_json_format_obj
			, last_json_for_today_news
			// table_raw_data
			, table_row_data_list_today_news
			// delegate_save_n_reload
			, _obj.get_delegate(function(cur_outcome_obj){

				var meeting_id = meeting_agenda_data_set.meeting_agenda_obj.__meeting_id;
				var cur_element_event_manager = cur_outcome_obj._prop_map.__element_event_manager;
				var request_param_obj = null;

				// @ custom codes inits
				if(_obj.EVENT_TYPE_INSERT_TABLE_ROW_ITEMS === cur_outcome_obj._event) {

					request_param_obj = 
					_param
					.get(_param.IS_INSERT_NEWS,_param.YES)
					.get(_param.MEETING_ID,meeting_id)
					;

				} else if(_obj.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER === cur_outcome_obj._event) {

					// REFACTOR ME - begins / 동일한 조회로직을 사용.
					// 테이블의 순서를 가져와야 함.
					// 그 이후에 전체 테이블 order update.
					var cur_raw_map_data = cur_outcome_obj._prop_map.get_raw_map();
					var cur_element_json = cur_element_event_manager.get_element_meta_info().get_element_json();
					var all_vertical_ref_arr = cur_element_json.get_all_vertical_ref_arr(true);

					// 테이블 순서와 news id를 맵핑한 배열 객체를 만듭니다.
					var news_table_row_idx_arr = [];
					for (var i = 0; i < all_vertical_ref_arr.length; i++) {
						var cur_vertical_ref = all_vertical_ref_arr[i];

						// 이 부분만 새로 설정
						var __news_id = cur_vertical_ref.get_field_option().get_raw_map_prop("__news_id");
						news_table_row_idx_arr.push({__news_id:__news_id,__order_num:i});
					};

					var news_table_row_info_arr_json_str = JSON.stringify(news_table_row_idx_arr);
					// REFACTOR ME - ends

					request_param_obj = 
					_param
					.get(_param.IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS,_param.YES)
					.get(_param.MEETING_ID,meeting_id)
					.get(_param.NEWS_TABLE_ROW_INFO_ARR_JSON_STR,news_table_row_info_arr_json_str)
					.get(_param.WINDOW_SCROLL_Y,window.scrollY)
					;

				} else if(_obj.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event) {

					var __news_id = cur_outcome_obj._prop_map.get_raw_map_prop("__news_id");	

					if(cur_outcome_obj._prop_map.get_key_access_prop_name() === "__news_title") {

						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_NEWS,_param.YES)
						.get(_param.MEETING_ID,meeting_id)
						.get(_param.NEWS_ID,__news_id)
						.get(_param.NEWS_TITLE,_html.getPostQueryStringSafeText(cur_outcome_obj._value))
						;

					} else if(cur_outcome_obj._prop_map.get_key_access_prop_name() === "__news_content") {

						request_param_obj = 
						_param
						.get(_param.IS_UPDATE_NEWS,_param.YES)
						.get(_param.MEETING_ID,meeting_id)
						.get(_param.NEWS_ID,__news_id)
						.get(_param.NEWS_CONTENTS,_html.getPostQueryStringSafeText(cur_outcome_obj._value))
						;

					}

				} else if(_obj.EVENT_TYPE_DELETE_ITEM === cur_outcome_obj._event) {

					var __news_id = cur_outcome_obj._prop_map.get_raw_map_prop("__news_id");

					request_param_obj = 
					_param
					.get(_param.IS_DELETE_NEWS,_param.YES)
					.get(_param.MEETING_ID,meeting_id)
					.get(_param.NEWS_ID,__news_id)
					;

				}
				// @ custom codes ends








				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(function(data){

		            	console.log(">>> news / data : ",data);

		            	if( request_param_obj.IS_INSERT_NEWS != undefined && request_param_obj.IS_INSERT_NEWS === _param.YES ) {

		            		request_param_obj =
							_param
							.get(_param.MEETING_ID,meeting_id)
							.get(_param.WINDOW_SCROLL_Y,window.scrollY)
							;
							_link.go_there(_link.MEETING_AGENDA, request_param_obj);

		            	} else if( request_param_obj.IS_DELETE_NEWS != undefined && request_param_obj.IS_DELETE_NEWS === _param.YES ) {

		            		request_param_obj =
							_param
							.get(_param.MEETING_ID,meeting_id)
							.get(_param.WINDOW_SCROLL_Y,window.scrollY)
							;
							_link.go_there(_link.MEETING_AGENDA, request_param_obj);

		            	} else {

		            		// REMOVE ME
		            		// update_timeline();

		            	}

		            	

		            	// 이벤트를 릴리즈, 초기 상태로 전환합니다.
		            	//cur_element_event_manager.release();

					},this)
				); // ajax done.

			},this)
		);	
*/









		//     dMMMMMP dMP dMP dMMMMMP .aMMMb  dMP dMP dMMMMMMP dMP dMP dMP dMMMMMP         dMMMMMMMMb dMMMMMP dMMMMMMMMb dMMMMb  dMMMMMP dMMMMb  .dMMMb 
		//    dMP     dMK.dMP dMP     dMP"VMP dMP dMP    dMP   amr dMP dMP dMP             dMP"dMP"dMPdMP     dMP"dMP"dMPdMP"dMP dMP     dMP.dMP dMP" VP 
		//   dMMMP   .dMMMK" dMMMP   dMP     dMP dMP    dMP   dMP dMP dMP dMMMP           dMP dMP dMPdMMMP   dMP dMP dMPdMMMMK" dMMMP   dMMMMK"  VMMMb   
		//  dMP     dMP"AMF dMP     dMP.aMP dMP.aMP    dMP   dMP  YMvAP" dMP             dMP dMP dMPdMP     dMP dMP dMPdMP.aMF dMP     dMP"AMF dP .dMP   
		// dMMMMMP dMP dMP dMMMMMP  VMMMP"  VMMMP"    dMP   dMP    VP"  dMMMMMP         dMP dMP dMPdMMMMMP dMP dMP dMPdMMMMP" dMMMMMP dMP dMP  VMMMP"    

		// executive member list
		var table_row_data_list_executive_member = meeting_agenda_data_set.executive_member_list;

		// set table row element type
		var last_json_for_executive_members = 
		_action_table.add_title_type({

			key_access_prop_name:"__officer_name"

		}).add_search_list_type({
			
			key_access_prop_name:"__member_name"
			, value_access_prop_name:"__member_id"
			, search_option_arr:search_option_arr_members

		});	

		// create table
		var element_collection_set_executive_members =
		_action_table.add_editable_table_V2(
			// parent_jq
			container_jq
			// table_title
			, "Executive Members"
			// table_column_json_format_obj
			, last_json_for_executive_members
			// table_raw_data
			, table_row_data_list_executive_member
			// delegate_save_n_reload
			, _obj.get_delegate(function(cur_outcome_obj){

				var meeting_id = meeting_agenda_data_set.meeting_agenda_obj.__meeting_id;
				var cur_element_event_manager = cur_outcome_obj._prop_map.__element_event_manager;
				var request_param_obj = null;

				// @ custom codes inits
				if(_obj.EVENT_TYPE_UPDATE_ITEM === cur_outcome_obj._event) {

					request_param_obj =
					_param
					.get(_param.IS_UPDATE_EXECUTIVE_MEMBER,_param.YES)
					.get(_param.MEETING_ID,meeting_id)
					.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
					.get(_param.EXECUTIVE_OFFICER_ID,cur_outcome_obj._prop_map.get_raw_map_prop("__officer_id"))
					.get(_param.EXECUTIVE_MEMBER_ID,cur_outcome_obj._value)
					;

				}
				// @ custom codes ends

				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(function(data){

		            	console.log(">>> exec members / data : ",data);

		            	// REMOVE ME
		            	// update_timeline();

		            	// TODO 이벤트 릴리스도 공통 로직 (call_delegate_save_n_reload)안에 포함되어야 할 듯.
		            	// 이벤트를 릴리즈, 초기 상태로 전환합니다.
		            	// cur_element_event_manager.release();

					},this)
				); // ajax done.		        

			},this)
		);




/*
		if(new_action_element_collection_set != undefined){
			
			_action_list.set_add_on_json_format_on_list(
				// src_element_collection_set
				new_action_element_collection_set
				// target_element_collection_set_arr
				,[
					element_collection_set_speakers
					, element_collection_set_todays_role
					, element_collection_set_word_n_quote
					, element_collection_set_news
				]
			);

			// element collection set jumpers
			if(element_collection_set_speakers != undefined) {
				element_collection_set_speakers.add_element_collection_set_jump_spot(new_action_element_collection_set);	
			}
			if(element_collection_set_todays_role != undefined) {
				element_collection_set_todays_role.add_element_collection_set_jump_spot(new_action_element_collection_set);	
			}
			if(element_collection_set_word_n_quote != undefined) {
				element_collection_set_word_n_quote.add_element_collection_set_jump_spot(new_action_element_collection_set);	
			}
			if(element_collection_set_news != undefined) {
				element_collection_set_news.add_element_collection_set_jump_spot(new_action_element_collection_set);
			}

		}

		// window scroll Y
		var window_scroll_y = meeting_agenda_data_set.window_scroll_y;
		if(window_scroll_y > 0){
			window.scrollTo(0,window_scroll_y);	
		}
*/









		// REMOVE ME
		/*
		var update_timeline = function(delegate_func_after_update_timeline) {

			var cur_element_set_arr = element_collection_set_timeline.get_element_set_arr();

			var cur_element_set = cur_element_set_arr[0];

			var cur_element_event_manager = cur_element_set.get_event_manager();

			var timeline_json_str = _view_list.parse_list_to_json_str(cur_element_event_manager);

			if(_v.is_not_valid_str(timeline_json_str)) {
				console.log("!Error! / update_timeline / _v.is_not_valid_str(timeline_json_str)");
				return;
			}

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj
				,_param
				.get(_param.IS_UPDATE_SCHEDULE_TIMELINE_SET,_param.YES)
				.get(_param.MEETING_ID,meeting_id)
				.get(_param.TIMELINE_JSON_STR_ENCODED,timeline_json_str)
				// _delegate_after_job_done
				,_obj.get_delegate(function(data){

					console.log(">>> data :: ",data);

	            	// 이벤트를 릴리즈, 초기 상태로 전환합니다.
	            	cur_element_event_manager.release();

	            	if(_obj.isValidDelegate(delegate_func_after_update_timeline)) {
	            		delegate_func_after_update_timeline._func.apply(delegate_func_after_update_timeline._scope,[]);
	            	}

				},this)

			); // ajax done.

		}




		// TODO 이 업데이트 형태는 수정되어야 합니다.
		// 포함된 테이블이 업데이트됨으로써 2번 업데이트 과정이 발생합니다.
		// 이 과정을 1번으로 줄여야 합니다.
		// 다른 업데이트 직후, 타임라인 업데이트를 하는 파라미터를 넘깁니다.
		if(meeting_agenda_data_set.is_update_timeline_after_job === "YES") {
			// 타임 라인 리스트와 업데이트 연동 / 시작
			var timeline_json_str;
			var request_param_obj = {
				meeting_id:parseInt(meeting_agenda_data_obj.meeting_agenda_obj.__meeting_id)
				,is_update_schedule_timeline_set:"YES"
				,window_scroll_y:window.scrollY
			};

			var cur_element_event_manager_from_timeline;
			if(_v.is_valid_array(element_collection_set_timeline.get_element_set_arr())) {
				cur_element_event_manager_from_timeline = element_collection_set_timeline.get_element_set_arr()[0].get_event_manager();
			}
			if(cur_element_event_manager_from_timeline != undefined) {
				timeline_json_str = _view_list.parse_list_to_json_str(cur_element_event_manager_from_timeline);
				var outcomeJSON = JSON.parse(timeline_json_str);
			}
			if(_v.is_valid_str(timeline_json_str)) {
				request_param_obj.timeline_json_str_encoded = timeline_json_str;
				_server.call_url_post_with_custom_params(cur_element_event_manager_from_timeline.get_element_jq(), request_param_obj);
			}
			// 타임 라인 리스트와 업데이트 연동 / 끝
		}
		*/

















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

			// 과거 날짜인 경우 알려줍니다.
			/*
			var cur_date = datePickerObj.val();
			if(_dates.isExpired(cur_date, _dates.DATE_TYPE_YYYY_MM_DD)) {
				alert("Meeting date is over.\nPlease check your meeeting date.");
				datePickerObj.val("");
				return;
			}
			*/

		});
		var init_meeting_modal = function(meeting_agenda_list, datepicker_jq) {

			// 입력되었던 내역들을 모두 지웁니다.
			// 1. 주제 입력창을 초기화합니다.
			var input_meeting_theme_jq = $("input#meeting-theme");
			input_meeting_theme_jq.val("No theme");

			// 2. 미팅 시작날짜를 초기화합니다.
			var input_meeting_date_jq = $("input#meeting-date");

			// 2-1. 마지막 미팅에서 일주일씩 날짜를 더해 가장 가까운 미래의 날짜를 지정해줍니다.(같은 요일로 설정하기 위해서 입니다.)
			var meeting_date_recommend = undefined;
			if(_v.is_valid_array(meeting_agenda_list)) {
				var last_meeting_obj = meeting_agenda_list[0];
				var last_meeting_date_yyyy_mm_dd = _dates.getFormattedTime(meeting_agenda_obj.__startdttm,_dates.DATE_TYPE_YYYY_MM_DD);

				var max_loop = 24; // 최대 6개월까지 검사해줍니다.
				var weeks_later_yyyy_mm_dd = undefined;
				for(var idx = 1; idx < max_loop; idx++) {
					// 미팅 날짜로 부터 n주 뒤의 날짜를 가져옵니다.
					weeks_later_yyyy_mm_dd = _dates.getWeeksLater(last_meeting_date_yyyy_mm_dd, idx, _dates.DATE_TYPE_YYYY_MM_DD);
					if(_dates.isFuture(weeks_later_yyyy_mm_dd, _dates.DATE_TYPE_YYYY_MM_DD)) {
						console.log("그 날짜가 현재로부터 미래라면 그것을 사용합니다.");
						break;
					}
					
					weeks_later_yyyy_mm_dd = undefined;
				}

				meeting_date_recommend = weeks_later_yyyy_mm_dd;
			}
			// 2-2. 이전 미팅 정보가 없는 경우. 오늘 날짜를 추천
			if(meeting_date_recommend == undefined) {
				meeting_date_recommend = _dates.getNow(_dates.DATE_TYPE_YYYY_MM_DD);
			}
			input_meeting_date_jq.val(meeting_date_recommend);
			if(datepicker_jq != undefined) {
				datepicker_jq.datepicker('update', meeting_date_recommend);
			}

			// 3. 미팅 템플릿 체크 버튼을 모두 초기화합니다.
			var timeline_template_list_jq = $("li#timeline_template_row");
			var btn_radios_jq = timeline_template_list_jq.find("input#radio_btn_meeting_template");
			btn_radios_jq.removeAttr("checked");

			// 3-1. 첫번째 버튼을 선택(기본 설정)
			btn_radios_jq.first().prop('checked', true);

			// 4. 이벤트 락을 해제합니다.
			_obj.get_event_hierarchy_manager().release();

		};
		init_meeting_modal(meeting_agenda_list, datepicker_jq);
		$('div#modal-new-meeting-dialog').on('hidden.bs.modal', function (e) {

			init_meeting_modal(meeting_agenda_list, datepicker_jq);

		});


		var btn_new_meeting_save_jq = $("button#meeting-agenda-new");
		btn_new_meeting_save_jq.click(function(e){
			// TODO 입력되었던 내용들에 대한 유효성 검사를 진행합니다.
			// 문제없다면 새로운 meeting agenda를 입력뒤, 새로운 agenda 페이지로 이동합니다.
			var input_meeting_theme_jq = $("input#meeting-theme");
			var cur_meeting_theme = input_meeting_theme_jq.val();
			if(_v.isNotValidStr(cur_meeting_theme)) {
				alert("Please check your meeeting theme.");
				input_meeting_theme_jq.focus();
				return;
			}

			// TODO 입력할 수 있는 글자를 제한합니다.
			var input_meeting_date_jq = $("input#meeting-date");
			var cur_input_meeting_date = input_meeting_date_jq.val();
			if(_v.isNotValidStr(cur_input_meeting_date)) {
				alert("Meeting date is not valid.\nPlease check your meeeting date.");
				input_meeting_date_jq.focus();
				return;
			}

			// REMOVE ME
			/*
			if(_dates.isExpired(cur_input_meeting_date, _dates.DATE_TYPE_YYYY_MM_DD)) {
				alert("Meeting date is over.\nPlease check your meeeting date.");
				return;
			}*/


			// 선택한 미팅 템플릿을 가져옵니다.
			var timeline_template_row_jq_arr = $("li#timeline_template_row");
			var selected_template_id = -1;
			for(var idx = 0;idx < timeline_template_row_jq_arr.length;idx++) {
				var timeline_template_row_jq = $(timeline_template_row_jq_arr[idx]);
				var btn_input_radio_jq = timeline_template_row_jq.find("input:checked#radio_btn_meeting_template");

				if(	btn_input_radio_jq != undefined && 
					btn_input_radio_jq.val() != undefined && 
					btn_input_radio_jq.val() == "on" ) {

					selected_template_id = parseInt(timeline_template_row_jq.attr("template_id"));
					break;
				}
			}

			var cur_meeting_id = parseInt($("div#modal-new-meeting-dialog").attr("cur-meeting-id"));
			if(cur_meeting_id < 0 && selected_template_id < 0) {
				alert("Please check your meeeting template.");
				return;
			}

			// 새로운 미팅을 저장합니다.
			var cur_meeting_membership_id = -1;
			var cur_meeting_round = -1;
			var is_new_meeting_header = _param.NO;
			var is_update_meeting_header = _param.NO;
			if(cur_meeting_id > 0 && meeting_agenda_obj != undefined) {
				// 1. 이미 있던 미팅인 경우
				//cur_meeting_membership_id = parseInt(meeting_agenda_obj.__membership_id);
				cur_meeting_round = parseInt(meeting_agenda_obj.__round);
				is_new_meeting_header = _param.NO;
				is_update_meeting_header = _param.YES;
			} else if(login_user_info != undefined && parseInt(login_user_info.__membership_id) > 0) {
				// 2. 새로운 미팅인 경우
				//cur_meeting_membership_id = parseInt(login_user_info.__membership_id);
				is_new_meeting_header = _param.YES;
				is_update_meeting_header = _param.NO;
			} else {
				// 3. 유효하지 않은 상황. 개발자에게 알림.
				alert("!Error! Please let developer know Error - #531");
				return;
			}

			var request_param_obj =
			_param
			.get(_param.IS_NEW_MEETING_HEADER,is_new_meeting_header)
			.get(_param.IS_UPDATE_MEETING_HEADER,is_update_meeting_header)
			.get(_param.MEETING_ID,cur_meeting_id)
			.get(_param.ROUND,cur_meeting_round)
			.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
			.get(_param.MEETING_TEMPLATE_ID,selected_template_id)
			.get(_param.THEME,cur_meeting_theme)
			.get(_param.START_DATE,cur_input_meeting_date)
			;

			console.log(">>> request_param_obj : ",request_param_obj);

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj
				,request_param_obj
				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(">>> data : ",data);

						var new_meeting_obj_json_str = "";
						if(data.query_output_arr != undefined && data.query_output_arr.length > 0) {
							new_meeting_obj_json_str = data.query_output_arr[1];
						}

						console.log(">>> new_meeting_obj_json_str : ",new_meeting_obj_json_str);

						var new_meeting_obj_arr = null;
						if(_v.is_valid_str(new_meeting_obj_json_str)) {
							new_meeting_obj_arr = _json.parseJSON(new_meeting_obj_json_str);
						}

						console.log(">>> new_meeting_obj_arr : ",new_meeting_obj_arr);

						_obj.get_event_hierarchy_manager().release();

						if(	new_meeting_obj_arr != undefined && 
							new_meeting_obj_arr.length > 0 &&
							new_meeting_obj_arr[0].__meeting_id != undefined && 
							parseInt(new_meeting_obj_arr[0].__meeting_id) > 0) {

							// 미팅을 새로 생성한 경우.

							_link.go_there(
								_link.MEETING_AGENDA
								,_param
								.get(_param.MEETING_ID, parseInt(new_meeting_obj_arr[0].__meeting_id))
								.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
							);

						} else {

							// 있던 미팅을 업데이트하는 경우.

							_link.go_there(
								_link.MEETING_AGENDA
								,_param
								.get(_param.MEETING_ID, parseInt(cur_meeting_id))
								.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
							);
						}

					},
					// delegate_scope
					this
				)
			); // ajax done.


		});



		// timeline template event inits
		//template_list_container
		var template_list_container_jq = $("ul#template_list_container");
		var schedule_timeline_template_list = meeting_agenda_data_set.schedule_timeline_template_list;

		// 지난주의 미팅 아젠다도 가져옵니다.
		var recent_club_schedule_timeline_list = meeting_agenda_data_set.recent_club_schedule_timeline_list;
		// 템플릿 포맷으로 변환.
		for(var idx = 0;idx < recent_club_schedule_timeline_list.length;idx++) {
			var recent_club_schedule_obj = recent_club_schedule_timeline_list[idx];
			var template_obj = {
				__timeline_template_title:recent_club_schedule_obj.__meeting_agenda_startdttm + " " + recent_club_schedule_obj.__meeting_agenda_theme
				, __timeline_template_json_str:recent_club_schedule_obj.__timeline_schedule_json_str
			};
			schedule_timeline_template_list.push(template_obj);
		}


		//var schedule_timeline_list_V2 = meeting_agenda_data_obj.schedule_timeline_list_V2[0];
		// var testObj = _json.parseJSON(schedule_timeline_list_V2.__timeline_schedule_json_str);

		console.log("지난주의 미팅 아젠다도 가져옵니다.");
		console.log("recent_club_schedule_timeline_list :: ",recent_club_schedule_timeline_list);


		// timeline template event ends
		var timeline_template_tag = "";
		for(var idx = 0;idx < schedule_timeline_template_list.length;idx++) {
			var template_obj = schedule_timeline_template_list[idx];
			var type = template_obj.__timeline_template_title;

			var jsonObjList = _json.parseJSON(template_obj.__timeline_template_json_str);
			if(jsonObjList == undefined) {
				continue;
			}

			var checked = "";
			if(idx == 0) {
				checked = "checked";
			}

			timeline_template_tag += ""
			+ "<li id=\"timeline_template_row\" template_id=\"<template_id>\" class=\"list-group-item\" style=\"color:#B1B1B1;background-color:#F1F1F1;\">".replace(/\<template_id\>/gi, template_obj.__timeline_template_id)				
				
				+ "<div class=\"radio\" style=\"margin-top:0px;margin-bottom:0px;\">"
					+ "<label>"
						+ "<input type=\"radio\" id=\"radio_btn_meeting_template\" <checked>><span id=\"title\"><strong><title></strong></span>".replace(/\<title\>/gi, type).replace(/\<checked\>/gi, checked)
					+ "</label>"
					+ "<button id=\"folder_open_n_close\" type=\"button\" class=\"btn btn-default btn-xs\" style=\"float:right;margin-right:0px;margin-top:-2px;\"><span class=\"glyphicon glyphicon-folder-close\" style=\"padding-top:3px;padding-bottom:5px;padding-left:3px;padding-right:3px;\"></span>&nbsp;</button>"
				+ "</div>"

				+ "<ul id=\"main_action_list\" class=\"list-group\" style=\"margin-top:10px;margin-bottom:5px !important;\">"
			;

			// main action
			for(var idx_main_action = 0;idx_main_action < jsonObjList.length;idx_main_action++) {
				var main_action_json_obj = jsonObjList[idx_main_action];

				var __action_name = main_action_json_obj.__action_name;
				var __action_list = main_action_json_obj.__action_list;
				var __time_sec = main_action_json_obj.__prop_map.__time_sec;
				var __time_hh_mm = _dates.get_hh_mm_from_seconds(__time_sec);

				timeline_template_tag += ""
					+ "<li id=\"main_action_row\" class=\"list-group-item\" style=\"color:rgb(138, 109, 59);background-color:rgb(252, 248, 227);padding-left:10px;\">"
						+ "<span id=\"time\" class=\"badge airborne_add_on\" style=\"float:left;\"><time_hh_mm></span>".replace(/\<time_hh_mm\>/gi, __time_hh_mm)
						+ "<span id=\"title\" style=\"padding-left:10px;\"><title></span>".replace(/\<title\>/gi, __action_name)
				;

				for(var idx_sub_action_list = 0;idx_sub_action_list < __action_list.length;idx_sub_action_list++) {
					var sub_action_json_obj_list = __action_list[idx_sub_action_list];

					timeline_template_tag += ""
						+ "<ul id=\"sub_action_list\" class=\"list-group\" style=\"margin-top:10px;margin-bottom:5px !important;\">"
					;

					for(var idx_sub_action = 0;idx_sub_action < sub_action_json_obj_list.length;idx_sub_action++) {
						var sub_action_json_obj = sub_action_json_obj_list[idx_sub_action];

						var __sub_action_name = sub_action_json_obj.__action_name;
						timeline_template_tag += ""
						+ "<li class=\"list-group-item\">"
							+ "<span id=\"title\"><title></span>".replace(/\<title\>/gi, __sub_action_name)
						+ "</li>"
						;

					} // for sub action obj end

					timeline_template_tag += ""
						+ "</ul>"
					;

				} // for sub action list end

				timeline_template_tag += ""
					+ "</li>"
					;

			} // for main action list end

			timeline_template_tag += ""
				+ "</ul>"			
			+ "</li>"
			;

		} // for template end

		timeline_template_tag +=
		"</ul>";

		template_list_container_jq.append(timeline_template_tag);





		// EVENT
		var main_action_list_jq = $("ul#main_action_list");
		main_action_list_jq.hide();
		var main_action_list_row_jq = main_action_list_jq.find("li#main_action_row");
		main_action_list_row_jq.find("ul#sub_action_list").hide();
		main_action_list_row_jq.click(function(e){

			e.stopPropagation();

			var self_jq = $(this);
			var child_sub_action_list_jq = self_jq.parent().find("ul#sub_action_list");

			var is_show = child_sub_action_list_jq.attr("is_show");
			if(is_show == null || is_show == "" || is_show == "false") {
				child_sub_action_list_jq.attr("is_show","true");
				child_sub_action_list_jq.show();
			} else if(is_show == "true") {
				child_sub_action_list_jq.attr("is_show","false");
				child_sub_action_list_jq.hide();
			}
		});

		var sub_action_list_jq = main_action_list_jq.find("ul#sub_action_list");
		var timeline_template_list_jq = $("li#timeline_template_row");
		timeline_template_list_jq.mouseenter(function(e){
			var self_jq = $(this);
			var cur_color = self_jq.css("color");
			var cur_bg_color = self_jq.css("background-color");

			self_jq.css("color",cur_bg_color);
			self_jq.css("background-color",cur_color);
		});
		//radio
		timeline_template_list_jq.find("input#radio_btn_meeting_template").click(function(){
			// 한개의 라디오 버튼만 선택되도록 해줍니다.
			var self_jq = $(this);

			var radio_btn_jq_arr = timeline_template_list_jq.find("input#radio_btn_meeting_template");
			for(var idx = 0; idx < radio_btn_jq_arr.length; idx++) {
				var cur_radio_btn_jq = $(radio_btn_jq_arr[idx]);

				if(self_jq[0] == cur_radio_btn_jq[0]) {
					continue;
				}

				cur_radio_btn_jq.removeAttr("checked");
			}

		});
		timeline_template_list_jq.mouseleave(function(e){
			var self_jq = $(this);
			var cur_color = self_jq.css("color");
			var cur_bg_color = self_jq.css("background-color");

			self_jq.css("color",cur_bg_color);
			self_jq.css("background-color",cur_color);

			self_jq.find("button#folder_open_n_close").blur();
		});
		timeline_template_list_jq.find("button#folder_open_n_close").click(function(e) {

			e.stopPropagation();

			var self_jq = $(this);
			var child_main_action_list_jq = self_jq.parent().parent().find("ul#main_action_list").first();
			var is_show = child_main_action_list_jq.attr("is_show");
			if(is_show == null || is_show == "" || is_show == "false") {
				child_main_action_list_jq.attr("is_show","true");
				child_main_action_list_jq.show();
				// 버튼의 모양을 close 로 바꿉니다.
				var btn_glyps_jq = self_jq.find("span.glyphicon-folder-close");

				btn_glyps_jq.removeClass("glyphicon-folder-close");
				btn_glyps_jq.addClass("glyphicon-folder-open");

			} else if(is_show == "true") {
				child_main_action_list_jq.attr("is_show","false");
				child_main_action_list_jq.hide();
				// 버튼의 모양을 open 으로 바꿉니다.
				var btn_glyps_jq = self_jq.find("span.glyphicon-folder-open");

				btn_glyps_jq.removeClass("glyphicon-folder-open");
				btn_glyps_jq.addClass("glyphicon-folder-close");
			}
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

				this._self.addExtraBtn(
					// btn_title
					"NEW"
					// desc
					, "Create new agenda"
					// delegate_scope
					, this
					// delegate_btn_clicked
					, function(selected_key, selected_value){	
						_obj.get_event_hierarchy_manager().lock();

						var timeline_template_container_jq = timeline_template_list_jq.parent().parent();
						if(timeline_template_container_jq != undefined && timeline_template_container_jq.length > 0) {
							timeline_template_container_jq.show();
						}

						$('#modal-new-meeting-dialog').modal('show');
					}
				);

				// edit meeting theme & date
				this._self.addExtraBtn(
					// btn_title
					"EDIT"
					// desc
					, "Edit meetng theme & date"
					// delegate_scope
					, this
					// delegate_btn_clicked
					, function(selected_key, selected_value){	
						_obj.get_event_hierarchy_manager().lock();

						// 수정할 미팅 정보를 전달합니다.
						var timeline_template_container_jq = timeline_template_list_jq.parent().parent();
						if(timeline_template_container_jq != undefined && timeline_template_container_jq.length > 0) {
							timeline_template_container_jq.hide();
						}

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

						// 3. meeting num
						var modal_title_jq = $("h4#modal-title");
						if(modal_title_jq != undefined && modal_title_jq.length > 0) {
							modal_title_jq.html(meeting_agenda_obj.__round + "th");
						}

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
						// REMOVE ME
						/*
						update_timeline(
							// delegate_func_after_update_timeline
							_obj.get_delegate(function(){

								_link.open_new_window(
									_link.PDF_VIEWER
									,_param
									.get(_param.MEETING_ID, selected_value)
									.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
								);

							},this)

						);
						*/

						_link.open_new_window(
							_link.PDF_VIEWER
							,_param
							.get(_param.MEETING_ID, selected_value)
							.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
						);
					}
				);


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
						// REMOVE ME
						/*
						update_timeline(
							// delegate_func_after_update_timeline
							_obj.get_delegate(function(){

								_link.open_new_window(
									_link.PDF_VIEWER
									,_param
									.get(_param.MEETING_ID, selected_value)
									.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
									.get(_param.FONT_SIZE_LARGE, _param.FONT_SIZE_LARGE)
								);

							},this)

						);
						*/

					}
				);

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


		return obj;
	}
}


// TODO

// 1. add on element 이동 관련 업데이트 수정
// 2. mobile sleeping mode 업데이트 수정