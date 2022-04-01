window.addEventListener("load", function () {
    console.log("Window has loaded");
    let game = new Game();

});

// Loads and stores assets 
class Loader {
    constructor() {
        this.clouds = [];
        this.images = [];
        this.sounds = [];
    }
    loadImage(src, name) {
        let image = new Image();
        image.src = src;

        this.images[name] = image;
    }

    loadSound(src, name){
        let audio = new Audio();
        audio.src = src;
        this.sounds[name] = audio;
    }
}

class Game {
    constructor() {
        this.canvasElm = document.getElementById("gilderCanvas");
        this.canvas = new Canvas(this.canvasElm);
        this.loader = new Loader();
        this.state = 0;
        this.lastState = 0;
        /* 
        States are as follows: 
        0 - Main menu
        1 - Playing game 
        */

        // Menus
        this.menus = {
            main: document.getElementById("mainMenu"),
            pause: document.getElementById("pausedMenu"),
            game: document.getElementById("gameMenu")
        };
        this.info = {
            gameState: document.getElementById("gameState"),
        }
        this.activeMenu = this.menus.main;



        // Timer varaibles for frame info 
        this.lastTime = null;
        this.frameTime = 0;

        // Scenery 
        this.layerHeight = 60;
        this.layers = [ // Cloud Layers
            { //0
                ymin: 0,
                ymax: this.layerHeight,
                clouds: []
            },
            { //1
                ymin: this.layerHeight,
                ymax: this.layerHeight * 2,
                clouds: []

            },
            { //2
                ymin: this.layerHeight * 2,
                ymax: this.layerHeight * 3,
                clouds: []
            }
        ];
        this.maxClouds = 10;
        this.clouds = [];
        this.cloudFiles = ["cloud1", "cloud2", "cloud3", "cloud4"];

        // Tracking Mouse
        this.mx = 0;
        this.my = 0;

        // Game Vars
        this.level = 1;

        this.hpMax = 1000;
        this.hp = 1000;
        this.hpRegen = 0.01; 

        this.laserJuiceMax = 3000;
        this.laserJuice = 3000;
        this.laserDamage = 50;
       
        this.laserDrain = 18;
        this.laserRegen = 9;

        this.enemies = [];

        this.laser = false;
        this.drawLaser = false;

        this.hpBar = document.getElementsByClassName("healthBar")[0];
        this.hpBarValue = this.hpBar.getElementsByTagName("span")[0];

        this.laserBar = document.getElementsByClassName("laserBar")[0];
        this.laserBarValue = this.laserBar.getElementsByTagName("span")[0];

        this.addListeners();
        this.loadAssets();
        this.loop();
    }

    addListeners() {

        let startButton = document.getElementById("startGame");
        startButton.addEventListener("click", function () {
            console.log("Starting Game");
            this.changeState(1);

        }.bind(this));

        document.addEventListener("keypress", function (key) {
            console.log(key.key);
            let k = key.key;
            if (k == 'p' || k == "P") {
                console.log("P pressed");
                this.changeState(2);
            }

        }.bind(this));

        document.addEventListener("mousemove", function (event) {
            let rect = this.canvasElm.getBoundingClientRect();
            this.mx = event.clientX - rect.left;
            this.my = event.clientY - rect.top;

        }.bind(this));

        document.addEventListener("mousedown", function (event) {
            event.preventDefault();
            if(event.button == 0){
                // Left mouse
                this.laser = true;
            } else if(event.button == 2){
                // Right mouse
                this.fireMissiles();
            }
            
        }.bind(this));

        document.addEventListener("contextmenu", function(e){
            e.preventDefault();
        });

        document.addEventListener("mouseup", function () {
            if(this.laser){
                this.laser = false;
            }
        }.bind(this));

    }

