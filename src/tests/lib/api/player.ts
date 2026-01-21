
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import playerService from '@/services/Player';
vi.mock('services/Player');

// TODO: This mock data should be moved to src/tests/mocks/data/player.ts

export const mockPlayer = {
    id: 1,
    name: "Derek Turnipson",
    anonymous: null,
    joined: null,
    finished: new Date("2010-12-15T00:00:00.000Z"),
    born: 1979,
    comment: "",
    introducedBy: null,
};

export const setupPlayerMocks = () => {
    beforeEach(() => {
        (playerService.getById as Mock).mockResolvedValue(mockPlayer);
        (playerService.getLogin as Mock).mockResolvedValue('player1');
    });
};
