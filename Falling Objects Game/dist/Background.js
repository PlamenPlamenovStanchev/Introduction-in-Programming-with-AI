import { CANVAS_WIDTH, CANVAS_HEIGHT } from './BaseGameObject';
/**
 * Star class for the animated background
 */
export class Star {
    constructor() {
        this.x = Math.random() * CANVAS_WIDTH;
        this.y = Math.random() * CANVAS_HEIGHT;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleDirection = 1;
    }
    update() {
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity >= 1) {
            this.twinkleDirection = -1;
        }
        else if (this.opacity <= 0.2) {
            this.twinkleDirection = 1;
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}
/**
 * Background renderer for the galactic theme
 */
export class Background {
    constructor(starCount = 100) {
        this.stars = [];
        for (let i = 0; i < starCount; i++) {
            this.stars.push(new Star());
        }
    }
    update() {
        this.stars.forEach(star => star.update());
    }
    draw(ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a3e');
        gradient.addColorStop(1, '#0f1f3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // Draw stars
        this.stars.forEach(star => star.draw(ctx));
        // Add nebula effects
        this.drawNebula(ctx, 600, 150, 200, 'rgba(100, 50, 150, 0.1)');
        this.drawNebula(ctx, 200, 350, 150, 'rgba(50, 100, 150, 0.08)');
    }
    drawNebula(ctx, x, y, radius, color) {
        ctx.beginPath();
        const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        nebulaGradient.addColorStop(0, color);
        nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGradient;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    reset() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push(new Star());
        }
    }
}
//# sourceMappingURL=Background.js.map