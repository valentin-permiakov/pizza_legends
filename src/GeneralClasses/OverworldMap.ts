import { GameObject } from './GameObject';
import heroSrc from '@/img/characters/people/hero.png';
import npc1Src from '@/img/characters/people/npc1.png';
import testRoomSrcLower from '@/img/maps/DemoLower.png';
import testRoomSrcUpper from '@/img/maps/DemoUpper.png';
import kitchetSrcLower from '@/img/maps/KitchenLower.png';
import kitchetSrcUpper from '@/img/maps/KitchenUpper.png';

type TGameObjects = {
  [key: string]: GameObject;
};

export interface IOverworldMapConfig {
  lowerSrc: string;
  upperSrc: string;
  gameObjects: TGameObjects;
}

export class OverworldMap {
  gameObjects: TGameObjects;
  lowerImage: HTMLImageElement;
  upperImage: HTMLImageElement;

  constructor(config: IOverworldMapConfig) {
    this.gameObjects = config.gameObjects;

    // images
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  public drawLowerImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  public drawUpperImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

interface IOverWorldMaps {
  [key: string]: {
    lowerSrc: string;
    upperSrc: string;
    gameObjects: TGameObjects;
  };
}

export const OverWorldMaps: IOverWorldMaps = {
  DemoRoom: {
    lowerSrc: testRoomSrcLower,
    upperSrc: testRoomSrcUpper,
    gameObjects: {
      hero: new GameObject({
        src: heroSrc,
        x: 5,
        y: 6,
      }),
      npc1: new GameObject({
        x: 7,
        y: 9,
        src: npc1Src,
      }),
    },
  },
  Kitchen: {
    lowerSrc: kitchetSrcLower,
    upperSrc: kitchetSrcUpper,
    gameObjects: {
      hero: new GameObject({
        src: heroSrc,
        x: 7,
        y: 9,
      }),
      npc1: new GameObject({
        x: 3,
        y: 5,
        src: npc1Src,
      }),
    },
  },
};
