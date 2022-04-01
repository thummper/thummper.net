<!DOCTYPE html>
<html>

<head>
    <?php include("../../../webAnalytics.php"); ?>
    <!-- Link All The Things -->
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Chewy" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Cabin|Lobster" rel="stylesheet">
    <!-- General Head Stuff -->
    <title>Magic Tomato Timer</title>
    <meta charset="utf-8" />
    <meta name="description" content="basic pomodoro timer" />
    <meta name="author" content="Aron B" />
    <meta lang="en"/>
    <meta charset="utf-8" />
</head>

<body>
    <!-- Wrapper for CSS grid -->
    <div class="wrapper">
        <div class="headerRow">

            <div class="heading">
                <h1>Pomodoro Timer</h1>
            </div>
        </div>
        <div class="mainRow">
            <div class="blockHolder">
            <div class="blk block0"></div>
            <div class="blk block1"></div>
            <div class="blk block2"></div>
            <div class="blk block3"></div>
            
            </div>
        
            <div class="timerMain" id="timer">25:00</div>
            <div class="buttons">
                <button id="startButton" onclick="startClock()">Start</button>
                <button id="pauseButton" onclick="doPause()">Pause</button>
                <button id="resetButton" onclick="doReset()">Reset</button>
            </div>

        </div>
        <div class="footer">
        </div>
    </div>
</body>

</html>
