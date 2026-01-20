import { afterAll, vi } from 'vitest';

import prismaMock from './src/tests/__mocks__/prisma/prisma.vitest';

vi.mock('prisma/prisma', () => ({
    default: prismaMock,
}));

const silenceConsole = () => {
    const noop = () => undefined;
    const spies = [
        vi.spyOn(console, 'log').mockImplementation(noop),
        vi.spyOn(console, 'info').mockImplementation(noop),
        vi.spyOn(console, 'warn').mockImplementation(noop),
        vi.spyOn(console, 'error').mockImplementation(noop),
        vi.spyOn(console, 'debug').mockImplementation(noop),
    ];

    afterAll(() => {
        for (const spy of spies) {
            spy.mockRestore();
        }
    });
};

if (process.env.VITEST_SILENCE_CONSOLE !== 'false') {
    silenceConsole();
}
