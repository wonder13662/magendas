<?php

// common setting
include_once("../../common.inc");

// Membership Check
$MEETING_MEMBERSHIP_ID = ToastMasterLogInManager::getMembershipCookie();
if($MEETING_MEMBERSHIP_ID == -1) {
	// 인스턴스 페이지 사용을 위해 멤버쉽 정보를 받을 수 있도록 변경합니다.
	$MEETING_MEMBERSHIP_ID = $params->getParamNumber($params->MEETING_MEMBERSHIP_ID, -1);	
}
if($MEETING_MEMBERSHIP_ID == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
} else {
	// get membership info
	$membership_obj_arr = $wdj_mysql_interface->getMembership($MEETING_MEMBERSHIP_ID);
	$membership_obj = $membership_obj_arr[0];
}

$MEETING_ID = $params->getParamString($params->MEETING_ID, "");

$IS_EXTERNAL_SHARE = $params->isYes($params->IS_EXTERNAL_SHARE);
$IS_IFRAME_VIEW = $params->isYes($params->IS_IFRAME_VIEW);

// 템플릿 정보를 가져옵니다.
$AGENDA_TEMPLATE_ARRAY = array();

//
$IFRAME_PARENT_ACCESS_NAME = $params->getParamString($params->IFRAME_PARENT_ACCESS_NAME, "");

$meeting_agenda_obj_immediate_past = 
$wdj_mysql_interface->get_immediate_past_meeting_agenda($MEETING_MEMBERSHIP_ID);

$template_prev_meeting = new stdClass();
$template_prev_meeting->value = "Previous meeting";
$template_prev_meeting->key = $params->ACTION_TEMPLATE_PREV_MEETING;
array_push($AGENDA_TEMPLATE_ARRAY, $template_prev_meeting);

$template_BDTM = new stdClass();
$template_BDTM->value = "Bundang Toastmasters";
$template_BDTM->key = $params->ACTION_TEMPLATE_BUNDANG;
array_push($AGENDA_TEMPLATE_ARRAY, $template_BDTM);

$template_SuwonTM = new stdClass();
$template_SuwonTM->value = "Suwon Toastmasters";
$template_SuwonTM->key = $params->ACTION_TEMPLATE_SUWON;
array_push($AGENDA_TEMPLATE_ARRAY, $template_SuwonTM);



// 템플릿 리스트를 보여줍니다.
// 유저가 템플릿을 선택하면 템플릿 편집화면으로 이동.


/*
	// 지난번의 아젠다 정보
	if(!is_null($meeting_agenda_obj_immediate_past)) {

		$immediate_prev_meeting_id = $meeting_agenda_obj_immediate_past->__meeting_id;
		$immediate_prev_meeting_startdate = $meeting_agenda_obj_immediate_past->__startdate;

		echo "<div class=\"col-xs-6 col-md-3\" style=\"padding-left:0px;\">";
		echo "<a id=\"agenda_template\" meeting_id=\"$MEETING_ID\" src_meeting_id=\"$immediate_prev_meeting_id\" action_template=\"$params->ACTION_TEMPLATE_PREV_MEETING\" class=\"thumbnail\" style=\"width:120px;text-decoration:none;font-size:10px;text-align:center;\">$immediate_prev_meeting_startdate<img src=\"$service_root_path/images/AGENDA_THUMBNAIL_240x339.png\" alt=\"Recent Agenda\"></a>";
		echo "</div>";
	}

	// 여기서부터 템플릿 정보 - 코드로 제어합니다. DB에 의존하지 않습니다.
	echo "<div class=\"col-xs-6 col-md-3\" style=\"padding-left:0px;\">";
	echo "<a id=\"agenda_template\" meeting_id=\"$MEETING_ID\" src_meeting_id=\"-1\" action_template=\"$params->ACTION_TEMPLATE_BUNDANG\" class=\"thumbnail\" style=\"width:120px;text-decoration:none;font-size:10px;text-align:center;\">Default<img src=\"$service_root_path/images/AGENDA_THUMBNAIL_240x339.png\" alt=\"Recent Agenda\"></a>";
	echo "</div>";

	// 여기서부터 템플릿 정보 - 코드로 제어합니다. DB에 의존하지 않습니다. / 수원 클럽
	echo "<div class=\"col-xs-6 col-md-3\" style=\"padding-left:0px;\">";
	echo "<a id=\"agenda_template\" meeting_id=\"$MEETING_ID\" src_meeting_id=\"-1\" action_template=\"$params->ACTION_TEMPLATE_SUWON\" class=\"thumbnail\" style=\"width:120px;text-decoration:none;font-size:10px;text-align:center;\">Suwon TM<img src=\"$service_root_path/images/AGENDA_THUMBNAIL_240x339.png\" alt=\"Recent Agenda\"></a>";
	echo "</div>";
*/


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
var IS_IFRAME_VIEW = <?php echo json_encode($IS_IFRAME_VIEW);?>;

