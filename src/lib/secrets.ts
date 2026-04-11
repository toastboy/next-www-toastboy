import 'server-only';

import * as fs from 'fs';
import * as path from 'path';

import { InternalError, normalizeUnknownError } from '@/lib/errors';

const secrets = {
    STORAGE_CLIENT_ID: process.env.STORAGE_CLIENT_ID,
    STORAGE_CLIENT_SECRET: process.env.STORAGE_CLIENT_SECRET,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        'http://localhost:3000',

    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,

    AUTH_MICROSOFT_CLIENT_ID: process.env.AUTH_MICROSOFT_CLIENT_ID,
    AUTH_MICROSOFT_CLIENT_SECRET: process.env.AUTH_MICROSOFT_CLIENT_SECRET,

    CRON_SECRET: process.env.CRON_SECRET,

    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS ?? 'footy@toastboy.co.uk',
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME ?? 'Toastboy FC Mailer',
    MAIL_GRAPH_CLIENT_ID: process.env.MAIL_GRAPH_CLIENT_ID,
    MAIL_GRAPH_CLIENT_SECRET: process.env.MAIL_GRAPH_CLIENT_SECRET,
};

/**
 * Secrets that are only required in production (e.g. Graph API email credentials).
 * These are allowed to be missing in development and CI environments.
 */
const productionOnlySecrets: ReadonlySet<keyof typeof secrets> = new Set([
    'MAIL_GRAPH_CLIENT_ID',
    'MAIL_GRAPH_CLIENT_SECRET',
]);

let cachedSecrets: typeof secrets | null = null;

function readFileIfExists(filePath: string): string | undefined {
    try {
        return fs.readFileSync(filePath, "utf8");
    }
    catch (error: unknown) {
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "ENOENT") {
            return undefined;
        }

        throw normalizeUnknownError(error, {
            message: `Failed to read secret file at ${filePath}.`,
            details: {
                filePath,
            },
        });
    }
}

/**
 * Load all secrets once and cache in memory.
 */
export function getSecrets(): typeof secrets {
    if (cachedSecrets !== null) {
        return cachedSecrets;
    }

    const result = { ...secrets };
    const secretsDir = process.env.SECRETS_DIR;

    if (secretsDir) {
        for (const key of Object.keys(secrets) as (keyof typeof secrets)[]) {
            const value = readFileIfExists(path.join(secretsDir, key));

            if (value !== undefined) {
                result[key] = value;
            }
        }
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const missingSecrets = Object.entries(result)
        .filter(([key, value]) => {
            const isMissing = value === undefined || value === null || value === '';
            if (!isMissing) return false;

            // Production-only secrets (e.g. Graph API email) are allowed to be
            // absent outside production; all other secrets are always required.
            if (!isProduction && productionOnlySecrets.has(key as keyof typeof secrets)) {
                return false;
            }

            return true;
        })
        .map(([key]) => key);

    if (missingSecrets.length > 0 && process.env.NODE_ENV !== 'test') {
        throw new InternalError('Missing required secrets.', {
            details: {
                missingSecrets,
            },
        });
    }

    cachedSecrets = result;
    return cachedSecrets;
}
