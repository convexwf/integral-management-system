<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/11/15
 * Time: 22:31
 */
header("Access-Control-Allow-Origin :*") ;
$ip=$_SERVER['REMOTE_ADDR'];
$time=date("Y-m-d H:i:s");
$file=fopen("ip.txt","a+");
fwrite($file,str_pad($ip,15," ",1)." ".$time."\n");
fclose($file);
?>