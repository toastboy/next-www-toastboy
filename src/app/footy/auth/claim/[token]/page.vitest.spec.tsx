import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/actions/claimPlayerInvitation', () => ({
    claimPlayerInvitation: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

vi.mock('@mantine/core', () => ({
    Notification: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@tabler/icons-react', () => ({
    IconX: () => null,
}));

vi.mock('@/components/ClaimSignup/ClaimSignup', () => ({
    ClaimSignup: vi.fn(() => null),
}));

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';
import { ValidationError } from '@/lib/errors';

import Page from './page';

describe('Claim Sign Up page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('looks up the invitation and renders ClaimSignup with the resolved details', async () => {
        vi.mocked(claimPlayerInvitation).mockResolvedValue({
            name: 'Alice',
            email: 'alice@example.com',
            token: 'tok',
        });

        const element = await Page({ params: Promise.resolve({ token: 'tok' }) });
        renderToStaticMarkup(element);

        expect(claimPlayerInvitation).toHaveBeenCalledWith('tok');
        expect(ClaimSignup).toHaveBeenCalledWith(
            { name: 'Alice', email: 'alice@example.com', token: 'tok' },
            undefined,
        );
        expect(captureUnexpectedErrorMock).not.toHaveBeenCalled();
    });

    it('renders the public error message and does not render ClaimSignup when the invitation is invalid', async () => {
        vi.mocked(claimPlayerInvitation).mockRejectedValue(
            new ValidationError('Invitation is missing a player reference.', {
                publicMessage: 'This invitation link is invalid.',
            }),
        );

        const element = await Page({ params: Promise.resolve({ token: 'bad-tok' }) });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('This invitation link is invalid.');
        expect(ClaimSignup).not.toHaveBeenCalled();
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(ValidationError),
            expect.objectContaining({
                layer: 'server',
                action: 'claimPlayerInvitation',
                component: 'ClaimSignup',
                route: '/footy/auth/claim/[token]',
            }),
        );
    });

    it('captures unexpected errors and falls back to a generic message', async () => {
        vi.mocked(claimPlayerInvitation).mockRejectedValue(new Error('Database timeout'));

        const element = await Page({ params: Promise.resolve({ token: 'bad-tok' }) });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('This invitation link is invalid.');
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                layer: 'server',
                action: 'claimPlayerInvitation',
                component: 'ClaimSignup',
                route: '/footy/auth/claim/[token]',
            }),
        );
    });
});
