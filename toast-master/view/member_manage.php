<?php

// common setting
include_once("../common.inc");

// 로그인 되어 있지 않으면 로그인 페이지로!
if($login_user_info->__is_login==$params->NO){
	ToastMasterLinkManager::go(ToastMasterLinkManager::$LOG_IN);
}

// COMMON PROPS
$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);
if($MEETING_MEMBERSHIP_ID == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
}

// 멤버쉽 정보 가져오기
$membership_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
if(!empty($membership_arr)) {
	$membership = $membership_arr[0];
}


$expire_date = 180;

// 6개월간 아무런 활동이 없었던 멤버들의 상태를 N으로 바꿉니다.
$sleeping_member_list = $wdj_mysql_interface->getSleepingMember($expire_date, $MEETING_MEMBERSHIP_ID);
for($idx = 0; $idx < sizeof($sleeping_member_list); $idx++){
    $sleeping_member = $sleeping_member_list[$idx];
    $wdj_mysql_interface->goodNightMember($sleeping_member->__member_id, $MEETING_MEMBERSHIP_ID);
}

// SELECT INFOS
$all_member_list = $wdj_mysql_interface->getMemberListByMembershipId($MEETING_MEMBERSHIP_ID);


$MEMBER_HASH_KEY = $params->getParamString($params->MEMBER_HASH_KEY, "");
if(!empty($MEMBER_HASH_KEY)) {
	$MEMBER_ID = $wdj_mysql_interface->getMemberId($MEMBER_HASH_KEY);
}
if($MEMBER_ID > 0) {

	$selected_member_arr = $wdj_mysql_interface->getMember($MEMBER_HASH_KEY, $MEETING_MEMBERSHIP_ID);	
	$selected_member_obj = $selected_member_arr[0];

} else if(!empty($all_member_list)){

	// 선택된 멤버가 없다면 등록된 첫번째 멤버를 가져옵니다.
	$selected_member_obj = $all_member_list[0];
}

// OTHER CLUB MEMBER LIST
// 이 클럽에 없는 멤버리스트를 모두 가져옵니다. 타 클럽의 멤버를 현재 클럽으로 등록할 때 사용합니다.
$other_member_list = $wdj_mysql_interface->getOtherMemberListByMembershipId($MEETING_MEMBERSHIP_ID);

if(!is_null($selected_member_obj)) {

	$__member_id = $selected_member_obj->__member_id;

	// 1. 스피치 기록
	$speech_history = $wdj_mysql_interface->get_speech_history($MEETING_MEMBERSHIP_ID, $__member_id);
	// 2. 이벨류에이터 기록
	$evaluation_history = $wdj_mysql_interface->get_evaluation_history($MEETING_MEMBERSHIP_ID, $__member_id);
	// 3. 롤별 기록
	$role_id_toastmaster = 2;
	$role_history_toastmaster = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_toastmaster, $__member_id);

	$role_id_word_n_quote_master = 4;
	$role_history_word_n_quote_master = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_word_n_quote_master, $__member_id);

	$role_id_table_topic_master = 5;
	$role_history_table_topic_master = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_table_topic_master, $__member_id);

	$role_id_mini_debate_master = 6;
	$role_history_mini_debate_master = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_mini_debate_master, $__member_id);

	$role_id_general_evaluator = 7;
	$role_history_general_evaluator = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_general_evaluator, $__member_id);

	$role_id_grammarian = 11;
	$role_history_grammarian = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_grammarian, $__member_id);

	$role_id_ah_counter = 10;
	$role_history_ah_counter = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_ah_counter, $__member_id);

	$role_id_timer = 9;
	$role_history_timer = $wdj_mysql_interface->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_timer, $__member_id);
}

$membership_list = $wdj_mysql_interface->getMemberShipList();

// @ required
$wdj_mysql_interface->close();
?>

<html>
<head>
<?php
// @ required
include_once("../common.js.inc");
$view_render_var_arr = array("[__ROOT_PATH__]"=>$service_root_path);
ViewRenderer::render("$file_root_path/template/head.include.toast-master.template",$view_render_var_arr);
?>
</head>






