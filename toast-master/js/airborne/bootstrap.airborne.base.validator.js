airborne.validator = {
	isValidStr:function(targetStr){
		if(targetStr==null){
			// console.log("airborne.validator.isValidStr / targetStr==null");
			return false;
		}
		if((typeof targetStr)!="string"){
			// console.log("airborne.validator.isValidStr / (typeof targetStr)!=\"string\" / targetStr : ",targetStr);
			return false;
		}
		if(targetStr.length == 0){
			// console.log("airborne.validator.isValidStr / targetStr.length == 0");
			return false;
		}
		if(targetStr==""){
			// console.log("airborne.validator.isValidStr / targetStr==\"\"");
			return false;
		}


		return true;
	}
	,is_valid_str:function(targetStr){
		return this.isValidStr(targetStr);
	}
	,isNotValidStr:function(targetStr){
		return !this.isValidStr(targetStr);
	}
	,is_not_valid_str:function(targetStr){
		return this.isNotValidStr(targetStr);
	}
	,isEmptyStr:function(targetStr){
		if(targetStr==null || targetStr.length == 0 || targetStr=="" ){
			return true;
		}
		return false;
	}
	,isNumber:function(targetStr){
		return $.isNumeric(targetStr);
	}
	,isNotNumber:function(targetStr){
		return !this.isNumber(targetStr); 
	}
	,isUnsignedNumber:function(targetStr){
		return $.isNumeric(targetStr) && targetStr > 0;
	}
	,isNotUnsignedNumber:function(targetStr){
		return !this.isUnsignedNumber(targetStr);
	}
	,isNumberStr:function(targetStr){
		return this.isValidStr(targetStr) && this.isNumber(targetStr);
	}
	,isNotNumberStr:function(targetStr){
		return !this.isNumberStr(targetStr); 
	}
	,is_valid_array:function(targetArr){
		return this.isValidArray(targetArr);
	}
	,isValidArray:function(targetArr){
		if(targetArr != null && jQuery.type( targetArr ) === "array" && targetArr.length > 0){
			return true;
		}
		return false;
	}
	,is_not_valid_array:function(targetArr){
		return this.isNotValidArray(targetArr);	
	}
	,isNotValidArray:function(targetArr){
		return !this.isValidArray(targetArr);
	}
	,is_valid_json_str:function(targetStr){
		return this.isValidJSONStr(targetStr);
	}
	,isValidJSONStr:function(targetStr){
		return !this.isBrokenJSONStr(targetStr);
	}
	,is_not_valid_json_str:function(targetStr){
		return this.isNotValidJSONStr(targetStr);
	}
	,isNotValidJSONStr:function(targetStr){
		if(this.isNotValidStr(targetStr)) return true;		
		if(targetStr.indexOf("$")==0) return true;
	}
	,isNotValidBoolean:function(target){
		return !this.isValidBoolean(target);
	}
	,isValidBoolean:function(target){
		if(target == null || target == undefined) return false;
		if(target == true || target == false) return true;
		return false;
	}
	,is_jquery_obj:function(target_obj){
		return this.isJQueryObj(target_obj);
	}
	,isJQueryObj:function(target_obj){
		return (target_obj != null && target_obj.append != null && target_obj.length > 0);
	}
	,is_not_jquery_obj:function(target_obj){
		return this.isNotJQueryObj(target_obj);
	}
	,isNotJQueryObj:function(target_obj){
		return !this.isJQueryObj(target_obj);
	}
	,isValidInputStr:function(targetStr, conditions){

		if(conditions == null){
			console.log("!Error! / airborne.validator.isValidInputStr / isValidInputStr");
			return false;
		}

		// conditions
		// {key:key, isEmptyAllowed: false, min_len: 1, max_len: 20} 

		// TODO 문자 검사 조건에 html special 문자에 대한 검사 항목도 추가할 것.

		var key = conditions.key;
		var isEmptyAllowed = conditions.isEmptyAllowed; 
		var min_len = conditions.min_len;
		var max_len = conditions.max_len;

		if(isEmptyAllowed == true && targetStr == ""){
			return true;	
		}

		if(airborne.validator.isNotValidStr(targetStr)){
			alert(key + "(이)가 입력되지 않았습니다.");
			return false;	
		}else if(isEmptyAllowed == false && targetStr.length < min_len){
			alert(key + "(이)가 " + min_len + " 자보다 많아야 합니다.");
			return false;	
		}else if(isEmptyAllowed == false && max_len < targetStr.length){
			alert(key + "(이)가 " + max_len + " 자보다 적어야 합니다.");
			return false;	
		} 

		var unique_value_list = conditions.unique_value_list;
		if(airborne.validator.isValidArray(unique_value_list)){
			for(var idx=0;idx < unique_value_list.length;idx++){
				var unique_value = unique_value_list[idx];
				if(unique_value == targetStr){
					alert(key + "(이)가 중복됩니다.");
					return false;
				}
			}
		}

		return true;
	}
	,isValidInputDateStr:function(cur_time, conditions){
		// conditions
		// return {check_func:check_func, conditions:{date_format_type:date_format_type, start_time:start_time, end_time:end_time, referer_jq:referer_jq, key:key}};

		var key = conditions.key;
		var date_format_type = conditions.date_format_type; 
		var start_time = conditions.start_time;
		var end_time = conditions.end_time;
		var now_date = airborne.dates.getNow(date_format_type);

		var cur_date = airborne.dates.getFormattedDate(cur_time, date_format_type);
		var start_date = airborne.dates.getFormattedDate(start_time, date_format_type);
		var end_date = airborne.dates.getFormattedDate(end_time, date_format_type);

		if(airborne.validator.isNotValidStr(cur_time)){
			alert(key + "(이)가 입력되지 않았습니다.");
			conditions.referer_jq.val(now_date);
			return false;	
		}else if(!airborne.dates.isValidDate(cur_time, date_format_type)){
			alert(key + "을 날짜 포맷에 맞추세요.");
			conditions.referer_jq.val(now_date);
			return false;
		}else if(cur_date < start_date){
			alert(start_time + "보다 늦은 시간으로 입력해주세요.");
			conditions.referer_jq.val(start_time);
			return false;
		}else if(end_date < cur_date){
			alert(end_time + "보다 빠른 시간으로 입력해주세요.");
			conditions.referer_jq.val(end_time);
			return false;
		}

		return true;
	}
}