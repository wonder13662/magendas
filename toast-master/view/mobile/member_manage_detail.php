<?php

// common setting
include_once("../../common.inc");

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
	$membership_obj = $membership_obj_arr[0];
}

// 로그인 되어 있지 않으면 로그인 페이지로!
if($login_user_info->__is_login==$params->NO){
	ToastMasterLinkManager::go(ToastMasterLinkManager::$LOG_IN);
}

// COMMON PROPS
$MEMBER_HASH_KEY = $params->getParamString($params->MEMBER_HASH_KEY, "");
$__all_member_list = $wdj_mysql_interface->getMemberList($MEETING_MEMBERSHIP_ID);
$__membership_list = $wdj_mysql_interface->getMemberShipList();

// GET MEMBER CLUB ACHIEVMENTS
if(!empty($MEMBER_HASH_KEY)) {
	$selected_member_arr = $wdj_mysql_interface->getMember($MEMBER_HASH_KEY);	
	$selected_member_obj = $selected_member_arr[0];
}

if(!is_null($selected_member_obj)) {

	$MEMBER_ID = $selected_member_obj->__member_id;

	// 1. 스피치 기록
	$speech_history = $wdj_mysql_interface->get_speech_history($MEETING_MEMBERSHIP_ID, $MEMBER_ID);
	// 2. 이벨류에이터 기록
	$evaluation_history = $wdj_mysql_interface->get_evaluation_history($MEETING_MEMBERSHIP_ID, $MEMBER_ID);
	// 3. 롤별 기록
	$role_id_toastmaster = 2;
	$role_history_toastmaster = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_toastmaster, $MEMBER_ID);

	$role_id_word_n_quote_master = 4;
	$role_history_word_n_quote_master = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_word_n_quote_master, $MEMBER_ID);

	$role_id_table_topic_master = 5;
	$role_history_table_topic_master = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_table_topic_master, $MEMBER_ID);

	$role_id_mini_debate_master = 6;
	$role_history_mini_debate_master = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_mini_debate_master, $MEMBER_ID);

	$role_id_general_evaluator = 7;
	$role_history_general_evaluator = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_general_evaluator, $MEMBER_ID);

	$role_id_grammarian = 11;
	$role_history_grammarian = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_grammarian, $MEMBER_ID);

	$role_id_ah_counter = 10;
	$role_history_ah_counter = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_ah_counter, $MEMBER_ID);

	$role_id_timer = 9;
	$role_history_timer = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_timer, $MEMBER_ID);
}


// @ required
$wdj_mysql_interface->close();
?>


<html>
<head>
<?php
// @ required
include_once("../../common.js.inc");
$view_render_var_arr = array("[__ROOT_PATH__]"=>$service_root_path);
ViewRenderer::render("$file_root_path/template/head.include.toast-master.mobile.template",$view_render_var_arr);	
?>
</head>






<body role="document">
<table class="table" style="margin-bottom:0px;">

	<tbody id="list">

	</tbody>
	
</table>
<script>

// php to javascript sample
var MEMBER_ID = <?php echo json_encode($MEMBER_ID);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;
var membership_obj = <?php echo json_encode($membership_obj);?>;

console.log(">>> membership_obj :: ",membership_obj);

var __all_member_list = <?php echo json_encode($__all_member_list);?>;
var selected_member_arr = <?php echo json_encode($selected_member_arr);?>;
var __membership_list = <?php echo json_encode($__membership_list);?>;

console.log(">>> selected_member_arr :: ",selected_member_arr);

var speech_history = <?php echo json_encode($speech_history);?>;
var evaluation_history = <?php echo json_encode($evaluation_history);?>;
var role_history_toastmaster = <?php echo json_encode($role_history_toastmaster);?>;
var role_history_word_n_quote_master = <?php echo json_encode($role_history_word_n_quote_master);?>;
var role_history_table_topic_master = <?php echo json_encode($role_history_table_topic_master);?>;
var role_history_mini_debate_master = <?php echo json_encode($role_history_mini_debate_master);?>;
var role_history_general_evaluator = <?php echo json_encode($role_history_general_evaluator);?>;
var role_history_grammarian = <?php echo json_encode($role_history_grammarian);?>;
var role_history_ah_counter = <?php echo json_encode($role_history_ah_counter);?>;
var role_history_timer = <?php echo json_encode($role_history_timer);?>;

