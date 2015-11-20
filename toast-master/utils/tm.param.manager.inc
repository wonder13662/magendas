<?php

class ToastMasterParamManager{

	private $param_array;

	public function ToastMasterParamManager(){

		// set param map
		$this->param_array = array();
		$class_vars = get_class_vars(get_class($this));
		foreach ($class_vars as $key => $value) {
		    $this->param_array[$key]=$value;
		}
	}

	private function hasNoKey($tossed_key){
		return !$this->hasKey($tossed_key);
	}

	private function hasKey($tossed_key){

		if(empty($this->param_array)) {
			return false;
		}

		foreach ($this->param_array as $key => $value) {
		    if(strcmp($key,$tossed_key) == 0) {
		    	return true;
		    }
		}
		return false;
	}

	public function getParamString($tossed_key, $placeholder=null){
		if( $this->hasNoKey($tossed_key) ) {
			return "";
		}

		$value = $this->getParam($tossed_key);
		// 값이 비어있고, 기본값이 있다면 이를 반환합니다.
		if(!is_null($placeholder) && is_null($value)) {
			$value = $placeholder;
		}

		return $value;
	}

	public function getParamNumber($tossed_key, $placeholder=null){
		if( $this->hasNoKey($tossed_key) ) {
			return -1;
		}

		$value = $this->getParam($tossed_key);
		// 값이 비어있고, 기본값이 있다면 이를 반환합니다.
		if(!is_null($placeholder) && (is_null($value) || empty($value))) {
			$value = $placeholder;
		}

		return intval($value);
	}

	public function isYes($tossed_key){
		if( $this->hasNoKey($tossed_key) ) {
			return false;
		}

		$value = $this->getParam($tossed_key);
		if(empty($value)) {
			return false;
		}

		if(strcmp($value,$this->YES)==0){
			return true;
		}

		return false;
	}

	private function getParam($key){
		$value = $_GET[$key];
		if(is_null($value)) {
			$value = $_POST[$key];
		}

		return $value;
	}

	public $YES="YES";
	public $NO="NO";

	public $MEETING_ID="MEETING_ID";
	public $MEETING_TEMPLATE_ID="MEETING_TEMPLATE_ID";
	public $TIMELINE_ID="TIMELINE_ID"; 

	public $WINDOW_SCROLL_Y="WINDOW_SCROLL_Y";
	public $IS_COPY="IS_COPY";
	public $IS_NEW_MEETING_HEADER="IS_NEW_MEETING_HEADER";
	public $IS_UPDATE_MEETING_HEADER="IS_UPDATE_MEETING_HEADER";
	public $IS_DELETE="IS_DELETE";
	
	public $IS_UPDATE_HEADER="IS_UPDATE_HEADER";
	public $ROUND="ROUND";
	public $THEME="THEME";
	public $START_DATE="START_DATE";
	public $IS_UPDATE_TODAY_ROLE="IS_UPDATE_TODAY_ROLE";
	public $ROLE_ID="ROLE_ID";

	public $IS_UPDATE_SCHEDULE_TIMELINE_SET="IS_UPDATE_SCHEDULE_TIMELINE_SET";
	public $TIMELINE_JSON_STR_ENCODED="TIMELINE_JSON_STR_ENCODED";
	public $IS_UPDATE_TIMELINE_AFTER_JOB="IS_UPDATE_TIMELINE_AFTER_JOB";

	public $IS_INSERT_SPEECH="IS_INSERT_SPEECH";
	public $IS_UPDATE_SPEECH="IS_UPDATE_SPEECH";
	public $IS_UPDATE_SPEECH_PROJECT="IS_UPDATE_SPEECH_PROJECT";
	public $IS_UPDATE_SPEECH_TITLE="IS_UPDATE_SPEECH_TITLE";
	public $IS_DELETE_SPEECH="IS_DELETE_SPEECH";

	public $IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER="IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER";
	public $SPEECH_TABLE_ROW_INFO_ARR_JSON_STR="SPEECH_TABLE_ROW_INFO_ARR_JSON_STR";

	public $IS_UPDATE_SPEECH_SPEAKER="IS_UPDATE_SPEECH_SPEAKER";
	public $IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_EVALUATOR="IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_EVALUATOR";
	public $SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR="SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR";