    /*
    Todo, rewrite load logic to include a loading bar
    */
    loadAssets() {
        // Load all assets
        let loader = this.loader;
        loader.loadImage("assets/cloud1_compressed.png", "cloud1");
        loader.loadImage("assets/cloud2_compressed.png", "cloud2");
        loader.loadImage("assets/cloud3_compressed.png", "cloud3");
        loader.loadImage("assets/cloud4_compressed.png", "cloud4");
        loader.loadImage("assets/gildernosock.png", "gilderMain");
        loader.loadImage("assets/leftpupil.png", "leftp");
        loader.loadImage("assets/rightpupil.png", "rightp");
        loader.loadImage("assets/gilderleftsocket.png", "lefts");
        loader.loadImage("assets/gilderrightsocket.png", "rights");
        loader.loadSound("assets/sounds/jordan.ogg", "popsound");

    }

    changeState(state) {
        let clrMenu = function () {
            if (this.activeMenu !== null) {
                this.activeMenu.style.display = "none";
            }
            this.activeMenu = null;
            this.lastState = this.state;
            this.state = state;

        }.bind(this);
        //Handles switching menus.
        console.log("Changing state to: ", state);
        /* 
        1 - Menus should all dissappear, show game menus
        2 - Game should pause   
        */
        if (state == 1) {
            // Hide active menu
            clrMenu();
            this.menus.game.style.display = "flex";

        } else if (state == 2) {
            // PAUSE MENU SHOULDNT CLEAR MENUS IT SHOULD JUST DRAW OVER EVEYTHING 
            //Pause game
            if (this.state == 2) {
                // Already paused, we should return to previous state 
                this.menus.pause.style.display = "none";
                this.state = this.lastState;
            } else {
                //Show pause menu
                this.menus.pause.style.display = "flex";
                this.lastState = this.state;
                this.state = 2;
            }
        }
        this.info.gameState.innerHTML = this.state;
    }

    makeCloud() {
        // Pick a layer to place the cloud 
        let cloudLayers = this.layers;
        let min = null;
        let layer = null;
        for (let i in cloudLayers) {
            let numClouds = cloudLayers[i].clouds.length;
            if (min == null) {
                min = numClouds;
                layer = i;
            } else {
                if (cloudLayers[i].clouds.length < min) {
                    min = numClouds;
                    layer = i;
                }
            }
        }
        layer = cloudLayers[layer];
        // Layer index is stored. 
        let y = randomRange(layer.ymin, layer.ymax);
        // Need to pick image
        let image = randomArrayIndex(this.cloudFiles);
        image = this.loader.images[this.cloudFiles[image]];

        let x = randomRange(0, this.canvas.width);
        let dx = randomRange(0.05, 0.3);
        let cloud = new Cloud(image, x, y, dx, layer);
        layer.clouds.push(cloud);
        return cloud;
    }

    progressValue(bar, valueBar, value, max){
        // Update data label on bar, width on value.
        let percent = Math.floor((value / max) * 100);
        bar.dataset.label = percent + "%";
        valueBar.style.width = percent + "%";
    }

    chargeValue(value, charge, min, max){
        value += charge;
        if(value >= max){
            value = max;
        }
        if(value <= min){
            value = min;
        }
        return value;
    }

    fireMissiles(){
        // Should fire projectiles from eyes in direction of mouse
        console.log("Should fire missiles");
    }

