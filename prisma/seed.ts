import { arse, club_supporter, club, country, game_chat, game_day, invitation, nationality, outcome, player, standings } from '@prisma/client';
import prisma from '../src/lib/prisma';
import { Prisma } from '@prisma/client';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';

async function downloadAndParseJson(containerClient: ContainerClient, blobName: string): Promise<unknown> {
    try {
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadBlockBlobResponse = await blobClient.download(0);

        if (!downloadBlockBlobResponse.readableStreamBody) {
            throw new Error("Reading " + blobName + " failed");
        }

        const downloadedContent = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();

        return JSON.parse(downloadedContent);
    } catch (error) {
        console.error("An error occurred during download: ", error);
        throw error;
    }
}

// TODO: Use utility function
async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        readableStream.on('data', (data: Buffer | string) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

async function processJsonData<T>(
    containerClient: ContainerClient,
    fileName: string,
    prismaModel: {
        create: (data: { data: T }) => Prisma.PrismaPromise<T>;
    }
) {
    const dataItems: T[] = await downloadAndParseJson(containerClient, fileName) as T[];
    for (const item of dataItems) {
        await prismaModel.create({ data: item });
    }
    console.log("Complete: " + fileName);
}

async function main() {
    const tenantId = process.env.AZURE_TENANT_ID;
    if (!tenantId) {
        throw new Error('AZURE_TENANT_ID undefined');
    }

    const clientId = process.env.AZURE_CLIENT_ID;
    if (!clientId) {
        throw new Error('AZURE_CLIENT_ID undefined');
    }

    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    if (!clientSecret) {
        throw new Error('AZURE_CLIENT_SECRET undefined');
    }

    const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!storageAccountName) {
        throw new Error('AZURE_STORAGE_ACCOUNT_NAME undefined');
    }

    const containerName = process.env.AZURE_CONTAINER_NAME;
    if (!containerName) {
        throw new Error('AZURE_CONTAINER_NAME undefined');
    }

    const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net`,
        credentials
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // We have to be careful to empty existing tables in the right order for the
    // foreign key constraints
    await prisma.arse.deleteMany();
    await prisma.club_supporter.deleteMany();
    await prisma.club.deleteMany();
    await prisma.nationality.deleteMany();
    await prisma.country.deleteMany();
    await prisma.game_chat.deleteMany();
    await prisma.invitation.deleteMany();
    await prisma.outcome.deleteMany();
    await prisma.standings.deleteMany();
    await prisma.game_day.deleteMany();
    await prisma.diffs.deleteMany();
    await prisma.picker.deleteMany();
    await prisma.picker_teams.deleteMany();
    await prisma.player.deleteMany();

    // Now we must populate the tables in the reverse of the order above
    await processJsonData<player>(containerClient, "players.json", prisma.player);
    await processJsonData<game_day>(containerClient, "game_days.json", prisma.game_day);
    await processJsonData<standings>(containerClient, "standings.json", prisma.standings);
    await processJsonData<outcome>(containerClient, "outcomes.json", prisma.outcome);
    await processJsonData<invitation>(containerClient, "invitations.json", prisma.invitation);
    await processJsonData<game_chat>(containerClient, "game_chats.json", prisma.game_chat);
    await processJsonData<country>(containerClient, "countries.json", prisma.country);
    await processJsonData<nationality>(containerClient, "nationalities.json", prisma.nationality);
    await processJsonData<club>(containerClient, "clubs.json", prisma.club);
    await processJsonData<club_supporter>(containerClient, "club_supporters.json", prisma.club_supporter);
    await processJsonData<arse>(containerClient, "arses.json", prisma.arse);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
