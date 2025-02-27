import { Graphics } from 'pixi.js';

export function addGround(app)
{
   
    const road = new Graphics().rect(0, 7 * app.screen.height / 8, app.screen.width, app.screen.height / 8).fill({ color: '#1B1B1B' });
    app.stage.addChild(road);

    const spacing = 125;
    const count = 12;
    
    let stripes = [];
    for (let i = 0; i < count; i++)
    {
        const s = createStripe(app);
        s.x = i * spacing;
        stripes.push(s);
        app.stage.addChild(s);
    }
    app.ticker.add((time) =>
    {
        stripes.forEach(s => {
            s.x -= time.deltaTime * 3;
            if (s.x <= -spacing)
            {
                s.x += count * spacing;
            }
        });
    });
}

function createStripe(app){
    const stripe = new Graphics().rect(0, 46.5 * app.screen.height / 50, app.screen.width / 50, app.screen.height / 50).fill({ color: '#FFFFFF' });
    return stripe;
}
