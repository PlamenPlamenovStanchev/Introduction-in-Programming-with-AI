import { CANVAS_WIDTH, CANVAS_HEIGHT, GameState } from './BaseGameObject';
import { Difficulty } from './Level';

/**
 * HUD (Heads Up Display) renderer for game status information
 */
export class HUD {
    draw(
        ctx: CanvasRenderingContext2D,
        gameState: GameState,
        objectCount: number,
        elapsedTime: number,
        levelDuration: number = 30,
        currentLevel: number = 1,
        totalLevels: number = 4,
        difficulty: Difficulty = Difficulty.EASY
    ): void {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 16px Arial';

        // Level and difficulty
        ctx.fillText(`Level: ${currentLevel}/${totalLevels} (${difficulty})`, 15, 25);

        // Object count
        ctx.fillText(`Objects: ${objectCount}`, 15, 50);

        // Time
        ctx.fillText(`Time: ${elapsedTime.toFixed(1)}s / ${levelDuration.toFixed(0)}s`, 15, 75);

        // Progress bar
        this.drawProgressBar(ctx, elapsedTime, levelDuration);
    }

    private drawProgressBar(ctx: CanvasRenderingContext2D, elapsedTime: number, levelDuration: number): void {
        const barWidth = 150;
        const barHeight = 10;
        const progress = Math.min(elapsedTime / levelDuration, 1);

        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(15, 85, barWidth, barHeight);

        // Progress
        ctx.fillStyle = progress < 0.7 ? '#4CAF50' : (progress < 0.9 ? '#FF9800' : '#f44336');
        ctx.fillRect(15, 85, barWidth * progress, barHeight);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(15, 85, barWidth, barHeight);
    }

    drawGameOver(ctx: CanvasRenderingContext2D, totalTime: number, levelReached: number = 1, totalLevels: number = 4): void {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#f44336';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText(`You reached Level ${levelReached} of ${totalLevels}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.fillText(`Total survival time: ${totalTime.toFixed(1)} seconds`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);
        ctx.fillText('Press Start to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 80);

        ctx.textAlign = 'left';
    }

    drawWinScreen(ctx: CanvasRenderingContext2D, totalTime: number, totalLevels: number = 4): void {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Celebration effect
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 56px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 YOU WIN! 🎉', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);

        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('CONGRATULATIONS!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        ctx.fillStyle = '#fff';
        ctx.font = '22px Arial';
        ctx.fillText(`You completed all ${totalLevels} levels!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
        ctx.fillText(`Total time: ${totalTime.toFixed(1)} seconds`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
        ctx.fillText('Press Start to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);

        ctx.textAlign = 'left';
    }

    drawStartScreen(ctx: CanvasRenderingContext2D, totalLevels: number = 4): void {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🌌 FALLING OBJECTS 🌌', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Complete ${totalLevels} levels to win!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 15);
        ctx.fillText('EASY → MEDIUM → HARD → EXTREME', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15);
        
        ctx.fillStyle = '#4ECDC4';
        ctx.font = 'bold 22px Arial';
        ctx.fillText('Press Start to begin', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);

        ctx.fillStyle = '#aaa';
        ctx.font = '16px Arial';
        ctx.fillText('Use ← → arrow keys or A/D to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 95);

        ctx.textAlign = 'left';
    }

    drawPausedScreen(ctx: CanvasRenderingContext2D, currentLevel: number = 1, difficulty: Difficulty = Difficulty.EASY): void {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#FF9800';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⏸ PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Level ${currentLevel} (${difficulty})`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25);
        ctx.fillText('Press Resume to continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);

        ctx.textAlign = 'left';
    }

    /**
     * Draw level transition screen (optional, for future use)
     */
    drawLevelTransition(ctx: CanvasRenderingContext2D, nextLevel: number, difficulty: Difficulty): void {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText(`Next: Level ${nextLevel} (${difficulty})`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);

        ctx.textAlign = 'left';
    }
}
