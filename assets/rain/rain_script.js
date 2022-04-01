var canvas;
var ctx;
var rain_width = 3;
var rain_height = 18;
var drops = [];
var particles = [];


function setup() {
    //Sets everything up and starts loop.
    document.getElementsByClassName("background")[0].style.backgroundImage = "none";

    canvas = document.getElementById('splashCanvas');
    console.log("CANVAS: ", canvas);
    canvas.style.display = "block";
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Make some drops.
    for (let i = 0; i < 30; i++) {
        drops.push(new Drop(canvas.width));
    }
    loop();

}

var last_time;
function loop() {

    //Refill drops if ran out. 
    if (drops.length < 100) {
        drops.push(new Drop(canvas.width));
    }


    //Loops.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var time = 0.1;
    var ctime = new Date();
    if (last_time) {
        //Time is defined
        time = ctime - last_time;
        last_time = ctime;
    } else {
        //not defined. 
        last_time = ctime;
    }



    for (let i = drops.length - 1; i >= 0; i--) {
        let drop = drops[i];
        if (drop.y + rain_height >= canvas.height) {
            drop.splash();
            drops.splice(i, 1);
        } else {

            drop.draw(rain_width, rain_height);
            drop.update(time);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        let part = particles[i];
        part.draw();
        if (part.update(time)) {
            particles.splice(i, 1);
        }
    }



    window.requestAnimationFrame(loop);
}

function random_speed(min, max, s) {
    let sign = Math.round((Math.random() * 9) + 1);
    let speed = 0;
    if (s) {
        speed = (Math.random() * (min - max) + max) * (sign <= 5 ? -1 : 1);
    } else {
        speed = (Math.random() * (min - max) + max) * (sign <= 5 ? -1 : 1);
    }


    return speed;
}
