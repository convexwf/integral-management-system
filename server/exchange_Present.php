<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/12/1
 * Time: 16:50
 */

header("Access-Control-Allow-Origin: *");
include("ConnDB.php");

$getTel=$_POST['tel'];
$getPresentID=$_POST['presentID'];

$sql_Account=mysqli_query($conn, "SELECT userID, currentIntegral FROM Account WHERE telephone = '".$getTel."'");
$result_Account = mysqli_fetch_assoc($sql_Account);
$getID = $result_Account['userID'];
$currentIntegral = $result_Account['currentIntegral'];

$sql_Present=mysqli_query($conn, "SELECT costIntegral FROM Present WHERE presentID = '".$getPresentID."'");
$result_Present = mysqli_fetch_assoc($sql_Present);
$costIntegral = $result_Present['costIntegral'];

if($currentIntegral >= $costIntegral) {

    mysqli_query($conn, "SET @status = -1");
    mysqli_query($conn, "call process_Business('".$getID."', 'BS10060000000001', '".$getPresentID."', @status)");
    $result_status = mysqli_fetch_assoc(mysqli_query($conn, "SELECT @status"));
    $status = $result_status['@status'];
    if($status == 0)
    {
        $result['status'] = "0";
        $result['info'] = "兑换成功";
    }
    else {
        $result['status'] = "-2";
        $result['info'] = "数据库错误";
    }

}
else {
    $result['status'] = "-1";
    $result['info'] = "积分不足";
}
echo (json_encode($result));


