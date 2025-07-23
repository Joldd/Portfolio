import { Graphics } from 'pixi.js';

export class Mountains {
    constructor(app) {
        this.app = app;
        this.group1 = null;
        this.group2 = null;
        this.speed = 0.5;
    }

    CreateMountainGroup() {
        // Create a graphics object to hold all the mountains in a group.
        const graphics = new Graphics();

        // Width of all the mountains.
        const width = this.app.screen.width / 2;

        // Starting point on the y-axis of all the mountains.
        // This is the bottom of the screen.
        const startY = this.app.screen.height;

        // Start point on the x-axis of the individual mountain.
        const startXLeft = 0;
        const startXMiddle = Number(this.app.screen.width) / 4;
        const startXRight = this.app.screen.width / 2;

        // Height of the individual mountain.
        const heightLeft = this.app.screen.height / 2;
        const heightMiddle = (this.app.screen.height * 4) / 5;
        const heightRight = (this.app.screen.height * 2) / 3;

        // Color of the individual mountain.
        const colorLeft = 0xc1c0c2;
        const colorMiddle = 0x7e818f;
        const colorRight = 0x8c919f;

        graphics
            // Draw the middle mountain
            .moveTo(startXMiddle, startY)
            .bezierCurveTo(
                startXMiddle + width / 2,
                startY - heightMiddle,
                startXMiddle + width / 2,
                startY - heightMiddle,
                startXMiddle + width,
                startY,
            )
            .fill({ color: colorMiddle })

            // Draw the left mountain
            .moveTo(startXLeft, startY)
            .bezierCurveTo(
                startXLeft + width / 2,
                startY - heightLeft,
                startXLeft + width / 2,
                startY - heightLeft,
                startXLeft + width,
                startY,
            )
            .fill({ color: colorLeft })

            // Draw the right mountain
            .moveTo(startXRight, startY)
            .bezierCurveTo(
                startXRight + width / 2,
                startY - heightRight,
                startXRight + width / 2,
                startY - heightRight,
                startXRight + width,
                startY,
            )
            .fill({ color: colorRight });

        return graphics;
    }

    AddMountains() {
        // Create two mountain groups where one will be on the screen and the other will be off screen.
        // When the first group moves off screen, it will be moved to the right of the second group.
        this.group1 = this.CreateMountainGroup(this.app);
        this.group2 = this.CreateMountainGroup(this.app);

        // Position the 2nd group off the screen to the right.
        this.group2.x = this.app.screen.width;

        // Add the mountain groups to the stage.
        this.app.stage.addChild(this.group1, this.group2);
    }

    Restart() {
        // Reset the speed and reposition the mountain groups.
        this.speed = 0.5;
        this.group1.x = 0;
        this.group2.x = this.app.screen.width;
    }

    Update(time, increaseSpeed) {

        // Calculate the amount of distance to move the mountain groups per tick.
        const dx = time.deltaTime * this.speed;
        this.speed += increaseSpeed; // Increment speed slightly each frame.

        // Move the mountain groups leftwards.
        this.group1.x -= dx;
        this.group2.x -= dx;

        // Reposition the mountain groups when they move off screen.
        if (this.group1.x <= -this.app.screen.width) {
            this.group1.x += this.app.screen.width * 2;
        }
        if (this.group2.x <= -this.app.screen.width) {
            this.group2.x += this.app.screen.width * 2;
        }

    }
}