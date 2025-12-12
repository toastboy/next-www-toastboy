import type { Meta, StoryObj } from '@storybook/nextjs';

import { defaultCountry } from '@/tests/mocks';

import { CountryFlag } from './CountryFlag';

const meta = {
    title: 'Country/CountryFlag',
    component: CountryFlag,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CountryFlag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        country: defaultCountry,
    },
};
