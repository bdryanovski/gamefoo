import DynamicNode from "./dynamic_node";

export default class Player extends DynamicNode {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  update(deltaTime: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
  }
}
