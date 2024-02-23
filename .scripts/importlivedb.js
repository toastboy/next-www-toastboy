const { execSync } = require('child_process');
const { readdir } = require('fs').promises;
const path = require('path');

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
async function importBackup(filePath) {
    try {
        // Load the .env file into process.env
        require('dotenv').config();

        // Get all MYSQL environment variables
        const mysqlUser = process.env.MYSQL_USER;
        if (!mysqlUser) {
            throw new Error('MYSQL_USER undefined');
        }
        const mysqlHost = process.env.MYSQL_HOST;
        if (!mysqlHost) {
            throw new Error('MYSQL_HOST undefined');
        }
        const mysqlPassword = process.env.MYSQL_PASSWORD;
        if (!mysqlPassword) {
            throw new Error('MYSQL_PASSWORD undefined');
        }
        const mysqlDatabase = process.env.MYSQL_DATABASE;
        if (!mysqlDatabase) {
            throw new Error('MYSQL_DATABASE undefined');
        }

        // Get the list of directories in the migrations directory
        const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');
        const migrations = await readdir(migrationsDir);

        // Import the gzip mysqldump backup
        execSync(`gunzip < ${filePath} | mysql -h ${mysqlHost} -u ${mysqlUser} -p${mysqlPassword} ${mysqlDatabase}`);
        console.log('Backup imported successfully.');

        // Run each migration except the first one: the backup created the
        // database structure through the conditional comments such as '/*!40000
        // DROP DATABASE IF EXISTS `footy`*/;'
        for (let i = 1; i < migrations.length; i++) {
            if (migrations[i].endsWith('migration_lock.toml')) {
                continue;
            }
            const migration = path.join(__dirname, '..', 'prisma', 'migrations', migrations[i], 'migration.sql');
            console.log(`Running migration ${migration}...`);
            execSync(`cat ${migration} | mysql -u ${mysqlUser} -p${mysqlPassword} ${mysqlDatabase}`);
            console.log(`Migration ${migration} completed.`);
        }

        console.log('All migrations completed.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

importBackup("./.scripts/footy.sql.gz");

// To run: node ./.scripts/importlivedb.js
