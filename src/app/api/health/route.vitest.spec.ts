import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/health/route';
import { HealthResponseSchema } from '@/lib/health';

describe('/api/health', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 200 and healthy status when database is connected', async () => {
        (prisma.$queryRaw as Mock).mockResolvedValue([{ '1': 1 }]);

        const response = await GET();
        const json = HealthResponseSchema.parse(await response.json());

        expect(response.status).toBe(200);
        expect(json.status).toBe('healthy');
        expect(json.database).toBe('connected');
        expect(json.timestamp).toBeDefined();
        expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    });

    it('should return 503 and unhealthy status when database is disconnected', async () => {
        const dbError = new Error('Connection refused');
        (prisma.$queryRaw as Mock).mockRejectedValue(dbError);

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
        (prisma.$queryRaw as Mock).mockRejectedValue('String error');

        const response = await GET();
        const json = HealthResponseSchema.parse(await response.json());

        expect(response.status).toBe(503);
        expect(json.status).toBe('unhealthy');
        expect(json.error).toBe('Unknown error');
    });
});
