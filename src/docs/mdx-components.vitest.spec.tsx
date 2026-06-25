import { evaluate } from '@mdx-js/mdx';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';

import { Wrapper } from '@/tests/components/lib/common';

// mdx-components.tsx is a Next.js root-level convention file; @/ only covers src/
import { useMDXComponents } from '../../mdx-components';

// MDX compiles markdown links to _jsx(_components.a, ...) which routes through
// our override. Inline JSX <a> compiles to _jsx("a", ...) — a literal element
// name — and bypasses the override entirely. This helper drives the full pipeline.
async function renderMDX(source: string) {
    const { default: MDXContent } = await evaluate(source, {
        Fragment,
        jsx,
        jsxs,
        useMDXComponents,
    });
    render(
        <Wrapper>
            <MDXContent />
        </Wrapper>,
    );
}

// Renders the `a` override in isolation, matching what the MDX runtime does when
// it calls _components.a with resolved props (href, target, rel, children).
function AnchorWrapper({ anchorProps }: { anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> }) {
    const components = useMDXComponents();
    const AnchorOverride = components.a as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    return <AnchorOverride {...anchorProps} />;
}

function renderAnchor(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    render(
        <Wrapper>
            <AnchorWrapper anchorProps={props} />
        </Wrapper>,
    );
}

