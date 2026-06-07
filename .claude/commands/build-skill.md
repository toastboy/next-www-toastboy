# Draft and write a new Claude Code skill based on a recurring task pattern

If `$ARGUMENTS` is provided, treat it as a description of the specific skill to create.
If `$ARGUMENTS` is empty, analyse recent conversation patterns and memory to identify the best candidate.

## Step 1 — Gather context

Read the following to understand what already exists and what patterns recur:

- All files in `.claude/commands/` — to avoid duplicating an existing skill
- `CLAUDE.md` — for project conventions the skill must respect
- Memory files in the project memory directory — for recurring feedback and workflows

## Step 2 — Identify or confirm the skill

If `$ARGUMENTS` is empty:

- Identify the single most valuable recurring task not yet covered by an existing command
- Briefly describe the pattern to the user and confirm they want to proceed before writing anything

If `$ARGUMENTS` is provided:

- Use it as the skill's purpose; do not ask for confirmation, proceed to Step 3

## Step 3 — Choose a name

Pick a short, lowercase, hyphenated command name that describes what the skill *does* (verb-noun form where possible, e.g. `audit-ci`, `new-service`, `doc-sync`). Avoid names that clash with built-in Claude Code commands (`/help`, `/clear`, `/memory`, etc.).

## Step 4 — Draft the skill file

Write a markdown file to `.claude/commands/<name>.md` with this structure:

```markdown
# <One sentence: what this skill does — no trailing period>

<If the skill accepts arguments, describe what $ARGUMENTS should contain.>
<If it takes no arguments, omit this paragraph.>

## Steps

<Numbered steps. Each step should be concrete and actionable.>
<Reference specific commands, file paths, or patterns from CLAUDE.md where relevant.>
<Include any decision branches (e.g. "if X, do Y; otherwise do Z").>

## Done criterion

<One or two sentences defining when the skill is complete and what to report.>

## Notes (optional)

<Edge cases, gotchas, or constraints. Omit the section if there is nothing non-obvious to say.>
```

## Step 5 — Report

Tell the user:

- The command name and file path created
- A one-line summary of what it does
- Any arguments it accepts
- Whether any assumptions were made that they might want to adjust
