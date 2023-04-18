import { AbstractState } from './abstract.state';
import { ResourceManager } from '../resourceManager';
import { Eventbus } from '../eventbus';

export class LoadingState extends AbstractState {
  public constructor() {
    super();
  }

  public enter(): void {
    console.log('Entering Loading State');
    this.loadResources();
  }

  private async loadResources(): Promise<void> {
    const imageUrls = [
      {url: 'images/cells/1_neutrophil.svg', name: 'neut'},
      {url: 'images/cells/2_lymphocyte.svg', name: 'lymph'},
      {url: 'images/cells/3_monocyte.svg', name: 'mono'},
      {url: 'images/cells/4_eosinophil.svg', name: 'eo'},
      {url: 'images/cells/5_basophil.svg', name: 'baso'},
      {url: 'images/cells/6_rbc.svg', name: 'rbc'},
      {url: 'images/milab.png', name: 'milab'},
      {url: 'images/noul.png', name: 'noul'},
      {url: 'images/correct_effect.png', name: 'correct_effect'},
    ];
    const audioUrls = [
      {url: 'sound/bgm_normal.mp3', name: 'bgm_normal'},
      {url: 'sound/wrong.mp3', name: 'wrong'},
      {url: 'sound/gameover.mp3', name: 'gameover'},
      {url: 'sound/score_increase.mp3', name: 'score'},
      {url: 'sound/correct.mp3', name: 'correct'},
      {url: 'sound/whistle.mp3', name: 'whistle'},
      {url: 'sound/count.mp3', name: 'count'},
    ];
    await Promise.all([ResourceManager.getInstance().loadImage(imageUrls), ResourceManager.getInstance().loadAudio(audioUrls)]);
    Eventbus.getInstance().emit('changeState', 'initial');
  }

  public exit(): void {
  }

  update(delta: number) {
    super.update(delta);
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = '#ea5504';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px bitbit';
    ctx.textAlign = 'center';
    ctx.fillText( 'Loading...', ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
  }
}