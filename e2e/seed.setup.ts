import { execSync } from 'node:child_process';

import { test } from '@playwright/test';

test('reseed database', () => {
    execSync(
        process.env.CI ? 'npm run seed:ci' : 'npm run seed:playwright',
        { stdio: 'inherit' },
    );
});
