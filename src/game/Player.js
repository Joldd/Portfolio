import { AnimatedSprite, Assets, Texture, Spritesheet, Graphics } from 'pixi.js';

// Class for handling the character Spine and its animations.
export class Player {
    constructor(app) {
        this.app = app;
        this.currentSprite = null;
        this.isJumping = false;
        this.jumpHeight = 50;
        this.startX = app.screen.width / 10;
        this.startY = app.screen.height / 1.3;
        this.speedJump = 0;
        this.gravity = 0.5;
        this.bounds = null;
    }

    async createAnimRun() {
        const texture = await Assets.load('./assets/game/player.png');
        // Create object to store sprite sheet data
        const altasRun = {
            frames: {},
            meta: {
                image: './assets/game/player.png',
                format: 'RGBA8888',
                size: { w: 1536, h: 256 },
                scale: 1
            },
            animations: {}
        }

        // Add frames and animation to the object
        // RUN
        const run = [];
        for (let i = 0; i < 8; i++) {
            altasRun.frames[`run${i}`] = {
                frame: { x: 128 * i, y: 0, w: 128, h: 128 },
                sourceSize: { w: 128, h: 128 },
                spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
            }
            run.push(`run${i}`);
        }
        altasRun.animations.run = run;

        // JUMP
        const jump = [];
        for (let i = 0; i < 12; i++) {
            altasRun.frames[`jump${i}`] = {
                frame: { x: 128 * i, y: 128, w: 128, h: 128 },
                sourceSize: { w: 128, h: 128 },
                spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
            }
            jump.push(`jump${i}`);
        }
        altasRun.animations.jump = jump;

        // Create the SpriteSheet from data and image
        const spritesheet = new Spritesheet(
            Texture.from(altasRun.meta.image),
            altasRun
        );

        // Generate all the Textures asynchronously
        await spritesheet.parse();

        // spritesheet is ready to use!
        this.animRun = new AnimatedSprite(spritesheet.animations.run);
        this.animJump = new AnimatedSprite(spritesheet.animations.jump);

        this.currentSprite = this.animRun;

        this.currentSprite.x = this.startX;
        this.currentSprite.y = this.startY;
        this.currentSprite.anchor.set(0.5);
        this.currentSprite.animationSpeed = 0.2;
        this.currentSprite.play();
        this.app.stage.addChild(this.currentSprite);
    }

    GetBounds() 
    {
        let bounds = this.currentSprite.getBounds();
        bounds.x += 40;
        bounds.width -= 80;
        bounds.height -= 10;

        return bounds;
    }

    SwitchToAnim(anim) {
        this.currentSprite.stop();
        this.app.stage.removeChild(this.currentSprite);
        this.currentSprite = anim;
        this.currentSprite.anchor.set(0.5);
        this.currentSprite.x = this.startX;
        this.currentSprite.y = this.startY;
        this.currentSprite.animationSpeed = 0.2;
        this.currentSprite.play();
        this.app.stage.addChild(this.currentSprite);
    }

    Jump() {
        this.SwitchToAnim(this.animJump);
        this.isJumping = true;
        this.speedJump = -10;      
    }

    Update(delta){
        if (this.isJumping){
            this.currentSprite.y += this.speedJump * delta.deltaTime;
            this.speedJump += this.gravity * delta.deltaTime;

            if (this.currentSprite.y >= this.startY) {
                this.currentSprite.y = this.startY;
                this.isJumping = false;
                this.SwitchToAnim(this.animRun);
            }
        }
    }
}
