import { forwardRef, memo } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { findElement } from '@/tests/shared/reactTree';

function NamedFunction() { return null; }

describe('findElement', () => {
    it('matches a plain named function component', () => {
        const tree = { type: NamedFunction, props: { children: null } };

        expect(findElement(tree, 'NamedFunction')).toBe(tree);
    });

    it('matches via an explicit displayName over the function name', () => {
        const Component = () => null;
        Component.displayName = 'CustomName';
        const tree = { type: Component, props: { children: null } };

        expect(findElement(tree, 'CustomName')).toBe(tree);
        expect(findElement(tree, Component.name)).toBeNull();
    });

    it('traverses host elements and arrays of children to find a nested match', () => {
        const target = { type: NamedFunction, props: { children: null } };
        const tree = {
            type: 'div',
            props: {
                children: [
                    { type: 'span', props: { children: 'text' } },
                    target,
                ],
            },
        };

        expect(findElement(tree, 'NamedFunction')).toBe(target);
    });

    it('returns null when nothing matches', () => {
        const tree = { type: 'div', props: { children: 'just text' } };

        expect(findElement(tree, 'NamedFunction')).toBeNull();
    });

    it('matches a React.memo-wrapped component by its inner component name', () => {
        const Inner = () => null;
        const Wrapped = memo(Inner);
        const tree = { type: Wrapped, props: { children: null } };

        expect(findElement(tree, 'Inner')).toBe(tree);
    });

    it('matches a React.memo-wrapped component via displayName set on the wrapper', () => {
        const Wrapped = memo(() => null);
        Wrapped.displayName = 'MemoWrapper';
        const tree = { type: Wrapped, props: { children: null } };

        expect(findElement(tree, 'MemoWrapper')).toBe(tree);
    });

    it('matches a React.forwardRef-wrapped component by its render function name', () => {
        function InnerRender() { return null; }
        const Wrapped = forwardRef(InnerRender);
        const tree = { type: Wrapped, props: { children: null } };

        expect(findElement(tree, 'InnerRender')).toBe(tree);
    });

    it('does not match a bare vi.fn() mock without a displayName (documented limitation)', () => {
        const MockedComponent = vi.fn(() => null);
        const tree = { type: MockedComponent, props: { children: null } };

        expect(findElement(tree, 'MockedComponent')).toBeNull();
    });

    it('matches a vi.fn() mock once a displayName is assigned', () => {
        const MockedComponent = Object.assign(vi.fn(() => null), { displayName: 'MockedComponent' });
        const tree = { type: MockedComponent, props: { children: null } };

        expect(findElement(tree, 'MockedComponent')).toBe(tree);
    });
});
