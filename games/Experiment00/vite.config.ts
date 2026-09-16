import { cpSync, createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');
const projectRoot = resolve(repoRoot, 'tools/public');
const distRoot = resolve(here, 'dist');

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

// Stage every runtime-fetched static file into `dist/` at the exact URL the
// built game requests, so a plain static host (Vercel, etc.) serves them with
// no dev middleware. In dev these come from `serveProject` and Vite's root
// static serving; a production `vite build` ships none of them by default.
// Build-only (`apply: 'build'`); runs after the bundle is written.
function stageStaticAssets(): Plugin {
  return {
    name: 'stage-static-assets',
    apply: 'build',
    closeBundle() {
      const copies: [from: string, to: string][] = [
        // Audio catalog + clips, fetched from `/assets/audio/…`.
        [resolve(here, 'assets'), resolve(distRoot, 'assets')],
        // The map project, fetched from `/project/projects/…`.
        [
          resolve(projectRoot, 'projects/proj_mtj0babj_m.json'),
          resolve(distRoot, 'project/projects/proj_mtj0babj_m.json'),
        ],
        // Dialog export, fetched from `/project/exports/…`.
        [
          resolve(projectRoot, 'exports/proj_mtj0babj_m/experiment00.dialogs.json'),
          resolve(distRoot, 'project/exports/proj_mtj0babj_m/experiment00.dialogs.json'),
        ],
        // Sprite-sheet images, resolved to `/project/uploads/…` by the loader.
        [resolve(projectRoot, 'uploads'), resolve(distRoot, 'project/uploads')],
      ];
      for (const [from, to] of copies) {
        if (!existsSync(from)) {
          this.warn(`stage-static-assets: missing source ${from}`);
          continue;
        }
        mkdirSync(dirname(to), { recursive: true });
        cpSync(from, to, { recursive: true });
      }
    },
  };
}

// The engine is read straight from its TypeScript source (`../../src`); the
// `@` alias mirrors the engine's own internal import prefix.
export default defineConfig({
  root: here,
  plugins: [serveProject(), stageStaticAssets()],
  // Expose `MIX_PANEL` (Vercel-provided at build) to client code alongside the
  // default `VITE_` prefix. Vite inlines matching vars from `.env.local` (dev)
  // and `process.env` (Vercel build) into `import.meta.env`.
  envPrefix: ['VITE_', 'MIX_PANEL'],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    fs: { allow: [repoRoot] },
  },
  preview: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: { '@': resolve(repoRoot, 'src') },
  },
});
