import { Overworld } from './Overworld';
import './styles/style.css';

const overworld = new Overworld({
  element: document.getElementById('game-container'),
});

overworld.init();