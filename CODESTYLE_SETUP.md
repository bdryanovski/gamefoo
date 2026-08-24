# CodeStyle Setup for GameFoo

This document explains the CodeStyle-inspired tooling and configuration that has been added to GameFoo.

## Overview

CodeStyle is a coding philosophy from TigerBeetle that prioritizes:

1. **SAFETY** — Correctness above all else
2. **PERFORMANCE** — Work with the grain (CPU, memory, renderer)
3. **DEVELOPER EXPERIENCE** — Code that's a joy to read and maintain

These design goals are enforced through linter rules, custom tooling, and code review practices.

## What's Been Added

### 1. Enhanced Biome Configuration

**File:** `biome.jsonc`

The Biome linter has been configured with CodeStyle principles:

- **Correctness:** Unused variables → errors, strict parameter checks
- **Style:** Explicit over implicit, consistent naming, block statements
- **Complexity:** Max cyclomatic complexity (15), no nested ternaries
- **Performance:** Avoid slow patterns (accumulating spreads, delete operator)

**Run:**
```bash
pnpm run lint          # Check for issues
pnpm run lint:fix      # Auto-fix where possible
pnpm run format        # Format code
```

### 2. ESLint Configuration (Optional)

**File:** `.eslintrc.json`

Additional rules that Biome doesn't cover:

- Explicit function return types
- Naming conventions enforcing snake_case
- Function length limits (70 lines)
- Parameter limits (5 max)
- Cyclomatic complexity tracking

**To enable:**
```bash
# Install dependencies (when ready)
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Run ESLint
pnpm eslint src/
```

### 3. CodeStyle Checker Script

**File:** `scripts/check-codestyle.ts`

Custom tool that enforces principles linters can't catch:

- **Line length:** Max 100 columns (hard limit)
- **Function length:** Max 70 lines (excluding blanks/comments)
- **Assertion density:** Min 2 assertions per function

**Run:**
```bash
pnpm run lint:codestyle           # Check all of src/
pnpm tsx scripts/check-codestyle.ts   # Same
pnpm tsx scripts/check-codestyle.ts src/core/engine.ts  # Check single file
```

**Output example:**
```
🐯 CodeStyle Compliance Checker

Checking: src

Found 95 TypeScript files

❌ ERRORS:

  src/core/engine.ts:150
    max-function-length: Function 'update' is 85 lines (max 70)

  src/entities/entity.ts:42:105
    max-line-length: Line exceeds 100 columns (112 columns)

⚠️  WARNINGS:

  src/core/world.ts:28
    min-assertions: Function 'register' has only 1 assertion(s) (min 2)

────────────────────────────────────────────────────────────────────────────────

2 error(s), 1 warning(s) found.

💡 CodeStyle principles violated. See STYLE.md for guidance.
```

### 4. Style Guide

**File:** `STYLE.md`

Comprehensive guide covering:

- Safety principles (assertions, bounds, explicit control flow)
- Performance principles (batching, CPU optimization, working with the grain)
- Developer experience (naming, comments, scope management)
- Style by the numbers (line/function length, indentation, complexity)

**Read it.** Internalize it. Reference it in code reviews.

### 5. Code Review Checklist

**File:** `.github/CODESTYLE_CHECKLIST.md`

Actionable checklist for PR reviews covering:

- Safety (control flow, assertions, bounds, memory)
- Performance (design, batching, CPU optimization)
- Developer experience (naming, comments, structure)
- Style by the numbers (line/function length, complexity)
- Code quality (error handling, testing, documentation)

Use this checklist for every PR review.

## Integration with Existing Workflow

### Updated Scripts

Your `package.json` has been updated:

```json
{
  "scripts": {
    "lint": "pnpm biome check src/",
    "lint:fix": "pnpm biome check --write --unsafe src/",
    "lint:codestyle": "pnpm tsx scripts/check-codestyle.ts",
    "check": "pnpm run typecheck && pnpm run lint && pnpm run lint:codestyle",
  }
}
```

The `check` script now runs:
1. TypeScript type checking
2. Biome linting
3. CodeStyle compliance checking

### Pre-commit Hooks

Your existing `lint-staged` configuration in `package.json` will run Biome on staged files:

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "biome check --write --no-errors-on-unmatched",
      "biome check --no-errors-on-unmatched"
    ]
  }
}
```

**Optional:** Add CodeStyle checks to pre-commit:

```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "biome check --write --no-errors-on-unmatched",
      "biome check --no-errors-on-unmatched",
      "pnpm tsx scripts/check-codestyle.ts"
    ]
  }
}
```

### CI/CD

Add CodeStyle checks to your CI pipeline (e.g., GitHub Actions):

```yaml
# .github/workflows/ci.yml
- name: Check code style
  run: |
    pnpm run typecheck
    pnpm run lint
    pnpm run lint:codestyle
```

## Philosophy in Practice

### Example: Before and After

**Before (not CodeStyle):**

```typescript
function update(entities, dt) {
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    if (e.active && e.health > 0 && !e.dead) {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
    }
  }
}
```

**After (CodeStyle):**

```typescript
const MAX_ENTITIES = 1000;

