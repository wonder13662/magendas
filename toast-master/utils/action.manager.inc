<?php

interface Action {

	public function set_parent($parent_action_obj);
	public function get_parent();
	public function add_child($child_action_obj);
	public function get_children();

}


class ActionObject implements Action{

	// 객체 내에서의 변화로 DB 업데이트를 진행합니다.

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
	private $coordinate;
	private $search_map;
	private $has_changed;
	private $context;	

	public function test() { return 'ActionObject'; }
	/*
		@ Public
		@ Usage : ActionObject::is_not_action_obj($target)
	*/
	public static function is_not_action_obj($target) {
		return !ActionObject::is_action_obj($target);
	}
	/*
		@ Public
		@ Usage : ActionObject::is_action_obj($target)
	*/
	public static function is_action_obj($target) {
		if(!is_null($target) && is_a($target,'Action')) {
			return true;
		}
		return false;
	}

	public function has_no_parent() {
		return !$this->has_parent();
	}
	public function has_parent() {
		return (!is_null($this->parent_action_obj))?true:false;
	}
	public function set_parent($parent_action_obj) {

		if(is_null($parent_action_obj)) return;
		if(ActionObject::is_not_action_obj($parent_action_obj)) return;

		$this->parent_action_obj = $parent_action_obj;
	}
	public function get_parent() {
		return $this->parent_action_obj;
	}

	public function add_child($child_action_obj) {

		// DEBUG
		$cur_name = $this->get_name();
		$cur_child_name = $child_action_obj->get_name();

		if(ActionObject::is_not_action_obj($child_action_obj)) {
			echo "!Error! / add_child / $cur_name <-> $cur_child_name / \$this->is_not_action_obj(\$child_action_obj)<br/>";
			return;
		}

		if(is_null($this->children_action_object_list)) {
			$this->children_action_object_list = array();
		}

		// REMOVE ME - 로직적으로 오류가 발생하지 않도록 자식을 추가하는 것은 DAO 레이어의 역할.
		/*
		$duplicated_child_action_obj = null;
		$child_action_coordinate = $child_action_obj->get_coordinate();
		if(!empty($child_action_coordinate)) {
			$duplicated_child_action_obj = $this->search($child_action_coordinate);
		}
		if(!is_null($duplicated_child_action_obj)) {
			echo "!Error! / add_child / $cur_name <-> $cur_child_name / !is_null(\$duplicated_child_action_obj) / \$child_action_coordinate :: $child_action_coordinate<br/>";
			return;
		}
		*/

		if(!is_null($child_action_obj)) {

			$child_action_name = $child_action_obj->get_name();
			
			array_push($this->children_action_object_list, $child_action_obj);
			$child_action_obj->set_parent($this);
		}

	}
	public function set_children($children_action_object_list) {
		$this->children_action_object_list = $children_action_object_list;
	}
	public function get_children() {
		if(is_null($this->children_action_object_list)) {
			$this->children_action_object_list = array();
		}

		return $this->children_action_object_list;
	}
	public function has_children() {
		if(0 < $this->get_children_cnt()) {
			return true;
		}
		return false;
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
		if(is_null($this->parent_action_obj)) {
			$cur_root_name = $this->get_name();
			return $this;	
		}

		return $this->parent_action_obj->get_root_action_obj();
	}

	public function set_coordinate($coordinate=null, $search_map=null) {

		$cur_name = $this->get_name();
		if(is_null($search_map) && $this->has_parent()) {
			echo "!Error! / $cur_name / set_coordinate / 부모 객체가 있는 경우에는 \$search_map 변수가 유효해야 합니다.<br/>";
			return;
		}
		if(is_null($coordinate) && $this->has_parent()) {
			echo "!Error! / $cur_name / set_coordinate / 부모 객체가 있는 경우에는 \$coordinate 변수가 유효해야 합니다.<br/>";
			return;
		}

		// DEBUG
		// echo "$cur_name / set_coordinate / 000 / input :: $coordinate<br/>";

		if(is_null($coordinate) || empty($coordinate)) {
			$this->coordinate = "root";
		} else {
			$this->coordinate = $coordinate;	
		}
		$cur_coordinate = $this->coordinate;

		if($this->has_no_parent()) {
			// root action collection
			$this->set_search_map();
		} else {
			$parent_action_name = $this->get_parent()->get_name();
			$this->set_search_map($search_map);
		}

		$cur_search_map = $this->get_search_map();
		if(is_null($cur_search_map)) {
			return;
		}
		$children_action_list = $this->get_children();
		for($idx=0;$idx < count($children_action_list);$idx++) {
			$child_action_obj = $children_action_list[$idx];

			$child_action_name = $child_action_obj->get_name();
			$child_action_coordinate = $cur_coordinate . "-" . $idx;

			$child_has_parent = $child_action_obj->has_parent();
			$cur_search_map = $child_action_obj->set_coordinate($child_action_coordinate, $cur_search_map);
		}

		return $cur_search_map;
	}

