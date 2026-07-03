import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

import { permanentRedirect } from 'next/navigation';

import FixturesForYearPage from '@/app/footy/fixtures/[year]/page';

describe('Fixtures for year redirect page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('permanently redirects to /footy/games?year=[year] for the given year', async () => {
        await expect(
            FixturesForYearPage({ params: Promise.resolve({ year: '2019' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/games?year=2019');
    });
});
