import { render, screen } from '@testing-library/react';

import { BreakpointDebugger } from '@/components/BreakpointDebugger/BreakpointDebugger';

import { Wrapper } from './lib/common';

describe('BreakpointDebugger', () => {
    it('renders breakpoint information', () => {
        render(
            <Wrapper>
                <BreakpointDebugger />
            </Wrapper>,
        );

        expect(screen.getByText(/breakpoints/i)).toBeInTheDocument();
        expect(screen.getByText(/current/i)).toBeInTheDocument();
    });
});