    loop() {
        // Work out frame stuff
        let time = performance.now();

        if (this.lastTime != null) {
            // First frame
            let ft = time - this.lastTime;
            this.frameTime = ft;
            //console.log("Frame Time: ", ft);
        }
        this.lastTime = time;

        if (this.clouds.length < this.maxClouds) {
            // Make some clouds
            let cloud = this.makeCloud();
            this.clouds.push(cloud);
        }

        let random = Math.random();


        if(random <= 0.009){
            //RANDOM 
            if(this.enemies.length <= this.level * 40){
                this.enemies.push(new Enemy(this.level, this.canvas));
            }


            
        }


        // GAME LOOP (RESET, UPDATE, DRAW)

        if(this.state == 0 || this.state == 1){
            this.canvas.clear();
            let gilder = {
                face: this.loader.images.gilderMain,
                leftSocket: this.loader.images.lefts,
                rightSocket: this.loader.images.rights,
                leftPupil: this.loader.images.leftp,
                rightPupil: this.loader.images.rightp
            }
            this.canvas.drawScenery(this.clouds, gilder, this.mx, this.my, this.drawLaser, this.frameTime);
            for (let i in this.clouds) {
                let c = this.clouds[i];
                c.update();
                if (c.x <= 0 - c.image.width || c.x >= this.canvas.width + c.image.width) {
                    // Need to regenerate cloud
                    let image = randomArrayIndex(this.cloudFiles);
                    image = this.loader.images[this.cloudFiles[image]];
                    c.image = image;
                    c.dx *= -1;

                }
            }
        }
        if(this.state == 1){
           
            if(this.laser && this.laserJuice > 0){
                //Check if the mouse is inside an enemy, do damage to that enemy if so. 

                let mx = this.mx;
                let my = this.my;

                for(let enemy of this.enemies){
                    if(enemy.collides(mx, my)){
                        let damage = (this.frameTime / 1000) * this.laserDamage;
                        let dead = enemy.hurt(damage);
                        if(dead){
                            this.loader.sounds["popsound"].play();
                        }
                        
                    }
                }
            }

            for(let i = this.enemies.length - 1; i >= 0; i--){
                let enemy = this.enemies[i];
                if(enemy.alive){
                    enemy.move(this.frameTime);
                    enemy.draw(this.canvas.ctx);
                } else {
                    this.enemies.splice(i, 1);
                }

            }

            if(this.laser){
                this.laserJuice = this.chargeValue(this.laserJuice, -this.laserDrain, 0, this.laserJuiceMax);
            }
            if(this.laserJuice == 0){
                console.log("NO LASER");
            }
            
            if(this.laser && this.laserJuice == 0){
                this.drawLaser = false;
                this.laser = false;
            }
            if(this.laser && this.laserJuice > 0){
                this.drawLaser = true;
            }
            if(!this.laser){
                this.drawLaser = this.laser;
            }
            this.laserJuice = this.chargeValue(this.laserJuice, this.laserRegen, 0, this.laserJuiceMax);


            // Work out progress percents for progress bars
            this.progressValue(this.hpBar, this.hpBarValue, this.hp, this.hpMax);
            this.progressValue(this.laserBar, this.laserBarValue, this.laserJuice, this.laserJuiceMax);
           
        }



        window.requestAnimationFrame(this.loop.bind(this));
    }
}

// Not sure if we should define the face as a new object 



class Canvas {
    // Want a 4:3 aspect ratio really
    // Class for canvas, handles resizing, drawing. 
    constructor(canvasElm) {
        console.log("Making Canvas");
        this.widthToHeight = 16 / 9;
        this.canvas = canvasElm;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.faceX = 20;
        this.faceY = 0;

        this.leftEye = [27, 12];
        this.rightEye = [125, 10];

        this.grad1 = new Gradient(this.ctx);
        this.grad2 = new Gradient(this.ctx);
        this.grad2.duration *= 0.6;



        this.resizeCanvas();
        this.setListeners();
    }

    resizeCanvas() {


        let newHeight = document.getElementsByClassName("gameWrapper")[0].clientHeight;
        let newWidth = document.getElementsByClassName("gameWrapper")[0].clientWidth;
        console.log("Container width: ", newWidth, " he  ight: ", newHeight);
        let newWidthToHeight = newWidth / newHeight;

        let width, height;
        if (newWidthToHeight > this.widthToHeight) {
            //Width is too wide
            width = newHeight * this.widthToHeight;
            height = newHeight;
        } else {
            // Height is too high
            height = newWidth / this.widthToHeight;
            width = newWidth;
        }
        console.log("canvas width: ", width, "height: ", height);


        let hPadding = newHeight - height;
        let wPadding = newWidth - width;
        console.log("HPadding: ", hPadding, " WPadding: ", wPadding);

        let gameArea = document.getElementsByClassName("gameArea")[0];
        //gameArea.style.marginTop  = (hPadding/ 2) + 'px';
        //gameArea.style.marginLeft = (wPadding / 2) + 'px';
        gameArea.style.width = width + "px";
        gameArea.style.height = height + "px";


        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;

    }
    setListeners() {
        window.addEventListener("resize", function () {
            // Need to redraw canvas stuff probably. 
            this.resizeCanvas();
        }.bind(this));
    }

