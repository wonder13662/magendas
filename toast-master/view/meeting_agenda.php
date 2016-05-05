<?php

	// @ common setting
	include_once("../common.inc");

	// $today_role_list - 화면 표시 기준에 맞게 정렬합니다.
	// 7 - Genera Evaluator 	/	2 - ToastMaster (No announce)
	// 9 - Timer				/	5 - Table Topic Master (Announce later)
	// 10 - Ah & Vote Counter 	/	6 - Mini Debate Master (Announce later)
	// 11 - Grammarian 			/	4 - Word & Quote Master

	// select list를 그릴 전체 agenda 리스트를 가져옵니다.(최신순으로 50개만 가져옴.)

	// Membership Check
	$cookie_meeting_membership_id = ToastMasterLogInManager::getMembershipCookie();
	if($cookie_meeting_membership_id == -1) {
		// move to membership picker page
		ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
	} else {
		$meeting_membership_id = $cookie_meeting_membership_id;
	}

	// Agent Check
	$user_agent = strtolower($_SERVER['HTTP_USER_AGENT']);
	if ((strpos($user_agent,'iphone') !== false) || (strpos($user_agent,'android') !== false)) {
		// move to mobile page
		ToastMasterLinkManager::go(
			// link
			ToastMasterLinkManager::$MOBILE_TOP
			// param_arr
			,array(
				"MEETING_MEMBERSHIP_ID"=>$meeting_membership_id
			)
		);
	}

	$meeting_id = $params->getParamNumber($params->MEETING_ID, 0);
	$membership = $wdj_mysql_interface->get_membership($meeting_membership_id);
	$window_scroll_y = $params->getParamNumber($params->WINDOW_SCROLL_Y);

	// 가장 최신의 미팅 ID를 가져옵니다.
	$latest_meeting_id = $wdj_mysql_interface->get_meeting_agenda_id_upcoming($meeting_membership_id);
	if((0 == $meeting_id) && (0 < $latest_meeting_id)) {
		// param으로 받은 미팅 아이디가 없을 경우, upcoming meeting id를 사용합니다.
		$meeting_id = $latest_meeting_id;
	}

	$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgendaList($meeting_membership_id);


	$meeting_agenda_obj = null;
	if($meeting_id > 0) {

		// 지정한 meeting_id가 있는 경우.
		$meeting_agenda_obj = $wdj_mysql_interface->get_meeting_agenda_by_id($meeting_id);

	}

	$member_list = $wdj_mysql_interface->getMemberList($meeting_membership_id, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);
	$member_role_cnt_list = $wdj_mysql_interface->getMemberRoleCntList($meeting_membership_id);
	
	$role_list = $wdj_mysql_interface->getRoleList();
	$time_guide_line = $wdj_mysql_interface->getTimeGuideLine();

	// $speech_project_list = $wdj_mysql_interface->getSpeechProjectList();
	$speech_project_list = $wdj_mysql_interface->select_speech_project_list();
	

	// 가장 최근의 ACTION COLLECTION을 가져옵니다. / 모달에서 복제 대상으로 사용합니다.
	$has_immediate_past_action_collection = $wdj_mysql_interface->has_immediate_past_action_collection_by_membership_id($meeting_membership_id);
	$action_collection_obj_immediate_past = null;
	if($has_immediate_past_action_collection) {

		// 최근의 ACTION COLLECTION이 있습니다.
		$action_collection_obj_immediate_past = $wdj_mysql_interface->get_immediate_past_root_action_collection_by_membership_id($meeting_membership_id);
		$action_collection_obj_immediate_past_std = null;
		$meeting_obj_immediate_past = null;
		if(ActionCollection::is_instance($action_collection_obj_immediate_past)) {
			$action_collection_obj_immediate_past_std = $action_collection_obj_immediate_past->get_std_obj();
			$meeting_id_immediate_past = $action_collection_obj_immediate_past->get_meeting_agenda_id();
			$meeting_obj_immediate_past = $wdj_mysql_interface->get_meeting_agenda_by_id($meeting_id_immediate_past);
		}
	}

	// 화면에 표시할 action list.
	$action_collection_obj_recent = $wdj_mysql_interface->get_recent_action_collection_by_meeting_id($meeting_id);
	$meeting_action_list_std = null;
	if(ActionCollection::is_instance($action_collection_obj_recent)) {
		$meeting_action_list_std = $action_collection_obj_recent->get_std_obj();	
	}

	$tm_officer_table_obj = $wdj_mysql_interface->get_toastmaster_officer_by_meeting_id($meeting_membership_id);
	$tm_officer_std = null;
	if(ActionCollection::is_instance($tm_officer_table_obj)) {
		$tm_officer_std = $tm_officer_table_obj->get_std_obj();	
	}

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
<!-- view controller -->
<script src="../js/toast-master/meeting.agenda.js"></script>
</head>


