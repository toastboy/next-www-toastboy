import assert from "node:assert/strict";

import { RuleTester } from "eslint";

import { requireUseClient } from "./require-use-client.mjs";

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: { ecmaFeatures: { jsx: true } },
    },
});

ruleTester.run("require-use-client", requireUseClient, {
    valid: [
        "'use client';\n\nexport const Foo = () => null;",
        '"use client";\n\nexport const Foo = () => null;',
        "'use client';\n",
    ],
    invalid: [
        {
            code: "export const Foo = () => null;",
            output: "'use client';\n\nexport const Foo = () => null;",
            errors: [{ messageId: "missing" }],
        },
        {
            // A leading comment (e.g. a copyright header) must stay above the
            // inserted directive, not be pushed below it.
            code: "// Copyright header\nexport const Foo = () => null;",
            output: "// Copyright header\n'use client';\n\nexport const Foo = () => null;",
            errors: [{ messageId: "missing" }],
        },
        {
            // A conflicting directive (e.g. 'use server') already occupies the
            // first-statement slot. Prepending 'use client' would leave both
            // directives in the file, which Next.js rejects, so this must be
            // reported with NO autofix — a human has to resolve it.
            code: "'use server';\n\nexport const Foo = () => null;",
            output: null,
            errors: [{ messageId: "conflicting", data: { directive: "use server" } }],
        },
        {
            // No statements at all — falls back to inserting before Program.
            code: "// just a comment\n",
            output: "// just a comment\n'use client';\n\n",
            errors: [{ messageId: "missing" }],
        },
        {
            // A regex literal statement shares the `Literal` node type with
            // real string-literal directives, but its value isn't a string —
            // it must be treated as ordinary code (autofix as normal), not
            // mistaken for a conflicting directive.
            code: "/foo/;\n\nexport const Foo = () => null;",
            output: "'use client';\n\n/foo/;\n\nexport const Foo = () => null;",
            errors: [{ messageId: "missing" }],
        },
        {
            // Same reasoning for other non-string `Literal` values.
            code: "42;\n\nexport const Foo = () => null;",
            output: "'use client';\n\n42;\n\nexport const Foo = () => null;",
            errors: [{ messageId: "missing" }],
        },
    ],
});

// Babel-based parsers represent string literals as `StringLiteral` rather
// than espree's `Literal`, so these branches can't be exercised via RuleTester
// (which parses with espree here) without adding a Babel parser dependency
// just for this. Exercise them directly against synthetic nodes instead.
{
    let reported = false;
    const listeners = requireUseClient.create({ report: () => { reported = true; } });

    listeners.Program({
        body: [{
            type: "ExpressionStatement",
            expression: { type: "StringLiteral", value: "use client" },
        }],
    });

    assert.equal(reported, false, "a StringLiteral 'use client' directive should be recognised");
}
{
    let reportedMessageId;
    const listeners = requireUseClient.create({
        report: ({ messageId }) => { reportedMessageId = messageId; },
    });

    listeners.Program({
        body: [{
            type: "ExpressionStatement",
            expression: { type: "StringLiteral", value: "use server" },
        }],
    });

    assert.equal(
        reportedMessageId,
        "conflicting",
        "a StringLiteral 'use server' directive should be reported as conflicting, not autofixed over",
    );
}

console.log("require-use-client: all rule tests passed");
