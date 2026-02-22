// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

import {
    DEFAULT_SENTRY_IGNORE_ERRORS,
    resolveSentrySampleRate,
    scrubSentryEvent,
} from '@/lib/observability/sentryConfig';

/**
 * Trace sample rate used for browser transactions.
 */
const tracesSampleRate = resolveSentrySampleRate({
    envVarName: 'SENTRY_TRACES_SAMPLE_RATE',
    productionDefault: 0.05,
    nonProductionDefault: 0.0,
});

/**
 * Session replay sample rate for all browser sessions.
 */
const replaysSessionSampleRate = resolveSentrySampleRate({
    envVarName: 'SENTRY_REPLAYS_SESSION_SAMPLE_RATE',
    productionDefault: 0.02,
    nonProductionDefault: 0.0,
});

/**
 * Session replay sample rate when an error occurs in a browser session.
 */
const replaysOnErrorSampleRate = resolveSentrySampleRate({
    envVarName: 'SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE',
    productionDefault: 0.2,
    nonProductionDefault: 0.0,
});

Sentry.init({
    dsn: 'https://718e6154f4da03a99d611d4eba4c5f1e@o4508663413932032.ingest.de.sentry.io/4508663431037008',

    // Add optional integrations for additional features
    integrations: [
        Sentry.replayIntegration(),
    ],

    // Use conservative defaults for free-tier quota safety and allow environment
    // overrides per deployment.
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,

    // Filter out known noisy client-side errors that are not actionable.
    ignoreErrors: [...DEFAULT_SENTRY_IGNORE_ERRORS],

    // Scrub sensitive values from payloads before events are sent.
    beforeSend: (event) => scrubSentryEvent(event),
    beforeSendTransaction: (event) => scrubSentryEvent(event),

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
