<?php
  //Set these headers to avoid any issues with cross origin resource sharing issues
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type,x-prototype-version,x-requested-with');
  
  //Create a connection to the database
  $mysqli = new mysqli("212.129.41.100:16081", "projetweb", "Projetwebrila2016", "projetwebrila");
 
  //The default result to be output to the browser
  $result = "{'success':false}";
 
  //Select everything from the table containing the marker informaton
  $query = "SELECT * FROM marqueurs";
 
  //Run the query
  $dbresult = $mysqli->query($query);
 
  //Build an array of markers from the result set
  $markers = array();
 
  while($row = $dbresult->fetch_array(MYSQLI_ASSOC)){
 
    $markers[] = array(
      'id' => $row['id'],
      'name' => $row['name'],
      'lat' => $row['lat'],
      'lng' => $row['lng'],
      'typeAlerte' => $row['typeAlerte'],
      'user' => $row['user'],
      'icon' => $row['icon']
    );
  }
 
  //If the query was executed successfully, create a JSON string containing the marker information
  if($dbresult){
    $result = "{\"success\":true, \"markers\":" . json_encode($markers) . "}";        
  }
  else
  {
    $result = "{\"success\":false}";
  }
 

 
  //Output the result to the browser so that our Ionic application can see the data
  echo($result);
 
?>