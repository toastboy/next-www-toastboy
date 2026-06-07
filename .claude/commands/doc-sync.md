# Inspect recent changes and draft any missing README section or update

`$ARGUMENTS` is optional. If provided, treat it as a hint about which section the change belongs to (e.g. "Secrets", "GitHub Actions", "Sentry"). If omitted, infer from the diff.

## Steps

1. Gather the diff — run `git diff HEAD` to capture all staged and unstaged changes since the last commit. If the working tree is clean, run `git show -p HEAD` to inspect the most recent commit instead (this works even in shallow clones or repos with a single commit, unlike `git diff HEAD~1 HEAD`).

2. Identify README-worthy content. The README covers things a developer needs to understand *before touching the repo* — infrastructure, CI/CD decisions, secrets management, external services, and non-obvious operational constraints. Changes worth documenting include:
   - New or removed external services, integrations, or dependencies (Azure, Sentry, Chromatic, Codecov, etc.)
   - New or changed environment variables or secrets, and where they live
   - Changes to GitHub Actions workflow structure or security posture (e.g. who has access to 1Password)
   - New operational commands or prerequisites (e.g. a new `npm run` script a developer must know)
   - Security decisions with a rationale that would otherwise be lost (e.g. why Chromatic uses a plain secret)
   - Changes to Prisma schema that affect developer setup (e.g. `npm run setup:playwright` is needed again)

   Do **not** document: implementation internals, code patterns (those belong in `CLAUDE.md`), or changes that are already self-evident from the code.

3. Read `README.md` in full. Identify the best target section:
   - If `$ARGUMENTS` names a section, place the content there.
   - Otherwise, match to an existing section by topic. If no section fits, propose a new one after the closest related section.

4. Draft the new or updated prose. Follow the voice and style already present in `README.md`:
   - Use a short introductory sentence, then a table or fenced code block where appropriate.
   - British English.
   - Be concise — document the decision and rationale, not the implementation.
   - Where a threshold or value is configurable, name the env var or file that controls it.

5. Apply the edit to `README.md` using the Edit tool. Insert into the correct section, or append a new `##` section in the right place. Do not reformat unrelated sections.

6. Print a brief summary of what was added or changed and why it is README-worthy — one or two sentences.

## Done criterion

`README.md` has been updated with accurate, correctly placed prose that captures the architectural or CI decision introduced by the diff. Report what was added and which section it landed in.

## Notes

- If the diff contains multiple unrelated README-worthy changes, handle each one in turn within the same run.
- If the diff contains nothing README-worthy, say so explicitly rather than padding the README with implementation noise.
- Never commit the file — leave that to the user.
- CLAUDE.md is for developer-workflow conventions (how to run commands, code patterns). README.md is for architectural decisions and operational context. When in doubt, prefer CLAUDE.md for anything code-pattern-related.
