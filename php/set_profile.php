<?php
	include_once 'function.php';
	
	$id = $_POST['id'];
	$password = $_POST['password'];
	$password = encrypt($password, $key);
	$name = $_POST['name'];
	$sex = $_POST['sex'];
	$birthday = $_POST['birthday'];
	$email = $_POST['email'];

	//로그인 확인, 세션이 종료되었으면  id = null
	$check = checklogin();
	if($check == false){
		$arr = array('id' => null);
		echo (json_encode($arr));
	}
	else{
		   $query = "UPDATE member SET 
					name = '$name',
					sex = '$sex',
					birthday = '$birthday',
					email = '$email'
					WHERE id = '$id'";
			queryMysql($query);
            $query = "UPDATE login SET
                        password = '$password'
                        WHERE id = '$id'";
            queryMysql($query);

			$arr = array('id' => $id);
			echo (json_encode($arr));
			
			if (isset($_FILES['image']['name'])){
				//프로필	 사	진 저장
				$saveto = "./user_images/$id.png";
				//echo($saveto);
				move_uploaded_file($_FILES['image']['tmp_name'], "$saveto");
				$typeok = TRUE;
				switch($_FILES['image']['type'])
				{
					case "image/gif":   $src = imagecreatefromgif($saveto); break;
					case "image/jpeg": $src = imagecreatefrompng($saveto); break;
					case "image/pjpeg":	$src = imagecreatefromjpeg($saveto); break;
					case "image/png":
					default:	 $typeok = FALSE; break;
				}
				
				if ($typeok)
				{
					list($w, $h) = getimagesize($saveto);
					$max = 128;
					$tw  = $w;
					$th  = $h;
					
					if ($w > $h && $max < $w)
					{
						$th = $max / $w * $h;
						$tw = $max;
					}
					elseif ($h > $w && $max < $h)
					{
						$tw = $max / $h * $w;
						$th = $max;
					}
					elseif ($max < $w)
					{
						$tw = $th = $max;
					}
					$tmp = imagecreatetruecolor($tw, $th);
					imagecopyresampled($tmp, $src, 0, 0, 0, 0, $tw, $th, $w, $h);
					imagejpeg($tmp, $saveto);
					imagedestroy($tmp);
					imagedestroy($src);
				}
			}
	}
?>
