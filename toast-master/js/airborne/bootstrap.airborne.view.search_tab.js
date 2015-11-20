airborne.bootstrap.search_tab_manager = {
    getSearchConditionBean:function(id, name, value, selected){
            return {id:id, name:name, value:value, selected:selected};
    }
    ,getSearchConditionGroupBean:function(id, items){
            return {id:id, items:items};
    }
    ,getObj:function(){

		var err_logger = airborne.error.getWrapperLogger("airborne.bootstrap.search_tab_manager");

		var obj = {
			name:null
			,err_logger:null
			,sendErrLog:function(msg){
				if(	airborne.validator.isNotValidStr(msg) || 
					airborne.validator.isNotValidStr(this.name) ||
					this.err_logger == null) return;

					this.err_logger.sendErrLog(this.name, msg);
			}
			// removed getId / use airborne.bootstrap.obj.getId() instead.
			,parent_jq_obj:null
			,search_condition_group_array:[]
            ,init:function(search_tab_name, parent_jq_obj, search_condition_group_array){

                    if(airborne.validator.isNotValidStr(search_tab_name)){
                            airborne.bootstrap.search_tab_manager.sendErrLog("init/undefined", "obj_name");
                            return;
                    }
                    this.name = search_tab_name;
                    if(airborne.validator.isNotJQueryObj(parent_jq_obj)){
                            this.sendErrLog("init/parent_jq_obj");
                            return;
                    }
                    if(search_condition_group_array == null || airborne.validator.isNotValidArray(search_condition_group_array)){
                            this.sendErrLog("init/search_condition_group_array");
                            return;
                    }

                    this.parent_jq_obj = parent_jq_obj;
					this.search_condition_group_array = search_condition_group_array;
					this.draw(parent_jq_obj);
					this.addEvent(search_condition_group_array);
            }
			,draw:function(){
				var search_tab_bar_tag = this.getTag();
				this.parent_jq_obj.append(search_tab_bar_tag);
			}
			,getTag:function(){

                var search_tab_bar_tag =
                "<div class=\"theme-showcase\" role=\"main\">"
                + "<nav class=\"navbar navbar-default\" role=\"navigation\">"
                + "<div class=\"container-fluid\">"
                + "<div class=\"navbar-header\">"
                + "<a class=\"navbar-brand\" href=\"#\">Search By</a>"
                + "</div>"
                + "<div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">";

                for(var outerIdx=0;outerIdx < this.search_condition_group_array.length;outerIdx++){

                    search_tab_bar_tag +=
                    "<ul class=\"nav navbar-nav\">"
                    + "<li class=\"dropdown\">"
                    + "<a 	href=\"#\"" 
					+ "	id=\"<search_condition_group_id>\""
					+ "	search_condition_item_id_selected=\"<search_condition_item_id_selected>\""
					+ "	class=\"dropdown-toggle\""
					+ "	data-toggle=\"dropdown\">"
					+ "<search_condition_item_name_selected><b class=\"caret\"></b>"
					+ "</a>"
					+ "<ul class=\"dropdown-menu\" role=\"menu\">";

					var search_condition_group = this.search_condition_group_array[outerIdx];
					if(search_condition_group.items == null || search_condition_group.items.length == 0) continue;

					for(var innerIdx=0;innerIdx < search_condition_group.items.length;innerIdx++){
					
						var search_condition_item = search_condition_group.items[innerIdx];

                        search_tab_bar_tag +=
                        "<li><a href=\"#\" id=\"<id>\" value=\"<value>\"><search_condition_item_name></a></li>"
                        .replace(/\<id\>/gi, search_condition_item.id)
                        .replace(/\<value\>/gi, search_condition_item.value)
                        .replace(/\<search_condition_item_name\>/gi, search_condition_item.name);

						if(search_condition_item.selected){
							search_tab_bar_tag = 
							search_tab_bar_tag
							.replace(/\<search_condition_group_id\>/gi, search_condition_group.id)
							.replace(/\<search_condition_item_id_selected\>/gi, search_condition_item.id)
							.replace(/\<search_condition_item_name_selected\>/gi, search_condition_item.name);
						}
					}

					search_tab_bar_tag += "</ul></li></ul>";

				}

                search_tab_bar_tag +=
                "<form class=\"navbar-form navbar-left\" role=\"search\">"
                + "<div class=\"form-group\">"
                + "<input type=\"text\" class=\"form-control\" placeholder=\"Keyword\">"
                + "</div>"
                + "&nbsp;&nbsp;<button type=\"submit\" class=\"btn btn-default\">&nbsp;&nbsp;<span class=\"glyphicon glyphicon-search\"></span>&nbsp;&nbsp;</button>"
                + "</form>"
                + "</div></div></nav></div>";

				return search_tab_bar_tag;

			}
	        ,search_btn_callback:null
	        ,search_btn_callback_scope:null
	        ,addEventSearchBtnOnClick:function(callback, scope){
                if(callback == null){
                        this.sendErrLog("addEventSearchBtnOnClick/callback");
                        return;
                }
                if(scope == null){
                        this.sendErrLog("addEventSearchBtnOnClick/scope");
                        return;
                }

                this.search_btn_callback = callback;
                this.search_btn_callback_scope = scope;
	        }
			,addEvent:function(){
			
                for(var outerIdx=0;outerIdx < this.search_condition_group_array.length;outerIdx++){

                    var search_condition_group = this.search_condition_group_array[outerIdx];

					this.parent_jq_obj.find("ul li a#<id>".replace(/\<\id>/, search_condition_group.id)).click(function(e){
										
						e.preventDefault();
						var selectable_list_jq = $(this).siblings("ul.dropdown-menu");
						
						if(!selectable_list_jq.is(':visible')){
							selectable_list_jq.show();
						} else {
							selectable_list_jq.hide();
						}
					});


	                for(var innerIdx=0;innerIdx < search_condition_group.items.length;innerIdx++){
						
						var search_condition_item = search_condition_group.items[innerIdx];

						this.parent_jq_obj.find("ul li a#<id>".replace(/\<id\>/, search_condition_item.id)).click(function(e){
								
							// stop recall itself.
							e.preventDefault();
						
							// close drop box
							var this_jq = $(this);
							var selectable_list_jq = this_jq.parent().parent();
							
							if(selectable_list_jq.is(':visible')){
								selectable_list_jq.hide();
							}

							// update selected search tab condition
							var selected_item_jq = selectable_list_jq.siblings("a#series_character_search_group");
							var new_selected_item = "<selected_item><b class=\"caret\"></b>".replace(/\<selected_item\>/,this_jq.html());
							selected_item_jq.html(new_selected_item);
							selected_item_jq.attr("search_condition_item_id_selected", this_jq.attr("id"));
						});
					}

				} // for end


				var self = this;
				this.parent_jq_obj.find("button.btn").click(function(e){
					e.preventDefault();

					var selected_item_jq = $(this).parent().parent().find("a#series_character_search_group")[0];
					var selected_item_id = $(selected_item_jq).attr("search_condition_item_id_selected");

					var search_keyword_input_el = $(this).siblings("div.form-group").children("input.form-control")[0];
					var search_keyword_input_jq = $(search_keyword_input_el);
					var search_keyword = search_keyword_input_jq.val();

					var result = {selected_item_id:selected_item_id, search_keyword_input_jq:search_keyword_input_jq, search_keyword:search_keyword};				
					
					if(self.search_btn_callback != null && self.search_btn_callback_scope != null){
						self.search_btn_callback.apply(self.search_btn_callback_scope,[result]);
					}
				});
			}
		}
		
		obj.err_logger = err_logger;

		return obj;
	}
}