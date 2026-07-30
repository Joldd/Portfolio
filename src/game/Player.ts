import {
	Application,
	AnimatedSprite,
	Assets,
	Spritesheet,
	Texture,
	type SpritesheetData,
	type Ticker,
} from 'pixi.js';
import * as utils from './Utils.js';

export class Player {
	app: Application;
	currentSprite: AnimatedSprite | null;
	animRun: AnimatedSprite | null;
	animJump: AnimatedSprite | null;
	isJumping: boolean;
	dying: boolean;
	jumpHeight: number;
	startX: number;
	startY: number;
	speedJump: number;
	gravity: number;
	private deathTween: ((ticker: Ticker) => void) | null;

	constructor(app: Application) {
		this.app = app;
		this.currentSprite = null;
		this.animRun = null;
		this.animJump = null;
		this.isJumping = false;
		this.dying = false;
		this.jumpHeight = 50;
		this.startX = app.screen.width / 10;
		this.startY = app.screen.height / 1.3;
		this.speedJump = 0;
		this.gravity = 0.5;
		this.deathTween = null;
	}

	async createAnimRun(): Promise<void> {
		await Assets.load('./assets/game/player.png');

		// Build the frames and animation lists for the sprite sheet.
		const frames: SpritesheetData['frames'] = {};

		const run: string[] = [];
		for (let i = 0; i < 8; i++) {
			frames[`run${i}`] = {
				frame: { x: 128 * i, y: 0, w: 128, h: 128 },
				sourceSize: { w: 128, h: 128 },
				spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 },
			};
			run.push(`run${i}`);
		}

		const jump: string[] = [];
		for (let i = 0; i < 12; i++) {
			frames[`jump${i}`] = {
				frame: { x: 128 * i, y: 128, w: 128, h: 128 },
				sourceSize: { w: 128, h: 128 },
				spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 },
			};
			jump.push(`jump${i}`);
		}

		// Create object to store sprite sheet data
		const atlasRun: SpritesheetData = {
			frames,
			meta: {
				image: './assets/game/player.png',
				format: 'RGBA8888',
				size: { w: 1536, h: 256 },
				scale: 1,
			},
			animations: { run, jump },
		};

		// Create the SpriteSheet from data and image
		const spritesheet = new Spritesheet(
			Texture.from(atlasRun.meta.image!),
			atlasRun,
		);

		// Generate all the Textures asynchronously
		await spritesheet.parse();

		// spritesheet is ready to use!
		this.animRun = new AnimatedSprite(spritesheet.animations.run);
		this.animJump = new AnimatedSprite(spritesheet.animations.jump);

		this.currentSprite = this.animRun;

		this.currentSprite.x = this.startX;
		this.currentSprite.y = this.startY;
		this.currentSprite.anchor.set(0.5);
		this.currentSprite.animationSpeed = 0.2;
		this.currentSprite.zIndex = 10;
		this.currentSprite.play();
		this.app.stage.addChild(this.currentSprite);

		if (utils.isMobileDevice()) this.currentSprite.scale.set(0.5);
	}

	GetBounds() {
		const bounds = this.currentSprite!.getBounds();
		if (!utils.isMobileDevice()) {
			bounds.x += 55;
			bounds.width -= 90;
			bounds.y += 70;
			bounds.height -= 70;
		} else {
			bounds.x += 20;
			bounds.width -= 40;
			bounds.y += 35;
			bounds.height -= 40;
		}
		return bounds;
	}

	SwitchToAnim(anim: AnimatedSprite): void {
		const current = this.currentSprite!;
		current.stop();
		this.app.stage.removeChild(current);
		this.currentSprite = anim;
		this.currentSprite.anchor.set(0.5);
		this.currentSprite.x = this.startX;
		this.currentSprite.y = this.startY;
		this.currentSprite.animationSpeed = 0.2;
		this.currentSprite.zIndex = 10;
		if (utils.isMobileDevice()) this.currentSprite.scale.set(0.5);
		this.currentSprite.play();
		this.app.stage.addChild(this.currentSprite);
	}

	Jump(): void {
		this.SwitchToAnim(this.animJump!);
		this.isJumping = true;
		if (utils.isMobileDevice()) {
			this.speedJump = -6;
			this.gravity = 0.3;
		} else {
			this.speedJump = -10;
			this.gravity = 0.5;
		}
	}

	// Stops the run/jump animation and plays a short spin-and-shrink so getting hit
	// reads as an actual death (a "poof" disappearance) instead of the character
	// carrying on running in place.
	Die(): void {
		if (this.dying) return;
		this.dying = true;

		const sprite = this.currentSprite!;
		sprite.stop();
		// A bright yellow flash reads clearly against the road, the night sky and
		// both car colors alike (a red tint would blend into a red obstacle car,
		// and white is indistinguishable from the sprite's normal, untinted state).
		sprite.tint = 0xffe066;

		const baseScaleX = sprite.scale.x;
		const baseScaleY = sprite.scale.y;

		this.deathTween = (ticker: Ticker) => {
			sprite.rotation += 0.08 * ticker.deltaTime;
			sprite.alpha = Math.max(0, sprite.alpha - 0.03 * ticker.deltaTime);
			sprite.scale.set(baseScaleX * sprite.alpha, baseScaleY * sprite.alpha);
			if (sprite.alpha <= 0 && this.deathTween) {
				this.app.ticker.remove(this.deathTween);
				this.deathTween = null;
			}
		};
		this.app.ticker.add(this.deathTween);
	}

	Restart(): void {
		if (this.deathTween) {
			this.app.ticker.remove(this.deathTween);
			this.deathTween = null;
		}
		this.dying = false;
		const scale = utils.isMobileDevice() ? 0.5 : 1;
		this.currentSprite!.tint = 0xffffff;
		this.currentSprite!.alpha = 1;
		this.currentSprite!.rotation = 0;
		this.currentSprite!.scale.set(scale);
		this.currentSprite!.y = this.startY;
		this.isJumping = false;
		this.speedJump = 0;
		this.SwitchToAnim(this.animRun!);
	}

	Update(delta: Ticker): void {
		if (this.isJumping) {
			const current = this.currentSprite!;
			current.y += this.speedJump * delta.deltaTime;
			this.speedJump += this.gravity * delta.deltaTime;

			if (current.y >= this.startY) {
				current.y = this.startY;
				this.isJumping = false;
				this.SwitchToAnim(this.animRun!);
			}
		}
	}
}
