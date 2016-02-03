airborne.bootstrap.view.obj.__action_table = {
	// @ Section : TABLE PROPERTIES
	TABLE_COLUMN_TEXT_TYPE_NORMAL:"normal"
	,TABLE_COLUMN_TEXT_TYPE_BOLD:"bold"
	,is_valid_table_column_text_type:function(column_text_type){
		var _v = airborne.validator;
		if(_v.isNotValidStr(column_text_type)){
			//console.log("!Error! / airborne.view.obj / is_valid_table_column_text_type / _v.isNotValidStr(column_text)");
			return false;
		}

		if(	this.TABLE_COLUMN_TEXT_TYPE_NORMAL != column_text_type && 
			this.TABLE_COLUMN_TEXT_TYPE_BOLD != column_text_type){
			//console.log("!Error! / airborne.view.obj / is_valid_table_column_text_type / It is not valid table column text type");
			return false;
		}

		return true;
	}
	,is_not_valid_table_column_text_type:function(column_text_type){
		return !this.is_valid_table_column_text_type(column_text_type);
	}
	// @ Section : TABLE META INFO
	// @ public
	,get_editable_table_meta_info_obj:function(table_title, is_editable_title, is_fixed_row){
		// 테이블 전체의 속성을 정의합니다.

		// 테이블 열(row)의 속성은
		// get_editable_table_title_column_addable (타이틀)
		// get_editable_table_column_meta_info_obj
		// 로 추가하여 관리합니다.

		// 1. 테이블 속성을 정의하는 객체를 만듭니다.
		// 1-1. table title
		// 1-2. table column info array
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		if(_v.isNotValidStr(table_title)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_meta_info_obj / _v.isNotValidStr(table_title)");
			return null;
		}
		if(is_editable_title == undefined) {
			is_editable_title = false;
		}
		if(is_fixed_row == undefined) {
			is_fixed_row = false;
		}

		var editable_table_meta_info_obj = {
			table_title:""
			,get_table_title:function(table_title){
				return this.table_title;
			}
			,set_table_title:function(table_title){
				this.table_title = table_title;
			}
			,event_manager:null
			,set_event_manager:function(event_manager){
				this.event_manager = event_manager;
			}
			,get_event_manager:function(){
				return this.event_manager;
			}
			,get_is_editable_title:function(){

				var cur_element_type = this.get_element_type();
				if(_obj.is_not_valid_element_type(cur_element_type)){
					console.log("!Error! / airborne.view.obj.table / get_editable_table_meta_info_obj / editable_table_meta_info_obj / _obj.is_not_valid_element_type(cur_element_type)");
					return false;
				} 

				if( _obj.ELEMENT_TYPE_TITLE_ADDABLE==cur_element_type 			|| 
					_obj.ELEMENT_TYPE_INPUT_TEXT==cur_element_type 				|| 
					_obj.ELEMENT_TYPE_SEARCH_LIST==cur_element_type				||

					_obj.ELEMENT_TYPE_TABLE_TITLE_ADDABLE==cur_element_type 	|| 
					_obj.ELEMENT_TYPE_TABLE_INPUT_TEXT==cur_element_type 		|| 
					_obj.ELEMENT_TYPE_TABLE_SEARCH_LIST==cur_element_type						
					){

					return true;
				}

				return false;
			}
			,is_fixed_row:is_fixed_row
			,get_is_fixed_row:function(){
				return this.is_fixed_row;
			}
			,get_is_editable_row:function(){
				return !this.is_fixed_row;
			}
			,table_row_info_arr:[]
			,add_table_row_info:function(table_row_info){
				if(_v.isNotValidArray(table_row_info)){
					console.log("!Error! / airborne.view.obj.table / get_editable_table_meta_info_obj / editable_table_meta_info_obj / _v.isNotValidArray(table_row_info)");
				}

				this.table_row_info_arr.push(table_row_info);
			}
			,get_table_row_info_arr:function(){
				return this.table_row_info_arr;
			}
			,element_type:_obj.ELEMENT_TYPE_TITLE
			,get_element_type:function(){
				return this.element_type;
			}
		};
		editable_table_meta_info_obj.set_table_title(table_title);
		return editable_table_meta_info_obj;
	}		
	// @ Section : TABLE COLUMN META INFO
	// @ private
	// @ param : element option
	// @ desc : element option의 colume type값을 기준으로 메타 정보를 만들어 줍니다
	,get_editable_table_row_meta_info_obj_by_element_json:function(element_json){
		
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _view_table = airborne.bootstrap.view.obj.table;

		var editable_table_column_project_obj;
		if(	_obj.ELEMENT_TYPE_TABLE_TITLE == element_json.get_column_type() ) {

			editable_table_column_project_obj = 
			_view_table.get_fixed_table_title_column(
				// column_text
				element_json.get_field_option().get_key()
				// element_json
				, element_json
				// is_shy
				, element_json.get_is_shy()
			);

		}else if(	_obj.ELEMENT_TYPE_SEARCH_LIST == element_json.get_column_type() || 
			_obj.ELEMENT_TYPE_TABLE_SEARCH_LIST == element_json.get_column_type()
			) {

			editable_table_column_project_obj = 
			_view_table.get_editable_table_search_list_column_meta_info_obj(
				// column_title
				element_json.get_field_option().get_option_group_name()
				// column_text
				, element_json.get_field_option().get_key()
				// search_list_arr
				, element_json.get_field_option().get_raw_map_prop("__search_option_arr")
				// element_json
				, element_json
				// prop_map
				, element_json.get_field_option()
				// is_shy
				, element_json.get_is_shy()
			);

		} else if(	_obj.ELEMENT_TYPE_INPUT_TEXT == element_json.get_column_type() || 
					_obj.ELEMENT_TYPE_TABLE_INPUT_TEXT == element_json.get_column_type()	) {

			editable_table_column_project_obj = 
			_view_table.get_editable_table_input_text_column_meta_info_obj(
				// column_title
				element_json.get_field_option().get_option_group_name()
				// column_text
				, element_json.get_field_option().get_key()
				// element_json
				, element_json
				// prop_map
				, element_json.get_field_option()
				// is_shy
				, element_json.get_is_shy()
			);

		} else if(	_obj.ELEMENT_TYPE_TABLE_TEXT == element_json.get_column_type()	) {

			editable_table_column_project_obj = 
			_view_table.get_editable_table_text_column_meta_info_obj(
				// column_title
				element_json.get_field_option().get_option_group_name()
				// column_text
				, element_json.get_field_option().get_key()
				// element_json
				, element_json
				// prop_map
				, element_json.get_field_option()
				// is_shy
				, element_json.get_is_shy()
			);

		} else if(	_obj.ELEMENT_TYPE_TIME_MM_SS == element_json.get_column_type()	||
					_obj.ELEMENT_TYPE_TABLE_TIME_MM_SS == element_json.get_column_type()	) {

			var time_sec = element_json.get_field_option().get_key();
			if(_v.isNotNumber(time_sec) || parseInt(time_sec) < 0){
				time_sec = "1";
			}

			editable_table_column_project_obj = 
			_view_table.get_editable_table_input_time_mm_ss_column_meta_info_obj(
				// column_title
				element_json.get_field_option().get_option_group_name()
				// column_text
				, time_sec
				// element_json
				, element_json
				// prop_map
				, element_json.get_field_option()
				// is_shy
				, element_json.get_is_shy()
			);
		} else {
			console.log("!Error! / airborne.view.obj.table / get_editable_table_row_meta_info_obj_by_element_json / Unkwon column Type!");
			return;
		}

		return editable_table_column_project_obj;
	}
	// @ Section : TABLE COLUMN META INFO
	// @ private
	// @ desc : 테이블의 컬럼에 일반적인 텍스트를 노출할 수 있습니다.
	,get_editable_table_input_text_column_meta_info_obj:function(column_id, column_text, element_json, prop_map, is_shy){
		var _obj = airborne.bootstrap.obj;

		var column_text_type = this.TABLE_COLUMN_TEXT_TYPE_NORMAL;
		var received_element_type = _obj.ELEMENT_TYPE_TABLE_INPUT_TEXT;

		if(is_shy == undefined) {
			is_shy = false;
		}

		var cur_editable_table_column_meta_info_obj = 
		this.get_editable_table_column_meta_info_obj(
			// column_id
			column_id
			// column_text
			, column_text
			// column_text_type
			, column_text_type
			// received_element_type
			, received_element_type
			// search_list_arr
			, null
			// is_shy
			, is_shy
			// element_json
			, element_json
			// prop_map
			, prop_map
		);

		return cur_editable_table_column_meta_info_obj;
	}
	// @ private
	// @ desc : 테이블의 컬럼에 일반적인 텍스트를 노출할 수 있습니다.
	,get_editable_table_text_column_meta_info_obj:function(column_id, column_text, element_json, prop_map, is_shy){
		var _obj = airborne.bootstrap.obj;

		var column_text_type = this.TABLE_COLUMN_TEXT_TYPE_NORMAL;
		var received_element_type = _obj.ELEMENT_TYPE_TABLE_TEXT;

		if(is_shy == undefined) {
			is_shy = false;
		}

		var cur_editable_table_column_meta_info_obj = 
		this.get_editable_table_column_meta_info_obj(
			// column_id
			column_id
			// column_text
			, column_text
			// column_text_type
			, column_text_type
			// received_element_type
			, received_element_type
			// search_list_arr
			, null
			// is_shy
			, is_shy
			// element_json
			, element_json
			// prop_map
			, prop_map
		);

		return cur_editable_table_column_meta_info_obj;
	}	
	// @ public
	// @ desc : 테이블의 컬럼에 분과 초를 나타내고 수정할 수 있습니다. / 12:32 (minutes and seconds)
	,get_editable_table_input_time_mm_ss_column_meta_info_obj:function(column_id, column_text_sec, element_json, prop_map, is_shy){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _dates = airborne.dates;

		if(_v.isNotNumber(column_text_sec)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_input_time_mm_ss_column_meta_info_obj / _v.isNotNumber(column_text_sec)");
			return null;
		}

		if(is_shy == undefined) {
			is_shy = false;
		}

		var column_text_type = this.TABLE_COLUMN_TEXT_TYPE_NORMAL;
		var received_element_type = _obj.ELEMENT_TYPE_TABLE_TIME_MM_SS;

		if(prop_map == null){
			prop_map = {};
		}
		prop_map.__seconds = column_text_sec;

		var cur_minutes = _dates.getSecondsToMinutes(column_text_sec);
		var cur_seconds = _dates.getSecondsRemainder(column_text_sec);

		var column_text_sec_str = "";
		if(cur_minutes > 0){
			column_text_sec_str = cur_minutes + " min";
		}
		if(cur_minutes > 0 && cur_seconds > 0){
			column_text_sec_str += " " + cur_seconds + " sec";	
		} else if(cur_seconds > 0){
			column_text_sec_str += cur_seconds + " sec";	
		}

		var cur_editable_table_column_meta_info_obj = 
		this.get_editable_table_column_meta_info_obj(
			// column_id
			column_id
			// column_text
			, column_text_sec_str
			// column_text_type
			, column_text_type
			// received_element_type
			, received_element_type
			// search_list_arr
			, null
			// is_shy
			, is_shy
			// element_json
			, element_json
			// prop_map
			, prop_map
		);

		return cur_editable_table_column_meta_info_obj;
	}
	// @ private
	// @ Desc : 테이블 컬럼에 검색 리스트를 추가할 경우, 필요한 메타 정보 객체를 만들어 리턴합니다.
	,get_editable_table_search_list_column_meta_info_obj:function(column_id, column_text, search_list_arr, element_json, prop_map, is_shy){
		var _obj = airborne.bootstrap.obj;
		if(_obj.is_not_valid_search_option_arr(search_list_arr)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_search_list_column_meta_info_obj / _obj.is_not_valid_search_option_arr(search_list_arr)");
			return null;
		}

		if(is_shy == undefined) {
			is_shy = false;
		}

		var column_text_type = this.TABLE_COLUMN_TEXT_TYPE_NORMAL;
		var received_element_type = _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST;

		var cur_editable_table_column_meta_info_obj = 
		this.get_editable_table_column_meta_info_obj(
			// column_id
			column_id
			// column_text
			, column_text
			// column_text_type
			, column_text_type
			// received_element_type
			, received_element_type
			// search_list_arr
			, search_list_arr
			// is_shy
			, is_shy
			// element_json
			, element_json
			// prop_map
			, prop_map
		);

		return cur_editable_table_column_meta_info_obj;
	}
	// @ Public
	// @ Desc : 일반 텍스트이지만 타이틀처럼 볼드체가 필요한 경우 사용합니다. 마우스 오버시 새로운 열을 추가할 수 있는 버튼이 노출됩니다.
	,get_editable_table_title_column_addable:function(column_text, element_json, prop_map){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		if(_v.isNotValidStr(column_text)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_title_column_addable / _v.isNotValidStr(column_text)");
			return;
		}

		var _html = airborne.html;
		var column_id = _html.getIdRandomTail(column_text);

		var cur_editable_table_column_meta_info_obj = 
		this.get_editable_table_column_meta_info_obj(
			column_id
			, column_text
			, this.TABLE_COLUMN_TEXT_TYPE_BOLD
			, _obj.ELEMENT_TYPE_TABLE_TITLE_ADDABLE
			, null
			, false	/*is_shy*/
			, element_json		
			, prop_map
		);

		return cur_editable_table_column_meta_info_obj;
	}
	// @ Public
	// @ Desc : 일반 텍스트이지만 타이틀처럼 볼드체가 필요한 경우 사용합니다. 값을 바꿀 수 없습니다.
	,get_fixed_table_title_column:function(column_text, element_json, is_shy){
		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		if(_v.isNotValidStr(column_text)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_title_column_addable / _v.isNotValidStr(column_text)");
			return;
		}

		if(is_shy == undefined) {
			is_shy = false;
		}

		var _html = airborne.html;
		var column_id = _html.getIdRandomTail(column_text);

		var cur_editable_table_column_meta_info_obj = 
		this.get_editable_table_column_meta_info_obj(
			column_id
			, column_text
			, this.TABLE_COLUMN_TEXT_TYPE_BOLD
			, _obj.ELEMENT_TYPE_TABLE_TITLE
			, null
			, is_shy
			, element_json
		);

		return cur_editable_table_column_meta_info_obj;
	}

	// @private
	// @ Desc : 테이블의 컬럼을 추가할 경우 사용하는 공통 정보를 관리하는 메서드입니다. 외부에서 호출하지 않습니다.
	,get_editable_table_column_meta_info_obj:function(column_id, column_text, column_text_type, received_element_type, search_list_arr, is_shy, element_json, prop_map){

		// 테이블에 컬럼을 추가할 경우, 필요한 기본적인 정보들을 설정해줍니다.

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		if(_v.isNotValidStr(column_id)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_column_meta_info_obj / _v.isNotValidStr(column_id)");
			return;
		}
		if(_v.isNotValidStr(column_text)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_column_meta_info_obj / _v.isNotValidStr(column_text)");
			return;
		}
		if(_obj.is_not_valid_element_type(received_element_type)){
			console.log("!Error! / airborne.view.obj.table / get_editable_table_column_meta_info_obj / _obj.is_not_valid_element_type(received_element_type)");
			return null;
		}
		if(this.is_not_valid_table_column_text_type(column_text_type)){
			//console.log("!Error! / airborne.view.obj.table / get_editable_table_column_meta_info_obj / this.is_not_valid_table_column_text_type(column_text_type)");
			column_text_type = this.TABLE_COLUMN_TEXT_TYPE_NORMAL;
		}
		if(is_shy == undefined) {
			is_shy = false;
		}

		// 1. 테이블 컬럼의 속성을 정의하는 객체를 만듭니다.
		var editable_table_column_meta_info_obj = {
			column_id:column_id
			,get_element_id:function(){
				return this.column_id;
			}
			,get_column_id:function(){
				return this.column_id;
			}
			,column_text:column_text
			,get_column_text:function(){
				return this.column_text;
			}
			,set_column_text:function(column_text){
				return this.column_text = column_text;
			}
			,delegate_input_validation:null
			,set_delegate_input_validation:function(delegate_input_validation){
				var _obj = airborne.bootstrap.obj;
				if(_obj.isNotValidDelegate(delegate_input_validation)){
					console.log("!Error! / get_editable_table_column_meta_info_obj / editable_table_column_meta_info_obj / _obj.isNotValidDelegate(delegate_input_validation)");
					return;
				}
				this.delegate_input_validation = delegate_input_validation;
			}
			,get_delegate_input_validation:function(){
				return this.delegate_input_validation;
			}
			,column_text_type:column_text_type
			,get_column_text_type:function(){
				return this.column_text_type;
			}
			,search_list_arr:search_list_arr
			,get_search_list_arr:function(){
				return this.search_list_arr;
			}
			// @ section - Element Option
			// @ Desc : 사용자가 직접 입력하는 엘리먼트 설정값
			,element_json:element_json
			,get_element_json:function(){
				return this.element_json;
			}
			// @ section - Prop Map
			// @ Desc : 엘리먼트 관련 정보를 넣어두는 변수. key, value형
			,prop_map:prop_map
			,get_prop:function(prop_key){
				var prop_value = this.prop_map[prop_key];
				return prop_value;
			}
			,get_prop_map:function(){
				return this.prop_map;
			}
			,event_manager:null
			,set_event_manager:function(event_manager){
				this.event_manager = event_manager;
			}
			,get_event_manager:function(){
				return this.event_manager;
			}
			,get_is_editable:function(){
				var cur_element_type = this.get_element_type();

				if(_obj.is_not_valid_element_type(cur_element_type)){
					console.log("!Error! / get_editable_table_column_meta_info_obj / editable_table_column_meta_info_obj / _obj.is_not_valid_element_type(cur_element_type)");
					return false;
				}

				return _obj.is_editable_element_type(cur_element_type);
			}
			,is_shy:is_shy
			,get_is_shy:function(){
				return this.is_shy;
			}
			,set_is_shy:function(is_shy){
				if(is_shy == null) return;
				this.is_shy = is_shy;
			}
			,element_type:received_element_type
			,get_element_type:function(){
				return this.element_type;
			}
			// @ Section : Relation
			// 테이블 형태는 데이터간 관계를 확인하는 일이 중요합니다.
			// 관계를 알아야 열, 줄간의 데이터 비교 및 이동, 추가, 삭제가 가능합니다.
			// 이 관계는 element json 객체에 정의되어 있습니다. (사용자가 데이터를 인자로 넘기면서 열, 줄 관계가 만들어 집니다.)
			, get_element_json_ref_up:function() {
				if(this.get_element_json() == undefined) {
					return;
				}
				return this.get_element_json().get_element_json_ref_up();
			}
			, set_element_json_ref_up:function(ref_up) {
				if(this.get_element_json() == undefined) {
					return;
				}
				this.get_element_json().set_element_json_ref_up(ref_up);
			}
			, get_element_json_ref_down:function() {
				if(this.get_element_json() == undefined) {
					return;
				}
				return this.get_element_json().get_element_json_ref_down();
			}
			, set_element_json_ref_down:function(ref_down) {
				if(this.get_element_json() == undefined) {
					return;
				}
				this.get_element_json().set_element_json_ref_down(ref_down);
			}
			, get_element_json_ref_prev:function() {
				if(this.get_element_json() == undefined) {
					return;
				}
				return this.get_element_json().get_element_json_ref_prev();
			}
			, set_element_json_ref_prev:function(ref_prev) {
				if(this.get_element_json() == undefined) {
					return;
				}
				this.get_element_json().set_element_json_ref_prev(ref_prev);
			}
			, get_element_json_ref_next:function() {
				if(this.get_element_json() == undefined) {
					return;
				}
				return this.get_element_json().get_element_json_ref_next();
			}
			, set_element_json_ref_next:function(ref_next) {
				if(this.get_element_json() == undefined) {
					return;
				}
				this.get_element_json().set_element_json_ref_next(ref_next);
			}
			, get_all_horizontal_element_json_ref_arr:function(has_myself, has_shy_element){
				if(this.get_element_json() == undefined) {
					return;
				}
				return this.get_element_json().get_all_horizontal_element_json_ref_arr(has_myself, has_shy_element);
			}
		};

		if(element_json != undefined) {
			element_json.set_element_meta_info(editable_table_column_meta_info_obj);	
		}

		return editable_table_column_meta_info_obj;
	}		
	// @ Section : TABLE DRAWING & EVENT
	// @ public
	// @ Desc : 화면에 테이블을 추가합니다. 
	// @ return : element collection set을 반환합니다.
	// 입력받은 데이터가 없더라도 유저가 기본값을 추가할 수 있어야 합니다.
	// json_format 타입으로 화면에 표시할 데이터를 전달받습니다.
	,add_editable_table_V2:function(parent_jq, table_title, table_column_json_format_obj, table_raw_data_arr, delegate_save_n_reload){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _view_table = airborne.bootstrap.view.obj.table;

		if(_v.is_not_valid_str(table_title)){
			console.log("!Error! / airborne.view.obj.table / add_editable_table_V2 / _v.is_not_valid_str(table_title)");
			return null;
		}

		if(table_column_json_format_obj == undefined){
			console.log("!Error! / airborne.view.obj.table / add_editable_table_V2 / table_column_json_format_obj == undefined");
			return null;
		}

		// table_row_data는 null 허용.

		if(_obj.isNotValidDelegate(delegate_save_n_reload)) {
			console.log("!Error! / airborne.view.obj.table / add_editable_table_V2 / _obj.isNotValidDelegate(delegate_save_n_reload)");
			return null;
		}

		// 테이블 메타 정보를 먼저 생성합니다.
		var editable_table_obj = _view_table.get_editable_table_meta_info_obj(table_title, false/*is_editable_title*/, false/*is_fixed_row*/);
		
		// 전달받은 shy row의 메타 정보로 title row element의 메타 정보를 만듭니다.
		// , get_all_horizontal_ref_arr:function(has_myself, has_shy_element){
		var cur_table_column_json_format_obj_arr = 
		table_column_json_format_obj.get_all_horizontal_ref_arr(true/*has_myself*/, true/*has_shy_element*/, true/*has_title_element*/);

		// create title row meta info
		var idx;
		var length = cur_table_column_json_format_obj_arr.length;
		var table_title_row_info = [];
		var prev_table_title_element;
		for(idx = 0;idx < length;idx++) {
			var cur_json_table_shy_row_element = cur_table_column_json_format_obj_arr[idx];

			if(cur_json_table_shy_row_element == undefined) {
				console.log("!Error! / airborne.view.obj.table / add_editable_table_V2 / cur_json_table_shy_row_element == undefined");
				return null;
			}

			if(cur_json_table_shy_row_element.get_field_option() == undefined) {
				console.log("!Error! / airborne.view.obj.table / add_editable_table_V2 / cur_json_table_shy_row_element.get_field_option() == undefined");
				return null;
			}

			// 고정 컬럼 타이틀 타입이 열에 있다면 타이틀 열을 따로 만들지 않습니다.
			if(_obj.ELEMENT_TYPE_TABLE_TITLE === cur_json_table_shy_row_element.get_column_type()) {
				break;
			}

			var cur_element_json_table_title = 
			_view_table.get_json_format_obj_title_addable_type(
				// __field_option
				cur_json_table_shy_row_element.get_field_option()
				// __ref_prev
				, prev_table_title_element
			);

			if(cur_element_json_table_title != undefined) {
				// shy row는 언제나 title row 바로 밑에 있습니다.
				cur_element_json_table_title.set_ref_down(cur_json_table_shy_row_element);
				prev_table_title_element = cur_element_json_table_title;
			}

			// 여기서 shy row에 대한 설정 확인.
			table_title_row_info.push(
				_view_table.get_editable_table_title_column_addable(
					// column_text
					cur_element_json_table_title.get_field_option().get_option_group_name()
					// element_json 
					, cur_element_json_table_title
					// prop_map
					, cur_element_json_table_title.get_field_option()
				)
			);
		}
		if(_v.is_valid_array(table_title_row_info)) {
			editable_table_obj.add_table_row_info(table_title_row_info);	
		}
		

		// create shy row meta info
		var table_row_info = [];
		for(idx = 0;idx < length;idx++) {
			var cur_json_table_shy_row_element = cur_table_column_json_format_obj_arr[idx];
			// 여기서 shy row에 대한 설정 확인.
			table_row_info.push(_view_table.get_editable_table_row_meta_info_obj_by_element_json(cur_json_table_shy_row_element));
		}
		editable_table_obj.add_table_row_info(table_row_info);

		// create row meta info
		length = table_raw_data_arr.length;
		var up_element = table_column_json_format_obj;

		for(idx = 0;idx < length;idx++) {
			var cur_table_raw_data = table_raw_data_arr[idx];

			// DB에서 가져온 raw data를 테이블에서 사용할 수 있는 형태로 가공합니다.
			var prev_clone;
			var cur_all_horizontal_ref_up_arr = up_element.get_all_horizontal_ref_arr(true/*has_myself*/,true/*has_shy_element*/,true/*has_title_element*/);
			table_row_info = [];

			for (var inner_idx = 0; inner_idx < cur_all_horizontal_ref_up_arr.length; inner_idx++) {

				var cur_ref_up = cur_all_horizontal_ref_up_arr[inner_idx];
				var column_clone = cur_ref_up.get_clone();

				column_clone.get_field_option().set_key_n_value_from_raw_map(cur_table_raw_data);

				// set relation ship
				var cur_ref_down_bottom = cur_ref_up.get_ref_down_bottom();
				cur_ref_down_bottom.set_ref_down(column_clone);

				if(prev_clone != undefined) {
					column_clone.set_ref_prev(prev_clone);
				}

				prev_clone = column_clone;

				var next_table_column_info = _view_table.get_editable_table_row_meta_info_obj_by_element_json(column_clone);
				if(next_table_column_info == undefined) {
					console.log("!Error! / airborne.view.obj.table / add_editable_table_V2 / next_table_column_info == undefined");
					return;
				}
				
				// 여기서 shy row에 대한 설정 확인.
				table_row_info.push(next_table_column_info);
			};			
			up_element = prev_clone;
			prev_clone = null;

			editable_table_obj.add_table_row_info(table_row_info);
		}
		// row meta info ends

		var cur_element_collection = 
		_view_table.add_editable_table(
			// parent_jq
			parent_jq
			// received_editable_table_meta_info_obj
			, editable_table_obj
			// delegate_save_n_reload
			, delegate_save_n_reload
			// delegate_fetch_searchable_element_list
			, null
			// delegate_show_combo_box_element
			, null
		);

		// up_element.show_table_matrix();

		return cur_element_collection;
	}
	// @ public
	,add_title_type:function(param_obj) {

		if( param_obj == undefined ) {
			console.log("!Error! / airborne.view.obj.table / add_title_type / param_obj == undefined");
			return null;
		}

		var column_title = param_obj.column_title;
		var key_access_prop_name = param_obj.key_access_prop_name;

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(column_title)) {
			column_title = "title";
		}

		if(_v.isNotValidStr(key_access_prop_name)) {
			console.log("!Error! / airborne.view.obj.table / add_title_type / _v.isNotValidStr(key_access_prop_name)");
			return null;
		}

		var cur_field_option = 
		_obj.get_element_option( column_title, key_access_prop_name);

		return this.get_shy_json_format_obj_title_type(cur_field_option);
	}	
	// @ private
	// @ Desc : 테이블의 shy row의 element의 json format obj를 반환합니다.
	,get_shy_json_format_obj_title_type:function(__field_option, __ref_prev){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_obj.is_not_valid_search_option(__field_option)) {
			console.log("!Error! / airborne.view.obj.table / get_shy_json_format_obj_title_type / _obj.is_not_valid_search_option(__field_option)");
			return null;
		}

		var cur_json_format_obj = 
		this.get_json_format_obj(
			// __field_option
			__field_option
			// __column_type
			, _obj.ELEMENT_TYPE_TABLE_TITLE
			// __ref_prev
			, __ref_prev
		);

		cur_json_format_obj.set_is_shy(true);

		return cur_json_format_obj;
	}
	// @ public
	// @ Desc : 화면에 값을 표시만 하는 엘리먼트입니다. 수정, 편집은 할 수 없습니다.
	,add_texe_type:function(param_obj) {

		if( param_obj == undefined ) {
			console.log("!Error! / airborne.view.obj.table / add_texe_type / param_obj == undefined");
			return null;
		}

		var column_title = param_obj.column_title;
		var key_access_prop_name = param_obj.key_access_prop_name;

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(column_title)) {
			column_title = "title";
		}

		if(_v.isNotValidStr(key_access_prop_name)) {
			console.log("!Error! / airborne.view.obj.table / add_texe_type / _v.isNotValidStr(key_access_prop_name)");
			return null;
		}

		var cur_field_option = 
		_obj.get_element_option( column_title, key_access_prop_name);

		return this.get_shy_json_format_obj_text_type(cur_field_option);
	}	
	// @ private
	// @ Desc : 테이블의 shy row의 element의 json format obj를 반환합니다.
	,get_shy_json_format_obj_text_type:function(__field_option, __ref_prev){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_obj.is_not_valid_search_option(__field_option)) {
			console.log("!Error! / airborne.view.obj.table / get_shy_jget_shy_json_format_obj_text_typeson_format_obj_input_text_type / _obj.is_not_valid_search_option(__field_option)");
			return null;
		}

		var cur_json_format_obj = 
		this.get_json_format_obj(
			// __field_option
			__field_option
			// __column_type
			, _obj.ELEMENT_TYPE_TABLE_TEXT
			// __ref_prev
			, __ref_prev
		);

		cur_json_format_obj.set_is_shy(true);

		return cur_json_format_obj;
	}
	// @ public
	,add_search_list_type:function(param_obj){

		if( param_obj == undefined ) {
			console.log("!Error! / airborne.view.obj.table / add_search_list_type / param_obj == undefined");
			return null;
		}

		var column_title = param_obj.column_title;
		var key_access_prop_name = param_obj.key_access_prop_name;
		var value_access_prop_name = param_obj.value_access_prop_name;
		var search_option_arr = param_obj.search_option_arr;

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(column_title)){
			column_title = "search_list";
		}

		var cur_field_option =
		_obj.get_element_option(
			column_title
			, key_access_prop_name
			, value_access_prop_name
		)

		return this.get_shy_json_format_obj_search_list_type(cur_field_option, search_option_arr);
	}
	// @ private
	// @ Desc : 테이블의 shy row의 element의 json format obj를 반환합니다.
	// 입력할 값을 선택하는 SEARCH LIST를 사용합니다.
	,get_shy_json_format_obj_search_list_type:function(__field_option, __search_option_arr, __ref_prev){

		// TODO field option 객체에서 설정된 값으로 자동 업데이트하는 프로세스를 만듭니다.

		// __column_prop_option_key
		// 입력, 업데이트, 삭제시 사용할 id 값

		// __column_prop_option_value
		// 입력, 업데이트시 사용할 내용 값

		// __field_option
		// key, value 쌍으로 구성.
		// 화면에 보여줄 이름, DB에 넘길 id로 구성.

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_obj.is_not_valid_search_option(__field_option)) {
			console.log("!Error! / airborne.view.obj.table / get_shy_json_format_obj_search_list_type / _obj.is_not_valid_search_option(__field_option)");
			return null;
		}

		__field_option.add_raw_map_prop(
			// new_prop_key
			"__search_option_arr"
			// new_prop_value
			, __search_option_arr
		);

		var cur_json_format_obj = 
		this.get_json_format_obj(
			// __field_option
			__field_option
			// __column_type
			, _obj.ELEMENT_TYPE_TABLE_SEARCH_LIST
			// __ref_prev
			, __ref_prev
		);

		cur_json_format_obj.set_is_shy(true);

		return cur_json_format_obj;
	}
	// @ public
	,add_input_text_type:function(param_obj){

		if( param_obj == undefined ) {
			console.log("!Error! / airborne.view.obj.table / add_input_text_type / param_obj == undefined");
			return null;
		}

		var column_title = param_obj.column_title;
		var key_access_prop_name = param_obj.key_access_prop_name;

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(column_title === undefined) {
			column_title = "input text";
		}

		var cur_field_option = 
		_obj.get_element_option(column_title, key_access_prop_name);

		return this.get_shy_json_format_obj_input_text_type(cur_field_option);
	}	
	// @ private
	// @ Desc : 테이블의 shy row의 element의 json format obj를 반환합니다.
	,get_shy_json_format_obj_input_text_type:function(__field_option, __ref_prev){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_obj.is_not_valid_search_option(__field_option)) {
			console.log("!Error! / airborne.view.obj.table / get_shy_json_format_obj_input_text_type / _obj.is_not_valid_search_option(__field_option)");
			return null;
		}

		var cur_json_format_obj = 
		this.get_json_format_obj(
			// __field_option
			__field_option
			// __column_type
			, _obj.ELEMENT_TYPE_TABLE_INPUT_TEXT
			// __ref_prev
			, __ref_prev
		);

		cur_json_format_obj.set_is_shy(true);

		return cur_json_format_obj;
	}
	// @ public
	,add_time_mm_ss_type:function(param_obj){

		if( param_obj == undefined ) {
			console.log("!Error! / airborne.view.obj.table / add_time_mm_ss_type / param_obj == undefined");
			return null;
		}

		var column_title = param_obj.column_title;
		var key_access_prop_name = param_obj.key_access_prop_name;

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_v.isNotValidStr(column_title)){
			console.log("!Error! / airborne.view.obj.table / add_time_mm_ss_type / _v.isNotValidStr(column_title)");
			return null;
		}

		var cur_field_option = 
		_obj.get_element_option(
			column_title
			, key_access_prop_name
		);

		return this.get_shy_json_format_obj_time_mm_ss_type(cur_field_option);
	}	
	// @ private
	// @ Desc : 테이블의 shy row의 element의 json format obj를 반환합니다.
	,get_shy_json_format_obj_time_mm_ss_type:function(__field_option, __ref_prev){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_obj.is_not_valid_search_option(__field_option)) {
			console.log("!Error! / airborne.view.obj.table / get_shy_json_format_obj_time_mm_ss_type / _obj.is_not_valid_search_option(__field_option)");
			return null;
		}

		var cur_json_format_obj = 
		this.get_json_format_obj(
			// __field_option
			__field_option
			// __column_type
			, _obj.ELEMENT_TYPE_TABLE_TIME_MM_SS
			// __ref_prev
			, __ref_prev
		);

		cur_json_format_obj.set_is_shy(true);

		return cur_json_format_obj;
	}
	// @ private
	// @ Desc : 테이블의 title row의 element의 json format obj를 반환합니다.
	,get_json_format_obj_title_addable_type:function(__field_option, __ref_prev){

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;

		if(_obj.is_not_valid_search_option(__field_option)) {
			console.log("!Error! / airborne.view.obj.table / get_json_format_obj_title_addable_type / _obj.is_not_valid_search_option(__field_option)");
			return null;
		}

		var cur_json_format_obj = 
		this.get_json_format_obj(
			// __field_option
			__field_option
			// __column_type
			, _obj.ELEMENT_TYPE_TABLE_TITLE_ADDABLE
			// __ref_prev
			, __ref_prev
		);

		return cur_json_format_obj;
	}
	// @ private
	// @ Desc : 타임라인 객체의 고유한 id를 부여합니다.
	// @ private
	,unique_field_id:0
	,get_unique_field_id:function(){
		return this.unique_field_id++;
	}
	// @ private
	// @ Desc : 타임라인 객체 정보를 수용할 json format obj를 반환합니다.
	// @ Exmaple : 
	,get_json_format_obj:function(__field_option, __column_type, __ref_prev){

		// __field_option으로 전달받는 값들 
		// __column_key
		// __prop_map

		var _v = airborne.validator;
		var _obj = airborne.bootstrap.obj;
		var _view_table = airborne.bootstrap.view.obj.table;

		if(_obj.is_not_valid_search_option(__field_option)) {
			console.log("!Error! / airborne.view.obj.table / get_json_format_obj_title_addable_type / _obj.is_not_valid_search_option(__field_option)");
			return null;
		}

		var cur_field_id = this.get_unique_field_id();

		// table_row_column_info
		var json_format_obj = 
		{
			// @ Section : properties
			// column의 id입니다. 
			// id는 모두 각각 고유한 값이어야 합니다.
			// id는 내부적으로 생성합니다.
			field_id:cur_field_id
			, get_field_id:function() {
				return this.field_id;
			}	
			, set_field_value:function(field_value) {
				if(this.field_option == undefined) {
					return;
				}
				this.field_option.set_value(field_value);
			}
			, get_field_value:function() {
				if(this.field_option == undefined) {
					return "";
				}
				return this.field_option.get_value();
			}
			, field_option:__field_option
			, get_field_option:function() {
				return this.field_option;
			}
			, set_field_option:function(field_option) {
				if(_obj.is_not_valid_search_option(field_option)) {
					console.log("!Error! / airborne.view.obj.table / get_json_format_obj / set_field_option / _obj.is_not_valid_search_option(field_option)");
					return;
				}
				this.field_option = field_option;
			}
			// 각 row에 해당 column key를 가진 field가 1개씩 있습니다.
			, get_column_key:function() {
				return this.get_field_option().get_key();
			}
			, column_type:__column_type
			, get_column_type:function() {
				return this.column_type;
			}
			// 컬럼 필드의 추가 정보를 관리합니다.
			// 외부 데이터를 파싱한 이후에 지정됩니다.
			// _obj.get_element_prop_map
			// ex )
			// delegate_fetch_searchable_element_list
			// delegate_show_combo_box_element
			, prop_map:{
				__is_shy:false
			}
			, get_prop_map:function() {
				return this.prop_map;
			}
			, set_prop_map:function(prop_map) {
				if(prop_map == undefined) {
					return;
				}
				return this.prop_map = prop_map;
			}
			, set_is_shy:function(is_shy) {
				if(is_shy == undefined) {
					return;
				}
				return this.prop_map.__is_shy = is_shy;
			}
			, get_is_shy:function() {
				return this.prop_map.__is_shy;
			}
			, add_prop:function(key, value) {
				if(key == undefined) {
					return;
				}
				if(value == undefined) {
					value = "";
				}

				this.prop_map[key] = value;
			}
			, get_clone:function() {
				var clone = _view_table.get_json_format_obj(
					// __field_option
					this.get_field_option().get_clone()
					// __column_type
					, this.get_column_type()
					// __ref_prev
				);

				// clone은 shy mode 제거
				clone.set_is_shy(false);

				return clone;
			}
			// @ Section - functions - prev n next ref
			// 전후상하 관계를 변수로 갖습니다.
			// 리스트 업데이트시, 이 관계를 변경합니다.
			, get_all_horizontal_ref_arr:function(has_myself, has_shy_element, has_title_element){

				if(has_myself == undefined) {
					has_myself = false;
				}

				var cur_ref_arr = [];

				if(has_shy_element === undefined) {
					has_shy_element = false;
				}

				if(has_title_element === undefined) {
					has_title_element = false;
				}


				// 자기 자신보다 앞의 형제들 배열을 가져온다.
				cur_ref_arr = cur_ref_arr.concat(this.get_all_ref_prev_arr(has_shy_element, has_title_element));

				// 자기 자신을 배열에 포함시킨다.
				if(has_myself === true) {
					cur_ref_arr.push(this);
				}
				
				// 자기 자신보다 뒤의 형제들 배열을 가져온다.	
				cur_ref_arr = cur_ref_arr.concat(this.get_all_ref_next_arr(has_shy_element, has_title_element));

				return cur_ref_arr;
			}


			// 앞의 형제의 참조
			, ref_prev:null
			, get_ref_prev:function() {
				return this.ref_prev;
			}
			, set_ref_prev:function(ref_prev) {
				// null이 아닌 객체를 세팅할때 자신과 같은 객체 참조라면 중단
				if(this.ref_prev != undefined && this.ref_prev === ref_prev) {
					return;
				}
				// 이미 입력된 참조가 있고 새로 입력하는 참조가 null이 아니라면 field id를 비교한다.
				if(this.ref_prev != undefined && ref_prev != undefined && this.ref_prev.get_field_id() === ref_prev.get_field_id()) {
					return;
				}

				// null 세팅 가능
				this.ref_prev = ref_prev;

				if(this.ref_prev != undefined) {
					this.ref_prev.set_ref_next(this);
				}
			}
			, get_all_ref_prev_arr:function(has_shy_element, has_title_row) {

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				var delegate_get_linked_element = _obj.get_delegate(function(cur_ref_prev){
					// 다음 참조를 가져옵니다.
					return cur_ref_prev.get_ref_prev();
				}, this);

				if(has_shy_element === undefined) {
					has_shy_element = false;
				}

				if(has_title_row === undefined) {
					has_title_row = false;
				}

				var cur_ref_prev_arr = 
				_obj.get_linked_element_arr(
					// linked_element
					this
					// delegate_get_linked_element
					, delegate_get_linked_element
					// has_shy_element
					, has_shy_element
					// has_title_row
					, has_title_row
				);

				// 돌려받은 배열은 무조건 array.push로 차례대로 쌓습니다
				// 아래에서 위로 올라간 경우는 array.reverse로 역순정렬 해야 합니다.
				return cur_ref_prev_arr.reverse();

			}
			// 뒤의 형제의 참조
			, ref_next:null	
			, get_ref_next:function() {
				return this.ref_next;
			}
			, set_ref_next:function(ref_next) {
				// null이 아닌 객체를 세팅할때 자신과 같은 객체 참조라면 중단
				if(this.ref_next != undefined && this.ref_next === ref_next) {
					return;
				}
				// 이미 입력된 참조가 있고 새로 입력하는 참조가 null이 아니라면 field id를 비교한다.
				if(this.ref_next != undefined && ref_next != undefined && this.ref_next.get_field_id() === ref_next.get_field_id()) {
					return;
				}

				// null 세팅 가능
				this.ref_next = ref_next;

				if(this.ref_next != undefined) {
					this.ref_next.set_ref_prev(this);
				}
			}
			, get_all_ref_next_arr:function(has_shy_element, has_title_row) {

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				var delegate_get_linked_element = _obj.get_delegate(function(cur_ref_next){
					// 다음 참조를 가져옵니다.
					return cur_ref_next.get_ref_next();
				}, this);

				if(has_shy_element === undefined) {
					has_shy_element = false;
				}

				if(has_title_row === undefined) {
					has_title_row = false;
				}

				var cur_ref_next_arr = 
				_obj.get_linked_element_arr(
					// linked_element
					this
					// delegate_get_linked_element
					, delegate_get_linked_element
					// has_shy_element
					, has_shy_element
					// has_title_row
					, has_title_row
				);

				// 돌려받은 배열은 무조건 array.push로 차례대로 쌓습니다
				// 아래에서 위로 올라간 경우는 array.reverse로 역순정렬 해야 합니다.
				return cur_ref_next_arr;				
			}
			// @ Section - function - up n down ref
			// 이전 형제 리스트의 자신과 동일한 인덱스의 형제 참조
			, ref_up:null
			, get_ref_up:function() {
				return this.ref_up;
			}
			, set_ref_up:function(ref_up) {
				// null이 아닌 객체를 세팅할때 자신과 같은 객체 참조라면 중단
				if(this.ref_up != undefined && this.ref_up === ref_up) {
					return;
				}
				// 이미 입력된 참조가 있고 새로 입력하는 참조가 null이 아니라면 field id를 비교한다.
				if(this.ref_up != undefined && ref_up != undefined && this.ref_up.get_field_id() === ref_up.get_field_id()) {
					return;
				}

				// null 세팅 가능
				this.ref_up = ref_up;

				if(ref_up != undefined) {
					ref_up.set_ref_down(this);
				}
			}
			, get_all_ref_up_arr:function(has_shy_element, has_title_row) {

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				var delegate_get_linked_element = _obj.get_delegate(function(cur_ref_up){

					// 다음 참조를 가져옵니다.
					var new_ref_up = cur_ref_up.get_ref_up();

					return new_ref_up;
				}, this);

				if(this.get_ref_up() == undefined) {
					return [];
				}

				if(has_shy_element === undefined) {
					has_shy_element = false;
				}

				if(has_title_row === undefined) {
					has_title_row = false;
				}

				var cur_ref_next_arr = 
				_obj.get_linked_element_arr(
					// linked_element
					this
					// delegate_get_linked_element
					, delegate_get_linked_element
					// has_shy_element
					, has_shy_element
					// has_title_row
					, has_title_row
				);

				// 돌려받은 배열은 무조건 array.push로 차례대로 쌓습니다
				// 아래에서 위로 올라간 경우는 array.reverse로 역순정렬 해야 합니다.
				return cur_ref_next_arr.reverse();
			}
			, get_first_table_row_first_element:function(has_shy_element){
				var _v = airborne.validator;
				// 자신의 형제들 중 가장 첫번째 배열을 반환합니다.
				var cur_all_ref_up_arr = this.get_all_ref_up_arr(has_shy_element);
				if(_v.is_not_valid_array(cur_all_ref_up_arr)) {
					return;
				}

				var first_table_row_element = cur_all_ref_up_arr[0];
				if(first_table_row_element == undefined) {
					return;
				}

				return first_table_row_element;

			}
			, get_first_table_row_element_arr:function(has_shy_element, has_title_element){
				var _v = airborne.validator;

				var first_table_row_element = this.get_first_table_row_first_element(has_shy_element);
				if(first_table_row_element == undefined) {
					return [];
				}

				if(has_shy_element === undefined) {
					has_shy_element = false;
				}

				if(has_title_element === undefined) {
					has_title_element = false;
				}

				var first_table_row_element_arr = 
				first_table_row_element.get_all_horizontal_ref_arr(
					true // has_myself
					, has_shy_element
					, has_title_element
				);

				return first_table_row_element_arr;
			}
			// 이후 형제 리스트의 자신과 동일한 인덱스의 형제 참조
			, ref_down:null
			, get_ref_down:function() {
				return this.ref_down;
			}
			, get_ref_down_bottom:function() {
				// 가장 바닥에 있는 엘리먼트 참조를 가져옵니다.
				var cur_all_ref_down_arr = this.get_all_ref_down_arr(true/*has_shy_element*/);
				var _v = airborne.validator;
				return (_v.is_not_valid_array(cur_all_ref_down_arr))? this : cur_all_ref_down_arr[cur_all_ref_down_arr.length - 1];
			}
			, set_ref_down:function(ref_down) {

				// null이 아닌 객체를 세팅할때 자신과 같은 객체 참조라면 중단
				if(this.ref_down != undefined && this.ref_down === ref_down) {
					return;
				}
				// 이미 입력된 참조가 있고 새로 입력하는 참조가 null이 아니라면 field id를 비교한다.
				if(this.ref_down != undefined && ref_down != undefined && this.ref_down.get_field_id() === ref_down.get_field_id()) {
					return;
				}

				// null 세팅 가능
				this.ref_down = ref_down;

				if(ref_down != undefined) {
					ref_down.set_ref_up(this);
				}
			}
			, get_all_ref_down_arr:function(has_shy_element, has_title_row) {

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				var delegate_get_linked_element = _obj.get_delegate(function(cur_ref_up){
					// 다음 참조를 가져옵니다.
					return cur_ref_up.get_ref_down();
				}, this);

				if(this.get_ref_down() == undefined) {
					return [];
				}

				if(has_shy_element === undefined) {
					has_shy_element = false;
				}

				if(has_title_row === undefined) {
					has_title_row = false;
				}

				var cur_ref_next_arr = 
				_obj.get_linked_element_arr(
					// linked_element
					this
					// delegate_get_linked_element
					, delegate_get_linked_element
					// has_shy_element
					, has_shy_element
					// has_title_row
					, has_title_row
				);

				// 돌려받은 배열은 무조건 array.push로 차례대로 쌓습니다
				// 아래에서 위로 올라간 경우는 array.reverse로 역순정렬 해야 합니다.
				return cur_ref_next_arr;
			}			
			, get_last_table_row_element_arr:function(has_shy_element, has_title_element){
				var _v = airborne.validator;
				// 자신의 형제들 중 가장 마지막 배열을 반환합니다.
				var cur_all_ref_down_arr = this.get_all_ref_down_arr(has_shy_element);
				if(_v.is_not_valid_array(cur_all_ref_down_arr)) {
					return [];
				}

				var last_table_row_element = cur_all_ref_down_arr[(cur_all_ref_down_arr.length - 1)];
				if(last_table_row_element == undefined) {
					return [];
				}

				if(has_shy_element === undefined) {
					has_shy_element = false;
				}

				if(has_title_element === undefined) {
					has_title_element = false;
				}

				var last_table_row_element_arr = 
				last_table_row_element.get_all_horizontal_ref_arr(
					// has_myself
					true
					// has_shy_element
					, has_shy_element
					// has_title_element
					, has_title_element
				);

				return last_table_row_element_arr;				

			}
			, get_all_vertical_ref_arr:function(has_myself, has_shy_element, has_title_row) {

				if(has_myself == undefined) {
					has_myself = false;
				}

				if(has_title_row == undefined) {
					has_title_row = false;
				}

				var all_vertical_ref_arr = [];
				all_vertical_ref_arr = all_vertical_ref_arr.concat(this.get_all_ref_up_arr(has_shy_element, has_title_row));

				if(has_myself) {
					all_vertical_ref_arr.push(this);	
				}
				all_vertical_ref_arr = all_vertical_ref_arr.concat(this.get_all_ref_down_arr(has_shy_element, has_title_row));

				return all_vertical_ref_arr;
			}
			, set_relation_between_rows:function(new_ref_up, new_ref_down){

				// @ Sample : _obj.update_element_set_relation
				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				// debug inits
				var cur_ref_up = this.get_ref_up();
				var cur_ref_down = this.get_ref_down();
				var cur_vertical_ref_length = 
				this.get_all_vertical_ref_arr(
					// has_myself
					true
					// has_shy_element
					, false
					// has_title_row
					, false
				).length;

				// console.log("set_relation_between_rows / 1. 자신과 연결된 상, 하관계를 모두 해제합니다.");
				this.remove_relation_between_rows();

				// console.log("set_relation_between_rows / 1-1. 해제 이후 ref up : ",cur_ref_up.get_all_vertical_ref_arr().length);
				if( cur_ref_up != undefined && cur_ref_up.get_element_meta_info().get_is_shy() === false ) {

					var cur_all_vertical_ref_arr_length_from_ref_up = 
					cur_ref_up.get_all_vertical_ref_arr(
						// has_myself
						true
						// has_shy_element
						, false
						// has_title_row
						, false
					).length;

					if(cur_vertical_ref_length <= cur_all_vertical_ref_arr_length_from_ref_up) {
						console.log("!Error! / set_relation_between_rows / 1-1. 윗 형제 관계 해제에 문제가 있습니다." + cur_ref_up.get_all_vertical_ref_arr().length + " / " + cur_vertical_ref_length + " / ",cur_ref_up);
						return;
					}
				}

				// console.log("set_relation_between_rows / 1-2. 해제 이후 ref  : ",this.get_all_vertical_ref_arr().length);
				var cur_all_vertical_ref_arr_length_from_self = 
				this.get_all_vertical_ref_arr(
					// has_myself
					true
					// has_shy_element
					, false
					// has_title_row
					, false
				).length;
				if(cur_vertical_ref_length <= cur_all_vertical_ref_arr_length_from_self) {
					console.log("!Error! / set_relation_between_rows / 1-2 / 형제 관계 해제에 문제가 있습니다." + " / ",this);
					return;
				}


				// console.log("set_relation_between_rows / 1-3. 해제 이후 ref down : ",cur_ref_down.get_all_vertical_ref_arr().length);
				if(cur_ref_down != undefined) {

					var cur_all_vertical_ref_arr_length_from_down = 
					cur_ref_down.get_all_vertical_ref_arr(
						// has_myself
						true
						// has_shy_element
						, false
						// has_title_row
						, false
					).length;

					if(cur_vertical_ref_length <= cur_all_vertical_ref_arr_length_from_down) {
						console.log("!Error! / set_relation_between_rows / 1-3 / 아래 형제 관계 해제에 문제가 있습니다." + " / ",cur_ref_down);
						return;
					}
				}
				// debug ends
				


				// console.log("set_relation_between_rows / 2. 자신이 포함된 열, 자신의 열의 위,아래 열들의 참조 배열을 가져옵니다.");
				var all_horizontal_ref_arr_from_new_ref_up = [];
				if(new_ref_up != undefined) {
					all_horizontal_ref_arr_from_new_ref_up = 
					new_ref_up.get_all_horizontal_ref_arr(
						true 	// has_myself
						, true 	// has_shy_element
						, true 	// has_title_element
					);
				}
				var all_horizontal_ref_arr = 
					this.get_all_horizontal_ref_arr(
						true 	// has_myself
						, true 	// has_shy_element
						, true 	// has_title_element
					);
				var all_horizontal_ref_arr_from_new_ref_down = [];
				if(new_ref_down != undefined) {
					all_horizontal_ref_arr_from_new_ref_down = 
					new_ref_down.get_all_horizontal_ref_arr(
						true 	// has_myself
						, true 	// has_shy_element
						, true 	// has_title_element
					);
				}
				
				// check array length
				if(all_horizontal_ref_arr_from_new_ref_up.length > 0 && all_horizontal_ref_arr_from_new_ref_up.length !== all_horizontal_ref_arr.length) {
					console.log("!Error! / 배열의 길이가 다릅니다! / ref_up : " + all_horizontal_ref_arr_from_new_ref_up.length + " / ref_myself : " + all_horizontal_ref_arr.length);
					return;
				}
				if(all_horizontal_ref_arr_from_new_ref_down.length > 0 && all_horizontal_ref_arr_from_new_ref_down.length !== all_horizontal_ref_arr.length) {
					console.log("!Error! / 배열의 길이가 다릅니다! / ref_myself : " + all_horizontal_ref_arr.length + " / ref_down : " + all_horizontal_ref_arr_from_new_ref_down.length);
					return;
				}

				// console.log("set_relation_between_rows / 3. 자신이 포함된 열의 모든 형제 엘리먼트에 대해 상,하 관계를 새롭게 맺습니다.");
				var idx;
				var length = all_horizontal_ref_arr_from_new_ref_up.length;
				for (idx = 0; idx < length; idx++) {
					var cur_horizontal_ref = all_horizontal_ref_arr[idx];

					var cur_horizontal_ref_from_new_ref_up;
					if(_v.is_valid_array(all_horizontal_ref_arr_from_new_ref_up)) {
						cur_horizontal_ref_from_new_ref_up = all_horizontal_ref_arr_from_new_ref_up[idx];	
					}
					
					var cur_horizontal_ref_from_new_ref_down;
					if(_v.is_valid_array(all_horizontal_ref_arr_from_new_ref_up)) {
						cur_horizontal_ref_from_new_ref_down = all_horizontal_ref_arr_from_new_ref_down[idx];
					}

					// 1. 

					// 2. 자신과 연결될 상, 하관계 엘리먼트들의 빈자리를 만들기 위해 기존 엘리먼트의 관계를 없앱니다.
					// A->C ==> A->B->C
					// A<-C ==> A<-B<-C
					if(cur_horizontal_ref_from_new_ref_up != undefined) {
						cur_horizontal_ref_from_new_ref_up.set_ref_down(cur_horizontal_ref);
					}
					cur_horizontal_ref.set_ref_up(cur_horizontal_ref_from_new_ref_up);

					if(cur_horizontal_ref_from_new_ref_down != undefined) {
						cur_horizontal_ref_from_new_ref_down.set_ref_up(cur_horizontal_ref);
					}
					cur_horizontal_ref.set_ref_down(cur_horizontal_ref_from_new_ref_down);
				} // for end

			}
			, remove_relation_between_rows:function(){
				// A->B->C ==> A->C
				// A<-B<-C ==> A<-C
				// console.log("remove_relation_between_rows / 1. element가 속한 table row의 모든 element들과 연결된 상, 하관계를 모두 해제합니다.");
				var all_horizontal_ref_arr = this.get_all_horizontal_ref_arr(true, true, true);
				// console.log("remove_relation_between_rows / 1. all_horizontal_ref_arr : ", all_horizontal_ref_arr.length);

				var idx;
				var length = all_horizontal_ref_arr.length;
				for (idx = 0; idx < length; idx++) {

					var cur_horizontal_ref = all_horizontal_ref_arr[idx];
					var cur_horizontal_ref_from_above_row = cur_horizontal_ref.get_ref_up();
					var cur_horizontal_ref_from_below_row = cur_horizontal_ref.get_ref_down();
					var cur_vercitcal_ref_length = cur_horizontal_ref.get_all_vertical_ref_arr(true).length;

					// console.log("remove_relation_between_rows / 1-1. 자신의 상하관계 모두 해제 / cur_vercitcal_ref_length / ",cur_vercitcal_ref_length);
					cur_horizontal_ref.set_ref_up(null);
					cur_horizontal_ref.set_ref_down(null);
					// console.log("remove_relation_between_rows / 1-1-1. 해제 이후 ref myself : ",cur_horizontal_ref.get_all_vertical_ref_arr().length);
					if(cur_horizontal_ref.get_all_vertical_ref_arr() > 0){
						// 자신의 객체 관계를 해제하면 0이어야 합니다.
						console.log("!Error! / remove_relation_between_rows / 1-1-1. 자신의 객체 해제에 문제가 있습니다. / obj : ",cur_horizontal_ref);
						return;
					}

					// console.log("remove_relation_between_rows / 1-2. 이전의 상하관계를 서로 연결함. 없다면 null을 넣어서 시작, 혹은 마지막 열인 것을 표시.");
					if(cur_horizontal_ref_from_above_row != undefined) {
						cur_horizontal_ref_from_above_row.set_ref_down(cur_horizontal_ref_from_below_row);	

						// console.log("remove_relation_between_rows / 1-2-1. 해제 이후 ref up : ",cur_horizontal_ref_from_above_row.get_all_vertical_ref_arr().length);
						if(!(cur_horizontal_ref_from_above_row.get_all_vertical_ref_arr().length < cur_vercitcal_ref_length)) {
							console.log("!Error! / remove_relation_between_rows / 1-2-1. 윗 형제 객체 해제에 문제가 있습니다. / obj : ",cur_horizontal_ref_from_above_row);
							return;
						}
					}

					if(cur_horizontal_ref_from_below_row != undefined) {
						cur_horizontal_ref_from_below_row.set_ref_up(cur_horizontal_ref_from_above_row);	

						// console.log("remove_relation_between_rows / 1-3-1. 해제 이후 ref down : ",cur_horizontal_ref_from_below_row.get_all_vertical_ref_arr().length);
						if(!(cur_horizontal_ref_from_below_row.get_all_vertical_ref_arr().length < cur_vercitcal_ref_length)) {
							console.log("!Error! / remove_relation_between_rows / 1-3-2. 아래 형제 객체 해제에 문제가 있습니다. / obj : ",cur_horizontal_ref_from_below_row);
							return;
						}
					}
				} // for end
			}
			, get_json_format_obj_from_table:function(){

				// 자신이 속한 테이블의 모든 데이터를 이중 배열로 반환합니다.
				// 메서드가 제외된 데이터만 반환받습니다.
				var cur_all_vertical_ref_arr = this.get_all_vertical_ref_arr(true/*has_myself*/, false/*has_shy_element*/, true/*has_title_row*/);
				var idx;
				var length = cur_all_vertical_ref_arr.length;
				var json_format_arr_from_table = [];
				for (idx = 0; idx < length; idx++) {
					var cur_vertical_ref = cur_all_vertical_ref_arr[idx];
					json_format_arr_from_table.push(cur_vertical_ref.get_json_format_obj_from_table_row());
				}

				return json_format_arr_from_table;
			}
			, get_json_format_obj_from_table_row:function(){
				// 자신이 속한 table row의 
				// json 형식의 데이터로 돌려줍니다.
				// 메서드를 제외한 순수한 데이터만 돌려줍니다.

				var cur_all_ref_arr = this.get_all_horizontal_ref_arr(true/*has_myself*/, false/*has_shy_element*/, true/*has_title_element*/);
				var idx;
				var length = cur_all_ref_arr.length;
				var json_format_arr_from_table_row = [];
				for (idx = 0; idx < length; idx++) {
					var cur_all_ref = cur_all_ref_arr[idx];
					if(cur_all_ref == undefined) {
						continue;
					}
					json_format_arr_from_table_row.push(cur_all_ref.get_json_format_obj());
				};

				return json_format_arr_from_table_row;
			}
			, get_json_format_obj:function(){
				// json 형식의 데이터로 돌려줍니다.
				// 메서드를 제외한 순수한 데이터만 돌려줍니다.

				var _html = airborne.html;

				var cur_json_format_obj = {
					option_group_name:_html.getSQLSafeText(this.get_field_option().get_option_group_name())
					, key_access_prop_name:_html.getSQLSafeText(this.get_field_option().get_key_access_prop_name())
					, key:_html.getSQLSafeText(this.get_column_key())
					, type:this.get_column_type()
					, is_shy:this.get_is_shy()
				};

				var cur_column_key = _html.getSQLSafeText(this.get_column_key());
				var cur_event_manager = this.get_element_meta_info().get_event_manager();

				return cur_json_format_obj;
			}
			// Section - chain method
			// @ public - chain method
			,add_title_type:function(param_obj){

				if( param_obj == undefined ) {
					console.log("!Error! / airborne.view.obj.table / add_title_type / param_obj == undefined");
					return null;
				}

				var column_title = param_obj.column_title;
				var key_access_prop_name = param_obj.key_access_prop_name;

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(column_title == undefined) {
					column_title = "title";
				}

				if(_v.isNotValidStr(key_access_prop_name)){
					console.log("!Error! / airborne.view.obj.table / add_title_type / _v.isNotValidStr(key_access_prop_name)");
					return null;
				}

				var cur_field_option = 
				_obj.get_element_option( column_title, key_access_prop_name );

				return this.get_shy_json_format_obj_title_type(cur_field_option);
			}	
			// @ private - chain method
			// @ Desc : 테이블의 shy row의 element의 json format obj를 반환합니다.
			,get_shy_json_format_obj_title_type:function(__field_option){

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(_obj.is_not_valid_search_option(__field_option)) {
					console.log("!Error! / airborne.view.obj.table / get_shy_json_format_obj_input_text_type / _obj.is_not_valid_search_option(__field_option)");
					return null;
				}

				// 자기 다음 형제 객체를 만듭니다.
				// 객체 생성뒤 바로 호출할 수 있는 체인 방식.
				var next_sibling_json_format_obj = 
				_view_table.get_shy_json_format_obj_title_type(__field_option);

				// 바로 형제 관계를 연결합니다.
				this.set_ref_next(next_sibling_json_format_obj);

				return next_sibling_json_format_obj;
			}
			// @ public - chain method
			// @ Desc : 화면에 값을 표시만 하는 엘리먼트입니다. 수정, 편집은 할 수 없습니다.
			,add_texe_type:function(param_obj) {

				if( param_obj == undefined ) {
					console.log("!Error! / airborne.view.obj.table / add_texe_type / param_obj == undefined");
					return null;
				}

				var column_title = param_obj.column_title;
				var key_access_prop_name = param_obj.key_access_prop_name;

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(_v.isNotValidStr(column_title)) {
					column_title = "title";
				}

				if(_v.isNotValidStr(key_access_prop_name)) {
					console.log("!Error! / airborne.view.obj.table / add_texe_type / _v.isNotValidStr(key_access_prop_name)");
					return null;
				}

				var cur_field_option = 
				_obj.get_element_option( column_title, key_access_prop_name);

				return this.get_shy_json_format_obj_text_type(cur_field_option);
			}	
			// @ private
			// @ Desc : 테이블의 shy row의 element의 json format obj를 반환합니다.
			,get_shy_json_format_obj_text_type:function(__field_option){

				// 자기 다음 형제 객체를 만듭니다.
				// 객체 생성뒤 바로 호출할 수 있는 체인 방식.
				var next_sibling_json_format_obj = 
				_view_table.get_shy_json_format_obj_text_type(__field_option);

				// 바로 형제 관계를 연결합니다.
				this.set_ref_next(next_sibling_json_format_obj);

				return next_sibling_json_format_obj;

			}
			// @ public
			,add_search_list_type:function(param_obj){

				if( param_obj == undefined ) {
					console.log("!Error! / airborne.view.obj.table / add_search_list_type / param_obj == undefined");
					return null;
				}

				var column_title = param_obj.column_title;
				var key_access_prop_name = param_obj.key_access_prop_name;
				var value_access_prop_name = param_obj.value_access_prop_name;
				var search_option_arr = param_obj.search_option_arr;

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(_v.isNotValidStr(column_title)){
					column_title = "search_list";
				}

				var cur_field_option =
				_obj.get_element_option(
					column_title
					, key_access_prop_name
					, value_access_prop_name
				)

				return this.get_shy_json_format_obj_search_list_type(cur_field_option, search_option_arr);
			}	
			// @ private
			,get_shy_json_format_obj_search_list_type:function(__field_option, __search_option_arr){
				var _view_table = airborne.bootstrap.view.obj.table;

				// 자기 다음 형제 객체를 만듭니다.
				// 객체 생성뒤 바로 호출할 수 있는 체인 방식.
				var next_sibling_json_format_obj = 
				_view_table.get_shy_json_format_obj_search_list_type(__field_option, __search_option_arr);

				// 바로 형제 관계를 연결합니다.
				this.set_ref_next(next_sibling_json_format_obj);

				return next_sibling_json_format_obj;
			}
			// @ public
			,add_input_text_type:function(param_obj){

				if( param_obj == undefined ) {
					console.log("!Error! / airborne.view.obj.table / add_input_text_type / param_obj == undefined");
					return null;
				}

				var column_title = param_obj.column_title;
				var key_access_prop_name = param_obj.key_access_prop_name;

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(column_title === undefined) {
					column_title = "input text";
				}

				var cur_field_option = 
				_obj.get_element_option(column_title, key_access_prop_name);

				return this.get_shy_json_format_obj_input_text_type(cur_field_option);
			}
			// @ private
			,get_shy_json_format_obj_input_text_type:function(__field_option){
				var _view_table = airborne.bootstrap.view.obj.table;

				// 자기 다음 형제 객체를 만듭니다.
				// 객체 생성뒤 바로 호출할 수 있는 체인 방식.
				var next_sibling_json_format_obj = 
				_view_table.get_shy_json_format_obj_input_text_type(__field_option);

				// 바로 형제 관계를 연결합니다.
				this.set_ref_next(next_sibling_json_format_obj);

				return next_sibling_json_format_obj;
			}
			// @ public
			,add_time_mm_ss_type:function(param_obj){

				if( param_obj == undefined ) {
					console.log("!Error! / airborne.view.obj.table / add_time_mm_ss_type / param_obj == undefined");
					return null;
				}

				var column_title = param_obj.column_title;
				var key_access_prop_name = param_obj.key_access_prop_name;

				var _v = airborne.validator;
				var _obj = airborne.bootstrap.obj;

				if(_v.isNotValidStr(column_title)){
					console.log("!Error! / airborne.view.obj.table / add_time_mm_ss_type / _v.isNotValidStr(column_title)");
					return null;
				}

				var cur_field_option = 
				_obj.get_element_option(
					column_title
					, key_access_prop_name
				);

				return this.get_shy_json_format_obj_time_mm_ss_type(cur_field_option);
			}
			// @ private
			,get_shy_json_format_obj_time_mm_ss_type:function(__field_option){
				var _view_table = airborne.bootstrap.view.obj.table;

				// 자기 다음 형제 객체를 만듭니다.
				// 객체 생성뒤 바로 호출할 수 있는 체인 방식.
				var next_sibling_json_format_obj = 
				_view_table.get_shy_json_format_obj_time_mm_ss_type(__field_option);

				// 바로 형제 관계를 연결합니다.
				this.set_ref_next(next_sibling_json_format_obj);

				return next_sibling_json_format_obj;
			}
			,get_json_format_obj_title_addable_type:function(__field_option){
				var _view_table = airborne.bootstrap.view.obj.table;

				// 자기 다음 형제 객체를 만듭니다.
				// 객체 생성뒤 바로 호출할 수 있는 체인 방식.
				var next_sibling_json_format_obj = 
				_view_table.get_json_format_obj_title_addable_type(__field_option);

				// 바로 형제 관계를 연결합니다.
				this.set_ref_next(next_sibling_json_format_obj);

				return next_sibling_json_format_obj;
			}
			// @ Section - Data Relation Ship
			, element_meta_info:null
			, get_element_meta_info:function() {
				return this.element_meta_info;
			}
			, set_element_meta_info:function(element_meta_info) {
				if(element_meta_info == undefined) {
					return;
				}

				this.element_meta_info = element_meta_info;
			}
			, get_event_manager:function() {
				if(this.get_element_meta_info() == undefined) {
					return null;
				}
				return this.get_element_meta_info().get_event_manager();
			}
			, do_on_table_matrix:function(delegate_do_on_table_matrix){

				if(_obj.isNotValidDelegate(delegate_do_on_table_matrix)){
					return;
				}

				var cur_all_vertical_ref_arr = this.get_all_vertical_ref_arr(true, true);
				for (var i = 0; i < cur_all_vertical_ref_arr.length; i++) {
					var cur_vertical_ref = cur_all_vertical_ref_arr[i];
					var cur_all_horizontal_ref_arr = cur_vertical_ref.get_all_horizontal_ref_arr(true, true);

					for (var j = 0; j < cur_all_horizontal_ref_arr.length; j++) {
						var cur_horizontal_ref = cur_all_horizontal_ref_arr[j];

						delegate_do_on_table_matrix._func.apply(delegate_do_on_table_matrix._scope,[cur_horizontal_ref]);
					}
				};
			}			
			// 여기서 테이블의 json obj 매트릭스를 반환합니다.
			// @ Section - Debug
			, show_table_matrix:function(){
				//var zero_zero_element = this.get_first_table_row_first_element();

				var cur_all_vertical_ref_arr = this.get_all_vertical_ref_arr(true, true);
				for (var i = 0; i < cur_all_vertical_ref_arr.length; i++) {
					var cur_vertical_ref = cur_all_vertical_ref_arr[i];
					var cur_all_horizontal_ref_arr = cur_vertical_ref.get_all_horizontal_ref_arr(true, true);


					var option_group_names = "";
					var keys = "";
					var types = "";
					var is_shy = "";

					console.log("----------------------------------------------------");
					for (var j = 0; j < cur_all_horizontal_ref_arr.length; j++) {
						var cur_horizontal_ref = cur_all_horizontal_ref_arr[j];

						option_group_names += cur_horizontal_ref.get_field_option().get_option_group_name() + "\t";
						keys += cur_horizontal_ref.get_field_option().get_key() + "\t";
						types += cur_horizontal_ref.get_column_type() + "\t";
						is_shy += (cur_horizontal_ref.get_is_shy())?"shy ":"not shy " + "\t";
					}
					console.log(option_group_names);
					console.log(keys);
					console.log(types);
					console.log(is_shy);
					console.log("----------------------------------------------------");
				};
			}
			// @ public
			// @ desc : 테이블의 json 객체를 이중 배열로 돌려줍니다. element collection set에서 호출하게 됩니다.
			, get_json_format_obj_arr_from_element_collection_set:function() {
				return this.get_json_format_obj_from_table();
			}
		}

		if(__ref_prev != undefined) {
			json_format_obj.set_ref_prev(__ref_prev);
		}

		return json_format_obj;
	}	
	// @ public
	// @ Desc : 화면에 테이블의 열을 추가합니다. 테이블 열을 구성하는 정보는 모두 action table 객체에서 가져옵니다. 각 필드는 기본값을 갖습니다.
	,add_editable_table_row:function(action_table_obj) {

		if(_action.is_not_valid_action_obj(action_table_obj)) {
			console.log("!Error! / add_editable_table_row / _action.is_not_valid_action_obj(action_table_obj)");
			return;
		}


		var table_title = action_table_obj.get_action_name();
		if(_v.is_not_valid_str(table_title)) {
			console.log("!Error! / add_editable_table_row / _v.is_not_valid_str(table_title)");
			return;
		}
		var table_id = _html.get_id_auto_increase(table_title);
		var colspan_cnt = action_table_obj.get_children_cnt();	
		var column_width = parseInt(100 / colspan_cnt);

		var is_first_row = false;
		var is_last_row = false;
		var table_row_tag = ""
		+ "<tr id=\"column_text_container\" is_first=\"<is_first>\" is_last=\"<is_last>\">"
			.replace(/\<is_first\>/gi, is_first_row)
			.replace(/\<is_last\>/gi, is_last_row)
		;

		// field 별로 순회하면서 column - field를 그려줍니다.
		var idx_row = action_table_obj.get_first_child().get_children_cnt();
		var last_row_jq = undefined;
		for (var idx_column = 0; idx_column < colspan_cnt; idx_column++) {

			var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
			if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
				console.log("!Error! / add_editable_table_row / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
				return;
			}

			var cur_last_child_action_item = cur_column_child_action_list_obj.get_last_child();
			if(_action.is_not_valid_action_item_obj(cur_last_child_action_item)) {
				console.log("!Error! / add_editable_table_row / _action.is_not_valid_action_item_obj(cur_last_child_action_item)");
				return;
			}

			if(idx_column == 0) {
				console.log("cur_last_child_action_item :: ",cur_last_child_action_item);

				var cur_event_manager = cur_last_child_action_item.get_event_manager();

				console.log("cur_event_manager :: ",cur_event_manager);

				last_row_jq = cur_event_manager.get_element_container_jq();
			}

			// REMOVE ME
			// var cur_action_name = cur_column_child_action_list_field_child_action_item_obj.get_action_name();
			var cur_action_name = "NOT ASSIGNED";

			var field_id = this.get_table_field_id(table_id, idx_row, idx_column);
			table_row_tag += ""
			+ "<td id=\"column_text_container\" field_id=\"<field_id>\" style=\"background-color:#FFFFFF;\" width=\"<column_width>%\" is_first=\"<is_first>\" is_last=\"<is_last>\">"
				.replace(/\<column_width\>/gi, column_width)
				.replace(/\<field_id\>/gi, field_id)
				.replace(/\<is_first\>/gi, is_first_row)
				.replace(/\<is_last\>/gi, is_last_row)
			;

			if(cur_last_child_action_item.is_item_title_only_fixed()){
				table_row_tag += ""
				+ "<strong><span id=\"column_text\" tossed_value=\"<tossed_value>\" input_id=\"<id>\"><_v></span>&nbsp;&nbsp;&nbsp;&nbsp;</strong>"
				.replace(/\<id\>/gi, _html.get_id_auto_increase(cur_action_name))
				.replace(/\<tossed_value\>/gi, cur_action_name)
				.replace(/\<_v\>/gi, _html.getSafeHTMLInline(cur_action_name))
				;
			} else {
				table_row_tag += ""
				+ "<span id=\"column_text\" tossed_value=\"<tossed_value>\" input_id=\"<id>\"><_v></span>&nbsp;&nbsp;&nbsp;&nbsp;"
				.replace(/\<id\>/gi, _html.get_id_auto_increase(cur_action_name))
				.replace(/\<tossed_value\>/gi, cur_action_name)
				.replace(/\<_v\>/gi, _html.getSafeHTMLInline(cur_action_name))
				;
			}

			// field cell control buttons.
			table_row_tag += ""
				+ "<div id=\"btn_eject\" style=\"float:right;height:32px;width:32px;top:-5px;position:relative;border-radius:4px;display:none;margin-bottom:-10px;margin-left:4px;margin-right:-5px;\">"
					+ "<span id=\"btn_eject\" class=\"glyphicon glyphicon-move\" style=\"position:absolute;top:9px;left:8px;\"></span>"
				+ "</div>"

				+ "<div id=\"btn_remove\" style=\"height:20px;width:20px;float:right;height:32px;width:32px;top:-5px;position:relative;border-radius:4px;margin-left:4px;padding-left:10px;display:none;margin-bottom:-10px;\">"
					+ "<span id=\"btn_remove\" class=\"glyphicon glyphicon-remove\" style=\"position:absolute;top:9px;left:8px;\">&nbsp;</span>"
				+ "</div>"

				+ "<div id=\"btn_add\" style=\"float:right;height:32px;width:32px;top:-5px;position:relative;margin-left:4px;border-radius:4px;display:none;margin-bottom:-10px;\">"
					+ "<span id=\"btn_add\" class=\"glyphicon glyphicon-plus\" style=\"position:absolute;top:9px;left:9px;\">&nbsp;</span>"
				+ "</div>"

			+ "</td>"
			;

		}

		table_row_tag += ""
		+ "</tr>"
		;

		if(last_row_jq == undefined) {
			console.log("!Error! / add_editable_table_row / last_row_jq == undefined");
			return;
		}

		last_row_jq.after(table_row_tag);
		var new_last_row_jq = last_row_jq.parent().children().last();

		// 뷰가 추가되었습니다. 

		console.log("XXX / action_table_obj ::: ",action_table_obj);
		var cur_event_manager = action_table_obj.get_first_child().get_last_child().get_event_manager();
		console.log("cur_event_manager ::: ",cur_event_manager);

		var cur_element_collection_set = cur_event_manager.get_element_set().get_element_collection_set();
		console.log("cur_element_collection_set ::: ",cur_element_collection_set);

		var cur_delegate_save_n_reload = cur_event_manager.get_delegate_save_n_reload();
		console.log("cur_delegate_save_n_reload ::: ",cur_delegate_save_n_reload);


		// action table obj에서 새로운 열의 정보가 추가되어야 합니다.
		for (var idx_column = 0; idx_column < action_table_obj.get_children_cnt(); idx_column++) {

			var child_column_action_list = action_table_obj.get_child(idx_column);
			if(_action.is_not_valid_action_obj(child_column_action_list)) {
				console.log("!Error! / add_editable_table_row / _action.is_not_valid_action_obj(child_column_action_list)");
				return;
			}

			// 마지막 엘리먼트를 복제합니다.
			var cur_last_child = child_column_action_list.get_last_child();
			cur_last_child.copy();
		}


		this.set_event_table_row_field_element(
			// table_row_element_jq
			new_last_row_jq
			// action_table_obj
			, action_table_obj
			// idx_row
			, action_table_obj.get_first_child().get_children_cnt() - 1
			// cur_element_collection_set
			, cur_element_collection_set
			// delegate_on_event
			, cur_delegate_save_n_reload
		);

		console.log("add_editable_table_row / new_last_row_jq :: ",new_last_row_jq);

	}
	,set_event_table_row_field_element:function(table_row_element_jq, action_table_obj, idx_row, cur_element_collection_set, delegate_on_event) {

		// 각 테이블 row 내부, column 프로퍼티의 마우스 이벤트에 대한 처리.
		var delegate_set_event_manager_prop_on_table_column = _obj.get_delegate(function(element_event_manager){

			var cur_action_item_obj = element_event_manager.get_action_item_obj();
			if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
				console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
				return;
			}
			var cur_table_column_set_jq = element_event_manager.get_element_jq();
			
			// COLOR
			var cur_table_column_color = cur_table_column_set_jq.css("color");
			var cur_table_column_background_color = cur_table_column_set_jq.css("background-color");
			var cur_table_column_border_color = cur_table_column_set_jq.css("border-color");

			element_event_manager.set_element_color(cur_table_column_color);
			element_event_manager.set_element_background_color(cur_table_column_background_color);
			element_event_manager.set_element_border_color(cur_table_column_border_color);

			// CONTAINER
			var element_container_jq = cur_table_column_set_jq.parent();

			element_event_manager.set_element_container_jq(element_container_jq);
			element_event_manager.set_element_id(element_event_manager.event_manager_id);

			// INPUT
			var cur_input_group_jq = cur_table_column_set_jq.parent().parent().find("tr#input_group_column_text");
			element_event_manager.set_title_input_group_jq(cur_input_group_jq);

			var btn_add_jq = cur_table_column_set_jq.find("div#btn_add");
			element_event_manager.set_btn_add_element_jq(btn_add_jq);

			var btn_remove_jq = cur_table_column_set_jq.find("div#btn_remove");
			element_event_manager.set_btn_remove_element_jq(btn_remove_jq);

			var btn_remove_jq = cur_table_column_set_jq.find("div#btn_remove");
			element_event_manager.set_btn_remove_element_jq(btn_remove_jq);

			var btn_eject_jq = cur_table_column_set_jq.find("div#btn_eject");
			element_event_manager.set_btn_eject_element_jq(btn_eject_jq);

			if(cur_action_item_obj.is_item_title_n_time_hh_mm()) {

				// 엘리먼트 내부의 시간 정보 표시 엘리먼트 참조를 저장
				var time_jq = cur_table_column_set_jq.find("span#column_text");
				element_event_manager.set_time_jq(time_jq);
				element_event_manager.show_time_jq();

				// 시간 정보 입력 엘리먼트 그룹
				var time_input_group_jq = cur_table_column_set_jq.parent().parent().find("div#input_group_time");
				element_event_manager.set_time_input_group_jq(time_input_group_jq);

				// 시간 정보 입력 엘리먼트 그룹의 시간 표시 엘리먼트
				var time_input_group_jq_input_jq = time_input_group_jq.find("input#input_time");
				element_event_manager.set_time_input_group_jq_input_jq(time_input_group_jq_input_jq);

				// @ Desc : 시간 입력 그룹의 시간 추가 버튼
				var time_input_group_jq_btn_time_plus_jq = time_input_group_jq.find("button#btn_plus");
				element_event_manager.set_time_input_group_jq_btn_time_plus_jq(time_input_group_jq_btn_time_plus_jq);

				// @ Desc : 시간 입력 그룹의 시간 감소 버튼
				var time_input_group_jq_btn_time_minus_jq = time_input_group_jq.find("button#btn_minus");
				element_event_manager.set_time_input_group_jq_btn_time_minus_jq(time_input_group_jq_btn_time_minus_jq);

				// @ Desc : 시간 입력 그룹의 수정된 시간 확인 버튼
				var time_input_group_jq_btn_time_ok_jq = time_input_group_jq.find("button#btn_ok_time");
				element_event_manager.set_time_input_group_jq_btn_time_ok_jq(time_input_group_jq_btn_time_ok_jq);

				// @ Desc : 시간 입력 그룹의 수정된 시간 취소 버튼
				var time_input_group_jq_btn_time_cancel_jq = time_input_group_jq.find("button#btn_cancel_time");
				element_event_manager.set_time_input_group_jq_btn_time_cancel_jq(time_input_group_jq_btn_time_cancel_jq);					

			}

			var cur_table_column_text_jq = cur_table_column_set_jq.find("span#column_text");
			element_event_manager.set_title_jq(cur_table_column_text_jq);

			var cur_table_column_text_container_jq = cur_table_column_set_jq.parent();
			element_event_manager.set_parent_container_jq(cur_table_column_text_container_jq);

			var cur_input_parent_container_jq = cur_input_group_jq.find("div#input_group_column_text");
			element_event_manager.set_title_input_container_jq(cur_input_parent_container_jq);

			var cur_input_title_jq = cur_input_group_jq.find("input#common_input");
			element_event_manager.set_title_input_jq(cur_input_title_jq);

			var search_output_list_jq = cur_input_group_jq.find("div#search_output_list");
			element_event_manager.set_search_output_list_jq(search_output_list_jq);

			var searchable_combo_box_jq = cur_input_group_jq.find("select");
			element_event_manager.set_searchable_combo_box_jq(searchable_combo_box_jq);

			var cur_title_input_btn_ok_jq = cur_input_group_jq.find("button#btn_ok");
			element_event_manager.set_title_input_btn_ok_jq(cur_title_input_btn_ok_jq);

			var cur_title_input_btn_cancel_jq = cur_input_group_jq.find("button#btn_cancel");
			element_event_manager.set_title_input_btn_cancel_jq(cur_title_input_btn_cancel_jq);

			var cur_title_input_btn_search_jq = cur_input_group_jq.find("button#btn_search");
			element_event_manager.set_title_input_btn_search_jq(cur_title_input_btn_search_jq);

			element_event_manager.set_delegate_save_n_reload(delegate_on_event);

			element_event_manager.set_delegate_add_searchable_element(_obj.get_delegate_add_searchable_element());

			return element_event_manager;

		}, this);


		var table_row_column_text_jq_arr = table_row_element_jq.find("td#column_text_container");

		var event_manager_table_column_arr = [];
		var before_event_manager = null;
		for (var idx_column = 0; idx_column < table_row_column_text_jq_arr.length; idx_column++) {

			var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
			if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
				console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
				return;
			}

			var cur_column_child_action_list_field_child_action_item_obj = cur_column_child_action_list_obj.get_child(idx_row);
			if(_action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)) {
				console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)");
				return;
			}

			var table_row_column_text_element = table_row_column_text_jq_arr[idx_column];
			var table_row_column_text_element_jq = $(table_row_column_text_element);

			var event_manager_id_table_column = this.get_table_field_id(action_table_obj.get_action_name(), idx_row, idx_column);

			var event_manager_table_column_text = 
			_action.make_element_event_manager(
				// event_manager_id
				event_manager_id_table_column
				// element_jq
				, table_row_column_text_element_jq
				// action_item_obj
				, cur_column_child_action_list_field_child_action_item_obj
				// delegate_set_event_manager_prop
				, delegate_set_event_manager_prop_on_table_column
			);

			// 테이블 필드를 입력모드로 바꾸었을 때, 입력 그룹의 위치를 클릭한 리스트 열로 변경하는 델리게이트 설정 
			event_manager_table_column_text.set_delegte_move_title_input_group_jq(_obj.get_delegate(function(cur_element_jq, cur_element_container_jq, cur_title_input_group_jq){

				// 1. 현재 열에 저장된 텍스트를 가져옵니다.
				var cur_title_jq = cur_element_container_jq.find("span#title");
				var cur_title = cur_title_jq.html();

				// 2. 테이블의 열은 부모 레벨에 있으므로 현재 선택한 엘리먼트의 부모(tr) 참조를 가져옵니다.
				var cur_parent_tr_element_jq = cur_element_jq.parent();

				// 3. 사용자가 선택한 열의 위치에 입력 그룹 폼 열을 위치시킵니다.
				cur_parent_tr_element_jq.after(cur_title_input_group_jq);

				// 4. 위치에 따라 INPUT GROUP의 테두리 모양을 변경합니다.
				var cur_idx = cur_element_jq.attr("idx");
				var is_first = (cur_element_jq.attr("is_first") == "true");
				var is_last = (cur_element_jq.attr("is_last") == "true");

				if(is_first && is_last){
					_obj.set_list_single_row_round(cur_title_input_group_jq);
				} else if(is_first){
					_obj.set_list_first_row_round(cur_title_input_group_jq);
				} else if(is_last){
					_obj.set_list_last_row_round(cur_title_input_group_jq);
				}

			}, this));


			// REMOVE ME
			// cur_table_row_column_meta_info_arr[inner_idx].set_event_manager(event_manager_table_column_text);

			// 이벤트 매니저의 전, 후의 형제 관계를 저장합니다.
			if(before_event_manager != null){
				before_event_manager.set_after_sibling_event_manager(event_manager_table_column_text);	
				event_manager_table_column_text.set_before_sibling_event_manager(before_event_manager);
			}
			before_event_manager = event_manager_table_column_text;

			// REMOVE ME
			// event manager + element meta info => element set
			// var cur_table_element_set = _obj.get_element_set(element_meta_info, event_manager_table_column_text);
			// event_manager_table_column_text.set_element_set(cur_table_element_set);

			var cur_element_set = _action.make_element_set(cur_column_child_action_list_field_child_action_item_obj, event_manager_table_column_text);
			if(cur_element_set == undefined) {
				console.log("!Error! / add_editable_table_from_action_table / cur_element_set == undefined");
				return;
			}

			// element set + element set + ... => element collection set
			cur_element_collection_set.push_element_set(cur_element_set);

			// jump spot
			// set eject event
			event_manager_table_column_text.set_delegate_btn_eject_click(_obj.get_delegate(function(event_click, cur_event_manager){

				console.log("HERE / 001");

				var cur_action_item_obj = cur_event_manager.get_action_item_obj();
				if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
					console.log("!Error! / set_delegate_btn_eject_click / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
					return;
				}

				var jsm = cur_event_manager.get_element_set().get_element_collection_set().jump_spot_manager;

				// 클릭시의 델리게이트 정의
				// @ 기본 동작
				// 이벤트 전파를 막습니다.
				event_click.stopPropagation();
				// 다른 객체들의 이벤트를 받지 않도록 lock를 설정.
				var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
				cur_event_hierarchy_manager.lock();

				// 포커싱 모드로 바꿈.
				cur_event_manager.show_focusing_mode();
				var cur_element_container_jq = cur_event_manager.get_element_container_jq();

				// @ element collection settings
				var event_click_offset = {top:event_click.pageY,left:event_click.pageX};

				// 복사 대상 row의 너비를 가져옵니다.
				// 클론을 만들기 전에 현재 각 column field의 너비를 강제적으로 제어해야 함.
				var cur_element_jq = cur_event_manager.get_element_jq();
				if(cur_element_jq == undefined) {
					console.log("!Error! / set_delegate_btn_eject_click / cur_element_jq == undefined");
					return;
				}
				var cur_parent_row_jq = cur_element_jq.parent();
				console.log("XXX / cur_parent_row_jq :: ",cur_parent_row_jq);


				// 사용자가 선택한 엘리먼트가 포함된 table row가 떠오릅니다.
				var clone_element_container_jq = jsm.boost_clone_element_jq(cur_element_container_jq, event_click_offset);

				// set round
				_obj.set_list_single_row_round(clone_element_container_jq, _obj.LIST_ROW_RADIUS_NORMAL);
				var clone_element_offset = clone_element_container_jq.offset();

				var cur_mousemove_callback_set =
				cur_event_hierarchy_manager.add_mousemove_callback_set(_obj.get_delegate(function(mousemove_event, event_manager_on_mousemove){

					// 사용자가 선택한 윈도우의 이동
			        var cur_top = mousemove_event.pageY - jsm.gap;
			        var cur_left = mousemove_event.pageX - jsm.gap;

					clone_element_container_jq.offset({top:cur_top,left:cur_left});

					// 리스트 - 자신의 위, 아래의 형제 엘리먼트에 직접 검사
					// 테이블 - 자신이 속한 열의 위, 아래의 열에 검사

					// 사용자의 마우스 이동에 mouse over시 검사해서 over 이면 focusing 모드로 보여줍니다.
					// 자신의 테이블 열의 모든 객체들을 가져옵니다.
					var action_item_row_on_mouse_over_arr = cur_event_manager.get_element_set().get_element_collection_set().get_action_item_obj_mouse_over(mousemove_event, cur_event_manager);

					console.log("001 / action_item_row_on_mouse_over_arr :: ",action_item_row_on_mouse_over_arr);

					// 움직이는 열을 클릭하면 충돌 검사를 통해 선택된 열 위 또는 아래로 붙임.
					clone_element_container_jq.off();
					clone_element_container_jq.click(function(e){

						// wonder.jung11

						// 테이블의 열 배열을 가져와야 한다.

						var cur_sibling_element_set_mouse_over = null;
						var mouse_over_checksum = null;

						// cur_table_action_item_obj_list = cur_event_manager.get_element_set().get_element_collection_set().get_action_item_obj_mouse_over(mousemove_event, cur_event_manager);

						console.log("002 / action_item_row_on_mouse_over_arr :: ",action_item_row_on_mouse_over_arr);

						for (var idx = 0; idx < action_item_row_on_mouse_over_arr.length; idx++) {
							var cur_action_item_obj = action_item_row_on_mouse_over_arr[idx];

							if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
								console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_item_obj(cur_table_action_item_obj)");
								return;
							}

							var cur_event_manager = cur_action_item_obj.get_event_manager();
							if(cur_event_manager == undefined) {
								console.log("!Error! / clone_element_container_jq.click / cur_event_manager == undefined");
								return;
							}

							var cur_element_set = cur_event_manager.get_element_set();
							if(cur_element_set == undefined) {
								console.log("!Error! / clone_element_container_jq.click / cur_element_set == undefined");
								return;
							}

							// 충돌 검사를 진행한다.
							mouse_over_checksum = jsm.show_mouse_over_element_container_set_top_n_bottom(mousemove_event, cur_element_set);
							if(mouse_over_checksum.has_changed && mouse_over_checksum.is_hover_top){
								cur_sibling_element_set_mouse_over = cur_element_set;
								break;
							} else if(mouse_over_checksum.has_changed && mouse_over_checksum.is_hover_bottom){
								cur_sibling_element_set_mouse_over = cur_element_set;
								break;
							} // end if

						}

						// cur_action_item_obj
						// 옮겨갈 테이블 element container set의 위, 아래 위치를 판단, 참조를 가져옵니다.
						// 자신의 위, 아래는 불가.

						// 이제 선택한 영역의 아래로 엘리먼트를 추가합니다.
						// 부모를 옮기기 전의 절대좌표를 얻습니다.
						var _self_clone_element_container_jq = $(this);
						var prev_offset = _self_clone_element_container_jq.offset();

						if(cur_sibling_element_set_mouse_over != undefined){

							var cur_sibling_event_manager_mouse_over = cur_sibling_element_set_mouse_over.get_event_manager();
							if(cur_sibling_event_manager_mouse_over == undefined) {
								console.log("!Error! / clone_element_container_jq.click / cur_sibling_event_manager_mouse_over == undefined");
								return;
							}

							var cur_sibling_action_item_obj_mouse_over = cur_sibling_event_manager_mouse_over.get_action_item_obj();
							var idx_cur_sibling_action_item_obj_mouse_over = cur_sibling_action_item_obj_mouse_over.get_idx();

							var cur_sibling_action_item_obj_mouse_over_before = cur_sibling_action_item_obj_mouse_over.get_sibling_action_obj_before();
							var idx_cur_sibling_action_item_obj_mouse_over_before = -1;
							if(_action.is_valid_action_item_obj(cur_sibling_action_item_obj_mouse_over_before)) {
								idx_cur_sibling_action_item_obj_mouse_over_before = cur_sibling_action_item_obj_mouse_over_before.get_idx();
							}

							var cur_sibling_action_item_obj_mouse_over_after = cur_sibling_action_item_obj_mouse_over.get_sibling_action_obj_after();
							var idx_cur_sibling_action_item_obj_mouse_over_after = -1;
							if(_action.is_valid_action_item_obj(cur_sibling_action_item_obj_mouse_over_after)) {
								idx_cur_sibling_action_item_obj_mouse_over_after = cur_sibling_action_item_obj_mouse_over_after.get_idx();
							}


							// view mode로 전환합니다.
							cur_sibling_event_manager_mouse_over.show_view_mode();
							var cur_action_item_obj_idx = cur_action_item_obj.get_idx();

							console.log("HERE / cur_action_item_obj_idx :: ",cur_action_item_obj_idx);
							console.log("HERE / idx_cur_sibling_action_item_obj_mouse_over :: ",idx_cur_sibling_action_item_obj_mouse_over);
							console.log("HERE / idx_cur_sibling_action_item_obj_mouse_over_before :: ",idx_cur_sibling_action_item_obj_mouse_over_before);
							console.log("HERE / idx_cur_sibling_action_item_obj_mouse_over_after :: ",idx_cur_sibling_action_item_obj_mouse_over_after);

							if(_v.is_not_unsigned_number(cur_action_item_obj_idx)) {
								console.log("!Error! / clone_element_container_jq.click / _v.is_not_unsigned_number(cur_action_item_obj_idx)");
								return;
							}
							if(mouse_over_checksum.is_hover_top){


								// TODO
								// action item의 형제 관계를 바꿉니다. 
								// 같은 row의 모든 형제 관계를 변경해줘야 합니다.
								for (var idx_column = 0; idx_column < action_table_obj.get_children_cnt(); idx_column++) {

									var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
									if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
										console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
										return;
									}

									// 여기서 옮길 특정 row idx의 action item을 가져옵니다.
									var target_moving_action_item_obj = cur_column_child_action_list_obj.get_child(cur_action_item_obj_idx);
									// 옮길 특정 row의 앞뒤의 엘리먼트 참조를 가져와 순서를 변경해줍니다.
									console.log("1111");
									target_moving_action_item_obj.dive_into_indixes(
										// idx_before_action_item_obj
										idx_cur_sibling_action_item_obj_mouse_over_before
										// idx_after_action_item_obj
										, idx_cur_sibling_action_item_obj_mouse_over
									);
								}

								// event manager의 형제 관계를 다시 세팅합니다.
								// console.log("이제 선택한 영역의 위로 엘리먼트를 추가합니다. / ",cur_sibling_element_set_mouse_over.get_meta_info().get_list_row_text());
								cur_sibling_event_manager_mouse_over.get_element_container_jq().before(cur_element_container_jq);
								cur_sibling_event_manager_mouse_over.get_element_container_jq().before(_self_clone_element_container_jq);

							} else {

								// TODO
								// action item의 형제 관계를 바꿉니다. 
								// 같은 row의 모든 형제 관계를 변경해줘야 합니다.
								for (var idx_column = 0; idx_column < action_table_obj.get_children_cnt(); idx_column++) {

									var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
									if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
										console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
										return;
									}

									// 여기서 특정 row idx의 action item을 이동시킵니다.
									var target_moving_action_item_obj = cur_column_child_action_list_obj.get_child(cur_action_item_obj_idx);

									console.log("2222");

									// 옮길 특정 row의 앞뒤의 엘리먼트 참조를 가져와 순서를 변경해줍니다.
									target_moving_action_item_obj.dive_into_indixes(
										// idx_before_action_item_obj
										idx_cur_sibling_action_item_obj_mouse_over
										// idx_after_action_item_obj
										, idx_cur_sibling_action_item_obj_mouse_over_after
									);

								}

								// event manager의 형제 관계를 다시 세팅합니다.
								// console.log("이제 선택한 영역의 아래로 엘리먼트를 추가합니다. / ",cur_sibling_element_set_mouse_over.get_meta_info().get_list_row_text());
								cur_sibling_element_set_mouse_over.get_event_manager().get_element_container_jq().after(cur_element_container_jq);
								cur_sibling_element_set_mouse_over.get_event_manager().get_element_container_jq().after(_self_clone_element_container_jq);

							}

							// 모든 엘리먼트 셋을 view mode로 전환합니다.
							for (var idx_row = 0; idx_row < cur_table_action_item_obj_list.length; idx_row++) {
								var cur_table_action_item_obj = cur_table_action_item_obj_list[idx_row];

								var cur_event_manager = cur_table_action_item_obj.get_event_manager();
								if(cur_event_manager == undefined) {
									console.log("!Error! / clone_element_container_jq.click / cur_event_manager == undefined");
									return;
								}

								cur_event_manager.show_view_mode();
							}

						}

						// 부모를 옮긴다음, 저장해둔 절대좌표로 설정해줍니다.
						_self_clone_element_container_jq.offset(prev_offset);

						// 엘리먼트 착륙 이후의 델리게이트 객체를 가져옵니다. 충돌 객체가 없는 경우, null을 넘겨 줍니다.
						var cur_delegate_callback_after_landing_element = null;
						if(cur_sibling_element_set_mouse_over != undefined){
							cur_delegate_callback_after_landing_element = 
							cur_sibling_element_set_mouse_over.get_event_manager().get_delegate_callback_after_landing_element();
						}

						jsm.land_element(
							// cur_src_jq
							cur_element_container_jq
							// cur_clone_jq
							, _self_clone_element_container_jq
							// eject_btn_jq
							, event_manager_on_mousemove.get_btn_eject_element_jq()
							// cur_mousemove_callback_set
							, cur_mousemove_callback_set
							// cur_element_set_on_mouse_over
							, cur_sibling_element_set_mouse_over
							// delegate_on_completed
							, cur_delegate_callback_after_landing_element
							// delegate_on_completed_param_event_manager
							, cur_event_manager
						); // animation end

					}); // click event end

				}, this), cur_event_manager); // end mouse move call back
			}, this));	// jump spot delegate ends


			// 엘리먼트가 사용자 수정에 의해 새로운 위치로 이동 완료한 뒤에 호출되는 콜백 델리게이트
			event_manager_table_column_text.set_delegate_callback_after_landing_element(_obj.get_delegate(function(cur_event_manager_on_mouse_over){

				// Save n Reload
				if(cur_event_manager_on_mouse_over != undefined){
					cur_event_manager_on_mouse_over.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_NONE, _obj.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER);	
				}

			}, this)); // end set_delegate_callback_after_landing_element
		}		

	}
	// @ public
	// @ Desc : 화면에 테이블을 추가합니다. 테이블을 구성하는 정보는 모두 action table 객체에서 가져옵니다.
	,add_editable_table_from_action_table:function(parent_jq, action_table_obj, delegate_on_event){

		// REMOVE ME - old params
		// received_editable_table_meta_info_obj

		if(parent_jq == null){
			console.log("!Error! / add_editable_table_from_action_table / parent_jq == null");
			return null;
		}
		if(parent_jq.length == 0){
			console.log("!Error! / add_editable_table_from_action_table / parent_jq.length == 0");
			return null;
		}
		if(_action.is_not_valid_action_obj(action_table_obj)){
			console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(action_table_obj)");
			return null;
		}
		if(_obj.isNotValidDelegate(delegate_on_event)){
			console.log("!Error! / add_editable_table_from_action_table / _obj.isNotValidDelegate(delegate_on_event)");
			return null;
		}

		// @ optional 	-	delegate_show_combo_box_element 
		// 수정시에 콤보박스로 노출하는 리스트를 보여줍니다. 검색 가능.

		// 수정 가능한 테이블을 만듭니다.
		// margin-top: 15px;
		// margin-bottom: 5px;

		// 1. 테이블을 작성하기 위한 테이블 구조.
		// 1-1. 테이블의 타이틀
		// 1-2. 테이블의 column obj 작성

		// 2. 테이블 그리기.
		// 2-1. table tag
		var table_title = action_table_obj.get_action_name();
		if(_v.is_not_valid_str(table_title)) {
			console.log("!Error! / add_editable_table_from_action_table / _v.is_not_valid_str(table_title)");
			return;
		}
		var table_id = _html.get_id_auto_increase(table_title);
		var cur_element_collection_set = _action.make_element_collection_set(table_id);
		var table_tag = ""
		+ "<div class=\"panel panel-default\" id=\"<_v>\" style=\"margin-top:10px;margin-bottom:6px;\">".replace(/\<_v\>/gi, table_id)
			+ "<div class=\"panel-heading\" style=\"text-align:center;\">"
				+ "<strong><span id=\"table_title\" input_id=\"<id>\"><_v></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>"
					.replace(/\<_v\>/gi, table_title)
					.replace(/\<id\>/gi, table_id)
				// buttons / Common
				// + "<span id=\"btn_edit\" class=\"glyphicon glyphicon-pencil\" style=\"display:none;\">&nbsp;</span>"

				+ "<div id=\"btn_remove\" style=\"height:20px;width:20px;float:right;height:32px;width:32px;top:-6px;position:relative;border-radius:4px;margin-left:4px;padding-left:10px;display:none;\">"
					+ "<span id=\"btn_remove\" class=\"glyphicon glyphicon-remove\">&nbsp;</span>"
				+ "</div>"

				+ "<div id=\"btn_add\" style=\"float:right;height:32px;width:32px;top:-6px;position:relative;margin-left:4px;border-radius:4px;display:none;\">"
					+ "<span id=\"btn_add\" class=\"glyphicon glyphicon-plus\" style=\"display:none;\">&nbsp;</span>"
				+ "</div>"
					
				+ "<div id=\"btn_collection_eject\" style=\"float:right;height:32px;width:32px;top:-6px;position:relative;border-radius:4px;display:none;\">"
					+ "<span id=\"btn_collection_eject\" class=\"glyphicon glyphicon-move\" style=\"float:right;\"></span>"
				+ "</div>"

			+ "</div>"
			+ "<table class=\"table\">"
				+ "<tbody id=\"today_role_table\">"
		;

		// draw common input group row

		var colspan_cnt = action_table_obj.get_children_cnt();
		if(_v.is_not_unsigned_number(colspan_cnt)) {
			console.log("!Error! / add_editable_table_from_action_table / _v.is_not_unsigned_number(colspan_cnt)");
			return;
		}
		table_tag += ""
		+ "<tr id=\"input_group_column_text\" style=\"display:none;\">"
			+ "<td style=\"background-color:#FFFFFF;padding-left:0px;\" colspan=\"<colspan_cnt>\">".replace(/\<colspan_cnt\>/gi, colspan_cnt)

				// common input.
				+ "<div id=\"input_group_column_text\" class=\"form-group col-lg-9\" style=\"margin:0px;padding-left:7px;padding-right:7px;width:60%;float:left;\">"
					+ "<input id=\"common_input\" class=\"form-control\" placeholder=\"Enter Search Keyword\">"
				+ "</div>"

				// time input / 테이블 형태를 위한 태그(다른 엘리먼트 형태에서의 지원여부는 확인되지 않음.)
				+ "<div id=\"input_group_time\" class=\"form-group col-lg-8\" style=\"margin-top:0px;margin-bottom:0px;padding-left:7px;padding-right:7px;display:none;\">"
					+ "<div id=\"input_time_container\" class=\"col-lg-2\" style=\"padding:0px;\">"
						+ "<input type=\"text\" id=\"input_time\" class=\"form-control col-lg-4\" value=\"\" prev_value=\"\" tossed_value=\"\">"
					+ "</div>"

					// time btn groups
					+ "<div class=\"btn-group\" style=\"padding-left:8px;\">"
						+ "<button id=\"btn_plus\" class=\"btn btn-default\" type=\"button\">"
							+ "&nbsp;"
							+ "<span class=\"glyphicon glyphicon-plus\"></span>"
							+ "&nbsp;"
						+ "</button>"
						+ "<button id=\"btn_minus\" class=\"btn btn-default\" type=\"button\">"
							+ "&nbsp;"
							+ "<span class=\"glyphicon glyphicon-minus\"></span>"
							+ "&nbsp;"
						+ "</button>"
						+ "<button id=\"btn_ok_time\" class=\"btn btn-default\" type=\"button\">"
							+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "OK" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ "</button>"
						+ "<button id=\"btn_cancel_time\" class=\"btn btn-default\" type=\"button\">"
							+ "CANCEL"
						+ "</button>"
					+ "</div>"	
					
				+ "</div>"

				// buttons
				+ "<button id=\"btn_search\" class=\"btn btn-default\" style=\"padding-left:20px;padding-right:20px;margin-right:8px;float:left;\">&nbsp;<span class=\"glyphicon glyphicon-search\"></span>&nbsp;</button>"
				+ "<button id=\"btn_ok\" class=\"btn btn-default\" style=\"padding-left:20px;padding-right:20px;margin-right:8px;float:left;\">&nbsp;<span class=\"glyphicon glyphicon-ok\"></span>&nbsp;</button>"
				+ "<button id=\"btn_cancel\" class=\"btn btn-default\" style=\"padding-left:20px;padding-right:20px;margin-right:8px;float:left;\">&nbsp;<span class=\"glyphicon glyphicon-remove\"></span>&nbsp;</button>"

				// search output list
				+ "<div id=\"search_output_list\" class=\"list-group col-lg-9\" style=\"display:none;margin:8px 7px 0px;float:left;width:100%\">"
					// + "<a href=\"#\" class=\"list-group-item active\" style=\"padding-top:6px;padding-bottom:6px;font-size:14px;\">Cras justo odio</a>"
				+ "</div>"

				// searchable combo box list tags.
				+ "<div class=\"col-lg-9\" style=\"padding-left:7px;padding-right:7px;\">"
					+ "<select class=\"form-control\" name=\"list_search_tab\" id=\"list_search_tab\">"
						+ "<option value=\"48\">180th&nbsp;&nbsp;&nbsp;&nbsp;2014-09-18&nbsp;&nbsp;&nbsp;&nbsp;No Theme</option>"
						+ "<option value=\"47\">179th&nbsp;&nbsp;&nbsp;&nbsp;2014-09-11&nbsp;&nbsp;&nbsp;&nbsp;Chooseok, Korean Thanksgiving ...</option>"
					+ "</select>"
				+ "</div>"

			+ "</td>"
		+ "</tr>"
		;

		var is_fixed_row = false;
		var cur_table_action_item_obj_list = action_table_obj.get_table_action_item_obj_list();
		var column_width = parseInt(100 / colspan_cnt);
		var rowspan_cnt = action_table_obj.get_child(0).get_children_cnt();
		if(_v.is_not_unsigned_number(rowspan_cnt)) {
			console.log("!Error! / add_editable_table_from_action_table / _v.is_not_unsigned_number(rowspan_cnt)");
			return;
		}

		// 1개의 row가 테이블에 추가됩니다.
		for (var idx_row = 0; idx_row < rowspan_cnt; idx_row++) {

			var is_last_row = ((rowspan_cnt.length - 1) == idx_row)?true:false;
			var is_first_row = (0 == idx_row)?true:false;

			table_tag += ""
			+ "<tr id=\"column_text_container\" is_first=\"<is_first>\" is_last=\"<is_last>\" style=\"<style>\">"
				.replace(/\<is_first\>/gi, is_first_row)
				.replace(/\<is_last\>/gi, is_last_row)
				.replace(/\<style\>/gi, cur_style)
			;

			// field 별로 순회하면서 column - field를 그려줍니다.
			
			for (var idx_column = 0; idx_column < colspan_cnt; idx_column++) {

				var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
				if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
					console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
					return;
				}

				var cur_column_child_action_list_field_child_action_item_obj = cur_column_child_action_list_obj.get_child(idx_row);
				if(_action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)) {
					console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)");
					return;
				}
				var cur_action_name = cur_column_child_action_list_field_child_action_item_obj.get_action_name();

				var field_id = this.get_table_field_id(table_id, idx_row, idx_column);
				table_tag += ""
				+ "<td id=\"column_text_container\" field_id=\"<field_id>\" style=\"background-color:#FFFFFF;\" width=\"<column_width>%\" is_first=\"<is_first>\" is_last=\"<is_last>\">"
					.replace(/\<column_width\>/gi, column_width)
					.replace(/\<field_id\>/gi, field_id)
					.replace(/\<is_first\>/gi, is_first_row)
					.replace(/\<is_last\>/gi, is_last_row)
				;

				// shy mode 적용.
				var cur_style = "";
				if(cur_column_child_action_list_field_child_action_item_obj.get_action_is_shy()) {
					cur_style = "display:none;";
				}

				if(cur_column_child_action_list_field_child_action_item_obj.is_item_title_only_fixed()){
					table_tag += ""
					+ "<strong><span id=\"column_text\" tossed_value=\"<tossed_value>\" input_id=\"<id>\"><_v></span>&nbsp;&nbsp;&nbsp;&nbsp;</strong>"
					.replace(/\<id\>/gi, _html.get_id_auto_increase(cur_action_name))
					.replace(/\<tossed_value\>/gi, cur_action_name)
					.replace(/\<_v\>/gi, _html.getSafeHTMLInline(cur_action_name))
					;
				} else {
					table_tag += ""
					+ "<span id=\"column_text\" tossed_value=\"<tossed_value>\" input_id=\"<id>\"><_v></span>&nbsp;&nbsp;&nbsp;&nbsp;"
					.replace(/\<id\>/gi, _html.get_id_auto_increase(cur_action_name))
					.replace(/\<tossed_value\>/gi, cur_action_name)
					.replace(/\<_v\>/gi, _html.getSafeHTMLInline(cur_action_name))
					;
				}

				// field cell control buttons.
				table_tag += ""

					+ "<div id=\"btn_eject\" style=\"float:right;height:32px;width:32px;top:-5px;position:relative;border-radius:4px;display:none;margin-bottom:-10px;margin-left:4px;margin-right:-5px;\">"
						+ "<span id=\"btn_eject\" class=\"glyphicon glyphicon-move\" style=\"position:absolute;top:9px;left:8px;\"></span>"
					+ "</div>"

					+ "<div id=\"btn_remove\" style=\"height:20px;width:20px;float:right;height:32px;width:32px;top:-5px;position:relative;border-radius:4px;margin-left:4px;padding-left:10px;display:none;margin-bottom:-10px;\">"
						+ "<span id=\"btn_remove\" class=\"glyphicon glyphicon-remove\" style=\"position:absolute;top:9px;left:8px;\">&nbsp;</span>"
					+ "</div>"

					+ "<div id=\"btn_add\" style=\"float:right;height:32px;width:32px;top:-5px;position:relative;margin-left:4px;border-radius:4px;display:none;margin-bottom:-10px;\">"
						+ "<span id=\"btn_add\" class=\"glyphicon glyphicon-plus\" style=\"position:absolute;top:9px;left:9px;\">&nbsp;</span>"
					+ "</div>"
						
				+ "</td>"
				;

			}

			table_tag += ""
			+ "</tr>"
			;

		}
		table_tag += ""
				+ "</tbody>"
			+ "</table>"
		+ "</div>"
		;
		parent_jq.append(table_tag);


		// 3. 이벤트 주기.
		// 3-1. mouseenter, mouseleave
		var cur_table_jq = parent_jq.children().last();
		var cur_table_title_set_jq = cur_table_jq.find("div.panel-heading");
		cur_element_collection_set.set_element_collection_container_jq(cur_table_jq);

		var cur_btn_collection_eject_jq = cur_table_title_set_jq.find("span#btn_collection_eject");
		cur_element_collection_set.ecs_set_btn_collection_eject_jq(cur_btn_collection_eject_jq);

		
		var cur_table_row_arr = cur_table_jq.find("tr#column_text_container");
		for (var idx_row = 0; idx_row < cur_table_row_arr.length; idx_row++) {

			var table_row_element = cur_table_row_arr[idx_row];
			var table_row_element_jq = $(table_row_element);
			this.set_event_table_row_field_element(table_row_element_jq, action_table_obj, idx_row, cur_element_collection_set, delegate_on_event);

			// REMOVE ME
			/*
			
			var table_row_column_text_jq_arr = table_row_element_jq.find("td#column_text_container");

			var event_manager_table_column_arr = [];
			var before_event_manager = null;
			for (var idx_column = 0; idx_column < table_row_column_text_jq_arr.length; idx_column++) {

				var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
				if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
					console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
					return;
				}

				var cur_column_child_action_list_field_child_action_item_obj = cur_column_child_action_list_obj.get_child(idx_row);
				if(_action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)) {
					console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_item_obj(cur_column_child_action_list_field_child_action_item_obj)");
					return;
				}

				var table_row_column_text_element = table_row_column_text_jq_arr[idx_column];
				var table_row_column_text_element_jq = $(table_row_column_text_element);

				var event_manager_id_table_column = this.get_table_field_id(table_id, idx_row, idx_column);

				var event_manager_table_column_text = 
				_action.make_element_event_manager(
					// event_manager_id
					event_manager_id_table_column
					// element_jq
					, table_row_column_text_element_jq
					// action_item_obj
					, cur_column_child_action_list_field_child_action_item_obj
					// delegate_set_event_manager_prop
					, delegate_set_event_manager_prop_on_table_column
				);

				// 테이블 필드를 입력모드로 바꾸었을 때, 입력 그룹의 위치를 클릭한 리스트 열로 변경하는 델리게이트 설정 
				event_manager_table_column_text.set_delegte_move_title_input_group_jq(_obj.get_delegate(function(cur_element_jq, cur_element_container_jq, cur_title_input_group_jq){

					// 1. 현재 열에 저장된 텍스트를 가져옵니다.
					var cur_title_jq = cur_element_container_jq.find("span#title");
					var cur_title = cur_title_jq.html();

					// 2. 테이블의 열은 부모 레벨에 있으므로 현재 선택한 엘리먼트의 부모(tr) 참조를 가져옵니다.
					var cur_parent_tr_element_jq = cur_element_jq.parent();

					// 3. 사용자가 선택한 열의 위치에 입력 그룹 폼 열을 위치시킵니다.
					cur_parent_tr_element_jq.after(cur_title_input_group_jq);

					// 4. 위치에 따라 INPUT GROUP의 테두리 모양을 변경합니다.
					var cur_idx = cur_element_jq.attr("idx");
					var is_first = (cur_element_jq.attr("is_first") == "true");
					var is_last = (cur_element_jq.attr("is_last") == "true");

					if(is_first && is_last){
						_obj.set_list_single_row_round(cur_title_input_group_jq);
					} else if(is_first){
						_obj.set_list_first_row_round(cur_title_input_group_jq);
					} else if(is_last){
						_obj.set_list_last_row_round(cur_title_input_group_jq);
					}

				}, this));


				// REMOVE ME
				// cur_table_row_column_meta_info_arr[inner_idx].set_event_manager(event_manager_table_column_text);

				// 이벤트 매니저의 전, 후의 형제 관계를 저장합니다.
				if(before_event_manager != null){
					before_event_manager.set_after_sibling_event_manager(event_manager_table_column_text);	
					event_manager_table_column_text.set_before_sibling_event_manager(before_event_manager);
				}
				before_event_manager = event_manager_table_column_text;

				// REMOVE ME
				// event manager + element meta info => element set
				// var cur_table_element_set = _obj.get_element_set(element_meta_info, event_manager_table_column_text);
				// event_manager_table_column_text.set_element_set(cur_table_element_set);

				var cur_element_set = _action.make_element_set(cur_column_child_action_list_field_child_action_item_obj, event_manager_table_column_text);
				if(cur_element_set == undefined) {
					console.log("!Error! / add_editable_table_from_action_table / cur_element_set == undefined");
					return;
				}

				// element set + element set + ... => element collection set
				cur_element_collection_set.push_element_set(cur_element_set);

				// jump spot
				// set eject event
				event_manager_table_column_text.set_delegate_btn_eject_click(_obj.get_delegate(function(event_click, cur_event_manager){

					var cur_action_item_obj = cur_event_manager.get_action_item_obj();
					if(_action.is_not_valid_action_item_obj(cur_action_item_obj)) {
						console.log("!Error! / set_delegate_btn_eject_click / _action.is_not_valid_action_item_obj(cur_action_item_obj)");
						return;
					}

					var jsm = cur_event_manager.get_element_set().get_element_collection_set().jump_spot_manager;

					// 클릭시의 델리게이트 정의
					// @ 기본 동작
					// 이벤트 전파를 막습니다.
					event_click.stopPropagation();
					// 다른 객체들의 이벤트를 받지 않도록 lock를 설정.
					var cur_event_hierarchy_manager = _action.get_event_hierarchy_manager();
					cur_event_hierarchy_manager.lock();

					// 포커싱 모드로 바꿈.
					cur_event_manager.show_focusing_mode();
					var cur_element_container_jq = cur_event_manager.get_element_container_jq();

					// @ element collection settings
					var event_click_offset = {top:event_click.pageY,left:event_click.pageX};

					// 복사 대상 row의 너비를 가져옵니다.
					// 클론을 만들기 전에 현재 각 column field의 너비를 강제적으로 제어해야 함.
					var cur_element_jq = cur_event_manager.get_element_jq();
					if(cur_element_jq == undefined) {
						console.log("!Error! / set_delegate_btn_eject_click / cur_element_jq == undefined");
						return;
					}
					var cur_parent_row_jq = cur_element_jq.parent();
					console.log("XXX / cur_parent_row_jq :: ",cur_parent_row_jq);


					// 사용자가 선택한 엘리먼트가 포함된 table row가 떠오릅니다.
					var clone_element_container_jq = jsm.boost_clone_element_jq(cur_element_container_jq, event_click_offset);

					// set round
					_obj.set_list_single_row_round(clone_element_container_jq, _obj.LIST_ROW_RADIUS_NORMAL);
					var clone_element_offset = clone_element_container_jq.offset();

					var cur_mousemove_callback_set =
					cur_event_hierarchy_manager.add_mousemove_callback_set(_obj.get_delegate(function(mousemove_event, event_manager_on_mousemove){

						// 사용자가 선택한 윈도우의 이동
				        var cur_top = mousemove_event.pageY - jsm.gap;
				        var cur_left = mousemove_event.pageX - jsm.gap;

						clone_element_container_jq.offset({top:cur_top,left:cur_left});

						// 리스트 - 자신의 위, 아래의 형제 엘리먼트에 직접 검사
						// 테이블 - 자신이 속한 열의 위, 아래의 열에 검사

						console.log("HERE / add_mousemove_callback_set / mousemove_event :: ",mousemove_event);
						console.log("HERE / add_mousemove_callback_set / cur_event_manager :: ",cur_event_manager);

						// 사용자의 마우스 이동에 mouse over시 검사해서 over 이면 focusing 모드로 보여줍니다.
						// 자신의 테이블 열의 모든 객체들을 가져옵니다.
						cur_event_manager.get_element_set().get_element_collection_set().get_mouse_over_element_container(mousemove_event, cur_event_manager);

						// 움직이는 열을 클릭하면 충돌 검사를 통해 선택된 열 위 또는 아래로 붙임.
						clone_element_container_jq.off();
						clone_element_container_jq.click(function(e){

							// 테이블의 열 배열을 가져와야 한다.

							// REMOVE ME
							// var cur_element_json = cur_event_manager.get_element_meta_info().get_element_json();
							// var cur_all_vertical_ref_arr = cur_element_json.get_all_vertical_ref_arr(false, false);

							var cur_sibling_element_set_mouse_over = null;
							var mouse_over_checksum = null;

							cur_table_action_item_obj_list

							for (var idx_row = 0; idx_row < cur_table_action_item_obj_list.length; idx_row++) {
								var cur_table_action_item_obj = cur_table_action_item_obj_list[idx_row];
								if(_action.is_not_valid_action_item_obj(cur_table_action_item_obj)) {
									console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_item_obj(cur_table_action_item_obj)");
									return;
								}

								var cur_event_manager = cur_table_action_item_obj.get_event_manager();
								if(cur_event_manager == undefined) {
									console.log("!Error! / clone_element_container_jq.click / cur_event_manager == undefined");
									return;
								}

								var cur_element_set = cur_event_manager.get_element_set();
								if(cur_element_set == undefined) {
									console.log("!Error! / clone_element_container_jq.click / cur_element_set == undefined");
									return;
								}

								// 충돌 검사를 진행한다.
								mouse_over_checksum = jsm.show_mouse_over_element_container_set_top_n_bottom(mousemove_event, cur_element_set);
								if(mouse_over_checksum.has_changed && mouse_over_checksum.is_hover_top){
									cur_sibling_element_set_mouse_over = cur_element_set;
									break;
								} else if(mouse_over_checksum.has_changed && mouse_over_checksum.is_hover_bottom){
									cur_sibling_element_set_mouse_over = cur_element_set;
									break;
								} // end if
							}

							// cur_action_item_obj
							// 옮겨갈 테이블 element container set의 위, 아래 위치를 판단, 참조를 가져옵니다.
							// 자신의 위, 아래는 불가.

							// 이제 선택한 영역의 아래로 엘리먼트를 추가합니다.
							// 부모를 옮기기 전의 절대좌표를 얻습니다.
							var _self_clone_element_container_jq = $(this);
							var prev_offset = _self_clone_element_container_jq.offset();

							if(cur_sibling_element_set_mouse_over != undefined){

								var cur_sibling_event_manager_mouse_over = cur_sibling_element_set_mouse_over.get_event_manager();
								if(cur_sibling_event_manager_mouse_over != undefined) {
									console.log("!Error! / clone_element_container_jq.click / cur_sibling_event_manager_mouse_over != undefined");
									return;
								}

								var cur_sibling_action_item_obj_mouse_over = cur_sibling_event_manager_mouse_over.get_action_item_obj();
								var idx_cur_sibling_action_item_obj_mouse_over = cur_sibling_action_item_obj_mouse_over.get_idx();

								var cur_sibling_action_item_obj_mouse_over_before = cur_sibling_action_item_obj_mouse_over.get_sibling_action_obj_before();
								var idx_cur_sibling_action_item_obj_mouse_over_before = -1;
								if(_action.is_valid_action_item_obj(cur_sibling_action_item_obj_mouse_over_before)) {
									idx_cur_sibling_action_item_obj_mouse_over_before = cur_sibling_action_item_obj_mouse_over.get_idx();
								}

								var cur_sibling_action_item_obj_mouse_over_after = cur_sibling_action_item_obj_mouse_over.get_sibling_action_obj_after();
								var idx_cur_sibling_action_item_obj_mouse_over_after = -1;
								if(_action.is_valid_action_item_obj(cur_sibling_action_item_obj_mouse_over_after)) {
									idx_cur_sibling_action_item_obj_mouse_over_after = cur_sibling_action_item_obj_mouse_over.get_idx();
								}


								// view mode로 전환합니다.
								cur_sibling_event_manager_mouse_over.show_view_mode();

								var cur_action_item_obj_idx = cur_action_item_obj.get_idx();
								if(_v.is_not_unsigned_number(cur_action_item_obj_idx)) {
									console.log("!Error! / clone_element_container_jq.click / _v.is_not_unsigned_number(cur_action_item_obj_idx)");
									return;
								}
								if(mouse_over_checksum.is_hover_top){

									// event manager의 형제 관계를 다시 세팅합니다.
									// console.log("이제 선택한 영역의 위로 엘리먼트를 추가합니다. / ",cur_sibling_element_set_mouse_over.get_meta_info().get_list_row_text());
									cur_sibling_event_manager_mouse_over.get_element_container_jq().before(cur_element_container_jq);
									cur_sibling_event_manager_mouse_over.get_element_container_jq().before(_self_clone_element_container_jq);

									// REMOVE ME									
									// var new_ref_down = cur_sibling_element_set_mouse_over.get_meta_info().get_element_json();
									// var new_ref_up = new_ref_down.get_ref_up();
									// cur_element_json.set_relation_between_rows(new_ref_up, new_ref_down);

									// TODO
									// action item의 형제 관계를 바꿉니다. 
									// 같은 row의 모든 형제 관계를 변경해줘야 합니다.
									for (var idx_column = 0; idx_column < colspan_cnt; idx_column++) {

										var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
										if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
											console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
											return;
										}

										// 여기서 옮길 특정 row idx의 action item을 가져옵니다.
										var target_moving_action_item_obj = cur_column_child_action_list_obj.get_child(cur_action_item_obj_idx);
										// 옮길 특정 row의 앞뒤의 엘리먼트 참조를 가져와 순서를 변경해줍니다.
										target_moving_action_item_obj.dive_into_indixes(
											// idx_before_action_item_obj
											idx_cur_sibling_action_item_obj_mouse_over_before
											// idx_after_action_item_obj
											, idx_cur_sibling_action_item_obj_mouse_over
										);
									}

								} else {

									// event manager의 형제 관계를 다시 세팅합니다.
									// console.log("이제 선택한 영역의 아래로 엘리먼트를 추가합니다. / ",cur_sibling_element_set_mouse_over.get_meta_info().get_list_row_text());
									cur_sibling_element_set_mouse_over.get_event_manager().get_element_container_jq().after(cur_element_container_jq);
									cur_sibling_element_set_mouse_over.get_event_manager().get_element_container_jq().after(_self_clone_element_container_jq);

									// REMOVE ME
									// var new_ref_up = cur_sibling_element_set_mouse_over.get_meta_info().get_element_json();
									// var new_ref_down = new_ref_up.get_ref_down();
									// cur_element_json.set_relation_between_rows(new_ref_up, new_ref_down);

									// TODO
									// action item의 형제 관계를 바꿉니다. 
									// 같은 row의 모든 형제 관계를 변경해줘야 합니다.
									for (var idx_column = 0; idx_column < colspan_cnt; idx_column++) {

										var cur_column_child_action_list_obj = action_table_obj.get_child(idx_column);
										if(_action.is_not_valid_action_obj(cur_column_child_action_list_obj)) {
											console.log("!Error! / add_editable_table_from_action_table / _action.is_not_valid_action_obj(cur_column_child_action_list_obj)");
											return;
										}

										// 여기서 특정 row idx의 action item을 이동시킵니다.
										var target_moving_action_item_obj = cur_column_child_action_list_obj.get_child(cur_action_item_obj_idx);
										// 옮길 특정 row의 앞뒤의 엘리먼트 참조를 가져와 순서를 변경해줍니다.
										target_moving_action_item_obj.dive_into_indixes(
											// idx_before_action_item_obj
											idx_cur_sibling_action_item_obj_mouse_over
											// idx_after_action_item_obj
											, idx_cur_sibling_action_item_obj_mouse_over_after
										);

									}

								}

								// 모든 엘리먼트 셋을 view mode로 전환합니다.
								for (var idx_row = 0; idx_row < cur_table_action_item_obj_list.length; idx_row++) {
									var cur_table_action_item_obj = cur_table_action_item_obj_list[idx_row];

									var cur_event_manager = cur_table_action_item_obj.get_event_manager();
									if(cur_event_manager == undefined) {
										console.log("!Error! / clone_element_container_jq.click / cur_event_manager == undefined");
										return;
									}

									cur_event_manager.show_view_mode();
								}

							}

							// 부모를 옮긴다음, 저장해둔 절대좌표로 설정해줍니다.
							_self_clone_element_container_jq.offset(prev_offset);

							// 엘리먼트 착륙 이후의 델리게이트 객체를 가져옵니다. 충돌 객체가 없는 경우, null을 넘겨 줍니다.
							var cur_delegate_callback_after_landing_element = null;
							if(cur_sibling_element_set_mouse_over != undefined){
								cur_delegate_callback_after_landing_element = 
								cur_sibling_element_set_mouse_over.get_event_manager().get_delegate_callback_after_landing_element();
							}

							jsm.land_element(
								// cur_src_jq
								cur_element_container_jq
								// cur_clone_jq
								, _self_clone_element_container_jq
								// eject_btn_jq
								, event_manager_on_mousemove.get_btn_eject_element_jq()
								// cur_mousemove_callback_set
								, cur_mousemove_callback_set
								// cur_element_set_on_mouse_over
								, cur_sibling_element_set_mouse_over
								// delegate_on_completed
								, cur_delegate_callback_after_landing_element
								// delegate_on_completed_param_event_manager
								, cur_event_manager
							); // animation end

						}); // click event end

					}, this), cur_event_manager); // end mouse move call back
				}, this));	// jump spot delegate ends


				// 엘리먼트가 사용자 수정에 의해 새로운 위치로 이동 완료한 뒤에 호출되는 콜백 델리게이트
				event_manager_table_column_text.set_delegate_callback_after_landing_element(_obj.get_delegate(function(cur_event_manager_on_mouse_over){

					// Save n Reload
					if(cur_event_manager_on_mouse_over != undefined){
						cur_event_manager_on_mouse_over.call_delegate_save_n_reload(_obj.ELEMENT_TYPE_NONE, _obj.EVENT_TYPE_UPDATE_TABLE_ROW_ORDER);	
					}

				}, this)); // end set_delegate_callback_after_landing_element
			}
			*/
		}

		return cur_element_collection_set;
	}

	// @ private
	// @ Desc : 테이블 컬럼 - 필드의 아이디를 가져옵니다.
	,get_table_field_id:function(table_id, column_idx, row_idx){
		return "table_" + table_id + "_column_" + column_idx + "_row_" + row_idx;
	}
}
















