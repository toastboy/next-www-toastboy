import { describe, expect, it, vi } from 'vitest';

import { createMoreGameDaysCore } from '@/lib/actions/createMoreGameDays';
import { ValidationError } from '@/lib/errors';

describe('createMoreGameDaysCore', () => {
    it('creates game days with parsed local-evening dates and trimmed comments', async () => {
        const gameDayService = {
            create: vi.fn()
                .mockResolvedValueOnce({ id: 1 })
                .mockResolvedValueOnce({ id: 2 }),
        };

        const result = await createMoreGameDaysCore(
            {
                cost: 450,
                rows: [
                    {
                        date: '2026-03-01',
                        game: true,
                        comment: '  Bring bibs  ',
                    },
                    {
                        date: '2026-03-08',
                        game: false,
                        comment: '   ',
                    },
                ],
            },
            { gameDayService },
        );

        expect(gameDayService.create).toHaveBeenCalledTimes(2);
        expect(gameDayService.create).toHaveBeenNthCalledWith(1, {
            year: 2026,
            date: new Date(2026, 2, 1, 18, 0, 0, 0),
            game: true,
            cost: 450,
            comment: 'Bring bibs',
        });
        expect(gameDayService.create).toHaveBeenNthCalledWith(2, {
            year: 2026,
            date: new Date(2026, 2, 8, 18, 0, 0, 0),
            game: false,
            cost: 450,
            comment: null,
        });
        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('throws ValidationError for invalid date strings', async () => {
        const gameDayService = {
            create: vi.fn(),
        };

        await expect(
            createMoreGameDaysCore(
                {
                    cost: 450,
                    rows: [
                        {
                            date: 'bad-date',
                            game: true,
                            comment: 'hello',
                        },
                    ],
                },
                { gameDayService },
            ),
        ).rejects.toBeInstanceOf(ValidationError);

        expect(gameDayService.create).not.toHaveBeenCalled();
    });
});
