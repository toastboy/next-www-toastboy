import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockHeaders, mockGetSession, mockUpdateUser } = vi.hoisted(() => ({
    mockHeaders: vi.fn(),
    mockGetSession: vi.fn(),
    mockUpdateUser: vi.fn(),
}));

vi.mock('next/headers', () => ({
    headers: mockHeaders,
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: mockGetSession,
            updateUser: mockUpdateUser,
        },
    },
}));

import authService from '@/services/Auth';

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (mockHeaders as Mock).mockResolvedValue(new Headers({ 'x-test': '1' }));
    });

    describe('getSessionUser', () => {
        it('should return current session user when session exists', async () => {
            (mockGetSession as Mock).mockResolvedValueOnce({
                user: {
                    id: 'u-1',
                    email: 'player@example.com',
                    playerId: 7,
                },
            });

            const user = await authService.getSessionUser();

            expect(user).toEqual({
                id: 'u-1',
                email: 'player@example.com',
                playerId: 7,
            });
            expect(mockGetSession).toHaveBeenCalledTimes(1);
        });

        it('should return null when there is no session', async () => {
            (mockGetSession as Mock).mockResolvedValueOnce(null);

            const user = await authService.getSessionUser();

            expect(user).toBeNull();
        });

        it('should rethrow errors from auth API', async () => {
            (mockGetSession as Mock).mockRejectedValueOnce(new Error('session failed'));

            await expect(authService.getSessionUser()).rejects.toThrow('session failed');
        });
    });

    describe('updateCurrentUser', () => {
        it('should call updateUser with the provided payload and headers', async () => {
            const response = { ok: true };
            (mockUpdateUser as Mock).mockResolvedValueOnce(response);

            await expect(authService.updateCurrentUser({ playerId: 9 })).resolves.toEqual(response);
            expect(mockUpdateUser).toHaveBeenCalledTimes(1);
            expect((mockUpdateUser as Mock).mock.calls[0][0]).toMatchObject({
                body: {
                    playerId: 9,
                },
            });
        });

        it('should rethrow errors from updateUser', async () => {
            (mockUpdateUser as Mock).mockRejectedValueOnce(new Error('update failed'));

            await expect(authService.updateCurrentUser({ playerId: 9 })).rejects.toThrow('update failed');
        });
    });
});
