<?php
// common setting
include_once("../../common.inc");

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1) {
	// 인스턴스 페이지 사용을 위해 멤버쉽 정보를 받을 수 있도록 변경합니다.
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID);	
}
if($MEETING_MEMBERSHIP_ID == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
	$membership_obj = $membership_obj_arr[0];
}

// 앞으로 진행할 최신 미팅 1개의 정보를 가져옵니다.
// 최신순으로 등록된 미팅을 10개 가져옵니다.
$recent_meeting_agenda_list =
$wdj_mysql_interface->getMeetingAgendaListUpcoming(
	// meeting_membership_id
	$MEETING_MEMBERSHIP_ID
	// page
	, 1
	// size
	, 1
	// is_sooner_first
	, true
);
$recent_meeting_id = -1;
if(!empty($recent_meeting_agenda_list)) {
	$recent_meeting_agenda_obj = $recent_meeting_agenda_list[0];
	$recent_meeting_id = $recent_meeting_agenda_obj->__meeting_id;
}
if(0 < $recent_meeting_id) {
	$today_speech_list = $wdj_mysql_interface->sel_today_speech_speaker_v2($recent_meeting_id);
}



// TIMER TARGET
// 1. TABLE TOPIC 	(DYNAMIC)
// 2. MINI DEBATE 	(DYNAMIC)
// 3. SPEAKER		(FIXED)
// 4. EVALUATOR		(FIXED)


$member_list = $wdj_mysql_interface->getMemberList($MEETING_MEMBERSHIP_ID, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);

$time_guide_line_list = $wdj_mysql_interface->getTimeGuideLine();

// time record list
$time_record_list_table_topic = $wdj_mysql_interface->selectTimerListByTimerType($recent_meeting_id, $params->TIMER_TYPE_ID_TABLE_TOPIC);






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
	<tbody>
		<!-- list contents -->
	</tbody>
</table>

<script>











// COMMON PROPS
var login_user_info = <?php echo json_encode($login_user_info);?>;
var membership_obj = <?php echo json_encode($membership_obj);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;

var recent_meeting_agenda_obj = <?php echo json_encode($recent_meeting_agenda_obj);?>;
var recent_meeting_id = <?php echo json_encode($recent_meeting_id);?>;

var today_speech_list = <?php echo json_encode($today_speech_list);?>;
var member_list = <?php echo json_encode($member_list);?>;
var time_guide_line_list = <?php echo json_encode($time_guide_line_list);?>;
var time_record_list_table_topic = <?php echo json_encode($time_record_list_table_topic);?>;



//membership_obj
console.log(">>> login_user_info :: ",login_user_info);
console.log(">>> membership_obj :: ",membership_obj);

console.log(">>> recent_meeting_agenda_obj :: ",recent_meeting_agenda_obj);
console.log(">>> today_speech_list :: ",today_speech_list);
console.log(">>> member_list :: ",member_list);
console.log(">>> time_guide_line_list :: ",time_guide_line_list);



// view drawing
var table_jq = $("table tbody");


// login_user_info, header_arr, table_jq, color_text, bg_color_vmouse_down
var test = 
_link.get_header_link(
	_link.MOBILE_MEETING_TIMER
	,_param
	.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)			
);
console.log(">>> test :: ",test);

