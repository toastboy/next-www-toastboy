# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js + MariaDB football league management system (called "footy") for <www.toastboy.co.uk>. Manages games, player stats, ratings, transactions, and team assignments.

## Commands

All commands that need secrets must be prefixed with `op run --env-file ./.env --`.

```bash
# Development
op run --env-file ./.env -- npm run dev     # Starts Prisma generate + Docker Compose + Next.js dev server

# Build & validation (must pass with zero errors/warnings)
npm run typecheck
npm run lint                                # If lint fails, run lint:fix then re-run lint
op run --env-file ./.env -- npm run build

# Database
npm run generate                            # Generate Prisma client + Zod schemas (auto-runs in dev/build)
npm run migrate                             # Create + apply new migration (dev only)

# Testing (scoped configs per layer)
npm run test                                # Unit tests (default)
npm run test:services                       # Service layer tests
npm run test:api                            # API route tests
npm run test:components                     # Component tests
npm run test:actions                        # Server action tests
npm run test:pages                          # Page tests
npm run test:lib                            # Library utility tests
npm run test:storybook                      # Storybook play tests
npm run setup:playwright                    # One-time (or after schema changes): create test DB + push schema
npx playwright test                         # E2E tests (auto-starts dev server, seeds DB)

# Run a single test file
npx vitest run --config vitest.services.config.ts path/to/test.ts
```

**Policy:** `typecheck`, `lint`, and `build` must all exit with code 0 and report no errors or warnings before any deployment. Test coverage ≥ 90%.

**Required finalisation checklist — must complete before reporting any task done:**

1. Run `npm run typecheck`, `npm run lint`, and `npx knip`.
2. If there are errors or warnings, fix them all — run `npm run lint:fix` first
   to auto-fix what lint can, then re-run `npm run lint` to confirm. Do not skip
   or dismiss any output. Remove any unused files, exports, or dependencies
   reported by `knip`.
3. If you are unsure whether a problem is pre-existing, run `git stash` and
   repeat the checks on the clean tree to establish a baseline, then `git stash
   pop` and fix only the new ones.
4. Never report work as done while typecheck, lint, or knip exit with a
   non-zero code or report any errors or warnings.

## Architecture & Layers

- **Pages:** `src/app/footy/**` — Next.js App Router feature pages
- **API routes:** `src/app/api/**` — Next.js route handlers; importable via `api/*` alias
- **Server actions:** `src/actions/` — thin `"use server"` wrappers: auth guard + call core + revalidate + broadcast; mutations only; injected into components as required props
- **Action cores:** `src/lib/core/` — pure business logic called by server actions; injectable deps for testing; no Next.js boundary concerns
- **Services:** `src/services/` — all Prisma queries live here exclusively, one service per model
- **Library:** `src/lib/` — utilities, auth, config, email, Azure, dates, URLs, observability
- **Types:** `src/types/` — custom TypeScript types and Zod schema extensions

**Data flow rule:** Components call services (read) or server actions (write). Never write direct Prisma calls in API routes, pages, or components — refactor into a service method. If you filter/sort service results in calling code, move that logic into the service.

## Key Conventions

### Dependencies

- `@types/d3` is listed in `devDependencies` and `ignoreDependencies` in `knip.json` even though no code imports from `d3` directly. It is kept because it pulls in all the individual `@types/d3-*` sub-packages (e.g. `@types/d3-array`, `@types/d3-axis`) as transitive npm dependencies — removing it silently removes all those type declarations.

### Imports

- **Always** use `@/` alias instead of `../../` relative imports
- Same-directory `./` imports are acceptable
- Always use single quotes for import paths
- Prepend all backend-only modules with `import 'server-only';`

### Services Pattern

```ts
import 'server-only';
import debug from 'debug';
import prisma from 'prisma/prisma';
import { SomeModelWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import z from 'zod';

const extendedFields = { /* extra validation */ };
export const SomeModelCreateStrictSchema = /* extend generated create schema */;
const log = debug('footy:api');

export class SomeModelService {
  async get(id: number) {
    const where = SomeModelWhereUniqueInputObjectSchema.parse({ id });
    return prisma.someModel.findUnique({ where });
  }
}
```