<body role="document">
	<!-- nav begins -->
	<?php



	$login_user_msg = "";
	$login_status = "LOG OUT";

	if(	(!empty($login_user_info)) && 
		($login_user_info->__is_login==$params->YES) && 
		(!empty($login_user_info->__member_hashkey))	){

		// 로그인 되었을 경우.
		$login_user_msg = "Welcome! " . $login_user_info->__member_first_name . " " . $login_user_info->__member_last_name;
		$view_render_var_arr = 
		array(
			"[__ACTIVE_MEETING_AGENDA__]"=>"active"
			,"[__MEETING_MEMBERSHIP_ID__]"=>$meeting_membership_id
			,"[__LOG_IN_USER__]"=>$login_user_msg
			,"[__LOG_IN_URL__]"=>"$service_root_path/view/log_out.php?redirect_url=$service_root_path/view/meeting_agenda.php?MEETING_ID=$meeting_id"
			,"[__LOG_IN_STATUS__]"=>$login_status
			,"[__ROOT_PATH__]"=>$service_root_path
		);
		ViewRenderer::render("$file_root_path/template/nav.toast-master.admin.template",$view_render_var_arr);

	} else {

		// 로그인되지 않았을 경우.
		$login_status = "LOG IN";

		$view_render_var_arr = 
		array(
			"[__ACTIVE_MEETING_AGENDA__]"=>"active"
			,"[__MEETING_MEMBERSHIP_ID__]"=>$meeting_membership_id
			,"[__LOG_IN_URL__]"=>"$service_root_path/view/log_in.php?redirect_url=$service_root_path/view/meeting_agenda.php?MEETING_ID=$meeting_id"
			,"[__LOG_IN_STATUS__]"=>$login_status
			,"[__ROOT_PATH__]"=>$service_root_path
		);
		ViewRenderer::render("$file_root_path/template/nav.toast-master.template",$view_render_var_arr);

	}

	// check date is expired
	$is_expired = $params->YES;
	$editable_time = date("YmdHis",strtotime ("-1 days")); // YYYYMMDDHHmmss

	// $is_edit_anyway = $params["is_edit_anyway"];
	$is_edit_anyway = $params->isYes($params->IS_EDIT_ANYWAY);

	if($editable_time < $meeting_agenda_obj->__startdttm || $is_edit_anyway==$params->YES){
		$is_expired = $params->NO;
	}
	$is_editable = ($is_expired==$params->NO &&  $login_user_info->__member_id > 0)?$params->YES:$params->NO;
	?>
	<!-- nav ends -->




	<!-- meeting agenda container begins -->
	<div id="meeting_agenda_container" class="container" role="main" data-toggle="modal" data-target="#row_modal">

		<!-- Membership banner begins -->
		<?php
		echo "<div id=\"club_title\" class=\"jumbotron\" style=\"background-color:#8e323f;background-image:url($service_root_path/images/MaroonandYellowBannerShort.jpg);background-repeat:no-repeat;height:195px;display:none;\">";	
		echo "<div><span style=\"position:relative;color:#FFFFFF;text-shadow:2px 2px 2px #491111;text-align:center;left:100px;\"><h2>$membership->__membership_desc</h2></span></div>";
		echo "<div id=\"dynamic_header_bg_line\" style=\"background-color:#f8e48b;width:497px;height:42px;position:relative;top:32px;left:383px;float:left;\"></div>";
		echo "</div>";
		?>
		<!-- Membership banner ends -->

		<!-- meeting agenda creator modal inits-->
		<div class="modal fade" id="modal-new-meeting-dialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" cur-meeting-id="-1">
			<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button id="meeting-agenda-cancel" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					
					<?php
						if(!is_null($meeting_agenda_obj) && !empty($meeting_agenda_obj->__theme)) {
							$meeting_title = $meeting_agenda_obj->__round . "th / " . $meeting_agenda_obj->__startdate . " / " . $meeting_agenda_obj->__theme;
							echo "<h4 class=\"modal-title\" id=\"modal-title\" style=\"color:#8A6D65;\">$meeting_title</h4>";
						} else {
							echo "<h4 class=\"modal-title\" id=\"modal-title\" style=\"color:#8A6D65;\">New meeting</h4>";
						}
					?>
				</div>

				<div class="modal-body" style="padding-top:0px;padding-bottom:0px;">
					<form>
						<div class="form-group">

							<ul class="list-group">
								<li class="list-group-item list-group-item-warning" style="margin-top:20px;"><strong>TEMPLATE</strong></li>
								<li class="list-group-item list-group-item-warning" style="height:180px;padding:10px;">

							<?php

							// 지난번의 아젠다 정보
							if(!is_null($action_collection_obj_immediate_past)) {

								$immediate_prev_meeting_id = $action_collection_obj_immediate_past->get_meeting_agenda_id();
								$immediate_prev_meeting_startdate = $meeting_obj_immediate_past->__startdate;

								echo "<div class=\"col-xs-6 col-md-3\" style=\"padding-left:0px;\">";
								echo "<a id=\"agenda_template\" meeting_id=\"$meeting_id\" src_meeting_id=\"$immediate_prev_meeting_id\" action_template=\"$params->ACTION_TEMPLATE_PREV_MEETING\" class=\"thumbnail\" style=\"width:120px;text-decoration:none;font-size:10px;text-align:center;\">$immediate_prev_meeting_startdate<img src=\"$service_root_path/images/AGENDA_THUMBNAIL_240x339.png\" alt=\"Recent Agenda\"></a>";
								echo "</div>";
							}

							// 여기서부터 템플릿 정보 - 코드로 제어합니다. DB에 의존하지 않습니다.
							echo "<div class=\"col-xs-6 col-md-3\" style=\"padding-left:0px;\">";
							echo "<a id=\"agenda_template\" meeting_id=\"$meeting_id\" src_meeting_id=\"-1\" action_template=\"$params->ACTION_TEMPLATE_BUNDANG\" class=\"thumbnail\" style=\"width:120px;text-decoration:none;font-size:10px;text-align:center;\">Default<img src=\"$service_root_path/images/AGENDA_THUMBNAIL_240x339.png\" alt=\"Recent Agenda\"></a>";
							echo "</div>";

							?>
								</li>
								<li class="list-group-item list-group-item-warning" style="padding-left:10px;padding-right:10px;">
									<strong>THEME</strong>
									<!-- 
									<input type="text" class="form-control" id="meeting-theme" aria-describedby="basic-addon3">
									-->
									<input type="text" class="form-control" id="meeting-theme">
								</li>
								<li class="list-group-item list-group-item-warning" style="padding-left:10px;padding-right:10px;">
									<strong>DATE</strong>
									<input type="text" class="span2 datepicker center-block" data-date-format="yyyy-mm-dd" readonly="" id="meeting-date" style="margin-left:0px;">
								</li>

							</ul>

						</div>

						<!--
						<div class="input-group">
							<input type="text" class="span2 datepicker center-block" data-date-format="yyyy-mm-dd" readonly="" id="meeting-date" style="margin-left:0px;">
						</div>
						-->

						<!--
						<div class="form-group">
							<input type="text" class="form-control" id="meeting-theme">
						</div>
						-->

						<!-- http://vitalets.github.io/bootstrap-datepicker/ -->
						<!--
						<div class="form-group">
							<input type="text" class="span2 datepicker center-block" data-date-format="yyyy-mm-dd" readonly="" id="meeting-date" style="margin-left:0px;">
						</div>
						-->
					</form>
				</div>

				<div class="modal-footer">
					<button id="meeting-agenda-cancel" type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					<button id="meeting-agenda-new" type="button" class="btn btn-primary">Save</button>
				</div>

			</div>
			</div>
		</div>
		<!-- meeting agenda creator modal ends-->

	</div>
	<!-- meeting agenda container ends -->


	<!-- officer list container begins -->
	<div id="officer_list_container" class="container" role="main" data-toggle="modal" data-target="#row_modal">
	</div>
	<!-- officer list container ends -->


	<!-- white space init-->
	<div id="white_space" style="height:300px;"></div>
	<!-- white space ends-->


	<div
	  class="fb-like"
	  data-share="true"
	  data-width="450"
	  data-show-faces="true">
	</div>

