# CodeStyle Documentation Index

Welcome to GameFoo's CodeStyle implementation! This index will help you navigate all the CodeStyle
resources.

## 📚 Documentation

### Core Philosophy

- **[STYLE.md](./STYLE.md)** — The complete GameFoo style guide based on CodeStyle principles
  - Safety first (assertions, bounds, explicit control flow)
  - Performance (batching, CPU optimization, working with the grain)
  - Developer experience (naming, comments, scope management)

### Code Review

- **[.github/CODESTYLE_CHECKLIST.md](./.github/CODESTYLE_CHECKLIST.md)** — PR review checklist
  - Safety checklist
  - Performance checklist
  - Developer experience checklist
  - Quick wins section

## 🛠️ Tools & Configuration

### CI/CD

- **[.github/workflows/codestyle.yml](./.github/workflows/codestyle.yml)** — GitHub Actions workflow
  - Runs on every push and PR
  - Generates compliance reports
  - Comments on PRs with violations

## 🚀 Commands

```bash
# Format code
pnpm run format

# Lint with Biome
pnpm run lint
pnpm run lint:fix

# Full check (typecheck + lint + codestyle)
pnpm run check

```

## 🔗 External Resources

- [TigerBeetle TigerStyle](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md)
  — Original guide
- [NASA Power of Ten](https://spinroot.com/gerard/pdf/P10.pdf) — Safety-critical coding rules
- [Let Over Lambda](https://letoverlambla.com/index.cl/guest/chap1.html) — On style and
  understanding
