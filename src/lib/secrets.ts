import 'server-only';

import * as fs from 'fs';
import * as path from 'path';

const secrets = {
    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL
        ?? process.env.NEXT_PUBLIC_SITE_URL
        ?? 'http://localhost:3000',

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,

    CRON_SECRET: process.env.CRON_SECRET,

    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS ?? 'footy@toastboy.co.uk',
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME ?? 'Toastboy FC Mailer',
    SMTP_HOST: process.env.SMTP_HOST ?? 'toastboy-co-uk.mail.protection.outlook.com',
};

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

        const message = error instanceof Error ? error.message : "Unknown filesystem error";
        throw new Error(`Failed to read secret file at ${filePath}: ${message}`);
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

    const missingSecrets = Object.entries(result)
        .filter(([, value]) => value === undefined || value === null || value === '')
        .map(([key]) => key);

    if (missingSecrets.length > 0 && process.env.NODE_ENV !== 'test') {
        throw new Error(`Missing required secrets: ${missingSecrets.join(', ')}`);
    }

    cachedSecrets = result;
    return cachedSecrets;
}
