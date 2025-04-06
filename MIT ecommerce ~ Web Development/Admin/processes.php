<?php include('../Database/DatabaseConnection.php'); ?>
<?php

// year for dropdowns
if (isset($_GET['minYear'])) {
    $sql = 'SELECT min(Date_Of_Order) FROM `order`;';
    $result = mysqli_query($adminconnection, $sql);
    $min_date = strtotime(mysqli_fetch_all($result, MYSQLI_ASSOC)[0]['min(Date_Of_Order)']);
    $min_year = date('Y', $min_date);
    echo $min_year;
}

// products for dropdowns
if (isset($_GET['products'])) {
    $sql = 'SELECT Product_ID,Title FROM `product`;';
    $result = mysqli_query($adminconnection, $sql);
    $products = mysqli_fetch_all($result, MYSQLI_ASSOC);
    echo json_encode($products);
}

// customer order report
if (isset($_GET['customerOrderReport'])) {
    $sql = 'SELECT Order_ID,Date_Of_Order,First_Name,Last_Name,Total_Value FROM `order`,`user`,`cart` WHERE `order`.User_ID = `user`.User_ID AND `order`.Cart_ID = `cart`.Cart_ID AND `order`.Guest_ID IS NULL ORDER BY Date_of_Order;';
    $result = mysqli_query($adminconnection, $sql);
    $customer_order_report = mysqli_fetch_all($result, MYSQLI_ASSOC);
    echo json_encode($customer_order_report);
}

// product with most number of sales
if (isset($_GET['mostSalesYear']) && isset($_GET['mostSalesMonth'])) {
    $sql = $adminconnection->prepare("select Title from product where Product_ID in(
        select Product_ID from product_variant as pv inner join(
        select Variant_ID,sum(Quantity) as q from `cart_item` where Cart_ID in(
        select Cart_ID from `order` where year(Date_Of_Order) = ? and month(Date_Of_Order) = ?
        ) group by Variant_ID order by q desc limit 1)
        as v on pv.Variant_ID = v.Variant_ID);");
    $sql->bind_param("ss", $_GET['mostSalesYear'], $_GET['mostSalesMonth']);
    $sql->execute();
    $result = $sql->get_result();
    $product  = $result->fetch_assoc();
    echo json_encode($product);
}

// product category with most orders
if (isset($_GET['mostOrdersYear']) && isset($_GET['mostOrdersMonth'])) {
    $sql = $adminconnection->prepare("select Category_Name from `category` as c inner join(
        select Category_ID,sum(Quantity) as q from `cart_item`,`product_variant`,`product` 
        where `cart_item`.Variant_ID = `product_variant`.Variant_ID
        and `product_variant`.Product_ID = `product`.Product_ID 
        and Cart_ID in(
        select Cart_ID from `order`
            where year(Date_Of_Order) = ? and month(Date_Of_Order) = ?
        ) group by Category_ID order by q desc limit 1)
        as cid on cid.Category_ID = c.Category_ID;");
    $sql->bind_param("ss", $_GET['mostOrdersYear'], $_GET['mostOrdersMonth']);
    $sql->execute();
    $result = $sql->get_result();
    $category  = $result->fetch_assoc();
    echo json_encode($category);
}
/*
// Time period with most interest to a product
if (isset($_GET['mostInterestProduct'])) {
    $sql = $adminconnection->prepare("select count(Date_Of_Order) as count,
  year(Date_Of_Order) as year,
  month(Date_Of_Order) as month,
  extract(year_month from Date_Of_Order) as period
  from `order` where Cart_ID in(
    select Cart_ID from `cart_item` where Variant_ID in(
      select Variant_ID from `product_variant` where Product_ID = ?)
  ) group by period order by count desc limit 1;");
    $sql->bind_param("s", $_GET['mostInterestProduct']);
    $sql->execute();
    $result = $sql->get_result();
    $time  = $result->fetch_assoc();
    echo json_encode($time);
}

// quarterly sales report
if (isset($_GET['salesReportYear']) && isset($_GET['salesReportQuarter'])) {
    $sql = $adminconnection->prepare("select Title,sum(Quantity) as Quantity,sum(Item_Total_Price) as Total
  from `order`,`cart_item`,`product_variant`,`product` 
  where `order`.Cart_ID = `cart_item`.Cart_ID
  and `cart_item`.Variant_ID = `product_variant`.Variant_ID
  and `product_variant`.Product_ID = `product`.Product_ID
  and year(Date_Of_Order) = ? and ceil(month(Date_Of_Order)/3) = ?
  group by `product`.Product_ID");
    $sql->bind_param("ss", $_GET['salesReportYear'], $_GET['salesReportQuarter']);
    $sql->execute();
    $result = $sql->get_result();
    
    $sales_report  = array();
    while ($row = $result->fetch_assoc()) {
      $sales_report[] = $row;
    }

    echo json_encode($sales_report);
}
*/