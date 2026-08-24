# Migration from Bun to pnpm — Complete

This document describes the complete migration from Bun to pnpm and standard Node.js tooling.

## What Changed

### Package Manager

- **Before:** Bun (`bun install`, `bun add`, `bunx`)
- **After:** pnpm (`pnpm install`, `pnpm add`, `pnpm exec`)

### Test Runner

- **Before:** Bun test (`bun test`, `import { test } from 'bun:test'`)
- **After:** Vitest (`pnpm test`, `import { test } from 'vitest'`)

### TypeScript Execution

- **Before:** Bun native TS support (`bun script.ts`)
- **After:** tsx via pnpm (`pnpm tsx script.ts`)

### Development Server

- **Before:** Bun.serve with HTML imports
- **After:** Vite dev server

### Build System

- **Before:** TypeScript compiler only
- **After:** TypeScript compiler + Vite for demos

---

## Files Changed

### Configuration Files

#### ✅ `package.json`

**Scripts updated:**
- `dev`: Uses Vite instead of Bun.serve
- `test`: Uses vitest instead of `bun test`
- `lint:codestyle`: Uses `pnpm tsx` instead of `bun`
- All `bun run` → `pnpm run`
- All `bunx` → `pnpm`

**Dependencies:**
- ❌ Removed: `@types/bun`
- ✅ Added: `@types/node`, `vite`, `vitest`, `@vitest/ui`, `express`, `@types/express`

#### ✅ `vitest.config.ts` (NEW)

Configuration for Vitest test runner with coverage support.

#### ✅ `web_demos/vite.config.ts` (NEW)

Vite configuration for multi-page demo application.

#### ✅ `web_demos/index.html` (NEW)

Landing page for demos (replaces dynamic generation).

#### ✅ `CLAUDE.md`

Complete rewrite to focus on pnpm and standard Node.js tooling.

### Test Files (11 files)

All test files updated:
- `import { test } from 'bun:test'` → `import { test } from 'vitest'`

Files:
- `tests/camera.test.ts`
- `tests/engine.test.ts`
- `tests/entity.test.ts`
- `tests/exports.test.ts`
- `tests/game-object-register.test.ts`
- `tests/grid.test.ts`
- `tests/isometric-projection.test.ts`
- `tests/pathfinder.test.ts`
- `tests/perlin-noise.test.ts`
- `tests/state-machine.test.ts`

### Scripts

#### ✅ `scripts/check-codestyle.ts`

- Shebang: `#!/usr/bin/env bun` → `#!/usr/bin/env tsx`
- Usage docs updated

### GitHub Actions

#### ✅ `.github/workflows/codestyle.yml`

- Replaced `oven-sh/setup-bun@v2` with `actions/setup-node@v4` + `pnpm/action-setup@v4`
- Updated all commands: `bun install` → `pnpm install`, etc.

#### ✅ `.github/workflows/docs.yml`

- Same as codestyle.yml: Node.js + pnpm setup

### Documentation

All documentation files updated to replace Bun references with pnpm:

- ✅ `README.md`
- ✅ `STYLE.md`
- ✅ `CODESTYLE_SETUP.md`
- ✅ `CODESTYLE_MIGRATION.md`
- ✅ `CODESTYLE_QUICKREF.md`
- ✅ `CODESTYLE_INDEX.md`

### Removed Files

- ❌ `bun.lock` (root)
- ❌ `tools/bun.lock`
- ❌ `publish-test/.tmp/source/bun.lock`
- ❌ `publish-test/.tmp/compiled/bun.lock`

---

## Migration Steps to Complete

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 2. Install dependencies

```bash
cd /path/to/gamefoo
pnpm install
```

This will:
- Read `package.json`
- Install all dependencies
- Create `pnpm-lock.yaml`

### 3. Verify setup

```bash
# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# CodeStyle compliance
pnpm run lint:codestyle

# Run tests
pnpm test

# Build
pnpm run build
```

### 4. Run dev server

```bash
pnpm run dev
```

Open http://localhost:3000 to see the demos.

### 5. Terminal demos

Terminal demos now use tsx:

```bash
pnpm tsx terminal_demos/basic/index.ts
```

---

## Differences from Bun

### What You Lose