<body role="document">
	<!-- nav begins -->
	<?php

	// 로그인 되었을 경우.
	$log_in_member_name = $login_user_info->__member_first_name . " " . $login_user_info->__member_last_name;
	$log_in_user_msg = "Welcome! " . $log_in_member_name;
	$login_status = "LOG OUT";

	$view_render_var_arr = 
	array(
		"[__ACTIVE_MEMBERS__]"=>"active"
		,"[__MEETING_MEMBERSHIP_ID__]"=>$MEETING_MEMBERSHIP_ID
		,"[__LOG_IN_USER__]"=>$log_in_user_msg
		,"[__LOG_IN_URL__]"=>"$service_root_path/view/log_out.php?redirect_url=$service_root_path/view/meeting_agenda.php"
		,"[__LOG_IN_STATUS__]"=>$login_status
		,"[__ROOT_PATH__]"=>$service_root_path
	);
	ViewRenderer::render("$file_root_path/template/nav.toast-master.admin.template",$view_render_var_arr);

	?>
	<!-- nav ends -->








	<!-- meeting agenda select list begins -->

	 <div id="member_select_list_parent" class="container" role="main">

		<!-- Membership banner begins -->
		<?php
		echo "<div id=\"club_title\" class=\"jumbotron\" style=\"background-color:#8e323f;background-image:url($service_root_path/images/MaroonandYellowBannerShort.jpg);background-repeat:no-repeat;height:195px;display:none;\">";	
		echo "<div><span style=\"position:relative;color:#FFFFFF;text-shadow:2px 2px 2px #491111;text-align:center;left:100px;\"><h2>$membership->__membership_desc</h2></span></div>";
		echo "<div id=\"dynamic_header_bg_line\" style=\"background-color:#f8e48b;width:497px;height:42px;position:relative;top:32px;left:383px;float:left;\"></div>";
		echo "</div>";
		?>
		<!-- Membership banner ends -->


	 	<div id="prev_sibling">
	 </div>

	<!-- meeting agenda select list ends -->




<script>

// php to javascript sample
var meeting_membership_id = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;
var other_member_list = <?php echo json_encode($other_member_list);?>;

console.log(">>> other_member_list :: ",other_member_list);

var _modal = airborne.bootstrap.modal;
var _column = airborne.bootstrap.column;
var _dates = airborne.dates;
var _html = airborne.html;
var _server = airborne.server;
var _obj = airborne.bootstrap.obj;
var _view_list = airborne.bootstrap.view.obj.list;
var _view_table = airborne.bootstrap.view.obj.table;

