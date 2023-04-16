import { AbstractState } from './abstract.state';
import { ResourceManager } from '../resourceManager';
import { Eventbus } from '../eventbus';
import { Height, Width } from '../../constants';

export class LogoState extends AbstractState {
  private readonly logo: HTMLImageElement;
  constructor() {
    super();
    this.logo = ResourceManager.getInstance().get<HTMLImageElement>('noul');
  }
  enter(): void {
  }

  exit(): void {
  }

  update(delta: number) {
    super.update(delta);
    if (this.elapsed > 4000) {
      Eventbus.getInstance().emit('changeState', 'initial');
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.elapsed < 1500) {
      ctx.globalAlpha = Math.min(this.elapsed / 1000, 1);
    } else {
      ctx.globalAlpha = Math.max(1 - (this.elapsed - 1500) / 1500, 0);
    }
    const w = this.logo.width * 0.25;
    const h = this.logo.height * 0.25;
    ctx.drawImage(this.logo, Width / 2 - w / 2, Height / 2 - h / 2, w, h);
    ctx.restore();
  }

}