	public function get_coordinate() {
		return $this->coordinate;
	}
	// TODO 서버에서 검색 매핑 정보를 만들어 주므로 js 단에서는 사라져야 합니다.
	// $foo->{$start . $end}
	public function set_search_map($search_map=null) {

		// DEBUG
		$cur_name = $this->get_name();

		if(is_null($search_map) && $this->has_parent()) {
			echo "!Error! / set_search_map / $cur_name / is_null(\$search_map) / root가 아닌 경우는 반드시 유효한 \$search_map을 넘겨주어야 합니다.<br/>";
			return;
		} else if(is_null($search_map) ) {
			$search_map = new stdClass();
		}

		$cur_coordinate = $this->get_coordinate();
		if(!is_null($cur_coordinate) && !empty($cur_coordinate)) {
			// echo "$cur_name / set_search_map / \$cur_coordinate :: $cur_coordinate<br/>";
			$search_map->{$this->coordinate} = $this;
		}

		$this->search_map = $search_map;
	}
	public function get_search_map() {
		return $this->search_map;
	}
	public function search($coordinate) {
		if(is_null($this->search_map)) {
			$this->search_map = new stdClass();
		}
		
		$action_obj_from_search = $this->search_map->{$coordinate};
		$cur_name = $this->get_name();
		if(is_null($action_obj_from_search)) {
			echo "$cur_name / search / \$coordinate :: $coordinate is null!<br/>";			
			return null;
		}

		return $action_obj_from_search;
	}
	public function has_changed() {
		if(is_null($this->has_changed)) {
			$this->has_changed = false;
		}
		return $this->has_changed;
	}
	public function set_changed($has_changed) {

		if(is_null($has_changed)) {
			$has_changed = false;
		}

		$this->has_changed = $has_changed;

		// set_parent_changed
		$parent_action_obj = $this->get_parent();
		// wonder.jung
		if($this->has_parent()) {
			$parent_action_obj->set_changed($has_changed);	
		}
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
		$std_obj->context = $this->context;

		$std_obj->coordinate = $this->coordinate;

		$std_obj->parent_action_obj = null;

		$children_action_obj_list = array();

		// DEBUG
		$cur_action_name = $this->get_name();
		$children_length = count($this->children_action_object_list);
		// echo "\$cur_action_name :: $cur_action_name / get_std_obj / \$children_length :: $children_length<br/>";

		if(!empty($this->children_action_object_list)) {
			for($action_idx = 0; $action_idx < count($this->children_action_object_list); $action_idx++) {
				$child_action_obj = $this->children_action_object_list[$action_idx];

				if(is_null($child_action_obj)) {
					// echo "\$cur_action_name :: $cur_action_name / get_std_obj / !Error! / $idx / is_null(\$child_action_obj)<br/>";
					continue;	
				}

				// DEBUG
				$cur_child_action_name = $child_action_obj->get_name();
				// echo "\$cur_action_name :: $cur_action_name / get_std_obj / \$cur_child_action_name :: $cur_child_action_name<br/>";

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
				$std_obj_child_parent->context = $this->context;

				$std_obj_child_parent->coordinate = $this->coordinate;

				$std_obj_child->parent_action_obj = $std_obj_child_parent;

				if((0 < $action_idx) && ActionItem::is_instance($child_action_obj)) {
					$before_std_obj_child = $children_action_obj_list[($action_idx - 1)];
					$std_obj_child->action_item_sibling_before = $before_std_obj_child;
				}

				array_push($children_action_obj_list, $std_obj_child);
			}
		}
		$std_obj->children_action_object_list = $children_action_obj_list;

		return $std_obj;
	}

