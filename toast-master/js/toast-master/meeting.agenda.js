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

					// wonder.jung11
					return;

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
				
			},this)	
		);

























































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