<?php

$host="localhost";
$dbuser="root";
$dbpwd="";
$db="ecommerce";
//create connection
$adminconnection=mysqli_connect($host,$dbuser,$dbpwd,$db) ;

if(!$adminconnection){
	echo "error";
	die(mysqli_error($adminconnection));	
} 
?>