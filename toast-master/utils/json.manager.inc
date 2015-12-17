<?php

class JSONManager{

	public static $STATUS_CODE_OK=200;
	public static $STATUS_CODE_BAD_REQUEST=400;
	public static $STATUS_CODE_SERVER_INTERNAL_ERROR=500;

	public static $RESPONSE_MSG_JOB_COMPLETED="job completed";
	public static $RESPONSE_MSG_BAD_REQUEST="bad request";
	public static $RESPONSE_MSG_SERVER_INTERNAL_ERROR="server internal error";
	public static $RESPONSE_MSG_PARAM_NOT_VALID="parameter is not valid";
	

	public static function get_json_response_obj(){

		$json_response_obj = new stdClass();
		$json_response_obj->code = self::$STATUS_CODE_SERVER_INTERNAL_ERROR;
		$json_response_obj->message = self::$RESPONSE_MSG_SERVER_INTERNAL_ERROR;

		$json_response_obj->success = FALSE;
		$json_response_obj->result = null;
		$json_response_obj->time = date("YmdHis");

		return $json_response_obj;
	}

	/*

	@ Author 	: wonder.jung
	@ Desc 		: Html Form 객체에 JSON 문자열을 넘길 경우의 겹따옴표와 홑따옴표의 Mysql 구문내에서 문제가 생기지 않도록 Html 특수문자로 변환하는 과정.


	*/
	public static function get_safe_json_str_on_mysql($unsafe_json_str){
		$unsafe_json_str = str_replace("\\\\\\\"", "&quot;", $unsafe_json_str);
		$unsafe_json_str = str_replace("\\\\'", "&lsquo;", $unsafe_json_str);
		$unsafe_json_str = str_replace("TTTM_QUOTEEE", "&quot;", $unsafe_json_str);
		$unsafe_json_str = str_replace("TTTM_SINGLE_QUOTEEE", "&lsquo;", $unsafe_json_str);
		return $unsafe_json_str;
	}
	/*

	@ Author 	: wonder.jung
	@ Desc 		: JSON 문자열을 오브젝트 객체로 변경합니다. 문자열은 URL decode 및 mysql safe로 변경됩니다.


	*/
	public static function get_json_obj($unsafe_json_str, $is_html_decode=false){
		$unsafe_json_str = self::get_safe_json_str_on_mysql(urldecode($unsafe_json_str));

		// JSON 파싱시에 문제가 생기지 않도록 Double Quote와 Single Quote를 escape 처리해준다.
		$unsafe_json_str = str_replace("&quot;","\\\"",$unsafe_json_str);
		$unsafe_json_str = str_replace("&lsquo;","'",$unsafe_json_str);

		if($is_html_decode === true) {
			$unsafe_json_str = html_entity_decode($unsafe_json_str);			
		}

		return json_decode($unsafe_json_str);
	}
	// json_decode("{value:\"&quot;\"}");

	/*

	@ Author 	: wonder.jung
	@ Desc 		: Javascript에서 JSONStringify로 넘긴 파라미터를 php에서 Object로 변경할 경우 사용합니다.
	@ Reference : http://stackoverflow.com/questions/4989171/json-stringify-to-php

	*/
	public static function get_json_obj_from_JSONStringify($unsafe_json_str){

		$unsafe_json_str = stripslashes($unsafe_json_str);

		return json_decode($unsafe_json_str);
	}
	/*
	
	@ Scope 	: Public
	@ Author 	: wonder.jung
	@ Desc 		: JSON 문자열을 낱개 단위로 분석해서 파싱에 문제가 없는지 확인뒤에 객체로 변환합니다. json_decode에서 파싱이 실패할 경우, 원인 분석이 어려워 이 메서드를 사용합니다.

	*/
	public static $LEFT_CURLY_BRACKET = "{";
	public static $RIGHT_CURLY_BRACKET = "}";
	public static $LEFT_SQUARE_BRACKET = "[";
	public static $RIGHT_SQUARE_BRACKET = "]";
	public static $DOUBLE_QUOTATION_MARK = "\"";
	public static $COMMA = ",";
	private static function is_json_object($unsafe_json_str){
		if(empty($unsafe_json_str)) {
			return false;
		}

		return (strpos($unsafe_json_str, self::$LEFT_CURLY_BRACKET) == 0)?true:false;

	}
	private static function is_json_array($unsafe_json_str){
		if(empty($unsafe_json_str)) {
			return false;
		}

		return (strpos($unsafe_json_str, self::$LEFT_SQUARE_BRACKET) == 0)?true:false;

	}
	public static function get_json_obj_safe($unsafe_json_str, $parent_obj){

		if(empty($unsafe_json_str)) {
			return null;
		}

		$json_str_length = strlen($unsafe_json_str);
		$left_curly_bracket_cnt = 0;
		$is_array = false;
		$is_object = false;
		$is_attribute = false;
		$cur_obj = null;

		$first_character = 
		substr(
			// string
			$unsafe_json_str
			// start
			, 1
			// length
			, 1
		);		
		echo "\$first_character :: $first_character<br/>";

		// FIRST CHAR - CHECK SELF TYPE
		if(strcmp($LEFT_SQUARE_BRACKET, $first_character)) {
			$cur_obj = array();
			$is_array = true;
		} else if(strcmp($LEFT_CURLY_BRACKET, $first_character)) {
			$cur_obj = new stdClass();
			$is_object = true;
		} else if(strcmp($DOUBLE_QUOTATION_MARK, $first_character)) {
			// attribute
			// get attribute name between double quotations / regex

		}

		// SECOND CHAR - CHECK CHILD TYPE
		// 첫번째 "["부터 마지막 "]"를 제외한 문자열을 구합니다. 
		// 이 문자열이 elements를 나타냅니다.
		$json_str_after = 
		substr(
			// string
			$unsafe_json_str
			// start
			, 1
			// length
			, $json_str_length
		);
		$json_str_inside_length = strlen($json_str_inside);

		$result_from_next = self::get_json_obj_safe($json_str_after, $cur_obj);

		$cur_obj = $result_from_next->parent_obj;
		$json_str_after = $result_from_next->json_str_after;



		/*
		if($is_array && strcmp($LEFT_SQUARE_BRACKET, $second_character)) {

			// has array?


			// 분리한 문자열에서 element들을 나누어 문자열로 분리해야 합니다.

			// 분리한 문자열을 재귀 호출해서 object를 얻습니다.

			// 돌려받은 object를 배열인 경우만 element로 추가합니다. 그외에는 동작하지 않습니다.
			
		} else if(($is_array || $is_object) && strcmp($LEFT_CURLY_BRACKET, $second_character)) {

			// has object?
			
		} else if($is_object && strcmp($DOUBLE_QUOTATION_MARK, $second_character)) {

			// has attribute?

		} else if($is_object && strcmp($COMMA, $second_character)) {
		
			// has sibling?
				
		}
		*/	

		if(empty($parent_obj)) {
			return $cur_obj;
		}
		return $parent_obj;

	}
	/*
	
	@ Scope 	: Public
	@ Author 	: wonder.jung
	@ Desc 		: JSON 배열 문자열을 분석합니다. 분석해서 낱개의 json_str 엘리먼트를 가지고 있는 배열로 돌려줍니다.

	*/
	public static function get_json_array_element_json_str($unsafe_json_str) {

		if(empty($unsafe_json_str)) {
			return null;
		}

		$json_str_length = strlen($unsafe_json_str);
		for($idx = 0; $idx < $json_str_length; $idx++) {
			$cur_char = $unsafe_json_str[$idx];
			echo "\$cur_char :: $cur_char<br/>";
		}

		/*
		// 2-2. figure out how many "[ (Left Square Bracket)" repeated.
		$left_square_bracket_repeated_cnt = substr_count($unsafe_json_str, self::$LEFT_SQUARE_BRACKET);
		echo "json_array \$left_square_bracket_repeated_cnt :: $left_square_bracket_repeated_cnt<br/>";
		// 2-3. figure out how many "] (Right Square Bracket)" repeated. which means end of object.
		$right_square_bracket_repeated_cnt = substr_count($unsafe_json_str, self::$RIGHT_SQUARE_BRACKET);
		echo "json_array \$right_square_bracket_repeated_cnt :: $right_square_bracket_repeated_cnt<br/>";

		// 2-4. get json str elements
		$json_str_elements = "";
		$left_square_bracket_first_pos = strpos($unsafe_json_str, $left_square_bracket, 0);
		$right_square_bracket_last_pos = -1;
		if($right_square_bracket_repeated_cnt > 0) {
			$right_square_bracket_last_pos = strpos($unsafe_json_str, $right_square_bracket, ($json_str_length - 1));
		}

		echo "json_array \$left_square_bracket_first_pos :: $left_square_bracket_first_pos<br/>";
		echo "json_array \$right_square_bracket_last_pos :: $right_square_bracket_last_pos<br/>";

		echo "json_array \$unsafe_json_str :: $unsafe_json_str<br/>";

		$json_str_working_on = 
		substr(
			// string
			$unsafe_json_str
			// start
			, $left_square_bracket_first_pos + 1
			// length
			, $right_square_bracket_last_pos - 1
		);

		echo "json_array \$json_str_working_on :: $json_str_working_on<br/>";
		*/



	}
	// REMOVE ME
	//public static $PATTERN_ARR_NEXT_ELEMENT_OBJ=",\\{";
	//public static $PATTERN_ARR_NEXT_ELEMENT_ARR="\\],\\[";

