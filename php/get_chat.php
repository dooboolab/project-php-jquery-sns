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
if($check == true){
    $id = $_SESSION['id'];

    $arr = array();
    //우선 data[0]에 아이디 값을 넣음
    array_push($arr, array('id' => $id));

    //우선 체크된 맴버가 있는지 확인
    $query = "SELECT * FROM chat ORDER BY day desc LIMIT 0, 5";
    $result = queryMysql($query);

    for ($i = 0 ; $i < mysql_num_rows($result); $i++){
        $row = mysql_fetch_row($result);
        array_push($arr, array('id' => $row[0], 'tweet' => $row[1]));
    }
}
echo (json_encode($arr));