1. **Native TypeScript execution** — Need tsx wrapper
2. **Bun.serve native server** — Using Vite/Express instead
3. **HTML imports** — Vite uses standard module imports
4. **Built-in SQLite/Redis** — Use standard packages (`better-sqlite3`, `ioredis`)
5. **Faster install times** — pnpm is fast, but not as fast as Bun

### What You Gain

1. **Ecosystem compatibility** — Wider Node.js package support
2. **Mature tooling** — Vite and Vitest are battle-tested
3. **Better IDE support** — More tools support Node.js workflows
4. **Industry standard** — pnpm + Node.js is widely used
5. **CI/CD compatibility** — Better GitHub Actions support

---

## Commands Reference

| Task | Before (Bun) | After (pnpm) |
|------|--------------|--------------|
| **Install deps** | `bun install` | `pnpm install` |
| **Add package** | `bun add pkg` | `pnpm add pkg` |
| **Add dev dep** | `bun add -D pkg` | `pnpm add -D pkg` |
| **Run script** | `bun run dev` | `pnpm run dev` |
| **Execute one-off** | `bunx tsc` | `pnpm tsc` |
| **Run TS file** | `bun script.ts` | `pnpm tsx script.ts` |
| **Run tests** | `bun test` | `pnpm test` |
| **Test watch** | `bun test --watch` | `pnpm test:watch` |

---

## Troubleshooting

### Issue: "tsx: command not found"

**Solution:** Make sure dependencies are installed:
```bash
pnpm install
```

tsx is in devDependencies and will be available via `pnpm tsx`.

### Issue: Tests failing with "Cannot find module 'vitest'"

**Solution:** Vitest is a dev dependency, ensure it's installed:
```bash
pnpm install
```

### Issue: Vite dev server not starting

**Solution:** Check that `web_demos/vite.config.ts` exists and is valid:
```bash
pnpm vite web_demos --config web_demos/vite.config.ts
```

### Issue: Type errors in tests

**Solution:** Make sure `@vitest/ui` is installed for type definitions:
```bash
pnpm add -D @vitest/ui
```

### Issue: "Module not found" when importing from `@/`

**Solution:** The `@/` alias points to `src/`. Make sure `tsconfig.json` has path mapping configured.

---

## Verification Checklist

After migration, verify everything works:

- [ ] `pnpm install` completes without errors
- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run lint` passes
- [ ] `pnpm run lint:codestyle` runs (may have violations, that's OK)
- [ ] `pnpm test` passes all tests
- [ ] `pnpm run build` creates `dist/` folder
- [ ] `pnpm run dev` starts Vite server on port 3000
- [ ] Opening http://localhost:3000 shows demo landing page
- [ ] Clicking a demo loads it correctly
- [ ] `pnpm tsx terminal_demos/basic/index.ts` runs (if applicable)
- [ ] `pnpm run docs:generate` works
- [ ] GitHub Actions pass (push a commit to test)

---

## Rollback (if needed)

If you need to rollback to Bun for any reason:

1. Restore `bun.lock` from git history:
   ```bash
   git checkout HEAD~1 -- bun.lock
   ```

2. Restore original files:
   ```bash
   git checkout HEAD~1 -- package.json CLAUDE.md tests/ scripts/ .github/
   ```

3. Remove pnpm artifacts:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   ```

4. Reinstall with Bun:
   ```bash
   bun install
   ```

---

## Next Steps

1. ✅ **Migration complete** — All Bun references removed
2. ⏭️ **Install pnpm** — `npm install -g pnpm` or use install script
3. ⏭️ **Run `pnpm install`** — Generate `pnpm-lock.yaml`
4. ⏭️ **Test everything** — Use verification checklist above
5. ⏭️ **Commit changes** — `git add . && git commit -m "chore: migrate from Bun to pnpm"`
6. ⏭️ **Update CI/CD secrets** — If any workflows use Bun-specific env vars
7. ⏭️ **Update team docs** — Notify team of new commands

---

## Summary

✅ **All Bun dependencies removed**
✅ **pnpm configured as package manager**
✅ **Vitest configured for testing**
✅ **Vite configured for dev server**
✅ **tsx configured for TypeScript execution**
✅ **All documentation updated**
✅ **All scripts updated**
✅ **All tests updated**
✅ **GitHub Actions updated**

**Status:** Ready for `pnpm install` and testing.

---

Generated: 2026-07-20
