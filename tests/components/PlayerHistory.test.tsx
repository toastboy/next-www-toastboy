import { render, screen, waitFor } from '@testing-library/react';
import PlayerHistory, { Props } from 'components/PlayerHistory/PlayerHistory';
import playerService from 'services/Player';
import { Wrapper } from './lib/common';

jest.mock('components/YearSelector/YearSelector');
jest.mock('components/PlayerResults/PlayerResults');
jest.mock('components/PlayerPositions/PlayerPositions');

jest.mock('services/Player', () => ({
    __esModule: true,
    default: { getYearsActive: jest.fn() },
}));

const mockGetYearsActive = (years: number[]) => {
    (playerService.getYearsActive as jest.Mock).mockResolvedValueOnce(years);
};

describe('PlayerHistory', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders year selector and child components with active years', async () => {
        mockGetYearsActive([2022, 2023, 0]);

        const element = await PlayerHistory({ playerId: 42, year: 2023 } as Props);
        render(<Wrapper>{element}</Wrapper>);

        await waitFor(() => screen.getByText(/YearSelector/));

        expect(playerService.getYearsActive).toHaveBeenCalledWith(42);
        expect(
            screen.getByText(/YearSelector\s*\(activeYear:\s*2023,\s*validYears:\s*2022[\s,]*2023[\s,]*0\)/),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerResults\s*\(playerId:\s*42,\s*year:\s*2023\)/),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerPositions\s*\(playerId:\s*42,\s*year:\s*2023\)/),
        ).toBeInTheDocument();
    });

    it('handles no active years', async () => {
        mockGetYearsActive([]);

        const element = await PlayerHistory({ playerId: 7, year: 2024 } as Props);
        render(<Wrapper>{element}</Wrapper>);

        await waitFor(() => screen.getByText(/YearSelector/));

        expect(playerService.getYearsActive).toHaveBeenCalledWith(7);
        expect(
            screen.getByText(/YearSelector\s*\(activeYear:\s*2024,\s*validYears:\s*\)/),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerResults\s*\(playerId:\s*7,\s*year:\s*2024\)/),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerPositions\s*\(playerId:\s*7,\s*year:\s*2024\)/),
        ).toBeInTheDocument();
    });
});
