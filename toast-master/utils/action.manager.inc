<?php

interface Action {

	public function set_parent($parent_action_obj);
	public function get_parent();
	public function add_child($child_action_obj);
	public function get_children();

}


class ActionObject implements Action{

	private $parent_action_obj;
	private $child_action_obj_list;
	private $action_id;
	private $action_name;
	private $action_collection_type;
	private $action_collection_type_name;
	private $action_item_type;
	private $action_item_type_name;
	private $action_hash_key;

	public function ActionObject(){}

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
		$this->parent_action_object = $parent_action_obj;
	}

	public function get_parent() {
		return $this->parent_action_object;
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
		$std_obj->action_name = $this->action_name;
		$std_obj->action_collection_type = intval($this->action_collection_type);
		$std_obj->action_collection_type_name = $this->action_collection_type_name;
		$std_obj->action_item_type = intval($this->action_item_type);
		$std_obj->action_item_type_name = $this->action_item_type_name;
		$std_obj->parent_action_object = null;

		$child_action_obj_list = array();

		if(!empty($this->children_action_object_list)) {
			for($action_idx = 0; $action_idx < count($this->children_action_object_list); $action_idx++) {
				$child_action_obj_obj = $this->children_action_object_list[$action_idx];

				if(is_null($child_action_obj_obj)) continue;

				$child_action_obj_name = $child_action_obj_obj->get_name();
				$std_obj_child = $child_action_obj_obj->get_std_obj();

				$std_obj_child_parent = new stdClass();
				$std_obj_child_parent->action_id = intval($this->action_id);
				$std_obj_child_parent->action_hash_key = $this->action_hash_key;
				$std_obj_child_parent->action_name = $this->action_name;
				
				$std_obj_child_parent->action_collection_type = intval($this->action_collection_type);
				$std_obj_child_parent->action_collection_type_name = $this->action_collection_type_name;
				$std_obj_child_parent->action_item_type = intval($this->action_item_type);
				$std_obj_child_parent->action_item_type_name = $this->action_item_type_name;

				$std_obj_child->parent_action_object = $std_obj_child_parent;
				array_push($child_action_obj_list, $std_obj_child);
			}
		}
		$std_obj->children_action_object_list = $child_action_obj_list;

		return $std_obj;
	}
}

class ActionCollection extends ActionObject{

	public static function is_not_action_collection($target) {
		return !$this->is_action_collection($target);
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

		return parent::get_std_obj($std_obj);
	}	
}

?>
