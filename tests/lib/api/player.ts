jest.mock('services/Player');

import playerService from 'services/Player';

export const mockPlayer = {
    id: 1,
    login: "player1",
    isAdmin: null,
    name: "Derek Turnipson",
    anonymous: null,
    email: "derek.turnipson@example.com",
    joined: null,
    finished: new Date("2010-12-15T00:00:00.000Z"),
    born: new Date("1979-06-19T00:00:00.000Z"),
    comment: "",
    introducedBy: null,
};

export const setupPlayerMocks = () => {
    beforeEach(() => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(mockPlayer);
    });
};
