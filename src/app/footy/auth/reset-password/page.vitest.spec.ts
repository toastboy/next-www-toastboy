import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@mantine/core', () => ({
    Notification: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@tabler/icons-react', () => ({
    IconX: () => null,
}));

vi.mock('@/components/PasswordResetForm/PasswordResetForm', () => ({
    PasswordResetForm: vi.fn(() => null),
}));

import Page from '@/app/footy/auth/reset-password/page';
import { PasswordResetForm } from '@/components/PasswordResetForm/PasswordResetForm';

describe('Reset Password page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders PasswordResetForm when a token is present in searchParams', async () => {
        const element = await Page({ searchParams: Promise.resolve({ token: 'reset-token' }) });
        renderToStaticMarkup(element);

        expect(PasswordResetForm).toHaveBeenCalledWith({ token: 'reset-token' }, undefined);
    });

    it('renders an error notification when the token is absent', async () => {
        const element = await Page({ searchParams: Promise.resolve({}) });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('Password reset link is missing or invalid.');
        expect(PasswordResetForm as Mock).not.toHaveBeenCalled();
    });

    it('renders an error notification when searchParams is undefined', async () => {
        const element = await Page({ searchParams: undefined });
        const html = renderToStaticMarkup(element);

        expect(html).toContain('Password reset link is missing or invalid.');
        expect(PasswordResetForm as Mock).not.toHaveBeenCalled();
    });
});
