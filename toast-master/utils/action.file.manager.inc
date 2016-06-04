<?php

class ActionFileManager{

	private static $SERVICE_ROOT_PATH;
	//ActionFileManager::set_service_root_path
	public static function set_service_root_path($new_service_root_path=""){
		ActionFileManager::$SERVICE_ROOT_PATH = $new_service_root_path;
	}
	public static function get_service_root_path(){
		return ActionFileManager::$SERVICE_ROOT_PATH;
	}

	//ActionFileManager::get_action_file_path
	public static function get_action_file_path($YYYYMMDD = null, $action_hash_key = null) {

		if(empty($YYYYMMDD)) {
			echo "!Error! / ActionFileManager / get_action_file_path / empty(\$YYYYMMDD)<br/>";
			return;
		}
		if(empty($action_hash_key)) {
			echo "!Error! / ActionFileManager / get_action_file_path / empty(\$action_hash_key)<br/>";
			return;
		}

		$real_path = $_SERVER['DOCUMENT_ROOT'];

		$service_root_path = ActionFileManager::get_service_root_path();

		$writable_directory_path = "$real_path/$service_root_path/action";
		$is_not_directory_exists = !file_exists($writable_directory_path);
		$is_not_writable_directory = !is_writable($writable_directory_path);

		if($is_not_directory_exists) {
			echo "!Error! / ActionFileManager / get_action_file_path / \$is_not_directory_exists<br/>";
			return;
		}
		if($is_not_writable_directory) {
			echo "!Error! / ActionFileManager / get_action_file_path / \$is_not_writable_directory<br/>";
			return;
		}

		// check the directory which has name of current date.
		// $cur_date = date("Y-m-d"); // param we should receive.
		$writable_date_path = "$writable_directory_path/$YYYYMMDD";

		$is_dir_exists = file_exists($writable_date_path) && is_dir($writable_date_path);
		if(!$is_dir_exists) {

			// create new directory which contains json_str files
			mkdir($writable_date_path);
			$is_dir_exists = file_exists($writable_date_path) && is_dir($writable_date_path);

			if(!$is_dir_exists) {
				echo "!Error! / ActionFileManager / get_action_file_path / !\$is_dir_exists<br/>";
				return;
			}
		}

		// write json str file, if file exist, overwrite on it.
		$file_path = "$writable_date_path/$action_hash_key" . ".gz";
		
		return 	$file_path;
	}

	//ActionFileManager::load
	public static function load($YYYYMMDD = null, $action_hash_key = null) {

		if(empty($YYYYMMDD)) {
			echo "!Error! / ActionFileManager / load / empty(\$YYYYMMDD)<br/>";
			return;
		}
		if(empty($action_hash_key)) {
			echo "!Error! / ActionFileManager / load / empty(\$action_hash_key)<br/>";
			return;
		}

		$action_file_path = ActionFileManager::get_action_file_path($YYYYMMDD, $action_hash_key);
		if(empty($action_file_path)) {
			echo "!Error! / ActionFileManager / load / empty(\$action_file_path)<br/>";
			return;
		}

		//To Get the size of the uncompressed file
		$FileRead = $action_file_path;
		$FileOpen = fopen($FileRead, "rb");
		fseek($FileOpen, -4, SEEK_END);
		$buf = fread($FileOpen, 4);
		$GZFileSize = end(unpack("V", $buf));
		fclose($FileOpen);

		//To Get the content from compressed file
		$zd = gzopen($FileRead, "rb");
		$content = gzread($zd, $GZFileSize);
		gzclose($zd);

		return $content;
	}

	public static function save($YYYYMMDD = null, $target_action_obj = null){

		if(empty($YYYYMMDD)) {
			echo "!Error! / ActionFileManager / save / empty(\$YYYYMMDD)<br/>";
			return;
		}
		if(ActionObject::is_not_action_obj($target_action_obj)) {
			echo "!Error! / ActionFileManager / save / ActionObject::is_not_action_obj(\$target_action_obj)<br/>";
			return;
		}

		$target_action_std = $target_action_obj->get_std_obj();
		if(is_null($target_action_std)) {
			echo "!Error! / ActionFileManager / save / is_null(\$target_action_std)<br/>";
			return;
		}
		$target_hash_key = $target_action_obj->get_hash_key();
		if(empty($target_hash_key)) {
			echo "!Error! / ActionFileManager / save / empty(\$target_hash_key)<br/>";
			return;
		}

		// 2. php action template을 json string으로 바꿉니다. 
		$target_action_json_str = json_encode($target_action_std);

		// 3. get file path to save
		$action_file_path = ActionFileManager::get_action_file_path($YYYYMMDD, $target_hash_key);

		// 4. php action template을 압축(zlib) 파일로 저장합니다.
		// http://stackoverflow.com/questions/5162575/php-use-zlib-to-compress-multiple-files
		$action_file_gz_path = $action_file_path;
		$handle_zp = gzopen( $action_file_gz_path, "w9" );
		gzwrite( $handle_zp, $target_action_json_str );
		gzclose( $handle_zp );

	}

}

?>
