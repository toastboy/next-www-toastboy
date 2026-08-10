import { MantineProvider } from '@mantine/core';
import { screen } from '@testing-library/react';
import type { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { vi } from 'vitest';

import { theme } from '@/theme';

/** The App Router instance returned by `useRouter`. */
type AppRouter = ReturnType<typeof useRouter>;

interface WrapperProps {
    children?: ReactNode;
}

/**
 * In-memory colour scheme manager for tests to avoid touching runtime
 * localStorage and triggering Node experimental warnings.
 */
const testColorSchemeManager = {
    get: (defaultValue: 'auto' | 'dark' | 'light') => defaultValue,
    set: () => undefined,
    subscribe: () => undefined,
    unsubscribe: () => undefined,
    clear: () => undefined,
};

/**
 * Test wrapper component that provides Mantine theming context.
 * Wraps children with MantineProvider configured for light color scheme,
 * using the app's actual theme (`@/theme`) so tests see the same
 * `theme.other.*` tokens and component defaults as production, rather than
 * Mantine's bare default theme.
 *
 * @param props - The component props
 * @param props.children - React nodes to be wrapped with Mantine provider
 * @returns A React component with Mantine provider context
 */
export const Wrapper = ({ children }: WrapperProps) => {
    return (
        <MantineProvider
            theme={theme}
            colorSchemeManager={testColorSchemeManager}
            defaultColorScheme="light"
        >
            {children}
        </MantineProvider>
    );
};

/**
 * Builds a complete mock App Router for `vi.mocked(useRouter).mockReturnValue`.
 * Every method is a fresh `vi.fn()` so tests only need to name the ones they
 * assert on. Centralising the shape here means a Next.js release that adds a
 * member to the router interface is a one-line fix rather than an edit to every
 * spec that mocks it.
 *
 * @param overrides - Router members to replace, typically the spy under test.
 * @returns A router object satisfying the full `useRouter` return type.
 *
 * @example
 * const push = vi.fn();
 * vi.mocked(useRouter).mockReturnValue(mockRouter({ push }));
 */
export const mockRouter = (overrides: Partial<AppRouter> = {}): AppRouter => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    bfcacheId: '',
    ...overrides,
});

/**
 * Extracts and parses props from a rendered element's text content. Each
 * standard mock is expected to render a single element whose text looks like:
 * `<div>{id}: {JSON.stringify(props)}</div>`, for example:
 * `<div>MyComponent: {"prop1":"value1"}</div>`.
 *
 * This deliberately uses loose JSON parsing rather than zod schema validation
 * to keep tests simple and focused on rendering behavior.
 *
 * @template T - The type of the props object to be returned.
 * @param id - The identifier prefix used to locate the element. The function
 * looks for text starting with `${id}:` and parses the JSON that follows.
 * @returns The parsed props object(s) of type T.
 * @throws Will fail test assertions if the element is not found or if the JSON
 * is invalid.
 *
 * @example
 * // For `<div>MyComponent: {"prop1":"value1"}</div>`:
 * const [props] = extractMockProps<MyComponentProps>('MyComponent');
 */
export const extractMockProps = <T,>(id: string) => {
    const mockElements = screen.getAllByText(new RegExp(`^${id}:`));
    const result: T[] = [];
    for (const element of mockElements) {
        const json = element.textContent?.replace(
            new RegExp(`^${id}:\\s*`),
            '',
        );
        expect(typeof json).toBe('string');
        expect(json.trim()).not.toBe('');
        result.push(JSON.parse(json) as T);
    }
    expect(result.length).toBeGreaterThan(0);
    return result;
};
