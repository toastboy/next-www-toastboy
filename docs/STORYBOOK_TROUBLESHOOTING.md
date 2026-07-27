# Storybook Troubleshooting

## Chromatic "FORBIDDEN: No Access" when running `npm run storybook`

### Symptom

`npm run storybook` starts fine, but the `@chromatic-com/storybook` addon's
automatic build fails immediately at the authentication step:

```text
Chromatic: Authenticating with Chromatic failed
Chromatic:     → No Access
Chromatic: ✖ Failed to authenticate
```

The same failure can show up in the browser's Visual Tests panel as
"Visual tests login required" or a build error, even immediately after
logging in.

### Not the cause

These all look plausible but are **not** what's wrong, confirmed by testing:

- The `projectId` in `chromatic.config.json` — the addon's local build still
  fails/succeeds identically regardless of its value (auth happens before
  this field is ever consulted).
- Chromatic account permissions/project membership — confirmed via the
  project's Manage → Collaborate screen.
- Browser extensions or chromatic.com cookies — the same failure reproduces
  with all extensions disabled and chromatic.com's cookies cleared.

### Actual cause

The addon persists its own login/session state (things like `refresh_token`,
`session-storage`) in the browser's storage for Storybook's own origin,
**`http://localhost:6006`** — not for `chromatic.com`. If that stored state
becomes stale or invalid, the addon silently sends a bad token instead of
prompting a fresh login, and the API rejects it with `FORBIDDEN: No Access`.

Clearing `chromatic.com` cookies does nothing, because the bad data isn't
stored there.

### Fix

In DevTools on the `localhost:6006` tab:

1. **Application** tab → **Storage** → **Clear site data** (wipes
   localStorage, IndexedDB, cache storage and service workers for this
   origin — not just cookies).
2. Reload the page and log in to Chromatic again via the Visual Tests panel.

### Related gotcha: stale nested Chromatic CLI

`@chromatic-com/storybook` bundles its own nested copy of the `chromatic`
CLI package, independent of the top-level `chromatic` devDependency. If the
addon's build reports an older CLI version than `package.json` specifies,
add an explicit `chromatic` entry under `overrides` in `package.json` and
run `npm install` — bumping the direct devDependency alone does not update
the nested copy.
