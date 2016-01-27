/*
	@ desc : 색상 관련 상수 값 및 계산 메서드들을 추가합니다.
*/
airborne.color = {	
	COLOR_WHITE:"#FFF"
	, COLOR_TINT_GRAY:"#f5f5f5"
	, COLOR_MEDIUM_GRAY:"#999"
	, COLOR_DARK_GRAY:"#494949"
	, COLOR_NAVY:"#004360"
	, COLOR_EMERALD_GREEN:"#33CC99"
	, COLOR_RED:"#D9534F"
	, COLOR_TINT_YELLOW:"#F8E48B"
	// @ Public
	// @ Scope  : Color
	// @ Desc 	: _color.rgb_to_hex(rgb);
	,rgb_to_hex:function(rgb) {

		if(rgb == undefined) {
			console.log("!Error! / rgb_to_hex / rgb is not valid!");
			return;
		}
		if(rgb.indexOf("#") === 1) {
			return rgb;
		}

		// String rgb(138, 109, 59) --> Array [138, 109, 59]
		var rgb_arr = [];
		if(_v.is_valid_str(rgb)) {
			rgb_arr = rgb.replace(/rgb\(/gi, "").replace(/\)/gi, "").replace(/ /gi, "").split(",");
		}
		if(_v.is_valid_array(rgb_arr)) {
			for(var idx = 0; idx < rgb_arr.length; idx++) {
				rgb_arr[idx] = parseInt(rgb_arr[idx]);
			}
		}
		if(rgb_arr.length == 0) {
			console.log("!Error! / rgb_to_hex / rgb_arr.length == 0");
			return;
		}

		//generates the hex-digits for a colour.
		function hex(x) {
			hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
			return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
		}

		return "#" + hex(rgb_arr[0]) + hex(rgb_arr[1]) + hex(rgb_arr[2]);
	}	
}



