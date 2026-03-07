import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('next/navigation');

describe('Game redirect page (/footy/game)', () => {
    it.todo('redirects to /footy/game/[id] when there is a current game');
    it.todo('calls notFound when there is no current game');
});
