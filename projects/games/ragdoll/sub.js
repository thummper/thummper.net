let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    Constraint = Matter.Constraint,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint;
let engine = Engine.create();
engine.world.gravityY = 0.7

let walls = [];
let canvas = document.getElementsByClassName("canvasWrapper")[0];


let width = 960;
let height = 600;
let lscore = 0;
let rscore = 0;

let scoreWrapper = document.querySelector(".scoreWrapper");

scoreWrapper.style.width = width + "px";
scoreWrapper.style.height = height + "px";


function updateScoreDisplay(){
    let leftScore = document.querySelector(".leftScore");
    let rightScore = document.querySelector(".rightScore");


    leftScore.innerHTML = lscore;
    rightScore.innerHTML = rscore;

}


let render = Render.create({
    element: canvas,
    engine: engine,
    options: {
        width: width,
        height: height,
        wireframes: false,
    }
});
// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.3,
            damping: 0.35,
            render: {
                visible: true,
                type: 'line'
            }
        }
    });



let wallWidth = 20;
function createWalls(){
   
    let top = Bodies.rectangle(width / 2, wallWidth/2, width, wallWidth, {isStatic: true, restitution: 1.2, friction: 0.2});
    let left = Bodies.rectangle(wallWidth/2, height/2, wallWidth, height, {isStatic: true, restitution: 1.8, friction: 0.2});
    let right = Bodies.rectangle(width - wallWidth / 2, height/2, wallWidth, height, {isStatic: true, restitution: 1.8, friction: 0.2});
    let bottom = Bodies.rectangle(width/2, height, width, wallWidth * 3, {isStatic: true, restitution: 1.2, friction: 0.2});
    walls = [top, left, right, bottom];
}




class Ragdoll{
    constructor(x, y){

        this.ragdoll = false;
        this.head;
        this.chest;
        this.leftUpper;
        this.leftLower;
        this.rightUpper;
        this.rightLower;
        this.luLeg;
        this.ruLeg;
        this.llLeg;
        this.rlLeg;


        this.x = x;
        this.y = y;
        this.headSize = 35;
        this.chestWidth = 50;
        this.chestHeight = 70;
        
        
        this.armOverlap = 2;
        this.armWidth = 15;
        this.upperLength = 30;
        this.lowerLength = 55;
        this.chestRad = 22;
        this.headRad = 10;
        
        this.legWidth = 15;
        this.upperLegLength = 40;
        this.lowerLegLength = 60;
        this.legGap = 0.25;



        this.headOptions = Common.extend({
            label: 'head',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {radius: [this.headRad,this.headRad,this.headRad,this.headRad,]},
        });
        this.leftUpperOptions = Common.extend({
            label: "left-arm",
            chamfer: {radius: 10},
            collisionFilter: {group: Body.nextGroup(true)}
        });
        this.leftLowerOptions = Common.extend({}, this.leftUpperOptions, {});
        
        this.rightUpperOptions = Common.extend({
            label: "right-arm",
            chamfer: {radius: 10},
            collisionFilter: {group: Body.nextGroup(true)}
        });
        this.rightLowerOptions = Common.extend({}, this.rightUpperOptions, {});
        this.leftUpperLegOptions = Common.extend({
            label: "left-leg",
            chamfer: {radius: 10},
            collisionFilter: {group: Body.nextGroup(true)}
        }); 
        this.rightUpperLegOptions = Common.extend({
            label: "left-leg",
            chamfer: {radius: 10},
            collisionFilter: {group: Body.nextGroup(true)}
        }); 
        this.leftLowerLegOptions = Common.extend({}, this.leftUpperLegOptions, {});
        this.rightLowerLegOptions = Common.extend({}, this.rightUpperLegOptions, {});






        this.makeBodies();
        this.makeConst();
        this.makeRagdoll();
        
    }