// 메뉴 뎁스 리스트를 보여줍니다.
var log_in_row_jq = 
_tm_m_list.addHeaderRow(
	// login_user_info
	login_user_info
	// membership_obj
	, membership_obj
	// header_arr 
	,[
		_link.get_header_link(
			_link.MOBILE_MEETING_TIMER
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
	, table_jq
);





// MEETING INFO
var now_date = _dates.getNow(_dates.DATE_TYPE_YYYY_MM_DD)
var days_left = _dates.get_YYYY_MM_DD_diff_days(now_date, recent_meeting_agenda_obj.__startdate);
var date_desc = "";
if(days_left < 1) {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( Today )"

} else if(days_left == 1) {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( Tomorrow )"

} else if(days_left == 2) {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( The day after Tomorrow )"

} else {

	date_desc = recent_meeting_agenda_obj.__startdate + " ( " + days_left + " days left )"

}
var row_meeting_info_jq = 
_m_list.addTableRowTitle(
	// title
	date_desc
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, _obj.getDelegate(function(self_obj){

	}, this)
);
















// MEMBER LIST
var key_value_obj_arr = [];
console.log(">>> member_list :: ",member_list);
for(var idx = 0;idx < member_list.length; idx++) {
	var member_obj = member_list[idx];
	var key_value_obj = 
	_obj.get_select_option(
		// key_str
		member_obj.__member_hash_key
		// value_str
		,member_obj.__member_name
		// key_access_prop_name
		// value_access_prop_name
	);

	key_value_obj_arr.push(key_value_obj);
}
// MEMBER LIST
var row_member_list_obj = 
_m_list.addTableRowsSelectFolder(
	// key_value_obj_arr
	key_value_obj_arr
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, _obj.getDelegate(function(delegate_data){
		// 내부의 내용은 각 롤에 할당될때 마다 변경됩니다.
	}, this)
	// delegate_data
	, _param
	.get(_param.MEETING_ID,recent_meeting_id)
	// text_color
	, _color.COLOR_MEDIUM_GRAY
	// bg_color
	, _color.COLOR_WHITE
);
// TODO accordian animation
row_member_list_obj.hide();
var show_member_list = function(container_jq, target_controller, row_member_list_obj, delegate_on_finish) {

	container_jq.after(row_member_list_obj.get_target_jq_arr());
	if(container_jq.attr("is_open") === "YES") {
		container_jq.attr("is_open", "NO");

		//window.scrollTo(0, 0);
		// REFACTOR ME
		var body = $("html, body");
		row_member_list_obj.hide();
		body.stop().animate({scrollTop:0}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
		   console.log("Finished animating");
		});

	} else {

		container_jq.attr("is_open", "YES");
		row_member_list_obj.show();

		// TODO 선택된 사용자는 제외합니다.
		var cur_offset = container_jq.offset();

		//window.scrollTo(0, cur_offset.top);
		// REFACTOR ME
		var body = $("html, body");
		body.stop().animate({scrollTop:cur_offset.top}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
		   console.log("Finished animating");
		});

		// 다른 롤의 멤버 리스트가 될 때마다 role id가 변경되어야 합니다.
		// 그러므로 delegate 함수가 그때마다 새로 설정되어야 합니다.
		row_member_list_obj.set_delegate_obj_click_row(

			_obj.getDelegate(function(selector_delegate_data){

				var target_jq = selector_delegate_data.delegate_data.get_target_jq();
				var MEMBER_HASH_KEY = target_jq.attr("key");
				var MEMBER_NAME = target_jq.find("strong").html();

				// 롤의 이름을 업데이트 합니다.
				target_controller.set_title(MEMBER_NAME);

				// 멤버 리스트를 가립니다.
				row_member_list_obj.hide();

				// 선택한 멤버 정보를 전달합니다.
				var delegate_data = {
					MEMBER_HASH_KEY:MEMBER_HASH_KEY
					, MEMBER_NAME:MEMBER_NAME
				}

				if(delegate_on_finish != undefined) {
					delegate_on_finish._func.apply(delegate_on_finish._scope,[delegate_data]);
				}

			}, this)					
		);
	} // if end
}













// event hierarchy controller
// 타이머 작동시 나머지 버튼들에 대해 비활성화 처리를 위해 필요합니다.
// 저장된 모든 객체의 on/off 메서드를 호출해줍니다.
var event_toggle_controller = _m_list.get_event_toggle_controller();












// TABLE TOPIC (Dynamic)
// How to show table topic timer from DB?
var time_guide_line_table_topic = time_guide_line_list[(_param.TIMER_TYPE_ID_TABLE_TOPIC - 1)];
var time_table_arr_table_topic = 
[
	parseInt(time_guide_line_table_topic.__time_guide_line_sec_green)
	, parseInt(time_guide_line_table_topic.__time_guide_line_sec_yellow)
	, parseInt(time_guide_line_table_topic.__time_guide_line_sec_red)
];
console.log(">>> time_table_arr_table_topic :: ",time_table_arr_table_topic);

