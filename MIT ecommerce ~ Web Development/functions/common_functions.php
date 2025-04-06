<?php
// including database connection file
include('../Database/DatabaseConnection.php');

//getting products and displaying products in home page
function get_products()
{
  global $adminconnection;

  // checking whether the category is set or not
  if (!isset($_GET['category'])) {
    echo "<div class='mt-5 container'>
      <div class='row g-4'>";
    $select_products = "Select * from product order by rand() limit 0,12";
    $result_products = mysqli_query($adminconnection, $select_products);
    while ($row_data = mysqli_fetch_assoc($result_products)) {
      $Product_ID = $row_data['Product_ID'];
      $SKU = $row_data['SKU'];
      $Title = $row_data['Title'];
      $Weight = $row_data['Weight'];
      $Category_ID = $row_data['Category_ID'];
      $Subcategory_ID = $row_data['Subcategory_ID'];
      $Image = $row_data['Image'];

      echo "<div class='col-lg-3 col-md-6'>
      <div class='card py-2 bg-dark text-light text-center'>
      <div class='card-title h3'>$Title</div>
    <img
      src='../Admin/Product_Images/$Image'
      class='card-img-top img-fluid'
    />
    <div class='card-body'>
      <!-- <div class='card-title h4 mb-3'>500 INR</div> -->
      <a
        href='../client/ProductPage.php?product_id=$Product_ID'
        class='btn btn-secondary'
        >View More</a
      >
    </div>
    </div>
    </div>";
    }
    echo "</div>
  </div>";
  }
}

// getting unique category
function get_unique_category()
{
  global $adminconnection;

  // checking whether the category is set or not
  if (isset($_GET['category'])) {
    echo "<div class='mt-5 container'>
      <div class='row g-4'>";
    $category_id = $_GET['category'];
    $select_category_name = "Select Category_Name from category where Category_ID = $category_id";
    $result_category_name = mysqli_query($adminconnection, $select_category_name);
    while ($row_data = mysqli_fetch_assoc($result_category_name)) {
      $category_name = $row_data['Category_Name'];
    }

    $select_products = "Select * from product where Category_ID = $category_id";
    $result_products = mysqli_query($adminconnection, $select_products);
    $row_count = mysqli_num_rows($result_products);
    echo "<div class='text-primary h5 fw-bold text-start py-1'>$category_name</div>";
    if ($row_count == 0) {
      echo "<h2 class='text-danger'>Stocks are unavailable.</h2>";
    } else {

      while ($row_data = mysqli_fetch_assoc($result_products)) {
        $Product_ID = $row_data['Product_ID'];
        $SKU = $row_data['SKU'];
        $Title = $row_data['Title'];
        $Weight = $row_data['Weight'];
        $Category_ID = $row_data['Category_ID'];
        $Subcategory_ID = $row_data['Subcategory_ID'];
        $Image = $row_data['Image'];

        echo "<div class='col-lg-3 col-md-6'>
        <div class='card py-2 bg-dark text-light text-center'>
        <div class='card-title h3'>$Title</div>
      <img
        src='../Admin/Product_Images/$Image'
        class='card-img-top img-fluid'
      />
      <div class='card-body'>
        
        <a
          href='../client/ProductPage.php?product_id=$Product_ID'
          class='btn btn-secondary'
          >View More</a
        >
      </div>
      </div>
      </div>";
      }
    }
    echo "</div>
    </div>";
  }
}
// getting categories from database and display categories in drop down menu in home page
function get_categories()
{
  global $adminconnection;
  $select_categories = "Select * from category";
  $result_categories = mysqli_query($adminconnection, $select_categories);
  while ($row_data = mysqli_fetch_assoc($result_categories)) {
    $category_name = $row_data['Category_Name'];
    $category_id = $row_data['Category_ID'];
    echo "<li><a href='ProductsPage.php?category=$category_id' class='dropdown-item'>$category_name</a></li>";
  }
}