console.log(">>> selected_member_arr :: ",selected_member_arr);



var __member_obj = null;
if(_v.isValidArray(selected_member_arr)){
	__member_obj = selected_member_arr[0];
}


// Header - Log In Treatment
var table_jq = $("table tbody#list");
_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// membership_obj
	, membership_obj
	// header_arr 
	,[
		_link.get_header_link(
			_link.MOBILE_MEMBER_MANAGE_DETAIL
			,_param
			.get(_param.MEMBER_ID, MEMBER_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)			
		)
		,_link.get_header_link(
			_link.MOBILE_MEMBER_MANAGE
			,_param
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)			
		)
		,_link.get_header_link(
			_link.MOBILE_TOP
			,_param
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		)
	]
	// table_jq
	,table_jq
);
// Body - Content



var row_tag = "";
var selected_color = "color:#FFFFFF;background-color:#33CC99;";

console.log(">>> __member_obj :: ",__member_obj);

// __member_office
var __member_membership_status = _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE;
var __member_id = -1;
var __member_hash_key = "";
var __member_first_name = "";
var __member_last_name = "";
var __member_membership_id = -1;
var __member_email = "";
if(__member_obj != undefined){

	__member_membership_status = __member_obj.__member_membership_status;
	__member_id = __member_obj.__member_id;
	__member_hash_key = __member_obj.__member_hash_key;
	__member_first_name = __member_obj.__member_first_name;
	__member_last_name = __member_obj.__member_last_name;
	__member_membership_id = __member_obj.__member_membership;
	__member_email = __member_obj.__member_email;

}







// 0. TITLE - "MEMBER PROFILE"
var title_for_profile = "PROFILE";
if(__member_obj == undefined) {
	// 신규 멤버 입력시의 타이틀
	title_for_profile = "NEW MEMBER PROFILE";
}
_m_list.addTableRowTitle(
	// title
	title_for_profile
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, _obj.getDelegate(function(self_obj){

		console.log(">>> self_obj : ",self_obj);

	}, this)
);







// 1. member name
var accessor_member_name = 
_m_list.addTableRowMultipleTextInputInline(
	// title
	"Name"
	// append_target_jq
	,table_jq
	// place holder
	,["First name","Last name"]
	// value
	, [__member_first_name, __member_last_name]
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

		if(__member_obj == undefined) {
			// 멤버 정보를 가져오지 못한 경우 - 신규 멤버 입력시, 업데이트를 중단합니다.
			return;	
		}

		var target_jq = accessor.get_target_jq();

		var cur_id = target_jq.attr("id");

		console.log(">>> cur_id :: ",cur_id);

		var param_obj = accessor.get_param_obj();
		var MEETING_MEMBERSHIP_ID = parseInt(param_obj.MEETING_MEMBERSHIP_ID);
		var MEMBER_ID = parseInt(param_obj.MEMBER_ID);		
		var MEMBER_HASH_KEY = param_obj.MEMBER_HASH_KEY;

		if("input_name_0" === cur_id) {
			// first name
			console.log("first name");
			var MEMBER_FIRST_NAME = accessor.get();
			if(_v.is_not_valid_str(MEMBER_FIRST_NAME)) {
				console.log("!STOP! / MEMBER_FIRST_NAME is not valid!");
				return;	
			}

			var prev_first_name = param_obj[_param.MEMBER_FIRST_NAME];
			if(prev_first_name === MEMBER_FIRST_NAME) {
				console.log("!STOP! / MEMBER_FIRST_NAME does not changed at all!");
				return;	
			}

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEMBER)
				// _param_obj / MEETING_ID
				, _param
				.get(_param.IS_UPDATE_MEMBER_FIRST_NAME,_param.YES)
				.get(_param.MEMBER_HASH_KEY,MEMBER_HASH_KEY)
				.get(_param.MEMBER_FIRST_NAME,MEMBER_FIRST_NAME)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(data);
						console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

						alert("Updated!");

					},
					// delegate_scope
					this
				)
			); // ajax done.

		} else if("input_name_1" === cur_id) {

			// last name
			console.log("last name");
			var MEMBER_LAST_NAME = accessor.get();
			if(_v.is_not_valid_str(MEMBER_LAST_NAME)) {
				console.log("!STOP! / MEMBER_LAST_NAME is not valid!");
				return;	
			}

			var prev_last_name = param_obj[_param.MEMBER_LAST_NAME];
			if(prev_last_name === MEMBER_LAST_NAME) {
				console.log("!STOP! / MEMBER_LAST_NAME does not changed at all!");
				return;	
			}

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEMBER)
				// _param_obj / MEETING_ID
				, _param
				.get(_param.IS_UPDATE_MEMBER_LAST_NAME,_param.YES)
				.get(_param.MEMBER_HASH_KEY,MEMBER_HASH_KEY)
				.get(_param.MEMBER_LAST_NAME,MEMBER_LAST_NAME)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(data);
						console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

					},
					// delegate_scope
					this
				)
			); // ajax done.

		}

	}, this)
	// param_obj
	, _param
	.get(_param.MEMBER_HASH_KEY,__member_hash_key)
	.get(_param.MEMBER_FIRST_NAME,__member_first_name)
	.get(_param.MEMBER_LAST_NAME,__member_last_name)
);
if(__member_obj == undefined) {
	accessor_member_name.off();
}










