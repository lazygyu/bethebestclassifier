export abstract class AbstractGameObject {
  public elapsed: number = 0;

  public update(delta: number): void {
    this.elapsed += delta;
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;
  public isDestroied: boolean = false;
}