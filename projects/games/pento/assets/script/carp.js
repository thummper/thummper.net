//Global pieces array [Z, '#D88642'], [X, '#208D99'], [I, '#4A3F4F']
let pieces = [
	[P, '#71B3B0', 22],
	[F, '#D55A4C', 14],
	[Y, '#F5994E', 14],
	[L, '#8B2134', 8],
	[N, '#D6BB50', 8],
	[T, '#961628', 7],
	[W, '#1D6D53', 4],
	[U, '#21746C', 4],
	[V, '#2CAD7D', 4],
	[Z, '#c23616', 4],
	[X, '#a22d6c', 2],
	[I, '#551b8c', 2]
];

let kong;
kongregateAPI.loadAPI(function(){
	window.kongregate = kongregateAPI.getAPI();
});




class Game {
	constructor() {
		//Game Variables
		this.tileSize = 21;
		this.holeSize = 12;
		this.shapes = [];
		this.holes = [];
		this.dragShape = null;

		//Main game grid is boardsize * boardsize
		this.boardSize = 32;
		this.boardWidth = 0;
		this.boardHeight = 0;
		this.board = [];
		this.holder;
		this.levelWrapper = document.getElementById("levelWrapper");

		//Other Variables
		this.framesTime;
		this.FPS = 0;
		this.frames = 0;
		this.lastFrame = 0;
		this.frameTime = 0;

		this.canvas;
		this.ctx;
		this.mx = 0;
		this.my = 0;

		this.xPadding;
		this.yPadding;
		this.spawnShapes = false;

		//Hole & Levels
		this.level = 0;
		this.holeDifficulty = 3;

		this.holesToFill = 4;
		this.levelIncrement = 1;
		this.levelScoreBonus = 20;



		this.holeLevel = 10;
		this.holesFilled = 0;
		this.maxHoles = 8;
		this.maxHolders = 4;

		//Score stuff
		this.ticker = 0;
		this.combo = 0;
		this.totalScore = 0;
		this.scoreTracker = 0;
		this.pastScores = [];
		this.floatingText = []; //Holds any floating text on the screen.
		this.maxCombo = 0;
		this.maxAverage = 0;

		//Average 
		this.holeScores = [];
		this.averageScores = [];
		this.comboScore = [];

		this.graphInfo = [
			{
				element: document.getElementById("comboGraph"),
				title  : "Average Score & Combo",
				yAxis  : [
					{
						type: 'value',
					},
					{
						type: 'value',
						min: 0,
						max: 100
					}
				],
				xAxis  : [
					{
						
						type: 'category',
						d: this.comboScore,
					}
				],
				series : [
					{
						type: 'bar',
						d: this.comboScore,
						yAxisIndex: 1
					},
					{
						type: 'line',
						d: this.averageScores
					}
				]
			}
		]



		this.graphs = [];
		this.menus = {
			main: document.getElementById("mainMenu"),
			stats: document.getElementById("statsMenu"),
			game: document.getElementById("gameMenu"),
		};
		

	}






	getHoverShape(){
		let shapes = this.shapes; 
		for(let i = 0; i < shapes.length; i++){
			// Mouse In takes a cell, make a temp one.
			let shape  = shapes[i];
			let x = shape.x * this.tileSize;
			let y = shape.y * this.tileSize;
			let width  = shape.width * this.tileSize;
			let height = shape.height * this.tileSize;
			if(this.mouseInGeneral(x, y, width, height)){
				// Mouse is in general area of shape.
				let blocks = shape.blocks;
				for(let j = 0; j < blocks.length; j++){
					let block = blocks[j];
					if(this.mouseIn(block) && shape.dropInc){
						block.dragging = true;
						shape.dragging = true;
						this.dragShape = shape;
						this.shapes.splice(i, 1);
						return;
					}
				}
			}
		}
	}

