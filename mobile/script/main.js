/**
 * Created by hyochan on 2014. 6. 22..
 */

//스크린 사이즈
$(window).load(function() {
    $(window).bind('resize',function(event){
        window.scrollTo(0,0);
        winhigh = $.mobile.getScreenHeight(); //Get available screen height, not including any browser chrome
        headhigh = $('[data-role="header"]').first().outerHeight(); //Get height of first page's header
        winhigh = winhigh - headhigh - 30; //Subtract 30 for the top and bottom 15-pixel margins around the content area
        $('div#login').css('width',winwide + 'px').css('height' + 'px'); //Change div to maximum visible area
    });
});

//짧은 글 토스트
var toast=function(msg){
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
        .css({ display: "block",
            opacity: 0.90,
            position: "relative",
            padding: "7px",
            "text-align": "center",
            "font-size" : "10px",
            height:"35px",
            width: "240px",
            left: ($(window).width() - 254)/2,
            top: $(window).height()/1.25 })
        .appendTo( $.mobile.pageContainer ).delay( 1500 )
        .fadeOut( 400, function(){
            $(this).remove();
        });
}
//긴 글 토스트
var long_toast=function(msg){
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
        .css({ display: "block",
            opacity: 0.90,
            position: "relative",
            padding: "3px",
            "text-align": "center",
            "font-size" : "10px",
            height:"50px",
            width: "300px",
            left: ($(window).width() - 314)/2,
            top: $(window).height()/1.25 })
        .appendTo( $.mobile.pageContainer ).delay( 1500 )
        .fadeOut( 400, function(){
            $(this).remove();
        });
}


/*
    #LOGIN
 */
var id;

$(document).ready(function (){
    //datepicker
    $( document ).bind( "mobileinit", function(){
        $.mobile.page.prototype.options.degradeInputs.date = true;
    });

    //로그인 되어있는지 확인하고 되어있으면 바로 #chat으로 이동
    $.ajax({
        type : "get",
        url : "../php/checklogin.php",
        dataType : "text",
        success : function(data){
            if (data != 0) {
                id = data;
                toast(data + "님 로그인 되었습니다.");
                connect_socket();
                $.mobile.changePage($("#chat"), { transition: "fade"} );
                // profile, member, myboard에 화면 뿌려줌
                profile();
                member();
                myboard();
            }
        }
    });

    //회원가입
    $('#password').focus(function(){
        toast("암호는 100% 암호화 되어 저장됩니다.");
    });
    //회원가입 버튼을 눌렀을 때 이벤트 처리
    $('#btn_signup').click(function () {
        var form = document.forms['form_signup'];
        //폼검증 전처리
        if(!form.id.value){
            toast("아이디를 입력해주세요");
            form.id_login.focus();
            return false;
        }
        if(!form.password.value){
            toast("암호를 입력해주세요");
            form.password.focus();
            return false;
        }
        if(!form.password_ok.value){
            toast("암호를 확인해주세요");
            form.password_ok.focus();
            return false;
        }
        if(form.password.value != form.password_ok.value){
            toast("암호와 암호 확인이 일치하지 않습니다.")
            form.password_ok.focus();
            return false;
        }

        //폼검증 후처리
        var formData = $("#form_signup").serialize();
        var action = $("#form_signup").attr('action');
        var show = "";
        $.ajax({
            type : "post",
            url : action,
            data : formData,
            cache : false,
            dataType : "text",
            success : function(data){
                if (data != 0) {
                    id = data;
                    toast("회원가입이 완료되었습니다.");
                    //location.href="#login";
                    connect_socket();
                    $.mobile.changePage($("#chat"), { transition: "turn"} );
                }
                else{
                    long_toast("아이디가 존재합니다. <br> 다른 아이디를 이용해주세요.");
                    form.id.focus();
                }
            }
        });
    });

    //로그인 버튼 클릭
    $('#btn_login').click(function (e) {
        e.preventDefault();
        //e.stopPropagation();
        var formData = $("#form_id").serialize();
        var action = $("#form_id").attr('action');
        $.ajax({
            type : "post",
            url : action,
            data : formData,
            dataType : "text",
            success : function(data){
                if (data == 0) {
                    toast("아이디와 암호가 존재하지 않습니다.");
                }
                else{
                    id = data;
                    toast(data + "님 로그인 되었습니다.");
                    //location.href = "#chat";
                    connect_socket();
                    $.mobile.changePage($("#chat"), { transition: "slide"} );
                    // profile, member, myboard에 화면 뿌려줌
                    profile();
                    member();
                    myboard();
                }
            }
        });
    });
    //로그아웃 버튼 클릭
    $('.btn_logout').click(function (e) {
        $.ajax({
            type : "get",
            url : "../php/logout.php",
            cache : false,
            dataType : "text",
            //html, xml, text, script, json, jsonp
            success : function(data){
                if (data == 0) {
                    toast("로그아웃을 하지 못했습니다.");
                }
                else{
                    toast("로그아웃 되었습니다.");
                    //location.href="#login"
                    $.mobile.changePage($("#login"), { transition: "turn"} );
                    location.reload();
                }
            }
        });
    });
});

