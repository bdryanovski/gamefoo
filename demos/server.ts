import index from "./index.html";
import demo from "./demo/index.html";
import sprite from "./sprite/index.html";
import endlessWorld from "./endless-world/index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/demo": demo,
    "/sprite": sprite,
    "/endless-world": endlessWorld,
  },
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const file = Bun.file(`./demos${path}`);
    if (await file.exists()) {
      return new Response(file);
    }
    return new Response("Not Found", { status: 404 });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🎮 GameFoo demos running at ${server.url}`);

Bun.spawn(["open", server.url.toString()]);
