// airborne for bootstrap - 2014

var airborne = {
	validator:null
	,server:null	
	,bootstrap:{
		obj:{
		}
		,column:null
		,modal:null
		,table_manager:null
		,view:{
			obj:{
				list:null
				,table:null
				,__action:null
				,__action_list:null
				,__action_table:null
			}
			,mobile:{
				list:null
			}
		}
	}
	,ajax:null
};

airborne.console = {
	/*
		@ public
		@ scope : console
		@ desc : 콘솔 오브젝트를 반환합니다. 
		특정 scope에서만 콘솔 로그 노출 여부를 on/off 하기 위해 이 객체를 사용합니다.
	*/
	get:function(scope){
		var consoler = {
			scope:scope
			,setScope:function(scope){
				this.scope = scope;
			}
			,say:function(msg, obj){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(this.isShow == false) return;

				if(this.scope != undefined && this.scope != "") {
					if(obj != undefined) {
						console.log(this.scope + " / " + msg,obj);
					} else if(msg === "") {
						console.log("");
					} else {
						console.log(this.scope + " / " + msg);
					}
				} else {
					if(obj != undefined) {
						console.log(msg,obj);
					} else {
						console.log(msg);
					}
				}
			}
			,say_err:function(msg, obj) {
				this.say("!Error! / " + msg, obj);
			}
			,isShow:true
			,on:function(){
				this.isShow=true;
			}
			,off:function(){
				this.isShow=false;
			}
		};

		return consoler;
	}
}

//airborne.server.getUrlNoParam
//airborne.server.setCookie(cname, cvalue, exhours)
airborne.server = {
	root_domain:null
	,get_root_domain:function(){
		return this.getRootDomain();
	}
	,getRootDomain:function(){

		if(airborne.validator.isValidStr(this.root_domain)){
			return this.root_domain;
		}
		// TODO IE not support 'origin'
		var port = window.location.port;
		this.root_domain = window.location.origin;
		if(!isNaN(parseInt(port))){
			this.root_domain += ":" + port;
		}

		return this.root_domain;
	}
	,getParameterByName:function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	,get_url_no_param:function(){
		return this.getUrlNoParam();
	}
	,is_valid_param_type:function(param_value) {
		// 파라미터로 넘길수 있는 것은 오직 3가지 타입만 가능합니다.
		if(	typeof param_value !== "number" && 
			typeof param_value !== "string" &&
			typeof param_value !== "boolean" ) {

			return false;
		}

		return true;
	}
	,get_custom_url_n_custom_params:function(request_url, request_param_obj){
		
		if(request_param_obj != null){
			var url_str = request_url + "?";	
			for (var key in request_param_obj) {
				var value = request_param_obj[key];
				if(!this.is_valid_param_type(value)) {
					continue;
				}
				
				url_str += key + "=" + value + "&";
			}
			return url_str;
		}

		return request_url;
	}
	,get_url_custom_params:function(request_param_obj){
		
		if(request_param_obj != null){
			var url_str = this.get_url_no_param() + "?";	
			for (var key in request_param_obj) {
				var value = request_param_obj[key];
				if(!this.is_valid_param_type(value)) {
					continue;
				}

				url_str += key + "=" + value + "&";
			}
			return url_str;
		}

		return _server.get_url_no_param();

	}
	,get_url_with_params:function(request_url, request_param_obj){
		
		if(request_param_obj != null){
			var url_str = request_url + "?";	
			for (var key in request_param_obj) {
				var value = request_param_obj[key];
				if(!this.is_valid_param_type(value)) {
					continue;
				}

				url_str += key + "=" + value + "&";
			}
			return url_str;
		}

		return request_url;
	}
	,call_url_with_custom_params:function(request_param_obj){
		var cur_url_str = this.get_url_custom_params(request_param_obj);
		var _v = airborne.validator;
		if(_v.isNotValidStr(cur_url_str)){
			console.log("!Error! / airborne.server / call_url_with_custom_params / _v.isNotValidStr(cur_url_str)");
			return;
		}
		window.location.href = cur_url_str;
	}
	,call_url_get:function(request_url, request_param_obj){
		var cur_url_str = this.get_custom_url_n_custom_params(request_url, request_param_obj);
		var _v = airborne.validator;
		if(_v.isNotValidStr(cur_url_str)){
			console.log("!Error! / airborne.server / call_url_with_custom_params / _v.isNotValidStr(cur_url_str)");
			return;
		}
		window.location.href = cur_url_str;
	}
	,call_url_post:function(form_obj_parent_jq, request_param_obj){

		var _html = airborne.html;
		var _server = airborne.server;

		var request_url = _server.get_url_no_param();
		var is_post = true;
		var form_obj = _html.get_form_obj(form_obj_parent_jq, request_url, is_post);

		// param_map
		if(request_param_obj != undefined) {
			for (var key in request_param_obj) {
			    var value = request_param_obj[key];
				if(!this.is_valid_param_type(value)) {
					continue;
				}

			    form_obj.add_param(key, value);
			}
		}

		form_obj.submit();
	}
	,post_url_with_params:function(request_url, request_param_obj){

		var _html = airborne.html;
		var _server = airborne.server;

		var is_post = true;
		var form_obj_parent_jq = $("body");
		var form_obj = _html.get_form_obj(form_obj_parent_jq, request_url, is_post);

		// param_map
		if(request_param_obj != undefined) {
			for (var key in request_param_obj) {
			    var value = request_param_obj[key];
				if(!this.is_valid_param_type(value)) {
					continue;
				}

			    form_obj.add_param(key, value);
			}
		}

		form_obj.submit();

	}	
	,getUrlNoParam:function(){
		var self_location = location.href;
		var indexOfQuestionMark = self_location.indexOf("?");
		var next_location = self_location;
		if(indexOfQuestionMark > 0){
			next_location = self_location.slice(0,indexOfQuestionMark);
		}
		return next_location;
	}
	,an_hour_in_millisec:3600000// 60*60*1000
	,setCookie:function(cname, cvalue, exhours) {

		this.delCookie(cname);

		if(exhours == null || !(exhours > 0)) {
			exhours = 1;
		}

	    var d = new Date();
	    d.setTime(d.getTime() + (exhours*this.an_hour_in_millisec));
	    var expires = "expires="+d.toGMTString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	,delCookie:function(cname) {
	    var d = new Date();
	    d.setTime(d.getTime() - this.an_hour_in_millisec);
	    var expires = "expires="+d.toGMTString();
	    document.cookie = cname + "=; " + expires;
	}
	,getCookie:function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	}
	,getCookieNumber:function(cname) {
		var cur_value = this.getCookie(cname);
		if(cur_value == undefined || isNaN(cur_value)) {
			return -1;
		}
		return parseInt(cur_value);
	}
}


