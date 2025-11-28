import { Point, Bounds, GameObject } from './interfaces';
/**
 * Game constants
 */
export declare const CANVAS_WIDTH = 800;
export declare const CANVAS_HEIGHT = 500;
export declare const PLAYER_WIDTH = 60;
export declare const PLAYER_HEIGHT = 20;
export declare const PLAYER_SPEED = 8;
export declare const GAME_DURATION = 30;
export declare const SPAWN_INTERVAL = 800;
/**
 * Game state enumeration
 */
export declare enum GameState {
    STOPPED = "STOPPED",
    RUNNING = "RUNNING",
    PAUSED = "PAUSED",
    GAME_OVER = "GAME_OVER",
    WON = "WON"
}
/**
 * Colors available for falling objects
 */
export declare const COLORS: string[];
/**
 * Abstract base class for all game objects
 */
export declare abstract class BaseGameObject implements GameObject {
    location: Point;
    speed: number;
    protected size: number;
    protected color: string;
    protected rotation: number;
    protected rotationSpeed: number;
    constructor();
    /**
     * Move the object - default behavior is to fall down
     */
    move(): void;
    /**
     * Get the bounding box for collision detection
     */
    getBounds(): Bounds;
    /**
     * Check for collision with another game object using AABB collision detection
     */
    hasCollision(gameObject: GameObject): boolean;
    /**
     * Check if object has moved off the bottom of the screen
     */
    isOffScreen(): boolean;
    /**
     * Draw the object on the canvas - must be implemented by subclasses
     */
    abstract draw(ctx: CanvasRenderingContext2D): void;
    /**
     * Get the size of the object
     */
    getSize(): number;
    /**
     * Get the color of the object
     */
    getColor(): string;
    /**
     * Get the rotation angle
     */
    getRotation(): number;
}
//# sourceMappingURL=BaseGameObject.d.ts.map