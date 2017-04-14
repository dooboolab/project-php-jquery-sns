<?php
	include_once 'function.php';
	//로그인을 위한 코드
	$check = checklogin();
    if($check == false){
        echo (0);
    }
	else{
		$id = $_SESSION['id'];
		$query = "SELECT * FROM login WHERE id='$id'";
		$result = queryMysql($query);
		$row1 = mysql_fetch_row($result);
		$query = "SELECT * FROM member WHERE id='$id'";
		$result = queryMysql($query);
		$row2 = mysql_fetch_row($result);
		
		$row1[1] = decrypt($row1[1], $key);
		
		$arr = array('id' => $row1[0], 'password' => $row1[1], 'name' => $row2[1], 'sex' => $row2[2], 'birthday' => $row2[3], 'email' => $row2[4]);
		
		echo (json_encode($arr));
	}
?>
