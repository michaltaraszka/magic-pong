class Ball {

    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 4;
        this.vector = {
            x: 0,
            y: 0
        };
        this.radius = 15;
        this.visual = null;
    }

    invertHorizontal() {
        this.vector.x *= -1;
    }

    invertVertical() {
        this.vector.y *= -1;
    }

    init() {
        this.vector.x = Math.random() * 2 - 1;
        this.vector.y = Math.random() * 2 - 1;
        let len = Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y);
        this.vector.x /= len;
        this.vector.y /= len;
    }

    update() {
        this.x += this.vector.x * this.speed;
        this.y += this.vector.y * this.speed;
    }

}

module.exports = Ball;