// 2. member status - 신규 입사자 등록시에는 노출하지 않습니다.
if(__member_obj != undefined) {

	var member_status_toggle =
	_m_list.addTableRowToggle(
		// title
		"Status"
		// toggle_on_n_off
		, (__member_membership_status === _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE)?true:false
		// append_target_jq
		, table_jq
		// text_color
		, null
		// bg_color
		, null
		// delegate_on_click
		, _obj.getDelegate(function(delegate_data){


			var MEETING_MEMBERSHIP_ID = parseInt(delegate_data.MEETING_MEMBERSHIP_ID);
			var MEMBER_ID = parseInt(delegate_data.MEMBER_ID);
			var checked = delegate_data.checked;

			var MEMBER_MEMBERSHIP_STATUS = _param.MEMBER_MEMBERSHIP_STATUS_AVAILABLE;
			if(!checked) {
				MEMBER_MEMBERSHIP_STATUS = _param.MEMBER_MEMBERSHIP_STATUS_SLEEPING;
			}

			// 이상이 없다면 업데이트!
			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEMBER)
				// _param_obj / MEETING_ID
				, _param
				.get(_param.IS_UPDATE_MEMBER_MEMBERSHIP_STATUS,_param.YES)
				.get(_param.MEETING_MEMBERSHIP_ID,MEETING_MEMBERSHIP_ID)
				.get(_param.MEMBER_ID,MEMBER_ID)
				.get(_param.MEMBER_MEMBERSHIP_STATUS,MEMBER_MEMBERSHIP_STATUS)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(data);
						console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

						alert("Updated!");

					},
					// delegate_scope
					this
				)
			); // ajax done.



		}, this)
		// delegate_data
		, _param
		.get(_param.MEMBER_ID,__member_id)
		.get(_param.MEETING_MEMBERSHIP_ID,parseInt(__member_membership_id))
	);

}














