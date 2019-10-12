<?php


class API
{
    function __construct()
    {
        global $PDO, $PDO_Device, $memberPDO;
        $this->db = $PDO;
        $this->device = $PDO_Device;
        $this->member = $memberPDO;
        $this->store = '';

        if ( !empty( $_GET['b'] ) ) {

            $sql = " SELECT * FROM Member.Member WHERE Token=:Token AND is_Active='Y' ";
            $pre = $this->member->prepare($sql);
            $pre->bindValue(':Token', $_POST['Token']);
            $pre->execute();

            if ( $pre->rowCount() >=1 ){
                $member = $pre->fetch(2);
                $this->store = $member['id'];
            }

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
        else{
            $Return = array( 'Result'=>true, 'Message'=>'B000' );
            echo json_encode($Return);
        }

    }

    //
    function GetUserToken()
    {
        $sql = " SELECT * FROM Member.Member WHERE Member.GoogleOAuth=:GoogleOAuth AND Member.is_Active='Y' ";
        $pre = $this->member->prepare($sql);
        $pre->bindValue(':GoogleOAuth', $_POST['userId']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            $member = $pre->fetch(2);
            $Return = array( 'Result'=>true, 'Token'=>$member['Token'] );

        }
        else{

            $Token = hash('sha256', 'hoyo'. uniqid() .'auth!');
            $sql = " INSERT INTO Member.Member ( GoogleOAuth, Email, Name, Token ) VALUES ( :GoogleOAuth, :Email, :Name, :Token ) ";
            $pre = $this->member->prepare($sql);
            $pre->bindValue(':GoogleOAuth', $_POST['userId']);
            $pre->bindValue(':Email', $_POST['Email']);
            $pre->bindValue(':Name', $_POST['Name']);
            $pre->bindValue(':Token', $Token);
            $pre->execute();

            $Return = array( 'Result'=>true, 'Token'=>$Token );
        }

        echo json_encode($Return);
    }

    //
    function UserBindIoT()
    {

        // user id
        $sql = " SELECT * FROM Member.Member WHERE GoogleOAuth=:GoogleOAuth AND is_Active='Y' ";
        $pre = $this->member->prepare($sql);
        $pre->bindValue(':GoogleOAuth', $_POST['userId']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            $user = $pre->fetch(2);

            $sql = " UPDATE Device SET Member_id=:Member_id WHERE SN=:SN ";
            $pre = $this->db->prepare($sql);
            $pre->bindValue(':Member_id', $user['id']);
            $pre->bindValue(':SN', $_POST['SN']);
            $pre->execute();

            if ( $this->db->errorCode() =='00000' ){
                $Return = array( 'Result'=>true );
            }
            else{
                $Return = array( 'Result'=>false, 'Message'=>'002' );
            }

        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function DeviceList()
    {

        $sql = " SELECT * FROM Device WHERE Store_id=:Store_id ";

    }

    //
    function SearchDevice()
    {
        $sql = " SELECT Device.* FROM Member.Member JOIN HOYO_IOT.Device ON Member.id=HOYO_IOT.Device.Member_id WHERE GoogleOAuth=:GoogleOAuth AND is_Active='Y' ";
        $pre = $this->member->prepare($sql);
        $pre->bindValue(':GoogleOAuth', $_POST['userId']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            $data = $pre->fetchAll(2);
            $Return = array( 'Result'=>true, 'Data'=>$data );

        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function GetDevice(){

        $sql = " SELECT Device.* FROM Member.Member JOIN HOYO_IOT.Device ON Member.id=HOYO_IOT.Device.Member_id WHERE GoogleOAuth=:GoogleOAuth AND Device.id=:id AND is_Active='Y' ";
        $pre = $this->member->prepare($sql);
        $pre->bindValue(':GoogleOAuth', $_POST['userId']);
        $pre->bindValue(':id', $_POST['id']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            $data = $pre->fetch(2);
            $Return = array( 'Result'=>true, 'Data'=>$data );

        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function PushSwitch()
    {
        $sql = " SELECT Device.* FROM Member.Member JOIN HOYO_IOT.Device ON Member.id=HOYO_IOT.Device.Member_id WHERE GoogleOAuth=:GoogleOAuth AND Device.id=:id AND is_Active='Y' ";
        $pre = $this->member->prepare($sql);
        $pre->bindValue(':GoogleOAuth', $_POST['userId']);
        $pre->bindValue(':id', $_POST['id']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            $device = $pre->fetch(2);

            $client = stream_socket_client('tcp://127.0.0.1:3004', $no, $msg, 5);
            // 推送的数据，包含uid字段，表示是给这个uid推送
            $data = array('SN'=>$device['SN'], 'pin'=>$_POST['pin'], 'switch'=>$_POST['power']);
            // 发送数据，注意5678端口是Text协议的端口，Text协议需要在数据末尾加上换行符
            fwrite($client, json_encode($data)."\n");
            // 读取推送结果
            echo fread($client, 8192);

            //
            $table = $device['Member_id'] .'_'. $device['SN'] .'_io';
            $power = $_POST['power']=='on'? '1': '0';
            $sql = " UPDATE $table SET `". $_POST['pin'] ."`='". $power ."'";
            //echo $sql;
            $pre = $this->device->prepare($sql);
            $pre->execute();

            $Return = array( 'Result'=>true, 'Data'=>$data );

        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function SearchSituation()
    {
        $sql = " SELECT Situation.* FROM Member.Member JOIN HOYO_IOT.Situation ON Member.id=HOYO_IOT.Situation.Member_id WHERE GoogleOAuth=:GoogleOAuth AND is_Active='Y' ";
        $pre = $this->member->prepare($sql);
        $pre->bindValue(':GoogleOAuth', $_POST['userId']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            $data = $pre->fetchAll(2);
            $Return = array( 'Result'=>true, 'Data'=>$data );

        }
        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }


    //
    function SituationControl()
    {
        //
        $sql = " SELECT Device.*, SituationControl.Action FROM Situation JOIN SituationControl ON Situation.id = SituationControl.Situation_id JOIN Device ON Device.id = SituationControl.Device_id WHERE Situation.Token=:Token ";
        $pre = $this->db->prepare($sql);
        $pre->bindValue(':Token', $_GET['Token']);
        $pre->execute();

        if ( $pre->rowCount() >=1 ){

            while( $device = $pre->fetch(2) ) {

                $client = stream_socket_client( 'tcp://127.0.0.1:3004', $no, $msg, 1 );
                // 推送的数据，包含uid字段，表示是给这个uid推送
                $data = array( 'SN' => $device['SN'], 'pin' => $device['DigitalIO'], 'switch' => $device['Action'] );
                // 发送数据，注意5678端口是Text协议的端口，Text协议需要在数据末尾加上换行符
                fwrite( $client, json_encode( $data ) . "\n" );

                // 读取推送结果
                echo fread( $client, 8192 );
            }

            $Return = array( 'Result'=>true, 'Data'=>'' );
        }

        else{
            $Return = array( 'Result'=>true, 'Message'=>'001' );
        }

        echo json_encode($Return);
    }

    //
    function Chart()
    {
        $sql = " SELECT Device.*, Member.id AS Member_id FROM Member.Member JOIN HOYO_IOT.Device ON Member.id=HOYO_IOT.Device.Member_id WHERE GoogleOAuth=:GoogleOAuth AND Device.id=:id AND is_Active='Y' ";
        $pre = $this->member->prepare($sql);
        $pre->bindValue(':GoogleOAuth', $_POST['userId']);
        $pre->bindValue(':id', $_POST['id']);
        $pre->execute();

        //print_r($pre->fetch(2));

        if ( $pre->rowCount() >=1 ){

            $device = $pre->fetch(2);

            // DataColumn
            $col = '';
            $d = explode(',', $device['DataColumn']);
            foreach( $d as $k=>$v ){
                $col .= "ROUND(SUM($v)/COUNT($v)) AS $v,";
            }
            $col = rtrim($col, ',');

            $table = $device['Member_id'] .'_'. $device['SN'] .'_data';
            $sql = " SELECT DATE_FORMAT(Create_Time, '%Y-%m-%d %H:%i:00') AS Create_Time, $col FROM $table GROUP BY YEAR(Create_Time), MONTH(Create_Time), DAY(Create_Time), HOUR(Create_Time), MINUTE(Create_Time) ORDER BY Create_Time DESC LIMIT 60 ";
            //echo $sql;
            $pre = $this->device->prepare($sql);
            $pre->execute();
            $row = $pre->fetchAll(2);
            krsort($row);

            //print_r($row);

            $r = '[';

            $d = explode(',', $device['DataColumn']);
            foreach( $d as $k=>$v ) {

                $r .= '{"label":"'. $v .'", "data":[';
                $i = 1;
                foreach ( $row as $rk => $rv ) {
                    $r .= '[' . ( strtotime( $rv['Create_Time'] ) * 1000 + ( 8 * 60 * 60 * 1000 ) ) . ',' . $rv[$v] . ']';
                    if ( $i < count( $row ) ) {
                        $r .= ',';
                    }

                    $i ++;
                }
                $r .= ']},';
            }
            $r = rtrim($r, ',');

            $r .= ']';
            echo $r;
            //$Return = array( 'Result'=>true, 'Data'=>'' );
        }

        else{
            echo '[0]';
            //$Return = array( 'Result'=>true, 'Message'=>'001' );
        }

    }

}
