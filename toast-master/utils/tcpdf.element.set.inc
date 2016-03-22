<?php

include_once('tcpdf.element.inc');
include_once('tcpdf.element.set.inc');

class TCPDFElementSet{

	/*

		TCPDFManager로 만들어지는 뷰 템플릿의 엘리먼트 셋 클래스입니다.
		아래와 같은 기능을 갖습니다.

		1. 테이블, 리스트 같은 형태의 데이터를 관리합니다.
		2. 테이블, 리스트내에 포함된 엘리먼트들이 공통으로 쓰는 데이터를 관리합니다.

	*/
	public function TCPDFElementSet($element_set_title, $element_set_x_pos, $element_set_y_pos, $element_set_width, $columne_width_ratio_arr=null) {
		$caller_name = "TCPDFElementSet Constructor<br/>";
		if(empty($element_set_title)){
			echo "$caller_name\t\$element_set_title is empty!";
			return;
		}
		if(!($element_set_x_pos >= 0)){
			echo "$caller_name\t\$element_set_x_pos is not valid!";
			return;
		}
		if(!($element_set_y_pos >= 0)){
			echo "$caller_name\t\$element_set_y_pos is not valid!";
			return;
		}
		if(!($element_set_width >= 0)){
			echo "$caller_name\t\$element_set_width is not valid!";
			return;
		}		

		$this->set_title($element_set_title);
		$this->set_element_set_x_pos($element_set_x_pos);
		$this->set_element_set_y_pos($element_set_y_pos);
		$this->set_element_set_width($element_set_width);

		if(!empty($columne_width_ratio_arr)) {
			$this->set_columne_width_ratio_arr($columne_width_ratio_arr);
		}
	}

	//     dMMMMMP dMP     dMMMMMP dMMMMMMMMb dMMMMMP dMMMMb dMMMMMMP        .dMMMb  dMMMMMP dMMMMMMP 
	//    dMP     dMP     dMP     dMP"dMP"dMPdMP     dMP dMP   dMP          dMP" VP dMP        dMP    
	//   dMMMP   dMP     dMMMP   dMP dMP dMPdMMMP   dMP dMP   dMP           VMMMb  dMMMP      dMP     
	//  dMP     dMP     dMP     dMP dMP dMPdMP     dMP dMP   dMP          dP .dMP dMP        dMP      
	// dMMMMMP dMMMMMP dMMMMMP dMP dMP dMPdMMMMMP dMP dMP   dMP           VMMMP" dMMMMMP    dMP       

	private $title;
	private function set_title($title) {
		$this->title = $title;
	}
	public function get_title() {
		return $this->title;
	}
                                                                                               
	private $element_set_x_pos;
	public function set_element_set_x_pos($element_set_x_pos) {
		$this->element_set_x_pos=$element_set_x_pos;

		// TODO table element set의 경우, 관련 element의 위치를 모두 변경한다.

	}
	public function get_element_set_x_pos() {
		return $this->element_set_x_pos;
	}

	private $element_set_y_pos;
	public function set_element_set_y_pos($element_set_y_pos) {
		$this->element_set_y_pos=$element_set_y_pos;

		// TODO table element set의 경우, 관련 element의 위치를 모두 변경한다.

	}
	public function get_element_set_y_pos() {
		return $this->element_set_y_pos;
	}

	private $element_set_width;
	private function set_element_set_width($element_set_width) {
		$this->element_set_width=$element_set_width;

		// TODO table element set의 경우, 관련 element의 너비를 모두 변경한다.

	}
	public function get_element_set_width() {
		return $this->element_set_width;
	}

	private $element_set_height;
	public function set_element_set_height($element_set_height) {
		$this->element_set_height=$element_set_height;
	}
	public function get_element_set_height() {
		if(is_null($this->element_set_height)) {
			$this->element_set_height = 0;
		}
		return $this->element_set_height;
	}
	private function add_element_set_height($offset_height) {
		if(is_null($this->element_set_height)) {
			$this->element_set_height = 0;
		}
		$this->element_set_height+=$offset_height;
	}
	public function get_element_set_bottom_y_pos() {
		return $this->get_element_set_y_pos() + $this->get_element_set_height();
	}








