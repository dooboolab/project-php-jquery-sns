<?php
include_once 'function.php';
//로그인 확인, 세션이 종료되었으면  id = null
$check = checklogin();
if($check == false){
    echo (0);
}
else{
    //모바일 전용 게시판 글 쓰기
    //owner에 $id를 넣어주는 것 외에는 별 차이가 없음.
    if(isset($_POST['mobile_btn_write'])){
        $title = $_POST['title'];
        $id = $_SESSION['id'];
        $owner = $id;
        $day =  date("Y-m-d H:i");
        $time =  date("m월d일 H:i:s");
        $open = $_POST['open'];
        $content = $_POST['content'];

        $query = "insert into board values(null, '$owner', '$title', '$id', '$day', '$time', '$open', '$content')";
        queryMysql($query);

        //파일 업로드
        if (isset($_FILES['user_file']['name'][0]))
        {
            $files = true;
            //우선 게시판 글 number 검색
            $query = "select number from board
                            where owner = '$owner'
                               and title = '$title'
                               and time = '$time'
                               and id = '$id'
                               and content = '$content'";
            $result = queryMysql($query);
            $row = mysql_fetch_row($result);

            //우선 files폴더 접근
            $array = array('./user_files', $owner, $row[0]);
            $add_dir = implode("/", $array);
            //소문자로 다 바꿈
            $extension = strtolower($add_dir);
            //$owner 디렉토리 존재유무 체크
            if(!is_dir($add_dir))
            {
                //존재하지 않으면 디렉토리 생성
                $oldumask = umask(0);
                mkdir("$add_dir", 0707, true);
                chmod("$add_dir",0707);
                umask($oldmask);
            }
            move_uploaded_file($_FILES['user_file']['tmp_name'],$add_dir .'/'. $_FILES['user_file']['name']);
        }
        $arr = array('id' => $id);
        echo (json_encode($arr));
    }
    //글 쓰기 폼이 전송되었으면
    /*
     * number : 0
     * owner : 1
     * title : 2
     * id : 3
     * day : 4
     * visit : 5, x
     * open : 6
     * content : 7
     */
    else if(isset($_POST['btn_write'])){
        $owner = $_POST['owner'];
        $title = $_POST['title'];
        $id = $_SESSION['id'];
        $day =  date("Y-m-d H:i");
        $time =  date("m월d일 H:i:s");
        $open = $_POST['open'];
        $content = $_POST['content'];

        $query = "insert into board values(null, '$owner', '$title', '$id', '$day', '$time', '$open', '$content')";
        queryMysql($query);

        //파일 업로드
        if (isset($_FILES['user_file']['name'][0]))
        {
            $files = true;
            //우선 게시판 글 number 검색
            $query = "select number from board
                            where owner = '$owner'
                               and title = '$title'
                               and time = '$time'
                               and id = '$id'
                               and content = '$content'";
            $result = queryMysql($query);
            $row = mysql_fetch_row($result);

            //우선 files폴더 접근
            $array = array('./user_files', $owner, $row[0]);
            $add_dir = implode("/", $array);
            //소문자로 다 바꿈
            $extension = strtolower($add_dir);
            //$owner 디렉토리 존재유무 체크
            if(!is_dir($add_dir))
            {
                //존재하지 않으면 디렉토리 생성
                $oldumask = umask(0);
                mkdir("$add_dir", 0707, true);
                chmod("$add_dir",0707);
                umask($oldmask);
            }
            move_uploaded_file($_FILES['user_file']['tmp_name'],$add_dir .'/'. $_FILES['user_file']['name']);
        }
        $arr = array('id' => $id);
        echo (json_encode($arr));
    }

    //수정하기 폼이 전송되었으면
    /*
     * number : 0
     * owner : 1
     * title : 2
     * id : 3
     * day : 4
     * visit : 5, x
     * open : 6
     * content : 7
     */
    else if(isset($_POST['btn_updated'])){
        $number = $_POST['number'];
        $owner = $_POST['owner'];
        $title = $_POST['title'];
        $id = $_SESSION['id'];
        $open = $_POST['open'];
        $day =  date("Y-m-d H:i");
        $open = $_POST['open'];
        $content = $_POST['content'];

        $query = "update board set title = '$title', content ='$content', open='$open' where number='$number' and owner = '$owner'";
        queryMysql($query);

        //파일 저장
        if (isset($_FILES['user_file']['name'][0])){
            //우선 files폴더 접근
            $add_dir= "./user_files/$owner/$number/";

            //폴더가 존재하지 않으면 디렉토리 생성
            if(!is_dir($add_dir)){
                $oldumask = umask(0);
                mkdir("$add_dir", 0707, true);
                chmod("$add_dir",0707);
                umask($oldmask);
            }
            //기존 파일이있으면 삭제
            if($handle = opendir($add_dir)){
                while(false != ($file = readdir($handle))){
                    if(!is_dir($file)){
                        unlink($add_dir.$file);
                    }
                }
            }

            move_uploaded_file($_FILES['user_file']['tmp_name'],$add_dir .'/'. $_FILES['user_file']['name']);
        }

        $arr = array('id' => $id, 'number' => $number, 'owner' =>$owner);
        echo (json_encode($arr));
    }
    //답변다는 폼이 전송되었으면
    /*
     * number : 0
     * owner : 1
     * id : 2
     * reply : 3
     * date : 4
     */

    //여기에다가 reply_number값을 구해서 넘겨줘야 글을 올린후에 바로 삭제가 가능함
    else if(isset($_POST['btn_reply'])){
        $number = $_POST['number'];
        $owner = $_POST['owner'];
        $id = $_SESSION['id'];
        $reply = $_POST['txt_reply'];
        $day = date("m월d일 H:i");

        $query = "insert into reply values(null, $number, '$owner', '$id', '$reply', '$day')";
        queryMysql($query);
        $query = "select reply_number from reply
                        where number = '$number'
                               and owner = '$owner'
                               and id = '$id'
                               and day='$day'";
        $result = queryMysql($query);
        $row = mysql_fetch_row($result);

        $arr = array('reply_number' => $row[0],
                            'number' => $number,
                            'owner' =>$owner, 'id' => $id,
                            'reply' => $reply, 'day'=>$day);
        echo (json_encode($arr));
    }

    //게시글 삭제 요청
    else if(isset($_GET['board_number'])){
        $number = $_GET['board_number'];
        $owner = $_GET['owner'];
        $id = $_SESSION['id'];

        $query = "delete from board where
                            number = '$number'
                            and owner = '$owner'
                            and id = '$id'";
        queryMysql($query);

        //게시글에 해당하는 댓글도 삭제
        $query = "delete from reply where
                            number = '$number'
                            and owner = '$owner'";
        queryMysql($query);

        //업로드 된 파일이 있으면 삭제
        //디렉토리와 파일 모두 삭제
        $file_path = "./user_files/$owner/$number/";
        if(is_dir($file_path)){
            //폴더 안에 있는 파일 삭제
            if($handle = opendir($file_path)){
                while(false != ($file = readdir($handle))){
                    if(!is_dir($file)){
                        unlink($file_path.$file);
                    }
                }
            }
            //폴더 삭제
            rmdir($file_path);
        }

        $arr = array('id' => $id,'number' => $number, 'owner' =>$owner);
        echo (json_encode($arr));
    }

    //댓글 삭제 요청
    else if(isset($_GET['reply_number'])){
        $reply_number = $_GET['reply_number'];
        $number = $_GET['number'];
        $owner = $_GET['owner'];
        $id = $_SESSION['id'];

        $query = "delete from reply where
                            reply_number = '$reply_number'
                            and number = '$number'
                            and owner = '$owner'";
        queryMysql($query);
        $arr = array('id' => $id,'number' => $number, 'owner' =>$owner);
        echo (json_encode($arr));
    }
}
