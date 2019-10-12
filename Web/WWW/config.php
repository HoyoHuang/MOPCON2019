<?php
// ini Set
ini_set('date.timezone','Asia/Taipei');

const HDPath = __DIR__;

// 常數
require HDPath .'/DB.php';

const HD_PATH = __DIR__;

//
$_ENV['menu'] = array();
$_ENV['menu'][''] = 'Home';
$_ENV['menu']['Help/Document'] = '說明文件';
$_ENV['menu']['User/IoT'] = '我的 IoT';
$_ENV['menu']['User/Situation'] = '情境設定';
$_ENV['menu']['Store/Device'] = '發行自己的 IoT';
