import { vi } from 'vitest';

vi.mock('services/PlayerRecord');
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return { ...actual, cache: (fn: unknown) => fn };
});
vi.mock('next/navigation');

describe('Table [table] page', () => {
    describe('unpackParams', () => {
        it.todo('calls notFound when the table param is not a valid TableName');
        it.todo('calls notFound when the year is not in allYears');
        it.todo('calls permanentRedirect when the URL does not match the canonical URL');
        it.todo('defaults to year 0 when no year searchParam is provided');
    });

    describe('Page', () => {
        it.todo('fetches the qualified table data');
        it.todo('fetches the unqualified table data');
        it.todo('passes qualified and unqualified data to YearTable');
        it.todo('handles service errors gracefully');
    });
});
