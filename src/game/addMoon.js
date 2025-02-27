import { Assets, Sprite } from 'pixi.js';
import * as utils from './Utils.js';

export async function addMoon(app) {
     // Load the moon texture
     const texture = await Assets.load('./assets/game/moon.svg');

     // Create a moon Sprite
     const moon = new Sprite(texture);
 
     // Center the sprite's anchor point
     moon.anchor.set(0.5);
    
     if (utils.isMobileDevice()) {
         moon.scale.set(0.4);
     }
     else moon.scale.set(0.7);

    // Position the moon.
     if (utils.isMobileDevice()) {
          moon.x = 1 * app.screen.width / 4;
     }
     else moon.x = 3 * app.screen.width / 4;

     moon.y = app.screen.height / 6;
 
     app.stage.addChild(moon);
}