# CodeStyle Documentation Index

Welcome to GameFoo's CodeStyle implementation! This index will help you navigate all the CodeStyle resources.

## 🎯 Start Here

New to CodeStyle? Start with these in order:

1. **[CODESTYLE_SETUP.md](./CODESTYLE_SETUP.md)** — Overview of what's been added (15 min read)
2. **[STYLE.md](./STYLE.md)** — Complete style guide (30 min read)
3. **[CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md)** — Quick reference card (print it!)

## 📚 Documentation

### Core Philosophy
- **[STYLE.md](./STYLE.md)** — The complete GameFoo style guide based on CodeStyle principles
  - Safety first (assertions, bounds, explicit control flow)
  - Performance (batching, CPU optimization, working with the grain)
  - Developer experience (naming, comments, scope management)

### Quick Reference
- **[CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md)** — One-page reference
  - Hard limits (line length, function length, etc.)
  - Checklists for safety, performance, DX
  - Code examples (good vs bad)
  - Command reference

### Setup & Tools
- **[CODESTYLE_SETUP.md](./CODESTYLE_SETUP.md)** — What's been configured
  - Biome linter configuration
  - ESLint configuration (optional)
  - Custom CodeStyle checker script
  - Integration with existing workflow

### Migration
- **[CODESTYLE_MIGRATION.md](./CODESTYLE_MIGRATION.md)** — How to adopt gradually
  - Three-phase approach (new code → hot paths → full codebase)
  - Common fixes with examples
  - File-by-file checklist
  - Progress tracking

### Code Review
- **[.github/CODESTYLE_CHECKLIST.md](./.github/CODESTYLE_CHECKLIST.md)** — PR review checklist
  - Safety checklist
  - Performance checklist
  - Developer experience checklist
  - Quick wins section

## 🛠️ Tools & Configuration

### Linter Configuration
- **[biome.jsonc](./biome.jsonc)** — Biome linter rules (primary)
- **[.eslintrc.json](./.eslintrc.json)** — ESLint rules (optional, for advanced checks)

### Scripts
- **[scripts/check-codestyle.ts](./scripts/check-codestyle.ts)** — Custom compliance checker
  - Checks line length (100 max)
  - Checks function length (70 max)
  - Checks assertion density (2 min per function)

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

# Check CodeStyle compliance
pnpm run lint:codestyle

# Full check (typecheck + lint + codestyle)
pnpm run check

# Check specific file
pnpm tsx scripts/check-codestyle.ts src/core/engine.ts
```

## 📖 Usage by Role

### For Developers (Writing Code)

1. Read [STYLE.md](./STYLE.md) once
2. Print [CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md), keep it visible
3. Run `pnpm run check` before committing
4. Reference [STYLE.md](./STYLE.md) when in doubt

### For Reviewers (PR Reviews)

1. Use [.github/CODESTYLE_CHECKLIST.md](./.github/CODESTYLE_CHECKLIST.md) for every PR
2. Focus on "Quick Wins" section for fast reviews
3. Reference [STYLE.md](./STYLE.md) when giving feedback
4. Celebrate when PRs pass all checks!

### For Maintainers (Refactoring)

1. Follow [CODESTYLE_MIGRATION.md](./CODESTYLE_MIGRATION.md) strategy
2. Track progress with `pnpm run lint:codestyle`
3. Use Boy Scout Rule: leave code better than you found it
4. Celebrate milestones (25%, 50%, 75%, 100% compliant)

### For New Team Members (Onboarding)

1. Read [CODESTYLE_SETUP.md](./CODESTYLE_SETUP.md) (15 min)
2. Read [STYLE.md](./STYLE.md) (30 min)
3. Review [CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md) (5 min)
4. Pick a small bug fix, apply CodeStyle, get feedback

## 🎓 Learning Path

### Week 1: Basics
- [ ] Read CODESTYLE_SETUP.md
- [ ] Read STYLE.md
- [ ] Print CODESTYLE_QUICKREF.md
- [ ] Write one new file following CodeStyle
- [ ] Get it reviewed

### Week 2: Practice
- [ ] Refactor one existing file (use CODESTYLE_MIGRATION.md)
- [ ] Review someone else's PR (use CODESTYLE_CHECKLIST.md)
- [ ] Fix 5 CodeStyle violations in existing code

### Week 3: Mastery
- [ ] Lead a code review focused on CodeStyle
- [ ] Help a teammate adopt CodeStyle
- [ ] Write or improve tooling (linter rules, scripts)

### Week 4: Teaching
- [ ] Teach CodeStyle to new team member
- [ ] Write blog post about CodeStyle wins
- [ ] Improve documentation based on questions

## 📊 Measuring Success

### Metrics to Track

1. **Compliance:** `pnpm run lint:codestyle` pass rate
2. **Bugs caught:** Assertions catching bugs before production
3. **Review time:** Faster reviews due to consistency
4. **Onboarding time:** Faster ramp-up for new devs
5. **Team satisfaction:** Survey team quarterly

### Goals

- **Month 1:** All new code is CodeStyle compliant
- **Month 2:** 5 critical files are compliant (hot paths)
- **Month 3:** 25% of codebase is compliant
- **Month 6:** 100% of codebase is compliant

## 🤔 FAQ

### Q: Do I need to read everything?

**A:** No. Start with:
1. [CODESTYLE_SETUP.md](./CODESTYLE_SETUP.md) — 15 min
2. [CODESTYLE_QUICKREF.md](./CODESTYLE_QUICKREF.md) — 5 min
3. Reference [STYLE.md](./STYLE.md) when you have questions

### Q: What if I disagree with a rule?

**A:** Discuss with the team. CodeStyle is opinionated but not dogmatic. Document exceptions in the linter config.

### Q: Can I ignore CodeStyle for demos/tests?

**A:** Tests can be lenient (see `biome.jsonc` overrides). Demos too. Core engine code should be strict.

### Q: How long does migration take?

**A:** Depends on codebase size:
- **Small (< 10k LOC):** 1-2 months
- **Medium (10-50k LOC):** 3-4 months
- **Large (> 50k LOC):** 6-12 months

But new code is compliant from day one, so you get benefits immediately.

## 🎉 Celebrating Wins

When you hit milestones, celebrate!

- First CodeStyle-compliant file → 🎊
- All new code compliant for a week → 🍕
- First bug caught by assertion → 🐛➡️💥
- 25% of codebase compliant → 🎂
- 50% of codebase compliant → 📝 (blog post)
- 75% of codebase compliant → 🏆
- 100% of codebase compliant → 🎉🎉🎉

## 🔗 External Resources

- [TigerBeetle TigerStyle](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/TIGER_STYLE.md) — Original guide
- [NASA Power of Ten](https://spinroot.com/gerard/pdf/P10.pdf) — Safety-critical coding rules
- [Let Over Lambda](https://letoverlambla.com/index.cl/guest/chap1.html) — On style and understanding

## 💬 Getting Help

Questions? Feedback? Ideas?

1. Check the FAQ in each document
2. Search the docs using GitHub search
3. Ask in team chat
4. Open an issue for documentation improvements

---

## 📝 Document Change Log

- **2026-07-20:** Initial CodeStyle implementation
  - Created comprehensive documentation set
  - Configured Biome and ESLint
  - Built custom CodeStyle checker
  - Set up CI/CD integration

---

**Welcome to CodeStyle! 🐯**

> "Simplicity and elegance are unpopular because they require hard work and discipline to achieve."  
> — Edsger Dijkstra
