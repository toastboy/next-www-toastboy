import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

import { permanentRedirect } from 'next/navigation';

import Page from '@/app/footy/winners/[year]/page';

describe('Winners [year] redirect page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls permanentRedirect to /footy/winners?year=[year]', async () => {
        await expect(
            Page({ params: Promise.resolve({ year: '2021' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/winners?year=2021');
    });

    it('preserves the exact year value from params', async () => {
        await expect(
            Page({ params: Promise.resolve({ year: '0' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/winners?year=0');
    });
});
