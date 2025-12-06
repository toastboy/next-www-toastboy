import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultGameDay } from '@/tests/mocks';

import GameDayLink from './GameDayLink';

const meta = {
    component: GameDayLink,
} satisfies Meta<typeof GameDayLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        gameDay: defaultGameDay,
    },
};
