/**
 * Health check endpoint E2E tests
 */
import { HealthResponseSchema } from 'lib/health';

import { expect, test } from '@/tests/playwright/fixtures';

test.describe('/api/health endpoint', () => {
    test('should return healthy status with 200 when application and database are running', async ({
        request,
    }) => {
        const response = await request.get('/api/health');
        const json = HealthResponseSchema.parse(await response.json());

        expect(response.status()).toBe(200);
        expect(json.status).toBe('healthy');
        expect(json.database).toBe('connected');
        expect(json.timestamp).toBeTruthy();

        // Verify timestamp is a valid ISO string
        expect(() => new Date(json.timestamp)).not.toThrow();
    });

    test('should respond quickly (within reasonable time)', async ({ request }) => {
        const startTime = Date.now();
        const response = await request.get('/api/health');
        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(response.status()).toBe(200);
        // Health check should respond within 5 seconds
        expect(duration).toBeLessThan(5000);
    });

    test('should be accessible without authentication', async ({ request }) => {
        // Health check should not require authentication
        const response = await request.get('/api/health');

        // Should not redirect or return 401/403
        expect(response.status()).not.toBe(401);
        expect(response.status()).not.toBe(403);
        expect(response.status()).toBe(200);
    });
});
