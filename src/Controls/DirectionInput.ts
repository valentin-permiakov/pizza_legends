export type TDirection = 'up' | 'down' | 'left' | 'right';
export interface IDirectionInputMap {
  [key: string]: TDirection;
  ArrowUp: 'up';
  KeyW: 'up';
  ArrowDown: 'down';
  KeyS: 'down';
  ArrowLeft: 'left';
  KeyA: 'left';
  ArrowRight: 'right';
  KeyD: 'right';
}

type THeldDirections = Array<TDirection>;

export class DirectionInput {
  heldDirections: THeldDirections;
  map: IDirectionInputMap;
  constructor() {
    this.heldDirections = [];
    this.map = {
      ArrowUp: 'up',
      KeyW: 'up',
      ArrowDown: 'down',
      KeyS: 'down',
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right',
    };
  }

  public init() {
    document.addEventListener('keydown', (e) => {
      if (this.map.hasOwnProperty(e.code)) {
        const dir = this.map[e.code];

        if (dir && this.heldDirections.indexOf(dir) === -1) {
          this.heldDirections.unshift(dir);
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      if (this.map.hasOwnProperty(e.code)) {
        const dir = this.map[e.code];

        const index = this.heldDirections.indexOf(dir);

        if (index > -1) {
          this.heldDirections.splice(index, 1);
        }
      }
    });
  }

  get direction() {
    return this.heldDirections[0];
  }
}
