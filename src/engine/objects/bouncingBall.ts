import { AbstractGameObject } from '../abstractGameObject';
import { Gravity, Height, Width } from '../../constants';
import { ResourceManager } from '../resourceManager';

export class BouncingBall extends AbstractGameObject {
  private x: number;
  private y: number;
  private readonly radius: number;
  private dx: number;
  private dy: number;
  private readonly gravity: number;
  private readonly friction: number;
  private rotation: number = 0;

  private readonly type: 'neut' | 'mono' | 'baso' | 'eo' | 'lymph' | 'rbc';

  constructor(option: {type: 'neut' | 'mono' | 'baso' | 'eo' | 'lymph' | 'rbc', x: number, dy: number }) {
    super();
    this.radius = 15;
    this.x = option.x;
    this.y = this.radius;
    this.dx = Math.random() * 10 - 5;
    this.dy = option.dy;
    this.gravity = Gravity;
    this.friction = 0.9;
    this.type = option.type;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const img = ResourceManager.getInstance().get<HTMLImageElement>(this.type);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(img, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
    ctx.restore();
  }

  update(delta: number): void {
    this.dy += this.gravity * delta;
    this.x += this.dx;
    this.y += this.dy;
    if (this.y + this.radius > Height) {
      this.dy = -this.dy * this.friction;
      this.y = Height - this.radius;
      this.dx *= this.friction;
    } else if (this.y - this.radius < 0) {
      this.dy = -this.dy * this.friction;
      this.y = this.radius;
    }
    if (this.x + this.radius > Width) {
      this.dx = -this.dx * this.friction;
      this.x = Width - this.radius;
    } else if (this.x - this.radius < 0) {
      this.dx = -this.dx * this.friction;
      this.x = this.radius;
    }
    this.rotation += this.dx * 0.1;
  }

  public impulse(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }
}