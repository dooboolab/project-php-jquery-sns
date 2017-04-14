<?php // functions.php
header("Content-Type: text/html; charset=UTF-8");
$dbhost  = 'localhost';   
$dbname  = 'blackpearl'; 
$dbuser  = 'root'; 
$dbpass  = 'your_password';
$appname = "Black Pearl";
$key = "hyochan";

// get rid of error reporting
error_reporting(E_ERROR | E_PARSE);

mysql_connect($dbhost, $dbuser, $dbpass) or die(mysql_error());
mysql_select_db($dbname) or die(mysql_error());
mysql_query("set names utf8");

function createTable($name, $query)
{
	if (tableExists($name))
	{
		echo "Table '$name' already exists<br />";
	}
	else
	{
		queryMysql("CREATE TABLE $name($query)");
		echo "Table '$name' created<br />";
	}
}
function tableExists($name)
{
	$result = queryMysql("SHOW TABLES LIKE '$name'");
	return mysql_num_rows($result);
}

function queryMysql($query)
{
	$result = mysql_query($query) or die(mysql_error());
	return $result;
}


function destroySession()
{

	session_start();
	$_SESSION=array();
	session_unset();
	session_destroy();
}


function checklogin()
{
	session_start();
	//세션 고정 막기

	if(!isset($_SESSION['initiated']))
	{
	session_regenerate_id();
	$_SESSION['initiated'] = 1; 
	}
	if(!isset($_SESSION['count'])) $_SESSION['count'] = 0;
	else ++$_SESSION['count'];

	//세션 하이젝 막기
	$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
	if($_SESSION['ip'] != $_SERVER['REMOTE_ADDR']) {
		$check = "true";
	}
	if(isset($_SESSION['id']))
	{
		return true;
	}
	else
	{
		return false;
	}
	return $check;
}

function array2json($arr) {
    if(function_exists('json_encode')) return json_encode($arr); //Lastest versions of PHP already has this functionality.
    $parts = array();
    $is_list = false;

    //Find out if the given array is a numerical array
    $keys = array_keys($arr);
    $max_length = count($arr)-1;
    if(($keys[0] == 0) and ($keys[$max_length] == $max_length)) {//See if the first key is 0 and last key is length - 1
        $is_list = true;
        for($i=0; $i<count($keys); $i++) { //See if each key correspondes to its position
            if($i != $keys[$i]) { //A key fails at position check.
                $is_list = false; //It is an associative array.
                break;
            }
        }
    }

    foreach($arr as $key=>$value) {
        if(is_array($value)) { //Custom handling for arrays
            if($is_list) $parts[] = array2json($value); /* :RECURSION: */
            else $parts[] = '"' . $key . '":' . array2json($value); /* :RECURSION: */
        } else {
            $str = '';
            if(!$is_list) $str = '"' . $key . '":';

            //Custom handling for multiple data types
            if(is_numeric($value)) $str .= $value; //Numbers
            elseif($value === false) $str .= 'false'; //The booleans
            elseif($value === true) $str .= 'true';
            else $str .= '"' . addslashes($value) . '"'; //All other things
            // :TODO: Is there any more datatype we should be in the lookout for? (Object?)

            $parts[] = $str;
        }
    }
    $json = implode(',',$parts);

    if($is_list) return '[' . $json . ']';//Return numerical JSON
    return '{' . $json . '}';//Return associative JSON
}

//SQL Injection 예방 #2
function mysql_fix_string($string)
{
	if (get_magic_quotes_gpc()) $string = stripslashes($string);
	return mysql_real_escape_string($string);
}
//HTML Injection 막기
function mysql_entities_fix_string($string)
{
	return htmlspecialchars(mysql_fix_string($string));
}

function get_rnd_iv($iv_len)
{
   $iv = '';
   while ($iv_len-- > 0) {
       $iv .= chr(mt_rand() & 0xff);
   }
   return $iv;
}

