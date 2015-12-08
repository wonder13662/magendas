var toast_master = {
	mobile_list_manager:{}
};

toast_master.mobile_list_manager = {
	link_manager:null
	,set_link_manager:function(link_manager){
		this.link_manager = link_manager;
	}
	,get_link_manager:function(){
		return this.link_manager;
	}
	/*
		@ public
		@ desc : TOAST MASTER 관련 색상
	*/
	, COLOR_TINT_YELLOW:"#f8e48b"			// NAVY
	, COLOR_NAVY:"#004360"					// TINT YELLOW
	, COLOR_TEXT_WHITE:"#FFFFFF"			// WHITE
	, COLOR_RED_WINE:"#8e323f"
	, COLOR_ARR_MENU_TOP:[0, 67, 96]		// NAVY
	, COLOR_ARR_MENU_BOTTOM:[142, 50, 63]	// RED WINE
	, COLOR_EMERALD_GREEN:"#33CC99" 		// EMERALD GREEN
	, COLOR_TINT_GRAY:"#f5f5f5"				// TINT GRAY
	/*
		@ private
		@ desc : 로그인 열을 그립니다.
	*/
	,addLogInRow:function(login_user_info, table_jq, text_color, bg_color){

		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if(_v == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRow / _v == null");
			return;
		}

		if(_m_list == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRow / _m_list == null");
			return;
		}

		if(_obj == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRow / _obj == null");
			return;
		}

		if(login_user_info == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRow / login_user_info == null");
			return;
		}

		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRow / table_jq == null");
			return;
		}

		var cur_link_manager = this.get_link_manager();
		if(cur_link_manager == null) {
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRow / cur_link_manager == null");
			return;
		}

		if(text_color == undefined) {
			text_color = this.COLOR_NAVY;
		}

		if(bg_color == undefined) {
			bg_color = this.COLOR_TINT_YELLOW;
		}

		var log_in_msg = "Log in";
		if(login_user_info.__is_login=="YES"){
			log_in_msg = login_user_info.__membership_name + " - " + login_user_info.__member_first_name + " " + login_user_info.__member_last_name;
		}

		var log_in_row_jq = 
		_m_list.addTableRowLogIn(
			// title
			log_in_msg
			// is_log_in
			,login_user_info.__is_login
			// url_log_in
			, cur_link_manager.get_link(cur_link_manager.LOG_IN)
			// url_log_out
			, cur_link_manager.get_link(cur_link_manager.LOG_OUT)
			// append_target_jq
			, table_jq
			// text_color
			, text_color
			// bg_color
			, bg_color
		);

		return log_in_row_jq;		
	}
	/*
		@ private
		@ desc : 2개의 슬롯을 가지고 있는 로그인 열을 그립니다.
		사용자는 슬롯이 필요한 정보를 제공해 줘야 합니다.

		ex) 사용자가 소속된 클럽 정보 (클릭시 다른 클럽에 등록되어 있다면 클럽 변경 화면을 보여줍니다.) / 사용자 정보 (로그인/로그아웃)
	*/
	,addLogInRowDoubleSlot:function(login_user_info, membership_obj, table_jq, text_color, bg_color, delegate_on_click_left_slot, redirect_url_after_log_in){
		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if(_v == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / _v == null");
			return;
		}

		if(_m_list == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / _m_list == null");
			return;
		}

		if(_obj == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / _obj == null");
			return;
		}

		if(login_user_info == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / login_user_info == null");
			return;
		}

		if(membership_obj == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / membership_obj == null");
			return;
		}

		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / table_jq == null");
			return;
		}

		if(_obj.isNotValidDelegate(delegate_on_click_left_slot)){
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / _obj.isNotValidDelegate(delegate_on_click_left_slot)");
			return null;
		}


		var cur_link_manager = this.get_link_manager();
		if(cur_link_manager == null) {
			console.log("!Error! / toast_master.mobile_list_manager / addLogInRowDoubleSlot / cur_link_manager == null");
			return;
		}

		if(text_color == undefined) {
			text_color = this.COLOR_NAVY;
		}

		if(bg_color == undefined) {
			bg_color = this.COLOR_TINT_YELLOW;
		}

		var log_in_msg_right = "Log in";
		if(login_user_info.__is_login=="YES"){
			log_in_msg_right = login_user_info.__member_first_name + " " + login_user_info.__member_last_name;
		}

		var log_in_msg_left = "Looking for club?";
		if(_v.isNumberStr(membership_obj.__membership_id) && _v.is_valid_str(membership_obj.__membership_name)){
			log_in_msg_left = membership_obj.__membership_name;
		}


		var table_row_slot_obj_arr = [];
		var slot_left_obj
		= _m_list.get_table_row_slot_obj(
			// title
			log_in_msg_left
			// delegate_on_click
			, delegate_on_click_left_slot
		);
		var slot_right_obj
		= _m_list.get_table_row_slot_obj(
			// title
			log_in_msg_right
			// delegate_on_click_left_slot
			, _obj.getDelegate(function(delegate_data){

				console.log(">>> delegate_data :: ",delegate_data);

			}, this)
		);
		table_row_slot_obj_arr.push(slot_left_obj);
		table_row_slot_obj_arr.push(slot_right_obj);

		// wonder.jung
		if(redirect_url_after_log_in == undefined) {
			redirect_url_after_log_in = "";
		}
		var url_log_in = _link.get_link(
			_link.LOG_IN
			, _param
			.get(_param.REDIRECT_URL, encodeURIComponent(redirect_url_after_log_in))
		);
		console.log(">>> redirect_url_after_log_in :: ",redirect_url_after_log_in);
		console.log(">>> url_log_in :: ",url_log_in);

		//_link
		console.log(">>> _link :: ",_link);


		var log_in_row_jq = 
		_m_list.addTableRowLogInDoubleSlot(
			// title
			"log_in_row"
			// table_row_slot_obj_arr
			, table_row_slot_obj_arr
			// is_log_in
			, login_user_info.__is_login
			// url_log_in
			, url_log_in
			// url_log_out
			, cur_link_manager.get_link(cur_link_manager.LOG_OUT)
			// append_target_jq
			, table_jq
			// text_color
			, text_color
			// bg_color
			, bg_color
		);

		return log_in_row_jq;
	}	
	/*
		@ public
		@ desc : 로그인 및 페이지 뎁스를 보여주는 열을 그립니다.
	*/
	,addHeaderRow:function(login_user_info, membership_obj, header_arr, table_jq, color_text, bg_color_vmouse_down, is_disabled){

		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if(login_user_info == null){
			console.log("!Error! / toast_master.mobile_list_manager / addHeaderRow / login_user_info == null");
			return;
		}
		if(membership_obj == null){
			console.log("!Error! / toast_master.mobile_list_manager / addHeaderRow / membership_obj == null");
			return;
		}
		if(_v.isNotValidArray(header_arr)){
			console.log("!Error! / toast_master.mobile_list_manager / addHeaderRow / _v.isNotValidArray(header_arr)");
			return;
		}
		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addHeaderRow / table_jq == null");
			return;
		}
		if(color_text == undefined) {
			color_text = this.COLOR_TEXT_WHITE;
		}

		if(bg_color_vmouse_down == undefined) {
			bg_color_vmouse_down = this.COLOR_RED_WINE;
		}

		var redirect_url_after_log_in = header_arr[0].__call_url;

		var log_in_row_jq = 
		this.addLogInRowDoubleSlot(
			// login_user_info
			login_user_info
			// membership_obj
			, membership_obj
			// table_jq
			,table_jq
			// text_color
			, null
			// bg_color
			, null
			// delegate_on_click_left_slot
			, _obj.getDelegate(function(delegate_data){

				if(	delegate_data == undefined ||
					delegate_data.delegate_data == undefined ||
					delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

					console.log("!Error!\taddHeaderRow\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
					return;
				}

				if(_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) return;

				if(is_disabled != undefined && is_disabled === true) return;

				_link.go_there(_link.MEMBERSHIP_PICKER);

			}, this)
			// redirect_url_after_log_in
			, redirect_url_after_log_in
		);


		_m_list.addTableHeaderNavRow(
			// header_arr
			header_arr
			// color_rgb_max_bright
			, this.COLOR_ARR_MENU_TOP
			// color_rgb_min_darker
			, this.COLOR_ARR_MENU_BOTTOM
			// after_row_jq
			, log_in_row_jq
			// color_text
			, color_text
			// bg_color_vmouse_down
			, bg_color_vmouse_down
		);

		return log_in_row_jq;

	}
	,addNumberSelectorList:function(min_num, max_num, size, call_url, table_jq){

		// 1 (show)
		// 2 (hide)
		// 3 (hide)
		// ...
		// 10 (show)
		// 11 (hide)
		// 12 (hide)
		// ...

		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if( !(min_num < max_num) ){
			console.log("!Error! / toast_master.mobile_list_manager / addNumberSelectorList / !(min_num < max_num)");
			return;
		}
		if( !(0 < size) ){
			console.log("!Error! / toast_master.mobile_list_manager / addNumberSelectorList / !(0 < size)");
			return;
		}
		if( _v.isNotValidStr(call_url) ){
			console.log("!Error! / toast_master.mobile_list_manager / addNumberSelectorList / _v.isNotValidString(call_url)");
			return;
		}
		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addNumberSelectorList / table_jq == null");
			return;
		}

		var number_group_arr = [];
		var number_arr = [];
		//for(var idx = 1; idx <= max_num; idx++) {
		for(var idx = max_num; idx >= 1; idx--) {
			var idx_str = "" + idx;

			if( (idx%size) == 0 || idx == 1 ){

				// 마지막 열이 선택지에서 빠지는 현상을 막음.
				if(idx == 1){
					number_arr.push({__title:idx_str,__call_url:call_url + idx_str});
				}

				// 새로운 그룹이 시작되었습니다.
				if(number_arr.length > 0){
					number_group_arr.push(number_arr);	
					number_arr = [];
				}

				// title row
				var __title =  idx_str + " ~ " + (idx - size + 1);
				number_arr.push({__title:__title,__call_url:""});

			} else if(idx == max_num){

				// 이 구문이 없다면 가장 처음 숫자는 선택항목에 표시되지 않습니다.
				var cur_min_num = parseInt(idx/size) * size + 1;
				var __title = idx_str + " ~ " + cur_min_num;
				number_arr.push({__title:__title,__call_url:""});

			}

			number_arr.push({__title:idx_str,__call_url:call_url + idx_str});
		}

		//__call_url:call_url + idx
		for(var idx = 0; idx < number_group_arr.length; idx++) {
			number_arr = number_group_arr[idx];
			if(_v.isNotValidArray(number_arr)) continue;

			_m_list.addTableContentFolderRow(number_arr, table_jq);
		}

	}
	,addSelectorGroupList:function(target_list, table_jq, delegate_get_group_id, delegate_get_group_title_tag, delegate_get_content_tag, delegate_callback){
		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidArray(target_list)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorList / _v.isNotValidArray(target_list)");
			return;
		}
		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorList / table_jq == null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_get_group_id)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorList / _obj.isNotValidDelegate(delegate_get_group_id)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_get_group_title_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorList / _obj.isNotValidDelegate(delegate_get_group_title_tag)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_get_content_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorList / _obj.isNotValidDelegate(delegate_get_content_tag)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_callback)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorList / _obj.isNotValidDelegate(delegate_callback)");
			return null;
		}

		// group id 별로 그룹을 나눈다.

		// __member_membership: "3"
		// __member_membership_name: "Guest"		
		
		var prev_content_id = -1;
		var content_group_arr = [];
		var content_arr = [];
		for(var idx = 0; idx < target_list.length; idx++) {

			var row_tag = "";
			var content_obj = target_list[idx];
			var group_id = delegate_get_group_id._func.apply(delegate_get_group_id._scope,[content_obj]);

			if(prev_content_id != group_id){
				// 새로운 그룹이 시작되었습니다.
				prev_content_id = group_id;

				if(content_arr.length > 0){
					content_group_arr.push(content_arr);	
					content_arr = [];
				}

				// title row
				var title_tag = delegate_get_group_title_tag._func.apply(delegate_get_group_title_tag._scope,[content_obj]);
				content_arr.push({__tag:title_tag,__call_url:""});
			}

			// content_row
			var content_tag = delegate_get_content_tag._func.apply(delegate_get_content_tag._scope,[content_obj]);
			//var content_url_tag = delegate_callback._func.apply(delegate_callback._scope,[content_obj]);
			content_arr.push({__tag:content_tag,__delegate:delegate_callback,__delegate_data:content_obj});

			// 마지막 멤버쉽을 그룹에 포함시킵니다.
			if(idx == (target_list.length-1)){
				content_group_arr.push(content_arr);
			}
		}	

		for(var idx = 0; idx < content_group_arr.length; idx++) {
			content_arr = content_group_arr[idx];
			if(_v.isNotValidArray(content_arr)) continue;

			_m_list.addTableRowFolder(content_arr, table_jq);
		}
	}	
	,addMemberSelectorList_V2:function(all_member_list, table_jq, delegate_create_title_tag, delegate_create_content_tag, delegate_callback){
		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidArray(all_member_list)){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList_V2 / _v.isNotValidArray(all_member_list)");
			return;
		}
		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList_V2 / table_jq == null");
			return;
		}
		if(delegate_create_title_tag == null){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList_V2 / table_jq == null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_create_title_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList_V2 / _obj.isNotValidDelegate(delegate_create_title_tag)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_create_content_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList_V2 / _obj.isNotValidDelegate(delegate_create_content_tag)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_callback)){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList_V2 / _obj.isNotValidDelegate(delegate_callback)");
			return null;
		}

		// 멤버쉽 별로 그룹을 나눈다.

		// __member_membership: "3"
		// __member_membership_name: "Guest"		
		
		var prev_membership_id = -1;
		var membership_group_arr = [];
		var membership_member_arr = [];
		for(var idx = 0; idx < all_member_list.length; idx++) {

			var row_tag = "";
			var member_obj = all_member_list[idx];
			var membership_id = parseInt(member_obj.__member_membership);
			var membership_name = parseInt(member_obj.__member_membership_name);

			if(prev_membership_id != membership_id){
				// 새로운 그룹이 시작되었습니다.
				prev_membership_id = membership_id;

				if(membership_member_arr.length > 0){
					membership_group_arr.push(membership_member_arr);	
					membership_member_arr = [];
				}

				// title row
				var title_tag = delegate_create_title_tag._func.apply(delegate_create_title_tag._scope,[member_obj]);
				membership_member_arr.push({__tag:title_tag,__call_url:""});
			}

			// member_row
			var content_tag = delegate_create_content_tag._func.apply(delegate_create_content_tag._scope,[member_obj]);

			// var content_url_tag = delegate_callback._func.apply(delegate_create_content_tag._scope,[member_obj]);
			// membership_member_arr.push({__tag:content_tag,__call_url:content_url_tag,__delegate:delegate_callback,__delegate_data:member_obj});

			membership_member_arr.push({__tag:content_tag,__delegate:delegate_callback,__delegate_data:member_obj});

			// 마지막 멤버쉽을 그룹에 포함시킵니다.
			if(idx == (all_member_list.length-1)){
				membership_group_arr.push(membership_member_arr);
			}
		}	

		for(var idx = 0; idx < membership_group_arr.length; idx++) {
			membership_member_arr = membership_group_arr[idx];
			if(_v.isNotValidArray(membership_member_arr)) continue;

			_m_list.addTableRowFolder(membership_member_arr, table_jq);
		}
	}
	/*
		@ Public
		@ Desc : 추가/삭제가 가능한 타이머 테이블을 그립니다.
	*/	
	,add_timer_table_editable:function(title, time_arr, append_target_jq, event_toggle_controller, delegate_on_click_timer_title, delegate_on_click_remove_timer, delegate_on_finish_adding_timer, delegate_on_time_update, meta_data) {

		var row_before_new_timer_jq = null;
		// 외부에서 해당 타이머를 추가해야 할 경우(ex: DB에서 해당 timer 정보를 가져오는 경우.)를 위한 오브젝트.
		var timer_table_controller = {
			row_before_new_timer_jq:null
			, set_row_before_new_timer_jq:function(row_before_new_timer_jq) {
				this.row_before_new_timer_jq = row_before_new_timer_jq;
			}
			, get_row_before_new_timer_jq:function() {
				return this.row_before_new_timer_jq;
			}
			, timer_maker:null
			, set_timer_maker:function(timer_maker) {
				this.timer_maker = timer_maker;
			}
			, get_timer_record_obj:function(is_qualified, meeting_id, member_hash_key, member_name, time_record_millisec, timer_record_id, timer_type_id) {
				// 타이머가 이해할 수 있는 타이머 정보 타입 형식을 가지고 있는 객체를 돌려줍니다.

				// wonder.jung
				if(_v.isNumberStr(is_qualified)) {
					is_qualified = parseInt(is_qualified);
				}
				if(is_qualified == undefined) {
					is_qualified = false;
				} else {
					is_qualified = (is_qualified === 1)?true:false;
				}

				if(_v.isNumberStr(meeting_id)) {
					meeting_id = parseInt(meeting_id);
				} else if(_v.isNotUnsignedNumber(meeting_id)){
					console.log("!Error! / get_timer_record_obj / _v.isNotUnsignedNumber(meeting_id)");
					return;
				}

				if(_v.is_not_valid_str(member_hash_key)){
					member_hash_key = "";
				}

				if(_v.is_not_valid_str(member_name)){
					member_name = _param.NOT_ASSIGNED;
				}

				if(_v.isNumberStr(time_record_millisec)) {
					time_record_millisec = parseInt(time_record_millisec);
				} else if(_v.isNotUnsignedNumber(time_record_millisec)){
					console.log("!Error! / get_timer_record_obj / _v.isNotNumber(time_record_millisec)");
					return;
				}

				if(_v.isNumberStr(timer_record_id)) {
					timer_record_id = parseInt(timer_record_id);
				} else if(_v.isNotUnsignedNumber(timer_record_id)){
					console.log("!Error! / get_timer_record_obj / _v.isNotUnsignedNumber(timer_record_id)");
					return;
				}

				if(_v.isNumberStr(timer_type_id)) {
					timer_type_id = parseInt(timer_type_id);
				} else if(_v.isNotUnsignedNumber(timer_type_id)){
					console.log("!Error! / get_timer_record_obj / _v.isNotUnsignedNumber(timer_type_id)");
					return;
				}

				var timer_record_obj = 
				_param
				.get(_param.IS_QUALIFIED,is_qualified)
				.get(_param.MEETING_ID,meeting_id)
				.get(_param.MEMBER_HASH_KEY,member_hash_key)
				.get(_param.MEMBER_NAME,member_name)
				.get(_param.TIME_RECORD_MILLISEC,time_record_millisec)
				.get(_param.TIMER_RECORD_ID,timer_record_id)
				.get(_param.TIMER_TYPE_ID,timer_type_id)
				.get(_param.IS_DATA_FROM_DB,true)
				;

				return timer_record_obj;

			}
			, add_timer:function(timer_obj) {
				if(this.timer_maker == undefined) {
					return;
				}

				if(timer_obj[_param.IS_QUALIFIED] == undefined) {
					console.log("!Error! / add_timer_table_editable / timer_obj[_param.IS_QUALIFIED] == undefined");
					return;
				}

				if(timer_obj[_param.MEETING_ID] == undefined) {
					console.log("!Error! / add_timer_table_editable / timer_obj[_param.MEETING_ID] == undefined");
					return;
				}

				if(timer_obj[_param.MEMBER_HASH_KEY] == undefined) {
					console.log("!Error! / add_timer_table_editable / timer_obj[_param.MEMBER_HASH_KEY] == undefined");
					return;
				}

				if(timer_obj[_param.TIME_RECORD_MILLISEC] == undefined) {
					console.log("!Error! / add_timer_table_editable / timer_obj[_param.TIME_RECORD_MILLISEC] == undefined");
					return;
				}

				if(timer_obj[_param.TIMER_RECORD_ID] == undefined) {
					console.log("!Error! / add_timer_table_editable / timer_obj[_param.TIMER_RECORD_ID] == undefined");
					return;
				}

				if(timer_obj[_param.TIMER_TYPE_ID] == undefined) {
					console.log("!Error! / add_timer_table_editable / timer_obj[_param.TIMER_TYPE_ID] == undefined");
					return;
				}

				if(this.timer_maker != undefined) {
					this.timer_maker.call_on_click(timer_obj);
				}
			}
		}


		// 타이머를 화면에 그립니다.
		var add_timer = function(time_arr, row_jq, event_toggle_controller, delegate_data_param, meta_data) {

			var MEMBER_NAME = delegate_data_param[_param.MEMBER_NAME];
			if(_v.isNotValidStr(MEMBER_NAME)) {
				MEMBER_NAME = _param.NOT_ASSIGNED;
			}

			var timer_controller = 
			_m_list.addTableRowTimer(
				// time_arr - ( GREEN / YELLOW / RED )
				time_arr
				// title_on_left
				, MEMBER_NAME
				// time_record
				, meta_data[_param.TIME_RECORD_MILLISEC]
				// after_target_jq
				, row_jq
				// delegate_obj_click_row
				, _obj.getDelegate(function(delegate_data){

					console.log(">>> delegate_obj_click_row / delegate_data :: ",delegate_data);

					// EVENT TYPE을 받는 것이 나을것 같은데?
					var target_controller = delegate_data.target_controller;
					var container_jq = target_controller.get_container_jq();

					if(delegate_data.EVENT_TYPE === target_controller.EVENT_TYPE_CLICK_TITLE) {

						console.log(">>> target_controller.EVENT_TYPE_CLICK_TITLE");

						// TODO 왜 2번 눌러야 이벤트 제어가 가능한가? 이슈.
						// 타이틀 버튼을 눌렀을 때의 이벤트 제어

						if(_obj.is_valid_delegate(delegate_on_click_timer_title)) {
							delegate_on_click_timer_title._apply([target_controller]);
						}

						// REMOVE ME
						// 2. 선택한 정보를 DB로 업데이트(외부 delegate 호출)

					} else if(delegate_data.EVENT_TYPE === target_controller.EVENT_TYPE_CLICK_REMOVE) {

						console.log(">>> target_controller.EVENT_TYPE_CLICK_REMOVE");

						// 1. remove from screen
						container_jq.remove();

						// 2. remove data
						if(_obj.is_valid_delegate(delegate_on_click_remove_timer)) {
							delegate_on_click_remove_timer._apply([target_controller]);
						}

					}

				}, this)
				// delegate_obj_on_time_update
				, _obj.getDelegate(function(delegate_data){

					var target_controller = delegate_data.target_controller;

					if(delegate_data.EVENT_TYPE === target_controller.EVENT_TYPE_START_TIMER) {

						event_toggle_controller.off();

					} else if(delegate_data.EVENT_TYPE === target_controller.EVENT_TYPE_STOP_TIMER) {

						event_toggle_controller.on();

						if(_obj.is_valid_delegate(delegate_on_time_update)) {
							delegate_on_time_update._apply([target_controller]);
						}

					}

				}, this)
				// delegate_data
				, delegate_data_param
			);

			event_toggle_controller.push(timer_controller);

			// 다음에 추가될 타이머의 위의 테이블 열의 참조.
			// 다음 타이머는 이 참조 열 아래 붙입니다.
			timer_table_controller.set_row_before_new_timer_jq(timer_controller.get_container_jq());

			// 외부 메타데이터 추가 
			timer_controller.add_meta_data(meta_data);

			return timer_controller;
		}		

		// 타이머 추가 버튼을 화면에 그립니다.
		var add_timer_btn_controller = 
		_m_list.addTableRowBtn(
			// title
			title
			// color
			, null
			// delegate_obj
			, _obj.getDelegate(function(delegate_data, accessor){

				if(timer_table_controller.get_row_before_new_timer_jq() == undefined) {
					timer_table_controller.set_row_before_new_timer_jq(accessor.get_target_jq());
				}

				var param_obj = undefined;
				if(delegate_data.IS_DATA_FROM_DB === true) {

					param_obj = 
					_param
					.get(_param.IS_DATA_FROM_DB, delegate_data.IS_DATA_FROM_DB)
					.get(_param.IS_QUALIFIED, delegate_data.IS_QUALIFIED)
					.get(_param.MEETING_ID, delegate_data.MEETING_ID)
					.get(_param.MEMBER_HASH_KEY, delegate_data.MEMBER_HASH_KEY)
					.get(_param.MEMBER_NAME, delegate_data.MEMBER_NAME)
					.get(_param.TIMER_RECORD_ID, delegate_data.TIMER_RECORD_ID)
					.get(_param.TIMER_TYPE_ID, delegate_data.TIMER_TYPE_ID)
					.get(_param.TIME_RECORD_MILLISEC, delegate_data.TIME_RECORD_MILLISEC)
					.get(_param.ACCESSOR, accessor)
					;
					
				} else if(delegate_data.IS_DATA_FROM_DB === false) {

					if(!confirm("Add New One?")){
						return;
					}

					param_obj = 
					_param
					.get(_param.IS_DATA_FROM_DB, delegate_data.IS_DATA_FROM_DB)
					.get(_param.IS_QUALIFIED, false)
					.get(_param.MEETING_ID, delegate_data.MEETING_ID)
					.get(_param.MEMBER_NAME, _param.NOT_ASSIGNED)
					.get(_param.TIMER_TYPE_ID, delegate_data.TIMER_TYPE_ID)
					.get(_param.ACCESSOR, accessor)
					;

				} else {
					console.log("!Error! / delegate_data.IS_DATA_FROM_DB is not valid!");
					return;
				}


				if(param_obj != undefined) {
					var meta_data = delegate_data;

					var timer_controller = 
					add_timer(
						// time_arr
						time_arr
						// row_jq
						, timer_table_controller.get_row_before_new_timer_jq()
						// event_toggle_controller
						, event_toggle_controller
						// delegate_data_param
						, param_obj
						// meta_data
						, meta_data
					);

					if(_obj.is_valid_delegate(delegate_on_finish_adding_timer)) {
						delegate_on_finish_adding_timer._apply([timer_controller]);
					}
				}

			}, this)
			// append_target_jq
			, table_jq
			// delegate_data
			, meta_data
		);

		if(event_toggle_controller != undefined) {
			event_toggle_controller.push(add_timer_btn_controller);
		}

		// 처음에 타이머를 붙일 대상을 추가 버튼의 참조로 정함.
		timer_table_controller.set_row_before_new_timer_jq(add_timer_btn_controller.get_target_jq());

		// 외부에서 타이머를 추가할 수 있도록 timer maker를 지정.
		timer_table_controller.set_timer_maker(add_timer_btn_controller);

		return timer_table_controller;
	}
	// REMOVE ME
	/*
	,addMemberSelectorList:function(target_list, table_jq){

		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidArray(target_list)){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList / _v.isNotValidArray(target_list)");
			return;
		}
		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addMemberSelectorList / table_jq == null");
			return;
		}


		// 멤버쉽 별로 그룹을 나눈다.

		// __member_membership: "3"
		// __member_membership_name: "Guest"		
		
		var prev_membership_id = -1;
		var membership_group_arr = [];
		var membership_member_arr = [];
		for(var idx = 0; idx < target_list.length; idx++) {

			var row_tag = "";
			var member_obj = target_list[idx];
			var membership_id = parseInt(member_obj.__member_membership);
			var membership_name = parseInt(member_obj.__member_membership_name);

			if(prev_membership_id != membership_id){
				// 새로운 그룹이 시작되었습니다.
				prev_membership_id = membership_id;

				if(membership_member_arr.length > 0){
					membership_group_arr.push(membership_member_arr);	
					membership_member_arr = [];
				}

				// title row
				membership_member_arr.push({__title:member_obj.__member_membership_name,__call_url:""});
			}

			// member_row
			var member_name = member_obj.__member_first_name + " " + member_obj.__member_last_name;

			var __call_url = cur_link_manager.get_link(cur_link_manager.MOBILE_MEMBER_MANAGE_DETAIL,{__member_id:member_obj.__member_id});
			membership_member_arr.push({__title:member_name,__call_url:__call_url});

			// 마지막 멤버쉽을 그룹에 포함시킵니다.
			if(idx == (target_list.length-1)){
				membership_group_arr.push(membership_member_arr);
			}
		}	

		for(var idx = 0; idx < membership_group_arr.length; idx++) {
			membership_member_arr = membership_group_arr[idx];
			if(_v.isNotValidArray(membership_member_arr)) continue;

			_m_list.addTableContentFolderRow(membership_member_arr, table_jq);
		}

	}
	*/
	// REMOVE ME
	/*
	,addSelectorGroupDepthList:function(target_list, group_depth_names_arr, table_jq, delegate_get_group_id, delegate_get_group_title_tag, delegate_get_content_tag, delegate_get_call_url_tag){
		var _v = airborne.validator;
		var _m_list = airborne.bootstrap.view.mobile.list;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidArray(target_list)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorGroupDepthList / _v.isNotValidArray(target_list)");
			return;
		}
		if(_v.isNotValidArray(group_depth_names_arr)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorGroupDepthList / _v.isNotValidArray(group_depth_names_arr)");
			return;
		}
		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorGroupDepthList / table_jq == null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_get_group_id)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorGroupDepthList / _obj.isNotValidDelegate(delegate_get_group_id)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_get_group_title_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorGroupDepthList / _obj.isNotValidDelegate(delegate_get_group_title_tag)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_get_content_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorGroupDepthList / _obj.isNotValidDelegate(delegate_get_content_tag)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_get_call_url_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addSelectorGroupDepthList / _obj.isNotValidDelegate(delegate_get_call_url_tag)");
			return null;
		}

		// group id 별로 그룹을 나눈다.

		// __member_membership: "3"
		// __member_membership_name: "Guest"		
		
		var prev_content_id = -1;
		var content_group_arr = [];
		var content_arr = [];
		var get_recursive_group = function(){







			return null;
		}
	}
	*/
	/*
		@ public
		@ desc : 브라우저 로딩 완료시 화면 움직임 현상이 보이지 않도록 문서가 준비되면 fade in 및 bootstrap 로딩 완료 메시지를 제거한다. (공통 로직)
	*/	
	, doWhenDocumentReady:function(delegate_obj) {

		$( "body" ).css("opacity","0");
		$( document ).ready(function() {

			setTimeout(function(){ 
				$( "body" ).css("opacity",".5");
				$( "body" ).animate({opacity:1}, _param.SEC_BODY_FADE_IN_ON_READY);
			}, _param.SEC_BODY_FADE_IN_ON_READY);

			$("div.ui-loader").hide();

			if(_obj.isValidDelegate(delegate_obj)) {
				delegate_obj._func.apply(delegate_obj._scope,[]);
			}

		});
	}
	/*
		@ public
		@ desc : 화면 전환시, 현재의 화면을 가린다.
	*/	
	, hideDocument:function() {

		$( "body" ).css("opacity","0");

	}
}