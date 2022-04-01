class Cloud {
    // Better for me if the cloud can regenerate itself, so needs access to assets 
    constructor(image, x, y, dx, layer) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.layer = layer;
    }
    update() {
        this.x = this.x - this.dx;
    }
}