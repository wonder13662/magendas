<?php

// common setting
include_once("../common.inc");

// @ required
$wdj_mysql_interface->close();










// PDF Setting
include_once('../utils/tcpdf/tcpdf.php');
include_once('../utils/tcpdf.manager.inc');




// Create new PDF document
$wdj_pdf = new TCPDFManager($service_root_path);


$wdj_pdf->draw_svg("$service_root_path/images/svg/template_a4_grid_unit_10mm.svg", 0, 0, 2100, 2970);

$wdj_pdf->draw_svg("$service_root_path/images/svg/template_unit_10mm_10mm.svg", 0, 0, 10, 10);

$wdj_pdf->draw_svg("$service_root_path/images/svg/template_unit_10mm_10mm.svg", 10, 10, 10, 10);

$wdj_pdf->draw_svg("$service_root_path/images/svg/template_unit_10mm_10mm.svg", 20, 20, 10, 10);

$wdj_pdf->draw_svg("$service_root_path/images/svg/template_unit_10mm_10mm.svg", 80, 80, 10, 10);

$wdj_pdf->draw_svg("$service_root_path/images/svg/template_unit_10mm_10mm.svg", 100, 100, 20, 20);

// $wdj_pdf->draw_html_svg("<svg><text style=\"font-size:20px\"fill=\"red\">I love SVG!</text></svg>", 20, 20, 200, 200);





// ---------------------------------------------------------

//Close and output PDF document
$wdj_pdf->show_output();

//============================================================+
// END OF FILE
//============================================================+

?>
