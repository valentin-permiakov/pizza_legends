import { TDirection } from '@/Controls/DirectionInput';
import { Sprite } from './Sprite';

export interface IGameObjectConfig {
  x: number;
  y: number;
  src: string;
  direction?: TDirection;
  isPlayerControlled?: boolean;
}

export interface IGameObjectUpdate {
  arrow: TDirection;
}

export class GameObject {
  x: number;
  y: number;
  sprite: Sprite;
  direction: TDirection;

  constructor(config: IGameObjectConfig) {
    this.x = config.x;
    this.y = config.y;
    this.direction = config.direction || 'down';
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
      currentAnimation: '',
      currentAnimationFrame: 0,
      animations: {
        idleDown: [[0, 0]],
      },
      useShadow: true,
    });
  }

  public update(state: IGameObjectUpdate) {}
}
