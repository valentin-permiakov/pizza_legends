import { utils } from '@/utils/utils';
import { GameObject, IBehavior } from './GameObject';
import { OverworldEvent } from './OverworldEvent';
import { Overworld } from './Overworld';

export type TGameObjects = {
  [key: string]: GameObject;
};

export type TGameWalls = {
  [key: string]: boolean;
};

interface ICutsceneEvent extends IBehavior {
  who?: string;
}

export type TGameCutsceneEvents = {
  events: Array<IBehavior>;
};

export type TGameCutsceneSpaces = {
  [key: string]: TGameCutsceneEvents[];
};

export interface IOverworldMapConfig {
  lowerSrc: string;
  upperSrc: string;
  gameObjects: TGameObjects;
  walls?: TGameWalls;
  cutsceneSpaces?: TGameCutsceneSpaces;
}

export class OverworldMap {
  gameObjects: TGameObjects;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
  walls: TGameWalls;
  cutsceneSpaces: TGameCutsceneSpaces;
  isCutscenePlaying: boolean;
  isPaused: boolean;
  overworld: Overworld;

  constructor(config: IOverworldMapConfig) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    // images
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
    this.isCutscenePlaying = false;
  }

  public drawLowerImage(
    ctx: CanvasRenderingContext2D,
    cameraPerson: GameObject
  ) {
    const x = utils.withGrid(10.5) - cameraPerson.x;
    const y = utils.withGrid(6) - cameraPerson.y;
    ctx.drawImage(this.lowerImage, x, y);
  }

  public drawUpperImage(
    ctx: CanvasRenderingContext2D,
    cameraPerson: GameObject
  ) {
    const x = utils.withGrid(10.5) - cameraPerson.x;
    const y = utils.withGrid(6) - cameraPerson.y;
    ctx.drawImage(this.upperImage, x, y);
  }

  public mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      // TODO: determine if this object should actually mount
      let object = this.gameObjects[key];
      object.id = key;

      object.mount(this);
    });
  }

  public isSpaceTaken(currentX: number, currentY: number, direction: string) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  public async startCutscene(events: ICutsceneEvent[]) {
    this.isCutscenePlaying = true;
    // Start the loop of async events
    for (let i = 0; i < events.length; i++) {
      const event = new OverworldEvent({
        map: this,
        event: events[i],
      });
      // await each one
      await event.init();
    }
    this.isCutscenePlaying = false;

    // Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  // Cutscene checks

  // Check if next to a person we can talk to
  public checkForActionCutscene() {
    const hero = this.gameObjects['hero'];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);

    const match = Object.values(this.gameObjects).find(
      (object) =>
        `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    );

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  // Check if finished walking and is in an action space
  public checkForFootstepCutscene() {
    const hero = this.gameObjects['hero'];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  // Handling physical boundaries of objects
  public addWall(x: number, y: number) {
    this.walls[`${x},${y}`] = true;
  }
  public removeWall(x: number, y: number) {
    delete this.walls[`${x},${y}`];
  }
  public moveWall(wasX: number, wasY: number, direction: string) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}
