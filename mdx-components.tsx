import { Anchor, Code, List, ListItem, Text, Title } from '@mantine/core';
import type { MDXComponents } from 'mdx/types';
import React from 'react';

function buildSafeRel(target: string | undefined, rel: string | undefined): string | undefined {
    if (target?.toLowerCase() !== '_blank') return rel;
    const required = ['noopener', 'noreferrer'];
    const existing = (rel?.split(/\s+/) ?? [])
        .filter(Boolean)
        .filter(t => !required.includes(t.toLowerCase()));
    return [...required, ...existing].join(' ');
}

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
    return {
        h1: ({ children, ...props }) => <Title order={1} mb="md" {...props}>{children}</Title>,
        h2: ({ children, ...props }) => <Title order={2} mt="xl" mb="sm" {...props}>{children}</Title>,
        h3: ({ children, ...props }) => <Title order={3} mt="lg" mb="xs" {...props}>{children}</Title>,
        p: ({ children, ...props }) => <Text mb="sm" {...props}>{children}</Text>,
        ul: ({ children, ...props }) => <List mb="sm" {...props}>{children}</List>,
        ol: ({ children, ...props }) => <List type="ordered" mb="sm" {...props}>{children}</List>,
        li: ({ children, ...props }) => <ListItem {...props}>{children}</ListItem>,
        // Fenced code blocks arrive as <pre><code className="language-*">…</code></pre>.
        // pre owns the block rendering: it unwraps the inner code element to merge the
        // language class and pass the raw content to Code block.
        pre: ({ children, className: preClassName, ...preProps }: React.HTMLAttributes<HTMLPreElement>) => {
            const child = React.isValidElement(children) ?
                (children as React.ReactElement<React.HTMLAttributes<HTMLElement>>) :
                null;
            const className = [preClassName, child?.props.className].filter(Boolean).join(' ') || undefined;
            return (
                <Code block className={className} {...preProps}>
                    {child?.props.children ?? children}
                </Code>
            );
        },
        // For fenced code blocks, code returns a plain element so pre can own the
        // block rendering without risk of double-wrapping if the tree is ever walked
        // differently. Inline code (no language class) gets the Mantine Code component.
        code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
            if (className?.split(/\s+/).some(c => c.startsWith('language-'))) {
                return <code className={className} {...props}>{children}</code>;
            }
            return <Code className={className} {...props}>{children}</Code>;
        },
        ...components,
        // a is placed after ...components so callers cannot override the
        // noopener/noreferrer hardening applied to target="_blank" links.
        a: ({ target, rel, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
            <Anchor target={target} rel={buildSafeRel(target, rel)} {...props} />
        ),
    };
}
