import { TDirection } from '@/Controls/DirectionInput';
import {
  GameObject,
  IBehavior,
  IGameObjectConfig,
  IGameObjectUpdate,
} from '@/GeneralClasses/GameObject';
import { IAnimations } from '@/GeneralClasses/Sprite';
import { utils } from '@/utils/utils';

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

  startBehavior(state: IGameObjectUpdate, behavior: IBehavior) {
    // Set character behavior to whatever behavior has
    this.direction = behavior.direction;

    if (behavior.type === 'walk') {
      // Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry &&
          setTimeout(() => {
            this.startBehavior(state, behavior);
          }, 10);

        return;
      }

      // Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movementProgressRemaining = 16;
      this.updateSprite();
    }

    if (behavior.type === 'stand') {
      setTimeout(() => {
        utils.emitEvent('PersonStandingComplete', {
          whoId: this.id,
        });
      }, behavior.time || 100);
    }
  }

  public updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movementProgressRemaining -= 1;

    if (this.movementProgressRemaining === 0) {
      // We finished walking
      utils.emitEvent('PersonWalkingComplete', { whoId: this.id });
    }
  }

  update(state: IGameObjectUpdate) {
    if (this.movementProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // More cases for starting to walk will come here
      //
      //

      // Case: we're keyboard ready and have an arrow pressed
      if (
        this.isPlayerControlled &&
        state.arrow &&
        !state.map.isCutscenePlaying
      ) {
        this.startBehavior(state, {
          type: 'walk',
          direction: state.arrow,
        });
      }
      this.updateSprite();
    }
  }

  updateSprite() {
    if (this.movementProgressRemaining > 0) {
      this.sprite.setAnimation(('walk-' + this.direction) as keyof IAnimations);
      return;
    }
    this.sprite.setAnimation(('idle-' + this.direction) as keyof IAnimations);
  }
}
