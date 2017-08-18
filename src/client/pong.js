const PIXI = require('pixi.js');
const domready = require("domready");

const Game = require("./game");

let init = function () {

    let pong = new PIXI.Application(800, 600, {backgroundColor: 0x1099bb});
    document.getElementById("pong-wrapper").appendChild(pong.view);

    let game = new Game();

    let player1Visual = new PIXI.Graphics();
    player1Visual.lineStyle(0);
    player1Visual.beginFill(0x0BFFFF, 0.5);
    player1Visual.drawRect(0, 300, 20, 120);
    player1Visual.endFill();

    player1Visual.pivot.set(10, game.player2.size / 2);

    pong.stage.addChild(player1Visual);
    game.player1.visual = player1Visual;

    let player2Visual = new PIXI.Graphics();
    player2Visual.lineStyle(0);
    player2Visual.beginFill(0x0BFFFF, 0.5);
    player2Visual.drawRect(800, 300, 20, 120);
    player2Visual.endFill();

    player2Visual.pivot.set(10, game.player2.size / 2);

    pong.stage.addChild(player2Visual);
    game.player2.visual = player2Visual;

    let ballVisual = new PIXI.Graphics();
    ballVisual.lineStyle(0);
    ballVisual.beginFill(0xFFFF0B, 0.5);
    ballVisual.drawCircle(400, 300, game.ball.radius);
    ballVisual.endFill();

    ballVisual.pivot.set(0, 0);

    pong.stage.addChild(ballVisual);
    game.ball.visual = ballVisual;

    let basicText = new PIXI.Text('0:0');
    basicText.x = 400;
    basicText.y = 40;
    basicText.anchor.set(0.5);

    pong.stage.addChild(basicText);

    game.scoreText = basicText;

    game.ball.init();
    game.player1.init();
    game.player2.init();

    let draw = function () {
        game.update(1);
        game.ball.visual.x = game.ball.x;
        game.ball.visual.y = game.ball.y;
        game.player1.visual.y = game.player1.y;
        game.player2.visual.y = game.player2.y;
        game.scoreText.text = game.player1.wins + " : " + game.player2.wins;

    };

    let loopStep = function () {
        draw();
        requestAnimationFrame(loopStep);
    };

    requestAnimationFrame(loopStep);
};

domready(() => {
    init();
});

console.log("App initialized");