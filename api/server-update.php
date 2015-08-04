<?php
//This file creates a new server_log record from posted data


//Include our php file for connecting to the database
include '../config/database.php';

//Fetch our posted values and store them in variables
$apiKey = $_POST['apiKey'];
$serverId = $_POST['serverId'];
$ramTotal = $_POST['ramTotal'];
$ramFree = $_POST['ramFree'];
$ramUsagePct = $_POST['ramUsagePct'];

//Sanitize our user imput to prevent MySQL injection
$apiKey = $mysqli->real_escape_string($apiKey);
$serverId = $mysqli->real_escape_string($serverId);
$ramTotal = $mysqli->real_escape_string($ramTotal);
$ramFree = $mysqli->real_escape_string($ramFree);
$ramUsagePct = $mysqli->real_escape_string($ramUsagePct);

//TODO: Authenticate API Key to make sure user has permission to update specified server

//Validate credentials using SQL query
$sql = "INSERT INTO server_log (server_id, ramTotal, ramFree, ramUsagePct)
        VALUES ('" . $serverId . "', '" . $ramTotal . "', '" . $ramFree . "', '" . $ramUsagePct . "')";
$result = mysqli_query($mysqli, $sql);

//Check to see if the insert completed successfully
if ($result == true)
{
    echo "Success";
}
else 
{
    //Failed to create the new record.
    echo "Failed to create server log";
}
