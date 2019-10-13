<?php

echo $data."\n";
$_client[$json['value']] = $connection;

$json = array( 'result'=>true, 'id'=>$connection->id );
echo json_encode($json)."\n";
$connection->send(json_encode($json)."\n");