// 3. Member email
var accessor_member_email =
_m_list.addTableRowTextInputInline(
	// title
	"Email"
	// append_target_jq
	,table_jq
	// place holder
	,"Email"
	// value
	, __member_email
	// delegate_on_blur
	, _obj.getDelegate(function(accessor){

		if(__member_obj == undefined) {
			// 멤버 정보를 가져오지 못한 경우 - 신규 멤버 입력시, 업데이트를 중단합니다.
			return;	
		}

		var MEMBER_EMAIL = accessor.get();
		var param_obj = accessor.get_param_obj();
		var MEETING_MEMBERSHIP_ID = parseInt(param_obj.MEETING_MEMBERSHIP_ID);
		var MEMBER_HASH_KEY = param_obj.MEMBER_HASH_KEY;

		var prev_email = param_obj[_param.MEMBER_EMAIL];

		if(_v.is_not_valid_str(MEMBER_EMAIL)) {
			console.log("!STOP! / MEMBER_EMAIL is not valid!");
			return;	
		}

		if(prev_email === MEMBER_EMAIL) {
			console.log("!STOP! / MEMBER_EMAIL does not changed at all!");
			return;	
		}

		// 이상이 없다면 업데이트!
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_MEMBER)
			// _param_obj / MEETING_ID
			, _param
			.get(_param.IS_UPDATE_MEMBER_EMAIL,_param.YES)
			.get(_param.MEETING_MEMBERSHIP_ID,MEETING_MEMBERSHIP_ID)
			.get(_param.MEMBER_HASH_KEY,MEMBER_HASH_KEY)
			.get(_param.MEMBER_EMAIL,MEMBER_EMAIL)

			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(data);
					console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

					alert("Updated!");

				},
				// delegate_scope
				this
			)
		); // ajax done.


	}, this)
	// param_obj
	, _param
	.get(_param.MEMBER_HASH_KEY,__member_hash_key)
	.get(_param.MEETING_MEMBERSHIP_ID,parseInt(__member_membership_id))
	.get(_param.MEMBER_EMAIL,__member_email)
);

















//     dMMMMb dMMMMMMP dMMMMb        dMP dMP dMP dMMMMMP dMP    .aMMMb  .aMMMb  dMMMMMMMMb  dMMMMMP 
//    dMP"dMP   dMP   dMP dMP       dMP dMP dMP dMP     dMP    dMP"VMP dMP"dMP dMP"dMP"dMP dMP      
//   dMMMMK"   dMP   dMP dMP       dMP dMP dMP dMMMP   dMP    dMP     dMP dMP dMP dMP dMP dMMMP     
//  dMP.aMF   dMP   dMP dMP       dMP.dMP.dMP dMP     dMP    dMP.aMP dMP.aMP dMP dMP dMP dMP        
// dMMMMP"   dMP   dMP dMP        VMMMPVMMP" dMMMMMP dMMMMMP VMMMP"  VMMMP" dMP dMP dMP dMMMMMP     

