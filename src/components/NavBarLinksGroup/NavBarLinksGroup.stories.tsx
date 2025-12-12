import type { Meta, StoryObj } from '@storybook/nextjs';

import { NavBarLinksGroup } from './NavBarLinksGroup';

const meta = {
    title: 'Navigation/NavBarLinksGroup',
    component: NavBarLinksGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof NavBarLinksGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Games',
        initiallyOpened: true,
        links: [
            { label: 'Next Game', link: '/footy/nextgame' },
            { label: 'Results', link: '/footy/results' },
            { label: 'Fixtures', link: '/footy/fixtures' },
        ],
    },
};
