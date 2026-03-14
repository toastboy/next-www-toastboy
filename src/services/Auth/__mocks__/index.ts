import { vi } from 'vitest';

const authService = {
    getSessionUser: vi.fn(),
    updateCurrentUser: vi.fn(),
    changeCurrentUserEmail: vi.fn(),
};

export default authService;
