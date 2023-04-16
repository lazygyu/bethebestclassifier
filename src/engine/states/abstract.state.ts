export abstract class AbstractState {
  protected elapsed = 0;

  protected constructor() {}

  public abstract enter(): void;
  public abstract exit(): void;

  public update(delta: number): void {
    this.elapsed += delta;
  }

  public abstract render(ctx: CanvasRenderingContext2D): void;
}