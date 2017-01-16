<?php

// Ajout d'une alerte en BDD
    header("Content-Type: application/json; charset=UTF-8");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');

    define('_HOST_NAME_', 'localhost');
    define('_PORT_NUMBER_', '16081');
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
        echo 'Erreur addalert : ' . $e->getMessage();
    }

    
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $name = $request->name;
    $lat = $request->lat;
    $lng = $request->lng;
    $typeAlerte = $request->typeAlerte;
    $user = $request->user;
    $icon = $request->icon;

    $result = $databaseConnection->prepare("INSERT INTO marqueurs (name, lat, lng, typeAlerte, user, icon) VALUES (:name, :lat, :lng, :typeAlerte, :user, :icon)");
    $result->bindParam(':name', $name);
    $result->bindParam(':lat', $lat);
    $result->bindParam(':lng', $lng);
    $result->bindParam(':typeAlerte', $typeAlerte);
    $result->bindParam(':user', $user);
    $result->bindParam(':icon', $icon);
    if ($result->execute()){
        $return = "{\"success\":true}";
    }
    else{
        $return = "{\"success\":false}";
    }

    echo($return)
?>