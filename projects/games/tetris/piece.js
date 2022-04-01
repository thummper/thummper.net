function Piece(patterns, colour) {
    this.pattern = patterns[0];
    this.patterns = patterns;
    this.patternNum = 0;
    this.colour = colour;

    this.x = 0;
    this.y = -2;


    this.draw = function () {
        let temp = ctx.fillStyle;
        ctx.fillStyle = this.colour;
        for (var ix = 0; ix < this.pattern.length; ix++) {
            for (var iy = 0; iy < this.pattern[ix].length; iy++) {
                if (this.pattern[ix][iy]) {
                    //An actual block. 
                    drawSquare(this.x + ix, this.y + iy, ctx, 0);
                   
                    //Draw block at correct position.
                }
            }
        }
        ctx.fillStyle = temp;

    };
    this.drawNext = function(){
        console.log("Drawing Next");
        let temp = nextCtx.fillStyle;
        nextCtx.fillStyle = this.colour;
        for(var ix = 0; ix < this.pattern.length; ix++){
            for(var iy = 0; iy < this.pattern.length; iy++){
                if(this.pattern[ix][iy]){
                    if(this.pattern.length == 3){
                        drawSquare(ix + 1, iy, nextCtx, 0);
                    } else {
                      drawSquare(ix, iy, nextCtx, 0);  
                    }
                }
            }
        }
        nextCtx.fillStyle = temp;
        
    }
    this.undraw = function () {
        let temp = ctx.fillStyle;
        ctx.fillStyle = "white";
        for (var ix = 0; ix < this.pattern.length; ix++) {
            for (var iy = 0; iy < this.pattern[ix].length; iy++) {
                if (this.pattern[ix][iy]) {
                    drawSquare(this.x + ix, this.y + iy, ctx, 1);
                }
            }
        }
        ctx.fillStyle = temp;

    };
    this.down = function () {
        if (this.collides(0, 1, this.pattern)) {

            this.lock();
            piece = nextPiece;
            nextPiece = newPiece();
            drawNBoard();
            nextPiece.drawNext();

        } else {
            this.undraw();
            this.y++;
            
            this.draw();

        }
    };
    this.left = function () {
        //Time should freeze but not reset?
        var delta = Date.now() - timeStamp;
        if (!this.collides(-1, 0, this.pattern)) {
            this.undraw();
            this.x--;
            this.draw();
            timeStamp
        }
    };
    this.right = function () {
        if (!this.collides(1, 0, this.pattern)) {
            this.undraw();
            this.x++;
            this.draw();
        }
    };
    this.rotate = function () {
        var nudge = 0;
        var nextPattern = this.patterns[(this.patternNum + 1) % this.patterns.length];

        if (this.collides(0, 0, nextPattern)) {
            nudge = this.x > width / 2 ? -1 : 1;
        }
        if (!this.collides(nudge, 0, nextPattern)) {
            this.undraw();
            this.x += nudge;
            this.patternNum = (this.patternNum + 1) % this.patterns.length;
            this.pattern = this.patterns[this.patternNum];
            this.draw();
        }
    };



    this.collides = function (dx, dy, pat) {
        for (var ix = 0; ix < pat.length; ix++) {
            for (var iy = 0; iy < pat[ix].length; iy++) {
                if (!pat[ix][iy]) {
                    continue;
                }
                var x = this.x + ix + dx;
                var y = this.y + iy + dy;

                if (y >= height || x < 0 || x >= width) {
                    return true;
                }
                if (y < 0) {
                    //Ignore neg space
                    continue;
                }
                if (board[y][x] !== "") {
                    return true;
                }
            }

        }
    };
    this.slam = function(){
        if(!this.collides(0, 1, this.pattern)){   
            this.undraw();
            this.y++;
            this.slam();
        }else {
            this.draw();
            
        }

    };
    this.lock = function () {
        for (var ix = 0; ix < this.pattern.length; ix++) {
            for (var iy = 0; iy < this.pattern[ix].length; iy++) {
                if(!this.pattern[ix][iy]){
                    //Ignore 0s 
                    continue;
                }
                
                if (this.y + iy < 0) {
                    alert("Game Over");
                    running = false;
                    return;
                }
                board[this.y + iy][this.x + ix] = this.colour;
            }
        }
        var linesDone = 0;
        
        
        
        for(var y = 0; y < height; y++){
            //For each row loop through columns.
            //Loops downwards..
            var lineComp = true;
            for(var x = 0; x < width; x++){
                lineComp = lineComp && board[y][x] != "";
            }
            if(lineComp){
                //Line is complete.
                for(var y2 = y; y2 > 1; y2--){
                    //Loop upwards and swap all rows.
                    for(var x = 0; x < width; x++){
                        board[y2][x] = board[y2 - 1][x];
                    }
                }
                for(var x = 0; x < width; x++){
                    board[0][x] = "";
                }
                linesDone++;
                
                
            }
            
        }
        
        if(linesDone > 0){
            document.getElementById("totalLines").innerHTML = parseInt(document.getElementById("totalLines").innerHTML) + linesDone;
            drawBoard();
        }
        
        
        

    };



}
