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




		// common props
		var meeting_agenda_obj = meeting_agenda_data_set.meeting_agenda_obj;
		var meeting_membership_id = meeting_agenda_data_set.meeting_membership_id;
		var recent_action_collection_id = meeting_agenda_data_set.recent_action_collection_id

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






		// wonder.jung11
		// var pdf_url = service_root_path + "/images/test_show_pdf.pdf";
		// _print.draw_grid_view(container_jq, _print.PRINT_FORMAT_A4_LANDSCAPE, pdf_url);













		//     .aMMMb  .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb      dMMMMMMP dMP dMMMMMMMMb dMMMMMP dMP     dMP dMMMMb  dMMMMMP 
		//    dMP"dMP dMP"VMP   dMP   amr dMP"dMP dMP dMP        dMP   amr dMP"dMP"dMPdMP     dMP     amr dMP dMP dMP      
		//   dMMMMMP dMP       dMP   dMP dMP dMP dMP dMP        dMP   dMP dMP dMP dMPdMMMP   dMP     dMP dMP dMP dMMMP     
		//  dMP dMP dMP.aMP   dMP   dMP dMP.aMP dMP dMP        dMP   dMP dMP dMP dMPdMP     dMP     dMP dMP dMP dMP        
		// dMP dMP  VMMMP"   dMP   dMP  VMMMP" dMP dMP        dMP   dMP dMP dMP dMPdMMMMMP dMMMMMP dMP dMP dMP dMMMMMP

		// TODO 여기서 레이아웃을 관리할 수 있도록 수정.

		// TEST
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

					// DEBUG
					var obj_tree = cur_root_action_obj.convert_action_hierarchy_to_obj_tree();

					var cur_action_obj_for_db_update = action_item_obj.get_action_obj_for_db_update();
					if(_v.is_unsigned_number(MEETING_ID)) {
						cur_action_obj_for_db_update["MEETING_ID"] = parseInt(MEETING_ID);	
					}				

					if(_v.is_not_unsigned_number(action_item_obj.get_action_id())) {
						// 전달 파라미터 내용 중에 자신의 앞,뒤의 형제 정보를 추가한다.
						var cur_sibling_action_obj_before = action_item_obj.get_sibling_action_obj_before();
						if(_action.is_valid_action_item_obj(cur_sibling_action_obj_before)) {
							cur_action_obj_for_db_update[_param.ACTION_HASH_KEY_BEFORE] = cur_sibling_action_obj_before.get_action_hash_key();
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

									} else if(_action.EVENT_TYPE_UPDATE_ITEM === data.EVENT_PARAM_EVENT_TYPE) {
										
										if(_action.ACTION_DB_UPDATE_MSG === _action.IS_UPDATE_TODAY_ROLE) {

											// 역할을 업데이트 했을 경우의 화면 변경.
											var NEW_ACTION_NAME = data.NEW_ACTION_NAME;
											action_item_obj.set_action_name(NEW_ACTION_NAME);
											cur_element_event_manager.set_title_jq_text(NEW_ACTION_NAME);

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
					
				},this)	
			);

		}


























































		//     dMMMMMP dMP dMP dMMMMMP .aMMMb  dMP dMP dMMMMMMP dMP dMP dMP dMMMMMP         dMMMMMMMMb dMMMMMP dMMMMMMMMb dMMMMb  dMMMMMP dMMMMb  .dMMMb 
		//    dMP     dMK.dMP dMP     dMP"VMP dMP dMP    dMP   amr dMP dMP dMP             dMP"dMP"dMPdMP     dMP"dMP"dMPdMP"dMP dMP     dMP.dMP dMP" VP 
		//   dMMMP   .dMMMK" dMMMP   dMP     dMP dMP    dMP   dMP dMP dMP dMMMP           dMP dMP dMPdMMMP   dMP dMP dMPdMMMMK" dMMMP   dMMMMK"  VMMMb   
		//  dMP     dMP"AMF dMP     dMP.aMP dMP.aMP    dMP   dMP  YMvAP" dMP             dMP dMP dMPdMP     dMP dMP dMPdMP.aMF dMP     dMP"AMF dP .dMP   
		// dMMMMMP dMP dMP dMMMMMP  VMMMP"  VMMMP"    dMP   dMP    VP"  dMMMMMP         dMP dMP dMPdMMMMMP dMP dMP dMPdMMMMP" dMMMMMP dMP dMP  VMMMP"    

		// REMOVE ME LATER
/*
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


					},this)
				); // ajax done.		        

			},this)
		);
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

		// SET TEMPLATE EVENT
		var agenda_template_jq_list = $("a#agenda_template");
		console.log(">>> agenda_template_jq_list ::: ",agenda_template_jq_list);
		if(agenda_template_jq_list != undefined && 0 < agenda_template_jq_list.length) {
			agenda_template_jq_list.click(function(e) {

				console.log("this ::: ",this);

				var self_jq = $(this);
				var action_template = self_jq.attr("action_template");
				var src_meeting_id = parseInt(self_jq.attr("src_meeting_id"));
				var meeting_id = parseInt(self_jq.attr("meeting_id"));
				var action_name = "action_timelne";

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

				console.log(">>> request_param_obj ::: ",request_param_obj);

				// 모달 창을 닫습니다.
				var target_modal = $("div#modal-new-meeting-dialog");
				target_modal.modal('hide');

				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_ACTION)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){
							
							// wonder.jung
							console.log(">>> data : ",data);

							// 새로운 템플릿으로 화면 내용을 변경합니다.
							var root_action_collection_updated = data.root_action_collection_updated;
							var new_meeting_action_list = undefined;
							if(root_action_collection_updated != undefined) {
								new_meeting_action_list = _action.get_action_obj(root_action_collection_updated);
							}
							if(new_meeting_action_list != undefined) {
								remove_action_timeline(container_jq);

								// 타임라인을 지우게 될 경우, 현재 등록된 1. 스피치, 2. 롤, 3. 뉴스, 4. Word & Quote이 사라지게 된다.
								// 1. 스피치, 2. 롤의 경우는 교육 통계를 위해 쌓아두어야 하는 중요한 자료.
								// 타임 라인을 덮어 쓰게 될 경우는 위 2개 데이터를 가져와서 타임 라인에 반영하는 과정이 필요하다.



								activate_action_timeline(new_meeting_action_list, container_jq);
							}

						}, // delegate_func end
						// delegate_scope
						this
					)
				); // ajax done.				


			});
		}

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

			// 4. 이벤트 락을 해제합니다.
			_action.get_event_hierarchy_manager().release();

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
		} else {
			// action timeline이 없다면, EDIT Modal Window를 띄워서 사용자가 설정하도록 유도합니다.
			var target_modal = $("div#modal-new-meeting-dialog");
			target_modal.modal('show');
		}

		console.log(">>>> meeting_agenda_obj ::: ",meeting_agenda_obj);

		return obj;
	}


}


// TODO

// 1. add on element 이동 관련 업데이트 수정
// 2. mobile sleeping mode 업데이트 수정