	/*
		@ Public
		@ Desc : 파라미터로 받은 action obj의 내용을 해당 객체로 주입합니다.
	*/
	public function inject($action_obj) {

		if(ActionObject::is_not_action_obj($action_obj)) {
			return;
		}

		$this->set_id($action_obj->get_id());
		$this->set_name($action_obj->get_name());

		$this->set_collection_type($action_obj->get_collection_type());
		$this->set_collection_type_name($action_obj->get_collection_type_name());
		$this->set_item_type($action_obj->get_item_type());
		$this->set_item_type_name($action_obj->get_item_type_name());
		$this->set_context($action_obj->get_context());

		$this->set_hash_key($action_obj->get_hash_key());
		$this->set_order($action_obj->get_order());
		$this->set_is_shy($action_obj->get_is_shy());
		$this->set_changed($action_obj->has_changed());

	}

	public function set_context($context) {
		$this->context = $context;
	}
	public function get_context() {
		return $this->context;
	}

}

class ActionCollection extends ActionObject{

	/*
		@ Public
		@ Usage : ActionCollection::is_not_instance($target)
	*/
	public static function is_not_instance($target) {
		return !ActionCollection::is_instance($target);
	}
	/*
		@ Public
		@ Usage : ActionCollection::is_instance($target)
	*/
	public static function is_instance($target) {
		if(!is_null($target) && is_a($target,'ActionCollection')) {
			return true;
		}
		return false;
	}

	public function ActionCollection($action_name="", $action_collection_type=1, $meeting_agenda_id=-1, $is_shy=0, $has_changed=true) {
		parent::set_name($action_name);
		parent::set_collection_type($action_collection_type);
		$this->set_meeting_agenda_id($meeting_agenda_id);
		parent::set_is_shy($is_shy);
		parent::set_changed($has_changed);
	}

	private $meeting_agenda_id;
	public function set_meeting_agenda_id($meeting_agenda_id) {
		$this->meeting_agenda_id = $meeting_agenda_id;
	}
	public function get_meeting_agenda_id() {
		if(is_null($this->meeting_agenda_id)) {
			$this->meeting_agenda_id = 0;
		}
		return $this->meeting_agenda_id;
	}

	private $meeting_agenda_theme;
	public function set_meeting_agenda_theme($meeting_agenda_theme) {
		$this->meeting_agenda_theme = $meeting_agenda_theme;
	}
	public function get_meeting_agenda_theme() {
		if(is_null($this->meeting_agenda_theme)) {
			$this->meeting_agenda_theme = "No theme";
		}
		return $this->meeting_agenda_theme;
	}

	private $meeting_agenda_round;
	public function set_meeting_agenda_round($meeting_agenda_round) {
		$this->meeting_agenda_round = $meeting_agenda_round;
	}
	public function get_meeting_agenda_round() {
		if(is_null($this->meeting_agenda_round)) {
			$this->meeting_agenda_round = 0;
		}
		return $this->meeting_agenda_round;
	}

	public static $ACTION_COLLECTION_TYPE_LIST=1; 		// ActionCollection::$ACTION_COLLECTION_TYPE_LIST
	public static $ACTION_COLLECTION_TYPE_TABLE=2;		// ActionCollection::$ACTION_COLLECTION_TYPE_TABLE

	public function is_list() {

		$action_collection_type = parent::get_collection_type();
		if(is_null($action_collection_type) || (ActionCollection::$ACTION_COLLECTION_TYPE_LIST != $action_collection_type)) {
			return false;
		} else if(ActionCollection::$ACTION_COLLECTION_TYPE_LIST == $action_collection_type) {
			return true;
		}
		return false;
	}

	public function is_table() {

		$action_collection_type = parent::get_action_collection_type();

		if(is_null($action_collection_type) || (ActionCollection::$ACTION_COLLECTION_TYPE_TABLE != $this->action_collection_type)) {
			return false;
		} else if(ActionCollection::$ACTION_COLLECTION_TYPE_TABLE == $this->action_collection_type) {
			return true;
		}
		return false;
	}
	/*	
		@ Public
		@ Usage : ActionCollection::is_not_valid_collection_type($collection_type);
	*/
	public static function is_not_valid_collection_type($collection_type) {
		return !ActionCollection::is_valid_collection_type($collection_type);
	}
	/*	
		@ Public
		@ Usage : ActionCollection::is_valid_collection_type($collection_type);
	*/
	public static function is_valid_collection_type($collection_type) {

		if( ActionCollection::$ACTION_COLLECTION_TYPE_LIST == $collection_type || 
			ActionCollection::$ACTION_COLLECTION_TYPE_TABLE == $collection_type ) {

			return true;
		}

		return false;
	}

