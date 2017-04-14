<?php
	include_once 'function.php';
	//로그인을 위한 코드
	$check = checklogin();
	if($check == false){
        echo(null);
	}
	else{
		$id = $_SESSION['id'];

        //우선 체크된 맴버가 있는지 확인
        $query = "SELECT member FROM checked where id='$id'";
        $result = queryMysql($query);
        $checked_arr = array();
        for ($i = 0 ; $i < mysql_num_rows($result); $i++){
            $checked_row = mysql_fetch_row($result);
            array_push($checked_arr, $checked_row[0]);
        }

		$query = "SELECT * FROM member";
		$result = queryMysql($query);
		$arr= array();
        $arr_check = array();

		for ($i = 0 ; $i < mysql_num_rows($result); $i++){
            $set = false;
            $row = mysql_fetch_row($result);
            //아이디만 빼고 리스트 보내주기
            if($set == false && $row[0] != $id){
                array_push($arr, array('id' => $row[0], 'name' => $row[1], 'sex' => $row[2], 'birthday' => $row[3], 'email' => $row[4]));
            }
        }
        $new["member"][] = $arr;
        $new["checked"][] = $checked_arr;
        echo (json_encode($new));
    }

