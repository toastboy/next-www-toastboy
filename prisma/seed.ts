import 'dotenv/config';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Prisma, PrismaClient } from 'prisma/generated/client';
import { AUTH_TABLES, GAME_DATA_TABLES } from './table-manifest';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

async function downloadAndParseJson(containerClient: ContainerClient, blobName: string): Promise<unknown> {
    try {
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadBlockBlobResponse = await blobClient.download(0);

        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error(`Reading  ${blobName} failed`);
        }

        const downloadedContent = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();

        return JSON.parse(downloadedContent);
    } catch (error) {
        console.error(`An error occurred during ${blobName} download: ${error}`);
        throw error;
    }
}

// Chunks per INSERT to stay within MariaDB's max_allowed_packet limit.
const CHUNK_SIZE = 500;

async function seedTable(
    containerClient: ContainerClient,
    fileName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: { createMany: (args: { data: any[] }) => Prisma.PrismaPromise<Prisma.BatchPayload> },
): Promise<void> {
    console.log(`Starting: ${fileName}`);
    const parsed = await downloadAndParseJson(containerClient, fileName);
    if (!Array.isArray(parsed)) {
        throw new Error(`Expected ${fileName} to contain a JSON array, got ${typeof parsed}`);
    }
    const dataItems: unknown[] = parsed;
    const chunks: Prisma.PrismaPromise<Prisma.BatchPayload>[] = [];
    for (let i = 0; i < dataItems.length; i += CHUNK_SIZE) {
        chunks.push(model.createMany({ data: dataItems.slice(i, i + CHUNK_SIZE) }));
    }
    await prisma.$transaction(chunks, { timeout: 120_000 });
    console.log(`Complete:  ${fileName}`);
}

async function main() {
    console.log('🌱 Seed script started');

    // Read secrets directly from environment - works in any environment
    const tenantId = process.env.AZURE_TENANT_ID;
    if (!tenantId) throw new Error('AZURE_TENANT_ID undefined');

    const clientId = process.env.STORAGE_CLIENT_ID;
    if (!clientId) throw new Error('STORAGE_CLIENT_ID undefined');

    const clientSecret = process.env.STORAGE_CLIENT_SECRET;
    if (!clientSecret) throw new Error('STORAGE_CLIENT_SECRET undefined');

    const storageAccountName = 'nextwwwtoastboy';
    const containerName = 'dbseeddata';

    const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net`,
        credentials,
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Delete non-seeded tables that reference seeded rows before wiping the seeded tables.
    // contactEnquiry must precede emailVerification (FK reference).
    await prisma.contactEnquiry.deleteMany();
    await prisma.emailVerification.deleteMany();
    await prisma.gameInvitation.deleteMany();
    for (const { getModel } of [...GAME_DATA_TABLES].reverse()) {
        await getModel(prisma).deleteMany();
    }

    for (const { fileName, getModel } of GAME_DATA_TABLES) {
        await seedTable(containerClient, fileName, getModel(prisma));
    }

    // session references user; deleteMany does not trigger the onDelete:Cascade
    // emulated by relationMode=prisma, so it must be cleared explicitly.
    await prisma.session.deleteMany();
    for (const { getModel } of [...AUTH_TABLES].reverse()) {
        await getModel(prisma).deleteMany();
    }
    for (const { fileName, getModel } of AUTH_TABLES) {
        await seedTable(containerClient, fileName, getModel(prisma));
    }

    console.log('🌱 Database seeding complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
