import { vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('@/actions/recordHallHire', () => ({ recordHallHire: vi.fn() }));
vi.mock('@/actions/updateInvoiceGameDays', () => ({ updateInvoiceGameDays: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

describe('Admin Invoice page', () => {
    it.todo('defaults year and month to next month when search params are absent');
    it.todo('uses year and month from search params when provided');
    it.todo('marks a game day as scheduled when the game flag is true');
    it.todo('marks a game day as scheduled when mailSent is not null, regardless of the game flag');
    it.todo('marks a game day as not scheduled when game is false and mailSent is null');
    it.todo('passes the updateInvoiceGameDays action to InvoiceForm');
    it.todo('passes the recordHallHire action to InvoiceForm');
    it.todo('renders AutoRefresh with the Games and Money channels');
});
