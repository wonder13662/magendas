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

	$login_user_info->__membership_id = $membership_obj->__membership_id;
	$login_user_info->__membership_name = $membership_obj->__membership_name;
}

$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);
$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgenda($MEETING_MEMBERSHIP_ID, $MEETING_ID);
if(!empty($meeting_agenda_list)) {
	$meeting_agenda_obj = $meeting_agenda_list[0];
}

$news_list = $wdj_mysql_interface->getNews($MEETING_ID);

$IS_EXTERNAL_SHARE = $params->isYes($params->IS_EXTERNAL_SHARE);

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

<table class="table">

	<tbody id="list">
		
	</tbody>

</table>


<script>

// php to javascript sample
var MEETING_ID = <?php echo json_encode($MEETING_ID);?>;
var MEETING_MEMBERSHIP_ID = <?php echo json_encode($MEETING_MEMBERSHIP_ID);?>;
var IS_EXTERNAL_SHARE = <?php echo json_encode($IS_EXTERNAL_SHARE);?>;

var news_id = <?php echo json_encode($news_id);?>;
var news_list = <?php echo json_encode($news_list);?>;
var service_root_path = <?php echo json_encode($service_root_path);?>;

var membership_obj = <?php echo json_encode($membership_obj);?>;
var meeting_agenda_obj = <?php echo json_encode($meeting_agenda_obj);?>;

console.log(">> IS_EXTERNAL_SHARE :: ",IS_EXTERNAL_SHARE);
console.log(">> membership_obj :: ",membership_obj);
console.log(">> meeting_agenda_obj :: ",meeting_agenda_obj);

console.log(">> news_list :: ",news_list);


var table_jq = $("table tbody#list");

// Header - Log In Treatment
if(!IS_EXTERNAL_SHARE) {

	_tm_m_list.addHeaderRow(
		// login_user_info
		login_user_info
		// header_arr
		,[
			_link.get_header_link(
				_link.MOBILE_MEETING_AGENDA_DETAIL_NEWS
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

} else {

	// show brief meeting info
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

// Body - Content




// TODO event management
// convert news list into value array
var news_value_array = [];
if(_v.is_valid_array(news_list)) {
	for(var idx = 0; idx < news_list.length; idx++) {
		var news_obj = news_list[idx];
		var news_key = parseInt(news_obj.__news_id);
		var news_value = news_obj.__news_content;

		console.log(news_obj);

		if(!(news_key > 0)) {
			console.log("!Error! / news_key is not valid! / idx :: ",idx);
		} else {
			var news_key_value_obj = {
				key:news_key
				, value:news_value
			};

			news_value_array.push(news_key_value_obj);
		} // if end
	} // for end
} // if end

// 1. NEWS
var accessor_theme =
_m_list.addTableRowTextInputFlexible(
	// title
	"Add News"
	// append_target_jq
	,table_jq
	// place holder
	,"type meeting theme"
	// value array
	, news_value_array
	// delegate_on_delete
	, _obj.getDelegate(function(delegate_data){

		// console.log(">>> delegate_data :: ",delegate_data);
		// console.log(">>> delegate_data._key :: ",delegate_data._key);
		// console.log(">>> delegate_data._value :: ",delegate_data._value);

		var cur_event = delegate_data[_param.EVENT_PARAM_EVENT_TYPE];
		var key = parseInt(delegate_data[_param.EVENT_PARAM_KEY]);
		var value = delegate_data[_param.EVENT_PARAM_VALUE];
		var target_jq = delegate_data[_param.EVENT_PARAM_TARGET_JQ];

		console.log(">>> cur_event :: ",cur_event);
		console.log(">>> key :: ",key);
		console.log(">>> value :: ",value);

		if(_param.EVENT_INSERT === cur_event && key == -1 && _v.is_valid_str(value)) {

			// 새로운 뉴스를 추가한 이후, 뉴스의 id를 열에 업데이트 해줘야 합니다.
			// 이상이 없다면 업데이트!
			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj / MEETING_ID
				, _param
				.get(_param.IS_INSERT_NEWS,_param.YES)
				.get(_param.MEETING_ID,MEETING_ID)
				.get(_param.NEWS_CONTENTS,value)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(data);

						// TODO 사용자에게 업데이트가 완료되었음을 알립니다.
						// TOAST POPUP 찾아볼 것
						alert("Updated!");

					}
					// delegate_scope
					, this
				)
			); // ajax done.

		} else if((_param.EVENT_INSERT === cur_event || _param.EVENT_UPDATE === cur_event) && (0 < key) && _v.is_valid_str(value)) {

			// 이상이 없다면 업데이트!
			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj / MEETING_ID
				, _param
				.get(_param.IS_UPDATE_NEWS,_param.YES)
				.get(_param.MEETING_ID,MEETING_ID)
				.get(_param.NEWS_ID,key)
				.get(_param.NEWS_CONTENTS,value)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(data);

						// TODO 사용자에게 업데이트가 완료되었음을 알립니다.
						// TOAST POPUP 찾아볼 것
						alert("Updated!");

					}
					// delegate_scope
					, this
				)
			); // ajax done.			

		} else if(_param.EVENT_DELETE === cur_event && (key > 0)) {

			// IS_DELETE_NEWS
			// NEWS_ID

			console.log("IS_DELETE_NEWS");

			// 이상이 없다면 업데이트!
			if(!confirm("REMOVE NEWS?")){
				return;
			}

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_UPDATE_MEETING_AGENDA)
				// _param_obj / MEETING_ID
				, _param
				.get(_param.IS_DELETE_NEWS,_param.YES)
				.get(_param.MEETING_ID,MEETING_ID)
				.get(_param.NEWS_ID,key)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log(data);

						console.log(">>> target_jq :: ",target_jq);

						target_jq.remove();

					},
					// delegate_scope
					this
				)
			); // ajax done.			


		}

	}, this)
	// param_obj
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
);






// SHARE EXTERNAL
if(!IS_EXTERNAL_SHARE) {

	_m_list.addTableRowShareExternal(
		// title
		"Share"
		// append_target_jq
		,table_jq
		// label
		,"Magendas"
		// url_desc
		,"Magendas"
		// url
		,_link.get_link(
			_link.MOBILE_MEETING_AGENDA_DETAIL_NEWS
			,_param
			.get(_param.IS_EXTERNAL_SHARE, _param.YES)
			.get(_param.MEETING_ID, MEETING_ID)
			.get(_param.MEETING_MEMBERSHIP_ID, MEETING_MEMBERSHIP_ID)
		)
	);

}








// 99. REMOVE Loading message
_tm_m_list.doWhenDocumentReady();


</script>
</body>
</html>
