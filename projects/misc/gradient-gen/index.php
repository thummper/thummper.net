<!DOCTYPE html>
<html>

<head>
	<?php include("../../../webAnalytics.php"); ?>
    <title>Gradient Generator.</title>
    <style>
        * {
            margin: 0;
        }

        html,
        body {
            width: 100%;
            height: 100%;
            transition: all 0.3s;
        }

        body {
            background-color: #f2f2f2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Verdana;
            font-size: 20px;
        }

        #main {
            transition: all 0.8s;
        }
        #box1, #box2{
            display: inline-block;
            width: 20px;
            height: 20px;
            background-color: #f2f2f2;
            border: solid 2px white;
            margin-left: 5px;
            margin-right: 5px;
            transition: all 0.3s;
        }
        .colours {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 98%;
            margin: 0 auto;
        }
        .descWrapper{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px 10px;
            background: black;
            color: white;
            border-radius: 20px;
        }

    </style>
    <script>
        window.onload = function() {
            //On spacebar/mousepress make new gradient. 
            document.addEventListener("keypress", function(e) {
                if (e.keyCode == 32) {
                    changeGradient();
                }
            });
            document.addEventListener("click", function() {
                changeGradient();
            })



            function changeGradient() {
                var colour1 = genColour();
                var colour2 = genColour();
                document.getElementById("col1").innerHTML = colour1;
                document.getElementById("col2").innerHTML = colour2;
                document.getElementById("box1").style.background = colour1;
                document.getElementById("box2").style.background = colour2;
                
                var main = document.getElementById("main");
                var gradient = "linear-gradient(135deg, " + colour1 + " , " + colour2 + ")";
                console.log("Gradient: " + gradient);
                main.style.background = gradient;





            }

            function genColour() {
                var letters = "0123456789ABCDEF";
                var colour = "#";
                for (let i = 0; i < 6; i++) {
                    colour += letters[Math.floor(Math.random() * 16)];
                }
                return colour;
            }


        }

    </script>
</head>

<body id="main">
    <div class="descWrapper">
    <div class="desc">Click or press space to generate a new gradient. </div><br>
    <div class="colours"><span id='col1'>#sdsdfsdf</span><span id="box1"></span> -> <span id="box2"></span><span id="col2">#asdasd</span></div>
        </div>


</body>

</html>
