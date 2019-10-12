<?php
namespace User;

use \Module\Layout;


class index {
    function __construct() {

        global $PDO;
        $this->db = $PDO;

        if ( ! empty( $_GET['b'] ) ) {
            $MethodName = $_GET['b'];
            switch ( $MethodName ) {
                case ( preg_match( '/\w/', $MethodName ) ? true : false ):
                    if ( method_exists( __CLASS__, $MethodName ) ) {
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

    //
    function Page()
    {
        $header = $_ENV['menu'][$_GET['a']];

        $layout = Layout::index();
        $first = file_get_contents(HDPath .'/page/Layout/First.html');

        //
        $html = str_replace('{Content}', $first, $layout);

        $dom = \phpQuery::newDocument($html);

        // 登入
        if ( $_SESSION['UserInfo']['id'] ){
            $dom->find('.LoginNo')->remove();
        }

        //
        else{
            $dom->find('.LoginYes')->remove();
        }

        $dom = str_replace('{UserName}', $_SESSION['UserInfo']['name'], $dom);
        $dom = str_replace('{Header}', $header, $dom);

        echo $dom;
    }

}
