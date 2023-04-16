import { InitialState } from './initial.state';
import { LoadingState } from './loading.state';
import { GameState } from './game.state';
import { ReadyState } from './ready.state';
import { GameoverState } from './gameover.state';
import { LogoState } from './logo.state';

export * from './initial.state';
export * from './loading.state';
export * from './game.state';
export * from './ready.state';
export * from './gameover.state';
export * from './logo.state';

export const States = {
  initial: InitialState,
  loading: LoadingState,
  game: GameState,
  ready: ReadyState,
  gameOver: GameoverState,
  logo: LogoState,
} as const;

export type StateName = keyof typeof States;