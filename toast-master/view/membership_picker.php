<?php

// common setting
include_once("../common.inc");

$all_membership_list = $wdj_mysql_interface->getAllMembership();

$cookie_meeting_membership_id = ToastMasterLogInManager::getMembershipCookie();

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

// Load signin css. Signin page only.
echo "<link href=\"$service_root_path/css/bootstrap/signin/signin.css\" rel=\"stylesheet\">";
?>

</head>



<body role="document">

    <div class="container">

		<form class="form-signin" role="form">

			<div class="alert alert-info" role="alert">
				<strong>Choose your club</strong>
			</div>

			<div id="list_membership" class="list-group">

			</div>

		</form>

    </div> <!-- /container -->

<script>
var login_user_info = <?php echo json_encode($login_user_info);?>;
var all_membership_list = <?php echo json_encode($all_membership_list);?>;
var cookie_meeting_membership_id = <?php echo json_encode($cookie_meeting_membership_id);?>;
var list_membership_jq = $("div#list_membership");

console.log(">>> login_user_info :: ",login_user_info);
console.log(">>> cookie_meeting_membership_id :: ",cookie_meeting_membership_id);

// 모든 클럽을 접근, 조회할 수 있다.
var __membership_arr = all_membership_list;

if(_v.is_valid_array(__membership_arr)) {
	for(var idx = 0; idx < __membership_arr.length; idx++) {
		var membership_obj = __membership_arr[idx];
		console.log(">>> membership_obj :: ",membership_obj);

		var tag = "";

		if(_v.is_valid_str(membership_obj.__member_membership_desc)) {

			tag +=
			"<a href=\"#\" class=\"list-group-item\" club_id=\"<CLUB_ID>\"><CLUB_NAME></a>"
			.replace(/\<CLUB_NAME\>/gi, membership_obj.__member_membership_desc)
			.replace(/\<CLUB_ID\>/gi, membership_obj.__member_membership)
			;

		} else if(_v.is_valid_str(membership_obj.__membership_desc)) {

			tag +=
			"<a href=\"#\" class=\"list-group-item\" club_id=\"<CLUB_ID>\"><CLUB_NAME></a>"
			.replace(/\<CLUB_NAME\>/gi, membership_obj.__membership_desc)
			.replace(/\<CLUB_ID\>/gi, membership_obj.__membership_id)
			;

		}

		list_membership_jq.append(tag);

		// set event
		var club_row_jq = list_membership_jq.children().last();

		club_row_jq.click(function(){

			var _self_jq = $(this);
			var __member_membership = parseInt(_self_jq.attr("club_id"));

			// 선택한 멤버쉽을 쿠키에 등록합니다.
			_server.setCookie(
				// cname
				_param.MEETING_MEMBERSHIP_ID
				// cvalue
				, __member_membership
			);

			var test_val = _server.getCookieNumber(_param.MEETING_MEMBERSHIP_ID);

			if(__member_membership === test_val) {

				// console.log("멤버쉽 쿠키 등록이 성공하였다면 이전 페이지로 돌아간다.");
				_link.go_there(
					_link.MEETING_AGENDA
				);

			}

		});
		
	} // for end
} // if end

</script>
</body>
</html>