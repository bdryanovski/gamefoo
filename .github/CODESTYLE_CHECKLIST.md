# CodeStyle Code Review Checklist

Use this checklist when reviewing PRs or writing new code.

## Safety

### Control Flow

- [ ] Control flow is simple and explicit (no hidden complexity)
- [ ] No recursion in hot paths or unbounded recursion anywhere
- [ ] All loops have explicit upper bounds or termination conditions
- [ ] Compound conditions are split into nested `if/else` for clarity
- [ ] Invariants are stated positively (prefer `if (valid)` over `if (!invalid)`)
- [ ] All `if` statements have matching `else` branches where appropriate

### Assertions

- [ ] All function arguments are asserted at entry
- [ ] All return values are asserted before return
- [ ] Preconditions and postconditions are asserted
- [ ] Compile-time constants relationships are asserted
- [ ] Compound assertions are split: `assert(a); assert(b);` not `assert(a && b)`
- [ ] Assertions cover both positive space (what is expected) and negative space (what is forbidden)
- [ ] Function has minimum 2 assertions (or is trivial getter/setter)

### Bounds

- [ ] All arrays have explicit maximum size
- [ ] All loops have explicit iteration limits
- [ ] All queues/buffers have capacity limits
- [ ] No unbounded growth in any data structure

### Memory

- [ ] No dynamic allocation in hot paths
- [ ] Large objects are passed by const reference, not copied
- [ ] No variable aliasing that could cause cache invalidation
- [ ] Variables are declared at smallest possible scope

### Types

- [ ] Explicitly-sized types used where appropriate (`u32`, `i64`, etc.)
- [ ] No reliance on platform-specific sizes (`number` is OK for TS/JS)
- [ ] Function signatures are as simple as possible
- [ ] Return types avoid unnecessary complexity (`void` > `boolean` > `number` > `number | null`)

## Performance

### Design

- [ ] Back-of-the-envelope performance sketch done for new features
- [ ] Optimized for slowest resource first (network → disk → memory → CPU)
- [ ] Hot paths clearly identified and optimized
- [ ] Control plane and data plane are clearly separated

### Batching

- [ ] Network operations are batched where possible
- [ ] Disk I/O is batched where possible
- [ ] Memory allocations are amortized
- [ ] CPU work is chunked for cache efficiency

### CPU

- [ ] Hot loops are extracted to standalone functions
- [ ] No struct field access inside tight loops (cache in local vars)
- [ ] Branch prediction friendly (consistent branch patterns)
- [ ] Cache-friendly data layout (structs grouped by access pattern)

### Explicit

- [ ] No reliance on compiler optimization magic
- [ ] Division intent is explicit (`Math.floor()`, `Math.ceil()`, exact)
- [ ] Expensive operations (sqrt, trig) are avoided or cached

## Developer Experience

### Naming

- [ ] Names use `snake_case` for variables/functions, `PascalCase` for classes/types
- [ ] No abbreviations (except `i`, `j`, `k` in tight loops)
- [ ] Units are included in variable names and placed last
- [ ] Related names have consistent length for alignment
- [ ] Names are infused with meaning (e.g., `gpa` vs `arena` for allocators)
- [ ] Acronyms use proper capitalization (`VSRState`, not `VsrState`)
- [ ] Callbacks are placed last in parameter lists

### Comments

- [ ] Comments are complete sentences with capitals and periods
- [ ] Space after `//`
- [ ] Comments explain **why**, not **what**
- [ ] Rationale for decisions is documented
- [ ] Complex algorithms include description of approach

### Structure

- [ ] Variables declared close to where they're used
- [ ] Variables calculated close to where they're used
- [ ] Minimal number of variables in scope at any time
- [ ] No variables introduced before they're needed
- [ ] No variables kept around after they're done

### Cache Invalidation

- [ ] No variable duplication or aliasing
- [ ] Large structs passed as const references
- [ ] Values calculated at point of use, not stashed earlier
- [ ] State changes are centralized, not scattered

### Off-By-One

- [ ] Clear distinction between `index`, `count`, and `size`
- [ ] Conversions between index/count/size are explicit
- [ ] Loop bounds are clearly correct
- [ ] Array access is clearly within bounds

## Style by the Numbers

### Line Length

- [ ] All lines ≤ 100 columns (hard limit, no exceptions)

### Function Length

- [ ] All functions ≤ 70 lines (excluding blank lines and comments)
- [ ] Control flow is centralized in parent functions
- [ ] State is centralized in parent functions
- [ ] Leaf functions are pure (no side effects)

### Block Statements

- [ ] Multi-line `if` statements have braces
- [ ] Single-line `if` statements are actually single-line

### Complexity

- [ ] Cyclomatic complexity ≤ 15
- [ ] Nesting depth ≤ 4 levels
- [ ] Function parameters ≤ 5
- [ ] No nested ternaries

## Code Quality

### Error Handling

- [ ] All errors are handled explicitly
- [ ] Error handling code is tested
- [ ] No silent failures

### Testing

- [ ] Tests cover valid inputs
- [ ] Tests cover invalid inputs
- [ ] Tests cover boundary conditions
- [ ] Tests verify transitions between valid and invalid states

### Documentation

- [ ] Public APIs have TSDoc comments
- [ ] Complex logic has inline comments
- [ ] Commit message explains **why**
- [ ] PR description links to issue/spec

## Dependencies

- [ ] No new dependencies added without strong justification
- [ ] All dependencies are necessary
- [ ] Dependencies don't compromise safety or performance

## Technical Debt

- [ ] No "TODO" or "FIXME" without issue link
- [ ] No showstoppers deferred to "later"
- [ ] Code meets all three design goals (safety, performance, DX)

---

## Final Question

**Would you trust this code in production?**

If the answer is anything but an enthusiastic "yes," it's not ready.

Remember: "You shall not pass!" — Gandalf

---

## Quick Wins

If you're short on time, focus on these high-impact checks:

1. [ ] Function length ≤ 70 lines
2. [ ] Line length ≤ 100 columns
3. [ ] Minimum 2 assertions per function
4. [ ] All loops have explicit bounds
5. [ ] No variable shadowing or aliasing
6. [ ] Comments explain **why**
7. [ ] Names are descriptive (no abbreviations)
8. [ ] Tests cover both valid and invalid inputs

---

## Resources

- [STYLE.md](../STYLE.md) — Full GameFoo style guide
- [CodeStyle](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md) — Original TigerStyle guide
- [NASA Power of Ten](https://spinroot.com/gerard/pdf/P10.pdf) — Safety-critical coding rules