	public function is_not_root_collection() {
		return !$this->is_root_collection();
	}

	public function is_root_collection() {
		$has_no_parent = false;
		if(is_null($this->parent_action_obj)) {
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
		$std_obj->meeting_agenda_theme = $this->meeting_agenda_theme;
		$std_obj->meeting_agenda_round = intval($this->meeting_agenda_round);

		return parent::get_std_obj($std_obj);
	}

	/*
		@ Public
		@ Desc : 파라미터로 받은 action obj의 내용을 해당 객체로 주입합니다.
	*/
	public function inject($action_collection_obj) {

		if(ActionCollection::is_not_instance($action_collection_obj)) {
			return;
		}

		$this->set_meeting_agenda_id($action_collection_obj->get_meeting_agenda_id());
		$this->set_meeting_agenda_theme($action_collection_obj->get_meeting_agenda_theme());
		$this->set_meeting_agenda_round($action_collection_obj->get_meeting_agenda_round());
		parent::inject($action_collection_obj);
	}

	// @ Override
	public function get_name() {
		return parent::get_name();
	}

}




class ActionItem extends ActionObject{

	public function ActionItem($action_name="New Item", $action_item_type=1, $is_shy=0, $has_changed=true) {
		parent::set_name($action_name);
		parent::set_item_type($action_item_type);
		parent::set_is_shy($is_shy);
		parent::set_changed($has_changed);
	}

	/*
		@ Public
		@ Usage : ActionItem::is_not_instance($target)
	*/
	public static function is_not_instance($target) {
		return !ActionItem::is_instance($target);
	}
	/*
		@ Public
		@ Usage : ActionItem::is_instance($target)
	*/
	public static function is_instance($target) {
		if(!is_null($target) && is_a($target,'ActionItem')) {
			return true;
		}
		return false;
	}

	/*
		@ Public
		@ Desc : 파라미터로 받은 action obj의 내용을 해당 객체로 주입합니다.
	*/
	public function inject($action_item_obj) {

		if(ActionItem::is_not_instance($action_item_obj)) {
			return;
		}

		$this->set_context($action_item_obj->get_context());
		$this->set_add_on_list($action_item_obj->get_add_on_list());

		parent::inject($action_item_obj);
	}


	public function test() { return parent::test() . 'ActionItem'; }


	// @ Override
	public function get_std_obj($std_obj=null) {

		if(is_null($std_obj)) {
			$std_obj = new stdClass();	
		}
		
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
	public function set_add_on_list($add_on_action_object_list) {
		$this->add_on_action_object_list = $add_on_action_object_list;
	}

	// 아이템 타입별로 context 내용을 구성하는 방식이 다르다.
	public static $TITLE_ONLY=1;			// ActionItem::$TITLE_ONLY
	public static $TITLE_N_TIME_HH_MM=2;	// ActionItem::$TITLE_N_TIME_HH_MM
	public static $TITLE_N_TIME_MM_SS=3;	// ActionItem::$TITLE_N_TIME_MM_SS
	public static $SELECT_BOX=4;			// ActionItem::$SELECT_BOX

	/*
		@ Public
		@ Usage : ActionItem::is_valid_action_item_type($action_item_type);
	*/

	public static function is_valid_action_item_type($action_item_type) {

		if(is_null($action_item_type) || !is_numeric($action_item_type)) {
			return false;
		}

		if(	ActionItem::$TITLE_ONLY == $action_item_type ||
			ActionItem::$TITLE_N_TIME_HH_MM == $action_item_type ||
			ActionItem::$TITLE_N_TIME_MM_SS == $action_item_type ||
			ActionItem::$SELECT_BOX == $action_item_type ) {

			return true;
		}

		return false;
	}

	// @ Override
	public function get_meeting_agenda_id() {
		return -1;
	}

	// @ Override
	public function set_coordinate($coordinate=null, $search_map=null) {
		return parent::set_coordinate($coordinate, $search_map);
	}

	// @ Override
	/*
	public function get_name() {
		return parent::get_name();
	}
	*/
	// @ Override
	public function set_context($new_context=null) {
		parent::set_context($new_context);
	}
	// @ Override
	public function get_context() {
		return parent::get_context();
	}
}

/*
	@ Desc : 제목과 시간을 나타내는 Action Item. 시작 시간을 정의할 수 있습니다. 시간 관련 메서드가 추가됩니다.
*/
class ActionItemTitleNTimeHHMM extends ActionItem{

