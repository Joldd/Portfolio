import { Graphics } from 'pixi.js';
import * as utils from './Utils.js';

export class Ground {
    constructor(app) {
        this.app = app;
        this.road = null;
        this.stripes = [];
        this.spacing = 125;
        this.count = 12;
        this.speed = 3;
    }

    AddRoad() {
        this.road = new Graphics().rect(0, 7 * this.app.screen.height / 8, this.app.screen.width, this.app.screen.height / 8).fill({ color: '#1B1B1B' });
        this.app.stage.addChild(this.road);

        for (let i = 0; i < this.count; i++) {
            const s = this.CreateStripe(this.app);
            console.log(s);
            s.x = i * this.spacing;
            this.stripes.push(s);
            this.app.stage.addChild(s);
        }
    }

    Restart() {
        this.speed = 3;
    }

    Update(time, increaseSpeed) {
        this.speed += increaseSpeed;
        this.stripes.forEach(s => {
            s.x -= time.deltaTime * this.speed;
            if (s.x <= -this.spacing) {
                s.x += this.count * this.spacing;
            }
        });
    }

    CreateStripe() {
        const stripe = new Graphics().rect(0, 46.5 * this.app.screen.height / 50, this.app.screen.width / 50, this.app.screen.height / 50).fill({ color: '#FFFFFF' });
        if (utils.isMobileDevice()) stripe.width = this.app.screen.width / 20;
        return stripe;
    }
}