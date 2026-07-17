import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { readdir } from 'fs/promises';
import * as path from 'path';
import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { GAME_DATA_TABLES } from 'prisma/table-manifest';
import { fileURLToPath } from 'url';

import { exportAuthTables } from '@/lib/exportdb/exportdb';
import playerRecordService from '@/services/PlayerRecord';


const currentDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Writes the data from a Prisma model to a JSON file.
 *
 * @param fileName - The name of the JSON file to be created.
 * @param prismaModel - The Prisma model object with a `findMany` method.
 * @returns A Promise that resolves when the JSON file is written.
 */
async function writeTableToJSONFile<T>(
    fileName: string,
    prismaModel: {
        findMany: () => Prisma.PrismaPromise<T[]>;
    },
) {
    console.log(`Writing ${fileName}...`);
    const data = await prismaModel.findMany();
    writeDataToJSONFile(fileName, data);
}

interface PlayerExtraEmailSeed {
    playerId: number;
    email: string;
    verifiedAt?: Date | null;
}

function writeDataToJSONFile<T>(fileName: string, data: T[]) {
    const json = JSON.stringify(data, null, 2);
    const filePath = path.join('/tmp/importlivedb', `${fileName}`);
    fs.writeFileSync(filePath, json);
}

/**
 * Splits a comma-separated email string into a normalized list of emails.
 *
 * Normalization trims whitespace, removes empty entries, and lowercases all
 * email addresses.
 *
 * @param rawEmail - A comma-separated list of emails from legacy data.
 * @returns A normalized list of email addresses.
 */
function splitEmailList(rawEmail: string | null): string[] {
    if (!rawEmail) {
        return [];
    }
    return rawEmail
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email.length > 0)
        .map((email) => email.toLowerCase());
}


/**
 * Builds seed data for `account.email` and `playerExtraEmail` from legacy
 * player email values.
 *
 * The first unique email is treated as the account email and any remaining
 * unique emails are emitted as extra email rows. Duplicate emails already
 * assigned to another player are skipped.
 *
 * @param sources - Player IDs and raw legacy email strings.
 * @returns A map of primary account emails keyed by player ID and extra email
 * rows for seeding.
 */
function buildPlayerEmailSeeds(
    sources: { playerId: number; email: string | null }[],
): { accountEmailByPlayerId: Map<number, string>; extraEmailRows: PlayerExtraEmailSeed[] } {
    const extraEmailRows: PlayerExtraEmailSeed[] = [];
    const accountEmailByPlayerId = new Map<number, string>();
    const seen = new Map<string, number>();

    sources.forEach((source) => {
        const emails = Array.from(new Set(splitEmailList(source.email)));
        if (emails.length === 0) return;

        const [accountEmail, ...extraEmails] = emails;

        if (accountEmail) {
            const existing = seen.get(accountEmail);
            if (existing && existing !== source.playerId) {
                console.warn(`Skipping duplicate account email ${accountEmail} for player ${source.playerId}; already assigned to player ${existing}`);
            } else {
                seen.set(accountEmail, source.playerId);
                accountEmailByPlayerId.set(source.playerId, accountEmail);
            }
        }

        extraEmails.forEach((email) => {
            const existing = seen.get(email);
            if (existing && existing !== source.playerId) {
                console.warn(`Skipping duplicate extra email ${email} for player ${source.playerId}; already assigned to player ${existing}`);
                return;
            }

            seen.set(email, source.playerId);
            extraEmailRows.push({
                playerId: source.playerId,
                email,
            });
        });
    });

    return { accountEmailByPlayerId, extraEmailRows };
}

/**
 * Corrects `player.joined`/`player.finished` dates that are inconsistent with
 * the player's actual game history, e.g. a `joined` date that falls after the
 * date of a game the player has an outcome for. Such inconsistencies have been
 * seen in the legacy data (manually entered by league admins over many years)
 * and cause players to be silently excluded from parts of their own game
 * history — for example the profile heatmap, which bounds its date range by
 * `joined`/`finished`.
 *
 * Widens `joined` back to (or `finished` forward to) the earliest/latest game
 * day the player has an outcome for, logging a warning for every correction
 * made so it can be reviewed.
 *
 * @returns A promise that resolves once all inconsistent players have been
 * corrected.
 */
