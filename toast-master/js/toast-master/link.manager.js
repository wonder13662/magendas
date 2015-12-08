var link_manager = {
	init:function(root_path, airborne_server, toast_master_param_manager){
		this.set_root_path(root_path);
		this.set_airborne_server(airborne_server);
		this.set_toast_master_param_manager(toast_master_param_manager);
		return this;
	}
	,root_path:""
	,set_root_path:function(root_path){
		this.root_path = root_path;
	}
	,get_root_path:function(){
		return this.root_path;	
	}
	,airborne_server:null
	,set_airborne_server:function(airborne_server){
		this.airborne_server = airborne_server;
	}
	,get_airborne_server:function(){
		return this.airborne_server;
	}
	,toast_master_param_manager:null
	,set_toast_master_param_manager:function(toast_master_param_manager){
		this.toast_master_param_manager = toast_master_param_manager;
	}
	,get_toast_master_param_manager:function(){
		return this.toast_master_param_manager;
	}
	// @ private
	,call_url_get:function(link, param_obj){
		if(this.get_airborne_server() != null) {
			this.get_airborne_server().call_url_get(link,param_obj);
		}
	}
	// @ private
	,get_url_with_params:function(link, param_obj){
		if(this.get_airborne_server() != null) {
			return this.get_airborne_server().get_url_with_params(link, param_obj);
		}
		return link;
	}

	,LOG_IN:"/view/log_in.php"
	,LOG_OUT:"/view/log_out.php"
	,MEMBERSHIP_PICKER:"/view/membership_picker.php"

	,MEETING_AGENDA:"/view/meeting_agenda.php"
	,MEMBER_MANAGE:"/view/member_manage.php"

	,MOBILE_TOP:"/view/mobile/top.php"

	,MOBILE_MEETING_AGENDA_LIST:"/view/mobile/meeting_agenda_list.php"
	,MOBILE_ROLE_SIGN_UP_LIST:"/view/mobile/role_sign_up.php"
	,MOBILE_MEETING_AGENDA_DETAIL:"/view/mobile/meeting_agenda_detail.php"
	,MOBILE_MEETING_AGENDA_DETAIL_ADD_NEW_ONE:"/view/mobile/meeting_agenda_detail_add_new_one.php"
	,MOBILE_MEETING_AGENDA_DETAIL_ROLE:"/view/mobile/meeting_agenda_detail_roles.php"
	,MOBILE_MEETING_AGENDA_DETAIL_NEWS:"/view/mobile/meeting_agenda_detail_news.php"
	,MOBILE_MEETING_AGENDA_DETAIL_SPEECH:"/view/mobile/meeting_agenda_detail_speech.php"
	,MOBILE_MEETING_TIMER:"/view/mobile/meeting_timer.php"
	//,MOBILE_MEETING_VOTING:"/view/mobile/meeting_voting.php"
	,MOBILE_HELP_LIST:"/view/mobile/help.php"

	,MOBILE_MEMBER_MANAGE:"/view/mobile/member_manage.php"
	,MOBILE_MEMBER_MANAGE_DETAIL:"/view/mobile/member_manage_detail.php"
	
	,PDF_VIEWER:"/view/meeting_agenda_pdf.php"

	,API_LOG_IN:"/api/ajax_post_log_in.php"
	,API_COOKIE:"/api/ajax_post_cookie.php"
	,API_UPDATE_MEETING_AGENDA:"/api/ajax_post_update_meeting_agenda.php"
	,API_UPDATE_MEMBER:"/api/ajax_post_update_member.php"
	,API_SELECT_MEMBER:"/api/ajax_post_select_member.php"
	,API_UPDATE_TIMER:"/api/ajax_post_update_timer.php"
	,API_JESSIE:"/api/ajax_post_jessie.php"

	,IMG_TM_MY_BANNER:"/images/MaroonandYellowBanner.jpg"
	,IMG_SHARE_KAKAO_TM_LONG_BANNER:"/images/Share_kakao_TMBanner_200_200.png"
	,IMG_SHARE_KAKAO_TM_RIBBONS:"/images/ribbons.jpg"

	,go_there:function(type, param_obj){
		if(param_obj == null) {
			window.location.href = this.get_link(type);
		} else {
			this.call_url_get(this.get_link(type),param_obj);	
		}
	}
	,open_new_window:function(type, param_obj){
		if(param_obj == null) {
			window.open(this.get_link(type));
		} else {
			window.open(this.get_link(type, param_obj));
		}
	}
	,get_link:function(type, param_obj){
		var link = this.get_root_path() + type;

		if(param_obj != null) {
			return this.get_url_with_params(link, param_obj);
		}
		return link;
	}
	// @ Desc : 페이지 진입 단계를 표시할 타이틀과 링크 정보를 줍니다.
	,get_header_link:function(link, param_obj){

		var _param = this.get_toast_master_param_manager();

		if(_param == undefined) {
			console.log("Error! / get_header_link / _param == undefined");
			return;
		}

		if(param_obj == undefined) {
			param_obj = {};
		}

		// TODO to switch statement.
		if(_link.MOBILE_TOP === link) {

			return {__title:_param.PAGE_TOP, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_AGENDA_LIST === link) {

			return {__title:_param.PAGE_MEETING_AGENDA_LIST, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_ROLE_SIGN_UP_LIST === link) {

			return {__title:_param.PAGE_ROLE_SIGN_UP_LIST, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_AGENDA_DETAIL_ADD_NEW_ONE === link) {

			return {__title:_param.PAGE_NEW_MEETING_AGENDA, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_AGENDA_DETAIL === link) {

			return {__title:_param.PAGE_MEETING_AGENDA, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_AGENDA_DETAIL === link) {

			return {__title:_param.PAGE_MEETING_AGENDA, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_AGENDA_DETAIL_ROLE === link) {

			return {__title:_param.PAGE_ROLES, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_AGENDA_DETAIL_NEWS === link) {

			return {__title:_param.PAGE_CLUB_NEWS, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH === link) {

			return {__title:_param.PAGE_PREPARED_SPEECH, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEMBER_MANAGE === link) {

			return {__title:_param.PAGE_MEMBERS, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEMBER_MANAGE_DETAIL === link) {

			return {__title:_param.PAGE_MEMBER_DETAIL, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEMBER_ACHIEVEMENT === link) {

			return {__title:_param.PAGE_MEMBER_ACHIEVEMENT, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_MEETING_TIMER === link) {

			return {__title:_param.PAGE_MEETING_TIMER, __call_url:this.get_link(link,param_obj)};

		} else if(_link.MOBILE_HELP_LIST === link) {

			return {__title:_param.PAGE_HELP, __call_url:this.get_link(link,param_obj)};

		}

	}
}