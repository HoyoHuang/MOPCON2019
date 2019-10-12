<?php
namespace User;

use \Module\Layout;
use \Module\Permission;


class Situation
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
        $first = file_get_contents(HDPath .'/page/User/Situation.html');

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

    function Search()
    {
        $sql = " SELECT * FROM Situation WHERE Member_id=:Member_id ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            //$device = $pre->fetch();

            $Return = array( 'Result'=>true, 'Data'=>$pre->fetchAll(2) );

        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function Add()
    {

        $Token = md5($_SESSION['UserInfo']['Member_id'] . time() .'HoyoIoT!');
        $sql = " INSERT INTO Situation ( Member_id, Name, Token ) VALUES ( :Member_id, :Name, :Token ) ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':Name', $_POST['Name']);
        $pre->bindValue(':Token', $Token);
        $pre->execute();

        //
        if ( $pre->rowCount() >=1 ){
            $Return = array( 'Result'=>true );
        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function GetOne()
    {
        //
        $sql = " SELECT * FROM Situation WHERE Member_id=:Member_id AND id=:id ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':id', $_POST['id']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){
            $row = $pre->fetch(2);

            //
            $sql = " SELECT SituationControl.*, Name FROM SituationControl JOIN Device ON Device.id = SituationControl.Device_id WHERE SituationControl.Member_id=:Member_id AND Situation_id=:Situation_id ORDER BY Device_id ";
            $pre = $this->db->prepare($sql);
            $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
            $pre->bindValue(':Situation_id', $row['id']);
            $pre->execute();
            $row['Control'] = $pre->fetchAll(2);

            $not = '';
            foreach( $row['Control'] as $k=>$v ){
                $not .= $v['Device_id'] .',';
            }
            $not = rtrim($not, ',');

            $notSQL = ($not=='')? '': "AND id NOT IN ($not)";
            // all
            $sql = " SELECT * FROM Device WHERE Member_id=:Member_id $notSQL ORDER BY id ";
            //echo $sql;
            $pre = $this->db->prepare($sql);
            $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
            $pre->execute();
            $row['All'] = $pre->fetchAll(2);

            $Return = array( "Result"=>true, "Data"=>$row );
        }
        else{
            $Return = array( 'Result'=>false );
        }
        echo json_encode($Return);
    }

    //
    function AssignSelect()
    {

        $sql = " INSERT INTO SituationControl ( Member_id, Situation_id, Device_id, Action ) VALUES ( :Member_id, :Situation_id, :Device_id, :Action ) ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':Situation_id', $_POST['Situation_id']);
        $pre->bindValue(':Device_id', $_POST['Device_id']);
        $pre->bindValue(':Action', $_POST['Action']=='true'? 'on':'off');
        $pre->execute();

        if ( $pre->rowCount() >=1 ){
            $Return = array( 'Result'=>true );
        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function AssignDelete()
    {

        $sql = " DELETE FROM SituationControl WHERE Member_id=:Member_id AND Situation_id=:Situation_id AND Device_id=:Device_id ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':Situation_id', $_POST['Situation_id']);
        $pre->bindValue(':Device_id', $_POST['Device_id']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){
            $Return = array( 'Result'=>true );
        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    function AssignChange()
    {

        $sql = " UPDATE SituationControl SET Action=:Action WHERE Member_id=:Member_id AND Situation_id=:Situation_id AND Device_id=:Device_id ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Member_id', $_SESSION['UserInfo']['Member_id']);
        $pre->bindValue(':Situation_id', $_POST['Situation_id']);
        $pre->bindValue(':Device_id', $_POST['Device_id']);
        $pre->bindValue(':Action', $_POST['Action']=='true'? 'on':'off');
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
