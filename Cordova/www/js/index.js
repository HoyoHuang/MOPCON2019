
var IoTServer = 'https://iot.hoyo.idv.tw';
var ssid ='';
var bssid;
var IoTAPName ='';
var IoT='';
var $header = '';
var $page = [];
var smartConfigTimeOut = 20;

var $lang = {
    '{menu/User/Situation}':'情境設定',
    '{menu/User/IoT}':'我的 IoT'
};

var body = $('body');

var $bodyHtml = $('#content').html();

$.each($lang, function(k,v){
    $bodyHtml = str_replace(k, v, $bodyHtml);
});

$('#content').html($bodyHtml);

//
document.addEventListener("deviceready", function(){

    //alert('aaa');

    var permissions = cordova.plugins.permissions;
    var permission = [
        permissions.INTERNET,
        permissions.ACCESS_NETWORK_STATE,
        permissions.ACCESS_WIFI_STATE,
        permissions.CHANGE_WIFI_MULTICAST_STATE,
        permissions.CHANGE_WIFI_STATE
    ];

    // 要求、檢查 定位 權限
    permissions.checkPermission(permission, function(){

        // alert('已經授權');

    }, function(){

        permissions.requestPermission(permission, function(){

            alert('完成授權');

        }, function(){

            alert('拒絕授權');

        } );
    });

    // 倒退
    $(document).on('backbutton', function () {
        if ( $page.length >1 ) {
            var p = $page.pop();
            pageChange(p);
        }
        else{
            navigator.notification.confirm(
                'Are you sure you want to quit?',
                function (buttonIndex) {
                    if (buttonIndex === 1) {
                        navigator.app.exitApp();
                    }
                },
                '離開！？',
                ['是', '否']
            );
        }
    });

}, false);

//
function showAP(){
    // 取得 WiFi SSID
    WifiWizard.getCurrentSSID(function(s){
        alert(s);
    }, function(){});

}

