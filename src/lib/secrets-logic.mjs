import fs from 'fs';
import path from "path";

/**
 * Configuration and secrets populated initially from environment variables -
 * these will be overridden by mounted secrets from the filesystem if SECRETS_DIR
 * is set to their location.
 *
 * @typedef {Object} Secrets
 * @property {string|undefined} DATABASE_URL - Database connection URL (from process.env.DATABASE_URL).
 * @property {string|undefined} AZURE_CLIENT_ID - Azure AD client/application ID.
 * @property {string|undefined} AZURE_CLIENT_SECRET - Azure AD client secret.
 * @property {string|undefined} AZURE_CONTAINER_NAME - Azure Blob Storage container name.
 * @property {string|undefined} AZURE_STORAGE_ACCOUNT_NAME - Azure storage account name.
 * @property {string|undefined} AZURE_TENANT_ID - Azure tenant ID.
 * @property {string|undefined} BETTER_AUTH_SECRET - Secret used by the Better Auth system.
 * @property {string} BETTER_AUTH_URL - Base URL for the Better Auth service (defaults to 'http://localhost:3000' if not set).
 * @property {string|undefined} GOOGLE_CLIENT_ID - Google OAuth client ID.
 * @property {string|undefined} GOOGLE_CLIENT_SECRET - Google OAuth client secret.
 * @property {string|undefined} MICROSOFT_CLIENT_ID - Microsoft OAuth client ID.
 * @property {string|undefined} MICROSOFT_CLIENT_SECRET - Microsoft OAuth client secret.
 * @property {string|undefined} SENTRY_AUTH_TOKEN - Authentication token for Sentry.
 * @property {string} MAIL_FROM_ADDRESS - Default sender email address (defaults to 'footy@toastboy.co.uk').
 * @property {string} MAIL_FROM_NAME - Default sender display name (defaults to 'Toastboy FC Mailer').
 * @property {string} SMTP_HOST - SMTP host for outgoing mail (defaults to 'toastboy-co-uk.mail.protection.outlook.com').
 */
const secrets = {
    DATABASE_URL: process.env.DATABASE_URL,

    AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
    AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,

    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS ?? 'footy@toastboy.co.uk',
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME ?? 'Toastboy FC Mailer',
    SMTP_HOST: process.env.SMTP_HOST ?? 'toastboy-co-uk.mail.protection.outlook.com',
};

let cachedSecrets = null;

/**
 * Synchronously reads a UTF-8 encoded file and returns its contents, or `undefined` if the file does not exist.
 *
 * The function uses a synchronous filesystem read and treats an ENOENT error (file not found) specially by
 * returning `undefined`. For any other filesystem error, it throws a new Error that includes the provided
 * file path and the original error message (when available).
 *
 * @param {string} filePath - Path to the file to read.
 * @returns {string|undefined} The file contents as a UTF-8 string, or `undefined` if the file does not exist.
 * @throws {Error} If a filesystem error other than ENOENT occurs. The thrown Error's message will include the file path and the underlying error message when available.
 *
 * @example
 * // Returns file contents as a string, or undefined if the file is missing.
 * const contents = readFileIfExists('/path/to/secret.txt');
 */
function readFileIfExists(filePath) {
    try {
        return fs.readFileSync(filePath, "utf8");
    }
    catch (error) {
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error).code === "ENOENT") {
            return undefined;
        }

        const message = error instanceof Error ? error.message : "Unknown filesystem error";
        throw new Error(`Failed to read secret file at ${filePath}: ${message}`);
    }
}

/**
 * Load all secrets once and cache in memory. If SECRETS_DIR is set,
 * override any secrets with files from that directory.
 *
 * @returns {Secrets} The loaded secrets.
 */
export function getSecrets() {
    if (cachedSecrets !== null) {
        return cachedSecrets;
    }

    const result = { ...secrets };
    const secretsDir = process.env.SECRETS_DIR;

    if (secretsDir) {
        for (const key of Object.keys(secrets)) {
            const value = readFileIfExists(path.join(secretsDir, key));

            if (value !== undefined) {
                result[key] = value;
            }
        }
    }

    cachedSecrets = result;
    return cachedSecrets;
}
