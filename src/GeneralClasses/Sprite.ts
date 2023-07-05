import { GameObject } from './GameObject';
import shadowSrc from '@/img/characters/shadow.png';

interface ISpriteConfig {
  animations: {
    idleDown: number[][];
  };
  currentAnimation: string;
  currentAnimationFrame: number;
  src: string;
  gameObject: GameObject;
  useShadow?: boolean;
}

export class Sprite {
  gameObject: GameObject;
  animations: {
    idleDown: number[][];
  };
  currentAnimaion: string;
  currentAnimationFrame: number;
  image: HTMLImageElement;
  shadow: HTMLImageElement;
  isLoaded: boolean;
  isShadowLoaded: boolean;
  useShadow: boolean;

  constructor(config: ISpriteConfig) {
    // configure animation & initial state
    this.animations = config.animations || {
      idleDown: [[0, 0]],
    };
    this.currentAnimaion = config.currentAnimation || 'idleDown';
    this.currentAnimationFrame = config.currentAnimationFrame || 0;

    // setup image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // setup shadow
    this.shadow = new Image();
    this.useShadow = config.useShadow || false;
    if (this.useShadow) {
      this.shadow.src = shadowSrc;
    }

    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  /**
   * draw sprite
   */
  public draw(ctx: CanvasRenderingContext2D) {
    const x = this.gameObject.x - 8;
    const y = this.gameObject.y - 18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
    this.isLoaded && ctx.drawImage(this.image, 0, 0, 32, 32, x, y, 32, 32);
  }
}
