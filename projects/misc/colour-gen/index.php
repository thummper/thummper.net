<!DOCTYPE html>
<html>
    <head>
        <?php include("../../../webAnalytics.php"); ?>
        <style>
            * {
                margin: 0; 
            }
            html, body {
                width: 100%;
                height: 100%;
            }
            body {
                background-color: aquamarine;
                transition: 0.8s;
                display: flex;
                flex-direction: column;
                justify-content: center;
                
                
                font-family: Verdana;
                font-size: 20px;
            }
            #colour {
                align-self: center;
                
               
            }
            #bottom {
                width: 430px;
                text-align: center;
                position: absolute;
                bottom: 0; 
                left: 50%;
                margin-left: -200px;
 
            }
        
        </style>
        <script>
            window.onload = function() {
                document.addEventListener("keypress", function(e){
                    console.log(e.key);
                    if(e.key == " ")
                        {
                            //Need to generate hex colour code
                            var x = getColour(); 
                            document.body.style.backgroundColor = x;
                            document.getElementById("colour").innerHTML = x;
                        }
                    else {
                        var y = test(); 
                        console.log(y);
                        document.body.style.backgroundColor = y;
                        document.getElementById("colour").innerHTML = y;
                    }
                })
            }
            function getColour() {
                var letters = "0123456789ABCDEF";
                var colour = "#";
                for(i=0; i<6; i++)
                    {
                        colour += letters[Math.floor(Math.random() * 16)];
                    }
                return colour;
            }
            function random(min, max) {
                return Math.floor(min + Math.random() * (max - min)); 
            }
            function test() {
                var h = random(1, 360); 
                var s = random(0, 100); 
                var l = random(0, 100);
                
                return 'hsl(' + h + ',' + s + '%,' + l + '%)'; 
                
                
            }
        </script>
        <title>Generate Hex ColourCodes</title>
    </head>
    <body>
        <span id="colour">Aquamarine</span>
        <span id="bottom">Press space for hex, any other key for hsl.</span>
    
    </body>
</html>