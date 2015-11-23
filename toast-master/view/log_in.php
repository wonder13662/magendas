<?php

// common setting
include_once("../common.inc");


// get membership cookie
$meeting_membership_id = ToastMasterLogInManager::getMembershipCookie();
if($meeting_membership_id == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
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

// Load signin css. Signin page only.
echo "<link href=\"$service_root_path/css/bootstrap/signin/signin.css\" rel=\"stylesheet\">";

?>

</head>



<body role="document">

    <div class="container">

		<form class="form-signin" role="form">

			<div id="message" class="alert alert-danger" role="alert" style="text-align:center;display:none;">No Message</div>

			<input id="mobile_number" type="text" class="form-control" placeholder="Email address or Mobile Number" required="" autofocus="" style="border-bottom-right-radius:0;border-bottom-left-radius:0;margin-bottom:-1px;margin-top:20px;">	
			<input id="password" type="password" class="form-control" placeholder="Password" required style="margin-bottom:20px;">
			<!-- 
			<label class="checkbox">
				<input type="checkbox" value="remember-me"> Remember me
			</label>
			-->
			<button id="log_in_btn" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
		</form>

    </div> <!-- /container -->

<script>

var redirect_url = <?php echo json_encode($redirect_url);?>;
var meeting_membership_id = <?php echo json_encode($meeting_membership_id);?>;

console.log(">>> meeting_membership_id :: ",meeting_membership_id);

var delegate_on_log_in = 
_obj.get_delegate(
	// delegate_func
	function(data){

		console.log(">>> log in / success / data : ",data);
		// console.log(">>> log in / success / redirect_url : ",redirect_url);

		if(data == null || data.member_info == null) {

	    	// 2. 로그인 실패.
	    	// 2-1. 실패 메시지 노출
	    	// 2-2. ID / PASSWORD focusing - 지우지는 않습니다.

	    	var message_jq = $("div#message"); 
	    	message_jq.html("ID or Password is not valid!");
	    	message_jq.show();

		} else {

	    	// 1. 로그인 성공.
	    	// 1-1. 로그인에 성공한 멤버 아이디를 쿠키에 등록합니다.
	    	_server.setCookie("tm_login_user",data.member_info.__member_id, 1);
	    	
	    	var membership_arr_json_str = data.query_output_arr[4];
	    	var membership_arr = $.parseJSON(membership_arr_json_str);

	    	if(membership_arr == undefined || membership_arr.length < 1) {

	    		alert("Membership data is not correct\n\n[Error-511]");

	    	} else if (1 < membership_arr.length) {

	    		// 1-2. 해당 유저의 가입 클럽이 2개 이상일 경우, 클럽 선택 페이지로 이동합니다.
				_link.go_there(_link.MEMBERSHIP_PICKER);

			} else if (1 == membership_arr.length) {

				// 1-3. 해당 유저의 가입 클럽이 1개일 경우는 해당 클럽의 메인 페이지로 리다이렉트합니다.
				var cur_membership = membership_arr[0];
				var __member_membership = parseInt(cur_membership.__member_membership);

				_link.go_there(
					_link.MEETING_AGENDA
					, _param.get(_param.MEETING_MEMBERSHIP_ID,__member_membership)
				);

	    	}

		} // end if

	},
	// delegate_scope
	this
)


$("button#log_in_btn").on("click", function(e){

	e.preventDefault();

	var password_jq = $("input#password");
	var password = password_jq.val();
	if(_v.isNotValidStr(password)){
		alert("Password is empty!");
		password_jq.focus();
	}

	// TODO 
	var mobile_number_jq = $("input#mobile_number");

	// 1. 이메일 주소로 멤버 여부를 확인.
	var email_address = mobile_number_jq.val();

	var regex_pattern_email_address = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;
	var regex_pattern_email_address_match = email_address.match(regex_pattern_email_address);

	// does it works?
	if (_v.isValidArray(regex_pattern_email_address_match)) {

	    // invalid emailaddress
		var request_param_obj = 
		_param
		.get(_param.MEMBER_EMAIL, email_address)
		.get(_param.MEMBER_PASSWORD, password)
		.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
		;

		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_LOG_IN)
			// _param_obj
			,request_param_obj
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					delegate_on_log_in._func.apply(delegate_on_log_in._scope,[data]);

				},
				// delegate_scope
				this
			)
		); // ajax done.

		return;
	}




	// 2. 전화번호로 멤버 여부를 확인. (Deprecated)
	var mobile_number = mobile_number_jq.val();

	if(_v.isNotValidStr(mobile_number)){
		alert("Mobile Number is empty!");
		mobile_number_jq.focus();
	}
	var regex_pattern_mobile_number = /[0-9]/g; 
	var regex_pattern_mobile_number_match = mobile_number.match(regex_pattern_mobile_number);
	if(_v.isNotValidArray(regex_pattern_mobile_number_match)){
		// 허용되는 전화번호 형식
		// 010-4613-5949
		alert("Mobile Number is not allowed format\n\nex) 010-1122-3344");
		mobile_number_jq.val("010-1122-3344");
		mobile_number_jq.focus();
	}

	// 01011223344 --> 010-1122-3344
	if(mobile_number.length==11){
		var mobile_number_head = mobile_number.slice(0,3);
		var mobile_number_body = mobile_number.slice(3,7);
		var mobile_number_foot = mobile_number.slice(7,11);
		var formatted_mobile_number = mobile_number_head + "-" + mobile_number_body + "-" + mobile_number_foot;
		mobile_number_jq.val(formatted_mobile_number);
		mobile_number = formatted_mobile_number;
	}

	var request_params = 
	_param
	.get(_param.MEMBER_MOBILE, mobile_number)
	.get(_param.MEMBER_PASSWORD, password)
	.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
	;

	//

	console.log(">>> log in / request_params : ",request_params);

	// log in 처리는 ajax로!
    $.ajax({
        url:_link.get_link(_link.API_LOG_IN),
        dataType:'json',
		type:'post',
        data:request_params,
        success:function(data){

        	delegate_on_log_in._func.apply(delegate_on_log_in._scope,[data]);

        }
    }).fail(function( data ) {
    	console.log("fail / data.responseText : ",data.responseText);
    });

});

</script>
</body>
</html>