async function reconcilePlayerJoinedFinishedDates(): Promise<void> {
    console.log('Reconciling player joined/finished dates against actual game history...');

    const outcomes = await prisma.outcome.findMany({
        where: { gameDay: { game: true } },
        select: { playerId: true, gameDay: { select: { date: true } } },
    });

    const rangeByPlayer = new Map<number, { min: Date; max: Date }>();
    for (const { playerId, gameDay: { date } } of outcomes) {
        const existing = rangeByPlayer.get(playerId);
        if (!existing) {
            rangeByPlayer.set(playerId, { min: date, max: date });
        } else {
            if (date < existing.min) existing.min = date;
            if (date > existing.max) existing.max = date;
        }
    }

    const players = await prisma.player.findMany({
        where: { id: { in: Array.from(rangeByPlayer.keys()) } },
        select: { id: true, joined: true, finished: true },
    });

    for (const player of players) {
        const range = rangeByPlayer.get(player.id)!;
        const data: { joined?: Date; finished?: Date } = {};

        if (player.joined && player.joined > range.min) {
            console.warn(`Player ${player.id}: joined date ${player.joined.toISOString()} is after their earliest recorded game (${range.min.toISOString()}); correcting.`);
            data.joined = range.min;
        }
        if (player.finished && player.finished < range.max) {
            console.warn(`Player ${player.id}: finished date ${player.finished.toISOString()} is before their latest recorded game (${range.max.toISOString()}); correcting.`);
            data.finished = range.max;
        }

        if (Object.keys(data).length > 0) {
            await prisma.player.update({ where: { id: player.id }, data });
        }
    }
}

async function fetchLegacyPlayerEmailSources(): Promise<{ playerId: number; email: string | null }[]> {
    // The raw query here is OK because this is a temporary script and there is no user input
    const rows = await prisma.$queryRawUnsafe<{ id: number; email: string | null }[]>(
        'SELECT id, email FROM player',
    );

    return rows.map((row) => ({
        playerId: row.id,
        email: row.email ?? null,
    }));
}

/**
 * Imports a MySQL backup file and runs migrations to set up the database
 * structure. This is to support a non-standard workflow where the database is
 * backed up from a live server and imported into a local development
 * environment, and then all but the 'init' migration are run to make the
 * development database match the current development schema. This means I can
 * carry on developing the new website while new data is being added to the old
 * one, and then switch over when I'm ready.
 * @returns {Promise<void>} - A promise that resolves when the import and
 * migrations are completed.
 */
