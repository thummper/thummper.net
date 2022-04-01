class Game{
    constructor(canvas){

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        //Game vars
        this.movex = 0;
        this.movey = 0;
        this.foodList = [];
        this.gameState = 1;
        this.move = 0;
        this.resButtons = false;
        this.snake = {
            scale: 14,
            xspeed: 1,
            yspeed: 0, 
            length: 1,
            x: 350,
            y: 294
        };
        this.tail = [
            [this.snake.x, this.snake.y]
        ];
        this.gameLoop;
        this.effects = [];
        this.gameTime = 0;
        this.statistics = [];

        this.difficulty = 50;
        this.score = 0;

        // Elements on the menus with dynamic content
        this.diffDisplay = document.getElementsByClassName("difficulty")[0];
        // States as follow: 1 - main menu, 2 - playing, 3 - paused, 4 - gave over

        this.state = 1;
        this.prevState = null;
        this.lastTime = null;
        this.timer = 0;

        // References to menus 
        this.main = document.getElementsByClassName("main")[0];
        this.paused = document.getElementsByClassName("paused")[0];
        this.over = document.getElementsByClassName("over")[0];
        this.scoreHolder = document.getElementsByClassName("score-holder")[0];
        this.states = [];
        this.states[1] = this.main;
        this.states[3] = this.paused;
        this.states[4] = this.over;
        this.chart = null;
        this.chartOptions = null;

    }
    init(){
        //Set everything up
        this.addListeners();
        this.setupCanvas();
        this.initCharts();
        this.makeFood();
        
        this.loop();
    }

    getDifficulty(diffNumber){
        this.difficulty = diffNumber;
        console.log("Diff Number: ", diffNumber);
        let diffString = "NULL";
        if(diffNumber <= 30){
            diffString = "Easy";
        } else if(diffNumber <= 70){
            diffString = "Medium";
        } else if(diffNumber <= 100 ){
            diffString = "Hard";
        }
        return diffString;

    }

    addListeners(){

        document.getElementsByClassName("reset")[0].addEventListener("click", function(){
            // Reset game and go to main menu. 
            this.reset();
            this.switchState(1);
        }.bind(this));

        document.getElementsByClassName("start")[0].addEventListener("click", function(evt){
            console.log("Start button pressed, should start game");
            this.switchState(2); // Switch to playing 
        }.bind(this));

        document.getElementsByClassName("diff-slider")[0].addEventListener("input", function(e){
            let selDiff = e.target.value;
            let difficulty = this.getDifficulty(selDiff);
            this.diffDisplay.innerHTML = difficulty;  
        }.bind(this));

        document.addEventListener('keydown', function(e){
            let kc = e.keyCode;
            if(kc == 87 || kc == 38){
                //Up
                if(this.snake.yspeed != 1){
                    //Not going down.
                    this.snake.yspeed = -1;
                    this.snake.xspeed = 0;
                }
            } else if(kc == 68 || kc == 39){
                //Right
                if(this.snake.xspeed != -1){
                    this.snake.xspeed = 1;
                    this.snake.yspeed = 0;
                }
                
            } else if(kc == 83 || kc == 40){
                //Down
                if(this.snake.yspeed != -1){
                    this.snake.yspeed = 1;
                    this.snake.xspeed = 0;
                }
            } else if(kc == 65 || kc == 37){
                //Left
                if(this.snake.xspeed != 1){
                    this.snake.xspeed = -1;
                    this.snake.yspeed = 0;
                }
            } else if(kc == 80){
                console.log("Pause button pressed");
                this.switchState(3); // switch to pause 

            } else if(kc == 82){
                //Reset
                this.reset();
            }
        }.bind(this));
    }

    clearMenus(){
        let menus = this.states; 
        for(let key in menus){
            let menu = this.states[key];
            menu.style.display = "none";
            menu.style.zIndex = "-3";

        }
    }

    showMenu(menus, state){
        let menu = menus[state];
        console.log("state");
        console.log("menu: ", menu);
        menu.style.display = "flex";
        menu.style.zIndex = "10";
        this.prevState = this.state;
        this.state = state;
    }

    switchState(state){
        //Switch to new state, should change gamestate and possibly canvas layer 
        // States as follow: 1 - main menu, 2 - playing, 3 - paused, 4 - gave over
        console.log("Attempting switch to: ", state);
        let menus = this.states;
        this.clearMenus();

        if(state == 1){
            // switch to main menu
            this.showMenu(menus, state); 


        } else if(state == 2){
            // switch to playing 
            this.prevState = this.state;
            this.state = state;
          


        } else if(state == 3){
            // switch to pause screen
            if(this.state == 3){
                if(this.prevState != null){
                    this.switchState(this.prevState);
                } else {
                    this.switchState(2);
                }
             
            } else {
                this.showMenu(menus, state); 

            }
        } else if(state == 4){
            // switch to game over
            this.statistics.push( [Math.round(this.gameTime / 1000), this.score] );
            console.log(this.statistics);
           
            this.updateChart();
            //Should store gametime and score in an array
            this.showMenu(menus, state); 
        }
    }

    initCharts(){
        this.chart = echarts.init(document.getElementById("score-time-chart"));
      
        let options = {
            title: {
                text: "Score / Game Time",
                left: "center",
            },
            xAxis: {},
            yAxis: {},
            series: [{
                symbolSize: 20,
                data: this.statistics,
                type: 'scatter'
            }]
        };
        
        this.chartOptions = options;
        this.chart.setOption(options);
    }

    updateChart(){
        // Update series?
        this.chart.setOption(this.chartOptions);
    }

    
    reset(){
        //Reset game.
        this.movex = 0;
        this.movey = 0;
        this.foodList = [];
        this.gameState = 1;
        this.mousex;
        this.mousey;
        this.score = 0;
        this.move = 0;
        this.gameTime = 0;
        this.resButtons = false;
        this.snake = {
            scale: 14,
            xspeed: 1,
            yspeed: 0, 
            length: 1,
            x: 350,
            y: 294
        };
        this.tail = [
            [this.snake.x, this.snake.y]
        ];
    }
    //Makes x pieces of food
    makeFood(){
        let food = new Food();
        food.pickLocation(this.canvas.width, this.canvas.height);
        this.foodList.push(food);
    }

    setupCanvas(){
        console.log("Setting up canvas");
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        //Scale canvas width / height
        window.addEventListener("resize", function(){
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;

            if(this.chart !== null){
                this.chart.resize();
            }
            console.log("Canvas resized");

            if(this.canvas.width < 300){
                console.log("Window is too small to play");
            }


        }.bind(this));
    }

    loop(){

        let time = performance.now();
        let lastTime = this.lastTime;
        if(this.lastTime == null){
            lastTime = time;
        }
        let timePassed = time - lastTime;
        this.lastTime = time; 
        this.gameTime += timePassed;
        this.timer += timePassed; 
        let moveTime = 110 - (this.difficulty * 0.3);
        
        if(this.timer >= moveTime){
            this.timer = 0;
            if(this.state == 2){
                // Game is playing
                if(this.foodList.length <= 4){
                    this.makeFood();
                }
                //Do normal game things
                this.clearScreen();
                this.snakeEat();
                this.drawFood();
                this.drawEffects();
                this.drawSnake();
                this.moveSnake();
            }
        }

        // Time since last frame in ms 
        window.requestAnimationFrame(this.loop.bind(this));
    }

    clearScreen(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    snakeEat(){
        //Handles collision for food, increases snake length and deletes old food.
        for(let i = 0, j = this.tail.length; i < j; i++){
            let block = this.tail[i];
            let x = block[0];
            let y = block[1];
            let len = this.foodList.length - 1;
            for(let a = len; a >= 0; a--){
                let food = this.foodList[a];
                if(food.x == x && food.y == y){
                    // Snake has eaten food
                    this.effects.push({type: "text", value: "+1", age: 0, life: 10, random: 2, x: x, y: y, delete: false}); 
                    this.snake.length++;
                    this.score++;
                    this.scoreHolder.innerHTML = "Score: " + this.score;
                    this.foodList.splice(a, 1);
                }
            }	
        }
    }
    drawFood(){	
        for(let i = 0, j = this.foodList.length; i < j; i++){
            let food = this.foodList[i];
            this.drawRect(food.x, food.y, 'red', this.snake.scale);
        }
    }

    drawText(x, y, color, value, opacity){
        this.ctx.fillStyle = color + opacity + ")";
        this.ctx.font = "26px Arial";
        this.ctx.fillText(value, x, y);
    }

    drawEffects(){
        for(let i = this.effects.length - 1; i >= 0; i--){
            let effect = this.effects[i];
            if(effect.delete){
                this.effects.splice(i, 1);
                continue;
            } else {
               
                let x = effect.x + (effect.age * effect.random);
                let y = effect.y - (effect.age * effect.random);
                let opacity = (1 * (effect.life / (effect.age + 1))) / effect.life;
                this.drawText(x, y, "rgba(0, 0, 0, ", effect.value, opacity);
                effect.age++; 
                if(effect.age >= effect.life){
                    effect.delete = true;
                }
            }
        }
    }

    drawSnake(){
        let snake = this.snake;
        let tail = this.tail;
        for(let i = 0; i < snake.length; i++){
            let x = tail[i][0];
            let y = tail[i][1];
            if(i == 0){
                this.drawRect(x, y, "black", snake.scale);
                let direction = this.snakeDir();
                if(direction == "U"){
                    //Eyes facing up.
                    this.drawRect(x + 3, y + 1, 'white', 2);
                    this.drawRect(x + 9, y + 1, 'white', 2);
                } else if(direction == "D"){
                    //Eyes facing down
                    this.drawRect(x + 3, y + 10, 'white', 2);
                    this.drawRect(x + 9, y + 10, 'white', 2);
                } else if(direction == "L"){
                    //Eyes facing left
                    this.drawRect(x + 1, y + 3, 'white', 2);
                    this.drawRect(x + 1, y + 9, 'white', 2);
                } else if(direction == "R"){
                    this.drawRect(x + 10, y + 3, 'white', 2);
                    this.drawRect(x + 10, y + 9, 'white', 2);
                }
            } else {
                this.drawRect(x, y, 'black', snake.scale);
            }
        }	
    }

    drawRect(x, y, col, size){
        this.ctx.fillStyle = col;
        this.ctx.rect(x, y, size, size);
        this.ctx.fill();
        this.ctx.beginPath();   
    }

    snakeDir(){
        let dir = null;
        if(this.snake.yspeed == -1){
            //Snake is going update
            return "U";
        }
        if(this.snake.yspeed == 1){
            //Snake is going down 
            return "D";
        }
        if(this.snake.xspeed == 1){
            //Snake is going right
            return "R";
        }
        if(this.snake.xspeed == -1){
            //Snake is going left
            return "L";
        }
    }

    moveSnake(){
        let snake = this.snake;
        if((snake.x + (snake.xspeed * snake.scale)) > this.canvas.width - 14 || (snake.x + (snake.xspeed * snake.scale ))< 0){
           //Hit a wall.
           console.log("Hit left or right");
           this.switchState(4);
           this.gameState = 2;
           } else if(snake.y + (snake.yspeed * snake.scale) < 0 || snake.y + (snake.yspeed * snake.scale) > this.canvas.height - 14){
               //Hit a wall
               this.switchState(4);
               console.log("Hit top or bottom");
           } else {
               //Didn't hit a wall.
               snake.x += snake.xspeed * snake.scale;
               snake.y += snake.yspeed * snake.scale;
               this.shiftSnake();
           }
    }
    shiftSnake(){
        //Move all values in the tail array by one
        this.tail.unshift([this.snake.x, this.snake.y]);
        
    }
}

class Tabs{
    constructor(buttonHolder, tabHolder){
        this.buttonHolder = buttonHolder;
        this.tabHolder = tabHolder;
        this.buttons, this.tabs;
 
        this.init();
        
    }
    init(){
        let buttons = this.buttonHolder.getElementsByClassName("tab-button");
        this.buttons = buttons;
        let tabs = this.tabHolder.getElementsByClassName("tab");
        this.tabs = tabs;
        for(let button of buttons){
            button.addEventListener("click", function(event){
                let tabPressed = event.target.dataset.tab;
                this.activeTab(tabPressed);
            }.bind(this));
        }
    }
    activeTab(tabID){
        let tabs = this.tabs;
        for(let tab of tabs){
            tab.style.visibility = "hidden";
            let id = tab.id;
            if(id == tabID){
                tab.style.visibility = "visible";
            }
        }
        let buttons = this.buttons;
        for(let button of buttons){
            if(button.dataset.tab == tabID){
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        }
    }
}







window.addEventListener("load", function(e){
    console.log("Making tabs");
    let game = new Game(document.getElementById('scanvas'));
    let tabs = new Tabs(document.getElementsByClassName("tabs")[0], document.getElementsByClassName("tab-holder")[0]);
    game.init();
});





