const LEFT = true;
const RIGHT = false;

var PIXI = require('pixi.js');
var keyboardJS = require('keyboardJS');

var Ball = function () {

    var self = this;

    self.x = 0;

    self.y = 0;

    self.speed = 4;

    self.vector = {
        x: 0,
        y: 0
    };

    self.radius = 15;

    self.invertHorizontal = function () {
        self.vector.x *= -1;
    };

    self.invertVertical = function () {
        self.vector.y *= -1;
    };

    self.init = function () {
        self.vector.x = Math.random() * 2 - 1;
        self.vector.y = Math.random() * 2 - 1;
        var len = Math.sqrt(self.vector.x * self.vector.x + self.vector.y * self.vector.y);
        self.vector.x /= len;
        self.vector.y /= len;
    };

    self.update = function () {
        self.x += self.vector.x * self.speed;
        self.y += self.vector.y * self.speed;
    };

    self.visual = null;
};

Ball.prototype.constructor = Ball;

var Player = function (keyUp, keyDown, size, side) {

    var self = this;

    var fadeTimeInMilliseconds = 1000;
    var defaultSpeed = 8;

    var currentTime = 0;
    var localCurrentTime = 0;
    var lastTime = 0;
    var resetTime = false;

    var direction = 0;

    self.x = side ? -400 : 400;

    self.y = 0;

    self.speed = 0;

    self.size = size;

    self.wins = 0;

    self.visual = null;

    self.init = function () {
        console.log("Initialize player");
        keyboardJS.bind(keyUp, function () {
            direction = -1;
            resetTime = true;
        });
        keyboardJS.bind(keyDown, function () {
            direction = 1;
            resetTime = true;
        });
    };

    self.update = function (delta) {
        currentTime = Date.now();

        self.speed = calculateFinalSpeed(delta);
        self.y += self.speed;

        self.y = MathHelper.clamp(self.y, -240, 240);

        lastTime = currentTime;
    };

    var calculateFinalSpeed = function (delta) {
        if (resetTime) {
            localCurrentTime = 0;
            resetTime = false;
            return defaultSpeed * delta * direction;
        }
        if (localCurrentTime <= fadeTimeInMilliseconds) {
            localCurrentTime += currentTime - lastTime;
            return interpolate(defaultSpeed * delta, direction, localCurrentTime)
        }
        return 0;
    };


    var interpolate = function (value, direction, currentTime) {
        return value * direction * ((fadeTimeInMilliseconds - currentTime) / fadeTimeInMilliseconds);
    };

};

Player.prototype.constructor = Player;


var Pong = function () {

    var self = this;

    self.ball = new Ball();
    self.player1 = new Player('w', 's', 120, LEFT);
    self.player2 = new Player('up', 'down', 120, RIGHT);

    self.updatePlayers = function () {
        self.player1.update(1);
        self.player2.update(1);
    };

    self.checkCollisions = function () {
        var collided = checkPlayerCollisions(self.player1) || checkPlayerCollisions(self.player2);
        console.log(collided);
        if ((self.ball.x < -400 + self.ball.radius + 10 || self.ball.x > 400 - self.ball.radius - 10) && !collided) {
            self.ball.x > 0 ? self.player1.wins++ : self.player2.wins++;
            self.ball.x = 0;
            self.ball.y = 0;
            self.player1.y = 0;
            self.player2.y = 0;
        }
        if (self.ball.y < -300 + self.ball.radius || self.ball.y > 300 - self.ball.radius) {
            self.ball.invertVertical();
        }
    };

    var checkPlayerCollisions = function (player) {
        if (self.ball.y < player.y + player.size / 2 && self.ball.y > player.y - player.size / 2) {
            if ((self.ball.x < -400 + self.ball.radius + 10 && player.x < 0) || (self.ball.x > 400 - self.ball.radius - 10 && player.x > 0)) {
                self.ball.x = player.x > 0 ? player.x - self.ball.radius - 10 : player.x + self.ball.radius + 10;
                self.ball.invertHorizontal();
                self.ball.vector.y -= player.speed / 20;
                //normalize ball direction vector
                var len = Math.sqrt(self.ball.vector.x * self.ball.vector.x + self.ball.vector.y * self.ball.vector.y);
                self.ball.vector.x /= len;
                self.ball.vector.y /= len;

                return true;
            }
        }
        return false;
    };

    self.update = function () {
        self.ball.update();
        self.checkCollisions();
        self.updatePlayers(1);
    };
};


var init = function () {
    var pong = new PIXI.Application(800, 600, {backgroundColor: 0x1099bb});
    document.getElementById("pong-wrapper").appendChild(pong.view);

    var pongGame = new Pong();

    var player1Visual = new PIXI.Graphics();
    player1Visual.lineStyle(0);
    player1Visual.beginFill(0x0BFFFF, 0.5);
    player1Visual.drawRect(0, 300, 20, 120);
    player1Visual.endFill();

    player1Visual.pivot.set(10, pongGame.player2.size / 2);

    pong.stage.addChild(player1Visual);
    pongGame.player1.visual = player1Visual;

    var player2Visual = new PIXI.Graphics();
    player2Visual.lineStyle(0);
    player2Visual.beginFill(0x0BFFFF, 0.5);
    player2Visual.drawRect(800, 300, 20, 120);
    player2Visual.endFill();

    player2Visual.pivot.set(10, pongGame.player2.size / 2);

    pong.stage.addChild(player2Visual);
    pongGame.player2.visual = player2Visual;

    var ballVisual = new PIXI.Graphics();
    ballVisual.lineStyle(0);
    ballVisual.beginFill(0xFFFF0B, 0.5);
    ballVisual.drawCircle(400, 300, pongGame.ball.radius);
    ballVisual.endFill();

    ballVisual.pivot.set(0, 0);

    pong.stage.addChild(ballVisual);
    pongGame.ball.visual = ballVisual;

    var basicText = new PIXI.Text('0:0');
    basicText.x = 400;
    basicText.y = 40;
    basicText.anchor.set(0.5);

    pong.stage.addChild(basicText);

    pongGame.scoreText = basicText;

    pongGame.ball.init();
    pongGame.player1.init();
    pongGame.player2.init();

    var draw = function () {
        pongGame.update(1);
        pongGame.ball.visual.x = pongGame.ball.x;
        pongGame.ball.visual.y = pongGame.ball.y;
        pongGame.player1.visual.y = pongGame.player1.y;
        pongGame.player2.visual.y = pongGame.player2.y;
        pongGame.scoreText.text = pongGame.player1.wins + " : " + pongGame.player2.wins;

    };

    var loopStep = function () {
        draw();
        requestAnimationFrame(loopStep);
    };

    requestAnimationFrame(loopStep);
};

console.log("App initialized");