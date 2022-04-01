var Particle = function (startX) {
	this.x = startX;
	this.y = canvas.height - 3;
	this.dx = random_speed(0.05, 0.1, true);
	this.dy = random_speed(0.05, 0.3, false);
	this.lifetime = 200
	this.opacity = 1;

}

Particle.prototype.update = function (dt) {
	this.x += Math.round(this.dx * dt);
	this.y += Math.round(this.dy * dt);
	this.dy += 0.005;
	this.opacity -= 0.01;
	if(this.lifetime >= 0){
		this.lifetime -= 2;
		return false;
	}
	return true;


}

Particle.prototype.draw = function () {
	ctx.beginPath();
	ctx.fillStyle = "rgba(80, 175, 255, " + this.opacity + ")";
	ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
}
