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

//이미지 파일 유무를 확인하여 무엇을 띄울지 결정
function UrlExist(_url){
	var default_url = 'images/user.png';
     $.ajax({
         url:_url,
         type:'HEAD',
         error: function()
         {
             $('#user_image').attr("src", default_url);
         },
         success: function()
         {
             $('#user_image').attr("src", _url);
         }
     });
}

//jQuery
$(document).ready(function (){	
	// 부모 iframe resize
	parent.resizeIframe($('html').height());
	

	//Jquery-UI DatePicker
	$( "#datepicker" ).datepicker({
		dateFormat: 'yy-mm-dd',
		prevText: '이전 달',
		nextText: '다음 달',
		monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
		dayNames: ['일','월','화','수','목','금','토'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		showMonthAfterYear: true,
		yearSuffix: '년',
		showOn: "both",
		yearRange: '1920:2014',
		changeYear: true
	});

	//file 양식으로 이미지를 선택(값이 변경) 되었을때 처리하는 코드
	$("#image").change(function(){
	    readURL(this);
	});
    //페이지를 열었을 때 디비로부터 정보 불러오기
    //login, member 테이블로부터 가져오기
    $.ajax({
        type : "get",
        url : "php/get_profile.php",
        cache : false,
        dataType : "json",
        success : function(data){
            if(data.id == null){
                $('#main').empty();
                $('#main').append('회원가입시 이용가능합니다.');
                parent.setLogin();
            }
            else{
                $('#id').val(data.id);
                $('#password').val(data.password);
                $('#password_ok').val(data.password);
                $('#name').val(data.name);
                $('input:radio[name=sex]:input[value='+data.sex+']').attr("checked", true);
                $('#datepicker').val(data.birthday);
                $('#email').val(data.email);
                UrlExist('php/user_images/'+data.id+'.png');
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
            var msg = "<p style='color:#FFCCCC; font-size:13'>암호를 입력해주세요.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            form.password.focus();
            return false;
        }
        if(!form.password_ok.value){
            var msg = "<p style='color:#FFCCCC; font-size:13'>암호를 확인해주세요.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            form.password_ok.focus();
            return false;
        }
        if(form.password.value != form.password_ok.value){
            var msg = "<p style='color:#FFCCCC; font-size:13'>암호와 암호 확인이 일치하지 않습니다.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            form.password_ok.focus();
            return false;
        }
        if(!form.name.value){
            var msg = "<p style='color:#FFCCCC; font-size:13'>이름을 입력해주세요.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            form.name.focus();
            return false;
        }
        if(!form.sex.value){
            var msg = "<p style='color:#FFCCCC; font-size:13'>성별을 입력해주세요.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            form.sex.focus();
            return false;
        }
        if(!form.birthday.value){
            var msg = "<p style='color:#FFCCCC; font-size:13'>성을 입력해주세요.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            form.birthday.focus();
            return false;
        }
        if(form.email.value != null){
				var emailFormat = /^([0-9a-zA-Z_-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
				if(form.email.value.search(emailFormat) == -1){
					var msg = "<p style='color:#FFCCCC; font-size:13'>유효하지 않은 이메일입니다.</p>";
		            $('#alert_msg').empty();
		            $('#alert_msg').append(msg);
					form.email.focus();
					return false;
				}
        }

        //폼검증 후 처리
        //var formData = $("#form_profile").serialize();
        var action = $("#form_profile").attr('action');
        //이미지 파일도 formData에 추가
        var show = "";
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
                    location.reload();
                }
                else{

					//이미지 파일을 refresh
                    var d = new Date();
                    $("#user_image").attr("src", "php/user_images/" + data.id + ".png?"+d.getTime());

					//수정되었음을 알림
		            var msg = "<p style='color:#CCCCCC; font-size:13'>프로필이 수정되었습니다.</p>";
		            $('#alert_msg').empty();
		            $('#alert_msg').append(msg);
                }
            },
            //오류 발견시 체크
			error : function(request,status,error){
				//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
			}
        });
    }));
});