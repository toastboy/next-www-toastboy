import { render, screen } from '@testing-library/react';

import PlayerHistory, { Props } from '@/components/PlayerHistory/PlayerHistory';
import playerService from '@/services/Player';

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

        await screen.findByText(/YearSelector/);

        expect(playerService.getYearsActive).toHaveBeenCalledWith(42);
        expect(
            screen.getByText(/YearSelector:.*"activeYear":2023.*"validYears":\[2022,2023,0\]/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerResults:.*"playerId":42.*"year":2023/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerPositions:.*"playerId":42.*"year":2023/s),
        ).toBeInTheDocument();
    });

    it('handles no active years', async () => {
        mockGetYearsActive([]);

        const element = await PlayerHistory({ playerId: 7, year: 2024 } as Props);
        render(<Wrapper>{element}</Wrapper>);

        await screen.findByText(/YearSelector/);

        expect(playerService.getYearsActive).toHaveBeenCalledWith(7);
        expect(
            screen.getByText(/YearSelector:.*"activeYear":2024.*"validYears":\[\]/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerResults:.*"playerId":7.*"year":2024/s),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/PlayerPositions:.*"playerId":7.*"year":2024/s),
        ).toBeInTheDocument();
    });
});
