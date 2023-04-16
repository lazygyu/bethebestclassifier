import { AbstractGameObject } from '../abstractGameObject';
import { ResourceManager } from '../resourceManager';

const size = 120;

export class CorrectEffect extends AbstractGameObject {
  private img: HTMLImageElement;
  private frame: number = 0;
  private duration: number = 200;
  private x: number = 0;
  private y: number = 0;

  constructor(x: number, y: number) {
    super();
    this.img = ResourceManager.getInstance().get<HTMLImageElement>('correct_effect');
    this.x = x;
    this.y = y;
  }

  update(delta: number) {
    super.update(delta);
    if (this.isDestroied) {
      return;
    }
    this.frame = Math.floor(this.elapsed / (this.duration / 5));
    if (this.elapsed > this.duration) {
      this.isDestroied = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDestroied) {
      return;
    }
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    const frame = this.frame;
    ctx.drawImage(this.img, frame * size, 0, size, size, -size / 2, -size / 2, size, size);
    ctx.restore();
  }
}