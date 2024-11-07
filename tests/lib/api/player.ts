jest.mock('services/Player');

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
