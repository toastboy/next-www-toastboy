import 'server-only';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, type ContainerClient } from '@azure/storage-blob';
import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';

import { normalizeUnknownError } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { getSecrets } from '@/lib/secrets';

interface AuthExportDeps {
    prisma: typeof prisma;
}

const defaultDeps: AuthExportDeps = {
    prisma,
};

/**
 * Writes the result of a Prisma `findMany` query to Azure Blob Storage as a
 * JSON file.
 *
 * @typeParam T - The Prisma model type returned by the `findMany` query.
 * @param containerClient - The Azure `ContainerClient` used to access blob
 * storage.
 * @param fileName - The name of the JSON file to create in the blob container.
 * @param prismaModel - An object exposing a `findMany` method that retrieves
 * data from Prisma.
 * @throws Throws an error if retrieval from Prisma or upload to blob storage
 * fails.
 */
async function writeTableToJSONBlob<T>(
    containerClient: ContainerClient,
    fileName: string,
    prismaModel: {
        findMany: () => Prisma.PrismaPromise<T[]>;
    },
) {
    const data = await prismaModel.findMany();
    const json = JSON.stringify(data, null, 2);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.upload(json, Buffer.byteLength(json));
}

/**
 * Exports authentication-related data from Prisma database tables to JSON blobs
 * in Azure Blob Storage.
 *
 * Retrieves Azure credentials and storage configuration from environment
 * secrets, initializes a connection to Azure Blob Storage, and exports the
 * `account`, `user`, and `verification` tables as JSON files to the specified
 * container.
 *
 * @param {AuthExportDeps} [deps=defaultDeps] - Dependency object containing
 *        Prisma client and other services. Defaults to `defaultDeps` if not
 *        provided.
 *
 * @returns {Promise<void>} A promise that resolves when all tables have been
 * successfully exported.
 *
 * @throws {Error} Throws an error if:
 *   - Required Azure credentials or storage configuration are missing or
 *     invalid
 *   - Authentication with Azure fails
 *   - Blob upload operations fail
 *   - Database query operations fail
 *
 * @example
 * ```typescript
 * await authExportCore();
 * // Exports account, user, and verification tables to Azure Blob Storage
 * ```
 */
export async function authExportCore(deps: AuthExportDeps = defaultDeps): Promise<void> {
    const secrets = getSecrets();
    const tenantId = secrets.AZURE_TENANT_ID ?? '';
    const clientId = secrets.AZURE_CLIENT_ID ?? '';
    const clientSecret = secrets.AZURE_CLIENT_SECRET ?? '';
    const storageAccountName = secrets.AZURE_STORAGE_ACCOUNT_NAME ?? '';
    const containerName = secrets.AZURE_CONTAINER_NAME ?? '';

    try {
        const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const blobServiceClient = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net`,
            credentials,
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        await writeTableToJSONBlob(containerClient, 'account.json', deps.prisma.account);
        await writeTableToJSONBlob(containerClient, 'user.json', deps.prisma.user);
        await writeTableToJSONBlob(containerClient, 'verification.json', deps.prisma.verification);
    } catch (error) {
        const normalizedError = normalizeUnknownError(error, {
            details: {
                storageAccountName,
                containerName,
            },
        });
        captureUnexpectedError(normalizedError, {
            layer: 'server-action',
            action: 'authExportCore',
            extra: {
                storageAccountName,
                containerName,
            },
        });
        throw normalizedError;
    }
}
