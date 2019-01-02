/**
 * Created by bigsun on 2016-5-5.
 */
if (!this.MBase) {
    this.MBase = {};
}
;
MBase.setCookie = function (name, value, expires, path, domain, secure) {
    // set time, it's in milliseconds
    var today = new Date();
    today.setTime(today.getTime());
    // if the expires variable is set, make the correct expires time, the
    // current script below will set it for x number of days, to make it
    // for hours, delete * 24, for minutes, delete * 60 * 24
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    // alert( 'today ' + today.toGMTString() );// this is for testing
    // purpose only
    var expires_date = new Date(today.getTime() + (expires));
    // alert('expires ' + expires_date.toGMTString());// this is for testing
    // purposes only

    document.cookie = name + "=" + value + ((expires) ? ";expires=" + expires_date.toGMTString() : "") + // expires.toGMTString()
        ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ((secure) ? ";secure" : "");
};
/**
 * @description 从cookie中获取省市
 */
MBase.getCookieProvince = function () {
    var locationInfo = $.cookie("mallcity");
    return locationInfo.split("|")[0];
}
/**
 * @description 从cookie中获取地区
 */
MBase.getCookieCity = function () {
    var locationInfo = $.cookie("mallcity");
    return locationInfo.split("|")[1];
}