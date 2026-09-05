import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { createApiApp } from './server/app';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(root, 'public');

const apiPlugin: Plugin = {
  name: 'gamefoo-tools-api',
  configureServer(server) {
    server.middlewares.use(createApiApp({ publicDir }));
  },
  configurePreviewServer(server) {
    server.middlewares.use(createApiApp({ publicDir }));
  },
};

export default defineConfig({
  plugins: [react(), apiPlugin],
  publicDir: false,
  resolve: {
    alias: { '@': path.resolve(root, 'src') },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
