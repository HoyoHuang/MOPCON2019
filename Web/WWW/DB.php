<?php

//
const webRoot = 'iot.hoyo.idv.tw';

//
const MYSQL_Host="127.0.0.1";
const MYSQL_USERNAME = "username";
const MYSQL_PASSWORD = "password";
const MYSQL_Table="HOYO_IOT";
define( "PDO_DSN", "mysql:dbname=". MYSQL_Table .";host=". MYSQL_Host .";charset=utf8" );
$PDO = new \PDO(PDO_DSN, MYSQL_USERNAME, MYSQL_PASSWORD);

// IoT device 使用資料庫
$PDO_Device = new \PDO("mysql:dbname=HOYO_IOT_Device;host=127.0.0.1;charset=utf8", "username", "password");

const MEMBER_MYSQL_HOST="127.0.0.1";
const MEMBER_MYSQL_USERNAME="username";
const MEMBER_MYSQL_PASSWORD="password";
const MEMBER_MYSQL_DBNAME="Member";
define( "MEMBER_PDO_DSN", "mysql:dbname=". MEMBER_MYSQL_DBNAME .";host=". MEMBER_MYSQL_HOST .";charset=utf8" );
$memberPDO = new \PDO(MEMBER_PDO_DSN, MEMBER_MYSQL_USERNAME, MEMBER_MYSQL_PASSWORD);

// Session Cookie 跨網域名稱設定
ini_set('session.cookie_domain', 'hoyo.idv.tw');
