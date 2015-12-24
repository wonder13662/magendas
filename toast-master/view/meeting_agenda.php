<?php
	// @ common setting
	include_once("../common.inc");


	//    .dMMMb  dMMMMMP dMP     dMMMMMP .aMMMb dMMMMMMP         dMP dMMMMb  dMMMMMP .aMMMb  .dMMMb 
	//   dMP" VP dMP     dMP     dMP     dMP"VMP   dMP           amr dMP dMP dMP     dMP"dMP dMP" VP 
	//   VMMMb  dMMMP   dMP     dMMMP   dMP       dMP           dMP dMP dMP dMMMP   dMP dMP  VMMMb   
	// dP .dMP dMP     dMP     dMP     dMP.aMP   dMP           dMP dMP dMP dMP     dMP.aMP dP .dMP   
	// VMMMP" dMMMMMP dMMMMMP dMMMMMP  VMMMP"   dMP           dMP dMP dMP dMP      VMMMP"  VMMMP"    

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
	$membership_arr = $wdj_mysql_interface->getMembership($meeting_membership_id);
	if(!empty($membership_arr)) {
		$membership = $membership_arr[0];
	}

	$window_scroll_y = $params->getParamNumber($params->WINDOW_SCROLL_Y);

	// 가장 마지막 등록된 미팅 ID를 가져옵니다.
	$latest_meeting_id = $wdj_mysql_interface->get_meeting_agenda_id_upcoming($meeting_membership_id);
	if((0 == $meeting_id) && (0 < $latest_meeting_id)) {
		// 외부로 받은 미팅 아이디가 정상적인 값이 아닐 경우, upcoming meeting id를 사용합니다.
		$meeting_id = $latest_meeting_id;
	}

	$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgendaList($meeting_membership_id);
	if(empty($meeting_agenda_list) && 0 < $meeting_membership_id) {
		// 1. 최초 생성으로 미팅 정보가 없는 경우, 임의의 미팅을 1개 생성해준다.
		$query_output = $wdj_mysql_interface->insertFisrtMeetingAgenda($meeting_membership_id);

		$result = $wdj_mysql_interface->getLatestMeetingAgendaId($meeting_membership_id);
		if(!empty($result)) {
			$meeting_id = $result[0]->__meeting_id;	
		}
	}

	$meeting_agenda_obj = null;
	if($meeting_id > 0) {

		// 지정한 meeting_id가 있는 경우.
		$meeting_agenda_arr = $wdj_mysql_interface->getMeetingAgendaById($meeting_membership_id, $meeting_id);
		$meeting_agenda_obj = $meeting_agenda_arr[0];

	}

	$today_role_list = $wdj_mysql_interface->getTodayRoleList($meeting_membership_id, $meeting_id, array(2,7,11,10,9,4,5,6));
	$today_speech_speaker_v2_list = $wdj_mysql_interface->sel_speech_speaker($meeting_id);

	$schedule_timeline_list_V2 = $wdj_mysql_interface->getTimeline_V2($meeting_id);

	$recent_club_schedule_timeline_list = $wdj_mysql_interface->getRecentClubTimelines($cookie_meeting_membership_id, 2);

	$schedule_timeline_template_list = $wdj_mysql_interface->getTimelineTemplateList();
	$today_news_list = $wdj_mysql_interface->getNews($meeting_id);

	$member_list = $wdj_mysql_interface->getMemberList($meeting_membership_id, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);

	$executive_member_list = $wdj_mysql_interface->getExcutiveMemberList($meeting_membership_id);
	$member_role_cnt_list = $wdj_mysql_interface->getMemberRoleCntList($meeting_membership_id);
	$role_list = $wdj_mysql_interface->getRoleList();
	$time_guide_line = $wdj_mysql_interface->getTimeGuideLine();

	$speech_project_list = $wdj_mysql_interface->getSpeechProjectList();

	// 96, 2
	// $output = $wdj_mysql_interface->copyTimelineFromTemplate(96, 2);
	// print_r($output);

	// test action list
	//$wdj_mysql_interface->test_action_list();

	// test action table
	// $new_action_table = $wdj_mysql_interface->test_action_table_insert();
	// $new_action_table_std = $new_action_table->get_std_obj();

	$new_action_table = $wdj_mysql_interface->get_action_collection(231);
	$new_action_table_std = $new_action_table->get_std_obj();
	$wdj_mysql_interface->test_action_table_list_item_update($new_action_table);

	// 뷰 로직에서 일부 엘리먼트가 업데이트 되는 경우, action collection 객체를 전달할 수 없다는 문제점이 있다.
	// action collection 객체를 직접 받을 수 없다면, 임의의 파라미터를 받아서, action collection을 재구성해야 한다.

	// TODO

	// phase 1

	// javascript에 action collection과 동일하게 동작하는 구조체를 만든다.
	// 이 구조체는 업데이트가 발생하면, 단계적 업데이트를 진행
	// 이 구조체는 업데이트가 발생하면, 자신으로부터 최상위 객체까지의 링크드리스트를 파라미터로 넘긴다.
	// json 객체 변환의 위험도를 낮추기 위해 모든 파라미터는 '해시키'로 구성되어야 한다.
	// 이 구조체는 업데이트가 완료되면, 서버로부터 새로 생성된 링크드 리스트(업데이트가 시작된 개체부터 최상위까지)를 결과 값으로 받는다.
	// 업데이트된 본문의 내용이 있다면 안정성 검사를 거쳐 서버로 업데이트한다.
	// 결과는 새로운 최상위 객체 아이디로 ajax 통신으로 내용을 다시 뷰에 그려야 한다.
	// 결과를 구조체 안에서 비교해서 달라진 부분만 업데이트한다.

	// phase 2

	// ajax api php 필요.


	// 231

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
<script src="../js/toast-master/action.manager.js"></script>
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
					<h4 class="modal-title" id="modal-title">New meeting</h4>
				</div>

				<div class="modal-body">
					<form>
						<div class="form-group">
							<label for="meeting-template" class="control-label">Template</label>

							<!-- template init -->
							<ul id="template_list_container" class="list-group">
								<!--
									timeline table is here!
								-->
							</ul>
							<!-- template ends -->

						</div>
						<div class="form-group">
							<label for="meeting-theme" class="control-label">Theme</label>
							<input type="text" class="form-control" id="meeting-theme">
						</div>
						<!-- http://vitalets.github.io/bootstrap-datepicker/ -->
						<div class="form-group">
							<label for="meeting-date" class="control-label">Meeting Date</label>
							<input type="text" class="span2 datepicker center-block" data-date-format="yyyy-mm-dd" readonly="" id="meeting-date" style="margin-left:0px;">
						</div>
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