// meeting agenda를 선택할 수 있는 combox box list를 그려줍니다.
var list_search_tab = {
	// @required
	_self:null
	, init:function(list_json_array, next_list, selected_option_value){

		if(airborne.validator.isNotValidArray(list_json_array)){
			console.log("list_search_tab / airborne.validator.isNotValidArray(list_json_array)");
			return;
		}

		this._self = 
		airborne.bootstrap.list_search_tab_manager.getObj(
			// list_search_tab_name
			"Member List"
			// list_json_array
			, member_selectable_list
			// prev_sibling_jq
			,$("div#prev_sibling")
			,selected_option_value
		);

		this._self.hide_title();
		this._self.hide_search_btn();
		this._self.hide_input_search_keyword();

		this._self.addDelegateOnChange(_obj.getDelegate(function(selected_option_name, selected_option_value){

			_link.go_there(
				_link.MEMBER_MANAGE
				,_param
				.get(_param.MEMBER_HASH_KEY, selected_option_value)
				.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
			);

		}, this));

		var show_modal_member_info = function(member_obj){

			if(member_obj == undefined) {
				member_obj = {
					__member_id:-1
					,__member_membership_status:"A"
					,__member_first_name:""
					,__member_last_name:""
					,__member_membership:-1
					,__member_email:""
				};
			}

			console.log(">>> member_obj :: ",member_obj);

			// add modify modal
			var _column = airborne.bootstrap.column;
			var column_info_manager = _column.getObj();
			column_info_manager.addColumnHidden(
				// key
				"is_update_member"
				// default_value_on_no_result
				,"YES"
			);
			column_info_manager.addColumnHidden(
				// key
				"member_id"
				// default_value_on_no_result
				,member_obj.__member_id
			);
			column_info_manager.addColumnHidden(
				// key
				"member_membership"
				// default_value_on_no_result
				,member_obj.__member_membership
			);
			column_info_manager.addColumnHidden(
				// key
				"member_hash_key"
				// default_value_on_no_result
				,member_obj.__member_hash_key
			);
			column_info_manager.addColumnSelect(
				"member_membership_status"				// key
				,["A", "N"]					// select_options_arr
				,member_obj.__member_membership_status	// selected_option
			);
			column_info_manager.addColumnInput(
				// key
				"member_first_name"
				,_column.getColumnInputStrCheckerObj(
					// isEmptyAllowed
					false
					// min_len
					,1
					// max_len
					,20
				)
				,member_obj.__member_first_name
			);
			column_info_manager.addColumnInput(
				// key
				"member_last_name"						
				,_column.getColumnInputStrCheckerObj(
					// isEmptyAllowed
					false
					// min_len					
					,1
					// max_len 						
					,20						
				)
				// validCheckerObj
				,member_obj.__member_last_name
			);
			column_info_manager.addColumnInput(
				// key
				"member_email"			
				,_column.getColumnInputStrCheckerObj(
					// isEmptyAllowed
					false
					// min_len
					,1
					// max_len
					,50				
				)
				// validCheckerObj					
				,member_obj.__member_email
			);

			var column_info = column_info_manager.getColumnInfo();
			var mode = _column.MODE_INSERT;

			var parent_jq_obj = $('body');
			var _modal = airborne.bootstrap.modal;
			_modal.drawModalModify(
				// parent_jq_obj
				parent_jq_obj
				// mode
				, mode
				// column_info
				, column_info
				// selected_row_data
				, null
				// modifyUrlObj
				, _modal.getFormActionUrlObj(
					window.location.href // modal_update_url
				)
				// modal_title
				, "Member Info"
				// delegate_on_event
				, _obj.getDelegate(function(mode, column_info){

					var __member_id = column_info.member_id.getValue();
					var __member_first_name = column_info.member_first_name.getValue();
					var __member_last_name = column_info.member_last_name.getValue();
					var __member_hash_key = column_info.member_hash_key.getValue();
					var __member_membership = column_info.member_membership.getValue();
					var __member_membership_status = column_info.member_membership_status.getValue();
					var __member_email = column_info.member_email.getValue();

					if(__member_id > 0) {

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_UPDATE_MEMBER)
							// _param_obj
							, 
							_param
							.get(_param.IS_UPDATE_MEMBER, _param.YES)
							.get(_param.MEMBER_ID, __member_id)
							.get(_param.MEMBER_HASH_KEY, __member_hash_key)
							.get(_param.MEMBER_MEMBERSHIP_STATUS, __member_membership_status)
							.get(_param.MEMBER_FIRST_NAME, __member_first_name)
							.get(_param.MEMBER_LAST_NAME, __member_last_name)
							.get(_param.MEETING_MEMBERSHIP_ID, __member_membership)
							.get(_param.MEMBER_EMAIL, __member_email)
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data){

									_link.go_there(
										_link.MEMBER_MANAGE
										,_param
										.get(_param.MEMBER_HASH_KEY, __member_hash_key)
										.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
									);

								},
								// delegate_scope
								this
							)
						);

					} else {

						// 새로운 멤버를 추가하는 경우.
						// 이미 등록된 멤버인지 확인한다. 
						var insert_new_member = function(_param_obj) {

							_ajax.send_simple_post(
								// _url
								_link.get_link(_link.API_UPDATE_MEMBER)
								// _param_obj
								, _param_obj
								// _delegate_after_job_done
								,_obj.get_delegate(
									// delegate_func
									function(data){

										var new_member_hash_key = "";
										if(	data != undefined && 
											data.getMemberByNameAndEmail != undefined) {
											new_member_hash_key = data.getMemberByNameAndEmail.__member_hash_key;
										} // if end

										if(_v.isValidStr(new_member_hash_key)) {

											_link.go_there(
												_link.MEMBER_MANAGE
												,_param
												.get(_param.MEMBER_HASH_KEY, new_member_hash_key)
												.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
											);

										} else {
											alert("Error has occured!");
										} // if end

									},
									// delegate_scope
									this
								)
							);	// ajax end							
						}						

						var cur_param_obj_for_insert_new_member = 
						_param
						.get(_param.IS_INSERT_MEMBER, _param.YES)
						.get(_param.MEMBER_FIRST_NAME, __member_first_name)
						.get(_param.MEMBER_LAST_NAME, __member_last_name)
						.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
						// .get(_param.MEMBER_MOBILE, __member_mobile)
						.get(_param.MEMBER_EMAIL, __member_email)
						;

						var cur_param_obj_for_select_member = 
						_param
						.get(_param.IS_SELECT_MEMBER, _param.YES)
						.get(_param.MEMBER_EMAIL, __member_email)
						;

						_ajax.send_simple_post(
							// _url
							_link.get_link(_link.API_SELECT_MEMBER)
							// _param_obj
							, cur_param_obj_for_select_member
							// _delegate_after_job_done
							,_obj.get_delegate(
								// delegate_func
								function(data, delegate_data){

									console.log(">>> data :: ",data);
									console.log(">>> delegate_data :: ",delegate_data);

									var cur_member = null;
									if(	data != undefined && 
										data.getMemberByEmail != undefined && 
										_v.is_valid_array(data.getMemberByEmail.result) ) {

										cur_member = data.getMemberByEmail.result[0];
									}

									// TODO
									// 1. 해당 멤버가 멤버 정보에 없는 경우 - 새로 등록.
									// 2. 해당 멤버가 멤버 정보는 있지만, 현재 클럽에는 등록되지 않은 경우 - 이 클럽에도 등록 - 유저에게 가이드 필요.
									if(cur_member != undefined) {
										alert("Member is already exist!");
										return;
									} else {
										insert_new_member(delegate_data);
									}

								},
								// delegate_scope
								this
							)
							// delegate_data
							, cur_param_obj_for_insert_new_member
						);	// ajax end	

					} // outer if end

				}, this)
			);
		} // end :: show_modal_member_info


		this._self.addExtraBtn(	
			// btn_title
			"EDIT"
			// desc							
			, "Edit Current Member"
			// delegate_scope
			, this
			// delegate_btn_clicked
			, function(selected_key, selected_value){
				console.log("Do something");

				// 해당 유저의 정보를 가져와서 modal window로 띄워 줍니다. 
				for (var idx = 0; idx < all_member_list.length; idx++) {
					var member_obj = all_member_list[idx];
					var __member_hash_key = member_obj.__member_hash_key;
					if(__member_hash_key == null || __member_hash_key != selected_value) continue;

					show_modal_member_info(member_obj);

				}; // for end
			}
		);	// Add Extra Btn Ends




		var show_modal_another_member_info = function(){

			var select_options_arr_other_member = [];
			for(var idx = 0; idx < other_member_list.length; idx++) {

				var other_member_obj = other_member_list[idx];

				var select_option = 
				_column.getSelectDetailElement(
					// __key
					other_member_obj.__member_email + "&nbsp;&nbsp;&nbsp;&nbsp;" + other_member_obj.__member_first_name + "&nbsp;" + other_member_obj.__member_last_name
					// __value
					, other_member_obj.__member_id
				);

				select_options_arr_other_member.push(select_option);

			}
			
			var column_info_manager = _column.getObj();
			column_info_manager.addColumnSelectDetail(
				// key
				"member"
				// select_options_arr
				, select_options_arr_other_member
				// selected_option_key
				// delegate_on_chnage
			);

			var column_info = column_info_manager.getColumnInfo();
			var mode = _column.MODE_INSERT;

			var parent_jq_obj = $('body');
			var _modal = airborne.bootstrap.modal;
			_modal.drawModalModify(
				// parent_jq_obj
				parent_jq_obj
				// mode
				, mode
				// column_info
				, column_info
				// selected_row_data
				, null
				// modifyUrlObj
				, _modal.getFormActionUrlObj(
					window.location.href // modal_update_url
				)
				// modal_title
				, "Fetch Other Club Members"
				// delegate_on_event
				, _obj.getDelegate(function(mode, column_info){

					console.log(">>> mode : ",mode);
					console.log(">>> column_info : ",column_info);

					var cur_value = parseInt(column_info.member.getValue());
					console.log(">>> cur_value : ",cur_value);
					console.log(">>> meeting_membership_id : ",meeting_membership_id);

					_ajax.send_simple_post(
						// _url
						_link.get_link(_link.API_UPDATE_MEMBER)
						// _param_obj
						, 
						_param
						.get(_param.IS_INSERT_MEMBER_N_MEMBERSHIP, _param.YES)
						.get(_param.MEMBER_ID, cur_value)
						.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
						// _delegate_after_job_done
						,_obj.get_delegate(
							// delegate_func
							function(data){

								// TODO 아래 부분 수정 필요.
								var new_member_n_membership;
								if(data != undefined && _v.is_valid_array(data.query_output_arr)) {
									new_member_n_membership = data.query_output_arr[1][0];
								} else {
									alert("Error has occured!");
									return;
								}

								_link.go_there(
									_link.MEMBER_MANAGE
									,_param
									.get(_param.MEMBER_ID, new_member_n_membership.__member_id)
									.get(_param.MEETING_MEMBERSHIP_ID, new_member_n_membership.__member_membership)
								);

							},
							// delegate_scope
							this
						)
					);	// ajax end

				}, this)
			);
		} // end :: show_modal_member_info

		this._self.addExtraBtn(	
			// btn_title
			"FETCH"
			// desc							
			, "Fetch an another club member"
			// delegate_scope
			, this
			// delegate_btn_clicked
			, function(selected_key, selected_value){
				console.log("Do something");

				// 다른 클럽 유저의 정보를 가져와서 modal window로 띄워 줍니다. 
				show_modal_another_member_info();
			}
		);	// Add Extra Btn Ends	


		this._self.addExtraBtn(	
			"NEW"							// btn_title
			, "Add New Member"										// desc
			, this 										// delegate_scope
			, function(selected_key, selected_value){	// delegate_btn_clicked

				show_modal_member_info();

			}
		);	// Add Extra Btn Ends









	}
}






