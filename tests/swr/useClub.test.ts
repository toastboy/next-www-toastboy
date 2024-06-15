import { renderHook, waitFor } from '@testing-library/react';
import { useClub } from 'lib/swr';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    http.get('/api/footy/club/:id', ({ params }) => {
        const { id } = params;
        if (id === '123') {
            return HttpResponse.json({ id: 123, club_name: 'Test Club' });
        } else { // Simulate error
            return HttpResponse.error();
        }
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches club data successfully', async () => {
    const { result } = renderHook(() => useClub(123));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toEqual({ id: 123, club_name: 'Test Club' });
});

test('handles club fetch error', async () => {
    const { result } = renderHook(() => useClub(456));

    await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
});
