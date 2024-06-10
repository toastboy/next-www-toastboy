import { render, screen } from '@testing-library/react';
import PlayerProfile from 'components/PlayerProfile';
import { Wrapper } from "./lib/common";

describe('PlayerProfile', () => {
    const player = {
        id: 1,
        login: 'john_doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        born: new Date('1990-01-01'),
        is_admin: null,
        first_name: null,
        last_name: null,
        anonymous: null,
        joined: null,
        finished: null,
        comment: null,
        introduced_by: null,
    };

    it('renders player name', () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    it('renders player email', () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });

    it('renders player login', () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        expect(screen.getByText('john_doe')).toBeInTheDocument();
    });

    it('renders player birth date', () => {
        render(<Wrapper><PlayerProfile player={player} /></Wrapper>);
        expect(screen.getByText('1990-01-01')).toBeInTheDocument();
    });
});
