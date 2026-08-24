# publish-test

Sanity checks for the package before publishing.

It verifies both consumer paths from a packed tarball:

1. Compiled entry: `@dryanovski/gamefoo`
2. Source TypeScript entry: `@dryanovski/gamefoo/source`

Run from project root:

```bash
pnpm run test:publish
```
