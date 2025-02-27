import { Assets, Sprite} from 'pixi.js';

export class Car {
    constructor(app) {
        this.app = app;
        this.sprite = null; 
        this.speed = 13;
    }

    Update(time){
        this.sprite.x -= time.deltaTime * this.speed;

        if (this.sprite.x < -this.app.screen.width){
            this.sprite.x = this.app.screen.width + this.sprite.width;
        }
    }

    async createCar(){
        const texture = await Assets.load('./assets/game/car.png');
        const car = new Sprite(texture);
        this.sprite = car;
        car.scale.set(0.25);
        car.anchor.x = 0;
        car.anchor.y = 1;
        car.scale.x *= -1;
        car.x = this.app.screen.width + car.width;
        car.y = this.app.screen.height / 1.07;
        this.app.stage.addChild(car);
    }
}


