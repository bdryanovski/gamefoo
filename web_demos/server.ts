import index from './index.html';
import demo from './demo/index.html';
import sprite from './sprite/index.html';
import endlessWorld from './endless-world/index.html';
import floppy from './floppy/index.html';
import fonts from './fonts/index.html';
import icons from './icons/index.html';
import clock from './clock/index.html';
import isometric from './isometric/index.html';
import duel from './duel/index.html';

import dungen from './dungen/index.html';

const server = Bun.serve({
  port: 3000,
  routes: {
    '/': index,
    '/demo': demo,
    '/sprite': sprite,
    '/fonts': fonts,
    '/endless-world': endlessWorld,
    '/floppy': floppy,
    '/icons': icons,
    '/clock': clock,
    '/isometric': isometric,
    '/dungen': dungen,
    '/duel': duel,
  },
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const file = Bun.file(`./demos${path}`);
    if (await file.exists()) {
      return new Response(file);
    }
    return new Response('Not Found', { status: 404 });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🎮 GameFoo demos running at ${server.url}`);
