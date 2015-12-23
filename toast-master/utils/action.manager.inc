<?php

interface Action {

	public function set_parent($parent);
	public function get_parent($parent);
	public function add_child($child);
	public function get_children();

}


class ActionObject implements Action{

	private $parent;
	private $children_list;
	private $id;
	private $name;
	private $type;
	private $hash_key;
	private $depth;
	private $idx;
	private $key;

	public function ActionObject(){}

	private function is_not_action_obj($target) {
		return !$this->is_action_obj($target);
	}
	private function is_action_obj($target) {
		if(!is_null($target) && is_a($target,'Action')) {
			return true;
		}
		return false;
	}

	public function set_parent($parent) {
		if($this->is_not_action_obj($parent)) {
			return;
		}
		$this->parent = $parent;
	}

	public function get_parent($parent) {
		return $this->parent;
	}

	public function add_child($child) {

		if($this->is_not_action_obj($child)) {
			echo "!Error! \$this->is_not_action_obj(\$child)<br/>";
			return;
		}

		if(is_null($this->children_list)) {
			$this->children_list = array();
		}

		if(is_null($this->depth)) {
			$this->depth = 0;
		}

		if(is_null($this->idx)) {
			$this->idx = 0;
		}

		if(is_null($this->key)) {
			$depth = $this->depth;
			$idx = $this->idx;
			$this->key = "[$depth_$idx]";
		}

		if(!is_null($child)) {
			array_push($this->children_list, $child);
			$child->set_parent($this);
			$child->set_depth($this->depth + 1);
			$child->set_idx(count($this->children_list) - 1);
			$child->set_key();
		}

	}

	public function get_children() {
		return $this->children_list;
	}

	public function set_name($name) {
		$this->name = $name;
	}
	public function get_name($name) {
		return $this->name;
	}

	public function set_type($type) {
		$this->type = $type;
	}
	public function get_type($type) {
		return $this->type;
	}

	public function set_id($id) {
		$this->id = $id;
	}
	public function get_id($id) {
		return $this->id;
	}

	public function set_hash_key($hash_key) {
		$this->hash_key = $hash_key;
	}
	public function get_hash_key($hash_key) {
		return $this->hash_key;
	}

	public function get_root_action_obj() {
		if(is_null($this->parent)) {
			return $this;	
		}

		return $this->parent->get_root_action_obj();
	}

	public function get_std_obj() {

		$std_obj = new stdClass();
		$std_obj->id = intval($this->id);
		$std_obj->hash_key = $this->hash_key;
		$std_obj->name = $this->name;
		$std_obj->type = intval($this->type);
		$std_obj->parent = null;

		$children_list = array();

		if(!empty($this->children_list)) {
			for($idx = 0; $idx < count($this->children_list); $idx++) {
				$child_obj = $this->children_list[$idx];

				if(is_null($child_obj)) continue;

				$std_obj_child = $child_obj->get_std_obj();

				$std_obj_child_parent = new stdClass();
				$std_obj_child_parent->id = intval($this->id);
				$std_obj_child_parent->hash_key = $this->hash_key;
				$std_obj_child_parent->name = $this->name;
				$std_obj_child_parent->type = intval($this->type);

				$std_obj_child->parent = $std_obj_child_parent;
				array_push($children_list, $std_obj_child);
			}
		}
		$std_obj->children_list = $children_list;

		return $std_obj;
	}

	public function set_depth($depth=-1) {
		if(is_numeric($depth) && (0 < $depth)) {
			$this->depth = $depth;
		}
	}

	public function set_idx($idx=-1) {
		if(is_numeric($idx) && (0 < $idx)) {
			$this->idx = $idx;
		}
	}

	public function set_key() {

		if(is_null($this->depth)) {
			$this->depth = 0;
		}

		if(is_null($this->idx)) {
			$this->idx = 0;
		}

		$this->key = "[$depth_$idx]";
	}

	public function get_key() {
		return $this->key;
	}

}

class ActionCollection extends ActionObject{
	private $meeting_agenda_id;

	public function set_meeting_agenda_id($meeting_agenda_id) {
		$this->meeting_agenda_id = $meeting_agenda_id;
	}
	public function get_meeting_agenda_id($meeting_agenda_id) {
		return $this->meeting_agenda_id;
	}
}

class ActionItem extends ActionObject{
	private $context;

	public function set_context($context) {
		$this->context = $context;
	}
	public function get_context($context) {
		return $this->context;
	}
}

?>
