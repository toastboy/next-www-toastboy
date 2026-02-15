import type { CreateMoreGameDaysInput } from '@/types/actions/CreateMoreGameDays';

export const defaultMoreGamesFormData: CreateMoreGameDaysInput = {
    cost: 500,
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
};

export const createMockMoreGamesFormData = (
    overrides: Partial<CreateMoreGameDaysInput> = {},
): CreateMoreGameDaysInput => ({
    ...defaultMoreGamesFormData,
    ...overrides,
});
