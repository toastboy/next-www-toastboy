import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';

import { defaultDrinkersData } from '@/tests/mocks/data/drinkers';
import type { SetDrinkersProxy } from '@/types/actions/SetDrinkers';

import { DrinkersForm } from './DrinkersForm';

const mockSetDrinkers: SetDrinkersProxy = fn().mockResolvedValue({
    gameDayId: 1249,
    updated: 5,
    drinkers: 3,
});

const meta = {
    component: DrinkersForm,
    tags: ['ai-generated'],
    parameters: {
        layout: 'padded',
    },
    args: {
        gameId: 1249,
        gameDate: '2024-04-01',
        players: defaultDrinkersData,
        setDrinkers: mockSetDrinkers,
    },
} satisfies Meta<typeof DrinkersForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('heading', { name: /game 1249 drinkers/i })).toBeVisible();
    },
};

export const NoPlayers: Story = {
    args: {
        players: [],
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText(/no active players found/i)).toBeVisible();
    },
};

export const FilteredSearch: Story = {
    play: async ({ canvas, userEvent }) => {
        const searchInput = canvas.getByPlaceholderText(/search players/i);
        await userEvent.type(searchInput, 'Alex');
        await expect(searchInput).toHaveValue('Alex');
    },
};
