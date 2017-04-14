<?php
	include_once 'function.php';
	//로그인을 위한 코드
	$id = $_POST['id'];
	$password = $_POST['password'];
	$password = encrypt($password, $key);

	$query = "SELECT id, password FROM login 
			  WHERE id='$id' and password = '$password'";

	$result = queryMysql($query);

	if (mysql_num_rows($result) == 0)
	{
		echo(false);
	}
	else
	{
		echo($id);
		session_start();
		$_SESSION['id'] = $id;
		// 아래를 설정해주어야 세션에 등록된다
		// session_register(id);
		// session_save_path("session");
	}
?>
