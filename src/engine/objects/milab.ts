import { AbstractGameObject } from '../abstractGameObject';
import { ResourceManager } from '../resourceManager';

const FrameSize = {
  width: 47,
  height: 38,
};

const frames = [
  {x: 0, y: 0},
  {x: 47, y: 0},
  {x: 94, y: 0},
  {x: 141, y: 0},
  {x: 188, y: 0},
  {x: 235, y: 0},
  {x: 282, y: 0},
]

const animations = {
  normal: [0, 1, 2, 1],
  correct: [3, 4],
  incorrect: [5, 6],
}

export class Milab extends AbstractGameObject {
  private img: HTMLImageElement;
  private frame: number = 0;
  private state: 'correct' | 'incorrect' | 'normal' = 'normal';
  private duration: number = 0;

  public x: number = 0;
  public y: number = 0;

  public width = FrameSize.width;
  public height = FrameSize.height;
  public scale = 2;

  constructor() {
    super();
    this.img = ResourceManager.getInstance().get<HTMLImageElement>('milab');
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    const frame = frames[this.frame];
    ctx.scale(this.scale, this.scale);
    ctx.drawImage(this.img, frame.x, 0, FrameSize.width, FrameSize.height, -Math.round(FrameSize.width * 0.5), 0, FrameSize.width, FrameSize.height);
    ctx.restore();
  }

  update(delta: number): void {
    super.update(delta);

    if (this.duration > 0) {
      this.duration -= delta;
      if (this.duration <= 0) {
        this.state = 'normal';
        this.duration = 0;
      }
    }

    const anim = animations[this.state];
    this.frame = anim[Math.floor(this.elapsed / 100) % anim.length];
  }

  correct(duration: number) {
    this.state = 'correct';
    this.duration = duration;
  }

  incorrect(duration: number) {
    this.state = 'incorrect';
    this.duration = duration;
  }
}