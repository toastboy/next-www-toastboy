import { execSync } from "child_process";
import { readdir } from "fs/promises";
import prisma from '../prisma';
import path from "path";
import dotenv from 'dotenv';
import fs from 'fs';

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
        if (!process.env.PROD_MYSQL_USER) {
            throw new Error('PROD_MYSQL_USER undefined');
        }
        if (!process.env.PROD_MYSQL_HOST) {
            throw new Error('PROD_MYSQL_HOST undefined');
        }
        if (!process.env.PROD_MYSQL_PASSWORD) {
            throw new Error('PROD_MYSQL_PASSWORD undefined');
        }

        if (!process.env.DEV_MYSQL_USER) {
            throw new Error('DEV_MYSQL_USER undefined');
        }
        if (!process.env.DEV_MYSQL_HOST) {
            throw new Error('DEV_MYSQL_HOST undefined');
        }
        if (!process.env.DEV_MYSQL_PASSWORD) {
            throw new Error('DEV_MYSQL_PASSWORD undefined');
        }

        if (!process.env.MYSQL_DATABASE) {
            throw new Error('MYSQL_DATABASE undefined');
        }

        const prodMysqlUser = process.env.PROD_MYSQL_USER;
        const prodMysqlHost = process.env.PROD_MYSQL_HOST;
        const prodMysqlPassword = process.env.PROD_MYSQL_PASSWORD;

        const devMysqlUser = process.env.DEV_MYSQL_USER;
        const devMysqlHost = process.env.DEV_MYSQL_HOST;
        const devMysqlPassword = process.env.DEV_MYSQL_PASSWORD;

        const mysqlDatabase = process.env.MYSQL_DATABASE;

        // Take a backup of the current live database
        execSync(`mysqldump -h ${prodMysqlHost} -u ${prodMysqlUser} -p${prodMysqlPassword} ${mysqlDatabase} > /tmp/${mysqlDatabase}.sql`);
        console.log('Backup taken successfully.');

        // Get the list of directories in the migrations directory
        const migrationsDir = path.join(__dirname, '..', '..', '..', 'prisma', 'migrations');
        const migrations = await readdir(migrationsDir);

        // Import the mysqldump backup created above
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

        // Write each table in ${mysqlDatabase} to a JSON file in /tmp/importlivedb
        execSync(`mkdir -p /tmp/importlivedb`);
        const tables = new Map<string, string>([
            ['arse', 'arses'],
            ['club_supporter', 'club_supporters'],
            ['club', 'clubs'],
            ['country', 'countries'],
            ['game_chat', 'game_chats'],
            ['game_day', 'game_days'],
            ['invitation', 'invitations'],
            ['nationality', 'nationalities'],
            ['outcome', 'outcomes'],
            ['player', 'players'],
            ['standings', 'standings']
        ]);
        for (const [table, file] of Array.from(tables.entries())) {
            console.log(`Writing ${table} to ${file}.json...`);
            const data = await prisma[table].findMany({});
            const json = JSON.stringify(data, null, 2);
            const filePath = path.join('/tmp/importlivedb', `${file}.json`);
            fs.writeFileSync(filePath, json);
        }

        console.log('All JSON files written.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

importBackup();

// To run: npx ts-node --compiler-options '{"module":"CommonJS"}' src/importlivedb.ts
