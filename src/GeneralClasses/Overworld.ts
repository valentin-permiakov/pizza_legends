import { OverworldMap, OverWorldMaps } from './OverworldMap';

export interface IOverworldConfig {
  element: HTMLElement;
}

export class Overworld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: OverworldMap;

  constructor(config: IOverworldConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = new OverworldMap({ ...OverWorldMaps.DemoRoom });
  }

  public startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw Lower Layer
      this.map.drawLowerImage(this.ctx);

      // Draw Game Objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.sprite.draw(this.ctx);
      });

      // Draw Upper Layer
      this.map.drawUpperImage(this.ctx);

      requestAnimationFrame(step);
    };
    step();
  }

  public init() {
    this.map = new OverworldMap({ ...OverWorldMaps.DemoRoom });
    this.startGameLoop();
  }
}
