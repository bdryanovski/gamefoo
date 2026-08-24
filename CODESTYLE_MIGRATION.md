# CodeStyle Migration Guide

How to gradually adopt CodeStyle in an existing codebase without a "big bang" rewrite.

## Philosophy

> "Rome wasn't built in a day, and neither is a CodeStyle codebase."

The goal is **incremental adoption** that:

- Doesn't block current work
- Improves code quality over time
- Builds momentum through small wins
- Reaches 100% compliance eventually

## Three-Phase Approach

### Phase 1: New Code (Week 1)

**Goal:** All new code follows CodeStyle from day one.

**Actions:**

1. **Read and internalize:**
   - [ ] Read [STYLE.md](./STYLE.md) (30 min)
   - [ ] Review [CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md) (10 min)
   - [ ] Print quick reference, keep it visible

2. **Configure editor:**
   - [ ] Set ruler at 100 columns
   - [ ] Configure auto-format on save (Biome)
   - [ ] Enable type checking in editor

3. **Run checks:**
   ```bash
   pnpm run check  # Before every commit
   ```

4. **New files only:**
   - All new `.ts` files follow CodeStyle 100%
   - Existing files are not changed yet

**Success metric:** All PRs with new files pass `pnpm run check` without violations.

---

### Phase 2: Hot Paths (Month 1)

**Goal:** Critical performance paths follow CodeStyle for safety and speed.

**Priority areas:**

1. **Entity update loop** (`src/entities/*.ts`)
2. **Rendering pipeline** (`src/core/renderer/*.ts`)
3. **Collision detection** (`src/core/world.ts`)
4. **Input handling** (`src/core/input*.ts`)

**Actions:**

1. **Identify hot paths:**
   - Profile the engine
   - Mark top 5 performance-critical files

2. **Refactor one file at a time:**
   - Pick a file
   - Run CodeStyle checks: `pnpm tsx scripts/check-codestyle.ts src/core/engine.ts`
   - Fix violations (see "Common Fixes" below)
   - Test thoroughly
   - Commit with message: "refactor(codestyle): apply to engine.ts"

3. **Focus on safety:**
   - Add assertions to hot paths
   - Add bounds to all loops
   - Split compound conditions

**Success metric:** 5 most critical files are CodeStyle compliant.

---

### Phase 3: Full Codebase (Over Time)

**Goal:** 100% of `src/` is CodeStyle compliant.

**Strategy: Boy Scout Rule**

> "Leave the code better than you found it."

**Actions:**

1. **Opportunistic refactoring:**
   - Whenever you touch a file for a bug fix or feature, apply CodeStyle
   - Don't do pure refactoring PRs (yet)
   - Piggyback style improvements on functional changes

2. **Weekly focus file:**
   - Pick one non-critical file per week
   - Spend 30 min making it CodeStyle compliant
   - Track progress: `pnpm run lint:codestyle | tee progress.txt`

3. **Celebrate milestones:**
   - 25% compliant → team lunch
   - 50% compliant → write blog post
   - 75% compliant → stickers
   - 100% compliant → party

**Success metric:** All `src/` files pass `pnpm run check` with zero violations.

---

## Common Fixes

### 1. Line Length Violations

**Problem:**
```typescript
const result = someReallyLongFunctionName(argument1, argument2, argument3, argument4, argument5);
```

**Fix:**
```typescript
const result = someReallyLongFunctionName(
  argument1,
  argument2,
  argument3,
  argument4,
  argument5,
);
```

**Tool:** `pnpm run format` handles this automatically.

---

### 2. Function Length Violations

**Problem:**
```typescript
function update(entity: Entity, dt: number): void {
  // 100 lines of mixed concerns
}
```

**Fix:** Extract helpers.
```typescript
function update(entity: Entity, dt: number): void {
  if (entity.type === 'player') {
    updatePlayer(entity, dt);
  } else if (entity.type === 'enemy') {
    updateEnemy(entity, dt);
  }
}

function updatePlayer(entity: Entity, dt: number): void {
  // Player-specific logic
}

function updateEnemy(entity: Entity, dt: number): void {
  // Enemy-specific logic
}
```

**Principle:** Centralize control flow in parent, move logic to helpers.

---

### 3. Missing Assertions