<script>

// php to javascript sample
var meeting_agenda_list = <?php echo json_encode($meeting_agenda_list);?>;
var meeting_agenda_obj = <?php echo json_encode($meeting_agenda_obj);?>;
var member_list = <?php echo json_encode($member_list);?>;
var meeting_membership_id = <?php echo json_encode($meeting_membership_id);?>;
var member_role_cnt_list = <?php echo json_encode($member_role_cnt_list);?>;
var role_list = <?php echo json_encode($role_list);?>;
var meeting_id = <?php echo json_encode($meeting_id);?>;
var recent_club_schedule_timeline_list = <?php echo json_encode($recent_club_schedule_timeline_list);?>;
var schedule_timeline_template_list = <?php echo json_encode($schedule_timeline_template_list);?>;
var speech_speaker_cnt_list = <?php echo json_encode($speech_speaker_cnt_list);?>;
var speech_evaluator_cnt_list = <?php echo json_encode($speech_evaluator_cnt_list);?>;
var speech_project_list = <?php echo json_encode($speech_project_list);?>;

console.log("meeting_agenda_obj ::: ",meeting_agenda_obj);

var is_expired = <?php echo json_encode($is_expired);?>;
var is_editable = <?php echo json_encode($is_editable);?>;
var is_edit_anyway = <?php echo json_encode($is_edit_anyway);?>;
var window_scroll_y = <?php echo json_encode($window_scroll_y);?>;

