import { Assets, Graphics, Text, TextStyle } from 'pixi.js';

export class Button {
    constructor(posX, posY, width, height, radius) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.radius = radius
        this.onClick = null;
        this.text = null;
        this.textObj = null;
        this.obj = null;
    }

    Start(app)
    {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            stroke: { color: '#4a1850', width: 5, join: 'round' },
            dropShadow: {
                color: '#000000',
                blur: 4,
                angle: Math.PI / 6,
                distance: 6,
            },
            wordWrap: true,
            wordWrapWidth: 440,
        });
        this.textObj = new Text({ 
            text: this.text,
            style 
        });
        this.textObj.tint = 0xffffff;
        this.textObj.anchor.set(0.5);
        this.textObj.x = this.posX;
        this.textObj.y = this.posY;
        this.obj = new Graphics().roundRect(this.posX - this.width/2, this.posY - this.height/2, this.width, this.height, this.radius).fill({ color: '#1B1B1B' });
        app.stage.addChild(this.obj);
        app.stage.addChild(this.textObj);

        this.obj.interactive = true;
        this.obj.on('pointerdown', this.onClick);
    }

    Destroy(app)
    {
        app.stage.removeChild(this.obj);
        app.stage.removeChild(this.textObj);
    }
}


