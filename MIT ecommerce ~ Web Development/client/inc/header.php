<?php
include('../Database/DatabaseConnection.php');
include('../functions/common_functions.php');
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ecommerce</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js" integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/fontawesome.min.css" integrity="sha384-jLKHWM3JRmfMU0A5x5AkjWkw/EYfGUAGagvnfryNV3F9VqM98XiIH7VBGVoxVSc7" crossorigin="anonymous">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@800&display=swap" rel="stylesheet">
</head>

<body class="d-flex flex-column min-vh-100">
  <div>
    <nav class="navbar navbar-dark navbar-expand bg-dark p-2">
      <div class="container-fluid px-3">
        <a href="index.php" class="navbar-brand nav-title"><span class="mb-0 h1">MIT Ecommerce</span></a>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto me-5">
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="index.php"><i class="fa-solid fa-house mx-1"></i>Home</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-table-list mx-1"></i>Categories
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">

                <?php
                get_categories();
                ?>
              </ul>
            </li>
            <li class="nav-item">
              <a href="cartPage.php" class="nav-item nav-link">
                  <i class="fas fa-cart-shopping"></i> Cart
                  <?php
                  if (isset($_SESSION['cart'])) {
                    $count = count($_SESSION['cart']);
                    echo "<span id ='cart_item_count' class='text-warning bg-light'>$count</span>";
                  } else {
                    echo "<span id ='cart_item_count' class='text-warning bg-light'>0</span>";
                  }
                  ?>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>