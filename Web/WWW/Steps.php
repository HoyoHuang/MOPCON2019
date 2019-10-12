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


class Steps
{

    function __construct()
    {
        global $PDO;
        $this->db = $PDO;

        //
        $sql = " SELECT id FROM Device WHERE SN=:SN LIMIT 0,1 ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':SN', $_POST['SN']);
        $pre->execute();
        if ( $pre->rowCount()>=1 ) {

            $Device = $pre->fetch(2);
            $sql = " INSERT INTO Steps ( Device_id, step, latitude, longitude, distance, speed ) VALUES ( :Device_id, :step, :latitude, :longitude, :distance, :speed ) ";
            $pre = $this->db->prepare($sql);
            $pre->bindValue(':Device_id', $Device['id']);
            $pre->bindValue(':step', $_POST['step']);
            $pre->bindValue(':latitude', $_POST['latitude']);
            $pre->bindValue(':longitude', $_POST['longitude']);
            $pre->bindValue(':distance', $_POST['distance']);
            $pre->bindValue(':speed', $_POST['speed']);
            $pre->execute();

            echo json_encode($_POST);
        }
    }
}

new Steps();
