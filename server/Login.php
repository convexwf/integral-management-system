<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/10/19
 * Time: 14:45
 */
    header("Access-Control-Allow-Origin: *");//支持跨域请求，问题所在
    include ("ConnDB.php");
    $ip=$_SERVER['REMOTE_ADDR'];
    $time=date("Y-m-d H:i:s");
    $file=fopen("ip.txt","a+");
    fwrite($file,str_pad($ip,15," ",1)." ".$time."\n");
    fclose($file);
    $gettel=$_POST['tel'];//客户端post过来的手机号
    $getpwd=$_POST['pwd'];//客户端post过来的密码
    $sql=mysqli_query($conn,"SELECT * FROM Account WHERE telephone ='$gettel'");
    $result=mysqli_fetch_assoc($sql);
    if(!empty($result)){
        //存在该用户
        if($getpwd==$result['password']){
            $back['status']="0";
            $back['info']="login success";
            echo(json_encode($back));
        }else{/*密码错误*/
            $back['status']="-2";
            $back['info']="password error";
            echo(json_encode($back));
        }
    }
    else{
        //不存在该用户
        $back['status']="-1";
        $back['info']="user not exist";
        echo(json_encode($back));
    }

    mysqli_close($conn);
