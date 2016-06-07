<?php


interface Action {

	public function set_parent($parent_action_obj);
	public function get_parent();
	public function add_child($child_action_obj);
	public function get_children();

}


class ActionObject implements Action{

	private static $AUTO_INCREMENT_IDX=0;
	public static function GET_NEXT_IDX() { //ActionObject::GET_NEXT_IDX();
		return ActionObject::$AUTO_INCREMENT_IDX++;
	}

	// ActionObject::$COLLECTION_TYPE_LIST
	public static $COLLECTION_TYPE_LIST=1;
	public static $COLLECTION_TYPE_TABLE=2;

	public static $ITEM_TYPE_TITLE_ONLY=1;
	public static $ITEM_TYPE_TITLE_N_TIME_HH_MM=2;
	public static $ITEM_TYPE_TITLE_N_TIME_MM_SS=3;
	public static $ITEM_TYPE_SELECT_BOX=4;
	public static $ITEM_TYPE_TITLE_ONLY_FIXED=5;
	public static $ITEM_TYPE_TITLE_ONLY_ADDABLE=6;
	public static $ITEM_TYPE_SELECT_BOX_ADDABLE=7;

	public static function _IS_LIST($collection_type=-1) {
		return (ActionObject::$COLLECTION_TYPE_LIST == $collection_type)?true:false;
	}
	public static function _IS_TABLE($collection_type=-1) {
		return (ActionObject::$COLLECTION_TYPE_TABLE == $collection_type)?true:false;
	} // ActionObject::_IS_COLLECTION
	public static function _IS_COLLECTION($collection_type=-1) {
		return (ActionObject::_IS_LIST($collection_type) || ActionObject::_IS_TABLE($collection_type));
	}

	public static function _IS_TITLE_ONLY($item_type=-1) {
		return (ActionObject::$ITEM_TYPE_TITLE_ONLY == $item_type)?true:false;
	}
	public static function _IS_TITLE_N_TIME_HH_MM($item_type=-1) {
		return (ActionObject::$ITEM_TYPE_TITLE_N_TIME_HH_MM == $item_type)?true:false;
	}
	public static function _IS_TITLE_N_TIME_MM_SS($item_type=-1) {
		return (ActionObject::$ITEM_TYPE_TITLE_N_TIME_MM_SS == $item_type)?true:false;
	}
	public static function _IS_SELECT_BOX($item_type=-1) {
		return (ActionObject::$ITEM_TYPE_SELECT_BOX == $item_type)?true:false;
	}
	public static function _IS_TITLE_ONLY_FIXED($item_type=-1) {
		return (ActionObject::$ITEM_TYPE_TITLE_ONLY_FIXED == $item_type)?true:false;
	}
	public static function _IS_TITLE_ONLY_ADDABLE($item_type=-1) {
		return (ActionObject::$ITEM_TYPE_TITLE_ONLY_ADDABLE == $item_type)?true:false;
	}
	public static function _IS_SELECT_BOX_ADDABLE($item_type=-1) {
		return (ActionObject::$ITEM_TYPE_SELECT_BOX_ADDABLE == $item_type)?true:false;
	}
	public static function _IS_ITEM($item_type=-1) {

		if(ActionObject::_IS_TITLE_ONLY($item_type)) {
			return true;
		} else if(ActionObject::_IS_TITLE_N_TIME_HH_MM($item_type)) {
			return true;
		} else if(ActionObject::_IS_TITLE_N_TIME_MM_SS($item_type)) {
			return true;
		} else if(ActionObject::_IS_SELECT_BOX($item_type)) {
			return true;
		} else if(ActionObject::_IS_TITLE_ONLY_FIXED($item_type)) {
			return true;
		} else if(ActionObject::_IS_TITLE_ONLY_ADDABLE($item_type)) {
			return true;
		} else if(ActionObject::_IS_SELECT_BOX_ADDABLE($item_type)) {
			return true;
		}

		return false;
	}



