  <?php

  session_start();


  require_once ('classes/all.php');
  
  date_default_timezone_set("Africa/Lagos");
  $id = $_SESSION['id'];
  $username = $_SESSION['username'];
  $company = $_SESSION['CompanyName'];
  $branch = $_SESSION['Bname'];
  $branchCode = $_SESSION['Bcode'];
  $createStation = new All($connect);

  if(!isset($_SESSION['username'])){
    header('Location: portal.php');
  }

  $date = date('Y-m-d', strtotime('now')); 

  $opening = "SELECT BtankA, BtankB, BtankUse FROM gasStations WHERE Bcode = '$branchCode'";
  $openingstock = mysqli_query($connect, $opening);

      if(mysqli_num_rows($openingstock) > 0){

          while($row = mysqli_fetch_array($openingstock)){
              $tank = $row["BtankUse"];
              $tankA = $row["BtankA"];
              $tankB = $row["BtankB"];
          
          }

      }
      if($tank == 'Tank A'){
        $tank = $tank;
          $remaining = $tankA;

        $fish = "SELECT * FROM finalsales WHERE branch = '$branchCode'";
        $star = mysqli_query($connect, $fish);
        if(mysqli_num_rows($star) < 0){
          $openTank = $tankA;
        }else{
          $openTank = $remaining;
        }
          
      }elseif($tank == 'Tank B'){
        $tank = $tank;
        $remaining = $tankB;

        $fish = "SELECT * FROM finalsales WHERE branch = '$branchCode'";
        $star = mysqli_query($connect, $fish);
        if(mysqli_num_rows($star) < 0){
          $openTank = $tankB;
        }else{
          $openTank = $remaining;
        }
      }

      //show stats on salespoint
      $stats = "SELECT SUM(kg) FROM finalsales WHERE branch = '$branchCode' AND tankUse = '$tank' AND category != 'Switch' ";
      $gostats = mysqli_query($connect, $stats);
      if($gostats){
        while($st = mysqli_fetch_array($gostats)){
          $allKgg = $st['SUM(kg)'];
        }
      }


  if(isset($_POST['salesCrb'])){

      $crb = $_POST['salesCrb'];
      $sql = "SELECT * FROM salespoint WHERE branch = '$branchCode' AND crbnumber = '$crb' ";
      $go = mysqli_query($connect, $sql);

      if(mysqli_num_rows($go) > 0){

          while($row = mysqli_fetch_array($go)){

              $crb = $row['crbnumber'];
              $phone = $row['phone'];
              $name = $row['customer'];
              $category = $row['category'];
              $kg = $row['kg'];
              $date = $row['datee'];
              $time = $row['timee'];
              $branch = $row['branch'];
              $quantity = $row['quantity'];
              $amount = $row['amount'];

          }

      }

      $sql2 = "SELECT kg, quantity, amount FROM salespoint WHERE branch = '$branchCode' AND crbnumber = '$crb' ";
      $go2 = mysqli_query($connect, $sql2);

      $train = "SELECT SUM(kg), SUM(quantity), SUM(amount) FROM salespoint WHERE crbnumber = $crb AND branch = '$branchCode'";
          $su = mysqli_query($connect, $train);

      $cus = "SELECT * FROM customers WHERE Cphone = '$phone' ";
      $cusgo = mysqli_query($connect, $cus);


      if(mysqli_num_rows($cusgo) > 0){
          while($ga = mysqli_fetch_array($cusgo)){
              $change = $ga['Cchange'];
          }
      }

  }

  if(isset($_POST['com'])){
  
      $branchCode = $_SESSION['Bcode'];
      //get values
      $phonee = $_POST['cphone'];
      $crb = $_POST['crb'];
      $reciept = $crb;
      $payment = $_POST['payment'];
      $cash = $_POST['cash'];
      $narrate = $_POST['narrative'];
      $comChange = $_POST['change'];

        //get current tank
        $stock = "SELECT company.CompanyName, gasStations.Bname, gasStations.Bcode, gasStations.BtankUse FROM gasStations, company WHERE company.CompanyCode = gasStations.company AND gasStations.Bcode = '$branchCode'";
        $lastock = mysqli_query($connect, $stock);

        if(mysqli_num_rows($lastock) > 0){
          while($row = mysqli_fetch_array($lastock)){
              $tank = $row['BtankUse'];  
          }
            if($tank == 'Tank A'){
              $tank = 'Tank A';
          }elseif($tank == 'Tank B'){
              $tank = 'Tank B';
            
          }
    }

      //get details from sales point
      $sales = "SELECT * FROM salespoint WHERE crbnumber = '$crb' AND branch = '$branchCode' ";
      $runsales = mysqli_query($connect, $sales);


      $zz = "SELECT * FROM customers WHERE Cphone = '$phonee' ";
                $zzgo = mysqli_query($connect, $zz);
                while($rrr = mysqli_fetch_array($zzgo)){
                  $zzChange = $rrr['Cchange'];
                }

                $trr = "SELECT SUM(amount) FROM salespoint WHERE crbnumber = '$crb' AND branch = '$branchCode' ";
                $suu = mysqli_query($connect, $trr);
        
                if($suu){
        
                  while($gagaa = mysqli_fetch_array($suu)){
        
                      $famount = $gagaa['SUM(amount)'];
                    
                  }
                }

      if(mysqli_num_rows($runsales) > 0){
          while($run = mysqli_fetch_array($runsales)){
              $date = $run['datee'];
              $time = $run['timee'];
              $customer = $run['customer'];
              $phone = $run['phone'];
              $kg = $run['kg'];
              $quantity = $run['quantity'];
              $amount = $run['amount'];
              $kgValue = $kg * $quantity;
              $category = $run['category'];



              $cus = "SELECT * FROM customers WHERE Cphone = '$phone' ";
              $cusgo = mysqli_query($connect, $cus);


              if($narrate == "Failed - ATM Declined"){
                $status = "Failed - ATM Declined";
              }elseif($narrate == "Failed - Transfer Failed"){
                $status = "Failed - Transfer Failed";
              }elseif($narrate == "Failed - Cylinder Error"){
                $status = "Failed - Cylinder Error";
              }elseif($narrate == "Successful - Keep change"){
      
                $status = "Successful - Owing change";
      
                $finalamount = $famount;
                $prevchange = $zzChange;
                $ccChange = $zzChange;

                $ch = "UPDATE customers SET Cchange = $zzChange + $comChange WHERE Cphone = '$phone' ";
                $doch = mysqli_query($connect, $ch);
                        
      
              }else{
                $status = "Successful - Change Debited";
                $prevchange = $zzChange - $zzChange;
                $finalamount = $famount - $zzChange;
                $changeDD = $zzChange;
                $ch = "UPDATE customers SET Cchange = $zzChange - $zzChange WHERE Cphone = '$phone' ";
                $doch = mysqli_query($connect, $ch);
    
              }
                        //populate completeSales table
                $make = "INSERT INTO completeSales (branch, reciept, datee, timee, customer, phone, payment, cash, kg, quantity, allKg, amount, narrative, changee, prvchange) 
                VALUES ('$branchCode', '$reciept', '$date', '$time', '$customer', '$phone', '$payment', '$amount', '$kg', '$quantity','$kgValue' , '$amount', '$narrate', '$change', '$prevchange')";
                $runthis = mysqli_query($connect, $make);
          }

          $gas = "SELECT SUM(allKg), SUM(amount), SUM(quantity) FROM completeSales WHERE reciept = '$crb' AND branch = '$branchCode'  ";
          $give = mysqli_query($connect, $gas);
          if($give){
            while ($row = mysqli_fetch_array($give)) {
              $kggg = $row['SUM(allKg)'];
              $ammm = $row['SUM(amount)'];
              $qqqq = $row['SUM(quantity)'];
            }
          }
    
      } 
      
      
      // display the tank information

      $fla = "SELECT * FROM gasStations WHERE Bcode = '$branchCode' ";
      $gama = mysqli_query($connect, $fla);

          if(mysqli_num_rows($gama) > 0){

              while($row = mysqli_fetch_array($gama)){
                  $tank = $row["BtankUse"];
                  $tankA = $row["BtankA"];
                  $tankB = $row["BtankB"];
                
              }
          }
          if($tank == 'Tank A'){
              $remaining = $tankA - $kggg;
              $gabble = "UPDATE gasStations SET BtankA = '$remaining' WHERE Bcode = '$branchCode' ";
              $gogabble = mysqli_query($connect, $gabble);
        
          }elseif($tank == 'Tank B'){
              $remaining = $tankB - $kggg;
              $gabble = "UPDATE gasStations SET BtankB = '$remaining' WHERE Bcode = '$branchCode' ";
              $gogabble = mysqli_query($connect, $gabble);
          
          }

        

          //populate finalsales table 
          $finalsales = " INSERT INTO finalsales (branch, reciept, datee, timee, customer,category, phone, payment, cash, kg, quantity, amount, salesStatus, changee,changeD, finalTotal, tankUse, opening, balancee, closing)
          VALUES('$branchCode', '$reciept', '$date', '$time', '$customer', '$category', '$phone', '$payment', '$ammm', '$kggg','$qqqq','$ammm', '$status', '$comChange', '$changeDD', '$finalamount', '$tank','$openTank', '$remaining', '$remaining')";
          $gofinal = mysqli_query($connect, $finalsales);

          //update customer record
            $g =  "SELECT * FROM customers WHERE Cphone = '$phone' ";
            $rol = mysqli_query($connect, $g);
            if($rol){
              while ($rr = mysqli_fetch_array($rol)) {
                $bought = $rr['CpurchaseCount'];
                $cha = $rr['Cchange'];
              }

              $credit = "UPDATE customers SET CpurchaseCount = $bought + 1 WHERE Cphone = '$phone' ";
              $doCredit = mysqli_query($connect, $credit);
            
            }

            //Send sms
            $owneremail="creativenigeriablueprint@gmail.com";
            $subacct="GAS";
            $subacctpwd="Omamuli";
            $sendto=$phone;
            $sender="Aicogas";
            $message="Thank you for your patronage : Kg Bought / Amount ".$kggg." KG/ ".$ammm." NGN : Change: ".$comChange." NGN. Thank You, Please Come Again.";
            /* create the required URL */
            /* destination number */
            /* sender id */
            /* message to be sent */
            $url = "http://www.smslive247.com/http/index.aspx?" 
            ."cmd=sendmsg"
            ."&owneremail=" . UrlEncode($owneremail)
            ."&subacct=" . UrlEncode($subacct)
            ."&subacctpwd=" . UrlEncode($subacctpwd) 
            ."&message=" . UrlEncode($message)
            ."&sender=" .UrlEncode($sender)
            ."&sendto=". UrlEncode($sendto);
            
            /* call the URL */
            if ($f = @fopen($url, "r"))
            {
                  $answer = fgets($f, 255);
                          if (substr($answer, 0, 1) == "+")
                          {
                                echo "SMS to $dnr was successful.";
                    } else {
                      echo "an error has occurred: [$answer].";
                    } 
          }else {
            
                  echo "Error: URL could not be opened.";
          }
          
          
  }

  if(isset($_POST['bad'])){
  
    $branchCode = $_SESSION['Bcode'];
    //get values
    $phonee = $_POST['cphone'];
    $crb = $_POST['crb'];
    $reciept = $crb;
    $payment = $_POST['payment'];
    $cash = $_POST['cash'];
    $pos = $_POST['pos'];
    $transfer = $_POST['transfer'];
    $narrate = $_POST['narrative'];
    $change = $_POST['change'];

  
    $catch = "SELECT * FROM Crbs WHERE crbnumber ='$crb' AND branch = '$branchCode' ";
    $catchme = mysqli_query($connect, $catch);
    if(mysqli_num_rows($catchme) > 0){
        while($cx = mysqli_fetch_array($catchme)){
          $date = $cx['datee'];
          $time = $cx['timee'];
          $customer = $cx['customer'];
          $phone = $cx['phone'];
        }
    }

    $trr = "SELECT SUM(kg), SUM(quantity), SUM(amount) FROM salespoint WHERE crbnumber = $crb AND branch = '$branchCode' ";
    $suu = mysqli_query($connect, $trr);

    if($suu){

      while($gagaa = mysqli_fetch_array($suu)){

          $famount = $gagaa['SUM(amount)'];
          $tkg = $gagaa['SUM(kg)'];
          $tqu = $gagaa['SUM(quantity)'];
      }
    }



    $cage = "INSERT INTO badCrbs (branch, crbnumber, datee, timee, customer, phone, kg, quantity, amount, narrative) 
    VALUES ('$branchCode', '$crb', '$date', '$time', '$customer', '$phone', '$tkg', '$tqu', '$famount', '$narrate')";
    $cageher = mysqli_query($connect, $cage);

    $dash = "UPDATE crbs SET kg = 0, quantity = 0, amount = 0, tquant = 0 WHERE crbnumber = '$crb' AND branch = '$branchCode' ";
    $dashgo = mysqli_query($connect, $dash);

    $rock = "DELETE FROM salespoint WHERE crbnumber = '$crb' AND branch = '$branchCode'";
    $flash = mysqli_query($connect, $rock);

    if($flash){
      $message = "<h6 class='text-success'><b>Sales cancelled successfully<b><h6>";
    }else{
      $message = "<h6 class='text-danger'><b>Error cancelling sales<b><h6>";
    }

  }

                  

  ?>

  <!DOCTYPE html>
  <html lang="en">

  <head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    
    <title>Aicogas</title>

    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.min.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script
    src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"></script>

    <script src="my.js"></script>

    <script>
    
    function printContent(el){

      var restorepage = document.body.innerHTML;
      var printcontent = document.getElementById(el).innerHTML;
      document.body.innerHTML = printcontent;
      window.print();
      document.body.innerHTML = restorepage;
      
    }
    
    
    </script>
                      


  </head>

  <body id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

      

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">

        <!-- Main Content -->
        <div id="content">

          <!-- Topbar -->
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            <!-- Sidebar Toggle (Topbar) -->
            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
              <i class="fa fa-bars"></i>
            </button>

            <!-- Topbar Search -->
          

            <!-- Topbar Navbar -->
            <ul class="navbar-nav ml-auto">

              <div class=" d-none d-sm-block"></div>

              <!-- Nav Item - User Information -->
              <li class="nav-item dropdown no-arrow">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="mr-2 d-none d-lg-inline text-gray-600 small">Welcome <?php 
                  echo  "<b class='text-primary'>".$username."</b>"; 
                  echo " | Today's Date: ";  
                  echo date('l jS F (Y-m-d)', strtotime('now')); 
                  echo " | Your Home Company: <b class='text-success'>".$company."</b>";
                  echo " | Your Branch Location:  <b class='text-success'>".$branch."</b>";
                  
                  ?></span>
                  <form action="logout.php">
                  <button class="btn btn-outline-danger">Logout</button>
                  </form>
                </a>
                <!-- Dropdown - User Information -->
                <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                
                </div>
              </li>

            </ul>

          </nav>
          <!-- End of Topbar -->

          <!-- Begin Page Content -->
    
          <div class="container">
              <h1  align="center">Almarence International Company Limited</h1>
              <div>
              <h6 class='text-info' align='center'>Tank In Use: <span class='text-danger'><?php echo  $tank;  ?></span></b> | 
                Stock Remaining: <span class='text-danger'><b><?php echo number_format($remaining); ?> Kg</b></span> | <span><b> Stock Sold: <span class='text-danger'><b><?php echo number_format($allKgg); ?> Kg</b></span></h6> 
              </div>
              <div align="center">
              <button class="btn btn-outline-info" data-toggle="modal" data-target="#report" >My report for today</button>
              </div>
          </div>


        
  <hr>
            <!-- Page Heading -->
            <div class="container">
            
                  <div class="row">

                        <div class="col col-lg-1">

                          <div>
                              <small>CRBS</small>
                          </div>
                              <div style="width:auto; height:auto; overflow-y:scroll;">
                              <hr>
                              <?php $createStation->pullCRBs(); ?>
                              </div>
                        </div>

                        <div class="col col-lg-7">

                          <div class="card shadow">

                            <div class="card-body">


                            <form action="  " method="POST">
                          <div id="">
                                <input class="form-control" type="text" name="cphone" value="<?php echo $phone ?>" style="visibility:hidden">
                                
                                <input type="number" class="form-control" name="crb" value="<?php echo $crb ?>" readonly placeholder="<?php echo $crb ?>">
                                <br>
                                <h6>Customer Name: <b class="text-info"><?php echo $name; ?></b> <span> | Phone Number: <b class="text-info"><?php echo $phone ?></b></span> </h6>
                                
                                <h6>Category: <b class="text-danger"><?php echo $category ?></b></h6>

                                <hr>
                                            <?php 

                                        if($go2){

                                            while($row = mysqli_fetch_array($go2)){

                                                $crb = $row['crbnumber'];
                                                $phone = $row['phone'];
                                                $name = $row['customer'];
                                                $category = $row['category'];
                                                $kg = $row['kg'];
                                                $date = $row['datee'];
                                                $time = $row['timee'];
                                                $branch = $row['branch'];
                                                $quantity = $row['quantity'];
                                                $amount = $row['amount'];

                                                echo "
                                                    <h6>Cylinder Size: <b class='text-info'>".$kg." Kg </b></h6>
                                                    <h6>Cylinder Quantity: <b class='text-info'>".$quantity." Units</b></h6>
                                                    <h6>Amount: <b class='text-info' >".number_format($amount)." NGN</b></h6>
                                                    <hr>
                                                ";

                                            }

                                        }else{

                                        }
                                              
                                            if($su){

                                                while($gaga = mysqli_fetch_array($su)){

                                                    $amama = $gaga['SUM(amount)'];

                                                    echo "
                                                        <h6 align='center'><b class='text-info'>Amount Payable: ".number_format($amama)." NGN </b></h6>
                                                        <hr>
                                                    ";
                                                }
                                            }else{

                                            }
                              
                                            ?>
                <div class="container">
                
              
                      <div class="row">
                                    <div class="col col-sm-6">
                                        
                                        <input class="form-control" type="number" name="change" placeholder="Customer's Change ?">
                                    </div>

                                    <div class="col col-sm-6">
                                      
                                          <button class="col-sm-12 btn btn-outline-danger" type="submit" name="change" value="<?php echo $change  ?>"><b>Accumulated change: <?php echo $change  ?> NGN</b> </button>
                                    
                                  </div>
                        </div>

                </div>

                <hr>
                                <div class="form-group">
                                <small>Amount</small>
                                <button class="col-sm-12 btn btn-outline-success" type="submit"  name="cash" value="<?php echo $amama  ?>"><b>Amount Due: <?php echo number_format($amama) ?> NGN</b> </button>
                                <small>Select payment option</small>
                                                            <select class="form-control" name="payment">
                                                            <option selected value="Cash">Cash</option>
                                                            <option value="POS">POS</option>
                                                            <option value="Transfer">Credit</option>
                                                            </select>
                                  </div>

                                  <div class="container">
                                    
                                                    <div class="form-group">
                                                            <small>Transaction narrative</small>
                                                          <select class="form-control" name="narrative">
                                                          <option selected value="Successful - Keep change">Transaction successful - Keep change</option>
                                                          <option value=" <?php echo $change ?> ">Transaction successful - deduct ( <?php echo $change ?> NGN)</option>
                                                          <option value="Failed - ATM Declined">ATM Declined</option>
                                                          <option value="Failed - Transfer Failed">Transfer Failed</option>
                                                          <option value="Failed - Cylinder Error">Uncorresponding Cylinder</option>
                                                          </select>
                                                  </div>

                                  
                                  
                                  </div>


                                  <div class="container">
                                  
                                  <div class="row">

                                      <div class="col col-sm-6">
                                          <button class="form-control btn btn-danger" type="submit" name="bad">Decline sales</button>
                                      </div>

                                      <div class="col col-sm-6">
                                          <button class="form-control btn btn-success" type="submit" name="com">Complete sales</button>
                                      </div>

                                      </div>
                                      </form>
                                  </div>


                                  </div>

                            </div>

                          </div>
                      </div>


                <div class="col col-md-4">

                    <div class="card shadow">
                    
                        <div class="card-body">

                        <div id='crbprint'>

                            <?php 
                            
                            echo "<h4 align='center'><b>".$company."</b></h4>";
                            echo "<hr>";

                            $sql = "SELECT company.CompanyName, gasStations.Bname, gasStations.Baddress, gasStations.Bcode FROM company, gasStations WHERE company.CompanyCode = gasStations.company AND gasStations.Bcode = '$branchCode' ";
                            $result = mysqli_query($connect , $sql);

                            while($row = mysqli_fetch_array($result)){
                                $com = $row['CompanyName'];
                                $code = $row['Baddress'];
                                $name = $row['Bname'];

                                echo "<small align='center'>".$com." | ".$name." <br> ".$code. "</small>";
                                echo "<hr>";
                            }

                            
                            $sql = "SELECT * FROM completeSales WHERE branch = '$branchCode' ORDER BY id DESC LIMIT 1";
                            $go = mysqli_query($connect , $sql);
                            if(mysqli_num_rows($go) > 0){
                                while($row = mysqli_fetch_array($go)){
                                    $cname = $row['customer'];
                                    $phone = $row['phone'];
                                    $rec = $row['reciept'];
                                    $change = $row['changee'];
                                    $payment = $row['payment'];

                                }
                                
                                echo "<small>Customer's Name: ".$cname."</small><br>";
                                echo "<small>Customer's Phone: ".$phone."</small><br>";
                                echo "<small>Sales Attendant: ".$username."</small>";
                                echo "<hr>";
                                echo "<small>Reciept No: <b>".$rec."</b></small><br>";
                            
                            }

                            $sql2 = "SELECT kg, quantity, amount FROM completeSales WHERE branch = '$branchCode' AND reciept = '$rec'";
                            $go2 = mysqli_query($connect , $sql2);

                            echo "
                            
                            <table class='table '>
                                                            <thead>
                                                            <tr>
                                                            <th scope='col'>Cylinder Type</th>
                                                            <th scope='col'>Qty</th>
                                                            <th scope='col'>Payable</th>
                                                        
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                    
                            ";

                            if($go2){

                                while($row = mysqli_fetch_array($go2)){
                                    $phone = $row['phone'];
                                    $name = $row['customer'];
                                    $category = $row['category'];
                                    $kg = $row['kg'];
                                    $date = $row['datee'];
                                    $time = $row['timee'];
                                    $branch = $row['branch'];
                                    $quantity = $row['quantity'];
                                    $amount = $row['amount'];

                                    echo "<tr>";
                                    echo "<th scope='row'>".$kg."</th>";
                                    echo "<th scope='row'>".$quantity."</th>";
                                    echo "<th scope='row'>".number_format($amount)." NGN</th>";
                                    
                                    echo "</tr>";

                                }

                            }else{

                            }
                            echo "
                            </tbody>
                            </table>
                            <hr>
                            ";

                            $train = "SELECT * FROM finalsales WHERE reciept = $rec AND branch = '$branchCode' ";
                            $su = mysqli_query($connect, $train);

                            if($su){

                                while($gaga = mysqli_fetch_array($su)){
                                    $amchange = $gaga['changee'];
                                    $ampayment = $gaga['payment'];
                                    $amm = $gaga['amount'];
                                    $finalAmount = $gaga['finalTotal'];             
                                }
                                $deduct = $amm - $finalAmount;
                                if($amchange != 0){
                                    $finalAmount = $amm - $amchange;
                                }
                                
                                echo "
                                        <small align='left'><b class='text-danger'>Change Deducted: ".number_format($deduct)." NGN </b></small><br>
                                        <small align='left'><b class='text-info'>Total Payable: ".number_format($finalAmount)." NGN </b></small><br>
                                        <small align='left'><b class='text-info'>Customer Change: ".number_format($amchange)." NGN </b></small><br>
                                        <small align='left'><b class='text-info'>Method of Payment: ".$ampayment."</b></small>
                                        <hr>
                                    ";
                            }else{

                            }

                            // $fish = "SELECT * FROM salespoint WHERE 


                        
                            echo   "<div>";
                            echo  "<h6 align='center'>".$company."<br> Thanks for your patronage. Please come again.</h6>";
                        echo "</div>";
                            echo   "<hr>";
                    echo "</div>";
                            
                            
                            
                            
                            
                            ?>



                            <div class='row'>
                <div class='col col-md-12'>
            <form action='filter.php' method='POST' id='tosales'>
            <button class='col btn btn-success' type='submit' name='filter' onclick='printContent("crbprint"); document.getElementById("tosales").submit();' >Print Reciept</button>
           <?php echo  "<input type='number' name='reciept' value=".$rec." style='visibility: hidden' readonly>" ?>
                </form>
            </div>

                        </div>

                        </div>
                </div>
              </div>

                  </div>
    
            </div>
          
          
                  
      
            
              

      <div class="modal fade" id="report" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                <div class="top text-success">
                
                                  <h5 align='center'><?php echo $username ?>'s Report </h5>
                                <h6 align="center"> <?php echo date('l jS F (Y-m-d)', strtotime('now')); ?></h6>
                              </div>
                              <div style="padding: 8px;">
                              <div class="contaier">
                  <h6 align='center'>Report By Categories</h6>
                  <div class="row">
                    <div class='col-sm-3 bg-danger p-2 img-rounded'>
                      <h6 class="text-white">Other</h6>
                      <?php 
                      $dt = date('Y-m-d', strtotime('now'));
                      
                        $Others = "SELECT * FROM finalsales WHERE datee = '$dt' AND branch = '$branchCode' AND category = 'Others' AND amount != 0 ";
                        $goOther = mysqli_query($connect, $Others);
                        
                        if($goOther){
                            $oth = mysqli_num_rows($goOther);
                            echo "<b class='text-white'>".$oth."</b>";
                        }
                      
                      ?>
                    </div>
                    <div class='col-sm-3 bg-success p-2 img-rounded'>
                      <h6 class="text-white">Dealer</h6>
                      <?php 
                      $dt = date('Y-m-d', strtotime('now'));
                      
                        $Others = "SELECT * FROM finalsales WHERE datee = '$dt' AND branch = '$branchCode' AND category = 'Dealer' AND amount != 0 ";
                        $goOther = mysqli_query($connect, $Others);
                        
                        if($goOther){
                            $oth = mysqli_num_rows($goOther);
                            echo "<b class='text-white'>".$oth."</b>";
                        }
                      
                      ?>
                    </div>
                    <div class='col-sm-3 bg-primary p-2 img-rounded'>
                      <h6 class="text-white">Eatery</h6>
                      <?php 
                      $dt = date('Y-m-d', strtotime('now'));
                      
                        $Others = "SELECT * FROM finalsales WHERE datee = '$dt' AND branch = '$branchCode' AND category = 'Eatery' AND amount != 0 ";
                        $goOther = mysqli_query($connect, $Others);
                        
                        if($goOther){
                            $oth = mysqli_num_rows($goOther);
                            echo "<b class='text-white'>".$oth."</b>";
                        }
                      
                      ?>
                    </div>
                    <div class='col-sm-3 bg-info p-2 img-rounded'>
                      <h6 class="text-white ">Domestic</h6>
                      <?php 
                      $dt = date('Y-m-d', strtotime('now'));
                      
                        $Others = "SELECT * FROM finalsales WHERE datee = '$dt' AND branch = '$branchCode' AND category = 'Domestic' AND amount != 0 ";
                        $goOther = mysqli_query($connect, $Others);
                        
                        if($goOther){
                            $oth = mysqli_num_rows($goOther);
                            echo "<b class='text-white'>".$oth."</b>";
                        }
                      
                      ?>
                    </div>
                  
                  </div>
                </div>
                      <table class='table table-striped table-light' >
                      <thead>
                      <tr> 
                      <th scope='col'>CRB#</th>
                      <th scope='col'>Customer</th>
                      <th scope='col'>Kg</th>
                  
                  
                      <th scope='col'>Amount</th>
                      </tr>
                      </thead> 
                      <tbody>
          
                      <?php $createStation->salesReport(); ?>

                      </tbody>
                          </table>

                
                        
          
                              </div>
                              </div>
                <div class="modal-footer">
                </div>
              </div>
            </div>
          </div>

      
        <!-- Footer -->
        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>Copyright &copy; Aicogas 2020</span>
            </div>
          </div>
        </footer>
        <!-- End of Footer -->

      </div>
      <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Bootstrap core JavaScript-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>

    <!-- Page level plugins -->
    <script src="vendor/chart.js/Chart.min.js"></script>

    <!-- Page level custom scripts -->
    <script src="js/demo/chart-area-demo.js"></script>
    <script src="js/demo/chart-pie-demo.js"></script>

    <script src="my.js"></script>

  </body>

  </html>
