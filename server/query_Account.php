<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/11/21
 * Time: 15:51
 */
    header("Access-Control-Allow-Origin: *");
    include("ConnDB.php");
    $gettel=$_POST['tel'];//客户端post过来的手机号

    $sql=mysqli_query($conn,"SELECT * FROM Account WHERE telephone ='$gettel'");
    $result=mysqli_fetch_assoc($sql);
    if(!empty($result)){
        //存在该用户
        $get_balance = $result['currentBalance'];
        $get_integral = $result['currentIntegral'];
        $get_dataflow = $result['currentDataflow'];

        $back['status']="0";
        $back['balance'] = (int)$get_balance;
        $back['integral'] = (int)$get_integral;
        $back['dataflow'] = (int)$get_dataflow;
        echo(json_encode($back));
    }
    else{
        //不存在该用户
        $back['status']="-1";
        $back['info']="user not exist";
        echo(json_encode($back));
    }
