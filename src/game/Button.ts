import {
	Application,
	Container,
	Graphics,
	Text,
	TextStyle,
	type Ticker,
} from 'pixi.js';

export class Button {
	posX: number;
	posY: number;
	width: number;
	height: number;
	radius: number;
	onClick: (() => void) | null;
	text: string;
	container: Container | null;
	private fadeIn: ((ticker: Ticker) => void) | null;

	constructor(
		posX: number,
		posY: number,
		width: number,
		height: number,
		radius: number,
	) {
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.onClick = null;
		this.text = '';
		this.container = null;
		this.fadeIn = null;
	}

	Start(app: Application): void {
		const style = new TextStyle({
			fontFamily: 'Arial',
			fontSize: 36,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: '#4a1850',
			wordWrap: true,
			wordWrapWidth: 440,
		});
		const textObj = new Text({ text: this.text, style });
		textObj.anchor.set(0.5);

		const background = new Graphics()
			.roundRect(
				-this.width / 2,
				-this.height / 2,
				this.width,
				this.height,
				this.radius,
			)
			.fill({ color: '#d68334' });

		const container = new Container();
		container.addChild(background, textObj);
		container.x = this.posX;
		container.y = this.posY;
		container.alpha = 0;
		container.scale.set(0.9);
		container.zIndex = 20;
		container.eventMode = 'static';
		container.cursor = 'pointer';

		container.on('pointerdown', () => this.onClick?.());
		container.on('pointerover', () => container.scale.set(1.06));
		container.on('pointerout', () => container.scale.set(1));

		this.container = container;
		app.stage.addChild(container);

		// Ease the button in so the game-over transition feels less abrupt.
		this.fadeIn = (ticker: Ticker) => {
			const t = Math.min(1, container.alpha + ticker.deltaTime * 0.12);
			container.alpha = t;
			container.scale.set(0.9 + t * 0.1);
			if (t >= 1 && this.fadeIn) {
				app.ticker.remove(this.fadeIn);
				this.fadeIn = null;
			}
		};
		app.ticker.add(this.fadeIn);
	}

	Destroy(app: Application): void {
		if (this.fadeIn) {
			app.ticker.remove(this.fadeIn);
			this.fadeIn = null;
		}
		if (this.container) {
			app.stage.removeChild(this.container);
			this.container = null;
		}
	}
}
