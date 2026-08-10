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
npm run format:check                        # If it fails, run `npm run format` then re-run format:check
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

**Policy:** `typecheck`, `lint`, `format:check`, and `build` must all exit with code 0 and report no errors or warnings before any deployment. Test coverage ≥ 90%.

**Required finalisation checklist — must complete before reporting any task done:**

1. Run `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npx knip`.
2. If there are errors or warnings, fix them all — run `npm run lint:fix` first
   to auto-fix what lint can, then `npm run format` to normalise formatting,
   then re-run `npm run lint` and `npm run format:check` to confirm. Do not
   skip or dismiss any output. Remove any unused files, exports, or
   dependencies reported by `knip`.
3. If you are unsure whether a problem is pre-existing, run `git stash` and
   repeat the checks on the clean tree to establish a baseline, then `git stash
   pop` and fix only the new ones.
4. Never report work as done while typecheck, lint, format:check, or knip
   exit with a non-zero code or report any errors or warnings.

## Architecture & Layers

- **Pages:** `src/app/footy/**` — Next.js App Router feature pages
- **API routes:** `src/app/api/**` — Next.js route handlers; importable via `api/*` alias
- **Server actions:** `src/actions/` — thin `"use server"` wrappers: auth guard + call core + revalidate + broadcast; mutations only; injected into components as required props
- **Action cores:** `src/lib/core/` — pure business logic called by server actions; injectable deps for testing; no Next.js boundary concerns
- **Services:** `src/services/` — all Prisma queries live here exclusively, one service per model
- **Library:** `src/lib/` — utilities, auth, config, email, Azure, dates, URLs, observability
- **Types:** `src/types/` — custom TypeScript types and Zod schema extensions

**Domain ontology:** [`docs/ontology.yaml`](docs/ontology.yaml) — the meaning layer on top of `prisma/schema.prisma`: what each entity represents, how they relate, controlled vocabularies, business workflows (invitations, picker, results, money), and invariants the code enforces that the schema doesn't. Consult it before making non-trivial changes to domain logic (game days, outcomes, picker, ratings, tables, transactions) — read `prisma/schema.prisma` for structure and this file for meaning. While changes to the ontology are possible they are likley to be rare and each should be considered very carefully: the business logic and the ontology should always be kept in sync.

**Data flow rule:** Components call services (read) or server actions (write). Never write direct Prisma calls in API routes, pages, or components — refactor into a service method. If you filter/sort service results in calling code, move that logic into the service.

**Client/server split:** Every file under `src/components/**/*.tsx` must start with `'use client';` — the presentation layer is always Client Components, full stop, regardless of whether a given component happens to need interactivity today. Every `src/app/**/page.tsx` (and `layout.tsx`) must stay a Server Component — that's where data fetching happens; pass the results down as props. Both rules are enforced by ESLint (`local/require-use-client` and the existing `no-restricted-syntax` block for pages, in `eslint.config.mjs`) and `eslint --fix` will insert/remove the directive automatically. Rationale: it keeps the "fetch on the server, render from props" split unambiguous with no per-component judgment call, and it categorically avoids the Mantine dot-notation Server Component bug described below (that bug requires the *accessing* file to be a Server Component, which can no longer happen inside `src/components`). At this project's scale the cost — losing zero-JS server rendering for otherwise-static presentational leaves — is negligible.

## Key Conventions

### Dependencies

- `@types/d3` is listed in `devDependencies` and `ignoreDependencies` in `knip.json` even though no code imports from `d3` directly. It is kept because it pulls in all the individual `@types/d3-*` sub-packages (e.g. `@types/d3-array`, `@types/d3-axis`) as transitive npm dependencies — removing it silently removes all those type declarations.

### Formatting

