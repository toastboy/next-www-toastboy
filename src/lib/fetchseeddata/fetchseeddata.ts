import { ClientSecretCredential } from '@azure/identity';
import type { ContainerClient } from '@azure/storage-blob';
import { BlobServiceClient } from '@azure/storage-blob';
import * as fs from 'fs';
import * as path from 'path';
import { GAME_DATA_TABLES } from 'prisma/table-manifest';
import { fileURLToPath } from 'url';

const STORAGE_ACCOUNT = 'nextwwwtoastboy';
const CONTAINER = 'dbseeddata';

const OUTPUT_DIR = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../../db-snapshot',
);

function createContainerClient(): ContainerClient {
    const tenantId = process.env.AZURE_TENANT_ID;
    if (!tenantId) throw new Error('AZURE_TENANT_ID undefined');

    const clientId = process.env.STORAGE_CLIENT_ID;
    if (!clientId) throw new Error('STORAGE_CLIENT_ID undefined');

    const clientSecret = process.env.STORAGE_CLIENT_SECRET;
    if (!clientSecret) throw new Error('STORAGE_CLIENT_SECRET undefined');

    const credentials = new ClientSecretCredential(
        tenantId,
        clientId,
        clientSecret,
    );
    const blobServiceClient = new BlobServiceClient(
        `https://${STORAGE_ACCOUNT}.blob.core.windows.net`,
        credentials,
    );
    return blobServiceClient.getContainerClient(CONTAINER);
}

async function downloadTable(
    containerClient: ContainerClient,
    fileName: string,
): Promise<void> {
    console.log(`Fetching ${fileName}...`);
    await containerClient
        .getBlockBlobClient(fileName)
        .downloadToFile(path.join(OUTPUT_DIR, fileName));
}

/**
 * Downloads the game-data seed tables (players, game days, outcomes, etc.)
 * from Azure Blob Storage into a local, gitignored directory, so an agent
 * can inspect realistic data without a running dev DB or standing credential
 * access. Deliberately excludes AUTH_TABLES (user/account/verification) —
 * those are real Better Auth records and have no business sitting on disk
 * as flat files, even gitignored ones. Intended to be run manually by a
 * human via `op run`, never invoked automatically by an agent.
 */
async function main() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const containerClient = createContainerClient();
    for (const { fileName } of GAME_DATA_TABLES) {
        await downloadTable(containerClient, fileName);
    }
    console.log(`✅ Snapshot fetched to ${OUTPUT_DIR}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    void main().catch((error) => {
        console.error('An unexpected error occurred:', error);
        process.exitCode = 1;
    });
}

// To run: `op run --env-file ./.env -- npm run fetchseeddata`
