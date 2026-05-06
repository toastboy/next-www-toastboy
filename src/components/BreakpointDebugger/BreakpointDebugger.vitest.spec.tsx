import { render, screen } from '@testing-library/react';
import { useMediaQuery } from '@mantine/hooks';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { BreakpointDebugger } from '@/components/BreakpointDebugger/BreakpointDebugger';
import { Wrapper } from '@/tests/components/lib/common';

vi.mock('@mantine/hooks', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@mantine/hooks')>();
    return { ...actual, useMediaQuery: vi.fn() };
});

const mockUseMediaQuery = useMediaQuery as MockedFunction<typeof useMediaQuery>;

/** Set up useMediaQuery to return the given tuple [isXs, isSm, isMd, isLg, isXl]. */
const mockBreakpoint = (isXs: boolean, isSm: boolean, isMd: boolean, isLg: boolean, isXl: boolean) => {
    mockUseMediaQuery
        .mockReturnValueOnce(isXs)
        .mockReturnValueOnce(isSm)
        .mockReturnValueOnce(isMd)
        .mockReturnValueOnce(isLg)
        .mockReturnValueOnce(isXl)
        .mockReturnValue(false);
};

describe('BreakpointDebugger', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockBreakpoint(false, false, false, false, false);
    });

    it('renders breakpoint information', () => {
        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/breakpoints/i)).toBeInTheDocument();
        expect(screen.getByText(/current/i)).toBeInTheDocument();
    });

    it('displays theme breakpoints as JSON', () => {
        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/"xs"/)).toBeInTheDocument();
        expect(screen.getByText(/"sm"/)).toBeInTheDocument();
    });

    it('shows XS breakpoint when below sm', () => {
        mockUseMediaQuery.mockReset();
        mockBreakpoint(true, false, false, false, false);

        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/XS \(<sm\)/)).toBeInTheDocument();
    });

    it('shows SM breakpoint when between sm and md', () => {
        mockUseMediaQuery.mockReset();
        mockBreakpoint(false, true, false, false, false);

        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/SM \(sm\)/)).toBeInTheDocument();
    });

    it('shows MD breakpoint when between md and lg', () => {
        mockUseMediaQuery.mockReset();
        mockBreakpoint(false, false, true, false, false);

        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/MD \(md\)/)).toBeInTheDocument();
    });

    it('shows LG breakpoint when between lg and xl', () => {
        mockUseMediaQuery.mockReset();
        mockBreakpoint(false, false, false, true, false);

        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/LG \(lg\)/)).toBeInTheDocument();
    });

    it('shows XL+ breakpoint when above xl', () => {
        mockUseMediaQuery.mockReset();
        mockBreakpoint(false, false, false, false, true);

        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/XL\+ \(xl\)/)).toBeInTheDocument();
    });

    it('shows Unknown when no media query matches', () => {
        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/Unknown/)).toBeInTheDocument();
    });

    it('logs the active breakpoint to the console', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
        mockUseMediaQuery.mockReset();
        mockBreakpoint(false, true, false, false, false);

        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(consoleSpy).toHaveBeenCalledWith('Active Breakpoint: SM (sm)');
        consoleSpy.mockRestore();
    });
});
