<?php
//Get a list of all servers for the given company ID
//A valid apiKey must be specified

require '../config/logErrors.php';
require '../config/database.php';
require '../model/server.php';
use Model\Server;

//Get the clients apiKey and company id
$apiKey = $_GET['apiKey'];
$companyId = $_GET['companyId'];

//Sanitize our user imput to prevent MySQL injection
$apiKey = $mysqli->real_escape_string($apiKey);
$companyId = $mysqli->real_escape_string($companyId);


//Getserver status from database
$sql = "SELECT * 
        FROM server
        WHERE company_id='" . $companyId . "' 
        ORDER BY name DESC";
        
//Query the database and store the result in a server object
$results = mysqli_query($mysqli, $sql);
$menuItems = array();

 while ($server = mysqli_fetch_object($results, "Model\Server")) 
 {
    //return the result
    $menuItems[] = $server;
 }
 
 echo json_encode($menuItems, JSON_PRETTY_PRINT);
