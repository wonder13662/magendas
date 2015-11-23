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
	//ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
	$membership_obj = $membership_obj_arr[0];

	$login_user_info->__membership_id = $membership_obj->__membership_id;
	$login_user_info->__membership_name = $membership_obj->__membership_name;
}

$MEETING_ID = $params->getParamNumber($params->MEETING_ID);
$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgenda($MEETING_MEMBERSHIP_ID, $MEETING_ID);
if(!empty($meeting_agenda_list)) {
	$meeting_agenda_obj = $meeting_agenda_list[0];
}

$today_speech_list = $wdj_mysql_interface->sel_today_speech_speaker_v2($MEETING_ID);

$SPEECH_ID = $params->getParamNumber($params->SPEECH_ID, -1);
$IS_EXTERNAL_SHARE = $params->isYes($params->IS_EXTERNAL_SHARE);
$today_speech_list_valid = array();
if(0 < $SPEECH_ID && $IS_EXTERNAL_SHARE) {
	// 지정된 스피치만 업데이트하는 경우. 카카오톡으로 페이지 링크가 전송된 경우, 해당 스피치만 노출됩니다.
	foreach ($today_speech_list as $today_speech_obj) {
		if(intval($today_speech_obj->__speech_id) == $SPEECH_ID) {
			array_push($today_speech_list_valid, $today_speech_obj);
		}
	}
	$today_speech_list = $today_speech_list_valid;
}

$speech_project_list = $wdj_mysql_interface->getSpeechProjectList();

$member_list = $wdj_mysql_interface->getMemberList($MEETING_MEMBERSHIP_ID, $params->MEMBER_MEMBERSHIP_STATUS_AVAILABLE);

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
var MEETING_ID = <?php echo json_encode($MEETING_ID);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;

var SPEECH_ID = <?php echo json_encode($SPEECH_ID);?>;
var IS_EXTERNAL_SHARE = <?php echo json_encode($IS_EXTERNAL_SHARE);?>;

var today_speech_list = <?php echo json_encode($today_speech_list);?>;
var speech_project_list = <?php echo json_encode($speech_project_list);?>;
var member_list = <?php echo json_encode($member_list);?>;
var membership_obj = <?php echo json_encode($membership_obj);?>;
var meeting_agenda_obj = <?php echo json_encode($meeting_agenda_obj);?>;

var table_jq = $("table tbody#list");

