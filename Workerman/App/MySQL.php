<?php
namespace App;


class MySQL {

    public static function CheckConnection()
    {
        global $db, $db_Device;

        try {
            $db->query('select 1');
        } catch (\PDOException $e) {
            $db = new \PDO("mysql:dbname=". MySQL_Database .";host=". MySQL_Host .";charset=utf8", MySQL_Username, MySQL_Password, array(
                \PDO::ATTR_PERSISTENT => true, // 長連結
                \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
            )); //
            $db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

            $db_Device = new \PDO("mysql:dbname=HOYO_IOT_Device;host=". MySQL_Host .";charset=utf8", MySQL_Username, MySQL_Password, array(
                \PDO::ATTR_PERSISTENT => true, // 長連結
                \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
            ));
            $db_Device->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        }
    }

}

