export class Overworld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(config: Config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    console.log('hello from the overworld', this);
  }
}

interface Config {
  element: HTMLElement;
}
