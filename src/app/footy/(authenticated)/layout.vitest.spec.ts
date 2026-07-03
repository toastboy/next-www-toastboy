import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth.server');

vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => { throw new Error('redirected'); }),
}));

const { headersMock } = vi.hoisted(() => ({
    headersMock: vi.fn(),
}));
vi.mock('next/headers', () => ({
    headers: headersMock,
}));

import { redirect } from 'next/navigation';

import AuthenticatedLayout from '@/app/footy/(authenticated)/layout';
import { getUserRole } from '@/lib/auth.server';

describe('Authenticated layout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        headersMock.mockResolvedValue(new Headers());
    });

    it('renders children when the user is authenticated', async () => {
        (getUserRole as Mock).mockResolvedValue('user');

        const result = await AuthenticatedLayout({ children: 'protected content' });

        expect(result).toBe('protected content');
        expect(redirect).not.toHaveBeenCalled();
    });

    it('redirects to sign-in preserving the current pathname when the user is not authenticated', async () => {
        (getUserRole as Mock).mockResolvedValue('none');
        headersMock.mockResolvedValue(new Headers({ 'x-pathname': '/footy/admin/money' }));

        await expect(
            AuthenticatedLayout({ children: 'protected content' }),
        ).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/auth/signin?redirect=%2Ffooty%2Fadmin%2Fmoney');
    });

    it('defaults the redirect target to /footy/profile when no pathname header is present', async () => {
        (getUserRole as Mock).mockResolvedValue('none');
        headersMock.mockResolvedValue(new Headers());

        await expect(
            AuthenticatedLayout({ children: 'protected content' }),
        ).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/auth/signin?redirect=%2Ffooty%2Fprofile');
    });
});
