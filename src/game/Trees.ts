import { Application, Graphics, type Ticker } from 'pixi.js';
import * as utils from './Utils.js';

export class Trees {
	app: Application;
	speed: number;
	trees: Graphics[];
	treeWidth: number;
	spacing: number;
	baseY: number;
	count: number;

	constructor(app: Application) {
		this.app = app;
		this.speed = 3;
		this.trees = [];
		this.treeWidth = 150;
		this.spacing = 100;
		this.baseY = app.screen.height - 50;
		this.count = 0;
	}

	AddTrees(): void {
		// Width of each tree.
		this.treeWidth = utils.isMobileDevice() ? 100 : 150;
		this.baseY = this.app.screen.height - 50;

		// Calculate the number of trees needed to fill the screen horizontally,
		// plus a couple extra so the belt always wraps seamlessly.
		this.count =
			Math.ceil(this.app.screen.width / (this.treeWidth + this.spacing)) + 2;

		for (let index = 0; index < this.count; index++) {
			// Randomize the height of each tree within a constrained range.
			const treeHeight = utils.isMobileDevice()
				? 100 + Math.random() * 50
				: 175 + Math.random() * 75;

			// Create a tree instance.
			const tree = this.CreateTree(this.treeWidth, treeHeight);

			// Initially position the tree.
			tree.x = index * (this.treeWidth + this.spacing + 25 * Math.random());
			tree.y = this.baseY;

			// Add the tree to the stage and the reference array.
			this.app.stage.addChild(tree);
			this.trees.push(tree);
		}
	}

	Resize(): void {
		// Rebuild the tree belt so it always covers the current screen width.
		this.trees.forEach((tree) => this.app.stage.removeChild(tree));
		this.trees = [];
		this.AddTrees();
	}

	Restart(): void {
		// Reset the speed and reposition the trees.
		this.speed = 3;
		this.trees.forEach((tree, index) => {
			tree.x = index * (this.treeWidth + this.spacing + 25 * Math.random());
			tree.y = this.baseY;
		});
	}

	Update(time: Ticker, increaseSpeed: number): void {
		// Calculate the amount of distance to move the trees per tick.
		const dx = time.deltaTime * this.speed;
		this.speed += increaseSpeed; // Increment speed slightly each frame.
		this.trees.forEach((tree) => {
			// Move the trees leftwards.
			tree.x -= dx;
			// Reposition the trees when they move off screen.
			if (tree.x <= -(this.treeWidth / 2 + this.spacing)) {
				tree.x +=
					this.count * (this.treeWidth + this.spacing) + this.spacing * 3;
			}
		});
	}

	CreateTree(width: number, height: number): Graphics {
		// Define the dimensions of the tree trunk.
		const trunkWidth = 25;
		const trunkHeight = height / 6;

		// Define the dimensions and parameters for the tree crown layers.
		const crownHeight = height - trunkHeight;
		const crownLevels = 4;
		const crownLevelHeight = crownHeight / crownLevels;
		const crownWidthIncrement = width / crownLevels;

		// Define the colors of the parts.
		const crownColor = 0x264d3d;
		const trunkColor = 0x563929;

		const graphics = new Graphics()
			// Draw the trunk.
			.rect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight)
			.fill({ color: trunkColor });

		for (let index = 0; index < crownLevels; index++) {
			const y = -trunkHeight - crownLevelHeight * index;
			const levelWidth = width - crownWidthIncrement * index;
			const offset = index < crownLevels - 1 ? crownLevelHeight / 2 : 0;

			// Draw a crown layer.
			graphics
				.moveTo(-levelWidth / 2, y)
				.lineTo(0, y - crownLevelHeight - offset)
				.lineTo(levelWidth / 2, y)
				.fill({ color: crownColor });
		}

		return graphics;
	}
}