	private static $PATTERN_ARR_BEGINS="\\[";
	private static $PATTERN_ARR_ELEMENT_NUM="-?\d+,?"; // 
	private static $PATTERN_OBJ_BEGINS="\\{";
	private static $PATTERN_OBJ_NEXT_ATTR=",";
	private static $PATTERN_OBJ_NEXT_ATTR_AFTER_STR_VALUE="\\\",";
	private static $PATTERN_OBJ_NEXT_ATTR_AFTER_NUM_VALUE="-?\d+,";
	private static $PATTERN_OBJ_ATTR_KEY_ENDS_STR_VALUE_BEGINS="\\\":\\\"";
	private static $PATTERN_OBJ_ATTR_KEY_ENDS_OTHER_VALUE_BEGINS="\":";
	private static $PATTERN_OBJ_ATTR_STR_VALUE_ENDS="\\\"\\}";
	private static $PATTERN_OBJ_ATTR_NUM_VALUE_ENDS="-?\d+\\}";
	private static $PATTERN_OBJ_ATTR_KEY_ENDS_NUM_VALUE_BEGINS="\\\":-?\d+";
	private static $PATTERN_OBJ_ATTR_KEY_ENDS_ARRAY_VALUE_BEGINS="\\\":\\[";
	private static $PATTERN_OBJ_ATTR_KEY_ENDS_OBJ_VALUE_BEGINS="\\\":\\{";
	private static $PATTERN_OBJ_ATTR_KEY_ENDS_NULL_VALUE_BEGINS="\\\":null|\\\":NULL";
	private static $PATTERN_OBJ_ATTR_KEY_ENDS_EMPTY_VALUE_BEGINS="\\\":";
	private static $PATTERN_DOUBLE_QUOTATION="\\\"";
	private static $PATTERN_OBJ_ENDS="\\}";
	private static $PATTERN_OBJ_ENDS_WITH_STR_VALUE="\"\\}";
	private static $PATTERN_ARR_ENDS="\\]";
	private static $CHAR_LEFT_SQUARE_BRACKET="[";
	private static $CHAR_RIGHT_SQUARE_BRACKET="]";
	private static $CHAR_LEFT_CURLY_BRACKET="{";
	private static $CHAR_RIGHT_CURLY_BRACKET="}";
	private static $CHAR_DOUBLE_QUOTATION="\"";
	private static $CHAR_COLON=":";

