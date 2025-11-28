import { Point, Bounds, GameObject } from './interfaces';
/**
 * Player class - represents the player at the bottom of the screen
 * Properties: location, width, height, color, borderColor
 * Methods: moveLeft(), moveRight()
 */
export declare class Player implements GameObject {
    location: Point;
    speed: number;
    width: number;
    height: number;
    color: string;
    borderColor: string;
    constructor(location?: Point, width?: number, height?: number, color?: string, borderColor?: string);
    /**
     * Move the player - controlled by keyboard input
     * This method is called by the game loop but actual movement
     * is handled by moveLeft() and moveRight()
     */
    move(): void;
    /**
     * Move the player to the left
     */
    moveLeft(): void;
    /**
     * Move the player to the right
     */
    moveRight(): void;
    /**
     * Keep player within the canvas bounds
     */
    private constrainToBounds;
    /**
     * Get the bounding box for collision detection
     */
    getBounds(): Bounds;
    /**
     * Check for collision with another game object
     */
    hasCollision(gameObject: GameObject): boolean;
    /**
     * Draw the player as a spaceship-like triangle
     */
    draw(ctx: CanvasRenderingContext2D): void;
    /**
     * Reset player to starting position
     */
    reset(): void;
}
//# sourceMappingURL=Player.d.ts.map