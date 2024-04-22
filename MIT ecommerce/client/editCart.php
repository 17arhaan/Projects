<?php

session_start();

$variantID = $_POST['varient'];
echo $variantID;
$event = $_POST['event'];

if($event == "Remove"){
    unset($_SESSION['cart'][$variantID-1]);
}

header('location:CartPage.php');



?>