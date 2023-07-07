import { TDirection } from '@/Controls/DirectionInput';
import { IAnimations, Sprite } from './Sprite';
import { OverworldMap } from './OverworldMap';
import { OverworldEvent } from './OverworldEvent';

export type BehaviorType = 'walk' | 'stand';

export interface IBehavior {
  type: BehaviorType;
  direction: TDirection;
  time?: number;
  who?: string;
  retry?: boolean;
}

export interface IGameObjectConfig {
  x: number;
  y: number;
  src: string;
  direction?: TDirection;
  isPlayerControlled?: boolean;
  behaviorLoop?: IBehavior[];
}

export interface IGameObjectUpdate {
  arrow?: TDirection;
  map: OverworldMap;
}

export class GameObject {
  id: string;
  isMounted: boolean;
  x: number;
  y: number;
  sprite: Sprite;
  direction: TDirection;
  behaviorLoop: IBehavior[];
  behaviorLoopIndex: number;

  constructor(config: IGameObjectConfig) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x;
    this.y = config.y;
    this.direction = config.direction || 'down';
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
      currentAnimation: ('idle-' + this.direction) as keyof IAnimations,
      currentAnimationFrame: 0,
      useShadow: true,
    });
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
  }

  public mount(map: OverworldMap) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // If we have a behavior kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  startBehavior(state: IGameObjectUpdate, behavior: IBehavior) {}

  public async doBehaviorEvent(map: OverworldMap) {
    // Don't do anything if there's a cutscene in progress or no behavior to have
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      return;
    }

    // Set event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    // Create an event instance
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // Setting the next Event to fire
    this.behaviorLoopIndex += 1;

    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    // Do it again!
    this.doBehaviorEvent(map);
  }

  public update(state: IGameObjectUpdate) {}
}
