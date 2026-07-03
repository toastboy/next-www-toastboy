/**
 * Minimal shape of a React element as produced by `React.createElement`/JSX,
 * sufficient for walking an unrendered element tree in tests — e.g. the
 * return value of a Server Component called directly, before any DOM
 * rendering has happened.
 */
export interface AnyElement {
    type: unknown;
    props: Record<string, unknown>;
}

/**
 * Shape shared by plain function components and the wrapper objects produced
 * by `React.memo`/`React.forwardRef`, enough to recover a display name.
 */
interface ComponentTypeLike {
    displayName?: string;
    name?: string;
    /** Inner component wrapped by `React.memo`. */
    type?: unknown;
    /** Render function wrapped by `React.forwardRef`. */
    render?: unknown;
}

/**
 * Resolves the display name of a JSX element `type`, looking through
 * `React.memo`/`React.forwardRef` wrapper objects to find the name of the
 * component they wrap.
 *
 * Limitation: a component mocked as a bare `vi.fn(() => null)` has no usable
 * name — `vi.fn()`'s `.name` is a generic value like `"Mock"`, not the
 * component's name, and it has no `.displayName` unless one is set
 * explicitly. Such mocks will never match here. Give the mock a real name
 * instead, either `vi.fn(() => null)` assigned `.displayName`, or (the
 * convention used throughout this codebase) a named function expression:
 * `vi.mock('@/components/Foo/Foo', () => ({ Foo: function Foo() { return null; } }))`.
 *
 * @param type - The `type` field of a JSX element.
 * @returns The resolved display name, or `undefined` if none can be found
 * (e.g. host elements like `'div'`, fragments, or unnamed mocks).
 */
const resolveComponentName = (type: unknown): string | undefined => {
    if (typeof type === 'function') {
        const fn = type as ComponentTypeLike;
        return fn.displayName ?? fn.name;
    }

    if (type && typeof type === 'object') {
        const wrapper = type as ComponentTypeLike;
        return wrapper.displayName ??
            resolveComponentName(wrapper.type) ??
            resolveComponentName(wrapper.render);
    }

    return undefined;
};

/**
 * Depth-first searches an unrendered React element tree for the first element
 * whose component `type` resolves to a matching name (see
 * {@link resolveComponentName} for exactly how the name is resolved,
 * including its `vi.fn()` limitation).
 *
 * Host elements (e.g. `'div'`), fragments, and arrays of siblings are all
 * traversed transparently via their `children` without being matched on
 * themselves, so callers only need to name the component they're looking for.
 *
 * @param node - Root of the (sub)tree to search; typically a Server
 * Component's return value, or a `.props.children` value during recursion.
 * @param name - The display name to match.
 * @returns The first matching element, or `null` if none is found.
 */
export const findElement = (node: unknown, name: string): AnyElement | null => {
    if (!node || typeof node !== 'object') return null;

    if (Array.isArray(node)) {
        for (const child of node) {
            const found = findElement(child, name);
            if (found) return found;
        }
        return null;
    }

    const el = node as AnyElement;
    if (resolveComponentName(el.type) === name) return el;

    const children = (el.props as { children?: unknown } | undefined)?.children;
    return findElement(children, name);
};
