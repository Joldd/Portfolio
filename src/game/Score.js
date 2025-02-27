import { Graphics, Text, TextStyle } from 'pixi.js';

export class Score {
    constructor() {
        this.score = 0;
        this.textObj = null;
        this.bestScore = 0;
        this.bestObj = null;
    }

    Start(app){
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 25,
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
            text: this.score.toString(),
            style 
        });
        this.bestObj = new Text({
            text: 'Record : ' + this.bestScore,
            style
        });
        this.textObj.y = 10;
        this.textObj.x = 10;
        this.bestObj.x = app.screen.width - this.bestObj.width - 25;
        this.bestObj.y = 10;
        app.stage.addChild(this.textObj);
        app.stage.addChild(this.bestObj);
    }
    
    Update(time){
        this.score += time.deltaTime / 10;
        this.textObj.text = this.score.toFixed(0);
    }

    Loose(){
        if (this.score > this.bestScore){
            this.bestScore = this.score;
            this.bestObj.text = 'Record : ' + this.bestScore.toFixed(0);
        }
        this.score = 0;
    }
}
