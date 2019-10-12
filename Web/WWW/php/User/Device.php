<?php
namespace User;

use \Module\Layout;
use \Module\Permission;


class Device
{
    function __construct()
    {
        global $PDO, $PDO_Device;
        $this->db = $PDO;
        $this->device = $PDO_Device;

        //
        if ( Permission::Login() ==false ){
            header('location: /');
        }

        if ( !empty( $_GET['b'] ) ) {
            $MethodName = $_GET['b'];
            switch( $MethodName ) {
                case (preg_match('/\w/', $MethodName) ? true : false):
                    if ( method_exists(__CLASS__, $MethodName) ) {
                        $this->$MethodName();
                        exit;
                    }
                    break;
            }
        }

        //
        else {
            $this->Page();
        }
    }

    function Page()
    {

        $html = '';

        // 裝置列表
        $sql = " SELECT * FROM Device WHERE Token=:Token ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Token', $_GET['token']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ) {
            $device = $pre->fetch( 2 );

            $layout = Layout::index();

            $first = file_get_contents( HDPath . '/page/User/Device.html' );

            //
            $html = str_replace( '{{content}}', $first, $layout );

            $dom = \phpQuery::newDocument( $html );

            $dom->find( '#idName' )->html($device['Name']);

            // 登入
            if ( $_SESSION['UserInfo']['id'] ) {
                $dom->find( '.LoginNo' )->remove();

                $dom = str_replace( '{UserName}', $_SESSION['UserInfo']['name'], $dom );
                //$html = str_replace('{{webRoot}}', webRoot, $dom);
                //$html = str_replace('::WebURL::', WebURL, $html);
                $dom = str_replace( '::version::', uniqid(), $dom );

            } else {

                $dom->find( '.LoginYes' )->remove();
            }

            $html = $dom;
        }

        // 無此 Token 錯誤的裝置
        else{
            $html .= 'error';
        }

        echo $html;
    }

    //
    function AddDevice()
    {

        $SN = ($_POST['SN']=='')? strtoupper( md5( uniqid().'hoyo!@#'.time() ) ) : $_POST['SN'];

        $sql = " INSERT INTO Device ( Member_id, SN, Name, DigitalIO, DataColumn ) VALUES ( :Member_id, :SN, :Name, :DigitalIO, :DataColumn ) ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':SN', $SN);
        $pre->bindValue(':Name', $_POST['Name']);
        $pre->bindValue(':DigitalIO', $_POST['DigitalIO']);
        $pre->bindValue(':DataColumn', $_POST['DataColumn']);
        $pre->execute();

        $device_id = $this->db->lastInsertId();

        // 資料庫
        $sql = " CREATE DATABASE IF NOT EXISTS `$SN` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci; ";
        $pre = $this->device->prepare($sql);
        $pre->execute();

        // 控制開關
        if ( $_POST['DigitalIO'] !='' ){
            $table = $_SESSION['UserInfo']['Member_id'] .'_'. $SN .'_io';
            $sql = " CREATE TABLE `$table` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',";

            $t = explode(',', $_POST['DigitalIO']);
            foreach( $t as $k=>$v ){
                $sql .= "`$v` enum('1','0') NOT NULL DEFAULT '0',";
            }
            $sql = rtrim($sql, ',');
            $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8 ";
            //echo $sql;
            $pre = $this->device->prepare($sql);
            $pre->execute();
        }

        //
        if ( $_POST['DataColumn'] !='' ){
            $table = $_SESSION['UserInfo']['Member_id'] .'_'. $SN .'_data';
            $sql = " CREATE TABLE `$table` (
  `id` int(11) NOT NULL COMMENT '主鍵',
  `Create_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',";

            $t = explode(',', $_POST['DataColumn']);
            foreach( $t as $k=>$v ){
                $sql .= "`$v` float NOT NULL,";
            }
            $sql = rtrim($sql, ',');
            $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8 ";
            //echo $sql;
            $pre = $this->device->prepare($sql);
            $pre->execute();
        }

        $Return = array( 'Result'=>true, 'Data'=>array('device_id'=>$device_id, 'Name'=>$_POST['Name']) );
        echo json_encode($Return);
    }

    //
    function Chart()
    {
        header('Content-Type: application/json; charset=utf-8');

        $sql = " SELECT RecordTime, SUM(Temperature1)/COUNT(Temperature1) AS Temperature1, SUM(Humidity1)/COUNT(Humidity1) AS Humidity1, SUM(Watt1)/COUNT(Watt1) AS Watt1 FROM Data GROUP BY YEAR(Create_Time), MONTH(Create_Time), DAY(Create_Time), HOUR(Create_Time), MINUTE(Create_Time)  ORDER BY Create_Time DESC LIMIT 60 ";
        $pre = $this->db->prepare($sql);
        $pre->execute();
        $row = $pre->fetchAll(2);
        krsort($row);

        echo '[';

        //print_r($row);
        echo '{"label":"溫度", "data":[';
        $i = 1;
        foreach( $row as $k=>$v ){
            echo '['. (strtotime($v['RecordTime'])*1000 + (8*60*60*1000)) .','. number_format($v['Temperature1'],2, '.', '' ) .']';
            if ( $i < count($row) ) echo ',';

            $i++;
        }
        echo ']}';

        echo ',{"label":"濕度", "data":[';
        $i = 1;
        foreach( $row as $k=>$v ){
            echo '['. (strtotime($v['RecordTime'])*1000 + (8*60*60*1000)) .','. number_format($v['Humidity1'],2, '.', '' ) .']';
            if ( $i < count($row) ) echo ',';

            $i++;
        }
        echo '], "yaxis": 2}';

        echo ',{"label":"瓦數", "data":[';
        $i = 1;
        foreach( $row as $k=>$v ){
            echo '['. (strtotime($v['RecordTime'])*1000 + (8*60*60*1000)) .','. number_format($v['Watt1'],2, '.', '' ) .']';
            if ( $i < count($row) ) echo ',';

            $i++;
        }
        echo '], "yaxis": 3}';

        echo ']';


//        echo '[
//        {"label": "Europe (EU27)","data": [[1999, 3.0], [2000, 3.9], [2001, 2.0], [2002, 1.2], [2003, 1.3], [2004, 2.5], [2005, 2.0], [2006, 3.1], [2007, 2.9], [2008, 0.9]]},
//        {
//    "label": "USA",
//    "data": [[1999, 4.4], [2000, 3.7], [2001, 0.8], [2002, 1.6], [2003, 2.5], [2004, 3.6], [2005, 2.9], [2006, 2.8], [2007, 2.0], [2008, 1.1]]
//}
//        ]';
    }

    function SwitchPower()
    {

    }
}
