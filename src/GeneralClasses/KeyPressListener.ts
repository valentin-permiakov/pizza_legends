export class KeyPressListener {
  keyDownFn: (event: KeyboardEvent) => void;
  keyUpFn: (event: KeyboardEvent) => void;
  constructor(keyCode: string, callback: () => void) {
    let keySafe = true;
    this.keyDownFn = (event) => {
      if (event.code === keyCode) {
        if (keySafe) {
          keySafe = false;
          callback();
        }
      }
    };
    this.keyUpFn = (event) => {
      if (event.code === keyCode) {
        keySafe = true;
      }
    };

    document.addEventListener('keydown', this.keyDownFn);
    document.addEventListener('keyup', this.keyUpFn);
  }

  public unbind() {
    document.removeEventListener('keydown', this.keyDownFn);
    document.removeEventListener('keyup', this.keyUpFn);
  }
}
