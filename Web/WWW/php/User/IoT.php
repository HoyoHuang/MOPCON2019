<?php
namespace User;

use \Module\Layout;
use \Module\Permission;


class IoT
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
        $header = $_ENV['menu'][$_GET['a']];

        $layout = Layout::index();
        $first = file_get_contents(HDPath .'/page/User/IoT.html');

        //
        $html = str_replace('{Content}', $first, $layout);

        $dom = \phpQuery::newDocument($html);

        // 登入
        if ( $_SESSION['UserInfo']['id'] ) {
            $dom->find('.LoginNo')->remove();

            // 裝置列表
            $sql = " SELECT * FROM Device WHERE Member_id=:Member_id ";
            $pre = $this->db->prepare($sql);
            $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
            $pre->execute();

            if ( $pre->rowCount() >=1 ){

                $deviceList = '';
                while( $row = $pre->fetch(2) ){

                    $deviceTemple = \phpQuery::newDocument($dom->find('#templateDeviceList')->html());

                    if ( $row['DataColumn'] !='' && $row['DigitalIO'] !='' ){
                        $deviceTemple->find('#buttonData')->addClass('s6');
                        $deviceTemple->find('#buttonControl')->addClass('s6');
                    }
                    else{

                        if ( $row['DataColumn'] !='' ){
                            $deviceTemple->find('#buttonData')->addClass('s12');
                            $deviceTemple->find('#buttonControl')->remove();
                        }
                        if ( $row['DigitalIO'] !='' ){
                            $deviceTemple->find('#buttonData')->remove();
                            $deviceTemple->find('#buttonControl')->addClass('s12');
                        }

                        if ( $row['DataColumn'] =='' && $row['DigitalIO'] =='' ){
                            $deviceTemple->find('#buttonData')->remove();
                            $deviceTemple->find('#buttonControl')->remove();
                        }

                    }

                    $deviceTemple->find('.DeviceName')->html($row['Name']);
                    $deviceHTML = str_replace('{id}', $row['id'], $deviceTemple);
                    $deviceHTML = str_replace('{Name}', $row['Name'], $deviceHTML);
                    $deviceHTML = str_replace('{column_io}', $row['DigitalIO'], $deviceHTML);
                    $deviceHTML = str_replace('{column_data}', $row['DataColumn'], $deviceHTML);
                    $deviceHTML = str_replace('{token}', $row['Token'], $deviceHTML);
                    $deviceList .= $deviceHTML;
                }

                $dom->find('#page_DeviceList')->html($deviceList);
            }

            $dom = str_replace('{UserName}', $_SESSION['UserInfo']['name'], $dom);
            $dom = str_replace('{Header}', $header, $dom);
            $dom = str_replace('{userId}', $_SESSION['UserInfo']['GoogleOAuth'], $dom);
            //$html = str_replace('::WebURL::', WebURL, $html);
            $dom = str_replace('::version::', uniqid(), $dom);

        }
        else {
            $dom->find('.LoginYes')->remove();
        }

        echo $dom;
    }

    //
    function AddDevice()
    {

        $Token = md5('IoT@@'.uniqid().time());
        $SN = ($_POST['SN']=='')? strtoupper( md5( uniqid().'hoyo!@#'.time() ) ) : $_POST['SN'];

        $sql = " INSERT INTO Device ( Store_id, Token, SN, `Name`, DigitalIO, DataColumn ) VALUES ( :Store_id, :Token, :SN, :Name, :DigitalIO, :DataColumn ) ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Store_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':Token', $Token);
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

            $sql = " ALTER TABLE $table ADD PRIMARY KEY (`id`);
 ";
            $pre = $this->device->prepare($sql);
            $pre->execute();

            $pre = $this->device->prepare($sql);
            $pre->execute();
            $sql = " ALTER TABLE $table MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵', AUTO_INCREMENT=1; COMMIT; ";
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

            $sql = " ALTER TABLE $table ADD PRIMARY KEY (`id`);
 ";
            $pre = $this->device->prepare($sql);
            $pre->execute();

            $sql = " ALTER TABLE $table MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主鍵', AUTO_INCREMENT=1; COMMIT; ";
            $pre = $this->device->prepare($sql);
            $pre->execute();
        }

        $Return = array( 'Result'=>true, 'Data'=>array('Token'=>$Token, 'Name'=>$_POST['Name']) );
        echo json_encode($Return);
    }

    //
    function GetOne()
    {
        //
        $sql = " SELECT * FROM Device WHERE Member_id=:Member_id AND id=:id ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':id', $_POST['id']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){
            $row = $pre->fetch(2);

            $Return = array( "Result"=>true, "Data"=>$row );
        }
        else{
            $Return = array( 'Result'=>false );
        }
        echo json_encode($Return);
    }

    function Update()
    {

        $sql = " UPDATE Device SET Name=:Name WHERE Member_id=:Member_id AND id=:id ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Name', $_POST['Name']);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':id', $_POST['id']);
        $pre->execute();

        if ( $this->db->errorCode() =='00000' ){
            $Return = array( 'Result'=>true );
        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function DeviceDel()
    {

        $sql = " SELECT * FROM Device WHERE Token=:Token ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Token', $_POST['Token']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            $device = $pre->fetch();

            $sql = " DELETE FROM Device WHERE Token=:Token ";
            $pre = $this->db->prepare($sql);
            $pre->bindValue(':Token', $_POST['Token']);
            $pre->execute();

            $deviceTable = '`'. $device['Member_id'] .'_'. $device['SN'] .'_data`';
            $sql = " DROP TABLE $deviceTable ";
            $pre = $this->device->prepare($sql);
            $pre->execute();

            $Return = array( 'Result'=>true );

        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }
}
