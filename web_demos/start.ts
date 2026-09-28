#!/usr/bin/env bun
/**
 * Demo server launcher - generates routes and starts the server
 */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { $ } from 'bun';

const DEMOS_DIR = import.meta.dir;

interface DemoMeta {
  name: string;
  title: string;
  description: string;
  tags: string[];
  path: string;
}

// Folders to exclude from demo discovery
const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist']);

function formatTitle(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Discover all demo folders
async function discoverDemos(): Promise<DemoMeta[]> {
  const entries = await readdir(DEMOS_DIR, { withFileTypes: true });
  const demos: DemoMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || EXCLUDE_DIRS.has(entry.name)) continue;

    const demoPath = join(DEMOS_DIR, entry.name);
    const indexFile = Bun.file(join(demoPath, 'index.html'));

    if (!(await indexFile.exists())) continue;

    // Try to load demo.json for metadata
    let meta: Partial<DemoMeta> = {};
    const metaFile = Bun.file(join(demoPath, 'demo.json'));
    if (await metaFile.exists()) {
      try {
        meta = await metaFile.json();
      } catch {
        // Invalid JSON, use defaults
      }
    }

    demos.push({
      name: entry.name,
      title: meta.title ?? formatTitle(entry.name),
      description: meta.description ?? '',
      tags: meta.tags ?? [],
      path: `/${entry.name}`,
    });
  }

  return demos.sort((a, b) => a.title.localeCompare(b.title));
}

