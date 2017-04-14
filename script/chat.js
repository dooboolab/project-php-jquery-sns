//이미지 파일 유무를 확인하여 무엇을 띄울지 결정
var id;

function UrlExists(url)
{
    var image_url ='images/user.png';
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

    //connected to server
    websocket.onopen = function(ev) {
        var msg = {
            type : "system",
            id : id,
            message: "님이 채팅에 참여하였습니다."
        };
        //convert and send data to server
        websocket.send(JSON.stringify(msg));
        /*
        var msg =
            '<tr>' +
                '<td colspan="3">채팅서버에 접속하였습니다.</td>' +
            '</tr>';

        $('#table_chat').append(msg); //notify user
        */

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
                $('#table_chat').append("<tr style='color: red;'><td colspan='3'>("+uid+")" + umsg + "</td></tr>");
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
                    var img_url = UrlExists('php/user_images/'+ uid+'.png');
                    $('#users').empty();
                    $('#users').append("<li>" + uid +"</li>");
                    parent.resizeIframe($('html').height());
                }
                else{
                    var img_url = UrlExists('php/user_images/'+ uid+'.png');
                    var append =
                        '<tr>' +
                            '<td width="80"><img src="' + img_url + '" width="40" height="40"></td>' +
                            '<td width="80" style="color: blue;">'+ uid + '</td>' +
                            '<td>'+umsg+'</td>' +
                            '</tr>';

                    $('#table_chat').append(append);
                    parent.resizeIframe($('html').height());
                }
            }
        }
        $('#tweet').val('');
    };

    websocket.onerror	= function(ev){
        var msg =
            '<tr>' +
                '<td colspan="3">채팅서버 오류 : '+ ev.data +'</td>' +
            '</tr>';
        $('#table_chat').append(msg);
    };

    websocket.onclose = function(ev){
        $('#users').append("<li>채팅 서버와 연결이 끊겼습니다</li>");
    };

    //tweet 버튼 눌렀을 때 이벤트 발생
    $('#btn_tweet').click(function(){ //use clicks message send button
        var message = $('#tweet').val(); //get message text
        if(message != ""){ //emtpy message?
            //prepare json data
            var msg = {
                type : "user_message",
                id : id,
                message: message
            };
            //convert and send data to server
            websocket.send(JSON.stringify(msg));
            //버튼을 클릭했을 때 db 글쓰기 수행
            //폼검증 후 처리
            var formData = {
                id : id,
                tweet : message
            };
            //이미지 파일도 formData에 추가
            $.ajax({
                type : "post",
                url : "php/set_chat.php",
                data : formData,
                dataType : "json",
                success : function(data){
                    if (data[0].id == undefined) {
                        $('#main').empty();
                        $('#main').append('회원가입시 이용가능합니다.');
                        parent.setLogin();
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

//jQuery
$(document).ready(function (){
    get_chat();
    function get_chat() {
        $.ajax({
            //data : formData,
            type : "get",
            url : "php/get_chat.php",
            cache : false,
            dataType : "json",
            success : function(data){
                if (data == undefined) {
                    $('#main').empty();
                    $('#main').append('회원가입시 이용가능합니다.');
                    parent.setLogin();
                }
                else{
                    id=data[0].id;
                    $('#table_chat').empty();
                    //입력된 댓글을 append 시킴
                    var chat = "";
                    //php 파일에서 첫 열에 id값을 주었기 때문에 1부터 시작한다
                    for(var i=data.length-1; i > 0; i--){
                        var img_url = UrlExists('php/user_images/'+data[i].id+'.png');
                        chat +=
                            '<tr>' +
                                '<td width="80"><img src="' + img_url + '" width="40" height="40"></td>' +
                                '<td width="80" style="color: blue;">'+ data[i].id + '</td>' +
                                '<td>'+data[i].tweet+'</td>' +
                            '</tr>';
                    }
                    $('#table_chat').append(chat).show();
                    parent.resizeIframe($('html').height() + 30);
                    //소켓을 시작한다
                    connect_socket();
                    //window.setTimeout(get_chat(), 30000 );
                }
            }
            /*
            //오류 발견시 체크
            error : function(request,status,error){
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
            */
        });
    }
});