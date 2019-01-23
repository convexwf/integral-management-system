<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/10/19
 * Time: 21:28
 */
header("Access-Control-Allow-Origin: *");
include("ConnDB.php");
$getTel=$_POST['tel'];
$getBusinessID=$_POST['businessID'];
#$getTel='13631374709';
#$getBusinessID='BS10020000000001';
$businessType = substr($getBusinessID, 2, 4);

$sql_Account=mysqli_query($conn, "SELECT userID, currentBalance FROM Account WHERE telephone = '".$getTel."'");
$result_Account = mysqli_fetch_assoc($sql_Account);
if(empty($result_Account))
{
    $back['status'] = "-3";
    $back['info'] = "用户不存在";
    echo(json_encode($back));
    mysqli_close($conn);
    return;
}
$getID = $result_Account['userID'];
$currentBalance = $result_Account['currentBalance'];

$sql_Business = mysqli_query($conn, "SELECT changeBalance FROM Business WHERE businessID = '".$getBusinessID."'");
$result_Business = mysqli_fetch_assoc($sql_Business);
$changeBalance = $result_Business['changeBalance'];
if($currentBalance + $changeBalance < 0)
{
    $back['status'] = "-4";
    $back['info'] = "余额不足";
    echo(json_encode($back));
    mysqli_close($conn);
    return;
}


switch ($businessType)
{
    case '1001':# 签到
        mysqli_query($conn, "SET @status = -1");
        mysqli_query($conn, "call process_Business('".$getID."','".$getBusinessID."', NULL, @status)");
        $result_status = mysqli_fetch_assoc(mysqli_query($conn, "SELECT @status"));
        $status = $result_status['@status'];
        if ($status != 0) {
            $back['status'] = "-2";
            $back['info'] = "数据库错误";
        }
        else {
            $back['status'] = "0";
            $back['info'] = "Successfully";
        }
        break;
    case '1002':# 充值
        mysqli_query($conn, "SET @status = -1");
        mysqli_query($conn, "call process_Business('".$getID."','".$getBusinessID."', NULL, @status)");
        $result_status = mysqli_fetch_assoc(mysqli_query($conn, "SELECT @status"));
        $status = $result_status['@status'];
        if ($status != 0) {
            $back['status'] = "-2";
            $back['info'] = "数据库错误";
        }
        else {
            $back['status'] = "0";
            $back['info'] = "Successfully";
        }
        break;
    case '1003':# 套餐
        mysqli_query($conn, "SET @status = -1");
        mysqli_query($conn, "call process_Business('".$getID."','".$getBusinessID."', NULL, @status)");
        $result_status = mysqli_fetch_assoc(mysqli_query($conn, "SELECT @status"));
        $status = $result_status['@status'];
        if ($status != 0) {
            $back['status'] = "-2";
            $back['info'] = "数据库错误";
        }
        else {
            $back['status'] = "0";
            $back['info'] = "Successfully";
        }
        break;
    case '1004':# 流量
        mysqli_query($conn, "SET @status = -1");
        mysqli_query($conn, "call process_Business('".$getID."','".$getBusinessID."', NULL, @status)");
        $result_status = mysqli_fetch_assoc(mysqli_query($conn, "SELECT @status"));
        $status = $result_status['@status'];
        if ($status != 0) {
            $back['status'] = "-2";
            $back['info'] = "数据库错误";
        }
        else {
            $back['status'] = "0";
            $back['info'] = "Successfully";
        }
        break;
    case '1005':# 活动
        mysqli_query($conn, "SET @status = -1");
        mysqli_query($conn, "call process_Business('".$getID."','".$getBusinessID."', NULL, @status)");
        $result_status = mysqli_fetch_assoc(mysqli_query($conn, "SELECT @status"));
        $status = $result_status['@status'];
        if ($status != 0) {
            $back['status'] = "-2";
            $back['info'] = "数据库错误";
        }
        else {
            $back['status'] = "0";
            $back['info'] = "Successfully";
        }
        break;
    default:
        $back['status'] = "-1";
        $back['info'] = "不合法操作";
        break;
}

echo(json_encode($back));
mysqli_close($conn);