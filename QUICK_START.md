# Quick Start — GameFoo

Fast reference for common development tasks.

## 🚀 First Time Setup

```bash
# 1. Install pnpm (if needed)
npm install -g pnpm

# 2. Install dependencies
pnpm install

# 3. Verify setup
pnpm run check
```

---

## 📦 Package Management

```bash
pnpm install              # Install all dependencies
pnpm add <package>        # Add dependency
pnpm add -D <package>     # Add dev dependency
pnpm remove <package>     # Remove dependency
pnpm update               # Update all dependencies
```

---

## 🛠️ Development

```bash
# Dev server (web demos)
pnpm run dev              # Start Vite on http://localhost:3000

# Run TypeScript files
pnpm tsx <file.ts>        # Execute TS file directly

# Terminal demos
pnpm tsx terminal_demos/basic/index.ts
```

---

## ✅ Quality Checks

```bash
# Individual checks
pnpm run typecheck        # TypeScript type checking
pnpm run lint             # Biome linting
pnpm run lint:fix         # Auto-fix lint issues
pnpm run format           # Format code
pnpm run lint:codestyle   # CodeStyle compliance

# Run all checks
pnpm run check            # typecheck + lint + codestyle
```

---

## 🧪 Testing

```bash
pnpm test                 # Run all tests once
pnpm test:watch           # Run tests in watch mode
pnpm test <file>          # Run specific test file
```

---

## 🏗️ Building

```bash
pnpm run build            # Build library to dist/
pnpm run prepublishOnly   # Full check + build (pre-publish)
```

---

## 📚 Documentation

```bash
pnpm run docs:generate    # Generate API docs
pnpm run docs:dev         # Start docs dev server
pnpm run docs:build       # Build docs site
pnpm run docs:preview     # Preview built docs
```

---

## 🎨 Code Style

### Hard Limits
- **Line length:** 100 columns max
- **Function length:** 70 lines max
- **Assertions:** 2 minimum per function

### Key Principles
- ✅ Explicit over implicit
- ✅ Assert all invariants
- ✅ Simple control flow
- ✅ Names with meaning
- ✅ Say why, not what

### Check Compliance
```bash
pnpm run lint:codestyle              # Check all
pnpm tsx scripts/check-codestyle.ts src/core/engine.ts  # Check one file
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **[README.md](./README.md)** | Project overview |
| **[STYLE.md](./STYLE.md)** | Complete style guide |
| **[CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md)** | One-page reference |
| **[CODESTYLE_INDEX.md](./CODESTYLE_INDEX.md)** | Doc index |
| **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** | Migration summary |

---

## 🔧 Troubleshooting

### pnpm not found
```bash
npm install -g pnpm
```

### TypeScript errors
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Tests failing
```bash
pnpm add -D vitest @vitest/ui
pnpm test
```

### Dev server not starting
```bash
pnpm run dev --host --port 3000
```

---

## 📋 Pre-Commit Checklist

Before committing:

```bash
# 1. Format code
pnpm run format

# 2. Run all checks
pnpm run check

# 3. Run tests
pnpm test

# 4. Build (if touching src/)
pnpm run build
```

---

## 🌐 Important URLs

- **Dev server:** http://localhost:3000
- **Docs (dev):** http://localhost:4321
- **GitHub:** https://github.com/dryanovski/gamefoo
- **npm:** https://www.npmjs.com/package/@dryanovski/gamefoo

---

## 🆘 Getting Help

1. Check [CODESTYLE_INDEX.md](./CODESTYLE_INDEX.md) for documentation
2. Search issues: `gh issue list`
3. Read [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) for recent changes

---

**Quick tip:** Print [CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md) and keep it visible while coding!

✨ Happy coding!