<script>

// php to javascript sample
var meeting_agenda_list = <?php echo json_encode($meeting_agenda_list);?>;
var meeting_agenda_obj = <?php echo json_encode($meeting_agenda_obj);?>;
var member_list = <?php echo json_encode($member_list);?>;
var meeting_membership_id = <?php echo json_encode($meeting_membership_id);?>;
var member_role_cnt_list = <?php echo json_encode($member_role_cnt_list);?>;
var role_list = <?php echo json_encode($role_list);?>;
var today_role_list = <?php echo json_encode($today_role_list);?>;
var today_speech_speaker_v2_list = <?php echo json_encode($today_speech_speaker_v2_list);?>;

var executive_member_list = <?php echo json_encode($executive_member_list);?>;
var meeting_id = <?php echo json_encode($meeting_id);?>;
var schedule_timeline_list_V2 = <?php echo json_encode($schedule_timeline_list_V2);?>;
var recent_club_schedule_timeline_list = <?php echo json_encode($recent_club_schedule_timeline_list);?>;
var schedule_timeline_template_list = <?php echo json_encode($schedule_timeline_template_list);?>;

var time_guide_line = <?php echo json_encode($time_guide_line);?>;
var speech_speaker_cnt_list = <?php echo json_encode($speech_speaker_cnt_list);?>;
var speech_evaluator_cnt_list = <?php echo json_encode($speech_evaluator_cnt_list);?>;
var speech_project_list = <?php echo json_encode($speech_project_list);?>;
var today_news_list = <?php echo json_encode($today_news_list);?>;
var is_expired = <?php echo json_encode($is_expired);?>;
var is_editable = <?php echo json_encode($is_editable);?>;
var is_edit_anyway = <?php echo json_encode($is_edit_anyway);?>;

