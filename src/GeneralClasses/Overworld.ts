import { DirectionInput } from '@/Controls/DirectionInput';
import { IOverworldMapConfig, OverworldMap } from './OverworldMap';
import { IOverworldEventConfig } from './OverworldEvent';
import { KeyPressListener } from './KeyPressListener';
import { OverWorldMaps } from '@/overworldMaps';

export interface IOverworldConfig {
  element: HTMLElement;
}

export class Overworld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: OverworldMap;
  directionInput: DirectionInput;

  constructor(config: IOverworldConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.map = null;
    this.directionInput = null;
  }

  private gameLoopStepWork() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Establish the camera-person
    const cameraPerson = this.map.gameObjects.hero;

    // Update Game Objects
    Object.values(this.map.gameObjects).forEach((object) => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map,
      });
    });

    // Draw Lower Layer
    this.map.drawLowerImage(this.ctx, cameraPerson);

    // Draw Game Objects
    Object.values(this.map.gameObjects)
      .sort((a, b) => a.y - b.y)
      .forEach((object) => {
        object.sprite.draw(this.ctx, cameraPerson);
      });

    // Draw Upper Layer
    this.map.drawUpperImage(this.ctx, cameraPerson);
  }

  public startGameLoop() {
    let previousMs: number;
    const step = 1 / 60;

    const stepFn = (timeStampMs: number) => {
      if (this.map.isPaused) {
        return;
      }

      if (previousMs === undefined) {
        previousMs = timeStampMs;
      }

      let delta = (timeStampMs - previousMs) / 1000;

      while (delta >= step) {
        // Do the work
        this.gameLoopStepWork();
        // reduce delta
        delta -= step;
      }

      previousMs = timeStampMs - delta * 1000;

      // animation loop continues...
      requestAnimationFrame(stepFn);
    };
    // first tick
    requestAnimationFrame(stepFn);
  }

  private bindActionInput() {
    new KeyPressListener('Enter', () => {
      // Is there a person here to talk to?

      this.map.checkForActionCutscene();
    });
  }

  private bindHeroPositionCheck() {
    document.addEventListener('PersonWalkingComplete', (e: CustomEvent) => {
      if (e.detail.whoId === 'hero') {
        // Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  public startMap(mapConfig: IOverworldMapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  public init() {
    this.startMap({ ...OverWorldMaps.Kitchen });

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([{ type: 'battle' }]);
  }
}
