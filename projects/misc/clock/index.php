<!DOCTYPE html>
<html>

<head>
	<?php include("../../../webAnalytics.php"); ?>
    <title>Clock</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: "Roboto", sans-serif;
        }

        #textTime {
            text-align: center;
        }

    </style>
    <script>
        //Get the time! 
        window.onload = function() {

            var canvas = document.getElementById("clock");
            var ctx = canvas.getContext("2d");
            var offset = 1.5 * Math.PI;
            setup();

            function setup() {
                canvas.width = 800;
                canvas.height = 800;
                window.requestAnimationFrame(draw);

            }

            function draw() {
                let date = new Date();

                var hour = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                var milli = date.getMilliseconds();
                document.getElementById("textTime").innerHTML = hour + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);


                ctx.beginPath();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.lineWidth = 6;
                ctx.shadowBlur = 3;
                ctx.strokeStyle = "#060809";
                ctx.shadowColor = "#060809";
                let end1 = map_range(seconds, 0, 60, 0, 2 * Math.PI);
                ctx.arc(400, 400, 200, 0 + offset, end1 + offset);
                ctx.stroke();


                ctx.beginPath();
                ctx.strokeStyle = "#434343";
                ctx.shadowColor = "#434343";
                let end2 = map_range(minutes, 0, 60, 0, 2 * Math.PI);
                ctx.arc(400, 400, 190, 0 + offset, end2 + offset);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = "#EE682A";
                ctx.shadowColor = "#EE682A";
                let end3 = map_range(hour % 12, 0, 12, 0, 2 * Math.PI);
                ctx.arc(400, 400, 180, 0 + offset, end3 + offset);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = "#EE682A";
                ctx.shadowColor = "#EE682A";
                let end4 = map_range(milli , 0, 1000, 0, 2 * Math.PI);
                ctx.arc(400, 400, 210, 0 + offset, end4 + offset);
                ctx.stroke();









                window.requestAnimationFrame(draw);



            }
            //Thank stackoverflow
            function map_range(value, low1, high1, low2, high2) {
                return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
            }
        }

    </script>
</head>

<body>
    <div class="canvasWrapper">
        <div id="textTime">00:00:00</div>
        <canvas id="clock"></canvas>

    </div>

</body>

</html>
