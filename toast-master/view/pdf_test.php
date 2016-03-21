<?php

/*
if( class_exists("Imagick") )
{
    //Imagick is installed
    echo "001<br/>";
} else {
	echo "002<br/>";
}
*/


/*
//This function prints a text array as an html list.
function alist ($array) {  
  $alist = "<ul>";
  for ($i = 0; $i < sizeof($array); $i++) {
    $alist .= "<li>$array[$i]";
  }
  $alist .= "</ul>";
  return $alist;
}
//Try to get ImageMagick "convert" program version number.
exec("convert -version", $out, $rcode);
//Print the return code: 0 if OK, nonzero if error. 
echo "Version return code is $rcode <br>"; 
//Print the output of "convert -version"    
echo alist($out); 

// ImageMagick convert error code 127
*/



// common setting
// include_once("../common.inc");

$im = new Imagick();

$im->setResolution(300,300);
// $im->readimage('service/toast-master/view/test_show_pdf.pdf'); 
$im->readimage('MaroonandYellowBannerShort.jpg'); 
$im->setImageFormat('jpeg');    
$im->writeImage('thumb.jpg'); 
$im->clear(); 
$im->destroy();

// $im = new imagick("test_show_pdf.pdf[0]");
// // $im = new imagick();
// $im->setImageFormat('jpg');
// header('Content-Type: image/jpeg');
// echo $im;

?>
