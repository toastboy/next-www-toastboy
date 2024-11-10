import { render, screen, waitFor } from '@testing-library/react';
import UserButton from 'components/UserButton/UserButton';
import { Wrapper } from "./lib/common";

describe('UserButton', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders user name and email', async () => {
        render(<Wrapper><UserButton /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('Harriette Spoonlicker')).toBeInTheDocument();
            expect(screen.getByText('hspoonlicker@outlook.com')).toBeInTheDocument();
        });
    });

    it('renders user avatar', async () => {
        render(<Wrapper><UserButton /></Wrapper>);
        const avatar = screen.getByRole('img');
        await waitFor(() => {
            expect(avatar).toBeInTheDocument();
            expect(avatar).toHaveAttribute(
                'src',
                'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
            );
        });
    });

    it('renders chevron icon', async () => {
        render(<Wrapper><UserButton /></Wrapper>);
        const chevronIcon = screen.getByTestId('chevron-icon');
        await waitFor(() => {
            expect(chevronIcon).toBeInTheDocument();
        });
    });
});
