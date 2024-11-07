jest.mock('services/Player');

import { generateStaticParams } from 'api/footy/player/[idOrLogin]/arse/route';
import playerService from 'services/Player';

export const mockPlayer = {
    id: 1,
    login: "player1",
    is_admin: null,
    first_name: "Derek",
    last_name: "Turnipson",
    name: "Derek Turnipson",
    anonymous: null,
    email: "derek.turnipson@example.com",
    joined: null,
    finished: "2010-12-15T00:00:00.000Z",
    born: "1979-06-19T00:00:00.000Z",
    comment: "",
    introduced_by: null,
};

export const setupPlayerMocks = () => {
    beforeEach(() => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(mockPlayer);
    });
};

export const testGenerateStaticParams = () => {
    it('should return null if there are no players', async () => {
        (playerService.getAllIdsAndLogins as jest.Mock).mockResolvedValue(null);

        const result = await generateStaticParams();
        expect(result).toEqual(null);
    });

    it('should return player ids as params', async () => {
        const mockData = [
            { id: 1, login: 'player1' },
            { id: 2, login: 'player2' },
            { id: 3, login: 'player3' },
        ];
        (playerService.getAllIdsAndLogins as jest.Mock).mockResolvedValue(mockData);

        const result = await generateStaticParams();
        expect(result).toEqual(mockData);
    });
};