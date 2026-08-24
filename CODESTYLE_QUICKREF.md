# CodeStyle Quick Reference Card

Print this. Tape it to your monitor. 🐯

---

## The Three Design Goals

1. **SAFETY** — Correctness above all else
2. **PERFORMANCE** — Work with the grain
3. **DEVELOPER EXPERIENCE** — Code that's a joy to read

_In that order._

---

## Hard Limits

| Metric | Limit | Rule |
|--------|-------|------|
| **Line length** | 100 columns | No exceptions. Ever. |
| **Function length** | 70 lines | Excluding blanks and comments |
| **Function params** | 5 max | Too many = doing too much |
| **Cyclomatic complexity** | 15 max | Keep it simple |
| **Nesting depth** | 4 levels | Split compound conditions |
| **Assertions per function** | 2 min | More is better |

---

## Safety Checklist

- [ ] Assert all function arguments
- [ ] Assert all preconditions and postconditions
- [ ] All loops have explicit upper bounds
- [ ] Split compound conditions into nested `if/else`
- [ ] State invariants positively (`if (valid)` not `if (!invalid)`)
- [ ] Variables at smallest possible scope
- [ ] No variable aliasing or duplication

---

## Performance Checklist

- [ ] Back-of-the-envelope sketch done
- [ ] Optimized slowest resource first (network → disk → memory → CPU)
- [ ] Batch operations where possible
- [ ] Hot loops extracted to standalone functions
- [ ] No expensive ops (sqrt, trig) in hot paths
- [ ] Cache-friendly data access patterns

---

## Naming Rules

| Type | Convention | Example |
|------|------------|---------|
| **Variables** | `snake_case` | `player_health_max` |
| **Functions** | `snake_case` | `calculate_distance` |
| **Classes** | `PascalCase` | `EntityManager` |
| **Types** | `PascalCase` | `RenderContext` |
| **Constants** | `UPPER_CASE` | `MAX_ENTITIES` |
| **Private** | `_snake_case` | `_internal_state` |
| **Acronyms** | Proper caps | `VSRState` not `VsrState` |

**Units go last:** `latency_ms_max` not `max_latency_ms`

**No abbreviations:** `distance` not `dist`, `position` not `pos`

---

## Control Flow Rules

```typescript
// ✅ GOOD: Simple, explicit
if (entity.active) {
  if (entity.health > 0) {
    // Do work
  } else {
    // Handle low health
  }
} else {
  // Handle inactive
}

// ❌ BAD: Compound condition
if (entity.active && entity.health > 0) {
  // Do work
}

// ❌ BAD: Negation
if (!entity.inactive) {
  // Hard to reason about
}

// ❌ BAD: No else branch
if (entity.health > 0) {
  // What about <= 0?
}
```

---

## Assertion Rules

```typescript
// ✅ GOOD: Multiple specific assertions
function update(entity: Entity, dt: number): void {
  assert(entity !== null);
  assert(dt > 0);
  assert(dt < 1);
  
  // ... work ...
  
  assert(entity.x >= 0);
  assert(entity.y >= 0);
}

// ❌ BAD: Compound assertion
function update(entity: Entity, dt: number): void {
  assert(entity !== null && dt > 0 && dt < 1);
}

// ✅ GOOD: Implication
if (entity.dead) {
  assert(entity.health === 0);
}

// ✅ GOOD: Compile-time assertion
const TILE_SIZE = 16;
const CHUNK_SIZE = 256;
assert(CHUNK_SIZE % TILE_SIZE === 0); // Checked at startup
```

---

## Bounds Rules

```typescript
// ✅ GOOD: Explicit bounds
const MAX_PARTICLES = 1000;
const particles: Particle[] = [];

function add_particle(p: Particle): void {
  assert(particles.length < MAX_PARTICLES);
  particles.push(p);
}

// ✅ GOOD: Loop with bound
for (let i = 0; i < MAX_ITERATIONS && !done; i++) {
  // ...
}

// ❌ BAD: Unbounded
const particles: Particle[] = [];
function add_particle(p: Particle): void {
  particles.push(p); // Could grow forever
}
```

---

## Comment Rules

```typescript
// ✅ GOOD: Explains WHY
// Use squared distance to avoid expensive Math.sqrt in hot path.
// Benchmark: 2.3ms → 0.8ms for 1000 entities.
const dist_sq = dx * dx + dy * dy;

// ❌ BAD: Explains WHAT (obvious from code)
// Calculate distance squared.
const dist_sq = dx * dx + dy * dy;

// ✅ GOOD: Shows rationale
// Player must move before collision check to avoid
// detecting collision with previous frame's position.
player.update_position(dt);
world.check_collisions(player);

// ✅ GOOD: Documents invariant
// INVARIANT: entities array is sorted by z-index.
for (const entity of entities) {
  entity.render(ctx);
}
```

