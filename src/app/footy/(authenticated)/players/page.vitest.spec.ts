import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Player');
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
}));

vi.mock('@/actions/sendEmail', () => ({
    sendEmail: vi.fn(),
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: vi.fn(() => null),
}));

vi.mock('@/components/PlayerList/PlayerList', () => ({
    PlayerList: vi.fn(() => null),
}));

import { notFound } from 'next/navigation';
import { renderToStaticMarkup } from 'react-dom/server';

import { sendEmail } from '@/actions/sendEmail';
import PlayersPage from '@/app/footy/(authenticated)/players/page';
import { PlayerList } from '@/components/PlayerList/PlayerList';
import gameDayService from '@/services/GameDay';
import playerService from '@/services/Player';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { defaultPlayerList } from '@/tests/mocks/data/player';

describe('Players page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches current game day and all players in parallel via Promise.all', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue(createMockGameDay());
        (playerService.getAll as Mock).mockResolvedValue(defaultPlayerList);

        await PlayersPage();

        expect(gameDayService.getCurrent).toHaveBeenCalledTimes(1);
        expect(playerService.getAll).toHaveBeenCalledTimes(1);
    });

    it('calls notFound when there is no current game day', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue(null);
        (playerService.getAll as Mock).mockResolvedValue(defaultPlayerList);

        await expect(PlayersPage()).rejects.toThrow('not_found');

        expect(notFound).toHaveBeenCalledTimes(1);
        expect(PlayerList).not.toHaveBeenCalled();
    });

    it('passes players and gameDay to PlayerList', async () => {
        const gameDay = createMockGameDay({ id: 1249 });
        (gameDayService.getCurrent as Mock).mockResolvedValue(gameDay);
        (playerService.getAll as Mock).mockResolvedValue(defaultPlayerList);

        renderToStaticMarkup(await PlayersPage());

        expect(PlayerList).toHaveBeenCalledWith(
            { players: defaultPlayerList, gameDay, sendEmail },
            undefined,
        );
    });

    it('handles service errors gracefully', async () => {
        (gameDayService.getCurrent as Mock).mockRejectedValue(new Error('DB failed'));
        (playerService.getAll as Mock).mockResolvedValue(defaultPlayerList);

        await expect(PlayersPage()).rejects.toThrow('DB failed');
    });
});
