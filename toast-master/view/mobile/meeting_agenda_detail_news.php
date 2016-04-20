<?php

// common setting
include_once("../../common.inc");

$IS_EXTERNAL_SHARE = $params->isYes($params->IS_EXTERNAL_SHARE);
$IS_IFRAME_VIEW = $params->isYes($params->IS_IFRAME_VIEW);

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

$MEETING_ID = $params->getParamNumber($params->MEETING_ID, -1);
$meeting_agenda_list = $wdj_mysql_interface->getMeetingAgenda($MEETING_MEMBERSHIP_ID, $MEETING_ID);
if(!empty($meeting_agenda_list)) {
	$meeting_agenda_obj = $meeting_agenda_list[0];
}

// $news_list = $wdj_mysql_interface->getNews($MEETING_ID);

// club news는 action timeline에서 가져와 추가합니다.






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
var IS_IFRAME_VIEW = <?php echo json_encode($IS_IFRAME_VIEW);?>;

var news_id = <?php echo json_encode($news_id);?>;
var news_list = <?php echo json_encode($news_list);?>;
var service_root_path = <?php echo json_encode($service_root_path);?>;

var membership_obj = <?php echo json_encode($membership_obj);?>;
var meeting_agenda_obj = <?php echo json_encode($meeting_agenda_obj);?>;

var table_jq = $("table tbody#list");

// IFRAME - FUNCTION
var send_height_to_parent = function(IS_IFRAME_VIEW, parent_obj) {

	console.log("XXX / 001");

	if(IS_IFRAME_VIEW == undefined && IS_IFRAME_VIEW !== true) {
		return;
	}
	if(parent_obj == undefined) {
		return;	
	}
	var accessor_news = parent_obj.accessor_news;
	if(accessor_news == undefined) {
		return;
	}

	console.log("XXX / 002");

	var container = $("table tbody#list");
	var container_height = container.height();

	if(0 < container_height) {
		console.log("container_height ::: ",container_height);
		accessor_news.set_iframe_height(container_height);	
	}

}


// Header - Log In Treatment
if(!IS_EXTERNAL_SHARE && !IS_IFRAME_VIEW) {

	_tm_m_list.addHeaderRow(
		// login_user_info
		login_user_info
		// membership_obj
		, membership_obj
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

} else if(!IS_IFRAME_VIEW) {

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
	,"What's New?"
	// value array
	, news_value_array
	// delegate_on_delete
	, _obj.getDelegate(function(delegate_data){

		var cur_event = delegate_data[_param.EVENT_PARAM_EVENT_TYPE];
		var key = parseInt(delegate_data[_param.EVENT_PARAM_KEY]);
		var value = delegate_data[_param.EVENT_PARAM_VALUE];
		var target_jq = delegate_data[_param.EVENT_PARAM_TARGET_JQ];

		console.log("XXX / cur_event ::: ",cur_event);

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

						send_height_to_parent(IS_IFRAME_VIEW, parent);

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

						send_height_to_parent(IS_IFRAME_VIEW, parent);

					},
					// delegate_scope
					this
				)
			); // ajax done.

		} else {
			send_height_to_parent(IS_IFRAME_VIEW, parent);
		}

	}, this)
	// param_obj
	, _param
	.get(_param.MEETING_ID,MEETING_ID)
);






// SHARE EXTERNAL
if(!IS_EXTERNAL_SHARE && !IS_IFRAME_VIEW) {

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
		// img_url
		,service_root_path + _link.IMG_SHARE_KAKAO_TM_LONG_BANNER
	);

}








// 99. REMOVE Loading message
var delegate_on_ready = 
_obj.getDelegate(function(){
	send_height_to_parent(IS_IFRAME_VIEW, parent);
}, this);
_tm_m_list.doWhenDocumentReady(delegate_on_ready);


</script>
</body>
</html>
