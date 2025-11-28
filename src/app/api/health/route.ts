import 'server-only';

import prisma from 'lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const HealthResponseSchema = z.discriminatedUnion('status', [
    z.object({
        status: z.literal('healthy'),
        database: z.literal('connected'),
        error: z.string().optional(),
        timestamp: z.iso.datetime(),
    }),
    z.object({
        status: z.literal('unhealthy'),
        database: z.literal('disconnected'),
        error: z.string(),
        timestamp: z.iso.datetime(),
    }),
]);

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

/**
 * Health check endpoint for Docker healthcheck and monitoring.
 * Verifies both application and database connectivity.
 * Uses connection pooling efficiently to avoid connection warnings.
 */
export async function GET() {
    try {
        // Test database connectivity with a simple query
        // Prisma reuses connections from the pool, so no explicit disconnect needed
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json(
            {
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString(),
            },
            {
                status: 200,
                headers: {
                    'Connection': 'close',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            },
        );
    } catch (error) {
        console.error('Health check failed:', error);

        return NextResponse.json(
            {
                status: 'unhealthy',
                database: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            {
                status: 503,
                headers: {
                    'Connection': 'close',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            },
        );
    }
}
