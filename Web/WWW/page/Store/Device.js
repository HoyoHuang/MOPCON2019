
//
function search(P){

    var $DataCount = 0;
    $.ajax({
        url: './?a=Store/Device&b=Search',
        type: 'post',
        dataType: 'json',
        data: $('#idSearchForm').serialize() +'&P='+ P,
        success: function(json){

            var h = '';
            if ( json['Result']==true ){

                $('#idTotalNumber').html(json['TotalCount']);
                pageLine(json['TotalCount'], P);

                $.each(json['Data'], function(k,v){
                    var BGColor = (k%2==0)? 'bgColor="#f0f0f0"' : 'bgColor="#ffffff"';

                    h += '<tr id="'+ v['id'] +'" '+ BGColor +'>';
                    h += '<td class="text-center">'+ v['id'] +'</td>';
                    h += '<td>'+ v['Create_Time'] +'</td>';
                    h += '<td>'+ v['MemberName'] +'</td>';
                    h += '<td>'+ v['SN'] +'</td>';
                    h += '<td>'+ v['Name'] +'</td>';
                    h += '<td>'+ v['DataColumn'] +'</td>';
                    h += '<td>'+ v['DigitalIO'] +'</td>';

                    h += '<td class="text-center">';
                    h += '<i class="btn-small waves-effect waves-orange white black-text" onclick="editDevice('+ v['id'] +')"><i class="material-icons">edit</i></i>';
                    h += ' <i class="btn-small waves-effect waves-orange red lighten-4 black-text" onclick="deleteDevice('+ v['id'] +')"><i class="material-icons">delete</i></i>';
                    h += '</td>';

                });

            }

            else{
                h += '<div>查無資料</div>';
            }

            $("#searchDevice").html(h);
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

    $('#id_Add_SN').val( substr(strtoupper(md5( uniqid() + time() )), 0, 16) );
    M.updateTextFields();
}

//
function editDevice($id){

    document.getElementById("idFormEdit").reset();

    $('#idFormEdit').find('[name="id"]').val($id);

    var m = $('#modalEdit');
    m.width(window.innerWidth -80).height( 500 ); // window.innerHeight - 120
    Modal.setContent(m);
    //Modal.setTitle('新增裝置');
    Modal.open();

    //
    $.ajax({
        url: './?a=Store/Device&b=GetOne',
        type: 'post',
        dataType: 'json',
        data: {
            id: $id
        },
        success: function(Json){

            //$('#JBox-overlay').hideLoading();
            //$('.JBox-content').scrollTop(0);

            if ( Json['Result'] ==true ){
                // 使用 val()
                var $idEdit = $('#idFormEdit');
                $idEdit.find('INPUT[type=hidden],INPUT[type=text],INPUT[type=email],INPUT[type=number],TextArea,select').each(function(){
                    var $name = $(this).attr('name');

                    if ( Json['Data'][$name] !='' && Json['Data'][$name] !=undefined ) {
                        $("#id_Edit_"+$name).val(Json['Data'][$name]);
                    }
                });

                // 使用 checked checkbox \ 必須跳脫
                $idEdit.find('INPUT[type=checkbox],INPUT[type=radio]').each(function(){
                    var $name = $(this).attr('name');
                    var $thisCheck = $('input[name='+ str_replace('\\', '\\\\', $name) +']');

                    if ( Json['Data'][$name] !='' && Json['Data'][$name] !=undefined ) {
                        $thisCheck.filter('[value='+ Json['Data'][$name] +']').prop('checked', true);
                    }
                });

                M.updateTextFields();
            }
        }
    });

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
function deviceEdit($token){

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

                    search(1);

                    //var h = '';
                    //var t = $('#templateDeviceList').clone();
                    //t.find('.DeviceName').html(json['Data']['Name']);
                    //
                    //h += t.html();
                    //h = str_replace('{token}', json['Data']['Token'], h);
                    //$('#idDeviceList').append(h);
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

            xhr.open("POST", './?a=User/IoT&b=AddDevice', true);
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
                    search(1);
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

            xhr.open("POST", './?a=Store/Device&b=UpdateDevice', true);
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

    search(1);

});
