<?php

include_once('tcpdf.element.inc');
include_once('tcpdf.element.set.inc');

class TCPDFManager{

	private $pdf;
	private $service_root_path;
	private $default_font="nanumgothic";

	public function TCPDFManager($service_root_path){
		$this->pdf = $this->get_empty_pdf();
		$this->service_root_path = $service_root_path;
	}

	public function show_output(){
		$this->pdf->Output('example_006.pdf', 'I');
	}

	private function get_empty_pdf(){
		$pdf = 
		new TCPDF(
		    // * @param $orientation (string) page orientation. Possible values are (case insensitive):<ul><li>P or Portrait (default)</li><li>L or Landscape</li><li>'' (empty string) for automatic orientation</li></ul>    
		    PDF_PAGE_ORIENTATION
		    // * @param $unit (string) User measure unit. Possible values are:<ul><li>pt: point</li><li>mm: millimeter (default)</li><li>cm: centimeter</li><li>in: inch</li></ul><br />A point equals 1/72 of inch, that is to say about 0.35 mm (an inch being 2.54 cm). This is a very common unit in typography; font sizes are expressed in that unit.    
		    , PDF_UNIT
		    // * @param $format (mixed) The format used for pages. It can be either: one of the string values specified at getPageSizeFromFormat() or an array of parameters specified at setPageFormat().    
		    , PDF_PAGE_FORMAT
		    // * @param $unicode (boolean) TRUE means that the input text is unicode (default = true)
		    , true
		    // * @param $encoding (string) Charset encoding (used only when converting back html entities); default is UTF-8.    
		    , 'UTF-8'
		    // * @param $diskcache (boolean) If TRUE reduce the RAM memory usage by caching temporary data on filesystem (slower).    
		    , false
		    // * @param $pdfa (boolean) If TRUE set the document to PDF/A mode.
		);

		// set document information
		$pdf->SetCreator("BDTM");
		$pdf->SetAuthor('Wonder Jung');
		$pdf->SetTitle('Toastmasters Meeting Agenda');
		$pdf->SetSubject('Subject');

		// remove default header/footer
		$pdf->setPrintHeader(false);
		$pdf->setPrintFooter(false);

		// set margins
		$pdf->SetMargins(0, 0, 0);
		$pdf->SetHeaderMargin(0);
		$pdf->SetFooterMargin(0);

		// set auto page breaks
		$pdf->SetAutoPageBreak(TRUE, 0);

		// set image scale factor
		$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

		// set default font / http://www.tcpdf.org/fonts.php
		$pdf->SetFont($this->default_font, '', 10);

		// add a page
		$pdf->AddPage();

		return $pdf;
	}


	//private $ENCRYPTION_KEY = "!@#$%^&*";
	public $color_wine_red_arr = array(168, 55, 49);
	public $color_dark_wine_red_arr = array(55, 9, 11);
	public $color_white_arr = array(255, 255, 255);
	public $color_milk_gray_arr = array(250, 250, 250);
	public $color_light_tint_warm_gray_arr = array(242, 238, 235);
	public $color_tint_warm_gray_arr = array(235, 234, 230);
	public $color_light_warm_gray_arr = array(219, 215, 212);
	public $color_warm_gray_arr = array(165, 157, 155);
	public $color_dark_gray_arr = array(49, 49, 49);
	public $color_cream_yellow_arr = array(255, 204, 102);
	public $color_magenta_arr = array(255, 51, 51);
	public $color_emerald_green_arr = array(0, 204, 102);

	private $border_style_card_board_top_n_bottom_gray_outline;
	private $border_style_card_board_body_gray_outline;
	private $border_style_card_board_outline_width=0.2;
	private $border_style_card_board_table_outline_width=0.03;
	private function get_border_style_card_board_top_n_bottom_gray_outline(){
		if(is_null($this->border_style_card_board_top_n_bottom_gray_outline)){
			$this->border_style_card_board_top_n_bottom_gray_outline=
			array(	
				'width' => $this->border_style_card_board_outline_width
				, 'cap' => 'round'
				, 'join' => 'miter'
				, 'dash' => 0
				, 'color' => TCPDFElement::$COLOR_DARK_GRAY_ARR
			);
		}
		return $this->border_style_card_board_top_n_bottom_gray_outline;
	}
	private function get_border_style_card_board_body_gray_outline(){
		if(is_null($this->border_style_card_board_body_gray_outline)){
			$border_style=
			array(	
				'width' => $this->border_style_card_board_outline_width
				, 'cap' => 'squre'
				, 'join' => 'miter'
				, 'dash' => 0
				, 'color' => TCPDFElement::$COLOR_DARK_GRAY_ARR
			);

			$this->border_style_card_board_body_gray_outline=
			array(	
				'L' => $border_style,
	            'T' => 0,
	            'R' => $border_style,
	            'B' => 0
			);

		}
		return $this->border_style_card_board_body_gray_outline;
	}
	private $border_style_simple_table_cell_gray_outline;
	private function get_border_style_simple_table_cell_gray_outline(){
		if(is_null($this->border_style_simple_table_cell_gray_outline)){

			$border_style=
			array(	
				'width' => $this->border_style_card_board_table_outline_width
				, 'cap' => 'round'
				, 'join' => 'miter'
				, 'dash' => 0
				// , 'color' => $this->color_warm_gray_arr
				, 'color' => TCPDFElement::$COLOR_DARK_GRAY_ARR
			);

			$this->border_style_simple_table_cell_gray_outline=
			array('all' => $border_style)
			;
		}
		return $this->border_style_simple_table_cell_gray_outline;

	}

	private $card_board_title_font="dejavusans";
	private $card_board_title_font_style="B";
	private $card_board_title_font_size=8;
	// private $card_board_title_font_size=12;
	private function set_font_cart_board_title($caller_name=""){
		$caller_name .= "<br/>set_font_cart_board_title";
		$this->pdf->SetFont(
		    $this->card_board_title_font
		    , $this->card_board_title_font_style
		    , $this->card_board_title_font_size
		);
	}
	private $card_board_content_font="dejavusans";
	private $card_board_content_font_style="";
	private $card_board_content_font_size=8;
	// private $card_board_content_font_size=12;
	private function set_font_cart_board_content($caller_name=""){
		$caller_name .= "<br/>set_font_cart_board_content";
		$this->pdf->SetFont(
		    $this->card_board_content_font
		    , $this->card_board_content_font_style
		    , $this->card_board_content_font_size
		);
	}
	private $simple_table_title_small_font="dejavusans";
	private $simple_table_title_small_font_style="B";
	private $simple_table_title_small_font_size=6;
	private function set_font_simple_table_title_small($caller_name=""){
		$caller_name .= "<br/>set_font_simple_table_content_small";
		$this->pdf->SetFont(
		    $this->simple_table_title_small_font
		    , $this->simple_table_title_small_font_style
		    , $this->simple_table_title_small_font_size
		);
	}
	private $simple_table_content_small_font="dejavusans";
	private $simple_table_content_small_font_style="";
	private $simple_table_content_small_font_size=6;
	private function set_font_simple_table_content_small($caller_name=""){
		$caller_name .= "<br/>set_font_simple_table_content_small";
		$this->pdf->SetFont(
		    $this->simple_table_content_small_font
		    , $this->simple_table_content_small_font_style
		    , $this->simple_table_content_small_font_size
		);
	}

	public function DRAW_BG($color_arr) {
		if(empty($color_arr)){
			echo "TCPDFManager\tDRAW_BG\t\$color_arr is empty!";
			return;
		}

		$this->DRAW_BG_GRADIENT_VERTICAL($color_arr, $color_arr);
	}

	public function DRAW_BG_GRADIENT_VERTICAL($color_top_arr, $color_bottom_arr) {
		if(empty($color_top_arr)){
			echo "TCPDFManager\tDRAW_BG_GRADIENT_VERTICAL\t\$color_top_arr is empty!";
			return;
		}

		if(empty($color_bottom_arr)){
			echo "TCPDFManager\tDRAW_BG_GRADIENT_VERTICAL\t\$color_bottom_arr is empty!";
			return;
		}

		$coords = array(0, 0, 0, 1);
		$this->pdf->LinearGradient(
		// * @param $x (float) abscissa of the top left corner of the rectangle.
		    0
		// * @param $y (float) ordinate of the top left corner of the rectangle.
		    , 0
		// * @param $w (float) width of the rectangle.
		    , 210
		// * @param $h (float) height of the rectangle.
		    , 300
		// * @param $col1 (array) first color (Grayscale, RGB or CMYK components).
		    , $color_bottom_arr
		// * @param $col2 (array) second color (Grayscale, RGB or CMYK components).
		    , $color_top_arr
		// * @param $coords (array) array of the form (x1, y1, x2, y2) which defines the gradient vector (see linear_gradient_coords.jpg). The default value is from left to right (x1=0, y1=0, x2=1, y2=0).
		    , $coords
		);
	}





	// REMOVE ME
	/*
	private $text_align_center = "CENTER";
	private $text_align_left = "LEFT";
	private $text_align_right = "RIGHT";
	private $card_board_padding = 0.7;
	private $card_board_round_radius_top_left_top_right = 1.6;
	private function get_card_board_row_title_prop_obj(	$text
														, $parent_x_pos
														, $parent_y_pos
														, $cell_width
														, $align="CENTER"){

		// TODO 폰트 사이즈를 지정할 수 있어야 합니다.

		$depth=0;
		$caller_name="get_card_board_row_title_prop_obj";
		$this->set_font_cart_board_title($caller_name);

		$title_prop_obj = 
		$this->get_row_text_prop_obj(
			$text
			, $parent_x_pos
			, $parent_y_pos
			, $cell_width
			, $this->card_board_padding
			, $align
			, $depth
			, $caller_name
		);
		$title_prop_obj->round_radius=$this->card_board_round_radius_top_left_top_right;
		$title_prop_obj->border_style=$this->get_border_style_card_board_top_n_bottom_gray_outline();
		$title_prop_obj->round_rect_style=$this->card_board_round_rect_style;
		$title_prop_obj->round_rect_round_corner=$this->card_board_round_rect_round_corner_head;
		$title_prop_obj->font=$this->card_board_title_font;
		$title_prop_obj->font_style=$this->card_board_title_font_style;
		$title_prop_obj->font_size=$this->card_board_title_font_size;
		$title_prop_obj->font_color=$this->color_wine_red_arr;

		return $title_prop_obj;
	}
	*/

	// REMOVE ME
	/*
	private function get_card_board_row_content_key_prop_obj(	$text
																, $parent_x_pos
																, $prev_y_pos=0
																, $cell_width
																, $align="CENTER"
																, $depth
																, $is_title=false){

		$depth=0;
		$is_last=false;

		$content_key_prop_obj = 
		$this->get_card_board_row_content_prop_obj(	$text
													, $parent_x_pos
													, $prev_y_pos
													, $cell_width
													, $align
													, $depth
													, $is_last);

		$content_key_prop_obj->font=$this->card_board_content_font;
		$content_key_prop_obj->font_style=$this->card_board_title_font_style;
		$content_key_prop_obj->font_size=$this->card_board_content_font_size;
		$content_key_prop_obj->font_color=$this->color_warm_gray_arr;

		$content_key_prop_obj->is_title=$is_title;

		return $content_key_prop_obj;
	}
	*/

	// REMOVE ME
	/*
	private function get_card_board_row_content_value_prop_obj(	$text
																, $parent_x_pos
																, $prev_y_pos=0
																, $cell_width
																, $align="CENTER"
																, $depth
																, $is_last=false
																, $is_title=false ){

		$depth=0;

		$content_value_prop_obj = 
		$this->get_card_board_row_content_prop_obj(	$text
													, $parent_x_pos
													, $prev_y_pos
													, $cell_width
													, $align
													, $depth
													, $is_last);

		$content_value_prop_obj->font=$this->card_board_content_font;
		$content_value_prop_obj->font_style=$this->card_board_content_font_style;
		$content_value_prop_obj->font_size=$this->card_board_content_font_size;
		$content_value_prop_obj->font_color=$this->color_warm_gray_arr;
		$content_value_prop_obj->is_title=$is_title;

		return $content_value_prop_obj;
	}
	*/
	private function get_card_board_row_content_prop_obj(	$text
															, $parent_x_pos
															, $prev_y_pos=0
															, $cell_width
															, $align="CENTER"
															, $depth=0
															, $is_last=false ){

		$caller_name="get_card_board_row_content_prop_obj";
		$this->set_font_cart_board_content($caller_name);

		$border_style = $this->get_border_style_card_board_body_gray_outline();
		$round_rect_round_corner=$this->card_board_round_rect_round_corner_body;
		if($is_last){
			$round_rect_round_corner=$this->card_board_round_rect_round_corner_tail;
			$border_style = $this->get_border_style_card_board_top_n_bottom_gray_outline();
		}

		$content_key_prop_obj = 
		$this->get_row_text_prop_obj(
			$text
			, $parent_x_pos
			, $prev_y_pos
			, $cell_width
			, $this->card_board_padding
			, $align
			, $depth
			, $caller_name
		);
		$content_key_prop_obj->round_radius=$this->card_board_round_radius_top_left_top_right;
		$content_key_prop_obj->border_style=$border_style;
		$content_key_prop_obj->round_rect_style=$this->card_board_round_rect_style;
		$content_key_prop_obj->round_rect_round_corner=$round_rect_round_corner;

		return $content_key_prop_obj;
	}
	// private $timeline_card_board_content_title_padding = 0.7;
	private $timeline_card_board_content_title_padding = 1;
	private $timeline_card_board_padding = 0.6;
	private function get_time_marker_prop_obj($time_text, $parent_x_pos, $parent_y_pos, $cell_width, $is_dummy, $caller_name){

		$caller_name.="<br/>get_time_marker_prop_obj";

		// get font info
		$font_prop_obj = new stdClass();
		$font_prop_obj->font=$this->card_board_content_font;
		if($depth == 0){
			$font_prop_obj->style=$this->card_board_title_font_style;
		} else {
			$font_prop_obj->style=$this->card_board_content_font_style;
		}
		$font_prop_obj->size=$this->card_board_content_font_size;
		$font_prop_obj->color_arr=$this->color_warm_gray_arr;

		// get cell info
		$text_height = $this->get_text_height($cell_width, $time_text, $caller_name);
		$cell_height = $this->get_cell_height($text_height, $this->timeline_card_board_content_title_padding, $caller_name);

		// time marker의 기본 정보(너비, 높이 등)을 가져옵니다.
		// 이 정보는 고정입니다.
		$time_marker_prop_obj = new stdClass();
		$cur_time_text_width = 
		$this->get_text_width_V2(
			$time_text
			, $font_prop_obj->font
			, $font_prop_obj->style
			, $font_prop_obj->size
			, $caller_name
		);
		$padding_left = $cur_text_width + $this->get_padding_left();
		
		$time_marker_height = round($this->pdf->getStringHeight($cell_width, $time_text),1);
		$time_marker_padding_top = round(($cell_height - $time_marker_height)/2,1);	

		// TODO x 좌표를 사이즈 변경에 관계 없이 일정하도록 수정.
		// 주의! $text_prop->x_pos은 타이틀의 x pos. 
		$time_marker_rect_width = $cur_time_text_width;
		$time_marker_x_pos = $parent_x_pos + round(($time_marker_height/2),1) + $time_marker_padding_top;
		$time_marker_y_pos = $parent_y_pos + $time_marker_padding_top;

		// time marker의 양쪽 끝을 둥글게 굴려줘야 해서 높이를 조정.
		$time_marker_round_radius = round(($time_marker_height/2),1);
		$time_marker_height=$time_marker_round_radius*2;

		$time_marker_color = $this->color_warm_gray_arr;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);

		// set text marker props
		$time_marker_prop_obj->time = $time_text;
		$time_marker_prop_obj->font_prop = $font_prop_obj;
		$time_marker_prop_obj->x_pos = $time_marker_x_pos;
		$time_marker_prop_obj->y_pos = $time_marker_y_pos;
		$time_marker_prop_obj->width = $time_marker_rect_width;
		$time_marker_prop_obj->height = $time_marker_height;
		$time_marker_prop_obj->color = $time_marker_color;
		$time_marker_prop_obj->style = $time_marker_style;
		$time_marker_prop_obj->radius = $time_marker_round_radius;
		$time_marker_prop_obj->is_dummy = $is_dummy;

