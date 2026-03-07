import { vi } from 'vitest';

vi.mock('services/PlayerRecord');
vi.mock('services/Outcome');
vi.mock('next/navigation');

describe('Curse of the Bibs page', () => {
    it.todo('fetches allYears from playerRecordService');
    it.todo('fetches bibs data for the selected year');
    it.todo('calls notFound when the selected year is not in allYears');
    it.todo('defaults to year 0 (all-time) when no year param is provided');
    it.todo('parses the year from the first element of the catch-all param');
    it.todo('handles service errors gracefully');
});
