function FormPost(formData, postUrl, successFunction) {
    try {
        $.ajax({
            type: 'post',
            url: postUrl,
            dataType: 'json',
            data: formData,
            global: true,
            success: successFunction,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('服务器繁忙，状态码：' + XMLHttpRequest.status);
            },
            complete: function (XMLHttpRequest, textStatus) {
            }
        })
    }
    catch (e) {
        alert('系统繁忙，原因：' + e);
    }
}

function GetUrlArgs(name) {
    var args = new Object();
    var query = location.search.substring(1); //获取查询串      
    var pairs = query.split("&"); //在逗号处断开      
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); //查找name=value      
        if (pos == -1) continue; //如果没有找到就跳过      
        var argname = pairs[i].substring(0, pos); //提取name
        if (name == argname) {
            var value = pairs[i].substring(pos + 1); //提取value   
            return unescape(value);
            //args[argname]=unescape(value);//存为属性
        }
    }
    return args; //返回对象      
}

function GetjsonDataItems(jsonData, name) {
    try {
        for (var key in jsonData) {
            if (key == name) {
                return jsonData[key];
            }
        }
        return null;
    }
    catch (e) {
        alert('GetjsonDataItems 出错，原因：' + e);
        return null;
    }
}

function GetTreeAttrData(attrData, name) {
    try {
        for (var i = 0; i < attrData.length; i++) {
            for (var key in attrData[i]) {
                if (key == name) {
                    return attrData[i][key];
                }
            }
        }
        return null;
    }
    catch (e) {
        alert('GetTreeAttrData 出错，原因：' + e);
        return null;
    }
}

function CheckjsonHelperData(jsonData) {
    try {
        if (jsonData.Success) {
            return true;
        }
        else {
            if (jsonData.RedirectUrl == "") {
                ShowJsonMsg(jsonData.Message);
            } else {
                if (confirm(jsonData.Message)) {
                    window.open(jsonData.RedirectUrl);
                }
            }
            return false;
        }
    }
    catch (e) {
        alert('CheckjsonHelperData 出错，原因：' + e);
        return false;
    }
}

function ShowJsonMsg(msg) {
    if (msg != null && msg != '') {
        alert(msg);
    }
}

function StartWait(msg) {
    var targetStr = '<div><img src="../Content/Img/WaitProcess.gif" style="border:none;margin-right:10px;height:15px;width:15px;"/><span class="pop_win_wait">' + msg + '</span></div>';
    $.openPopupLayer({
        name: 'process_wait_Layer',
        target: targetStr
    });
}

function CancelWait() {
    $.closePopupLayer('process_wait_Layer');
}

function StartWaitold(id, waitMsg) {
    try {
        if (id == null) {
            $.blockUI({
                message: '<h1 style="font-size:11pt;vertical-align:middle;height:25px;line-height:25px;margin-top:13px;"><img src="../Content/Img/WaitProcess.gif" style="border:none;margin-right:10px;height:15px;width:15px;"/>' + waitMsg + '</h1>',
                css: {
                    border: 'none',
                    width: 'auto',
                    'padding-left': '10px',
                    'padding-right': '10px',
                    'vertical-align': 'middle',
                    'text-align': 'center',
                    backgroundColor: '#000',
                    opacity: .8,
                    color: '#fff'
                },
                overlayCSS: {
                    backgroundColor: '#ffffff',
                    opacity: 0
                },

                centerX: true,
                centerY: true,
                showOverlay: true
            });
        }
        else {
            id = ChangeId(id);
            $(id).block({
                message: '<h1 style="font-size:11pt;vertical-align:middle;height:25px;line-height:25px;margin-top:13px;"><img src="../Content/Img/WaitProcess.gif" style="border:none;margin-right:10px;height:15px;width:15px;"/>' + waitMsg + '</h1>',
                css: {
                    border: 'none',
                    width: 'auto',
                    'padding-left': '10px',
                    'padding-right': '10px',
                    'vertical-align': 'middle',
                    'text-align': 'center',
                    backgroundColor: '#000',
                    opacity: .8,
                    color: '#fff'
                },
                overlayCSS: {
                    backgroundColor: '#ffffff',
                    opacity: 0
                },

                centerX: true,
                centerY: true,
                showOverlay: true
            });
        }
    }
    catch (e) {
        alert('StartWait 出错，原因：' + e);
        return null;
    }
}

function CancelWaitOld(id) {
    alert(id);
    try {
        if (id == null) {
            $.unblockUI();
        } else {
            id = ChangeId(id);
            $(id).unblock();
            //$(".blockUI").fadeOut("fast");
        }
    }
    catch (e) {
        alert('CancelWait 出错，原因：' + e);
        return null;
    }
}

