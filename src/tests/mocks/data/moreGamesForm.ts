import type { CreateMoreGameDaysInput } from '@/types/actions/CreateMoreGameDays';

export const defaultMoreGamesFormData = {
    cost: 500,
    hallCost: 4700,
    rows: [
        {
            date: '2024-01-09',
            game: true,
            comment: '',
        },
        {
            date: '2024-01-16',
            game: true,
            comment: '',
        },
        {
            date: '2024-01-23',
            game: false,
            comment: 'Hall unavailable',
        },
    ],
} satisfies CreateMoreGameDaysInput;

export const createMockMoreGamesFormData = (
    overrides: Partial<CreateMoreGameDaysInput> = {},
): CreateMoreGameDaysInput => ({
    ...defaultMoreGamesFormData,
    ...overrides,
});
