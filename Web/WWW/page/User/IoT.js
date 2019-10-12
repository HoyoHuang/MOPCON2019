
var IoTServer = 'https://iot.hoyo.idv.tw';
var $page = [];

//
function back(){
    if ( $page.length >1 ) {
        var p = $page.pop();
        pageChange(p);
    }
    else{

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

    }
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
function addDevice(){

    var m = $('#modalAdd');
    m.width(window.innerWidth -80).height( 500 ); // window.innerHeight - 120
    Modal.setContent(m);
    //Modal.setTitle('新增裝置');
    Modal.open();

    $('#idFormAdd').find('[name="Name"]').focus();
    M.updateTextFields();
}

function device($token){

    window.open('/?a=User/Device&token='+$token);

    //$('#modalDevice').width(window.innerWidth -80).height(window.innerHeight -80);
    //
    //Modal.setContent($('#modalDevice'));
    ////Modal.setTitle('修改');
    //Modal.open();
    //
    //chart();
    //
    //setTimeout(function(){
    //    chart();
    //}, 60000);
}

//
function addData(){
    var t = $('#templateDataColumn').html();
    $('#idDataColumn').append(t);
}

//
function removeData(obj){
    var $this = $(obj);
    $this.parent().parent().remove();
}

//
function addControl(){
    var t = $('#templateControlIO').html();
    $('#idControlIO').append(t);
}

//
function removeControl(obj){
    var $this = $(obj);
    $this.parent().parent().remove();
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
            userId: userId,
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

function switchPower(obj) {
    var $this = $(obj);
    console.log($(obj).prop('checked'));

    $.ajax({
        url: './?a=User/IoT&b=SwitchPower',
        type: 'post',
        dataType: "json",
        data: {
            Status: $(obj).prop('checked')
        },
        success: function(json) {

        }
    });
}

//
function deviceControl($id, $name, $column){

    pageAdd();
    pageChange('#page_DeviceControl');

    var t = $('#page_DeviceControl').clone();
    t.find('.Name').text($name);
    //t = str_replace('{Name}', $name, t);
    var tt = t.html();
    $('#page_DeviceControl').html(tt);

    var e = explode(',', $column);

    $.each( e, function(k,v){

        var io = $('#templatePushSwitch').clone();
        var ioh = io.html();
        ioh = str_replace('{id}', $id,ioh);
        ioh = str_replace('{io}', v,ioh);
        $('#showPushSwitch').show().html(ioh);

    } );

}

//
function deviceData($id, $name, $column){

    pageAdd();
    pageChange('#page_DeviceData');

    var t = $('#page_DeviceData').html();
    t = str_replace('{Name}', $name, t);
    $('#page_DeviceData').html(t);

    //chart($id, $name, $column);

    $.ajax({
        url: IoTServer +'/?a=API&b=Chart',
        type: "post",
        data: {
            id: $id,
            userId: userId
        },
        dataType: "json",
        success: function (series){
            var options = {
                lines: {
                    show: true
                },
                points: {
                    show: true,
                    fill: true,
                    radius: 1
                },
                xaxis: {
                    mode: "time"
                }
            };

            $.plot("#placeholder", series, options);
        }
    });

}

//
function chart($id, $name, $column){

//        var options = {legend:{position:"nw"}};

//        data = [{ data:data1, label:"fixed", lines:{show:true}}
//            ,{ data:data2, label:"linear", lines:{show:true}, points:{show:true}}
//            ,{ data:data3, label:"random", bars:{ show:true, barWidth:0.5}}];

    var options = {
        lines: {
            show: true
        },
        points: {
            show: true,
            fill: true,
            radius: 1
        },
        xaxis: {
            mode: "time"
        }
    };

    var data = [];

    $.plot("#placeholder", data, options);

}

//
function deviceEdit($id){

    $('#idFormEdit').find('[name="id"]').val($id);

    $('#modalEdit').modal('open');

    $.ajax({
        url: './?a=User/IoT&b=GetOne',
        type: 'post',
        dataType: "json",
        data: {
            id: $id
        },
        success: function(json) {

            if ( json['Result']==true ) {

                var $data = json['Data'];

                // 使用 val()
                var $idEdit = $('#idFormEdit');
                $idEdit.find('INPUT[type=hidden],INPUT[type=text],INPUT[type=email],INPUT[type=number],TextArea,select').each(function(){
                    var $name = $(this).attr('name');

                    if ( $data[$name] !='' && $data[$name] !=undefined ) {
                        $("#id_Edit_"+$name).val($data[$name]);
                    }
                });

                M.updateTextFields();
            }

        }
    });

}

//
function deviceDel($token){

    if ( confirm('!?') ){

        $.ajax({
            url: './?a=User/IoT&b=DeviceDel',
            type: 'post',
            dataType: "json",
            data: {
                Token: $token
            },
            success: function(json) {

            }
        });

    }
}

//
$("#idFormEdit").submit(function(){}).validationEngine({
    onValidationComplete: function(form, status) {
        if (status == true) {

            var SelectForm = document.querySelector('#idFormEdit');
            var fd = new FormData(SelectForm);
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("load", function(J){
                var json = JSON.parse( J.target.responseText);

                if( json['Result'] ==true ) {
                    new JBox('Notice',{
                        content:'完成',
                        color:'blue',
                        position:{x:'center', y:'top'},
                        zIndex:12000,
                        autoClose: 1500
                    });

                    Modal.close();
                    deviceList();
                }

                //
                else {
                    new JBox('Notice',{
                        content:'錯誤！'+ json['Message'],
                        color:'red',
                        position:{x:'center', y:'top'},
                        zIndex:12000,
                        autoClose: 1500
                    });
                }

            }, false);

            xhr.open("POST", './?a=User/IoT&b=Update', true);
            xhr.send(fd);
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

//
$(function(){

    pageAdd();

    $('.modal').modal({
        dismissible: false,
        onOpenStart: function(){
            $("body").css({ overflow: 'hidden' });
        },
        onCloseEnd: function(){
            $("body").css({ overflow: 'inherit' });
        }
    });

});
