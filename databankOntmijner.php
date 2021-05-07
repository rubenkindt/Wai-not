<?php

$dbhost = "localhost";
$dbuser = "dbusername";
$dbpass = "dbpassword";
$dbname = "dbname";

// Create connection
$link = mysqli_connect("dbhost", "dbuser", "dbpassword", "dbname");
// Check connection
if (!$link) {
    die("Connection failed: " . mysqli_connect_error());
}

if(isset($_GET['user']) && isset($_GET['score']){
	
	$user=mysql_real_escape_string($_GET['user']);
	$score=mysql_real_escape_string($_GET['score']);
	$sql = "UPDATE linkermuisknop SET highScoreBommen='".$score."' where userNr=".$user.'"';
	
	if (mysqli_query($link, $sql)) {
		echo "Record updated successfully";
	} else {
		echo "Error updating record: " . mysqli_error($conn);
	}
}



?>