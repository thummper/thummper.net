var Drop = function(width){
	this.x = Math.round(Math.random() * width);
	this.y = (Math.random() * -50) - 1; 
	this.dy = this.opacity =  Math.random() + 0.1;
	
	

};


Drop.prototype.update = function(dt){
	//Drop will fall.
	this.y += Math.round(this.dy * dt);
	this.dy += 0.0009 * dt;
	
};

Drop.prototype.draw = function(rain_width, rain_height){
	ctx.beginPath();
	ctx.fillStyle = "rgba(80, 175, 255, "+ this.opacity +")";
	ctx.rect(this.x, this.y, rain_width, rain_height);
	ctx.fill();
	ctx.closePath();
}

Drop.prototype.splash = function(){
	//Add a bunch of particles.
	var test = Math.round(random_speed(3, 8, false));
	for(let i = 0; i < test; i++){
		particles.push(new Particle( random_speed(this.x - 10, this.x + 10, false ) ));
	}
}

