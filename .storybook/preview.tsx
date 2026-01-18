import '@mantine/code-highlight/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import badgeImage from '@/tests/mocks/data/badge.png';
import flagImage from '@/tests/mocks/data/flag.png';
import mugshotImage from '@/tests/mocks/data/mugshot.png';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Preview } from '@storybook/nextjs-vite';
import { http, HttpResponse } from 'msw';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { sb, fn as storybookFn } from 'storybook/test';

sb.mock('../src/actions/createPlayer.ts');
sb.mock('../src/actions/deletePlayer.ts');
sb.mock('../src/actions/updatePlayer.ts');
sb.mock('../src/actions/updatePlayerRecords.ts');
sb.mock('../src/actions/createMoreGameDays.ts');
sb.mock('../src/actions/auth-export.ts');
sb.mock('../src/actions/verifyEmail.ts');
sb.mock('../src/actions/sendEmail.ts');
sb.mock('../src/actions/sendEnquiry.ts');
sb.mock('../src/actions/triggerInvitations.ts');
sb.mock('../src/actions/submitGameInvitationResponse.ts');
sb.mock('../src/lib/auth-client.ts');
sb.mock('../prisma/prisma.ts');

if (typeof globalThis !== 'undefined') {
    (globalThis as Record<string, unknown>).__STORYBOOK_FN__ = storybookFn;
}

// Suppress React DevTools disconnected port errors in Storybook
if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('disconnected port object')
        ) {
            return;
        }
        originalError.apply(console, args);
    };
}

// Ignore unhandled requests for browser extensions, static assets, and Storybook internals
const shouldIgnoreUnhandledRequest = (url: string) => {
    try {
        const { protocol, pathname } = new URL(url);
        const isExtension = protocol === 'chrome-extension:';
        const isStaticAsset = pathname.startsWith('/static/');
        const isSourceStylesheet = pathname.startsWith('/src/') && pathname.endsWith('.css');
        const isSourceImage =
            pathname.startsWith('/src/tests/mocks/data/') &&
            /\.(png|jpe?g|gif|svg)$/i.test(pathname);
        const isStorybookAsset = pathname.startsWith('/src/stories/assets/');
        const isViteExternal = pathname.startsWith('/@id/__vite-browser-external:');
        const isStoryIndex = pathname === '/index.json';

        return isExtension
            || isStaticAsset
            || isSourceStylesheet
            || isSourceImage
            || isStorybookAsset
            || isViteExternal
            || isStoryIndex;
    } catch {
        return false;
    }
};

initialize({
    onUnhandledRequest: ({ url, method }) => {
        if (shouldIgnoreUnhandledRequest(url)) {
            return;
        }

        //     console.error(`Unhandled ${method} request to ${url}.

        //     This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

        //     If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
        //   `);
    },
});

const toUrl = (asset: string | { src: string }) =>
    typeof asset === 'string' ? asset : asset.src;

const serveImage = (assetUrl: string, contentType: string) => async () => {
    const res = await fetch(assetUrl);
    const buffer = await res.arrayBuffer();

    return new HttpResponse(buffer, {
        headers: { 'Content-Type': contentType },
    });
};

const imageHandlers = [
    http.get('*/api/footy/player/:id/mugshot', serveImage(toUrl(mugshotImage), 'image/png')),
    http.get('*/api/footy/club/:id/badge', serveImage(toUrl(badgeImage), 'image/png')),
    http.get('*/api/footy/country/:code/flag', serveImage(toUrl(flagImage), 'image/png')),
];

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        layout: 'fullscreen',

        msw: {
            handlers: imageHandlers,
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo'
        }
    },
    decorators: [
        (Story) => (
            <MantineProvider>
                <Notifications />
                <Story />
            </MantineProvider>
        ),
    ],
    loaders: [mswLoader],
};

export default preview;