    makeConst(){
        this.headChest = Constraint.create({
            bodyA: this.head,
            bodyB: this.chest,
            length: 2.5,
            pointA: {x: 0, y: this.headSize / 2},
            pointB: {x: 0, y: - this.chestHeight / 2},
            stiffness: 1,
            damping: 0.5,
            render: {
                visible: false
            }
        });
        this.leftUpperAttach = Constraint.create({
            bodyA: this.chest,
            bodyB: this.leftUpper, 
            pointA: {x: -this.chestWidth/2, y: -this.chestHeight/2},
            pointB: {x: this.armWidth/2, y: -this.upperLength/2},
            length: 0,
            render: {
                visible: false
            }
         });
         this.leftUpperLower = Constraint.create({
            bodyA: this.leftUpper,
            bodyB: this.leftLower, 
            pointA: {x: 0, y: this.upperLength/2},
            pointB: {x: 0, y: -this.upperLength/2 + this.armOverlap},
            stiffness: 0.6,
            render: {
                visible: false
            }
         });
        
         this.rightUpperAttach = Constraint.create({
             bodyA: this.chest,
             bodyB: this.rightUpper,
             pointA: {x: this.chestWidth/2, y: -this.chestHeight/2},
             pointB: {x: -this.armWidth/2, y: -this.upperLength/2},
             length: 0,
             render: {
                visible: false
            }
        
         });
         this.rightUpperLower = Constraint.create({
             bodyA: this.rightUpper,
             bodyB: this.rightLower,
             pointA: {x: 0, y: this.upperLength/2},
             pointB: {x: 0, y: -this.upperLength/2 + this.armOverlap},
             stiffness: 0.6,
             render: {
                visible: false
            }
         });
        
         this.luLegAttach = Constraint.create({
            bodyA: this.chest,
            bodyB: this.luLeg,
            pointA: {x: -this.chestWidth*this.legGap, y: this.chestHeight/2},
            pointB: {x: 0, y: -this.upperLegLength/2},
            stiffness: 0.9,
            length: 0,
            render: {
                visible: false
            }
        }); 
        
        this.ruLegAttach = Constraint.create({
            bodyA: this.chest,
            bodyB: this.ruLeg,
            pointA: {x: this.chestWidth*this.legGap, y: this.chestHeight/2},
            pointB: {x: 0, y: -this.upperLegLength/2},
            stiffness: 0.9,
            length: 0,
            render: {
                visible: false
            }
        }); 
        
        this.llLegAttach = Constraint.create({
            bodyA: this.luLeg,
            bodyB: this.llLeg,
            pointA: {x: 0, y: this.upperLegLength/2},
            pointB: {x: 0, y: -this.upperLegLength/2 + this.armOverlap},
            stiffness: 0.9,
            render: {
               visible: false
           }
        });
        
        this.rlLegAttach = Constraint.create({
            bodyA: this.ruLeg,
            bodyB: this.rlLeg,
            pointA: {x: 0, y: this.upperLegLength/2},
            pointB: {x: 0, y: -this.upperLegLength/2 + this.armOverlap},
            stiffness: 0.9,
            render: {
               visible: false
           }
        });
    }
    makeBodies(){
        this.head = Bodies.rectangle(this.x, this.y - this.chestHeight/2 - this.headSize/2, this.headSize, this.headSize, this.headOptions);
        this.chest = Bodies.rectangle(this.x, this.y, this.chestWidth, this.chestHeight, {chamfer: { radius: [this.chestRad,this.chestRad,this.chestRad,this.chestRad] }, collisionFilter: {group: Body.nextGroup(true)}});
        this.leftUpper = Bodies.rectangle(this.x - this.chestWidth/2, this.y - this.upperLength/2, this.armWidth, this.upperLength, this.leftUpperOptions);
        this.leftLower = Bodies.rectangle(this.x - this.chestWidth/2,  this.y + this.upperLength/2 - this.armOverlap, this.armWidth, this.lowerLength, this.leftLowerOptions);
        this.rightUpper = Bodies.rectangle(this.x + this.chestWidth/2, this.y - this.upperLength/2, this.armWidth, this.upperLength, this.rightUpperOptions);
        this.rightLower = Bodies.rectangle(this.x + this.chestWidth/2,  this.y + this.upperLength/2 - this.armOverlap, this.armWidth, this.lowerLength, this.rightLowerOptions);
        this.luLeg = Bodies.rectangle(this.x - this.chestWidth*this.legGap, this.y + this.chestHeight/2, this.legWidth, this.upperLegLength, this.leftUpperLegOptions);
        this.ruLeg = Bodies.rectangle(this.x + this.chestWidth*this.legGap, this.y + this.chestHeight/2, this.legWidth, this.upperLegLength, this.rightUpperLegOptions);
        this.llLeg = Bodies.rectangle(this.x - this.chestWidth*this.legGap, this.y + this.chestHeight/2 + this.upperLegLength, this.legWidth, this.lowerLegLength, this.leftLowerLegOptions);
        this.rlLeg = Bodies.rectangle(this.x + this.chestWidth*this.legGap, this.y + this.chestHeight/2 + this.upperLegLength, this.legWidth, this.lowerLegLength, this.rightLowerLegOptions);

    }
    makeRagdoll(){
        this.ragdoll = Composite.create({
            bodies: [this.head, this.chest, this.leftUpper, this.leftLower, this.rightUpper, this.rightLower, this.luLeg, this.ruLeg, this.llLeg, this.rlLeg],
            constraints: [this.headChest, this.leftUpperAttach, this.leftUpperLower, this.rightUpperAttach, this.rightUpperLower, this.luLegAttach, this.ruLegAttach, this.llLegAttach, this.rlLegAttach],
        });
    }
}