	showTutorial(){
		let tutorial = document.getElementById("tutorialWindow");
		tutorial.style.display = "block";
		let w = tutorial.offsetWidth;
		let h = tutorial.offsetHeight;


		let cw = this.canvas.width * 0.12;
		let ch = this.canvas.height * 0.25;

		tutorial.style.top =  (ch - (h/2)) + "px";
		tutorial.style.left = (cw) + "px";

		


		// Work out x and y to display in center.
		
	}

	handleMouse(){
		if(this.leftClick){
			this.leftClick = false;
			if (this.dragShape == null) {
				// Find the shape we are hovering and pick it up.
				this.getHoverShape();
			} else {
				// Dragging something.
				let shape = this.dragShape;
				shape.checkBounds(this.boardWidth, this.boardHeight);
				shape.checkPlace(this.board, this.holder);
				if(shape.canPlace){
					// We ARE placing a shape here, so either a hole gets the shape, or it doesnt and should increment it's decay counters
					for(let i = 0; i < this.holes.length; i++){
						let hole = this.holes[i];
						if(hole.checkBounds(shape)){
							if(shape.placeIncrement){
								hole.placed(shape);
							}
							this.trySpawn = true;
						} else {
							if(shape.placeIncrement){
								hole.placed(null);
							}
						}
					}
					this.shapes.push(shape);
					this.dragShape = null;
				}
			}
		}

	}


	addListeners() {
		let startButton = document.getElementById("startGame");
		startButton.addEventListener("click", function(){
			this.changeState("game");
			// If start button is pressed first time show tutorial.
			this.showTutorial();


		}.bind(this));



		window.addEventListener("resize", function () {
			this.resizeCanvas();
		}.bind(this));

		window.addEventListener("mousemove", function (event) {
			let rect = this.canvas.getBoundingClientRect();
			this.mx = event.clientX - rect.left;
			this.my = event.clientY - rect.top;

		}.bind(this));

		window.addEventListener("contextmenu", function (event) {
			event.preventDefault();
			event.stopPropagation();
		}.bind(this));

		window.addEventListener("mousedown", function (event) {
			//Left click
			if (event.button == 0) {
				this.leftClick = true;
			} else {
				//Right button
				if (this.dragShape != null) {
					this.dragShape.mirror();
				}
			}
		}.bind(this));

		window.addEventListener("keydown", function (event) {
			let kc = event.keyCode;
			if (kc == 65) {
				//Scroll 
				this.scroll(true);
			}
			if (kc == 90) {
				//Scroll
				this.scroll(false);
			}

			if(kc == 80){
				//P pressed 
				if(this.menuHandler.activeMenu == this.menus.stats){
					this.menuHandler.changeState("game");
				} else {
					this.menuHandler.changeState("stats");
					this.updateGraphs();
				
				}


			}
		}.bind(this));

		window.addEventListener("mousewheel", this.wheelHandler.bind(this), { passive: false });
		window.addEventListener("wheel", this.wheelHandler.bind(this), { passive: false });
	}

	wheelHandler(event){
		event.preventDefault();
		let direction = false;
		if (event.deltaY < 0) {
			direction = true;
		}
		this.scroll(direction);

	}

	scroll(direction) {
		//Will scroll based on boolean value
		if (this.dragShape != null) {
			this.dragShape.scroll(direction);
		}
	}


	resizeCanvas() {
		// Remake everything canvas related.
		console.log("Resizing Canvas");
		this.shapes = [];
		this.canvas.width  = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		let wrapper = document.getElementsByClassName("game")[0];
		

		// So need to make this Kongregate friendly
		let maxWidth = 960;
		let maxHeight = 700;
		//wrapper.style.width = maxWidth + "px";
		//this.canvas.width = maxWidth;
		//wrapper.style.height = maxHeight + "px";
		//this.canvas.height = maxHeight;
		

		console.log("W: ", this.canvas.width, " H: ", this.canvas.height);



		let wCells = Math.floor(this.canvas.width  / this.tileSize);
		let hCells = Math.floor(this.canvas.height / this.tileSize);

		this.boardWidth  = wCells;
		this.boardHeight = hCells;

		this.holder = null;

		this.makeBoard();
		this.makeHolder();
		this.makeShapeHoles();

	}

