import 'dotenv/config';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import * as fs from 'fs';
import { mkdtemp, readdir } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { AUTH_TABLES, GAME_DATA_TABLES } from 'prisma/table-manifest';
import { fileURLToPath } from 'url';

const STORAGE_ACCOUNT = 'nextwwwtoastboy';
const CONTAINER = 'dbseeddata';

async function writeTableToJSONFile<T>(
    tmpDir: string,
    fileName: string,
    prismaModel: { findMany: () => Prisma.PrismaPromise<T[]> },
) {
    console.log(`Exporting ${fileName}...`);
    const data = await prismaModel.findMany();
    fs.writeFileSync(path.join(tmpDir, fileName), JSON.stringify(data, null, 2));
}

async function uploadDir(containerClient: ContainerClient, tmpDir: string) {
    const files = await readdir(tmpDir);
    for (const file of files) {
        console.log(`Uploading ${file}...`);
        await containerClient.getBlockBlobClient(file).uploadFile(path.join(tmpDir, file));
    }
}

/**
 * Exports the three Better Auth tables (user, account, verification) to blob
 * storage. Called by importlivedb before its database reset so that any player
 * accounts claimed since the previous run are preserved across the wipe.
 */
export async function exportAuthTables(containerClient: ContainerClient): Promise<void> {
    const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'exportdb-auth-'));
    try {
        for (const { fileName, getModel } of AUTH_TABLES) {
            await writeTableToJSONFile(tmpDir, fileName, getModel(prisma) as { findMany: () => Prisma.PrismaPromise<object[]> });
        }
        await uploadDir(containerClient, tmpDir);
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
}

/**
 * Exports every table that seed.ts seeds, covering legacy data, player
 * records, and Better Auth tables. Excludes ephemeral tables (Session) and
 * short-lived-token tables (GameInvitation, EmailVerification, ContactEnquiry).
 *
 * This is the post-migration replacement for the export phase of importlivedb:
 * run it periodically against the live database to keep blob storage current
 * for backups and container-upgrade reseeds.
 */
export async function exportAllTables(containerClient: ContainerClient): Promise<void> {
    const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'exportdb-'));
    try {
        for (const { fileName, getModel } of [...GAME_DATA_TABLES, ...AUTH_TABLES]) {
            await writeTableToJSONFile(tmpDir, fileName, getModel(prisma) as { findMany: () => Prisma.PrismaPromise<object[]> });
        }
        await uploadDir(containerClient, tmpDir);
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
}

function createContainerClient(): ContainerClient {
    const tenantId = process.env.AZURE_TENANT_ID;
    if (!tenantId) throw new Error('AZURE_TENANT_ID undefined');

    const clientId = process.env.STORAGE_CLIENT_ID;
    if (!clientId) throw new Error('STORAGE_CLIENT_ID undefined');

    const clientSecret = process.env.STORAGE_CLIENT_SECRET;
    if (!clientSecret) throw new Error('STORAGE_CLIENT_SECRET undefined');

    const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const blobServiceClient = new BlobServiceClient(
        `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
        credentials,
    );
    return blobServiceClient.getContainerClient(CONTAINER);
}

async function main() {
    const containerClient = createContainerClient();
    await exportAllTables(containerClient);
    console.log('✅ Export complete.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    void main()
        .catch((error) => {
            console.error('An unexpected error occurred:', error);
            process.exitCode = 1;
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

// To run: `op run --env-file ./.env -- npm run exportdb`