// php to javascript sample
var all_member_list = <?php echo json_encode($all_member_list);?>;
var selected_member_obj = <?php echo json_encode($selected_member_obj);?>;
var membership_list = <?php echo json_encode($membership_list);?>;
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


var selected_member_hash_key = -1;
if(selected_member_obj != undefined && selected_member_obj.__member_id != undefined) {
	selected_member_hash_key = selected_member_obj.__member_hash_key;
}

// console.log(">>> all_member_list :: ",all_member_list);
// console.log(">>> speech_history :: ",speech_history);
// console.log(">>> evaluation_history :: ",evaluation_history);
// console.log(">>> role_history_toastmaster :: ",role_history_toastmaster);
// console.log(">>> role_history_word_n_quote_master :: ",role_history_word_n_quote_master);
// console.log(">>> role_history_table_topic_master :: ",role_history_table_topic_master);
// console.log(">>> role_history_mini_debate_master :: ",role_history_mini_debate_master);
// console.log(">>> role_history_general_evaluator :: ",role_history_general_evaluator);
// console.log(">>> role_history_grammarian :: ",role_history_grammarian);
// console.log(">>> role_history_ah_counter :: ",role_history_ah_counter);
// console.log(">>> role_history_timer :: ",role_history_timer);
// console.log(">>> selected_member_obj :: ",selected_member_obj);

