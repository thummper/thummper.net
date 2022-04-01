let Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies;
Matter.Resolver._restingThresh = 0.001;
let engine = null;
let canvas = null;
let walls = [];
let balls = [];
let playerPaddle = null;
let aiPaddle = null;
let scores = [0, 0];
let leftScore;
let rightScore;



let upPressed = false;
let downPressed = false;


function drawRounded(ctx, x, y, width, height, radius){
    let j  = ctx.lineJoin;
    let w = ctx.lineWidth;

    ctx.lineJoin  = "round";
    ctx.lineWidth = radius;
    ctx.strokeRect( x + radius / 2, y + radius / 2, width - radius, height - radius);
    ctx.fillRect( x + radius / 2, y + radius / 2, width - radius, height - radius);
    ctx.lineJoin  = j;
    ctx.lineWidth = w;

}





class Wall{
    constructor(x, y, width, height){
      
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle( x + width / 2, y + height / 2, width, height, { isStatic: true, restitution: 1, friction: 0});
    }
}

class Paddle{
    constructor(x, y, width, height, name){
        this.upPressed = false;
        this.downPressed = false;
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle(x + width / 2, y + height / 2, width, height, {isStatic: true, restitution: 10, friction: 0, id: name});
    }
}

class Ball{
    constructor(x, y, r){
        this.r = r;
        this.side = null;
        x = x / 2;
        y = y / 2;
        this.body = Bodies.circle(x, y, r, {
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            inertia: Infinity,
            restitution: 1
        }); 

        let s1 = Math.random() * 5;
        let s2 = Math.random() * 5;


        let vy = (Math.random() * 4) + 2;
        let vx = (Math.random() * 4) + 2;

        if(s1 <= 2.5){
            vx = -vx;
        }
        if(s2 <= 2.5){
            vy = -vy;
        }
        Matter.Body.setVelocity( this.body, {x: vx, y: vy});
    }
    offScreen(width){
        if(this.body.position.x <= -30){
            this.side = 1;
            return true;

        } else if(this.body.position.x >= width + 30){
            this.side = 0;
            return true;
        }
        return false;
    }
}




window.addEventListener("keyup", function(e){
    if(e.key == "w"){
        upPressed = false;
    }
    if(e.key == "s"){
        downPressed = false;
    }
});

window.addEventListener("keydown", function(e){
    if(e.key == "w"){
        upPressed = true;
    }
    if(e.key == "s"){
        downPressed = true;
    }

});


window.addEventListener("load", function(){
    console.log("Document Loaded");
    engine = Engine.create();
    engine.world.gravity.scale = 0;
    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
    Matter.Events.on(engine, 'collisionStart', function(event) {
        // // We know there was a collision so fetch involved elements ...
        // var aElm = document.getElementById(event.pairs[0].bodyA.elementId);
        // var bElm = document.getElementById(event.pairs[0].bodyB.elementId);
        let bodyA = event.pairs[0].bodyA;
        let bodyB = event.pairs[0].bodyB;
        let circleBody = null;

        let id1 = bodyA.id;
        let id2 = bodyB.id;

        if(id1 == "player1" || id1 == "player2"){
            circleBody = bodyB;
        }
        if(id2 == "player1" || id2 == "player2"){
            circleBody = bodyA;
        }

        if(circleBody !== null){

            let vel = circleBody.velocity;
            vel.x = vel.x *= 1.025;
            Matter.Body.setVelocity(circleBody, vel);
        }

       
    });



    canvas = document.getElementById("game");
    window.addEventListener("resize", function(){
        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        setup(canvas);
    });
    setup(canvas);
    loop();
   
})

function setup(canvas){
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
 
    
    walls = makeWalls(canvas.width, canvas.height);
    balls = makeBalls(canvas.width, canvas.height);


    if(playerPaddle){
        Matter.Composite.remove(engine.world, playerPaddle.body);
    }
    if(aiPaddle){
        Matter.Composite.remove(engine.world, aiPaddle.body);
    }
    playerPaddle = new Paddle(30, 30, 20, 90, "player1");
    aiPaddle     = new Paddle(canvas.width - 60, 30, 20, 90, "player2");



    World.add(engine.world, playerPaddle.body);
    World.add(engine.world, aiPaddle.body);
    for(let wall of walls){
        World.add(engine.world, wall.body);
    }
    for(let ball of balls){
        World.add(engine.world, ball.body);     
    }
    leftScore = document.getElementById("scoreLeft");
    rightScore = document.getElementById("scoreRight");

}


