import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

import { permanentRedirect } from 'next/navigation';

import ResultsPage from '@/app/footy/results/page';
import gameDayService from '@/services/GameDay';

describe('Results redirect page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('permanently redirects to /footy/games?year=[currentYear] when there is a current year', async () => {
        (gameDayService.getCurrentYear as Mock).mockResolvedValue(2024);

        await expect(ResultsPage()).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/games?year=2024');
    });

    it('calls notFound when there is no current year', async () => {
        (gameDayService.getCurrentYear as Mock).mockResolvedValue(null);

        await expect(ResultsPage()).rejects.toThrow('not_found');
    });
});
