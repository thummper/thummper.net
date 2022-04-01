window.onload = function () {
	
	var settings = {
		debug: false,
		ball_creation: false,
		ball_amount: 5
	}
	
	document.getElementById("debug_display").addEventListener("change", function(){
		settings.debug = this.checked;
        console.log("Debug is: " + settings.debug);
	});
	document.getElementById("ball_creation").addEventListener("change", function(){
		settings.ball_creation = this.checked;
        console.log("Ball creation is: " + settings.ball_creation);
	})
	

	var canvas = document.getElementById("pong");
	var ctx = canvas.getContext("2d");
	var score = [0, 0];
	var fps = 0;
	var paddle1;
	var paddle2;
	var balls = [];
	var walls = [];
	var wall_width = 15;

	var lastDate;

	var cols = ["black", "red"];


	setInterval(function () {
		document.getElementById("fps").innerHTML = fps;
		fps = 0;
	}, 1000);



	function setup() {
		canvas.width = 900;
		canvas.height = 500;
		//Set up walls 
		walls.push({
			x: 0,
			y: 0,
			width: canvas.width,
			height: wall_width
		});
		walls.push({
			x: 0,
			y: 0,
			width: wall_width,
			height: canvas.height
		});
		walls.push({
			x: 0,
			y: canvas.height - wall_width,
			width: canvas.width,
			height: wall_width
		});
		walls.push({
			x: canvas.width - wall_width,
			y: 0,
			width: wall_width,
			height: canvas.height
		});
		//Set up canvas
		//make 10 colours
		for (let j = 0; j < 10; j++) {
			var col = getRandomColor;
			cols.push(col);
		}
		paddle1 = new Paddle(canvas, wall_width);
		paddle1.x += wall_width;
		paddle2 = new Paddle(canvas, wall_width);
		paddle2.x = canvas.width - paddle2.width - wall_width;

		for (i = 0; i < settings.ball_amount; i++) {
			makeBall();
		}
		//set up event listeners? 
		document.body.addEventListener("keydown", keypressed);
		document.body.addEventListener("keyup", keyreleased);
		window.requestAnimationFrame(gameLoop);
	}

	//Handling keypresses
	function keypressed(evt) {
		switch (evt.keyCode) {
			case 32:
				//Start game
				break;
			case 87:
				paddle1.startUp();
				//Move up
				break;
			case 83:
				paddle1.startDown();
				//Move down
				break;
		}
	}

	function keyreleased(evt) {
		switch (evt.keyCode) {
			case 32:
				//Stop game
				break;
			case 87:
				paddle1.stopUp();
				//Stop move up
				break;
			case 83:
				//Stop move down
				paddle1.stopDown();
				break;
		}
	}

	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}


	function makeBall() {
		let ball = new Ball(canvas, ctx, wall_width);
		//Generate random x,y velocity for ball.
		ball.colour = getRandomColor();
		balls.push(ball);
	}

	function gameLoop() {

		var time = 0.1;
		var d = new Date();
		
		if(settings.ball_creation){
			if(balls.length < settings.ball_amount){
				makeBall();
			}
		}

		if (lastDate) {
			time = (d - lastDate) / 1000;
			lastDate = d;
		} else {
			lastDate = d;
		}

		//Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//Draw walls.
		ctx.fillStyle = "#f2f2f2";
		for (i in walls) {
			var wall = walls[i];
			ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
		}

		//Draw paddles.
		if(settings.debug){
			paddle1.draw_debug();
            paddle2.draw_debug();
		}
		paddle1.draw();
        paddle2.draw();
        paddle2.ai(balls, time);
        
       
        
		//Update paddles.
		paddle1.update(time);
        paddle2.update(time);
		
		//Draw & update balls.
		for (let i = balls.length - 1; i >= 0; i--) {
			var ball = balls[i];
			ball.draw();
            if(ball.dx > 0){
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            if(ball.col1 <= canvas.width && ball.col1 >=0){
            ctx.lineTo(ball.col1, 0 + wall_width);
            }
            if(ball.col2 <= canvas.width && ball.col2 >= 0){
            ctx.lineTo(ball.col2, canvas.height - wall_width);
            }
            if(ball.col3 >= 0 && ball.col3 <= canvas.height){
                ctx.lineTo(canvas.width - wall_width, ball.col3);
            }
            ctx.stroke();
            ctx.closePath();
            }
			if(settings.debug){
				ball.draw_debug();
			}
			ball.update(time, paddle1, paddle2);
			//Ball deletion handled here. 
			if (ball.x < ball.minX || ball.x > ball.maxX) {
				//Gone off left, right scores. 
				balls.splice(i, 1);
			}
		}
		//Game loop
		fps++;
		window.requestAnimationFrame(gameLoop);
	}

	setup();
}
