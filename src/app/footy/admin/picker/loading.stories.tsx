import { Container, Group, Stack, Text } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PickerForm } from '@/components/PickerForm/PickerForm';
import { defaultPickerAdminData } from '@/tests/mocks/data/picker';

import Loading from './loading';

const meta = {
    title: 'Loading/PickerPage',
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
                    <PickerForm
                        gameDay={{
                            id: 1249,
                            year: 2026,
                            date: new Date('2026-02-03T00:00:00Z'),
                            game: true,
                            cost: 500,
                            hallCost: 5000,
                            mailSent: new Date('2026-02-01T09:00:00Z'),
                            comment: null,
                            bibs: null,
                            pickerGamesHistory: 10,
                        }}
                        players={defaultPickerAdminData}
                        submitPicker={async () => Promise.resolve()}
                        setGameEnabled={async () => Promise.resolve({
                            id: 1249,
                            year: 2026,
                            date: new Date('2026-02-03T00:00:00Z'),
                            game: true,
                            cost: 500,
                            hallCost: 5000,
                            mailSent: new Date('2026-02-01T09:00:00Z'),
                            comment: null,
                            bibs: null,
                            pickerGamesHistory: 10,
                        })}
                    />
                </Container>
            </Stack>
        </Group>
    ),
};
