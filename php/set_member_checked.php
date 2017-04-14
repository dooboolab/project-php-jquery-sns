<?php
	include_once 'function.php';
	//로그인을 위한 코드
	$check = checklogin();
	if($check == false){
		echo (null);
	}
	else{
		$id = $_SESSION['id'];
        $member = $_GET['member'];
        $insert = $_GET['insert'];
        $arr= array();

        if($insert == "true"){
            $query = "insert into checked values('$id', '$member')";
            $result = queryMysql($query);
        }
        else{
            $query = "delete from checked where id='$id' and member='$member'";
            $result = queryMysql($query);

        }
        array_push($arr, array('id' => $id));
        echo (json_encode($arr));
	}
