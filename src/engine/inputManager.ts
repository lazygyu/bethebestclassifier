export class InputManager {
  private keys: Map<string, boolean>;
  private lastKeys: Map<string, boolean>;
  private static instance: InputManager;
  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  private constructor() {
    this.keys = new Map();
    this.lastKeys = new Map();
  }

  init() {
    console.log('InputManager init');
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.key, true);
    });
    window.addEventListener('keyup', (e) => {
      this.keys.set(e.key, false);
    });
  }

  isKeyDown(key: string): boolean {
    return this.keys.get(key) || false;
  }

  isKeyUp(key: string): boolean {
    return !this.keys.get(key);
  }

  isKeyPressed(key: string): boolean {
    return (this.keys.get(key) && !this.lastKeys.get(key)) || false;
  }

  update() {
    this.keys.forEach((value, key) => {
      this.lastKeys.set(key, value);
    });
  }

  isAnyKeyDown(): boolean {
    return Array.from(this.keys.values()).some((value) => value);
  }

  isAnyKeyPressed(): boolean {
    return this.isAnyKeyDown() && !Array.from(this.lastKeys.values()).some((value) => value);
  }
}