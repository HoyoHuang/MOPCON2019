
var IoTServer = 'https://iot.hoyo.idv.tw';
var $page = [];
var Situation_id;

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
function search(){
    // Token
    $.ajax({
        url: IoTServer +'/?a=User/Situation&b=Search',
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

            $('#page_Search').html(h);

            $('.toolTipped').tooltip();
        }
    });

}

//
function showLinkURL($str){
    //var m = $('#modalAdd');
    //m.width(window.innerWidth -80).height( 500 ); // window.innerHeight - 120
    //Modal.setContent(m);
    ////Modal.setTitle('新增裝置');
    //Modal.open();

    $('#idLinkURL').val($str);

    $('#modalLinkURL').modal('open');
}

//
function copyLinkURL(){
    var Url2=document.getElementById("idLinkURL");
    Url2.select();
    try{
        if(document.execCommand('copy', false, null)){
            document.execCommand("Copy");
        } else{
            alert('');
        }
    } catch(err){
        alert('');
    }
}

//
function add(){

    var m = $('#modalAdd');
    m.width(window.innerWidth -80).height( 500 ); // window.innerHeight - 120
    Modal.setContent(m);
    //Modal.setTitle('新增裝置');
    Modal.open();

}

//
function edit($id){

    Situation_id = $id;

    var m = $('#modalEdit');
    m.width(window.innerWidth -80).height( 500 ); // window.innerHeight - 120
    Modal.setContent(m);
    Modal.open();

    renewEdit($id);
}

function renewEdit($id){

    $.ajax({
        url: './?a=User/Situation&b=GetOne',
        type: 'post',
        dataType: "json",
        data: {
            id: $id
        },
        success: function(json) {

            if ( json['Result'] ==true ){

                var $data = json['Data'];

                // 使用 val()
                var $idEdit = $('#idFormEdit');
                $idEdit.find('INPUT[type=hidden],INPUT[type=text],INPUT[type=email],INPUT[type=number],TextArea,select').each(function(){
                    var $name = $(this).attr('name');

                    if ( $data[$name] !='' && $data[$name] !=undefined ) {
                        $("#id_Edit_"+$name).val($data[$name]);
                    }
                });

                // 使用 checked checkbox \ 必須跳脫
                $idEdit.find('INPUT[type=checkbox],INPUT[type=radio]').each(function(){
                    var $name = $(this).attr('name');
                    var $thisCheck = $('input[name='+ str_replace('\\', '\\\\', $name) +']');

                    if ( $data[$name] !='' && $data[$name] !=undefined ) {
                        $thisCheck.filter('[value='+ $data[$name] +']').prop('checked', true);
                    }
                });

                M.updateTextFields();

                //
                var h = '';
                $.each( json['Data']['Control'], function(k,v){
                    var t = $('#templateDevice').clone();

                    if ( v['Action'] =='on' ){
                        t.find('input').attr('checked', '');
                    }
                    else{
                        //t.find('input').prop('checked', false);
                    }

                    var tt = t.html();
                    tt = str_replace('{id}', v['Device_id'], tt);
                    tt = str_replace('{Name}', v['Name'], tt);
                    h += tt;
                } );

                $('#iot_list').html(h);

                //
                h = '';
                $.each( json['Data']['All'], function(k,v){
                    var t = $('#templateSelectDevice').clone();

                    var tt = t.html();
                    tt = str_replace('{id}', v['id'], tt);
                    tt = str_replace('{Name}', v['Name'], tt);
                    h += tt;
                } );

                $('#iot_all_list').html(h);

            }

        }
    });

}

//
function assignSelect($id, obj){
    var $this = $(obj);

    $.ajax({
        url: './?a=User/Situation&b=AssignSelect',
        type: 'post',
        dataType: "json",
        data: {
            Situation_id: Situation_id,
            Device_id: $id,
            Action: $this.parent().prev().find('[name="switchSelect"]').prop('checked')
        },
        success: function(json) {

            renewEdit(Situation_id);

        }
    });

}

//
function assignDelete($id, obj){
    var $this = $(obj);

    if ( confirm('?') ){

        $.ajax({
            url: './?a=User/Situation&b=AssignDelete',
            type: 'post',
            dataType: "json",
            data: {
                Situation_id: Situation_id,
                Device_id: $id
            },
            success: function(json) {

                renewEdit(Situation_id);

            }
        });

    }
}

//
function assignChange($id, obj){
    var $this = $(obj);

    $.ajax({
        url: './?a=User/Situation&b=AssignChange',
        type: 'post',
        dataType: "json",
        data: {
            Situation_id: Situation_id,
            Device_id: $id,
            Action: $this.prop('checked')
        },
        success: function(json) {

        }
    });

}

//
function switchPower(obj) {
    var $this = $(obj);
    console.log($(obj).prop('checked'));

    $.ajax({
        url: './?a=User/Situation&b=SwitchPower',
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

    var t = $('#page_DeviceControl').html();
    t = str_replace('{Name}', $name, t);
    $('#page_DeviceControl').html(t);

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

    chart($id, $name, $column);

}


//
function action($Token){
    $.ajax({
        url: './?a=API&b=SituationControl',
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
$("#idFormAdd").submit(function(){}).validationEngine({
    onValidationComplete: function(form, status) {
        if (status == true) {

            var SelectForm = document.querySelector('#idFormAdd');
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

                    var h = '';
                    var t = $('#templateDeviceList').clone();
                    t.find('.DeviceName').html(json['Data']['Name']);

                    h += t.html();
                    h = str_replace('{token}', json['Data']['Token'], h);
                    $('#page_DeviceList').append(h);
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

            xhr.open("POST", './?a=User/Situation&b=Add', true);
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

    search();

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
