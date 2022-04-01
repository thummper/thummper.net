
let Engine = Matter.Engine;
let World  = Matter.World;
let Bodies = Matter.Bodies;
let Common = Matter.Common;
let Constraint = Matter.Constraint;
let Composite = Matter.Composite;
let Body = Matter.Body;

let engine = Engine.create();
let world = engine.world;

let canvas = document.getElementById("ragdollCanvas");
let ctx = canvas.getContext('2d');
let walls = [];

// Need to make walls and add.

function init(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}


class Rect {
    constructor(x, y, width, height, options){
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle( x + width / 2, y + height / 2, width, height, options);
        World.add(engine.world, this.body); 
    }
    draw(ctx){
        // Given context, draw wall.
        ctx.beginPath();
        ctx.rect(this.body.position.x - this.width / 2, this.body.position.y - this.height / 2, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
}

class Wall {
    constructor(x, y, width, height){
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle( x + width / 2, y + height / 2, width, height, { isStatic: true, restitution: 1, friction: 0});
        World.add(engine.world, this.body); 
    }
    draw(ctx){
        // Given context, draw wall.
        ctx.beginPath();
        ctx.rect(this.body.position.x - this.width / 2, this.body.position.y - this.height / 2, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }
}

class Ball {
    constructor(x, y, r){
        this.r = r;
        this.body = Bodies.circle(x, y, r, {
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            restitution: 0.5
        }); 
        World.add(engine.world, this.body); 
    }
    draw(ctx){
        // Given context, draw wall.
        ctx.beginPath();
        ctx.arc(this.body.position.x, this.body.position.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.closePath();    
    }

}


let balls = [];
function makeBalls(){
    for(let i = 0; i < 5; i ++){
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let ball = new Ball(x, y, 20);
        console.log(ball);
        balls.push(ball);
    }
}

class Ragdoll{
    constructor(x, y){

        this.chestHeight = 60;
        this.chestWidth = 40;
        this.headHeight  = 20;
        this.headGap = 10;


        this.chest = new Rect(x, y, this.chestWidth, this.chestHeight);
        this.head  = new Rect(x, y - this.chestHeight/2 - this.headGap - this.headHeight / 2, this.headHeight, this.headHeight);

        this.headConstraint = Constraint.create({
            bodyA: this.head.body,
            pointA: {
                x: 0,
                y: y - (this.chestHeight / 2) - this.headGap - (this.headHeight/2)
            },
            pointB:{
                x: 0,
                y: y - this.chestHeight/2
            },
            bodyB: this.chest.body,
            length: this.headGap,
            damping: 0.5,
            stiffness: 1
        });
        this.person = Composite.create({
            bodies: [
                this.head.body, this.chest.body
            ],
            constraints: [
                this.headConstraint
            ]
        });

       
    
    }
    draw(ctx){
        this.head.draw(ctx); 
        this.chest.draw(ctx); 


    }
}



let jsrag = [];
let ragdolls = Composite.create();
for(let i = 0; i < 1; i++){
    let rag = new Ragdoll(20, 20, 1.3);
    jsrag.push(rag);
    Composite.add(ragdolls, rag.person);
   
}

console.log(jsrag);
World.add(engine.world, ragdolls);




function makeWalls(){
    // Make world boundaries
    wallWidth = 20;
    let top    = new Wall(0, -wallWidth / 2, canvas.width, wallWidth);
    let left   = new Wall(-wallWidth / 2, 0, wallWidth, canvas.height);
    let right  = new Wall(canvas.width - wallWidth / 2, 0, wallWidth, canvas.height);
    let bottom = new Wall(0, canvas.height - wallWidth / 2, canvas.width, wallWidth);
    walls = [top, left, right, bottom];
}
















function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    for(let wall of walls){
        wall.draw(ctx);
    }
    for(let ball of balls){
        ball.draw(ctx);
    }

    //Draw ragdoll
    for(let rag of jsrag){
        //console.log(rag);
        rag.draw(ctx);
    }


    Engine.update(engine);
    window.requestAnimationFrame(loop);
}
init();
makeWalls();
makeBalls();
loop();



