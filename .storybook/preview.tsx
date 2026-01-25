import "@mantine/core/styles.css";

import React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import type { Decorator } from "@storybook/react";
import { MantineProvider } from "@mantine/core";

const mantineDecorator: Decorator = (Story) => (
  <MantineProvider>
    <Story />
  </MantineProvider>
);

const preview: Preview = {
  decorators: [mantineDecorator],
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