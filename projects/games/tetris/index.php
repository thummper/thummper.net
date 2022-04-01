<!DOCTYPE html>
<html>

<head>
	<?php include("../../../webAnalytics.php"); ?>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="tStyle.css" />
</head>

<body>
    <div class="gameWrapper">
        <div class="left">
            <canvas id="board"></canvas>
        </div>
        <div class="right">
            <div class="numLines">Lines: <span id="totalLines">0</span></div>
            <canvas id="nextPiece"></canvas>
        </div>

    </div>

    <script src="tetro.js"></script>
    <script src="piece.js"></script>
    <script src="tetris.js"></script>

</body>

</html>
