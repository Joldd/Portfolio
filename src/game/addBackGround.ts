import { Application, FillGradient, Graphics } from 'pixi.js';

export function addBackGround(app: Application): Graphics {
	// Subtle vertical gradient instead of a flat fill, for a bit more depth in the night sky.
	const gradient = new FillGradient({
		start: { x: 0, y: 0 },
		end: { x: 0, y: 1 },
		colorStops: [
			{ offset: 0, color: '#040a22' },
			{ offset: 0.6, color: '#0a1c4a' },
			{ offset: 1, color: '#1c3a73' },
		],
	});

	const backGround = new Graphics()
		.rect(0, 0, app.screen.width, app.screen.height)
		.fill(gradient);
	backGround.eventMode = 'static';
	backGround.cursor = 'pointer';
	// Add the background to the stage.
	app.stage.addChild(backGround);
	return backGround;
}
