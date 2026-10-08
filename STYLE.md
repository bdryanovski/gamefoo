# GameFoo Style Guide

> Inspired by
> [TigerBeetle's TigerStyle](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)

## Design Goals

1. **SAFETY** — Correctness above all else
2. **PERFORMANCE** — Work with the grain (CPU, memory, renderer)
3. **DEVELOPER EXPERIENCE** — Code that's a joy to read and maintain

These goals are ordered by priority. All three matter. Good style advances these goals.

## Core Principles

### Safety First

> "The rules act like the seat-belt in your car: initially they are perhaps a little uncomfortable,
> but after a while their use becomes second-nature and not using them becomes unimaginable."  
> — Gerard J. Holzmann

#### Explicit Control Flow

- Use simple, explicit control flow
- No recursion in hot paths — stack depth is bounded
- Split compound conditions into nested `if/else` for clarity
- State invariants **positively** (prefer `if (index < length)` over `if (index >= length)`)
- **Always brace bodies** — the body of every `if`/`else`/`for`/`while` goes in a block `{ … }` on
  its own lines. Single-line forms like `if (x) return;` are banned and enforced by the
  `no-single-line-if` codestyle rule.

```typescript
// ✅ Good: Clear, explicit
if (index < array.length) {
  // The invariant holds
} else {
  // The invariant doesn't hold — handle it
}

// ❌ Avoid: Negated, harder to reason about
if (index >= array.length) {
  // Not true that invariant holds
}
```

#### Assert Everything

**Assertions detect programmer errors.** Unlike operating errors (which must be handled), assertion
failures are unexpected. The only correct way to handle corrupt code is to crash early.

- Assert all function arguments, return values, preconditions, postconditions, invariants
- Assert compile-time relationships between constants
- Split compound assertions: `assert(a); assert(b);` over `assert(a && b);`
- Assert implications with a braced `if`: `if (a) { assert(b); }`

```typescript
// ✅ Good: Multiple specific assertions
function update(entity: Entity, deltaTime: number): void {
  assert(entity !== null);
  assert(deltaTime > 0);
  assert(deltaTime < 1); // Sanity check: no frame should take >1 second

  // ... implementation

  assert(entity.x >= 0); // Postcondition: stayed in bounds
  assert(entity.y >= 0);
}

// ❌ Avoid: Compound assertion, less information on failure
function update(entity: Entity, deltaTime: number): void {
  assert(entity !== null && deltaTime > 0 && deltaTime < 1);
}
```

**The golden rule:** Assert the **positive space** (what you expect) AND the **negative space**
(what you don't expect). Where data crosses the boundary between valid and invalid is where bugs
hide.

#### Bounds Everywhere

**Put a limit on everything.** All loops, queues, arrays, and buffers must have fixed upper bounds.

```typescript
// ✅ Good: Explicit limit
const MAX_PARTICLES = 1000;
const particles: Particle[] = [];

function addParticle(p: Particle): void {
  assert(particles.length < MAX_PARTICLES);
  particles.push(p);
}

// ❌ Avoid: Unbounded growth
const particles: Particle[] = [];
function addParticle(p: Particle): void {
  particles.push(p); // Could grow forever
}
```

#### Minimize Scope

- Declare variables at the **smallest possible scope**
- Calculate values **close to where they're used**
- Don't introduce variables before they're needed
- Don't keep them around after they're done

```typescript
// ✅ Good: Tight scope
function processEntities(entities: Entity[]): void {
  for (const entity of entities) {
    if (entity.active) {
      const distance = calculateDistance(entity, player);
      if (distance < MAX_INTERACTION_DISTANCE) {
        // Use distance here
      }
    }
  }
}

// ❌ Avoid: Variables live too long
function processEntities(entities: Entity[]): void {
  let distance = 0; // Declared too early
  for (const entity of entities) {
    if (entity.active) {
      distance = calculateDistance(entity, player); // POCPOU risk
      if (distance < MAX_INTERACTION_DISTANCE) {
        // distance might be stale from previous iteration
      }
    }
  }
}
```

### Performance

> "The lack of back-of-the-envelope performance sketches is the root of all evil."  
> — Rivacindela Hudsoni

#### Think Early

The best time to solve performance is **during design**, not after profiling. The design phase is
where you get 1000x wins.

#### Optimize Resources in Order

1. **Network** (slowest)
2. **Disk**
3. **Memory** (cache misses are expensive)
4. **CPU** (fastest, but can be used many times)

#### Batching

Amortize costs by batching accesses:

```typescript
// ✅ Good: Batch updates
const updates: EntityUpdate[] = [];
function queueUpdate(entity: Entity, data: UpdateData): void {
  updates.push({ entity, data });
}
function flushUpdates(): void {
  // Process all at once
  for (const { entity, data } of updates) {
    entity.applyUpdate(data);
  }
  updates.length = 0; // Clear without reallocation
}

// ❌ Avoid: Update immediately, no batching
function applyUpdate(entity: Entity, data: UpdateData): void {
  entity.applyUpdate(data); // Immediate, can't amortize
}
```

#### Be Explicit

Don't rely on the compiler to do the right thing. Be explicit:

```typescript
// ✅ Good: Explicit intent
const distance_squared = dx * dx + dy * dy; // Avoid Math.sqrt
if (distance_squared < radius * radius) {
  /* ... */
}

// ✅ Good: Show division intent
const tile_x = Math.floor(x / TILE_SIZE);
const chunks_count = Math.ceil(total / CHUNK_SIZE);

// ❌ Avoid: Implicit behavior
const distance = Math.sqrt(dx * dx + dy * dy); // Unnecessary sqrt
if (distance < radius) {
  /* ... */
}
```

### Developer Experience

> "There are only two hard things in Computer Science: cache invalidation, naming things, and
> off-by-one errors."  
> — Phil Karlton

#### Naming

**Get the nouns and verbs just right.** Names are the essence of code.

- Use `snake_case` for variables and functions, `PascalCase` for classes/types
- Never abbreviate — favour explicit, longer names. Prefer `AnimationDefinition` over
  `AnimationDef`, `SpriteRegionDefinition` over `SpriteRegionDef`. Humans read code far more often
  than they write it, so optimise for reading.
- Name loop variables after what they iterate: `for (const entity of entities)`, or
  `for (let index = 0; index < count; index += 1)`. Never a bare `i`/`j`/`k`.
- Add units to variable names, **units go last**: `latency_ms_max` not `max_latency_ms`
- Related names should have the same length to align in code
- Proper capitalization for acronyms: `VSRState`, not `VsrState`

```typescript
// ✅ Good: Clear, aligned, units explicit
const player_health_max = 100;
const player_health_min = 0;
const player_speed_px_per_sec = 120;
const enemy_speed_px_per_sec = 80;

// ❌ Avoid: Inconsistent, unclear
const maxHP = 100;
const minHealth = 0;
const playerSpeed = 120; // Units unclear
const enemySpd = 80; // Abbreviated
```

#### Infuse Names with Meaning

```typescript
// ✅ Good: Name tells you about lifecycle
const gpa: Allocator = createAllocator(); // General Purpose — needs deinit
const arena: Allocator = createArena(); // Arena — cleared in bulk

// ❌ Avoid: Generic
const allocator1: Allocator = createAllocator();
const allocator2: Allocator = createArena();
```

#### Callbacks Go Last

When a function takes a callback, put it **last** in the parameter list. This mirrors control flow —
callbacks are invoked last.

```typescript
// ✅ Good: Callback last
function query(world: World, filter: Filter, callback: (e: Entity) => void): void;

// ❌ Avoid: Callback not last
function query(callback: (e: Entity) => void, world: World, filter: Filter): void;
```

#### Comments

- Comments are **sentences** with capital letter and full stop
- Space after `//`
- Explain **why**, not what
- Show your workings
- Doc comments (`/** … */`) on declarations are **block comments**: put `/**` on its own line, one
  `*`-prefixed line per sentence, and a blank ` *` line between the description and any tags. Never
  cram a declaration's doc comment onto a single line.
- Add an `@since <version>` tag **only when introducing something new** — a new type, interface,
  class, function, property, or argument, or a meaningful extension of behaviour. It records when
  the API first appeared; don't add it to unchanged code.

```typescript
// ✅ Good: Explains rationale
// We use squared distance to avoid expensive Math.sqrt in the hot path.
// Benchmark: 2.3ms → 0.8ms for 1000 entities.
const distance_squared = dx * dx + dy * dy;

// ❌ Avoid: States the obvious
// Calculate distance squared
const distance_squared = dx * dx + dy * dy;
```

#### Cache Invalidation

- Don't duplicate variables or alias them (state gets out of sync)
- Pass large structs as `const` references (catch accidental copies)
- Use simpler return types: `void` > `boolean` > `number` > `number | null` > `number | Error`

#### Off-By-One Errors

The usual suspects: **index**, **count**, **size**.

- **index** → **count**: add 1 (indexes are 0-based, counts are 1-based)
- **count** → **size**: multiply by unit size

Show intent with division:

```typescript
// ✅ Good: Intent is clear
const tile_count_exact = width / TILE_SIZE; // Exact division expected
assert(Number.isInteger(tile_count_exact));

const tile_count_floor = Math.floor(width / TILE_SIZE);
const tile_count_ceil = Math.ceil(width / TILE_SIZE);

// ❌ Avoid: Unclear rounding behavior
const tile_count = width / TILE_SIZE; // Did we mean to truncate?
```

## Style by the Numbers

### Line Length

**Hard limit: 100 columns.** No exceptions. Nothing hidden by horizontal scrollbar.

This is a physical constraint: fit two files side-by-side on screen.

### Function Length

**Hard limit: 70 lines per function.**

There's a sharp discontinuity between fitting on screen and scrolling. 70 lines forces good function
shape:

- **Centralize control flow** — keep `if`/`switch` in parent, move logic to helpers
- **Centralize state** — parent owns state, helpers compute what to change
- **Keep leaf functions pure** — no side effects in helpers

```typescript
// ✅ Good: Parent controls flow, helpers are pure
function updateEntity(entity: Entity, dt: number): void {
  if (entity.type === 'player') {
    const new_position = calculatePlayerPosition(entity, dt);
    entity.position = new_position;
  } else if (entity.type === 'enemy') {
    const new_position = calculateEnemyPosition(entity, dt);
    entity.position = new_position;
  }
}

function calculatePlayerPosition(entity: Entity, dt: number): Position {
  // Pure calculation, no state mutation
  return { x: entity.x + entity.velocity_x * dt, y: entity.y + entity.velocity_y * dt };
}

// ❌ Avoid: Helpers mutate state directly
function updateEntity(entity: Entity, dt: number): void {
  if (entity.type === 'player') {
    updatePlayerPosition(entity, dt); // Mutates inside
  }
}
```

### Indentation

- Use **2 spaces** (GameFoo convention; CodeStyle uses 4)
- Run `biome format` — let the formatter handle it

### Block Statements

Add braces to `if` statements unless it fits on a single line. Defense in depth against goto-fail
bugs.

```typescript
// ✅ Good: Single line, no braces needed
if (entity.dead) return;

// ✅ Good: Multi-line, always braces
if (entity.health < LOW_HEALTH_THRESHOLD) {
  entity.state = 'warning';
}

// ❌ Avoid: Multi-line without braces
if (entity.health < LOW_HEALTH_THRESHOLD) entity.state = 'warning';
```

## Dependencies & Tooling

**Zero dependencies policy** (except language toolchain). Dependencies lead to:

- Supply chain attacks
- Safety and performance risk
- Slow install times
- Complexity creep

**Standardize tooling.** Use pnpm and standard Node.js tools:

- `vitest` for testing
- `vite` for building and dev server
- `pnpm` for package management

A small, standardized toolbox > specialized instruments with dedicated manuals.

## Technical Debt

**Zero technical debt policy.** We do it right the first time.

> "You shall not pass!" — Gandalf

Code is like steel: cheaper to change while it's hot. Fix showstoppers during design or
implementation, not in production.

## The Golden Rule

**Always motivate. Always say why.**

If you explain the rationale for a decision, it:

- Increases understanding
- Makes adherence more likely
- Shares criteria for evaluation
- Enables others to improve the decision

---

## Summary

| Principle                | Rule                                                 |
| ------------------------ | ---------------------------------------------------- |
| **Safety**               | Assert everything. Explicit control flow. Bound all. |
| **Performance**          | Design for speed. Batch. Work with the grain.        |
| **Developer Experience** | Names matter. Tight scope. Say why.                  |
| **Line length**          | Max 100 columns. No exceptions.                      |
| **Function length**      | Max 70 lines. Centralize control flow.               |
| **Indentation**          | 2 spaces. Use `biome format`.                        |
| **Dependencies**         | Zero. Use pnpm.                                      |
| **Technical Debt**       | Zero. Fix it now or don't ship it.                   |

---

Remember: Good code is not just about what it does, but how it does it. CodeStyle principles make
code **safe**, **fast**, and **maintainable**.

> "Simplicity and elegance are unpopular because they require hard work and discipline to
> achieve."  
> — Edsger Dijkstra

Now go make great games. 🎮