airborne.phone = {
	MOBILE_PHONE_KR:1 	// airborne.phone.MOBILE_PHONE_KR
	,isValidMobilePhoneNumber:function(src_mobile_number, mobile_type){ // airborne.phone.isValidMobilePhoneNumber
		var _v = airborne.validator;
		if(mobile_type==null){
			console.log("!Error! / airborne.phone.isValidMobilePhoneNumber / mobile_type==null");
			return false;
		}

		if(this.MOBILE_PHONE_KR==mobile_type){
			var safe_phone_number_value = src_mobile_number.replace(/-/gi, "");

			if(_v.isNotNumberStr(safe_phone_number_value)){
				console.log("!Error! / airborne.phone.isValidMobilePhoneNumber / _v.isNotNumberStr(safe_phone_number_value) / ",safe_phone_number_value);
				return false;
			}else if(safe_phone_number_value.length!=11){
				console.log("!Error! / airborne.phone.isValidMobilePhoneNumber / safe_phone_number_value.length!=11");
				return false;
			}

			return true;
		}

		return false;
	}
	,getFormattedMobilePhoneNumber:function(src_mobile_number, mobile_type){ // airborne.phone.getFormattedMobilePhoneNumber
		var _v = airborne.validator;
		if(mobile_type==null){
			console.log("!Error! / airborne.phone.getFormattedMobilePhoneNumber / mobile_type==null");
			return "";
		}

		if(this.MOBILE_PHONE_KR==mobile_type){
			var formattedMobilePhoneNumber = src_mobile_number;
			// 01046135949 --> 010-4613-5949
			if(src_mobile_number.length==11){
				var head_number = src_mobile_number.slice(0,3);
				var body_number = src_mobile_number.slice(3,7);
				var tail_number = src_mobile_number.slice(7,11);
				formattedMobilePhoneNumber = head_number + "-" + body_number + "-" + tail_number;
			}
			
			return formattedMobilePhoneNumber;
		}

		return "";
	}
}