if(__member_obj == undefined) {

	// 새로운 회원을 등록하는 경우에만 버튼을 노출합니다.
	_m_list.addTableRowBtn(
		// title
		"Welcome!"
		// color
		, null
		// delegate_obj
		, _obj.getDelegate(function(){

			// 1. member name을 검사합니다.
			var first_name_jq = accessor_member_name.get_input_jq(0);
			var first_name = first_name_jq.val();
			if(_v.is_not_valid_str(first_name)) {
				alert("Your first name is empty.");
				first_name_jq.focus();
				return;
			}

			var last_name_jq = accessor_member_name.get_input_jq(1);
			var last_name = last_name_jq.val();
			if(_v.is_not_valid_str(last_name)) {
				alert("Your last name is empty.");
				last_name_jq.focus();
				return;
			}

			// 2. member e-mail을 검사합니다.
			var member_email = accessor_member_email.get();
			if(_v.is_not_valid_str(member_email)) {
				alert("Your email is empty.");
				accessor_member_email.get_target_jq().focus();
				return;
			}

			// TODO 
			// 2-1. 메일 형식을 검사합니다.
			if(_v.is_not_valid_email(member_email)) {
				alert("Your email is not valid.");

				accessor_member_email.get_target_jq().focus();
				return;
			}

			// 3. 가져온 정보로 동일한 이름, 동일한 이메일이 없는지 검사합니다.
			var cur_param_obj_for_insert_new_member = 
			_param
			.get(_param.IS_INSERT_MEMBER, _param.YES)
			.get(_param.MEMBER_FIRST_NAME, first_name)
			.get(_param.MEMBER_LAST_NAME, last_name)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			.get(_param.MEMBER_EMAIL, member_email)
			;

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_SELECT_MEMBER)
				// _param_obj
				, _param
				.get(_param.IS_SELECT_MEMBER, _param.YES)
				.get(_param.MEMBER_EMAIL, member_email)
				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data, delegate_param){

						// console.log(">>> data :: ",data);
						

						var cur_member_n_membership_arr;
						if(data != undefined && _v.is_valid_array(data.query_output_arr)) {
							cur_member_n_membership_arr = data.query_output_arr[0];
						}

						if(_v.is_not_valid_array(cur_member_n_membership_arr)) {

							console.log("Not registered user.");
							console.log(">>> delegate_param :: ",delegate_param);

							// 1. 해당 멤버가 멤버 정보에 없는 경우 - 새로 등록.
							var cur_param_obj_for_insert_new_member = delegate_param;

							_ajax.send_simple_post(
								// _url
								_link.get_link(_link.API_UPDATE_MEMBER)
								// _param_obj
								, cur_param_obj_for_insert_new_member
								// _delegate_after_job_done
								,_obj.get_delegate(
									// delegate_func
									function(data){

										console.log(">>> data :: ",data);

										var cur_member_n_membership_arr;
										if(data != undefined && _v.is_valid_array(data.query_output_arr)) {
											cur_member_n_membership_arr = data.query_output_arr[0];
										}

										// TODO
										// 1. 해당 멤버가 멤버 정보에 없는 경우 - 새로 등록.
										// 2. 해당 멤버가 멤버 정보는 있지만, 현재 클럽에는 등록되지 않은 경우 - 이 클럽에도 등록 - 유저에게 가이드 필요.

										console.log(">>> cur_member_n_membership_arr :: ",cur_member_n_membership_arr);

										/*
										if(cur_member_n_membership != undefined) {
											alert("Member is already exist!");
											return;
										} else {
											insert_new_member(cur_param_obj_for_insert_new_member);
										}
										*/


									},
									// delegate_scope
									this
								)
							);	// ajax end	

							return;
						}






						// TODO
						
						// 2. 해당 멤버가 멤버 정보는 있지만, 현재 클럽에는 등록되지 않은 경우 - 이 클럽에도 등록 - 유저에게 가이드 필요.
						var club_member_obj = null;
						for(var idx = 0;idx < cur_member_n_membership_arr.length;idx++) {
							var cur_member_n_membership_obj = cur_member_n_membership_arr[idx];
							var cur_member_membership_id = parseInt(cur_member_n_membership_obj.__member_membership);

							if( cur_member_membership_id === MEETING_MEMBERSHIP_ID) {
								// 2-1. 현재 클럽에 이미 등록되어 있는 멤버
								club_member_obj = cur_member_n_membership_obj;

								console.log(">>> club_member_obj :: ",club_member_obj);

								var msg_alert = 
								"Already registered email.\n\n<EMAIL> is\nthe member of <CLUB>"
								.replace(/\<EMAIL\>/gi, member_email)
								.replace(/\<CLUB\>/gi, membership_obj.__membership_desc)
								;

								if(confirm(msg_alert)) {
									console.log("Focus on email");
									return;
								}
								break;
							}
						}
						if(club_member_obj == undefined) {
							// 2-2. 등록된 멤버이지만 현재 클럽에는 등록되어 있지 않습니다.
							console.log("Already registered member.\nHowever not member in this club\n");

							// 해당 클럽에 멤버를 등록시킵니다.
						}


						/*
						if(cur_member_n_membership != undefined) {
							alert("Member is already exist!");
							return;
						} else {

							console.log(">>> cur_param_obj_for_insert_new_member :: ",cur_param_obj_for_insert_new_member);

							//insert_new_member(cur_param_obj_for_insert_new_member);
						}
						*/


					},
					// delegate_scope
					this
				)
				// _delegate_param
				, cur_param_obj_for_insert_new_member
			);	// ajax end	


			// 3-1. 동일한 이름, 동일한 이메일이 발견된다면 해당 멤버 정보를 현재 클럽으로 추가합니다.
			// 입력하는 사용자에게 안내합니다.

			// 3-2. 이미 등록된 유저이고 현재 클럽에 등록된 유저라면 중단.
			// 입력하는 사용자에게 안내합니다.

			// 4. 이상이 없다면 멤버 정보를 추가합니다.

		}, this)
		// append_target_jq
		, table_jq
	);

}
















