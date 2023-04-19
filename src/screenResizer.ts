import { Height, Width } from './constants';

export class ScreenResizer {
  private static instance: ScreenResizer;
  public static getInstance() {
    if (!ScreenResizer.instance) {
      ScreenResizer.instance = new ScreenResizer();
    }
    return ScreenResizer.instance;
  }

  public width = 0;
  public height = 0;
  public screenOffsetX = 0;
  public screenOffsetY = 0;
  public screenWidth = 0;
  public screenHeight = 0;

  private canvas?: HTMLCanvasElement;

  private constructor() {
  }

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.calcSize(width, height);
      }
      this.calcScreenOffset();
    });
    resizeObserver.observe(document.body);
  }

  private calcSize(width: number, height: number) {
    this.screenHeight = height;
    this.screenWidth = width;
    const ratio = width / height;
    if (ratio < 1.3) {
      this.width = Math.max(Width, width);
      this.height = height;
    } else {
      this.width = width;
      this.height = Math.max(Height, height);
    }
    if ( this.width > Width * 2 && this.height > Height * 2) {
      this.width = Math.floor(this.width / 2);
      this.height = Math.floor(this.height / 2);
    }
  }

  private calcScreenOffset() {
    const canvasBounds = this.canvas?.getBoundingClientRect();
    if (canvasBounds) {
      this.screenOffsetX = canvasBounds.left;
      this.screenOffsetY = canvasBounds.top;
    }
  }
}