- Validate all inputs with Zod before calling Prisma (`WhereUnique`, `WhereInput`, or custom strict schema)
- Return `null` for "not found"; throw only on unexpected failures
- Use `debug('footy:api')` for logging; never `console.log`
- Use `lib/config.ts` for numeric thresholds instead of hardcoding

### Prisma / Database

- Prisma client singleton: `prisma/prisma.ts` — never instantiate another client
- Generated files in `prisma/generated/` and `prisma/zod/` — extend, never modify
- Use `z.email()` not `z.string().email()` (Zod deprecation)
- Never create migration files manually — use `npm run migrate`
- Better Auth tables (`user`, `account`, `session`, `verification`) — never modify directly via Prisma; use Better Auth APIs

### UI & Forms

- Use Mantine components and hooks everywhere; avoid native HTML/CSS unless no Mantine equivalent exists. Never fall back to raw `<div>`, `<section>`, `<article>` etc. just to attach ARIA attributes — use Mantine's polymorphic `component` prop (e.g. `<Card component="section">`) or `role`/`aria-*` props on the Mantine element instead
- **Always** use Mantine `useForm` for form state — never write bespoke form handlers
- Use `@tabler/icons-react` for icons
- Notifications: use Mantine `notifications` with `autoClose` from `lib/config.ts`
- British English for all copy and comments

### Testing

- Test files: `*.vitest.spec.ts(x)` placed next to the file they test — never in a `__tests__/` subdirectory
- Mocks: `__mocks__/` as sibling to the target code
- Use accessible selectors (`getByRole`, `getByLabelText`, `getByText`) over `data-testid`
- Do not rely on Mantine internals in tests (for example generated class names, internal DOM wrappers, or implementation-specific structure). Prefer selectors and assertions that reflect real user interactions and visible behaviour.
- Prefer the generic overload (`getByRole<HTMLInputElement>(…)`) over a type assertion (`as HTMLInputElement`) when narrowing query results — ESLint strips assertions but preserves generics
- Don't test generated Zod schemas directly — test service method behaviour and validation
- E2E tests: `e2e/*.spec.ts`, must be fully parallel-safe

### Comments & JSDoc

- Default to no comments; only add one when the WHY is non-obvious
- When changing a function that has a JSDoc block, update the entire block in the same edit — description, `@param`, `@returns`, `@throws`, and any other tags must all accurately reflect the new implementation

### Live updates (revalidation & SSE)

Every server action that mutates data must, before returning:

1. Call `revalidatePath(…)` for every Next.js route that renders the affected data.
2. Call `broadcast(channel)` (or `broadcast([ch1, ch2])` for multiple) from `@/lib/events` with the relevant `FootyChannel` value(s) — so connected clients refresh without polling.

Every page that displays data that can be mutated by a server action must render `<AutoRefresh channels={…} />` (from `@/components/AutoRefresh/AutoRefresh`) with the matching channel(s). Pass an array when the page depends on more than one channel — never render multiple `<AutoRefresh>` elements.

`FootyChannel` values live in `src/types/FootyChannel.ts`; add a new entry there if the new feature needs its own channel.

### Observability

- Sentry: configured via `instrumentation.ts` / `instrumentation-client.ts` and `next.config.mjs`
- Preserve `tunnelRoute: '/monitoring'` and middleware matcher exclusions when editing middleware

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router) + React |
| Database | MariaDB via Prisma ORM |
| UI | Mantine |
| Auth | Better Auth (Google, Microsoft OAuth + email) |
| Testing | Vitest + Playwright + Storybook |
| API mocking | MSW |
| Validation | Zod (with Prisma-generated schemas) |
| Monitoring | Sentry |
| Storage | Azure Blob Storage |
| Email | Nodemailer via Microsoft Graph |
| Containers | Docker Compose (MariaDB + Mailpit) |
| Secrets | 1Password (`op run`) |
