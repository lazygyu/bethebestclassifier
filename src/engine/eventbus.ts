import { StateName } from './states';

export class Eventbus {
private static instance: Eventbus;
  private events: Map<string, Function[]>;

  private constructor() {
    this.events = new Map();
  }

  public static getInstance(): Eventbus {
    if (!Eventbus.instance) {
      Eventbus.instance = new Eventbus();
    }

    return Eventbus.instance;
  }

  public on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  public off(event: string, callback: Function) {
    if (!this.events.has(event)) {
      return;
    }
    const index = this.events.get(event)!.indexOf(callback);
    if (index !== -1) {
      this.events.get(event)!.splice(index, 1);
    }
  }

  public emit(event: 'changeState', state: StateName): void;
  public emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) {
      return;
    }
    this.events.get(event)!.forEach((callback) => {
      callback(...args);
    });
  }
}