let forceMove = 0.009;
let ballRadius = 30;
let endTimer = false;
let startTime = null;










let ballCollideGroup = Body.nextGroup(true);
let centerRect = Bodies.trapezoid(width/2, height - 128, 40, 280, 0.8, {isStatic: true, friction: 0.1});
let dividingRect = Bodies.rectangle(width/2, height/2, 20, height, {render: {opacity: 0}, isStatic: true, collisionFilter: {group: ballCollideGroup}});
function makeBall(){
    let newBall = Bodies.circle(width/2, height/2 - ballRadius, ballRadius, {render: {fillStyle: 'lightblue'}, collisionFilter: {group: ballCollideGroup}, mass: 0.004, friction: 0.01, frictionAir: 0.005, restitution: 0.6});
    return newBall;
}
let ball = makeBall();



let ragdoll  = new Ragdoll(300, 160);
let ragdoll2 = new Ragdoll(600, 160);


let left = false;
let right = false;
let up = false;
let down = false;
let lr = false;
let rr = false;


let eleft = false;
let eright = false;
let eup = false;
let edown = false;

createWalls();
World.add(engine.world, mouseConstraint);
World.add(engine.world, [ragdoll.ragdoll, ragdoll2.ragdoll, centerRect, ball, dividingRect]);
World.add(engine.world, walls);

Engine.run(engine);
Render.run(render);
moveLoop();




function applyForce(force, body, direction){
    if(direction == "left"){
        Body.applyForce(body, {x: body.position.x, y: body.position.y}, {x: -force, y:0});
    }
    if(direction == "right"){
        Body.applyForce(body, {x: body.position.x, y: body.position.y}, {x: force, y:0});
    }
    if(direction == "up"){
        Body.applyForce(body, {x: body.position.x, y: body.position.y}, {x: 0, y:-force*1.5});
    }
    if(direction == "down"){
        Body.applyForce(body, {x: body.position.x, y: body.position.y}, {x: 0, y:force*1.5});

    }
    if(direction == "rl"){
        Body.setAngularVelocity(body, -0.2);

    }
    if(direction == "rr"){
        Body.setAngularVelocity(body, 0.2);

    }
}





function resetBall(){
    World.remove(engine.world, ball);
    let newBall = makeBall();
    ball = newBall;
    World.add(engine.world, ball);
}

