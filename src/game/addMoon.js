import { Assets, Sprite } from 'pixi.js';

export async function addMoon(app) {
     // Load the moon texture
     const texture = await Assets.load('./assets/game/moon.svg');

     // Create a moon Sprite
     const moon = new Sprite(texture);
 
     // Center the sprite's anchor point
     moon.anchor.set(0.5);
    
     moon.scale.set(0.7);
    // Position the moon.
    moon.x = 3 *app.screen.width / 4 + 100;
    moon.y = app.screen.height / 6;
 
     app.stage.addChild(moon);
}