<?php

class TCPDFElement{

	// TCPDFManager로 만들어지는 뷰 템플릿의 엘리먼트 클래스입니다.
	// 아래와 같은 기능을 갖습니다.

	// 1. 엘리먼트 생성 정보를 관리합니다.
	// 1-1. 엘리먼트에 들어가는 텍스트를 사전 폰트 세팅을 통해서 줄바꿈
	// 1-2. 엘리먼트의 폰트, 색상 제어
	// 1-3. 엘리먼트의 우측 정렬, 좌측 정렬, 가운데 정렬
	// 1-4. 엘리먼트의 상단, 하단 중단 정렬
	// 2. 엘리먼트끼리의 관계를 관리합니다.
	// 2-1. 엘리먼트 리스트
	// 2-1-1. 상-하 형제 관계 참조가 가능합니다.
	// 2-1-2. 리스트의 전체 너비,높이,위치를 가져올 수 있습니다.
	// 2-3. 

	private $pdf;
	public function TCPDFElement($pdf){

		$caller_name .= "<br/>tcpdf.element.inc->TCPDFElement constructor";
		if(is_null($pdf)){
			echo "$caller_name\t\$pdf is not valid!";
			return;
		}

		// 외부에서 문서가 생성되는 pdf 객체를 인자로 받습니다.
		$this->pdf = $pdf;
	}
	public function get_pdf() {
		return $this->pdf;
	}












	//     dMMMMb  .aMMMb  .aMMMMP dMMMMMP 
	//    dMP.dMP dMP"dMP dMP"    dMP      
	//   dMMMMP" dMMMMMP dMP MMP"dMMMP     
	//  dMP     dMP dMP dMP.dMP dMP        
	// dMP     dMP dMP  VMMMP" dMMMMMP     
                                    
	public function get_page_width() {
		return $this->pdf->getPageWidth();
	}

	public function get_page_height() {
		return $this->pdf->getPageHeight();	
	}










	//    .aMMMb  .aMMMb  dMP    .aMMMb  dMMMMb 
	//   dMP"VMP dMP"dMP dMP    dMP"dMP dMP.dMP 
	//  dMP     dMP dMP dMP    dMP dMP dMMMMK"  
	// dMP.aMP dMP.aMP dMP    dMP.aMP dMP"AMF   
	// VMMMP"  VMMMP" dMMMMMP VMMMP" dMP dMP    

	public static $COLOR_WINE_RED_ARR = array(168, 55, 49);
	public static $COLOR_DARK_WINE_RED_ARR = array(55, 9, 11);
	public static $COLOR_WHITE_ARR = array(255, 255, 255);
	public static $COLOR_MILK_GRAY_ARR = array(250, 250, 250);
	public static $COLOR_LIGHT_TINT_WARM_GRAY_ARR = array(242, 238, 235);
	public static $COLOR_TINT_WARM_GRAY_ARR = array(235, 234, 230);
	public static $COLOR_LIGHT_WARM_GRAY_ARR = array(219, 215, 212);
	public static $COLOR_WARM_GRAY_ARR = array(165, 157, 155);
	public static $COLOR_DARK_GRAY_ARR = array(49, 49, 49);
	public static $COLOR_CREAM_YELLOW_ARR = array(255, 204, 102);
	public static $COLOR_MAGENTA_ARR = array(255, 51, 51);
	public static $COLOR_EMERALD_GREEN_ARR = array(0, 204, 102);













	//     dMMMMb  .aMMMb  dMMMMb  dMMMMb  dMMMMMP dMMMMb        .dMMMb dMMMMMMP dMP dMP dMP     dMMMMMP 
	//    dMP"dMP dMP"dMP dMP.dMP dMP VMP dMP     dMP.dMP       dMP" VP   dMP   dMP.dMP dMP     dMP      
	//   dMMMMK" dMP dMP dMMMMK" dMP dMP dMMMP   dMMMMK"        VMMMb    dMP    VMMMMP dMP     dMMMP     
	//  dMP.aMF dMP.aMP dMP"AMF dMP.aMP dMP     dMP"AMF       dP .dMP   dMP   dA .dMP dMP     dMP        
	// dMMMMP"  VMMMP" dMP dMP dMMMMP" dMMMMMP dMP dMP        VMMMP"   dMP    VMMMP" dMMMMMP dMMMMMP     

	public static $BORDER_STYLE_CARD_BOARD_OUTLINE_WIDTH=0.2;
	public static $BORDER_STYLE_CARD_BOARD_TABLE_OUTLINE_WIDTH=0.01;
	public static $BORDER_STYLE_CARD_BOARD_HEAD_DARK_GRAY="BORDER_STYLE_CARD_BOARD_HEAD_DARK_GRAY";
	public static $BORDER_STYLE_CARD_BOARD_GRAY_HEAD_N_TAIL="BORDER_STYLE_CARD_BOARD_GRAY_HEAD_N_TAIL";
	public static $BORDER_STYLE_CARD_BOARD_GRAY_TAIL="BORDER_STYLE_CARD_BOARD_GRAY_TAIL";
	public static $BORDER_STYLE_CARD_BOARD_GRAY_BODY="BORDER_STYLE_CARD_BOARD_GRAY_BODY";
	public static $BORDER_STYLE_SIMPLE_TABLE_CELL_GRAY="BORDER_STYLE_SIMPLE_TABLE_CELL_GRAY";
	public static function GET_BORDER_STYLE_BY_TYPE($type) {

		if($type == self::$BORDER_STYLE_CARD_BOARD_GRAY_HEAD_N_TAIL) {

			$border_style=
			array(
				'width' => self::$BORDER_STYLE_CARD_BOARD_OUTLINE_WIDTH
				, 'cap' => 'round'
				, 'join' => 'miter'
				, 'dash' => 0
				// , 'color' => self::$COLOR_TINT_WARM_GRAY_ARR
				, 'color' => self::$COLOR_DARK_GRAY_ARR
			);

		} else if($type == self::$BORDER_STYLE_CARD_BOARD_HEAD_DARK_GRAY) {

			$border_style=
			array(
				'width' => self::$BORDER_STYLE_CARD_BOARD_OUTLINE_WIDTH
				, 'cap' => 'round'
				, 'join' => 'miter'
				, 'dash' => 0
				// , 'color' => self::$COLOR_WARM_GRAY_ARR
				, 'color' => self::$COLOR_DARK_GRAY_ARR
			);

		} else if($type == self::$BORDER_STYLE_CARD_BOARD_GRAY_TAIL) {

			// 리스트의 마지막 열을 그립니다.
			// 좌,우, 하단만 라운드를 넣고 상단은 아무런 효과도 넣지 않습니다.

			$border_style_left_n_right=
			array(
				'width' => self::$BORDER_STYLE_CARD_BOARD_OUTLINE_WIDTH
				, 'cap' => 'round'
				, 'join' => 'miter'
				, 'dash' => 0
				// , 'color' => self::$COLOR_TINT_WARM_GRAY_ARR
				, 'color' => self::$COLOR_DARK_GRAY_ARR
			);			

			$border_style=
			array(	
				'L' => $border_style_left_n_right,
	            'T' => 0,
	            'R' => $border_style_left_n_right,
	            'B' => $border_style_left_n_right
			);

		} else if($type == self::$BORDER_STYLE_CARD_BOARD_GRAY_BODY) {

			$border_style_left_n_right=
			array(	
				'width' => self::$BORDER_STYLE_CARD_BOARD_OUTLINE_WIDTH
				, 'cap' => 'squre'
				, 'join' => 'miter'
				, 'dash' => 0
				// , 'color' => self::$COLOR_TINT_WARM_GRAY_ARR
				, 'color' => self::$COLOR_DARK_GRAY_ARR
			);

			$border_style=
			array(	
				'L' => $border_style_left_n_right,
	            'T' => 0,
	            'R' => $border_style_left_n_right,
	            'B' => 0
			);

		} else if($type == self::$BORDER_STYLE_SIMPLE_TABLE_CELL_GRAY) {

			$border_style_all=
			array(	
				'width' => self::$BORDER_STYLE_CARD_BOARD_TABLE_OUTLINE_WIDTH
				, 'cap' => 'round'
				, 'join' => 'miter'
				, 'dash' => 0
				// , 'color' => self::$COLOR_WARM_GRAY_ARR
				, 'color' => self::$COLOR_DARK_GRAY_ARR
			);

			$border_style=
			array('all' => $border_style_all);

		}

		return $border_style;
	}