// member list를 combo box list로 보여줍니다.
var delegate_create_select_option_obj = null;
if(all_member_list != null && all_member_list.length > 0){

	delegate_create_select_option_obj = 
	airborne.bootstrap.obj.getDelegate(function(element){

		var key = ""
		+ element.__member_membership_status
		+ "&nbsp;&nbsp;&nbsp;&nbsp;"
		+ element.__member_name
		+ "&nbsp;&nbsp;&nbsp;&nbsp;"
		+ element.__member_email
		;

		var value = element.__member_hash_key;
		var select_option_obj = airborne.bootstrap.column.getSelectDetailElement(key, value);

		return select_option_obj;
	}, this);
	
	var member_selectable_list = airborne.bootstrap.obj.getTagSelectOptionArr(all_member_list, delegate_create_select_option_obj);

	this.list_search_tab.init(member_selectable_list, null, selected_member_hash_key);
}



// membership_list를 combo box list로 보여줍니다.
var membership_selectable_list = null;
if(membership_list != null && membership_list.length > 0){
	
	delegate_create_select_option_obj = 
	airborne.bootstrap.obj.getDelegate(function(element){
		var reg_time = airborne.dates.getFormattedTime(element.__membership_regdttm, airborne.dates.DATE_TYPE_YYYY_MM_DD);

		var key = ""
		+ reg_time
		+ "&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "(" + element.__membership_member_cnt + ")"
		+ "&nbsp;&nbsp;&nbsp;&nbsp;"
		+ element.__membership_name
		+ "&nbsp;&nbsp;&nbsp;&nbsp;"
		+ element.__membership_desc
		;

		var value = element.__membership_id;
		var select_option_obj = airborne.bootstrap.column.getSelectDetailElement(key, value);

		return select_option_obj;
	}, this);

	membership_selectable_list = airborne.bootstrap.obj.getTagSelectOptionArr(membership_list, delegate_create_select_option_obj);
}



