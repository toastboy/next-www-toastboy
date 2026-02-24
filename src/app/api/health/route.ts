import 'server-only';

import { NextResponse } from 'next/server';
import prisma from 'prisma/prisma';

import { normalizeUnknownError, toHttpErrorResponse } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
        const normalizedError = normalizeUnknownError(error, {
            publicMessage: 'Health check failed',
            details: {
                route: '/api/health',
            },
        });
        captureUnexpectedError(normalizedError, {
            layer: 'route',
            action: 'healthCheck',
            route: '/api/health',
        });

        /**
         * Normalise generic upstream/internal failures (surfaced as HTTP 500 by
         * `toHttpErrorResponse`, such as Prisma/database connectivity issues or
         * transient infrastructure errors) to HTTP 503 so that orchestrators and
         * external monitors treat the service as temporarily unavailable rather
         * than permanently broken.
         *
         * Non-500 statuses are passed through unchanged so that deliberate
         * application-level responses (e.g. validation 4xx or explicit 503s)
         * remain visible to callers and are not masked by this health-specific
         * normalisation.
         */

        const { status, message } = toHttpErrorResponse(normalizedError, 'Health check failed');

        return NextResponse.json(
            {
                status: 'unhealthy',
                database: 'disconnected',
                error: message,
                timestamp: new Date().toISOString(),
            },
            {
                status: status === 500 ? 503 : status,
                headers: {
                    'Connection': 'close',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            },
        );
    }
}