	public $IS_INSERT_SPEECH_EVALUATOR="IS_INSERT_SPEECH_EVALUATOR";
	public $IS_UPDATE_SPEECH_EVALUATOR="IS_UPDATE_SPEECH_EVALUATOR";
	public $IS_DELETE_SPEECH_EVALUATOR="IS_DELETE_SPEECH_EVALUATOR";

	public $SPEECH_ID="SPEECH_ID";
	public $EVALUATOR_ID="EVALUATOR_ID";
	public $ORDER_NUM="ORDER_NUM";
	public $SPEECH_PROJECT_ID="SPEECH_PROJECT_ID";
	public $SPEECH_PROJECT_TITLE="SPEECH_PROJECT_TITLE";
	public $SPEECH_TITLE="SPEECH_TITLE";
	public $SPEECH_SPEAKER_MEMBER_ID="SPEECH_SPEAKER_MEMBER_ID";
	public $SPEECH_SPEAKER_TIMER_ID="SPEECH_SPEAKER_TIMER_ID";
	public $SPEECH_SPEAKER_TIMER="SPEECH_SPEAKER_TIMER";
	public $SPEECH_SPEAKER_TIMER_GREEN="SPEECH_SPEAKER_TIMER_GREEN";
	public $SPEECH_SPEAKER_TIMER_RED="SPEECH_SPEAKER_TIMER_RED";
	public $SPEECH_EVALUATOR_MEMBER_ID="SPEECH_EVALUATOR_MEMBER_ID";
	public $SPEECH_EVALUATOR_TIMER_ID="SPEECH_EVALUATOR_TIMER_ID";
	public $SPEECH_EVALUATOR_TIMER="SPEECH_EVALUATOR_TIMER";

	public $IS_UPDATE_WORD_N_QUOTE_WORD_ONLY="IS_UPDATE_WORD_N_QUOTE_WORD_ONLY";
	public $IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY="IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY";
	public $IS_UPDATE_WORD_N_QUOTE_WORD_N_DESC="IS_UPDATE_WORD_N_QUOTE_WORD_N_DESC";
	public $IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY="IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY";

	public $WORD="WORD";
	public $WORD_DESC="WORD_DESC";
	public $QUOTE="QUOTE";

	public $NEWS_ID="NEWS_ID";
	public $NEWS_TITLE="NEWS_TITLE";
	public $NEWS_CONTENTS="NEWS_CONTENTS";

	public $IS_INSERT_NEWS="IS_INSERT_NEWS";
	public $IS_UPDATE_NEWS="IS_UPDATE_NEWS";
	public $IS_DELETE_NEWS="IS_DELETE_NEWS";

	public $IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS="IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS";
	public $NEWS_TABLE_ROW_INFO_ARR_JSON_STR="NEWS_TABLE_ROW_INFO_ARR_JSON_STR";

	public $IS_UPDATE_EXECUTIVE_MEMBER="IS_UPDATE_EXECUTIVE_MEMBER";
	public $EXECUTIVE_OFFICER_ID="EXECUTIVE_OFFICER_ID";
	public $EXECUTIVE_MEMBER_ID="EXECUTIVE_MEMBER_ID";

	public $IS_EDIT_ANYWAY="IS_EDIT_ANYWAY";




	//     dMMMMMMMMb  dMMMMMP dMMMMMMMMb  dMMMMb  dMMMMMP dMMMMb 
	//    dMP"dMP"dMP dMP     dMP"dMP"dMP dMP"dMP dMP     dMP.dMP 
	//   dMP dMP dMP dMMMP   dMP dMP dMP dMMMMK" dMMMP   dMMMMK"  
	//  dMP dMP dMP dMP     dMP dMP dMP dMP.aMF dMP     dMP"AMF   
	// dMP dMP dMP dMMMMMP dMP dMP dMP dMMMMP" dMMMMMP dMP dMP    

