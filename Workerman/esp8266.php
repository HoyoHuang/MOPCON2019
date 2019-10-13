<?php
date_default_timezone_set('Asia/Taipei');

require_once './Workerman/Autoloader.php';
use Workerman\Worker;
use Workerman\Lib\Timer;
//use App\onMessageWally;

ini_set('display_errors',true);
ini_set('error_reporting',E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);

// 資料庫
const MySQL_Host     = "127.0.0.1";
const MySQL_Username = "username";
const MySQL_Password = "password";
const MySQL_Database = "HOYO_IOT";

define('MySQL', 'mysql:host='. MySQL_Host .';dbname='. MySQL_Database .';charset=utf8');

// 為了 PhpStorm 程式追蹤
$db = new PDO(MySQL, MySQL_Username, MySQL_Password, array(
    PDO::ATTR_PERSISTENT => true, // 長連結
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
));

// IoT device 使用資料庫
$db_Device = new \PDO("mysql:dbname=HOYO_IOT_Device;host=127.0.0.1;charset=utf8", MySQL_Username, MySQL_Password, array(
    PDO::ATTR_PERSISTENT => true, // 長連結
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
));

$json = array();
$_client = array();

ini_set("memory_limit","256M");

// ssl 證書
$context = array(
    'ssl' => array(
        'local_cert'  => '/etc/httpd/ssl/apache.crt',
        'local_pk'    => '/etc/httpd/ssl/apache.key',
        'verify_peer' => false
    )
);

// 创建一个Worker监听2346端口，使用websocket协议通讯
$w = new Worker("text://0.0.0.0:3003", $context); // , $context
$w->transport = 'ssl';
$w->count = 1; // 启动 1 个进程对外提供服务

Worker::$stdoutFile = '/var/log/wsIoT.log';

$_client = array();

//
$w->onWorkerStart = function($w)
{
    global $db, $db_Device;

    $db = new PDO("mysql:dbname=". MySQL_Database .";host=". MySQL_Host .";charset=utf8", MySQL_Username, MySQL_Password, array(
        PDO::ATTR_PERSISTENT => true, // 長連結
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    ));
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db_Device = new PDO("mysql:dbname=HOYO_IOT_Device;host=". MySQL_Host .";charset=utf8", MySQL_Username, MySQL_Password, array(
        PDO::ATTR_PERSISTENT => true, // 長連結
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    ));
    $db_Device->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 开启一个内部端口，方便内部系统推送数据，Text协议格式 文本+换行符
    $inner_text_worker = new Worker('Text://0.0.0.0:3004');
    $inner_text_worker->onMessage = function($connection, $buffer)
    {
        echo $buffer;

        // 通过workerman，向uid的页面推送数据
        $ret = sendMessageByUid($buffer);
        // 返回推送结果
        $connection->send($ret ? 'ok' : 'fail');
    };
    $inner_text_worker->listen();

    // 定時器 每秒执行一次 可以小數點 0.2
    Timer::add(1, function()use($w){

        //
        foreach($w->connections as $connection) {

            // 整分 心跳
            if ( date('s') == '00' || date('s') == '30' ) {
                $JV = array('Command' => 'Ping', 'Value' => date('H:i:s'));
                $connection->send( json_encode($JV) ."\n" );
            }
        }

    });
};

// Emitted when new connection come
$w->onConnect = function($connection){};

// 接收
$w->onMessage = function($connection, $data)
{
    global $db, $db_Device, $_client;

    $json = json_decode($data, true);
    //echo $data."\n";
    //echo 'Message: '. date('Ymd His') .': '. $data."\n";
    //$connection->send($data);

    // command 對應程式
    $phpFile = __DIR__ .'/App/esp8266/'. $json['command'] .'.php';
    if ( file_exists( $phpFile ) ){
        require( $phpFile );
    }

};

//
$w->onClose = function($connection){

};

// 针对uid推送数据
function sendMessageByUid($buffer)
{
    global $_client;

    $json = json_decode($buffer, true);

    //print_r($_client);
    $data = array('pin'=>$json['pin'], 'switch'=>$json['switch']);

    if( $json !='' && $_client[$json['SN']] ) {
        $_client[$json['SN']]->send(json_encode($data));
        //$_client[$uid]->send($message);
        return true;
    }
    //return false;
}

// 运行worker
Worker::runAll();