**Problem:**
```typescript
function calculateDistance(a: Entity, b: Entity): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

**Fix:** Add preconditions and postconditions.
```typescript
function calculateDistance(a: Entity, b: Entity): number {
  // Preconditions.
  assert(a !== null);
  assert(b !== null);
  assert(Number.isFinite(a.x) && Number.isFinite(a.y));
  assert(Number.isFinite(b.x) && Number.isFinite(b.y));

  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Postcondition.
  assert(distance >= 0);
  assert(Number.isFinite(distance));

  return distance;
}
```

---

### 4. Compound Conditions

**Problem:**
```typescript
if (entity.active && entity.health > 0 && !entity.stunned) {
  // Do work
}
```

**Fix:** Split into nested `if` statements.
```typescript
if (entity.active) {
  if (entity.health > 0) {
    if (!entity.stunned) {
      // Do work
    } else {
      // Handle stunned case
    }
  } else {
    // Handle dead case
  }
} else {
  // Handle inactive case
}
```

---

### 5. Unbounded Loops

**Problem:**
```typescript
while (!done) {
  // Could loop forever
}
```

**Fix:** Add explicit upper bound.
```typescript
const MAX_ITERATIONS = 1000;
let iterations = 0;

while (!done) {
  assert(iterations < MAX_ITERATIONS);
  iterations++;
  // Do work
}
```

---

### 6. Variable Scope Too Wide

**Problem:**
```typescript
function process(entities: Entity[]): void {
  let distance = 0; // Lives too long
  
  for (const entity of entities) {
    distance = calculateDistance(entity, player);
    if (distance < 100) {
      // Use distance
    }
  }
}
```

**Fix:** Move declaration closer to use.
```typescript
function process(entities: Entity[]): void {
  for (const entity of entities) {
    const distance = calculateDistance(entity, player);
    if (distance < 100) {
      // Use distance, scope ends here
    }
  }
}
```

---

### 7. Unclear Naming

**Problem:**
```typescript
const maxHP = 100;
const spd = 120;
const dst = calculateDist(a, b);
```

**Fix:** Use descriptive names with units.
```typescript
const player_health_max = 100;
const player_speed_px_per_sec = 120;
const distance_px = calculateDistance(a, b);
```

---

### 8. Missing Comments

**Problem:**
```typescript
const distance_squared = dx * dx + dy * dy;
```

**Fix:** Explain **why**.
```typescript
// Use squared distance to avoid expensive Math.sqrt in hot path.
// Benchmark: 2.3ms → 0.8ms for 1000 entities.
const distance_squared = dx * dx + dy * dy;
```

---

## File-by-File Checklist

Use this checklist when migrating a file:

- [ ] **Run check:** `pnpm tsx scripts/check-codestyle.ts <file>`
- [ ] **Line length:** All lines ≤ 100 columns
- [ ] **Function length:** All functions ≤ 70 lines
- [ ] **Assertions:** Min 2 per function (or function is trivial)
- [ ] **Bounds:** All loops have explicit limits
- [ ] **Conditions:** Split compound conditions
- [ ] **Scope:** Variables at smallest scope
- [ ] **Naming:** Descriptive, with units, no abbreviations
- [ ] **Comments:** Explain why, not what
- [ ] **Types:** Explicit return types on all functions
- [ ] **Tests:** Still pass after refactoring
- [ ] **Commit:** `refactor(codestyle): apply to <file>`

---

## Tracking Progress

### Generate Report

```bash
# Check entire codebase
pnpm run lint:codestyle > codestyle-report.txt

# Count violations
grep "error(s)" codestyle-report.txt

# Track over time
echo "$(date): $(grep -c 'error' codestyle-report.txt)" >> progress.log
```

### Visualize Progress

Create a simple script to track compliance:

```typescript
// scripts/track-progress.ts
import { readdirSync } from 'fs';
import { execSync } from 'child_process';

const files = readdirSync('src', { recursive: true })
  .filter(f => f.endsWith('.ts'));

let compliant = 0;
for (const file of files) {
  const result = execSync(`pnpm tsx scripts/check-codestyle.ts src/${file}`, { 
    encoding: 'utf8',
    stdio: 'pipe'
  }).catch(() => null);
  
  if (result && result.includes('0 error(s)')) {
    compliant++;
  }
}

