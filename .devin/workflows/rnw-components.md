---
description: Pre-commit protocol and code quality for rnw-components
---

# RNW Components Carbon Workflow

The pre-commit protocol for the rnw-components library. Run before every commit or push. No commit happens until all three gates pass locally.

Invoke as: `/rnw-components`

## Operating Principle

> **CI is the second line of defense, not the first.** A CI run that fails on something testable locally is wasted pipeline time and a polluted git log. The Pre-Commit Protocol catches issues before they reach GitHub.

## Pre-Commit Protocol (mandatory, every commit)

### Gate 1: Fresh install

Wipe `node_modules/` and `package-lock.json` for a truly clean state. Everything must come from the registry - no stale dependencies, no hoisted modules from a previous session.

// turbo
```bash
# Cwd = codebase-rnw-components/_test
rm -rf node_modules package-lock.json && npm install 2>&1 | tail -5
```

### Gate 2: Lint

// turbo
```bash
# Cwd = codebase-rnw-components
npm run lint 2>&1 | tail -10
```

Must exit `0` with no errors and no warnings.

### Gate 3: Tests

// turbo
```bash
# Cwd = codebase-rnw-components/_test
npm test 2>&1 | tail -20
```

Must exit `0` with `fail 0`.

### Then commit

Only after all three gates pass:

1. `git add` the files belonging to this repo
2. Commit with a descriptive message
3. Push - CI will run the same gates again

If any gate fails, fix the issue before committing. Never push with a known failure.

## Reference

See `codebase-superloom/docs/dev/testing-local-modules.md` - Pre-Commit Protocol for the full protocol and the rationale behind the fresh-install requirement.
