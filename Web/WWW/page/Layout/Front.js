
var PageCount = 30;

//
function pageLine($TotalCount, P){

    // 總筆數
    $("#TotalNumber").html($TotalCount);

    // 總頁數
    var $TotalPage = Math.ceil( $TotalCount / PageCount );

    if ( P ==null || P==undefined ) P = 1;
    if ( P =='Last' ) P = $TotalPage;

    // 分頁列
    var $row = '';
    var $P = parseInt(P);
    var $active = '';

    if ( $P>6 ) {
        $row += '<li' + $active + '><a href="">«</a></li>';
    }

    for( var $i=1; $i<=$TotalPage; $i++) {

        if ( $P+5>=$i && $P-5<=$i ) {
            //
            if ($i == $P) $active = ' class="active"';
            $row += '<li' + $active + '><a href="">' + $i + '</a></li>';
            $active = '';
        }
    }

    if ( $P<$TotalPage && $TotalPage >5 ) $row += '<li' + $active + '><a href="" title="'+ $TotalPage +'">»</a></li>';
    $(".pagination").html($row);

    if ( $TotalCount >= 1 )
        $('.PageControl').show();
    else
        $('.PageControl').hide();
}

//
function SearchArea(obj) {
    var $this = $(obj);
    if ( $this.find('.material-icons').text() =='expand_more' )
        $this.find('.material-icons').text('chevron_right');
    else
        $this.find('.material-icons').text('expand_more');

    $('#idSearchArea').toggle();
}

//
$(function(){

    Modal = new JBox('Modal', {
        title: null,
        blockScroll:false,
        fade:false,
        animation:'',
        closeButton:'box',
        overlay:true,
        closeOnClick: false,
        closeOnEsc: false,
        onOpen: function(event, ui) {
            $("body").css({ overflow: 'hidden' });
        },
        onClose: function(event, ui) {
            $("body").css({ overflow: 'inherit' });

            for (var i = 1; i < 99; i++)
                window.clearInterval(i);
        }
    });

    //
    $('#idUserName').JBox('Tooltip', {
        closeOnMouseleave: true,
        trigger:"click",
        content: $('#ModalLoginYes')
    });

    // Nav Menu
    $('.sidenav').sidenav({
        onCloseEnd: function(){
            // $('.collapsible').collapsible().close();
        }
    });

    //
    $('.scrollSpy').scrollSpy();

    // 行動裝置選單
    //$(".button-collapse").sideNav();

});
