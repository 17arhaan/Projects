<?php 
session_start();
include('../client/inc/header.php');
?>
<?php

if(isset($_POST['user_register'])){
  $required_fields_set = true;
  $user_username = $user_password = $user_confirm_password = $user_firstname = $user_lastname =$user_contact = $user_address = $user_city = '';
  $error_username = $error_password = $error_confirm_password = $error_firstname = $error_lastname =$error_contact = $error_address = $error_city = '';

  if(!empty($_POST['user_username'])){
    $user_username = filter_input(INPUT_POST,'user_username',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_username = 'User Name is required!';
  }

  if(!empty($_POST['user_password'])){
    $user_password = filter_input(INPUT_POST,'user_password',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_password = 'Password is required!';
  }

  if(!empty($_POST['user_confirm_password'])){
    $user_confirm_password = filter_input(INPUT_POST,'user_confirm_password',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_confirm_password = 'Confirm Password is required!';
  }

  if(!empty($_POST['user_firstname'])){
    $user_firstname = filter_input(INPUT_POST,'user_firstname',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_firstname = 'First Name is required!';
  }

  if(!empty($_POST['user_lastname'])){
    $user_lastname = filter_input(INPUT_POST,'user_lastname',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_lastname = 'Last Name is required!';
  }

  if(!empty($_POST['user_contact'])){
    $user_contact = filter_input(INPUT_POST,'user_contact',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_contact = 'Telephone No. is required!';
  }

  if(!empty($_POST['user_address'])){
    $user_address = filter_input(INPUT_POST,'user_address',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_address = 'Street Address is required!';
  }

  if(!empty($_POST['user_city'])){
    $user_city = filter_input(INPUT_POST,'user_city',FILTER_SANITIZE_FULL_SPECIAL_CHARS);
  }else{
    $required_fields_set = false;
    $error_city = 'City is required!';
  }
    
    $hash_password = password_hash($user_password, PASSWORD_DEFAULT);
        
    //select query
    
    $sql =$adminconnection->prepare("Select count(*) from user where User_name = ?") ;
    $sql->bind_param("s",$user_username);
    $sql->execute();
    $result = $sql->get_result();
    $row_count = $result->fetch_assoc()['count(*)'];

    if($row_count==0 && ($user_password === $user_confirm_password)){
      if($required_fields_set){
        //insert query

        $sql =$adminconnection->prepare("insert into user (User_Name, Password, First_Name, Last_Name, Telephone_No, Street_Address,City) values (?,?,?,?,?,?,?)") ;
        $sql->bind_param("sssssss",$user_username, $hash_password, $user_firstname, $user_lastname, $user_contact,$user_address, $user_city);
        $sql_execute = $sql->execute();

        if($sql_execute){
          echo "<script>alert('Account created successfully.')</script>";
          echo"<script>location.href='LoginPage.php'</script>";

        }else{
          die(mysqli_error($adminconnection));	
        } 
    }
  }
}

?>

<body>


  <div class="createAcc d-flex justify-content-around my-5">
    <div class="card py-3 px-3 w-50">
      <h2 class="text-primary">Create Account</h2>

      <form action="" method="post" class="px-4 py-3 text-start">
        <div class="mb-3">
          <label for="user_username" class="form-label"
            >User Name</label
          >
          <input
            type="text"
            class="form-control <?php 
              if(!empty($error_username)||$row_count>0){
                echo 'is-invalid';
              }
              ?>"
            id="exampleDropdownFormEmail1"
            placeholder="Username"
            name="user_username"
          />
          <div class="invalid-feedback">
            <?php
              if(!empty($error_username)){
                echo $error_username;
              } else{
                echo 'This User Name is already taken!';
              } 
            ?>
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

        <div class="mb-3">
          <label for="user_confirm_password" class="form-label"
            >Confirm Password</label
          >
          <input
            type="password"
            class="form-control <?php 
              if(!empty($error_confirm_password)||($user_password!==$user_confirm_password)){
                echo 'is-invalid';
              }
              ?>"            
            id="exampleDropdownFormPassword1"
            placeholder="Password"
            name="user_confirm_password"
          />
          <div class="invalid-feedback">
          <?php
              if(!empty($error_confirm_password)){
                echo $error_confirm_password;
              } else{
                echo 'Confirm Password does not match!';
              } 
            ?>
          </div>
        </div>

        <div class="mb-3">
          <label for="user_firstname" class="form-label"
            >First Name</label
          >
          <input
            type="text"
            class="form-control <?php echo $error_firstname ? 'is-invalid':null; ?>"            
            id="exampleDropdownFormEmail1"
            placeholder="First Name"
            name="user_firstname"
          />
          <div class="invalid-feedback">
            <?php echo $error_firstname; ?>
          </div>
        </div>

        <div class="mb-3">
          <label for="user_lastname" class="form-label"
            >Last Name</label
          >
          <input
            type="text"
            class="form-control <?php echo $error_lastname ? 'is-invalid':null; ?>"            
            id="exampleDropdownFormEmail1"
            placeholder="Last Name"
            name="user_lastname"
          />
          <div class="invalid-feedback">
            <?php echo $error_lastname; ?>
          </div>
        </div>
 
        <div class="mb-3">
          <label for="user_contact" class="form-label"
            >Telephone No.</label
          >
          <input
            type="text"
            class="form-control <?php echo $error_contact ? 'is-invalid':null; ?>"            
            id="exampleDropdownFormEmail1"
            placeholder="Telephone"
            name="user_contact"
          />
          <div class="invalid-feedback">
            <?php echo $error_contact; ?>
          </div>
        </div>

        <div class="mb-3">
          <label for="user_address" class="form-label"
            >Street Address</label
          >
          <input
            type="text"
            class="form-control <?php echo $error_address ? 'is-invalid':null; ?>"            
            id="exampleDropdownFormEmail1"
            placeholder="Street Address"
            name="user_address"
          />
          <div class="invalid-feedback">
            <?php echo $error_address; ?>
          </div>
        </div>

        <div class="mb-3">
          <label for="user_city" class="form-label">City</label>
          <input
            type="text"
            class="form-control <?php echo $error_city ? 'is-invalid':null; ?>"            
            id="exampleDropdownFormEmail1"
            placeholder="City"
            name="user_city"
          />
          <div class="invalid-feedback">
            <?php echo $error_city; ?>
          </div>
        </div>


        <input type = "submit" value="Create Account" class="btn btn-primary" name="user_register">
        
      </form>
      <p class="dropdown-item"
      >Already have an account ? <a href="LoginPage.php">Log in</a></p
    >
    </div>
  </div>
<?php 
  include('../client/inc/footer.php');
?>