var AGENDA_TEMPLATE_ARRAY = <?php echo json_encode($AGENDA_TEMPLATE_ARRAY);?>;
console.log("AGENDA_TEMPLATE_ARRAY ::: ",AGENDA_TEMPLATE_ARRAY);

var IFRAME_PARENT_ACCESS_NAME = <?php echo json_encode($IFRAME_PARENT_ACCESS_NAME);?>;
console.log("IFRAME_PARENT_ACCESS_NAME ::: ",IFRAME_PARENT_ACCESS_NAME);

//IFRAME_PARENT_ACCESS_NAME

var table_jq = $("table tbody#list");

// IFRAME - FUNCTION
var send_height_to_parent = function(IS_IFRAME_VIEW, IFRAME_PARENT_ACCESS_NAME, parent_obj) {

	if(IS_IFRAME_VIEW == undefined && IS_IFRAME_VIEW !== true) {
		return;
	}
	if(parent_obj == undefined) {
		return;	
	}
	var parent_accessor = parent_obj[IFRAME_PARENT_ACCESS_NAME];
	if(parent_accessor == undefined) {
		return;
	}

	var container = $("tbody#list");
	var container_height = container.height();

	var prev_height = parseInt(container.attr("prev_height"));

	if(	(0 < container_height) && 
		(prev_height != container_height)) {

		parent_accessor.set_iframe_height(container_height);
		container.attr("prev_height", container_height);

	} // end if

}

var key_value_obj_arr = [];
for(var idx = 0;idx < AGENDA_TEMPLATE_ARRAY.length; idx++) {
	var agenda_template_obj = AGENDA_TEMPLATE_ARRAY[idx];

	var key_value_obj = 
	_obj.get_select_option(
		// key_str
		agenda_template_obj.key
		// value_str
		,agenda_template_obj.value
	);

	key_value_obj_arr.push(key_value_obj);
}
var row_template_obj = 
_m_list.addTableRowsSelectFolder(
	// key_value_obj_arr
	key_value_obj_arr
	// append_target_jq
	, table_jq
	// delegate_obj_click_row
	, _obj.getDelegate(function(delegate_data){

		// 내부의 내용은 각 롤에 할당될때 마다 변경됩니다.
		console.log("delegate_data ::: ",delegate_data);

		var MEETING_ID = -1;
		var key = "";
		if(delegate_data != null && delegate_data.delegate_data != null) {

			var target_jq = delegate_data.delegate_data.get_target_jq();
			MEETING_ID = parseInt(delegate_data.delegate_data.delegate_data.MEETING_ID);
			key = target_jq.attr("key");

			console.log("key ::: ",key);
			console.log("MEETING_ID ::: ",MEETING_ID);

		}
		if(_v.is_not_unsigned_number(MEETING_ID)) {
			return;
		}
		if( _v.is_not_valid_str(key)) {
			return;
		}

		// template update
		var request_param_obj =
		_param
		.get(_param.EVENT_PARAM_EVENT_TYPE,_param.EVENT_TYPE_INSERT_ITEM)
		.get(_param.MEETING_ID,MEETING_ID)
		.get(_param.MEETING_MEMBERSHIP_ID,MEETING_MEMBERSHIP_ID)
		.get(_param.ACTION_TEMPLATE_NAME,key)
		.get(_param.ACTION_NAME,"No Theme")
		;

		var msg_confirm = "WARNING!\nAre you sure overwriting timeline?\nCurrent timeline will be removed.";
		if(!confirm(msg_confirm)) {
			return;
		}

		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_UPDATE_ACTION_TEMPLATE)
			// _param_obj
			,request_param_obj
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){
					
					console.log("API_UPDATE_ACTION_TEMPLATE");
					console.log(">>> data : ",data);

					// RELOAD
					// wonder.jung


				}, // delegate_func end
				// delegate_scope
				this
			)
		); // ajax done.			


	}, this)
	// delegate_data
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
	// text_color
	, _color.COLOR_MEDIUM_GRAY
	// bg_color
	, _color.COLOR_WHITE
);




$(document).ready(function(){
	console.log("HERE!");
	// row_template_obj.show();

	send_height_to_parent(IS_IFRAME_VIEW, IFRAME_PARENT_ACCESS_NAME, parent);
});



// REMOVE Loading message
_tm_m_list.doWhenDocumentReady();

</script>
</body>
</html>