	private static function print_me($msg, $depth=0){
		$tab = "&nbsp;&nbsp;&nbsp;&nbsp;";

		if(0 < $depth) {
			for($idx=0; $idx < $depth; $idx++) {
				$msg = $tab . $msg;
			}
		}

		echo "<br/>$msg";
	}
	public static function parse_json_str_safe($unsafe_json_str, $parent_obj=null, $parser_depth=0) {	

		$method_name = "parse_json_str_safe";
		self::print_me("$method_name / \$parser_depth :: $parser_depth",$parser_depth);
		self::print_me("\$unsafe_json_str",$parser_depth);
		self::print_me($unsafe_json_str,$parser_depth);

		$unsafe_json_str_length = strlen($unsafe_json_str);

		self::get_object_hierarchy($unsafe_json_str);


		


		return;



		// 첫번째 글자를 분석
		// 1. 객체만듬
		// 2. 속성값을 추가
		$index_of_char = 0;
		if(is_null($cur_char)) {
			$cur_char = substr($unsafe_json_str, $index_of_char, 1);	
		}
		// 첫번째 글자를 제외한 나머지 문자열
		$unsafe_json_str_remaining = substr($unsafe_json_str, ($index_of_char + strlen($cur_char)), $unsafe_json_str_length);

		if(self::has_pattern(self::$PATTERN_ARR_BEGINS,$cur_char)) {

			$cur_step = "\$PATTERN_ARR_BEGINS";
			self::print_me("$cur_step :: \$cur_char :: $cur_char",$parser_depth);
			self::print_me("$cur_step :: \$unsafe_json_str_remaining :: ",$parser_depth);
			self::print_me("$cur_step :: $unsafe_json_str_remaining",$parser_depth);

			$cur_obj = array();

			// 자신의 배열이 종료되는 문자를 만날때까지 반복해서 진행.
			$max_loop = 4;
			for($loop_idx=0;$loop_idx < $max_loop;$loop_idx++) {

				self::print_me("$cur_step / LOOP / \$max_loop :: $max_loop",$parser_depth);
				self::print_me("$cur_step / LOOP / \$loop_idx :: $loop_idx",$parser_depth);
				self::print_me("$cur_step / LOOP / \$unsafe_json_str_remaining :: ",$parser_depth);
				self::print_me("$cur_step / LOOP / $unsafe_json_str_remaining",$parser_depth);

				$outcome = 
				self::parse_json_str_safe(
					// unsafe_json_str
					$unsafe_json_str_remaining
					// parent_obj
					, $cur_obj
					// parser_depth=0
					, $parser_depth + 1
				);
				$cur_obj = $outcome->parent_obj;
				$unsafe_json_str_remaining = $outcome->raw_str_remaing;
				
				self::print_me("$cur_step / LOOP / \$cur_obj / BEGIN<br/>",$parser_depth);
				self::print_hierarchy($cur_obj);
				self::print_me("$cur_step / LOOP / \$cur_obj / END",$parser_depth);

				self::print_me("$cur_step / LOOP / DONE / \$unsafe_json_str_remaining :: ",$parser_depth);
				self::print_me("$cur_step / LOOP / DONE / $unsafe_json_str_remaining",$parser_depth);
				self::print_me("$cur_step / LOOP / DONE / \$loop_idx :: $loop_idx",$parser_depth);

				if(empty($unsafe_json_str_remaining)) {
					break;
				}
			}

			$parent_obj = $outcome->parent_obj;

			self::print_me("$cur_step / DONE / \$parent_obj / BEGIN<br/>",$parser_depth);
			self::print_hierarchy($parent_obj);
			self::print_me("$cur_step / DONE / \$parent_obj / END",$parser_depth);
			self::print_me("$cur_step / DONE / FINISHED",$parser_depth);

		} else if(self::has_pattern(self::$PATTERN_OBJ_BEGINS,$cur_char)) {

			$cur_step = "\$PATTERN_OBJ_BEGINS";
			self::print_me("$cur_step :: \$cur_char :: $cur_char",$parser_depth);
			self::print_me("$cur_step :: \$unsafe_json_str_remaining :: ",$parser_depth);
			self::print_me("$cur_step :: $unsafe_json_str_remaining",$parser_depth);

			if(is_array($parent_obj)) {

				self::print_me("$cur_step :: is_array",$parser_depth);

				$cur_obj = new stdClass();
				$outcome = 
				self::parse_json_str_safe(
					// unsafe_json_str
					$unsafe_json_str_remaining
					// parent_obj
					, $cur_obj
					// parser_depth=0
					, $parser_depth + 1
				);


				$cur_obj = $outcome->parent_obj;
				array_push($parent_obj, $cur_obj);

				$unsafe_json_str_remaining = $outcome->raw_str_remaing;

			} else if(is_object($parent_obj)) {

				self::print_me("\$PATTERN_OBJ_BEGINS :: is_object",$parser_depth);
				// what should I do?
			}

		} else if(self::has_pattern(self::$PATTERN_OBJ_NEXT_ATTR,$cur_char)) {

			$cur_step = "\$PATTERN_OBJ_NEXT_ATTR";
			self::print_me("$cur_step :: \$cur_char :: $cur_char",$parser_depth);
			self::print_me("$cur_step :: \$unsafe_json_str_remaining :: ",$parser_depth);
			self::print_me("$cur_step :: $unsafe_json_str_remaining",$parser_depth);

			if(is_array($parent_obj)) {

				self::print_me("$cur_step :: parent_obj is array!",$parser_depth);

				// 다음 오브젝트를 가져옵니다 or 다음 배열을 가져옵니다.
				$outcome = 
				self::parse_json_str_safe(
					// unsafe_json_str
					$unsafe_json_str_remaining
					// parent_obj
					, $parent_obj
					// parser_depth=0
					, $parser_depth + 1
				);

				$parent_obj = $outcome->parent_obj;
				$unsafe_json_str_remaining = $outcome->raw_str_remaing;

				self::print_me("$cur_step / BEGIN / \$parent_obj / BEGIN<br/>",$parser_depth);
				self::print_hierarchy($parent_obj);
				self::print_me("$cur_step / DONE / \$parent_obj / END",$parser_depth);
				self::print_me("$cur_step / DONE / FINISHED",$parser_depth);

			}

		} else if(self::has_pattern(self::$PATTERN_DOUBLE_QUOTATION,$cur_char)) {

			$cur_step = "\$PATTERN_DOUBLE_QUOTATION";
			self::print_me("$cur_step :: \$cur_char :: $cur_char",$parser_depth);
			self::print_me("$cur_step :: \$unsafe_json_str_remaining :: ",$parser_depth);
			self::print_me("$cur_step :: $unsafe_json_str_remaining",$parser_depth);

			if(is_null($parent_obj)) {

				self::print_me("$cur_step / 1 / 부모 객체가 없는 경우. 첫 문자열을 넘겨 받은 시점의 처리.",$parser_depth);

			} else if(is_array($parent_obj)) {

				self::print_me("$cur_step / 2 / 배열 엘리먼트를 나타내는 문자열이 시작됩니다.",$parser_depth);

			} else if(is_object($parent_obj)) {

				self::print_me("$cur_step / 3 / 오브젝트의 속성키의 문자열이 시작됩니다. 속성 값도 함께 가져옵니다.",$parser_depth);

				// 아래의 경우의 수중 가장 먼저 검색되는 조건으로 진행해야 함.
				$match = 
				self::get_matchs_patterns(
					// patterns
					array(
						self::$PATTERN_OBJ_ATTR_KEY_ENDS_STR_VALUE_BEGINS
						, self::$PATTERN_OBJ_ATTR_KEY_ENDS_NUM_VALUE_BEGINS
						, self::$PATTERN_OBJ_ATTR_KEY_ENDS_ARRAY_VALUE_BEGINS
						, self::$PATTERN_OBJ_ATTR_KEY_ENDS_OBJ_VALUE_BEGINS
						, self::$PATTERN_OBJ_ATTR_KEY_ENDS_NULL_VALUE_BEGINS
						, self::$PATTERN_OBJ_ATTR_KEY_ENDS_EMPTY_VALUE_BEGINS
					)
					// target str
					, $unsafe_json_str_remaining
				);
				$match_chars = "";
				$match_chars_idx = -1;
				if(!empty($match)) {
					$match_chars = $match[0];
					$match_chars_idx = $match[1];
				}

				self::print_me("$cur_step / parent_obj is object",$parser_depth);
				self::print_me("$cur_step / BEGIN / \$match",$parser_depth);
				self::print_hierarchy($match);
				self::print_me("$cur_step / DONE / \$match",$parser_depth);
				
				if(self::has_pattern(self::$PATTERN_OBJ_ATTR_KEY_ENDS_STR_VALUE_BEGINS,$match_chars)) {

					self::print_me("$cur_step / 1 / 속성값이 문자열인 경우",$parser_depth);
					self::print_me("$cur_step / 1 / \$unsafe_json_str_remaining :: ",$parser_depth);
					self::print_me("$cur_step / 1 / $unsafe_json_str_remaining",$parser_depth);

					$outcome = self::get_json_obj_attr_str_key_n_str_value($unsafe_json_str_remaining, $parser_depth + 1);
					$attr_value_str_len = strlen($outcome->attr_value);
					if(!empty($outcome->attr_key)) {
						$parent_obj->{$outcome->attr_key} = $outcome->attr_value;	
					}
					$unsafe_json_str_remaining = $outcome->remaining_str;

					self::print_me("$cur_step / 1 / \$outcome->attr_value :: ",$parser_depth);
					self::print_me("$cur_step / 1 / $outcome->attr_value",$parser_depth);
					self::print_me("$cur_step / 1 / \$attr_value_str_len :: ",$parser_depth);
					self::print_me("$cur_step / 1 / $attr_value_str_len",$parser_depth);
					self::print_me("$cur_step / 1 / DONE",$parser_depth);

				} else if(self::has_pattern(self::$PATTERN_OBJ_ATTR_KEY_ENDS_NUM_VALUE_BEGINS,$match_chars)) {

					self::print_me("$cur_step / 2 / 속성값이 숫자인 경우",$parser_depth);
					self::print_me("$cur_step / 2 / \$unsafe_json_str_remaining :: ",$parser_depth);
					self::print_me("$cur_step / 2 / $unsafe_json_str_remaining",$parser_depth);

					$outcome = self::get_json_obj_attr_str_key_n_num_value($unsafe_json_str_remaining, $parser_depth + 1);
					if(!empty($outcome->attr_key)) {
						$parent_obj->{$outcome->attr_key} = $outcome->attr_value;	
					}
					$unsafe_json_str_remaining = $outcome->remaining_str;

					self::print_me("$cur_step / 2 / \$outcome->attr_value :: ",$parser_depth);
					self::print_me("$cur_step / 2 / $outcome->attr_value",$parser_depth);
					self::print_me("$cur_step / 2 / DONE",$parser_depth);

				} else if(self::has_pattern(self::$PATTERN_OBJ_ATTR_KEY_ENDS_ARRAY_VALUE_BEGINS,$match_chars)) {

					self::print_me("$cur_step / 3 / 속성값이 배열인 경우",$parser_depth);
					self::print_me("$cur_step / 3 / \$unsafe_json_str_remaining :: ",$parser_depth);
					self::print_me("$unsafe_json_str_remaining",$parser_depth);

					$outcome = self::get_json_obj_attr_str_key_n_array_str_value($unsafe_json_str_remaining, $parser_depth + 1);

					self::print_me("$cur_step / 3 / \$outcome / BEGIN ",$parser_depth);
					self::print_hierarchy($outcome);
					self::print_me("$cur_step / 3 / \$outcome / DONE ",$parser_depth);

					// ??? - 정말 필요한 과정인가? 없어도 되지 않을까?
					if(!empty($outcome->attr_key)) {
						$parent_obj->{$outcome->attr_key} = $outcome->attr_value;
					}

					// 이중 배열을 가진 자식 객체일 경우를 추가합니다.
					if(	!empty($outcome) && 
						is_string($outcome->attr_value) && 
						self::is_array_num_elements($outcome->attr_value)	) {

						self::print_me("$cur_step / 3-1 / 첫번째 글자가 숫자인 경우 - 파라미터가 숫자이다. :: ",$parser_depth);

						// 첫번째 글자가 숫자인 경우 - 파라미터가 숫자이다.
						// 정규표현식을 사용, 숫자와 쉼표로만 구성된 문자열을 추출, 배열 객체를 채워서 돌려줌.
						// "1,2,3,4]" --> [1,2,3,4];
						$array_num_elements = self::get_array_width_num_element($outcome->attr_value);
						$parent_obj->{$outcome->attr_key} = $array_num_elements;

					} else if(	!empty($outcome) && 
								is_string($outcome->attr_value) && 
								self::is_array_str_elements($outcome->attr_value)	) {

						self::print_me("$cur_step / 3-2 / 첫번째 글자가 문자열인 경우 - 파라미터가 문자이다. :: ",$parser_depth);

						// 첫번째 글자가 문자열인 경우 - 파라미터가 문자이다.
						// 정규표현식을 사용, 문자와 쉼표로만 구성된 문자열을 추출, 배열 객체를 채워서 돌려줌.
						// \"A\",\"B\",\"C\",\"D\"]" --> ["A","B","C","D"];
						$array_str_elements = self::get_array_width_str_element($outcome->attr_value);
						$parent_obj->{$outcome->attr_key} = $array_str_elements;

					} else if(	!empty($outcome) && 
								is_array($outcome->attr_value) && 
								self::is_array_has_array_elements_has_string_elements($outcome->attr_value) ) {

						self::print_me("$cur_step / 3-3 / 이중 배열과 내부 배열에 문자열 1개만 포함된 경우 :: ",$parser_depth);

						$target_array = $outcome->attr_value;
						for($idx = 0;$idx < count($target_array);$idx++) {
							$target_element = $target_array[$idx];

							self::print_me("$cur_step / 3-3 / LOOP / \$idx :: $idx",$parser_depth);
							self::print_me("$cur_step / 3-3 / LOOP / \$target_element / BEGIN <br/>",$parser_depth);
							self::print_hierarchy($target_element);
							self::print_me("$cur_step / 3-3 / LOOP / \$target_element / END ",$parser_depth);

							if(is_array($target_element) && !empty($target_element)) {

								self::print_me("$cur_step / 3-3-1 / LOOP / 엘리먼트가 배열인 경우",$parser_depth);

								$target_sub_array = $target_element;
								$target_str = self::$CHAR_LEFT_SQUARE_BRACKET . $target_sub_array[0] . self::$CHAR_RIGHT_SQUARE_BRACKET;

								self::print_me("$cur_step / 3-3-1 / LOOP / \$target_str :: $target_str",$parser_depth);

								// 문자열을 다시 보내 객체로 변환합니다.
								$outcome = 
								self::parse_json_str_safe(
									// unsafe_json_str
									$target_str
									// parent_obj
									, $target_sub_array
									// parser_depth=0
									, $parser_depth + 1
								);

								self::print_me("$cur_step / 3-3-1 / LOOP / \$outcome_from_sub_array / BEGIN <br/>",$parser_depth);
								self::print_hierarchy($outcome_from_sub_array);
								self::print_me("$cur_step / 3-3-1 / LOOP / \$outcome_from_sub_array / END",$parser_depth);

								$target_array[$idx] = $outcome_from_sub_array->parent_obj;

							} // if end

						}

						self::print_me("$cur_step / 3-3-1-1 / \$parent_obj / BEGIN<br/>",$parser_depth);
						self::print_hierarchy($parent_obj);
						self::print_me("$cur_step / 3-3-1-1 / \$parent_obj / END",$parser_depth);

						self::print_me("$cur_step / 3-3-1-2 / \$outcome / BEGIN<br/>",$parser_depth);
						self::print_hierarchy($outcome);
						self::print_me("$cur_step / 3-3-1-2 / \$outcome / END",$parser_depth);

						self::print_me("$cur_step / 3-3-1-3 / \$target_array / BEGIN<br/>",$parser_depth);
						self::print_hierarchy($target_array);
						self::print_me("$cur_step / 3-3-1-3 / \$target_array / END",$parser_depth);

						if(property_exists($parent_obj, $outcome->attr_key)) {
							$parent_obj->{$outcome->attr_key} = $target_array;	
						}

						self::print_me("$cur_step / 3-3-1-4 / \$parent_obj / BEGIN<br/>",$parser_depth);
						self::print_hierarchy($parent_obj);
						self::print_me("$cur_step / 3-3-1-4 / \$parent_obj / END",$parser_depth);

						// FINISHED
						self::print_me("$cur_step / 3-3-1-5 / FINISHED",$parser_depth);

					} else if(	!empty($outcome) && 
								is_string($outcome->attr_value) && 
								self::is_string_array_has_array_elements($outcome->attr_value) ) {

						self::print_me("$cur_step / 3-4 / 첫번째 글자가 배열 \"[\" 경우 - 파라미터가 배열인 경우 :: ",$parser_depth);
						self::print_me("$cur_step / 3-4 / \$idx :: $idx",$parser_depth);
						self::print_me("$cur_step / 3-4 / \$outcome->attr_value :: ",$parser_depth);
						self::print_me("$cur_step / 3-4 / $outcome->attr_value",$parser_depth);

						// 나머지 문자열을 넘겨서 배열 만들기 프로세스를 타게 한다. 최대 2 depth까지 지원합니다.
						$result = self::get_array_with_array_element($outcome->attr_value, $parser_depth + 1);

						// TODO 내부 배열의 내용을 확인해서 문자열이 아닐 경우, 변환 과정을 거쳐야 합니다.

						$parent_obj->{$outcome->attr_key} = $result->result_arr;

						self::print_me("$cur_step / 3-4 / \$parent_obj / BEGIN<br/>",$parser_depth);
						self::print_hierarchy($parent_obj);
						self::print_me("$cur_step / 3-4 / \$parent_obj / END",$parser_depth);

					}

					// 첫번째 글자가 객체 "{" 경우 - 파라미터가 객체이다.
					// 나머지 문자열을 넘겨서 객체 만들기 프로세스를 타게 한다.

					self::print_me("$cur_step / 3-5 / \$parent_obj / BEGIN<br/>",$parser_depth);
					self::print_hierarchy($parent_obj);
					self::print_me("$cur_step / 3-5 / \$parent_obj / END",$parser_depth);

					$unsafe_json_str_remaining = $outcome->remaining_str;

					self::print_me("$cur_step / 3-5 / \$unsafe_json_str_remaining :: ",$parser_depth);
					self::print_me("$cur_step / 3-5 / $unsafe_json_str_remaining",$parser_depth);
					self::print_me("$cur_step / 3-6 / FINISHED ",$parser_depth);

				} else if(self::has_pattern(self::$PATTERN_OBJ_ATTR_KEY_ENDS_OBJ_VALUE_BEGINS,$match_chars)) {

					echo "<br/>PDQ / 4. 속성값이 객체인 경우 <br/>";

				} else if(self::has_pattern(self::$PATTERN_OBJ_ATTR_KEY_ENDS_NULL_VALUE_BEGINS,$match_chars)) {

					echo "<br/>PDQ / 5. 속성값이 null인 경우 <br/>";

				} else if(self::has_pattern(self::$PATTERN_OBJ_ATTR_KEY_ENDS_EMPTY_VALUE_BEGINS,$match_chars)) {					

					echo "<br/>PDQ / 6. 속성값이 없는 경우 <br/>";

				}

			}

		} else if(self::has_pattern(self::$PATTERN_OBJ_ENDS,$cur_char)) {

			echo "\$PATTERN_OBJ_ENDS / \$cur_char :: $cur_char<br/>";

		} else if(self::has_pattern(self::$PATTERN_ARR_ENDS,$cur_char)) {

			echo "\$PATTERN_ARR_ENDS / Do nothing. / \$cur_char :: $cur_char<br/>";

		} else if(self::has_pattern(self::$PATTERN_ARR_ELEMENT_NUM,$cur_char)) {

			echo "\$PATTERN_ARR_ELEMENT_NUM / Do nothing. / \$cur_char :: $cur_char<br/>";

			if(self::is_array($parent_obj)) {

				// TODO 한자릿수가 아닌 숫자 전체를 넘겨 받아야 합니다.

				echo "\$PATTERN_ARR_ELEMENT_NUM / parent_obj is array!<br/>";
				echo "\$PATTERN_ARR_ELEMENT_NUM / \$unsafe_json_str_remaining :: $unsafe_json_str_remaining<br/>";

				array_push($parent_obj, intval($cur_char));

			}


		} else {

			echo "\$NO_PATTERN_ENDS / Do nothing. / \$cur_char :: $cur_char<br/>";

		}

		$result = new stdClass();
		$result->parent_obj = $parent_obj;
		$result->raw_str_remaing = $unsafe_json_str_remaining;

		return $result;
	}
	private static function has_pattern($pattern, $target_str) {

		if(is_null($pattern) || empty($pattern)) return false;

		if(is_null($target_str) || empty($target_str)) return false;

		preg_match("/".$pattern."/", $target_str, $match, PREG_OFFSET_CAPTURE);

		return (!empty($match));
	}
	/*
		@ Desc : 여러 패턴 조건을 모두 조합해 검색.
	*/