	makeBoard() {
		this.board = [];
		for (let row = 0; row < this.boardHeight; row++) {
			this.board[row] = [];
			for (let col = 0; col < this.boardWidth; col++) {
				this.board[row][col] = {
					x: (col * this.tileSize),
					y: (row * this.tileSize),
					contains: []
				};
			}
		}
	}


	initLevelDisplay(){
		this.levelWrapper.innerHTML = "";
		for(let i = 0; i < this.holesToFill; i++){
			let starOutline = document.createElement("img");
			starOutline.classList.add("levelIndicator");
			starOutline.src = "assets/images/staroutline.png";
			this.levelWrapper.append(starOutline);
		}
	}

	updateLevelDisplay(){
		for(let i = 0; i < this.holesFilled; i++){
			let stars = document.getElementsByClassName("levelIndicator");
			stars[i].src = "assets/images/starFilled.png"
		}

	}


	makeHolder() {
		// Work out how many holders we can fit onto the board, and make them (with a max of 4).
		this.holder = null;
		let boardWidth = this.boardWidth;
		let nHoles = Math.floor(boardWidth / 7);
		if(nHoles > this.maxHolders){
			nHoles = this.maxHolders;
		}
		// Hole is 5 blocks + 2 blocks padding on left side.
		this.initLevelDisplay();
		this.levelWrapper.style.marginBottom = (this.tileSize * 1.3) + "px";
		let holder = new Holder(this.canvas, this.ctx, this.tileSize, nHoles, this.boardWidth, this.boardHeight);
		holder.makeSpaces();
		this.holder = holder;
		let newShapes = this.holder.trySpawn();
		this.shapes = this.shapes.concat(newShapes);
	}

	makeShapeHoles() {


		// This is broken
		this.holes = [];
		let minX = 0;
		let maxX = this.boardWidth;
		let minY = 0;
		let maxY = this.boardHeight - 6;

		let nRows = Math.floor((maxY - minY) / (this.holeSize + 1));
		let nCols = Math.floor((maxX - minX) / (this.holeSize + 1));



		// Problem - nCols and nRows needs to represent maxHoles.


		// Holes per row = max width / hole size

		let boardSpace = nRows * nCols; //The number of holes we can fit.
		console.log("Board Space: ", boardSpace, " Max Holes: ", this.maxHoles);
		if(nCols > this.maxHoles){
			// More column space than we need. 
			nCols = this.maxHoles;
		}
		if(this.maxHoles > boardSpace){
			this.maxHoles = boardSpace;
		}
		if(this.maxHoles < boardSpace){
			// This is the issue. 

			/* 
				We need to generate ncols/nrows so that we evenly distribute our holes over the rows and columns.
			*/
			boardSpace = this.maxHoles;
		}




		let xTaken = nCols * (this.holeSize + 1);
		let yTaken = nRows * (this.holeSize + 1);
		let xRemainder = this.boardWidth - xTaken;
		let yRemainder = this.boardHeight - yTaken;

		let xPadding = Math.floor(xRemainder / 2);
		let yPadding = Math.floor(yRemainder / 2);

		let x = minX + xPadding;
		let y = minY + yPadding;


		for(let i = 0; i < nRows; i++){
			for(let j = 0; j < nCols; j++){
				if(boardSpace > 0){
					let hole = new Hole(x, y, this.holeSize, this.boardWidth, this.boardHeight, this.tileSize, this.holeDifficulty);
					hole.generateHole();
					this.holes.push(hole);
					x += this.holeSize + 1;
					boardSpace--;
				}

			}
			y += this.holeSize + 1;
			x = minX + xPadding;
		}









		// this.holes = [];

		// let minX = 0;
		// let maxX = this.boardWidth - 1; // (Board width is length of array so minus 1)
		// let minY = 1;
		// let maxY = this.boardHeight - 6;

		// let nRow  = Math.floor((maxY - minY) / (this.holeSize));
		// let nCols = Math.floor((maxX - minX) / (this.holeSize));
		// // AHH 


		// if(nCols > this.maxHoles){
		// 	nCols = this.maxHoles;
		// }
	
		// let holesPerRow = nCols;
		// if(nCols > nRow){
		// 	holesPerRow = nCols / nRow;
		// }
		
		// let xPadding = Math.floor(( this.boardWidth - (this.holeSize * holesPerRow)) / holesPerRow);
		// let maxHoles = this.maxHoles;

		// let x = Math.floor(minX + xPadding);
		// let y = minY;
		// // This many holes per row
		// for (let i = 0; i < nRow; i++) {
		// 	let hpr = holesPerRow;
		// 	for (let j = 0; j < nCols; j++) {

		// 		if(maxHoles > 0 && hpr > 0){
		// 			maxHoles--;
		// 			hpr--;
		// 			let hole = new Hole(x, y, this.holeSize, this.boardWidth, this.boardHeight, this.tileSize, this.holeDifficulty);
		// 			hole.generateHole();
		// 			this.holes.push(hole);
		// 			x += this.holeSize + 1;
		// 		}
		// 	}
		// 	y += this.holeSize + 3;
		// 	x = minX + xPadding;
		// }
	}


