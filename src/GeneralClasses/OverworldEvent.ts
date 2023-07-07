import { IBehavior } from './GameObject';
import { OverworldMap } from './OverworldMap';

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

  public stand(resolve: (value: unknown) => void) {
    const who = this.map.gameObjects[this.event.who];
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

  public walk(resolve: (value: PromiseLike<null>) => void) {
    const who = this.map.gameObjects[this.event.who];
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

  public init() {
    return new Promise<null>((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
