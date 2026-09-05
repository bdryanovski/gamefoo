import express from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApiApp } from './server/app';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, 'public');
const distDir = path.resolve(__dirname, 'dist');

const app = createApiApp({ publicDir });
app.use(express.static(distDir));
app.use((_req, res) => {
  const index = path.join(distDir, 'index.html');
  if (existsSync(index)) {
    res.sendFile(index);
    return;
  }
  res.status(404).send('Not Found — run `pnpm build` to produce the frontend, or use `pnpm dev`.');
});

const port = Number(process.env.PORT) || 3001;
const server = app.listen(port, () => {
  console.log(`🔧 GameFoo Dev Tools — UI + API at http://localhost:${port}`);
  console.log('🔧 Development with HMR: pnpm dev → http://localhost:5173');
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`✖ Port ${port} is already in use — stop the other process, or run PORT=<port> pnpm start`);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