	private static function get_matchs_patterns($pattern_arr, $target_str) {
		if(is_null($pattern_arr) || empty($pattern_arr)) return null;
		if(is_null($target_str) || empty($target_str)) return null;

		$patterns = "/";
		for($idx = 0; $idx < count($pattern_arr); $idx++){
			$cur_pattern = $pattern_arr[$idx];
			$patterns .= $cur_pattern;
			if($idx < (count($pattern_arr) - 1)) {
				$patterns .= "|";
			}
		}
		$patterns .= "/";

		preg_match($patterns, $target_str, $match, PREG_OFFSET_CAPTURE);

		if(!empty($match)) {
			return $match[0];
		}
		return null;
	}

	// __action_name":"Present awrard ( < 1 min )"}
	/*
		@ Desc : 문자열 파라미터의 첫번째 속성의 키,밸류(문자열)을 객체로 돌려줍니다.이 속성 영역을 제외한 나머지 문자열도 돌려줍니다. (다음 작업을 위해서)
	*/
	private static function get_json_obj_attr_str_key_n_str_value($target_str, $parser_depth=0){
		$result = 
		self::get_json_obj_attr_key_n_value(
			// $pattern_key_ends_value_begins
			self::$PATTERN_OBJ_ATTR_KEY_ENDS_STR_VALUE_BEGINS
			// $pattern_value_ends=null
			, self::$PATTERN_OBJ_ENDS_WITH_STR_VALUE
			// $target_str
			, $target_str
			// $parser_depth
			, $parser_depth
		);

		return $result;
	}
	/*
		@ Desc : 문자열 파라미터의 첫번째 속성의 키(문자열),밸류(숫자)을 객체로 돌려줍니다.
		@ Example : {key:${KEY},value:${VALUE_NUM}}
	*/
	private static function get_json_obj_attr_str_key_n_num_value($target_str, $parser_depth=0){

		$result = 
		self::get_json_obj_attr_key_n_value(
			// $pattern_key_ends_value_begins
			self::$PATTERN_OBJ_ATTR_KEY_ENDS_OTHER_VALUE_BEGINS
			// $pattern_value_ends=null
			, self::$PATTERN_OBJ_ENDS
			// $target_str
			, $target_str
			// $parser_depth
			, $parser_depth
		);

		return $result;
	}
	/*
		@ Desc : 문자열 파라미터의 첫번째 속성의 키(문자열),밸류(배열부분 - 문자열)을 객체로 돌려줍니다.
		@ Example : {key:${KEY},value:${VALUE_NUM}}
	*/
	private static function get_json_obj_attr_str_key_n_array_str_value($target_str, $parser_depth=0){

		$cur_step = "get_json_obj_attr_str_key_n_array_str_value";
		self::print_me("$cur_step :: \$target_str ::",$parser_depth);
		self::print_me("$target_str",$parser_depth);

		// 키 값을 가져옵니다.
		$outcome = self::get_first_str_before_pattern(self::$PATTERN_OBJ_ATTR_KEY_ENDS_ARRAY_VALUE_BEGINS, $target_str, $parser_depth + 1);
		$attr_key = $outcome->first_str;

		// 검사 대상 패턴이 타겟 문자열에서 삭제되므로 이중 배열의 구조가 깨집니다.
		// 이를 되살리기 위해 대괄호를 맨앞에 추가합니다.
		$target_str = self::$CHAR_LEFT_SQUARE_BRACKET . $outcome->remaining_str;

		// 속성 값을 먼저 가져옵니다. 아래와 같은 경우가 있을 수 있습니다.
		// 1. ["A","B","C"]
		// 2. [1,2,3]
		// 3. [{"A":"B"},{"A":"B"},{"A":"B"}]
		// 4. [["A","B"],["A","B"],["A","B"]]
		$result_outcome = self::get_array_with_array_element($target_str, $parser_depth + 1);

		$result = new stdClass();
		$result->attr_key = $attr_key;
		$result->attr_value = $result_outcome->result_arr;
		$result->remaining_str = $result_outcome->remaining_str;

		return $result;
	}
	private static function get_json_obj_attr_key_n_value($pattern_key_ends_value_begins, $pattern_value_ends=null, $target_str, $parser_depth){

		// echo "<br/>";
		// echo "get_json_obj_attr_key_n_value / 1 / <br/> \$target_str ::<br/> $target_str<br/>";


		$outcome = self::get_first_str_before_pattern($pattern_key_ends_value_begins, $target_str);
		$attr_key = $outcome->first_str;
		$target_str = $outcome->remaining_str;

		$cur_step = "get_json_obj_attr_key_n_value";
		self::print_me("$cur_step :: \$target_str :: ",$parser_depth);
		self::print_me("$cur_step :: $target_str",$parser_depth);
		self::print_me("$cur_step :: \$attr_key :: ",$parser_depth);
		self::print_me("$cur_step :: $attr_key",$parser_depth);

		// REMOVE ME
		// echo "<br/>";
		// echo "get_json_obj_attr_key_n_value / 2 / <br/> \$target_str ::<br/> $target_str<br/>";
		// echo "get_json_obj_attr_key_n_value / 2 / <br/> \$attr_key ::<br/> $attr_key<br/>";

		// echo "<br/>";
		// print_r($outcome);
		// echo "<br/>get_json_obj_attr_key_n_value / 000<br/>";


		if(is_null($pattern_value_ends)) {
			$pattern_value_ends = self::$PATTERN_OBJ_ENDS;
		}
		$outcome = self::get_first_str_before_pattern($pattern_value_ends, $target_str);
		$attr_value = $outcome->first_str;
		$target_str = $outcome->remaining_str;

		self::print_me("$cur_step / DONE / \$target_str :: ",$parser_depth);
		self::print_me("$cur_step / DONE / :: $target_str",$parser_depth);
		self::print_me("$cur_step / DONE / \$attr_key :: ",$parser_depth);
		self::print_me("$cur_step / DONE / :: $attr_key",$parser_depth);
		self::print_me("$cur_step / DONE / \$attr_value :: ",$parser_depth);
		self::print_me("$cur_step / DONE / :: $attr_value",$parser_depth);

		// REMOVE ME
		// echo "<br/>";
		// echo "get_json_obj_attr_key_n_value / 3 / <br/> \$target_str ::<br/> $target_str<br/>";
		// echo "get_json_obj_attr_key_n_value / 3 / <br/> \$attr_value ::<br/> $attr_value<br/>";

		// echo "<br/>";
		// print_r($outcome);
		// echo "<br/>get_json_obj_attr_key_n_value / 001<br/>";

		$result = new stdClass();

		$result->attr_key = $attr_key;
		$result->attr_value = $attr_value;
		$result->remaining_str = $target_str;

		return $result;
	}
	/*
		@ Desc : 매칭되는 패턴의 문자열을 반환합니다.
	*/
	private static function get_first_matched_str($pattern, $target_str){

		$outcome = new stdClass();
		$outcome->first_str = "";
		$outcome->remaining_str = $target_str;

		if(is_null($pattern) || empty($pattern)) return $outcome;
		if(is_null($target_str) || empty($target_str)) return $outcome;

		preg_match("/".$pattern."/", $target_str, $match, PREG_OFFSET_CAPTURE);

		$index_of_pattern = -1;
		$pattern_str = "";
		if(!empty($match)) {
			$index_of_pattern = $match[0][1];
			$pattern_str = $match[0][0];
		}

		$index_to_split = $index_of_pattern + strlen($pattern_str);
		$target_str_remaining = substr($target_str, $index_to_split);

		$outcome->first_str = $pattern_str;
		$outcome->remaining_str = $target_str_remaining;

		return $outcome;
	}
	/*
		@ Desc : 매칭되는 패턴의 모든 문자열을 반환합니다.
	*/
	private static function get_all_matched_str($pattern, $target_str){

		if(is_null($pattern) || empty($pattern)) return $outcome;
		if(is_null($target_str) || empty($target_str)) return $outcome;

		preg_match_all("/".$pattern."/", $target_str, $match, PREG_OFFSET_CAPTURE);

		$index_of_pattern = -1;
		$pattern_str = "";
		if(!empty($match)) {
			return $match[0];
		}

		return null;
	}