	private $border_style;
	public function set_border_style($border_style) {
		$this->border_style = $border_style;
	}
	public function get_border_style() {
		return $this->border_style;
	}










	//     dMMMMMP .aMMMb  dMMMMb dMMMMMMP 
	//    dMP     dMP"dMP dMP dMP   dMP    
	//   dMMMP   dMP dMP dMP dMP   dMP     
	//  dMP     dMP.aMP dMP dMP   dMP      
	// dMP      VMMMP" dMP dMP   dMP    
	private static $DEFAULT_FONT="helvetica";
	//private static $DEFAULT_FONT="dejavusans";
	//private static $DEFAULT_FONT="helvetica";

	//helvetica

	private static $FONT_NAME_DEFAULT="helvetica";
	private static $FONT_STYLE_BOLD="B";
	private static $FONT_STYLE_NORMAL="";

	public static $FONT_SIZE_LARGE="FONT_SIZE_LARGE";
	public static $FONT_SIZE_SMALL="FONT_SIZE_SMALL";	

	private static $FONT_SIZE_TITLE=8;
	private static $FONT_SIZE_CONTENT=8;
	private static $FONT_SIZE_CONTENT_SMALL=6;
	public static $CARD_BOARD_TITLE_FONT_SIZE=8;
	public static $CARD_BOARD_TITLE_FONT_SIZE_LARGE=9;
	public static $CARD_BOARD_TITLE_FONT_SIZE_HUGE=12;
	public static $CARD_BOARD_SIMPLE_TABLE_FONT_SIZE=6;

	private static $CARD_BOARD_CONTENT_FONT="helvetica";
	private static $CARD_BOARD_CONTENT_FONT_STYLE="";
	public static $CARD_BOARD_CONTENT_FONT_SIZE=8;
	public static $CARD_BOARD_CONTENT_FONT_SIZE_LARGE=9;

	private static $SIMPLE_TABLE_TITLE_SMALL_FONT="helvetica";
	private static $SIMPLE_TABLE_TITLE_SMALL_FONT_STYLE="B";

	public static $SIMPLE_TABLE_TITLE_SMALL_FONT_SIZE=6;
	public static $SIMPLE_TABLE_TITLE_MIDIUM_FONT_SIZE=7;
	public static $SIMPLE_TABLE_TITLE_FONT_SIZE_LARGE=8;

	private static $SIMPLE_TABLE_CONTENT_SMALL_FONT="helvetica";
	private static $SIMPLE_TABLE_CONTENT_SMALL_FONT_STYLE="";
	public static $SIMPLE_TABLE_CONTENT_SMALL_FONT_SIZE=6;
	public static $SIMPLE_TABLE_CONTENT_FONT_SIZE_LARGE=9;

	private $font_name;		// 텍스트에 사용되는 폰트 정보.
	public function set_font_name($font_name) {
		$this->font_name = $font_name;
	}
	public function get_font_name() {
		return $this->font_name;
	}

	private $font_style;	// 볼드, 이탤릭체 등
	public function set_font_style($font_style) {
		$this->font_style = $font_style;
	}
	public function get_font_style() {
		return $this->font_style;
	}

	private $font_size;
	public function set_font_size($font_size) {
		$this->font_size = $font_size;
	}
	public function get_font_size() {
		return $this->font_size;
	}

	public function set_font(){

		$cur_font_name = $this->get_font_name();
		$cur_font_size = $this->get_font_size();

		$this->pdf->SetFont(
		    $this->get_font_name()
		    , $this->get_font_style()
		    , $this->get_font_size()
		);
	}	














	//     dMMMMb  dMMMMMP dMP     .aMMMb dMMMMMMP dMP .aMMMb  dMMMMb  .dMMMb  dMP dMP dMP dMMMMb 
	//    dMP.dMP dMP     dMP     dMP"dMP   dMP   amr dMP"dMP dMP dMP dMP" VP dMP dMP amr dMP.dMP 
	//   dMMMMK" dMMMP   dMP     dMMMMMP   dMP   dMP dMP dMP dMP dMP  VMMMb  dMMMMMP dMP dMMMMP"  
	//  dMP"AMF dMP     dMP     dMP dMP   dMP   dMP dMP.aMP dMP dMP dP .dMP dMP dMP dMP dMP       
	// dMP dMP dMMMMMP dMMMMMP dMP dMP   dMP   dMP  VMMMP" dMP dMP  VMMMP" dMP dMP dMP dMP        
                                                                                           
	// @ Section - relationship
	// 자신을 포함하고 있는 부모 엘리먼트
	private $parent_element;
	public function set_parent($parent_element){
		$this->parent_element = $parent_element;
	}
	public function get_parent(){
		return $this->parent_element;
	}
	// 자신보다 바로 앞의 인덱스에 위치한 엘리먼트
	private $prev_element;
	public function set_prev($prev_element){
		$this->prev_element = $prev_element;
	}
	public function get_prev(){
		return $this->prev_element;	
	}
	// 자신보다 바로 뒤의 인덱스에 위치한 엘리먼트
	private $next_element;
	public function set_next($next_element){
		$this->next_element = $next_element;
	}
	public function get_next(){
		return $this->next_element;	
	}
	// 자신보다 바로 위의 인덱스에 위치한 엘리먼트
	private $up_element;
	public function set_up($up_element){
		$this->up_element = $up_element;
	}
	public function get_up(){
		return $this->up_element;	
	}
	// 자신보다 바로 아래의 인덱스에 위치한 엘리먼트
	private $down_element;
	public function set_down($down_element){
		$this->down_element = $down_element;
	}
	public function get_down(){
		return $this->down_element;	
	}

	// 자신의 자식 엘리먼트들을 관리하는 배열객체
	private $children_element_arr;
	public function add_child_element($child_element){
		if(is_null($children_element_arr)) {
			$children_element_arr = array();
		}
		array_push($children_element_arr, $child_element);
	}
	public function get_children_element_arr() {
		return $this->children_element_arr;
	}

	// element set 객체 참조
	private $element_set;
	public function set_element_set($element_set) {
		$this->element_set = $element_set;
	}
	public function get_element_set() {
		return $this->element_set;
	}









