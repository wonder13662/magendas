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