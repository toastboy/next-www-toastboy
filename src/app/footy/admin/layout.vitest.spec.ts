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

import AdminLayout from '@/app/footy/admin/layout';
import { getUserRole } from '@/lib/auth.server';

describe('Admin layout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        headersMock.mockResolvedValue(new Headers());
    });

    it('renders children when the user is an admin', async () => {
        (getUserRole as Mock).mockResolvedValue('admin');

        const result = await AdminLayout({ children: 'admin content' });

        expect(result).toBe('admin content');
        expect(redirect).not.toHaveBeenCalled();
    });

    it('redirects to admin sign-in preserving the current pathname when the user is not an admin', async () => {
        (getUserRole as Mock).mockResolvedValue('user');
        headersMock.mockResolvedValue(new Headers({ 'x-pathname': '/footy/admin/money' }));

        await expect(
            AdminLayout({ children: 'admin content' }),
        ).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/auth/signin?admin=true&redirect=%2Ffooty%2Fadmin%2Fmoney');
    });

    it('defaults the redirect target to /footy/admin when no pathname header is present', async () => {
        (getUserRole as Mock).mockResolvedValue('none');
        headersMock.mockResolvedValue(new Headers());

        await expect(
            AdminLayout({ children: 'admin content' }),
        ).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/auth/signin?admin=true&redirect=%2Ffooty%2Fadmin');
    });
});
