import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED } from './BaseGameObject';
/**
 * Player class - represents the player at the bottom of the screen
 * Properties: location, width, height, color, borderColor
 * Methods: moveLeft(), moveRight()
 */
export class Player {
    constructor(location, width, height, color, borderColor) {
        this.width = width ?? PLAYER_WIDTH;
        this.height = height ?? PLAYER_HEIGHT;
        this.location = location ?? {
            x: (CANVAS_WIDTH - this.width) / 2,
            y: CANVAS_HEIGHT - this.height - 10
        };
        this.speed = PLAYER_SPEED;
        this.color = color ?? '#4CAF50';
        this.borderColor = borderColor ?? '#2E7D32';
    }
    /**
     * Move the player - controlled by keyboard input
     * This method is called by the game loop but actual movement
     * is handled by moveLeft() and moveRight()
     */
    move() {
        // Player movement is handled by moveLeft/moveRight based on input
    }
    /**
     * Move the player to the left
     */
    moveLeft() {
        this.location.x -= this.speed;
        this.constrainToBounds();
    }
    /**
     * Move the player to the right
     */
    moveRight() {
        this.location.x += this.speed;
        this.constrainToBounds();
    }
    /**
     * Keep player within the canvas bounds
     */
    constrainToBounds() {
        this.location.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, this.location.x));
    }
    /**
     * Get the bounding box for collision detection
     */
    getBounds() {
        return {
            x: this.location.x,
            y: this.location.y,
            width: this.width,
            height: this.height
        };
    }
    /**
     * Check for collision with another game object
     */
    hasCollision(gameObject) {
        const bounds1 = this.getBounds();
        const bounds2 = gameObject.getBounds();
        return (bounds1.x < bounds2.x + bounds2.width &&
            bounds1.x + bounds1.width > bounds2.x &&
            bounds1.y < bounds2.y + bounds2.height &&
            bounds1.y + bounds1.height > bounds2.y);
    }
    /**
     * Draw the player as a spaceship-like triangle
     */
    draw(ctx) {
        ctx.save();
        // Draw player shape
        ctx.beginPath();
        ctx.moveTo(this.location.x + this.width / 2, this.location.y);
        ctx.lineTo(this.location.x + this.width, this.location.y + this.height);
        ctx.lineTo(this.location.x, this.location.y + this.height);
        ctx.closePath();
        // Fill
        ctx.fillStyle = this.color;
        ctx.fill();
        // Border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    /**
     * Reset player to starting position
     */
    reset() {
        this.location = {
            x: (CANVAS_WIDTH - this.width) / 2,
            y: CANVAS_HEIGHT - this.height - 10
        };
    }
}
//# sourceMappingURL=Player.js.map