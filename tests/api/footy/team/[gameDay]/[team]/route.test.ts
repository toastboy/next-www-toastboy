import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('services/Outcome');
jest.mock('lib/authServer');

import { GET } from 'api/footy/team/[gameDay]/[team]/route';
import { getUserRole } from 'lib/authServer';
import outcomeService from 'services/Outcome';
import request from 'supertest';

suppressConsoleError();
const mockRoute = '/api/footy/team/1100/A';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({ gameDay: "1100", team: "A" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    const mockData = [
        {
            id: 1,
            response: "Yes",
            responseInterval: 25665,
            points: 0,
            team: "A",
            comment: "",
            pub: null,
            paid: true,
            goalie: false,
            gameDayId: 1100,
            playerId: 11,
        },
        {
            id: 2,
            response: "Yes",
            responseInterval: 36593,
            points: 0,
            team: "A",
            comment: "",
            pub: null,
            paid: true,
            goalie: false,
            gameDayId: 1100,
            playerId: 30,
        },
        {
            id: 3,
            response: "Yes",
            responseInterval: 116044,
            points: 0,
            team: "A",
            comment: "",
            pub: null,
            paid: true,
            goalie: false,
            gameDayId: 1100,
            playerId: 60,
        },
        {
            id: 4,
            response: "Yes",
            responseInterval: 10062,
            points: 0,
            team: "A",
            comment: "",
            pub: null,
            paid: true,
            goalie: false,
            gameDayId: 1100,
            playerId: 134,
        },
        {
            id: 5,
            response: "Yes",
            responseInterval: 111055,
            points: 0,
            team: "A",
            comment: "",
            pub: null,
            paid: true,
            goalie: false,
            gameDayId: 1100,
            playerId: 190,
        },
    ];

    it('should return JSON response for a valid team', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(
            mockData.map((item) => ({
                ...item,
                comment: null,
            })),
        );
    });

    it('should return JSON response for a valid team for an admin', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('admin');
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the team does not exist', async () => {
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (outcomeService.getByGameDay as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