// Generate server.ts with static imports
async function generateServer(demos: DemoMeta[]): Promise<void> {
  const imports = demos.map((d, i) => `import demo${i} from './${d.name}/index.html';`).join('\n');

  const routeEntries = demos.map((d, i) => `    '/${d.name}': demo${i},`).join('\n');

  const code = `// AUTO-GENERATED - Do not edit manually
// Run: bun web_demos/start.ts to regenerate

import { watch } from 'fs';
import { join } from 'node:path';

${imports}

const DEMOS_DIR = import.meta.dir;
const SRC_DIR = join(import.meta.dir, '..', 'src');
const PORT = 3000;

const demoMeta = ${JSON.stringify(demos, null, 2)};

// Generate the landing page HTML
function generateLandingPage(): string {
  const demoCards = demoMeta
    .map(
      (demo) => \`
      <a class="card" href="\${demo.path}">
        <h2>\${demo.title}</h2>
        \${demo.description ? \`<p>\${demo.description}</p>\` : '<p class="empty">No description</p>'}
        \${
          demo.tags.length > 0
            ? \`<div class="tags">\${demo.tags.map((t) => \`<span class="tag">\${t}</span>\`).join('')}</div>\`
            : ''
        }
      </a>\`
    )
    .join('\\n');

  return \`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GameFoo Demos</title>
    <link rel="stylesheet" href="/shared.css" />
    <style>
      body {
        padding: 40px 20px;
        justify-content: flex-start;
      }

      header {
        text-align: center;
        margin-bottom: 40px;
      }

      header h1 {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        margin-bottom: 6px;
      }

      .subtitle { color: #888; font-size: 0.9rem; }

      .count {
        display: inline-block;
        background: #fff;
        color: #666;
        font-size: 0.75rem;
        padding: 4px 12px;
        border-radius: 12px;
        margin-top: 12px;
        border: 1px solid #ddd;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
        max-width: 1000px;
        width: 100%;
      }

      .card {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px 24px;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
      }

      .card:hover {
        border-color: #bbb;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      }

      .card h2 { font-size: 1.1rem; font-weight: 600; color: #333; margin-bottom: 8px; }
      .card p { font-size: 0.8rem; color: #666; line-height: 1.5; }
      .card p.empty { color: #aaa; font-style: italic; }

      .tags { margin-top: 14px; display: flex; gap: 6px; flex-wrap: wrap; }
      .tag {
        font-size: 0.65rem;
        padding: 3px 8px;
        border-radius: 4px;
        background: #f0f0f0;
        color: #555;
        border: 1px solid #e0e0e0;
      }

      footer {
        text-align: center;
        margin-top: 48px;
        padding-top: 24px;
        border-top: 1px solid #ddd;
        font-size: 0.75rem;
        color: #888;
      }

      footer code {
        background: #fff;
        padding: 2px 8px;
        border-radius: 4px;
        color: #555;
        border: 1px solid #ddd;
      }

      .tip {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px 20px;
        max-width: 600px;
        margin-bottom: 32px;
        font-size: 0.8rem;
        color: #666;
        text-align: center;
      }

      .tip strong { color: #444; }
      .tip code { background: #f5f5f5; padding: 1px 6px; border-radius: 3px; font-size: 0.85em; }
    </style>
  </head>
  <body>
    <header>
      <h1>GAMEFOO</h1>
      <p class="subtitle">Demo Collection</p>
      <span class="count">\${demoMeta.length} demos</span>
    </header>

    <div class="tip">
      <strong>Add a new demo:</strong> Create a folder with an <code>index.html</code>. 
      Add <code>demo.json</code> for metadata. Restart server.
    </div>

    <div class="grid">
      \${demoCards}
    </div>

    <footer>
      Auto-refresh enabled &middot; <code>bun web_demos/start.ts</code>
    </footer>
  </body>
</html>\`;
}

// Track WebSocket clients for live reload
const clients = new Set<WebSocket>();

// File watcher for live reload
function startWatcher() {
  for (const dir of [DEMOS_DIR, SRC_DIR]) {
    watch(dir, { recursive: true }, (event, filename) => {
      if (!filename || filename.startsWith('.') || filename.endsWith('.map')) return;
      console.log(\`\\x1b[33m[reload]\\x1b[0m \${filename}\`);
      for (const client of clients) {
        try { client.send('reload'); } catch { clients.delete(client); }
      }
    });
  }
  console.log(\`\\x1b[36m[watch]\\x1b[0m Watching demos and src/\`);
}

// Inject live reload script
function withLiveReload(html: string): Response {
  const script = \`<script>(function(){const ws=new WebSocket('ws://'+location.host+'/__reload');ws.onmessage=()=>location.reload();ws.onclose=()=>setTimeout(()=>location.reload(),1000);})();</script></body>\`;
  return new Response(html.replace('</body>', script), { headers: { 'Content-Type': 'text/html' } });
}

const server = Bun.serve({
  port: PORT,
  routes: {
    '/': () => withLiveReload(generateLandingPage()),
${routeEntries}
  },

  async fetch(req, server) {
    const path = new URL(req.url).pathname;

    if (path === '/__reload') {
      if (server.upgrade(req)) return undefined;
      return new Response('WebSocket upgrade failed', { status: 400 });
    }

    const file = Bun.file(join(DEMOS_DIR, path));
    if (await file.exists()) return new Response(file);

    return new Response('Not Found', { status: 404 });
  },

  websocket: {
    open(ws) { clients.add(ws); },
    close(ws) { clients.delete(ws); },
    message() {},
  },

  development: { hmr: true, console: true },
});

startWatcher();

console.log(\`
\\x1b[32m  GameFoo Demo Server\\x1b[0m
\\x1b[90m  ─────────────────────────────\\x1b[0m
  \\x1b[36mLocal:\\x1b[0m    http://localhost:\${PORT}
  \\x1b[90mDemos:\\x1b[0m    \${demoMeta.length} found

  \\x1b[33mTo add demos:\\x1b[0m Create folder with index.html, restart server.
\`);
`;

  await Bun.write(join(DEMOS_DIR, 'server.ts'), code);
}

// Main
async function main() {
  console.log('Discovering demos...');
  const demos = await discoverDemos();
  console.log(`Found ${demos.length} demos`);

  console.log('Generating server.ts...');
  await generateServer(demos);
  console.log('Done! Now run: bun web_demos/server.ts');
}

main();
