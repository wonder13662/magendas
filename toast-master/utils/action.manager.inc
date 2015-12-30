<?php

interface Action {

	public function set_parent($parent_action_obj);
	public function get_parent();
	public function add_child($child_action_obj);
	public function get_children();

}


class ActionObject implements Action{

	private $parent_action_obj;
	private $children_action_obj_list;
	private $action_id;
	private $action_name;
	private $action_collection_type;
	private $action_collection_type_name;
	private $action_item_type;
	private $action_item_type_name;
	private $action_hash_key;
	private $action_order;
	private $action_is_shy;

	public function ActionObject(){}

	public function test() { return 'ActionObject'; }

	public static function is_not_action_obj($target) {
		return !ActionObject::is_action_obj($target);
	}
	public static function is_action_obj($target) {
		if(!is_null($target) && is_a($target,'Action')) {
			return true;
		}
		return false;
	}

	public function set_parent($parent_action_obj) {
		if(ActionObject::is_not_action_obj($parent_action_obj)) {
			return;
		}
		$this->parent_action_obj = $parent_action_obj;
	}
	public function get_parent() {
		return $this->parent_action_obj;
	}

	public function add_child($child_action_obj) {

		if(ActionObject::is_not_action_obj($child_action_obj)) {
			echo "!Error! \$this->is_not_action_obj(\$child_action_obj)<br/>";
			return;
		}

		if(is_null($this->children_action_object_list)) {
			$this->children_action_object_list = array();
		}

		if(!is_null($child_action_obj)) {
			array_push($this->children_action_object_list, $child_action_obj);
		}

	}
	public function get_children() {
		if(is_null($this->children_action_object_list)) {
			$this->children_action_object_list = array();
		}

		return $this->children_action_object_list;
	}
	public function get_children_cnt() {
		if(is_null($this->children_action_object_list)) {
			$this->children_action_object_list = array();
		}

		return count($this->children_action_object_list);
	}
	public function get_child($idx) {

		$children_action_object_list = $this->get_children();
		if(empty($children_action_object_list)) {
			return;
		}
		$length = count($children_action_object_list);

		if(is_null($idx) || !is_numeric($idx) || ($idx < 0) || (($length - 1) < $idx)) {
			return;
		}

		return $children_action_object_list[$idx];
	}
	public function get_first_child() {
		return $this->get_child(0);
	}
	public function get_last_child() {
		$children_action_object_list = $this->get_children();
		$length = count($children_action_object_list);

		return $this->get_child($length - 1);
	}
	public function get_sibling_before() {

		if($this->has_no_parent()) {
			return null;
		}

		$parent_action_obj = $this->get_parent();
		$sibling_action_object_list = $parent_action_obj->get_children();

		for($idx = 0; $idx < count($sibling_action_object_list); $idx++) {
			$sibling_action_object = $sibling_action_object_list[$idx];
			$sibling_action_hash_key = $sibling_action_object->get_hash_key();

			if((0 < $idx) && strcmp($sibling_action_hash_key, $this->get_hash_key()) != 0) {
				continue;
			}

			$prev_idx = ($idx - 1);
			return $sibling_action_object_list[$prev_idx];
		}

		return null;

	}
	public function get_sibling_after() {
		
		if($this->has_no_parent()) {
			return;
		}

		$parent_action_obj = $this->get_parent();
		$sibling_action_object_list = $parent_action_obj->get_children();

		$last_idx = count($sibling_action_object_list) - 1;
		for($idx = 0; $idx < count($sibling_action_object_list); $idx++) {
			$sibling_action_object = $sibling_action_object_list[$idx];
			$sibling_action_hash_key = $sibling_action_object->get_hash_key();

			if(($idx < $last_idx) && strcmp($sibling_action_hash_key, $this->get_hash_key()) != 0) {
				continue;
			}

			$next_idx = ($idx + 1);
			return $sibling_action_object_list[$next_idx];
		}
	}


	public function set_name($action_name) {
		$this->action_name = $action_name;
	}
	public function get_name() {
		return $this->action_name;
	}

	public function set_collection_type($action_collection_type) {
		$this->action_collection_type = $action_collection_type;
	}
	public function get_collection_type() {
		return $this->action_collection_type;
	}

	public function set_collection_type_name($action_collection_type_name) {
		$this->action_collection_type_name = $action_collection_type_name;
	}
	public function get_collection_type_name() {
		return $this->action_collection_type_name;
	}

