import { AbstractState } from './engine/states/abstract.state';
import { Height, Width } from './constants';
import { LoadingState } from './engine/states/loading.state';
import { Eventbus } from './engine/eventbus';
import { StateName, States } from './engine/states';
import { InputManager } from './engine/inputManager';

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
    this.canvas.width = Width;
    this.canvas.height = Height;

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
    this.canvas.width = Width;
    const ctx = this.canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    // @ts-ignore
    ctx.webkitImageSmoothingEnabled = false;
    // ctx.translate(0.5, 0.5);
    this.state.render(ctx);
    requestAnimationFrame(this.loop.bind(this));
  }

  updateState() {
    this.state.update(UpdateInterval);
    InputManager.getInstance().update();
  }
}
