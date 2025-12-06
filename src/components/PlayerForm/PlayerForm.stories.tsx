import { defaultOutcomeList } from '@/tests/mocks';
import type { Meta, StoryObj } from '@storybook/nextjs';
import PlayerForm from './PlayerForm';

const meta = {
    component: PlayerForm,
} satisfies Meta<typeof PlayerForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        form: defaultOutcomeList,
        games: 5,
    },
};
