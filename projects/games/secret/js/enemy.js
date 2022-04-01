class Enemy{
    constructor(level, canvas){
        this.canvas = canvas;
        this.level = level;

        this.x = 0;
        this.dx;
        this.dy;
        this.y = 0;
        this.upperY;
        this.lowerY;
        this.yAcc = 0.5;
        

        this.maxHp;
        this.hp;
        this.hpr;
        this.damage; 
        this.sprite;   
        this.radius = 20;
        this.hpWidth = 40;
        this.hpHeight = 9;
        this.generate();
        this.color = "black";
        this.alive = true;

        this.accelerate = false;
        this.acceleration = 0.5;
    }

    move(ft){
        // Need to x and y need to bound by canvas height / width

        let xDist = this.dx * (ft / 1000);
        let yDist = this.dy * (ft / 1000);

        this.x += xDist;
        if(this.x <= 0){
            this.alive = false;
        }
       
        // Upper Y is above, Lower Y is below

        if(this.y + yDist <= this.upperY){
            this.dy = -this.dy;
            
        }
        if(this.y + yDist >= this.lowerY){
            this.dy = -this.dy;
            
        }
        this.y += yDist;


        /* 
        If we are within a certain distance of the head, we need to stop oscillating and vector directly at it.
        */


    



       

    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.beginPath();
    

        if(this.hp < this.maxHp){
            this.drawHP(ctx);
        }
        
    }

    hurt(amount){
        this.hp -= amount;
        if(this.hp <= 0){
            // Enemy is dead, should also play death effect
            this.alive = false;
            return true;
        }
        return false;
    }


    drawHP(ctx){
        // Draw a black rect, then draw a hp rect over it
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x - (this.hpWidth / 2), this.y - (this.hpHeight * 4), this.hpWidth, this.hpHeight);
        let hpPercent = this.hp / this.maxHp;
        let hpWidth = this.hpWidth * hpPercent;
        ctx.fillStyle = "#84372e";
        ctx.fillRect(this.x - (this.hpWidth / 2), this.y - (this.hpHeight * 4), hpWidth, this.hpHeight);

    }



    collides(mouseX, mouseY){
        // Check that distance from mx, my to thisx, thisy is less than radius. 
        let distance = Math.sqrt( Math.pow(this.x - mouseX, 2) + Math.pow(this.y - mouseY, 2));
        if(distance <= this.radius){
            this.color = "yellow";
            return true;
        }
        this.color = "black";
        return false;
    }



    generate(){

        this.x = this.canvas.width + (this.radius * randomRange(1, 3));
        this.y = randomRange(0 + (this.radius * 2), this.canvas.height);
        this.upperY = this.y - (this.y * 0.5);
        if(this.upperY <= 0){
            this.upperY = 0;
        }


        this.lowerY = this.y + (this.y * 0.5);
        if(this.lowerY >= this.canvas.height){
            this.lowerY = this.canvas.height;
        }



        this.dx = -randomRange(10, 22);
        this.dy = randomRange(20, randomRange(30, 60), 1);
    

        // console.log("X: ", this.x);
        // console.log("DX: ", this.dx);
        // Generates health, hpr, movespeed, damage based on level
        if(this.level == 1){
            this.maxHp = randomRange(100, 200);
        } else if(this.level == 2){
            this.maxHp = randomRange(200, 400);
        } else if(this.level == 3){
            this.maxHp = randomRange(400, 800);
        } else if(this.level == 4){
            this.maxHp = randomRange(800, 1000);
        } else if(this.level == 5){
            this.maxHp = randomRange(1000, 1100);
        } else {
            this.maxHp = randomRange(5000, 8000);
        }
        this.hp = randomRange(1, this.maxHp);
        this.hpr = this.maxHp * 0.01;
        this.damage = this.hp * (randomRange(0.02, 0.4));


    }
}