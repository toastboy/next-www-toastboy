import { createMockApp, jsonResponseHandler } from '@/tests/lib/api/common';

jest.mock('services/Outcome');
jest.mock('lib/authServer');

import request from 'supertest';

import { GET } from '@/app/api/footy/team/[gameDay]/[team]/route';
import { getUserRole } from '@/lib/authServer';
import outcomeService from '@/services/Outcome';
import { defaultOutcomeList } from '@/tests/mocks';
const testURI = '/api/footy/team/1100/A';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ gameDay: "1100", team: "A" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid team', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(defaultOutcomeList);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(
            defaultOutcomeList.map((item) => ({
                ...item,
                comment: undefined,
            })),
        );
    });

    it('should return JSON response for a valid team for an admin', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('admin');
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(defaultOutcomeList);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultOutcomeList);
    });

    it('should return 404 if the team does not exist', async () => {
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (outcomeService.getByGameDay as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
