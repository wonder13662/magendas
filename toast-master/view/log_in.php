<?php

// common setting
include_once("../common.inc");

// get membership cookie
$meeting_membership_id = ToastMasterLogInManager::getMembershipCookie();
if($meeting_membership_id == -1) {
	// move to membership picker page
	ToastMasterLinkManager::go(ToastMasterLinkManager::$MEMBERSHIP_PICKER);
}

$REDIRECT_URL = $params->getParamString($params->REDIRECT_URL, "");

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
			<button id="fb_log_in_btn" class="btn btn-lg btn-primary btn-block" type="submit">Log in with Facebook</button>
			-->
			<button id="log_in_btn" class="btn btn-lg btn-primary btn-block" type="submit" style="margin-bottom:18px;">Log in</button>

			<div class="fb-login-button" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="false" scope="basic_info,email" onlogin="onLogIn()" style="margin-left:89px;"></div>

			<!-- modal init -->
			<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
				<div class="modal-dialog modal-sm">
					<div class="modal-content">

						<div class="alert alert-info" role="alert" style="margin:10px;">
							<strong>You might be ...</strong>
						</div>

						<!-- 포커싱되도록 바꿀 것. -->
						<div id="member_guess_list_container" class="list-group" style="margin:10px;">
							<!--
							<a href="#" class="list-group-item">Cras justo odio</a>
							<a href="#" class="list-group-item">Dapibus ac facilisis in</a>
							<a href="#" class="list-group-item">Morbi leo risus</a>
							<a href="#" class="list-group-item">Porta ac consectetur ac</a>
							<a href="#" class="list-group-item">Vestibulum at eros</a>
							-->
						</div>						

					</div>
				</div>
			</div>
			<!-- modal end -->

		</form>

    </div> <!-- /container -->

<script>

var REDIRECT_URL = <?php echo json_encode($REDIRECT_URL);?>;
var meeting_membership_id = <?php echo json_encode($meeting_membership_id);?>;

console.log(">>> REDIRECT_URL :: ",REDIRECT_URL);
console.log(">>> meeting_membership_id :: ",meeting_membership_id);

var member_list = <?php echo json_encode($member_list);?>;
console.log(">>> member_list :: ",member_list);

var member_guess_list_container_jq = $("div#member_guess_list_container");
console.log("member_guess_list_container_jq :: ",member_guess_list_container_jq);

var callback_log_in = function(member_hash_key) {

	if(_v.is_not_valid_str(member_hash_key)) {
		console.log("!Error! / callback_log_in / _v.is_not_valid_str(member_hash_key)");
		return;
	}

	// 1. 로그인 성공.
	// 1-1. 로그인에 성공한 멤버 아이디를 쿠키에 등록합니다.
	_server.setCookie(_param.COOKIE_TM_LOGIN_MEMBER_HASHKEY,member_hash_key, 1);

	if(_v.is_valid_str(REDIRECT_URL)) {
		window.location.href = REDIRECT_URL;
	} else {
		_link.go_there(_link.MEETING_AGENDA);
	}

}

