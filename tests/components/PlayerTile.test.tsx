import { render, screen, waitFor } from '@testing-library/react';
import PlayerTile from 'components/PlayerTile';
import { Wrapper } from "./lib/common";

describe('PlayerTile', () => {
    const player = {
        id: 1,
        login: 'john_doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        born: new Date('1990-01-01'),
        is_admin: null,
        first_name: "John",
        last_name: "Doe",
        anonymous: false,
        joined: null,
        finished: null,
        comment: null,
        introduced_by: null,
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders player unknown date of birth correctly', async () => {
        render(<Wrapper><PlayerTile player={{ ...player, born: null }} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText("Unknown")).toBeInTheDocument();
        });
    });

    it('renders player information correctly', async () => {
        render(<Wrapper><PlayerTile player={player} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText(`${player.first_name} ${player.last_name}`)).toBeInTheDocument();
            expect(screen.getByText(player.email)).toBeInTheDocument();
            expect(screen.getByText(player.login)).toBeInTheDocument();
            expect(screen.getByText(player.born.toLocaleDateString('sv'))).toBeInTheDocument();
        });
    });

    it('renders correct links', async () => {
        render(<Wrapper><PlayerTile player={player} /></Wrapper>);

        const profileLink = screen.getByRole('link', { name: `${player.first_name} ${player.last_name}` });
        const emailLink = screen.getByRole('link', { name: player.email });
        const loginLink = screen.getByRole('link', { name: player.login });

        await waitFor(() => {
            expect(profileLink).toHaveAttribute('href', `/footy/player/${player.login}`);
            expect(emailLink).toHaveAttribute('href', `/footy/player/${player.login}`);
            expect(loginLink).toHaveAttribute('href', `/footy/player/${player.login}`);
        });
    });
});