var is_update_timeline_after_job = <?php echo json_encode($is_update_timeline_after_job);?>;
var window_scroll_y = <?php echo json_encode($window_scroll_y);?>;

console.log(">>> meeting_agenda_list : ",meeting_agenda_list);
console.log(">>> meeting_agenda_obj : ",meeting_agenda_obj);
console.log(">>> member_role_cnt_list : ",member_role_cnt_list);
console.log(">>> meeting_membership_id : ",meeting_membership_id);
console.log(">>> executive_member_list : ",executive_member_list);


// TEST
var action_list_src = <?php echo json_encode($action_list_src);?>;
var action_list_copy = <?php echo json_encode($action_list_copy);?>;
var action_list_delete = <?php echo json_encode($action_list_delete);?>;
var action_list_update = <?php echo json_encode($action_list_update);?>;
//$action_list
console.log(">>> action_list_src : ",action_list_src);
console.log(">>> action_list_copy : ",action_list_copy);
console.log(">>> action_list_delete : ",action_list_delete);
console.log(">>> action_list_update : ",action_list_update);

var new_action_table_std = <?php echo json_encode($new_action_table_std);?>;
console.log(">>> new_action_table_std : ",new_action_table_std);

var action_table_test = action_manager.get_action_obj(new_action_table_std);
console.log(">>> action_table_test : ",action_table_test);


//root_action_obj

// 로그인 여부를 확인하기 위해 
var login_user_info = <?php echo json_encode($login_user_info);?>;
var is_log_in_user = false;
var cookie_key_tm_login_user = "tm_login_user";
var cookie_login_user = _server.getCookie(_param.COOKIE_TM_LOGIN_MEMBER_HASHKEY);
if(_v.is_valid_str(cookie_login_user)) {
	is_log_in_user = true;
}

console.log(">>> login_user_info : ",login_user_info);

var meeting_agenda_data_obj = 
{
	meeting_agenda_list:meeting_agenda_list
	, meeting_agenda_obj:meeting_agenda_obj
	, meeting_membership_id:meeting_membership_id
	, member_list:member_list
	, member_role_cnt_list:member_role_cnt_list
	, role_list:role_list
	, today_role_list:today_role_list
	, today_speech_speaker_v2_list:today_speech_speaker_v2_list

	, executive_member_list:executive_member_list
	, meeting_id:meeting_id
	, schedule_timeline_list_V2:schedule_timeline_list_V2
	, recent_club_schedule_timeline_list:recent_club_schedule_timeline_list
	, schedule_timeline_template_list:schedule_timeline_template_list
	, time_guide_line:time_guide_line
	, speech_speaker_cnt_list:speech_speaker_cnt_list
	, speech_evaluator_cnt_list:speech_evaluator_cnt_list
	, speech_project_list:speech_project_list
	, today_news_list:today_news_list
	, is_update_timeline_after_job:is_update_timeline_after_job

	, window_scroll_y:window_scroll_y
	, is_log_in_user:is_log_in_user 
	, login_user_info:login_user_info
};

console.log(">>> schedule_timeline_template_list : ",schedule_timeline_template_list);

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


