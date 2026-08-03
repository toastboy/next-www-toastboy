// Local, project-only rule — not worth publishing as a separate package.
// Enforces the "presentation layer is always Client Components" policy
// documented in CLAUDE.md. See require-use-client.test.mjs for coverage.
export const requireUseClient = {
    meta: {
        type: "problem",
        fixable: "code",
        schema: [],
        messages: {
            missing: "Presentation components under src/components must start with 'use client';",
            conflicting: "This file already starts with a '{{directive}}' directive, which conflicts with 'use client' (a module can't be both, e.g. a Server Actions module and a Client Component). Resolve manually.",
        },
    },
    create(context) {
        return {
            Program(node) {
                const first = node.body[0];
                // `directive` is set by the parser on directive-prologue
                // ExpressionStatements per the ESTree spec, regardless of
                // quote style. Fall back to inspecting the literal directly
                // for parsers that don't populate it, tolerating both
                // `Literal` (espree/typescript-eslint) and `StringLiteral`
                // (e.g. Babel-based parsers) node types — but only when the
                // literal's value is actually a string. A bare `Literal` node
                // can just as easily be a number, boolean, `null`, or regex
                // (e.g. `/foo/;` as a statement), none of which are directives.
                const isDirective = first?.type === "ExpressionStatement" && (
                    typeof first.directive === "string" ||
                    (["Literal", "StringLiteral"].includes(first.expression.type) &&
                        typeof first.expression.value === "string")
                );
                const directiveValue = isDirective ? (first.directive ?? first.expression.value) : undefined;

                if (directiveValue === "use client") {
                    return;
                }

                if (isDirective) {
                    // Some other directive (e.g. 'use server') already occupies the
                    // first-statement slot. Simply prepending 'use client' would
                    // leave both directives in the file, which Next.js rejects —
                    // report only and let a human resolve the conflict.
                    context.report({
                        node,
                        messageId: "conflicting",
                        data: { directive: directiveValue },
                    });
                    return;
                }

                context.report({
                    node,
                    messageId: "missing",
                    fix(fixer) {
                        // Insert before the first statement, not the Program
                        // node itself — Program's range includes any leading
                        // comments/shebang, and inserting there would place
                        // the directive ahead of those instead of after them.
                        if (first) {
                            return fixer.insertTextBefore(first, "'use client';\n\n");
                        }

                        // No statements at all (e.g. a comment-only file) —
                        // there's no `first` node to anchor to, so fall back
                        // to inserting after the last leading comment, if any.
                        const sourceCode = context.sourceCode ?? context.getSourceCode();
                        const comments = sourceCode.getAllComments();
                        const lastComment = comments[comments.length - 1];

                        return lastComment ?
                            fixer.insertTextAfter(lastComment, "\n'use client';\n") :
                            fixer.insertTextBefore(node, "'use client';\n\n");
                    },
                });
            },
        };
    },
};
