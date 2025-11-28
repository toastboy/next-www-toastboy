/**
 * Health check API endpoint tests
 */
import { GET, HealthResponseSchema } from 'api/health/route';
import prisma from 'lib/prisma';

// Mock the prisma client
jest.mock('lib/prisma', () => ({
    __esModule: true,
    default: {
        $queryRaw: jest.fn(),
    },
}));

describe('/api/health', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and healthy status when database is connected', async () => {
        // Mock successful database query
        (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '1': 1 }]);

        const response = await GET();
        const json = HealthResponseSchema.parse(await response.json());

        expect(response.status).toBe(200);
        expect(json.status).toBe('healthy');
        expect(json.database).toBe('connected');
        expect(json.timestamp).toBeDefined();
        expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it('should return 503 and unhealthy status when database is disconnected', async () => {
        // Mock database connection error
        const dbError = new Error('Connection refused');
        (prisma.$queryRaw as jest.Mock).mockRejectedValue(dbError);

        const response = await GET();
        const json = HealthResponseSchema.parse(await response.json());

        expect(response.status).toBe(503);
        expect(json.status).toBe('unhealthy');
        expect(json.database).toBe('disconnected');
        expect(json.error).toBe('Connection refused');
        expect(json.timestamp).toBeDefined();
        expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
        // Mock non-Error exception
        (prisma.$queryRaw as jest.Mock).mockRejectedValue('String error');

        const response = await GET();
        const json = HealthResponseSchema.parse(await response.json());

        expect(response.status).toBe(503);
        expect(json.status).toBe('unhealthy');
        expect(json.error).toBe('Unknown error');
    });
});
