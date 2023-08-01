import hero from '@/img/characters/people/hero.png';
import npc3 from '@/img/characters/people/npc3.png';
import { Combatant } from './Combatant';

interface IBattleConfig {
  onComplete: () => void;
}

export class Battle {
  element: HTMLDivElement;
  combatants: {
    [key: string]: Combatant;
  };

  constructor(config: IBattleConfig) {
    this.combatants = {
      player1: new Combatant(
        {
          hp: 100,
          maxHp: 100,
          xp: 0,
          level: 1,
          status: null,
          name: 'player1',
          actions: [],
        },
        this
      ),
    };
  }

  public createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('battle');
    this.element.innerHTML = `
        <div class='battle_hero'>
            <img src='${hero}' alt='hero' />
        </div>
        <div class='battle_enemy'>
            <img src='${npc3}' alt='hero' />
        </div>
    `;
  }

  public init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.element);
  }
}