/*
        #CHAT
 */

function UrlExists(url)
{
    var image_url ='../images/user.png';
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if((http.status!=404) == true) return url;
    else return image_url;
}

function connect_socket(){
    //open websocket connection
    var wsUri = "ws://blackpearl.iptime.org:9000/demo/server.php";
    var websocket = new WebSocket(wsUri);
    //toast("채팅서버에 접속하셨습니다");
    //connectedto server
    websocket.onopen = function(ev) {
        /*
        var msg =
            '<li>채팅서버에 접속하였습니다.</li>';
        */
        $('#table_chat').append(msg); //notify user
        var msg = {
            type : "system",
            id : id,
            message: "님이 채팅에 참여하였습니다."
        };
        //convert and send data to server
        websocket.send(JSON.stringify(msg));
    }

    //message received
    websocket.onmessage = function(ev) {
        var msg = JSON.parse(ev.data); //PHP sends Json data
        var uid = msg.id; //user name
        var type=msg.type;
        var umsg = msg.message; //message text
        if(type == 'system')
        {
            if(uid != undefined){
                $('#table_chat').append("<li>채팅서버에 접속하였습니다. ("+uid+")</li>");
                return;
            }
        }
        else if(type == 'user_message'){
            if(uid != undefined){
                //채팅에 접속했다는 알림을 보냈을 때는 이미지를 띄우지 않음.
                if(umsg == "님이 채팅에 참여하였습니다."){
                    if(uid == id) {
                        return;
                    }
                    var img_url = UrlExists('../php/user_images/'+ uid+'.png');
                    $('#users').empty();
                    $('#users').append("<li>" + uid +"</li>");
                    parent.resizeIframe($('html').height());
                }
                else{
                    var img_url = UrlExists('../php/user_images/'+ uid+'.png');
                    var append =
                        '<li>' +
                            '<table><tr><td width="80"><img src="' + img_url + '" width="40" height="40"></td>' +
                            '<td width="80" style="color: blue;">'+ uid + '</td>' +
                            '<td>'+umsg+'</td></tr></table>' +
                        '</li>';

                    $('#table_chat').append(append);
                }
            }
        }
        $('#table_chat').listview('refresh');
        $('#tweet').val('');
    };

    websocket.onerror	= function(ev){
        var msg =
            '<li>에러 발생 : '+ ev.data +'</li>';
        $('#table_chat').append(msg);
    };

    websocket.onclose = function(ev){
        $('#table_chat').append("<li>채팅 서버와 연결이 끊겼습니다</li>");
    };

    //tweet 버튼 눌렀을 때 이벤트 발생
    $('#btn_tweet').click(function(e){ //use clicks message send button
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var message = $('#tweet').val(); //get message text
        if(message != ""){ //emtpy message?
            //prepare json data
            var msg = {
                type : "user_message",
                id : id,
                message : message
            };
            websocket.send(JSON.stringify(msg));
            //버튼을 클릭했을 때 db 글쓰기 수행
            //폼검증 후 처리
            //이미지 파일도 formData에 추가
            var formData = {
                type : "user_message",
                id : id,
                tweet : message
            };
            $.ajax({
                type : "post",
                url : "../php/set_chat.php",
                data : formData,
                dataType : "json",
                success : function(data){
                    if (data[0].id == undefined) {
                        toast("세션이 종료되었습니다.");
                        $.mobile.changePage($("#login"), { transition: "turn"} );
                    }
                    //입력만하고 끝이기 때문에 따로 해줄건 없다.
                },
                //오류 발견시 체크
                error : function(request,status,error){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                }
            });
        }
    });
}

/*
        profile
 */
