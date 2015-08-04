<?php
//Get the current state of the server with the given serverId
//A valid apiKey must be specified and that apiKey must have
//permission to view the specified server

require '../config/database.php';
require '../model/serverLog.php';
use Model\ServerLog;

//Get our values from the client
$apiKey = $_GET['apiKey'];
$serverId = $_GET['serverId'];
$recordLimit = $_GET['recordLimit'];

//Sanitize our user imput to prevent MySQL injection
$apiKey = $mysqli->real_escape_string($apiKey);
$serverId = $mysqli->real_escape_string($serverId);
$recordLimit = $mysqli->real_escape_string($recordLimit);

//Make sure the user didn't get too ambitious with the record limit (limit 50)
if ($recordLimit > 50) $recordLimit = 50;

//Getserver status from database
$sql = "SELECT server_log.*, S.name as serverName, S.description as serverDescription
        FROM server_log LEFT JOIN server S ON server_log.server_id = S.id 
        WHERE server_log.server_id='" . $serverId . "' 
        ORDER BY server_log.createdOn DESC LIMIT " . $recordLimit;
        
//Query the database and store the result in a server object
$result = mysqli_query($mysqli, $sql);
$results = array();
while ($row = $result->fetch_object())
{
    $results[] = $row;
}

//return the result
echo json_encode($results, JSON_PRETTY_PRINT);