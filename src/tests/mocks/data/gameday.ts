import { GameDayType } from "prisma/generated/schemas/models/GameDay.schema";

import { createMockGameDay } from "@/tests/mocks/factories/gameDayFactory";

export const defaultGameDay: GameDayType = {
    id: 1,
    year: 2021,
    date: new Date('2021-01-03'),
    game: true,
    mailSent: new Date('2021-01-01'),
    comment: 'I heart footy',
    bibs: 'A',
    pickerGamesHistory: 10,
};

export const defaultGameDayList: GameDayType[] = Array.from({ length: 100 }, (_, index) =>
    createMockGameDay({
        id: index + 1,
    }),
);
