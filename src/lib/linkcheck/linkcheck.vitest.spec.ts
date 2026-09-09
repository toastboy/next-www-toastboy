import { vi } from 'vitest';

const {
    checkMock,
    onMock,
    linkCheckerCtor,
    readFileSyncMock,
    writeFileSyncMock,
} = vi.hoisted(() => {
    const checkMock = vi.fn();
    const onMock = vi.fn();
    return {
        checkMock,
        onMock,
        linkCheckerCtor: vi.fn(function LinkChecker() {
            return { on: onMock, check: checkMock };
        }),
        readFileSyncMock: vi.fn(),
        writeFileSyncMock: vi.fn(),
    };
});

vi.mock('linkinator', () => ({
    LinkChecker: linkCheckerCtor,
    LinkState: { OK: 'OK', BROKEN: 'BROKEN', SKIPPED: 'SKIPPED' },
}));

vi.mock('node:fs', () => ({
    readFileSync: readFileSyncMock,
    writeFileSync: writeFileSyncMock,
}));

import { readLinkinatorConfig, runLinkCheck } from '@/lib/linkcheck/linkcheck';

const CONFIG = {
    recurse: true,
    skip: ['^https?://(?!127\\.0\\.0\\.1:3000)', '/api/footy/.+/mugshot$'],
    retry: true,
    concurrency: 20,
    timeout: 10000,
};

const okResult = {
    passed: true,
    links: [
        { url: 'http://127.0.0.1:3000/footy', status: 200, state: 'OK' },
        { url: 'http://127.0.0.1:3000/footy/rules', status: 200, state: 'OK' },
    ],
};

describe('runLinkCheck', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
        readFileSyncMock.mockReturnValue(JSON.stringify(CONFIG));
        checkMock.mockResolvedValue(okResult);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('seeds from / and /footy and sends the admin mock-auth cookie', async () => {
        await runLinkCheck();

        expect(checkMock).toHaveBeenCalledWith(
            expect.objectContaining({
                path: ['http://127.0.0.1:3000/', 'http://127.0.0.1:3000/footy'],
                headers: { Cookie: 'mock-auth-state=admin' },
            }),
        );
    });

    it('registers a progress listener for link events', async () => {
        await runLinkCheck();

        expect(onMock).toHaveBeenCalledWith('link', expect.any(Function));
    });

    it('reuses recurse / skip / retry / concurrency / timeout from linkinator.config.json', async () => {
        await runLinkCheck();

        expect(checkMock).toHaveBeenCalledWith(
            expect.objectContaining({
                recurse: true,
                linksToSkip: CONFIG.skip,
                retry: true,
                concurrency: 20,
                timeout: 10000,
            }),
        );
    });

    it('writes the result as a report in the linkinator CLI shape', async () => {
        await runLinkCheck({ reportPath: 'out.json' });

        expect(writeFileSyncMock).toHaveBeenCalledWith(
            'out.json',
            JSON.stringify(okResult, null, 2),
        );
    });

    it('returns 0 when nothing is broken', async () => {
        await expect(runLinkCheck()).resolves.toBe(0);
    });

    it('returns the count of broken links', async () => {
        checkMock.mockResolvedValue({
            passed: false,
            links: [
                {
                    url: 'http://127.0.0.1:3000/footy',
                    status: 200,
                    state: 'OK',
                },
                {
                    url: 'http://127.0.0.1:3000/footy/admin/busted',
                    status: 404,
                    state: 'BROKEN',
                    parent: 'http://127.0.0.1:3000/footy',
                },
                {
                    url: 'http://127.0.0.1:3000/footy/nope',
                    status: 500,
                    state: 'BROKEN',
                    parent: 'http://127.0.0.1:3000/footy',
                },
            ],
        });

        await expect(runLinkCheck()).resolves.toBe(2);
    });

    it('crawls the origin from SITE_URL when set, without a doubled slash', async () => {
        vi.stubEnv('SITE_URL', 'https://www.toastboy.co.uk/');

        await runLinkCheck();

        expect(checkMock).toHaveBeenCalledWith(
            expect.objectContaining({
                path: [
                    'https://www.toastboy.co.uk/',
                    'https://www.toastboy.co.uk/footy',
                ],
            }),
        );
    });

    it('honours an explicit baseUrl over the environment', async () => {
        vi.stubEnv('SITE_URL', 'https://www.toastboy.co.uk');

        await runLinkCheck({ baseUrl: 'http://127.0.0.1:4000' });

        expect(checkMock).toHaveBeenCalledWith(
            expect.objectContaining({
                path: ['http://127.0.0.1:4000/', 'http://127.0.0.1:4000/footy'],
            }),
        );
    });
});

describe('readLinkinatorConfig', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('parses the config file at the given path', () => {
        readFileSyncMock.mockReturnValue(JSON.stringify(CONFIG));

        expect(readLinkinatorConfig('some/linkinator.config.json')).toEqual(
            CONFIG,
        );
        expect(readFileSyncMock).toHaveBeenCalledWith(
            'some/linkinator.config.json',
            'utf8',
        );
    });
});
