import { AbstractState } from './engine/states/abstract.state';
import { LoadingState, StateName, States } from './engine/states';
import { Eventbus } from './engine/eventbus';
import { InputManager } from './engine/inputManager';
import { ScreenResizer } from './screenResizer';

const UpdateInterval = 5;

export class Game {
  private state!: AbstractState;

  private lastUpdate: number = 0;
  // @ts-ignore
  private elapsed: number = 0;
  private elapsedSinceLastUpdate: number = 0;

  private canvas: HTMLCanvasElement;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    ScreenResizer.getInstance().init(this.canvas);

    this.canvas.width = ScreenResizer.getInstance().width;
    this.canvas.height = ScreenResizer.getInstance().height;

    container.append(this.canvas);

    this.changeState(new LoadingState());
    Eventbus.getInstance().on('changeState', (state: StateName) => {
      const newState = new States[state]();
      this.changeState(newState);
    });
    InputManager.getInstance().init();
    this.loop();
  }

  changeState(state: AbstractState) {
    if (this.state) {
      this.state.exit();
    }
    this.state = state;
    this.state.enter();
  }

  loop() {
    const now = Date.now();
    if (!this.lastUpdate) {
      this.lastUpdate = now;
    }
    const delta = now - this.lastUpdate;
    this.elapsed += delta;
    this.elapsedSinceLastUpdate += delta;
    this.lastUpdate = now;
    while(this.elapsedSinceLastUpdate >= UpdateInterval) {
      this.updateState();
      this.elapsedSinceLastUpdate -= UpdateInterval;
    }
    this.canvas.width = ScreenResizer.getInstance().width;
    this.canvas.height = ScreenResizer.getInstance().height;
    const ctx = this.canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    // @ts-ignore
    ctx.webkitImageSmoothingEnabled = false;

    this.state.render(ctx);
    requestAnimationFrame(this.loop.bind(this));
  }

  updateState() {
    this.state.update(UpdateInterval);
    InputManager.getInstance().update();
  }
}
