import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/nextjs-vite";
import type { Decorator } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

const mantineDecorator: Decorator = (Story) => (
    <MantineProvider>
        <Story />
    </MantineProvider>
);

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
    decorators: [mantineDecorator],
    loaders: [mswLoader],
    parameters: {
        nextjs: {
            appDirectory: true,
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