console.log(`Progress: ${compliant}/${files.length} (${(compliant / files.length * 100).toFixed(1)}%)`);
```

Run weekly:
```bash
pnpm tsx scripts/track-progress.ts
```

---

## Dealing with Resistance

### "This will take too long"

**Response:** We're not doing a big bang rewrite. New code is CodeStyle from day one. Existing code is refactored opportunistically. Worst case: 6 months to full compliance. Best case: 3 months.

### "Line length limits are arbitrary"

**Response:** 100 columns is a physical constraint — two files side-by-side on a typical screen. The specific number matters less than **consistency**. Pick a limit, enforce it everywhere.

### "70 lines per function is too short"

**Response:** If a function doesn't fit in 70 lines, it's doing too much. Splitting forces good design: centralized control flow, pure helpers, clear responsibilities.

### "Assertions slow down production"

**Response:** Modern JS engines optimize them away. Use environment checks:

```typescript
const DEBUG = process.env.NODE_ENV !== 'production';

function assert(condition: boolean): void {
  if (DEBUG && !condition) throw new Error('Assertion failed');
}
```

Or rely on TypeScript's type system (zero runtime cost).

### "Our existing code works fine"

**Response:** CodeStyle isn't about fixing broken code — it's about making good code **great**. It catches bugs before they ship, makes performance predictable, and makes maintenance a joy.

---

## Success Stories

### Before CodeStyle

```typescript
function update(ents, dt) {
  for (let i = 0; i < ents.length; i++) {
    const e = ents[i];
    if (e.act && e.hp > 0 && !e.dead) {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
    }
  }
}
```

**Problems:**
- No assertions (what if `ents` is null? what if `dt` is negative?)
- Abbreviated names (`ents`, `hp`, `vx`)
- Compound condition (hard to reason about)
- No bounds (unbounded loop)

### After CodeStyle

```typescript
const MAX_ENTITIES = 1000;

function update_entities(entities: Entity[], delta_time_sec: number): void {
  // Preconditions.
  assert(entities.length <= MAX_ENTITIES);
  assert(delta_time_sec > 0);
  assert(delta_time_sec < 1);

  for (const entity of entities) {
    if (entity.active) {
      if (entity.health > 0) {
        if (!entity.dead) {
          // Update position.
          entity.x += entity.velocity_x * delta_time_sec;
          entity.y += entity.velocity_y * delta_time_sec;

          // Postconditions.
          assert(Number.isFinite(entity.x));
          assert(Number.isFinite(entity.y));
        }
      }
    }
  }
}
```

**Improvements:**
- ✅ Assertions catch invalid inputs
- ✅ Descriptive names with units
- ✅ Split conditions for clarity
- ✅ Explicit bounds on entities

**Result:** Caught 3 bugs during migration (negative delta time, NaN position, unbounded entity growth).

---

## FAQ

### Q: Can I do CodeStyle gradually, or is it all-or-nothing?

**A:** Gradual. Start with new code, then hot paths, then opportunistic refactoring. Aim for 100% eventually, but don't block current work.

### Q: What if a file is too large to refactor all at once?

**A:** Fix violations incrementally:
1. First pass: Line length + formatting
2. Second pass: Function length (extract helpers)
3. Third pass: Assertions + bounds
4. Fourth pass: Naming + comments

### Q: Do demos and tests need to be CodeStyle compliant?

**A:** Tests can be lenient (function length, `any` usage). Demos can be lenient. Core engine code should be strict.

### Q: What if the team doesn't agree with a specific rule?

**A:** Discuss and decide as a team. CodeStyle is opinionated, but not dogmatic. If you have a good reason to deviate, document it and configure the linter accordingly.

### Q: How do I measure ROI on this effort?

**A:** Track:
- **Bugs caught by assertions** (before they reach production)
- **Time to onboard new devs** (clearer code = faster ramp-up)
- **PR review time** (consistency = faster reviews)
- **Maintenance time** (less confusion = faster fixes)

---

## Next Steps

1. [ ] Read [STYLE.md](./STYLE.md)
2. [ ] Run `pnpm run check` on current codebase
3. [ ] Pick 3 files for Phase 2 (hot paths)
4. [ ] Create a tracking spreadsheet or script
5. [ ] Celebrate first compliant file 🎉

---

**Remember:** CodeStyle is a journey, not a destination. Every line of compliant code is progress.

🐯 Happy migrating!
