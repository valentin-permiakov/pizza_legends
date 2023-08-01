import { Battle } from './Battle';

interface IStatus {
  type: string;
  expiresIn: number;
}

interface ICombatantConfig {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  status: IStatus;
  name: string;
  actions: string[];
}

export class Combatant {
  battle: Battle;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  status: IStatus;
  name: string;
  actions: string[];
  constructor(config: ICombatantConfig, battle: Battle) {
    this.battle = battle;
    this.hp = config.hp;
    this.maxHp = config.maxHp;
    this.xp = config.xp;
    this.level = config.level;
    this.status = config.status;
    this.name = config.name;
    this.actions = config.actions;
  }

  public createElement() {}

  public init() {}
}
