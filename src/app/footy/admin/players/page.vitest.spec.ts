import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/Player');

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            listUsers: vi.fn(),
        },
    },
}));

vi.mock('next/headers', () => ({
    headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@mantine/core', () => ({
    Center: ({ children }: { children?: unknown }) => children,
    Container: ({ children }: { children?: unknown }) => children,
    Stack: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AdminPlayerList/AdminPlayerList', () => ({
    AdminPlayerList: function AdminPlayerList() { return null; },
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() { return null; },
}));

import { addPlayerInvite } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import AdminPlayersPage from '@/app/footy/admin/players/page';
import { auth } from '@/lib/auth';
import playerService from '@/services/Player';
import { findElement } from '@/tests/shared/reactTree';

const players = [{ id: 1, name: 'Alice' }];
const users = [
    { id: 'user-1', email: ' Alice@Example.com ' },
    { id: 'user-2', email: null },
];

describe('Admin Players page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (playerService.getAll as Mock).mockResolvedValue(players);
        (auth.api.listUsers as unknown as Mock).mockResolvedValue({ users });
    });

    it('fetches all players from playerService', async () => {
        await AdminPlayersPage();

        expect(playerService.getAll).toHaveBeenCalledTimes(1);
    });

    it('fetches the user list from auth.api.listUsers', async () => {
        await AdminPlayersPage();

        expect(auth.api.listUsers).toHaveBeenCalledWith(
            expect.objectContaining({ query: { limit: 1000 } }),
        );
    });

    it('builds the userEmails array from the user list, filtering out missing emails, preserving raw casing/whitespace', async () => {
        // userEmails is intentionally left unnormalized here — AdminPlayerList
        // normalizes it internally (via normalizeEmail) when building its own
        // lookup set, so the page doesn't need to pre-normalize this one.
        const result = await AdminPlayersPage();

        const list = findElement(result, 'AdminPlayerList');
        expect(list?.props.userEmails).toEqual([' Alice@Example.com ']);
    });

    it('builds the userIdByEmail map from the user list with normalized (trimmed, lowercased) keys', async () => {
        const result = await AdminPlayersPage();

        const list = findElement(result, 'AdminPlayerList');
        expect(list?.props.userIdByEmail).toEqual({ 'alice@example.com': 'user-1' });
    });

    it('defaults to an empty user list when listUsers resolves nullish', async () => {
        (auth.api.listUsers as unknown as Mock).mockResolvedValue(null);

        const result = await AdminPlayersPage();

        const list = findElement(result, 'AdminPlayerList');
        expect(list?.props.userEmails).toEqual([]);
        expect(list?.props.userIdByEmail).toEqual({});
    });

    it('passes players, userEmails, userIdByEmail, and the server actions to AdminPlayerList', async () => {
        const result = await AdminPlayersPage();

        const list = findElement(result, 'AdminPlayerList');
        expect(list?.props.players).toBe(players);
        expect(list?.props.onAddPlayerInvite).toBe(addPlayerInvite);
        expect(list?.props.onSendEmail).toBe(sendEmail);
    });

    it('handles service errors gracefully by propagating them', async () => {
        (playerService.getAll as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(AdminPlayersPage()).rejects.toThrow('DB failed');
    });
});
