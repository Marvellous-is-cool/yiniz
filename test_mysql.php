<?php
$conn = new mysqli('localhost', 'root', '', 'yiniz_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully to yiniz_db!\n";
echo "Server info: " . $conn->server_info . "\n";

// Test if tables exist
$result = $conn->query("SHOW TABLES");
if ($result->num_rows > 0) {
    echo "Tables in database:\n";
    while($row = $result->fetch_array()) {
        echo "- " . $row[0] . "\n";
    }
} else {
    echo "No tables found. Import your schema first.\n";
}

$conn->close();
?>
