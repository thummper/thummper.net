function Food() {
    this.x; 
    this.y; 
    this.active = true;
	this.eaten = false;
    this.pickLocation = function(width, height) {
        this.x = Math.round(Math.random() * (width / 14)) * 14;
        this.y = Math.round(Math.random() * (height / 14)) * 14;
    }    
}