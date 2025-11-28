import { CANVAS_WIDTH, CANVAS_HEIGHT } from './BaseGameObject';
/**
 * HUD (Heads Up Display) renderer for game status information
 */
export class HUD {
    draw(ctx, gameState, objectCount, elapsedTime, levelDuration = 30) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 16px Arial';
        // Status
        ctx.fillText(`Status: ${gameState}`, 15, 25);
        // Object count
        ctx.fillText(`Objects: ${objectCount}`, 15, 50);
        // Time
        ctx.fillText(`Time: ${elapsedTime.toFixed(2)}s / ${levelDuration.toFixed(2)}s`, 15, 75);
        // Progress bar
        this.drawProgressBar(ctx, elapsedTime, levelDuration);
    }
    drawProgressBar(ctx, elapsedTime, levelDuration) {
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
    drawGameOver(ctx, elapsedTime) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#f44336';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText(`You survived for ${elapsedTime.toFixed(2)} seconds`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.fillText('Press Start to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
        ctx.textAlign = 'left';
    }
    drawWinScreen(ctx, levelDuration = 30) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#4CAF50';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('YOU WIN!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.fillText(`You survived the full ${levelDuration.toFixed(0)} seconds!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.fillText('Press Start to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
        ctx.textAlign = 'left';
    }
    drawStartScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FALLING OBJECTS', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText('Press Start to begin', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        ctx.textAlign = 'left';
    }
    drawPausedScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.textAlign = 'left';
    }
}
//# sourceMappingURL=HUD.js.map