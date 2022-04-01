function Paddle(canvas, wallWidth) {
    this.x = 0;
    this.y = 100;
    this.dy = 0;
    this.width = 30;
    this.height = 200;
    this.canvas = canvas;
    this.wall_width = wallWidth;
    this.ctx = canvas.getContext("2d");
    this.left = this.x;
    this.right = this.left + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
    this.paddleSpeed = 1;
    this.moving_up = false;
    this.moving_down = false;
    this.prediction;
    
    this.col1; 
    this.col2; 


    this.maxY = canvas.height - wallWidth - this.height;
    this.minY = wallWidth;
    this.speed = (this.maxY - this.minY) / this.paddleSpeed;


    this.draw = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        this.ctx.rect(this.x, this.y, this.width, this.height);
        this.ctx.fill();
        this.ctx.closePath();
    }

    this.draw_debug = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "red";
        this.ctx.rect(this.x, this.y, this.canvas.width, 5);
        this.ctx.rect(this.x, this.y + this.height, this.canvas.width, 5);
        this.ctx.rect(this.x + this.width, this.wall_width, 5, this.canvas.height);
        this.ctx.fill();
        this.ctx.closePath();

    }

    this.update = function (dt) {
        if (this.dy != 0) {
            var y = this.y + (this.dy * dt * this.speed);
            if (y < this.minY)
                y = this.minY;
            else if (y > this.maxY)
                y = this.maxY;
            this.y = y;
        }

        this.left = this.x;
        this.right = this.left + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    this.ai = function (balls, dt) {
        //Pick a ball to track.
        let track_ball;
        if (balls.length > 1) {
            for (i in balls) {
                let ball = balls[i];
                if (track_ball) {
                    if(track_ball.dx < 0 && ball.dx > 0){
                        track_ball = ball;
                    }else if (this.x - ball.x < this.x - track_ball.x && ball.dx > 0) {
                        //Closer ball, track. 
                        track_ball = ball;
                    }
                } else {
                    track_ball = ball;
                }
            }
        } else {
            //Only 1 ball in array.
            if (balls.length > 0 && balls[0].dx > 0) {
                track_ball = balls[0];
            }

        }
        if(track_ball && !track_ball.predicted){
        //Do some weird intercept stuff to figure out where the ball will hit the paddle. 
        //Work out position of next ball and trace a line. 
   
        track_ball.gradient = track_ball.dy/track_ball.dx;
        track_ball.c = track_ball.y - (track_ball.x * track_ball.gradient);
        //Check line intercepts  (y = canvas height || 0), X = canvas width.
        track_ball.col1 = 0 - track_ball.c / track_ball.gradient; //Top of canvas.
        track_ball.col2 = canvas.height - track_ball.c / track_ball.gradient; //Bottom of canvas. 
        track_ball.col3 = track_ball.gradient * track_ball.x + track_ball.c;
        //track_ball.predicted = true;
        if(track_ball.col3 <= canvas.height && track_ball.col3 >= 0){
            if(track_ball.col3 < this.y){
                this.stopDown();
                this.startUp();
                
            } else if(track_ball.col3 > this.y){
                this.stopUp();
                this.startDown();
            }
        }
        console.log("TOP X: " + track_ball.col1 + "\n BOT X: " + track_ball.col2);
        }






    }


    this.startUp = function () {
        //start moving up.
        console.log("start up");
        this.moving_up = true;
        this.dy = -1;
    }
    this.stopUp = function () {
        //stop moving up.
        console.log("stop up");
        this.moving_up = false;
        this.dy = 0;
    }

    this.startDown = function () {
        console.log("start down");
        this.moving_down = true;
        this.dy = 1;
    }
    this.stopDown = function () {
        console.log("stop down");
        this.dy = 0;
        this.moving_down = true;
    }
}



