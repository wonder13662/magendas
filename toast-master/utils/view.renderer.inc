<?php

class ViewRenderer{

	public static function render($file_uri, $render_prop_arr=null){
		
		$view = file_get_contents($file_uri);
		if(is_null($view) || $view == ""){
			echo "rendering target view is not valid";
			return;
		}		

		if(is_null($render_prop_arr)){
			echo $view;
			return;
		}

		$keys = array_keys($render_prop_arr);
		if(is_null($keys) || count($keys) == 0){
			echo "render_prop_arr is not valid";
			return;
		}
 
		foreach ($render_prop_arr as $key => $value) {
			$view = str_replace($key, $value, $view);
		}

		echo $view;
	}
}

?>