function  view_product_details()
{
  global $adminconnection;

  // checking whether the category is set or not
  if (isset($_GET['product_id'])) {
    $product_id = $_GET['product_id'];
    $select_products = "Select * from product where Product_ID=$product_id";
    $result_products = mysqli_query($adminconnection, $select_products);
    while ($row_data = mysqli_fetch_assoc($result_products)) {
      $Product_ID = $row_data['Product_ID'];
      $SKU = $row_data['SKU'];
      $Title = $row_data['Title'];
      $Weight = $row_data['Weight'];
      $Category_ID = $row_data['Category_ID'];
      $Subcategory_ID = $row_data['Subcategory_ID'];
      $Image = $row_data['Image'];
      $Description = $row_data['Description'];

      echo " <div class='container mt-5'>
    <form action='CartPage.php' method='post'>
    <section class='py-5 mb-5 bg-light text-dark' id='info'>
      <div class='container'>
        <div class='row justify-content-around align-items-start'>
          <div class='col-d col-4'>
            <img
              src='../Admin/Product_Images/$Image'
              alt=''
              class='w-75'
            />
          </div>
          <div class='col-d col-6 text-start d-flex flex-column'>
            <h2 class='mb-4'>$Title</h2>
            <div class='lead'>Product Description:</div>
            <p class='mb-4'>
            $Description
            </p>
            <select id='VariantDetails' name='VariantDetails' class='form-select form-select-lg mb-3' aria-label='.form-select-lg example'>
            <option selected class='d-none'>Select Variant</option>";
    }
    $iteration = 0;
    // "Select * from product_variant, variant where product_variant.Variant_ID = variant.Variant_ID AND Product_ID=$product_id";
    $select_varients = "Select * from product_variant JOIN variant USING(Variant_ID) where Product_ID=$product_id";
    $result_varients = mysqli_query($adminconnection, $select_varients);
    $option_val = 0;
    while ($row_data = mysqli_fetch_assoc($result_varients)) {
      $Varient_ID = $row_data['Variant_ID'];
      $Attribute = $row_data['Attribute'];
      $Value = $row_data['Value'];
      if ($iteration == 0) {

        $varient_details = '';
        $option_val++;
        $varient_details = $varient_details . $Attribute . " : " . $Value . ' , ';
        $iteration += 1;
      } elseif ($Attribute != 'ZPrice') {
        $varient_details = $varient_details . $Attribute . " : " . $Value . ' , ';
        $iteration += 1;
      } elseif ($Attribute == 'ZPrice') {
        $varient_details = $varient_details . "Price" . " : " . $Value . ' ' . 'INR';
        echo "
              <option value=$Varient_ID>$varient_details</option>";


        $iteration = 0;
      }
    }
    echo " </select> 
   <select id='UnitSelection' name='UnitSelection' class='form-select form-select-lg mb-3' aria-label='.form-select-lg example'>
    <option selected class='d-none'>Select Units</option>
    <option>1</option>
    <option>2</option>
    <option>3</option>
  </select> 
  <div class='ms-auto me-4'>
  <button type='submit' class='btn btn-primary my-3' name='add'>Add to Cart <i class='fas fa-shopping-cart'></i></button>
    <!-- <a href='CartPage.php' class='btn btn-primary' name='add' >Add to Cart</a> -->
    <input type='hidden' name='product_id' value = '$product_id'>
  </div>
</div>
</div>
</div>
</section>
</form>
</div> ";
  }
}



function load_cart_items($varientID, $variant_count, $cart_total)
{
  global $adminconnection;
  $iteration = 0;
  $select_varients = "Select * from product, product_variant, variant where product.Product_ID = product_variant.Product_ID AND product_variant.Variant_ID = variant.Variant_ID AND product_variant.Variant_ID=$varientID[0]";
  $result_varients = mysqli_query($adminconnection, $select_varients);
  $option_val = 0;
  while ($row_data = mysqli_fetch_assoc($result_varients)) {
    
    $Title = $row_data['Title'];
    $Varient_ID = $row_data['Variant_ID'];
    $Attribute = $row_data['Attribute'];
    $Value = $row_data['Value'];
    if ($iteration == 0) {

      $varient_details = '';
      $option_val++;
      $varient_details = $varient_details . $Title . " " . $Attribute . " : " . $Value;
      $iteration += 1;
    } elseif ($Attribute != 'ZPrice') {
      $varient_details = $varient_details . ' , ' . $Attribute . " : " . $Value;
      $iteration += 1;
    } elseif ($Attribute == 'ZPrice') {
      $total = $Value * $varientID[1];
      $cart_total += $total;
      echo "
      <tr>
      
      <td>
      <form action='editCart.php' method = 'post'>
      <input type='hidden' name='varient' value='$variant_count'/>
      <input type='submit' name='event' value='Remove' class='btn btn-danger'>
      </form>
      </td>
      <th scope='row'>$variant_count</th>
      <td>$varient_details</td>
      <td>$Value</td>
      <td>$varientID[1]</td>
      <td>$total</td>
    </tr>";
    

      $iteration = 0;
      return $cart_total;
    }
  }
}


function load_checkout_items($varientID, $variant_count, $cart_total)
{
  global $adminconnection;
  $iteration = 0;
  $select_varients = "Select * from product, product_variant, variant where product.Product_ID = product_variant.Product_ID AND product_variant.Variant_ID = variant.Variant_ID AND product_variant.Variant_ID=$varientID[0]";
  $result_varients = mysqli_query($adminconnection, $select_varients);
  $option_val = 0;
  while ($row_data = mysqli_fetch_assoc($result_varients)) {
    
    $Title = $row_data['Title'];
    $Varient_ID = $row_data['Variant_ID'];
    $Attribute = $row_data['Attribute'];
    $Value = $row_data['Value'];
    if ($iteration == 0) {

      $varient_details = '';
      $option_val++;
      $varient_details = $varient_details . $Title . " " . $Attribute . " : " . $Value;
      $iteration += 1;
    } elseif ($Attribute != 'ZPrice') {
      $varient_details = $varient_details . ' , ' . $Attribute . " : " . $Value;
      $iteration += 1;
    } elseif ($Attribute == 'ZPrice') {
      $total = $Value * $varientID[1];
      $cart_total += $total;

      echo "
      <tr>
      
      
      <th scope='row'>$variant_count</th>
      <td>$varient_details</td>
      <td>$Value</td>
      <td>$varientID[1]</td>
      <td>$total</td>

    

    
    </tr>";

    $iteration = 0;
    $items = 
      array($Varient_ID,$varientID[1],$total)
    ;
    $_SESSION['cart_items'][$variant_count-1] = $items;
    return $cart_total;
    }
    
    
    
    
  }
}