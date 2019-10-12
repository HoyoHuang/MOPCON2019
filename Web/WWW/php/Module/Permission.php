<?php
namespace Module;


class Permission
{

    //
    public static function Login()
    {
        if ( $_SESSION['UserInfo']['id'] =='' ){
            return false;
        }
        return true;
    }

    //
    public static function isPrivate($ip)
    {
        if ( $ip == '61.216.48.163' ) return true;

        $i = explode('.', $ip);

        if ($i[0] == 10) {
            return true;
        } else if ($i[0] == 172 && $i[1] > 15 && $i[1] < 32) {
            return true;
        } else if ($i[0] == 192 && $i[1] == 168) {
            return true;
        }
        return false;
    }

}
