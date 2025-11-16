## AI Coding Agent Guide for `next-www-toastboy`

Purpose: Enable fast, safe contributions. Keep changes aligned with existing service + data patterns, testing setup, and env/secrets workflow.

### Architecture & Layers

- Next.js App Router under `src/app/footy/**` for feature pages; API route handlers live in `src/app/api/**` (importable via alias `api/*`).
- Data access encapsulated in service classes in `src/services/*.ts` (e.g. `GameDay.ts`, `PlayerRecord.ts`). Pattern: `import 'server-only'`; define `extendedFields` (extra validation) + strict Zod schemas (`XUncheckedCreate/Update...StrictSchema`) extending generator output from `prisma/generated/schemas`; use a `debug('footy:api')` logger; expose methods performing validated prisma queries.
- Prisma client singleton in `lib/prisma.ts`; do not instantiate another client. Always validate inputs with appropriate Zod schema (`WhereUnique`, `WhereInput`, etc.) before calling prisma.
- `lib/config.ts` central numeric thresholds (min games/replies). Reference these instead of hard‑coding values.
- Utility patterns: `rankMap` in `lib/utils.ts` converts `TableName` enum to rank field names; reuse rather than manual mapping.
- Sentry instrumentation via `instrumentation.ts` / `instrumentation-client.ts` and wrapped Next config (`next.config.mjs` with `withSentryConfig`). Preserve `tunnelRoute: '/monitoring'` and middleware matcher exclusions when editing middleware. Preserve `tunnelRoute: '/monitoring'` and middleware matcher exclusions when editing middleware.

### Data Model (Prisma)

- Core entities: `GameDay`, `Outcome`, `PlayerRecord`, `Player` (+ supporter/ratings tables). Aggregated per‑game/per‑season stats stored in `PlayerRecord` (unique composite: `playerId, year, gameDayId`). Use indices already defined—prefer filters on indexed columns (`playerId`, `year`, `gameDayId`) for new queries.
- Zod schemas are generated (`prisma/generated/**`); extend rather than modify generated files. If schema changes: update `prisma/schema.prisma`, then run `npx prisma generate` (already embedded in `dev`/`build` scripts).

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

- Always prepend backend-only modules with `import 'server-only';` to prevent client bundling.
- Use `debug` logging with consistent namespace (`footy:api`) for new service methods; avoid `console.log`.
- Validate external input early using appropriate `...Where*` or custom strict schema extension; never trust raw request body/query directly in prisma calls.
- Prefer returning `null` over throwing for “not found” lookups; throw only on unexpected failures (see existing service methods).
- Maintain matcher exclusions in `middleware.ts` when adding routes so monitoring + static assets remain unblocked.

### Adding a New Service (Example Skeleton)

```ts
import 'server-only';
import debug from 'debug';
import prisma from 'lib/prisma';
import { SomeModelWhereUniqueInputObjectSchema } from 'prisma/generated/schemas';
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
