import { Overworld } from './GeneralClasses/Overworld';
import './styles/global.css';
// import './favicon.ico';

const overworld = new Overworld({
  element: document.getElementById('game-container'),
});

overworld.init();