//     .aMMMb  .aMMMb  dMP dMP dMP dMMMMMP dMP dMP dMMMMMP dMMMMMMMMb  dMMMMMP dMMMMb dMMMMMMP 
//    dMP"dMP dMP"VMP dMP dMP amr dMP     dMP dMP dMP     dMP"dMP"dMP dMP     dMP dMP   dMP    
//   dMMMMMP dMP     dMMMMMP dMP dMMMP   dMP dMP dMMMP   dMP dMP dMP dMMMP   dMP dMP   dMP     
//  dMP dMP dMP.aMP dMP dMP dMP dMP      YMvAP" dMP     dMP dMP dMP dMP     dMP dMP   dMP      
// dMP dMP  VMMMP" dMP dMP dMP dMMMMMP    VP"  dMMMMMP dMP dMP dMP dMMMMMP dMP dMP   dMP       


if(__member_obj != undefined) {

	// 유저 정보가 있는 경우에만 표시합니다.

	// 4. MEMBER ACHIEVMENTS
	_m_list.addTableRowTitle(
		// title
		"ACHIEVMENTS"
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(self_obj){

			console.log(">>> self_obj : ",self_obj);

		}, this)
	);

	var set_role_history_row = function(self_jq, row_id, history_obj_arr, key_for_left, key_for_right) {

		var history_row_jq_arr = self_jq.parent().find("tr#"+ row_id);

		if(history_row_jq_arr.length == 0) {
			// 세부 내역 리스트가 없다면 화면에 그립니다.
			for(var idx = (history_obj_arr.length-1); -1 < idx; idx--) {
				var history_obj = history_obj_arr[idx];
				var tag = "";
				tag += ""
				+ "<tr id=\"<_v>\" style=\"color:#c0c0c0;background-color:#FFF;\">".replace(/\<_v\>/gi, row_id)
					+ "<td class=\"text-left\">"
						+ "<span class=\"badge no_selection\" style=\"color:#FFF;background-color:#CCC;float:right;\"><_v></span>".replace(/\<_v\>/gi, history_obj[key_for_left])
						+ "<span style=\"font-size:13px;color:#AAA;float:left\"><_v></span>".replace(/\<_v\>/gi, history_obj[key_for_right])
					+ "</td>"
				+ "</tr>"
				; 

				self_jq.after(tag);
			}

			history_row_jq_arr = self_jq.parent().find("tr#"+ row_id);
		}

		var is_open = self_jq.attr("is_open");
		if(is_open == _param.YES) {
			self_jq.attr("is_open", _param.NO);
			
			// 롤의 세부 내역을 가리고 리스트 최상단으로 이동합니다.
			var body = $("html, body");
			history_row_jq_arr.hide();
			body.stop().animate({scrollTop:0}, _param.SEC_ANIMATE_SCROLL, 'swing', function() { 
			   console.log("Finished animating");
			});

		} else {
			self_jq.attr("is_open", _param.YES);
			history_row_jq_arr.show();

			// 선택한 롤을 화면 최상단으로 이동시킵니다.
			var cur_offset = self_jq.offset();
			var body = $("html, body");
			body.stop().animate({scrollTop:cur_offset.top}, _param.SEC_ANIMATE_SCROLL, 'swing', function() { 
			   console.log("Finished animating");
			});
		}

	}


	// 1. SPEECH CNT
	var role_cnt = (_v.isValidArray(speech_history))?speech_history.length:0;
	var role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Speech"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			// 롤의 세부 기록을 표시합니다.
			var self_jq = delegate_data.target_jq.parent();
			var row_id = "speech_history";
			var history_obj_arr = speech_history;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__speech_regdttm"
				// key_for_right
				, "__speech_title"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}



	// 2. EVALUATION CNT
	role_cnt = (_v.isValidArray(evaluation_history))?evaluation_history.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Evaluation"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}		

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "evaluation_history";
			var history_obj_arr = evaluation_history;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__speech_regdttm"
				// key_for_right
				, "__speech_title"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}




	// 3. TOASTMASTER CNT
	role_cnt = (_v.isValidArray(role_history_toastmaster))?role_history_toastmaster.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Toastmaster"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			// 선택한 롤을 화면 최상단으로 이동시킵니다.
			var cur_offset = delegate_data.target_jq.offset();
			var body = $("html, body");
			body.stop().animate({scrollTop:cur_offset.top}, _param.SEC_ANIMATE_SCROLL, 'swing', function() { 
			   console.log("Finished animating");
			});

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "toastmaster_history";
			var history_obj_arr = role_history_toastmaster;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}



	// 4. WORD & QUOTE CNT
	role_cnt = (_v.isValidArray(role_history_word_n_quote_master))?role_history_word_n_quote_master.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Word & Quote Master"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "word_n_quote_history";
			var history_obj_arr = role_history_word_n_quote_master;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}




	// 5. Table Topic Master CNT
	role_cnt = (_v.isValidArray(role_history_table_topic_master))?role_history_table_topic_master.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Table Topic Master"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "table_topic_history";
			var history_obj_arr = role_history_table_topic_master;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}





	// 6. Mini Debate Master CNT
	role_cnt = (_v.isValidArray(role_history_mini_debate_master))?role_history_mini_debate_master.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Mini Debate Master"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "mini_debate_history";
			var history_obj_arr = role_history_mini_debate_master;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}




	// 7. General Evaluator CNT
	role_cnt = (_v.isValidArray(role_history_general_evaluator))?role_history_general_evaluator.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"General Evaluator"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "general_evaluator_history";
			var history_obj_arr = role_history_general_evaluator;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);


		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}





	// 8. Grammarian CNT
	role_cnt = (_v.isValidArray(role_history_grammarian))?role_history_grammarian.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Grammarian"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "grammarian_history";
			var history_obj_arr = role_history_grammarian;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}




	// 9. Ah counter CNT
	role_cnt = (_v.isValidArray(role_history_ah_counter))?role_history_ah_counter.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Ah Counter"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "ah_counter_history";
			var history_obj_arr = role_history_ah_counter;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}




	// 10. Timer CNT
	role_cnt = (_v.isValidArray(role_history_timer))?role_history_timer.length:0;
	role_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Timer"
		// textInBadge
		, ""+role_cnt
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if( delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP ) {

				return;
			}
			var self_jq = delegate_data.target_jq.parent();

			set_role_history_row(self_jq, "timer_history", role_history_timer);

			var self_jq = delegate_data.target_jq.parent();
			var row_id = "timer_history";
			var history_obj_arr = role_history_timer;

			set_role_history_row(
				// self_jq
				self_jq
				// row_id
				, row_id
				// history_obj_arr
				, history_obj_arr
				// key_for_left
				, "__meeting_agenda_round"
				// key_for_right
				, "__meeting_agenda_theme"
			);

		}, this)
	);
	if(role_cnt > 0){
		role_controller.set_badge_green();
	}

}








/*
// Set Event
var row_back_to_meeting_agenda_detail_jq = $("table thead tr#row_back_to_previous");
var row_back_to_meeting_agenda_detail_delegate_obj = _obj.getDelegate(function(){
	var call_url = _link.get_link(_link.MOBILE_MEMBER_MANAGE);
	location.href = call_url;

}, this);
_m_list.setTableHeaderRowEvent(row_back_to_meeting_agenda_detail_jq, row_back_to_meeting_agenda_detail_delegate_obj);
*/

// REMOVE Loading message
// show contents when it's ready
_tm_m_list.doWhenDocumentReady(
	_obj.getDelegate(function(delegate_data){

		console.log("Document is Ready!");


	}, this)
);

</script>
</body>
</html>
