# Next.js + MySQL rewrite of <www.toastboy.co.uk>

This project is based on [Azure + MySQL example code](https://github.com/Azure-Samples/vercel-nextjs-app-azure-db-mysql) from [Prisma](https://www.prisma.io/) using [Mantine Components](https://mantine.dev/), [Tabler Icons](https://tabler-icons-react.vercel.app/) and [Better Auth](https://better-auth.vercel.app/). It uses [Sentry](https://sentry.io/) for app monitoring, [Vitest](https://vitest.dev/) for unit testing and [Playwright](https://playwright.dev/) for end-to-end testing. Test coverage is uploaded to [Codecov](https://about.codecov.io/) and [ESLint](https://www.npmjs.com/package/eslint) results are monitored in GitHub Actions using [Reviewdog](https://github.com/reviewdog/reviewdog).

[![CodeQL](https://github.com/toastboy/next-www-toastboy/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/github-code-scanning/codeql)
[![Unit Tests with Coverage](https://github.com/toastboy/next-www-toastboy/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/unit-tests.yml)
[![Playwright Tests](https://github.com/toastboy/next-www-toastboy/actions/workflows/playwright.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/playwright.yml)
[![Storybook Tests](https://github.com/toastboy/next-www-toastboy/actions/workflows/storybook.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/storybook.yml)
[![Chromatic](https://github.com/toastboy/next-www-toastboy/actions/workflows/chromatic.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/chromatic.yml)
[![Reviewdog](https://github.com/toastboy/next-www-toastboy/actions/workflows/lint.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/lint.yml)
[![Knip](https://github.com/toastboy/next-www-toastboy/actions/workflows/knip.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/knip.yml)
[![Terraform](https://github.com/toastboy/next-www-toastboy/actions/workflows/terraform.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/terraform.yml)

## Azure App Registrations

Three Azure AD app registrations are managed by Terraform in [`terraform/main.tf`](terraform/main.tf), each scoped to the minimum permissions needed:

| App | Display Name | Purpose | Permissions |
| --- | --- | --- | --- |
| **Auth** | Next www toastboy – Auth | Microsoft social login via Better Auth | Delegated: `openid`, `profile`, `email`, `User.Read` |
| **Storage** | Next www toastboy – Storage | Azure Blob Storage access via RBAC | None (RBAC role assignment only) |
| **Mail** | Next www toastboy – Mail | Transactional email via Microsoft Graph | Application: `Mail.Send` (admin-consented) |

Terraform outputs the client IDs and secrets for each registration, which are synced to 1Password (vault `next-www-toastboy`) by the [Terraform workflow](.github/workflows/terraform.yml) after each apply. The env var mapping is:

| App | Client ID env var | Client secret env var |
| --- | --- | --- |
| Auth | `AUTH_MICROSOFT_CLIENT_ID` | `AUTH_MICROSOFT_CLIENT_SECRET` |
| Storage | `STORAGE_CLIENT_ID` | `STORAGE_CLIENT_SECRET` |
| Mail | `MAIL_GRAPH_CLIENT_ID` | `MAIL_GRAPH_CLIENT_SECRET` |

## Secrets

All secrets should be managed by 1Password, in the exclusive vault "next-www-toastboy" and referenced from the `.env` file. This file is safe to commit to source control since it only contains references, not values. Preface all commands which might need secret values in the environment with the op cli, like this:

```shell
op run --env-file ./.env -- npm run build
```

The `importlivedb` script needs two env files:

```shell
op run --env-file src/lib/importlivedb/.env --env-file ./.env -- npm run importlivedb
```

## GitHub Actions Secrets

CI workflows are structured so that **PR-triggered workflows never access 1Password**. Only workflows that run on `push: main` (deploy, Terraform apply) load secrets via the 1Password service account. This limits the blast radius of a supply-chain attack: a compromised npm package running in a PR test suite cannot exfiltrate production credentials.

The split between secret stores reflects this:

| Secret | Store | Used by |
| --- | --- | --- |
| `OP_SERVICE_ACCOUNT_TOKEN` | GitHub Actions secret | Terraform apply and 1Password sync (main only) |
| `CHROMATIC_PROJECT_TOKEN` | GitHub Actions secret | Chromatic visual regression (all pushes) |
| `CODECOV_TOKEN` | GitHub Actions secret | Unit test coverage upload (all pushes) |
| `TF_API_TOKEN` | GitHub Actions secret | Terraform plan & apply on main only. No Terraform runs on other branches or PRs. |
| `CLAUDE_CODE_OAUTH_TOKEN` | GitHub Actions secret | Claude code review and `@claude` mentions |
| All production app secrets | 1Password vault `next-www-toastboy` | Terraform apply + 1Password sync (main only) |

Chromatic uses a plain GitHub Actions secret rather than 1Password because it is needed for PR branch pushes, where 1Password access is intentionally withheld. The Chromatic credential is low-sensitivity (it only allows publishing snapshots to the Chromatic project).

### Dependabot auto-merge

Dependabot PRs are automatically merged once all required status checks pass, using GitHub's native auto-merge feature ([`.github/workflows/dependabot-auto-merge.yml`](.github/workflows/dependabot-auto-merge.yml)). The workflow only enables the auto-merge flag — no code is checked out or run. For this to work:

- **Allow auto-merge** must be enabled in repo Settings → General.
- The `main` branch protection rule must have **required status checks** configured; auto-merge fires only once all of them pass.

### Minimum package age

As a defence against supply-chain attacks (where a malicious version is published and quickly flagged by the community), auto-merge is withheld for any npm package whose new version was published less than **7 days ago**. The workflow queries the npm registry for the publish timestamp of each updated package and posts a comment on the PR if any package is too new, listing which ones and how old they are. The check re-runs on each push; once all packages have aged past the threshold, auto-merge is enabled automatically without further intervention.

Non-npm dependencies (GitHub Actions updates) are not subject to the age check, as they are pinned to exact SHAs and carry a different risk profile.

The threshold is controlled by `MIN_AGE_DAYS` at the top of the age-check step in [`.github/workflows/dependabot-auto-merge.yml`](.github/workflows/dependabot-auto-merge.yml).

## Run the App

Run the app with the following command:

```shell
op run --env-file ./.env -- npm run dev
```

## Running Playwright Tests Locally (macOS)

The `stdbuf` command used in some Linux CI seed scripts is not available on macOS by default. The `seed:playwright` and `seed:ci` scripts in `package.json` do not use `stdbuf`, so they work on both platforms.

Before running Playwright tests for the first time — or after any Prisma schema change — initialise the dedicated test database:

```shell
npm run setup:playwright
```

This creates the `footy` test database (via `prisma db push`) and regenerates the Prisma client. You only need to repeat it when the schema changes.

Then run all E2E tests:

```shell
npx playwright test
```

The test runner starts a local Next.js server automatically, seeds the test database, and tears everything down when done.

## Sentry Sampling and Quota Controls

The Sentry setup in this project now uses conservative defaults designed to fit
the free tier and avoid noisy events. You can override sampling behaviour with
environment variables when needed.

### Default behaviour

- `SENTRY_TRACES_SAMPLE_RATE`: `0.05` in production, `0.0` outside production.
- `SENTRY_REPLAYS_SESSION_SAMPLE_RATE`: `0.02` in production, `0.0` outside production.
- `SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE`: `0.2` in production, `0.0` outside production.
- Known noisy browser errors are ignored by default (for example
  `ResizeObserver loop limit exceeded`).
- Sensitive fields and query parameters (for example `token`, `password`,
  `authorization`, `cookie`, `secret`) are redacted before events are sent.

### Environment overrides

Set any of these in your environment (via `.env` + 1Password references) to
override defaults:

- `SENTRY_TRACES_SAMPLE_RATE`
- `SENTRY_REPLAYS_SESSION_SAMPLE_RATE`
- `SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE`

All values are clamped to the valid Sentry range `0..1`.