	public function set_item_type($action_item_type) {
		$this->action_item_type = $action_item_type;
	}
	public function get_item_type() {
		return $this->action_item_type;
	}

	public function set_item_type_name($action_item_type_name) {
		$this->action_item_type_name = $action_item_type_name;
	}
	public function get_item_type_name() {
		return $this->action_item_type_name;
	}

	public function set_id($action_id) {
		$this->action_id = $action_id;
	}
	public function get_id() {
		return $this->action_id;
	}

	public function set_hash_key($action_hash_key) {
		$this->action_hash_key = $action_hash_key;
	}
	public function get_hash_key() {
		return $this->action_hash_key;
	}

	public function set_order($action_order) {
		$this->action_order = $action_order;
	}
	public function get_order() {
		return $this->action_order;
	}

	public function set_is_shy($action_is_shy) {
		$this->action_is_shy = $action_is_shy;
	}
	public function get_is_shy() {
		return $this->action_is_shy;
	}

	public function get_root_action_obj() {
		if(is_null($this->parent_action_object)) {
			return $this;	
		}

		return $this->parent_action_object->get_root_action_obj();
	}

	public function get_std_obj($std_obj=null) {

		if(is_null($std_obj)) {
			$std_obj = new stdClass();
		}

		$std_obj->action_id = intval($this->action_id);
		$std_obj->action_hash_key = $this->action_hash_key;
		$std_obj->action_order = intval($this->action_order);
		$std_obj->action_is_shy = (intval($this->action_is_shy)==1)?true:false;
		$std_obj->action_name = $this->action_name;
		$std_obj->action_collection_type = intval($this->action_collection_type);
		$std_obj->action_collection_type_name = $this->action_collection_type_name;
		$std_obj->action_item_type = intval($this->action_item_type);
		$std_obj->action_item_type_name = $this->action_item_type_name;
		$std_obj->parent_action_object = null;

		$children_action_obj_list = array();

		if(!empty($this->children_action_object_list)) {
			for($action_idx = 0; $action_idx < count($this->children_action_object_list); $action_idx++) {
				$child_action_obj = $this->children_action_object_list[$action_idx];

				if(is_null($child_action_obj)) continue;

				$child_action_obj_name = $child_action_obj->get_name();
				$std_obj_child = $child_action_obj->get_std_obj();

				$std_obj_child_parent = new stdClass();
				$std_obj_child_parent->action_id = intval($this->action_id);
				$std_obj_child_parent->action_hash_key = $this->action_hash_key;
				$std_obj_child_parent->action_order = intval($this->action_order);
				$std_obj_child_parent->action_is_shy = (intval($this->action_is_shy)==1)?true:false;
				$std_obj_child_parent->action_name = $this->action_name;
				
				$std_obj_child_parent->action_collection_type = intval($this->action_collection_type);
				$std_obj_child_parent->action_collection_type_name = $this->action_collection_type_name;
				$std_obj_child_parent->action_item_type = intval($this->action_item_type);
				$std_obj_child_parent->action_item_type_name = $this->action_item_type_name;

				$std_obj_child->parent_action_object = $std_obj_child_parent;

				if((0 < $action_idx) && ActionItem::is_action_item($child_action_obj)) {
					$before_std_obj_child = $children_action_obj_list[($action_idx - 1)];
					$std_obj_child->action_item_sibling_before = $before_std_obj_child;
				}

				array_push($children_action_obj_list, $std_obj_child);
			}
		}
		$std_obj->children_action_object_list = $children_action_obj_list;

		return $std_obj;
	}

}

class ActionCollection extends ActionObject{

	public static function is_not_action_collection($target) {
		return !ActionCollection::is_action_collection($target);
	}
	public static function is_action_collection($target) {
		if(!is_null($target) && is_a($target,'ActionCollection')) {
			return true;
		}
		return false;
	}

	private $meeting_agenda_id;

	public function set_meeting_agenda_id($meeting_agenda_id) {
		$this->meeting_agenda_id = $meeting_agenda_id;
	}
	public function get_meeting_agenda_id() {
		return $this->meeting_agenda_id;
	}

	private static $ACTION_COLLECTION_TYPE_LIST=1;
	private static $ACTION_COLLECTION_TYPE_TABLE=2;

