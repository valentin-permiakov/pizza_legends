import { TDirection } from '@/Controls/DirectionInput';
import {
  GameObject,
  IGameObjectConfig,
  IGameObjectUpdate,
} from '@/GeneralClasses/GameObject';
import { IAnimations } from '@/GeneralClasses/Sprite';

type IDirectionUpdate = {
  [key in TDirection]: ['x' | 'y', number];
};

export class Person extends GameObject {
  movementProgressRemaining: number;
  directionUpdate: IDirectionUpdate;
  isPlayerControlled: boolean;

  constructor(config: IGameObjectConfig) {
    super(config);

    this.isPlayerControlled = config.isPlayerControlled;

    this.movementProgressRemaining = 0;
    this.directionUpdate = {
      up: ['y', -1],
      down: ['y', 1],
      left: ['x', -1],
      right: ['x', 1],
    };
  }

  public updatePosition() {
    if (this.movementProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movementProgressRemaining -= 1;
    }
  }

  update(state: IGameObjectUpdate) {
    this.updatePosition();
    this.updateSprite(state);

    if (
      this.isPlayerControlled &&
      state.arrow &&
      this.movementProgressRemaining === 0
    ) {
      this.direction = state.arrow;
      this.movementProgressRemaining = 16;
    }
    console.log(this.direction, this.movementProgressRemaining);
  }

  updateSprite(state: IGameObjectUpdate) {
    if (
      this.isPlayerControlled &&
      !state.arrow &&
      this.movementProgressRemaining === 0
    ) {
      this.sprite.setAnimation(('idle-' + this.direction) as keyof IAnimations);
      return;
    }
    if (this.movementProgressRemaining > 0) {
      this.sprite.setAnimation(('walk-' + this.direction) as keyof IAnimations);
    }
  }
}
