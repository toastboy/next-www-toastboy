import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

import { permanentRedirect } from 'next/navigation';

import Page from '@/app/footy/player/[id]/[year]/page';

describe('Player [id]/[year] redirect page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls permanentRedirect to /footy/player/[id]?year=[year]', async () => {
        await expect(
            Page({ params: Promise.resolve({ id: '7', year: '2021' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/player/7?year=2021');
    });

    it('preserves the exact id and year values from params', async () => {
        await expect(
            Page({ params: Promise.resolve({ id: '123', year: '0' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/player/123?year=0');
    });
});
