function Ball(canvas, ctx, wall_width) {
	this.wall_width = wall_width;
	this.canvas = canvas;
	this.ctx = ctx;
	this.acceleration = 3;
	this.radius = 20;

	this.minX = wall_width - this.radius / 2;
	this.maxX = canvas.width - wall_width - this.radius / 2;
	this.minY = wall_width + this.radius;
	this.maxY = canvas.height - wall_width - this.radius;

	this.x = random(this.minX, this.maxX);
	this.y = random(this.minY, this.maxY);
	this.dx = randomSign((this.maxX - this.minX) / random(1, 10));
	this.dy = randomSign((this.maxY - this.minY) / random(1, 10));
	this.colour = "black";
	this.centerCol = "white";
    this.predicted = false;
    this.col1;
    this.col2;
    this.gradient;
    this.c;
    this.col3;


	this.update = function (dt, left_paddle, right_paddle) {
		//Work out ball's next position.
		var next_position = accelerate(this.x, this.y, this.dx, this.dy, this.acceleration, dt);
		this.setpos(next_position);


		if (this.y <= this.minY) {
			//Gone off top. 
			this.y = this.minY;
			this.dy = this.dy * -1;
            this.predicted = false;
		}
		if (this.y >= this.maxY) {
			this.y = this.maxY;
			this.dy = this.dy * -1;
             this.predicted = false;
		}

		if ((this.y < left_paddle.bottom) && (this.y > left_paddle.top)) {
			this.centerCol = "green";
		} else {
			this.centerCol = "white";
		}

		if (this.dx < 0) {
			//Ball is going left. 
			if ((this.x - this.radius <= left_paddle.right) && (this.x - this.radius) > left_paddle.left && (this.y < left_paddle.bottom) && (this.y > left_paddle.top)) {
				//Collision
				this.colour = getRandomColor();
				
				this.dx = this.dx * -1;
                 this.predicted = false;
				if (left_paddle.moving_up) {
					this.dy -= 80;
				}
				if (left_paddle.moving_down) {
					this.dy += 80;
				}
			} else if ((this.x - this.radius) < left_paddle.right && (this.x - this.radius) > left_paddle.left) {
				//Handle collision with top/bottom of paddle (no idea)
				this.centerCol = "yellow";
			}
		}
        if (this.dx > 0) {  
			//Going right 
            if( this.x + this.radius >= right_paddle.left && this.y < right_paddle.bottom && this.y > right_paddle.top && this.x + this.radius < right_paddle.right){
                console.log("rcc");
                this.dx *= -1;
                 
            }
		}
	


	}
    
	


	this.setpos = function (position) {
		this.x = position.x;
		this.y = position.y;
		this.dx = position.dx;
		this.dy = position.dy;
	}


	this.draw = function () {
		var w = this.radius * 2;
		this.ctx.fillStyle = this.colour;
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		this.ctx.fill();
	}

	this.draw_debug = function () {

		//Draw center point.
		this.ctx.beginPath();
		this.ctx.fillStyle = this.centerCol;
		this.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, true);
		this.ctx.fill();


		//Draw info about location
		this.ctx.beginPath();
		this.ctx.fillStyle = "black";
		this.ctx.font = "14px Roboto";
		let text = "X: " + Math.round(this.x) + " Y: " + Math.round(this.y) + " DY: " + Math.round(this.dy) + " DX: " + Math.round(this.dx) + " ACC: " + Math.round(this.acceleration);
		this.ctx.fillText(text, this.x - this.ctx.measureText(text).width / 2, this.y - this.radius - 5);

	}
}

function random(min, max) {
	return Math.floor(Math.random() * max) + min;
}

function accelerate(x, y, dx, dy, acc, time) {
	var x_dist = (time * dx) + (acc * time * time * 0.5);
	var y_dist = (time * dy) + (acc * time * time * 0.5);
	var new_dx = dx + (acc * time) * (dx > 0 ? 1 : -1);
	var new_dy = dy + (acc * time) * (dy > 0 ? 1 : -1);
	return {
		xdist: x_dist,
		ydist: y_dist,
		x: x + x_dist,
		y: y + y_dist,
		dx: new_dx,
		dy: new_dy
	};
}

function randomSign(number) {
	var chance = Math.floor(Math.random() * 100) + 0;
	if (chance >= 50) {
		return number *= -1;
	} else {
		return number;
	}
}
//Haha duplicate code..
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
