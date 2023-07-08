import heroSrc from '@/img/characters/people/hero.png';
import npc1Src from '@/img/characters/people/npc1.png';
import npc2Src from '@/img/characters/people/npc2.png';
import testRoomSrcLower from '@/img/maps/DemoLower.png';
import testRoomSrcUpper from '@/img/maps/DemoUpper.png';
import kitchetSrcLower from '@/img/maps/KitchenLower.png';
import kitchetSrcUpper from '@/img/maps/KitchenUpper.png';
import { Person } from './Characters/Person';
import { GameObject } from './GeneralClasses/GameObject';
import {
  TGameCutsceneSpaces,
  TGameObjects,
  TGameWalls,
} from './GeneralClasses/OverworldMap';
import { utils } from './utils/utils';
interface IOverWorldMaps {
  [key: string]: {
    lowerSrc: string;
    upperSrc: string;
    gameObjects: TGameObjects;
    walls: TGameWalls;
    cutsceneSpaces?: TGameCutsceneSpaces;
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
        talking: [
          {
            events: [
              { type: 'textMessage', text: "I'm busy", faceHero: 'npcA' },
              { type: 'textMessage', text: 'FUCK OFF!' },
              { who: 'hero', type: 'walk', direction: 'up' },
            ],
          },
          {
            events: [{ type: 'textMessage', text: 'BYE!' }],
          },
        ],
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: npc2Src,
        direction: 'left',
        behaviorLoop: [
          { type: 'walk', direction: 'right' },
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'walk', direction: 'left' },
          { type: 'stand', direction: 'down', time: 500 },
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
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: 'npcB', type: 'walk', direction: 'left' },
            { who: 'npcB', type: 'stand', direction: 'up', time: 500 },
            { type: 'textMessage', text: "You can't be in there!" },
            { who: 'npcB', type: 'walk', direction: 'right' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' },
            { who: 'hero', type: 'stand', direction: 'right' },
            { who: 'npcB', type: 'stand', direction: 'down', time: 200 },
          ],
        },
      ],
      [utils.asGridCoord(5, 10)]: [
        {
          events: [{ type: 'changeMap', map: 'Kitchen' }],
        },
      ],
    },
  },
  Kitchen: {
    lowerSrc: kitchetSrcLower,
    upperSrc: kitchetSrcUpper,
    gameObjects: {
      hero: new Person({
        src: heroSrc,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
        isPlayerControlled: true,
      }),
      npcA: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(5),
        src: npc1Src,
        talking: [
          {
            events: [
              {
                type: 'textMessage',
                text: 'You made it to the kitchen!',
                faceHero: 'npcA',
              },
            ],
          },
        ],
      }),
    },
    walls: {},
    cutsceneSpaces: {
      [utils.asGridCoord(5, 10)]: [
        {
          events: [{ type: 'changeMap', map: 'DemoRoom' }],
        },
      ],
    },
  },
};
