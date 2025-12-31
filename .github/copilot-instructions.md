## AI Coding Agent Guide for `next-www-toastboy`

Purpose: Enable fast, safe contributions. Keep changes aligned with existing service + data patterns, testing setup, and env/secrets workflow. The policy for this project is to have zero errors or warnings from both 'npm run typecheck' and 'npm run lint' as well as 'npm run build'. New test failures in git commits are acceptable since they fit with the red-green-refactor cycle, but the overall test suite should pass before any deployment. Test coverage should not decrease and should generally be 90% or higher, but small dips are acceptable if justified by the nature of the change.

### Architecture & Layers

- Next.js App Router under `src/app/footy/**` for feature pages; API route handlers live in `src/app/api/**` (importable via alias `api/*`).
- Data access encapsulated in service classes in `src/services/*.ts` (e.g. `GameDay.ts`, `PlayerRecord.ts`). Pattern: `import 'server-only'`; define `extendedFields` (extra validation) + strict Zod schemas (`XUncheckedCreate/Update...StrictSchema`) extending generator output from `prisma/generated/schemas`; use a `debug('footy:api')` logger; expose methods performing validated prisma queries. If I find myself writing direct prisma calls in API routes or components, I should refactor into a service method instead. Equally if I make a query via a service method and then find myself filtering, sorting or otherwise manipulating the results in the calling code, I should consider whether that logic belongs in the service method instead.
- All prisma queries must live in `src/services/` only. Types can be used anywhere (prisma types, zod types, and custom `types/`), but direct prisma calls are not allowed outside services. Prefer one service per model; related models can be grouped (e.g., `PlayerEmail` and `PlayerInvitation` live in `PlayerService`).
- Prisma client singleton in `prisma/prisma.ts`; do not instantiate another client. Always validate inputs with appropriate Zod schema (`WhereUnique`, `WhereInput`, etc.) before calling prisma.
- `lib/config.ts` central numeric thresholds (min games/replies). Reference these instead of hard‑coding values.
- Utility patterns: `rankMap` in `lib/utils.ts` converts `TableName` enum to rank field names; reuse rather than manual mapping.
- Sentry instrumentation via `instrumentation.ts` / `instrumentation-client.ts` and wrapped Next config (`next.config.mjs` with `withSentryConfig`). Preserve `tunnelRoute: '/monitoring'` and middleware matcher exclusions when editing middleware. Preserve `tunnelRoute: '/monitoring'` and middleware matcher exclusions when editing middleware.

### Data Model (Prisma)

- Core entities: `GameDay`, `Outcome`, `PlayerRecord`, `Player` (+ supporter/ratings tables). Aggregated per‑game/per‑season stats stored in `PlayerRecord` (unique composite: `playerId, year, gameDayId`). Use indices already defined—prefer filters on indexed columns (`playerId`, `year`, `gameDayId`) for new queries.
- Zod schemas are generated (`prisma/generated/**`); extend rather than modify generated files. If schema changes: update `prisma/schema.prisma`, then run `npx prisma generate` (already embedded in `dev`/`build` scripts).
- Better Auth tables are off-limits: `user`, `account`, `session`, and `verification` must never be modified directly via Prisma or SQL. Use Better Auth APIs/plugins to manage them.

### Environment & Secrets

- All runtime secrets loaded via 1Password: prefix commands with `op run --env-file ./.env --` (example: `op run --env-file ./.env -- npm run dev`). Never commit `.env` values; assume `DATABASE_URL` is present.
- Local DB started via `docker compose up -d` (included in `dev`/`start` scripts). Do not add code that assumes a different port/host—reuse `env("DATABASE_URL")`.

### Scripts & Workflows

- Development: `npm run dev` (prisma generate + docker compose + next dev). Build: `npm run build` (includes prisma generate; uses `DEBUG=app:*`). Clean tasks: `clean`, `deepclean`.
- Import/crawl utilities live under `src/lib/importlivedb` / `crawllivesite` and are run via dedicated scripts—keep them self‑contained; use `ts-node` with CommonJS compiler options pattern shown in `package.json`.

### Testing Strategy

- Jest multi‑project config (`jest.config.js`): backend (`api`, `services`) uses Node env; component tests use JSDOM with setup file `jest.setup.frontend.ts`. Place new service tests in `tests/services/**.test.ts`; component tests in `tests/components/**.test.tsx`; API route tests in `tests/api/**`.
- Use path aliases (see `tsconfig.json` & moduleNameMapper) instead of relative `../../` imports.
- Avoid direct testing of generated Zod schemas—test service method behavior + validation (e.g., ensure invalid input throws before prisma call).
- E2E tests: Playwright in `e2e/` (config `playwright.config.ts`). Dev server auto-starts; baseURL `http://127.0.0.1:3000`. Add new page specs as `*.spec.ts`; artifacts land in `test-results/` with HTML report (`playwright-report/`). Keep tests fully parallel-safe (no shared mutable global state).

### Conventions & Patterns

- **Import paths**: ALWAYS use `@/` alias imports (e.g., `import prisma from 'prisma/prisma'`) instead of relative imports with `../`. Never use `../` in import statements—use the `@/` path alias configured in `tsconfig.json`. Same-directory imports using `./` are acceptable.
- Always use single quotes for import paths.
- Always prepend backend-only modules with `import 'server-only';` to prevent client bundling.
- Use `debug` logging with consistent namespace (`footy:api`) for new service methods; avoid `console.log`.
- Validate external input early using appropriate `...Where*` or custom strict schema extension; never trust raw request body/query directly in prisma calls.
- Prefer returning `null` over throwing for “not found” lookups; throw only on unexpected failures (see existing service methods).
- Maintain matcher exclusions in `middleware.ts` when adding routes so monitoring + static assets remain unblocked.
- Use existing Zod schema extension patterns for custom validation (see `extendedFields` examples in services).
- Always add comments to new functions/methods explaining purpose, parameters, return values, and thrown errors in the same manner as existing code and using the typical output of issuing the '/doc' command to the inline coding agent.

### Adding a New Service (Example Skeleton)

```ts
import 'server-only';
import debug from 'debug';
import prisma from 'prisma/prisma';
import { SomeModelWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import z from 'zod';
const extendedFields = { /* extra validation */ };
export const SomeModelCreateStrictSchema = /* extend generated create schema */;
const log = debug('footy:api');
export class SomeModelService { async get(id: number) { const where = SomeModelWhereUniqueInputObjectSchema.parse({ id }); return prisma.someModel.findUnique({ where }); } }
```

### PR / Change Checklist

1. Use path aliases.
2. Add/adjust Zod extensions—not generated files.
3. Include targeted Jest tests (service/component) + optional Playwright if user flow changes.
4. Run with `op run ... npm run build` before shipping (ensures prisma + Sentry ok).
5. Preserve existing Sentry/middleware settings unless intentionally changing observability.

Feedback: Tell us if any section lacks clarity (e.g., data flow, testing boundaries, auth patterns) so we can refine.
