airborne.bootstrap.view.mobile.list = {
	//"#E8E8E8"	// tint gray
	BG_COLOR_VMOUSE_DOWN:"#33CC99" // emerald green 
	,TEXT_COLOR_VMOUSE_DOWN:"white"
	,TOUCH_DOWN_HOLDING_MILLI_SEC:50
	/*
		@ Desc : 제목 열이 클릭되었을 때의 배경 색깔 바뀜
	*/
	,setTableHeaderRowEvent:function(row_jq, delegate_obj, delegate_data){
		this.setTableRowEvent(row_jq, delegate_obj, "#585858", delegate_data);
	}
	,setTableRowEvent:function(target_jq, delegate_obj, bg_color_vmouse_down, delegate_data, text_color_vmouse_down){

		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;
		var _param = param_manager;

		if(_obj.isNotValidDelegate(delegate_obj) && delegate_obj == undefined){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / setTableRowEvent / _obj.isNotValidDelegate(delegate_obj)");
			return;
		}

		var text_color_vmouse_up = target_jq.css("color");
		var bg_color_vmouse_up = target_jq.css("background-color");

		var border_top_color = target_jq.css("border-top-color");
		var border_bottom_color = target_jq.css("border-bottom-color");

		if(bg_color_vmouse_down == undefined){
			bg_color_vmouse_down = text_color_vmouse_up;
		}
		if(text_color_vmouse_down == undefined){
			text_color_vmouse_down = bg_color_vmouse_up;
		}

		var _self = this;
		var time_elapsed_obj = null;
		target_jq.on("vmousedown", function(e){

			// e.stopPropagation();
			// e.preventDefault();

			if(is_scrolling){
				console.log("스크롤 중입니다.");

				if(time_elapsed_obj != undefined) {
					time_elapsed_obj = _dates.getTimeElapsed(time_elapsed_obj);
					console.log(">>> time_elapsed_obj :: ",time_elapsed_obj);
				}

				return;
			}

			var self_jq = $(this);
			self_jq.css("background-color", bg_color_vmouse_down);
			self_jq.css("color", text_color_vmouse_down);
			self_jq.css("opacity", ".5");
			self_jq.animate({opacity:1}, _self.TOUCH_DOWN_HOLDING_MILLI_SEC);

			self_jq.css("border-top-color", bg_color_vmouse_down);
			self_jq.css("border-bottom-color", bg_color_vmouse_down);

			if(self_jq.hasClass('active')){
				self_jq.removeClass('active').addClass('success');
			}
			
			time_elapsed_obj = _dates.getTimeElapsed();

			// 사용자가 지정한 위치를 눌렀을 때에 이벤트를 설정한 메서드의 델리게이트 함수를 호출합니다.
			// 이를 통해서 사용자의 뷰 중, 제어할 수 없는 부분을 위임합니다.
			/*
			if(_obj.isValidDelegate(delegate_obj)) {

				if(delegate_data == undefined) {
					delegate_data = {};
				}
				delegate_data[_param.EVENT_PARAM_EVENT_TYPE] = _param.EVENT_MOUSE_DOWN;
				delegate_obj._func.apply(
					// delegate scope
					delegate_obj._scope,
					// delegate params
					[
						{
							target_jq:self_jq
							, delegate_data:delegate_data
						}
					]
				); // delegate_obj_row ends

			} // if end
			*/

		});


		var initialize_row_look = function(_target_jq){

			_target_jq.css("background-color", bg_color_vmouse_up);
			_target_jq.css("color", text_color_vmouse_up);

			_target_jq.css("border-top-color", border_top_color);
			_target_jq.css("border-bottom-color", border_bottom_color);

			_target_jq.css("background-color", bg_color_vmouse_up);
			_target_jq.css("color", text_color_vmouse_up);

			if(_target_jq.hasClass('success')){
				_target_jq.removeClass('success').addClass('active');	
			}

		}

		var is_scrolling = false;
		target_jq.on("scrollstart",function(){

			var self_jq = $(this);
			if(is_scrolling === false) {
				is_scrolling = true;
				initialize_row_look(self_jq);
			}

			// 인터벌로 3초간 스크롤 위치를 확인합니다. 
			// 변화가 없다면 scroll stop으로 간주합니다.
			// $(window).scrollTop();

			var prevScrollTop = $(window).scrollTop();
			var scrollWatcherInterval = setInterval(function(){

				var curScrollTop = $(window).scrollTop();

				if(prevScrollTop != curScrollTop) {
					// 스크롤중
					prevScrollTop = curScrollTop;
				} else {
					// 스크롤 되지 않음. scroll stop으로 처리.
					is_scrolling = false;
					clearTimeout(scrollWatcherInterval);
				}

			}, 300);
			
		});		

		target_jq.on("scrollstop",function(){

			var self_jq = $(this);
			
			if(is_scrolling === true) {
				is_scrolling = false;
			}
		});

		target_jq.on("vmouseup", function(e){

			e.stopPropagation();
			e.preventDefault();

			var self_jq = $(this);

			initialize_row_look(self_jq);

			if(delegate_data == undefined) {
				delegate_data = {};
			}
			delegate_data[_param.EVENT_PARAM_EVENT_TYPE] = _param.EVENT_MOUSE_UP;

			// 모바일 웹 환경에서 사용자가 클릭을 했다고 판단하는 기준은 0.5초 이상 홀딩입니다.
			time_elapsed_obj = _dates.getTimeElapsed(time_elapsed_obj);

			if(time_elapsed_obj != null && time_elapsed_obj.time_diff_millsec > _self.TOUCH_DOWN_HOLDING_MILLI_SEC && !is_scrolling){

				if(_obj.isValidDelegate(delegate_obj)) {

					delegate_obj._func.apply(delegate_obj._scope,[{target_jq:$(this), delegate_data:delegate_data, _event:e}]);

				} else {

					var _self_jq = $(this);
					delegate_obj.set_target_jq(_self_jq);

					if(_obj.isValidDelegate(delegate_obj)) {
						// 1. 일반적인 델리게이트
						delegate_obj._func.apply(
							// delegate scope
							delegate_obj._scope,
							// delegate params
							[
								{
									target_jq:self_jq
									, delegate_data:delegate_data
								}
							]
						); // delegate_obj_row ends

					} else if(delegate_obj.get_delegate_obj_click_row != undefined) {
						// 2. 델리게이트 랩퍼 - delegate_obj의 내용이 동적으로 변경되어야 하는 경우
						// ex) 각 롤마다 멤버 리스트가 재활용되어 멤버 정보를 업데이트함.
						var delegate_obj_click_row = delegate_obj.get_delegate_obj_click_row();
						if(_obj.isValidDelegate(delegate_obj_click_row)) {

							if(delegate_data == undefined) {
								delegate_data = {};
								delegate_data[_param.EVENT_PARAM_EVENT_TYPE] = _param.EVENT_MOUSE_DOWN;
							} else {
								delegate_data[_param.EVENT_PARAM_EVENT_TYPE] = _param.EVENT_MOUSE_UP;	
							}
							delegate_obj_click_row._func.apply(
								delegate_obj_click_row._scope,
								[
									{
										target_jq:delegate_obj.get_target_jq()
										, delegate_data:delegate_data
									}
								]
							);	
						} // inner if end

					} // outer if end

				} // if end
				
			} else {
				time_elapsed_obj = null;
			} // outer if end

		});

		target_jq.on("scrollstart", function(e){
			e.stopPropagation();
			initialize_row_look($(this));
			// 스크롤이 시작되면 터치 홀딩이 초기화됩니다.
			time_elapsed_obj = null;
		});
		target_jq.on("scrollstop", function(e){
			e.stopPropagation();
			initialize_row_look($(this));
			// 스크롤이 멈추면 터치 홀딩이 초기화됩니다.
			time_elapsed_obj = null;
		});
		target_jq.on("vmouseout", function(e){
			e.stopPropagation();
			initialize_row_look($(this));
			// 스크롤이 멈추면 터치 홀딩이 초기화됩니다.
			time_elapsed_obj = null;
		});
		target_jq.on("vmousecancel", function(e){
			e.stopPropagation();
			initialize_row_look($(this));
			// 스크롤이 멈추면 터치 홀딩이 초기화됩니다.
			time_elapsed_obj = null;
		});

	}
	,setBtnEvent:function(row_jq, delegate_obj){

		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;

		if(_obj.isNotValidDelegate(delegate_obj)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / setTableRowEvent / _obj.isNotValidDelegate(delegate_obj)");
			return;
		}


		var _self = this;
		var time_elapsed_obj = null;
		row_jq.on("vmousedown", function(){
			time_elapsed_obj = _dates.getTimeElapsed();
		});

		row_jq.on("vmouseup", function(){
			// 모바일 환경에서 사용자가 클릭을 했다고 판단하는 기준은 0.5초 이상 홀딩입니다.
			time_elapsed_obj = _dates.getTimeElapsed(time_elapsed_obj);
			if(time_elapsed_obj != null && time_elapsed_obj.time_diff_millsec > _self.TOUCH_DOWN_HOLDING_MILLI_SEC){
				delegate_obj._func.apply(delegate_obj._scope,[this]);
			} else {
				time_elapsed_obj = null;
			}

		});
		row_jq.on("scrollstart", function(){
			time_elapsed_obj = null;
		});
		row_jq.on("scrollstop", function(){
			time_elapsed_obj = null;
		});
		row_jq.on("vmouseout", function(){
			time_elapsed_obj = null;
		});
		row_jq.on("vmousecancel", function(){
			time_elapsed_obj = null;
		});

	}	
	,getTableRowTitleNValueTag:function(title, value){

	}
	,getTableRowFoldingSelectorOptionObj:function(option_value, selected_value, option_name){
		if(_v.isNotValidStr(option_value)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / getTableRowFoldingSelectorOptionObj / _v.isNotValidStr(option_value)");
		}
		if(_v.isNotValidStr(option_name)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / getTableRowFoldingSelectorOptionObj / _v.isNotValidStr(option_name)");
		}
		if(_v.isNotValidStr(option_is_selected)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / getTableRowFoldingSelectorOptionObj / _v.isNotValidStr(option_is_selected)");
		}

		return {__value:option_value,__name:option_name,__is_selected:(option_value==selected_value)?"YES":"NO"};
	}
	,addTableRowBtn:function(title, color, delegate_obj, append_target_jq, delegate_data){
		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowBtn / _v.isNotValidStr(title)");
			return;
		}
		if(airborne.bootstrap.obj.isNotValidDelegate(delegate_obj)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowBtn / airborne.bootstrap.obj.isNotValidDelegate(delegate_obj)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowBtn / append_target_jq==null");
			return;
		}

		var row_id = airborne.html.getIdRandomTail(title) + "_btn";
		var row_tag = ""
		+ "<tr id=\"<ID>\" style=\"background-color:#f5f5f5;\">".replace(/\<ID\>/gi, row_id)
			+ "<td>"
				+ "<button id=\"<ID>\" type=\"button\" class=\"btn btn-default btn-lg btn-block\" style=\"color:#999;\"><strong><TITLE></strong></button>"
					.replace(/\<ID\>/gi, row_id)
					.replace(/\<TITLE\>/gi, title)
			+ "</td>"
		+ "</tr>"
		;
		append_target_jq.append(row_tag);
		var container_jq = append_target_jq.children().last();
		var btn_row_jq = container_jq.find(" button#" + row_id);

		// accessor

		var accessor = {
			target_jq:container_jq
			, get_target_jq:function() {
				return this.target_jq;
			}
			, btn_row_jq:btn_row_jq
			, get_button_jq:function() {
				return this.btn_row_jq;
			}
			, is_enabled:true
			, disable:function() {
				this.is_enabled = false;
			}
			, is_on:true
			, on:function() {

				if(!this.is_enabled) {
					return;
				}

				this.is_on = true;
				this.btn_row_jq.removeClass("disabled");
				this.btn_row_jq.css("opacity","1");
			}
			, off:function() {
				this.is_on = false;
				this.btn_row_jq.addClass("disabled");
				this.btn_row_jq.css("opacity",_param.OPACITY_DISABLED);
			}
			, get_is_on:function() {
				return this.is_on;
			}
			, delegate_data:delegate_data
			, delegate_obj:delegate_obj
			, call_on_click:function(external_delegate_data) {
				if(this.delegate_obj == undefined) {
					return;
				}

				if(external_delegate_data != undefined) {
					this.delegate_obj._func.apply(this.delegate_obj._scope,[external_delegate_data, this]);	
				} else {
					this.delegate_obj._func.apply(this.delegate_obj._scope,[this.delegate_data, this]);	
				}
				
			}
		};

		// Set Event
		
		btn_row_jq.on("click", function(){
			if(accessor.get_is_on()) {
				accessor.call_on_click();
				//delegate_obj._func.apply(delegate_obj._scope,[delegate_data, accessor]);
			}
		});

		return accessor;
	}
	,NOT_VALID:"NOT_VALID"
	,addTableRowInput:function(title, value, check_obj, append_target_jq){
		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowInput / _v.isNotValidStr(title)");
		}
		if(value==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowInput / value==null");
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowInput / append_target_jq==null");
		}

		var row_id = airborne.html.getIdRandomTail(title);
		var row_tag = ""
		+ "<tr class=\"active\" id=\"active_row\">"	
			+ "<td>"
			+ "<h5>"
			+ "<span style=\"text-center\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
			+ "</h5>"
			+ "</td>"
		+ "</tr>"
		+ "<tr id=\"<id>\">".replace(/\<id\>/gi, row_id)
			+ "<td>"
				+ "<h5>"
				+ "<input type=\"text\" id=\"<id>\" class=\"form-control\" value=\"<_v>\">"
					.replace(/\<id\>/gi, row_id)
					.replace(/\<_v\>/gi, value)
				+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;
		append_target_jq.append(row_tag);

		// Set Event
		var input_row_jq = append_target_jq.find("tr#" + row_id + " input#" + row_id);

		// Set check function obj
		if(check_obj != null && check_obj.conditions != null){
			check_obj.conditions.key = title;
			check_obj.conditions.referer_jq = input_row_jq;
		}
		var checkValid = function(){
			var is_valid = true;
			if( check_obj != null && check_obj.check_func != null ){
				var check_func = check_obj.check_func;
				is_valid = check_func.apply(null, [input_row_jq.val(), check_obj.conditions])
			}

			return is_valid;
		}
		input_row_jq.on("change", function(){
			var is_valid = checkValid.apply(null,[]);
			if(!is_valid){
				input_row_jq.focus();
			}
		});
		var _self = this;
		var accessor = {
			get:function(){

				if(!checkValid.apply(null,[])){
					input_row_jq.focus();
					return _self.NOT_VALID;
				}

				return input_row_jq.val();
			}
		}
		return accessor;

	}
	/*
		@ public
		@ desc : 테이블에 로그인 버튼을 그립니다. 
	*/
	,addTableRowLogIn:function(title, is_log_in, url_log_in, url_log_out, append_target_jq, text_color, bg_color){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(title)");
			return;
		}
		if(_v.isNotValidStr(is_log_in)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(is_log_in)");
			return;
		}
		if(_v.isNotValidStr(url_log_in)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(url_log_in)");
			return;
		}
		if(_v.isNotValidStr(url_log_out)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(url_log_out)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / append_target_jq==null");
			return;
		}
		if(text_color == undefined) {
			text_color = "#606060";
		}
		if(bg_color == undefined) {
			bg_color = "#ddd";
		}

		var row_id = "row_log_in_" + airborne.html.getIdRandomTail(title); 
		var row_tag = ""
		+ "<tr id=\"<ID>\">"
			.replace(/\<ID\>/gi, row_id)
			+ "<td class=\"text-center\" style=\"border:0px;color:<COLOR>;background-color:<BG_COLOR>\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BG_COLOR\>/gi, bg_color)
				+ "<h5>"
					+ "<span class=\"glyphicon glyphicon-user\"></span>"
					+ "&nbsp;&nbsp;"
					+ "<span id=\"log_in\">Log in</span>"
				+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.prepend(row_tag);

		var row_log_in_jq = $("table tr#" + row_id).find("td");
		var row_log_in_delegate_obj = _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

				console.log("!Error!\trow_log_in_delegate_obj\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
				return;
			}

			if(_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {
				if(is_log_in==_param.YES && confirm("Log out?")){
					location.href = url_log_out;
				} else if(is_log_in==_param.NO) {
					location.href = url_log_in;
				}
			}

		}, this);
		
		var bg_color_vmouse_down = text_color;
		var text_color_vmouse_down = bg_color;
		this.setTableRowEvent(
			// row_jq
			row_log_in_jq
			// delegate_obj
			, row_log_in_delegate_obj
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data
			, null
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		var span_log_in_jq = row_log_in_jq.find("span#log_in");
		span_log_in_jq.html(title);

		return row_log_in_jq.parent();
	}
	/*
		@ public
		@ desc : 테이블에 필드 영역으로 사용될 정보를 오브젝트로 반환합니다.
	*/
	,get_table_row_slot_obj:function(title, delegate_on_click){

		var table_row_slot_obj = {
			title:title
			, get_title:function() {
				return this.title;
			}			
			, delegate_on_click:delegate_on_click
			, get_delegate_on_click:function() {
				return this.delegate_on_click;
			}
		};

		return table_row_slot_obj;
	}
	/*
		@ public
		@ desc : 테이블에 로그인 버튼을 그립니다. 로그인 정보 외에 다른 내용을 표시할 수 있는 슬롯을 앞에 그립니다.
		ex) 클럽 표시 / 회원정보 표시
	*/
	,addTableRowLogInDoubleSlot:function(title, table_row_slot_obj_arr, is_log_in, url_log_in, url_log_out, append_target_jq, text_color, bg_color){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(title)");
			return;
		}
		if(_v.isNotValidArray(table_row_slot_obj_arr) && table_row_slot_obj_arr.length != 2){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidArray(table_row_slot_obj_arr)");
			return;
		}
		if(_v.isNotValidStr(is_log_in)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(is_log_in)");
			return;
		}
		if(_v.isNotValidStr(url_log_in)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(url_log_in)");
			return;
		}
		if(_v.isNotValidStr(url_log_out)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / _v.isNotValidStr(url_log_out)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowLogIn / append_target_jq==null");
			return;
		}
		if(text_color == undefined) {
			text_color = "#606060";
		}
		if(bg_color == undefined) {
			bg_color = "#ddd";
		}

		// table_row_slot_obj_arr

		var title_for_slot_left = table_row_slot_obj_arr[0].get_title();
		var delegate_on_click_for_slot_left = table_row_slot_obj_arr[0].get_delegate_on_click();
		var title_for_slot_right = table_row_slot_obj_arr[1].get_title();

		var row_id = "row_log_in_" + airborne.html.getIdRandomTail(title); 
		var row_tag = ""
		+ "<tr id=\"<ID>\">"
			.replace(/\<ID\>/gi, row_id)
			+ "<td class=\"text-center\" style=\"border:0px;padding:0px;font-size:14px;\">"
				+ "<div id=\"slot_left\" style=\"width:50%;float:left;padding-top:18px;padding-bottom:18px;border:0px;color:<COLOR>;background-color:<BG_COLOR>;\"><strong>" 
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BG_COLOR\>/gi, bg_color)
					+ "<span class=\"glyphicon glyphicon-bookmark\"></span>"
					+ "&nbsp;&nbsp;"
					+ "<span id=\"slot_left\"><TITLE></span>"
						.replace(/\<TITLE\>/gi, title_for_slot_left)
				+ "</strong></div>"
				+ "<div id=\"slot_right\" style=\"width:50%;float:right;padding-top:18px;padding-bottom:18px;border:0px;color:<COLOR>;background-color:<BG_COLOR>;\"><strong>"
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BG_COLOR\>/gi, bg_color)
					+ "<span class=\"glyphicon glyphicon-user\"></span>"
					+ "&nbsp;&nbsp;"
					+ "<span id=\"slot_right\"><TITLE></span>"
						.replace(/\<TITLE\>/gi, title_for_slot_right)
				+ "</strong></div>"
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.prepend(row_tag);



		var row_log_in_jq = $("table tr#" + row_id).find("td");
		var row_log_in_delegate_obj = _obj.getDelegate(function(delegate_data){

			if(	delegate_data == undefined ||
				delegate_data.delegate_data == undefined ||
				delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

				console.log("!Error!\trow_log_in_delegate_obj\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
				return;
			}

			if(_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {
				if(is_log_in==_param.YES && confirm("Log out?")){

					location.href = url_log_out;

				} else if(is_log_in==_param.NO) {

					location.href = url_log_in;

				}
			}

		}, this);


		// 양쪽 슬롯에 이벤트를 부여합니다.
		var bg_color_vmouse_down = text_color;
		var text_color_vmouse_down = bg_color;

		var slot_left_jq = row_log_in_jq.find("div#slot_left");
		this.setTableRowEvent(
			// row_jq
			slot_left_jq
			// delegate_obj
			, delegate_on_click_for_slot_left
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data
			, null
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		var slot_right_jq = row_log_in_jq.find("div#slot_right");
		this.setTableRowEvent(
			// row_jq
			slot_right_jq
			// delegate_obj
			, row_log_in_delegate_obj
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data
			, null
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		return row_log_in_jq.parent();
	}	
	,COLOR_RGB_MAX_BRIGHT:221
	,COLOR_RGB_MIN_DARK:48
	,addTableHeaderNavRow:function(header_arr, color_rgb_max_bright_arr, color_rgb_min_darker_arr, after_row_jq, color_text, bg_color_vmouse_down){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _html = airborne.html;
		if(_v.is_not_valid_array(header_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableHeaderNavRow / _v.isNotValidArray(header_arr)");
			return;
		}
		if(_v.is_not_valid_array(color_rgb_max_bright_arr) || color_rgb_max_bright_arr.length != 3) {
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableHeaderNavRow / _v.is_not_valid_arr(color_rgb_max_bright_arr)");
			return;
		}
		if(_v.is_not_valid_array(color_rgb_min_darker_arr) || color_rgb_min_darker_arr.length != 3) {
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableHeaderNavRow / _v.is_not_valid_arr(color_rgb_min_darker_arr)");
			return;
		}
		if(after_row_jq == undefined){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableHeaderNavRow / after_row_jq==null");
			return;
		}
		if(bg_color_vmouse_down == undefined){
			bg_color_vmouse_down = "#FFF";
		}

		var color_max = 255;
		var color_rgb_offset_arr = [];
		var max_depth = 5;
		for(var idx = 0; idx < color_rgb_max_bright_arr.length; idx++) {
			var color_rgb_max_bright = color_rgb_max_bright_arr[idx];
			var color_rgb_min_darker = color_rgb_min_darker_arr[idx];

			var color_range = color_rgb_max_bright - color_rgb_min_darker;
			var color_offset = color_range;

			if(header_arr.length > 1) {
				color_offset = parseInt(color_range/max_depth);
			}

			color_rgb_offset_arr.push(color_offset);
		}

		var row_jq_arr = [];
		var icon_arrow_clickable_mask_jq;
		var text_shadow_style = "2px 2px 2px <COLOR>".replace(/\<COLOR\>/gi, _color.COLOR_DARK_GRAY);
		for (var idx = 0; idx < header_arr.length; idx++) {

			var header_obj = header_arr[idx];

			var cur_color_min_dark_red = color_rgb_min_darker_arr[0];
			var cur_color_min_dark_green = color_rgb_min_darker_arr[1];
			var cur_color_min_dark_blue = color_rgb_min_darker_arr[2];

			var cur_color_offset_red = color_rgb_offset_arr[0];
			var cur_color_offset_green = color_rgb_offset_arr[1];
			var cur_color_offset_blue = color_rgb_offset_arr[2];

			var reversed_idx = (header_arr.length - 1) - idx;
			var cur_color_bg_red = cur_color_min_dark_red + (cur_color_offset_red * reversed_idx);
			var cur_color_bg_green = cur_color_min_dark_green + (cur_color_offset_green * reversed_idx);
			var cur_color_bg_blue = cur_color_min_dark_blue + (cur_color_offset_blue * reversed_idx);

			var cur_bg_color_tag = 
			"background-color:rgb(<COLOR_RED>,<COLOR_GREEN>,<COLOR_BLUE>);"
			.replace(/\<COLOR_RED\>/gi, cur_color_bg_red)
			.replace(/\<COLOR_GREEN\>/gi, cur_color_bg_green)
			.replace(/\<COLOR_BLUE\>/gi, cur_color_bg_blue)
			;

			var cur_color_max_darker_red = color_rgb_max_bright_arr[0];
			var cur_color_max_darker_green = color_rgb_max_bright_arr[1];
			var cur_color_max_darker_blue = color_rgb_max_bright_arr[2];

			var cur_text_color_tag = "color:<COLOR>;".replace(/\<COLOR\>/gi, color_text);
			var cur_td_style = "border:0px;";
			var cur_bg_style = "";

			var header_id = _html.getIdRandomTail(header_obj.__title + "_" + idx);
			
			var header_url = header_obj.__call_url;
			var header_title = header_obj.__title;

			var row_tag = ""
			+ "<tr id=\"<ID>\"  status=\"close\">"
				.replace(/\<ID\>/gi, header_id)
				+ "<td class=\"text-center\" __call_url=\"<CALL_URL>\" style=\"<_v><COLOR>\">"
					.replace(/\<_v\>/gi, cur_td_style)
					.replace(/\<COLOR\>/gi, cur_text_color_tag + cur_bg_color_tag + cur_bg_style)
					.replace(/\<CALL_URL\>/gi, header_url)
			;

			// 타이틀을 한가운데 보여줍니다.
			row_tag += "<div id=\"folder_clickable_mask\"style=\"width:100%;height:100%;\">"
					+ "<h4><span class=\"no_selection\" style=\"text-shadow:<TEXT_SHADOW>;\"><TITLE></span>"
						.replace(/\<TITLE\>/gi, header_title)
						.replace(/\<TEXT_SHADOW\>/gi, text_shadow_style)
			;

			row_tag += "</div>"
				+ "</h4></td>"
			+ "</tr>"
			;

			after_row_jq.after(row_tag);

			var row_tag_jq = after_row_jq.parent().find("tr#" + header_id).find("td");
			row_jq_arr.push(row_tag_jq);

			if(idx == 0 && header_arr.length > 1){
				icon_arrow_clickable_mask_jq = row_tag_jq.find("div#icon_arrow_clickable_mask");
			}

			// 첫번째 버튼을 제외한 나머지 버튼에만 이벤트 적용
			if(idx > 0 && header_arr.length > 1){
				this.setTableRowEvent(
					// row_jq
					row_tag_jq
					// delegate_obj_row
					, _obj.getDelegate(function(delegate_data){

						if(_param.EVENT_MOUSE_DOWN === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

							// 사용자가 첫번째 열을 터치. 누른 상태입니다.
							// 타이틀의 그림자를 지워줍니다.
							if(delegate_data.target_jq != undefined) {
								console.log("타이틀의 그림자를 지워줍니다. / delegate_data :: ",delegate_data);
								delegate_data.target_jq.find("span").css("text-shadow", "");
							}

						} else if (_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

							// 사용자가 첫번째 열을 터치 뒤, 뗀 상태입니다.
							// 타이틀의 그림자를 다시 보여줍니다.
							console.log("타이틀의 그림자를 다시 보여줍니다. / icon_arrow_clickable_mask_jq :: ",icon_arrow_clickable_mask_jq);
							delegate_data.target_jq.find("span").css("text-shadow", text_shadow_style);

							var __call_url = delegate_data.target_jq.attr("__call_url");
							location.href = __call_url;

						}

					}, this)
					// bg_color_vmouse_down
					// delegate_data
					// bg_color_vmouse_down
				);
			} // if end
		}

		// 첫번째 버튼에 적용할 이벤트 
		// 첫번째 버튼에는 '이전화면으로 이동' 기능이 있으므로 독립적인 이벤트 구현 로직이 필요하다.
		// if(_v.isValidArray(row_jq_arr) && header_arr.length > 1){
		if(_v.isValidArray(row_jq_arr)){
			var cur_row_tag_jq = row_jq_arr[0];
			var _self_obj = this;

			this.setTableRowEvent(
				// row_jq
				cur_row_tag_jq
				// delegate_obj
				, _obj.getDelegate(function(delegate_data){

					if(delegate_data == undefined || delegate_data.delegate_data == undefined) {
						return;
					}

					if (_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

						console.log("delegate_data ::: ",delegate_data);
						console.log("header_arr ::: ",header_arr);

						var last_header_obj = header_arr[(header_arr.length-1)];
						location.href = last_header_obj.__call_url;

						// TEST
						return;

						/*
						// 사용자가 첫번째 열을 터치 뒤, 뗀 상태입니다.
						// 타이틀의 그림자를 다시 보여줍니다.
						console.log("타이틀의 그림자를 다시 보여줍니다. / icon_arrow_clickable_mask_jq :: ",icon_arrow_clickable_mask_jq);
						delegate_data.target_jq.find("span").css("text-shadow", text_shadow_style);

						var _event = delegate_data._event;
						var is_hover = _obj.is_hover(_event, icon_arrow_clickable_mask_jq);
						if(is_hover === true) {

							// console.log("이전 페이지로 돌아갑니다.");
							var __call_url = header_arr[1].__call_url;
							location.href = __call_url;

						} else {

							// console.log("이전 페이지 목록을 보여줍니다.");
							var self_tag_jq = delegate_data.target_jq;
							var row_status = self_tag_jq.parent().attr("status");

							var next_row_status = (row_status == "close")?"open":"close";
							self_tag_jq.parent().attr("status",next_row_status);
							if(next_row_status == "close"){
								closeAll();
							} else {
								openAll();
							}

						}
						*/

					} // if end


				}, this)
				// bg_color_vmouse_down
				, color_text
				// delegate_data
				, null
				// color_text
				, bg_color_vmouse_down
			);

		} // for end

	}
	,ICON_FOLDER_ARROW_LEFT:"glyphicon-chevron-left"
	,ICON_FOLDER_CLOSE_CLASS:"glyphicon-folder-close"
	,ICON_FOLDER_OPEN_CLASS:"glyphicon-folder-open"
	,addTableContentFolderRow:function(content_arr, table_jq){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _html = airborne.html;
		if(_v.isNotValidArray(content_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableContentFolderRow / _v.isNotValidArray(content_arr)");
			return;
		}
		if(table_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableContentFolderRow / table_jq==null");
			return;
		}

		// [{__title:${TITLE}, __page_url:${PAGE_URL}},{__title:${TITLE}, __page_url:${PAGE_URL}},{__title:${TITLE}, __page_url:${PAGE_URL}}}]
		// #dddddd rgb(221,221,221) brighter --> #303030 rgb(48,48,48) darker
		// var color_rgb_max_bright = 221;
		// var color_rgb_min_darker = 48;

		var row_jq_arr = [];

		for (var idx = 0; idx < content_arr.length; idx++) {
			var content_obj = content_arr[idx];
			var row_id = _html.getIdRandomTail(content_obj.__title);
			
			var __call_url = content_obj.__call_url;
			var row_title = (idx == 0 && content_arr.length > 1)?"&nbsp;&nbsp;&nbsp;&nbsp;" + content_obj.__title:content_obj.__title;

			var row_tag = "";
			if(idx == 0 && content_arr.length > 1){
				row_tag += ""
				+ "<tr class=\"active\" id=\"<ID>\" style=\"color: rgb(51, 51, 51); background-color: rgba(0, 0, 0, 0);\" status=\"close\">"
					.replace(/\<ID\>/gi, row_id)
					+ "<td class=\"text-center\">"
						+ "<h4><TITLE>".replace(/\<TITLE\>/gi, row_title)
						+ "<span id=\"icon_folder\" class=\"glyphicon <_v>\" style=\"float:right;\"></span>".replace(/\<_v\>/gi, this.ICON_FOLDER_CLOSE_CLASS)
					+ "</h4></td>"
				+ "</tr>"
				;
			} else {
				row_tag += ""
				+ "<tr id=\"<ID>\"  __call_url=\"<CALL_URL>\">"
					.replace(/\<ID\>/gi, row_id)
					.replace(/\<CALL_URL\>/gi, __call_url)
					+ "<td class=\"text-left\">"
						+ "<h4><TITLE>".replace(/\<TITLE\>/gi, row_title)
						+ "<span id=\"icon\" class=\"glyphicon glyphicon-chevron-right\" style=\"float:right;\"></span>"
					+ "</h4></td>"
				+ "</tr>"
				;
			}
			table_jq.append(row_tag);

			var row_tag_jq = table_jq.parent().find("tr#" + row_id);
			row_jq_arr.push(row_tag_jq);

			// 첫번째 버튼을 제외한 나머지 버튼에만 이벤트 적용
			if(idx > 0 && content_arr.length > 1){
				
				this.setTableRowEvent(
					// row_jq
					row_tag_jq
					// delegate_obj
					, _obj.getDelegate(function(delegate_data){
						var __call_url = delegate_data.target_jq.attr("__call_url");
						// console.log(">>> __call_url : ",__call_url);
						location.href = __call_url;
					}, this)
					// bg_color_vmouse_down
					, null
				);
			}

		}
		this.addEventTableFolder(content_arr, row_jq_arr);
	}
	,addTableRowFolder:function(row_td_tag_arr, table_jq){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _html = airborne.html;
		if(_v.isNotValidArray(row_td_tag_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowFolder / _v.isNotValidArray(row_td_tag_arr)");
			return;
		}
		if(table_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowFolder / table_jq==null");
			return;
		}

		// [{__tag:${TITLE}, __page_url:${PAGE_URL}},{__tag:${TITLE}, __page_url:${PAGE_URL}},{__tag:${TITLE}, __page_url:${PAGE_URL}}}]
		// #dddddd rgb(221,221,221) brighter --> #303030 rgb(48,48,48) darker
		// var color_rgb_max_bright = 221;
		// var color_rgb_min_darker = 48;

		var row_jq_arr = [];

		for (var idx = 0; idx < row_td_tag_arr.length; idx++) {
			var content_obj = row_td_tag_arr[idx];
			var row_id = _html.getIdRandomTail("row_" + idx);

			var __call_url = content_obj.__call_url;


			var row_tag = "";
			if(idx == 0 && row_td_tag_arr.length > 1){
				row_tag += ""
				+ "<tr class=\"active\" id=\"<ID>\" style=\"color: rgb(51, 51, 51); background-color: rgba(0, 0, 0, 0);\" status=\"close\">"
					.replace(/\<ID\>/gi, row_id)
					+ "<td class=\"text-center\">"
						+ content_obj.__tag
					+ "</td>"
				+ "</tr>"
				;
			} else {
				row_tag += ""
				+ "<tr id=\"<ID>\"  __call_url=\"<CALL_URL>\">"
					.replace(/\<ID\>/gi, row_id)
					.replace(/\<CALL_URL\>/gi, __call_url)
					+ "<td class=\"text-left\">"
						+ content_obj.__tag
					+ "</td>"
				+ "</tr>"
				;
			}
			table_jq.append(row_tag);

			var row_tag_jq = table_jq.parent().find("tr#" + row_id);
			row_jq_arr.push(row_tag_jq);

			// 첫번째 버튼을 제외한 나머지 버튼에만 이벤트 적용
			if(idx > 0 && row_td_tag_arr.length > 1){

				var __delegate = content_obj.__delegate;
				var __delegate_data = content_obj.__delegate_data;

				this.setTableRowEvent(
					// row_jq
					row_tag_jq
					// delegate_obj
					, __delegate
					// bg_color_vmouse_down
					, null
					// delegate_data
					, __delegate_data
				);				

			}

		}
		this.addEventTableFolder(row_td_tag_arr, row_jq_arr);
	}	
	,addEventTableFolder:function(content_arr, row_jq_arr){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _html = airborne.html;

		if(_v.isNotValidArray(content_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addEventTableFolder / _v.isNotValidArray(content_arr)");
			return;
		}

		if(_v.isNotValidArray(row_jq_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addEventTableFolder / _v.isNotValidArray(row_jq_arr)");
			return;
		}

		var closeAll = function(){
			for (var idx = 1; idx < row_jq_arr.length; idx++) {
				var cur_row_tag_jq = row_jq_arr[idx];
				cur_row_tag_jq.hide();
			}
		}
		var openAll = function(){
			for (var idx = 1; idx < row_jq_arr.length; idx++) {
				var cur_row_tag_jq = row_jq_arr[idx];
				cur_row_tag_jq.show();
			}
		}
		closeAll();


		if(_v.isValidArray(row_jq_arr) && content_arr.length > 1){
			var cur_row_tag_jq = row_jq_arr[0];
			var _self_obj = this;

			this.setTableRowEvent(
				// row_jq
				cur_row_tag_jq
				// delegate_obj
				, _obj.getDelegate(function(delegate_data){

					var self_tag_jq = delegate_data.target_jq;
					var row_status = self_tag_jq.attr("status");

					if(_v.isNotValidStr(row_status)){
						console.log("!Error! / airborne.bootstrap.view.mobile.list / addEventTableFolder / _v.isNotValidStr(row_status)");
						return;
					}

					var next_row_status = (row_status == "close")?"open":"close";
					self_tag_jq.attr("status",next_row_status);
					var span_icon_jq = self_tag_jq.find("span#icon_folder");
					if(next_row_status == "close"){
						closeAll();
						span_icon_jq.removeClass(this.ICON_FOLDER_OPEN_CLASS).addClass(this.ICON_FOLDER_CLOSE_CLASS);
					} else {
						openAll();
						span_icon_jq.removeClass(this.ICON_FOLDER_CLOSE_CLASS).addClass(this.ICON_FOLDER_OPEN_CLASS);
					}

				}, this)
				// bg_color_vmouse_down
				, null
			);

		}		
	}
	/*
		@ Public
		@ Desc : 타이틀이 가운데 있는 열을 그립니다. 각 타이틀은 순서를 변경할 수 있습니다.
	*/
	,addTableRowTitleUpDown:function(title, append_target_jq, delegate_obj_click_btn_up, delegate_obj_click_btn_down, delegate_data, text_color, bg_color){
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitle / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitle / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_btn_up)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitle / _obj.isNotValidDelegate(delegate_obj_click_btn_up)");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_btn_down)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitle / _obj.isNotValidDelegate(delegate_obj_click_btn_down)");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_WHITE;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_DARK_GRAY;
		}


		var row_id = airborne.html.getIdRandomTail("addTableRowTitle" + title);
		var row_tag = "";
		var btn_color = _color.COLOR_MEDIUM_GRAY;
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
			+ "<td class=\"text-center\" style=\"color:<COLOR>;background-color:<BG_COLOR>;border-bottom:1px solid #ddd;\">"
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BG_COLOR\>/gi, bg_color)
				+ "<h5 style=\"float:left;\">"
					+ "<span><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
				+ "</h5>"
				+ "<button id=\"btn_down\" class=\"btn btn-default\" type=\"submit\" style=\"margin-left: 8px;float:right;\">"
					+ "<span id=\"icon_arrow\" class=\"glyphicon glyphicon-chevron-down\" style=\"padding-top:2px;padding-bottom:5px;padding-left:10px;padding-right:10px;color:<COLOR>;\"></span>"
						.replace(/\<COLOR\>/gi, btn_color)
				+ "</button>"
				+ "<button id=\"btn_up\" class=\"btn btn-default\" type=\"submit\" style=\"float:right;\">"
					+ "<span id=\"icon_arrow\" class=\"glyphicon glyphicon-chevron-up\" style=\"padding-top:2px;padding-bottom:5px;padding-left:10px;padding-right:10px;color:<COLOR>;\"></span>"
						.replace(/\<COLOR\>/gi, btn_color)
				+ "</button>"
			+ "</td>"
		+ "</tr>"
		;

		//<span id=\"icon_arrow\" class=\"glyphicon glyphicon-chevron-up\"></span>

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#" + row_id);

		var btn_up_jq = header_row_jq.find("button#btn_up");
		btn_up_jq.click(function(){
			delegate_obj_click_btn_up._func.apply(delegate_obj_click_btn_up._scope, [delegate_data]);
		});

		var btn_down_jq = header_row_jq.find("button#btn_down");
		btn_down_jq.click(function(){
			delegate_obj_click_btn_down._func.apply(delegate_obj_click_btn_up._scope, [delegate_data]);
		});

		var accessor_obj = {
			btn_up_jq:btn_up_jq
			,get_btn_up_jq:function() {
				return this.btn_up_jq;
			}
			,disable_btn_up:function() {
				this.btn_up_jq.attr("disabled","disabled");
				this.btn_up_jq.css("opacity",".2")
			}
			,btn_down_jq:btn_down_jq
			,get_btn_down_jq:function() {
				return this.btn_down_jq;
			}
			,disable_btn_down:function() {
				this.btn_down_jq.attr("disabled","disabled");
				this.btn_down_jq.css("opacity",".2")
			}
		}

		return accessor_obj;
	}
	/*
		@ Public
		@ Desc : 타이틀이 가운데 있는 열을 그립니다.
	*/
	,addTableRowTitle:function(title, append_target_jq, delegate_obj_click_row){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitle / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitle / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_row)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitle / _obj.isNotValidDelegate(delegate_obj_click_row)");
			return;
		}

		var row_id = airborne.html.getIdRandomTail("addTableRowTitle" + title);
		var row_tag = "";
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\" style=\"color:rgb(51, 51, 51);background-color:rgba(0, 0, 0, 0);border-bottom:1px solid #ddd;\">".replace(/\<_v\>/gi, row_id)
			+ "<td class=\"text-center\">"
				+ "<h5>"
					+ "<span><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
				+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#" + row_id);

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		this.setTableHeaderRowEvent(header_row_jq, delegate_obj_click_row);

		return header_row_jq;
	}		
	/*
		@ Public
		@ Desc : 왼쪽에 타이틀, 오른쪽에 뱃지가 있는 테이블 열을 그립니다.
	*/
	,addTableRowTitleNBadge:function(title, textInBadge, append_target_jq, delegate_obj_click_row, delegate_data, text_color_vmouse_down, bg_color_vmouse_down, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitleNBadge / _v.isNotValidStr(title)");
			return;
		}
		if(_v.isNotValidStr(textInBadge)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitleNBadge / _v.isNotValidStr(textInBadge)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitleNBadge / append_target_jq==null");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		if(bg_color_vmouse_down == undefined) {
			bg_color_vmouse_down = text_color;
		}
		if(text_color_vmouse_down == undefined) {
			text_color_vmouse_down = bg_color;
		}		

		var row_id = airborne.html.getIdRandomTail("addTableRowTitleNBadge" + title);
		var row_tag = "";
		row_tag += ""
		+ "<tr id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
			+ "<td class=\"text-left\" style=\"color:<COLOR>;background-color:<BG_COLOR>;border-bottom:1px solid #ddd;\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BG_COLOR\>/gi, bg_color)
				+ "<h5>"
					+ "<span class=\"no_selection\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
					+ "<span class=\"badge no_selection\" style=\"float:right;\"><strong><_v></strong></span>".replace(/\<_v\>/gi, textInBadge)
				+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		// Set Event
		var target_jq = append_target_jq.find("tr#" + row_id).find("td");

		var badge_jq = target_jq.find("span.badge");

		var target_controller = {
			target_jq:target_jq
			, badge_jq:badge_jq
			, set_badge_green:function() {
				this.badge_jq.css("background-color",_color.COLOR_EMERALD_GREEN);
			}
			, set_badge_gray:function() {
				this.badge_jq.css("background-color",_color.COLOR_MEDIUM_GRAY);
			}
		};
		if(delegate_data != undefined) {
			delegate_data.target_controller = target_controller;	
		}

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		if(_obj.isValidDelegate(delegate_obj_click_row)){

			this.setTableRowEvent(
				// row_jq
				target_jq
				// delegate_obj
				, delegate_obj_click_row
				// bg_color_vmouse_down
				, bg_color_vmouse_down
				// delegate_data 
				, delegate_data
				// text_color_vmouse_down
				, text_color_vmouse_down
			);
		} // if end

		return target_controller;
	}
	/*
		@ Public
		@ Desc : 화면에 표시되는 여러가지 이벤트 객체를 한꺼번에 toggle 시키는 obj를 반환합니다.
	*/
	,get_event_toggle_controller:function() {

		var event_toggle_controller = 
		{
			accessor_arr:[]
			, push:function(new_accessor) {
				if(new_accessor == undefined) {
					return;
				}
				if(new_accessor.on == undefined) {
					return;
				}
				if(new_accessor.off == undefined) {
					return;
				}
				this.accessor_arr.push(new_accessor);
			}
			, on:function(){
				if(_v.is_not_valid_array(this.accessor_arr)) {
					return;
				}
				for(var idx = 0; idx < this.accessor_arr.length; idx++) {
					var accessor = this.accessor_arr[idx];
					accessor.on();
				} // for end
			} // func end
			, off:function(){
				if(_v.is_not_valid_array(this.accessor_arr)) {
					return;
				}
				for(var idx = 0; idx < this.accessor_arr.length; idx++) {
					var accessor = this.accessor_arr[idx];
					accessor.off();
				} // for end
			} // func end
		}

		return event_toggle_controller;
	}
	/*
		@ Public
		@ Desc : 시간을 잴수 있는 타이머 열을 그립니다.
	*/
	,addTableRowTimer:function(time_table_arr, text_on_left, time_record_millisec, after_target_jq, delegate_obj_click_row, delegate_obj_on_time_update, delegate_data, text_color_vmouse_down, bg_color_vmouse_down, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidArray(time_table_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTimer / _v.isNotValidArray(time_table_arr)");
			return;
		}
		if(_v.isNotValidStr(text_on_left)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTimer / _v.isNotValidStr(text_on_left)");
			return;
		}
		if(_v.isNotNumber(time_record_millisec)){
			time_record_millisec = 0;
		}
		if(after_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTimer / after_target_jq==null");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		if(bg_color_vmouse_down == undefined) {
			bg_color_vmouse_down = text_color;
		}
		if(text_color_vmouse_down == undefined) {
			text_color_vmouse_down = bg_color;
		}

		var time_record = _dates.get_mm_ss_ss_from_millisec(time_record_millisec);
		var row_id = airborne.html.getIdRandomTail("addTableRowTitleNBadge" + text_on_left);
		var row_tag = "";
		row_tag += ""
		+ "<tr id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
			+ "<td class=\"text-left\" style=\"color:<COLOR>;background-color:<BG_COLOR>;border-bottom:1px solid #ddd;\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BG_COLOR\>/gi, bg_color)

					+ "<button id=\"btn_remove\" type=\"button\" class=\"btn btn-danger btn-ls btn-block ui-btn ui-shadow ui-corner-all\" style=\"width:60px;height:57px;float:left;margin-right:8px;\">"
						+ "&nbsp;<span class=\"glyphicon glyphicon-remove\"></span>&nbsp;"
					+ "</button>"
					+ "<button id=\"title_left\" type=\"button\" class=\"btn btn-default btn-lg btn-block\" style=\"color:<COLOR>;width:50%;float:left;margin:0px;\"><h5><TITLE></h5></button>"
						.replace(/\<TITLE\>/gi, text_on_left)
						.replace(/\<COLOR\>/gi, text_color)
					+ "<button id=\"timer_right\" type=\"button\" class=\"btn btn-default btn-lg btn-block\" style=\"color:<COLOR>;width:28%;float:right;margin:0px;\"><h5><TITLE></h5></button>"
						.replace(/\<TITLE\>/gi, time_record)
						.replace(/\<COLOR\>/gi, text_color)

			+ "</td>"
		+ "</tr>"
		;
		after_target_jq.after(row_tag);

		// Set Event
		var container_jq = after_target_jq.parent().find("tr#" + row_id);
		var target_jq = container_jq.find("td");

		var delete_btn_jq = target_jq.find("button#btn_remove");

		var title_btn_jq = target_jq.find("button#title_left");
		var title_btn_text_jq = title_btn_jq.find("h5");

		var timer_btn_jq = target_jq.find("button#timer_right");
		var timer_btn_text_jq = timer_btn_jq.find("h5");

		var target_controller = {
			NAME:"TABLE_ROW_TIMER"
			, container_jq:container_jq
			, get_container_jq:function() {
				return this.container_jq;
			}
			, target_jq:target_jq
			, title_btn_jq:title_btn_jq
			, get_title_btn_jq:function() {
				return this.title_btn_jq;
			}
			, title_btn_text_jq:title_btn_text_jq
			, get_title:function() {
				return this.title_btn_text_jq.html();
			}
			, set_title:function(new_title) {
				this.title_btn_text_jq.html(new_title);
			}
			, meta_data:null
			, add_meta_data:function(additional_meta_data) {

				var hasChanged = false;
				if(additional_meta_data == undefined) {
					return hasChanged;
				}
				
				if(this.meta_data ==  undefined) {
					this.meta_data = {};
				}

				// 1 depth의 객체의 키와 값을 추가합니다.
				for(var key in additional_meta_data) {
					var value = additional_meta_data[key];

					if(_v.isFunction(value)) {
						// 메서드는 제외합니다.
						continue;
					}

					// 이전과 동일한 값은 건너뜁니다.
					var prev_value = this.meta_data[key];
					if(prev_value === value) {
						continue;
					}

					this.meta_data[key] = value;
					hasChanged = true;
				}

				return hasChanged;
			}
			, get_meta_data:function() {
				return this.meta_data;
			}
			, get_meta_data_prop:function(prop_key) {
				if(_v.is_not_valid_str(prop_key)) {
					return null;
				}

				return this.meta_data[prop_key];
			}
			, timer_btn_jq:timer_btn_jq
			, get_timer_btn_jq:function() {
				return this.timer_btn_jq;
			}
			, timer_btn_text_jq:timer_btn_text_jq
			, set_time:function(time) {
				this.timer_btn_text_jq.html(time);
			}
			, get_time:function() {
				return this.timer_btn_text_jq.html();	
			}
			, time_table_arr:time_table_arr
			, get_time_table_arr:function() {
				return this.time_table_arr;
			}
			, delete_btn_jq:delete_btn_jq
			, get_delete_btn_jq:function() {
				return this.delete_btn_jq;
			}
			, hide_delete_btn:function() {
				if(this.delete_btn_jq == undefined) {
					return;
				}
				this.delete_btn_jq.hide();
				if(this.title_btn_jq == undefined) {
					return;
				}
				this.title_btn_jq.css("width","69%");
			}
			, EVENT_TYPE_CLICK_TITLE:"EVENT_TYPE_CLICK_TITLE"
			, EVENT_TYPE_CLICK_REMOVE:"EVENT_TYPE_CLICK_REMOVE"
			, EVENT_TYPE_CLICK_TIMER:"EVENT_TYPE_CLICK_TIMER"
			, time_elapsed_obj:null
			, time_stack_millisec:time_record_millisec
			, get_time_stack_millisec:function() {
				return this.time_stack_millisec;
			}
			, interval_timer_obj:null
			, EVENT_TYPE_START_TIMER:"EVENT_TYPE_START_TIMER"
			, EVENT_TYPE_STOP_TIMER:"EVENT_TYPE_STOP_TIMER"
			/*
				@ Public
				@ Desc : 현재 타이머 시간이 어떤 상태인지 색깔로 보여줍니다.
			*/
			, show_time_zone:function(time_stack_millisec) {

				var time_stack_sec = 0;
				if(time_stack_millisec != undefined && (0 < time_stack_millisec)) {
					time_stack_sec = parseInt(time_stack_millisec / 1000);
				}

				var time_table_arr = this.get_time_table_arr();
				var timer_btn_jq = this.get_timer_btn_jq();
				if(time_table_arr[0] <= time_stack_sec && time_stack_sec < time_table_arr[1] && !timer_btn_jq.hasClass("btn-success")) {
					console.log("GREEN ZONE");
					timer_btn_jq.removeClass("btn-default btn-success btn-warning btn-danger");
					timer_btn_jq.addClass("btn-success");
					timer_btn_jq.css("color", _color.COLOR_WHITE);
				} else if(time_table_arr[1] <= time_stack_sec && time_stack_sec < time_table_arr[2] && !timer_btn_jq.hasClass("btn-warning")) {
					console.log("YELLOW ZONE");
					timer_btn_jq.removeClass("btn-default btn-success btn-warning btn-danger");
					timer_btn_jq.addClass("btn-warning");
					timer_btn_jq.css("color", _color.COLOR_WHITE);
				} else if(time_table_arr[2] <= time_stack_sec && !timer_btn_jq.hasClass("btn-danger")) {
					console.log("RED ZONE");
					timer_btn_jq.removeClass("btn-default btn-success btn-warning btn-danger");
					timer_btn_jq.addClass("btn-danger");
					timer_btn_jq.css("color", _color.COLOR_WHITE);
				}

			}
			, start_timer:function() {

				console.log(">>> start_timer");

				this.time_elapsed_obj = _dates.getTimeElapsed(this.time_elapsed_obj, this.get_time_stack_millisec());

				var _self = this;
				this.interval_timer_obj = setInterval(function(){

					_self.time_elapsed_obj = _dates.getTimeElapsed(_self.time_elapsed_obj, _self.get_time_stack_millisec());

					// show new time
					var time_stack = _self.time_elapsed_obj.time_stack;

					// 1/100초까지 표현
					var cur_time_elapsed = _dates.get_mm_ss_ss_from_millisec(time_stack);
					_self.set_time(cur_time_elapsed);

					_self.show_time_zone(time_stack);

				}, 40);

				// TODO - 시간을 재는 동안은 다른 버튼들의 이벤트를 받지 않습니다.
				if(delegate_obj_on_time_update != undefined) {
					var delegate_data = {
						EVENT_TYPE:this.EVENT_TYPE_START_TIMER
						, target_controller:this
					};
					delegate_obj_on_time_update._func.apply(delegate_obj_on_time_update._scope,[delegate_data]);
				}
			}
			, stop_timer:function() {

				if(this.interval_timer_obj == undefined) {
					return;
				}

				clearInterval(this.interval_timer_obj);
				this.interval_timer_obj = null;
				if(this.time_elapsed_obj != undefined && this.time_elapsed_obj.time_stack != undefined) {
					this.time_stack_millisec = this.time_elapsed_obj.time_stack;
				}
				this.time_elapsed_obj = null;

				this.on();

				if(delegate_obj_on_time_update != undefined) {
					var delegate_data = {
						EVENT_TYPE:this.EVENT_TYPE_STOP_TIMER
						, target_controller:this
					};
					delegate_obj_on_time_update._func.apply(delegate_obj_on_time_update._scope,[delegate_data]);
				}
			}
			, event_toggle_obj:{
				EVENT_TYPE_CLICK_TITLE:true
				, EVENT_TYPE_CLICK_REMOVE:true
				, EVENT_TYPE_CLICK_TIMER:true
			}
			, is_on:true
			, on:function() {
				// 모든 버튼의 이벤트를 추가.
				this.event_toggle_obj.EVENT_TYPE_CLICK_TITLE = true;
				this.event_toggle_obj.EVENT_TYPE_CLICK_REMOVE = true;
				this.event_toggle_obj.EVENT_TYPE_CLICK_TIMER = true;

				var cur_delete_btn_jq = this.get_delete_btn_jq();
				var cur_title_btn_jq = this.get_title_btn_jq();
				var cur_timer_btn_jq = this.get_timer_btn_jq();

				cur_delete_btn_jq.removeClass("disabled");
				cur_timer_btn_jq.removeClass("disabled");

				cur_delete_btn_jq.css("opacity",_param.OPACITY_ENABLED);
				cur_timer_btn_jq.css("opacity",_param.OPACITY_ENABLED);

				this.on_title_btn();

			}
			/*
				@ Public
				@ Desc : 타이틀 버튼을 어떤 이벤트 상황에도 반응하지 않도록 비활성화 시킵니다.
			*/
			, is_title_btn_enabled:true
			, disable_title_btn:function() {
				this.is_title_btn_enabled = false;
			}
			, on_title_btn:function() {

				if(!this.is_title_btn_enabled) {
					return;
				}

				var cur_title_btn_jq = this.get_title_btn_jq();
				if(cur_title_btn_jq == undefined) return;

				cur_title_btn_jq.removeClass("disabled");
				cur_title_btn_jq.css("opacity",_param.OPACITY_ENABLED);
			}
			, off_title_btn:function() {
				var cur_title_btn_jq = this.get_title_btn_jq();
				if(cur_title_btn_jq == undefined) return;

				cur_title_btn_jq.addClass("disabled");
				cur_title_btn_jq.css("opacity",_param.OPACITY_DISABLED);
			}
			, off:function(event_type_exclude) {
				
				// 사용자가 지정한 버튼에 대해서는 이벤트를 유지.
				// 모든 버튼의 이벤트를 제거함.
				this.event_toggle_obj.EVENT_TYPE_CLICK_TITLE = false;
				this.event_toggle_obj.EVENT_TYPE_CLICK_REMOVE = false;
				this.event_toggle_obj.EVENT_TYPE_CLICK_TIMER = false;

				var cur_delete_btn_jq = this.get_delete_btn_jq();
				var cur_title_btn_jq = this.get_title_btn_jq();
				var cur_timer_btn_jq = this.get_timer_btn_jq();

				this.event_toggle_obj[event_type_exclude] = true;
				if(this.EVENT_TYPE_CLICK_REMOVE === event_type_exclude) {
					cur_delete_btn_jq.removeClass("disabled");
					cur_timer_btn_jq.addClass("disabled");

					cur_delete_btn_jq.css("opacity",_param.OPACITY_ENABLED);
					cur_timer_btn_jq.css("opacity",_param.OPACITY_DISABLED);

					this.off_title_btn();

				} else if(this.EVENT_TYPE_CLICK_TITLE === event_type_exclude) {

					cur_delete_btn_jq.addClass("disabled");
					cur_timer_btn_jq.addClass("disabled");

					cur_delete_btn_jq.css("opacity",_param.OPACITY_DISABLED);
					cur_timer_btn_jq.css("opacity",_param.OPACITY_DISABLED);

					this.on_title_btn();

				} else if(this.EVENT_TYPE_CLICK_TIMER === event_type_exclude) {

					cur_delete_btn_jq.addClass("disabled");
					cur_timer_btn_jq.removeClass("disabled");

					cur_delete_btn_jq.css("opacity",_param.OPACITY_DISABLED);
					cur_timer_btn_jq.css("opacity",_param.OPACITY_ENABLED);

					this.off_title_btn();

				} else {

					cur_delete_btn_jq.addClass("disabled");
					cur_timer_btn_jq.addClass("disabled");

					cur_delete_btn_jq.css("opacity",_param.OPACITY_DISABLED);
					cur_timer_btn_jq.css("opacity",_param.OPACITY_DISABLED);

					this.off_title_btn();

				}

				this.is_on = false;
			}
			, get_is_off:function(event_type) {
				return !this.get_is_on(event_type);
			}
			, get_is_on:function(event_type) {
				if(	this.event_toggle_obj == undefined && 
					this.event_toggle_obj[event_type] == undefined ) {
					return false;
				}

				return this.event_toggle_obj[event_type];
			}
		};
		target_controller.show_time_zone(target_controller.get_time_stack_millisec());


		if(delegate_data != undefined) {
			delegate_data.target_controller = target_controller;
		}
		

		delete_btn_jq.click(function(){
			if(target_controller.get_is_off(target_controller.EVENT_TYPE_CLICK_REMOVE)) {
				return;
			}

			if(confirm("Delete this?")) {

				target_controller.stop_timer();

				delegate_data.click_target_jq = $(this);
				delegate_data.EVENT_TYPE = target_controller.EVENT_TYPE_CLICK_REMOVE;
				delegate_obj_click_row._func.apply(delegate_obj_click_row._scope,[delegate_data]);
			}
		});


		title_btn_jq.click(function(){

			if(target_controller.get_is_off(target_controller.EVENT_TYPE_CLICK_TITLE)) {
				return;
			}

			delegate_data.click_target_jq = $(this);
			delegate_data.EVENT_TYPE = target_controller.EVENT_TYPE_CLICK_TITLE;
			delegate_obj_click_row._func.apply(delegate_obj_click_row._scope,[delegate_data]);
		});

		timer_btn_jq.click(function(){

			if(target_controller.get_is_off(target_controller.EVENT_TYPE_CLICK_TIMER)) {
				return;
			}
			
			delegate_data.click_target_jq = $(this);
			delegate_data.EVENT_TYPE = target_controller.EVENT_TYPE_CLICK_TIMER;
			delegate_obj_click_row._func.apply(delegate_obj_click_row._scope,[delegate_data]);

			// 1. 시간을 재기 시작합니다.
			if(target_controller.interval_timer_obj == undefined) {
				target_controller.start_timer();
				// 타이머 버튼을 제외한 나머지 버튼은 모두 비활성화처리합니다.
				target_controller.off(target_controller.EVENT_TYPE_CLICK_TIMER);
			} else {
				target_controller.stop_timer();
				target_controller.on();
			}
			
		});

		return target_controller;
	}	
	/*
		@ Public
		@ Desc : 테이블 열을 여러개를 그립니다. 이 테이블 열은 숨기거나 보일(접거나 펴거나) 수 있습니다.
	*/
	,addTableRowsSelectFolder:function(key_value_obj_arr, append_target_jq, delegate_obj_click_row, delegate_data, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidArray(key_value_obj_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowsSelectFolder / _v.isNotValidArray(key_value_obj_arr)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowsSelectFolder / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_row)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowsSelectFolder / _obj.isNotValidDelegate(delegate_obj_click_row)");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		bg_color_vmouse_down = text_color;
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		text_color_vmouse_down = bg_color;

		var row_id = airborne.html.getIdRandomTail("addTableRowsSelectFolder");
		var row_tag = "";
		for(var idx = 0; idx < key_value_obj_arr.length; idx++) {

			var key_value_obj = key_value_obj_arr[idx];

			// _obj.get_select_option 에서 만든 객체를 사용합니다.
			if(key_value_obj == undefined) {
				continue;
			}

			row_tag += ""
			+ "<tr id=\"<_v>\" style=\"color:<COLOR>;background-color:<BGCOLOR>;\" key=\"<key>\">"
					.replace(/\<_v\>/gi, row_id)
					.replace(/\<key\>/gi, key_value_obj.get_key())
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BGCOLOR\>/gi, bg_color)
				+ "<td class=\"text-center\">"
					+ "<h5>"
						+ "<span class=\"no_selection\"><strong><_v></strong></span>".replace(/\<_v\>/gi, key_value_obj.get_value())
					+ "</h5>"
				+ "</td>"
			+ "</tr>"
			;
		}

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq_arr = append_target_jq.find("tr#" + row_id);

		var table_row_selector_obj = {
			delegate_obj_click_row:delegate_obj_click_row
			, set_delegate_obj_click_row:function(delegate_obj_click_row) {
				this.delegate_obj_click_row = delegate_obj_click_row;
			}
			, get_delegate_obj_click_row:function() {
				return this.delegate_obj_click_row;
			}
			, delegate_data:delegate_data
			, set_delegate_data:function(delegate_data) {
				this.delegate_data = delegate_data;
			}
			, get_delegate_data:function() {
				return this.delegate_data;
			}
			, show:function() {
				if(this.get_target_jq_arr() == undefined) {
					return;
				}
				this.get_target_jq_arr().show();
			}
			, hide:function() {
				if(this.get_target_jq_arr() == undefined) {
					return;
				}
				this.get_target_jq_arr().hide();
			}
			, target_jq_arr:header_row_jq_arr
			, set_target_jq_arr:function(target_jq_arr) {
				this.target_jq_arr = target_jq_arr;
			}
			, get_target_jq_arr:function() {
				return this.target_jq_arr;
			}
			, target_jq:undefined
			, set_target_jq:function(target_jq) {
				this.target_jq = target_jq;
			}
			, get_target_jq:function() {
				return this.target_jq;
			}
		}

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		this.setTableRowEvent(
			// target_jq
			header_row_jq_arr
			// delegate_obj
			, table_row_selector_obj
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data 
			, table_row_selector_obj
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		return table_row_selector_obj;
	}	
	/*
		@ Public
		@ Desc : 테이블 열을 여러개를 그립니다. 이 테이블 열은 숨기거나 보일(접거나 펴거나) 수 있습니다. 이전 버전에서 이벤트 처리 메서드가 외부에 있던 것을 내부로 포함합니다.
	*/
	,addTableRowsSelectFolderV2:function(key_value_obj_arr, append_target_jq, delegate_obj_click_row, delegate_data, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidArray(key_value_obj_arr)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowsSelectFolder / _v.isNotValidArray(key_value_obj_arr)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowsSelectFolder / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_row)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowsSelectFolder / _obj.isNotValidDelegate(delegate_obj_click_row)");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		bg_color_vmouse_down = text_color;
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		text_color_vmouse_down = bg_color;

		var row_id = airborne.html.getIdRandomTail("addTableRowsSelectFolder");
		var row_tag = "";
		for(var idx = 0; idx < key_value_obj_arr.length; idx++) {

			var key_value_obj = key_value_obj_arr[idx];

			// _obj.get_select_option 에서 만든 객체를 사용합니다.
			if(key_value_obj == undefined) {
				continue;
			}

			row_tag += ""
			+ "<tr id=\"<_v>\" style=\"color:<COLOR>;background-color:<BGCOLOR>;\" key=\"<key>\">"
					.replace(/\<_v\>/gi, row_id)
					.replace(/\<key\>/gi, key_value_obj.get_key())
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BGCOLOR\>/gi, bg_color)
				+ "<td class=\"text-center\">"
					+ "<h5>"
						+ "<span class=\"no_selection\"><strong><_v></strong></span>".replace(/\<_v\>/gi, key_value_obj.get_value())
					+ "</h5>"
				+ "</td>"
			+ "</tr>"
			;
		}

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq_arr = append_target_jq.find("tr#" + row_id);

		var table_row_selector_obj = {
			delegate_obj_click_row:delegate_obj_click_row
			, set_delegate_obj_click_row:function(delegate_obj_click_row) {
				this.delegate_obj_click_row = delegate_obj_click_row;
			}
			, get_delegate_obj_click_row:function() {
				return this.delegate_obj_click_row;
			}
			, delegate_data:delegate_data
			, set_delegate_data:function(delegate_data) {
				this.delegate_data = delegate_data;
			}
			, get_delegate_data:function() {
				return this.delegate_data;
			}
			, show:function() {
				if(this.get_target_jq_arr() == undefined) {
					return;
				}
				this.get_target_jq_arr().show();
			}
			, hide:function() {
				if(this.get_target_jq_arr() == undefined) {
					return;
				}
				this.get_target_jq_arr().hide();

				// REFACTOR ME?
				var body = $("html, body");
				body.stop().animate({scrollTop:0}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
				   console.log("Finished animating");
				});
			}
			, target_jq_arr:header_row_jq_arr
			, set_target_jq_arr:function(target_jq_arr) {
				this.target_jq_arr = target_jq_arr;
			}
			, get_target_jq_arr:function() {
				return this.target_jq_arr;
			}
			, target_jq:undefined
			, set_target_jq:function(target_jq) {
				this.target_jq = target_jq;
			}
			, get_target_jq:function() {
				return this.target_jq;
			}
			, toggle_folder:function(delegate_obj, delegate_data) {

				if(	delegate_data == undefined || 
					delegate_data.target_jq == undefined ||
					delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined || 
					delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] !== _param.EVENT_MOUSE_UP
					) {
					console.log("!Error! / addTableRowsSelectFolderV2 / toggle_folder / delegate_data is not valid!");
					return;
				}

				if(_obj.isNotValidDelegate(delegate_obj)) {
					console.log("!Error! / addTableRowsSelectFolderV2 / toggle_folder / _obj.isNotValidDelegate(delegate_obj)");
					return;
				}

				// TODO 모든 열의 속성 - is_open 속성을 NO로 변경.
				// 이미 열려있는 열이 있는 상태에서 다른 열을 열면 이벤트 상태가 초기화되지 않음.
				// 사용자는 두번 열어야 함.

				delegate_data.target_jq.parent().after(this.get_target_jq_arr());
				if(delegate_data.target_jq.attr("is_open") === "YES") {

					delegate_data.target_jq.attr("is_open", "NO");

					this.hide();

				} else {

					delegate_data.target_jq.attr("is_open", "YES");
					this.show();

					// TODO 선택된 항목은 제외합니다.
					var cur_offset = delegate_data.target_jq.offset();

					var body = $("html, body");
					body.stop().animate({scrollTop:cur_offset.top}, _m_list.TOUCH_DOWN_HOLDING_MILLI_SEC, 'swing', function() { 
					   console.log("Finished animating");
					});

					var _self = this;

					this.set_delegate_obj_click_row(
						_obj.getDelegate(function(selected_delegate_data){

							var target_jq = selected_delegate_data.delegate_data.get_target_jq();
							var target_key = target_jq.attr("key");
							var target_value = target_jq.find("strong").html();

							var delegate_data_return = delegate_data.delegate_data;
							delegate_data_return[_param.SELECTED_KEY] = target_key;
							delegate_data_return[_param.SELECTED_VALUE] = target_value;

							delegate_obj._func.apply(delegate_obj._scope,[delegate_data_return]);

							_self.hide();

						},this)
					);

				} // if end				

			}
		}

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		this.setTableRowEvent(
			// target_jq
			header_row_jq_arr
			// delegate_obj
			, table_row_selector_obj
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data 
			, table_row_selector_obj
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		return table_row_selector_obj;
	}		
	/*
		@ Public
		@ Desc : 왼쪽에 타이틀이 있는 테이블 열을 그립니다.
	*/
	,addTableRowTitleLeft:function(title, append_target_jq, delegate_obj_click_row){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitleLeft / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitleLeft / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_row)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTitleLeft / _obj.isNotValidDelegate(delegate_obj_click_row)");
			return;
		}

		var row_id = airborne.html.getIdRandomTail("addTableRowTitleLeft" + title);
		var row_tag = "";
		row_tag += ""
		+ "<tr id=\"<_v>\" style=\"color:rgb(51, 51, 51);background-color:rgba(0, 0, 0, 0);\">".replace(/\<_v\>/gi, row_id)
			+ "<td class=\"text-left\">"
				+ "<h5>"
					+ "<span><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
				+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#" + row_id);

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		this.setTableRowEvent(header_row_jq, delegate_obj_click_row);

		return header_row_jq;
	}
	/*
		@ Public
		@ Desc : 입력창이 있는 열을 그립니다. 타이틀과 입력창 2줄이 만들어집니다.
	*/
	,addTableRowTextInput:function(title, append_target_jq, placeholder, value){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTextInput / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTextInput / append_target_jq==null");
			return;
		}
		if(value == undefined) {
			value = "";
		}

		var row_tag = "";
		var row_id = airborne.html.getIdRandomTail("addTableRowTextInput_" + title);
		var input_id = airborne.html.getId(title);

		// Set Title
		row_tag += ""
		+ "<tr class=\"active\" id=\"input_text_title_row\" status=\"close\">"
			+ "<td>"
			+ "<h5>"
			+ "<span style=\"text-center\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
			+ "<span id=\"icon\" class=\"glyphicon glyphicon-remove\" style=\"float:right;\"></span>"
			+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;

		// Set Input
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
			+ "<td>"
				+ "<input type=\"text\" id=\"input_<_v>\" class=\"form-control\" placeholder=\"<placeholder>\" value=\"<value>\">"
				.replace(/\<_v\>/gi, input_id)
				.replace(/\<placeholder\>/gi, placeholder)
				.replace(/\<value\>/gi, value)
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#input_text_title_row");
		var input_row_jq = append_target_jq.children().last().find("input");

		// clear text
		header_row_jq.click(function(e){
			if(confirm("clear all?")) {
				console.log("cleared!");
				input_row_jq.val("");
			}
		});	

		var accessor = {
			get:function(){
				return input_row_jq.val();
			}
			, focus:function(){
				input_row_jq.focus();
			}
		}

		return accessor;
	}
	/*
		@ Public
		@ Desc : 입력창이 있는 열을 그립니다. 타이틀과 입력창 2줄이 만들어집니다. 입력창을 추가 혹은 삭제가 가능합니다.
	*/
	,addTableRowTextInputFlexible:function(title, append_target_jq, placeholder, key_value_array, delegate_on_event, param_obj){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTextInputFlexible / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTextInputFlexible / append_target_jq==null");
			return;
		}

		var row_tag = "";
		var row_id = airborne.html.getIdRandomTail("addTableRowTextInputFlexible_" + title);
		var input_id = airborne.html.getId(title);

		// Set Title
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">".replace(/\<_v\>/gi, row_id)
			+ "<td style=\"border-bottom: 1px solid #ddd;\">"
				+ "<button id=\"btn_add\" type=\"button\" class=\"btn btn-default btn-lg btn-block\" style=\"color:#999;\"><strong><TITLE></strong></button>"
					.replace(/\<TITLE\>/gi, title)
			+ "</td>"
		+ "</tr>"
		;


		// Set Input
		if(key_value_array != undefined && key_value_array.length > 0) {

			for (var idx = 0;idx < key_value_array.length;idx++) {
				var key_value_obj = key_value_array[idx];

				row_tag += ""
				+ "<tr class=\"active\" id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
					+ "<td style=\"border-bottom: 1px solid #ddd;\">"

						+ "<button id=\"btn_remove\" type=\"button\" class=\"btn btn-danger btn-ls btn-block ui-btn ui-shadow ui-corner-all\" style=\"width:53px;height:49px;float:left;\">"
							+ "&nbsp;<span class=\"glyphicon glyphicon-remove\"></span>&nbsp;"
						+ "</button>"

						+ "<button id=\"btn_save\" type=\"button\" class=\"btn btn-default btn-ls btn-block ui-btn ui-shadow ui-corner-all\" style=\"width:53px;height:49px;float:left;display:none;margin:0px;\">"
							+ "&nbsp;<span class=\"glyphicon glyphicon-ok\"></span>&nbsp;"
						+ "</button>"

						+ "<textarea class=\"form-control\" _key=\"<key>\" _value=\"<value>\" rows=\"20\" style=\"height:49px;width:80%;float:right;\"><value></textarea>"
						.replace(/\<value\>/gi, key_value_obj.value)
						.replace(/\<key\>/gi, key_value_obj.key)
					+ "</td>"
				+ "</tr>"
				;

			}

		} // if end
		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#input_text_title_row");
		var input_row_jq_arr = append_target_jq.find("tr#" + row_id);

		var add_row_event = function(input_row_jq, param_obj) {

			if(param_obj == undefined) {
				param_obj = {};
			}			

			// set event - button remove
			var btn_remove_jq = input_row_jq.find("button#btn_remove");
			var textarea_jq = input_row_jq.find("textarea");
			var btn_save_jq = input_row_jq.find("button#btn_save");

			if(btn_remove_jq != undefined && btn_remove_jq.length > 0) {
				btn_remove_jq.click(function(e){

					var _self_jq = $(this);
					var text_area_jq = _self_jq.parent().find("textarea");

					var key = text_area_jq.attr("_key");
					var value = text_area_jq.attr("_value");

					if(delegate_on_event != undefined) {

						param_obj[_param.EVENT_PARAM_EVENT_TYPE] = _param.EVENT_DELETE;
						param_obj[_param.EVENT_PARAM_KEY] = key;
						param_obj[_param.EVENT_PARAM_VALUE] = value;
						param_obj[_param.EVENT_PARAM_TARGET_JQ] = input_row_jq;

						delegate_on_event._func.apply(delegate_on_event._scope,[param_obj]);
					}

				});
			}

			if(btn_save_jq != undefined && btn_save_jq.length > 0) {
				btn_save_jq.click(function(e){

					var key = textarea_jq.attr("_key");
					var init_value = textarea_jq.attr("_value");
					var value = textarea_jq.val();

					param_obj[_param.EVENT_PARAM_EVENT_TYPE] = _param.EVENT_INSERT;
					param_obj[_param.EVENT_PARAM_KEY] = key;
					param_obj[_param.EVENT_PARAM_VALUE] = value;
					param_obj[_param.EVENT_PARAM_TARGET_JQ] = input_row_jq;

					if((init_value != value) && delegate_on_event != undefined) {
						if(key == -1){
							delegate_on_event._func.apply(delegate_on_event._scope,[param_obj]);
						} else {
							delegate_on_event._func.apply(delegate_on_event._scope,[param_obj]);	
						}
					} // if end

					btn_remove_jq.show();
					btn_save_jq.hide();

				});

			} // if end

			// set event - on change
			textarea_jq.focus(function(e){
				btn_remove_jq.hide();
				btn_save_jq.show();
			});

		}

		// 새로운 열을 추가할 대상의 참조.
		var last_sibling_jq = append_target_jq.children().last();

		for(var idx = 0; idx < input_row_jq_arr.length; idx++) {
			// 각 열별로 이벤트를 부여합니다.
			var input_row_jq = $(input_row_jq_arr[idx]);

			var btn_add_jq = input_row_jq.find("button#btn_add");
			if(btn_add_jq != undefined && btn_add_jq.length > 0) {
				btn_add_jq.click(function(e){
					console.log("btn_add_jq // click");

					// 1. 새로운 열을 추가합니다.
					var new_row_tag = ""
					+ "<tr class=\"active\" id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
						+ "<td style=\"border-bottom: 1px solid #ddd;\">"

							+ "<button id=\"btn_remove\" type=\"button\" class=\"btn btn-danger btn-ls btn-block ui-btn ui-shadow ui-corner-all\" style=\"width:53px;height:49px;float:left;\">"
								+ "&nbsp;<span class=\"glyphicon glyphicon-remove\"></span>&nbsp;"
							+ "</button>"

							+ "<button id=\"btn_save\" type=\"button\" class=\"btn btn-default btn-ls btn-block ui-btn ui-shadow ui-corner-all\" style=\"width:53px;height:49px;float:left;display:none;margin:0px;\">"
								+ "&nbsp;<span class=\"glyphicon glyphicon-ok\"></span>&nbsp;"
							+ "</button>"

							+ "<textarea class=\"form-control\" _key=\"<key>\" _value=\"<value>\" rows=\"20\" style=\"height:49px;width:80%;float:right;\"><value></textarea>"

							.replace(/\<value\>/gi, "")
							.replace(/\<key\>/gi, -1)
						+ "</td>"
					+ "</tr>"
					;

					//append_target_jq.append(new_row_tag);

					last_sibling_jq = append_target_jq.find("tr#" + row_id).last();
					last_sibling_jq.after(new_row_tag);
					var last_row_jq = append_target_jq.find("tr#" + row_id).last();

					console.log(">> last_sibling_jq :: ",last_sibling_jq);
					console.log(">> last_row_jq :: ",last_row_jq);

					add_row_event(last_row_jq, param_obj);

					last_sibling_jq = last_row_jq;

				});
			}

			add_row_event(input_row_jq, param_obj);

		}

		var accessor = {
			get:function(){
				return input_row_jq.val();
			}
			, focus:function(){
				input_row_jq.focus();
			}
		}

		return accessor;
	}	
	/*
		@ Public
		@ Desc : 입력창이 있는 열을 그립니다. 입력된 배열값에 따라 여러개의 입력창이 추가됩니다.
	*/
	,addTableRowMultipleTextInputInline:function(title, append_target_jq, placeholder_arr, value_arr, delegate_on_blur, param_obj, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			title = "";
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMultipleTextInputInline / append_target_jq==null");
			return;
		}
		if(_v.isNotValidArray(placeholder_arr)) {
			placeholder_arr = [];
		}
		if(_v.isNotValidArray(value_arr)) {
			value = [];
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}

		var input_width = parseInt(80/value_arr.length) - 1;
		var margin_left = value_arr.length;

		var row_tag = "";
		var row_id = airborne.html.getIdRandomTail("addTableRowMultipleTextInputInline_" + title);
		var input_id = airborne.html.getId(title);
		var input_style = 
		"float:right;text-align:center;width:<WIDTH>%;color:<COLOR>;margin-left:<MARGIN_LEFT>%;"
		.replace(/\<COLOR\>/gi, text_color)
		.replace(/\<WIDTH\>/gi, input_width)
		.replace(/\<MARGIN_LEFT\>/gi, margin_left)
		;
		var title_display_style = "";

		// Set Input
		var btn_color = _color.COLOR_MEDIUM_GRAY;
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
			+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;border-bottom: 1px solid #ddd;\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BG_COLOR\>/gi, bg_color)

				// TITLE
				+ "<span id=\"title\" style=\"float:left;padding-left:0px;padding-top:7px;font-size:14px;<DISPLAY>;\" class=\"no_selection\"><strong><_v></strong></span>"
					.replace(/\<_v\>/gi, title)
					.replace(/\<DISPLAY\>/gi, title_display_style)

				// CONFIRM BUTTON
				+ "<button id=\"btn_save\" class=\"btn btn-default\" type=\"submit\" style=\"float:left;padding-left:0px;padding-top:7px;font-size:14px;display:none;\">"
					+ "<span id=\"icon_arrow\" class=\"glyphicon glyphicon-ok\" style=\"padding-bottom:4px;padding-left:18px;padding-right:6px;color:<COLOR>;\"></span>"
						.replace(/\<COLOR\>/gi, btn_color)
				+ "</button>"

		for(var idx = (value_arr.length-1); -1 < idx; idx--) {
			var value = value_arr[idx];
			var placeholder = placeholder_arr[idx];

			row_tag += ""
				+ "<input type=\"text\" id=\"input_<_v>\" class=\"form-control\" placeholder=\"<placeholder>\" value=\"<value>\" style=\"<style>\">"
				.replace(/\<_v\>/gi, input_id + "_"  + idx)
				.replace(/\<placeholder\>/gi, placeholder)
				.replace(/\<value\>/gi, value)
				.replace(/\<style\>/gi, input_style)
		}

		row_tag += ""
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		// SET EVENT
		var cur_input_container_jq = append_target_jq.children().last();

		var title_jq = cur_input_container_jq.find("span#title");
		var input_row_jq = cur_input_container_jq.find("input");
		var btn_save_jq = cur_input_container_jq.find("button#btn_save");

		var accessor = {
			input_row_jq:input_row_jq
			, get:function(){
				return this.input_row_jq.val();
			}
			, set_target_jq:function(input_row_jq) {
				this.input_row_jq = input_row_jq;
			}
			, get_target_jq:function() {
				return this.input_row_jq;
			}
			, get_input_jq:function(idx_input) {
				if(-1 < idx_input) {
					return $(this.input_row_jq.parent().find("input#input_" + input_id + "_" + idx_input));
				}
				return null;
			}
			, focus:function(){
				this.input_row_jq.focus();
			}
			, param_obj:param_obj
			, get_param_obj:function() {
				return this.param_obj;
			}
			, delegate_on_blur:delegate_on_blur
			, call_event_blur:function(select_input_jq) {

				console.log(">>> call_event_blur / this.is_on :: ",this.is_on);

				if(select_input_jq != undefined) {
					this.set_target_jq(select_input_jq);
				}
				if(this.delegate_on_blur != undefined && this.is_on === true) {
					this.delegate_on_blur._func.apply(this.delegate_on_blur._scope,[this]);
				}
			}
			, is_on:true
			, off:function() {
				this.is_on = false;
			}
			, get_is_on:function() {
				return this.is_on;
			}
		}

		input_row_jq.focus(function(){
			if(accessor.get_is_on()) {
				btn_save_jq.show();
				title_jq.hide();
			}
		});

		input_row_jq.blur(function(e){
			if(accessor.get_is_on()) {
				accessor.call_event_blur($(this));
				btn_save_jq.hide();
				title_jq.show();
			}
		});

		return accessor;

	}

	/*
		@ Public
		@ Desc : 입력창이 있는 열을 그립니다. 타이틀과 입력창이 한줄에 만들어집니다.
	*/
	,addTableRowTextInputInline:function(title, append_target_jq, placeholder, value, delegate_on_blur, param_obj, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			title = "";
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTextInputInline / append_target_jq==null");
			return;
		}
		if(value == undefined) {
			value = "";
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}


		var row_tag = "";
		var row_id = airborne.html.getIdRandomTail("addTableRowTextInputInline_" + title);
		var input_id = airborne.html.getId(title);
		var input_style = "float:right;text-align:center;width:80%;color:<COLOR>;".replace(/\<COLOR\>/gi, text_color);
		var title_display_style = "";
		if(title === "") {
			title_display_style = "display:block;";
			input_style = "float:right;text-align:center;width:100%;color:<COLOR>;".replace(/\<COLOR\>/gi, text_color);
		}

		// Set Input
		var btn_color = _color.COLOR_MEDIUM_GRAY;
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
			+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;border-bottom: 1px solid #ddd;\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BG_COLOR\>/gi, bg_color)
				// TITLE
				+ "<span id=\"title\" style=\"float:left;padding-left:0px;padding-top:7px;font-size:14px;<DISPLAY>;\" class=\"no_selection\"><strong><_v></strong></span>"
					.replace(/\<_v\>/gi, title)
					.replace(/\<DISPLAY\>/gi, title_display_style)
				// CONFIRM BUTTON
				+ "<button id=\"btn_save\" class=\"btn btn-default\" type=\"submit\" style=\"float:left;padding-left:0px;padding-top:7px;font-size:14px;display:none;\">"
					+ "<span id=\"icon_arrow\" class=\"glyphicon glyphicon-ok\" style=\"padding-bottom:4px;padding-left:18px;padding-right:6px;color:<COLOR>;\"></span>"
						.replace(/\<COLOR\>/gi, btn_color)
				+ "</button>"

				+ "<input type=\"text\" id=\"input_<_v>\" class=\"form-control\" placeholder=\"<placeholder>\" value=\"<value>\" style=\"<style>\">"
				.replace(/\<_v\>/gi, input_id)
				.replace(/\<placeholder\>/gi, placeholder)
				.replace(/\<value\>/gi, value)
				.replace(/\<style\>/gi, input_style)
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		// Set Event
		var cur_input_container_jq = append_target_jq.children().last();

		var title_jq = cur_input_container_jq.find("span#title");
		var input_row_jq = cur_input_container_jq.find("input");
		var btn_save_jq = cur_input_container_jq.find("button#btn_save");

		var accessor = {
			input_row_jq:input_row_jq
			, get:function(){
				return this.input_row_jq.val();
			}
			, focus:function(){
				this.input_row_jq.focus();
			}
			, get_target_jq:function() {
				return this.input_row_jq;
			}
			, param_obj:param_obj
			, get_param_obj:function() {
				return this.param_obj;
			}
			, delegate_on_blur:delegate_on_blur
			, call_event_blur:function() {
				if(this.delegate_on_blur != undefined && this.is_on === true) {
					this.delegate_on_blur._func.apply(this.delegate_on_blur._scope,[this]);
				}
			}
			, is_on:true
			, off:function() {
				this.is_on = false;
				this.input_row_jq.attr("disabled","disabled");
			}
			, get_is_on:function() {
				return this.is_on;
			}
		}

		input_row_jq.focus(function(){
			if(accessor.get_is_on()) {
				btn_save_jq.show();
				title_jq.hide();
			}
		});

		input_row_jq.blur(function(e){
			if(accessor.get_is_on()) {
				accessor.call_event_blur();
				btn_save_jq.hide();
				title_jq.show();
			}
		});

		return accessor;
	}	
	/*
		@ Public
		@ Desc : 문장 입력창이 있는 열을 그립니다. 타이틀과 입력창이 한줄에 만들어집니다.
	*/
	,addTableRowTextAreaInputInline:function(title, append_target_jq, placeholder, value, delegate_on_blur, param_obj, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTextAreaInputInline / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowTextAreaInputInline / append_target_jq==null");
			return;
		}
		if(value == undefined) {
			value = "";
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}		

		var row_tag = "";
		var row_id = airborne.html.getIdRandomTail("addTableRowTextAreaInputInline_" + title);
		var input_id = airborne.html.getId(title);
		var input_style = "float:right;text-align:center;width:80%;color:#808080;";

		// Set Input
		var btn_color = _color.COLOR_MEDIUM_GRAY;
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\">".replace(/\<_v\>/gi, row_id)
			+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;border-bottom: 1px solid #ddd;\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BG_COLOR\>/gi, bg_color)
				// TITLE
				+ "<span id=\"title\" style=\"float:left;padding-left:0px;padding-top:14px;font-size:14px;\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)

				// CONFIRM BUTTON
				+ "<button id=\"btn_save\" class=\"btn btn-default\" type=\"submit\" style=\"float:left;padding-left:0px;padding-top:7px;font-size:14px;display:none;\">"
					+ "<span id=\"icon_arrow\" class=\"glyphicon glyphicon-ok\" style=\"padding-top:8px;padding-bottom:12px;padding-left:18px;padding-right:6px;color:<COLOR>;\"></span>"
						.replace(/\<COLOR\>/gi, btn_color)
				+ "</button>"

				+ "<textarea class=\"form-control\" _key=\"<key>\" _value=\"<value>\" placeholder=\"<placeholder>\" rows=\"20\" style=\"height:49px;width:80%;float:right;color:<COLOR>;\"><value></textarea>"
					.replace(/\<_v\>/gi, input_id)
					.replace(/\<placeholder\>/gi, placeholder)
					.replace(/\<value\>/gi, value)
					.replace(/\<style\>/gi, input_style)
					.replace(/\<COLOR\>/gi, text_color)
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		var cur_input_container_jq = append_target_jq.children().last();

		var title_jq = cur_input_container_jq.find("span#title");
		var input_row_jq = cur_input_container_jq.find("textarea");
		var btn_save_jq = cur_input_container_jq.find("button#btn_save");

		var accessor = {
			input_row_jq:input_row_jq
			, get:function(){
				return this.input_row_jq.val();
			}
			, focus:function(){
				this.input_row_jq.focus();
			}
			, param_obj:param_obj
			, get_param_obj:function(){
				return this.param_obj;
			}
			, delegate_on_blur:delegate_on_blur
			, call_event_blur:function() {
				if(this.delegate_on_blur != undefined) {
					this.delegate_on_blur._func.apply(this.delegate_on_blur._scope,[this]);
				}
			}
			, off:function() {
				this.input_row_jq.attr("disabled","disabled");
			}
		}

		input_row_jq.focus(function(){
			btn_save_jq.show();
			title_jq.hide();
		});

		input_row_jq.blur(function(e){
			accessor.call_event_blur();
			btn_save_jq.hide();
			title_jq.show();
		});

		return accessor;
	}		
	/*
		@ Public
		@ Desc : 날짜 입력창이 있는 열을 그립니다.
	*/
	,addTableRowDateInput:function(title, append_target_jq, start_date, delegate_on_change, param_obj, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowDateInput / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowDateInput / append_target_jq==null");
			return;
		}
		if(start_date==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowDateInput / start_date==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_on_change)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowDateInput / _obj.isNotValidDelegate(delegate_on_change)");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}


		var row_tag = "";
		var row_id = airborne.html.getIdRandomTail("addTableRowDateInput_" + title);
		var input_id = airborne.html.getId(title);
		var input_style = "float:right;text-align:center;width:80%;border: 1px solid #ccc;border-radius: 4px;box-shadow: inset 0 1px 1px rgba(0,0,0,.075);font-size: 14px;color:<COLOR>;padding: 6px 12px;".replace(/\<COLOR\>/gi, text_color);

		// Set Title
		row_tag += ""
		+ "<tr class=\"active\" id=\"date_picker\">".replace(/\<_v\>/gi, row_id)
			+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>\">".replace(/\<COLOR\>/gi, text_color).replace(/\<BG_COLOR\>/gi, bg_color)
				+ "<input type=\"text\" class=\"span2 datepicker center-block\" data-date-format=\"yyyy-mm-dd\" readonly=\"\" style=\"<style>\">"
				.replace(/\<_v\>/gi, input_id)
				.replace(/\<style\>/gi, input_style)
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		// Set Event
		var datepicker_row_jq = append_target_jq.children().last();
		var input_jq = datepicker_row_jq.find("input");

		// ACCESSOR
		var accessor = {
			get:function(){
				return datepicker_jq.val();
			}
			, set:function(new_date){
				datepicker_jq.val(new_date);
			}
			, focus:function(){
				datepicker_jq.focus();
			}
			, param_obj:param_obj
			, get_param_obj:function() {
				return this.param_obj;
			}
			, input_jq:input_jq
			, off:function() {
				if(this.input_jq == undefined) {
					return;
				}
				this.input_jq.attr("disabled","disabled");
			}
			, on:function() {
				if(this.input_jq == undefined) {
					return;
				}
				this.input_jq.attr("disabled","");
			}
		};

		// Body - Content
		var datepicker_jq = datepicker_row_jq.find('.datepicker');
		datepicker_jq.val(start_date);
		datepicker_jq.datepicker({startDate:start_date});
		datepicker_jq.datepicker().on('changeDate', function(ev){
			$(this).datepicker('hide');
			delegate_on_change._func.apply(delegate_on_change._scope, [accessor]);
		});

		console.log("datepicker_jq :: ",datepicker_jq);

		var title_tag = "<span style=\"float:left;padding-left:0px;padding-top:7px;font-size:14px;\"><strong>Date</strong></span>";
		datepicker_jq.before(title_tag);

		return accessor;
	}		
	/*
		@ Public
		@ Desc : 모바일에서 kakaotalk, facebook, line등의 SNS 앱으로 아젠다 링크를 전달해주는 share row를 만듭니다.
	*/
	,addTableRowShareExternal:function(title, append_target_jq, label, url_desc, url, img_url, text_color, bg_color){

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowShareExternal / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowShareExternal / append_target_jq==null");
			return;
		}
		if(_v.isNotValidStr(label)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowShareExternal / _v.isNotValidStr(label)");
			return;
		}
		if(_v.isNotValidStr(url_desc)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowShareExternal / _v.isNotValidStr(url_desc)");
			return;
		}
		if(_v.isNotValidStr(url)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowShareExternal / _v.isNotValidStr(url)");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		var bg_color_vmouse_down = text_color;
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}

		try {
			if(Kakao == null) {
				console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowShareExternal / Kakao == undefined");
				return;
			}
		} catch(e) {
			console.log("CAUTION :: Network is not valid! Kakao share is disabled.");
			return;
		}


		// 1. kakaotalk (https://developers.kakao.com/apps/66421)

		// 네이티브 앱 키 		5080e81c91cd7e3fd50b0e09e0286625
		// REST API 키 		2a5d2a53f80f2d87d8e9dba10ff726bc
		// JavaScript 키 	f79f9e707a406ca442077516db048a1b
		// Admin 키 			cd7bb97d45a60ed791e33b82264b4347

		// script import 확인!
		// <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>

		var row_id = airborne.html.getIdRandomTail("TableRowShareExternal_" + title);		
		var kakao_btn_id = "kakao-link-btn" + row_id;
		var row_tag = ""
		+ "<tr class=\"active\" id=\"<_v>\" status=\"close\" style=\"border-bottom: 1px solid #ddd;\">".replace(/\<_v\>/gi, row_id)
			+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;\">"
				.replace(/\<BG_COLOR\>/gi, bg_color)
				.replace(/\<COLOR\>/gi, text_color)
				+ "<h5 style=\"margin:0px;\">"
				+ "<span style=\"float:left;padding-left:0px;padding-top:14px;font-size:14px;\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
				+ "<span id=\"container_btn\" style=\"float:right;\">"
	    			+ "<a id=\"<ID>\" href=\"javascript:;\" style=\"padding-left: 20px;\">"
	    				.replace(/\<ID\>/gi, kakao_btn_id)
	    				.replace(/\<COLOR\>/gi, text_color)
						+ "<img src=\"http://dn.api1.kage.kakao.co.kr/14/dn/btqa9B90G1b/GESkkYjKCwJdYOkLvIBKZ0/o.jpg\" style=\"width:40px;\"/>"
	    			+ "</a>"
    			+ "</span>"
				+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);
		// activate kakaotalk 
	    // 사용할 앱의 JavaScript 키를 설정해 주세요.
		try {
			if(Kakao.Link == undefined) {
				Kakao.init('f79f9e707a406ca442077516db048a1b');	
			}
		} catch(err) {
		    console.log(">>> err :: ",err);
		}

	    // check url
	    // /service/toast-master --> http://localhost/service/toast-master
	    var root_domain = _server.get_root_domain();
	    if(url.indexOf("http://") == -1) {
	    	url = root_domain + url;
	    }

	    // 카카오톡 링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
	    Kakao.Link.createTalkLinkButton({
			container: '#' + kakao_btn_id,
			label: label,
			image: {
				src: root_domain + img_url,
				width: '200',
				height: '200'
			},
			webButton: {
				text: url_desc,
				url: url // 앱 설정의 웹 플랫폼에 등록한 도메인의 URL이어야 합니다.
			}
	    });

		// 카카오톡으로 메시지 보내기 / 정말 메시지만 전송됨.
		/*
	    function sendLink() {

	    	console.log(">>> 001");

			Kakao.Link.sendTalkLink({
				label: '안녕하세요, 꽃다운 ' + Math.floor(Math.random()*(70)+ 15) + '살 개발자입니다.'
			});
	    }	
	    */	


		var share_row_jq = append_target_jq.find("tr#" + row_id).find("td");

		var link_jq = share_row_jq.find("a#kakao-link-btn").find("img");

		link_jq.click(function(){
			console.log(">>> 001");
			sendLink();
		});

		console.log(">>> link_jq :: ",link_jq);

		return share_row_jq;
	}

	/*
		@ Public
		@ Desc : 다른 페이지 뷰로 이동하는 테이블 열을 그립니다.
	*/
	,addTableRowMovingArrow:function(title, append_target_jq, delegate_obj_click_row, is_bold, param_obj, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMovingArrow / _v.isNotValidStr(title)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMovingArrow / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_row)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMovingArrow / _obj.isNotValidDelegate(delegate_obj_click_row)");
			return;
		}
		if(is_bold == undefined) {
			is_bold = false;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		var bg_color_vmouse_down = text_color;
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		var text_color_vmouse_down = bg_color;

		var row_id = airborne.html.getIdRandomTail("TableRowMovingArrow_" + title);

		// Set Title
		var row_tag = "";
		if(is_bold) {

			row_tag += ""
			+ "<tr class=\"active\" id=\"<_v>\" status=\"close\" style=\"border-bottom: 1px solid #ddd;\">".replace(/\<_v\>/gi, row_id)
				+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;\">"
					.replace(/\<BG_COLOR\>/gi, bg_color)
					.replace(/\<COLOR\>/gi, text_color)
					+ "<h5>"
					+ "<span class=\"no_selection\" style=\"text-center\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
					+ "<span id=\"icon\" class=\"glyphicon glyphicon-chevron-right no_selection\" style=\"float:right;\"></span>"
					+ "</h5>"
				+ "</td>"
			+ "</tr>"
			;

		} else {

			row_tag += ""
			+ "<tr class=\"active\" id=\"<_v>\" status=\"close\" style=\"border-bottom: 1px solid #ddd;\">".replace(/\<_v\>/gi, row_id)
				+ "<td style=\"padding:15px;color:<COLOR>;background-color:<BG_COLOR>;\">"
				.replace(/\<BG_COLOR\>/gi, bg_color)
				.replace(/\<COLOR\>/gi, text_color)
				+ "<span class=\"no_selection\" style=\"text-center;font-size:small;\"><_v></span>"
				.replace(/\<_v\>/gi, title)
				+ "<span id=\"icon\" class=\"glyphicon glyphicon-chevron-right no_selection\" style=\"float:right;font-size:13px;\"></span>"
				+ "</td>"
			+ "</tr>"
			;

		}

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#" + row_id).find("td");

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		this.setTableRowEvent(
			// row_jq
			header_row_jq
			// delegate_obj
			, delegate_obj_click_row
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data
			, param_obj
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		return header_row_jq;
	}
	// @ Public
	// @ Desc : 다른 페이지 뷰로 이동하는 테이블 열을 그립니다. 추가 정보를 제공하는 배지가 있습니다.
	,addTableRowMovingArrowWidthBadge:function(title, title_on_badge, append_target_jq, delegate_obj_click_row, is_bold, param_obj, text_color, bg_color){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMovingArrowWidthBadge / _v.isNotValidStr(title)");
			return;
		}
		if(_v.isNotValidStr(title_on_badge)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMovingArrowWidthBadge / _v.isNotValidStr(title_on_badge)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMovingArrowWidthBadge / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_row)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowMovingArrowWidthBadge / _obj.isNotValidDelegate(delegate_obj_click_row)");
			return;
		}
		if(is_bold == undefined) {
			is_bold = false;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}

		var row_id = airborne.html.getIdRandomTail("TableRowMovingArrow_" + title);

		// Set Title
		var row_tag = "";
		if(is_bold) {

			row_tag += ""
			+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">".replace(/\<_v\>/gi, row_id)
				+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;\">"
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BG_COLOR\>/gi, bg_color)
					+ "<h5>"
						+ "<span style=\"text-center\" class=\"no_selection\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
						+ "<span id=\"icon\" class=\"glyphicon glyphicon-chevron-right no_selection\" style=\"float:right;\"></span>"
						+ "<span class=\"badge no_selection\" style=\"float:right;\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title_on_badge)
					+ "</h5>"
				+ "</td>"
			+ "</tr>"
			;

		} else {

			row_tag += ""
			+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">".replace(/\<_v\>/gi, row_id)
				+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;padding:15px;\">"
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BG_COLOR\>/gi, bg_color)
					+ "<span style=\"text-center;font-size:small;\" class=\"no_selection\"><_v></span>".replace(/\<_v\>/gi, title)
					+ "<span id=\"icon\" class=\"glyphicon glyphicon-chevron-right no_selection\" style=\"float:right;font-size:13px;\"></span>"
					+ "<span class=\"badge no_selection\" style=\"float:right;\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title_on_badge)
				+ "</td>"
			+ "</tr>"
			;

		}

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#" + row_id).find("td");

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		var bg_color_vmouse_down = text_color;
		var text_color_vmouse_down = bg_color;
		this.setTableRowEvent(
			// row_jq
			header_row_jq
			// delegate_obj
			, delegate_obj_click_row
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data
			, param_obj
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		return header_row_jq;
	}
	// @ Public
	// @ Desc : 클릭시, 지정한 주소의 페이지를 iframe으로 보여줍니다. 추가 정보를 제공하는 배지가 있습니다.
	,add_table_row_badge_n_iframe:function(title, title_on_badge, append_target_jq, delegate_obj_click_row, is_bold, param_obj, text_color, bg_color, iframe_page_link, iframe_height){

		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / add_table_row_badge_n_iframe / _v.isNotValidStr(title)");
			return;
		}
		if(_v.isNotValidStr(title_on_badge)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / add_table_row_badge_n_iframe / _v.isNotValidStr(title_on_badge)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / add_table_row_badge_n_iframe / append_target_jq==null");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_obj_click_row)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / add_table_row_badge_n_iframe / _obj.isNotValidDelegate(delegate_obj_click_row)");
			return;
		}
		if(is_bold == undefined) {
			is_bold = false;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		if(_v.is_not_valid_str(iframe_page_link)) {
			console.log("!Error! / airborne.bootstrap.view.mobile.list / add_table_row_badge_n_iframe / _v.is_not_valid_str(iframe_page_link)");
			return;
		}
		if(_v.is_not_unsigned_number(iframe_height)) {
			console.log("!Error! / airborne.bootstrap.view.mobile.list / add_table_row_badge_n_iframe / _v.is_not_unsigned_number(iframe_height)");
			return;
		}

		console.log("iframe_page_link :::: ",iframe_page_link);


		var row_id = airborne.html.getIdRandomTail("TableRowMovingArrow_" + title);
		var row_id_iframe = row_id + "_iframe";
		var iframe_id = row_id + "_iframe_entity";

		// Set Title
		var row_tag = "";
		if(is_bold) {

			row_tag += ""
			+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">".replace(/\<_v\>/gi, row_id)
				+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;\">"
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BG_COLOR\>/gi, bg_color)
					+ "<h5>"
						+ "<span style=\"text-center\" class=\"no_selection\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
						+ "<span class=\"badge no_selection\" style=\"float:right;\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title_on_badge)
					+ "</h5>"
				+ "</td>"
			+ "</tr>"
			+ "<tr class=\"active\" id=\"<_v>\" style=\"display:none;\">".replace(/\<_v\>/gi, row_id_iframe)
				+ "<td style=\"background-color:#DDD;\">"
					+ "<iframe id=\"<_v>\" src=\"<LINK>\" width=\"100%\" height=\"<HEIGHT>px\" frameborder=\"0\"></iframe>"
					.replace(/\<LINK\>/gi, iframe_page_link)
					.replace(/\<_v\>/gi, iframe_id)
					.replace(/\<HEIGHT\>/gi, iframe_height)
				+ "</td>"
			+ "</tr>"
			;

		} else {

			row_tag += ""
			+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">".replace(/\<_v\>/gi, row_id)
				+ "<td style=\"color:<COLOR>;background-color:<BG_COLOR>;padding:15px;\">"
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BG_COLOR\>/gi, bg_color)
					+ "<span style=\"text-center;font-size:small;\" class=\"no_selection\"><_v></span>".replace(/\<_v\>/gi, title)
					+ "<span class=\"badge no_selection\" style=\"float:right;\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title_on_badge)
				+ "</td>"
			+ "</tr>"
			+ "<tr class=\"active\" id=\"<_v>\" style=\"display:none;\">".replace(/\<_v\>/gi, row_id_iframe)
				+ "<td style=\"background-color:#DDD;\">"
					+ "<iframe id=\"<_v>\" src=\"<LINK>\" width=\"100%\" height=\"<HEIGHT>px\" frameborder=\"0\"></iframe>"
					.replace(/\<LINK\>/gi, iframe_page_link)
					.replace(/\<_v\>/gi, iframe_id)
					.replace(/\<HEIGHT\>/gi, iframe_height)
				+ "</td>"
			+ "</tr>"
			;

		}

		append_target_jq.append(row_tag);

		// Set Event
		var header_row_container_jq = append_target_jq.find("tr#" + row_id);
		var header_row_jq = append_target_jq.find("tr#" + row_id).find("td");
		var header_row_iframe_jq = append_target_jq.find("tr#" + row_id_iframe);

		param_obj.header_row_iframe_jq = header_row_iframe_jq;

		var delegate_obj = 
		_obj.getDelegate(function(delegate_data){

			var status = header_row_container_jq.attr("status");
			var is_close = false;
			if(status === "close") {
				header_row_container_jq.attr("status","open");
				header_row_iframe_jq.show();
				is_close = false;
				console.log();
			} else {
				header_row_container_jq.attr("status","close");
				is_close = true;
			}

			// 외부 delegate로 파라미터를 넘겨줍니다.
			delegate_obj_click_row._apply([delegate_data.delegate_data]);

			// scroll screen
			var scroll_to_y_pos = header_row_container_jq.offset().top;
			if(is_close) {
				scroll_to_y_pos = 0;
			}

			$('html, body').animate(
				{
                    scrollTop:scroll_to_y_pos
            	}
            	, 500
            	, function() {
    				// Animation complete.
    				if(is_close) {
    					header_row_iframe_jq.hide();
    				}
				}
			);

		}, this);

		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		var bg_color_vmouse_down = text_color;
		var text_color_vmouse_down = bg_color;
		this.setTableRowEvent(
			// row_jq
			header_row_jq
			// delegate_obj
			, delegate_obj
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data
			, param_obj
			// text_color_vmouse_down
			, text_color_vmouse_down
		);

		return header_row_jq;
	}
	/*
		@ Public
		@ Desc : 두가지 항목중에 한가지를 토글로 선택할 수 있는 테이블 열을 만듭니다.
		@ Referer : http://www.bootstraptoggle.com/
	*/	
	,addTableRowToggle:function(title, toggle_on_n_off, append_target_jq, text_color, bg_color, delegate_on_click, delegate_data){
		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowToggle / _v.isNotValidStr(title)");
			return;
		}
		if(toggle_on_n_off == undefined){
			toggle_on_n_off = false;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowToggle / append_target_jq==null");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}

		// Sample
		//
		// [
		// 	{__value:$ID,__name:$NAME,__is_selected:"YES"||"NO"}
		// 	,{__value:$ID,__name:$NAME,__is_selected:"YES"||"NO"}
		// ]


		var row_id = airborne.html.getIdRandomTail(title);

		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">"
			.replace(/\<_v\>/gi, row_id)
			+ "<td style=\"color:<COLOR>;background-color:<BGCOLOR>;\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BGCOLOR\>/gi, bg_color)
				+ "<h5 style=\"float:left;\">"
					+ "<span style=\"text-center\"><strong><_v></strong></span>"
						.replace(/\<_v\>/gi, title)
				+ "</h5>"
				+ "<div id=\"toggle_container\" style=\"float:right;\">"
					+ "<input id=\"toggle_input\" type=\"checkbox\" data-toggle=\"toggle\" data-on=\"Running\" data-off=\"Sleeping\">"
				+ "</div>"
			+ "</td>"
		+ "</tr>"
		;

		append_target_jq.append(row_tag);

		var toggle_container_jq = append_target_jq.children().last().find("div#toggle_container");
		var toggle_input_jq = toggle_container_jq.find("input#toggle_input");

		// toggle_on_n_off

		if(toggle_on_n_off === true) {
			toggle_input_jq.bootstrapToggle("on");
		} else {
			toggle_input_jq.bootstrapToggle("off");
		}

		toggle_input_jq.change(function(){

			var checked = $(this).prop('checked');

			console.log("here! / checked :: ",checked);

			if(delegate_data == undefined) {
				delegate_data = {};
			}
			delegate_data.checked = checked;

			if(delegate_on_click != undefined) {
				delegate_on_click._func.apply(delegate_on_click._scope, [delegate_data]);
			}
		});

	}
	/*
		@ Public
		@ Desc : 여러가지 항목중에 한가지를 선택할 수 있는 테이블 열을 만듭니다.
	*/	
	,addTableRowFoldingSelector:function(title, list, append_target_jq, text_color, bg_color){

		if(_v.isNotValidStr(title)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowFoldingSelector / _v.isNotValidStr(title)");
			return;
		}
		if(_v.isNotValidArray(list)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowFoldingSelector / _v.isNotValidArray(list)");
			return;
		}
		if(append_target_jq==null){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowFoldingSelector / append_target_jq==null");
			return;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		var bg_color_vmouse_down = text_color;
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		var text_color_vmouse_down = bg_color;

		// Sample
		//
		// [
		// 	{__value:$ID,__name:$NAME,__is_selected:"YES"||"NO"}
		// 	,{__value:$ID,__name:$NAME,__is_selected:"YES"||"NO"}
		// ]

		var row_tag = "";
		var option_is_selected_checked_symbol = "<span id=\"icon\" class=\"glyphicon glyphicon-ok\" style=\"float:right;\"></span>";
		var _obj = airborne.bootstrap.obj;

		var row_id = airborne.html.getIdRandomTail(title);

		// Set Title
		row_tag += ""
		+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">".replace(/\<_v\>/gi, row_id)
			+ "<td style=\"color:<COLOR>;background-color:<BGCOLOR>;\">"
				.replace(/\<COLOR\>/gi, text_color)
				.replace(/\<BGCOLOR\>/gi, bg_color)
			+ "<h5>"
			+ "<span style=\"text-center\"><strong><_v></strong></span>".replace(/\<_v\>/gi, title)
			+ "<span id=\"icon_folder\" class=\"glyphicon <_v>\" style=\"float:right;\"></span>".replace(/\<_v\>/gi,this.ICON_FOLDER_CLOSE_CLASS)
			+ "</h5>"
			+ "</td>"
		+ "</tr>"
		;

		bg_color = _color.COLOR_WHITE;

		for (var idx = 0; idx < list.length; idx++) {
			var option_obj = list[idx];

			if(option_obj == null){
				console.log("!Error! / airborne.bootstrap.view.mobile.list / addTableRowFoldingSelector / option_obj == null");
			}

			var row_option_id = row_id + "_" + idx;
			var option_value = option_obj.__value;
			var option_name = option_obj.__name;
			var option_is_selected = option_obj.__is_selected;

			row_tag += ""
			+ "<tr id=\"<ROW_OPTION_ID>\" option_value=\"<OPTION_VALUE>\" is_selected=\"<SELECTED>\">"
				.replace(/\<ROW_OPTION_ID\>/gi, row_option_id)
				.replace(/\<OPTION_VALUE\>/gi, option_value)
				.replace(/\<SELECTED\>/gi, option_is_selected)
				+ "<td style=\"color:<COLOR>;background-color:<BGCOLOR>;\">"
					.replace(/\<COLOR\>/gi, text_color)
					.replace(/\<BGCOLOR\>/gi, bg_color)
					+ "<h5 id=\"icon_container\">"
					+ option_name
					+ "<_v>".replace(/\<_v\>/gi, (option_is_selected=="YES")?option_is_selected_checked_symbol:"") 
					+ "</h5>"
				+ "</td>"
			+ "</tr>"
			;
		}
		append_target_jq.append(row_tag);

		// Set Event
		var header_row_jq = append_target_jq.find("tr#" + row_id);
		var option_row_jq_arr = [];
		for (var idx = 0; idx < list.length; idx++) {
			var row_option_id = row_id + "_" + idx;
			var option_row_jq = append_target_jq.find("tr#" + row_option_id);

			if(option_row_jq == null || option_row_jq.length < 1) continue;

			option_row_jq_arr.push(option_row_jq);
		}

		var switchHeaderArrow = function(header_row_jq){
			if(header_row_jq == null) return;

			// 1. 화살표 방향을 바꾼다.
			var _status = header_row_jq.attr("status");
			var span_icon_jq = header_row_jq.find("span#icon_folder");

			if( _status=="close" ){
				span_icon_jq.removeClass(this.ICON_FOLDER_CLOSE_CLASS).addClass(this.ICON_FOLDER_OPEN_CLASS);
				header_row_jq.attr("status","open");
			} else {
				span_icon_jq.removeClass(this.ICON_FOLDER_OPEN_CLASS).addClass(this.ICON_FOLDER_CLOSE_CLASS);
				header_row_jq.attr("status","close");
			}
		}
		var hideUnselectedOptions = function(option_row_jq_arr){
			if(_v.isNotValidArray(option_row_jq_arr)) return;

			// Set show and hide
			for (var idx = 0; idx < option_row_jq_arr.length; idx++) {
				var option_row_jq = option_row_jq_arr[idx];
				
				var option_row_tag = option_row_jq[0];
				var is_selected = $(option_row_tag).attr("is_selected");

				if(is_selected == "NO"){
					option_row_jq.hide();	
				} else {
					option_row_jq.show();
				}
			}
		}
		var setSelectedOption = function(option_row_jq_arr, selected_option_row_tag){
			if(_v.isNotValidArray(option_row_jq_arr)) return;
			// Set row unselected
			for (var idx = 0; idx < option_row_jq_arr.length; idx++) {
				var option_row_tag_arr = option_row_jq_arr[idx];
				var option_row_tag = option_row_tag_arr[0];
				var option_row_tag_jq = $(option_row_tag);
				option_row_tag_jq.attr("is_selected","NO");
				option_row_tag_jq.attr("style","");
				option_row_tag_jq.find("span#icon").remove();
			}

			// Set row selected
			var selected_option_row_tag_jq = $(selected_option_row_tag);
			selected_option_row_tag_jq.attr("is_selected","YES");
			
			//h5#icon_container
			var icon_container_jq = selected_option_row_tag_jq.find("h5#icon_container");
			icon_container_jq.append(option_is_selected_checked_symbol);

		}
		var showAllOptions = function(option_row_jq_arr){
			if(_v.isNotValidArray(option_row_jq_arr)) return;
			// Set show and hide
			for (var idx = 0; idx < option_row_jq_arr.length; idx++) {
				var option_row_jq = option_row_jq_arr[idx];
				option_row_jq.show();
			}
		}
		hideUnselectedOptions.apply(this, [option_row_jq_arr]);

		// Set Event - Header Row
		var _self = this;
		var header_row_jq_delegate_obj = _obj.getDelegate(function(self_obj){

			var self_jq = $(self_obj);
			var _status = self_jq.attr("status");
			var span_icon_jq = self_jq.find("span#icon");

			if( _status=="close" ){
				// 1. 모든 리스트를 보여준다.
				showAllOptions.apply(_self, [option_row_jq_arr]);
			} else {
				// 1. 선택된 리스트만 보여준다.
				hideUnselectedOptions.apply(this, [option_row_jq_arr]);
			}
			// 2. 화살표 방향을 바꾼다.
			switchHeaderArrow.apply(_self, [header_row_jq]);


		}, this);
		// 제목 열이 클릭 되었을 때, 배경 색깔 바뀌는 등의 이벤트를 제어합니다.
		//this.setTableHeaderRowEvent(header_row_jq, header_row_jq_delegate_obj);

		this.setTableRowEvent(
			// row_jq
			header_row_jq.find("td")
			// delegate_obj
			, _obj.getDelegate(function(delegate_data){

				if(	delegate_data == undefined || 
					delegate_data.delegate_data == undefined ||
					delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ||
					_param.EVENT_MOUSE_UP !== delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

					return;
				}

				var self_jq = delegate_data.target_jq.parent();
				var _status = self_jq.attr("status");
				var span_icon_jq = self_jq.find("span#icon");

				if( _status=="close" ){
					// 1. 모든 리스트를 보여준다.
					showAllOptions.apply(_self, [option_row_jq_arr]);
				} else {
					// 1. 선택된 리스트만 보여준다.
					hideUnselectedOptions.apply(this, [option_row_jq_arr]);
				}
				// 2. 화살표 방향을 바꾼다.
				switchHeaderArrow.apply(_self, [header_row_jq]);


			}, this)
			// bg_color_vmouse_down
			, bg_color_vmouse_down
			// delegate_data
			, null
			// text_color_vmouse_down
			, text_color_vmouse_down
		);		

		// Set Event - Content Row
		for (var idx = 0; idx < option_row_jq_arr.length; idx++) {
			var option_row_jq = option_row_jq_arr[idx];

			var delegate_obj = _obj.getDelegate(function(self_obj){
				
				setSelectedOption.apply(_self, [option_row_jq_arr, self_obj]);
				hideUnselectedOptions.apply(_self, [option_row_jq_arr]);
				switchHeaderArrow.apply(_self, [header_row_jq]);

			}, this);
			this.setTableRowEvent(option_row_jq, delegate_obj);
		}

		var accessor = {
			get:function(){
				// Set show and hide
				for (var idx = 0; idx < option_row_jq_arr.length; idx++) {
					var option_row_jq = option_row_jq_arr[idx];
					
					var option_row_tag = option_row_jq[0];
					var is_selected = $(option_row_tag).attr("is_selected");

					if(is_selected == "YES"){
						return $(option_row_tag).attr("option_value");
					}
				}
				return "";
			}
		}
		return accessor;

	}
	,addRecursiveGroupFolderList:function(table_jq, group_depth_names_arr, target_list, delegate_get_content_tag, delegate_on_click, text_color, bg_color){
		if(table_jq == null){
			console.log("!Error! / toast_master.mobile_list_manager / addRecursiveGroupFolderList / table_jq == null");
			return;
		}
		if(group_depth_names_arr == null){
			console.log("!Error! / toast_master.mobile_list_manager / addRecursiveGroupFolderList / group_depth_names_arr == null");
			return;
		}
		if(_v.isNotValidArray(target_list)){
			console.log("!Error! / toast_master.mobile_list_manager / addRecursiveGroupFolderList / _v.isNotValidArray(target_list)");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_get_content_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / addRecursiveGroupFolderList / _obj.isNotValidDelegate(delegate_get_content_tag)");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_on_click)){
			console.log("!Error! / toast_master.mobile_list_manager / addRecursiveGroupFolderList / _obj.isNotValidDelegate(delegate_on_click)");
			return;
		}

		var recursiveGroupList = this.getRecursiveGroupList(group_depth_names_arr, target_list, delegate_get_content_tag);

		this.drawRecursiveGroupFolderRow(
			// table_jq
			table_jq
			// recursiveGroupList
			, recursiveGroupList
			// delegate_on_click
			, delegate_on_click
			// depth
			, null
			// text_color
			, text_color
			// bg_color
			, bg_color
		);

	}
	,getRecursiveGroupList:function(group_depth_names_arr, target_list, delegate_get_content_tag){

		if(group_depth_names_arr == null){
			console.log("!Error! / toast_master.mobile_list_manager / getRecursiveGroupList / group_depth_names_arr == null");
			return;
		}
		if(_v.isNotValidArray(target_list)){
			console.log("!Error! / toast_master.mobile_list_manager / getRecursiveGroupList / _v.isNotValidArray(target_list)");
			return;
		}
		if(_obj.isNotValidDelegate(delegate_get_content_tag)){
			console.log("!Error! / toast_master.mobile_list_manager / getRecursiveGroupList / _obj.isNotValidDelegate(delegate_get_content_tag)");
			return;
		}

		// depth의 갯수는 달라질 수 있어야 한다.
		// 입력되는 데이터의 형태
		/*
			[
				{
					__member_email: "clacho6030@gmail.com"
					__member_first_name: "Arnold"
					__member_gender: "M"
					__member_id: "3"
					__member_last_name: "Cho"
					__member_membership: "1"
					__member_membership_name: "BDTM"
					__member_mobile: "010-6230-6030"
					__member_name: "Arnold Cho"
					__member_name_group: "A"
					__member_office: "Daum Communication"
					__member_membership_status: "A"
		
				}
				,{
					__member_email: "sugarberry31@gmail.com"
					__member_first_name: "Alicia"
					__member_gender: "F"
					__member_id: "95"
					__member_last_name: "Park"
					__member_membership: "1"
					__member_membership_name: "BDTM"
					__member_mobile: "010-7208-5100"
					__member_name: "Alicia Park"
					__member_name_group: "A"
					__member_office: "한국뉴초이스푸드"
					__member_membership_status: "N"
				}
				,...
			]
		*/

		// 원하는 결과의 리스트 형태 
		/*
			{
				//	__member_membership_name
				title:"BDTM"
				,sub_group_list:[
					{
						// __member_name_group
						title:"A"
						,sub_group_list:[
							"Alley Joel"
							,"Anne C"
							,"Anne D"
							,"Anne F"
						]
					}
					,{
						title:"B"
						,sub_group_list:[
							"Britney Spears"
							,"Berry C"
							,"Berry D"
						]
					}
					,{
						title:"C"
						,sub_group_list:[
							...
						]
					}
				]
			}
		*/	

		var _self = this;
		var add_group_obj = function(has_sub_group, group_obj, group_depth_names_arr, sorted_element_list, delegate_get_content_tag, group_obj_list){

			// 지금까지 만든 그룹을 자신의 하위 그룹을 만들기 위해 재귀호출한다.
			if(has_sub_group){

				var next_group_depth_names_arr = [];
				if(group_depth_names_arr.length > 1){
					next_group_depth_names_arr = group_depth_names_arr.slice(1, group_depth_names_arr.length);
				}

				if(_v.isValidArray(sorted_element_list)){

					group_obj._sub_group_list = 
					_self.getRecursiveGroupList(
						// 현재 사용한 그룹 이름을 제외한 나머지 그룹 명을 보냅니다.
						next_group_depth_names_arr
						, sorted_element_list
						, delegate_get_content_tag
					);

				}

			} else {
				group_obj._sub_group_list = sorted_element_list;
			}

			if(_v.isValidArray(group_obj._sub_group_list)){
				group_obj_list.push(group_obj);		
			}

			return group_obj_list;
		}



		var cur_group_type_name = "";
		var has_sub_group = false;
		if(group_depth_names_arr != null && group_depth_names_arr.length > 0){
			cur_group_type_name = group_depth_names_arr[0];
			has_sub_group = true;
		}

		var sorted_element_list = [];
		var group_name = "";
		var prev_group_name = "";
		var group_obj = 
		{
			_type:cur_group_type_name
			,_title:""
			,_has_sub_group:has_sub_group
			,_sub_group_list:[]
		};
		var group_obj_list = [];
		for(var idx = 0; idx < target_list.length; idx++) {

			var row_tag = "";
			var content_obj = target_list[idx];
			
			if(has_sub_group){
				// A <-- A,B,C,D.....
				group_name = content_obj[cur_group_type_name];
			}

			// 다른 종류의 그룹으로 바뀌었는지 확인.
			if(has_sub_group && prev_group_name != group_name){

				// 지금까지 만든 그룹 정보를 배열에 저장합니다.
				// 첫번째 실행에는 서브 그룹을 만드는 작업을 하지 않습니다.
				// 리스트에 객체가 하나밖에 없을 경우는 아래 구문을 실행해 서브 그룹을 바로 만듭니다.
				if((idx > 0 && target_list.length > 1) || target_list.length == 1){


					// 지금까지 만든 그룹을 자신의 하위 그룹을 만들기 위해 재귀호출한다.
					group_obj_list = 
					add_group_obj(
						has_sub_group
						, group_obj
						, group_depth_names_arr
						, sorted_element_list
						, delegate_get_content_tag
						, group_obj_list
					);

					sorted_element_list = [];
				}

				// 새로운 그룹이 시작되었습니다. / A --> B
				prev_group_name = group_name;
				group_obj = 
				{
					_type:cur_group_type_name
					,_title:group_name
					,_has_sub_group:has_sub_group
					,_sub_group_list:[]
				};
			}

			if(!has_sub_group){
				// 더 이상 하위 그룹이 없다면, 컨텐츠를 보여줄 리스트를 만듭니다.
				var content_tag = delegate_get_content_tag._func.apply(delegate_get_content_tag._scope,[content_obj]);
				sorted_element_list.push({__tag:content_tag});
			} else {
				// 하위 그룹을 가지고 있다면, 자신의 컨텐츠를 하위 그룹에서 처리하는 리스트에 넣습니다.
				sorted_element_list.push(content_obj);
			}
			
			// 마지막 그룹을 추가합니다.
			if(idx == (target_list.length-1)){

				// 지금까지 만든 그룹을 자신의 하위 그룹을 만들기 위해 재귀호출한다.
				group_obj_list = 
				add_group_obj(
					has_sub_group
					, group_obj
					, group_depth_names_arr
					, sorted_element_list
					, delegate_get_content_tag
					, group_obj_list
				);

			}

		}

		return group_obj_list;
	}
	
	,drawRecursiveGroupFolderRow:function(table_jq, recursiveGroupList, delegate_on_click, depth, text_color, bg_color){

		if(depth == null){
			depth = 0;
		}
		if(text_color == undefined) {
			text_color = _color.COLOR_MEDIUM_GRAY;
		}
		bg_color_vmouse_down = text_color;
		if(bg_color == undefined) {
			bg_color = _color.COLOR_TINT_GRAY;
		}
		text_color_vmouse_down = bg_color;

		var list_jq_arr = [];
		for(var idx = 0; idx < recursiveGroupList.length; idx++) {
			var recursiveGroupObj = recursiveGroupList[idx];

			// draw
			var _has_sub_group = recursiveGroupObj._has_sub_group;
			var _title = recursiveGroupObj._title;
			var row_id = airborne.html.getIdRandomTail(_title);
			var sub_list = recursiveGroupObj._sub_group_list;
			var row_jq = null;

			var indent_depth = "";
			for(var inner_idx = 0; inner_idx < depth; inner_idx++) {
				indent_depth += "&nbsp;&nbsp;&nbsp;&nbsp;";
			}

			if(_has_sub_group){

				// Draw Title Row
				var row_tag = ""
				+ "<tr class=\"active\" id=\"<_v>\" status=\"close\">".replace(/\<_v\>/gi, row_id)
					+ "<td style=\"color:<COLOR>;background-color:<BGCOLOR>;border-bottom: 1px solid #ddd;\"><h5>"
						.replace(/\<COLOR\>/gi, text_color)
						.replace(/\<BGCOLOR\>/gi, bg_color)
					+ indent_depth
					// + "<span id=\"icon_folder\" class=\"glyphicon <_v>\"></span>".replace(/\<_v\>/gi, this.ICON_FOLDER_CLOSE_CLASS)
					+ "&nbsp;&nbsp;"
					+ "<span style=\"text-center\" class=\"no_selection\"><strong><_v></strong></span>".replace(/\<_v\>/gi, _title)
					+ "</h5></td>"
				+ "</tr>"
				;
				table_jq.append(row_tag);
				row_jq = table_jq.find("tr#"+row_id);

				var sub_list_jq_arr = this.drawRecursiveGroupFolderRow(table_jq, sub_list, delegate_on_click, (depth + 1));

				this.addEventRecursiveGroupFolderRow(row_jq, sub_list_jq_arr);
				list_jq_arr.push(row_jq);
				// 자신이 열렸을 때, 다른 시블링 - 형제 들을 닫기 위해 리스트 참조를 저장합니다.
				row_jq._sibling_list = list_jq_arr;

			} else {

				text_color_vmouse_down = bg_color = _color.COLOR_WHITE;

				// Draw Content Row
				for(var inner_idx = 0; inner_idx < sub_list.length; inner_idx++) {
					var row_option_tag = "";
					var sub_obj = sub_list[inner_idx];
					var _tag = sub_obj.__tag;
					var row_option_id = row_id + "_" + inner_idx;

					row_option_tag += ""
					+ "<tr id=\"<_v>\">".replace(/\<_v\>/gi, row_option_id)
						+ "<td style=\"color:<COLOR>;background-color:<BGCOLOR>;\">"
							.replace(/\<COLOR\>/gi, text_color)
							.replace(/\<BGCOLOR\>/gi, bg_color)
							+ _tag
						+ "</td>"
					+ "</tr>"
					;
					table_jq.append(row_option_tag);

					// Set Event
					var row_jq = table_jq.find("tr#"+row_option_id);
					list_jq_arr.push(row_jq);

					this.setTableRowEvent(
						// row_jq
						row_jq.find("td")
						// delegate_obj
						, _obj.getDelegate(function(delegate_data){

							// TODO REFACTOR ME
							if(	delegate_data == undefined ||
								delegate_data.delegate_data == undefined ||
								delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

								console.log("!Error!\tdrawRecursiveGroupFolderRow\tsetTableRowEvent\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
								return;
							}

							if(_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

								delegate_on_click._func.apply(delegate_on_click._scope,[delegate_data]);

							} // outer if end

						}, this)
						// bg_color_vmouse_down
						, bg_color_vmouse_down
						// delegate_data
						, null
						// text_color_vmouse_down
						, text_color_vmouse_down
					);	// table row event end
				} 	// for end
			}	//  if end
		}	// outer for end

		return list_jq_arr;

	}
	,addEventRecursiveGroupFolderRow:function(row_jq, sub_list_jq_arr){

		// TODO 자신 이외의 다른 시블링들이 모두 사라짐. --> 유저 선택에 집중하도록 유도.

		// Set Event
		row_jq.icon_folder_jq = row_jq.find("span#icon_folder");

		var self_obj = this;
		var closeAll = function(is_my_sibling){
			for(var inner_idx = 0; inner_idx < sub_list_jq_arr.length; inner_idx++) {
				var sub_jq = sub_list_jq_arr[inner_idx];
				sub_jq.hide();
				if(sub_jq.tm_closeAll != null){
					sub_jq.tm_closeAll();
				}

				if(sub_jq.icon_folder_jq != null){
					sub_jq.attr("status","close");
					sub_jq.icon_folder_jq.removeClass(self_obj.ICON_FOLDER_OPEN_CLASS).addClass(self_obj.ICON_FOLDER_CLOSE_CLASS);
				}
			}

			// 자신의 세부 항목이 닫힐 때, 나머지 하위 항목들이 다시 보여집니다.
			if(is_my_sibling == true && _v.isValidArray(row_jq._sibling_list)){
				var _sibling_list = row_jq._sibling_list;
				for(var idx = 0; idx < _sibling_list.length; idx++) {
					var sibling_row_jq = _sibling_list[idx];
					if(sibling_row_jq != row_jq){
						// sibling_row_jq.tm_closeAll();
						sibling_row_jq.show();
					}
				}
			}
		}
		row_jq.tm_closeAll = closeAll;
		var openAll = function(){
			for(var inner_idx = 0; inner_idx < sub_list_jq_arr.length; inner_idx++) {
				var sub_jq = sub_list_jq_arr[inner_idx];
				sub_jq.show();
			}

			// 자신의 세부 항목이 열릴때, 나머지 하위 항목들이 가려집니다.
			if(_v.isValidArray(row_jq._sibling_list)){
				var _sibling_list = row_jq._sibling_list;
				for(var idx = 0; idx < _sibling_list.length; idx++) {
					var sibling_row_jq = _sibling_list[idx];
					if(sibling_row_jq != row_jq){
						sibling_row_jq.tm_closeAll();
						sibling_row_jq.hide();
					}
				}
			}
		}


		closeAll();

		this.setTableRowEvent(
			// row_jq
			row_jq.find("td")
			// delegate_obj
			, _obj.getDelegate(function(delegate_data){

				// TODO REFACTOR ME
				if(	delegate_data == undefined ||
					delegate_data.delegate_data == undefined ||
					delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE] == undefined ) {

					console.log("!Error!\tsetTableRowEvent\tdelegate_data is not valid!\tdelegate_data :: ",delegate_data);
					return;
				}

				if(_param.EVENT_MOUSE_UP === delegate_data.delegate_data[_param.EVENT_PARAM_EVENT_TYPE]) {

					var self_tag_jq = delegate_data.target_jq;
					var row_status = self_tag_jq.attr("status");

					var next_row_status = (row_status == "close")?"open":"close";
					self_tag_jq.attr("status",next_row_status);
					var span_icon_jq = self_tag_jq.find("span#icon_folder");

					if(next_row_status == "close"){

						// open all
						closeAll(true);
						span_icon_jq.removeClass(this.ICON_FOLDER_OPEN_CLASS).addClass(this.ICON_FOLDER_CLOSE_CLASS);

					} else {

						// close
						openAll();
						span_icon_jq.removeClass(this.ICON_FOLDER_CLOSE_CLASS).addClass(this.ICON_FOLDER_OPEN_CLASS);

					} // inner if end					

				} // outer if end

			}, self_obj)
			, null
		);	
	}
	// 시간 제어 유닛을 추가합니다.
	,addTimer:function(parent_jq, cur_time, delegate_obj_on_click_ok, delegate_obj_on_click_cancel){

		if(_obj.isNotValidDelegate(delegate_obj_on_click_ok)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTimer / _obj.isNotValidDelegate(delegate_obj_on_click_ok)");
			return;
		}

		if(_obj.isNotValidDelegate(delegate_obj_on_click_cancel)){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / addTimer / _obj.isNotValidDelegate(delegate_obj_on_click_ok)");
			return;
		}

		var timer_tag = ""
		+ "<tr><td>"
		// + "<div id=\"input_group_time\" class=\"form-group col-lg-8\" style=\"margin-top:0px;margin-bottom:0px;padding-left:7px;padding-right:7px;display:none;\">"
		+ "<div id=\"input_group_time\" class=\"form-group col-lg-8\" style=\"margin-top:0px;margin-bottom:0px;padding:0px;\">"
			+ "<div id=\"input_time_container\" class=\"col-lg-2\" style=\"padding:0px;\">"
				// + "<input type=\"text\" id=\"input_time\" class=\"form-control col-lg-4\" value=\"<_v>\" prev_value=\"\" tossed_value=\"<_v>\">".replace(/\<_v\>/gi, cur_time)
				+ "<input type=\"text\" id=\"input_time\" class=\"form-control col-lg-4\" value=\"\" prev_value=\"\" tossed_value=\"\">"
			+ "</div>"
		+ "</div>"	
		+ "</td></tr>"

		+ "<tr id=\"row_time_control\"><td>"
			// time btn groups
			+ "<div class=\"btn-group btn-group-justified\" role=\"group\">"

				+ "<div class=\"btn-group\" role=\"group\">"
					+ "<button id=\"btn_plus\" class=\"btn btn-default btn-lg\" type=\"button\">"
						+ "&nbsp;"
						+ "<span class=\"glyphicon glyphicon-plus\"></span>"
						+ "&nbsp;"
					+ "</button>"
				+ "</div>"	
				+ "<div class=\"btn-group\" role=\"group\">"
					+ "<button id=\"btn_minus\" class=\"btn btn-default btn-lg\" type=\"button\">"
						+ "&nbsp;"
						+ "<span class=\"glyphicon glyphicon-minus\"></span>"
						+ "&nbsp;"
					+ "</button>"
				+ "</div>"	

			+ "</div>"	
		+ "</td></tr>"

		+ "<tr id=\"row_btn_save\"><td>"
			+ "<button id=\"btn_save\" type=\"button\" class=\"btn btn-primary btn-lg btn-block\">OK</button>"
		+ "</td></tr>"

		+ "<tr id=\"row_btn_cancel\"><td>"
			+ "<button id=\"btn_cancel\" type=\"button\" class=\"btn btn-danger btn-lg btn-block\">CANCEL</button>"
		+ "</td></tr>"

		;

		parent_jq.append(timer_tag);
		var timer_jq = parent_jq;

		var _self = this;
		var cur_time_input_group_jq_input_jq = timer_jq.find("input#input_time");
		if(cur_time_input_group_jq_input_jq.length == 0){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / time input event / cur_time_input_group_jq_input_jq == null");
			return;
		}

		var cur_btn_time_plus_jq = timer_jq.find("button#btn_plus");
		if(cur_btn_time_plus_jq.length == 0){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / get_this./ time input event / cur_btn_time_plus_jq == null");
			return;
		}

		var cur_btn_time_minus_jq = timer_jq.find("button#btn_minus");
		if(cur_btn_time_minus_jq.length == 0){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / get_this./ time input event / cur_btn_time_minus_jq == null");
			return;
		}

		var cur_btn_time_ok_jq = timer_jq.find("button#btn_save");
		if(cur_btn_time_ok_jq.length == 0){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / get_this./ time input event / cur_btn_time_ok_jq == null");
			return;
		}

		var cur_btn_time_cancel_jq = timer_jq.find("button#btn_cancel");
		if(cur_btn_time_cancel_jq.length == 0){
			console.log("!Error! / airborne.bootstrap.view.mobile.list / get_this./ time input event / cur_btn_time_cancel_jq == null");
			return;
		}



		// assign time. check time mode.
		var cur_seconds = cur_time;

		var cur_minutes_safe_int = _dates.getSecondsToMinutes(cur_seconds);
		var cur_seconds_safe_int = _dates.getSecondsRemainder(cur_seconds);

		var cur_minutes_str = _dates.getDoubleDigit(cur_minutes_safe_int);
		var cur_seconds_str = _dates.getDoubleDigit(cur_seconds_safe_int);
		var cur_minutes_n_seconds_str = cur_minutes_str + ":" + cur_seconds_str;

		cur_time_input_group_jq_input_jq.val(cur_minutes_n_seconds_str);
		cur_time_input_group_jq_input_jq.attr("prev_value", cur_minutes_n_seconds_str);
		cur_time_input_group_jq_input_jq.attr("tossed_value", cur_minutes_n_seconds_str);



		// remove all events
		cur_time_input_group_jq_input_jq.off();
		cur_btn_time_plus_jq.off();
		cur_btn_time_minus_jq.off();
		cur_btn_time_ok_jq.off();
		cur_btn_time_cancel_jq.off();

		var set_minutes_offset = function(offset_minutes){
			var hour_n_minutes_str = cur_time_input_group_jq_input_jq.val();
			var new_offset_moment = _dates.get_moment_minutes_offset_from_hour_n_minutes_str(hour_n_minutes_str, offset_minutes);
			var new_hour_n_minutes_str = _dates.get_hour_n_minutes_str_from_moment_obj(new_offset_moment);
			cur_time_input_group_jq_input_jq.val(new_hour_n_minutes_str);
		}

		var set_seconds_offset = function(offset_seconds){
			var minutes_n_seconds_str = cur_time_input_group_jq_input_jq.val();
			var new_offset_moment = _dates.get_moment_seconds_offset_from_minutes_n_seconds_str(minutes_n_seconds_str, offset_seconds);
			var new_minutes_n_seconds_str = _dates.get_minutes_n_seconds_str_from_moment_obj(new_offset_moment);
			cur_time_input_group_jq_input_jq.val(new_minutes_n_seconds_str);
		}

		var check_time_format_valid = function(){
			var cur_time_double_digit_str = cur_time_input_group_jq_input_jq.val();
			var prev_time_double_digit_str = cur_time_input_group_jq_input_jq.attr("prev_value");
			
			is_valid_time_format_str = _dates.is_valid_time_format_str(cur_time_double_digit_str, _dates.DATE_TYPE_MM_SS);

			if(is_valid_time_format_str){
				// No prob! update prev_value
				cur_time_input_group_jq_input_jq.attr("prev_value", cur_time_double_digit_str);
				return true;
			} else {
				// Oops! Something goes wrong. roll back your time str.
				if(!confirm("Please check your time format.\nExample : 17:30")){
					cur_time_input_group_jq_input_jq.val(prev_time_double_digit_str);
				}
				return false;
			}
		}

		cur_time_input_group_jq_input_jq.click(function(e){
			e.stopPropagation();
			check_time_format_valid();
		});
		cur_time_input_group_jq_input_jq.change(function(e){
			e.stopPropagation();
			check_time_format_valid();
		});
		cur_btn_time_plus_jq.click(function(e){
			e.stopPropagation();
			if(!check_time_format_valid()) return;

			set_seconds_offset(5);	// plus time (+ 5 seconds per click)

		});
		cur_btn_time_minus_jq.click(function(e){
			e.stopPropagation();
			if(!check_time_format_valid()) return;

			set_seconds_offset(-5);	// minus time (- 5 seconds per click)	

		});
		cur_btn_time_ok_jq.click(function(e){
			e.stopPropagation();

			console.log("OK 버튼을 눌렀을 때의 이벤트를 호출합니다.");

			// 분:초 단위를 전체 초로 바꾸어 전달합니다.
			var secs = _dates.get_seconds_from_mm_ss(cur_time_input_group_jq_input_jq.val());
			delegate_obj_on_click_ok._func.apply(delegate_obj_on_click_ok._scope,[secs]);

		});
		cur_btn_time_cancel_jq.click(function(e){
			e.stopPropagation();

			console.log("CANCEL 버튼을 눌렀을 때의 이벤트를 호출합니다.");

			delegate_obj_on_click_cancel._func.apply(delegate_obj_on_click_cancel._scope,[]);
		});

	}	


}