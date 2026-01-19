const path = require('node:path');
const { spawnSync } = require('node:child_process');

const jestBin = require.resolve('jest/bin/jest');
const configPath = path.join(__dirname, '..', 'jest.config.js');
const args = ['--config', configPath, ...process.argv.slice(2)];

const result = spawnSync(process.execPath, [jestBin, ...args], {
    stdio: 'inherit',
});

if (result.status !== 0) {
    throw new Error(`Jest exited with code ${result.status ?? 1}`);
}
