import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
}));

vi.mock('@mantine/core', () => ({
    Container: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() { return null; },
}));

vi.mock('@/components/PickerForm/PickerForm', () => ({
    PickerForm: function PickerForm() { return null; },
}));

import { setGameEnabled } from '@/actions/setGameEnabled';
import { SubmitPicker } from '@/actions/submitPicker';
import PickerPage from '@/app/footy/admin/picker/page';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import { findElement } from '@/tests/shared/reactTree';
import { FootyChannel } from '@/types/FootyChannel';

const currentGame = { id: 1249 };
const players = [
    { playerId: 1, name: 'Alice' },
    { playerId: 2, name: 'Bob' },
];

describe('Admin Picker page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (gameDayService.getCurrent as Mock).mockResolvedValue(currentGame);
        (outcomeService.getAdminByGameDay as Mock).mockResolvedValue(players);
        (outcomeService.getGamesPlayedByPlayer as Mock).mockImplementation((playerId: number) =>
            Promise.resolve(playerId * 10));
    });

    it('calls notFound when there is no current game', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue(null);

        await expect(PickerPage()).rejects.toThrow('not_found');
        expect(outcomeService.getAdminByGameDay).not.toHaveBeenCalled();
    });

    it('fetches admin outcomes for the current game day', async () => {
        await PickerPage();

        expect(outcomeService.getAdminByGameDay).toHaveBeenCalledWith(1249);
    });

    it('enriches each player with their all-time games played count via parallel Promise.all', async () => {
        const result = await PickerPage();

        expect(outcomeService.getGamesPlayedByPlayer).toHaveBeenCalledWith(1, 0);
        expect(outcomeService.getGamesPlayedByPlayer).toHaveBeenCalledWith(2, 0);

        const form = findElement(result, 'PickerForm');
        const enrichedPlayers = form?.props.players as { playerId: number; gamesPlayed: number }[];
        expect(enrichedPlayers).toEqual([
            { playerId: 1, name: 'Alice', gamesPlayed: 10 },
            { playerId: 2, name: 'Bob', gamesPlayed: 20 },
        ]);
    });

    it('passes the current game day and enriched players to PickerForm', async () => {
        const result = await PickerPage();

        const form = findElement(result, 'PickerForm');
        expect(form?.props.gameDay).toBe(currentGame);
        expect(form?.props.submitPicker).toBe(SubmitPicker);
        expect(form?.props.setGameEnabled).toBe(setGameEnabled);
    });

    it('renders AutoRefresh subscribed to Games and Responses channels', async () => {
        const result = await PickerPage();

        const autoRefresh = findElement(result, 'AutoRefresh');
        expect(autoRefresh?.props.channels).toEqual([FootyChannel.Games, FootyChannel.Responses]);
    });

    it('handles service errors gracefully by propagating them', async () => {
        (outcomeService.getAdminByGameDay as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(PickerPage()).rejects.toThrow('DB failed');
    });
});
