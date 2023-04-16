import './style.css'
import { Game } from './game';

const appContainer = document.getElementById('app');

if (appContainer) {
  new Game(appContainer);
}