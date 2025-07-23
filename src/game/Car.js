import { Assets, Sprite } from 'pixi.js';
import * as utils from './Utils.js';

export class Car {
    constructor(app) {
        this.app = app;
        this.sprite = null;
        this.currentTexture = null;
        this.textureRed = null;
        this.textureBlue = null;
        this.speed = 13;
    }

    Restart() {
        this.sprite.x = this.app.screen.width + this.sprite.width;
        this.speed = 13;
    }

    Update(time, increaseSpeed) {
        this.sprite.x -= time.deltaTime * this.speed;
        this.speed += increaseSpeed; // Increment speed slightly each frame.
        if (this.sprite.x < -this.app.screen.width) {
            this.sprite.x = this.app.screen.width + this.sprite.width;
            this.sprite.texture = Math.random() < 0.5 ? this.textureRed : this.textureBlue;
        }
    }

    async createCar() {
        this.textureRed = await Assets.load('./assets/game/car.png');
        this.textureBlue = await Assets.load('./assets/game/carBlue.png');
        Math.random() < 0.5 ? this.currentTexture = this.textureRed : this.currentTexture = this.textureBlue;
        const car = new Sprite(this.currentTexture);
        this.sprite = car;
        if (utils.isMobileDevice()) {
            this.speed = 8;
            car.scale.set(0.15);
        }
        else car.scale.set(0.25);
        car.anchor.x = 0;
        car.anchor.y = 1;
        car.scale.x *= -1;
        car.x = this.app.screen.width + car.width;
        car.y = this.app.screen.height / 1.07;
        this.app.stage.addChild(car);
    }
}


