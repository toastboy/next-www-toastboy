import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultArse } from '@/tests/mocks/data/arse';

import { PlayerArse } from './PlayerArse';

const meta = {
    title: 'Player/PlayerArse',
    component: PlayerArse,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerArse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        arse: defaultArse,
    },
};