// history tables
var total_stat_history = [
	{
		__left_role_name:"Speech"
		, __left_role_cnt:(_v.is_valid_array(speech_history))?""+speech_history.length:""+0
		, __right_role_name:"Evaluation"
		, __right_role_cnt:(_v.is_valid_array(evaluation_history))?""+evaluation_history.length:""+0
	}
	,{
		__left_role_name:"ToastMaster"
		, __left_role_cnt:(_v.is_valid_array(role_history_toastmaster))?""+role_history_toastmaster.length:""+0
		, __right_role_name:"Word & Quote"
		, __right_role_cnt:(_v.is_valid_array(role_history_word_n_quote_master))?""+role_history_word_n_quote_master.length:""+0
	}
	,{
		__left_role_name:"Table Topic"
		, __left_role_cnt:(_v.is_valid_array(role_history_table_topic_master))?""+role_history_table_topic_master.length:""+0
		, __right_role_name:"Mini Debate"
		, __right_role_cnt:(_v.is_valid_array(role_history_mini_debate_master))?""+role_history_mini_debate_master.length:""+0
	}
	,{
		__left_role_name:"General Evaluator"
		, __left_role_cnt:(_v.is_valid_array(role_history_general_evaluator))?""+role_history_general_evaluator.length:""+0
		, __right_role_name:"Grammarian"
		, __right_role_cnt:(_v.is_valid_array(role_history_grammarian))?""+role_history_grammarian.length:""+0
	}
	,{
		__left_role_name:"Ah Counter"
		, __left_role_cnt:(_v.is_valid_array(role_history_ah_counter))?""+role_history_ah_counter.length:""+0
		, __right_role_name:"Timer"
		, __right_role_cnt:(_v.is_valid_array(role_history_timer))?""+role_history_timer.length:""+0
	}
];

console.log(">> total_stat_history :: ",total_stat_history);



var json_for_total_stat = 
_view_table.add_title_type({

	key_access_prop_name:"__left_role_name"

}).add_title_type({
	
	key_access_prop_name:"__left_role_cnt"

}).add_title_type({

	key_access_prop_name:"__right_role_name"

}).add_title_type({
	
	key_access_prop_name:"__right_role_cnt"

});

var element_collection_set_history_total = null;
if(_v.is_valid_array(total_stat_history)) {
	element_collection_set_history_total = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Total"
		// table_column_json_format_obj
		, json_for_total_stat
		// table_raw_data
		, total_stat_history
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something
			console.log("cur_outcome_obj :: ",cur_outcome_obj);

		},this)
	);
}









