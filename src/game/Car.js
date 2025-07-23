import { Assets, Graphics, Sprite } from 'pixi.js';
import * as utils from './Utils.js';

export class Car {
    constructor(app) {
        this.app = app;
        this.sprite = null;
        this.textureRed = null;
        this.textureBlue = null;
        this.speed = 13;
        this.speedJump = 0;
        this.gravity = 0.5;
        this.isJumping = false;
        this.startY = 0;
        this.startX = 0;
    }

    Restart() {
        this.sprite.x = this.startX;
        this.sprite.y = this.startY;
        this.isJumping = false;
        if (utils.isMobileDevice())
            this.speed = 8;
        else
            this.speed = 13;
    }

    Update(time, increaseSpeed) {
        this.sprite.x -= time.deltaTime * this.speed;
        this.speed += increaseSpeed; // Increment speed slightly each frame.
        if (this.sprite.x < -this.app.screen.width) {
            this.isJumping = false;
            this.sprite.x = this.startX;
            this.sprite.y = this.startY;
            this.sprite.texture = Math.random() < 0.5 ? this.textureRed : this.textureBlue;
        }
        if (this.sprite.x < 3 * this.app.screen.width / 5 && !this.isJumping && this.sprite.texture === this.textureBlue) {
            this.isJumping = true;
            if (utils.isMobileDevice()) {
                this.speedJump = -8;
            }
            else {
                this.speedJump = -11;
            }
        }
        if (this.isJumping) {
            this.sprite.y += this.speedJump * time.deltaTime;
            this.speedJump += this.gravity * time.deltaTime;

            if (this.sprite.y >= this.startY) {
                this.sprite.y = this.startY;
                this.isJumping = false;
            }
        }
    }

    GetBounds() {
        let bounds = this.sprite.getBounds();
        bounds.x += 10;
        bounds.width -= 20;
        bounds.y += 10;
        bounds.height -= 20;
        return bounds;
    }

    async createCar() {
        let texture = null;
        this.textureRed = await Assets.load('./assets/game/car.png');
        this.textureBlue = await Assets.load('./assets/game/carBlue.png');
        texture = Math.random() < 0.5 ? this.textureRed : this.textureBlue;
        const car = new Sprite(texture);
        this.sprite = car;
        if (utils.isMobileDevice()) {
            this.speed = 8;
            car.scale.set(0.15);
        }
        else car.scale.set(0.25);
        car.anchor.x = 0;
        car.anchor.y = 1;
        car.scale.x *= -1;
        this.startX = this.app.screen.width + car.width;
        car.x = this.startX;
        this.startY = this.app.screen.height / 1.07;
        car.y = this.startY;
        this.app.stage.addChild(car);
    }
}