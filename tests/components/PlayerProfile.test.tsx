import { act, render, screen, waitFor } from '@testing-library/react';
import PlayerProfile from 'components/PlayerProfile/PlayerProfile';
import { notFound } from 'next/navigation';
import { Wrapper } from "./lib/common";

jest.mock('components/PlayerMugshot/PlayerMugshot');
jest.mock('components/PlayerLastPlayed/PlayerLastPlayed');
jest.mock('components/PlayerClubs/PlayerClubs');
jest.mock('components/PlayerCountries/PlayerCountries');
jest.mock('components/PlayerArse/PlayerArse');
jest.mock('components/PlayerForm/PlayerForm');
jest.mock('components/PlayerYearsActive/PlayerYearsActive');
jest.mock('components/PlayerResults/PlayerResults');
jest.mock('components/PlayerPositions/PlayerPositions');

jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

describe('PlayerProfile', () => {
    const player = {
        id: 1,
        login: 'john_doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        born: new Date('1990-01-01'),
        isAdmin: null,
        firstName: null,
        lastName: null,
        anonymous: null,
        joined: null,
        finished: null,
        comment: null,
        introducedBy: null,
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns not found when active year is NaN', async () => {
        const { getByText } = render(<Wrapper><PlayerProfile player={player} /></Wrapper>);

        // Simulate changing activeYear to NaN via the mocked PlayerYearsActive component
        act(() => {
            getByText('Change Year to NaN').click();
        });

        await waitFor(() => {
            expect(notFound).toHaveBeenCalledTimes(1);
        });
    });

    it('renders player name', async () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
        });
    });

    it('renders player email', async () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        });
    });

    it('renders player login', async () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('john_doe')).toBeInTheDocument();
        });
    });

    it('renders player birth date', async () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('1990-01-01')).toBeInTheDocument();
        });
    });

    it('renders unknown player birth date', async () => {
        render(<Wrapper><PlayerProfile player={{ ...player, born: null }} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('Unknown')).toBeInTheDocument();
        });
    });
});
