
// WebSocket
var ws = new WebSocket(wsHost);

// 彈幕
var barrageHeight = 40;
var lineCount = Math.round((window.innerHeight - 30) / barrageHeight);
var barrageCount = 0;
var barrageMessage = $('#idBarrageMessage');
var userName = '';
var userCover = '';

//
var dieTime = 40*60;

//
function init(){

    ws.onopen = function(){
        console.log('WebSocket Start');
        wsSend(uniqid(), 'join', '');
    };

    ws.onclose = function(){
        alert('連不上 WebSocket Server 請檢查網路');
    };

    // 接收
    ws.onmessage = function(msg){
        var json = JSON.parse( msg.data );
        //console.log(json);

        switch( json['command'] ){

            //
            case 'showBarrage':
                showBarrage(json['value']);
                break;

            default :
        }

    };
}

init();

barrageMessage.on('keypress', function(e){
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        sendBarrageMessage();
        e.preventDefault();
        return false;
    }
});

//
function showBarrage($j){
    //console.log($data);
    //var $j = JSON.parse( $data );

    barrageCount = $j['barrageCount'];

    $('body').barrager({
        img:  $j['userCover'],
        info: htmlspecialchars($j['userName'] +': '+ $j['info']),
        href: 'javascript:void(0)',
        speed: 10,
        color: '#000',
        bottom: ( (lineCount-(barrageCount%lineCount)) * barrageHeight ) -30
    });
}

//
function wsSend(b,c,d) {
    var command = {
        'room': 'main',
        'player': b,
        userName: userName,
        userCover: userCover,
        barrageCount: barrageCount,
        'command': c,
        'value': d
    };
    ws.send( JSON.stringify(command) );
}

/*
 var item={
 img:'static/heisenberg.png', //图片
 info:'弹幕文字信息', //文字
 href:'http://www.yaseng.org', //链接
 close:true, //显示关闭按钮
 speed:6, //延迟,单位秒,默认6
 bottom:70, //距离底部高度,单位px,默认随机
 color:'#fff', //颜色,默认白色
 old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
 }

 高 40
 */
function sendBarrageMessage(){
    barrageCount++;
    wsSend('', 'sendBarrage', barrageMessage.val());
    barrageMessage.val('');
}

var googleUser = {};
var startApp = function() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '41386861907-i3093ieo0htqj96rut34op8np229givs.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin'//,
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'profile email'
        });
        attachSignin(document.getElementById('googleLogin'));
    });
};

startApp();

//
function attachSignin(element) {
    //console.log(element.id);
    auth2.attachClickHandler(element, {}, function(googleUser) {
        onSignIn(googleUser);
    }, function(error) {
        alert(JSON.stringify(error, undefined, 2));
    });
}

//
function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();

    $('#idGoogleLogin').hide();
    $('#idShowBarrage').show();

    userName = profile.getName();
    userCover = profile.getImageUrl();
}

// 程式碼高亮
$('pre.code').each(function(k,v){
    console.log(v);
    hljs.highlightBlock(v);
});

//
$(function(){

    // 啟用 reveal.js
    Reveal.initialize({
        width: '100%',
        controls: true,
        progress: true,
        history: true,
        center: true,
        transition: 'convex' // none/fade/slide/convex/concave/zoom
    });

});


