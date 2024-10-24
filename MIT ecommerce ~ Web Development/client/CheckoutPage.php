<?php 
session_start();
include('../client/inc/header.php');
if(isset($_SESSION["login_user_city"])){
  $select_delivery_city= "Select * from delivery where City='{$_SESSION["login_user_city"]}'";
  $result_delivery_city = mysqli_query($adminconnection, $select_delivery_city);
  $rowcount=mysqli_num_rows($result_delivery_city);
  if($rowcount==0){
header('Location: LoginPage.php');
  }
}
?>

<div>
    <div class="container mt-5">
      <span class="h1 mb-3">
        Checkout
      </span>
      <div class="createAcc d-flex gap-5 justify-content-around my-5">
        <div class="card bg-light pt-2 pb-3 px-4 w-50 text-start">
          <table class="table caption-top mb-4">
            <caption class="mb-2 fs-4">
              Order Summary
            </caption>
            <thead>
              <tr>
                <th scope="col">Product Number</th>
                <th scope="col">Item</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Units</th>
                <th scope="col">Sub total</th>
              </tr>
            </thead>
            <tbody>
            <?php
            if(!isset($_POST['PlaceOrder'])){
        if(!empty($_SESSION['cart'])){
          $varient_id = array_column($_SESSION['cart'],'VariantDetails');
          $variant_count;
         $variant_count=0;
        if(!empty($varient_id)){
          $cart_total = 0;
          foreach($varient_id as $id){
            $variant_count++;
            $cart_total = load_checkout_items($id,$variant_count,$cart_total);
          }
          
          
        }
        
        $_SESSION["cart_total"] = $cart_total;
        
      }
    }
    else{
      $_SESSION["PlaceOrder"] = $_POST['PlaceOrder'];
    }
        ?>
            </tbody>
          </table>
          <div class="row text-secondary lead justify-content-end">
            <div class="col-2 text-end ">Total:</div>

            <?php
            if(!isset($_POST['PlaceOrder'])){
      if(!empty($_SESSION['cart'])){
        echo "<div class='col-3'>$cart_total INR</div> ";
      }
      else{
        echo "<div class='col-3'>0</div>  ";
      }
    }
       ?>
          </div>
          <div class="row text-secondary lead justify-content-end">
            <div class="col-6 text-end">Estimated Delivery Time:</div>
            <?php
            if(!isset($_POST['PlaceOrder'])){
              $select_delivery_city= "Select * from delivery where City='".$_SESSION['login_user_city']."'";
              $result_delivery_city = mysqli_query($adminconnection, $select_delivery_city);
              
              while ($row_data = mysqli_fetch_assoc($result_delivery_city)) {
                $days = $row_data['Days'];
                
              }

              $arrayLength = count($_SESSION['cart_items']);
              $done = True;
              for ($i = 0; $i <=$arrayLength-1; $i++) {
              $result = $adminconnection -> query("SELECT Quantity FROM inventory WHERE Variant_ID = '{$_SESSION['cart_items'][$i][0]}'");
              while($row = $result->fetch_assoc()) {
                $remainder = $row['Quantity']-$_SESSION['cart_items'][$i][1];
                
                if($remainder<0 and $done){
                  $days = $days+3;
                  $done = False;
                }

              }
              }
              }
            
            ?>
            <div class="col-3"><?php 
            if(!isset($_POST['PlaceOrder'])){
            echo $days; }
            ?> Days</div>
          </div>
          <form action = "" method = 'post'>
          <div class="row mt-4 mb-2">
            <div class="col align-self-center">Select Payment Method:</div>
            <div class="col">
            <select name="Payment_Method" class="form-select">
        <option value="" disabled selected>Payment Method</option>
              <!-- <select class="form-select" aria-label="Default select example" name="Payment_Method" >
                <option selected class="d-none">Payment Method</option> -->
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col align-self-center">Select Delivery Method:</div>
            <div class="col">
            <select name="Delivery_Method" class="form-select">
        <option value="" disabled selected>Delivery Method</option>
              <!-- <select class="form-select" aria-label="Default select example" name="Delivery_Method" >
                <option selected class="d-none">Delivery Method</option> -->
                <option value="Store_Pickup">Store_Pickup</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          </div>

          <div class="ms-auto py-3">
            
          <input type='submit' name='PlaceOrder' value='Place Order' class='btn btn-primary'>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

      </div>
    </div>
  </div>
