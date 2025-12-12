import { Card, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { MustBeLoggedIn } from './MustBeLoggedIn';

const withMockAuth = () => {
    if (typeof window !== 'undefined') {
        const win = window as typeof window & {
            __PLAYWRIGHT_TEST__?: boolean;
            __MOCK_AUTH_STATE__?: string;
        };
        win.__PLAYWRIGHT_TEST__ = true;
        win.__MOCK_AUTH_STATE__ = 'user';
    }
};

const meta = {
    title: 'Auth/MustBeLoggedIn',
    component: MustBeLoggedIn,
    tags: ['autodocs'],
    decorators: [
        (Story) => {
            withMockAuth();
            return <Story />;
        },
    ],
} satisfies Meta<typeof MustBeLoggedIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: (
            <Card shadow="sm" padding="md" radius="md" withBorder>
                <Text>This content renders when the user is signed in.</Text>
            </Card>
        ),
    },
};
