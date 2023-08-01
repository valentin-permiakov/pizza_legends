import { TextMessage } from '@/Messages/TextMessage';
import { IBehavior } from './GameObject';
import { OverworldMap } from './OverworldMap';
import { utils } from '@/utils/utils';
import { OverWorldMaps } from '@/overworldMaps';
import { SceneTransition } from './SceneTransition';
import { Battle } from '@/Battle/Battle';

export interface IOverworldEventConfig {
  map: OverworldMap;
  event: IBehavior;
}

export class OverworldEvent {
  map: OverworldMap;
  event: IBehavior;
  constructor({ map, event }: IOverworldEventConfig) {
    this.map = map;
    this.event = event;
  }

  private stand(resolve: (value: unknown) => void) {
    const who = this.map.gameObjects[this.event.who || 'hero'];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: 'stand',
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    // Set up  a handler to complete when the correct person finished walking
    const completeHandler = (e: CustomEvent) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandingComplete', completeHandler);
        resolve(null);
      }
    };
    document.addEventListener('PersonStandingComplete', completeHandler);
  }

  private walk(resolve: (value: PromiseLike<null>) => void) {
    const who = this.map.gameObjects[this.event.who || 'hero'];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: 'walk',
        direction: this.event.direction,
        retry: true,
      }
    );

    // Set up  a handler to complete when the correct person finished walking
    const completeHandler = (e: CustomEvent) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve(null);
      }
    };
    document.addEventListener('PersonWalkingComplete', completeHandler);
  }

  private textMessage(resolve: (value: PromiseLike<null>) => void) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];

      obj.direction = utils.oppositeDirection(
        this.map.gameObjects['hero'].direction
      );
    }

    const message = new TextMessage({
      text: this.event.text || '',
      onComplete: () => resolve(null),
    });
    message.init(document.getElementById('game-container'));
  }

  private changeMap(resolve: (value: PromiseLike<null>) => void) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.getElementById('game-container'), () => {
      if (OverWorldMaps[this.event.map]) {
        this.map.overworld.startMap({ ...OverWorldMaps[this.event.map] });
      } else {
        this.map.overworld.startMap({ ...OverWorldMaps.DemoRoom });
      }
      resolve(null);
      sceneTransition.fadeOut();
    });
  }

  private battle(resolve: (value: PromiseLike<null>) => void) {
    const battle = new Battle({
      onComplete: () => resolve(null),
    });
    battle.init(document.getElementById('game-container'));
  }

  public init() {
    return new Promise<null>((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
