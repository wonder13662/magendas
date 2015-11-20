<?php
//============================================================+
// File name   : example_006.php
// Begin       : 2008-03-04
// Last Update : 2013-05-14
//
// Description : Example 006 for TCPDF class
//               WriteHTML and RTL support
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: WriteHTML and RTL support
 * @author Nicola Asuni
 * @since 2008-03-04
 */

// Include the main TCPDF library (search for installation path).
// ../utils/tcpdf/examples
include_once('tcpdf.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set font
$pdf->SetFont('dejavusans', '', 10);

// add a page
$pdf->AddPage();

// writeHTML($html, $ln=true, $fill=false, $reseth=false, $cell=false, $align='')
// writeHTMLCell($w, $h, $x, $y, $html='', $border=0, $ln=0, $fill=0, $reseth=true, $align='', $autopadding=true)

// create some HTML content
$html = '<div id="meeting_agenda_container" class="container" role="main" data-toggle="modal" data-target="#row_modal">
	

		<!-- header -->
		<div id="meeting_agenda_header" style="height: 90px; background-color: rgb(255, 255, 255);">
			<img src="http://localhost/service/toast_master/images/BlackandWhiteLogoPNG.png" style="float:left;top:12px;">

			<div style="text-align:center;position:relative;left:-33px;">
				
		        <h4>The <span id="round">173</span>th Bundang Toastmasters Meeting Agenda</h4>
		        <h6>
		        	<small>
		        	Meeting every Thursday at 7:40 pm at 7F TOZ Seohyeon Station.<br>
		        	"We provide a supportive and positive\'s learning experience in which members are empowered <br>
		        	to develop commnication and leadership skills, resulting in greater self-confidence and personal growth."
		        	</small>
		    	</h6>
			</div>

			<!-- Theme -->
			<h6>
				<span class="pull-left">
					<small>Theme : </small><strong><span id="theme">Ghostbuster</span></strong>
				</span>
				<span class="pull-right">
					<small>Date : </small><strong><span id="startdate">2014-07-24</span></strong>
				</span>
			</h6>
		</div>

 


	</div>';

// output the HTML content
$pdf->writeHTML($html, true, false, true, false, '');

// ---------------------------------------------------------

//Close and output PDF document
$pdf->Output('example_006.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+
