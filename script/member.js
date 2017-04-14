//이미지를 크게 띄워 보여주고 이미지 클릭시 창이 닫히는 스크립트
String.prototype.popupView = function () {

	var img_view = this;
	var x = x + 20 ;
	var y = y + 30 ;
	htmlz = "<html><head><title>이미지크게보기</title><style>body{margin:0;cursor:hand;}</style></head><body scroll=auto onload='width1=document.all.Timage.width;if(width1>1024)width1=1024;height1=document.all.Timage.height;if(height1>768)height1=768;top.window.resizeTo(width1+30,height1+54);' onclick='top.window.close();'><img src='"+img_view+"' title='클릭하시면 닫힙니다.' name='Timage' id='Timage'></body></html>"
	imagez = window.open('', "image", "width="+ 100 +", height="+ 100 +", top=0,left=0,scrollbars=auto,resizable=1,toolbar=0,menubar=0,location=0,directories=0,status=1");
	imagez.document.open();
	imagez.document.write(htmlz)
	imagez.document.close();
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

//jQuery
$(document).ready(function (){	
	// 부모 iframe resize
	parent.resizeIframe($('html').height());
	var $rows;
    //페이지를 열었을 때 디비로부터 정보 불러오기
    //login, member 테이블로부터 가져오기
    $.ajax({
        type : "get",
        url : "php/get_member.php",
        cache : false,
        dataType : "json",
        success : function(json){
            if(json == undefined){
                $('#main').empty();
                $('#main').append('회원가입시 이용가능합니다.');
                parent.setLogin();
            }
            else{
                var tmp;
                var data = json.member[0];
                var checked = json.checked[0];
                //alert(checked.length);
				$('#table_member').empty();
				for(var i=0; i<data.length; i++){
                    var isChecked = false;
                    //1. 체크가 안된놈은 아래 append 시 체크 버튼을 띄움
                    for(var j=0; j<checked.length; j++){
                        if(data[i].id == checked[j]){
                            isChecked = true;
                        }
                    }
                //alert(isChecked);
                    var img_url = UrlExists('php/user_images/'+data[i].id+'.png');
                    var append = '<tr align="center">'
                    + '<td bgcolor=white width="100">'
                    + '<img src="' + img_url + '" width="40" height="40" title="클릭하시면 원본크기로 보실 수 있습니다."'
                    + ' style="cursor: pointer; vertical-align:middle;" onclick="this.src.popupView();"/></td>'
                    +'<td bgcolor=white width="100"><a href="myboard.html?' + data[i].id +'">' + data[i].id + '</a></td>'
                    + '<td bgcolor=white width="100">' + data[i].name + '</td>'
                    + '<td bgcolor=white width="100">' + data[i].sex + '</td>'
                    + '<td bgcolor=white width="150">' + data[i].birthday + '</td>'
                    + '<td bgcolor=white width="200"><a href="mailto:' + data[i].email + '">' + data[i].email + '</a></td>'
                    + '<td bgcolor=white width="50" align="center">'
                    + '<input id="member" name="member" type="hidden" value="' + data[i].id + '">';
                        // 2. 체크가 안된놈은 아래 append 시 체크 버튼을 띄움
                        if(isChecked == false){
                            append += '<input class="checked" name="checked" type="button" value="체크"></td>';
                        }
                        else{
                            append += '<input class="checked" name="checked" type="button" value="해제"></td>';
                        }
                    append += '</tr>';
                    if(isChecked == true){
                        $('#table_member').append(append);
                    }
                    //체크가 안된 녀석은 변수에 일단 보관한다.
                    else{
                        tmp += append;
                    }
				}
                //다 돌았으면 마지막에 체크 안된 놈들을 뿌려준다.
                $('#table_member').append(tmp);

				$rows =  $('#table_member tr');

                $('.checked').on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var member =$(this).parent().find('#member').val();
                    var insert;
                    var list;
                    //alert($(this).val() == "해제");
                    if($(this).val() == "체크"){
                        insert=true;
                        $(this).val("해제");
                        //리스트를 삭제하고 이 회원 리스트를 제일 위로 올림
                        list =$(this).parent().parent();
                        $(list).hide().prependTo('#table_member').fadeIn("slow");
                    }
                    else{
                        insert = false;
                        $(this).val("체크");
                        //리스트를 삭제하고 이 회원 리스트를 제일 아래로 내림
                        list =$(this).parent().parent();
                        $('#table_member').hide().append(list).fadeIn("slow");
                    }
                    var formData = "member="+member+"&insert="+insert;

                    $.ajax({
                        type : "get",
                        url : "php/set_member_checked.php",
                        cache : false,
                        data: formData,
                        dataType : "json",
                        success : function(json){
                            if(json == undefined){
                                $('#main').empty();
                                $('#main').append('회원가입시 이용가능합니다.');
                                parent.setLogin();
                            }
                        }
                    });
                });

                // 부모 iframe resize
				parent.resizeIframe($('html').height());
            }
        },
        //오류 발견시 체크
		error : function(request,status,error){
			//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		    $('#main').empty();
            $('#main').append('회원가입시 이용가능합니다.');
		}
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

});