import { Notifications } from '@mantine/notifications';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameResultForm } from './GameResultForm';

const meta = {
    title: 'Admin/GameResultForm',
    component: GameResultForm,
    decorators: [
        (Story) => (
            <>
                <Notifications />
                <Story />
            </>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof GameResultForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {
        gameDayId: 1249,
        bibs: null,
        winners: null,
        setGameResult: async () => Promise.resolve({} as GameDayType),
    },
};

export const ExistingResult: Story = {
    args: {
        ...Render.args,
        bibs: 'A',
        winners: 'draw',
    },
};