// Header - Log In Treatment
// 지정된 스피치만 보여주는 경우에는 로그인 탭을 노출하지 않습니다.
if(!IS_EXTERNAL_SHARE && !(0 < SPEECH_ID)) {
	_tm_m_list.addHeaderRow(
		// login_user_info
		login_user_info
		// header_arr
		,[
			_link.get_header_link(
				_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
				,_param
				.get(_param.MEETING_ID, MEETING_ID)
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			)
			,_link.get_header_link(
				_link.MOBILE_MEETING_AGENDA_DETAIL
				,_param
				.get(_param.MEETING_ID, MEETING_ID)
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			)
			,_link.get_header_link(
				_link.MOBILE_MEETING_AGENDA_LIST
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
}


















// 지정된 스피치만 보여주는 경우에는 새로운 스피치를 추가할 수 없습니다.
if(!IS_EXTERNAL_SHARE && !(0 < SPEECH_ID)) {
	// Body - Content / 새로운 스피치를 추가합니다.
	_m_list.addTableRowBtn(
		// title
		"Add New Speech"
		// color
		, null
		// delegate_obj
		, _obj.getDelegate(function(){

			if(!confirm("Add New Speech?")){
				return;
			}

			var request_param_obj = 
			_param
			.get(_param.IS_INSERT_SPEECH,_param.YES)
			.get(_param.MEETING_ID,MEETING_ID)
			;

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj
				,request_param_obj
				// _delegate_after_job_done
				,_obj.get_delegate(function(data){

					_link.go_there(
						_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
						,_param
						.get(_param.MEETING_ID, MEETING_ID)
						.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
					);

				},this)
			); // ajax done.

		}, this)
		// append_target_jq
		, table_jq
	);	
}












// 0. 미팅 날짜 정보를 가져옵니다.
if(IS_EXTERNAL_SHARE === true) {

	_m_list.addTableRowTitle(
		// title
		membership_obj.__membership_name + " " + meeting_agenda_obj.__startdate
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(self_obj){

		}, this)
	);	

}



























// Speech Project List
var key_value_obj_speech_project_arr = [];
for(var idx = 0;idx < speech_project_list.length; idx++) {
	var speech_project_obj = speech_project_list[idx];
	var key_value_obj = 
	_obj.get_select_option(
		// key_str
		""+speech_project_obj.__speech_project_id
		// value_str
		,speech_project_obj.__speech_project_title.replace(/ - /gi, "<br/>")
	);

	key_value_obj_speech_project_arr.push(key_value_obj);
}
// SPEECH PROJECT LIST
var select_folder_speech_project = 
_m_list.addTableRowsSelectFolderV2(
	// key_value_obj_arr
	key_value_obj_speech_project_arr
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, _obj.getDelegate(function(delegate_data){
		// 내부의 내용은 각 롤에 할당될때 마다 변경됩니다.
	}, this)
	// delegate_data
	,_param
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
	// text_color
	, _color.COLOR_MEDIUM_GRAY
	// bg_color
	, _color.COLOR_WHITE
);




select_folder_speech_project.hide();





// Member List for speaker n evaluator.
var key_value_obj_member_arr = [];
for(var idx = 0;idx < member_list.length; idx++) {
	var member_obj = member_list[idx];
	var key_value_obj = 
	_obj.get_select_option(
		// key_str
		""+member_obj.__member_id
		// value_str
		,member_obj.__member_name
		// key_access_prop_name
		// value_access_prop_name
	);

	key_value_obj_member_arr.push(key_value_obj);
}
// MEMBER LIST
var select_folder_member = 
_m_list.addTableRowsSelectFolderV2(
	// key_value_obj_arr
	key_value_obj_member_arr
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, _obj.getDelegate(function(delegate_data){
		// 내부의 내용은 각 롤에 할당될때 마다 변경됩니다.
	}, this)
	// delegate_data
	,_param
	.get(_param.MEETING_ID, MEETING_ID)
	.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
	// text_color
	, _color.COLOR_MEDIUM_GRAY
	// bg_color
	, _color.COLOR_WHITE
);
select_folder_member.hide();























// Today's Speech List
var speech_order_num_arr = [];
for (var idx = 0; idx < today_speech_list.length; idx++) {
	var today_speech_obj = today_speech_list[idx];

	// __speech_id

	var slot_title = "";
	if(idx == 0) {
		// 1st speech
		slot_title = (idx + 1) + "st speech";
	} else if(idx == 1) {
		// 2nd speech
		slot_title = (idx + 1) + "nd speech";
	} else if(idx == 2) {
		// 3rd speech
		slot_title = (idx + 1) + "rd speech";
	} else {
		// 4th speech, 5th speech, ...
		slot_title = (idx + 1) + "th speech";
	}

	var delegate_data = 
	_param
	.get(_param.MEETING_ID,parseInt(today_speech_obj.__meeting_id))
	.get(_param.SPEECH_ID,parseInt(today_speech_obj.__speech_id))
	.get(_param.SPEECH_TITLE,today_speech_obj.__title)
	.get(_param.ORDER_NUM,idx)
	;

















	// 지정된 스피치가 있는 경우에는 스피치 순서를 변경할 수 없습니다.
	if(!IS_EXTERNAL_SHARE && !(0 < SPEECH_ID)) {

		// 0. Speech Order
		var accessor_speech_order = 
		_m_list.addTableRowTitleUpDown(
			// title
			slot_title
			// append_target_jq
			, table_jq
			// delegate_obj_click_btn_up
			, _obj.getDelegate(function(delegate_data){

				var MEETING_ID = delegate_data[_param.MEETING_ID];
				var SPEECH_ID = delegate_data[_param.SPEECH_ID];
				var ORDER_NUM = delegate_data[_param.ORDER_NUM];

				// 해당 스피치의 순서를 앞당긴다.
				if(speech_order_num_arr.length === 0) {
					// 스피치가 단 1개만 있습니다.
					alert("This is the only speech.");
					return;
				} else if(0 === ORDER_NUM) {
					// 선택한 스피치가 가장 마지막입니다.
					alert("This is the first speech.");
					return;
				}

				// 선택한 스피치의 이전 스피치의 speech_id, order_num을 가져온다.
				var prev_speech_id;
				var prev_speech_idx;
				var speech_idx;
				var prev_speech_order_num;
				for(var idx = 0; idx < speech_order_num_arr.length; idx++) {
					var speech_order = speech_order_num_arr[idx];
					if(SPEECH_ID === speech_order.SPEECH_ID) {
						speech_idx = idx;
						prev_speech_idx = idx-1;
						prev_speech = speech_order_num_arr[prev_speech_idx];
						prev_speech_id = prev_speech[_param.SPEECH_ID];
						prev_speech_order_num = prev_speech[_param.ORDER_NUM];
						break;
					}
				}

				// 업데이트시 보낼 데이터 배열을 만든다.
				var speech_table_row_idx_arr = [];
				for(var idx = 0; idx < speech_order_num_arr.length; idx++) {
					var speech_order = speech_order_num_arr[idx];
					
					if(speech_idx === idx) {
						// 선택된 스피치는 이전 스피치의 order_num을 사용	
						speech_table_row_idx_arr.push(
							_param
							.get(_param.SPEECH_ID,speech_order[_param.SPEECH_ID])
							.get(_param.ORDER_NUM,prev_speech_order_num)
						);
					} else if (prev_speech_idx === idx) {
						// 이전 스피치는 선택된 스피치의 order_num을 사용
						speech_table_row_idx_arr.push(
							_param
							.get(_param.SPEECH_ID,speech_order[_param.SPEECH_ID])
							.get(_param.ORDER_NUM,ORDER_NUM)
						);
					} else {
						// 나머지는 동일한 값을 사용. 업데이트 이후 변화 없음.
						speech_table_row_idx_arr.push(
							_param
							.get(_param.SPEECH_ID,speech_order[_param.SPEECH_ID])
							.get(_param.ORDER_NUM,speech_order[_param.ORDER_NUM])
						);
					}
				}

				var speech_table_row_info_arr_json_str = JSON.stringify(speech_table_row_idx_arr);

				// @ params
				var request_param_obj = 
				_param
				.get(_param.IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER, _param.YES)
				.get(_param.MEETING_ID, MEETING_ID)
				.get(_param.SPEECH_TABLE_ROW_INFO_ARR_JSON_STR, speech_table_row_info_arr_json_str)
				;

				// 이상이 없다면 업데이트!
				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj / MEETING_ID
					, request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){

							console.log(data);
							//console.log("사용자에게 업데이트가 완료되었음을 알립니다.");
							alert("Updated!");

							_tm_m_list.hideDocument();

							_link.go_there(
								_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
								,_param
								.get(_param.MEETING_ID, MEETING_ID)
								.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
							);

						},
						// delegate_scope
						this
					)
				); // ajax done.

			}, this)
			// delegate_obj_click_btn_down
			, _obj.getDelegate(function(delegate_data){

				var MEETING_ID = delegate_data[_param.MEETING_ID];
				var SPEECH_ID = delegate_data[_param.SPEECH_ID];
				var ORDER_NUM = delegate_data[_param.ORDER_NUM];

				// 해당 스피치의 순서를 뒤로 미룬다.
				if(speech_order_num_arr.length === 0) {
					// 스피치가 단 1개만 있습니다.
					alert("This is the only speech.");
					return;
				} else if((speech_order_num_arr.length - 1) === ORDER_NUM) {
					// 선택한 스피치가 가장 마지막입니다.
					alert("This is the last speech.");
					return;
				}

				// 선택한 스피치의 이후 스피치의 speech_id, order_num을 가져온다.
				var next_speech_id;
				var next_speech_idx;
				var speech_idx;
				var next_speech_order_num;
				for(var idx = 0; idx < speech_order_num_arr.length; idx++) {
					var speech_order = speech_order_num_arr[idx];
					if(SPEECH_ID === speech_order.SPEECH_ID) {
						speech_idx = idx;
						next_speech_idx = idx+1;
						next_speech = speech_order_num_arr[next_speech_idx];
						next_speech_id = next_speech[_param.SPEECH_ID];
						next_speech_order_num = next_speech[_param.ORDER_NUM];
						break;
					}
				}

				// 업데이트시 보낼 데이터 배열을 만든다.
				var speech_table_row_idx_arr = [];
				for(var idx = 0; idx < speech_order_num_arr.length; idx++) {
					var speech_order = speech_order_num_arr[idx];
					
					if(speech_idx === idx) {
						// 선택된 스피치는 이전 스피치의 order_num을 사용	
						speech_table_row_idx_arr.push(
							_param
							.get(_param.SPEECH_ID,speech_order[_param.SPEECH_ID])
							.get(_param.ORDER_NUM,next_speech_order_num)
						);
					} else if (next_speech_idx === idx) {
						// 이전 스피치는 선택된 스피치의 order_num을 사용
						speech_table_row_idx_arr.push(
							_param
							.get(_param.SPEECH_ID,speech_order[_param.SPEECH_ID])
							.get(_param.ORDER_NUM,ORDER_NUM)
						);
					} else {
						// 나머지는 동일한 값을 사용. 업데이트 이후 변화 없음.
						speech_table_row_idx_arr.push(
							_param
							.get(_param.SPEECH_ID,speech_order[_param.SPEECH_ID])
							.get(_param.ORDER_NUM,speech_order[_param.ORDER_NUM])
						);
					}
				}

				var speech_table_row_info_arr_json_str = JSON.stringify(speech_table_row_idx_arr);

				// @ params
				var request_param_obj = 
				_param
				.get(_param.IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER, _param.YES)
				.get(_param.MEETING_ID, MEETING_ID)
				.get(_param.SPEECH_TABLE_ROW_INFO_ARR_JSON_STR, speech_table_row_info_arr_json_str)
				;

				// 이상이 없다면 업데이트!
				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj / MEETING_ID
					, request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(
						// delegate_func
						function(data){

							console.log(data);
							console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

							_tm_m_list.hideDocument();

							_link.go_there(
								_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
								,_param
								.get(_param.MEETING_ID, MEETING_ID)
								.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
							);

						},
						// delegate_scope
						this
					)
				); // ajax done.			

			}, this)
			// delegate_data
			, delegate_data
		);
		speech_order_num_arr.push(delegate_data);
		if(idx == 0) {
			// first btn
			accessor_speech_order.disable_btn_up();	
		} else if(idx == (today_speech_list.length - 1)) {
			// last btn
			accessor_speech_order.disable_btn_down();
		}		

	}


















	// 1. Speech Title
	var speech_title =
	_m_list.addTableRowTextInputInline(
		// title
		"Title"
		// append_target_jq
		, table_jq
		// place holder
		, "type speech title"
		// value
		, today_speech_obj.__title
		// delegate_on_blur
		, _obj.getDelegate(function(accessor){

			console.log("speech_title / blur / accessor :: ",accessor);

			var cur_title = accessor.get();
			var param_obj = accessor.get_param_obj();
			var SPEECH_ID = parseInt(param_obj.SPEECH_ID);
			var prev_title = param_obj[_param.SPEECH_TITLE];

			if(_v.is_not_valid_str(cur_title)) {
				console.log("!STOP! / title is not valid!");
				return;	
			}

			if(prev_title === cur_title) {
				console.log("!STOP! / title does not changed at all!");
				return;	
			}

			// 이상이 없다면 업데이트!
			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj / MEETING_ID
				, _param
				.get(_param.IS_UPDATE_SPEECH_TITLE,_param.YES)
				.get(_param.SPEECH_ID,SPEECH_ID)
				.get(_param.SPEECH_TITLE,cur_title)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						// console.log(data);
						// console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

						alert("Updated!");

					},
					// delegate_scope
					this
				)
			); // ajax done.

		}, this)
		// param_obj
		, _param
		.get(_param.MEETING_ID,MEETING_ID)
		.get(_param.SPEECH_ID,parseInt(today_speech_obj.__speech_id))
		.get(_param.SPEECH_TITLE,today_speech_obj.__title)
	);












	// 2. Speech Project
	var edited_project_title = today_speech_obj.__speech_project_title;
	var project_title_arr = edited_project_title.split(" - ");
	if(project_title_arr.length > 1) {
		// 긴 제목일 경우의 처리. ' - '로 구분되어 있음.
		edited_project_title = project_title_arr[1];
	}

	var row_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Project"
		// title_on_badge
		, edited_project_title
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

				console.log("!Error!\taddTableRowMovingArrowWidthBadge\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
				return;
			}

			if(_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {
				return;
			}



			// 선택할 수 있는 스피치 프로젝트 리스트를 보여줍니다.
			var row_project_jq = delegate_data.target_jq;
			select_folder_speech_project.toggle_folder(
				// delegate_obj
				_obj.getDelegate(function(selected_delegate_data){

					// 사용자가 선택한 스피치 프로젝트로 업데이트합니다.
					var SPEECH_ID = selected_delegate_data[_param.SPEECH_ID];
					var SELECTED_KEY = selected_delegate_data[_param.SELECTED_KEY];
					var SELECTED_VALUE = selected_delegate_data[_param.SELECTED_VALUE];
					var target_controller = selected_delegate_data.target_controller;

					_ajax.send_simple_post(
						// _url
						_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
						// _param_obj / MEETING_ID
						, _param
						.get(_param.IS_UPDATE_SPEECH_PROJECT,_param.YES)
						.get(_param.SPEECH_ID,SPEECH_ID)
						.get(_param.SPEECH_PROJECT_ID,SELECTED_KEY)

						// _delegate_after_job_done
						,_obj.get_delegate(
							// delegate_func
							function(data){

								console.log(data);
								// console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

								var is_success = false;
								if(	data != undefined && 
									_v.is_valid_array(data.query_output_arr) &&
									data.query_output_arr[0] != undefined &&
									data.query_output_arr[0].output != undefined ) {

									is_success = data.query_output_arr[0].output;
								}

								if(is_success) {

									alert("Updated!");

									// 성공했다면 표시된 프로젝트 명, 키값을 변경해준다.
									var project_title_arr = SELECTED_VALUE.split("<br>");
									if(project_title_arr.length > 1) {
										// 긴 제목일 경우의 처리. ' - '로 구분되어 있음.
										row_project_jq.find("span.badge").find("strong").html(project_title_arr[1]);
									} else {
										row_project_jq.find("span.badge").find("strong").html(SELECTED_VALUE);
									}

									// 프로젝트 명이 "Not Assigned"라면 gray, 나머지는 green
									if(SELECTED_VALUE === _param.NOT_ASSIGNED) {
										target_controller.set_badge_gray();
									} else {
										target_controller.set_badge_green();
									}
									
								} else {
									alert("Update failed!");
								}

							},
							// delegate_scope
							this
						)
					); // ajax done.						

				},this)
				// delegate_data
				, delegate_data
			);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, MEETING_ID)
		.get(_param.SPEECH_ID,parseInt(today_speech_obj.__speech_id))
		.get(_param.SPEECH_PROJECT_ID,parseInt(today_speech_obj.__speech_project_id))
		.get(_param.SPEECH_PROJECT_TITLE,today_speech_obj.__speech_project_title)
		// text_color_vmouse_down
		// bg_color_vmouse_down
		// text_color
		// bg_color
	);
	if(today_speech_obj.__speech_project_title === _param.NOT_ASSIGNED ) {
		row_controller.set_badge_gray();
	} else {
		row_controller.set_badge_green();
	}















	// 3. Speaker
	row_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Speaker"
		// title_on_badge
		, today_speech_obj.__speaker_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

				console.log("!Error!\taddTableRowMovingArrowWidthBadge\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
				return;
			}

			if(_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {
				return;
			}

			// 선택할 수 있는 스피치 프로젝트 리스트를 보여줍니다.
			var row_member_jq = delegate_data.target_jq;
			select_folder_member.toggle_folder(
				// delegate_obj
				_obj.getDelegate(function(selected_delegate_data){

					// 사용자가 선택한 스피치 프로젝트로 업데이트합니다.
					var SPEECH_ID = selected_delegate_data[_param.SPEECH_ID];
					var SELECTED_KEY = selected_delegate_data[_param.SELECTED_KEY];
					var SELECTED_VALUE = selected_delegate_data[_param.SELECTED_VALUE];
					var target_controller = selected_delegate_data.target_controller;

					console.log("SELECTED_VALUE :: ",SELECTED_VALUE);

					_ajax.send_simple_post(
						// _url
						_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
						// _param_obj / MEETING_ID
						, _param
						.get(_param.IS_UPDATE_SPEECH_SPEAKER,_param.YES)
						.get(_param.SPEECH_ID,SPEECH_ID)
						.get(_param.SPEECH_SPEAKER_MEMBER_ID,SELECTED_KEY)

						// _delegate_after_job_done
						,_obj.get_delegate(
							// delegate_func
							function(data){

								// console.log(data);
								// console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

								alert("Updated!");

								var is_success = false;
								if(	data != undefined && 
									_v.is_valid_array(data.query_output_arr) &&
									data.query_output_arr[0] != undefined &&
									data.query_output_arr[0].output != undefined ) {

									is_success = data.query_output_arr[0].output;
								}

								if(is_success) {
									// 성공했다면 표시된 값을 변경해준다.
									row_member_jq.find("span.badge").find("strong").html(SELECTED_VALUE);

									if(SELECTED_VALUE  === _param.NOT_ASSIGNED) {
										target_controller.set_badge_gray();
									} else {
										target_controller.set_badge_green();
									}


								} else {
									alert("Update failed!");
								}

							},
							// delegate_scope
							this
						)
					); // ajax done.

				},this)
				// delegate_data
				, delegate_data
			);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, MEETING_ID)
		.get(_param.SPEECH_ID,parseInt(today_speech_obj.__speech_id))
		.get(_param.SPEECH_SPEAKER_MEMBER_ID,parseInt(today_speech_obj.__speaker_member_id))
		.get(_param.SPEECH_SPEAKER_MEMBER_NAME,today_speech_obj.__speaker_member_name)
		// text_color_vmouse_down
		// bg_color_vmouse_down
		// text_color
		// bg_color
	);
	if(today_speech_obj.__speaker_member_name  === _param.NOT_ASSIGNED) {
		row_controller.set_badge_gray();
	} else {
		row_controller.set_badge_green();
	}











	// 4. Evaluator
	row_controller = 
	_m_list.addTableRowTitleNBadge(
		// title
		"Evaluator"
		// title_on_badge
		, today_speech_obj.__evaluator_member_name
		// append_target_jq
		, table_jq
		// delegate_obj_click_row
		, _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

				console.log("!Error!\taddTableRowMovingArrowWidthBadge\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
				return;
			}

			if(_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {
				return;
			}

			// 선택할 수 있는 스피치 프로젝트 리스트를 보여줍니다.
			var row_member_jq = delegate_data.target_jq;
			select_folder_member.toggle_folder(
				// delegate_obj
				_obj.getDelegate(function(selected_delegate_data){

					// 사용자가 선택한 스피치 프로젝트로 업데이트합니다.
					var SPEECH_ID = selected_delegate_data[_param.SPEECH_ID];
					var SELECTED_KEY = selected_delegate_data[_param.SELECTED_KEY];
					var SELECTED_VALUE = selected_delegate_data[_param.SELECTED_VALUE];
					var SPEECH_EVALUATOR_MEMBER_ID = selected_delegate_data[_param.SPEECH_EVALUATOR_MEMBER_ID];

					console.log("SPEECH_EVALUATOR_MEMBER_ID :: ",SPEECH_EVALUATOR_MEMBER_ID);

					

					var request_param = 
					_param
					.get(_param.IS_INSERT_SPEECH_EVALUATOR,_param.YES)
					.get(_param.SPEECH_ID,SPEECH_ID)
					.get(_param.SPEECH_EVALUATOR_MEMBER_ID,SELECTED_KEY)
					;
					if(SPEECH_EVALUATOR_MEMBER_ID > 0) {
						request_param = 
						_param
						.get(_param.IS_UPDATE_SPEECH_EVALUATOR,_param.YES)
						.get(_param.SPEECH_ID,SPEECH_ID)
						.get(_param.SPEECH_EVALUATOR_MEMBER_ID,SELECTED_KEY)
						;
					}

					_ajax.send_simple_post(
						// _url
						_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
						// _param_obj / MEETING_ID
						, request_param
						// _delegate_after_job_done
						,_obj.get_delegate(
							// delegate_func
							function(data){

								// console.log(data);
								// console.log("사용자에게 업데이트가 완료되었음을 알립니다.");

								alert("Updated!");

								var is_success = false;
								if(	data != undefined && 
									_v.is_valid_array(data.query_output_arr) &&
									data.query_output_arr[0] != undefined &&
									data.query_output_arr[0].output != undefined ) {

									is_success = data.query_output_arr[0].output;
								}

								if(is_success) {
									// 성공했다면 표시된 값을 변경해준다.
									row_member_jq.find("span.badge").find("strong").html(SELECTED_VALUE);
								} else {
									alert("Update failed!");
								}

							},
							// delegate_scope
							this
						)
					); // ajax done.

				},this)
				// delegate_data
				, delegate_data
			);

		}, this)
		// delegate_data
		, _param
		.get(_param.MEETING_ID, MEETING_ID)
		.get(_param.SPEECH_ID,parseInt(today_speech_obj.__speech_id))
		.get(_param.SPEECH_EVALUATOR_MEMBER_ID,parseInt(today_speech_obj.__evaluator_member_id))
		.get(_param.SPEECH_EVALUATOR_MEMBER_NAME,today_speech_obj.__evaluator_member_name)
		// text_color_vmouse_down
		// bg_color_vmouse_down
		// text_color
		// bg_color
	);
	if(0 < parseInt(today_speech_obj.__evaluator_member_id)) {
		row_controller.set_badge_green();
	} else {
		row_controller.set_badge_gray();
	}





	// 지정된 스피치가 있는 경우에는 공유버튼을 노출할 수 없습니다.
	if(!IS_EXTERNAL_SHARE && !(0 < SPEECH_ID)) {

		console.log(">>> today_speech_obj :: ",today_speech_obj);

		// SHARE EXTERNAL
		var share_msg = 
		membership_obj.__membership_desc + "\n" + 
		"Speech on " + meeting_agenda_obj.__startdate + "\n\n" + 
		"Title : \n" + today_speech_obj.__title + "\n\n" + 
		"Speaker : \n" + today_speech_obj.__speaker_member_name + "\n\n" + 
		"Evaluator : \n" + today_speech_obj.__evaluator_member_name + "\n\n" + 
		"Take your ribbon!";
		var accessor_external_share =
		_m_list.addTableRowShareExternal(
			// title
			"Share"
			// append_target_jq
			,table_jq
			// label
			,share_msg
			// url_desc
			,"Magendas"
			// url
			,_link.get_link(
				_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
				,_param
				.get(_param.IS_EXTERNAL_SHARE, _param.YES)
				.get(_param.MEETING_ID, MEETING_ID)
				.get(_param.SPEECH_ID,parseInt(today_speech_obj.__speech_id))
				.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
			)
			// img_url
			,service_root_path + _link.IMG_SHARE_KAKAO_TM_RIBBONS
		);

	}





	// 지정된 스피치가 있는 경우에는 삭제버튼을 노출할 수 없습니다.
	if(!IS_EXTERNAL_SHARE && !(0 < SPEECH_ID)) {

		// 스피치를 삭제합니다.
		_m_list.addTableRowBtn(
			// title
			"Remove"
			// color
			, null
			// delegate_obj
			, _obj.getDelegate(function(delegate_data){

				if(delegate_data === undefined) {
					return;
				}

				if(!confirm("\"" + delegate_data.SPEECH_TITLE + "\"" + "\nRemove Speech?")){
					return;
				}

				// @ params
				var request_param_obj = 
				_param
				.get(_param.IS_DELETE_SPEECH,delegate_data.IS_DELETE_SPEECH)
				.get(_param.MEETING_ID,delegate_data.MEETING_ID)
				.get(_param.SPEECH_ID,parseInt(delegate_data.SPEECH_ID))
				;

				_ajax.send_simple_post(
					// _url
					_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
					// _param_obj
					,request_param_obj
					// _delegate_after_job_done
					,_obj.get_delegate(function(data){

						_link.go_there(
							_link.MOBILE_MEETING_AGENDA_DETAIL_SPEECH
							,_param
							.get(_param.MEETING_ID, MEETING_ID)
							.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
						);

					},this)
				); // ajax done.

			}, this)
			// append_target_jq
			, table_jq
			// delegate_data
			, _param
			.get(_param.IS_DELETE_SPEECH,_param.YES)
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.SPEECH_ID,parseInt(today_speech_obj.__speech_id))
			.get(_param.SPEECH_TITLE,today_speech_obj.__title)
		);

	}






} // for end








// 99. REMOVE loading message
_tm_m_list.doWhenDocumentReady();



</script>
</body>
</html>
