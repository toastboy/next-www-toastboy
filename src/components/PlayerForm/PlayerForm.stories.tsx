import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultPlayerFormList } from '@/tests/mocks';

import PlayerForm from './PlayerForm';

const meta = {
    component: PlayerForm,
} satisfies Meta<typeof PlayerForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        form: defaultPlayerFormList,
    },
};
