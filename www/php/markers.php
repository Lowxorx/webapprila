<?php
// Récupération des marqueurs en bdd
    header("Content-Type: application/json; charset=UTF-8");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');

    define('_HOST_NAME_', '192.168.1.118');
    define('_PORT_NUMBER_', '3306');
    define('_USER_NAME_', 'projetweb');
    define('_DB_PASSWORD', 'Projetwebrila2016');
    define('_DATABASE_NAME_', 'projetwebrila');
    
    try
    {
        $databaseConnection = new PDO('mysql:host='._HOST_NAME_.';port='._PORT_NUMBER_.';dbname='._DATABASE_NAME_, _USER_NAME_, _DB_PASSWORD);
        $databaseConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } 
    catch(PDOException $e) 
    {
        echo 'ERROR: ' . $e->getMessage();
    }

    
    $result = "{\"success\":false}";

    $result = $databaseConnection->prepare("SELECT * FROM marqueurs");
    $result->execute();

    while($row = $result->fetch(PDO::FETCH_ASSOC))
    {
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
  if($result){
    $result = "{\"success\":true, \"markers\":" . json_encode($markers) . "}";        
  }
  else
  {
    $result = "{\"success\":false}";
  }
    echo($result)
?>