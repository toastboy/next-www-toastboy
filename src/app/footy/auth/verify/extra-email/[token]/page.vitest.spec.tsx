import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';

const { captureUnexpectedErrorMock, redirectMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
    redirectMock: vi.fn(() => {
        throw new Error('redirected');
    }),
}));

vi.mock('@/actions/verifyEmail', () => ({
    verifyEmail: vi.fn(),
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

import { verifyEmail } from '@/actions/verifyEmail';
import { ConflictError } from '@/lib/errors';

import Page from './page';

describe('Extra email verify page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('verifies the email and redirects to the profile page on success', async () => {
        vi.mocked(verifyEmail).mockResolvedValue({
            email: 'sam@example.com',
            playerId: '7',
            verificationId: 'v1',
        });

        await expect(
            Page({ params: Promise.resolve({ token: 'tok' }) }),
        ).rejects.toThrow('redirected');

        expect(verifyEmail).toHaveBeenCalledWith('tok');
        expect(redirectMock).toHaveBeenCalledWith('/footy/profile');
        expect(captureUnexpectedErrorMock).not.toHaveBeenCalled();
    });

    it('renders the public error message and a link to the profile when verification fails', async () => {
        vi.mocked(verifyEmail).mockRejectedValue(
            new ConflictError('Verification has already been used.', {
                publicMessage: 'This link has already been used.',
            }),
        );

        const element = await Page({
            params: Promise.resolve({ token: 'bad-tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('This link has already been used.');
        expect(html).toContain('Return to your profile');
        expect(redirectMock).not.toHaveBeenCalled();
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(ConflictError),
            expect.objectContaining({
                layer: 'server',
                action: 'verifyEmail',
                component: 'ExtraEmailVerify',
                route: '/footy/auth/verify/extra-email/[token]',
            }),
        );
    });

    it('captures unexpected errors and falls back to a generic message', async () => {
        vi.mocked(verifyEmail).mockRejectedValue(new Error('Database timeout'));

        const element = await Page({
            params: Promise.resolve({ token: 'bad-tok' }),
        });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('Unable to verify email.');
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(Error),
            expect.objectContaining({
                layer: 'server',
                action: 'verifyEmail',
                component: 'ExtraEmailVerify',
                route: '/footy/auth/verify/extra-email/[token]',
            }),
        );
    });
});
