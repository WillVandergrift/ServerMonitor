<?php
//This file is used connect to the specified MySQL database or die if an error occurs

//Setup connection information for connecting to MySQL
$host = "localhost";
$username = "***";
$password = "***";
$database = "server_monitor";

//Attempt to connect to the MySQL database or die, displaying the error message
$mysqli = new mysqli($host, $username, $password, $database);
if ($mysqli->connect_errno) {
    die("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}