	//     dMMMMMP dMP     dMMMMMP dMMMMMMMMb dMMMMMP dMMMMb dMMMMMMP 
	//    dMP     dMP     dMP     dMP"dMP"dMPdMP     dMP dMP   dMP    
	//   dMMMP   dMP     dMMMP   dMP dMP dMPdMMMP   dMP dMP   dMP     
	//  dMP     dMP     dMP     dMP dMP dMPdMP     dMP dMP   dMP      
	// dMMMMMP dMMMMMP dMMMMMP dMP dMP dMPdMMMMMP dMP dMP   dMP       
	private $element_arr;
	public function add_element($element) {
		if(is_null($this->element_arr)) {
			$this->element_arr = array();
		}
		array_push($this->element_arr, $element);

		$caller_name .= __FUNCTION__;
		if(method_exists($element,'get_cell_height')) {
			$element->updateTextProps();
			$this->add_element_set_height($element->get_cell_height());	
		} else {
			echo "$caller_name\t\$element->get_cell_height is not exists!";
			return;
		}

		// 형제 관계도 element set에 입력시 생성합니다.
		if(method_exists($element,'set_prev') && method_exists($element,'set_next')) {
			// do something
			$last_element = $this->get_last_element();
			if(is_null($last_element)) {
				return;
			}

			$last_element->set_next($element);
			$element->set_prev($last_element);

		} else {
			echo "$caller_name\t\$element->set_prev or \$element->set_next is not exists!";
			return;
		}

	}
	// @ Desc : child element set을 추가합니다. add on table을 가지는 경우를 나타냅니다.
	private $child_add_on_element_set_arr;
	public function push_child_add_on_element_set($child_add_on_element_set) {
		
		if(is_null($this->child_add_on_element_set_arr)) {
			$this->child_add_on_element_set_arr = array();
		}
		array_push($this->child_add_on_element_set_arr, $child_add_on_element_set);

		$caller_name .= __FUNCTION__;
		if(method_exists($child_add_on_element_set,'get_element_set_height')) {
			$this->add_element_set_height($child_add_on_element_set->get_element_set_height());	
		} else {
			echo "$caller_name\t\$element->get_element_set_height is not exists!";
			return;
		}

	}
	public function get_element_arr() {
		return $this->element_arr;
	}
	public function get_last_element() {
		if(is_null($this->element_arr) || empty($this->element_arr)) {
			return null;
		}

		return $this->element_arr[(COUNT($this->element_arr) - 1)];
	}


	// COLUMN WIDTH
	private $columne_width_ratio_arr;
	private function set_columne_width_ratio_arr($columne_width_ratio_arr) {
		$this->columne_width_ratio_arr = $columne_width_ratio_arr;
	}
	private function get_columne_width_ratio_arr() {
		return $this->columne_width_ratio_arr;
	}







	//  dMMMMMMP .aMMMb  dMMMMb  dMP     dMMMMMP         dMMMMMP dMP     dMMMMMP dMMMMMMMMb dMMMMMP dMMMMb dMMMMMMP 
	//    dMP   dMP"dMP dMP"dMP dMP     dMP             dMP     dMP     dMP     dMP"dMP"dMPdMP     dMP dMP   dMP    
	//   dMP   dMMMMMP dMMMMK" dMP     dMMMP           dMMMP   dMP     dMMMP   dMP dMP dMPdMMMP   dMP dMP   dMP     
	//  dMP   dMP dMP dMP.aMF dMP     dMP             dMP     dMP     dMP     dMP dMP dMPdMP     dMP dMP   dMP      
	// dMP   dMP dMP dMMMMP" dMMMMMP dMMMMMP         dMMMMMP dMMMMMP dMMMMMP dMP dMP dMPdMMMMMP dMP dMP   dMP       
	private $table_element_arr;
	private function get_element_vertical_arr($element) {

		$caller_name .= "get_element_vertical_arr<br/>";

		$cur_element_vertical_arr = array();
		array_push($cur_element_vertical_arr, $element);
 
		$while_max_counter = 100;

		$element_up = $element;
		$while_counter = 0;
		while (!is_null($element_up->get_up())) {
			$element_up = $element_up->get_up();
			array_unshift($cur_element_vertical_arr, $element_up);

			$while_counter++;
			if($while_max_counter < $while_counter) {
				echo "$caller_name\t000\twhile repeat is overheated!<br/>";
				break;
			}
		}

		$element_down = $element;
		$while_counter = 0;
		while (!is_null($element_down->get_down())) {
			$element_down = $element_down->get_down();
			array_push($cur_element_vertical_arr, $element_down);

			$while_counter++;
			if($while_max_counter < $while_counter) {
				echo "$caller_name\t000\twhile repeat is overheated!<br/>";
				break;
			}
		}

		return $cur_element_vertical_arr;
	}
	private function get_element_horizontal_arr($element) {

		$caller_name .= "get_element_horizontal_arr<br/>";

		$cur_element_horizontal_arr = array();
		array_push($cur_element_horizontal_arr, $element);

		$while_max_counter = 100;

		$element_prev = $element;
		$while_counter = 0;
		while (!is_null($element_prev->get_prev())) {
			$element_prev = $element_prev->get_prev();
			array_unshift($cur_element_horizontal_arr, $element_prev);

			$while_counter++;
			if($while_max_counter < $while_counter) {
				echo "$caller_name\t000\twhile repeat is overheated!<br/>";
				break;
			}
		}

		$element_next = $element;
		$while_counter = 0;
		while (!is_null($element_next->get_next())) {
			$element_next = $element_next->get_next();
			array_push($cur_element_horizontal_arr, $element_next);

			$while_counter++;
			if($while_max_counter < $while_counter) {
				echo "$caller_name\t000\twhile repeat is overheated!<br/>";
				break;
			}
		}


		return $cur_element_horizontal_arr;
	}	