	//  dMMMMMMP dMMMMMP dMP dMP dMMMMMMP         .aMMMb  dMP     dMP .aMMMMP dMMMMb 
	//    dMP   dMP     dMK.dMP    dMP           dMP"dMP dMP     amr dMP"    dMP dMP 
	//   dMP   dMMMP   .dMMMK"    dMP           dMMMMMP dMP     dMP dMP MMP"dMP dMP  
	//  dMP   dMP     dMP"AMF    dMP           dMP dMP dMP     dMP dMP.dMP dMP dMP   
	// dMP   dMMMMMP dMP dMP    dMP           dMP dMP dMMMMMP dMP  VMMMP" dMP dMP    
                                                                              
	public static $TEXT_ALIGN_CENTER = "CENTER";
	public static $TEXT_ALIGN_LEFT = "LEFT";
	public static $TEXT_ALIGN_RIGHT = "RIGHT";

	private $text_align;
	public function set_text_align($text_align) {
		$this->text_align = $text_align;
	}

	public function get_text_align() {
		return $this->text_align;
	}











	//  dMMMMMMP dMMMMMP dMP dMP dMMMMMMP         dMMMMb  dMMMMb  .aMMMb  dMMMMb 
	//    dMP   dMP     dMK.dMP    dMP           dMP.dMP dMP.dMP dMP"dMP dMP.dMP 
	//   dMP   dMMMP   .dMMMK"    dMP           dMMMMP" dMMMMK" dMP dMP dMMMMP"  
	//  dMP   dMP     dMP"AMF    dMP           dMP     dMP"AMF dMP.aMP dMP       
	// dMP   dMMMMMP dMP dMP    dMP           dMP     dMP dMP  VMMMP" dMP        

	// TODO
	private $text_x_pos;
	public function set_text_x_pos($text_x_pos) {
		$this->text_x_pos = $text_x_pos;
	}
	public function set_text_x_pos_offset($offset_x_pos) {
		$this->text_x_pos += $offset_x_pos;
	}
	public function get_text_x_pos() {
		return $this->text_x_pos;
	}

	private $text_y_pos;
	public function set_text_y_pos($text_y_pos) {
		$this->text_y_pos = $text_y_pos;
	}
	public function get_text_y_pos() {
		return $this->text_y_pos;
	}
	public function get_text_y_pos_v_center() {
		$cur_cell_y_pos = $this->get_cell_y_pos();
		$cur_cell_height = $this->get_cell_height();
		$cur_text_height = $this->get_text_height();

		$cur_text_y_pos_v_center = 0;
		if($cur_cell_y_pos > 0 && $cur_cell_height > 0 && $cur_text_height > 0) {
			$cur_text_y_pos_v_center = $cur_cell_y_pos + ROUND(($cur_cell_height - $cur_text_height) / 2,1);
		}

		if($cur_text_y_pos_v_center > 0) {
			return $cur_text_y_pos_v_center;
		}
		return $this->text_y_pos;
	}


	private $text_width;
	public function set_text_width($text_width) {
		$this->text_width = $text_width;
	}
	public function get_text_width() {
		return $this->text_width;
	}

	private $text_height;
	public function set_text_height($text_height) {
		$this->text_height = $text_height;
	}
	public function get_text_height() {
		return $this->text_height;
	}

	// 한줄의 높이를 저장합니다.
	// 실제로 텍스트를 그릴때 사용합니다.
	private $text_height_single_line;
	public function set_text_height_single_line($text_height_single_line) {
		$this->text_height_single_line = $text_height_single_line;
	}
	public function get_text_height_single_line() {
		return $this->text_height_single_line;	
	}

	private $text_arr;	// 셀 너비보다 텍스트가 긴 경우, n줄 이상으로 나누어 담을 수 있도록 배열로 관리합니다.
	public function set_text_arr($text_arr) {
		$this->text_arr = $text_arr;
	}
	public function get_text_arr() {
		return $this->text_arr;
	}

	private $raw_text; // 사용자로부터 입력 받은 텍스트
	public function set_raw_text($raw_text) {
		$this->raw_text = $raw_text;
	}
	public function get_raw_text() {
		return $this->raw_text;
	}

	private $is_bold; // 문자가 볼드체인지 구분
	public function set_is_bold($is_bold) {
		$this->is_bold = $is_bold;
		if($is_bold == true) {
			$this->set_font_style(self::$FONT_STYLE_BOLD);
		} else {
			$this->set_font_style(self::$FONT_STYLE_NORMAL);
		}
	}
	public function get_is_bold() {
		return $this->is_bold;	
	}

	public function get_text_width_on_font($text){
		// 텍스트 너비를 확인하기 전에 폰트 설정을 합니다.
		$this->set_font();
		// return round($this->pdf->GetStringWidth($text), 2);
		return CEIL($this->pdf->GetStringWidth($text));
	}

	public function get_text_height_on_font($cell_width, $text){
		// 텍스트 높이를 확인하기 전에 폰트 설정을 합니다.
		$this->set_font();

		// return round($this->pdf->getStringHeight($cell_width, $text), 1);
		return round($this->pdf->getStringHeight($cell_width, $text), 1);
		// return CEIL($this->pdf->getStringHeight($cell_width, $text));
	}

	private $text_color_arr;
	public function set_text_color_arr($text_color_arr) {
		$this->text_color_arr = $text_color_arr;
	}
	public function get_text_color_arr() {
		return $this->text_color_arr;
	}
	public function fill_text_color() {

		$text_color_arr = $this->get_text_color_arr();

		$this->pdf->SetTextColor(
			$text_color_arr[0]
			, $text_color_arr[1]
			, $text_color_arr[2]
		);
	}










	//     dMMMMb  .aMMMb  dMMMMb  dMMMMb  dMP dMMMMb  .aMMMMP 
	//    dMP.dMP dMP"dMP dMP VMP dMP VMP amr dMP dMP dMP"     
	//   dMMMMP" dMMMMMP dMP dMP dMP dMP dMP dMP dMP dMP MMP"  
	//  dMP     dMP dMP dMP.aMP dMP.aMP dMP dMP dMP dMP.dMP    
	// dMP     dMP dMP dMMMMP" dMMMMP" dMP dMP dMP  VMMMP"     

	// public static $PADDING_CARD_BOARD_TEXT = 0.7;
	public static $PADDING_CARD_BOARD_TEXT = 0.2;
	public static $PADDING_SIMPLE_TABLE_TEXT = 0.2;
	public static $PADDING_CARD_BOARD_TIMELINE_TITLE = 1;
	public static $PADDING_CARD_BOARD_TIMELINE_TEXT = 0.6;
	
	private $padding_top_n_bottom;
	public function set_padding_top_n_bottom($padding_top_n_bottom) {
		$this->padding_top_n_bottom = $padding_top_n_bottom;
	}
	public function get_padding_top_n_bottom() {
		return $this->padding_top_n_bottom;
	}
	private $padding_left_n_right;
	public function set_padding_left_n_right($padding_left_n_right) {
		$this->padding_left_n_right = $padding_left_n_right;
	}
	public function get_padding_left_n_right() {
		return $this->padding_left_n_right;
	}












	//     dMMMMb  dMMMMMP dMMMMb dMMMMMMP dMP dMP 
	//    dMP VMP dMP     dMP.dMP   dMP   dMP dMP  
	//   dMP dMP dMMMP   dMMMMP"   dMP   dMMMMMP   
	//  dMP.aMP dMP     dMP       dMP   dMP dMP    
	// dMMMMP" dMMMMMP dMP       dMP   dMP dMP     



