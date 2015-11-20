airborne.bootstrap.list_search_tab_manager = {
	// TODO element의 키값으로 option.name, option.value를 지정하는 방식으로 변경. 모두 선택되지 않음.
	getObj:function(list_search_tab_name, select_option_element_list, sibling_before_jq, selected_option_value){

		// column_id_for_option_name --> __ key
		// column_id_for_option_value --> __value 

		var obj = {
			id:null
			,name:null
			,sibling_before_jq_obj:null
			,container_jq:null
			,select_options_arr:null
            ,init:function(list_search_tab_name, select_options_arr, sibling_before_jq){

        		// draw container.
        		var _v = airborne.validator;
        		var _o = airborne.bootstrap.obj;

                if(_v.isNotValidStr(list_search_tab_name)){
                    console.log("list_search_tab_manager / init / _v.isNotValidStr(list_search_tab_name)");
                    return;
                }
                this.name = list_search_tab_name;
                this.id = _o.getId(list_search_tab_name + " search tab");
                this.sibling_before_jq_obj = sibling_before_jq;

                if(_v.isNotJQueryObj(this.sibling_before_jq_obj)){
                    console.log("list_search_tab_manager / init / _v.isNotJQueryObj(this.sibling_before_jq_obj)");
                    return;
                }
                if(_v.isNotValidArray(select_options_arr)){
                    console.log("list_search_tab_manager / init / _v.isNotValidArray(select_options_arr)");
                    return;
                }
                this.select_options_arr = select_options_arr;                
				this.draw();
				this.addEvent();

				return this;
            }
			,hideSearchBtn:function(){
				this.container_jq.find("button#default_submit").hide();
			}
			,draw:function(){
				var search_tab_bar_tag = this.getTag();

				this.sibling_before_jq_obj.after(search_tab_bar_tag);
				this.container_jq = this.sibling_before_jq_obj.next();
			}
			,getTag:function(){

				var _o = airborne.bootstrap.obj;

                var search_tab_bar_tag =
                "<div class=\"theme-showcase\" role=\"main\">"
                + "<nav class=\"navbar navbar-default\" role=\"navigation\">"
                + "<div class=\"container-fluid\" style=\"padding-left:8px;\">"
                + "<div class=\"navbar-header\">"
                + "<a class=\"navbar-brand\" href=\"#\"><name></a>".replace(/\<name\>/gi, this.name)
                + "</div>"
                + "<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\" style=\"padding-left:0px;\">";

                search_tab_bar_tag +=
                "<form class=\"navbar-form navbar-left\" role=\"search\" style=\"padding-left:0px;\">"
                + "<div class=\"form-group\">"

                + _o.getTagSelect(this.id, this.select_options_arr)

                + "<input id=\"input_search_keyword\" type=\"text\" class=\"form-control\" placeholder=\"Keyword\" style=\"margin-left:8px;\">"

                + "<button id=\"default_submit\" type=\"submit\" class=\"btn btn-default\" data-toggle=\"modal\" data-target=\"#row_modal\" style=\"margin-left:8px;\">&nbsp;&nbsp;<span class=\"glyphicon glyphicon-search\"></span>&nbsp;&nbsp;</button>"

				+ "</div>"
                + "</form>"
                + "</div></div></nav></div>";

				return search_tab_bar_tag;

			}
			,delegate_search_btn_clicked:null // {func:${some_function},scope:${somewhere_scope}}
			,setDelegateSearchBtnClicked:function(delegate_search_btn_clicked){

				var _o = airborne.bootstrap.obj;
				if(_o.isNotValidDelegate(delegate_search_btn_clicked)){
					console.log("setDelegateRowClicked / _o.isNotValidDelegate(delegate_search_btn_clicked)");
					return;
				}

				this.delegate_search_btn_clicked = delegate_search_btn_clicked;
			}
			,extra_btn_obj_arr:[]
			,addExtraBtn:function(btn_title, desc, delegate_scope, delegate_btn_clicked){

				var _v = airborne.validator;

				var btn_id = airborne.html.getId(btn_title);
				var btn_tag = ""
				+ "&nbsp;&nbsp;<button id=\"" + btn_id + "\""
				+ " class=\"btn btn-default\""
				+ " type=\"button\""
				;

				if(_v.isValidStr(desc)){
					// popover
					btn_tag += 
					" data-container=\"body\" data-toggle=\"popover\" data-trigger=\"hover\" data-placement=\"top\" data-content=\"<desc>\""
					.replace(/\<desc\>/gi, desc)
					;
				} else {
					// modal
					btn_tag += 
					" data-toggle=\"modal\" data-target=\"#row_modal\""
					;
				}
				btn_tag += ">"+ "&nbsp;" + btn_title + "&nbsp;</button>";

				var form_jq = this.container_jq.find("div.form-group");
				if(form_jq != null && form_jq.length > 0){
					form_jq.append(btn_tag);
				}

				var btn_jq = form_jq.find("button#"+btn_id);
				if(btn_jq != null && btn_jq.length > 0 && delegate_btn_clicked != null && delegate_scope != null){
					// btn_jq.tooltip();
					btn_jq.popover();
					btn_jq.on("click", function(){

						var selected_option_name = $(this).parent().find("select.form-control option:selected").text();

						var selected_option_value = $(this).parent().find("select.form-control").val();

						delegate_btn_clicked.apply(delegate_scope, [selected_option_name, selected_option_value]);
					});
				}

			}
			,hide_title:function() {
				this.container_jq.find("div.navbar-header").hide();
			}
			,show_title:function() {
				this.container_jq.find("div.navbar-header").show();
			}
			,hide_input_search_keyword:function(){
				this.container_jq.find("input#input_search_keyword").hide();
			}
			,show_input_search_keyword:function(){
				this.container_jq.find("input#input_search_keyword").show();
			}
			,hide_search_btn:function(){
				this.container_jq.find("button.btn").hide();
			}
			,show_search_btn:function(){
				this.container_jq.find("button.btn").hide();
			}
			,delegate_arr_on_change:[]
			,addDelegateOnChange:function(new_delegate){
				var _o = airborne.bootstrap.obj;
				if(_o.isNotValidDelegate(new_delegate)){
					console.log("addDelegateOnChange / _o.isNotValidDelegate(new_delegate)");
					return;
				}

				this.delegate_arr_on_change.push(new_delegate);
			}
			,addEvent:function(){
			
				var self = this;
				var _o = airborne.bootstrap.obj;

				var target_jq = this.container_jq.find("input.form-control");

				target_jq.find("input.form-control").change(function(e){

					var search_keyword = $(this).val();
					var select_options_arr = self.select_options_arr;
					var filtered_select_options_arr = [];
					for (var idx = 0; idx < select_options_arr.length; idx++) {
						var option = select_options_arr[idx];
						var option_name = option._name;
						var matching_idx = option_name.toLowerCase().indexOf(search_keyword.toLowerCase());

						if(matching_idx > -1){
							filtered_select_options_arr.push(option);
						}
					};

					if(filtered_select_options_arr.length == 0){
						filtered_select_options_arr = select_options_arr;
					}

					// select 영역을 삭제합니다.
					$(this).parent().find("select.form-control").remove();
					// 새로운 리스트로 다시 그립니다.
					$(this).parent().prepend(_o.getTagSelect(self.id, filtered_select_options_arr));


				});

				var select_jq = this.container_jq.find("select#" + this.id);
				select_jq.change(function(e){

					// 셀렉트 영역의 값이 변했을 경우, 델리게이트 함수가 있다면 선택된 값을 전달해줍니다.
					var selected_option_name = $(this).parent().find("select.form-control option:selected").text();
					var selected_option_value = $(this).parent().find("select.form-control").val();

					for(var idx = 0; idx < self.delegate_arr_on_change.length; idx++) {
						var delegate_obj = self.delegate_arr_on_change[idx];	

						var func = delegate_obj._func;
						var scope = delegate_obj._scope;

						// TODO 사용자가 선택한 값을 델리게이트 메서드에 넘겨줍니다.
						func.apply(scope, [selected_option_name, selected_option_value]);
					}

				});

				var btn_jq = this.container_jq.find("button.btn");

				btn_jq.click(function(e){
					e.preventDefault();

					var selected_option_name = $(this).parent().find("select.form-control option:selected").text();

					var selected_option_value = $(this).parent().find("select.form-control").val();

					if(self.delegate_search_btn_clicked == null) return;

					var func = self.delegate_search_btn_clicked._func;
					var scope = self.delegate_search_btn_clicked._scope;

					// TODO 사용자가 선택한 값을 델리게이트 메서드에 넘겨줍니다.
					func.apply(scope, [selected_option_name, selected_option_value]);
				});
			}
		}

		//list_json_array, column_id_for_option_name, column_id_for_option_value
		var _v = airborne.validator;
		if(_v.isNotValidArray(select_option_element_list)){
			console.log("getObj / _v.isNotValidArray(select_option_element_list)");
			return null;
		}

		var _column = airborne.bootstrap.column;

		var _o = airborne.bootstrap.obj;
		var select_options_arr = [];
		for (var idx = 0; idx < select_option_element_list.length; idx++) {
			var json_element = select_option_element_list[idx];
			if(json_element == null){
				console.log("getObj / json_element == null");
				return;
			}

			var is_selected = false;

			selected_option_value = ""+selected_option_value;
			if(_v.isValidStr(selected_option_value)){
				is_selected = (selected_option_value == json_element[_column.COLUMN_TYPE_SELECT_VALUE])?true:false;
			}
			
			var json_element_key = json_element[_column.COLUMN_TYPE_SELECT_KEY];
			var json_element_value = json_element[_column.COLUMN_TYPE_SELECT_VALUE];
			
			if(_v.isNotValidStr(json_element_key)){
				console.log("!Warning! / list_search_tab / getObj / _v.isNotValidStr(json_element_key) / json_element : ",json_element);
				continue;
			} 
			if(_v.isNotValidStr(json_element_value)){
				console.log("!Warning! / list_search_tab / getObj / _v.isNotValidStr(json_element_value) / json_element : ",json_element);
				continue;
			} 

			var select_option = _o.getTagSelectOption(json_element[_column.COLUMN_TYPE_SELECT_KEY], json_element[_column.COLUMN_TYPE_SELECT_VALUE], is_selected);
			if(select_option == null){
				console.log("!Error! / list_search_tab / getObj / select_option == null / json_element : ",json_element);
				return;
			}

			select_options_arr.push(select_option);
		};

		return obj.init(list_search_tab_name, select_options_arr, sibling_before_jq);
	}
}