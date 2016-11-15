<?php
    header("Content-Type: application/json; charset=UTF-8");
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');

    //define('_HOST_NAME_', 'localhost'); // http://10.192.5.106/
    define('_HOST_NAME_', '10.192.5.106'); //
    define('_USER_NAME_', 'root');
    define('_DB_PASSWORD', '');
    define('_DATABASE_NAME_', 'projetwebrila');
    
    try
    {
        $databaseConnection = new PDO('mysql:host='._HOST_NAME_.';dbname='._DATABASE_NAME_, _USER_NAME_, _DB_PASSWORD);
        $databaseConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } 
    catch(PDOException $e) 
    {
        echo 'ERROR: ' . $e->getMessage();
    }

    $return = "{\"success\":false}";
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $password = $request->password;
    $username = $request->username;

    $result = $databaseConnection->prepare("SELECT * FROM testusers WHERE username= :usr AND password= :pw");
    $result->bindParam(':usr', $username);
    $result->bindParam(':pw', $password);
    $result->execute();
    $rows = $result->fetch(PDO::FETCH_NUM);

    if($rows > 0)
    {
        $return = "{\"success\":true}";
    }

    echo($return)
?>