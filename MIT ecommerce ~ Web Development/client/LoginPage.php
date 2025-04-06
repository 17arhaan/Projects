<?php 
session_start();
include('../client/inc/header.php');
?>
<?php

if(isset($_POST['user_login'])){
  $user_username = $user_password = '';
  $error_username = $error_password = $error_credentials = '';

  if(!empty($_POST['user_username'])){
    $user_username = filter_input(INPUT_POST,'user_username',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $error_username = 'Please enter your User Name!';
  }

  if(!empty($_POST['user_password'])){
    $user_password = filter_input(INPUT_POST,'user_password',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $error_password = 'Please enter your Password!';
  }

  $sql =$adminconnection->prepare("Select *,count(*) from user where User_name = ?") ;
  $sql->bind_param("s",$user_username);
  $sql->execute();
  $result = $sql->get_result();
  $row_data  = $result->fetch_assoc();
  
  if(!empty($user_username) && !empty($user_password)){
    if($row_data['count(*)']>0){
      if(password_verify($user_password, $row_data['Password'])){
        $error_credentials = '';
        echo "<script>alert('Login successful.')</script>";
        $_SESSION["login_user_city"] = $row_data['City'];
        $_SESSION['user_id'] = $row_data['User_ID'];
        header('Location: checkoutPage.php');
        
      }else{
        $error_credentials = 'Invalid Credentials!'; 
      }
    }else{
        $error_credentials = 'Invalid Credentials!';
    }
  } 
}

if(isset($_POST['guest_login'])){
  $required_fields_set = true;
  $guest_contact = $guest_address = $guest_city = '';
  $error_contact = $error_address = $error_city = '';

  if(!empty($_POST['guest_contact'])){
    $guest_contact = filter_input(INPUT_POST,'guest_contact',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $error_contact = 'Telephone No. is required!';
    $required_fields_set = false;
  }

  if(!empty($_POST['guest_address'])){
    $guest_address = filter_input(INPUT_POST,'guest_address',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $error_address = 'Street Address is required!';
    $required_fields_set = false;
  }

  if(!empty($_POST['guest_city'])){
    $guest_city = filter_input(INPUT_POST,'guest_city',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $error_city = 'City is required!';
    $required_fields_set = false;
  }

  
  //insert query
  if($required_fields_set){

    $sql =$adminconnection->prepare("insert into guest (Telephone_No, Street_Address, City) values
    (?,?,?) ");
    $sql->bind_param("sss",$guest_contact, $guest_address, $guest_city);
    $sql_execute = $sql->execute();


    if(!$sql_execute){
      die(mysqli_error($adminconnection));	
    }else{
      $_SESSION["login_user_city"] = $guest_city;
      $select_guest_details = "Select * from guest where Telephone_No=$guest_contact";
    $result_guest_details = mysqli_query($adminconnection, $select_guest_details);
    while ($row_data = mysqli_fetch_assoc($result_guest_details)) {
      $_SESSION['guest_id'] = $row_data['Guest_ID'];
    }
      
      header('Location: checkoutPage.php');
    }
  }
}

function debug_to_console($data) {
  $output = $data;
  if (is_array($output))
      $output = implode(',', $output);

  echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}
?>

<body>
  <div class="container">
    <div class="row align-items-start g-5 align-items-start">
  
      <div class="col-md-6">
        <div class=" login my-5">
          <div class="card py-3 px-3">
            <h2 class="text-primary text-start">User Log In</h2>
            <form action="" method="post" class="px-4 py-3 text-start">
              <div class="mb-3">
                <label for="user_username" class="form-label"
                  >User Name</label>
                <input
                  type="text"
                  class="form-control <?php echo $error_username ? 'is-invalid':null; ?>"
                  id="exampleDropdownFormEmail1"
                  placeholder="Username"
                  name="user_username"
                />
                <div class="invalid-feedback">
                  <?php echo $error_username; ?>
                </div>
              </div>
              <div class="mb-3">
                <label for="user_password" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control <?php echo $error_password ? 'is-invalid':null; ?>"
                  id="exampleDropdownFormPassword1"
                  placeholder="Password"
                  name="user_password"
                />
                <div class="invalid-feedback">
                  <?php echo $error_password; ?>
                </div>
              </div>
              <div class="mb-3"></div>
              <input type = "submit" value="Sign in" class="btn  <?php echo $error_credentials ? 'btn-danger is-invalid':'btn-primary'; ?>" name="user_login">
              <div class="invalid-feedback">
                  <?php echo $error_credentials; ?>
                </div>
            </form>
            <p class="dropdown-item"
              >Don't have an account ? <a href="CreateAcc.php">Create Account</a></p
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class=" login my-5">
          <div class="card py-3 px-3">
            <h2 class="text-primary text-start">Guest Log In</h2>
            <form action="" method="post" class="px-4 py-3 text-start">
              <div class="mb-3">
                <label for="exampleDropdownFormEmail1" class="form-label"
                  >Telephone No.</label
                >
                <input
                  type="text"
                  class="form-control <?php echo $error_contact ? 'is-invalid':null; ?>"
                  id="exampleDropdownFormEmail1"
                  placeholder="Telephone"
                  name="guest_contact"
                />
                <div class="invalid-feedback">
                  <?php echo $error_contact; ?>
                </div>
              </div>
              <div class="mb-3">
                <label for="exampleDropdownFormEmail1" class="form-label"
                  >Street Address</label
                >
                <input
                  type="text"
                  class="form-control <?php echo $error_address ? 'is-invalid':null; ?>"
                  id="exampleDropdownFormEmail1"
                  placeholder="Street Address"
                  name="guest_address"
                />
                <div class="invalid-feedback">
                  <?php echo $error_address; ?>
                </div>
              </div>

              <div class="mb-3">
                <label for="exampleDropdownFormEmail1" class="form-label">City</label>
                <input
                  type="text"
                  class="form-control <?php echo $error_city ? 'is-invalid':null; ?>"
                  id="exampleDropdownFormEmail1"
                  placeholder="City"
                  name="guest_city"
                />
                <div class="invalid-feedback">
                  <?php echo $error_city; ?>
                </div>
              </div>

              <div class="mb-3"></div>
              <input type = "submit" value="Sign in" class="btn btn-primary" name="guest_login">
            </form>
  
          </div>
        </div>
      </div>  
    </div>
    </div>
<?php 
  include('../client/inc/footer.php');
?>

