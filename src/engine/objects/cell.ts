import { AbstractGameObject } from '../abstractGameObject';
import { ResourceManager } from '../resourceManager';
import { CellName } from '../../types/cell.type';
import { Gravity } from '../../constants';

export class Cell extends AbstractGameObject {

  public x: number;
  public y: number;
  public type: CellName;
  private rotation: number = 0;
  private rotationSpeed: number = 0;
  public radius: number = 40;

  private dx: number;
  private dy: number;
  private isMoving: boolean = false;
  public isWrong: boolean = false;

  private img: HTMLImageElement;
  private sizeDelta: number = 0;
  private sizeInterval: number = 0;
  private rotationInterval: number = 0;
  private rotationIntervalMax: number = 0

  constructor(x: number, y: number, type: CellName) {
    super();
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.type = type;
    this.sizeInterval = Math.random() * 400;
    this.rotationIntervalMax = Math.random() * 1000;
    this.rotationInterval = this.rotationIntervalMax;
    this.img = ResourceManager.getInstance().get<HTMLImageElement>(type);
  }

  update(delta: number) {
    super.update(delta);
    this.rotation += this.rotationSpeed * delta;
    this.x += this.dx * delta;
    this.y += this.dy * delta;
    this.sizeDelta = Math.max(0, Math.sin(this.elapsed / this.sizeInterval) * 5);
    if (this.rotationInterval > 0) {
      this.rotationInterval -= delta;
      if (this.rotationInterval < 0) {
        this.rotationSpeed = this.rotationSpeed > 0 ? 0 : 0.03;
        this.rotationInterval = this.rotationIntervalMax;
      }
    }
    if (this.isMoving) {
      this.dy += Gravity;
      if (this.elapsed > 2000) {
        this.isDestroied = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    const size = this.radius + this.sizeDelta;
    if (this.isMoving) {
      ctx.globalAlpha = 1 - (this.elapsed / 2000);
    }
    ctx.drawImage(this.img, -size * 0.5, -size * 0.5, size, size);
    // if (!this.isMoving) {
    //   ctx.beginPath();
    //   ctx.arc(0, 0, size * 0.5, 0, 2 * Math.PI);
    //   ctx.strokeStyle = 'white';
    //   ctx.stroke();
    // }
    ctx.restore();
  }

  impulse(dx: number, dy: number) {
    this.elapsed = 0;
    this.isMoving = true;
    this.rotationSpeed = dx * 0.1;
    this.dx = dx;
    this.dy = dy;
  }
}