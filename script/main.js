//자식 페이지에서 로그인 화면으로 바꾸기 수행
function setLogin(){
    $('#rlogin').empty();
    $('#after_login').hide();
    $('#before_login').show();
    document.location.reload(true);
    //document.getElementById("frame").contentWindow.location.reload(true);
}
//자식 페이지에서 resize 수행
function resizeIframe(newHgt)
{
    $('#frame').height((parseInt(newHgt)+40)+'px');
}

//모바일인지 아닌지 확인
function checkDevice(){
    var uAgent = navigator.userAgent.toLowerCase();
    var mobilePhones = new Array('iphone', 'ipod', 'android', 'blackberry', 'windows ce', 'nokia', 'webos', 'opera mini', 'sonyericsson', 'opera mobi', 'iemobile');   //기기종류 나열
     
    for (var i = 0; i < mobilePhones.length; i++) {
        if (uAgent.indexOf(mobilePhones[i]) > -1){
           document.location.replace("/mobile/index.html");   //히스토리 없이 페이지 이동
           //document.location = "url";    //히스토리 남음
         }
    }// for문 끝
}

function setContent(url){
	document.all["frame"].src=url;
}

function logout(){
    var show = "";
    $.ajax({
        type : "get",
        url : "php/logout.php",
        cache : false,
        dataType : "text",
         //html, xml, text, script, json, jsonp
        success : function(data){
            if (data == 0) {
                $('#rlogin').empty();
                show += '로그아웃을 하지 못했습니다.';
                $('#rlogin').append(show);
            }
            else{
                $('#after_login').empty();
                $('#after_login').hide();
                $('#before_login').show();
				$('#board a').attr('onclick','setContent("myboard.html")');
                document.getElementById("frame").contentWindow.location.reload(true);
            }
        }
    });
}

//jQuery
var login = false;
$(document).ready(function (){
    //모바일인지 피시인지 확인
    //checkDevice();
	/*
    $('#frame').load(function() {
        //$(this).css("height", $(this).contents().find("body").height() + "px");
        //$(this).height( $(this).contents().find("body").height() );
    });
    */
	
    //로그인 되어있는지 아닌지 확인하기
    $.ajax({
        type : "get",
        url : "php/checklogin.php",
        cache : false,
        dataType : "text",
        success : function(data){
            if (data == 0) {
                login = false;
                $('#rlogin').empty();
                $('#after_login').hide();
                $('#before_login').show();
            }
            else{
                var show = "";
                login = true;
                $('#before_login').hide();
                $('#after_login').show();
                $('#rlogin').empty();
                show += "<p><br />" + data + 
                        "님 환영합니다.&nbsp;<a href = 'javascript:void(0);' onclick='logout();'>로그아웃</a></p>";
                $('#after_login').append(show);
                //board url 바꾸기
				$('#board a').attr('onclick','setContent("myboard.html?'+ data+'")');
            }
        }
    });

    //로그인 버튼을 눌렀을 때 이벤트 처리
    $('#login').click(function () {
        var formData = $("#form_id").serialize();
        var action = $("#form_id").attr('action');
        var show = "";
        $.ajax({
            type : "post",
            url : action,
            data : formData,
            cache : false,
            dataType : "text",
            success : function(data){
                if (data == 0) {
                    $('#rlogin').empty();
                    show += '일치하는 아이디와 암호가 없습니다. &nbsp;<a href = "#">암호를 잊어버리셨나요?</a>';
                    $('#rlogin').append(show);
                }
                else{
                    login = true;
                    //document.location.reload(true);
                    $('#before_login').hide();
                    $('#after_login').show();
                    $('#rlogin').empty();
                    show += "<p><br />" + data + 
                            "님 환영합니다.&nbsp;<a href = 'javascript:void(0);' onclick='logout();'>로그아웃</a></p>";
                    $('#after_login').append(show);
					$('#board a').attr('onclick','setContent("myboard.html?'+ data+'")');
                }
                document.getElementById("frame").contentWindow.location.reload(true);
            }
        });
    });
});