<?php

class ImageUploadManager{

	// TODO : move $IMAGE_UPLOAD_ROOT_DIR general config file.
	public static $IMAGE_UPLOAD_ROOT_DIR = "/Library/WebServer/Documents/wonglish/repo-tasks/images/";
	public static $IMAGE_UPLOAD_URI = "/wonglish/repo-tasks/images/";
	public static $IMAGE_UPLOAD_SUCCESS_MSG = "File is valid, and was successfully uploaded.";
	public static $IMAGE_UPLOAD_FAIL_MSG = "File is not valid. upload failed.";
	public static $IMAGE_UPLOAD_FAIL_MSG_ROOT_DIR_NOT_EXIST = "Root image dir is not exist. upload failed.";
	public static $IMAGE_UPLOAD_FAIL_MSG_TARGET_DIR_NOT_EXIST = "Target image dir is not exist. upload failed.";
	public static $IMAGE_UPLOAD_FAIL_MSG_FILE_SIZE_TOO_BIG = "File size is too big. upload failed.";
	public static $IMAGE_UPLOAD_FAIL_MSG_NO_FILE_SENT = "No file sent. upload failed.";
	public static $IMAGE_UPLOAD_FAIL_MSG_IMAGE_WIDTH_DIFF = "Image width is different. upload failed.";
	public static $IMAGE_UPLOAD_FAIL_MSG_IMAGE_HEIGHT_DIFF = "Image height is different. upload failed.";
	public static $IMAGE_UPLOAD_FAIL_MSG_UNKNOWN = "Unknown errors. upload failed.";



	public static function upload($upload_dir="", $upload_file_id="userfile", $expected_image_width=null, $expected_image_height=null){

		ini_set('upload_tmp_dir',self::$IMAGE_UPLOAD_ROOT_DIR);

		$json_res_obj = JSONManager::get_json_response_obj();
		$json_res_obj->code = JSONManager::$STATUS_CODE_SERVER_INTERNAL_ERROR;
		$json_res_obj->success = FALSE;
		$json_res_obj->result = null;
		
		// check root dir
		if(!self::isDirExist(self::$IMAGE_UPLOAD_ROOT_DIR)){
			$json_res_obj->message = self::$IMAGE_UPLOAD_FAIL_MSG_ROOT_DIR_NOT_EXIST . " : " . self::$IMAGE_UPLOAD_ROOT_DIR;
                        return $json_res_obj;
		}	

		$upload_dir_full_path = self::$IMAGE_UPLOAD_ROOT_DIR . $upload_dir;
		if(!self::isDirExist($upload_dir_full_path)){
                        $json_res_obj->message = self::$IMAGE_UPLOAD_FAIL_MSG_TARGET_DIR_NOT_EXIST . " : " . $upload_dir_full_path;
                        return $json_res_obj;
		}

		$file_name = basename($_FILES[$upload_file_id]['name']);
		if(empty($file_name)){
                        $json_res_obj->message = self::$IMAGE_UPLOAD_FAIL_MSG_NO_FILE_SENT;
                        return $json_res_obj;
		}
	

		switch ($_FILES[$upload_file_id]['error']) {
			
			case UPLOAD_ERR_OK:
			break;

			case UPLOAD_ERR_NO_FILE:
                        $json_res_obj->message = self::$IMAGE_UPLOAD_FAIL_MSG_NO_FILE_SENT;
       			return $json_res_obj;
 
			case UPLOAD_ERR_INI_SIZE:
			case UPLOAD_ERR_FORM_SIZE:
                        $json_res_obj->message = self::$IMAGE_UPLOAD_FAIL_MSG_FILE_SIZE_TOO_BIG;
       			return $json_res_obj;

			default:
                        $json_res_obj->message = self::$IMAGE_UPLOAD_FAIL_MSG_UNKNOWN;
       			return $json_res_obj;
    		}
		// uploading file checking reference url
		// http://www.php.net/manual/en/features.file-upload.php
		
		// TODO English name only

		// TODO duplicated file name check	
		// TODO image width and height  check	
		$image_info = $_FILES[$upload_file_id]["tmp_name"];
		$image_size_info = getimagesize($image_info);
		$image_width = $image_size_info[0];
		$image_height = $image_size_info[1];
		if(is_numeric($expected_image_width) && is_numeric($expected_image_height)){
			
			$is_wrong_size = FALSE;
			$err_msg = "";
			if($image_width != $expected_image_width){
				$is_wrong_size = TRUE;
				
				$err_msg .= 
				self::$IMAGE_UPLOAD_FAIL_MSG_IMAGE_WIDTH_DIFF . 
				" : uploaded image width : " . $image_width . 
				" / expected image width : " . $expected_image_width;
			}
			if($image_height != $expected_image_height){

				if($is_wrong_size){
					$err_msg .= " // "; 
				}
				
				$err_msg .= 
				self::$IMAGE_UPLOAD_FAIL_MSG_IMAGE_HEIGHT_DIFF . 
				" : uploaded image height : " . $image_height . 
				" / expected image height : " . $expected_image_height;

				$is_wrong_size = TRUE;
			}

			if($is_wrong_size){
				$json_res_obj->message = $err_msg; 
				return $json_res_obj;
			}
		}

		$unique_file_name = self::getTime() . "_" . $image_width . "x" . $image_height . self::getFileExt($file_name); 
		$uploadfile = $upload_dir_full_path . $unique_file_name;
		if (move_uploaded_file($image_info, $uploadfile)) {

                        $json_res_obj->code = JSONManager::$STATUS_CODE_OK;
                        $json_res_obj->message = self::$IMAGE_UPLOAD_SUCCESS_MSG;
                        $json_res_obj->success = TRUE;

			$upload_result = new stdClass();
			$upload_result->files = $_FILES;
			$upload_result->image_path = self::$IMAGE_UPLOAD_URI . $upload_dir . $unique_file_name;

                        $json_res_obj->result = $upload_result;
                        return $json_res_obj;

		} else {

                        $json_res_obj->message = self::$IMAGE_UPLOAD_FAIL_MSG;
                        $json_res_obj->result = $_FILES;
                        return $json_res_obj;
		}
	}

	public static function getFileExt($file_name){

		$pattern = '/.+(\.[a-zA-Z0-9]{2,4})/';
		preg_match($pattern, $file_name, $matches);
		return $matches[1];
	}

	public static function getTime(){
		// set default timezone
		date_default_timezone_set('Asia/Seoul');
		return date('Y_md_His');
	}

	public static function isDirExist($target_dir){
		if(file_exists($target_dir) && is_dir($target_dir)){
			return true;
		} else {
			return false;
		}
	}

	public static function getBytes($n_megabytes){
		if(!is_numeric($n_megabytes) || $n_megabytes < 0) return -1;

		return 1048576 * $n_megabytes;
	}


} // end of class

?>
