import { AbstractState } from './abstract.state';
import { CellName } from '../../types/cell.type';
import { CellNames, GAME_SPAN, Height, Width } from '../../constants';
import { ResourceManager } from '../resourceManager';
import { InputManager } from '../inputManager';
import { interpolate, numPad } from '../../util';
import { Milab } from '../objects/milab';
import { Cell } from '../objects/cell';
import { Eventbus } from '../eventbus';
import { ScoreManager } from '../scoreManager';
import { AbstractGameObject } from '../abstractGameObject';
import { CorrectEffect } from '../objects/correctEffect';

const BackgroundColors = {
  normal: [50, 50, 50, 1],
  correct: [0, 125, 0, 1],
  incorrect: [255, 0, 0, 1],
}

export class GameState extends AbstractState {
  private combo: number = 0;

  private comboTimer: number = 0;
  private comboTimerMax: number = 300;
  private comboTimerActive: boolean = false;

  private incorrectTimer: number = 0;
  private incorrectTimerMax: number = 1000;
  private incorrectTimerActive: boolean = false;

  private gap: number = 0;

  private cells: CellName[] = [];
  private children: Cell[] = [];
  private effects: AbstractGameObject[] = [];

  private targetZoom = 1;
  private currentZoom = 1;

  private pressedJTimer: number = 0;
  private pressedFTimer: number = 0;

  private pressedTimerMax: number = 200;

  private milab: Milab;

  private ended = false;


  constructor() {
    super();

    this.milab = new Milab();
  }

  private addCell(): void {
    const type = this.randomCell();
    this.cells.push(type);
    this.children.push(new Cell(0, 0, type));
  }

  private randomCell(): CellName {
    if (Math.random() < 0.5) {
      return 'rbc';
    }
    return CellNames[Math.floor(Math.random() * (CellNames.length - 2))];
  }

  enter(): void {
    this.reset();
    for(let i = 0; i < 10; i++) {
      this.addCell();
    }
    ResourceManager.getInstance().get<HTMLAudioElement>('bgm_normal').currentTime = 0;
    void ResourceManager.getInstance().get<HTMLAudioElement>('bgm_normal').play();
  }

  exit(): void {
  }

  update(delta: number) {
    super.update(delta);
    if (this.ended) {
      if(this.elapsed > 1000) {
        Eventbus.getInstance().emit('changeState', 'gameOver');
      }
      return;
    }

    this.updatePlaying(delta);
    this.children = this.children.filter(child => !child.isDestroied);
    this.children.forEach(child => child.update(delta));
    this.effects.forEach(effect => effect.update(delta));
    this.effects = this.effects.filter(effect => !effect.isDestroied);
    this.milab.update(delta);
  }

  private updatePlaying(delta: number): void {
    const input = InputManager.getInstance();

    if (this.elapsed >= GAME_SPAN) {
      this.ended = true;
      ResourceManager.getInstance().get<HTMLAudioElement>('bgm_normal').pause();
      this.playSFX('whistle');
      this.elapsed = 0;
      return;
    }

    if (this.gap < 0) {
      this.gap += delta * (40 / 200);
    } else {
      this.gap = 0;
    }

    if (this.comboTimerActive) {
      this.comboTimer += delta;
      if (this.comboTimer > this.comboTimerMax) {
        this.comboTimerActive = false;
        this.comboTimer = 0;
        this.combo = 0;
      }
    }

    // this.targetZoom = Math.min(4, 1 + (this.combo) * 0.1);
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.1;

    if (this.incorrectTimerActive) {
      this.incorrectTimer += delta;
      if (this.incorrectTimer > this.incorrectTimerMax) {
        this.incorrectTimerActive = false;
        this.incorrectTimer = 0;
      }
      return;
    }

    if (this.pressedJTimer > 0 || this.pressedFTimer > 0) {
      this.pressedJTimer -= delta;
      this.pressedFTimer -= delta;
    }
    if (this.pressedJTimer < 0) {
      this.pressedJTimer = 0;
    }
    if (this.pressedFTimer < 0) {
      this.pressedFTimer = 0;
    }

    if (input.isKeyPressed('j') || input.isKeyPressed('ArrowRight')) {
      // rbc
      if (this.isRbc(this.cells[0])) {
        this.setCorrect();
      } else {
        this.setIncorrect();
      }
      this.pressedJTimer = this.pressedTimerMax;
      this.popCell();
    } else if (input.isKeyPressed('f') || input.isKeyPressed('ArrowLeft')) {
      // wbc
      if (this.isWbc(this.cells[0])) {
        this.setCorrect();
      } else {
        this.setIncorrect();
      }
      this.pressedFTimer = this.pressedTimerMax;
      this.popCell();
    }
  }

  private setCorrect(): void {
    this.combo++;
    this.comboTimerActive = true;
    this.comboTimer = 0;
    this.milab.correct(this.comboTimerMax);
    this.playSFX('correct');
    const cell = this.children[0];
    if (cell) {
      cell.x = Width / 2;
      cell.y = Height - 140;
      if (this.isRbc(cell.type)) {
        cell.impulse(0.3, -0.7);
      } else {
        cell.impulse(-0.3, -0.7);
      }
    }
    this.effects.push(new CorrectEffect(Width / 2, Height - 140));
    ScoreManager.getInstance().addScore(this.combo * 5);
    ScoreManager.getInstance().setCombo(this.combo);
    ScoreManager.getInstance().addCorrect();
  }

  private playSFX(name: string): void {
    const sound = ResourceManager.getInstance().get<HTMLAudioElement>(name);
    sound.pause();
    sound.currentTime = 0;
    void sound.play();
  }

