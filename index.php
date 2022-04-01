<!DOCTYPE html>
<html lang="en">
<head>
	<link href="https://fonts.googleapis.com/css?family=Rubik:500" rel="stylesheet" rel="preload">
	<link href="https://fonts.googleapis.com/css?family=Muli|Ovo&display=swap" rel="stylesheet" rel="preload">
	<link rel="stylesheet" href="./assets/css/style.css"/>
	<link rel="icon"       href='./assets/favicon.ico'  />

	<?php include("analytics.php"); ?>
	<link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">

	<title> Aron's Personal Site</title>


	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="description" content="Aron Bettison's web portfolio" />
	<meta name=viewport content="width=device-width, initial-scale=1" />


	<!-- Stuff For Rain -->
	<link rel="stylesheet" href="assets/rain/rain_style.css" />
	<script src="https://unpkg.com/masonry-layout@4.2.2/dist/masonry.pkgd.min.js"></script>
	<script src="https://unpkg.com/isotope-layout@3.0.6/dist/isotope.pkgd.js"></script>
	<script src="assets/rain/particle.js"></script>
	<script src="assets/rain/drop.js"></script>
	<script src="assets/rain/rain_script.js"></script>



</head>

<body>
	<div class="background">
		<canvas id="splashCanvas"></canvas>
		</div>


		<div class="splash">
		<div class="splashText">
			<span id="name" class="headerText">
				Aron Bettison
			</span>
			<span id="role" >
				Web Development & Browser-based Games
			</span>
			<div class="linkRow">
				<a class="link" href="https://github.com/thummper">
					<i class="lab la-github"></i>
				</a>
				<a class="link" href="https://www.linkedin.com/in/aron-bettison-5986bb128/">
					<i class="lab la-linkedin-in"></i>
				</a>
				<a class="link" href="https://twitter.com/ArsonBettino">
					<i class="lab la-twitter"></i>
				</a>

			</div>
			<div class="cvRow">
			<a class="link" href="./cv">
					Technical CV
				</a>
				<a class="link" href="./cv/non-tech.html">
					Non-tech CV
			</a>
			</div>

			</div>


		</div>


		</div>

		<main>
		<div class="title">
			<div class="titleSep"></div>
			<div class="titleText headerText">My Projects</div>
		</div>


		<div class="projectsWrapper">
			<?php include("assets/getprojects.php"); ?>
		</div>






	<div class="modalsWrapper">

	<div class="modal">
			<div class="modalContent">
				<div class="modalHeader">
					<h2> Header </h2>
					<span class="close">&times;</span>
				</div>
				<div class="modalBody">
					<p> Modal 0</p>
				</div>
				<div class="modalFooter">
					<h3>Modal Footer</h3>
				</div>
			</div>
		</div>


		<div class="modal">
			<div class="modalContent">
				<div class="modalHeader">
					<h2> Header </h2>
					<span class="close">&times;</span>
				</div>
				<div class="modalBody">
					<p> Modal 1</p>
				</div>
				<div class="modalFooter">
					<h3>Modal Footer</h3>
				</div>
			</div>
		</div>



	</div>
	</main>

	<script>
		window.addEventListener("load", function(){


			let gridWrapper = document.getElementsByClassName("projectGrid")[0];
			let iso = new Isotope(gridWrapper, {
				itemSelector: ".gridItem",
				masonry: {
					columnWidth: '.gridItem',
					fitWidth: true,
				}
			});

			let filterButtons = document.getElementsByClassName("filterWrapper")[0].getElementsByTagName("button");
			for(button of filterButtons){
				button.addEventListener("click", function(){
					let filterValue = this.dataset.filter;

					iso.arrange({ filter: filterValue });

				})
			}


			let canvas = document.getElementById("splashCanvas");
			let random = (Math.random() * (10 - 1)) + 1;
			if(random >= 5){
				showRain();
			}
			function showRain(){
				setup();
			}
			document.body.style.opacity = 1;



			// Modals


			let modals  = document.getElementsByClassName("modal");
			let buttons = document.getElementsByClassName("gridItem");

			let closeButtons = document.getElementsByClassName("close");

			for(let i = 0; i < closeButtons.length; i++){
				let button = closeButtons[i];
				button.addEventListener("click", function(){
					button.parentElement.parentElement.parentElement.style.display = "none";
				});
			}



			window.addEventListener("click", function(event){
				console.log("Window Click");
				let target = event.target;
				for(let i = 0; i < modals.length; i++){
					let modal = modals[i];
					if(modal == target){
						modal.style.display = "none";
					}
				}

			})

			for(let i = 0; i < buttons.length; i++){
				let button = buttons[i];
				let modal  = modals[i];
				button.addEventListener("click", function(){
					//
					modal.style.display = "block";
				});
			}

		});
	</script>

</body>

</html>
