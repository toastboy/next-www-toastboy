import { render, screen } from '@testing-library/react';
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

    it('renders player information correctly', () => {
        render(<Wrapper><PlayerTile player={player} /></Wrapper>);

        expect(screen.getByText(`${player.first_name} ${player.last_name}`)).toBeInTheDocument();
        expect(screen.getByText(player.email)).toBeInTheDocument();
        expect(screen.getByText(player.login)).toBeInTheDocument();
        expect(screen.getByText(player.born.toLocaleDateString('sv'))).toBeInTheDocument();
    });

    it('renders correct links', () => {
        render(<Wrapper><PlayerTile player={player} /></Wrapper>);

        const profileLink = screen.getByRole('link', { name: `${player.first_name} ${player.last_name}` });
        const emailLink = screen.getByRole('link', { name: player.email });
        const loginLink = screen.getByRole('link', { name: player.login });

        expect(profileLink).toHaveAttribute('href', `/footy/player/${player.login}`);
        expect(emailLink).toHaveAttribute('href', `/footy/player/${player.login}`);
        expect(loginLink).toHaveAttribute('href', `/footy/player/${player.login}`);
    });
});
