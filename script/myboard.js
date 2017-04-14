var upload = 1;
//검색창에서 검색을 할 수 있도록 전역변수로 선언
var $rows;
//boardLists 가져오기
function getBoardLists(room, number){
    var $updated = -1;
    var id;
    //페이지를 열었을 때 디비로부터 정보 불러오기
    //board 테이블로부터 가져오기
    var formData = "room=" + room;
    if(number == undefined){
        number = -1;
    }
    $.ajax({
        type : "get",
        url : "php/get_board.php",
        cache : false,
        data : formData,
        dataType : "json",
        success : function(json){
            if (json == undefined) {
                $('#main').empty();
                $('#main').append('회원가입시 이용가능합니다.');
                parent.setLogin();
            } else {
                //board json data
                var data = json.board[0];
                var size = data.length - 1;
                var id = data[size].my_id;
                //reply json data
                var reply = json.reply[0];
                var size_reply = reply.length;

                $('#table_board').empty();
                for (var i = 0; i < size; i++) {
                    var img_url = UrlExists('php/user_images/'+data[i].id+'.png');
                    //글 쓰기 폼 append
            var append =
                '<ul class="row">' +
                    '<li class="c1_img"><img src="' + img_url + '" width="20" height="20"/></li>' +
                    '<li class="c2_id">' + data[i].id + '</li>';
             //파일이 올라가있으면 제목에서 파일첨부 표시
                    if(data[i].file==true){
            append += '<li class="c3_title">' + data[i].title.substr(0,28) + ' <a style="color:blue;"> | 파일</a></li>';
                    }else{
            append += '<li class="c3_title">' + data[i].title.substr(0,30) + '</li>';
                    }
            append +=        '<li class="c4_open">' + data[i].open + '</li>' +
                    '<li class="c5_date">' + data[i].day + '</li>' +
                    '<li class="c6_number">' + data[i].number + '</li>';
                    //글 수정 폼
            append +=
                    '<div class="update"><fieldset>' +
                        '<legend>&nbsp;글 수정&nbsp;</legend>' +
                    //form_update
                        '<form id="form_update" class="form_update" name="form_update" ' +
                            ' action="php/set_board.php" method="post"  enctype="multipart/form-data">' +
                            '<input id="owner" name="owner" type="hidden" value="' + data[i].owner + '">' +
                            '<input id="number" name="number" type="hidden" value ="' + data[i].number + '">' +
                            '<ul>' +
                            '제목 : <input class="title" name="title" type="text" size="80" value="' + data[i].title + '"/>' +
                            '<br><br>' +
                            '<textarea name="content" class="content" rows="10" cols="50">' + data[i].content + '</textarea>' +
                            '</ul>' +
                            '<ul>' +
                                '<input id="user_file" name="user_file" type="file">' +
                                '<div style="float:right; clear:both; padding-right:5em;">';
                                if(data[i].open == 1)
            append += 				'<input name="open" type="checkbox" value="1" checked> 비공개 &nbsp;&nbsp;&nbsp;&nbsp;';
            					else{
            append += 				'<input name="open" type="checkbox" value="1"> 비공개 &nbsp;&nbsp;&nbsp;&nbsp;';		
            					}
            append +=				'<input id="btn_back" type = "button" value="돌아가기"> ' +
	                                '<input id="btn_updated" name="btn_updated" type = "submit" value="수정완료">' +
                                '</div>' +
                            '</ul>' +
                        '</form></fieldset>' +
                    '</div>';
            //글 읽기 폼
            append +=
                    '<div class="read"><fieldset>' +
                        '<legend>&nbsp;글 읽기&nbsp;</legend>' +
                        //form_read for deleting it
                        '<form id="form_read" name="form_read" method="post" action="php/set_board.php">' +
                        '<ul style="padding-top:1em; border-bottom: 0px;">' + data[i].content + '</ul><br><br>' +
                        '<ul style="border-bottom: 0px;">';
                    //첨부파일 존재하면 추가
                    if(data[i].file==true){
                        append += '첨부파일 : ' +
                            '<a href="php/download.php?' +
                                'filename=' + data[i].file_name +
                                    '&filepath=' + data[i].file_dir + '">' + data[i].file_name + '</a>';
                    }
                    //본인이 쓴 거거나 본인 게시판이면 다음 버튼 보이기
                    if (id == room || id == data[i].id) {
            append +=
                            '<div style="float:right; clear:both; padding-right:5em; padding-bottom:1em;">' +
                                '<input id="number" name="number" type="hidden" value ="' + data[i].number + '">' +
                                '<input id="btn_update" type = "button" value="수정하기"> ' +
                                '<input id="btn_board_delete" type = "submit" value="삭제하기">' +
                            '</div>';
                    }
            append +=
                        '</ul></form>';
                    //아니면 패스
            append +=
                        '<hr style="width: 660px;">' +
                        '<div class="reply" style="color: #000000;">' +
                        //form_reply
                            '<form id="form_reply" name="form_reply" method="post" action="php/set_board.php">' +
                                '<ul style="border-bottom: 0px; padding-top: 1em;  color: indigo;">' +
                                '<input id="number" name="number" type="hidden" value ="' + data[i].number + '">' +
                                ' 답글 달기 : ' +
                                '<input id="txt_reply" name="txt_reply" type="text" class="txt_reply"> ' +
                                '<input id="btn_reply" name="btn_reply" type="submit" value="입력">' +
                                '</ul>' +
                                '<ul style="border-bottom: 0px; padding-top: 1em; color: indigo;">' +
                                    '<table id="table_reply">';
            //댓글 달기
            for(var j =0; j <size_reply; j++){
                if(reply[j].number == data[i].number && reply[j].owner == data[i].owner){
            append +=
                            '<tr>' +
                                '<td><input idㅐ="reply_number" name="reply_number" type="hidden" value=" ' + reply[j].reply_number +'"/></td>'+
                                '<td style="color: darkgreen;">' + reply[j].id  + '<td>' +
                                '<td width="350" style="padding-left: 1em;">' + reply[j].reply  + '</td>' +
                                '<td width="120" style="padding-left: 1em;">' + reply[j].day  + '</td>';
                    //내가 쓴 댓글이거나 내 게시판이면 삭제 가능
                    if (id == room || id == reply[j].id) {
            append +=
                                '<td style="padding-left: 1em;"><input id="btn_reply_delete" name="btn_reply_delete" type="button" value="삭제하기"></td>';
                    }
            append += '</tr>';
                }
            }
            append +=
                                    '</table>' +
                                '</ul>' +
                            '</form>' +
                        //close div for reply
                        '</div>' +
                     //close div for read
                     '</fieldset></div>' +
                '</ul>';
                    //1이 비공개
                    if(data[i].open == 0){
                        $('#table_board').append(append);
                    }
                    //비공개지만 게시판이 자기꺼면 보임
                    else if(data[i].open == 1 && data[i].owner == id){
                        $('#table_board').append(append);
                    }
                    //비공개고 게시판 주인은 다르지만 글이 본인 꺼면 보임
                    else if(data[i].open == 1 && data[i].id == id){
                        $('#table_board').append(append);
                    }
                    //alert("num : " + number + ", row_num : " + data[i].number);
                    //업데이트 된 놈을 나중에 뿌려주기 위해 우선 저장
                    if (data[i].number == number) {
                        $updated = $('#table_board ul').find('.read').last();
                    }
                }
                $('#table_board').find('.update').hide();
                $('#table_board').find('.read').hide();

                //수정완료 버튼을 눌렀을 때 수정된 페이지를 띄우기 위해서
                if($updated != -1){
                    $updated.fadeIn(1000);
                    $updated.slideUp(2500);
                    $updated = -1;
                }

                $rows = $('.row');
                //$('#table_board ul').find('li').addClass('hover');
                //Hover 색상 변경
                $('#table_board .row li').hover(
                    function () {
                        $(this).parent().find('li').addClass('hover');
                    },
                    function () {
                        $(this).parent().find('li').removeClass('hover');
                    }
                );
                //row를 선택했을 때 글 읽기 창 보이기
                var $menu = $('#table_board ul');
                $menu.click(function (e) {
                    e.stopPropagation();
                    //e.preventDefault();
                    //read, update, reply 영역 설정
                    var $read = $(this).find('.read');
                    var $form_read = $read.find('#form_read');
                    var $update = $(this).find('.update');
                    var $form_update = $update.find('#form_update');
                    var $reply = $read.find('.reply');
                    var $form_reply = $reply.find('#form_reply');
                    //menu를 눌렀을 때 update는 무조건 숨김
                    $update.hide();
                    $read.toggle('slow', function () {
                        //수정 버튼을 눌렀을 때 read 숨기고 update 보이기
                        $(this).find('#btn_update').click(function () {
                            $read.hide();
                            //update fadein 효과로 보이기
                            $update.fadeIn("slow");
                            parent.resizeIframe($('html').height());
                        });
                        //윈도우 사이즈 조절
                        parent.resizeIframe($('html').height());
                    });
                    //돌아가기 버튼을 눌렀을 때 이벤트
                    $(this).find('.update #btn_back').click(function () {
                        //update 숨기기
                        $update.hide();
                        $read.fadeIn("slow");
                        parent.resizeIframe($('html').height());
                    });
                    //수정완료 버튼 클릭시 이벤트 처리
                    $(this).find('.update #btn_updated').click(function () {
                        //폼 업데이트
                         updateForm($form_update);
                    });
                    //댓글 버튼 클릭시 이벤트 처리 : 한번씩만 실행할 수 있도록 one 을 bind 함 => 취소 아래서 버블링 방지로 해결
                    $form_reply.find('#btn_reply').click(function () {
                        replyForm($form_reply, room);
                    });
                    //글 삭제 버튼 클릭시 이벤트 처리
                    $(this).find('.read #btn_board_delete').click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $deleted = $(this).parent().parent().parent().parent().parent().parent();
                        var number = $(this).parent().find('#number').val();
                        var $formData = "owner=" + room +"&board_number=" + number +"&id=" + id;
                        deleteBoard($formData, $deleted);
                    });
                    //댓글 삭제 버튼 클릭시 이벤트 처리
                    $(this).find('.read #btn_reply_delete').one('click' ,function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var number = $reply.find('#number').val();
                        var reply_number = $(this).parent().parent().find('#reply_number').val();
                        var $deleted = $(this).parent().parent();
                        var $formData = "owner=" + room +"&number=" + number +"&reply_number=" + reply_number;
                        deleteReply($formData, $deleted);
                    });
                });
            }
        },
        //오류 발견시 체크
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

