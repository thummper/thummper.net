<?php
echo "Hello?";
print_r($_POST);
$id = $_POST["id"];
$field = $_POST["field"];
$content = $_POST["content"];
echo "Recieved update request to change key: ".$id." field: ".$field." content: ".$content;



$conn = new mysqli($servername, $username, $password, $dbname);
if($conn -> connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}
$sql = "UPDATE Projects SET ".$field."='".$content."' WHERE pID=".$id;

if($conn->query($sql) === TRUE) {
    echo "Updated successfully";
}else {
    echo "Error updating: " . $conn->error;
}



?>