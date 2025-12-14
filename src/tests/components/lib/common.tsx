import { MantineProvider } from '@mantine/core';
import { screen } from '@testing-library/react';
import { ReactNode } from "react";

export const loaderClass = '.mantine-Loader-root';
export const errorText = 'failed to load';

interface WrapperProps {
    children?: ReactNode;
}

/**
 * Test wrapper component that provides Mantine theming context.
 * Wraps children with MantineProvider configured for light color scheme.
 *
 * @param props - The component props
 * @param props.children - React nodes to be wrapped with Mantine provider
 * @returns A React component with Mantine provider context
 */
export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <MantineProvider defaultColorScheme="light">
            {children}
        </MantineProvider>
    );
};

/**
 * Extracts and parses props from a rendered element's text content: each standard mock just outputs '<div>MyComponentProps: {JSON.stringify(props)}</div>'.
 *
 * This deliberately uses loose JSON parsing rather than zod schema validation to keep tests simple and focused on rendering behavior.
 *
 * @template T - The type of the props object to be returned.
 * @param id - The identifier prefix used to locate the element containing the props JSON string.
 * @returns The parsed props object of type T.
 * @throws Will fail test assertions if the element is not found or if the JSON is invalid.
 *
 * @example
 * const props = extractProps<MyComponentProps>('myComponent');
 */
export const extractMockProps = <T,>(id: string) => {
    const mockElements = screen.queryByText(new RegExp(`^${id}:`));
    expect(mockElements).not.toBeNull();
    const json = mockElements!.textContent?.replace(new RegExp(`^${id}:\\s*`), '');
    expect(json).toBeDefined();
    return JSON.parse(json ?? '') as T;
};
