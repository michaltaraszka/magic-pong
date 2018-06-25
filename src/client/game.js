const Player = require('./player');
const Ball = require('./ball');
const LEFT = true;
const RIGHT = false;

class Game {

    constructor() {
        this.ball = new Ball();
        this.player1 = new Player('w', 's', 120, LEFT);
        this.player2 = new Player('up', 'down', 120, RIGHT);
    }

    updatePlayers() {
        this.player1.update(1);
        this.player2.update(1);
    }

    checkCollisions() {
        let collided = this.checkPlayerCollisions(this.player1) || this.checkPlayerCollisions(this.player2);
        if ((this.ball.x < -400 + this.ball.radius + 10 || this.ball.x > 400 - this.ball.radius - 10) && !collided) {
            this.ball.x > 0 ? this.player1.wins++ : this.player2.wins++;
            this.ball.x = 0;
            this.ball.y = 0;
            this.player1.y = 0;
            this.player2.y = 0;
        }
        if (this.ball.y < -300 + this.ball.radius || this.ball.y > 300 - this.ball.radius) {
            this.ball.invertVertical();
        }
    }

    checkPlayerCollisions(player) {
        if (this.ball.y < player.y + player.size / 2 && this.ball.y > player.y - player.size / 2) {
            if ((this.ball.x < -400 + this.ball.radius + 10 && player.x < 0) || (this.ball.x > 400 - this.ball.radius - 10 && player.x > 0)) {
                this.ball.x = player.x > 0 ? player.x - this.ball.radius - 10 : player.x + this.ball.radius + 10;
                this.ball.invertHorizontal();
		this.ball.speed = this.ball.speed + 0.05;
                this.ball.vector.y -= player.speed / 20;
                //normalize ball direction vector
                let len = Math.sqrt(this.ball.vector.x * this.ball.vector.x + this.ball.vector.y * this.ball.vector.y);
                this.ball.vector.x /= len;
                this.ball.vector.y /= len;

                return true;
            }
        }
        return false;
    }

    update() {
        this.ball.update();
        this.checkCollisions();
        this.updatePlayers(1);
    }

}

module.exports = Game;