	public static function is_not_instance($target) {
		return !ActionItemTitleNTimeHHMM::is_instance($target);
	}
	public static function is_instance($target) {
		if(!is_null($target) && is_a($target,'ActionItemTitleNTimeHHMM')) {
			return true;
		}
		return false;
	}

	/*
		@ Public
		@ Desc : 파라미터로 받은 action obj의 내용을 해당 객체로 주입합니다.
	*/
	public function inject($action_hhmm_item_obj) {

		if(ActionItemTitleNTimeHHMM::is_not_instance($action_hhmm_item_obj)) {
			return;
		}

		$this->set_time_sec_initial($action_hhmm_item_obj->get_time_sec_initial());
		$this->set_time_sec_offset_from_init($action_hhmm_item_obj->get_time_sec_offset_from_init());
		$this->set_time_hh_mm_initial($action_hhmm_item_obj->get_time_hh_mm_initial());
		$this->set_time_hh_mm($action_hhmm_item_obj->get_time_hh_mm());

		parent::inject($action_hhmm_item_obj);
	}	

	private $context_time_hh_mm;
	private $time_sec_initial;
	private $time_sec_offset_from_init;
	private $time_hh_mm_initial;
	private $time_hh_mm;
	public function set_time_sec_initial($time_sec_initial) {
		$this->time_sec_initial = $time_sec_initial;
	}
	public function get_time_sec_initial() {
		return $this->time_sec_initial;
	}
	public function set_time_sec_offset_from_init($time_sec_offset_from_init) {
		$this->time_sec_offset_from_init = $time_sec_offset_from_init;
	}
	public function get_time_sec_offset_from_init() {
		return $this->time_sec_offset_from_init;
	}
	public function set_time_hh_mm_initial($time_hh_mm_initial) {
		$this->time_hh_mm_initial = $time_hh_mm_initial;
	}
	public function get_time_hh_mm_initial() {
		return $this->time_hh_mm_initial;
	}
	public function set_time_hh_mm($time_hh_mm) {
		$this->time_hh_mm = $time_hh_mm;
	}
	public function get_time_hh_mm() {
		return $this->time_hh_mm;
	}

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

	private function convert_time_str_hhmm_to_sec($time_str_hhmm) {

		if(empty($time_str_hhmm)) {
			return -1;
		}

		sscanf($time_str_hhmm, "%d:%d", $hours, $minutes);

		if(!is_numeric($hours) || !is_numeric($minutes)) {
			return -1;
		}

		$time_seconds = $hours * 3600 + $minutes * 60;

		return $time_seconds;
	}

	public function ActionItemTitleNTimeHHMM($action_name="", $time_str_hhmm_init="", $time_str_hhmm_specific="", $is_shy=0, $has_changed=true) {

		parent::set_name($action_name);
		parent::set_item_type(ActionItem::$TITLE_N_TIME_HH_MM);
		parent::set_is_shy($is_shy);
		parent::set_changed($has_changed);

		$time_sec_initial = $this->convert_time_str_hhmm_to_sec($time_str_hhmm_init);
		$time_sec_specific = $this->convert_time_str_hhmm_to_sec($time_str_hhmm_specific);

		if($time_sec_initial < 0 || $time_sec_specific < 0) {
			return;
		}

		if($time_sec_initial < $time_sec_specific) {
			$time_sec_offset_from_init = $time_sec_specific - $time_sec_initial;
		} else {
			$time_sec_offset_from_init = 0;
		}

		$this->set_context_time_hh_mm(
			// $time_sec_initial
			$time_sec_initial
			// $time_sec_offset_from_init
			, $time_sec_offset_from_init
		);
		
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

		$this->set_context($json_str_context_time_hh_mm);
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

		$this->set_context($json_str_context_time_hh_mm);
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

	// @ Override
	public function get_meeting_agenda_id() {
		return parent::get_meeting_agenda_id();
	}

	// @ Override
	public function set_coordinate($coordinate=null, $search_map=null) {
		return parent::set_coordinate($coordinate, $search_map);
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
	// @ Override
	public function get_context() {
		return parent::get_context();
	}

}

?>
