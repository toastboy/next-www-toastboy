import type { Meta, StoryObj } from '@storybook/nextjs';
import { useEffect } from 'react';

import AdminUpdatePlayerRecords from './AdminUpdatePlayerRecords';


const meta = {
    title: 'Admin/AdminUpdatePlayerRecords',
    component: AdminUpdatePlayerRecords,
    parameters: {
        layout: 'centered',
    },
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
                            status: 200,
                            async json() {
                                await Promise.resolve();
                                return { success: true };
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
} satisfies Meta<typeof AdminUpdatePlayerRecords>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
