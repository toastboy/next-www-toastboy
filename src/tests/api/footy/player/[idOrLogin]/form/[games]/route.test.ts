import { createMockApp, jsonResponseHandler, suppressConsoleError, toWire } from '@/tests/lib/api/common';
import { setupPlayerMocks } from '@/tests/lib/api/player';

jest.mock('services/Player');
jest.mock('lib/authServer');

import request from 'supertest';

import { GET } from '@/app/api/footy/player/[idOrLogin]/form/[gameDayId]/[games]/route';
import { getUserRole } from '@/lib/authServer';
import playerService from '@/services/Player';
import { defaultPlayerFormList } from '@/tests/mocks';

suppressConsoleError();
const testURI = '/api/footy/player/1/form/3';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ idOrLogin: "1", games: "3" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return JSON response for a valid player with no logged in user', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (playerService.getForm as jest.Mock).mockResolvedValue(defaultPlayerFormList);
        const expected = defaultPlayerFormList.map((record) => ({
            ...record,
            gameDay: undefined,
            comment: undefined,
        }));

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(expected);
    });

    it('should return JSON response for a valid player with a user logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('user');
        (playerService.getForm as jest.Mock).mockResolvedValue(defaultPlayerFormList);
        const expected = defaultPlayerFormList.map((record) => ({
            ...record,
            gameDay: undefined,
            comment: undefined,
        }));

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(expected);
    });

    it('should return JSON response for a valid player with an admin logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('admin');
        (playerService.getForm as jest.Mock).mockResolvedValue(defaultPlayerFormList);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultPlayerFormList));
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (playerService.getForm as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerService.getForm as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
