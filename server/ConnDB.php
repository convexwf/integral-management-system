<?php
/**
 * Created by PhpStorm.
 * User: Lonelinessqwf
 * Date: 2017/10/11
 * Time: 15:54
 */

define("host", "localhost");
define("user", "root");
define("password", "admin123");
define("database", "db_IntegralManagementSys");
define("port", "3306");
$conn=mysqli_connect(host, user, password, database, port);

if($conn->connect_errno)
{
    "Connect Error:".$conn->connect_error;
}

$conn->set_charset('utf8');
?>