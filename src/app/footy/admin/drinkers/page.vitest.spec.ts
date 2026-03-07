import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('next/navigation');

describe('Admin Drinkers redirect page', () => {
    it.todo('redirects to /footy/admin/drinkers/[id] when there is a current game');
    it.todo('calls notFound when there is no current game');
});
