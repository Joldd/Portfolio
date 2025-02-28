import { Graphics } from 'pixi.js';

export function addBackGround(app)
{

    const backGround = new Graphics().rect(0, 0, app.screen.width, app.screen.height).fill({ color: '#021f4b' });
    backGround.interactive = true;
    // Add the ground to the stage.
    app.stage.addChild(backGround);
    return backGround;
}
