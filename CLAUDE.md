---
description: Use pnpm and standard Node.js tooling for this project.
globs: '*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json'
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
- Use `ws` for WebSocket servers
- Use `better-sqlite3` for SQLite

## Best Practices

- Always use TypeScript for type safety
- Use `tsx` for running TypeScript files in development
- Use `vitest` for fast, modern testing
- Use `vite` for fast development and building
- Use `pnpm` for efficient package management

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
