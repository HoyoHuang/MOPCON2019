<?php
//
header('Access-Control-Allow-Origin: *');

// 不緩存 http://php.net/manual/zh/function.header.php
header("Content-Type:text/html; charset=utf-8");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past

ini_set('display_errors', true);
ini_set('error_reporting', E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);

// Session 存活時間
//ini_set('session.cookie_lifetime', 0);
//ini_set("session.gc_maxlifetime", 14400);

// HTTP -> HTTPS
if(empty($_SERVER['HTTPS'])){
    $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: ' . $redirect);
    exit();
}

require( __DIR__ .'/config.php');


spl_autoload_register(function ($class_name) {
    $load_FileName = str_replace('\\', '/', $class_name);
    $file_name = __DIR__ ."/php/". $load_FileName .".php";
    if ( is_file($file_name) === true ) {
        require_once( $file_name );
    }
});

// MySQL DB Session
require_once( __DIR__ .'/Session.php');
$session = new Session(); // MySQL DB Session
session_set_save_handler(
    array($session,"open"),
    array($session,"close"),
    array($session,"read"),
    array($session,"write"),
    array($session,"destroy"),
    array($session,"gc")
);
register_shutdown_function('session_write_close');

// 設定瀏覽器關閉 下次開啟還是繼續同一個 session_id
//echo $_COOKIE['CookieSession'] .'　　';
if ( $_COOKIE['CookieSession'] !='' ){
    session_id($_COOKIE['CookieSession']);
}
//$CookieSession = isset($_COOKIE['CookieSession']) ? $_COOKIE['CookieSession'] : null;
//if($CookieSession) session_id($CookieSession);

session_start();

//
require_once __DIR__ . '/3rdParty/phpQuery.php';


class index {

    function __construct()
    {
        global $PDO;
        $this->db = $PDO;

        /**
         * 頁面
         * 由 ?a= 指定
         */
        if ( !empty( $_GET['a'] ) ) {

            $ClassName = str_replace('/', '\\', $_GET['a']);
            $load_FileName = str_replace('\\', '/', $ClassName);
            $file_name = __DIR__ . "/php/" . $load_FileName . ".php";
            //echo $file_name;
            if (is_file($file_name) === false) {
                header('Location: ./');
                exit;
            }

            if (class_exists($ClassName)) {
                $$ClassName = new $ClassName();
            }
        }

        // 無指定 ?a 顯示預設首頁
        else {
            // 進入選擇頁面
            $this->Page();
        }
	}

    //
    function Page()
    {
        new User\index();
    }

}

new index();
