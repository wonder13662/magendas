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

$wdj_pdf->draw_eps("$service_root_path/images/svg/tcpdf_box.svg", 40, 40, 400, 400);





// ---------------------------------------------------------

//Close and output PDF document
// $wdj_pdf->show_output();

//============================================================+
// END OF FILE
//============================================================+

?>
