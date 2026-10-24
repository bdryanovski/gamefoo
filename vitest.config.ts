import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'web_demos/', 'tools/', '**/*.config.ts', '**/*.test.ts'],
    },
  },
});
