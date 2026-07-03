import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
    permanentRedirect: vi.fn(() => { throw new Error('permanent_redirect'); }),
}));

import { permanentRedirect } from 'next/navigation';

import Page from '@/app/footy/table/[table]/[year]/page';

describe('Table [table]/[year] redirect page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls permanentRedirect to /footy/table/[table]?year=[year]', async () => {
        await expect(
            Page({ params: Promise.resolve({ table: 'pub', year: '2021' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/table/pub?year=2021');
    });

    it('preserves the exact table and year values from params', async () => {
        await expect(
            Page({ params: Promise.resolve({ table: 'points', year: '0' }) }),
        ).rejects.toThrow('permanent_redirect');

        expect(permanentRedirect).toHaveBeenCalledWith('/footy/table/points?year=0');
    });
});
