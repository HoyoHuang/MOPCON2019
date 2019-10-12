<?php
namespace Layout;


class Store
{

    public static function index()
    {
        $layout = file_get_contents(HDPath . '/page/Layout/Admin.html');

        $dom = \phpQuery::newDocumentHTML($layout);

        // 將當前網頁加上 class
        //$dom->find('#menu'. str_replace('/', '', $_GET['a']))->addClass('activeLink');

        $html = $dom;
        $html = str_replace( '::version::', uniqid(), $html );
        $html = str_replace( '{{'. $_GET['a'] .'}}', 'activeLink', $html );

        // 選單
        if ( $_GET['a'] =='Admin/Message' || $_GET['a'] =='Admin/GroupPush' ){
            $html = str_replace( '{{Menu_LINE}}', 'active', $html );
        }

        return $html;
    }

}