function encrypt($data,$k) { 
 $encrypt_these_chars = "1234567890ABCDEFGHIJKLMNOPQRTSUVWXYZabcdefghijklmnopqrstuvwxyz.,/?!$@^*()_+-=:;~{}";
 $t = $data;
 $result2;
 $ki;
 $ti;
 $keylength = strlen($k);
 $textlength = strlen($t);
 $modulo = strlen($encrypt_these_chars);
 $dbg_key;
 $dbg_inp;
 $dbg_sum;
 for ($result2 = "", $ki = $ti = 0; $ti < $textlength; $ti++, $ki++) {
  if ($ki >= $keylength) {
   $ki = 0;
  }
  $dbg_inp += "["+$ti+"]="+strpos($encrypt_these_chars, substr($t, $ti,1))+" ";   
  $dbg_key += "["+$ki+"]="+strpos($encrypt_these_chars, substr($k, $ki,1))+" ";   
  $dbg_sum += "["+$ti+"]="+strpos($encrypt_these_chars, substr($k, $ki,1))+ strpos($encrypt_these_chars, substr($t, $ti,1)) % $modulo +" ";
  $c = strpos($encrypt_these_chars, substr($t, $ti,1));
  $d;
  $e;
  if ($c >= 0) {
   $c = ($c + strpos($encrypt_these_chars, substr($k, $ki,1))) % $modulo;
   $d = substr($encrypt_these_chars, $c,1);
   $e .= $d;
  } else {
   $e += $t.substr($ti,1);
  }
 }
 $key2 = $result2;
 $debug = "Key  : "+$k+"\n"+"Input: "+$t+"\n"+"Key  : "+$dbg_key+"\n"+"Input: "+$dbg_inp+"\n"+"Enc  : "+$dbg_sum;
 return $e . "";
}

function decrypt($key2,$secret) {
 $encrypt_these_chars = "1234567890ABCDEFGHIJKLMNOPQRTSUVWXYZabcdefghijklmnopqrstuvwxyz.,/?!$@^*()_+-=:;~{}";
 $input = $key2;
 $output = "";
 $debug = "";
 $k = $secret;
 $t = $input;
 $result;
 $ki;
 $ti;
 $keylength = strlen($k);
 $textlength = strlen($t);
 $modulo = strlen($encrypt_these_chars);
 $dbg_key;
 $dbg_inp;
 $dbg_sum;
 for ($result = "", $ki = $ti = 0; $ti < $textlength; $ti++, $ki++) {
  if ($ki >= $keylength){
   $ki = 0;
  }
  $c = strpos($encrypt_these_chars, substr($t, $ti,1));
  if ($c >= 0) {
   $c = ($c - strpos($encrypt_these_chars , substr($k, $ki,1)) + $modulo) % $modulo;
   $result .= substr($encrypt_these_chars , $c, 1);
  } else {
   $result += substr($t, $ti,1);
  }
 }
 return $result;
}

// $mode <- 에디터 모드 (1)텍스트모드, (2)에디터모드
// $editor_Url <- 에디터 경로 ../editor
// $formName <- 폼 이름 <form name="폼이름">
// $contentForm <- 폼 이름2 <textarea name="폼이름2"></textarea>
// $content <- 폼 내용 <textarea>폼 내용</textarea>
// $textWidth <- 폼 width값 (숫자만 입력)
// $textHeight <- 폼 height값 (숫자만 입력)
// $upload_image <- 이미지 업로드 사용 (1은 사용안함)
// $upload_media <- 미디어 업로드 사용 (1은 사용안함)

function myEditor($mode,$editor_Url,$formName,$contentForm,$textWidth,$textHeight){
	global $content,$upload_image,$upload_media;

	if(empty($mode)) $mode = '1';
	if(empty($editor_Url)) $editor_Url = '.';
	if(empty($formName)) $formName = 'add_form';
	if(empty($contentForm)) $contentForm = 'content';
	$textWidth = $textWidth ? $textWidth : '100%';
	$textHeight = $textHeight ? $textHeight : '200';


	if($mode==1){
		@include_once ($editor_Url.'/editor.html');
	}
	else{
		ECHO "<textarea style='width:".$textWidth.";height:".$textHeight."' name='".$contentForm."' wrap='physical' style='ime-mode: active' class='input'>".$content."</textarea>";
	}
}


?>