//게시글 삭제
function deleteBoard(formData, deleted){
    $.ajax({
        type : "get",
        url : "php/set_board.php",
        data : formData,
        contentType : false,
        cache : false,
        processData : false,
        dataType : "json",
        success : function(data){
            if (data.id == null) {
                alert("세션이 종료되었습니다. 로그인 후 재시도 해주세요.");
                parent.setLogin();
                e.cancelBubble();
            }
            else{
                var msg = "확인 : 게시글을 지웠습니다";
                $('#alert_write').empty();
                $('#alert_write').append(msg);
                deleted.fadeOut("slow");
                parent.resizeIframe($('html').height());
                //e.cancelBubble();
            }
        },
        //오류 발견시 체크
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

//댓글 삭제
function deleteReply(formData, deleted){
    $.ajax({
        type : "get",
        url : "php/set_board.php",
        data : formData,
        contentType : false,
        cache : false,
        processData : false,
        dataType : "json",
        success : function(data){
            if (data.id == null) {
                alert("세션이 종료되었습니다. 로그인 후 재시도 해주세요.");
                parent.setLogin();
                e.cancelBubble();
            }
            else{
                var msg = "확인 : 댓글을 지웠습니다";
                $('#alert_write').empty();
                $('#alert_write').append(msg);
                deleted.fadeOut("slow");
                parent.resizeIframe($('html').height());
                //e.cancelBubble();
            }
        },
        //오류 발견시 체크
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

//답글 달기 버튼을 입력했을 때 이벤트 처리
function replyForm(form_reply, room){
    form_reply.on('submit',(function(e){
        e.preventDefault();
        e.stopPropagation();
        if(form_reply.find('#txt_reply').val() == undefined){
            var msg = "오류 : 댓글을 입력하시려면 글자를 넣어주세요.";
            $('#alert_write').empty();
            $('#alert_write').append(msg);
            return false;
        }
        var action = $("#form_reply").attr('action');
        $.ajax({
            async : false,
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
                    alert("세션이 종료되었습니다. 로그인 후 재시도 해주세요.");
                    parent.setLogin();
                    e.cancelBubble();
                }
                else{
                    var msg = "확인 : 댓글을 입력하였습니다";
                    $('#alert_write').empty();
                    $('#alert_write').append(msg);
                    $('#txt_reply').val("");
                    //입력된 댓글을 append 시킴
                    msg = '<tr style="display: none;">' +
                            '<td><input id="reply_number" name="reply_number" type="hidden" value=" ' + data.reply_number +'"></td>'+
                            '<td style="color: darkgreen;">' + data.id + '<td>' +
                            '<td width="350" style="padding-left: 1em;">' + data.reply + '</td>' +
                            '<td width="120" style="padding-left: 1em;">' + data.day + '</td>' +
                            '<td style="padding-left: 1em;"><input id="btn_reply_delete" name="btn_reply_delete" type="button" value="삭제하기"></td>' +
                        '</tr>';
                    $(msg).prependTo(form_reply.find('#table_reply')).show("slow");
                    $('#btn_reply_delete').bind('click', function() {
                        //할일 [0617] : 이 부분 수정중.. 댓글을 입력한 후로 바로 삭제가 불가능함. 여기 이벤트로 호출이 안됨.
                        var $deleted = $(this).parent().parent();
                        var $formData = "owner=" + room +"&number=" + data.number +"&reply_number=" + data.reply_number;
                        deleteReply($formData, $deleted);
                    });
                    //form_reply.find('#table_reply').append(msg).fadeIn(1000);
                    parent.resizeIframe($('html').height());
                    $('#btn_reply_delete').click(callback);
                    e.cancelBubble();
                    //duplication 방지
                }
            },
            //오류 발견시 체크
            error : function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }));
}

function updateForm(form_update){
    //수정하기 폼 전송
    form_update.on('submit',(function(e){
        e.preventDefault();
        var form = document.forms['form_update'];
        //폼검증 전처리
        if(!form.title.value){
            var msg = "오류 : 제목을 입력해주세요.";
            $('#alert_write').empty();
            $('#alert_write').append(msg);
            //form.title.focus();
            return false;
        }
        //폼검증 후 처리
        var action = $("#form_update").attr('action');
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
                    alert("세션이 종료되었습니다. 로그인 후 재시도 해주세요.");
                    parent.setLogin();
                    e.cancelBubble();
                }
                else{
                    //글이 수정되었으므로 새로 불러오기
                    var msg = "<br>확인 : 글이 수정되었습니다";
                    $('#alert_write').empty();
                    $('#alert_write').append(msg);
                    getBoardLists(data.owner, data.number);
                }
            },
            //오류 발견시 체크
            error : function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }));
}

//이미지 파일 유무를 확인하여 무엇을 띄울지 결정
function UrlExists(url)
{
	var image_url ='images/user.png'; 
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if((http.status!=404) == true) return url;
    else return image_url;
}

//jQuery 시작
$(document).ready(function (){
    //글읽기 css 수정
    appendHeight = $('#read_fieldset').height();
    $('.read').height((parseInt(appendHeight)+8)+'px');
    // 부모 iframe resize
    parent.resizeIframe($('html').height()+100);

    var currentPage = document.location.href;
    currentPage = currentPage.slice(7);
    var arr = currentPage.split("?");
    var room = arr[1];
    //게시판 주인 이미지 오른쪽에 설정
    var img_url = UrlExists('php/user_images/'+ room +'.png');
    $("#owner_img").attr("src", img_url);
    $("#owner_id").empty();
    var owner_id_msg = room + "님의 ";
    $("#owner_id").append(owner_id_msg);
    room = decodeURIComponent( room );
    //hidden input에다가 게시판 owner 값을 넣어줌
    $('#owner').val(room);
    getBoardLists(room);

    //처음 불러왔을 때 글쓰기 폼 숨기기
    $('#board_write_form').hide();

    //글쓰기 버튼을 눌렀을 때 펼치기
    $('#board_write').click(function(e) {
        //$('#board_write_form').show();
        e.stopPropagation();
        if($('#board_write').val() == "글쓰기"){
            $('#board_write_form').slideDown('slow', function() {
                // Animation complete.
                $('#board_write').val("접기");
                parent.resizeIframe($('html').height());
            });
        }
        else{
            $('#board_write_form').slideUp('slow', function() {
                // Animation complete.
                $('#board_write').val("글쓰기");
                parent.resizeIframe($('html').height());
            });
        }
    });

    //글쓰기 폼 전송시 이벤트 핸들러
    $("#form_write").on('submit',(function(e){
        e.preventDefault();
        //프로필 수정 버튼을 눌렀을 때 이벤트 처리
        //$('#set_profile').click(function () {

        //폼검증 전처리
        if(!form.title.value){
            var msg = "오류 : 제목을 입력해주세요.";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            //form.title.focus();
            return false;
        }
         //폼검증 후 처리
         var action = $("#form_write").attr('action');
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
                     alert("세션이 종료되었습니다. 로그인 후 재시도 해주세요.");
                     parent.setLogin();
                     e.cancelBubble();
                 }
                 else{
                     //글을 새로 입력했으니 게시판 새로 불러오기
                    getBoardLists(room);
                     //글쓰기 창 닫기
                     $('#board_write_form').slideUp("slow");
                     var msg = "확인 : 새로운 글을 입력하셨습니다.";
                     $('#alert_write').empty();
                     $('#alert_write').append(msg);
                     //글쓰기 폼 초기화
                     $('#board_write').val("글쓰기");
                     $('#title').val("");
                     $('#content').val("");
                 }
             },
            //오류 발견시 체크
             error : function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
             }
         });
    }));

    // 0724 progress bar
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    var form = document.forms['form_write'];
    $('form').ajaxForm({
        beforeSend: function() {
            status.empty();
            var percentVal = '0%';
            bar.width(percentVal);
            percent.html(percentVal);
        },
        uploadProgress: function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal);
            percent.html(percentVal);
        },
        complete: function(xhr) {
            status.html(xhr.responseText);
        }
    });

    $('#table_title').click(function() {
        //$('#board_write_form').show();
        //e.stopPropagation();
        $('#table_board ul .read').slideUp('slow');
    });

    //검색 필터
	$('#search').keyup(function() {
	    var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
	        reg = RegExp(val, 'i'),
	        text;

	    $rows.show().filter(function() {
	        text = $(this).text().replace(/\s+/g, ' ');
	        return !reg.test(text);
	    }).hide();
	});

    /* 업로드 코드 보류됨
    //업로드 추가 버튼을 눌렀을 때
    $('#upload_plus').click(function () {
        var tmp = '<li><input id="file" type="file"><a href="#" class="upload_remove"><b>-</b></a></li>';
        $('#div_upload ul').append(tmp);
        upload++;
    });
    $('#ul_upload').on('click', '.upload_remove', function(e) {
        e.preventDefault();
        $(this).closest('li').remove();
        upload--;
    });
    */

});
	
