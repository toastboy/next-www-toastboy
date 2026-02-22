import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorPage from '@/app/error';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

/**
 * Renders the application-level error component with test-friendly defaults.
 *
 * @param error Error passed into the app boundary component.
 * @param reset Reset callback expected to be triggered from the retry button.
 */
const renderErrorPage = (error: Error, reset: () => void) => {
    render(
        <Wrapper>
            <ErrorPage error={error} reset={reset} />
        </Wrapper>,
    );
};

describe('ErrorPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('captures unexpected errors when the boundary renders', () => {
        const reset = vi.fn();
        const error = new Error('Boundary exploded');
        renderErrorPage(error, reset);

        expect(screen.getByText('Boundary exploded')).toBeInTheDocument();
        expect(captureUnexpectedError).toHaveBeenCalledTimes(1);
        expect(captureUnexpectedError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({
                layer: 'client',
                component: 'ErrorPage',
                route: '/app/error',
            }),
        );
    });

    it('invokes reset when retry is clicked', async () => {
        const user = userEvent.setup();
        const reset = vi.fn();
        renderErrorPage(new Error('Retry me'), reset);

        await user.click(screen.getByRole('button', { name: 'Try again' }));

        expect(reset).toHaveBeenCalledTimes(1);
    });
});