function loop(){
    // Draw everything.
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    for(wall of walls){
        ctx.beginPath();
        ctx.rect(wall.body.position.x - wall.width / 2, wall.body.position.y - wall.height / 2, wall.width, wall.height);
        ctx.fillStyle = "#f2f2f2";
        ctx.fill();
        ctx.closePath();
     
    }
   


    let paddle = playerPaddle;
    ctx.beginPath();
    ctx.fillStyle   = "orange";
    ctx.strokeStyle = "orange";

    drawRounded(ctx, paddle.body.position.x - paddle.width / 2, paddle.body.position.y - paddle.height / 2, paddle.width, paddle.height, 4);
    ctx.closePath();
  

    paddle = aiPaddle;
    ctx.beginPath();
    ctx.fillStyle   = "purple";
    ctx.strokeStyle = "purple";
    drawRounded(ctx, paddle.body.position.x - paddle.width / 2, paddle.body.position.y - paddle.height / 2, paddle.width, paddle.height, 4);
    ctx.closePath();
    
   


    let newBalls = [];

    if(balls.length == 0){
        balls = makeBalls(canvas.width, canvas.height);
        for(let ball of balls){
            World.add(engine.world, ball.body);     
        }
    }

    for(ball of balls){
        // Check if ball offscreen.
        if(ball.offScreen(canvas.width)){
            // We need to remove ball
            let side = ball.side;
            scores[side] ++;
            leftScore.innerHTML = scores[0];
            rightScore.innerHTML = scores[1];
            Matter.Composite.remove(engine.world, ball.body);
        } else{
            ctx.beginPath();
            ctx.arc(ball.body.position.x, ball.body.position.y, ball.r, 0, 2 * Math.PI);
            ctx.fillStyle = "#8e3155";
            ctx.fill();
            ctx.closePath();    
            newBalls.push(ball);
        }
    }

    balls = newBalls;
    if(upPressed){
        let distanceTop    = playerPaddle.body.position.y - (playerPaddle.height / 2) - 4;
        if(distanceTop > 20){
            Matter.Body.translate( playerPaddle.body, {x: 0, y: -4});
        } 
    }
    if(downPressed){
        let distanceBottom = canvas.height - (playerPaddle.body.position.y + (playerPaddle.height / 2) + 20);
        if(distanceBottom > 4){
            Matter.Body.translate( playerPaddle.body, {x: 0, y: 4}); 
        }   
    }
    aiTrans = getAiMove();
    if(aiTrans == false){
        aiPaddle.upPressed = false;
        aiPaddle.downPressed = false;
    }

    if(aiPaddle.upPressed && aiTrans){
        let distanceTop    = aiPaddle.body.position.y - (aiPaddle.height / 2) - 4;
        if(distanceTop > 20){
            Matter.Body.translate( aiPaddle.body, {x: 0, y: -8});
        } 
    }
    if(aiPaddle.downPressed && aiTrans){
        let distanceBottom = canvas.height - (aiPaddle.body.position.y + (aiPaddle.height / 2) + 20);
        if(distanceBottom > 4){
            Matter.Body.translate( aiPaddle.body, {x: 0, y: 8}); 
        }  
    }
    
    Engine.update(engine);
    window.requestAnimationFrame(loop);
}

function getAiMove(){
    // Find closet ball 
    // Get y difference
    // Move in balls direction
    let found = false;
    let closestBall = null;
    for(let ball of balls){
        let distance = aiPaddle.body.position.x - ball.body.position.x;
        if(closestBall == null && ball.body.velocity.x > 0){
            closestBall = ball;
        } else if(distance <= closestBall){
            closestBall = ball;
        }
    }
  
    if(closestBall !== null){
  
        found = true;
        let ydist =aiPaddle.body.position.y - ball.body.position.y;
        // Minus it moves down, pos it moves up.
        toMove = 0;
        let distanceTop    = aiPaddle.body.position.y - (aiPaddle.height / 2) - 4;
        let distanceBottom = canvas.height - (aiPaddle.body.position.y + (aiPaddle.height / 2) + 20);
        if(ydist <= 0){
            if(ydist <=  -1 * aiPaddle.height / 3){
                if(distanceBottom > 4){ 
                    aiPaddle.downPressed = true;
                    trans = {x: 0, y: 4}
                }
            } else {
                aiPaddle.downPressed = false;
            }
        } else {
            if(ydist > aiPaddle.height / 3){
                if(distanceTop > 20){
                    trans = {x: 0, y: -4}
                    aiPaddle.upPressed = true;
                }
            } else {
                aiPaddle.upPressed = false;
            }
        }
    }
    return found;
}





function makeBalls(width, height){
    let balls = [];
    for(let i = 0; i < 1; i++){
        let b = new Ball(width, height, 8);
        balls.push(b);
    }
    return balls;
}



function makeWalls(width, height){
    // Given width and height, make walls to encase the canvas.
    let top    = new Wall(0, 0, width, 20);
    let left = new Wall(-20, 0, 40, height);
    let right = new Wall(width - 20, 0, 40, height);
    let bottom = new Wall(0, height - 20, width, 40);
    return [top, bottom];
}