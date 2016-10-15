<?php
    header("Content-Type: application/json; charset=UTF-8");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    
   /* $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $password = $request->password;
    $username = $request->username;*/

    //Create a connection to the database
    $mysqli = new mysqli("localhost", "root", "", "projetwebrila");
    $result = "{'success':false}";
    $query = "SELECT * FROM testusers WHERE username = $username AND password = $password";
 
    //Run the query
    $dbresult = $mysqli->query($query);
 
    if (mysql_num_rows($dbresult) == 1){

        $result = "{\"success\":true}";        
    }
    else
    {
      $result = "{\"success\":false}";
    }

    //Output the result to the browser so that our Ionic application can see the data
    echo($result);
?>