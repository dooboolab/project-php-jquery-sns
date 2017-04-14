<?php

if (isset($_GET['filename'])) $filename = $_GET['filename'];
if (isset($_GET['filename'])) $filepath = $_GET['filepath'];


Header("Content-Type:application/octet-stream");
Header("Content-Disposition:attachment;; filename=$filename");
Header("Content-Transfer-Encoding:binary");
Header("Content-Length:".(string)(filesize($filepath)));
Header("Cache-Control:Cache,must-revalidate");
Header("Pragma:No-Cache");
Header("Expires:0");
$fp=fopen($filepath,"rb");
while(!feof($fp))
{
echo fread($fp,1000*1024);
flush();
}
fclose($fp);
?>