var json_for_speech = 
_view_table.add_texe_type({

	column_title:"Round"
	, key_access_prop_name:"__meeting_agenda_round"

}).add_texe_type({

	column_title:"Date"
	, key_access_prop_name:"__speech_regdttm"

}).add_texe_type({

	column_title:"Project"
	, key_access_prop_name:"__speech_project_title"

}).add_texe_type({

	column_title:"Title"
	, key_access_prop_name:"__speech_title"

}).add_texe_type({

	column_title:"Evaluator"
	, key_access_prop_name:"__speech_evaluator_member_name"

});
var element_collection_set_history_speech = null;
if(_v.is_valid_array(speech_history)) {
	element_collection_set_history_speech = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Speech"
		// table_column_json_format_obj
		, json_for_speech
		// table_raw_data
		, speech_history
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}







var json_for_evaluation = 
_view_table.add_texe_type({

	column_title:"Round"
	, key_access_prop_name:"__meeting_agenda_round"

}).add_texe_type({

	column_title:"Date"
	, key_access_prop_name:"__speech_regdttm"

}).add_texe_type({

	column_title:"Project"
	, key_access_prop_name:"__speech_project_title"

}).add_texe_type({

	column_title:"Title"
	, key_access_prop_name:"__speech_title"

}).add_texe_type({

	column_title:"Speaker"
	, key_access_prop_name:"__speech_member_name"

});
var element_collection_set_history_evaluation = null;
if(_v.is_valid_array(speech_history)) {
	element_collection_set_history_evaluation = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Evaluation"
		// table_column_json_format_obj
		, json_for_evaluation
		// table_raw_data
		, evaluation_history
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}





var json_for_history = 
_view_table.add_texe_type({

	column_title:"Round"
	, key_access_prop_name:"__meeting_agenda_round"

}).add_texe_type({

	column_title:"Date"
	, key_access_prop_name:"__role_regdttm"

}).add_texe_type({

	column_title:"Theme"
	, key_access_prop_name:"__meeting_agenda_theme"

});

var element_collection_set_history_toast_master;
if(_v.is_valid_array(role_history_toastmaster)) {
	element_collection_set_history_toast_master =
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Toastmaster"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_toastmaster
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}




var element_collection_set_history_word_n_quote_master;
if(_v.is_valid_array(role_history_word_n_quote_master)) {
	element_collection_set_history_word_n_quote_master =
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Word & Quote Master"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_word_n_quote_master
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}

var element_collection_set_history_table_topic_master;
if(_v.is_valid_array(role_history_table_topic_master)) {
	element_collection_set_history_table_topic_master = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Tabel Topic Master"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_table_topic_master
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}

var element_collection_set_history_mini_debate_master;
if(_v.is_valid_array(role_history_mini_debate_master)) {
	element_collection_set_history_mini_debate_master = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Mini Debate Master"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_mini_debate_master
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);	
}


var element_collection_set_history_general_evaluator;
if(_v.is_valid_array(role_history_general_evaluator)) {
	element_collection_set_history_general_evaluator = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "General Evaluator"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_general_evaluator
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}

var element_collection_set_history_grammarian;
if(_v.is_valid_array(role_history_grammarian)) {
	element_collection_set_history_grammarian =
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Grammarian"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_grammarian
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}


var element_collection_set_history_ah_counter;
if(_v.is_valid_array(role_history_ah_counter)) {
	element_collection_set_history_ah_counter = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Ah Counter"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_ah_counter
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);
}

var element_collection_set_history_timer;
if(_v.is_valid_array(role_history_timer)) {
	element_collection_set_history_timer = 
	_view_table.add_editable_table_V2(
		// parent_jq
		$("div#member_select_list_parent")
		// table_title
		, "Timer"
		// table_column_json_format_obj
		, json_for_history
		// table_raw_data
		, role_history_timer
		// delegate_save_n_reload
		, _obj.get_delegate(function(cur_outcome_obj){

			// do something

		},this)
	);	
}

_obj.get_event_hierarchy_manager().lock();





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


</script>
</body>
</html>
