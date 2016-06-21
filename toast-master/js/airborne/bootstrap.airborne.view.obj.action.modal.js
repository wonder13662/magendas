airborne.bootstrap.view.obj.__action_modal = {
	get_unique_id:function(title) {

		var now_time = _dates.getNow(_dates.DATE_TYPE_YYYYMMDDHHMMSS);
		var random_id = Math.floor((Math.random() * 10000) + 1);
		var unique_id = 
		"${title}_${now_time}_${random_id}"
		.replace(/\$\{title\}/gi, title)
		.replace(/\$\{now_time\}/gi, now_time)
		.replace(/\$\{random_id\}/gi, random_id)
		;

		return unique_id;
	}
	, get:function(modal_title, _callback, _scope) {
		// create new modal
		// 1. web version
		// 2. svg version

		// 화면에 모달을 그립니다. 제어 객체는 obj로 반환합니다.

		// 모달에 필요한 내용들은 메서드로 제어합니다.
		// 1-1. 모달에 input field 추가 (1. title)
		// 1-2. 모달에 input field event callback 

		// 2-1. 모달에 select box 추가 (2. option list)
		// 2-2. 모달에 select box event callback 

		// 3. 모달을 화면에 보여줍니다. 

		// 4. 모달을 화면에서 제거합니다.	
		var container_jq = $("body");
		var unique_modal_id = this.get_unique_id("action_modal");
		var modal_tag = ""
		// Small modal
		+ "<div id=\"${unique_modal_id}\" class=\"modal fade bs-example-modal-sm\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"mySmallModalLabel\">"
			.replace(/\$\{unique_modal_id\}/gi, unique_modal_id)
			+ "<div class=\"modal-dialog\">"
				+ "<div class=\"modal-content\">"

					// Modal Header
					+ "<div class=\"modal-header\">"
						+ "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>"
						+ "<h4 class=\"modal-title\">${modal_title}</h4>".replace(/\$\{modal_title\}/gi, modal_title)
					+ "</div>"

					// Modal Body
					+ "<div class=\"modal-body\">"
						+ "<ul id=\"input_list\" class=\"list-group\" style=\"margin: 0px;\">"

						+ "</ul>"
					+ "</div>"

					// Modal Footer
					+ "<div class=\"modal-footer\" style=\"margin-top:0px;\">"
						+ "<button id=\"modal_cancel\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>"
						+ "<button id=\"modal_save\" type=\"button\" class=\"btn btn-primary\">Save</button>"
					+ "</div>"

				+ "</div>"
			+ "</div>"
		+ "</div>"
		;

		container_jq.append(modal_tag);
		var modal_jq = container_jq.find("div#${unique_modal_id}".replace(/\$\{unique_modal_id\}/gi, unique_modal_id));
		var input_list_jq = modal_jq.find("ul#input_list");
		var btn_cancel_jq = modal_jq.find("button#modal_cancel");
		var btn_save_jq = modal_jq.find("button#modal_save");

		var modal_obj = {
			container_jq:container_jq
			, input_list_jq:input_list_jq
			, modal_jq:modal_jq
			, field_obj_arr:[]
			, _callback:_callback
			, _scope:_scope
			, btn_save_jq:btn_save_jq
			, btn_cancel_jq:btn_cancel_jq
			, set_event:function() {
				var _self = this;
				this.btn_save_jq.click(function() {
					_self._callback.apply(_self._scope,[_self]);
				});
			}
			, get_unique_id:function(title) {
				return airborne.bootstrap.view.obj.__action_modal.get_unique_id(title);
			}
			, add_input_field:function(title, placeholder, value) {

				var input_field_id = this.get_unique_id("input_field");
				var input_field_tag = ""
				+ "<li id=\"${input_field_id}\" class=\"list-group-item list-group-item-warning\" style=\"padding-left:10px;padding-right:10px;padding-bottom:0px;\">"				
					.replace(/\$\{input_field_id\}/gi, input_field_id)
					+ "<form class=\"form-horizontal\" style=\"margin-bottom:10px;\">"
						+ "<div class=\"form-group\" style=\"margin-bottom:0px;\">"

							+ "<label class=\"col-sm-3 control-label\">${title}</label>".replace(/\$\{title\}/gi, title)
							+ "<div class=\"col-sm-6\">"
								+ "<input type=\"text\" class=\"form-control\" id=\"meeting-theme\" placeholder=\"${placeholder}\" value=\"${value}\">"
									.replace(/\$\{placeholder\}/gi, placeholder)
									.replace(/\$\{value\}/gi, value)
							+ "</div>"

						+ "</div>"
					+ "</form>"
				+ "</li>"
				;

				input_list_jq.append(input_field_tag);
				var input_field_jq = input_list_jq.find("li#${input_field_id}".replace(/\$\{input_field_id\}/gi, input_field_id));
				var input_jq = input_field_jq.find("input");

				var field_obj = {
					title:title
					, input_jq:input_jq
					, get_value:function() {
						return this.input_jq.val();
					}
					, get_title:function() {
						return this.title;
					}
					, focus:function() {
						this.input_jq.focus();
					}
					, clear:function() {
						this.input_jq.val("");
					}
				}

				this.field_obj_arr.push(field_obj);
			}
			, add_select_box:function(option_list) {
				// not implemented yet
			}
			, add_date_picker:function(title) {
				// not implemented yet
			}
			, add_image_picker:function(image_list) {
				// not implemented yet
			}
			, show:function() {
				this.modal_jq.modal('show')
			}
			, hide:function() {
				this.modal_jq.modal('hide')
			}
			, remove:function() {
				var _self = this;
				this.modal_jq.on('hidden.bs.modal', function (e) {
					_self.remove();
				});
				this.hide();
			}
			, get_fields:function() {
				return this.field_obj_arr;
			}
			, get_values:function() {
				var values = {};
				for(var idx=0;idx < this.field_obj_arr.length;idx++) {
					var field_obj = this.field_obj_arr[idx];
					
					var key = _html.getId(field_obj.get_title());
					values[key] = field_obj.get_value();
				}

				return values;
			}
		}
		modal_obj.set_event();

		return modal_obj;

	}
}
