async function importBackup(): Promise<void> {
    try {
        // Get all MYSQL environment variables
        if (!process.env.IMP_PROD_MYSQL_USER) {
            throw new Error('IMP_PROD_MYSQL_USER undefined');
        }
        if (!process.env.IMP_PROD_MYSQL_HOST) {
            throw new Error('IMP_PROD_MYSQL_HOST undefined');
        }
        if (!process.env.IMP_PROD_MYSQL_PORT) {
            throw new Error('IMP_PROD_MYSQL_PORT undefined');
        }
        if (!process.env.IMP_PROD_MYSQL_PASSWORD) {
            throw new Error('IMP_PROD_MYSQL_PASSWORD undefined');
        }

        if (!process.env.IMP_DEV_MYSQL_USER) {
            throw new Error('IMP_DEV_MYSQL_USER undefined');
        }
        if (!process.env.IMP_DEV_MYSQL_HOST) {
            throw new Error('IMP_DEV_MYSQL_HOST undefined');
        }
        if (!process.env.IMP_DEV_MYSQL_PORT) {
            throw new Error('IMP_DEV_MYSQL_PORT undefined');
        }
        if (!process.env.IMP_DEV_MYSQL_PASSWORD) {
            throw new Error('IMP_DEV_MYSQL_PASSWORD undefined');
        }

        if (!process.env.IMP_AZURE_TENANT_ID) {
            throw new Error('IMP_AZURE_TENANT_ID undefined');
        }
        if (!process.env.IMP_AZURE_CLIENT_ID) {
            throw new Error('IMP_AZURE_CLIENT_ID undefined');
        }
        if (!process.env.IMP_AZURE_CLIENT_SECRET) {
            throw new Error('IMP_AZURE_CLIENT_SECRET undefined');
        }

        const prodMysqlUser = process.env.IMP_PROD_MYSQL_USER;
        const prodMysqlHost = process.env.IMP_PROD_MYSQL_HOST;
        const prodMysqlPort = process.env.IMP_PROD_MYSQL_PORT;
        const prodMysqlPassword = process.env.IMP_PROD_MYSQL_PASSWORD;

        const devMysqlUser = process.env.IMP_DEV_MYSQL_USER;
        const devMysqlHost = process.env.IMP_DEV_MYSQL_HOST;
        const devMysqlPort = process.env.IMP_DEV_MYSQL_PORT;
        const devMysqlPassword = process.env.IMP_DEV_MYSQL_PASSWORD;

        const mysqlDatabase = 'footy';

        const tenantId = process.env.IMP_AZURE_TENANT_ID;

        const clientId = process.env.IMP_AZURE_CLIENT_ID;
        const clientSecret = process.env.IMP_AZURE_CLIENT_SECRET;

        const storageAccountName = 'nextwwwtoastboy';
        const containerName = 'dbseeddata';

        const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const blobServiceClient = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net`,
            credentials,
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        const shellExec = (cmd: string) => {
            execSync(cmd, { stdio: 'inherit' });
        };

        // Take a backup of the current live database
        console.log('Taking production mysql backup...');
        shellExec(`mysqldump --skip-ssl -h ${prodMysqlHost} -P ${prodMysqlPort} -u ${prodMysqlUser} -p${prodMysqlPassword} ${mysqlDatabase} arse club club_supporter country diffs game_chat game_day invitation misc nationality outcome picker picker_teams player > /tmp/${mysqlDatabase}.sql`);

        // Get the list of directories in the migrations directory
        const migrationsDir = path.join(currentDir, '..', '..', '..', 'prisma', 'migrations');
        const migrations = await readdir(migrationsDir);

        // Run prisma generate to ensure the Prisma Client is up to date
        console.log('Running prisma generate...');
        shellExec('npx prisma generate --schema prisma/schema.prisma');

        // Run prisma db push to ensure the database is up to date with the schema
        console.log('Running prisma db push...');
        shellExec(`mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} -e'DROP DATABASE IF EXISTS footy;'`);
        shellExec(`mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} -e'CREATE DATABASE footy;'`);
        shellExec('npx prisma db push --accept-data-loss --schema prisma/schema.prisma');

        // Import the mysqldump backup created above
        console.log('Importing mysql backup...');
        shellExec(`cat /tmp/${mysqlDatabase}.sql | mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} ${mysqlDatabase}`);

        const legacyPlayerEmailSources = await fetchLegacyPlayerEmailSources();

        // Run each migration except the first one: the backup created the
        // database structure through the conditional comments such as '/*!40000
        // DROP DATABASE IF EXISTS `footy`*/;'
        for (let i = 1; i < migrations.length; i++) {
            if (migrations[i].endsWith('migration_lock.toml')) {
                continue;
            }
            console.log(`Running migration ${migrations[i]}...`);
            const migration = path.join(migrationsDir, migrations[i], 'migration.sql');
            shellExec(`cat ${migration} | mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} ${mysqlDatabase}`);
        }

        // Run prisma generate again to take account of any schema changes during migrations
        console.log('Running prisma generate again...');
        shellExec('npx prisma generate --schema prisma/schema.prisma');

        const { accountEmailByPlayerId, extraEmailRows } = buildPlayerEmailSeeds(legacyPlayerEmailSources);

        for (const [playerId, accountEmail] of accountEmailByPlayerId.entries()) {
            await prisma.player.update({
                where: { id: playerId },
                data: { accountEmail },
            });
        }

        await reconcilePlayerJoinedFinishedDates();

        // Calculate player records from the migrated outcome data before the
        // reset so they can be included in the blob export and restored by
        // seed.ts without recalculation.
        console.log('Calculating player records...');
        await playerRecordService.deleteAll();
        await playerRecordService.upsertForGameDay();

        // Write each table in ${mysqlDatabase} to a JSON file in /tmp/importlivedb
        console.log('Writing tables to JSON files...');
        shellExec(`mkdir -p /tmp/importlivedb`);
        for (const { fileName, getModel } of GAME_DATA_TABLES.filter((e) => e.fileName !== 'PlayerEmail.json')) {
            await writeTableToJSONFile(fileName, getModel(prisma) as { findMany: () => Prisma.PrismaPromise<object[]> });
        }

        writeDataToJSONFile('PlayerEmail.json', extraEmailRows);

        // Upload the JSON files to Azure Blob Storage
        const files = await readdir('/tmp/importlivedb');
        for (const file of files) {
            console.log(`Uploading ${file}...`);
            const filePath = path.join('/tmp/importlivedb', file);
            const blockBlobClient = containerClient.getBlockBlobClient(file);
            await blockBlobClient.uploadFile(filePath);
        }
        shellExec('rm -rf /tmp/importlivedb');

        // Capture any player accounts that were claimed since the last run so
        // they survive the database reset below. Without this, repeated calls
        // to importlivedb would silently destroy claimed accounts.
        console.log('Capturing current Better Auth state before reset...');
        await exportAuthTables(containerClient);

        // Now the dev database is up to date with the live one and the seed
        // files in blob storage reflect that, do a final reset/migrate and then
        // run seeding explicitly.
        console.log('Running final Prisma migrate reset...');
        shellExec('npx prisma migrate reset --force');
        console.log('Running final Prisma db seed...');
        shellExec('npx prisma db seed');
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

void importBackup()
    .catch((error) => {
        console.error('An unexpected error occurred:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// To run: `op run --env-file ./src/lib/importlivedb/.env -- sh -c 'npm run importlivedb'`
