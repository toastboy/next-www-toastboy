import { createMockApp, jsonResponseHandler, suppressConsoleError } from '@/tests/lib/api/common';
import { setupPlayerMocks } from '@/tests/lib/api/player';

jest.mock('services/Player');
jest.mock('lib/authServer');

import request from 'supertest';

import { GET } from '@/app/api/footy/player/[idOrLogin]/lastplayed/route';
import { getUserRole } from '@/lib/authServer';
import playerService from '@/services/Player';

suppressConsoleError();
const testURI = '/api/footy/player/1/lastplayed';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ idOrLogin: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    const mockData = {
        id: 1,
        response: 'Yes',
        responseInterval: 89724,
        points: 0,
        team: 'B',
        comment: "How do",
        pub: null,
        paid: null,
        goalie: false,
        gameDayId: 125,
        playerId: 1,
    };

    it('should return JSON response for a valid player', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (playerService.getLastPlayed as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({
            ...mockData,
            comment: undefined,
        });
    });

    it('should return JSON response for a valid player including comment for an admin', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('admin');
        (playerService.getLastPlayed as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (playerService.getLastPlayed as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerService.getLastPlayed as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
