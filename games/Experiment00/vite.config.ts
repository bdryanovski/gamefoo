import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const projectRoot = resolve(repoRoot, 'tools/public');

const MIME: Record<string, string> = {
  json: 'application/json',
  png: 'image/png',
};

// Serve the tools editor's exports/uploads *as they are* under `/project/…`,
// straight from disk. Nothing is copied into this game or mutated, so a
// re-export from the editor is picked up on the next reload.
function serveProject(): Plugin {
  const prefix = '/project/';
  return {
    name: 'serve-project',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith(prefix)) return next();
        const rel = decodeURIComponent(req.url.slice(prefix.length).split('?')[0]);
        const filePath = resolve(projectRoot, rel);
        if (
          !filePath.startsWith(projectRoot) ||
          !existsSync(filePath) ||
          !statSync(filePath).isFile()
        ) {
          return next();
        }
        const ext = filePath.split('.').pop() ?? '';
        res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
        createReadStream(filePath).pipe(res);
      });
    },
  };
}

// The engine is read straight from its TypeScript source (`../../src`); the
// `@` alias mirrors the engine's own internal import prefix.
export default defineConfig({
  root: here,
  plugins: [serveProject()],
  server: {
    port: 5173,
    open: true,
    fs: { allow: [repoRoot] },
  },
  resolve: {
    alias: { '@': resolve(repoRoot, 'src') },
  },
});
