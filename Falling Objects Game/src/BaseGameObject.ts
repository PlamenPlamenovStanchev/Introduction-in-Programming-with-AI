import { Point, Bounds, GameObject } from './interfaces';

/**
 * Game constants
 */
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 500;
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 20;
export const PLAYER_SPEED = 8;
export const GAME_DURATION = 30; // seconds
export const SPAWN_INTERVAL = 800; // milliseconds

/**
 * Game state enumeration
 */
export enum GameState {
    STOPPED = 'STOPPED',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
    WON = 'WON'
}

/**
 * Colors available for falling objects
 */
export const COLORS: string[] = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#FF6F61'
];

/**
 * Abstract base class for all game objects
 */
export abstract class BaseGameObject implements GameObject {
    location: Point;
    speed: number;
    protected size: number;
    protected color: string;
    protected rotation: number;
    protected rotationSpeed: number;

    constructor() {
        this.size = Math.random() * 25 + 20;
        this.location = {
            x: Math.random() * (CANVAS_WIDTH - this.size),
            y: -this.size
        };
        this.speed = Math.random() * 2 + 1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    /**
     * Move the object - default behavior is to fall down
     */
    move(): void {
        this.location.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    /**
     * Get the bounding box for collision detection
     */
    getBounds(): Bounds {
        return {
            x: this.location.x,
            y: this.location.y,
            width: this.size,
            height: this.size
        };
    }

    /**
     * Check for collision with another game object using AABB collision detection
     */
    hasCollision(gameObject: GameObject): boolean {
        const bounds1 = this.getBounds();
        const bounds2 = gameObject.getBounds();

        return (
            bounds1.x < bounds2.x + bounds2.width &&
            bounds1.x + bounds1.width > bounds2.x &&
            bounds1.y < bounds2.y + bounds2.height &&
            bounds1.y + bounds1.height > bounds2.y
        );
    }

    /**
     * Check if object has moved off the bottom of the screen
     */
    isOffScreen(): boolean {
        return this.location.y > CANVAS_HEIGHT + this.size;
    }

    /**
     * Draw the object on the canvas - must be implemented by subclasses
     */
    abstract draw(ctx: CanvasRenderingContext2D): void;

    /**
     * Get the size of the object
     */
    getSize(): number {
        return this.size;
    }

    /**
     * Get the color of the object
     */
    getColor(): string {
        return this.color;
    }

    /**
     * Get the rotation angle
     */
    getRotation(): number {
        return this.rotation;
    }
}
