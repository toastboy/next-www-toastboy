/**
 * Marker used when redacting sensitive values from Sentry event payloads.
 */
const REDACTED_VALUE = '[REDACTED]';

/**
 * Maximum recursion depth used while sanitizing nested Sentry event payloads.
 */
const MAX_SCRUB_DEPTH = 8;

/**
 * Pattern used to identify sensitive parameter and field names that should never
 * be sent to Sentry in clear text.
 */
const SENSITIVE_KEY_PATTERN = /(token|password|authorization|cookie|secret|session|api[-_]?key)/i;

/**
 * A conservative set of noisy/browser-level errors that generally do not need
 * triage in Sentry and can consume free-tier quota disproportionately.
 */
export const DEFAULT_SENTRY_IGNORE_ERRORS = [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications.',
    'Non-Error promise rejection captured',
] as const;

/**
 * Options for resolving runtime-configurable Sentry sample rates.
 */
export interface SampleRateOptions {
    /**
     * Environment variable to read, for example `SENTRY_TRACES_SAMPLE_RATE`.
     */
    envVarName: string;
    /**
     * Default sample rate used when `NODE_ENV === 'production'` and no valid
     * environment override is provided.
     */
    productionDefault: number;
    /**
     * Default sample rate used outside production when no valid environment
     * override is provided.
     */
    nonProductionDefault: number;
}

/**
 * Type guard for object-like values.
 *
 * @param value Unknown value to inspect.
 * @returns `true` when the value is a non-null, non-array object.
 */
const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Returns whether a key should be scrubbed before sending data to Sentry.
 *
 * @param key Potentially sensitive field/key name.
 * @returns `true` when the key matches sensitive naming conventions.
 */
const isSensitiveKey = (key: string): boolean =>
    SENSITIVE_KEY_PATTERN.test(key);

/**
 * Clamps a numeric sample rate to the valid Sentry range [0, 1].
 *
 * @param value Candidate numeric sample rate.
 * @returns The clamped value.
 */
const clampSampleRate = (value: number): number =>
    Math.min(1, Math.max(0, value));

/**
 * Parses a sample rate from an environment variable string.
 *
 * @param rawValue Raw environment variable value.
 * @returns Parsed and clamped sample rate, or `null` when invalid.
 */
const parseSampleRate = (rawValue: string | undefined): number | null => {
    if (!rawValue) {
        return null;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
        return null;
    }

    return clampSampleRate(parsed);
};

/**
 * Resolves a Sentry sample rate from environment or defaults based on runtime.
 *
 * Resolution order:
 * 1. Valid numeric value from the configured environment variable.
 * 2. Production default when running in production.
 * 3. Non-production default otherwise.
 *
 * @param options Sample-rate resolution settings.
 * @returns A valid sample rate in [0, 1].
 */
export const resolveSentrySampleRate = (options: SampleRateOptions): number => {
    const fromEnv = parseSampleRate(process.env[options.envVarName]);
    if (fromEnv !== null) {
        return fromEnv;
    }

    let fallback: number;
    if (process.env.NODE_ENV === 'production') {
        fallback = options.productionDefault;
    } else {
        fallback = options.nonProductionDefault;
    }

    return clampSampleRate(fallback);
};

/**
 * Redacts sensitive query-string parameters from URL strings.
 *
 * @param rawUrl Raw absolute or relative URL.
 * @returns URL with sensitive query parameter values replaced.
 */
const redactSensitiveQueryParams = (rawUrl: string): string => {
    try {
        const url = new URL(rawUrl, 'http://localhost');
        for (const [key] of url.searchParams.entries()) {
            if (isSensitiveKey(key)) {
                url.searchParams.set(key, REDACTED_VALUE);
            }
        }

        if (rawUrl.startsWith('/')) {
            return `${url.pathname}${url.search}${url.hash}`;
        }

        return url.toString();
    } catch {
        return rawUrl;
    }
};

/**
 * Sanitizes arbitrary values for Sentry by redacting sensitive keys and
 * recursively traversing nested objects and arrays.
 *
 * @param value Value to sanitize.
 * @param depth Current recursion depth.
 * @param seen Set used to detect circular references.
 * @returns Sanitized value safe for transport to Sentry.
 */
const sanitizeValue = (
    value: unknown,
    depth: number,
    seen: WeakSet<object>,
): unknown => {
    if (depth >= MAX_SCRUB_DEPTH) {
        return value;
    }

    /**
     * Arrays must pass this guard so they can participate in circular-reference
     * detection and recursive scrubbing.
     */
    if (value === null || typeof value !== 'object') {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (seen.has(value)) {
        return '[CIRCULAR]';
    }
    seen.add(value);

    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
        };
    }

    if (Array.isArray(value)) {
        return value.map((entry) => sanitizeValue(entry, depth + 1, seen));
    }

    const sanitized: Record<string, unknown> = {};
    const objectValue = value as Record<string, unknown>;
    for (const [key, entry] of Object.entries(objectValue)) {
        if (isSensitiveKey(key)) {
            sanitized[key] = REDACTED_VALUE;
            continue;
        }

        if (typeof entry === 'string' && (key === 'url' || key === 'from' || key === 'to')) {
            sanitized[key] = redactSensitiveQueryParams(entry);
            continue;
        }

        sanitized[key] = sanitizeValue(entry, depth + 1, seen);
    }

    return sanitized;
};

/**
 * Scrubs Sentry event payloads before they are sent to Sentry transport.
 *
 * This function redacts sensitive key/value pairs from common top-level fields
 * and nested structures while preserving enough context for debugging.
 *
 * @template TEvent Generic Sentry event shape.
 * @param event Sentry event candidate.
 * @returns The same event reference after in-place sanitization.
 */
export const scrubSentryEvent = <TEvent>(event: TEvent): TEvent => {
    if (!isObjectRecord(event)) {
        return event;
    }

    const seen = new WeakSet<object>();
    const mutableEvent = event as Record<string, unknown>;

    if (isObjectRecord(mutableEvent.request) && typeof mutableEvent.request.url === 'string') {
        mutableEvent.request = {
            ...mutableEvent.request,
            url: redactSensitiveQueryParams(mutableEvent.request.url),
        };
    }

    if (Array.isArray(mutableEvent.breadcrumbs)) {
        mutableEvent.breadcrumbs = mutableEvent.breadcrumbs.map((breadcrumb) =>
            sanitizeValue(breadcrumb, 0, seen));
    }

    if (isObjectRecord(mutableEvent.extra)) {
        mutableEvent.extra = sanitizeValue(mutableEvent.extra, 0, seen);
    }

    if (isObjectRecord(mutableEvent.tags)) {
        mutableEvent.tags = sanitizeValue(mutableEvent.tags, 0, seen);
    }

    if (isObjectRecord(mutableEvent.user)) {
        mutableEvent.user = sanitizeValue(mutableEvent.user, 0, seen);
    }

    return event;
};
