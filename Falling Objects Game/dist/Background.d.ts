/**
 * Star class for the animated background
 */
export declare class Star {
    private x;
    private y;
    private size;
    private opacity;
    private twinkleSpeed;
    private twinkleDirection;
    constructor();
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
/**
 * Background renderer for the galactic theme
 */
export declare class Background {
    private stars;
    constructor(starCount?: number);
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    private drawNebula;
    reset(): void;
}
//# sourceMappingURL=Background.d.ts.map