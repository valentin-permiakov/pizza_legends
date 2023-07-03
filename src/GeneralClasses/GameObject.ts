import { Sprite } from './Sprite';

export interface IGameObjectConfig {
  x: number;
  y: number;
  src: string;
}

export class GameObject {
  x: number;
  y: number;
  sprite: Sprite;

  constructor(config: IGameObjectConfig) {
    this.x = config.x;
    this.y = config.y;
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
}
