'use server';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import prisma from 'lib/prisma';
import { getSecrets } from 'lib/secrets';
import { Prisma } from 'prisma/generated/client';

/**
 * Writes the results of a Prisma model query to an Azure Blob as a
 * pretty-printed JSON file.
 *
 * This function calls the provided Prisma model's `findMany` method to retrieve
 * all records, serializes the resulting array to JSON (2-space indentation),
 * and uploads the JSON content to the specified blob within the provided Azure
 * `ContainerClient`.
 *
 * @typeParam T - The TypeScript type of the records returned by the Prisma
 * model.
 *
 * @param containerClient - An instance of `ContainerClient` from
 *   `@azure/storage-blob` used to obtain a `BlockBlobClient` for uploading the
 *   file.
 * @param fileName - The destination blob name (can include path segments) to
 *   create or overwrite in the target container.
 * @param prismaModel - An object exposing a `findMany` method that returns a
 *   `Prisma.PrismaPromise<T[]>`. The function will invoke `findMany()` to fetch
 *   all rows to be exported.
 *
 * @returns A promise that resolves when the upload completes.
 *
 * @throws Any error thrown by the Prisma client's `findMany` call or by the
 *   blob upload. Errors are logged to the console and re-thrown to the caller.
 *
 * @remarks
 * - The JSON is generated with `JSON.stringify(data, null, 2)` which produces
 *   human-readable output.
 * - The current implementation buffers the entire JSON in memory and uses
 *   `Buffer.byteLength` to determine the upload size. For very large tables
 *   consider streaming, pagination, or using `BlockBlobClient.uploadStream` /
 *   chunked uploads to reduce memory usage.
 * - Ensure appropriate authentication/permissions are configured for the
 *   provided `ContainerClient`.
 *
 * @example
 * const containerClient = blobServiceClient.getContainerClient('exports');
 * await writeTableToJSONBlob(containerClient, 'users.json', { findMany: () => prisma.user.findMany() });
 */
async function writeTableToJSONBlob<T>(
    containerClient: ContainerClient,
    fileName: string,
    prismaModel: {
        findMany: () => Prisma.PrismaPromise<T[]>;
    },
) {
    try {
        const data = await prismaModel.findMany();
        const json = JSON.stringify(data, null, 2);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.upload(json, Buffer.byteLength(json));
    }
    catch (error) {
        console.error(`Error writing ${fileName} to blob storage:`, error);
        throw error;
    }
}

/**
 * Export Better Auth authentication-related database tables to Azure Blob
 * Storage as JSON files.
 *
 * This function:
 * - Reads required Azure credentials and storage configuration from
 *   getSecrets(). Required secret keys: AZURE_TENANT_ID, AZURE_CLIENT_ID,
 *   AZURE_CLIENT_SECRET, AZURE_STORAGE_ACCOUNT_NAME, AZURE_CONTAINER_NAME.
 * - Constructs an Azure ClientSecretCredential and BlobServiceClient for the
 *   target storage account and container.
 * - Writes the contents of the `prisma.account`, `prisma.user`, and
 *   `prisma.verification` tables to the container as `account.json`,
 *   `user.json`, and `verification.json` using writeTableToJSONBlob.
 *
 * Note: getSecrets, writeTableToJSONBlob, ClientSecretCredential,
 * BlobServiceClient, and the prisma models are external dependencies and must
 * be available in the runtime environment.
 *
 * @returns A promise that resolves when all three table exports have been
 * written.
 * @throws Rethrows any error encountered during secret retrieval, Azure
 *         authentication, container access, or blob writing. Errors are also
 *         logged to the console.
 *
 * @example
 * await authExport();
 *
 * @see writeTableToJSONBlob
 */
export async function authExport(): Promise<void> {
    try {
        const secrets = getSecrets();
        const tenantId = secrets.AZURE_TENANT_ID ?? '';
        const clientId = secrets.AZURE_CLIENT_ID ?? '';
        const clientSecret = secrets.AZURE_CLIENT_SECRET ?? '';
        const storageAccountName = secrets.AZURE_STORAGE_ACCOUNT_NAME ?? '';
        const containerName = secrets.AZURE_CONTAINER_NAME ?? '';

        const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const blobServiceClient = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net`,
            credentials,
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        await writeTableToJSONBlob(containerClient, 'account.json', prisma.account);
        await writeTableToJSONBlob(containerClient, 'user.json', prisma.user);
        await writeTableToJSONBlob(containerClient, 'verification.json', prisma.verification);
    }
    catch (error) {
        console.error('Error exporting auth data:', error);
        throw error;
    }
}
