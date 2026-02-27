export default class Input {
  private keys: Set<string> = new Set();
  private mouseButtons: Set<number> = new Set();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    window.addEventListener("keydown", (e) => {
      this.keys.add(e.key.toLowerCase());
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    // Mouse events
    window.addEventListener("mousedown", (e) => {
      this.mouseButtons.add(e.button);
    });

    window.addEventListener("mouseup", (e) => {
      this.mouseButtons.delete(e.button);
    });

    window.addEventListener("mousemove", (e) => {
      this.mousePosition = { x: e.clientX, y: e.clientY };
    });
  }

  isKeyDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  getPressedKeys(): Set<string> {
    return new Set(this.keys);
  }

  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.has(button);
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  reset(): void {
    this.keys.clear();
    this.mouseButtons.clear();
  }
}
