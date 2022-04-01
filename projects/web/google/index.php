<!DOCTYPE html>
<html>

<head>
	<?php include("../../../webAnalytics.php"); ?>
    <title>Google</title>
    <meta charset="utf-8" />
    <link href='https://fonts.googleapis.com/css?family=Product+Sans:400,400i,700,700i' rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">

    <style>
        * {
            margin: 0;
            border: 0;
        }
        
        .gridWrapper {
            display: grid;
            grid-template-columns: 1fr;
            grid-auto-rows: 50px 1fr 40px;
            min-height: 100vh;
        }
        
        .top {
            grid-row: 1/2;
          
        
        }
        
        .main {
            grid-row: 2/3;
            background-color: #fff;
        }
        
        .footer {
            background-color: #f2f2f2;
            border-top: 1px solid #e4e4e4;
        }
        
        .google {
            font-family: "Product Sans";
            font-weight: 600;
            display: block;
            font-size: 80px;
            letter-spacing: -1px;
            width: 300px;
            margin: 0 auto;
            margin-top: 140px;
        }
        
        .blue {
            color: #4885ed;
        }
        
        .red {
            color: #db3236;
        }
        
        .yellow {
            color: #f4c20d;
        }
        
        .green {
            color: #3cba54;
        }
        
        .e {
            display: block;
            transform: rotate(-30deg);
            width: 0;
            margin-top: -83px;
            margin-left: 218px;
        }
        
        .country {
            font-family: "Arial";
            float: right;
            margin-right: 77px;
            margin-top: -28px;
            font-size: 16px;
        }
        
        .searchSection {
            position: relative;
            margin: 0 auto;
            border-radius: 2px;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
            transition: box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
            margin-top: 30px;
            width: 632px;
            height: 44px;
        }
        .searchSection:hover {
                box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
        }
        
        .search {
            width: 503px;
            height: 34px;
            padding: 5px 9px 0px 16px;
            line-height: 0;
        }
        
        .searchButtons {
            width: 571px;
            margin: 0 auto;
            padding-top: 18px;
            height: 58px;
            display: flex;
            justify-content: center;
            
        }
        .sButton {
            cursor: pointer;
            display: inline-block;
            border-radius: 2px;
            font-size: 13px;
            color: #757575;
            font-weight: bold;
            height: 36px;
            padding: 0 18px;
            background-color: #f2f2f2;
            line-height: 35px;
            text-align: center;
            font-family: "arial";
            margin: 11px 4px;
        }
        .tts {
            position: absolute;
            padding-top: 10px;  
            margin-left: 60px;
            width: 18px;
            height: 23px;
        }
        .wrapper {
            padding-top: 10px;
            padding-right: 15px;
            height: 100%;
            
            display: flex;
            justify-content: flex-end;
            
        }
        .items {
            font-family: "Arial";
            font-size: 14px;
            display: flex;
            align-items: center;
            list-style-type: none;
            
            
        }
        .items li {
            vertical-align: middle;
            display: inline-block;
            margin-left: 20px;
        }
        .items li a {
            text-decoration: none;
            
            
            
        }
        .box {
            width: 20px;
            height: 20px;
            background-color: black;
        }
        .sCrlc {
            width: 20px;
            height: 20px;
            border-radius: 50%; 
            background-color: black;
        }
        .bCrlc {
            width: 30px;
            height: 30px;
            border-radius: 50%; 
            background-color: black;
        }
        input:focus {
            outline: none;
            
        }
      

        
    </style>
    <script>
    window.onload = function() {
        
        
        
        document.getElementsByClassName("gSearch")[0].addEventListener("click", function(){
            var query = document.getElementsByClassName("search")[0].value;
        console.log(query);
           window.location = "https://www.google.com/search?q=" + query;
        });
        
        
        document.getElementsByClassName("lucky")[0].addEventListener("click", function(){
            window.location = "https://www.google.com/doodles";
        })
    }
    
    </script>
</head>


<body>
    <div class="gridWrapper">
        <div class="top">
        <div class="wrapper">
        <ul class="items">
        <li><a href="#">Gmail</a></li>    
            <li><a href="#">Images</a></li>  
            <li><a href="#"><div class="box"></div></a></li>  
            <li><a href="#"><div class="sCrlc"></div></a></li>  
            <li><a href="#"><div class="bCrlc"></div></a></li>  
            
        </ul>   
            
        </div>
        </div>
        <div class="main">
            <div class="google"><span class="blue">G</span><span class="red">o</span><span class="yellow">o</span><span class="blue">g</span><span class="green">l</span><span class="red e">e</span>
                <div class="country"><span class="blue">UK</span></div>
            </div>

            <div class="searchSection">
                <input class="search" type="text" />
                <img class="tts" src="googleTTS.png" alt="Search With Voice"/>
            </div>
            
            <div class="searchButtons">
            <div class="sButton gSearch">Google Search</div>
            <div class="sButton lucky">I'm Feeling Lucky</div>
            
            </div>

        </div>
        <div class="footer"></div>
    </div>

</body>

</html>