//
function start(){

    ssid = ssid.replace( /^"/, '');
    ssid = ssid.replace( /"$/, '');

    //
    espSmartconfig.startConfig(ssid, bssid, "sly123456", "NO", 1, function(res){
        alert(JSON.stringify(res));
    }, function(){});
}

function stop(){

    espSmartconfig.stopConfig(function(res) {
        alert(JSON.stringify(res));
    }, function(error){
        alert(error);
    });

}


// fingerprint
function fingerprint() {
    window.plugins.googleplus.getSigningCertificateFingerprint(
        function (fingerprint) {
            alert(fingerprint);
        }
    );
}

// 登入
function login() {
    window.plugins.googleplus.login({},
        function (obj) {
            // alert(JSON.stringify(obj));
            var $json = JSON.stringify(obj);

            // Token
            $.ajax({
                url: IoTServer +'/?a=API&b=GetUserToken',
                type: 'post',
                dataType: 'json',
                data: {
                    userId: window.localStorage.userId,
                    Email: obj['email'],
                    Name: obj['displayName']
                },
                success: function(json){

                    var h = '';
                    if ( json['Result']===true ){
                        window.localStorage.displayName = obj['displayName'];
                        window.localStorage.userId = obj['userId'];
                        window.localStorage.email = obj['email'];
                        window.localStorage.Token = json['Token'];

                        $('.userName').html(window.localStorage.displayName);
                    }

                    else{
                        new jBox('Notice',{
                            content:'登入錯誤'+ json['Message'],
                            color:'red',
                            position:{x:'center', y:'top'},
                            zIndex:12000,
                            autoClose: 1500
                        });
                    }

                    pageChange('#page_DeviceList');
                }
            });

            $('.LoginNo').hide();
            $('.LoginYes').show();
            $('.sidenav').sidenav().close();

        },
        function (msg) {
            alert('登入錯誤: ' + msg);
        }
    );
}

// 登出
function logout(){
    window.localStorage.clear();

    $('.LoginYes').hide();
    $('.LoginNo').show();
}

//
function back(){

    $('#idFormSmartConfig').hideLoading();
    espSmartconfig.stopConfig(function() {}, function(){});
    $('#idButtonSmartConfig').attr('disabled', false);

    if ( $page.length >1 ) {
        var p = $page.pop();
        pageChange(p);
    }
    else{
        navigator.notification.confirm(
            'Are you sure you want to quit?',
            function (buttonIndex) {
                if (buttonIndex === 1) {
                    navigator.app.exitApp();
                }
            },
            '離開！？',
            ['是', '否']
        );

    }
}

//
function pageChange($val){
    $('.page').hide();
    $($val).show();

    switch($val){

        case '#page_DeviceList':
            deviceList();
            break;

        case '#page_SmartConfig':

            // 取得 WiFi SSID
            WifiWizard.getCurrentSSID(function(s){
                ssid = s;

                s = s.replace( /^"/, '');
                s = s.replace( /"$/, '');

                $('#idSSID').val(s);

                M.updateTextFields();

            }, function(){});

            // 取得 WiFi BSSID
            WifiWizard.getCurrentBSSID(function(s){
                bssid = s;
                $('#idBSSID').val(s);

                M.updateTextFields();

            }, function(){});

            break;

        case '#page_Situation':
            searchSituation();
            break;

    }
}

//
function searchSituation(){
    // Token
    $.ajax({
        url: IoTServer +'/?a=API&b=SearchSituation',
        // url: IoTServer +'/?a=API&b=SearchDevice',
        type: 'post',
        dataType: 'json',
        data: {
            userId: window.localStorage.userId
        },
        success: function(json){

            var h = '';
            if ( json['Result']===true ){

                $.each( json['Data'], function(k,v){
                    var t = $('#templateSearch').clone();

                    var tt = t.html();
                    tt = str_replace('{id}', v['id'], tt);
                    tt = str_replace('{Name}', v['Name'], tt);
                    tt = str_replace('{Token}', v['Token'], tt);
                    tt = str_replace('{LinkURL}', IoTServer +'/?a=API&b=SituationControl&Token='+ v['Token'], tt);
                    h += tt;
                } );
            }

            else{
                new jBox('Notice',{
                    content:'錯誤'+ json['Message'],
                    color:'red',
                    position:{x:'center', y:'top'},
                    zIndex:12000,
                    autoClose: 1500
                });
            }

            $('#page_SearchSituation').html(h);

            $('.toolTipped').tooltip();
        }
    });

}

//
function action($Token){
    $.ajax({
        url: IoTServer +'/?a=API&b=SituationControl',
        type: 'get',
        dataType: "json",
        data: {
            Token: $Token
        },
        success: function(json) {

        }
    });
}

//
function pageAdd(){
    $('.page').each(function(){
        if ( $(this).is(":visible") ){
            $page.push('#'+ $(this).attr('id'));
        }
    });
}

//
function addDevice(){

    pageAdd();

    pageChange('#page_SmartConfig');

    M.updateTextFields();

    headerName('新增');
}

//
function headerName($val){
    $('#header').html($val);
}

//
function device($id){
    // alert($id);

    pageAdd();
    pageChange('#page_Device');

    $.ajax({
        url: IoTServer +'/?a=API&b=GetDevice',
        type: 'post',
        dataType: 'json',
        data: {
            id: $id,
            userId: window.localStorage.userId
        },
        success: function(json){

            var io;
            var h = '';
            var ioh = '';
            if ( json['Result']===true ){

                v = json['Data'];

                if ( v['DigitalIO'].length >=1 ){
                    io = $('#templateDeviceControl').clone();

                    ioh = io.html();

                    $('#deviceControl').show().html(ioh);
                }
                else{
                    $('#deviceControl').hide().html('');
                }

                var t = $('#page_Device').clone();

                var tt = t.html();
                tt = str_replace('{id}', v['id'], tt);
                tt = str_replace('{Name}', v['Name'], tt);
                h += tt;
            }

            else{
                new jBox('Notice',{
                    content:'錯誤'+ json['Message'],
                    color:'red',
                    position:{x:'center', y:'top'},
                    zIndex:12000,
                    autoClose: 1500
                });
            }

            $('#page_Device').html(h);
        }
    });

}

//
function deviceControl($id, $name, $column){

    pageAdd();
    pageChange('#page_DeviceControl');

    // var t = $('#page_DeviceControl').html();
    // t = str_replace('{Name}', $name, t);

    var t = $('#page_DeviceControl').clone();
    t.find('.Name').text($name);
    var tt = t.html();
    $('#page_DeviceControl').html(tt);

    var e = explode(',', $column);

    $.each( e, function(k,v){

        io = $('#templatePushSwitch').clone();
        ioh = io.html();
        ioh = str_replace('{id}', $id,ioh);
        ioh = str_replace('{io}', v,ioh);
        $('#showPushSwitch').show().html(ioh);

    } );

}

//
function pushSwitch($id, $pin, obj){

    var $this = $(obj);
    var $power;

    if ( $this.hasClass('grey') ){
        $power = 'on';
        $this.removeClass('grey').addClass('green');
    }
    else{
        $power = 'off';
        $this.removeClass('green').addClass('grey');
    }

    $.ajax({
        url: IoTServer +'/?a=API&b=PushSwitch',
        type: 'post',
        dataType: 'json',
        data: {
            id: $id,
            pin: $pin,
            userId: window.localStorage.userId,
            power: $power
        },
        success: function(json){

            var io;
            var h = '';
            var ioh = '';
            if ( json['Result']===true ){
                v = json['Data'];
            }

            else{
                new jBox('Notice',{
                    content:'錯誤'+ json['Message'],
                    color:'red',
                    position:{x:'center', y:'top'},
                    zIndex:12000,
                    autoClose: 1500
                });
            }

        }
    });

}

//
function deviceList(){
    // Token
    $.ajax({
        url: IoTServer +'/?a=API&b=SearchDevice',
        type: 'post',
        dataType: 'json',
        data: {
            userId: window.localStorage.userId
        },
        success: function(json){

            var h = '';
            if ( json['Result']===true ){

                $.each( json['Data'], function(k,v){
                    var t = $('#templateDevice').clone();

                    // 根據欄位 處理並排大小 class 以及顯示
                    if ( v['DataColumn'].length >=1 && v['DigitalIO'].length >=1 ){
                        t.find('#buttonData').addClass('s6');
                        t.find('#buttonControl').addClass('s6');
                    }
                    else {
                        if ( v['DataColumn'].length >=1 || v['DigitalIO'].length >=1 ){
                            t.find('#buttonData').addClass('s12');
                            t.find('#buttonControl').addClass('s12');

                            if ( v['DataColumn'].length >=1 ){
                                t.find('#buttonData').show();
                                t.find('#buttonControl').hide();
                            }
                            else{
                                t.find('#buttonData').hide();
                                t.find('#buttonControl').show();
                            }

                        }
                        else{
                            t.find('#buttonData').hide();
                            t.find('#buttonControl').hide();
                        }
                    }

                    var tt = t.html();
                    tt = str_replace('{id}', v['id'], tt);
                    tt = str_replace('{Name}', v['Name'], tt);
                    tt = str_replace('{column_io}', v['DigitalIO'], tt);
                    tt = str_replace('{column_data}', v['DataColumn'], tt);
                    h += tt;
                } );

            }

            else{
                new jBox('Notice',{
                    content:'錯誤'+ json['Message'],
                    color:'red',
                    position:{x:'center', y:'top'},
                    zIndex:12000,
                    autoClose: 1500
                });
            }

            $('#search_DeviceList').html(h);
        }
    });

}

//
$(function(){

    // Header
    headerName('列表');

    //
    Modal = new jBox('Modal', {
        title: "",
        blockScroll:false,
        fade:false,
        animation:'',
        closeButton:'title',
        overlay:true,
        closeOnClick: false,
        closeOnEsc: false,
        onOpen: function(event, ui) {
            $("body").css({ overflow: 'hidden' });
        },
        onClose: function(event, ui) {
            $("body").css({ overflow: 'inherit' });
        }
    });

    //
    $('#idUserName').jBox('Tooltip', {
        closeOnMouseleave: true,
        trigger:"click",
        content: $('#ModalLoginYes')
    });

    //
    if ( window.localStorage.length >=1 ) {

        // 已登入
        if (window.localStorage.displayName.length >= 1) {
            // $('#userId').html(window.localStorage.userId);

            $('.LoginNo').hide();
            $('.LoginYes').show();
            $page.push('#page_DeviceList');
            pageChange('#page_DeviceList');

            $('.userName').html(window.localStorage.displayName);
        }

        // 未登入
        else {
            $('.LoginNo').show();
            $('.LoginYes').hide();
        }
    }

    // 未登入
    else{
        $('.LoginNo').show();
        $('.LoginYes').hide();
    }

    // Nav Menu
    $('.sidenav').sidenav({
        onCloseEnd: function(){
            // $('.collapsible').collapsible().close();
        }
    });

    //
    $('.collapsible').collapsible({
        onOpenEnd: function(obj){
            var $this = $(obj);
            var nowStatus = $this.find('a').find('.badge').html();
            if ( nowStatus =='chevron_left' ){
                $this.find('a').find('.badge').html('expand_more');
            }
            else{
                $this.find('a').find('.badge').html('chevron_left');
            }
        },
        onCloseEnd: function(obj){
            var $this = $(obj);
            console.log();
            var nowStatus = $this.find('a').find('.badge').html();
            if ( nowStatus =='chevron_left' ){
                $this.find('a').find('.badge').html('expand_more');
            }
            else{
                $this.find('a').find('.badge').html('chevron_left');
            }
        }
    });

    // UI 完成  顯示網頁
    body.show();

    //
    $("#idFormSmartConfig").submit(function(){}).validationEngine({
        onValidationComplete: function(form, status) {
            if (status === true) {

                var startSC = time();

                $('#idFormSmartConfig').showLoading();

                $('#idButtonSmartConfig').attr('disabled', true);

                //alert('submit');

                ssid = ssid.replace( /^"/, '');
                ssid = ssid.replace( /"$/, '');

                setTimeout(function(){
                    $('#idFormSmartConfig').hideLoading();
                    espSmartconfig.stopConfig(function() {}, function(){});
                    clearTimeout(checkAP);
                }, 20000);

                //
                espSmartconfig.startConfig(ssid, bssid, $('#idPassword').val(), "NO", 1, function(res){
                    
                    // device bssid ip
                    var json = JSON.parse(res);
                    alert(json['ip']);

                    $('#idFormSmartConfig').hideLoading();

                    // 顯示切換 AP 提醒
                    pageChange('#page_ChangeAP');

                    // stop
                    espSmartconfig.stopConfig(function() {}, function(){});

                    // clearTimeout($timeout);

                    // AP 切換
                    var checkAP = setInterval(function(){

                        WifiWizard.getCurrentSSID(function(s){

                            ssid = ssid.replace( /^"/, '');
                            ssid = ssid.replace( /"$/, '');

                            s = s.replace( /^"/, '');
                            s = s.replace( /"$/, '');

                            // alert(s +'-'+ ssid);

                            // 切換到 IoT AP
                            if ( ssid !== s && s !=='' ){
                                IoT = str_replace('HoyoIoT_', '', s);
                                // alert( window.localStorage.userId + IoT );

                                // 切換回原 AP
                                WifiWizard.connectNetwork(ssid, function(){}, function(){});

                                setTimeout(function(){
                                    $.ajax({
                                        url: IoTServer +'/?a=API&b=UserBindIoT',
                                        type: 'post',
                                        dataType: 'json',
                                        data: {
                                            userId: window.localStorage.userId,
                                            SN: IoT
                                        },
                                        success: function(json){

                                            var h = '';
                                            if ( json['Result']===true ){

                                                clearTimeout(checkAP);

                                                //
                                                new jBox('Notice',{
                                                    content:'綁定完成',
                                                    color:'blue',
                                                    position:{x:'center', y:'top'},
                                                    zIndex:12000,
                                                    autoClose: 1500
                                                });
                                            }

                                            else{
                                                new jBox('Notice',{
                                                    content:'綁定錯誤'+ json['Message'],
                                                    color:'red',
                                                    position:{x:'center', y:'top'},
                                                    zIndex:12000,
                                                    autoClose: 1500
                                                });
                                            }

                                            $("#idSearchUserList").html(h);
                                        }
                                    });

                                }, 3000);

                                pageChange('#page_DeviceList');
                            }

                        }, function(){});

                    }, 500);

                }, function(){});

                $('#idButtonSmartConfig').attr('disabled', false);

            }
        },
        validationEventTrigger: '',
        autoHidePrompt: true,
        autoHideDelay: 2000,
        promptPosition:"bottomLeft",
        validateNonVisibleFields: false,
        prettySelect: true,
        scroll:false
    });

});
