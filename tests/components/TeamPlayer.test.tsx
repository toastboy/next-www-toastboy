import { render, screen, waitFor } from '@testing-library/react';
import TeamPlayer from 'components/TeamPlayer/TeamPlayer';
import { Wrapper, loaderClass } from "./lib/common";

jest.mock('components/PlayerLink/PlayerLink');
jest.mock('components/PlayerMugshot/PlayerMugshot');
jest.mock('components/PlayerForm/PlayerForm');

describe('TeamPlayer', () => {
    const player = {
        id: 1,
        login: 'john_doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        born: new Date('1990-01-01'),
        isAdmin: null,
        firstName: "John",
        lastName: "Doe",
        anonymous: false,
        joined: null,
        finished: null,
        comment: null,
        introducedBy: null,
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders with data', async () => {
        const { container } = render(<Wrapper><TeamPlayer player={player} goalie={false} /></Wrapper>);

        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText('PlayerLink (idOrLogin: john_doe)')).toBeInTheDocument();
            expect(screen.getByText('PlayerMugshot (id: 1)')).toBeInTheDocument();
            expect(screen.getByText('PlayerForm (idOrLogin: john_doe, games: 10)')).toBeInTheDocument();
        });
    });

    it('renders with data + goalie', async () => {
        const { container } = render(<Wrapper><TeamPlayer player={player} goalie={true} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText('GOALIE!')).toBeInTheDocument();
        });
    });
});
