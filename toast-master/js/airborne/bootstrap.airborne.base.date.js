airborne.dates = {
	DATE_TYPE_YYYY_MM_DD:1	/*2012-12-11*/
	,DATE_TYPE_HH_MM:2	/*01:02*/
	,DATE_TYPE_MM_SS:3	/*01:02*/
	,DATE_TYPE_HH_MM_ROUND:4 // TODO /*01:02 --> 01:00 // 01:52 --> 02:00 // 01:00,01:15,01:30,01:45,02:00 으로 반환*/
	,DATE_TYPE_YYYYMMDDHHMMSS:5	/*20121211010203*/
	,DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS:6	/* 2012년 12월 11일 01:02:03 */
	,isNotValidDateFormat:function(date_format_type){
		return !this.isValidDateFormat(date_format_type);
	}
	,isValidDateFormat:function(date_format_type){
		if(	date_format_type == this.DATE_TYPE_YYYY_MM_DD || 
			date_format_type == this.DATE_TYPE_HH_MM || 
			date_format_type == this.DATE_TYPE_MM_SS || 
			date_format_type == this.DATE_TYPE_YYYYMMDDHHMMSS
		){
			return true;
		}
		return false;
	}
	,isNotValidDate:function(target_obj, date_type){
		return !this.isValidDate(target_obj, date_type);
	}
	,isValidDate:function(target_obj, date_type){
		if(airborne.validator.isNotValidStr(target_obj)) {
			console.log("!Error! / airborne.dates / isValidDate / airborne.validator.isNotValidStr(target_obj)");
			return false;
		}

		if(this.isNotValidDateFormat(date_type)) {
			console.log("!Error! / airborne.dates / isValidDate / this.isNotValidDateFormat(date_type)");
			return false;
		}

		var cur_date = this.getFormattedDate(target_obj, date_type);
		return (cur_date == null)?false:true;
	}
	,isNotValidDateSimple:function(target_obj){
		return !this.isValidDateSimple(target_obj);
	}
	,isValidDateSimple:function(target_obj){
		if(airborne.validator.isNotValidStr(target_obj)) {
			console.log("!Error! / airborne.dates / isValidDateSimple / airborne.validator.isNotValidStr(target_obj)");
			return false;
		}

		var cur_type = this.getDateFormatType(target_obj);
		return (cur_type == null)?false:true;
	}
	,isFuture:function(date_str, date_type){

		if(this.isNotValidDateSimple(date_str)) {
			console.log("!Error! / airborne.dates / isFuture / this.isNotValidDateSimple(date_str)");
			return null;
		}		

		if(this.isNotValidDateFormat(date_type)) {
			console.log("!Error! / airborne.dates / isFuture / this.isNotValidDateFormat(date_type)");
			return null;
		}

		return !this.isExpired(date_str, date_type);
	}
	,isExpired:function(date_str, date_type){

		if(this.isNotValidDateSimple(date_str)) {
			console.log("!Error! / airborne.dates / isExpired / this.isNotValidDateSimple(date_str)");
			return null;
		}		

		if(this.isNotValidDateFormat(date_type)) {
			console.log("!Error! / airborne.dates / isExpired / this.isNotValidDateFormat(date_type)");
			return null;
		}

		var converted_start_date = airborne.dates.getFormattedTime(date_str, date_type);
		var converted_now_date = airborne.dates.getFormattedTime(airborne.dates.getNow(date_type), date_type);

		return (converted_start_date < converted_now_date)?true:false;
	}
	,is_not_valid_time_format_double_digit:function(time_str){	
		return !this.is_valid_time_format_double_digit(time_str);
	}
	// @ Public
	// @ Desc : 사용자가 입력한 시간이 다음과 같은 포맷인지 (00시 00분) 확인합니다.
	,is_valid_time_format_double_digit:function(time_str){
		var _v = airborne.validator;
		if(_v.isNotValidStr(time_str)) return false;

		// 17:11 의 포맷인지 확인합니다.
		var time_arr = time_str.split(":");
		if(	time_arr == null || 
			time_arr.length != 2 || 
			time_arr[0].length != 2 ||
			time_arr[1].length != 2
		){
			return false;
		}
		return true;
	}
	,getDateFormatType:function(date_str){

		if(airborne.validator.isNotValidStr(date_str)) {
			console.log("!Error! / airborne.dates / getDateFormatType / airborne.validator.isNotValidStr(date_str)");
			return null;
		}

		// airborne.dates.DATE_TYPE_YYYY_MM_DD	/	2014-02-11
		var date_arr = date_str.split("-");
		if(	date_arr != null && 
			date_arr.length == 3 && 
			date_arr[0].length==4 &&
			date_arr[1].length==2 &&
			date_arr[2].length==2 ){
			return airborne.dates.DATE_TYPE_YYYY_MM_DD;
		}

		// airborne.dates.DATE_TYPE_YYYYMMDDHHMMSS /	20140211020103
		if(	date_str.length == 14 && 
			date_str.slice(0,4).length==4 &&
			date_str.slice(4,6).length==2 &&
			date_str.slice(6,8).length==2 &&
			date_str.slice(8,10).length==2 &&
			date_str.slice(10,12).length==2 &&
			date_str.slice(12,14).length==2 ){
			return airborne.dates.DATE_TYPE_YYYYMMDDHHMMSS;
		}

		return null;
	}
	,is_valid_time_format_str:function(date_str, input_date_format_type){
		// wonder.jung
		var cur_date = this.getFormattedDate(date_str, input_date_format_type);
		return (cur_date!=null)?true:false;
	}
	,is_not_valid_time_format_str:function(date_str, input_date_format_type){
		return !this.is_valid_time_format_str(date_str, input_date_format_type);
	}
	,getFormattedDate:function(date_str, input_date_format_type){
		
		if(airborne.validator.isNotValidStr(date_str)) {
			console.log("!Error! / airborne.dates / getFormattedDate / airborne.validator.isNotValidStr(date_str)");
			return null;
		}
		
		//new Date(year, month, day, hours, minutes, seconds, milliseconds)
		if(input_date_format_type == this.DATE_TYPE_YYYY_MM_DD){

			var date_arr = date_str.split("-");
			if(	date_arr == null || 
				date_arr.length != 3 || 
				date_arr[0].length != 4 ||
				date_arr[1].length != 2 ||
				date_arr[2].length != 2
			){
				console.log("!Error! / airborne.dates / getFormattedDate / date_str is not this.DATE_TYPE_YYYY_MM_DD");
				return null;
			}
			
			// ['2012','03','04'] --> 2012
			var year = parseInt(date_arr[0]);
			
			// ['2012','03','04'] --> 3
			var month = parseInt(date_arr[1])-1;
			
			// ['2012','03','04'] --> 4
			var days = parseInt(date_arr[2]);

			return new Date(year, month, days, 0, 0, 0, 0);

		} else if(input_date_format_type == this.DATE_TYPE_YYYYMMDDHHMMSS){

			if(airborne.validator.isNotValidStr(date_str)) {
				console.log("!Error! / airborne.dates / getFormattedDate / airborne.validator.isNotValidStr(date_str)");
				return null;
			}

			if(date_str.length == 8){
				console.log("date_str.length == 8");
				return null;
			}

			var year = date_str.slice(0,4);
			var month = parseInt(date_str.slice(4,6))-1; // month starts with 0, january.d
			var day = date_str.slice(6,8);
			var hour = date_str.slice(8,10);
			var minute = date_str.slice(10,12);
			var second = date_str.slice(12,14);

			return new Date(year, month, day, hour, minute, second);

		} else if(input_date_format_type == this.DATE_TYPE_HH_MM){ // wdjung1

			// sample : "07:00"
			if(this.is_not_valid_time_format_double_digit(date_str)) return null;

			var time_arr = date_str.split(":");
			var hours = parseInt(time_arr[0]);
			if(hours < 0 || 23 < hours) return null;
			var minutes = parseInt(time_arr[1]);
			if(minutes < 0 || 59 < minutes) return null;

			var now_date = new Date();

			var cur_year = now_date.getFullYear();
			var cur_month = now_date.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = now_date.getDate();
			cur_days = this.getDoubleDigit(cur_days);

			var cur_hours = parseInt(time_arr[0]);
			var cur_minutes = parseInt(time_arr[1]);
			var cur_seconds = 0;

			return new Date(cur_year, cur_month, cur_days, cur_hours, cur_minutes, cur_seconds);

		} else if(input_date_format_type == this.DATE_TYPE_MM_SS){ // wdjung1

			// sample : "07:00"
			if(this.is_not_valid_time_format_double_digit(date_str)) return null;

			var time_arr = date_str.split(":");
			var minutes = parseInt(time_arr[0]);
			if(minutes < 0 || 59 < minutes) return null;
			var seconds = parseInt(time_arr[1]);
			if(seconds < 0 || 59 < seconds) return null;

			var now_date = new Date();

			var cur_year = now_date.getFullYear();
			var cur_month = now_date.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = now_date.getDate();
			cur_days = this.getDoubleDigit(cur_days);

			var cur_hours = now_date.getHours();
			var cur_minutes = parseInt(time_arr[0]);
			var cur_seconds = parseInt(time_arr[1]);

			return new Date(cur_year, cur_month, cur_days, cur_hours, cur_minutes, cur_seconds);
		}

		return null;
	}
	,getNow:function(date_type){

		var d = new Date();
		if(date_type == airborne.dates.DATE_TYPE_YYYY_MM_DD){
		
			var cur_year = d.getFullYear();
			var cur_month = d.getMonth() + 1;
			cur_month = (cur_month < 10)?"0"+cur_month:cur_month;
			var cur_days = d.getDate();
			cur_days = (cur_days < 10)?"0"+cur_days:cur_days;
			var today = cur_year + "-" + cur_month + "-" + cur_days;

			return today;

		} else if(date_type == airborne.dates.DATE_TYPE_HH_MM){

			var cur_hours = this.getDoubleDigit(d.getHours());
			var cur_minutes = this.getDoubleDigit(d.getMinutes());
			var cur_time = cur_hours + ":" + cur_minutes;

			return cur_time;

		} else if(date_type == airborne.dates.DATE_TYPE_YYYYMMDDHHMMSS){
  			var now_date = new Date();

			var cur_year = now_date.getFullYear();
			var cur_month = now_date.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = now_date.getDate();
			cur_days = this.getDoubleDigit(cur_days);

			var cur_hours = now_date.getHours();
			cur_hours = this.getDoubleDigit(cur_hours);
			var cur_minutes = now_date.getMinutes();
			cur_minutes = this.getDoubleDigit(cur_minutes);
			var cur_seconds = now_date.getSeconds();
			cur_seconds = this.getDoubleDigit(cur_seconds);

			return cur_year+cur_month+cur_days+cur_hours+cur_minutes+cur_seconds+"";
		}

		return null;
	}
	/*
		@ Desc : get n weeks ago from now
	*/
	,getWeeksLater:function(date_str, weeks, date_format_type) {

		if(this.isNotValidDateFormat(date_format_type)) {
			console.log("!Error / date / getWeeksLater / date_format_type is not valid!");
			return null;
		}

		return this.addDaysOnDateFormat(date_str,7*weeks,date_format_type);
	}
	/*
		@ Desc : get n weeks ago from now
	*/
	,getWeeksAgo:function(weeks, date_format_type) {

		if(this.isNotValidDateFormat(date_format_type)) {
			console.log("!Error / date / getWeeksAgo / date_format_type is not valid!");
			return null;
		}

		var date_str = this.getNow(date_format_type);

		return this.addDaysOnDateFormat(date_str,-7*weeks,date_format_type);
	}
	,addDays:function(date_str, days){
		return this.addTime(date_str, days*24, 0);
	}
	,addDaysOnDateFormat:function(date_str, days, date_format_type){
		
		var date_format_type = this.getDateFormatType(date_str);
		if(date_format_type == null){
			console.log("!Error / date / addDaysOnDateFormat / date_str is not valid!");
			return null;	
		}

		if(isNaN(days)) {
			console.log("!Error / date / addDaysOnDateFormat / days are not valid!");
			return null;
		}

		if(this.isNotValidDateFormat(date_format_type)) {
			console.log("!Error / date / addDaysOnDateFormat / date_format_type is not valid!");
			return null;
		}

		return this.addDays(date_str, days);
	}
	,addTime:function(date_str, hours, minutes){

		var date_format_type = this.getDateFormatType(date_str);
		if(date_format_type == null){
			console.log("!Error / date / addTime / date_format_type == null");
			return null;	
		} 

		var date_obj = this.getFormattedDate(date_str, date_format_type);
		if(date_obj == null){
			console.log("!Error / date / addTime / date_obj == null");
			return null;	
		} 

		if(hours!=null && !isNaN(hours)){
			date_obj.setHours(date_obj.getHours()+hours);
		}

		if(minutes!=null && !isNaN(minutes)){
			date_obj.setMinutes(date_obj.getMinutes()+minutes);
		}

		return this.getDateStrFromDateObj(date_obj, date_format_type);
	}
	,getDateStrFromDateObj:function(date_obj, date_format_type){

		if(date_obj == null){
			console.log("!Error / date / getDttmStrFromDate / date_obj == null");
		}

		// 타이머 개선

		if(date_format_type == this.DATE_TYPE_YYYYMMDDHHMMSS){

			var cur_year = date_obj.getFullYear();
			var cur_month = date_obj.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = date_obj.getDate();
			cur_days = this.getDoubleDigit(cur_days);

			var cur_hours = date_obj.getHours();
			cur_hours = this.getDoubleDigit(cur_hours);
			var cur_minutes = date_obj.getMinutes();
			cur_minutes = this.getDoubleDigit(cur_minutes);
			var cur_seconds = date_obj.getSeconds();
			cur_seconds = this.getDoubleDigit(cur_seconds);

			return cur_year + cur_month + cur_days + cur_hours + cur_minutes + cur_seconds;

		} else if(date_format_type == this.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS){

			var cur_year = date_obj.getFullYear();
			var cur_month = date_obj.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = date_obj.getDate();
			cur_days = this.getDoubleDigit(cur_days);

			var cur_hours = date_obj.getHours();
			cur_hours = this.getDoubleDigit(cur_hours);
			var cur_minutes = date_obj.getMinutes();
			cur_minutes = this.getDoubleDigit(cur_minutes);
			var cur_seconds = date_obj.getSeconds();
			cur_seconds = this.getDoubleDigit(cur_seconds);

			var output = 
			"{YEAR}년 {MONTH}월 {DAY}일 {HOUR}:{MINUTE}:{SECOND}"
			.replace(/\{YEAR\}/gi, cur_year)
			.replace(/\{MONTH\}/gi, cur_month)
			.replace(/\{DAY\}/gi, cur_days)
			.replace(/\{HOUR\}/gi, cur_hours)
			.replace(/\{MINUTE\}/gi, cur_minutes)
			.replace(/\{SECOND\}/gi, cur_seconds)
			;

			return output;

		} else if(date_format_type == this.DATE_TYPE_YYYY_MM_DD){

			var cur_year = date_obj.getFullYear();
			var cur_month = date_obj.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = date_obj.getDate();
			cur_days = this.getDoubleDigit(cur_days);

			return cur_year + "-" +  cur_month + "-" +  cur_days;
		} 

		return "";
	}
	,getFormattedTime:function(date_str, output_date_format_type){

		if(airborne.validator.isNotValidStr(date_str)){
			console.log("getFormattedTime / airborne.validator.isNotValidStr(date_str)");
			return null;
		}

		var input_date_format_type = this.getDateFormatType(date_str);
		if(input_date_format_type == null){
			console.log("getFormattedTime / input_date_format_type == null");
			return null;
		}

		var date_converted = this.getFormattedDate(date_str, input_date_format_type);

		if(date_converted == null){
			console.log("getFormattedTime / date_converted == null");
			return null;
		}

		var today = "";
		if(output_date_format_type == airborne.dates.DATE_TYPE_YYYY_MM_DD){

			var cur_year = date_converted.getFullYear();
			var cur_month = date_converted.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = date_converted.getDate();
			cur_days = this.getDoubleDigit(cur_days);
			today = cur_year + "-" + cur_month + "-" + cur_days;

			return today;

		} else if(output_date_format_type == airborne.dates.DATE_TYPE_HH_MM){

			var hours = this.getDoubleDigit(date_converted.getHours())
			var minutes = this.getDoubleDigit(date_converted.getMinutes())

			var now_time = hours + ":" + minutes;

			return now_time;
			
		} else if(output_date_format_type == airborne.dates.DATE_TYPE_H_YYYY_MM_DD_HH_MM_SS){
			
			var cur_year = date_converted.getFullYear();
			var cur_month = date_converted.getMonth() + 1;
			cur_month = this.getDoubleDigit(cur_month);
			var cur_days = date_converted.getDate();
			cur_days = this.getDoubleDigit(cur_days);
			
			var result_time = cur_year + "년 " + cur_month + "월 " + cur_days + "일 ";
			
			var hours = this.getDoubleDigit(date_converted.getHours());
			var minutes = this.getDoubleDigit(date_converted.getMinutes());
			var seconds = this.getDoubleDigit(date_converted.getSeconds());
			
			result_time += hours + ":" + minutes + ":" + seconds;
			
			return result_time;
		}

		return "";
	}
	,getTimeElapsed:function(start_time_obj, time_stack){

		// 초기화 설정
		var time_stack_sec = 0;
		if(time_stack == undefined) {
			time_stack = 0;
			time_stack_sec = 0;
		} else {
			time_stack_sec = parseInt(time_stack / 1000);
		}
		if(start_time_obj == null){
			return {start_time:new Date(), time_diff_millsec:0, time_stack:time_stack, time_stack_sec:time_stack_sec};
		}

		// 이전의 측정시간을 가지고 시간을 재는 경우.
		var start_time = start_time_obj.start_time;
		var now_time = new Date();
		var time_diff_millsec = now_time.getTime() - start_time.getTime();

		var now_time_stack_millisec = start_time_obj.time_stack + time_diff_millsec;
		var now_time_stack_sec = parseInt(now_time_stack_millisec / 1000);

		return {past_time:start_time, start_time:now_time, time_diff_millsec:time_diff_millsec, time_stack:now_time_stack_millisec, time_stack_sec:now_time_stack_sec};
	}
	,getDoubleDigit:function(target_number){
		if(target_number < 10){
			return "0" + target_number;
		}
		return target_number;
	}
	,getMilliSecToMinutes:function(MilliSec){
		return (MilliSec != 0)?this.getSecondsToMinutes(MilliSec/1000):0;
	}
	,getSecondsToMinutes:function(Seconds){
		return (Seconds != 0)?Math.floor(Seconds/60):0;
	}
	,getSecondsRemainder:function(Seconds){
		return (Seconds != 0)?Seconds%60:0;
	}
	,get_seconds_from_mm_ss:function(cur_mm_ss){

		if(this.isNotValidDate(cur_mm_ss, this.DATE_TYPE_MM_SS)){
			console.log("!Error! / airborne.dates.get_seconds_from_hh_mm / this.isNotValidDate(cur_mm_ss, this.DATE_TYPE_MM_SS)");
			return;
		}

		var time_arr = cur_mm_ss.split(":"); // 17:30
		var time_mm_safe_int = parseInt(time_arr[0]);
		var time_mm_in_secs = time_mm_safe_int * (60);
		var time_ss_safe_int = parseInt(time_arr[1]);
		var time_ss_in_secs = time_ss_safe_int;

		return time_mm_in_secs + time_ss_in_secs;
	}	
	,get_seconds_from_hh_mm:function(cur_hh_mm){

		if(this.isNotValidDate(cur_hh_mm, this.DATE_TYPE_HH_MM)){
			console.log("!Error! / airborne.dates.get_seconds_from_hh_mm / this.isNotValidDate(cur_hh_mm, this.DATE_TYPE_HH_MM)");
			return;
		}

		var time_arr = cur_hh_mm.split(":"); // 17:30
		var time_hh_safe_int = parseInt(time_arr[0]);
		var time_hh_in_secs = time_hh_safe_int * (3600);
		var time_mm_safe_int = parseInt(time_arr[1]);
		var time_mm_in_secs = time_mm_safe_int * (60);

		return time_hh_in_secs + time_mm_in_secs;
	}
	,get_hh_mm_from_seconds:function(seconds){

		var _v = airborne.validator;
		if(!(seconds > -1)) {
			console.log("!Error! / airborne.dates.get_hh_mm_from_seconds / !(seconds > -1)");
			return;
		}

		// 24시 이후는 지원하지 않음.
		var max_seconds = 24 * 3600;
		if(max_seconds < seconds){
			console.log("!Error! / airborne.dates.get_hh_mm_from_seconds / max_seconds < seconds");
			return;
		}

		var time_hh = parseInt(seconds / 3600);
		var time_mm = parseInt((seconds % 3600) / 60);

		return this.getDoubleDigit(time_hh) + ":" + this.getDoubleDigit(time_mm);
	}
	,get_mm_ss_ss_from_millisec:function(millisecs){

		var _v = airborne.validator;
		if(!(millisecs > -1)) {
			console.log("!Error! / airborne.dates.get_hh_mm_ss_ss_from_millisec / !(millisecs > -1)");
			return;
		}

		var seconds = parseInt(millisecs / 1000);
		
		var time_mm = parseInt((seconds % 3600) / 60);
		var time_ss = parseInt((seconds % 60));
		var time_m_ss = parseInt((millisecs % 1000) / 10); // 1/100초

		return this.getDoubleDigit(time_mm) + ":" + this.getDoubleDigit(time_ss) + "." + this.getDoubleDigit(time_m_ss);
	}

	/*
		@ public
		@ desc : YYYY-MM-DD 포맷으로 며칠뒤, 며칠전의 시간을 가져옵니다.
	*/
	,get_YYYY_MM_DD_offset_days:function(time_str_YYYY_MM_DD, days){
		return this.get_moment_offset_days(time_str_YYYY_MM_DD, days).format("YYYY-MM-DD");
	}
	,get_YYYY_MM_DD_diff_days:function(time_str_YYYY_MM_DD_future, time_str_YYYY_MM_DD_now){
		var moment_future = this.get_moment_offset_days(time_str_YYYY_MM_DD_future, 0);
		var moment_now = this.get_moment_offset_days(time_str_YYYY_MM_DD_now, 0);

		var duration = moment.duration(moment_now.diff(moment_future));
		var days = duration.asDays();

		return days; // days left.
	}

	,get_moment_offset_days:function(time_str_YYYYMMDD, days){
		return moment(time_str_YYYYMMDD,"YYYYMMDD").add(7, 'days');
	}
	,get_moment_from_str_YYYYMMDD:function(time_str_YYYYMMDD){
		return moment(time_str_YYYYMMDD,"YYYYMMDD");
	}
	,get_moment_from_hour_n_minutes:function(hours, minutes){
		var now = moment();
		var time_str = now.format("YYYYMMDD") + hours + minutes + "00";
		return moment(time_str,"YYYYMMDDHHmmss");
	}
	,get_moment_minutes_offset:function(target_moment, offset_minutes){
		var target_moment_clone = target_moment.clone();
		target_moment_clone.add(offset_minutes, "minutes");
		return moment(target_moment_clone.format("YYYYMMDDHHmmss"),"YYYYMMDDHHmmss");
	}
	,get_minutes_offset_from_hh_mm:function(hour_n_minutes_str, offset_minutes){// 17:30 --> 17:35
		var _v = airborne.validator;
		if(_v.isNotValidStr(hour_n_minutes_str)){
			console.log("!Error! / airborne.dates.get_minutes_offset_from_hh_mm / _v.isNotValidStr(hour_n_minutes_str)");
			return;
		}
		if(_v.isNotNumber(offset_minutes)){
			console.log("!Error! / airborne.dates.get_minutes_offset_from_hh_mm / _v.isNumber(offset_minutes)");
			return;
		}
		var cur_moment = this.get_moment_minutes_offset_from_hour_n_minutes_str(hour_n_minutes_str, offset_minutes);	

		return this.get_hour_n_minutes_str_from_moment_obj(cur_moment);
	}
	,get_moment_minutes_offset_from_hour_n_minutes_str:function(hour_n_minutes_str, offset_minutes){ // 17:30 --> moment obj with 17:35

		var _v = airborne.validator;
		if(_v.isNotValidStr(hour_n_minutes_str)){
			console.log("!Error! / airborne.dates.get_moment_minutes_offset_from_hour_n_minutes_str / _v.isNotValidStr(hour_n_minutes_str)");
			return;
		}
		if(_v.isNotNumber(offset_minutes)){
			console.log("!Error! / airborne.dates.get_moment_minutes_offset_from_hour_n_minutes_str / _v.isNumber(offset_minutes)");
			return;
		}

		var time_arr = hour_n_minutes_str.split(":"); // 17:30
		if(time_arr.length != 2){
			console.log("!Error! / airborne.dates.get_moment_minutes_offset_from_hour_n_minutes_str / time_arr.length != 2)");
			return;
		}

		var target_moment = this.get_moment_from_hour_n_minutes(time_arr[0],time_arr[1]);
		var offset_moment = this.get_moment_minutes_offset(target_moment, offset_minutes);

		return offset_moment;
	}
	,get_hour_n_minutes_str_from_moment_obj:function(target_moment){
		if(target_moment == null){
			console.log("!Error! / airborne.dates.get_hour_n_minutes_str_from_moment_obj / target_moment == null)");
			return;
		}

		var cur_hours = this.getDoubleDigit(target_moment.hours());
		var cur_minutes = this.getDoubleDigit(target_moment.minutes());
		return cur_hours + ":" + cur_minutes;
	}
	,get_moment_from_minutes_n_seconds:function(minutes, seconds){
		var now = moment();
		var time_str = now.format("YYYYMMDDHH") + minutes + seconds;
		return moment(time_str,"YYYYMMDDHHmmss");
	}
	,get_moment_seconds_offset:function(target_moment, offset_seconds){
		var target_moment_clone = target_moment.clone();
		target_moment_clone.add(offset_seconds, "seconds");
		return moment(target_moment_clone.format("YYYYMMDDHHmmss"),"YYYYMMDDHHmmss");
	}
	,get_moment_seconds_offset_from_minutes_n_seconds_str:function(minutes_n_seconds_str, offset_seconds){ // 17:30 --> moment obj with 17:35

		var _v = airborne.validator;
		if(_v.isNotValidStr(minutes_n_seconds_str)){
			console.log("!Error! / airborne.dates.get_moment_seconds_offset_from_minutes_n_seconds_str / _v.isNotValidStr(minutes_n_seconds_str)");
			return;
		}
		if(_v.isNotNumber(offset_seconds)){
			console.log("!Error! / airborne.dates.get_moment_seconds_offset_from_minutes_n_seconds_str / _v.isNumber(offset_seconds)");
			return;
		}

		var time_arr = minutes_n_seconds_str.split(":"); // 17:30
		if(time_arr.length != 2){
			console.log("!Error! / airborne.dates.get_moment_seconds_offset_from_minutes_n_seconds_str / time_arr.length != 2)");
			return;
		}

		var target_moment = this.get_moment_from_minutes_n_seconds(time_arr[0],time_arr[1]);
		var offset_moment = this.get_moment_seconds_offset(target_moment, offset_seconds);

		return offset_moment;
	}
	,get_minutes_n_seconds_str_from_moment_obj:function(target_moment){
		if(target_moment == null){
			console.log("!Error! / airborne.dates.get_minutes_n_seconds_str_from_moment_obj / target_moment == null)");
			return;
		}

		var cur_minutes = this.getDoubleDigit(target_moment.minutes());
		var cur_seconds = this.getDoubleDigit(target_moment.seconds());
		return cur_minutes + ":" + cur_seconds;
	}
	,get_diff_hh_mm:function(first_hh_mm, second_hh_mm){
		if(this.is_not_valid_time_format_str(first_hh_mm, this.DATE_TYPE_HH_MM)){
			console.log("!Error! / airborne.dates.get_diff_hh_mm / this.is_not_valid_time_format_str(first_hh_mm, this.DATE_TYPE_HH_MM)");
			return null;
		}
		if(this.is_not_valid_time_format_str(second_hh_mm, this.DATE_TYPE_HH_MM)){
			console.log("!Error! / airborne.dates.get_diff_hh_mm / this.is_not_valid_time_format_str(second_hh_mm, this.DATE_TYPE_HH_MM)");
			return null;
		}

		var first_time_moment = this.get_moment_from_hour_n_minutes(first_hh_mm);
		var second_time_moment = this.get_moment_from_hour_n_minutes(second_hh_mm);

		return this.getMilliSecToMinutes(first_time_moment.diff(second_time_moment));
	}


	// include moment library.
	// var a = moment([2007, 0, 29]);
	// var b = moment([2007, 0, 28]);
	// a.diff(b, 'days') // 1	
	// a.diff(b, 'seconds') // 1	

	// Add Time

	// var a = moment.duration(1, 'd');
	// var b = moment.duration(2, 'd');
	// a.add(b).days(); // 3	

	// a.add(1, "minutes")

	// Subtract Time

	// var a = moment.duration(3, 'd');
	// var b = moment.duration(2, 'd');
	// a.subtract(b).days(); // 1	

}