function update_entities(entities: Entity[], delta_time_sec: number): void {
  // Assert preconditions.
  assert(entities.length <= MAX_ENTITIES);
  assert(delta_time_sec > 0);
  assert(delta_time_sec < 1); // Sanity: no frame should take >1 second.

  for (const entity of entities) {
    // Split compound condition for clarity.
    if (entity.active) {
      if (entity.health > 0) {
        if (!entity.dead) {
          // Update position.
          entity.x += entity.velocity_x * delta_time_sec;
          entity.y += entity.velocity_y * delta_time_sec;

          // Assert postconditions.
          assert(Number.isFinite(entity.x));
          assert(Number.isFinite(entity.y));
        }
      }
    }
  }
}
```

### Key Improvements

1. **Named constants:** `MAX_ENTITIES` documents upper bound
2. **Type annotations:** Explicit types for safety
3. **snake_case naming:** `delta_time_sec` with units
4. **Assertions:** Pre/postconditions checked
5. **Split conditions:** Nested `if` blocks for clarity
6. **Comments:** Explain intent ("Sanity: ...")

## Adoption Strategy

### Phase 1: New Code (Immediate)

- All new code follows CodeStyle from day one
- Use `STYLE.md` and checklist for guidance
- Run `pnpm run check` before committing

### Phase 2: Hot Paths (First Month)

- Apply CodeStyle to performance-critical code:
  - Entity update loops
  - Rendering pipeline
  - Collision detection
  - Input handling

### Phase 3: Full Codebase (Over Time)

- Gradually refactor existing code file by file
- Fix violations as you touch code for other reasons
- Don't do a "big bang" rewrite — incremental wins

### Exceptions

CodeStyle is strict, but pragmatic exceptions are allowed:

- **Test files:** Can exceed function length, use `any` more liberally
- **Type definitions:** `.d.ts` files can have empty interfaces
- **Generated code:** Exclude from CodeStyle checks
- **Third-party demos:** `web_demos/` and `terminal_demos/` can be lenient

Configure exceptions in `biome.jsonc` overrides section.

## Resources

### Primary Documentation

- [STYLE.md](./STYLE.md) — GameFoo style guide (CodeStyle applied)
- [.github/CODESTYLE_CHECKLIST.md](./.github/CODESTYLE_CHECKLIST.md) — Code review checklist
- [biome.jsonc](./biome.jsonc) — Linter configuration

### External References

- [CodeStyle](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md) — Original guide from TigerBeetle
- [NASA Power of Ten](https://spinroot.com/gerard/pdf/P10.pdf) — Safety-critical coding rules
- [Let Over Lambda](https://letoverlambda.com/index.cl/guest/chap1.html) — On style and understanding

## FAQ

### Q: Why 100 columns instead of 80?

**A:** 100 is the sweet spot for modern displays. It allows two files side-by-side on a typical screen. The key is consistency — pick a limit and enforce it everywhere.

### Q: Why 70 lines per function?

**A:** There's a sharp discontinuity between code fitting on screen and having to scroll. 70 lines fits comfortably with typical terminal/editor chrome. Forces good function shape.

### Q: Why snake_case instead of camelCase?

**A:** CodeStyle uses snake_case because underscores are the closest thing to spaces, making names more readable. Also encourages descriptive names with units (`latency_ms_max`).

**However:** GameFoo uses camelCase in many places already. You can choose:

1. **Strict CodeStyle:** Migrate to snake_case over time
2. **Pragmatic:** Use camelCase but keep CodeStyle principles (assertions, bounds, etc.)
3. **Hybrid:** snake_case for new code, camelCase for existing (gradually converge)

The linter is configured for snake_case, but you can adjust this in `.eslintrc.json` if you prefer camelCase.

### Q: Why minimum 2 assertions per function?

**A:** NASA's Power of Ten rule: "The assertion density of the code must average a minimum of two assertions per function." Assertions catch bugs during development and document invariants.

Exceptions: Trivial getters/setters don't need 2 assertions.

### Q: Won't all these assertions slow down the code?

**A:** Modern JavaScript engines optimize assertions away in production builds. Use environment checks:

```typescript
const DEBUG = process.env.NODE_ENV !== 'production';

function assert(condition: boolean, message?: string): void {
  if (DEBUG && !condition) {
    throw new Error(message || 'Assertion failed');
  }
}
```

Or use TypeScript's type system to enforce at compile-time (zero runtime cost).

### Q: This seems very strict. Do I have to follow everything?

**A:** CodeStyle is opinionated by design. The strictness creates consistency and catches bugs.

That said, use judgment:

- **Core engine code:** Follow CodeStyle strictly (safety, performance critical)
- **Demos/tools:** Can be more lenient
- **Tests:** Can exceed function length, use `any` where helpful

Start with the "Quick Wins" from the checklist, then gradually adopt more.

## Getting Started

1. **Read `STYLE.md`** — Understand the philosophy
2. **Run `pnpm run check`** — See current state
3. **Fix one file** — Pick a small file, make it CodeStyle compliant
4. **Write new code** — Follow CodeStyle from the start
5. **Review PRs** — Use `.github/CODESTYLE_CHECKLIST.md`

---

## Summary

CodeStyle transforms your codebase into something that is:

- **Safe** — Catches bugs before they ship
- **Fast** — Optimized from the design phase
- **Maintainable** — A joy to read and modify

It's strict, but the strictness pays dividends in production.

Welcome to CodeStyle. 🐯

> "Simplicity and elegance are unpopular because they require hard work and discipline to achieve."  
> — Edsger Dijkstra
