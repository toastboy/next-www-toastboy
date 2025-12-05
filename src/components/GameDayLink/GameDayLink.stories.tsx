import type { Meta, StoryObj } from '@storybook/nextjs';
import { Anchor } from '@mantine/core';
import GameDayLink from './GameDayLink';

const mockGameDays: Record<number, { id: number; date: string }> = {
    100: { id: 100, date: '2024-10-01T18:30:00.000Z' },
    101: { id: 101, date: '2024-10-08T18:30:00.000Z' },
};

const meta = {
    component: GameDayLink,
    render: ({ gameDayId }) => {
        const mock = mockGameDays[gameDayId] ?? { id: gameDayId, date: new Date().toISOString() };
        return (
            <Anchor href={`/footy/game/${mock.id}`}>
                {new Date(mock.date).toLocaleDateString('sv')}
            </Anchor>
        );
    },
} satisfies Meta<typeof GameDayLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        gameDayId: 100,
    },
};
