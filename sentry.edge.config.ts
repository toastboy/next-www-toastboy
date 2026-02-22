// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

import {
    DEFAULT_SENTRY_IGNORE_ERRORS,
    resolveSentrySampleRate,
    scrubSentryEvent,
} from '@/lib/observability/sentryConfig';

/**
 * Trace sample rate used for edge runtime transactions.
 */
const tracesSampleRate = resolveSentrySampleRate({
    envVarName: 'SENTRY_TRACES_SAMPLE_RATE',
    productionDefault: 0.05,
    nonProductionDefault: 0.0,
});

Sentry.init({
    dsn: 'https://718e6154f4da03a99d611d4eba4c5f1e@o4508663413932032.ingest.de.sentry.io/4508663431037008',

    // Use conservative defaults for free-tier quota safety and allow
    // environment overrides per deployment.
    tracesSampleRate,

    // Filter out known noisy errors that are rarely actionable.
    ignoreErrors: [...DEFAULT_SENTRY_IGNORE_ERRORS],

    // Scrub sensitive values from payloads before events are sent.
    beforeSend: (event) => scrubSentryEvent(event),
    beforeSendTransaction: (event) => scrubSentryEvent(event),

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
});
