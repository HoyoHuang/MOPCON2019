<?php

\App\MySQL::CheckConnection();

try {

    //print_r($json['value']);

    $sql = " SELECT * FROM Device WHERE SN=:SN ";
    $pre = $db->prepare($sql);
    $pre->bindValue(':SN', $json['player']);
    $pre->execute();
    if ( $pre->rowCount() >=1 ) {

        $row = $pre->fetch(2);
        $device_id = $row['id'];

        $table = $row['Member_id'] .'_'. $json['player'] .'_data';

        $column = $values = '';
        $columnTemp = explode(',', $row['DataColumn']);
        foreach( $columnTemp as $k=>$v ){
            $column .= $v.',';
            $values .= ':'. $v .',';
        }
        $column = rtrim( $column, ',' );
        $values = rtrim( $values, ',' );

        $sql = " INSERT INTO $table ( $column ) VALUES ( $values )  ";
        $pre = $db_Device->prepare($sql);

        foreach( $columnTemp as $k=>$v ){
            $pre->bindValue(':'. $v, $json['value'][$v]);
        }

        $pre->execute();

        if ( $pre->errorCode() !='00000' ){
            print_r($pre->errorInfo());
        }
    }

} catch (\PDOException $e){
    //echo 'MySQL: '. date('Ymd His') .' '. $e->getMessage(). "\n";
}
