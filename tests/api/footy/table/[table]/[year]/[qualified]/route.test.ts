import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('services/PlayerRecord');

import { GET } from 'api/footy/table/[table]/[year]/[qualified]/route';
import playerRecordService from 'services/PlayerRecord';
import request from 'supertest';
import { mockTable, setupTableMocks } from 'tests/lib/api/table';

suppressConsoleError();
const testRoute = '/api/footy/table/points/2010/true';
const mockApp = createMockApp(GET, { path: testRoute, params: Promise.resolve({ table: "points", year: "2010", qualified: "true" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupTableMocks();

    it('should return JSON response for a valid table', async () => {
        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockTable);
    });

    it('should return 404 if the table does not exist', async () => {
        (playerRecordService.getTable as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getTable as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
