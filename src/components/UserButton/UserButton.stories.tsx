import type { Meta, StoryObj } from '@storybook/nextjs';

import UserButton from './UserButton';

declare global {
    interface Window {
        __PLAYWRIGHT_TEST__?: boolean;
        __MOCK_AUTH_STATE__?: 'none' | 'user' | 'admin';
    }
}

const setAuthState = (state: 'none' | 'user' | 'admin') => {
    if (typeof window !== 'undefined') {
        window.__PLAYWRIGHT_TEST__ = true;
        window.__MOCK_AUTH_STATE__ = state;
    }
};

const meta = {
    title: 'Navigation/UserButton',
    component: UserButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof UserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
    decorators: [
        (Story) => {
            setAuthState('none');
            return <Story />;
        },
    ],
};

export const LoggedIn: Story = {
    decorators: [
        (Story) => {
            setAuthState('user');
            return <Story />;
        },
    ],
};
