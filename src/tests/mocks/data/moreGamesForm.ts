import type { CreateMoreGameDaysInput } from '@/types/CreateMoreGameDaysInput';

export const defaultMoreGamesFormData: CreateMoreGameDaysInput = {
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
