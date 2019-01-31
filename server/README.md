# 后端设计

这个部分实现的是数据库后端与前端的连接，充当着一个通道的作用。

首先是这部分的核心：`ConnDB.php`，首先定义了一些 `host`，用户名 `user`，密码 `password`，数据库 `database` 的值，和端口号 `port`。然后利用函数 `mysqli_connect()` 将数据库的连接固定，即完成对后端的连接。当连接错误时也会报错。

```php
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
```

紧接着便是登陆：`login.php`，这个文件是用来验证用户的手机号和密码是否正确，如果正确则返回用户的信息，否则返回错误信息。

```php
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
```

值得一提的是加密算法 `encrypt.php`。

```php
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
```

这个算法设计是为了对用户的密码 `password` 进行加密，使其不容易被泄露。具体算法如上图所示。

1. 首先选择两个简单的质数 p 和 q，令 $n=p*q$，再选择一个数 e 与 n 互质，保证 $e*d ==1 mod (p-1)*(q-1)$。这样便可以得到公钥 `(n,e)` 和私钥 `(n,d)`。
2. 此公钥和私钥在 ajax 中能派上用场，在此不详细叙述。
3. 通过函数 `RSA_encrypt()` 对密码进行转换存储在数据库中。
4. 如果需要获得密码，则通过函数 `RSA_decrypt()` 进行解析即可。这样保证了用户密码的安全性，也避免了密码遗失造成的不便。

实现查询功能的有 `query_Account.php`, `query_ICR.php` 和 `query_Present.php` 三个文件，三个 php 内容类似。

实现结算功能有 `exchange_Present.php`(兑换礼物)以及 `Process_businese.php`(签到，购买流量，充值，购买套餐，参加活动)。

`exchange_Present.php` 中通过数据库获得账户和积分信息。并且对兑换的礼物的积分，如果用户积分大于等于礼物积分则兑换成功，小于则会返回兑换失败。
