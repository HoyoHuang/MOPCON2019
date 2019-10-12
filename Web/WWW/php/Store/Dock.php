<?php
namespace Store;

use \Module\Layout;
use \Module\Permission;


class Dock
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
        $layout = Layout::Store();

        $first = file_get_contents(HDPath .'/page/Store/Dock.html');

        //
        $html = str_replace('{{content}}', $first, $layout);

        $dom = \phpQuery::newDocument($html);

        // 登入
        if ( $_SESSION['UserInfo']['id'] ) {
            $dom->find('.LoginNo')->remove();


            $dom = str_replace('{UserName}', $_SESSION['UserInfo']['name'], $dom);
            //$html = str_replace('{{webRoot}}', webRoot, $dom);
            //$html = str_replace('::WebURL::', WebURL, $html);
            $dom = str_replace('::version::', uniqid(), $dom);


        }
        else {
            $dom->find('.LoginYes')->remove();
        }

        echo $dom;
    }

}
