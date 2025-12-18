import { ClientSecretCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { execSync } from "child_process";
import * as fs from "fs";
import { readdir } from "fs/promises";
import * as path from "path";
import { Prisma } from "prisma/generated/client";
import playerRecordService from "services/PlayerRecord";

import prisma from "../prisma";

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
    const json = JSON.stringify(data, null, 2);
    const filePath = path.join('/tmp/importlivedb', `${fileName}`);
    fs.writeFileSync(filePath, json);
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

        if (!process.env.IMP_MYSQL_DATABASE) {
            throw new Error('IMP_MYSQL_DATABASE undefined');
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
        if (!process.env.IMP_AZURE_STORAGE_ACCOUNT_NAME) {
            throw new Error('IMP_AZURE_STORAGE_ACCOUNT_NAME undefined');
        }
        if (!process.env.IMP_AZURE_CONTAINER_NAME) {
            throw new Error('IMP_AZURE_CONTAINER_NAME undefined');
        }

        const prodMysqlUser = process.env.IMP_PROD_MYSQL_USER;
        const prodMysqlHost = process.env.IMP_PROD_MYSQL_HOST;
        const prodMysqlPassword = process.env.IMP_PROD_MYSQL_PASSWORD;

        const devMysqlUser = process.env.IMP_DEV_MYSQL_USER;
        const devMysqlHost = process.env.IMP_DEV_MYSQL_HOST;
        const devMysqlPort = process.env.IMP_DEV_MYSQL_PORT;
        const devMysqlPassword = process.env.IMP_DEV_MYSQL_PASSWORD;

        const mysqlDatabase = process.env.IMP_MYSQL_DATABASE;
        const tenantId = process.env.IMP_AZURE_TENANT_ID;

        const clientId = process.env.IMP_AZURE_CLIENT_ID;
        const clientSecret = process.env.IMP_AZURE_CLIENT_SECRET;
        const storageAccountName = process.env.IMP_AZURE_STORAGE_ACCOUNT_NAME;
        const containerName = process.env.IMP_AZURE_CONTAINER_NAME;

        const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const blobServiceClient = new BlobServiceClient(
            `https://${storageAccountName}.blob.core.windows.net`,
            credentials,
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Take a backup of the current live database
        console.log('Taking production mysql backup...');
        execSync(`mysqldump --skip-ssl -h ${prodMysqlHost} -u ${prodMysqlUser} -p${prodMysqlPassword} ${mysqlDatabase} arse club club_supporter country diffs game_chat game_day invitation misc nationality outcome picker picker_teams player > /tmp/${mysqlDatabase}.sql`);

        // Get the list of directories in the migrations directory
        const migrationsDir = path.join(__dirname, '..', '..', '..', 'prisma', 'migrations');
        const migrations = await readdir(migrationsDir);

        // Run prisma generate to ensure the Prisma Client is up to date
        console.log('Running prisma generate...');
        execSync('npx prisma generate --schema prisma/schema.prisma');

        // Run prisma db push to ensure the database is up to date with the schema
        console.log('Running prisma db push...');
        execSync(`mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} -e'DROP DATABASE IF EXISTS footy;'`);
        execSync(`mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} -e'CREATE DATABASE footy;'`);
        execSync('npx prisma db push --accept-data-loss --schema prisma/schema.prisma');

        // Import the mysqldump backup created above
        console.log('Importing mysql backup...');
        execSync(`cat /tmp/${mysqlDatabase}.sql | mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} ${mysqlDatabase}`);

        // Run each migration except the first one: the backup created the
        // database structure through the conditional comments such as '/*!40000
        // DROP DATABASE IF EXISTS `footy`*/;'
        for (let i = 1; i < migrations.length; i++) {
            if (migrations[i].endsWith('migration_lock.toml')) {
                continue;
            }
            console.log(`Running migration ${migrations[i]}...`);
            const migration = path.join(migrationsDir, migrations[i], 'migration.sql');
            execSync(`cat ${migration} | mysql --skip-ssl -h ${devMysqlHost} -P ${devMysqlPort} -u ${devMysqlUser} -p${devMysqlPassword} ${mysqlDatabase}`);
        }

        // Now calculate all the player records to ensure they are up to date
        console.log('Calculating player records...');
        await playerRecordService.deleteAll();
        await playerRecordService.upsertForGameDay();

        // Write each table in ${mysqlDatabase} to a JSON file in /tmp/importlivedb
        console.log('Writing tables to JSON files...');
        execSync(`mkdir -p /tmp/importlivedb`);
        await writeTableToJSONFile('Arse.json', prisma.arse);
        await writeTableToJSONFile('ClubSupporter.json', prisma.clubSupporter);
        await writeTableToJSONFile('Club.json', prisma.club);
        await writeTableToJSONFile('Country.json', prisma.country);
        await writeTableToJSONFile('CountrySupporter.json', prisma.countrySupporter);
        await writeTableToJSONFile('GameChat.json', prisma.gameChat);
        await writeTableToJSONFile('GameDay.json', prisma.gameDay);
        await writeTableToJSONFile('Outcome.json', prisma.outcome);
        await writeTableToJSONFile('Player.json', prisma.player);
        await writeTableToJSONFile('PlayerRecord.json', prisma.playerRecord);

        // Upload the JSON files to Azure Blob Storage
        const files = await readdir('/tmp/importlivedb');
        for (const file of files) {
            console.log(`Uploading ${file}...`);
            const filePath = path.join('/tmp/importlivedb', file);
            const blockBlobClient = containerClient.getBlockBlobClient(file);
            await blockBlobClient.uploadFile(filePath);
        }
        execSync('rm -rf /tmp/importlivedb');

        // Now the dev database is up to date with the live one and the seed
        // files in blob storage reflect that, we can do a final Prisma migrate
        // reset and seed to ensure the dev database is in a good state.
        console.log('Running final Prisma migrate reset...');
        execSync(`npx prisma migrate reset --force`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

importBackup().catch((error) => {
    console.error('An unexpected error occurred:', error);
});

// To run: `op run --env-file ./src/lib/importlivedb/.env -- sh -c 'npm run importlivedb'`
