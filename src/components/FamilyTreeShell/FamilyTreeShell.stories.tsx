import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultFamilyTree } from '@/tests/mocks/data/familyTree';

import { FamilyTreeShell } from './FamilyTreeShell';

const meta = {
    title: 'Pages/FamilyTreeShell',
    component: FamilyTreeShell,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof FamilyTreeShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        data: defaultFamilyTree,
    },
};