//airborne.html.getSafeText
//airborne.html.getSQLSafeText
//airborne.html.getUnSQLText
//airborne.html.getId
//airborne.html.getIdRandomTail
//airborne.html.get_id_auto_increase
//airborne.html.getTextHead
//airborne.html.restoreText
//airborne.html.getQueryStringSafeText
//airborne.html.getTapStr()
airborne.html = {
	getTapStr:function(){
		return "&nbsp;&nbsp;&nbsp;";	
	}
	,getSafeText:function(unsafe_text){
		if(airborne.validator.isNotValidStr(unsafe_text)){
			return "";
		}

		unsafe_text = this.getUnSQLText(unsafe_text);

		if(unsafe_text.indexOf("&") > -1){
			unsafe_text = unsafe_text.replace(/&/gi, "&amp;");
		}

		if(unsafe_text.indexOf(">") > -1){
			unsafe_text = unsafe_text.replace(/>/gi, "&gt;");
		}

		if(unsafe_text.indexOf("<") > -1){
			unsafe_text = unsafe_text.replace(/</gi, "&lt;");
		}

		return unsafe_text;
	}
	,get_decode_text:function(encoded_text){	// TODO wdjung

		if(airborne.validator.isNotValidStr(encoded_text)){
			return "";
		}

		var decoded_text = encoded_text;

		if(encoded_text.indexOf("&amp;") > -1){
			decoded_text = decoded_text.replace(/&amp;/gi, "&");
		}

		if(encoded_text.indexOf("&gt;") > -1){
			decoded_text = decoded_text.replace(/&gt;/gi, ">");
		}

		if(encoded_text.indexOf("&lt;") > -1){
			decoded_text = decoded_text.replace(/&lt;/gi, "<");
		}

		return decoded_text;

	}
	// @ Desc : GET 전송시 파라미터로 전달하기 위한 문자열로 변경해 줍니다.
	,getQueryStringSafeText:function(unsafe_text){
		// & --> %26
		if(airborne.validator.isNotValidStr(unsafe_text)){
			return "";
		}

		// escape "
		// escape '
		unsafe_text = this.getSQLSafeText(unsafe_text);

		// &amp; --> &
		// &gt; --> >
		// &lt; --> <
		unsafe_text = this.get_decode_text(unsafe_text);

		// escape '&'
		var safe_text = "";
		if(unsafe_text.indexOf("&") > -1){
			safe_text = unsafe_text.replace(/\&/gi, "%26");
		} else {
			safe_text = unsafe_text;
		}

		return safe_text;
	}
	// REMOVE ME?
	// @ Desc : POST 전송시 파라미터로 전달하기 위한 문자열로 변경해 줍니다.
	,getPostQueryStringSafeText:function(unsafe_text){

		if(airborne.validator.isNotValidStr(unsafe_text)){
			return "";
		}

		// escape "
		// escape '
		unsafe_text = this.getSQLSafeText(unsafe_text);

		// &amp; --> &
		// &gt; --> >
		// &lt; --> <
		unsafe_text = this.get_decode_text(unsafe_text);

		return unsafe_text;
	}
	,getJSONStrSafeText:function(unsafe_text){

		if(unsafe_text.indexOf("'") > -1){
			unsafe_text = unsafe_text.replace(/\'/gi, "\\\'");
		}

		if(unsafe_text.indexOf("\"") > -1){
			unsafe_text = unsafe_text.replace(/\"/gi, "\\\"");
		}

		return unsafe_text;

	}
	/*
		@ Scope : Public
		@ Desc 	: get safe text value for <span>${VALUE}</span>
	*/
	,getSafeHTMLInline:function(unsafe_text) {

		// \' --> '
		if(unsafe_text.indexOf("\\\'") > -1){
			unsafe_text = unsafe_text.replace(/\\\'/gi, "'");
		}

		// \" --> "
		if(unsafe_text.indexOf("\\\"") > -1){
			unsafe_text = unsafe_text.replace(/\\\'/gi, "'");
		}

		return unsafe_text;
	}
	,getUnSQLText:function(sql_safe_text){ // airborne.html.getUnSQLText
		if(sql_safe_text.indexOf("&lsquo;") > -1){
			sql_safe_text = sql_safe_text.replace(/\&lsquo\;/gi, "\'");
		}

		if(sql_safe_text.indexOf("&quot;") > -1){
			sql_safe_text = sql_safe_text.replace(/\&quot\;/gi, "\"");
		}

		return sql_safe_text;
	}
	,getSQLSafeText:function(unsafe_text){ // TODO wdjung 특수 문자 입력에 대한 제한을 두어야 함.
		if(airborne.validator.isNotValidStr(unsafe_text)){
			return "";
		}

		if(unsafe_text.indexOf("'") > -1){
			unsafe_text = unsafe_text.replace(/\'/gi, "&lsquo;");
		}

		if(unsafe_text.indexOf("\"") > -1){
			unsafe_text = unsafe_text.replace(/\"/gi, "&quot;");
		}

		return unsafe_text;
	}
	,replaceEmptySpace:function(target_text){
		if(target_text == null) return;

		if(!isNaN(target_text)) return;

		if(target_text.indexOf(" ") > -1){
			return target_text.replace(/ /gi, "_");
		}

		return target_text;
	}
	,replaceEmbrace:function(target_text){

		if(target_text == null) return;

		if(!isNaN(target_text)) return;

		var left_embrace_idx = target_text.indexOf("(");
		if(left_embrace_idx > -1){
			target_text = target_text.replace(/\(/gi, "_");
		}
		var right_embrace_idx = target_text.indexOf(")");
		if(right_embrace_idx > -1){
			if(right_embrace_idx==(target_text.length-1)){
				// 오른쪽 괄호가 문장 맨 마지막인 경우.
				target_text = target_text.replace(/\)/gi, "");
			} else {
				// 오른쪽 괄호가 문장 끝나기 전에 있는 경우.
				target_text = target_text.replace(/\)/gi, "_");	
			}
		}

		return target_text;

	}
	,getId:function(raw_id){ 
		// return only alphabet.
		if(!raw_id) return undefined;

		if(!isNaN(raw_id)) return raw_id;

	    var patt1 = /[a-z_0-9\-]/gi; 
	    var result = raw_id.toLowerCase().match(patt1);

	    if(result == null || result.length == 0) {
	    	return raw_id;
	    }
	    
	    return result.join("");
	}
	,cur_idx_ASC:0
	,getIdASCTail:function(raw_id){
		// 1씩 증가하는 아이디를 사용합니다.
		return this.getId(raw_id) + "_" + (this.cur_idx_ASC++);
	}
	,getIdRandomTail:function(raw_id){

		var d = new Date();
		var n = d.getTime();

		return this.getId(raw_id) + "_" + n + "_" + Math.floor((Math.random() * 1000000) + 1);
	}
	,auto_increase_num:0
	,get_id_auto_increase:function(raw_id){
		this.auto_increase_num += 1;
		return this.getId(raw_id) + "_" + this.auto_increase_num;
	}
	,restoreText:function(safe_text){ // TODO wdjung

		if(airborne.validator.isNotValidStr(safe_text)){
			return "";
		}

		if(safe_text.indexOf("&amp;") > -1){
			safe_text = safe_text.replace(/&amp;/gi, "&");
		}

		return safe_text;
	}
	,getTextHead:function(src_text, limit){
		var text_head = "";
		if(airborne.validator.isNotValidStr(src_text)){
			return text_head;
		}
		if(airborne.validator.isNotNumber(limit)){
			return text_head;
		}

		if(src_text.length > limit){
			text_head = src_text.slice(0,limit) + "...";	
		} else {
			text_head = src_text;
		}
		return text_head;
	}
	,getPDFSafeTagText:function(raw_tag_text){ // airborne.html.getPDFSafeTagText
		var safe_tag_text = raw_tag_text;
		if(raw_tag_text.indexOf("'") > -1){
			safe_tag_text = raw_tag_text.replace(/'/gi, "\\'");
		}

		return safe_tag_text;
	}
	,get_form_obj:function(parent_jq, request_url, is_post){
		var _v = airborne.validator;
		if(parent_jq == null){
			console.log("!Error! / airborne.html.drawForm / parent_jq == null");
		}
		if(_v.isNotValidStr(request_url)){
			console.log("!Error! / airborne.html.drawForm / _v.isNotValidStr(request_url)");
		}
		var method = (is_post == null || is_post == false)?"GET":"POST";
		var form_tag = "";
		var form_tag_id = this.getIdRandomTail("form");

		form_tag += ""
		+ "<form role=\"form\" id=\"<form_tag_id>\" action=\"<request_url>\" method=\"<method>\">"
		.replace(/\<form_tag_id\>/gi, form_tag_id)
		.replace(/\<request_url\>/gi, request_url)
		.replace(/\<method\>/gi, method)
		+ "</form>";

		parent_jq.append(form_tag);
		var form_jq = parent_jq.find("form#" + form_tag_id);
		var _self = this;

		var form_obj = {
			parent_jq:parent_jq
			,request_url:request_url
			,is_post:is_post
			,form_tag_id:form_tag_id
			,form_jq:form_jq
			,add_param:function(key, value){
				var form_param_tag = "";

				// form POST 전송시, php에서 인자로 받는 경우 쌍따옴표를 json str으로 파싱하는 경우의 문제가 있습니다.
				// 이를 위해서 일반적인 &quot;을 사용하지 않고
				// 이 프로젝트에서만 사용하는 문자열로 치환합니다.
				if(typeof value === 'string') {
					var tm_quote = "TTTM_QUOTEEE";
					var tm_single_quote = "TTTM_SINGLE_QUOTEEE";
					value = value.replace(/\&quot\;/gi, tm_quote);
					value = value.replace(/\&lsquo\;/gi, tm_single_quote);
				}

				var safe_value_encoded = encodeURI(value);

				form_param_tag += 
				"<input type=\"hidden\" id=\"<id>\" name=\"<name>\" value=\"<value>\">"
				.replace(/\<id\>/gi, key)
				.replace(/\<name\>/gi, key)
				.replace(/\<value\>/gi, safe_value_encoded)
				;

				this.form_jq.append(form_param_tag);
			}
			,submit:function(){
				this.form_jq.submit();
			}
		}

		return form_obj;
	}
	/*
		@ Public
		@ Desc : 현재 문서의 스크롤 y 위치를 알려줍니다.
		@ Refer : http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
	*/
	, get_top:function() {
		var doc = document.documentElement;
		var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

		return top;
	}
	/*
		@ Public
		@ Desc : 현재 문서의 스크롤 y 위치를 알려줍니다.
		@ Refer : http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
	*/
	, get_left:function() {
		var doc = document.documentElement;
		var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);

		return left;
	}


}

airborne.json = {
	parseJSON:function(json_str){
		var _v = airborne.validator;
		if(_v.isNotValidStr(json_str)) return null;

		// json parsing safe filter
		// \& --> &
		json_str = json_str.replace(/\\&lsquo;/gi, "&lsquo;");
		// \r\n --> <br/>
		json_str = json_str.replace(/\r\n/gi, "<br/>");
		// \n --> <br/>
		json_str = json_str.replace(/\n/gi, "<br/>");

		var json_obj = $.parseJSON(json_str);

		// 모든 json obj에서 유효하지 않는 문자가 없는지 확인한다.
		// json_obj = this.findNode(json_obj);

		return json_obj;
	}
	// REMOVE ME
	/*
	, findNode:function(json_obj, delegate_action) {

		if(json_obj === undefined) return;

		//console.log(">>> findNode / json_obj :: ",json_obj);

		// 1. has attribute?
		for (var attr in json_obj) {
		  	var cur_attr_value = json_obj[attr]
		  	//console.log(">>> findNode / cur_attr_value :: ",cur_attr_value);

		  	if(typeof cur_attr_value === "string") {

		  		// 1-1. Does attr has string value?
		  		// 1. if attribute has string value, check html safe.

		  		console.log(">>> cur_attr_value :: ",cur_attr_value);
		  		console.log(">>> cur_attr_value.indexOf(\"\\\") :: ",cur_attr_value.indexOf("\\"));

		  		// attribute value
		  		// validate string value
		  		// "\\" --> "" no backslash
		  		if(cur_attr_value.indexOf("\\") > 0) {

			  		console.log(">>> 001 / cur_attr_value :: ",cur_attr_value);

			  		cur_attr_value = cur_attr_value.replace(/\\/gi, "");

			  		console.log(">>> 002 / cur_attr_value :: ",cur_attr_value);

			  		json_obj[attr] = cur_attr_value;

		  		}

		  	} else if(typeof cur_attr_value === "object") {

		  		// 1-2. Does attr has obj value?
		  		// 2. if attribute has child object, call findNode recursively.
		  		cur_attr_value = this.findNode(cur_attr_value, delegate_action);
		  		json_obj[attr] = cur_attr_value;

		  	}
		  	
		}

		return json_obj;
	}
	*/
}



