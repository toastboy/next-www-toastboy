// @vitest-environment happy-dom
import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

vi.mock('@mantine/core', () => ({
    Alert: ({ children, title }: { children?: ReactNode; title?: string }) => (
        <div role="alert">
            <p>{title}</p>
            {children}
        </div>
    ),
    Button: ({ children, onClick }: { children?: ReactNode; onClick?: () => void }) => (
        <button onClick={onClick}>{children}</button>
    ),
    Flex: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@tabler/icons-react', () => ({
    IconAlertTriangle: () => null,
}));

import ErrorPage from '@/app/error';

describe('ErrorPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('captures the error with client layer context on mount', () => {
        const error = new Error('boom');
        render(<ErrorPage error={error} reset={vi.fn()} />);

        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(error, {
            layer: 'client',
            component: 'ErrorPage',
            route: '/app/error',
        });
    });

    it('renders the public-facing error message', () => {
        render(<ErrorPage error={new Error('boom')} reset={vi.fn()} />);

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });

    it('calls reset when the Try again button is clicked', async () => {
        const reset = vi.fn();
        const user = userEvent.setup();
        render(<ErrorPage error={new Error('boom')} reset={reset} />);

        await user.click(screen.getByRole('button', { name: /try again/i }));

        expect(reset).toHaveBeenCalledTimes(1);
    });
});
