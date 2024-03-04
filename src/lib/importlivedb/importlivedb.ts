import { execSync } from "child_process";
import { readdir } from "fs/promises";
import prisma from '../prisma';
import path from "path";
import dotenv from 'dotenv';
import fs from 'fs';
import { ClientSecretCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

/**
 * Imports a MySQL backup file and runs migrations to set up the database
 * structure. This is to support a non-standard workflow where the database is
 * backed up from a live server and imported into a local development
 * environment, and then all but the 'init' migration are run to make the
 * development database match the current development schema. This means I can
 * carry on developing the new website while new data is being added to the old
 * one, and then switch over when I'm ready.
 * @param {string} filePath - The path to the MySQL backup file.
 * @returns {Promise<void>} - A promise that resolves when the import and
 * migrations are completed.
 */
async function importBackup(): Promise<void> {
    try {
        // Load the .env file into process.env
        dotenv.config();

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
            credentials
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Take a backup of the current live database
        execSync(`mysqldump -h ${prodMysqlHost} -u ${prodMysqlUser} -p${prodMysqlPassword} ${mysqlDatabase} arse club club_supporter country diffs game_chat game_day invitation misc nationality outcome picker picker_teams player > /tmp/${mysqlDatabase}.sql`);
        console.log('Backup taken successfully.');

        // Get the list of directories in the migrations directory
        const migrationsDir = path.join(__dirname, '..', '..', '..', 'prisma', 'migrations');
        const migrations = await readdir(migrationsDir);

        // Run prisma generate to ensure the Prisma Client is up to date
        execSync('npx prisma generate');

        // Import the mysqldump backup created above
        execSync(`mysql -h ${devMysqlHost} -u ${devMysqlUser} -p${devMysqlPassword} -e'DROP DATABASE IF EXISTS footy;'`);
        execSync(`mysql -h ${devMysqlHost} -u ${devMysqlUser} -p${devMysqlPassword} -e'CREATE DATABASE footy;'`);
        execSync(`cat /tmp/${mysqlDatabase}.sql | mysql -h ${devMysqlHost} -u ${devMysqlUser} -p${devMysqlPassword} ${mysqlDatabase}`);
        console.log('Backup imported successfully.');

        // Run each migration except the first one: the backup created the
        // database structure through the conditional comments such as '/*!40000
        // DROP DATABASE IF EXISTS `footy`*/;'
        for (let i = 1; i < migrations.length; i++) {
            if (migrations[i].endsWith('migration_lock.toml')) {
                continue;
            }
            const migration = path.join(migrationsDir, migrations[i], 'migration.sql');
            console.log(`Running migration ${migration}...`);
            execSync(`cat ${migration} | mysql -h ${devMysqlHost} -u ${devMysqlUser} -p${devMysqlPassword} ${mysqlDatabase}`);
            console.log(`Migration ${migration} completed.`);
        }
        console.log('All migrations completed.');

        const tables = [
            'Arse',
            'ClubSupporter',
            'Club',
            'Country',
            'CountrySupporter',
            'GameChat',
            'GameDay',
            'Outcome',
            'Player',
        ];

        // Write each table in ${mysqlDatabase} to a JSON file in /tmp/importlivedb
        execSync(`mkdir -p /tmp/importlivedb`);
        for (const table of tables) {
            console.log(`Writing ${table} to ${table}.json...`);
            const data = await prisma[table].findMany({});
            const json = JSON.stringify(data, null, 2);
            const filePath = path.join('/tmp/importlivedb', `${table}.json`);
            fs.writeFileSync(filePath, json);
        }
        console.log('All JSON files written.');

        // Upload the JSON files to Azure Blob Storage
        const files = await readdir('/tmp/importlivedb');
        for (const file of files) {
            const filePath = path.join('/tmp/importlivedb', file);
            const blockBlobClient = containerClient.getBlockBlobClient(file);
            await blockBlobClient.uploadFile(filePath);
            console.log(`Uploaded ${file} successfully.`);
        }
        execSync('rm -rf /tmp/importlivedb');

        // Now the dev database is up to date with the live one and the seed
        // files in blob storage reflect that, we can do a final Prisma migrate
        // reset and seed to ensure the dev database is in a good state.
        execSync(`cd ../../.. && pwd && npx prisma migrate reset --force`);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

importBackup();

// To run: npm run importlivedb
