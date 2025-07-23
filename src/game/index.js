import { Application, Graphics } from 'pixi.js';
import { addBackGround } from './addBackGround.js';
import { addStars } from './addStars.js';
import { Mountains } from './Mountains.js';
import { Trees } from './Trees.js';
import { Ground } from './Ground.js';
import { addMoon } from './addMoon.js';
import { Player } from './Player.js';
import { Car } from './Car.js';
import { Button } from './Button.js';
import { Score } from './Score.js';

// Create a PixiJS application.
const app = new Application();

const game = document.getElementById('game');
let player = null;
let ground = null;
let car = null;
let trees = null;
let mountains = null;
let btn = null;
let score = null;
let increaseSpeed = 0.005;

// Asynchronous IIFE
(async () => {
    // Initialize the application.
    await app.init({ background: '#021f4b', resizeTo: game });

    // Then adding the application's canvas to the DOM body.
    game.appendChild(app.canvas);

    const bg = addBackGround(app);
    addStars(app);
    addMoon(app);

    mountains = new Mountains(app);
    mountains.AddMountains();

    ground = new Ground(app);
    ground.AddRoad();

    trees = new Trees(app);
    trees.AddTrees();

    player = new Player(app);
    await player.createAnimRun();

    // let cool = new Graphics().rect(player.GetBounds().x, player.GetBounds().y, player.GetBounds().width, player.GetBounds().height).fill({ color: 0xff0000, alpha: 0.5 });
    // app.stage.addChild(cool);


    car = new Car(app);
    await car.createCar();

    score = new Score();
    score.Start(app);

    // Input
    bg.on('pointerdown', () => {
        if (!player.isJumping) player.Jump();
    });

    // Loop
    app.ticker.add((delta) => {
        trees.Update(delta, increaseSpeed);
        mountains.Update(delta, increaseSpeed);
        player.Update(delta);
        car.Update(delta, increaseSpeed);
        score.Update(delta);
        ground.Update(delta, increaseSpeed);
        if (testCollision(player.GetBounds(), car.GetBounds())) {
            // let cool = new Graphics().rect(player.GetBounds().x, player.GetBounds().y, player.GetBounds().width, player.GetBounds().height).fill({ color: 0xff0000, alpha: 0.5 });
            // let col = new Graphics().rect(car.GetBounds().x, car.GetBounds().y, car.GetBounds().width, car.GetBounds().height).fill({ color: 0xffff00, alpha: 0.5 });
            // app.stage.addChild(cool);
            // app.stage.addChild(col);
            gamePause();
            player.currentSprite.tint = 0xff0000;
        }
        else {
            player.currentSprite.tint = 0xffffff;
        }
    });
})();

function testCollision(bounds1, bounds2) {
    return (
        bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y
    );
}

function gamePause() {
    app.ticker.stop();
    btn = new Button(app.screen.width / 2, app.screen.height / 2, 225, 70, 20);
    btn.text = 'Rejouer';
    btn.onClick = (() => { Restart() });
    btn.Start(app);
}

function Restart() {
    app.ticker.start();
    player.Restart();
    ground.Restart();
    car.Restart();
    mountains.Restart();
    trees.Restart();
    btn.Destroy(app);
    score.Loose();
}