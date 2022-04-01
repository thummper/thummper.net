<?php

$first = true;

$conn = new mysqli($servername, $username, $password, $dbname);
if($conn -> connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}
$sql = "SELECT * FROM Projects";
$result = $conn->query($sql);

//Make project table:
echo "<table class='project_table'>";
while($row = $result->fetch_assoc()){
    $keys = array_keys($row);
    if($first) {
        echo "<tr class='headers'>";
        //First time, print headers.
        $first = false;
        for($i = 0; $i < count($keys); $i++){
            echo "<th>".$keys[$i]."</th>";
        }
        echo "</tr>";
    } else {
            //For each record make a row.
    echo "<tr>";
        for($i = 0; $i < count($keys); $i++){
            echo "<td id='$keys[$i]' >" . $row[$keys[$i]] . "</td>";
        }
    echo "</tr>";

    }

}
echo "</table>";


?>
