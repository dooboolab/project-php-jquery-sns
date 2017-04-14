<?php
	include 'function.php';
	destroySession();
	if(isset($_SESSION['id']))
	{
		echo(false);
	}
	else
	{
		echo(true);
	}
?>