	private $parent_action_obj;
	private $children_action_obj_list;
	private $action_name;
	private $action_collection_type;
	private $action_collection_type_name;
	private $action_item_type;
	private $action_item_type_name;
	private $action_hash_key;
	// private $action_order; // REMOVE ME
	private $action_is_shy;
	private $coordinate;
	private $search_map;
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
	public function set_parent($parent_action_obj=null) {
		$this->parent_action_obj = $parent_action_obj;
	}
	public function get_parent() {
		return $this->parent_action_obj;
	}
	public function get_idx() {
		if($this->has_no_parent()) {
			return -1;
		}

		$parent_action_obj = $this->get_parent();
		if(ActionObject::is_not_action_obj($parent_action_obj)) {
			return -1;
		}
		$child_action_obj_list = $parent_action_obj->get_children();

		for($idx = 0; $idx < count($child_action_obj_list); $idx++) {
			$child_action_obj = $child_action_obj_list[$idx];

			if($child_action_obj->get_id() == $this->get_id()) {
				return $idx;
			}
		}
	}
	public function remove_child($child_action_obj_remove) {

		// DEBUG
		$cur_name = $this->get_name();
		$cur_child_name = $child_action_obj_remove->get_name();

		if(ActionObject::is_not_action_obj($child_action_obj_remove)) {
			echo "!Error! / remove_child / $cur_name <-> $cur_child_name / \$this->is_not_action_obj(\$child_action_obj_remove)<br/>";
			return;
		}

		if($this->has_no_child()) {
			echo "!Error! / remove_child / $cur_name <-> $cur_child_name / \$this->has_no_child()<br/>";
			return;
		}

		$child_action_obj_list = $this->get_children();
		$child_action_obj_list_next = array();
		for($idx = 0; $idx < count($child_action_obj_list); $idx++) {
			$child_action_obj = $child_action_obj_list[$idx];

			if($child_action_obj->get_id() != $child_action_obj_remove->get_id()) {
				array_push($child_action_obj_list_next, $child_action_obj);	
			}
		}

		$this->set_children($child_action_obj_list_next);

	}
	public function add_child($child_action_obj, $idx_insert=-1) {


		if(ActionObject::is_not_action_obj($child_action_obj)) {
			echo "!Error! / add_child / $cur_name <-> $cur_child_name / \$this->is_not_action_obj(\$child_action_obj)<br/>";
			return;
		}

		// DEBUG
		$cur_name = $this->get_name();
		$cur_child_name = $child_action_obj->get_name();


		if(is_null($this->children_action_object_list)) {
			$this->children_action_object_list = array();
		}

		if(!is_null($child_action_obj)) {

			$child_action_name = $child_action_obj->get_name();

			if(-1 < $idx_insert) {
				// add child element into the specific index
				$array_replacement = array($child_action_obj);
				array_splice( $this->children_action_object_list, $idx_insert, 0, $array_replacement );	
			} else {
				// add child element to the last
				array_push($this->children_action_object_list, $child_action_obj);	
			}

			$child_action_obj->set_parent($this);
		}

		// Set Hash key
		if(empty($child_action_obj->get_hash_key())) {

			$next_idx = ActionObject::GET_NEXT_IDX();
			$child_action_hash_key = MD5($next_idx . "" . date("Ymdhisa"));
			$child_action_obj->set_hash_key($child_action_hash_key);
		}

		if( ActionCollection::is_instance($this) && 
			$this->is_root_collection() && 
			empty($this->get_hash_key())) {

			// 1. root action인 경우, 자신의 id, hash_key를 직접 만들어 저장.
			// hash_key는 action_name + 현재 시간 으로 만듦
			$next_idx = ActionObject::GET_NEXT_IDX();
			$action_hash_key = MD5($next_idx . "" . date("Ymdhisa"));

			$this->set_hash_key($action_hash_key);
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
	public function has_no_child() {
		return !$this->has_children();
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
	public function is_first() {
		return (!$this->has_sibling_before())?true:false;
	}
	public function has_sibling_before() {
		$cur_sibling_before = $this->get_sibling_before();
		if(ActionObject::is_not_action_obj($cur_sibling_before)) {
			return false;
		}
		return true;
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
	public function is_last() {
		return (!$this->has_sibling_after())?true:false;
	}
	public function has_sibling_after() {
		$cur_sibling_after = $this->get_sibling_after();
		if(ActionObject::is_not_action_obj($cur_sibling_after)) {
			return false;
		}
		return true;
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

		// action item type name
		$action_item_type_name = ActionItem::get_action_item_type_name($action_item_type);
		if(!empty($action_item_type_name)) {
			$this->set_item_type_name($action_item_type_name);
		}
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

	public function set_hash_key($action_hash_key) {
		$this->action_hash_key = $action_hash_key;
	}
	public function get_hash_key() {
		return $this->action_hash_key;
	}

	// REMOVE ME
	/*
	public function set_order($action_order) {
		$this->action_order = $action_order;
	}
	public function get_order() {
		if(is_null($this->action_order)) {
			return -1;
		}
		return $this->action_order;
	}
	*/

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

			$child_action_coordinate = $cur_coordinate . "-" . $idx;

			$cur_search_map = $child_action_obj->set_coordinate($child_action_coordinate, $cur_search_map);
		}

		if(ActionItem::is_instance($this)) {
			$add_on_list = $this->get_add_on_list();
			for($idx=0;$idx < count($add_on_list);$idx++) {
				$add_on_action_obj = $add_on_list[$idx];

				$add_on_action_coordinate = $cur_coordinate . "-A" . $idx;

				$cur_search_map = $add_on_action_obj->set_coordinate($add_on_action_coordinate, $cur_search_map);

			}
		}

		return $cur_search_map;
	}

	public function get_coordinate() {
		return $this->coordinate;
	}
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

		$cur_hash_key = $this->get_hash_key();
		if(!is_null($cur_hash_key) && !empty($cur_hash_key)) {
			$search_map->{$cur_hash_key} = $this;
		}

		$this->search_map = $search_map;
	}
	public function get_search_map() {
		return $this->search_map;
	}
	public function search($action_hash_key=null) {

		if(empty($action_hash_key)) {
			echo "!Error! / search / empty(\$action_hash_key)<br/>";
			return null;
		}

		if(is_null($this->search_map)) {
			$this->search_map = new stdClass();
		}
		
		$action_obj_from_search = $this->search_map->{$action_hash_key};
		$cur_name = $this->get_name();
		if(is_null($action_obj_from_search)) {
			echo "$cur_name / search / \$action_hash_key :: $action_hash_key is null!<br/>";			
			return null;
		}

		return $action_obj_from_search;
	}
	// @ desc : action obj context의 일치된 속성을 가지고 있는 action obj을 돌려줍니다. root action obj부터 검색을 시작합니다.
	public function search_by_context_from_root($context_key="", $context_value="") {

		$cur_root_action_obj = $this;
		if($this->is_not_root_collection()) {
			$cur_root_action_obj = $this->get_root_action_obj();
		}

		if(ActionObject::is_not_action_obj($cur_root_action_obj)) {
			echo "!Error! / search_by_context_from_root / ActionObject::is_not_action_obj($cur_root_action_obj)<br/>";
			return;
		}

		return $cur_root_action_obj->search_by_context($context_key, $context_value);

	}
	private function search_by_context($context_key="", $context_value="") {

		// ACTION ITEM인 경우만 진행합니다.
		if(is_null($context_key) || empty($context_key)) {
			return null;
		}

		// DEBUG
		// $cur_actino_name = $this->get_name();

		$cur_context_str = $this->get_context();
		$cur_context_obj = json_decode($cur_context_str);

		if(!empty($context_value)) {

			// context value가 유효한 경우
			$cur_context_value = $cur_context_obj->{$context_key};
			if(!is_null($cur_context_value) && (strcmp($cur_context_value , $context_value)) == 0) {
				return $this;
			}

		} else {

			// context value가 공백, null일 경우. key 값만 매칭되면 반환.
			$cur_context_value = $cur_context_obj->{$context_key};
			if(!is_null($cur_context_value)) {
				return $this;
			}

		}

		if($this->has_children()) {
			$cur_children = $this->get_children();
			for($idx=0;$idx < count($cur_children);$idx++) {
				$cur_child_action_obj = $cur_children[$idx];
				$result = $cur_child_action_obj->search_by_context($context_key, $context_value);

				if(ActionObject::is_action_obj($result)) {
					return $result;
				}
			}
		}

		if(ActionItem::is_instance($this) && $this->has_add_on_list()) {
			$cur_children = $this->get_add_on_list();
			for($idx=0;$idx < count($cur_children);$idx++) {
				$cur_add_on_action_obj = $cur_children[$idx];
				$result = $cur_add_on_action_obj->search_by_context($context_key, $context_value);

				if(ActionObject::is_action_obj($result)) {
					return $result;
				}
			}
		}





	}


	public function get_std_obj($std_obj=null) {

		if(is_null($std_obj)) {
			$std_obj = new stdClass();
		}

		$std_obj->action_hash_key = $this->action_hash_key;
		// $std_obj->action_order = intval($this->action_order); // REMOVE ME
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
				$std_obj_child_parent->action_hash_key = $this->action_hash_key;
				// $std_obj_child_parent->action_order = intval($this->action_order); // REMOVE ME
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
		// $this->set_order($action_obj->get_order()); // REMOVE ME
		$this->set_is_shy($action_obj->get_is_shy());

	}

	public function set_context($context) {
		$this->context = $context;
	}
	public function get_context() {
		return $this->context;
	}
	public function get_context_obj() {

		if(empty($this->context)) {
			return new stdClass();
		}

		return json_decode($this->context);
	}
	// @ Desc : 모든 키를 복사합니다. 값은 공백으로 채워집니다. json 문자열을 돌려줍니다.
	public function copy_context($new_context_str = "") {
		
		$copy_context_obj = $this->copy_context_obj();
		if(is_null($copy_context_obj)) {
			return "";
		}

		if(!empty($new_context_str)) {

			// 복사된 컨텍스트에 추가되는 내용이 있는 경우. 
			$new_context_obj = json_decode($new_context_str);
			if(is_null($new_context_obj)) {
				return json_encode($copy_context_obj);
			}

			foreach($new_context_obj as $key => $value) {

				if(is_null($value)) {
					$value = "";
				}

				$copy_context_obj->{$key} = $value;
				
			} // end foreach
			
		} // end if

		return json_encode($copy_context_obj);
	}
	// @ Desc : 모든 키를 복사합니다. 값은 공백으로 채워집니다.
	public function copy_context_obj() {

		$params = new ToastmasterParamManager();

		$cur_context_obj = $this->get_context_obj();
		$context_obj_copy = new stdClass();
		foreach($cur_context_obj as $key => $value) {

			// ACTION_DB_INSERT_MSG, ACTION_DB_UPDATE_MSG, ACTION_DB_DELETE_MSG는 옮겨줍니다.
			if(	strcmp($key, $params->ACTION_DB_INSERT_MSG) == 0 ||
				strcmp($key, $params->ACTION_DB_UPDATE_MSG) == 0 ||
				strcmp($key, $params->ACTION_DB_DELETE_MSG) == 0 ) {

				$context_obj_copy->{$key} = $value;	

			} else {

				$context_obj_copy->{$key} = "";	

			} // end if
           	
		} // end for

		return $context_obj_copy;

	}
	public function set_context_obj($context_obj=null) {

		if(is_null($context_obj)) {
			$context_obj = new stdClass();
		}

		$this->context = json_encode($context_obj);
	}
	public function set_context_attr($key="", $value="") {

		if(empty($key)) {
			return;
		}
		if(is_null($value)) {
			$value = "";
		}

		$cur_context_str = $this->get_context();

		$next_context_obj = $this->get_context_obj();

		$next_context_obj->{$key} = $value;

		$next_context_str = json_encode($next_context_obj);

		$this->context = $next_context_str;
	}
	public function get_context_attr($key="") {

		if(empty($key)) {
			return;
		}

		$cur_context_obj = $this->get_context_obj();
		return $cur_context_obj->{$key};
	}	
	public function has_context_attr($key="", $value="") {

		if(empty($key)) {
			return false;
		}

		$cur_context_obj = $this->get_context_obj();
		if(is_null($cur_context_obj)) {
			return false;
		}
		if(is_null($cur_context_obj->{$key})) {
			return false;
		}

		if(!empty($value)) {

			// key, value를 같이 검사해야 하는 경우.
			if(strcmp($cur_context_obj->{$key},$value) == 0) {
				return true;
			}
			return false;

		} else {

			// key를 가지고 있는지 여부만 검사하는 경우.
			return true;

		}

		
	}
	// @ desc : 새로 들어온 context의 속성으로 추가 및 업데이트를 해줍니다.
	public function add_context_attr($new_context_str="") {

		if(empty($new_context_str)) {
			return;
		}

		$new_context_obj = json_decode($new_context_str);
		if(is_null($new_context_obj)) {
			return;
		}

		foreach($new_context_obj as $key => $value) {

			if(is_null($value)) {
				$value = "";
			}

			
			$this->set_context_attr($key, $value);
		} // end for

	}


	// @ Desc : 자신과 파라미터로 넘어온 action obj가 동일한지 id, hash_key값을 비교해 알려줍니다.
	public function is_equal($target_action_obj=null) {

		$cur_action_hash_key = $this->get_hash_key();
		if(empty($cur_action_hash_key)) {
			return false;
		}

		if(ActionObject::is_not_action_obj($target_action_obj)) {
			return false;
		}

		$cur_action_hash_key_target = $target_action_obj->get_hash_key();
		if(empty($cur_action_hash_key_target)) {
			return false;
		}

		if(strcmp($cur_action_hash_key, $cur_action_hash_key_target) == 0) {
			return true;
		}

		return false;
	}

	public function show_info() {

		$cur_id = $this->get_id();
		$cur_hash_key = $this->get_hash_key();
		$cur_name = $this->get_name();
		$cur_collection_type_name = $this->get_collection_type_name();
		$cur_item_type_name = $this->get_item_type_name();
		$has_parent = $this->has_parent();

		$cur_collection_type = $this->get_collection_type();

		// $is_table = $this->is_table();
		// $is_list = $this->is_list();

		echo "\$cur_id :: $cur_id<br/>";
		echo "\$cur_hash_key :: $cur_hash_key<br/>";
		echo "\$cur_name :: $cur_name<br/>";
		echo "\$cur_collection_type_name :: $cur_collection_type_name<br/>";
		echo "\$cur_item_type_name :: $cur_item_type_name<br/>";
		echo "\$has_parent :: $has_parent<br/>";

		echo "\$cur_collection_type :: $cur_collection_type<br/>";

		// echo "\$is_table :: $is_table<br/>";
		// echo "\$is_list :: $is_list<br/>";

	}

	// VIEW PROPS
	private $text_color_arr;	// TCPDFElement::$COLOR_DARK_GRAY_ARR
	private $text_size;			// $CARD_BOARD_TITLE_FONT_SIZE
	private $cell_x_pos;		// $element_set_x_pos
	private $cell_y_pos;
	private $cell_width;
	private $cell_height;
	private $cell_color_arr;	// TCPDFElement::$COLOR_MILK_GRAY_ARR
	private $is_bold;			// true or false
	private $text_align;		// TCPDFElement::$TEXT_ALIGN_LEFT
	private $font_type;

	public function set_text_color_arr($text_color_arr) {
		$this->text_color_arr = $text_color_arr;
	}
	public function get_text_color_arr() {
		return $this->text_color_arr;	
	}

	public function set_text_size($text_size) {
		$this->text_size = $text_size;
	}
	public function get_text_size() {
		return $this->text_size;	
	}

	public function set_cell_x_pos($cell_x_pos) {
		$this->cell_x_pos = $cell_x_pos;
	}
	public function get_cell_x_pos() {
		return $this->cell_x_pos;	
	}

	public function set_cell_y_pos($cell_y_pos) {
		$this->cell_y_pos = $cell_y_pos;
	}
	public function get_cell_y_pos() {
		return $this->cell_y_pos;	
	}

	public function set_cell_width($cell_width) {
		$this->cell_width = $cell_width;
	}
	public function get_cell_width() {
		return $this->cell_width;	
	}

	public function set_cell_height($cell_height) {
		$this->cell_height = $cell_height;
	}
	public function get_cell_height() {
		return $this->cell_height;
	}

	public function set_cell_color_arr($cell_color_arr) {
		$this->cell_color_arr = $cell_color_arr;
	}
	public function get_cell_color_arr() {
		return $this->cell_color_arr;	
	}

	public function set_is_bold($is_bold) {
		$this->is_bold = $is_bold;
	}
	public function get_is_bold() {
		return $this->is_bold;	
	}

	public function set_text_align($text_align) {
		$this->text_align = $text_align;
	}
	public function get_text_align() {
		return $this->text_align;	
	}

	public function set_font_type($font_type) {
		$this->font_type = $font_type;
	}
	public function get_font_type() {
		return $this->font_type;	
	}

	// @ desc : 들여쓰기에 필요한 depth 정보를 가져옵니다.
	public function get_depth($depth=0) {
		if(ActionCollection::is_instance($this) && $this->is_root_collection()) {
			return $depth;
		}

		if($this->has_parent()) {

			$cur_parent = $this->get_parent();	
			return $cur_parent->get_depth($depth + 1);

		} else if(ActionCollection::is_instance($this) && $this->has_add_on_parent()) {

			$cur_add_on_action_parent_obj = $this->get_add_on_action_parent_obj();	
			return $cur_add_on_action_parent_obj->get_depth($depth + 1);
			
		}

		return $depth;
	}

	// @ desc : action std 와 action obj간의 데이터 일치성 확인. recursive check. 
	// @ Usage : ActionObject::compare_with_std($action_obj, $action_std);
	public static function compare_with_std($action_obj=null, $action_std=null) {

		$action_name = $action_std->action_name;
		$action_hash_key = $action_std->action_hash_key;
		$coordinate = $action_std->coordinate;
		//coordinate
		// echo "!!HERE!! / \$action_name ::: $action_name<br/>";

		// check validation of 2 objects.
		if(ActionObject::is_not_action_obj($action_obj)) {

			echo "!!HERE!! / \$action_name ::: $action_name<br/>";
			echo "!!HERE!! / \$action_hash_key ::: $action_hash_key<br/>";
			echo "!!HERE!! / \$coordinate ::: $coordinate<br/>";

			echo "!Error! / compare_with_std / ActionObject::is_not_action_obj(\$action_obj)<br/>";
			return false;
		} 
		if(is_null($action_std)) {
			echo "!Error! / compare_with_std / is_null(\$action_std)<br/>";
			return false;
		}



		// wonder.jung

		if(ActionObject::_IS_COLLECTION($action_std->action_collection_type)) {

			if(strcmp($action_obj->get_hash_key(),$action_std->action_hash_key) != 0) {
				$hash_key_from_obj = $action_obj->get_hash_key();
				$hash_key_from_std = $action_std->action_hash_key;
				echo "col / false : \$hash_key_from_obj : $hash_key_from_obj<br/>";
				echo "col / false : \$hash_key_from_std : $hash_key_from_std<br/>";
				return false;
			}
			if($action_obj->get_collection_type() != intval($action_std->action_collection_type)) {
				$collection_type = $action_obj->get_collection_type();
				echo "col / false : \$collection_type : $collection_type<br/>";
				return false;
			}
			if(strcmp($action_obj->get_collection_type_name(),$action_std->action_collection_type_name) != 0) {
				$collection_type_name = $action_obj->get_collection_type_name();
				echo "col / false : \$collection_type_name : $collection_type_name<br/>";
				return false;
			}
			if(strcmp($action_obj->get_name(),$action_std->action_name) != 0) {
				$cur_name = $action_obj->get_name();
				echo "col / false : \$cur_name : $cur_name<br/>";
				return false;
			}
			if($action_obj->get_is_shy() != $action_std->action_is_shy) {
				$is_shy = $action_obj->get_is_shy();
				echo "col / false : \$is_shy : $is_shy<br/>";
				return false;
			}

			// treat children
			$children_action_std_list = $action_std->children_action_object_list;

			if($action_obj->get_children_cnt() != count($children_action_std_list)) {
				echo "col / false : children cnt is not equal<br/>";
				return false;
			}

			for($idx = 0; $idx < count($children_action_std_list); $idx++) {

				$children_action_std = $children_action_std_list[$idx];
				$children_action_obj = $action_obj->get_child($idx);

				$is_same = ActionObject::compare_with_std($children_action_obj, $children_action_std);

				if(!$is_same) {
					return false;
				}
			}

		} else if(ActionObject::_IS_ITEM($action_std->action_item_type)) {

			if(strcmp($action_obj->get_hash_key(),$action_std->action_hash_key) != 0) {
				$hash_key = $action_obj->get_hash_key();
				echo "item / false : \$hash_key : $hash_key<br/>";
				return false;
			}
			if($action_obj->get_item_type() != intval($action_std->action_item_type)) {
				$item_type = $action_obj->get_item_type();
				echo "item / false : \$item_type : $item_type<br/>";
				return false;
			}
			if(strcmp($action_obj->get_item_type_name(),$action_std->action_item_type_name) != 0) {
				$item_type_name = $action_obj->get_item_type_name();
				echo "item / false : \$item_type_name : $item_type_name<br/>";
				return false;
			}
			if(strcmp($action_obj->get_name(),$action_std->action_name) != 0) {
				$cur_name = $action_obj->get_name();
				echo "item / false : \$cur_name : $cur_name<br/>";
				return false;
			}
			if(strcmp($action_obj->get_context(),$action_std->context) != 0) {
				$cur_context = $action_obj->get_context();
				echo "item / false : \$cur_context : $cur_context<br/>";
				return false;
			}
			if($action_obj->get_is_shy() != $action_std->action_is_shy) {
				$cur_is_shy = $action_obj->get_is_shy();
				echo "item / false : \$cur_is_shy : $cur_is_shy<br/>";
				return false;
			}

			// treat children
			// children_action_object_list - wonder.jung / TODO
			
			$children_action_std_list = $action_std->children_action_object_list;

			if($action_obj->get_children_cnt() != count($children_action_std_list)) {
				echo "item / false : children cnt is not equal<br/>";
				return false;
			}

			for($idx = 0; $idx < count($children_action_std_list); $idx++) {

				$children_action_std = $children_action_std_list[$idx];
				$children_action_obj = $action_obj->get_child($idx);

				$is_same = ActionObject::compare_with_std($children_action_obj, $children_action_std);

				if(!$is_same) {
					return false;
				}

			}

			// treat add on children
			// add_on_action_object_list
			$add_on_action_std_list = $action_std->add_on_action_object_list;
			$cur_add_on_list = $action_obj->get_add_on_list();

			if(count($cur_add_on_list) != count($add_on_action_std_list)) {
				echo "item / false : add on children cnt is not equal<br/>";
				return false;
			}

			for($idx = 0; $idx < count($add_on_action_std_list); $idx++) {

				$add_on_children_action_std = $add_on_action_std_list[$idx];
				$add_on_children_action_obj = $cur_add_on_list[$idx];

				$is_same = ActionObject::compare_with_std($add_on_children_action_obj, $add_on_children_action_std);

				if(!$is_same) {
					return false;
				}

			} // end for

		} // end if

		return true;

	}


	// @ desc : action std --> action obj로 변경 / ActionObject::convert($action_std);
	public static function convert($action_std) {

		// 1. 파라미터로 가져온 객체를 root 객체로 가정, action obj로 바꾸는 작업을 진행합니다.

		// 1-1. type check
		// 1-1-1. prop
		// A.action_collection_type
		// B.action_item_type

		// 1-2. 자신의 데이터로 action obj를 만듭니다.
		$action_obj = null;
		if(ActionObject::_IS_COLLECTION($action_std->action_collection_type)) {

			// get_action_table_object
			// property는 list와 table이 동일

			$action_obj = new ActionCollection();
			$action_obj->set_hash_key($action_std->action_hash_key);
			$action_obj->set_collection_type(intval($action_std->action_collection_type));
			$action_obj->set_collection_type_name($action_std->action_collection_type_name);
			$action_obj->set_name($action_std->action_name);
			$action_obj->set_is_shy($action_std->action_is_shy);

			// treat children
			$children_action_std_list = $action_std->children_action_object_list;
			for($idx = 0; $idx < count($children_action_std_list); $idx++) {

				$children_action_std = $children_action_std_list[$idx];
				$children_action_obj = ActionObject::convert($children_action_std);

				$action_obj->add_child($children_action_obj);
			}

		} else if(ActionObject::_IS_ITEM($action_std->action_item_type)) {

			//  property
			if(ActionObject::_IS_TITLE_N_TIME_HH_MM($action_std->action_item_type)) {
				$action_obj = new ActionItemTitleNTimeHHMM();
			} else {
				$action_obj = new ActionItem();
			}

			$action_obj->set_hash_key($action_std->action_hash_key);
			$action_obj->set_item_type(intval($action_std->action_item_type));

			$action_obj->set_item_type_name($action_std->action_item_type_name);
			$action_obj->set_name($action_std->action_name);

			$action_obj->set_context($action_std->context);
			$action_obj->set_is_shy($action_std->action_is_shy);


			// treat children
			// children_action_object_list - wonder.jung / TODO

			$children_action_std_list = $action_std->children_action_object_list;
			for($idx = 0; $idx < count($children_action_std_list); $idx++) {

				$children_action_std = $children_action_std_list[$idx];
				$children_action_obj = ActionObject::convert($children_action_std);

				$action_obj->add_child($children_action_obj);
			}


			// treat add on children
			// add_on_action_object_list

			$add_on_action_std_list = $action_std->add_on_action_object_list;
			for($idx = 0; $idx < count($add_on_action_std_list); $idx++) {

				$add_on_children_action_std = $add_on_action_std_list[$idx];
				$add_on_children_action_obj = ActionObject::convert($add_on_children_action_std);

				$action_obj->push_add_on($add_on_children_action_obj);
			} // end for
		} // end if

		return $action_obj;

	} // end function 

}

class ActionCollection extends ActionObject{
	
	// @ Public
	// @ Usage : ActionCollection::is_not_instance($target)	
	public static function is_not_instance($target) {
		return !ActionCollection::is_instance($target);
	}
	
	// @ Public
	// @ Usage : ActionCollection::is_instance($target)
	public static function is_instance($target) {
		if(!is_null($target) && is_a($target,'ActionCollection')) {
			return true;
		}
		return false;
	}

	public function ActionCollection($action_name="", $action_collection_type=1, $is_shy=0) {
		parent::set_name($action_name);
		parent::set_collection_type($action_collection_type);

		if(ActionCollection::$ACTION_COLLECTION_TYPE_LIST == $action_collection_type) {
			parent::set_collection_type_name(ActionCollection::$ACTION_COLLECTION_TYPE_NAME_LIST);
		} else if(ActionCollection::$ACTION_COLLECTION_TYPE_TABLE == $action_collection_type) {
			parent::set_collection_type_name(ActionCollection::$ACTION_COLLECTION_TYPE_NAME_TABLE);
		}

		parent::set_is_shy($is_shy);
	}

	// REMOVE ME?

	public static $ACTION_COLLECTION_TYPE_LIST=1; 		// ActionCollection::$ACTION_COLLECTION_TYPE_LIST
	public static $ACTION_COLLECTION_TYPE_TABLE=2;		// ActionCollection::$ACTION_COLLECTION_TYPE_TABLE

	public static $ACTION_COLLECTION_TYPE_NAME_LIST="LIST";
	public static $ACTION_COLLECTION_TYPE_NAME_TABLE="TABLE";

	public function is_list() {

		$action_collection_type = parent::get_collection_type();
		if(is_null($action_collection_type) || (ActionCollection::$ACTION_COLLECTION_TYPE_LIST != $action_collection_type)) {
			return false;
		} else if(ActionCollection::$ACTION_COLLECTION_TYPE_LIST == $action_collection_type) {
			return true;
		}
		return false;
	}

	public function is_table_column_list() {

		$cur_parent = $this->get_parent();
		if(ActionCollection::is_not_instance($cur_parent)) {
			return false;
		}

		if($cur_parent->is_table()) {
			return true;
		}
		return false;

	}

	public function is_table() {

		$action_collection_type = parent::get_collection_type();

		if(is_null($action_collection_type) || (ActionCollection::$ACTION_COLLECTION_TYPE_TABLE != $action_collection_type)) {
			return false;
		} else if(ActionCollection::$ACTION_COLLECTION_TYPE_TABLE == $action_collection_type) {
			return true;
		}
		return false;
	}

	public function is_not_table() {
		return !$this->is_table();
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
		return ($this->has_no_parent() && $this->has_no_add_on_parent());
	}

	private $add_on_action_parent_obj;
	public function set_add_on_action_parent_obj($add_on_action_parent_obj) {
		$this->add_on_action_parent_obj = $add_on_action_parent_obj;
	}
	public function get_add_on_action_parent_obj() {
		return $this->add_on_action_parent_obj;
	}
	public function has_no_add_on_parent(){
		return !$this->has_add_on_parent();
	}
	public function has_add_on_parent(){
		if(!is_null($this->add_on_action_parent_obj)) {
			return true;
		}
		return false;
	}
	public function is_last_add_on() {

		if($this->has_no_add_on_parent()) {
			return false;
		}

		$cur_add_on_action_parent_obj = $this->get_add_on_action_parent_obj();
		if(ActionItem::is_not_instance($cur_add_on_action_parent_obj)) {
			echo "!Error! / is_last_add_on / ActionItem::is_not_instance(\$cur_add_on_action_parent_obj)<br/>";
			return;
		}

		$cur_add_on_list = $cur_add_on_action_parent_obj->get_add_on_list();
		if(!is_array($cur_add_on_list)) {
			echo "!Error! / is_last_add_on / !is_array(\$cur_add_on_list)<br/>";
			return;
		}
		if(empty($cur_add_on_list)) {
			echo "!Error! / is_last_add_on / empty(\$cur_add_on_list)<br/>";
			return;
		}
		$last_idx = (count($cur_add_on_list) - 1);
		$last_add_on_action_obj = $cur_add_on_list[$last_idx];

		if(ActionCollection::is_not_instance($last_add_on_action_obj)) {
			echo "!Error! / is_last_add_on / ActionCollection::is_not_instance(\$last_add_on_action_obj)<br/>";
			return;
		}

		if(strcmp($last_add_on_action_obj->get_hash_key(),$this->get_hash_key()) == 0) {
			return true;
		}

		return false;
	}


	public function search_hash_key($hash_key) {

		if(empty($hash_key)) {
			return null;
		}

		if(strcmp($hash_key, $this->get_hash_key()) == 0) {
			return $this;
		}

		$children_action_list = $this->get_children();
		for($idx = 0; $idx < count($children_action_list); $idx++) {
			$child_action_object = $children_action_list[$idx];
			$search_result = $child_action_object->search_hash_key($hash_key);

			if(!is_null($search_result)) {
				return $search_result;
			}
		}

		return null;
	}

	// @ Override
	public function get_std_obj($std_obj=null) {

		if(is_null($std_obj)) {
			$std_obj = new stdClass();	
		}

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

		parent::inject($action_collection_obj);
	}

	// @ Override
	public function get_name() {
		return parent::get_name();
	}

	// @ Override
	public function show_info() {

		parent::show_info();

		$is_table = $this->is_table();
		$is_list = $this->is_list();
		
		if($is_table) {
			echo "\$is_table :: true<br/>";	
		} else {
			echo "\$is_table :: false<br/>";	
		}

		if($is_list) {
			echo "\$is_list :: true<br/>";	
		} else {
			echo "\$is_list :: false<br/>";	
		}

	}	

}



























class ActionItem extends ActionObject{

	public function ActionItem($action_name="New Item", $action_item_type=1, $is_shy=0) {
		parent::set_name($action_name);
		parent::set_item_type($action_item_type);
		parent::set_is_shy($is_shy);
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

	public function is_not_table_field_item() {
		return !$this->is_table_field_item();
	}
	public function is_table_field_item() {

		$cur_parent = $this->get_parent();
		if(ActionCollection::is_not_instance($cur_parent)) {
			return false;
		}

		if($cur_parent->is_table_column_list()) {
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

		$cur_add_on_list = $this->get_add_on_list();

		// action obj --> action std obj로 변환
		$cur_add_on_std_list = array();
		for($idx=0; $idx < count($cur_add_on_list); $idx++) {
			$cur_action_obj = $cur_add_on_list[$idx];

			if(ActionObject::is_not_action_obj($cur_action_obj)) {
				echo "!Error! \$this->is_not_action_obj(\$cur_action_obj)<br/>";
				return;
			}

			$cur_action_obj_std = $cur_action_obj->get_std_obj();
			array_push($cur_add_on_std_list, $cur_action_obj_std);
		}		
		
		$std_obj->add_on_action_object_list = $cur_add_on_std_list;

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
			$add_on_collection->set_add_on_action_parent_obj($this);
			array_push($this->add_on_action_object_list, $add_on_collection);
		}

		// $cur_coordinate = $this->get_coordinate();
		if(empty($add_on_collection->get_hash_key())) {

			$next_idx = ActionObject::GET_NEXT_IDX();
			$cur_add_on_action_hash_key = MD5($next_idx . "" . date("Ymdhisa"));
			$add_on_collection->set_hash_key($cur_add_on_action_hash_key);

		}

	}
	public function has_add_on_list() {
		$cur_add_on_list = $this->get_add_on_list();
		return !empty($cur_add_on_list)?true:false;
	}
	public function get_add_on_cnt() {
		if(is_null($this->add_on_action_object_list) || !is_array($this->add_on_action_object_list)) {
			return 0;
		}

		return count($this->add_on_action_object_list);
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

	public function search_hash_key($hash_key) {

		if(empty($hash_key)) {
			return null;
		}

		if(strcmp($hash_key, $this->get_hash_key()) == 0) {
			return $this;
		}

		// search in child list
		$children_action_list = $this->get_children();
		for($idx = 0; $idx < count($children_action_list); $idx++) {
			$child_action_object = $children_action_list[$idx];
			$search_result = $child_action_object->search_hash_key($hash_key);

			if(!is_null($search_result)) {
				return $search_result;
			}
		}

		$children_add_on_action_list = $this->get_add_on_list();
		for($idx = 0; $idx < count($children_add_on_action_list); $idx++) {
			$child_add_on_action_object = $children_add_on_action_list[$idx];
			$search_result = $child_add_on_action_object->search_hash_key($hash_key);

			if(!is_null($search_result)) {
				return $search_result;
			}
		}

		return null;
	}	

	// 아이템 타입별로 context 내용을 구성하는 방식이 다르다.
	public static $TITLE_ONLY=1;			// ActionItem::$TITLE_ONLY
	public static $TITLE_N_TIME_HH_MM=2;	// ActionItem::$TITLE_N_TIME_HH_MM
	public static $TITLE_N_TIME_MM_SS=3;	// ActionItem::$TITLE_N_TIME_MM_SS
	public static $SELECT_BOX=4;			// ActionItem::$SELECT_BOX
	public static $TITLE_ONLY_FIXED=5;		// ActionItem::$TITLE_ONLY_FIXED
	public static $TITLE_ONLY_ADDABLE=6;	// ActionItem::$TITLE_ONLY_ADDABLE
	public static $SELECT_BOX_ADDABLE=7;	// ActionItem::$SELECT_BOX_ADDABLE

	
	// @ Public
	// @ Usage : ActionItem::is_valid_action_item_type($action_item_type);
	public static function is_valid_action_item_type($action_item_type) {

		if(is_null($action_item_type) || !is_numeric($action_item_type)) {
			return false;
		}

		if(	ActionItem::$TITLE_ONLY == $action_item_type ||
			ActionItem::$TITLE_N_TIME_HH_MM == $action_item_type ||
			ActionItem::$TITLE_N_TIME_MM_SS == $action_item_type ||
			ActionItem::$SELECT_BOX == $action_item_type ||
			ActionItem::$TITLE_ONLY_FIXED == $action_item_type ||
			ActionItem::$TITLE_ONLY_ADDABLE == $action_item_type ||
			ActionItem::$SELECT_BOX_ADDABLE == $action_item_type ) {

			return true;
		}

		return false;
	}

	// @ Public
	// @ Usage : ActionItem::get_action_item_type_name($action_item_type);
	public static function get_action_item_type_name($action_item_type=-1) {

		if(is_null($action_item_type) || $action_item_type < 1) {
			return "";
		}

		if(ActionItem::$TITLE_ONLY == $action_item_type) {
			return "TITLE_ONLY";
		} else if(ActionItem::$TITLE_N_TIME_HH_MM == $action_item_type) {
			return "TITLE_N_TIME_HH_MM";
		} else if(ActionItem::$TITLE_N_TIME_MM_SS == $action_item_type) {
			return "TITLE_N_TIME_MM_SS";
		} else if(ActionItem::$SELECT_BOX == $action_item_type) {
			return "SELECT_BOX";
		} else if(ActionItem::$TITLE_ONLY_FIXED == $action_item_type) {
			return "TITLE_ONLY_FIXED";
		} else if(ActionItem::$TITLE_ONLY_ADDABLE == $action_item_type) {
			return "TITLE_ONLY_ADDABLE";
		} else if(ActionItem::$SELECT_BOX_ADDABLE == $action_item_type) {
			return "SELECT_BOX_ADDABLE";
		}

		return "";
	}
	
	// @ Override
	public function set_coordinate($coordinate=null, $search_map=null) {
		return parent::set_coordinate($coordinate, $search_map);
	}

	// @ Override
	public function set_context($new_context=null) {
		parent::set_context($new_context);
	}
	// @ Override
	public function get_context() {
		return parent::get_context();
	}
	// @ desc : 자신이 속한 테이블의 열의 모든 아이템의 배열을 돌려줍니다. 이중 배열의 형태로 반환
	public function get_table_row_list() {

		if($this->is_not_table_field_item()) {
			echo "!Error! / " . __FUNCTION__ . " / \$this->is_not_table_field_item()";
			return;
		}

		$table_column_action_list = $this->get_parent();
		if(ActionCollection::is_not_instance($table_column_action_list)) {
			echo "!Error! / " . __FUNCTION__ . " / ActionCollection::is_not_instance(\$table_column_action_list)";
			return;
		}

		$table_field_action_item_list = $table_column_action_list->get_children();
		$table_row_list = array();
		for($idx = 0; $idx < count($table_field_action_item_list); $idx++ ) {
			$table_field_action_item = $table_field_action_item_list[$idx];
			if(ActionItem::is_not_instance($table_field_action_item)) {
				echo "!Error! / " . __FUNCTION__ . " / ActionItem::is_not_instance(\$table_field_action_item)";
				return;
			}

			// 제목 표시 타입은 제거한다.
			if(ActionItem::$TITLE_ONLY_FIXED == $table_field_action_item->get_item_type()) {
				continue;
			}

			$cur_table_row_field_action_item_list = $table_field_action_item->get_table_row_field_action_item_list();
			array_push($table_row_list, $cur_table_row_field_action_item_list);
		}

		return $table_row_list;

	}

	// @ desc : 자신이 속한 테이블의 열의 모든 아이템의 배열을 돌려줍니다.
	public function get_table_row_field_action_item_list() {

		if($this->is_not_table_field_item()) {
			echo "!Error! / get_table_row_field_action_item_list / \$this->is_not_table_field_item()";
			return;
		}

		$cur_idx = $this->get_idx();
		if(is_null($cur_idx) || !(0 <= $cur_idx)) {
			echo "!Error! / get_table_row_field_action_item_list / \$cur_idx is not valid! / \$cur_idx :: $cur_idx";
			return;
		}

		$table_column_action_list = $this->get_parent();
		if(ActionCollection::is_not_instance($table_column_action_list)) {
			echo "!Error! / get_table_row_field_action_item_list / ActionCollection::is_not_instance(\$table_column_action_list)";
			return;
		}

		$table_action_obj = $table_column_action_list->get_parent();
		if(ActionCollection::is_not_instance($table_action_obj)) {
			echo "!Error! / get_table_row_field_action_item_list / ActionCollection::is_not_instance(\$table_action_obj)";
			return;
		}

		if($table_action_obj->is_not_table()) {
			echo "!Error! / get_table_row_field_action_item_list / \$table_action_obj->is_not_table()";
			return;
		}

		$cur_child_column_action_list_list = $table_action_obj->get_children();
		$table_row_field_action_item_list = array();
		for($idx = 0;$idx < count($cur_child_column_action_list_list);$idx++) {
			$cur_child_column_action_list = $cur_child_column_action_list_list[$idx];

			if(ActionCollection::is_not_instance($cur_child_column_action_list)) {
				echo "!Error! / get_table_row_field_action_item_list / ActionCollection::is_not_instance(\$cur_child_column_action_list)";
				return;
			}

			$table_field_action_item_list = $cur_child_column_action_list->get_children();
			for($inner_idx = 0;$inner_idx < count($table_field_action_item_list);$inner_idx++) {
				$table_field_action_item_obj = $table_field_action_item_list[$inner_idx];

				if(ActionItem::is_not_instance($table_field_action_item_obj)) {
					echo "!Error! / get_table_row_field_action_item_list / ActionItem::is_not_instance(\$table_field_action_item_obj)";
					return;
				}

				if($table_field_action_item_obj->get_idx() == $cur_idx) {
					array_push($table_row_field_action_item_list, $table_field_action_item_obj);
					break;
				}
			} // end inner for
		} // end outer for

		if($table_action_obj->get_children_cnt() != count($table_row_field_action_item_list)) {
			echo "!Error! / get_table_row_field_action_item_list / \$table_action_obj->get_children_cnt() != count(\$table_row_field_action_item_list)";
			return;
		}

		return $table_row_field_action_item_list;
		
	}	
}





























/*
	@ Desc : 제목과 시간을 나타내는 Action Item. 시작 시간을 정의할 수 있습니다. 시간 관련 메서드가 추가됩니다.
*/
class ActionItemTitleNTimeHHMM extends ActionItem{

	// @ Usage : ActionItemTitleNTimeHHMM::is_not_instance($target)
	public static function is_not_instance($target) {
		return !ActionItemTitleNTimeHHMM::is_instance($target);
	}
	// @ Usage : ActionItemTitleNTimeHHMM::is_instance($target)
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

	public function ActionItemTitleNTimeHHMM($action_name="", $time_str_hhmm_init="", $time_str_hhmm_specific="", $is_shy=0) {

		parent::set_name($action_name);
		parent::set_item_type(ActionItem::$TITLE_N_TIME_HH_MM);
		parent::set_is_shy($is_shy);

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