		return $time_marker_prop_obj;
	}
	private function get_timeline_card_board_row_content_prop_obj(	$text
																	, $time
																	, $parent_x_pos
																	, $prev_y_pos=0
																	, $cell_width
																	, $align="CENTER"
																	, $depth=0
																	, $is_last=false ){

		$caller_name="<br/>get_timeline_card_board_row_content_prop_obj";
		// set font
		$this->set_font_cart_board_content($caller_name);

		// get time marker prop
		if(empty($time)) {
			// 시간 정보가 없는 sub action은 임의의 시간 정보로 time marker를 만든다.(들여쓰기 너비를 알기 위함.)
			$time_marker_prop_obj = $this->get_time_marker_prop_obj("00:00", $parent_x_pos, $prev_y_pos, $cell_width, true, $caller_name);
		} else {
			$time_marker_prop_obj = $this->get_time_marker_prop_obj($time, $parent_x_pos, $prev_y_pos, $cell_width, false, $caller_name);	
		}
		
		if($depth == 0){
			$timeline_card_board_padding = $this->timeline_card_board_content_title_padding;
		} else {
			$timeline_card_board_padding = $this->timeline_card_board_padding;
		}

		$content_key_prop_obj = 
		$this->get_row_text_prop_obj(
			$text
			, $parent_x_pos
			, $prev_y_pos
			, $cell_width
			, $timeline_card_board_padding
			, $align
			, $depth
			, $caller_name
		);

		$content_key_prop_obj->round_radius=$this->card_board_round_radius_top_left_top_right;

		// set border style & corner-round
		$border_style = $this->get_border_style_card_board_body_gray_outline();
		$round_rect_round_corner=$this->card_board_round_rect_round_corner_body;
		if($is_last){
			$round_rect_round_corner=$this->card_board_round_rect_round_corner_tail;
			$border_style = $this->get_border_style_card_board_top_n_bottom_gray_outline();
		}

		$content_key_prop_obj->border_style=$border_style;
		$content_key_prop_obj->round_rect_style=$this->card_board_round_rect_style;
		$content_key_prop_obj->round_rect_round_corner=$round_rect_round_corner;

		$content_key_prop_obj->font=$this->card_board_content_font;
		if($depth == 0){
			$content_key_prop_obj->font_style=$this->card_board_title_font_style;
		} else {
			$content_key_prop_obj->font_style=$this->card_board_content_font_style;
		}
		
		$content_key_prop_obj->font_size=$this->card_board_content_font_size;
		$content_key_prop_obj->font_color=$this->color_warm_gray_arr;
		$content_key_prop_obj->time_marker = $time_marker_prop_obj;

		return $content_key_prop_obj;

	}


		
	private $simple_table_padding = 0.2;
	private function get_simple_table_cell_prop_obj($simple_table_row_column_obj
													, $table_prop
													, $parent_x_pos
													, $prev_y_pos=0
													, $align="CENTER"
													, $is_title
													, $caller_name=""){

		$caller_name.="get_simple_table_cell_prop_obj";
		if(is_null($simple_table_row_column_obj)){
			echo "TCPDFManager\t$caller_name\t\$simple_table_row_column_obj is empty!<br/>";
			return;
		}
		if(is_null($table_prop)){
			echo "TCPDFManager\t$caller_name\t\$table_prop is not valid!<br/>";
			return;
		}

		if($is_title){
			$this->set_font_simple_table_title_small($caller_name);	
		} else {
			$this->set_font_simple_table_content_small($caller_name);	
		}

		$text = $simple_table_row_column_obj->name;
		$border_style = $this->get_border_style_simple_table_cell_gray_outline();
		$round_rect_round_corner=$this->card_board_round_rect_round_corner_body;

		$content_key_prop_obj = 
		$this->get_row_text_prop_obj_dynamic_cell_width(
			$text
			, $table_prop
			, $parent_x_pos
			, $prev_y_pos
			, $this->simple_table_padding
			, $align
			, $caller_name
		);
		$content_key_prop_obj->round_radius=$this->card_board_round_radius_top_left_top_right;
		$content_key_prop_obj->border_style=$border_style;
		$content_key_prop_obj->round_rect_style=$this->card_board_round_rect_style;
		$content_key_prop_obj->round_rect_round_corner=$round_rect_round_corner;

		if($is_title){
			$content_key_prop_obj->font=$this->simple_table_title_small_font;
			$content_key_prop_obj->font_style=$this->simple_table_title_small_font_style;
			$content_key_prop_obj->font_size=$this->simple_table_title_small_font_size;
		} else {
			$content_key_prop_obj->font=$this->simple_table_content_small_font;
			$content_key_prop_obj->font_style=$this->simple_table_content_small_font_style;
			$content_key_prop_obj->font_size=$this->simple_table_content_small_font_size;
		}
		$content_key_prop_obj->font_color=$simple_table_row_column_obj->color;
		$content_key_prop_obj->bg_color=$simple_table_row_column_obj->bg_color;

		return $content_key_prop_obj;
	}




	private function get_row_text_prop_obj(	$text
											, $parent_x_pos
											, $prev_y_pos=0
											, $cell_width
											, $padding_top_bottom=2
											, $align="CENTER"
											, $depth=0
											, $caller_name=""	){

		$caller_name .= "<br/>get_row_prop_obj";
		if(empty($text)){
			echo "TCPDFManager\t$caller_name\t\$text is empty!<br/>";
			return;
		}
		if(!($parent_x_pos > 0)){
			echo "TCPDFManager\t$caller_name\t\$parent_x_pos is not valid!<br/>";
			return;
		}
		if(!($prev_y_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$prev_y_pos is not valid!<br/>";
			return;
		}
		if(!($cell_width > 0)){
			echo "TCPDFManager\t$caller_name\t\$cell_width is not valid!<br/>";
			return;
		}
		if(!($padding_top_bottom > 0)){
			echo "TCPDFManager\t$caller_name\t\$padding_top_bottom is not valid!<br/>";
			return;
		}
		if(empty($align)){
			echo "TCPDFManager\t$caller_name\t\$align is empty!<br/>";
			return;
		}

		$text_width = $this->get_text_width($text, $caller_name);
		$text_height = $this->get_text_height($cell_width, $text, $caller_name);
		$x_pos = $this->get_x_pos_h_align($parent_x_pos, $cell_width, $text_width, $align, $depth, $caller_name);
		$cell_height = $this->get_cell_height($text_height, $padding_top_bottom, $caller_name);
		$y_pos = $this->get_y_pos_center_v_align($prev_y_pos, $cell_height, $text_height, $caller_name);

		// TODO 텍스트 내용이 길 경우, 2줄 혹은 그 이상으로 나누어 표시해야 합니다.
		// echo "\$text : $text<br/>";
		// echo "\$text_width : $text_width<br/>";
		// echo "\$cell_width : $cell_width<br/><br/>";

		$text_prop_obj = new stdClass();
		$text_prop_obj->text=$text;
		$text_prop_obj->cell_width=$cell_width;
		$text_prop_obj->cell_height=$cell_height;
		$text_prop_obj->cell_x_pos=$parent_x_pos;
		$text_prop_obj->cell_y_pos=$prev_y_pos;
		$text_prop_obj->width=$text_width;
		$text_prop_obj->height=$text_height;
		$text_prop_obj->x_pos=$x_pos;
		$text_prop_obj->y_pos=$y_pos;

		// multiple line text 
		$padding_left = $this->get_padding_left();
		$cell_width_no_padding = $cell_width - ($padding_left * 2);

		if($cell_width_no_padding < $text_width){
			$text_prop_obj->multiple_text_arr = $this->get_multiple_text_arr($text, $cell_width_no_padding);
			$text_prop_obj->single_line_height = $this->get_text_height($cell_width, $text_prop_obj->multiple_text_arr[0], $caller_name);
		}

		return $text_prop_obj;
	}
	/*
		테이블 컬럼처럼 입력 데이터에 대해 변경될 수 있는 너비를 구할 경우 사용합니다.
	*/
	private function get_row_text_prop_obj_dynamic_cell_width(	
		$text
		, $table_prop
		, $parent_x_pos
		, $prev_y_pos=0
		, $padding_top_bottom=2
		, $align="CENTER"
		, $caller_name=""	){

		$caller_name .= "<br/>get_row_text_prop_obj_dynamic_cell_width";
		if(empty($text)){
			echo "TCPDFManager\t$caller_name\t\$text is empty!<br/>";
			return;
		}
		if(is_null($table_prop)){
			echo "TCPDFManager\t$caller_name\t\$table_prop is not valid!<br/>";
			return;
		}
		if(!($parent_x_pos > 0)){
			echo "TCPDFManager\t$caller_name\t\$parent_x_pos is not valid!<br/>";
			return;
		}
		if(!($prev_y_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$prev_y_pos is not valid!<br/>";
			return;
		}
		if(!($padding_top_bottom > 0)){
			echo "TCPDFManager\t$caller_name\t\$padding_top_bottom is not valid!<br/>";
			return;
		}
		if(empty($align)){
			echo "TCPDFManager\t$caller_name\t\$align is empty!<br/>";
			return;
		}

		$depth = 0;


		$text_width = $this->get_text_width($text, $caller_name);
		// private function get_text_width_V2($text, $fontname='', $fontstyle='', $fontsize=0, $caller_name=""){

		$cell_width = $table_prop->cell_width;

		$text_height = $this->get_text_height($cell_width, $text, $caller_name);
		$x_pos = $this->get_x_pos_h_align($parent_x_pos, $cell_width, $text_width, $align, $depth, $caller_name);

		$cell_height = $table_prop->cell_height;
		$y_pos = $this->get_y_pos_center_v_align($prev_y_pos, $cell_height, $text_height, $caller_name);

		$text_prop_obj = new stdClass();
		$text_prop_obj->text=$text;
		$text_prop_obj->table_width=$table_prop->width;
		$text_prop_obj->table_height=$table_prop->height;
		$text_prop_obj->cell_width=$cell_width;
		$text_prop_obj->cell_height=$cell_height;
		$text_prop_obj->cell_x_pos=$parent_x_pos;
		$text_prop_obj->cell_y_pos=$prev_y_pos;
		$text_prop_obj->width=$text_width;
		$text_prop_obj->height=$text_height;
		$text_prop_obj->x_pos=$x_pos;
		$text_prop_obj->y_pos=$y_pos;

		// TODO 여기서 폰트 변경 설정이 필요. 
		// print_r($table_prop);
		// echo "<br/>";
		// print_r($text_prop_obj);
		// echo "<br/>\$text : $text<br/>";
		// echo "<br/>000<br/>";

		return $text_prop_obj;
	}

	private function get_table_width_n_height($simple_table_row_arr, $padding_top_bottom=2, $caller_name){

		// 테이블의 높이와 너비를 구합니다.
		// 왼쪽 정렬만 지원합니다.
		$caller_name .= "<br/>get_table_width_n_height";
		if(empty($simple_table_row_arr)){
			echo "TCPDFManager\t$caller_name\t\$simple_table_row_arr is empty!";
			return;
		}
		if(!($padding_top_bottom > 0)){
			echo "TCPDFManager\t$caller_name\t\$padding_top_bottom is not valid!<br/>";
			return;
		}


		$table_height=0;
		$table_width=0;
		$max_cell_height=0;
		$max_cell_width=0;
		$row_cnt=count($simple_table_row_arr);
		$column_cnt=count($simple_table_row_arr[0]);
		for ($idx = 0; $idx < count($simple_table_row_arr); $idx++) {
			$simple_table_cell_prop_row_arr = $simple_table_row_arr[$idx];

			if(empty($simple_table_cell_prop_row_arr)) continue;

			for ($inner_idx = 0; $inner_idx < count($simple_table_cell_prop_row_arr); $inner_idx++) {

				$simple_table_cell_prop_obj = $simple_table_cell_prop_row_arr[$inner_idx];
				$text = $simple_table_cell_prop_obj->name;

				// 텍스트의 셀 너비 및 높이를 구하기 전에 폰트 세팅을 해주어야 합니다.
				if($simple_table_cell_prop_obj->is_title == true) {
					$this->set_font_simple_table_title_small($caller_name);
				} else {
					$this->set_font_simple_table_content_small($caller_name);
				}

				// TODO
				$text_width = $this->get_text_width($text, $caller_name);

				$cell_width = 100; // TODO
				$text_height = $this->get_text_height($cell_width, $text, $caller_name); // TODO

				$cell_height = $this->get_cell_height($text_height, $padding_top_bottom, $caller_name);
				$cell_width = $this->get_dynamic_cell_width($text_width, $padding_top_bottom, $caller_name);

				if($max_cell_height < $cell_height){
					$max_cell_height = $cell_height;
				}
				if($max_cell_width < $cell_width){
					$max_cell_width = $cell_width;
				}
			}
		}

		$table_prop = new stdClass();
		$table_prop->height=$max_cell_height * $row_cnt;
		$table_prop->width=$max_cell_width * $column_cnt;
		$table_prop->cell_width=$max_cell_width;
		$table_prop->cell_height=$max_cell_height;

		return $table_prop;
	}
	private function get_dynamic_cell_width($text_width, $padding_top_bottom=2, $caller_name){

		// 텍스트 너비로 셀 너비를 임의로 지정할 때 사용합니다.
		$caller_name .= "<br/>get_dynamic_cell_width";
		if(!($text_width > 0)){
			echo "TCPDFManager\t$caller_name\t\$text_width is not valid!<br/>";
			return;
		}
		if(!($padding_top_bottom > 0)){
			echo "TCPDFManager\t$caller_name\t\$padding_top_bottom is not valid!<br/>";
			return;
		}

		return ($text_width * 1.5) + ($padding_top_bottom * 6);
	}
	private function get_multiple_text_arr($long_text, $cell_width_no_padding, $multiple_text_arr=array()){ // wdjung

		$long_text_length = STRLEN($long_text);
		$immediate_prev_empty_space_idx=0;

		for ($idx = 1; $idx < $long_text_length; $idx++) {

			$long_text_sub = SUBSTR($long_text, 0, $idx);

			$long_text_sub_width = $this->get_text_width($long_text_sub, "get_multiple_text_arr");
			// private function get_text_width_V2($text, $fontname='', $fontstyle='', $fontsize=0, $caller_name=""){

			if($long_text_sub_width < $cell_width_no_padding) continue;

			// 검출된 텍스트 길이보다 1 작은 텍스트를 실제로 사용하므로 다시 텍스트를 추출한다.
			$long_text_sub = SUBSTR($long_text, 0, ($idx - 1));
			$long_text_sub_rest = SUBSTR($long_text, ($idx - 1), $long_text_length);

			array_push($multiple_text_arr, $long_text_sub);


			
			$long_text_sub_rest_width = $this->get_text_width($long_text_sub_rest, "get_multiple_text_arr");
			// private function get_text_width_V2($text, $fontname='', $fontstyle='', $fontsize=0, $caller_name=""){


			if($cell_width_no_padding < $long_text_sub_rest_width){
				// 나머지 텍스트 길이가 셀 너비보다 길다면, 다시 다음줄의 내용을 구한다.
				$multiple_text_arr = $this->get_multiple_text_arr($long_text_sub_rest, $cell_width_no_padding, $multiple_text_arr);
			} else {
				array_push($multiple_text_arr, $long_text_sub_rest);				
			}
			break;
		}

		return $multiple_text_arr;
	}
	private function get_text_width($text, $caller_name){
		$caller_name .= "<br/>get_text_width";
		if(empty($text)){
			echo "TCPDFManager\t$caller_name\t\$text is empty!";
			return;
		}

		return round($this->pdf->GetStringWidth($text), 1);
	}
	private function get_text_width_V2($text, $fontname='', $fontstyle='', $fontsize=0, $caller_name=""){
		$caller_name .= "<br/>get_text_width_V2";
		if(empty($text)){
			echo "TCPDFManager\t$caller_name\t\$text is empty!<br/><br/>";
			return;
		}

		if(empty($fontname)){
			echo "TCPDFManager\t$caller_name\t\$fontname is empty!<br/><br/>";
			return;
		}

		if(is_null($fontstyle)){
			echo "TCPDFManager\t$caller_name\t\$fontstyle is null!<br/><br/>";
			return;
		}

		if(!($fontsize > 0)){
			echo "TCPDFManager\t$caller_name\t\$fontsize is empty!<br/><br/>";
			return;
		}

		return round($this->pdf->GetStringWidth($text, $fontname, $fontstyle, $fontsize), 1);
	}
	private function get_text_height($cell_width, $text, $caller_name){

		$caller_name .= "<br/>get_text_height";
		if(!($cell_width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$cell_width is not valid!";
			return;
		}
		if(empty($text)){
			echo "TCPDFManager\t$caller_name\t\$text is empty!";
			return;
		}

		return round($this->pdf->getStringHeight($cell_width, $text), 1);
	}
	private function get_x_pos_h_align($parent_x_pos, $cell_width, $text_width, $align, $depth, $caller_name){
		$caller_name .= "<br/>get_x_pos_h_align";
		if(!($parent_x_pos > 0)){
			echo "TCPDFManager\t$caller_name\t\$parent_x_pos is not valid!";
			return;
		}
		if(!($cell_width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$cell_width is not valid!";
			return;
		}
		if(!($text_width > 0)){
			echo "TCPDFManager\t$caller_name\t\$text_width is not valid!";
			return;
		}
		if(empty($align)){
			echo "TCPDFManager\t$caller_name\t\$align is not valid!";
			return;
		}

		$text_x_pos = 0;
		if(strcmp($this->text_align_center,$align)==0){
			$text_x_pos = $parent_x_pos + round((($cell_width - $text_width) / 2), 1);
		} else if(strcmp($this->text_align_left,$align)==0){
			$padding_left = $this->get_padding_left($cell_width);
			$text_x_pos = $parent_x_pos + $padding_left + ($padding_left * $depth);
		} else if(strcmp($this->text_align_right,$align)==0){
			// Not supported yet.
		}

		return $text_x_pos;
	}
	private function get_padding_left($cell_width=1){
		return round( ($cell_width * 0.035), 1 );
		//return 2;
	}
	private function get_cell_height($text_height, $padding_top_bottom=2, $caller_name){
		$caller_name .= "<br/>get_cell_height";
		if(!($text_height > 0)){
			echo "TCPDFManager\t$caller_name\t\$text_height is not valid!";
			return;
		}
		if(!($padding_top_bottom > 0)){
			echo "TCPDFManager\t$caller_name\t\$padding_top_bottom is not valid!";
			return;
		}

		$cell_height = ($text_height + ($padding_top_bottom * 2));

		return $cell_height;
	}
	private function get_y_pos_center_v_align($prev_y_pos, $cell_height, $text_height, $caller_name){
		$caller_name .= "<br/>get_y_pos_center_v_align";
		if(!($prev_y_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$prev_y_pos is not valid!";
			return;
		}
		if(!($cell_height >= 0)){
			echo "TCPDFManager\t$caller_name\t\$cell_height is not valid!";
			return;
		}
		if(!($text_height > 0)){
			echo "TCPDFManager\t$caller_name\t\$text_height is not valid!";
			return;
		}

		return $prev_y_pos + round((($cell_height - $text_height) / 2), 1);
	}
	private $card_board_round_rect_style="DF";
	private $card_board_round_rect_round_corner_head="1001";
	private $card_board_round_rect_round_corner_body="0000";
	private $card_board_round_rect_round_corner_tail="0110";
	private function draw_card_board_row_head(	$row_prop_obj
												, $color
												, $caller_name="") {

		$caller_name .= "<br/>draw_card_board_row_head";

		$this->draw_table_cell(	$row_prop_obj->cell_x_pos
									, $row_prop_obj->cell_y_pos
									, $row_prop_obj->cell_width
									, $row_prop_obj->cell_height
									, $row_prop_obj->round_radius
									, $this->card_board_round_rect_round_corner_head
									, $this->card_board_round_rect_style
									, $row_prop_obj->border_style
									, $color
									, $caller_name);
	}
	private function draw_card_board_row_body(	$row_prop_obj
												, $color
												, $caller_name="") {
		$caller_name .= "<br/>draw_card_board_row_body";

		$this->draw_table_cell(	$row_prop_obj->cell_x_pos
								, $row_prop_obj->cell_y_pos
								, $row_prop_obj->cell_width
								, $row_prop_obj->cell_height + 0.5
								, $row_prop_obj->round_radius
								, $this->card_board_round_rect_round_corner_body
								, $this->card_board_round_rect_style
								, $row_prop_obj->border_style
								, $color
								, $caller_name);
	}
	private function draw_card_board_row_tail(	$row_prop_obj
												, $color
												, $caller_name="") {

		$caller_name .= "<br/>draw_card_board_row_tail";

		$this->draw_table_cell(	$row_prop_obj->cell_x_pos
									, $row_prop_obj->cell_y_pos - $this->border_style_card_board_outline_width
									, $row_prop_obj->cell_width
									, $row_prop_obj->cell_height + 2.5
									, $row_prop_obj->round_radius
									, $this->card_board_round_rect_round_corner_tail
									, $this->card_board_round_rect_style
									, $row_prop_obj->border_style
									, $color
									, $caller_name);

	}
	private function draw_simple_table_cell(	$row_prop_obj
												, $caller_name="") {

		$caller_name .= "<br/>draw_simple_table_cell";

		$this->draw_table_cell(	$row_prop_obj->cell_x_pos
									, $row_prop_obj->cell_y_pos
									, $row_prop_obj->cell_width
									, $row_prop_obj->cell_height
									, $row_prop_obj->round_radius
									, $this->card_board_round_rect_round_corner_body
									, $this->card_board_round_rect_style
									, $row_prop_obj->border_style
									, $row_prop_obj->bg_color
									, $caller_name);
	}
	private function draw_table_cell(	$x
										, $y
										, $width
										, $height
										, $radius_top_left_top_right=2
										, $round_corner="0000"
										, $style="DF"
										, $border_style
										, $color
										, $caller_name="") {

		$caller_name .= "<br/>draw_table_cell";
		if(!($x >= 0)){
			echo "TCPDFManager\t$caller_name\t\$x is not valid!";
			return;
		}
		if(!($y >= 0)){
			echo "TCPDFManager\t$caller_name\t\$y is not valid!";
			return;
		}
		if(!($width > 0)){
			echo "TCPDFManager\t$caller_name\t\$width is not valid!";
			return;
		}
		if(!($height > 0)){
			echo "TCPDFManager\t$caller_name\t\$height is not valid!";
			return;
		}
		if(!($radius_top_left_top_right >= 0)){
			echo "TCPDFManager\t$caller_name\t\$radius_top_left_top_right is not valid!";
			return;
		}
		if(is_null($border_style)){
			echo "TCPDFManager\t$caller_name\t\$border_style is not valid!";
			return;
		}
		if(empty($color)){
			echo "TCPDFManager\t$caller_name\t\$color is not valid!";
			return;
		}

		if(strcmp($round_corner,"0000")==0){
			$this->pdf->Rect($x, $y, $width, $height, $style, $border_style, $color);
		} else {
			$this->pdf->RoundedRect(
			    $x
			    , $y
			    , $width
			    , $height
			    , $radius_top_left_top_right
			    , $round_corner // '1001'
			    , $style 		// 'DF'
			    , $border_style
			    , $color
			);
		}

	}

	private function draw_timeline_text($timeline_row_text_prop_obj, $caller_name=""){

		$caller_name .= "draw_timeline_text<br/>";
		if(is_null($timeline_row_text_prop_obj)){
			echo "TCPDFManager\t$caller_name\t\$timeline_row_text_prop_obj is null!";
			return;
		}

		$time_marker = $timeline_row_text_prop_obj->time_marker;

		// 타임라인의 시간 정보가 있다면 화면에 그린다.
		if($time_marker->is_dummy === false){

			$x_pos = $timeline_row_text_prop_obj->cell_x_pos + $time_marker->radius + $this->get_padding_left();
			$y_pos = $timeline_row_text_prop_obj->y_pos;

			// set font
			$this->pdf->SetFont(
			    $time_marker->font_prop->font
			    , $time_marker->font_prop->style
			    , $time_marker->font_prop->size
			);
			$this->pdf->SetTextColor(
				$time_marker->font_prop->color_arr[0]
				, $time_marker->font_prop->color_arr[1]
				, $time_marker->font_prop->color_arr[2]
			);


			$this->pdf->SetTextColor($this->color_white_arr[0], $this->color_white_arr[1], $this->color_white_arr[2]);
			$this->pdf->Text(
			// * @param $x (float) Abscissa of the cell origin
				$x_pos
			// * @param $y (float) Ordinate of the cell origin
			    , $y_pos
			// * @param $txt (string) String to print
			    , $time_marker->time
			);

			$timeline_row_text_prop_obj->x_pos += $time_marker->width;

			// 타임라인의 내용을 화면에 그린다. 타임마커의 위치만큼 우측으로 옮깁니다.
			$this->draw_text($timeline_row_text_prop_obj, $caller_name);
		} else if(is_null($time_marker->is_dummy)) {

			// 타임라인의 타이틀을 화면에 그린다.
			$this->draw_text($timeline_row_text_prop_obj, $caller_name);

		} else {

			// 타임라인의 내용을 화면에 그린다.
			$this->draw_text($timeline_row_text_prop_obj, $caller_name);

		}

	}
	private function draw_text($row_text_prop_obj, $caller_name="") {

		$caller_name .= "draw_text<br/>";
		if(is_null($row_text_prop_obj)){
			echo "TCPDFManager\t$caller_name\t\$row_text_prop_obj is null!";
			return;
		}

		// draw title text
		$this->pdf->SetFont(
		    $row_text_prop_obj->font
		    , $row_text_prop_obj->font_style
		    , $row_text_prop_obj->font_size
		);
		$this->pdf->SetTextColor($row_text_prop_obj->font_color[0], $row_text_prop_obj->font_color[1], $row_text_prop_obj->font_color[2]);

		// is multiple line text? // wdjung / multiple_text_arr
		if(!empty($row_text_prop_obj->multiple_text_arr)){

			$cur_y_pos=0;
			for ($idx = 0; $idx < COUNT($row_text_prop_obj->multiple_text_arr); $idx++) {

				if($idx == 0){
					$cur_y_pos=$row_text_prop_obj->y_pos;
				} else {
					$cur_y_pos+=$row_text_prop_obj->single_line_height;
				}
				$text_obj = $row_text_prop_obj->multiple_text_arr[$idx];

				$this->pdf->Text(
				// * @param $x (float) Abscissa of the cell origin
					$row_text_prop_obj->x_pos
				// * @param $y (float) Ordinate of the cell origin
				    , $cur_y_pos
				// * @param $txt (string) String to print
				    , $text_obj
				);
				
			}

		} else {
			$this->pdf->Text(
			// * @param $x (float) Abscissa of the cell origin
				$row_text_prop_obj->x_pos
			// * @param $y (float) Ordinate of the cell origin
			    , $row_text_prop_obj->y_pos
			// * @param $txt (string) String to print
			    , $row_text_prop_obj->text
			);
		}

	}











	// * CARD BOARD TIME LINE
	public function draw_card_board_timeline_V2(	$element_set_title
													, $element_set_x_pos=0
													, $element_set_y_pos=0
													, $element_set_width=50
													, $data
													, $meeting_agenda_obj
													, $today_news_list=null
													, $today_role_list=null
													, $today_speech_list=null
													, $font_type=null ) {

		$caller_name = "<br/>draw_card_board_timeline_V2<br/>";
		if(empty($element_set_title)){
			echo "TCPDFManager\t$caller_name\t\$element_set_title is empty!";
			return;
		}
		if(!($element_set_x_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_x_pos is not valid!";
			return;
		}
		if(!($element_set_y_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_y_pos is not valid!";
			return;
		}
		if(!($element_set_width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_width is not valid!";
			return;
		}
		if(empty($data)){
			echo "TCPDFManager\t$caller_name\t\$data is empty!";
			return;
		}

		$schedule_obj_arr = $this->get_timeline_card_board_data_from_toastmaster_schedule_V2($data);

		function update_simple_table(	$simple_table_key
										, $simple_table_value
										, $meeting_agenda_obj
										, $today_news_list
										, $today_role_list
										, $today_speech_list 	) {

			if(is_null($simple_table_key) && is_null($simple_table_key->name)) return null;


			// role takers
			$today_role_obj = null;
			if(strcmp($simple_table_key->name, "Toastmaster") == 0) {

				$today_role_obj = $today_role_list[1];

			} else if(strcmp($simple_table_key->name, "General Evaluator") == 0) {

				$today_role_obj = $today_role_list[0];

			} else if(strcmp($simple_table_key->name, "Grammarian") == 0) {

				$today_role_obj = $today_role_list[6];

			} else if(strpos($simple_table_key->name, "Vote Counter") > 0) {

				$today_role_obj = $today_role_list[4];

			} else if(strcmp($simple_table_key->name, "Timer") == 0) {

				$today_role_obj = $today_role_list[2];

			} else if(strpos($simple_table_key->name, "Quote master") > 0) {

				$today_role_obj = $today_role_list[7];

			} else if(strcmp($simple_table_key->name, "Table Topic Master") == 0) {

				$today_role_obj = $today_role_list[3];

			} else if(strcmp($simple_table_key->name, "Mini Debate Master") == 0) {	

				$today_role_obj = $today_role_list[5];

			}

			if(	!is_null($today_role_obj) && 
				!empty($today_role_obj->__member_name) && 
				!strpos($simple_table_value->name,$today_role_obj->__member_name)) {

				if(!is_null($today_role_obj->__role_cnt) && 0 < intval($today_role_obj->__role_cnt)) {
					$simple_table_value->name = $today_role_obj->__role_cnt . " " . $today_role_obj->__member_name;
				} else {
					$simple_table_value->name = $today_role_obj->__member_name;
				}

			} else if( !is_null($today_role_obj) && intval($today_role_obj->__member_id) == -1) {
				$simple_table_value->name = "NOT ASSIGNED";
			}


			if(strcmp($simple_table_key->name, "Word") == 0) {

				if( !is_null($meeting_agenda_obj) && 
					!empty($meeting_agenda_obj->__word) && 
					strcmp($simple_table_value->name,$meeting_agenda_obj->__word) != 0 ) {

					$simple_table_value->name = $meeting_agenda_obj->__word;
				}

			}
			if(strcmp($simple_table_key->name, "Word Desc") == 0) {

				if( !is_null($meeting_agenda_obj) && 
					!empty($meeting_agenda_obj->__word_desc) && 
					strcmp($simple_table_value->name,$meeting_agenda_obj->__word_desc) != 0 ) {

					$simple_table_value->name = $meeting_agenda_obj->__word_desc;
				}
			}
			if(strcmp($simple_table_key->name, "Quote Title") == 0) {

				if( !is_null($meeting_agenda_obj) && 
					!empty($meeting_agenda_obj->__quote) && 
					strcmp($simple_table_value->name,$meeting_agenda_obj->__quote) != 0 ) {

					$simple_table_value->name = $meeting_agenda_obj->__quote;
				}

			}

			return $simple_table_value;
		}

		// 데이터를 대조해서 다르다면 넘겨받은 객체의 데이터로 바꿉니다.
		for ($idx = 0; $idx < count($schedule_obj_arr); $idx++) {

			$element_first_depth = $schedule_obj_arr[$idx];
			foreach ($element_first_depth as $key => $value) {

				if(!is_array($value)) {
					continue;
				}

		    	$value_array = $value;
		    	for ($idx_second_depth = 0; $idx_second_depth < count($value); $idx_second_depth++) {

		    		$element_third_depth = $value_array[$idx_second_depth];

		    		foreach ($element_third_depth as $element_third_depth_key => $element_third_depth_value) {

		    			if(!strcmp($element_third_depth_key, "simple_table") == 0 || !is_array($element_third_depth_value)) {
		    				continue;
		    			}

	    				// 내부 테이블인 경우의 처리
	    				$element_third_depth_array = $element_third_depth_value;
	    				$is_speech_table = false;
	    				for ($idx_fourth_depth = 0; $idx_fourth_depth < count($element_third_depth_array); $idx_fourth_depth++) {
	    					$element_fourth_depth = $element_third_depth_array[$idx_fourth_depth];

	    					if(!is_array($element_fourth_depth)) {
	    						continue;
	    					}

    						$element_fourth_depth_array = $element_fourth_depth;

    						// NEWS
    						if( count($element_fourth_depth_array) > 0 && 
    							strcmp($element_fourth_depth_array[0]->name, "News Contents") == 0 ) {

    							$simple_table_new = array();
    							array_push($simple_table_new, $element_fourth_depth_array);

	    						for ($idx_speech = 0; $idx_speech < count($today_news_list); $idx_speech++) {
	    							$news_obj = $today_news_list[$idx_speech];

									$simple_table_row_arr = array();

									$simple_table_row_column_obj = new stdClass();
									$simple_table_row_column_obj->name=$news_obj->__news_content;
									$simple_table_row_column_obj->color=TCPDFElement::$COLOR_DARK_GRAY_ARR;
									$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_WARM_GRAY_ARR;

									array_push($simple_table_row_arr,$simple_table_row_column_obj);
									array_push($simple_table_new, $simple_table_row_arr);
	    						}

	    						// 원본 데이터를 수정본으로 바꿉니다.
	    						$element_third_depth->$element_third_depth_key = $simple_table_new;

	    						break;
    						}

    						// SPEECH
    						if( count($element_fourth_depth_array) == 4 && 
    							strcmp($element_fourth_depth_array[0]->name, "Project") == 0 &&
    							strcmp($element_fourth_depth_array[1]->name, "Title") == 0 &&
    							strcmp($element_fourth_depth_array[2]->name, "Speaker") == 0 &&
    							strcmp($element_fourth_depth_array[3]->name, "Evaluator") == 0) {

    							// 스피치 테이블 업데이트
    							$is_speech_table = true;
    							$simple_table_new = array();
    							array_push($simple_table_new, $element_fourth_depth_array);

	    						// 지금 업데이트 해야할 스피치 정보
	    						for ($idx_speech = 0; $idx_speech < count($today_speech_list); $idx_speech++) {
	    							$speech_obj = $today_speech_list[$idx_speech];

	    							// 스피치 객체 정보를 
	    							$simple_table_row_arr = array();

		    						// 1. project
									$simple_table_row_column_obj = new stdClass();
									$simple_table_row_column_obj->name=$speech_obj->__speech_project_title;
									$simple_table_row_column_obj->color=TCPDFElement::$COLOR_DARK_GRAY_ARR;
									$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;

									array_push($simple_table_row_arr,$simple_table_row_column_obj);

									// 2. speech title
									$simple_table_row_column_obj = new stdClass();
									$simple_table_row_column_obj->name=$speech_obj->__title;

									$simple_table_row_column_obj->color=TCPDFElement::$COLOR_DARK_GRAY_ARR;
									$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;

									array_push($simple_table_row_arr,$simple_table_row_column_obj);

									// 3. speaker name
									$simple_table_row_column_obj = new stdClass();
									$simple_table_row_column_obj->name=$speech_obj->__speaker_member_name;
									$simple_table_row_column_obj->color=TCPDFElement::$COLOR_DARK_GRAY_ARR;
									$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;

									array_push($simple_table_row_arr,$simple_table_row_column_obj);

									// 4. evaluator name
									$simple_table_row_column_obj = new stdClass();
									$simple_table_row_column_obj->name=$speech_obj->__evaluator_member_name;
									$simple_table_row_column_obj->color=TCPDFElement::$COLOR_DARK_GRAY_ARR;
									$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;

									array_push($simple_table_row_arr,$simple_table_row_column_obj);
									array_push($simple_table_new, $simple_table_row_arr);
	    						}
	    						
	    						// 원본 데이터를 수정본으로 바꿉니다.
	    						$element_third_depth->$element_third_depth_key = $simple_table_new;

	    						break;
    						}

    						// ROLES
    						for ($idx_fifth_depth = 0; $idx_fifth_depth < count($element_fourth_depth_array); $idx_fifth_depth++) {

								$element_fifth_depth_key = $element_fourth_depth_array[$idx_fifth_depth];

								// 타이틀과 내용이 한줄에 표시되는 형태
								if(	$is_speech_table == false && 
									$element_fifth_depth_key->is_title == 1 && 
									$idx_fifth_depth < (count($element_fourth_depth_array) - 1)) {

									$element_fifth_depth_value = $element_fourth_depth_array[$idx_fifth_depth + 1];

									$element_fifth_depth_value = 
									update_simple_table(
										$element_fifth_depth_key
										, $element_fifth_depth_value
										, $meeting_agenda_obj
										, $today_news_list
										, $today_role_list
										, $today_speech_list
									);	

									$element_fourth_depth_array[$idx_fifth_depth + 1] = $element_fifth_depth_value;
								} // end if

    						}  // 6 depth for end

	    				} // 5 depth for end

		    		} // 4 depth for end

		    	} // 3 depth for end
			    
			} // 2 depth for end

		} // 1 depth for end



		// 전달받은 타임라인 데이터를 1 depth의 array로 변환합니다. 
		// main action, sub action 구분 플래그를 추가합니다.
		$flatten_timeline_action_obj_arr = $this->get_timeline_action_array($schedule_obj_arr, 0, $element_set_title);

		// 실제 컬럼을 그립니다.
		$element_set = 
		new TCPDFElementSet(
			$element_set_title
			, $element_set_x_pos
			, $element_set_y_pos
			, $element_set_width
		);

		// wonder.jung
		if(strcmp($font_type,TCPDFElement::$FONT_SIZE_LARGE) == 0) {
			$ELEMENT_SET_TITLE_FONT_SIZE = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE_HUGE;
			$CARD_BOARD_TITLE_FONT_SIZE = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE_LARGE;
			$CARD_BOARD_CONTENT_FONT_SIZE = TCPDFElement::$CARD_BOARD_CONTENT_FONT_SIZE_LARGE;
			$SIMPLE_TABLE_TITLE_FONT_SIZE = TCPDFElement::$SIMPLE_TABLE_TITLE_FONT_SIZE_LARGE;
		} else {
			$ELEMENT_SET_TITLE_FONT_SIZE = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE_LARGE;
			$CARD_BOARD_TITLE_FONT_SIZE = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE;
			$CARD_BOARD_CONTENT_FONT_SIZE = TCPDFElement::$CARD_BOARD_CONTENT_FONT_SIZE;
			$SIMPLE_TABLE_TITLE_FONT_SIZE = TCPDFElement::$SIMPLE_TABLE_TITLE_MIDIUM_FONT_SIZE;
		}

		$element_prop_main_action;
		for ($idx = 0; $idx < count($flatten_timeline_action_obj_arr); $idx++) {

			$action_obj = $flatten_timeline_action_obj_arr[$idx];
			$name = $action_obj->name;
			$depth = $action_obj->depth;


			if($idx == 0) {
				// 타이틀을 그립니다.
				$element_prop_title = 
				TCPDFElement::GET_ELEMENT_PROP(
					$this->pdf
					// element type
					, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
					// element_name
					, "element_title_" . $idx
					// text
					, $element_set_title
					// text_color_arr
					// , TCPDFElement::$COLOR_DARK_GRAY_ARR
					, TCPDFElement::$COLOR_WHITE_ARR
					// text_size
					, $ELEMENT_SET_TITLE_FONT_SIZE
					// cell_x_pos
					, $element_set_x_pos
					// cell_y_pos
					// , $prev_cell_y_pos
					, $element_set->get_element_set_bottom_y_pos()
					// cell_width
					, $element_set_width
					// cell_height
					, -1
					// cell_color_arr
					// , TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR
					, TCPDFElement::$COLOR_DARK_GRAY_ARR
					, $depth
					// is_first
					, true
					// is_last
					, false
					// is_bold
					, true
					// text_align
					, TCPDFElement::$TEXT_ALIGN_CENTER
					// caller_name
					, $caller_name
				);
				$element_prop_title->draw();
				$element_set->add_element($element_prop_title);

				continue;
			} else if($depth == 0) {

				// 타임마커가 있는 액션 객체를 그립니다.
				// Element Property를 만듭니다.
				$element_prop_main_action = 
				TCPDFElement::GET_ELEMENT_PROP(
					$this->pdf
					// element type
					, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
					// element_name
					, "main_action_" . $idx
					// text
					, $name
					// text_color_arr
					, TCPDFElement::$COLOR_DARK_GRAY_ARR
					// text_size
					, $CARD_BOARD_TITLE_FONT_SIZE
					// cell_x_pos
					, $element_set_x_pos
					// cell_y_pos
					, $element_set->get_element_set_bottom_y_pos()
					// cell_width
					, $element_set_width
					// cell_height
					, -1
					// cell_color_arr
					// , TCPDFElement::$COLOR_MILK_GRAY_ARR
					, TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR
					// depth
					, $depth
					// is_first
					, false
					// is_last
					, false
					// is_bold
					, true
					// text_align
					, TCPDFElement::$TEXT_ALIGN_LEFT
					// caller_name
					, $caller_name
				);

				// 타임 마커를 그리고 배치합니다.
				// 타임 마커 전용 text only prop 생성.
				$element_prop_time_marker = 
				TCPDFElement::GET_ELEMENT_PROP(
					$this->pdf
					// element type
					, TCPDFElement::$ELEMENT_TYPE_TEXT_ONLY
					// element_name
					, "time_marker_" . $idx
					// text
					, $action_obj->time
					// text_color_arr
					// , TCPDFElement::$COLOR_DARK_GRAY_ARR
					, TCPDFElement::$COLOR_WARM_GRAY_ARR
					// text_size
					, $CARD_BOARD_TITLE_FONT_SIZE
					// cell_x_pos
					, $element_prop_main_action->get_cell_x_pos()
					// cell_y_pos
					, $element_prop_main_action->get_cell_y_pos()
					// cell_width
					, $element_prop_main_action->get_cell_width()
					// cell_height
					, -1
					// cell_color_arr
					// , TCPDFElement::$COLOR_DARK_GRAY_ARR
					, TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR
					// depth
					, $depth
					// is_first
					, false
					// is_last
					, false
					// is_bold
					, true
					// text_align
					, TCPDFElement::$TEXT_ALIGN_LEFT
					// caller_name
					, $caller_name
				);	

				// 타임 마커의 너비 만큼 텍스트를 오른쪽으로 이동시킵니다.
				$text_x_pos_offset = $element_prop_time_marker->get_text_width() + $element_prop_time_marker->get_text_height();
				$element_prop_main_action->set_text_x_pos_offset($text_x_pos_offset);
				$element_prop_main_action->draw();
				$element_set->add_element($element_prop_main_action);

				// 타임 마커를 그립니다.
				$this->draw_timeline_time_marker_V2($element_prop_time_marker, $caller_name);
				$element_prop_time_marker->draw();

				// simple table이 있다면 추가 열을 만듭니다.

			} else if($depth == 1) {

				// simple table이 있다면 추가 열을 만듭니다.			
				$simple_table = $action_obj->simple_table;

				$is_last = false;
				if($idx == (count($flatten_timeline_action_obj_arr) - 1)) {
					$is_last = true;
				}

				if(is_null($simple_table)) {

					// sub action을 그립니다.
					// Element Property를 만듭니다.
					$element_prop_sub_action = 
					TCPDFElement::GET_ELEMENT_PROP(
						$this->pdf
						// element type
						, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
						// element_name
						, "sub_action_" . $idx
						// text
						, $name
						// text_color_arr
						, TCPDFElement::$COLOR_DARK_GRAY_ARR
						// text_size
						, $CARD_BOARD_TITLE_FONT_SIZE
						// cell_x_pos
						, $element_set_x_pos
						// cell_y_pos
						, $element_set->get_element_set_bottom_y_pos()
						// cell_width
						, $element_set_width
						// cell_height
						, -1
						// cell_color_arr
						, TCPDFElement::$COLOR_MILK_GRAY_ARR
						// depth
						, $depth
						// is_first
						, false
						// is_last
						, $is_last
						// is_bold
						, false
						// text_align
						, TCPDFElement::$TEXT_ALIGN_LEFT
						// caller_name
						, $caller_name
					);	

					// 타임 마커의 너비 만큼 텍스트를 오른쪽으로 이동시킵니다.
					$cur_main_action_text = $element_prop_main_action->get_raw_text();
					$cur_main_action_text_x_pos = $element_prop_main_action->get_text_x_pos();
					$cur_main_action_cell_x_pos = $element_prop_main_action->get_cell_x_pos();
					$x_pos_offset = $element_prop_main_action->get_text_x_pos() - $element_prop_main_action->get_cell_x_pos();

					$element_prop_sub_action->updateTextProps($name, $x_pos_offset);
					$element_prop_sub_action->draw();
					$element_set->add_element($element_prop_sub_action);

				} else {

					// 타임 마커의 너비 만큼 텍스트를 오른쪽으로 이동시킵니다.
					$x_pos_offset = $element_prop_main_action->get_text_x_pos() - $element_prop_main_action->get_cell_x_pos();

					// Simple Table Width
					$simple_table_width = $element_set_width - ($x_pos_offset + TCPDFElement::$PADDING_CARD_BOARD_TIMELINE_TITLE * 2);

					// TODO
					// Simple table column width ratio
					// 심플 테이블의 컬럼 너비 비율을 넘겨줍니다.(선택 사항)
					$simple_table_column_width_ratio_arr = array();

					// Simple Table
					$element_set_simple_table = 
					new TCPDFElementSet(
						$element_set_title
						, $element_set_x_pos + $x_pos_offset
						, $element_set_y_pos
						, $simple_table_width
					);

					for ($simple_table_row_idx = 0; $simple_table_row_idx < count($simple_table); $simple_table_row_idx++) {
						$simple_table_row = $simple_table[$simple_table_row_idx];
						// print_r($simple_table_row);
						// echo "<br/><br/>";

						$prev_element_prop_simple_table;
						for ($simple_table_column_idx = 0; $simple_table_column_idx < count($simple_table_row); $simple_table_column_idx++) {
							$simple_table_column = $simple_table_row[$simple_table_column_idx];
							// echo "<br/>";
							// print_r($simple_table_column);
							// echo "<br/>";

							$is_bold = false;
							$cell_color_arr = TCPDFElement::$COLOR_WHITE_ARR;
							if($simple_table_column->is_title) {
								$is_bold = true;
								$cell_color_arr = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
							}

							// print_r($simple_table_column);
							// echo "<br/><br/>";

							// FIX ME - 개발 PC에서는 재현되지 않음. cafe24 php 서버에서 아래 html 특수문자를 파싱실패함.
							$simple_table_column->name = str_replace("&lsquo;","'",$simple_table_column->name);

							// 테이블에 속한 엘리먼트의 x, y pos은 0으로 고정. 
							// 테이블의 너비 및 높이가 계산이 된 이후에 이동할 위치를 지정해서
							// 모든 엘리먼트의 x, y pos을 업데이트 해줍니다.
							$element_prop_simple_table_field = 
							TCPDFElement::GET_ELEMENT_PROP(
								$this->pdf
								// element type
								, TCPDFElement::$ELEMENT_TYPE_TABLE_FIELD
								// element_name
								, "sub_action_" . $simple_table_row_idx . "_" . $simple_table_column_idx . "_" . $simple_table_column->name
								// text
								, $simple_table_column->name
								// text_color_arr
								// , TCPDFElement::$COLOR_WARM_GRAY_ARR
								, $simple_table_column->color
								// text_size
								, $CARD_BOARD_SIMPLE_TABLE_FONT_SIZE
								//, TCPDFElement::$CARD_BOARD_SIMPLE_TABLE_FONT_SIZE
								// cell_x_pos
								, 0
								// cell_y_pos
								, 0
								// cell_width / 테이블의 전체 너비를 조정해야 하므로 입력하지 않습니다.
								, -1
								// cell_height / 테이블의 전체 높이를 조정해야 하므로 입력하지 않습니다.
								, -1
								// cell_color_arr
								// , $cell_color_arr
								, $simple_table_column->bg_color
								// depth
								, $depth
								// is_first
								, false
								// is_last
								, false
								// is_bold
								, $is_bold
								// text_align
								, TCPDFElement::$TEXT_ALIGN_LEFT
								// caller_name
								, $caller_name
							);

							// $raw_text = $element_prop_simple_table_field->get_raw_text();
							// print_r($raw_text);
							// echo "<br/><br/>";

							$cur_row_idx = $simple_table_row_idx;
							$cur_column_idx = $simple_table_column_idx;
							$cur_element = $element_prop_simple_table_field;
							$element_set_simple_table->add_table_element($cur_row_idx, $cur_column_idx, $cur_element);
						}

						// echo "<br/><br/><br/>";
					}

					// 1-1. table cell의 높이와 너비를 구합니다.
					// $simple_table_width = $element_set_simple_table->get_table_width();
					$simple_table_cell_height = $element_set_simple_table->get_table_height() + (TCPDFElement::$PADDING_SIMPLE_TABLE_TEXT * 2);

					// DEBUG
					// echo "\$simple_table_cell_height : $simple_table_cell_height<br/>";

					// 1-2. 페이지의 전체 너비?
					$page_width = $element_prop_main_action->get_page_width();
					// echo "\$page_width : $page_width<br/>";
					$page_height = $element_prop_main_action->get_page_height();
					// echo "\$page_height : $page_height<br/>";

					// echo "\$simple_table_height : $simple_table_height<br/>";

					// 1. table cell을 그립니다.
					// 테이블이 들어갈 배경 cell
					$element_prop_simple_table_cell = 
					TCPDFElement::GET_ELEMENT_PROP(
						$this->pdf
						// element type
						, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_EMPTY
						// element_name
						, "sub_action_cell" . $idx
						// text
						, ""
						// text_color_arr
						, TCPDFElement::$COLOR_DARK_GRAY_ARR
						// text_size
						, TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE
						// cell_x_pos
						, $element_set_x_pos
						// cell_y_pos
						, $element_set->get_element_set_bottom_y_pos()
						// cell_width / 테이블의 전체 너비를 조정해야 하므로 입력하지 않습니다.
						, $element_set_width
						// cell_height / 테이블의 전체 높이를 조정해야 하므로 입력하지 않습니다.
						, $simple_table_cell_height
						// cell_color_arr
						, TCPDFElement::$COLOR_MILK_GRAY_ARR
						// depth
						, $depth
						// is_first
						, false
						// is_last
						, false
						// is_bold
						, $is_bold
						// text_align
						, TCPDFElement::$TEXT_ALIGN_LEFT
						// caller_name
						, $caller_name
					);
					$element_prop_simple_table_cell->draw();
					$element_set->add_element($element_prop_simple_table_cell);

					$element_set_simple_table->set_element_set_y_pos($element_prop_simple_table_cell->get_cell_y_pos());
					$element_set_simple_table->draw_table();

				}

			}
			// print_r($action_obj);
			// echo "<br/><br/>";

		}

	}


	private function draw_simple_table($simple_table_cell_prop_arr) {

		$caller_name = "draw_simple_table<br/>";
		if(empty($simple_table_cell_prop_arr)){
			echo "TCPDFManager\t$caller_name\t\$simple_table_cell_prop_arr is empty!";
			return;
		}

		// 테이블의 높이와 너비를 구합니다.
		$table_width = 0;
		$table_height = 0;
		for ($idx = 0; $idx < count($simple_table_cell_prop_arr); $idx++) {
			$simple_table_cell_prop_row_arr = $simple_table_cell_prop_arr[$idx];

			if(empty($simple_table_cell_prop_row_arr)) continue;

			for ($inner_idx = 0; $inner_idx < count($simple_table_cell_prop_row_arr); $inner_idx++) {
				$simple_table_cell_prop_obj = $simple_table_cell_prop_row_arr[$inner_idx];

				$table_width += $simple_table_cell_prop_obj->cell_width;

				if($table_height == 0){
					$table_height = ( $simple_table_cell_prop_obj->cell_height * count($simple_table_cell_prop_arr) );
				}
			}

			break;
		}
		if(!($table_width > 0)){
			echo "TCPDFManager\t$caller_name\t\$table_width is empty!";
			return;
		}
		if(!($table_height > 0)){
			echo "TCPDFManager\t$caller_name\t\$table_height is empty!";
			return;
		}


		for ($idx = 0; $idx < count($simple_table_cell_prop_arr); $idx++) {
			$simple_table_cell_prop_row_arr = $simple_table_cell_prop_arr[$idx];

			if(empty($simple_table_cell_prop_row_arr)) continue;

			for ($inner_idx = 0; $inner_idx < count($simple_table_cell_prop_row_arr); $inner_idx++) {
				$simple_table_cell_prop_obj = $simple_table_cell_prop_row_arr[$inner_idx];

				$this->draw_simple_table_cell(
					$simple_table_cell_prop_obj
					, $caller_name
				);
			}
		} // for ends


		// 2. draw text
		for ($idx = 0; $idx < count($simple_table_cell_prop_arr); $idx++) {
			$simple_table_cell_prop_row_arr = $simple_table_cell_prop_arr[$idx];

			if(empty($simple_table_cell_prop_row_arr)) continue;

			for ($inner_idx = 0; $inner_idx < count($simple_table_cell_prop_row_arr); $inner_idx++) {
				$simple_table_cell_prop_obj = $simple_table_cell_prop_row_arr[$inner_idx];
				$this->draw_text($simple_table_cell_prop_obj, $caller_name);
			}
		} // for ends


	}

	private function get_timeline_action_array($timeline_action_obj_arr, $cur_depth=0, $title=""){

		// 리스트를 1 depth 배열로 정리해서 넘겨줍니다.
		$flatten_timeline_action_obj_arr = array();
		if(!empty($title)){
			// title을 제일 앞에 추가합니다.
			$title_action_obj = new stdClass();
			$title_action_obj->name = $title;
			$title_action_obj->depth = -1;

			array_push($flatten_timeline_action_obj_arr,$title_action_obj);
		}

		for ($idx = 0; $idx < count($timeline_action_obj_arr); $idx++) {
			$timeline_action_obj = $timeline_action_obj_arr[$idx];

			$action_name = $timeline_action_obj->action_name;
			$time = $timeline_action_obj->time;
			$action_list = $timeline_action_obj->action_list;

			// 내부에 포함되는 심플 테이블 데이터
			$simple_table = $timeline_action_obj->simple_table;

			$action_obj = new stdClass();
			$action_obj->name = $action_name;
			$action_obj->time = $time;
			$action_obj->simple_table = $simple_table;
			$action_obj->depth = $cur_depth;

			array_push($flatten_timeline_action_obj_arr,$action_obj);//$today_role_arr = array();

			// add sub actions
			$flatten_sub_timeline_action_obj_arr = null;
			if(!empty($action_list)){
				$flatten_sub_timeline_action_obj_arr = $this->get_timeline_action_array($action_list, $cur_depth + 1);
			}
			if(!empty($flatten_sub_timeline_action_obj_arr)){
				foreach ($flatten_sub_timeline_action_obj_arr as $sub_action_obj) {
					array_push($flatten_timeline_action_obj_arr,$sub_action_obj);//$today_role_arr = array();
				}
			}
		}

		return $flatten_timeline_action_obj_arr;

	}




	// REMOVE ME
	/*

		토스트 마스터의 오피서들의 정보를 키, 벨류 쌍으로 돌려줍니다.

	*/
	/*
	public function get_card_board_key_value_data_from_toastmaster_officer($toastmaster_officer_list){

		$wdj_key_value_arr=array();
		for ($idx = 0; $idx < count($toastmaster_officer_list); $idx++) {
			$officer_obj = $toastmaster_officer_list[$idx];

			$officer_name = $officer_obj->__member_name;
			$officer_member_name = $officer_obj->__officer_name;
			$officer_member_mobile = $officer_obj->__member_mobile;

			$wdj_key_value_arr[$officer_member_name]=$officer_name;
		}

		return $wdj_key_value_arr;
	}
	*/


	/*

		토스트 마스터의 오피서들의 정보를 키, 벨류 배열 쌍으로 돌려줍니다. - V2


	*/
	public function draw_toastmaster_officer(	$element_set_title
												, $element_set_x_pos
												, $element_set_y_pos
												, $element_set_width
												, $toastmaster_officer_list
												, $font_type=null){

		$caller_name = "<br/>draw_toastmaster_officer<br/>";
		if(empty($element_set_title)){
			echo "TCPDFManager\t$caller_name\t\$element_set_title is empty!";
			return;
		}
		if(!($element_set_x_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_x_pos is not valid!";
			return;
		}
		if(!($element_set_y_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_y_pos is not valid!";
			return;
		}
		if(!($element_set_width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_width is not valid!";
			return;
		}
		if(empty($toastmaster_officer_list)){
			echo "TCPDFManager\t$caller_name\t\$toastmaster_officer_list is empty!";
			return;
		}

		$element_set = new TCPDFElementSet($element_set_title, $element_set_x_pos, $element_set_y_pos, $element_set_width);



		$is_first = true;
		$is_bold = true;
		$font_size = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE;
		if(!is_null($font_type) && strcmp(TCPDFElement::$FONT_SIZE_LARGE,$font_type) == 0) {
			$font_size = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE_HUGE;
		}
		// 엘리먼트 셋의 타이틀을 나타내는 엘리먼트를 작성합니다.
		$element_prop_title = 
		TCPDFElement::GET_ELEMENT_PROP(
			$this->pdf
			// element type
			, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
			// element_name
			, "element_title_" . $idx
			// text
			, $element_set_title
			// text_color_arr
			, TCPDFElement::$COLOR_WHITE_ARR
			// text_size
			, $font_size
			// cell_x_pos
			, $element_set_x_pos
			// cell_y_pos
			// , $prev_cell_y_pos
			, $element_set->get_element_set_bottom_y_pos()
			// cell_width
			, $element_set_width
			// cell_height
			, -1
			// cell_color_arr
			, TCPDFElement::$COLOR_DARK_GRAY_ARR
			, $depth
			, $is_first
			, $is_last
			, $is_bold
			// text_align
			, TCPDFElement::$TEXT_ALIGN_CENTER
			// caller_name
			, $caller_name
		);
		$element_prop_title->draw();
		$element_set->add_element($element_prop_title);

		$depth=0;
		$font_size = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE;
		if(!is_null($font_type) && strcmp(TCPDFElement::$FONT_SIZE_LARGE,$font_type) == 0) {
			$font_size = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE_LARGE;
		}
		for ($idx = 0; $idx < count($toastmaster_officer_list); $idx++) {
			$officer_obj = $toastmaster_officer_list[$idx];

			// DEBUG
			// if($idx == 0) {
			// 	print_r($officer_obj);
			// 	echo "<br/>";
			// }

			// key - officer_name
			$key = $officer_obj->__officer_name;
			$is_first = false;
			$is_bold = true;
			// Element Property를 만듭니다.
			$element_prop_key = 
			TCPDFElement::GET_ELEMENT_PROP(
				$this->pdf
				// element type
				, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
				// element_name
				, "officer_key_" . $idx
				// text
				, $key
				// text_color_arr
				, TCPDFElement::$COLOR_WARM_GRAY_ARR
				// text_size
				, $font_size
				// cell_x_pos
				, $element_set_x_pos
				// cell_y_pos
				, $element_set->get_element_set_bottom_y_pos()
				// cell_width
				, $element_set_width
				// cell_height
				, -1
				// cell_color_arr
				, TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR
				, $depth
				, $is_first
				, $is_last
				, $is_bold
				// text_align
				, TCPDFElement::$TEXT_ALIGN_LEFT
				// caller_name
				, $caller_name
			);
			$element_prop_key->draw();
			$element_set->add_element($element_prop_key);

			// value
			$officer_member_name = $officer_obj->__member_name;
			$officer_member_email = $officer_obj->__member_email;
			$value = $officer_member_name . " / " . $officer_member_email;
			// props
			$is_first = false;
			$is_last = false;
			if($idx == (count($toastmaster_officer_list) - 1)) {
				$is_last = true;
			}
			$is_bold = false;
			// Element Property를 만듭니다.
			$element_prop_value = 
			TCPDFElement::GET_ELEMENT_PROP(
				$this->pdf
				// element type
				, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
				// element_name
				, "officer_value_" . $idx
				// text
				, $value
				// text_color_arr
				, TCPDFElement::$COLOR_DARK_GRAY_ARR
				// text_size
				, $CARD_BOARD_CONTENT_FONT_SIZE
				//, TCPDFElement::$CARD_BOARD_CONTENT_FONT_SIZE
				// cell_x_pos
				, $element_set_x_pos
				// cell_y_pos
				, $element_set->get_element_set_bottom_y_pos()
				// cell_width
				, $element_set_width
				// cell_height
				, -1
				// cell_color_arr
				, TCPDFElement::$COLOR_MILK_GRAY_ARR
				, $depth
				, $is_first
				, $is_last
				, $is_bold
				// text_align
				, TCPDFElement::$TEXT_ALIGN_LEFT
				// caller_name
				, $caller_name
			);
			$element_prop_value->draw();
			$element_set->add_element($element_prop_key);

		}
	}


	/*
		special character escape
	*/
	private function get_safe_action_desc($param_action_name){
	    return html_entity_decode($param_action_name);
	}
	public function get_timeline_card_board_data_from_toastmaster_schedule($schedule_timeline_list){

		$schedule_main_action_obj_arr = array();
		for ($idx = 0; $idx < count($schedule_timeline_list); $idx++) {
			$schedule_obj = $schedule_timeline_list[$idx];

			if(is_null($schedule_obj->__timeline_schedule)) continue;

			$timeline_schedule_obj = json_decode($schedule_obj->__timeline_schedule);

			// main action
			$action_name = $this->get_safe_action_desc($timeline_schedule_obj->action_name);
			$sub_action_list = $timeline_schedule_obj->action_list;
			$action_time_startdttm = $schedule_obj->__timeline_schedule_startdttm;
		    $action_time_stamp = date_format(date_create($action_time_startdttm), 'H:i');

			if(!is_array($sub_action_list)) continue;

			$schedule_sub_action_obj_arr = array();
			for ($inner_idx = 0; $inner_idx < count($sub_action_list); $inner_idx++) {

				$sub_action_obj = $sub_action_list[$inner_idx];
				if(is_null($sub_action_obj)) continue;

				$sub_action_name = $this->get_safe_action_desc($sub_action_obj->action_name);

				$schedule_sub_action_obj = new stdClass();
				$schedule_sub_action_obj->action_name=$sub_action_name;
				array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

			}
			$schedule_main_action_obj = new stdClass();
			$schedule_main_action_obj->time=$action_time_stamp;
			$schedule_main_action_obj->action_name=$action_name;
			$schedule_main_action_obj->action_list=$schedule_sub_action_obj_arr;

			array_push($schedule_main_action_obj_arr,$schedule_main_action_obj);
		}

		return $schedule_main_action_obj_arr;
	}
	private function get_simple_table_add_on_arr_from_add_on_obj_list($add_on_obj_list){

		if(empty($add_on_obj_list)) {
			return array();
		}

		$cur_simple_table_arr = array();
		for ($idx = 0; $idx < count($add_on_obj_list); $idx++) {
			$add_on_obj = $add_on_obj_list[$idx];
			$cur_simple_table_obj = $this->get_simple_table_add_on_arr_from_add_on_obj($add_on_obj);

			if(!is_null($cur_simple_table_obj) && !empty($cur_simple_table_obj)) {
				array_push($cur_simple_table_arr,$cur_simple_table_obj);	
			}
		}

		// echo "001<br/>";
		// print_r($cur_simple_table_arr);
		// echo "<br/>002<br/><br/>";

		return $cur_simple_table_arr;
	}
	private function get_simple_table_add_on_arr_from_add_on_obj($add_on_obj){

		if(is_null($add_on_obj)) {
			return null;
		}

		$json_format_obj_arr = $add_on_obj->json_format_obj_arr;
		if(is_null($json_format_obj_arr) || empty($json_format_obj_arr)) {
			return null;
		}

		$simple_table_row_arr = array();
		for ($idx = 0; $idx < count($json_format_obj_arr); $idx++) {
			$json_format_obj = $json_format_obj_arr[$idx];

			// table row
			$simple_table_row_column_arr = array();
			for ($inner_idx = 0; $inner_idx < count($json_format_obj); $inner_idx++) {

				// table row field
				$inner_obj = $json_format_obj[$inner_idx];

				$option_group_name = $inner_obj->option_group_name;
				$key_access_prop_name = $inner_obj->key_access_prop_name;
				$key = $inner_obj->key;
				$type = $inner_obj->type;
				$name = $key;

				$color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
				$bg_color = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;

				$is_title = false;

				if($type == "ELEMENT_TYPE_TABLE_TITLE") {
					// 타이틀일 경우 배경색을 다르게 지정.
					$color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
					$bg_color = TCPDFElement::$COLOR_WARM_GRAY_ARR;
					$is_title = true;
				} else if($type == "ELEMENT_TYPE_TABLE_TITLE_ADDABLE") {
					// 타이틀일 경우 배경색을 다르게 지정.
					$color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
					$bg_color = TCPDFElement::$COLOR_WARM_GRAY_ARR;
					// 테이블 최상단 타이틀일 경우는 내용을 option_group_name에서 참조
					$name = $option_group_name;
					$is_title = true;
				} else if($type == "ELEMENT_TYPE_TABLE_TIME_MM_SS"){
					// 시간(분, 초) 정보일 경우, 초 단위 정보를 분,초로 바꾸어 준다.
					$name = $this->getTimeFormat_MM_SS_Str($key);
				}

				$simple_table_row_column_obj = new stdClass();
				$simple_table_row_column_obj->name=$name;
				$simple_table_row_column_obj->color=$color;
				$simple_table_row_column_obj->bg_color=$bg_color;
				$simple_table_row_column_obj->is_title=$is_title;
				array_push($simple_table_row_column_arr,$simple_table_row_column_obj);
			}
			array_push($simple_table_row_arr, $simple_table_row_column_arr);
		}

		return $simple_table_row_arr;
	}
	public function get_timeline_card_board_data_from_toastmaster_schedule_V2($schedule_timeline_list){

		$first_schedule_timeline = $schedule_timeline_list[0];

		$json_str = $first_schedule_timeline->__timeline_schedule_json_str;

		// TODO row 별로 분리해서 파싱 작업을 수행해야 함.
		// 그렇지 않으면 어느 부분에서 파싱장애가 발생했는지 파악하기 힘듬.

		$timeline_list_row_info_arr = 
		//JSONManager::get_json_obj(
		JSONManager::get_json_obj_from_JSONStringify(
			// $unsafe_json_str
			$json_str
			// $is_html_decode
			// ,true
		);

		// TODO 2줄일 경우의 줄바꿈 설정 필요
		// 1. time marker의 너비 산정 로직을 여기서 사용하여 time marker 정보를 설정해 주어야 함.

		$schedule_action_obj_arr = array();
		for ($idx = 0; $idx < count($timeline_list_row_info_arr); $idx++) {
			$timeline_list_row_info = $timeline_list_row_info_arr[$idx];

			$__action_list = $timeline_list_row_info->__action_list;
			$__action_name = $timeline_list_row_info->__action_name;

			$__action_simple_table_arr = 
			$this->get_simple_table_add_on_arr_from_add_on_obj_list($timeline_list_row_info->__prop_map->__add_on_obj_list);
			$__action_time_sec = $timeline_list_row_info->__prop_map->__time_sec;
			$__action_time_H_i_s = gmdate("H:i", $__action_time_sec);

			$schedule_sub_action_obj_arr = array();
			for ($inner_idx = 0; $inner_idx < count($__action_list); $inner_idx++) {
				$__child_action_list = $__action_list[$inner_idx];
				
				for ($child_idx = 0; $child_idx < count($__child_action_list); $child_idx++) {
					$__child_action = $__child_action_list[$child_idx];
					$__child_action_name = $__child_action->__action_name;

					$__child_action_simple_table_arr = 
					$this->get_simple_table_add_on_arr_from_add_on_obj_list($__child_action->__prop_map->__add_on_obj_list);

					$sub_action_name = $this->get_safe_action_desc($__child_action_name);

					// 액션 이름을 먼저 지정
					$schedule_sub_action_obj = new stdClass();
					$schedule_sub_action_obj->action_name=$sub_action_name;
					array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

					// 이 액션에 속해 있는 테이블 객체 정보를 넣습니다.
					if(!is_null($__child_action_simple_table_arr) && !empty($__child_action_simple_table_arr)) {

						for ($child_table_idx = 0; $child_table_idx < count($__child_action_simple_table_arr); $child_table_idx++) {
							$child_action_simple_table = $__child_action_simple_table_arr[$child_table_idx];

							$schedule_sub_action_obj = new stdClass();
							$schedule_sub_action_obj->simple_table=$child_action_simple_table;
							array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);
						}
					}
					
				} // for child end
			} // for inner end

			// 액션 이름을 먼저 지정
			$schedule_main_action_obj = new stdClass();
			$schedule_main_action_obj->time=$__action_time_H_i_s;
			$schedule_main_action_obj->action_name = $this->get_safe_action_desc($__action_name);
			$schedule_main_action_obj->action_list=$schedule_sub_action_obj_arr;
			array_push($schedule_action_obj_arr,$schedule_main_action_obj);

			// 이 액션에 속해 있는 테이블 객체 정보를 넣습니다. ( 여러 개일수 있습니다. )
			if(!is_null($__action_simple_table_arr) && !empty($__action_simple_table_arr)) {
				for ($inner_idx = 0; $inner_idx < count($__action_simple_table_arr); $inner_idx++) {
					$action_simple_table = $__action_simple_table_arr[$inner_idx];

					$schedule_main_action_obj = new stdClass();
					$schedule_main_action_obj->simple_table=$action_simple_table;	
					array_push($schedule_action_obj_arr,$schedule_main_action_obj);
				}
			}

		} // for end

		return $schedule_action_obj_arr;
	}	

	// @ Test
	public function get_timeline_card_board_data_sample(){
		// Simple table Sample Data Set
		$schedule_main_action_obj_arr = array();

		// 1.
		$schedule_sub_action_obj_arr = array();
		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->action_name="Club Business ( What's new? )";
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->action_name="Announcement & Role Sign-up for future meeting";
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->simple_table=$this->get_simple_table_data_sample(); // 줄에 테이블이 포함됩니다.
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->action_name="Guest Comments";
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->simple_table=$this->get_simple_table_data_sample(); // 줄에 테이블이 포함됩니다.
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);


		$schedule_main_action_obj = new stdClass();
		$schedule_main_action_obj->time="20:00";
		$schedule_main_action_obj->action_name="Meeting [ Chairperson ]";
		$schedule_main_action_obj->action_list=$schedule_sub_action_obj_arr;
		array_push($schedule_main_action_obj_arr,$schedule_main_action_obj);


		$schedule_sub_action_obj_arr = array();
		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->action_name="Introduce speakers ( Speaker, Speech Number, Topic, Evaluator, Speech Objectives, Time )";
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->action_name="Timer's Report";
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

		$schedule_sub_action_obj = new stdClass();
		$schedule_sub_action_obj->action_name="Vote for the Best Prepared Speech Speaker";
		array_push($schedule_sub_action_obj_arr,$schedule_sub_action_obj);

		$schedule_main_action_obj = new stdClass();
		$schedule_main_action_obj->time="21:00";
		$schedule_main_action_obj->action_name="Prepared Speech Session [ Toastmaster ]";
		$schedule_main_action_obj->action_list=$schedule_sub_action_obj_arr;
		array_push($schedule_main_action_obj_arr,$schedule_main_action_obj);

		return $schedule_main_action_obj_arr;
	}

	public function get_simple_table_data_sample(){

		$simple_table_row_arr = array();

		// first row
		$simple_table_row_column_arr = array();

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="title";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="duration";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="playcnt";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		array_push($simple_table_row_arr, $simple_table_row_column_arr);


		// second row
		$simple_table_row_column_arr = array();

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="Red Bull";//"title";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=$this->color_white_arr;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="120";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=$this->color_white_arr;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="10000";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=$this->color_white_arr;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		array_push($simple_table_row_arr, $simple_table_row_column_arr);


		// third row
		$simple_table_row_column_arr = array();

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="Coca-cola";//"title";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=$this->color_white_arr;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="310";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=$this->color_white_arr;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		$simple_table_row_column_obj = new stdClass();
		$simple_table_row_column_obj->name="2000";
		$simple_table_row_column_obj->color=$this->color_warm_gray_arr;
		$simple_table_row_column_obj->bg_color=$this->color_white_arr;
		array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

		array_push($simple_table_row_arr, $simple_table_row_column_arr);

		return $simple_table_row_arr;

	}

	public function get_simple_table_data_today_role_list($today_role_list){

		$simple_table_row_arr = array();

		$length = count($today_role_list)/2;
		for ($idx = 0; $idx < $length; $idx++) {

			$cur_left_idx = ($idx * 2);
			$cur_right_idx = $cur_left_idx + 1;

			$today_role_obj_left = $today_role_list[$cur_left_idx];
			$today_role_obj_right = $today_role_list[$cur_right_idx];
			if(empty($today_role_obj_left) || empty($today_role_obj_right)) continue;

			// left side
			$simple_table_row_column_arr = array();

			// role name (title)
			$simple_table_row_column_obj = new stdClass();
			$simple_table_row_column_obj->is_title=true;
			$simple_table_row_column_obj->name=$today_role_obj_left->role_name;
			// REMOVE ME
			// $simple_table_row_column_obj->color=$this->color_warm_gray_arr;
			$simple_table_row_column_obj->color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
			$simple_table_row_column_obj->bg_color=$this->color_white_arr;
			array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

			// member name
			$member_name = "Not Assigned";
			if(intval($today_role_obj_left->member_id) > -1) {
				$member_name = $today_role_obj_left->member_name;
			}

			$simple_table_row_column_obj = new stdClass();
			$simple_table_row_column_obj->name=$member_name;
			// REMOVE ME
			// $simple_table_row_column_obj->color=$this->color_warm_gray_arr;
			$simple_table_row_column_obj->color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
			$simple_table_row_column_obj->bg_color=$this->color_white_arr;
			array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

			// right side
			// role name (title)
			$simple_table_row_column_obj = new stdClass();
			$simple_table_row_column_obj->is_title=true;
			$simple_table_row_column_obj->name=$today_role_obj_right->role_name;
			// REMOVE ME
			// $simple_table_row_column_obj->color=$this->color_warm_gray_arr;
			$simple_table_row_column_obj->color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
			$simple_table_row_column_obj->bg_color=$this->color_white_arr;
			array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

			// member name
			$member_name = "Not Assigned";
			if(intval($today_role_obj_right->member_id) > -1) {
				$member_name = $today_role_obj_right->member_name;
			}

			$simple_table_row_column_obj = new stdClass();
			$simple_table_row_column_obj->name=$member_name;
			// REMOVE ME
			// $simple_table_row_column_obj->color=$this->color_warm_gray_arr;
			$simple_table_row_column_obj->color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
			$simple_table_row_column_obj->bg_color=$this->color_white_arr;
			array_push($simple_table_row_column_arr,$simple_table_row_column_obj);

			array_push($simple_table_row_arr, $simple_table_row_column_arr);

		}

		return $simple_table_row_arr;

	}	
	private function draw_triangle($x, $y, $height, $color_array){

		// TODO check color array n other parameters.

		$height_half = floor(($height/2)*10)/10;


		$gap = 0.04;
		$polygon_pos_arr = 
		array(
			// point 01
			$x - $gap
			,$y
			// point 02
			,$x + $gap
			,$y
			// point 03
			,$x + ($height_half)
			,$y + ($height_half)
			// point 04
			,$x + $gap
			,$y + $height
			// point 05
			,$x - $gap
			,$y + $height
		);
		$this->pdf->Polygon($polygon_pos_arr, 'DF', array('all' => $time_marker_style), $color_array);
	}


	public function draw_meeting_agendar_header($meeting_agenda_obj){

		$link_banner_img = $this->service_root_path . "/images/MaroonandYellowBanner.jpg";

		// draw jpeg image to be clipped
		$this->pdf->Image(
		    // * @param $file (string) Name of the file containing the image or a '@' character followed by the image data string. To link an image without embedding it on the document, set an asterisk character before the URL (i.e.: '*http://www.example.com/image.jpg').
		    $link_banner_img
		    // * @param $x (float) Abscissa of the upper-left corner (LTR) or upper-right corner (RTL).
		    ,0
		    // * @param $y (float) Ordinate of the upper-left corner (LTR) or upper-right corner (RTL).
		    ,0
		    // * @param $w (float) Width of the image in the page. If not specified or equal to zero, it is automatically calculated.
		    ,210
		    // * @param $h (float) Height of the image in the page. If not specified or equal to zero, it is automatically calculated.
		    ,0
		    // * @param $type (string) Image format. Possible values are (case insensitive): JPEG and PNG (whitout GD library) and all images supported by GD: GD, GD2, GD2PART, GIF, JPEG, PNG, BMP, XBM, XPM;. If not specified, the type is inferred from the file extension.
		    ,'JPEG'
		    // * @param $link (mixed) URL or identifier returned by AddLink().
		    ,'http://bdtm.cafe24.com'
		    // * @param $align (string) Indicates the alignment of the pointer next to image insertion relative to image height. The value can be:<ul><li>T: top-right for LTR or top-left for RTL</li><li>M: middle-right for LTR or middle-left for RTL</li><li>B: bottom-right for LTR or bottom-left for RTL</li><li>N: next line</li></ul>
		    ,''
		    // * @param $resize (mixed) If true resize (reduce) the image to fit $w and $h (requires GD or ImageMagick library); if false do not resize; if 2 force resize in all cases (upscaling and downscaling).
		    ,true
		    // * @param $dpi (int) dot-per-inch resolution used on resize
		    ,300
		    // * @param $palign (string) Allows to center or align the image on the current line. Possible values are:<ul><li>L : left align</li><li>C : center</li><li>R : right align</li><li>'' : empty string : left for LTR or right for RTL</li></ul>
		    // * @param $ismask (boolean) true if this image is a mask, false otherwise
		    // * @param $imgmask (mixed) image object returned by this function or false
		    // * @param $border (mixed) Indicates if borders must be drawn around the cell. The value can be a number:<ul><li>0: no border (default)</li><li>1: frame</li></ul> or a string containing some or all of the following characters (in any order):<ul><li>L: left</li><li>T: top</li><li>R: right</li><li>B: bottom</li></ul> or an array of line styles for each border group - for example: array('LTRB' => array('width' => 2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)))
		    // * @param $fitbox (mixed) If not false scale image dimensions proportionally to fit within the ($w, $h) box. $fitbox can be true or a 2 characters string indicating the image alignment inside the box. The first character indicate the horizontal alignment (L = left, C = center, R = right) the second character indicate the vertical algnment (T = top, M = middle, B = bottom).
		    // * @param $hidden (boolean) If true do not display the image.
		    // * @param $fitonpage (boolean) If true the image is resized to not exceed page dimensions.
		    // * @param $alt (boolean) If true the image will be added as alternative and not directly printed (the ID of the image will be returned).
		    // * @param $altimgs (array) Array of alternate images IDs. Each alternative image must be an array with two values: an integer representing the image ID (the value returned by the Image method) and a boolean value to indicate if the image is the default for printing.
		    // * @return image information
		);

		// http://www.tcpdf.org/examples/example_006.phps


		// set text shadow effect on
		$this->pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>0.5, 'depth_h'=>0.5, 'color'=>array(73,17,17), 'opacity'=>0.8, 'blend_mode'=>'Normal'));
		// 1. Meeting Agenda Round
		$meeting_agenda_round = -1;
		if(!is_null($meeting_agenda_obj)){
		    $meeting_agenda_round = $meeting_agenda_obj->__round;
		}
		if($meeting_agenda_round == 1) {
			$round_desc = "First";
		} else if($meeting_agenda_round == 2) {
			$round_desc = "Second";
		} else if($meeting_agenda_round == 3) {
			$round_desc = "Third";
		} else {
			$round_desc = $meeting_agenda_round . "th";	
		}
$tbl = <<<EOD
<table cellspacing="0" cellpadding="0" border="0">
    <tr style="text-align:center;">
        <td>
            <b><span color="#FFFFFF" style="font-size:x-large;">The $round_desc $meeting_agenda_obj->__membership_desc Meeting</span></b>
        </td>
    </tr>
</table>    
EOD;
		$this->pdf->writeHTMLCell(
		//@param $w (float) Cell width. If 0, the cell extends up to the right margin.
		    150
		//@param $h (float) Cell minimum height. The cell extends automatically if needed.
		    ,0
		//@param $x (float) upper-left corner X coordinate
		    ,55
		//@param $y (float) upper-left corner Y coordinate
		    ,4
		//@param $html (string) html text to print. Default value: empty string.
		    ,$tbl
		//@param $border (mixed) Indicates if borders must be drawn around the cell. 
		//The value can be a number:<ul><li>0: no border (default)</li><li>1: frame</li></ul> or a string containing some or all of the following characters (in any order):
		//<ul><li>L: left</li><li>T: top</li><li>R: right</li><li>B: bottom</li></ul> or an array of line styles for each border group - 
		//for example: array('LTRB' => array('width' => 2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)))
		    ,0
		);
		// set text shadow effect off
		$this->pdf->setTextShadow();





		// set text shadow effect on
		$this->pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>0.3, 'depth_h'=>0.3, 'color'=>array(73,17,17), 'opacity'=>0.8, 'blend_mode'=>'Normal'));
		// 2. Mission of ToastMaster
$tbl = <<<EOD
<table cellspacing="0" cellpadding="0" border="0">
    <tr style="text-align:center;">
        <td>
            <span color="#E0E0E0" style="font-size:x-small;">
<br/>"We provide a supportive and positive learning experience in which members are empowered<br/>
to develop communication and leadership skills, resulting in greater self-confidence and personal growth."
            </span>
        </td>
    </tr>
</table>    
EOD;
		$this->pdf->writeHTMLCell(
		//@param $w (float) Cell width. If 0, the cell extends up to the right margin.
		    150
		//@param $h (float) Cell minimum height. The cell extends automatically if needed.
		    ,0
		//@param $x (float) upper-left corner X coordinate
		    ,55
		//@param $y (float) upper-left corner Y coordinate
		    ,11
		//@param $html (string) html text to print. Default value: empty string.
		    ,$tbl
		//@param $border (mixed) Indicates if borders must be drawn around the cell. The value can be a number:<ul><li>0: no border (default)</li><li>1: frame</li></ul> or a string containing some or all of the following characters (in any order):<ul><li>L: left</li><li>T: top</li><li>R: right</li><li>B: bottom</li></ul> or an array of line styles for each border group - for example: array('LTRB' => array('width' => 2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)))
		    ,0
		);
		// set text shadow effect off
		$this->pdf->setTextShadow();




		    // Theme : <span>How healthy are you?</span>

		    //                 </td>
		    //                 <td>

		    // Date : <span>May.22.2014</span>




		// 3-1. Theme
		$meeting_agenda_theme = "";
		if(!is_null($meeting_agenda_obj)){
		    $meeting_agenda_theme = $meeting_agenda_obj->__theme;
		}
$tbl = <<<EOD
<span color="#A8A8A8" style="font-size:small;">Theme :</span>
<b><span color="#336699" style="font-size:small;">$meeting_agenda_theme</span></b>
EOD;
		$this->pdf->writeHTMLCell(
		//@param $w (float) Cell width. If 0, the cell extends up to the right margin.
		    150
		//@param $h (float) Cell minimum height. The cell extends automatically if needed.
		    ,0
		//@param $x (float) upper-left corner X coordinate
		    ,58
		//@param $y (float) upper-left corner Y coordinate
		    ,29
		//@param $html (string) html text to print. Default value: empty string.
		    ,$tbl
		//@param $border (mixed) Indicates if borders must be drawn around the cell. The value can be a number:<ul><li>0: no border (default)</li><li>1: frame</li></ul> or a string containing some or all of the following characters (in any order):<ul><li>L: left</li><li>T: top</li><li>R: right</li><li>B: bottom</li></ul> or an array of line styles for each border group - for example: array('LTRB' => array('width' => 2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)))
		    ,0
		);


		// 3-2. Date
		$meeting_agenda_date = "";
		if(!is_null($meeting_agenda_obj)){
		    $meeting_agenda_date = $meeting_agenda_obj->__startdttm;
		}
		if(!empty($meeting_agenda_date)){
		    // 20140724000000 --> 2014-07-24
		    $meeting_agenda_date = date_format(date_create($meeting_agenda_date), 'Y-m-d');
		}

$tbl = <<<EOD
<span color="#A8A8A8" style="font-size:small;">Date :</span>
<b><span color="#336699" style="font-size:small;">$meeting_agenda_date</span></b>
EOD;
		$this->pdf->writeHTMLCell(
		//@param $w (float) Cell width. If 0, the cell extends up to the right margin.
		    150
		//@param $h (float) Cell minimum height. The cell extends automatically if needed.
		    ,0
		//@param $x (float) upper-left corner X coordinate
		    ,166
		//@param $y (float) upper-left corner Y coordinate
		    ,29
		//@param $html (string) html text to print. Default value: empty string.
		    ,$tbl
		//@param $border (mixed) Indicates if borders must be drawn around the cell. The value can be a number:<ul><li>0: no border (default)</li><li>1: frame</li></ul> or a string containing some or all of the following characters (in any order):<ul><li>L: left</li><li>T: top</li><li>R: right</li><li>B: bottom</li></ul> or an array of line styles for each border group - for example: array('LTRB' => array('width' => 2, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)))
		    ,0
		);		
	}













	//  dMMMMMMP dMP dMMMMMMMMb dMMMMMP        .aMMMMP dMP dMP dMP dMMMMb  dMMMMMP         dMP     dMP dMMMMb  dMMMMMP 
	//    dMP   amr dMP"dMP"dMPdMP            dMP"    dMP dMP amr dMP VMP dMP             dMP     amr dMP dMP dMP      
	//   dMP   dMP dMP dMP dMPdMMMP          dMP MMP"dMP dMP dMP dMP dMP dMMMP           dMP     dMP dMP dMP dMMMP     
	//  dMP   dMP dMP dMP dMPdMP            dMP.dMP dMP.aMP dMP dMP.aMP dMP             dMP     dMP dMP dMP dMP        
	// dMP   dMP dMP dMP dMPdMMMMMP         VMMMP"  VMMMP" dMP dMMMMP" dMMMMMP         dMMMMMP dMP dMP dMP dMMMMMP  

	// *time guide line -  simple table version
	public function draw_toast_master_time_guide_line_simple_table($element_set_title, $element_set_x_pos, $element_set_y_pos, $element_set_width, $font_type=null) {

		$caller_name = "draw_toast_master_time_guide_line_simple_table<br/>";
		if(empty($element_set_title)){
			echo "TCPDFManager\t$caller_name\t\$element_set_title is empty!";
			return;
		}
		if(!($element_set_x_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_x_pos is not valid!";
			return;
		}
		if(!($element_set_y_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_y_pos is not valid!";
			return;
		}
		if(!($element_set_width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_width is not valid!";
			return;
		}

		$element_set = new TCPDFElementSet($element_set_title, $element_set_x_pos, $element_set_y_pos, $element_set_width);

		$toastmaster_officer_list = $this->get_card_board_info_from_time_guide_line();

		$depth=0;

		// font_type
		$font_size = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE;
		if(!is_null($font_type) && strcmp(TCPDFElement::$FONT_SIZE_LARGE,$font_type) == 0) {
			$font_size = TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE_HUGE;
		}

		// 1. draw element set title
		$is_first = true;
		$is_bold = true;
		// 엘리먼트 셋의 타이틀을 나타내는 엘리먼트를 작성합니다.
		// CREATE ELEMENT TITLE PROP
		$element_prop_title = 
		TCPDFElement::GET_ELEMENT_PROP(
			$this->pdf
			// element type
			, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
			// element_name
			, "element_title_" . $idx
			// text
			, $element_set_title
			// text_color_arr
			, TCPDFElement::$COLOR_WHITE_ARR
			// text_size
			, $font_size
			// cell_x_pos
			, $element_set_x_pos
			// cell_y_pos
			, $element_set->get_element_set_bottom_y_pos()
			// cell_width
			, $element_set_width
			// cell_height
			, -1
			// cell_color_arr
			, TCPDFElement::$COLOR_DARK_GRAY_ARR
			, $depth
			// is_first
			, true
			// is_last
			, false
			// is_bold
			, true
			// text_align
			, TCPDFElement::$TEXT_ALIGN_CENTER
			// caller_name
			, $caller_name
		);
		$element_prop_title->draw();
		$element_set->add_element($element_prop_title);








		// CREATE TABLE FIELD ELEMENT PROP
		// font_type
		$font_size = TCPDFElement::$SIMPLE_TABLE_TITLE_MIDIUM_FONT_SIZE;
		if(!is_null($font_type) && strcmp(TCPDFElement::$FONT_SIZE_LARGE,$font_type) == 0) {
			$font_size = TCPDFElement::$SIMPLE_TABLE_TITLE_FONT_SIZE_LARGE;
		}
		$element_prop_simple_table_field_dummy = 
		TCPDFElement::GET_ELEMENT_PROP(
			$this->pdf
			// element type
			, TCPDFElement::$ELEMENT_TYPE_TABLE_FIELD
			// element_name
			, "simple_table_field"
			// text
			, "dummy"
			// text_color_arr
			, TCPDFElement::$COLOR_DARK_GRAY_ARR
			// text_size
			, $font_size
			// cell_x_pos
			, 0
			// cell_y_pos
			, 0
			// cell_width / 테이블의 전체 너비를 조정해야 하므로 입력하지 않습니다.
			, -1
			// cell_height / 테이블의 전체 높이를 조정해야 하므로 입력하지 않습니다.
			, -1
			// cell_color_arr
			, TCPDFElement::$COLOR_WARM_GRAY_ARR
			// depth
			, 0
			// is_first
			, false
			// is_last
			, false
			// is_bold
			, false
			// text_align
			, TCPDFElement::$TEXT_ALIGN_LEFT
			// caller_name
			, $caller_name
		);

		// Simple Table Set for title
		$simple_table_width = $element_set_width;
		$element_set_simple_table_for_title = 
		new TCPDFElementSet(
			$element_set_title
			, $element_set->get_element_set_x_pos()
			, $element_set->get_element_set_bottom_y_pos()
			, $simple_table_width
		);
		// CREATE TABLE FIELD
		$column_names = array("qualified_min", "green", "yellow", "red", "qualified_max");
		// DRAW TABLE TITLE
		for ($column_idx = 0; $column_idx < count($column_names); $column_idx++) {
			$element_prop_simple_table_title_field = $element_prop_simple_table_field_dummy->clone_element();

			$cur_column_name = $column_names[$column_idx];

			$cur_key = "";
			$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
			$cur_bg_color = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
			if($cur_column_name == "qualified_min") {
				$cur_key = "MIN";
				$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
				$cur_bg_color = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
			} else if($cur_column_name == "green") {
				$cur_key = "GREEN";
				$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
				$cur_bg_color = TCPDFElement::$COLOR_EMERALD_GREEN_ARR;
			} else if($cur_column_name == "yellow") {
				$cur_key = "YELLOW";
				$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
				$cur_bg_color = TCPDFElement::$COLOR_CREAM_YELLOW_ARR;
			} else if($cur_column_name == "red") {
				$cur_key = "RED";
				$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
				$cur_bg_color = TCPDFElement::$COLOR_WINE_RED_ARR;
			} else if($cur_column_name == "qualified_max") {
				$cur_key = "MAX";
				$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
				$cur_bg_color = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
			}

			$element_prop_simple_table_title_field->set_raw_text($cur_key);
			$element_prop_simple_table_title_field->set_text_color_arr($cur_text_color);
			$element_prop_simple_table_title_field->set_cell_color_arr($cur_bg_color);
			$element_prop_simple_table_title_field->set_is_bold(true);
			$element_set_simple_table_for_title->add_table_element(0, $column_idx, $element_prop_simple_table_title_field);
		}
		$element_set_simple_table_for_title->draw_table();

		// TABLE BG CELL
		$element_prop_simple_table_bg_cell = $element_prop_simple_table_field_dummy->clone_element();
		$element_prop_simple_table_bg_cell->set_cell_x_pos($element_set_simple_table_for_title->get_element_set_x_pos());
		$element_prop_simple_table_bg_cell->set_cell_y_pos($element_set_simple_table_for_title->get_element_set_y_pos());
		$element_prop_simple_table_bg_cell->set_cell_width($element_set_simple_table_for_title->get_element_set_width());
		$element_prop_simple_table_bg_cell->set_cell_height($element_set_simple_table_for_title->get_element_set_height());

		$element_set->add_element($element_prop_simple_table_bg_cell);



		
		for ($idx = 0; $idx < count($toastmaster_officer_list); $idx++) {
			$toastmaster_officer_obj = $toastmaster_officer_list[$idx];

			// role을 가져옵니다.
			$cur_role = $toastmaster_officer_obj->role;

			// clone element for roles.
			$cur_element_set_bottom_y_pos = $element_set->get_element_set_bottom_y_pos();
			$element_prop_row_role = $element_prop_simple_table_field_dummy->clone_element();
			$element_prop_row_role->set_cell_x_pos($element_set_simple_table_for_title->get_element_set_x_pos());
			$element_prop_row_role->set_cell_y_pos($cur_element_set_bottom_y_pos);
			$element_prop_row_role->set_cell_width($element_set_simple_table_for_title->get_element_set_width());
			$element_prop_row_role->set_cell_height($element_set_simple_table_for_title->get_element_set_height());
			$element_prop_row_role->set_cell_color_arr(TCPDFElement::$COLOR_WARM_GRAY_ARR);
			$element_prop_row_role->set_text_color_arr(TCPDFElement::$COLOR_DARK_GRAY_ARR);
			$element_prop_row_role->set_is_bold(true);
			$element_prop_row_role->updateTextProps($cur_role);
			$element_prop_row_role->draw();

			$element_set->add_element($element_prop_row_role);

			// element set for table row
			$element_set_simple_table_row = 
			new TCPDFElementSet(
				"time_guide_line_row_" . $idx
				, $element_set->get_element_set_x_pos()
				, $element_set->get_element_set_bottom_y_pos()
				, $simple_table_width
			);
			for ($column_idx = 0; $column_idx < count($column_names); $column_idx++) {
				$cur_column_name = $column_names[$column_idx];

				// set column color	
				// "qualified_min", "green", "yellow", "red", "qualified_max"
				$cur_key = "";
				$cur_value = "";
				$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
				$cur_bg_color = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
				if($cur_column_name == "qualified_min") {
					$cur_key = "MIN";
					$cur_value = $toastmaster_officer_obj->qualified_min;
					$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
					$cur_bg_color = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
				} else if($cur_column_name == "green") {
					$cur_key = "GREEN";
					$cur_value = $toastmaster_officer_obj->green;
					$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
					$cur_bg_color = TCPDFElement::$COLOR_EMERALD_GREEN_ARR;
				} else if($cur_column_name == "yellow") {
					$cur_key = "YELLOW";
					$cur_value = $toastmaster_officer_obj->yellow;
					$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
					$cur_bg_color = TCPDFElement::$COLOR_CREAM_YELLOW_ARR;
				} else if($cur_column_name == "red") {
					$cur_key = "RED";
					$cur_value = $toastmaster_officer_obj->red;
					$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
					$cur_bg_color = TCPDFElement::$COLOR_WINE_RED_ARR;
				} else if($cur_column_name == "qualified_max") {
					$cur_key = "MAX";
					$cur_value = $toastmaster_officer_obj->qualified_max;
					$cur_text_color = TCPDFElement::$COLOR_DARK_GRAY_ARR;
					$cur_bg_color = TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR;
				}
				$cur_value = $this->getTimeFormat_MM_SS_Str($cur_value);

				// clone element for roles.
				$cur_element_set_bottom_y_pos = $element_set->get_element_set_bottom_y_pos();
				$element_prop_table_field = $element_prop_simple_table_field_dummy->clone_element();
				$element_prop_table_field->set_cell_x_pos($element_set_simple_table_for_title->get_element_set_x_pos());
				$element_prop_table_field->set_cell_y_pos($cur_element_set_bottom_y_pos);
				$element_prop_table_field->set_cell_width($element_set_simple_table_for_title->get_element_set_width());
				$element_prop_table_field->set_cell_height($element_set_simple_table_for_title->get_element_set_height());
				$element_prop_table_field->set_text_color_arr($cur_text_color);
				$element_prop_table_field->set_cell_color_arr($cur_bg_color);
				$element_prop_table_field->set_is_bold(true);
				// $element_prop_table_field->updateTextProps($cur_value);
				$element_prop_table_field->set_raw_text($cur_value);

				$cur_cell_height = $element_prop_table_field->get_cell_height();
				$element_set_simple_table_row->add_table_element(0, $column_idx, $element_prop_table_field);

			} // inner for end
			$element_set_simple_table_row->draw_table();

			// REFACTOR ME - 반복되고 있습니다.
			// TABLE BG CELL
			$element_prop_simple_table_bg_cell = $element_prop_simple_table_field_dummy->clone_element();
			$element_prop_simple_table_bg_cell->set_cell_x_pos($element_set_simple_table_row->get_element_set_x_pos());
			$element_prop_simple_table_bg_cell->set_cell_y_pos($element_set_simple_table_row->get_element_set_y_pos());
			$element_prop_simple_table_bg_cell->set_cell_width($element_set_simple_table_row->get_element_set_width());
			$element_prop_simple_table_bg_cell->set_cell_height($element_set_simple_table_row->get_element_set_height());

			$element_set->add_element($element_prop_simple_table_bg_cell);
		} // outer for end

		// tail
		$cur_element_set_bottom_y_pos = $element_set->get_element_set_bottom_y_pos();
		$element_prop_tail = 
		TCPDFElement::GET_ELEMENT_PROP(
			$this->pdf
			// element type
			, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
			// element_name
			, "element_tail"
			// text
			, " "
			// text_color_arr
			, TCPDFElement::$COLOR_DARK_GRAY_ARR
			// text_size
			, TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE
			// cell_x_pos
			, $element_set_x_pos
			// cell_y_pos
			, $element_set->get_element_set_bottom_y_pos()
			// cell_width
			, $element_set_width
			// cell_height
			, -1
			// cell_color_arr
			, TCPDFElement::$COLOR_DARK_GRAY_ARR
			, $depth
			// is_first
			, false
			// is_last
			, true
			// is_bold
			, true
			// text_align
			, TCPDFElement::$TEXT_ALIGN_CENTER
			// caller_name
			, $caller_name
		);
		$element_prop_tail->draw();
		$element_set->add_element($element_prop_tail);

		return $element_set;
	}

	// *time guide line -  chart version
	public function draw_toast_master_time_guide_line($element_set_title, $element_set_x_pos, $element_set_y_pos, $element_set_width) {
		
		$caller_name = "draw_toast_master_time_guide_line<br/>";
		if(empty($element_set_title)){
			echo "TCPDFManager\t$caller_name\t\$element_set_title is empty!";
			return;
		}
		if(!($element_set_x_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_x_pos is not valid!";
			return;
		}
		if(!($element_set_y_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_y_pos is not valid!";
			return;
		}
		if(!($element_set_width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$element_set_width is not valid!";
			return;
		}

		$element_set = new TCPDFElementSet($element_set_title, $element_set_x_pos, $element_set_y_pos, $element_set_width);

		$toastmaster_officer_list = $this->get_card_board_info_from_time_guide_line();

		$depth=0;

		// 1. draw element set title
		$is_first = true;
		$is_bold = true;
		// 엘리먼트 셋의 타이틀을 나타내는 엘리먼트를 작성합니다.
		$element_prop_title = 
		TCPDFElement::GET_ELEMENT_PROP(
			$this->pdf
			// element type
			, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
			// element_name
			, "element_title_" . $idx
			// text
			, $element_set_title
			// text_color_arr
			, TCPDFElement::$COLOR_DARK_GRAY_ARR
			// text_size
			, TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE
			// cell_x_pos
			, $element_set_x_pos
			// cell_y_pos
			, $element_set->get_element_set_bottom_y_pos()
			// cell_width
			, $element_set_width
			// cell_height
			, -1
			// cell_color_arr
			, TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR
			, $depth
			// is_first
			, true
			// is_last
			, false
			// is_bold
			, true
			// text_align
			, TCPDFElement::$TEXT_ALIGN_CENTER
			// caller_name
			, $caller_name
		);
		$element_prop_title->draw();
		$element_set->add_element($element_prop_title);

		$prev_element_prop_key;
		$prev_element_prop_value;
		for ($idx = 0; $idx < count($toastmaster_officer_list); $idx++) {
			$toastmaster_officer_obj = $toastmaster_officer_list[$idx];
			$key = $toastmaster_officer_obj->role;

			// Element Property를 만듭니다.
			$element_prop_key = 
			TCPDFElement::GET_ELEMENT_PROP(
				$this->pdf
				// element type
				, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY
				// element_name
				, "time_guide_line_title_" . $idx
				// text
				, $key
				// text_color_arr
				, TCPDFElement::$COLOR_DARK_GRAY_ARR
				// text_size
				, TCPDFElement::$CARD_BOARD_TITLE_FONT_SIZE
				// cell_x_pos
				, $element_set_x_pos
				// cell_y_pos
				, $element_set->get_element_set_bottom_y_pos()
				// cell_width
				, $element_set_width
				// cell_height
				, -1
				// cell_color_arr
				, TCPDFElement::$COLOR_MILK_GRAY_ARR
				, $depth
				// is_first
				, false
				// is_last
				, false
				// is_bold
				, true
				// text_align
				, TCPDFElement::$TEXT_ALIGN_LEFT
				// caller_name
				, $caller_name
			);
			$element_prop_key->draw();
			$element_set->add_element($element_prop_key);

			$prev_element_prop_key=$element_prop_key;

			// Element Property를 만듭니다.
			$element_prop_value = 
			TCPDFElement::GET_ELEMENT_PROP(
				$this->pdf
				// element type
				, TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_EMPTY
				// element_name
				, "time_guide_line_empty_" . $idx
				// text
				, ""
				// text_color_arr
				, TCPDFElement::$COLOR_DARK_GRAY_ARR
				// text_size
				, $CARD_BOARD_CONTENT_FONT_SIZE
				//, TCPDFElement::$CARD_BOARD_CONTENT_FONT_SIZE
				// cell_x_pos
				, $element_set_x_pos
				// cell_y_pos
				, $element_set->get_element_set_bottom_y_pos()
				// cell_width
				, $element_set_width
				// cell_height
				, 6
				// cell_color_arr
				, TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR
				, $depth
				// is_first
				, false
				// is_last
				, false
				// is_bold
				, false
				// text_align
				, TCPDFElement::$TEXT_ALIGN_LEFT
				// caller_name
				, $caller_name
			);
			$element_prop_value->draw();
			$element_set->add_element($element_prop_value);

			

			$prev_element_prop_value=$element_prop_value;

			// time guide line marker를 그립니다.
			if($toastmaster_officer_obj->role == "Debater") {

				$this->draw_timeline_time_guide_marker_for_debater(
					// x pos
					$element_prop_value->get_cell_x_pos()
					// y pos
					, $element_prop_value->get_cell_y_pos()
					// height
					, $element_prop_value->get_cell_height()
					// width
					, $element_prop_value->get_cell_width()
				);

			} else {

				$this->draw_timeline_time_guide_marker(
					// x pos
					$element_prop_value->get_cell_x_pos()
					// y pos
					, $element_prop_value->get_cell_y_pos()
					// height
					, $element_prop_value->get_cell_height()
					// width
					, $element_prop_value->get_cell_width()
				);

			}

			// time guide line marker 위에 시간 정보를 표시합니다.
			// Element Property를 만듭니다.
			$time_guide_line_width = ROUND(($element_set_width / 5),2);
			$time_guide_line_text = $this->getTimeFormat_MM_SS_Str($toastmaster_officer_obj->qualified_min);

			$element_prop_time_guide_line_qualified_min = 
			TCPDFElement::GET_ELEMENT_PROP(
				$this->pdf
				// element type
				, TCPDFElement::$ELEMENT_TYPE_TEXT_ONLY
				// element_name
				, "time_guide_line_qualified_min"
				// text
				, $time_guide_line_text
				// text_color_arr
				, TCPDFElement::$COLOR_WHITE_ARR
				// text_size
				, TCPDFElement::$CARD_BOARD_CONTENT_FONT_SIZE - 1
				// cell_x_pos
				, $element_set_x_pos
				// cell_y_pos
				, $element_prop_value->get_cell_y_pos()
				// cell_width
				, $time_guide_line_width
				// cell_height
				, $element_prop_value->get_cell_height()
				// cell_color_arr
				, TCPDFElement::$COLOR_TINT_WARM_GRAY_ARR
				// depth
				, $depth
				// is_first
				, false
				// is_last
				, false
				// is_bold
				, false
				// text_align
				, TCPDFElement::$TEXT_ALIGN_CENTER
				// caller_name
				, $caller_name
			);
			// 외부의 높이에 맞추어 텍스트 y pos을 업데이트.
			$element_prop_time_guide_line_qualified_min->updateTextProps(null,0,$element_prop_value->get_cell_height());
			$element_prop_time_guide_line_qualified_min->draw();

			if($toastmaster_officer_obj->role == "Debater") {

				// GREEN - CLAPPING
				$time_guide_line_text = $this->getTimeFormat_MM_SS_Str($toastmaster_officer_obj->green);
				$element_prop_time_guide_line_green = $element_prop_time_guide_line_qualified_min->clone_element();
				$element_prop_time_guide_line_green->set_cell_width($element_prop_value->get_cell_width() - $time_guide_line_width);
				$element_prop_time_guide_line_green->set_cell_x_pos_offset($time_guide_line_width);
				$element_prop_time_guide_line_green->updateTextProps("Clapping",0,$element_prop_value->get_cell_height());
				$element_prop_time_guide_line_green->draw();

			} else {

				// GREEN
				$time_guide_line_text = $this->getTimeFormat_MM_SS_Str($toastmaster_officer_obj->green);
				$element_prop_time_guide_line_green = $element_prop_time_guide_line_qualified_min->clone_element();
				$element_prop_time_guide_line_green->set_cell_x_pos_offset($time_guide_line_width);
				$element_prop_time_guide_line_green->updateTextProps($time_guide_line_text,0,$element_prop_value->get_cell_height());
				$element_prop_time_guide_line_green->draw();

				// YELLOW
				$time_guide_line_text = $this->getTimeFormat_MM_SS_Str($toastmaster_officer_obj->yellow);
				$element_prop_time_guide_line_yellow = $element_prop_time_guide_line_green->clone_element();
				$element_prop_time_guide_line_yellow->set_cell_x_pos_offset($time_guide_line_width);
				$element_prop_time_guide_line_yellow->updateTextProps($time_guide_line_text,0,$element_prop_value->get_cell_height());
				$element_prop_time_guide_line_yellow->draw();

				// RED
				$time_guide_line_text = $this->getTimeFormat_MM_SS_Str($toastmaster_officer_obj->red);
				$element_prop_time_guide_line_red = $element_prop_time_guide_line_yellow->clone_element();
				$element_prop_time_guide_line_red->set_cell_x_pos_offset($time_guide_line_width);
				$element_prop_time_guide_line_red->updateTextProps($time_guide_line_text,0,$element_prop_value->get_cell_height());
				$element_prop_time_guide_line_red->draw();

				// QUALIFIED MAX
				$time_guide_line_text = $this->getTimeFormat_MM_SS_Str($toastmaster_officer_obj->qualified_max);
				$element_prop_time_guide_line_q_max = $element_prop_time_guide_line_red->clone_element();
				$element_prop_time_guide_line_q_max->set_cell_x_pos_offset($time_guide_line_width);
				$element_prop_time_guide_line_q_max->updateTextProps($time_guide_line_text,0,$element_prop_value->get_cell_height());
				$element_prop_time_guide_line_q_max->draw();

			}
		}

		// 각 색상의 설명 열을 그려줍니다.
		$comments = array(
			// comment_on_gray
			"Minumum & maximum time for qualifying"
			// comment_on_green
			, "Adequate time ( show green card )"
			// comment_on_yellow
			, "Wrap up your speech ( show yellow card )"
			// comment_on_red
			, "Finish speech immeditely ( show red card )"
		);

		$element_prop_key = $prev_element_prop_key->clone_element();
		$element_prop_key->set_cell_y_pos($element_set->get_element_set_bottom_y_pos());
		$element_prop_key->updateTextProps("What colors stand for?");
		$element_prop_key->draw();
		$element_set->add_element($element_prop_key);

		for ($idx = 0; $idx < count($comments); $idx++) {

			$cur_comment = $comments[$idx];
			if($idx == 0) {
				// comment_on_gray
				$marker_color = TCPDFElement::$COLOR_WARM_GRAY_ARR;
			} else if($idx == 1) {
				// comment_on_green
				$marker_color = TCPDFElement::$COLOR_EMERALD_GREEN_ARR;
			} else if($idx == 2) {
				// comment_on_yellow
				$marker_color = TCPDFElement::$COLOR_CREAM_YELLOW_ARR;
			} else if($idx == 3) {
				// comment_on_red
				$marker_color = TCPDFElement::$COLOR_MAGENTA_ARR;
			}

			$element_prop_value = $prev_element_prop_value->clone_element();
			
			$element_prop_value->set_cell_y_pos($element_set->get_element_set_bottom_y_pos());
			$element_prop_value->set_text_color_arr(TCPDFElement::$COLOR_WHITE_ARR);
			$element_prop_value->set_cell_color_arr($marker_color);
			$element_prop_value->set_element_type(TCPDFElement::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_VALUE);
			if( ($idx == (count($comments) - 1)) ) {
				$element_prop_value->set_is_last(true);
				$element_prop_value->set_cell_border_round_rect_round_corner(TCPDFElement::$CARD_BOARD_ROUND_RECT_ROUND_CORNER_TAIL);
			}
			$element_prop_value->updateTextProps($cur_comment);
			$element_prop_value->draw();
			$element_set->add_element($element_prop_value);
		}

		return $element_set;
	}

	public function draw_timeline_time_guide_marker($x=80,$y=95.4,$height=4,$width=60){
		// 스피치 별 할당 시간을 표시합니다.
		// 캡슐 형태

		$time_guide_marker_width = $width/5;

		$time_guide_marker_x_pos = $x;
		$time_guide_marker_piece_width = $time_guide_marker_width;
		$height_half = intval(($height/2)*10)/10;


		// Most Right Side
		// Warm Gray / Qualified
		$time_marker_color = $this->color_warm_gray_arr;
		$time_guide_marker_x_pos = $x + $time_guide_marker_piece_width * 4;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);
		$this->pdf->Rect($time_guide_marker_x_pos, $y, $time_guide_marker_piece_width, $height, 'DF', $time_marker_style, $time_marker_color);
		


		// RED / too much
		$time_marker_color = $this->color_magenta_arr;
		$time_guide_marker_x_pos = $x + $time_guide_marker_piece_width * 3;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);
		$this->pdf->Rect($time_guide_marker_x_pos, $y, $time_guide_marker_piece_width, $height, 'DF', $time_marker_style, $time_marker_color);

		$polygon_pos_x = $x + $time_guide_marker_piece_width * 4;
		$this->draw_triangle($polygon_pos_x, $y, $height, $time_marker_color);
		


		// YELLOW / not enough
		$time_marker_color = $this->color_cream_yellow_arr;
		$time_guide_marker_x_pos = $x + $time_guide_marker_piece_width * 2;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);
		$this->pdf->Rect($time_guide_marker_x_pos, $y, $time_guide_marker_piece_width, $height, 'DF', $time_marker_style, $time_marker_color);

		$polygon_pos_x = $x + $time_guide_marker_piece_width * 3;
		$this->draw_triangle($polygon_pos_x, $y, $height, $time_marker_color);



		// GREEN / adequate
		$time_marker_color = $this->color_emerald_green_arr;
		$time_guide_marker_x_pos = $x + $time_guide_marker_piece_width;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);
		$this->pdf->Rect($time_guide_marker_x_pos, $y, $time_guide_marker_piece_width, $height, 'DF', $time_marker_style, $time_marker_color);

		$polygon_pos_x = $x + $time_guide_marker_piece_width * 2;
		$this->draw_triangle($polygon_pos_x, $y, $height, $time_marker_color);

		// Most Left
		// GRAY / Qualified
		$time_guide_marker_x_pos = $x;
		$time_marker_color = $this->color_warm_gray_arr;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);

		$this->pdf->Rect($time_guide_marker_x_pos, $y, $time_guide_marker_piece_width, $height, 'DF', $time_marker_style, $time_marker_color);

		$polygon_pos_x = $x + $time_guide_marker_piece_width;
		$this->draw_triangle($polygon_pos_x, $y, $height, $time_marker_color);
	}

	private function draw_timeline_time_guide_marker_for_debater($x=80,$y=95.4,$height=4,$width=60){
		// 스피치 별 할당 시간을 표시합니다.
		// 캡슐 형태

		$time_guide_marker_width = intval(($width/5)*10)/10;

		$time_guide_marker_x_pos = $x;
		$time_guide_marker_piece_width = $time_guide_marker_width;
		$height_half = intval(($height/2)*10)/10;


		// Most Right Side
		// GREEN / adequate
		$time_marker_color = $this->color_emerald_green_arr;
		$time_guide_marker_x_pos = $x + $time_guide_marker_piece_width;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);
		$this->pdf->Rect($time_guide_marker_x_pos, $y, $width - $time_guide_marker_piece_width, $height, 'DF', $time_marker_style, $time_marker_color);

		// Most Left
		// GRAY / Qualified
		$time_guide_marker_x_pos = $x;
		$time_marker_color = $this->color_warm_gray_arr;
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_color);

		$this->pdf->Rect($time_guide_marker_x_pos, $y, $time_guide_marker_piece_width, $height, 'DF', $time_marker_style, $time_marker_color);

		$polygon_pos_x = $x + $time_guide_marker_piece_width;
		$this->draw_triangle($polygon_pos_x, $y, $height, $time_marker_color);
	}	

	public function get_card_board_info_from_time_guide_line() {

		$wdj_key_value_arr=array();

		$time_guide_obj = new stdClass();
		$time_guide_obj->role="Table Topics";
		$time_guide_obj->qualified_min = 45;
		$time_guide_obj->green = 60;				// 1'	 / 60 * 1 = 60
		$time_guide_obj->yellow = 90;				// 1'30" / 60 * 1 + 30 = 90
		$time_guide_obj->red = 120;					// 2'00" / 60 * 2 = 120
		$time_guide_obj->qualified_max = 135; 		// 2'15" / 60 * 2 + 15 = 135
		array_push($wdj_key_value_arr, $time_guide_obj); 

		$time_guide_obj = new stdClass();
		$time_guide_obj->role="Ice Breaker";
		$time_guide_obj->qualified_min = 210;		// 3'30" / 60 * 3 + 30 = 210
		$time_guide_obj->green = 240;				// 4'	 / 60 * 4 = 240
		$time_guide_obj->yellow = 300;				// 5' 	 / 60 * 5 = 300
		$time_guide_obj->red = 360;					// 6' 	 / 60 * 6 = 360
		$time_guide_obj->qualified_max = 390; 		// 6'30" / 60 * 6 + 30 = 390
		array_push($wdj_key_value_arr, $time_guide_obj); 

		$time_guide_obj = new stdClass();
		$time_guide_obj->role="Speaker";
		$time_guide_obj->qualified_min = 270;		// 4'30" / 60 * 4 + 30 = 270
		$time_guide_obj->green = 300;				// 5'	 / 60 * 5 = 300
		$time_guide_obj->yellow = 360;				// 6' 	 / 60 * 6 = 360
		$time_guide_obj->red = 420;					// 7' 	 / 60 * 7 = 420
		$time_guide_obj->qualified_max = 450; 		// 7'30" / 60 * 7 + 30 = 450
		array_push($wdj_key_value_arr, $time_guide_obj); 

		$time_guide_obj = new stdClass();
		$time_guide_obj->role="Speaker(10th)";
		$time_guide_obj->qualified_min = 450;		// 7'30" / 60 * 7 + 30 = 450
		$time_guide_obj->green = 480;				// 8'	 / 60 * 8 = 480
		$time_guide_obj->yellow = 540;				// 9' 	 / 60 * 9 = 540
		$time_guide_obj->red = 600;					// 10' 	 / 60 * 10 = 600
		$time_guide_obj->qualified_max = 630; 		// 10'30" / 60 * 10 + 30 = 630
		array_push($wdj_key_value_arr, $time_guide_obj); 

		$time_guide_obj = new stdClass();
		$time_guide_obj->role="Evaluator";
		$time_guide_obj->qualified_min = 90;		// 1'30" / 60 * 1 + 30 = 90
		$time_guide_obj->green = 120;				// 2'	 / 60 * 2 = 120
		$time_guide_obj->yellow = 150;				// 2'30" / 60 * 2 + 30 = 150
		$time_guide_obj->red = 180;					// 3' 	 / 60 * 3 = 180
		$time_guide_obj->qualified_max = 210; 		// 3'30" / 60 * 3 + 30 = 210
		array_push($wdj_key_value_arr, $time_guide_obj); 

		$time_guide_obj = new stdClass();
		$time_guide_obj->role="Debater";
		$time_guide_obj->qualified_min = 60;		// 1' / 60 * 1 = 60
		$time_guide_obj->green = 60;				// 1' / 60 * 1 = 60
		$time_guide_obj->yellow = 60;				// 1' / 60 * 1 = 60
		$time_guide_obj->red = 60;					// 1' / 60 * 1 = 60
		$time_guide_obj->qualified_max = 60; 		// 1' / 60 * 1 = 60
		array_push($wdj_key_value_arr, $time_guide_obj); 

		return $wdj_key_value_arr;
	}

	private function getTimeFormat_MM_SS_Str($time_sec) {
		if(is_null($time_sec) || !($time_sec > 0)) {
			return "";
		}

		$cur_minutes = intval($time_sec/60);
		$cur_seconds = intval($time_sec%60);

		if( $cur_minutes > 0 && $cur_seconds > 0 ){
			return $cur_minutes . "m " . $cur_seconds . "s";
		} else if( $cur_minutes > 0 && $cur_seconds == 0 ){
			return $cur_minutes . "m ";
		} else {
			return $cur_seconds . "s";
		}

	}
































	// TODO 원형에서 화살표 마크로 변경할 것.
	// 한 객체로 그리지 않으면 위치가 어긋나 보이는 현상이 있음.
	public function draw_timeline_time_marker_V2($element_prop, $caller_name=""){

		$caller_name .= "draw_timeline_time_marker_V2<br/>";

		// $height = ROUND($element_prop->get_text_height() * 0.9, 1);
		$height = $element_prop->get_text_height();

		// DEBUG
		// $cur_text_height = $element_prop->get_text_height();
		// echo "\$cur_text_height :: $cur_text_height<br/>";
		// echo "\$height :: $height<br/><br/>";

		// update radius & height
		$radius = ROUND(($height/2),1);
		$height = $radius*2;
		$width = $element_prop->get_text_width() - $radius;
		$x = $element_prop->get_text_x_pos() + $radius;
		$y = $element_prop->get_text_y_pos();
		
		$color = $element_prop->get_cell_color_arr();
		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $color);

		$this->pdf->Rect($x, $y, $width, $height, 'DF', $time_marker_style, $color);
		$this->pdf->Circle($x + $width, $y + $radius, $radius, 0, 360, "F", array(), $color);
		$this->pdf->Circle($x, $y + $radius, $radius, 0, 360, "F", array(), $color);
	}	





	public function draw_timeline_time_marker($time_marker_prop, $caller_name=""){

		$caller_name .= "draw_timeline_time_marker<br/>";

		$x=$time_marker_prop->x_pos;
		$y=$time_marker_prop->y_pos;
		$height=$time_marker_prop->height;
		$width=$time_marker_prop->width;
		$radius= $time_marker_prop->radius;

		$time_marker_style = array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => $time_marker_prop->color);

		$this->pdf->Rect($x, $y, $width, $height, 'DF', $time_marker_style, $time_marker_prop->color);
		$this->pdf->Circle($x + $width, $y + $radius, $radius, 0, 360, "F", array(), $time_marker_prop->color);
		$this->pdf->Circle($x, $y + $radius, $radius, 0, 360, "F", array(), $time_marker_prop->color);

	}	








	// SAMPLE CODE
	public function create_simple_table($simple_table_row_arr, $x, $y, $width=50){

		$caller_name = "drawSimpleTable<br/>";
		if(empty($simple_table_row_arr)){
			echo "TCPDFManager\t$caller_name\t\$simple_table_row_arr is empty!";
			return;
		}
		if(!($x >= 0)){
			echo "TCPDFManager\t$caller_name\t\$x is not valid!";
			return;
		}
		if(!($y >= 0)){
			echo "TCPDFManager\t$caller_name\t\$y is not valid!";
			return;
		}
		if(!($width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$width is not valid!";
			return;
		}


		// tiny / normal / wide
		$simple_table_cell_prop_arr = $this->get_simple_table_cell_prop_arr(
			// simple_table_row_arr
			$simple_table_row_arr
			// parent_x_pos
			, $x
			// parent_width
			, $width
			// simple tabel x pos
			, $x
			// simple tabel y pos
			, $y
			// caller_name
			, $caller_name
		);
		$this->draw_simple_table($simple_table_cell_prop_arr);

	}
	private function get_simple_table_cell_prop_arr($simple_table_row_arr, $parent_x_pos, $parent_width, $x, $y, $caller_name){

		$caller_name .= "<br/>get_simple_table_cell_prop_arr";
		if(empty($simple_table_row_arr)){
			echo "TCPDFManager\t$caller_name\t\$simple_table_row_arr is empty!<br/>";
			return;
		}
		if(!($parent_x_pos >= 0)){
			echo "TCPDFManager\t$caller_name\t\$parent_x_pos is empty!<br/>";
			return;
		}
		if(!($parent_width >= 0)){
			echo "TCPDFManager\t$caller_name\t\$parent_width is empty!<br/>";
			return;
		}
		if(!($x >= 0)){
			echo "TCPDFManager\t$caller_name\t\$x is empty!<br/>";
			return;
		}
		if(!($y >= 0)){
			echo "TCPDFManager\t$caller_name\t\$y is empty!<br/>";
			return;
		}

		$column_width_arr = array();
		$max_cell_width = 0;
		$simple_table_cell_prop_arr = array();
		$simple_table_cell_prop_row_arr = array();

		// get table properties
		$table_prop = $this->get_table_width_n_height($simple_table_row_arr, $this->simple_table_padding, $caller_name);

		$next_x_pos = $x;
		$next_y_pos = $y;
		$max_table_width = intval(( $parent_x_pos + $parent_width ) - $next_x_pos) - 1;

		for ($idx = 0; $idx < count($simple_table_row_arr); $idx++) {
			$simple_table_row_column_arr = $simple_table_row_arr[$idx];
			if(empty($simple_table_row_column_arr)) continue;


			$simple_table_cell_prop_row_arr = array();
			$next_x_pos = $x;
			for ($inner_idx = 0; $inner_idx < count($simple_table_row_column_arr); $inner_idx++) {
				$simple_table_row_column_obj = $simple_table_row_column_arr[$inner_idx];

				// get position
				$is_title = ($simple_table_row_column_obj->is_title === true);

				$simple_table_cell_prop_obj=
				$this->get_simple_table_cell_prop_obj(
					$simple_table_row_column_obj
					, $table_prop
					, $next_x_pos
					, $next_y_pos
					, $this->text_align_left
					, $is_title
					, $caller_name
				);
				array_push($simple_table_cell_prop_row_arr,$simple_table_cell_prop_obj);
				$next_x_pos += $simple_table_cell_prop_obj->cell_width;

				$cur_cell_width = $simple_table_cell_prop_obj->cell_width;
				if($max_cell_width < $cur_cell_width){
					$max_cell_width = $cur_cell_width;
				}

			}
			$next_y_pos += $simple_table_cell_prop_obj->cell_height;

			array_push($simple_table_cell_prop_arr,$simple_table_cell_prop_row_arr);
		}

		// 너비를 각 컬럼별로 재설정
		$row_element_cnt = 0;
		if(count($simple_table_cell_prop_arr) > 0 && count($simple_table_cell_prop_arr[0]) > 0) {
			$row_element_cnt = count($simple_table_cell_prop_arr[0]);
		}
		$max_column_width_arr = array();
		$sum_max_column_width = 0;
		for ($idx = 0; $idx < $row_element_cnt; $idx++) {
			$max_column_width = 0;
			for ($inner_idx = 0; $inner_idx < count($simple_table_cell_prop_arr); $inner_idx++) {
				$simple_table_cell_prop_row_arr = $simple_table_cell_prop_arr[$inner_idx];

				$cur_field_prop = $simple_table_cell_prop_row_arr[$idx];

				// TODO
				$text_width = $this->get_text_width($cur_field_prop->text, $caller_name);
				// private function get_text_width_V2($text, $fontname='', $fontstyle='', $fontsize=0, $caller_name=""){

				$cur_column_width = $text_width + 2;
				if($max_column_width < $cur_column_width){
					$max_column_width = $cur_column_width;
				}
			}
			array_push($max_column_width_arr,$max_column_width);
			$sum_max_column_width += $max_column_width;
		}


		// update cell x position
		$next_x_pos = $x;
		$next_y_pos = $y;
		for ($idx = 0; $idx < count($simple_table_cell_prop_arr); $idx++) {
			$simple_table_cell_prop_row_arr = $simple_table_cell_prop_arr[$idx];

			if(empty($simple_table_cell_prop_row_arr)) continue;

			$next_x_pos = $x;
			for ($inner_idx = 0; $inner_idx < count($simple_table_cell_prop_row_arr); $inner_idx++) {
				$simple_table_cell_prop_obj = $simple_table_cell_prop_row_arr[$inner_idx];

				$cur_column_width = $max_table_width * ($max_column_width_arr[$inner_idx] / $sum_max_column_width);
				$cur_column_width = intval($cur_column_width * 100) / 100;

				// print_r($simple_table_cell_prop_obj);
				// echo "<br/>\$cur_column_width : $cur_column_width<br/>";
				// echo "<br/><br/>";

				$simple_table_cell_prop_obj->cell_width = $cur_column_width;
				$simple_table_cell_prop_obj->cell_x_pos = $next_x_pos;
				$simple_table_cell_prop_obj->x_pos = $next_x_pos;

				$next_x_pos += $simple_table_cell_prop_obj->cell_width;
			}
		}

		return $simple_table_cell_prop_arr; // $simple_table_cell_prop_arr / $simple_table_cell_prop_row_arr
	}
}

?>