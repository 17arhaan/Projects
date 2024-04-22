<?php
session_start();
include('../client/inc/header.php');
if(isset($_POST['add'])){
   //print_r($_POST['VariantDetails']);
  if(isset($_SESSION['cart'])){
    $item_array_id = array_column($_SESSION['cart'],"VariantDetails");
    // print_r($_SESSION['cart']);
    if(in_array($_POST['VariantDetails'],$item_array_id)){
      echo "<script>alert('Product is already added in the cart')</script>";
    }
    else{
      $count = count($_SESSION['cart']);
      $item_array = array(
        'VariantDetails' => [$_POST['VariantDetails'],$_POST['UnitSelection']]
      );
      $_SESSION['cart'][$count] = $item_array;
    }
  }
  else{
    $item_array = array(
        'VariantDetails' => [$_POST['VariantDetails'],$_POST['UnitSelection']]
    );

    $_SESSION['cart'][0] = $item_array;
    // print_r($_SESSION['cart']);
  }
}

?>
<div class="container mt-5">
  <div>

    <table class="table caption-top mb-5">
      <caption class="h1 mb-5">
        Cart
      </caption>
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Product Number</th>
          <th scope="col">Item</th>
          <th scope="col">Unit Price(LKR)</th>
          <th scope="col">Units</th>
          <th scope="col">Subtotal(LKR)</th>
        </tr>
      </thead>
      <tbody>
        <?php
        
        if(!empty($_SESSION['cart']) or !isset($_SESSION["PlaceOrder"])){
          $varient_id = array_column($_SESSION['cart'],'VariantDetails');
          $variant_count;
         $variant_count=0;
        if(!empty($varient_id)){
          $cart_total = 0;
          foreach($varient_id as $id){
            
            $variant_count++;
            $cart_total = load_cart_items($id,$variant_count,$cart_total);
          }
          
        }
        }
        
      
        
        ?>
      </tbody>
    </table>
  </div>
  <div class="d-flex me-5 align-items-end flex-column bd-highlight mb-3">
    <div class="py-3 fw-bold lead">
      <span class="bd-highlight ">Total: </span>
      <?php
      
      if(!empty($_SESSION['cart']) or !isset($_SESSION["PlaceOrder"])){
        echo "<span class='bd-highlight pb-3'>$cart_total</span> ";
      }
      else{
        echo "<span class='bd-highlight pb-3'>0</span> ";
      }
       ?>
      <span class="bd-highlight pb-3 "> LKR</span>
    </div>
    <div class="d-flex flex-row w-100 justify-content-between">
      <div class="align-self-center ms-5">
        <a href="index.php#productSection" class="lead text-decoration-none fw-light">Continue Shopping</a>
      </div>
      <div>
        <a href='LoginPage.php' class='btn btn-primary'>Checkout</a>
      </div>
    </div>

  </div>
</div>
</body>

</html>
<?php
include('../client/inc/footer.php');
?>