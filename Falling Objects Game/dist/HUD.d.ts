import { GameState } from './BaseGameObject';
/**
 * HUD (Heads Up Display) renderer for game status information
 */
export declare class HUD {
    draw(ctx: CanvasRenderingContext2D, gameState: GameState, objectCount: number, elapsedTime: number, levelDuration?: number): void;
    private drawProgressBar;
    drawGameOver(ctx: CanvasRenderingContext2D, elapsedTime: number): void;
    drawWinScreen(ctx: CanvasRenderingContext2D, levelDuration?: number): void;
    drawStartScreen(ctx: CanvasRenderingContext2D): void;
    drawPausedScreen(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=HUD.d.ts.map