function profile(){
    //file 양식으로 이미지를 선택(값이 변경) 되었을때 처리하는 코드
    $("#image").change(function(){
        readURL(this);
    });
    //페이지를 열었을 때 디비로부터 정보 불러오기
    //login, member 테이블로부터 가져오기
    $.ajax({
        type : "get",
        url : "../php/get_profile.php",
        cache : false,
        dataType : "json",
        success : function(data){
            if(data.id == null){
                toast("세션이 종료되었습니다.");
                $.mobile.changePage($("#login"), { transition: "turn"} );
            }
            else{
                $('#profile #id').val(data.id);
                $('#profile #password').val(data.password);
                $('#profile #password_ok').val(data.password);
                $('#profile #name').val(data.name);
                $('#profile input:radio[name=sex]:input[value='+data.sex+']').attr("checked", true);
                $('#profile #date').val(data.birthday);
                $('#profile #email').val(data.email);
                var img_url = UrlExists('../php/user_images/'+ data.id +'.png');
                $("#profile #user_image").attr("src", img_url);
            }
        }
    });
    //프로필 폼이 전송됐을 때 이벤트 처리
    $("#form_profile").on('submit',(function(e){
        e.preventDefault();
        //프로필 수정 버튼을 눌렀을 때 이벤트 처리
        //$('#set_profile').click(function () {
        var form = document.forms['form_profile'];
        //폼검증 전처리
        if(!form.password.value){
            toast("암호를 입력해주세요");
            form.password.focus();
            return false;
        }
        if(!form.password_ok.value){
            toast("암호를 확인해주세요.");
            form.password_ok.focus();
            return false;
        }
        if(form.password.value != form.password_ok.value){
            toast("암호와 암호확인이 일치하지 않습니다.");
            form.password.focus();
            return false;
        }
        if(form.email.value != null){
            var emailFormat = /^([0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
            if(form.email.value.search(emailFormat) == -1){
                toast("유효하지 않은 이메일입니다.");
                form.email.focus();
            }
        }
        //폼검증 후 처리
        //var formData = $("#form_profile").serialize();
        var action = $("#form_profile").attr('action');
        //이미지 파일도 formData에 추가
        $.ajax({
            type : "post",
            url : action,
            //data : formData,
            data : new FormData(this),
            contentType : false,
            cache : false,
            processData : false,
            dataType : "json",
            success : function(data){
                if (data.id == null) {
                    $.mobile.changePage($("#login"), { transition: "turn"} );
                }
                else{
                    //이미지 파일을 refresh
                    var d = new Date();
                    $("#user_image").attr("src", "../php/user_images/" + data.id + ".png?"+d.getTime());

                    //수정되었음을 알림
                    toast("프로필이 수정되었습니다.");
                }
            },
            //오류 발견시 체크
            error : function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }));
}//end profile
//이미지 미리보기
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader(); //파일을 읽기 위한 FileReader객체 생성
        reader.onload = function (e) {
            //파일 읽어들이기를 성공했을때 호출되는 이벤트 핸들러
            $('#user_image').attr('src', e.target.result);
            //이미지 Tag의 SRC속성에 읽어들인 File내용을 지정
            //(아래 코드에서 읽어들인 dataURL형식)
        }
        reader.readAsDataURL(input.files[0]);
        //File내용을 읽어 dataURL형식의 문자열로 저장
    }
}//readURL()--

/*
        member
 */

function member(){
    $.ajax({
        type : "get",
        url : "../php/get_member.php",
        cache : false,
        dataType : "json",
        success : function(json){
            var tmp = "";
            var data = json.member[0];
            var checked = json.checked[0];
            //alert(checked.length);
            for(var i=0; i<data.length; i++){
                var isChecked = false;
                //1. 체크가 안된놈은 아래 append 시 체크 버튼을 띄움
                for(var j=0; j<checked.length; j++){
                    if(data[i].id == checked[j]){
                        isChecked = true;
                    }
                }

                var img_url = UrlExists('../php/user_images/'+data[i].id+'.png');
                var append =
                    '<li>'+
                        '<a href="#">' +
                        '<img src="' + img_url + '" />' +
                        '<h3 id="member">' + data[i].id + '</h3>' +
                        '<p>' + data[i].name +'</p>' +
                        '</a>' +
                        '</li>';
                if(isChecked == true){
                    $('#table_member').append(append);
                }
                //체크가 안된 녀석은 변수에 일단 보관한다.
                else{
                    tmp += append;
                }
            }
            $('#table_member').append(tmp);
            $('#table_member').listview('refresh');
        },
        //오류 발견시 체크
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}//end member

/*
 myboard
 */
//게시글 불러오기
function getBoardLists(){
    var formData = "room=" + id;
    $.ajax({
        type : "get",
        url : "../php/get_board.php",
        data : formData,
        dataType : "json",
        success : function(json){
            //board json data
            var data = json.board[0];
            var size = data.length - 1;

            var tmp ="";
            $('#table_board').empty();
            for (var i = 0; i < size; i++) {
                tmp +=
                    '<div class="collapse" data-role="collapsible" data-content-theme="c">' +
                        '<h3>' +  data[i].title;

                //파일이 올라가있으면 제목에서 파일첨부 표시
                if(data[i].file==true){
                    tmp += ' | <a href="#" style="color: blue;">파일 </a>';
                }

                tmp += '</h3>' +
                    '<div class="ui-grid-a">' +
                    '<div class="ui-block-a"><p style="font-size: 13px;">아이디 : ' + data[i].id + '</p></div>' +
                    '<div class="ui-block-b"><p style="font-size: 13px;">날짜 : ' + data[i].day + '</p></div>' +
                    '</div>' +
                    '<p>' + data[i].content + '</p>';

                if(data[i].file==true){
                    tmp += '첨부파일 : ' +
                        '<a href="http://blackpearl.webhop.org/BlackPearl/php/download.php?' +
                        'filename=' + data[i].file_name +
                        '&filepath=' + data[i].file_dir + '" rel="external">' + 
                        data[i].file_name + '</a>';
                }
                tmp += '<input id="number" name="number" type="hidden" value ="' + data[i].number + '">';
                tmp += '<p><input class="btn_board_delete" type="button" value="삭제하기" data-icon="delete" data-inline="true" data-mini="true"/></p>';
                tmp += '</div>';
            }
            //$(tmp).collapsibleset('refresh');
            $(tmp).prependTo('#table_board');
            $('.collapse').trigger('create');
            $('.collapse').collapsible();
            $('.btn_board_delete').trigger('create');
            $('.btn_board_delete').click(function(e){
                e.preventDefault();
                e.stopPropagation();

               var $deleted = $(this).parent().parent().parent().parent();
               var number = $(this).parent().parent().parent().find('#number').val();
               var $formData = "owner=" + id +"&board_number=" + number +"&id=" + id;
                deleteBoard($formData, $deleted);
            });
            $('#table_board').listview('refresh');

        }
    });
}


//게시글 삭제
function deleteBoard(formData, deleted){
    $.ajax({
        type : "get",
        url : "../php/set_board.php",
        data : formData,
        contentType : false,
        cache : false,
        processData : false,
        dataType : "json",
        success : function(data){
            deleted.fadeOut("slow");
            //e.cancelBubble();
        },
        //오류 발견시 체크
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

function myboard(){
    $('#board_write_form').hide();

    getBoardLists();

    $('#board_write').click(function(e){ //use clicks message send button
        e.stopPropagation();
        if($('#board_write').val() == "글쓰기"){
            $('#board_write_form').slideDown('slow', function() {
                // Animation complete.
                $('#board_write').val("접기");
            });
        }
        else{
            $('#board_write_form').slideUp('slow', function() {
                // Animation complete.
                $('#board_write').val("글쓰기");
            });
        }
    });

    //글쓰기 폼 전송시 이벤트 핸들러
    $("#form_write").on('submit',(function(e){
        e.preventDefault();
        //프로필 수정 버튼을 눌렀을 때 이벤트 처리
        //$('#set_profile').click(function () {
        var form = document.forms['form_write'];
        //폼검증 전처리
        if(!form.title.value){
            toast("제목을 입력해주세요.");
            return false;
        }
        //폼검증 후 처리
        var action = $("#form_write").attr('action');
        $.ajax({
            type : "post",
            url : action,
            data : new FormData(this),
            contentType : false,
            cache : false,
            processData : false,
            dataType : "json",
            success : function(data){
                //글쓰기 창 닫기
                $('#board_write_form').slideUp("slow");
                //글쓰기 폼 초기화
                $('#form_write #board_write').val("글쓰기");
                $('#form_write #title').val("");
                $('#form_write #content').val("");

                getBoardLists();
                //$(".collapse").html().trigger('create');
                //$(".collapse").trigger('create');
                //$(".collapse").collapsibleset('refresh')

            },
            //오류 발견시 체크
            error : function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }));
}