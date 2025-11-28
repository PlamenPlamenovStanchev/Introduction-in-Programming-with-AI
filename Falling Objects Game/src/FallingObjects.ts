import { Point, Bounds, GameObject } from './interfaces';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from './BaseGameObject';

/**
 * FallingCircle - A colorful circle with certain size, which falls down with a fixed speed.
 * Properties: location, speed, radius, color, borderColor
 */
export class FallingCircle implements GameObject {
    location: Point;
    speed: number;
    radius: number;
    color: string;
    borderColor: string;

    constructor(
        location?: Point,
        speed?: number,
        radius?: number,
        color?: string,
        borderColor?: string
    ) {
        this.radius = radius ?? Math.random() * 15 + 10;
        this.location = location ?? {
            x: Math.random() * (CANVAS_WIDTH - this.radius * 2),
            y: -this.radius * 2
        };
        this.speed = speed ?? Math.random() * 2 + 1;
        this.color = color ?? COLORS[Math.floor(Math.random() * COLORS.length)];
        this.borderColor = borderColor ?? this.darkenColor(this.color, 30);
    }

    /**
     * Move the circle - falls straight down with fixed speed
     */
    move(): void {
        this.location.y += this.speed;
    }

    /**
     * Get the bounding box for collision detection
     */
    getBounds(): Bounds {
        return {
            x: this.location.x,
            y: this.location.y,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }

    /**
     * Check for collision with another game object
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
     * Check if circle has moved off the bottom of the screen
     */
    isOffScreen(): boolean {
        return this.location.y > CANVAS_HEIGHT + this.radius * 2;
    }

    /**
     * Draw the circle on the canvas
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Draw filled circle
        ctx.beginPath();
        ctx.arc(
            this.location.x + this.radius,
            this.location.y + this.radius,
            this.radius,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add highlight for 3D effect
        ctx.beginPath();
        ctx.arc(
            this.location.x + this.radius * 0.7,
            this.location.y + this.radius * 0.7,
            this.radius * 0.25,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();

        ctx.restore();
    }

    /**
     * Helper function to darken a color for the border
     */
    private darkenColor(color: string, percent: number): string {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
}

/**
 * RotatingFallingSquare - A colorful square with certain size, which falls with a fixed speed,
 * while rotating around its center.
 * Properties: location, speed, size, color, borderColor
 */
export class RotatingFallingSquare implements GameObject {
    location: Point;
    speed: number;
    size: number;
    color: string;
    borderColor: string;
    private rotation: number;
    private rotationSpeed: number;

    constructor(
        location?: Point,
        speed?: number,
        size?: number,
        color?: string,
        borderColor?: string
    ) {
        this.size = size ?? Math.random() * 25 + 20;
        this.location = location ?? {
            x: Math.random() * (CANVAS_WIDTH - this.size),
            y: -this.size
        };
        this.speed = speed ?? Math.random() * 2 + 1;
        this.color = color ?? COLORS[Math.floor(Math.random() * COLORS.length)];
        this.borderColor = borderColor ?? this.darkenColor(this.color, 30);
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08;
    }

    /**
     * Move the square - falls down with fixed speed while rotating
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
     * Check for collision with another game object
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
     * Check if square has moved off the bottom of the screen
     */
    isOffScreen(): boolean {
        return this.location.y > CANVAS_HEIGHT + this.size;
    }

    /**
     * Draw the rotating square on the canvas
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Translate to center and rotate
        ctx.translate(this.location.x + this.size / 2, this.location.y + this.size / 2);
        ctx.rotate(this.rotation);

        // Draw filled square
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

        // Draw border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);

        // Add highlight for 3D effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size / 2, this.size / 2);

        ctx.restore();
    }

    /**
     * Helper function to darken a color for the border
     */
    private darkenColor(color: string, percent: number): string {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
}

/**
 * RotatingFallingTriangle - A colorful triangle with certain size, which falls with a fixed speed,
 * while rotating around its center.
 * Properties: location, speed, size, color, borderColor
 */
export class RotatingFallingTriangle implements GameObject {
    location: Point;
    speed: number;
    size: number;
    color: string;
    borderColor: string;
    private rotation: number;
    private rotationSpeed: number;

    constructor(
        location?: Point,
        speed?: number,
        size?: number,
        color?: string,
        borderColor?: string
    ) {
        this.size = size ?? Math.random() * 25 + 20;
        this.location = location ?? {
            x: Math.random() * (CANVAS_WIDTH - this.size),
            y: -this.size
        };
        this.speed = speed ?? Math.random() * 2 + 1;
        this.color = color ?? COLORS[Math.floor(Math.random() * COLORS.length)];
        this.borderColor = borderColor ?? this.darkenColor(this.color, 30);
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08;
    }

    /**
     * Move the triangle - falls down with fixed speed while rotating
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
     * Check for collision with another game object
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
     * Check if triangle has moved off the bottom of the screen
     */
    isOffScreen(): boolean {
        return this.location.y > CANVAS_HEIGHT + this.size;
    }

    /**
     * Draw the rotating triangle on the canvas
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // Translate to center and rotate
        ctx.translate(this.location.x + this.size / 2, this.location.y + this.size / 2);
        ctx.rotate(this.rotation);

        // Draw filled triangle
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Helper function to darken a color for the border
     */
    private darkenColor(color: string, percent: number): string {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }
}

/**
 * Union type for all falling object types
 */
export type FallingObject = FallingCircle | RotatingFallingSquare | RotatingFallingTriangle;

/**
 * Factory function to create a random falling object
 */
export function createRandomFallingObject(): FallingObject {
    const types = [FallingCircle, RotatingFallingSquare, RotatingFallingTriangle];
    const RandomType = types[Math.floor(Math.random() * types.length)];
    return new RandomType();
}
