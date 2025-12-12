import type { Meta, StoryObj } from '@storybook/nextjs';

import { NavBarNested } from './NavBarNested';

const ensureMockAuth = () => {
    if (typeof window !== 'undefined') {
        const typedWindow = window as typeof window & {
            __PLAYWRIGHT_TEST__?: boolean;
            __MOCK_AUTH_STATE__?: string;
        };
        typedWindow.__PLAYWRIGHT_TEST__ = true;
        typedWindow.__MOCK_AUTH_STATE__ = 'user';
    }
};

const meta = {
    title: 'Navigation/NavBarNested',
    component: NavBarNested,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => {
            ensureMockAuth();
            return <Story />;
        },
    ],
} satisfies Meta<typeof NavBarNested>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
