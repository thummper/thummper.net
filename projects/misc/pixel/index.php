<!DOCTYPE html>
<html>

<head>
	<?php include("../../../webAnalytics.php"); ?>
    <title> Bubble Sort Pixel Sorting </title>
    <style>
        body{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>
    
    
</head>

<body>
    <label>Select File: </label>
    <input type="file" id="fileInput" onchange="imageUpload(this.files)"><hr>
    
    
    
    
    
    <canvas id="imageCanvas"></canvas>
    <script src="bubblesort.js"></script>
</body>

</html>
