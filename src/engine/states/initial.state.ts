import { AbstractState } from './abstract.state';
import { AbstractGameObject } from '../abstractGameObject';
import { BouncingBall } from '../objects/bouncingBall';
import { InputManager } from '../inputManager';
import { Eventbus } from '../eventbus';
import { Milab } from '../objects/milab';
import { Width } from '../../constants';

export class InitialState extends AbstractState {
  private children: AbstractGameObject[] = [];
  private milab: Milab;

  public constructor() {
    super();
    this.milab = new Milab();
  }

  public enter(): void {
    this.milab.scale = 3;
    this.milab.x = Width;
    this.milab.y = 0;
    this.milab.correct(10000);
    this.makeCells();
  }

  private makeCells() {
    for(let i = 0; i < 10; i++) {
      const type = (['neut', 'lymph', 'mono', 'eo', 'baso', 'rbc'] as const)[Math.floor(Math.random() * 6)];
      const x = Math.random() * 1000;
      const dy = Math.random() * 10 - 5;
      this.children.push(new BouncingBall({type, x, dy}));
    }
  }

  public exit(): void {
    console.log('Exiting Initial State');
  }

  update(delta: number) {
    super.update(delta);
    if (InputManager.getInstance().isKeyPressed(' ')) {
      Eventbus.getInstance().emit('changeState', 'ready');
    }
    this.milab.update(delta);
    this.children.forEach(child => child.update(delta));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = '#ea5504';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.milab.draw(ctx);
    this.children.forEach(child => child.draw(ctx));

    ctx.fillStyle = 'white';
    ctx.font = '48px bitbit';
    ctx.textAlign = 'center';
    ctx.fillText('Be the Best Classifier!', ctx.canvas.width / 2, ctx.canvas.height / 2);

    if (this.elapsed % 800 < 600) {
      ctx.font = '24px bitbit';
      ctx.fillText('Press SPACE to start!', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
    }
    ctx.restore();
  }
}