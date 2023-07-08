export class SceneTransition {
  element: HTMLElement;

  constructor() {
    this.element = null;
  }

  private createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('SceneTransition');
  }

  public fadeOut() {
    this.element.classList.add('fade-out');

    this.element.addEventListener(
      'animationend',
      () => {
        this.element.remove();
      },
      { once: true }
    );
  }

  public init(container: HTMLElement, callback: () => void) {
    this.createElement();
    container.appendChild(this.element);

    this.element.addEventListener(
      'animationend',
      () => {
        callback();
      },
      { once: true }
    );
  }
}
