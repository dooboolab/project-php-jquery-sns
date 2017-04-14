<?php
	include_once 'function.php';
	//로그인을 위한 코드
	$check = checklogin();
	if($check == false){
		echo(false);
	}
	else{
		echo($_SESSION['id']);
	}
