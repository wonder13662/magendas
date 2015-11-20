<?php

class MYSQLConfig{

	public static $MYSQL_CONFIG_TOAST_MASTER_DEV = "toast-master-dev";
	// http://stackoverflow.com/questions/1676688/php-mysql-connection-not-working-2002-no-such-file-or-directory
	// Configuring PHP5 with MySQL support - /etc/php.ini
	// mysql.default_socket = /tmp/mysql.sock
	//public static $MYSQL_CONFIG_TOAST_MASTER_HOST_DEV = "localhost";
	public static $MYSQL_CONFIG_TOAST_MASTER_HOST_DEV = "127.0.0.1";
	public static $MYSQL_CONFIG_TOAST_MASTER_USERNAME_DEV = "magendas";
	public static $MYSQL_CONFIG_TOAST_MASTER_PASSWORD_DEV = "RubyAndWonder!1";
	public static $MYSQL_CONFIG_TOAST_MASTER_DATABASE_DEV = "magendas";

	public static $MYSQL_CONFIG_TOAST_MASTER_STAGE = "toast-master-stage";
	//public static $MYSQL_CONFIG_TOAST_MASTER_HOST_STAGE = "localhost";
	public static $MYSQL_CONFIG_TOAST_MASTER_HOST_STAGE = "127.0.0.1";
	public static $MYSQL_CONFIG_TOAST_MASTER_USERNAME_STAGE = "magendas";
	public static $MYSQL_CONFIG_TOAST_MASTER_PASSWORD_STAGE = "RubyAndWonder!1";
	public static $MYSQL_CONFIG_TOAST_MASTER_DATABASE_STAGE = "magendas";

	public static $MYSQL_CONFIG_TOAST_MASTER = "toast-master-real";
	//public static $MYSQL_CONFIG_TOAST_MASTER_HOST = "localhost";
	public static $MYSQL_CONFIG_TOAST_MASTER_HOST = "127.0.0.1";
	public static $MYSQL_CONFIG_TOAST_MASTER_USERNAME = "magendas";
	public static $MYSQL_CONFIG_TOAST_MASTER_PASSWORD = "RubyAndWonder!1";
	public static $MYSQL_CONFIG_TOAST_MASTER_DATABASE = "magendas";

	public static function getConfig($config_name){

		if($config_name == null || $config_name == "") return null;

		$config = null;
		if($config_name == self::$MYSQL_CONFIG_TOAST_MASTER_DEV){
			$config = new stdClass();
			$config->host = self::$MYSQL_CONFIG_TOAST_MASTER_HOST_DEV;
			$config->username = self::$MYSQL_CONFIG_TOAST_MASTER_USERNAME_DEV;
			$config->password = self::$MYSQL_CONFIG_TOAST_MASTER_PASSWORD_DEV;
			$config->database = self::$MYSQL_CONFIG_TOAST_MASTER_DATABASE_DEV;

		} else if($config_name == self::$MYSQL_CONFIG_TOAST_MASTER_STAGE){
			$config = new stdClass();
			$config->host = self::$MYSQL_CONFIG_TOAST_MASTER_HOST_STAGE;
			$config->username = self::$MYSQL_CONFIG_TOAST_MASTER_USERNAME_STAGE;
			$config->password = self::$MYSQL_CONFIG_TOAST_MASTER_PASSWORD_STAGE;
			$config->database = self::$MYSQL_CONFIG_TOAST_MASTER_DATABASE_STAGE;

		} else if($config_name == self::$MYSQL_CONFIG_TOAST_MASTER){
			$config = new stdClass();
			$config->host = self::$MYSQL_CONFIG_TOAST_MASTER_HOST;
			$config->username = self::$MYSQL_CONFIG_TOAST_MASTER_USERNAME;
			$config->password = self::$MYSQL_CONFIG_TOAST_MASTER_PASSWORD;
			$config->database = self::$MYSQL_CONFIG_TOAST_MASTER_DATABASE;
		}

		return $config;
	}

}

?>
