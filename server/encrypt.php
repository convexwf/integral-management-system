<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/12/10
 * Time: 22:39
 */
header("Access-Control-Allow-Origin: *");
include("ConnDB.php");
$p=61;
$q=53;
$n=$p*$q;
$e=17;
$d=2753;
$back['n']="3233";
$back['e']="17";
echo(json_encode($back));
function getMod($a,$b,$n){
    $r=1;
	for($i=1;$i<=$b;$i++){
        $r=(($r%$n)*($a%$n))%$n;
    }
	return $r;
}
function RSA_encrypt($m,$n,$e){
    $c=getMod($m,$e,$n);
    return $c;
}
function RSA_decrypt($c,$n,$d){
    $m=getMod($c,$d,$n);
    return $m;
}
?>