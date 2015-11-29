var param_manager = {

	MEETING_ID:"MEETING_ID"
	,MEETING_TEMPLATE_ID:"MEETING_TEMPLATE_ID"
	,MEETING_TEMPLATE_ID_BASIC:1
	,WINDOW_SCROLL_Y:"WINDOW_SCROLL_Y"
	,IS_COPY:"IS_COPY"
	,IS_NEW_MEETING_HEADER:"IS_NEW_MEETING_HEADER"
	,IS_UPDATE_MEETING_HEADER:"IS_UPDATE_MEETING_HEADER"
	,IS_DELETE:"IS_DELETE"
	,IS_UPDATE_HEADER:"IS_UPDATE_HEADER"
	,ROUND:"ROUND"
	,THEME:"THEME"
	,NO_THEME:"No Theme"
	
	,START_DATE:"START_DATE"
	,IS_UPDATE_TODAY_ROLE:"IS_UPDATE_TODAY_ROLE"
	,ROLE_ID:"ROLE_ID"
	,ROLE_NAME:"ROLE_NAME"
	,NOT_ASSIGNED:"NOT ASSIGNED"
	,GUEST:"WELCOME GUEST"

	,REDIRECT_URL:"REDIRECT_URL"

	// PAGE NAVIGATOR
	,PAGE_TOP:"TOP"
	,PAGE_MEMBERS:"MEMBERS"
	,PAGE_MEMBER_DETAIL:"MEMBER DETAIL"
	,PAGE_MEMBER_ACHIEVEMENT:"MEMBER ACHIEVEMENT"
	,PAGE_MEETING_AGENDA:"MEETING AGENDA"
	,PAGE_NEW_MEETING_AGENDA:"NEW MEETING AGENDA"
	,PAGE_MEETING_AGENDA_LIST:"MEETING AGENDA LIST"
	,PAGE_ROLE_SIGN_UP_LIST:"ROLE SIGN UP"
	,PAGE_ROUND:"ROUND"
	,PAGE_THEME:"THEME"
	,PAGE_SCHEDULE_ACTION:"SCHEDULE ACTION"
	,PAGE_TIMELINE:"TIMELINE"
	,PAGE_TIMELINE_ACTION:"ACTION"
	,PAGE_TIMELINE_SUB_ACTION:"SUB ACTION"
	,PAGE_TODAY_WORD:"TODAY'S WORD"
	,PAGE_TODAY_QUOTE:"TODAY'S QUOTE"
	,PAGE_ROLES:"ROLES"
	,PAGE_ROLE_MEMBER:"ROLE MEMBER"
	,PAGE_CLUB_NEWS:"CLUB NEWS"
	,PAGE_MEETING_DATE:"MEETING DATE"
	,PAGE_PREPARED_SPEECH:"PREPARED SPEECH"
	,PAGE_PREPARED_SPEECH_DETAIL:"SPEECH DETAIL"
	,PAGE_PREPARED_SPEECH_PROJECT:"SPEECH PROJECT"
	,PAGE_PREPARED_SPEECH_TITLE:"SPEECH TITLE"
	,PAGE_PREPARED_SPEECH_SPEAKER:"SPEECH SPEAKER"
	,PAGE_PREPARED_SPEECH_SPEAKER_TIMER:"SPEECH SPEAKER TIMER"
	,PAGE_PREPARED_SPEECH_EVALUATOR:"SPEECH EVALUATOR"
	,PAGE_PREPARED_SPEECH_EVALUATOR_TIMER:"SPEECH EVALUATOR TIMER"
	,PAGE_HELP:"HELP"



	// BOOLEAN
	,YES:"YES"
	,NO:"NO"

	// MEETING AGENDA
	,IS_UPDATE_SCHEDULE_TIMELINE_SET:"IS_UPDATE_SCHEDULE_TIMELINE_SET"
	,TIMELINE_JSON_STR_ENCODED:"TIMELINE_JSON_STR_ENCODED"
	,IS_UPDATE_TIMELINE_AFTER_JOB:"IS_UPDATE_TIMELINE_AFTER_JOB"

	,IS_INSERT_SPEECH:"IS_INSERT_SPEECH"
	,IS_UPDATE_SPEECH:"IS_UPDATE_SPEECH"
	,IS_UPDATE_SPEECH_PROJECT:"IS_UPDATE_SPEECH_PROJECT"
	,IS_UPDATE_SPEECH_TITLE:"IS_UPDATE_SPEECH_TITLE"
	,IS_DELETE_SPEECH:"IS_DELETE_SPEECH"

	,IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER:"IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_SPEAKER"
	,SPEECH_TABLE_ROW_INFO_ARR_JSON_STR:"SPEECH_TABLE_ROW_INFO_ARR_JSON_STR"

	,IS_UPDATE_SPEECH_SPEAKER:"IS_UPDATE_SPEECH_SPEAKER"
	,IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_EVALUATOR:"IS_UPDATE_TABLE_ROW_ORDER_ON_TODAYS_EVALUATOR"
	,SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR:"SPEECH_EVALUATOR_TABLE_ROW_INFO_ARR_JSON_STR"

	,IS_INSERT_SPEECH_EVALUATOR:"IS_INSERT_SPEECH_EVALUATOR"
	,IS_UPDATE_SPEECH_EVALUATOR:"IS_UPDATE_SPEECH_EVALUATOR"
	,IS_DELETE_SPEECH_EVALUATOR:"IS_DELETE_SPEECH_EVALUATOR"

	,SPEECH_ID:"SPEECH_ID"
	,EVALUATOR_ID:"EVALUATOR_ID"
	,ORDER_NUM:"ORDER_NUM"
	,SPEECH_PROJECT_ID:"SPEECH_PROJECT_ID"
	,SPEECH_PROJECT_TITLE:"SPEECH_PROJECT_TITLE"
	,SPEECH_TITLE:"SPEECH_TITLE"
	,SPEECH_SPEAKER_MEMBER_ID:"SPEECH_SPEAKER_MEMBER_ID"
	,SPEECH_SPEAKER_MEMBER_NAME:"SPEECH_SPEAKER_MEMBER_NAME"
	,SPEECH_SPEAKER_TIMER_ID:"SPEECH_SPEAKER_TIMER_ID"
	,SPEECH_SPEAKER_TIMER:"SPEECH_SPEAKER_TIMER"
	,SPEECH_SPEAKER_TIMER_GREEN:"SPEECH_SPEAKER_TIMER_GREEN"
	,SPEECH_SPEAKER_TIMER_RED:"SPEECH_SPEAKER_TIMER_RED"
	,SPEECH_EVALUATOR_MEMBER_ID:"SPEECH_EVALUATOR_MEMBER_ID"
	,SPEECH_EVALUATOR_MEMBER_NAME:"SPEECH_EVALUATOR_MEMBER_NAME"
	,SPEECH_EVALUATOR_TIMER_ID:"SPEECH_EVALUATOR_TIMER_ID"
	,SPEECH_EVALUATOR_TIMER:"SPEECH_EVALUATOR_TIMER"

	,IS_UPDATE_WORD_N_QUOTE_WORD_ONLY:"IS_UPDATE_WORD_N_QUOTE_WORD_ONLY"
	,IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY:"IS_UPDATE_WORD_N_QUOTE_WORD_DESC_ONLY"
	,IS_UPDATE_WORD_N_QUOTE_WORD_N_DESC:"IS_UPDATE_WORD_N_QUOTE_WORD_N_DESC"
	,IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY:"IS_UPDATE_WORD_N_QUOTE_QUOTE_ONLY"

	,WORD:"WORD"
	,WORD_DESC:"WORD_DESC"
	,QUOTE:"QUOTE"

	,NEWS_ID:"NEWS_ID"
	,NEWS_TITLE:"NEWS_TITLE"
	,NEWS_CONTENTS:"NEWS_CONTENTS"

	,IS_INSERT_NEWS:"IS_INSERT_NEWS"
	,IS_UPDATE_NEWS:"IS_UPDATE_NEWS"
	,IS_DELETE_NEWS:"IS_DELETE_NEWS"

	,IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS:"IS_UPDATE_TABLE_ROW_ORDER_ON_NEWS"
	,NEWS_TABLE_ROW_INFO_ARR_JSON_STR:"NEWS_TABLE_ROW_INFO_ARR_JSON_STR"

	,IS_UPDATE_EXECUTIVE_MEMBER:"IS_UPDATE_EXECUTIVE_MEMBER"
	,EXECUTIVE_OFFICER_ID:"EXECUTIVE_OFFICER_ID"
	,EXECUTIVE_MEMBER_ID:"EXECUTIVE_MEMBER_ID"

	,IS_EDIT_ANYWAY:"IS_EDIT_ANYWAY"

	// 외부 공유 (FACEBOOK, KAKAO TALK, ETC..)
	,IS_EXTERNAL_SHARE:"IS_EXTERNAL_SHARE"

	// MEMBERS
	,IS_SELECT_MEMBER:"IS_SELECT_MEMBER"
	,IS_INSERT_MEMBER:"IS_INSERT_MEMBER"
	,IS_UPDATE_MEMBER:"IS_UPDATE_MEMBER"
	,IS_UPDATE_MEMBER_MEMBERSHIP_STATUS:"IS_UPDATE_MEMBER_MEMBERSHIP_STATUS"
	,IS_UPDATE_MEMBER_FIRST_NAME:"IS_UPDATE_MEMBER_FIRST_NAME"
	,IS_UPDATE_MEMBER_LAST_NAME:"IS_UPDATE_MEMBER_LAST_NAME"
	,IS_UPDATE_MEMBER_MOBILE:"IS_UPDATE_MEMBER_MOBILE"
	,IS_UPDATE_MEMBER_EMAIL:"IS_UPDATE_MEMBER_EMAIL"
	,IS_INSERT_MEMBER_N_MEMBERSHIP:"IS_INSERT_MEMBER_N_MEMBERSHIP"
	,GET_MEMBER_INFO:"GET_MEMBER_INFO"
	,MEMBER_ID:"MEMBER_ID"
	,MEMBER_NAME:"MEMBER_NAME"
	,MEMBER_MEMBERSHIP_STATUS:"MEMBER_MEMBERSHIP_STATUS"
	,MEMBER_MEMBERSHIP_STATUS_AVAILABLE:"A"
	,MEMBER_MEMBERSHIP_STATUS_SLEEPING:"N"
	,MEMBER_FIRST_NAME:"MEMBER_FIRST_NAME"
	,MEMBER_LAST_NAME:"MEMBER_LAST_NAME"
	,MEMBER_HASH_KEY:"MEMBER_HASH_KEY"
	,MEMBER_MEMBERSHIP:"MEMBER_MEMBERSHIP"
	,MEETING_MEMBERSHIP_ID:"MEETING_MEMBERSHIP_ID"
	,MEMBER_MOBILE:"MEMBER_MOBILE"
	,MEMBER_PASSWORD:"MEMBER_PASSWORD"
	,MEMBER_EMAIL:"MEMBER_EMAIL"
	,MEMBER_GENDER:"MEMBER_GENDER"
	,MEMBER_OFFICE:"MEMBER_OFFICE"

	// ROLE SIGN UP
	,ROLE_SIGN_UP_MEETING_DATE:"ROLE_SIGN_UP_MEETING_DATE"

	// JESSIE
	,IS_JESSIE_GREETING:"IS_JESSIE_GREETING"
	,IS_JESSIE_LOGIN:"IS_JESSIE_LOGIN"
	,JESSIE_NEEDS_LOGIN:"JESSIE_NEEDS_LOGIN"
	,JESSIE_CHECK_MEMBER_STATUS:"JESSIE_CHECK_MEMBER_STATUS"
	,WHERE_I_AM_JESSIE:"WHERE_I_AM_JESSIE"
	,WHAT_I_AM_JESSIE:"WHAT_I_AM_JESSIE"
	,COOKIE_JESSIE_DID_SAY_HELLO:"COOKIE_JESSIE_DID_SAY_HELLO"

	// MEETING TEMPLATE
	,MEETING_TEMPLATE_BASIC:"MEETING_TEMPLATE_BASIC"
	,MEETING_TEMPLATE_OFFICER_ELECTION:"MEETING_TEMPLATE_OFFICER_ELECTION"

	// EVENT
	,EVENT_INSERT:"EVENT_INSERT"
	,EVENT_UPDATE:"EVENT_UPDATE"
	,EVENT_DELETE:"EVENT_DELETE"
	,EVENT_MOUSE_DOWN:"EVENT_MOUSE_DOWN"
	,EVENT_MOUSE_UP:"EVENT_MOUSE_UP"
	,EVENT_PARAM_EVENT_TYPE:"EVENT_PARAM_EVENT_TYPE"
	,EVENT_PARAM_KEY:"EVENT_PARAM_KEY"
	,EVENT_PARAM_VALUE:"EVENT_PARAM_VALUE"
	,EVENT_PARAM_TARGET_JQ:"EVENT_PARAM_TARGET_JQ"

	// PARAMS
	,SELECTED_KEY:"SELECTED_KEY"
	,SELECTED_VALUE:"SELECTED_VALUE"

	// 상하 스크롤로 이동해 돌아갈 대상을 가리킵니다.
	,TARGET_SCROLL_BACK_Y:"TARGET_SCROLL_BACK"

	// COOKIE
	,IS_UPDATE_COOKIE_MEMBERSHIP:"IS_UPDATE_COOKIE_MEMBERSHIP"
	,COOKIE_TM_LOGIN_MEMBER_HASHKEY:"COOKIE_TM_LOGIN_MEMBER_HASHKEY"
	,COOKIE_TM_MEMBERSHIP_ID:"COOKIE_TM_MEMBERSHIP_ID"

	// MILLISEC
	, MIILLISEC_BODY_FADE_IN_ON_READY:500
	, MIILLISEC_ANIMATE_SCROLL:300



	,get:function(param_name, param_value){
		var param_obj = {
			get:function(param_name, param_value) {
				this[param_name] = param_value;
				return this;
			}
		};

		return param_obj.get(param_name, param_value);
	}
}