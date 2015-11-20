<?php

	// common setting
	include_once("../common.inc");
	include_once("../db/toast-master/mysql.interface.toast-master.inc");

	$wdj_mysql_interface = new MYSQLInterface($wdj_mysql_manager);
	$result = new stdClass();
	$result->query_output_arr = array();
	$debug = "";
	$debug_stack_array = array();

	function terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug="") {
		// CLOSE DB
		$wdj_mysql_interface->close();

		// OUTPUT
		$result->debug=$debug;
		$result->debug_stack_array=$debug_stack_array;
		echo json_encode($result);

		return;
	}




	// 고려해야할 조건들
	// 1. 지금 시간.
	// 2. 친밀도.
	// 3. 오랜만이 방문인지 여부. --> 방문횟수를 기록해야 하는건가?

	function getRandomElement($MSG_ARR, $LIMIT=-1) {

		if($LIMIT == -1) {
			$random_idx = rand(0,(COUNT($MSG_ARR)-1));
		} else {
			$random_idx = rand(0,$LIMIT);
		}
		
		return $MSG_ARR[$random_idx];
	}

	function getGreetingOnTime() {

		// 시간에 따른 인사를 가져옵니다.
		$HOUR = intval(date('H'));
		if((20 <= $HOUR && $HOUR <= 24) || (1 <= $HOUR && $HOUR <= 6)) {
			// NIGHT
			$COMMENT_ON_TIME = "It's a little bit late night.<br/>Don't you feel any tired?";
		} else if((6 <= $HOUR && $HOUR <= 9)) {
			// MORNING
			$COMMENT_ON_TIME = "Lovely sunshine! Good morning!<br/>Why did you get up so early?";
		} else if((9 <= $HOUR && $HOUR <= 12)) {
			// BEFORE LUNCH
			$COMMENT_ON_TIME = "You're busy, aren't you?<br/>Sorry, I don't mean to bother you.";
		}

		return $COMMENT_ON_TIME;
	}

	function getSupriseMessage() {
		// 강한 감탄사를 랜덤으로 가져옵니다.
		$MSG_ARR = 
		array(
			"Really?"
			, "What?"
			, "What a surprise!"
			, "Well I never!"
			, "That's the last thing I expected!"
			, "You're kidding!"
			, "I don't believe it!"
			, "Are you serious?"
			, "I'm speechless!"
			, "I'd never have guessed!"
			, "You don't say!"
			, "Wow!"
		);

		return getRandomElement($MSG_ARR);
	}

	function getGreetings() {
		// 인사를 랜덤으로 가져옵니다.
		// referer
		// http://www.fluentu.com/english/blog/english-greetings-expressions/
		$MSG_ARR = 
		array(
			"Hey"
			, "Hello"
			, "Hello, there"
			, "Hi"
			, "What’s up?"
			, "What’s new?"
			, "What’s going on?"
			, "How’s everything?"
			, "How are things?"
			, "How’s life?"
			, "Good to see you"
			, "Nice to see you"
		);

		return getRandomElement($MSG_ARR);
	}

	function getGreetingsForAWhile() {
		// 인사를 랜덤으로 가져옵니다.
		// referer
		// http://www.fluentu.com/english/blog/english-greetings-expressions/
		$MSG_ARR = 
		array(
			"Long time no see."
			, "It’s been a while."
			, "How have you been?"
			, "what’s new?"
		);

		return getRandomElement($MSG_ARR);
	}

	function getGreetingsFirstMet() {
		// 처음 만나는 사람과의 인사를 랜덤으로 가져옵니다.
		$MSG_ARR = 
		array(
			"Hello"
			, "Hello, there."
			, "Hi"
			, "How are you?"
		);

		return getRandomElement($MSG_ARR);
	}

	function getRoleMessageMostImproved($MYSQL, $PARAMS, $MEMBER_ID, $MEETING_MEMBERSHIP_ID) {

		if(!($MEMBER_ID > 0) || !($MEETING_MEMBERSHIP_ID > 0)) return "";

		// 롤에 대해 칭찬하거나 부족한 롤을 맡도록 권하는 메시지를 보여줍니다.
		$MOST_ADVANCED_ROLE_LIST = array();
		$MOST_BEHIND_ROLE_LIST = array();
		$MOST_ADVANCED_ROLE_ID = -1;

		$MSG_ABOUT_MOST_ADVANCED_ROLE = "";

		$MSG_SURPRIZE = getSupriseMessage();

		$MSG_PROUD_ARR = 
		array(
			"<span style=\"color:#FFF;\">$MSG_SURPRIZE You did <strong>$PARAMS->REPLACE_ME</strong> times!</span>"
			, "<span style=\"color:#FFF;\">$MSG_SURPRIZE You've done <strong>$PARAMS->REPLACE_ME</strong> times!</span>"
		);

		$MSG_PROUD = getRandomElement($MSG_PROUD_ARR);
		$MSG_ARR = array();
		$ROLE_CNT_MIN = 4;

		// 1. 스피치 기록
		$role_id_speaker = 111;
		$role_history = $MYSQL->get_speech_history($MEETING_MEMBERSHIP_ID, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," speeches " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_speaker"]=$MSG;
		}

		// 2. 이벨류에이터 기록
		$role_id_evaluator = 222;
		$role_history = $MYSQL->get_evaluation_history($MEETING_MEMBERSHIP_ID, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," evaluations " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_evaluator"]=$MSG;
		}

		// 3. 롤별 기록
		// 3-1. TOASTMASTER
		$role_id_toastmaster = 2;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_toastmaster, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," toast master " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_toastmaster"]=$MSG;
		}

		// 3-2. WORD & QUOTE MASTER
		$role_id_word_n_quote_master = 4;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_word_n_quote_master, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," word & quote master " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_word_quote_master"]=$MSG;
		}

		// 3-3. TABLE TOPIC MASTER
		$role_id_table_topic_master = 5;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_table_topic_master, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," table topic master " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_table_topic_master"]=$MSG;
		}

		// 3-4. MINI DEBATE MASTER
		$role_id_mini_debate_master = 6;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_mini_debate_master, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," mini debate master " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_mini_debate_master"]=$MSG;
		}

		// 3-5. GENERAL EVALUATOR
		$role_id_general_evaluator = 7;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_general_evaluator, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," general evaluator " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_general_evaluator"]=$MSG;
		}
 
		// 3-6. GRAMMARIAN
		$role_id_grammarian = 11;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_grammarian, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," grammarian " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_grammarian"]=$MSG;
		}

		// 3-7. AH COUNTER
		$role_id_ah_counter = 10;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_ah_counter, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," ah counter " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_ah_counter"]=$MSG;
		}

		// 3-8. TIMER
		$role_id_timer = 9;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_timer, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME," timer " . COUNT($role_history),$MSG_PROUD);
		if($ROLE_CNT_MIN < $cur_role_cnt) {
			$MSG_ARR[$cur_role_cnt . "_timer"]=$MSG;
		}

		// SORT BY CNT DESC
		krsort($MSG_ARR);

		// flat the key value array 
		$MSG_ARR_FLAT = array_values($MSG_ARR);

		// 랜덤으로 엘리먼트 하나 가져오기.
		$MSG_SELECTED = getRandomElement($MSG_ARR_FLAT);

		return $MSG_SELECTED;
	}

	function getRoleMessageMostBehind($MYSQL, $PARAMS, $MEMBER_ID, $MEETING_MEMBERSHIP_ID) {

		if(!($MEMBER_ID > 0) || !($MEETING_MEMBERSHIP_ID > 0)) return "";

		// 부족한 롤을 맡도록 권하는 메시지를 보여줍니다.
		$MEETING_MEMBERSHIP_ID = intval($WHAT_I_AM_JESSIE->__membership_id);
		$MOST_BEHIND_ROLE_LIST = array();
		$MOST_ADVANCED_ROLE_ID = -1;

		$MSG_ABOUT_MOST_BEHIND_ROLE = "";
		$MSG_RECOMMEND_ROLE = 
		array(
			"<span style=\"color:#FFF;\">Why don't you take $PARAMS->REPLACE_ME on next meeting?</span>"
			, "<span style=\"color:#FFF;\">It would be perfect time to be $PARAMS->REPLACE_ME oncoming meeting!</span>"
			, "<span style=\"color:#FFF;\">It is the right time for being "  . $PARAMS->REPLACE_ME . "!</span>"
		);
		$MSG_RECOMMEND = getRandomElement($MSG_RECOMMEND_ROLE);

		// 1. 스피치 기록
		$role_id_speaker = 111;
		$role_history = $MYSQL->get_speech_history($MEETING_MEMBERSHIP_ID, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>speaker</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_speaker"]=$MSG;

		// 2. 이벨류에이터 기록
		$role_id_evaluator = 222;
		$role_history = $MYSQL->get_evaluation_history($MEETING_MEMBERSHIP_ID, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"an <strong>evaluator</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_evaluator"]=$MSG;

		// 3. 롤별 기록
		// 3-1. TOAST MASTER
		$role_id_toastmaster = 2;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_toastmaster, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>toastmaster</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_toastmaster"]=$MSG;

		// 3-2. WORD & QUOTE MASTER
		$role_id_word_n_quote_master = 4;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_word_n_quote_master, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>word & quote master</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_word_quote_master"]=$MSG;

		// 3-3. TABLE TOPIC MASTER
		$role_id_table_topic_master = 5;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_table_topic_master, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>table topic master</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_table_topic_master"]=$MSG;

		// 3-4. MINI DEBATE MASTER
		$role_id_mini_debate_master = 6;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_mini_debate_master, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>mini debate master</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_mini_debate_master"]=$MSG;

		// 3-5. GENERAL EVALUATOR
		$role_id_general_evaluator = 7;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_general_evaluator, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>general evaluator</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_general_evaluator"]=$MSG;

		// 3-6. GRAMMARIAN
		$role_id_grammarian = 11;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_grammarian, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>grammarian</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_grammarian"]=$MSG;

		// 3-7. AH COUNTER
		$role_id_ah_counter = 10;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_ah_counter, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>ah counter</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_ah_counter"]=$MSG;

		// 3-8. TIMER
		$role_id_timer = 9;
		$role_history = $MYSQL->get_role_history($MEETING_MEMBERSHIP_ID, $role_id_timer, $MEMBER_ID);
		$cur_role_cnt = COUNT($role_history);
		$MSG = str_replace($PARAMS->REPLACE_ME,"a <strong>timer</strong>",$MSG_RECOMMEND);
		$MSG_ARR[$cur_role_cnt . "_timer"]=$MSG;

		// SORT BY CNT DESC
		ksort($MSG_ARR);

		// flat the key value array 
		$MSG_ARR_FLAT = array_values($MSG_ARR);

		// 랜덤으로 엘리먼트 하나 가져오기.
		$MSG_SELECTED = getRandomElement($MSG_ARR_FLAT, 3);

		return $MSG_SELECTED;
	}	

	// TEST
	$TEST = $params->isYes($params->TEST);

	// 아래 2가지 정보로 대화의 방향과 진행상황을 결정합니다.
	// 사용자가 현재 있는 페이지 정보를 전달합니다.
	$WHERE_I_AM_JESSIE = $params->isYes($params->WHERE_I_AM_JESSIE);
	// 사용자의 현재 데이터를 전달합니다.
	$WHAT_I_AM_JESSIE_JSON_STR = $params->getParamString($params->WHAT_I_AM_JESSIE);
	$WHAT_I_AM_JESSIE = json_decode($WHAT_I_AM_JESSIE_JSON_STR);

	// GET PARAMS
	$IS_JESSIE_GREETING = $params->isYes($params->IS_JESSIE_GREETING);
	$COOKIE_JESSIE_DID_SAY_HELLO = $params->isYes($params->COOKIE_JESSIE_DID_SAY_HELLO);
	if($IS_JESSIE_GREETING) {
	// if($TEST) {

		//"{"__member_id":"571","__is_login":"YES","__member_first_name":"Wonder","__member_last_name":"Jung","__membership_name":"BDTM","__membership_id":"1"}"
		$MSG_GREETING = getGreetings();
		$COMMENT_ON_TIME = getGreetingOnTime();
		if($WHAT_I_AM_JESSIE->__is_login == $params->YES) {
		// if($TEST) {

			$GREETINGS = 
			array(
				"<span style=\"color:#FFF;\">$COMMENT_ON_TIME</span> <br/> <span style=\"color:#FF6699;\"><strong>" . $WHAT_I_AM_JESSIE->__member_first_name . "!</strong>"
				,"<span style=\"color:#FFF;\">It would be great if I can help you.</span> <br/> <span style=\"color:#FF6699;\"><strong>" . $WHAT_I_AM_JESSIE->__member_first_name . "!</strong></span>"
			);

		} else if(!$COOKIE_JESSIE_DID_SAY_HELLO) {
			// say hello in first time
			
			$GREETINGS = 
			array(
				"<span style=\"color:#FFF;\">$MSG_GREETING, <br/>My name is </span> <span style=\"color:#FF6699;\"><strong>Jessie.</strong></span> <br/><span style=\"color:#FFF;\">I'm here to assist your task.</span>"
				,"<span style=\"color:#FFF;\">$MSG_GREETING, I'm </span> <span style=\"color:#FF6699;\"><strong>Jessie.</strong></span> <br/><span style=\"color:#FFF;\">$COMMENT_ON_TIME</span>"
			);
		} else {
			
			$GREETINGS = 
			array(
				"<span style=\"color:#FFF;\">$COMMENT_ON_TIME <br/>It's me, </span> <span style=\"color:#FF6699;\"><strong>Jessie.</strong></span>"
				,"<span style=\"color:#FFF;\">You're back! <br/>It's me, </span> <span style=\"color:#FF6699;\"><strong>Jessie.</strong></span>"
			);
		}

		$random_idx = rand(0,(COUNT($GREETINGS)-1));
		array_push($result->query_output_arr,$GREETINGS[$random_idx]);	

	} else if($params->isYes($params->JESSIE_NEEDS_LOGIN)) {

		// 사용자에게 로그인을 권유합니다.
		$MSG_ARR = 
		array(
			"<span style=\"color:#FFF;\">You look great today!</span><br/> "
			. "<span style=\"color:#FFF;\">However I don't know who you are.</span> "
			. "<span style=\"color:#FFF;\">If you're <span style=\"color:#FF6699;\"><strong>login</strong></span>, I'd be your friend.</span>"

			,"<span style=\"color:#FFF;\">Good day to do somthing!</span><br/> "
			. "<span style=\"color:#FFF;\">However I have no idea who you are.</span> "
			. "<span style=\"color:#FFF;\">If you don't mind,</span><span style=\"color:#FFF;\">Just <span style=\"color:#FF6699;\"><strong>logged in.</strong></span>"
		);
		array_push($result->query_output_arr,getRandomElement($MSG_ARR));

	} else if($params->isYes($params->JESSIE_CHECK_MEMBER_STATUS)) {

		// 로그인 했다면 회원의 정보를 가져옵니다.
		$MEMBER_ID = intval($WHAT_I_AM_JESSIE->__member_id);
		$MEMBERSHIP_ID = intval($WHAT_I_AM_JESSIE->__membership_id);
		
		$MSG_ABOUT_MOST_ADVANCED_ROLE = getRoleMessageMostImproved($wdj_mysql_interface, $params, $MEMBER_ID, $MEMBERSHIP_ID);
		$MSG_ABOUT_MOST_BEHIND_ROLE = getRoleMessageMostBehind($wdj_mysql_interface, $params, $MEMBER_ID, $MEMBERSHIP_ID);

		$MSG_ARR = 
		array(
			$MSG_ABOUT_MOST_ADVANCED_ROLE
			, $MSG_ABOUT_MOST_BEHIND_ROLE
		);

		array_push($result->query_output_arr,getRandomElement($MSG_ARR));

	}	



	terminate($wdj_mysql_interface, $result, $debug_stack_array, $debug);

?>

