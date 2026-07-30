import { Application } from 'pixi.js';
import { addBackGround } from './addBackGround.js';
import { addStars } from './addStars.js';
import { Mountains } from './Mountains.js';
import { Trees } from './Trees.js';
import { Ground } from './Ground.js';
import { addMoon } from './addMoon.js';
import { Player } from './Player.js';
import { Cars } from './Cars.js';
import { Button } from './Button.js';
import { Score } from './Score.js';

// Create a PixiJS application.
const app = new Application();

const game = document.getElementById('game')!;
let player: Player;
let ground: Ground;
let cars: Cars;
let trees: Trees;
let mountains: Mountains;
let btn: Button | null = null;
let score: Score;
const increaseSpeed = 0.0015;

// Paused independently of the ticker, so rendering (and UI animations like the
// restart button's fade-in) keeps running while the game logic is frozen.
let paused = false;
let shakeFrames = 0;

// Asynchronous IIFE
(async () => {
	// Initialize the application.
	await app.init({ background: '#021f4b', resizeTo: game });

	// Then adding the application's canvas to the DOM body.
	game.appendChild(app.canvas);

	// Layering is driven by zIndex rather than add order, so the player always
	// reads on top of obstacles instead of being spawn-order dependent.
	app.stage.sortableChildren = true;

	const bg = addBackGround(app);
	addStars(app);
	await addMoon(app);

	mountains = new Mountains(app);
	mountains.AddMountains();

	ground = new Ground(app);
	ground.AddRoad();

	trees = new Trees(app);
	trees.AddTrees();

	player = new Player(app);
	await player.createAnimRun();

	cars = new Cars(app);
	await cars.Start();

	score = new Score();
	score.bestScore = getBestScore();
	score.Start(app);

	// Input
	bg.on('pointerdown', () => {
		if (!paused && !player.isJumping) player.Jump();
	});

	// Keep the road and tree belts covering the full width if the container is resized.
	app.renderer.on('resize', () => {
		ground.Resize();
		trees.Resize();
	});

	// Loop
	app.ticker.add((delta) => {
		if (shakeFrames > 0) {
			shakeFrames--;
			app.stage.x = (Math.random() - 0.5) * 10;
			app.stage.y = (Math.random() - 0.5) * 10;
			if (shakeFrames === 0) {
				app.stage.x = 0;
				app.stage.y = 0;
			}
		}

		if (paused) return;

		trees.Update(delta, increaseSpeed);
		mountains.Update(delta, increaseSpeed);
		player.Update(delta);
		cars.Update(delta, increaseSpeed, player.startX);
		score.Update(delta);
		ground.Update(delta, increaseSpeed);

		if (!player.dying && cars.CheckCollision(player.GetBounds())) {
			gamePause();
			player.Die();
			saveBestScore(score.score);
		}
	});
})();

function gamePause(): void {
	paused = true;
	shakeFrames = 12;
	btn = new Button(app.screen.width / 2, app.screen.height / 2, 225, 70, 20);
	btn.text = 'Rejouer';
	btn.onClick = () => {
		Restart();
	};
	btn.Start(app);
}

function Restart(): void {
	paused = false;
	player.Restart();
	ground.Restart();
	cars.Restart();
	mountains.Restart();
	trees.Restart();
	btn?.Destroy(app);
	btn = null;
	score.Loose();
}

function saveBestScore(current: number): void {
	const currentBest = getBestScore();
	if (current > currentBest) {
		localStorage.setItem('bestScore', current.toString());
	}
}

function getBestScore(): number {
	const saved = localStorage.getItem('bestScore');
	return saved ? parseInt(saved) : 0;
}
