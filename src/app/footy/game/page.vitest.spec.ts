import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    redirect: vi.fn(() => { throw new Error('redirected'); }),
}));

import { redirect } from 'next/navigation';

import Page from '@/app/footy/game/page';
import gameDayService from '@/services/GameDay';

describe('Game redirect page (/footy/game)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects to /footy/game/[id] when there is a current game', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue({ id: 1249 });

        await expect(Page()).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/game/1249');
    });

    it('calls notFound when there is no current game', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue(null);

        await expect(Page()).rejects.toThrow('not_found');
    });
});
