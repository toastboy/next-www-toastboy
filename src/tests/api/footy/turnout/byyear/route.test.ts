import request from 'supertest';

import { GET } from '@/app/api/footy/turnout/byyear/route';
import outcomeService from '@/services/Outcome';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultTurnoutByYearList } from '@/tests/mocks/data';
const testURI = '/api/footy/turnout/byyear';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({}) }, jsonResponseHandler);

jest.mock('services/Outcome');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameDay', async () => {
        (outcomeService.getTurnoutByYear as jest.Mock).mockResolvedValue(defaultTurnoutByYearList);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultTurnoutByYearList));
    });

    it('should return 404 if there is no data', async () => {
        (outcomeService.getTurnoutByYear as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (outcomeService.getTurnoutByYear as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
