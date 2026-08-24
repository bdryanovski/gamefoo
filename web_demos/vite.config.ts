import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';

// Discover all demo directories with index.html
const demosDir = resolve(__dirname);
const demoFolders = readdirSync(demosDir).filter((name) => {
  const path = resolve(demosDir, name);
  return (
    statSync(path).isDirectory() &&
    existsSync(resolve(path, 'index.html'))
  );
});

// Build input object for multi-page app
const input: Record<string, string> = {
  main: resolve(__dirname, 'index.html'),
};

for (const folder of demoFolders) {
  input[folder] = resolve(demosDir, folder, 'index.html');
}

export default defineConfig({
  root: demosDir,
  server: {
    port: 3000,
    open: true,
    fs: {
      // Allow serving files from parent directory (src/)
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: resolve(__dirname, '../dist-demos'),
    emptyOutDir: true,
    rollupOptions: {
      input,
    },
  },
});
