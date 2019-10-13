<?php

\App\MySQL::CheckConnection();

try {

    echo $data."\n";

    $sql = " SELECT * FROM Device WHERE SN=:SN ";
    $pre = $db->prepare($sql);
    $pre->bindValue(':SN', $json['player']);
    $pre->execute();
    if ( $pre->rowCount() >=1 ) {

        $device = $pre->fetch(2);

        //
        $sql = " SELECT Device.*, SituationControl.Action FROM Situation JOIN SituationControl ON Situation.id = SituationControl.Situation_id JOIN Device ON Device.id = SituationControl.Device_id WHERE Situation.Member_id=:Member_id AND RemotePin=:RemotePin ";
        $pre = $db->prepare($sql);
        $pre->bindValue(':Member_id', $device['Member_id']);
        $pre->bindValue(':RemotePin', $json['value']);
        $pre->execute();
        while(  $row = $pre->fetch(2) ) {
            $client = stream_socket_client( 'tcp://127.0.0.1:3004', $no, $msg, 1 );
            if ( !$client ){
                echo $no."\n";
            }
            else {
                // 推送的数据，包含uid字段，表示是给这个uid推送
                $c = array( 'SN' => $row['SN'], 'pin' => $row['DigitalIO'], 'switch' => $row['Action'] );
                print_r( $c );

                // 发送数据，注意5678端口是Text协议的端口，Text协议需要在数据末尾加上换行符
                fwrite( $client, json_encode( $c ) . "\n" );
                // 读取推送结果
                //echo fread( $client, 8192 );
                //fclose($client);
            }
        }

    }

} catch (\PDOException $e){
    //echo 'MySQL: '. date('Ymd His') .' '. $e->getMessage(). "\n";
}
