import { AbstractState } from './abstract.state';
import { AbstractGameObject } from '../abstractGameObject';
import { BouncingBall } from '../objects/bouncingBall';
import { InputManager } from '../inputManager';
import { Eventbus } from '../eventbus';

export class InitialState extends AbstractState {
  private children: AbstractGameObject[] = [];

  public constructor() {
    super();
  }

  public enter(): void {
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
  }

  update(delta: number) {
    super.update(delta);
    if (InputManager.getInstance().isKeyPressed(' ') || InputManager.getInstance().isTouched()) {
      Eventbus.getInstance().emit('changeState', 'ready');
    }
    this.children.forEach(child => child.update(delta));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = '#ea5504';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.children.forEach(child => child.draw(ctx));

    ctx.fillStyle = 'white';
    ctx.font = '48px bitbit';
    ctx.textAlign = 'center';
    ['Be', 'the', 'Best', 'Classifier!'].reverse().forEach((text, i) => {
      ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2 - (i*40));
    });

    if (this.elapsed % 800 < 600) {
      ctx.font = '24px bitbit';
      ctx.fillText('Press SPACE or Touch', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
      ctx.fillText('to START', ctx.canvas.width / 2, ctx.canvas.height / 2 + 75);
    }
    ctx.restore();
  }
}