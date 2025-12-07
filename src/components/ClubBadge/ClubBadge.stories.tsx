import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultClub } from '@/tests/mocks';

import ClubBadge from './ClubBadge';

const meta = {
    title: 'Club/ClubBadge',
    component: ClubBadge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ClubBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        club: defaultClub,
    },
};
