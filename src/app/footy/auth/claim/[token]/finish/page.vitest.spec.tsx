import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

const { captureUnexpectedErrorMock, redirectMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
    redirectMock: vi.fn(() => {
        throw new Error('redirected');
    }),
}));

vi.mock('@/actions/claimPlayerInvitation', () => ({
    finalizePlayerInvitationClaim: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

vi.mock('next/navigation', () => ({
    redirect: redirectMock,
}));

vi.mock('@mantine/core', () => ({
    Anchor: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
    Notification: ({ children }: { children?: ReactNode }) => (
        <div>{children}</div>
    ),
    Stack: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@tabler/icons-react', () => ({
    IconX: () => null,
}));

import { finalizePlayerInvitationClaim } from '@/actions/claimPlayerInvitation';
import { ValidationError } from '@/lib/errors';

import Page from './page';

describe('Claim finalize page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('finalizes the claim and redirects to the profile page on success', async () => {
        vi.mocked(finalizePlayerInvitationClaim).mockResolvedValue(undefined);

        await expect(
            Page({ params: Promise.resolve({ token: 'tok' }) }),
        ).rejects.toThrow('redirected');

        expect(finalizePlayerInvitationClaim).toHaveBeenCalledWith('tok');
        expect(redirectMock).toHaveBeenCalledWith('/footy/profile');
        expect(captureUnexpectedErrorMock).not.toHaveBeenCalled();
    });

    it('renders the public error message and a link home when finalization fails', async () => {
        vi.mocked(finalizePlayerInvitationClaim).mockRejectedValue(
            new ValidationError('Invitation is missing a player reference.', {
                publicMessage: 'This invitation link is invalid.',
            }),
        );

        const element = await Page({
            params: Promise.resolve({ token: 'bad-tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('This invitation link is invalid.');
        expect(html).toContain('Return to the home page');
        expect(redirectMock).not.toHaveBeenCalled();
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(ValidationError),
            expect.objectContaining({
                layer: 'server',
                action: 'finalizePlayerInvitationClaim',
                component: 'ClaimSignup',
                route: '/footy/auth/claim/[token]/finish',
            }),
        );
    });

    it('captures unexpected errors and falls back to a generic message', async () => {
        vi.mocked(finalizePlayerInvitationClaim).mockRejectedValue(
            new Error('Database timeout'),
        );

        const element = await Page({
            params: Promise.resolve({ token: 'bad-tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('Unable to finalize invitation.');
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                layer: 'server',
                action: 'finalizePlayerInvitationClaim',
                component: 'ClaimSignup',
                route: '/footy/auth/claim/[token]/finish',
            }),
        );
    });
});
