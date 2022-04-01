var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");
var nextPCanvas = document.getElementById("nextPiece");
var nextCtx = nextPCanvas.getContext("2d");

var width = 10;
var w2 = 4;
var height = 20;
var h2 = 4;
var tileS = 24;

canvas.width = width * tileS;
canvas.height = height * tileS;
nextPCanvas.width = w2 * tileS;
nextPCanvas.height = h2 * tileS;

//Setup board. 

var board = [];
for(var row = 0; row < 20; row++){
    board[row] = [];
    for(var tile = 0; tile < 10; tile++){
        board[row][tile] = "";
    }
}

//Next piece board.
var nBoard = [];
for(var row = 0; row < 4; row++){
    nBoard[row] = [];
    for(var col = 0; col < 4; col++){
        nBoard[row][col] = "";
    }
}

var pieces = [
	[I, "cyan"],
	[J, "blue"],
	[L, "orange"],
	[O, "yellow"],
	[S, "green"],
	[T, "purple"],
	[Z, "red"]
];
function newPiece(){
    var p = pieces[parseInt(Math.random() * pieces.length, 10)];
    return new Piece(p[0], p[1]);
    
}


//Now have a 10 * 20 grid of false. 
function drawSquare(x, y, context, border){
    //Draws a square at x and y.
    context.fillRect( x * tileS, y * tileS, tileS, tileS);
    let temp = context.strokeStyle;
    if(border){
    context.strokeStyle = "#c7c7c7";
    context.strokeRect(x * tileS, y * tileS, tileS, tileS);
    context.strokeStyle = temp;
    }
}
function drawBoard(){
    let temp = ctx.fillStyle;
    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            ctx.fillStyle = board[y][x] || "white";
            if(ctx.fillStyle == "#ffffff"){
             drawSquare(x, y, ctx, 1);   
            } else {
              drawSquare(x, y, ctx, 0);  
            }
            
            
        }
    }
    ctx.fillStyle = temp;
}
function drawNBoard(){
    let temp = nextCtx.fillStyle;
    for(var y = 0; y < 4; y++){
        for(var x = 0; x < 4; x++){
            nextCtx.fillStyle =  nBoard[y][x] || "white";
            drawSquare(x, y, nextCtx, 1);
            
        }
    }
    nextCtx.fillStyle = temp;
}
var piece = null;
var running = true;
//Key handling. 
document.addEventListener("keydown", eventHandler, false);
function eventHandler(e){
    
    if(e.keyCode == 87 || e.keyCode == 38){ // UP
        console.log("UP");
        timeStamp = Date.now();
        piece.rotate();
    } else if(e.keyCode == 68 || e.keyCode == 39){ // RIGHT
        console.log("R");
        piece.right();
    } else if(e.keyCode == 83 || e.keyCode == 40){ // DOWN
        console.log("D");
        piece.down();
    } else if(e.keyCode == 65 || e.keyCode == 37){ // LEFT
        console.log("L");
        piece.left();
    } else if(e.keyCode == 80){ // ESCP
        console.log("P: " + running);
        if(running){
            running = false;
        } else{
            running = true;
            main();
        }
    } else if(e.keyCode == 32){ //SPACE BAR
        piece.slam();
    } 
}







var timeStamp = Date.now();
function main(){
    var now = Date.now();
    var delta = now - timeStamp;
    
    if(delta > 500){
        piece.down();
        timeStamp = Date.now();
    }
    
    if(running){
        requestAnimationFrame(main);
    }
    
    
}
piece = newPiece();
nextPiece = newPiece();

drawBoard();
drawNBoard();
nextPiece.drawNext();
main();