	setup() {
		//Setup Canvas
		this.canvas = document.getElementById('carpCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.addListeners();
		this.resizeCanvas();
		//Start game 

		for (let i = 0; i < this.graphInfo.length; i++) {
			let baseOptions = {
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				title : {},
				xAxis : [],
				yAxis : [],
				series: [],
			};
			
			let graph = new Graph(baseOptions, this.graphInfo[i]);
			this.graphs.push(graph);
		}

		this.menuHandler = new MenuHandler(this.menus, "main");
		this.menuHandler.changeState("main");
	}

	changeState(state){
		// If state changes to game, make sure gameloop is running.
		//Update MENUS
		this.menuHandler.changeState(state);
		// UPDATE GAME
		if(state == "game"){
			this.loop();

		} else {
			window.cancelAnimationFrame(this.gameRunning);
		}
	}

	makeFloating(content, x, y){
		let ft = new FloatingText(content, x, y);
		this.floatingText.push(ft);
	}

	checkHoles() {
		
		for (let i = 0, j = this.holes.length; i < j; i++) {
			let hole = this.holes[i];
			let filled = hole.checkState(this.board, this.combo);
			if (filled) {
				
				// Hole is filled. 
				this.average();
				this.holeScores.push(hole.score);
				this.totalScore += hole.score;
				this.scoreTracker += hole.score;


				let middlex = hole.x * this.tileSize + ((hole.holeSize * this.tileSize) / 2);
				let middley = hole.y * this.tileSize + ((hole.holeSize * this.tileSize) / 2);


				if(hole.overfill == 0){
					this.makeFloating("Masterpiece", middlex, hole.y * this.tileSize);
					this.combo++;

					if(this.combo >= this.maxCombo){
						this.maxCombo = this.combo;

						try{
							kongregate.stats.submit('Max Combo', this.maxCombo);
						} catch(err) {
							console.log("Could not submit maxCombo: ", err);
						}

					}

				} else {
					this.combo = 0;
					if(hole.overfill < 4){
						this.makeFloating("Craftsmanship", middlex, middley);
					} else if(hole.overfill < 8){
						this.makeFloating("Fine Work", middlex, middley);
					} else if(hole.overfill < 16){
						this.makeFloating("Poor Work", middlex, middley);
					}
				}
				// When a hole is filled increment hole counter. 
				this.holesFilled++;
				if(this.holesFilled >= this.holesToFill){
					// We should level up.
					this.level++;
					this.holesToFill += this.levelIncrement;
					this.holesFilled = 0;
					this.initLevelDisplay();
					
					if(this.holeDifficulty <= 10){
						this.holeDifficulty++;
						hole.difficulty = this.holeDifficulty;
					}

				}
				this.updateLevelDisplay();
				hole.regenerate(this.board);
			}
		}






	}

	getTimeStamp() {
		let date = new Date();
		let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		return time;
	}



	average() {
		// Something is wrong? 
		let time = this.getTimeStamp();
		this.comboScore.push([this.combo, time]);


		let totalScores = 0;
		if (this.holeScores.length) {
			let holeScores = this.holeScores;

			for (let i = 0; i < holeScores.length; i++) {
				totalScores += holeScores[i];
			}
			totalScores = totalScores / holeScores.length;

			if(Math.floor(totalScores) > this.maxAverage){
				this.maxAverage = totalScores;
				try{
					kongregate.stats.submit('Average Score', this.maxAverage);
				} catch(err) {
					console.log("Could not submit maxAverage: ", err);
				}
			}

			this.averageScores.push([
				totalScores,
				time
			]);
		} else {
			this.averageScores.push([0, time]);
		}
		if (this.comboScore.length >= 20) {
			let diff = this.comboScore.length - 20;
			this.comboScore.splice(0, diff);
			this.averageScores.splice(0, diff);
		}
	}

	drawFloating(){
		let nft = [];
		for(let i = 0; i < this.floatingText.length; i++){
			let ft = this.floatingText[i];
			ft.draw(this.ctx);
			ft.update();
			if(ft.opacity > 0){
				nft.push(ft);
			}
		}
		this.floatingText = nft;
	
	}

	drawDebug(){
		for(let hole of this.holes){
			if(hole.sTime != null){
				let now = performance.now();
				let time = (now - hole.sTime)/1000;
				this.ctx.font = "16px Arial";
				this.ctx.fillStyle = "black";
				this.ctx.fillText(time, hole.x * this.tileSize, hole.y * this.tileSize);
			}
		}
		for(let shape of this.shapes){
			drawRect(this.ctx, shape.x * this.tileSize, shape.y * this.tileSize, shape.width * this.tileSize, shape.height * this.tileSize);
		}
	}


	drawGame(){
		// New draw function
		// Currently, we add everything to the game grid and then draw it
		this.makeBoard();
		this.addHoles();
		this.addShapes();
		//Grid is now complete
		this.drawBackground();
		this.drawHoles();
		this.drawShapes();
		this.drawHoleEdges();
		this.drawFloating();
	}

	drawBackground(){
		this.drawBox(0, 0, this.boardWidth * this.tileSize, this.boardHeight * this.tileSize, "#ffff",  'rgba(0, 0, 0, 0.5)');
	}

	drawHoles(){
		// TODO: some new logic to highlight holes

		for(let i = 0, j = this.holes.length; i < j; i++){
			let hole = this.holes[i];
	
			let x = hole.x * this.tileSize;
			let y = hole.y * this.tileSize;
			let blocks = hole.blocks;

			for(let k = 0, l = blocks.length; k < l; k++){
				let block = blocks[k];
				let edges = block.edges;

				let blky = (block.row * this.tileSize) + y;
				let blkx = (block.col * this.tileSize) + x;
			
				this.drawRect(blkx, blky, this.tileSize, "black");
			}
		}
	}

	drawHoleEdges(){
		for(let i = 0, j = this.holes.length; i < j; i++){
			let hole = this.holes[i];
			let x = hole.x * this.tileSize;
			let y = hole.y * this.tileSize;
			let blocks = hole.blocks;
			for(let k = 0, l = blocks.length; k < l; k++){
				let block = blocks[k];
				let edges = block.edges;
				let blky = (block.row * this.tileSize) + y;
				let blkx = (block.col * this.tileSize) + x;
				if(edges.length > 0 && block.drawEdges){
					this.drawEdges(blkx, blky, this.tileSize, edges, block.edgeOpacity);
				}
			}
		}

	}

	drawShapes(){
		for(let i = 0, j = this.shapes.length; i < j; i++){
			let shape = this.shapes[i];
			let shapex = shape.x * this.tileSize;
			let shapey = shape.y * this.tileSize;
			if(shape.shake){
				
				shape.shake.update(this.frameTime);
				shapex = shape.shake.x - shapex;
				shapey = shape.shake.y - shapey;
		
			}


			// TODO: We can use shapex and shapey to modify the shape position without affecting the grid?

			let blocks = shape.blocks;
			for(let k = 0, i = blocks.length; k < i; k++){
				let block  = blocks[k];
				if(shape.shake){
					this.drawRect(shapex + block.x, shapey + block.y, this.tileSize, block.color);
				} else {
					this.drawRect(block.x, block.y, this.tileSize, block.color);
				}
				
			}
			
		}

	}




	loop() {
		this.getFPS();
		this.checkHoles();
		this.clearCanvas();
		this.drawGame();

		drawArc(this.ctx, this.mx, this.my, 10);
		if (this.trySpawn) {
			this.holder.checkSpaces(this.board);
			let newShapes = this.holder.trySpawn();
			this.shapes = this.shapes.concat(newShapes);
			this.trySpawn = false;
		}
		if (this.dragShape) {
			this.dragShape.drag(this.mx, this.my, this.ctx);
			this.dragShape.checkBounds(this.boardWidth, this.boardHeight);
			this.dragShape.checkPlace(this.board, this.holder);
		}
		this.holder.drawSpaces();
		// We need to handle mouse events in the loop, some click events depend on the state of the game board that may or may not be populated when the event fires
		this.handleMouse();

		this.frames++;
		this.ticker += this.frameTime;
		if (this.ticker / 1000 >= 5) {
			// 5 Second Timer.
			this.ticker = 0;
			this.updateGraphs();
		}
		this.gameRunning = window.requestAnimationFrame(this.loop.bind(this));
	}


	updateGraphs() {
		let graphs = this.graphs;
		for (let i = 0; i < graphs.length; i++) {
			let g = graphs[i];
			g.update();
		}
	}

	getFPS() {
		let now = performance.now();
		let lastTime = this.lastFrame;
		let timeTaken = now - lastTime;
		this.frameTime = timeTaken;

		this.lastFrame = now;

		if (this.framesTime) {
			if (now - this.framesTime >= 1000) {
				this.FPS = this.frames;
				this.frames = 0;
				this.framesTime = now;
			}
		} else {
			this.framesTime = performance.now();
		}
	}

	drawBoard() {
		// We need to change how the board is drawn..
		/* 
		
		1 - Draw the grid background
		2 - Draw the holes based on x/y
		3 - Draw the shape holders
		4 - Draw the shapes based on x/y

		Grid and shapes will need to maintain their own row/col vars which may be independent of their x/y (so we can apply stuff like animations easily)
		
		*/


		for (let row = 0; row < this.boardHeight; row++) {
			for (let col = 0; col < this.boardWidth; col++) {
				let cell = this.board[row][col];
				if (cell.contains.length > 0) {
					for (let i = cell.contains.length - 1; i >= 0; i--) {
						let block = cell.contains[i];
						this.drawRect(cell.x, cell.y, this.tileSize, block.color, null);
						if(block.drawEdges && block.edges && block.edges.length > 0){
							this.drawEdges(cell.x, cell.y, this.tileSize, block.edges, block.edgeOpacity);
						}


						break; //Draw the last one only.
					}
				} else {
					//Nothing in the cell. 
					this.drawRect(cell.x, cell.y, this.tileSize, 'white', 'rgba(0, 0, 0, 0.1)');
				}
			}
		}
	}

	//TODO: Make these functions not bad.
	mouseInGeneral(x, y, width, height){
		//Should be given in pixels.
		return(this.mx > x && this.mx < x + width && this.my > y && this.my < y + height);
	}


	mouseIn(cell) {
		return (this.mx > cell.x && this.mx < cell.x + this.tileSize && this.my > cell.y && this.my < cell.y + this.tileSize);
	}


	clearCanvas() {
		this.makeBoard();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}



	addHoles() {
		//Add holes to grid
		this.checkHoles();
		for (let i = 0; i < this.holes.length; i++) {
			let hole = this.holes[i];
			hole.draw(this.board);
		}
	}

	addShapes() {
		//Add shapes to grid
		let liveShapes = [];
		for (let i = 0, j = this.shapes.length; i < j; i++) {
			let shape = this.shapes[i];
			if (!shape.delete) {
				this.shapes[i].draw(this.board, this.boardWidth, this.boardHeight);
				liveShapes.push(shape);
			}
		}
		this.shapes = liveShapes;
	}

	drawBox(x, y, width, height, color, border){
		let cx = this.ctx;
		cx.beginPath();
		cx.rect(x, y, width, height);
		if (color !== null) {
			cx.fillStyle = color;
		} else {
			cx.fillStyle = 'black';
		}
		cx.fill();
		if (border !== null) {
			cx.strokeStyle = border;
			cx.stroke();
		}
		cx.closePath();	
	}

	drawRect(x, y, size, color, border = null) {
		let cx = this.ctx;
		cx.beginPath();
		cx.rect(x, y, size, size);
		if (color !== null) {
			cx.fillStyle = color;
		} else {
			cx.fillStyle = 'black';
		}
		cx.fill();
		if (border !== null) {
			cx.strokeStyle = border;
			cx.stroke();
		}
		cx.closePath();
	}

	
	drawEdges(x, y, ts, edges, opacity){
		
		

		let edgeWidth = 3;
		for(let i = 0; i < edges.length; i++){
			let e = edges[i];
			let ctx =  this.ctx;
			ctx.fillStyle = "rgba(255, 0, 0, " + opacity + ")";
			ctx.beginPath();
			if(e == "up"){
				ctx.rect(x, y, ts, edgeWidth);
			}
			if(e == "down"){
				ctx.rect(x, y + ts - edgeWidth, ts, edgeWidth);
			}
			if(e == "right"){
				ctx.rect(x + ts - edgeWidth, y, edgeWidth, ts);				
			}
			if(e == "left"){
				ctx.rect(x, y, edgeWidth, ts);
			}
			ctx.fill();	
			ctx.closePath();
		}
	}
}






/* Start Game Onload */
window.onload = function () {
	console.log("Window Load");
	let game = new Game();
	game.setup();
};
/* Global Functions */
function pickShape() {
	let randomInt = Math.random() * 93;
	let counter = 0;
	for(let i = 0; i < pieces.length; i++){
		let p = pieces[i];
		let oCounter = counter; 
		counter += p[2];
		if(randomInt >= oCounter && randomInt <= counter){
			return p;
		}
	}
}

function randomIndex(array){
	let min = 0;
	let max = array.length - 1;
	let index = random(min, max);
	return index;
}

function randomFloat(min, max, signed = null) {
	let rand = Math.random() * (max - min + 1) + min;

	if(signed){
		let srand = Math.random() * 10;
		if(srand > 5.2){
			rand *= -1;
		}
	}
	return rand;
}

function random(min, max, signed = null) {
	let rand = Math.floor( Math.random() * (max - min + 1) + min);

	if(signed){
		let srand = Math.random() * 10;
		if(srand > 5.2){
			rand *= -1;
		}
	}
	return rand;
}

function randomColor() {
	return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

function drawRect(ctx, x, y, w, h){
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
}

function drawArc(ctx, x, y, d){
	ctx.beginPath();
	ctx.arc(x, y, d, 0, 2 * Math.PI);
	ctx.fillStyle = "orange";
	ctx.fill();
	ctx.closePath();
}

function drawCell(ctx, x, y, size, color = null, border = null) {
	let cx = ctx;
	cx.beginPath();
	cx.rect(x, y, size, size);
	if (color !== null) {
		cx.fillStyle = color;
	} else {
		cx.fillStyle = 'black';
	}
	cx.fill();
	if (border !== null) {
		cx.strokeStyle = border;
		cx.stroke();
	}
	cx.closePath();
}