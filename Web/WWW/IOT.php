<?php
// 資料庫
const MYSQL_Host     = "127.0.0.1";
const MYSQL_USERNAME = "HOYO";
const MYSQL_PASSWORD = "HOYOau4a8387 %$25";
const MYSQL_Table    = "HOYO_IOT";
define( "PDO_DSN", "mysql:dbname=". MYSQL_Table .";host=". MYSQL_Host .";charset=utf8" );
$PDO = new \PDO(PDO_DSN, MYSQL_USERNAME, MYSQL_PASSWORD);

spl_autoload_register(function ($class_name) {
    $load_FileName = str_replace('\\', '/', $class_name);
    $file_name = __DIR__ ."/../../PHP/". $load_FileName .".php";
    if ( is_file($file_name) === true ) {
        require_once( $file_name );
    }
});

mb_internal_encoding("UTF-8");


class IOT
{

    function __construct()
    {
        global $PDO;
        $this->db = $PDO;

        //
        $sql = " SELECT id FROM Device WHERE SN=:SN LIMIT 0,1 ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':SN', $_GET['SN']);
        $pre->execute();
        if ( $pre->rowCount()>=1 ) {
            $Device = $pre->fetch(2);
            $sql = " INSERT INTO Data ( Device_id, RecordTime, Temperature1, Humidity1, Watt1 ) VALUES ( :Device_id, :RecordTime, :Temperature1, :Humidity1, :Watt1 ) ";
            $pre = $this->db->prepare($sql);
            $pre->bindValue(':Device_id', $Device['id']);
            $pre->bindValue(':RecordTime', date('YmdHis'));
            $pre->bindValue(':Temperature1', $_GET['T1']);
            $pre->bindValue(':Humidity1', $_GET['H1']);
            $pre->bindValue(':Watt1', $_GET['W1']);
            $pre->execute();
        }
    }
}

new IOT();

function generatorSN(){
    $serial = '';
    $chars = array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
    $max = count($chars)-1;
    for($i=0;$i<16;$i++){
        //$serial .= (!($i % 5) && $i ? '-' : '').$chars[rand(0, $max)];
        $serial .= $chars[rand(0, $max)];
    }

    return $serial;
}