</body>
</html>
<?php
if(isset($_POST['PlaceOrder'])){
  if(!empty($_POST['Payment_Method']) and !empty($_POST['Payment_Method'])){
  $Payment_Method = $_POST['Payment_Method'];
  $Delivery_Method = $_POST['Delivery_Method'];
}
if(!isset($_SESSION['user_id'])){
  $_SESSION['user_id'] = null;
}

if(!isset($_SESSION['guest_id'])){
  $_SESSION['guest_id'] = null;
}
 global $adminconnection;
  $select_cart_items = "Select * from cart";
  $result_varients = mysqli_query($adminconnection, $select_cart_items);
  while ($row_data = mysqli_fetch_assoc($result_varients)) {
    $cart_id = $row_data['Cart_ID'];
  }
  $cart_last_id = $cart_id+1;
  




$nullguest= $_SESSION['guest_id'];
$nulluser = $_SESSION['user_id'];
try {
  global $adminconnection;
  mysqli_begin_transaction($adminconnection);
  
  if($nullguest == NULL){
    $adminconnection -> query("INSERT INTO cart (User_ID,Total_Value)
VALUES ('{$_SESSION['user_id']}','{$_SESSION['cart_total']}')");
  }
  else if($nulluser == null){
    $adminconnection -> query("INSERT INTO cart (Guest_ID,Total_Value)
VALUES ('{$_SESSION['guest_id']}','{$_SESSION['cart_total']}')");
  }
  
  $arrayLength = count($_SESSION['cart_items']);
  $array = $_SESSION['cart_items'];
  
for ($i = 0; $i <=$arrayLength-1; $i++) {
  $VariantID = $array[$i][0];
 
  $Quantity = $array[$i][1];
  $Item_Total_Price = $array[$i][2];
  
  $adminconnection->query('SET foreign_key_checks = 0');
  $adminconnection -> query("INSERT INTO cart_item (Cart_ID,Variant_ID, Quantity, Item_Total_Price)
VALUES ($cart_last_id,$VariantID,$Quantity,$Item_Total_Price)");
$adminconnection->query('SET foreign_key_checks = 1');
$result = $adminconnection -> query("SELECT Quantity FROM inventory WHERE Variant_ID = '{$_SESSION['cart_items'][$i][0]}'");


while($row = $result->fetch_assoc()) {
  $remainder = $row['Quantity']-$_SESSION['cart_items'][$i][1];
}
$adminconnection -> query("UPDATE inventory SET Quantity = $remainder  WHERE Variant_ID = '{$_SESSION['cart_items'][$i][0]}'");
}


$date = date("Y-m-d");
$adminconnection->query('SET foreign_key_checks = 0');
if($nullguest == null){
  $adminconnection -> query("INSERT INTO `order` (Cart_ID, Date_Of_Order, User_ID, Payment_type, Delivery_type)
VALUES ($cart_last_id,'$date','{$_SESSION['user_id']}','$Payment_Method','$Delivery_Method')");

}
else if($nulluser == null){
  $adminconnection -> query("INSERT INTO `order` (Cart_ID, Date_Of_Order, Guest_ID, Payment_type, Delivery_type)
VALUES ($cart_last_id+$i,'$date','{$_SESSION['guest_id']}','$Payment_Method','$Delivery_Method')");
}
$adminconnection->query('SET foreign_key_checks = 1');
 
  mysqli_commit($adminconnection);
  unset($_SESSION['cart']);
  echo "<script>alert('Order successful.')</script>";
  // header('Location: index.php');
  } catch (Exception $e) {
    echo $e;
  
  mysqli_rollback($adminconnection);
  }

// Insert some values
}
?> 
<?php 
  include('../client/inc/footer.php');
?>


