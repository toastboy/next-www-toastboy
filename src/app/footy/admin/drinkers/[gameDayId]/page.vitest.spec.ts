import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('next/navigation');

describe('Admin Drinkers [gameDayId] page', () => {
    it.todo('calls notFound when gameDayId is not a valid positive integer');
    it.todo('calls notFound when the game day cannot be found');
    it.todo('fetches players, previousGame, and nextGame in parallel via Promise.all');
    it.todo('renders navigation links when previous and next games exist');
    it.todo('omits previous navigation link when there is no previous game');
    it.todo('omits next navigation link when there is no next game');
    it.todo('passes the gameDay date as an ISO date string to DrinkersForm');
    it.todo('handles service errors gracefully');
});
