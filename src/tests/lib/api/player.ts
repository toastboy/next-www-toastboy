jest.mock('services/Player');

import playerService from '@/services/Player';

// TODO: This mock data should be moved to src/tests/mocks/data/player.ts

export const mockPlayer = {
    id: 1,
    isAdmin: null,
    name: "Derek Turnipson",
    anonymous: null,
    joined: null,
    finished: new Date("2010-12-15T00:00:00.000Z"),
    born: new Date("1979-06-19T00:00:00.000Z"),
    comment: "",
    introducedBy: null,
};

export const setupPlayerMocks = () => {
    beforeEach(() => {
        (playerService.getById as jest.Mock).mockResolvedValue(mockPlayer);
        (playerService.getLogin as jest.Mock).mockResolvedValue('player1');
    });
};