	// Chained property access
	private $table_element_matrix_arr;
	public function add_table_element($row_idx, $column_idx, $element) {

		// validation check
		$caller_name .= "<br/>tcpdf.element.set.inc->add_table_element";
		if(is_null($row_idx) || !is_int($row_idx)) {
			echo "$caller_name\t\$row_idx is not valid!";
			return;
		}
		if(is_null($column_idx) || !is_int($column_idx)) {
			echo "$caller_name\t\$column_idx is not valid!";
			return;
		}
		if(is_null($element)) {
			echo "$caller_name\t\$element is not valid!";
			return;
		}
		if(!method_exists($element,'get_cell_width')) {
			echo "$caller_name\t\$element->get_cell_width is not exists!";
			return;
		}
		if(!method_exists($element,'get_cell_height')) {
			echo "$caller_name\t\$element->get_cell_height is not exists!";
			return;
		}
		if(!method_exists($element,'set_prev')) {
			echo "$caller_name\t\$element->set_prev is not exists!";
			return;
		}
		if(!method_exists($element,'set_next')) {
			echo "$caller_name\t\$element->set_next is not exists!";
			return;
		}
		if(!method_exists($element,'set_up')) {
			echo "$caller_name\t\$element->set_up is not exists!";
			return;
		}
		if(!method_exists($element,'set_down')) {
			echo "$caller_name\t\$element->set_down is not exists!";
			return;
		}


		if(is_null($this->table_element_matrix_arr)) {
			$this->table_element_matrix_arr = array();
		}
		if(is_null($this->table_element_matrix_arr[$row_idx])){
			$this->table_element_matrix_arr[$row_idx] = array(); 
		}
		$this->table_element_matrix_arr[$row_idx][$column_idx] = $element;

		$cur_raw_text = $element->get_raw_text();
		$cur_cell_height = $element->get_cell_height();
		$cur_row_count = count($this->table_element_matrix_arr);
		// $cur_column_count = count($this->table_element_matrix_arr[$row_idx]);
		$cur_column_count = count($this->table_element_matrix_arr[0]);

		// ? 테이블의 너비를 가져올 수 있다면, 최대 너비를 가져오는 작업을 진행하지 않아도 됨.
		// ? 테이블 셀의 너비를 이용하여 사용자가 지정한 너비로 배정한다.
		// ? 입력한 텍스트를 기준으로 테이블의 최대 너비를 결정하는 것은 정리되어 보이지 못함.

		// 1-2. 지정된 테이블 너비가 있다면 비율에 맞추어 컬럼 너비를 다시 계산합니다.
		// 1-3. 사용자가 지정한 비율이 있다면 그것을 사용합니다.
		$received_table_width = $this->get_element_set_width();
		// echo "\$received_table_width : $received_table_width<br/>";
		if($received_table_width > 0) {

			for ($cur_row_idx = 0; $cur_row_idx < $cur_row_count; $cur_row_idx++) {
				$cur_element_row_arr = $this->table_element_matrix_arr[$cur_row_idx];

				$cur_element_row_count = COUNT($cur_element_row_arr);
				$prev_element;
				for ($cur_column_idx = 0; $cur_column_idx < $cur_element_row_count; $cur_column_idx++) {
					$cur_element = $this->table_element_matrix_arr[$cur_row_idx][$cur_column_idx];
					$cur_cell_width = $cur_element->get_cell_width();

					// 1. 사용자가 지정한 너비가 없다면 똑같은 너비로 나눔
					$new_cell_width = ROUND((1/$cur_element_row_count) * $received_table_width,1);
					$cur_element->set_cell_width($new_cell_width);

					// 2. 계산된 너비를 이용, 셀의 x pos을 업데이트한다.
					$cur_element_set_x_pos = $this->get_element_set_x_pos();
					$prev_element_cell_x_pos = 0;
					if(!is_null($prev_element)) {
						$prev_element_cell_x_pos = $prev_element->get_cell_x_pos();
					}

					// 3. 너비가 업데이트되었으므로 텍스트 높이를 다시 계산합니다.
					$cur_element->updateTextProps();

					$new_cell_x_pos = $cur_element_set_x_pos + $prev_element_cell_x_pos;
					$cur_element->set_cell_x_pos($new_cell_x_pos);

					// DEBUG
					// $_cur_raw_text = $cur_element->get_raw_text();
					// $_cur_cell_width = $cur_element->get_cell_width();
					// $_cur_text_width = $cur_element->get_text_width();
					// echo "\$received_table_width : $received_table_width<br/>";
					// echo "\$cur_element_row_count : $cur_element_row_count<br/>";
					// echo "\$cur_element_set_x_pos : $cur_element_set_x_pos<br/>";
					// echo "\$prev_element_cell_x_pos : $prev_element_cell_x_pos<br/>";
					// echo ">>>\$new_cell_x_pos : $new_cell_x_pos<br/>";
					// echo "\$_cur_raw_text : $_cur_raw_text<br/>";
					// echo "\$_cur_cell_width : $_cur_cell_width<br/>";
					// echo "\$_cur_text_width : $_cur_text_width\t\$cur_row_count : $cur_row_count<br/><br/>";
					// echo "<br/><br/>";

					// 이전 객체 참조를 저장합니다.
					$prev_element = $cur_element;

				}
				// echo ">>><br/><br/>";
			}
		}


		// ? 행의 최대 높이를 구하기 위해서는 각 열의 너비를 알아야 합니다.
		// 2. 행의 최대 높이 구하기
		for ($cur_row_idx = 0; $cur_row_idx < $cur_row_count; $cur_row_idx++) {
			$cur_element_row_arr = $this->table_element_matrix_arr[$cur_row_idx];

			// 2-1. 각 열의 최대 높이를 계산합니다.
			$max_row_height = 0;
			for ($cur_column_idx = 0; $cur_column_idx < COUNT($cur_element_row_arr); $cur_column_idx++) {
				$cur_element = $cur_element_row_arr[$cur_column_idx];

				// 너비를 새롭게 지정했으므로 텍스트의 높이를 다시 계산합니다.
				$cur_element->updateTextProps();

				// DEBUG / Tough time during my mar
				// $cur_raw_text = $cur_element->get_raw_text();
				// if($cur_raw_text == "Tough time during my marriage life77"){
					// $cur_cell_width = $cur_element->get_cell_width();
					// $cur_cell_height = $cur_element->get_cell_height();
					// $cur_text_width = $cur_element->get_text_width();
					// $cur_text_arr = $cur_element->get_text_arr();
					
					// echo "-->\$cur_raw_text : $cur_raw_text<br/>";
					// echo "-->\$cur_text_width : $cur_text_width<br/>";
					// print_r($cur_text_arr);
					// echo "<br/>";
					// echo "-->\$cur_cell_width : $cur_cell_width<br/>";
					// echo "-->\$cur_cell_height : $cur_cell_height<br/>";
					// echo "-->\$max_row_height : $max_row_height<br/><br/>";
				// }

				if($max_row_height < $cur_element->get_cell_height()) {
					$max_row_height = $cur_element->get_cell_height();
				}
			}

			// 2-2. 계산 뒤에 테이블의 모든 열에 적용.
			for ($cur_column_idx = 0; $cur_column_idx < COUNT($cur_element_row_arr); $cur_column_idx++) {
				$cur_element = $cur_element_row_arr[$cur_column_idx];
				$cur_element->set_cell_height($max_row_height);
			}
			// inner for end

		}
		// outer for end

		// 3. 테이블의 높이를 설정합니다.
		// 너비는 외부에서 파라미터로 전달받으므로 바꾸지 않습니다.
		$table_height = 0;
		for ($cur_row_idx = 0; $cur_row_idx < $cur_row_count; $cur_row_idx++) {

			$cur_element = $this->table_element_matrix_arr[$cur_row_idx][0];
			$table_height += $cur_element->get_cell_height();

			// DEBUG
			// $cur_raw_text = $cur_element->get_raw_text();
			// $cur_text_height = $cur_element->get_text_height();
			// $cur_cell_height = $cur_element->get_cell_height();
			// echo "\$table_height : $table_height<br/>";
			// echo "\$cur_text_height : $cur_text_height<br/>";
			// echo "\$cur_cell_height : $cur_cell_height<br/>";
			// echo "\$cur_raw_text : $cur_raw_text<br/><br/>";
		}
		// outer for end
		$this->set_element_set_height($table_height);
	}
	public function get_table_element_arr() {
		return $this->table_element_arr;
	}
	public function set_table_element_arr($table_element_arr) {
		return $this->table_element_arr = $table_element_arr;
	}
	public function get_table_width() {
		return $this->get_element_set_width();
	}
	public function get_table_height() {
		return $this->get_element_set_height();
	}
	public function draw_table() {

		$cur_element_set_x_pos = $this->get_element_set_x_pos();
		$cur_element_set_y_pos = $this->get_element_set_y_pos();
		$cur_element_set_width = $this->get_element_set_width();

		// $this->table_element_matrix_arr[$row_idx][$column_idx] = $element;

		$cur_row_count = count($this->table_element_matrix_arr);
		$cur_column_count = count($this->table_element_matrix_arr[0]);

		for ($row_idx = 0; $row_idx < $cur_row_count; $row_idx++) {
			for ($column_idx = 0; $column_idx < $cur_column_count; $column_idx++) {

				$prev_table_row_element;
				if($row_idx > 0) {
					$prev_table_row_element = $this->table_element_matrix_arr[($row_idx - 1)][$column_idx];
				}
				$prev_table_column_element;
				if($column_idx > 0) {
					$prev_table_column_element = $this->table_element_matrix_arr[$row_idx][($column_idx - 1)];
				}

				$cur_table_element = $this->table_element_matrix_arr[$row_idx][$column_idx];
				if(empty($cur_table_element)) {
					continue;
				}

				$cur_cell_height = $cur_table_element->get_cell_height();
				$cur_text_height = $cur_table_element->get_text_height();
				$cur_text_y_offset = ROUND((($cur_cell_height - $cur_text_height) / 2),1);

				// echo "\$cur_cell_height : $cur_cell_height<br/>";
				// echo "\$cur_text_height : $cur_text_height<br/>";
				// echo "\$cur_text_y_offset : $cur_text_y_offset<br/><br/>";

				$cur_padding_left_n_right = $cur_table_element->get_padding_left_n_right();
				$cur_padding_top_n_bottom = $cur_table_element->get_padding_top_n_bottom();
				$cur_text_x_pos = 0;
				$cur_text_y_pos = 0;

				if($row_idx == 0 && $column_idx == 0) {

					$cur_table_element->set_cell_x_pos($cur_element_set_x_pos);
					$cur_table_element->set_cell_y_pos($cur_element_set_y_pos);

					// $cur_text_x_pos = $cur_element_set_x_pos + $cur_padding_left_n_right;
					$cur_text_x_pos = $cur_element_set_x_pos;
					$cur_text_y_pos = $cur_element_set_y_pos + $cur_text_y_offset;

					$cur_table_element->set_text_x_pos($cur_text_x_pos);
					$cur_table_element->set_text_y_pos($cur_text_y_pos);

				} else if ($column_idx == 0) {

					$cur_table_element->set_cell_x_pos($prev_table_row_element->get_cell_x_pos());
					$cur_table_element->set_cell_y_pos($prev_table_row_element->get_cell_y_pos() + $prev_table_row_element->get_cell_height());

					// $cur_text_x_pos = $prev_table_row_element->get_cell_x_pos() + $cur_padding_left_n_right;
					$cur_text_x_pos = $prev_table_row_element->get_cell_x_pos();
					$cur_text_y_pos = $prev_table_row_element->get_cell_y_pos() + $prev_table_row_element->get_cell_height() + $cur_text_y_offset;

					$cur_table_element->set_text_x_pos($cur_text_x_pos);
					$cur_table_element->set_text_y_pos($cur_text_y_pos);

				} else {

					$cur_table_element->set_cell_x_pos($prev_table_column_element->get_cell_x_pos() + $prev_table_column_element->get_cell_width());
					$cur_table_element->set_cell_y_pos($prev_table_column_element->get_cell_y_pos());

					$cur_text_x_pos = 
					$prev_table_column_element->get_cell_x_pos() + $prev_table_column_element->get_cell_width();
					$cur_text_y_pos = $prev_table_column_element->get_cell_y_pos() + $cur_text_y_offset;

					$cur_table_element->set_text_x_pos($cur_text_x_pos);
					$cur_table_element->set_text_y_pos($cur_text_y_pos);

				}

				$cur_table_element->draw();
			} 
			// inner for end
		}
		// outer for end
	}
	
}

?>