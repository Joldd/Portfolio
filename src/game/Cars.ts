import { Application, type Ticker } from 'pixi.js';
import { Car } from './Car.js';
import * as utils from './Utils.js';

interface CollisionBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

function testCollision(a: CollisionBounds, b: CollisionBounds): boolean {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}

export class Cars {
	app: Application;
	list: Car[];
	speed: number;
	private distanceToNextSpawn: number;

	constructor(app: Application) {
		this.app = app;
		this.list = [];
		this.speed = utils.isMobileDevice() ? 5 : 7;
		this.distanceToNextSpawn = 0;
	}

	async Start(): Promise<void> {
		// Spawn the first obstacle almost right away so the road doesn't feel empty at the start.
		await this.Spawn();
		this.ScheduleNext(true);
	}

	Restart(): void {
		this.list.forEach((car) => car.Destroy());
		this.list = [];
		this.speed = utils.isMobileDevice() ? 5 : 7;
		void this.Start();
	}

	Update(time: Ticker, increaseSpeed: number, playerX: number): void {
		this.speed += increaseSpeed;
		const dx = time.deltaTime * this.speed;

		this.distanceToNextSpawn -= dx;
		if (this.distanceToNextSpawn <= 0) {
			void this.Spawn();
			this.ScheduleNext();
		}

		for (let i = this.list.length - 1; i >= 0; i--) {
			const car = this.list[i];
			car.Update(time, this.speed, playerX);
			if (car.IsOffScreen()) {
				car.Destroy();
				this.list.splice(i, 1);
			}
		}
	}

	CheckCollision(playerBounds: CollisionBounds): boolean {
		return this.list.some((car) =>
			testCollision(playerBounds, car.GetBounds()),
		);
	}

	private ScheduleNext(first = false): void {
		// Expressed as a number of frames' worth of travel at the current speed, so the
		// gap keeps roughly the same *time* budget to react as the game speeds up.
		// The very first gap is generous on purpose (easing the player in); later gaps
		// are deliberately wide-ranging so the spacing doesn't feel like a metronome.
		const [minFrames, maxFrames] = first ? [75, 115] : [45, 170];
		const frames = minFrames + Math.random() * (maxFrames - minFrames);
		this.distanceToNextSpawn = frames * this.speed;
	}

	private async Spawn(): Promise<void> {
		const car = new Car(this.app);
		const isJumper = Math.random() < 0.5;
		// Small random offset so simultaneous obstacles don't line up perfectly.
		await car.createCar(Math.random() * 40, isJumper);
		this.list.push(car);
	}
}