	private $depth;
	public function set_depth($depth) {
		$this->depth = $depth;
	}
	public function get_depth() {
		return $this->depth;	
	}











	//     dMMMMb  .aMMMMP        .aMMMb  dMMMMMP dMP     dMP 
	//    dMP"dMP dMP"           dMP"VMP dMP     dMP     dMP  
	//   dMMMMK" dMP MMP"       dMP     dMMMP   dMP     dMP   
	//  dMP.aMF dMP.dMP        dMP.aMP dMP     dMP     dMP    
	// dMMMMP"  VMMMP"         VMMMP" dMMMMMP dMMMMMP dMMMMMP 
                                                       
	// 엘리먼트가 표시되는 배경의 셀 정보를 관리합니다.
	// 이 정보는 엘리먼트 컬렉션 셋이 공유합니다.

	private $cell_x_pos;
	public function set_cell_x_pos($cell_x_pos) {
		$this->cell_x_pos = $cell_x_pos;
	}
	public function set_cell_x_pos_offset($offset_x_pos) {
		$this->cell_x_pos += $offset_x_pos;
	}
	public function get_cell_x_pos() {
		return $this->cell_x_pos;
	}
	private $cell_y_pos;
	public function set_cell_y_pos($cell_y_pos) {
		$this->cell_y_pos = $cell_y_pos;
	}
	public function get_cell_y_pos() {
		return $this->cell_y_pos;
	}
	private $cell_width_pos;
	public function set_cell_width($cell_width_pos) {
		$this->cell_width_pos = $cell_width_pos;
	}
	public function get_cell_width() {
		return $this->cell_width_pos;
	}
	private $cell_height_pos;
	public function set_cell_height($cell_height_pos) {
		$this->cell_height_pos = $cell_height_pos;
	}
	public function get_cell_height() {
		return $this->cell_height_pos;
	}
	private $cell_color_arr;
	public function set_cell_color_arr($cell_color_arr) {
		$this->cell_color_arr = $cell_color_arr;
	}
	public function get_cell_color_arr() {
		return $this->cell_color_arr;
	}

	private $is_first;
	public function set_is_first($is_first) {
		$this->is_first = $is_first;
	}
	public function get_is_first() {
		return $this->is_first;
	}

