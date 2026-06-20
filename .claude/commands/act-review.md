# Assess inline code review comments and apply the valid ones via a fresh subagent

`$ARGUMENTS` must contain the review comments to assess. These can come from any review tool (GitHub Copilot, PR comments, manual notes, etc.) — paste them in directly. Copilot does not write review comments to disk, so copy from the Copilot Chat panel summary where possible; individual inline comments in the editor must be copied one at a time.

Include as many or as few comments as you like — the subagent will decide which are worth acting on.

## Steps

1. If `$ARGUMENTS` is empty, ask the user to paste the review comments and stop.

2. Capture the current working-tree diff for context:

   ```bash
   git diff HEAD
   ```

   If the diff is empty, also run `git show -p HEAD` to inspect the most recent commit instead (this works even in shallow clones or repos with a single commit).

3. Spawn a subagent using the Agent tool. The subagent starts with no prior context about this code — that independence is the point. Pass it a prompt along these lines, substituting the real diff and comments:

   > You are reviewing inline code review comments. Assess each comment independently on its merits — you have no prior context about this code or how it was written.
   >
   > **Current diff:**
   > `<diff>`
   >
   > **Review comments:**
   > `<$ARGUMENTS>`
   >
   > For each comment:
   > - If it identifies a genuine bug, correctness issue, or clear improvement: apply the fix by editing the relevant file. Follow all conventions in CLAUDE.md (imports, services pattern, Zod validation, British English, etc.). In particular: avoid redundant inline comments, but preserve and update any JSDoc block on a function or declaration you change — description, `@param`, `@returns`, and `@throws` must all reflect the new implementation.
   > - If it is a false positive, a style preference the codebase already overrides, or otherwise not worth acting on: skip it and give a one-line reason.
   >
   > After applying all valid fixes, run `npm run lint:fix`, then run `npm run typecheck` and `npm run lint`. If either still reports errors or warnings, fix the remaining issues and re-run both `npm run typecheck` and `npm run lint` before finishing.
   >
   > Return a short report: what was applied (with file and line references) and what was skipped (with rationales).

4. Relay the subagent's report to the user verbatim.

## Done criterion

The subagent has assessed every comment, applied all valid fixes, passed typecheck and lint, and returned a summary. Report that summary to the user.

## Notes

- Never commit changes — leave that to the user.
- The subagent's fresh context is the whole point: it avoids Claude marking its own homework when the current session produced the code under review.
