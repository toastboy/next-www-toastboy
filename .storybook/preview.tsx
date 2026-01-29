import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/nextjs-vite";
import type { Decorator } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";

const badgePng = new URL("../src/tests/mocks/data/badge.png", import.meta.url).toString();
const flagPng = new URL("../src/tests/mocks/data/flag.png", import.meta.url).toString();
const footballPng = new URL("../src/tests/mocks/data/football.png", import.meta.url).toString();
const mugshotPng = new URL("../src/tests/mocks/data/mugshot.png", import.meta.url).toString();

const mantineDecorator: Decorator = (Story) => (
    <MantineProvider>
        <Story />
    </MantineProvider>
);

initialize({ onUnhandledRequest: "bypass" });

const imageCache = new Map<string, Promise<ArrayBuffer>>();

const loadImage = (url: string): Promise<ArrayBuffer> => {
    const cached = imageCache.get(url);
    if (cached) return cached;
    const loadPromise = fetch(url).then((response) => response.arrayBuffer());
    imageCache.set(url, loadPromise);
    return loadPromise;
};

const imageHandlers = [
    http.get("*/api/footy/country/:isoCode/flag", async () => {
        const buffer = await loadImage(flagPng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
    http.get("*/api/footy/club/:id/badge", async () => {
        const buffer = await loadImage(badgePng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
    http.get("*/api/footy/player/:id/mugshot", async () => {
        const buffer = await loadImage(mugshotPng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
    http.get("*/api/footy/assets/football.png", async () => {
        const buffer = await loadImage(footballPng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
];

const preview: Preview = {
    decorators: [mantineDecorator],
    loaders: [mswLoader],
    parameters: {
        nextjs: {
            appDirectory: true,
        },
        msw: {
            handlers: imageHandlers,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },
    },
};

export default preview;
