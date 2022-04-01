<!DOCTYPE html>

<html>

<head>
	<?php include("../../../analytics.php"); ?>
	<script src="ball.js"></script>
	<script src="paddle.js"></script>
	<script src="pong.js"></script>
	<link rel="stylesheet" href="style.css">
	<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

	<title> ~ Pong ~ </title>

</head>
<body>
	<body>
		<div class="scores">
			<span id="scoreleft">0</span>/<span id="scoreright">0</span>

		</div>
		
		<div class="canvas_wrapper">
			<span id="fps">0</span>
			<canvas id="pong"></canvas>
		</div>
		<div class="settings_wrapper">
			<div class="row">
				<span>Debug Display: </span><input type="checkbox" id="debug_display">
				<br>
				<span>Maintain Ball Level:</span><input type="checkbox" id="ball_creation">
			</div>
		</div>
	</body>

</html>