- Formatting is enforced by Prettier (`.prettierrc`), not ESLint — `eslint-config-prettier` is the last entry in `eslint.config.mjs` and disables the handful of ESLint rules that would otherwise conflict with it (`semi`, `comma-dangle`, `eol-last`, `operator-linebreak`, `react/jsx-wrap-multilines`). ESLint still owns everything else: import sorting, SonarJS, promise rules, type-aware `@typescript-eslint/*` rules, etc.
- `.prettierrc`: single quotes, 4-space indent, semicolons, trailing commas wherever valid, `singleAttributePerLine: true` (any JSX/HTML element with 2+ attributes that wraps onto multiple lines gets one attribute per line, rather than packing attributes onto the opening-tag line) — otherwise plain Prettier defaults (printWidth 80, double-quoted JSX attributes, etc.). No per-package or per-directory exceptions.
- `npm run format` to apply, `npm run format:check` to verify (part of the finalisation checklist above).
- `.prettierignore` excludes generated/vendored files that shouldn't be hand-formatted (`prisma/generated`, `prisma/zod`, `public/mockServiceWorker.js`, `public/countries-110m.json`, `package-lock.json`) and YAML/Markdown, which are out of scope for this tooling and stay hand-maintained.

### Library usage

When figuring out how to call a library (Mantine, Prisma, Next.js, etc.) — API shape, available props, intended usage pattern — prefer the public documentation over reading the source in `node_modules`. Relying on the source risks depending on undocumented behaviour or implementation details that can change without notice in a patch release. This doesn't apply when actually debugging a concrete issue (e.g. tracing an unexpected error or runtime behaviour) — reading the installed source is often the fastest way to find the real cause there, as with the Mantine Server Component bug documented below.

### Imports

- **Always** use `@/` alias instead of `../../` relative imports. Enforced by `no-restricted-imports` (pattern `../*`) in `eslint.config.mjs`; not auto-fixable, so `eslint --fix` will flag but not rewrite these
- Same-directory `./` imports are acceptable
- `@root/*` maps to the repo root, for the handful of root-level convention files (`mdx-components.tsx`) that sit outside `src/`. Declared in `tsconfig.json` and mirrored in `vitest.components.config.ts`, which lists its aliases explicitly — add it to any other Vitest config whose tests reach a root-level file
- Files under `**/__mocks__/**` are exempt from the parent-relative ban: a mock lives inside the directory of the module it mocks and imports it as `'../Foo'`, which is the same-directory case in spirit
- Always use single quotes for import paths
- Prepend all backend-only modules with `import 'server-only';`
- Import formatting (including `@mantine/*` imports) follows plain Prettier output — no special-casing; see [Formatting](#formatting) below
- **Always** use Mantine's dot-notation compound components (`Table.Tr`, `Menu.Item`, `AppShell.Header`, `RichTextEditor.Bold`, etc.) exactly as shown in the Mantine docs — do not import the standalone named subcomponent (`TableTr`, `MenuItem`, `AppShellHeader`, `BoldControl`, etc.) instead. This was banned until 2026-08 because a Server Component (no `'use client'`) accessing a dot-notation subcomponent of a `'use client'` package export resolves the property to `undefined` at render time — "Element type is invalid: expected a string ... but got: undefined" — because Server Components only receive an opaque client reference for a `'use client'` export, not the real object, so its static properties aren't accessible. This is a confirmed, still-open limitation of the current Next.js/React Server Components architecture, not a bug in Mantine or this codebase (see [vercel/next.js#84961](https://github.com/vercel/next.js/issues/84961) and the root-cause explanation in [vercel/next.js#75192](https://github.com/vercel/next.js/issues/75192)). It bit `PlayerInfo`, `PlayerResults`, `PlayerPositions`, and `PlayerArse` in July 2026. The ban has since been lifted for `src/components/**`: `local/require-use-client` (see below) now guarantees every file there is a Client Component, so the bug can no longer occur on that tree. **Exception:** `src/app/**/page.tsx` and `layout.tsx` files are genuine Server Components and must stay that way — if one needs to render a Mantine compound component, extract the markup into a `src/components` Client Component and pass data down as props, rather than importing the standalone subcomponent directly in the page.

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
- Prefer Mantine style props (`bd`, `bg`, `c`, `w`, `h`, `m*`, `p*`, etc.) over the `style` prop or a CSS file/module. Only fall back to raw CSS/inline `style` when no Mantine style prop covers the property needed — CSS is the escape hatch, not the default
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