var timer_controller_table_topic = 
_tm_m_list.add_timer_table_editable(
	// title
	"+ Table Topic Speaker"
	// time_arr
	, time_table_arr_table_topic
	// append_target_jq
	, table_jq
	// event_toggle_controller
	, event_toggle_controller
	// delegate_on_click_timer_title
	, _obj.getDelegate(function(delegate_data){

		// 선택할 수 있는 회원 리스트를 보여줍니다.
		var target_controller = delegate_data;
		var container_jq = target_controller.get_container_jq();

		show_member_list(
			// container_jq
			container_jq
			// target_controller
			, target_controller
			// row_member_list_obj
			, row_member_list_obj
			// delegate_on_finish
			, _obj.getDelegate(function(delegate_data){

				// 선택한 사용자를 업데이트 합니다.
				var hasChanged = target_controller.add_meta_data(delegate_data);
				if(!hasChanged) {
					console.log("변화된 값이 없으므로 중단합니다.");
					return;
				}

				var meta_data = target_controller.get_meta_data();
				var param_obj = 
				_param
				.get(_param.IS_UPDATE_TIMER,_param.YES)
				.get(_param.MEETING_ID,meta_data[_param.MEETING_ID])
				.get(_param.MEMBER_HASH_KEY,meta_data[_param.MEMBER_HASH_KEY])
				.get(_param.TIMER_RECORD_ID,meta_data[_param.TIMER_RECORD_ID])
				;

				// UPDATE
				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_TIMER)
					// _param_obj / MEETING_ID
					, param_obj
					// _delegate_after_job_done
					, _obj.get_delegate(
						// delegate_func
						function(data){

							console.log(">>> UPDATE / data ::",data);

						},
						// delegate_scope
						this
					)
				); // ajax done.

			}, this)
		);

	}, this)
	// delegate_on_click_remove_timer
	, _obj.getDelegate(function(delegate_data){

		console.log(">>> delegate_on_click_remove_timer / delegate_data :: ",delegate_data);

		// DB에 해당 열을 삭제합니다.
		console.log(">>> DELETE");

	}, this)
	// delegate_on_finish_adding_timer
	, _obj.getDelegate(function(delegate_data){

		console.log(">>> delegate_on_finish_adding_timer / delegate_data :: ",delegate_data);

		var IS_DATA_FROM_DB = delegate_data.get_meta_data_prop(_param.IS_DATA_FROM_DB);
		var TIMER_RECORD_ID = delegate_data.get_meta_data_prop(_param.TIMER_RECORD_ID);
		if((IS_DATA_FROM_DB != undefined && IS_DATA_FROM_DB === true) || (TIMER_RECORD_ID != undefined && 0 < TIMER_RECORD_ID)) {
			return;
		}

		var MEETING_ID = delegate_data.get_meta_data_prop(_param.MEETING_ID);
		var TIMER_TYPE_ID = delegate_data.get_meta_data_prop(_param.TIMER_TYPE_ID);
		var param_obj = 
		_param
		.get(_param.IS_INSERT_TIMER,_param.YES)
		.get(_param.MEETING_ID,MEETING_ID)
		.get(_param.MEMBER_HASH_KEY,"")
		.get(_param.TIMER_TYPE_ID,TIMER_TYPE_ID)
		.get(_param.TIME_RECORD_MILLISEC,0)
		;

		// DB에 새로운 열을 추가합니다.
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_TIMER)
			// _param_obj / MEETING_ID
			, param_obj
			// _delegate_after_job_done
			, _obj.get_delegate(
				// delegate_func
				function(data){

					console.log(">>> INSERT / data ::",data);

				},
				// delegate_scope
				this
			)
		); // ajax done.

	}, this)
	// delegate_on_time_update
	, _obj.getDelegate(function(delegate_data){

		var cur_millisec = delegate_data.get_time_stack_millisec();
		console.log(">>> delegate_on_time_update / delegate_data :: ",delegate_data);
		console.log(">>> delegate_on_time_update / cur_millisec :: ",cur_millisec);

		// DB에 해당 열의 시간을 저장합니다.
		var param_obj = 
		_param
		.get(_param.IS_UPDATE_TIMER,_param.YES)
		.get(_param.TIMER_TYPE_ID,delegate_data.get_meta_data_prop(_param.TIMER_TYPE_ID))
		.get(_param.TIMER_RECORD_ID,delegate_data.get_meta_data_prop(_param.TIMER_RECORD_ID))
		.get(_param.TIME_RECORD_MILLISEC,cur_millisec)
		;

		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_TIMER)
			// _param_obj / MEETING_ID
			, param_obj
			// _delegate_after_job_done
			, _obj.get_delegate(
				// delegate_func
				function(data){

					console.log(">>> UPDATE TIME / data ::",data);

				},
				// delegate_scope
				this
			)
		); // ajax done.

	}, this)
	// meta data
	, _param
	.get(_param.MEETING_ID, recent_meeting_id)
	.get(_param.TIMER_TYPE_ID, parseInt(time_guide_line_table_topic.__time_guide_line_id))
	.get(_param.IS_DATA_FROM_DB, false)
);
// timer_controller_table_topic
for(var idx = 0;idx < time_record_list_table_topic.length;idx++) {
	var timer_record_obj = time_record_list_table_topic[idx];	

	var timer_record_obj_formatted = 
	timer_controller_table_topic.get_timer_record_obj(
		// is_qualified
		timer_record_obj.__is_qualified
		// meeting_id
		, timer_record_obj.__meeting_id
		// member_hash_key
		, timer_record_obj.__member_hash_key
		// member_name
		, timer_record_obj.__member_name
		// time_record_millisec
		, timer_record_obj.__time_record_milli_sec
		// timer_record_id
		, timer_record_obj.__timer_record_id
		// timer_type_id
		, timer_record_obj.__timer_type_id
	);

	timer_controller_table_topic.add_timer(timer_record_obj_formatted);
}


//timer_controller_table_topic.add_timer(time_record_list_table_topic[0]);


