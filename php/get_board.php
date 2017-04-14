<?php
include_once 'function.php';
//로그인을 위한 코드
/*
 * 0 : number
 * 1 : owner
 * 2 : title
 * 3 : id
 * 4 : day
 * 5 : visit
 * 6 : open
 * 7 : email
 * 8 : content
 */
$check = checklogin();
if($check == false){
    array_push($arr, array('my_id' => null));
}
else{
    /* 잘되던 코드
    $id = $_SESSION['id'];
    $query = "SELECT * FROM board order by number desc";
    $result = queryMysql($query);
    $arr= array();
    for ($i = 0 ; $i < mysql_num_rows($result); $i++){
        $row = mysql_fetch_row($result);
        array_push($arr,
            array('number' => $row[0],
                'owner' => $row[1],
                'title' => $row[2],
                'id' => $row[3],
                'day' => $row[4],
                'visit' => $row[5],
                'open' => $row[6],
                'content' => $row[7]
            )
        );
    }
    array_push($arr, array('my_id' => $id));
}
echo (json_encode($arr));
*/
    $id = $_SESSION['id'];
    $owner = $_GET['room'];

    $query = "SELECT * FROM board where owner = '$owner' order by number desc";
    $result = queryMysql($query);
    $board= array();
    $reply = array();
    //게시판
    for ($i = 0 ; $i < mysql_num_rows($result); $i++){
        $row = mysql_fetch_row($result);
        //해당 글에 업로드 된 파일이 있는지 확인
        $array = array('./user_files', $owner, $row[0]);
        $read_dir = implode("/", $array);
        $file = false;
        if(is_dir($read_dir)){
            if($handle = opendir($read_dir)){
                while(false != ($file = readdir($handle))){
                    $file_name = $file;
                }
            }
            $file = true;
            $array = array($read_dir, $file_name);
            $file_dir = implode("/", $array);
        }

        array_push($board,
            array('number' => $row[0],
                'owner' => $row[1],
                'title' => $row[2],
                'id' => $row[3],
                'day' => $row[4],
                'visit' => $row[5],
                'open' => $row[6],
                'content' => $row[7],
                'file' => $file,
                'file_dir' => $file_dir,
                'file_name' => $file_name
            )
        );
    }
    //댓글
    $query = "SELECT * FROM reply where owner = '$owner'";
    $result = queryMysql($query);
    for ($i = 0 ; $i < mysql_num_rows($result); $i++){
        $row = mysql_fetch_row($result);
        array_push($reply,
            array(
                'reply_number' => $row[0],
                'number' => $row[1],
                'owner' => $row[2],
                'id' => $row[3],
                'reply' => $row[4],
                'day' => $row[5]
            )
        );
    }
    array_push($board, array('my_id' => $id));
    $new["board"][] = $board;
    $new["reply"][] = $reply;
}
echo (json_encode($new));