	public function is_list() {
		if(is_null($this->action_type) || (ActionCollection::$ACTION_COLLECTION_TYPE_LIST != $this->action_type)) {
			return false;
		} else if(ActionCollection::$ACTION_COLLECTION_TYPE_LIST == $this->action_type) {
			return true;
		}
		return false;
	}

	public function is_table() {
		if(is_null($this->action_type) || (ActionCollection::$ACTION_COLLECTION_TYPE_TABLE != $this->action_type)) {
			return false;
		} else if(ActionCollection::$ACTION_COLLECTION_TYPE_TABLE == $this->action_type) {
			return true;
		}
		return false;
	}

	public function is_not_root_collection() {
		return !$this->is_root_collection();
	}

	public function is_root_collection() {
		$has_no_parent = false;
		if(is_null($this->parent_action_object)) {
			$has_no_parent = true;
		}

		return $has_no_parent;
	}

	// @ Override
	public function get_std_obj($std_obj=null) {

		if(is_null($std_obj)) {
			$std_obj = new stdClass();	
		}
		$std_obj->meeting_agenda_id = intval($this->meeting_agenda_id);

		return parent::get_std_obj($std_obj);
	}

}

class ActionItem extends ActionObject{

	public static function is_not_action_item($target) {
		return !$this->is_action_item($target);
	}
	public static function is_action_item($target) {
		if(!is_null($target) && is_a($target,'ActionItem')) {
			return true;
		}
		return false;
	}

	public function test() { return parent::test() . 'ActionItem'; }

	private $context;
	public function set_context($context) {
		$this->context = $context;
	}
	public function get_context() {
		return $this->context;
	}

	// @ Override
	public function get_std_obj($std_obj=null) {

		if(is_null($std_obj)) {
			$std_obj = new stdClass();	
		}

		$std_obj->context = $this->context;
		$std_obj->add_on_action_object_list = $this->get_add_on_list();

		return parent::get_std_obj($std_obj);
	}	

	private $add_on_action_object_list;
	public function push_add_on($add_on_collection) {

		if(ActionObject::is_not_action_obj($add_on_collection)) {
			echo "!Error! \$this->is_not_action_obj(\$add_on_collection)<br/>";
			return;
		}

		if(is_null($this->add_on_action_object_list)) {
			$this->add_on_action_object_list = array();
		}

		if(!is_null($add_on_collection)) {
			array_push($this->add_on_action_object_list, $add_on_collection);
		}

	}

	public function get_add_on_list() {
		if(is_null($this->add_on_action_object_list)) {
			$this->add_on_action_object_list = array();
		}

		return $this->add_on_action_object_list;
	}	

	// 아이템 타입별로 context 내용을 구성하는 방식이 다르다.
	public static $TITLE_ONLY=1;			// ActionItem::$TITLE_ONLY
	public static $TITLE_N_TIME_HH_MM=2;	// ActionItem::$TITLE_N_TIME_HH_MM
	public static $TITLE_N_TIME_MM_SS=3;	// ActionItem::$TITLE_N_TIME_MM_SS
	public static $SELECT_BOX=4;			// ActionItem::$SELECT_BOX

}

/*
	@ Desc : 제목과 시간을 나타내는 Action Item. 시작 시간을 정의할 수 있습니다. 시간 관련 메서드가 추가됩니다.
*/
class ActionItemTitleNTimeHHMM extends ActionItem{

	// ActionItemTitleNTimeHHMM::is_not_instance
	public static function is_not_instance($target) {
		return !ActionItemTitleNTimeHHMM::is_instance($target);
	}
	public static function is_instance($target) {
		if(!is_null($target) && is_a($target,'ActionItemTitleNTimeHHMM')) {
			return true;
		}
		return false;
	}

	private $context_time_hh_mm;
	private $time_sec_initial;
	private $time_sec_offset_from_init;
	private $time_hh_mm_initial;
	private $time_hh_mm;

	public function test() { return parent::test() . 'ActionItemTitleNTimeHHMM'; }

