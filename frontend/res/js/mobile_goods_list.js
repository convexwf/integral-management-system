$(function () {

    $(".li_condition").on({
        "click": function () {
            if ($(this).find("p").hasClass("condition")) {
                $(this).find("p").removeClass("condition").addClass("condition_sec");
                $("#list_box").hide();
                $(".choose_condition").show();
                $("header .top_border span").text("筛选");
            } else {
                $(this).find("p").removeClass("condition_sec").addClass("condition");
                $("#list_box").show();
                $(".choose_condition").hide();
                $("header .top_border span").text(goodsInfo.headerName);
            }
        }
    })
    $(".kinds_detail span").on({
        "click": function () {
            var ss = $(this).parent().find("span");
            ss.each(function () {
                if ($(this).hasClass("background")) {
                    $(this).removeClass("background");
                    $(this).removeClass("write").addClass("black");
                }
            })
            $(this).addClass("background");
            $(this).removeClass("black").addClass("write");
            $(this).parents(".kinds_choose").find("label").removeClass("background");
        }

    })

    $(".kinds_choose label").on({
        "click": function () {
            var ss = $(this).parents(".kinds_choose").find(".kinds_detail span");
            ss.each(function () {
                if ($(this).hasClass("background")) {
                    $(this).removeClass("background");
                    $(this).removeClass("write").addClass("black");
                }
            })
            $(this).addClass("background");
        }
    })
    $(".li_order ").on({
        "click": function () {
            var state = $(this).attr("state");
            var sortMode = "";
            if (state) {
                if (state == 0) {
                    $(this).attr("state", 1);
                    $(this).find("p").removeClass("no_class").addClass("order_down");
                    sortMode = "603";
                }
                if (state == 1) {
                    $(this).attr("state", 2);
                    $(this).find("p").removeClass("order_down").addClass("order_up");
                    sortMode = "602";
                }
                if (state == 2) {
                    $(this).attr("state", 1);
                    $(this).find("p").removeClass("order_up").addClass("order_down");
                    sortMode = "603";
                }
                $(".li_head").attr("state", 0);
                $(".li_head p").removeClass("go_head").addClass("go_no");
                freshGoodsList(getSearchCriteria(5, sortMode));
            }
        }
    })
    $(".li_head ").on({
        "click": function () {
            var state = $(this).attr("state");
            var sortMode = "607";
            if (state) {
                if (state == 0) {
                    $(this).attr("state", 1);
                    $(this).find("p").removeClass("go_no").addClass("go_head");
                    $(".li_order p").removeClass(".order_down").removeClass("order_up").addClass("no_class");
                    $(".li_order").attr("state", 0);
                    freshGoodsList(getSearchCriteria(5, sortMode));
                }
            }
        }
    });
    $(".ok_choose").click(function () {
        for(i=1;i<5;i++){
            goodsInfo.currentParam[i]=0;
        }
        $(".choose_condition .kinds_detail .write").each(function () {
            var attrValCode = $(this).attr("attrValCode");
            var position = $(this).parents(".kinds_choose").attr("position");
            goodsInfo.currentParam[position]=attrValCode;
        });
        $("#list_box").show();
        $(".choose_condition").hide();
        $(".li_condition").find("p").removeClass("condition_sec").addClass("condition");
        freshGoodsList(getSearchCriteria(6, 1));
    });
    // $("#s-loading").click(function () {
    //     freshGoodsList(getSearchCriteria(6, goodsInfo.currentPage + 1));
    // });
    init();
    $(window).on('scroll', function() {
        var scTop = $(window).scrollTop(), //可视区域距页面顶部高度
            winH = $(window).height(), //可视区域高度
            docH = $('body').height(); //文档整体高度
        if($("#f-loading").is(":visible") == true){
            return;
        }
        if ((scTop + winH) > (docH - 200)) {
            freshGoodsList(getSearchCriteria(6, goodsInfo.currentPage + 1));
        }
    })
});
function init() {
    $(".foods_list .pro_list").empty();
    // $(".li_head ").click();//局方要求手网厅分类搜索页面查询的默认顺序由"销量排序"改为"品牌销量排序"。所以注释掉

    // //页面滚动执行事件
    // $(window).scroll(function () {
    //     loadmore();
    // });
    freshGoodsList(getSearchCriteria(6, goodsInfo.currentPage + 1));
}
function freshGoodsList(searchCriteria) {
    $.ajax({
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
function getSearchCriteria(position, attrValCode) {
    var searchCriteria = "";
    $.each(goodsInfo.currentParam, function (n, value) {
        if (n > 0 && n < goodsInfo.currentParam.length) {
            searchCriteria += "-";
        }
        if ((n == 6 && position != 6)||(n == 6 && position == 6&&attrValCode==1)) {
            searchCriteria += 1;
            goodsInfo.currentParam[n] = 1;
            goodsInfo.currentPage = 0;
            $(".foods_list .pro_list").empty();
        } else if (position == n) {
            goodsInfo.currentParam[n] = attrValCode;
            searchCriteria += attrValCode;
        } else {
            searchCriteria += value;
        }
    });
    return searchCriteria;
}
//加载更多
function loadmore(obj) {
    var finish = 0;
    var isDo = $(".li_condition p").hasClass("condition_sec");//筛选窗口打开时，禁止加载
    var clientHeight = document.documentElement.clientHeight
        || document.body.clientHeight;
    var documentHeight = $(document).height();
    if ($(document).scrollTop() >= (documentHeight - clientHeight) && finish == 0 && isDo != true) {
        finish = 1;
        // 为了测试，延迟1秒加载
        setTimeout(function () {
            freshGoodsList(getSearchCriteria(6, goodsInfo.currentPage + 1));
            finish = 0;
        }, 1000);
    }
}