var meeting_action_list_std = <?php echo json_encode($meeting_action_list_std);?>;
var meeting_action_list = undefined;
if(meeting_action_list_std != undefined) {
	meeting_action_list = _action.get_action_obj(meeting_action_list_std);
}

// TEST
console.log("meeting_action_list_std ::: ",meeting_action_list_std);

var tm_officer_std = <?php echo json_encode($tm_officer_std);?>;
var tm_officer_action_list = undefined;
if(tm_officer_std != undefined) {
	tm_officer_action_list = _action.get_action_obj(tm_officer_std);
}

// TEST
// facebook_sdk.init();
// console.log("HERE / XXX");

// 과거의 직전 미팅 정보
var action_collection_obj_immediate_past_std = <?php echo json_encode($action_collection_obj_immediate_past_std);?>;
var meeting_obj_immediate_past = <?php echo json_encode($meeting_obj_immediate_past);?>;

var recent_action_collection_id = <?php echo json_encode($recent_action_collection_id);?>;
var service_root_path = <?php echo json_encode($service_root_path);?>;

// 로그인 여부를 확인하기 위해 
var login_user_info = <?php echo json_encode($login_user_info);?>;
var is_log_in_user = false;
var cookie_key_tm_login_user = "tm_login_user";
var cookie_login_user = _server.getCookie(_param.COOKIE_TM_LOGIN_MEMBER_HASHKEY);
if(_v.is_valid_str(cookie_login_user)) {
	is_log_in_user = true;
}

var meeting_agenda_data_obj = 
{
	meeting_agenda_list:meeting_agenda_list
	, meeting_agenda_obj:meeting_agenda_obj
	, meeting_membership_id:meeting_membership_id
	, member_list:member_list
	, member_role_cnt_list:member_role_cnt_list
	, role_list:role_list
	, meeting_id:meeting_id
	, recent_club_schedule_timeline_list:recent_club_schedule_timeline_list
	, schedule_timeline_template_list:schedule_timeline_template_list
	, speech_speaker_cnt_list:speech_speaker_cnt_list
	, speech_evaluator_cnt_list:speech_evaluator_cnt_list
	, speech_project_list:speech_project_list
	, window_scroll_y:window_scroll_y
	, is_log_in_user:is_log_in_user 
	, login_user_info:login_user_info
	, meeting_action_list:meeting_action_list
	, tm_officer_action_list:tm_officer_action_list
	, service_root_path:service_root_path
	, recent_action_collection_id:recent_action_collection_id
};

// 편집에 필요한 모든 데이터가 전송되면, 실제 편집 객체를 만듭니다.
var meeting_agenda_manager = wonglish.meeting_agenda_manager.getObj("meeting_agenda_container", meeting_agenda_data_obj, is_editable);

// https://developers.google.com/web/fundamentals/native-hardware/user-location/obtain-location
// check for Geolocation support
if (navigator.geolocation) {
	console.log('Geolocation is supported!');

	var startPos;
	var geoSuccess = function(position) {
		startPos = position;
		console.log(">>> startPos :: ",startPos);
		// document.getElementById('startLat').innerHTML = startPos.coords.latitude;
		// document.getElementById('startLon').innerHTML = startPos.coords.longitude;
	};
	navigator.geolocation.getCurrentPosition(geoSuccess);	
}
else {
	console.log('Geolocation is not supported for this Browser/OS version yet.');
}



</script>
</body>
</html>


