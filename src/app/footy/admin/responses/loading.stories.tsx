import { Container, Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ResponsesForm } from '@/components/ResponsesForm/ResponsesForm';
import { defaultResponsesAdminData } from '@/tests/mocks/data/responses';

import Loading from './loading';

const meta = {
    title: 'Loading/ResponsesPage',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Skeleton: Story = {};

export const Comparison: Story = {
    render: () => (
        <Group align="flex-start" gap="xl" wrap="nowrap">
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loading</Text>
                <Loading />
            </Stack>
            <Stack flex={1}>
                <Text fw={700} c="dimmed" ta="center">Loaded</Text>
                <Container size="lg" py="lg">
                    <ResponsesForm
                        gameId={1249}
                        gameDate="3rd February 2026"
                        responses={defaultResponsesAdminData}
                        submitResponse={async () => Promise.resolve(null)}
                    />
                </Container>
            </Stack>
        </Group>
    ),
};
