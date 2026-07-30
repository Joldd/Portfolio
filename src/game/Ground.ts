import { Application, Graphics, type Ticker } from 'pixi.js';
import * as utils from './Utils.js';

export class Ground {
	app: Application;
	road: Graphics | null;
	stripes: Graphics[];
	spacing: number;
	count: number;
	speed: number;

	constructor(app: Application) {
		this.app = app;
		this.road = null;
		this.stripes = [];
		this.spacing = 125;
		this.count = 0;
		this.speed = 3;
	}

	AddRoad(): void {
		this.road = new Graphics()
			.rect(
				0,
				(7 * this.app.screen.height) / 8,
				this.app.screen.width,
				this.app.screen.height / 8,
			)
			.fill({ color: '#1b1b1b' });
		this.app.stage.addChild(this.road);

		// Enough stripes to fully tile the current screen width, plus a couple
		// extra so the belt always has one wrapping in from off-screen.
		this.count = Math.ceil(this.app.screen.width / this.spacing) + 2;

		for (let i = 0; i < this.count; i++) {
			const s = this.CreateStripe();
			s.x = i * this.spacing;
			this.stripes.push(s);
			this.app.stage.addChild(s);
		}
	}

	Resize(): void {
		// Rebuild the road and the stripe belt so they always cover the current screen width.
		if (this.road) this.app.stage.removeChild(this.road);
		this.stripes.forEach((s) => this.app.stage.removeChild(s));
		this.stripes = [];
		this.AddRoad();
	}

	Restart(): void {
		this.speed = 3;
	}

	Update(time: Ticker, increaseSpeed: number): void {
		this.speed += increaseSpeed;
		this.stripes.forEach((s) => {
			s.x -= time.deltaTime * this.speed;
			if (s.x <= -this.spacing) {
				s.x += this.count * this.spacing;
			}
		});
	}

	CreateStripe(): Graphics {
		const stripe = new Graphics()
			.rect(
				0,
				(46.5 * this.app.screen.height) / 50,
				this.app.screen.width / 50,
				this.app.screen.height / 50,
			)
			.fill({ color: '#ffffff' });
		if (utils.isMobileDevice()) stripe.width = this.app.screen.width / 20;
		return stripe;
	}
}
