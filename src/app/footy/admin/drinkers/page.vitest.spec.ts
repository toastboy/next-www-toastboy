import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    redirect: vi.fn(() => { throw new Error('redirected'); }),
}));

import { redirect } from 'next/navigation';

import DrinkersPage from '@/app/footy/admin/drinkers/page';
import gameDayService from '@/services/GameDay';

describe('Admin Drinkers redirect page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects to /footy/admin/drinkers/[id] when there is a current game', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue({ id: 1249 });

        await expect(DrinkersPage()).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/admin/drinkers/1249');
    });

    it('calls notFound when there is no current game', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue(null);

        await expect(DrinkersPage()).rejects.toThrow('not_found');
    });
});
