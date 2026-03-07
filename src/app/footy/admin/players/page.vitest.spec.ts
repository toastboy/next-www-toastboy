import { vi } from 'vitest';

vi.mock('services/Player');
vi.mock('@/lib/auth');
vi.mock('next/headers');

describe('Admin Players page', () => {
    it.todo('fetches all players from playerService');
    it.todo('fetches the user list from auth.api.listUsers');
    it.todo('builds the userEmails array from the user list');
    it.todo('builds the userIdByEmail map from the user list');
    it.todo('passes players, userEmails, and userIdByEmail to AdminPlayerList');
    it.todo('handles service errors gracefully');
});
