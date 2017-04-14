<?php
/**
 * Created by PhpStorm.
 * User: hyochan
 * Date: 2014. 6. 19.
 * Time: 오후 9:08
 */
include_once 'function.php';
//로그인을 위한 코드
$check = checklogin();
if($check != false){
    $id = $_SESSION['id'];
    $tweet = $_POST['tweet'];
    $arr = array();
    $day =  date("Y-m-d H:i:s");
    //우선 data[0]에 아이디 값을 넣음
    array_push($arr, array('id' => $id, 'tweet' => $tweet));

    //우선 체크된 맴버가 있는지 확인
    $query = "insert into chat values('$id', '$tweet', '$day')";
    $result = queryMysql($query);

    echo (json_encode($arr));
}