	public $IS_SELECT_MEMBER="IS_SELECT_MEMBER";
	public $IS_INSERT_MEMBER="IS_INSERT_MEMBER";
	public $IS_UPDATE_MEMBER="IS_UPDATE_MEMBER";
	public $IS_UPDATE_MEMBER_MEMBERSHIP_STATUS="IS_UPDATE_MEMBER_MEMBERSHIP_STATUS";
	public $IS_UPDATE_MEMBER_FIRST_NAME="IS_UPDATE_MEMBER_FIRST_NAME";
	public $IS_UPDATE_MEMBER_LAST_NAME="IS_UPDATE_MEMBER_LAST_NAME";
	public $IS_UPDATE_MEMBER_MOBILE="IS_UPDATE_MEMBER_MOBILE";
	public $IS_UPDATE_MEMBER_EMAIL="IS_UPDATE_MEMBER_EMAIL";
	public $IS_INSERT_MEMBER_N_MEMBERSHIP="IS_INSERT_MEMBER_N_MEMBERSHIP";
	public $GET_MEMBER_INFO="GET_MEMBER_INFO";
	public $MEMBER_ID="MEMBER_ID";
	public $MEMBER_FIRST_NAME="MEMBER_FIRST_NAME";
	public $MEMBER_LAST_NAME="MEMBER_LAST_NAME";
	public $MEMBER_HASH_KEY="MEMBER_HASH_KEY";
	public $MEMBER_MEMBERSHIP="MEMBER_MEMBERSHIP";
	public $MEETING_MEMBERSHIP_ID="MEETING_MEMBERSHIP_ID";
	public $MEMBER_MOBILE="MEMBER_MOBILE";
	public $MEMBER_EMAIL="MEMBER_EMAIL";
	public $MEMBER_PASSWORD = "MEMBER_PASSWORD";
	public $MEMBER_MEMBERSHIP_STATUS="MEMBER_MEMBERSHIP_STATUS";
	public $MEMBER_MEMBERSHIP_STATUS_AVAILABLE="A";
	public $MEMBER_MEMBERSHIP_STATUS_SLEEPING="N";
	public $MEMBER_GENDER="MEMBER_GENDER";
	public $MEMBER_OFFICE="MEMBER_OFFICE";





	//     dMMMMMMMMb  dMMMMMP dMMMMMMMMb  dMMMMb  dMMMMMP dMMMMb  .dMMMb  dMP dMP dMP dMMMMb 
	//    dMP"dMP"dMP dMP     dMP"dMP"dMP dMP"dMP dMP     dMP.dMP dMP" VP dMP dMP amr dMP.dMP 
	//   dMP dMP dMP dMMMP   dMP dMP dMP dMMMMK" dMMMP   dMMMMK"  VMMMb  dMMMMMP dMP dMMMMP"  
	//  dMP dMP dMP dMP     dMP dMP dMP dMP.aMF dMP     dMP"AMF dP .dMP dMP dMP dMP dMP       
	// dMP dMP dMP dMMMMMP dMP dMP dMP dMMMMP" dMMMMMP dMP dMP  VMMMP" dMP dMP dMP dMP        
	public $IS_UPDATE_COOKIE_MEMBERSHIP="IS_UPDATE_COOKIE_MEMBERSHIP";




	//    dMMMMMP dMMMMMP .dMMMb  .dMMMb  dMP dMMMMMP 
	//       dMP dMP     dMP" VP dMP" VP amr dMP      
	//      dMP dMMMP    VMMMb   VMMMb  dMP dMMMP     
	// dK .dMP dMP     dP .dMP dP .dMP dMP dMP        
	// VMMMP" dMMMMMP  VMMMP"  VMMMP" dMP dMMMMMP     

	public $IS_JESSIE_GREETING="IS_JESSIE_GREETING";
	public $IS_JESSIE_LOGIN="IS_JESSIE_LOGIN";
	public $JESSIE_NEEDS_LOGIN="JESSIE_NEEDS_LOGIN";
	public $JESSIE_CHECK_MEMBER_STATUS="JESSIE_CHECK_MEMBER_STATUS";
	public $WHERE_I_AM_JESSIE="WHERE_I_AM_JESSIE";
	public $WHAT_I_AM_JESSIE="WHAT_I_AM_JESSIE";
	public $COOKIE_JESSIE_DID_SAY_HELLO="COOKIE_JESSIE_DID_SAY_HELLO";
	public $REPLACE_ME="REPLACE_ME";


	// TEST
	public $TEST="TEST";


	// ROLE
	public $ROLE_ID_SPEAKER=111;
	public $ROLE_ID_EVALUATOR=222;
	public $ROLE_ID_TOASTMASTER=2;
	public $ROLE_ID_WORD_N_QUOTE_MASTER=4;
	public $ROLE_ID_TABLE_TOPIC_MASTER=5;
	public $ROLE_ID_MINI_DEBATE_MASTER=6;
	public $ROLE_ID_GENERAL_EVALUATOR=7;
	public $ROLE_ID_GRAMMARIAN=11;
	public $ROLE_ID_AH_COUNTER=10;
	public $ROLE_ID_TIMER=9;

}

?>