	// @ Override
	public function get_std_obj($std_obj=null) {

		if(is_null($std_obj)) {
			$std_obj = new stdClass();	
		}

		$std_obj->time_sec_initial = intval($this->time_sec_initial);
		$std_obj->time_sec_offset_from_init = intval($this->time_sec_offset_from_init);
		$std_obj->time_hh_mm_initial = $this->time_hh_mm_initial;
		$std_obj->time_hh_mm = $this->time_hh_mm;

		return parent::get_std_obj($std_obj);
	}
	// @ Override
	public function set_context($context) {

		if(is_null($context) || empty($context)) {
			return;
		}

		$context_time_hh_mm = json_decode($context);

		$this->time_sec_initial = intval($context_time_hh_mm->time_sec_initial);
		$this->time_sec_offset_from_init = intval($context_time_hh_mm->time_sec_offset_from_init);
		$this->time_hh_mm_initial = $context_time_hh_mm->time_hh_mm_initial;
		$this->time_hh_mm = $context_time_hh_mm->time_hh_mm;

		return parent::set_context($context);
	}

	/*
		@ Private
		@ Desc : 유효한 시간 객체인지 확인.
	*/
	private function is_valid_context_time_hh_mm_json_str($json_str_context_time_hh_mm) {

		if(	is_null($json_str_context_time_hh_mm) || 
			empty($json_str_context_time_hh_mm) || 
			json_decode($json_str_context_time_hh_mm) == false) {

			return false;
		}

		$context_time_hh_mm = json_encode($json_str_context_time_hh_mm);
		if(	is_null($context_time_hh_mm->time_sec_initial) || 
			is_null($context_time_hh_mm->time_sec_offset_from_init) ||
			is_null($context_time_hh_mm->time_hh_mm_initial) ||
			is_null($context_time_hh_mm->time_hh_mm) ) {

			return false;
		}

		return true;
	}
	/*
		@ Public
		@ Desc : 시간 관련 정보를 json 문자열로 저장합니다.
	*/
	public function set_context_time_hh_mm($time_sec_initial, $time_sec_offset_from_init){

		$this->time_sec_initial = $time_sec_initial;
		$this->time_sec_offset_from_init = $time_sec_offset_from_init;

		// sec --> hh:mm
		$this->time_hh_mm_initial = gmdate("H:i", $time_sec_initial);
		$this->time_hh_mm = gmdate("H:i", $time_sec_initial + $time_sec_offset_from_init);

		// store into context
		$context_time_hh_mm = new stdClass();
		$context_time_hh_mm->time_sec_initial = intval($this->time_sec_initial);
		$context_time_hh_mm->time_sec_offset_from_init = intval($this->time_sec_offset_from_init);
		$context_time_hh_mm->time_hh_mm_initial = $this->time_hh_mm_initial;
		$context_time_hh_mm->time_hh_mm = $this->time_hh_mm;

		$json_str_context_time_hh_mm = json_encode($context_time_hh_mm);
	}
	public function set_context_time_hh_mm_offset($time_sec_offset){

		if(is_null($time_sec_offset) || !is_numeric($time_sec_offset)) {
			return;
		}

		$this->time_sec_offset_from_init += $time_sec_offset;

		// sec --> hh:mm
		$this->time_hh_mm = gmdate("H:i", $this->time_sec_initial + $this->time_sec_offset_from_init);

		// store into context
		$context_time_hh_mm = new stdClass();
		$context_time_hh_mm->time_sec_initial = intval($this->time_sec_initial);
		$context_time_hh_mm->time_sec_offset_from_init = intval($this->time_sec_offset_from_init);
		$context_time_hh_mm->time_hh_mm_initial = $this->time_hh_mm_initial;
		$context_time_hh_mm->time_hh_mm = $this->time_hh_mm;

		$json_str_context_time_hh_mm = json_encode($context_time_hh_mm);
	}	
	/*
		@ Public
		@ Desc : 시간 관련 정보를 json 문자열에서 객체로 변경하여 가져옵니다.
	*/
	public function get_context_time_hh_mm(){
		
		$json_str_context_time_hh_mm = $this->get_context();

		$context_time_hh_mm = null;
		if($this->is_valid_context_time_hh_mm_json_str($json_str_context_time_hh_mm)) {
			$context_time_hh_mm = json_decode($json_str_context_time_hh_mm);
		} else  {
			// 저장된 데이터가 없다면 기본값을 리턴합니다.
			$context_time_hh_mm = new stdClass();
			$context_time_hh_mm->time_sec_initial = 0;
			$context_time_hh_mm->time_sec_offset_from_init = 0;
			$context_time_hh_mm->time_hh_mm_initial = "00:00";
			$context_time_hh_mm->time_hh_mm = "00:00";
		}

		return $context_time_hh_mm;
	}


}

?>
