<?php

class LogInManager{
	/*
		TROUBLE SHOOTING

		[Thu Jun 26 12:47:50 2014] [error] [client ::1] PHP Fatal error:  Call to undefined function mcrypt_get_iv_size() in 
		http://jmnote.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_php-mcrypt_%EC%84%A4%EC%B9%98

	*/
	private static $ENCRYPTION_KEY = "!@#$%^&*";

	/**
	 * Returns an encrypted & utf8-encoded
	 */
	public static function encrypt($pure_string) {

	    $iv_size = mcrypt_get_iv_size(MCRYPT_BLOWFISH, MCRYPT_MODE_ECB);
	    $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
	    $encrypted_string = mcrypt_encrypt(MCRYPT_BLOWFISH, self::$ENCRYPTION_KEY, utf8_encode($pure_string), MCRYPT_MODE_ECB, $iv);
	    return $encrypted_string;
	}

	/**
	 * Returns decrypted original string
	 */
	public static function decrypt($encrypted_string) {
	    $iv_size = mcrypt_get_iv_size(MCRYPT_BLOWFISH, MCRYPT_MODE_ECB);
	    $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
	    $decrypted_string = mcrypt_decrypt(MCRYPT_BLOWFISH, self::$ENCRYPTION_KEY, $encrypted_string, MCRYPT_MODE_ECB, $iv);
	    return $decrypted_string;
	}
}

?>
