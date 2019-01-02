/**
 * 手机APP
 */
var App = {
    changeProvince : function() {
        // TODO:省份展示
        var url = document.location.href;
        var arr = url.match(/goodsId=(\d{2})(\d+)/);
        if (arr[1] != "99") {
            $("#province_detail option[value=" + arr[1] + "]").attr("selected", "selected");
        }
    },
    getVersionType : function() {
        if (this.version && this.version.length > 0) {
            return this.version.indexOf("iphone") >= 0 ? 'iphone'
                : this.version.indexOf("android") >= 0 ? 'android' : this.version;
        }else{
            var cookieVer = $.cookie("MUT_V");
            if(cookieVer != null && cookieVer.length > 0){
                return cookieVer.split("@")[0].toLowerCase();
            }
        }
        return null;
    },
    getVersionTypeByCookie : function() {
        var versionCookie = $.cookie('MUT_V');
        if (versionCookie && versionCookie.length > 0) {
            return versionCookie.indexOf("iphone") >= 0 ? 'iphone'
                    : versionCookie.indexOf("android") >= 0 ? 'android' : versionCookie;
        }
        return null;
    },
    getVersionNumByCookie : function() {
        var versionCookie = $.cookie('MUT_V');
        if (versionCookie && versionCookie.length > 0) {
            return versionCookie.split("@")[1];
        }
        return null;
    },
    /**
     * URL中加入ticket以及version参数
     * 
     * @param currUrl
     *            原始URL
     * @returns {String} 封装后的URL
     */
    getParamStr : function(currUrl) {
        if (this.ticket && this.ticket.length > 0) {
            var sep1 = currUrl.indexOf('?') > 0 ? '&' : '?';
            currUrl += sep1 + "ticket=" + this.ticket;
        }
        if (this.version && this.version.length > 0) {
            var sep2 = currUrl.indexOf('?') > 0 ? '&' : '?';
            currUrl += sep2 + "version=" + this.version;
        }

        return currUrl;
    },
    /**
     * 拉起登录页
     * 
     * @param storeUrl
     *            登录后的回调地址
     * @param loginUrl
     *            网页版使用的登录页
     */
    showLoginPage : function(storeUrl, loginUrl, callbackUrl) {
        // alert("versionType: " + this.versionType + " storeUrl:" + storeUrl);
        var storeUrl4Client = callbackUrl + storeUrl;
        if ('android' == this.versionType) {// 安卓
            js_invoke.interact("{\"type\":\"shoplogin\",\"shopUrl\":\"" + storeUrl4Client + "\"}");
            return;
        } else if ('iphone' == this.versionType) { // iphone
            window.location.href = "clientAction={\"type\":\"shoplogin\",\"shopUrl\":\"" + storeUrl4Client + "\"}";
            return;
        }
        var redirectUrl = decodeURIComponent(loginUrl) + "&state=" + storeUrl;
        // 网页版
        window.location.href = redirectUrl;
    },

    /**
     * 返回到商城首页 下方5个按钮
     */
    showIndexPage : function(homeUrl) {
        if ('android' == this.versionType) { // 安卓
            js_invoke.interact("{\"type\":\"close\",\"msg\":\"\",\"url\":\"\"}");
            return;
        } else if ('iphone' == this.versionType) { // iphone
            window.location = "clientAction={\"type\":\"close\",\"msg\":\"\",\"url\":\"\"}";
            return;
        }
        // 网页版
        window.location.href = homeUrl;
    },
    checkLogin : function() {
        $.ajax({
            url: Esf.contextPath + "/jf-order/auth/checklogin/02",
            type: "get",
            dataType: 'json',
            success: function (result) {
                if (result.resultcode == "0000") {
                    return true;
                }else {
                    App.showLoginPage(window.location.href, Esf.loginUrl, Esf.callbackUrl);
                }
            }
        });
    }
};
function getParamVal(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
}


