import { GameDay } from 'lib/types';

export const defaultGameDay: GameDay = {
    id: 1,
    year: 2021,
    date: new Date('2021-01-03'),
    game: true,
    mailSent: new Date('2021-01-01'),
    comment: 'I heart footy',
    bibs: 'A',
    pickerGamesHistory: 10,
};
