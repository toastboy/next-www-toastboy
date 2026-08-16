import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { defaultCountrySupporterWithPlayerDataList } from '@/tests/mocks/data/countrySupporterWithPlayerData';

import { CountryMapShell } from './CountryMapShell';

const meta = {
    title: 'Pages/CountryMapShell',
    component: CountryMapShell,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CountryMapShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        countries: defaultCountrySupporterWithPlayerDataList,
    },
};
