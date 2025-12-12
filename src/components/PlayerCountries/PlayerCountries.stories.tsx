import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';

import { PlayerCountries } from './PlayerCountries';

const meta = {
    title: 'Player/PlayerCountries',
    component: PlayerCountries,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerCountries>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        countries: defaultCountrySupporterDataList,
    },
};
