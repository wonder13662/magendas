/*
	@ Desc : 인쇄를 위한 웹 상의 편집뷰를 제공합니다. 1개의 그리드가 약 5mm를 나타냅니다. 제공 가능한 포맷 (A4)
*/
airborne.bootstrap.view.print = {
	/*
		@ Desc : 인쇄 가능한 포맷
	*/
	PRINT_FORMAT_A4_PORTRAIT:"PRINT_FORMAT_A4_PORTRAIT"
	, PRINT_FORMAT_A4_LANDSCAPE:"PRINT_FORMAT_A4_LANDSCAPE"
	// @ Desc : Web View에서 제어한 내용을 PDF에 1:1로 바뀐 내용을 옮기기 위한 브릿지 뷰를 만듭니다.
	, draw_bridge_svg_view:function(target_jq, svg_url) {

		// TODO : mouse event on grid view.

	}
	/*
		@ Desc : 인쇄를 위한 그리드 뷰를 그립니다. 인쇄할 용지를 선택할 수 있습니다.
	*/
	, draw_grid_view:function(target_jq, target_paper_format, pdf_url){ // change empty space to underbar

		if(target_jq == undefined) {
			console.log("!Error! / airborne.bootstrap.view.print / draw_grid_view / target_jq == undefined");
			return;
		}

		if(_v.is_not_valid_str(pdf_url)) {
			console.log("!Error! / airborne.bootstrap.view.print / draw_grid_view / _v.is_not_valid_str(pdf_url)");
			return;
		}


		if(target_paper_format == undefined){
			target_paper_format = this.PRINT_FORMAT_A4_PORTRAIT;
		}

		// 그리드 뷰를 그립니다.

		console.log(">>> target_jq :: ",target_jq);

		console.log(">>> target_jq.width() :: ",target_jq.width());

		// TEST 10x10 pixel square - 한칸으로 인식하기 적절한지?
		var tag_square_10x10 = "<div style=\"width:10px;height:10px;background-color:#CCC;\"></div>";
		// target_jq.append(tag_square_10x10);

		// base paper
		// 작업 공간이 될 영역
		var list_width = target_jq.width();
		// var working_paper_width_no_grid = 1050; 	// 2100mm
		var working_paper_width_no_grid = 840; 	// 2100mm
		var working_paper_width = working_paper_width_no_grid + 83;
		// var working_paper_height_no_grid = 1350;	// 2970mm
		var working_paper_height_no_grid = 1200;	// 2970mm
		var working_paper_height = working_paper_height_no_grid + 107; 

		var padding_left = 10;
		if(0 < working_paper_width < list_width && working_paper_width < list_width) {
			padding_left = parseInt((list_width - working_paper_width) / 2);
		}

		var working_paper_container_height = working_paper_height + padding_left*2; // 2700mm
		var working_paper_bottom_grid_height = 1;
		// var working_paper_bottom_grid_y_pos = working_paper_height - working_paper_bottom_grid_height;
		var working_paper_right_grid_width = 1;
		// var working_paper_right_grid_x_pos = working_paper_width - working_paper_right_grid_width;
		var grid_width = 10;
		var grid_horizontal_repeat_count = parseInt(working_paper_width_no_grid/grid_width);
		var grid_height = 10;
		var grid_vertical_repeat_count = parseInt(working_paper_height_no_grid/grid_height);

		console.log(">>> grid_vertical_repeat_count :: ",grid_vertical_repeat_count);
		console.log(">>> grid_horizontal_repeat_count :: ",grid_horizontal_repeat_count);

		console.log(">>> working_paper_width :: ",working_paper_width);
		console.log(">>> working_paper_height :: ",working_paper_height);

		// echo "<div id=\"club_title\" class=\"jumbotron\" style=\"background-color:#8e323f;background-image:url($service_root_path/images/MaroonandYellowBannerShort.jpg);background-repeat:no-repeat;height:195px;display:none;\">";	

		var tag_working_paper = 
		"<ul class=\"list-group\" style=\"display:block;\">"

			+ "<li id=\"row_input_group\" class=\"list-group-item list-group-item-default\" style=\"height:<WORKING_PAPER_CONTAINER_HEIGHT>px;padding-left:<PADDING_LEFT>px;padding-top:<PADDING_TOP>px;\">"
			.replace(/\<PADDING_LEFT\>/gi, padding_left)
			.replace(/\<PADDING_TOP\>/gi, padding_left)
			.replace(/\<WORKING_PAPER_CONTAINER_HEIGHT\>/gi, working_paper_container_height)

			// sandbox="allow-same-origin allow-scripts"

				// IFRAME으로 PDF 영역을 그려준다. 
				// + "<div id=\"pdf_view_container\" style=\"width:100%;height:100%;position: absolute;z-index: 1000;\">"
				// + "<div id=\"pdf_view_container\" style=\"width:<WORKING_PAPER_WIDTH>px;height:<WORKING_PAPER_HEIGHT>px;\">"
				+ "<div id=\"pdf_view_container\" style=\"width:800px;height:1000px;\">"
				.replace(/\<WORKING_PAPER_WIDTH\>/gi, working_paper_width + 1)
				.replace(/\<WORKING_PAPER_HEIGHT\>/gi, working_paper_height + 1)
					+ "<iframe src=\"<PDF_URL>\" scrolling=\"no\" style=\"width:100%;height:100%;display:block;\">"
						.replace(/\<PDF_URL\>/gi, pdf_url)
						+ "<p>Your browser does not support iframes.</p>"
					+ "</iframe>"
				+ "</div>"

				+ "<div id=\"grid_view_container\" style=\"width:<WORKING_PAPER_WIDTH>px;height:<WORKING_PAPER_HEIGHT>px;background-color:#CCC;margin:0px;position:absolute;z-index: 1000;\">"
				.replace(/\<WORKING_PAPER_WIDTH\>/gi, working_paper_width + 1)
				.replace(/\<WORKING_PAPER_HEIGHT\>/gi, working_paper_height + 1)

					+ "<div style=\"width:<WORKING_PAPER_WIDTH>px;height:<WORKING_PAPER_HEIGHT>px;background-color:#F8F8F8;float:left;top:1px;position:relative;left:1px;\">"
					.replace(/\<WORKING_PAPER_WIDTH\>/gi, working_paper_width - 1)
					.replace(/\<WORKING_PAPER_HEIGHT\>/gi, working_paper_height - 1)
					;

					
					// HORIZONTAL
					for(var idx = 0;idx < (grid_vertical_repeat_count - 1); idx++) {

						var WORKING_PAPER_OUTLINE_BOTTOM_Y_POS = grid_height * (idx + 1);
						var COLOR = "#EEE";
						if(parseInt((idx + 1) % 5) == 0) {
							COLOR = "#DDD";
						}

						tag_working_paper += ""
						+ "<div style=\"width:<WORKING_PAPER_WIDTH>px;height:<WORKING_PAPER_OUTLINE_HORIZONTAL_HEIGHT>px;background-color:<COLOR>;top:<WORKING_PAPER_OUTLINE_BOTTOM_Y_POS>px;position:relative;float:left;\"></div>"
						.replace(/\<COLOR\>/gi, COLOR)
						.replace(/\<WORKING_PAPER_WIDTH\>/gi, working_paper_width - 1)
						.replace(/\<WORKING_PAPER_OUTLINE_HORIZONTAL_HEIGHT\>/gi, working_paper_bottom_grid_height)
						.replace(/\<WORKING_PAPER_OUTLINE_BOTTOM_Y_POS\>/gi, WORKING_PAPER_OUTLINE_BOTTOM_Y_POS)
						;
					}

					// VERTICAL
					for(var idx = 0;idx < (grid_horizontal_repeat_count - 1); idx++) {

						var WORKING_PAPER_OUTLINE_VERTICAL_Y_POS = -1 * grid_vertical_repeat_count + 1;
						var WORKING_PAPER_OUTLINE_VERTICAL_X_POS = grid_width * (idx + 1);
						var COLOR = "#EEE";
						if(parseInt((idx + 1) % 5) == 0) {
							COLOR = "#DDD";
						}

						tag_working_paper += ""
						+ "<div style=\"width:<WORKING_PAPER_OUTLINE_VERTICAL_WIDTH>px;height:<WORKING_PAPER_HEIGHT>px;background-color:<COLOR>;left:<WORKING_PAPER_OUTLINE_VERTICAL_X_POS>px;top:<WORKING_PAPER_OUTLINE_VERTICAL_Y_POS>px;position:relative;float:left;\"></div>"
						.replace(/\<COLOR\>/gi, COLOR)
						.replace(/\<WORKING_PAPER_HEIGHT\>/gi, working_paper_height - 1)
						.replace(/\<WORKING_PAPER_OUTLINE_VERTICAL_WIDTH\>/gi, working_paper_right_grid_width)
						.replace(/\<WORKING_PAPER_OUTLINE_VERTICAL_X_POS\>/gi, WORKING_PAPER_OUTLINE_VERTICAL_X_POS)
						.replace(/\<WORKING_PAPER_OUTLINE_VERTICAL_Y_POS\>/gi, WORKING_PAPER_OUTLINE_VERTICAL_Y_POS)
						;
					}

					tag_working_paper += ""
					+ "</div>"
				+ "</div>"
			+ "</li>"
		+ "</ul>"
		;

		target_jq.append(tag_working_paper);

		// set grid event
		var print_view_jq = target_jq.children().last();

		// TEST
		var cur_grid_x = -1;
		var cur_grid_y = -1;
		var grid_view_container_jq = print_view_jq.find("div#grid_view_container");
		grid_view_container_jq.mousemove(function(e){

			var _self_jq = $(this);

			var cur_x_pos = e.pageX - _self_jq.offset().left;
			var cur_y_pos = e.pageY - _self_jq.offset().top;

			var next_grid_x = parseInt(cur_x_pos/(grid_width + 1));
			var next_grid_y = parseInt(cur_y_pos/(grid_height + 1));

			if(cur_grid_x == next_grid_x && cur_grid_y == next_grid_y) {
				return;
			}

			if(cur_grid_x != next_grid_x) {
				cur_grid_x = next_grid_x;
			}
			if(cur_grid_y != next_grid_y) {
				cur_grid_y = next_grid_y;
			}

			var grid_square_width = grid_width + 1;

			var cursor_jq = _self_jq.find("div#grid_view_cursor");
			if(cursor_jq.length == 0) {

				// 아직 커서가 없는 경우. 새로 만들어준다.
				var tag_cursor = 
				"<div id=\"grid_view_cursor\" style=\"width:<CURSOR_WIDTH>px;height:<CURSOR_HEIGHT>px;background-color:#CCC;margin:0px;position:relative;top:<CURSOR_TOP>;left:<CURSOR_LEFT>;\">"
				.replace(/\<CURSOR_HEIGHT\>/gi, grid_square_width)
				.replace(/\<CURSOR_WIDTH\>/gi, grid_square_width)
				.replace(/\<CURSOR_TOP\>/gi, grid_square_width * next_grid_x)
				.replace(/\<CURSOR_LEFT\>/gi, grid_square_width * next_grid_y)
				;
				_self_jq.append(tag_cursor);

			} else {

				// 이전에 만든 커서를 재활용.
				//cursor_jq.offset({top:next_grid_y,left:next_grid_x});
				cursor_jq.css("top",grid_square_width * next_grid_y + "px");
				cursor_jq.css("left",grid_square_width * next_grid_x + "px");

			}

		});
		grid_view_container_jq.mouseleave(function(e){

			var _self_jq = $(this);

			var cursor_jq = _self_jq.find("div#grid_view_cursor");
			if(cursor_jq.length != 0) {
				cursor_jq.remove();
			}
		});

		// IFRAME으로 PDF 영역을 그려준다. 
		// SAMPLE : http://localhost/service/toast-master/view/meeting_agenda_pdf.php?MEETING_ID=151&MEETING_MEMBERSHIP_ID=1

// <iframe src="http://www.w3schools.com">
//   <p>Your browser does not support iframes.</p>
// </iframe>		



	}

}