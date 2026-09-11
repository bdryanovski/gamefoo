import { Engine, WebRenderer } from "../../src/index";

const CANVAS_W = 800;
const CANVAS_H = 600;

const renderer = new WebRenderer("game", CANVAS_W, CANVAS_H);
const engine = new Engine(renderer, { backgroundColor: "#1a1a2e" });

engine.setup(() => {
  console.log("Map demo initialized");
});
