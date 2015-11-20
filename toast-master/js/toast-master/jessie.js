var jessie = {
	parent_jq:null
	, set_parent_jq:function(parent_jq){
		this.parent_jq = parent_jq;
	}
	, get_parent_jq:function(){
		return this.parent_jq;
	}
	, jessie_container_jq:null
	, set_jessie_container_jq:function(jessie_container_jq){
		this.jessie_container_jq = jessie_container_jq;
	}
	, get_jessie_container_jq:function(){
		return this.jessie_container_jq;
	}
	, text_balloon_container_jq:null
	, set_text_balloon_container_jq:function(text_balloon_container_jq){
		this.text_balloon_container_jq = text_balloon_container_jq;
	}
	, get_text_balloon_container_jq:function(){
		return this.text_balloon_container_jq;
	}
	, text_balloon_clickable_mask_jq:null
	, set_text_balloon_clickable_mask_jq:function(text_balloon_clickable_mask_jq){
		this.text_balloon_clickable_mask_jq = text_balloon_clickable_mask_jq;
	}
	, get_text_balloon_clickable_mask_jq:function(){
		return this.text_balloon_clickable_mask_jq;
	}
	, text_balloon_text_container_jq:null
	, set_text_balloon_text_container_jq:function(text_balloon_text_container_jq){
		this.text_balloon_text_container_jq = text_balloon_text_container_jq;
	}
	, get_text_balloon_text_container_jq:function(){
		return this.text_balloon_text_container_jq;
	}
	, text_span_jq:null
	, set_text_span_jq:function(text_span_jq){
		this.text_span_jq = text_span_jq;
	}
	, get_text_span_jq:function(text_span_jq){
		return this.text_span_jq;
	}
	, jessie_smile_img_jq:null
	, set_jessie_smile_img_jq:function(jessie_smile_img_jq){
		this.jessie_smile_img_jq = jessie_smile_img_jq;
	}
	, get_jessie_smile_img_jq:function(){
		return this.jessie_smile_img_jq;
	}
	, jessie_default_img_jq:null
	, set_jessie_default_img_jq:function(jessie_default_img_jq){
		this.jessie_default_img_jq = jessie_default_img_jq;
	}
	, get_jessie_default_img_jq:function(){
		return this.jessie_default_img_jq;
	}
	, glyphicon_circle_arrow_down_jq:null
	, set_glyphicon_circle_arrow_down_jq:function(glyphicon_circle_arrow_down_jq){
		this.glyphicon_circle_arrow_down_jq = glyphicon_circle_arrow_down_jq;
	}
	, get_glyphicon_circle_arrow_down_jq:function(){
		return this.glyphicon_circle_arrow_down_jq;	
	}
	, glyphicon_circle_arrow_down_bg_jq:null
	, set_glyphicon_circle_arrow_down_bg_jq:function(glyphicon_circle_arrow_down_bg_jq){
		this.glyphicon_circle_arrow_down_bg_jq = glyphicon_circle_arrow_down_bg_jq;
	}
	, get_glyphicon_circle_arrow_down_bg_jq:function(){
		return this.glyphicon_circle_arrow_down_bg_jq;	
	}
	, init:function(service_root_path, parent_jq){

		if(parent_jq == undefined) {
			parent_jq = $("body");
		}

		this.set_parent_jq(parent_jq);

		// 1. 화면 가장 아래 jessie를 그립니다.
		// 2. z-index는 가장 위쪽에 위치합니다.

		var tag = ""
		+ "<div id=\"jessie_container\" style=\"display:none;position:absolute;z-index:10000;\">"
			+ "<div id=\"jessie_text_balloon_clickable_mask\" style=\"display:block;position:absolute;top:0;left:0;right:0;bottom:0;z-index:10001;\">"
			+ "</div>"
			+ "<div id=\"jessie_text_balloon_text_container\" style=\"float:left;color:#FFF;display:none;position:absolute;left:20px;top:15px;z-index:10000;\">"
			+ "</div>"
			+ "<div id=\"jessie_text_balloon_container\" style=\"float:left;\">"
				+ "<img id=\"balloon_l\" src=\"<service_root_path>/images/jessie/jessie_text_balloon_l.png\" height=\"110\" width=\"20\">".replace(/\<service_root_path\>/gi, service_root_path)
				+ "<img id=\"balloon_c\" src=\"<service_root_path>/images/jessie/jessie_text_balloon_c.png\" height=\"110\" width=\"25\" style=\"position:relative;\">".replace(/\<service_root_path\>/gi, service_root_path)
				+ "<img id=\"balloon_r\" src=\"<service_root_path>/images/jessie/jessie_text_balloon_r.png\" height=\"110\" width=\"25\" style=\"position:relative;\">".replace(/\<service_root_path\>/gi, service_root_path)
			+ "</div>"
			+ "<div id=\"btn_ok_container\" style=\"float:left;\">"
				+ "<span class=\"glyphicon glyphicon-circle-arrow-down\" aria-hidden=\"true\" style=\"font-size:20px;position:absolute;top:80px;color:#FF6699;opacity:.2;\"></span>"
			+ "</div>"

			+ "<div id=\"jessie_face_container\" style=\"float:right;width:50px;height:50px;position:relative;top:30px;\">"
				+ "<img id=\"jessie_smile\" src=\"<service_root_path>/images/jessie/jessie_mouth_open.png\" alt=\"jessie smile\" height=\"50\" width=\"50\">".replace(/\<service_root_path\>/gi, service_root_path)
				+ "<img id=\"jessie_default\" src=\"<service_root_path>/images/jessie/jessie_mouth_closed.png\" alt=\"jessie\" height=\"50\" width=\"50\" style=\"display:none;\">".replace(/\<service_root_path\>/gi, service_root_path)
			+ "</div>"
		+ "</div>"
		;

		parent_jq.append(tag);

		// TEST
		var jessie_container_jq = this.parent_jq.find("div#jessie_container");
		this.set_jessie_container_jq(jessie_container_jq);
		var jessie_face_container_jq = this.parent_jq.find("div#jessie_face_container");

		var jessie_smile_img_jq = jessie_face_container_jq.find("img#jessie_smile");
		this.set_jessie_smile_img_jq(jessie_smile_img_jq);

		var jessie_default_img_jq = jessie_face_container_jq.find("img#jessie_default");
		this.set_jessie_default_img_jq(jessie_default_img_jq);

		// set text balloon width
		var jessie_text_balloon_container_jq = this.parent_jq.find("div#jessie_text_balloon_container");
		this.set_text_balloon_container_jq(jessie_text_balloon_container_jq);
		var balloon_l_img_jq = this.parent_jq.find("img#balloon_l");
		var balloon_c_img_jq = this.parent_jq.find("img#balloon_c");
		var balloon_r_img_jq = this.parent_jq.find("img#balloon_r");

		var text_balloon_clickable_mask_jq = this.parent_jq.find("div#jessie_text_balloon_clickable_mask");
		this.set_text_balloon_clickable_mask_jq(text_balloon_clickable_mask_jq);

		var jessie_text_balloon_text_container_jq = this.parent_jq.find("div#jessie_text_balloon_text_container");
		this.set_text_balloon_text_container_jq(jessie_text_balloon_text_container_jq);

		var glyphicon_circle_arrow_down_jq = this.parent_jq.find("span.glyphicon-circle-arrow-down");
		this.set_glyphicon_circle_arrow_down_jq(glyphicon_circle_arrow_down_jq);

		var glyphicon_circle_arrow_down_bg_jq = this.parent_jq.find("span.glyphicon-circle-arrow-down");
		this.set_glyphicon_circle_arrow_down_bg_jq(glyphicon_circle_arrow_down_bg_jq);

		var window_width = $(window).width();
		var balloon_l_img_width = balloon_l_img_jq.width();
		var balloon_r_img_width = balloon_r_img_jq.width();
		var jessie_face_width = jessie_face_container_jq.width();
		//var gap = 20;
		var gap = 0;
		var balloon_c_img_width = window_width - (balloon_l_img_width + balloon_r_img_width + jessie_face_width + gap);

		if(!isNaN(balloon_c_img_width) && balloon_c_img_width > 0) {
			balloon_c_img_jq.attr("width", balloon_c_img_width);
			glyphicon_circle_arrow_down_jq.css("left",balloon_c_img_width + 10);
			text_balloon_clickable_mask_jq.width(balloon_c_img_width);  
			jessie_text_balloon_text_container_jq.width(balloon_c_img_width);
		}

		var window_screen_height = $(window).height();
		var set_bottom_position = function() {
			var window_height = $(window).height();
			var window_scroll_top = $( document ).scrollTop();
			var jessie_container_height = jessie_container_jq.height();

			// 화면보다 긴 리스트 내에서 항상 화면 하단에 위치하도록 위치 조정을 해줍니다.
			jessie_container_jq.css("top", ((window_screen_height + window_scroll_top) - jessie_container_height));
		}
		set_bottom_position();

		$( document ).scroll(function() {
		  	set_bottom_position();
		});

		$( document ).ready(function() {

			jessie_container_jq.show();
		    
		});		
	}
	/*
		@ public
		@ Desc : 사용자에게 인사를 합니다.
	*/
	, sayHello:function(login_user_info, log_in_jq){

		if(login_user_info === undefined) {
			console.log("!Error! / jessie / sayHello / login_user_info === undefined");
			return;
		}

		// Cookie의 기록으로 대화의 내용이 달라집니다.
		// 이전에 인사를 했다면 다시 인사를 건네지 않습니다.
		var COOKIE_JESSIE_DID_SAY_HELLO = 
		_server.getCookie(
			// cname
			_param.COOKIE_JESSIE_DID_SAY_HELLO
		);
		if(COOKIE_JESSIE_DID_SAY_HELLO !== _param.YES) {
			// Cookie에 사용자에게 인사를 한 것을 기록합니다.
			_server.setCookie(
				// cname
				_param.COOKIE_JESSIE_DID_SAY_HELLO
				// cvalue
				, _param.YES
				// exhours
				, 24
			);
		}


		var delegate_on_stop_saying = 
		_obj.get_delegate(function(param_obj){

			if(param_obj.login_user_info.__is_login === _param.YES) {
				console.log("로그인이 되어 있다면 인사 뒤에 현재 사용자의 상태를 알려줍니다.");

				var _self = this;

				// 다음 대화 깜빡이 시작!
				this.set_blinker_text_arrow(
					// delegate_on_finish_blink
					_obj.get_delegate(function(){
						_self.say_your_status(login_user_info);
					},this)
					// param_obj
					, param_obj
				);

			} else {

				console.log("로그인이 되어 있지 않다면 인사 뒤에 사용자에게 로그인을 하도록 유도합니다.");

				var _self = this;
				var cur_text_balloon_container_jq = this.get_text_balloon_container_jq();
				var cur_text_balloon_text_container_jq = this.get_text_balloon_text_container_jq();
				var cur_text_balloon_clickable_mask_jq = this.get_text_balloon_clickable_mask_jq();
				var cur_glyphicon_circle_arrow_down_jq = this.get_glyphicon_circle_arrow_down_jq();

				if(	cur_text_balloon_container_jq != undefined && 
					cur_text_balloon_container_jq.length > 0 &&
					cur_glyphicon_circle_arrow_down_jq != undefined ) {

					// 다음 대화 깜빡이 시작!
					this.set_blinker_text_arrow(
						// delegate_on_finish_blink
						 _obj.get_delegate(function(){
							_self.sayLogin(log_in_jq);
						},this)
						// param_obj
						, param_obj
					);

					// REMOVE ME
					//var cur_opacity = cur_glyphicon_circle_arrow_down_jq.css("opacity");

					// REMOVE ME
					/*
					var blinker = 
					_self.getBlinker(
						// targetJq
						cur_glyphicon_circle_arrow_down_jq
						// delegate_on_finish_blink
						, _obj.get_delegate(function(){

							console.log("animation done!");
							_self.sayLogin(log_in_jq);

						},_self)
						// maxBlinkCnt
						, 5
					);
					blinker._do();

					// 사용자가 말풍선을 누르면 깜빡이 애니메이션이 종료되고 다음 동작( sayLogin )을 진행합니다.
					var cur_text_balloon_clickable_mask_jq = this.get_text_balloon_clickable_mask_jq();
					if(cur_text_balloon_clickable_mask_jq != undefined && cur_text_balloon_clickable_mask_jq.length > 0) {
						cur_text_balloon_clickable_mask_jq.click(function(e){

							console.log("mask clicked / animation done! / blinker :: ",blinker);
							blinker._stop();
							_self.sayLogin(log_in_jq);

						});
					}
					*/

				}
			}
			
		},this);


		// 말할 내용을 가져옵니다.
		var request_param_obj =
		_param
		.get(_param.IS_JESSIE_GREETING,_param.YES)
		.get(_param.WHERE_I_AM_JESSIE,_param.PAGE_TOP)
		.get(_param.WHAT_I_AM_JESSIE,JSON.stringify(login_user_info))
		.get(_param.COOKIE_JESSIE_DID_SAY_HELLO,COOKIE_JESSIE_DID_SAY_HELLO)
		;
		var param_obj = {
			login_user_info:login_user_info
		}
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_JESSIE)
			// _param_obj
			,request_param_obj
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(">>> 002 / data :: ",data);

					var msg_greeting = ""
					if(data != undefined && _v.is_valid_array(data.query_output_arr)) {
						msg_greeting = data.query_output_arr[0];
					}

					if(_v.is_valid_str(msg_greeting)) {
						this.say(msg_greeting, delegate_on_stop_saying, param_obj);
					}

				},
				// delegate_scope
				this
			)
		); // ajax done.

	}
	/*
		@ public
		@ Desc : 사용자의 현재 상태를 간단히 설명합니다.
	*/
	, say_your_status:function(login_user_info, delegate_on_stop){
		
		// JESSIE에게서 사용자의 상태를 가져옵니다.
		// JESSIE는 이중에서 사용자의 상태를 골라 얘기해줍니다.

		console.log("say_your_status / 001");
		// 대사가 모두 완료되었을 때의 델리게이트
		var delegate_on_stop_saying = 
		_obj.get_delegate(function(param_obj){

			console.log("jessie / say_your_status / delegate_on_stop_saying");

			// 1. 롤을 권유할때 클릭하면 롤사인업시트로 이동.

		},this);		

		var _self = this;
		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_JESSIE)
			// _param_obj
			,_param
			.get(_param.JESSIE_CHECK_MEMBER_STATUS,_param.YES)
			.get(_param.WHERE_I_AM_JESSIE,_param.PAGE_TOP)
			.get(_param.WHAT_I_AM_JESSIE,JSON.stringify(login_user_info))
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					if(data == undefined || data.query_output_arr == undefined || data.query_output_arr.length == 0) {
						console.log("!Error! / say_your_status / data :: ",data);	
						return;
					}

					var msg = data.query_output_arr[0];
					if(_v.is_not_valid_str(msg)) {
						console.log("!Error! / say_your_status / _v.is_not_valid_str(msg)");	
						return;
					}

					_self.say(msg, delegate_on_stop_saying);
				},
				// delegate_scope
				this
			)
		); // ajax done.

	}
	/*
		@ public
		@ Desc : 사용자에게 로그인을 안내합니다.
	*/
	, intervalBlinkLogin:null
	, sayLogin:function(log_in_jq){

		var delegate_on_stop_saying = 
		_obj.get_delegate(function(param_obj){

			console.log("jessie / sayLogin / delegate_on_stop_saying / this :: ",this);

			var cur_text_balloon_clickable_mask_jq = this.get_text_balloon_clickable_mask_jq();
			cur_text_balloon_clickable_mask_jq.click(function(e){
				e.stopPropagation();

				// remove click event
				$(this).off();

				// 말풍선 클릭시, 로그인 페이지로 이동합니다.	
				_link.go_there(
					_link.LOG_IN
				);
			});

			// 로그인 버튼이 깜빡입니다. (5초간 깜빡인뒤 사라집니다.)
			var _self = this;

			// JESSIE의 말 이후에 로그인 버튼이 깜빡임.
			var blinkerLogIn = 
			this.getBlinker(
				// targetJq
				log_in_jq
				// delegate_on_finish_blink
				, _obj.get_delegate(function(){

					console.log("animation done! / log_in_jq");

				},_self)
				// maxBlinkCnt
				, 5
			);
			blinkerLogIn._doBetweenColorNBGColor();

		},this);


		var request_param_obj =
		_param
		.get(_param.JESSIE_NEEDS_LOGIN,_param.YES)
		;

		_ajax.send_simple_post(
			// _url
			_link.get_link(_link.API_JESSIE)
			// _param_obj
			,request_param_obj
			// _delegate_after_job_done
			,_obj.get_delegate(
				// delegate_func
				function(data){

					console.log(">>> sayLogin / data :: ",data);

					var msg_login = ""
					if(data != undefined && _v.is_valid_array(data.query_output_arr)) {
						msg_login = data.query_output_arr[0];
					}

					if(_v.is_valid_str(msg_login)) {
						this.say(msg_login, delegate_on_stop_saying);
					}

				},
				// delegate_scope
				this
			)
		); // ajax done.

	}
	/*
		@ public
		@ Desc : 사용자에게 메시지를 보여줍니다.
	*/
	, message_list:[]
	, say:function(message, delegate_on_stop_saying, param_obj){

		if(_v.isNotValidStr(message)) {
			console.log("!Error! / jessie / say / _v.isNotValidStr(message)");
			return;
		}

		this.message_list.push(message);

		// 1. 메시지가 단어별로 차례로 나타납니다.
		// 2. 사용자가 메시지 혹은 jessie를 클릭하면 메시지가 모두 보여집니다.
		// 3. 사용자가 이전 메시지를 보려는 표시를 클릭하면 이전 메시지를 보여줍니다.

		// set position of text and show them.	
		var jessie_text_balloon_text_container_jq = this.get_text_balloon_text_container_jq();
		// var jessie_text_span_jq = this.get_text_span_jq();

		var gap_text_height = 15;
		var gap_text_width = 20;
		var jessie_text_balloon_container_jq = this.get_text_balloon_container_jq();

		// 텍스트를 차례차례 보여줍니다.
		var words = message.split(" ");
		this.beginSayingAnimation(jessie_text_balloon_text_container_jq, words, delegate_on_stop_saying, param_obj);

	}
	, intervalAnimation:null
	/*
		@ private
		@ Desc : 말하는 애니메이션을 시작합니다.
	*/
	, beginSayingAnimation:function(jessie_text_balloon_text_container_jq, words, delegate_on_stop_saying, param_obj) {

		var jessie_smile_img_jq = this.get_jessie_smile_img_jq();
		var jessie_default_img_jq = this.get_jessie_default_img_jq();

		if(this.intervalAnimation == undefined) {
			// 인터벌 애니메이션을 시작합니다. (기본 3초)
			var word_idx = 0;
			var word_stack = "";
			var _self = this;
			this.intervalAnimation = setInterval(function(){ 

				if(jessie_smile_img_jq.is(':visible')) {
					jessie_smile_img_jq.hide();
					jessie_default_img_jq.show();
				} else {
					jessie_smile_img_jq.show();
					jessie_default_img_jq.hide();
				}

				if(word_idx < words.length) {
					var word = words[word_idx];
					word_stack += " " + word;

					jessie_text_balloon_text_container_jq.html(word_stack);
					jessie_text_balloon_text_container_jq.show();

				} else if (word_idx === (words.length)) {
					_self.stopSayingAnimation();

					if(_obj.isValidDelegate(delegate_on_stop_saying)){
						delegate_on_stop_saying._func.apply(delegate_on_stop_saying._scope, [param_obj]);
					}
				}

				word_idx++;
				
			}, 300);

			var cur_text_balloon_clickable_mask_jq = this.get_text_balloon_clickable_mask_jq();
			var cur_text_balloon_container_jq = this.get_text_balloon_container_jq();
			cur_text_balloon_clickable_mask_jq.off();
			cur_text_balloon_clickable_mask_jq.click(function(e){

				// 설정한 이벤트를 제거합니다.
				$(this).off();

				jessie_text_balloon_text_container_jq.hide();
				jessie_text_balloon_text_container_jq.html(words.join(" "));

				jessie_text_balloon_text_container_jq.show();

				_self.stopSayingAnimation();

				if(_obj.isValidDelegate(delegate_on_stop_saying)){
					delegate_on_stop_saying._func.apply(delegate_on_stop_saying._scope, [param_obj]);
				}
			});
		}
	}
	/*
		@ private
		@ Desc : 말하는 애니메이션을 끝냅니다.
	*/
	, stopSayingAnimation:function() {
		if(this.intervalAnimation != undefined) {
			clearInterval(this.intervalAnimation);	
			this.intervalAnimation = undefined;

			var jessie_smile_img_jq = this.get_jessie_smile_img_jq();
			var jessie_default_img_jq = this.get_jessie_default_img_jq();

			jessie_smile_img_jq.show();
			jessie_default_img_jq.hide();
		}
	}
	/*
		@ private
		@ Desc : 깜빡이는 애니메이션 오브젝트를 만듭니다. 대사를 보여주는 애니메이션이 시작되면 호출합니다.
	*/
	,intervalBlinkTarget:null
	,targetBlinkJq:null
	,getBlinker:function(targetJq, delegate_on_finish_blink, maxBlinkCnt){

		if(targetJq == undefined || targetJq.length == 0){
			console.log("!Error! / getBlinker / targetJq is not valid!");
			return;
		}

		console.log(">>> getBlinker // maxBlinkCnt :: ",maxBlinkCnt);

		// 최대 깜빡임 횟수는 기본 10회
		if(maxBlinkCnt == undefined) {
			maxBlinkCnt = 20;
		}

		var blinker = {
			targetJq:targetJq
			, curBlinkCnt:0
			, maxBlinkCnt:maxBlinkCnt
			, opacityInit:parseInt(targetJq.css("opacity")*10)/10			
			, opacityFadeIn:1
			, opacityFadeOut:0.2
			, intervalBlinkTarget:null
			, animateSpan:650
			, intervalSpan:650
			, delegate_on_finish_blink:delegate_on_finish_blink
			, delegate_on_stop:null
			, _do:function(){

				var _self = this;
				this.delegate_on_stop = 
				_obj.get_delegate(function(blinker_obj){

					blinker_obj.targetJq.css("opacity",blinker_obj.opacityInit);

				},this);
				
				if(this.intervalBlinkTarget == undefined) {

					this.intervalBlinkTarget = setInterval(function(){ 

						if(_self.maxBlinkCnt < _self.curBlinkCnt) {
							_self.targetJq.fadeTo(_self.animateSpan,_self.opacityInit);
							_self._stop();
							return;
						}

						var curOpacity = _self.targetJq.css("opacity");
						if(curOpacity == _self.opacityFadeIn) {
							_self.targetJq.fadeTo(_self.animateSpan,_self.opacityFadeOut);
						} else {
							// TODO opacity를 설정했지만, fadeTo 애니메이션이 걸려 있어 이를 다시 수행해서 opacity가 1로 돌아옴.
							_self.targetJq.fadeTo(_self.animateSpan,_self.opacityFadeIn);
						}

						_self.curBlinkCnt++;
						
					}, this.intervalSpan);

				}

			}
			/*
				@ Public
				@ Desc : 전경색과 배경색을 바꿉니다.
			*/
			, targetColor:null
			, targetBGColor:null
			, _doBetweenColorNBGColor:function(){

				this.targetColor = this.targetJq.css("color"); 
				this.targetBGColor = this.targetJq.css("background-color"); 

				var _self = this;
				this.delegate_on_stop = 
				_obj.get_delegate(function(){

					this.targetJq.css("color",_self.targetBGColor);
					this.targetJq.css("background-color",_self.targetColor);

				},_self);

				if(this.intervalBlinkTarget == undefined) {
					
					this.intervalBlinkTarget = setInterval(function(){ 

						if( _self.maxBlinkCnt  < _self.curBlinkCnt ) {
							_self.targetJq.css("color",_self.targetColor);
							_self.targetJq.css("background-color",_self.targetBGColor);

							_self._stop();
							return;
						}

						if(_self.curBlinkCnt%2 === 0) {
							_self.targetJq.css("color",_self.targetBGColor);
							_self.targetJq.css("background-color",_self.targetColor);
						} else {
							_self.targetJq.css("color",_self.targetColor);
							_self.targetJq.css("background-color",_self.targetBGColor);
						}

						_self.curBlinkCnt++;
						
					}, this.intervalSpan);

				}

			}
			, _stop:function(){

				clearInterval(this.intervalBlinkTarget);
				this.intervalBlinkTarget = undefined;
				this.curBlinkCnt = 0;

				if(this.delegate_on_finish_blink != undefined) {
					this.delegate_on_finish_blink._func.apply(this.delegate_on_finish_blink._scope, [this]);
				}

				if(this.delegate_on_stop != undefined) {
					this.delegate_on_stop._func.apply(this.delegate_on_stop._scope, [this]);
				}

				// 깜빡이의 처음 opacity로 원래대로 돌려놓습니다.
				if(this.opacityInit != undefined) {
					this.targetJq.fadeTo(this.animateSpan,this.opacityInit);
				}

				// 전경색와 배경색도 원래대로 돌려놓습니다.
				if(this.targetColor != undefined) {
					this.targetJq.css("color",this.targetColor);	
				}
				if(this.targetBGColor != undefined) {
					this.targetJq.css("background-color",this.targetBGColor);
				}
			}			
		}

		return blinker;

	}
	/*
		@ private
		@ desc : 대화 내용이 추가로 있는 아래 방향 화살표 깜빡이를 설정합니다. 말풍선을 클릭시, 깜빡이가 멈춥니다.
	*/
	,set_blinker_text_arrow:function(delegate_on_finish_blink, param_obj, maxBlinkCnt){

		if(delegate_on_finish_blink == undefined) {
			console.log("!Error! / set_blinker_text_arrow / delegate_on_finish_blink == undefined");
		}

		if(maxBlinkCnt == undefined) {
			maxBlinkCnt = 5;
		}

		var cur_glyphicon_circle_arrow_down_jq = this.get_glyphicon_circle_arrow_down_jq();
		var blinker = 
		this.getBlinker(
			// targetJq
			cur_glyphicon_circle_arrow_down_jq
			// delegate_on_finish_blink
			, delegate_on_finish_blink
			// maxBlinkCnt
			, maxBlinkCnt
		);
		blinker._do();

		// 사용자가 말풍선을 누르면 깜빡이 애니메이션이 종료되고 다음 동작( sayLogin )을 진행합니다.
		var cur_text_balloon_clickable_mask_jq = this.get_text_balloon_clickable_mask_jq();
		if(cur_text_balloon_clickable_mask_jq != undefined && cur_text_balloon_clickable_mask_jq.length > 0) {
			cur_text_balloon_clickable_mask_jq.off();
			cur_text_balloon_clickable_mask_jq.click(function(e){
				$(this).off();
				blinker._stop();
			});
		} // if end

	}

}