(function() {
    App.ticket = getParamVal("ticket");
    App.version = getParamVal("version");
    if ((App.version == null || App.version == '') && typeof(js_invoke) != 'undefined') {
        var info = $.parseJSON(js_invoke.getClientInfoByJS());
        if(info != null && info.clientVersion != null && info.clientVersion != ''){
            App.version = info.clientVersion;
        }
    }
    // 将verson写入cookie
    if (App.version != null && App.version != ''){
        $.cookie("MUT_V", App.version, {
            path : "/"
        });
    }
    // 将ticket写入cookie
    if(App.ticket == null || App.ticket == '' ){
        App.ticket = $.cookie("MUT_T");
    }else{
        //让cookies在5分钟后过期
        var now = new Date();
        now = new Date(now.getTime() + (5 * 60 * 1000));
        
        $.cookie("MUT_T", App.ticket, {path : "/" ,expires: now});
    }
    /**
     * App类型 android， iphone，其他（网页访问）
     */
    App.versionType = App.getVersionType();
    
    App.versionNum = App.getVersionNumByCookie();
    
    App.versionTypeByCookie = App.getVersionTypeByCookie();
    
    App.versionNumByCookie = App.getVersionNumByCookie();
    /**
     * 是否为通过网页访问
     */
    App.isWeb = App.versionType != 'android' && App.versionType != 'iphone'
            && App.versionType != 'ap' && App.versionType != 'wx';

})();
// 为页面中每个Form表单自动添加隐藏域
$(function() {
    if (App.version && App.version.length > 0) {
        $("form").each(function() {
            $(this).append("<input type='hidden' name='version' value='" + App.version + "' />");
        });
    }
    if (App.ticket && App.ticket.length > 0) {
        $("form").each(function() {
            $(this).append("<input type='hidden' name='ticket' value='" + App.ticket + "' />");
        });
    }

    // ajax调用全局处理
    var ajaxErrorHandler = function(XMLHttpRequest, textStatus, errorThrown) {
        var   msg = "当前购买的人数过多，请稍候再试！";
        Message.showMessage(msg);
        $(".mask").hide();
        $(".loading").hide();
    };
    $.ajaxSetup({
        beforeSend : function() {
            $(".loading").show();
            $(".mask").show().height($(document).height());
        },
        complete : function() {
            $(".loading,.mask").hide();
        },
        error : ajaxErrorHandler
    });

});


function getMenuConfig_Local(){
    var shareJson = "{\"shareType\":\"url\"," +
        "\"shareTitle\":\"联通积分商城尽享回馈“心”服务\"," +
        "\"shareContent\":\"中国联通积分商城，是中国联通基于积分回馈计划，面向全国客户提供的统一积分服务和消费应用平台。联通积分客户可通过积分商城自助进行积分查询、参与积分活动，并根据自己的积分数量兑换相应价值的各类积分礼品。\"," +
        "\"shareURL\":\"https://m.jf.10010.com\"," +
        /*"\"shareIconURL\":\""+Esf.contextPath+"/jf-res/mobile/images/share.png\"}";*/
        "\"shareIconURL\":\"https://res.mall.10010.cn/jf-mall/res/mobile/images/share.png\"}";

    return 		 "{\"config\" : [ {\"code\":\"shoucang\",\"title\":\"收藏\",\"menuId\":\"000200010001\",\"desc\":\"\"}," +
        "{\"code\":\"ding\",\"title\":\"顶一下\",\"desc\":\"\"}," +
        "{\"code\":\"cai\",\"title\":\"踩一下\",\"desc\":\"\"}," +
        "{\"code\":\"fenxiang\",\"title\":\"分享\",\"shareList\":\"sinaweibo,tencentweibo,qzone,wechat,wechatmoments,email,shortmessage,qq\",\"desc\":\"开启沃的移动互联生活发现真实的自己！ http://u.10010.cn/2015517fg\",\"shareJson\":" + shareJson + "}," +
        "{\"code\":\"tucao\",\"title\":\"吐槽\",\"desc\":\"\"}," +
        "{\"code\":\"shouye\",\"title\":\"首页\",\"desc\":\"回到首页\"}" +
        "]}";
}
