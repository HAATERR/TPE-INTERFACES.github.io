class Ficha {
    constructor(posX, posY, width, height, fill, context, radius) {
        this.posX = posX,
        this.posY = posY,
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.ctx = context;
        this.radius = radius;
    }

    draw(selected = false) {
        this.ctx.fillStyle = this.fill;
        this.ctx.beginPath();
        this.ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        this.ctx.fill();

        if (selected) {
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = "#FFD700";
            this.ctx.stroke();
        }
    }


    getPosition() {
        return {
            x: this.posX,
            y: this.posY
        };
    }

    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }

    isPointed(x, y) {
        let pos_x_mouse = this.posX - x;
        let pos_y_mouse = this.posY - y;
        return Math.sqrt((pos_x_mouse * pos_x_mouse + pos_y_mouse * pos_y_mouse)) < this.radius;
    }
}