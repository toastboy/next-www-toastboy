import { beforeEach, vi } from 'vitest';

import { defaultPlayer, defaultPlayerLogin } from '@/tests/mocks/data/player';

const playerService = {
    getById: vi.fn(),
    getByLogin: vi.fn(),
    getByIdOrLogin: vi.fn(),
    getLogin: vi.fn(),
    getId: vi.fn(),
    getAll: vi.fn(),
    getAllIdsAndLogins: vi.fn(),
    getForm: vi.fn(),
    getLastPlayed: vi.fn(),
    getYearsActive: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    anonymise: vi.fn(),
    setFinished: vi.fn(),
    delete: vi.fn(),
    deleteAll: vi.fn(),
    getName: vi.fn(),
};

beforeEach(() => {
    playerService.getById.mockResolvedValue(defaultPlayer);
    playerService.getByLogin.mockResolvedValue(defaultPlayer);
    playerService.getByIdOrLogin.mockResolvedValue(defaultPlayer);
    playerService.getLogin.mockResolvedValue(defaultPlayerLogin.login);
    playerService.getId.mockResolvedValue(defaultPlayer.id);
});

export default playerService;