function calcEnemyMove(){
    let ballpos = ball.position;
    let enemypos = ragdoll2.chest.position;

    let ballxv = ball.velocity.x;


    if(ballxv > 0.1 || ballpos.x > width/2){
        // We care about the ball.

        let xdiff = ballpos.x - enemypos.x;
        let ydiff = ballpos.y - enemypos.y;


        if(xdiff < 0){
            // move left
            eleft = true;
        } else {
            eleft = false;
        }
        if(xdiff > 0){
            // move right
            eright = true;
        } else{
            eright = false;
        }
        if(ydiff < 0){
            // move up
            eup = true;
        } else {
            eup = false;
        }
        if(ydiff > 0){
            // move down
            edown = true;
        } else {
            edown = false;
        }

    }

    

}


let scored = false;

function moveLoop(){
    // Guess this is actually the game loop.



    if(ball.position.x > this.width || ball.position.x < 0){
        resetBall();
    }

    // Check if ball is on the ground.
    let yBall = ball.position.y - height + (wallWidth * 2) + ballRadius;
    //console.log("Y BALL: ", yBall);

    if(yBall > -5){
        // Ball has hit the ground
        ball.render.fillStyle = "red";
        // Who scores?
        if(scored == false){
            if(ball.position.x > width/2){
                // left scores.
                lscore++;
            }else if(ball.position.x < width/2){
                // right scores.
                rscore++;
            }
            updateScoreDisplay();
            scored = true;



        }




        if(endTimer == false){
            endTimer = true;
            startTime = new Date().getTime();
        }
    }

    if(endTimer){
        // After threshold, reset ball.
        let currentTime = new Date().getTime();
        let difference = currentTime - startTime;
        if(difference >= 2000){
            resetBall();
            scored = false;
            endTimer = false; 
            startTime = null;
        }

    }




    // Get direction ai should move
    calcEnemyMove();

    let playerForce = 0.01;
    let aiForce = 0.0075;


    if(eleft){
        applyForce(aiForce, ragdoll2.ragdoll.bodies[0], "left");
    }
    if(eright){
        applyForce(aiForce, ragdoll2.ragdoll.bodies[0], "right");
    }
    if(eup){
        applyForce(aiForce, ragdoll2.ragdoll.bodies[0], "up");
    }
    if(edown){
        applyForce(aiForce, ragdoll2.ragdoll.bodies[0], "down");
    }

    if(lr){
        applyForce(playerForce, ragdoll.ragdoll.bodies[0], "rl");
    }
    if(rr){
        applyForce(playerForce, ragdoll.ragdoll.bodies[0], "rr");
    }
    if(left){
        applyForce(playerForce, ragdoll.ragdoll.bodies[0], "left");
    }
    if(right){
        applyForce(playerForce, ragdoll.ragdoll.bodies[0], "right");
    }
    if(up){
        applyForce(playerForce, ragdoll.ragdoll.bodies[0], "up");
    }
    if(down){
        applyForce(playerForce, ragdoll.ragdoll.bodies[0], "down");
    }

    window.requestAnimationFrame(moveLoop);
}



window.addEventListener("keydown", function(e){

    if(e.code == "KeyQ"){
        lr = true;
    }
    if(e.code == "KeyE"){
        rr = true;
    }
 
    if(e.code == "KeyA" || e.code == "ArrowLeft"){
        left = true;
    }
    if(e.code == "KeyD" || e.code == "ArrowRight"){
        right = true;
    }
    if(e.code == "KeyW" || e.code == "ArrowUp"){
        up = true;
    }
    if(e.code == "KeyS"  || e.code == "ArrowDown"){
        down = true;
    }
});

window.addEventListener("keyup", function(e){

    if(e.code == "KeyQ"){
        lr = false;
    }
    if(e.code == "KeyE"){
        rr = false;
    }

    if(e.code == "KeyA" || e.code == "ArrowLeft"){
        left = false;
    }
    if(e.code == "KeyD"|| e.code == "ArrowRight"){
        right = false;
    }
    if(e.code == "KeyW"|| e.code == "ArrowUp"){
        up = false;
    }
    if(e.code == "KeyS"|| e.code == "ArrowDown"){
        down = false;
    }
});

/* 
1 - Move ai towards ball if x direction is pos

2 
Given the ball is on the ai's side
We need to move the ai's center point towards the ball.

3
Genetic algo to train some ai? 



*/
