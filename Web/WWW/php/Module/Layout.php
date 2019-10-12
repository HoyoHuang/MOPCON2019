<?php
namespace Module;


class Layout
{
	public static function index()
	{
        global $memberPDO;

		$layout = file_get_contents(HD_PATH .'/page/Layout/index.html');

        $dom = \phpQuery::newDocument($layout);

		// 登入
		if ( $_SESSION['UserInfo']['id'] ){
            $dom->find('.LoginNo')->remove();
		}

		//
		else{
            $dom->find('.LoginYes')->remove();
		}

        $html = $dom;
        $html = str_replace( '::version::', uniqid(), $html );

        //
        foreach( $_ENV['menu'] as $k=>$v ){
            $html = str_replace( '{menu/'. $k .'}', $v, $html );
        }

        // 作用中網頁
        $html = str_replace( '{'. $_GET['a'] .'}', 'activeLink', $html );
        $html = str_replace('{UserName}', $_SESSION['UserInfo']['name'], $html);

        $sql = " SELECT * FROM Member.Member WHERE id=:id ";
        $pre = $memberPDO->prepare($sql);
        $pre->bindValue(':id', $_SESSION['UserInfo']['Member_id']);
        $pre->execute();
        $member = $pre->fetch(2);

        $html = str_replace('{UserEmail}', $member['Email'], $html);

        return $html;
	}

    //
	public static function Store()
	{
		//global $PDO;

		$layout = file_get_contents(HD_PATH .'/page/Layout/Store.html');

        $dom = \phpQuery::newDocument($layout);

		// 登入
		if ( $_SESSION['UserInfo']['id'] ){
            $dom->find('.LoginNo')->remove();
		}

		//
		else{
            $dom->find('.LoginYes')->remove();
		}

        $html = $dom;
        $html = str_replace( '::version::', uniqid(), $html );
        $html = str_replace( '{'. $_GET['a'] .'}', 'activeLink', $html );


        return $html;
	}


}