// DB로 해결될 수 있는 문제가 아닌듯.

// DB에 저장될 내용들

// JESSIE와 당신이 있게될 장소(place) - 'page를 의미'와 시간(time), 그리고 친밀도(intimacy)

// TABLE 
// 	JESSIE_PAGE
// 	- id
// 	- name

// TABLE 
// 	JESSIE_N_YOU
// 	- member_id
// 	- intimacy

// TABLE 
// 	JESSIE_SAY
// 	- page_id
// 	- intimacy

// DB로 대화의 내용을 구현하려면? --> 이 부분이 구현되어야 운영이 가능
// JESSIE / HER STATUS
// JESSIE / YOUR STATUS
// PAGE
// 현재 사용자가 어느 페이지에 있는가?
// 제시는 어떤 상태인가?

//	- 제시는 당신을 사랑해요

//	- 제시는 당신을 자랑스러워 해요

//	- 제시는 당신과 친한 친구에요.

//	- 제시는 당신을 알아요.


//		-  제시는 당신을 도와주고 싶어해요

//	- 제시는 당신을 그리워해요
//		-  제시는 당신을 오랫동안 보지 못했어요.

//	- 제시는 당신을 몰라요
//		-  제시는 당신을 알고 싶어해요



//	- 제시는 당신과 멀어졌어요


// 사용자는 어떤 상태인가?