import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect } from 'react';

import { defaultGameDayList } from '@/tests/mocks';

import { GameCalendar } from './GameCalendar';

const meta = {
    title: 'Games/GameCalendar',
    component: GameCalendar,
    tags: ['autodocs'],
    decorators: [
        (Story) => {
            const FetchMock = () => {
                useEffect(() => {
                    const originalFetch = global.fetch;
                    const mockFetch: typeof fetch = async (_input: RequestInfo | URL) => {
                        await Promise.resolve();
                        return {
                            ok: true,
                            json: async () => {
                                await Promise.resolve();
                                return defaultGameDayList;
                            },
                        } as unknown as Response;
                    };

                    global.fetch = mockFetch;

                    return () => {
                        global.fetch = originalFetch;
                    };
                }, []);

                return <Story />;
            };

            return <FetchMock />;
        },
    ],
} satisfies Meta<typeof GameCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        date: new Date('2024-03-10'),
    },
};