---

## Scope Rules

```typescript
// ✅ GOOD: Tight scope
function process(entities: Entity[]): void {
  for (const entity of entities) {
    if (entity.active) {
      const distance = calculate_distance(entity, player);
      if (distance < 100) {
        // Use distance here, scope ends after block
      }
    }
  }
}

// ❌ BAD: Wide scope
function process(entities: Entity[]): void {
  let distance = 0; // Lives too long
  for (const entity of entities) {
    if (entity.active) {
      distance = calculate_distance(entity, player); // POCPOU risk
      if (distance < 100) {
        // distance might be stale
      }
    }
  }
}
```

---

## Off-By-One Rules

```typescript
// ✅ GOOD: Clear intent
const tile_count_exact = Math.floor(width / TILE_SIZE);
const buffer_count_ceil = Math.ceil(total / CHUNK_SIZE);

// ❌ BAD: Unclear rounding
const tile_count = width / TILE_SIZE; // Did we mean to truncate?

// ✅ GOOD: Index vs count
const last_index = array.length - 1; // 0-based
const entity_count = array.length;    // 1-based
assert(last_index === entity_count - 1);

// ✅ GOOD: Count to size
const entity_count = 100;
const buffer_size_bytes = entity_count * ENTITY_SIZE_BYTES;
```

---

## Function Shape Rules

```typescript
// ✅ GOOD: Parent controls flow, helpers are pure
function update_entities(entities: Entity[], dt: number): void {
  for (const entity of entities) {
    if (entity.type === 'player') {
      const new_pos = calculate_player_position(entity, dt);
      entity.position = new_pos;
    } else if (entity.type === 'enemy') {
      const new_pos = calculate_enemy_position(entity, dt);
      entity.position = new_pos;
    }
  }
}

function calculate_player_position(e: Entity, dt: number): Position {
  // Pure, no side effects
  return { x: e.x + e.vx * dt, y: e.y + e.vy * dt };
}

// ❌ BAD: Helpers mutate state
function update_entities(entities: Entity[], dt: number): void {
  for (const entity of entities) {
    update_player(entity, dt); // Mutates inside, hard to track
  }
}
```

---

## Callbacks Last

```typescript
// ✅ GOOD: Callback is last parameter
function query(
  world: World,
  filter: Filter,
  callback: (entity: Entity) => void,
): void {
  // ...
}

// ❌ BAD: Callback not last
function query(
  callback: (entity: Entity) => void,
  world: World,
  filter: Filter,
): void {
  // ...
}
```

---

## Return Type Simplicity

Prefer simpler return types:

```
void  >  boolean  >  number  >  number | null  >  Result<number, Error>
```

```typescript
// ✅ GOOD: Simple return type
function update(entity: Entity): void {
  // No return value to handle at call site
}

// ⚠️  OK: Boolean for success/failure
function try_move(entity: Entity, x: number, y: number): boolean {
  // Call site: if (try_move(player, 10, 20)) { ... }
}

// ⚠️  AVOID: Complex return type (use only when necessary)
function validate(data: unknown): Result<Data, ValidationError[]> {
  // Call site must handle two dimensions
}
```

---

## Commands

```bash
# Format code
pnpm run format

# Lint with Biome
pnpm run lint
pnpm run lint:fix

# Check CodeStyle compliance
pnpm run lint:codestyle

# Full check (typecheck + lint + codestyle)
pnpm run check

# Check single file
pnpm tsx scripts/check-codestyle.ts src/core/engine.ts
```

---

## The Golden Rule

> **Always motivate. Always say why.**

If you can explain the rationale, you:
- Increase understanding
- Make adherence more likely
- Share criteria for evaluation
- Enable others to improve the decision

---

## When In Doubt

1. Is it **safe**? (Assertions, bounds, explicit control flow)
2. Is it **fast**? (Batched, cache-friendly, no hidden complexity)
3. Is it **clear**? (Good names, tight scope, explains why)

If the answer to all three is "yes," ship it. 🚀

---

## Resources

- **Full guide:** [STYLE.md](./STYLE.md)
- **Checklist:** [.github/CODESTYLE_CHECKLIST.md](./.github/CODESTYLE_CHECKLIST.md)
- **Setup:** [CODESTYLE_SETUP.md](./CODESTYLE_SETUP.md)
- **Linter:** [biome.jsonc](./biome.jsonc)

---

_Remember: CodeStyle is called CodeStyle because it's **small**, **focused**, and **fierce**._

🐯
