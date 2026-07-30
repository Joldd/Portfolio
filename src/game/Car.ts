import {
	Application,
	Assets,
	Graphics,
	Sprite,
	Texture,
	type Ticker,
} from 'pixi.js';
import * as utils from './Utils.js';

// Wheel positions in carBlue.png's own texture space (measured from the source
// image: 668x192, anchor at bottom-left), used to bolt on the "spring" cue below.
const REAR_WHEEL_X = 123;
const FRONT_WHEEL_X = 523;
const WHEEL_TOP_Y = -98; // local Y (bottom-left-anchored, so negative is "up")
const SPRING_COLOR = 0xffcc00;

// A cartoon coil spring, telegraphing that this car hops - drawn as an overlay
// rather than baked into the sprite sheet, since only the jumper skin needs it.
function drawSpring(wheelX: number): Graphics {
	const spring = new Graphics();
	const zigzagWidth = 15;
	const bottomY = WHEEL_TOP_Y + 6;
	const topY = WHEEL_TOP_Y - 42;
	const points = [
		{ x: wheelX, y: bottomY },
		{ x: wheelX + zigzagWidth, y: bottomY - (bottomY - topY) * 0.25 },
		{ x: wheelX - zigzagWidth, y: bottomY - (bottomY - topY) * 0.5 },
		{ x: wheelX + zigzagWidth, y: bottomY - (bottomY - topY) * 0.75 },
		{ x: wheelX, y: topY },
	];
	spring.moveTo(points[0].x, points[0].y);
	for (const p of points.slice(1)) spring.lineTo(p.x, p.y);
	spring.stroke({ width: 6, color: SPRING_COLOR, cap: 'round', join: 'round' });
	return spring;
}

// The blue variant leaps into the air as it nears the player and holds that
// height while it passes over them - staying on the ground is enough to dodge
// it, jumping into it is what gets you hit. The height is driven purely by
// horizontal distance to the player (not a ballistic arc timed to line up),
// so it's guaranteed to already be clear for the player's *entire* pass-by
// window, not just at one precisely-timed instant.
const HOVER_HALF_WIDTH = 190; // px: half-width of the "must be at full height" zone
const TRANSITION_WIDTH = 140; // px: distance over which it rises/falls
const HOVER_HEIGHT = 150; // px above the road

export class Car {
	app: Application;
	sprite: Sprite | null;
	isJumper: boolean;
	private groundY: number;
	private baseScaleX: number;
	private baseScaleY: number;

	constructor(app: Application) {
		this.app = app;
		this.sprite = null;
		this.isJumper = false;
		this.groundY = 0;
		this.baseScaleX = 1;
		this.baseScaleY = 1;
	}

	Update(time: Ticker, speed: number, playerX: number): void {
		const sprite = this.sprite!;
		sprite.x -= time.deltaTime * speed;

		if (!this.isJumper) return;

		const signedDistance = sprite.x - playerX;
		const distance = Math.abs(signedDistance);
		let t: number; // 0 = grounded, 1 = full hover height
		if (distance <= HOVER_HALF_WIDTH) {
			t = 1;
		} else if (distance >= HOVER_HALF_WIDTH + TRANSITION_WIDTH) {
			t = 0;
		} else {
			t = 1 - (distance - HOVER_HALF_WIDTH) / TRANSITION_WIDTH;
		}
		sprite.y = this.groundY - HOVER_HEIGHT * t;

		// Squash right off the ground (coiling up on the springs), then stretch
		// tall through the rise and hover - mirrored again on the way down.
		const stretch =
			t < 0.25 ? 1 - 0.15 * (1 - t / 0.25) : 1 + 0.15 * ((t - 0.25) / 0.75);
		sprite.scale.y = this.baseScaleY * stretch;
		sprite.scale.x = this.baseScaleX / stretch;

		// A light nose-up/nose-down tilt while airborne, for a bit of bounce.
		sprite.rotation = (signedDistance > 0 ? -0.05 : 0.05) * t;
	}

	IsOffScreen(): boolean {
		return this.sprite!.x < -this.sprite!.width;
	}

	GetBounds() {
		const bounds = this.sprite!.getBounds();
		bounds.x += 10;
		bounds.width -= 20;
		bounds.y += 10;
		bounds.height -= 20;
		return bounds;
	}

	Destroy(): void {
		this.app.stage.removeChild(this.sprite!);
		this.sprite!.destroy();
	}

	async createCar(spawnOffset: number, isJumper: boolean): Promise<void> {
		this.isJumper = isJumper;
		const texture: Texture = await Assets.load(
			isJumper ? './assets/game/carBlue.png' : './assets/game/car.png',
		);
		const car = new Sprite(texture);
		this.sprite = car;
		car.scale.set(utils.isMobileDevice() ? 0.15 : 0.25);
		car.anchor.x = 0;
		car.anchor.y = 1;
		car.scale.x *= -1;
		this.baseScaleX = car.scale.x;
		this.baseScaleY = car.scale.y;
		car.x = this.app.screen.width + car.width + spawnOffset;
		this.groundY = this.app.screen.height / 1.07;
		car.y = this.groundY;
		car.zIndex = 5;

		if (isJumper) {
			car.addChild(drawSpring(REAR_WHEEL_X), drawSpring(FRONT_WHEEL_X));
		}

		this.app.stage.addChild(car);
	}
}
