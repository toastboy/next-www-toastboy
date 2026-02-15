import { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

export const defaultGameDay: GameDayType = {
    id: 1,
    year: 2021,
    date: new Date('2021-01-03'),
    game: true,
    cost: 500,
    mailSent: new Date('2021-01-01'),
    comment: 'I heart footy',
    bibs: 'A',
    pickerGamesHistory: 10,
};

export const createMockGameDay = (overrides: Partial<GameDayType> = {}): GameDayType => ({
    ...defaultGameDay,
    ...overrides,
});

export const defaultGameDayList: GameDayType[] = Array.from({ length: 100 }, (_, index) =>
    createMockGameDay({
        id: index + 1,
        date: new Date(defaultGameDay.date.getTime() + index * 7 * 24 * 60 * 60 * 1000),
    }),
);
