import { TDirection } from '@/Controls/DirectionInput';
import { GameObject } from '@/GeneralClasses/GameObject';

export const utils = {
  withGrid(n: number) {
    return n * 16;
  },
  asGridCoord(x: number, y: number) {
    return `${x * 16},${y * 16}`;
  },
  nextPosition(initialX: number, initialY: number, direction: string) {
    let x = initialX;
    let y = initialY;
    const size = 16;

    switch (direction) {
      case 'left':
        x -= size;
        break;
      case 'right':
        x += size;
        break;
      case 'up':
        y -= size;
        break;
      case 'down':
        y += size;
        break;

      default:
        break;
    }

    return { x, y };
  },

  oppositeDirection(direction: TDirection): TDirection {
    switch (direction) {
      case 'left':
        return 'right';
      case 'right':
        return 'left';
      case 'up':
        return 'down';
      case 'down':
        return 'up';
    }
  },

  emitEvent(
    name: string,
    detail?: {
      whoId: string;
    }
  ) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
};