var delegate_on_log_in = 
_obj.get_delegate(
	// delegate_func
	function(data){

		console.log(">>> log in / success / data : ",data);

		if(data == null || data.member_info == null) {

	    	// 2. 로그인 실패.
	    	// 2-1. 실패 메시지 노출
	    	// 2-2. ID / PASSWORD focusing - 지우지는 않습니다.

	    	var message_jq = $("div#message"); 
	    	message_jq.html("ID or Password is not valid!");
	    	message_jq.show();

		} else {

			callback_log_in(data.member_info.__member_hash_key);

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

	console.log(">>> regex_pattern_email_address_match :: ",regex_pattern_email_address_match);

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

					console.log(">>> data :: ",data);

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


// FB SDK
var rootDomain = _server.get_root_domain();
var fb_app_id = "";
var fb_app_ver = "";
if(-1 < rootDomain.indexOf(_param.FACEBOOK_SDK_STAGE_APP_DOMAIN)) {

	fb_app_id = _param.FACEBOOK_SDK_STAGE_APP_ID;
	fb_app_ver = _param.FACEBOOK_SDK_STAGE_VERSION;

	facebookSDK.init(fb_app_id, fb_app_ver, function(paramObj){
		console.log("callback / facebookSDK.init / paramObj ::: ",paramObj);
	}, this);

} else if(-1 < rootDomain.indexOf(_param.FACEBOOK_SDK_PRODUCT_APP_DOMAIN)) {

	fb_app_id = _param.FACEBOOK_SDK_PRODUCT_APP_ID;
	fb_app_ver = _param.FACEBOOK_SDK_PRODUCT_VERSION;

	facebookSDK.init(fb_app_id, fb_app_ver, function(paramObj){
		console.log("callback / facebookSDK.init / paramObj ::: ",paramObj);
	}, this);

} else {
	alert("Please check root domain. It is not the FB app.");
}


var onLogIn = function() {

	console.log("페이스북으로 로그인되었습니다.");
	console.log("해당 유저의 계정정보를 가져옵니다.");

	facebookSDK.getMe(function(response){

		if(response == null) {
			console.log("!Error! / facebookSDK.getMe / response == null");
			return;
		}

		console.log("onLogIn / response ::: ",response);

		// 1. facebook_user_id
		var facebook_user_id = response.id;
		// 2. email
		var facebook_user_email = response.email;
		// 3. first name & last name
		// 공백 포함된 이름의 처리.
		var facebook_user_name = response.name;
		var facebook_user_name_arr = facebook_user_name.split(" ");
		var facebook_user_first_name = facebook_user_name_arr.slice(0, facebook_user_name_arr.length - 1).join(" ");

		var facebook_user_last_name = "";
		if(1 < facebook_user_name_arr.length) {
			facebook_user_last_name = facebook_user_name_arr[facebook_user_name_arr.length - 1];
		}

		// 4. Picture - url / Magendas로 업로드 필요.
		var facebook_profile_image = response.picture.data.url;

		// callback function - member와 FB Account를 등록.

		var add_new_relation_member_n_fb_account = function(member_hash_key, fb_user_id, callback_obj) {

			console.log("add_new_relation_member_n_fb_account / member_hash_key ::: ",member_hash_key);
			console.log("add_new_relation_member_n_fb_account / fb_user_id ::: ",fb_user_id);

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_DO_TOASTMASTER_LOG_IN)
				// _param_obj
				,_param
				.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
				.get(_param.EVENT_PARAM_EVENT_TYPE, _param.IS_FACEBOOK_USER_ADD)
				.get(_param.FACEBOOK_USER_ID, fb_user_id)
				.get(_param.MEMBER_HASH_KEY, member_hash_key)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						console.log("add_new_relation_member_n_fb_account / data ::: ",data);

						callback_obj._apply([data]);

					},
					// delegate_scope
					this
				)
			); // ajax done.
		}

		var add_new_member = function(fb_user_id, fb_user_email, fb_user_first_name, fb_user_last_name, callback_obj){

			_ajax.send_simple_post(
				// _url
				_link.get_link(_link.API_DO_TOASTMASTER_LOG_IN)
				// _param_obj
				,_param
				.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
				.get(_param.EVENT_PARAM_EVENT_TYPE, _param.IS_MAGENDAS_USER_ADD)
				.get(_param.FACEBOOK_USER_ID, facebook_user_id)
				.get(_param.FACEBOOK_USER_EMAIL, facebook_user_email)
				.get(_param.FACEBOOK_USER_FIRST_NAME, facebook_user_first_name)
				.get(_param.FACEBOOK_USER_LAST_NAME, facebook_user_last_name)

				// _delegate_after_job_done
				,_obj.get_delegate(
					// delegate_func
					function(data){

						callback_obj._apply([data]);

					},
					// delegate_scope
					this
				)
			); // ajax done.			

		}


		// api upload - user account
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_DO_TOASTMASTER_LOG_IN)
			// _param_obj
			,_param
			.get(_param.MEETING_MEMBERSHIP_ID, meeting_membership_id)
			.get(_param.EVENT_PARAM_EVENT_TYPE, _param.IS_FACEBOOK_USER_SEARCH)
			.get(_param.FACEBOOK_USER_ID, facebook_user_id)
			.get(_param.FACEBOOK_USER_EMAIL, facebook_user_email)
			.get(_param.FACEBOOK_USER_FIRST_NAME, facebook_user_first_name)
			.get(_param.FACEBOOK_USER_LAST_NAME, facebook_user_last_name)

			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log("XXX / data ::: ",data);

					if(data.registered_member != null) {
						// 등록 유저를 찾았습니다. Magendas와 FB에 모두 등록되어 있습니다.
						console.log("등록 유저를 찾았습니다. Magendas와 FB에 모두 등록되어 있습니다.");

						// log in with selected member hash key
						callback_log_in(data.registered_member.__member_hash_key);

					} else if(data.member_list != null && (0 < data.member_list.length)) {
						// FB user가 등록되어 있지 않습니다. Magendas에서 비슷한 유저를 찾았습니다.
						console.log("FB user가 등록되어 있지 않습니다. Magendas에서 비슷한 유저를 찾았습니다.");
						console.log("data.member_list ::: ",data.member_list);

						var modalJq = $("div.modal");

						// 첫 아이템은 자신과 동일한 이름이 없는 것을 나타냅니다.
						var member_guess_tag_list = ""
						+ "<a href=\"#\" class=\"list-group-item\" member_hash_key=\"{member_hash_key}\" fb_id=\"{fb_id}\">"
							.replace(/\{member_hash_key\}/gi, "")
							.replace(/\{fb_id\}/gi, data.FACEBOOK_USER_ID)
							+ "<h5 class=\"list-group-item-heading\">{name}</h5>"
								.replace(/\{name\}/gi, data.FACEBOOK_USER_FIRST_NAME + " " + data.FACEBOOK_USER_LAST_NAME)
							+ "<p class=\"list-group-item-text\">{email}</p>"
								.replace(/\{email\}/gi, data.FACEBOOK_USER_EMAIL)
						+ "</a>"
						;

						// 가져온 리스트를 모달에 표시.
						for(var idx = 0; idx < data.member_list.length; idx++) {
							var member_obj = data.member_list[idx];

							member_guess_tag_list += "" 
							+ "<a href=\"#\" class=\"list-group-item\" member_hash_key=\"{member_hash_key}\">"
								.replace(/\{member_hash_key\}/gi, member_obj.__member_hash_key)
								+ "<h5 class=\"list-group-item-heading\">{name}</h5>"
									.replace(/\{name\}/gi, member_obj.__member_first_name + " " + member_obj.__member_last_name)
								+ "<p class=\"list-group-item-text\">{email}</p>"
									.replace(/\{email\}/gi, member_obj.__member_email)
							+ "</a>"
							;
						}



						member_guess_list_container_jq.append(member_guess_tag_list);
						var member_guess_list_jq = member_guess_list_container_jq.children();
						member_guess_list_jq.click(function(e){

							// 사용자가 자신의 유저 정보를 클릭했습니다.
							var _self = $(this);
							var member_hash_key = _self.attr("member_hash_key");
							var fb_id = _self.attr("fb_id");

							console.log("HERE / member_hash_key ::: ",member_hash_key);
							console.log("HERE / fb_id ::: ",fb_id);

							if(_v.is_not_valid_str(member_hash_key) && _v.is_valid_str(fb_id)) {

								// 자신의 계정이 없습니다. 새로 추가합니다.
								console.log("자신의 Magendas 계정이 없습니다. 새로 추가합니다.");

								// var add_new_member = function(fb_user_id, fb_user_email, fb_user_first_name, fb_user_last_name, callback_obj){

								add_new_member(
									// fb_user_id
									data.FACEBOOK_USER_ID
									// fb_user_email
									, data.FACEBOOK_USER_EMAIL
									// fb_user_first_name
									, data.FACEBOOK_USER_FIRST_NAME
									// fb_user_last_name
									, data.FACEBOOK_USER_LAST_NAME
									// callback_obj
									,_obj.get_delegate(
										// delegate_func
										function(data){

											console.log("delegate_func / add_new_member / data ::: ",data);
											var member_n_facebook = data.member_n_facebook;
											if(	member_n_facebook != null && 
												_v.is_valid_str(member_n_facebook.__member_hash_key)) {

												// 돌아가려는 페이지로 리다이렉트합니다.
												console.log("돌아가려는 페이지로 리다이렉트합니다.");

												if(_v.is_not_valid_str(REDIRECT_URL)) {
													_link.go_there(_link.MEETING_AGENDA);
												} else {
													window.location.href = REDIRECT_URL;
												}

											} else {

												// 유저 추가가 진행되지 않았습니다. 사용자에게 실패 메시지를 보여줍니다.
												alert("Sorry, Unexpected Error Occurred!");

											}

										},
										// delegate_scope
										this
									)
								);

							} else {

								// 자신의 계정이 있습니다. FB 계정과 연동합니다.
								// add a new relation of member & FB Account

								console.log("자신의 Magendas 계정이 있습니다. FB 계정과 연동합니다.");

								/*
								add_new_relation_member_n_fb_account(
									member_hash_key
									, facebook_user_id
									,_obj.get_delegate(
										// delegate_func
										function(data){

											callback_log_in(member_hash_key);

										},
										// delegate_scope
										this
									)								
								);
								*/
							}
							

							modalJq.modal("hide");

						});

						modalJq.modal("show");

					} else {

						// Member, FB user가 모두 등록되어 있지 않습니다.
						console.log("!Error! / Member, FB user가 모두 등록되어 있지 않습니다.");

						// FB에서 가져온 데이터로 새로운 유저를 추가합니다.

					}

					// registered_member

				},
				// delegate_scope
				this
			)
		); // ajax done.	


		// api upload - profile image
		// http://stackoverflow.com/questions/6306935/php-copy-image-to-my-server-direct-from-url

	},this);

}

</script>
</body>
</html>