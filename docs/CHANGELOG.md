# Changelog

Notable user- and operator-facing changes. Newest first.

## 2026-09-08 — Authentication hardening (SYS-593)

- **Sign-in redirects are restricted to safe internal paths.** A `?redirect=`
  value on the sign-in page is now accepted only when it is a path rooted at a
  single `/` (e.g. `/footy/profile`). Absolute URLs, protocol-relative URLs
  (`//host`), `javascript:` and other schemes, backslash tricks, and values
  containing control characters or whitespace are rejected and fall back to
  `/footy/profile`. The same sanitised path is used for the Google/Microsoft
  social sign-in callback URL. Sanitisation is centralised in
  `sanitizeRedirectPath` (`src/lib/urls.ts`).
- **Mock authentication is harder to enable by accident.** It remains off
  unless the runtime is explicitly non-production (`NODE_ENV` of `development`
  or `test`, or `PLAYWRIGHT_TEST=true` for CI Playwright runs). It is now
  force-disabled whenever `MOCK_AUTH_DISABLED=true` or a production-like
  hosting signal is present (`VERCEL_ENV=production`, `APP_ENV=production`, or
  `NEXT_PUBLIC_APP_ENV=production`), regardless of any other setting.
- **Delete-account configuration is de-duplicated.** The ambiguous top-level
  `deleteUser` block in the Better Auth setup has been removed; the canonical
  configuration under `user.deleteUser` is the only one. Delete-account
  verification emails now consistently use deletion-focused subject and body
  text (previously the removed block sent password-reset wording).
- **Auth-user mapping is runtime-validated.** The `as unknown as
AuthUserSummary` cast in the account-deletion path is gone; the Better Auth
  user is mapped through a validated schema (`toAuthUserSummary`,
  `src/lib/authUser.ts`), which is also used by `getCurrentUser`.
