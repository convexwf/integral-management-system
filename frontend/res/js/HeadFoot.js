$(function() {
    // 如果为手机厅版本，则隐藏导航及页尾
    // if (App.versionType == "iphone" || App.versionType == "android" || App.versionType == "client"
    //         || App.versionType == "o2m") {
    //     $(".top_border").hide();
    // }else{
    //     $(".top_border").show();
    // }
    if(App.versionType == "wx"){
        $(".backHome").show();
    }
    $(".search_div a").click(function () {
        var searchKey=$(".search_div input").val();
        if(searchKey){
            window.location.href=Esf.contextPath+"/jf-mall/msearchKeyword?keyword="+searchKey;
        }
    });
    $(".search_div img").click(function () {
        $(".search_div input").val("");
    });
    //回到顶部
    $("#top").click(function() {
        $("html,body").animate({scrollTop:0}, 500);
    });
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 20) {
            $("#top").show();
        }else{
            $("#top").hide();
        }
    });
});
function checkLimit(limitProvincesStr,limitUserTypesStr){

    if(limitProvincesStr==null||limitProvincesStr==""){
        return false;
    }
    if(limitProvincesStr!='99'){
        var cityCookie=$.cookie("jfcity");
        if(cityCookie!=null&&cityCookie!=""){
            var jfprovince=cityCookie.split("|")[0];
            if(jfprovince==null&&jfprovince=="") {
                return false;
            }
            var limitProvinces = limitProvincesStr.split(",");
            if($.inArray(jfprovince,limitProvinces)<0){
                return false;
            }
        }
    }
    if(limitUserTypesStr==null||limitUserTypesStr=="") {
        return false;
    }
    var jfuser=$.cookie("jfuser");
    if(jfuser!=null&&jfuser!="") {
        var jfuserArray=jfuser.split("|");
        var limitUserTypes = limitUserTypesStr.split(",");
        //限制随机码不能兑换商品
        if("06" == jfuserArray[0]) {
            $(".loginTip").show();
        }else {
            $(".loginTip").hide();
        }
        //不在可通过名单
        if ($.inArray(jfuserArray[0], limitUserTypes)<0){
            return false;
        }
        var cityCookie=$.cookie("jfcity");
        if(cityCookie!=null&&cityCookie!="") {
            var jfprovince = cityCookie.split("|")[0];
            if (jfprovince) {
                $.ajax({
                    url: Esf.contextPath + "/jf-mall/supportg?province=" + jfprovince,
                    type: "get",
                    dataType : "json",
                    success: function (data) {
                        if (data != '1001' && data != '1002') {
                            if ($.inArray(jfuserArray[1], data.split(",")) < 0) {
                                return false;
                            }
                        }
                    }
                });
            }
        }

        if(goodsInfo.goodsType&&goodsInfo.goodsType=='1003'){
            if((jfuserArray[0]=='01'||jfuserArray[0]=='06')&&jfuserArray[2]=='99'){
                return true;
            }else{
                return false;
            }
        }
    }
    return true;
}
$(function(){
    $(".maskError").click(function () {
        $(this).hide();
    });
    //点击收藏
    $(".top_name  .loving").click(function (){
        if(goodsInfo.goodsId){
            if($(".top_name  .loving").hasClass("no_collect")){
                $.ajax({
                    url : Esf.contextPath+"/jf-order/MobAddFavourite",
                    contentType: 'application/json;charset=UTF-8',
                    data :JSON.stringify({"goodsId": ""+goodsInfo.goodsId}),
                    type : "post",
                    success : function(data){
                        if("0000" == data.resultcode){
                            //收藏成功
                            if($(".top_name  .loving").hasClass("no_collect")){
                                $(".top_name  .loving").removeClass("no_collect").addClass("collect");
                            }
                        }else if("1001" == data.resultcode){
                            App.showLoginPage(window.location.href, Esf.loginUrl, Esf.callbackUrl);
                        }else if("2001" == data.resultcode){
                            Message.showMessage(data.resultdesc);
                        }else if("1002" == data.resultcode) {
                            Message.showMessage("您的账户类型暂不支持收藏商品");
                        }else{
                            Message.showMessage("系统繁忙，请稍候再试！");
                        }
                    }
                });
            }
        }
    });
    $(".shopping_car").click(function () {
        $.ajax({
            url: Esf.contextPath + "/jf-order/auth/checklogin/02",
            type: "get",
            dataType: 'json',
            success: function (result) {
                LS.item(goodsInfo.goodsId + "_count", $(".factor_need .num input").val());
                if (result.resultcode == "0000") {
                    window.location.href = Esf.contextPath + "/jf-order/mobcart/cart/";
                }else if (result.resultcode == "1001") {
                    window.location.href = Esf.loginUrl + window.location.href;
                }else{
                    Message.showMessage(result.resultdesc);
                }
            }
        });
    });
})