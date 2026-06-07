# Run the project's mandatory finalisation checklist before reporting any task as done

## Steps

1. Run `npm run typecheck` and capture all output.
2. Run `npm run lint` and capture all output.
3. If either produced any errors or warnings:
   - For lint issues — run `npm run lint:fix` first to auto-fix what it can, then re-run `npm run lint` to see what remains.
   - Fix **every** remaining issue — do not skip, suppress, or dismiss any output.
   - If you are unsure whether a problem existed before your changes, run `git stash`, repeat both commands to establish a pre-change baseline, then `git stash pop` and fix only the new issues.
   - After fixing, re-run both commands to confirm they are clean.
4. Repeat until both commands exit with code 0 and report no errors or warnings.

## Done criterion

`npm run typecheck` and `npm run lint` both exit with code 0 and report no errors or warnings. Only then report the task as complete.

## Notes

- Fix issues in the order they appear — later errors are often caused by earlier ones.
- Avoid silencing a lint rule or adding a `@ts-ignore` / `eslint-disable` comment to make the output go away — fix the underlying problem. If a suppression is truly necessary (false positive, required vendor API), scope it as narrowly as possible (single line, specific rule) and add a short inline comment explaining why.
- If a typecheck error is in a generated file (`prisma/generated/`, `prisma/zod/`), do not edit it — regenerate it with `npx prisma generate` instead.
