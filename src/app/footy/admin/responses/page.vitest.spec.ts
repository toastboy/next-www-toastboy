import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('next/navigation');

describe('Admin Responses page', () => {
    it.todo('calls notFound when there is no current game');
    it.todo('fetches admin outcomes for the current game day');
    it.todo('passes the gameDay id and date to ResponsesForm');
    it.todo('passes the date as an ISO date string');
    it.todo('handles service errors gracefully');
});
