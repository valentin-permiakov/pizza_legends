import { utils } from '@/utils/utils';
import { GameObject } from './GameObject';
import shadowSrc from '@/img/characters/shadow.png';

export interface IAnimations {
  'idle-down': number[][];
  'idle-up': number[][];
  'idle-left': number[][];
  'idle-right': number[][];
  'walk-down': number[][];
  'walk-up': number[][];
  'walk-left': number[][];
  'walk-right': number[][];
}

interface ISpriteConfig {
  animations?: IAnimations;
  currentAnimation: keyof IAnimations;
  currentAnimationFrame: number;
  src: string;
  gameObject: GameObject;
  useShadow?: boolean;
  animationFrameLimit?: number;
}

export class Sprite {
  gameObject: GameObject;
  animations: IAnimations;
  currentAnimation: keyof IAnimations;
  currentAnimationFrame: number;
  image: HTMLImageElement;
  shadow: HTMLImageElement;
  isLoaded: boolean;
  isShadowLoaded: boolean;
  useShadow: boolean;
  animationFrameLimit: number;
  animationFrameProgress: number;

  constructor(config: ISpriteConfig) {
    // configure animation & initial state
    this.animations = config.animations || {
      'idle-down': [[0, 0]],
      'idle-right': [[0, 1]],
      'idle-up': [[0, 2]],
      'idle-left': [[0, 3]],
      'walk-down': [
        [1, 0],
        [0, 0],
        [3, 0],
        [0, 0],
      ],
      'walk-right': [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      'walk-up': [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      'walk-left': [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };
    this.currentAnimation = config.currentAnimation || 'idle-down';
    this.currentAnimationFrame = config.currentAnimationFrame || 0;
    this.animationFrameLimit = config.animationFrameLimit || 4;
    this.animationFrameProgress = this.animationFrameLimit;

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

  public get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key: keyof IAnimations) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  public updateAnimationProgress() {
    // Downtick frame progress

    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress--;
      return;
    }

    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame++;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
    const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 18 + utils.withGrid(6) - cameraPerson.y;

    const [frameX, frameY] = this.frame;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
    this.isLoaded &&
      ctx.drawImage(this.image, frameX * 32, frameY * 32, 32, 32, x, y, 32, 32);

    this.updateAnimationProgress();
  }
}
