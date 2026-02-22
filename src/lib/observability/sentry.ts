import * as Sentry from '@sentry/nextjs';

import { isAppError, isExpectedError } from '@/lib/errors';

/**
 * Placeholder value used when sensitive fields are redacted before being sent
 * to Sentry.
 */
const REDACTED_VALUE = '[REDACTED]';

/**
 * Simple marker returned when circular object references are encountered during
 * context sanitization.
 */
const CIRCULAR_REFERENCE_VALUE = '[CIRCULAR]';

/**
 * Marker returned when context traversal reaches the configured recursion limit.
 */
const TRUNCATED_VALUE = '[TRUNCATED]';

/**
 * Maximum object/array nesting depth processed when sanitizing extra context
 * before capture.
 */
const MAX_REDACTION_DEPTH = 6;

/**
 * Regex covering common sensitive key names that should never be sent to
 * Sentry payloads.
 */
const SENSITIVE_KEY_PATTERN = /(token|password|authorization|cookie|secret|session|api[-_]?key)/i;

/**
 * Primitive input values accepted in dynamic Sentry tag maps.
 */
type TagValue = string | number | boolean | null | undefined;

/**
 * Context accepted by {@link captureUnexpectedError}.
 */
export interface CaptureUnexpectedErrorContext {
    /**
     * Logical layer where the error occurred (for example: `client`, `route`,
     * `server-action`, `service`).
     */
    layer?: string;
    /**
     * High-level action associated with the failing operation.
     */
    action?: string;
    /**
     * Component name when capture happens in the React layer.
     */
    component?: string;
    /**
     * Route or endpoint identifier associated with the error.
     */
    route?: string;
    /**
     * Optional additional tag values.
     */
    tags?: Record<string, TagValue>;
    /**
     * Optional additional context, sanitized before being attached to Sentry.
     */
    extra?: Record<string, unknown>;
    /**
     * Optional fingerprint override for grouping customization.
     */
    fingerprint?: string[];
}

/**
 * Returns whether a key should be treated as sensitive and therefore redacted
 * from Sentry extras.
 *
 * @param key Field name to inspect.
 * @returns `true` when the key matches known sensitive patterns.
 */
export const isSensitiveKey = (key: string): boolean =>
    SENSITIVE_KEY_PATTERN.test(key);

/**
 * Type guard for non-null plain object-like records.
 *
 * @param value Unknown value to inspect.
 * @returns `true` when the value is an object record.
 */
const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

/**
 * Redacts sensitive values and recursively sanitizes nested data before it is
 * attached to Sentry as `extra` context.
 *
 * @param value Input value to sanitize.
 * @param depth Current recursion depth.
 * @param seen Set used to detect circular references.
 * @returns Sanitized value safe for observability payloads.
 */
const sanitizeExtraValue = (
    value: unknown,
    depth: number,
    seen: WeakSet<object>,
): unknown => {
    if (depth >= MAX_REDACTION_DEPTH) {
        return TRUNCATED_VALUE;
    }

    if (!isObjectRecord(value)) {
        return value;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (value instanceof Error) {
        return {
            name: value.name,
            message: value.message,
        };
    }

    if (seen.has(value)) {
        return CIRCULAR_REFERENCE_VALUE;
    }
    seen.add(value);

    if (Array.isArray(value)) {
        return value.map((entry) =>
            sanitizeExtraValue(entry, depth + 1, seen));
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, entryValue] of Object.entries(value)) {
        sanitized[key] = isSensitiveKey(key) ?
            REDACTED_VALUE :
            sanitizeExtraValue(entryValue, depth + 1, seen);
    }

    return sanitized;
};

/**
 * Converts a tag value to a Sentry-compatible string, dropping nullish values.
 *
 * @param value Tag value candidate.
 * @returns Normalized string value or `undefined` when the value should be
 * omitted.
 */
const toTagString = (value: TagValue): string | undefined => {
    if (value == null) {
        return undefined;
    }
    return String(value);
};

/**
 * Builds a normalized tag object for Sentry capture from fixed and dynamic
 * context properties.
 *
 * @param error Original thrown value.
 * @param context Capture context metadata.
 * @returns Record of normalized Sentry tags.
 */
const buildTags = (
    error: unknown,
    context: CaptureUnexpectedErrorContext,
): Record<string, string> => {
    const tags: Record<string, string> = {};
    const fixedTags = {
        layer: context.layer,
        action: context.action,
        component: context.component,
        route: context.route,
    };

    for (const [key, value] of Object.entries(fixedTags)) {
        const normalized = toTagString(value);
        if (normalized !== undefined) {
            tags[key] = normalized;
        }
    }

    for (const [key, value] of Object.entries(context.tags ?? {})) {
        const normalized = toTagString(value);
        if (normalized !== undefined) {
            tags[key] = normalized;
        }
    }

    if (isAppError(error)) {
        tags.app_error_code = error.code;
    }

    return tags;
};

/**
 * Normalizes non-Error throwables to Error instances so stack/error semantics
 * are consistent in Sentry.
 *
 * @param error Unknown thrown value.
 * @returns Error instance suitable for Sentry capture.
 */
const toThrowableError = (error: unknown): Error => {
    if (error instanceof Error) {
        return error;
    }
    return new Error('Non-Error value thrown.', { cause: error });
};

/**
 * Captures only unexpected failures to Sentry with common tagging and sanitized
 * context.
 *
 * Expected errors are skipped intentionally to reduce noise and free-tier quota
 * burn. The function returns a boolean to make this behaviour testable and to
 * allow callers to branch if needed.
 *
 * @param error Unknown thrown value to evaluate for capture.
 * @param context Optional capture context (tags, extras, fingerprints).
 * @returns `true` when an event was captured; otherwise `false`.
 */
export const captureUnexpectedError = (
    error: unknown,
    context: CaptureUnexpectedErrorContext = {},
): boolean => {
    if (isExpectedError(error)) {
        return false;
    }

    const throwable = toThrowableError(error);
    const tags = buildTags(error, context);
    /**
     * Tracks visited objects during sanitization to detect circular references
     * across all values processed for this capture operation.
     */
    const visitedObjects = new WeakSet<object>();
    const extra = sanitizeExtraValue(context.extra ?? {}, 0, visitedObjects);
    const extraRecord = isObjectRecord(extra) ? { ...extra } : {};

    if (!(error instanceof Error)) {
        extraRecord.thrownValue = sanitizeExtraValue(error, 0, visitedObjects);
    }

    Sentry.captureException(throwable, {
        tags: Object.keys(tags).length > 0 ? tags : undefined,
        extra: Object.keys(extraRecord).length > 0 ? extraRecord : undefined,
        fingerprint: context.fingerprint,
    });

    return true;
};