    clear() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawCircle(x, y, rad) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.stroke();
    }

    circCollisions(a, b, r, m, c) {
        // Circle: (x - a)^2 + (y - b)^2 = r^2
        // Line: y = m * x + c
        // r: circle radius
        // a: x value of circle center
        // b: y value of circle center
        // m: line gradient
        // c: y intercept
        let A = 1 + Math.pow(m, 2);
        let B = -a * 2 + (m * (c - b)) * 2;
        let C = Math.pow(a, 2) - Math.pow(r, 2) + Math.pow((c - b), 2);

        let D = Math.pow(B, 2) - 4 * A * C;
        if (D >= 0) {
            // There are intersections
            let i1 = (-B + Math.sqrt(D)) / (2 * A);
            let i2 = (-B - Math.sqrt(D)) / (2 * A);
            let dist1 = Math.abs(this.mx - i1);
            let dist2 = Math.abs(this.mx - i2);
            let inters = [];

            // Return the closest intersection to the mouse
            if (dist1 < dist2) {
                inters = i1;
            } else {
                inters = i2;
            }
            if (D == 0) {
                return inters[0];
            }
            return inters;
        }
        // No intersections
        return [];
    }

    getCollisions(circleBounds, mx, my) {
        // Returns {x:, y:} coords to draw a pupil

        // Work out equation of line from eye bounds center to mouse
        let dy = my - circleBounds.y;
        let dx = mx - circleBounds.x;
        let m = dy / dx;
        let c = my - (m * mx);

        this.mx = mx;
        this.my = my;

        // Work out intersections between the line and the circle bounds
        let intersections = this.circCollisions(circleBounds.x, circleBounds.y, circleBounds.r, m, c);
        // This returns the x value of the closes line/circle intersection

        if (intersections !== null) {
            // Work out unit vector
            let magnitude = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
            let vx = (1 / magnitude) * dx;
            let vy = (1 / magnitude) * dy;

            let pupilDiameter = 20;
            // Times the unit vectors by the approx pupil diameter to get x/y distance away from the intercept to draw
            let xdist = pupilDiameter * vx;
            let ydist = pupilDiameter * vy;

            let x = intersections - xdist;
            let y = ((intersections * m) + c) - ydist;

            return {x: x, y: y};
        }
        // For some reason, we could not find circle/line intersections
        return null;
        
    }

    drawClouds(clouds) {
        for (let i in clouds) {
            let c = clouds[i];
            this.ctx.drawImage(c.image, c.x, c.y, c.image.width, c.image.height);
        }
    }

    drawFace(faceX, faceY, gilder, LEB, REB, LP, RP) {

        this.ctx.drawImage(
            gilder.leftSocket,
            LEB.x - gilder.leftSocket.width / 2,
            LEB.y - gilder.leftSocket.height / 2
        );

        this.ctx.drawImage(gilder.rightSocket,
            REB.x - gilder.rightSocket.width / 2,
            REB.y - gilder.rightSocket.height / 2
        );

        this.ctx.drawImage(
            gilder.leftPupil,
            LP.x - gilder.leftPupil.width / 2,
            LP.y - gilder.leftPupil.height / 2
        );

        this.ctx.drawImage(
            gilder.rightPupil,
            RP.x - gilder.rightPupil.width / 2,
            RP.y - gilder.rightPupil.height / 2
        );

        this.ctx.drawImage(gilder.face, faceX, faceY);
    }

    getLaserAngle(circle, mx, my){
        let dy = my - circle.y;
        let dx = mx - circle.x;
        let m = dy / dx;
        let angle = Math.atan2(dy, dx);
        let magnitude = Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
        return {angle: angle, length: magnitude};
    }


    drawScenery(clouds, gilder, mx, my, laser, frameTime) {
        /* 
        This is all structured a bit weird. 
        We need to:
        1 - Draw the clouds. 
        2 - Work out where to draw pupils
        3 - Work out where to draw laser
        4 - Draw face and pupils
        5 - Draw laser
        */

        // Clouds
        this.drawClouds(clouds);

        // Work out where to draw face
        let faceX = 20;
        let faceY = this.height - gilder.face.height - 60;
        let eyeLevel = gilder.face.height / 2.15;
        let eyeStart = gilder.face.width / 2.5;

        // Work out where to draw pupils

        /* 
        Pupils are bounded by a circle that closly matches the eye socket size, 
        We make a line from the center of the circle to the mouse and find the intercept. 
        The closest intercept is used as the point to draw the pupil. 
        */
        let leftEyeBounds = {
            x: faceX + eyeStart + this.leftEye[0],
            y: faceY + eyeLevel + this.leftEye[1],
            r: 28
        };
        let rightEyeBounds = {
            x: faceX + eyeStart + this.rightEye[0],
            y: faceY + eyeLevel + this.rightEye[1],
            r: 28
        }
        let leftPupil = this.getCollisions(leftEyeBounds, mx, my);
        let rightPupil = this.getCollisions(rightEyeBounds, mx, my);

        if(leftPupil !== null){
            this.drawCircle(leftPupil.x, leftPupil.y, 5);
        }
        if(rightPupil !== null){
            this.drawCircle(rightPupil.x, rightPupil.y - 5, 5);
        }



        //Draw face
        this.drawFace(faceX, faceY, gilder, leftEyeBounds, rightEyeBounds, leftPupil, rightPupil);

        //Draw laser
        
        if(laser){

            let leftLaser = this.getLaserAngle(leftEyeBounds, mx, my);
            leftLaser.x = leftPupil.x;
            leftLaser.y = leftPupil.y + 5;
            leftLaser.gradient = this.grad1;
            let rightLaser = this.getLaserAngle(rightEyeBounds, mx, my);  
            rightLaser.x = rightPupil.x;
            rightLaser.y = rightPupil.y + 5;
            rightLaser.gradient = this.grad2;

            this.drawLaserTest(leftLaser, frameTime);
            this.drawLaserTest(rightLaser, frameTime);
            //this.drawLaser(rightLaser, frameTime);

        }

        this.drawCircle(mx, my, 1);
    }


    drawLaser(laser, ft){
        this.ctx.translate(laser.x, laser.y - 5);
        let gradient = laser.gradient;
        gradient.width = laser.length;
        gradient.height = 10;
        gradient.stepGradient(ft);
        gradient.makeGradient();
        this.ctx.fillStyle = gradient.gradient;
        this.ctx.rotate(laser.angle);
        this.ctx.fillRect(0, 0, laser.length, 10);
        this.ctx.resetTransform();
    }

    // PROBABLY BETTER TO USE THIS AND NOT CALC ANGLE 
    drawLaserTest(laser, ft){
        this.ctx.beginPath();
        this.ctx.moveTo(laser.x, laser.y - 5);
        this.ctx.lineTo(this.mx, this.my);
        this.ctx.lineWidth = 10;

        let gradient = laser.gradient;
        gradient.width = laser.length;
        gradient.height = 10;
        gradient.stepGradient(ft);
        gradient.makeGradient();



        this.ctx.strokeStyle = gradient.gradient;
        this.ctx.stroke();
    }

}

class Gradient{
    constructor(ctx){
        this.ctx = ctx;
        this.colours = ["#990033", "#ef0050"];
        this.duration = 10000; 
        this.step = 0;
        this.percent = this.step / this.duration;
        this.gradient;
        this.width, this.height;
    }
    stepGradient(ft){
        
        this.step += ft;
        if(this.step >= this.duration){
            this.step =     0;
        }
        this.percent = this.step / this.duration;
       
    }

    makeGradient(){
        let gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, this.colours[0]);
        gradient.addColorStop(1, this.colours[0]);

        let middle = this.percent;
        let upper = this.percent + 0.13;
        let lower = this.percent - 0.15;

        
        gradient.addColorStop(middle, this.colours[1]);
        if(upper <= 1){
            gradient.addColorStop(upper, this.colours[0]);
        }
        if(lower >= 0){
            gradient.addColorStop(lower, this.colours[0]);
        }
        

  

        // if(lower >= 0){
        //     gradient.addColorStop(lower, this.colours[1]);
        // }
        // if(higher <= 1){
        //     gradient.addColorStop(higher, this.colours[1]);
        // }

        
        this.gradient = gradient;

    }


}