// Script to fetch JSON data from the live server. The idea is to be able to
// keep importing data as I develop the new site so that the game carries on
// with the old site until I'm ready to switch over. The Prisma migrations will
// get more and more involved as I adapt the schema, but this code will continue
// to work provided I run it from the right point in the history, where the
// schema in place matches the production server. I won't bother to write code
// to upload the JSON to Azure Storage, since doing that manually will avoid
// creating versions every time, and in any case I'll only be doing that once a
// week at most.
//
// It assumes that the files '.env.prod' and '.env.dev' exist, with the right
// credentials and URLs to connect to the PHP-based live server and the nextjs
// one under development, respectively. Since these are sensitive, they are
// never checked in to source control.
//
// To run: node ./.scripts/fetch.js

const { exec } = require('child_process');

// Function to execute a command and return a promise
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

// Function to run the sequence of commands
async function runSequence() {
    console.log('Copying prod env file into place...');
    const envProdOutput = await execPromise('cp .env.prod .env');
    console.log(envProdOutput);

    console.log('Starting development server...');
    const devServer = exec('npm run dev');

    // Wait for a few seconds to ensure the server is up
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
        console.log('Running TypeScript compiler...');
        const tscOutput = await execPromise('npx tsc ./prisma/fetch.ts');
        console.log(tscOutput);

        console.log('Running fetch script...');
        const nodeOutput = await execPromise('node ./prisma/fetch.js');
        console.log(nodeOutput);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        console.log('Stopping development server...');
        devServer.kill('SIGKILL');
    }

    console.log('Copying dev env file into place...');
    const envDevOutput = await execPromise('cp .env.dev .env');
    console.log(envDevOutput);
}

runSequence();
