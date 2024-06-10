import { render, screen } from '@testing-library/react';
import UserButton from 'components/UserButton/UserButton';
import { Wrapper } from "./lib/common";

describe('UserButton', () => {
    it('renders user name and email', () => {
        render(<Wrapper><UserButton /></Wrapper>);
        expect(screen.getByText('Harriette Spoonlicker')).toBeInTheDocument();
        expect(screen.getByText('hspoonlicker@outlook.com')).toBeInTheDocument();
    });

    it('renders user avatar', () => {
        render(<Wrapper><UserButton /></Wrapper>);
        const avatar = screen.getByRole('img');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute(
            'src',
            'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png'
        );
    });

    it('renders chevron icon', () => {
        render(<Wrapper><UserButton /></Wrapper>);
        const chevronIcon = screen.getByTestId('chevron-icon');
        expect(chevronIcon).toBeInTheDocument();
    });
});
