import { Person } from '@/Characters/Person';
import { GameObject, IBehavior } from './GameObject';
import heroSrc from '@/img/characters/people/hero.png';
import npc1Src from '@/img/characters/people/npc1.png';
import npc2Src from '@/img/characters/people/npc2.png';
import testRoomSrcLower from '@/img/maps/DemoLower.png';
import testRoomSrcUpper from '@/img/maps/DemoUpper.png';
import kitchetSrcLower from '@/img/maps/KitchenLower.png';
import kitchetSrcUpper from '@/img/maps/KitchenUpper.png';
import { utils } from '@/utils/utils';
import { OverworldEvent } from './OverworldEvent';

type TGameObjects = {
  [key: string]: GameObject;
};
type TGameWalls = {
  [key: string]: boolean;
};

interface ICutsceneEvent extends IBehavior {
  who: string;
}

export interface IOverworldMapConfig {
  lowerSrc: string;
  upperSrc: string;
  gameObjects: TGameObjects;
  walls?: TGameWalls;
}

export class OverworldMap {
  gameObjects: TGameObjects;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;
  walls: TGameWalls;
  isCutscenePlaying: boolean;
  isPaused: boolean;

  constructor(config: IOverworldMapConfig) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
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
      await event.init();
    }
    // await each one
    this.isCutscenePlaying = false;
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

interface IOverWorldMaps {
  [key: string]: {
    lowerSrc: string;
    upperSrc: string;
    gameObjects: TGameObjects;
    walls: TGameWalls;
  };
}

export const OverWorldMaps: IOverWorldMaps = {
  DemoRoom: {
    lowerSrc: testRoomSrcLower,
    upperSrc: testRoomSrcUpper,
    gameObjects: {
      hero: new Person({
        src: heroSrc,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        direction: 'down',
        isPlayerControlled: true,
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: npc1Src,
        direction: 'down',
        behaviorLoop: [
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'right', time: 600 },
          { type: 'stand', direction: 'down', time: 1200 },
          { type: 'stand', direction: 'left', time: 1500 },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(7),
        src: npc2Src,
        direction: 'left',
        behaviorLoop: [
          { type: 'walk', direction: 'left' },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'walk', direction: 'up' },
          { type: 'walk', direction: 'right' },
          { type: 'walk', direction: 'down' },
        ],
      }),
    },
    walls: {
      [utils.asGridCoord(7, 2)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(2, 3)]: true,
      [utils.asGridCoord(3, 3)]: true,
      [utils.asGridCoord(4, 3)]: true,
      [utils.asGridCoord(5, 3)]: true,
      [utils.asGridCoord(6, 3)]: true,
      [utils.asGridCoord(8, 3)]: true,
      [utils.asGridCoord(9, 3)]: true,
      [utils.asGridCoord(10, 3)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(8, 4)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
  },
  Kitchen: {
    lowerSrc: kitchetSrcLower,
    upperSrc: kitchetSrcUpper,
    gameObjects: {
      hero: new GameObject({
        src: heroSrc,
        x: utils.withGrid(7),
        y: utils.withGrid(9),
      }),
      npc1: new GameObject({
        x: utils.withGrid(3),
        y: utils.withGrid(5),
        src: npc1Src,
      }),
    },
    walls: {},
  },
};
