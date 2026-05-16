import * as Sentry from '@sentry/nextjs';

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        if (process.env.NODE_ENV === 'development') {
            // Turbopack emits binary source maps for hmr-client.ts, causing a noisy
            // JSON parse warning on every request. Filter it out at source.
            const origEmitWarning = process.emitWarning;
            process.emitWarning = ((warning: string | Error, ...rest: unknown[]) => {
                if (typeof warning === 'string' && warning.includes('hmr-client')) return;
                (origEmitWarning as (...args: unknown[]) => void)(warning, ...rest);
            });
        }

        await import('../sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        await import('../sentry.edge.config');
    }
}

export const onRequestError = Sentry.captureRequestError;
