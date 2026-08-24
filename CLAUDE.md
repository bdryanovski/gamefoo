---
description: Use pnpm and standard Node.js tooling for this project.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

Default to using pnpm as the package manager and standard Node.js tooling.

## Package Management

- Use `pnpm install` instead of `npm install`, `yarn install`, or `bun install`
- Use `pnpm add <package>` to add dependencies
- Use `pnpm add -D <package>` to add dev dependencies
- Use `pnpm run <script>` to run scripts
- Use `pnpm <package>` instead of `npx <package>` for one-off commands

## Running TypeScript

- Use `pnpm tsx <file>` to execute TypeScript files directly (replaces `ts-node` and `bun`)
- Use `pnpm tsc` for type checking and building

## Testing

Use `vitest` for testing.

```ts
import { describe, it, expect } from 'vitest';

describe('my test suite', () => {
  it('should pass', () => {
    expect(1).toBe(1);
  });
});
```

Run tests:
```sh
pnpm test        # Run once
pnpm test:watch  # Watch mode
```

## Development Server

For web demos, use Vite:

```sh
pnpm vite web_demos --config web_demos/vite.config.ts
```

For custom servers, use Express:

```ts
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Building

- Use `pnpm tsc` for TypeScript compilation
- Use `vite build` for bundling web applications
- Use `typedoc` for documentation generation

## Environment Variables

Use `dotenv` for loading environment variables:

```ts
import 'dotenv/config';

const port = process.env.PORT || 3000;
```

## APIs

- Use `node:fs` for file system operations
- Use `express` for HTTP servers
- Use `ws` for WebSocket servers
- Use `better-sqlite3` for SQLite
- Use `ioredis` for Redis
- Use `pg` for PostgreSQL

## Best Practices

- Always use TypeScript for type safety
- Use `tsx` for running TypeScript files in development
- Use `vitest` for fast, modern testing
- Use `vite` for fast development and building
- Use `pnpm` for efficient package management
