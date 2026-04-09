import { Box } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { createMockFamilyTree, defaultFamilyTree } from '@/tests/mocks/data/familyTree';

import { FamilyTree } from './FamilyTree';

const meta = {
    title: 'Players/FamilyTree',
    component: FamilyTree,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof FamilyTree>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default story with the standard mock family tree. */
export const Default: Story = {
    args: {
        data: defaultFamilyTree,
    },
};

/** Empty tree with only the root node. */
export const Empty: Story = {
    args: {
        data: createMockFamilyTree({ children: [] }),
    },
};

/** Compact variant with smaller dimensions. */
export const Compact: Story = {
    args: {
        data: defaultFamilyTree,
    },
    decorators: [
        (Story) => (
            <Box maw={480}>
                <Story />
            </Box>
        ),
    ],
};

/** Single founder with a deep introduction chain. */
export const DeepChain: Story = {
    args: {
        data: createMockFamilyTree({
            children: [
                {
                    id: 1,
                    name: 'Alpha',
                    children: [
                        {
                            id: 2,
                            name: 'Beta',
                            children: [
                                {
                                    id: 3,
                                    name: 'Gamma',
                                    children: [
                                        {
                                            id: 4,
                                            name: 'Delta',
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        }),
    },
};
