<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/11/21
 * Time: 19:07
 */
    header("Access-Control-Allow-Origin: *");
    include("ConnDB.php");

    $ip=$_SERVER['REMOTE_ADDR'];
    $time=date("Y-m-d H:i:s");
    $file=fopen("ip.txt","a+");
    fwrite($file,str_pad($ip,15," ",1)." ".$time."\n");
    fclose($file);

    $getType=$_POST['type'];
    $sql=mysqli_query($conn,"SELECT * FROM Present WHERE presentType = '".$getType."'");

    if(mysqli_num_rows($sql))
    {
        $result = mysqli_fetch_all($sql);
    }
    else
    {
        mysqli_error();
    }
    echo(json_encode($result));
    mysqli_close($conn);
    /*
    $count = 0;
    while(true)
    {
        $result = mysqli_fetch_assoc($sql_result);
        if(empty($result)) break;
        $presentID = $result['presentID'];
        $presentName = $result['presentName'];
        $presentType = $result['presentType'];
        $presentPrice = $result['presentPrice'];
        $costIntegral = $result['costIntegral'];
        $count += 1;
        $back[$count] = array($presentID, $presentName, $presentType, $presentPrice, $costIntegral);
    }

    echo(json_encode($back));
    */