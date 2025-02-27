import { Application, Graphics } from 'pixi.js';
import { addBackGround } from './addBackGround.js';
import { addStars } from './addStars.js';
import { addMountains } from './addMountain.js';
import { addTrees } from './addTrees.js';
import { addGround } from './addGround.js';
import { addMoon } from './addMoon.js';
import { Player } from './Player.js';
import { Car } from './Car.js';
import { Button } from './Button.js';

// Create a PixiJS application.
const app = new Application();

const game = document.getElementById('game');
let player = null;
let car = null ;
let btn = null;

// Asynchronous IIFE
(async () => {
    // Initialize the application.
    await app.init({ background: '#021f4b', resizeTo: game });

    // Then adding the application's canvas to the DOM body.
    game.appendChild(app.canvas);

    const bg = addBackGround(app);
    addStars(app);
    addMoon(app);
    addMountains(app);
    addTrees(app);
    addGround(app);

    player = new Player(app);
    await player.createAnimRun();
    car = new Car(app);
    await car.createCar();

    // Input
    bg.on('pointerdown', () => {
        if (!player.isJumping) player.Jump();
    });

    // Loop
    app.ticker.add((delta) => {
        player.Update(delta);
        car.Update(delta);

        if (testCollision(player.GetBounds(), car.sprite.getBounds()))
        {
            gamePause();
            player.currentSprite.tint = 0xff0000;
        }
        else
        {
            player.currentSprite.tint = 0xffffff;
        }
    });
})();

function testCollision(bounds1, bounds2)
{
    return (
        bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y
    );
}

function gamePause(){
    app.ticker.stop();
    btn = new Button(app.screen.width / 2, app.screen.height / 2, 200, 50, 20);
    btn.text = 'Restart';
    btn.onClick = (() => {Restart()});
    btn.Start(app);
}

function Restart(){
    app.ticker.start();
    player.currentSprite.tint = 0xffffff;
    player.currentSprite.y = player.startY;
    car.sprite.x = app.screen.width;
    player.isJumping = false;
    player.speedJump = 0;
    player.SwitchToAnim(player.animRun);
    btn.Destroy(app);
}