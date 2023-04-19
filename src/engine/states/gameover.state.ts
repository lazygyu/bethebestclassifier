import { AbstractState } from './abstract.state';
import { ResourceManager } from '../resourceManager';
import { InputManager } from '../inputManager';
import { Eventbus } from '../eventbus';
import { interpolate } from '../../util';
import { ScoreManager } from '../scoreManager';
import { Milab } from '../objects/milab';

export class GameoverState extends AbstractState {
  private lastScoreSoundTime: number = 0;

  private milab = new Milab();

  enter(): void {
    ResourceManager.getInstance().get<HTMLAudioElement>('gameover').currentTime = 0;
    ResourceManager.getInstance().get<HTMLAudioElement>('gameover').play();
    this.milab.scale = 1;
  }

  exit(): void {
  }

  update(delta: number) {
    super.update(delta);
    this.milab.update(delta);
    if (this.elapsed > 3500) {
      ResourceManager.getInstance().get<HTMLAudioElement>('score').pause();
      if (InputManager.getInstance().isKeyPressed(' ') || InputManager.getInstance().isTouched()) {
        Eventbus.getInstance().emit('changeState', 'ready');
      }
    } else if (this.elapsed < 3000 && this.elapsed > 500) {
      if (InputManager.getInstance().isKeyPressed(' ') || InputManager.getInstance()) {
        this.elapsed = 3000;
      }
    }
    const scoreSound = ResourceManager.getInstance().get<HTMLAudioElement>('score');
    if (this.elapsed < 3000 && this.elapsed > this.lastScoreSoundTime + 100) {
      scoreSound.currentTime = 0;
      this.lastScoreSoundTime = this.elapsed;
      ResourceManager.getInstance().get<HTMLAudioElement>('score').play();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const Width = ctx.canvas.width;
    const Height = ctx.canvas.height;

    this.milab.x = Math.floor(Width / 2);
    this.milab.y = Math.floor(Height * 0.25 + 30);

    const [score, maxCombo, correct, incorrect] = interpolate(
      [0, 0, 0, 0],
      [
        ScoreManager.getInstance().getScore(),
        ScoreManager.getInstance().getMaxCombo(),
        ScoreManager.getInstance().getCorrect(),
        ScoreManager.getInstance().getIncorrect(),
      ], Math.min(1, this.elapsed / 3000)).map(Math.floor);
    ctx.fillStyle = '#ea5504';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = '30px bitbit';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', Width / 2, Height * 0.25 - 20);
    ctx.textAlign = 'right';
    ctx.font = '40px bitbit';
    ctx.fillText(`Score`, Width / 2, Height * 0.5 - 20);
    ctx.font = '20px bitbit';
    ctx.fillText('HighScore', Width / 2, Height * 0.5 + 10);
    ctx.fillText(`Max Combo`, Width / 2, Height * 0.5 + 40);
    ctx.fillText(`Correct`, Width / 2, Height * 0.5 + 70);
    ctx.fillText(`Incorrect`, Width / 2, Height * 0.5 + 100);
    ctx.textAlign = 'left';
    ctx.font = '40px bitbit';
    ctx.fillText(`${score}`, Width / 2 + 10, Height * 0.5 - 20);
    ctx.font = '20px bitbit';
    ctx.fillText(`${ScoreManager.getInstance().getHighScore()}`, Width / 2 + 10, Height * 0.5 + 10);
    ctx.fillText(`${maxCombo}`, Width / 2 + 10, Height * 0.5 + 40);
    ctx.fillText(`${correct}`, Width / 2 + 10, Height * 0.5 + 70);
    ctx.fillText(`${incorrect}`, Width / 2 + 10, Height * 0.5 + 100);
    if (this.elapsed > 3000 && (this.elapsed - 3000) % 1000 < 500) {
      ctx.font = '20px bitbit';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE or touch to restart', Width / 2, Height * 0.5 + 160);
    }
    this.milab.draw(ctx);
    ctx.restore();
  }

}