describe('useMDXComponents', () => {
    describe('a (link)', () => {
        it('adds noopener and noreferrer when target is _blank', () => {
            renderAnchor({ href: 'https://example.com', target: '_blank', children: 'Visit' });

            const link = screen.getByRole('link', { name: 'Visit' });
            expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
            expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
        });

        it('adds noopener and noreferrer for uppercase _BLANK variants', () => {
            renderAnchor({ href: 'https://example.com', target: '_BLANK', children: 'Visit' });

            const link = screen.getByRole('link', { name: 'Visit' });
            expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
            expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
        });

        it('does not add security tokens when target is not _blank', () => {
            renderAnchor({ href: 'https://example.com', children: 'Visit' });

            const link = screen.getByRole('link', { name: 'Visit' });
            expect(link).not.toHaveAttribute('rel');
        });

        it('does not duplicate noopener/noreferrer when already present in rel', () => {
            renderAnchor({
                href: 'https://example.com',
                target: '_blank',
                rel: 'noopener noreferrer',
                children: 'Visit',
            });

            const link = screen.getByRole('link', { name: 'Visit' });
            const tokens = (link.getAttribute('rel') ?? '').split(/\s+/);
            expect(tokens.filter(t => t === 'noopener')).toHaveLength(1);
            expect(tokens.filter(t => t === 'noreferrer')).toHaveLength(1);
        });

        it('produces no empty tokens when rel is an empty string', () => {
            renderAnchor({ href: 'https://example.com', target: '_blank', rel: '', children: 'Visit' });

            const rel = screen.getByRole('link', { name: 'Visit' }).getAttribute('rel') ?? '';
            expect(rel.split(' ').every(t => t.length > 0)).toBe(true);
        });

        it('produces no empty tokens when rel has surrounding whitespace', () => {
            renderAnchor({ href: 'https://example.com', target: '_blank', rel: '  sponsored  ', children: 'Visit' });

            const rel = screen.getByRole('link', { name: 'Visit' }).getAttribute('rel') ?? '';
            expect(rel.split(' ').every(t => t.length > 0)).toBe(true);
            expect(rel).toContain('sponsored');
        });

        it('deduplicates tokens that differ only in case', () => {
            renderAnchor({ href: 'https://example.com', target: '_blank', rel: 'NOOPENER Noreferrer', children: 'Visit' });

            const tokens = (screen.getByRole('link', { name: 'Visit' }).getAttribute('rel') ?? '').split(' ');
            expect(tokens.filter(t => t.toLowerCase() === 'noopener')).toHaveLength(1);
            expect(tokens.filter(t => t.toLowerCase() === 'noreferrer')).toHaveLength(1);
        });

        it('preserves other rel tokens alongside the security tokens', () => {
            renderAnchor({
                href: 'https://example.com',
                target: '_blank',
                rel: 'sponsored',
                children: 'Visit',
            });

            const link = screen.getByRole('link', { name: 'Visit' });
            const tokens = (link.getAttribute('rel') ?? '').split(/\s+/);
            expect(tokens).toContain('noopener');
            expect(tokens).toContain('noreferrer');
            expect(tokens).toContain('sponsored');
        });

        it('preserves the original casing of non-security tokens', () => {
            renderAnchor({
                href: 'https://example.com',
                target: '_blank',
                rel: 'Sponsored',
                children: 'Visit',
            });

            const tokens = (screen.getByRole('link', { name: 'Visit' }).getAttribute('rel') ?? '').split(/\s+/);
            expect(tokens).toContain('Sponsored');
            expect(tokens).not.toContain('sponsored');
        });

        it('is applied for markdown links routed through the MDX pipeline', async () => {
            await renderMDX('[Visit](https://example.com)');

            expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute(
                'href',
                'https://example.com',
            );
        });

        it('cannot be overridden by a caller-supplied a component', () => {
            // Callers can pass components to useMDXComponents but must not be able to
            // replace the a override and strip the noopener/noreferrer hardening.
            const components = useMDXComponents({
                a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
                    <a {...props}>{children}</a>,
            });
            const AnchorOverride = components.a as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
            render(
                <Wrapper>
                    <AnchorOverride href="https://example.com" target="_blank">Visit</AnchorOverride>
                </Wrapper>,
            );

            const link = screen.getByRole('link', { name: 'Visit' });
            expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
            expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
        });
    });

    describe('headings (h1/h2/h3)', () => {
        it('h1 renders as a level-1 heading', async () => {
            await renderMDX('# Hello World');

            expect(screen.getByRole('heading', { level: 1, name: 'Hello World' })).toBeInTheDocument();
        });

        it('h2 renders as a level-2 heading', async () => {
            await renderMDX('## Subtitle');

            expect(screen.getByRole('heading', { level: 2, name: 'Subtitle' })).toBeInTheDocument();
        });

        it('h3 renders as a level-3 heading', async () => {
            await renderMDX('### Section');

            expect(screen.getByRole('heading', { level: 3, name: 'Section' })).toBeInTheDocument();
        });
    });

    describe('lists (ul/ol/li)', () => {
        it('unordered list renders all items', async () => {
            await renderMDX('- Alpha\n- Beta\n- Gamma');

            expect(screen.getByRole('list')).toBeInTheDocument();
            const items = screen.getAllByRole('listitem');
            expect(items).toHaveLength(3);
            expect(items[0]).toHaveTextContent('Alpha');
            expect(items[1]).toHaveTextContent('Beta');
            expect(items[2]).toHaveTextContent('Gamma');
        });

        it('ordered list renders all items', async () => {
            await renderMDX('1. First\n2. Second\n3. Third');

            expect(screen.getByRole('list')).toBeInTheDocument();
            const items = screen.getAllByRole('listitem');
            expect(items).toHaveLength(3);
            expect(items[0]).toHaveTextContent('First');
            expect(items[1]).toHaveTextContent('Second');
            expect(items[2]).toHaveTextContent('Third');
        });
    });

    describe('pre/code (fenced code blocks)', () => {
        it('preserves the language class through the MDX pipeline', async () => {
            await renderMDX('```js\nconst x = 1;\n```');

            expect(document.querySelector('.language-js')).not.toBeNull();
        });

        it('preserves code content', async () => {
            await renderMDX('```js\nconst x = 1;\n```');

            expect(screen.getByText(/const x = 1/)).toBeInTheDocument();
        });

        it('renders inline code without a language class', async () => {
            await renderMDX('Use `console.log` for debugging.');

            expect(screen.getByText('console.log')).toBeInTheDocument();
            expect(document.querySelector('[class*="language-"]')).toBeNull();
        });

        it('code override returns a plain native element for language-tagged content', () => {
            // pre extracts child.props.children directly and never renders the code element.
            // If code wrapped language-tagged content in a Mantine component, a future change
            // that passes children through would produce double-wrapped markup. Render the
            // override directly to assert it stays a plain native element.
            const CodeOverride = useMDXComponents().code as React.ComponentType<React.HTMLAttributes<HTMLElement>>;
            render(
                <Wrapper>
                    <CodeOverride className="language-js">const x = 1;</CodeOverride>
                </Wrapper>,
            );

            const codeEl = document.querySelector('code.language-js');
            expect(codeEl).not.toBeNull();
            expect(codeEl?.tagName.toLowerCase()).toBe('code');
        });
    });
});
