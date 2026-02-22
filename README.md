# Next.js + MySQL rewrite of <www.toastboy.co.uk>

This project is based on [Azure + MySQL example code](https://github.com/Azure-Samples/vercel-nextjs-app-azure-db-mysql) from [Prisma](https://www.prisma.io/) using [Mantine Components](https://mantine.dev/), [Tabler Icons](https://tabler-icons-react.vercel.app/) and [Better Auth](https://better-auth.vercel.app/). It uses [Sentry](https://sentry.io/) for app monitoring, [Vitest](https://vitest.dev/) for unit testing and [Playwright](https://playwright.dev/) for end-to-end testing. Test coverage is uploaded to [Codecov](https://about.codecov.io/) and [ESLint](https://www.npmjs.com/package/eslint) results are monitored in GitHub Actions using [Reviewdog](https://github.com/reviewdog/reviewdog).

[![CodeQL](https://github.com/toastboy/next-www-toastboy/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/github-code-scanning/codeql)
[![Vitest Tests](https://github.com/toastboy/next-www-toastboy/actions/workflows/vitest.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/vitest.yml)
[![Playwright Tests](https://github.com/toastboy/next-www-toastboy/actions/workflows/playwright.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/playwright.yml)
[![Reviewdog](https://github.com/toastboy/next-www-toastboy/actions/workflows/lint.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/lint.yml)
[![Terraform](https://github.com/toastboy/next-www-toastboy/actions/workflows/terraform.yml/badge.svg)](https://github.com/toastboy/next-www-toastboy/actions/workflows/terraform.yml)

## Secrets

All secrets should be managed by 1Password, in the exclusive vault "next-www-toastboy" and referenced from the `.env` file. This file is safe to commit to source control since it only contains references, not values. Preface all commands which might need secret values in the environment with the op cli, like this:

```shell
op run --env-file ./.env -- npm run build
```

The `importlivedb` script needs two env files:

```shell
op run --env-file src/lib/importlivedb/.env --env-file ./.env -- npm run importlivedb
```

## Run the App

Run the app with the following command:

```shell
op run --env-file ./.env -- npm run dev
```

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
