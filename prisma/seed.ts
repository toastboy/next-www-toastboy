import 'dotenv/config';

import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Account, Prisma, PrismaClient, User, Verification } from 'prisma/generated/client';
import { ArseType } from 'prisma/zod/schemas/models/Arse.schema';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import { ClubSupporterType } from 'prisma/zod/schemas/models/ClubSupporter.schema';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';
import { CountrySupporterType } from 'prisma/zod/schemas/models/CountrySupporter.schema';
import { GameChatType } from 'prisma/zod/schemas/models/GameChat.schema';
import { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

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

async function processJsonData<T>(
    containerClient: ContainerClient,
    fileName: string,
    prismaModel: {
        create: (data: { data: T }) => Prisma.PrismaPromise<T>;
    },
) {
    console.log(`Starting: ${fileName}`);
    const dataItems: T[] = await downloadAndParseJson(containerClient, fileName) as T[];
    for (const item of dataItems) {
        await prismaModel.create({ data: item });
    }
    console.log(`Complete:  ${fileName}`);
}

async function main() {
    // Read secrets directly from environment - works in any environment
    const tenantId = process.env.AZURE_TENANT_ID;
    if (!tenantId) throw new Error('AZURE_TENANT_ID undefined');

    const clientId = process.env.AZURE_CLIENT_ID;
    if (!clientId) throw new Error('AZURE_CLIENT_ID undefined');

    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    if (!clientSecret) throw new Error('AZURE_CLIENT_SECRET undefined');

    const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!storageAccountName) throw new Error('AZURE_STORAGE_ACCOUNT_NAME undefined');

    const containerName = process.env.AZURE_CONTAINER_NAME;
    if (!containerName) throw new Error('AZURE_CONTAINER_NAME undefined');

    const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net`,
        credentials,
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // We have to be careful to empty existing tables in the right order for the
    // foreign key constraints
    await prisma.arse.deleteMany();
    await prisma.clubSupporter.deleteMany();
    await prisma.club.deleteMany();
    await prisma.countrySupporter.deleteMany();
    await prisma.country.deleteMany();
    await prisma.gameChat.deleteMany();
    await prisma.invitation.deleteMany();
    await prisma.outcome.deleteMany();
    await prisma.playerRecord.deleteMany();
    await prisma.gameDay.deleteMany();
    await prisma.diffs.deleteMany();
    await prisma.picker.deleteMany();
    await prisma.pickerTeams.deleteMany();
    await prisma.player.deleteMany();

    // Now we must populate the tables in the reverse of the order above
    await processJsonData<GameDayType>(containerClient, "GameDay.json", prisma.gameDay);
    await processJsonData<PlayerType>(containerClient, "Player.json", prisma.player);
    await processJsonData<PlayerRecordType>(containerClient, "PlayerRecord.json", prisma.playerRecord);
    await processJsonData<OutcomeType>(containerClient, "Outcome.json", prisma.outcome);
    await processJsonData<GameChatType>(containerClient, "GameChat.json", prisma.gameChat);
    await processJsonData<CountryType>(containerClient, "Country.json", prisma.country);
    await processJsonData<CountrySupporterType>(containerClient, "CountrySupporter.json", prisma.countrySupporter);
    await processJsonData<ClubType>(containerClient, "Club.json", prisma.club);
    await processJsonData<ClubSupporterType>(containerClient, "ClubSupporter.json", prisma.clubSupporter);
    await processJsonData<ArseType>(containerClient, "Arse.json", prisma.arse);

    // Finally, the auth tables
    await processJsonData<Account>(containerClient, "account.json", prisma.account);
    await processJsonData<User>(containerClient, "user.json", prisma.user);
    await processJsonData<Verification>(containerClient, "verification.json", prisma.verification);

    console.log('Database seeding complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