	/*
		@ Desc : 매칭되는 패턴의 바로 직전의 문자열을 반환합니다.
	*/
	private static function get_first_str_before_pattern($pattern, $target_str, $parser_depth = 0){

		$outcome = new stdClass();
		$outcome->first_str = "";
		$outcome->remaining_str = $target_str;

		if(is_null($pattern) || empty($pattern)) return $outcome;
		if(is_null($target_str) || empty($target_str)) return $outcome;

		preg_match("/".$pattern."/", $target_str, $match, PREG_OFFSET_CAPTURE);

		$index_of_pattern = -1;
		$pattern_str = "";
		if(!empty($match)) {
			$index_of_pattern = $match[0][1];
			$pattern_str = $match[0][0];
		}

		$first_str = "";
		if($index_of_pattern > 0) {
			$first_str = substr($target_str, 0, $index_of_pattern);
		}

		$target_str_remaining = substr($target_str, $index_of_pattern + strlen($pattern_str));

		$outcome->first_str = $first_str;
		$outcome->remaining_str = $target_str_remaining;

		return $outcome;

	}
	private static function get_array_width_num_element($target_str){

		$result = array();
		if(empty($target_str)) {
			return $result;
		}

		$pattern_arr_element_nums = "^[\d+\,?]+";
		$outcome = 
		self::get_first_matched_str($pattern_arr_element_nums, $target_str);

		if(is_null($outcome) || empty($outcome->first_str)) {
			return $result;
		}

		$outcome_str = $outcome->first_str;
		return explode(",", $outcome_str);
	}
	/*
		@ Desc : [1,2,3,4] 타입의 배열 문자인지 확인한다.
	*/
	private static function is_array_num_elements($target_str) {

		$pattern_arr_element_nums = "^\[[\d+\,?]+\]";
		$outcome = 
		self::get_first_matched_str($pattern_arr_element_nums, $target_str);

		// echo "<br/>is_array_num_elements<br/>";	
		// echo "<br/>\$target_str :: $target_str<br/>";
		// echo "<br/>is_array_num_elements<br/>";	
		// print_r($outcome);
		// echo "<br/>is_array_num_elements<br/>";

		if(!is_null($outcome) && !empty($outcome->first_str) && empty($outcome->raw_str_remaing)) {
			// 모든 문자열에 Number형 요소를 가진 배열로 끝남.
			return true;
		}
		return false;
	}
	private static function get_array_width_str_element($target_str){

		echo "<br/>QQQQ<br/>";	
		echo "\$target_str :: $target_str<br/>";
		echo "<br/>QQQQ<br/>";

		$result = array();
		if(empty($target_str)) {
			return $result;
		}

		$pattern_arr_element_nums = "^[\"\w+\"\,?]+";
		$outcome = 
		self::get_first_matched_str($pattern_arr_element_nums, $target_str);

		if(is_null($outcome) || empty($outcome->first_str)) {
			return $result;
		}

		$outcome_str = $outcome->first_str;
		return explode(",", $outcome_str);
	}
	/*
		@ Desc : ["A","B","C","D"] 타입의 배열 문자인지 확인한다.
	*/
	private static function is_array_str_elements($target_str) {

		$pattern_arr_element_nums = "^\[[\"\w+\"\,?]+\]";
		$outcome = 
		self::get_first_matched_str($pattern_arr_element_nums, $target_str);

		// echo "<br/>is_array_str_elements<br/>";	
		// echo "<br/>\$target_str :: $target_str<br/>";
		// echo "<br/>is_array_str_elements<br/>";	
		// print_r($outcome);
		// echo "<br/>is_array_str_elements<br/>";

		if(!is_null($outcome) && !empty($outcome->first_str) && empty($outcome->raw_str_remaing)) {
			// 모든 문자열에 String형 요소를 가진 배열로 끝남.
			return true;
		}
		return false;
	}
	// REMOVE ME
	/*
		@ Desc : 배열 내에 요소들을 문자열에서 추출해서 배열에 넣고 반환합니다.
		@ Example : "[1,2,3,4]" --> [1,2,3,4]
		@ Return : 1. 1 depth 배열 객체
	*/
	private static function get_flat_array_from_str($target_str, $parser_depth=0){

		$target_str = str_replace("[", "", $target_str);
		$target_str = str_replace("]", "", $target_str);


	}
	// HERE
	// 1. 가장 먼저 해야 할 일은 [,{,},]의 인덱스를 파악해서 뎁스를 가지고 있는 구조체를 만들어야 한다.
	// 오로지 위의 조건만을 활용할 것.
	// 배열과 객체의 구분이 모두 확인된 이후에 문자열을 변환해야 함.
	/*
		@ Desc : 주어진 시작과 끝 문자열 사이의 1 depth의 문자열을 가져옵니다.
		@ Example : 
		Given opening char : "["
		Given closing char : "]"
		Given whole text : "[[1,2,3],[1,2,3],[1,2,3]]"
		Return : "[1,2,3],[1,2,3],[1,2,3]"
	*/
	private static function get_str_between_open_n_close_char($target_str, $parser_depth=0, $delimiter_head="", $delimiter_tail=""){

		$cur_step = "get_str_between_open_n_close_char";

		$patterns = "\[|\]|\{|\}";
		if(!empty($delimiter_head) && !empty($delimiter_tail)) {
			$patterns = $delimiter_head . "|" . $delimiter_tail;
		}
		$outcome_arr = self::get_all_matched_str($patterns, $target_str);

		self::print_me("$cur_step / \$target_str :: $target_str",$parser_depth);
		self::print_me("$cur_step / \$parser_depth :: $parser_depth",$parser_depth);
		self::print_me("$cur_step / \$outcome_arr / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($outcome_arr);
		self::print_me("$cur_step / \$outcome_arr / END",$parser_depth);

		if(empty($outcome_arr)) {
			return null;
		}


		$first_char = substr($target_str,0,1);
		self::print_me("$cur_step / \$first_char :: $first_char",$parser_depth);
		if(empty($delimiter_head) && empty($delimiter_tail)) {

			if(strcmp(self::$CHAR_LEFT_CURLY_BRACKET,$first_char) == 0) {

				self::print_me("$cur_step / 1-1. 첫번째 글자가 \"{\" 이면 오브젝트 1 depth 구성",$parser_depth);
				$delimiter_head = self::$CHAR_LEFT_CURLY_BRACKET;
				$delimiter_tail = self::$CHAR_RIGHT_CURLY_BRACKET;

			} else if(strcmp(self::$CHAR_LEFT_SQUARE_BRACKET,$first_char) == 0) {

				self::print_me("$cur_step / 1-2. 첫번째 글자가 \"[\" 이면 배열 1 depth 구성",$parser_depth);
				$delimiter_head = self::$CHAR_LEFT_SQUARE_BRACKET;
				$delimiter_tail = self::$CHAR_RIGHT_SQUARE_BRACKET;

			}

		} else if(strcmp(self::$CHAR_DOUBLE_QUOTATION,$first_char) == 0) {

			self::print_me("$cur_step / 1-3. 첫번째 글자가 \" 이면 객체 속성",$parser_depth);

		}

		$cur_depth = 0;
		$result_arr;
		$first_depth_idx_arr = array();
		for($idx = 0; $idx < count($outcome_arr); $idx++) {
			$cur_match = $outcome_arr[$idx];
			$cur_char = $cur_match[0];
			$cur_char_idx = $cur_match[1];

			echo "\$cur_char :: $cur_char<br/>";
			echo "\$cur_depth :: $cur_depth<br/>";

			if(strcmp($delimiter_head,$cur_char) == 0) {
				// down 1 depth

				echo "001<br/>";
				echo "001-\$cur_depth :: $cur_depth<br/>";

				$cur_depth += 1;
				if(1 == $cur_depth) {
					// create new array
					$result_arr = array();
					array_push($first_depth_idx_arr, $cur_char_idx);
				}

			} else if(strcmp($delimiter_tail,$cur_char) == 0) {
				// up 1 depth

				echo "002<br/>";
				echo "002-\$cur_depth :: $cur_depth<br/>";

				$cur_depth -= 1;
				if(0 == $cur_depth) {
					// 문자가 $delimiter_tail 이고 depth가 0이면 배열이 종료된 것.
					array_push($first_depth_idx_arr, $cur_char_idx);
					break;
				}

			} // outer if end

		} // for end

		//$PATTERN_OBJ_ATTR_KEY_ENDS_OTHER_VALUE_BEGINS

		self::print_me("$cur_step / 3. first_depth_idx_arr / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($first_depth_idx_arr);
		self::print_me("$cur_step / 3. first_depth_idx_arr / END<br/>",$parser_depth);

		// 배열의 엘리먼트를 나타내는 문자열의 경우, 자신 다음 객체를 나타내는 문자열도 반환해 줘야 한다.
		$target_str_len = strlen($target_str);
		$target_str_remaining = "";
		$target_str_contain = "";
		$target_str_remaining_inside = "";
		$target_str_remaining_outside_tail = "";

		if($first_depth_idx_arr[1] < ($target_str_len - 1)) {

			self::print_me("$cur_step / 객체 유효 범위 뒤에도 문자열이 남아있습니다.",$parser_depth);
			$target_str_remaining_inside = substr($target_str,$first_depth_idx_arr[0] + 1,$first_depth_idx_arr[1] - 1);
			$target_str_contain = $target_str_remaining_inside;
			$target_str_remaining_outside_tail = substr($target_str,$first_depth_idx_arr[1] + 1,$target_str_len);
			$target_str_remaining = $target_str_remaining_outside_tail;

		} else {

			self::print_me("$cur_step / 객체 유효 범위가 문자열과 같습니다.",$parser_depth);
			$target_str_remaining_inside = substr($target_str,$first_depth_idx_arr[0] + 1,$first_depth_idx_arr[1] - 1);
			$target_str_contain = $target_str_remaining_inside;
			$target_str_remaining = "";

		}

		$result = new stdClass();
		$result->container = $container;
		$result->str_contain = $target_str_contain;
		$result->str_remaining = $target_str_remaining;
		$result->first_depth_idx_arr = $first_depth_idx_arr;

		$is_array = false;
		$is_object = false;
		if(!empty($first_depth_idx_arr) && (count($first_depth_idx_arr) == 2)) {
			if(strcmp(self::$CHAR_LEFT_CURLY_BRACKET,$first_char) == 0) {
				// object 객체입니다.
				$is_object = true;
			} else if(strcmp(self::$CHAR_LEFT_SQUARE_BRACKET,$first_char) == 0) {
				// array 객체입니다.
				$is_array = true;

			}
		}
		$result->is_array = $is_array;
		$result->is_object = $is_object;

		return $result;
	}
	/*
		@ Desc : 주어진 시작과 끝 문자열 사이의 object attribute 문자열을 가져옵니다.
		@ Example : 
		Given whole text : '"__action_name":"Present awrard ( < 1 min )"'
		Return : {__action_name:"Present awrard ( < 1 min )"}
	*/
	private static function get_attr_key_n_value_between_str($target_str, $parser_depth=0){

		$cur_step = "get_attr_key_n_value_between_str";

		$patterns = "\":|\"";
		$outcome_arr = self::get_all_matched_str($patterns, $target_str);

		self::print_me("$cur_step / \$target_str :: $target_str",$parser_depth);
		self::print_me("$cur_step / \$parser_depth :: $parser_depth",$parser_depth);
		self::print_me("$cur_step / \$outcome_arr / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($outcome_arr);
		self::print_me("$cur_step / \$outcome_arr / END",$parser_depth);

		if(empty($outcome_arr)) {
			return null;
		}

		$delimeter_idx = $outcome_arr[1][1]; 
		$target_str_len = strlen($target_str);

		$attr_key = substr($target_str, 1, $delimeter_idx - 1);
		$attr_value = substr($target_str, $delimeter_idx + 2, ($target_str_len - $delimeter_idx));

		self::print_me("$cur_step / \$attr_key :: $attr_key",$parser_depth);
		self::print_me("$cur_step / \$attr_value :: $attr_value",$parser_depth);

		$result = new stdClass();
		$result->{$attr_key} = $attr_value;

		return $result;
	}		

	/*
		@ Desc : 배열과 객체의 표시 문자를 사용하여 1 depth 까지의 구조를 만들어 줍니다. 추가적인 구조는 재귀 호출을 이용해서 해결합니다.
	*/
	private static function get_object_hierarchy($target_str, $parser_depth=0){

		$cur_step = "get_object_hierarchy";
		self::print_me("$cur_step / \$target_str :: $target_str",$parser_depth);
		self::print_me("$cur_step / \$parser_depth :: $parser_depth",$parser_depth);

		$result = 
		self::get_str_between_open_n_close_char(
			// $target_str
			$target_str 
			// $parser_depth=0
			, $parser_depth + 1
		);

		self::print_me("$cur_step / 1. result / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($result);
		self::print_me("$cur_step / 1. result / END",$parser_depth);

		$str_contain = $result->str_contain;
		$str_remaining = $result->str_remaining;

		if(!empty($str_contain)) {

			$result_from_str_contain = 
			self::get_str_between_open_n_close_char(
				// $target_str
				$str_contain 
				// $parser_depth=0
				, $parser_depth + 1
			);

			self::print_me("$cur_step / 2-1. result_from_str_contain / BEGIN<br/>",$parser_depth);
			self::print_hierarchy($result_from_str_contain);
			self::print_me("$cur_step / 2-1. result_from_str_contain / END",$parser_depth);

			$next_result_from_str_contain =
			self::get_str_between_open_n_close_char(
				// $target_str
				$result_from_str_contain->str_contain
				// $parser_depth=0
				, $parser_depth + 1
			);

			self::print_me("$cur_step / 2-2. next_result_from_str_contain / BEGIN<br/>",$parser_depth);
			self::print_hierarchy($next_result_from_str_contain);
			self::print_me("$cur_step / 2-2. next_result_from_str_contain / END",$parser_depth);

			if(is_null($next_result_from_str_contain) && !empty($result_from_str_contain->str_contain)) {
				self::print_me("$cur_step / 3-1. 문자열 내부에 객체 또는 배열이 있지 않습니다.",$parser_depth);
				
				if($result_from_str_contain->is_object) {
					self::print_me("$cur_step / 3-1-1. 문자열 내부에 배열, 객체가 없고, \"{key:1,value:3}\"의 형태인 경우.",$parser_depth);

					// '\"'로 감싸져 있는 문자열을 depth로 확인.

					//$target_str, $parser_depth=0, , $delimiter_tail=null
					$obj_from_str_contain =
					self::get_attr_key_n_value_between_str(
						// $target_str
						$result_from_str_contain->str_contain
						// $parser_depth=0
						, $parser_depth + 1
						// $delimiter_head=null
						, self::$CHAR_DOUBLE_QUOTATION
						// $delimiter_tail=null
						, self::$PATTERN_OBJ_ATTR_KEY_ENDS_OTHER_VALUE_BEGINS
					);

					self::print_me("$cur_step / 3-1-1. obj_from_str_contain / BEGIN<br/>",$parser_depth);
					self::print_hierarchy($obj_from_str_contain);
					self::print_me("$cur_step / 3-1-1. obj_from_str_contain / DONE<br/>",$parser_depth);




				} else if($result_from_str_contain->is_array) {
					self::print_me("$cur_step / 3-1-2. 문자열 내부에 배열, 객체가 없고, \"[1,2,3]\"의 형태인 경우.",$parser_depth);
					$arr_element_arr = explode(",",$result_from_str_contain->str_contain);

					self::print_me("$cur_step / 3-1-2. \$arr_element_arr / BEGIN<br/>",$parser_depth);
					print_r($arr_element_arr);
					self::print_me("$cur_step / 3-1-2. \$arr_element_arr / END<br/>",$parser_depth);

				}

				

			}




		}

		if(!empty($str_remaining)) {

			$result_from_str_remaining = 
			self::get_str_between_open_n_close_char(
				// $target_str
				$str_remaining 
				// $parser_depth=0
				, $parser_depth + 1
			);

			self::print_me("$cur_step / 3. result_from_str_remaining / BEGIN<br/>",$parser_depth);
			self::print_hierarchy($result_from_str_remaining);
			self::print_me("$cur_step / 3. result_from_str_remaining / END",$parser_depth);

		}


		/*

		$cur_depth = 0;
		$result_arr;
		$first_depth_idx_arr = array();
		for($idx = 0; $idx < count($outcome_arr); $idx++) {
			$cur_match = $outcome_arr[$idx];
			$cur_char = $cur_match[0];
			$cur_char_idx = $cur_match[1];

			if(strcmp($delimiter_head,$cur_char) == 0) {
				// down 1 depth
				$cur_depth++;
				
				if(1 == $cur_depth) {
					// create new array
					$result_arr = array();
					array_push($first_depth_idx_arr, $cur_char_idx);
				}

			} else if(strcmp($delimiter_tail,$cur_char) == 0) {
				// up 1 depth
				$cur_depth--;

				if(0 == $cur_depth) {
					// 문자가 "]"이고 depth가 0이면 배열이 종료된 것.
					array_push($first_depth_idx_arr, $cur_char_idx);
					break;
				}

			} // outer if end

		} // for end

		self::print_me("$cur_step / \$first_depth_idx_arr / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($first_depth_idx_arr);
		self::print_me("$cur_step / \$first_depth_idx_arr / END",$parser_depth);

		// 배열의 엘리먼트를 나타내는 문자열의 경우, 자신 다음 객체를 나타내는 문자열도 반환해 줘야 한다.
		$target_str_len = strlen($target_str);
		$target_str_remaining = "";
		$target_str_contain = "";
		$target_str_remaining_inside = "";
		$target_str_remaining_outside_tail = "";

		self::print_me("$cur_step / \$target_str_len::$target_str_len",$parser_depth);


		if($first_depth_idx_arr[1] < ($target_str_len - 1)) {

			self::print_me("$cur_step / 객체 유효 범위 뒤에도 문자열이 남아있습니다.",$parser_depth);
			$target_str_remaining_inside = substr($target_str,$first_depth_idx_arr[0] + 1,$first_depth_idx_arr[1] - 1);
			$target_str_contain = $target_str_remaining_inside;
			$target_str_remaining_outside_tail = substr($target_str,$first_depth_idx_arr[1] + 1,$target_str_len);
			$target_str_remaining = $target_str_remaining_outside_tail;
			$next_first_char = substr($target_str_remaining_outside_tail, 0, 1);

			self::print_me("$cur_step / \$target_str_remaining_inside :: $target_str_remaining_inside",$parser_depth);
			self::print_me("$cur_step / \$target_str_remaining_outside_tail :: $target_str_remaining_outside_tail",$parser_depth);
			self::print_me("$cur_step / \$next_first_char :: $next_first_char",$parser_depth);

			if(!empty($next_first_char) && (strcmp($next_first_char, ",") == 0)){
				self::print_me("$cur_step / 쉼표가 남아있습니다.",$parser_depth);

				// 1 depth의 "["과 "]" 사이의 문자열을 가져옵니다.

			}

			// 1. 문자열이 남아 있다면, 
			// 1-1. 쉼표?
			// 1-1. 배열의 엘리먼트인가?
			// 1-2. 객체인가?



		} else {
			self::print_me("$cur_step / 객체 유효 범위가 문자열과 같습니다.",$parser_depth);
			$target_str_remaining_inside = substr($target_str,$first_depth_idx_arr[0] + 1,$first_depth_idx_arr[1] - 1);
			$target_str_contain = $target_str_remaining_inside;
			$target_str_remaining = $target_str_remaining_inside;
		}

		self::print_me("$cur_step / \$target_str_remaining_inside::$target_str_remaining_inside",$parser_depth);
		self::print_me("$cur_step / \$target_str_remaining_outside_tail::$target_str_remaining_outside_tail",$parser_depth);

		$result = new stdClass();
		$result->container = $container;
		$result->str_contain = $target_str_contain;
		$result->str_remaining = $target_str_remaining;

		// 문자열이 남아있다면 재귀 호출!
		if(!empty($target_str_remaining)) {
			$result_from_recursive_call = self::get_object_hierarchy($target_str_remaining, $parser_depth + 1);

			self::print_me("$cur_step / \$result_from_recursive_call / BEGIN<br/>",$parser_depth);
			self::print_hierarchy($result_from_recursive_call);
			self::print_me("$cur_step / \$result_from_recursive_call / END",$parser_depth);				

			//$container_from_recursive_call = $result_from_recursive_call->container;
		}
		*/


		return $result;
	}
	/*
		@ Desc : 배열 내에 배열을 포함한 문자열을 이중 배열 객체로 만들어 줍니다. 단, 내부 배열의 내용은 모두 문자열입니다. MAX 2 depth.
		@ Return : 1. 이중 배열 객체 2. 이중 배열 객체를 만들고 난 나머지 문자열
	*/
	private static function get_array_with_array_element($target_str, $parser_depth=0){

		$cur_step = "get_array_with_array_element";
		self::print_me("$cur_step :: \$target_str :: ",$parser_depth);
		self::print_me("$target_str",$parser_depth);

		$result = new stdClass();
		if(empty($target_str)) {
			return $result;
		}

		// 1. 배열의 모든 right square bracket과 left square bracket을 검사합니다. 
		// 각 문자의 위치와 갯수를 파악해서 각 배열의 시작과 끝을 파악해야 합니다.
		// 내부 배열이 가지고 있는 내용은 문자열로 그대로 저장합니다.
		// 2 depth의 배열 객체를 만들어 돌려줍니다.

		// 1-1. [
		// 1-2. ]

		// TODO

		$patterns = "\[|\]";
		$outcome_arr = 
		self::get_all_matched_str($patterns, $target_str);

		$cur_depth = 0;
		$result_arr;
		$first_depth_idx_arr = array();
		$second_depth_idx_arr = array();
		for($idx = 0; $idx < count($outcome_arr); $idx++) {
			$cur_match = $outcome_arr[$idx];
			$cur_char = $cur_match[0];
			$cur_char_idx = $cur_match[1];

			if(strcmp(self::$CHAR_LEFT_SQUARE_BRACKET,$cur_char) == 0) {
				// down 1 depth
				$cur_depth++;
				
				if(1 == $cur_depth) {
					// create new array
					$result_arr = array();
					array_push($first_depth_idx_arr, $cur_char_idx);
				} else if(2 == $cur_depth) {
					// add child array
					array_push($result_arr, array());
					array_push($second_depth_idx_arr, array($cur_char_idx));
				}

			} else if(strcmp(self::$CHAR_RIGHT_SQUARE_BRACKET,$cur_char) == 0) {
				// up 1 depth
				$cur_depth--;

				if(0 == $cur_depth) {
					// 문자가 "]"이고 depth가 0이면 배열이 종료된 것.
					array_push($first_depth_idx_arr, $cur_char_idx);
					break;
				} else if(1 == $cur_depth) {
					// create new array
					$last_idx = (count($second_depth_idx_arr)-1);
					$second_depth_arr = $second_depth_idx_arr[$last_idx];
					array_push($second_depth_arr, $cur_char_idx);
					$second_depth_idx_arr[$last_idx] = $second_depth_arr;
						
				} // inner if end

			} // outer if end


		} // for end

		$first_depth_idx_head = $first_depth_idx_arr[0];
		$first_depth_idx_tail = $first_depth_idx_arr[COUNT($first_depth_idx_arr)-1];
		if(!empty($second_depth_idx_arr)) {

			// 1. 이중 배열입니다.
			// 2 depth에 넣을 내용을 가져와 내부 배열에 넣습니다.
			$remaining_content = "";
			for($idx = 0; $idx < count($second_depth_idx_arr); $idx++) {

				$result_inner_arr = $result_arr[$idx];

				$second_depth = $second_depth_idx_arr[$idx];
				$idx_content_begins = $second_depth[0] + 1;
				$idx_content_ends = $second_depth[1];
				$content_length = ($idx_content_ends - $idx_content_begins);

				$cur_content = substr($target_str, $idx_content_begins, $content_length);
				
				array_push($result_inner_arr, $cur_content);
				$result_arr[$idx] = $result_inner_arr;

			}

		} else {

			// 2. 이중 배열이 아닙니다. 문자열을 배열에 넣습니다.
			$cur_content = substr($target_str, $first_depth_idx_head, $first_depth_idx_tail + 1);

			self::print_me("$cur_step :: \$cur_content :: $cur_content",$parser_depth);

			// 배열 엘리먼트의 내용이 
			// 1. [1,2,3]
			// 2. ["A","B","C"]
			// 와 같다면 

			// "[\"A\":{}]","[\"A\":{\"A1\":\"A1_V\",\"A2\":\"A2_V\",\"A3\":\"A3_V\"}]"
			// \",\" --> 요 패턴으로 나누면 위와 같은 형식은 내부 중첩된 쉼표를 자르게 된다.


			// 2-1. 1-depth 배열 객체를 얻습니다.
			$result_array_1_depth = 
			self::parse_json_str_safe(
				// $unsafe_json_str
				$cur_content
				// $parent_obj=null
				,  null
				// $parser_depth=0
				, $parser_depth + 1
			);
			self::print_me("$cur_step :: \$result_array_1_depth / BEGIN<br/>",$parser_depth);
			self::print_hierarchy($result_array_1_depth);
			self::print_me("$cur_step :: \$result_array_1_depth / DONE",$parser_depth);

			array_push($result_arr, $cur_content);

		}

		// $remaining_content = substr($target_str, $content_length, $idx_content_ends);
		$remaining_content = substr($target_str, $first_depth_idx_tail + 1, strlen($target_str));

		self::print_me("$cur_step :: \$first_depth_idx_arr / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($first_depth_idx_arr);
		self::print_me("$cur_step :: \$first_depth_idx_arr / DONE",$parser_depth);
		self::print_me("$cur_step :: \$first_depth_idx_tail :: $first_depth_idx_tail",$parser_depth);

		self::print_me("$cur_step :: \$second_depth_idx_arr / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($second_depth_idx_arr);
		self::print_me("$cur_step :: \$second_depth_idx_arr / DONE",$parser_depth);

		$result->result_arr = $result_arr;
		$result->remaining_str = $remaining_content;

		self::print_me("$cur_step :: \$result / BEGIN<br/>",$parser_depth);
		self::print_hierarchy($result);
		self::print_me("$cur_step :: \$result / DONE",$parser_depth);

		return $result;
	}	
	/*
		@ Desc : [["1,2,3"],["\"A\",\"B\",\"C\""],["4,5,6"],["{\"KEY\":\"FACE\"},{\"KEY1\":1234}"]]" 타입의 이중 배열 객체인지 확인한다.
	*/
	private static function is_array_has_array_elements_has_string_elements($target_array) {

		if(!is_array($target_array) && empty($target_array)) {
			return false;
		}

		for($idx = 0;$idx < count($target_array);$idx++) {
			$target_sub_array = $target_array[$idx];

			if(!is_array($target_sub_array) && empty($target_sub_array)) {
				return false;
			}
		}

		return true;
	}
	/*
		@ Desc : "[[1,2,3],["A","B","C"],[4,5,6],[{"KEY":"FACE"},{"KEY1":1234}]]" 타입의 배열 문자인지 확인한다.
	*/
	private static function is_string_array_has_array_elements($target_str) {

		$pattern_arr_element_array = "^\[\[";
		$outcome = 
		self::get_first_matched_str($pattern_arr_element_array, $target_str);

		// echo "<br/>is_string_array_has_array_elements<br/>";	
		// echo "<br/>\$target_str :: $target_str<br/>";	
		// echo "<br/>is_string_array_has_array_elements<br/>";	
		// print_r($outcome);
		// echo "<br/>is_string_array_has_array_elements<br/>";

		if(!is_null($outcome) && !empty($outcome->first_str) && empty($outcome->raw_str_remaing)) {
			// 모든 문자열에 String형 요소를 가진 배열로 끝남.
			return true;
		}
		return false;
	}
	private static function is_array($target_obj) {
		if(is_null($target_obj)) return false;

		return (strcmp(gettype($target_obj),"array") == 0);
	}
	private static function is_object($target_obj) {
		if(is_null($target_obj)) return false;

		return (strcmp(gettype($target_obj),"object") == 0);
	}
	/*
		@ Desc : 객체 내부의 구조를 트리맵으로 보여줍니다. print_r 대신 사용. 다시 커스터마이징 완료.
		@ Doc : http://stackoverflow.com/questions/14740429/flat-php-array-to-hierarchy-tree
	*/
	public static function print_hierarchy($datas){
		$hierarchy_str = self::make_hierarchy_str($datas);
		echo "$hierarchy_str";
	}
	private static function make_hierarchy_str($datas, $depth=0){

	    if($depth > 1000) return ''; // Make sure not to have an endless recursion

	    $tree = "<ul>";
	    if(is_array($datas)) {

	    	$tree .= "<li>ARRAY";
			foreach ($datas as $value) {

				if(is_array($value)) {
					// 1. 값이 배열
					$tree .= self::make_hierarchy_str($value, $depth + 1);

				} else if(is_object($value)) {
					// 2. 값이 객체
					$tree .= self::make_hierarchy_str($value, $depth + 1);

				} else {
					// 3. 값이 문자 혹은 숫자
					$tree .= "<ul><li>::$value::</li></ul>";
				}
			    
			}
			$tree .= "</li>";

	    } else if(is_object($datas)) {

	    	$tree .= "<li>OBJECT";
			foreach($datas as $key => $value) {

				if(is_array($value)) {
					// 1. 값이 배열
					$tree .= "<ul><li>::$key::";
					$tree .= self::make_hierarchy_str($value, $depth + 1);
					$tree .= "</li></ul>";

				} else if(is_object($value)) {
					// 2. 값이 객체
					$tree .= "<ul><li>::$key::";
					$tree .= self::make_hierarchy_str($value, $depth + 1);
					$tree .= "</li></ul>";

				} else {
					// 3. 값이 문자 혹은 숫자
					$tree .= "<ul><li>::$key::<ul><li>::$value::</li></ul></li></ul>";
				}

			}
			$tree .= "</li>";

	    }

	    $tree .= "</ul>";

	    return $tree;
	}	

}

?>
