export interface ICharacterConfig {
  span: HTMLSpanElement;
  delayAfter: number;
}

export interface IRevealingTextConfig {
  element: HTMLElement;
  text: string;
  speed: number;
}

export class RevealingText {
  element: HTMLElement;
  text: string;
  speed: number;
  timeout: NodeJS.Timeout;
  isDone: boolean;

  constructor(config: IRevealingTextConfig) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 70;
    this.timeout = null;
    this.isDone = false;
  }

  private revealOneCharacter(list: Array<ICharacterConfig>) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add('revealed');

    if (list.length > 0) {
      // continue revealing characters one by one

      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list);
      }, next.delayAfter);
    } else {
      this.isDone = true;
    }
  }

  warpToDone() {
    clearInterval(this.timeout);
    this.isDone = true;

    this.element.querySelectorAll('span').forEach((span) => {
      span.classList.add('revealed');
    });
  }

  public init() {
    const characters: Array<ICharacterConfig> = [];
    this.text.split('').forEach((character) => {
      //   create each span and add to element in DOM
      const span = document.createElement('span');
      span.textContent = character;
      this.element.appendChild(span);

      //   Add this span to our initial state Array
      characters.push({
        span,
        delayAfter: character === ' ' ? 0 : this.speed,
      });
    });

    this.revealOneCharacter(characters);
  }
}
