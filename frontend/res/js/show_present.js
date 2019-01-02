$(function () {
    alert("LLL");
    init();
});

function init() {
    $(".notice .ok").click(function() {
        alert("LSA")
    })
    alert("LSA")
    $(".foods_list .pro_list").empty();
    freshGoodsList(2001);
}
function freshGoodsList(searchPresentType) {
    
$.ajax({  
        type: 'POST',  
        url: 'query_Present.php',  
        data:{  
            "type":searchPresentType
//            "username":"admin",  
//            "password":"123456"  
        },  
        success: function (data) {  
            var result=eval("("+data+")");  
            alert(result);  
            for(var i=0;i<result.length;i++){  
                var str='<div class="home1">'+  
                        '<img src="'+result[i][1]+'" alt="'+result[i][3]+'"/>'+  
                        '<p><a href="'+result[i][2]+'">'+result[i][3]+'</a></p>'+  
                        '<div class="price">'+  
                        '<span>￥'+result[i][4]+'</span>'+  
                        '<del>￥'+result[i][5]+'</del>'+  
                        ' <a href="#">预定：<b>'+result[i][6]+'</b>件</a>'  
                '</div> </div>'  
                $(".box7 #hotSale").append(str);//追加到你需要放在的位置  
            }  
        }  
    });$.ajax({  
        type: 'POST',  
        url: 'db.php',  
        data:{  
//            "username":"admin",  
//            "password":"123456"  
        },  
        success: function (data) {  
            var result=eval("("+data+")");  
            alert(result);  
            for(var i=0;i<result.length;i++){  
                var str='<div class="home1">'+  
                        '<img src="'+result[i][1]+'" alt="'+result[i][3]+'"/>'+  
                        '<p><a href="'+result[i][2]+'">'+result[i][3]+'</a></p>'+  
                        '<div class="price">'+  
                        '<span>￥'+result[i][4]+'</span>'+  
                        '<del>￥'+result[i][5]+'</del>'+  
                        ' <a href="#">预定：<b>'+result[i][6]+'</b>件</a>'  
                '</div> </div>'  
                $(".box7 #hotSale").append(str);  
            }  
        }  
    });  
    
    
    
    
    $.ajax({
        alert("lll")
        url: Esf.contextPath + "/jf-mall/msearchClassify/freshGoodsList/" + searchCriteria,
        type: "get",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var goodsList = $.parseJSON(result);
            if (goodsList&&goodsList.length>0) {
                $.each(goodsList, function (n, value) {
                    var className = "";
                    if (n % 2 == 0) {
                        className = "div_left";
                    } else {
                        className = "div_right";
                    }
                    $(".foods_list .pro_list").append('<div class="' + className + '" goodsId="' + value.id + '"><a href="'+Esf.mobileDetail.format(value.id)+'"><img src="' + value.photoLink + '"><p class="pro_nm">' + value.name + '</p><p class="int_jf">' + parseInt(value.pointPrice) + '积分</p></a></div>');
                });
                goodsInfo.currentPage = 1 + parseInt(goodsInfo.currentPage);
                if(goodsList.length>=12){
                    $("#w-loading").show();
                    $("#f-loading").hide();
                }else{
                    $("#w-loading").hide();
                    $("#f-loading").show();
                }
            } else {
                $("#w-loading").hide();
                $("#f-loading").show();
            }
        },
        beforeSend : function() {
        },
        complete : function() {
        }
    });
}