import { KeyPressListener } from '@/GeneralClasses/KeyPressListener';
import { RevealingText } from './RevealingText';

interface ITextMessageConfig {
  text: string;
  onComplete: () => void;
}

export class TextMessage {
  text: string;
  onComplete: () => void;
  element: HTMLElement;
  actionListener: KeyPressListener;
  revealingText: RevealingText;

  constructor({ text, onComplete }: ITextMessageConfig) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  private createElement() {
    // Create an element
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');
    this.element.innerHTML = `
        <p class="TextMessage_text"></p>
        <button class="TextMessage_button">Next</button> 
    `;

    // Init the typewrite effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.TextMessage_text'),
      text: this.text,
      speed: 50,
    });

    this.element
      .querySelector('.TextMessage_button')
      .addEventListener('click', () => {
        // Close the text message
        this.done();
      });

    this.actionListener = new KeyPressListener('Enter', () => {
      this.done();
    });
  }

  private done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  public init(container: HTMLElement) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }
}