function ShowFormDialog(id) {
    try {
        id = ChangeId(id);
        $.blockUI({ message: $(id),
            centerY: 0,
            css: { width: 'auto',
                height: 'auto',
                'border-style': 'none',
                left: '5px',
                top: '10px',
                backgroundColor: '#000'
            },
            overlayCSS: { backgroundColor: '#fff', opacity: 0.6, cursor: 'default' }
        });
    }
    catch (e) {
        alert('ShowFormDialog 出错，原因：' + e);
        return null;
    }
}

function ChangeId(id) {
    if (id.indexOf("#") != 0) {
        return '#' + id;
    }
    return id;
}

function ClearTxtVal(id) {
    id = ChangeId(id);
    $(id).val("");
}

function TxtValTrim(id) {
    id = ChangeId(id);
    var obj = $(id);
    obj.val($.trim(obj.val()));
}

function ResetDropList(id) {
    var obj = document.getElementById(id);
    if (obj.options.length > 0) {
        obj.options[0].selected = true;
    }
}

function GetFormData(formName) {
    try {
        alert(window.document.forms[formName].elements.length);
        if (window.document.forms[formName] == null) {
            alert('GetFormValues 出错，找不到 Form');
            return null;
        }
        var result = [];
        for (var i = 0; i < window.document.forms[formName].elements.length; i++) {
            var element = window.document.forms[0].elements[i];
            var elementName = element.name;
            var elementTagName = element.tagName.toLowerCase();
            var elementType = element.type;

            //获取CheckBox和Radio值
            if (elementTagName == 'input' && (elementType == 'checkbox' || elementType == 'radio')) {
                if (element.checked) {
                    var val = "on";
                    if (el.getAttribute("value") != null) {
                        val = element.value;
                    }
                    result.push({ name: elementName, value: val });
                }
                else {
                    result.push({ name: elementName, value: 'off' });
                }
            }

            //获取Text、Password、hidden值
            if (elementTagName == 'input' && (elementType == 'text' || elementType == 'hidden' || elementType == 'password')) {
                result.push({ name: elementName, value: $(element).val() });
            }

            //获取TextArea值
            if (elementTagName == 'textarea') {
                result.push({ name: elementName, value: $(element).val() });
            }

            //获取Select值
            if (elementTagName == 'select' && element.selectedIndex >= 0 && element.options.length > 0) {
                for (var j = 0; j < element.options.length; j++) {
                    if (element.options[j].selected) {
                        result.push({ name: elementName, value: element.options[j].value });
                    }
                }
            }
        }

        return $.param(result);
    }
    catch (e) {
        alert('GetFormData 出错，原因:' + e);
        return null;
    }
}

function IsDisplay(id) {
    var obj = document.getElementById(id);
    if (obj.style.display == 'none') {
        return true;
    }
    return false;
}

function ClearSelect(id) {
    var obj = document.getElementById(id);
    if (obj.options.length > 0) {
        obj.options[0].selected = true;
    }
}

function ClearInput(id) {
    var obj = document.getElementById(id);
    obj.value = '';
}

function ShowModalDialog(url, arguments, width, height) {
    return window.showModalDialog(url, arguments, 'dialogWidth:' + width + 'px; dialogHeight:' + height + 'px;help:0;status:0;resizeable:1;scroll:1');
}



function FormLoading(id) {
    var html = '<div id="' + id + '" style="position:absolute;left:0px;width:100%;height:100%;top:0px;background:#000000;opacity:0.8;filter:alpha(opacity=80);z-index:9999;color:#ffffff;text-align:center;"> 正在加载，请等待... </div>';
    document.write(html);
    alert('OK');
    //$('<div class="datagrid-mask" id="' + id + '"></div>').css({ display: 'block', width: '100%', height: $(window).height() }).appendTo('body');
    //$('<div class="datagrid-mask-msg"></div>').html('正在处理，请稍候。。。').appendTo('body').css({ display: 'block', left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 }); 

}

function OpenPopWindow(popName, ifmId, conDivId, url, winWidth, winHeight) {
    var divId = ifmId + '_title_id';
    var targetStr = '<div><div id="' + divId + '"><span class="pop_win_wait">正在加载页面数据...</span></div><iframe id="' + ifmId + '" src="' + url + '" style="width:' + winWidth + 'px;height:' + winHeight + 'px;" frameborder="0"></iframe></div>';
    $.openPopupLayer({
        name: popName,
        target: targetStr
    });
    $('#' + ifmId).load(function () {
        var contentDiv = $(this).contents().find('#' + conDivId);
        contentDiv.width(winWidth);
        contentDiv.height(winHeight - 30);
        var divObj = $('#' + divId);
        divObj.hide();
    });
}

function ClosePopWindow(popName, closeConfirmMessage) {
    if (typeof (closeConfirmMessage) == "undefined" || closeConfirmMessage == null) {
        $.closePopupLayer(popName);
    } else {
        if (confirm(closeConfirmMessage)) {
            $.closePopupLayer(popName);
        }
    }
}