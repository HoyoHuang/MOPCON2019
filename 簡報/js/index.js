
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
var StartTime = time();
var EndTime = StartTime + dieTime;

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
                if ( $('#barrageSwitch').prop('checked') ) {
                    showBarrage(json['value']);
                }
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

// 倒數計時
setInterval(function(){

    if ( EndTime - time() > 0 ) {
        $('#idTimeCountdown').html( date('i:s', EndTime - time()) );
    }
    else{
        $('body').html('<div style=" font-size: 120px; font-weight: bold; text-align: center; margin-top: 18%;">GG</div>');

        // 刪除所有定時事件
        for (var i = 1; i < 99; i++)
            window.clearInterval(i);
    }

}, 500);

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

// 程式碼高亮
$('pre.code').each(function(k,v){
    hljs.highlightBlock(v);
});

//
$(function(){

    // 啟用 reveal.js
    Reveal.initialize({
        width: 1024,
        minScale: 0.2,
        maxScale: 2.0,
        controls: true,
        progress: true,
        history: true,
        center: false,
        transition: 'fade' // none/fade/slide/convex/concave/zoom
    });

});
