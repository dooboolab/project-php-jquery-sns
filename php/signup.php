<?php
	include_once 'function.php';

	$id = $_POST['id'];
	$password = $_POST['password'];
	$password = encrypt($password, $key);

	$queryf = "SELECT * FROM login where id = '$id'";
	$resultf = queryMysql($queryf);
	if (mysql_num_rows($resultf) == 0)
	{
		//login 테이블에 튜플 삽입
		$queryt = "INSERT INTO login VALUES('$id','$password')";
		queryMysql($queryt);
		//member 테이블에 튜플 삽입
		$queryt = "INSERT INTO member VALUES('$id','', '', '', '')";
		queryMysql($queryt);
		echo($id);
		session_start();
		$_SESSION['id'] = $id;

		// 아래를 설정해주어야 세션에 등록된다
		// session_register($id);
		// session_save_path("session");
	}
	else
	{
		echo(false);
	}
?>