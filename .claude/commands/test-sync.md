# Bring test coverage (mocks, unit tests, Storybook, Playwright) up to date with uncommitted changes

`$ARGUMENTS` is optional. If provided, treat it as a hint restricting scope (e.g. a file path, directory, or feature name). If omitted, operate on the full uncommitted diff.

## Steps

1. **Gather the diff.** Run `git status` and `git diff HEAD` (staged + unstaged) to list every changed file. If `$ARGUMENTS` was given, filter to files matching that hint but still read the full diff for context. If the working tree is clean, tell the user there is nothing to sync and stop.

2. **Classify each changed file by layer**, per `CLAUDE.md`:
   - `src/app/**/page.tsx` / `layout.tsx` etc. → **page** — tests under `test:pages` (`vitest.pages.config.ts`)
   - `src/app/api/**` route handlers → **API route** — tests under `test:api` (`vitest.api.config.ts`)
   - `src/actions/**` → **server action** — tests under `test:actions` (`vitest.actions.config.ts`)
   - `src/lib/core/**` → **action core** — check which config covers it (may be `test:actions` or `test:lib`; confirm via `include` globs in the vitest config files)
   - `src/services/**` → **service** — tests under `test:services` (`vitest.services.config.ts`)
   - `src/lib/**` (excluding `core/`) → **library util** — tests under `test:lib` (`vitest.lib.config.ts`)
   - `src/components/**`, `src/hooks/**`, `src/docs/**` → **component** — tests under `test:components` (`vitest.components.config.ts`); also check for a co-located `*.stories.tsx`
   - `src/types/**` → usually no dedicated test; skip unless it changes runtime Zod validation behaviour (then trace to whichever service/action consumes it)
   - Anything touching a page, form flow, or user-visible behaviour reachable from `e2e/*.spec.ts` → also candidate for **Playwright** coverage

   If a changed file's layer is ambiguous, grep the `include` arrays in `vitest.*.config.ts` to confirm which config actually picks it up rather than guessing.

3. **For each changed source file**, locate its co-located artifacts and decide what's needed:
   - Unit test: `<name>.vitest.spec.ts(x)` next to the file (never in `__tests__/`)
   - Mock: sibling `__mocks__/` directory, matching the pattern already used by neighbouring modules (e.g. `src/services/<Model>/__mocks__/`, `src/lib/__mocks__/`)
   - Storybook: sibling `<name>.stories.tsx` for components — update play-test interactions if props/behaviour changed, add a story if the component is new
   - Playwright: only touch `e2e/*.spec.ts` if the change affects a user-facing flow already covered there, or introduces a new page/flow that has no E2E coverage yet and clearly warrants it

   Decide per file:
   - New file with no test/mock/story → create them
   - Modified file with existing test/mock/story → update to match new behaviour (new branches, new props, new error paths, changed Zod schema, etc.)
   - Modified file whose tests already exercise the changed behaviour → leave as is, but still verify via coverage in step 5

4. **Follow repo testing conventions** while writing/updating tests (from `CLAUDE.md`):
   - Accessible selectors (`getByRole`, `getByLabelText`, `getByText`) over `data-testid`
   - Don't rely on Mantine internals (generated class names, internal DOM structure)
   - Use the generic query overload (`getByRole<HTMLInputElement>(…)`) instead of `as HTMLInputElement`
   - Don't test generated Zod schemas directly — test service/action behaviour and validation instead
   - E2E specs must be fully parallel-safe
   - Services: validate inputs with Zod before Prisma calls; mock at the Prisma/service boundary, not internals
   - British English in any new comments or copy

5. **Run the relevant test commands with coverage** for every layer touched, e.g.:

   ```bash
   npm run test:services:coverage
   npm run test:components:coverage
   npm run test:api:coverage
   npm run test:actions:coverage
   npm run test:lib:coverage
   npm run test:pages:coverage
   npm run test:storybook
   ```

   Only run the ones matching layers actually touched (running all is fine too if the diff spans many layers).

6. **Check coverage on the changed files specifically**, not just the overall summary. Read the per-file coverage lines in the terminal or `coverage/` HTML/JSON output for each file changed in step 1. If any changed file is below 100% line/branch coverage:
   - Identify the exact uncovered lines/branches
   - Add or extend test cases to cover them (new error paths, edge cases, conditional branches)
   - Re-run the coverage command
   - Repeat until every changed file shows 100% coverage

7. **Run Playwright** (`npx playwright test`) if any E2E-relevant flow was touched or added in step 3. Fix failures by adjusting the spec or, if the app itself has a genuine bug surfaced by the test, flag it to the user rather than silently loosening the assertion.

8. **Run the finalisation checklist** (per `CLAUDE.md` / the `finalise` skill): `npm run typecheck`, `npm run lint`, `npx knip`. Fix everything — `npm run lint:fix` first for lint, remove unused exports/files/deps for knip. If unsure whether an issue pre-dates this change, `git stash`, re-run to get a baseline, `git stash pop`, and fix only new issues.

9. **Repeat steps 5–8** until: every relevant test command passes, every changed file has 100% coverage, Playwright (where applicable) passes, and typecheck/lint/knip are all clean.

## Done criterion

All test suites relevant to the changed layers pass, every changed source file has 100% unit test coverage (line and branch), Playwright passes for any touched user-facing flow, and `npm run typecheck` / `npm run lint` / `npx knip` all exit 0 with no warnings. Report a summary: files changed, tests/mocks/stories added or updated per file, final coverage figures for changed files, and confirmation the finalisation checklist is clean.

## Notes

- Never commit changes — leave that to the user.
- Don't chase 100% coverage on generated files (`prisma/generated/`, `prisma/zod/`) or files explicitly excluded in a `vitest.*.config.ts` `coverage.exclude` list (e.g. `*Skeleton*`, `DebugBreakpoints`, `DebugSizeOverlay`, `DebugFontSizes`) — those are intentionally out of scope.
- If a changed file spans multiple test configs' `include` globs (rare), run all configs that could match rather than guessing which one is authoritative.
- If achieving 100% coverage on a changed file requires testing genuinely unreachable code (e.g. a defensive branch guaranteed unreachable by types), say so explicitly and ask the user whether to simplify the code instead of contorting a test to hit it.
- Overall repo policy is ≥90% coverage; this skill's own bar for files it touches is 100% — don't stop early at the lower project-wide threshold.
