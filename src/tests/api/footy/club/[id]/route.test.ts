import { NextRequest, NextResponse } from 'next/server';

import { GET } from '@/app/api/footy/club/[id]/route';
import clubService from '@/services/Club';

jest.mock('services/Club');

describe('API tests using HTTP', () => {
    const getResponse = async () => {
        try {
            return await GET(
                new NextRequest('http://localhost/api/footy/club/1'),
                { params: Promise.resolve({ id: '1' }) },
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return new NextResponse(`Error: ${message}`, { status: 500 });
        }
    };

    it('should return JSON response for a valid club', async () => {
        const mockData = { id: 1, name: 'Test Club' };
        (clubService.get as jest.Mock).mockResolvedValue(mockData);

        const response = await getResponse();

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toBe('application/json');
        expect(await response.json()).toEqual(mockData);
        expect(clubService.get).toHaveBeenCalledWith(1);
    });

    it('should return 404 if the club does not exist', async () => {
        (clubService.get as jest.Mock).mockResolvedValue(null);

        const response = await getResponse();

        expect(response.status).toBe(404);
        expect(await response.text()).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (clubService.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await getResponse();

        expect(response.status).toBe(500);
        expect(await response.text()).toBe(`Error: ${errorMessage}`);
    });
});