	private $is_last;
	public function set_is_last($is_last) {
		$this->is_last = $is_last;

		if($is_last == false) return;

		// 마지막 엘리먼트일 경우 아래 업데이트가 진행됩니다.
		$cur_element_type = $this->get_element_type();
		if( self::$ELEMENT_TYPE_TABLE_FIELD == $cur_element_type ) {
			$this->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_SIMPLE_TABLE_CELL_GRAY));
		} else {
			$this->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_CARD_BOARD_GRAY_TAIL));
		}
		$this->set_cell_border_round_rect_style(self::$CARD_BOARD_ROUND_RECT_STYLE);
		$this->set_cell_border_round_rect_round_corner(self::$CARD_BOARD_ROUND_RECT_ROUND_CORNER_TAIL);
	}
	public function get_is_last() {
		return $this->is_last;
	}










	//     dMMMMb  .aMMMMP        .aMMMb  dMMMMMP dMP     dMP         dMMMMb  .aMMMb  dMMMMb  dMMMMb  dMMMMMP dMMMMb 
	//    dMP"dMP dMP"           dMP"VMP dMP     dMP     dMP         dMP"dMP dMP"dMP dMP.dMP dMP VMP dMP     dMP.dMP 
	//   dMMMMK" dMP MMP"       dMP     dMMMP   dMP     dMP         dMMMMK" dMP dMP dMMMMK" dMP dMP dMMMP   dMMMMK"  
	//  dMP.aMF dMP.dMP        dMP.aMP dMP     dMP     dMP         dMP.aMF dMP.aMP dMP"AMF dMP.aMP dMP     dMP"AMF   
	// dMMMMP"  VMMMP"         VMMMP" dMMMMMP dMMMMMP dMMMMMP     dMMMMP"  VMMMP" dMP dMP dMMMMP" dMMMMMP dMP dMP    

	public static $CARD_BOARD_ROUND_RADIUS_TOP_LEFT_TOP_RIGHT = 1.6;
	public static $CARD_BOARD_ROUND_RECT_STYLE="DF";
	public static $CARD_BOARD_ROUND_RECT_ROUND_CORNER_HEAD="1001";
	public static $CARD_BOARD_ROUND_RECT_ROUND_CORNER_BODY="0000";
	public static $CARD_BOARD_ROUND_RECT_ROUND_CORNER_TAIL="0110";

	private $cell_border_round_radius;				// round_radius
	public function set_cell_border_round_radius($cell_border_round_radius) {
		$this->cell_border_round_radius = $cell_border_round_radius;
	}
	public function get_cell_border_round_radius() {
		return $this->cell_border_round_radius;
	}
	private $cell_border_round_rect_style;			// round_rect_style
	public function set_cell_border_round_rect_style($cell_border_round_rect_style) {
		$this->cell_border_round_rect_style = $cell_border_round_rect_style;
	}
	public function get_cell_border_round_rect_style() {
		return $this->cell_border_round_rect_style;
	}
	private $cell_border_round_rect_round_corner;	// round_rect_round_corner
	public function set_cell_border_round_rect_round_corner($cell_border_round_rect_round_corner) {
		$this->cell_border_round_rect_round_corner = $cell_border_round_rect_round_corner;
	}
	public function get_cell_border_round_rect_round_corner() {
		return $this->cell_border_round_rect_round_corner;
	}
	private $cell_border_style;						// border_style
	public function set_cell_border_style($cell_border_style) {
		$this->cell_border_style = $cell_border_style;
	}
	public function get_cell_border_style() {
		return $this->cell_border_style;
	}
















	//     dMMMMMP dMP     dMMMMMP dMMMMMMMMb  dMMMMMP dMMMMb dMMMMMMP      dMMMMMMP dMP dMP dMMMMb  dMMMMMP 
	//    dMP     dMP     dMP     dMP"dMP"dMP dMP     dMP dMP   dMP           dMP   dMP.dMP dMP.dMP dMP      
	//   dMMMP   dMP     dMMMP   dMP dMP dMP dMMMP   dMP dMP   dMP           dMP    VMMMMP dMMMMP" dMMMP     
	//  dMP     dMP     dMP     dMP dMP dMP dMP     dMP dMP   dMP           dMP   dA .dMP dMP     dMP        
	// dMMMMMP dMMMMMP dMMMMMP dMP dMP dMP dMMMMMP dMP dMP   dMP           dMP    VMMMP" dMP     dMMMMMP     



	private $element_type;
	public function set_element_type($element_type) {
		$this->element_type = $element_type;
	}
	public function get_element_type() {
		return $this->element_type;	
	}

	private $element_id;
	public function set_element_id($element_id) {
		$this->element_id = $element_id;
	}
	public function get_element_id() {
		return $this->element_id;	
	}

	private $element_name;
	public function set_element_name($element_name) {
		$this->element_name = $element_name;
	}
	public function get_element_name() {
		return $this->element_name;	
	}









	//    .aMMMMP dMMMMMP dMMMMMMP         dMMMMMP dMP     dMMMMMP dMMMMMMMMb dMMMMMP dMMMMb dMMMMMMP         dMMMMb  dMMMMb  .aMMMb  dMMMMb 
	//   dMP"    dMP        dMP           dMP     dMP     dMP     dMP"dMP"dMPdMP     dMP dMP   dMP           dMP.dMP dMP.dMP dMP"dMP dMP.dMP 
	//  dMP MMP"dMMMP      dMP           dMMMP   dMP     dMMMP   dMP dMP dMPdMMMP   dMP dMP   dMP           dMMMMP" dMMMMK" dMP dMP dMMMMP"  
	// dMP.dMP dMP        dMP           dMP     dMP     dMP     dMP dMP dMPdMP     dMP dMP   dMP           dMP     dMP"AMF dMP.aMP dMP       
	// VMMMP" dMMMMMP    dMP           dMMMMMP dMMMMMP dMMMMMP dMP dMP dMPdMMMMMP dMP dMP   dMP           dMP     dMP dMP  VMMMP" dMP        

	public static $ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY="ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY";
	public static $ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_VALUE="ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_VALUE";
	public static $ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_EMPTY="ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_EMPTY";
	public static $ELEMENT_TYPE_TABLE_FIELD="ELEMENT_TYPE_TABLE_FIELD";
	public static $ELEMENT_TYPE_TEXT_ONLY="ELEMENT_TYPE_TEXT_ONLY";
	public static $ELEMENT_TYPE_CARD_BOARD_ETC="ELEMENT_TYPE_CARD_BOARD_ETC";

	// SIMPLE TABLE
	public static function GET_ELEMENT_PROP(	$pdf_obj
												, $element_type
												, $element_name
												, $text
												, $text_color_arr
												, $text_size
												, $cell_x_pos=0
												, $cell_y_pos=0
												, $cell_width=0
												, $cell_height=0
												, $cell_color_arr=""
												, $depth=0
												, $is_first=false
												, $is_last=false
												, $is_bold=false
												, $text_align=""
												, $caller_name=""
												) {

		// check parameters
		$caller_name .= "<br/>tcpdf.element.inc->get_element_prop";
		if(is_null($pdf_obj)){
			echo "$caller_name\t\$pdf_obj is not valid!";
			return;
		}
		if(empty($element_name)){
			echo "$caller_name\t\$element_name is empty!";
			return;
		}
		if(is_null($text)){
			echo "$caller_name\t\$text is empty!";
			return;
		}
		if(empty($text_color_arr)){
			echo "$caller_name\t\$text_color_arr is empty!";
			return;
		}
		if(!($text_size >= 0)){
			echo "$caller_name\t\$text_size is not valid!";
			return;
		}
		if(!($cell_x_pos >= 0)){
			echo "$caller_name\t\$cell_x_pos is not valid!";
			return;
		}
		if(!($cell_y_pos >= 0)){
			echo "$caller_name\t\$cell_y_pos is not valid!";
			return;
		}
		if(is_null($cell_width)){
			echo "$caller_name\t\$cell_width is not valid!";
			return;
		}
		if(is_null($cell_height)){
			echo "$caller_name\t\$cell_height is not valid!";
			return;
		}

		$element_prop = new TCPDFElement($pdf_obj);

		// COMMON PROPERTIES
		// USER CUSTOM - ELEMENT NAME (essential)
		$element_prop->set_element_name($element_name);
		// USER CUSTOM - TEXT (essential)
		$element_prop->set_raw_text($text);
		// USER CUSTOME - TEXT BOLD (optional)
		$element_prop->set_is_bold($is_bold);
		// USER CUSTOME - TEXT ALIGN (optional)
		$element_prop->set_text_align($text_align);
		// USER CUSTOME - TEXT COLOR
		$element_prop->set_text_color_arr($text_color_arr);

		// USER CUSTOME - FONT
		$element_prop->set_font_name(self::$FONT_NAME_DEFAULT);
		$element_prop->set_font_size($text_size);
		if($is_bold == true) {
			$element_prop->set_font_style(self::$FONT_STYLE_BOLD);
		} else {
			$element_prop->set_font_style(self::$FONT_STYLE_NORMAL);
		}

		// USER CUSTOM - CELL PROPERTIES (essential)
		$element_prop->set_cell_x_pos($cell_x_pos);
		$element_prop->set_cell_y_pos($cell_y_pos);
		$element_prop->set_cell_width($cell_width);
		$element_prop->set_cell_height($cell_height);

		// USER CUSTOM - CELL BG COLOR
		$element_prop->set_cell_color_arr($cell_color_arr);

		// USER CUSTOM - CELL BORDER
		if($is_last == true) {
			// wonder.jung
			if( self::$ELEMENT_TYPE_TABLE_FIELD == $element_type ) {
				$element_prop->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_SIMPLE_TABLE_CELL_GRAY));
			} else {
				$cur_border_style = self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_CARD_BOARD_GRAY_TAIL);
				$element_prop->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_CARD_BOARD_GRAY_TAIL));
			}
			
			$element_prop->set_cell_border_round_rect_style(self::$CARD_BOARD_ROUND_RECT_STYLE);
			$element_prop->set_cell_border_round_rect_round_corner(self::$CARD_BOARD_ROUND_RECT_ROUND_CORNER_TAIL);

		} else if($is_first == true) {

			if( self::$ELEMENT_TYPE_TABLE_FIELD == $element_type ) {
				$element_prop->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_SIMPLE_TABLE_CELL_GRAY));
			} else {
				$element_prop->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_CARD_BOARD_GRAY_HEAD_N_TAIL));
			}
			
			$element_prop->set_cell_border_round_rect_style(self::$CARD_BOARD_ROUND_RECT_STYLE);
			$element_prop->set_cell_border_round_rect_round_corner(self::$CARD_BOARD_ROUND_RECT_ROUND_CORNER_HEAD);

		} else {

			if( self::$ELEMENT_TYPE_TABLE_FIELD == $element_type ) {
				$element_prop->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_SIMPLE_TABLE_CELL_GRAY));
			} else {
				$element_prop->set_cell_border_style(self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_CARD_BOARD_GRAY_BODY));	
			}

			$element_prop->set_cell_border_round_rect_style(self::$CARD_BOARD_ROUND_RECT_STYLE);
			$element_prop->set_cell_border_round_rect_round_corner(self::$CARD_BOARD_ROUND_RECT_ROUND_CORNER_BODY);

		}
		$element_prop->set_cell_border_round_radius(self::$CARD_BOARD_ROUND_RADIUS_TOP_LEFT_TOP_RIGHT);

		// USER CUSTOME - DEPTH (essential)
		$element_prop->set_depth($depth);

		// USER CUSTOME - ORDERING (optional)
		$element_prop->set_is_first($is_first);
		$element_prop->set_is_last($is_last);

		// ELEMENT TYPE
		$element_prop->set_element_type($element_type);
		if($element_type == self::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_KEY) {

			// TEXT PADDING
			$element_prop->set_padding_left_n_right(self::$PADDING_CARD_BOARD_TEXT);
			$element_prop->set_padding_top_n_bottom(self::$PADDING_CARD_BOARD_TEXT);

		} else if($element_type == self::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_VALUE) {

			// TEXT PADDING
			$element_prop->set_padding_left_n_right(self::$PADDING_CARD_BOARD_TEXT);
			$element_prop->set_padding_top_n_bottom(self::$PADDING_CARD_BOARD_TEXT);

		} else if($element_type == self::$ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_EMPTY) {

			// do nothing

		} else if($element_type == self::$ELEMENT_TYPE_TABLE_FIELD) {

			// TEXT PADDING
			$element_prop->set_padding_left_n_right(self::$PADDING_SIMPLE_TABLE_TEXT);
			$element_prop->set_padding_top_n_bottom(self::$PADDING_SIMPLE_TABLE_TEXT);

		} else if($element_type == self::$ELEMENT_TYPE_TEXT_ONLY) {

			// TEXT PADDING
			$element_prop->set_padding_left_n_right(self::$PADDING_CARD_BOARD_TEXT);
			$element_prop->set_padding_top_n_bottom(self::$PADDING_CARD_BOARD_TEXT);

		} else if($element_type == self::$ELEMENT_TYPE_CARD_BOARD_ETC) {

			// $element_prop = null;

		}

		// 입력된 텍스트가 없고, 셀의 높이가 지정되어 있다면 여기서 종료합니다.
		$cur_raw_text = $element_prop->get_raw_text();
		if(empty($cur_raw_text) && $element_prop->get_cell_height() > 0) {
			return $element_prop;
		}
		// 셀이 텍스트를 포함하지 않는 타입이라면 여기서 종료합니다.
		if($element_prop->get_element_type() == $ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_EMPTY) {
			return $element_prop;
		}

		// 사용자가 입력한 텍스트를 기준으로 cell height를 구합니다.
		$element_prop->updateTextProps(
			// $raw_text=null
			$element_prop->get_raw_text()
			// $text_x_pos_offset=0
			, 0
			// $received_cell_height=0
			, 0
			// $font_size=10
			, $element_prop->get_font_size()
		);

		return $element_prop;
	}

	public function updateTextProps($raw_text=null, $text_x_pos_offset=0, $received_cell_height=0, $font_size=10) {

		$cur_raw_text = $this->get_raw_text();
		if(empty($raw_text) && empty($cur_raw_text)) {
			return;
		} else if(empty($raw_text) && !empty($cur_raw_text)) {
			$raw_text = $this->get_raw_text();
		}

		$raw_text = html_entity_decode($raw_text);

		$this->set_font();

		// 입력된 텍스트로 셀의 높이가 결정되는 경우는 아래 절차를 진행합니다.
		// 셀의 높이는 아래 조건에 의해 결정됩니다.

		// 1. 사용자가 지정한 폰트 
		// 2. 사용자가 지정한 셀의 너비
		// 만일 사용자가 지정한 폰트로 텍스트의 길이가 셀의 너비를 넘을 경우는 
		// 2줄로 나누어 저장합니다.
		// 셀의 높이는 2줄을 포함할 수 있도록 변경되어야 합니다.

		// 텍스트 관련 정보를 가져오는 경우에는 반드시 메서드 안에서 폰트 세팅을 진행하도록 변경합니다.

		// b-1. 사용자의 글의 길이를 구합니다.
		$raw_text_width = $this->get_text_width_on_font($raw_text);

		// http://www.tcpdf.org/doc/code/classTCPDF.html
		// wonder.jung - 왜 폰트가 고정이지??
		$raw_text_height = 
		$this->get_text_height_on_font(
			// $cell_width
			10
			// $text
			, "A"
		);

		// echo "\$raw_text :: $raw_text<br/>";
		// echo "\$raw_text_height :: $raw_text_height<br/><br/>";

		$this->set_text_height_single_line($raw_text_height);

		// b-1-1. 좌우 패딩이 포함된 너비를 구합니다.
		$text_n_padding_width = $raw_text_width + ($this->get_padding_left_n_right() * 2);

		// b-2. 사용자의 글의 글자수를 구합니다.
		$raw_text_char_count = STRLEN($raw_text);

		// b-3. 사용자의 글자당 길이를 구합니다. (이 값을 이용해서 몇 번째 글자에서 2줄로 분할할지가 결정됩니다.)
		// $raw_char_width = ROUND(($raw_text_width/$raw_text_char_count),1);
		$raw_char_width = CEIL($raw_text_width/$raw_text_char_count);

		// 좌,우의 패딩 너비를 제외한 셀의 너비가 사용자 입력 글자가 가질 수 있는 최대 너비입니다.
		if($this->get_cell_width() > 0) {
			// $max_chars_width = ROUND($this->get_cell_width() - (($this->get_padding_left_n_right() * 2) + $text_x_pos_offset),1);	
			$max_chars_width = CEIL($this->get_cell_width() - (($this->get_padding_left_n_right() * 2) + $text_x_pos_offset));	
		} else {
			$max_chars_width = $raw_text_width;
		}
		
		// c. 셀의 너비와 사용자 글의 길이를 비교해서 줄나눔 작업을 진행합니다.
		// 문자열 몇번째 인덱스에서 줄바꿈을 해야 하는지 확인합니다.

		// TEXT X POS (ALIGNMENT)
		$text_align = $this->get_text_align();
		$padding_left_n_right = $this->get_padding_left_n_right();
		if(is_null($padding_left_n_right) || !($padding_left_n_right > 0)) {
			$padding_left_n_right = self::$PADDING_CARD_BOARD_TEXT;
		}

		if($text_align == self::$TEXT_ALIGN_RIGHT) {
			// TODO
			$text_x_pos = $this->get_cell_x_pos() + $padding_left_n_right + $text_x_pos_offset;

		} else if($text_align == self::$TEXT_ALIGN_LEFT) {

			$text_x_pos = $this->get_cell_x_pos() + $padding_left_n_right + $text_x_pos_offset;

		} else if($text_align == self::$TEXT_ALIGN_CENTER) {

			$text_x_pos = $this->get_cell_x_pos() + ROUND((( ($this->get_cell_width() + $text_x_pos_offset) - $raw_text_width) / 2),2);

		}
		$this->set_text_x_pos($text_x_pos);


		// 셀에 포함된 문장의 최대 너비를 구하는 조건
		$cur_cell_width = $this->get_cell_width();
		$cur_cell_x_pos = $this->get_cell_x_pos();
		$cur_text_x_pos = $this->get_text_x_pos();
		$cur_max_text_width = 0;
		if(	(0 < $cur_cell_width) && 
			(0 < $cur_cell_x_pos) && 
			(0 < $cur_text_x_pos) && 
			($cur_cell_x_pos < $cur_text_x_pos)) {

			$cur_max_text_width = $cur_cell_width - ($cur_text_x_pos - $cur_cell_x_pos) - 1;

		}	

		// 줄바꿈 하는 인덱스를 구했습니다.
		// 인덱스에 맞추어 실제 텍스트를 줄바꿈 해줍니다.
		// $raw_text_char_count
		$text_row_count = 0;
		if($cur_max_text_width > 0) {
			$text_row_count = CEIL($raw_text_width / $cur_max_text_width);
			// echo "\$text_row_count : $text_row_count<br/>";
		}

		// 수정 이전에는 모두 한줄로 표시.
		// c-2. 최대 글자수보다 적습니다. 한 줄로 유지합니다.
		$text_arr = array();
		$text_height = $raw_text_height;
		if($text_row_count > 0) {
			$text_height = $raw_text_height * $text_row_count;
		}
		$this->set_text_height($text_height);
		// $this->set_text_height($raw_text_height);

		if($text_row_count > 1) {
			// 두 줄 이상인 경우
			$text_idx_begins = 0;
			$text_next_line_idx = 1;
			$prev_sub_text = "";


			// echo "<br/><br/><br/>001<br/>";
			$max_loop_cnt = $raw_text_char_count * 2;
			$cur_cnt = 0;

			$slice_length = 1;
			$text_idx_begins = 0;
			$raw_text_to_slice = $raw_text;

			// echo "\$cur_cnt : $cur_cnt<br/>";
			// echo "\$max_loop_cnt : $max_loop_cnt<br/>";

			while($cur_cnt < $max_loop_cnt) {

				$sub_text = SUBSTR($raw_text_to_slice, 0, $slice_length);
				$sub_text_width = $this->get_text_width_on_font($sub_text);

				// if(strpos($raw_text,"Your time is limited") !== FALSE) {
				// 	echo "\$raw_text_to_slice : $raw_text_to_slice<br/>";
				// 	echo "\$sub_text : $sub_text<br/><br/>";

				// 	echo "\$sub_text_width : $sub_text_width<br/>";
				// 	echo "\$cur_max_text_width : $cur_max_text_width<br/><br/>";

				// 	echo "\$slice_length : $slice_length<br/>";
				// 	echo "\$text_char_count_left_over : $text_char_count_left_over<br/>";
					
				// 	print_r($text_arr);
				// 	echo "<br/><br/>";
				// }


				if($cur_max_text_width < $sub_text_width) {
					// 문자열을 시작하는 인덱스를 조정합니다.
					// 1을 빼지 않을 경우, 다음 열의 첫번째 문자가 사라집니다.
					array_push($text_arr, $prev_sub_text);

					// echo "change!<br/>";
					// echo "\$slice_length : $slice_length<br/>";
					// echo "before / $raw_text_to_slice<br/>";
					$raw_text_to_slice = SUBSTR($raw_text_to_slice, strlen($prev_sub_text), (strlen($raw_text_to_slice) - strlen($prev_sub_text)));
					// echo "after / $raw_text_to_slice<br/>";

					$slice_length = 1;
					
					
				} else if($slice_length == $raw_text_char_count) {
					// 마지막 열의 마지막 글자를 검사함. 입력하고 종료한다.
					array_push($text_arr, $prev_sub_text);
					break;
				}

				$prev_sub_text = $sub_text;
				$slice_length++;
				$cur_cnt++;
			}


		} else {
			// 한 줄
			array_push($text_arr, $raw_text);
		}

		// DEBUG
		// if(strpos($raw_text,"Vote Counter") !== FALSE) {
		// 	echo "\$raw_text : $raw_text<br/>";
		// 	echo "\$text_row_count : $text_row_count<br/>";
		// 	print_r($text_arr);
		// 	echo "<br/><br/>";
		// }

		$this->set_text_arr($text_arr);
		

		// DEBUG 
		// print_r($text_arr);
		// echo "<br/>";

		// CELL HEIGHT / 텍스트의 요소가 결정된 이후에 셀의 높이를 계산합니다.
		if($received_cell_height > 0) {
			// 외부에서 지정한 셀 높이가 있다면 그것을 사용.
			$this->set_cell_height($received_cell_height);
		} else {
			// 외부에서 지정한 셀 높이가 없다면 텍스트 높이에 위,아래의 패딩을 더한 높이를 사용.
			$cell_height = $this->get_text_height() + ($this->get_padding_top_n_bottom() * 2);
			$this->set_cell_height($cell_height);
		}
		$text_y_pos = $this->get_cell_y_pos() + ROUND((($this->get_cell_height() - $this->get_text_height()) / 2),2);

		$cur_y_pox = $this->get_cell_y_pos();
		$cur_cell_height = $this->get_cell_height();
		$cur_text_height = $this->get_text_height();

		// DEBUG
		// if($raw_text == "Tough time during my marriage life77"){
			// $gap = ROUND((($this->get_cell_height() - $this->get_text_height()) / 2),2);
			// $prev_cell_height = $this->get_cell_height();

			// echo "<br/>";
			// echo "###\$text_row_count : $text_row_count<br/>";
			// echo "\$cur_y_pox : $cur_y_pox<br/>";
			// echo "\$raw_text : $raw_text<br/>";
			// echo "\$prev_cell_height : $prev_cell_height<br/>";
			// echo "\$cell_height : $cell_height<br/>";
			// echo "\$cur_cell_height : $cur_cell_height<br/>";
			// echo "\$cur_text_height : $cur_text_height<br/><br/>";
			// echo "\$text_y_pos : $text_y_pos<br/>";
			// echo "\$gap : $gap<br/><br/>";
		// }
		
		$this->set_text_y_pos($text_y_pos);
		// TEXT WIDTH
		if(COUNT($text_arr) > 1) {
			$this->set_text_width($max_chars_width);
		} else {
			$this->set_text_width($raw_text_width);
		}

		// CELL WIDTH - 사용자가 입력한 셀 너비가 없는 경우에만 셀 높이를 계산합니다.
		if($this->get_cell_width() == -1) {
			// CELL WIDTH / 텍스트의 요소가 결정된 이후에 셀의 너비를 계산합니다. 
			if($this->get_element_type() == self::$ELEMENT_TYPE_TABLE_FIELD) {
				$cell_width = $this->get_text_width() + 2;	
			} else {
				$cell_width = $this->get_text_width() + ($this->get_padding_left_n_right() * 2);	
			}
			
			$this->set_cell_width($cell_width);
		}

		// TEXT HEIGHT
		$this->set_text_height($text_height);

		// CELL HEIGHT

	}







	//     dMMMMb  dMMMMb  .aMMMb  dMP dMP dMP 
	//    dMP VMP dMP.dMP dMP"dMP dMP dMP dMP  
	//   dMP dMP dMMMMK" dMMMMMP dMP dMP dMP   
	//  dMP.aMP dMP"AMF dMP dMP dMP.dMP.dMP    
	// dMMMMP" dMP dMP dMP dMP  VMMMPVMMP"     
                                        
	public function draw() {
		$this->draw_cell();
		$this->draw_text();
	}




                                                                                                                                      




	//     dMMMMb  dMMMMb  .aMMMb  dMP dMP dMP        .aMMMb  dMMMMMP dMP     dMP 
	//    dMP VMP dMP.dMP dMP"dMP dMP dMP dMP        dMP"VMP dMP     dMP     dMP  
	//   dMP dMP dMMMMK" dMMMMMP dMP dMP dMP        dMP     dMMMP   dMP     dMP   
	//  dMP.aMP dMP"AMF dMP dMP dMP.dMP.dMP        dMP.aMP dMP     dMP     dMP    
	// dMMMMP" dMP dMP dMP dMP  VMMMPVMMP"         VMMMP" dMMMMMP dMMMMMP dMMMMMP 

	private function draw_cell() {

		if($this->get_element_type() == self::$ELEMENT_TYPE_TEXT_ONLY) {
			return;
		}

		$cell_border_round_rect_round_corner = $this->get_cell_border_round_rect_round_corner();
		$cell_x_pos = $this->get_cell_x_pos();
		$cell_y_pos = $this->get_cell_y_pos();
		$cell_width = $this->get_cell_width();
		$cell_height = $this->get_cell_height();
		
		$cell_border_round_radius = $this->get_cell_border_round_radius();
		$cell_border_round_rect_round_corner = $this->get_cell_border_round_rect_round_corner();
		$cell_border_round_rect_style = $this->get_cell_border_round_rect_style();
		$cell_border_style = $this->get_cell_border_style();

		$cell_color_arr = $this->get_cell_color_arr();

		// 마지막 열인 경우, 아래 테두리를 추가로 그려줘야 한다.
		$cell_height_buffer = 0.2; // 여러개의 엘리먼트를 그리게 될때, 생기는 여백을 가리기 위한 추가 높이.
		// if($cell_border_round_rect_round_corner==self::$CARD_BOARD_ROUND_RECT_ROUND_CORNER_BODY){
		if( ($this->get_is_first() == false) && ($this->get_is_last() == false) ) {

			$this->pdf->Rect(
				$cell_x_pos
				, $cell_y_pos
				, $cell_width
				, $cell_height + $cell_height_buffer
				, $cell_border_round_rect_style
				, $cell_border_style
				, $cell_color_arr
			);

		} else {

			
			$this->pdf->RoundedRect(
			    $cell_x_pos
			    , $cell_y_pos
			    , $cell_width
			    , $cell_height + $cell_height_buffer
			    , $cell_border_round_radius
			    , $cell_border_round_rect_round_corner // '1001'
			    , $cell_border_round_rect_style 		// 'DF'
			    , $cell_border_style
			    , $cell_color_arr
			);

			if($this->get_is_last() && $this->get_raw_text() != " " ) {
				// 마지막 열일 경우에는 상단 테두리를 가려줘야 합니다.
				// 테두리 스타일을 기본형으로 변경
				$cur_border_style = self::GET_BORDER_STYLE_BY_TYPE(self::$BORDER_STYLE_CARD_BOARD_GRAY_BODY);
				$this->pdf->Rect(
					$cell_x_pos
					, $cell_y_pos - $cell_height_buffer
					, $cell_width
					, $cell_height_buffer * 2
					, $cell_border_round_rect_style
					, $cur_border_style
					, $cell_color_arr
				);
			}
		}
	}








	//     dMMMMb  dMMMMb  .aMMMb  dMP dMP dMP      dMMMMMMP dMMMMMP dMP dMP dMMMMMMP 
	//    dMP VMP dMP.dMP dMP"dMP dMP dMP dMP         dMP   dMP     dMK.dMP    dMP    
	//   dMP dMP dMMMMK" dMMMMMP dMP dMP dMP         dMP   dMMMP   .dMMMK"    dMP     
	//  dMP.aMP dMP"AMF dMP dMP dMP.dMP.dMP         dMP   dMP     dMP"AMF    dMP      
	// dMMMMP" dMP dMP dMP dMP  VMMMPVMMP"         dMP   dMMMMMP dMP dMP    dMP       

	private function draw_text() {

		// 셀이 내용을 포함하지 않는 타입이라면 종료합니다.
		if($this->get_element_type() == $ELEMENT_TYPE_CARD_BOARD_ROW_CONTENT_EMPTY) {
			return;
		}

		$this->set_font();

		$this->fill_text_color();

		$text_arr = $this->get_text_arr();

		if(COUNT($text_arr) > 1) {

			// echo "000 / draw_text<br/>";

			// 1. 여러 줄인 경우.
			$text_y_pos=0;
			for ($idx = 0; $idx < COUNT($text_arr); $idx++) {
				$cur_text = $text_arr[$idx];

				$text_y_pos = $this->get_text_y_pos() + ($this->get_text_height_single_line() * $idx);

				// echo "000 / draw_text / \$cur_text : $cur_text<br/>";
				// echo "000 / draw_text / \$text_y_pos : $text_y_pos<br/>";

				$this->pdf->Text(
				// * @param $x (float) Abscissa of the cell origin
					$this->get_text_x_pos()
				// * @param $y (float) Ordinate of the cell origin
				    , $text_y_pos
				// * @param $txt (string) String to print
				    , $cur_text
				);
			}

		} else {

			// echo "001 / draw_text<br/>";

			// 2. 한줄인 경우.
			$cur_text = $text_arr[0];

			// echo "002 / draw_text /  $cur_text_safe<br/>";

			$this->pdf->Text(
			// * @param $x (float) Abscissa of the cell origin
				$this->get_text_x_pos()
			// * @param $y (float) Ordinate of the cell origin
			    , $this->get_text_y_pos()
			// * @param $txt (string) String to print
			    , $cur_text
			);
		}
	}

	public function clone_element() {

		$element_prop = new TCPDFElement($this->get_pdf());

		// COMMON PROPERTIES
		// USER CUSTOM - ELEMENT NAME (essential)
		$element_prop->set_element_name($this->get_element_name());
		// USER CUSTOM - TEXT (essential)
		$element_prop->set_raw_text($this->get_raw_text());
		// USER CUSTOME - TEXT BOLD (optional)
		$element_prop->set_is_bold($this->get_is_bold());
		// USER CUSTOME - TEXT ALIGN (optional)
		$element_prop->set_text_align($this->get_text_align());
		// USER CUSTOME - TEXT COLOR
		$element_prop->set_text_color_arr($this->get_text_color_arr());

		// USER CUSTOME - FONT
		$element_prop->set_font_name($this->get_font_name());
		$element_prop->set_font_size($this->get_font_size());
		$element_prop->set_font_style($this->get_font_style());

		// USER CUSTOM - CELL PROPERTIES (essential)
		$element_prop->set_cell_x_pos($this->get_cell_x_pos());
		$element_prop->set_cell_y_pos($this->get_cell_y_pos());
		$element_prop->set_cell_width($this->get_cell_width());
		$element_prop->set_cell_height($this->get_cell_height());

		// USER CUSTOM - CELL BG COLOR
		$element_prop->set_cell_color_arr($this->get_cell_color_arr());

		// USER CUSTOM - CELL BORDER
		$element_prop->set_cell_border_style($this->get_cell_border_style());
		$element_prop->set_cell_border_round_rect_style($this->get_cell_border_round_rect_style());
		$element_prop->set_cell_border_round_rect_round_corner($this->get_cell_border_round_rect_round_corner());
		$element_prop->set_cell_border_round_radius($this->get_cell_border_round_radius());

		// USER CUSTOME - DEPTH (essential)
		$element_prop->set_depth($this->get_depth);

		// USER CUSTOME - ORDERING (optional)
		$element_prop->set_is_first($this->get_is_first());
		$element_prop->set_is_last($this->get_is_last());

		// ELEMENT TYPE
		$element_prop->set_element_type($this->get_element_type());

		// TEXT PADDING
		$element_prop->set_padding_left_n_right($this->get_padding_left_n_right());
		$element_prop->set_padding_top_n_bottom($this->get_padding_top_n_bottom());

		// TEXT POSITION
		$element_prop->set_text_arr($this->get_text_arr());
		$element_prop->set_text_x_pos($this->get_text_x_pos());
		$element_prop->set_text_y_pos($this->get_text_y_pos());
		
		// TEXT WIDTH
		$element_prop->set_text_width($this->get_text_width());
		// TEXT HEIGHT
		$element_prop->set_text_height($this->get_text_height());

		return $element_prop;
	}

	// TODO element set의 객체를 반환 받을 수 있도록 합니다. --> 엘리먼트 셋 간의 간격 조정이 가능해집니다. 자동으로 자신의 다음 위치를 계산할 수 있습니다.
	// TODO 중앙 정렬이 정확하지 않습니다.
	// TODO 중앙 정렬시 사용하는 텍스트 너비가 정확하지 않음. 약간의 여유 너비가 발생. 우측으로 좀 더 밀려 보임.
	// TODO 우측 정렬을 구현해야 합니다.
	// TODO 엘리먼트 안에 자식 엘리먼트를 넣는 기능을 구현합니다. (SIMPLE TABLE)

}

?>