  private setIncorrect(): void {
    this.combo = 0;
    this.comboTimerActive = false;
    this.incorrectTimerActive = true;
    this.incorrectTimer = 0;
    this.milab.incorrect(this.incorrectTimerMax);
    const cell = this.children[0];
    if (cell) {
      cell.isWrong = true;
      cell.x = Width / 2;
      cell.y = Height - 140;
      if (this.isRbc(cell.type)) {
        cell.impulse(-0.3, -0.2);
      } else {
        cell.impulse(0.3, -0.2);
      }
    }
    this.playSFX('wrong');
    ScoreManager.getInstance().addIncorrect();
  }

  private popCell(): void {
    this.cells.shift();
    const c = this.children.shift();
    if (c) {
      this.effects.push(c);
    }
    this.addCell();
    this.gap = -40;
  }

  private isRbc(cell: CellName): boolean {
    return cell === 'rbc';
  }

  private isWbc(cell: CellName): boolean {
    return cell === 'neut' || cell === 'lymph' || cell === 'mono' || cell === 'eo' || cell === 'baso';
  }

  private reset() {
    this.elapsed = 0;
    this.combo = 0;
    this.cells = [];
    this.children = [];
    this.effects = [];
    this.targetZoom = 1;
    this.currentZoom = 1;
    this.gap = 0;
    this.comboTimerActive = false;
    this.comboTimer = 0;
    this.incorrectTimerActive = false;
    this.incorrectTimer = 0;
    this.pressedJTimer = 0;
    this.pressedFTimer = 0;
    ScoreManager.getInstance().resetScore();

    this.milab.x = Width / 2;
    this.milab.y = Height - this.milab.height * 2;

    for(let i = 0; i < 10; i++) {
      this.addCell();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
        this.renderPlaying(ctx);
  }

  private renderPlaying(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    if (this.incorrectTimerActive) {
      ctx.fillStyle = this.toColor(interpolate(BackgroundColors.incorrect, BackgroundColors.normal, this.incorrectTimer / this.incorrectTimerMax));
      ctx.filter = 'grayscale(100%)';
      ctx.translate(Math.sin(this.incorrectTimer / 50) * 10, 0);
    } else if (this.comboTimerActive) {
      ctx.fillStyle = this.toColor(interpolate(BackgroundColors.correct, BackgroundColors.normal, this.incorrectTimer / this.incorrectTimerMax));
    } else {
      ctx.fillStyle = this.toColor(BackgroundColors.normal);
    }
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.renderCells(ctx);

    this.renderCombo(ctx);

    ctx.fillStyle = 'white';
    ctx.font = '30px bitbit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`WBC`, Width * 0.25, Height * 0.75);
    ctx.fillText(`RBC`, Width * 0.75, Height * 0.75);
    this.drawKey(ctx, 'F', Width * 0.25, Height * 0.75 + 40, this.pressedFTimer);
    this.drawKey(ctx, 'J', Width * 0.75, Height * 0.75 + 40, this.pressedJTimer);

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '14px bitbit';
    ctx.fillText(`High Score: ${numPad(ScoreManager.getInstance().getHighScore(), 8)}`, 20, 5);
    ctx.font = '20px bitbit';
    ctx.fillText(`Score: ${numPad(ScoreManager.getInstance().getScore(), 8)}`, 20, 20);

    ctx.textAlign = 'right';
    const leftTime = this.ended ? 0 : Math.max(0, (GAME_SPAN - this.elapsed) / 1000);
    const msec = `${Math.floor((leftTime - Math.floor(leftTime)) * 100)}0`.slice(0, 2);
    ctx.fillText(`${numPad(Math.floor(leftTime), 2)}.${msec}`, Width - 20, 20);

    this.milab.scale = this.currentZoom + 1;
    this.milab.draw(ctx);

    this.drawAim(ctx);

    ctx.restore();
  }

  private toColor(color: number[]): string {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
  }

  private renderCells(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(Width / 2, Height - 100);
    ctx.scale(this.currentZoom, this.currentZoom);
    ctx.translate(0, this.gap);
    this.children.forEach((child) => {
      const y = -40;
      ctx.translate(0, y);
      child.draw(ctx);
    });
    ctx.restore();
    this.effects.forEach((effect) => {
      effect.draw(ctx);
    });
  }

  private renderCombo(ctx: CanvasRenderingContext2D): void {
    if (this.comboTimerActive) {
      const y = Math.min(1, this.comboTimer / (this.comboTimerMax / 2)) * 10;
      ctx.save();
      ctx.translate(Width / 2, Height / 2 - 120);
      ctx.fillStyle = '#fff';
      ctx.font = '30px bitbit';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`COMBO`, 0, 10);
      ctx.font = '50px bitbit';
      ctx.fillText(`${this.combo}`, 0, y + 30);
      ctx.restore();
    }
  }

  private drawKey(ctx: CanvasRenderingContext2D, key: string, x: number, y: number, pressedTimer: number): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = this.toColor(interpolate([255, 255, 255, 0.5], [0, 0, 0, 0], 1 - (pressedTimer / this.pressedTimerMax)));
    ctx.lineWidth = 2;
    if (pressedTimer > 0) {
      ctx.fillRect(-20, -20, 40, 40)
    }
    ctx.strokeRect(-20, -20, 40, 40);
    ctx.fillStyle = '#fff';
    ctx.font = '30px bitbit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(key, 0, 0);
    ctx.restore();
  }

  private drawAim(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(Width/2, Height - 140);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(25, 0);
    ctx.moveTo(0, -25);
    ctx.lineTo(0, 25);
    ctx.stroke();
    ctx.restore();
  }
}