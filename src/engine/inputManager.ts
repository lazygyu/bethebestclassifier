import { ScreenResizer } from '../screenResizer';

export class InputManager {
  private keys: Map<string, boolean>;
  private lastKeys: Map<string, boolean>;

  private pointers: { left: boolean, right: boolean } = { left: false, right: false };
  private lastPointers: { left: boolean, right: boolean } = { left: false, right: false };
  private pointerEvents: {id: number, type: 'left' | 'right'}[] = [];

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
    window.addEventListener('pointerdown', (e) => {
      const x = e.pageX;
      if (x < ScreenResizer.getInstance().screenWidth / 2) {
        this.pointers.left = true;
        this.pointerEvents.push({ id: e.pointerId, type: 'left'});
      } else {
        this.pointers.right = true;
        this.pointerEvents.push({ id: e.pointerId, type: 'right'});
      }
    });
    window.addEventListener('pointerup', (e) => {
      const lastEvent = this.pointerEvents.find(ev => ev.id === e.pointerId);
      if (!lastEvent) return;
      if (lastEvent.type === 'left') {
        this.pointers.left = false;
      } else {
        this.pointers.right = false;
      }
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
    this.lastPointers.left = this.pointers.left;
    this.lastPointers.right = this.pointers.right;
  }

  isTouching(): boolean {
    return this.pointers.left || this.pointers.right;
  }

  isTouchingLeft(): boolean {
    return this.pointers.left;
  }
  isTouchingRight(): boolean {
    return this.pointers.right;
  }

  isTouched(): boolean {
    return this.isTouching() && !this.isTouchingLast();
  }

  isTouchingLast(): boolean {
    return this.lastPointers.left || this.lastPointers.right;
  }

  isTouchedLeft(): boolean {
    return this.pointers.left && !this.lastPointers.left;
  }
  isTouchedRight(): boolean {
    return this.pointers.right && !this.lastPointers.right;
  }


  isAnyKeyDown(): boolean {
    return Array.from(this.keys.values()).some((value) => value);
  }

  isAnyKeyPressed(): boolean {
    return this.isAnyKeyDown() && !Array.from(this.lastKeys.values()).some((value) => value);
  }
}