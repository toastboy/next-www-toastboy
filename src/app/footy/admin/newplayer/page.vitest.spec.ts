import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/Player');

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() { return null; },
}));

vi.mock('@/components/NewPlayerForm/NewPlayerForm', () => ({
    NewPlayerForm: function NewPlayerForm() { return null; },
}));

import { createPlayer } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import NewPlayerPage from '@/app/footy/admin/newplayer/page';
import playerService from '@/services/Player';
import { findElement } from '@/tests/shared/reactTree';

describe('Admin New Player page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls playerService.getAll to fetch existing players', async () => {
        (playerService.getAll as Mock).mockResolvedValue([]);

        await NewPlayerPage();

        expect(playerService.getAll).toHaveBeenCalledTimes(1);
    });

    it('passes the existing players list to NewPlayerForm', async () => {
        const players = [{ id: 1, name: 'Alice' }];
        (playerService.getAll as Mock).mockResolvedValue(players);

        const result = await NewPlayerPage();

        const form = findElement(result, 'NewPlayerForm');
        expect(form?.props.players).toBe(players);
        expect(form?.props.onCreatePlayer).toBe(createPlayer);
        expect(form?.props.onSendEmail).toBe(sendEmail);
    });

    it('handles service errors gracefully by propagating them', async () => {
        (playerService.getAll as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(NewPlayerPage()).rejects.toThrow('DB failed');
    });
});
