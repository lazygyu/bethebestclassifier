export class ScoreManager {
  private static instance: ScoreManager;

  private highScore: number;

  private score: number;
  private combo: number;
  private maxCombo: number;
  private correct: number;
  private incorrect: number;

  private constructor() {
    this.score = 0;
    this.highScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.correct = 0;
    this.incorrect = 0;
  }

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }

    return ScoreManager.instance;
  }

  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public addScore(score: number): void {
    this.score += score;
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  public addCorrect(): void {
    this.correct++;
  }

  public addIncorrect(): void {
    this.incorrect++;
  }

  public getCorrect(): number {
    return this.correct;
  }

  public getIncorrect(): number {
    return this.incorrect;
  }

  public setCombo(combo: number): void {
    this.combo = combo;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
  }

  public getMaxCombo(): number {
    return this.maxCombo;
  }

  public resetScore(): void {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.correct = 0;
    this.incorrect = 0;
  }
}