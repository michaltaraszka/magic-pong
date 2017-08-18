const MathHelper = require("./util/mathHelper.js");
const KeyboardJS = require('keyboardjs');

class Player {

    constructor(keyUp, keyDown, size, side) {
        this.keyUp = keyUp;
        this.keyDown = keyDown;
        this.size = size;
        this.x = side ? -400 : 400;
        this.y = 0;
        this.fadeTimeInMilliseconds = 200;
        this.defaultSpeed = 8;
        this.currentTime = 0;
        this.localCurrentTime = 0;
        this.lastTime = 0;
        this.resetTime = false;
        this.direction = 0;
        this.speed = 0;
        this.wins = 0;
        this.visual = null;
    }

    init() {
        KeyboardJS.bind(this.keyUp, () => {
            this.direction = -1;
            this.resetTime = true;
        });
        KeyboardJS.bind(this.keyUp, null, () => {
            this.resetTime = false;
        });
        KeyboardJS.bind(this.keyDown, () => {
            this.direction = 1;
            this.resetTime = true;
        });
        KeyboardJS.bind(this.keyDown, null, () => {
            this.resetTime = false;
        });
    }

    update(delta) {
        this.currentTime = Date.now();

        this.speed = this.calculateFinalSpeed(delta);
        this.y += this.speed;

        this.y = MathHelper.clamp(this.y, -240, 240);

        this.lastTime = this.currentTime;
    }

    calculateFinalSpeed(delta) {
        if (this.resetTime) {
            this.localCurrentTime = 0;
            return this.defaultSpeed * delta * this.direction;
        }
        if (this.localCurrentTime <= this.fadeTimeInMilliseconds) {
            this.localCurrentTime += this.currentTime - this.lastTime;
            return this.interpolate(this.defaultSpeed * delta, this.direction, this.localCurrentTime)
        }
        return 0;
    }

    interpolate(value, direction, currentTime) {
        return value * direction * ((this.fadeTimeInMilliseconds - currentTime) / this.fadeTimeInMilliseconds);
    }

}

module.exports = Player;