// TIMER_TYPE_ID

/*
DROP TABLE `MA_TIMER_RECORD`;

CREATE TABLE `MA_TIMER_RECORD` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_id` int(11) NOT NULL,
  `timer_type_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `time_record_milli_sec` int(11) NOT NULL,
  `is_qualified` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO `magendas`.`MA_TIMER`(`timer_type_id`,`member_id`,`time_milli_sec`,`is_qualified`)
VALUES($timer_type_id,$member_id,$time_milli_sec,$is_qualified);

UPDATE `magendas`.`MA_TIMER`
SET `timer_type_id` = $timer_type_id
, `member_id` = $member_id
, `time_milli_sec` = $time_milli_sec
, `is_qualified` = $is_qualified
WHERE `id` = $id;

DELETE FROM `magendas`.`MA_TIMER`
WHERE `id` = $id;

SELECT `MA_TIMER`.`id`,
`MA_TIMER`.`meeting_id`,
`MA_TIMER`.`timer_type_id`,
`MA_TIMER`.`member_id`,
`MA_TIMER`.`time_milli_sec`,
`MA_TIMER`.`is_qualified`
FROM `magendas`.`MA_TIMER`
WHERE `MA_TIMER`.`meeting_id`=$meeting_id
;


*/















/*
// MINI DEBATE (Dynamic)
var add_mini_debate = function(time_arr, row_jq, delegate_data_param, show_member_list) {

	var timer_controller = 
	_m_list.addTableRowTimer(
		// time_arr - ( GREEN / YELLOW / RED )
		time_arr
		// title_on_badge
		, _param.NOT_ASSIGNED
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

				show_member_list(
					// container_jq
					container_jq
					// target_controller
					, target_controller
					// row_member_list_obj
					, row_member_list_obj
				);

			} else if(delegate_data.EVENT_TYPE === target_controller.EVENT_TYPE_CLICK_REMOVE) {

				console.log(">>> target_controller.EVENT_TYPE_CLICK_REMOVE");

				// 1. remove from screen
				//container_jq.remove();

				// 2. remove data
			}

		}, this)
		// delegate_obj_on_time_update
		, _obj.getDelegate(function(delegate_data){

			var target_controller = delegate_data.target_controller;

			if(delegate_data.EVENT_TYPE === target_controller.EVENT_TYPE_START_TIMER) {
				event_toggle_controller.off();
			} else if(delegate_data.EVENT_TYPE === target_controller.EVENT_TYPE_STOP_TIMER) {
				event_toggle_controller.on();
			}


		}, this)
		// delegate_data
		, delegate_data_param
	);

	mini_debate_row_after_jq = timer_controller.get_container_jq();

	event_toggle_controller.push(timer_controller);

	return timer_controller;
}
var accessor_mini_debate_btn = 
_m_list.addTableRowBtn(
	// title
	"+ Mini Debate Speaker"
	// color
	, null
	// delegate_obj
	, _obj.getDelegate(function(delegate_data, accessor){

		if(!confirm("Add New One?")){
			return;
		}

		if(mini_debate_row_after_jq == undefined) {
			mini_debate_row_after_jq = accessor.get_target_jq();
		}

		// 이 테이블 토픽 데이터는 어디에 저장?
		var timer_controller = 
		add_mini_debate(
			// time_arr
			_param.SEC_MINI_DEBATE
			// row_jq
			, mini_debate_row_after_jq
			// delegate_data_param
			, _param
			.get(_param.MEETING_ID, recent_meeting_id)
			.get(_param.ACCESSOR, accessor)
			// show_member_list
			, show_member_list
			// parent accessor
			, accessor
		);

	}, this)
	// append_target_jq
	, table_jq
);
var mini_debate_row_after_jq = null;
event_toggle_controller.push(accessor_mini_debate_btn);







// 1. Meeting Agenda List
/*
var row_meeting_agenda_jq = 
_m_list.addTableRowMovingArrow(
	// title
	"Meeting Agenda"
	// append_target_jq
	, table_jq
	// delegate_obj_row_click
	, _obj.getDelegate(function(delegate_data){

		if(	delegate_data == undefined ||
			delegate_data.delegate_data == undefined ||
			_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

			return;
		}

		_link.go_there(
			_link.MOBILE_MEETING_AGENDA_LIST
			, _param
			.get(_param.MEETING_MEMBERSHIP_ID,meeting_membership_id)
		);

	}, this)
	// is_bold
	, true
	// param_obj
	, null
	// text_color
	, _tm_m_list.COLOR_NAVY
	// bg_color
	, _tm_m_list.COLOR_TINT_GRAY
);
*/








// 99. REMOVE Loading message
_tm_m_list.doWhenDocumentReady();


</script>
</body>
</html>
