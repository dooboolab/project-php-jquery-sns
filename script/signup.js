//jQuery
$(document).ready(function (){
    $('#alert_msg').empty();
    $('#password').focus(function(){
            var msg = "<p style='color:#BBBBBB; font-size:13'>암호는 100% 암호화 되어 저장됩니다.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
     });
    //회원가입 버튼을 눌렀을 때 이벤트 처리
    $('#signup').click(function () {
        var form = document.forms['form_signup'];
        //폼검증 전처리
        if(!form.id.value){
            var msg = "<p style='color:#FFCCCC; font-size:13'>아이디를 입력해주세요.</p>";
            $('#alert_msg').empty();
            $('#alert_msg').append(msg);
            form.id_login.focus();
            return false;
        }
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
                    location.href = "signup_ok.html";
                }
                else{
                    var msg = "<p style='color:#CCCCCC; font-size:13'>아이디가 이미 존재합니다. 다른 아이디를 사용해주세요.</p>";
                    $('#alert_msg').empty();
                    $('#alert_msg').append(msg);
                    form.id.focus();
                }
            }
        });
    });
});