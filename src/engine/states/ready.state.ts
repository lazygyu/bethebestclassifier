import { AbstractState } from './abstract.state';
import { Eventbus } from '../eventbus';
import { ResourceManager } from '../resourceManager';

export class ReadyState extends AbstractState {
  private counted = 0;
  enter(): void {
  }

  exit(): void {
  }

  update(delta: number) {
    super.update(delta);
    if (this.elapsed > (this.counted) * 1000) {
      this.counted++;
      if (this.counted <= 3) {
        const soundName = this.counted === 3 ? 'whistle' : 'count';
        const sound = ResourceManager.getInstance().get<HTMLAudioElement>(soundName);
        sound.currentTime = 0;
        sound.play();
      }
    }
    if (this.elapsed > 3000) {
      Eventbus.getInstance().emit('changeState', 'game');
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const fontSizes = [30, 60, 240, 120];
    const count = Math.min(Math.floor(this.elapsed / 1000), 2);
    ctx.save();
    ctx.fillStyle = '#ea5504';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = `${fontSizes[count]}px bitbit`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(['Ready', 'Get Set', 'GO!!'][count], ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
  }
}