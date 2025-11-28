import { Point, Bounds, GameObject } from './interfaces';
/**
 * FallingCircle - A colorful circle with certain size, which falls down with a fixed speed.
 * Properties: location, speed, radius, color, borderColor
 */
export declare class FallingCircle implements GameObject {
    location: Point;
    speed: number;
    radius: number;
    color: string;
    borderColor: string;
    constructor(location?: Point, speed?: number, radius?: number, color?: string, borderColor?: string);
    /**
     * Move the circle - falls straight down with fixed speed
     */
    move(): void;
    /**
     * Get the bounding box for collision detection
     */
    getBounds(): Bounds;
    /**
     * Check for collision with another game object
     */
    hasCollision(gameObject: GameObject): boolean;
    /**
     * Check if circle has moved off the bottom of the screen
     */
    isOffScreen(): boolean;
    /**
     * Draw the circle on the canvas
     */
    draw(ctx: CanvasRenderingContext2D): void;
    /**
     * Helper function to darken a color for the border
     */
    private darkenColor;
}
/**
 * RotatingFallingSquare - A colorful square with certain size, which falls with a fixed speed,
 * while rotating around its center.
 * Properties: location, speed, size, color, borderColor
 */
export declare class RotatingFallingSquare implements GameObject {
    location: Point;
    speed: number;
    size: number;
    color: string;
    borderColor: string;
    private rotation;
    private rotationSpeed;
    constructor(location?: Point, speed?: number, size?: number, color?: string, borderColor?: string);
    /**
     * Move the square - falls down with fixed speed while rotating
     */
    move(): void;
    /**
     * Get the bounding box for collision detection
     */
    getBounds(): Bounds;
    /**
     * Check for collision with another game object
     */
    hasCollision(gameObject: GameObject): boolean;
    /**
     * Check if square has moved off the bottom of the screen
     */
    isOffScreen(): boolean;
    /**
     * Draw the rotating square on the canvas
     */
    draw(ctx: CanvasRenderingContext2D): void;
    /**
     * Helper function to darken a color for the border
     */
    private darkenColor;
}
/**
 * RotatingFallingTriangle - A colorful triangle with certain size, which falls with a fixed speed,
 * while rotating around its center.
 * Properties: location, speed, size, color, borderColor
 */
export declare class RotatingFallingTriangle implements GameObject {
    location: Point;
    speed: number;
    size: number;
    color: string;
    borderColor: string;
    private rotation;
    private rotationSpeed;
    constructor(location?: Point, speed?: number, size?: number, color?: string, borderColor?: string);
    /**
     * Move the triangle - falls down with fixed speed while rotating
     */
    move(): void;
    /**
     * Get the bounding box for collision detection
     */
    getBounds(): Bounds;
    /**
     * Check for collision with another game object
     */
    hasCollision(gameObject: GameObject): boolean;
    /**
     * Check if triangle has moved off the bottom of the screen
     */
    isOffScreen(): boolean;
    /**
     * Draw the rotating triangle on the canvas
     */
    draw(ctx: CanvasRenderingContext2D): void;
    /**
     * Helper function to darken a color for the border
     */
    private darkenColor;
}
/**
 * Union type for all falling object types
 */
export type FallingObject = FallingCircle | RotatingFallingSquare | RotatingFallingTriangle;
/**
 * Factory function to create a random falling object
 */
export declare function createRandomFallingObject(): FallingObject;
//# sourceMappingURL=FallingObjects.d.ts.map