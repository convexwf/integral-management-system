<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/11/30
 * Time: 20:00
 */

header("Access-Control-Allow-Origin: *");
include("ConnDB.php");

$getTel=$_POST['tel'];
//$getTel='13631374709';

$sql_Account=mysqli_query($conn, "SELECT userID FROM Account WHERE telephone = '".$getTel."'");
$result_Account = mysqli_fetch_assoc($sql_Account);
$getUserID = $result_Account['userID'];
//$getUserID="AC17100604585115";

$sql_ICR=mysqli_query($conn,"SELECT changeID, changeTime, changeValue, reason, reasonExtra FROM IntegralChangeRecord 
                                      WHERE integralID in 
                                (SELECT integralID FROM Integral WHERE userID = '".$getUserID."') ORDER BY changeTime DESC");

$count = 0;
while (true)
{

    $result_ICR = mysqli_fetch_assoc($sql_ICR);
    if(empty($result_ICR)) break;
    $changeID = $result_ICR['changeID'];
    $changeTime = $result_ICR['changeTime'];
    $changeValue = $result_ICR['changeValue'];
    $reason = $result_ICR['reason'];
    $reasonExtra = $result_ICR['reasonExtra'];
    $sql_Business = mysqli_query($conn,"SELECT businessName FROM Business WHERE businessID = '".$reason."'");
    $result_Business = mysqli_fetch_assoc($sql_Business);
    $name = $result_Business['businessName'];
    if($reason == "BS10060000000001")
    {
        $sql_Present = mysqli_query($conn, "SELECT presentName FROM Present WHERE presentID = '".$reasonExtra."'");
        $result_Present = mysqli_fetch_assoc($sql_Present);
        $name =  $name . " " . $result_Present['presentName'];
    }

    $back[$count++] = array($changeID, $changeTime, $changeValue, $name);
}
echo(json_encode($back));
mysqli_close($conn);