import { vi } from 'vitest';

vi.mock('services/GameDay');

describe('Admin More Games page', () => {
    it.todo('calls gameDayService.getLatest');
    it.todo('generates rows starting 7 days after the latest game day');
    it.todo('generates rows up to the end of the current booking year (July 31st)');
    it.todo('falls back to the next Tuesday when there is no latest game day');
    it.todo('uses the latest game day cost when available');
    it.todo('falls back to the default game cost when no latest game day exists');
    it.todo('passes cost and rows to MoreGamesForm');
    it.todo('handles service errors gracefully');
});
