import index from "./index.html";
import demo from "./demo/index.html";
import endlessWorld from "./endless-world/index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/demo": demo,
    "/endless-world": endlessWorld,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🎮 GameFoo demos running at ${server.url}`);

Bun.spawn(["open", server.url.toString()]);
